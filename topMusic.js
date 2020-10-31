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
  database: "top_songdb"
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

function getArtist() {
  inquirer
    .prompt([
      {
        name: "artist",
        type: "input",
        message: "What artist would you like to search?"
      }
    ])
    .then(function (answer) {
      connection.query(
        `SELECT * FROM top_songsdb.top_albums WHERE artist = ?
        	INNER JOIN top_albums 
		        ON top_songsdb.top_albums.year = top5000.year
		        AND top_songsdb.top_albums.artist = top5000.artist
	        WHERE top_songsdb.top_albums.artist = ?
          ORDER BY top_songsdb.top_albums.year DESC, top_songsdb.top_albums.position, top_songsdb.top_albums.artist, top_songsdb.top_albums.song, top_songsdb.top_albums.album`,
        function (err, res) {
          if (err) throw err;
          console.log(res);
          return res;
        }
      );
    });
}

function getMultipleTop() {
  connection.query(
    `SELECT count(*) FROM top_songsdb.top_albums WHERE
          INNER JOIN top5000 
		        ON top_songsdb.top_albums.year = top5000.year
		        AND top_songsdb.top_albums.artist = top5000.artist
	        WHERE top_songsdb.top_albums.artist = ?
          ORDER BY top_songsdb.top_albums.year DESC, top_songsdb.top_albums.position, top_songsdb.top_albums.artist, top_songsdb.top_albums.song, top_songsdb.top_albums.album`,
    function (err, res) {
      if (err) throw err;
      console.log(res);
      return res;
    }
  );
}

function getSong() {
  inquirer
    .prompt([
      {
        name: "song",
        type: "input",
        message: "What song would you like to search?"
      }
    ])
    .then(function (answer) {
      connection.query(
        `SELECT count(*) FROM top_songsdb.top_albums WHERE song = ?
        	INNER JOIN top5000 
		        ON top_songsdb.top_albums.year = top5000.year
		        AND top_songsdb.top_albums.artist = top5000.artist
	        WHERE top_songsdb.top_albums.song = ?
          ORDER BY top_songsdb.top_albums.year DESC, top_songsdb.top_albums.position, top_songsdb.top_albums.artist, top_songsdb.top_albums.song, top_songsdb.top_albums.album`,
        function (err, res) {
          if (err) throw err;
          console.log(res);
          return res;
        }
      );
    });
}