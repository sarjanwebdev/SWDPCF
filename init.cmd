pac pcf init --ns SarjanWebDev --n latestrelated1N --t field --run-npm-install
pac pcf init --namespace SarjanWebDev --name latestrelated1N --template field --run-npm-install
pac auth create --url https://org7d6b04b3.crm6.dynamics.com/

npm start
//or to watch changes 'live' use
npm start watch
Unfortunaly if you are using any information from the environment where the solution is going to be deployed you need to test it in that environment (or a test environment that duplicates it). In other words, if you are planning to use the dynamics web api, you need to deploy your solution and test it in your environment. This can be achived with a couple of simple commands.

//firts authenticate (need system administrator/ system costumizer permissions)
pac auth create --url https://myenvironment......
//you can use auth list to see current connecions
pac auth list
//then use cpf push to build a temporary solution and then push it to the environment vi authenticated with
pac pcf push --publisher-prefix swd