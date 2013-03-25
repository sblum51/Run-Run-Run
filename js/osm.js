var  map =null;
function init_osm(){
   map = new OpenLayers.Map("osm_map");
    map.addLayer(new OpenLayers.Layer.OSM());
    map.zoomToMaxExtent();

}

function center_map(lat, lon, level){
map.setCenter(new OpenLayers.LonLat(lon, lat), level);

}