
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
			if(!val)
				Game.onDarkSoulDead();
		},
		
		init: function init()
		{
			this.cursor = Game.level.gameObjects["Cursor"];
			this.gameObj.pluginPickable.addEventListener("dropped", this.onDrop.bind(this));
		},
		
		onPick: function onPick()
		{
			this.picked = true;
		},
		
		
		onDrop: function onDrop()
		{
			this.picked = false;
			this.physBody.SetLinearVelocity(new PhysicsCore.b2Vec2(0, 0));
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
		}
		
	};
	
	function createDarkSoul(id, pos, size, color)
	{
		if(!size)
			size = Vector3.fromPool(1, 1, 0);
					
		var obj = new BaseGameObject();
		obj.addPlugin(new Plugin_WorldObject3D(obj));
		if(pos)
			obj.pos = pos;
			
		obj.addPlugin(new Plugin_LogicDarkSoul(obj));
		
		obj.addPlugin(new PhysicsCore.Plugin_PhysicsBox(obj));
		obj.pluginPhysics.size.x = size.x;
		obj.pluginPhysics.size.y = size.y;
		
		obj.addPlugin(new Plugin_Pickable(obj));
		
		obj.addPlugin(new GraphicsCore.Plugin_SimpleColorGraphics2D(obj));
		if(color)
			obj.pluginGraphics.color = color;
			
		obj.pluginGraphics.width = size.x;
		obj.pluginGraphics.height = size.y;
		
		return obj;
	}
	
	
	exports.createDarkSoul = createDarkSoul;
});
