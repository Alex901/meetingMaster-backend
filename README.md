# Meeting Master

## Description
This is the backend for the project https://github.com/Alex901/meetingMaster-app.git. 


## Installation
Step-by-step instructions on how to get a development environment running. First of all, you need to have your own mongoDB server to run this locally. If you have that, you can either create your own .env and add: 

```bash
DATABASE_URI=<Your <connection_string>
```

Or, simply go int db.js and add it there: 

```bash
 await mongoose.connect(<your_connection_sting>, {
            dbName: '<your database name>',
        });
```

When all that is done, you can install the server by:

```bash
git clone https://github.com/Alex901/meetingMaster-backend
cd meetingMaster-app
npm install
npm start
```

If you don't want to bother with any of that, this server is 
also hosted at: https://todo-backend-gkdo.onrender.com 


---

And that is about it,
Enjoy



### Contact ###
Alexander Winberg – alexander.winberg.036@gmail.com
Project Link: https://github.com/Alex901/meetingMaster-app.git