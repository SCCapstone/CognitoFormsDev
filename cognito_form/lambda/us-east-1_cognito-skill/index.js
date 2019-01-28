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
var answers=[];


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
       var speechOutput;

       if(formName.indexOf(' ') != -1){ //remove spaces from formName with spoken input.
          var temp= formName.split(' ');
          formName='';

          for(var i=0; i< temp.length; i++)
              formName+= temp[i];
       }

         //https request to cognito using CognitoformsDev apikey
        https.get(HOST_NAME+apiKey+DIR+formName, (res) => {

          console.log('statusCode:', res.statusCode);
        //  console.log('headers:', res.headers); silenced because it shows in unit tests.


          var returnData = '';

          res.on('data', (d) => {
               returnData+=d;
          });

          res.on('end', () => {
              if(returnData != ''){               // the form requested exists.
                 form = JSON.parse(returnData);

                 questionCounter = 0;
                 speechOutput='Readying form, '+formName+ ', you can say tell cognito next for the next question.';


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


    'nextQuestionIntent' : function(){

      var speechOutput;

      if(questionCounter < 0 || questionCounter >= form.Fields.length){ //>= 0 && questionCounter >= form.fields.length){
        speechOutput = 'All questions have been answered, you can say tell cognito repeat my answers, or submit form';
        this.response.speak(speechOutput);

        this.emit(':responseReady');
      }
      else{

            var question = form.Fields[questionCounter]; //gets curr quest based on questionCounter
            speechOutput = 'I have a question for you, '+question.Name+', the options are: '; //starts by inputing default beginning


            for(var i = 0; i < question.Choices.length; i++){
              speechOutput+= 'option '+(i+1)+', '+question.Choices[i].Label+', ';

            }

            speechOutput+= ' you can say tell cognito answer, followed by your response.';
            this.response.speak(speechOutput);
            this.emit(':responseReady');
      }
    },


  'answerIntent' : function(){

    var formAns= this.event.request.intent.slots.response.value;

    var incorrectInput= "I'm sorry, your answer is outside the given options,"
     +" if you want to hear the question and choices again, say reprompt.";

     var match=false;
     var speechOutput='';


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
         //var ansLabel;

         switch(question.FieldType){ // switch statement that formats answers by fieldtype, and fieldsubtype

              case "YesNo":
                  if(formAns =="yes"){
                     formAns="true";
                  }else if(formAns == "no"){
                    formAns="false";
                  }

                 // this.response.speak("user said, "+formAns);
                 // this.emit(':responseReady');

                  if(formAns != "true" && formAns != "false"){
                    this.response.speak(incorrectInput);
                    this.emit(':responseReady');
                  }
                  break;

              case "Choice":
                    if(question.FieldSubType == "Checkboxes"){
                      var temp = formAns;
                      formAns= '["'+ temp +'"]';
                    }



                   break;
             default:
                     speechOutput="I'm sorry, but something went awry";
                     break;
         }
         speechOutput= 'Storing answer, '+ formAns;
         answers.push( new ansObject(question.InternalName, formAns));

         questionCounter++;

         this.response.speak(speechOutput);
         this.emit(':responseReady');

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


    if(answers.length == form.Fields.length){ //submission only allowed if all questions answered
        var speechOutput = '';
        var question;

        var HOST = 'services.cognitoforms.com';
        var fullPath = '/forms/api/'+apiKey+DIR+formName+'/entry';

        var postData = '{';

        //format the answers data into appropriate JSON syntax
        for (var i=0 ; i<answers.length ; i++)  //combine answers into a single string value
        {
            question = form.Fields[i];

            if(question.FieldSubType == "Checkboxes"){
              postData += '"'+answers[i].key+'":'+answers[i].value+',';
            }
            else
               postData += '"'+answers[i].key+'":"'+answers[i].value+'",';
        }

        postData = postData.replace(/,+$/, "")+'}';  //remove the trailing comma//

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
        //  console.log('Headers: ' + JSON.stringify(res.headers)); silenced for unit test

          var returnData = '';

          res.on('data', function (body) {
            console.log('Body: ' + body); //not sure if should silence yet.
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
    }
    else{
      speechOutput="Please answer all questions before you submit your form.";
      this.response.speak(speechOutput);
      this.emit(':responseReady');
    }

  },


    'repeatAnswerIntent': function () {

        var speechOutput='';

         if (questionCounter < 0 || answers.length <= 0) {
             speechOutput = "You haven't given me enough answers yet. Please fill out your form first," +
             "then I will be able to repeat your given answers.";

             this.response.speak(speechOutput);
             this.emit(':responseReady');
         }
        else {
            for (var i = 0; i < answers.length; i++) {

                speechOutput+= 'For question: ' + (i+1) + ' , ' +  form.Fields[i].Name + '. You gave : '
                + answers[i].value + ', as your answer. ';

            }
            var prompt = ' Are these answers correct?';
            speechOutput+= prompt;

       }
        this.response.speak(speechOutput);
        this.emit(':responseReady');

    },


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
    }


// end of built in intents
  };


exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
