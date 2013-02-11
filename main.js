var arDrone = require('ar-drone');
var client = arDrone.createClient();
var fs = require('fs');

client.config('general:navdata_demo', 'FALSE');

var pngStream = arDrone.createPngStream();

var lastPng;

pngStream.on('error', console.log)
	.on('data', function(pngBuffer) {
		lastPng = pngBuffer;
	});

client.disableEmergency();

client
  .after(3000, function() {
     this.takeoff();
  })
  .after(4000, function() {
  	  // write to file
  	  fs.writeFile('/Users/miku/Desktop/yay.png',lastPng, function(err) {
  	  	 if(err) throw err;
  	  	 console.log("image saved");
  	  });

  	  this.clockwise(1.0);
  })
  .after(4000, function() {

  	fs.writeFile('/Users/miku/Desktop/yay2.png',lastPng, function(err) {
  	  	 if(err) throw err;
  	  	 console.log("second image saved");
  	  });

    this.stop();
    this.land();
  });