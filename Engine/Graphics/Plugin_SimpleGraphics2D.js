"use strict";

ModuleSystem.registerModule(function(){
	
	var gl = null;
	var GraphicsCore = null;
	var zAxis = [0, 0, 1];
	
	// TODO: rename to Plugin_SimpleGraphicsObject
	
	function Plugin_SimpleGraphics2D(gameObj)
	{
		this.gameObj = gameObj;
		gameObj.pluginGraphics = this;
	}
	
	Plugin_SimpleGraphics2D.prototype = {
		constructor: Plugin_SimpleGraphics2D,
		
		pixelToWorldScaleFactor: 0.01,
		
		loadResources: function loadResources(callback)
		{
			/* Textures */			
			GraphicsCore.TextureManager.createTexture(this.textureID, (function(texture){
					this.texture = texture;
					callback(this);
				}).bind(this));
		},
		

		init: function init()
		{
			GraphicsCore.addDrawableObject(this);
			
			this.shaderProgram = GraphicsCore.stdShaderProgram;
			
			var width = this.texture.width * this.pixelToWorldScaleFactor;
			var height = this.texture.height * this.pixelToWorldScaleFactor;
			this.width = width;
			this.height = height;
			
			/* Vertices */
			
			var vertices = 	[
						-width / 2.0,  height / 2.0,  0.0,
						 width / 2.0,  height / 2.0,  0.0,
						-width / 2.0, -height / 2.0,  0.0,
						 width / 2.0, -height / 2.0,  0.0
					];
			
			this.vertexPosBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
			
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			this.vertexPosBuffer.itemSize = 3;
			this.vertexPosBuffer.numItems = 4; 
		},
		
		draw: function draw(dt)
		{
			var mvMatrix = GraphicsCore.mvMatrix;
			
			mat4.identity(mvMatrix);
			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.uniform1i(this.shaderProgram.samplerUniform, 0);
	
			mat4.translate(mvMatrix, this.gameObj.pos);
			mat4.rotate(mvMatrix, this.gameObj.rot[2], zAxis)
			mat4.scale(mvMatrix, this.gameObj.scale);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
			gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, GraphicsCore.TextureManager.standardTexBuffer);
			gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, GraphicsCore.TextureManager.standardTexBuffer.itemSize, gl.FLOAT, false, 0, 0);

			// setting projection and modelview matrix
			this.shaderProgram.pMatrix = GraphicsCore.pMatrix;
			this.shaderProgram.mvMatrix = mvMatrix;
			
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertexPosBuffer.numItems);
		},
	};

	
	Plugin_SimpleGraphics2D.initModule = function initModule(graphicsCore)
		{
			gl = graphicsCore.gl;
			GraphicsCore = graphicsCore;
			
		}
	
	return {Plugin_SimpleGraphics2D: Plugin_SimpleGraphics2D};
	
});