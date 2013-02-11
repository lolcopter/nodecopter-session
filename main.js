var arDrone = require('ar-drone');
var client = arDrone.createClient();
var fs = require('fs');

client.config('general:navdata_demo', 'FALSE');

var pngStream = arDrone.createPngStream();

var inFlightMode = false;

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
  	  inFlightMode = true;
  	  // write to file
  	  fs.writeFile('yay.png',lastPng, function(err) {
  	  	 if(err) throw err;
  	  	 console.log("image saved");
  	  });

  	  //this.clockwise(1.0);
  })
  .after(20000, function() {
  	inFlightMode = false;

  	fs.writeFile('yay2.png',lastPng, function(err) {
  	  	 if(err) throw err;
  	  	 console.log("second image saved");
  	  });

    this.stop();
    this.land();
  });

var target = 0.8; // meter
var skip = 0.4;
client.on('navdata', function(navdata) {
	if(inFlightMode) {
		var altitude = navdata.demo.altitude;

		client.stop();

		if(altitude < target * 0.95) {
			console.log("up", altitude)
			client.up(0.1);
		} else if (altitude > target * 1.05) {
			console.log("down", altitude)
			client.down(0.1)
		} else {
			console.log("in range", altitude);
			target += skip;
			skip = -skip;
		}
	}
});