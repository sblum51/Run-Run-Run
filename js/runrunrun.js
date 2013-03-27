var id_visible = "home";
    window.onload = function() {
    init_osm();
      runrunrun.indexedDB.open();
      document.getElementById("logo").addEventListener("click", changeVisibility, false);
      document.getElementById("top-titre").addEventListener("click", changeVisibility, false);
      var elements = document.getElementsByClassName("nav-item");

      for(var i in elements) {
        if(elements[i] instanceof Element){
          elements[i].addEventListener("click", changeVisibility, false); 
        }
      };
      
      var flyto=function (id){
        caller('fltyo');
        document.getElementById(id).style.display = 'inline';
        document.getElementById(id_visible).style.display = 'none';
        id_visible = id;
      }
         
      function changeVisibility() {
        caller();
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
    }