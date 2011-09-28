
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/GameObjects/DeathZone", function(require, exports, module){
	
	var BoxWithPhysics = require("BoxWithPhysics");
	
	function newPostInit()
	{
		this.pluginPhysics.fixture.deathZoneActive = true;
		this._postInit();
	}
	
	function create(id, data)
	{
		if(!data)
			data = {};
			
		//data.noGraphics = true;
		data.color = GraphicsCore.Color.fromPool(1, 0, 0, 1);
		data.isSensor = true;
		data.isStatic = true;
		
		var obj = BoxWithPhysics.createBoxWithPhysics(id, data);
		obj._postInit = obj.postInit;
		obj.postInit = newPostInit;
		
		return obj;
	}
	
	
	exports.create = create;
});
