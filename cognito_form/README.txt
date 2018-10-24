Description:

This sample project simulates requesting a form from Congito forms, filling out the form through Alexa, and then submitting
a form.

The work behind the scenes (my code) is called by event handlers through Alexa Skills services hosted on Amazon web servers.
these event handlers are known as Intents. These intents are triggered by a set of words spoken by the user, known as an utterance.

Requirements:

Node.js, npm, Alexa Skills Kit Command Line Interface (npm install -g ask-cli once node.js and npm installed.).
Amazon develper account, and AWS amazon account



Intents:

GetNewFormIntent-retrieve the form to read.

utterance- [tell|ask] cognito form [ to show form|
                                    to add form|
                                    to get form|
                                    show me form|
                                    give me form|
                                    get new form|
                                    get form]


nextQuestionIntent- prompts alexa to ask the next questions.
*note a new question can not be asked until the previous one is answered, instead the current question is repeated.

utterance- [tell|ask] cognito form [ anymore questions|
                                    next|
                                    next question]


answerIntent- listens for the answer to a form question.

utterance- option [number]


repromptIntent- reprompts the user with the current question and options.

utterance- reprompt


submitIntent- prompts Alexa to voice the users answers to the questions that were asked.

utterance- submit form
