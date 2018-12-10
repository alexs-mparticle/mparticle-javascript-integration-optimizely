/*
The 'mParticleUser' is an object with methods get user Identities and set/get user attributes
Partners can determine what userIds are available to use in their SDK
Call mParticleUser.getUserIdentities() to return an object of userIdentities --> { userIdentities: {customerid: '1234', email: 'email@gmail.com'} }
For more identity types, see http://docs.mparticle.com/developers/sdk/javascript/identity#allowed-identity-types
Call mParticleUser.getMPID() to get mParticle ID
For any additional methods, see http://docs.mparticle.com/developers/sdk/javascript/apidocs/classes/mParticle.Identity.getCurrentUser().html
*/


/*
identityApiRequest has the schema:
{
  userIdentities: {
    customerid: '123',
    email: 'abc'
  }
}
For more userIdentity types, see http://docs.mparticle.com/developers/sdk/javascript/identity#allowed-identity-types
*/

var identityHandler = {
    onUserIdentified: function(mParticleUser) {
        var optimizelyEvent = {
            type: 'event',
            eventName: 'addToCart',
            tags: {}
        };
        window['optimizely'].push(optimizelyEvent);
    },
    onIdentifyCompleted: function(mParticleUser, identityApiRequest) {
        var optimizelyEvent = {
            type: 'event',
            eventName: 'addToCart',
            tags: {}
        };
        window['optimizely'].push(optimizelyEvent);
    },
    onLoginCompleted: function(mParticleUser, identityApiRequest) {
        var optimizelyEvent = {
            type: 'event',
            eventName: 'addToCart',
            tags: {}
        };
        window['optimizely'].push(optimizelyEvent);
    },
    onLogoutCompleted: function(mParticleUser, identityApiRequest) {
        var optimizelyEvent = {
            type: 'event',
            eventName: 'addToCart',
            tags: {}
        };
        window['optimizely'].push(optimizelyEvent);
    },
    onModifyCompleted: function(mParticleUser, identityApiRequest) {
        var optimizelyEvent = {
            type: 'event',
            eventName: 'addToCart',
            tags: {}
        };
        window['optimizely'].push(optimizelyEvent);
    },

/*  In previous versions of the mParticle web SDK, setting user identities on
    kits is only reachable via the onSetUserIdentity method below. We recommend
    filling out `onSetUserIdentity` for maximum compatibility.
*/
    onSetUserIdentity: function(forwarderSettings, id, type) {
        var optimizelyEvent = {
            type: 'event',
            eventName: 'addToCart',
            tags: {}
        };
        window['optimizely'].push(optimizelyEvent);
    }
};

module.exports = identityHandler;
