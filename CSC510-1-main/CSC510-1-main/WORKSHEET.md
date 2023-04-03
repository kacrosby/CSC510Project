# Iteration Worksheets

Deliverables Completed in Sprint 1:

| Deliverable | Item/Status | Issues/Tasks |
|-------------|-------------|--------------|
| Use Case 3: S1-S4, Unit Tests | Implement Streak Notification / Complete | #60
| Refactor: This is for better backend structure | Move Hardcoded Parameters from code to config file / Complete| #50
| Use Case 1 Addition: S1-S3, Unit Tests | Track Creation of Issues / Complete| #55
| Extra for Use Cases 1 and 3, Unit Tests | Create Function for Overriding Defaults in Config File / Complete| #54
| Use Case 1: S2, Use Case 3: S4| Add Chat Composer Python Format String Abilities / Complete| #53


Deliverables Completed in Sprint 2:

| Deliverable | Item/Status | Issues/Tasks |
|-------------|-------------|--------------|
| Enhancement for UC1 and UC2, Unit Testing | Add Scores for IssueCreated and RequestReviewed to Config | #75
| Enhancement for UC2 | Put Emoji Next to top 3 places in leaderboard | #74
| Enhancement for UC2, Unit Testing | Put users with the same score on the same line | #73
| Alternate flow for UC2, Unit Testing | Add Empty Scoreboard Message | #72
| Enhancement for UC1, UC3 | Add 3 new messages of each type | #71
| Enhancement for UC1, Unit Testing | Detect Pull Request Approvals | #70
| Enhancement for UC1, Unit Testing | Add Event Specific Messages for Individual Notifications | #69
| Enhancement for UC1, UC2, and UC3, Unit Testing | Add Random Message Function to Chat Composer | #68
| Rafactoring, Testing: Unit testing to get coverage to 100% | Test index.js | #52


Deliverables Completed in Sprint 3:

| Deliverable | Item/Status | Issues/Tasks |
|-------------|-------------|--------------|
| Testing | Develop Acceptance Test for Use Case 1 | #99
| Testing | Develop Acceptance Test for Use Case 2 | #100
| Testing | Develop Acceptance Test for Use Case 3  | #101
| Enhancement for bot | Add role for crash recovery | #98
| Enhancement for bot | Add role for starting the bot | #97
| Requirement for UC1, UC2, UC3 | Add role for copying the config file | #96
| Requirement for UC1, UC2, UC3 | Add role for installing bot dependencies | #95
| Requirement for UC1, UC2, UC3 | add role for installing npm | #94
| Requirement for UC1, UC2, UC3 | add role for cloning the project| #93
| Rafactoring added for Requirements | add inventory.yml with VCL Machine | #92



# Scrums

## Sprint 1 - Monday

Cristina:  
Did: Research Javascript.  
Will Do: Plan work for Sprint 1.  
Blockers: None  

Jack:  
Did: Moved Magic Variables to Config File, Created Pull Request.  
Will Do: Plan Work. Respond to Pull Request Comments.  
Blockers: None  

Anna:  
Did: Researched Javascript. Studied Scrum and Kanban.  
Will Do: Address stories decided today.  
Blockers: Becoming familiar with multi-file projects.  

Trevor:  
Did: Planned Stories for Sprint 1. Created when2meet to schedule scrums.  
Will Do: Create pull request for these notes. Review Jack's Pull Request. Start, but not finish, implementing Streaks in Notification Center.  
Blockers: Busy Schedule.  

## Sprint 1 - Tuesday

Cristina:  
Did: Put out code review Git Receiver to store IssueCreate events.  
Will Do: Add mocking for new type of event.  
Blockers: Time  

Jack:  
Did: Put out code review for config override implementation and testing.  
Will Do: Update command line to use yargs. Responding to Pull Request feedback.  
Blockers: Learning what yargs is.  

Anna:  
Did: Put out code review for python-formatter and reformatting of ChatComposer messages.  
Will Do: Update additional messages in config.  
Blockers: Should I edit additional files? (Resolved: Yes)  

Trevor:  
Did: Implemented Streak Checking in NotificationCenter. Added Testing for get_streak_thresholds function.  
Will Do: Add additional unittests for Streak Checking functions.  
Blockers: Need Jack and Anna's changes for config files and pythonic string formatting before adding new streak message code.  

## Sprint 1 - Wednesday

Cristina:  
Did: Created separate functions to add new issues and closed issues.  
Will Do: Review everyone's code. Testing and mocking.  
Blockers: Time.  

Jack:  
Did: Yargs implementation done.  
Will Do: (doing it right now)debug recursive implementation testing. Review other people's pull requests  
Blockers: None.  

Anna:  
Did: Fixed config files so it works with Jack's code. Fixed eval command.  
Will Do: Review everyone's code. Continue with the rest of the msgs so they use python format.  
Blockers: None.  

Trevor:  
Did: Code Reviews.  
Will Do: Code Reviews, Finish Testing.  
Blockers: Time.  

## Sprint 1 - Thursday

Cristina:  
Did: Tested and Merged all GitReceiver work.  
Will Do: Start Planning for Sprint 2  
Blocker: Time  

Jack:  
Did: Finished Testing and Implementing Recursive Config Update. Code Reviews.  
Will Do: Start Planning for Sprint 2  
Blocker: None  

Anna:  
Did: Addressed Conflicts with Development. Addressed Comments.  
Will Do: Start Planning for Sprint 2  
Blocker: Assignments in Other Classes  

Trevor:  
Did: Code Reviews. Added testing for Notification Center.  
Will Do: Rebase off Development, Address Conflicts, Put out Final Code Review.  
Blocker: Taxes and Work Emergency.  

## Sprint 1 - Friday

Cristina:  
Did: Did initial prep for Worksheet.md  
Will Do: Planning for Sprint 2  
Blockers: Time  

Jack:  
Did: Worked on Worksheet.md  
Will Do: Start Preparing for Next Sprint  
Blockers: None  

Anna:  
Did: Reviewing Code.   
Will Do: Planning for Sprint 2  
Blockers: Time  

Trevor:  
Did: Rebased Streaks off of Jack and Anna's code. Merged into Development. Merged Development into Main. Reviewed Worksheet.md change.  
Will Do: Create stories for Sprint 2.  
Blockers: Time  

## Sprint 2 - Monday

Cristina:  
Done: Chat Composer Messages, Git Receive RequestReviewed event added, most unittesting.  
Will Do: Try to fix the test that is not working.  
Blocker: Time  

Anna:  
Done: Additional Messages, Added Emojis, Adding a message if there are no standings.  
Will Do: Review other PRs. Add emojis to Scoreboard.  
Blockers: None  

Jack:  
Done: Finished multiple people per line in scoreboard. Added test file for chat_composer.  
Will Do: Will implement and test Random Function.  
Blockers: None  

Trevor:  
Done: Added and Checked in code for Addings Scores for IssueCreated and RequestReviewed. Tried helping debug the test case Cristina is working on.  
Will Do: Review Pull Requests  
Blockers: Need other Chat Composer functions done to unittest them.  

## Sprint 2 - Tuesday

Cristina:  
Did: Kept trying to mock octokit function. Going to skip unittesting that.  
Will Do: Submit the code review and update the chat messages PR based on suggested changes.  
Blockers: Time  

Jack:    
Did: Implemented and Tested function for random_message in chat_composer.  
Will Do: Respond to PR feedback.  
Blockers: None  

Anna:  
Did: Added code for giving top 3 rankings get medals and everyone else get stars. Fixed Code Review issues.  
Will Do: Resolve Merge Conflicts. Writing unittests.  
Blockers: None  

Trevor:    
Did: Code Reviews.   
Will Do: Code Reviews. Fill in the blank unittesting.  
Blockers: None  

## Sprint 2 - Wednesday

Cristina:  
Did: Create Pull Request with Git Receiver changes.  
Will Do: Change Composer Review Feedback.  
Blockers: Other Classes/Time  

Jack:  
Did: Merged PR after applying review feedback.  
Will Do: Practice Presentation/Merge Conflict Resolution/Code Reviews  
Blockers: None  

Anna:  
Did: Resolve Merge Conflicts.  
Will Do: Testing, Fix Ranking Code.  
Blockers: Figuring out the Ranking Code.  

Trevor:  
Did: Code Reviews  
Will Do: Code Reviews, Merge Conflict Resolution, Finish Unittests  
Blockers: Need other code finished to unittest.  

## Sprint 2 - Thursday

Cristina:  
Did: Addressed Merge Conflicts, Merged Pull Requests, Provided Reviews.  
Will Do: Reflect on Sprint.  
Blockers: None  

Jack:  
Did: Code Reviews, Presentation Prep, Fixed Bugs from Merge Conflicts.  
Will Do: Worksheet.md for this sprint., Reflect on Sprint.  
Blockers: None  

Anna:  
Did: Unittesting for new Chat Composer methods. Addressed Merge Conficts, Fixed Ranking Emoji code.  
Will Do: Reflect on Sprint.   
Blockers: None  

Trevor:  
Did: Code Reviews, Rectoring Index.js, unittesting  
Will Do: Merge PRs. Reflect of Sprint  
Blockers: None   


## Sprint 3 - Monday

Cristina:  
Did:  Nothing  
Will Do: Assignments made during scrum.  
Blockers: Time.   

Jack:    
Did: Nothing.  
Will Do: Work on assignments discussed during scrum.  
Blockers: None  
  
Anna:  
Did: Review PR   
Will Do: Assignments made during scrum.  
Blockers: Time.    

Trevor:    
Did: Put out a code review for code sitting on dev. Made plans for deployment process.   
Will do: Update notification center to not trigger notifications the first day deployed.   
Blockers: None.  

## Sprint 3 - Tuesday  
Trevor:  
Did: Got initial implementation of notification center to avoid spamming on start up.  
Will do: will test notification center changes and reviewing PRs.  
Blockers: none.  

Jack:  
Did: Merged the skeleton for ansible set up to Dev.   
Will do: Not Sure - Choosing a story   
Blockers: None  

Christina:  
Did:  Created stories, VCL account created, started on first use case, acceptance testing.  
Will Do: keep working on test.  
Blockers: time.   

Anna:  
Did: Nothing  
Will Do: Will choose issues and start on assignments  
Blockers: Time  

## Sprint 3 - Wednesday  

Trevor:  
Did: Finish the unit testing for #106. Code reviewed and checked into dev.  
Will do: Work on story to start bot.  
Blockers: Figuring out what outage conditions our bot needs to recover from/crash recovery.  

Jack:  
Did: Installed the bot dependencies   
Will do: Add bot to inventory   
Blockers: none  
  
Christina:   
Did:  Took screenshots for use cases. Worked on config file.   
Will Do: Config file   
Blockers: Time.   

Anna:  
Did: Started Config Role and Install NPM role   
Will Do: Will finish config role  and NPM role and then work on cloning project role  
Blockers: Time 

## Sprint 3 - Thursday 

Cristina:  
Did: Worked on the 3 usecases for Acceptance Tests  
Will Do: Continue working on Acceptance Tests.    
Blocker: Time  

Jack:  
Did: Got SSH working. Began Experimenting with Ansible Vault.  
Will Do: Implement Ansible Vault.  
Blocker: Other Class Projects  

Trevor:  
Did: Researched Process Starting and Calling Scripts as Service.  
Will Do: Code implementation of Service.  
Blockers: I need Bot on VCL before starting.   

Anna:  
Did: Started Config Role and Install NPM role     
Will Do: Will finish config role  and NPM role and then work on cloning project role    
Blockers: Time   


## Sprint 3 - Friday  
Trevor:  
Did: Bot deployed via service  
Will do: Add working environment variables, and get bot communicating with Mattermost, and putting out code.   
Blockers: Time  

Cristina:  
Did: I worked in the 3 Test Cases. I have them almost ready, just waiting for the bot location to update the config directory. I also made the tests with the no_chat option and the reference to the GitHub Repository that I created for those tests. I added you guys, the TAs, and Dr. Ore as collaborators of that repo. I created a draft PR so you guys can take a look at them and give me your feedback.  
Will do: Update the config directory and restart instructions once we have all set up.   
Blockers: time  

Jack:  
Did:  Bot running, inventory file working, and added possible prompting.   
Will do: push changes and wait for rest to get done to do screencast.   
Blockers: Waiting on other files  

Anna:  
Did: Started Config Role , cloning repo role, and Install NPM role   
Will Do: Will finish config role and NPM role and then work on cloning project role  
Blockers: dev token authentication  



# Sprint Reflections

## Sprint 1

Cristina:  
I think the scrum meetings helped a lot knowing what everyone was doing and how our team was regarding the completeness of what was required on sprint 1.

Jack:  
I think our process went well. Adding in everything to issues and then putting in everything to the Kanban board helped with keeping track of what needed and what was done for this iteration. Doing the skrum meetings daily helped a bit with discussing what was getting done and what was going on, but doing it daily was a bit annoying an unnecessary in my opinion. We could've checked in every other day and I think we could've been fine, but if we ran into more trouble during this iteration, meeting up and connecting each day would probably help connecting all of us to see if others needed help.

Anna:  
The process for sprint 1 was very efficient for me. We planned tasks together and were able to plan better on what else needed to be completed or what blockers were causing challenges. The scrum meetings kept us accountable and moving at a steady pace. While the meeting notes became a useful tool to reflect on. The Kanban project board allowed us to see visually the progress we were making. It was also a lot easier to look at the relationship between our work and how it all connected.

Trevor:  
I think we had a decent process. Starting with a new team, sprint planning was difficult since we had conflicting schedules, but we were able to use when2meet to find a few minutes each day. We had individuals putting in work every day, and we actively had reviews comments being made and addressed throughout the sprint. We did not have procrastination and put in consistent work across the sprint. Stories statuses in the project board were mostly maintained accurately. Scrums were timely, and we ensured everyone's updates were heard before diving into deeper sidecar discussions for a follow up team meeting.

## Sprint 2

Cristina:  
I think the process for sprint2 went well. We had our scrum meetings everyday, which were very useful.  Also, having the Kanban project board was very helpful, since we could  actually "see" how the tasks were being completed. I also think in this sprint the workload even out and everyone ended up with kind of the same workload for the entire project so far. 

Anna:  
This sprint I felt that the project board was great for seeing the issues that everyone assigned to themselves and how the work load was split. By doing daily scrum, I was able to see other's progress and make sure that my work was aligning with what other's needed to get done and changes I should review. I felt it was very helpful and more efficient this week than last - as everyone had the hang of the meetings and collaborated well. Overall it was a great sprint.

Jack:  
Like I've said, I still think the everyday scrum is a bit too much and everything would be fine if we just met every other day for it. With the way things went this time, most things getting done quickly and ahead of time. Chat composers was completed and tested by everyone who worked on it, but we probably could've communicated better when merging because we ended up with a few merging issues after all the merges to chat composer. Have one person assigned to test chat composer ended up being unnecessary because everyone who worked on it also tested it. Overall though, I think the project this sprint went smoothly. Using the project board wasn't super helpful because we already had things listed out in issues, but I guess it was fine for seeing the progress of things.

Trevor:  
This sprint seems very relaxed for me. We had good teamwork and pull request processing. There were some issues surrounding merge conflicts since the last items to work on were mostly in the chat composer. We collaborated to work out how to integrate our changes together though, and successfully reflected everyone's work in the final product. I would say our project is now feature complete. We did make two amendments to our original design to improve usability and to close a loophole users could have used to cheat. We will need to ask the teaching staff how best to document those design changes. Scrums seemed more streamlined as well now that we had practice.


## Sprint 3 

Cristina:  
The deploy process did not go as smooth as the previous milestones. We had the scrums meetings, and they were useful, but it was hard to find a time when the whole team could meet. I think everyone in our team has a lot going on since we are near the end of the semester, but we all made an effort to have things done.

Anna:    
This sprint for me was a lot harder and was a struggle to keep up with. I tried to take on more challenging issues for me but due to time conflicts I don't think I could invest the amount of research into what I was doing as I wanted. The project board and the issues allowed us to see the progress and make changes based on other's progress. When issues arose - everyone was very willing to help one another.   

Jack:    
This iteration has been a little bit of a scatter since many of the parts were pretty small. As a result, there was a lot of waiting between people to get things done and when certain things did get done, there were some issue with deployment. A lot of the waiting was mainly due to time constraints between people from other projects being completed, but that left not much time to combine everything and get it working cohesively. Skrums everyday didn't really help much, and was inconvenient on days where we couldn't all meet together. Every other day would still be better in my opinion

Trevor:    
The deploy sprint was a little deceptive. Having practiced deploying node projects on RHEL, the shift for this to be deployed on Ubuntu created unforseen issues that were Ubuntu specific. This combined with the several major religious holidays during the sprint caused a lot of strife.

This sprint we managed to get a lot of content being delivered throughout the project, but integration attempts weren't complete until the last day, which caused a crunch to debug everything that didn't work as  initially planned. The crunch was undesirable. We did a good job of distributing stories and updating them in the project, which was helpful. This week, scrumban was harder because we had several days with no overlapping availability, which is reasonable given that we are students, several of whom are DE, and the expectation of working on the class every day was not a commitment agreed to when signing up for DE.

I was pleased with the product we were able to deploy this sprint. I was especially please that we were able to plan ahead to avoid contributing to the broadcast storm in Town Hall or DDOSing Mattermost. Ansible is awesome, and powerful,  and I really like it. The issues we experienced were really associated with Ubuntu and Node specifically, not Ansible. I was also really excited we could leverage the Service architecture instead of introducing PM2 or forever which both break idempotency.

