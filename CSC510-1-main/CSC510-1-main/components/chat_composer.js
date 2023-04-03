const format = require("python-format-js");

const { config } = require('../config/config');

class ChatComposer {

    constructor(chat_api) {
        this.chat_api = chat_api;
    }

    send_individual(event) {
        let user = event.metadata.user;
        let title = event.metadata.title;
        let event_type = event.event_type;
        var msg = this.random_message(factory.config.event_messages.finished_messages[event_type]).format(user, title);
        this.chat_api.send_message(msg);
    }

    send_record(user, event_type, new_record) {
        let msg = this.random_message(factory.config.event_messages.record_messages).format(user, new_record, event_type);
        this.chat_api.send_message(msg);
    }

    send_streak(user, event_type, streak) {
        let msg = this.random_message(factory.config.event_messages.streak_messages).format(user, event_type, streak);
        this.chat_api.send_message(msg);
    }

    standings_sorter(a, b) {
        if(a[1] < b[1]) {
            return 1;
        } else if(a[1] > b[1]) {
            return -1
        } else {
            return 0;
        }
    }
    send_scoreboard(standings){
        let itemized_standings = Object.entries(standings);
        itemized_standings.sort(this.standings_sorter);
        let msg_lines = [];
        if (itemized_standings.length === 0) {
            msg_lines.push(factory.config.event_messages.empty_scoreboard);
            let msg = msg_lines.join("\n");
            this.chat_api.send_message(msg);
        } else {
            msg_lines.push(factory.config.event_messages.scoreboard_heading);
            for (let i = 0; i < itemized_standings.length; i++) {
                let user = itemized_standings[i][0];
                let score = itemized_standings[i][1];
                let emoji = '⭐'
                while (i + 1 < itemized_standings.length && itemized_standings[i + 1][1] == score) {
                    user += ", " + itemized_standings[i + 1][0];
                    i += 1;
                }
                if(msg_lines.length === 1){
                    let emoji ='🥇';
                    let message = factory.config.event_messages.scoreboard_display_line;
                    let formatted_message = message.format(emoji, msg_lines.length, score, user);
                    msg_lines.push(formatted_message);
                    continue;
                }
                if(msg_lines.length === 2){
                    let emoji = '🥈';
                    let message = factory.config.event_messages.scoreboard_display_line;
                    let formatted_message = message.format(emoji, msg_lines.length, score, user);
                    msg_lines.push(formatted_message);
                    continue;
                }
                if(msg_lines.length === 3){
                    let emoji = '🥉';
                    let message = factory.config.event_messages.scoreboard_display_line;
                    let formatted_message = message.format(emoji, msg_lines.length, score, user);
                    msg_lines.push(formatted_message);
                    continue;
                }
                let message = factory.config.event_messages.scoreboard_display_line;
                let formatted_message = message.format(emoji, msg_lines.length, score, user);
                msg_lines.push(formatted_message);
            }

            let msg = msg_lines.join("\n");
            this.chat_api.send_message(msg);
        }
    }

    random_message(message_list){
        return message_list[factory.Math.floor(factory.Math.random() * message_list.length)];
    }

}

const factory = {
    ChatComposer,
    Math,
    config
}

module.exports = factory
