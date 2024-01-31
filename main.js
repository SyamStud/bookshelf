const judul = document.getElementById("inputBookTitle");
const penulis = document.getElementById("inputBookAuthor");
const tahun = document.getElementById("inputBookYear");
const selesai = document.getElementById("inputBookIsComplete");
const submit = document.getElementById("bookSubmit");
const search = document.getElementById("searchBookTitle");
const searchSubmit = document.getElementById("searchSubmit");

const localBook = "LOCAL_BOOKSHELF";

function checkForStorage() {
  return typeof Storage !== "undefined";
}

function addBook(data) {
  if (checkForStorage()) {
    let books = [];

    if (localStorage.getItem(localBook) !== null) {
      books = JSON.parse(localStorage.getItem(localBook));
    }

    books.unshift(data);
    if (books.length > 5) {
      books.pop();
    }

    localStorage.setItem(localBook, JSON.stringify(books));
  } else {
    alert("Browser tidak mendukung Web Storage");
  }
}

function makeBook(title, author, year, isComplete) {
  const book = document.createElement("article");
  book.classList.add("book_item");

  const bookTitle = document.createElement("h3");
  bookTitle.innerText = title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = "Penulis: " + author;

  const bookYear = document.createElement("p");
  bookYear.innerText = "Tahun: " + year;

  const bookStatus = document.createElement("div");
  bookStatus.classList.add("action");

  const statusText = document.createElement("button");
  statusText.classList.add("green");
  statusText.innerText = isComplete ? "Selesai dibaca" : "Belum selesai dibaca";
  bookStatus.appendChild(statusText);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("red");
  deleteButton.id = "deleteButton";
  deleteButton.innerText = "Hapus buku";
  bookStatus.appendChild(deleteButton);

  book.appendChild(bookTitle);
  book.appendChild(bookAuthor);
  book.appendChild(bookYear);
  book.appendChild(bookStatus);

  return book;
}

function getBook() {
  if (checkForStorage()) {
    return JSON.parse(localStorage.getItem(localBook)) || [];
  } else {
    return [];
  }
}

function showBook() {
  const books = getBook();
  let inComplete = document.getElementById("incompleteBookshelfList");
  let complete = document.getElementById("completeBookshelfList");

  inComplete.innerHTML = "";
  complete.innerHTML = "";
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const newBook = makeBook(
      book.title,
      book.author,
      book.year,
      book.isComplete
    );

    const statusText = newBook.querySelector(".green");
    statusText.addEventListener("click", function () {
      changeStatus(i);
      showBook();
    });

    const deleteButton = newBook.querySelector("#deleteButton");
    deleteButton.addEventListener("click", function () {
      deleteBook(i);
      showBook();
    });

    if (book.isComplete === true) {
      complete.append(newBook);
    } else {
      inComplete.append(newBook);
    }
  }
}

function changeStatus(index) {
  const books = getBook();
  books[index].isComplete = !books[index].isComplete;
  localStorage.setItem(localBook, JSON.stringify(books));
}

function deleteBook(index) {
  const books = getBook();
  books.splice(index, 1);
  localStorage.setItem(localBook, JSON.stringify(books));
}

function searchBook() {
  const searchTerm = search.value.toLowerCase();
  const books = getBook();
  let inComplete = document.getElementById("incompleteBookshelfList");
  let complete = document.getElementById("completeBookshelfList");

  inComplete.innerHTML = "";
  complete.innerHTML = "";
  for (let i = 0; i < books.length; i++) {
    const book = books[i];

    if (book.title.toLowerCase().includes(searchTerm)) {
      const newBook = makeBook(
        book.title,
        book.author,
        book.year,
        book.isComplete
      );

      const statusText = newBook.querySelector(".green");
      statusText.addEventListener("click", function () {
        changeStatus(i);
        showBook();
      });

      const deleteButton = newBook.querySelector("#deleteButton");
      deleteButton.addEventListener("click", function () {
        deleteBook(i);
        showBook();
      });

      if (book.isComplete === true) {
        complete.append(newBook);
      } else {
        inComplete.append(newBook);
      }
    }
  }
}

submit.addEventListener("click", function (event) {
  const inputJudul = document.getElementById("inputBookTitle").value;
  const inputPenulis = document.getElementById("inputBookAuthor").value;
  const inputTahun = document.getElementById("inputBookYear").value;
  const inputSelesai = document.getElementById("inputBookIsComplete").checked;

  const book = {
    id: +new Date(),
    title: inputJudul,
    author: inputPenulis,
    year: parseInt(inputTahun),
    isComplete: inputSelesai,
  };

  addBook(book);
  showBook();
});

searchSubmit.addEventListener("click", function (event) {
  event.preventDefault();
  searchBook();
});

window.addEventListener("load", function () {
  if (checkForStorage()) {
    if (localStorage.getItem(localBook) !== null) {
      showBook();
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});
