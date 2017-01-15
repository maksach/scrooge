var express = require('express');  
var bodyParser = require('body-parser');  
var request = require('request');  
var app = express();
var questionNum = 1;

app.use(bodyParser.urlencoded({extended: false}));  
app.use(bodyParser.json());  
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {  
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {  
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {  
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
        	console.log("HI");
          	if(questionNum == 1) {
          		sendQuestion1(event.sender.id, event.message.text);
          	} else if(questionNum == 2) {
          		sendQuestion2(event.sender.id, event.message.text);
          	} /*else if(questionNum == 2) {

          	} else if(questionNum == 3) {

          	} else if(questionNum == 4) {

          	} else if(questionNum == 5) {

          	} else if(questionNum == 6) {

          	}
          	*/
        }
    }
    res.sendStatus(200);
});

function sendQuestion1(recipientId, message) {
	sendMessage(recipientId, {text: "Thanks for visiting $crooge! Our financial advising application works to help college students save money on a monthly basis through budget analysis with Mint. Now tell me, would you like to save money this month?"});
	questionNum = questionNum + 1;
}

function sendQuestion2(recipientId, message) {
	if(message == 'Yes' || 'yes') {
        sendMessage(recipientId, {text: "Ok awesome! Let's get started!"});
    } else {
        sendMessage(recipientId, {text: "Alright. That's fine. Goodbye!"});
        return;
    }
    questionNum = questionNum + 1;
}

// generic function sending messages
function sendMessage(recipientId, message) {  
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};