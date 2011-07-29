"use strict";


ModuleSystem.registerModule(function(){
	
	var AudioCore = {
		
		init: function init()
		{
		},
		
		/*
		 *
		 */
		destroy: function destroy()
		{
			
		},
		
		/*
		 *
		 */
		update: function update(dt)
		{

		},
		
		createAudio: function createAudio(path, callback)
		{
			// TODO: error handling
			
			var audio = new Audio();
			audio.onload = function () {
				callback(audio);
			};
			
			audio.src = path;
			//this.images[path] = image;
		},

		
	};
	

	return {AudioCore: AudioCore};
	
});