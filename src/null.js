
var NullFunction = function(){};
var NullConsole = {dir: function(){}, log: function(){}};
//~ var NullConsole = {dir: function(){}, log: function(e){ console.log(e);}};

var NullKeyHooker = function (field) {
	this.intercept = NullFunction;
	this.unIntercept = NullFunction;
	this.setHashedPassword = function (str) {
		field.value = str;
	};
	this.setPassword = function (str) {
		field.value = '';
	};
	this.getValue = function () {
		return field.value;
	};
};
