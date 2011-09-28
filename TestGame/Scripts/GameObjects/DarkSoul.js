
"use strict";

ModuleSystem.registerModule("TestGame/Scripts/GameObjects/DarkSoul", function(require, exports, module){
	
	var BaseGameObject = require("/GameCore/BaseGameObject").BaseGameObject;
	var Plugin_WorldObject3D = require("/GameCore/Plugin_WorldObject3D").Plugin_WorldObject3D;
	var Plugin_Pickable = require("/TestGame/Scripts/Plugins/Plugin_Pickable").Plugin_Pickable;
	
	function Plugin_LogicDarkSoul()
	{
		this.maxOwnVelocityX = 1;
		this.dir = 1;
		this.picked = false;
		this._dead = false;
		this.isDarkSoul = true;
		
		
		this.timeTillDrop = 1500;
		this.timeTillRePick = 1000;
		this.timePicked = 0;
		this.timeDropped = 0;
	}
	
	Plugin_LogicDarkSoul.prototype = {
		constructor: Plugin_LogicDarkSoul,
		
		onAddedTo: function onAddedTo(gameObj)
		{
			this.gameObj = gameObj;
			this.gameObj.pluginLogicDarkSoul = this;
		},
		
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
		
		postInit: function postInit()
		{
			this.physBody = this.gameObj.pluginPhysics.body;
			this.physFixture = this.gameObj.pluginPhysics.fixture;
			
			this.physFixture.pluginDarkSoul = this;
			if(!this.physFixture.gameObj)
				this.physFixture.gameObj = this.gameObj;
			this.physFixture.onBeginContact = this.onBeginContact;
		},
		
		onBeginContact: function onBeginContact(me, other)
		{
			//log("contact: " + other.gameObj.id)
			if(other.deathZoneActive && !me.gameObj.pluginLogicDarkSoul.dead)
				me.gameObj.pluginLogicDarkSoul.dead = true;
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
		
		_tmpImpulse: new PhysicsCore.b2Vec2(),
		update: function update(dt)
		{
			if(this.dead)
				return;
			
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
				if(!this.dead && now - this.timePicked > this.timeTillDrop)
					this.gameObj.pluginPickable.drop();
			}
		}
		
	};
	
	function createDarkSoul(id, data)
	{
		if(!data)
			data = {};
		
		if(!data.size)
			data.size = Vector3.fromPool(1, 1, 0);
					
		var obj = new BaseGameObject(id);
		
		// world-object
		obj.addPlugin(new Plugin_WorldObject3D());
		if(data.pos)
			obj.pos = data.pos;
		
		// logic
		obj.addPlugin(new Plugin_LogicDarkSoul());
		
		// physics
		obj.addPlugin(new PhysicsCore.Plugin_PhysicsBox());
		obj.pluginPhysics.size.x = data.size.x;
		obj.pluginPhysics.size.y = data.size.y;
		
		// pickable
		obj.addPlugin(new Plugin_Pickable());
		
		// graphics
		obj.addPlugin(new GraphicsCore.Plugin_SimpleColorGraphics2D());
		if(data.color)
			obj.pluginGraphics.color = data.color;
			
		obj.pluginGraphics.width = data.size.x;
		obj.pluginGraphics.height = data.size.y;
		
		return obj;
	}
	
	
	exports.createDarkSoul = createDarkSoul;
});
