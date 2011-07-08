"use strict";


ModuleSystem.registerModule(function(){
	
	GraphicsCore = ModuleSystem.require("Engine.Graphics.GraphicsCore").GraphicsCore;
	gl = GraphicsCore.gl;
	
	function GraphicsObject()
	{
		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		vertices = [
			 1.0,  1.0,  0.0,
			-1.0,  1.0,  0.0,
			 1.0, -1.0,  0.0,
			-1.0, -1.0,  0.0
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.buffer.itemSize = 3;
		this.buffer.numItems = 4;
	}
	
	GraphicsObject.prototype = {
		constructor: GraphicsObject,
		
		/* 
		 * 
		 */
		draw: function draw(deltaTime)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.buffer.itemSize, gl.FLOAT, false, 0, 0);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.buffer.numItems);
		},
	};
	
	return {GraphicsObject: GraphicsObject};
	
});