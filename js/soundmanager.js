/**
 * @author Stefan Dienst
 */
ShapeCatchGame = window.ShapeCatchGame || {}; 
( function(ShapeCatchGame) {
"use strict";
	
	ShapeCatchGame.SOUND = {
		fail : "sound/doh.mp3",
		success: "sound/success.mp3"
		
	};
	
	ShapeCatchGame.SoundManager = (function () {
		
		function soundmanager () {
			
			this.failSound = $("#fail")[0];
			this.successSound = $("#success")[0];
				
		}
		soundmanager.prototype = {
			
			play : function (sound)
			{
				var soundToPlay = new Audio(sound);
				/*switch(sound)
				{
					case ShapeCatchGame.SOUND.fail : soundToPlay = this.failSound; break;
					case ShapeCatchGame.SOUND.success : soundToPlay = this.successSound; break;
					
				}*/
				if(soundToPlay !== null) {
					//soundToPlay.currentTime = 0;
					soundToPlay.play();
				}
			}
			
		};
		
		
		return soundmanager;
	}());

	return ShapeCatchGame;
}(window.ShapeCatchGame || {})); 