var chai   = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var config = require('../../config/config');
const issues = require("../resources/mock_issues.json")
const pull_request = require("../resources/mock_pull_request.json")
const pull_requests = require("../resources/mock_pull_requests.json")
const { EventStorage } = require('../../components/event_storage');
const pull_request_reviews = require("../resources/mock_pull_request_reviews.json")

const module_under_test = require('../../components/git_receiver');

const class_under_test = module_under_test.GitReciever

const factory = {suite};

function suite() {

    describe("GitReciever()", function() {

        this.timeout(5000);

        beforeEach(function() {  
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(event_storage_stub); 
            this.now_stub = sinon.stub(module_under_test.Date, "now");      
            this.octokit_stub = sinon.stub(module_under_test.octokit, "paginate");
        });

        afterEach(function() {
            this.now_stub.restore();
            this.octokit_stub.restore();
        });

        it("ensures that compare_dates(date1, date2) returns true when date1 is greater than date2",
        function() {
            // Given
            this.object_under_test.trigger_date = 0;

            // When
            let actual = this.object_under_test.compare_dates(300);

            // Then
            expect(actual).to.be.true;
        });

        it("ensures that compare_dates(date1, date2) returns false when date1 is not greater than date2",
        function() {
            // Given
            this.object_under_test.trigger_date = 5000;

            // When
            let actual = this.object_under_test.compare_dates(300);

            // Then
            expect(actual).to.be.false;
        });    

        it("ensures that compare_pr_dates(date1, date2) returns true when date1 is greater than date2",
        function() {
            // Given
            this.object_under_test.pr_trigger_date = 0;

            // When
            let actual = this.object_under_test.compare_pr_dates(300);

            // Then
            expect(actual).to.be.true;
        });

        it("ensures that compare_pr_dates(date1, date2) returns false when date1 is not greater than date2",
        function() {
            // Given
            this.object_under_test.pr_trigger_date = 5000;

            // When
            let actual = this.object_under_test.compare_pr_dates(300);

            // Then
            expect(actual).to.be.false;
        }); 

        it("ensures that check_for_issues is calling add_completed_issue",

        async function() {
            // Given
            var compare_dates_stub = sinon.stub(this.object_under_test, "compare_dates");
            compare_dates_stub.returns(true)
            var get_issues_stub = sinon.stub(this.object_under_test, "get_issues");
            get_issues_stub.returns(issues)
            var add_completed_issue_stub = sinon.stub(this.object_under_test, 'add_completed_issue');

            // When
            await this.object_under_test.check_for_issues();

            // Then
            expect(add_completed_issue_stub.called).to.be.true;
        });

        it("ensures that check_for_issues is calling add_new_issue",
        async function() {
            // Given
            var compare_dates_stub = sinon.stub(this.object_under_test, "compare_dates");
            compare_dates_stub.returns(true)
            var get_issues_stub = sinon.stub(this.object_under_test, "get_issues");
            get_issues_stub.returns(issues)
            var add_new_issue_stub = sinon.stub(this.object_under_test, 'add_new_issue');

            // When
            await this.object_under_test.check_for_issues();

            // Then
            expect(add_new_issue_stub.called).to.be.true;
        });
               
        it("ensures that get_issues() makes the API call",
        async function() {
            // Given
            this.octokit_stub.returns(issues)
            
            // When
            var issues_response = await this.object_under_test.get_issues();

            // Then
            expect(issues_response).to.deep.equal(issues)
        });

        it("ensures that add_new_issue() invoques event_storage.add_event",
        function() {
            // Given
            var trigger_time = 500;
            this.now_stub.returns(trigger_time);
            var add_event_stub = this.object_under_test.event_storage.add_event;
            var event_type = 'IssueCreated';  
            var metadata = {
                    "user": "kacrosby",
                    "created_at":new Date("2022-02-07T02:48:52Z"),
                    "issueId": 5,
                    "issueNumber": 5,
                    "state": "open",
                    "title": "Issue 5",
                    "assignee": "jrlanois"}                   
            
            this.object_under_test.add_new_issue(issues[4]);

            // Then
            expect(add_event_stub.called).to.be.true;
            expect(add_event_stub.args[0]).to.deep.equal([trigger_time, event_type, metadata]);
        });  

        it("ensures that add_pr_aprroved() invoques event_storage.add_event",
        function() {
            // Given
            var trigger_time = 500;
            this.now_stub.returns(trigger_time);
            var add_event_stub = this.object_under_test.event_storage.add_event;
            var event_type = 'PullRequestApproved';  
            var metadata = {
                    "user": "jrlanois",
                    "pull_number": 66}                   
            
            this.object_under_test.add_pr_aprroved(pull_request);

            // Then
            expect(add_event_stub.called).to.be.true;
            expect(add_event_stub.args[0]).to.deep.equal([trigger_time, event_type, metadata]);
        });  

        it("ensures that get_pr() makes the API call",
        async function() {
            // Given      
            this.octokit_stub.returns(pull_requests)
            // When
            var prs = await this.object_under_test.get_pr();

            // Then
            expect(prs).to.deep.equal(pull_requests);
        });

        
        it("ensures that get_pr_reviews() makes the API call",
        async function() {
            // Given      
            this.octokit_stub.returns(pull_request_reviews)

            // When
            var actual = await this.object_under_test.get_pr_reviews();

            // Then
            expect(actual).to.deep.equal(pull_request_reviews);
        });
    });

    describe("GitReceiver.check_for_events()", function() {

        this.timeout(5000);

        beforeEach(function() {
            this.object_under_test = new class_under_test();
        });

        afterEach(function () {

        });

        it("ensures start_components() applies updates that exist.",
        async function() {
            // Given

            this.object_under_test.check_for_issues = sinon.stub();
            this.object_under_test.check_for_pr_approvals = sinon.stub();

            // When
            await this.object_under_test.check_for_events();

            // Then
            expect(
                this.object_under_test.check_for_issues.callCount
                ).to.equal(1);
            expect(
                this.object_under_test.check_for_pr_approvals.callCount
                ).to.equal(1);
        });

    });

    describe("GitReceiver.check_for_pr_approvals()", function() {

        this.timeout(5000);

        beforeEach(function() {
            this.object_under_test = new class_under_test();
            this.pr_trigger_date = 400;
            this.object_under_test.get_pr = sinon.stub();
            this.object_under_test.get_pr_reviews = sinon.stub();
            this.object_under_test.compare_pr_dates = sinon.stub();
            this.object_under_test.compare_pr_dates.returns(true);
            this.object_under_test.add_pr_aprroved = sinon.stub();

            this.now_stub = sinon.stub(module_under_test.Date, "now");
            this.now_stub.returns(600);    
        });

        afterEach(function() {
            this.now_stub.restore();
        });

        it("ensures check_for_pr_approvals() does nothing when no prs.",
        async function() {
            // Given
            this.object_under_test.get_pr.returns([]);

            // When
            await this.object_under_test.check_for_pr_approvals();

            // Then
            expect(
                this.object_under_test.get_pr.callCount
                ).to.equal(1);
            expect(
                this.object_under_test.get_pr_reviews.callCount
                ).to.equal(0);
            expect(
                this.object_under_test.add_pr_aprroved.callCount
                ).to.equal(0);
        });

        it("ensures check_for_pr_approvals() does nothing when prs have no reviews.",
        async function() {
            // Given
            this.object_under_test.get_pr.returns([{'number': 42}]);
            this.object_under_test.get_pr_reviews.returns([]);

            // When
            await this.object_under_test.check_for_pr_approvals();

            // Then
            expect(
                this.object_under_test.get_pr.callCount
                ).to.equal(1);
            expect(
                this.object_under_test.get_pr_reviews.callCount
                ).to.equal(1);
            expect(
                this.object_under_test.get_pr_reviews.args[0]
                ).to.deep.equal([42]);
            expect(
                this.object_under_test.compare_pr_dates.callCount
                ).to.equal(0)
            expect(
                this.object_under_test.add_pr_aprroved.callCount
                ).to.equal(0);
        });

        it("ensures check_for_pr_approvals() does nothing when reviews are not approvals.",
        async function() {
            // Given
            this.object_under_test.get_pr.returns([{'number': 42}]);
            this.object_under_test.get_pr_reviews.returns(
                [{'state': 'NOT APPROVED', 'submitted_at': 500}]);

            // When
            await this.object_under_test.check_for_pr_approvals();

            // Then
            expect(
                this.object_under_test.get_pr.callCount
                ).to.equal(1);
            expect(
                this.object_under_test.get_pr_reviews.callCount
                ).to.equal(1);
            expect(
                this.object_under_test.get_pr_reviews.args[0]
                ).to.deep.equal([42]);
            expect(
                this.object_under_test.compare_pr_dates.callCount
                ).to.equal(0)
            expect(
                this.object_under_test.add_pr_aprroved.callCount
                ).to.equal(0);
        });

        it("ensures check_for_pr_approvals() does nothing when reviews are old.",
        async function() {
            // Given
            this.object_under_test.get_pr.returns([{'number': 42}]);
            this.object_under_test.get_pr_reviews.returns(
                [{'state': 'APPROVED', 'submitted_at': 300}]);
            this.object_under_test.compare_pr_dates.returns(false);

            // When
            await this.object_under_test.check_for_pr_approvals();

            // Then
            expect(
                this.object_under_test.get_pr.callCount
                ).to.equal(1);
            expect(
                this.object_under_test.get_pr_reviews.callCount
                ).to.equal(1);
            expect(
                this.object_under_test.get_pr_reviews.args[0]
                ).to.deep.equal([42]);
            expect(
                this.object_under_test.compare_pr_dates.callCount
                ).to.equal(1)
            expect(
                this.object_under_test.add_pr_aprroved.callCount
                ).to.equal(0);
        });

        it("ensures check_for_pr_approvals() sends events.",
        async function() {
            // Given
            this.object_under_test.get_pr.returns([{'number': 42}]);
            this.object_under_test.get_pr_reviews.returns(
                [{'state': 'APPROVED', 'submitted_at': 500}]);

            // When
            await this.object_under_test.check_for_pr_approvals();

            // Then
            expect(
                this.object_under_test.get_pr.callCount
                ).to.equal(1);
            expect(
                this.object_under_test.get_pr_reviews.callCount
                ).to.equal(1);
            expect(
                this.object_under_test.get_pr_reviews.args[0]
                ).to.deep.equal([42]);
            expect(
                this.object_under_test.compare_pr_dates.callCount
                ).to.equal(1)
            expect(
                this.object_under_test.add_pr_aprroved.callCount
                ).to.equal(1);
            expect(
                this.object_under_test.add_pr_aprroved.args[0]
                ).to.deep.equal([{'number': 42}]);
        });

    });

    describe("NotificationCenter().run()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            this.object_under_test = new class_under_test();
            module_under_test.config = {
                "git_config": {
                    "check_cadence": "*/25 * * * * *", // Every 25 Seconds
                }
            }; 
            this.schedule_stub = sinon.stub(
                module_under_test.cron, 'schedule');        
        });
        
        afterEach(function() {
            this.schedule_stub.restore();
        });

        it("ensures that run() calls the appropriate functions.",
        function() {
            // Given
            
            var check_for_events_stub = sinon.stub(
                this.object_under_test, 'check_for_events');
            let bind_stub = sinon.stub();
            bind_stub.returns("something");
            check_for_events_stub.bind = bind_stub;

            // When
            this.object_under_test.run();

            // Then
            expect(this.schedule_stub.callCount).to.equal(1);
            expect(this.schedule_stub.args[0]).to.deep.equal(
                ["*/25 * * * * *", "something"]);

        });

    });

}

module.exports = factory;