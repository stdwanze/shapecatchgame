/**
 * @author Stefan Dienst
 */
ShapeCatchGame = window.ShapeCatchGame || {}; ( function(ShapeCatchGame) {"use strict";

		ShapeCatchGame.SOUND = {
			fail : "sound/doh.mp3",
			success : "sound/success.mp3"

		};
		ShapeCatchGame.SoundPool = ( function() {

				function resourcepool(length, sound) {
					this.pool = [];
					this.size = length;
					this.sound = sound;
					this.currSound = 0;
				}


				resourcepool.prototype = {

					load : function() {

						var deferred = $.Deferred();

						for (var i = 0; i < this.size; i++) {
							var audio = new Audio(this.sound);
							audio.volume = .1;
							audio.load();
							this.pool[i] = audio;
						}
						this.checkAudio = window.setInterval( function() {
							this.checkReadyState(deferred);
						}.bind(this), 500);

						return deferred.promise();
					},
					playOne : function() {
						if (this.pool[this.currSound].currentTime == 0 || this.pool[this.currSound].ended) {
							this.pool[this.currSound].load();
							this.pool[this.currSound].play();
						}
						this.currSound = (this.currSound + 1) % this.size;
					},
					checkReadyState : function(deferred) {
						if (this.isReady()) {
							window.clearInterval(this.checkAudio);
							deferred.resolve();
						}
					},
					isReady : function() {
						var notReady = false;
						this.pool.forEach(function(audio) {
							if (audio.readyState !== 4) {
								notReady = true;
							}
						});
						return !notReady;
					}
				};

				return resourcepool;
			}());

		ShapeCatchGame.SoundManager = ( function() {

				function soundmanager() {
					this.failSounds = new ShapeCatchGame.SoundPool(3,ShapeCatchGame.SOUND.fail);
					this.successSounds = new ShapeCatchGame.SoundPool(3,ShapeCatchGame.SOUND.success);
				
				}

				soundmanager.prototype = {
					load : function (){
						var deferred = $.Deferred();
						
						var wait1 = this.failSounds.load();
						var wait2 = this.successSounds.load();
						$.when(wait1, wait2).done(function(){
						   deferred.resolve();
						});
						
						return deferred.promise();
					},
					play : function(sound) {

						switch(sound) {
							case ShapeCatchGame.SOUND.fail :
								this.failSounds.playOne();
								break;
							case ShapeCatchGame.SOUND.success :
								this.successSounds.playOne();
								break;
						}

					},
					checkReadyState : function() {
						if (this.failSounds.isReady() && this.successSounds.isReady()) {
							this.finishedLoading();
						}
					}
				};

				return soundmanager;
			}());

		return ShapeCatchGame;
	}(window.ShapeCatchGame || {}));
