var lambda = require('../../lambda/us-east-1_cognito-skill/index.js');
var context = require('./context.js');
var mockEvent = require('./event.json');
//var mockEvent = require('./eventFail.json');

var mockContext = new context();

function callback(error, data) {
  if(error) {
  //    console.log('error: ' + error);
      console.log('\n Cannot Repeat Answers Successfully');
  } else {
  //    console.log(data);
      console.log('\n Successfully repeated answers');

  }
}

lambda.handler(mockEvent, mockContext, callback);
