const promthmetrics = require('./promthmetric');
var client = promthmetrics.prometheusMetrics().client,
registry = promthmetrics.prometheusMetrics().registry;

//collectDefaultMetrics = client.collectDefaultMetrics;
//console.log(collectDefaultMetrics({ timeout : 5000 }));

let counter, gauge, histogram, metric_name;

function buildCounter(registry, mac, ts, field){
    console.log("inside build counter");
    counter = new client.Counter({
        name: `${metric_name}_counter`,
        labelNames: ['mac','ts', 'field'],
        registers:[registry],
        help: 'metric_help'
     });
   counter.labels(mac, ts, field);
   counter.inc();
   return counter;
}

function buildGauage(registry, mac, ts, field, value){
  gauge = new client.Gauge({
    name: `${metric_name}_gauge`,
    help: 'metric_help',
    labelNames: ['mac', 'ts', 'field'],
    buckets: [0.1, 5, 15, 50, 100, 500],
    registers:[registry]
  });
  gauge.labels(mac, ts, field).set(value);
  return gauge;
}

function buildHistogram(registry, mac, ts, field, value){
    histogram = new client.Histogram({
    name: `${metric_name}_histogram`,
    labelNames: ['mac','ts', 'field'],
    help: 'metric_help',
    registers:[registry]
    });
    histogram.labels(mac, ts, field).observe(value);
  }

let buildPrometheusData = function(mac, ts, field, val){
    if(!counter){
      buildCounter(registry, ts, mac, field);
    }else{
      counter.labels(mac, ts, field).inc();
    }
    if(!gauge){
      buildGauage(registry, ts, mac, field, val);
    }else{
      gauge.labels(mac, ts, field).set(val);
    }
    if(!histogram){
        buildHistogram(registry, ts, mac, field, val);
      }else{
        histogram.labels(mac, ts, field).observe(val);
      }
  }; 
  

  let  buildData = function(data){
      console.log("data in buildData:::::", data);
    let mac, ts,  field, val;
    let startTime = new Date().getTime();
    for (let [key, value] of Object.entries(data)) {
      value.forEach(data => {
        for(let [key, value] of Object.entries(data)){
          mac = data.mac;
           ts = data.ts;
           if(key !== 'mac' && key !== 'ts'){
             field = key;
             val = value;
             buildPrometheusData(mac, ts, field, val);
           }
          }
      });
  }
  console.log("time taken to build prometheus data is :::", (new Date().getTime()-startTime)/1000)
   return "data built";
  }

  let setMetricName = function(metric){
      metric_name = metric;
  }

  exports.buildData = buildData;
  exports.setMetricName = setMetricName;