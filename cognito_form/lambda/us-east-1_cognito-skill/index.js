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

var questionCounter = -1;
var answers = [];
var questionAr = []

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
    // var speechOutput = '';
    //
    // if(questionCounter >= 0 && questionCounter < form.Questions.length){
    //
    //      speechOutput = 'I have a Question for you, ' + form.Questions[questionCounter].Question +
    //                       ' the options are, ';
    //     for( var i = 0; i < form.Questions[questionCounter].options.length; i++){
    //         speechOutput+= form.Questions[questionCounter].options[i]+', ';
    //     }
    // }
    // else{
    //     speechOutput = 'there are no questions left.';
    // }
    //
    // this.response.speak(speechOutput);
    // this.emit(':responseReady');

    //Test code that shows GetNewFormIntent is now working with apikey
    // NOT INTENDED FOR VIDAL DEMO PURPOSES.

    var speechOutput = 'I have a question for you, ';
    var question = form.Fields[0].Name;
      questionAr[questionCounter] = question;
    speechOutput += question;
    this.response.speak(speechOutput);

    this.emit(':responseReady');

  },

//Todo make answerIntent work with cognitoform
  'answerIntent' : function(){
     var speechOutput ='ok';
     var ans = Number(this.event.request.intent.slots.number.value);

     var optionAns;
     var optionsLength = form.Questions[questionCounter].options.length;

      for(var i = 0; i < optionsLength; i++){
         optionAns=Number(form.Questions[questionCounter].valid_Options[i]);

         if(ans == optionAns) {   // valid answer given
             answers[questionCounter] = ans;
           speechOutput='Storing answer, '+ans;

           questionCounter++; //make next question available
           i=optionsLength;

           this.response.speak(speechOutput);
           this.emit(':responseReady');
         }
     }
      //invalid answer
      speechOutput='Im sorry, that answer is invalid, say reprompt to repeat the question';
      this.response.speak(speechOutput);
      this.emit(':responseReady');

  },

  'repromptIntent' : function(){
     this.emit('nextQuestionIntent');
  },

//Todo make submitIntent create a form entry to cognitoforms
  'submitIntent' : function(){
      var speechOutput;
      if(answers.length == form.Questions.length){
         speechOutput='submitting answers, ';

         for(var i=0; i < form.Questions.length; i++ ){
            speechOutput+='answer '+(i+1)+' option '+answers[i]+', ';

        }
      }
      else{
          speechOutput='please answer all the questions before submitting the form.';
      }
      this.response.speak(speechOutput);
      this.emit(':responseReady');
  },

//Todo create voiceAnswersIntent
    'repeatAnswerIntent': function () {
        var i;
        if (questionCounter <= 0) {
            speechOutput = 'You havent given me any answers yet. Please fill out your form first, then I will be able to repeat your given answers.';
        }
        else {
            for (i = 0; i < questionCounter; i++) {
                var int = questionCounter + 1;
                speechOutput = 'For question: ' + int + ' , ' + questionAr[i] + '. You gave :' + answers[i] + ' ,  ' + form.Questions[questionCounter].options[answers[i]] + ', as your answer.';
                this.response.speak(speechOutput);
            }
            speechOutput = 'Are these answers correct?';
            this.response.speak(speechOutput);
            this.emit(':responseReady')
        }
    },

//end of voiceAnswersIntent

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
  };


exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
