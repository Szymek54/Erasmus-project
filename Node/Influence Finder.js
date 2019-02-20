var https = require('https');
var http = require('http');
var fs = require('fs');
var curs = "-1";
/**
 * HOW TO Make an HTTP Call - GET
 */

// http.createServer(function (req,resp){

// options for GET

// do the GET request
var gettingdata = setInterval(function () {

  var optionsget = {
    "method": "GET",
    "hostname": "api.twitter.com",
    "port": null,
    "path": "/1.1/followers/ids.json?cursor="+curs+"&screen_name=twitterdev&count=5000&stringify_ids=true",
    "headers": {
      "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAADXu9QAAAAAAQqsxQpd0yKovMuHmw3lmIITyyUg%3DRMxxnYwQYwF6BorZeP24mzj0F5wbBk2pcaW6WkhrpgXpCTjTwH",
    }
  };

  console.info('Options prepared:');
  console.info(optionsget);
  console.info('Do the GET call');

var reqGet = https.request(optionsget, function(res) {
  var str = "";
  console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
   console.log("headers: ", res.headers);
   console.log("headers: ", optionsget.headers);

    if(res.statusCode>=200 && res.statusCode<400){
      res.on('data', function(d) {
        console.info('GET result:\n');
        process.stdout.write(d);
        console.info('\n\nCall completed');
        str+=d;
    });
  }
    else {
      console.info("\n\n\nAn error occured");
    }
    res.on('end', function() {
      dataWrite(str);
      str = JSON.parse(str);
      toDatabase(str, res.headers['date'].toString());
      curs = str.next_cursor_str;
      console.log("Next curs------------"+curs);
      str = JSON.stringify(str);
    })
});
reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});
  if(curs=='0')
  clearInterval(gettingdata);
}, 5000);
function dataWrite(str){
  fs.writeFile('file.txt', str, function(err, data){
      if (err) console.log(err);
      console.log("Successfully Written to File.");

  });
}

function showJson(str){
  console.log(str);
  str = JSON.parse(str);
  for(var i=0;i<jsonObj.ids.length;i++){
    console.log(str.ids[i]);
  }
  str = JSON.stringify(str);
}

function toDatabase(str,date){
  var toWrite = "";
  toWrite+="\r\nDate: "+ date +"    Cursor: "+curs+"\r\n";
  for(var i=0;i<str.ids.length;i++){
    console.log(i+". id: "+str.ids[i]);
    toWrite +="id: "+str.ids[i]+"\r\n";
  }
  fs.appendFileSync('file1.txt', toWrite);
}
// }).listen(8080);
