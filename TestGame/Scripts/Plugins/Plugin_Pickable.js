"use strict";

ModuleSystem.registerModule("TestGame/Scripts/Plugins/Plugin_Pickable", function(require, exports){
	
	var EventThrower = require("/Engine/EventThrower").EventThrower;
	
	var updateCount = -1;
	var pos = null;
	var onMouseDown = null;
	var joint = null;
	
	function Plugin_Pickable(gameObj)
	{
		this.gameObj = gameObj;
		gameObj.pluginPickable = this;
		EventThrower.applyOn(this);
	}
	
	Plugin_Pickable.pickedBody = null;
	Plugin_Pickable.lastDropTime = 0;
	
	Plugin_Pickable.prototype = {
		constructor: Plugin_Pickable,
		
		init: function init()
		{
			if(!this.gameObj.pluginPhysics)
				throw "No physics-plugin detected"
			
			this.body = this.gameObj.pluginPhysics.body;
			this.fixture = this.gameObj.pluginPhysics.fixture;
			onMouseDown = InputCore.actions["OnMouseDown"];
		},
		
		update: function update(dt)
		{
			if(Game.updateCount !== updateCount)
			{
				pos = new PhysicsCore.b2Vec2(Game.mouseWorldPos.x, Game.mouseWorldPos.y);
				updateCount = Game.updateCount;
			}
				
			if(onMouseDown.isTriggered)
			{
				if(joint === null)
				{
					if(this.body.GetType() != PhysicsCore.b2Body.b2_staticBody && this.fixture.GetShape().TestPoint(this.body.GetTransform(), pos))
					{
						if(!this.fireCancelableEvent("prePick"))
							return;
						
						var md = new PhysicsCore.b2MouseJointDef();
						md.bodyA = PhysicsCore.world.GetGroundBody();
						md.bodyB = this.body;
						md.target.Set(pos.x, pos.y);
						md.collideConnected = true;
						md.maxForce = 300.0 * this.body.GetMass();
						joint = PhysicsCore.world.CreateJoint(md);
						this.body.SetAwake(true);
						Plugin_Pickable.pickedBody = this.body;
						this.fireEvent("picked");
					}
				}
				else if(Plugin_Pickable.pickedBody === this.body)
				{
					joint.SetTarget(pos);
				}
			}
			else if(joint !== null && Plugin_Pickable.pickedBody === this.body)
			{
				this.drop();
			}
		},
		
		/* 
		 * 
		 */
		drop: function drop()
		{
			this.fireEvent("preDrop");
			// destroy joint
			PhysicsCore.world.DestroyJoint(joint);
			joint = null;
			Plugin_Pickable.pickedBody = null;
			Plugin_Pickable.lastDropTime = Game.lastUpdate;
			this.fireEvent("dropped");
		},
		
		
		destroy: function destroy()
		{
			/* todo: remove from PhysicsCore */
		},
		
	};

	exports.Plugin_Pickable = Plugin_Pickable;
	
});