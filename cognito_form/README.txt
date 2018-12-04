Description:

Thisproject requests a form from Congito forms, filling out the form through Alexa, and then submitting
a form.

The work behind the scenes is called by event handlers through Alexa Skills services hosted on Amazon web servers.
these event handlers are known as Intents. These intents are triggered by a set of words spoken by the user, known as an utterance.

Requirements:

Node.js, npm, Alexa Skills Kit Command Line Interface (npm install -g ask-cli once node.js and npm installed.).
Amazon develper account, and AWS amazon account

Style guide: https://google.github.io/styleguide/jsguide.html


Intents:

GetNewFormIntent-retrieve the form to read.

utterance- [tell|ask] cognito [ to show form|
                                    to add form|
                                    to get form|
                                    show me form|
                                    give me form|
                                    get new form|
                                    get form]


nextQuestionIntent- prompts alexa to ask the next questions.
*note a new question can not be asked until the previous one is answered, instead the current question is repeated.

utterance- [tell|ask] cognito [ anymore questions|next|next question]


answerIntent- listens for the answer to a form question.

utterance- tell cognito option [number]


repromptIntent- reprompts the user with the current question and options.

utterance- tell cognito reprompt


repeatAnswersIntent- Alexa will repeat the answers to the question that have been answered so far. 
If no questions have been Alexa will tell the user they have not provided any answers yet.

utterance- tell cognito repeat [my form answers|my answers|answers]


YesIntent- Follow up confirmation that the users stored answers are correct. When triggered Alexa replies "perfect!"

utterance- tell cognito Yes


NoIntent- Follow up confirmation that the users stored answers are incorrect. When triggered Alexa prompts the user to restart the form.

utterance tell cognito No

submitIntent- prompts Alexa to submit the completed form to cognitoforms.com

utterance- tell cognito submit form

