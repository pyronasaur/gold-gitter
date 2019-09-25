var mysql = require("mysql");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "tviw6wn55xwxejwj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "uampfunil9okfned",

  // Your password
  password: "bu46edqg8m8c5sbs",
  database: "teamproject2"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  readfunction();
});

function readfunction() {
  connection.query("SELECT * FROM project-2", function(err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
}
