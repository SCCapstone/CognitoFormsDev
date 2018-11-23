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
var form;

var questionCounter = -1; //used to track what question you are on. -1 means no form loaded.
var answers = [];


//=========================================================================================================================================
//Handler and function sections
//=========================================================================================================================================

const handlers = {
    'LaunchRequest': function () {
        const speechOutput= 'Welcome to the cognito form app, '+HELP_MESSAGE;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },

    'GetNewFormIntent': function () {
       var statusCode = '';

       var formName = this.event.request.intent.slots.form_name.value;
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

    if(questionCounter <= 0){
      var speechOutput = 'There are no more questions';
      this.response.speak(speechOutput);

      this.emit(':submitIntent');
    }
    var speechOutput = 'I have a question for you, '; //starts by inputing default beginning
    var question = form.Fields[questionCounter].Name; //gets curr quest based on questionCounter
    speechOutput += question; //adds current question to the speech response
    this.response.speak(speechOutput);

    this.emit(':answerIntent');
    //this.emit(':responseReady'); instead???
  },

//Todo make answerIntent work with cognitoform
  'answerIntent' : function(){
      var ans = Number(this.event.request.intent.slots.number.value);
      var speechOutput = 'Storing answer, option '+ ans;

      // Ensures answer given is within the bounds of the available choices
      if(ans < form.Fields[questionCounter].Choices.length && ans > 0) {
        this.response.speak(speechOutput);
        answers[questionCounter] = ans;
        questionCounter++;
      }
      else {
        this.response.speak('Something went wrong with your answer');
        this.emit(':responseReady'); //TODO jump to next question
      }

      if(questionCounter > form.Fields.length) {
        this.response.speak('All questions have been answered');
        this.emit(':responseReady'); // TODO jump to either repeat or submit
      }
      else {
        this.emit(':responseReady'); // TODO jump to recovery
      }

  },

  'repromptIntent' : function(){
     this.emit(':nextQuestionIntent');
  },

//Todo make submitIntent create a form entry to cognitoforms
  'submitIntent' : function(){

  },

//Todo create voiceAnswersIntent
  'repeatAnswerIntent': function () {
      var i;
      if (questionCounter < 0 || answers.length != form.Fields.length) {
          speechOutput = 'You havent given me any answers yet. Please fill out your form first, then I will be able to repeat your given answers.';
      }
      else {
          for (i = 0; i < answers.length; i++) {
              var int = questionCounter + 1;
              speechOutput = 'For question: ' + int + ' , ' +  form.Fields[i].Name + '. You gave :' + answers[i] + ', as your answer.';
              this.response.speak(speechOutput);
          }
          speechOutput = 'Are these answers correct?';
          this.response.speak(speechOutput);
          this.emit(':responseReady');
      }
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
    'AMAZON.YesIntent': function () {
        this.response.speak('Perfect!');
        this.emit(':nextQuestionIntent');
    },

    'AMAZON.NoIntent': function () {
        this.response.speak('Oops, let us fix that. To ensure accuracy form will be restarted');
        this.emit(':GetNewFormIntent');
    }
// end of built in intents
  };


exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
