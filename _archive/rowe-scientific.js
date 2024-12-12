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

    const domain = 'http://localhost:5500/';
    const path = 'css/source/components/';

	const assets = [
        { url: `${domain}reset/styles-m.min.css`, target: 'body' },
        { url: `${domain}reset/styles-l.min.css`, target: 'body', media: 'screen and (min-width: 768px)' },
		{
            url: [
                `${domain}${path}common.css`,
                `${domain}${path}slick-slider.css`,
                `${domain}${path}usp.css`,
                `${domain}${path}header.css`,
                `${domain}${path}header-compare.css`,
                `${domain}${path}header-quickorder.css`,
                `${domain}${path}header-guest.css`,
                `${domain}${path}header-registered.css`,
                `${domain}${path}header-hamburger.css`,
                `${domain}${path}header-logo.css`,
                `${domain}${path}header-minicart.css`,
                `${domain}${path}header-search.css`,
                `${domain}${path}navigation.css`,
                `${domain}${path}breadcrumbs.css`,
                `${domain}${path}messages.css`,
                `${domain}${path}page-bottom.css`,
                `${domain}${path}footer.css`,
                `${domain}${path}footer-locations.css`,
                `${domain}${path}footer-legal.css`,
                `${domain}${path}footer-copyright.css`,
                `${domain}${path}footer-credit.css`,
                `${domain}${path}home.css`,
                `${domain}${path}home-hero.css`,
                `${domain}${path}home-laboratories-we-service.css`,
                `${domain}${path}home-specials.css`,
                `${domain}${path}home-latest-news.css`,
                `${domain}${path}home-ctas.css`,
                `${domain}${path}home-our-partners.css`,
                `${domain}${path}category.css`,
                `${domain}${path}category-compare.css`,
                `${domain}${path}category-filter.css`,
                `${domain}${path}category-hero.css`,
                `${domain}${path}category-list.css`,
                `${domain}${path}category-products-grid.css`,
                `${domain}${path}category-products-list.css`,
                `${domain}${path}category-related.css`,
                `${domain}${path}category-toolbar.css`,
                `${domain}${path}category-wishlist.css`,
                `${domain}${path}product.css`,
                `${domain}${path}product-media.css`,
                `${domain}${path}product-main.css`,
                `${domain}${path}product-description.css`,
                `${domain}${path}product-reviews.css`,
                `${domain}${path}product-related.css`
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