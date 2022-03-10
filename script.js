// Making a map and tiles
const mymap = L.map("issMap").setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

// Making a marker with a custom icon
const issIcon = L.icon({
  iconUrl: "isspic.png",
  iconSize: [90, 72],
  iconAnchor: [25, 16],
});
const marker = L.marker([0, 0], { icon: issIcon }).addTo(mymap);

const apiUrl = "https://api.wheretheiss.at/v1/satellites/25544";
let firstTime = true;
async function getISS() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  const { latitude, longitude } = data;
  const { velocity } = data;
  const mph = velocity * 1.609344;

  // Disabling auto zoom after interval
  if (firstTime) {
    mymap.setView([latitude, longitude], 3);
    firstTime = false;
  }

  // Always set the view to current lat lon and zoom
  mymap.setView([latitude, longitude], mymap.getZoom());
  marker.setLatLng([latitude, longitude]);

  document.querySelector("#lat").textContent = latitude.toFixed(6);
  document.querySelector("#lon").textContent = longitude.toFixed(6);
  document.querySelector("#velocity").textContent = mph.toFixed(2) + " MPH";
}

getISS();

setInterval(getISS, 1000);
