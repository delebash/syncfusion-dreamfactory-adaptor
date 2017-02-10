/*!
*  filename: ej.daterangepicker.js
*  version : 14.4.0.20
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.globalize","./../common/ej.core","./../common/ej.scroller","./ej.datepicker","./ej.timepicker"], fn) : fn();
})
(function () {
	
/// <reference path="../../common/jquery.d.ts" />
/// <reference path="../../ej.web.all.d.ts" />
"use strict";
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var ejDateRangePicker = (function (_super) {
    __extends(ejDateRangePicker, _super);
    function ejDateRangePicker(element, options) {
        _super.call(this);
        this._rootCSS = "e-daterangepicker";
        this._setFirst = false;
        this.PluginName = "ejDateRangePicker";
        this.id = "myDateRange";
        this._addToPersist = ["value"];
        this.type = "editor";
        this.angular = {
            require: ['?ngModel', '^?form', '^?ngModelOptions'],
            requireFormatters: true
        };
        this.model = null;
        this.defaults = {
            height: "auto",
            width: "auto",
            value: "",
            cssClass: "",
            enabled: true,
            startDate: null,
            endDate: null,
            enableTimePicker: false,
            ranges: null,
            locale: "en-US",
            separator: "-",
            watermarkText: "Select Range",
            dateFormat: "",
            timeFormat: "",
            showPopupButton: true,
            showRoundedCorner: false,
            allowEdit: true,
            enablePersistence: false
        };
        this._isIE8 = (ej.browserInfo().name == "msie") && (ej.browserInfo().version == "8.0") ? true : false;
        this._prevValue = null;
        this._validState = null;
        ejDateRangePicker.prototype.observables =["value"];
        if (element) {
            if (!element["jquery"]) {
                element = $("#" + element);
            }
            if (element.length) {
                return $(element).ejDateRangePicker().data(this.PluginName);
            }
        }
    }
    ejDateRangePicker.prototype.setModel = function (opt, forceSet) {
        this.setModel(opt, forceSet);
    };
    ejDateRangePicker.prototype.option = function (opt, forceSet) {
        this.option(opt, forceSet);
    };

    ejDateRangePicker.prototype._setModel = function (options) {
        var option;
        for (option in options) {
            switch (option) {
                case "allowEdit":
                    if (!options[option]) {
                        this.element.attr("readonly", "readonly");
                        this.element.on("mousedown", $.proxy(this._showDatePopUp, this));
                        this.element.off("blur", $.proxy(this._onMainFocusOut, this));
                    }
                    break;
                case "startDate":
                    var status = this._validateValues(options[option], "left");
                    if (status == false)
                        options[option] = null;
                    else {
                        if (!this._startEndValidation() && this.model.endDate != null) {
                            this._resetValues();
                            this.model.endDate = null;
                        }
                        this._updateValues();
                        this._selectedStartDate = this.model.startDate;
                        options[option] = this.model.startDate;
                    }

                    break;
                case "endDate":
                    var status = this._validateValues(options[option], "right");
                    if (status == false)
                        options[option] = null;
                    else {
                        if (!this._startEndValidation()) {
                            this._rightDP.element.parents(".e-datewidget").addClass("e-val-error");
                            this.model.endDate = null;
                        }
                        this._updateValues();
                        options[option] = this.model.endDate;
                    }
                    break;
                case "enableTimePicker":
                    this.model.enableTimePicker = options[option];
                    if (options[option]) {
                        this._renderTimePicker();
                    } else
                        this._removeTimePicker();
                    if (this._scrollerObj) {
                        this._scrollerObj.model.height = this.datePopup.height();
                        this._scrollerObj.refresh();
                    }
                    break;
                case "locale":
                    this._setCulture(options[option]);
                    options[option] = this.model.locale;
                    break;
                case "separator":
                    this.model.separator = options[option];
                    this._mainValue();
                    break;
                case "dateFormat":
                    if (this._leftDP)
                        this._leftDP.option(option, options[option]);
                    if (this._rightDP)
                        this._rightDP.option(option, options[option]);
                    this.model.dateFormat = options[option];
                    this._getDateTimeFormat();
                    this._updateInput();
                    break;
                case "timeFormat":
                    if (this._leftTP)
                        this._leftTP.option(option, options[option]);
                    if (this._rightTP)
                        this._rightTP.option(option, options[option]);
                    this.model.timeFormat = options[option];
                    this._getDateTimeFormat();
                    this._updateInput();
                    break;
                case "watermarkText":
                    if (ej.isNullOrUndefined(this._options))
                        this._options = {};
                    this._options["watermarkText"] = this.model.watermarkText = options[option];
                    this._localizedLabels.watermarkText = this.model.watermarkText;
                    this._setWaterMark();
                    break;
                case "cssClass":
                    this._changeSkin(options[option]);
                    break;
                case "showRoundedCorner":
                    this._setRoundedCorner(options[option]);
                    break;

                case "value":
                    this.element.val(options[option]);
                    this._onMainFocusOut();
                    options[option] = this.model.value;
                    break;

                case "height":
                    this.wrapper.height(options[option]);
                    break;
                case "width":
                    this.wrapper.width(options[option]);
                    break;
                case "enabled":
                    if (options[option])
                        this.enable();
                    else
                        this.disable();
                    break;
            }
        }
    };
    ejDateRangePicker.prototype._init = function (options) {
        this._options = options;
        this._flagevents = false;
        this._id = this.element.attr("id");
        this._isSupport = document.createElement("input").placeholder == undefined ? false : true;
        if (this.element.val() == "" && this.model.value) {
            this.element.val(this.model.value);
        }
        if (this.element.val())
            this._setInitValue();
        this._createDateRangePicker();
        if (this._validState == false && this.element.val())
            this.wrapper.addClass("e-error");
        this._popupOpen = false;
        this._wireEvents();
    };
    ejDateRangePicker.prototype._setInitValue = function () {
        var datestring = this.element.val().split(this.model.separator), _startdate = ej.parseDate(datestring[0], this._dateTimeFormat, this.model.locale), _enddate = ej.parseDate(datestring[1], this._dateTimeFormat, this.model.locale);
        if (_startdate && _enddate) {
            this.model.startDate = _startdate;
            this.model.endDate = _enddate;
        }
    };
    ejDateRangePicker.prototype._getNextMonth = function (current) {
        var local = current;
        if (!(local instanceof Date))
            return new Date();
        var month = local.getMonth();
        if (month == 11) {
            var year = local.getFullYear() + 1;
            month = -1;
        } else
            var year = local.getFullYear();
        var dummy = new Date();
        dummy = new Date(dummy.setFullYear(year));
        dummy = new Date(dummy.setMonth(month + 1));
        dummy = new Date(dummy.setDate(1));
        return dummy;
    };
    ejDateRangePicker.prototype._getDateTimeFormat = function () {
        var pattern = ej.preferredCulture(this.model.locale).calendars.standard.patterns;
        if (!this.model.dateFormat)
            this.model.dateFormat = pattern.d;
        if (this.model.enableTimePicker) {
            if (!this.model.timeFormat)
                this.model.timeFormat = pattern.t;
            this._dateTimeFormat = this.model.dateFormat + " " + this.model.timeFormat;
        } else
            this._dateTimeFormat = this.model.dateFormat;
    };
    ejDateRangePicker.prototype._setValues = function () {
        this._leftDP.option("value", this.model.startDate);
        this._rightDP.option("value", this.model.endDate || null);
        if (this.model.startDate)
            this._setStartDate(this.model.startDate, $('.current-month[date="' + this.model.startDate.toDateString() + '"]'), true);
        if (this.model.endDate)
            this._setEndDate(this.model.endDate, $('.current-month[date="' + this.model.endDate.toDateString() + '"]'), true);
        this._rangeRefresh(this._setArgs(this._leftDP.popup));
        this._rangeRefresh(this._setArgs(this._rightDP.popup));
        this._rightDP.element.parents(".e-datewidget").removeClass("e-error");
        if (this.model.enableTimePicker) {
            this._leftTP.option("value", this.model.startDate);
            this._rightTP.option("value", this.model.endDate);
        }
        this._updateRanges("left");
        this._updateRanges("right");
    };

    ejDateRangePicker.prototype._customSet = function () {
        this._selectedStartDate = this.model.startDate;
        this._selectedEndDate = this.model.endDate;
        this._resetValues();
        this._setValues();
        if (!this._popupOpen)
            this._mainValue();
        this._refreshMinMax();
        this._setWaterMark();
    };
    ejDateRangePicker.prototype._setCulture = function (culture) {
        culture = ej.preferredCulture(culture).name;
        this.model.locale = culture;
        this._setOption("locale", culture);
        this._localizedLabels = this._getLocalizedLabels();
        this._setLocalizedText();
        this._updateInput();
    };
    ejDateRangePicker.prototype._setRoundedCorner = function (boolean) {
        if (boolean) {
            this._input_innerWrapper.addClass("e-corner");
            this.popup.addClass("e-corner");
        } else {
            this._input_innerWrapper.removeClass("e-corner");
            this.popup.removeClass("e-corner");
        }
        this._setOption("showRoundedCorner", boolean);
    };
    ejDateRangePicker.prototype._validateValues = function (val, cal_type) {
        var obj = cal_type == "right" ? this._rightDP : this._leftDP;
        var datavalu = val;
        if (datavalu != null && typeof datavalu == "string") {
            if (cal_type == "left")
                this.model.startDate = ej.parseDate(val, this.model.dateFormat, this.model.locale) || null;
            else
                this.model.endDate = ej.parseDate(val, this.model.dateFormat, this.model.locale) || null;
        } else {
            if (val instanceof Date) {
                if (cal_type == "left") {
                    this.model.startDate = val;
                    if (!isNaN(val.getDate())) {
                        if (typeof this._formatter(this.model.startDate, this.model.locale) != "string")
                            this.model.startDate = ej.parseDate(this._formatter(this.model.startDate, this.model.locale), this.model.dateFormat);
                    } else
                        return false;
                } else if (cal_type == "right") {
                    this.model.endDate = val;
                    if (!isNaN(val.getDate())) {
                        if (typeof this._formatter(this.model.endDate, this.model.locale) != "string")
                            this.model.endDate = ej.parseDate(this._formatter(this.model.endDate, this.model.locale), this.model.dateFormat);
                    } else
                        return false;
                }
            } else
                return false;
        }
        return true;
    };
    //Date formatter - Convert date object to specific date format
    ejDateRangePicker.prototype._formatter = function (date, format) {
        var newFormat = this._checkFormat(format);
        return ej.format(date, newFormat, this.model.locale);
    };

    ejDateRangePicker.prototype._checkFormat = function (format) {
        var proxy = this;
        var dateFormatRegExp = this._regExp();
        return format.replace(dateFormatRegExp, function (match) {
            match = match === "/" ? ej.preferredCulture(proxy.model.locale).calendars.standard['/'] !== "/" ? "'/'" : match : match;
            return match;
        });
    };
    ejDateRangePicker.prototype._regExp = function () {
        return /\/dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|HH|H|hh|h|mm|m|fff|ff|f|tt|ss|s|zzz|zz|z|gg|g|"[^"]*"|'[^']*'|[/]/g;
    };

    ejDateRangePicker.prototype._setArgs = function (element) {
        var date = new Date($(element.find(".current-month")[0]).attr("date"));
        this.args = {};
        this.args.element = element;
        this.args.month = date.getMonth();
        this.args.year = date.getFullYear();
        return this.args;
    };
    ejDateRangePicker.prototype._changeSkin = function (skin) {
        this.wrapper.removeClass(this.model.cssClass).addClass(skin);
        this.popup.removeClass(this.model.cssClass).addClass(skin);

        this._setOption("cssClass", skin);
    };
    ejDateRangePicker.prototype._createDateRangePicker = function () {
        this._localizedLabels = this._getLocalizedLabels();
        this.element.addClass("e-input").attr({ 'aria-atomic': 'true', 'aria-live': 'assertive', 'tabindex': '0', 'name' : this.element.attr('name') == undefined ? this._id : this.element.attr('name') });

        this.wrapper = ej.buildTag("span.e-daterangewidget e-widget " + this.model.cssClass);
        if (!ej.isTouchDevice())
            this.wrapper.addClass('e-ntouch');
        this._input_innerWrapper = ej.buildTag("span.e-in-wrap e-box");
        this.wrapper.append(this._input_innerWrapper).insertBefore(this.element);
        this._input_innerWrapper.append(this.element);
        this._input_innerWrapper.addClass('e-padding');
        this.dateRangeIcon = ej.buildTag("span.e-select#" + this.id + "-img", "", {}, (this._isIE8) ? { 'unselectable': 'on' } : {}).append(ej.buildTag("span.e-icon e-calendar", "", {}, { 'aria-label': 'Select' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})).insertAfter(this.element);
        this.popup = ej.buildTag("div.e-daterangepicker-popup e-popup e-widget e-box" + this.model.cssClass + "#" + this.element[0].id + "_popup").css("display", "none");
        if (!this._isSupport) {
            this._hiddenInput = ej.buildTag("input.e-input e-placeholder ", "", {}, { type: "text" }).insertAfter(this.element);
            this._hiddenInput.val(this._localizedLabels.watermarkText);
            this._hiddenInput.css("display", "block");
            var proxy = this;
            $(this._hiddenInput).focus(function () {
                proxy.element.focus();
            });
        }
        $('body').append(this.popup);
        this.datePopup = ej.buildTag("div.e-datepickers-popup");
        this.popup.append(this.datePopup);
        this._leftDiv = ej.buildTag("div.e-left-datepicker");
        this._rightDiv = ej.buildTag("div.e-right-datepicker");
        this.datePopup.append(this._leftDiv);
        this.datePopup.append(this._rightDiv);
        this.calendar_left = ej.buildTag("input.leftDate_wrapper#" + this.element[0].id + "leftDate_wrapper", "", {}, { "type": "text" });
        this._leftDiv.append(this.calendar_left);
        this.calendar_right = ej.buildTag("input.rightDate_wrapper#" + this.element[0].id + "rightDate_wrapper", "", {}, { "type": "text" });
        this._rightDiv.append(this.calendar_right);
        var proxy = this;
        this.culture = ej.preferredCulture(this.model.locale);
        this._getDateTimeFormat();
        this.calendar_left.ejDatePicker({
            displayInline: true,
            showFooter: false,
            watermarkText: "",
            width: "100%",
            enableStrictMode: true,
            layoutChange: function (e) {
                proxy._refreshEvents("left");
                proxy._updateRanges("left");
                if (proxy._scrollerObj) {
                    proxy._scrollerObj.model.height = proxy.datePopup.height();
                    proxy._scrollerObj.refresh();
                }
            },
            showTooltip: false,
            locale: this.model.locale,
            dateFormat: this.model.dateFormat,
            _month_Loaded: function (e) {
                proxy._previousNextHandler(e);
            },
            enablePersistence: this.model.enablePersistence
        });
        this._leftDP = this.calendar_left.data("ejDatePicker");
        this._leftDP._getInternalEvents = true, this._leftDP._DRPdisableFade = true;
        this._leftDP.option("showPopupButton", false);
        this._leftDP.popup.css({ "position": "static", "visibility": "visible" });
        this.calendar_right.ejDatePicker({
            displayInline: true,
            width: "100%",
            showFooter: false,
            watermarkText: "",
            enableStrictMode: true,
            locale: this.model.locale,
            create: $.proxy(this._updateOnRender, this),
            layoutChange: function (e) {
                proxy._refreshEvents("right");
                proxy._updateRanges("right");
                if (proxy._scrollerObj) {
                    proxy._scrollerObj.model.height = proxy.datePopup.height();
                    proxy._scrollerObj.refresh();
                }
            },
            dateFormat: this.model.dateFormat,
            _month_Loaded: function (e) {
                proxy._previousNextHandler(e);
            },
            enablePersistence: this.model.enablePersistence
        });
        this._rightDP = this.calendar_right.data("ejDatePicker");
        this._rightDP._getInternalEvents = true, this._rightDP._DRPdisableFade = true; // to get the layout change client side event
        this._rightDP.option("showPopupButton", false);
        this._rightDP.popup.css({ "position": "static", "visibility": "visible" });
        if (this.model.ranges)
            this._renderRanges();
        if (this.model.enableTimePicker)
            this._renderTimePicker();
        this._renderButton();
        this._bindDateButton();
        this._refreshEvents("left");
        this._refreshEvents("right");
        this._updateRanges("left");
        this._updateRanges("right");

        if (this.wrapper)
            this.wrapper.width(this.model.width);
    };
    ejDateRangePicker.prototype._updateOnRender = function (e) {
        if (this.model.enableTimePicker) {
            if (this._rightTime) {
                this._rightTP = this._rightTime.ejTimePicker("instance");
                this._updateValues();
            }
        } else {
            if (this.calendar_right) {
                this._rightDP = this.calendar_right.ejDatePicker("instance");
                this._updateValues();
            }
        }
    };
    ejDateRangePicker.prototype._updateValues = function () {
        this._getDateTimeFormat();
        if (this._startEndValidation() || (this.model.startDate != null && this.model.endDate == null)) {
            this._validateValues(this.model.startDate, "left");
            this._validateValues(this.model.endDate, "right");
            this._setValues();
            this._mainValue();
        } else {
            this._clearRanges();
            this.element.val("");
        }
        this._refreshMinMax();
        this._setWaterMark();
    };
    ejDateRangePicker.prototype._startEndValidation = function () {
        if (this.model.startDate && this.model.endDate) {
            var start = this.model.startDate, end = this.model.endDate;
            if (end && start > end) {
                return false;
            } else
                return true;
        }
        return false;
    };
    ejDateRangePicker.prototype._renderButton = function () {
        this._buttonDiv = ej.buildTag("div.e-drpbuttons");
        var _reset = ej.buildTag("div.e-drp-button e-drp-reset");
        var _apply = ej.buildTag("div.e-drp-button e-drp-apply e-disable");
        var _cancel = ej.buildTag("div.e-drp-button e-drp-cancel");
        this._buttonDiv.append(_reset);
        this._buttonDiv.append(_apply);
        this._buttonDiv.append(_cancel);
        this.popup.append(this._buttonDiv);
        this._setLocalizedText();
    };
    ejDateRangePicker.prototype._setLocalizedText = function () {
        if (!ej.isNullOrUndefined(this._options)) {
            if (!ej.isNullOrUndefined(this._options.buttonText))
                $.extend(this._localizedLabels.buttonText, this._options.buttonText);
            if (!ej.isNullOrUndefined(this._options.watermarkText))
                this._localizedLabels.watermarkText = this._options.watermarkText;
        }
        this.model.buttonText = this._localizedLabels.ButtonText;
        $(this._buttonDiv.find("div.e-drp-reset")).text(this.model.buttonText.reset);
        $(this._buttonDiv.find("div.e-drp-apply")).text(this.model.buttonText.apply);
        $(this._buttonDiv.find("div.e-drp-cancel")).text(this.model.buttonText.cancel);
        if (this._customRangePicker && this._customRangePicker.find("ul li.e-custompic").length > 0)
            (this._customRangePicker.find("ul li.e-custompic")).text(this._localizedLabels.customPicker);
    };

    ejDateRangePicker.prototype._renderRanges = function () {
        this._renderRangesWrapper();
        this.popup.append(this._customRangePicker);
        this._ranges_li = "";
        var proxy = this;
        if (this.model.ranges) {
            for (var i = 0; i < this.model.ranges.length; i++) {
                var s = this.model.ranges[i];
                var value = s.range;
                if (value.length === 2) {
                    var start = new Date(value[0]);
                    var end = new Date(value[1]);
                    if (ej.isNullOrUndefined(start))
                        start = new Date(value[0]);
                    if (ej.isNullOrUndefined(end))
                        end = new Date(value[1]);
                    if (start <= end) {
                        proxy._ranges_li += "<li aria-selected='false' title='" + s.label + "' class='rangeItem' e-date-range='" + JSON.stringify(value) + "' e-data-value='" + s.range + "'>" + s.label + "</li>";
                    }
                }
            }
        }
        this._ranges_li += "<li aria-selected='false' class='rangeItem e-active e-custompic' e-date-range='customPicker'>" + this._localizedLabels.customPicker + "</li>";
        this.popup.find("div.e-custom-dateranges ul").append(this._ranges_li);
        this._on(this._customRangePicker.find("ul li.rangeItem"), "click", this._customSelection);
        this._customRangePicker.ejScroller({ height: this.datePopup.height(), width: 0, scrollerSize: 15 });
        proxy._scrollerObj = this._customRangePicker.ejScroller("instance");
    };
    ejDateRangePicker.prototype._removeTimePicker = function () {
        this._leftTP.destroy();
        this._rightTP.destroy();
        this._rightTP = null;
        this._leftTP = null;
        this._leftTime.remove();
        this._rightTime.remove();
        this._setOption("width", "");
        this._setOption("width", "100%");
        this._updateValues();
    };
    ejDateRangePicker.prototype._setOption = function (option, value) {
        if (this._leftDP)
            this._leftDP.option(option, value);
        if (this._rightDP)
            this._rightDP.option(option, value);
        if (this.model.enableTimePicker) {
            if (this._leftTP)
                this._leftTP.option(option, value);
            if (this._rightTP)
                this._rightTP.option(option, value);
        }
    };
    ejDateRangePicker.prototype._renderTimePicker = function () {
        if (this.model.timeFormat == '')
            this.model.timeFormat = this.culture.calendar.patterns.t;
        this._leftTime = ej.buildTag("input.leftTime#" + this._id + "_lTime");
        this._leftDiv.append(this._leftTime);
        var proxy = this;
        this._leftTime.ejTimePicker({
            width: "100px", popupWidth: "100px",
            locale: this.model.locale,
            timeFormat: this.model.timeFormat,
            select: function (e) {
                if (proxy.model.startDate && proxy.model.endDate) {
                    if (proxy._rightTP && proxy.model.startDate.toLocaleDateString() == proxy.model.endDate.toLocaleDateString())
                        proxy._rightTP.option("minTime", e.value);
                    proxy._buttonDiv.find(".e-drp-apply").removeClass("e-disable");
                }
            }
        });
        this._leftTP = this._leftTime.ejTimePicker("instance");
        this._leftTP.popup.addClass("e-daterange-timepopup");
        this._rightTime = ej.buildTag("input.rightTime#" + this._id + "_rTime");
        this._rightDiv.append(this._rightTime);
        this._rightTime.ejTimePicker({
            width: "100px", popupWidth: "100px", locale: this.model.locale,
            create: $.proxy(this._updateOnRender, this),
            timeFormat: this.model.timeFormat,
            select: function (e) {
                if (proxy.model.startDate && proxy.model.endDate) {
                    proxy._buttonDiv.find(".e-drp-apply").removeClass("e-disable");
                }
            }
        });
        this._rightTP = this._rightTime.ejTimePicker("instance");
        this._rightTP.popup.addClass("e-daterange-timepopup");
		this._on(this._leftTP.element, "keydown", this._onKeyDown);
        this._on(this._rightTP.element, "keydown", this._onKeyDown);
        //below code for position the timepicker and datepicker
        this._setTimePickerPos();
    };
    ejDateRangePicker.prototype._setTimePickerPos = function () {
        $("#" + this._id + "_lTime_timewidget").css({
            position: "absolute",
            top: 0,
            left: this._leftDP.popup.width() + this._leftDP.popup.position().left - this.popup.find($("#" + this._id + "_lTime_timewidget")).outerWidth()
        });
        $("#" + this._id + "_rTime_timewidget").css({
            position: "absolute",
            top: !this.popup.hasClass("e-daterange-responsive") ? 0 : this._rightDP.wrapper.position().top,
            left: this._rightDP.popup.width() + this._rightDP.popup.position().left - this.popup.find($("#" + this._id + "_rTime_timewidget")).outerWidth()
        });
        this.popup.find($(".e-left-datepicker .e-datewidget")).css({
            width: this._leftDP.popup.width() - this.popup.find($("#" + this._id + "_lTime_timewidget")).width() - 1
        });
        this.popup.find($(".e-right-datepicker .e-datewidget")).css({
            width: this._rightDP.popup.width() - this.popup.find($("#" + this._id + "_rTime_timewidget")).width() - 1
        });
    };
    ejDateRangePicker.prototype._updateInput = function (e) {
        if (!(this.model.startDate && this.model.endDate)) {
            if (this.model.value)
                this.element.val(this.model.value);
            if (this._popupOpen)
                this.popupHide();
            return;
        }
        this._resetValues();
        this.wrapper.removeClass("e-error");
        this._mainValue();
        this._refreshMinMax();
    };
    ejDateRangePicker.prototype._removeWatermark = function () {
        if (this.element.val() != "" && !this._isSupport)
            this._hiddenInput.css("display", "none");
    };
    ejDateRangePicker.prototype._mainValue = function () {
        var lefttime = "", righttime = "", startDt = this.model.startDate, endDt = this.model.endDate;
        var _startDateString = ej.format(startDt, this.model.dateFormat, this.model.locale);
        var _endDateString = ej.format(endDt, this.model.dateFormat, this.model.locale);

        if (this.model.enableTimePicker && this._leftTP && this._rightTP && this._leftTP.model.value && this._rightTP.model.value) {
            lefttime = this._leftTP.model.value;
            righttime = this._rightTP.model.value;
            _startDateString = ej.format(_startDateString + " " + lefttime, this._dateTimeFormat, this.model.locale);
            _endDateString = ej.format(_endDateString + " " + righttime, this._dateTimeFormat, this.model.locale);
            this.model.startDate = ej.parseDate(_startDateString, this._dateTimeFormat, this.model.locale);
            this.model.endDate = ej.parseDate(_endDateString, this._dateTimeFormat, this.model.locale);
        } else {
            this.model.startDate = ej.parseDate(_startDateString, this._leftDP.model.dateFormat, this.model.locale);
            this.model.endDate = ej.parseDate(_endDateString, this._rightDP.model.dateFormat, this.model.locale);
        }
        if (_startDateString != null && _endDateString != null) {
            this.model.value = _startDateString + " " + this.model.separator + " " + _endDateString;
            this.element.val(this.model.value);
            if (this._hiddenInput)
                this._hiddenInput.attr('value', this.model.value);
            this._removeWatermark();
            this._validState = true;
        } else {
            this.model.value = null;
            this._setWaterMark();
            this._validState = false;
        }
		this._prevValue = this.model.value;
        if (this._buttonDiv)
            this._buttonDiv.find(".e-drp-apply").addClass("e-disable");
        this._trigger("_change", { value: this.model.value });
    };
    ejDateRangePicker.prototype._bindDateButton = function () {
        this._on(this.dateRangeIcon, "click", this._showDatePopUp);
        if (!this.model.allowEdit) {
            this.element.attr("readonly", "readonly");
            this.element.on("mousedown", $.proxy(this._showDatePopUp, this));
            this.element.off("blur", $.proxy(this._onMainFocusOut, this));
        }
    };

    ejDateRangePicker.prototype._showDatePopUp = function (e) {
        if (!this.model.enabled)
            return false;
        var isRightClick = false;
        if (e.button)
            isRightClick = (e.button == 2);
        else if (e.which)
            isRightClick = (e.which == 3); //for Opera
        if (isRightClick)
            return;
        this._showhidePopup(e);
    };
    ejDateRangePicker.prototype._showhidePopup = function (e) {
        if (this._popupOpen) {
            if (!this._isFocused && this.element.is(':input') && (!ej.isTouchDevice())) {
                this.wrapper.addClass('e-focus');
            }
            this.popupHide(e);
        } else {
            if (!this._isFocused && this.element.is(':input') && (!ej.isTouchDevice())) {
                this.wrapper.addClass('e-focus');
            }
            this.popupShow(e);
        }
    };
    ejDateRangePicker.prototype.popupHide = function (e) {
        if (!this._popupOpen)
            return false;
        var proxy = this;
        this._trigger("beforeClose", { element: this.popup, events: e });
        this.popup.attr({ 'aria-hidden': 'true' });
        if (this._leftTP && !this._leftTP._popupOpen)
            this._leftTP.hide();
        if (this._rightTP && !this._rightTP._popupOpen)
            this._rightTP.hide();
        this.popup.css("visibility", "visible").slideUp(100, function () {
            proxy._popupOpen = false;
        });
		this._off(ej.getScrollableParents(this.wrapper), "scroll", $.proxy(this.popupHide, this));
        this._trigger("close", { element: this.popup, events: e });
    };

    ejDateRangePicker.prototype.popupShow = function (e) {
        if (!this.model.enabled)
            return false;
        if (this._popupOpen)
            return false;
        var proxy = this;
        this._trigger("beforeOpen", { element: this.popup, events: e });
        this.wrapper.addClass('e-focus');
        this.popup.attr({ 'aria-hidden': 'false' });
        proxy._popupOpen = true;
        this.popup.css("visibility", "visible").slideDown(100, function () {
        });
        this._resizePopup();
		this._on(ej.getScrollableParents(this.wrapper), "scroll", $.proxy(this.popupHide, this));
        this._trigger("open", { element: this.popup, events: e });
    };
    ejDateRangePicker.prototype._resizePopup = function () {
        var proxy = this, range_width = 0, ran_height = 0;
        var cal_width = proxy.datePopup.find(".e-popup.e-calendar").outerWidth();
        var cal_height = proxy.datePopup.find(".e-popup.e-calendar").height();
        if (this._customRangePicker && this._customRangePicker.height() <= 0)
            this._customRangePicker.height(this.datePopup.height());
        if (this.model.ranges && this.model.ranges.length > 0)
            var ran_height = this._customRangePicker.find("ul").height(), range_width = proxy._customRangePicker.outerWidth();
        if ($(window).width() - this.wrapper.position().left < ((cal_width * 2) + range_width) + 25) {
            proxy.popup.addClass("e-daterange-responsive");
            proxy._setOption("width", "95%");
            if (this.model.enableTimePicker) {
                this._setOption("width", "47%");
                this._setDatePickerPosition();
                $("#" + this._id + "_lTime_timewidget").css({
                    left: this._leftDP.wrapper.outerWidth() + 5
                });

                $("#" + this._id + "_rTime_timewidget").css({
                    left: this._rightDP.wrapper.outerWidth() + 5
                });
                if (proxy._scrollerObj) {
                    proxy._scrollerObj.model.height = ran_height < cal_height ? ran_height + 10 : cal_height;
                    proxy._scrollerObj.refresh();
                }
                return;
            }
        } else {
            proxy.popup.removeClass("e-daterange-responsive");
            if (this.model.enableTimePicker) {
                this._leftTP.option("width", "100px");
                this._rightTP.option("width", "100px");
                this._setTimePickerPos();
            }
            if (proxy._scrollerObj) {
                proxy._scrollerObj.model.height = this.datePopup.height();
                proxy._scrollerObj.refresh();
            }
        }
        this._setDatePickerPosition();
    };
    ejDateRangePicker.prototype._onDocumentClick = function (e) {
        if (this.model) {
            if (!$(e.target).is(this.popup) && !$(e.target).parents(".e-popup").is(this.popup) && !$(e.target).is(this.wrapper) && !$(e.target).parents(".e-daterangewidget").is(this.wrapper)) {
                if (this.model.enableTimePicker && !$(e.target).is(this._leftTP.popup) && !$(e.target).parents(".e-popup").is(this._leftTP.popup) && !$(e.target).is(this._rightTP.popup) && !$(e.target).parents(".e-popup").is(this._rightTP.popup)) {
                    if (this._popupOpen)
                        this.popupHide(e);
                    this.wrapper.removeClass('e-focus');
                }
                if (!this.model.enableTimePicker) {
                    if (this._popupOpen)
                        this.popupHide(e);
                    this.wrapper.removeClass('e-focus');
                }
            }
        }
    };
    ejDateRangePicker.prototype._getOffset = function (ele) {
        var pos = ele.offset() || { left: 0, top: 0 };
        if ($("body").css("position") != "static") {
            var bodyPos = $("body").offset();
            pos.left -= bodyPos.left;
            pos.top -= bodyPos.top;
        }
        return pos;
    };

    ejDateRangePicker.prototype._getZindexPartial = function (element, popupEle) {
        if (!ej.isNullOrUndefined(element) && element.length > 0) {
            var parents = element.parents(), bodyEle;
            bodyEle = $('body').children();
            if (!ej.isNullOrUndefined(element) && element.length > 0)
                bodyEle.splice(bodyEle.index(popupEle), 1);
            $(bodyEle).each(function (i, ele) {
                parents.push(ele);
            });

            var maxZ = Math.max.apply(maxZ, $.map(parents, function (e, n) {
                if ($(e).css('position') != 'static')
                    return parseInt($(e).css('z-index')) || 1;
            }));
            if (!maxZ || maxZ < 10000)
                maxZ = 10000;
            else
                maxZ += 1;
            return maxZ;
        }
    };

    ejDateRangePicker.prototype._setDatePickerPosition = function () {
        var elementObj = this.element.is('input') ? this.wrapper : this.element;
        var pos = this._getOffset(elementObj), winLeftWidth, winRightWidth, winBottomHeight = $(document).scrollTop() + $(window).height() - (pos.top + $(elementObj).outerHeight()), winTopHeight = pos.top - $(document).scrollTop(), popupHeight = this.popup.outerHeight(), popupWidth = this.popup.outerWidth(), left = pos.left, totalHeight = elementObj.outerHeight(), border = (totalHeight - elementObj.height()) / 2, maxZ = this._getZindexPartial(this.element, this.popup), popupmargin = 3, topPos = (popupHeight < winBottomHeight || popupHeight > winTopHeight) ? pos.top + totalHeight + popupmargin : pos.top - popupHeight - popupmargin;
        winLeftWidth = $(document).scrollLeft() + $(window).width() - left;
        if (popupWidth > winLeftWidth && (popupWidth < left + elementObj.outerWidth()))
            left -= this.popup.outerWidth() - elementObj.outerWidth();

        this.popup.css({
            "left": left + "px",
            "top": topPos + "px",
            "z-index": maxZ
        });

        if (this.model.enableTimePicker) {
            $("#" + this._id + "_lTime_timewidget").css({
                position: "absolute",
                top: 0,
                left: this._leftDP.popup.width() + this._leftDP.popup.position().left - $("#" + this._id + "_lTime_timewidget").width()
            });
            $("#" + this._id + "_rTime_timewidget").css({
                position: "absolute",
                top: !this.popup.hasClass("e-daterange-responsive") ? 0 : this._rightDP.wrapper.position().top,
                left: this._rightDP.popup.width() + this._rightDP.popup.position().left - $("#" + this._id + "_rTime_timewidget").width()
            });
        }
    };
    ejDateRangePicker.prototype._dateEleClicked = function (e) {
        this._activeItem = $(e.currentTarget);
        if (this._activeItem.hasClass("e-hidedate")) {
            e.stopPropagation();
            return;
        }
        if (this._activeItem.hasClass("other-month")) {
            this._refreshMinMax();
        }
        var dateString = this._activeItem.attr("date");
        var cal_type = ($(e.currentTarget).parents(".e-left-datepicker").length > 0) ? "left" : "right";
        if (ej.isNullOrUndefined(dateString) || dateString === "")
            return;
        var currentDate = new Date(dateString);
        if (this._selectedStartDate != null && this._selectedEndDate != null)
            this._selectedStartDate = null;
        if (this._selectedStartDate == null) {
            this._selectedStartDate = currentDate;
            this._selectedEndDate = null;
            if (this._startDate)
                this._startDate.date = null;
            this._rightDP.element.val(null);
            if (cal_type == "right") {
                this._leftDP._stopRefresh = true;
                this._leftDP.option("value", this._selectedStartDate);
                this._leftDP.element.val(this._selectedStartDate.toLocaleDateString());
            }
            if (this._rightTP)
                this._rightTP.option("value", "");
            this.popup.find(".in-range").removeClass("in-range");
            this.datePopup.find("td.e-state-default.e-active").removeClass("e-active");
            this._rightDP.element.parents(".e-datewidget").removeClass("e-error");
            var startElement = $(this.datePopup.find('.current-month[date="' + dateString + '"]'));
            this._selectedStartDate = new Date(startElement.attr("date"));
            this._setStartDate(this._selectedStartDate, startElement, true);
        } else if ((this._selectedStartDate !== null && this._selectedEndDate == null) && !(currentDate < this._selectedStartDate)) {
            var minDate = currentDate;
            var dateString = $(e.currentTarget).attr("date");
            this._rightDP._stopRefresh = true;
            this._rightDP.option("value", new Date(dateString));
            this._rightDP._stopRefresh = false;
            if (this._rightTP)
                this._rightTP.option("value", new Date(dateString));
            this._rightDP.element.parents(".e-datewidget").removeClass("e-error");
            var endElement = $(this.datePopup.find('.current-month[date="' + dateString + '"]'));
            this._selectedStartDate = this.model.startDate;
            this._selectedEndDate = new Date(dateString);
            this._setEndDate(this._selectedEndDate, endElement, true);
            this._startDate = {};
            this._startDate.date = this._selectedStartDate;
            this._updateRanges("left");
            this._updateRanges("right");
            if (cal_type == "left") {
                this._leftDP._stopRefresh = true;
                this._leftDP.option("value", this.model.startDate);
                this._leftDP.element.val(this.model.startDate.toLocaleDateString());
            }
        } else {
            this._selectedStartDate = currentDate;
            this._selectedEndDate = null;
            if (this._endDate)
                this._endDate.date = null;
            this.popup.find(".in-range").removeClass("in-range");
            this._rightDP.option("value", null);
            if (this._rightTP)
                this._rightTP.option("value", "");
            if (cal_type == "right") {
                this._leftDP._stopRefresh = true;
                this._leftDP.option("value", this._selectedStartDate);
                this._leftDP.element.val(this._selectedStartDate.toLocaleDateString());
            }
            this._setStartDate(this._selectedStartDate, this._activeItem, true);
            this._updateRanges("left");
            this._updateRanges("right");
        }
        this._trigger("click", { element: $(e.currentTarget), startDate: this.model.startDate, endDate: this.model.endDate, value: new Date($(e.currentTarget).attr("date")) });
    };
    ejDateRangePicker.prototype._setStartDate = function (value, current_element, newset) {
        this._startDate = {};
        this._startDate.date = value;
        if (newset) {
            this._endDate = {};
            this._endDate.date = null;
        }
        this._leftDP._checkDateArrows();
        this.datePopup.find("td.e-state-default").removeClass("e-select e-start-date e-active showrange e-end-date e-state-hover");
        this.popup.find(".in-range").removeClass("in-range");
        current_element.addClass("e-start-date");
        this.model.startDate = value;
        if (this._buttonDiv)
            this._buttonDiv.find(".e-drp-apply").addClass("e-disable");
        if (!this.model.enableTimePicker)
            return;
        var $this = this._leftTP;
        var _value = ej.format(this._leftTP.model.value || this._leftDP.model.value, $this.model.timeFormat, this.model.locale);
        if (_value)
            this._rightTP.option("minTime", _value);
        if (_value)
            this._leftTP.option("value", _value);
    };
    ejDateRangePicker.prototype._setEndDate = function (value, current_element, newset) {
        this._rightDP.element.parents(".e-datewidget").removeClass("e-val-error");
        this._endDate = {};
        this._endDate.date = value;
        this.popup.find("td.e-end-date").removeClass("e-select e-end-date");
        current_element.addClass("e-end-date");
        if (this._buttonDiv)
            this._buttonDiv.find(".e-disable").removeClass("e-disable");
        this.model.endDate = value;
        if (this._startDate.date.getFullYear() == this._endDate.date.getFullYear()) {
            if (this._startDate.date.getMonth() == this._endDate.date.getMonth()) {
                return;
            }
        }
        if (!this.model.enableTimePicker)
            return;
        if (this.model.startDate.getDate() == this.model.endDate.getDate()) {
            this._rightTP.option("minTime", this._leftTP.option("value") || "");
            this._rightTP.option("value", this._leftTP.option("value") || "");
        } else {
            var $this = this._rightTP;
            var _value = ej.format(this._rightTP.model.value, $this.model.timeFormat, this.model.locale);
            if (_value)
                this._rightTP.option("minTime", _value);
            if (_value)
                this._rightTP.option("value", _value);
        }
    };

    ejDateRangePicker.prototype._rangeRefresh = function (args) {
        var startElement, endElement;
        if (this._rightDP) {
            var popup = args.element.parent().hasClass("e-left-datepicker") ? this._leftDP.popup : this._rightDP.popup;
        }
        if (this._startDate && this._startDate.date && this._startDate.date.getMonth() == args.month && this._startDate.date.getFullYear() == args.year) {
            startElement = $(popup.find('.current-month[date="' + this._startDate.date.toDateString() + '"]'));
            this._setStartDate(this._startDate.date, startElement, false);
            if (this._startDate.date.getDate() + 1 == startElement.next("td").text())
                $(startElement).addClass("showrange");
        }
        if (this._endDate && this._endDate.date && this._endDate.date.getMonth() == args.month && this._endDate.date.getFullYear() == args.year) {
            endElement = $(popup.find('.current-month[date="' + this._endDate.date.toDateString() + '"]'));
            this._setEndDate(this._endDate.date, endElement, false);
        }
        if (startElement == endElement)
            $(startElement).removeClass("showrange");
        if (this._rightDP)
            if ((this._startDate && this._startDate.date) && (this._endDate && this._endDate.date)) {
                if (this._startDate.date.getFullYear() <= args.year && this._endDate.date.getFullYear() >= args.year) {
                    var s = args.element.parent().hasClass("e-left-datepicker") ? $(popup.find('td.current-month')[0]) : $(popup.find('td.current-month')[0]);
                    var type = args.element.parent().hasClass("e-left-datepicker") ? "left" : "right";
                    this._updateRanges(type);
                }
            }
    };
    ejDateRangePicker.prototype._renderRangesWrapper = function () {
        if (ej.isNullOrUndefined(this._customRangePicker)) {
            this._customRangePicker = ej.buildTag("div.e-custom-dateranges").css("height", this.datePopup.height());
            this.popup.append(this._customRangePicker);
            this._customRangePicker.insertBefore(this._buttonDiv);
            this._ranges_li = "<ul class='e-dateranges-ul'></ul>";
            this._customRangePicker.append(this._ranges_li);
        }
    };
    ejDateRangePicker.prototype.setRange = function (range) {
        var startDate, endDate, ranges;
        this._clearRanges();
        if (typeof range == "string") {
            for (var i = 0; i < this.model.ranges.length; i++) {
                ranges = this.model.ranges[i];
                if (ranges.label == range) {
                    this.model.startDate = ranges.range[0];
                    this.model.endDate = ranges.range[1];
                    this._updatePreRanges();
                    return;
                }
            }
        } else if (typeof range == "object") {
            if (range.length == 2) {
                this.model.startDate = range[0];
                this.model.endDate = range[1];
                this._updatePreRanges();
                return;
            }
        }
    };
    ejDateRangePicker.prototype._updatePreRanges = function () {
        this._selectedStartDate = this.model.startDate;
        this._selectedEndDate = this.model.endDate;
        this._resetValues();
        this._setValues();
        this._refreshMinMax();
        if (!this._popupOpen)
            this._mainValue();
        this._setWaterMark();
    };
    ejDateRangePicker.prototype.destroy = function () {
        this.destroy();
    };
    ejDateRangePicker.prototype._destroy = function () {
        if (this._popupOpen)
            this._showhidePopup();
        if (this.wrapper) {
            this.element.removeClass("e-input");
            this.element.insertAfter(this.wrapper);
            this.wrapper.remove();
        }
        if (!ej.isNullOrUndefined(this._leftDP))
            this._leftDP.destroy();
        if (!ej.isNullOrUndefined(this._rightDP))
            this._rightDP.destroy();
        if (!ej.isNullOrUndefined(this._rightTP))
            this._rightTP.destroy();
        if (!ej.isNullOrUndefined(this._leftTP))
            this._leftTP.destroy();
        if (!ej.isNullOrUndefined(this._scrollerObj))
            this._scrollerObj.destroy();
        this.popup.remove();
    };
    ejDateRangePicker.prototype.addRanges = function (args) {
        var proxy = this, _ranges_li = "", title;
        if (args) {
            for (var i = 0; i < args.length; i++) {
                var s = args[i];
                var value = s.range;
                if (value.length === 2) {
                    var start = new Date(value[0]);
                    var end = new Date(value[1]);
                    if (ej.isNullOrUndefined(start))
                        start = new Date(value[0]);
                    if (ej.isNullOrUndefined(end))
                        end = new Date(value[1]);
                    if (start <= end) {
                        if (!s.label)
                            s.label = "PreDefined Ranges";
                        _ranges_li += "<li aria-selected='false' title='" + s.label + "'class='rangeItem' e-date-range='" + JSON.stringify(value) + "' e-data-value='" + s.range + "'>" + s.label + "</li>";
                    }
                }
            }
        }
        this._renderRangesWrapper();
        this._customRangePicker.find(".e-dateranges-ul").append(_ranges_li);
        this._off(this._customRangePicker.find("ul li.rangeItem"), "click", this._customSelection);
        this._on(this._customRangePicker.find("ul li.rangeItem"), "click", this._customSelection);
        if (this._scrollerObj)
            this._scrollerObj.refresh();
    };
    ejDateRangePicker.prototype._righthoverRange = function (e) {
        this._activeItem = $(e.currentTarget);
        if (this._activeItem.hasClass("e-hidedate")) {
            e.stopPropagation();

            return;
        }
        this.popup.find(".range-hover").removeClass("range-hover");
        if (this._activeItem.hasClass("in-range"))
            this._activeItem.addClass("range-hover");
        var dateString = this._activeItem.attr("date");
        var currentDate = new Date(dateString);
        this._trigger("hover", { element: e.currentTarget, events: e, value: new Date(this._activeItem.attr("date")) });

        var that = this;
        if (!ej.isNullOrUndefined(that._selectedStartDate) && (ej.isNullOrUndefined(that._selectedEndDate)))
            this.popup.find(".current-month").each(function (index, el) {
                var element = $(el);
                var dateString = element.attr("date");
                if (ej.isNullOrUndefined(dateString) || dateString === "")
                    return;
                var date = new Date(dateString);
                if (date > that._startDate.date && date < currentDate) {
                    element.addClass("in-range");
                } else {
                    element.removeClass("in-range");
                }
                if (date.getTime() === that._selectedStartDate.getTime() && element.next().length !== 0 && element.next("td.current-month").length !== 0 && currentDate > that._selectedStartDate && new Date(new Date(that._selectedStartDate.getTime()).setDate(that._selectedStartDate.getDate() + 1)).getTime() !== currentDate.getTime()) {
                    element.addClass("showrange");
                } else {
                    element.removeClass("showrange");
                }
            });
    };
    ejDateRangePicker.prototype._customSelection = function (e) {
        this._customRangePicker.find(".e-active").removeClass("e-active");
        if ($(e.currentTarget).attr("e-date-range") != "customPicker") {
            var range = $(e.currentTarget).attr("e-data-value").split(",");
            this.model.startDate = new Date(range[0]);
            this.model.endDate = new Date(range[1]);
            this._rightDP.element.parents(".e-datewidget").removeClass("e-error");
            this._customSet();
        } else {
            this.model.startDate = null;
            this.model.endDate = null;
            this._clearRanges();
        }
        $(e.currentTarget).addClass("e-active");
    };
    ejDateRangePicker.prototype._setWaterMark = function () {
        if (this.element != null && this.element.hasClass("e-input")) {
            if ((!this._isSupport) && this.element.val() == "")
                this._hiddenInput.css("display", "block").val(this._localizedLabels.watermarkText);
            else
                $(this.element).attr("placeholder", this._localizedLabels.watermarkText);
            return true;
        }
    };
    ejDateRangePicker.prototype._clearRanges = function (e) {
        this._setOption("value", "");
        this._rightDP.element.parents(".e-datewidget").removeClass("e-val-error");
        this._selectedStartDate = null;
        this._selectedEndDate = null;
        if (this._startDate)
            this._startDate.date = null;
        if (this._endDate)
            this._endDate.date = null;
        this.popup.find("td").removeClass("e-start-date e-end-date in-range e-active e-state-hover today");
        this.model.value = null;
        this.model.startDate = null;
        this.model.endDate = null;
        if (this._buttonDiv)
            this._buttonDiv.find(".e-drp-apply").addClass("e-disable");
    };
    ejDateRangePicker.prototype.clearRanges = function () {
        this._clearRanges();
        this._refreshMinMax();
        this.element.val("");
        this._trigger("clear", {});
    };
    ejDateRangePicker.prototype._getLocalizedLabels = function () {
        return ej.getLocalizedConstants("ej.DateRangePicker", this.model.locale);
    };
    ejDateRangePicker.prototype._unWireEvents = function () {
        this._off($('.e-next', this.popup), "click", $.proxy(this._previousNextHandler, this));
        this._off($('.e-prev', this.popup), "click", $.proxy(this._previousNextHandler, this));
        this._off($(this._buttonDiv.find("div.e-drp-cancel")), "click", this._cancelButton);
        this._off($(this._buttonDiv.find("div.e-drp-reset")), "click", this.clearRanges);
        this._off(this.popup.find(".leftDate_wrapper.e-datepicker.e-js.e-input"), "blur", this._onPopupFocusOut);
        this._off(this.popup.find(".rightDate_wrapper.e-datepicker.e-js.e-input"), "blur", this._onPopupFocusOut);
        if (this.model.allowEdit) {
            this._off(this.element, "blur", this._onMainFocusOut);
            this._off(this.element, "focus", this._onFocusIn);
            this._off(this.element, "keydown", this._onKeyDown);
        }
    };
    ejDateRangePicker.prototype._onDocumentKeyDown = function (e) {
        if (e.keyCode != "13")
            return;
        if (!this._buttonDiv.find(".e-drp-apply").hasClass("e-disable") && this.wrapper.hasClass("e-focus")) {
            this._buttonDiv.find(".e-drp-apply").click();
        }
    };
    ejDateRangePicker.prototype._wireEvents = function () {
        this._on($('.e-next', this.popup), "click", $.proxy(this._previousNextHandler, this));
        this._on($('.e-prev', this.popup), "click", $.proxy(this._previousNextHandler, this));
        this._on($(this._leftDP.sfCalendar.find('table .e-datepicker-months td')), "click", $.proxy(this._previousNextHandler, this));

        var $this = this;
        this._on($(this._buttonDiv.find("div.e-drp-reset")), "click", this.clearRanges);
        this._on($(this._buttonDiv.find("div.e-drp-apply")), "click", function (e) {
            if ($this._buttonDiv.find(".e-drp-apply").hasClass("e-disable")) {
                return;
            }
            $this._updateInput();
            $this._showhidePopup();
            $this._buttonDiv.find(".e-drp-apply").addClass("e-disable");
            this._trigger("select", { startDate: this.model.startDate, endDate: this.model.endDate, value: this.model.value });
        });
        this._on($(window), "resize", this._resizePopup);
        $(document).on("mousedown", $.proxy(this._onDocumentClick, this));
        $(document).on("keydown", $.proxy(this._onDocumentKeyDown, this));

        this._on($(this._buttonDiv.find("div.e-drp-cancel")), "click", this._cancelButton);
        this._on(this.popup.find(".leftDate_wrapper.e-datepicker.e-js.e-input"), "blur", this._onPopupFocusOut);
        this._on(this.popup.find(".rightDate_wrapper.e-datepicker.e-js.e-input"), "blur", this._onPopupFocusOut);
        this._on(this.popup.find(".leftDate_wrapper.e-timepicker.e-js.e-input"), "blur", this._onPopupFocusOut);
        this._on(this.popup.find(".rightDate_wrapper.e-timepicker.e-js.e-input"), "blur", this._onPopupFocusOut);

        if (this.model.allowEdit) {
            this._on(this.element, "blur", this._onMainFocusOut);
            this._on(this.element, "focus", this._onFocusIn);
            this._on(this.element, "keydown", this._onKeyDown);
        }
        this._on(this._leftDP.element, "keydown", this._onKeyDown);
        this._on(this._rightDP.element, "keydown", this._onKeyDown);
        
    };
    ejDateRangePicker.prototype._onFocusIn = function (e) {
        if (this._isSupport) {
            e.preventDefault();
            this._isFocused = true;
        }
        if (this.wrapper.hasClass("e-error")) {
            this._validState = false;
            this.wrapper.removeClass('e-error');
        }
        this.wrapper.addClass("e-focus");
    };

    ejDateRangePicker.prototype._onKeyDown = function (e) {
        if (e.keyCode == 13) {
            if ($(e.currentTarget).hasClass("e-datepicker")) {
                this._validateValues($(e.currentTarget).val(), $(e.currentTarget).parents(".e-left-datepicker").length > 0 ? "left" : "right");
                $(e.currentTarget).parents(".e-left-datepicker").length > 0 ? this._leftDP.model.value = this.model.startDate : this._rightDP.model.value = this.model.endDate;
                this._onPopupFocusOut(e);
            } else {
                $(e.currentTarget).hasClass("leftTime") ? this._leftTP._trigger("select") : this._rightTP._trigger("select");
            }
        }
        e.stopImmediatePropagation();
    };
    ejDateRangePicker.prototype._cancelButton = function () {
        this._prevValue = null;
        this._clearRanges();
        this._onMainFocusOut();
        this._showhidePopup();
    };
    ejDateRangePicker.prototype._updateRanges = function (cal_type) {
        var cal = cal_type == "left" ? this._leftDP : this._rightDP;
        var proxy = this;
        cal.popup.find("td.current-month").each(function (index, el) {
            var element = $(el);
            var dateString = element.attr("date");
            if (ej.isNullOrUndefined(dateString) || dateString === "")
                return;
            var date = new Date(dateString);
            if (!ej.isNullOrUndefined(proxy._startDate) && !ej.isNullOrUndefined(proxy._startDate.date) && !ej.isNullOrUndefined(proxy._endDate.date))
                if (date > proxy._startDate.date && date < proxy._endDate.date) {
                    element.addClass("in-range");
                } else {
                    element.removeClass("in-range");
                }
            if (!ej.isNullOrUndefined(proxy._startDate) && !ej.isNullOrUndefined(proxy._startDate.date) && date.toDateString() == proxy._startDate.date.toDateString()) {
                element.addClass("e-start-date");
                if (!ej.isNullOrUndefined(proxy._endDate) && !ej.isNullOrUndefined(proxy._endDate.date) && proxy._startDate.date.toDateString() != proxy._endDate.date.toDateString())
                    element.addClass("showrange");
                element.removeClass("in-range");
            }
            if (!ej.isNullOrUndefined(proxy._endDate) && !ej.isNullOrUndefined(proxy._endDate.date))
                if (!ej.isNullOrUndefined(proxy._endDate) && date.toDateString() == proxy._endDate.date.toDateString()) {
                    element.addClass("e-end-date");
                    element.removeClass("in-range");
                }
        });
        if (cal.popup.find(".e-start-date").length > 0) {
            if ($(cal.popup.find(".e-start-date")).next("td.in-range").length > 0)
                return;
            else
                $(cal.popup.find(".e-start-date")).removeClass("showrange");
        }
    };

    ejDateRangePicker.prototype.getSelectedRange = function () {
        var args = { startDate: this.model.startDate, endDate: this.model.endDate };
        return args;
    };
    ejDateRangePicker.prototype.enable = function () {
        this.element[0].disabled = false;
        this.model.enabled = true;
        this.element.removeClass("e-disable");
        this.element.attr("aria-enabled", "false");
        this.element.attr("enabled", "enabled");
        if (!this._isSupport)
            this._hiddenInput.attr("enabled", "enabled");
        if (this.dateRangeIcon)
            this.dateRangeIcon.removeClass("e-disable").attr("aria-disabled", "false");
        this.popup.children("div").removeClass("e-disable").attr("aria-disabled", "false");
        this._setOption("enabled", true);
    };
    ejDateRangePicker.prototype.disable = function () {
        this.element[0].disabled = true;
        this.model.enabled = false;
        this.element.addClass("e-disable");
        this.element.attr("aria-disabled", "true");
        this.element.attr("disabled", "disabled");
        if (!this._isSupport)
            this._hiddenInput.attr("disabled", "disabled");
        if (this.dateRangeIcon)
            this.dateRangeIcon.addClass("e-disable").attr("aria-disabled", "true");
        this.popup.children("div").addClass("e-disable").attr("aria-disabled", "true");
        this.popupHide();
        this._setOption("enabled", false);
    };

    ejDateRangePicker.prototype._onMainFocusOut = function (e) {
        var element_value = this.element.val(), setError;
        this.wrapper.removeClass('e-focus');
        if (this.element.val() == "" && this._prevValue == null)
            return;
        if (this._prevValue && this._prevValue == this.element.val()) {
            this._validState ? this.wrapper.removeClass('e-error').removeClass("e-focus") : this.wrapper.addClass('e-error').removeClass("e-focus");
            return;
        }
        if (this.element.val() == "") {
            this.wrapper.removeClass('e-error');
            this._clearRanges();
            this._setWaterMark();
            this._refreshMinMax();
			this._trigger("_change", { value: this.model.value});
            return;
        }
        this.wrapper.removeClass("e-error");
        var datestring = this.element.val().split(this.model.separator), _startdate = ej.parseDate(datestring[0], this._dateTimeFormat, this.model.locale), _enddate = ej.parseDate(datestring[1], this._dateTimeFormat, this.model.locale);
        this._resetValues();
        this._validState = true;
        if (!this._validateValues(_startdate, "left") || !this._validateValues(_enddate, "right")) {
            this._clearRanges();
            this._refreshMinMax();
            setError = true;
        }
        if (!this._startEndValidation()) {
            this._clearRanges();
            this._refreshMinMax();
            setError = true;
        }
        if (element_value != "" && setError) {
            this.element.val(element_value);
            this.wrapper.addClass("e-error");
            this.model.value = null;
            this._validState = false;
			this._trigger("_change", { value:this.element.val()});
            return;
        }
        this._resetValues();
        this._setValues();
        this._refreshMinMax();
        this.model.value = this._validState && element_value != "" ? element_value : null;
        if (!this._popupOpen)
            this._mainValue();
        this._prevValue = this.model.value;
        this._validState ? this.wrapper.removeClass('e-error').removeClass("e-focus") : this.wrapper.addClass('e-error').removeClass("e-focus");
        this._trigger("onChange", { value: this.model.value, startDate: this.model.startDate, endDate: this.model.endDate });
    };
    ejDateRangePicker.prototype._onPopupFocusOut = function (e) {
        var picker = $(e.currentTarget).parents(".e-left-datepicker").length > 0 ? this._leftDP : this._rightDP;
        this._validateValues($(e.currentTarget).val(), $(e.currentTarget).parents(".e-left-datepicker").length > 0 ? "left" : "right");
        $(e.currentTarget).parents(".e-left-datepicker").length > 0 ? this._leftDP.model.value = this.model.startDate : this._rightDP.model.value = this.model.endDate;
        var _prevStartValue = this.model.startDate;
        var _prevEndValue = this.model.endDate, stop = false;
        this._rightDP.element.parents(".e-datewidget").removeClass("e-val-error");
        if (!this._startEndValidation()) {
            if ($(e.currentTarget).parents(".e-left-datepicker").length > 0) {
                this._clearRanges();
                this.model.startDate = _prevStartValue;
                this._selectedStartDate = this.model.startDate;
            } else {
                this._rightDP.element.parents(".e-datewidget").addClass("e-val-error");
                this.model.endDate = null;
                stop = true;
            }
        }
        if (_prevStartValue == null) {
            this._clearRanges();
            return;
        }
        this._selectedStartDate = this.model.startDate;
        this._selectedEndDate = this.model.endDate;
        this._resetValues();
        this._setValues();
        this._refreshMinMax();
        if (!this._popupOpen)
            this._mainValue();
        if (stop)
            this._rightDP.element.val(_prevEndValue.toLocaleDateString());
        this._setWaterMark();
    };
    ejDateRangePicker.prototype._resetValues = function () {
        this._leftDP.option("maxDate", null);
        this._rightDP.option("minDate", null);
        this._leftDP.option("value", this._leftDP.model.value);
        this._rightDP.option("value", this._rightDP.model.value);
    };
    ejDateRangePicker.prototype._refreshMinMax = function () {
        var local = this._getNextMonth(this._leftDP._calendarDate);
        if (local.toDateString() > this._rightDP._calendarDate.toDateString()) {
            var temp = this._rightDP.model.value;
            this._rightDP._calendarDate = local;
            this._rightDP._dateValue = local;
            this._rightDP.option("value", local);
        }
        this._rightDP.option("minDate", local);
        this._rightDP.option("value", temp);
        var temp = this._rightDP._calendarDate, y = temp.getFullYear(), m = temp.getMonth();
        this._leftDP.option("maxDate", new Date(y, m, 0));
    };
    ejDateRangePicker.prototype._refreshEvents = function (cal_type) {
        this._off(this._rightDP.sfCalendar.find('table .e-datepicker-days td.e-state-default'), "click", this._dateEleClicked);
        this._off(this._leftDP.sfCalendar.find('table .e-datepicker-days td.e-state-default'), "click", this._dateEleClicked);
        this._off(this._rightDP.sfCalendar.find('table .e-datepicker-days td.e-state-default'), "mouseover", this._righthoverRange);
        this._off(this._leftDP.sfCalendar.find('table .e-datepicker-days td.e-state-default'), "mouseover", this._righthoverRange);
        this._on(this._leftDP.sfCalendar.find('table .e-datepicker-days td.e-state-default'), "mouseover", this._righthoverRange);
        this._on(this._leftDP.sfCalendar.find('table .e-datepicker-days td.e-state-default'), "click", this._dateEleClicked);
        this._on(this._rightDP.sfCalendar.find('table .e-datepicker-days td.e-state-default'), "mouseover", this._righthoverRange);
        this._on(this._rightDP.sfCalendar.find('table .e-datepicker-days td.e-state-default'), "click", this._dateEleClicked);
        this._on($(this._leftDP.sfCalendar.find('table .e-datepicker-months td')), "click", $.proxy(this._previousNextHandler, this));
    };
    ejDateRangePicker.prototype._previousNextHandler = function (e) {
        var selectedCalender = $(e.currentTarget).closest(".e-calendar").parent();
        var cal_type = selectedCalender.hasClass("e-left-datepicker") ? "left" : "right", leftDateString, rightDateString;
        if (e.type == "_month_Loaded") {
            if (cal_type == "left") {
                rightDateString = $(this._rightDP.popup.find("td.current-month")[0]).attr("date");
                leftDateString = this._leftDP._dateValue.toDateString();
            } else if (cal_type == "right") {
                leftDateString = $(this._leftDP.popup.find("td.current-month")[0]).attr("date");
                rightDateString = this._rightDP._dateValue.toDateString();
            }
        } else {
            rightDateString = $(this._rightDP.popup.find("td.current-month")[0]).attr("date");
            leftDateString = $(this._leftDP.popup.find("td.current-month")[0]).attr("date");
        }
        var leftDate = new Date(leftDateString);
        var rightDate = new Date(rightDateString);
        leftDate.setHours(0, 0, 0, 0);
        rightDate.setHours(0, 0, 0, 0);
        var status = true;
        if (cal_type == "right") {
            var cls = $("table", this._leftDP.sfCalendar).get(0).className;
            if (cls == "e-dp-viewdays")
                this._leftDP._stopRefresh = true;
            this._rightDP._stopRefresh = false;
            var temp = rightDate, y = temp.getFullYear(), m = temp.getMonth();
            this._leftDP.option("maxDate", new Date(y, m, 0));
            if (cls == "e-dp-viewmonths")
                this._leftDP._startLevel("year");
            this._leftDP._checkDateArrows();
        } else {
            var cls = $("table", this._rightDP.sfCalendar).get(0).className;
            if ($("table", this._rightDP.sfCalendar).get(0).className == "e-dp-viewdays")
                this._rightDP._stopRefresh = true;
            this._leftDP._stopRefresh = false;
            this._rightDP.option("minDate", this._getNextMonth(leftDate));
            if (cls == "e-dp-viewmonths")
                this._rightDP._startLevel("year");
            this._rightDP._checkDateArrows();
        }

        this._rightDP.element.parents(".e-datewidget").removeClass("e-error");
    };
    return ejDateRangePicker;
})(ej.WidgetBase);
window.ej.widget("ejDateRangePicker", "ej.DateRangePicker", new ejDateRangePicker());
window["ejDateRangePicker"] = null;

ej.DateRangePicker.Locale = {};

ej.DateRangePicker.Locale = ej.DateRangePicker.Locale || {};

ej.DateRangePicker.Locale['default'] = ej.DateRangePicker.Locale['en-US'] = {
    ButtonText: {
        apply: "Apply",
        cancel: "Cancel",
        reset: "Reset"
    },
    watermarkText: "Select Range",
    customPicker: "Custom Picker"
};
//# sourceMappingURL=ej.daterangepicker.js.map
;

});