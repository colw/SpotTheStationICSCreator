var fs = require('fs');
var util = require('util');

var vCalendarTemplate = "BEGIN:VCALENDAR\r\n" +
	"VERSION:2.0\r\n" +
	"PRODID:-//github.com/colw//SpotTheStationICSCreator//EN\r\n" +
	"%s\r\n" +
	"END:VCALENDAR";

var vEventTemplate = "BEGIN:VEVENT\r\n" +
	"UID:%s@spotthestation.nasa.gov\r\n" +
	"DTSTAMP:%s\r\n" +
	"DTSTART:%s\r\n" +
	"DTEND:%s\r\n" +
	"SUMMARY:%s\r\n" +
	"DESCRIPTION:%s\r\n" +
	"END:VEVENT";

var ISS2ICS = function() {}

function toICalUTCDate(d) {
	return d.toISOString().replace(/[.:-]+/g, '').substr(0,15) + 'Z';
}

function sightingsToICS(data) {
	var events = []
	data.sightings.forEach(function(x) {

		var dstamp = toICalUTCDate(new Date());
		var dstart = toICalUTCDate(x.Start);
		var dend = toICalUTCDate(x.Finish);

		var dtmp = 'Approaches: %s\\n\r\n Departs: %s\\n\r\n Maximum: %s';
		var dstr = util.format(dtmp, x['Approach'], x['Departure'], x['MaxElevation']);

		// TODO Create better uid scheme
		// The first 'Title' character is used to avoid clashes of different sightings at the same time.
		var ret = util.format(vEventTemplate, dstart+x.Title.charAt(0), dstamp, dstart, dend, x.Title, dstr);
		events.push(ret);
	});

	var finalCal = util.format(vCalendarTemplate, events.join('\r\n'));
	return finalCal;
}

ISS2ICS.prototype.createICS = function(jsonData, callback) {
	var result = sightingsToICS(jsonData);
	if (callback)
		callback(null, result)
}

module.exports = ISS2ICS;
