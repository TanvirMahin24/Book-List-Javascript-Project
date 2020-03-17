//Book Constructor
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}
//UI constructor
function UI() {}
//Show alert function
UI.prototype.showAlert = (msg,type)=>{
    //Create the new div alert
  const div = document.createElement('div');
  div.className = `alert ${type}`;
  div.appendChild(document.createTextNode(msg));
  //select parent element
  const container = document.querySelector('.container');
  //select element to position the new div
  const form = document.querySelector('#book-form');
  //Insert div
    container.insertBefore(div,form);
    //Set timeout
    setTimeout(()=>{
        document.querySelector('.alert').remove();
    },3000)
};

//Local Storage implementation with ES6 classes
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static displayBooks(){
        const books = Store.getBooks();
        books.forEach((book)=>{
            const ui = new UI();
            //add each book to the dom
            ui.addBookToList(book);
        })
    }
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }
    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book,index)=>{
            if(book.isbn === isbn){
                books.splice(index,1)
            }
        });
        localStorage.setItem('books',JSON.stringify(books));
    }
}
//UI prototype function added
UI.prototype.addBookToList = (book)=>{
    const list = document.getElementById('book-list');
    //Create HTML element
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">x</a></td>
    `;
    list.appendChild(row);
};
//UI clear fields
UI.prototype.clearInput = ()=>{
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
};
UI.prototype.deelteBook = (target)=>{
  if(target.className === 'delete'){
      target.parentElement.parentElement.remove();
  }
  return true;
};
//DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);
//Events Listener
document.getElementById('book-form').addEventListener('submit',(e)=>{
    //Get the form values
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;
    //Create a book object
    const book = new Book(title,author,isbn);
    //Create a ui object
    const ui = new UI();
    //Validation
    if(title === '' || author ==='' || isbn ===''){
        //dynamic alert
        ui.showAlert('Please fill all the fields', 'error');
    }
    else{
        //add book to list
        ui.addBookToList(book);
        //Add book to Local Storage
        Store.addBook(book);
        //Success alert
        ui.showAlert("New Book Added", 'sucess');
        //Clear the input fields
        ui.clearInput();
    }
    e.preventDefault();
});

//Delete event deligation
document.getElementById('book-list').addEventListener('click',(e)=>{
    //Create a ui object
    const ui = new UI();
    //Delete the book
    let flag = ui.deelteBook(e.target);
    if(flag === true){
        //Show alert
        ui.showAlert('Book Deleted Successfully','error');
    }
    //Remove from the Local Storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    e.preventDefault();
});