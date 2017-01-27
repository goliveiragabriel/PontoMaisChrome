"use strict";

var query = { active: true, currentWindow: true };
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;


function onUpdateTab(tabId, changeInfo, tab) {
    // Carrega pelo webservice as informações de Urls
    chrome.pageAction.show(tabId);
}

chrome.tabs.onUpdated.addListener(onUpdateTab);

