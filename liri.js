//Require .env file
require("dotenv").config();

//Require request
let request = require("request");

//Require Moment
const moment = require('moment');

//Require files systems
const fs = require("fs");

//import the keys file and store it in a variable
var keys = require("./keys.js");

//initialize spotify
var Spotify = require('node-spotify-api');

//access to spotify api
var spotify = new Spotify(keys.spotify);

//access OMDB api
//let omdb = (keys.omdb);

//grab user command and input
let userInput = process.argv[2];
let userQuery = process.argv.slice(3).join(" ");

function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "concert-this":
        concertThis();
        break;

        case "spotify-this-song":
        spotifyThisSong();
        break;

        case "movie-this":
        movieThis();
        break;

        case "do-what-it-says":
        doThis();
        break;

        default:
        console.log("Please enter a value");
        break;
    }
}

userCommand(userInput, userQuery);

//function to utilize concert-this case
function concertThis() {
    console.log(`\n------------\n\nSEARCHING FOR..."${userQuery}"`);
    //Hit this api request and insert user query variable for parameter search
    request("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp",
    function (error, response, body){
        //if there is no error and response returns a 200 success
        if (!error && response.statusCode === 200) {
            //capture data and use json to parse data
            let userBand = JSON.parse(body);
            //use for loop to access data paths
            if (userBand.length > 0) {
                for (i = 0; i < 1; i++) {

                    //console selected data
                    console.log(`Here are your results... \n\nArtist: ${userBand[i].lineup[0]} \nVenue: ${userBand[i].venue.name} \nVenue Location: ${userBand[i].venue.latitude},${userBand[i].venue.longitude} \nVenue City: ${userBand[i].venue.city}, ${userBand[i].venue.country}`)
                    
                    //use moment to format date
                    let concertDate = moment(userBand[i].datetime).format("MM/DD/YYYY hh:00 A");
                    console.log(`Date and Time: ${concertDate}\n\n---------------`);
                };
            } else {
                //console if a concert is not found
                console.log('Concert not found!');
            };
        };
    });
};

//function to utilitize spotify-this-song case
function spotifyThisSong() {
    console.log(`\n------------\n\nSEARCHING FOR..."${userQuery}"`);

    //if query cannot be found pass "ACE OF BASE"
    if (!userQuery) {
        userQuery = "the sign ace of base"
    };

    //search query format
    spotify.search({
        type: 'track',
        query: userQuery,
        limit: 1
    }, function (error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
        //collect data in an array
        let spotifyArr = data.tracks.items;

        //use for loops to access data from array
        for(i=0; i < spotifyArr.length; i++) {
            console.log(`\nHere are the query results - \n\nArtist: ${data.tracks.items[i].album.artists[0].name} \nSong: ${data.tracks.items[i].name}\nAlbum: ${data.tracks.items[i].album.name}\nSpotify link: ${data.tracks.items[i].external_urls.spotify}\n\n------------`)
        };
    });
}

//function to utilize movie-this case
function movieThis() {
    console.log(`\n - - - - -\n\nSEARCHING FOR..."${userQuery}"`);
    if (!userQuery) {
        userQuery = "mr nobody";
    };
    // REQUEST USING OMDB API
    request("http://www.omdbapi.com/?t=" + userQuery + "&apikey=trilogy", function (error, response, body) {
        let userMovie = JSON.parse(body);

        // BECAUSE THE ROTTEN TOMATOES RATING WAS NESTED IT WAS NECESSARY TO CAPTURE ITS VALUES IN AN ARRAY TO CREATE A PATH
        let ratingsArr = userMovie.Ratings;
        if (ratingsArr.length > 2) {}

        if (!error && response.statusCode === 200) {
            console.log(`\nHere are your results... \n\nTitle: ${userMovie.Title}\nCast: ${userMovie.Actors}\nReleased: ${userMovie.Year}\nIMDb Rating: ${userMovie.imdbRating}\nRotten Tomatoes Rating: ${userMovie.Ratings[1].Value}\nCountry: ${userMovie.Country}\nLanguage: ${userMovie.Language}\nPlot: ${userMovie.Plot}\n\n------------`)
        } else {
            return console.log("Movie able to be found. Error:" + error)
        };
    });
};

function doThis() {
    // UTILIZE THE BUILT IN READFILE METHOD TO ACCESS RANDOM.TXT
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        // CATCH DATA AND USE THE .SPLIT() METHOD TO SEPARATE OBJECTS WITHIN OUR NEW ARRAY
        let dataArr = data.split(",");

        // TAKE OBJECTS FROM RANDOM.TXT TO PASS AS PARAMETERS
        userInput = dataArr[0];
        userQuery = dataArr[1];

        // CALL OUR FUNCTION WITH OUR NEW PARAMETERS...
        userCommand(userInput, userQuery);
    });
};