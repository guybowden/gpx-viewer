mapboxgl.accessToken =
  "pk.eyJ1IjoiZ3V5Ym93ZGVucmlkZXMiLCJhIjoiY2tndzU3Z3l1MDZ2bDJyb2YwMWdraGJoYiJ9.7w_6DhfDgY-w8uONmlS-SQ";

const getGPXFile = (url) =>
  fetch(url)
    .then((response) => response.text())
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml"));

const getBounds = (coordinates) =>
  coordinates.reduce(function (bounds, coord) {
    return bounds.extend(coord);
  }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

function initMap(geoJSON, padding) {
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/guybowdenrides/ckgxg0a163k5q19qjwv842vcc", // stylesheet location
    bounds: getBounds(geoJSON.features[0].geometry.coordinates),
    fitBoundsOptions: {
      padding: padding,
    },
  });
  map.on("load", function () {
    {
      map.addSource("LineString", {
        type: "geojson",
        data: geoJSON,
      });
      map.addLayer({
        id: "LineString",
        type: "line",
        source: "LineString",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#000",
          "line-width": 2,
        },
      });
    }
  });
}

function init() {
  const URLParams = new URLSearchParams(window.location.search);
  GPXURL = URLParams.get("gpx");
  padding = parseInt(URLParams.get("padding") || "50", 10);
  getGPXFile(GPXURL)
    .then((xml) => toGeoJSON.gpx(xml))
    .then((geoJSON) => initMap(geoJSON, padding));
}

init();
