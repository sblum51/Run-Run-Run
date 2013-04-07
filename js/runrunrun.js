'use strict';
var id_visible = "home";

    window.onload = function() {

      
      
      runrunrun.indexedDB.open();
      switchButtonsStartToFix();
      document.getElementById("logo").addEventListener("click", changeVisibility, false);
      document.getElementById("top-titre").addEventListener("click", changeVisibility, false);
      

      var elements_nav_item = document.getElementsByClassName("nav-item");
      var elements_btn_fly = document.getElementsByClassName("button_fly");
      var elements_btn_action = document.getElementsByClassName("button_action");
      
      for(var i in elements_nav_item) {
        if(elements_nav_item[i] instanceof Element){
          elements_nav_item[i].addEventListener("click", changeVisibility, false); 
        }
      };

      for(var j in elements_btn_fly) {
        if(elements_btn_fly[j] instanceof Element){
          elements_btn_fly[j].addEventListener("click", changeVisibility, false); 
        }
      };

      for(var m=0; m<elements_btn_action.length;  m++){
        elements_btn_action[m].addEventListener("click", function (){ executeAction(this);}, false); 
      }
     

      init_osm();
      var flyto=function (id){
        console.log(id);
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

          if(!isVisible(id)){
            document.getElementById(id).style.display = 'inline';
            document.getElementById(id_visible).style.display = 'none';
            id_visible = id;
          }
        }
      }
    
      
      function isVisible(id) {
        
        if(document.getElementById(id).style.display == "inline")
           return true;
        else
           return false;
      }

    }