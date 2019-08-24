const mongoose = require('../../db');
// const bcrypt = require('bcryptjs');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        require: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    completed: {
        type: Boolean,
        require: true,
        default: false
    },
    createAt: {
        type: Date,
        dafault: Date.now()
    }
});


const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;