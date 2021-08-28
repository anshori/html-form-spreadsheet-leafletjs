/* Initial Map */
var map = L.map('map').setView([-7.7905952,110.3756905], 13); //lat, long, zoom

/* Tile Basemap */
var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '<a href="https://script.google.com/macros/s/AKfycbx4P_IkP_X3Ama9MxwIGfLWI0pmEjsWl6Pf3hH1v0ROHmZcXBGyryTLu1-mmFXXUfE/exec" target="_blank">Data</a> | <a href="https://unsorry.net" target="_blank">unsorry@2021</a>'
});
basemap.addTo(map);

/* GeoJSON Point */
var pointobj = L.geoJson(null, {
  onEachFeature: function(feature, layer) {
    if (feature.properties) {
      var content = "<strong>" + feature.properties.namaobjek + "</strong><br>" +
        feature.properties.deskripsi + "<br>" +
        "<small>" + feature.properties.timestamp + "</small><hr>" +
        "<a href='#' class='btn btn-success btn-sm text-light disabled'>Edit</a> <a href='#' class='btn btn-danger btn-sm text-light disabled'>Delete</a>";
      layer.on({
        click: function(e) {
          pointobj.bindPopup(content);
        },
        mouseover: function(e) {
          pointobj.bindTooltip(feature.properties.namaobjek);
        }
      });
    }
  }
});
$.getJSON("https://script.google.com/macros/s/AKfycbwwXdkATJsVjt3cDwMjTY-4rp8UarT6LXIHOOZO5d8Q9mdK1AlEPw7m57guuzEsJm6l2A/exec", function(data) {
  pointobj.addData(data);
  map.addLayer(pointobj);
  map.fitBounds(pointobj.getBounds());
});