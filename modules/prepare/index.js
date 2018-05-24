const Listr = require('listr');
const cwd = require('process').cwd();
const execa = require('execa');
const extract = require('../extractor');
const fs = require('fs');
const path = require('path');
const train = require('../trainer');
const util = require('util');
const access = util.promisify(fs.access);

const tasks = new Listr([
  {
    title: 'Cloning repository',
    skip: async () => {
      try {
        await access(path.join(cwd, 'tmp', 'angular'), fs.constants.F_OK);
        return 'Repository already cloned';
      } catch (error) {
        return false;
      }
    },
    task: async () => 
      await execa.stdout('git', ['clone', 'https://github.com/angular/angular.git', './tmp/angular'])
  },
  {
    title: 'Extracting and processing commit messages',
    skip: async () => {
      try {
        await access(path.join(cwd, 'data', 'messages.json'), fs.constants.F_OK);
        return 'Messages already extracted';
      } catch (error) {
        return false;
      }
    },
    task: async () => await extract('./tmp/angular')
  },
  {
    title: 'Training classifier',
    task: async () => await train('./data/messages.json')
  }
]);

console.log('\nPreparing classifier\n');

tasks.run().
  then(() => {
    console.log('\nClassifier ready, try `npm run classify "a message"` to classify a message\n');
  }).  
  catch(err => {
	  console.error(err);
});