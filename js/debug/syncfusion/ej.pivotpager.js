/*!
*  filename: ej.pivotpager.js
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
	
/**
* @fileOverview Plugin to style the Html Pivot Pager elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {

    ej.widget("ejPivotPager", "ej.PivotPager", {

        _rootCSS: "e-pivotpager",
        element: null,
        model: null,

        _getModel: function () {
            return this.model;
        },

        _setModel: function (value) {
            this.model = value;
        },

        defaults: {
            targetControlID: "",
            categoricalCurrentPage: 1,
            seriesCurrentPage: 1,
            seriesPageCount: 0,
            categoricalPageCount: 0,
            locale: "en-US",
            mode: "both"
        },

        _init: function () {
            if ($("#" + this.model.targetControlID).hasClass('e-pivotgrid')) {
                this.targetControlName = "PivotGrid";
                this.targetControl = $("#" + this.model.targetControlID).data("ejPivotGrid");
                this.targetControl._pagerObj = this;
            }
            this._load();
            this._unwireEvents();
            this._wireEvents();
        },

        _destroy: function () {
            this.element.empty().removeClass("e-pivotpager");
        },

        _wireEvents: function () {
            this._on(this.element, "keydown", ".pagerTextBox", this._pagerTextBoxClick);
            this._on(this.element, "click", ".moveNext", this._moveNextPage);
            this._on(this.element, "click", ".moveLast", this._moveLastPage);
            this._on(this.element, "click", ".moveFirst", this._moveFirstPage);
            this._on(this.element, "blur", ".pagerTextBox", this._restorePageNo);
            this._on(this.element, "click", ".movePrevious", this._movePreviousPage);
        },

        _unwireEvents: function () {
            this._off(this.element, "click", ".moveNext", this._moveNextPage);
            this._off(this.element, "blur", ".pagerTextBox", this._restorePageNo);
            this._off(this.element, "click", ".moveLast", this._moveLastPage);
            this._off(this.element, "click", ".moveFirst", this._moveFirstPage);
            this._off(this.element, "click", ".movePrevious", this._movePreviousPage);
            this._off(this.element, "keydown", ".pagerTextBox", this._pagerTextBoxClick);
        },

        _getLocalizedLabels: function (property) {
            return ej.PivotPager.Locale[this.model.locale][property] === undefined ? ej.PivotPager.Locale["en-US"][property] : ej.PivotPager.Locale[this.model.locale][property];
        },

        _load: function () {
            $(this.element).addClass("pivotPager").attr("targetControlID", this.model.targetControlID);
            var pagerContent = "";
            if (this.targetControl.model.enableRTL) {
                this.element.addClass("e-rtl");
            }
            if (this.model.mode != "series") {
                var categoricalPager = ej.buildTag("td.categPagerTd", "");
                $(categoricalPager).html(ej.buildTag("div.pagerDiv", ej.buildTag("span.moveFirst e-icon").attr("role", "button").attr("aria-label", "move first")[0].outerHTML + ej.buildTag("span.movePrevious e-icon").attr("role", "button").attr("aria-label", "move previous")[0].outerHTML + ej.buildTag("span.pagerLabel", this._getLocalizedLabels("CategoricalPage"))[0].outerHTML + ej.buildTag("input#" + this._id + "_CategCurrentPage.pagerTextBox")[0].outerHTML + ej.buildTag("span.categPageCount")[0].outerHTML + ej.buildTag("span.moveNext e-icon").attr("role", "button").attr("aria-label", "move next")[0].outerHTML + ej.buildTag("span.moveLast e-icon").attr("role", "button").attr("aria-label", "move last")[0].outerHTML));
                pagerContent = categoricalPager[0].outerHTML;
            }
            if (this.model.mode != "categorical") {
                var seriesPager = ej.buildTag("td.seriesPagerTd", "");
                $(seriesPager).html(ej.buildTag("div.pagerDiv", ej.buildTag("span.moveFirst e-icon").attr("role", "button").attr("aria-label", "move first")[0].outerHTML + ej.buildTag("span.movePrevious e-icon").attr("role", "button").attr("aria-label", "move previous")[0].outerHTML + ej.buildTag("span.pagerLabel", this._getLocalizedLabels("SeriesPage"))[0].outerHTML + ej.buildTag("input#" + this._id + "_SeriesCurrentPage.pagerTextBox")[0].outerHTML + ej.buildTag("span.seriesPageCount")[0].outerHTML + ej.buildTag("span.moveNext e-icon").attr("role", "button").attr("aria-label", "move next")[0].outerHTML + ej.buildTag("span.moveLast e-icon").attr("role", "button").attr("aria-label", "move last")[0].outerHTML));
                pagerContent += seriesPager[0].outerHTML;
            }
            var pagerTable = ej.buildTag("table", ej.buildTag("tbody", ej.buildTag("tr", pagerContent)))[0];
            $(this.element).html(pagerTable);
        },

        initPagerProperties: function (headerCounts, pageSettings) {
            this.model.categoricalPageCount = Math.ceil(headerCounts.Column / pageSettings.CategorialPageSize);
            this.model.seriesPageCount = Math.ceil(headerCounts.Row / pageSettings.SeriesPageSize);
            this.model.categoricalCurrentPage = pageSettings.CategorialCurrentPage;
            this.model.seriesCurrentPage = pageSettings.SeriesCurrentPage;
            this._initPagerControl();
        },

        _initPagerControl: function (e) {
            if (this.model.mode != "series") {
                $(this.element.find(".categPageCount")[0]).html("/ " + this.model.categoricalPageCount);
                $("#" + this._id + "_CategCurrentPage")[0].value = this.model.categoricalCurrentPage;
                this._setNavigators(this.model.categoricalCurrentPage, this.model.categoricalPageCount, this.element.find(".categPagerTd")[0]);
            }
            if (this.model.mode != "categorical") {
                $(this.element.find(".seriesPageCount")[0]).html("/ " + this.model.seriesPageCount);
                $("#" + this._id + "_SeriesCurrentPage")[0].value = this.model.seriesCurrentPage;
                this._setNavigators(this.model.seriesCurrentPage, this.model.seriesPageCount, this.element.find(".seriesPagerTd")[0]);
            }
        },
		
        _moveNextPage: function (e) {
            if (!$(e.target).hasClass("disabled")) {
                var pagerInput = $($(e.target).parents('td')[0]).find(".pagerTextBox")[0];
                $($($(e.target).parents('td')[0]).find(".movePrevious")[0]).removeClass("disabled");
                $($($(e.target).parents('td')[0]).find(".moveFirst")[0]).removeClass("disabled");
                pagerInput.value = parseInt(pagerInput.value) + 1;
                if (pagerInput.id.indexOf("Categ") != -1) {
                    this.model.categoricalCurrentPage = pagerInput.value;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("categorical", pagerInput.value);
                    if (pagerInput.value == this.model.categoricalPageCount) {
                        $(e.target).addClass("disabled");
                        $($($(e.target).parents('td')[0]).find(".moveLast")[0]).addClass("disabled");
                    }
                }
                else if (pagerInput.id.indexOf("Series") != -1) {
                    this.model.seriesCurrentPage = pagerInput.value;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("series", pagerInput.value);
                    if (pagerInput.value == this.model.seriesPageCount) {
                        $(e.target).addClass("disabled");
                        $($($(e.target).parents('td')[0]).find(".moveLast")[0]).addClass("disabled");
                    }
                }
            }
        },

        _movePreviousPage: function (e) {
            if (!$(e.target).hasClass("disabled")) {
                var pagerInput = $($(e.target).parents('td')[0]).find(".pagerTextBox")[0];
                $($($(e.target).parents('td')[0]).find(".moveNext")[0]).removeClass("disabled");
                $($($(e.target).parents('td')[0]).find(".moveLast")[0]).removeClass("disabled");
                pagerInput.value = parseInt(pagerInput.value) - 1;
                if (pagerInput.id.indexOf("Categ") != -1) {
                    this.model.categoricalCurrentPage = pagerInput.value;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("categorical", pagerInput.value);
                    if (pagerInput.value == "1") {
                        $(e.target).addClass("disabled");
                        $($($(e.target).parents('td')[0]).find(".moveFirst")[0]).addClass("disabled");
                    }
                }
                else if (pagerInput.id.indexOf("Series") != -1) {
                    this.model.seriesCurrentPage = pagerInput.value;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("series", pagerInput.value);
                    if (pagerInput.value == "1") {
                        $(e.target).addClass("disabled");
                        $($($(e.target).parents('td')[0]).find(".moveFirst")[0]).addClass("disabled");
                    }
                }
            }
        },

        _moveLastPage: function (e) {
            if (!$(e.target).hasClass("disabled")) {
                var pagerInput = $($(e.target).parents('td')[0]).find(".pagerTextBox")[0];
                $($($(e.target).parents('td')[0]).find(".movePrevious")[0]).removeClass("disabled");
                $($($(e.target).parents('td')[0]).find(".moveFirst")[0]).removeClass("disabled");
                $(e.target).addClass("disabled");
                $($($(e.target).parents('td')[0]).find(".moveNext")[0]).addClass("disabled");
                if (pagerInput.id.indexOf("Categ") != -1) {
                    this.model.categoricalCurrentPage = pagerInput.value = this.model.categoricalPageCount;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("categorical", pagerInput.value);
                }
                else if (pagerInput.id.indexOf("Series") != -1) {
                    this.model.seriesCurrentPage = pagerInput.value = this.model.seriesPageCount;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("series", pagerInput.value);
                }
            }
        },

        _moveFirstPage: function (e) {
            if (!$(e.target).hasClass("disabled")) {
                var pagerInput = $($(e.target).parents('td')[0]).find(".pagerTextBox")[0];
                $($($(e.target).parents('td')[0]).find(".moveNext")[0]).removeClass("disabled");
                $($($(e.target).parents('td')[0]).find(".moveLast")[0]).removeClass("disabled");
                $(e.target).addClass("disabled");
                $($($(e.target).parents('td')[0]).find(".movePrevious")[0]).addClass("disabled");
                if (pagerInput.id.indexOf("Categ") != -1) {
                    this.model.categoricalCurrentPage = pagerInput.value = 1;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("categorical", pagerInput.value);
                }
                else if (pagerInput.id.indexOf("Series") != -1) {
                    this.model.seriesCurrentPage = pagerInput.value = 1;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("series", pagerInput.value);
                }
            }
        },
        _createErrorDialog: function (message) {
            var dialogElem = ej.buildTag("div.errorDialog#errorDialog", ej.buildTag("div.errorImg")[0].outerHTML + ej.buildTag("div.errorContent", message)[0].outerHTML + ej.buildTag("div", ej.buildTag("button#errOKBtn.errOKBtn", this._getLocalizedLabels("OK"))[0].outerHTML)[0].outerHTML).attr("title", this._getLocalizedLabels("Error"))[0].outerHTML;
            this.targetControl.element.append(dialogElem), me = this.targetControl;
            this.targetControl.element.find(".errorDialog").ejDialog({ width: 400, target: "#" + this.model.targetControlID, enableResize: false, enableRTL: this.targetControl.model.enableRTL, close: this.targetControl._onPreventPanelClose });
            this.targetControl.element.find(".errOKBtn").ejButton({ type: ej.ButtonType.Button }).bind(ej.eventType.click, function (e) {
                e.preventDefault();
                me.element.find(".e-dialog, .errorDialog").remove();
                me._onPreventPanelClose();
            });
            this.element.find(".e-dialog .e-close").attr("title", this._getLocalizedLabels("Close"));
        },
        _pagerTextBoxClick: function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var pagerTd = $(e.target).parents('td')[0];
                var pageCount = pagerTd.className.indexOf('categ') != -1 ? this.model.categoricalPageCount : this.model.seriesPageCount;
                if (parseInt(e.target.value) > pageCount || parseInt(e.target.value) < 1 || e.target.value == "") {
                    this._restorePageNo(e);
                    this._createErrorDialog(this._getLocalizedLabels("PageCountErrorMsg"));
                }
                else {
                    if (pagerTd.className.indexOf('categ') != -1 && this.model.categoricalCurrentPage != parseInt(e.target.value)) {
                        this.model.categoricalCurrentPage = e.target.value;
                        if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid(pagerTd.className, e.target.value);
                    }
                    else if (pagerTd.className.indexOf('series') != -1 && this.model.seriesCurrentPage != parseInt(e.target.value)) {
                        this.model.seriesCurrentPage = e.target.value;
                        if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid(pagerTd.className, e.target.value);
                    }
                    this._setNavigators(e.target.value, pageCount, pagerTd);
                    e.target.blur();
                }
            }
            else {
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 || (e.keyCode == 65 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 39)) return;
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) e.preventDefault();
            }
        },

        _restorePageNo: function (e) { e.target.value = e.target.id.indexOf("Categ") != -1 ? this.model.categoricalCurrentPage : this.model.seriesCurrentPage; },

        _setNavigators: function (value, pageCount, pagerTd) {
            if (value == pageCount) {
                $($(pagerTd).find(".moveNext")[0]).addClass("disabled");
                $($(pagerTd).find(".moveLast")[0]).addClass("disabled");
            }
            if (value == "1") {
                $($(pagerTd).find(".movePrevious")[0]).addClass("disabled");
                $($(pagerTd).find(".moveFirst")[0]).addClass("disabled");
            }
            if (value > 1) {
                $($(pagerTd).find(".movePrevious")[0]).removeClass("disabled");
                $($(pagerTd).find(".moveFirst")[0]).removeClass("disabled");
            }
            if (value < pageCount) {
                $($(pagerTd).find(".moveNext")[0]).removeClass("disabled");
                $($(pagerTd).find(".moveLast")[0]).removeClass("disabled");
            }
        }
    })

    ej.PivotPager.Locale = {};

    ej.PivotPager.Locale["en-US"] = {
        SeriesPage: "Series Page",
        CategoricalPage: "Categorical Page",
        Error: "Error",
        OK: "OK",
        Close: "Close",
        PageCountErrorMsg:"Enter valid page number"
    };

    ej.PivotPager.Mode = {
        Both: "both",
        Categorical: "categorical",
        Series: "series"
    };

})(jQuery, Syncfusion);

;

});