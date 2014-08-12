'use strict';
var id_visible = "home";
window.addEventListener("load", function(){ 
  var func;
  var elements_btn_action;
  runrunrun.indexedDB.open();
  switchButtonsStartToFix();
  init_osm();

  var executeAction=function(obj){
    var action=obj.getAttribute("data-action");
    
    action;
  }
  
  var elements = document.querySelectorAll("#logo, #top-titre, .nav-item, .button_fly");

  for (var i = 0; i < elements.length; i++){
        elements[i].addEventListener("click", changeVisibility);
  } 

  document.getElementById('button_fix_gps').addEventListener("click", function(){ fix_gps(); } , false);
  document.getElementById('button_start_course').addEventListener("click", function(){ start_parcours(); } , false);
  document.getElementById('button_pause').addEventListener("click", function(){ clearTimeout(compte); } , false);
  document.getElementById('button_rego').addEventListener("click", function(){ chrono(); } , false);
  document.getElementById('button_stop').addEventListener("click", function(){ stopWatch(compte); } , false);
  document.getElementById('button_delete_course').addEventListener("click", function(){  delete_parcours();} , false);
  document.getElementById('button_insert_tag').addEventListener("click", function(){  insert_tag();} , false);
  document.getElementById('button_load_tag').addEventListener("click", function(){  load_tag();} , false);
  document.getElementById('button_del_tag').addEventListener("click", function(){  del_tag();} , false);
  document.getElementById('button_edit_tag').addEventListener("click", function(){  edit_tag();} , false);
  document.getElementById('button_insert_profil').addEventListener("click", function(){  insert_profil();} , false);
  document.getElementById('button_load_profil').addEventListener("click", function(){  load_profil();} , false);
  document.getElementById('button_del_profil').addEventListener("click", function(){  del_profil();} , false);
  document.getElementById('button_edit_profil').addEventListener("click", function(){  edit_profil();} , false);

  var flyto=function (id){
    document.getElementById(id).style.display = 'inline';
    document.getElementById(id_visible).style.display = 'none';
    id_visible = id;
  }

  



  function changeVisibility() {
    var id = this.getAttribute("data-role");

    if(id == 'home') {
      var elements = document.getElementsByClassName('page');

      for(var i = 0, length = elements.length; i < length; i++) {
        elements[i].style.display = 'none';
      }

      document.getElementById("home").style.display = 'inline';
      id_visible = "home";
    } else {
      var elem=document.getElementById(id);
      if(!isVisible(elem)){
        flyto(id);
      }
    }
  }

  function isVisible(elem){
    return elem.style.display == "inline";
  } 

}); 


      
      
     

 