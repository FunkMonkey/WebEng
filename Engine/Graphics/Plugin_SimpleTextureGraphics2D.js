"use strict";

ModuleSystem.registerModule("Engine/Graphics/Plugin_SimpleTextureGraphics2D", function(require, exports){
	
	var gl = null;
	var GraphicsCore = null;
	var zAxis = [0, 0, 1];
	
	/**
	 * Plugin_SimpleTextureGraphics2D: Plugin for adding a textured graphical
	 * representation to a gameobject
	 */
	function Plugin_SimpleTextureGraphics2D()
	{
		this.textureID = "";
		this.isVisible = true;
		this.width = 0;
		this.height = 0;
	}
	
	Plugin_SimpleTextureGraphics2D.prototype = {
		constructor: Plugin_SimpleTextureGraphics2D,
		
		pixelToWorldScaleFactor: 0.01,
		
		/**
		 * Called, when plugin was added to a gameobject
		 * 
		 * @param   {BaseGameObject} gameObj The gameobject
		 */
		onAddedTo: function onAddedTo(gameObj)
		{
			this.gameObj = gameObj;
			this.gameObj.pluginGraphics = this;
		},
		
		/**
		 * Loads the plugins resources (asynchron)
		 * 
		 * @param   {function} callback Function to call when resources have been loaded
		 */
		loadResources: function loadResources(callback)
		{
			/* Textures */			
			GraphicsCore.TextureManager.createTexture(this.textureID, (function(texture){
					this.texture = texture;
					callback(this);
				}).bind(this));
		},
		
		/**
		 * Initializes the plugin
		 */
		init: function init()
		{
			GraphicsCore.addDrawableObject(this);
			
			this.shaderProgram = GraphicsCore.stdTextureShaderProgram;
			
			if(this.width === 0)
			{
				if(this.height === 0)
				{
					this.width = this.gameObj.size.x;
					this.height = this.gameObj.size.y;
				}
				else
					this.width = this.height * this.texture.ratio;
			}
			else if(this.height === 0)
				this.height = this.width / this.texture.ratio;
			
			
			/* Vertices */
			
			var vertices = 	[
						-this.width / 2.0,  this.height / 2.0,  0.0,
						 this.width / 2.0,  this.height / 2.0,  0.0,
						-this.width / 2.0, -this.height / 2.0,  0.0,
						 this.width / 2.0, -this.height / 2.0,  0.0
					];
			
			this.vertexPosBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
			
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			this.vertexPosBuffer.itemSize = 3;
			this.vertexPosBuffer.numItems = 4; 
		},
		
		_tmpFinalPos: Vector3.fromPool(),
		
		/**
		 * Draws the plugin
		 * 
		 * @param   {number} dt Time since last frame (in s)
		 */
		draw: function draw(dt)
		{
			if(!this.isVisible)
				return;
			
			this.shaderProgram.use();
			
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
		
		/**
		 * Updates the plugin
		 * 
		 * @param   {number} dt Time since last frame (in s)
		 */
		destroy: function destroy()
		{
			GraphicsCore.removeDrawableObject(this);
		},
	};

	
	Plugin_SimpleTextureGraphics2D.initModule = function initModule(graphicsCore)
		{
			gl = graphicsCore.gl;
			GraphicsCore = graphicsCore;
			
		}
	
	exports.Plugin_SimpleTextureGraphics2D = Plugin_SimpleTextureGraphics2D;
	
});