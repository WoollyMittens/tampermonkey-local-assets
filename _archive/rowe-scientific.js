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

    const path = 'http://localhost:5500';

	const assets = [
        { url: `${path}/reset/styles-m.min.css`, target: 'body' },
        { url: `${path}/reset/styles-l.min.css`, target: 'body', media: 'screen and (min-width: 768px)' },
		{
            url: [
                `${path}/css/source/components/fonts.css`,
                `${path}/css/source/components/common.css`,
                `${path}/css/source/components/slick-slider.css`,
                `${path}/css/source/components/usp.css`,
                `${path}/css/source/components/header.css`,
                `${path}/css/source/components/header-compare.css`,
                `${path}/css/source/components/header-quickorder.css`,
                `${path}/css/source/components/header-guest.css`,
                `${path}/css/source/components/header-registered.css`,
                `${path}/css/source/components/header-hamburger.css`,
                `${path}/css/source/components/header-logo.css`,
                `${path}/css/source/components/header-minicart.css`,
                `${path}/css/source/components/header-search.css`,
                `${path}/css/source/components/navigation.css`,
                `${path}/css/source/components/breadcrumbs.css`,
                `${path}/css/source/components/messages.css`,
                `${path}/css/source/components/page-bottom.css`,
                `${path}/css/source/components/footer.css`,
                `${path}/css/source/components/footer-locations.css`,
                `${path}/css/source/components/footer-legal.css`,
                `${path}/css/source/components/footer-copyright.css`,
                `${path}/css/source/components/footer-credit.css`,
                `${path}/css/source/components/home.css`,
                `${path}/css/source/components/home-hero.css`,
                `${path}/css/source/components/home-laboratories-we-service.css`,
                `${path}/css/source/components/home-specials.css`,
                `${path}/css/source/components/home-latest-news.css`,
                `${path}/css/source/components/home-ctas.css`,
                `${path}/css/source/components/home-our-partners.css`,
                `${path}/css/source/components/category.css`,
                `${path}/css/source/components/category-compare.css`,
                `${path}/css/source/components/category-filter.css`,
                `${path}/css/source/components/category-hero.css`,
                `${path}/css/source/components/category-list.css`,
                `${path}/css/source/components/category-products-grid.css`,
                `${path}/css/source/components/category-products-list.css`,
                `${path}/css/source/components/category-related.css`,
                `${path}/css/source/components/category-toolbar.css`,
                `${path}/css/source/components/category-wishlist.css`,
                `${path}/css/source/components/product.css`,
                `${path}/css/source/components/product-media.css`,
                `${path}/css/source/components/product-main.css`,
                `${path}/css/source/components/product-description.css`,
                `${path}/css/source/components/product-reviews.css`,
                `${path}/css/source/components/product-related.css`,
                `${path}/css/source/components/checkout-cart.css`,
                `${path}/css/source/components/checkout-address.css`,
                `${path}/css/source/components/checkout-payment.css`,
                `${path}/css/source/components/checkout-summary.css`
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
		let content = asset.content;
		// remove inline directives for less
		if ((/less$/.test(asset.url))) content = content.replace(/~"/g, '').replace(/\)";/g, ');');
		// complete relative urls
		content = content.replace(/url\("..\//g, `url("${path}/`);
		content = content.replace(/url\('..\//g, `url('${path}/`);
		return content;
	}

	function loadAsset(path) {
		// load the asset asynchronously
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
		// remove the unwanted elemements
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