// ==UserScript==
// @name         Local Assets
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Cache-bust all the things
// @author       maurice.vancreij@webqem.com
// @include      *://*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

(function() {

	'use strict';
  
	// CONDITIONS
  
	if (/admin/.test(document.location.href)){ return false; }
	else { window.tampered = true; }
  
	// PROPERTIES

	const assets = [
		{ url: 'http://localhost/Tampermonkey/mycar-ecommerce/html/chargers.css', target: 'body' }
	];

	const escapeHTMLPolicy = window.trustedTypes.createPolicy("forceInner", {
		createHTML: (to_escape) => to_escape
	})
  
	// METHODS

	function loadAsset(path) {
		const promise = new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method : "GET",
				url : `${path}?t=${new Date().getTime()}`,
				onload : (response) => { resolve(response.responseText); },
				onerror: (response) => { reject(response); }
			});
		});
		return promise;
	}

	async function importAssets() {
		for (let asset of assets) {
			let target = document.querySelector(asset.target);
			// remove any the old content from the target
			if (asset.container) asset.container.parentNode.removeChild(asset.container);
			// load new content into target
			asset.content = await loadAsset(asset.url);
			asset.container = (/css$/.test(asset.url)) ? document.createElement('style') : document.createElement('div');
			asset.container.innerHTML = escapeHTMLPolicy.createHTML(asset.content);
			target.appendChild(asset.container);
		}
	}
  
	// EVENTS
  
	importAssets();
  
	window.addEventListener('keyup', function(evt) {
	  if (evt.key === '`' || evt.key === '~') {
		importAssets();
	  }
	});
  
  })();
  