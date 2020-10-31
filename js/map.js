mapboxgl.accessToken =
  "pk.eyJ1IjoiZ3V5Ym93ZGVucmlkZXMiLCJhIjoiY2tndzU3Z3l1MDZ2bDJyb2YwMWdraGJoYiJ9.7w_6DhfDgY-w8uONmlS-SQ";

const getGPXFile = (url) =>
  fetch(url)
    .then((response) => response.text())
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml"));

const getBounds = (coordinates, initialBounds) =>
  coordinates.reduce(function (bounds, coord) {
    return bounds.extend(coord);
  }, initialBounds);

let bounds;

function addGeoJSON(geoJSON, idx, padding) {
  map.addSource("line" + idx, {
    type: "geojson",
    data: geoJSON,
  });
  map.addLayer({
    id: "line" + idx,
    type: "line",
    source: "line" + idx,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#000",
      "line-width": 2,
    },
  });
  let coordinates = geoJSON.features[0].geometry.coordinates;

  if (!bounds) {
    bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);
  }

  bounds = getBounds(coordinates, bounds);
  map.fitBounds(bounds, { padding: padding });
}

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/guybowdenrides/ckgxg0a163k5q19qjwv842vcc", // stylesheet location
  center: [6.7089, 46.1792],
  zoom: 10,
});

function initMap(baseURL, gpxURLs, padding) {
  map.on("load", function () {
    gpxURLs.map((url, idx) =>
      getGPXFile(baseURL + url)
        .then((xml) => toGeoJSON.gpx(xml))
        .then((geoJSON) => addGeoJSON(geoJSON, idx, padding))
    );
  });
}

function init() {
  const URLParams = new URLSearchParams(window.location.search);

  const padding = parseInt(URLParams.get("padding") || "50", 10);
  const controls = URLParams.get("controls") || "";
  const gpxURLs = URLParams.get("gpx").split(",");
  const baseURL = URLParams.get("baseURL") || "";
  initMap(baseURL, gpxURLs, padding);

  if (controls.indexOf("fullscreen") > -1) {
    map.addControl(new mapboxgl.FullscreenControl());
  }
  if (controls.indexOf("nav") > -1) {
    map.addControl(new mapboxgl.NavigationControl());
  }
}

init();
