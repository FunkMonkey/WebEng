"use strict";


ModuleSystem.registerModule("Engine/Graphics/GraphicsCore", function(require, exports){
	
	var gl = null;
	
	var Camera = require("Camera").Camera;
	
	var GraphicsCore = {
		
		canvas: null,
		
		vpWidth: 0,
		vpHeight: 0,
		vpHalfWidth: 0,
		vpHalfHeight: 0,
		
		orthoFactor: 100,
		orthoPixelToMeterRatio: 0.01,
		
		init: function init(canvas)
		{
			this.drawableObjects = [];
			
			// matrices
			this.mvMatrix = mat4.create();
			this.pMatrix = mat4.create();
			this.ipMatrix = mat4.create();
			
			// camera
			this.camera = new Camera();
			this.camera.pos.z = -10;
			
			this.canvas = canvas;
			//this._viewportSize = Vector2.getFromPool(this.canvas.width, this.canvas.height);
			//this._cameraPos = Vector2.getFromPool(0, 0);
			
			this.initWebGL();
			
			this.orthoFactor = 1000;
			
			//this.orthoPixelToMeterRatio = 1;
			//mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, this.pMatrix);
			//mat4.ortho(-this.vpWidth / this.orthoFactor / 2, this.vpWidth / this.orthoFactor / 2, -this.vpHeight / this.orthoFactor / 2, this.vpHeight / this.orthoFactor / 2, 0.1, 100.0, this.pMatrix);
			mat4.ortho(-this.vpHalfWidth * this.orthoPixelToMeterRatio, this.vpHalfWidth * this.orthoPixelToMeterRatio, -this.vpHalfHeight * this.orthoPixelToMeterRatio, this.vpHalfHeight * this.orthoPixelToMeterRatio, 0.1, 100.0, this.pMatrix);
			
			//mat4.ortho(-10, 10, -10, 10, 0.1, 100.0, this.pMatrix);
			mat4.inverse(this.pMatrix, this.ipMatrix);
			
			this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  		// Set clear color to black, fully opaque
			this.gl.clearDepth(1.0);                 		// Clear everything
			this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
			this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things
			this.gl.enable(gl.BLEND);
			this.gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			
			
			this.gl.enable(this.gl.TEXTURE_2D);
			
			this.ShaderManager.init(this);
			this.TextureManager.init(this);
			this.ShaderProgram.init(this);
			this.Plugin_SimpleTextureGraphics2D.initModule(this);
			this.Plugin_SimpleColorGraphics2D.initModule(this);
			
			this.stdTextureShaderProgram = this.createStdTextureShaderProgram();
			this.stdColorShaderProgram = this.createStdColorShaderProgram();
		},
		
		/*
		 *
		 */
		initWebGL: function initWebGL()
		{
			this.gl = this.canvas.getContext("experimental-webgl");
			gl = this.gl;
			
			gl.viewportWidth = this.canvas.width;
			gl.viewportHeight = this.canvas.height;
			
			this.vpWidth = this.canvas.width;
			this.vpHeight = this.canvas.height;
			this.vpHalfWidth = this.vpWidth / 2.0;
			this.vpHalfHeight = this.vpHeight / 2.0;
			this.aspect = this.vpWidth / this.vpHeight;
			 
			// If we don't have a GL context, give up now
			if (!this.gl)
				throw "Couldn't initialize WebGL";
			
		},
		
		/* 
		 * 
		 */
		removeAllDrawableObjects: function removeAllDrawableObjects()
		{
			this.drawableObjects = [];
		},
		
		
		/*
		 *
		 */
		destroy: function destroy()
		{
			//Engine.log("destroy: not implemented");
			
		},
		
		/*
		 *
		 */
		update: function update(dt)
		{
			gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
			
			this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
			this.gl.clear(this.gl.COLOR_BUFFER_BIT);
			
			mat4.identity(this.mvMatrix);
			
			for(var i = 0; i < this.drawableObjects.length; ++i)
			{
				this.drawableObjects[i].draw(dt);
			}
		},
		
		addDrawableObject: function addDrawableObject(obj)
		{
			this.drawableObjects.push(obj);
		},
		
		/* 
		 * 
		 */
		removeDrawableObject: function removeDrawableObject(obj)
		{
			for(var i = 0; i < this.drawableObjects.length; i++)
			{
				if(this.drawableObjects[i] === obj)
				{
					this.drawableObjects.splice(i, 1);
					break;
				}
			}
		},
		
		
		createStdTextureShaderProgram: function createStdTextureShaderProgram()
		{
			this.ShaderManager.loadShaderCode("fs", "Engine/Graphics/Std_Texture_fs.shader", "x-shader/x-fragment");
			this.ShaderManager.loadShaderCode("vs", "Engine/Graphics/Std_Texture_vs.shader", "x-shader/x-vertex");
			
			var fragmentShader = this.ShaderManager.createGLSLShader("fs");
			var vertexShader = this.ShaderManager.createGLSLShader("vs");
			
			var shaderProgram = new this.ShaderProgram([vertexShader, fragmentShader], true);
			
			shaderProgram.use();
			
			shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram.webglShaderProgram, "aVertexPosition");
			gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
			
			shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram.webglShaderProgram, "aTextureCoord");
			gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
			
			shaderProgram.registerUniform("pMatrix", "uPMatrix", "uniformMatrix4fv");
			shaderProgram.registerUniform("mvMatrix", "uMVMatrix", "uniformMatrix4fv");
			
			shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram.webglShaderProgram, "uSampler");
			
			return shaderProgram;
		},
		
		createStdColorShaderProgram: function createStdColorShaderProgram()
		{
			this.ShaderManager.loadShaderCode("fs", "Engine/Graphics/Std_Color_fs.shader", "x-shader/x-fragment");
			this.ShaderManager.loadShaderCode("vs", "Engine/Graphics/Std_Color_vs.shader", "x-shader/x-vertex");
			
			var fragmentShader = this.ShaderManager.createGLSLShader("fs");
			var vertexShader = this.ShaderManager.createGLSLShader("vs");
			
			var shaderProgram = new this.ShaderProgram([vertexShader, fragmentShader], true);
			
			shaderProgram.use();
			
			shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram.webglShaderProgram, "aVertexPosition");
			gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
			
			shaderProgram.registerUniform("pMatrix", "uPMatrix", "uniformMatrix4fv");
			shaderProgram.registerUniform("mvMatrix", "uMVMatrix", "uniformMatrix4fv");
			shaderProgram.registerUniform("color", "uColor", "uniform4fv");
			
			return shaderProgram;
		},
		
		screenPosToWorldPos: function screenPosToWorldPos(screenPos, distance, outWorldPos)
		{
			if(!outWorldPos)
				outWorldPos = Vector3.fromPool();
				
			outWorldPos.x = -this.camera.pos.x + ((screenPos.x - this.vpHalfWidth) * this.orthoPixelToMeterRatio);
			outWorldPos.y = -this.camera.pos.y + ((-screenPos.y + this.vpHalfHeight) * this.orthoPixelToMeterRatio);
			
			return outWorldPos;
		},
		
		
		
	};
	
	GraphicsCore.ShaderManager = require("ShaderManager").ShaderManager;
	GraphicsCore.TextureManager = require("TextureManager").TextureManager;
	GraphicsCore.ShaderProgram = require("ShaderProgram").ShaderProgram;
	GraphicsCore.Plugin_SimpleTextureGraphics2D = require("Plugin_SimpleTextureGraphics2D").Plugin_SimpleTextureGraphics2D;
	GraphicsCore.Plugin_SimpleColorGraphics2D = require("Plugin_SimpleColorGraphics2D").Plugin_SimpleColorGraphics2D;
	GraphicsCore.Color = require("Color").Color;
	
	exports.GraphicsCore = GraphicsCore;
	
});