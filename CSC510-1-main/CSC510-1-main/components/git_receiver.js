const { config } = require('../config/config');
const cron = require('node-cron');
const { Octokit } = require("octokit");
var url = config.git_config.url;
var repo = config.git_config.repo;
var owner = config.git_config.owner;
var auth = config.git_config.auth;


const octokit = new Octokit({
    auth: auth,
    baseUrl: url,
  });

class GitReciever {

    constructor(event_storage) {
        this.event_storage = event_storage;
        this.trigger_date = 0;
        this.pr_trigger_date=0;
    }
    
    /**
     * Compares the given date with the stored trigger_date
     * 
     * @param {Date} date 
     * @returns true if the given date is greater than trigger_date, false otherwise
     */
    compare_dates(date){
        return date > this.trigger_date;
    }

        /**
     * Compares the given date with the stored pr_trigger_date
     * 
     * @param {Date} date 
     * @returns true if the given date is greater than pr_trigger_date, false otherwise
     */
    compare_pr_dates(date){
        return date > this.pr_trigger_date;
    }

    /**
     * Adds a completed issue to the event_storage
     * 
     * @param {Array} data 
     * @param {String} issueState 
     */
    add_completed_issue(data){
        if(data.assignee == null){
            var assignee = data.user.login;
        }
        else{
            var assignee = data.assignee.login;
        }
            var state = data.state;
            var issueId = data.id;
            var issueNumber = data.number;
            var title = data.title;
            var created_at = data.created_at;
            var closed_at = data.closed_at;
            var metadata = {issueId: issueId, 
                            issueNumber: issueNumber,
                            title: title,
                            created_at: new factory.Date(created_at),
                            closed_at: new factory.Date(closed_at),
                            state: state,
                            user: assignee
                            }
            var trigger_time = factory.Date.now();
            this.event_storage.add_event(trigger_time, "IssueComplete", metadata);  
    }

    /**
     * Adds a new issue to the event_storage
     * 
     * @param {Array} data 
     */
        add_new_issue(data){
        if(data.assignee == null){
            var assignee = "";
        }
        else{
            var assignee = data.assignee.login;
        }
            var user = data.user.login;
            var state = data.state;
            var issueId = data.id;
            var issueNumber = data.number;
            var title = data.title;
            var created_at = data.created_at;
            var metadata = {issueId: issueId, 
                            issueNumber: issueNumber,
                            title: title,
                            created_at: new factory.Date(created_at),
                            state: state,
                            user: user,
                            assignee: assignee
                            }
            var trigger_time = factory.Date.now();
            this.event_storage.add_event(trigger_time, "IssueCreated", metadata);  
    }

    /**
     * Adds an approved pull request to the event_storage
     * @param {Array} data 
     */
    add_pr_aprroved(data){ 
        var pull_number = data.number;
        var user = data.user.login;
        var metadata = {pull_number: pull_number, 
                        user: user
                        }
        var trigger_time = factory.Date.now();
        this.event_storage.add_event(trigger_time, "PullRequestApproved", metadata);  
    }

    /**
     * Gets the issues associated with the given owner and repo
     * 
     * @returns the issues for the given owner and repo
     */
    async get_issues() {
        const issues = await factory.octokit.paginate("GET /repos/{owner}/{repo}/issues?state=all", {owner, repo}, response => response.data);
        return issues; 
    }

    /**
     * Gets the pull request associated with the given owner and repo
     * 
     * @returns the pull_requests for the given owner and repo
     */
    async get_pr() {
        const pull_requests = await factory.octokit.paginate("GET /repos/{owner}/{repo}/pulls?state=all", {owner, repo}, response => response.data);
        return pull_requests; 
    }
    
    /**
     * Gets the reviews associated with the given pull request
     * 
     * @param {int} pull_number 
     * @returns the reviews for the given pull number
     */
    async get_pr_reviews(pull_number) {
        const reviews = await factory.octokit.paginate("GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {owner, repo, pull_number}, response => response.data);
        return reviews; 
    }
    
    /**
     * Checks if there are new pull requests approved to be added to the event_storage
     * It verifies if the pull requests were approved after the last pr_trigger_date, 
     * in that is the case, then it adds them to the event_storage
     * 
     */
    async check_for_pr_approvals(){
        let pulls = await this.get_pr();
        var pr_added = false;

        for(var i=0; i<pulls.length; i++){
            var pull_request = pulls[i];
            var pull_number = pull_request.number;

            let reviews = await this.get_pr_reviews(pull_number);

            if (reviews.length <= 0) {
                continue;
            }

            var last_review = reviews[reviews.length-1]
            if(last_review.state!='APPROVED'){
                continue;
            }

            if(this.compare_pr_dates(new Date(last_review.submitted_at).getTime())){
                pr_added = true;
                this.add_pr_aprroved(pull_request)
            }
        }

        if(pr_added){
            console.log('Approved pull requests added to the repository');
        }
        
        this.pr_trigger_date = factory.Date.now();
    }

    /**
     * Checks if there are new events (new issues or closed issues) to be added to the event_storage.
     * It verifies if the new issues were created after the last trigger_date, and if the closed issues
     * were in fact closed after the last trigger_date, in that cases it adds them to the event_storage
     * 
     */
    async check_for_issues() {
        //Gets the repo issues
        let data = await this.get_issues();
        var closed_issues_added = false;  
        var open_issues_added = false;        

        for( var i = 0; i < data.length; i++ ){	
            if(data[i].state == 'closed'){
                if(this.compare_dates(new Date(data[i].closed_at).getTime())){
                    closed_issues_added = true;
                    this.add_completed_issue(data[i]);      
                }
            }
            else if(data[i].state == 'open'){
                if(this.compare_dates(new Date(data[i].created_at).getTime())){
                    open_issues_added = true; 
                    this.add_new_issue(data[i]);                            
                }          
            }
        }

        this.trigger_date = factory.Date.now();
    }

    async check_for_events() {
        await this.check_for_issues();
        await this.check_for_pr_approvals();
    }
 
    async run() {
        console.log('Git Receiver - run - Enter');
        factory.cron.schedule(
            factory.config.git_config.check_cadence,
            this.check_for_events.bind(this)
        );
        console.log('Git Receiver - run - Exit');
    }
}

const factory = {
    GitReciever,
    octokit,
    Date,
    cron,
    config
}

module.exports = factory