
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/Levels/Level1/GameObjects/FallingBlock", function(require, exports, module){
	
	var BoxWithPhysics = require("/TestGame/Scripts/GameObjects/BoxWithPhysics");
	var Plugin_LogicDarkSoul = require("/TestGame/Scripts/GameObjects/DarkSoul").Plugin_LogicDarkSoul;
	
	/**
	 * Plugin_LogicFallingBlock: Plugin for adding gamelogic of the falling block to a gameobject
	 */
	function Plugin_LogicFallingBlock()
	{
		this.state = "start";
		this.isFinished = false;
		this.timeTillFall = 2;
		this._tmpPos = new PhysicsCore.b2Vec2;
	}
	
	Plugin_LogicFallingBlock.prototype = {
		constructor: Plugin_LogicFallingBlock,
		
		/**
		 * Called, when plugin was added to a gameobject
		 * 
		 * @param   {BaseGameObject} gameObj The gameobject
		 */
		onAddedTo: function onAddedTo(gameObj)
		{
			this.gameObj = gameObj;
			this.gameObj.pluginLogicFallingBlock = this;
		},
		
		/**
		 * Second initiliaze call
		 */
		postInit: function postInit()
		{
			this.fixDef = new (PhysicsCore.b2FixtureDef)();
			this.fixDef.isSensor = true;
			this.fixDef.shape = new (PhysicsCore.b2PolygonShape)();
			this.fixDef.shape.SetAsBox(this.gameObj.size.x / 2.0 * 0.9, this.gameObj.size.y / 2.0);
			
			this.bodyDef = new (PhysicsCore.b2BodyDef)();
			this.bodyDef.type = PhysicsCore.b2Body.b2_dynamicBody;
			this.bodyDef.position.x = this.gameObj.pos.x;
			this.bodyDef.position.y = this.gameObj.pos.y;
			this.bodyDef.angle = this.gameObj.rot.z;
			
			this.deathSensorBody = PhysicsCore.createBody(this.bodyDef);
			this.deathSensorBody.gameObj = this.gameObj;
			
			this.deathSensorFixture = this.deathSensorBody.CreateFixture(this.fixDef);
			this.deathSensorFixture.gameObj = this.gameObj;
			this.deathSensorFixture.deathZoneActive = true;
			
			this.gameObj.pluginPhysics.fixture.onPreSolve = function(me, other, contact)
			{
				if(other.pluginDarkSoul)
				{
					var otherPos = other.gameObj.pos;
					var mePos = me.gameObj.pos;
					var meSize = me.gameObj.size;
					var otherSize = other.gameObj.size;
					if(otherPos.y < mePos.y && (otherPos.x + otherSize.x / 2.1) > (mePos.x - meSize.x/2.0) && (otherPos.x - otherSize.x / 2.1) < (mePos.x + meSize.x/2.0))
						contact.SetEnabled(false);
				}
			}
			
			this.posX = this.gameObj.pos.x - 0.5;
		},
		
		/**
		 * Updates the plugin
		 * 
		 * @param   {number} dt Time since last frame (in s)
		 */
		update: function update(dt)
		{
			if(this.isFinished)
				return;
			
			var pos = this.gameObj.pluginPhysics.body.GetPosition();
			this._tmpPos.x = pos.x;
			this._tmpPos.y = pos.y - 0.2;
			this.deathSensorBody.SetPosition(this._tmpPos);
			
			switch(this.state)
			{
				case "start":
				{
					this.gameObj.pluginPhysics.body.SetAwake(false);
					for(var i=0; i < Plugin_LogicDarkSoul.darksouls.length; ++i)
					{
						if(Plugin_LogicDarkSoul.darksouls[i].pos.x > this.posX)
						{
							this.state = "fall_initiated";
							log("initiated")
							break;
						}
					}
					
					break;
				}
				case "fall_initiated":
					{
						this.timeTillFall -= dt;
						if(this.timeTillFall < 0)
						{
							this.gameObj.pluginPhysics.body.SetAwake(true);
							this.state = "falling";
						}
						break;
					}
				case "falling":  break;
			}
		},
		
		/**
		 * Destroys the plugin
		 */
		destroy: function destroy()
		{
			PhysicsCore.destroyBody(this.deathSensorBody);
		},
		
	};
	
	/**
	 * Creates a falling block with the given id
	 * 
	 * @param   {string} id    ID of the gameobject
	 * @param   {Object} data  Additional creation-data
	 * 
	 * @returns {BaseGameObject} A new falling block
	 */
	function create(id, data)
	{
		if(!data)
			data = {};
			
		var obj = BoxWithPhysics.createBoxWithPhysics(id, data);
		//obj.pluginPhysics.maskBits = 0xFFFD;
		obj.addPlugin(new Plugin_LogicFallingBlock());
		
		
		return obj;
	}
	
	
	exports.create = create;
});
