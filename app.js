/* Initial Map */
let tooltip = 'Drag the marker or move the map<br>to change the coordinates<br>of the location';
let center = [-7.801389645,110.364775452];
let map = L.map('map').setView(center, 15); //lat, long, zoom
map.scrollWheelZoom.disable(); //disable zoom with scroll

/* Tile Basemap */
let basemap = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3'],
  attribution: 'Google Satellite | <a href="https://unsorry.net" target="_blank">unsorry@2021</a>'
});
basemap.addTo(map);

/* Display zoom, latitude, longitude in URL */
let hash = new L.Hash(map);

/* Marker */
let marker = L.marker(center, {draggable: true});
marker.addTo(map);

/* Tooltip Marker */
marker.bindTooltip(tooltip);
marker.openTooltip();

//Dragend marker
marker.on('dragend', dragMarker);

//Move Map
map.addEventListener('moveend', mapMovement);

function dragMarker (e) {
  let latlng = e.target.getLatLng();

  //Displays coordinates on the form
  document.getElementById("latitude").value = latlng.lat.toFixed(5);
  document.getElementById("longitude").value = latlng.lng.toFixed(5);

  //Change the map center based on the marker location
  map.flyTo(new L.LatLng(latlng.lat.toFixed(9), latlng.lng.toFixed(5)));
}

function mapMovement (e) {
  let mapcenter = map.getCenter();

  //Displays coordinates on the form
  document.getElementById("latitude").value = mapcenter.lat.toFixed(5);
  document.getElementById("longitude").value = mapcenter.lng.toFixed(5);

  //Create marker
  marker.setLatLng([mapcenter.lat.toFixed(5), mapcenter.lng.toFixed(5)]).update();
  marker.on('dragend', dragMarker);
}

function mapCenter (e) {
  let mapcenter = map.getCenter();
  let x = document.getElementById("longitude").value;
  let y = document.getElementById("latitude").value;

  map.flyTo(new L.LatLng(y, x), 18);
}

// Submit to google spreadsheet
const scriptURL = 'https://script.google.com/macros/s/AKfycbwwXdkATJsVjt3cDwMjTY-4rp8UarT6LXIHOOZO5d8Q9mdK1AlEPw7m57guuzEsJm6l2A/exec';
const form = document.forms['submit-to-google-sheet'];
const btnSimpan = document.querySelector('.btn-simpan');
const btnLoading = document.querySelector('.btn-loading');
const myAlert = document.querySelector('.my-alert');

form.addEventListener('submit', e => {
  e.preventDefault();
  btnSimpan.classList.toggle('d-none');
  btnLoading.classList.toggle('d-none');
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
      console.log('Success!', response);
      btnSimpan.classList.toggle('d-none');
      btnLoading.classList.toggle('d-none');
      myAlert.classList.toggle('d-none');
      form.reset();
    })
    .catch(error => console.error('Error!', error.message));
})