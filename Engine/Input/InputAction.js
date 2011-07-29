"use strict";


ModuleSystem.registerModule(function(){
	
	var InputCore = null;
	
	function KeyboardTrigger(action, keyCode, state, input)
	{
		this.action = action;
		this.keyCode = keyCode;
		this.state = state;
		this.input = input;
		
		if(this.input && action.result.length < input.length)
		{
			for(var i = action.result.length - 1; i < input.length; ++i)
				action.result[i] = 0;
		}
	}
	
	KeyboardTrigger.prototype = {
		constructor: KeyboardTrigger,
		
		check: function check()
		{
			if(InputCore.isKey(this.keyCode, this.state))
			{
				this.action.isTriggered = true;
				
				if(this.input)
				{
					for(var i = 0; i < this.input.length; ++i)
						this.action.result[i] += this.input[i];
				}
			}
		}
	};
	
	function MouseButtonTrigger(action, buttonCode, state, input)
	{
		this.action = action;
		this.buttonCode = buttonCode;
		this.state = state;
		this.input = input;
		
		if(this.input && action.result.length < input.length)
		{
			for(var i = action.result.length - 1; i < input.length; ++i)
				action.result[i] = 0;
		}
	}
	
	MouseButtonTrigger.prototype = {
		constructor: MouseButtonTrigger,
		
		check: function check()
		{
			if(InputCore.isMouseButton(this.buttonCode, this.state))
			{
				this.action.isTriggered = true;
				
				if(this.input)
				{
					for(var i = 0; i < this.input.length; ++i)
						this.action.result[i] += this.input[i];
				}
			}
		}
	};
	
	function MouseMoveTrigger(action, input)
	{
		this.action = action;
		this.input = input;
		
		action.result[0] = 0;
		action.result[1] = 0;
	}
	
	MouseMoveTrigger.prototype = {
		constructor: MouseMoveTrigger,
		
		check: function check()
		{
			var mouseRel = InputCore.mousePosRel;
			if(mouseRel.x !== 0 || mouseRel.y !== 0)
			{
				this.action.isTriggered = true;
				
				if(this.input)
				{
					switch(this.input.length)
					{
						case 0:
							{
								this.action.result[0] += mouseRel[0];
								this.action.result[1] += mouseRel[1];
								break;
							}
						case 1:
							{
								this.action.result[0] += mouseRel[0] * this.input[0];
								this.action.result[1] += mouseRel[1];
								break;
							}
						default: // case > 1
							{
								this.action.result[0] += mouseRel[0] * this.input[0];
								this.action.result[1] += mouseRel[1] * this.input[1];
								break;
							}
					}
				}
				else
				{
					this.action.result[0] += mouseRel[0];
					this.action.result[1] += mouseRel[1];
				}
			}
		}
	};
	
	function InputAction(name)
	{
		this.name = name;
		this.callbacks = [];
		
		this.enabled = true;
		
		this.result = [];
		this.isTriggered = false;
		
		this.triggers = [];
	}
	
	InputAction.prototype = {
		constructor: InputAction,
		
		runCallbacks: function runCallbacks()
		{
			for(var i = 0; i < this.callbacks.length; ++i)
				this.callbacks[i](action, this.result);
		},
		
		addKeyboardTrigger: function addKeyboardTrigger(keyCode, state, input)
		{
			this.triggers.push(new KeyboardTrigger(this, keyCode, state, input));
		},
		
		addMouseButtonTrigger: function addMouseButtonTrigger(mbCode, state, input)
		{
			this.triggers.push(new MouseButtonTrigger(this, mbCode, state, input));
		},
		
		addMouseMoveTrigger: function addMouseMoveTrigger(input)
		{
			this.triggers.push(new MouseMoveTrigger(this, input));
		},
		
		check: function check()
		{
			this.isTriggered = false;
			
			// reset result
			for(var i = 0; i < this.result.length; ++i)
				this.result[i] = 0;
			
			// check triggers
			for(var i = 0; i < this.triggers.length; ++i)
				this.triggers[i].check();
			
			// run callbacks
			if(this.isTriggered)
				this.runCallbacks();
		},
		
		
		
	};
	
	InputAction.KeyboardTrigger = KeyboardTrigger;
	InputAction.MouseButtonTrigger = MouseButtonTrigger;
	InputAction.MouseMoveTrigger = MouseMoveTrigger;
	
	
	InputAction.initModule = function initModule(inputCore)
	{
		InputCore = inputCore;
	}
	
	return {InputAction: InputAction};
	
});