window.server = new MockHttpServer;
window.server.requests = [];
window.server.handle = function(request) {
    request.setResponseHeader('Content-Type', 'application/json');
    request.receive(200, JSON.stringify({
        Store: {},
        mpid: 'testMPID'
    }));
};

var mParticleKeys = ['startNewSession', 'endSession', 'init', 'logError', 'logEvent', 'logForm', 'logLink', 'logPageView', 'setOptOut'];
var mParticleIdentityKeys = ['identify', 'login', 'logout', 'modify'];
var mParticleEcommerceKeys = ['logCheckout', 'logImpression', 'logProductAction', 'logPromotion', 'logPurchase', 'logRefund'];
var mParticleEcommerceCartKeys = ['add', 'remove'];


mParticleKeys.forEach(function(key){
    replaceFunction(mParticle, key);
});

mParticleIdentityKeys.forEach(function(key){
    replaceFunction(mParticle.Identity, key);
});

mParticleEcommerceKeys.forEach(function(key){
    replaceFunction(mParticle.eCommerce, key);
});

mParticleEcommerceCartKeys.forEach(function(key){
    replaceFunction(mParticle.eCommerce.Cart, key);
});

mParticle.init('testAPIKey');

function replaceFunction(object, key) {
    if (typeof object[key] === 'function') {
        var originalMethod = object[key];
        object[key] = function() {
            startMockServer();
            originalMethod.apply(this, arguments);
        };
    }
}

function startMockServer() {
    server.start();
}
