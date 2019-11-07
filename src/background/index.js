import './img/icon-128.png'
import './img/icon-34.png'

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.local.set({domain: null});
});
