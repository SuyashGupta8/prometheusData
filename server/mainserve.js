const serve = require('./serve'),
 rn = require('random-number');

let  fixQueue = [];
const queueSize = 3;

serve.buildPost('/stats-hours', handleReq);
serve.buildPost('/stats-days', handleDaysReq);

//below function was designed for child process since registry parsing is not working while passing message to child process removed.
(function(){
  while(fixQueue.length < queueSize){
    const pd = require('./promdata');
    fixQueue.push(pd);
  }
})();

function handleReq(req){
  let resp;
  let rn = getRn();
  let pd = fixQueue[rn];
  pd.setMetricName('stats_hours');
  resp =  pd.buildData(req.body);
  console.log("message received is:::::::",  resp);
  return resp;
}


function handleDaysReq(req){
  let resp;
  let rn = getRn();
  let pd = fixQueue[rn];
  pd.setMetricName('stats_days');
  resp =  pd.buildData(req.body);
  console.log("message received is:::::::",  resp);
  return resp;
}

function getRn(min, max){
  let start = min || 0;
  let end = max || 2;
  let gen = rn.generator({
    min:  start,
    max:  end,
    integer: true
  })
   return gen();
  }
