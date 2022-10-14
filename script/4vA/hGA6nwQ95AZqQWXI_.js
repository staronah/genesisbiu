var $ = jQuery;

// Get ueid parameter from URL or Header Parameters.
var current_url = new URL(location.href);
var ueid_url_param = current_url.searchParams.get("ueid");
if (ueid_url_param) {
	ueid = ueid_url_param;
} else if (typeof window.ueid !== "undefined") {
	ueid = window.sessionStorage.getItem('amg_ueid');
} else {
	function parseHttpHeaders(httpHeaders) {
		return httpHeaders.split("\n")
			.map(x => x.split(/: */, 2))
			.filter(x => x[0])
			.reduce((ac, x) => {
				ac[x[0]] = x[1];
				return ac;
			}, {});
	}

	var req = new XMLHttpRequest();
	if (typeof amgGaObj.ajaxurl !== "undefined") {
		req.open('GET', amgGaObj.ajaxurl + '/wp-json/amg/v2/get-header-variable', false);
		req.send(null);
		if (typeof req.response !== "undefined") {
			ueid = req.response.replace(/['"]+/g, '');
		}
	}
}

(function ($) {
	jQuery(document).ready(function () {
		add_target_blank_to_external_links();
	});

	function add_target_blank_to_external_links() {
		$('a[href^="http"]').not('a[href*="' + location.hostname + '"]').attr({target: "_blank", rel: "noopener"});
	}
})(jQuery);

var searchApi = amgAdFrontObj.searchApi;

window.dataLayer = window.dataLayer || [];

var settings = JSON.parse(amgAdFrontObj.relatedSearchSettingJson);
var default_rtb = amgAdFrontObj.default_rtb;
var seo_rtb = amgAdFrontObj.seo_rtb;

/* JS Cookie setting function */
!function (e, t) {
	"object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self, function () {
		var n = e.Cookies, r = e.Cookies = t();
		r.noConflict = function () {
			return e.Cookies = n, r
		}
	}())
}(this, function () {
	"use strict";

	function e(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) e[r] = n[r]
		}
		return e
	}

	var t = {
		read: function (e) {
			return e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
		}, write: function (e) {
			return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent)
		}
	};
	return function n(r, o) {
		function i(t, n, i) {
			if ("undefined" != typeof document) {
				"number" == typeof (i = e({}, o, i)).expires && (i.expires = new Date(Date.now() + 864e5 * i.expires)), i.expires && (i.expires = i.expires.toUTCString()), t = encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), n = r.write(n, t);
				var c = "";
				for (var u in i) i[u] && (c += "; " + u, !0 !== i[u] && (c += "=" + i[u].split(";")[0]));
				return document.cookie = t + "=" + n + c
			}
		}

		return Object.create({
			set: i, get: function (e) {
				if ("undefined" != typeof document && (!arguments.length || e)) {
					for (var n = document.cookie ? document.cookie.split("; ") : [], o = {}, i = 0; i < n.length; i++) {
						var c = n[i].split("="), u = c.slice(1).join("=");
						'"' === u[0] && (u = u.slice(1, -1));
						try {
							var f = t.read(c[0]);
							if (o[f] = r.read(u, f), e === f) break
						} catch (e) {
						}
					}
					return e ? o[e] : o
				}
			}, remove: function (t, n) {
				i(t, "", e({}, n, {expires: -1}))
			}, withAttributes: function (t) {
				return n(this.converter, e({}, this.attributes, t))
			}, withConverter: function (t) {
				return n(e({}, this.converter, t), this.attributes)
			}
		}, {attributes: {value: Object.freeze(o)}, converter: {value: Object.freeze(r)}})
	}(t, {path: "/"})
});

/* Generate unique id */
function page_uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

!function () {
	var e, o, t = /\+/g, n = /([^&=]+)=?([^&]*)/g, u = function (e) {
		return decodeURIComponent(e.replace(t, " "))
	}, m = location.search.substring(1);
	for (e = {}; o = n.exec(m);) e[u(o[1])] = u(o[2]);
	["utm_source", "utm_subid", "utm_campaign", "utm_template", "utm_medium", "utm_term", "utm_content"].forEach(function (o) {
		void 0 !== e[o] && (Cookies.remove(o), void 0 !== e[o] && Cookies.set(o, e[o]))
	})
}();


/**
 *  Google Related ads.
 */
try {
	var url = new URL(location.href);
	var utm_content = url.searchParams.get("utm_content");
	var embedded_qo = null;

	if (utm_content) {
		// look for utm_content override vars
		var tmp = utm_content.split(':');
		if (tmp[0] == 'params') {
			var var_list = tmp[1].split('&');
			var allowed_list = ['ad', 'an', 'ag', 'o', 'rch', 'qo'];
			var_list.forEach(function (a) {
				tmp = a.split('=');
				allowed_list.forEach(function (b) {
					if (tmp[0] == b) {
						if (b == 'qo') {
							embedded_qo = tmp[1];
						} else {
							Cookies.set('iac_' + tmp[0], tmp[1]);
						}
					}
				})
			});
		}
	}

	var o_parm = url.searchParams.get("o");
	var rtb_parm = url.searchParams.get("rtb");
	if (url.searchParams.get("ad")) Cookies.set('iac_ad', url.searchParams.get("ad"));
	if (url.searchParams.get("an")) Cookies.set('iac_an', url.searchParams.get("an"));
	if (o_parm) Cookies.set('iac_o', o_parm);
	if (url.searchParams.get("ag")) Cookies.set('iac_ag', url.searchParams.get("ag"));
	if (url.searchParams.get("rch")) Cookies.set('iac_rch', url.searchParams.get("rch"));

	// For Bing Ad.
	if (rtb_parm) Cookies.set('rtb', rtb_parm);

	var appvars = {
		ad: url.searchParams.get("ad") || Cookies.get('iac_ad') || 'dirN',
		an: url.searchParams.get("an") || Cookies.get('iac_an'),
		ag: url.searchParams.get("ag") || Cookies.get('iac_ag'),
		o: o_parm || Cookies.get('iac_o') || settings.default_o_code,
		rch: url.searchParams.get("rch") || Cookies.get('iac_rch'),
		rtb: rtb_parm || Cookies.get('rtb') || default_rtb, // For Bing Ad.

		utm_medium: Cookies.get('utm_medium'),
		utm_campaign: Cookies.get('utm_campaign'),
		utm_subid: Cookies.get('utm_subid'),
		partner: '',
		qo: url.searchParams.get("qo") || embedded_qo || undefined,
		gclid: url.searchParams.get("gclid")
	}

	var SEO_REFERERS = [
		"google.*",
		"search.yahoo.*",
		"bing.*",
		"baidu.*",
		"yandex.*",
		"search.aol.com"
	];

	SEO_REFERERS.forEach(function (a) {
		var r = document.referrer.search(a);
		if (r > 0) {
			appvars.ad = 'SEO';
			appvars.o = settings.seo_o_code;
			Cookies.set('iac_o',  settings.seo_o_code );
			appvars.rtb = seo_rtb;
			Cookies.set('rtb',  seo_rtb );

		}
	});

	if(  !o_parm && !Cookies.get('iac_o')  ){
		Cookies.set('iac_o',  settings.default_o_code );
	}

	if(  !rtb_parm && !Cookies.get('rtb')  ){
		Cookies.set('rtb',  default_rtb );
	}

	if (typeof (settings.origin_code[appvars.o]) != 'undefined') {
		appvars.google_client = settings.origin_code[appvars.o].google_client;
		appvars.google_rs_style_id = settings.origin_code[appvars.o].google_rs_style_id;
		appvars.google_channel = settings.origin_code[appvars.o].google_channel;
		appvars.partner = settings.origin_code[appvars.o].partner;
		appvars.rs_ads_to_show = settings.origin_code[appvars.o].rs_ads_to_show;
	} else {
		appvars.google_client = settings.default_google_client;
		appvars.google_rs_style_id = settings.default_google_rs_style_id;
		appvars.google_channel = settings.default_google_channel;
		appvars.rs_ads_to_show = settings.default_rs_ads_to_show;
		appvars.partner = '';
	}

	if (appvars.rch) {
		appvars.google_channel = appvars.rch;
	}

	var cat1 = cat2 = undefined;
	var page_uuid = page_uuid();
	cat1 = amgAdFrontObj.cat1 ? amgAdFrontObj.cat1 : undefined;
	cat2 = amgAdFrontObj.cat2 ? amgAdFrontObj.cat2 : undefined;

	var domain = amgAdFrontObj.domain;

	var pageType = '';
	var title = '';
	if ($('body').hasClass('home')) {
		pageType = 'home';
		title = document.title;
	} else if ($('body').hasClass('category')) {
		pageType = 'category';
		title = document.title;
	} else if ($('body').hasClass('single')) {
		pageType = 'contentPage';
		title = amgAdFrontObj.title;
	}

	// global search pass params for serach page
	var ad = '', an = '', o = '', ag = '', qo = '', rch = '', rtb = '', uniqueid = '';
	if (appvars.ad) ad = '&ad=' + appvars.ad;
	if (appvars.an) an = '&an=' + appvars.an;
	if (appvars.o) o = '&o=' + appvars.o;
	if (appvars.ag) ag = '&ag=' + appvars.ag;
	if (appvars.qo) qo = '&qo=' + appvars.qo;
	if (appvars.rch) rch = '&rch=' + appvars.rch;

	// For Bing Ad.
	if (appvars.rtb) rtb = '&rtb=' + appvars.rtb;

	// google rs initialization
	var rs_qo = '&qo=' + (url.searchParams.get("qo") || 'contentGoogleRelatedSearch');

	// pass ueid for search suggestions.
	if( ueid && '' !== ueid ) uniqueid = "&ueid=" + ueid;

	//AMG Ad callback
	window.amgAds = window.amgAds || {};
	window.amgAds.adsLoadedCallback = function (err, divId) {
		if (err !== null) {
			$("#" + divId).css("height", "0");
		}
	}
} catch (e) {
	console.log("error on init", e);
}


$.fn.isInViewport = function () {
	let elementTop = $(this).offset().top;
	let elementBottom = elementTop + $(this).outerHeight();

	let viewportTop = $(window).scrollTop();
	let viewportBottom = viewportTop + $(window).height();

	return elementBottom > viewportTop && elementTop < viewportBottom;
};
// On scroll till section 3, display sidebar.
const viewport_height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
var tricky_observer = new IntersectionObserver(function (entries, observer) {
	entries.forEach(function (entry) {
		if (entry.isIntersecting) {
			$('.single-post-right-part .global-site-ad').show();
			return
		}
		if (entry.boundingClientRect.top > 0) {
			$('.single-post-right-part .global-site-ad').hide();
		}
	});
}, {rootMargin: '0px 0px -' + (viewport_height - 100) + 'px 0px'});

jQuery(document).ready(function () {
	var trigger_slide = $('.section-scroll-heading');
	if (trigger_slide.length > 0) {
		tricky_observer.observe(trigger_slide[0]);
	}
});
/*
 * Inject Lead Management Code.
 */
jQuery(window).load(function () {

	if (typeof amgLeadGenerationAdObj !== "undefined") {
		var sitePath = '';
		if (amgLeadGenerationAdObj.currentBlog.siteurl.indexOf('askmoney') !== -1) {
			sitePath = 'askmoney';
		}
		if (amgLeadGenerationAdObj.currentBlog.siteurl.indexOf('questionsanswered') !== -1) {
			sitePath = 'questionsanswered';
		}
		if (amgLeadGenerationAdObj.currentBlog.siteurl.indexOf('symptomfind') !== -1) {
			sitePath = 'symptomfind';
		}
		if (amgLeadGenerationAdObj.currentBlog.siteurl.indexOf('thehealthfeed') !== -1) {
			sitePath = 'thehealthfeed';
		}

		var ni_var1 = '';
		var ni_ad_client = '';
		var ni_trn_id = '';
		var ad_placeholder_dom = '';
		var placeholder = '';
		var i = '';
		var j = '';
		switch (sitePath) {
			case "askmoney":
				if ('credit-cards' === amgLeadGenerationAdObj.postCategory || amgLeadGenerationAdObj.isFront) {
					if (typeof sh !== "undefined") {
						ad_placeholder_dom = document.querySelectorAll("[class*=credit-card-widget]");
						elementLoop:
							for (i = 0; i < ad_placeholder_dom.length; i++) {
								placeholder = ad_placeholder_dom[i];
								classLoop:
									for (j = 0; j < placeholder.classList.length; j++) {
										if (placeholder.classList[j].match(/^credit-card-widget/)) {
											ni_var1 = appvars.o;
											ni_ad_client = placeholder.getAttribute('data-client-id');
											ni_trn_id = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);

											sh.initialize({"src": ni_ad_client, "var1": ni_var1, "trn_id": ni_trn_id, "inventorytype": "cc-multistepwidget"}, placeholder.id);

											continue elementLoop;
										}
									}
							}
					}
				} else if ('budgeting' === amgLeadGenerationAdObj.postCategory || 'investing' === amgLeadGenerationAdObj.postCategory) {
					if (typeof sh !== "undefined") {
						ad_placeholder_dom = document.querySelectorAll("[class*=investment-banking-widget]");
						elementLoop:
							for (i = 0; i < ad_placeholder_dom.length; i++) {
								placeholder = ad_placeholder_dom[i];
								classLoop:
									for (j = 0; j < placeholder.classList.length; j++) {
										if (placeholder.classList[j].match(/^investment-banking-widget/)) {
											var matchingConfiguration = {
												"src": placeholder.getAttribute('data-client-id'),
												"var1": appvars.o,
												"var2": "",
												"var3": "",
												"trn_id": "",
												"rp": "17",
												"investmentpurpose": "growth",
												"options": {"features": ["form"]}
											};

											sh.initialize(matchingConfiguration, placeholder.id);

											continue elementLoop;
										}
									}
							}
					}
				}
				break;

			case "questionsanswered":
				if ('autos' === amgLeadGenerationAdObj.postCategory) {

					ad_placeholder_dom = document.querySelectorAll("[class*=auto-insurance-widget]");
					elementLoop:
						for (i = 0; i < ad_placeholder_dom.length; i++) {
							placeholder = ad_placeholder_dom[i];
							classLoop:
								for (j = 0; j < placeholder.classList.length; j++) {
									if (placeholder.classList[j].match(/^auto-insurance-widget/)) {
										ni_var1 = appvars.o;
										ni_ad_client = placeholder.getAttribute('data-client-id');
										ni_trn_id = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);

										sh.initialize({"src": ni_ad_client, "var1": ni_var1, "trn_id": ni_trn_id, "inventorytype": "incontent"}, placeholder.id);

										continue elementLoop;
									}
								}
						}

				}
				break;

			case "symptomfind":
			case "thehealthfeed":
				ad_placeholder_dom = document.querySelectorAll("[class*=health-insurance-widget]");
				elementLoop:
					for (i = 0; i < ad_placeholder_dom.length; i++) {
						placeholder = ad_placeholder_dom[i];
						classLoop:
							for (j = 0; j < placeholder.classList.length; j++) {
								if (placeholder.classList[j].match(/^health-insurance-widget/)) {
									ni_var1 = appvars.o;
									ni_ad_client = placeholder.getAttribute('data-client-id');
									ni_trn_id = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);

									sh.initialize({"src": ni_ad_client, "var1": ni_var1, "trn_id": ni_trn_id, "inventorytype": "incontent"}, placeholder.id);

									continue elementLoop;
								}
							}
					}

				break;
		}
	}
});

/**
 * GTM events.
 */
var condition_true = '';
if( "undefined" !== typeof amgAdFrontObj.domain
	&&  -1 === amgAdFrontObj.domain.indexOf('symptomfind')
	&&  -1 === amgAdFrontObj.domain.indexOf('thehealthfeed')
	&&  -1 === amgAdFrontObj.domain.indexOf('askmoney')
	&& -1 === amgAdFrontObj.domain.indexOf('greensearches')
	&& -1 === amgAdFrontObj.domain.indexOf('humanely')
	&&  -1 === amgAdFrontObj.domain.indexOf('ask') ) {
	condition_true = 1;
}

 if( '' !== condition_true){
	$('a').on('click', function () {
		var content_id = $(this).data('content-id');
		var result_type = $(this).data('result-type');
		var zone = $(this).data('zone');
		var provider_source = $(this).data('provider-source');

		if (result_type && zone) {
			window.dataLayer.push({
				'event': 'article-clickthrough',
				'contentId': content_id,
				'providerSource': provider_source,
				'resultType': result_type,
				'zone': zone,
				'ordinal': '1'
			});
		}
	});

	// navigation-result-impression.
	window.dataLayer.push({
		'event': 'navigation-result-impression',
		'navigation_searchbox_header_resultsDisplayed': '1',
		'navigation_logo_header_resultsDisplayed': '1',
		'navigation_navigation_footer_resultsDisplayed': '1',
		'navigation_navigation_header_resultsDisplayed': '1'
	});

	// trending-article-impression  event.
	var trendingArticlesRightResultsDisplayed = $('.trending-articles-block .tile-item').length;
	var trendingArticlesCenterResultsDisplayed = $('body').hasClass('single') ? $('.latest-articles-block .tile-item').length : undefined;
	window.dataLayer.push({
		'event': 'trending-article-impression',
		'content_trendingArticles_right_resultsDisplayed': trendingArticlesRightResultsDisplayed,
		'content_trendingArticles_center_resultsDisplayed': trendingArticlesCenterResultsDisplayed
	});

	// taxonomy-impression event - Revised.
	 var bodyContainer = $('body');
	 if (bodyContainer.hasClass('category') || bodyContainer.hasClass('home') ) {

		 var primary_menu_count = $("#primary-menu li").length;
		 var sub_menu_count = $(".sub-menu li").length;
		 var taxonomyTopResults = primary_menu_count - sub_menu_count;

		 var cat_page_subcats = $('.category-btn li').length;
		 var taxonomyCenterResults = cat_page_subcats ? cat_page_subcats : $('.article-nav-list li').length;

		 window.dataLayer.push({
			 'event': 'taxonomy-impression',
			 'taxonomy_taxonomy_bottom_resultsDisplayed': $('.menu-footer-category-menu-container ul li').length,
			 'taxonomy_taxonomy_center_resultsDisplayed': taxonomyCenterResults,
			 'taxonomy_taxonomy_top_resultsDisplayed': taxonomyTopResults
		 });
	 }

	// social-result-impression event.
	if ($('body').hasClass('single')) {

		// social-result-impression event.
		window.dataLayer.push({
			event: "social-result-impression",
			socialLink_socialLink_center_resultsDisplayed: "1",
			socialLink_socialLink_bottom_resultsDisplayed: "1"
		});

		// view-article-section event.
		window.dataLayer.push({
			'event': 'view-article-section'
		});


		// article-link-click event.
		$('.single .single-post-left-part a').on('click', function (a) {
			var $target = $(a.target);
			if (!$target.closest('.PartialSocialLinks-link').length && !$target.closest('.twitter-share-button-svg').length) {
				window.dataLayer.push({
					'event': 'article-link-click'
				});
			}
		})
	} else {
		// social-result-impression event.
		window.dataLayer.push({
			event: "social-result-impression",
			socialLink_socialLink_bottom_resultsDisplayed: "1"
		});
	}

	// article-tile-impressio event for Home page    // NEED TO UPDATE VALUE
	if ($('body').hasClass('home')) {
		var latestTileLength = $('.latest-articles-block .tile-item').length;
		latestTileLength = latestTileLength ? latestTileLength : 0;
		var articleByCategoryTileLength = $('.articles-by-category-block .tile-item').length;
		articleByCategoryTileLength = articleByCategoryTileLength ? articleByCategoryTileLength : 0;

		window.dataLayer.push({
			'event': 'article-tile-impression',
			'content_articleTiles_center_resultsDisplayed': latestTileLength + articleByCategoryTileLength
		});
	}

	// content-covidbanner-impression for ASK.com Home Page
	if (0 < $('.covid-banner ').length) {
		var covidBannerCount = $('.covid-banner .covidBanner').length;
		window.dataLayer.push({
			'event': 'content-covidbanner-impression',
			'content_covidBanner_top_resultsDisplayed': covidBannerCount,
		});
	}

	// content-page-display-loaded event.
	dataLayer.push({'event': 'content-page-display-loaded'});

}


// Convert First Anchor tag to BuyNow button in product block.
if (0 < $('.askmedia-product-column-wrapper').length) {
	$('.askmedia-product-column-wrapper').each(function (e) {
		var mainAnchor = $(this).find('.askmedia-product-column-right p a').first();
		var link = $(this).find('.askmedia-product-column-right p a').first().attr('href');
		var dataAttribute = $(this).find('.askmedia-product-column-right p a').first().attr('data-amzn-asin');
		var imageToLink = $(this).find('.askmedia-product-column-left .product-image img');
		const getHostname = (url) => {
			return new URL(url).hostname;
		}

		if (link !== undefined) {

			var hostname = getHostname(link);

			var hostnameArr = hostname.split(".");
			var hostnameMiddle = '';

			if (hostnameArr.length === 3) {
				hostnameMiddle = hostnameArr[1];
			} else {
				hostnameMiddle = hostnameArr[0];
			}

			if (hostnameMiddle === "amazon" || hostnameMiddle === "amzn" || hostnameMiddle === "ebay") {

				mainAnchor.attr('target', '_blank');
				mainAnchor.attr('onclick', "window.open(this.href, 'newwindow', 'width=2000,height=1000'); return false;");

				//For default tag
				var new_url = '';
				if (link.indexOf("tag=") > -1) {
					new_url = link;
				} else {
					if (hostnameMiddle === "amazon" || hostnameMiddle === "amzn") {
						var url = new URL(link);
						var search_params = url.searchParams;
						search_params.set('tag', 'amgpush-20');
						url.search = search_params.toString();
						new_url = url.toString();
						mainAnchor.attr('href', new_url);
					} else {
						new_url = link;
					}
				}

				var onClickAttr = 'onclick="';
				var onClickVal = "window.open(this.href, 'newwindow', 'width=2000,height=1000'); return false;"
				var imgopen = onClickAttr + onClickVal + '"';
				var imgAsin = '';
				if (dataAttribute !== undefined) {
					imgAsin = 'data-amzn-asin="' + dataAttribute + '"';
				}

				var productImage = $(this).find('.askmedia-product-column-left figure img');
				// imageToLink.wrap("<a target='_blank' href='" + new_url + "'" + imgAsin + imgopen + "></a>");
				let imageLinkAnchor = document.createElement('a');
				//imageLinkAnchor.innerHTML = productImage.html();
				imageLinkAnchor.setAttribute('href', new_url);
				imageLinkAnchor.setAttribute('target', '_blank');
				imageLinkAnchor.setAttribute('onclick', "window.open(this.href, 'newwindow', 'width=2000,height=1000'); return false;");
				if (dataAttribute !== undefined) {
					imageLinkAnchor.setAttribute('data-amzn-asin', dataAttribute);
				}
				productImage[0].parentNode.insertBefore(imageLinkAnchor, productImage[0].parentNode.firstChild);
				imageLinkAnchor.appendChild(productImage[0])


				var mainDiv = $(this).find('.wp-block-column:first-child');

				var buttonsDiv = document.createElement('div');
				buttonsDiv.className = 'wp-block-buttons product-buy-now';

				var buttonDiv = document.createElement('div');
				buttonDiv.className = 'wp-block-button';

				let buttonLink = document.createElement('a');
				buttonLink.innerText = "Buy Now";
				buttonLink.className = 'wp-block-button__link';
				buttonLink.setAttribute('href', new_url);
				buttonLink.setAttribute('target', '_blank');
				buttonLink.setAttribute('onclick', "window.open(this.href, 'newwindow', 'width=2000,height=1000'); return false;");
				if (dataAttribute !== undefined) {
					buttonLink.setAttribute('data-amzn-asin', dataAttribute);
				}

				buttonDiv.appendChild(buttonLink);
				buttonsDiv.appendChild(buttonDiv);
				mainDiv[0].appendChild(buttonsDiv);

			}

		}
	});
}


function greensearchSubmit(search){

	search = decodeURI(search);
	if( search && ( "undefined" !== typeof amgAdFrontObj.domain ) && ( -1 !== amgAdFrontObj.domain.indexOf('greensearches') || -1 !== amgAdFrontObj.domain.indexOf('humanely') ) ){
		$('.search-form .ask-top-search-box').val(search);
		$('.search-form').submit();

	}
}

/**
 * Search Functionality.
 */
if( "undefined" !== typeof amgAdFrontObj.domain && -1 === amgAdFrontObj.domain.indexOf('greensearches') && -1 === amgAdFrontObj.domain.indexOf('humanely') ){
	$('.search-form').on('submit', function (e) {
		e.preventDefault();
		var search = $(this).find('.search-box').val();

		if (search.length > 0 ) {
			if( 'none' !== $(this).find('.search-box').css('display') && $('.search-col').hasClass( 'search_open') ){
				location.href = domain + '/Student_Register.aspx?matric_no=' + search;
			} else {
				$('.search-box').show();
			}
			// $('.search-box').val('');
		} else {
			if ($(this).find('.search-box').css('display') === 'none') {
				$(this).find('.search-box').toggle('fast');
			} else {
				$('.mobile-hamburger').parent().addClass('d-block').show();
			}
		}

	});
}

// suggested search
var search_box = $('.search-box');
var isSelected	=	false;

search_box.on('keydown', function (event) {
	var key = event.originalEvent.key;
	if (key === 'ArrowDown' || key === 'ArrowUp') {
		event.preventDefault();
	}

	// click dismiss handler here. NOTE: KEEP THIS INSIDE KEYDOWN EVENT, OTHERWISE ASKMONEY HOMEPAGE POPUP STOPS WORKING.
	$(document).on('click', function (event) {
		var $target = $(event.target);
		if (!$target.closest('.ac_results').length) {
			$('.ac_results').hide();
			jQuery('.ask-sub-search-col').removeClass('ac_results_visible');
			$('.ask-sub-search-col').removeClass('ask-top-search-open');
		}

		$('.ask-top-search-box').removeClass('ask-top-search-open');

		$(document).off('click');
	});
});

// Remove selected search when hover starts on suggestions.

$(document).on("mouseover", ".ac_results ul li", function () {
	$(this).parent().find('li').removeClass('selected');
    $(this).addClass('selected');
});

search_box.on('keyup', function (e) {

	if( e.keyCode !== 38 && e.keyCode !== 40 ){
		var this_search_box = $(this);
		var query = $(this).val();

		if ($(this).hasClass('ask-top-search-box')) {
			$(this).toggleClass('ask-top-search-open', true);
			$(this).parents('.ask-sub-search-col').toggleClass('ask-top-search-open', true);
		}

		if (query.length > 0 && '' !== searchApi && 'undefined' !== typeof searchApi) {

			jQuery('.ask-sub-search-col').addClass('ac_results_visible ask-top-search-open');

			$.getJSON(searchApi + '?lang=' + navigator.language + '&limit=10&q=' + query, function (d) {

				$('.ac_results ul').empty();
				d[1].forEach(function (e) {

					let suggestionSpan = document.createElement('span');
					suggestionSpan.classList.add("suggest");
					suggestionSpan.textContent = query;

					var value = e.toString().replace(query, suggestionSpan.outerHTML);
					// var searchField = $('.ac_results ul');
					var searchField = $(this_search_box).parent().find('.ac_results ul');

					if( searchField.length ) {
						var searchFieldListItem = document.createElement('a');
						searchFieldListItem.innerHTML = value;

						var search = encodeURIComponent(e);

						if( search && ( "undefined" !== typeof amgAdFrontObj.domain ) && ( -1 !== amgAdFrontObj.domain.indexOf('greensearches') || -1 !== amgAdFrontObj.domain.indexOf('humanely') ) ){

						//searchFieldListItem.setAttribute('data-href', domain + '/web?q=' + search + ad + an + o + ag + qo);
						searchFieldListItem.setAttribute('data-href', domain + '/web?q=' + search + rtb + o );
						searchFieldListItem.setAttribute( 'onclick', 'greensearchSubmit("'+search+'");' );
					} else {
						searchFieldListItem.setAttribute('href', domain + '/web?q=' + search + ad + an + o + ag + qo + uniqueid);
					}
					var searchFieldList = document.createElement('li');
					searchFieldList.setAttribute('class', 'selectable');
					searchFieldList.appendChild(searchFieldListItem);

						searchField[0].appendChild(searchFieldList);
					}

				});

				$(this_search_box).parent().find('.ac_results').show();
			});
		} else {
			$('.ac_results').hide();
			jQuery('.ask-sub-search-col').removeClass('ac_results_visible');
			if ($(this).hasClass('ask-top-search-box')) {
				$(this).removeClass('ask-top-search-open');
				$(this).parents('.ask-sub-search-col').removeClass('ask-top-search-open');
			}
		}

		var result_list = $('.ac_results ul li').length;
		if( result_list == 0 ) {
			jQuery('.ask-sub-search-col').removeClass('ac_results_visible');
		}

	}
	else {
		if( $('.ac_results ul li').length > 0 ){
            var index = 0;
            if( $('.ac_results ul li.selected').length > 0 ){
                index = $('.ac_results ul li.selected').index();
				if( e.keyCode === 38 ){
					index--;
				}
				if( e.keyCode === 40 ){
					index++;
				}
            }else{
                index = 0;
            }
            $('.ac_results ul').find('li').removeClass('selected');
            $(".ac_results ul li").eq(index).addClass("selected");
			var selectedText = $('.ac_results ul li.selected').text();
			$('input.search-box').val(selectedText);

		}
	}
});

if (0 < $(".two-column_ads").length) {
	$(".two-column_ads").find(".global-site-ad").addClass('two-column-ad-view')
}

var div_top = $('#right-sidebar-ads').length > 0 ? $('#right-sidebar-ads').offset().top : 0;
$(window).scroll(() => {
	var window_top = $(window).scrollTop();
	var footer_top = $("footer").offset().top;
	var div_height = $("#right-sidebar-ads").height();
	var footerHeight  = $('footer').outerHeight() + 30;

	if ((window_top + div_height) > footer_top - 100) {
		$('#right-sidebar-ads').css('position', 'fixed');
		$('#right-sidebar-ads').css('bottom', footerHeight+'px');
		$('#right-sidebar-ads').css('top', '');
	} else if (window_top > div_top - 100) {
		$('#right-sidebar-ads').css('position', 'fixed');
		$('#right-sidebar-ads').css('top', '100px');
		$('#right-sidebar-ads').css('bottom', '');
	} else {
		$('#right-sidebar-ads').css('position', 'absolute');
		$('#right-sidebar-ads').css('top', '');
		$('#right-sidebar-ads').css('bottom', '');
	}

});

// content-share-click event.
$('a.icon-facebook, .fb-share-button-svg a.PartialSocialLinks-link').on('click', function (a) {
	// social-result-impression event.
	window.dataLayer.push({
		'event': 'content-social-share-click',
		'resultType': 'facebook',
	});
});
$('a.icon-twitter, a.twitter-share-button-svg').on('click', function (a) {
	// social-result-impression event.
	window.dataLayer.push({
		'event': 'content-social-share-click',
		'resultType': 'twitter',
	});
});
$('a.icon-instagram').on('click', function (a) {
	// social-result-impression event.
	window.dataLayer.push({
		'event': 'content-social-share-click',
		'resultType': 'instagram',
	});
});

// Append query parameter qo=slug in Header Menu, Footer Menu, Nav buttons, .
for (let a of document.querySelectorAll('#primary-menu li.menu-item-type-taxonomy a, #footer-menu li.menu-item-type-taxonomy a, .category-btn li a, .article-nav-list li a')) {
	if (a.title.length > 0) {
		a.href +=
			(a.href.match(/\?/) ? '&' : '?') +
			'qo=' + a.title;
		a.title = '';
	}
}

// Append Unique Entry ID with all anchor tags inside the site except AskMoney.
/*if( "undefined" !== typeof amgAdFrontObj.domain ) {
	if( ( -1 === amgAdFrontObj.domain.indexOf('greensearches')
			|| -1 === amgAdFrontObj.domain.indexOf('humanely')
		)
		&& -1 === amgAdFrontObj.domain.indexOf('askmoney')
		&& ueid !== "" && ueid !== null) {
		for (let a of document.querySelectorAll('a')) {
			if (a.href.indexOf(amgAdFrontObj.siteUrl) > -1 && a.href.indexOf('#') === -1) {
				a.href +=
					(a.href.match(/\?/) ? '&' : '?') +
					'ueid=' + ueid;
			}
		}
	}
}*/
;
// This file contains code for parallax system.
var $ = jQuery;

setTimeout( function () {
	try {
		const timeStamp = new Date(Date.now()).toISOString();
		var current_url = new URL(location.href);
		var list = $('a').map(function () {
			payloadResult = {};
			var contentId = $(this).data('content-id') + '';
			var zone = $(this).data('zone');
			var providerSource = $(this).data('provider-source');
			var resultType = $(this).data('result-type');
			var url = $(this).attr('href');
			var title = '';

			// Retrieve title of article from different class names and different sites.
			if ($(this).find('.tile-caption-inner').length) {
				title = $(this).find('.tile-caption-inner')[0].innerText;
				// For AskMoney Homepage Featured Articles.
				if (current_url.href.indexOf('askmoney') > -1 && amgAdFrontObj.payloadType === 'wpHome') {
					title = title.split('\n')[0];
				}
			} else if ($('.post-title').find(this).length) { // Common in all sites.
				title = $('.post-title').find(this)[0].innerText;
			} else if ($('.cont-wrap').find(this).length) { // Common in all sites.
				title = $('.cont-wrap').find(this)[0].innerText;
			} else if ($('.article-heading').find(this).length) { // Common in all sites.
				title = $('.article-heading').find(this)[0].innerText;
				// For non-ask, non-askmoney and non-symptomFind sites L1 category page.
				if (current_url.href.indexOf('askmoney') === -1 && current_url.href.indexOf('ask') === -1 && current_url.href.indexOf('symptomfind') === -1 && amgAdFrontObj.payloadType === 'wpCategory') {
					contentId = $(this).closest('.single-category-article').find('.post-thumbnail').data('content-id') + '';
					zone = $(this).closest('.single-category-article').find('.post-thumbnail').data('zone');
					providerSource = $(this).closest('.single-category-article').find('.post-thumbnail').data('provider-source');
					resultType = $(this).closest('.single-category-article').find('.post-thumbnail').data('result-type');
				}
			} else if ($('.article-item').find(this).length) { // For symptomFind L1 category page.
				title = $('.article-item').find(this)[0].innerText;
			}

			// Strip Slug of article from url
			if (typeof url === 'string') {
				var slug = url.substring(url.lastIndexOf('/') + 1);
				slug = slug.split('?')[0];
			}

			// Strip category from url
			if (typeof url === 'string') {
				var category = url.split('/')[3];
			}

			// In case Right Sidebar Trending articles don't have data attributes.
			if (typeof zone === "undefined" && typeof providerSource === "undefined" && typeof resultType === "undefined" && $(this).closest('.trending-articles-inner').length) {
				zone = 'right';
				providerSource = 'content';
				resultType = 'trendingArticles';
			}

			if (typeof contentId !== "undefined" && typeof zone !== "undefined" && typeof providerSource !== "undefined" && typeof resultType !== "undefined" && '' !== title) {
				payloadResult['contentID'] = contentId;
				payloadResult['category'] = category;
				payloadResult['domain'] = current_url.host;
				payloadResult['ordinal'] = '1';
				payloadResult['providerSource'] = providerSource;
				payloadResult['slug'] = slug;
				payloadResult['text'] = title;
				payloadResult['type'] = resultType;
				payloadResult['url'] = url;
				payloadResult['zoneName'] = zone;
			}
			return payloadResult;
		}).get();

		// Remove Empty Objects from Array
		var finalResults = list.filter(element => {
			return Object.keys(element).length !== 0;
		});

		// Push current article into payload on article page
		if (amgAdFrontObj.payloadType === 'wpArticle') {

			var author = $('.single-post-meta_author')[0].innerText.replace('By ', '');
			var article_id = $('article').attr('id').replace('post-', '');
			var article_category = current_url.pathname.split('/')[1];
			var article_title = $('.editor-post-title')[0].innerText;
			var article_slug = current_url.href.substring(current_url.href.lastIndexOf('/') + 1);
			article_slug = article_slug.split('?')[0];

			// If user comes from platinum search.
			var url_params = 'content';
			if (current_url.search.indexOf('utm_content') > -1) {
				url_params = 'serpIndex';
			}

			payloadResult['contentID'] = article_id;
			payloadResult['category'] = article_category;
			payloadResult['domain'] = current_url.host;
			payloadResult['ordinal'] = '1';
			payloadResult['providerSource'] = url_params;
			payloadResult['slug'] = article_slug;
			payloadResult['text'] = article_title;
			payloadResult['type'] = 'article';
			payloadResult['url'] = current_url.href;
			payloadResult['zoneName'] = 'center';
			payloadResult['author'] = author;

			finalResults.unshift(payloadResult);
		}

		var centerZone = 0;
		var rightZone = 0;
		for (var i = 0; i < finalResults.length; i++) {
			if (finalResults[i].zoneName === 'center') {
				finalResults[i].ordinal = centerZone++ + 1 + '';
			} else if (finalResults[i].zoneName === 'right') {
				finalResults[i].ordinal = rightZone++ + 1 + '';
			}
		}

		var parallaxPayload = {
			"appName": amgAdFrontObj.appName,
			"UEID": window.pageViewPayload.uniqueEntryId,
			"pageviewID": window.pageViewPayload.pageViewId,
			"reqUrl": current_url.host,
			"timestamp": timeStamp,
			"version": "v2",
			"payloadType": amgAdFrontObj.payloadType,
			"payload": {
				"results": finalResults
			}
		};

		// Enable parallax implementation for all sites except Symptomfind.
		if (current_url.href.indexOf('symptomfind') === -1) {
			$.ajax({
				url: 'https://parallax.askmediagroup.com/post',
				type: 'POST',
				cache: false,
				dataType: 'json',
				async: true,
				crossDomain: true,
				headers: {
					'accept': 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
				contentType: 'application/json',
				data: JSON.stringify(parallaxPayload),
			})
		}
	} catch (e) {
		console.log("error on parallax payload initialization", e);
	}
}, 2000 );
;
// gpt initialization handled by publisher
window.googletag = window.googletag || {cmd: []};
googletag.cmd.push(() => {
	googletag.pubads().disableInitialLoad();
	googletag.pubads().enableSingleRequest();
	googletag.pubads().enableAsyncRendering();
	googletag.pubads().collapseEmptyDivs(true);
	googletag.enableServices();
})

// amazon's apstag initialization
let q = (c, r) => {
	window.apstag._Q.push([c, r]);
};

window.apstag = window.apstag || {
	init: function () {
		q("i", arguments);
	},
	fetchBids: function () {
		q("f", arguments);
	},
	setDisplayBids: function () {
	},
	targetingKeys: function () {
		return [];
	},
	_Q: []
};

// configure Amazon parameters
let amazonConfig = {
	adServer: "googletag",
	bidTimeout: 1600, //set the desired timeout here
	gdpr: {cmpTimeout: 50}, //set the desired timeout here
	params: {},
	pubID: "3594",  //replace with your unique Publisher ID
	// simplerGPT: true
}

// in case there is an '__uspapi' on the page we need to provide 'us_privacy' param to apstag.init
if (typeof window.__uspapi === 'function') {
	__uspapi('getUSPData', 1, (data, success) => {
		if (success) {
			amazonConfig.params['us_privacy'] = data.uspString;
		}
		window.apstag.init(amazonConfig, () => {
			console.log('Amazon UAM initialized');
		});
	});
} else {
	window.apstag.init(amazonConfig, () => {
		console.log('Amazon UAM initialized');
	});
}

var divId = '';
var slotId = '';
var sizes = [];
var chunkSize = 5;

// store slots here
window.initialSlots = [];

// gpt initialization and slot definition handled by publisher
window.pbjs = window.pbjs || { que: [] };

var targetSlotting = extracted_target_slot();

//Immediately after the above code you will want to add:
var conf = Object.assign(pbjs.getConfig('rubicon') || {});
if( Object.keys(targetSlotting).length ){
	conf.fpkvs = targetSlotting;
}
conf.singleRequest = true;

window.pbjs.que.push(function () {
	pbjs.setConfig({
		useBidCache: true,
		// bidderTimeout: 10000,
		bidderTimeout: 3500,
		rubicon: conf
	});
});

// As long as we are not re-using the same slot in the same requestBids call we can stage
// all of the ad units into a single transaction call (ppi.requestBids)
var transactionObjects = [];
var uniqueAup = [];
var duplicateAup = [];

$('.magniteAdUnit').each(function (index, item) {
	divId = $(this).attr('id');
	slotId = $(this).data('class');
	if( uniqueAup.indexOf(slotId) === -1 ) {
		uniqueAup.push(slotId);
		sizes = [
			[
				$(this).data('adwidth'), $(this).data('adheight')
			]
		];
		var to = {
			hbInventory: {
				type: 'AUPSlotPath',
				values: {
					name: slotId,
				},
				sizes: sizes,
			},
			hbSource: {
				type: 'auction',
				values: { amazonEnabled: true }
			},
			sizes: sizes,
			hbDestination: {
				type: 'gpt',
				values: {
					div: divId,
					targeting: targetSlotting
				}
			}
		};
		transactionObjects.push(to);
	} else {
		sizes = [
			[
				$(this).data('adwidth'), $(this).data('adheight')
			]
		];
		to = {
			hbInventory: {
				type: 'AUPSlotPath',
				values: {
					name: slotId,
				},
				sizes: sizes,
			},
			hbSource: {
				type: 'auction',
				values: { amazonEnabled: true }
			},
			sizes: sizes,
			hbDestination: {
				type: 'gpt',
				values: {
					div: divId,
					targeting: targetSlotting
				}
			}
		};
		duplicateAup.push(to);
	}
});

// Send A Request for all Unique AUPs.
if( transactionObjects.length > 0 ){
	window.pbjs.que.push(() => {
		pbjs.ppi.requestBids(transactionObjects);
	});
	chunkSize = transactionObjects.length;
}

if( duplicateAup.length > 0 ) {
	let gptAdsRendered = 0;
	googletag.pubads().addEventListener('slotRenderEnded', () => {
		gptAdsRendered++;
		if (gptAdsRendered % chunkSize === 0) {
			magnite_iterator(duplicateAup)
		}
	});

	/*if( amgAdFrontObj.siteUrl.indexOf('faqtoids') ){
		// pbjs.onEvent( 'auctionEnd', function (){
		// 	magnite_iterator(duplicateAup)
		// })
		// wait for 5 slots rendered by GPT then call magnite_iterator.
		let gptAdsRendered = 0;
		googletag.pubads().addEventListener('slotRenderEnded', () => {
			gptAdsRendered++;
			if (gptAdsRendered % chunkSize == 0) {
				magnite_iterator(duplicateAup)
			}
		});
	} else {
		// Send an individual request for all duplicate AUPs.
		duplicateAup.forEach(function (item) {
			window.pbjs.que.push(() => {
				pbjs.ppi.requestBids([item]);
			});
		});
	}*/
}

// Magnite Iterator.
function magnite_iterator(duplicateAup) {
	if (duplicateAup.length > 0) {
		transactionAups = duplicateAup.filter((aup, idx) => idx < chunkSize);

		window.pbjs.que.push(() => {
			pbjs.ppi.requestBids(transactionAups);
		});

		duplicateAup.splice(0, chunkSize);
	}
}

// Prepared Targeting slot.
function extracted_target_slot() {
	var settings = JSON.parse(amgAdFrontObj.relatedSearchSettingJson);
	var url = new URL(location.href);
	var o_parm = url.searchParams.get("o");
	var utm_content = url.searchParams.get("utm_content") || "";
	var utm_source = url.searchParams.get("utm_source") || "";
	var utm_template = url.searchParams.get("utm_template") || "";
	var utm_term = url.searchParams.get("utm_term") || "";
	var embedded_qo = null;

	if (utm_content) {
		// look for utm_content override vars
		var tmp = utm_content.split(':');
		if (tmp[0] === 'params') {
			var var_list = tmp[1].split('&');
			var allowed_list = ['ad', 'an', 'ag', 'o', 'rch', 'qo'];
			var_list.forEach(function (a) {
				tmp = a.split('=');
				allowed_list.forEach(function (b) {
					if (tmp[0] === b) {
						if (b === 'qo') {
							embedded_qo = tmp[1];
						} else {
							Cookies.set('iac_' + tmp[0], tmp[1]);
						}
					}
				})
			});
		}
	}
	var targetSlotting = {
		ad: url.searchParams.get("ad") || Cookies.get('iac_ad') || 'dirN',
		ag: url.searchParams.get("ag") || Cookies.get('iac_ag') || '',
		an: url.searchParams.get("an") || Cookies.get('iac_an') || '',
		origin: o_parm || Cookies.get('iac_o') || settings.default_o_code || '',
		rch: url.searchParams.get("rch") || Cookies.get('iac_rch') || '',
		utm_campaign: Cookies.get('utm_campaign') || '',
		utm_content: utm_content,
		utm_source: utm_source,
		utm_template: utm_template,
		utm_term: utm_term,
		utm_medium: Cookies.get('utm_medium') || '',
		utm_subid: Cookies.get('utm_subid') || '',
		partner: '',
		qo: url.searchParams.get("qo") || embedded_qo || undefined,
		gclid: url.searchParams.get("gclid")
	}

	var SEO_REFERERS = [
		"google.*",
		"search.yahoo.*",
		"bing.*",
		"baidu.*",
		"yandex.*",
		"search.aol.com"
	];
	SEO_REFERERS.forEach(function (a) {
		var r = document.referrer.search(a);
		if (r > 0) {
			targetSlotting.ad = 'SEO';
			targetSlotting.origin = settings.seo_o_code;
		}
	});
	if (typeof (settings.origin_code[targetSlotting.origin]) != 'undefined') {
		targetSlotting.partner = settings.origin_code[targetSlotting.origin].partner;
	} else {
		targetSlotting.partner = '';
	}
	if (targetSlotting.rch) {
		targetSlotting.google_channel = targetSlotting.rch;
	}
	if (window.sswatts) {
		targetSlotting.ldId = window.ss_watts;
	}
	return targetSlotting;
}
;
/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
( function() {
	const siteNavigation = document.getElementById( 'site-navigation' );

	// Return early if the navigation doesn't exist.
	if ( ! siteNavigation ) {
		return;
	}

	const button = siteNavigation.getElementsByTagName( 'button' )[ 0 ];

	// Return early if the button doesn't exist.
	if ( 'undefined' === typeof button ) {
		return;
	}

	const menu = siteNavigation.getElementsByTagName( 'ul' )[ 0 ];

	// Hide menu toggle button if menu is empty and return early.
	if ( 'undefined' === typeof menu ) {
		button.style.display = 'none';
		return;
	}

	if ( ! menu.classList.contains( 'nav-menu' ) ) {
		menu.classList.add( 'nav-menu' );
	}

	// Toggle the .toggled class and the aria-expanded value each time the button is clicked.
	button.addEventListener( 'click', function() {
		siteNavigation.classList.toggle( 'toggled' );

		if ( button.getAttribute( 'aria-expanded' ) === 'true' ) {
			button.setAttribute( 'aria-expanded', 'false' );
		} else {
			button.setAttribute( 'aria-expanded', 'true' );
		}
	} );

	// Remove the .toggled class and set aria-expanded to false when the user clicks outside the navigation.
	document.addEventListener( 'click', function( event ) {
		const isClickInside = siteNavigation.contains( event.target );

		if ( ! isClickInside ) {
			siteNavigation.classList.remove( 'toggled' );
			button.setAttribute( 'aria-expanded', 'false' );
		}
	} );

	// Get all the link elements within the menu.
	const links = menu.getElementsByTagName( 'a' );

	// Get all the link elements with children within the menu.
	const linksWithChildren = menu.querySelectorAll( '.menu-item-has-children > a, .page_item_has_children > a' );

	// Toggle focus each time a menu link is focused or blurred.
	for ( const link of links ) {
		link.addEventListener( 'focus', toggleFocus, true );
		link.addEventListener( 'blur', toggleFocus, true );
	}

	// Toggle focus each time a menu link with children receive a touch event.
	for ( const link of linksWithChildren ) {
		link.addEventListener( 'touchstart', toggleFocus, false );
	}

	/**
	 * Sets or removes .focus class on an element.
	 */
	function toggleFocus() {
		if ( event.type === 'focus' || event.type === 'blur' ) {
			let self = this;
			// Move up through the ancestors of the current link until we hit .nav-menu.
			while ( ! self.classList.contains( 'nav-menu' ) ) {
				// On li elements toggle the class .focus.
				if ( 'li' === self.tagName.toLowerCase() ) {
					self.classList.toggle( 'focus' );
				}
				self = self.parentNode;
			}
		}

		if ( event.type === 'touchstart' ) {
			const menuItem = this.parentNode;
			event.preventDefault();
			for ( const link of menuItem.parentNode.children ) {
				if ( menuItem !== link ) {
					link.classList.remove( 'focus' );
				}
			}
			menuItem.classList.toggle( 'focus' );
		}
	}
}() );
;
