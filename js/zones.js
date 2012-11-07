var geoXml = null, map = null, geocoder = null, toggleState = 1, infowindow = null, marker = null;

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