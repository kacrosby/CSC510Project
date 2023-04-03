var chai   = require('chai');
var expect = chai.expect;
var mocha = require('mocha');

process.env.NODE_ENV = 'test'

let event_storage_suite = require('./components/test_event_storage');
let git_receiver_suite = require('./components/test_git_receiver');
let chat_receiver_suite = require('./components/test_chat_receiver');
let chat_composer_suite = require('./components/test_chat_composer');
let mattermost_suite = require('./components/chat-apis/test_mattermost');
let chat_helper_suite = require('./components/chat-apis/test_chat_helper');
let generic_chat_api_suite = require('./components/chat-apis/test_generic_chat_api');
let scorer_suite = require('./components/test_scorer');
let notification_center_suite = require('./components/test_notification_center');
let config_override_suite = require('./config/test_config_override');
let index_suite = require('./test_index');


// Turn off logging
console.log = function(){};
console.error = function(){};


mocha.describe('components/event_storage.js', event_storage_suite.suite);
mocha.describe('components/git_receiver.js', git_receiver_suite.suite);
mocha.describe('components/chat_receiver.js', chat_receiver_suite.suite);
mocha.describe('components/chat_composer.js', chat_composer_suite.suite);
mocha.describe('components/chat-apis/mattermost.js', mattermost_suite.suite);
mocha.describe('components/chat-apis/chat_helper.js', chat_helper_suite.suite);
mocha.describe('components/chat-apis/generic_chat_api.js', generic_chat_api_suite.suite);
mocha.describe('components/event_storage.js', event_storage_suite.suite);
mocha.describe('components/scorer.js', scorer_suite.suite);
mocha.describe('components/notification_center.js', notification_center_suite.suite);
mocha.describe('config/config_override.js', config_override_suite.suite);
mocha.describe('index.js', index_suite.suite);
