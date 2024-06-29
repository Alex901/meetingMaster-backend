const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new mongoose.Schema({
    legacyId: { 
        type: String 
    },
    name: {
        type: String,
    },
    color: {
        type: String,
        default: function () {
            return '#' + (Math.floor(Math.random() * 16777215).toString(16)).padStart(6, '0');
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
// Give a name to employees that are created without one
EmployeeSchema.pre('save', async function (next) {
    try {
        if (!this.name) {
            const users = await this.constructor.find({
                name: /^NE\d+$/
            });

            // Extract numbers, sort them, and find the smallest missing number
            const numbers = users.map(user => parseInt(user.name.replace('NE', ''), 10)).sort((a, b) => a - b);
            let newUserNumber = 1; // Start from 1
            for (let i = 0; i < numbers.length; i++) {
                if (numbers[i] > newUserNumber) {
                    break; // Found a gap
                }
                newUserNumber = numbers[i] + 1; // No gap, move to the next number
            }

            this.name = `NE${newUserNumber}`;
        }
        next();
    } catch (error) {
        next(error);
    }
});

EmployeeSchema.methods.addBusyTime = function(startTime, endTime) {
    this.busy.push({ start: startTime, end: endTime });
    // Note: You might want to call this.save() here or outside this method depending on your use case
};

const Employee = mongoose.model('Employees', EmployeeSchema);

module.exports = Employee;