"use strict";

ModuleSystem.registerModule("Engine/Physics/Plugin_PhysicsBox", function(require, exports){
	
	var PhysicsCore = null;
	
	function Plugin_PhysicsBox(gameObj)
	{
		this.gameObj = gameObj;
		gameObj.pluginPhysics = this;
		this.density = 1.0;
		this.friction = 1.0;
		this.restitution = 0.2;
		this.isStatic = false;
		this.size = Vector3.fromPool(1, 1, 0);
	}
	
	Plugin_PhysicsBox.prototype = {
		constructor: Plugin_PhysicsBox,
		
		init: function init()
		{
			this.fixDef = new (PhysicsCore.b2FixtureDef)();
			this.fixDef.density = this.density;
			this.fixDef.friction = this.friction;
			this.fixDef.restitution = this.restitution;
			this.fixDef.shape = new (PhysicsCore.b2PolygonShape)();
			this.fixDef.shape.SetAsBox(this.size.x / 2.0, this.size.y / 2.0);
			
			this.bodyDef = new (PhysicsCore.b2BodyDef)();
			this.bodyDef.type = (this.isStatic === true) ? PhysicsCore.b2Body.b2_staticBody : PhysicsCore.b2Body.b2_dynamicBody;
			this.bodyDef.position.x = this.gameObj.pos.x;
			this.bodyDef.position.y = this.gameObj.pos.y;
			this.bodyDef.angle = this.gameObj.rot.z;
			
			this.body = PhysicsCore.world.CreateBody(this.bodyDef)
			this.fixture = this.body.CreateFixture(this.fixDef);
		},
		
		update: function update(dt)
		{
			var physPos = this.body.GetPosition();
			this.gameObj.pos.x = physPos.x;
			this.gameObj.pos.y = physPos.y;
			this.gameObj.rot.z = this.body.GetAngle();
		},
		
		
		destroy: function destroy()
		{
			/* todo: remove from PhysicsCore */
		},
		
	};

	
	Plugin_PhysicsBox.initModule = function initModule(physicsCore)
		{
			PhysicsCore = physicsCore;
		}
	
	exports.Plugin_PhysicsBox = Plugin_PhysicsBox;
	
});