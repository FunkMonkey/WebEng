var ScriptLoader = {

	/**
	 * {number} Timeout for trying to load js files
	 */
	timeout: 3000,

	/**
	 * {boolean} Enable debug loading
	 */
	loadDebug: false,
	
	debugOptions: {
		logLoading: true
	},
	
	/**
	 * {string} Blockfile used for synchronous debug loading
	 */
	_blockFile: "Engine/ScriptLoader.js",
	
	/**
	 * Blocks the execution of code (used for debug loading)
	 *  - by sending a synchronous HTTP-Request
	 */
	_blockExecution: function _blockExecution()
	{
		// get some kind of XMLHttpRequest
		var xhrObj = new XMLHttpRequest();
		
		// open and send a synchronous request
		xhrObj.open('GET', this._blockFile, false);
		xhrObj.overrideMimeType("text/plain");
		xhrObj.send('');
	},
	
	/**
	 * Loads a js-file in a synchronous manner
	 * 
	 * @param   {string} filePath   File to load
	 */
	loadJSFile_Sync: function loadJSFile(filePath)
	{
		this.loadJSFile(filePath);
	},
	
	/*loadJSFile_Async: function loadJSFile(filePath, asyncCallback)
	{
		this.loadJSFile(filePath, asyncCallback);
	},*/
	
	/**
	 * Loads a js file
	 *   - currently only synchronous
	 * 
	 * @param   {string} filePath            File to load
	 * @param   {function} [asyncCallback]   Callback when file was loaded asynchrounously (not implemented)
	 */
	loadJSFile: function loadJSFile(filePath, asyncCallback)
	{
		// loading in debug mode happens quite differently
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
			
			// creating a script element and add the response as the code
			// synchronous
			var node = document.createElement("script");
			node.setAttribute("type", "text/javascript");
			node.text = xhrObj.responseText;
			document.getElementsByTagName("head")[0].appendChild(node);
		}
		else // firefox only
		{
			if(this.debugOptions.logLoading)
				log("loading file: " + filePath)
			
			// create a script element and set the src-attribute for loading the code
			var node = document.createElement("script");
			node.async = false;
			node.setAttribute("type", "text/javascript");
			node.setAttribute("src", filePath);
			node.scriptLoaded = false;
			node.scriptLoadFailed = false;
			node.path = filePath;
			
			node.onload = function onload(event){
				this.scriptLoaded = true;
			};
			
			var begin = Date.now();
			
			document.getElementsByTagName("head")[0].appendChild(node);
			
			// dirty hack
			// using the "src" attribute we cannot load in a syncronous manner, thus
			// we need to block the execution until the file has been loaded
			while(!node.scriptLoaded)
			{
				if((curr - begin) > this.timeout)
				{
					// todo: throw error
					log("Could not load " + filePath);
					break;
				}
				
				this._blockExecution();
				var curr = Date.now();
			}
		}
	},
};
