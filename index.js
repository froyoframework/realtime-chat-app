"use strict";
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// setup template engine
app.engine('.hbs', exphbs({defaultLayout: 'single', extname: '.hbs'}));
app.set('view engine', '.hbs');

// serving static files
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

let listener = http.listen(3000, () => {
    console.log('listening on port ' + listener.address().port);
});

io.on('connection', (socket) => {
    socket.on('request-message', (data) => {
        io.emit('reply-message', data);
    });
});
