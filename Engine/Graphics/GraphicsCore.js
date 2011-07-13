"use strict";


ModuleSystem.registerModule(function(){
	
	var gl = null;
	var GraphicsObject = null;
	
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
			this.SimpleGraphicsObject.initModule(this);
			
			GraphicsObject = ModuleSystem.require("Engine.Graphics.GraphicsObject").GraphicsObject;
			
			this.stdShaderProgram = this.createStandardShaderProgram();
			
			this.init_test();
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
			
			
			
			/* --------------- TUTORIAL --------------- */
			
			mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, this.pMatrix);

			
			
			

			mat4.identity(this.mvMatrix);
			
			
			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.neheTexture);
			gl.uniform1i(this.stdShaderProgram.samplerUniform, 0);
	
			mat4.translate(this.mvMatrix, Vector3.fromPool(1.5, 0.0, -7.0));
			
			gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
			gl.vertexAttribPointer(this.stdShaderProgram.vertexPositionAttribute, this.squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, this.TextureManager.standardTexBuffer);
			gl.vertexAttribPointer(this.stdShaderProgram.textureCoordAttribute, this.TextureManager.standardTexBuffer.itemSize, gl.FLOAT, false, 0, 0);

			// setting projection and modelview matrix
			this.stdShaderProgram.pMatrix = this.pMatrix;
			this.stdShaderProgram.mvMatrix = this.mvMatrix;
			
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.squareVertexPositionBuffer.numItems);
			
			for(var i = 0; i < this.drawableObjects.length; ++i)
			{
				this.drawableObjects[i].draw(dt);
			}
		},
		
		addDrawableObject: function addDrawableObject(obj)
		{
			this.drawableObjects.push(obj);
		},
		
		
		init_test: function test()
		{
			
			
			/* Shaders */
			
			
			// TODO: async shaders
			
			/* Textures */			
			this.neheTexture = this.TextureManager.createTexture("TestGame/Content/nehe.gif");
			
			
			
			/* Vertices */
			
			this.squareVertexPositionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
			var vertices = [
				-1.0,  1.0,  0.0,
				 1.0,  1.0,  0.0,
				-1.0, -1.0,  0.0,
				 1.0, -1.0,  0.0
			];
			
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			this.squareVertexPositionBuffer.itemSize = 3;
			this.squareVertexPositionBuffer.numItems = 4;

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
	GraphicsCore.SimpleGraphicsObject = ModuleSystem.require("Engine.Graphics.SimpleGraphicsObject").SimpleGraphicsObject;
		
	return {GraphicsCore: GraphicsCore};
	
});