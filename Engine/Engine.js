var Engine = {
	
	FileLoader: {
		loadFileAsString: function loadFileAsString(filePath, callback)
		{
			// TODO: async
			
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
			
			return xhrObj.responseText;
		}
		
		
	},
	
	getTimeInMS: function getTimeInMS()
	{
		return Date.now();
	},
	
	getHRTimeInMS: function getHRTimeInMS()
	{
		return Date.now();
	},
};

Engine.Timers = require("/Engine/Timers");