# Cognito Form Alexa app


## Project Title

This project allows a user to request a form from Congitoforms.com, fill out that form and submit it, all through an Alexa app.

## Getting Started
To begin, clone or download the project from https://github.com/SCCapstone/CognitoFormsDev to your desktop.

### Prerequisites

Code editor

Amazon developer account

Amazon Web Services account

### Installing/Configuration

First open a folder on your desktop to store the project. Create a git repository in the folder and retrieve the project using the command:

git clone https://github.com/SCCapstone/CognitoFormsDev.git

Next, login into your amazon developer account, and access the developer console. Choose “create a skill”. The skill name can be whatever you choose, set the default language as appropriate, and choose “custom model” for your skill. Click “Create skill”.
A prompt asking to choose a template will appear, select “Start from scratch”, and click Choose. You are now under the build section of the Alexa skill; select “Json editor”, followed by “Drag and drop .json file”.
Navigate to the folder containing the Cognito form project. Select the en.US.json file located: CognitoFormsDev->cognito_form->models->en.US.json.


Open a new tab in your browser and navigate to the Amazon Web Services and login. Select “lambda” under the services menu. Select “create function’, followed by “blue prints”; in the search bar lookup “Alex-skill-kit-sdk-factskill” and select the option. At the button of the page select “configure”
Give a name for your lambda function, and under the existing role drop down choose “lambda_basic_execution”, scroll to the bottom of the page and click “create function” 
We must now add a trigger for the function, select “Alexa skill skit” from the add trigger option. Make note of the lambda endpoint Id, located at the top right of the page, that is preceded by “ARN-”. 


Return to your first tab containing the Amazon developer portal. Select “endpoint” under the build tab and select the “AWS Lambda ARN” option. In the default Region box, place the lambda endpoint Id. Copy the skill Id featured above the default Region box, before returning to the tab with your lambda function configuration.


Scroll to the bottom of the page and fill in the Skill-ID box with, the skill Id you acquired from the other page and click “Add” when done. Click on the name of your lambda function, to reveal a function editor where the code for the lambda function is stored.
From the downloaded project, copy the “index.js” file located: CognitoFormsDev->cognito_form->lambda->us-east-1_cognito-skill->index.js. to the editor containing the lambda code and hit the “Save” button in the top right corner of the page.


Return to the tab with endpoint, and save the endpoints, save the model, and build the model. You are now ready to test the skill. 

## Running the tests

Tests can be run from the test tab of the Amazon developer console. In addition, test json files can be saved and run from test option located at the Lambda function endpoint.


## Built With

•	Node.js The web framework used

•	AWS Lambda Dependency Management

## Version

1.0.0

## Authors

•	Jeffrey Cocklin - Initial work – tjcocklin
•	See also:  Ayla El-Mereebi, Jaret Kiser, Jake Meisten, Nicholas Belegrino

## License
This project is licensed under the MIT License - see the LICENSE.md file for details

