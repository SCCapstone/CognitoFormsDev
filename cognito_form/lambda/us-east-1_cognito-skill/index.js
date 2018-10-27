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

const HELP_MESSAGE = 'You can say cognito form get new form, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';

const STOP_MESSAGE = 'Leaving cognito form goodbye!';

var form;
var questionCounter = -1;
var answers= [];

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

        const speechOutput='Readying requested form';
        //https request
        https.get('https://tjcocklin.github.io/form_one.json', (res) => {
          console.log('statusCode:', res.statusCode);
          console.log('headers:', res.headers);

          var returnData='';

          res.on('data', (d) => {
             returnData+=d;
          });

          res.on('end', () => {
            form = JSON.parse(returnData);
             questionCounter = 0;
            this.response.speak(speechOutput);
            this.emit(':responseReady');
          });

        });

  },


  'nextQuestionIntent' : function(){
    var speechOutput = '';


    if(questionCounter >= 0 && questionCounter < form.Questions.length){

         speechOutput = 'I have a Question for you, ' + form.Questions[questionCounter].Question +
                          ' the options are, ';
        for( var i = 0; i < form.Questions[questionCounter].options.length; i++){
            speechOutput+= form.Questions[questionCounter].options[i]+', ';
        }
    }
    else{
        speechOutput = 'there are no questions left.';
    }

    this.response.speak(speechOutput);
    this.emit(':responseReady');

  },

    // update questionCounter if answer is valid
  'answerIntent' : function(){
     var speechOutput ='ok';
     var ans = Number(this.event.request.intent.slots.number.value);

     var optionAns;
     var optionsLength = form.Questions[questionCounter].options.length;

      for(var i = 0; i < optionsLength; i++){
         optionAns=Number(form.Questions[questionCounter].valid_Options[i]);

         if(ans == optionAns) {   // valid answer given
           answers.push(ans);
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

// Reprompt Intent
  'repromptIntent' : function(){
     this.emit('nextQuestionIntent');
  },
//Submit Intent
  'submitIntent' : function(){
      var speechOutput;
      if(answers.length == form.Questions.length){
         speechOutput='submitting answers, ';

         for(var i=0; i < form.Questions.length; i++ ){
            speechOutput+='answer '+(i+1)+' option '+answers[i]+', ';

        }
      }
      else{
          speechOutput='please answer all the questions before submitting the form.'
      }
      this.response.speak(speechOutput);
      this.emit(':responseReady');
  },

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
 'AwesomeIntent': function(){
     this.response.speak("awesome");
      this.emit(':responseReady');
 },



};


exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
