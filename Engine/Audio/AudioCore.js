"use strict";


ModuleSystem.registerModule("Engine/Audio/AudioCore", function(require, exports){
	
	
	var AudioCore = {
		
		/**
		 * Initializes the AudioCore
		 */
		init: function init()
		{
		},
		
		/**
		 * Destroys the AudioCore
		 */
		destroy: function destroy()
		{
			
		},
		
		/**
		 * Updates the AudioCore
		 * 
		 * @param   {numbe} dt Time since last update
		 */
		update: function update(dt)
		{

		},
		
		/**
		 * Creates an AudioObject
		 * 
		 * @param   {string}   path     Path to audio-file
		 * @param   {functin}  callback Callback, when file was loaded
		 */
		createAudio: function createAudio(path, callback)
		{
			// TODO: error handling
			
			var audio = new Audio();
			audio.addEventListener("canplaythrough", function (event) {
				
				if(!audio.canPlayThroughFired)
				{
					audio.canPlayThroughFired = true;
					callback(audio);
				}
			}, true);
			
			audio.addEventListener("error", function(){
				log("error");
			}, true);
			
			audio.src = path;
		},

		
	};
	

	exports.AudioCore = AudioCore;
	
});