
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/GameObjects/WinZone", function(require, exports, module){
	
	var BoxWithPhysics = require("BoxWithPhysics");
	var Plugin_LogicDarkSoul = require("/TestGame/Scripts/GameObjects/DarkSoul").Plugin_LogicDarkSoul;
	
	function newPostInit()
	{
		this.pluginPhysics.fixture.souls = [];
		this.pluginPhysics.fixture.onBeginContact = function onBeginContact(me, other, contact)
		{
			if(other.pluginDarkSoul)
			{
				var found = false
				for(var i = 0; i < me.souls.length; ++i)
				{
					if(me.souls[i] === other.gameObj)
						found = true;
				}
				
				if(!found)
					me.souls.push(other.gameObj);
					
				if(Plugin_LogicDarkSoul.darksouls.length === me.souls.length && !me.won)
				{
					me.won = true;
					Game.onWin();
				}
			}
		}
		this._postInit();
	}
	
	/**
	 * Creates a WinZone with the given id
	 * 
	 * @param   {string} id    ID of the gameobject
	 * @param   {Object} data  Additional creation-data
	 * 
	 * @returns {BaseGameObject} A new deathzone
	 */
	function create(id, data)
	{
		if(!data)
			data = {};
			
		data.noGraphics = true;
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
