'use strict';

var runrunrun = {};
var sports = {};
var current_profil = 1; //A enlever
runrunrun.indexedDB = {};
var DBNAME = 'RunRunRun';
var DBVERSION = 1;
var STORENAME_CONF = 'conf';
var STORENAME_SPORTS = 'sports';
var STORENAME_TAGS = 'tags';
var STORENAME_PARCOURS = 'parcours';
var STORENAME_RECORDS = 'records';
var STORENAME_PROFILS = 'profils';
var current_parcours = null;
var startTime = null;
var db;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
var store_conf = null;
var store_sports = null;
var store_parcours = null;
var store_records = null;
var store_tags = null;
var store_profils = null;
var store_mapservice = null;
var object_store_conf;
var object_store_profils;
var object_store_tags;
var object_store_mapservice;
var object_store_sports;
var object_store_parcours;
var object_store_records;
var init_add_sport = false;
var type = 'readwrite';
var openreq;


// Function called by window.onload. It opened the DB and creates stores
runrunrun.indexedDB.open = function() {
  var request = indexedDB.open(DBNAME, DBVERSION);
  request.onupgradeneeded = function(e) {
    console.log("onupgrade");
    db = e.target.result;
    object_store_sports = db.createObjectStore(STORENAME_SPORTS, { keyPath: undefined, autoIncrement: true });
    object_store_parcours = db.createObjectStore(STORENAME_PARCOURS, { keyPath: undefined, autoIncrement: true});
    object_store_records = db.createObjectStore(STORENAME_RECORDS, {keyPath: undefined, autoIncrement: true});
    object_store_tags = db.createObjectStore(STORENAME_TAGS, {keyPath: undefined, autoIncrement: true});
    object_store_profils = db.createObjectStore(STORENAME_PROFILS, {keyPath: undefined, autoIncrement: true});

    init_add_sport = true; 
    object_store_records.createIndex('parcours_id', 'parcours_id', {unique: false });
    object_store_sports.createIndex('name', 'name', { unique: true });
  };
  request.onsuccess = function(e) {
    db = request.result;
 console.log("onupgrade");
    //Insertion of sports in IDB,if the stores are new
    if (init_add_sport) {add_sports();}

    //Display tags, sports, profiles and update of the list of courses
    get_all_tags();
    get_all_sports();
    show_list_profil();
    update_parcours_list();
  }
};

function show_list_profil() {
  // Function displays list of profiles in the HTML Select list

  var select_tags = document.getElementById('profil_edit_list');
  store_profils = db.transaction(STORENAME_PROFILS, type).objectStore(STORENAME_PROFILS);
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store_profils.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;

    if (result) {
      var elOptNew = document.createElement('option');
      elOptNew.text = result.value.name;
      elOptNew.value = result.key;
      select_tags.add(elOptNew, null);
      result.continue();
    }
  }
  cursorRequest.onerror = function(e) {}
}

var add_parcours_to_list = function(key,item, item2, tag) {
  // Function called for each in insertion of course in the HTML Table

  var table = document.getElementById('table_parcours');
  var tr = document.createElement('tr');
  var td1 = document.createElement('td');
  //var td2 = document.createElement('td');
  //var td3 = document.createElement('td');

  td1.appendChild(document.createTextNode(item.name));
  //td2.appendChild(document.createTextNode(item2.name));
  //td3.appendChild(document.createTextNode(tag));
  tr.appendChild(td1);
  //tr.appendChild(td2);
  //tr.appendChild(td3);
  table.appendChild(tr);

  //Add a listener, when someone clicks it opens the detail page of this course

  tr.addEventListener('click', function() {detail_parcours(key);}, false);
};

function detail_parcours(id) {
  // Function called for the detail page of a course. Arg is the ID of the course

  store_parcours = db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);
  var keyRange = IDBKeyRange.only(parseInt(id));
  log(keyRange);
  var cursorRequest = store_parcours.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if (!!result == false) { }else {
      //Datas are sent to an other function, It will fill the DOM.

      fill_parcours_detail(result.value, 'parcours', result.key);
    }
  }
  cursorRequest.onerror = function(e) {}
}

function update_parcours_list() {
  var KR = IDBKeyRange;
  store_parcours = db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);

  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store_parcours.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    var tag_val = '';

    if (result) {
      //So it's hard to understand... get_tag will get the tag of the course and send datas to another function, at the end the last function will fill the data of the course in DOM
      get_tag_info(result.key, result.value);
      result.continue();
    }
  }
  cursorRequest.onerror = function(e) {

  }
}




function fill_edit_profil_form(profil, index) {
  //Fill the form for profile edition
  document.getElementById('profil_name_edit').value = profil.value.name;
  document.getElementById('profil_weight_edit').value = profil.value.weight;
  document.getElementById('profil_id_edit').value = profil.key;
  document.getElementById('profil_index_edit').value = index;
  if (profil.value.sex == 'M') {
    document.getElementById('profil_sex_edit').selectedIndex = 0;
  } else {
    document.getElementById('profil_sex_edit').selectedIndex = 1;
  }
}

function fill_edit_tag_form(tag,index) {
  // Fill the form for tag edition
  console.log('Index '+ index);
  document.getElementById('tag_name_edit').value = tag.value.name;
  document.getElementById('tag_id_edit').value = tag.key;
  document.getElementById('tag_index_edit').value = index;
}

function del_tag() {
  // Deletion of a tag
  var element = document.getElementById('tag_edit_list');
  var id = element.value;
  var index = element.selectedIndex;
  delete_tag(id, delete_option_from_list('tag_edit_list', index));
}

function del_profil() {
  // Deletion of a profile
  var element = document.getElementById('profil_edit_list');
  var id = element.value;
  var index = element.selectedIndex;
  delete_profil(id, delete_option_from_list('profil_edit_list', index));
}

function load_tag() {
  // Load a tag in the field "input text" of the edit form
  var id = parseInt(document.getElementById('tag_edit_list').value);
  var index = document.getElementById('tag_edit_list').selectedIndex;

  console.log('Index '+ index);
  store_tags = db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);
  var keyRange = IDBKeyRange.only(id);
  var cursorRequest = store_tags.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if (!!result == false) {
     callback(result.value);
    } else {
      // Fill the input and flyto the page
      fill_edit_tag_form(result, index);
      flyto('tag_edit');

      if (typeof(callback) != 'undefined') {}
    }
  }
  cursorRequest.onerror = function(e) {};
}

function load_profil() {
  // Load profile in the form for edition

  var id = parseInt(document.getElementById('profil_edit_list').value);
  var index = document.getElementById('profil_edit_list').selectedIndex;
  store_profils = db.transaction(STORENAME_PROFILS, type).objectStore(STORENAME_PROFILS);
  var keyRange = IDBKeyRange.only(id);
  var cursorRequest = store_profils.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
  if (!!result == false) {
    callback(result.value);
    }else {
    fill_edit_profil_form(result, index);
    flyto('profil_edit');
  }
  }
  cursorRequest.onerror = function(e) {
   }
}

function edit_tag() {
  var tag = {};
  tag.id = parseInt(document.getElementById('tag_id_edit').value);
  tag.name = document.getElementById('tag_name_edit').value;
  var index = document.getElementById('tag_index_edit').value;
  edition_tag(tag, index);
}

function edition_tag(tag,index) {
  // Edition of a tag
  var keyRange = IDBKeyRange.only(parseInt(tag.id));
  store_tags = db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);
  var cursorRequest = store_tags.openCursor(keyRange);

  cursorRequest.onsuccess = function(evt) {
    var cursor = evt.target.result;
    console.log(tag);
    var objRequest = cursor.update(tag);

    objRequest.onsuccess = function(ev) {
      update_item(tag.id, tag.name, 'tag_edit_list', index);
      update_item(tag.id, tag.name, 'choice-tags', index);
      flyto('tag_list'); };

    objRequest.onerror = function(ev) {
      flyto('tag_list');
    };
  };
  cursorRequest.onerror = function(evt) {
    log('Error in retrieving record 88');
  };
}


function edit_profil() {
  // After submitting the  profile edit form. we put data in object and send it
  // to an other function
  var profil = {};
  profil.id = parseInt(document.getElementById('profil_id_edit').value);
  profil.name = document.getElementById('profil_name_edit').value;
  profil.weight = document.getElementById('profil_weight_edit').value;
  profil.sex = document.getElementById('profil_sex_edit').value;
  var index = document.getElementById('profil_index_edit').value;
  profil.active = 'false';
  edition_profil(profil, index);
}

function edition_profil(profil,index) {
  // The argument is an object profile.This function will update the record in IDB
  var keyRange = IDBKeyRange.only(parseInt(profil.id));
  store_profils = db.transaction(STORENAME_PROFILS, type).objectStore(STORENAME_PROFILS);
  var cursorRequest = store_profils.openCursor(keyRange);

  cursorRequest.onsuccess = function(evt) {
    var cursor = evt.target.result;
    //do the update
    var objRequest = cursor.update(profil);
    objRequest.onsuccess = function(ev) {
      update_item(profil.id, profil.name, 'profil_edit_list', index);
      update_item(profil.id, profil.name, 'profil_edit_list', index);
      flyto('profil_list'); };
    objRequest.onerror = function(ev) { flyto('profil_list'); };
  };

  cursorRequest.onerror = function(evt) {};
}

function insert_profil() {
  // Retrieve data of the add profile , puts it in the object profil and send it
  // to add_profil
  var profil = {};
  profil.name = document.getElementById('profil_name_add').value;
  profil.sex = document.getElementById('profil_sex_add').value;
  profil.weight = document.getElementById('profil_weight_add').value;
  profil.active = 'false';

  add_profil(profil);
}

function insert_tag() {
  // Retrieve the tag name of the tag from the add form , put it in object and
  // send the name to add_tag()
  var tag = {};
  tag.name = document.getElementById('tag_name_add').value;
  add_tag(tag.name);
}

function add_profil(profil) {
  // Receive an object "profile" and insert it in IDB
  var transaction = db.transaction('profils', 'readwrite');
  var objectStore = transaction.objectStore(STORENAME_PROFILS);
  var req = objectStore.add(profil);

  req.onsuccess = function(e) {
    var obj = {};
    obj.key = e.target.result;
    obj.name = profil.name;
    add_option_to_list('profil_edit_list', obj, flyto('profil_list'));
  };
  req.onerror = function() {};
}

function update_course(id,dist){

  //Get the parcours and data

  //Add the distance in

  //Update the object.

}



function add_sport(sport) {
  // Receive an object "sport" and insert it in IDB
  var transaction = db.transaction('sports', 'readwrite');
  transaction.oncomplete = function(event) {};
  var objectStore = transaction.objectStore('sports');
  var req = objectStore.add(sport);
  req.onsuccess = function() {};
  req.onerror = function() {};
}

function add_sports() {
  // Function called during the first load , it adds sports in IDB
  var sports = {};
  var sport = {};

  sport.name = 'marche';
  sport.h_cal = 2;
  sport.f_cal = 2;
  add_sport(sport);

  sport.name = 'jogging';
  sport.h_cal = 13;
  sport.f_cal = 12;
  add_sport(sport);

  sport.name = 'velo';
  sport.h_cal = 4;
  sport.f_cal = 4;
  add_sport(sport);
}

function reset_list() {
  // Function deleting of the entries in the HTML list of tags
  var formObj = document.getElementById('tag_edit_list');
  for (var loop = 0; loop < formObj.mySelect.options.length; loop++) {
    formObj.mySelect.options[loop] = null; // remove the option
  }
  var formObj = document.getElementById('choice-tags');
  for (var loop = 0; loop < formObj.mySelect.options.length; loop++) {
    formObj.mySelect.options[loop] = null; // remove the option
  }
}

function add_tag(name) {
  // Receive a name of tag and insert it in IDB. Then it updates the two lists
  // (edition list and choice of tag)
  var store_tags = db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);
  var req = store_tags.add({name: name});

  req.onsuccess = function(e) {
  var obj = {};
  obj.key = e.target.result;
  obj.name = name;
    add_option_to_list('tag_edit_list', obj, flyto('tag_list'));
    add_option_to_list('choice-tags', obj);
  };
  req.onerror = function() {};
}

function add_record(obj) {
  // Insert an object of type record in IDB
  store_records = db.transaction(STORENAME_RECORDS, type).objectStore(STORENAME_RECORDS);
  var req = store_records.add(obj);

  req.onsuccess = function() {};
  req.onerror = function() {};
}

function render_sports(data, id) {
  // Add a sport item in the list of choice
  var select_sports = document.getElementById('choice-sports');
  var elOptNew = document.createElement('option');
  elOptNew.text = data.name;
  elOptNew.value = id;
  select_sports.add(elOptNew, null);
}

function render_tags(data, id) {
  // Add a tag in the two list : edition and choice
  var select_tags = document.getElementById('tag_edit_list');
  var elOptNew = document.createElement('option');
  elOptNew.text = data.name;
  elOptNew.value = id;
  select_tags.add(elOptNew, null);

  var select_tags = document.getElementById('choice-tags');
  var elOptNew = document.createElement('option');
  elOptNew.text = data.name;
  elOptNew.value = id;
  select_tags.add(elOptNew, null);
}

function remove_tag_from_list(id) {
  // Remove a tag from a list
  var select_tags = document.getElementById('list_tags');
  select_tags.remove(id);
}

function get_all_tags() {
  // Retrieve all the tags from the IDB and send it to render_tags for
  // displaying it the list
  var transaction = db.transaction('tags', 'readwrite');
  var objectStore = transaction.objectStore('tags');
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = objectStore.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if (result) {
      render_tags(result.value, result.key);
      result.continue();
    }
  };
  cursorRequest.onerror = function(e) {};
}

function get_all_sports() {
  // Retrieve all the sports from IDB and send it to render sport for displaying
  // it in the app
  var transaction = db.transaction('sports', 'readwrite');
  var objectStore = transaction.objectStore('sports');
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = objectStore.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if (result) {
      render_sports(result.value, result.key);
      result.continue();
    }
  };
  cursorRequest.onerror = function(e) {};
}

function see_records(parcours) {
  var new_dist = 0;
  var cpt_curs = 0;
  var last_lat = null;
  var last_long = null;
  store_records = db.transaction(STORENAME_RECORDS, type).objectStore(STORENAME_RECORDS);
  var index = store_records.index('parcours_id');
  var singleKeyRange = IDBKeyRange.only(parcours);

  index.openCursor(singleKeyRange).onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      render_record(cursor.value);
      if (last_lat != null && last_long != null) {
        new_dist = new_dist + CalcDistanceBetween(last_lat, last_long, cursor.value.latitude, cursor.value.latitude);
      }
      last_lat = cursor.value.latitude;
      last_lon = cursor.value.latitude;
      cursor.continue();
      cpt_curs++;
    }
  };
}

function records_to_json(parcours) {
  // Not used in the app, retrieve parcours and log a json string with datas
  var compteur = 0;
  store_records = db.transaction(STORENAME_RECORDS, type).objectStore(STORENAME_RECORDS);
  var index = store_records.index('parcours_id');
  var json = {};
  var singleKeyRange = IDBKeyRange.only(parcours);

  index.openCursor(singleKeyRange).onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      json[compteur] = cursor.value;
      cursor.continue();
      compteur++;
    }
    var stringifyjson = JSON.stringify(json);
    var newtstring = stringifyjson.replace(/\\("|'|\\)/g, '$1');

    console.log(stringifyjson);
  };
}

function see_ongmaps(id) {
  get_parcours(id, work_on_parcours);
}

function get_parcours(id, callback) {
  console.log(callback);
  // Use ID and retrieve a parcours from the IDB and send it to callback
  var id = parseInt(id);
  store_parcours = db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);
  var keyRange = IDBKeyRange.only(id);
  var cursorRequest = store_parcours.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if (!!result == false) {
      callback(result.value);
    } else {
      if (typeof(callback) != 'undefined') {
        callback(result);
        console.log(result);
      }
    }
  }
  cursorRequest.onerror = function(e) {};
}

function get_profil_name(id) {
  // Function uses ID and retrieve the profile's name from IDB
  // It sends name to the function fill_parcours_profil
  store_profils = db.transaction(STORENAME_PROFILS, type).objectStore(STORENAME_PROFILS);
  var keyRange = IDBKeyRange.only(parseInt(id));
  var cursorRequest = store_profils.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if (!!result == false) {
      //
    } else {
      fill_parcours_profil(result.value.name);
    }
  };
  cursorRequest.onerror = function(e) {};
}

var get_tag_info = function(key, objet) {
  store_tags = db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);
  var keyRange = IDBKeyRange.only(parseInt(objet.tag));
  var cursorRequest = store_tags.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if (!!result == false) {
      //
    } else {
      get_sport(objet.sport, objet, add_parcours_to_list, key, result.value.name);
    }
  };
  cursorRequest.onerror = function(e) {};
};

function get_tag_name(id) {
  console.log(id);
  store_tags = db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);
  var keyRange = IDBKeyRange.only(parseInt(id));
  var cursorRequest = store_tags.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if (!!result == false) {
      //
    } else {
      fill_parcours_tag(result.value.name);
    }
  };
  cursorRequest.onerror = function(e) {};
}

function get_tags(id, callback, callback2) {
  store_tags = db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);
  var keyRange = IDBKeyRange.only(parseInt(id));
  var cursorRequest = store_tags.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if (!!result == false) {
      //
    } else {
      callback(result.value, callback2);
    }
  };
  cursorRequest.onerror = function(e) {};
}

function form_edit_tag(form) {
  var value = form.input_edit_sport.value;
  var selected_index = form.list_tags.selectedIndex;
  var id = form.list_tags[selected_index].value;
  var data = {name: value};
  update_tag(parseInt(id), data);
}

function form_delete_sport(form) {
  var selIndex = form.elements['list_tags'].selectedIndex;
  var newSel = form.elements['list_tags'].options[selIndex].value;
  delete_tag(newSel);
  remove_sport_from_list(selIndex);

  return false;
}

function form_get_data(action, referer) {
  if (action == 'add_sport' && referer.add_sport.value != '') {
    add_sport(referer.add_sport.value);
  } else if (action == 'delete_sport' && referer != '') {
    remove_sport_from_list(referer);
  }
}

var update_parcours = function(id, data) {
  var keyRange = IDBKeyRange.only(parseInt(id));
  store_parcours = db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);
  var cursorRequest = store_parcours.openCursor(keyRange);
  cursorRequest.onsuccess = function(evt) {
    var cursor = evt.target.result;
    var objRequest = cursor.update(data);
    objRequest.onsuccess = function(ev) {};
    objRequest.onerror = function(ev) {};
  };
  cursorRequest.onerror = function(evt) {};
};

function update_tag(id, data) {
  var keyRange = IDBKeyRange.only(id);
  store_tags = db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);
  var cursorRequest = store_tags.openCursor(keyRange);

  cursorRequest.onsuccess = function(evt) {
    var cursor = evt.target.result;
    var objRequest = cursor.update(data);
    objRequest.onsuccess = function(ev) {};
    objRequest.onerror = function(ev) {};
  };
  cursorRequest.onerror = function(evt) {};
}

function supprimer_parcours() {
  for (var i = 0; i < 45; i++) {
    delete_parcours(i);
  }
}

function delete_tag(id, callback) {
  var id = parseInt(id);
  store_tags = db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);
  var request = store_tags.delete(id);

  request.onsuccess = function(e) {
    callback;
  }
  request.onerror = function(e) {};
}

function delete_profil(id, callback) {
  var id = parseInt(id);
  store_profils = db.transaction(STORENAME_PROFILS, type).objectStore(STORENAME_PROFILS);
  var request = store_profils.delete(id);

  request.onsuccess = function(e) {
    callback;
  };
  request.onerror = function(e) {};
}

function delete_parcours() {
  var pid=document.getElementById('pid_detail_parcours').value;
  var id = parseInt(pid);
  console.log(pid);
  store_parcours = db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);
  delete_records_of_parcours(id);
  var request = store_parcours.delete(id);

  request.onsuccess = function(e) {
    console.log("success");
    reset_parcours_list();
    flyto('parcours_list');
  };
  request.onerror = function(e) {};
}

function delete_tag(id) {
  var id = parseInt(id);
  store_tags = db.transaction(STORENAME_TAGS, type).objectStore(STORENAME_TAGS);
  var request = store_tags.delete(id);

  request.onsuccess = function(e) {};
  request.onerror = function(e) {};

  var keyRange = IDBKeyRange.only(id);
  var cursorRequest = store_tags.openCursor(keyRange);
}

function save_data() {
  var req = store_conf.add({data1: 'hello', data2: 'hello2'});
  req.onsuccess = function() {};
  req.onerror = function() {};
}

function delete_table_record(id_table) {
  var table = document.getElementById(id_table);
  var rowCount = table.rows.length;

  for (var i = 1; i < rowCount; i++) {
    table.deleteRow(i);
  }
}

function delete_records_of_parcours(pid){

  var transaction = db.transaction(STORENAME_RECORDS, 'readwrite');
  var objectStore = transaction.objectStore(STORENAME_RECORDS);
  var index = objectStore.index('parcours_id');
  var singleKeyRange = IDBKeyRange.only(parseInt(pid));
  var cursorRequest = index.openCursor(singleKeyRange);

  cursorRequest.onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
        
        cursor.delete();

      var retour = cursor.continue();
    }
  }
  cursorRequest.oncomplete = function(e) { console.log("complete"); };
  cursorRequest.onerror = function(e) { console.log("error");}



}

function render_record(data) {
  var list_field_record = ['latitude', 'longitude', 'timestamp', 'accuracy', 'altitudeAccuracy', 'altitude', 'speed', 'heading'];
  var table = document.getElementById('list_records');
  var rowCount = table.rows.length;
  var row = table.insertRow(rowCount);
  var cnt_row = 0;

  for (var key in list_field_record) {
    var cell = row.insertCell(cnt_row);
    cell.innerHTML = data[list_field_record[key]];
    cnt_row++;
  }

  var cell = row.insertCell(cnt_row);
  cell.innerHTML = '';
}

function render_parcours(data, id) {
  list_fields = ['name', 'sport', 'startTime', 'stopTime', 'duration', 'LatStartPoint', 'LongStartPoint'];
  var table = document.getElementById('list_parcours');
  var rowCount = table.rows.length;
  var row = table.insertRow(rowCount);
  var cnt_row = 0;

  // On insere les attributs, mais ordre étrange donc je force avec tableau
  for (var key in list_fields) {
    var cell = row.insertCell(cnt_row);
    cell.innerHTML = data[list_fields[key]];
    cnt_row++;
  }
  var cell = row.insertCell(cnt_row);
  cell.innerHTML = '<input type="button" value=" Supprimer parcours" onclick="delete_parcours(' + id + ');" /><input type="button" value=" Voir records" onclick="see_records(' + id + ');" /><input type="button" value=" Voir records JSON" onclick="records_to_json(' + id + ');" /><input type="button" value=" Voir sur Gmaps" onclick="see_ongmaps(' + id + ');" />';
}

function stop_parcours() {
  get_parcours(current_parcours, stopper_parcours);
}

var stopper_parcours = function(parcours) {
  var obj_date = new Date();
  var obj = parcours;
  obj.stopTime = obj_date.getTime();
  obj.duration = (obj.stopTime) - (obj.startTime);
  update_parcours(current_parcours, obj);
};

function list_parcours() {
  var store_parcours = db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store_parcours.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if (result) {
      render_parcours(result.value, result.key);
      result.continue();
    }
  };
  cursorRequest.onerror = function(e) {};
}

var work_on_parcours = function(id) {
  var transaction = db.transaction(STORENAME_RECORDS, 'readwrite');
  var objectStore = transaction.objectStore(STORENAME_RECORDS);
  var index = objectStore.index('parcours_id');
  var singleKeyRange = IDBKeyRange.only(parseInt(id));
  var distance = null;
  var vitesse_max = 0;
  var min_ts = null;
  var max_ts = null;
  var vitesse_max = 0;
  var alti_max = null;
  var path_polyline = new Array();
  var old_lati = null;
  var old_longi = null;
  var cursorRequest = index.openCursor(singleKeyRange);
  var array_coord = new Array();

  cursorRequest.onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      if (min_ts == null && max_ts == null) {
        min_ts = cursor.value.timestamp;
        max_ts = cursor.value.timestamp;
      }

      if (old_lati != null || old_longi != null) {
        distance = distance + CalcDistanceBetween(old_lati, old_longi, cursor.value.latitude, cursor.value.longitude);
      }

      var coord = {};

      coord.lat = cursor.value.latitude;
      coord.lon = cursor.value.longitude;
      array_coord.push(coord);
      
      if (cursor.value.speed >= vitesse_max) {
        vitesse_max = cursor.value.speed;
      }

      if (cursor.value.timestamp > max_ts) {
        max_ts = cursor.value.timestamp;
      }

      old_lati = cursor.value.latitude;
      old_longi = cursor.value.longitude;
      var retour = cursor.continue();
    } else {
      var duree_ms = max_ts - min_ts;
      
      draw_trace(array_coord);
      
    }
  };
  cursorRequest.oncomplete = function(e) { };
  cursorRequest.onerror = function(e) {}
};

function get_sport(id,item,callback, key,tag) {
  // We will do a get on the parcours object, take the startTime, make minus
  // with stopTime and we'll do an update with stopTime and duration
  // Creation of a store on parcours object

  store_sports = db.transaction(STORENAME_SPORTS, type).objectStore(STORENAME_SPORTS);
  // We define the keyRange with "only" for the query on DB
  var keyRange = IDBKeyRange.only(parseInt(id));
  // Creation of cursor with the keyRange
  var cursorRequest = store_sports.openCursor(keyRange);
  // Success of the cursor
  cursorRequest.onsuccess = function(e) {
    // Store of the result
    var result = e.target.result;
    if (!!result == false) {
      //
    } else {
      callback(key, item, result.value, tag);
    }
  };
  cursorRequest.onerror = function(e) {};
}

function format_heure(date_ms) {
  var duree_s = date_ms / 1000;
  var d = new Date(date_ms);
  return d.getHours() + ':'+ d.getMinutes() + ':'+ d.getSeconds() + '';
}

function force_insert() {
  add_parcours('Input force', input_json);
}

var input_json = function(pid) {
  var objet2 = JSON.parse(document.getElementById('input_json').value);
  for (var x in objet2) {
    var record = objet2[x];
    var new_obj = {};
    new_obj.latitude = record.latitude;
    new_obj.longitude = record.longitude;
    new_obj.timestamp = record.timestamp;
    new_obj.altitude = record.altitutde;
    new_obj.accuracy = record.accuracy;
    new_obj.altitudeAccuracy = record.altitutdeAccuracy;
    new_obj.heading = record.heading;
    new_obj.speed = record.speed;
    new_obj.parcours_id = pid;
    add_record(new_obj);
    x++;
  }
};

var start_parcours=function() {
  chrono();
  console.log("start parcours la");
  var sport = document.getElementById('choice-sports').value;
  var tag = document.getElementById('choice-tags').value;
  add_parcours(sport, tag, current_profil, start_gps);
};

function get_parcours_and_begin(id, obj) {
  // We will do a get on the parcours object, take the startTime, make minus
  // with stopTime and we'll do an update with stopTime and duration
  flyto('trace');
  // Creation of a store on parcours object
  store_parcours = db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);
  // We define the keyRange with "only" for the query on DB
  var keyRange = IDBKeyRange.only(parseInt(id));
  // Creation of cursor with the keyRange
  var cursorRequest = store_parcours.openCursor(keyRange);
  // Success of the cursor
  cursorRequest.onsuccess = function(e) {
    //Store of the result
    var result = e.target.result;

    if (!!result == false) {
      //
    } else {
      //Instanciation of new object
      var newobj = {};
      //We put the objet passed in parameter to "newobj"
      newobj = result.value;
      //We store Lat & Long of start Point
      newobj.LatStartPoint = obj.LatStartPoint;
      newobj.LongStartPoint = obj.LongStartPoint;
      //Update of the object parcours
      update_parcours(id, newobj);

    }
  };
  cursorRequest.onerror = function(e) {};
}

function get_parcours_and_finish(id, obj) {
  // We will do a get on the parcours object, take the startTime, make minus
  // with stopTime and we'll do an update with stopTime and duration
  // Creation of a store on parcours object
  store_parcours = db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);
  // We define the keyRange with "only" for the query on DB
  var keyRange = IDBKeyRange.only(parseInt(id));
  // Creation of cursor with the keyRange
  var cursorRequest = store_parcours.openCursor(keyRange);
  // Success of the cursor
  cursorRequest.onsuccess = function(e) {
    // Store of the result
    var result = e.target.result;
    if (!!result == false) {
      log("Impossible de recuperer l'objet");
    } else {
      //Calcul of the duration stopTime (type: timestamp) - startTime (type: timestamp))
      var duration = (parseInt(obj.StopTime)) - (parseInt(result.value.startTime));
      //Instanciation of new object
      var newobj = {};
      //We put the objet passed in parameter to "newobj"
      newobj = result.value;
      //We store duration and stopTime
      newobj.duration = duration;
      newobj.stopTime = obj.StopTime;
      newobj.distance = obj.distance;
      //Update of the object parcour
      update_parcours(id, newobj);
    }
  };
  cursorRequest.onerror = function(e) {
    log('Erreur de curseur');
  };
}

var add_parcours = function(sport,tag,profil,callback) {
  store_parcours = db.transaction(STORENAME_PARCOURS, type).objectStore(STORENAME_PARCOURS);
  var obj_date = new Date();
  var date = obj_date.getDate() + '/'+ (obj_date.getMonth() + 1) + '/'+ obj_date.getFullYear() + '-'+ obj_date.getHours() + 'h'+ obj_date.getMinutes() + 'm'+ obj_date.getSeconds() + 's';
  var name = 'Parcours '+ date;
  var obj = {};
  obj.name = name;
  obj.sport = sport; //id
  obj.tag = tag;//Nom
  obj.profil = profil; //id
  obj.startTime = obj_date.getTime();
  obj.duration = null;
  obj.stopTime = null;
  obj.LatStartPoint = '';
  obj.LongStartPoint = '';

  var req = store_parcours.add(obj);
  req.onsuccess = function(e) {
    current_parcours = req.result; //On assigne l'ID retourné à la variable current parcours.
    callback(current_parcours);
  };
  req.onerror = function() {};
};

function caller(name) {
  if (arguments.callee.caller.name != '') {
    console.log(arguments.callee.caller.name);
  } else {
    console.log(name);
  }
}

