var chai   = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

const { ChatReceiver } = require('../components/chat_receiver');
const { GitReciever } = require('../components/git_receiver');
const { NotificationCenter} = require('../components/notification_center');
const { Scorer } = require('../components/scorer');

const module_under_test = require('../index');
const class_under_test = module_under_test.Initiator;


function suite() {


    describe("Initiator.apply_config_updates()", function() {

        this.timeout(5000);

        beforeEach(function() {
            this.object_under_test = new class_under_test();
            this.check_default_overrides_stub = sinon.stub(
                module_under_test, 'check_default_overrides');
        });

        afterEach(function () {
            this.check_default_overrides_stub.restore();
        });

        it("ensures apply_config_updates() applies updates that exist.",
        function() {
            // Given
            module_under_test.argv.config = "path";

            // When
            this.object_under_test.apply_config_updates();

            // Then
            expect(this.check_default_overrides_stub.callCount).to.equal(1);
            expect(this.check_default_overrides_stub.args[0]).to.deep.equal(
                ['path']
            );
        });

        it("ensures apply_config_updates() shortcircuits when no updates.",
        function() {
            // Given
            module_under_test.argv.config = "";

            // When
            this.object_under_test.apply_config_updates();

            // Then
            expect(this.check_default_overrides_stub.callCount).to.equal(0);
        });

    });
    
    describe("Initiator.create_objects()", function() {

        this.timeout(5000);

        beforeEach(function() {
            this.object_under_test = new class_under_test();
            this.chat_composer_stub = sinon.stub(module_under_test, 'ChatComposer');
            this.chat_receiver_stub = sinon.stub(module_under_test, 'ChatReceiver');
            this.event_storage_stub = sinon.stub(module_under_test, 'EventStorage');
            this.git_receiver_stub = sinon.stub(module_under_test, 'GitReciever');
            this.notification_center_stub = sinon.stub(module_under_test, 'NotificationCenter');
            this.scorer_stub = sinon.stub(module_under_test, 'Scorer');
            this.get_chat_api_stub = sinon.stub(module_under_test, 'get_chat_api');
        });

        afterEach(function () {
            this.chat_composer_stub.restore();
            this.chat_receiver_stub.restore();
            this.event_storage_stub.restore();
            this.git_receiver_stub.restore();
            this.notification_center_stub.restore();
            this.scorer_stub.restore();
            this.get_chat_api_stub.restore();
        });

        it("ensures that main() kicks everything off.",
        function() {
            // Given

            // When
            this.object_under_test.create_objects();

            // Then
            expect(this.event_storage_stub.callCount).to.equal(1);
            expect(this.get_chat_api_stub.callCount).to.equal(1);
            expect(this.chat_composer_stub.callCount).to.equal(1);
            expect(this.notification_center_stub.callCount).to.equal(1);
            expect(this.scorer_stub.callCount).to.equal(1);
            expect(this.git_receiver_stub.callCount).to.equal(1);
            expect(this.chat_receiver_stub.callCount).to.equal(1);
        });

    });

    describe("Initiator.start_components()", function() {

        this.timeout(5000);

        beforeEach(function() {
            this.object_under_test = new class_under_test();
        });

        afterEach(function () {

        });

        it("ensures start_components() applies updates that exist.",
        function() {
            // Given

            this.object_under_test.notification_center = sinon.createStubInstance(
                NotificationCenter);
            this.object_under_test.scorer = sinon.createStubInstance(Scorer);
            this.object_under_test.git_receiver = sinon.createStubInstance(
                GitReciever);
            this.object_under_test.chat_receiver = sinon.createStubInstance(
                ChatReceiver);

            // When
            this.object_under_test.start_components();

            // Then
            expect(
                this.object_under_test.notification_center.run.callCount
                ).to.equal(1);
            expect(this.object_under_test.scorer.run.callCount).to.equal(1);
            expect(
                this.object_under_test.git_receiver.run.callCount
                ).to.equal(1);
            expect(
                this.object_under_test.chat_receiver.run.callCount
                ).to.equal(1);
        });

    });

    describe("Initiator.main()", function() {

        this.timeout(5000);

        beforeEach(function() {
            this.object_under_test = new class_under_test();
        });

        afterEach(function () {

        });

        it("ensures start_components() applies updates that exist.",
        function() {
            // Given

            this.object_under_test.apply_config_updates = sinon.stub();
            this.object_under_test.create_objects = sinon.stub();
            this.object_under_test.start_components = sinon.stub();

            // When
            this.object_under_test.main();

            // Then
            expect(
                this.object_under_test.apply_config_updates.callCount
                ).to.equal(1);
            expect(
                this.object_under_test.create_objects.callCount
                ).to.equal(1);
            expect(
                this.object_under_test.start_components.callCount
                ).to.equal(1);
        });

    });

    describe("main()", function() {

        beforeEach(function() {
            this.initiator_stub = sinon.stub(module_under_test, 'Initiator');
        });

        afterEach(function () {
            this.initiator_stub.restore();
            process.env.NODE_ENV = 'test';

        });


        it("ensures main() calls Initiator outside of testing.",
        function() {
            // Given
            process.env.NODE_ENV = 'meta test';

            // When
            module_under_test.main();

            // Then
            expect(this.initiator_stub.callCount).to.equal(1);
        });

        it("ensures main() does not call Initiator during testing.",
        function() {
            // Given
            process.env.NODE_ENV = 'test';

            // When
            module_under_test.main();

            // Then
            expect(this.initiator_stub.callCount).to.equal(0);
        });

    });

}

const factory = {suite};

module.exports = factory;
