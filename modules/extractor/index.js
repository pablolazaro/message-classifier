const cwd = require('process').cwd();
const fs = require('fs');
const path = require('path');
const util = require('util');

const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

const messagesFileDir = path.join(cwd, 'data', 'messages.json');

module.exports = async folder => {
  const git = require('simple-git')(path.join(cwd, folder));
  const log = () => new Promise((resolve, reject) => git.log((err, commits) => err ? reject(err) : resolve(commits)));

  const commits = await log();

  const messages = commits.all.map(commit => commit.message);

  const build = messages.filter(filterByType('build')).map(clear);
  // const docs = messages.filter(filterByType('docs')).map(clear);
  const feat = messages.filter(filterByType('feat')).map(clear);
  const fix = messages.filter(filterByType('fix')).map(clear);
  // const test = messages.filter(filterByType('test')).map(clear);

  const training = { 
    build, 
    // docs, 
    feat, 
    fix, 
    // test 
  };

  try {
    await access(messagesFileDir, fs.constants.F_OK);
  } catch (err) {
    await mkdir(path.join(cwd, 'data'));
  } finally {
    return await writeFile(messagesFileDir, JSON.stringify(training, null, 2), 'utf8');
  }
};

const filterByType = category => {
  return message => {
    const [type, msg] = message.split(':');
    return type.startsWith(category);
  };
};

const clear = message => {
  const [type, msg] = message.split(':');
  return msg ? msg.replace(/\(#[0-9]*\)/, '').trim() : msg;
}