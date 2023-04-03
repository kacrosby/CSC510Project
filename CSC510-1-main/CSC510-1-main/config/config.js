let default_timeout = 2000;

let scorer = {
    "check_cadance": "*/5 * * * * *",  // Every 5 seconds
    "event_types": {
        "IssueComplete": {
            "each": 5
        },
        "IssueCreated": {
            "each": 1
        },
        "PullRequestApproved": {
            "each": 3
        }
    }
};

let timeouts = {
    "chat_receiver_polling_delay": default_timeout,
    "git_receiver_polling_delay": default_timeout,
    "scorer_polling_delay": default_timeout
};

let chat_api = {
    "type":"Mattermost"
};

let mattermost_config = {
    "host":"chat.robotcodelab.com",
    "group":"CSC510-S22",
    "bot_name":"Repo-Rewards-Bot",
    "channel_id":"zmtxx6q4g3gg8j7x6go5bsymtc"
};

let notification_center = {
    "check_cadence": "*/5 * * * * *", // Every 5 Seconds
    "reset_streak_cadence": "0 9 * * *", // Every Day at 4 AM EST
    "enable_startup_notifications": false, // When disabled, notifications will not until the next reset streak event.
    "event_types": {
        "IssueComplete": {
            "individual": true,
            "streaks": [3,5],
            "record": true
        },
        "IssueCreated": {
            "individual": true,
            "streaks": [3,5],
            "record": true
        },
        "PullRequestApproved": {
            "individual": true,
            "streaks": [3,5],
            "record": true
        }
    }
};

let event_messages = {
    "finished_messages":{
        "IssueComplete": ["That is one less thing to worry about, {0} just finished:{1}. 😄",
                        "Making Progress! {0} completed: {1}. 🤗",
                        "Round of applause for {0}! {1} is finished. 👏",
                        "{0} is putting a dent in the work! {1} was just completed! 💪"],
        "IssueCreated": ["It looks like {0} has a plan. Who wants to help?: \n{1}"],
        "PullRequestApproved": ["Green Light! Green Light to engage!\nPull request {0} has been approved"]
    },


    "record_messages":[
        "Hey! {0} just set a new personal record of {1} {2}! 🏆",
        "{0} is so skilled they just beat their own record of {1} {2}! 😯",
        "Congrats {0}! You have a new record of {1} {2}! 🏅",
        "{1} {2} completed! That's a new record for {0}! 👑"
    ],
    "streak_messages":[
        "Roll'n, Roll'n, Roll'n. Keep those {1} Roll'n! {0} is on a streak of {2}! 😃",
        "Just hit a streak of {2} {1}! Great job {0}! 🎉",
        "That's a lot of {1} completed! {0} just hit a streak of {2}! 😯",
        "Impressive! {0} is on a streak of {2} {1}! 🏆"
    ],
    "scoreboard_heading":"--- Current Rankings ---",
    "scoreboard_display_line":"{0}{1}: {2} points - {3}",
    "empty_scoreboard":"There are no standing winners at this point in time."
};

let command_triggers = {
    "current_rankings":"current rankings"
};

let git_config = {
    "url": "https://github.ncsu.edu/api/v3",
    "repo": "CSC510-1",
    "owner": "csc510-s2022",
    "auth": process.env.GITHUBTOKEN,
    "check_cadence": "*/25 * * * * *"
};

let config = {
    "scorer": scorer,
    "notification_center": notification_center,
    "chat_api": chat_api,
    "timeouts": timeouts,
    "mattermost_config": mattermost_config,
    "event_messages": event_messages,
    "command_triggers": command_triggers,
    "git_config": git_config
};

module.exports.config = config;
