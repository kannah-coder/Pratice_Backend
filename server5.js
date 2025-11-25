// Simple Practice Backend (Node.js + Express)
// Save this as server.js and run with: node server.js

const express = require('express');
const app = express();
app.use(express.json());

// In‑memory data
let books = [
  { id: 1, title: "Harry Potter", author: "J.K. Rowling" },
  { id: 2, title: "Atomic Habits", author: "James Clear" }
];

// ROUTES
// Home
app.get('/', (req, res) => {
  res.send({ message: "Backend Practice API Running!" });
});

// Get all books
app.get('/books', (req, res) => {
  res.send(books);
});

// Add a book
app.post('/books', (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author
  };
  books.push(newBook);
  res.send(newBook);
});

// Update entire book (PUT)
app.put('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let book = books.find(b => b.id === id);
  if (!book) return res.status(404).send({ error: "Book not found" });

  book.title = req.body.title;
  book.author = req.body.author;
  res.send(book);
});

// Partial update (PATCH)
app.patch('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let book = books.find(b => b.id === id);
  if (!book) return res.status(404).send({ error: "Book not found" });

  if (req.body.title) book.title = req.body.title;
  if (req.body.author) book.author = req.body.author;

  res.send(book);
});

// Delete a book
app.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  books = books.filter(b => b.id !== id);
  res.send({ message: "Book deleted" });
});

// Server start
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
