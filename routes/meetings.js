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

router.delete('/delete/:meetingId', async (req, res) => {
    const { meetingId } = req.params;

    try {
        const meetingToDelete = await Meeting.findById(meetingId).populate('attendants');
        if (!meetingToDelete) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        await Meeting.findByIdAndDelete(meetingId);

        const meetingEndTime = new Date(meetingToDelete.startTime.getTime() + meetingToDelete.duration * 60000);

        const attendantUpdates = meetingToDelete.attendants.map(attendant => {
            return Employee.findByIdAndUpdate(attendant._id, {
                $pull: {
                    busy: {
                        start: meetingToDelete.startTime,
                        end: meetingEndTime
                    }
                }
            });
        });

        await Promise.all(attendantUpdates);
        console.log('DEBUG: Attendants updated successfully');
        return res.status(200).send({ message: 'Meeting deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error processing your request', error: error.message });
    }
});

async function updateAllAttendants(meetingData) {
    try {
        // Calculate startTime and endTime from meetingData
        const startTime = new Date(meetingData.startTime);
        const endTime = new Date(startTime.getTime() + meetingData.duration * 60000);

        await Promise.all(meetingData.attendants.map(async (_id) => {
            return Employee.findByIdAndUpdate(_id, {
                $push: { busy: { start: startTime, end: endTime } }
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
    } catch (error) {
        console.error('Error updating attendants:', error);
        throw error;
    }
}





module.exports = router;