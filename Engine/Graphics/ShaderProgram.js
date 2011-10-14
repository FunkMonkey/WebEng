"use strict";

ModuleSystem.registerModule("Engine/Graphics/ShaderProgram", function(require, exports){
	
	var gl = null;
	var GraphicsCore = null;
	
	/**
	 * ShaderProgram
	 *    - constructor function for a ShaderProgram (Wrapper around webgl-shaderprograms)
	 * 
	 * @param   {Shader|Array} shader_s  A single shader or an array of shaders
	 * @param   {boolean}      link      True if start linking
	 * @param   {boolean}      use       True if start using
	 */
	function ShaderProgram(shader_s, link, use)
	{
		this.webglShaderProgram = gl.createProgram();
		this.uniformLocations = {};
		this.uniformValues = {};
		
		if(shader_s)
		{
			if(shader_s instanceof Array)
				this.attachShaders(shader_s, link, use);
			else
				this.attachShader(shader_s, link, use);
		}
	}
	
	ShaderProgram.usedProgram = null;
	
	ShaderProgram.prototype = {
		constructor: ShaderProgram,
		
		/**
		 * Attaches a shader
		 * 
		 * @param   {Shader} shader Shader to attach
		 * @param   {boolean}      link      True if start linking
		 * @param   {boolean}      use       True if start using
		 */
		attachShader: function attachShader(shader, link, use)
		{
			gl.attachShader(this.webglShaderProgram, shader);
			
			if(link)
			{
				this.link();
				
				if(use)
					this.use();
			}
		},
		
		/**
		 * Attaches multiple shaders
		 * 
		 * @param   {Array} shaders Shaders to attach
		 * @param   {boolean}      link      True if start linking
		 * @param   {boolean}      use       True if start using
		 */
		attachShaders: function attachShaders(shaders, link, use)
		{
			for(var i = 0; i < shaders.length; ++i)
				this.attachShader(shaders[i]);
				
			if(link)
			{
				this.link();
				
				if(use)
					this.use();
			}
		},
		
		/**
		 * Links the shaderprogram
		 */
		link: function link()
		{
			gl.linkProgram(this.webglShaderProgram);
			
			if (!gl.getProgramParameter(this.webglShaderProgram, gl.LINK_STATUS))
			{
				// todo: more info
				log("Could not initialise shaders");
			} 
		},
		
		/**
		 * Uses the shader-program
		 */
		use: function use()
		{
			if(ShaderProgram.usedProgram !== this)
			{
				gl.useProgram(this.webglShaderProgram);
				ShaderProgram.usedProgram = this;
			}
		},
		
		/**
		 * Registers a uniform
		 * 
		 * @param   {string} callName    Name to access the uniform in JS
		 * @param   {string} uniformName Name of uniform in shader
		 * @param   {string} type        Type of the uniform
		 */
		registerUniform: function registerUniform(callName, uniformName, type)
		{
			var uniformValues = this.uniformValues;
			
			var location = gl.getUniformLocation(this.webglShaderProgram, uniformName);
			this.uniformLocations[callName] = location;
			uniformValues[callName] = null;
			
			switch(type)
			{
				case "uniformMatrix4fv":
					{
						// TODO: optimize
						// TODO: readonly
						Object.defineProperty(this, callName, {
								get: function(){ return uniformValues[callName];},
								set: function(val){ uniformValues[callName] = val; gl[type](location, false, val); },
								configurable: true,
								enumerable: true
						});
						break;
					}
				case "uniform4fv":
					{
						// TODO: optimize
						// TODO: readonly
						Object.defineProperty(this, callName, {
								get: function(){ return uniformValues[callName];},
								set: function(val){ uniformValues[callName] = val; gl[type](location, val); },
								configurable: true,
								enumerable: true
						});
						break;
					}
			}
			
			
			
		},
		
	};
	
	ShaderProgram.init = function init(graphicsCore)
		{
			gl = graphicsCore.gl;
			GraphicsCore = graphicsCore;
		}

	
	exports.ShaderProgram = ShaderProgram;
	
});