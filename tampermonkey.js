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

	const removals = '[data-for="mycar-chargers"]';

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

	function deleteRemovals() {
		const elements = document.querySelectorAll(removals);
		for (let element of elements) {
			element.parentNode.removeChild(element);
		}
	}

	async function importAssets() {
		for (let asset of assets) {
			let target = document.querySelector(asset.target);
            let urls = (typeof asset.url === 'string') ? [asset.url] : asset.url;
			// remove any the old content from the target
			if (asset.container) asset.container.parentNode.removeChild(asset.container);
			// load new content into target
            asset.content = '';
            for (let url of urls) { asset.content += await loadAsset(url) }
			asset.container = (/css|less$/.test(asset.url)) ? document.createElement('style') : document.createElement('div');
            if(asset.media) asset.container.setAttribute('media', asset.media);
			asset.container.innerHTML = escapeHTMLPolicy.createHTML(asset.content);
			target.appendChild(asset.container);
		}
	}
  
	// EVENTS

	deleteRemovals();
	importAssets();
  
	window.addEventListener('keyup', function(evt) {
	  if (evt.key === '`' || evt.key === '~') {
		importAssets();
	  }
	});
  
  })();
  