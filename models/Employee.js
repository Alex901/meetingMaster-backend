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

EmployeeSchema.pre('save', async function (next) {
    try {
        if (!this.name) {
            const lastNewUser = await this.constructor.findOne({
                name: /^New User \d+$/
            }).sort({ name: -1 });

            let newUserNumber = 1;
            if (lastNewUser) {
                const lastNumber = parseInt(lastNewUser.name.replace('New User ', ''));
                if (!isNaN(lastNumber)) {
                    newUserNumber = lastNumber + 1;
                }
            }

            this.name = `New User ${newUserNumber}`;
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