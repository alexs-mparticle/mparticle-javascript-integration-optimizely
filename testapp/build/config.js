(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var optimizelyEvents = require('./optimizely-defined-events');

var initialization = {
    name: 'Optimizely',
    initForwarder: function(settings, testMode, userAttributes, userIdentities, processEvent, eventQueue, isInitialized) {
        if (!testMode) {
            if (!window.optimizely) {
                var optimizelyScript = document.createElement('script');
                optimizelyScript.type = 'text/javascript';
                optimizelyScript.async = true;
                optimizelyScript.src = 'https://cdn.optimizely.com/js/' + settings.projectId + '.js';
                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(optimizelyScript);
                optimizelyScript.onload = function() {
                    isInitialized = true;

                    loadEventsAndPages();

                    if (window['optimizely'] && eventQueue.length > 0) {
                        for (var i = 0; i < eventQueue.length; i++) {
                            processEvent(eventQueue[i]);
                        }
                        eventQueue = [];
                    }
                };
            } else {
                isInitialized = true;
                loadEventsAndPages();
            }
        } else {
            isInitialized = true;
            loadEventsAndPages();
        }
    }
};

function loadEventsAndPages() {
    var data,
        events = {},
        pages = {};

    if (window.optimizely) {
        data = window.optimizely.get('data');

        for (var event in data.events) {
            events[data.events[event].apiName] = 1;
        }

        for (var page in data.pages) {
            pages[data.pages[page].apiName] = 1;
        }

        optimizelyEvents.events = events;
        optimizelyEvents.pages = pages;
    }
}

module.exports = initialization;

},{"./optimizely-defined-events":2}],2:[function(require,module,exports){
module.exports = {
    pages: {},
    events: {}
};

},{}],3:[function(require,module,exports){
/* fill in SDKsettings with any particular settings or options your sdk requires in order to
initialize, this may be apiKey, projectId, primaryCustomerType, etc. These are passed
into the integration-builder/initialization.js file as the
*/

var SDKsettings = {
    // apiKey: 'testAPIKey',
    projectId: '11368870075'
};

// Do not edit below:
module.exports = SDKsettings;

},{}],4:[function(require,module,exports){
var SDKSettings = require('../test/settings.js');
var name = require('../integration-builder/initialization.js').name;

//var SDKSettings = require('../../../../test/settings.js');
//var name = require('../../../../integration-builder/initialization.js').name;

var config = {
    name: name,
    moduleId: 100, // when published, you will receive a new moduleID
    isDebug: true,
    isSandbox: true,
    settings: SDKSettings,
    userIdentityFilters: [],
    hasDebugString: [],
    isVisible: [],
    eventNameFilters: [],
    eventTypeFilters: [],
    attributeFilters: [],
    screenNameFilters: [],
    pageViewAttributeFilters: [],
    userAttributeFilters: [],
    filteringEventAttributeValue: 'null',
    filteringUserAttributeValue: 'null',
    eventSubscriptionId: 123,
    filteringConsentRuleValues: 'null',
    excludeAnonymousUser: false
};

mParticle.configureForwarder(config);

},{"../integration-builder/initialization.js":1,"../test/settings.js":3}]},{},[4]);
