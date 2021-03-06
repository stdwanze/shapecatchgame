ShapeCatchGame = window.ShapeCatchGame || {}; 
( function(ShapeCatchGame) {"use strict";

		ShapeCatchGame.Engine = (function() {

			function engine(canvas, ctxt, isShapeToRemoveCallBack) {
				this.canvas = canvas;
				this.ctxt = ctxt;
				this.shapes = [];
				this.run = false;
				this.init(isShapeToRemoveCallBack);
				this.frame = 1;
				this.eventObjects = [];
				
				this.shapeFactory = new ShapeCatchGame.ShapeFactory();
			}


			engine.prototype = {

				start : function() {
					this.run = true;
					this.tickndraw(this.frame);
				},
				stop : function() {
					this.run = false;
				},
				getShapeCount : function() {
					return this.shapes.length;
				},
				clear : function() {
					this.shapes = [];
					this.ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);

				},
				addShapes : function(shapes) {
					if (shapes.length !== undefined) {
						shapes.forEach( function(shape) {
							this.shapes.push(shape);
						}.bind(this));
					} else {
						this.shapes.push(shapes);
					}
				},
				removeShape : function(shape) {
					var index = this.shapes.indexOf(shape);
					if (index > -1) {
						this.shapes.splice(index, 1);
					}
				},
				init : function(isShapeToRemoveCallBack) {
					window.requestAnimFrame = (function(callback) {
						return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
						function(callback) {
							window.setTimeout(callback, 1000 / 60);
						};
					})();

					this.canvas.addEventListener("click", function(e) {
						
						var hitXY = this.getXY(e);
						console.log('click: x:' + hitXY.x + '/y:' + hitXY.y);
						
						this.handleClickTouch(hitXY.x,hitXY.y,isShapeToRemoveCallBack);
					}.bind(this), false);
					
					this.canvas.addEventListener("touchstart", function(e) {
						var hitXY = this.getXY(e);
						console.log('click: x:' + hitXY.x + '/y:' + hitXY.y);
						this.handleClickTouch(hitXY.x,hitXY.y,isShapeToRemoveCallBack);
					}.bind(this), false);
					
				},
				getXY : function (event)
				{
					return new ShapeCatchGame.Point(event.layerX, event.layerY);
				},
				reportClickTouch: function (x,y)
				{
					var touchpoint = this.shapeFactory.createStillShape(y-5,x-5,10,10,"#AAAAAA");
					this.eventObjects.push(touchpoint);	
				},
				handleClickTouch :function (x,y,isShapeToRemoveCallBack)
				{
						this.reportClickTouch(x,y);
						var shape = this.collides(x,y);
						if (shape !== null && this.run == true) {

							console.log('collision: ' + shape);
							if (isShapeToRemoveCallBack(shape)) {
								this.removeShape(shape);
								console.log("was right color");
							} else {
								var badShape = new ShapeCatchGame.Shape(0, 0, 400, 400, 0);
								badShape.isHit = function() {
									return false;
								};
								badShape.color = "#B40431";
								badShape.defineColor = function() {
								};
								this.eventObjects.push(badShape);
							}
						} else {
							console.log('no collision');
						}
				},
				collides : function(x, y) {
					var hitShape = null;

					//for (var i = 0; i < this.shapes.length; i++) {
					for (var i = this.shapes.length-1; i > -1; i--) {
				
						if (this.shapes[i].isHit(x, y)) {

							hitShape = this.shapes[i];
							break;
						}
					}

					return hitShape;
				},
				tickndraw : function(frame) {
					//  console.log("tickndraw fartherFrame"+ frame +" - " +(frame+1));
					if (this.frame == frame + 1)
						console.log("!!!!");
					else
						this.frame = frame + 1;
					//update
					this.shapes.forEach( function(shape) {
						shape.tick(this.canvas, this.ctxt);
					}.bind(this));
					//clear
					this.ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);

					//draw
					this.shapes.forEach( function(shape) {
						shape.render(this.canvas, this.ctxt);
					}.bind(this));

					this.eventObjects.forEach( function(shape) {
						shape.render(this.canvas, this.ctxt);

					}.bind(this));
					this.eventObjects = [];

					// register next
					if (this.run) {
						requestAnimFrame( function() {
							this.tickndraw(frame + 1);
						}.bind(this));
					}
				}
			};

			return engine;
		})();

		return ShapeCatchGame;
	}(window.ShapeCatchGame || {})); 