describe('Optimizely Forwarder', function () {
    var ReportingService = function () {
            var self = this;

            this.id = null;
            this.event = null;

            this.cb = function (id, event) {
                self.id = id;
                self.event = event;
            };

            this.reset = function () {
                this.id = null
                this.event = null;
            };
        },
        reportService = new ReportingService(),
        MessageType = {
            SessionStart: 1,
            SessionEnd: 2,
            PageView: 3,
            PageEvent: 4,
            CrashReport: 5,
            OptOut: 6,
            Commerce: 16
        },
        EventType = {
            Unknown: 0,
            Navigation: 1,
            Location: 2,
            Search: 3,
            Transaction: 4,
            UserContent: 5,
            UserPreference: 6,
            Social: 7,
            Other: 8,
            Media: 9,
            getName: function () {
                return 'blahblah';
            }
        };

    before(function () {
        mParticle.EventType = EventType;
        mParticle.forwarder.init({}, reportService.cb, 1, true);
    });

    beforeEach(function () {
        window.optimizely = [];
    });

    it('should log an event', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageEvent,
            EventName: 'Test Event',
            EventAttributes: {
                'my attr': 'my value',
                '$Amount': 35
            }
        });

        window.optimizely[0][0].should.equal('trackEvent');
        window.optimizely[0][1].should.equal('Test Event');
        window.optimizely[0][2].should.have.property('revenue', 3500);

        done();
    });

    it('should log transaction', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageEvent,
            EventCategory: EventType.Transaction,
            EventAttributes: {
                RevenueAmount: 100,
                ProductName: 'My Product'
            }
        });

        window.optimizely[0][0].should.equal('trackEvent');
        window.optimizely[0][1].should.equal('My Product');
        window.optimizely[0][2].should.have.property('revenue', 10000);

        done();
    });

    it('should set user attribute', function(done) {
        mParticle.forwarder.setUserAttribute('gender', 'male');

        window.optimizely[0][0].should.equal('setDimensionValue');
        window.optimizely[0][1].should.equal('gender');
        window.optimizely[0][2].should.equal('male');

        done();
    });

    it('should log commerce event', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.Commerce,
            ProductAction: {
                TransactionId: 12345,
                TotalAmount: 500
            }
        });

        window.optimizely[0][0].should.equal('trackEvent');
        window.optimizely[0][1].should.equal(12345);
        window.optimizely[0][2].should.have.property('revenue', 50000);

        done();
    });
});
