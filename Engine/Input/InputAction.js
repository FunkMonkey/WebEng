"use strict";


ModuleSystem.registerModule("Engine/Input/InputAction", function(require, exports){
	
	var InputCore = null;
	
	/**
	 * KeyboardTrigger: Constructor function for a keyboard trigger
	 * 
	 * @param   {InputAction} action      Action, trigger belongs to
	 * @param   {number}      keyCode     KeyCode for the trigger
	 * @param   {number}      state       KeyState for the trigger
	 * @param   {boolean}     obligatory  If it is obligatory trigger (necessary for action to succeed)
	 * @param   {Array}       input       Additional input data
	 */
	function KeyboardTrigger(action, keyCode, state, obligatory, input)
	{
		this.action = action;
		this.keyCode = keyCode;
		this.state = state;
		this.input = input;
		this.obligatory = (obligatory === true) ? true : false;
		
		if(this.input && action.result.length < input.length)
		{
			for(var i = action.result.length - 1; i < input.length; ++i)
				action.result[i] = 0;
		}
	}
	
	KeyboardTrigger.prototype = {
		constructor: KeyboardTrigger,
		
		/**
		 * Checks if the trigger is active
		 * 
		 * @returns {boolean} True if active, otherwise false
		 */
		check: function check()
		{
			if(InputCore.isKey(this.keyCode, this.state))
			{
				if(this.input)
				{
					for(var i = 0; i < this.input.length; ++i)
						this.action.result[i] += this.input[i];
				}
				
				return true;
			}
			return false;
		}
	};
	
	/**
	 * MouseButtonTrigger: Constructor function for a mousebutton trigger
	 * 
	 * @param   {InputAction} action         Action, trigger belongs to
	 * @param   {number}      buttonCode     MouseButtonState for the trigger
	 * @param   {number}      state          KeyState for the trigger
	 * @param   {boolean}     obligatory     If it is obligatory trigger (necessary for action to succeed)
	 * @param   {Array}       input          Additional input data
	 */
	function MouseButtonTrigger(action, buttonCode, state, obligatory, input)
	{
		this.action = action;
		this.buttonCode = buttonCode;
		this.state = state;
		this.input = input;
		this.obligatory = (obligatory === true) ? true : false;
		
		if(this.input && action.result.length < input.length)
		{
			for(var i = action.result.length - 1; i < input.length; ++i)
				action.result[i] = 0;
		}
	}
	
	MouseButtonTrigger.prototype = {
		constructor: MouseButtonTrigger,
		
		/**
		 * Checks if the trigger is active
		 * 
		 * @returns {boolean} True if active, otherwise false
		 */
		check: function check()
		{
			if(InputCore.isMouseButton(this.buttonCode, this.state))
			{
				if(this.input)
				{
					for(var i = 0; i < this.input.length; ++i)
						this.action.result[i] += this.input[i];
				}
				return true;
			}
			return false;
		}
	};
	
	/**
	 * MouseMoveTrigger: Constructor function for a mousemove trigger
	 * 
	 * @param   {InputAction} action         Action, trigger belongs to
	 * @param   {boolean}     obligatory     If it is obligatory trigger (necessary for action to succeed)
	 * @param   {Array}       input          Additional input data
	 */
	function MouseMoveTrigger(action, obligatory, input)
	{
		this.action = action;
		this.input = input;
		this.obligatory = (obligatory === true) ? true : false;
		
		action.result[0] = 0;
		action.result[1] = 0;
	}
	
	MouseMoveTrigger.prototype = {
		constructor: MouseMoveTrigger,
		
		/**
		 * Checks if the trigger is active
		 * 
		 * @returns {boolean} True if active, otherwise false
		 */
		check: function check()
		{
			var mouseRel = InputCore.mousePosRel;
			if(mouseRel.x !== 0 || mouseRel.y !== 0)
			{
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
				
				return true;
			}
			return false;
		}
	};
	
	//function TriggerGroup()
	//{
	//	
	//}
	//
	//TriggerGroup.prototype = {
	//	constructor: TriggerGroup,
	//	
	//	
	//};
	
	/**
	 * InputAction: Constructor function for an InputAction with the given name
	 * 
	 * @param   {string} name Name of the action
	 */
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
		
		/**
		 * Runs the callbacks of this action
		 */
		runCallbacks: function runCallbacks()
		{
			for(var i = 0; i < this.callbacks.length; ++i)
				this.callbacks[i](action, this.result);
		},
		
		/**
		 * Adds a trigger to the action
		 * 
		 * @param   {InputTrigger} trigger  Trigger to add
		 * 
		 * @returns {InputTrigger} The added trigger
		 */
		addTrigger: function addTrigger(trigger)
		{
			this.triggers.push(trigger);
			return trigger;
		},
		
		/**
		* Adds a keyboard-trigger to the action
		* 
		* @param   {number}      keyCode     KeyCode for the trigger
		* @param   {number}      state       KeyState for the trigger
		* @param   {boolean}     obligatory  If it is obligatory trigger (necessary for action to succeed)
		* @param   {Array}       input       Additional input data
		*/
		addKeyboardTrigger: function addKeyboardTrigger(keyCode, state, obligatory, input)
		{
			var trigger = new KeyboardTrigger(this, keyCode, state, obligatory, input);
			this.triggers.push(trigger);
			return trigger;
		},
		
		/**
		* Adds a mousebutton-trigger to the action
		* 
		* @param   {number}      buttonCode     MouseButtonState for the trigger
		* @param   {number}      state          KeyState for the trigger
		* @param   {boolean}     obligatory     If it is obligatory trigger (necessary for action to succeed)
		* @param   {Array}       input          Additional input data
		*/
		addMouseButtonTrigger: function addMouseButtonTrigger(mbCode, state, obligatory, input)
		{
			var trigger = new MouseButtonTrigger(this, mbCode, state, obligatory, input);
			this.triggers.push(trigger);
			return trigger;
		},
		
		/**
		* Adds a mousemove-trigger to the action
		* 
		* @param   {boolean}     obligatory     If it is obligatory trigger (necessary for action to succeed)
		* @param   {Array}       input          Additional input data
		*/
		addMouseMoveTrigger: function addMouseMoveTrigger(obligatory, input)
		{
			var trigger = new MouseMoveTrigger(this, obligatory, input);
			this.triggers.push(trigger);
			return trigger;
		},
		
		/**
		 * Checks if the action succeeds
		 * 
		 * @returns {boolean} True if active, otherwise false
		 */
		check: function check()
		{
			this.isTriggered = false;
			
			// reset result
			for(var i = 0; i < this.result.length; ++i)
				this.result[i] = 0;
			
			// check triggers
			for(var i = 0; i < this.triggers.length; ++i)
			{
				if(this.triggers[i].check())
				{
					this.isTriggered = true;
				}
				else
				{
					if(this.triggers[i].obligatory)
					{
						this.isTriggered = false;
						break;
					}
				}
			}
			
			// run callbacks
			if(this.isTriggered)
				this.runCallbacks();
		},
		
	};
	
	InputAction.KeyboardTrigger = KeyboardTrigger;
	InputAction.MouseButtonTrigger = MouseButtonTrigger;
	InputAction.MouseMoveTrigger = MouseMoveTrigger;
	InputAction.TriggerGroup = TriggerGroup;
	
	
	InputAction.initModule = function initModule(inputCore)
	{
		InputCore = inputCore;
	}
	
	exports.InputAction = InputAction;
	
});