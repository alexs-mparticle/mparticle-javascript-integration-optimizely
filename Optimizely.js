﻿(function (window) {
    var MessageType = {
        SessionStart: 1,
        SessionEnd: 2,
        PageView: 3,
        PageEvent: 4,
        CrashReport: 5,
        OptOut: 6,
        Commerce: 16
    },
    isInitialized = false,
    forwarderSettings,
    name = 'Optimizely',
    reportingService,
    id = null,
    isTesting = false;

    function reportEvent(event) {
        if (reportingService) {
            reportingService(id, event);
        }
    }

    function processEvent(event) {
        if (isInitialized) {
            try {
                if (event.EventDataType == MessageType.PageEvent) {
                    if (event.EventCategory == window.mParticle.EventType.Transaction &&
                        event.EventAttributes &&
                        event.EventAttributes.RevenueAmount) {

                        logTransaction(event);
                    }
                    else {
                        logEvent(event);
                    }

                    reportEvent(event);
                }
                else if(event.EventDataType == MessageType.Commerce &&
                    event.ProductAction &&
                    event.ProductAction.TotalAmount) {
                    logCommerce(event);
                    reportEvent(event);
                }

                return 'Successfully sent to ' + name;
            }
            catch (e) {
                return 'Failed to send to: ' + name + ' ' + e;
            }
        }

        return 'Can\'t send to forwarder ' + name + ', not initialized';
    }

    function logEvent(data) {
        var revenue;

        window.optimizely = window.optimizely || [];

        if (data.EventAttributes && data.EventAttributes['$Amount']) {
            revenue = parseFloat(data.EventAttributes['$Amount']) || 0;
            revenue *= 100.0;
            window.optimizely.push(['trackEvent', data.EventName, { 'revenue': revenue }]);
        }
        else {
            window.optimizely.push(["trackEvent", data.EventName]);
        }
    }

    function logCommerce(data) {
        window.optimizely.push(['trackEvent',
            data.ProductAction.TransactionId,
            {
                'revenue': data.ProductAction.TotalAmount * 100
            }]);
    }

    function logTransaction(data) {
        window.optimizely = window.optimizely || [];
        var revenue = parseFloat(data.EventAttributes.RevenueAmount) || 0;
        revenue *= 100.0;
        window.optimizely.push(['trackEvent', data.EventAttributes.ProductName, { 'revenue': revenue }]);
    }

    function setUserAttribute(key, value) {
        if (isInitialized) {
            window.optimizely = window.optimizely || [];
            window.optimizely.push(['setDimensionValue', key, value]);
        }
        else {
            return 'Can\'t call setUserAttribute on forwarder ' + name + ', not initialized';
        }
    }

    function initForwarder(settings, service, moduleId, testMode) {
        forwarderSettings = settings;
        reportingService = service;
        id = moduleId;
        isTesting = testMode;

        try {
            function addOptimizely(u) {
                var head = document.getElementsByTagName('head')[0];
                s = document.createElement('script');
                s.type = 'text/javascript'; s.async = false; s.src = u;
                head.appendChild(s);
            }

            var protocol = forwarderSettings.useSecure == 'True' ? 'https:' : '';

            if(isTesting !== true) {
                addOptimizely(protocol + '//cdn.optimizely.com/js/' + forwarderSettings.projectId + '.js');
            }

            isInitialized = true;

            setTimeout(function () {
                var data = window.optimizely.data;
                if (!data) return;

                var experiments = data.experiments;
                var map = data.state.variationNamesMap;
                var traits = {};

                for (var experimentId in map) {
                    if (map.hasOwnProperty(experimentId)) {
                        var experiment = experiments[experimentId].name;
                        window.mParticle.setUserAttribute('Optimizely Experiment: ' + experiment, map[experimentId]);
                    }
                }

            }, 5000);

            return 'Successfully initialized: ' + name;
        }
        catch (e) {
            return 'Failed to initialize: ' + name;
        }
    }

    if (!window || !window.mParticle || !window.mParticle.addForwarder) {
        return;
    }

    window.mParticle.addForwarder({
        name: name,
        init: initForwarder,
        process: processEvent,
        setUserAttribute: setUserAttribute
    });

})(window);
