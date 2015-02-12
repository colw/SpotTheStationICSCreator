# SpotTheStation ICS Creator
Converts a [SpotTheStation RSS Reader](http://github.com/colw/spotthestation-rss-reader) Javascript object into a valid ics file.

## Example
```Javascript
var request = require("request");
var IssReader = require('spotthestation-rss-reader');
var IcsCreator = require('spotthestation-ics-creator');

var issReader = new IssReader();
var icsCreator = new IcsCreator();

var RSSURI = 'http://spotthestation.nasa.gov/sightings/indexrss.cfm?'
		       + 'country=Germany&region=None&city=Berlin';

request(RSSURI, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        issReader.parseRSS(body, function(err, jsonData) {
          if (err) throw err;            
        	icsCreator.createICS(jsonData, function(err, icsData) {
        	  if (err) throw err;
            console.log(icsData);
        	});
        })
    }
});
```

## Todo
 - Improve line feed handling in ICS output.
 - Improve error handling.
