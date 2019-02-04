// Modified by Ayla
// Sunday, Feb 3rd, 2019
// 11:56pm

var lambda = require('../../lambda/us-east-1_cognito-skill/index.js');
var context = require('./context.js');
var mockEvent = require('./event.json');
//var mockEvent = require('./eventFail.json');


var mockContext = new context();

function callback(error, data) {
  if(error) {
    //  console.log('error: ' + error);
      console.log('\n answerIntent failed; Unable to submit answer.');
  } else {
    //  console.log(data);
      console.log('\n answerIntent test passed!');

  }
}

lambda.handler(mockEvent, mockContext, callback);
