const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        default: function() {
            // Function to generate a random hex color
            return '#' + Math.floor(Math.random()*16777215).toString(16);
        }
    },
    busy: [{
        start: {
            type: Date,
        },
        end: {
            type: Date,
        }
    }]
});

const Employee = mongoose.model('Employees', EmployeeSchema);

module.exports = Employee;