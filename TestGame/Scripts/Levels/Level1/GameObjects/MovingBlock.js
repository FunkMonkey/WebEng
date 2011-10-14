
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/Levels/Level1/GameObjects/MovingBlock", function(require, exports, module){
	
	var BoxWithPhysics = require("/TestGame/Scripts/GameObjects/BoxWithPhysics");
	var Plugin_LogicDarkSoul = require("/TestGame/Scripts/GameObjects/DarkSoul").Plugin_LogicDarkSoul;
	
	/**
	 * Plugin_LogicMovingBlock: Plugin for adding gamelogic of the moving block to a gameobject
	 */
	function Plugin_LogicMovingBlock()
	{
		this._tmpPos = new PhysicsCore.b2Vec2;
		this._tmpVel = new (PhysicsCore.b2Vec2)(0, -1);
	}
	
	Plugin_LogicMovingBlock.prototype = {
		constructor: Plugin_LogicMovingBlock,
		
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
			this.fixDef.shape.SetAsBox(this.gameObj.size.x / 2.0 * 0.95, this.gameObj.size.y / 2.0);
			
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
			
			this.bigBody = this.gameObj.pluginPhysics.body;
			this.bigBody.SetLinearVelocity(this._tmpVel);
			
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
		},
		
		/**
		 * Updates the plugin
		 * 
		 * @param   {number} dt Time since last frame (in s)
		 */
		update: function update(dt)
		{
			if(this.gameObj.pos.y > 4.5)
			{
				this._tmpVel.y = -2;
				this.bigBody.SetLinearVelocity(this._tmpVel);
			}
			else if(this.gameObj.pos.y < 2)
			{
				this._tmpVel.y = 1;
				this.bigBody.SetLinearVelocity(this._tmpVel);
			}
			
			var pos = this.gameObj.pluginPhysics.body.GetPosition();
			this._tmpPos.x = pos.x;
			this._tmpPos.y = pos.y - 0.05;
			this.deathSensorBody.SetPosition(this._tmpPos);
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
	 * Creates a moving block with the given id
	 * 
	 * @param   {string} id    ID of the gameobject
	 * @param   {Object} data  Additional creation-data
	 * 
	 * @returns {BaseGameObject} A new moving block
	 */
	function create(id, data)
	{
		if(!data)
			data = {};
		
		data.physType = PhysicsCore.b2Body.b2_kinematicBody;
		var obj = BoxWithPhysics.createBoxWithPhysics(id, data);
		//obj.pluginPhysics.maskBits = 0xFFFD;
		obj.addPlugin(new Plugin_LogicMovingBlock());
		
		
		return obj;
	}
	
	
	exports.create = create;
});
