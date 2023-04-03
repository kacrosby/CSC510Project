var chai   = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

const module_under_test = require('../../../components/chat-apis/generic_chat_api');
const class_under_test = module_under_test.GenericChatApi;


function suite() {

    describe("GenericChatApi.register_callback()", function() {

        this.timeout(5000);

        beforeEach(function() {
            this.object_under_test = new class_under_test();
        });

        afterEach(function () {

        });

        it("ensures register_callback() doesn't register a callback since its not implemented.",
        function() {
            // Given
            let callback_stub = sinon.stub();

            // When
            this.object_under_test.register_callback(callback_stub);

            // Then
            expect(this.object_under_test.callback).to.deep.equal(null);
        });

    });

}

const factory = {suite};

module.exports = factory;
