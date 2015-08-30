// Simple Firefox Extension to make it easier to Save Webpages or Check if they have been saved previously
// uses Archive.org's Wayback Machine, Archive.is and Webcite
// Based on my Chrome extension of the same name and purpose
// Cathal McNally
// 30.08.2015
// ver 1.0

// changelog
// ver 1.0 Initial version

var tabs = require("sdk/tabs");
var cm = require("sdk/context-menu");
var localStorage = require("sdk/simple-storage");
var self = require("sdk/self");
var simplePrefs = require("sdk/simple-prefs");

var archive_org = localStorage.storage.thearchiver_archiveorg;
var archive_is = localStorage.storage.thearchiver_archiveis;
var webcite = localStorage.storage.thearchiver_webcite;
var email = localStorage.storage.thearchiver_email;	
var firstRun = localStorage.storage.thearchiver_firstRun;

console.log("First thearchiver_archiveorg: " + localStorage.storage.thearchiver_archiveorg);
console.log("First thearchiver_archiveis: " + localStorage.storage.thearchiver_archiveis);
console.log("First thearchiver_webcite: " + localStorage.storage.thearchiver_webcite);
console.log("First thearchiver_email: " + localStorage.storage.thearchiver_email);
console.log("First thearchiver_firstRun: " + localStorage.storage.thearchiver_firstRun);
console.log(" ");

if(firstRun == undefined){
	// No need to check each, archive.org will do
	if (archive_org == undefined){
		archive_org = "true";
		archive_is = "true";
		webcite = "true";
		email = "Your E-Mail";
		
		// turn firstRun off
		firstRun = 0;
		
		// lets set the local Storage so the options Dialog is setup correctly on first run
		localStorage.storage.thearchiver_archiveorg = archive_org;
		localStorage.storage.thearchiver_archiveis = archive_is;
		localStorage.storage.thearchiver_webcite = webcite;
		localStorage.storage.thearchiver_email = email;
		localStorage.storage.thearchiver_firstRun = firstRun;
	}
}

simplePrefs.prefs_archiveorg = archive_org;
simplePrefs.prefs_archiveis = archive_is;
simplePrefs.prefs_webcite = webcite;
simplePrefs.prefs_email = email;

console.log("prefs_archiveorg: " + simplePrefs.prefs["prefs_archiveorg"]);
console.log("prefs_archiveis: " + simplePrefs.prefs["prefs_archiveis"]);
console.log("prefs_webcite: " + simplePrefs.prefs["prefs_webcite"]);
console.log("prefs_email: " + simplePrefs.prefs["prefs_email"]);
console.log(" ");

console.log("thearchiver_archiveorg: " + localStorage.storage.thearchiver_archiveorg);
console.log("thearchiver_archiveis: " + localStorage.storage.thearchiver_archiveis);
console.log("thearchiver_webcite: " + localStorage.storage.thearchiver_webcite);
console.log("thearchiver_email: " + localStorage.storage.thearchiver_email);
console.log("thearchiver_firstRun: " + localStorage.storage.thearchiver_firstRun);


var saveIt_context = cm.Item({
  label: "Save It!",
  data: "http://web.archive.org/save/"
});

var checkIt_context = cm.Item({
  label: "Check It!",
  data: "http://web.archive.org/web/"
});

var archiveIt = cm.Menu({
  label: "The Archiver",
  context: cm.PageContext(),
  image: self.data.url("images/theArchiver16.png"),
  contentScriptFile: "./test.js",
  onMessage: function(payload){
  	tabs.open(archive_org); 	
  },
  items: [saveIt_context, checkIt_context]
});

simplePrefs.on("",function(name){
	localStorage.storage.thearchiver_archiveorg = simplePrefs.prefs["prefs_archiveorg"];
	localStorage.storage.thearchiver_archiveis = simplePrefs.prefs["prefs_archiveis"];
	localStorage.storage.thearchiver_webcite = simplePrefs.prefs["prefs_webcite"];
	localStorage.storage.thearchiver_email = simplePrefs.prefs["prefs_email"];
});