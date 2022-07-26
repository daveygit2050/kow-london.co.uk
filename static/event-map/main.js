import './style.css';
import { Circle, Fill, Style, Text, Stroke } from 'ol/style';
import { Feature, Map, Overlay, View } from 'ol/index';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';

useGeographic();

const venues = {
  "-1.2076367142857143, 52.99820261428572": {
    "events": [
      {
        "name": "Enter The Fray - 3"
      }
    ]
  },
  "-1.3188274, 52.0354758": {
    "events": [
      {
        "name": "The Pride of the Shire"
      }
    ]
  },
  "-4.15367, 50.37024": {
    "events": [
      {
        "name": "Plymouth Pirates 2"
      }
    ]
  },
  "-1.1507952214285715, 52.95775353571429": {
    "events": [
      {
        "name": "Swords of Summer - God's Descend"
      }
    ]
  },
  "-3.200030766666667, 51.47220271666667": {
    "events": [
      {
        "name": "Allies of inconvenience Kings of War Doubles 2022"
      },
      {
        "name": "Clash at Cardiff Kings of War Singles 2022"
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
  "0.1498744, 51.4418663": {
    "events": [
      {
        "name": "Shroud of the Reaper - Clash of the Titans"
      },
      {
        "name": "Shroud of the Reaper - Aces & 8s II"
      },
      {
        "name": "Shroud of the Reaper - Slay Bells Ring II"
      }
    ]
  },
  "-2.51603, 52.699": {
    "events": [
      {
        "name": "Rift Wars 22: Autumn"
      }
    ]
  },
  "-2.61087355, 51.41517815": {
    "events": [
      {
        "name": "The Mean Squeaks of Bristol"
      }
    ]
  },
  "-1.3781699, 52.53923": {
    "events": [
      {
        "name": "Dawn of War 3"
      },
      {
        "name": "Dawn of War The Finale"
      }
    ]
  },
  "-1.99111, 50.73811": {
    "events": [
      {
        "name": "Warborne 2022"
      },
      {
        "name": "Entoyment - Slay Bells Ring"
      }
    ]
  },
  "-0.03420116666666667, 51.631672566666666": {
    "events": [
      {
        "name": "Speed Kings of War at LGT"
      },
      {
        "name": "Clash of Kings 22"
      }
    ]
  },
  "-0.45878105, 51.77170455": {
    "events": [
      {
        "name": "Kings of Herts XII"
      }
    ]
  },
  "-2.93939, 54.8942": {
    "events": [
      {
        "name": "Vc Games Presents: Battles in the Undercroft"
      }
    ]
  },
  "-2.15192, 53.39552": {
    "events": [
      {
        "name": "Cold Up North @ The Ribble Rumble"
      }
    ]
  },
  "-2.7094999, 53.77466": {
    "events": [
      {
        "name": "Preston Pillage - The Marauders Return"
      }
    ]
  },
  "-1.9656434, 52.4605272": {
    "events": [
      {
        "name": "The Second Birmingham Bullrun: Bullfight!"
      }
    ]
  },
  "-0.762157, 51.2765813": {
    "events": [
      {
        "name": "Kings of Warfare"
      }
    ]
  },
  "-0.7519496, 51.6314081": {
    "events": [
      {
        "name": "Unbroken Oaths"
      },
      {
        "name": "Southern Crown III"
      }
    ]
  },
  "-0.7524593, 51.6306991": {
    "events": [
      {
        "name": "Throne of Ages 2023"
      },
      {
        "name": "Magic and Mayhem"
      },
      {
        "name": "Battle of Frost Peak"
      }
    ]
  },
  "-1.5782623333333334, 53.6789094": {
    "events": [
      {
        "name": "The Northern Kings GT 2023"
      },
      {
        "name": "The Winter War 2023"
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
