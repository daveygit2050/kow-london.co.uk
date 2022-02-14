import './style.css';
import { Circle, Fill, Style } from 'ol/style';
import { Feature, Map, Overlay, View } from 'ol/index';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';

useGeographic();

const venues = {
  "-1.207636751927884, 52.998202635714286": {
    "name": "Clash of Kings Doubles"
  },
  "-0.7519496, 51.6314081": {
    "name": "Unbroken Oaths"
  },
  "-1.665849975, 53.81729505": {
    "name": "Leodis Bash 2022"
  },
  "-1.99111, 50.73811": {
    "name": "Entoyment - Slay Bells Ring"
  },
  "-2.7095, 53.77466": {
    "name": "Easter Beaster"
  },
  "-2.51603, 52.699": {
    "name": "Rift Wars 22: Spring"
  },
  "-3.9393794, 56.1240295": {
    "name": "King beyond the wall 7: The Wildlings GT"
  },
  "-0.28374, 51.66798": {
    "name": "Kings of Herts X at The Pit"
  },
  "-3.20003081426867, 51.47220274901428": {
    "name": "Clash of Kings Welsh Qualifier 2022"
  },
  "0.14987444167088593, 51.44186635": {
    "name": "Shroud of the Reaper - Clash of the Titans"
  },
  "-0.45878109791520494, 51.771704575": {
    "name": "Kings of Herts XII"
  },
  "-1.578262363011861, 53.67890943333333": {
    "name": "Northern Kings GT 2022"
  },
  "-1.37817, 52.53923": {
    "name": "Dawn of War The Finale"
  },
  "-1.1508377599211634, 52.957756919999994": {
    "name": "Swords of Summer - God's Descend"
  },
  "-1.24032, 52.78608": {
    "name": "Battle Masters 2022"
  },
  "-0.03420119273410058, 51.63167256666667": {
    "name": "Clash of Kings 22"
  },
  "-0.7621570470502979, 51.276581300000004": {
    "name": "Kings of Warfare"
  }
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
