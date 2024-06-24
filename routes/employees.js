const express = require('express');
const Employee = require('../models/Employee');

const router = express.Router();

router.post('/addEmployee', async (req, res) => {
    console.log("request recieved", req.body);
    try {
        
        const employeeData = req.body;
        const newEmployee = new Employee(employeeData);
        console.log("newEmployee", newEmployee);
        await newEmployee.save(); 
        
        res.status(201).json({ message: 'Employee added successfully', newEmployee });
    } catch (error) {
        res.status(400).json({ message: 'Error adding employee', error: error.message });
    }
});


module.exports = router;