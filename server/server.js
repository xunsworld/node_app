const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// DB Config
const db = require('./config/keys').mongoURI;


// user.js
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Connect to MongoDB
mongoose.connect(db)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Passport middleware initialization
app.use(passport.initialize());
require('./config/passport')(passport);


// Use Routes
app.use('/api/users', users);
app.use('/api/profiles', profiles);




const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})