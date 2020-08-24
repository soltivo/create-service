# [Configure your Service](#get-started)

<br/>

**NOTE : Your service don't need an env. file, use AWS CLI**

To configure your CLI run
```
aws configure
```

All dependencies are installed by default with the create-service CLI 

<br/>


## [1. Git configuration](#default-configuration)

---

Commit your repo in the master (the CLI already created a Init Commit for you)
```bash
git push # Push on master in the repo assigned to you
```
```bash
git checkout -b <develop> <master> # Create the develop branch
```

<br/>


## [2. Default configuration](#default-configuration)

---

### Start by the environment configurations

1. Open the file `src/helpers/environment.js`

2. Make sure to change the keys with your keys and `API_LINK` for the right value.

```js
global.AWS.secrets = {
    AWS_ACCESS_KEY_ID: 'YOUR KEY',
    AWS_SECRET_ACCESS_KEY: 'YOUR KEY',
    API_LINK: 'YOUR LINK'
};
global.STRIPE.secrets = {
    STRIPE_SECRET_KEY: 'YOUR KEY',
    STRIPE_PUBLIC_KEY: 'YOUR KEY',
    STRIPE_CLIENT_ID: 'YOUR KEY'
}
```
3. If you need to change the region of your service, go in the file `src/helpers/secretsManager.js` and change

```js
const region = process.env.AWS_REGION || 'us-east-1'; // us-east-1 to what ever you need
```

<br/>


## [2. Routes configuration](#routes-configuration)

---

### Create a new folder or file (acording to the number of routes) in src/routes

1. Name the folder/file based on path of the service that you are creating. e.g. `src/routes/chat` for api/chat

2. Require the new file in `src/routes/index.js`
```js
require('./CHANGE THAT')(router, validations);
```

<br/>

## [3. Test configurations](#test-configuration)

---

### Your test will use Chai, Chai-http and Mocha
- [Mocha Documentation](https://mochajs.org/#getting-started)
- [Chai Documentation](https://www.chaijs.com/guide)
- [Chai Http Documentation](https://www.chaijs.com/plugins/chai-http/)

All test need to be done in `src/tests/`

<br/>

## [5. Commands](#default-commands)

---

### The predefined commands go as follow

```bash
npm start # Start the server without auto-restart
```
```bash
npm run dev # Start the server with auto-restart using Nodemon
```
```bash
npm run test # Start the server and run the tests
```

<br/>

## [6. Improvement Guidelines](#improvement-guidelines)

---

### You want to submit improvements to this folder structure?

1. Write your structure

2. Create a Pull Request on the Github

3. Tell us why your structure is better

Voila :)