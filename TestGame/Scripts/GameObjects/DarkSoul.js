
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
		
		this.jumpImpulseFactor = new (PhysicsCore.b2Vec2)(0, 0.2);
		this.jumpTorque = 0.4;
		this.moveTorque = 0.2;
		this.minTimeSinceLastJump = 1;
		this.timeSinceLastJump = 0;
		
		this.loneDeadTimeToDie = 2;
		this._loneDeadStartTime = 0;
		this._loneDeadStarted = false;
	}
	
	Plugin_LogicDarkSoul.darksouls = [];
	Plugin_LogicDarkSoul.maxDistToCursor = 0;
	
	Plugin_LogicDarkSoul.prototype = {
		constructor: Plugin_LogicDarkSoul,
		
		deathRange: 9,
		
		onAddedTo: function onAddedTo(gameObj)
		{
			this.gameObj = gameObj;
			this.gameObj.pluginLogicDarkSoul = this;
			Plugin_LogicDarkSoul.darksouls.push(this.gameObj);
		},
		
		get dead()
		{
			return this._dead;
		},
		
		set dead(val)
		{
			this._dead = val;
			if(val)
			{
				Game.onDarkSoulDead();
				this.gameObj.pluginGraphics.texture = this.deadTexture;
			}
		},
		
		loadResources: function loadResources(callback)
		{
			GraphicsCore.TextureManager.createTexture("TestGame/Content/darksoul_dead.png", (function(texture){
					this.deadTexture = texture;
					callback(this);
				}).bind(this));
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
		_tmpJumpImpulse: new PhysicsCore.b2Vec2(),
		update: function update(dt)
		{
			if(this.dead)
				return;
			
			this._distToCursor = this.gameObj.pos.distanceTo(this.cursor.pos);
			if(this._distToCursor > Plugin_LogicDarkSoul.maxDistToCursor)
				Plugin_LogicDarkSoul.maxDistToCursor = this._distToCursor;
					
			if(this._distToCursor > this.deathRange)
			{
				if(this._loneDeadStarted)
				{
					if(Game.lastUpdateInS - this._loneDeadStartTime > this.loneDeadTimeToDie)
						this.dead = true;
				}
				else
				{
					this._loneDeadStartTime = Game.lastUpdateInS;
					this._loneDeadStarted = true;
					log("death sequence initiated");
				}
			}
			else
			{
				if(this._loneDeadStarted)
				{
					this._loneDeadStarted = false;
				}
			}
			
			var vel = this.physBody.GetLinearVelocity();
			
			var xDiff = this.cursor.pos.x - this.gameObj.pos.x;
			this.dir = (xDiff > 0) ? 1 : -1;
			
			// if moving
			if(!this.picked)
			{
				if(Math.abs(xDiff) > 0.1)
				{
					if(Math.abs(vel.x) < this.maxOwnVelocityX)
					{
						this._tmpImpulse.x = this.dir * this.physBody.GetMass() * (this.maxOwnVelocityX - Math.abs(vel.x));
						this._tmpImpulse.y = 0;
						this.physBody.ApplyImpulse(this._tmpImpulse, this.physBody.GetWorldCenter());
						this.physBody.ApplyTorque(this.moveTorque * -this.dir);
					}
				}
				// random jump
				else
				{
					this.timeSinceLastJump += dt;
					if(this.timeSinceLastJump > this.minTimeSinceLastJump)
					{
						this._tmpJumpImpulse.x = this.dir * this.jumpImpulseFactor.x;
						this._tmpJumpImpulse.y = this.jumpImpulseFactor.y;
						this.physBody.ApplyImpulse(this._tmpJumpImpulse, this.physBody.GetWorldCenter());
						this.physBody.ApplyTorque(this.jumpTorque);
						this.timeSinceLastJump = 0;
					}
				}
			}
			else if (this.picked)
			{
				var now = Engine.getTimeInMS();
				if(!this.dead && now - this.timePicked > this.timeTillDrop)
					this.gameObj.pluginPickable.drop();
			}
		},
		
		destroy: function destroy()
		{
			for (var i=0; i < Plugin_LogicDarkSoul.darksouls.length; i++)
			{
				if(Plugin_LogicDarkSoul.darksouls[i] === this.gameObj)
				{
					Plugin_LogicDarkSoul.darksouls.splice(i, 1);
					break;
				}
			}
		},
		
		
	};
	
	function createDarkSoul(id, data)
	{
		if(!data)
			data = {};
		
		data.size = Vector3.fromPool(0.4, 0.4 * 37/40, 0);
					
		var obj = new BaseGameObject(id);
		
		// world-object
		obj.addPlugin(new Plugin_WorldObject3D());
		if(data.pos)
			obj.pos = data.pos;
		obj.size = data.size;
		
		// logic
		obj.addPlugin(new Plugin_LogicDarkSoul());
		
		// physics
		obj.addPlugin(new PhysicsCore.Plugin_PhysicsBox());
		obj.pluginPhysics.categoryBits = 0x0002;
		obj.pluginPhysics.maskBits = 0xFFFD;
		
		// pickable
		obj.addPlugin(new Plugin_Pickable());
		
		// graphics
		//obj.addPlugin(new GraphicsCore.Plugin_SimpleColorGraphics2D());
		//if(data.color)
		//	obj.pluginGraphics.color = data.color;
		
		obj.addPlugin(new GraphicsCore.Plugin_SimpleTextureGraphics2D());
		obj.pluginGraphics.textureID = "TestGame/Content/darksoul.png";
		//obj.pluginGraphics.width = data.size.x;
		//obj.pluginGraphics.width = data.size.y;
		
		
		return obj;
	}
	
	
	exports.createDarkSoul = createDarkSoul;
	exports.Plugin_LogicDarkSoul = Plugin_LogicDarkSoul;
});
