var chai   = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var config = require('../../../config/config');
const { Mattermost } = require('../../../components/chat-apis/mattermost');
const module_under_test = require('../../../components/chat-apis/chat_helper');

const factory = {suite};

function suite() {

    describe("get_chat_api()", function() {

        this.timeout(5000);

        it("ensures that the proper client is created as it is specified in the config",
        function() {
            // Given
            module_under_test.config = {"chat_api":{"type":"Mattermost"}};
            let mattermost_stub = sinon.stub();
            module_under_test.Mattermost = mattermost_stub;

            // When
            let actual = module_under_test.get_chat_api();

            // Then
            expect(mattermost_stub.calledOnce).to.be.true;

        });

        it("ensures that the Mattermost client is not being run when it is not specified in the config",
        function() {
            // Given
            module_under_test.config = {"chat_api":{"type":""}};
            let mattermost_stub = sinon.stub();
            module_under_test.Mattermost = mattermost_stub;

            // When
            let actual = module_under_test.get_chat_api();

            // Then
            expect(mattermost_stub.notCalled).to.be.true;

        });

    });

};

module.exports = factory;
