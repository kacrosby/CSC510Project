class EventStorage {

    constructor() {
        this.events = [];
    }


    add_event (trigger_time, event_type, metadata) {
        let item = {
            "trigger_time": trigger_time,
            "event_type": event_type,
            "metadata": metadata
        }
        this.events.push(item);   
    }


    get_events_between(start_time, end_time) {
        let sublist = [];
        console.log(`Start Time: ${start_time}`);
        console.log(`End Time: ${end_time}`);
        for (var item of this.events) {
            if (start_time <= item.trigger_time && 
                    item.trigger_time <= end_time) {
                sublist.push(item);
            }
        }

        return sublist;
    }
}

const factory = {
    EventStorage
}

module.exports = factory
