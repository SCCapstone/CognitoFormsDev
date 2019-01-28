To run automated tests of the cognito skill, you will require the following:

Node.js, npm, a local copy of the cognito skill

Step 1: Open a folder on your desktop to store the project. Create a git repository in the folder and retrieve the project
        using the command:

        git clone https://github.com/SCCapstone/CognitoFormsDev.git

Step2: install the latest version of Node.js, npm will be included with your download.

Step3: check to make sure your version of npm is up to date by opening a command prompt, and
       using the following command:

        npm -v

        This command will give you the version number of npm that you have.

        If the version is out of date use the following command:

        npm install npm@latest -g

Step4: Install the npm run all module by using the following command:

       npm install-npm-run-all -g

Step5: From the command prompt navigate to the folder containing your local copy of the cognito skill.
       The command prompt should read similar to the sample given below; however, depending on your
       operating system the output may appear differently.

       C:\Users\<userName>\Desktop\<someFolder>\cognito_form>

Step6: Create a package.json using the following command:

       npm init -y

       this is where commands to run the tests will be stored.

Step7: Install the alexa-sdk and aws-sdk modules using the following commands:

        npm i alexa-sdk
        npm install aws-sdk

        A new folder named "node_modules", and folder named "package-lock.json" should appear that
        will contain the necessary modules.

Step8: open the package.json you created in Step6, in your preferred editor. The file should look like this:
      {
        "name": "cognito_form",
        "version": "1.0.0",
        "description": "Description:",
        "main": "index.js",
        "scripts": {
          "test": "echo \"Error: no test specified\" && exit 1"
        },
        "keywords": [],
        "author": "",
        "license": "ISC",
        "dependencies": {
          "alexa-sdk": "^1.0.25",
          "aws-sdk": "^2.392.0"
        },
        "devDependencies": {}
      }

      Replace "test": "echo \"Error: no test specified\" && exit 1", with the following:

      "test1": "node ./tests/launch/test.js",
      "test2": "node ./tests/get_new_form/test.js",
      "test3": "node ./tests/get_next_question/test.js",
      "behave1": "npm-run-all test[1-3]"

Step9: to run a unit test or behavior test, navigate back to the root folder "cognito_form" and give the following command:

     npm run test<number>

     to run behaviors use the command:

     npm run behave<number>

     *note 1: for more detailed json output uncomment the console.log() functions, for each test.js
     *note 2: to test fail conditions for a unit test uncomment var mockEvent = require('./eventFail.json');
              for the desired unit test, and comment out var mockEvent = require('./event.json');
