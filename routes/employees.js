const express = require('express');
const Employee = require('../models/Employee');

const router = express.Router();

router.post('/addEmployee', async (req, res) => {
    console.log("request recieved", req.body);
    try {
        const employeeData = req.body;
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


module.exports = router;