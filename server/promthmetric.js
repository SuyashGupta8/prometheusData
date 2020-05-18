var Singleton = (function () {
    
    var promthData ;
    function createInstance() {
        var client = require('prom-client');
        var registry = new client.Registry();
        var obj = {};
        obj.client = client;
        obj.registry = registry;
        return obj;
    }
    return {
        getInstance: function () {
            if (!promthData) {
              promthData = createInstance();
              console.log("promth data instantiated iss::::::::", promthData);
            }
            return promthData;
        }
    };
  })();

let prometheusMetrics = function(){
    console.log("metrics called");
    return Singleton.getInstance();
}

exports.prometheusMetrics = prometheusMetrics;
