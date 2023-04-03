# Problem Statement

The problem is that, during team development, the workload can be distributed unevenly or an individual’s extra effort may go unnoticed by their teammates. When the workload is unevenly distributed, a teams productivity can be disproportionately impacted by one member's absence, decreasing what can be delivered to users. With these rankings, a manager or team lead could redistribute the workload when an imbalance is detected. Imbalance issues aside, if one user is just unexpectedly productive over an interval, that success can be recognized by their peers.

# Bot Description

Bot Name: Repo Rewards

Tagline: Less 🐞, More 😊

The bot we propose to address the problem is a chat/dev bot that would primarily try to incentivize people by rewarding them for following good practices. Examples of good behavior would be: creating issues on the to-do list, taking on issues to work on, submitting and reviewing pull requests, etc. The bot will send encouraging messages to the team like “User one has taken on the challenge - Update ReadMe File!” or “User two is on a roll with 3 code reviews completed today!”. Users could also ask the bot about their current standing and get back different emojis based on what practices they followed. At a regular cadence, the bot will make an announcement of top performers over the most recent interval.


We believe this bot will help solve the issues presented in the problem statement. The Top Performers announcement will allow the team leader to notice if changes need to be made in the workload distribution. By writing to a chat instead of sending an email, there is a lower barrier to engagement with the information, so more of the team is likely to notice it. By sending out notification messages recognizing a user’s actions, it allows their peers to react with encouragement and kudos. Providing these features will allow a team to stay motivated and help keep the workload evenly shared by everyone.


# 3 Use Cases

## Use Case 1: Reward Task Completed

1. Preconditions

- The bot must have Github api developer token in the system and be configured to track a project.

2. Main Flow
- User will complete an action in which the bot will recognize an issue has moved from the “in progress” to “resolved” state [S1]. Bot will send a Notification to the chat channel that the issue has been completed [S2]. Bot will store the new completed action in memory [S3].

3. Subflows
  - [S1] User marks issue as resolved.
  - [S2] Bot will send a chat emoji to the group with the statement “<User 1> has completed the task <Task 1>.
  - [S3] Bot will create memory updates.
  
4. Alternative Flows
  - [E1] repo bot is set to “no chat” mode and will not send group an update but will update the points system.

## Use Case 2: Check Leaderboard

1. Preconditions
- The bot must have Github api developer token in the system and be configured to track a project.
2. Main Flow
- User will request an update on who has the most points, or is in the lead, by giving a query to the bot chat [S1]. Bot will send a Notification to the chat channel on the current standings [S2]. 
3. Subflows
 - [S1] User queries the chat
 - [S2] Bot will send a chat listing on the current top user standings with associated emojis to illustrate the leaders. 
4. Alternative Flows
 - [E1] If there are no current points or user standings, the bot will respond with “There are no standing winners at this point in time” 
 - [E2] If there is a tie between users, the bot will respond with the users names listed beside each other for a medal. 

## Use Case 3: Record Made
1. Preconditions
- The bot must have Github api developer token in the system and be configured to track a project.
- User must have existing tasks completed
2. Main Flow
- User will complete an action in which the bot will recognize the issue has moved from the  “in progress” to “resolved” state [S1]. Bot will record the issue as completed and recognize if a daily record has been broken [S2]. Bot will then update a new record [S3] Bot will notify the user that they have beaten a daily record using the chat.
3. Subflows
 - [S1] User marks issue as resolved.
 - [S2] Bot records task completed, compares number of tasks completed to previous records
 - [S3] If record is beat - updates the new record
 - [S4] Bot sends a Kudos message to the user indicating that they’ve beaten a record for that task  in the chat. 
4. Alternative Flows
 - [E1] repo bot is set to “no chat” mode and will not send the user an update but will update the record.
 - [E2] If multiple records are broken, the bot will create a list of task records broken in the chat update to the user. 


# Design Sketches

#### Wireframe mockup of Repo Reward in action.

These sketches reprensent the Use Cases described above.

![](/resources/images/Sketches.png)

#### Story Board

This story board represents the actions taken by Repo Reward when a user reaches a milestone

![](/resources/images/StoryBoard.png)

# Architecture Design

![Design Image](/resources/images/Architecture%20Diagram.png)

## Data Source

### Git Receiver

The Git Receiver will monitor a particular project on GitHub. It will track the
relevant state of issues and pull requests. When it identifies a certain Action
has occurred, such as a user picking up an issue, it will send an Event to the
Event Storage component. The types of Actions that are tracked can be expanded
if time permits, but the initial list includes “Creating an Issue”, “Picking Up
an Issue”, “Reviewing a Pull Request”, and “Completing an Issue”.

- Action - Something that a Human user did to interact with GitHub that the bot
  tracks.
- Event - A generic data structure to be stored in a log and stores relevant 
  metadata for interested Event Handlers to use.

### Chat Receiver

The Chat Receiver will monitor the chat messages in our chat client. It will
identify any new messages that contain a supported Command for the bot. When it
detects a Command, it will send an Event to the Event Storage component. The
variety of commands can be improved over time, but the initial command list will
include “Current Rankings”.

- Command - One of the queries that a user can make to the bot via the chat
  channel.

## Repository

### Event Storage

The Event Storage will be a repository of all identified events in the system.
This will initially be a data structure in memory, but future work could improve
this to a database.

- Event Type - A unique string associated with a particular event. Event
  handlers can look at this attribute to identify if an event they are
  interested in occurs.
- Each event will also store the time at which it occurred in UTC.
- Events may also have relevant metadata for the given type, such as the
  triggering user for a rewarded Action, or any parameters related to an issued
  Command.

## Event Handlers

### Notification Center

The Notification Center will monitor the Event Storage for new Events. Based on
its Configuration Settings, it will determine if a Notification should be sent.
If a Notification should be sent, it will provide any relevant metadata to the
Chat Composer.

- Notification - A message sent from the bot to the chat channel as a result of
  a particular Action a user takes.
- Configuration Settings - Instead of assuming how chatty users will want the
  bot to be, or what behavior they may be trying to encourage, the bot will use 
  a json configuration file to identify the conditions under which a particular
  Notification should be sent. It will contain the following values:
  - Event Type - See Repository/Event Storage/Event Type
  - Streak Length - If Streak Length is defined, it should contain an integer. A
    particular Event Type may have multiple entries with different Streak
    Lengths, and it will be triggered when appropriate.
    - If Streak Length is not specified, a Notification is sent out for every
      Event of Event Type.
    - If a streak length of zero is defined, then a notification will be sent
      whenever a user surpasses their personal best.
    - If a non-zero streak length is defined, the first time that number of
      Events of Event Type by a specific user happens within the tracking
      window, a Notification is sent. 

### Scorer

The Scorer will monitor the Event Storage for new Events. If that event is a
Command, for it to report the scores, it will do so. When it is asked to report
the scores, it consults its current Configuration Settings and calculates the
current scores. Scores will not be stored on the system. A regular cadence for
reporting rankings can be configured that will show the top scorers over that
time interval.

- Scores - The current sum of points that a user has earned from their Actions.
- Points - The value earned for doing a particular Action.
- Configuration Settings - Instead of assuming how many points a group will want
  to award for different behaviors, we will instead use a json configuration
  file to identify how many points should be awarded for each event. It will
  contain the following values:
  - Event Type - See Repository/Event Storage/Event type
  - Points Earned - The number of points that a user should earn when the
    condition is satisfied.
  - This could be expanded to support giving additional points for Streaks by
    providing a Streak Length parameter, but that is outside the scope of the
    initial design.

## Client

### Chat Composer

The Chat Composer will compose a Message to send to the chat channel. Instead of
always sending the same Message for the same event every time, the Chat Composer
will contain instructions on how to either select or generate a variety of
Messages. These messages should support being formatted to include relevant
information like the users name or how long their streak is if they are on a
steak. Once a Message is composed, it will be sent along to the Programmatic
Chat API

- Message - A collection of text and emojis that is used to convey something to
  the users in a chat channel.

### Programmatic Chat API

Instead of tightly coupling with a single chat application, we will make a
generic chat interface, and allow for adapters to be created that implement the
interface for various chat applications. For the scope of this assignment, we
only intend to implement the adapter for Mattermost.

# Constraints

1. Any Bot will interface with exactly 1 chat and repo. This will help avoid potential data leakage for private repos or chats, since any one bot can only have access to the one repo/chat it was configured with.
2. The Bot will expect the chat channel to be provided by the users and will not support hosting its own chat service.
3. The Bot will allow configuration of time intervals to support a variety of potential working hours.


# Additional Patterns

Our bot is designed to make use of the adapter pattern through the adaptation of information coming from the Chat Composer to be used on any platform. This is done through the Programmatic Chat API, which will be used to adapt the information from the bot to whatever chat platform is using the bot.

One design pattern that we considered was the observer design pattern because it would be useful if we implemented multiple chat channels for a single bot. Following this pattern, we would have an observer for each chat channel which would pick up the messages from the Notification Center. Observers can be made for different platforms like Discord or Slack so they can also receive all the messages from the Notifications center. When a notification needs to go out, the Chat Composer will go through all the registered observers and call the Programmatic API for each one to send the message. 

Our architecture is based on the Repository architectural design pattern. Our architecture consists of a main repository which will contain Events from the data sources: Actions done on GitHub and bot commands sent in chat. The data stored in the repository will primarily be accessed by parts of the bot that will be interacting with the client systems: the Notification Center and the Scorer. The client systems can then do what they want with information returned from Event Handlers to satisfy the client’s needs. Using this architectural pattern allows us to have a modular design and encapsulate the events repository for better control and security.

# Bot Demonstration Screencast
[Direct link: https://youtu.be/RGinvmWH3u4](https://youtu.be/RGinvmWH3u4)

[![Bot Demonstration Video](https://img.youtube.com/vi/RGinvmWH3u4/0.jpg)](https://youtu.be/RGinvmWH3u4)
