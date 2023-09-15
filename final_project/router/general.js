const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

  const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //res.send(JSON.stringify(books, null, 4));
  //return res.status(300).json({message: "Yet to be implemented"});

  const bookList = new Promise((resolve, reject) => {
      try {
          const data = JSON.stringify(books,  null, 4);
          resolve(data);
      } catch(err) {
          reject(err)
      }
  });
  bookList.then(
      (data) => res.send(data),
      (err) => res.send("Error!")
  );
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //const isbn = req.params.isbn;
  //res.send(books[isbn])
  //return res.status(300).json({message: "Yet to be implemented"});
  const bookList = new Promise((resolve, reject) => {
    try {
        const isbn = req.params.isbn;
        const data = books[isbn];
        resolve(data);
    } catch(err) {
        reject(err)
    }
});
bookList.then(
    (data) => res.send(data),
    (err) => res.send("Error!")
);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  /*const author = req.params.author;
  var filtered = Object.keys(books).reduce(function (filtered, key) {
      if (books[key]["author"] == author) filtered[key] = books[key];
      return filtered;
  }, {});
  res.send(filtered)*/
  //return res.status(300).json({message: "Yet to be implemented"});
  const bookList = new Promise((resolve, reject) => {
    try {
        const author = req.params.author;
        var filtered = Object.keys(books).reduce(function (filtered, key) {
            if (books[key]["author"] == author) filtered[key] = books[key];
            return filtered;
        }, {});
        const data = filtered;
        resolve(data);
    } catch(err) {
        reject(err)
    }
});
bookList.then(
    (data) => res.send(data),
    (err) => res.send("Error!")
);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  /*const title = req.params.title;
  var filtered = Object.keys(books).reduce(function (filtered, key) {
      if (books[key]["title"] == title) filtered[key] = books[key];
      return filtered;
  }, {});
  res.send(filtered)*/
  //return res.status(300).json({message: "Yet to be implemented"});
  const bookList = new Promise((resolve, reject) => {
    try {
        const title = req.params.title;
        var filtered = Object.keys(books).reduce(function (filtered, key) {
            if (books[key]["title"] == title) filtered[key] = books[key];
            return filtered;
        }, {});
        const data = filtered;
        resolve(data);
    } catch(err) {
        reject(err)
    }
});
bookList.then(
    (data) => res.send(data),
    (err) => res.send("Error!")
);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"])
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
