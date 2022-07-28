import './style.css';
import { Circle, Fill, Style, Text, Stroke } from 'ol/style';
import { Feature, Map, Overlay, View } from 'ol/index';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';
import * as venues_json from './venues.json';

useGeographic();

var mapLayers = [new TileLayer({
  source: new OSM()
})];
var venues = venues_json.default

for (const [gridRef, details] of Object.entries(venues)) {
  const point = new Point(getGridRefArray(gridRef));
  mapLayers.push(new VectorLayer({
    source: new VectorSource({
      features: [new Feature(point)],
    }),
    style: new Style({
      image: new Circle({
        radius: 10,
        fill: new Fill({ color: [255, 248, 220] }),
        stroke: new Stroke(),
      }),
      text: new Text({
        font: "bold 12px sans-serif",
        fill: new Fill({ color: [0, 0, 0] }),
        offsetY: 1,
        text: `${details.events.length}`,
      }),
    }),
  }));
}

var map = new Map({
  target: 'map',
  layers: mapLayers,
  view: new View({
    center: [-1.21, 52.99766], // Mantic HQ
    zoom: 8
  })
});

const element = document.getElementById('popup');

const popup = new Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -10],
});
map.addOverlay(popup);

function formatVenue(gridRefArray) {
  const venue = venues[getGridRefString(gridRefArray)]
  var rows = []
  for (const [key, value] of Object.entries(venue.events)) {
    rows.push(`<p><a href="${value.url}" target="_blank">${value.name}</a></p>`)
  }
  return rows.join("")
}

function getGridRefArray(gridRefString) {
  const gridRefStringArray = gridRefString.split(", ");
  return [+(gridRefStringArray[0]), +(gridRefStringArray[1])];
}

function getGridRefString(gridRefArray) {
  return `${gridRefArray[0]}, ${gridRefArray[1]}`
}

var clicked_map_pixel;
var clicked_map_coordinate;

map.on('click', function (event) {
  clicked_map_pixel = event.pixel;
  clicked_map_coordinate = event.coordinate;
})

document.addEventListener("click", function (event) {
  if (event.target.nodeName.toLowerCase() != 'a') {
    $(element).popover('dispose');
    const feature = map.getFeaturesAtPixel(clicked_map_pixel)[0];
    if (feature) {
      $(element).popover('dispose');
      const coordinate = feature.getGeometry().getCoordinates();
      popup.setPosition([
        coordinate[0] + Math.round(clicked_map_coordinate[0] / 360) * 360,
        coordinate[1],
      ]);
      $(element).popover({
        container: element.parentElement,
        html: true,
        sanitize: false,
        content: formatVenue(coordinate),
        placement: 'top',
      });
      $(element).popover('show');
    }
  }
});

map.on('pointermove', function (event) {
  if (map.hasFeatureAtPixel(event.pixel)) {
    map.getViewport().style.cursor = 'pointer';
  } else {
    map.getViewport().style.cursor = 'inherit';
  }
});
