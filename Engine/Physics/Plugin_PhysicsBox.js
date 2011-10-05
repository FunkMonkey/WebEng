"use strict";

ModuleSystem.registerModule("Engine/Physics/Plugin_PhysicsBox", function(require, exports){
	
	var PhysicsCore = null;
	
	function Plugin_PhysicsBox()
	{
		this.density = 1.0;
		this.friction = 1.0;
		this.restitution = 0.2;
		this.isStatic = false;
		this.isSensor = false;
		//this.size = Vector3.fromPool(1, 1, 0);
	}
	
	Plugin_PhysicsBox.prototype = {
		constructor: Plugin_PhysicsBox,
		
		onAddedTo: function onAddedTo(gameObj)
		{
			this.gameObj = gameObj;
			this.gameObj.pluginPhysics = this;
		},
		
		
		init: function init()
		{
			this.fixDef = new (PhysicsCore.b2FixtureDef)();
			this.fixDef.density = this.density;
			this.fixDef.friction = this.friction;
			this.fixDef.restitution = this.restitution;
			this.fixDef.isSensor = this.isSensor;
			this.fixDef.shape = new (PhysicsCore.b2PolygonShape)();
			this.fixDef.shape.SetAsBox(this.gameObj.size.x / 2.0, this.gameObj.size.y / 2.0);
			
			this.bodyDef = new (PhysicsCore.b2BodyDef)();
			this.bodyDef.type = (this.isStatic === true) ? PhysicsCore.b2Body.b2_staticBody : PhysicsCore.b2Body.b2_dynamicBody;
			this.bodyDef.position.x = this.gameObj.pos.x;
			this.bodyDef.position.y = this.gameObj.pos.y;
			this.bodyDef.angle = this.gameObj.rot.z;
			
			this.body = PhysicsCore.createBody(this.bodyDef);
			this.body.gameObj = this.gameObj;
			
			this.fixture = this.body.CreateFixture(this.fixDef);
			this.fixture.gameObj = this.gameObj;
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
			PhysicsCore.destroyBody(this.body);
		},
		
	};

	
	Plugin_PhysicsBox.initModule = function initModule(physicsCore)
		{
			PhysicsCore = physicsCore;
		}
	
	exports.Plugin_PhysicsBox = Plugin_PhysicsBox;
	
});