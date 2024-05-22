const loginUser = document.querySelector("#loginUser");
const loginPassword = document.querySelector("#loginPassword");
const loginBtn = document.querySelector("#loginBtn");

//Register
const registerUsername = document.querySelector("#registerUsername");
const registerUserEmail = document.querySelector("#registerUserEmail");
const registerUserPassword = document.querySelector("#registerPassword");
const registerBtn = document.querySelector("#registerBtn");


const booksContainer = document.querySelector(".books-container");


let getDataAndDisplay = async () => {
    console.log(booksContainer);
    try {
        let response = await fetch("http://localhost:1337/api/books?populate=deep,3");
        let data = await response.json();

        
        console.log(data.data);
        let isLoggedIn = await checkIfLoggedIn();

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

            booksDiv.classList.add("booksDivs");

            
            
            booksDiv.appendChild(picture);
            booksDiv.appendChild(titel);
            booksDiv.appendChild(author);
            booksDiv.appendChild(pages);
            booksDiv.appendChild(published);
            
            console.log(isLoggedIn);
if (isLoggedIn) {
    loggedInContainer.appendChild(booksDiv);
    
} else {
    
    booksContainer.appendChild(booksDiv);
}

        });
        
       
        
    } catch (error) {
        console.error("Ett fel uppstod vid hämtning av data:", error);
    }
};
getDataAndDisplay();

let register = async () => {
    console.log("Registering user!");

    let response = await axios.post(
        "http://localhost:1337/api/auth/local/register",
        {
          username: registerUsername.value,
          email: registerUserEmail.value,
          password: registerUserPassword.value,
        }
      );
      console.log(response);
      let addReadinglist =  await axios.post("http://localhost:1337/api/readlists",
        {
            data: {
                user: response.data.user.id,
                readlist: "myReadlist",
                books: [],
                

            }
        },
        {
            headers: {
                Authorization: `Bearer ${response.data.jwt}`,

            }
        }
        ); 

    };

registerBtn.addEventListener("click", register);

let login = async () => {
    console.log("Logging in...");

    let response = await axios.post("http://localhost:1337/api/auth/local/", {
    identifier: loginUser.value,
    password: loginPassword.value,
  });

  if (response.status === 200) {
    window.location.href = "./hemsida.html";
}
  console.log(response.data);
  sessionStorage.setItem("token", response.data.jwt);
  sessionStorage.setItem("user", JSON.stringify(response.data.user));
  renderPage();

};


loginBtn.addEventListener("click", login);


let checkIfLoggedIn = async () => {
    let status = sessionStorage.getItem("token") ? true : false;
    return status;
    
    }
  

  let renderPage = async () => {
    let isLoggedIn = await checkIfLoggedIn();
    if (isLoggedIn) {
        
        document.querySelector("#welcome-page h2").innerText = `Welcome back, ${
            JSON.parse(sessionStorage.getItem("user")).username
          } !`;
        
        console.log("is logged in");
        console.log(isLoggedIn);
         getDataAndDisplay();
    }
    else {
       
        console.log("please log in");
    }
    
    }
  
  
  renderPage();
  
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



