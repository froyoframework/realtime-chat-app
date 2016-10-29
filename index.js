"use strict";
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const roomModel = require('./models/room');

// setup template engine
app.engine('.hbs', exphbs({defaultLayout: 'single', extname: '.hbs'}));
app.set('view engine', '.hbs');

// serving static files
app.use(express.static('public'));

// parse post body
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// setup cookie parser
app.use(cookieParser());

// APPLICATION ROUTES
app.get('/', (req, res) => {
    let cookieData = JSON.parse(req.cookies.userdata);
    res.render('index', {user: cookieData});
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    // process to database
    let userData = {
        username: req.body.username,
        room: req.body.room
    };

    roomModel.joinRoom(userData, function(err, result) {
        if(err === null) {
            res.cookie('userdata', JSON.stringify(userData));
            res.redirect('/');
        } else {
            res.redirect('/login');    
        } 
    });
});

let listener = http.listen(3000, () => {
    console.log('listening on port ' + listener.address().port);
});

io.on('connection', (socket) => {
    // join the room
    socket.join('someroom');
    
    socket.in('someroom').broadcast.emit('reply-message', 'someone is connected');

    socket.on('request-message', (data) => {
        io.to('someroom').emit('reply-message', data);
    });

    socket.on('disconnect', () => {
        socket.in('someroom').broadcast.emit('reply-message', 'someone is disconnected');
    });

    // leave
    socket.leave('someroom');
});
