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
