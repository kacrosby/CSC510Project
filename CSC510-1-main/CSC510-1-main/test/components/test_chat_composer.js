var chai   = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
//const format = require("python-format-js");

var { config } = require('../../config/config');
const { Mattermost } = require('../../components/chat-apis/mattermost');
const module_under_test = require('../../components/chat_composer');

const class_under_test = module_under_test.ChatComposer;

const factory = {suite};

const standings = { jrlanois: 15, tsbrenna: 20, kacrosby: 5, ceramire: 10 };
const standings_with_same_score = { jrlanois: 20, tsbrenna: 20, ceramire: 10, kacrosby: 10 };
const standings_empty = {};
let itemized_standings_empty = Object.entries(standings_empty);
const messages = ["msg 1", "msg 2"];

function suite() {

    describe("ChatComposer().send_individual()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var mattermost_stub = sinon.createStubInstance(Mattermost);
            this.object_under_test = new class_under_test(mattermost_stub);
        });

        it("Ensures the random method is called once for the send_individual() method", function() {
            // Given
            var random_message_stub = sinon.stub(this.object_under_test, "random_message");
            random_message_stub.returns(config.event_messages.finished_messages.IssueComplete[0]);

            // check the call in send_individual()
            this.object_under_test.send_individual({"metadata":{"user":"test_user","title":"Test Title"}});

            // Check that it was called once
            expect(random_message_stub.callCount).to.equal(1);
        });

    });

    describe("ChatComposer().send_record()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var mattermost_stub = sinon.createStubInstance(Mattermost);
            this.object_under_test = new class_under_test(mattermost_stub);
        });

        it("Ensures the random method is called once for the send_record() method", function() {
            // Given
            random_message_stub = sinon.stub(this.object_under_test, "random_message");
            random_message_stub.returns(config.event_messages.finished_messages.IssueComplete[0]);

            // check the call in send_record()
            this.object_under_test.send_record("test_user", "test_event", 3);

            // Check that it was called once
            expect(random_message_stub.callCount).to.equal(1);
        });

    });

    describe("ChatComposer().send_streak()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var mattermost_stub = sinon.createStubInstance(Mattermost);
            this.object_under_test = new class_under_test(mattermost_stub);
        });

        it("Ensures the random method is called once for the send_streak() method", function() {
            // Given
            random_message_stub = sinon.stub(this.object_under_test, "random_message");
            random_message_stub.returns(config.event_messages.finished_messages.IssueComplete[0]);

            // check the call in send_streak()
            this.object_under_test.send_streak("test_user", "test_event", 3);

            // Check that it was called once
            expect(random_message_stub.callCount).to.equal(1);
        });

    });

    describe("ChatComposer().send_scoreboard()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var mattermost_stub = sinon.createStubInstance(Mattermost);
            this.object_under_test = new class_under_test(mattermost_stub);
        });

        it("Ensures the chat composer returns the standings in the proper order with no scores sharing the same value",
        function() {
            // Given
            var send_msg_stub = this.object_under_test.chat_api.send_message;

            // When
            this.object_under_test.send_scoreboard(standings);

            // Then
            expect(send_msg_stub.calledOnce).to.be.true;
            expect(send_msg_stub.args[0][0]).to.deep.equal(config.event_messages.scoreboard_heading + "\n" 
            + config.event_messages.scoreboard_display_line.format("🥇", 1, 20, "tsbrenna") + "\n"
            + config.event_messages.scoreboard_display_line.format("🥈", 2, 15, "jrlanois") + "\n"
            + config.event_messages.scoreboard_display_line.format("🥉", 3, 10, "ceramire") + "\n"
            + config.event_messages.scoreboard_display_line.format("⭐", 4, 5, "kacrosby") );
        });

        it("Ensures the chat composer returns the standings in the proper order with scores sharing the same value",
        function() {
            // Given
            var send_msg_stub = this.object_under_test.chat_api.send_message;

            // When
            this.object_under_test.send_scoreboard(standings_with_same_score);

            // Then
            expect(send_msg_stub.calledOnce).to.be.true;
            expect(send_msg_stub.args[0][0]).to.deep.equal(config.event_messages.scoreboard_heading + "\n" 
            + config.event_messages.scoreboard_display_line.format("🥇", 1, 20, "jrlanois, tsbrenna") + "\n"
            + config.event_messages.scoreboard_display_line.format("🥈", 2, 10, "ceramire, kacrosby") );
        });

        it("Ensures the chat composer returns the scoreboard with the proper emojis",
        function() {
            // Given
            var send_msg_stub = this.object_under_test.chat_api.send_message;

            // When
            this.object_under_test.send_scoreboard(standings);

            // Then
            expect(send_msg_stub.calledOnce).to.be.true;
            expect(send_msg_stub.args[0][0]).to.deep.equal(config.event_messages.scoreboard_heading + "\n"
            + config.event_messages.scoreboard_display_line.format("🥇", 1, 20, "tsbrenna") + "\n"
            + config.event_messages.scoreboard_display_line.format("🥈", 2, 15, "jrlanois") + "\n"
            + config.event_messages.scoreboard_display_line.format("🥉", 3, 10, "ceramire") + "\n"
            + config.event_messages.scoreboard_display_line.format("⭐", 4, 5, "kacrosby") );
        });
        it("Ensures the chat composer returns the empty message when the scoreboard is empty",
        function() {
            // Given
            var send_msg_stub = this.object_under_test.chat_api.send_message;

            // When
            this.object_under_test.send_scoreboard(itemized_standings_empty);

            // Then
            expect(send_msg_stub.callCount).to.equal(1);
            expect(send_msg_stub.args[0][0]).to.deep.equals(config.event_messages.empty_scoreboard);
        });

    });

    describe("ChatComposer().random_message()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var mattermost_stub = sinon.createStubInstance(Mattermost);
            this.object_under_test = new class_under_test(mattermost_stub);
            this.rand_stub = sinon.stub(module_under_test.Math, "random");
        });

        afterEach(function() {
            this.rand_stub.restore();
        });

        it("Ensures the random method will can result in the first element in a list", function() {
            // Check to see that the first message in the list is returned if random were to return 0
            this.rand_stub.returns(0);
            expect(this.object_under_test.random_message(messages)).to.deep.equals(messages[0]);
        });

        it("Ensures the random method will can result in a different element from a list", function() {
            this.rand_stub.returns(0.99);
            // Check to see that the second message in the list is returned if random were to return 1
            expect(this.object_under_test.random_message(messages)).to.deep.equals(messages[1]);
        });

    });

};

module.exports = factory;
