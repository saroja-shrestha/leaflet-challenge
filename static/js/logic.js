
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place,time and magnitude of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}
    </p><hr><p>"magnitude:"${feature.properties.mag}</p>`);
  }

  //Function to show earthquake depth based on magnitude.
  function createCircleMarker(feature,latlng){
    let options = {
        radius:feature.properties.mag*5,
        fillColor: chooseColor(feature.properties.mag),
        color: chooseColor(feature.properties.mag),
        weight: 1,
        opacity: .7,
        fillOpacity: 0.35
    }
    return L.circleMarker(latlng, options)}

  //GeoJSON layer that contains the features array on the earthquakeData object.
  //Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });

  //Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}
//For the colors
function chooseColor(mag){
    
        if(1.0 <= mag && mag <= 2.5){return "#44ce1b";}
            else if (2.5 <= mag && mag <=4.0){return "#bbdb44";}
            else if (4.0 <= mag && mag <=5.5){ return "#BCBC00";}
            else if (5.5 <= mag && mag <= 7.0){return"#f7e379";}
            else if (7.0 <= mag && mag <=8.5){return"#f2a134";}
            else if (8.5 <= mag && mag <=20.0){return"#e51f1f";}
            else {return "#e51f1f" ;}
    }

let legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend');
    let grades = [1.0, 2.5, 4.0, 5.5, 7.0, 8.5];
    let labels = [];
    let legendInfo = "<h4>Magnitude</h4>";

    div.innerHTML = legendInfo

    //Go through each magnitude item to label and color the legend
    //Push to labels array as list item
    for (let i = 0; i < grades.length; i++) {
          labels.push('<ul style="background-color:' + chooseColor(grades[i] + 1) + 
          '"> <span>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '' : '+') + '</span></ul>');
        }

      //Add each label list item to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    
    return div;
  };

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  legend.addTo(myMap);

}