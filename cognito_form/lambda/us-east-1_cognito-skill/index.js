//questionCounter++;/* eslint-disable  func-names */
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


const APP_ID = 'amzn1.ask.skill.6de2dbec-ee9f-4bd8-95dd-4a45efd79b94';
const SKILL_NAME = 'cognito form';

const HELP_MESSAGE ='. You can say get form followed by a form name, or you can say end session... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';

const STOP_MESSAGE = 'Thank you for using the Cognito Form Alexa app, goodbye!';

const HOST_NAME = 'https://services.cognitoforms.com/forms/api/';
const DIR='/forms/';

const US_ADDRESS_LENGTH=4;

var imageObj ={
                   "smallImageUrl": "https://s3.amazonaws.com/cognitoappimage/CognitoEmblemLarge720x480.png",
                   "largeImageUrl": "https://s3.amazonaws.com/cognitoappimage/CognitoEmblemLarge1200x800.png"

                 };

var apiKey = '6e238844-ce7a-489a-be61-fdef351fadd4';
var forms=null;
var formName=null;
var form=null;
var rateQuestions;
var question;
var questionCounter = -1; //used to track what question you are on. -1 means no form loaded.
var multiQcounter=0;
var addressQcounter= -1;
var answers=[];
var multiAns=[];
var usAddressQ=['Line1', 'City', 'State', 'PostalCode'];
var nameArr;
var nameArrCounter=0;
var firstCall = true;
var speechToPass="";
var ansToPass;
var formSubmission = false;
var features=[ 'Card on File',
         'Countries Languages & Currencies',
         'Email Notifications',
         'Entry Management',
         'Form Confirmations',
         'HIPAA Compliance',
         'Integrations',
         'Lookup Field',
         'Quantity Limits',
         'Rating Scales',
         'Responsive Forms',
         'Security',
         'Spam Prevention',
         'Style Customization',
         'Template Sharing',
         'Unlimited Forms & Fields',
         'Website Embedding',
         'Calculations',
         'Entry Sharing',
         'Conditional logic',
         'File uploads',
         'Data Encryption',
         'Multipage forms',
         'Electronic signatures',
         'Payment'
    ];


var cogFeaturesBackup= {
    "list":[

     {
        "feature": "card on file",

        "description": "Your customers only need to enter their credit card information once. You can then authorize charges by storing the card in Stripe’s or Square’s secure and PCI-compliant environment for later use. Use Card on File to simplify recurring payments, subscriptions, installments, or any time when you don’t know what the final charges will be. It’s that easy."


     },

    {
          "feature": "countries languages and currencies",

          "description":"Create forms that can reach your users around the world. Your forms will be able to display dates, numbers, currencies and text in ways that are familiar, creating a greater sense of trust with your customers."
    },

    {
          "feature": "email notifications",

          "description":"Create custom email notifications to share with your customers and staff after new entries are submitted. Personalize these emails by editing the subject, writing the message, and including options like entry details, payment information, uploaded files, and document copies of entries. Email notifications are available on every plan level, from free and above. Additionally, Cognito Forms offers several advanced options for organizations on our Pro, Team, and Enterprise plans."
    },

    {
          "feature": "entry management",

          "description":"In Cognito Forms, you can sort through and filter down your entries, create customized data sets, and perform multiple tasks at once. If your form has a ton of entries, trying to make individual status updates or deleting them all one by one can be quite a tedious task. Instead, take advantage of the ability to perform operations on multiple entries at once. Export all the data you need directly into Excel for easy management and third-party imports. Nothing is lost in translation, making it easy to track trends, create fancy charts, and run additional calculations."
    },

    {
          "feature": "form confirmations",

          "description":"Once your customers have completed your form, it's important to assure them that their submission was successful, and to provide them with a record of their entry. With the ability to include documents, embed form data, and add URL redirects, you can create custom confirmation messages that provide your users helpful information with a personal touch. Allow your users to immediately view their submission details on your confirmation page after they press submit. They can also download and print out a PDF file or Word document containing their entry information directly from the page. For forms with payment, Cognito Forms will automatically generate a receipt alongside the entry information."
    },

    {
          "feature": "hipaa compliance",

          "description":"Patients expect to be able to communicate with their providers electronically, but security concerns make this difficult. Federal electronic medical records rules mandate electronic communications, but provide no solutions that are cost-effective.Cognito Forms solves these problems by making it easy to build HIPAA-compliant forms for new patient registration, appointment scheduling, refill requests, patient satisfaction surveys and even online bill payment. All of these great capabilities are available, including unlimited forms and unlimited entries, to organizations on our Enterprise plan."
    },

    {
          "feature":  "integrations",

          "description":"Quickly integrate with third-party apps and put your forms to work. Using Microsoft Flow, Zapier, Sharepoint, webhooks, and word press plugins. "
    },

    {
          "feature": "lookup field",

          "description":"A Lookup Field enables one form to look up, data from another form. You can then use that data to populate dropdowns, perform calculations, or display text in the new form. You can use look up fields to create Job applications that automatically hide expired positions, surveys that intelligently route themselves to the right people, and sales forms that track prices and inventory"
    },

    {
          "feature": "quantity limits",

          "description":"You can use quantity limits for any scenario in which there's a limit to the number of times a specific value may be selected or entered on your forms."
    },

    {
          "feature": "rating scales",

          "description":"With rating scales aka Likert scales, customers can score you on a number of options, ranking your product or service on a scale that you can customize. It's also easy to use rating scales to gauge interest in a topic or idea. Would your customers be excited to see your product in new colors or are they satisfied with the current options? You’ll never know until you ask."
    },

    {
          "feature": "responsive forms",

          "description":"No matter where they are or what device they're using, your customers can use Cognito Forms without any headache. Desktop, tablet and smartphone, all living in happy forms harmony."
    },

    {
          "feature": "security",

          "description":"Cognito Forms uses SSL encryption and is always accessed over HTTPS 100% of the time for all users. SSL, Secure Sockets Layer, is the standard for ensuring data is encrypted when being sent to a web server from a browser."
    },

    {
          "feature": "spam prevention",

          "description":"Our forms use what's known as a “smart” captcha. We have rules in place that automatically detect spam bots based on how the form is used. As long as your customers are humans, the captcha won't appear and frustrate your users, and you'll block any nasty spam entries."
    },

    {
          "feature":  "style customization",

          "description":"With a plethora of font types and colors to choose from, you can make your form look exactly the way you pictured in your head. Set unique attributes for different form elements including Headings, Labels, Text, Links, and Buttons, change the style of your fields, and set unique backgrounds colors and images."
    },

    {
          "feature": "template sharing",

          "description":"With template sharing, you can publish your form and send out a link to people you know so they can create a new form based off of your template. All the form's fields and logic will be copied so these organizations can start collecting entries without all the hard work."
    },

    {
          "feature": "unlimited forms and fields",

          "description":"The goal of Cognito Forms, first and foremost, is to give you a better way to connect and get data from your customers. We don't want to put all the best features behind a paywall or force you into a monthly plan that doesn’t fit what you need—we want you to be able to collect all the data you need, no matter what. That means that one simple thing will always be true—with every Cognito Forms account, you can make as many forms as you want, with as many fields as you want."
    },

    {
          "feature": "website embedding",

          "description":"We make it super simple to embed your form right into any webpage. No complications, no heavy lifting; just a quick copy and paste of a short code into your HTML. Choose from several embedding options: Seamless the standard option, Iframe compatible with just about any website or service, and AMP completely valid AMP markup for mobile pages."
    },

    {
          "feature": "calculations",

          "description":"Solve your form's math problems on the fly with Cognito Forms' powerful but easy-to-use calculations. Calculations can be used to compute field values based on user input, set default values for form fields, control visibility of fields,sections, and implement rich validation."
    },

    {
          "feature": "entry sharing",

          "description":"With entry link sharing enabled on your form, you can send your users entry links that allow them to either make changes, or to just review their information. These links can be available for an infinite amount of time, or you can set an automatic expiration date. You can also choose whether you want to share a direct link to the entry, or send a notification/confirmation email to the user with the link included."
    },

    {
          "feature": "conditional logic",

          "description":"Conditional logic makes viewing your form an easier, more intuitive task for your users. Whether you want to show or hide certain fields and pages, allow your users to pay when they want, send emails to people at specific times, or conditionally require a field, there are endless possibilities to make your form look better and flow more efficiently."
    },

    {
          "feature":  "file uploads",

          "description":"With file upload fields, your customers can upload their resumes, cover letters, photos, spreadsheets, and more with their form entries. If your customers have one file or ten, it won't matter—we'll still take care of them. Files start uploading right away instead of waiting until they click “Submit”, and we provide a handy little upload progress bar if they're adding a large file."
    },

    {
          "feature": "data encryption",

          "description":"From file attachments to phone numbers, there is no limit to the type or number of fields that you can protect. When you protect a field, that field’s data will no longer appear in notification or confirmation emails. Also, when integrating encrypted entry data, it will only be sent to a JSON endpoint over a secure connection. Essentially, your sensitive data can’t insecurely leave your account."
    },

    {
          "feature": "multipage forms",

          "description":"Organize your long forms and complex surveys with page breaks, progress bars and conditional pages. By separating the form into multiple pages and sections, it's not only better organized in terms of information, but also keeps your users more engaged through every step of the process."
    },

    {
          "feature": "electronic signatures",

          "description":"Electronic signatures are responsive and easy to enter on any device – laptop, tablet, or smartphone. You can sign and submit a form on the go in just a matter of minutes, without the hassle of dealing with a paper copy. Collecting electronic signatures on your forms is as simple as adding the signature field in your form builder. Like any other field, signatures will appear in entries and PDFs once submitted."
    },

    {
          "feature": "payment",

          "description":"Build order forms, event registrations and more in just minutes.Manage every step of the process without ever leaving Cognito Forms. Get details on your transactions, make changes to your orders or even issue refunds in just a few clicks."
    }

    ]


};

//=========================================================================================================================================
//Handler and function sections
//=========================================================================================================================================

function ansObject(question, ans, type, subType){
    this.key = question;
    this.value= ans;
    this.type= type;
    this.subType= subType;

}





class helperFunctions{

      static getRandomInt(max) {
           return Math.floor(Math.random() * Math.floor(max));
      }



}

// https://services.cognitoforms.com/forms/api/6e238844-ce7a-489a-be61-fdef351fadd4/forms
const handlers = {
    'LaunchRequest': function () {

            var speechOutput= "Welcome to the cognito form app, here's a list of the available forms ";
            var repromptSpeech="You can say cognito get form followed by a form name.";

            var cardTitle="Welcome to Cognito Forms";
            var cardContent= '';

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

                     for(var i=0; i < forms.length; i++){
                        speechOutput+= ', '+forms[i].InternalName;
                        cardContent+= forms[i].InternalName+', ';

                     }
                      speechOutput+= HELP_MESSAGE;
                      cardContent+= HELP_MESSAGE;

                      this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);


                  }
                  else{                              // the forms do not exist.
                      speechOutput="I'm sorry, no forms are currently available";
                      this.emit(':ask',speechOutput, repromptSpeech);
                  }
             });

        });


    },

    'GetNewFormIntent': function () {

       formName = this.event.request.intent.slots.form_name.value;
       var speechOutput;

       var prompt= ". Say start, to begin the form.";

       var cardTitle;

       var capitalizeLetter = formName.slice(0,1).toUpperCase();
       cardTitle =formName.replace(formName.slice(0,1), capitalizeLetter);


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
                 speechOutput='Readying form, '+formName+ ''+prompt ;

                this.emit(':askWithCard', speechOutput, prompt, cardTitle, prompt, imageObj);

              }
              else{                              // the form requested does not exist.
                  speechOutput="I'm sorry, that form is unavailable";
                  this.emit(':ask', speechOutput, prompt);
              }
         });

    });

  },


    'nextQuestionIntent' : function(){

      var speechOutput;
      var repromptSpeech;

      var cardTitle;
      var cardContent;


      if(form == null){
        speechOutput="You have not loaded a form yet, say get form followed by a form name.";
        repromptSpeech= speechOutput;

        this.emit(':ask', speechOutput, repromptSpeech);
      }
      else if(questionCounter < 0 || questionCounter >= form.Fields.length){
        speechOutput = 'All questions have been answered, you can say repeat my answers, or submit form';
        repromptSpeech= speechOutput;

        this.emit(':ask', speechOutput, repromptSpeech);
      }

      else{

            question = form.Fields[questionCounter]; //gets current question based on questionCounter

            //speechOutput= question.Name.FieldType;

            ///this.emit(':ask', speechOutput, repromptSpeech);

            if(question.FieldType == "YesNo"|| question.FieldType == "Choice"||
              question.FieldType =="Boolean" ){

                var questionSentence =question.Name.split(' ');

                if(questionSentence.length == 1){
                  speechOutput = 'What is the '+question.Name+'? The options are: '; //starts by inputing default beginning

                  for(var i = 0; i < question.Choices.length; i++){

                     speechOutput+= 'option '+(i+1)+', '+question.Choices[i].Label+', ';
                  }

                  speechOutput+="say answer, followed by your response.";
                  repromptSpeech= speechOutput;

                  cardTitle=''+question.Name;
                  cardContent= repromptSpeech;

                  this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
                }
                else{
                  speechOutput = ''+question.Name+'? The options are: '; //starts by inputing default beginning

                  for(var i = 0; i < question.Choices.length; i++){

                     speechOutput+= 'option '+(i+1)+', '+question.Choices[i].Label+', ';
                  }

                  speechOutput+="say answer, followed by your response.";
                  repromptSpeech= speechOutput;

                  cardTitle=''+question.Name;
                  cardContent= repromptSpeech;

                  this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
                //   this.response.speak(speechOutput);
                //   this.emit(':responseReady');
             }
            }
            else if(question.FieldType =="RatingScale"){

               rateQuestions=question.ChildType.Fields;

               if(multiQcounter < rateQuestions.length ){
                   var rQuestion=rateQuestions[multiQcounter].InternalName;


                   speechOutput = 'How would you rate '+rQuestion+' of '+question.Name+', the options are: ';

                   for(var i = 0; i < question.Choices.length; i++){
                     speechOutput+= question.Choices[i].Label+', ';

                   }
                   speechOutput+= 'you can say answer, followed by your response';
                   repromptSpeech = speechOutput;
                   cardTitle = '' + question.Name;

                   cardContent = repromptSpeech;

                   this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
               }
            }
            else if(question.FieldType =="Address"){


               if(question.FieldSubType=="USAddress" && addressQcounter >= 0){

                  if( addressQcounter < US_ADDRESS_LENGTH){

                    if(addressQcounter == 0)
                      speechOutput= 'please tell me the street address, you can say street, followed '
                                    + 'by a number and street name';
                    else
                      speechOutput= 'please tell me the '+usAddressQ[addressQcounter]+
                                     ', you can say, city, state, or zip, followed by your response.';
                  }
               }
               else if(question.FieldSubType=="InternationalAddress"){
                   speechOutput="I'm sorry, the next questions asks about international addresses. "+
                   " International addresses are not supported for this skill yet.";

                   speechOutput+=' You can say skip, to skip this quesion.';
               }

               else{
                 speechOutput="The next question asks, for an address. Do I"+
                              " have permission to use it? You can say answer yes, or no.";

               }
                repromptSpeech = speechOutput;
                cardTitle = '' + question.Name;

                cardContent = repromptSpeech;

                this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

            }
            else if(question.FieldType== "Name"){
                   speechOutput="";
                   //speechOutput+= speechToPass;
                   if(firstCall){

                       var temp= question.Format;

                       for(var i=0; i < question.Format.length; i++){
                           if(temp.charAt(i)=='[')
                               temp= temp.replace('[','');

                           if(temp.charAt(i)==']')
                               temp= temp.replace(']','');
                       }

                       nameArr= temp.split(' ');
                       firstCall= false;

                   }
                   if(nameArr[nameArrCounter] == "Prefix")

                      speechOutput+="What is the title?"+
                      " you can say answer, followed by your response.";

                   else if(nameArr[nameArrCounter]=="Suffix")

                      speechOutput+= "What is the suffix";

                   else if(nameArr[nameArrCounter]=="MiddleInitial")

                      speechOutput+= "What is the Middle initial";

                   else
                      speechOutput+= "What is the "+nameArr[nameArrCounter]+
                      " name, you can say answer followed by your response";

                  repromptSpeech = speechOutput;
                  cardTitle = '' + question.Name;

                  cardContent = repromptSpeech;

                this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

            }
            else if(question.FieldType == "Signature"){

                    speechOutput="I'm sorry, "+question.FieldType+' is not supported for this app.'
                                  +' Say skip, to skip the question.';

                    repromptSpeech = speechOutput;
                    cardTitle = '' + question.Name;

                    cardContent = repromptSpeech;

                    this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);


                  }
                  else if(question.FieldType == "File"){

                          speechOutput="I'm sorry, "+question.FieldType+' is not supported for this app.'
                                        +' Say skip, to skip the question.';

                          repromptSpeech = speechOutput;
                          cardTitle = '' + question.Name;

                          cardContent = repromptSpeech;

                          this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);


                  }
                  else if(question.FieldType == "Text"){

                        var questionSentence =question.Name.split(' ');

                        if(questionSentence.length == 1){
                          speechOutput="What is your "+question.Name+'? Say answer followed by your response.';

                          repromptSpeech = speechOutput;
                          cardTitle = '' + question.Name;

                          cardContent = repromptSpeech;

                          this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                        }
                        else{
                          speechOutput= question.Name+ ' Say answer followed by your response.';

                          repromptSpeech = speechOutput;
                          cardTitle = '' + question.Name;

                          cardContent = repromptSpeech;

                          this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                        }

                  }
                  else if(question.FieldType == "Email"){

                    var questionSentence =question.Name.split(' ');

                    if(questionSentence.length == 1){
                      speechOutput="What is your "+question.Name+'? Say answer followed by your response.';

                      repromptSpeech = speechOutput;
                      cardTitle = '' + question.Name;

                      cardContent = repromptSpeech;

                      this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                    }
                    else{
                      speechOutput= question.Name+'Say answer followed by your response.';

                      repromptSpeech = speechOutput;
                      cardTitle = '' + question.Name;

                      cardContent = repromptSpeech;

                      this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                    }
                  }
                 else if(question.FieldType== "Phone"){

                     var questionSentence =question.Name.split(' ');

                     if(questionSentence.length == 1){
                       speechOutput="What is your "+question.Name+'? Say answer, followed by your phone number.';

                       repromptSpeech = speechOutput;
                       cardTitle = '' + question.Name;

                       cardContent = repromptSpeech;

                       this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                     }
                     else{
                       speechOutput= question.Name+'? Say answer, followed by your phone number.';

                       repromptSpeech = speechOutput;
                       cardTitle = '' + question.Name;

                       cardContent = repromptSpeech;

                       this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                     }


                 }
                 else if(question.FieldType == "Number"){

                   var questionSentence =question.Name.split(' ');

                   if(questionSentence.length == 1){
                     speechOutput="What is your "+question.Name+'? Say answer, followed by your number.';

                     repromptSpeech = speechOutput;
                     cardTitle = '' + question.Name;

                     cardContent = repromptSpeech;

                     this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                   }
                   else{
                     speechOutput= question.Name+'? Say answer, followed by your number.';

                     repromptSpeech = speechOutput;
                     cardTitle = '' + question.Name;

                     cardContent = repromptSpeech;

                     this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                   }


                 }
                 else if (question.FieldType == "Website"){
                   var questionSentence =question.Name.split(' ');

                   if(questionSentence.length == 1){
                     speechOutput="What is your "+question.Name+'? Say answer, followed by your response.';

                     repromptSpeech = speechOutput;
                     cardTitle = '' + question.Name;

                     cardContent = repromptSpeech;

                     this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                   }
                   else{
                     speechOutput= question.Name+'? Say answer, followed by your response.';

                     repromptSpeech = speechOutput;
                     cardTitle = '' + question.Name;

                     cardContent = repromptSpeech;

                     this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                   }

                 }
                 else if(question.FieldType =="Currency"){

                   var questionSentence =question.Name.split(' ');

                   if(questionSentence.length == 1){
                     speechOutput="What is your "+question.Name+'? Say answer, followed by your response.';

                     repromptSpeech = speechOutput;
                     cardTitle = '' + question.Name;

                     cardContent = repromptSpeech;

                     this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                   }
                   else{
                     speechOutput= question.Name+'? Say answer, followed by your response.';

                     repromptSpeech = speechOutput;
                     cardTitle = '' + question.Name;

                     cardContent = repromptSpeech;

                     this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                   }
                 }
                 //or say mark date to set a date,'
                 //+ 'or time to set a time.';
                 else if(question.FieldType == 'Date' && question.FieldSubType =='Date'){

                   var questionSentence =question.Name.split(' ');

                   if(questionSentence.length == 1){
                     speechOutput="What is the "+question.Name+' Say mark date, followed by your response.';

                     repromptSpeech = speechOutput;
                     cardTitle = '' + question.Name;

                     cardContent = repromptSpeech;

                     this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                   }
                   else{
                     speechOutput= question.Name+' Say mark date, followed by your response.';

                     repromptSpeech = speechOutput;
                     cardTitle = '' + question.Name;

                     cardContent = repromptSpeech;

                     this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                   }

                 }
                 else if(question.FieldType == 'Date' && question.FieldSubType =='Time'){
                     var questionSentence =question.Name.split(' ');

                     if(questionSentence.length == 1){
                       speechOutput="What is the "+question.Name+' Say time, followed by your response.';

                       repromptSpeech = speechOutput;
                       cardTitle = '' + question.Name;

                       cardContent = repromptSpeech;

                       this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                     }
                     else{
                       speechOutput= question.Name+' Say time, followed by your response.';

                       repromptSpeech = speechOutput;
                       cardTitle = '' + question.Name;

                       cardContent = repromptSpeech;

                       this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
                   }
                 }
                 else {
                    speechOutput ="I'm sorry, questions using fieldtype "+question.FieldType+" are not supported for this skill."//'I' have a question for you, '+question.Name+',';
                    speechOutput+= ' you can say skip, to move to the next question';

                    repromptSpeech= speechOutput;
                    cardTitle=''+question.Name;

                    cardContent= repromptSpeech;

                    this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

              }// end of terminating else
      }// end of all question conditions
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

    var speechOutput;
    var repromptSpeech="say reprompt, to hear the question again";

    var cardTitle;
    var cardContent;


    if( form == null){ // no form loaded illegal access

      speechOutput='You have not loaded a form yet, say get form followed by a form name.';
      repromptSpeech=HELP_MESSAGE;

      cardTitle=speechOutput;
      cardContent= HELP_MESSAGE;

      this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

    }
    else if(questionCounter >= form.Fields.length  ){ // prevent user from answering past the last question, giving junk data.

      speechOutput='All questions have been answered';
      repromptSpeech='you can say repeat my answers or submit form';

      cardTitle= speechOutput;
      cardContent= repromptSpeech;

      this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

    }
    else {

         var validAns;
         var question= form.Fields[questionCounter]; // moved to prevent out of order access errors

         switch(question.FieldType){ // switch statement that formats answers by fieldtype, and fieldsubtype


              case "YesNo":

                  formAns=Cog.yesNo(formAns,incorrectInput);

                  if(formAns != "true" && formAns != "false"){
                    // this.response.speak(incorrectInput);
                    // this.emit(':responseReady');

                    speechOutput=incorrectInput;
                    repromptSpeech= "say reprompt, to hear the question again";

                    cardTitle="Incorrect Input";
                    cardContent=repromptSpeech;

                    this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                  }
                  else{
                    answers.push( new ansObject(question.InternalName, formAns, question.FieldType, question.FieldSubType));

                    //questionCounter++;
                    var formAnsVerbal= (formAns == "true")? 'yes': 'no';

                    speechOutput= 'Storing answer, '+formAnsVerbal;
                  }
                  break;

              case "Choice":

                  if(question.FieldSubType != "Checkboxes"){
                          validAns=false;

                          for(var i=0; i < question.Choices.length; i++){

                              if(formAns == question.Choices[i].Label.toLowerCase()){


                                  validAns = true;
                                 // speechOutput= formAns+' matches '+question.Choices[i].Label;
                                  i= question.Choices.length;
                              }
                          }

                          if(validAns == false){

                            speechOutput= incorrectInput;
                            repromptSpeech= "say reprompt, to hear the question again";

                            cardTitle=" Incorrect input";
                            cardContent= repromptSpeech;
                             // this.response.speak(incorrectInput);
                             // this.emit(':responseReady');

                             this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
                             break;
                          }

                  }
                  if(question.FieldSubType == "Checkboxes"){

                     var formAnsArr= Cog.checkBoxesArr(formAns);
                     var validAnsCount=0;



                     for(var j=0; j < formAnsArr.length; j++){

                          for(var i=0; i < question.Choices.length; i++){

                                if(formAnsArr[j] == question.Choices[i].Label.toLowerCase())
                                   validAnsCount++;
                          }
                     }

                     if(validAnsCount < formAnsArr.length || formAnsArr.length > question.Choices.length){ //invalid answers given

                             // this.response.speak(incorrectInput+"valid count is "+validAnsCount+" formAnsArr is "+
                             //      formAnsArr.length+"heres the array: "+formAnsArr);
                             // this.emit(':responseReady');
                               speechOutput="One or more of your responses, does not match the given options, "+
                                            repromptSpeech;

                               cardTitle=" Incorrect input";
                               cardContent= repromptSpeech;

                               this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
                               break;
                    }


                       formAns=Cog.checkBoxes(formAnsArr);
                  }

                  answers.push( new ansObject(question.InternalName, formAns, question.FieldType, question.FieldSubType));

                  //questionCounter++;
                  speechOutput= 'Storing answer, '+ formAns;

                   break;

             case "Date":

                  if(question.FieldSubType == "Time")
                    formAns= Cog.time(formAns);

                  answers.push( new ansObject(question.InternalName, formAns, question.FieldType, question.FieldSubType));

                   //questionCounter++;
                   speechOutput= 'Storing answer, '+ formAns;

                  break;

            case "RatingScale":
                 validAns =false;

                 for(var i=0; i< question.Choices.length; i++){

                     if(formAns == question.Choices[i].Label.toLowerCase())
                        validAns=true;
                 }

                //  this.response.speak(validAns);
                //   this.emit(':responseReady');

                  if(multiAns.length <= rateQuestions.length && validAns){

                     var rQuestion=rateQuestions[multiQcounter].InternalName;

                     multiAns.push(new ansObject(rQuestion,formAns, question.FieldType, question.FieldSubType));
                     multiQcounter++;

                     speechOutput="storing, "+formAns;

                    //   this.response.speak(incorrectInput);
                    //   this.emit(':responseReady');


                  }
                  else{

                    repromptSpeech="Say reprompt to hear the question again.";
                    speechOutput="One or more of your responses, do not match the given options. "+repromptSpeech;


                    cardTitle=" Incorrect input";
                    cardContent= repromptSpeech;

                    this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
                    break;
                  }

                  if(multiQcounter >= rateQuestions.length){

                        speechOutput="processing, rate scale answers";
                        formAns='{ ';

                        for(var i=0; i < multiAns.length; i++){
                            formAns+= '"'+multiAns[i].key+'"'+ ':'+'"'+multiAns[i].value+'",';
                        }

                        formAns= formAns.replace(/,+$/, "")+'}';

                        // speechOutput+= ' '+question.Name+' '+formAns;

                        // this.response.speak(speechOutput);
                        // this.emit(':responseReady');


                        answers.push( new ansObject(question.InternalName, formAns,question.FieldType, question.FieldSubType));
                        //questionCounter++;
                        // multiQcounter=0;
                        // multiAns=[];
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
                     multiAns.push(new ansObject(usAddressQ[addressQcounter], formAns, question.FieldType, question.FieldSubType));
                     speechOutput= "storing "+ formAns;
                      addressQcounter++;

                      if(addressQcounter >= US_ADDRESS_LENGTH){

                          formAns='{ ';

                          for(var i=0; i < multiAns.length; i++){
                            formAns+= '"'+multiAns[i].key+'"'+ ':'+'"'+multiAns[i].value+'",';
                          }

                          formAns= formAns.replace(/,+$/, "")+'}';
                          answers.push( new ansObject(question.InternalName, formAns, question.FieldType, question.FieldSubType));

                          //questionCounter++;
                          // addressQcounter= -1;
                          //
                          // multiAns=[];
                          speechOutput+=' ,processing address'; //, pushing '+question.InternalName+', '+formAns;
                      }
                 }
                  break;
            case "Name":

                    if(nameArrCounter < nameArr.length){
                        multiAns.push(new ansObject(nameArr[nameArrCounter], formAns, question.FieldType, question.FieldSubType));
                        nameArrCounter++;

                        speechOutput="storing "+formAns;
                    }

                    if(nameArrCounter >= nameArr.length){

                        formAns='{ ';

                          for(var i=0; i < multiAns.length; i++){
                            formAns+= '"'+multiAns[i].key+'"'+ ':'+'"'+multiAns[i].value+'",';
                          }

                          formAns= formAns.replace(/,+$/, "")+'}';
                          answers.push( new ansObject(question.InternalName, formAns, question.FieldType, question.FieldSubType));

                          //questionCounter++;
                          speechOutput+=" ,processing name fields";

                          //nameArrCounter=0;
                          firstCall=true;

                          //multiAns=[];

                    }


                   break;
            case "Text":
                  answers.push( new ansObject(question.InternalName, formAns, question.FieldType, question.FieldSubType));
                  speechOutput= 'storing '+formAns;
                  //questionCounter++;

                   break;
            case "Email":
                  var newFormAns= formAns.split(' ');
                  formAns='';

                  if(newFormAns.length > 2){ //voice input response
                      for(var i=0; i < newFormAns.length; i++){
                          formAns+=newFormAns[i];
                      }

                      if(formAns.includes('at')){
                          formAns= formAns.replace('at','@');

                      }
                      if(formAns.includes('dot')){
                         formAns= formAns.replace('dot','.');
                      }
                  }

                  else{// typed input response
                       formAns=newFormAns[0]+'@'+newFormAns[1];
                  }

                  answers.push( new ansObject(question.InternalName, formAns, question.FieldType, question.FieldSubType));
                  speechOutput= 'storing '+formAns;

                  //questionCounter++;

                   break;

            case "Phone":
                  // ignore dashes in the input
                var temp='';

                for(var i=0; i < formAns.length; i++){

                    if(formAns.charAt(i) != '-')
                       temp+=formAns.charAt(i);
                  }
                 formAns= temp;


                  //make sure format is 10 numbers
                  if(isNaN(formAns)||formAns.length < 10){

                    repromptSpeech="Say reprompt to hear the question again.";
                    speechOutput="Your response must consist of numbers, and be at least ten digits long. "+repromptSpeech;


                    cardTitle=" Incorrect input";
                    cardContent= repromptSpeech;

                    this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
                    break;
                  }

                  var areaCode = formAns.slice(0,3);
                  var centralOfficeNum = formAns.slice(3,6);
                  var lastFour = formAns.slice(6,10);
                  var extension;

                  if(formAns.length == 10){
                     formAns='('+areaCode+') '+centralOfficeNum+'-'+lastFour;
                  }
                  else{  // format the extension
                      if(formAns.length > 10){
                        var ext=[];
                        extension= formAns.slice(10)

                        for(var i=0; i < extension.length; i++){
                          if(isNaN(extension.charAt(i)) == false){
                              ext.push(extension.charAt(i));
                          }
                        }

                      extension='x';
                      for(var i=0; i < ext.length; i++){
                          extension+= ext[i];
                      }
                      formAns='('+areaCode+') '+centralOfficeNum+'-'+lastFour+extension;
                    }
                  }

                  answers.push( new ansObject(question.InternalName, formAns, question.FieldType, question.FieldSubType));
                  speechOutput= 'storing '+formAns;

                  //questionCounter++;

                   break;

            case "Number":

                  var strFormAns="";
                  var numArr;

                  if(formAns.includes('%'))
                     formAns= formAns.replace('%','')


                  numArr = formAns.split(' ');

                  for(var i=0; i < numArr.length; i++){
                       if(isNaN(numArr[i])== false)
                          strFormAns+= numArr[i];
                  }

                  formAns= strFormAns;



                formAns= Number(formAns);

                if(isNaN(formAns) == true){

                    repromptSpeech="Say reprompt to hear the question again.";
                    speechOutput="Your response must be a number. "+repromptSpeech;


                    cardTitle=" Incorrect input";
                    cardContent= repromptSpeech;

                    this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
                    break;
                 }



                  if(question.FieldSubType =="Integer"){

                    if(question.MinValue != null && question.MaxValue != null){
                         if(formAns < Number(question.MinValue) || formAns > Number(question.MaxValue)){

                            repromptSpeech="Say reprompt to hear the question again.";
                            speechOutput="Your response is outside the range of, "+question.MinValue+
                            " to "+question.MaxValue+', '+repromptSpeech;


                            cardTitle=" Incorrect input";
                            cardContent= repromptSpeech;

                            this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
                            //break;
                         }
                         else{

                           answers.push( new ansObject(question.InternalName, formAns, question.FieldType, question.FieldSubType));
                           //questionCounter++;

                           speechOutput= 'Storing answer, '+ formAns;

                         }

                     }
                     else{

                       answers.push( new ansObject(question.InternalName, formAns, question.FieldType, question.FieldSubType));
                       //questionCounter++;

                       speechOutput= 'Storing answer, '+ formAns;

                     }
                  }
                  else if(question.FieldSubType =="Decimal"){

                    if(question.MinValue != null && question.MaxValue != null){

                       if(formAns < Number(question.MinValue) || formAns > Number(question.MaxValue)){

                          repromptSpeech="Say reprompt to hear the question again.";
                          speechOutput="Your response is outside the range of, "+question.MinValue+
                          " to "+question.MaxValue+' '+repromptSpeech;


                          cardTitle=" Incorrect input";
                          cardContent= repromptSpeech;

                          this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                       }
                       else{

                         answers.push( new ansObject(question.InternalName, formAns, question.FieldType, question.FieldSubType));
                         //questionCounter++;

                         speechOutput= 'Storing answer, '+ formAns;

                       }
                    }
                    else{

                      answers.push( new ansObject(question.InternalName, formAns, question.FieldType, question.FieldSubType));
                      //questionCounter++;

                      speechOutput= 'Storing answer, '+ formAns;

                    }
                  }
                  else if(question.FieldSubType =="Percent"){

                   var min='';
                   var max='';

                   //get the percents of quesion.MinValue and question.MaxValue without the '%' sign.

                   for(var i=0; i < question.MinValue.length; i++){
                       if(question.MinValue.charAt(i) != '%')
                          min+=question.MinValue.charAt(i);
                   }

                   for(var i=0; i < question.MaxValue.length; i++){
                       if(question.MaxValue.charAt(i) != '%')
                          max+=question.MaxValue.charAt(i);
                   }


                    if(question.MinValue != null && question.MaxValue != null){

                       if(formAns < Number(min) || formAns > Number(max)){

                          repromptSpeech="Say reprompt to hear the question again.";
                          speechOutput="Your response is outside the range of, "+question.MinValue+
                          " to "+question.MaxValue+', '+repromptSpeech;


                          cardTitle=" Incorrect input";
                          cardContent= repromptSpeech;

                          this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                       }
                       else{

                         if(question.FieldSubType =="Percent"){
                           formAns= formAns/100;
                         }

                         answers.push( new ansObject(question.InternalName, formAns, question.FieldType, question.FieldSubType));

                         //questionCounter++;

                         if(question.FieldSubType =="Percent"){
                           formAns= (formAns*100)+'%';
                         }
                         speechOutput= 'Storing answer, '+ formAns;

                       }
                    }
                    else{

                      if(question.FieldSubType =="Percent"){
                        formAns= formAns/100;
                      }

                      answers.push( new ansObject(question.InternalName, formAns, question.FieldType, question.FieldSubType));

                      //questionCounter++;

                      if(question.FieldSubType =="Percent"){
                        formAns= (formAns*100)+'%';
                      }
                      speechOutput= 'Storing answer, '+ formAns;

                    }
                  }
                  else{}

                  break;
            case "Website":

                 var newFormAns= formAns.split(' ');
                 formAns="https://";


                  for(var i=0; i < newFormAns.length; i++){
                      formAns+=newFormAns[i];
                  }

                  if(formAns.includes('dot')){
                     formAns= formAns.replace('dot','.');
                  }


                  answers.push( new ansObject(question.InternalName, formAns, question.FieldType, question.FieldSubType));
                  speechOutput= 'storing '+formAns;

                  //questionCounter++;

                  break;

            case "Currency":

                var cents;
                var strFormAns;
                var numFormAns;

                var min= question.MinValue.replace('$','');
                var max= question.MaxValue.replace('$','');


                if(formAns.includes('$'))
                    formAns=formAns.replace('$','');

                // speechOutput="past dollar sign";

                // this.response.speak(speechOutput);
                // this.emit(':responseReady');

                numFormAns = Number(formAns);

                if(isNaN(numFormAns)){

                    cents= formAns.split(' ');
                    strFormAns="";

                    for(var i=0; i < cents.length; i++){

                        if(isNaN(cents[i])==false)
                           strFormAns+= cents[i];
                    }

                    if(Number(strFormAns) < 10)
                       if(Number(strFormAns) < 0 )
                          strFormAns="-0.0"+(Number(strFormAns)*-1);
                       else
                          strFormAns="0.0"+strFormAns;
                    else if(Number(strFormAns)>= 10 && Number(strFormAns) < 100)
                       strFormAns="0."+strFormAns;
                     else
                       strFormAns=""+(Number(strFormAns)/ 100);


                     numFormAns= Number(strFormAns);
                }

                // speechOutput="numFormAns is "+numFormAns;

                // this.response.speak(speechOutput);
                // this.emit(':responseReady');

                // speechOutput="strFormAns is "+strFormAns;

                // this.response.speak(speechOutput);
                // this.emit(':responseReady');


                if(numFormAns < 0){

                    repromptSpeech="Say reprompt to hear the question again.";
                    speechOutput="Your response can not be a negative number. "+repromptSpeech+' you gave: '+formAns;


                    cardTitle=" Incorrect input";
                    cardContent= repromptSpeech;

                    this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
                    break;
                }

                //   speechOutput= 'formAns less than min '+(formAns < Number(question.MinValue))? true: false;
                //   this.response.speak(speechOutput);
                //   this.emit(':responseReady');

                speechOutput="";

                 if(question.MinValue != null && question.MaxValue != null){
                       //speechOutput+=" inside null test";

                   if(numFormAns < Number(min) || numFormAns > Number(max)){

                      repromptSpeech="Say reprompt to hear the question again.";
                      speechOutput="Your response is outside the range of, "+question.MinValue+
                      " to "+question.MaxValue+' '+repromptSpeech;


                      cardTitle=" Incorrect input";
                      cardContent= speechOutput;

                      this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);

                       speechOutput+=" inside error card";
                   }
                   else{
                         //speechOutput+=" inside Else";

                         answers.push( new ansObject(question.InternalName, numFormAns, question.FieldType, question.FieldSubType));
                         //questionCounter++;

                         if(numFormAns < 1){
                            speechOutput= "storing "+'$'+numFormAns;
                         }
                         else{
                             speechOutput="storing "+'$'+numFormAns;
                         }


                   }
                }
                else{
                       //speechOutput+=" outside Else";

                         answers.push( new ansObject(question.InternalName, numFormAns, question.FieldType, question.FieldSubType));
                         //questionCounter++;

                         if(numFormAns < 1){
                            speechOutput= "storing "+'$'+numFormAns;
                         }
                         else{
                             speechOutput="storing "+'$'+numFormAns;
                         }

                }

                   break;
            default:
                    speechOutput="I'm sorry, but something went awry";
                   break;
         }//end of switch

         speechToPass= speechOutput;
         ansToPass= formAns;

         this.emit('answerConfirmIntent');

     }

  },


  'repromptIntent' : function(){
     this.emit('nextQuestionIntent');
  },

  'skipQuestionIntent' : function(){
    questionCounter++;
    this.emit('nextQuestionIntent');
  },


  'submitIntent' : function(){
     formSubmission = true;

     var repromptSpeech;

     var cardTitle;
     var cardContent;

    if( form != null && questionCounter == form.Fields.length ){//answers.length == form.Fields.length){ //submission only allowed if all questions answered
        var speechOutput = '';

        var HOST = 'services.cognitoforms.com';
        var fullPath = '/forms/api/'+apiKey+DIR+formName+'/entry';

        var postData = '{';

        //format the answers data into appropriate JSON syntax
        for (var i=0 ; i<answers.length ; i++)  //combine answers into a single string value
        {
             //todo apply new fieldTypes
            if(answers[i].type == "Choice" && answers[i].subType=="Checkboxes"){
                postData += '"'+answers[i].key+'":'+answers[i].value+',';
            }
            else if(answers[i].type == "RatingScale"){
                postData += '"'+answers[i].key+'":'+answers[i].value+',';
            }
            else if(answers[i].type =="Address"){
                postData += '"'+answers[i].key+'":'+answers[i].value+',';
            }
            else if(answers[i].type == "Name"){
                postData += '"'+answers[i].key+'":'+answers[i].value+',';
            }
            else if(answers[i].type == "Text" ){
                postData += '"'+answers[i].key+'":"'+answers[i].value+'",';
            }
            else if(answers[i].type == "Email" ){
                postData += '"'+answers[i].key+'":"'+answers[i].value+'",';
            }
            else if(answers[i].type == "Phone" ){
                postData += '"'+answers[i].key+'":"'+answers[i].value+'",';
            }
            else if(answers[i].type =="Number"){
                postData += '"'+answers[i].key+'":'+answers[i].value+',';
            }
            else if(answers[i].type == "Website" ){
                postData += '"'+answers[i].key+'":"'+answers[i].value+'",';
            }
            else if(answers[i].type =="Currency"){
                postData += '"'+answers[i].key+'":'+answers[i].value+',';
            }
            else{
                postData += '"'+answers[i].key+'":"'+answers[i].value+'",';
            }

        }

        postData = postData.replace(/,+$/, "")+'}';  //remove the trailing comma//

        // this.response.speak(postData);
        // this.emit(':responseReady');

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
        formSubmission = false;
        speechOutput="your form has been submitted.";
        var cardTitle="Form Submitted";
        var cardContent= "Thank you for using the Cognito Form Alexa app, say end session to exit.";
        var repromptSpeech = speechOutput;

         this.emit(':askWithCard', speechOutput, repromptSpeech,cardTitle, cardContent, imageObj);
         //this.emit('advertiseIntent');
    }
    else if(form ==null){
      formSubmission = false;
      speechOutput='You have not loaded a form yet, say get form followed by a form name.';
      repromptSpeech=HELP_MESSAGE;

      cardTitle=speechOutput;
      cardContent= HELP_MESSAGE;

      this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
    }
    else{
      formSubmission = false;
      speechOutput='Please answer all questions before you submit your form. ';
      var reprompt= speechOutput;
      this.emit(':ask', speechOutput, reprompt);
    }

  },


    'repeatAnswerIntent': function () {

        var speechOutput='';
        var repromptSpeech;

        var cardTitle="Your Answers:";
        var cardContent;

         if (questionCounter < 0 || answers.length <= 0) {
             speechOutput = "You haven't given me enough answers yet. Please fill out your form first," +
             "then I will be able to repeat your given answers.";
             this.emit(':ask', speechOutput, repromptSpeech);

         }
        else {
            for (var i = 0; i < answers.length; i++) {

                speechOutput+= 'For question: '  +  answers[i].key + '. You gave: ';

                if(answers[i].type == "YesNo"){
                    if(answers[i].value == 'true')
                        speechOutput+= 'yes, as your answer. ';
                    else {
                        speechOutput+='no, as your answer. ';
                    }

                }
                else{
                      speechOutput+= answers[i].value + ', as your answer. ';
               }

            }

            var prompt = ' say submit form to complete your submission.';
            speechOutput+= prompt;
            repromptSpeech =prompt;

            cardContent= speechOutput+prompt;

            this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent,imageObj);
      }


    },


    'answerConfirmIntent':function (){
      var formAns= ansToPass;
      var speechOutput= speechToPass;

      var repromptSpeech;
      var cardTitle;

      var cardContent;

      if((questionCounter + 1) % 2 == 0 && questionCounter > 0 ){

          if(question.FieldType == 'RatingScale'|| question.Fieldtype== 'Address'|| question.FieldType =='Name'){


              if(form.Fields.length-(questionCounter+1) == 1){

                  if(nameArrCounter < 1 && addressQcounter < 1 && multiQcounter < 1)
                        speechOutput+=' , only one question remains';

              }
              else{
                  speechOutput+=' ,'+(form.Fields.length-(questionCounter+1))+' questions remain';
              }

          }
          else{
              if(form.Fields.length-(questionCounter+1) == 1)
                 speechOutput+=' , only one question remains';
              else
                 speechOutput+=' ,'+(form.Fields.length-(questionCounter+1))+' questions remain';
          }
      }


      repromptSpeech= "say next, for the next question";

      cardTitle=""+question.InternalName;
      cardContent= ""+formAns;

      speechOutput+=". Are these answers correct?";

      this.emit(':askWithCard', speechOutput, repromptSpeech, cardTitle, cardContent, imageObj);
    },


    'advertiseIntent': function(){

             var feature1= features[helperFunctions.getRandomInt(features.length)];
             var feature2= features[helperFunctions.getRandomInt(features.length)];
             var feature3= features[helperFunctions.getRandomInt(features.length)];

             while(feature2 == feature1)
                feature2=features[helperFunctions.getRandomInt(features.length)];

             while(feature3 == feature2 || feature3 == feature1)
                  feature3= features[helperFunctions.getRandomInt(features.length)];

             var prompt=" Visit cognitoforms.com to utilize more advanced features, such as: "+
                          feature1+','+feature2+','+feature3+" and many more.";

             var prompt2=" To hear more about a feature say, tell me more about, followed by the feature name, or you can say end session.";

             var speechOutput="Your form has been submitted. Thank you for using the Cognito Form Alexa app."+
                              prompt+prompt2;

             var cardTitle="Form Submitted";
             var cardContent= speechOutput;

             var repromptSpeech = speechOutput;
             formSubmission =false;

             this.emit(':askWithCard', speechOutput, repromptSpeech,cardTitle, cardContent, imageObj);


      },

      'tellMeMoreIntent': function(){
         var featureList;
         var slotData= this.event.request.intent.slots.feature.value;
         var match= false;

         var speechOutput;
         var cardTitle;
         var cardContent;

        var repromptSpeech;



         for(var i=0; i < features.length; i++){

              if(slotData == features[i].toLowerCase()){
                  match=true;
                  i= features.length;
              }
        }

         if(match == false){
           speechOutput="I'm sorry, that is not a feature that I know about.";

           cardTitle="Features";
           cardContent= speechOutput

           repromptSpeech = speechOutput;

          this.emit(':askWithCard', speechOutput, repromptSpeech,cardTitle, cardContent, imageObj);
         }
         else{
                   // TODO:  go get the jason file with the descriptions and read the correct one

                  var hostName="https://tjcocklin.github.io/";
                  var file="Cognito_features.json";

                  https.get(hostName+file, (res) => {
                  console.log('statusCode:', res.statusCode);
                  console.log('headers:', res.headers);


                  var returnData='';


                  res.on('data', (d) => {
                      returnData+=d;


                  });

                  res.on('end', () => {
                     featureList = JSON.parse(returnData);

                     for(var i=0; i < featureList.list.length; i++){

                        if(featureList.list[i].feature == slotData){

                           speechOutput= featureList.list[i].description;
                           i= featureList.list.length;
                        }

                     }

                     var capitalizeLetter = slotData.slice(0,1).toUpperCase();
                     cardTitle =slotData.replace(slotData.slice(0,1), capitalizeLetter);

                     cardContent= speechOutput;

                     repromptSpeech = "If you want to hear about more features, you can say tell me more followed by a feature, or end session";

                     this.emit(':askWithCard', speechOutput, repromptSpeech,cardTitle, cardContent, imageObj);

                  });
                });

         }

      },

//built in intents
      'AMAZON.YesIntent': function(){
        if(form != null && formSubmission == false){

            if(question.FieldType == 'RatingScale'){

                if(multiQcounter >= rateQuestions.length){
                  questionCounter++;
                  multiQcounter=0;
                  multiAns=[];
                  this.emit('nextQuestionIntent');
                }
                else{
                  this.emit('nextQuestionIntent');
                }
            }
            else if(question.FieldType== 'Address'){

                  if(addressQcounter >= US_ADDRESS_LENGTH){
                    questionCounter++;
                    addressQcounter= -1;
                    multiAns=[];
                    this.emit('nextQuestionIntent');

                  }
                  else {
                    this.emit('nextQuestionIntent');
                  }
            }
            else if(question.FieldType =='Name'){

                  if(nameArrCounter >= nameArr.length){
                     questionCounter++;
                     nameArrCounter=0;
                     multiAns=[];
                  //   speechToPass+="Triggering if under name";
                     this.emit('nextQuestionIntent');
                  }
                  else{
                    //speechToPass+="Triggering else under name";
                     this.emit('nextQuestionIntent');
                  }
            }
            else{
                //speechToPass+="Triggering outer else condition for non-meta questions. "
                questionCounter++;
                this.emit('nextQuestionIntent');
            }
        }
        else{
           //speechToPass+="Triggering Outer most else form null or in submit phase";
           this.emit('nextQuestionIntent');
        }
      },


      'AMAZON.NoIntent': function(){

        if(form != null && formSubmission == false){
             if(question.FieldType == 'RatingScale'){
                if(multiQcounter >= rateQuestions.length)
                  answers.pop();
                if(multiAns.length > 0 )
                   multiAns.pop();
                if(multiQcounter > 0)
                   multiQcounter--;

                this.emit('repromptIntent');
             }
             else if(question.FieldType== 'Address'){
               if(addressQcounter >= US_ADDRESS_LENGTH)
                  answers.pop();
               if(multiAns.length > 0)
                  multiAns.pop();
               if(addressQcounter > 0)
                  addressQcounter--;

                  // this.response.speak('Enter no under Address');
                  // this.emit(':responseReady');

               this.emit('repromptIntent');
             }
             else if(question.FieldType =='Name'){
               if(nameArrCounter >= nameArr.length)
                  answers.pop();
               if(multiAns.length > 0 )
                  multiAns.pop();
               if(nameArrCounter > 0)
                  nameArrCounter--;

               this.emit('repromptIntent');
             }
             else{
                 if(answers.length > 0)
                    answers.pop();
                    // this.response.speak('Enter no under inner else default case where form loaded and no submit qFieldtype: '+queston.FieldType);
                    // this.emit(':responseReady');
                 this.emit('repromptIntent');
             }
        }
        else{
          // this.response.speak('Enter no under outer most else');
          // this.emit(':responseReady');
            this.emit('repromptIntent');
        }

      },

      'AMAZON.HelpIntent': function () {
              const speechOutput = HELP_MESSAGE;
              const reprompt = HELP_REPROMPT;
              this.emit(':ask', speechOutput, reprompt);

      },


      'exitIntent': function(){
             formName=null;
             form=null;
             rateQuestions=null;
             questionCounter = -1;
             multiQcounter=0;
             addressQcounter= -1;
             answers=[];
             multiAns=[];
             nameArrCounter=0;
             firstCall = true;
             formSubmission = false;

             var speechOutput= STOP_MESSAGE;

             var cardTitle='Exiting Cognito Form';
             var cardContent=STOP_MESSAGE;

            // this.response.shouldEndSession = true;
            this.emit(':tellWithCard', speechOutput, cardTitle, cardContent,imageObj);

      },


      'AMAZON.CancelIntent': function () {
          this.emit('AMAZON.StopIntent');
      },

      'AMAZON.StopIntent': function () {
      //  this.response.shouldEndSession = true;
        this.emit('exitIntent');
      },

      'SessionEndedRequest':function(){
          this.emit(':responseReady');
      }

// end of built in intents

};

exports.handler = function (event, context, callback) {
    //context.callbackWaitsForEmptyEventLoop = false;
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
