const request = require('request'),
randomMac = require('random-mac'),
rn = require('random-number');


var numOfDev,yearRange ,batchSize; 
let url;

let buildPost = function(data, resp, err){
    console.log("data in post is---");
    console.log(data);
    request.post(`http://localhost:8089/${url}`, {
  json: data
}, (error, res, body) => {
  if (error) {
    err(error);
  }
  if(res){
    console.log(`statusCode: ${res.statusCode}`)
  }
  resp(body);
})
}

function getMac(devId){
    if(devId > 100000){
        return false;
    }
    devId = devId + 10000;
    let startId = "AA:BB:CC:D";
    let endId =  devId.toString();
    let partA = endId.slice(0,1);
    let partB = endId.slice(1,3);
    let partC = endId.slice(3,5);
    let macId = startId.concat(partA).concat(':').concat(partB).concat(":").concat(partC);
    return macId;
}

function getRn(min, max){
let start = min || 0;
let end = max || 100;
let rn = require('random-number');
let gen = rn.generator({
  min:  start,
  max:  end,
  integer: true
})
 return gen();
}

function startProcessing(interval){
  console.log("start processing");
    numOfDev =  parseInt(process.argv[2]) ,
    yearRange = parseInt(process.argv[3]),
    batchSize = parseInt(process.argv[4]);
    console.log(numOfDev, typeof(numOfDev) === 'number', yearRange, batchSize);
    if(typeof(numOfDev) === 'number'  &&  typeof(yearRange) === 'number' && typeof(batchSize) === 'number' ){
      let currTime = new Date().getTime();
      let startTime = currTime - 365*24*60*60*1000*yearRange;
      console.log(startTime, currTime, startTime-currTime);

      let buildData = function(){
        if(startTime>currTime){
          return;
        }
        callFuncAsync(buildBatch, startTime).then((res)=>{
          console.log("task finished with response::", res);
          startTime = startTime + interval;
          buildData();
        }).catch((err)=> {
          console.log("error while proccessing",err);
        }); 
      };
      buildData();
    }
}

function callFuncAsync(fun, data){
  let promise = new Promise((res, error) =>{
    if(fun && data){
      fun(data, (response)=>{
        console.log("--------------response---",response);
        res(response);
      },  (err)=>{
        error(err);
      });
    }else if(fun){
      console.log( fun);
      fun(res, error);
    }
  });
  return promise;
}


let buildBatch = function(ts, res, err){
  console.log("ts for tasak is::::", ts, new Date(ts));
  let index = 0;
  let getBatch = function(){
    let documents = [];
    for(let count = 0; count < batchSize; count++){
      index = index + 1;
      if(index < numOfDev){
        let doc = buildDevice(index, ts);
        documents.push(doc);
      }else{
        console.log("task finished:::::");
        res("finished");
        return documents;
      }
    }
    console.log("one batch of size::", batchSize, " completed");
    return documents;
  };

  let callPost = function(){
  console.log("ts for task in call post is::::", ts, new Date(ts));
   if(index<numOfDev){
    let documents =  getBatch();
    let data = {"stats_hours":documents};
    let docsReached = index;
    callFuncAsync(buildPost, data).then(res =>{
      console.log("documents reached::::", docsReached);
      console.log(res);
    }).catch(error => {
      console.error(err);
      //err(error);
    });
    setTimeout(()=>{
      callPost();
    }, 300)
   }
  };
  callPost();
}

function buildDevice(index, ts){
  console.log(index);
  let mac = getMac(index);
  let stats_hours = {};
  stats_hours.mac = mac;
  stats_hours.ts = ts;
  stats_hours.ul_frm_util = getRn();
  stats_hours.dl_rssi = getRn();
  stats_hours.dl_rssi_imbalance = getRn();
  stats_hours.dl_qi= getRn();
  stats_hours.dl_qi_avg_rate = getRn();
  stats_hours.ul_qi =getRn();
  stats_hours.ul_qi_avg_rate = getRn();
  stats_hours.dl_snrv = getRn();
  stats_hours.dl_snrh = getRn();
  stats_hours.ul_snrv = getRn();
  stats_hours.total_busy_min_sample = getRn();
  stats_hours.dev_drop_count_delta = getRn();
  stats_hours.dev_status = getRn();
  stats_hours.dev_ts = getRn();
  stats_hours.dev_down = getRn();
  stats_hours.dev_mgd = getRn(1,4000);
  stats_hours.dev_off = getRn();
  stats_hours.dev_dn_time = getRn();
  stats_hours.dev_up_time = getRn();
  stats_hours.dev_cpu =  getRn(1,5);
  stats_hours.ul_pkt_loss_per = getRn();
  stats_hours.dl_pkt_loss_per = getRn();
  stats_hours.ul_kbits_delta = getRn();
  stats_hours.ul_kbits_delta = getRn();
  stats_hours.dl_kbits_delta = getRn();
  stats_hours.ul_kbits_rate = getRn();
  stats_hours.dl_kbits_rate = getRn();
  return stats_hours; 
}

let setUrl = function(endPoint){
  url = endPoint;
}

exports.startProcessing = startProcessing;
exports.setUrl = setUrl;

