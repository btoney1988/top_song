var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "greatBay_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {
  inquirer
    .prompt({
      name: "query",
      type: "list",
      message: "What query would you like to execute?",
      choices: ["Artist", "Multiple Top 5000", "Specific Range", "Song in Top 5000"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      switch (answer.query) {
        case "artist":
          getArtist();
          break;
        case "Multiple Top 5000":
          getMultipleTop();
          break;
        case "Specific Range":
          getSpecificRange();
          break;
        case "Song in Top 5000":
          getSong();
          break;
      }

    });
}
// function to handle posting new items up for auction
function getArtist() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "artist",
        type: "input",
        message: "What artist would you like to search?"
      }
    ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        `SELECT * FROM top_albums.artist = ?
        	INNER JOIN top5000 
		        ON top_albums.year = top5000.year
		        AND top_albums.artist = top5000.artist
	        WHERE top_albums.artist = ?
          ORDER BY top_albums.year DESC, top_albums.position, top_albums.artist, top_albums.song, top_albums.album`,
        function (err, result) {
          if (err) throw err;
          console.log(result);
          return result;
        }
      );
    });
}

// function to handle posting new items up for auction
function getMultipleTop() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "multiple",
        type: "input",
        message: "What artist would you like to search?"
      }
    ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "SELECT * FROM top_albums.artist = ?",
        function (err) {
          if (err) throw err;
          console.log("Success!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}