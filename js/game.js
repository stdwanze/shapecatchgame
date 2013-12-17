
ShapeCatchGame = window.ShapeCatchGame || {};

(function (ShapeCatchGame){
  "use strict";
  
  
  ShapeCatchGame.ShapeCatch = (function (){
    
    function shapeCatch (canvas, infoarea, restarter)
    {
      this.restarter = restarter;
      this.restarter.hide();
      this.restarter[0].addEventListener("click", function (){
        this.engine.stop();
        window.setTimeout(this.run.bind(this), 1000);
      }.bind(this));
      this.infoarea = infoarea;
      this.canvas = canvas;
      this.engine = new ShapeCatchGame.Engine(canvas, canvas.getContext("2d"), this.isRightColor.bind(this));
   
     /*
     $("#controller")[0].addEventListener("click", function (){
       this.engine.run ? this.engine.stop() : this.engine.start();
     }.bind(this));
     */
    }
    
    shapeCatch.prototype = {
      run: function ()
      {
        this.engine.clear();
        this.howMany = 10;
        this.level = 2;
        this.infoarea.innerText = "10";
        this.generate(this.howMany, this.level);
        this.engine.start();
      },
      stop: function ()
      {
        this.engine.stop();
      },

      generate : function (amount, difficulty)
      {
        this.colorToHave = ShapeCatchGame.Helper.getRandColor();
        difficulty = difficulty < 1 ? 1 : difficulty;
        
        var shapeWidth = 50;
        var shapeHeight = 50;
        
        var shapes = [];
        for(var i = 0; i < amount*difficulty ; i++ )
        {
          var x = ShapeCatchGame.Helper.getRandomNumber(this.canvas.width-shapeWidth);
          var y = ShapeCatchGame.Helper.getRandomNumber(this.canvas.height-shapeHeight);
          var speed =  ShapeCatchGame.Helper.getRandomNumber(3);
          speed = speed > 0 ? speed : 1;
          shapes.push(new ShapeCatchGame.Shape(x,y,x+shapeWidth,y+shapeHeight,speed));
        }
        this.engine.addShapes(shapes);
        var infoshape = new ShapeCatchGame.Shape(this.canvas.width-30,this.canvas.height-30,this.canvas.width,this.canvas.height,0);
        infoshape.isHit = function () { return false;};
        infoshape.color = this.colorToHave;
        infoshape.defineColor = function () {};
        this.engine.addShapes(infoshape);
      },
      checkEndConditions : function ()
      {
        var end = false;
        var text = "";
        if(this.howMany == 0)
        {
          end = true;
          text = "You have won!";
        }
        else if(this.howMany > this.engine.shapes.length)
        {
          end = true;
          text = "You have lost!";
        }
        
        if(end){
           this.engine.stop();
           this.restarter.show();
        }
        if(text !== "")  this.infoarea.innerText =text;
        
        
      },
      isRightColor : function (hitShape)
      {
        console.log("color to have "+this.colorToHave + "-> clicked: "+hitShape.color);
        if(hitShape.color == this.colorToHave ||
           hitShape.oldColor == this.colorToHave ){
          this.howMany = this.howMany -1;
          this.infoarea.innerText = ""+this.howMany;
          this.checkEndConditions();
          return true;
        }
        else{
          this.howMany = this.howMany +1;
          this.infoarea.innerText = ""+this.howMany;
          this.checkEndConditions();
          return false;
        }
        
      }
    };
    
    return shapeCatch;
  })();
  
  return ShapeCatchGame; 
}(window.ShapeCatchGame || {}));