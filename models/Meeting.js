const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    location: {
        type: String,
    },
    startTime: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employees',
    }]
});

const Meeting = mongoose.model('Meetings', MeetingSchema);

module.exports = Meeting;
