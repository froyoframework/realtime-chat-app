"use strict";

$(document).ready(() => { 
    $("#status").empty();

    let socket = io();
    
    // sending message
    $('#chat-bar').submit((e) => {
        e.preventDefault();
        
        let message = $("#type-message").val();
        
        socket.emit('request-message', message);
    });

    // listening message
    socket.on('reply-message', (data) => {
        $('#message-list').append('<li>'+data+'</li>'); 
    });
});
