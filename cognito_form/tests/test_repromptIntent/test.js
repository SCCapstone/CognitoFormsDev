var lambda = require('../../lambda/us-east-1_cognito-skill/index.js');
var context = require('./context.js');
var mockEvent = require('./event.json');


var mockContext = new context();

function callback(error, data) {
  if(error) {
    //  console.log('error: ' + error);
      console.log('\n repromptIntent test failed.');
  } else {
    //  console.log(data);
      console.log('\n repromptIntent test pass!');

  }
}

lambda.handler(mockEvent, mockContext, callback);