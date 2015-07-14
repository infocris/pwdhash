(function () {

var $P = function (id) {
	var o = new (function (e) {
		this.htmlElement = e;
		this.click = function (fn) { e.addEventListener('click', fn); return o; };
		this.blur = function (fn) { e.addEventListener('blur', fn); return o; };
		this.keyup = function (fn) { e.addEventListener('keyup', fn); return o; };
		this.html = function (a1) {
			e.innerHTML = a1;
		}
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

$('#pwdhashEnabled').hide();
$('#pwdhashDisabled').show();

var sendRequest = function (params, callback) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, params, callback);
	});
};

var old_domain;
var default_domain;

sendRequest({controller: 'AlternativeDomain', action: "getDomain"}, function(response) {
	$('#domain').val(response.domain);
	old_domain = response.domain;
	default_domain = response.defaultDomain;
	$('#domainTitle').html(default_domain);
	$('#pwdhashEnabled').show();
	$('#pwdhashDisabled').hide();
});

var save_domain = function () {
	sendRequest({controller: 'AlternativeDomain',
		action: "setDomain",
		domain: $('#domain').val()}
	, function () {
		old_domain = $('#domain').val();
	});
};

var set_default_domain = function () {
	$('#domain').val(default_domain);
	if (old_domain != $('#domain').val()) {
		save_domain();
	}
};

$('#domain').keyup(function () {
	if (old_domain != $('#domain').val()) {
		save_domain();
	}
});

})();