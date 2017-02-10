/*!
*  filename: ej.tile.js
*  version : 14.4.0.20
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.core","./../common/ej.touch"], fn) : fn();
})
(function () {
	
/**
* @fileOverview Plugin to style the Html TileView elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    ej.widget("ejTileBase", "ej.TileBase", {
        defaults: {
            badge: {
                enabled: false,
                value: 1,
                text: null,
                maxValue: 100,
                minValue: 1,
                position: "bottomright"
            },

            caption: {
                enabled: true,
                text: "text",
                icon: null,
                position: "innerbottom",
                alignment: "normal"
            },

            enablePersistence: false,

            imageClass: null,

            imagePosition: "center",

            imageTemplateId: null,

            imageUrl: null,

            liveTile: {

                text: null,

                enabled: false,

                imageClass: null,

                imageTemplateId: null,

                imageUrl: null,

                type: "flip",

                updateInterval: 2000
            },

            cssClass: "",

            tileSize: "small",

            width: null,

            height: null,

            showRoundedCorner: false,

            backgroundColor: null,

            allowSelection: false,

           locale: "en-US",

            //deprecated
            showText: true,

            text: "text",

            textAlignment: "normal",

        },
        dataTypes: {
            imagePosition: "enum",
            liveTile: {
                text: "array",
                type: "enum",
                enabled: "boolean",
                updateInterval: "number",
                imageUrl: "array",
                imageClass: "array",
                imageTemplateId: "array"
            },
            alignment: "enum",
            tileSize: "enum",
            locale: "string"
        },

        observables: ["badge.value", "badge.enabled", "badge.text", "badge.position", "text", "caption.text"],
        _badgeValue: ej.util.valueFunction("badge.value"),
        _badgeEnabled: ej.util.valueFunction("badge.enabled"),
        _badgeText: ej.util.valueFunction("badge.text"),
        _badgePosition: ej.util.valueFunction("badge.position"),
        _captionText: ej.util.valueFunction("caption.text"),
        text: ej.util.valueFunction("text"),

        _setDeprecatedProperties: function () {
            this.model["caption"].enabled = (this.defaults["caption"].enabled == this.model["caption"].enabled && this.defaults.showText == this.model.showText) ? this.defaults["caption"].enabled : this.model["caption"].enabled != this.defaults["caption"].enabled ? this.model["caption"].enabled : this.model.showText;
            this._captionText((this.defaults["caption"].text == this._captionText() && this.defaults.text == this.text()) ? this.defaults["caption"].text : this._captionText() != this.defaults["caption"].text ? this._captionText() : this.text());
            this.model["caption"].alignment = (this.defaults["caption"].alignment == this.model["caption"].alignment && this.defaults.textAlignment == this.model.textAlignment) ? this.defaults["caption"].alignment : this.model["caption"].alignment != this.defaults["caption"].alignment ? this.model["caption"].alignment : this.model.textAlignment;
        },
        _tileRender: function () {
            this._setDeprecatedProperties();
            this._imagePosition = this.model.imagePosition;
            this._cssClass = this.model.cssClass;
            this.element.addClass(this.model.cssClass + " " + this._prefix + "tile-image" + this.model.imagePosition + " " + this._prefix + "tile-" + this.model.tileSize);
            if (this.model.showRoundedCorner)
                this.element.addClass(this._prefix + "tile-round-corner");
            if (this._isLiveTile())
                this._liveTile();
            else {
                this._image = ej.buildTag("div").addClass(this._prefix + "tile-image" + this.model.imagePosition + " " + this._prefix + "image-parent");
                this._innerImage = ej.buildTag("span").addClass(this._prefix + "tile-image " + this._prefix + "tile-image" + this.model.imagePosition);
                if (this.model.imageTemplateId) {
                    var imageTemp = this._isMobile() ? ej.getCurrentPage().find('#' + this.model.imageTemplateId) : $('#' + this.model.imageTemplateId);
                    this._innerImage.addClass(this._prefix + "tile-template").append(imageTemp);
                }
                else if (this.model.imageClass) 
                    this._innerImage.addClass(this.model.imageClass);
                else if (this.model.imageUrl) {
                    var url = this._isMobile() && this.model.imagePath ? (this._getAbsolutePath(this.model.imagePath) + "/" + this.model.renderMode.toLowerCase() + "/" + this.model.imageUrl) : this._getAbsolutePath(this.model.imageUrl);
                    this._innerImage.css({ "background-image": "url('" + url + "')"});
                    if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9 && this.model.imagePosition == "fill")
                        this._innerImage.css({ "filter": "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + url + "',sizingMethod='scale')", "-ms-filter": "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + url + "',sizingMethod='scale')" });
                }
                this._image.append(this._innerImage);
                this.element.append(this._image);
                this._setBackgroundColor(this.model.backgroundColor);
                if (this.model.imageTemplateId && this._prefix == "e-m-" && ej.angular.defaultAppName)
                    ej.angular.compile(this._image);
            }
            if (this._isCaptionEnable()) {
                if (this.model["liveTile"].text && this._isLiveTile()) {
                    var liveTileImage = this.element.find("." + this._prefix + "image-parent");
                    for (var i = 0, tileLength = liveTileImage.length; i < tileLength; i++) {
                        this._setCaptionClass($(liveTileImage[i]));
                        $(liveTileImage[i]).addClass(this._prefix + "tile-caption-text ").attr("text", this.model["liveTile"].text[i]);
                    }
                }
                else {
                    this._setCaptionClass(this.element);
                    if (this.model["caption"].icon) {
                        this._captionIcon = this.model["caption"].icon;
                        this.element.addClass(this._prefix + "tile-caption-icon " + this._prefix + "icon-" + this._captionIcon);
                    }
                    else {
                        this.element.addClass(this._prefix + "tile-caption-text ").attr("text", this._captionText());
                    }

                }
            }
            if (this._badgeEnabled())
                this._setBadgeEnabled();
            this._selectElement = ej.buildTag("span." + this._prefix + "tile-overlay");
            this.element.append(this._selectElement);
            if(!this.model.height) this.model.height = this.model["caption"].position == "outer" ? this.element.height() - 50 : this.element.height();
            if(!this.model.width) this.model.width = this.element.width();
            if (this._isCustomizeSize())
                this._setCustomizSize();
        },

        _liveTile: function () {
            this.element.addClass(this._prefix + "livetile-enable"); var image;
            if (this.model["liveTile"].imageTemplateId) {
                for (var i = 0; i < this.model["liveTile"].imageTemplateId.length; i++) {
                    var imageTempEle = ej.buildTag("div").addClass(this._prefix + "tile-template " + this._prefix + "tile-image" + this.model.imagePosition + " " + this._prefix + "image-parent " + this._prefix + "tile-" + this.model["liveTile"].type);
                    var template = this._isMobile() ? ej.getCurrentPage().find('#' + this.model["liveTile"].imageTemplateId[i]) : $('#' + this.model["liveTile"].imageTemplateId[i]);
                    this.element.append(imageTempEle.append(template));
                }
            }
            else if (this.model["liveTile"].imageClass) {
                for (var i = 0; i < this.model["liveTile"].imageClass.length; i++) {
                    image = ej.buildTag("span").addClass(this.model["liveTile"].imageClass[i] + " " + this._prefix + "tile-image " + this._prefix + "tile-image" + this.model.imagePosition);
                    var imageClassEle = ej.buildTag("div").addClass( this._prefix + "tile-image" + this.model.imagePosition + " " + this._prefix + "tile-" + this.model["liveTile"].type + " " + this._prefix + "image-parent");
                    image.appendTo(imageClassEle);
                    this.element.append(imageClassEle);
                }
            }
            else {
                for (var i = 0; i < this.model["liveTile"].imageUrl.length; i++) {
                    var url = this._isMobile() && this.model.imagePath ? this._getAbsolutePath(this.model.imagePath) + "/windows/" + this.model["liveTile"].imageUrl[i] : this._getAbsolutePath(this.model["liveTile"].imageUrl[i]);
                    image = ej.buildTag("span").addClass(this._prefix + "tile-image " + this._prefix + "tile-image" + this.model.imagePosition).css({ "background-image": "url('" + url + "')" });
                    var imageUrlEle = ej.buildTag("div." + this._prefix + "tile-image" + this.model.imagePosition + " " + this._prefix + "tile-" + this.model["liveTile"].type + " " + this._prefix + "image-parent");
                    image.appendTo(imageUrlEle);
                    this.element.append(imageUrlEle);
                }
            }
            this._setBackgroundColor(this.model.backgroundColor);
            $(this.element.children()[0]).addClass(this._prefix + "tile-" + this.model["liveTile"].type + 'back').removeClass(this._prefix + "tile-" + this.model["liveTile"].type);
            if (this.model.imageTemplateId && this._prefix == "e-m-" && (App.angularAppName || ej.angular.defaultAppName))
                ej.angular.compile(this.element);
        },
        _setCustomizSize: function () {
            var minWidth = (this._isLiveTileMode() || this.model.renderMode == "flat") && (parseInt(this.model.width) <= 70) ? "70" :
                (this._isMobile() && this.model.renderMode == "android") && this._isBelowSmallSize() ? "85" :
                (this._isMobile() && this.model.renderMode == "ios7") && this._isBelowSmallSize() ? "74" :
                 this.model.width;
            var minHeight = (this._isLiveTileMode() || this.model.renderMode == "flat") && (parseInt(this.model.height) <= 70) ? "70" :
                (this._isMobile() && (this.model.renderMode == "android" || this.model.renderMode == "ios7")) && this._isBelowSmallSize() ? "70" :
                (this._isMobile() && this.model.renderMode == "ios7") && this._isBelowSmallSize() ? "70" : this.model.height;
            var extraSpace = (this._isLiveTileMode() || this.model.renderMode == "flat") && !this._isBelowSmallSize() ? 50 :
                 (this._isLiveTileMode() || this.model.renderMode == "flat") && this._isBelowSmallSize() ? 0 :
                (this._isMobile() && this.model.renderMode == "android") && this._isBelowSmallSize() ? 30 : 30;
            var newHeight = (this.model["caption"].enabled && this.model["caption"].position == "outer" && this.model.height) ? minHeight ? parseInt(minHeight) + extraSpace : parseInt(minHeight) + extraSpace : this.model.height;
            this.element.css({ "width": this.model.width ? this.model.width : "70", "height": this.model.height ? newHeight : this.element.height() + extraSpace });
            this.element.find("." + this._prefix + "image-parent").css({"width": this.element.css("width"), "height": this.model.height ? minHeight : this.element.height() - extraSpace });
            if (!this._isBelowSmallSize() && this.model["caption"].enabled && this.model["caption"].position == "outer") {
                this.element.find(".e-m-tile-image").css({ "width": this.model.width ? minWidth : "", "height": this.model.height ? minHeight : "" });
                this._selectElement.css({ "width": this.model.width ? minWidth : "", "height": this.model.height ? minHeight : "" });
            }
            if (this._isBelowSmallSize()) {
                this.element.addClass(this._prefix + "tile-small");
                if (!(this._isMobile() && (this.model.renderMode == "android" || this.model.renderMode == "ios7") && this.model["caption"].position == "outer"))
                    this.element.removeAttr("text");
            }
        },
        _isLiveTile: function () {
            return (this._isLiveTileMode() && this.model["liveTile"].enabled);
        },

        _isLiveTileMode: function () {
            return (!this._isMobile() || this.model.renderMode == "windows");
        },

        _setCaptionClass: function (element) {
            element.addClass(this._prefix + "tile-caption " + this._prefix + "caption-" + this.model["caption"].position + " " + this._prefix + "caption-align-" + this.model["caption"].alignment);
        },

        _isCaptionEnable: function () {
            return (this.model["caption"].enabled && !(this.model.tileSize == "small" || (this._isBelowSmallSize() && this.model.tileSize == "small")) || ((this._isMobile() && (this.model.renderMode == "ios7" || this.model.renderMode == "android") && this.model["caption"].position == "outer") || this._isMobile() && (this.model.renderMode == "android" || this.model.renderMode == "ios7") && this.model["caption"].position == "outer" && (this._isCustomizeSize() && this._isBelowSmallSize())));
        },

        _isBelowSmallSize: function () {
            var width = this.model.width ? parseInt(this.model.width) : this.model.width;
            var height = this.model.height ? parseInt(this.model.height) : this.model.height;
            var minWidthandHeight = (!this._isMobile() || (this._isMobile() && (this.model.renderMode == "windows" || this.model.renderMode == "flat"))) ? 70 : (this._isMobile() && this.model.renderMode == "android") ? 85 : 74;
            return ((width <= minWidthandHeight && width != null) || (height <= minWidthandHeight && height != null));
        },

        _isCustomizeSize: function () {
            return this.model.height || this.model.width;
        },

        _createDelegates: function () {
            this._onStartDelegate = $.proxy(this._isMobile() ? this._onTouchStartHandler : this._onMouseDownHandler, this);
            this._onEndDelegate = $.proxy(this._isMobile() ? this._onTouchEndHandler : this._onMouseUpHandler, this);
            this._onMoveDelegate = $.proxy(this._isMobile() ? this._onTouchMoveHandler : this._onMouseMoveHandler, this);
            this._onDocClickDelegate = $.proxy(this._onDocClickHandler, this);
            this._startAnimationDelegate = $.proxy(this["_" + this.model["liveTile"].type + "Tile"], this);
        },

        _wireEvents: function (remove) {
            this._createDelegates();
            ej.listenEvents([this.element, $(document)], [ej.startEvent(), ej.endEvent()], [this._onStartDelegate, this._onDocClickDelegate], remove, this);
            if (this._isLiveTile())
                remove ? this._stopTileAnimation() : this._startTileAnimation();
        },

        _onDocClickHandler: function (evt) {
            this._removeActiveClass();
        },

        _removeActiveClass: function () {
            this._isLiveTileMode() ? ej._removeSkewClass(this.element) : $(this.element).removeClass(this._prefix + "state-active");
        },

        _startTileAnimation: function () {
            this._intervalCounter = setInterval(this._startAnimationDelegate, this.model["liveTile"].updateInterval);
        },

        _stopTileAnimation: function () {
            clearInterval(this._intervalCounter);
        },

        _flipTile: function () {
            var front = this.element.find("." + this._prefix + "tile-flipback");
            var back = this.element.find("." + this._prefix + "tile-flip").first();
            front.addClass(this._prefix + "tile-flip").removeClass(this._prefix + "tile-flipback");
            back.addClass(this._prefix + "tile-flipback").removeClass(this._prefix + "tile-flip");
        },

        _slideTile: function () {
            this._animateEffect();
        },

        _carouselTile: function () {
            this._animateEffect();
        },

        _animateEffect: function () {
            var type = this.model["liveTile"].type.toLowerCase();
            var items = this.element.find("." + this._prefix + "image-parent");
            var currentitem = this.element.find("." + this._prefix + "tile-" + type + "back");
            var nextitem = currentitem.next()[0] == null ? items.first() : currentitem.next();
            var previtem = currentitem.prev()[0] == null ? items.last() : currentitem.prev();
            if ($(currentitem.next()[0]).hasClass(this._prefix + "tile-overlay") || $(currentitem.prev()[0]).hasClass(this._prefix + "tile-overlay")) {
                var currentItem = $(currentitem.next()[0]).next();
                var previousItem = $(currentitem.next()[0]).prev();
                nextitem = currentItem.next()[0] == null ? items.first() : currentItem.next();
                previtem = previousItem.prev()[0] == null ? items.last() : previousItem.prev();
            }
            previtem.addClass(this._prefix + "tile-" + type).removeClass(this._prefix + "tile-" + type + "up");
            currentitem.addClass(this._prefix + "tile-" + type + "up").removeClass(this._prefix + "tile-" + type + "back");
            nextitem.removeClass(this._prefix + "tile-" + type).addClass(this._prefix + "tile-" + type + "back");
        },

        _getAbsolutePath: function (path) {
            return this._isMobile() ? this._makeUrlAbsolute(path).toString() : path;
        },

        _makeUrlAbsolute: function (relUrl) {
            var link = $("<a href ='" + relUrl + "'></a>")[0];
            $("body").append(link);
            var pathname;
            if (link.pathname.indexOf('/') != 0)
                pathname = '/' + link.pathname;
            else
                pathname = link.pathname;
            var browser = ej.browserInfo();
            var isIE9 = (browser.name == "msie" && browser.version == "9.0");
            var newLink = (link.protocol + "//" + ((isIE9 && link.port == "80") ? (link.host).replace(":80", "") : link.host) + pathname + link.search + link.hash);
            $(link).remove();
            return newLink;
        },

        _isMobile: function () {
            return this._prefix == "e-m-" ? true : false;
        },
        /*Public Method*/
        updateTemplate: function (id, index) {
            if (this._isLiveTile()) {
                $(this.element.children()[index]).empty();
                var tempLive = (this._isMobile() ? ej.getCurrentPage().find('#' + id) : $('#' + id));
                $(this.element.children()[index]).append(tempLive);
            }
            else {
                var template = this._isMobile() ? ej.getCurrentPage().find('#' + id) : $('#' + id);
                this._image.addClass(this._prefix + "tile-template").empty().append(template);
            }
        },

        _setModel: function (options) {
            var refresh = false;
            for (var property in options) {
                var setModel = "_set" + property.charAt(0).toUpperCase() + property.slice(1);
                if (this[setModel] || property == "locale") {
                    switch (property) {
                        case "text":
                            this[setModel](ej.util.getVal(options[property]));
                            options[property] = this.text(ej.util.getVal(options[property]));
							if (ej.isNullOrUndefined(this._options)) this._options = {};
							this._options["caption"] = this.model.caption;
                            break;
						case "locale":
							if (ej.Tile.Locale[options[property]]) {
								this.model.locale = options[property];
								this._setCulture();
								this._setCaptionText(this._captionText());
							}
                            break;
                        default:
                            this[setModel](options[property]);
                    }
                }
                else
                    refresh = true
            }
            if (refresh)
                this._refresh();
        },
        /*Setmodel method*/
        _setCaption: function (options) {
            var refresh = false;
            for (var property in options) {
                var setModel = "_setCaption" + property.charAt(0).toUpperCase() + property.slice(1);
                if (this[setModel]) {
                    switch (property) {
                        case "text":
                            this[setModel](ej.util.getVal(options[property]));
                            options[property] = this._captionText(ej.util.getVal(options[property]));
                            break;
                        default:
                            this[setModel](options[property]);
                    }
                }
                else
                    refresh = true
            }
            if (refresh)
                this._refresh();
        },

        _setText: function (value) {
			this._captionText(value);
            this._setCaptionText(value)
        },
        _setCaptionText: function (value) {
            (this._isCaptionEnable() ? this.element.attr("text", value) : this.element.removeAttr("text"));
        },
        _setCaptionEnabled: function (value) {
            if (this._isCaptionEnable())
                this.element.attr("text", this._captionText())
            else
                this.element.removeAttr("text")
        },
        _setCaptionIcon: function (value) {
            if (this._isCaptionEnable()) {
                this.element.removeClass(this._prefix + "caption-text " + this._prefix + "icon-" + this._captionIcon).addClass(this._prefix + "caption-icon " + this._prefix + "icon-" + value).removeAttr("text");
                this._captionIcon = value;
            }
        },
        _setCaptionAlignment: function (value) {
            if (this._isCaptionEnable())
                this.element.removeClass(this._prefix + "caption-align-normal " + this._prefix + "caption-align-left " + this._prefix + "caption-align-center " + this._prefix + "caption-align-right").addClass(this._prefix + "caption-align-" + value)
        },
        _setShowRoundedCorner: function (value) {
            (value ? this.element.addClass(this._prefix + "tile-round-corner") : this.element.removeClass(this._prefix + "tile-round-corner"));
        },
        _setCssClass: function (value) {
            this.element.removeClass(this._cssClass).addClass(value);
            this._cssClass = value;
        },
        _setBackgroundColor: function (value) {
            ((!this._isMobile() || (this._isMobile() && this.model.renderMode == "windows")) || (this.model["caption"].position == "outer") ? this.element.find("." + this._prefix + "tile-image").css("background-color", value) : this.element.css("background-color", value));
        },
        _setTileSize: function (value) {
            if (!this._isCaptionEnable())
                this.element.removeAttr("text");
            else if (this._isCaptionEnable())
                this.element.attr("text", this._captionText());
            this.element.css({ "width": "", "height": "" });
            this.element.find("." + this._prefix + "image-parent").css({ "width": "", "height": "" });
            this.element.removeClass(this._prefix + "tile-small " + this._prefix + "tile-medium " + this._prefix + "tile-wide " + this._prefix + "tile-large").addClass(this._prefix + "tile-" + value);
            this.model.height = this.element.height();
            this.model.width = this.element.width();
        },
        _setImagePosition: function (value) {
            this.element.removeClass(this._prefix + "tile-image" + this._imagePosition).addClass(this._prefix + "tile-image" + value);
            $(this.element.find("." + this._prefix + "tile-image")).removeClass(this._prefix + "tile-image" + this._imagePosition).addClass(this._prefix + "tile-image" + value);
            this._imagePosition = this.model.imagePosition;
        },
        _setBadge: function (options) {
            for (var property in options) {
                var setModel = "_setBadge" + property.charAt(0).toUpperCase() + property.slice(1);
                if (this[setModel]) {
                    switch (property) {
                        case "value":
                        case "enabled":
                        case "text":
                            this[setModel](ej.util.getVal(options[property]));
                            if (typeof options[property] == "function")
                                options[property](this["_badge" + property.charAt(0).toUpperCase() + property.slice(1)]());
                            else
                                options[property] = this["_badge" + property.charAt(0).toUpperCase() + property.slice(1)]();
                            break;
                        default:
                            this[setModel](options[property]);
                    }
                }
            }
        },

        _setBadgeValue: function (value) {
            if (this._badgeEnabled()) {
                value = ej.isNullOrUndefined(value) ? this._badgeValue() : value;
                var badgeValue;
                if (this._badgeText())
                    badgeValue = this._badgeText();
                else {
                    if (value <= this.model["badge"].maxValue && value >= this.model["badge"].minValue) {
                        badgeValue = value.toString();
                        this._badgeValue(value);
                    }
                    else if (value > this.model["badge"].maxValue) {
                        badgeValue = this.model["badge"].maxValue.toString() + "+";
                        this._badgeValue(this.model["badge"].maxValue);
                    }
                    else {
                        badgeValue = this.model["badge"].minValue.toString();
                        this._badgeValue(this.model["badge"].minValue);
                    }
                }
                this.element.addClass(this._prefix + "tile-badge " + this._prefix + "badge-position-" + this._badgePosition());
                this.element.addClass(this._prefix + "tile-badge-value").attr("badgeValue", badgeValue);
            } else 
                this.element.removeClass(this._prefix + "tile-badge " + this._prefix + "badge-position-" + this._badgePosition() + " " + this._prefix + "tile-badge-value");
        },

        _setBadgePosition: function (value) {
            this._badgePosition(value)
            if (this._badgeEnabled())
                this.element.removeClass(this._prefix + "badge-position-bottomright " + this._prefix + "badge-position-topright").addClass(this._prefix + "badge-position-" + this._badgePosition());
        },

        _setBadgeEnabled: function (enabled) {
            this._badgeEnabled(enabled);
            this._setBadgeValue();
        },

        _setBadgeMaxValue: function (value) {
            this.model["badge"].maxValue = value;
            this._setBadgeValue();
        },

        _setBadgeMinValue: function (value) {
            this.model["badge"].minValue = value;
            if (this._badgeEnabled())
                this._setBadgeValue();
        },

        _setBadgeText: function (value) {
            this._badgeText(value);
            if (this._badgeEnabled())
                this._setBadgeValue();
        },

        _clearElement: function () {
            this.element.removeAttr("class");
            this.element.html(this._orgEle.html());
        },

        _destroy: function () {
            this._wireEvents(true);
            this._clearElement();
        }
    });
})(jQuery, Syncfusion);;
/**
* @fileOverview Plugin to style the Html TileView elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejTile", "ej.Tile", {
        _setFirst: true,
        validTags: ["div"],
        _rootCSS: "e-tile",
        defaults: {

            mouseDown: null,

            mouseUp: null
        },

        _init: function (options) {
            this._options = options;
            this._setCulture();
            this._orgEle = this.element.clone();
            this._liveTileimageTemplateParent = [];
            this._cloneLiveTileImageTemplateElement = [];
            this._renderEJControl();
        },

        _renderEJControl: function () {
            if (this.model.captionTemplateId) {
                this._captionTemplateParent = $("#" + this.model.captionTemplateId).parent();
                this._cloneCaptionTemplateElement = $("#" + this.model.captionTemplateId).clone();
            }
            if (this.model.imageTemplateId) {
                this._imageTemplateParent = $("#" + this.model.imageTemplateId).parent();
                this._cloneImageTemplateElement = $("#" + this.model.imageTemplateId).clone();
            }
            if (this.model.liveTile.enabled && this.model.liveTile.imageTemplateId) {
                for (i = 0; i < this.model.liveTile.imageTemplateId.length; i++) {
                    this._liveTileimageTemplateParent[i] = $("#" + this.model.liveTile.imageTemplateId[i]).parent();
                    this._cloneLiveTileImageTemplateElement[i] = $("#" + this.model.liveTile.imageTemplateId[i]).clone();
                }
            }
            this.element.addClass("e-tile-web");
            this._prefix = "e-";
            this._tileRender();
            this._wireEvents();
        },

        _onMouseDownHandler: function (evt) {
            var item = this.element;
            item.addClass(ej._getSkewClass(item, evt.pageX, evt.pageY).replace('e-m-', 'e-'));
            this._trigger("mouseDown", { text: item.attr("text"), index: $(evt.target).index() });
            ej.listenTouchEvent(this.element, ej.moveEvent(), this._onMoveDelegate, false, this);
            ej.listenTouchEvent(this.element, ej.endEvent(), this._onEndDelegate, false, this);
            this._isMoved = false;
        },

        _onMouseMoveHandler: function (evt) {
            this._isMoved = true;
            this._removeActiveClass();
        },

        _onMouseUpHandler: function (evt) {
            if (this.model.allowSelection) {
                if (!this._selected) {
                    this._selected = true;
                    this._selectElement.addClass("e-tile-selected");
                }
                else if (this._selected) {
                    this._selected = false;
                    this._selectElement.removeClass("e-tile-selected");
                }
            }
            if (!this._isMoved && this.model.mouseUp)
                this._trigger("mouseUp", { text: this.element.attr("text"), index: $(evt.target).index(), select: this._selected });
            this._removeActiveClass();
            this._isMoved = false;
            ej.listenTouchEvent(this.element, ej.moveEvent(), this._onMoveDelegate, true, this);
            ej.listenTouchEvent(this.element, ej.endEvent(), this._onEndDelegate, true, this);
        },

        _refresh: function () {
            this._destroy();
            this.element.addClass("e-tile e-js");
            if (this.model.captionTemplateId)
                $(this._captionTemplateParent).append(this._cloneCaptionTemplateElement);
            if (this.model.imageTemplateId)
                $(this._imageTemplateParent).append(this._cloneImageTemplateElement);
            if (this.model.liveTile.enabled && this.model.liveTile.imageTemplateId) {
                for (i = 0; i < this.model.liveTile.imageTemplateId.length; i++)
                    $(this._liveTileimageTemplateParent[i]).append(this._cloneLiveTileImageTemplateElement[i]);
            }
            this._renderEJControl();
        },
		_setCulture: function () {
            if (this.model.locale != "en-US" && (ej.isNullOrUndefined(this._options) || ((ej.isNullOrUndefined(this._options["caption"]) || ej.isNullOrUndefined(this._options["caption"].text)) && ej.isNullOrUndefined(this._options["text"]))))
				this._captionText(this._getLocalizedLabels().captionText)
        },
		_getLocalizedLabels: function () {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        }
    });
	ej.Tile.Locale = ej.Tile.Locale || {};
    ej.Tile.Locale["default"] = ej.Tile.Locale["en-US"] = {
        captionText: "text"
    };
    ej.Tile.ImagePosition = {
        Center: "center",
        TopCenter: "topcenter",
        BottomCenter: "bottomcenter",
        RightCenter: "rightcenter",
        LeftCenter: "leftcenter",
        TopLeft: "topleft",
        TopRight: "topright",
        BottomRight: "bottomright",
        BottomLeft: "bottomleft",
        Fill: "fill"
    },
    ej.Tile.BadgePosition = {
        TopRight: "topright",
        BottomRight: "bottomright"
    }

    ej.Tile.CaptionAlignment = {
        Normal: "normal",
        Left: "left",
        Right: "right",
        Center: "center"
    },

    ej.Tile.CaptionPosition = {
        InnerTop: "innertop",
        InnerBottom: "innerbottom",
        Outer: "outer"
    },

    ej.Tile.TileSize = {
        Medium: "medium",
        Small: "small",
        Large: "large",
        Wide: "wide"
    },

    ej.Tile.LiveTileType = {
        Flip: "flip",
        Slide: "slide",
        Carousel: "carousel"
    }
    $.extend(true, ej.Tile.prototype, ej.TileBase.prototype);
})(jQuery, Syncfusion);;

});