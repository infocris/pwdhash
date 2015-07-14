
document.addEventListener('DOMContentLoaded', function () {

var $P = function (id) {
	var o = new (function (e) {
		this.click = function (fn) { e.addEventListener('click', fn); return o; };
		this.blur = function (fn) { e.addEventListener('blur', fn); return o; };
		this.keyup = function (fn) { e.addEventListener('keyup', fn); return o; };
		this.val = function (a1) {
			if (a1 == undefined) {
				if (e.type == 'checkbox')
					return e.checked; 
					else return e.value; 
			}
			if (e.type == 'checkbox') {
				e.checked = a1;
			}
				else e.value = a1;
			
			return o;
		};
	})(document.getElementById(id));
	return o;
};

var settings = new Settings.Remote('GlobalSettings');
var old_setting_values = {};
$('.setting').each(function () {
	var setting = $(this);
	var k = setting.attr('id');
	old_setting_values[k] = false;
	try {
		settings.retrieve(k, function (value) {
			old_setting_values[k] =  value;
			$P(k).val(value == null ? false : value);
		});
	} catch (e) {
		console.error('init_setting error');
	}
	setting.click(function () {
		settings.store(k, $P(k).val());
	});
});

});