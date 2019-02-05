const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');

mongoose.promise = global.Promise;

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));
app.use(session({ secret: 'danielholley-tech', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if(!isProduction){
    app.use(errorHandler());
}

mongoose.connect('mongodb://localhost/danielholley-tech');
if(!isProduction){
    mongoose.set('debug', true);

    app.use((err, req, res) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err
            }
        });
    });
}

app.listen(5000, function(){
    console.log('Dev app listening on port 5000!');
});