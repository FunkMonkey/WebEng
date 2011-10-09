
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
			
			this.bodies = [];
			this.joints = [];
			
			/*this.contactCallbacks_1 = [];
			this.contactCallbacks_1.push({});
			this.contactCallbacks_1.push({});
			this.contactCallbacks_1.push({});
			this.contactCallbacks_1.push({});
			
			this.contactCallbacks_2 = [];
			this.contactCallbacks_2.push({});
			this.contactCallbacks_2.push({});
			this.contactCallbacks_2.push({});
			this.contactCallbacks_2.push({});*/
			
			this.world.SetContactListener(this.contactListener);
		},
		
		contactListener:
		{
			BeginContact: function BeginContact(contact)
			{
				var fixA = contact.GetFixtureA();
				var fixB = contact.GetFixtureB();
				
				if(fixA.onBeginContact)
					fixA.onBeginContact(fixA, fixB, contact);
					
				if(fixB.onBeginContact)
					fixB.onBeginContact(fixB, fixA, contact);
			},
			
			EndContact: function EndContact(contact)
			{
				var fixA = contact.GetFixtureA();
				var fixB = contact.GetFixtureB();
				
				if(fixA.onEndContact)
					fixA.onEndContact(fixA, fixB, contact);
					
				if(fixB.onEndContact)
					fixB.onEndContact(fixB, fixA, contact);
			},
			
			PreSolve: function PreSolve(contact, oldManifold)
			{
				var fixA = contact.GetFixtureA();
				var fixB = contact.GetFixtureB();
				
				if(fixA.onPreSolve)
					fixA.onPreSolve(fixA, fixB, contact, oldManifold);
					
				if(fixB.onPreSolve)
					fixB.onPreSolve(fixB, fixA, contact, oldManifold);
			},
			
			PostSolve: function PostSolve(contact, impulse)
			{
				var fixA = contact.GetFixtureA();
				var fixB = contact.GetFixtureB();
				
				if(fixA.onPostSolve)
					fixA.onPostSolve(fixA, fixB, contact, impulse);
					
				if(fixB.onPostSolve)
					fixB.onPostSolve(fixB, fixA, contact, impulse);
			}
		},
		
		createBody: function createBody(bodyDef)
		{
			var body = this.world.CreateBody(bodyDef);
			this.bodies.push(body);
			
			return body;
		},
		

		destroyBody: function destroyBody(body)
		{
			this.world.DestroyBody(body);
			
			for(var i = 0; i < this.bodies.length; i++)
			{
				if(this.bodies[i] === body)
				{
					this.bodies.splice(i, 1);
					break;
				}
			}
		},
		
		createJoint: function createJoint(jointDef)
		{
			var joint = this.world.CreateJoint(jointDef);
			this.joints.push(joint);
			
			return joint;
		},

		destroyJoint: function destroyJoint(joint)
		{
			this.world.DestroyJoint(joint);
			
			for(var i = 0; i < this.joints.length; i++)
			{
				if(this.joints[i] === joint)
				{
					this.joints.splice(i, 1);
					break;
				}
			}
		},
		
		/* 
		 * 
		 */
		destroyAllBodiesAndJoints: function destroyAllBodiesAndJoints()
		{
			for(var i = 0; i < this.bodies.length; i++)
				this.world.DestroyBody(this.bodies[i]);
				
			this.bodies = [];
			
			for(var i = 0; i < this.joints.length; i++)
				this.world.DestroyJoint(this.joints[i]);
				
			this.joints = [];
		},
		
		/* 
		 * 
		 */
		destroy: function destroy()
		{
			this.destroyAllBodiesAndJoints();
		},
		
		BEGIN_CONTACT: 0,
		END_CONTACT: 1,
		PRE_SOLVE: 2,
		POST_SOLVE: 3,
		
		/* 
		 * 
		 */
		registerContactCallback: function registerContactCallback(fixture1, fixture2, type, callback)
		{
			//if(type !== this.BEGIN_CONTACT && type !== this.END_CONTACT && type !== this.PRE_SOLVE && type !== this.POST_SOLVE)
			//	throw "Unkwown Contact type";
			//	
			//if(!fixture1 && !fixture2)
			//	throw "No fixtures given";
			//
			//if(fixture1 && fixture2)
			//{
			//	if(fixture1.getID() > fixture2.getID())
			//	{
			//		var tmp = fixture1;
			//		fixture1 = fixture2;
			//		fixture2 = tmp;
			//	}
			//	
			//	var typeMap = this.contactCallbacks_2[type];
			//	
			//	if(!typeMap[fixture1.getID()])
			//		var id1_map = typeMap[fixture1.getID()] = {};
			//		
			//	if(!id1_map[fixture2.getID()])
			//		var id2_map = id1_map[fixture2.getID()] = [];
			//		
			//	id2_map.push(callback);
			//}
			//else
			//{
			//	var fixture = fixture1 || fixture2;
			//}
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
		
		/* 
		 * 
		 */
		initDebugDraw: function initDebugDraw(canvas)
		{
			// todo: put into physicscore
			this.debugDraw = new this.b2DebugDraw();
			this.debugDraw.canvas = canvas;
			this.debugDraw.context = this.debugDraw.canvas.getContext("2d")
			this.debugDraw.SetSprite(this.debugDraw.context);
			this.debugDraw.SetDrawScale(100.0);
			this.debugDraw.SetFillAlpha(0.5);
			this.debugDraw.SetLineThickness(1.0);
			this.debugDraw.SetFlags(this.b2DebugDraw.e_shapeBit | this.b2DebugDraw.e_jointBit);
			this.world.SetDebugDraw(this.debugDraw);
		},
		
		/* 
		 * 
		 */
		drawDebug: function drawDebug(dt)
		{
			//var lastTranslate = Vector3.fromPool(50,50);
			//
			//this.debugDraw.context.translate(lastTranslate.x, lastTranslate.y);
			this.world.DrawDebugData();
			//this.debugDraw.context.translate(-lastTranslate.x, -lastTranslate.y);
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