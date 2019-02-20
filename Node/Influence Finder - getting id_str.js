//getting user objects and exporting user id_str

var https = require('https');
// var http = require('http');
var fs = require('fs');
var curs = "-1";

// http.createServer(function (req,resp){

//interval set to 30secs so 2 requests are made in 1 minute, this helps to avoid breaking rate limits
var gettingdata = setInterval(function () {

  // options for GET
  var optionsget = {
    "method": "GET",
    "hostname": "api.twitter.com",
    "port": null,
    "path": "/1.1/followers/list.json?cursor="+curs+"&screen_name=neilharbinger&skip_status=true&include_user_entities=false",
    "headers": {
      "authorization": "Bearer xxx",
    }
  };

  console.info('Options prepared:');
  console.info(optionsget);
  console.info('Do the GET call');

  // do the GET request
var reqGet = https.request(optionsget, function(res) {
  //str = JSON file got from twitter
   var str = "";
   console.log("statusCode: ", res.statusCode);
   console.log("headers: ", res.headers);
   console.log("headers: ", optionsget.headers);

   //if no errors occured continue
    if(res.statusCode>=200 && res.statusCode<400){
      res.on('data', function(d) {
        console.info('GET result:\n');
        // process.stdout.write(d);
        console.info('\n\nCall completed');
        str+=d;
      });
    }
    else {
      console.info("\n\n\nAn error occured");
    }

    // on response end write data, and move cursor to next place
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

  //if next cursor == 0 break out of interval
  if(curs=='0')
  clearInterval(gettingdata);
}, 30000);

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
  //setting date and current cursor
  toWrite+="\r\nDate: "+ date +"    Cursor: "+curs+"\r\n";
  for(var i=0;i<str.users.length;i++){
    console.log(i+". id: "+str.users[i].id+"\nid_str: "+str.users[i].id_str);
    toWrite +="id: "+str.users[i].id+"\r\nid_str: "+str.users[i].id_str+"\r\n";
  }
  fs.appendFileSync('file1.txt', toWrite);
}
// }).listen(8080);
