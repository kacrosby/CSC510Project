var chai   = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var config = require('../../../config/config');
const module_under_test = require('../../../components/chat-apis/mattermost');

const class_under_test = module_under_test.Mattermost

const factory = {suite};

function suite() {

    describe("Mattermost().on_message()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            this.client_instance_stub = sinon.createStubInstance(module_under_test.Client);
            this.client_stub = sinon.stub(module_under_test, "Client");
            this.client_stub.returns(this.client_instance_stub);
            this.object_under_test = new class_under_test();
            this.parse_stub = sinon.stub(module_under_test.JSON, "parse");
        });

        afterEach(function() {
            // runs after each test in this block
            this.client_stub.restore();
            this.parse_stub.restore();
        });

        it("ensures that on_message doesn't call callback if the message doesn't have a post",
        function() {
            // Given
            let callback_stub = sinon.stub();
            this.object_under_test.callback = callback_stub;
            let message = {"data":{}};

            // When
            this.object_under_test.on_message(message);

            // Then
            expect(this.parse_stub.notCalled).to.be.true;
            expect(callback_stub.notCalled).to.be.true;

        });

        it("ensures that on_message calls back if there is a post with a message",
        function() {
            // Given
            let callback_stub = sinon.stub();
            this.object_under_test.callback = callback_stub;
            let message = {"data":{"post":"anything"}};
            let post = {"message":"something else"};
            this.parse_stub.returns(post);

            // When
            this.object_under_test.on_message(message);

            // Then
            expect(this.parse_stub.callCount).to.equal(1);
            expect(this.parse_stub.args[0]).to.deep.equal(["anything"]);
            expect(callback_stub.callCount).to.equal(1);
            expect(callback_stub.args[0]).to.deep.equal(["something else"]);

        });

    });

    describe("Mattermost().register_callback()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            this.client_instance_stub = sinon.createStubInstance(module_under_test.Client);
            this.client_stub = sinon.stub(module_under_test, "Client");
            this.client_stub.returns(this.client_instance_stub);
            this.object_under_test = new class_under_test();
        });

        afterEach(function() {
            // runs after each test in this block
            this.client_stub.restore();
        });

        it("ensures that the register_callback stores the callback",
        function() {
            // Given
            let callback_stub = sinon.stub();
            let bound_method = this.object_under_test.on_message.bind(this.object_under_test);
            let on_message_stub = sinon.stub();
            let bind_stub = sinon.stub();
            bind_stub.returns("something");

            on_message_stub.bind = bind_stub;
            this.object_under_test.on_message = on_message_stub;

            // When
            this.object_under_test.register_callback(callback_stub);

            // Then
            expect(this.object_under_test.callback).to.deep.equal(callback_stub);
            expect(this.client_instance_stub.on.callCount).to.equal(1);
            expect(this.client_instance_stub.on.args[0][0]).to.deep.equal(
                "message");
            expect(this.client_instance_stub.on.args[0][1]).to.deep.equal(
                "something");
            expect(bind_stub.callCount).to.equal(1);

        });

    });

    describe("Mattermost().send_message()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            this.client_instance_stub = sinon.createStubInstance(module_under_test.Client);
            this.client_stub = sinon.stub(module_under_test, "Client");
            this.client_stub.returns(this.client_instance_stub);
            this.object_under_test = new class_under_test();
        });

        afterEach(function() {
            // runs after each test in this block
            this.client_stub.restore();
        });

        it("ensures that the register_callback stores the callback",
        function() {
            // Given
            let channel_id = 'My Cousin Dolores';
            let message = "This whole chorus";
            this.object_under_test.channel_id = channel_id;

            // When
            this.object_under_test.send_message(message);

            // Then
            expect(
                this.client_instance_stub.postMessage.callCount
                ).to.equal(1);
            expect(
                this.client_instance_stub.postMessage.args[0]
                ).to.deep.equal([message, channel_id]);
        });

    });

};

module.exports = factory;
