/*
  * File : AlternativeDomain.js
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
    
    AlternativeDomain allow to use an alternative domain as salt.
    It can be set by the pwdhash button in Google Toolbar.
*
*/


/**
  Required : null.js
**/

var AlternativeDomain = (function () {
	var console = NullConsole;
	
	var Self = function (get_default) {
		var self = this;
		
		this.setDomain = function (value) {
			var domain = get_default();
			var domains = {};
			try {
				domains = JSON.parse(localStorage['domains']);
				if (domain != value) {
					domains[domain] = value;
				} else {
					delete domains[domain];
				}
			} catch (e) {
				domains = {};
				console.log(e);
			}
			console.dir(domains);
			try {
				localStorage['domains'] = JSON.stringify(domains);
			} catch (e) {
				console.log(e);
			}
		};
		this.getDomain = function () {
			var domain = get_default();
			try {
				var domains = JSON.parse(localStorage['domains']);
				if (domains[domain] != undefined) {
					return domains[domain];
				}
			} catch (e) {
				console.log(e);
			}
			return domain;
		};
		
		chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
			if (request.controller != 'AlternativeDomain') return;
			
			try {
				if (request.action == "getDomain") {
					sendResponse({domain: self.getDomain(), defaultDomain: get_default()});
					
				} else if (request.action == "setDomain") {
					self.setDomain(request.domain);
					sendResponse({ok: true});
				}
			} catch (e) {
				console.log(e);
			}
		});
	};
	
	return Self;
}) ();
