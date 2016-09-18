/*
  * File : KeyHooker.js
  * Author : Christophe Liou Kee On
  * Created on : 06/02/2010
  
    License :
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Description :
    
    KeyHooker help to intercept keyboard event.
*
*/

var KeyHooker = (function () {

var dconsole = NullConsole;
if (false) {
	dconsole = (function (consoleScript) {
		return {
			log: function (a0, a1, a2) { console.log(consoleScript, a0, a1, a2); },
			error: function (a0, a1, a2) { console.error(consoleScript, a0, a1, a2); },
			warn: function (a0, a1, a2) { console.warn(consoleScript, a0, a1, a2); }
		};
	})('[KeyHooker.js]');
}

const VK_RETURN = 13;
const VK_BACKSPACE = 8;
const VK_NUM_0 = 48;
const VK_DIVIDE = 111;
const VK_CAPSLOCK = 20;

var KBListeners = {
	listeners: {},
	addListener: function (handle) {
		dconsole.log('ADD - KBListeners Length: ', this.listeners);
		if (typeof this.listeners[handle.instanceNo] == 'undefined') {
			this.listeners[handle.instanceNo] = handle;
		}
	},
	removeListener: function (handle) {
		dconsole.log('REMOVE - KBListeners Length: ', this.listeners);
		delete this.listeners[handle.instanceNo];
	},
};
var KBListenerHandler = function (e) {
	dconsole.log();
	for (var i in KBListeners.listeners) {
		KBListeners.listeners[i].handleEvent(e);
	}
};

var KeyHookerInstanceCount = 0;

window.addEventListener('keydown', KBListenerHandler, true);
window.addEventListener('keyup', KBListenerHandler, true);
window.addEventListener('keypress', KBListenerHandler, true);

var ComplexKeyHooker = (function () {
	var CHAR_LIST = 'AZERTYUIOPQSDFGHJKLMWXCVBNazertyuiopqsdfghjklmwxcvbn0123456789';
	var idListener;
	var Self = function (field) {
		this.value = '';
		this.charmap = {};
		this.instanceNo = KeyHookerInstanceCount++;
		this.intercept = function() {
			dconsole.log('intercept');
			KBListeners.addListener(this);
		};
		this.unIntercept = function() {
			dconsole.log('unIntercept');
			KBListeners.removeListener(this);
		};
		this.mask = function (c) {
			var i;
			do {
				i = Math.floor(Math.random() * CHAR_LIST.length);
			} while (typeof this.charmap[CHAR_LIST[i]] != 'undefined');
			var m = CHAR_LIST[i];
			this.charmap[m] = c;
			this.value += c;
			dconsole.log(c + ' -> ' + m);
			return m;
		},
		this.handleEvent = function(e) {
			//dconsole.log('[PwdHash] ' + e.type + ': ' + e.keyCode + ' ' + String.fromCharCode(e.keyCode));
			
			if (e.generatedByKeyHooker) {
				dconsole.log('intercept a generatedByKeyHooker');
				return;
			}
			
			if(e.type == 'keydown' || e.type == 'keyup')
			{
				if (!(VK_NUM_0 <= e.keyCode && e.keyCode <= VK_DIVIDE)) {
					return;
				}
				//dconsole.log('Keydown KeyUp events');
				e.stopImmediatePropagation();   // Don't let user JavaScript see this event
			}
			
			if(e.type == 'keypress' || e.keyCode == 0) {
				if (e.keyCode <= VK_CAPSLOCK) {
					return;
				}
				
				//dconsole.log('Printable intercepted');
				var c = String.fromCharCode(e.charCode);
				e.stopImmediatePropagation();   // Don't let user JavaScript see this event
				e.preventDefault();    // Do not let the character hit the page
				var m = this.mask(c);
				Self.fire(e.target, m);
			}
		};
		this.setHashedPassword = function (str) {
			dconsole.log("setHashPassword: " + str);
			this.value = '';
			field.value = str;
		};
		this.setPassword = function (str) {
			dconsole.log("setPassword: " + str);
			this.value = '';
			field.value = '';
			this.charmap = {};
			for (var i = 0; i < str.length; i += 1) {
				var m = this.mask(str[i]);
				Self.fire(field, m);
			}
		};
		this.getValue = function () {
			if (this.value == '') {
				return field.value;
			}
			
			var res = '';
			for (var i = 0; i < field.value.length; i += 1) {
				res += this.charmap[field.value[i]];
			}
			dconsole.log("Field: " + field.value);
			dconsole.log("Password: " + res);
			return res;
		};
	}
	
	Self.fire = function(target, str) {
		// DOM 3 keyboard event doc : http://dev.w3.org/2006/webapi/DOM-Level-3-Events/html/DOM3-Events.html#events-Events-KeyboardEvent-initKeyboardEvent
		// Solution found : http://stackoverflow.com/questions/345454/how-can-i-generate-a-keypress-event-in-safari-with-javascript
		
		var value = target.value;
		var err, eventObject;
		try {
			eventObject = document.createEvent('TextEvent');
			eventObject.initTextEvent('textInput', true, true, null, str);
			eventObject.generatedByKeyHooker = true;
			target.dispatchEvent(eventObject);
		} catch (err) {
		}
		
		// fallback method if all above failed
		if (value == target.value) {
			target.value += str;
		}
	};

	return Self;
}) ();

return ComplexKeyHooker;

var SimpleKeyHooker = (function () {
	var Self = function (field) {
		this.value = '';
		this.instanceNo = KeyHookerInstanceCount++;
		this.intercept = function() {
			KBListeners.addListener(this);
		};
		this.unIntercept = function() {
			KBListeners.removeListener(this);
		};
		this.handleEvent = function(e) {
			if (e.generatedByKeyHooker || e.keyCode == VK_RETURN) {
				return;
			}
			
			if (e.type == 'keyup' && e.keyCode == VK_BACKSPACE) {
				this.value = '';
			}
			
			if((e.type == 'keydown' || e.type == 'keyup') &&
				e.keyCode >= e.DOM_VK_0 && e.keyCode <= e.DOM_VK_DIVIDE) {
				e.stopImmediatePropagation();   // Don't let user JavaScript see this event
			}
			
			if(e.type == 'keypress' || e.keyCode == 0) {
				var c = String.fromCharCode(e.charCode);
				this.value += c;
				e.stopImmediatePropagation();   // Don't let user JavaScript see this event
				e.preventDefault();    // Do not let the character hit the page
			}
		};
		this.setHashedPassword = function (str) {
			field.value = str;
		};
		this.setPassword = function (str) {
			field.value = '';
		};
		this.getValue = function () {
			return this.value;
		};
	}
	
	Self.fire = function(target, charCode) {};

	return Self;
}) ();

return SimpleKeyHooker;

})();
