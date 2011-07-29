"use strict";


ModuleSystem.registerModule(function(require, exports){
	
	var InputCore = {
		
		keysDown: {},
		
		_keysPressedCollector: {},
		_keysReleasedCollector: {},
		
		keysPressed: {},
		keysReleased: {},
		
		KEY_STATE_DOWN: 0,
		KEY_STATE_UP: 1,
		KEY_STATE_PRESSED: 2,
		KEY_STATE_RELEASED: 3,
		
		mouseButtonsDown: {},
		
		_mouseButtonsPressedCollector: {},
		_mouseButtonsReleasedCollector: {},
		
		mouseButtonsPressed: {},
		mouseButtonsReleased: {},
		
		MOUSEBUTTON_STATE_DOWN: 0,
		MOUSEBUTTON_STATE_UP: 1,
		MOUSEBUTTON_STATE_PRESSED: 2,
		MOUSEBUTTON_STATE_RELEASED: 3,
		
		init: function init(domKeyEventReceiver, domMouseEventReceiver)
		{
			this.domKeyEventReceiver = domKeyEventReceiver;
			$(this.domKeyEventReceiver).keydown(this.onKeydown.bind(this));
			$(this.domKeyEventReceiver).keyup(this.onKeyup.bind(this));
			
			this.jdomMouseEventReceiver = $(domMouseEventReceiver);
			this.jdomMouseEventReceiver.mousedown(this.onMousedown.bind(this));
			this.jdomMouseEventReceiver.mouseup(this.onMouseup.bind(this));
			this.jdomMouseEventReceiver.mousemove(this.onMousemove.bind(this));
			this.jdomMouseEventReceiver.mouseenter(this.onMouseenter.bind(this));
			this.jdomMouseEventReceiver.mouseleave(this.onMouseleave.bind(this));
			
			this.jdomMouseEventReceiver.currPos = this.jdomMouseEventReceiver.position();
		},
		
		_createKey: function _createKey(keyCode)
		{
			var key = {
				down: false,
				pressed: false,
				released: false,
				keyCode: keyCode
			};
			
			this.keys[keyCode] = key;
			
			return key;
		},
		
		
		onKeydown: function onKeydown(event)
		{
			this.keysDown[event.keyCode] = true;
			this._keysPressedCollector[event.keyCode] = true;
			
			log("key is down " + event.keyCode);
		},
		
		onKeyup: function onKeyup(event)
		{
			this.keysDown[event.keyCode] = false;
			this._keysReleasedCollector[event.keyCode] = true;
			
			log("key is up " + event.keyCode);
		},
		
		isKeyDown: function isKeyDown(keyCode)
		{
			return (this.keysDown[keyCode]) ? true : false;
		},
		
		isKeyUp: function isKeyUp(keyCode)
		{
			return (this.keysDown[keyCode]) ? false : true;
		},
		
		isKeyPressed: function isKeyPressed(keyCode)
		{
			return (this.keysPressed[keyCode]) ? true : false;
		},
		
		isKeyReleased: function isKeyReleased(keyCode)
		{
			return (this.keysReleased[keyCode]) ? true : false;
		},
		
		/* TODO: performance 
		   
		*/
		isKey: function isKey(keyCode, keyState)
		{
			switch(keyState)
			{
				case this.KEY_STATE_DOWN: 		return this.isKeyDown(keyCode); break;
				case this.KEY_STATE_UP: 		return this.isKeyUp(keyCode); break;
				case this.KEY_STATE_PRESSED:	return this.isKeyPressed(keyCode); break;
				case this.KEY_STATE_RELEASED:	return this.isKeyReleased(keyCode); break;
				
			}
			
			return false;
		},
		
		onMousedown: function onMousedown(event)
		{
			this.mouseButtonsDown[event.which] = true;
			this._mouseButtonsPressedCollector[event.which] = true;
			
			log("mouse is down " + event.which);
		},
		
		onMouseup: function onMouseup(event)
		{
			this.mouseButtonsDown[event.which] = false;
			this._mouseButtonsReleasedCollector[event.which] = true;
			
			log("mouse is up " + event.which);
		},
		
		_mousePosCurr: Vector3.fromPool(),
		mousePos: Vector3.fromPool(),
		mousePosRel: Vector3.fromPool(),
		
		
		onMousemove: function onMousemove(event)
		{
			this._mousePosCurr.x = event.pageX - this.jdomMouseEventReceiver.currPos.left;
			this._mousePosCurr.y = event.pageY - this.jdomMouseEventReceiver.currPos.top;
		},
		
		onMouseenter: function onMouseenter(event)
		{
		},
		
		onMouseleave: function onMouseleave(event)
		{
		},
		
		isMouseButtonDown: function isMouseButtonDown(mouseButtonCode)
		{
			return (this.mouseButtonsDown[mouseButtonCode]) ? true : false;
		},
		
		isMouseButtonUp: function isMouseButtonUp(mouseButtonCode)
		{
			return (this.mouseButtonsDown[mouseButtonCode]) ? false : true;
		},
		
		isMouseButtonPressed: function isMouseButtonPressed(mouseButtonCode)
		{
			return (this.mouseButtonsPressed[mouseButtonCode]) ? true : false;
		},
		
		isMouseButtonReleased: function isMouseButtonReleased(mouseButtonCode)
		{
			return (this.mouseButtonsReleased[mouseButtonCode]) ? true : false;
		},
		
		/* TODO: performance 
		   
		*/
		isMouseButton: function isMouseButton(mouseButtonCode, mouseButtonState)
		{
			switch(mouseButtonState)
			{
				case this.MOUSEBUTTON_STATE_DOWN: 		return this.isMouseButtonDown(mouseButtonCode); break;
				case this.MOUSEBUTTON_STATE_UP: 		return this.isMouseButtonUp(mouseButtonCode); break;
				case this.MOUSEBUTTON_STATE_PRESSED:	return this.isMouseButtonPressed(mouseButtonCode); break;
				case this.MOUSEBUTTON_STATE_RELEASED:	return this.isMouseButtonReleased(mouseButtonCode); break;
				
			}
			
			return false;
		},
		
		actions: {},
		
		
		/*addAction: function addAction(action)
		{
			// TODO: check if already exists
			this.actions[action.name] = action;
		},*/
		
		getAction: function getAction(name)
		{
			if(!this.actions[name])
				this.actions[name] = new (this.InputAction)(name);
				
			return this.actions[name];
		},
		
		
		/*
		 *
		 */
		destroy: function destroy()
		{
			
		},
		
		/*
		 *
		 */
		update: function update(dt)
		{
			// updating the pressed released collectors
			this.keysPressed = this._keysPressedCollector;
			this.keysReleased = this._keysReleasedCollector;
			this._keysPressedCollector = {};
			this._keysReleasedCollector = {};
			
			this.mouseButtonsPressed = this._mouseButtonsPressedCollector;
			this.mouseButtonsReleased = this._mouseButtonsReleasedCollector;
			this._mouseButtonsPressedCollector = {};
			this._mouseButtonsReleasedCollector = {};
			
			// updating mouse position
			this.mousePosRel.x = this._mousePosCurr.x - this.mousePos.x;
			this.mousePosRel.y = this._mousePosCurr.y - this.mousePos.y;
			
			this.mousePos.x = this._mousePosCurr.x;
			this.mousePos.y = this._mousePosCurr.y;
			
			
			for(var key in this.actions)
				this.actions[key].check();
			
		},

		
	};
	
	InputCore.InputAction = ModuleSystem.require("Engine.Input.InputAction").InputAction;
	InputCore.InputAction.initModule(InputCore);

	exports.InputCore = InputCore;
	
});