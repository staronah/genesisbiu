// Responsive Menu open.
$( 'body' ).on( 'click', '.mobile-hamburger .mobile-hamburger-icon', () => {
    $( 'body' ).addClass( 'drawer-open' );
});

// Responsive Menu close.
$( 'body' ).on( 'click', '.drawer-header-wrapper .mobile-drawer-close-icon', () => {
    $( 'body' ).removeClass( 'drawer-open' );
});

// Sticky header.
$( window ).on( 'scroll', function () {
    const sticky = $( '.home' ),
        scroll = $( window ).scrollTop();

    sticky.addClass( 'fixed' );
    if ( scroll >= 100 ) sticky.removeClass( 'fixed' );
});

$( document ).on( 'ready', function () {

    // Header Flaship Brands.
    // $( '.search_by_btn' ).on( 'click', function () {
    //     $( this ).parent().toggleClass( 'active' );
    // });

    // Search Box Dismiss Handler.
    $( 'body' ).on( 'click', function ( e ) {
        var container = $( '.search_by_btn' );
        if ( ! container.is( e.target )
            && container.has( e.target ).length === 0 ) {
            container.parent().removeClass( 'active' );
        } else {
            container.parent().toggleClass( 'active' );
        }

        var container = $( '.search-form' );
        if( $( window ).width() > 991 ) {
            if ( ! container.is( e.target )
                && container.has( e.target ).length === 0 ) {
                $( '.ask-sub-search-col' ).removeClass( 'search_open ac_results_visible ask-top-search-open' ).addClass( 'search_close' );
                $( '.ac_results' ).hide();
            } else if ( container.is( e.target )
                && container.has( e.target ).length !== 0 ) {
                $( '.ac_results' ).show();
                $( '.ask-sub-search-col' ).addClass( 'search_open ac_results_visible ask-top-search-open' ).removeClass( 'search_close' );
            }
        } else {
            if ( ! container.is( e.target )
                && container.has( e.target ).length === 0 ) {
                $( '.ask-sub-search-col' ).removeClass( 'search_open ask-top-search-open' ).addClass( 'search_close' );
                $( '.ac_results' ).hide();
                $( '.search-box' ).hide();
            } else {
                $( '.ask-sub-search-col' ).addClass( 'search_open ask-top-search-open' ).removeClass( 'search_close' );
                if ( $( '.search-box' ).val().length > 0 ) $( '.ac_results' ).show();
            }
        }
    });

    // Search Functionality.
    $( '.ask-sub-search-col' ).addClass( 'search_close' );
    $( '.search_close .search-box' ).val( '' );
    $( '.search-submit' ).on( 'click', () => {
        $( '.ask-sub-search-col' ).removeClass( 'search_close' ).addClass( 'search_open' );
        $( '.search-box' ).show();
        $( '.search-box' ).focus();
    });

    // Add Class to UL for true Answer.
    $('.health_tip_day .ans_list li').on( 'click', function () {
        $( this ).hasClass( 'ans_item_true' ) ? $( this ).parent().addClass( 'true_visible' ) : $( this ).parent().removeClass( 'true_visible' );
    });

    $( '.res_close_button' ).on( 'click', function () {
        //var container = $( '.res_close_button' );
        $( '.search-box' ).hide();
        $( '.ac_results' ).hide();
        $( '.ask-sub-search-col' ).removeClass( 'search_open' ).addClass( 'search_close' );
    });

    $( window ).on( 'resize', function () {
        let col_search_box = $( '.ask-sub-search-col' );
        if ( $( window ).width() < 992 
            && col_search_box.hasClass( 'ac_results_visible' ) ) {
            col_search_box.removeClass( 'search_close' );
            col_search_box.addClass( 'search_open' );
        }
    });

    $( '.ac_results ul' ).html( '<li></li>' );
    $( '.ask-sub-search-col' ).removeClass( 'ac_results_visible' );

    // Show text on hover on copy link button.
    $( document ).on( 'mouseover', '.link-share-button-svg', function () {
        $( '.tooltiptext' ).show();
    });

    // Copy Link to clipboard.
    $( document ).on( 'click', '.link-share-button-svg', function ( event ) {
        event.preventDefault();
        let currentUrl = window.location.href;
        let temp = $( '<input>' );
        $( 'body' ).append( temp );
        temp.val( currentUrl ).select();
        document.execCommand( 'copy' );
        temp.remove();
        $( '.tooltiptext' ).text( 'Copied to clipboard' );
    });

    // Hide and change text on mouseout.
    $( document ).on( 'mouseout', '.link-share-button-svg', function () {
        $( '.tooltiptext' ).hide();
        $( '.tooltiptext' ).text( 'Copy to clipboard' );
    });

    // Click outside of the form.
    $( document ).on( 'click', function ( e ) {
        if ( $( e.target ).closest( '.link-share-button-svg' ).length === 0 ) {
            $( '.tooltiptext' ).hide();
        }
    });

    // Question of the day.
    $( '.ans_list .ans_item' ).on( 'click', function () {
        $( this ).parent().find( '.ans_item' ).removeClass( 'active' );
        $( this ).addClass( 'active' );
    });

    // QOD Toggle button.
    $( document ).on( 'click', '.questions_toggle', function () {
        $( this ).parent().addClass( 'toggled' );
    });

    // Review Rating Html modify on article pages.
    if ( 1 === $( '.single-post-content-wrapper p:contains("Rating:")' ).length ) {
        $( '.single-post-content-wrapper p:contains("Rating:")' ).wrap( '<div class="reivew_tag"></div>' );

        $( "p:contains('Rating:')" ).html( function ( _, html ) {
            html = html.replace( /(Rating:)/g, '' );
            html = html.replace( /(:)/g, '' );
            html = html.replace( /(\/10)/g, '<span class="review-inner">$1</span>' );
            html = html.replace( /(10)/g, '<span class="total-text">$1</span>' );
            return html;
        });

        if ( 0 < $('.reivew_tag').next( '#grs_1' ).length ) {
            $( '.reivew_tag' ).next( '#grs_1' ).next( 'p' ).appendTo( '.reivew_tag' );
        }
    }

    // Load weather app in front.
    if ( $( '.accweather' ).length ) {

        let data = {
            "action": "amg_weather_widget_render",
        }

        $.ajax({
            url: ask2022FrontObj.ajax_url,
            type: "POST",
            dataType: "JSON",
            data: data,
            success: ( data ) => {
                appendWeatherHTML( data );
            },
            error: ( thrownError ) => {
                console.log( thrownError );
            }
        });
    }
});

/**
 * @param {{ accweather__currentweather_strong: string; accweather__date_span: string; accweather_link: string; accweather__location_span: string; accweather__currenticon_img: string; accweather__currentmax: string; }} data
 */
function appendWeatherHTML( data ) {

    if ( data.accweather__currentweather_strong ) {

        const accweather = document.getElementById( 'accweather' );

        // Current weather first div.
        const accweather__header = document.createElement( 'div' );
        accweather__header.className = 'accweather__header';

        const accweather__con = document.createElement( 'div' );
        accweather__con.className = 'accweather__con';

        const accweather__date = document.createElement( 'div' );
        accweather__date.className = 'accweather__date';

        const accweather__date_span = document.createElement( 'span' );
        accweather__date_span.innerText = data.accweather__date_span;

        accweather__date.appendChild( accweather__date_span );
        accweather__con.appendChild( accweather__date );

        accweather__header.appendChild( accweather__con );

        const accweather__currentdata = document.createElement( 'div' );
        accweather__currentdata.className = 'accweather__currentdata';

        const accweather__location = document.createElement( 'div' );
        accweather__location.className = 'accweather__location';

        const accuweather__location_anchor = document.createElement( 'a' );
        accuweather__location_anchor.setAttribute( 'href', data.accweather_link );
        accuweather__location_anchor.setAttribute( 'target', '_blank' );

        const accweather__location_span = document.createElement( 'span' );
        accweather__location_span.innerText = data.accweather__location_span;

        accuweather__location_anchor.appendChild( accweather__location_span );
        accweather__location.appendChild( accuweather__location_anchor );
        accweather__currentdata.appendChild( accweather__location );

        const accweather__currenticon = document.createElement( 'div' );
        accweather__currenticon.className = 'accweather__currenticon';

        const accweather__currenticon_img_anchor = document.createElement( 'a' );
        accweather__currenticon_img_anchor.setAttribute( 'href', data.accweather_link );
        accweather__currenticon_img_anchor.setAttribute( 'target', '_blank' );

        const accweather__currenticon_img = document.createElement( 'img' );
        accweather__currenticon_img.setAttribute( 'src', data.accweather__currenticon_img );
        accweather__currenticon_img.setAttribute( 'alt', 'Current Weather icon' );
        accweather__currenticon_img.setAttribute( 'width', '20' );
        accweather__currenticon_img.setAttribute( 'height', '12' );

        accweather__currenticon.appendChild( accweather__currenticon_img );
        accweather__currenticon_img_anchor.appendChild( accweather__currenticon );
        accweather__currentdata.appendChild( accweather__currenticon_img_anchor );

        const accweather__currentweather = document.createElement( 'div' );
        accweather__currentweather.className = 'accweather__currentweather';

        const accweather__currentweather_strong_anchor = document.createElement( 'a' );
        accweather__currentweather_strong_anchor.setAttribute( 'href', data.accweather_link );
        accweather__currentweather_strong_anchor.setAttribute( 'target', '_blank' );

        const accweather__currentweather_strong = document.createElement( 'strong' );
        accweather__currentweather_strong.innerText = data.accweather__currentweather_strong + '°';

        accweather__currentweather.appendChild( accweather__currentweather_strong );
        accweather__currentweather_strong_anchor.appendChild( accweather__currentweather );

        const accweather__currentminmax = document.createElement( 'div' );
        accweather__currentminmax.className = 'accweather__currentminmax';

        const accweather__currentmax = document.createElement( 'div' );
        accweather__currentmax.className = 'accweather__currentmax';
        accweather__currentmax.innerText = data.accweather__currentmax + '°';

        const accweather__currentmax_span = document.createElement( 'span' );
        accweather__currentmax_span.innerText = '/';

        accweather__currentdata.appendChild( accweather__currentweather_strong_anchor );

        accweather__header.appendChild( accweather__currentdata );

        //currunt weather forecast loop.

        const accweather_forecast = document.createElement( 'div' );
        accweather_forecast.className = 'accweather_forecast';

        const forecast__list = document.createElement( 'ul' );
        forecast__list.className = 'forecast__list';

        const accweather__logo = document.createElement( 'div' );
        accweather__logo.className = 'accweather__logo';

        const accweather__logo_img_anchor = document.createElement( 'a' );
        accweather__logo_img_anchor.setAttribute( 'href', data.accweather_link );
        accweather__logo_img_anchor.setAttribute( 'target', '_blank' );

        const accweather__logo_img = document.createElement( 'img' );
        accweather__logo_img.setAttribute( 'src', '/wp-content/themes/ask-2022/assets/images/accuweather logo.svg' );
        accweather__logo_img.setAttribute( 'alt', 'accweather-logo' );
        accweather__logo_img.setAttribute( 'height', '1' );
        accweather__logo_img.setAttribute( 'width', '1' );

        accweather__logo.appendChild( accweather__logo_img );
        accweather__logo_img_anchor.appendChild( accweather__logo );

        accweather.appendChild( accweather__header );
        accweather.appendChild( accweather__logo_img_anchor );
    }
}

// MailChimp/ Newsletter script for Footer & Home page.
( function ( $ ) {
  window.fnames = [];
  window.ftypes = [];
  fnames[0] = 'EMAIL';
  ftypes[0] = 'email';
  fnames[1] = 'FNAME';
  ftypes[1] = 'text';
  fnames[2] = 'LNAME';
  ftypes[2] = 'text';
  fnames[3] = 'ADDRESS';
  ftypes[3] = 'address';
  fnames[4] = 'PHONE';
  ftypes[4] = 'phone';
}( jQuery ));
var $mcj = jQuery.noConflict( true );

/**
 * GTM events.
 */
window.dataLayer = window.dataLayer || [];
// Article-clickthrough event.
$( 'a' ).on( 'click', function () {
    let content_id = $( this ).data( 'content-id' );
    let result_type = $( this ).data( 'result-type' );
    let zone = $( this ).data( 'zone' );
    let provider_source = $( this ).data( 'provider-source' );

    if ( result_type && zone ) {
        window.dataLayer.push({
            "event": "article-clickthrough",
            "contentId": content_id,
            "providerSource": provider_source,
            "resultType": result_type,
            "zone": zone,
            "ordinal": "1"
        });
    }
});


// Navigation-result-impression.
window.dataLayer.push({
    "event": "navigation-result-impression",
    "navigation_searchbox_header_resultsDisplayed": "1",
    "navigation_logo_header_resultsDisplayed": "1",
    "navigation_navigation_footer_resultsDisplayed": "1",
    "navigation_navigation_header_resultsDisplayed": "1"
});


// Trending-article-impression event.
if ( $( 'body' ).hasClass( 'home' ) ) {
    let trendingArticlesRightResultsDisplayed = undefined;
    let trendingArticlesCenterResultsDisplayed = undefined;
    window.dataLayer.push({
        "event": "trending-article-impression",
        "content_trendingArticles_right_resultsDisplayed": trendingArticlesRightResultsDisplayed,
        "content_trendingArticles_center_resultsDisplayed": trendingArticlesCenterResultsDisplayed
    });

} else {
    let trendingArticlesRightResultsDisplayed;
    trendingArticlesRightResultsDisplayed = 0 < $( '.related-articles-block .tile-item' ).length ? $( '.related-articles-block .tile-item' ).length : undefined;
    let trendingArticlesCenterResultsDisplayed;
    trendingArticlesCenterResultsDisplayed = ( $( 'body' ).hasClass( 'single' ) && 0 < $( '.latest-articles-block .tile-item' ).length ) ? $( '.latest-articles-block .tile-item' ).length : undefined;
    window.dataLayer.push({
        "event": "trending-article-impression",
        "content_trendingArticles_right_resultsDisplayed": trendingArticlesRightResultsDisplayed,
        "content_trendingArticles_center_resultsDisplayed": trendingArticlesCenterResultsDisplayed
    });
}

// Taxonomy-impression event - Revised.
if ( $( 'body' ).hasClass( 'category' ) || $( 'body' ).hasClass( 'home' ) ) {

    let primary_menu_count = $( '#primary-menu li' ).length;
    let sub_menu_count = $( '.sub-menu li' ).length;
    let taxonomyTopResults = primary_menu_count - sub_menu_count;

    let cat_page_subcats = $( '.category-btn li' ).length;
    let taxonomyCenterResults = cat_page_subcats ? cat_page_subcats : $( '.article-nav-list li' ).length;

    window.dataLayer.push({
        "event": "taxonomy-impression",
        "taxonomy_taxonomy_bottom_resultsDisplayed": $( '.menu-footer-category-menu-container ul li' ).length,
        "taxonomy_taxonomy_center_resultsDisplayed": taxonomyCenterResults,
        "taxonomy_taxonomy_top_resultsDisplayed": taxonomyTopResults
    });
}

// Social-result-impression event.
if ( $( 'body' ).hasClass( 'single' ) ) {

    // Social-result-impression event.
    window.dataLayer.push({
        "event": "social-result-impression",
        "socialLink_socialLink_center_resultsDisplayed": "1",
        "socialLink_socialLink_bottom_resultsDisplayed": "1"
    });

    // View-article-section event.
    window.dataLayer.push({
        "event": "view-article-section"
    });

    // Article-link-click event.
    $( '.single .single-post-left-part a' ).on( 'click', function ( a ) {
        let $target = $( a.target );
        if ( ! $target.closest( '.PartialSocialLinks-link' ).length && ! $target.closest( '.twitter-share-button-svg' ).length ) {
            window.dataLayer.push({
                "event": "article-link-click"
            });
        }
    });

} else {
    // Social-result-impression event.
    window.dataLayer.push({
        "event": "social-result-impression",
        "socialLink_socialLink_bottom_resultsDisplayed": "1"
    });
}

// Article-tile-impression event for Home page.
if ( $( 'body' ).hasClass( 'home' ) ) {
    let singleArticle = $( '.single-post-wrapper .single-post-main' ).length;
    singleArticle = singleArticle || 0;

    let articleByCategoryTileLength = $( '.articles-by-category-block .tile-item' ).length;
    articleByCategoryTileLength = articleByCategoryTileLength || 0;

    let moneyAdviceTileLength = $( '.money-advice ul li' ).length;
    moneyAdviceTileLength = moneyAdviceTileLength || 0;

    let latestTileLength = $( '.latest-articles-block .tile-item' ).length;
    latestTileLength = latestTileLength || 0;

    window.dataLayer.push({
        "event": "article-tile-impression",
        "content_articleTiles_center_resultsDisplayed": singleArticle + articleByCategoryTileLength + moneyAdviceTileLength + latestTileLength
    });
}

// Impression Questions of Day.
if ( $( '.questions_of_day' ).length > 0 ) {
    const questionTitle = $( '.tip-title' ).text();
    window.dataLayer.push({
        "event": "questionOfTheDay_impression",
        "questionOfTheDay_question": questionTitle 
    });

    $( '.ans_item_false' ).on( 'click', function () {
        if ( ! $( this ).find( '.ans_text' ).is( ':hidden' ) ) {
            window.dataLayer.push({
                "event": "questionOfTheDayOption_click",
                "questionOfTheDay_Answer": "false"
            });
        }
    })

    $( '.ans_item_true' ).on( 'click', function ( e ) {
        var container = $( '.ans-true span a' );
        if ( ! container.is( e.target )
            && container.has( e.target ).length === 0 ) {
            window.dataLayer.push({
                "event": "questionOfTheDayOption_click",
                "questionOfTheDay_Answer": "true"
            });
        }
    })

    $( '.ans_item_true .ans-true span a' ).on( 'click', () => {
        window.dataLayer.push({ "event": "questionOfTheDay_learnMore_click" });
    })
}

// Weather-widget-impression for weather widget.
if ( $( '.accweather' ).length > 0 && $( 'body' ).hasClass( 'home' ) ) {
    window.dataLayer.push({
        "event": "weather-widget-impression",
        "weatherWidget_resultsDisplayed": 1
    });

    $( '.accweather' ).on( 'click', 'a', () => {
        window.dataLayer.push({
            "event": "weather-widget-click",
            "resultType": "weatherWidget"
        });
    })
}

// Featured-article-impression GA impression for single article on homepage.
var single_wrapper = $( '.single-post-wrapper' );
if ( single_wrapper.length > 0 ) {
    var contentId = $( '.single-post-main' ).find( 'a' ).data( 'slug' );

    window.dataLayer.push({
        "event": 'featured-article-impression',
        "featuredArticle": contentId
    });

    single_wrapper.on('click', function() {
        window.dataLayer.push({
            "event": 'featured-article-click',
            "resultType": 'homepageFeaturedArticle',
            "contentId": contentId
        })
    });
}

// Editorial-feature-impression for Home Page
const editorial_feature = $( '.money-advice' );
if ( editorial_feature.length > 0 && $( 'body' ).hasClass( 'home' ) ) {
    let editorial_feature_li = 0;
    editorial_feature.each( function () {
        editorial_feature_li += $( this ).find( 'li' ).length;
    });

    window.dataLayer.push({
        "event": "editoral-features-impression",
        "editorialFeaturesWidget": editorial_feature_li
    });

    editorial_feature.on( 'click', 'a', function () {
        let contentId = $( this ).data( 'slug' );
        window.dataLayer.push({
            "event": "editoral-features-widget-click",
            "resultType": "editorialFeaturesArticle",
            "contentId": contentId
        });
    })
}

// Content-page-display-loaded event.
dataLayer.push({ "event": "content-page-display-loaded" });
