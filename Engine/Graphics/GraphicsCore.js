"use strict";


ModuleSystem.registerModule(function(){
	
	var gl = null;
	var GraphicsObject = null;
	
	var GraphicsCore = {
		
		canvas: null,
		
		init: function init()
		{
			this.canvas = document.getElementById("glcanvas");
			console.log("canvas: " + this.canvas);
			//this._viewportSize = Vector2.getFromPool(this.canvas.width, this.canvas.height);
			//this._cameraPos = Vector2.getFromPool(0, 0);
			
			this.initWebGL();
			
			log("GL is " + gl);
			
			this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  		// Set clear color to black, fully opaque
			this.gl.clearDepth(1.0);                 		// Clear everything
			this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
			this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things
			
			this.gl.enable(this.gl.TEXTURE_2D);
			
			GraphicsObject = ModuleSystem.require("Engine.Graphics.GraphicsObject").GraphicsObject;
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
		},
	};
		
	return {GraphicsCore: GraphicsCore};
	
});