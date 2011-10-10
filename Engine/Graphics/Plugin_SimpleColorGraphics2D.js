"use strict";

ModuleSystem.registerModule("Engine/Graphics/Plugin_SimpleColorGraphics2D", function(require, exports){
	
	var gl = null;
	var GraphicsCore = null;
	var zAxis = [0, 0, 1];
	
	function Plugin_SimpleColorGraphics2D()
	{
		this.color = GraphicsCore.Color.fromPool();
		this.isVisible = true;
	}
	
	Plugin_SimpleColorGraphics2D.prototype = {
		constructor: Plugin_SimpleColorGraphics2D,
		
		onAddedTo: function onAddedTo(gameObj)
		{
			this.gameObj = gameObj;
			this.gameObj.pluginGraphics = this;
		},
		
		//pixelToWorldScaleFactor: 0.01,
		
		//loadResources: function loadResources(callback)
		//{
		//	callback(this);
		//},
		

		init: function init()
		{
			GraphicsCore.addDrawableObject(this);
			
			this.shaderProgram = GraphicsCore.stdColorShaderProgram;
			
			/* Vertices */
			
			var vertices = 	[
						-this.gameObj.size.x / 2.0,  this.gameObj.size.y / 2.0,  0.0,
						 this.gameObj.size.x / 2.0,  this.gameObj.size.y / 2.0,  0.0,
						-this.gameObj.size.x / 2.0, -this.gameObj.size.y / 2.0,  0.0,
						 this.gameObj.size.x / 2.0, -this.gameObj.size.y / 2.0,  0.0
					];
			
			this.vertexPosBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
			
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			this.vertexPosBuffer.itemSize = 3;
			this.vertexPosBuffer.numItems = 4;
		},
		
		_tmpFinalPos: Vector3.fromPool(),
		
		draw: function draw(dt)
		{
			if(!this.isVisible)
				return;
			
			this.shaderProgram.use();
			
			var mvMatrix = GraphicsCore.mvMatrix;
			
			mat4.identity(mvMatrix);
			
			this._tmpFinalPos.x = GraphicsCore.camera.pos.x + this.gameObj.pos.x;
			this._tmpFinalPos.y = GraphicsCore.camera.pos.y + this.gameObj.pos.y;
			this._tmpFinalPos.z = GraphicsCore.camera.pos.z + this.gameObj.pos.z;
			
			mat4.translate(mvMatrix, this._tmpFinalPos);
			mat4.rotate(mvMatrix, this.gameObj.rot[2], zAxis)
			mat4.scale(mvMatrix, this.gameObj.scale);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
			gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
			
			// setting color
			this.shaderProgram.color = this.color._color;
			
			// setting projection and modelview matrix
			this.shaderProgram.pMatrix = GraphicsCore.pMatrix;
			this.shaderProgram.mvMatrix = mvMatrix;
			
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertexPosBuffer.numItems);
		},
		
		destroy: function destroy()
		{
			GraphicsCore.removeDrawableObject(this);
		},
		
	};

	
	Plugin_SimpleColorGraphics2D.initModule = function initModule(graphicsCore)
		{
			gl = graphicsCore.gl;
			GraphicsCore = graphicsCore;
			
		}
	
	exports.Plugin_SimpleColorGraphics2D = Plugin_SimpleColorGraphics2D;
	
});