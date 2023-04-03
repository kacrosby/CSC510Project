var chai   = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var config = require('../../config/config');
const { ChatComposer } = require('../../components/chat_composer');
const { EventStorage } = require('../../components/event_storage');
const module_under_test = require('../../components/notification_center');

const class_under_test = module_under_test.NotificationCenter

const factory = {suite};

function suite() {

    describe("NotificationCenter().check_for_individual_notification()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
            module_under_test.config = {
                "notification_center": {
                    "event_types": {
                        "IndividualTrue": {
                            "individual": true,
                            "streaks": [3, 5],
                            "record": true
                        },
                       "IndividualFalse": {
                        "individual": false,
                        "streaks": [3, 5],
                        "record": true
                        },
                        "IndividualMissing": {
                            "streaks": [3, 5],
                            "record": true
                        },
                    }
                }
            }           
        });

        it("ensures that check_for_individual_notification() sends notifications",
        function() {
            // Given
            var send_individual_stub = (
                this.object_under_test.chat_composer.send_individual);
            fake_event = {'event_type': 'IndividualTrue'};

            // When
            this.object_under_test.check_for_individual_notification(
                fake_event);

            // Then
            expect(send_individual_stub.calledOnce).to.be.true;

        });

        it("ensures that check_for_individual_notification() doesn't send notifications when configured to false.",
        function() {
            // Given.
            var send_individual_stub = (
                this.object_under_test.chat_composer.send_individual);
            fake_event = {'event_type': 'IndividualFalse'};

            // When
            this.object_under_test.check_for_individual_notification(
                fake_event);

            // Then
            expect(send_individual_stub.notCalled).to.be.true;

        });

        it("ensures that check_for_individual_notification() doesn't send notifications when not configured.",
        function() {
            // Given
            var send_individual_stub = (
                this.object_under_test.chat_composer.send_individual);
            fake_event = {'event_type': 'IndividualMissing'};

            // When
            this.object_under_test.check_for_individual_notification(
                fake_event);

            // Then
            expect(send_individual_stub.notCalled).to.be.true;

        });

        it("ensures that check_for_individual_notification() doesn't send notifications for random events.",
        function() {
            // Given
            var send_individual_stub = (
                this.object_under_test.chat_composer.send_individual);
            fake_event = {'event_type': 'CommandRequested'};

            // When
            this.object_under_test.check_for_individual_notification(
                fake_event);

            // Then
            expect(send_individual_stub.notCalled).to.be.true;

        });

    });

    describe("NotificationCenter().check_for_new_record()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
            module_under_test.config = {
                "notification_center": {
                    "event_types": {
                        "RecordTrue": {
                            "individual": true,
                            "streaks": [3, 5],
                            "record": true
                        },
                       "RecordFalse": {
                        "individual": false,
                        "streaks": [3, 5],
                        "record": false
                        },
                        "RecordMissing": {
                            "streaks": [3, 5],
                        },
                    }
                }
            }           
        });

        it("ensures that check_for_new_record() sends notifications",
        function() {
            // Given
            var send_record_stub = (
                this.object_under_test.chat_composer.send_record);
            var update_record_stub = sinon.stub(
                this.object_under_test, 'update_record');
            fake_event = 'RecordTrue';
            fake_user = 'username';
            fake_streak = 5;
            fake_record = 4;

            // When
            this.object_under_test.check_for_new_record(
                fake_user, fake_event, fake_streak, fake_record);

            // Then
            expect(send_record_stub.calledOnce).to.be.true;
            expect(update_record_stub.calledOnce).to.be.true;

        });

        it("ensures that check_for_new_record() doesn't send notifications when configured to false.",
        function() {
            // Given
            var send_record_stub = (
                this.object_under_test.chat_composer.send_record)
            var update_record_stub = sinon.stub(
                this.object_under_test, 'update_record');
            fake_event = 'RecordFalse';
            fake_user = 'username';
            fake_streak = 5;
            fake_record = 4;

            // When
            this.object_under_test.check_for_new_record(
                fake_user, fake_event, fake_streak, fake_record);

            // Then
            expect(send_record_stub.notCalled).to.be.true;
            expect(update_record_stub.notCalled).to.be.true;

        });


        it("ensures that check_for_new_record() doesn't send notifications when not configured.",
        function() {
            // Given
            var send_record_stub = (
                this.object_under_test.chat_composer.send_record)
            var update_record_stub = sinon.stub(
                this.object_under_test, 'update_record');
            fake_event = 'RecordMissing';
            fake_user = 'username';
            fake_streak = 5;
            fake_record = 4;

            // When
            this.object_under_test.check_for_new_record(
                fake_user, fake_event, fake_streak, fake_record);

            // Then
            expect(send_record_stub.notCalled).to.be.true;
            expect(update_record_stub.notCalled).to.be.true;

        });

        it("ensures that check_for_new_record() doesn't send notifications for unbroken records.",
        function() {
            // Given
            var send_record_stub = (
                this.object_under_test.chat_composer.send_record)
            var update_record_stub = sinon.stub(
                this.object_under_test, 'update_record');
            fake_event = 'RecordTrue';
            fake_user = 'username';
            fake_streak = 3;
            fake_record = 4;

            // When
            this.object_under_test.check_for_new_record(
                fake_user, fake_event, fake_streak, fake_record);

            // Then
            expect(send_record_stub.notCalled).to.be.true;
            expect(update_record_stub.notCalled).to.be.true;

        });

    });

    describe("NotificationCenter().check_for_new_records()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
        });

        it("ensures that check_for_new_records() calls the appropriate functions.",
        function() {
            // Given
            this.object_under_test.streaks = {
                'user_1': {
                    'type_1': 5,
                },
                'user_2': {
                    'type_1': 3,
                    'type_2': 4
                }
            };
            var get_record_stub = sinon.stub(
                this.object_under_test, 'get_record');
            get_record_stub.returns(3);
            var check_for_new_record_stub = sinon.stub(
                this.object_under_test, 'check_for_new_record');

            // When
            this.object_under_test.check_for_new_records();

            // Then
            expect(get_record_stub.callCount).to.equal(3);
            expect(get_record_stub.args[0]).to.deep.equal(
                ['user_1', 'type_1']);
            expect(get_record_stub.args[1]).to.deep.equal(
                ['user_2', 'type_1']);
            expect(get_record_stub.args[2]).to.deep.equal(
                ['user_2', 'type_2']);
            expect(check_for_new_record_stub.callCount).to.equal(3);
            expect(check_for_new_record_stub.args[0]).to.deep.equal(
                ['user_1', 'type_1', 5, 3]);
            expect(check_for_new_record_stub.args[1]).to.deep.equal(
                ['user_2', 'type_1', 3, 3]);
            expect(check_for_new_record_stub.args[2]).to.deep.equal(
                ['user_2', 'type_2', 4, 3]);

        });

    });

    describe("NotificationCenter().check_for_notifications()", function() {

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

        it("ensures that check_for_notifications() calls the appropriate functions.",
        function() {
            // Given
            var events = [
                {'trigger_time': 600, 'event_type': 'type_1'},
                {'trigger_time': 700, 'event_type': 'type_1'},
            ];
            var get_events_stub = sinon.stub(
                this.object_under_test, 'get_events');
            get_events_stub.returns(events);
            var check_for_individual_notification_stub = sinon.stub(
                this.object_under_test, 'check_for_individual_notification');
            var tally_1 = {'type_1': 1};
            var tally_2 = {'type_1': 2};
            var tally_event_stub = sinon.stub(
                this.object_under_test, 'tally_event');
            tally_event_stub.onCall(0).returns(tally_1);
            tally_event_stub.onCall(1).returns(tally_2);
            var check_for_streaks_stub = sinon.stub(
                this.object_under_test, 'check_for_streaks');
            this.object_under_test.send_notifications_flag = true;

            var check_for_new_records_stub = sinon.stub(
                this.object_under_test, 'check_for_new_records');

            // When
            this.object_under_test.check_for_notifications();

            // Then
            expect(get_events_stub.calledOnce).to.be.true;
            expect(
                check_for_individual_notification_stub.callCount).to.equal(2);
            expect(check_for_individual_notification_stub.args[0]).to.deep.equal([events[0]]);
            expect(check_for_individual_notification_stub.args[1]).to.deep.equal([events[1]]);
            expect(tally_event_stub.callCount).to.equal(2);
            expect(tally_event_stub.args[0]).to.deep.equal([{}, events[0]]);
            expect(tally_event_stub.args[1]).to.deep.equal([tally_1, events[1]]);
            expect(check_for_streaks_stub.callCount).to.equal(1);
            expect(check_for_streaks_stub.args[0]).to.deep.equal([tally_2]);
            expect(check_for_new_records_stub.calledOnce).to.be.true;

        });

        it("ensures that check_for_notifications() just updates time when sending notifications is disabled.",
        function() {
            // Given
            this.now_stub.returns(800);
            var get_events_stub = sinon.stub(
                this.object_under_test, 'get_events');
            var check_for_individual_notification_stub = sinon.stub(
                this.object_under_test, 'check_for_individual_notification');
            var tally_event_stub = sinon.stub(
                this.object_under_test, 'tally_event');
            var check_for_streaks_stub = sinon.stub(
                this.object_under_test, 'check_for_streaks');
            var check_for_new_records_stub = sinon.stub(
                this.object_under_test, 'check_for_new_records');
            this.object_under_test.send_notifications_flag = false;

            // When
            this.object_under_test.check_for_notifications();

            // Then
            expect(get_events_stub.callCount).to.equal(0);
            expect(this.object_under_test.last_check_time).to.equal(800);

        });

    });

    describe("NotificationCenter().check_for_streak()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
        });

        it("ensures that check_for_streak() sends multiple notifications.",
        function() {
            // Given
            var event_tally = {
                "Mirabel": {'IssueComplete': 5, 'OtherEvent': 1},
                "Lin": {'IssueComplete': 3}
            };
            var get_streak_stub = sinon.stub(
                this.object_under_test, 'get_streak');
            get_streak_stub.onCall(0).returns(2);
            get_streak_stub.onCall(1).returns(4);
            var update_streak_stub = sinon.stub(
                this.object_under_test, 'update_streak');
            var get_streak_thresholds_stub = sinon.stub(
                this.object_under_test, 'get_streak_thresholds');
            get_streak_thresholds_stub.returns([3, 4]);
            var send_streak_stub = this.object_under_test.chat_composer.send_streak;
            var user = 'Mirabel';
            var event_type = 'IssueComplete';
            var new_events = 2;

            // When
            this.object_under_test.check_for_streak(
                user, event_type, new_events);

            // Then
            expect(get_streak_stub.callCount).to.equal(2);
            expect(get_streak_stub.args[0]).to.deep.equal([user, event_type]);
            expect(get_streak_stub.args[1]).to.deep.equal([user, event_type]);

            expect(update_streak_stub.callCount).to.equal(1);
            expect(update_streak_stub.args[0]).to.deep.equal(
                [user, event_type, new_events]);

            expect(get_streak_thresholds_stub.callCount).to.equal(1);
            expect(get_streak_thresholds_stub.args[0]).to.deep.equal(
                [event_type]);

            expect(send_streak_stub.callCount).to.equal(2);
            expect(send_streak_stub.args[0]).to.deep.equal(
                [user, event_type, 3]);
            expect(send_streak_stub.args[1]).to.deep.equal(
                [user, event_type, 4]);

        });

        it("ensures that check_for_streak() doesn't send notifications when streaks are too short.",
        function() {
            // Given
            var event_tally = {
                "Mirabel": {'IssueComplete': 5, 'OtherEvent': 1},
                "Lin": {'IssueComplete': 3}
            };
            var get_streak_stub = sinon.stub(
                this.object_under_test, 'get_streak');
            get_streak_stub.onCall(0).returns(2);
            get_streak_stub.onCall(1).returns(4);
            var update_streak_stub = sinon.stub(
                this.object_under_test, 'update_streak');
            var get_streak_thresholds_stub = sinon.stub(
                this.object_under_test, 'get_streak_thresholds');
            get_streak_thresholds_stub.returns([7]);
            var send_streak_stub = this.object_under_test.chat_composer.send_streak;
            var user = 'Mirabel';
            var event_type = 'IssueComplete';
            var new_events = 2;

            // When
            this.object_under_test.check_for_streak(
                user, event_type, new_events);

            // Then
            expect(get_streak_stub.callCount).to.equal(2);
            expect(get_streak_stub.args[0]).to.deep.equal([user, event_type]);
            expect(get_streak_stub.args[1]).to.deep.equal([user, event_type]);

            expect(update_streak_stub.callCount).to.equal(1);
            expect(update_streak_stub.args[0]).to.deep.equal(
                [user, event_type, new_events]);

            expect(get_streak_thresholds_stub.callCount).to.equal(1);
            expect(get_streak_thresholds_stub.args[0]).to.deep.equal(
                [event_type]);

            expect(send_streak_stub.callCount).to.equal(0);

        });

        it("ensures that check_for_streak() doesn't send notifications when streaks were already achieved.",
        function() {
            // Given
            var event_tally = {
                "Mirabel": {'IssueComplete': 5, 'OtherEvent': 1},
                "Lin": {'IssueComplete': 3}
            };
            var get_streak_stub = sinon.stub(
                this.object_under_test, 'get_streak');
            get_streak_stub.onCall(0).returns(2);
            get_streak_stub.onCall(1).returns(4);
            var update_streak_stub = sinon.stub(
                this.object_under_test, 'update_streak');
            var get_streak_thresholds_stub = sinon.stub(
                this.object_under_test, 'get_streak_thresholds');
            get_streak_thresholds_stub.returns([2]);
            var send_streak_stub = this.object_under_test.chat_composer.send_streak;
            var user = 'Mirabel';
            var event_type = 'IssueComplete';
            var new_events = 2;

            // When
            this.object_under_test.check_for_streak(
                user, event_type, new_events);

            // Then
            expect(get_streak_stub.callCount).to.equal(2);
            expect(get_streak_stub.args[0]).to.deep.equal([user, event_type]);
            expect(get_streak_stub.args[1]).to.deep.equal([user, event_type]);

            expect(update_streak_stub.callCount).to.equal(1);
            expect(update_streak_stub.args[0]).to.deep.equal(
                [user, event_type, new_events]);

            expect(get_streak_thresholds_stub.callCount).to.equal(1);
            expect(get_streak_thresholds_stub.args[0]).to.deep.equal(
                [event_type]);

            expect(send_streak_stub.callCount).to.equal(0);

        });

    });

    describe("NotificationCenter().check_for_streaks()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
        });

        it("ensures that check_for_streaks() calls the appropriate functions.",
        function() {
            // Given
            var event_tally = {
                "Mirabel": {'IssueComplete': 5, 'OtherEvent': 1},
                "Lin": {'IssueComplete': 3}
            };
            var check_for_streak_stub = sinon.stub(
                this.object_under_test, 'check_for_streak');

            // When
            this.object_under_test.check_for_streaks(event_tally);

            // Then
            expect(check_for_streak_stub.callCount).to.equal(3);
            expect(check_for_streak_stub.args[0]).to.deep.equal(
                ['Mirabel', 'IssueComplete', 5]);
            expect(check_for_streak_stub.args[1]).to.deep.equal(
                ['Mirabel', 'OtherEvent', 1]);
            expect(check_for_streak_stub.args[2]).to.deep.equal(
                ['Lin', 'IssueComplete', 3]);

        });

    });

    describe("NotificationCenter().ensure_event_type()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
        });

        it("ensures that ensure_event_type() adds the event_type key if missing.",
        function() {
            // Given
            var item = {};
            var event_type = 'InsertComplete';

            // When
            this.object_under_test.ensure_event_type(item, event_type);

            // Then
            expect(item).to.have.property(event_type);
            expect(item).property(event_type).to.equal(0);

        });

        it("ensures that ensure_event_type() doesn't overwrite an existing value.",
        function() {
            // Given
            var item = {'InsertComplete': 42};
            var event_type = 'InsertComplete';

            // When
            this.object_under_test.ensure_event_type(item, event_type);

            // Then
            expect(item).to.have.property(event_type);
            expect(item).property(event_type).to.equal(42);

        });

    });

    describe("NotificationCenter().ensure_user()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
        });

        it("ensures that ensure_user() adds the user key if missing.",
        function() {
            // Given
            var item = {};
            var user = 'Mirabel';

            // When
            this.object_under_test.ensure_user(item, user);

            // Then
            expect(item).to.have.property(user);
            expect(item).property(user).to.deep.equal({});

        });

        it("ensures that ensure_user() doesn't overwrite an existing value.",
        function() {
            // Given
            var item = {'Mirabel': {'InsertComplete': 42}};
            var user = 'Mirabel';

            // When
            this.object_under_test.ensure_user(item, user);

            // Then
            expect(item).to.have.property(user);
            expect(item).property(user).to.have.property('InsertComplete');;

        });

    });

    describe("NotificationCenter().get_events()", function() {

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

    describe("NotificationCenter().get_record()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
        });

        it("ensures that get_record() calls the appropriate functions.",
        function() {
            // Given
            var user = 'Mirabel';
            var event_type = 'IssueComplete';
            this.object_under_test.records = {
                'Mirabel': {'IssueComplete': 5}
            }
            var ensure_user_stub = sinon.stub(
                this.object_under_test, 'ensure_user');
            var ensure_event_type_stub = sinon.stub(
                this.object_under_test, 'ensure_event_type');
            var expected = 5;

            // When
            actual = this.object_under_test.get_record(user, event_type);

            // Then
            expect(ensure_user_stub.calledOnce).to.be.true;
            expect(ensure_user_stub.args[0]).to.deep.equal(
                [this.object_under_test.records, user]);
            expect(ensure_event_type_stub.calledOnce).to.be.true;
            expect(ensure_event_type_stub.args[0]).to.deep.equal(
                [this.object_under_test.records[user], event_type]);
            expect(actual).to.deep.equal(expected);

        });

    });

    describe("NotificationCenter().get_streak()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
        });

        it("ensures that get_streak() calls the appropriate functions.",
        function() {
            // Given
            var user = 'Mirabel';
            var event_type = 'IssueComplete';
            this.object_under_test.streaks = {
                'Mirabel': {'IssueComplete': 5}
            }
            var ensure_user_stub = sinon.stub(
                this.object_under_test, 'ensure_user');
            var ensure_event_type_stub = sinon.stub(
                this.object_under_test, 'ensure_event_type');
            var expected = 5;

            // When
            actual = this.object_under_test.get_streak(user, event_type);

            // Then
            expect(ensure_user_stub.calledOnce).to.be.true;
            expect(ensure_user_stub.args[0]).to.deep.equal(
                [this.object_under_test.streaks, user]);
            expect(ensure_event_type_stub.calledOnce).to.be.true;
            expect(ensure_event_type_stub.args[0]).to.deep.equal(
                [this.object_under_test.streaks[user], event_type]);
            expect(actual).to.deep.equal(expected);

        });

    });

    describe("NotificationCenter().get_streak_thresholds()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);

            module_under_test.config = {
                "notification_center": {
                    "event_types": {
                        "IssueComplete": {
                            "individual": true,
                            "streaks": [3, 5],
                            "record": true
                        },
                        "ReleaseReviewed": {
                            "individual": true,
                        },
                    }
                }
            };
        });

        it("ensures that get_streak_thresholds() provides an existing list.",
        function() {
            // Given
            var event_type = 'IssueComplete';
            var expected = [3, 5];

            // When
            actual = this.object_under_test.get_streak_thresholds(event_type);

            // Then
            expect(actual).to.deep.equal(expected);
        });

        it("ensures that get_streak_thresholds() provides an empty list if not configured.",
        function() {
            // Given
            var event_type = 'ReleaseReviewed';
            var expected = [];

            // When
            actual = this.object_under_test.get_streak_thresholds(event_type);

            // Then
            expect(actual).to.deep.equal(expected);
        });

    });

    describe("NotificationCenter().on_cron()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
        });

        it("ensures that on_cron() calls the appropriate functions.",
        function() {
            // Given
            var check_for_notifications_stub = sinon.stub(
                this.object_under_test, 'check_for_notifications');
            var reset_streaks_stub = sinon.stub(
                this.object_under_test, 'reset_streaks');

            // When
            this.object_under_test.on_cron();

            // Then
            expect(check_for_notifications_stub.calledOnce).to.be.true;
            expect(reset_streaks_stub.calledOnce).to.be.true;

        });

    });

    describe("NotificationCenter().reset_streaks()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
        });

        it("ensures that reset_streaks() removes all the streaks information.",
        function() {
            // Given
            this.object_under_test.send_notifications_flag = false;
            this.object_under_test.streaks = {'Mirabel': {'IssueComplete': 5}};

            // When
            this.object_under_test.reset_streaks();

            // Then
            expect(this.object_under_test.streaks).to.deep.equal({});
            expect(this.object_under_test.send_notifications_flag).to.be.true;

        });

    });

    describe("NotificationCenter().tally_event()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            module_under_test.config = {
                "notification_center": {
                    "event_types": {
                        "IssueComplete": {
                            "individual": true,
                            "streaks": [3, 5],
                            "record": true
                        },
                        "OtherEvent": {
                            "individual": true,
                            "streaks": [3, 5],
                            "record": true
                        },
                    }
                }
            };
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
        });

        it("ensures that tally_event() tallies valid events.",
        function() {
            // Given
            var event_tally = {
                "Mirabel": {'IssueComplete': 5, 'OtherEvent': 0},
                "Lin": {'IssueComplete': 3}
            };
            var event = {
                'event_type': 'IssueComplete',
                'metadata': {'user': 'Mirabel'}
            };
            var user = 'Mirabel';
            var event_type = 'IssueComplete';
            var ensure_user_stub = sinon.stub(
                this.object_under_test, 'ensure_user');
            var ensure_event_type_stub = sinon.stub(
                this.object_under_test, 'ensure_event_type');
            var expected = {
                "Mirabel": {'IssueComplete': 6, 'OtherEvent': 0},
                "Lin": {'IssueComplete': 3}
            };

            // When
            actual = this.object_under_test.tally_event(event_tally, event);

            // Then
            expect(ensure_user_stub.calledOnce).to.be.true;
            expect(ensure_user_stub.args[0]).to.deep.equal(
                [event_tally, user]);
            expect(ensure_event_type_stub.calledOnce).to.be.true;
            expect(ensure_event_type_stub.args[0]).to.deep.equal(
                [event_tally[user], event_type]);
            expect(actual).to.deep.equal(expected);

        });

        it("ensures that tally_event() doesn't tally invalid events.",
        function() {
            // Given
            var event_tally = {
                "Mirabel": {'IssueComplete': 5, 'OtherEvent': 0},
                "Lin": {'IssueComplete': 3}
            };
            var event = {
                'event_type': 'AnotherEvent',
                'metadata': {'user': 'Mirabel'}
            };
            var ensure_user_stub = sinon.stub(
                this.object_under_test, 'ensure_user');
            var ensure_event_type_stub = sinon.stub(
                this.object_under_test, 'ensure_event_type');
            var expected = {
                "Mirabel": {'IssueComplete': 5, 'OtherEvent': 0},
                "Lin": {'IssueComplete': 3}
            };

            // When
            actual = this.object_under_test.tally_event(event_tally, event);

            // Then
            expect(ensure_user_stub.notCalled).to.be.true;
            expect(ensure_event_type_stub.notCalled).to.be.true;
            expect(actual).to.deep.equal(expected);

        });

    });

    describe("NotificationCenter().update_record()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
        });

        it("ensures that update_record() stores the new record value.",
        function() {
            // Given
            this.object_under_test.records = {'Mirabel': {'IssueComplete': 5}};
            var user = 'Mirabel';
            var event_type = 'IssueComplete';
            var new_record = '7';

            // When
            this.object_under_test.update_record(user, event_type, new_record);

            // Then
            expect(this.object_under_test.records[user][event_type]).to.equal(
                new_record);

        });

    });

    describe("NotificationCenter().update_streak()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
        });

        it("ensures that update_streak() adds the new events to the streak.",
        function() {
            // Given
            this.object_under_test.streaks = {'Mirabel': {'IssueComplete': 5}};
            var user = 'Mirabel';
            var event_type = 'IssueComplete';
            var new_events = 2;

            var expected = 7;

            // When
            this.object_under_test.update_streak(user, event_type, new_events);

            // Then
            expect(this.object_under_test.streaks[user][event_type]).to.equal(
                expected);

        });

    });

    describe("NotificationCenter().run()", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            module_under_test.config = {
                "notification_center": {
                    "check_cadence": "*/5 * * * * *", // Every 5 Seconds
                    "reset_streak_cadence": "0 9 * * *", // Every Day at 4 AM EST
                    "enable_startup_notifications": true,
                }
            }; 
            var chat_composer_stub = sinon.createStubInstance(ChatComposer);
            var event_storage_stub = sinon.createStubInstance(EventStorage);
            this.object_under_test = new class_under_test(
                event_storage_stub, chat_composer_stub);
            this.schedule_stub = sinon.stub(
                module_under_test.cron, 'schedule');        
        });
        
        afterEach(function() {
            this.schedule_stub.restore();
        });

        it("ensures that run() calls the appropriate functions.",
        function() {
            // Given
            
            var on_cron_stub = sinon.stub(
                this.object_under_test, 'on_cron');
            var check_for_notifications_stub = sinon.stub(
                this.object_under_test, 'check_for_notifications');
            let bind_stub = sinon.stub();
            bind_stub.returns("something");
            on_cron_stub.bind = bind_stub;
            check_for_notifications_stub.bind = bind_stub;

            // When
            this.object_under_test.run();

            // Then
            expect(this.schedule_stub.callCount).to.equal(2);
            expect(this.schedule_stub.args[0]).to.deep.equal(
                ["0 9 * * *", "something"]);
            expect(this.schedule_stub.args[1]).to.deep.equal(
                ["*/5 * * * * *", "something"]);

        });

    });

    describe("NotificationCenter - Integration", function() {

        this.timeout(5000);

        beforeEach(function() {
            // runs before each test in this block
            module_under_test.config = {
                "notification_center": {
                    "check_cadence": "*/5 * * * * *", // Every 5 Seconds
                    "reset_streak_cadence": "0 9 * * *", // Every Day at 4 AM EST
                    "enable_startup_notifications": true,
                    "event_types": {
                        "IssueComplete": {
                            "individual": true,
                            "streaks": [3, 5],
                            "record": true
                        }
                    }
                }
            };  
            this.chat_composer_stub = sinon.createStubInstance(ChatComposer);
            this.event_storage = new EventStorage();
            this.object_under_test = new class_under_test(
                this.event_storage, this.chat_composer_stub);
        });

        it("ensures that NotificationCenter sends appropriate notifications given mock events",
        function() {
            // Given
            this.event_storage.add_event(
                500, 'IssueComplete', {'user': 'Mirabel'});
            this.event_storage.add_event(
                600, 'IssueComplete', {'user': 'Mirabel'});
            this.object_under_test.records = {
                'Mirabel': {
                    'IssueComplete': 1
                }
            }
            var send_individual_stub = this.chat_composer_stub.send_individual;
            var send_record_stub = this.chat_composer_stub.send_record;

            // When
            this.object_under_test.check_for_notifications();

            // Then
            expect(send_individual_stub.callCount).to.equal(2);
            expect(send_individual_stub.args[0]).to.deep.equal([{
                'trigger_time': 500,
                'event_type': 'IssueComplete',
                'metadata': {'user': 'Mirabel'}
            }]);
            expect(send_individual_stub.args[1]).to.deep.equal([{
                'trigger_time': 600,
                'event_type': 'IssueComplete',
                'metadata': {'user': 'Mirabel'}
            }]);
            expect(send_record_stub.callCount).to.equal(1);
            expect(send_record_stub.args[0]).to.deep.equal(
                ['Mirabel', 'IssueComplete', 2]
            );


        });

    });

}
 
module.exports = factory;
