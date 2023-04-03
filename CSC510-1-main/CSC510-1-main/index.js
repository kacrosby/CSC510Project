const { ChatComposer } = require('./components/chat_composer');
const { ChatReceiver } = require('./components/chat_receiver');
const { EventStorage } = require('./components/event_storage');
const { GitReciever } = require('./components/git_receiver');
const { NotificationCenter} = require('./components/notification_center');
const { Scorer } = require('./components/scorer');
const { get_chat_api } = require('./components/chat-apis/chat_helper');
const { check_default_overrides } = require('./config/config_override.js');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv


class Initiator {

    apply_config_updates() {
        if(factory.argv.config) {
            factory.check_default_overrides(factory.argv.config);
        }
    }

    create_objects() {
        this.event_storage = new factory.EventStorage();
        this.chat_api = factory.get_chat_api();
        this.chat_composer = new factory.ChatComposer(this.chat_api);
        this.notification_center = new factory.NotificationCenter(
            this.event_storage, this.chat_composer);
        this.scorer = new factory.Scorer(
            this.event_storage, this.chat_composer);
        this.git_receiver = new factory.GitReciever(this.event_storage);
        this.chat_receiver = new factory.ChatReceiver(
            this.event_storage, this.chat_api);

    }

    start_components() {
        this.notification_center.run();
        this.scorer.run();
        this.git_receiver.run();
        this.chat_receiver.run();
    }

    main() {
        this.apply_config_updates();
        this.create_objects();
        this.start_components();
    }
}

async function main() {
    if (process.env.NODE_ENV != 'test') {
        let initiator = new factory.Initiator();
        initiator.main();
    }
}

const factory = {
    ChatComposer,
    ChatReceiver,
    EventStorage,
    GitReciever,
    NotificationCenter,
    Scorer,
    get_chat_api,
    check_default_overrides,
    argv,
    Initiator,
    main
}

module.exports = factory;

factory.main();
