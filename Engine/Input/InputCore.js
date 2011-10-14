"use strict";


ModuleSystem.registerModule("Engine/Input/InputCore", function(require, exports){
	
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
		
		MOUSEBUTTON_LEFT: 1,
		
		MOUSEBUTTON_STATE_DOWN: 0,
		MOUSEBUTTON_STATE_UP: 1,
		MOUSEBUTTON_STATE_PRESSED: 2,
		MOUSEBUTTON_STATE_RELEASED: 3,
		
		/**
		 * Initializes the input core
		 * 
		 * @param   {element} domKeyEventReceiver   DOMElement for receiving key events
		 * @param   {element} domMouseEventReceiver DOMElement for receiving mouse events
		 */
		init: function init(domKeyEventReceiver, domMouseEventReceiver)
		{
			this.domKeyEventReceiver = domKeyEventReceiver;
			$(this.domKeyEventReceiver).keydown(this.onKeydown.bind(this));
			$(this.domKeyEventReceiver).keyup(this.onKeyup.bind(this));
			
			this.jdomMouseEventReceiver = $(domMouseEventReceiver);
			this.jdomMouseEventReceiver.mousedown(this.onMousedown.bind(this));
			this.jdomMouseEventReceiver.mouseup(this.onMouseup.bind(this));
			//this.jdomMouseEventReceiver.mousemove(this.onMousemove.bind(this)); // TODO: bottleneck
			domMouseEventReceiver.addEventListener("mousemove", this.onMousemove.bind(this), true);
			this.jdomMouseEventReceiver.mouseenter(this.onMouseenter.bind(this));
			this.jdomMouseEventReceiver.mouseleave(this.onMouseleave.bind(this));
			
			this.jdomMouseEventReceiver.currPos = this.jdomMouseEventReceiver.position();
		},
		
		// TODO: remove
		//_createKey: function _createKey(keyCode)
		//{
		//	var key = {
		//		down: false,
		//		pressed: false,
		//		released: false,
		//		keyCode: keyCode
		//	};
		//	
		//	this.keys[keyCode] = key;
		//	
		//	return key;
		//},
		
		// ===================================
		// ------------ KEYBOARD -------------
		// ===================================
		
		/**
		 * Called when key goes down
		 * 
		 * @param   {KeyEvent} event  KeyEvent
		 */
		onKeydown: function onKeydown(event)
		{
			this.keysDown[event.keyCode] = true;
			this._keysPressedCollector[event.keyCode] = true;
			
			//log("key is down " + event.keyCode);
		},
		
		/**
		 * Called when key goes up
		 * 
		 * @param   {KeyEvent} event  KeyEvent
		 */
		onKeyup: function onKeyup(event)
		{
			this.keysDown[event.keyCode] = false;
			this._keysReleasedCollector[event.keyCode] = true;
			
			//log("key is up " + event.keyCode);
		},
		
		/**
		 * Checks if the given key is down
		 * 
		 * @param   {number} keyCode Key to check
		 * 
		 * @returns {boolean} True if down, otherwise false
		 */
		isKeyDown: function isKeyDown(keyCode)
		{
			return (this.keysDown[keyCode]) ? true : false;
		},
		
		/**
		 * Checks if the given key is up
		 * 
		 * @param   {number} keyCode Key to check
		 * 
		 * @returns {boolean} True if up, otherwise false
		 */
		isKeyUp: function isKeyUp(keyCode)
		{
			return (this.keysDown[keyCode]) ? false : true;
		},
		
		/**
		 * Checks if the given key is pressed
		 * 
		 * @param   {number} keyCode Key to check
		 * 
		 * @returns {boolean} True if pressed, otherwise false
		 */
		isKeyPressed: function isKeyPressed(keyCode)
		{
			return (this.keysPressed[keyCode]) ? true : false;
		},
		
		/**
		 * Checks if the given key is released
		 * 
		 * @param   {number} keyCode Key to check
		 * 
		 * @returns {boolean} True if released, otherwise false
		 */
		isKeyReleased: function isKeyReleased(keyCode)
		{
			return (this.keysReleased[keyCode]) ? true : false;
		},
		
		/**
		 * Checks if the given key is in the given state
		 * TODO: performance
		 * 
		 * @param   {number} keyCode   Key to check
		 * @param   {number} keyState  State to check
		 * 
		 * @returns {boolean} True if in state, otherwise false
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
		
		// ===================================
		// -------------- MOUSE --------------
		// ===================================
		
		/**
		 * Called when mousebutton goes down
		 * 
		 * @param   {MouseEvent} event  MouseEvent
		 */
		onMousedown: function onMousedown(event)
		{
			this.mouseButtonsDown[event.which] = true;
			this._mouseButtonsPressedCollector[event.which] = true;
			
			//log("mouse is down " + event.which);
		},
		
		/**
		 * Called when mousebutton goes up
		 * 
		 * @param   {MouseEvent} event  MouseEvent
		 */
		onMouseup: function onMouseup(event)
		{
			this.mouseButtonsDown[event.which] = false;
			this._mouseButtonsReleasedCollector[event.which] = true;
			
			//log("mouse is up " + event.which);
		},
		
		_mousePosCurr: Vector3.fromPool(),
		mousePos: Vector3.fromPool(),
		mousePosRel: Vector3.fromPool(),
		mousePosWS: Vector3.fromPool(),
		mousePosRelWS: Vector3.fromPool(),
		
		/**
		 * Called when mouse was moved
		 * 
		 * @param   {MouseEvent} event  MouseEvent
		 */
		onMousemove: function onMousemove(event)
		{
			// todo: crossbrowser
			this._mousePosCurr.x = event.layerX;
			this._mousePosCurr.y = event.layerY;
			//log("" + this._mousePosCurr)
			//log(event)
		},
		
		/**
		 * Called when the mouse entered the viewport
		 * 
		 * @param   {MouseEvent} event  MouseEvent
		 */
		onMouseenter: function onMouseenter(event)
		{
		},
		
		/**
		 * Called when the mouse left the viewport
		 * 
		 * @param   {MouseEvent} event  MouseEvent
		 */
		onMouseleave: function onMouseleave(event)
		{
		},
		
		/**
		 * Checks if the given mousebutton is down
		 * 
		 * @param   {number} mouseButtonCode MouseButton to check
		 * 
		 * @returns {boolean} True if down, otherwise false
		 */
		isMouseButtonDown: function isMouseButtonDown(mouseButtonCode)
		{
			return (this.mouseButtonsDown[mouseButtonCode]) ? true : false;
		},
		
		/**
		 * Checks if the given mousebutton is up
		 * 
		 * @param   {number} mouseButtonCode MouseButton to check
		 * 
		 * @returns {boolean} True if up, otherwise false
		 */
		isMouseButtonUp: function isMouseButtonUp(mouseButtonCode)
		{
			return (this.mouseButtonsDown[mouseButtonCode]) ? false : true;
		},
		
		/**
		 * Checks if the given mousebutton is pressed
		 * 
		 * @param   {number} mouseButtonCode MouseButton to check
		 * 
		 * @returns {boolean} True if pressed, otherwise false
		 */
		isMouseButtonPressed: function isMouseButtonPressed(mouseButtonCode)
		{
			return (this.mouseButtonsPressed[mouseButtonCode]) ? true : false;
		},
		
		/**
		 * Checks if the given mousebutton is released
		 * 
		 * @param   {number} mouseButtonCode MouseButton to check
		 * 
		 * @returns {boolean} True if released, otherwise false
		 */
		isMouseButtonReleased: function isMouseButtonReleased(mouseButtonCode)
		{
			return (this.mouseButtonsReleased[mouseButtonCode]) ? true : false;
		},
		
		/**
		 * Checks if the given mousebutton is in the given state
		 * TODO: performance
		 * 
		 * @param   {number} mouseButtonCode   Mousebutton to check
		 * @param   {number} mouseButtonState  State to check
		 * 
		 * @returns {boolean} True if in state, otherwise false
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
		
		/**
		 * Returns the action with the given name
		 *   - will create action if not existing
		 * 
		 * @param   {string} name  Name of the action
		 * 
		 * @returns {InputAction}  Action found or created
		 */
		getAction: function getAction(name)
		{
			if(!this.actions[name])
				this.actions[name] = new (this.InputAction)(name);
				
			return this.actions[name];
		},
		
		
		/**
		 * Destroys the InputCore
		 */
		destroy: function destroy()
		{
			
		},
		
		/**
		 * Updates the InputCore
		 * 
		 * @param   {number} dt Time since last frame (in s)
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
			//this.mousePosRelWS.x = this.mousePosRel.x;
			//this.mousePosRelWS.y = -this.mousePosRel.y;
			
			this.mousePos.x = this._mousePosCurr.x;
			this.mousePos.y = this._mousePosCurr.y;
			
			for(var key in this.actions)
				this.actions[key].check();
			
		},
		
	};
	
	InputCore.InputAction = require("InputAction").InputAction;
	InputCore.InputAction.initModule(InputCore);

	exports.InputCore = InputCore;
	
});