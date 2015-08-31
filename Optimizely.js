﻿(function (window) {
    var MessageType = {
        SessionStart: 1,
        SessionEnd: 2,
        PageView: 3,
        PageEvent: 4,
        CrashReport: 5,
        OptOut: 6
    },
    isInitialized = false,
    forwarderSettings,
    name = 'Optimizely';

    function processEvent(event) {
        if (isInitialized) {
            try {
                if (event.dt == MessageType.PageEvent) {
                    if (event.et == window.mParticle.EventType.Transaction && data.attrs && data.attrs.RevenueAmount) {
                        logTransaction(event);
                    }
                    else {
                        logEvent(event);
                    }
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
        window.optimizely = window.optimizely || [];
        if (data.attrs && data.attrs['$Amount']) {
            var revenue = parseFloat(data.attrs['$Amount']) || 0;
            revenue *= 100.0;
            window.optimizely.push(['trackEvent', data.n, { 'revenue': revenue }]);
        } else {
            window.optimizely.push(["trackEvent", data.n]);
        }
    }

    function logTransaction(data) {
        window.optimizely = window.optimizely || [];
        var revenue = parseFloat(data.attrs.RevenueAmount) || 0;
        revenue *= 100.0;
        window.optimizely.push(['trackEvent', data.attrs.ProductName, { 'revenue': revenue }]);
    }

    function setUserAttribute(key, value) {
        if (isInitialized) {
            window.optimizely = window.optimizely || [];
            window['optimizely'].push(['setDimensionValue', key, value]);
        } else {
            return 'Can\'t call setUserAttribute on forwarder ' + name + ', not initialized';
        }
    }

    function initForwarder(settings) {
        try {
            forwarderSettings = settings;
            function addOptimizely(u) {
                var head = document.getElementsByTagName('head')[0];
                s = document.createElement('script');
                s.type = 'text/javascript'; s.async = false; s.src = u;
                head.appendChild(s);
            }

            var protocol = forwarderSettings.useSecure == 'True' ? 'https:' : '';
            addOptimizely(
                protocol + '//cdn.optimizely.com/js/' + forwarderSettings.projectId + '.js'
                );

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