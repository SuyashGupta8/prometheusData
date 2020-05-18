const req = require('./request');
req.setUrl('stats-days');
req.startProcessing(60*60*1000);