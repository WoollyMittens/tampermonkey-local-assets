// ==UserScript==
// @name         Local Assets: Five Senses
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Cache-bust all the things
// @author       maurice.vancreij@webqem.com
// @include      *://*.fivesenseseducation.com.au/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

(function() {

	'use strict';

	// CONDITIONS

	if (/admin/.test(document.location.href)){ return false; }
	else { window.tampered = true; }

	// PROPERTIES

    const path = 'http://localhost:5500/source/components';

	const assets = [
        { url: 'http://localhost:5500/css/styles-m.min.css', target: 'body' },
        { url: 'http://localhost:5500/css/styles-l.min.css', target: 'body', media: 'screen and (min-width: 768px)' },
		{
            url: [
                `${path}/global.less`,
                `${path}/header.less`,
                `${path}/minicart.less`,
                `${path}/navigation.less`,
                `${path}/messages.less`,
                `${path}/footer.less`,
                `${path}/breadcrumbs.less`,
                `${path}/product-items.less`,
                `${path}/widget-product-carousel.less`,
                `${path}/modal-popup.less`,
                `${path}/home-ctas.less`,
                `${path}/home-intro.less`,
                `${path}/home-latestblogs.less`,
                `${path}/home-mostsearched.less`,
                `${path}/home-promises.less`,
                `${path}/home-recommends.less`,
                `${path}/home-toysandgames.less`,
                `${path}/home-years.less`,
                `${path}/landing-hero.less`,
                `${path}/grade-buttons.less`,
                `${path}/subject-accordion.less`,
                `${path}/catalog-category-view.less`,
                `${path}/sidebar-main.less`,
                `${path}/sidebar-additional.less`,
                `${path}/toolbar-products.less`,
                `${path}/products-grid.less`,
                `${path}/products-list.less`,
                `${path}/catalog-product-compare.less`,
                `${path}/catalog-product-view.less`,
                `${path}/product-media.less`,
                `${path}/product-info-main.less`,
                `${path}/product-upsell.less`,
                `${path}/cart.less`,
                `${path}/cart-coupon.less`,
                `${path}/checkout.less`,
                `${path}/customer-account.less`,
                `${path}/customer-account-login.less`,
                `${path}/customer-account-wishlist.less`,
                `${path}/booklists.less`
               ],
            target: 'body'
        }
	];

	const removals = 'link[href*="styles-"]';

	const escapeHTMLPolicy = window.trustedTypes.createPolicy("forceInner", {
		createHTML: (to_escape) => to_escape
	});

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
			asset.container = (/css|less$/.test(asset.url)) ? document.createElement('style') : document.createElement('div');
            if(asset.media) asset.container.setAttribute('media', asset.media);
			asset.container.innerHTML = escapeHTMLPolicy.createHTML(cleanContent(asset));
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
