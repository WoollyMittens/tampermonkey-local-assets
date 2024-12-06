// ==UserScript==
// @name         Local Assets: Rowe Scientific
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Cache-bust all the things
// @author       maurice.vancreij@webqem.com
// @include      *://rowe.staging.webqem.net/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

(function() {

	'use strict';

	// CONDITIONS

	if (/admin/.test(document.location.href)){ return false; }
	else { window.tampered = true; }

	// PROPERTIES

    const path = 'http://localhost/Tampermonkey/rowe-scientific/css/components';

	const assets = [
        { url: 'http://localhost/Tampermonkey/rowe-scientific/reset/styles-m.min.css', target: 'body' },
        { url: 'http://localhost/Tampermonkey/rowe-scientific/reset/styles-l.min.css', target: 'body', media: 'screen and (min-width: 768px)' },
		{
            url: [
                `${path}/common.css`,
                `${path}/slick-slider.css`,
                `${path}/usp.css`,
                `${path}/header.css`,
                `${path}/header-compare.css`,
                `${path}/header-quickorder.css`,
                `${path}/header-guest.css`,
                `${path}/header-registered.css`,
                `${path}/header-hamburger.css`,
                `${path}/header-logo.css`,
                `${path}/header-minicart.css`,
                `${path}/header-search.css`,
                `${path}/navigation.css`,
                `${path}/breadcrumbs.css`,
                `${path}/messages.css`,
                `${path}/page-bottom.css`,
                `${path}/footer.css`,
                `${path}/footer-locations.css`,
                `${path}/footer-legal.css`,
                `${path}/footer-copyright.css`,
                `${path}/footer-credit.css`,
                `${path}/home.css`,
                `${path}/home-hero.css`,
                `${path}/home-laboratories-we-service.css`,
                `${path}/home-specials.css`,
                `${path}/home-latest-news.css`,
                `${path}/home-ctas.css`,
                `${path}/home-our-partners.css`,
                `${path}/category.css`,
                `${path}/category-compare.css`,
                `${path}/category-filter.css`,
                `${path}/category-hero.css`,
                `${path}/category-list.css`,
                `${path}/category-products-grid.css`,
                `${path}/category-products-list.css`,
                `${path}/category-related.css`,
                `${path}/category-toolbar.css`,
                `${path}/category-wishlist.css`
               ],
            target: 'body'
        }
	];

	const removals = 'link[href*="styles-"]';

	const escapeHTMLPolicy = window.trustedTypes.createPolicy("forceInner", {
		createHTML: (to_escape) => to_escape
	});

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
