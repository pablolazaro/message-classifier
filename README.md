# message-classifier

Process a message and classifies it according to [Angular's commit convention](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type).

## Training classifier

Before use it you should prepare the classifier. In order to do it you need to execute `npm run prepare`.

This script clones Angular repository, extracts commit messages from its log and uses those to teach classifier how to get types from messages properly.
