const cwd = require('process').cwd();
const path = require('path');
const util = require('util');

module.exports = (messagesDir, messagesPerType = 50) => {
  const BrainJSClassifier = require('natural-brain');
  const classifier = new BrainJSClassifier();
  const save = util.promisify(classifier.save);
  const messages = require(path.join(cwd, messagesDir));

  Object.keys(messages).
    forEach(type => {
      messages[type].
        slice(0, messagesPerType).
        filter(m => m).
        forEach(message => classifier.addDocument(message, type));
  });
  
  classifier.train();

  return new Promise((res, rej) => {
    classifier.save('data/train.json', err => {
      if (err) { rej(err)} else { res()}
    })
  })
};
