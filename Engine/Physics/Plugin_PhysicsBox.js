"use strict";

ModuleSystem.registerModule("Engine/Physics/Plugin_PhysicsBox", function(require, exports){
	
	var PhysicsCore = null;
	
	/**
	 * Plugin_PhysicsBox: Plugin for adding a physical box to a gameobject
	 */
	function Plugin_PhysicsBox()
	{
		this.density = 1.0;
		this.friction = 1.0;
		this.restitution = 0.2;
		//this.isStatic = false;
		this.type = PhysicsCore.b2Body.b2_dynamicBody;
		this.isSensor = false;
		this.categoryBits = 0x0001;
		this.groupIndex = 0;
		this.maskBits = 0xFFFF;
		//this.size = Vector3.fromPool(1, 1, 0);
	}
	
	Plugin_PhysicsBox.prototype = {
		constructor: Plugin_PhysicsBox,
		
		/**
		 * Called, when plugin was added to a gameobject
		 * 
		 * @param   {BaseGameObject} gameObj The gameobject
		 */
		onAddedTo: function onAddedTo(gameObj)
		{
			this.gameObj = gameObj;
			this.gameObj.pluginPhysics = this;
		},
		
		/**
		 * Initializes the plugin
		 */
		init: function init()
		{
			this.fixDef = new (PhysicsCore.b2FixtureDef)();
			this.fixDef.density = this.density;
			this.fixDef.friction = this.friction;
			this.fixDef.restitution = this.restitution;
			this.fixDef.isSensor = this.isSensor;
			this.fixDef.shape = new (PhysicsCore.b2PolygonShape)();
			this.fixDef.shape.SetAsBox(this.gameObj.size.x / 2.0, this.gameObj.size.y / 2.0);
			this.fixDef.filter.categoryBits = this.categoryBits;
			this.fixDef.filter.groupIndex = this.groupIndex;
			this.fixDef.filter.maskBits = this.maskBits;
			
			this.bodyDef = new (PhysicsCore.b2BodyDef)();
			this.bodyDef.type = this.type;
			this.bodyDef.position.x = this.gameObj.pos.x;
			this.bodyDef.position.y = this.gameObj.pos.y;
			this.bodyDef.angle = this.gameObj.rot.z;
			
			this.body = PhysicsCore.createBody(this.bodyDef);
			this.body.gameObj = this.gameObj;
			
			this.fixture = this.body.CreateFixture(this.fixDef);
			this.fixture.gameObj = this.gameObj;
		},
		
		/**
		 * Updates the plugin
		 * 
		 * @param   {number} dt Time since last frame (in s)
		 */
		update: function update(dt)
		{
			var physPos = this.body.GetPosition();
			this.gameObj.pos.x = physPos.x;
			this.gameObj.pos.y = physPos.y;
			this.gameObj.rot.z = this.body.GetAngle();
		},
		
		/**
		 * Destroys the plugin
		 */
		destroy: function destroy()
		{
			PhysicsCore.destroyBody(this.body);
		},
		
	};

	/**
	 * Initialises this module
	 * 
	 * @param   {PhysicsCore} physicsCore The PhysicsCore
	 */
	Plugin_PhysicsBox.initModule = function initModule(physicsCore)
		{
			PhysicsCore = physicsCore;
		}
	
	// module exports
	exports.Plugin_PhysicsBox = Plugin_PhysicsBox;
	
});