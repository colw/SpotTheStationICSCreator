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

var ICS_NEWLINE = '\r\n';

var ISS2ICS = function() {}

function toICalUTCDate(d) {
	return d.toISOString().replace(/[.:-]+/g, '').substr(0,15) + 'Z';
}

function createEvent(sighting) {
	var x = sighting; // For brevity

	var dstamp = toICalUTCDate(new Date());
	var dstart = toICalUTCDate(x.Start);
	var dend = toICalUTCDate(x.Finish);

	var dtmp = ['Approaches: %s\\n',' Departs: %s\\n',' Maximum: %s'].join(ICS_NEWLINE);
	var dstr = util.format(dtmp, x['Approach'], x['Departure'], x['MaxElevation']);

	// TODO Create better uid scheme
	// The first 'Title' character is used to avoid clashes of different sightings at the same time.
	return util.format(vEventTemplate, dstart+x.Title.charAt(0), dstamp, dstart, dend, x.Title, dstr);
}

function makeSightingEventsArray(sightings) {
	var events = []
	if (sightings !== undefined) {
		events = sightings.map(createEvent);
	}
	return events;
}

function sightingsToICS(data) {
	var events = makeSightingEventsArray(data.sightings);

	if (events.length === 0) {
		return null;
	} else {
		return util.format(vCalendarTemplate, events.join(ICS_NEWLINE));
	}
}

ISS2ICS.prototype.createICS = function(jsonData, callback) {
	var result = sightingsToICS(jsonData);
	if (result === null && callback) {
		return callback(new Error('Zero sightings'));
	}

	if (callback) {
		callback(null, result);
	}
}

module.exports = ISS2ICS;
