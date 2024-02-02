const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const {Task} = require('../models/task')
const jwt = require("jsonwebtoken");



router.post("/create-task", async (req, res) => {
  try {
    const token = req.header("token");
    if (!token) {
      return res.status(401).json({ error: "Token is missing" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: "Something went wrong!" });
    }
    
    const task = new Task(req.body);
    await task.save();
    user.tasks.push(task._id);
    await user.save();
   
    res.status(200).json({ message: "Task created successfully", task });
   
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

router.get("/", async (req, res) => {
  try {
    const token = req.header("token");
    if (!token) {
      return res.status(401).json({ error: "Token is missing" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const email = decodedToken.email;
  
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const tasks = await Task.find({ _id: { $in: user.tasks } });
  
    // console.log(tasks)
    res.status(200).json({ message: "Task created successfully", tasks });
    
  } catch (error) {
    console.log(error);
  }
});

router.put('/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const updatedTaskData = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, {
      new: true, 
    });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:taskId', async (req, res) => {
  try {
   
    const taskId = req.params.taskId;
    const deletedTask = await Task.findOneAndDelete({ _id: taskId });;

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
