
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/Levels/Level1/GameObjects/FallingBlock", function(require, exports, module){
	
	var BoxWithPhysics = require("/TestGame/Scripts/GameObjects/BoxWithPhysics");
	
	function Plugin_LogicFallingBlock()
	{
		this.isFinished = false;
	}
	
	Plugin_LogicFallingBlock.prototype = {
		constructor: Plugin_LogicFallingBlock,
		
		onAddedTo: function onAddedTo(gameObj)
		{
			this.gameObj = gameObj;
			this.gameObj.pluginLogicFallingBlock = this;
		},
		
		postInit: function postInit()
		{
			var pluginPhysics = this.gameObj.pluginPhysics;
			
			this.fixDef = new (PhysicsCore.b2FixtureDef)();
			this.fixDef.isSensor = true;
			this.fixDef.shape = new (PhysicsCore.b2PolygonShape)();
			this.fixDef.shape.SetAsBox(pluginPhysics.size.x / 2.0 * 0.9, pluginPhysics.size.y / 2.0 * 1.1);
			
			this.bodyDef = new (PhysicsCore.b2BodyDef)();
			this.bodyDef.type = PhysicsCore.b2Body.b2_dynamicBody;
			this.bodyDef.position.x = this.gameObj.pos.x;
			this.bodyDef.position.y = this.gameObj.pos.y;
			this.bodyDef.angle = this.gameObj.rot.z;
			
			this.deathSensorBody = PhysicsCore.world.CreateBody(this.bodyDef);
			this.deathSensorBody.gameObj = this.gameObj;
			
			this.deathSensorFixture = this.deathSensorBody.CreateFixture(this.fixDef);
			this.deathSensorFixture.gameObj = this.gameObj;
			this.deathSensorFixture.deathZoneActive = true;
		},
		
		
		update: function update(dt)
		{
			if(this.isFinished)
				return;
			
			this.deathSensorBody.SetPosition(this.gameObj.pluginPhysics.body.GetPosition());
		},
		
	};
	
	
	function create(id, data)
	{
		if(!data)
			data = {};
			
		var obj = BoxWithPhysics.createBoxWithPhysics(id, data);
		obj.addPlugin(new Plugin_LogicFallingBlock());
		
		
		return obj;
	}
	
	
	exports.create = create;
});
