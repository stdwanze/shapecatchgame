ShapeCatchGame = window.ShapeCatchGame || {}; ( function(ShapeCatchGame) {"use strict";


		ShapeCatchGame.Intro = (function () {
			
			function intro(canvas,  startCallback)
			{
				this.canvas = canvas;
				this.ctxt = this.canvas.getContext("2d");
				this.start = startCallback;
				this.clickHandler = this.click.bind(this);
				
				this.init();
				
				this.shapeFactory = new ShapeCatchGame.ShapeFactory();
			}
			
			intro.prototype = {
				
				click : function (e)
				{
					this.dispose();
					this.start();
				},
				init : function () {
					this.canvas.addEventListener("click", this.clickHandler, false);
				},
				render: function  (){
						
					//clear
					this.ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
					
					var shapes = [];
					
					var shapeWidth = 50;
					var shapeHeight = 50;

					var shapes = [];
					for (var i = 1; i < 20; i = i+1) {
						var x = ShapeCatchGame.Helper.getRandomNumber(this.canvas.width - shapeWidth);
						var y = ShapeCatchGame.Helper.getRandomNumber(this.canvas.height - shapeHeight);
						var color = ShapeCatchGame.Helper.getRandColor();
						var shape = this.shapeFactory.createStillShape(x,y,shapeWidth,shapeHeight,color);
						shapes.push(shape);
					} 
					
					shapes.forEach( function(shape) {
						shape.render(this.canvas, this.ctxt);
					}.bind(this));				
					
					this.ctxt.fillStyle="#FF8000";
					this.ctxt.font="30px Arial";
					this.ctxt.fillText("ShapeCatch",100,100);
					this.ctxt.fillText("almost a game",90,150);
					this.ctxt.fillText(">play<",140,200);
					
					
					
				},
				dispose : function () {
					this. canvas.removeEventListener('click', this.clickHandler);
				}	
			};
			
			return intro;
		}());

		return ShapeCatchGame;

	}(window.ShapeCatchGame || {}));
