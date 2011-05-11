

var ModuleSystem = {
	
	modules: {},
	
	_lastModuleName: "",
	
	require: function require(moduleName, forceRecreation, forceFileReload, asyncCallback)
	{
		var module = this.modules[moduleName];
		
		if(!module || forceFileReload)
		{
			this._lastModuleName = moduleName;
			ScriptLoader.loadJSFile_Sync(ModuleSystem.modulePathToFilePath(moduleName));
		}
		
		module = this.modules[moduleName];
	
		if(!module)
			throw "Unknown module: " + moduleName;
		
		if(!module.loaded || forceRecreation)
		{
			module.moduleData = module.moduleFunc();
			module.loaded = true;
		}
		
		return module.moduleData;
	},
	
	require_async: function require_async(moduleName, forceRecreation, forceFileReload, asyncCallback)
	{
	},
	
	registerModule: function registerModule(moduleFunc)
	{
		this.modules[this._lastModuleName] = {
			name: name,
			moduleFunc: moduleFunc,
			loaded: false,
			moduleData: null
		};
		//this.registeredModules[name] = moduleFunc;
	},
	
	/*
	 *
	 */
	loadModule: function loadModule(name)
	{
		var module = this.modules[name];
		if(!module)
			throw "Unknown module: " + name;
		
		module.moduleData = module.moduleFunc();
		module.loaded = true;
	},
	
	/*
	 *
	 */
	modulePathToFilePath: function modulePathToFilePath(path)
	{
		return path.replace(new RegExp("\\.", "g"), "\\") + ".js";
	},
	
	/*
	 *
	 */
	filePathToModulePath: function filePathToModulePath(path)
	{
		return path.replace(new RegExp("/|\\\\", "g"), ".").substring(0, path.length - 3);
	},
	
	/*
	 *
	 */
	directoryPathToModulePath: function filePathToModulePath(path)
	{
		return path.replace(new RegExp("/|\\\\", "g"), ".");
	},
	
	/*
	 *
	 */
	modulePathToDirectoryPath: function filePathToModulePath(path)
	{
		return path.replace(new RegExp("\\.", "g"), "\\");
	},
};

