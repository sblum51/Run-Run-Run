// 'use strict';

var map = null;
var osm_layer;
var vector;

function init_osm() {
  map = new OpenLayers.Map('osm_map');
  map.addLayer(new OpenLayers.Layer.OSM());
  map.zoomToMaxExtent();
}

function center_map(lat, lon, level) {
  var LonLat = new OpenLayers.LonLat(lon, lat).transform(
    new OpenLayers.Projection('EPSG:4326'), // transform from WGS 1984
    map.getProjectionObject() // to Spherical Mercator Projection
  );
  map.setCenter(LonLat, level);

  console.log(typeof(lat) + ' '+ typeof(lon) + ' '+ typeof(level) + '');
  console.log('center '+ lon + ' '+ lat + '');
}

function draw_trace(tab) {
  if ((typeof(vector)) !== 'undefined') {
    vector.destroy();
  }
  var array_coord = new Array();

  for (var item in tab) {
    var LonLat = new OpenLayers.LonLat(parseFloat(tab[item].lon), parseFloat(tab[item].lat));
    var point = new OpenLayers.Geometry.Point(LonLat.lon, LonLat.lat);
    array_coord.push(point);
  }

  var style = {
    strokeColor: '#0000ff',
    strokeOpacity: 0.5,
    strokeWidth: 5
  };

  vector = new OpenLayers.Layer.Vector('vector');

  vector.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(array_coord).transform(
    new OpenLayers.Projection('EPSG:4326'),  // from
    new OpenLayers.Projection('EPSG:900913') // to
  ), null, style)]);
  map.addLayers([vector]);

  if(typeof(tab[1])!=="undefined"){
    center_map(parseFloat(tab[1].lat), parseFloat(tab[0].lon), 15);
  }

}

