import './style.css';
import { Circle, Fill, Style } from 'ol/style';
import { Feature, Map, Overlay, View } from 'ol/index';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';

useGeographic();

const venues = {
  "-1.21, 52.99766": { "name": "Mantic HQ"},
  "-0.1704406, 51.325716": { "name": "Stane of Blood" }
};

var mapLayers = [new TileLayer({
  source: new OSM()
})];

for (const [gridRef, details] of Object.entries(venues)) {
  console.log("Adding venue at " + gridRef )
  const point = new Point(getGridRefArray(gridRef));
  mapLayers.push(new VectorLayer({
    source: new VectorSource({
      features: [new Feature(point)],
    }),
    style: new Style({
      image: new Circle({
        radius: 10,
        fill: new Fill({ color: 'red' }),
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
  return venues[getGridRefString(gridRefArray)].name;
}

function getGridRefArray(gridRefString) {
  const gridRefStringArray = gridRefString.split(", ");
  return [+(gridRefStringArray[0]), +(gridRefStringArray[1])];
}

function getGridRefString(gridRefArray) {
  return `${gridRefArray[0]}, ${gridRefArray[1]}`
}

// const info = document.getElementById('info');
// map.on('moveend', function () {
//   const view = map.getView();
//   const center = view.getCenter();
//   info.innerHTML = formatCoordinate(center);
// });

map.on('click', function (event) {
  $(element).popover('dispose');

  const feature = map.getFeaturesAtPixel(event.pixel)[0];
  if (feature) {
    const coordinate = feature.getGeometry().getCoordinates();
    popup.setPosition([
      coordinate[0] + Math.round(event.coordinate[0] / 360) * 360,
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
});

map.on('pointermove', function (event) {
  if (map.hasFeatureAtPixel(event.pixel)) {
    map.getViewport().style.cursor = 'pointer';
  } else {
    map.getViewport().style.cursor = 'inherit';
  }
});
