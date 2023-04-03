const {config} = require('../../config/config');
const { Mattermost } = require('./mattermost');

function get_chat_api() {
   if(factory.config.chat_api.type == "Mattermost"){
       return new factory.Mattermost();
   } else {
       console.error("No chat AI selected in the config");
   }
}

const factory = {
    get_chat_api,
    config,
    Mattermost
}

module.exports = factory;
