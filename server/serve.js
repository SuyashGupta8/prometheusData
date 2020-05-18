const express = require('express'),
promthmetrics = require('./promthmetric');
//var client = promthmetrics.prometheusMetrics().client,
var registry = promthmetrics.prometheusMetrics().registry,
bodyParser = require('body-parser');
// create new express app and save it as "app"
const app = express();
// server configuration
const PORT = 8089;
app.use(bodyParser.json());


//client.AggregatorRegistry.setRegistries(registers);
//app.use(bodyParser.urlencoded({ extended: true }));

let startDate = new Date();
app.get('/', (req, res) => {
  setTimeout((arg)=>{
    console.log("time out");
  },100)
  let endDate = new Date();
  histogram.observe((endDate-startDate)/1000)
  counter.inc(); // Inc with 1
  res.send('Hello World');
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', registry.contentType );
  res.end(registry.metrics());
});

function buildPost(url, cb){
    app.post(url, function (req, res) {
        let response = cb(req);
        res.send(response);
    });
}

function buildGet(url, cb){
    app.get(url, (req,res)=>{
      let response;
        if(cb){
          response = cb(req);
        }
        res.send(response);
    })
}



// make the server listen to requests
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});

exports.buildPost = buildPost;
exports.buildGet = buildGet;



