
var Extension = {

	/**
	 * Lets the child inherit from the supertype
	 * 
	 * @param   {Object} child      Subclass
	 * @param   {Object} supertype  Parentclass
	 * @param   {Object} functions  functions to borrow
	 * @param   {Object} properties Property-descriptors
	 */
	inherit: function inherit(child, supertype, functions, properties)
	{
		child.prototype = Object.create(supertype.prototype, properties);
		child.prototype.constructor = child;
		
		if(functions)
			this.borrow(child.prototype, functions);
	},
	
	/**
	 * Lets the child inherit from the supertype
	 *    - determines functions and properties automatically
	 * 
	 * @param   {Object} child      Subclass
	 * @param   {Object} supertype  Parentclass
	 */
	inherit_auto: function inherit_auto(child, supertype)
	{
		this.inherit(child, supertype, child.functions, child.properties);
	},
	
	/**
	 * Borrows members from another object
	 * 
	 * @param   {Object} _to   Object to add members to
	 * @param   {Object} _from Object to get members from
	 */
	borrow: function borrow(_to, _from)
	{
		for(var prop in _from)
			_to[prop] = _from[prop];
	}

};
