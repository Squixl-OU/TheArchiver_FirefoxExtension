self.on("click", function(node, data){
	var archiveURL = data + document.URL;
	self.postMessage(archiveURL);
});