/*!
*  filename: ej.tooltip.js
*  version : 14.2.0.26
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.core"], fn) : fn();
})
(function () {
	
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ejTooltip = (function (_super) {
    __extends(ejTooltip, _super);
    function ejTooltip(element, options) {
        _super.call(this);
        this._rootCSS = "e-tooltip";
        this._setFirst = false;
        this.PluginName = "ejTooltip";
        this.id = "null";
        this.model = null;
        this.defaults = {
            height: "auto",
            width: "auto",
            enabled: true,
            content: null,
            containment: "body",
            target: null,
            title: null,
            closeMode: "none",
            autoCloseTimeout: 4000,
            position: {
                stem: { horizontal: "center", vertical: "bottom" },
                target: { horizontal: "center", vertical: "top" }
            },
            associate: "target",
            collision: "flipfit",
            showShadow: false,
            cssClass: null,
            animation: {
                effect: "none",
                speed: 0
            },
            isBalloon: true,
            showRoundedCorner: false,
            enableRTL: false,
            allowKeyboardNavigation: true,
            tip: {
                size: {
                    width: 20,
                    height: 10
                },
                adjust: {
                    xValue: 0,
                    yValue: 0
                }
            },
            trigger: "hover"
        };
        this.isTrack = true;
        this.arrowValue = { left: 0, top: 0, width: 0, height: 0, transform: null, display: null };
        this.tooltipPos = { width: 0, height: 0, left: 0, top: 0, bottom: 0, right: 0, position: "absolute" };
        this.targetPos = null;
        this.mouseTimer = null;
        this.positionTarget = null;
        this.positionTooltip = null;
        this.containerSize = null;
        this._createTitle = function () {
            this.tooltipTitle = ej.buildTag('div.e-def e-header', " ", {}, {});
            this.tooltipHeader = ej.buildTag('div', " ", {}, {});
            $(this.tooltipTitle).html(this.model.title).appendTo(this.tooltipHeader);
        };
        if (element) {
            if (!element["jquery"]) {
                element = $("#" + element);
            }
            if (element.length) {
                return $(element).ejTooltip(options).data(this.PluginName);
            }
        }
    }
    ejTooltip.prototype.setModel = function (opt, forceSet) {
        this.setModel(opt, forceSet);
    };
    ejTooltip.prototype.option = function (opt, forceSet) {
        this.option(opt, forceSet);
    };
    ejTooltip.prototype.triggerEvents = function (eventName, eventProp) {
        var temp;
        switch (eventName) {
            case "click":
                var clickArg = eventProp;
                temp = this._trigger(eventName, clickArg);
                break;
            case "hover":
                var hoverArg = eventProp;
                temp = this._trigger(eventName, hoverArg);
                break;
            case "tracking":
                var trackArg = eventProp;
                temp = this._trigger(eventName, trackArg);
                break;
            case "beforeOpen":
                var beforeOpenArg = eventProp;
                temp = this._trigger(eventName, beforeOpenArg);
                break;
            case "open":
                var openArg = eventProp;
                temp = this._trigger(eventName, openArg);
                break;
            case "beforeClose":
            case "close":
                var closeArg = eventProp;
                temp = this._trigger(eventName, closeArg);
                break;
        }
        return temp;
    };
    ejTooltip.prototype.enable = function (val) {
        if (this.tooltip.hasClass("e-disable")) {
            this.model.enabled = true;
            this.tooltip.removeClass("e-disable");
        }
    };
    ejTooltip.prototype.disable = function (val) {
        if (!this.tooltip.hasClass("e-disable")) {
            this.model.enabled = false;
            this.tooltip.addClass("e-disable");
        }
    };
    ejTooltip.prototype.show = function (targetElement, func) {
        if (this.model.enabled) {
            if (ej.isNullOrUndefined(targetElement)) {
                var target = (this.model.target == null) ? this.element : $(this.element).find(this.model.target + ":first");
                this._positionElement(target);
            }
            else {
                this._positionElement(targetElement);
            }
            if (!ej.isNullOrUndefined(func)) {
                if (typeof func === "string") {
                    $(this.tooltip).show(func);
                }
                else {
                    if (typeof func === "function") {
                        func.call.apply(this.tooltip);
                    }
                }
            }
            else {
                this._showTooltip();
            }
        }
    };
    ejTooltip.prototype.hide = function (func) {
        if (this.model.enabled) {
            if (!ej.isNullOrUndefined(func)) {
                if (typeof func === "string") {
                    $(this.tooltip).hide(func);
                }
                else if (typeof func === "function") {
                    func.call.apply(this.tooltip);
                }
            }
            else {
                this._hideTooltip();
            }
        }
    };
    ejTooltip.prototype._destroy = function () {
        $(this.tooltip).remove();
    };
    ejTooltip.prototype._setModel = function (options) {
        var option;
        for (option in options) {
            switch (option) {
                case "height":
                    this._setHeight(options[option]);
                    break;
                case "width":
                    this._setWidth(options[option]);
                    break;
                case "enabled":
                    this._enabled(options[option]);
                    break;
                case "content":
                    this._setContent(options[option]);
                    break;
                case "title":
                    this.model.title = options[option];
                    if (this.model.title == null) {
                        $(this.tooltipHeader).remove();
                        this.tooltipHeader = null;
                        this.tooltipTitle = null;
                        if (this.model.closeMode === ej.Tooltip.CloseMode.Sticky)
                            this._iconRender();
                    }
                    else
                        (ej.isNullOrUndefined(this.tooltipHeader)) ? this._createHeader() : $(this.tooltipTitle).html(this.model.title);
                    this.tooltipPos.height = $(this.tooltip).outerHeight();
                    break;
                case "associate":
                    this.model.associate = options[option];
                    this._wireMouseEvents(false);
                    this._wireMouseEvents(true);
                    break;
                case "position":
                    this._setPosition(options[option]);
                    break;
                case "collision":
                    this.model.collision = options[option];
                    break;
                case "closeMode":
                    if (typeof options[option] !== "undefined") {
                        this.model.closeMode = options[option];
                        if (this.model.closeMode == ej.Tooltip.CloseMode.Sticky)
                            this._iconRender();
                        else {
                            $(this.tooltipClose).remove();
                            this.tooltipClose = null;
                        }
                        this.tooltipPos.height = $(this.tooltip).outerHeight();
                    }
                    break;
                case "cssClass":
                    this._setSkin(options[option]);
                    break;
                case "showShadow":
                    this._shadowEffect(options[option], this.model.position);
                    break;
                case "isBalloon":
                    if (!ej.isNullOrUndefined(options[option])) {
                        this.model.isBalloon = options[option];
                        if (!this.model.isBalloon) {
                            $(this.tip).remove();
                            this.tip = null;
                        }
                        else
                            this._renderArrow();
                    }
                    break;
                case "animation":
                    var val = options[option];
                    this.model.animation = $.extend(true, this.model.animation, val);
                    if (this.model.animation.effect != ej.Tooltip.Effect.None) {
                        this._off($(this.tooltip), "mouseenter", this._onTooltipMouseEnter);
                        this._off($(this.tooltip), "mouseleave", this._onTooltipMouseLeave);
                    }
                    else if (this.model.animation.effect == ej.Tooltip.Effect.None) {
                        this._on($(this.tooltip), "mouseenter", this._onTooltipMouseEnter);
                        this._on($(this.tooltip), "mouseleave", this._onTooltipMouseLeave);
                    }
                    break;
                case "enableRTL":
                    this._setRTL(options[option]);
                    break;
                case "target":
                    this._wireTriggerEvents(false);
                    this.model.target = options[option];
                    this._wireTriggerEvents(true);
                    this._renderTarget();
                    break;
                case "trigger":
                    this._setTrigger(options[option]);
                    break;
                case "showRoundedCorner":
                    this.model.showRoundedCorner = options[option];
                    this._roundedCorner(options[option]);
                    break;
                case "allowKeyboardNavigation":
                    this.model.allowKeyboardNavigation = options[option];
                    if (!this.model.allowKeyboardNavigation) {
                        this._off($(window), "keydown", this._keyDown);
                    }
                    else {
                        this._on($(window), "keydown", this._keyDown);
                    }
                    break;
            }
        }
    };
    ejTooltip.prototype._enabled = function (val) {
        (val) ? this.enable(val) : this.disable(val);
        this.model.enabled = val;
    };
    ejTooltip.prototype._shadowEffect = function (val, position) {
        this.model.showShadow = val;
        var shadowEffect = null;
        $(this.tooltip).removeClass("e-tooltipShadowLeft e-tooltipShadowRight");
        if (this.model.showShadow) {
            switch (position.stem.horizontal) {
                case "center":
                    shadowEffect = (position.stem.vertical == "top") ? "e-tooltipShadowLeft" : (position.stem.vertical == "bottom") ? "e-tooltipShadowRight" : "e-tooltipShadowLeft";
                    break;
                case "right":
                    shadowEffect = (position.target.horizontal == "center" && position.stem.vertical == "top") ? "e-tooltipShadowLeft" : "e-tooltipShadowRight";
                    break;
                case "left":
                    shadowEffect = (position.target.horizontal == "center" && position.stem.vertical == "bottom") ? "e-tooltipShadowRight" : "e-tooltipShadowLeft";
                    break;
            }
            $(this.tooltip).addClass(shadowEffect);
        }
    };
    ejTooltip.prototype._setContent = function (val) {
        this.model.content = val;
        $(this.tooltipContent).html(this.model.content);
        this.tooltipPos.height = $(this.tooltip).outerHeight();
        this.tooltipPos.width = $(this.tooltip).outerWidth();
    };
    ejTooltip.prototype._setPosition = function (val) {
        this.model.position.stem = $.extend(true, this.model.position.stem, val.stem);
        this.model.position.target = $.extend(true, this.model.position.target, val.target);
    };
    ejTooltip.prototype._setTrigger = function (val) {
        this._wireTriggerEvents(false);
        this.model.trigger = val;
        this._wireTriggerEvents(true);
    };
    ejTooltip.prototype._init = function () {
        this.id = this.element[0].id;
        this.positionTarget = $.extend(true, {}, this.model.position.target);
        this.positionTooltip = $.extend(true, {}, this.model.position.stem);
        this.tipSize = $.extend(true, {}, this.model.tip.size);
        this._initialize();
        this._render();
        this.enable(this.model.enabled);
        this._wireEvents(true);
    };
    ejTooltip.prototype._initialize = function () {
        if (ej.isNullOrUndefined(this.model.target)) {
            if (ej.isNullOrUndefined(this.model.content) && (!ej.isNullOrUndefined(this.element.attr("title")))) {
                this.model.content = this.element.attr("title");
                this.element.attr("data-content", this.model.content);
                this.element.removeAttr("title");
            }
        }
        else
            this._renderTarget();
    };
    ejTooltip.prototype._wireEvents = function (val) {
        var wire = (val) ? "_on" : "_off";
        this._wireTriggerEvents(val);
        (this.model.target != null) ? this[wire](this.element, "mouseleave", this.model.target, this._onMouseOut) : this[wire](this.element, "mouseleave", this._onMouseOut);
        if (this.model.allowKeyboardNavigation)
            this[wire]($(window), "keydown", this._keyDown);
        (this.model.target != null) ? this[wire](this.element, "scroll", this.model.target, this._hideTooltip) : this[wire](this.element, "scroll", this._hideTooltip);
        this[wire]($(this.tooltip), "mouseenter", this._onTooltipMouseEnter);
        this[wire]($(this.tooltip), "mouseleave", this._onTooltipMouseLeave);
        this[wire]($(window), "resize", this._hideTooltip);
    };
    ejTooltip.prototype._wireTriggerEvents = function (val) {
        var wire = (val) ? "_on" : "_off";
        this._wireMouseEvents(val);
        var triggerEvent = (this.model.trigger == ej.Tooltip.Trigger.Click) ? "click tap" : (this.model.trigger == ej.Tooltip.Trigger.Focus) ? "focus tap" : "mouseenter tap";
        (this.model.target != null) ? this[wire](this.element, triggerEvent, this.model.target, this._targetHover) : this[wire](this.element, triggerEvent, this._targetHover);
        if (this.model.trigger == ej.Tooltip.Trigger.Focus)
            (this.model.target != null) ? this[wire](this.element, "blur", this.model.target, this._hideTooltip) : this[wire](this.element, "blur", this._hideTooltip);
    };
    ejTooltip.prototype._wireMouseEvents = function (val) {
        var wire = (val) ? "_on" : "_off";
        if (this.model.associate == ej.Tooltip.Associate.MouseEnter || this.model.associate == ej.Tooltip.Associate.MouseFollow)
            (this.model.target != null) ? this[wire](this.element, "mousemove tap", this.model.target, this._tooltipMove) : this[wire](this.element, "mousemove tap", this._tooltipMove);
    };
    ejTooltip.prototype._render = function () {
        this.tooltip = ej.buildTag("div.e-tooltip-wrap e-widget", "", {}, { role: "tooltip", 'aria-readonly': 'true', 'aria-hidden': 'true', 'aria-describedby': this.id + '_content', 'id': this.id + '_Main' });
        this.tooltipInter = ej.buildTag("div.e-tipContainer", "", {}, {});
        this.tooltip.append(this.tooltipInter);
        if (this.model.isBalloon)
            this._renderArrow();
        $(this.model.containment).append(this.tooltip);
        this._setHeight(this.model.height);
        this._setWidth(this.model.width);
        this._createHeader();
        this._tooltipContent();
        if (this.model.cssClass)
            this._setSkin(this.model.cssClass);
        if (this.model.showRoundedCorner)
            this._roundedCorner(this.model.showRoundedCorner);
        if (this.model.enableRTL)
            this._setRTL(this.model.enableRTL);
        $(this.tooltip).css({ "top": "auto", "left": "auto" });
        this.tooltipPos = { width: $(this.tooltip).outerWidth(), height: $(this.tooltip).outerHeight(), left: $(this.tooltip).offset().left, top: $(this.tooltip).offset().top, position: "absolute" };
        this._positionElement(this.element);
    };
    ejTooltip.prototype._setHeight = function (val) {
        this.model.height = val;
        (!isNaN(+val) && isFinite(val)) ? $(this.tooltip).css("height", val + "px") : $(this.tooltip).css("height", val);
        this.tooltipPos.height = $(this.tooltip).outerHeight();
    };
    ejTooltip.prototype._setWidth = function (val) {
        this.model.width = val;
        if (this.model.width != "auto") {
            val = (!isNaN(+val) && isFinite(val)) ? val + "px" : val;
            $(this.tooltip).css("max-width", val);
            $(this.tooltip).css("min-width", "0px");
        }
        $(this.tooltip).css("width", val);
        this.tooltipPos.height = $(this.tooltip).outerHeight();
    };
    ejTooltip.prototype._setRTL = function (val) {
        this.model.enableRTL = val;
        val ? this.tooltip.addClass("e-rtl") : this.tooltip.removeClass("e-rtl");
    };
    ejTooltip.prototype._setSkin = function (skin) {
        if (this.model.cssClass != skin) {
            this.tooltip.removeClass(this.model.cssClass).addClass(skin);
            this.model.cssClass = skin;
        }
    };
    ejTooltip.prototype._roundedCorner = function (val) {
        (this.model.showRoundedCorner) ? this.tooltip.addClass("e-corner") : this.tooltip.removeClass("e-corner");
    };
    ejTooltip.prototype._renderArrow = function () {
        if (ej.isNullOrUndefined(this.tip)) {
            this.tip = ej.buildTag('div.e-arrowTip', " ", { 'id': this.id + "_eTip" }, {});
            $(this.tip).append("<div class='e-arrowTipOuter'></div>").append("<div class='e-arrowTipInner'></div>");
            $(this.tip).insertBefore(this.tooltipInter);
        }
    };
    ejTooltip.prototype._adjustArrow = function (position) {
        var leftValue, topValue, rotationValue, tooltipWidth = $(this.tooltip).width(), tooltipHeight = $(this.tooltip).height();
        var positionTooltip = position.stem, positionTarget = position.target;
        if (positionTarget.horizontal == "right" || positionTarget.horizontal == "left") {
            rotationValue = (positionTooltip.horizontal == "left") ? "rotate(90deg)" : (positionTooltip.horizontal == "right") ? "rotate(270deg)" : (positionTooltip.vertical == "top") ? "rotate(180deg)" : (positionTooltip.vertical == "bottom") ? "rotate(0deg)" : "none";
            leftValue = (positionTooltip.horizontal == "left") ? -((this.tipSize.width / 2) + (this.tipSize.height / 2)) : (positionTooltip.horizontal == "right") ? (tooltipWidth - (this.tipSize.height / 2)) : ((this.tooltipPos.width) / 2 - (this.tipSize.width / 2));
            topValue = (positionTooltip.horizontal != "center") ? (positionTooltip.vertical == "top") ? 5 : (positionTooltip.vertical == "center") ? ((tooltipHeight / 2) - (this.tipSize.height / 2)) : ((tooltipHeight - 5) - this.tipSize.height) : (positionTooltip.vertical == "top") ? -this.tipSize.height : (positionTooltip.vertical == "bottom") ? tooltipHeight : (((this.tooltipPos.height / 2) + (this.tipSize.height / 2)) - (this.tipSize.width / 2));
        }
        else {
            rotationValue = (positionTooltip.vertical == "top") ? "rotate(180deg)" : (positionTooltip.vertical == "bottom") ? "rotate(0deg)" : (positionTooltip.horizontal == "left") ? "rotate(90deg)" : (positionTooltip.horizontal == "right") ? "rotate(270deg)" : "none";
            topValue = (positionTooltip.vertical == "top") ? -this.tipSize.height : (positionTooltip.vertical == "bottom") ? tooltipHeight : (((this.tooltipPos.height / 2) + (this.tipSize.height / 2)) - (this.tipSize.width / 2));
            if (positionTooltip.vertical == "center")
                leftValue = (positionTooltip.horizontal == "left") ? -((this.tipSize.width / 2) + (this.tipSize.height / 2)) : (tooltipWidth - (this.tipSize.height / 2));
            else
                leftValue = (positionTooltip.horizontal == "left") ? 10 : (positionTooltip.horizontal == "center") ? ((this.tooltipPos.width) / 2 - (this.tipSize.width / 2)) : ((this.tooltipPos.width - 10) - this.tipSize.width);
        }
        this.arrowValue.left = leftValue;
        this.arrowValue.top = topValue;
        if (positionTooltip.horizontal == "center" && positionTooltip.vertical == "center")
            $(this.tip).css({ left: leftValue + "px", top: topValue + "px", transform: rotationValue, display: "none", height: this.model.tip.size.height + "px", width: this.model.tip.size.width + "px" });
        else
            $(this.tip).css({ left: leftValue + "px", top: topValue + "px", transform: rotationValue, display: "block", height: this.model.tip.size.height + "px", width: this.model.tip.size.width + "px" });
    };
    ejTooltip.prototype._iconRender = function () {
        if (this.model.closeMode == ej.Tooltip.CloseMode.Sticky) {
            if (!ej.isNullOrUndefined(this.tooltipClose))
                $(this.tooltipClose).remove();
            this.tooltipClose = ej.buildTag("div .e-icon", " ", {}, { 'id': "_closeIcon" });
            (this.model.title != null) ? $(this.tooltipClose).insertAfter(this.tooltipTitle).addClass("e-close") : $(this.tooltipClose).insertBefore(this.tooltipInter).addClass("e-cross-circle");
            this._on($(this.tooltipClose), "click", this._hideTooltip);
        }
    };
    ejTooltip.prototype._renderTarget = function () {
        this.targetElement = $(this.element).find(this.model.target);
        for (var i = 0; i < this.targetElement.length; i++) {
            if (!ej.isNullOrUndefined($(this.targetElement[i]).attr("title"))) {
                this.targetElement[i].setAttribute("data-content", this.targetElement[i].title);
                this.targetElement[i].removeAttribute("title");
            }
        }
    };
    ejTooltip.prototype._tooltipContent = function () {
        this.tooltipContent = ej.buildTag('div.e-tipcontent e-def', "", {}, { 'id': this.id + '_content' });
        $(this.tooltipContent).html(this.model.content).addClass("e-def");
        (this.model.title != null) ? $(this.tooltipContent).insertAfter(this.tooltipHeader) : $(this.tooltipContent).appendTo(this.tooltipInter);
    };
    ejTooltip.prototype._positionElement = function (target) {
        this.tooltipPos.width = $(this.tooltip).outerWidth();
        this.tooltipPos.height = $(this.tooltip).outerHeight();
        this.containerSize = {
            height: (this.model.containment == "body") ? $(window).innerHeight() || document.documentElement.clientHeight || document.body.clientHeight : $(this.model.containment).outerHeight(),
            width: (this.model.containment == "body") ? $(window).innerWidth() || document.documentElement.clientWidth || document.body.clientWidth : $(this.model.containment).outerWidth()
        };
        if (this.model.associate == ej.Tooltip.Associate.Window)
            this._browserPosition();
        else if (this.model.associate == ej.Tooltip.Associate.Axis)
            this._axisPosition();
        else if (this.model.associate == ej.Tooltip.Associate.Target)
            this._tooltipPosition(target, this.model.position);
        if (this.model.collision != ej.Tooltip.Collision.None && this.model.associate == ej.Tooltip.Associate.Target)
            this._calcCollision(target, this.model.position);
    };
    ejTooltip.prototype._browserPosition = function () {
        var position = $.extend(true, {}, this.model.position);
        var calPosition = { position: "absolute", left: "auto", top: "auto", bottom: "auto", right: "auto" }, offsetTop, offsetLeft;
        if (!ej.isNullOrUndefined(this.tip))
            $(this.tip).css({ "display": "none" });
        (this.model.position.target.horizontal == "right") ? calPosition.right = 0 : (this.model.position.target.horizontal == "left") ? calPosition.left = 0 : (calPosition.left = (this.containerSize.width / 2) - (this.tooltipPos.width / 2));
        (this.model.position.target.vertical == "top") ? (calPosition.top = 0) : (this.model.position.target.vertical == "center") ? (calPosition.top = ((this.containerSize.height / 2) - (this.tooltipPos.height / 2))) : calPosition.bottom = 0;
        if (this.model.showShadow) {
            position.stem.horizontal = position.stem.vertical = "center";
            this._shadowEffect(this.model.showShadow, position);
        }
        $(this.tooltip).css(calPosition);
    };
    ejTooltip.prototype._tooltipMove = function (event) {
        if (this.model.closeMode == ej.Tooltip.CloseMode.None && this.model.enabled) {
            var proxy = this;
            if (this.model.associate == ej.Tooltip.Associate.MouseFollow)
                this._mousePosition(event);
            else if (this.model.associate == ej.Tooltip.Associate.MouseEnter) {
                clearTimeout(this.mouseTimer);
                this.mouseTimer = setTimeout(function () {
                    if (proxy.isTrack)
                        proxy._mousePosition(event);
                }, 300);
            }
        }
    };
    ejTooltip.prototype._mousePosition = function (event) {
        this.isCollision = true;
        var tipGapX = 0, tipGapY = 0, tipSize = 0, calcPosition = { left: event.pageX, top: event.pageY }, positionTooltip = $.extend(true, {}, this.model.position.stem), position = $.extend(true, {}, this.model.position);
        position.target.horizontal = position.target.horizontal = "center";
        while (this.isCollision) {
            var calcPosition = { left: event.pageX, top: event.pageY }, tipY = (this.model.isBalloon) ? (positionTooltip.vertical == "top" || positionTooltip.vertical == "bottom") ? (5 + (this.tipSize.height / 2)) : 0 : 0, tipX = (this.model.isBalloon) ? (positionTooltip.horizontal == "right" || positionTooltip.horizontal == "left") ? (10 + (this.tipSize.width / 2)) : 0 : 0;
            tipGapX = (this.model.tip.adjust.xValue != 0) ? this.model.tip.adjust.xValue : 7;
            tipGapY = (this.model.tip.adjust.yValue != 0) ? this.model.tip.adjust.yValue : 10;
            tipSize = (this.model.isBalloon) ? (positionTooltip.horizontal != "center") ? this.model.tip.size.height : (positionTooltip.vertical != "center") ? this.model.tip.size.height : 0 : 2;
            calcPosition.left += (positionTooltip.horizontal == "right") ? -this.tooltipPos.width : (positionTooltip.horizontal == "left") ? 0 : -(this.tooltipPos.width / 2);
            calcPosition.top += (positionTooltip.vertical == "bottom") ? -this.tooltipPos.height : (positionTooltip.vertical == "top") ? 0 : -(this.tooltipPos.height / 2);
            calcPosition.left += (positionTooltip.vertical != "center") ? ((positionTooltip.horizontal == "right") ? tipX : (positionTooltip.horizontal == "left") ? -tipX : 0) : 0;
            calcPosition.left += (positionTooltip.vertical == "center") ? (positionTooltip.horizontal == "right") ? -(tipSize) : (positionTooltip.horizontal == "left") ? +(tipSize + tipGapX) : 0 : 0;
            calcPosition.top += (positionTooltip.vertical == "top") ? +(tipSize + tipGapY) : (positionTooltip.vertical == "bottom") ? -(tipSize) : 0;
            if (this.targetElement != event.target) {
                this.targetElement = event.target;
                if (calcPosition.left < 0 || (calcPosition.left + this.tooltipPos.width > this.containerSize.width))
                    this.positionTooltip.horizontal = (calcPosition.left >= this.tooltipPos.width) ? "right" : ((this.containerSize.width - calcPosition.left) >= this.tooltipPos.width) ? "left" : "center";
                if (calcPosition.top < 0 || ((calcPosition.top + this.tooltipPos.height) > this.containerSize.height))
                    this.positionTooltip.vertical = (calcPosition.top >= this.tooltipPos.height) ? "bottom" : ((this.containerSize.height - calcPosition.top) >= this.tooltipPos.height) ? "top" : "center";
            }
            if (this.positionTooltip.horizontal != positionTooltip.horizontal || this.positionTooltip.vertical != positionTooltip.vertical) {
                this.isCollision = true;
                positionTooltip = $.extend(true, {}, this.positionTooltip);
            }
            else {
                this.isCollision = false;
                $(this.tooltip).css({ top: calcPosition.top + "px", left: calcPosition.left + "px", position: "absolute", right: "auto", bottom: "auto" });
                position.stem = $.extend(true, {}, this.positionTooltip);
                if (this.model.showShadow)
                    this._shadowEffect(this.model.showShadow, position);
                if (this.model.isBalloon)
                    this._adjustArrow(position);
                this._showTooltip();
                if (this.model.associate == ej.Tooltip.Associate.MouseEnter)
                    this.isTrack = false;
                if (this.model.associate == ej.Tooltip.Associate.MouseFollow) {
                    if (this.triggerEvents("tracking", { position: this.model.position, event: event }))
                        return;
                }
            }
        }
    };
    ejTooltip.prototype._axisPosition = function () {
        var position = $.extend(true, {}, this.model.position);
        if (typeof this.model.position.target.horizontal == 'number')
            var leftValue = (this.model.position.target.horizontal).toString();
        if (typeof this.model.position.target.vertical == 'number')
            var topValue = (this.model.position.target.vertical).toString();
        var offsetLeft = parseInt(leftValue), offsetTop = parseInt(topValue);
        if (!ej.isNullOrUndefined(this.tip))
            $(this.tip).css({ "display": "none" });
        if (this.model.showShadow) {
            position.stem.horizontal = position.stem.vertical = "center";
            this._shadowEffect(this.model.showShadow, position);
        }
        if (isFinite(offsetLeft) && isFinite(offsetTop))
            $(this.tooltip).css({ top: offsetTop, left: offsetLeft, position: "absolute" });
    };
    ejTooltip.prototype._tooltipPosition = function (target, position) {
        this.targetPos = { width: $(target).outerWidth(), height: $(target).outerHeight(), left: $(target).offset().left, top: $(target).offset().top, position: "absolute" };
        var tipSize = 0, tipGap = 0, tipAdjustment = 0, positionTooltip = $.extend(true, {}, position.stem), positionTarget = $.extend(true, {}, position.target);
        var calcPosition = $.extend(true, {}, this.targetPos);
        var tipY = (positionTooltip.vertical === "top" || positionTooltip.vertical === "bottom") ? (5 + (this.tipSize.height / 2)) : 0, tipX = (positionTooltip.horizontal === "right" || positionTooltip.horizontal === "left") ? (10 + (this.tipSize.width / 2)) : 0, tipGap = (positionTooltip.horizontal !== "center") ? this.model.tip.adjust.xValue : (positionTooltip.vertical !== "center") ? this.model.tip.adjust.yValue : 0;
        tipSize = (this.model.isBalloon) ? (positionTooltip.horizontal !== "center") ? this.model.tip.size.height : (positionTooltip.vertical !== "center") ? this.model.tip.size.height : 0 : 2;
        tipAdjustment = (this.model.isBalloon) ? (tipSize + tipGap) : tipGap;
        calcPosition.left += (positionTarget.horizontal === "right") ? this.targetPos.width : (positionTarget.horizontal === "left") ? 0 : (this.targetPos.width / 2);
        calcPosition.top += (positionTarget.vertical === "bottom") ? this.targetPos.height : (positionTarget.vertical === "top") ? 0 : (this.targetPos.height / 2);
        calcPosition.left += (positionTooltip.horizontal === "right") ? -this.tooltipPos.width : (positionTooltip.horizontal === "left") ? 0 : -(this.tooltipPos.width / 2);
        calcPosition.top += (positionTooltip.vertical === "bottom") ? -this.tooltipPos.height : (positionTooltip.vertical === "top") ? 0 : -(this.tooltipPos.height / 2);
        calcPosition.left += (positionTarget.horizontal !== "center") ? (positionTooltip.horizontal === "right") ? -tipSize : (positionTooltip.horizontal === "left") ? tipSize : 0 : (positionTooltip.vertical === "center") ? (positionTooltip.horizontal === "right") ? -tipSize : (positionTooltip.horizontal === "left") ? tipSize : 0 : 0;
        calcPosition.top += (positionTarget.horizontal === "center") ? ((positionTooltip.vertical === "bottom") ? -tipSize : (positionTooltip.vertical === "top") ? tipSize : 0) : (positionTooltip.horizontal === "center") ? (positionTooltip.vertical === "bottom") ? -tipSize : (positionTooltip.vertical === "top") ? tipSize : 0 : 0;
        calcPosition.left += (positionTarget.horizontal === "center" && positionTooltip.vertical !== "center") ? ((positionTooltip.horizontal === "right") ? tipX : (positionTooltip.horizontal === "left") ? -tipX : 0) : 0;
        calcPosition.top += (positionTarget.horizontal !== "center" && positionTooltip.horizontal !== "center") ? ((positionTooltip.vertical === "top") ? -tipY : (positionTooltip.vertical === "bottom") ? tipY : 0) : 0;
        this.tooltipPos.left = calcPosition.left;
        this.tooltipPos.top = calcPosition.top;
        if (this.model.collision === ej.Tooltip.Collision.None) {
            if (this.model.isBalloon)
                this._adjustArrow(position);
            this._shadowEffect(this.model.showShadow, position);
            $(this.tooltip).css({ "top": calcPosition.top + "px", "left": calcPosition.left + "px", position: "absolute" });
        }
    };
    ejTooltip.prototype._calcCollision = function (target, position) {
        var position = $.extend(true, {}, position), newPosition = $.extend(true, {}, position), arrowSize = this.model.tip.size.height, isCollision = true;
        var availSpace = {
            topSpace: parseInt(this.targetPos.top.toString()),
            rightSpace: this.containerSize.width - (parseInt(this.targetPos.left.toString()) + this.targetPos.width),
            bottomSpace: this.containerSize.height - (parseInt(this.targetPos.top.toString()) + this.targetPos.height),
            leftSpace: parseInt(this.targetPos.left.toString()),
            centerRight: this.containerSize.width - (parseInt(this.targetPos.left.toString()) + (this.targetPos.width / 2)),
            centerLeft: (parseInt(this.targetPos.left.toString()) + (this.targetPos.width / 2)),
            centerTop: (parseInt(this.targetPos.top.toString()) + (this.targetPos.height / 2)),
            centerBottom: this.containerSize.height - (parseInt(this.targetPos.top.toString()) + (this.targetPos.height / 2)),
            tooltipWidth: this.tooltipPos.width + arrowSize,
            tooltipHeight: this.tooltipPos.height + arrowSize
        };
        if (this.model.collision === ej.Tooltip.Collision.Fit)
            this._collisionFit(position, availSpace);
        else {
            while (isCollision) {
                newPosition = this._collisionFlip(newPosition, availSpace);
                if (newPosition.target.horizontal != position.target.horizontal || newPosition.target.vertical != position.target.vertical || newPosition.stem.horizontal != position.stem.horizontal || newPosition.stem.vertical != position.stem.vertical) {
                    this._tooltipPosition(target, newPosition);
                    position = $.extend(true, {}, newPosition);
                }
                else
                    isCollision = false;
            }
            if (!isCollision) {
                if (this.model.collision == ej.Tooltip.Collision.FlipFit) {
                    this._tooltipPosition(target, newPosition);
                    this._collisionFit(newPosition, availSpace);
                }
                else {
                    this._adjustArrow(newPosition);
                    this._shadowEffect(this.model.showShadow, newPosition);
                    $(this.tooltip).css({ "top": this.tooltipPos.top + "px", "left": this.tooltipPos.left + "px", position: "absolute" });
                }
            }
        }
    };
    ejTooltip.prototype._collisionFlip = function (position, availSpace) {
        var tooltipPos = $.extend(true, {}, this.tooltipPos), newPosition = $.extend(true, {}, position);
        if ((tooltipPos.left + tooltipPos.width) > this.containerSize.width || tooltipPos.left < 0) {
            if (position.target.horizontal != "center")
                newPosition.target.horizontal = (availSpace.leftSpace >= availSpace.tooltipWidth) ? "left" : (availSpace.rightSpace >= availSpace.tooltipWidth) ? "right" : "center";
            else
                newPosition.stem.horizontal = (availSpace.centerLeft >= availSpace.tooltipWidth) ? "right" : (availSpace.centerRight >= availSpace.tooltipWidth) ? "left" : "center";
        }
        if (tooltipPos.top < 0)
            newPosition.target.vertical = (availSpace.bottomSpace >= availSpace.tooltipHeight) ? "bottom" : "center";
        if ((tooltipPos.top + tooltipPos.height) > this.containerSize.height)
            newPosition.target.vertical = (availSpace.topSpace >= availSpace.tooltipHeight) ? "top" : "center";
        if (newPosition.target.horizontal != position.target.horizontal || newPosition.target.vertical != position.target.vertical) {
            if (newPosition.target.horizontal == "center")
                newPosition.stem.horizontal = (availSpace.centerLeft >= availSpace.tooltipWidth) ? "right" : (availSpace.centerRight >= availSpace.tooltipWidth) ? "left" : "center";
            else
                newPosition.stem.horizontal = (newPosition.target.horizontal == "right") ? "left" : "right";
        }
        if (newPosition.target.vertical != position.target.vertical || newPosition.target.horizontal != position.target.horizontal) {
            if (newPosition.target.vertical == "center")
                newPosition.stem.vertical = (availSpace.centerTop >= availSpace.tooltipHeight) ? "bottom" : (availSpace.centerBottom >= availSpace.tooltipHeight) ? "top" : (availSpace.centerTop > availSpace.centerBottom) ? "bottom" : "top";
            else
                newPosition.stem.vertical = (newPosition.target.vertical == "top") ? "bottom" : "top";
        }
        return newPosition;
    };
    ejTooltip.prototype._collisionFit = function (position, availSpace) {
        var tooltipPos = $.extend(true, {}, this.tooltipPos), isHorizontalCollision = false, isVerticalCollision = false;
        var leftValue = 1, topValue = 1, arrowValue = null;
        if (tooltipPos.left < 0 || ((tooltipPos.left + tooltipPos.width) > this.containerSize.width)) {
            leftValue = (tooltipPos.left < 0) ? 0 : ((tooltipPos.left + tooltipPos.width) > this.containerSize.width) ? tooltipPos.left - ((tooltipPos.left + tooltipPos.width) - this.containerSize.width) : 1;
            isHorizontalCollision = true;
        }
        if (tooltipPos.top < 0 || ((tooltipPos.top + tooltipPos.height) > this.containerSize.height)) {
            topValue = (tooltipPos.top < 0) ? 0 : ((tooltipPos.top + tooltipPos.height) > this.containerSize.height) ? tooltipPos.top - ((tooltipPos.top + tooltipPos.height) - this.containerSize.height) : 1;
            isVerticalCollision = true;
        }
        $(this.tooltip).css({
            top: (topValue != 1) ? topValue + "px" : tooltipPos.top + "px",
            left: (leftValue != 1) ? leftValue + "px" : tooltipPos.left + "px",
            position: "absolute"
        });
        this._adjustArrow(position);
        arrowValue = { left: this.arrowValue.left, top: this.arrowValue.top, transform: null, height: this.model.tip.size.height, width: this.model.tip.size.width, display: $(this.tip).css("display") };
        this.tooltipPos.top = topValue = (topValue != 1) ? topValue : tooltipPos.top;
        this.tooltipPos.left = leftValue = (leftValue != 1) ? leftValue : tooltipPos.left;
        if (arrowValue.display != "none") {
            if (this.model.isBalloon) {
                if (isHorizontalCollision)
                    this.arrowValue.left = this._horizontalAdjustment(position, availSpace);
                if (isVerticalCollision)
                    this.arrowValue.top = this._verticalAdjustment(position, availSpace);
            }
            arrowValue.transform = (this.arrowValue.left == -((this.tipSize.width / 2) + (this.tipSize.height / 2))) ? "rotate(90deg)" : (this.arrowValue.left == ($(this.tooltip).width() - (this.tipSize.height / 2))) ? "rotate(270deg)" : "none";
            if (arrowValue.transform == "none")
                arrowValue.transform = (this.arrowValue.top == -this.tipSize.height) ? "rotate(180deg)" : (this.arrowValue.top == $(this.tooltip).height()) ? "rotate(0deg)" : "none";
            $(this.tip).css({ left: this.arrowValue.left + "px", top: this.arrowValue.top + "px", transform: (arrowValue.transform == null) ? "rotate(0deg)" : arrowValue.transform, display: (arrowValue.transform == "none") ? "none" : "block", height: arrowValue.height, width: arrowValue.width });
            this.arrowValue.transform = $(this.tip).css("transform");
        }
        this._shadowEffect(this.model.showShadow, position);
    };
    ejTooltip.prototype._horizontalAdjustment = function (position, availSpace) {
        var arrowValue = { left: this.arrowValue.left, top: this.arrowValue.top, transform: null, height: this.model.tip.size.height, width: this.model.tip.size.width, display: this.arrowValue.display };
        $(this.tooltip).css({ "display": "block" });
        var arrowSize = (position.target.horizontal != "center") ? this.model.tip.size.height : this.model.tip.size.width;
        var arrowLeft = (position.target.horizontal != "center" && position.stem.horizontal == "left") ? $(this.tip).offset().left : (position.target.horizontal != "center" && position.stem.horizontal == "right") ? $(this.tip).offset().left + arrowSize : $(this.tip).offset().left;
        $(this.tooltip).css({ "display": "none" });
        if ((arrowLeft > availSpace.leftSpace) && ((arrowLeft + arrowSize) < (availSpace.leftSpace + this.targetPos.width)))
            return arrowValue.left;
        else {
            if ((arrowLeft > (availSpace.leftSpace + this.targetPos.width)) || (arrowLeft < availSpace.leftSpace))
                arrowValue.left = (availSpace.leftSpace + this.targetPos.width / 2) - parseInt(this.tooltipPos.left.toString());
            return arrowValue.left;
        }
    };
    ejTooltip.prototype._verticalAdjustment = function (position, availSpace) {
        var arrowValue = { left: this.arrowValue.left, top: this.arrowValue.top, transform: null, height: this.model.tip.size.height, width: this.model.tip.size.width, display: this.arrowValue.display };
        $(this.tooltip).css({ "display": "block" });
        var arrowSize = (position.target.horizontal != "center") ? this.model.tip.size.width : this.model.tip.size.height;
        var arrowTop = (position.target.horizontal == "center" && position.stem.vertical == "top") ? $(this.tip).offset().top : $(this.tip).offset().top + arrowSize;
        $(this.tooltip).css({ "display": "none" });
        if ((arrowTop > availSpace.topSpace) && (arrowTop < (availSpace.topSpace + this.targetPos.height)))
            return arrowValue.top;
        else {
            if ((arrowTop < availSpace.topSpace) || ((arrowTop + arrowSize) > (availSpace.topSpace + this.targetPos.height)))
                arrowValue.top = (availSpace.topSpace + this.targetPos.height / 2) - parseInt(this.tooltipPos.top.toString());
            return arrowValue.top;
        }
    };
    ejTooltip.prototype._createHeader = function () {
        if (this.model.title != null) {
            if (ej.isNullOrUndefined(this.tooltipTitle))
                this._createTitle();
            if (ej.isNullOrUndefined(this.tooltipContent))
                $(this.tooltipHeader).appendTo(this.tooltipInter).addClass("e-tooltipHeader");
            else
                $(this.tooltipHeader).insertBefore(this.tooltipContent).addClass("e-tooltipHeader");
        }
        if (this.model.closeMode == ej.Tooltip.CloseMode.Sticky)
            this._iconRender();
    };
    ejTooltip.prototype._hideTooltip = function () {
        var speed;
        speed = (this.model.animation.speed != 0) ? this.model.animation.speed : (this.model.animation.effect == ej.Tooltip.Effect.Slide) ? 200 : (this.model.animation.effect == ej.Tooltip.Effect.Fade) ? 800 : 0;
        if (this.model.enabled == true && $(this.tooltip).css("display") == 'block') {
            if (this.triggerEvents("beforeClose", {}))
                return;
            (this.model.animation.effect == ej.Tooltip.Effect.Fade) ? $(this.tooltip).fadeOut(speed) : (this.model.animation.effect == ej.Tooltip.Effect.Slide) ? $(this.tooltip).slideUp(speed) : $(this.tooltip).css({ display: "none" });
            if ($(this.tooltip).css("display") == 'none')
                $(this.tooltip).attr('aria-hidden', 'true');
            if (this.triggerEvents("close", {}))
                return;
        }
    };
    ejTooltip.prototype._showTooltip = function () {
        var speed = (this.model.animation.speed != 0) ? this.model.animation.speed : (this.model.animation.effect == ej.Tooltip.Effect.Slide) ? 200 : (this.model.animation.effect == ej.Tooltip.Effect.Fade) ? 800 : 0;
        if ($(this.tooltip).css("display") == 'none' && this.model.enabled == true) {
            (this.model.animation.effect == ej.Tooltip.Effect.Fade) ? $(this.tooltip).fadeIn(speed) : (this.model.animation.effect == ej.Tooltip.Effect.Slide) ? $(this.tooltip).slideDown(speed) : $(this.tooltip).css({ display: "block" });
            if ($(this.tooltip).css("display") == 'block')
                $(this.tooltip).attr('aria-hidden', 'false').css({ zIndex: ej.getMaxZindex() + 1 });
            if (this.triggerEvents("open", {}))
                return;
        }
    };
    ejTooltip.prototype._tooltipAuto = function () {
        var proxy = this;
        this.timer = setTimeout(function () {
            proxy._hideTooltip();
        }, proxy.model.autoCloseTimeout);
    };
    ejTooltip.prototype._beforeOpenTooltip = function (event) {
        this.positionTooltip = $.extend(true, {}, this.model.position.stem);
        this.positionTarget = $.extend(true, {}, this.model.position.target);
        this.targetElement = this.element;
        if (!ej.isNullOrUndefined(this.model.target)) {
            if (!ej.isNullOrUndefined($(event.target).attr('data-content'))) {
                this.model.content = $(event.target).attr('data-content');
                this._setContent(this.model.content);
            }
        }
    };
    ejTooltip.prototype._targetHover = function (event) {
        if (this.model.enabled) {
            if (this.triggerEvents("beforeOpen", { event: event }))
                return;
            this._beforeOpenTooltip(event);
            if (this.model.associate != ej.Tooltip.Associate.MouseEnter && this.model.associate != ej.Tooltip.Associate.MouseFollow) {
                (!ej.isNullOrUndefined(this.model.target)) ? this._positionElement(event.target) : this._positionElement(this.element);
                $(this.tooltip).stop(true, true);
                clearTimeout(this.timer);
                this._showTooltip();
                if (this.model.closeMode == ej.Tooltip.CloseMode.Auto)
                    this._tooltipAuto();
                (event.type == "click") ? this.triggerEvents("click", { event: event }) : this.triggerEvents("hover", { event: event });
            }
            else
                this.isTrack = true;
        }
    };
    ejTooltip.prototype._onMouseOut = function (event) {
        if (this.model.enabled) {
            if (this.model.closeMode == ej.Tooltip.CloseMode.None)
                this._hideTooltip();
            clearTimeout(this.mouseTimer);
        }
    };
    ejTooltip.prototype._onTooltipMouseEnter = function (event) {
        var proxy = this;
        if (this.model.enabled) {
            if (this.model.animation.effect == ej.Tooltip.Effect.None)
                $(proxy.tooltip).css({ display: "block" });
        }
    };
    ejTooltip.prototype._onTooltipMouseLeave = function (event) {
        var proxy = this;
        if (this.model.enabled) {
            if (this.model.animation.effect == ej.Tooltip.Effect.None) {
                if (proxy.model.closeMode == ej.Tooltip.CloseMode.None)
                    $(proxy.tooltip).css({ display: "none" });
            }
        }
    };
    ejTooltip.prototype._keyDown = function (event) {
        var code = (event.keyCode) ? event.keyCode : (event.which) ? event.which : event.charCode;
        if (this.model.enabled) {
            switch (code) {
                case 27:
                    event.preventDefault();
                    this._hideTooltip();
                    break;
            }
        }
    };
    return ejTooltip;
}(ej.WidgetBase));
window.ej.widget("ejTooltip", "ej.Tooltip", new ejTooltip());
window["ejTooltip"] = null;
ej.Tooltip.CloseMode = {
    Auto: "auto",
    None: "none",
    Sticky: "sticky"
};
ej.Tooltip.Effect = {
    Slide: "slide",
    Fade: "fade",
    None: "none"
};
ej.Tooltip.Trigger = {
    Hover: "hover",
    Click: "click",
    Focus: "focus"
};
ej.Tooltip.Collision = {
    Flip: "flip",
    FlipFit: "flipfit",
    None: "none",
    Fit: "fit"
};
ej.Tooltip.Associate = {
    Window: "window",
    MouseFollow: "mousefollow",
    MouseEnter: "mouseenter",
    Target: "target",
    Axis: "axis"
};
;

});