"use strict";

ModuleSystem.registerModule("Engine/Graphics/Plugin_SimpleTextureGraphics2D", function(require, exports){
	
	var gl = null;
	var GraphicsCore = null;
	var zAxis = [0, 0, 1];
	
	// TODO: rename to Plugin_SimpleGraphicsObject
	
	function Plugin_SimpleTextureGraphics2D(gameObj)
	{
		this.gameObj = gameObj;
		gameObj.pluginGraphics = this;
	}
	
	Plugin_SimpleTextureGraphics2D.prototype = {
		constructor: Plugin_SimpleTextureGraphics2D,
		
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
			
			this.shaderProgram = GraphicsCore.stdTextureShaderProgram;
			
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
		
		_tmpFinalPos: Vector3.fromPool(),
		
		draw: function draw(dt)
		{
			var mvMatrix = GraphicsCore.mvMatrix;
			
			mat4.identity(mvMatrix);
			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.uniform1i(this.shaderProgram.samplerUniform, 0);
			
			this._tmpFinalPos.x = GraphicsCore.camera.pos.x + this.gameObj.pos.x;
			this._tmpFinalPos.y = GraphicsCore.camera.pos.y + this.gameObj.pos.y;
			this._tmpFinalPos.z = GraphicsCore.camera.pos.z + this.gameObj.pos.z;
			
			mat4.translate(mvMatrix, this._tmpFinalPos);
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

	
	Plugin_SimpleTextureGraphics2D.initModule = function initModule(graphicsCore)
		{
			gl = graphicsCore.gl;
			GraphicsCore = graphicsCore;
			
		}
	
	exports.Plugin_SimpleTextureGraphics2D = Plugin_SimpleTextureGraphics2D;
	
});