/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates the cognito form skill built using
 * nodejs skill development kit.
 **/

'use strict';
const Alexa = require('alexa-sdk');

const https= require('https');
const Cog= require('./Cog');

//=========================================================================================================================================
//Global vars
//=========================================================================================================================================


const APP_ID = undefined;
const SKILL_NAME = 'cognito form';

const HELP_MESSAGE =', You can say cognito get new form followed by a form name, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';

const STOP_MESSAGE = 'Leaving cognito form goodbye!';

const HOST_NAME = 'https://services.cognitoforms.com/forms/api/';
const DIR='/forms/';

const US_ADDRESS_LENGTH=4;

var apiKey = '6e238844-ce7a-489a-be61-fdef351fadd4';
var forms;
var formName;
var form;
var rateQuestions;
var questionCounter = -1; //used to track what question you are on. -1 means no form loaded.
var multiQcounter=0;
var addressQcounter= -1;
var answers=[];
var multiAns=[];
var usAddressQ=['Line1', 'City', 'State', 'PostalCode'];

//=========================================================================================================================================
//Handler and function sections
//=========================================================================================================================================
function ansObject(question, ans){
    this.key = question;
    this.value= ans;

}
// https://services.cognitoforms.com/forms/api/6e238844-ce7a-489a-be61-fdef351fadd4/forms
const handlers = {
    'LaunchRequest': function () {
            var speechOutput= "Welcome to the cognito form app, here's a list of the available forms ";

             //https request to cognito using CognitoformsDev apikey
            https.get(HOST_NAME+apiKey+DIR, (res) => {

              console.log('statusCode:', res.statusCode);
            //  console.log('headers:', res.headers); silenced because it shows in unit tests.

              var returnData = '';

              res.on('data', (d) => {
                   returnData+=d;
              });

              res.on('end', () => {
                  if(returnData != ''){               // the forms exist.
                     forms = JSON.parse(returnData);

                     for(var i=0; i < forms.length; i++)
                        speechOutput+= ', '+forms[i].InternalName;

                      speechOutput+= HELP_MESSAGE;

                      this.response.speak(speechOutput);
                      this.emit(':responseReady');
                  }
                  else{                              // the forms do not exist.
                      speechOutput="I'm sorry, no forms are currently available";
                      this.response.speak(speechOutput);
                      this.emit(':responseReady');
                  }
             });

        });


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

      if(questionCounter < 0 || questionCounter >= form.Fields.length){
        speechOutput = 'All questions have been answered, you can say tell cognito repeat my answers, or submit form';
        this.response.speak(speechOutput);

        this.emit(':responseReady');
      }
      else{

            var question = form.Fields[questionCounter]; //gets current question based on questionCounter

            if(question.FieldType == "YesNo"|| question.FieldType == "Choice"||
              question.FieldType =="Boolean" ){

              speechOutput = 'I have a question for you, '+question.Name+', the options are: '; //starts by inputing default beginning

              for(var i = 0; i < question.Choices.length; i++){

                 speechOutput+= 'option '+(i+1)+', '+question.Choices[i].Label+', ';
              }

              this.response.speak(speechOutput);
              this.emit(':responseReady');

            }
            else if(question.FieldType =="RatingScale"){

               rateQuestions=question.ChildType.Fields;

               if(multiQcounter < rateQuestions.length ){
                   var rQuestion=rateQuestions[multiQcounter].InternalName;


                   speechOutput = 'I have a rating scale about, '+question.Name+' for you, rate: '+rQuestion+
                                   ', the options are, ';

                   for(var i = 0; i < question.Choices.length; i++){
                     speechOutput+= ', option '+(i+1)+', '+question.Choices[i].Label+', ';

                   }

                   this.response.speak(speechOutput);
                   this.emit(':responseReady');
               }
            }
            else if(question.FieldType =="Address"){

               if(question.FieldSubType=="USAddress" && addressQcounter >= 0){

                  if( addressQcounter < US_ADDRESS_LENGTH){

                    if(addressQcounter == 0)
                      speechOutput= 'please tell me the street address, you can say tell cognito street, followed '
                                    + 'by a number and street name';
                    else
                      speechOutput= 'please tell me the '+usAddressQ[addressQcounter]+
                                     ', you can say tell cognito, city, state, or zip, followed by your response.';
                  }
               }
               else if(question.FieldSubType=="InternationalAddress"){
                   speechOutput="I'm sorry, the next questions asks about international addresses. "+
                   " International addresses are not supported for this skill yet.";

                   speechOutput+=' You can say cognito skip, to skip this quesion.'
               }

               else{
                 speechOutput="The next question asks, for an address, do I"+
                              " have permission to use it? You can say tell cognito answer yes, or no.";

               }

                 this.response.speak(speechOutput);
                 this.emit(':responseReady');

            }
            else {
               speechOutput = 'I have a question for you, '+question.Name+',';


            for(var i = 0; i < question.Choices.length; i++){
              speechOutput+= 'option '+(i+1)+', '+question.Choices[i].Label+', ';

            }

            speechOutput+= ' you can say tell cognito answer, date, or time, followed by your response.';
            this.response.speak(speechOutput);
            this.emit(':responseReady');

        }
      }
    },


  'answerIntent' : function(){

    var formAns;
    var slotData= this.event.request.intent.slots;

    if(slotData.response.value != null)
       formAns= slotData.response.value;
    else if(slotData.date.value != null)
       formAns= slotData.date.value;
    else if(slotData.street.value != null)
        formAns= slotData.street.value;
    else if(slotData.city.value != null)
        formAns= slotData.city.value;
    else if(slotData.state.value != null)
        formAns= slotData.state.value;
    else if(slotData.zip.value != null)
        formAns= slotData.zip.value;
    else
       formAns=slotData.time.value;


    //  this.response.speak(formAns);
    //  this.emit(':responseReady');


    var incorrectInput= "I'm sorry, your answer is outside the given options,"
     +" if you want to hear the question and choices again, say reprompt.";

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

         switch(question.FieldType){ // switch statement that formats answers by fieldtype, and fieldsubtype

              case "YesNo":

                  formAns=Cog.yesNo(formAns,incorrectInput);

                  if(formAns != "true" && formAns != "false"){
                    this.response.speak(incorrectInput);
                    this.emit(':responseReady');
                  }
                  else{
                    answers.push( new ansObject(question.InternalName, formAns));

                    questionCounter++;
                    speechOutput= 'Storing answer, '+ formAns;
                  }
                  break;

              case "Choice":

                 if(question.FieldSubType == "Checkboxes")
                   formAns=Cog.checkBoxes(formAns);

                   answers.push( new ansObject(question.InternalName, formAns));

                   questionCounter++;
                   speechOutput= 'Storing answer, '+ formAns;

                   break;

             case "Date":

                  if(question.FieldSubType == "Time")
                    formAns= Cog.time(formAns);

                  answers.push( new ansObject(question.InternalName, formAns));

                   questionCounter++;
                   speechOutput= 'Storing answer, '+ formAns;

                  break;

            case "RatingScale":
                  if(multiAns.length <= rateQuestions.length){

                     var rQuestion=rateQuestions[multiQcounter].InternalName;

                     multiAns.push(new ansObject(rQuestion,formAns));
                     multiQcounter++;

                     speechOutput="storing, "+formAns;

                  }

                  if(multiQcounter >= rateQuestions.length){

                        speechOutput="processing, rate scale answers";
                        formAns='{ ';

                        for(var i=0; i < multiAns.length; i++){
                            formAns+= '"'+multiAns[i].key+'"'+ ':'+'"'+multiAns[i].value+'",';
                        }

                        formAns= formAns.replace(/,+$/, "")+'}';

                        answers.push( new ansObject(question.InternalName, formAns));
                        questionCounter++;
                        multiQcounter=0;
                        multiAns=[];
                  }


                  break;
            case "Address":
                 if(formAns == 'yes'){
                     addressQcounter++;
                     this.emit('nextQuestionIntent');
                 }
                 else if(formAns == 'no'){
                     this.emit('skipQuestionIntent');
                 }
                 else{
                     multiAns.push(new ansObject(usAddressQ[addressQcounter], formAns));
                     speechOutput= "storing "+ formAns;
                      addressQcounter++;

                      if(addressQcounter >= US_ADDRESS_LENGTH){

                          formAns='{ ';

                          for(var i=0; i < multiAns.length; i++){
                            formAns+= '"'+multiAns[i].key+'"'+ ':'+'"'+multiAns[i].value+'",';
                          }

                          formAns= formAns.replace(/,+$/, "")+'}';
                          answers.push( new ansObject(question.InternalName, formAns));

                          questionCounter++;
                          addressQcounter= -1;
                          multiAns=[];

                          speechOutput+=' ,processing address'; //, pushing '+question.InternalName+', '+formAns;
                      }
                 }
                  break;
            default:
                    speechOutput="I'm sorry, but something went awry";
                   break;
         }//end of switch


         if(questionCounter % 2 == 0 && questionCounter > 0 ){
             speechOutput+=' ,'+(form.Fields.length-questionCounter)+' questions remain';
         }

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

  'skipQuestionIntent' : function(){
    questionCounter++;
    this.emit('nextQuestionIntent');
  },
  //Todo make submitIntent create a form entry to cognitoforms
  'submitIntent' : function(){


    if(questionCounter == form.Fields.length ){//answers.length == form.Fields.length){ //submission only allowed if all questions answered
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
            else if(question.FieldType == "RatingScale"|| question.FieldType == "Address"){
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
      speechOutput='Please answer all questions before you submit your form. '+questionCounter+', '+form.Fields.length ;
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

         formName;
         form;
         rateQuestions;
         questionCounter = -1;
         multiQcounter=0;
         addressQcounter= -1;
         answers=[];
         multiAns=[];
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
