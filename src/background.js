
var settings = new Settings();
settings.listen('GlobalSettings');

if (settings.retrieve('hideIcon')) {
	browser.pageAction.hide();
}

var iconActionType = 'pageAction';

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.controller != 'Background_HTML') return;
	try {
		if (request.action == "setPwdHashIconOn") {
			if (!settings.retrieve('hideIcon')) {
				//browser.tabs.getSelected(null, function(tab) {
					browser.pageAction.setIcon({
						tabId: sender.tab.id,
						path: "images/icon19on.png"
					});
				//});
			}
			sendResponse({ok: true});

		} else if (request.action == "setPwdHashIconOff") {
			if (!settings.retrieve('hideIcon')) {
				//browser.tabs.getSelected(null, function(tab) {
					browser.pageAction.setIcon({
						tabId: sender.tab.id,
						path: "images/icon19off.png"
					});
				//});
			}
			sendResponse({ok: true});

		} else if (request.action == "showPwdHashIcon") {
			if (!settings.retrieve('hideIcon')) {
				//browser.tabs.getSelected(null, function(tab) {
					browser.pageAction.show(sender.tab.id);
				//});
			}
			sendResponse({ok: true});
		}


	} catch (e) {
		sendResponse({ok: false});
		console.log(e);
	}
});
