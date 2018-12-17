var Spotify = require('node-spotify-api');
var spotifyKey = require("./key.js");
var spotify = new Spotify(spotifyKey.spotify);
var request = require("request");
var searchCommand = process.argv[2];
var search = "";
var appId = 'codingbootcamp'
var bandsintown = require('bandsintown')(appId);
var fs = require("fs");

determineSearch(searchCommand, search);

function determineSearch(searchCommand, search){

  search = getSearchData();

  switch (searchCommand) {
    case "movie-this":
      var movieName = search;
      
      if (movieName === "") {
        movieSearch("Mr. Nobody");
      } else {
        movieSearch(movieName);
      }
      break;
    
      case "spotify-this-song":
      var songName = search;
      spotifySearch(songName);
      break;
    
      case "concert-this":
      var bandSearch = search;
      concertSearch(bandSearch);
      break;
    
    case "do-what-it-says": 
      doWhatItSays();
      break;
    }
  }

  function getSearchData(){
    searchArray = process.argv;

    for (var i = 3; i < searchArray.length; i++){
      search += searchArray[i];
    }
    return search;
  }
  
  
  function movieSearch(movieName) {

    
  var movieQueryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  
  request(movieQueryUrl, function (error, response, body) {

    if (response.statusCode === 200 && !error) {
      console.log(JSON.parse(body));
      console.log("Title " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
    fs.appendFile("log.txt", "\n" + "Appending movie information: " + 
			"\n" + JSON.parse(body).Title + "\n" + JSON.parse(body).Year + 
			"\n" + JSON.parse(body).imdbRating + "\n" + JSON.parse(body).rottenExists +
			"\n" + JSON.parse(body).Country + "\n" + JSON.parse(body).Language +
			"\n" + JSON.parse(body).Plot + "\n" + JSON.parse(body).Actors, function(err) {
				if (err) {
					console.log(err);
				}
			})
  });
}


function spotifySearch(songName) {
  
 spotify.search({type: 'track', query: songName}, function(err, data){
    if (err){
      console.log(err);
      return;
    } 
    console.log(data.tracks.items[0].name);
    console.log(data.tracks.items[0].album.artists);
    console.log(data.tracks.items[0].album.name);
    console.log(data.tracks.items[0].preview_url);
    
  });
}
function concertSearch(bandSearch) {
  var bandQuery = "https://rest.bandsintown.com/artists/" + bandSearch + "/events?app_id=codingbootcamp";
  
  bandsintown.getArtistEventList(bandQuery)
  .then(function(bandSearch) {
    console.log(bandSearch);
  });
  
}
function doWhatItSays() {

	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			logOutput.error(err);
		} else {
      var randomArray = data.split(",");
      searchCommand = randomArray[0];
      search = randomArray[1];
      determineSearch(searchCommand, search);
		}
	});
}