const req = require('./request');
req.setUrl('stats-hours');
req.startProcessing(5*60*1000);