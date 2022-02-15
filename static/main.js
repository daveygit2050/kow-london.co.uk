import './style.css';
import { Circle, Fill, Style, Text, Stroke } from 'ol/style';
import { Feature, Map, Overlay, View } from 'ol/index';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';

useGeographic();

const venues = {
  "-1.207636751927884, 52.998202635714286": {
    "events": [
      {
        "name": "Kids of War! - Kings of War Juniors"
      },
      {
        "name": "Clocks of War"
      },
      {
        "name": "GrotCon"
      },
      {
        "name": "Clash of Kings Doubles"
      }
    ]
  },
  "-0.7519496, 51.6314081": {
    "events": [
      {
        "name": "Throne of Ages 2022"
      },
      {
        "name": "The Southern Crown II"
      },
      {
        "name": "Unbroken Oaths"
      }
    ]
  },
  "-1.665849975, 53.81729505": {
    "events": [
      {
        "name": "Leodis Bash 2022"
      }
    ]
  },
  "-1.99111, 50.73811": {
    "events": [
      {
        "name": "Explode-a-Con: March to War"
      },
      {
        "name": "Entoyment - Easter Endurance"
      },
      {
        "name": "Warborne 2022"
      },
      {
        "name": "Entoyment - Slay Bells Ring"
      }
    ]
  },
  "-2.7095, 53.77466": {
    "events": [
      {
        "name": "Easter Beaster"
      }
    ]
  },
  "-2.51603, 52.699": {
    "events": [
      {
        "name": "Rift Wars 22: Spring"
      }
    ]
  },
  "-3.9393794, 56.1240295": {
    "events": [
      {
        "name": "King beyond the wall 7: The Wildlings GT"
      }
    ]
  },
  "-0.28374, 51.66798": {
    "events": [
      {
        "name": "Kings of Herts X at The Pit"
      }
    ]
  },
  "-3.20003081426867, 51.47220274901428": {
    "events": [
      {
        "name": "Clash of Kings Welsh Qualifier 2022"
      }
    ]
  },
  "0.14987444167088593, 51.44186635": {
    "events": [
      {
        "name": "Shroud of the Reaper - Aces & 8s.... Dead Man's Hand"
      },
      {
        "name": "Shroud of the Reaper - Clash of the Titans"
      }
    ]
  },
  "-0.45878109791520494, 51.771704575": {
    "events": [
      {
        "name": "Kings of Herts XI - CoK SE Qualifier"
      },
      {
        "name": "Kings of Herts XII"
      }
    ]
  },
  "-1.578262363011861, 53.67890943333333": {
    "events": [
      {
        "name": "Northern Kings GT 2022"
      }
    ]
  },
  "-1.37817, 52.53923": {
    "events": [
      {
        "name": "Dawn of War 2"
      },
      {
        "name": "Dawn of War 3"
      },
      {
        "name": "Dawn of War The Finale"
      }
    ]
  },
  "-1.1508377599211634, 52.957756919999994": {
    "events": [
      {
        "name": "Swords of Summer - God's Descend"
      }
    ]
  },
  "-1.24032, 52.78608": {
    "events": [
      {
        "name": "Battle Masters 2022"
      }
    ]
  },
  "-0.03420119273410058, 51.63167256666667": {
    "events": [
      {
        "name": "Speed Kings of War at LGT"
      },
      {
        "name": "Clash of Kings 22"
      }
    ]
  },
  "-0.7621570470502979, 51.276581300000004": {
    "events": [
      {
        "name": "Kings of Warfare"
      }
    ]
  }
}

var mapLayers = [new TileLayer({
  source: new OSM()
})];

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
    rows.push(`<p>${value.name}</p>`)
  }
  console.log(rows.join(""))
  return rows.join("")
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
