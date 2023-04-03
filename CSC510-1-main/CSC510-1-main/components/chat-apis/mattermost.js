const Client = require('mattermost-client');
const { GenericChatApi } = require('./generic_chat_api');
const { config } = require('../../config/config');

class Mattermost extends GenericChatApi {

    constructor() {
        super();
        this.host = factory.config.mattermost_config.host;
        this.group = factory.config.mattermost_config.group;
        this.bot_name = factory.config.mattermost_config.bot_name;
        this.client = new factory.Client(this.host, this.group, {});
        this.request = this.client.tokenLogin(process.env.BOTTOKEN);
        this.callback = null;
        this.channel_id = factory.config.mattermost_config.channel_id;
    }

    register_callback(callback) {
        this.callback = callback;
        this.client.on('message', this.on_message.bind(this));
    }

    on_message(msg) {
        if( msg.data.post )
        {
            let post = factory.JSON.parse(msg.data.post);
            this.callback(post.message);
        }
    }

    send_message(msg) {
        this.client.postMessage(msg, this.channel_id);
    }


}

const factory = {
   Mattermost,
   JSON,
   Client,
   config
}

module.exports = factory;
