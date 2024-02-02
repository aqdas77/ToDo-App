const mongoose= require("mongoose")


const taskSchema= new mongoose.Schema({
    taskTitle : {type : String, required: true},
    taskDetail: {type: String, required:true},
    taskDeadline : {type : Date, required: true},
    completed : {type : Boolean,default: false}
})


const Task = mongoose.model("Task", taskSchema);

module.exports = { Task };