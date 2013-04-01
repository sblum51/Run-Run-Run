var id_visible = "home";
    window.onload = function() {

      init_osm();
      runrunrun.indexedDB.open();
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

      for(var k in elements_btn_action) {
        if(elements_btn_action[k] instanceof Element){
          var action = elements_btn_action[k].getAttribute("data-action");
          console.log("action "+action);
          elements_btn_action[k].addEventListener("click", function (){ executeAction(this);}, false); 
        }
      };


      var flyto=function (id){
        console(id);
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
        caller();
        if(document.getElementById(id).style.display == "inline")
           return true;
        else
           return false;
      }

goto(48.725963,2.181473,48.727856,2.269202);
     // goto(48.72821,2.268677,48.727856,2.269202);
      //goto(48.728214,2.268666, 48.727867,2.269181);

    }