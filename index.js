var express = require('express');  
var bodyParser = require('body-parser');  
var request = require('request');  
var app = express();
var questionNum = 1;
var month;
//var table = {};

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
          	if(questionNum === 1) {
          		sendQuestion1(event.sender.id, event.message.text);
          	} else if(questionNum === 2) {
          		sendQuestion2(event.sender.id, event.message.text);
          	} else if(questionNum === 3) {
          		month = event.message.text;
          		sendQuestion3(event.sender.id, event.message.text);
          	} else if(questionNum === 4) {
          		var categories = event.message.text.split("|");
          		for(var j = 0; j < categories.length; j++) {
          			var key = categories[j].split(" ")[0];
          			var value = categories[j].split(" ")[1];
          			table[key] = value;
          		}
          		sendQuestion4(event.sender.id, event.message.text);
          	}
        }
    }
    res.sendStatus(200);
});

//text
function sendQuestion1(recipientId, message) {
	sendMessage(recipientId, {text: "Thanks for visiting $crooge! Our financial advising application works to help college students save money on a monthly basis through budget analysis with Mint. Now tell me, would you like to save money this month?"});
	questionNum = questionNum + 1;
}

function sendQuestion2(recipientId, message) {
	if(message.toLowerCase() === 'yes') {
        sendMessage(recipientId, {text: "Ok awesome! Let's get started by finding out how much you've spent this month for each category. Enter the month."});
        questionNum = questionNum + 1;
    } else {
        sendMessage(recipientId, {text: "Alright. That's fine. Goodbye!"});
    }
}

function sendQuestion3(recipientId, message) {
	sendMessage(recipientId, {text: "Perfect. For the month of " + month + ", let's manage your finances. The 4 main categories college students spend money on are Food, Utilities, Gas, and Entertainment. Open up your Mint app and go to the 'Overview' tab. Please enter your expenses for each category in the following format 'Food 900|Utilities 200|Gas 100|Entertainment 200'."});
	questionNum = questionNum + 1;
}


function sendQuestion4(recipientId, message) {
	sendMessage(recipientId, {text: "Perfect. For the month of " + month + ", let's manage your finances. The 4 main categories college students spend money on are Food, Utilities, Gas, and"});
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