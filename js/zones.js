var geoXml = null, map = null, marker = null, shape = null, shadow = null, image = null, geocoder = null, toggleState = 1, infowindow = null, marker = null;

function createPoly(points, colour, width, opacity, fillcolour, fillopacity, bounds, name, description) {
GLog.write("createPoly("+colour+","+width+"<"+opacity+","+fillcolour+","+fillopacity+","+name+","+description+")");
   var poly = new GPolygon(points, colour, width, opacity, fillcolour, fillopacity);
   poly.Name = name;
   poly.Description = description;
   map.addOverlay(poly);
   exml.gpolygons.push(poly);

   return poly;
}
function initialize() {
  geocoder = new google.maps.Geocoder();
  infowindow = new google.maps.InfoWindow({size: new google.maps.Size(150,50) });
  // create the map
  var myOptions = {
    zoom: 12,
    center: new google.maps.LatLng(40.726837,-73.992962),
    mapTypeControl: true,
    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
    navigationControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	map.set('styles', [
	  {
	    featureType: 'road',
	    elementType: 'geometry',
	    stylers: [
	      { color: '#3f3f3f' },
	      { weight: 1.6 }
	    ]
	  }, {
	    featureType: 'water',
	    elementType: 'geometry',
	    stylers: [
	      { color: '#3f3f3f' }
	    ]
	  }, {
	    featureType: 'road',
	    elementType: 'labels',
	    stylers: [
	      { saturation: -100 },
	      { invert_lightness: true }
	    ]
	  }, {
	    featureType: 'landscape',
	    elementType: 'geometry',
	    stylers: [
	      { hue: '#ffff00' },
	      { gamma: 1.4 },
	      { saturation: 82 },
	      { lightness: 96 }
	    ]
	  }, {
	    featureType: 'poi.school',
	    elementType: 'geometry',
	    stylers: [
	      { hue: '#fff700' },
	      { lightness: -15 },
	      { saturation: 99 }
	    ]
	  }
	]);
	
	// ----------------------------------------------
	// SET CUSTOM MARKER IMAGE WITH CURRENT LOCATION
	// ----------------------------------------------
	
	//  http://powerhut.co.uk/googlemaps/custom_markers.php   ***** makes custom marker with shadow
	image = new google.maps.MarkerImage(
	  'marker-images/image.png',
	  new google.maps.Size(52,57),
	  new google.maps.Point(0,0),
	  new google.maps.Point(26,57)
	);

	shadow = new google.maps.MarkerImage(
	  'marker-images/shadow.png',
	  new google.maps.Size(84,57),
	  new google.maps.Point(0,0),
	  new google.maps.Point(26,57)
	);

	shape = {
	  coord: [28,0,29,1,30,2,31,3,31,4,32,5,32,6,32,7,32,8,31,9,31,10,30,11,29,12,28,13,27,14,27,15,27,16,27,17,27,18,31,19,36,20,41,21,45,22,46,23,46,24,47,25,47,26,47,27,47,28,46,29,46,30,47,31,47,32,48,33,50,34,50,35,50,36,50,37,50,38,51,39,51,40,51,41,51,42,51,43,51,44,50,45,47,46,46,47,42,48,41,49,41,50,40,51,38,52,26,53,30,54,26,55,25,56,25,56,24,55,24,54,24,53,24,52,24,51,24,50,24,49,24,48,24,47,24,46,17,45,10,44,9,43,8,42,8,41,5,40,3,39,0,38,0,37,0,36,0,35,0,34,0,33,0,32,0,31,0,30,1,29,1,28,1,27,1,26,1,25,1,24,1,23,1,22,1,21,1,20,1,19,4,18,6,17,8,16,10,15,23,14,22,13,20,12,20,11,19,10,19,9,18,8,18,7,18,6,18,5,19,4,19,3,20,2,21,1,22,0,28,0],
	  type: 'poly'
	};
	
	// set current location
	getLocation();
	
	
	// ----------------------------------------------
	// SET ZONE POLYGONS
	// ----------------------------------------------
	
  geoXml = new geoXML3.parser({map: map, singleInfoWindow: true, infoWindow: infowindow /*, createpolygon: createPoly */});
  geoXml.parse('coordinates/coordinates.xml');
}



function showAddress(address) {
  var contentString = address+"<br>Outside Area";
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
			var point = results[0].geometry.location;
      contentString += "<br>"+point;
      map.setCenter(point);
      if (marker && marker.setMap) { marker.setMap(null); }
      marker = new google.maps.Marker({
      	map: map, 
        position: point
      });
			
    	for (var i=0;i< geoXml.docs[0].gpolygons.length;i++) {
				console.log(i);
      	if (geoXml.docs[0].gpolygons[i].Contains(point)) {
        	contentString = address+"<br>"+geoXml.docs[0].placemarks[i].name;
  				// contentString += "<br>"+point+"<br>polygon#"+i;
        	i = 999; // Jump out of loop
      	}
    	}
			google.maps.event.addListener(marker, 'click', function() {
	      infowindow.setContent(contentString); 
	    	infowindow.open(map,marker);
	    });
			google.maps.event.trigger(marker,"click");
		} else {
    	alert("Geocode was not successful for the following reason: " + status);
  	}
	});
}

function getLocation(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else{
		alert("Geolocation is not supported by this browser.");
	}
}
function showPosition(position){
	new google.maps.Marker({
		draggable: false,
	  raiseOnDrag: false,
	  icon: image,
	  shadow: shadow,
	  shape: shape,
	  map: map,
		position:new google.maps.LatLng(position.coords.latitude,position.coords.longitude)
	});
	// window.location.href = 'http://maps.google.com/maps/api/geocode/xml?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=false';
}
function showError(error){
	switch(error.code) {
	  case error.PERMISSION_DENIED:
	    x.innerHTML="User denied the request for Geolocation."
	    break;
	  case error.POSITION_UNAVAILABLE:
	    x.innerHTML="Location information is unavailable."
	    break;
	  case error.TIMEOUT:
	    x.innerHTML="The request to get user location timed out."
	    break;
	  case error.UNKNOWN_ERROR:
	    x.innerHTML="An unknown error occurred."
	    break;
  }
}