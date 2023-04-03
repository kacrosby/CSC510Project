var chai   = require('chai');
var expect = chai.expect;

const module_under_test = require('../../components/event_storage');

const class_under_test = module_under_test.EventStorage

const factory = {suite};

function suite() {

    describe("EventStorage().add_events()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            this.object_under_test = new class_under_test();
        });

        it("ensures that add_events() creates a new event in the events list",
        function() {
            // Given
            let trigger_time = '0';
            let event_type = "IssueComplete";
            let metadata = {};
            let item = {
                "trigger_time": trigger_time,
                "event_type": event_type,
                "metadata": metadata
            }

            // When
            this.object_under_test.add_event(trigger_time, event_type, metadata);

            // Then
            expect(this.object_under_test.events).to.have.lengthOf(1);
            expect(this.object_under_test.events[0]).to.deep.equal(item);

        });

    });

    describe("EventStorage().get_events_between()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            this.object_under_test = new class_under_test();
        });

        it("ensures that get_events_between() ignores older events",
        function() {
            // Given
            this.object_under_test.events = [{"trigger_time": 0}];
            let expected = [];

            // When
            let actual = this.object_under_test.get_events_between(500, 1000);

            // Then
            expect(expected).to.deep.equal(actual);
        })

        it("ensures that get_events_between() keeps current events",
        function() {
            // Given
            this.object_under_test.events = [
                {"trigger_time": 600}, {"trigger_time": 700}];
            let expected = [{"trigger_time": 600}, {"trigger_time": 700}];

            // When
            let actual = this.object_under_test.get_events_between(500, 1000);

            // Then
            expect(expected).to.deep.equal(actual);
        })

        it("ensures that get_events_between() ignores newer events",
        function() {
            // Given
            this.object_under_test.events = [{"trigger_time": 2000}];
            let expected = [];

            // When
            let actual = this.object_under_test.get_events_between(500, 1000);

            // Then
            expect(expected).to.deep.equal(actual);
        })

    });

};

module.exports = factory;
