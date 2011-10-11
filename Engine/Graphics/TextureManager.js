"use strict";

ModuleSystem.registerModule("Engine/Graphics/TextureManager", function(require, exports){
	
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
		
		images: {},
		
		loadImage: function loadImage(path, callback)
		{
			
			if(this.images[path])
			{
				callback(this.images[path]);
			}
			else
			{
				var self = this;
				var image = new Image();
				image.onload = function () {
					image.path = path;
					
					// todo fix
					if(self.images[path])
						log("double loaded image")
					self.images[path] = image;
					callback(image);
				};
				image.src = path;
			}
		},
		
		getTexture: function getTexture(path)
		{
			return this.textures[path]; 
		},
		
		_handleLoadedImage: function _handleLoadedImage(image, callback)
		{
			var texture = gl.createTexture();
			texture.image = image;
			texture.width = image.width;
			texture.height = image.height;
			texture.ratio = texture.width / texture.height;
			
			gl.bindTexture(gl.TEXTURE_2D, texture);
			//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			
			gl.bindTexture(gl.TEXTURE_2D, null);
			
			this.textures[image.path] = texture;
			
			callback(texture);	
		},
		
		
		createTexture: function createTexture(path, callback)
		{
			// TODO: error handling
			
			if(this.textures[path])
			{
				callback(this.textures[path]);
			}
			else
			{
				this.loadImage(path, (function(image){
					this._handleLoadedImage(image, callback);
				}).bind(this));
			}
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
	
	exports.TextureManager = TextureManager;
	
});