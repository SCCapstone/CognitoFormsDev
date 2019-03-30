Description:

This project requests a form from Cognito Forms, allows the user to fill out the form through Alexa, and then submit
a form.

The work behind the scenes is called by event handlers through Alexa Skills services hosted on Amazon web servers.
these event handlers are known as Intents. These intents are triggered by a set of words spoken by the user, known as an utterance.

Requirements:

Node.js, npm, Alexa Skills Kit Command Line Interface (npm install -g ask-cli once node.js and npm installed.).
Amazon developer account, and AWS amazon account

Style guide: https://google.github.io/styleguide/jsguide.html

Launching the skill:

utterance- start cognito

Intents:

GetNewFormIntent-retrieve the form to read.

utterance- get form <response>


nextQuestionIntent- prompts alexa to ask the next questions.
*note a new question can not be asked until the previous one is answered, instead the current question is repeated.

utterance- [anymore questions|next|next question]


answerIntent- listens for the answer to a form question.

utterance- [answer| date| time| street| city| state| zip]<response>


repromptIntent- reprompts the user with the current question and options.

utterance- reprompt


repeatAnswersIntent- Alexa will repeat the answers to the question that have been answered so far.
If no questions have been Alexa will tell the user they have not provided any answers yet.

utterance-  repeat [my form answers| my answers| answers]


submitIntent- prompts Alexa to submit the completed form to cognitoforms.com

utterance- submit form


skipQuestionIntent- Allows the user to skip questions in the form.

utterance- skip

advertiseIntent- Provides the user with randomly selected features about cognitoforms.com

tellMeMoreIntent- Provides information about a feature offered on cognitoforms.com

utterance- tell me more about <feature>

exitIntent- Ends the alexa skill Session.

utterance- end session
