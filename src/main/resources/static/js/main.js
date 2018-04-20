'use strict';

var usernamePage = $('#username-page');
var chatPage = $('#chat-page');
var usernameForm = $('#usernameForm');
var messageForm = $('#messageForm');
var messageInput = $('#message');
var messageArea = $('#messageArea');
var connectingElement = $('.connecting');

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect (event) {
    username = $('#name').val().trim();

    if (username) {
        usernamePage.addClass('hidden');
        chatPage.removeClass('hidden');

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({},onConnected,onError)
    }
    event.preventDefault();
}

function onError(error) {
    connectingElement.text('Could not connect to WebSocket server. Please refresh this page to try again!');
    connectingElement[0].style.color = 'red';
}

function onConnected() {
    stompClient.subscribe('/topic/public', onMessageReceived);

    stompClient.send('/app/chat.addUser', {}, JSON.stringify({sender: username, messageType: 'JOIN'}));

    connectingElement.addClass('hidden');
}

function sendMessage(event) {
    var message = messageInput.val().trim();
    if (message && stompClient) {
        var chatMessage = {
            messageType: 'CHAT',
            sender: username,
            content: message
        };
        stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
        messageInput.val('');
    }
    event.preventDefault();
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = $(document.createElement('li'));

    if (message.messageType == 'JOIN') {
        messageElement.addClass('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.messageType == 'LEAVE') {
        messageElement.addClass('event-message');
        message.content  = message.sender + ' left!';
    } else {
        messageElement.addClass('chat-message');

        var avatarElement = $(document.createElement('i'));
        var avatarText = $(document.createTextNode(message.sender[0]));
        avatarElement.append(avatarText);
        avatarElement.css('background-color', getAvatarColor(message.sender));

        messageElement.append(avatarElement);

        var usernameElement = $(document.createElement('span'));
        var usernameText = $(document.createTextNode(message.sender));
        usernameElement.append(usernameText);
        messageElement.append(usernameElement);
    }

    var textElement = $(document.createElement('p'));
    var messageText = $(document.createTextNode(message.content));
    textElement.append(messageText);

    messageElement.append(textElement);

    messageArea.append(messageElement);
    messageArea.scrollTop(messageArea[0].scrollHeight);
}

function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

messageForm.bind('submit', sendMessage);
usernameForm.bind('submit', connect);