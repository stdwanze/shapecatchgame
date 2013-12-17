

ShapeCatchGame = window.ShapeCatchGame || {};

(function (ShapeCatchGame){
  "use strict";
  
  ShapeCatchGame.ViewModel = (function (){
  
    function vm (shapecatchgame)
    {
      this.shapecount = ko.observable(shapecatchgame.engine.shapes.length);
      this.tocatchcount = ko.observable(shapecatchgame.howMany);
    }
    
    return vm;
  }());
  
  
  
  return ShapeCatchGame; 
}(window.ShapeCatchGame || {}));