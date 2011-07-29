"use strict";

ModuleSystem.registerModule(function(require, exports){
	
	var gl = null;
	var GraphicsCore = null;
	
	var ShaderManager = {
		shaderCodes: {},
		
		init: function init(graphicsCore)
		{
			gl = graphicsCore.gl;
			GraphicsCore = graphicsCore;
		},
		
		
		loadShaderCode: function loadShaderCode(id, path, type)
		{
			// TODO: async, errorhandling
			
			var code = Engine.FileLoader.loadFileAsString(path);
			
			this.shaderCodes[id] = {
				path: path,
				code: code,
				type: type
			};
		},
		
		createGLSLShader: function createGLSLShader(id)
		{
			var shaderCode = this.shaderCodes[id];
			
			var shader;
			if (shaderCode.type == "x-shader/x-fragment")
			{
				shader = gl.createShader(gl.FRAGMENT_SHADER);
			}
			else if (shaderCode.type == "x-shader/x-vertex")
			{
				shader = gl.createShader(gl.VERTEX_SHADER);
			}
			else
			{
				return null;
			}
			
			gl.shaderSource(shader, shaderCode.code);
			gl.compileShader(shader);
			
			if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
			{
				alert(gl.getShaderInfoLog(shader));
				return null;
			}
			
			return shader;
		},
		
		
	};
	
	exports.ShaderManager = ShaderManager;
	
});