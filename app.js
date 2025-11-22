import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

// ----------------------------
// MONGODB CONNECTION
// ----------------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/mydatabase")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ----------------------------
// SCHEMA & MODEL
// ----------------------------
const studentSchema = new mongoose.Schema({
  name: String,
  course: String,
  year: Number,
});

const Student = mongoose.model("Student", studentSchema);

// ----------------------------
// ROUTES
// ----------------------------

// Create student (POST)
app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    const result = await student.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all students (GET)
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Get one student by ID (GET)
app.get("/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Not found" });
    res.json(student);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// Update student (PUT)
app.put("/students/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete student (DELETE)
app.delete("/students/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Student deleted", deleted });
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// ----------------------------
// SERVER
// ----------------------------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
