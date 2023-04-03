var chai   = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

const { ChatComposer } = require('../../components/chat_composer');
const { EventStorage } = require('../../components/event_storage');
const { Scorer } = require('../../components/scorer');
const module_under_test = require('../../components/scorer');

const class_under_test = module_under_test.Scorer

const factory = {suite};

function suite() {

    describe("Scorer().get_events()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
            this.now_stub = sinon.stub(module_under_test.Date, 'now');
        });

        afterEach(function() {
            this.now_stub.restore();
        });

        it("ensures that get_events() calls the appropriate functions.",
        function() {
            // Given
            this.now_stub.returns(1000);
            var get_events_between_stub = (
                this.object_under_test.event_storage.get_events_between);
            var events = [
                {'trigger_time': 600, 'event_type': 'InsertComplete'}
            ];
            get_events_between_stub.returns(events);
            this.object_under_test.last_check_time = 500;
            var expected = events;

            // When
            actual = this.object_under_test.get_events();

            // Then
            expect(this.now_stub.calledOnce).to.be.true;
            expect(get_events_between_stub.calledOnce).to.be.true;
            expect(get_events_between_stub.args[0]).to.deep.equal([500, 1000])
            expect(this.object_under_test.last_check_time).to.equal(1000);
            expect(actual).to.deep.equal(expected);

        });

    });

    describe("Scorer - Integration", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            this.chat_composer_stub = sinon.createStubInstance(ChatComposer);
            this.event_storage = new EventStorage();
            this.object_under_test = new class_under_test(
                this.event_storage, this.chat_composer_stub);
            module_under_test.config = {
                "scorer": {
                    "check_cadence": "*/5 * * * * *", // Every 5 Seconds
                    "event_types": {
                        "IssueComplete": {
                            "each": 5 
                        }
                    }
                }
            };         
        });

        it("ensures that Scorer sends appropriate notifications given mock events",
        function() {
            // Given
            this.event_storage.add_event(
                500, 'IssueComplete', {'user': 'Mirabel'});
            this.event_storage.add_event(
                600, 'IssueComplete', {'user': 'Mirabel'});
            this.event_storage.add_event(
                650, 'IssueComplete', {'user': 'Lin'});
            this.event_storage.add_event(
                700, 'current rankings', {});
            let standings = {
                'Mirabel': 10, 'Lin': 5
            };
            var send_scoreboard_stub = this.chat_composer_stub.send_scoreboard;

            // When
            this.object_under_test.check_for_notifications();

            // Then
            expect(send_scoreboard_stub.callCount).to.equal(1);
            expect(send_scoreboard_stub.args[0]).to.deep.equal([standings]);

        });

    });

    describe("scorer().run()", function() {

    this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
            module_under_test.config = {
                "scorer": {
                    "check_cadance": "*/5 * * * * *", // Every 5 Seconds
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
            var check_for_notifications_stub = sinon.stub(
                this.object_under_test, 'check_for_notifications');
            let bind_stub = sinon.stub();
            bind_stub.returns("something");
            check_for_notifications_stub.bind = bind_stub;

            // When
            this.object_under_test.run();

            // Then
            expect(this.schedule_stub.callCount).to.equal(1);
            expect(this.schedule_stub.args[0]).to.deep.equal(
                ["*/5 * * * * *", "something"]);
            expect(bind_stub.callCount).to.equal(1);
        });

    });
}
module.exports = factory;
