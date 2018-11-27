/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates the cognito form skill built using
 * nodejs skill development kit.
 **/

'use strict';
const Alexa = require('alexa-sdk');
const https= require('https');

//=========================================================================================================================================
//Global vars
//=========================================================================================================================================


const APP_ID = undefined;
const SKILL_NAME = 'cognito form';

const HELP_MESSAGE = 'You can say cognito get new form followed by a form name, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';

const STOP_MESSAGE = 'Leaving cognito form goodbye!';

const HOST_NAME = 'https://services.cognitoforms.com/forms/api/';
const DIR='/forms/';

var apiKey = '6e238844-ce7a-489a-be61-fdef351fadd4';
var formName;
var form;

var questionCounter = -1; //used to track what question you are on. -1 means no form loaded.
var answers = [];


//=========================================================================================================================================
//Handler and function sections
//=========================================================================================================================================
function ansObject(question, ans){
    this.key = question;
    this.value= ans;

}

const handlers = {
    'LaunchRequest': function () {
        const speechOutput= 'Welcome to the cognito form app, '+HELP_MESSAGE;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },

    'GetNewFormIntent': function () {

       formName = this.event.request.intent.slots.form_name.value;
       var speechOutput='did not set';


         //https request to cognito using CognitoformsDev apikey
        https.get(HOST_NAME+apiKey+DIR+formName, (res) => {

          console.log('statusCode:', res.statusCode);
          console.log('headers:', res.headers);


          var returnData = '';

          res.on('data', (d) => {
               returnData+=d;
          });

          res.on('end', () => {
              if(returnData != ''){               // the form requested exists.
                 form = JSON.parse(returnData);
                 questionCounter = 0;

                  speechOutput='Readying form, '+formName;
                  this.response.speak(speechOutput);
                  this.emit(':responseReady');
              }
              else{                              // the form requested does not exist.
                  speechOutput="I'm sorry, that form is unavailable";
                  this.response.speak(speechOutput);
                  this.emit(':responseReady');
              }
         });

    });


  },

//Todo make intent work with cognitoforms
  'nextQuestionIntent' : function(){

    //Test code that shows GetNewFormIntent is now working with apikey
    // NOT INTENDED FOR VIDAL DEMO PURPOSES.

    var speechOutput = 'I have a question for you, ';
    var question = form.Fields[0].Name;
    speechOutput += question;
    this.response.speak(speechOutput);

    this.emit(':responseReady');

  },

//Todo make answerIntent work with cognitoform
  'answerIntent' : function(){

    var ans = Number(this.event.request.intent.slots.number.value);

    var speechOutput;
    var formAns;

    if( questionCounter < 0){ // no form loaded illegal access
      this.response.speak('You have not loaded a form yet.');
      this.emit(':responseReady');
    }
    else if(questionCounter >= form.Fields.length  ){ // prevent user from answering past the last question, giving junk data.

      this.response.speak('All questions have been answered, you can say repeat my answers, or submit form');
       this.emit(':responseReady');
    }
    else {

         var question= form.Fields[questionCounter]; // moved to prevent out of order access errors
        // Ensures answer given is within the bounds of the available choices
         if(ans <= form.Fields[questionCounter].Choices.length && ans > 0) {


           //storing a "key":"value" pair in answers[], this is what we have to send to cognito after we format it.
           formAns = question.Choices[ans-1].Label;

            if(question.FieldType == "YesNo"){ // answer must be changed or form submission will be rejected.

                  if(formAns =="Yes"){
                      formAns='true';
                    }else if(formAns =="No"){
                      formAns='false';
                    }
            }

            answers.push(new ansObject(question.InternalName, formAns));

            speechOutput= 'Storing answer, option '+ ans+', '+formAns;
            questionCounter++;

            this.response.speak(speechOutput);
            this.emit(':responseReady');
         }
          else {
            this.response.speak('Something went wrong with your answer, say reprompt to repeat the question.');
            this.emit(':responseReady');
          }
     }
     //TODO jump to next question
     //TODO jump to recovery
     //TODO jump to repeat or submit

  },

  'repromptIntent' : function(){
     this.emit('nextQuestionIntent');
  },

  //Todo make submitIntent create a form entry to cognitoforms
  'submitIntent' : function(){

    //Todo Format the data in answers[] into proper json form and send it to cognito using apikey
   var speechOutput = '';

    var HOST = 'services.cognitoforms.com';

    var fullPath = '/forms/api/'+apiKey+DIR+formName+'/entry';

    var postData = '{';// added '{' for json formatting

    //format the answers data into appropriate JSON syntax
    for (var i=0 ; i<answers.length ; i++)  //combine answers into a single string value
    {
        postData += '"'+answers[i].key+'":"'+answers[i].value+'",';
    }
    postData = postData.replace(/,+$/, "")+'}';  //remove the trailing comma// added '}' forjson formating
   //don't need to stringify it's already a string.

    var options = {
      hostname: HOST,
      port: 443,
      path: fullPath,
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
      }
    };

    var req = https.request(options, function(res) {

      console.log('Status: ' + res.statusCode);
      console.log('Headers: ' + JSON.stringify(res.headers));

      var returnData = '';

      res.on('data', function (body) {
        console.log('Body: ' + body);
        returnData += body; //There is a field in this body which specifies if the form has been submitted successfully 'Form>Entry>Status'
      });

      res.on('end', () => {

      });

    });

    req.write(postData);
    req.end();

  speechOutput="your form has been submitted.";
  this.response.speak(speechOutput);
  this.emit(':responseReady');   // moved because this.emit()  has the same effect as a return statement


  },

//Todo create voiceAnswersIntent
    'repeatAnswerIntent': function () {
        var i;
        var speechOutput;

         if (answers.length <= 0) {
             speechOutput = "You haven't given me enough answers yet. Please fill out your form first, then I will be able to repeat your given answers.";
         }
        else {
            for (i = 0; i < answers.length; i++) {

                speechOutput = 'For question: ' + (i+1) + ' , ' +  form.Fields[i].Name + '. You gave : ' + answers[i].value + ', as your answer.';

            }
            var prompt = ' Are these answers correct?';
            speechOutput+= prompt;

       }
        this.response.speak(speechOutput);
        this.emit(':responseReady');

    },

//end of voiceAnswersIntent

//built in intents just ignore them
  'AMAZON.HelpIntent': function () {
          const speechOutput = HELP_MESSAGE;
          const reprompt = HELP_REPROMPT;

          this.response.speak(speechOutput).listen(reprompt);
          this.emit(':responseReady');
  },


  'AMAZON.CancelIntent': function () {
          this.response.speak(STOP_MESSAGE);
          this.emit(':responseReady');
  },


  'AMAZON.StopIntent': function () {
          this.response.speak(STOP_MESSAGE);
          this.emit(':responseReady');
    },

   // needs to be fixed Alexa can use emit to shift control to another intent, or speak but not both.
    'AMAZON.YesIntent': function () {
        var speechOutput = 'Perfect! Please say, Next Question';
        this.response.speak(speechOutput);
        this.emit(':responseReady')
    },

   // needs to be fixed Alexa can use emit to shift control to another intent, or speak but not both.
    'AMAZON.NoIntent': function () {
        var speechOutput = 'Oops, let us fix that. To ensure accuracy , please say, Cognito get form';
        this.response.speak(speechOutput);
        this.emit(':responseReady')
    }
// end of built in intents
  };


exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
