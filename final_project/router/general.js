const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let {getBooks} = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
	const username = req.body.username;
	const password = req.body.password;

	// Check if both username and password are provided
	if (username && password) {
		// Check if the user does not already exist
		if (isValid(username)) {
			// Add the new user to the users array
			users.push({"username": username, "password": password});
			return res.status(200).json({message: "User successfully registered. Now you can login"});
		} else {
			return res.status(404).json({message: "User already exists!"});
		}
	}
	// Return error if username or password is missing
	return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
	getBooks.then((asyncBooks) =>{
		return res.status(200).json(asyncBooks);
	})
	.catch((err) => {
		return res.status(400).json(err);
	});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
	const isbn = Number(req.params.isbn);
	let book = {};
	getBooks.then((asyncBooks) =>{
		if(asyncBooks[isbn]){
			book[isbn] = asyncBooks[isbn];
			return res.status(200).json(book);
		}
		else{
			return res.status(404).json({message: "No Book Found"});
		}
	})
	.catch((err) => {
		return res.status(400).json(err);
	});
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
	const author = req.params.author;
	const details = {};
	
	getBooks.then((asyncBooks) =>{
		for(const [key, value] of Object.entries(asyncBooks)){
			if(value.author === author){
				details[key] = value;
			}
		}
		if(Object.keys(details).length !== 0){
			return res.status(200).json(details);
		}
		else{
			return res.status(404).json({message: "No Books Found"});
		}
	})
	.catch((err) => {
		return res.status(400).json(err);
	});

	
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
	const title = req.params.title;
	const details = {};

	getBooks.then((asyncBooks) =>{
		for(const [key, value] of Object.entries(asyncBooks)){
			if(value.title === title){
				details[key] = value;
			}
		}
		if(Object.keys(details).length !== 0){
			return res.status(200).json(details);
		}
		else{
			return res.status(404).json({message: "No Books Found"});
		}
	})
	.catch((err) => {
		return res.status(400).json(err);
	});

	
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
	const isbn = Number(req.params.isbn);
	let reviews = {};
	getBooks.then((asyncBooks) =>{
		if(asyncBooks[isbn]){
			reviews[isbn] = asyncBooks[isbn].reviews;
			return res.status(200).json(reviews);
		}
		else{
			return res.status(404).json({message: "No Book Found"});
		}
	})
	.catch((err) => {
		return res.status(400).json(err);
	});	
});

module.exports.general = public_users;
