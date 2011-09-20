
/**
 * @namespace The module system this application uses
 */
var ModuleSystem = {
	
	/**
	 * {Object} Holds the modules
	 */
	modules: {},
	
	/**
	 * {string} Path for finding modules
	 */
	modulesPath: "",
	
	// TODO: check for /
	/**
	 * Returns exports of a module and loads a module if needed
	 * 
	 * @param   {string} id        Id (path) of module to load
	 * @param   {Object} options   Options for loading
	 * 
	 * @returns {Object} Exports of the module
	 */
	require: function require(id, options)
	{
		// TODO: correctly handle /, ., and ..
		
		// some id fixing
		if(id[0] !== "/")
			id = "/" + id;
		
		var module = this.modules[id];
		
		// if module does not already exist or if file reload is forced
		if(!module || (options && options.forceFileReload))
		{
			// synchronously load the javascript file for the module
			var path = (this.modulesPath === "") ? ModuleSystem.modulePathToFilePath(id) : this.modulesPath + ModuleSystem.modulePathToFilePath(id);
			ScriptLoader.loadJSFile_Sync(path);
		}
		
		module = this.modules[id];

		// if module still does not exist, it probably doesn't exist		
		if(!module)
			throw "Unknown module: " + id;
		
		// loading module if needed
		if(!module.loaded || (options && options.forceRecreation))
		{
			this.loadModule(module);
		}
		
		return module.exports;
	},
	
	require_async: function require_async(moduleName, forceRecreation, forceFileReload, asyncCallback)
	{
	},
	
	/**
	 * Registers a module for later creation and usage
	 * 
	 * @param   {string} id             Id used for registration
	 * @param   {function} moduleFunc   Factory function for creating the module
	 */
	registerModule: function registerModule(id, moduleFunc)
	{
		// some id fixing
		if(id[0] !== "/")
			id = "/" + id;
		
		// creating the module
		var module = {
			id: id,
			moduleFunc: moduleFunc,
			loaded: false,
			exports: null,
			dir: this.modulePathToModuleDirPath(id)
		};
		
		this.modules[id] = module;
	},
	
	/**
	 * Loads the given module by executing its factory function
	 * 
	 * @param   {Object} module   Module to load
	 */
	loadModule: function loadModule(module)
	{
		// creating a special require function that is passed to the factory
		// gives knowledge about the current path of the module
		var modRequire = (function modRequire(id, options)
		{
			if(id[0] === "/")
				return this.require(id, options)
			else
				return this.require(module.dir + "/" + id, options);
		}).bind(this);
		
		// calling the factory function
		module.exports = {};
		module.moduleFunc(modRequire, module.exports, module);
		module.loaded = true;
	},
	
	/**
	 * Converts a module path to the path of a module directory
	 * 
	 * @param   {string} path   Path to convert
	 * 
	 * @returns {string} Path of module directory
	 */
	modulePathToModuleDirPath: function modulePathToModuleDirPath(path)
	{
		var index = path.lastIndexOf("/");
		return (index === -1 || index === 0) ? "" : path.substring(0, index);
	},
	
	
	// var path = "/foo/bar"; var index = path.lastIndexOf("/");alert("result " + (index === -1 || index === 0) ? "" : path.substring(0, index));
	
	/**
	 * Converts a module path to a filepath
	 * 
	 * @param   {string} path   Path to convert
	 * 
	 * @returns {string} Filepath
	 */
	modulePathToFilePath: function modulePathToFilePath(path)
	{
		return path.substr(1) + ".js";
	},
	
	/**
	 * Converts a filepath to a modulepath
	 * 
	 * @param   {string} path   Path to convert
	 * 
	 * @returns {string} Modulepath
	 */
	filePathToModulePath: function filePathToModulePath(path)
	{
		return path.replace(new RegExp("\\\\", "g"), "/").substring(0, path.length - 3);
	},
	
	/*
	 *
	 */
	directoryPathToModulePath: function directoryPathToModulePath(path)
	{
		return path.replace(new RegExp("\\\\", "g"), "/");
	},
	
	/**
	 * Converts a module path to the path of a filedirectory
	 * 
	 * @param   {string} path   Path to convert
	 * 
	 * @returns {string} Path of file directory
	 */
	modulePathToDirectoryPath: function modulePathToDirectoryPath(path)
	{
		return path.substr(1);
	},
};

// TODO: is this still needed?
ModuleSystem._boundRequire = ModuleSystem.require.bind(ModuleSystem);

