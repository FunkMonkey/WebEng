"use strict";

ModuleSystem.registerModule("Engine/Graphics/ShaderProgram", function(require, exports){
	
	var gl = null;
	var GraphicsCore = null;
	
	function VertexAttribute(program, name, enable)
	{
		this.program = program;
		this.name = name;
		this.location = gl.getAttribLocation(this.program.webglShaderProgram, name);
		
		if(enable)
			this.enable();
	}
	
	VertexAttribute.prototype = {
		constructor: VertexAttribute,
		
		enable: function enable()
		{
			gl.enableVertexAttribArray(this.location);
		},
		
	};
	
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
		
		
		link: function link()
		{
			gl.linkProgram(this.webglShaderProgram);
			
			if (!gl.getProgramParameter(this.webglShaderProgram, gl.LINK_STATUS))
			{
				// todo: more info
				log("Could not initialise shaders");
			} 
		},
		
		use: function use()
		{
			if(ShaderProgram.usedProgram !== this)
			{
				gl.useProgram(this.webglShaderProgram);
				ShaderProgram.usedProgram = this;
			}
		},
		
		registerUniform: function registerUniform(callName, uniformName, type, readonly)
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
		
		registerAttribute: function registerAttribute(callName, attribName, enable)
		{
			this[callName] = new VertexAttribute(this, attribName, enable); 
		},
		
		
		
	};
	
	ShaderProgram.init = function init(graphicsCore)
		{
			gl = graphicsCore.gl;
			GraphicsCore = graphicsCore;
		}

	
	exports.ShaderProgram = ShaderProgram;
	exports.VertexAttribute = VertexAttribute;
	
});