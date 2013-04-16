var parcours_id = null;
var cpt = 0;
var watchId = null;
var watchIdFix = null;
var distance = 0;
var lati_origin; //Current latitude used for the gobackhome function and the distance and degree between curent location et start point
var longi_origin; //Current longitude used for the gobackhome function and the distance and degree between curent location et start point
var cpt_fix=0;
var sec_timer=0;
var duration_limit=10;
var compteur_update=0;
var start_gps = function(parcours) {
  cpt = 0;
  parcours_id = parcours;
  watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {enableHighAccuracy: true});
};

function successCallback(position) {

  if (cpt == 0) {
    var newobj = {};
    newobj.LatStartPoint = position.coords.latitude;
    newobj.LongStartPoint = position.coords.longitude;
    newobj.startTime = new Date().getTime();

    get_parcours_and_begin(parcours_id, newobj);
    //get_parcours(parcours_id,update_parcours(parcours_id,newobj));
  } else {
    if (cpt == 1) {
      old_lati = position.coords.latitude;
      old_longi = position.coords.longitude;
      lati_origin=position.coords.latitude;
      longi_origin=position.coords.longitude;
    } else {
      if (old_lati != null || old_longi != null) {
        distance = parseFloat(distance) + parseFloat(CalcDistanceBetween(old_lati, old_longi, position.coords.latitude, position.coords.longitude));
        old_lati = position.coords.latitude;
        old_longi = position.coords.longitude;
      }
    }
      
    var obj = {};
    obj.latitude = position.coords.latitude;
    obj.longitude = position.coords.longitude;
    obj.timestamp = position.timestamp;
    obj.altitude = position.coords.altitude;
    obj.accuracy = position.coords.accuracy;
    obj.altitudeAccuracy = position.coords.altitudeAccuracy;
    obj.heading = position.coords.heading;
    obj.speed = position.coords.speed;
    obj.parcours_id = parcours_id;
    obj.distance = distance.toFixed(3);
    update_display(obj);
    
    //Every 10 success we have to update IDB with the current (new) distance.
    //update_course(parcours_id,obj.distance);


    goto(obj.latitude,obj.longitude,lati_origin,longi_origin);
    add_record(obj);
    
  }
  cpt++;
}

function errorCallback(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("L'utilisateur n'a pas autorisé l'accès à sa position");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("L'emplacement de l'utilisateur n'a pas pu être déterminé");
      break;
    case error.TIMEOUT:
      console.log("Le service n'a pas répondu à temps");
      break;
  }
}

function timerGpsFixation(){
//Timer of 10sec before alert user.
  duration_limit--;
  if(duration_limit==0){
    if(confirm('La géolocation semble anormalement longue souhaitez-vous démarrer avec la précision actuelle ? ("annuler" pour la fixation des satellites')){
      navigator.geolocation.clearWatch(watchIdFix);
      switchButtonsFixToStart();      
    }else{
        duration_limit=10;
    }
  }
  setTimeout('timerGpsFixation()', 1000);
}

var fix_gps=function(){
  console.log("fixing");
  switchStatusFixButton(); 
  timerGpsFixation();
  watchIdFix = navigator.geolocation.watchPosition(successCallbackFixGPS, errorCallbackFixGPS, {enableHighAccuracy: true});

}

function successCallbackFixGPS(position){
  console.log("Précision "+position.coords.accuracy);
  
  if(cpt_fix!=0){
    if(position.coords.accuracy<40){
      switchButtonsFixToStart();
      navigator.geolocation.clearWatch(watchIdFix);
    }
  }
  cpt_fix++
}

function errorCallbackFixGPS(position){


  
}

function stopWatch(compte) {
  clearTimeout(compte);
  var newobj = {};
  newobj.StopTime = new Date().getTime();
  newobj.distance=distance ;
  get_parcours_and_finish(parcours_id, newobj);
  
  navigator.geolocation.clearWatch(watchId);
  reset_parcours_list();
  flyto('parcours_list');
}

