var ScriptLoader = {

	loadDebug: false,
	
	/*
	 *
	 */
	_blockExecution: function _blockExecution()
	{
		// get some kind of XMLHttpRequest
		var xhrObj = new XMLHttpRequest();
		
		// open and send a synchronous request
		xhrObj.open('GET', "Engine/ScriptLoader.js", false);
		xhrObj.overrideMimeType("text/plain");
		xhrObj.send('');
	},
	
	loadJSFile_Sync: function loadJSFile(filePath)
	{
		this.loadJSFile(filePath);
	},
	
	loadJSFile_Async: function loadJSFile(filePath, asyncCallback)
	{
		this.loadJSFile(filePath, asyncCallback);
	},
	
	/*
	 *
	 */
	loadJSFile: function loadJSFile(filePath, asyncCallback)
	{
		if(!this.loadDebug)
		{
			// get some kind of XMLHttpRequest
			var xhrObj = new XMLHttpRequest();
			
			// open and send a synchronous request
			xhrObj.open('GET', filePath, false);
			xhrObj.overrideMimeType("text/plain");
	
			try
			{
				xhrObj.send('');
			}
			catch(e)
			{
				this.log("Could not load js file: " + filePath);
				throw e;
			}
	
			var node = document.createElement("script");
			node.setAttribute("type", "text/javascript");
			node.text = xhrObj.responseText;
			document.getElementsByTagName("head")[0].appendChild(node);
		}
		else
		{
			var node = document.createElement("script");
			node.async = false;
			node.setAttribute("type", "text/javascript");
			node.setAttribute("src", filePath);
			node.scriptLoaded = false;
			
			node.onload = function onload(event){
				this.scriptLoaded = true;
			};
			
			document.getElementsByTagName("head")[0].appendChild(node);
			
			// dirty hack
			while(!node.scriptLoaded)
				this._blockExecution();
		}
	},
	
	
};
