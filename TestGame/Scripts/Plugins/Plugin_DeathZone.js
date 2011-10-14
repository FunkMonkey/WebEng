"use strict";

ModuleSystem.registerModule("TestGame/Scripts/Plugins/Plugin_DeathZone", function(require, exports){
	
	/**
	 * Plugin_DeathZone: constructor function for the deathzone-plugin
	 */
	function Plugin_DeathZone()
	{
	}
	
	
	Plugin_DeathZone.prototype = {
		constructor: Plugin_DeathZone,
		
		/**
		 * Called, when plugin was added to a gameobject
		 * 
		 * @param   {BaseGameObject} gameObj The gameobject
		 */
		onAddedTo: function onAddedTo(gameObj)
		{
			this.gameObj = gameObj;
			this.gameObj.pluginDeathZone = this;
		},
	};

	exports.Plugin_DeathZone = Plugin_DeathZone;
	
});