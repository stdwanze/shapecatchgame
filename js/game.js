ShapeCatchGame = window.ShapeCatchGame || {}; ( function(ShapeCatchGame) {"use strict";
	
		ShapeCatchGame.ShapeCatch = (function() {
			var State = {
				RUN : "run",
				END : "end"
			};
			function shapeCatch(vm) {
				this.vm = vm;
				//canvas, infoarea, restarter,
				this.vm.setRestartCallback(this.restart.bind(this));
				this.canvas = this.vm.canvas;
				this.engine = new ShapeCatchGame.Engine(this.canvas, this.canvas.getContext("2d"), this.isRightColor.bind(this));
				this.setState(State.END);
				
				this.soundmanager = new ShapeCatchGame.SoundManager();
				
			}


			shapeCatch.prototype = {
				run: function (){
					this.soundmanager.load().done(function(){
						this._run();
					}.bind(this));
				},
				_run : function() {
					this.setState(State.RUN);
					this.engine.clear();
					this.howMany = 10;
					this.level = 2;
					this.generate(this.howMany, this.level);
					this.engine.start();
					this.vm.update(this);
				},
				setState : function (state) {
					this.state = state;
				},
				stop : function() {
					this.engine.stop();
					this.setState(State.END);
				},
				restart : function ()
				{
					this.message = "";
					this.setState(State.END);
					this.vm.update(this);
					this.engine.stop();
					window.setTimeout(this._run.bind(this), 1000);
				},
				generate : function(amount, difficulty) {
					this.colorToHave = ShapeCatchGame.Helper.getRandColor();
					difficulty = difficulty < 1 ? 1 : difficulty;

					var shapeWidth = 50;
					var shapeHeight = 50;

					var shapes = [];
					for (var i = 1; i < amount * difficulty; i = i+1) {
						var x = ShapeCatchGame.Helper.getRandomNumber(this.canvas.width - shapeWidth);
						var y = ShapeCatchGame.Helper.getRandomNumber(this.canvas.height - shapeHeight);
						var speed = ShapeCatchGame.Helper.getRandomNumber(3);
						speed = speed > 0 ? speed : 1;
						shapes.push(new ShapeCatchGame.Shape(x, y, x + shapeWidth, y + shapeHeight, speed));
					}
					this.engine.addShapes(shapes);
					var infoshape = new ShapeCatchGame.Shape(this.canvas.width - 30, this.canvas.height - 30, this.canvas.width, this.canvas.height, 0);
					infoshape.isHit = function() {
						return false;
					};
					infoshape.color = this.colorToHave;
					infoshape.defineColor = function() {
					};
					this.engine.addShapes(infoshape);
				},
				checkEndConditions : function() {
					var end = false;
					var text = "";
					if (this.howMany == 0) {
						end = true;
						text = "You have won!";
					} else if (this.howMany > this.engine.getShapeCount()) {
						end = true;
						text = "You have lost!";
					}

					if (end) {
						this.engine.stop();
						this.setState(State.END);
					}
					if (text !== "")
						this.message = text;

					this.vm.update(this);
				},
				
				isRightColor : function(hitShape) {
					console.log("color to have " + this.colorToHave + "-> clicked: " + hitShape.color);
					if (hitShape.color == this.colorToHave || hitShape.oldColor == this.colorToHave) {
						this.howMany = this.howMany - 1;
					//	this.infoarea.innerText = "" + this.howMany;
						this.checkEndConditions();
						this.soundmanager.play(ShapeCatchGame.SOUND.success);
						return true;
					} else {
						this.howMany = this.howMany + 1;
					//	this.infoarea.innerText = "" + this.howMany;
						this.checkEndConditions();
						this.soundmanager.play(ShapeCatchGame.SOUND.fail);
						return false;
					}

				}
			};

			return shapeCatch;
		})();

		return ShapeCatchGame;
	}(window.ShapeCatchGame || {})); 