var chai   = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

const { check_default_overrides } = require('../../config/config_override.js');
const module_under_test = require('../../config/config_override.js');

const { config } = require('../../config/config');

const factory = { suite };

const original_message = "That's one less thing to worry about, ${user} just finished:\n${title}.";
const updated_message = "*This is some kinda test with ${user} who just finished:\n${title}.";

function suite() {

    describe("check_default_overrides()", function() {

        this.timeout(5000);

        before(function() {
            // Makes the config consistent for testing
            config.event_messages.finished_messages[0] = original_message;
        });

        afterEach(function() {
            // resets the config for testing
            config.event_messages.finished_messages[0] = original_message;
        });

        it("Ensures that the proper fields are updated when config_override is called on a file with a setting",
        function() {
            //Check Before
            expect(config.event_messages.finished_messages[0]).to.deep.equal(original_message);

            // when
            check_default_overrides('./test/resources/mock_config_file.json');

            // Then
            expect(config.event_messages.finished_messages[0]).to.deep.equal(updated_message);
        });

        it("Ensures that invalid paths to files will not do anything and leave default settings",
        function() {
            //Check Before
            expect(config.event_messages.finished_messages[0]).to.deep.equal(original_message);

            // when
            check_default_overrides('./some/invalid/path.json');

            // Then
            expect(config.event_messages.finished_messages[0]).to.deep.equal(original_message);
        });

        it("Ensures that invalid/bad JSON files are not read, resulting in nothing happening and leaving defaults",
        function() {
            //Check Before
            expect(config.event_messages.finished_messages[0]).to.deep.equal(original_message);

            // when
            check_default_overrides('./test/resources/mock_bad_config_file.json');

            // Then
            expect(config.event_messages.finished_messages[0]).to.deep.equal(original_message);
        });

        it("Ensures that invalid settings are not read if they exists but normal settings are if existing in the same file",
        function() {
            //Check Before
            expect(config.event_messages.finished_messages[0]).to.deep.equal(original_message);

            // when
            check_default_overrides("./test/resources/mock_config_with_invalid_setting.json");

            // Then
            expect(config.event_messages.finished_messages[0]).to.deep.equal(updated_message);
            expect(config.event_messages.invalid).to.be.undefined;
        });

        it("Ensures that arbitrary errors reslt in nothing happening and leaving the defaults",
        function() {
            //Check Before
            expect(config.event_messages.finished_messages[0]).to.deep.equal(original_message);
            module_under_test.update_object = sinon.stub().throws();

            // when
            module_under_test.check_default_overrides("./test/resources/mock_config_with_invalid_setting.json");

            // Then
            expect(config.event_messages.finished_messages[0]).to.deep.equal(original_message);
        });

    });

};

module.exports = factory;
