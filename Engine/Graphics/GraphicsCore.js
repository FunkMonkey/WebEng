"use strict";


ModuleSystem.registerModule(function(require, exports){
	
	var gl = null;
	
	var GraphicsCore = {
		
		canvas: null,
		
		init: function init()
		{
			this.drawableObjects = [];
			
			// matrices
			this.mvMatrix = mat4.create();
			this.pMatrix = mat4.create();
			
			this.canvas = document.getElementById("glcanvas");
			//this._viewportSize = Vector2.getFromPool(this.canvas.width, this.canvas.height);
			//this._cameraPos = Vector2.getFromPool(0, 0);
			
			this.initWebGL();
			
			this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  		// Set clear color to black, fully opaque
			this.gl.clearDepth(1.0);                 		// Clear everything
			this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
			this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things
			
			this.gl.enable(this.gl.TEXTURE_2D);
			
			this.ShaderManager.init(this);
			this.TextureManager.init(this);
			this.ShaderProgram.init(this);
			this.Plugin_SimpleGraphics2D.initModule(this);
			
			this.stdShaderProgram = this.createStandardShaderProgram();
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
			 
			// If we don't have a GL context, give up now
			if (!this.gl)
				throw "Couldn't initialize WebGL";
			
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
			
			mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, this.pMatrix);
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
		
		
		createStandardShaderProgram: function createStandardShaderProgram()
		{
			this.ShaderManager.loadShaderCode("fs", "Engine/Graphics/Standard_fs.shader", "x-shader/x-fragment");
			this.ShaderManager.loadShaderCode("vs", "Engine/Graphics/Standard_vs.shader", "x-shader/x-vertex");
			
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
		
		
	};
	
	GraphicsCore.ShaderManager = ModuleSystem.require("Engine.Graphics.ShaderManager").ShaderManager;
	GraphicsCore.TextureManager = ModuleSystem.require("Engine.Graphics.TextureManager").TextureManager;
	GraphicsCore.ShaderProgram = ModuleSystem.require("Engine.Graphics.ShaderProgram").ShaderProgram;
	GraphicsCore.Plugin_SimpleGraphics2D = ModuleSystem.require("Engine.Graphics.Plugin_SimpleGraphics2D").Plugin_SimpleGraphics2D;
		
	exports.GraphicsCore = GraphicsCore;
	
});