//getting only stringified ids from twitter
var https = require('https');
var fs = require('fs');
var mysql = require('mysql');
const dotenv  = require('dotenv');
dotenv.config();
var curs = "-1";
var follower_nr = 0;
var screen_name = 'wykop';
var influencerID = 0;


  // options for GET
  var firstget = {
    "method": "GET",
    "hostname": "api.twitter.com",
    "port": null,
    "path": "/1.1/users/show.json?screen_name="+screen_name,
    "headers": {
      "authorization": "Bearer "+process.env.TWITTER_TOKEN,
    }
  };

  console.info('Options prepared:');
  console.info(firstget);
  console.info('Do the GET call');

var reqInf = https.request(firstget, function(res) {

    var infData = "";

   console.log("statusCode: ", res.statusCode);
   console.log("headers: ", res.headers);
   console.log("headers: ", firstget.headers);

    if(res.statusCode>=200 && res.statusCode<400){
      res.on('data', function(d) {
        console.info('GET result:\n');
        process.stdout.write(d);
        infData += d;
        console.info('\n\nCall completed');
    });
  }
    else {
      console.info("\n\n\nAn error occured");
    }

    res.on('end',function() {
      infData = JSON.parse(infData);
      influencerID = infData.id_str;
  })
});
reqInf.end();
reqInf.on('error', function(e) {
    console.error(e);
});
//interval set to 1 minute so 1 request is made in 1 minute, this helps to avoid breaking rate limits
var gettingdata = setInterval(function () {

  // options for GET
  var optionsget = {
    "method": "GET",
    "hostname": "api.twitter.com",
    "port": null,
    "path": "/1.1/followers/ids.json?cursor="+curs+"&screen_name="+screen_name+"&count=5000&stringify_ids=true",
    "headers": {
      "authorization": "Bearer "+process.env.TWITTER_TOKEN,
    }
  };

  console.info('Options prepared:');
  console.info(optionsget);
  console.info('Do the GET call');

  // do the GET request
var reqGet = https.request(optionsget, function(res) {

  if(curs!=0){
   //str = JSON file got from twitter
   var str = "";
   console.log("statusCode: ", res.statusCode);
   console.log("headers: ", res.headers);
   console.log("headers: ", optionsget.headers);

   //if no errors occured continue
    if(res.statusCode>=200 && res.statusCode<400){
      res.on('data', function(d) {
        //results for every get request
        console.info('GET result:\n');
        process.stdout.write(d);
        console.info('\n\nCall completed');
        str+=d;
      });
    }
    else {
      console.info("\n\n\nAn error occured");
    }

    // on response end write data, and move cursor to next place
    res.on('end', function() {
      str = JSON.parse(str);
      // toFile(str, res.headers['date'].toString());
      console.log(str);
      toDatabase(str);
      curs = str.next_cursor_str;
      // console.log("Next curs------------"+curs);
      str = JSON.stringify(str);
    })
  }
  else {
    console.log("NO MORE IDS TO SEARCH FOR");
  }
});

reqGet.end();

reqGet.on('error', function(e) {
    console.error(e);
});

  //if next cursor == 0 break out of interval
  if(curs=='0')
  clearInterval(gettingdata);
}, 60000);

function toDatabase(data){

var con = mysql.createConnection({
  host: "localhost",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS
});

con.connect(function(err) {
  console.log("Connected!" );
  con.query("CREATE DATABASE IF NOT EXISTS twitter");
  con.query("CREATE TABLE IF NOT EXISTS `twitter`.`follower_list` ( `influencer_id` BIGINT UNSIGNED NOT NULL , `follower_id` BIGINT UNSIGNED NOT NULL ) ENGINE = InnoDB");
  var sql = 'INSERT INTO twitter.follower_list (influencer_id, follower_id) VALUES (?,?)';
  for(var i=0; i<data.ids.length;i++){
  var values = [influencerID, data.ids[i]];
  con.query(sql, values, function (err, result) {
    //console.log("Number of records inserted: " + result.rowsAffected);
  });
}
});
  con.on('error', function(err) {
  console.log("[mysql error]",err);
});

}

function toFile(str,date){
  var toWrite = "";
  //setting date and current cursor
  toWrite+="\r\nDate: "+ date +"    Cursor: "+curs+"\r\n";
  for(var i=0;i<str.ids.length;i++){
    console.log(follower_nr+". id: "+str.ids[i]);
    follower_nr++;
    toWrite +="Follower number: "+follower_nr+"   id: "+str.ids[i]+"\r\n";
  }
  fs.appendFileSync('file1-stringify.txt', toWrite);
}
