const express = require('express');
const axios = require('axios');
const Meeting = require('../models/Meeting');
const Employee = require('../models/Employee');

const router = express.Router();

router.post('/addMeeting', async (req, res) => {
    const meetingData = req.body;

    try {
        const newMeeting = new Meeting(meetingData);
        await newMeeting.save();

        // Call the standalone updateAllAttendants function
        await updateAllAttendants(meetingData);

        res.status(200).json({ message: 'Meeting added successfully', newMeeting });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
});

router.get('/getMeetings', async (req, res) => {
    try {
        const meetings = await Meeting.find({}).populate('attendants');
        res.status(200).json({ meetings });
    } catch (error) {
        console.error('Failed to fetch meetings:', error);
        res.status(500).json({ message: 'Failed to fetch meetings', error: error.message });
    }
});

async function updateAllAttendants(meetingData) {
    try {
        const updates = await Promise.all(meetingData.attendants.map(async (_id) => {
            const startTime = new Date(meetingData.startTime);
            const endTime = new Date(startTime.getTime() + meetingData.duration * 60000);
            return Employee.findByIdAndUpdate(_id, {
                $push: { busy: { startTime, endTime } }
            }, { new: true }).then(updatedEmployee => {
                if (!updatedEmployee) {
                    console.log('Employee not found or update failed');
                } else {
                    console.log('Update successful');
                }
            }).catch(error => {
                console.error('Error updating Employee busy times:', error);
            });
        }));

        await Promise.all(updates);
    } catch (error) {
        console.error('Error updating attendants:', error);
        throw error; // Rethrow the error to handle it in the calling context
    }
}





module.exports = router;