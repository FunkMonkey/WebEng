

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
			module.exports = {}
			module.moduleFunc(this._boundRequire, module.exports);
			module.loaded = true;
		}
		
		return module.exports;
	},
	
	require_async: function require_async(moduleName, forceRecreation, forceFileReload, asyncCallback)
	{
	},
	
	registerModule: function registerModule(moduleFunc, name)
	{
		var module = {
			name: name,
			moduleFunc: moduleFunc,
			loaded: false,
			exports: null
		};
		
		// TODO: check availability
		if(name)
			this.modules[name] = module;
		else
			this.modules[this._lastModuleName] = module;
			
			
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
		
		module.exports = {};
		module.moduleFunc(this._boundRequire, module.exports);
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

ModuleSystem._boundRequire = ModuleSystem.require.bind(ModuleSystem);

