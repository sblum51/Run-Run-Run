var alpha;
var final_angle=null;
var rotation;



function start_go_backhome() {}
function get_distance_m(lat1, lon1, lat2, lon2) {
  var earth_radius = 6378137; // Terre = sphère de 6378km de rayon
  var rlo1 = deg2rad(lon1);
  var rla1 = deg2rad(lat1);
  var rlo2 = deg2rad(lon2);
  var rla2 = deg2rad(lat2);
  var dlo = (rlo2 - rlo1) / 2;
  var dla = (rla2 - rla1) / 2;
  var a = (Math.sin(dla) * Math.sin(dla)) +
  Math.cos(rla1) * Math.cos(rla2) * (Math.sin(dlo) * Math.sin(dlo));
  var d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (earth_radius * d);

}
function deg2rad(value){
	return value*(180/Math.PI);
}
function toDeg(rad) {
  return rad * 180 / Math.PI;
}
var rotate = function (deg) {
  degre=deg;
  document.getElementById("group_arrow").setAttribute('transform','rotate('+deg+', 150, 65)');
};






function goto(from_lat, from_lon, to_lat, to_lon) {
  //Display the distance to the arrival point
  
  var lat1=from_lat;
  var lon1=from_lon;
  var lat2=to_lat;
  var lon2=to_lon;
  //var d = get_distance_m(lat1, lon1, lat2, lon2);
  var d=CalcDistanceBetween(lat1, lon1, lat2, lon2);
  if ((Math.sin(lon2-lon1)) < 0) {
  	var tc1 = Math.acos((Math.sin(lat2)-Math.sin(lat1)*Math.cos(d))/(Math.sin(d)*Math.cos(lat1))) 
  } else {
  	var tc1 = 2*Math.PI-Math.acos((Math.sin(lat2)-Math.sin(lat1)*Math.cos(d))/(Math.sin(d)*Math.cos(lat1))) ;
  }

  // console.log(tc1);
  var angle2 = Math.atan2(Math.sin(lon2-lon1)*Math.cos(lat2), Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1));
  final_angle=((toDeg(angle2))+360)%360;
  //rotate(final_angle);
  console.log("Rotation "+final_angle+" Distance "+d);
  document.getElementById('distance_gobackhome').innerHTML=d;
  document.getElementById('zone_angle').innerHTML=final_angle;
  if (window.DeviceOrientationEvent) {

  window.addEventListener("deviceorientation", 
                          function (e) { 
                          alpha=e.alpha;
                            if(final_angle!=="undefined"){
                              rotation=final_angle.toFixed(0)-alpha.toFixed(0);
                              rotate(rotation);
                            }
                           
                          }
                        ) 
}
  //Display the compass ton this direction
}

