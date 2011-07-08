"use strict";


ModuleSystem.registerModule(function(){
	
	var gl = null;
	var GraphicsObject = null;
	
	var GraphicsCore = {
		
		canvas: null,
		
		init: function init()
		{
			this.canvas = document.getElementById("glcanvas");
			//this._viewportSize = Vector2.getFromPool(this.canvas.width, this.canvas.height);
			//this._cameraPos = Vector2.getFromPool(0, 0);
			
			this.initWebGL();
			
			this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  		// Set clear color to black, fully opaque
			this.gl.clearDepth(1.0);                 		// Clear everything
			this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
			this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things
			
			this.gl.enable(this.gl.TEXTURE_2D);
			
			GraphicsObject = ModuleSystem.require("Engine.Graphics.GraphicsObject").GraphicsObject;
			
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
		update: function update()
		{
			gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
			
			this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
			this.gl.clear(this.gl.COLOR_BUFFER_BIT);
			
			/*var objs = this._graphicObjects;
			for(var i = 0; i < objs.length; ++i)
			{
				
			}*/
			
			/* --------------- TUTORIAL --------------- */
			
			mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, this.pMatrix);

			mat4.identity(this.mvMatrix);
	
			mat4.translate(this.mvMatrix, Vector3.fromPool(-1.5, 0.0, -7.0));
			mat4.translate(this.mvMatrix, Vector3.fromPool(3.0, 0.0, 0.0));
			gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
			gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			this.setMatrixUniforms();
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.squareVertexPositionBuffer.numItems);
		},
		
		getShader: function getShader(gl, id)
		{
			var shaderScript = document.getElementById(id);
			if (!shaderScript) {
				return null;
			}
	
			var str = "";
			var k = shaderScript.firstChild;
			while (k) {
				if (k.nodeType == 3) {
					str += k.textContent;
				}
				k = k.nextSibling;
			}
	
			var shader;
			if (shaderScript.type == "x-shader/x-fragment") {
				shader = gl.createShader(gl.FRAGMENT_SHADER);
			} else if (shaderScript.type == "x-shader/x-vertex") {
				shader = gl.createShader(gl.VERTEX_SHADER);
			} else {
				return null;
			}
	
			gl.shaderSource(shader, str);
			gl.compileShader(shader);
	
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				alert(gl.getShaderInfoLog(shader));
				return null;
			}
	
			return shader;
		},
		
		init_test: function test()
		{
			/* matrices */
			this.mvMatrix = mat4.create();
			this.pMatrix = mat4.create();
			
			/* Shaders */
			
			var fragmentShader = this.getShader(gl, "shader-fs");
			var vertexShader = this.getShader(gl, "shader-vs");
	
			this.shaderProgram = gl.createProgram();
			gl.attachShader(this.shaderProgram, vertexShader);
			gl.attachShader(this.shaderProgram, fragmentShader);
			gl.linkProgram(this.shaderProgram);
	
			if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
				alert("Could not initialise shaders");
			}
	
			gl.useProgram(this.shaderProgram);
	
			this.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
			gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
	
			this.shaderProgram.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
			this.shaderProgram.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
			
			/* Textures */
			
			/* Vertices */
			
			this.squareVertexPositionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
			var vertices = [
				 1.0,  1.0,  0.0,
				-1.0,  1.0,  0.0,
				 1.0, -1.0,  0.0,
				-1.0, -1.0,  0.0
			];
			
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			this.squareVertexPositionBuffer.itemSize = 3;
			this.squareVertexPositionBuffer.numItems = 4;
		},
		
		setMatrixUniforms: function setMatrixUniforms()
		{
			gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
			gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
		}
	};
		
	return {GraphicsCore: GraphicsCore};
	
});