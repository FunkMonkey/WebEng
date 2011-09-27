
"use strict";

ModuleSystem.registerModule("Engine/Physics/PhysicsCore", function(require, exports, module){
	
	var   b2Vec2 = Box2D.Common.Math.b2Vec2
         	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
         	,	b2Body = Box2D.Dynamics.b2Body
         	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
         	,	b2Fixture = Box2D.Dynamics.b2Fixture
         	,	b2World = Box2D.Dynamics.b2World
         	,	b2MassData = Box2D.Collision.Shapes.b2MassData
         	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
         	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
         	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            ;
			
	b2Fixture.prototype.lastID = 0;
	
	b2Fixture.prototype._getID = function()
	{
		return this._id;
	}
	
	// create id on first call
	b2Fixture.prototype.getID = function()
	{
		this._id = ++(b2Fixture.prototype.lastID);
		this.getID = this._getID;
		return this._getID();
	}
	
	var PhysicsCore = {
		
		
		init: function init(gravity)
		{
			if(!gravity)
				gravity = new b2Vec2(0, -4.81);
			this.world = new b2World(gravity, true);
			
			this.contactCallbacks_BeginContact = {};
		},
		
		/* 
		 * 
		 */
		registerContactCallback: function registerContactCallback(fixture1, fixture2, type, callbackt)
		{
			if(!fixture1 && !fixture2)
				throw "No fixtures given";
			
			if(fixture1 && fixture2)
			{
				
			}
			else
			{
				var fixture = fixture1 || fixture2;
			}
		},
		
		update: function update(dt)
		{
			this.world.Step(
				dt//frame-rate
				//1/60
				,  10       //velocity iterations
				,  10       //position iterations
			);			
			this.world.ClearForces();
		},		
	};
	
	PhysicsCore.b2Vec2 = Box2D.Common.Math.b2Vec2
    PhysicsCore.b2BodyDef = Box2D.Dynamics.b2BodyDef
    PhysicsCore.b2Body = Box2D.Dynamics.b2Body
    PhysicsCore.b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    PhysicsCore.b2Fixture = Box2D.Dynamics.b2Fixture
    PhysicsCore.b2World = Box2D.Dynamics.b2World
    PhysicsCore.b2MassData = Box2D.Collision.Shapes.b2MassData
    PhysicsCore.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    PhysicsCore.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    PhysicsCore.b2DebugDraw = Box2D.Dynamics.b2DebugDraw
	PhysicsCore.b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
	
	PhysicsCore.Plugin_PhysicsBox = require("Plugin_PhysicsBox").Plugin_PhysicsBox;
	PhysicsCore.Plugin_PhysicsBox.initModule(PhysicsCore);
	
	exports.PhysicsCore = PhysicsCore;
});