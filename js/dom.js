// 'use strict';

function update_display(geoloc) {
  //Function called by watchPosition for each ping.
  document.getElementById('speed').innerHTML = geoloc.speed;
  document.getElementById('distance').innerHTML = geoloc.distance;
  document.getElementById('altitude').innerHTML = geoloc.altitude;
  document.getElementById('accuracy').innerHTML = geoloc.accuracy;
}



function warn_accuracy_not_ok(accuracy) {
  //If accuray is not good it alerts user by a warning
  document.getElementById('distance').innerHTML = 'Acquisition GPS en cours...';
  document.getElementById('accuracy').innerHTML = accuracy;
}

function add_option_to_list(id, objet, callback) {
  //add option to a list defined by the id
  var formObj = document.getElementById(id);
  var elOptNew = document.createElement('option');
  elOptNew.text = objet.name;
  elOptNew.value = objet.key;
  formObj.add(elOptNew, null);
  callback;
}

var formatter = function(value,type) {
  //Function for the formating of datas

  if (type == 'date') {
    var date = new Date(value);
    return date.getDate() + '/'+ (date.getMonth() + 1) + '/'+ date.getFullYear();
  } else if (type == 'hour') {
    var date = new Date(value);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    return hours + ':'+ minutes + ':'+ seconds + '';
  } else if (type = 'hms') {
    //secondes
    var s = Math.floor(value / 1000) % 60;
    //minutes
    var m = Math.floor(value / 60000) % 60;
    //affichage
    return m + ':'+ s;
  }
};

function reset_parcours_list() {
  //Re-init the list of courses
  document.getElementById('table_parcours').innerHTML = '';
  update_parcours_list();
}

function fill_parcours_tag(name) {
  //Fill the tag's name in the course's list
  document.getElementById('parcours_details_tag').innerHTML = name;
}

function fill_parcours_profil(name) {
  //Fill the profile's name in the course's lis
  document.getElementById('parcours_details_profil').innerHTML = name;
}

function fill_parcours_detail(item,which, id_parcours) {
  //Fill datas of a course in the html array et formatte it.
  var assoc = new Object();
  assoc['parcours_name'] = [{id: 'parcours_details_name'}];
  assoc['parcours_startTime'] = [{id: 'parcours_details_start_time', type: 'hour'},{id: 'parcours_details_date', type: 'date'}];
  assoc['parcours_stopTime'] = [{id: 'parcours_details_finish_time', type: 'hour'}];
  assoc['parcours_profil'] = [{id: 'parcours_details_profil', func: 'get_profil_name(id)'}];
  assoc['parcours_tag'] = [{id: 'parcours_details_tag', func: 'get_tag_name(id)'}];
  assoc['parcours_duration'] = [{id: 'parcours_details_duration', type: 'hms'}];

  work_on_parcours(id_parcours);

  for (x in item) {
    if (assoc[''+ which + '_'+ x + '']) {
      for (z in assoc[''+ which + '_'+ x + '']) {
        if (document.getElementById(assoc[''+ which + '_'+ x + ''][z].id)) {
          var vari = item[x];
          if (assoc[''+ which + '_'+ x + ''][z].type) {
            vari = formatter(vari, assoc[''+ which + '_'+ x + ''][z].type);
          } else if (assoc[''+ which + '_'+ x + ''][z].func) {
            var id = vari;
            var fonc = eval(assoc[''+ which + '_'+ x + ''][z].func);
            vari = fonc;
          }
          document.getElementById(assoc[''+ which + '_'+ x + ''][z].id).innerHTML = vari;
        }
      }
    }
  }
  flyto('detail_parcours');
}

var flyto = function(id) {
 //FLyto function hide a id and display an other.
 document.getElementById(id).style.display = 'inline';
 document.getElementById(id_visible).style.display = 'none';
 id_visible = id;
};

function delete_option_from_list(id,key) {
  //Deletes an option from a html list
  var list = document.getElementById(id);
  list.remove(key);
}

function update_item(id,value,list,index) {
  //Update the value and text of an option identified by index in list identified by list
  var myselect = document.getElementById(list);
  console.log(index);
  myselect.options[index].text = value;
  myselect.options[index].value = id;
}

function log() {}

function refresh_list(name,id, objet) {
  //Not done
  var formObj = document.getElementById(id);
  for (var loop = 0; loop < formObj.mySelect.options.length; loop++) {
    formObj.mySelect.options[loop] = null; // remove the option
  }

  //On recrée
  var select_tags = document.getElementById(id);
}

function refresh_list_tags() {
  //Refresh list of tags
  reset_list();

  //On recrée
  get_all_tags();
}

function lister() {
  var menu_items = document.getElementsByClassName('item_paremeters_menu');
  for (var i = 0; i < menu_items.length; i++) {
    var li = menu_items[i];
    li.addEventListener('click', changeVisibility, false);
  }
}

