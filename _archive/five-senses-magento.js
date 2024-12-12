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

    const path = 'http://localhost:5500/';

	const assets = [
        { url: `${path}reset/styles-m.min.css`, target: 'body' },
        { url: `${path}reset/styles-l.min.css`, target: 'body', media: 'screen and (min-width: 768px)' },
		{
            url: [
                `${path}css/global.less`,
                `${path}css/header.less`,
                `${path}css/minicart.less`,
                `${path}css/navigation.less`,
                `${path}css/messages.less`,
                `${path}css/footer.less`,
                `${path}css/breadcrumbs.less`,
                `${path}css/product-items.less`,
                `${path}css/widget-product-carousel.less`,
                `${path}css/modal-popup.less`,
                `${path}css/home-ctas.less`,
                `${path}css/home-intro.less`,
                `${path}css/home-latestblogs.less`,
                `${path}css/home-mostsearched.less`,
                `${path}css/home-promises.less`,
                `${path}css/home-recommends.less`,
                `${path}css/home-toysandgames.less`,
                `${path}css/home-years.less`,
                `${path}css/landing-hero.less`,
                `${path}css/grade-buttons.less`,
                `${path}css/subject-accordion.less`,
                `${path}css/catalog-category-view.less`,
                `${path}css/sidebar-main.less`,
                `${path}css/sidebar-additional.less`,
                `${path}css/toolbar-products.less`,
                `${path}css/products-grid.less`,
                `${path}css/products-list.less`,
                `${path}css/catalog-product-compare.less`,
                `${path}css/catalog-product-view.less`,
                `${path}css/product-media.less`,
                `${path}css/product-info-main.less`,
                `${path}css/product-upsell.less`,
                `${path}css/cart.less`,
                `${path}css/cart-coupon.less`,
                `${path}css/checkout.less`,
                `${path}css/customer-account.less`,
                `${path}css/customer-account-login.less`,
                `${path}css/customer-account-wishlist.less`,
                `${path}css/booklists.less`
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
