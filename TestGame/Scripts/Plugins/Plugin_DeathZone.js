"use strict";

ModuleSystem.registerModule("TestGame/Scripts/Plugins/Plugin_DeathZone", function(require, exports){
	
	function Plugin_DeathZone()
	{
	}
	
	
	Plugin_DeathZone.prototype = {
		constructor: Plugin_DeathZone,
		
		onAddedTo: function onAddedTo(gameObj)
		{
			this.gameObj = gameObj;
			this.gameObj.pluginDeathZone = this;
		},
	};

	exports.Plugin_DeathZone = Plugin_DeathZone;
	
});