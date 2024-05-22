const logoutBtn = document.querySelector("#logoutBtn");
const loggedInContainer = document.querySelector(".logged-in-container");

let addReadingListBtn = document.createElement("button");
addReadingListBtn.textContent = "add to readinglist";


document.querySelector("#welcome").innerText = `Welcome back, ${
    JSON.parse(sessionStorage.getItem("user")).username
  } !`;


let logout = () => {
    sessionStorage.clear();
    window.location.href = "./startsida.html";
    renderPage();
  };

  logoutBtn.addEventListener("click", logout);

  let getDataAndDisplay = async () => {
    
    try {
        let response = await fetch("http://localhost:1337/api/books?populate=deep,3");
        let data = await response.json();

        
        console.log(data.data);
        

        // Loopa igenom varje bok i datan och skapa en <li> (list item) för varje bok
        data.data.forEach(book => { 

            let booksDiv = document.createElement("div");


            let picture = document.createElement("img");
            picture.src =  `http://localhost:1337${book.attributes.picture.data[0].attributes.url}`;
            picture.textContent = `${book.attributes.picture}`;
            picture.classList.add("book-image");

            let titel = document.createElement('h3');
            titel.textContent = `${book.attributes.Titel}`

            let author = document.createElement("p");
            author.textContent = `Author: ${book.attributes.Author}`;

            let pages = document.createElement("p");
            pages.textContent = `Pages: ${book.attributes.pages}`;

            let published = document.createElement("p");
            published.textContent = `Published: ${book.attributes.published}`

            let addReadingListBtn = document.createElement("button");
            addReadingListBtn.textContent = "add to readinglist";
            addReadingListBtn.dataset.bookId = book.id;

            booksDiv.classList.add("booksDivs");

            booksDiv.appendChild(picture);
            booksDiv.appendChild(titel);
            booksDiv.appendChild(author);
            booksDiv.appendChild(pages);
            booksDiv.appendChild(published);
            booksDiv.appendChild(addReadingListBtn);
            // Lägg till <li> till <ul>
            

    loggedInContainer.appendChild(booksDiv);
    

    

    addReadingListBtn.addEventListener("click", async () => {
        try {
            let user = JSON.parse(sessionStorage.getItem("user"));
            console.log("Current user:", user);
            
            let bookArray = [];
            bookArray.push(book);
            console.log("Current book to add:", book);
    
            let getList = await axios.get(
                "http://localhost:1337/api/readlists?populate=*",
                {
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                  },
                }
            );
            console.log("Fetched reading lists:", getList);
    
            if (getList.data.data.length === 0) {
                throw new Error("No reading list found.");
            }
    
            let readinglistId = getList.data.data[0].id;
            console.log("Reading list ID:", readinglistId);
    
            let myList = await axios.get(
                `http://localhost:1337/api/readlists/${readinglistId}?populate=*`,
                {
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                  },
                }
            );
            console.log("Fetched reading list details:", myList);
    
            let existingBooks = myList.data.data.attributes.books.data.map(b => b.id);
            console.log("Existing book IDs in reading list:", existingBooks);
    
            // Add the new book to the existing list of book IDs if not already present
            if (!existingBooks.includes(book.id)) {
                existingBooks.push(book.id);
            }
            console.log("Updated book IDs to be saved:", existingBooks);
    
            let addReadinglist = await axios.put(
                `http://localhost:1337/api/readlists/${readinglistId}`,
                {
                    data: {
                        user: user.id,
                        readlist: "nyLista",
                        books: existingBooks,
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    }
                }
            );
            console.log("Updated reading list response:", addReadinglist);
    
        } catch (error) {
            console.error("Ett fel uppstod vid hämtning av data:", error);
        }
    });

        });
        
        // Lägg till <ul> till DOM:en (t.ex. en <div> med id "books-container")
        
    } catch (error) {
        console.error("Ett fel uppstod vid hämtning av data:", error);
    }
};
getDataAndDisplay();


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