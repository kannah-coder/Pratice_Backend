import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

 
mongoose.connect("mongodb://127.0.0.1:27017/studentcourse");
 
const studentSchema = new mongoose.Schema({
  name: String,
  course: String,
  year: Number,
});

const Student = mongoose.model("Student", studentSchema);

/* ------------------- CRUD ROUTES ------------------- */
// SEED ROUTE - Insert sample students
app.get("/api/seed", async (req, res) => {
  const sampleStudents = [
    { name: "Alice Johnson", course: "BCA", year: 1 },
    { name: "Rahul Sharma", course: "BSc", year: 2 },
    { name: "Meena Devi", course: "BCom", year: 3 },
    { name: "David Miller", course: "BCA", year: 2 },
    { name: "Sneha Rao", course: "BSc", year: 1 },
    { name: "Kiran Patel", course: "BCom", year: 3 }
  ];

  try {
    await Student.insertMany(sampleStudents);
    res.send("✅ Sample Students Inserted Successfully");
  } catch (err) {
    res.status(500).send("❌ Error Seeding Data: " + err.message);
  }
});



// CREATE - Add a single student
app.post("/students", async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.send("Student Registered Successfully ✅");
});

// CREATE MANY - Register multiple students at once
app.post("/students/bulk", async (req, res) => {
  await Student.insertMany(req.body);
  res.send("Multiple Students Registered ✅");
});

// READ - Find all students
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// READ - Find one student by ID
app.get("/students/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.json(student);
});

// READ - Find students by course
app.get("/students/course/:course", async (req, res) => {
  const result = await Student.find({ course: req.params.course });
  res.json(result);
});

// UPDATE ONE - Update a student's details by ID
app.put("/students/:id", async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});n 

// UPDATE MANY - Update all students in a course
app.put("/students/course/:course", async (req, res) => {
  const updated = await Student.updateMany(
    { course: req.params.course },
    { $set: req.body }
  );
  res.json(updated);
});

// DELETE ONE - Remove a student by ID
app.delete("/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.send("Student Deleted Successfully ❌");
});

// DELETE MANY - Remove all students in a specific course
app.delete("/students/course/:course", async (req, res) => {
  await Student.deleteMany({ course: req.params.course });
  res.send("All Students in Course Deleted ❌");
});



app.listen(3002, () => console.log("Server running on PORT 3002")); 
