var mysql = require("mysql");
if(process.env.JAWSDB_URL) {
  var connection = mysql.createConnection({

});
    
} else {
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Maxfac11103",
    database: "project2_DB"

  });
}

var PORT = process.env.PORT || 8000;

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  readfunction();
});

function readfunction() {
  connection.query("SELECT * FROM players", function(err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
}
