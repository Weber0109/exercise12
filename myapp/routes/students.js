const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
//connect to local
//mongoose.connect("mongodb://localhost:27017/students");
//connect to cloud
mongoose.connect("mongodb+srv://weber:weber1689@cluster0.qpho4.mongodb.net/stduentInfo?retryWrites=true&w=majority&appName=Cluster0");

const db = mongoose.connection;

// 與資料庫連線發生錯誤時
db.on('error', console.error.bind(console, 'Connection fails!'));

// 與資料庫連線成功連線時
db.once('open', function () {
    console.log('Connected to database...');
});

// 該collection的格式設定
const studentSchema = new mongoose.Schema({
    name: { 
        type: String, //設定該欄位的格式
        required: true //設定該欄位是否必填
    },
    age: { 
        type: Number,
        required: true,
    },
    grade: { 
        type: String,
        required: true
    },
})
const Student = mongoose.model("Student",studentSchema);

router.get("/", async(req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

router.post("/", async(req, res) =>{
    const student = new Student({
        name: req.body.name,
        age: req.body.age,
        grade: req.body.grade
    });
    try{
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    }
    catch(err){
        res.status(400).json({ message: err.message });
    }
});

router.delete("/:id", async(req, res) =>{
    try{
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: "remove successfully!"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: "remove todo failed!" });
    }
});
router.put("/:id", async(req, res) =>{
    try{
        const newStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true});
        res.json(newStudent);
    }
    catch(err){
        res.status(500).json({ message: "update todo failed!" });
    }
});
module.exports = router;