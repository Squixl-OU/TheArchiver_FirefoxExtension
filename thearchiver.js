// Simple Firefox Extension to make it easier to Save Webpages or Check if they have been saved previously
// uses Archive.org's Wayback Machine, Archive.is and Webcite
// Based on my Chrome extension of the same name and purpose
// Cathal McNally
// 01.09.2015
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

var saveIt_context = cm.Item({
  label: "Save It!",
  data: "save"
});

var checkIt_context = cm.Item({
  label: "Check It!",
  data: "check"
});

var archiveIt = cm.Menu({
  label: "The Archiver",
  context: cm.PageContext(),
  image: self.data.url("images/theArchiver16.png"),
  contentScript: 'self.on("click", function(node, data){' +
  	'  var data_out = [data, document.URL];' +
  	'  self.postMessage(data_out);' +
  '});',
  onMessage: function(data){
  	var option = data[0];
  	var url_in = data[1];
  	//console.log("node: "+payload);
  	if(option=="save"){
	  	if (archive_org){
	  		tabs.open("http://web.archive.org/save/" + url_in);
	 	}
	 	if (archive_is){
	  		tabs.open("https://archive.is/?run=1&url=" + url_in);	
	 	}
	 	if (webcite){
	  		tabs.open("http://www.webcitation.org/archive?url=" + url_in + "&email=" + email); 	
	 	}
	}else if(option =="check"){
		if (archive_org){
	  		tabs.open("http://web.archive.org/web/" + url_in); 	
	 	}
	 	if (archive_is){
	  		tabs.open("http://archive.is/" + url_in); 	
	 	}
	 	if (webcite){
	  		tabs.open("http://www.webcitation.org/query?url=" + url_in); 	
	 	}
	}
  },
  items: [saveIt_context, checkIt_context]
});

simplePrefs.on("",function(name){
	localStorage.storage.thearchiver_archiveorg = simplePrefs.prefs["prefs_archiveorg"];
	localStorage.storage.thearchiver_archiveis = simplePrefs.prefs["prefs_archiveis"];
	localStorage.storage.thearchiver_webcite = simplePrefs.prefs["prefs_webcite"];
	localStorage.storage.thearchiver_email = simplePrefs.prefs["prefs_email"];

	archive_org = simplePrefs.prefs["prefs_archiveorg"];
    archive_is = simplePrefs.prefs["prefs_archiveis"];
    webcite = simplePrefs.prefs["prefs_webcite"];
    email = simplePrefs.prefs["prefs_email"];
});