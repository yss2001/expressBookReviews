const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];

const isValid = (username)=>{ //returns boolean
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

regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if (req.session.authorization) {
      var un = req.session.authorization.username;
      var isbn = req.params.isbn;
      var rws = books[isbn]["reviews"];
      rws[un] = req.body.content;
      books[isbn]["reviews"] = rws;
      res.send(books[isbn]);
  }
  else
  res.send('Error in updating review!')
  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    if (req.session.authorization) {
        var un = req.session.authorization.username;
        var isbn = req.params.isbn;
        var rws = books[isbn]["reviews"];
        delete rws[un];
        books[isbn]["reviews"] = rws;
        res.send(books[isbn]);
    }
    else
    res.send('error in deleting review!')
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
