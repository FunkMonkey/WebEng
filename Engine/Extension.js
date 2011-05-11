
var Extension = {

	inherit: function inherit(child, supertype, functions, properties)
	{
		child.prototype = Object.create(supertype.prototype, properties);
		child.prototype.constructor = child;
		
		if(functions)
			this.borrow(child.prototype, functions);
	},
	
	inherit_auto: function inherit_auto(child, supertype)
	{
		this.inherit(child, supertype, child.functions, child.properties);
	},
	
	borrow: function borrow(_to, _from)
	{
		for(var prop in _from)
			_to[prop] = _from[prop];
	}

};
