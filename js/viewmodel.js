ShapeCatchGame = window.ShapeCatchGame || {}; ( function(ShapeCatchGame) {"use strict";

		ShapeCatchGame.ViewModel = ( function() {

				function vm(restarter, canvas) {
					this.shapecount = ko.observable();
					this.tocatchcount = ko.observable();
					this.message = ko.observable();
					this.canvas = canvas;
					this.restarter = restarter;


					this.restartCallback = null;
					this.restarter.hide();
					this.restarter[0].addEventListener("click", function() {
						
						if(this.restartCallback !== null) this.restartCallback();
						
					}.bind(this));
				}


				vm.prototype = {
					update : function(shapecatchgame) {
						this.isEnd = shapecatchgame.state === "end" ? true: false;
						this.shapecount(shapecatchgame.engine.getShapeCount());
						this.tocatchcount(shapecatchgame.howMany);
						this.message(shapecatchgame.message);
						
						this.isEnd ? this.restarter.show() : this.restarter.hide();
						
						
					},
					setRestartCallback : function (callback)
					{
						this.restartCallback = callback;
					}
				};
				return vm;
			}());

		return ShapeCatchGame;
	}(window.ShapeCatchGame || {})); 