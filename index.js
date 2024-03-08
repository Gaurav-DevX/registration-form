const express = require('express');
const mongoose = require('mongoose');
const  bodyParser = require('body-parser');
const dotenv = require('dotenv');


const server = express();
dotenv.config();

const port = process.env.PORT || 3001;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.kkq5ht4.mongodb.net/userDataDB&appName=Cluster0`);

// Registration Schema.
const registrationSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String
});

// Model for registration Schema.
const User = mongoose.model( 'User', registrationSchema );

server.use(bodyParser.urlencoded ({ extended: true }));
server.use(bodyParser.json());

server.get ('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
})

server.post ('/register', async (req, res) => {
    try {
        const {username, email, password} = req.body;

        const existingUser = await User.findOne({email : email});

        // check existing user and if not create a new one.
        if (!existingUser){
            const userData = new User ({
                username,
                email,
                password
            });
            await userData.save();
            res.redirect('/success');
        }
        else {
            console.log('user already exists');
            res.redirect('/error');
        }

    } catch (error) {
        console.log(error)
        res.redirect('/error');
    }
});

server.get ('/success', (req, res) => {
    res.sendFile(__dirname + '/pages/success.html');
});

server.get ('/error', (req, res) => {
    res.sendFile(__dirname + '/pages/error.html');
})

server.listen(port, ()=>{
    console.log( `Server is running on ${port} port`);
})
