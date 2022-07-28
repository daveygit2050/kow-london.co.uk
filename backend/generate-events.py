import json
import requests
import tenacity

from bs4 import BeautifulSoup
from geopy.geocoders import Nominatim
from urllib.parse import parse_qs
from urllib.parse import urlparse

class Event:
    def __init__(self, name, url):
        self.name = name
        self.url = url

    def get_json(self):
        return {
            "name": self.name,
            "url": self.url,
        }

@tenacity.retry(retry=tenacity.retry_if_exception_type(IOError), wait=tenacity.wait_fixed(2))
def get_grid_ref_for_postcode(nominatim, postcode):
    location = nominatim.geocode(f"{postcode}, United Kingdom")
    return f"{location.longitude}, {location.latitude}"

def main():
    kow_masters_url = "https://www.kowmasters.com"
    kow_masters_events_response = requests.get(f"{kow_masters_url}/index.php?p=events")
    kow_masters_events_soup = BeautifulSoup(kow_masters_events_response.text, 'html.parser')
    kow_masters_event_urls = [link.get('href') for link in kow_masters_events_soup.find_all('a') if "p=event&i=" in link.get('href')]
    venues = {}
    nominatim = Nominatim(user_agent="kow-london-backend")
    for kow_masters_event_url in kow_masters_event_urls:
        full_event_url = f"{kow_masters_url}/{kow_masters_event_url}"
        event_response = requests.get(full_event_url)
        kow_masters_event_soup = BeautifulSoup(event_response.text, 'html.parser')
        event_name = kow_masters_event_soup.find("h1").text.strip()
        iframe = kow_masters_event_soup.find(id="mapcanvas")
        try:
            parsed_url = urlparse(iframe.attrs["src"])
        except AttributeError:
            print(f"No map found for event {full_event_url}")
            continue
        postcode = parse_qs(parsed_url.query)["q"][0].strip()
        event_grid_ref = get_grid_ref_for_postcode(nominatim, postcode)
        event = Event(name=event_name, url=full_event_url)
        try:
            venues[event_grid_ref]["events"].append(event.get_json())
        except KeyError:
            venues[event_grid_ref] = {"events": [event.get_json()]}
    with open("../static/event-map/venues.json", "w") as outfile:
        outfile.write(json.dumps(venues, indent=2))

if __name__ == "__main__":
    main()
