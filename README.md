# Cognito Form Alexa app


## Project Title

This project allows a user to request a form from Congitoforms.com, fill out that form and submit it, all through an Alexa app.

## Getting Started
To begin, clone or download the project from https://github.com/SCCapstone/CognitoFormsDev to your desktop.

### Prerequisites

Code editor

Amazon developer account

Amazon Web Services account

Node.js

### Installing/Configuration

1) First open a folder on your desktop where you will store the project. In order to create a git repository in that folder and retrieve the project, use the command:

git clone https://github.com/SCCapstone/CognitoFormsDev.git

2) Next, login into your Amazon Developer Account, and access the developer console
- Choose Create a skill
- Type in a name for the skill; the skill name can be whatever you choose
- Set the default language as appropriate
- Choose 'Custom model' for your skill.
- Click 'Create skill'

3) A prompt asking to choose a template will appear
- Select 'Start from scratch'
- Click 'Choose'

4) You are now under the build section of the Alexa skill
- Select 'Json editor'
- Select 'Drag and drop .json file'
- Navigate to the folder containing the Cognito form project
- Select the en.US.json file located: CognitoFormsDev -> cognito_form -> models -> en.US.json


5) Open a new tab in your browser and navigate to the Amazon Web Services and login
- Select 'Lambda' under the services menu
- Select 'Create function’
- Select 'blue prints'; in the search bar lookup 'Alex-skill-kit-sdk-factskill' and select that option
- Give a name for your lambda function
- Under the 'Role' drop down choose 'Create a custom role'

6) A new page should appear showing IAM Role 'lambda_basic_execution'
- Scroll to the bottom of the page and click "Allow" 

7) You should return to your pevious page, where you named the function. Make sure that all of fields have been entered correctly.
- Scroll down and click the button labeled “Create function”

8) We must now add a trigger for the function
- Select 'Alexa Skill Kit' from the add trigger option
- Make note of the lambda endpoint Id, located at the top right of the page, that is preceded by 'ARN-'

9) Return to your first tab containing the Amazon developer portal
- Select 'Endpoint' under the build tab
- Select the 'AWS Lambda ARN' option
- In the default Region box, place the lambda endpoint Id that you noted back in step 8
- Copy the Skill Id featured above the default Region box
- Return back to the tab with your lambda function configuration


10) Scroll to the bottom of the page 
- Fill in the Skill-ID box with the Skill Id you acquired from step 9
- Click 'Add' when done
- Click on the name of your lambda function to reveal a function editor where the code for the lambda function is stored
- From the downloaded project, copy all lines of code from the  'index.js' file located: CognitoFormsDev -> cognito_form -> lambda -> us-east-1_cognito-skill -> index.js
- Paste that code to the editor containing the lambda code
- Hit the 'Save' button in the top right corner of the page


11) Return to the tab with endpoint (The Alexa Developer Console)
- Save the endpoints
- Save the model
- Build the model

You are now ready to test the skill.

## Running the tests

Test json files can be saved and run locally, using the instructions here: cognito_form/tests/README.txt.
In addition, tests can be run from the test tab of the Amazon developer console.

## Built With

•	Node.js The web framework used

•	AWS Lambda Dependency Management

## Version

1.0.0

## Authors

•	Jeffrey Cocklin - Initial work – tjcocklin

•	See also:  Ayla El-Mereebi, Jaret Kiser, Jake Meisten, Nicholas Belegrino, Kassidy Block

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
