const express = require('express');
const Employee = require('../models/Employee');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/addEmployee', async (req, res) => {
    try {
        // Check if employee with this ID already exists
        const employeeData = req.body;
        const existingEmployee = await Employee.findById(employeeData._id);
        if (existingEmployee) {
            return res.status(409).json({ message: 'Employee with this ID already exists' });
        }
        const newEmployee = new Employee(employeeData);
        await newEmployee.save();
        res.status(201).json({ message: 'Employee added successfully', newEmployee });
    } catch (error) {
        res.status(400).json({ message: 'Error adding employee', error: error.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await Employee.deleteOne({ _id: id });
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
});

router.get('/getEmployees', async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.status(200).json({ employees });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
    }
});

router.post('/:_id/set-busy', async (req, res) => {
    const { _id } = req.params;
    const { busyTimes } = req.body;

    try {
        const employee = await Employee.findById(_id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.busy = [...employee.busy, ...busyTimes];

        await employee.save();

        res.status(200).json({ message: 'Busy times added successfully', employee });
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee busy times', error: error.message });
    }
});

router.put('/:_id/rename', async (req, res) => {
    console.log('DEBUG: Request recieved to rename employee');
    const { _id } = req.params;
    const { newName } = req.body;

    if (!newName) {
        return res.status(400).json({ message: 'New name is required' });
    }

    try {
        const employee = await Employee.findById(_id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.name = newName;
        await employee.save();

        res.status(200).json({ message: 'Employee name updated successfully', employee });
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee name', error: error.message });
    }
});

router.get('/checkEmployee/:_id', async (req, res) => {
    const { _id } = req.params;
    console.log('DEBUG, _id:', _id)
    try {
        const employee = await Employee.findById(_id);
        if (!employee) {
            console.log('DEBUG: Employee not found');
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee exists', employee });
    } catch (error) {
        res.status(500).json({ message: 'Error checking employee', error: error.message });
    }
});

//Create another sub-route for strucutre, but as the file uload only regards employees I will do the file upload here
//for simplicity

router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        const fileContent = req.file.buffer.toString('utf-8');
        const lines = fileContent.split('\n');
        console.log('DEBUG: File content:', lines);

        for (const line of lines) {
            const parts = line.split(';');
            const legacyId = parts[0]; 

            // Check if employee exists using legacyId
            let employee = await Employee.findOne({ legacyId: legacyId });
            console.log('DEBUG: Employee:', employee);

            if (parts.length === 4) {
                // Handle busy time entry
                if (!employee) {
                    // Create employee if not exists, using legacyId
                    employee = new Employee({ legacyId: legacyId });
                }
                // Assuming you have a method to add busy time in your Employee model
                const startTime = new Date(parts[1]);
                const endTime = new Date(parts[2]);
                if (!employee.busy) {
                    employee.busy = [];
                }
                employee.busy.push({ start: startTime, end: endTime });
            } else if (parts.length === 2) {
                // Handle employee name entry
                const name = parts[1].trim();
                if (!employee) {
                    // Create employee if not exists, using legacyId and name
                    employee = new Employee({ legacyId: legacyId, name: name });
                } else {
                    // Update name of existing employee
                    employee.name = name;
                }
            }

            // Save or update employee in the database
            await employee.save();
        }

        res.status(200).json({ message: 'File processed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing file', error: error.message });
    }
});




module.exports = router;