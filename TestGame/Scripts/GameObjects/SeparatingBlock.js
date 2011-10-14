
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/GameObjects/SeparatingBlock", function(require, exports, module){
	
	var BoxWithPhysics = require("/TestGame/Scripts/GameObjects/BoxWithPhysics");
	var Plugin_Pickable = require("/TestGame/Scripts/Plugins/Plugin_Pickable").Plugin_Pickable;
	var Plugin_LogicDarkSoul = require("/TestGame/Scripts/GameObjects/DarkSoul").Plugin_LogicDarkSoul;
	
	/**
	 * Plugin_LogicSeparatingBlock: Plugin for adding gamelogic of a blocker to a gameobject
	 */
	function Plugin_LogicSeparatingBlock()
	{
		this._tmpPos = new (PhysicsCore.b2Vec2)();
	}
	
	Plugin_LogicSeparatingBlock.prototype = {
		constructor: Plugin_LogicSeparatingBlock,
		
		/**
		 * Called, when plugin was added to a gameobject
		 * 
		 * @param   {BaseGameObject} gameObj The gameobject
		 */
		onAddedTo: function onAddedTo(gameObj)
		{
			this.gameObj = gameObj;
			this.gameObj.pluginLogicSeparatingBlock = this;
		},
		
		/**
		 * Second initiliaze call
		 */
		postInit: function postInit()
		{
			this.fixDef = new (PhysicsCore.b2FixtureDef)();
			this.fixDef.shape = new (PhysicsCore.b2PolygonShape)();
			this.fixDef.shape.SetAsBox(this.gameObj.size.x / 2.0, this.gameObj.size.y / 2.0);
			this.fixDef.filter.maskBits = 0x0002;
			
			this.bodyDef = new (PhysicsCore.b2BodyDef)();
			this.bodyDef.type = PhysicsCore.b2Body.b2_staticBody;
			this.bodyDef.position.x = this.gameObj.pos.x;
			this.bodyDef.position.y = this.gameObj.pos.y;
			this.bodyDef.angle = this.gameObj.rot.z;
			
			this.staticBody = PhysicsCore.createBody(this.bodyDef);
			this.staticFixture = this.staticBody.CreateFixture(this.fixDef);
		},
		
		/**
		 * Updates the plugin
		 * 
		 * @param   {number} dt Time since last frame (in s)
		 */
		update: function update(dt)
		{
			this._tmpPos.x = this.gameObj.pos.x;
			this._tmpPos.y = this.gameObj.pos.y;
			this.staticBody.SetPosition(this._tmpPos);
			this.staticBody.SetAngle(this.gameObj.rot.z);
		},
		
		/**
		 * Destroys the plugin
		 */
		destroy: function destroy()
		{
			PhysicsCore.destroyBody(this.staticBody)
		},
		
	};
	
	/**
	 * Creates a blocker (separating block) with the given id
	 * 
	 * @param   {string} id    ID of the gameobject
	 * @param   {Object} data  Additional creation-data
	 * 
	 * @returns {BaseGameObject} A new blocker
	 */
	function create(id, data)
	{
		if(!data)
			data = {};
			
		var obj = BoxWithPhysics.createBoxWithPhysics(id, data);
		obj.pluginPhysics.maskBits = 0xFFFD;
		
		// pickable
		obj.addPlugin(new Plugin_Pickable());
		
		obj.addPlugin(new Plugin_LogicSeparatingBlock());
		
		
		return obj;
	}
	
	
	exports.create = create;
});
