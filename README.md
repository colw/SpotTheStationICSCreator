# SpotTheStationICSCreator
Converts a [SpotTheStationRSS](github.com/colw/SpotTheStationRSSParser) object into a valid ics file.

## Example
```Javascript
var fs = require('fs');
var request = require("request");
var IssParser = require('./spotthestationRSS.js');
var IcsCreator = require('./spotthestationICS.js');

var issParser = new IssParser();
var icsCreator = new IcsCreator();

var RSSURI = 'http://spotthestation.nasa.gov/sightings/indexrss.cfm?'
		   + 'country=Germany&region=None&city=Berlin';

request(RSSURI, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        issParser.parseRSS(body, function(jsonData) {
        	icsCreator.createICS(jsonData, console.log);
        })
    }
});
```
