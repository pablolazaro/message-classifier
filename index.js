const BrainJSClassifier = require('natural-brain');
const training = require('./data/train.json');
const classifier = BrainJSClassifier.restore(training);
const argv = require('process').argv;


console.log(`"${argv[2]}"`, '->', classifier.classify(argv[2])); 
