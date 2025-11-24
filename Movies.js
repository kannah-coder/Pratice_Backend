const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ------------------
// 1. MongoDB Connect
// ------------------
mongoose.connect("mongodb://127.0.0.1:27017/moviesystem")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// ------------------
// 2. Movie Schema
// ------------------
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: String,
    rating: Number,
    releaseYear: Number,
});

const Movie = mongoose.model("Movie", movieSchema);

// ------------------
// 3. API Routes
// ------------------

// ADD MOVIE (POST)
app.post("/movies", async (req, res) => {
    try {
        const movie = new Movie(req.body);
        const saved = await movie.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET ALL MOVIES (GET)
app.get("/movies", async (req, res) => {
    const movies = await Movie.find();
    res.json(movies);
});

// GET ONE MOVIE BY ID (GET)
app.get("/movies/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: "Movie not found" });
        res.json(movie);
    } catch (err) {
        res.status(400).json({ error: "Invalid ID" });
    }
});

// UPDATE MOVIE (PATCH)
app.patch("/movies/:id", async (req, res) => {
    try {
        const updated = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: "Invalid ID" });
    }
});

// DELETE MOVIE (DELETE)
app.delete("/movies/:id", async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.json({ message: "Movie deleted" });
    } catch (err) {
        res.status(400).json({ error: "Invalid ID" });
    }
});

// ------------------
// 4. Server Start
// ------------------
app.listen(3000, () => console.log("Server running on port 3000"));
