"use strict";

ModuleSystem.registerModule(function(){
	
	var gl = null;
	var GraphicsCore = null;
	
	var TextureManager = {
		textures: {},
		
		init: function init(graphicsCore)
		{
			gl = graphicsCore.gl;
			GraphicsCore = graphicsCore;
			
			this._createStandardTexBuffer();
		},
		
		createTexture: function createTexture(path)
		{
			// TODO: error handling
			
			var tex = gl.createTexture();
			tex.image = new Image();
			tex.image.onload = (function () {
				this.handleLoadedTexture(tex)
			}).bind(this);

			tex.image.src = path;
			
			this.textures[path] = tex;
			
			return tex;
		},
		
		handleLoadedTexture: function handleLoadedTexture(texture)
		{
			gl.bindTexture(gl.TEXTURE_2D, texture);
			//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.bindTexture(gl.TEXTURE_2D, null);
		},
		
		_createStandardTexBuffer: function _createStandardTexBuffer()
		{
			this.standardTexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.standardTexBuffer);
			
			var textureCoords = [
			  0.0, 0.0,
			  1.0, 0.0,
			  0.0, 1.0,
			  1.0, 1.0 ];
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
			
			// TODO: remove, maybe
			this.standardTexBuffer.itemSize = 2;
			this.standardTexBuffer.numItems = 4;
		},
		
		
	};
	
	return {TextureManager: TextureManager};
	
});