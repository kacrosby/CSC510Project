const { config } = require('../config/config');

class ChatReceiver {

    constructor(event_storage, chat_client) {
        this.event_storage = event_storage;
        this.chat_client = chat_client;
    }

    find_command(message) {
        //Check for the individual functions here
        if(message.indexOf(factory.config.command_triggers.current_rankings) >= 0) {
            this.event_storage.add_event(factory.Date.now(), "current rankings", {});
        }
    }

    async run() {
        this.chat_client.register_callback(this.find_command.bind(this));
    }
}

const factory = {
    ChatReceiver,
    Date,
    config
}

module.exports = factory;
