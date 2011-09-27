
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/GameObjects/DarkSoul", function(require, exports, module){
	
	var BaseGameObject = require("/GameCore/BaseGameObject").BaseGameObject;
	var Plugin_WorldObject3D = require("/GameCore/Plugin_WorldObject3D").Plugin_WorldObject3D;
	var Plugin_Pickable = require("/TestGame/Scripts/Plugins/Plugin_Pickable").Plugin_Pickable;
	
	function Plugin_LogicDarkSoul(gameObj)
	{
		this.gameObj = gameObj;
		gameObj.pluginLogic = this;
		this.maxOwnVelocityX = 1;
		this.dir = 1;
		this.picked = false;
		this._dead = false;
		this.ran = Math.random();
		this.timeTillDrop = 1500;
		this.timeTillRePick = 1000;
		this.timePicked = 0;
		this.timeDropped = 0;
	}
	
	Plugin_LogicDarkSoul.prototype = {
		constructor: Plugin_LogicDarkSoul,
		
		get dead()
		{
			return this._dead;
		},
		
		set dead(val)
		{
			this._dead = val;
			if(val)
				Game.onDarkSoulDead();
		},
		
		init: function init()
		{
			this.cursor = Game.level.gameObjects["Cursor"];
			this.gameObj.pluginPickable.addEventListener("prePick", this.onPrePick.bind(this));
			this.gameObj.pluginPickable.addEventListener("picked", this.onPick.bind(this));
			this.gameObj.pluginPickable.addEventListener("dropped", this.onDrop.bind(this));
		},
		
		onPrePick: function onPrePick()
		{
			return (Engine.getTimeInMS() - this.timeDropped > this.timeTillRePick);
		},
		
		onPick: function onPick()
		{
			this.picked = true;
			this.timePicked = Engine.getTimeInMS();
		},
		
		
		onDrop: function onDrop()
		{
			this.picked = false;
			this.physBody.SetLinearVelocity(new PhysicsCore.b2Vec2(0, 0));
			this.timeDropped = Engine.getTimeInMS();
		},
		
		
		update: function update(dt)
		{
			// because physics are initialized after logic
			this.physBody = this.gameObj.pluginPhysics.body;
			this.update = this._update;
			
			this._update(dt);
		},
		
		
		_tmpImpulse: new PhysicsCore.b2Vec2(),
		_update: function _update(dt)
		{
			var vel = this.physBody.GetLinearVelocity();
			
			var xDiff = this.cursor.pos.x - this.gameObj.pos.x;
			this.dir = (xDiff > 0) ? 1 : -1;
			
			// if moving
			if(!this.picked && Math.abs(xDiff) > 0.1 && Math.abs(vel.x) < this.maxOwnVelocityX)
			{
				this._tmpImpulse.x = this.dir * this.physBody.GetMass() * (this.maxOwnVelocityX - Math.abs(vel.x));
				this._tmpImpulse.y = 0;
				this.physBody.ApplyImpulse(this._tmpImpulse, this.physBody.GetWorldCenter());
			}
			else if (this.picked)
			{
				var now = Engine.getTimeInMS();
				if(now - this.timePicked > this.timeTillDrop)
					this.gameObj.pluginPickable.drop();
			}
		}
		
	};
	
	function createDarkSoul(id, pos, size, color)
	{
		if(!size)
			size = Vector3.fromPool(1, 1, 0);
					
		var obj = new BaseGameObject(id);
		obj.addPlugin(new Plugin_WorldObject3D(obj));
		if(pos)
			obj.pos = pos;
		
		// logic
		obj.addPlugin(new Plugin_LogicDarkSoul(obj));
		
		// physics
		obj.addPlugin(new PhysicsCore.Plugin_PhysicsBox(obj));
		obj.pluginPhysics.size.x = size.x;
		obj.pluginPhysics.size.y = size.y;
		
		// pickable
		obj.addPlugin(new Plugin_Pickable(obj));
		
		// graphics
		obj.addPlugin(new GraphicsCore.Plugin_SimpleColorGraphics2D(obj));
		if(color)
			obj.pluginGraphics.color = color;
			
		obj.pluginGraphics.width = size.x;
		obj.pluginGraphics.height = size.y;
		
		return obj;
	}
	
	
	exports.createDarkSoul = createDarkSoul;
});
