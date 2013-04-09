'use strict';
var id_visible = "home";
window.addEventListener("load", function(){ 

  runrunrun.indexedDB.open();
  switchButtonsStartToFix();
  init_osm();

  

  var elements = document.querySelectorAll("#logo, #top-titre, .nav-item, .button_fly");

  for (var i = 0; i < elements.length; i++){
        elements[i].addEventListener("click", changeVisibility);
  } 

  
  var elements_btn_action = document.getElementsByClassName("button_action");

  for(var m=0; m<elements_btn_action.length;  m++){
    elements_btn_action[m].addEventListener("click", function (){ executeAction(this);}, false); 
  }

  var flyto=function (id){
    document.getElementById(id).style.display = 'inline';
    document.getElementById(id_visible).style.display = 'none';
    id_visible = id;
  }

  var executeAction=function(obj){
    var action=obj.getAttribute("data-action");
    eval(action); 
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


      
      
     

 