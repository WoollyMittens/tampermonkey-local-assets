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

	const path = 'http://localhost/MY_PROJECT_NAME';

	const assets = [
		{ url: `${path}/MY_STYLES.css`, target: 'body' },
		{ url: `${path}/MY_MARKUP.html`, target: 'MY_CONTAINER' }
	];

	const removals = 'link[href*="OLD_STYLES"]';

	const escapeHTMLPolicy = window.trustedTypes.createPolicy("forceInner", {
		createHTML: (to_escape) => to_escape
	})
  
	// METHODS

	function cleanContent(asset) {
		// remove inline directives for less
		return (/less$/.test(asset.url)) ? asset.content.replace(/~"/g, '').replace(/\)";/g, ');') : asset.content;
	}

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
			asset.container = (/css|less$/.test(urls[0])) ? document.createElement('style') : document.createElement('div');
            asset.container.setAttribute('data-asset', urls[0].split('/').pop());
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
  