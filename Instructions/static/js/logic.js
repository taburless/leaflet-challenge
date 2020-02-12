url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url, function(response) {
    createFeatures(response.features);
})

function createMaps(earthquakeMapping) {
    var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
    });

    var sat = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    });

    var comic = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.comic",
    accessToken: API_KEY
    });

    var baseMaps = {
        Light: light,
        Satellite: sat,
        Comic: comic
    };

    var overlayMaps = {
        Cities: earthquakeMapping
    };
      
    // Create map object and set default layers
    var myMap = L.map("map", {
        center: [39.83, -98.58],
        zoom: 6,
        layers: [light, earthquakeMapping]
    });

    var legend = L.control( {
        position: 'bottomright'
    });

    function color(mag) {
        if (mag < 1) {
            return "#ccff33"
          }
          else if (mag < 2) {
            return "#ffff33"
          }
          else if (mag < 3) {
            return "#ffcc33"
          }
          else if (mag < 4) {
            return "#ff9933"
          }
          else if (mag < 5) {
            return "#ff6633"
          }
          else {
            return "#ff3333"
          }
        }

    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    legend.onAdd = function(){
        levels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+']
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<h3>Magnitude Legend</h3>'
        for (var i = 0; i <= 5; i++) {
          div.innerHTML += '<p><span style="font-size:20px; background-color:' + color(i) +
            ';">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + levels[i] + '</p>';
        }

    return div;
    }
    legend.addTo(myMap);
}

function createFeatures(earthquakeData) {
    function onFeature(feature, layer) {
        layer.bindPopup(feature.properties.place + "<hr><br>Magnitude: " + feature.properties.mag);
    }
    function size(mag) {
        return mag * 15000;
    }
    function color(mag) {
        if (mag < 1) {
            return "#ccff33"
          }
          else if (mag < 2) {
            return "#ffff33"
          }
          else if (mag < 3) {
            return "#ffcc33"
          }
          else if (mag < 4) {
            return "#ff9933"
          }
          else if (mag < 5) {
            return "#ff6633"
          }
          else {
            return "#ff3333"
          }
        }
    var earthquakeMapping = L.geoJSON(earthquakeData, {
        pointToLayer: function(earthquakeData, position) {
            return L.circle(position, {
            radius: size(earthquakeData.properties.mag),
            color: color(earthquakeData.properties.mag),
            fillOpacity: 1
            });
        },
        onEachFeature: onFeature
    });

    createMaps(earthquakeMapping);
}

