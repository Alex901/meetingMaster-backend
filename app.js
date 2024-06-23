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
    'http://localhost:5173'
]

const corsOptions = {
    origin: function (origin, callback) {
        if (allowOrigins.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
  };

app.use(cors(corsOptions));
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
}));

connectDB();

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB cluster:', mongoose.connection.client.s.url);
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
})



app.get('/', (req, res) => {
    res.send("server is running");
});

app.use('/meetings', meetingRouter);
app.use('/employees', employeeRouter);

module.exports = app;

