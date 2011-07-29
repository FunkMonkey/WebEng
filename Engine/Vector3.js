
// TODO: into module

function Vector3(xOrVec, y, z)
{
	this.set(xOrVec, y, z);
}

Vector3.create = function create(xOrVec, y, z)
{
	return new Vector3(xOrVec, y, z);
};

Vector3.pool = [];
Vector3.fromPool = function fromPool(xOrVec, y, z)
{
	if(Vector3.pool.length > 0)
	{
		var vec = Vector3.pool.pop();
		vec.set(xOrVec, y, z);
		return vec;
	}
	
	return new Vector3(xOrVec, y, z);
};

Vector3.functions = {
	
	set: function set(xOrVec, y, z)
	{
		if(xOrVec === undefined)
		{
			this[0] = 0;
			this[1] = 0;
			this[2] = 0;
		}
		else if(y === undefined)
		{
			this[0] = xOrVec[0];
			this[1] = xOrVec[1];
			this[2] = xOrVec[2];
		}
		else
		{
			this[0] = xOrVec;
			this[1] = y;
			this[2] = z;
		}
	},
	
	toPool: function toPool()
	{
		Vector3.pool.push(this); 
	},
};

Vector3.properties = {
		x: 	{	get : function(){ return this[0]; },
				set : function(newValue){ this[0] = newValue; },
				enumerable : true,
				configurable : true
			},
			
		y: 	{	get : function(){ return this[1]; },
				set : function(newValue){ this[1] = newValue; },
				enumerable : true,
				configurable : true
			},
			
		z: 	{	get : function(){ return this[2]; },
				set : function(newValue){ this[2] = newValue; },
				enumerable : true,
				configurable : true
			}
};

Extension.inherit_auto(Vector3, Array);

