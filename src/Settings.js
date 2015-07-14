/*
  * File : Settings.js
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
*
*/


var Settings = (function () {
	var console = NullConsole;
	
	var Self = function () {
		this.store = function (k, v) {
			console.log(k + ' <- ' + v);
			localStorage[k] = JSON.stringify(v);
		};
		this.retrieve = function (k) {
			var v = localStorage[k];
			if (v != undefined)
				return (JSON.parse(v));
			return null;
		};
		
		var self = this;
		
		this.listen = function (channel) {
			chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
				if (request.controller != channel) return;
				
				try {
					if (request.action == "retrieve") {
						sendResponse({ok: true, value: self.retrieve(request.key)});
						
					} else if (request.action == "store") {
						self.store(request.key, request.value);
						sendResponse({ok: true});
					}
				} catch (e) {
					sendResponse({ok: false});
					console.log(e);
				}
			});
		};
	}
	
	Self.Remote = function (channel) {
		this.retrieve = function (k, fn) {
			chrome.extension.sendRequest({
				controller: channel,
				action: 'retrieve',
				key: k
			}, function(response) {
				if (fn) fn(response.value);
			});
		}
		this.store = function (k, val, fn) {
			chrome.extension.sendRequest({
				controller: channel,
				action: 'store',
				key: k,
				value: val
			}, function(response) {
				if (fn) fn(response.value);
			});
		}
	}
	
	return Self;
}) ();
