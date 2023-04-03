const {config} = require('../config/config');
const cron = require('node-cron');


class NotificationCenter {

    constructor(event_storage, chat_composer) {
        this.event_storage = event_storage;
        this.chat_composer = chat_composer;
        this.last_check_time = 0;
        this.streaks = {};
        this.records = {};
        this.send_notifications_flag = factory.config.notification_center.enable_startup_notifications;
    }

    check_for_individual_notification(event) {
        let event_types = factory.config.notification_center.event_types;
        if (!(event.event_type in event_types)) {
            // Do Nothing.
        } else if (!('individual' in event_types[event.event_type])) {
            // Do Nothing.
        } else if (event_types[event.event_type].individual) {
            this.chat_composer.send_individual(event);
        }
    }

    /**
     * Checks if the user broke their record for this event type.
     * 
     * Checks if this event type is one that record notification is enabled
     * for. Then checks to see if the streak is a new record.
     * 
     * Note: Streaks are only tallied if the event_type exists, so we don't
     * need to verify that the evvent type exists, as that is implied.
     * 
     * @param {string} user The user completing the event.
     * @param {string} event_type The type of event completed.
     * @param {number} streak The number of events completed by the user this
     *     time interval.
     * @param {number} record  The most events completed by the user in one
     *     time interval.
     */
    check_for_new_record(user, event_type, streak, record) {
        let event_types = factory.config.notification_center.event_types;
        if (!('record' in event_types[event_type])) {
            // Do Nothing.
        } else if (!event_types[event_type].record) {
            // Do Nothing.
        } else if (streak > record) {
            this.chat_composer.send_record(user, event_type, streak);
            this.update_record(user, event_type, streak);
        }
    }

    /**
     * Iterates over every user's streaks to see if they are a record.
     * 
     * The this.streaks object will contain information about the events that
     * each user has completed this time interval. Each of these streaks is
     * checked to see if it breaks their record.
     * 
     * Note: This avoids checking records for events users haven't completed,
     * but does check streaks that might not have been updated in the current
     * update. A performance imporovement would be to only check for records
     * if the streak was updated, which is recorded in the event_tally.
     */
    check_for_new_records() {
        for (var user in this.streaks) {
            for (var event_type in this.streaks[user]) {
                let streak = this.streaks[user][event_type];
                let record = this.get_record(user, event_type);
                this.check_for_new_record(user, event_type, streak, record);
            }
        }
    }

    /**
     * Sends any notifications that should be sent based recent events.
     * 
     * This function is the core of the notification center's functionality.
     * 
     * This function will no-op if configured to not send notifications on
     * the first cadence. Not sending notifications the first cadence avoids
     * setting records based no all historic work. 
     * 
     * This function will get all the events that occured since the last
     * update. It will then iterate over each event to both see if an
     * individual notification needs to be send for it and also to tally the
     * number of new events per user. This tally is used to determine if a
     * streak threshold was crossed for an event, and also to update the
     * current streaks with. Finally, it checks if any notifications needs to
     * be sent for any user who has broken a personal record. 
     */
    check_for_notifications() {

        if (!this.send_notifications_flag) {
            this.last_check_time = factory.Date.now();
            return;
        }

        let new_events = this.get_events();
        let event_tally = {};
        for (var event of new_events) {
            this.check_for_individual_notification(event);
            event_tally = this.tally_event(event_tally, event);
        }
        this.check_for_streaks(event_tally);
        this.check_for_new_records();

    }

    /**
     * Checks if the new streak passed a threshold for sending notifications.
     * 
     * This function will first get the old streak value before updating the
     * record for the streak. Then it will get the new for the streak after
     * adding the new events. 
     * 
     * It will then iterate over every streak threshold specified by the config
     * and send notifications for any threshold between the old and the new
     * streaks.
     * 
     * Note:
     * Updating the streaks here avoids needing to add together the new events
     * with the old streak more than once. This makes check_for_new_records
     * dependent on check_for_streaks being called first and could result in a
     * logic error that escapes unittests if refactoring is not done carefully
     * in the future.
     * 
     * @param {string} user The user completing the event.
     * @param {string} event_type The type of event completed.
     * @param {number} new_events The new events since the last check. 
     */
    check_for_streak(user, event_type, new_events) {
        let old_streak = this.get_streak(user, event_type); 
        this.update_streak(user, event_type, new_events);
        let new_streak = this.get_streak(user, event_type);

        let streak_thresholds = this.get_streak_thresholds(event_type);
        for (var threshold of streak_thresholds) {
            if (old_streak < threshold && new_streak >= threshold) {
                this.chat_composer.send_streak(user, event_type, threshold);
            }
        }
    }

    /**
     * Sends any streak notifications necessary based on recent events.
     * 
     * This function checks if any of the current tallies get a user past a
     * streak notification threshold for any of the events.
     * 
     * @param {object} event_tally The tally of newly completed events.
     */
    check_for_streaks(event_tally) {
        for (var user in event_tally) {
            for (var event_type in event_tally[user]) {
                let new_events = event_tally[user][event_type];
                this.check_for_streak(user, event_type, new_events);
            }
        }
    }

    /**
     * Adds the event type with a default value iff it isn't already present.
     * 
     * @param {object} item The object to ensure has the property.
     * @param {string} event_type The property to ensure exists on the object.
     */
    ensure_event_type(item, event_type) {
        if (!(event_type in item)) {
            item[event_type] = 0;
        }
    }

    /**
     * Adds the user with a default value iff they aren't already present.
     * 
     * @param {object} item The object to ensure has the property.
     * @param {string} user The property to ensure exists on the object.
     */
    ensure_user(item, user) {
        if (!(user in item)) {
            item[user] = {};
        }
    }

    /**
     * Gets the list of events that happened since we last asked for them.
     */
    get_events() {
        let current_check_time = factory.Date.now();
        let events = this.event_storage.get_events_between(
            this.last_check_time, current_check_time
        )
        this.last_check_time = current_check_time;

        return events;
    }

    /**
     * Get's the users record for this particular event_type.
     * 
     * It ensures at each step that the necessary keys exist, and creates
     * default entries for those keys if they do not.
     * 
     * @param {string} user The user we want to get the record of.
     * @param {string} event_type The event we want to get the record of.
     */
    get_record(user, event_type) {
        this.ensure_user(this.records, user);
        this.ensure_event_type(this.records[user], event_type);
        return this.records[user][event_type];
    }

    /**
     * Get's the users streak for this particular event_type.
     * 
     * It ensures at each step that the necessary keys exist, and creates
     * default entries for those keys if they do not.
     * 
     * @param {string} user The user we want to get the streak of.
     * @param {string} event_type The event we want to get the streak of.
     */
    get_streak(user, event_type) {
        this.ensure_user(this.streaks, user);
        this.ensure_event_type(this.streaks[user], event_type);
        return this.streaks[user][event_type];
    }

    /**
     * Gets the list of streak thresholds from the config.
     * 
     * If there are no thresholds for the event_type, returns an empty list.
     * 
     * @param {string} event_type The event we want the streak thresholds for.
     */
    get_streak_thresholds(event_type) {
        let event_config = factory.config.notification_center.event_types[
            event_type]
        
        if ('streaks' in event_config) {
            return event_config['streaks'];
        } else {
            return [];
        }
    }

    /**
     * Does one last check for new events before reseting everyone's streaks.
     */
    on_cron() {
        this.check_for_notifications();
        this.reset_streaks();
    }

    /**
     * Reset everyone's streaks.
     * 
     * Since the streaks object is built back up when individuals complete
     * events, resetting it to be an empty object is sufficient.
     * 
     * Also enables sending notifications.
     */
    reset_streaks () {
        this.streaks = {};
        this.send_notifications_flag = true;
    }

    /**
     * Adds this event to the user's totals when appropriate.
     * 
     * Increments the number of times the event's user has completed this
     * event since the last update, but only if that event type is configured
     * to trigger notifications.
     * 
     * @param {object} event_tally The current total for each user/event_type.
     * @param {object} event The new event to tally.
     */
    tally_event (event_tally, event) {
        let event_type = event.event_type;
        if (event_type in factory.config.notification_center.event_types) {
            let user = event.metadata.user;
            this.ensure_user(event_tally, user);
            this.ensure_event_type(event_tally[user], event_type);
            event_tally[user][event_type]++;
        }

        return event_tally;
    }

    /**
     * Updates a user's record to the new value.
     * 
     * The process for determining if the record needs to be updated gets the
     * current record, which populates this.record with default values if they
     * didn't have a record before. As such, we will only call this method
     * after records has already been populated with the user and event_type.
     * This means we don't need to ensure each of these keys like in the
     * get_record method.
     * 
     * @param {string} user The user to update the record of.
     * @param {string} event_type The event this record is for.
     * @param {number} new_record The new record value.
     */
    update_record(user, event_type, new_record) {
        this.records[user][event_type] = new_record;
    }

    /**
     * Add the new events to the user's streak.
     * 
     * @param {string} user The user to update the record of.
     * @param {string} event_type The event this record is for.
     * @param {number} new_record The new record value.
     */
    update_streak(user, event_type, new_events) {
        this.streaks[user][event_type] += new_events;
    }

    /**
     * Schedules all the cron jobs for the Notification Center.
     */
    async run() {
        factory.cron.schedule(
            config.notification_center.reset_streak_cadence,
            this.on_cron.bind(this)
        );
        factory.cron.schedule(
            config.notification_center.check_cadence,
            this.check_for_notifications.bind(this)
        );
    }
}

const factory = {
    NotificationCenter,
    config,
    Date,
    cron
}

module.exports = factory
