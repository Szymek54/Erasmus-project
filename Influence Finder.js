<<<<<<< HEAD
var https = require('https');
/**
 * HOW TO Make an HTTP Call - GET
 */
// options for GET


var optionsget = {
  "method": "GET",
  "hostname": "api.twitter.com",
  "port": null,
  "path": "/1.1/followers/ids.json?screen_name=septicwolf818",
  "headers": {
  "authorization": "Bearer xxxxx",
}
};

console.info('Options prepared:');
console.info(optionsget);
console.info('Do the GET call');

// do the GET request
var reqGet = https.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
  console.log("headers: ", res.headers);
  console.log("headers: ", optionsget.headers);

    res.on('data', function(d) {
        console.info('GET result:\n');
        process.stdout.write(d);
        console.info('\n\nCall completed');
    });

});

reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});
=======
var https = require('https');
/**
 * HOW TO Make an HTTP Call - GET
 */
// options for GET


var optionsget = {
  "method": "GET",
  "hostname": "api.twitter.com",
  "port": null,
  "path": "/1.1/followers/ids.json?screen_name=septicwolf818",
  "headers": {
  "authorization": "Bearer xxxxx",
}
};

console.info('Options prepared:');
console.info(optionsget);
console.info('Do the GET call');

// do the GET request
var reqGet = https.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
  console.log("headers: ", res.headers);
  console.log("headers: ", optionsget.headers);

    res.on('data', function(d) {
        console.info('GET result:\n');
        process.stdout.write(d);
        console.info('\n\nCall completed');
    });

});

reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});
>>>>>>> 0fea01eb9690b4972fd5221ccdaac58446e2ef70
