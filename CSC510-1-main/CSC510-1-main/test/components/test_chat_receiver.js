var chai   = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var config = require('../../config/config');
const { EventStorage } = require('../../components/event_storage');
const { Mattermost } = require('../../components/chat-apis/mattermost');
const module_under_test = require('../../components/chat_receiver');

const class_under_test = module_under_test.ChatReceiver

const factory = {suite};

function suite() {

    describe("ChatReceiver().find_command()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            var mattermost_stub = sinon.createStubInstance(Mattermost);
            this.object_under_test = new class_under_test( 
               event_storage_stub, mattermost_stub);
            this.now_stub = sinon.stub(module_under_test.Date, "now");
        });

        afterEach(function() {
            this.now_stub.restore();
        });

        it("ensures that a message with no command phrases leads to nothing happening",
        function() {
            // Given
            var add_event_stub = (
                this.object_under_test.event_storage.add_event);
            var message = "";

            // When
            this.object_under_test.find_command(message);

            // Then
            expect(add_event_stub.notCalled).to.be.true;

        });

        it("ensures that a message with the \"current rankings\" phrase in it records the event and adds it to the event storage",
        function() {
            // Given
            var add_event_stub = (
                this.object_under_test.event_storage.add_event);
            var message = "current rankings";
            this.now_stub.returns(500);

            // When
            this.object_under_test.find_command(message);

            // Then
            expect(add_event_stub.calledOnce).to.be.true;
            expect(add_event_stub.args[0]).to.deep.equal([500,"current rankings",{}]);
            
        });

    });

    describe("ChatReceiver().run()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            this.event_storage_stub = sinon.createStubInstance(EventStorage);
            this.mattermost_stub = sinon.createStubInstance(Mattermost);
            this.object_under_test = new class_under_test( 
               this.event_storage_stub, this.mattermost_stub);
        });

        afterEach(function() {

        });

        it("ensures run() registers the chat_client's callback.",
        function() {
            // Given
            let callback_stub = sinon.stub();
            let bind_stub = sinon.stub();
            bind_stub.returns(callback_stub);
            let find_command_stub = sinon.stub(
                this.object_under_test, 'find_command');
            find_command_stub.bind = bind_stub;

            // When
            this.object_under_test.run();

            // Then
            expect(
                this.mattermost_stub.register_callback.callCount
                ).to.equal(1);
            expect(
                this.mattermost_stub.register_callback.args[0]
            ).to.deep.equal([callback_stub]);

        });

    });

};

module.exports = factory;
