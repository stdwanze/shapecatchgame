ShapeCatchGame = window.ShapeCatchGame || {};
( function(ShapeCatchGame) {"use strict";

		ShapeCatchGame.Point = ( function() {

				function point(x, y) {
					this.x = x;
					this.y = y;
				}

				return point;
			}());

		ShapeCatchGame.Helper = {

			colors : ["#FF0000", "#00FF00", "#0000FF", "#000000", "#E0E0E0", "#AABBCC"],

			width : function(point1, point2) {
				return point2.x - point1.x;
			},

			height : function(point1, point2) {
				return point2.y - point1.y;
			},
			getDecision : function(bias) {
				var decisionbase = Math.random();
				bias = bias !== undefined ? bias : 0.5;
				if (bias < decisionbase)
					return true;
				else
					return false;
			},
			getRandomNumber : function(max) {
				var decisionbase = Math.random();
				return Math.round((decisionbase * 100000 )) % max;
			},
			getRandColor : function() {
				var pos = ShapeCatchGame.Helper.getRandomNumber(ShapeCatchGame.Helper.colors.length);
				return ShapeCatchGame.Helper.colors[pos];
			}
		};

		ShapeCatchGame.ColorTransform = ( function() {

				function colortransform() {
					
					this.iterations = 6;
					this.framesPerIteration = 25;
					this.framesPerIterationCurrent = 25;

				}


				colortransform.prototype = {
					tick : function() {
						this.framesPerIterationCurrent--;
						if (this.framesPerIterationCurrent == 0) {
							this.iterations--;
							if (this.iterations > 0) {
								this.framesPerIterationCurrent = this.framesPerIteration;
								this.target.color = this.target.color == this.target.futureColor ? this.target.oldColor : this.target.futureColor;
							} else
								return true;
							// remove
						}
						return false;
					},
					attach : function (shape)
					{
						this.target = shape;
						this.target.oldColor = this.target.color;
				        var pos = ShapeCatchGame.Helper.getRandomNumber(ShapeCatchGame.Helper.colors.length);
						this.target.futureColor = ShapeCatchGame.Helper.colors[pos];
					}
				};
				return colortransform;
			}());
		ShapeCatchGame.Shape = ( function() {

				function shape(top, left, bottom, right, speed) {

					this.topLeft = new ShapeCatchGame.Point(left, top);
					this.bottomRight = new ShapeCatchGame.Point(right, bottom);
					this.color = ShapeCatchGame.Helper.getRandColor();;
					this.futureColor = this.color;
					this.oldColor = this.color;
					this.changePosibility = 0.98;
					this.width = ShapeCatchGame.Helper.width(this.topLeft, this.bottomRight);
					this.height = ShapeCatchGame.Helper.height(this.topLeft, this.bottomRight);
								this.speed = speed !== undefined ? speed : 1;
					this.applySpeed();
					this.transformations = {};
					this.transformationPrototypes = { color: new ShapeCatchGame.ColorTransform() };
					this.transformationPrototypes.color.attach(this);
					

				}

				function isColliding(projected, marginborder, lowerbound) {
					if (lowerbound && projected < marginborder)
						return true;
					if (!lowerbound && projected > marginborder)
						return true;
					return false;
				}


				shape.prototype = {

					render : function(canvas, ctxt) {
						ctxt.fillStyle = this.color;
						ctxt.fillRect(this.topLeft.x, this.topLeft.y, this.width, this.height);
					},
					defineColor : function() {

						if (this.transformations["color"] !== undefined) {
							var depleted = this.transformations["color"].tick();
							if (depleted)
								delete this.transformations["color"];
						} else {

							if (ShapeCatchGame.Helper.getDecision(this.changePosibility) 
								&& this.transformationPrototypes.color !== undefined 
								&& this.transformationPrototypes.color !== null) {
								this.transformations["color"]  = $.extend(true, {}, this.transformationPrototypes.color) ;
								this.transformations["color"].tick();
							}
						}

					},
					tick : function(canvas, ctxt) {

						// color change?
						this.defineColor();
						// test x <-;
						if (isColliding(this.topLeft.x + this.moveX, 10, true)) {
							this.moveX = this.moveX * -1;
						}
						// test x ->
						else if (isColliding(this.bottomRight.x + this.moveX, canvas.width - 10, false)) {
							this.moveX = this.moveX * -1;
						}
						// test y upper;
						if (isColliding(this.topLeft.y + this.moveY, 10, true)) {
							this.moveY = this.moveY * -1;
						}
						// test y bottom->
						else if (isColliding(this.bottomRight.y + this.moveY, canvas.height - 10, false)) {
							this.moveY = this.moveY * -1;
						}

						this.topLeft.x = this.topLeft.x + this.moveX;
						this.topLeft.y = this.topLeft.y + this.moveY;

						this.bottomRight.x = this.topLeft.x + this.width;
						this.bottomRight.y = this.topLeft.y + this.height;

					},
					isHit : function(x, y) {
						if (x > this.topLeft.x && x < this.bottomRight.x && y > this.topLeft.y && y < this.bottomRight.y) {
							return true;
						} else {
							return false;
						}
					},
					applySpeed : function ()
					{
						this.moveX = ShapeCatchGame.Helper.getDecision() ? this.speed : -1 * this.speed;
						this.moveY = ShapeCatchGame.Helper.getDecision() ? this.speed : -1 * this.speed;
					}
				};

				return shape;
			}());

		ShapeCatchGame.ShapeFactory = (function() {

			function factory() {
				this.shape = null;
				
			}


			factory.prototype = {
				// fluid api
				beginShape : function(top, left, width, height) {
					this.shape = new ShapeCatchGame.Shape(top, left, top + height, left + width, 0);
					return this;
				},
				speed : function(speed) {
					this.shape.speed = speed;
					this.shape.applySpeed();
					return this;
				},
				color : function(color) {
					this.shape.oldColor = color;
					this.shape.futureColor = color;
					this.shape.color = color;
					return this;
				},
				colortransformation : function (transformation){
					
					if(transformation == null)
					{
						this.shape.transformationPrototypes.color = null;			
					}
					else {
						transformation.attach(this.shape);
						this.shape.transformationPrototypes.color = transformation;
					}
					return this;
				},
				notHitable: function (){
					this.shape.isHit = function () { return false;};
					return this;
				},
				create : function() {
					return this.shape;
				},
				// end fluid
				createStillShape : function (top,left,width,height,color){
					var stillshape = this.beginShape(top, left,width, height)
					.speed(0).color(color).colortransformation(null).notHitable().create();
					return stillshape;
				},
				createMovingColorChangeShape : function (top,left,width,height,speed){
					var movingShape = this.beginShape(top, left,width, height)
					.speed(speed).create();
					return movingShape;
				}
			};

			return factory;
		}());

		return ShapeCatchGame;

	}(window.ShapeCatchGame || {}));
