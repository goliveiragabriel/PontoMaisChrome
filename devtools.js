/*
	TESTE
*/
chrome.devtools.network.onNavigated.addListener(function(url){
	var url = url;
	chrome.devtools.network.onRequestFinished.addListener(function(request){
		alert("TESTE");
	});
});