
async function displayReadingList() {
    try {
        let getList = await axios.get(
            "http://localhost:1337/api/readlists?populate=*",
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                },
            }
        );

        if (getList.data.data.length === 0) {
            throw new Error("No reading list found.");
        }

        let readinglistId = getList.data.data[0].id;
    

        let myList = await axios.get(
            `http://localhost:1337/api/readlists/${readinglistId}?populate=*`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                },
            }
        );

        let books = myList.data.data.attributes.books.data;

        // Display books function
        displayBooks(books);

    } catch (error) {
        console.error("An error occurred while fetching the reading list:", error);
    }
}

// Function to display books
function displayBooks(books) {
    // Clear existing content
    const readinglistContainer = document.querySelector(".readingList-container");
    readinglistContainer.innerHTML = "";

    // Generate HTML for each book and append to container
    books.forEach(book => {
        let booksDiv = document.createElement("div");
        let titel = document.createElement('h3');
        titel.textContent = `${book.attributes.Titel}`;
        let author = document.createElement("p");
        author.textContent = `Author: ${book.attributes.Author}`;
        let pages = document.createElement("p");
        pages.textContent = `Pages: ${book.attributes.pages}`;
        let published = document.createElement("p");
        published.textContent = `Published: ${book.attributes.published}`;
        let removeReadingListBtn = document.createElement("button");
        removeReadingListBtn.textContent = "Remove from readinglist";
        removeReadingListBtn.dataset.bookId = book.id;
        
       
        
        removeReadingListBtn.addEventListener("click", () => removeBookFromList(book.id))
        console.log("Book ID:", book.id); //

        booksDiv.classList.add("booksDivs");
        booksDiv.appendChild(titel);
        booksDiv.appendChild(author);
        booksDiv.appendChild(pages);
        booksDiv.appendChild(published);
        booksDiv.appendChild(removeReadingListBtn);
        readinglistContainer.appendChild(booksDiv);
    });
}

// Function to remove a book from the reading list
async function removeBookFromList(readinglistId, bookId) {
    try {
        // Make API call to remove the book from the reading list
        const response = await axios.delete(
            `http://localhost:1337/api/readlists/${readinglistId}/books/${bookId}`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                }
            }
        );
        // If successful, refresh the reading list
        displayReadingList();
    } catch (error) {
        console.error("An error occurred while removing the book from the reading list:", error);
    }
}



// Call the function to display the reading list when the page loads
window.addEventListener("load", displayReadingList);

// Event listeners for sorting
document.getElementById("sort-title").addEventListener("click", async function() {
    let sortedBooks = await sortBooks('Titel');
    displayBooks(sortedBooks);
});

document.getElementById("sort-author").addEventListener("click", async function() {
    let sortedBooks = await sortBooks('Author');
    displayBooks(sortedBooks);
});

// Function to sort books by title or author
async function sortBooks(property) {
    try {
        let getList = await axios.get(
            "http://localhost:1337/api/readlists?populate=*",
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                },
            }
        );

        if (getList.data.data.length === 0) {
            throw new Error("No reading list found.");
        }

        let readinglistId = getList.data.data[0].id;

        let myList = await axios.get(
            `http://localhost:1337/api/readlists/${readinglistId}?populate=*`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                },
            }
        );

        let books = myList.data.data.attributes.books.data;

        // Sort books
        books.sort((a, b) => {
            if (a.attributes[property] < b.attributes[property]) {
                return -1;
            }
            if (a.attributes[property] > b.attributes[property]) {
                return 1;
            }
            return 0;
        });

        return books;

    } catch (error) {
        console.error("An error occurred while sorting the reading list:", error);
    }
}

let getThemes = async () => {
    let response = await axios.get("http://localhost:1337/api/theme");
    console.log(response);
    let myThemes = response.data.data.attributes.theme;
    console.log(myThemes);

    if (myThemes === "blue") {
     document.body.style.backgroundImage = "linear-gradient(blue, purple)";
    
     
 
     
    } else if (myThemes === "dark") {
        document.body.style.backgroundColor = "Black"
     
    }
    else if (myThemes === "green"){

        // document.body.style.backgroundColor = "white"
        document.body.style.backgroundColor = "darkolivegreen";

        let allBooks = document.querySelectorAll(".booksDivs");
        allBooks.forEach((book) => {
            book.style.color = "black";
        });
        
 
    }
 }
 getThemes();