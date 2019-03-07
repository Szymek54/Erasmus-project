//Creating a web server that sends html with data imported from local database

var http = require('http');
var mysql = require('mysql');
var fs = require('fs');
require('dotenv').config();
var dB_data;  //Contains JSON data sent to html file

//send index.html and variable when requested
function onRequest(request, response){
  response.writeHead(200,{'Content-Type':'text/html'});
  fs.readFile('./index.html', null, function(error, data){
    if(error){
        response.writeHead(404);
        response.write('File not found!');
    } else{
      response.write("<script>var halo="+JSON.stringify(dB_data)+"</script>")
        response.write(data);
    }
    response.end();
  });
}

http.createServer(onRequest).listen(8080);

//retrive data from local databse
var con = mysql.createConnection({
  host: "localhost",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: 'twitter'
});

  con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM follower_list", function (err, result) {
    if (err) throw err;

    var inf_nr=0; //variable needed for pushing follower id's to accurate influencer
    dB_data=[{influencer_id: result[0].influencer_id, followers:[result[0].follower_id]}];

    console.log(result.length);

    //Making influencer_id to not repeat
    for(var i=1;i<result.length;i++){
      for(var j=0;j<dB_data.length;j++){
        if(dB_data[j].influencer_id==result[i].influencer_id){
          dB_data[inf_nr].followers.push(result[i].follower_id)
          break;
        }
        else if(j==dB_data.length-1){
          dB_data.push({influencer_id:result[i].influencer_id,followers:[result[i].follower_id]});
          inf_nr++;
          continue;
        }

      }

    }

    dB_data = JSON.stringify(dB_data);

  });

  con.end(function(err) {
    if (err) throw err;
  });

});
