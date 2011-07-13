"use strict";

ModuleSystem.registerModule(function(){
	
	var gl = null;
	var GraphicsCore = null;
	var zAxis = [0, 0, 1];
	
	var vertices = 	[
						-1.0,  1.0,  0.0,
						 1.0,  1.0,  0.0,
						-1.0, -1.0,  0.0,
						 1.0, -1.0,  0.0
					];
	
	// TODO: rename to Plugin_SimpleGraphicsObject
	
	var SimpleGraphicsObject = {
		
		createOn: function createOn(obj, textureID)
		{
			obj.textureID = textureID;
			obj.shaderProgram = GraphicsCore.stdShaderProgram;
			this.init.call(obj);
			obj.draw = this.draw;
		},
		
		
		init: function init()
		{
			/* Textures */			
			this.texture = GraphicsCore.TextureManager.createTexture(this.textureID);
			
			/* Vertices */
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
	
			mat4.translate(mvMatrix, this.pos);
			//mat4.rotate(mvMatrix, this.rot, zAxis)
			
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
	
	SimpleGraphicsObject.initModule = function initModule(graphicsCore)
		{
			gl = graphicsCore.gl;
			GraphicsCore = graphicsCore;
			
		}
	
	return {SimpleGraphicsObject: SimpleGraphicsObject};
	
});