require('dotenv').config();

const express = require('express');
const connectDB = require('./db');
const mongoose = require('mongoose');
const cors = require('cors');
const meetingRouter = require('./routes/meetings');
const employeeRouter = require('./routes/employees');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
const allowOrigins = [
    'http://localhost:5173', 
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
};

app.use(cors(corsOptions));

connectDB();

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
});

app.get('/', (req, res) => {
    res.send("server is running");
});

app.use('/meetings', meetingRouter);
app.use('/employees', employeeRouter);

// Error handling middleware (example)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;