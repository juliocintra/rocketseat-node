const mongoose = require('../../db');
// const bcrypt = require('bcryptjs');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    createAt: {
        type: Date,
        dafault: Date.now()
    }
});


const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;