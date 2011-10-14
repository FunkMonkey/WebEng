"use strict";

ModuleSystem.registerModule("Engine/Graphics/ShaderManager", function(require, exports){
	
	var gl = null;
	var GraphicsCore = null;
	
	var ShaderManager = {
		shaderCodes: {},
		
		/**
		 * Initializes the ShaderManager
		 * 
		 * @param   {GraphicsCore} graphicsCore GraphicsCore
		 */
		init: function init(graphicsCore)
		{
			gl = graphicsCore.gl;
			GraphicsCore = graphicsCore;
		},
		
		/**
		 * Loads the code of a shader given its path
		 * 
		 * @param   {string} id   Future id to access the shader-code
		 * @param   {string} path Path to shader-code
		 * @param   {string} type Type of shader
		 */
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
		
		/**
		 * Creates a shader from the code under the given id
		 * 
		 * @param   {string} id Shader-Code-ID
		 * 
		 * @returns {Shader} The newly created shader
		 */
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
				log(gl.getShaderInfoLog(shader));
				return null;
			}
			
			return shader;
		},
		
		
	};
	
	exports.ShaderManager = ShaderManager;
	
});