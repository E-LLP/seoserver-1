var express = require(__dirname + '/node_modules/seoserver/node_modules/express');
var app = express();
var arguments = process.argv.splice(2);
var port = arguments[0] !== 'undefined' ? arguments[0] : 3000;
var getContent = function(url, callback) {
  var content = '';
  var phantom = require('child_process').spawn('phantomjs', [__dirname + '/node_modules/seoserver/lib/phantom-server.js', url]);
  phantom.stdout.setEncoding('utf8');
  phantom.stdout.on('data', function(data) {
    content += data.toString();
  });
  phantom.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});
  phantom.on('exit', function(code) {
    if (code !== 0) {
      console.log('We have an error');
    } else {
      callback(content);
    }
  });
};

var respond = function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var url = req.url;
  var originalUrl = 'http://' + req.host + url;
  console.log('url:', originalUrl);
  getContent(originalUrl, function (content) {
    res.send(content);
  });
}

app.get(/(.*)/, respond);
app.listen(port);
