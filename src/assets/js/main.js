(function($) {
	"use strict";
	$(document).ready(function() {
        function inlineCSS() {
			$(".main-search-container, section.fullwidth, .listing-slider .item, .listing-slider-small .item, .address-container, .img-box-background, .image-edge, .edge-bg").each(function() {
				var attrImageBG = $(this).attr('data-background-image');
				var attrColorBG = $(this).attr('data-background-color');
				if (attrImageBG !== undefined) {
					$(this).css('background-image', 'url(' + attrImageBG + ')');
				}
				if (attrColorBG !== undefined) {
					$(this).css('background', '' + attrColorBG + '');
				}
			});
		}
		inlineCSS();
    });
})(this.jQuery);