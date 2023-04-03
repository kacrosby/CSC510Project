const cron = require('node-cron');

const {config} = require('../config/config');


class Scorer {

    constructor(event_storage, chat_composer) {
        this.event_storage = event_storage;
        this.chat_composer = chat_composer;
        this.last_check_time = 0;
    }
    
    calculate_standings(){
        let events = this.event_storage.get_events_between(
            0, factory.Date.now());
        let standings = {};
        for(var event of events){ 
            if(event.event_type in factory.config.scorer.event_types){
                standings = this.tally_event(standings, event);
            } 
        }

        return standings;
    }

    check_for_command(events){
        for(var event of events){
            if(event.event_type == 'current rankings'){
                this.handle_command_scoreboard();
            }
        }
    }

    check_for_notifications() {
        console.log('Scorer - check_for_notifications - Enter');
        let events = this.get_events();
        console.log(`Events: ${events}`);
        this.check_for_command(events);
        console.log('Scorer - check_for_notifications - Exit');
    }

    ensure_user(item, user){
        if(!(user in item)){
            item[user] = 0;
        }
    }

    get_events() {
        console.log('Scorer - get_events - Enter');
        let current_check_time = factory.Date.now();
        let events = this.event_storage.get_events_between(
            this.last_check_time, current_check_time
        )
        this.last_check_time = current_check_time;

        console.log('Scorer - get_events - Exit');
        return events;
    }

    handle_command_scoreboard(){
        let standings = this.calculate_standings();
        this.chat_composer.send_scoreboard(standings);
    }

    tally_event(standings, event){
        var event_type = event.event_type;
        var user = event.metadata.user;
        this.ensure_user(standings, user);
        standings[user] += factory.config.scorer.event_types[event_type].each;
        return standings;
    }

    async run() {
        console.log('Scorer - run - Enter');
        factory.cron.schedule(
            factory.config.scorer.check_cadance, 
            this.check_for_notifications.bind(this) //passing the function as a parameter instead of calling  
        );
        console.log('Scorer - run - Exit');
    }

}

const factory = {
    Scorer, 
    cron,
    Date,
    config
}

module.exports = factory
