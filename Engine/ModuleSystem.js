

var ModuleSystem = {
	
	modules: {},
	
	modulesPath: "",
	
	// TODO: check for /
	require: function require(id, options)
	{
		if(id[0] !== "/")
			id = "/" + id;
		
		var module = this.modules[id];
		
		if(!module || (options && options.forceFileReload))
		{
			var path = (this.modulesPath === "") ? ModuleSystem.modulePathToFilePath(id) : this.modulesPath + ModuleSystem.modulePathToFilePath(id);
			ScriptLoader.loadJSFile_Sync(path);
		}
		
		module = this.modules[id];
		
		
		if(!module)
			throw "Unknown module: " + id;
		
		if(!module.loaded || (options && options.forceRecreation))
		{
			this.loadModule(module);
		}
		
		return module.exports;
	},
	
	require_async: function require_async(moduleName, forceRecreation, forceFileReload, asyncCallback)
	{
	},
	
	registerModule: function registerModule(id, moduleFunc)
	{
		if(id[0] !== "/")
			id = "/" + id;
			
		var module = {
			id: id,
			moduleFunc: moduleFunc,
			loaded: false,
			exports: null,
			dir: this.modulePathToModuleDirPath(id)
		};
		
		this.modules[id] = module;
	},
	
	/*
	 *
	 */
	loadModule: function loadModule(module)
	{
		var modRequire = (function modRequire(id, options)
		{
			if(id[0] === "/")
				return this.require(id, options)
			else
				return this.require(module.dir + "/" + id, options);
		}).bind(this);
		
		module.exports = {};
		module.moduleFunc(modRequire, module.exports, module);
		module.loaded = true;
	},
	
	modulePathToModuleDirPath: function modulePathToModuleDirPath(path)
	{
		var index = path.lastIndexOf("/");
		return (index === -1 || index === 0) ? "" : path.substring(0, index);
	},
	
	
	// var path = "/foo/bar"; var index = path.lastIndexOf("/");alert("result " + (index === -1 || index === 0) ? "" : path.substring(0, index));
	
	/*
	 *
	 */
	modulePathToFilePath: function modulePathToFilePath(path)
	{
		return path.substr(1) + ".js";
	},
	
	/*
	 *
	 */
	filePathToModulePath: function filePathToModulePath(path)
	{
		return path.replace(new RegExp("\\\\", "g"), "/").substring(0, path.length - 3);
	},
	
	/*
	 *
	 */
	directoryPathToModulePath: function filePathToModulePath(path)
	{
		return path.replace(new RegExp("\\\\", "g"), "/");
	},
	
	/*
	 *
	 */
	modulePathToDirectoryPath: function filePathToModulePath(path)
	{
		return path.substr(1);
	},
};

ModuleSystem._boundRequire = ModuleSystem.require.bind(ModuleSystem);

