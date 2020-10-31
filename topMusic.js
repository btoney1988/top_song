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
  database: "top_songsdb"
});

connection.connect(function (err) {
  if (err) throw err;

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

      switch (answer.query) {
        case "Artist":
          getArtist();
          break;
        case "Multiple Top 5000":
          getMultiple();
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
        `SELECT * 
         FROM top_songsdb.top_albums
         INNER JOIN top_songsdb.top5000 
		      ON top_songsdb.top_albums.year = top_songsdb.top5000.year
		      AND top_songsdb.top_albums.artist = top_songsdb.top5000.artist
	       WHERE top_songsdb.top_albums.artist = ?
         ORDER BY top_albums.year DESC, top_albums.position;`,
        [
          answer.artist
        ],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          start();
        }
      );
    });
}

function getSpecificRange() {
  inquirer
    .prompt([
      {
        name: "query",
        type: "list",
        message: "What query would you like to execute?",
        choices: ["top_albums", "top5000"]
      },
      {
        name: "firstParam",
        type: "input",
        message: "Please enter first parameter?"
      },
      {
        name: "secondParam",
        type: "input",
        message: "Please enter second parameter?"
      }
    ])
    .then(function (answer) {
      switch (answer.query) {
        case "top_albums":
          connection.query(

            `SELECT * 
         FROM top_albums
	       WHERE position BETWEEN ? AND ?
         ORDER BY top_albums.year DESC, top_albums.position;`,
            [
              answer.firstParam,
              answer.secondParam,
            ],
            function (err, res) {
              if (err) throw err;
              console.table(res);
              start();
            }
          );
          break;
        case "top5000":
          connection.query(

            `SELECT * 
         FROM top5000
	       WHERE position BETWEEN ? AND ?
         ORDER BY top5000.year DESC, top5000.position;`,
            [
              answer.firstParam,
              answer.secondParam,
            ],
            function (err, res) {
              if (err) throw err;
              console.table(res);
              start();
            }
          );
      }
    });
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
        `SELECT count(*) 
         FROM top_songsdb.top5000
         WHERE top_songsdb.top5000.song = ?
         ORDER BY top_songsdb.top5000.year DESC, top_songsdb.top5000.position;`,
        [
          answer.song
        ],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          start();
        }
      );
    });
}

function getMultiple() {

  connection.query(
    `SELECT artist, count(*) 
     FROM top5000 
     GROUP BY artist 
     HAVING count(*) > 1
     ORDER BY top5000.year DESC, top5000.position;`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}