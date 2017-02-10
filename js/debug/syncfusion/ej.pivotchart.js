/*!
*  filename: ej.pivotchart.js
*  version : 14.4.0.20
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.globalize","./../common/ej.core","./../common/ej.data","./../common/ej.touch","./../common/ej.draggable","./../common/ej.scroller","./ej.dialog","./ej.waitingpopup","./../datavisualization/ej.chart","./ej.pivot.common"], fn) : fn();
})
(function () {
	
/**
* @fileOverview Plugin to style the Html Pivot Chart elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {

    ej.widget("ejPivotChart", "ej.PivotChart", {

        _rootCSS: "e-pivotchart",
        element: null,
        model: null,
        _requiresID: true,		
        validTags: ["div", "span"],
        defaults: $.extend(ej.datavisualization.Chart.prototype.defaults, {
            url: "",
            analysisMode: "pivot",
            operationalMode: "clientmode",
            cssClass: "",
            currentReport: "",
            customObject: {},
            enableRTL:false,
            isResponsive: false,
            enable3D: false,
            rotation: 0,
            serviceMethodSettings: {
                initialize: "InitializeChart",
                drillDown: "DrillChart",
                exportPivotChart: "Export",
                paging: "paging"
            },
            dataSource: {
                data: null,
                isFormattedValues: false,
                columns: [],
                cube: "",
                catalog: "",
                rows: [],
                values: [],
                filters: []
            },
            locale: null,
            drillSuccess: null,
            load: null,
            beforeServiceInvoke: null,
            afterServiceInvoke: null,
            renderComplete: null,
            renderFailure: null,
            renderSuccess: null,
            beforeExport:null,
            beforePivotEnginePopulate: null
        }),

        dataTypes: {
            marker: "data",
            crossHair: "data",
            size: "data",
            serviceMethodSettings: "data",
            zooming: "data",
            customObject: "data"
        },

        observables: ["title.text", "commonSeriesOptions.type", "locale"],
        titleText: ej.util.valueFunction("title.text"),
        seriesType: ej.util.valueFunction("commonSeriesOptions.type"),
        locale: ej.util.valueFunction("locale"),

        getOlapReport: function () {
            return this._olapReport;
        },

        setOlapReport: function (value) {
            this._olapReport = value;
        },

        getJSONRecords: function () {
            return this._JSONRecords;
        },

        setJSONRecords: function (value) {
            this._JSONRecords = $.parseJSON(value);
        },

        getPivotEngine: function () {
            return this._pivotEngine;
        },

        setPivotEngine: function (value) {
            this._pivotEngine = value;
        },

        _init: function () {
            this._initPrivateProperties();
            this._load();
        },

        _destroy: function () {
            this._pivotEngine = null;
            this.element.empty().removeClass("e-pivotchart" + this.model.cssClass);
            if (this._waitingPopup != undefined)
                this._waitingPopup._destroy();
        },

        _initPrivateProperties: function () {
            this._id = this.element.attr("id");
            this._olapReport = "";
            this._JSONRecords = null;
            this._currentAction = "initialize";
            this._selectedItem = "";
            this._selectedIndex = -1;
            this._selectedTagInfo = null;
            this._tagCollection = new Array();
            this._selectedTags = new Array();
            this._labelCurrentTags = new Array();
            this._startDrilldown = false;
            this._drillAction = "";
            this._initZooming = false;
            this._dimensionIndex = -1;
            this._selectedMenuItem = "";
            this._pivotEngine = null;
            this._curFocus = null;
            this._selectedSeriesInfo = new Array();
            this._waitingPopup = null;
        },

        _load: function () {
		    this.model.locale= this.model.locale || "en-US";
            var eventArgs = { action: "initialize", element: this.element, customObject: this.model.customObject };
            this._trigger("load", eventArgs);
            this.element.addClass(this.model.cssClass);

            if ($(this.element).parents(".e-pivotclient").length > 0) {
                var pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                if ($("#" + pivotClientObj._id + "_maxView")[0])
                    $("#" + pivotClientObj._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                else if (!ej.isNullOrUndefined(this._waitingPopup))
                    this._waitingPopup.show();
            }
            else {
                this.element.ejWaitingPopup({ showOnInit: true });
                this._waitingPopup = this.element.data("ejWaitingPopup");
                this._waitingPopup.show();
            }
            if (this.model.zooming != "")
                this._initZooming = true;
            if ((this.model.dataSource.data == null && this.model.url != "") || (this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode)) {
                this.model.operationalMode = ej.PivotChart.OperationalMode.ServerMode;
                if (this.model.url == "") {
                    this.renderChartFromJSON("");
                    return;
                }
                if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode)
                    this._trigger("beforeServiceInvoke", { action: this._currentAction, element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                if (this.model.customObject != "" && this.model.customObject != null && this.model.customObject != undefined)
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": "initialize", "currentReport": this.model.currentReport, "customObject": serializedCustomObject }), this.renderControlSuccess);
                else
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": "initialize" }), this.renderControlSuccess);
            }
            else {
                this.model.operationalMode = ej.PivotChart.OperationalMode.ClientMode;
                this.model.analysisMode = this.model.dataSource.cube != "" ? ej.PivotChart.AnalysisMode.Olap : ej.PivotChart.AnalysisMode.Pivot;
                this.refreshControl();
            }
        },

        refreshControl: function () {
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var data = ej.PivotAnalysis.pivotEnginePopulate(this.model);
                this._pivotEngine = data.pivotEngine;
                if (data.pivotEngine.length > 0) {
                    if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) {
                        var clonedEngine = this._cloneEngine(this._pivotEngine);
                        for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++)
                            this._cropData(clonedEngine, this._labelCurrentTags.expandedMembers[i], 0, true);
                        this._generateData(clonedEngine);
                    }
                    else
                        this._generateData(this._pivotEngine);
                }
                else if (!ej.isNullOrUndefined(this._waitingPopup))
                    this._waitingPopup.hide();
            }
            else
                ej.olap.base.getJSONData({ action: "initialLoad" }, this.model.dataSource, this);
        },

        _setFirst: true,

        _setModel: function (options) {
            var chartObj = this.element.find("#" + this._id + "Container").data("ejChart");
            for (var key in options) {
                switch (key) {
                    case "olapReport": this.setOlapReport(options[key]); break;
                    case "jsonData": this.setJSONRecords(options[key]); break;
                    case "refreshPivotChart": this.element.renderChartFromJSON(options[key]); break;
                    case "customObject": this.model.customObject = options[key]; break;
                    case "height": this.model.size.height = options[key]; break;
                    case "width": this.model.size.width = options[key]; break;
                    case "commonSeriesOptions":
                        {
                            if (chartObj) {
                                chartObj.model.commonSeriesOptions = options[key];
                                chartObj.model.type = chartObj.model.commonSeriesOptions.type = this.seriesType();
                                for (var i = 0; i < chartObj.model.series.length; i++)
                                    chartObj.model.series[i].type = chartObj.model.type;
                            } break;
                        }
                    case "title":
                        {
                            if (chartObj)
                                chartObj.model.title.text = this.titleText();
                            break;
                        }
                    case "animation": this.model.animation = options[key]; break;
                    case "crossHair": this.model.crossHair = options[key]; break;
                    case "marker": this.model.marker = options[key]; break;
                    case "zooming": this.model.zooming = options[key]; break;
                    case "legend": this.model.legend = options[key]; break;
                    case "primaryXAxis": this.model.primaryXAxis = options[key]; break;
                    case "primaryYAxis": this.model.primaryYAxis = options[key]; break;
                    case "locale": this.locale(); break;
                    default:
                        { $.extend(true, this.model, {}, options[key]); }
                }
            }
            if (chartObj)
                this.renderControlSuccess({ "JsonRecords": JSON.stringify(this.getJSONRecords()), "OlapReport": this.getOlapReport() });
        },

        _keyDownPress: function (e) {
            if (e.which === 13 && (!ej.isNullOrUndefined(this._curFocus))) {
                this._curFocus.click();
            }
            if ((e.which === 39 || e.which === 37 || e.which === 38 || e.which === 40) && this.element.find(".e-dialog").length > 0) {
                e.preventDefault();
                var menu = this.element.find(".e-dialog");
                menu.tabindex = -1;
                menu.focus();
                var focEle = menu.find("li");
                var next;
                if (e.which === 39 || e.which === 40) {
                    if (!ej.isNullOrUndefined(this._curFocus)) {
                        this._curFocus.removeClass("hoverCell");
                        next = this._curFocus.next();
                        if (next.length > 0) {
                            this._curFocus = next;
                        }
                        else {
                            this._curFocus = focEle.eq(0);
                        }
                    }
                    else {
                        this._curFocus = focEle.eq(0);
                    }
                    this._curFocus.addClass("hoverCell");
                }
                else if (e.which === 37 || e.which === 38) {
                    if (!ej.isNullOrUndefined(this._curFocus)) {
                        this._curFocus.removeClass("hoverCell");
                        next = this._curFocus.prev();
                        if (next.length > 0) {
                            this._curFocus = next;
                        }
                        else {
                            this._curFocus = focEle.last();
                        }
                    }
                    else {
                        this._curFocus = focEle.last();
                    }
                    this._curFocus.addClass("hoverCell");
                }
            }
        },

        _wireEvents: function () {
            this._on($(document), 'keydown', this._keyDownPress);
            this._on(this.element, "click", ".menuList", function (evt) {
                this._curFocus = null;               
                if (evt.target.innerHTML == this._getLocalizedLabels("Exit")) {
                    this.element.find("#" + this._id + "ExpandMenu, .expandMenu, .e-dialog").remove();
                }
                else if (evt.target.innerHTML.indexOf(this._getLocalizedLabels("Expand")) > -1) {
                    this._drillAction = "drilldown";
                    if ($(this.element).parents(".e-pivotclient").length > 0) {
                        var pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                        if ($("#" + pivotClientObj._id + "_maxView")[0])
                            $("#" + pivotClientObj._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                        else if (!ej.isNullOrUndefined(this._waitingPopup))
                            this._waitingPopup.show();
                    }
                    else if (!ej.isNullOrUndefined(this._waitingPopup))
                        this._waitingPopup.show();
                    if (this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode) {
                        var selectedMember = this.model.enableRTL ? evt.target.innerHTML.split(" - ")[0] : evt.target.innerHTML.split(" - ")[1];
                        if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                            if (ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) this._labelCurrentTags["expandedMembers"] = new Array();
                            this._labelCurrentTags.expandedMembers.push(selectedMember);
                            var clonedEngine = this._cloneEngine(this._pivotEngine);
                            for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++)
                                this._cropData(clonedEngine, this._labelCurrentTags.expandedMembers[i], 0, true);
                            this._generateData(clonedEngine);
                            this._trigger("drillSuccess", { chartObj: this, drillAction: "drilldown", drilledMember: this._labelCurrentTags.expandedMembers.join(">#>"), event: evt });
                        }
                        else {
                            this._labelCurrentTags.collapsedMembers = $.grep(this._labelCurrentTags.collapsedMembers, function (item) { return item != selectedMember; });
                            var memberInfo = $(this.getJSONRecords().seriesTags).filter(function (index, item) { return item.split('::')[2] == selectedMember })[0];
                            var drilledMember = ej.olap._mdxParser._splitCellInfo(memberInfo);
                            var tempArray = new Array();
                            for (var i = 0; i < this.model.dataSource.rows.length; i++) {
                                if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) {
                                    for (var j = 0; j < this._labelCurrentTags.expandedMembers.length; j++) {
                                        if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[j])) {
                                            for (var k = 0; k < this._labelCurrentTags.expandedMembers[j].length; k++) {
                                                if (this._labelCurrentTags.expandedMembers[j][k].indexOf(this.model.dataSource.rows[i].fieldName) >= 0) {
                                                    tempArray.push(this._labelCurrentTags.expandedMembers[j][k]);
                                                }
                                            }
                                        }
                                    }
                                }
                                for (var j = 0; j < this._selectedSeriesInfo.length; j++) {
                                    if (this._selectedSeriesInfo[j].indexOf(this.model.dataSource.rows[i].fieldName) >= 0)
                                        tempArray.push(this._selectedSeriesInfo[j].replace(/&/g, "&amp;"));
                                }
                            }
                            for (var i = 0; i < this._selectedSeriesInfo.length; i++)
                                this._selectedSeriesInfo[i] = this._selectedSeriesInfo[i].replace(/&/g, "&amp;");
                            var uniqueNameArray = tempArray;
                            memberInfo = memberInfo.replace(/&/g, "&amp;");
                            var index = $.inArray(memberInfo, this._selectedSeriesInfo);
                            var tempArray = new Array();
                            for (var i = 0; i <= index; i++)
                                tempArray.push(this._selectedSeriesInfo[i]);
                            this._selectedSeriesInfo = tempArray;
                            var index = $.inArray(memberInfo, uniqueNameArray);
                            var tempArray = new Array();
                            for (var i = 0; i <= index; i++)
                                tempArray.push(uniqueNameArray[i]);
                            uniqueNameArray = tempArray;
                            var dimensionIndex = -1;
                            for (var i = 0; i < this.model.dataSource.rows.length; i++) {
                                if (this.model.dataSource.rows[i].fieldName == drilledMember.hierarchyUniqueName) {
                                    dimensionIndex = i;
                                    break;
                                }
                            }
                            if (ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) this._labelCurrentTags["expandedMembers"] = new Array();
                            if (ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[dimensionIndex])) this._labelCurrentTags.expandedMembers[dimensionIndex] = new Array();
                            this._labelCurrentTags.expandedMembers[dimensionIndex].push(memberInfo);
                            for (var i = dimensionIndex + 1; i < this._labelCurrentTags.expandedMembers.length; i++)
                                this._labelCurrentTags.expandedMembers[i] = [];
                            var currentObj = this.element.parents(".e-pivotclient").length > 0 ? this.element.parents(".e-pivotclient").data("ejPivotClient") : this
                            ej.olap._mdxParser.updateDrilledReport({ uniqueName: memberInfo, seriesInfo: this._selectedSeriesInfo, uniqueNameArray: uniqueNameArray }, "rowheader", currentObj);
                        }
                    }
                    else {
                        var serializedCustomObject = JSON.stringify(this.model.customObject);
                        if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                            var selectedMember = this.model.enableRTL ? evt.target.innerHTML.split(" - ")[0] : evt.target.innerHTML.split(" - ")[1];
                            this._selectedItem = selectedMember;
                            if (ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) this._labelCurrentTags["expandedMembers"] = new Array();
                            this._labelCurrentTags.expandedMembers.push(selectedMember);
                            if (this.model.customObject != "" && this.model.customObject != null && this.model.customObject != undefined)
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drilledSeries": JSON.stringify(this._labelCurrentTags.expandedMembers), "customObject": serializedCustomObject, "currentReport": JSON.parse(this.getOlapReport())["Report"] }), this.renderControlSuccess);
                            else
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drilledSeries": JSON.stringify(this._labelCurrentTags.expandedMembers), "currentReport": JSON.parse(this.getOlapReport())["Report"] }), this.renderControlSuccess);
                        }
                        else {
                            var pivotChartObj = this;
                            if (!this._isDrilled) {
                                this._isDrilled = true;
                                jQuery.each(evt.target.parentElement.children, function (index, value) {
                                    if (value.innerHTML == evt.target.innerHTML)
                                        pivotChartObj._dimensionIndex = index;
                                });
                            }
                            var report = this.getOlapReport();
                            this._drillAction = "drilldown";
                            if (this.model.enableRTL)
                                this._selectedItem = $.trim(evt.target.innerHTML.replace(" - " + this._getLocalizedLabels("Expand"), ""));
                            else
                                this._selectedItem = $.trim(evt.target.innerHTML.replace(this._getLocalizedLabels("Expand") + " - ", ""));
                            jQuery.each(this._labelCurrentTags, function (index, value) {
                                if (value.name == pivotChartObj._selectedItem) {
                                    pivotChartObj._tagCollection = [];
                                    pivotChartObj._tagCollection = pivotChartObj._selectedTags.slice();
                                    pivotChartObj._selectedTagInfo = value.tag;
                                    pivotChartObj._selectedMenuItem = value.name;
                                    return false;
                                }
                            });
                            this._startDrilldown = true;
                            if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode)
                                this._trigger("beforeServiceInvoke", { action: this._drillAction, element: this.element, customObject: this.model.customObject });
                            if (this.model.customObject != "" && this.model.customObject != null && this.model.customObject != undefined) {
                                if (typeof (oclientProxy) != "undefined")
                                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drilledSeries": this._selectedTagInfo, "olapReport": report, "clientReports": oclientProxy.reports, "customObject": serializedCustomObject }), this.renderControlSuccess);
                                else
                                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drilledSeries": this._selectedTagInfo, "olapReport": report, "customObject": serializedCustomObject }), this.renderControlSuccess);
                            }
                            else {
                                if (!typeof (oclientProxy) != "undefined")
                                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drilledSeries": this._selectedTagInfo, "olapReport": report }), this.renderControlSuccess);
                                else
                                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drilledSeries": this._selectedTagInfo, "olapReport": report, "clientReports": oclientProxy.reports }), this.renderControlSuccess);
                            }
                        }
                    }
                }
                else {
                    this._drillAction = "drillup";
                    if ($(this.element).parents(".e-pivotclient").length > 0) {
                        var pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                        if ($("#" + pivotClientObj._id + "_maxView")[0])
                            $("#" + pivotClientObj._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                        else if (!ej.isNullOrUndefined(this._waitingPopup))
                            this._waitingPopup.show();
                    }
                    else
                        this._waitingPopup.show();
                    if (this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode) {
                        var selectedMember = this.model.enableRTL ? evt.target.innerHTML.split(" - ")[0] : evt.target.innerHTML.split(" - ")[1];
                        if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                            var flag = false, tempArray = new Array();
                            jQuery.map(this._labelCurrentTags.expandedMembers, function (member) {
                                if (member == selectedMember) flag = true;
                                if (!flag) tempArray.push(member);
                            });
                            this._labelCurrentTags.expandedMembers = tempArray;
                            var drillInfo = this._labelCurrentTags.expandedMembers.length == 0 ? selectedMember : this._labelCurrentTags.expandedMembers.join(">#>") + ">#>" + selectedMember;
                            if (this._labelCurrentTags.expandedMembers.length == 0 && $(this.element).parents(".e-pivotclient").length > 0) {
                                var pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                                if (pivotClientObj._drillParams.length > 0) {
                                    pivotClientObj._drillParams = $.grep(pivotClientObj._drillParams, function (item) { return item.indexOf(selectedMember) < 0; });
                                    pivotClientObj._getDrilledMember();
                                }
                            }
                            var clonedEngine = this._cloneEngine(this._pivotEngine);
                            for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++)
                                this._cropData(clonedEngine, this._labelCurrentTags.expandedMembers[i], 0, true);
                            this._generateData(clonedEngine);
                            this._trigger("drillSuccess", { chartObj: this, drillAction: "drillup", drilledMember: drillInfo, event: evt });
                        }
                        else {
                            var memberInfo = null;
                            var tempArray = new Array();
                            for (var i = 0; i < this.model.dataSource.rows.length; i++) {
                                if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) {
                                    for (var j = 0; j < this._labelCurrentTags.expandedMembers.length; j++) {
                                        if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[j])) {
                                            for (var k = 0; k < this._labelCurrentTags.expandedMembers[j].length; k++) {
                                                if (this._labelCurrentTags.expandedMembers[j][k].indexOf(this.model.dataSource.rows[i].fieldName) >= 0) {
                                                    tempArray.push(this._labelCurrentTags.expandedMembers[j][k]);
                                                }
                                            }
                                        }
                                    }
                                }
                                for (var j = 0; j < this._selectedSeriesInfo.length; j++) {
                                    if (this._selectedSeriesInfo[j].indexOf(this.model.dataSource.rows[i].fieldName) >= 0)
                                        tempArray.push(this._selectedSeriesInfo[j].replace(/&/g, "&amp;"));
                                }
                            }
                            for (var i = 0; i < this._selectedSeriesInfo.length; i++)
                                this._selectedSeriesInfo[i] = this._selectedSeriesInfo[i].replace(/&/g, "&amp;");
                            var uniqueNameArray = tempArray;
                            for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++) {
                                if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[i])) {
                                    for (var j = 0; j < this._labelCurrentTags.expandedMembers[i].length; j++) {
                                        if (this._labelCurrentTags.expandedMembers[i][j].split('::')[2] == selectedMember) {
                                            memberInfo = this._labelCurrentTags.expandedMembers[i][j];
                                            var tempArray = new Array();
                                            jQuery.map(this._labelCurrentTags.expandedMembers[i], function (member) {
                                                if (member.split('::')[2] == selectedMember) flag = true;
                                                if (!flag) tempArray.push(member);
                                            });
                                            this._labelCurrentTags.expandedMembers[i] = tempArray;
                                        }
                                    }
                                }
                            }

                            var index = $.inArray(memberInfo, this._selectedSeriesInfo);
                            var tempArray = new Array();
                            for (var i = 0; i <= index; i++)
                                tempArray.push(this._selectedSeriesInfo[i]);
                            this._selectedSeriesInfo = tempArray;
                            var index = $.inArray(memberInfo, uniqueNameArray);
                            var tempArray = new Array();
                            for (var i = 0; i <= index; i++)
                                tempArray.push(uniqueNameArray[i]);
                            uniqueNameArray = tempArray;

                            var drilledMember = ej.olap._mdxParser._splitCellInfo(memberInfo);
                            for (var i = 0; i < this.model.dataSource.rows.length; i++) {
                                if (this.model.dataSource.rows[i].fieldName == drilledMember.hierarchyUniqueName) {
                                    dimensionIndex = i;
                                    break;
                                }
                            }
                            for (var i = dimensionIndex + 1; i < this._labelCurrentTags.expandedMembers.length; i++)
                                this._labelCurrentTags.expandedMembers[i] = [];
                            var currentObj = this;
                            if (this.element.parents(".e-pivotclient").length > 0) {
                                currentObj = this.element.parents(".e-pivotclient").data("ejPivotClient");
                                currentObj._drillParams = $.grep(currentObj._drillParams, function (item) { return item != memberInfo; });
                                var flag = false;
                                for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++) {
                                    if (this._labelCurrentTags.expandedMembers[i].length > 0) { flag = true; break; }
                                }
                                if (currentObj._drillParams.length > 0 && !flag) {
                                    this._labelCurrentTags.expandedMembers[dimensionIndex].push(currentObj._drillParams[dimensionIndex].split(">#>")[currentObj._drillParams[dimensionIndex].split(">#>").length - 1]);
                                }
                            }
                            ej.olap._mdxParser.updateDrilledReport({ uniqueName: memberInfo, seriesInfo: this._selectedSeriesInfo, uniqueNameArray: uniqueNameArray, action: "collapse" }, "rowheader", currentObj);
                        }
                    }
                    else {
                        var serializedCustomObject = JSON.stringify(this.model.customObject);
                        if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                            var selectedMember = this.model.enableRTL ? evt.target.innerHTML.split(" - ")[0] : evt.target.innerHTML.split(" - ")[1];
                            var flag = false, tempArray = new Array();
                            jQuery.map(this._labelCurrentTags.expandedMembers, function (member) {
                                if (member == selectedMember) flag = true;
                                if (!flag) tempArray.push(member);
                            });
                            this._selectedItem = selectedMember;
                            this._labelCurrentTags.expandedMembers = tempArray;
                            if (this.model.customObject != "" && this.model.customObject != null && this.model.customObject != undefined)
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drilledSeries": JSON.stringify(this._labelCurrentTags.expandedMembers), "customObject": serializedCustomObject, "currentReport": JSON.parse(this.getOlapReport())["Report"]}), this.renderControlSuccess);
                            else
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drilledSeries": JSON.stringify(this._labelCurrentTags.expandedMembers), "currentReport": JSON.parse(this.getOlapReport())["Report"] }), this.renderControlSuccess);
                        }
                        else {
                            var report = this.getOlapReport();
                            this._drillAction = "drillup";
                            if (this.model.enableRTL)
                                this._selectedItem = $.trim(evt.target.innerHTML.replace(" - " + this._getLocalizedLabels("Collapse"), ""));
                            else
                                this._selectedItem = $.trim(evt.target.innerHTML.replace(this._getLocalizedLabels("Collapse") + " - ", ""));
                            this._tagCollection = [];
                            this._tagCollection = this._selectedTags.slice();
                            var pivotChartObj = this;
                            jQuery.each(this._tagCollection, function (index, value) {
                                if (value.name == pivotChartObj._selectedItem) {
                                    pivotChartObj._selectedIndex = index;
                                    pivotChartObj._selectedTagInfo = value.tag;
                                    pivotChartObj._tagCollection.splice(index, pivotChartObj._tagCollection.length);
                                    return false;
                                }
                            });
                            if (this._tagCollection.length == 0)
                                this._isDrilled = false;
                            this._startDrilldown = true;
                            if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode)
                                this._trigger("beforeServiceInvoke", { action: this._drillAction, element: this.element, customObject: this.model.customObject });
                            if (this.model.customObject != "" && this.model.customObject != null && this.model.customObject != undefined) {
                                if (typeof (oclientProxy) != "undefined")
                                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillup", "drilledSeries": this._selectedTagInfo, "olapReport": report, "clientReports": reports, "customObject": serializedCustomObject }), this.renderControlSuccess);
                                else
                                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillup", "drilledSeries": this._selectedTagInfo, "olapReport": report, "customObject": serializedCustomObject }), this.renderControlSuccess);
                            }
                            else {
                                if (!typeof (oclientProxy) != "undefined")
                                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillup", "drilledSeries": this._selectedTagInfo, "olapReport": report }), this.renderControlSuccess);
                                else
                                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillup", "drilledSeries": this._selectedTagInfo, "olapReport": report, "clientReports": reports }), this.renderControlSuccess);
                            }
                        }
                    }
                }				
            });
            if (typeof (oclientProxy) == "undefined")
                $(window).on('resize', $.proxy(this._reSizeHandler, this));
        },

        _unWireEvents: function () {
            this._off($(document), 'keydown', this._keyDownPress);
            $(document.body).off("click");
            this._off(this.element, "click", ".menuList");
            $(window).off('resize', $.proxy(this._reSizeHandler, this));
        },

        generateJSON: function (baseObj, pivotEngine) {
            if ((!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) && this._labelCurrentTags.expandedMembers.length > 0) {
                for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++) {
                    if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[i]) && this._labelCurrentTags.expandedMembers[i].length > 0) {
                        if (i > 0 && !ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[i - 1]) && this._labelCurrentTags.expandedMembers[i - 1].length > 0)
                            this._cropData(pivotEngine, this._selectedSeriesInfo[i - 1].split('::')[2], i - 1, false);
                        for (var j = 0; j < this._labelCurrentTags.expandedMembers[i].length; j++)
                            this._cropData(pivotEngine, this._labelCurrentTags.expandedMembers[i][j].split('::')[2], i, true);
                    }
                }
            }
            this._generateData(pivotEngine);
        },

        _generateData: function (pivotEngine) {
            var chartData = {
                seriesNames: [],
                chartLables: [],
                labelTags: [],
                seriesTags: [],
                points_Y: [],
                measureNames: ""
            };

            var columnCount = pivotEngine.length;
            if (columnCount > 0 && pivotEngine[0].length > 0) {
                var rowCount = pivotEngine[0].length;
                var summaryColumns = new Array();
                var summaryRows = new Array();

                if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot)
                    var rowHeaderWidth = (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) ? this.model.dataSource.rows.length - this._labelCurrentTags.expandedMembers.length : this.model.dataSource.rows.length;
                else
                    var rowHeaderWidth = this.model.dataSource.rows.length + ((this.model.dataSource.values[0].axis == "rows" && this.model.dataSource.values[0].measures.length > 0) ? 1 : 0);

                var columnHeaderHeight = this.model.dataSource.columns.length;
                if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot)
                    columnHeaderHeight += this.model.dataSource.values.length > 0 ? 1 : 0;
                else
                    columnHeaderHeight += (this.model.dataSource.values[0].axis == "columns" && this.model.dataSource.values[0].measures.length > 0) ? 1 : 0;

                //Getting Series Labels
                var measure = "";
                for (var i = rowHeaderWidth; i < columnCount; i++) {
                    var seriesName = "";
                    var isSummary = false;
                    for (var j = 0; j < columnHeaderHeight; j++) {
                        if (!ej.isNullOrUndefined(pivotEngine[i][j])) {
                            if (pivotEngine[i][j].CSS.indexOf("summary") >= 0) {
                                isSummary = true;
                                summaryColumns.push(i);
                                break;
                            }
                            if (pivotEngine[i][j].Info.indexOf(this._getLocalizedLabels("Measure")) >= 0 && measure.indexOf(pivotEngine[i][j].Value) < 0) {
                                measure += measure == "" ? pivotEngine[i][j].Value : " ~ " + pivotEngine[i][j].Value;
                            }
                            seriesName += (seriesName == "" ? "" : (pivotEngine[i][j].Value == "" ? "" : " - ")) + pivotEngine[i][j].Value;
                        }
                    }
                    if (!isSummary && seriesName != "") chartData.seriesNames.push(seriesName);
                }

                //Getting Chart Labels
                for (var i = columnHeaderHeight; i < rowCount; i++) {
                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                        if (rowHeaderWidth > 1) {
                            if (pivotEngine[0][i].CSS == "summary rstot" && pivotEngine[0][i].Value != "Grand Total")
                                chartData.chartLables.push(pivotEngine[0][i].Value.replace(" Total", ""));
                        }
                        else if (pivotEngine[0][i].CSS == "rowheader")
                            chartData.chartLables.push(pivotEngine[0][i].Value);
                    }
                    else {
                        if (ej.isNullOrUndefined(this._labelCurrentTags.collapsedMembers)) this._labelCurrentTags["collapsedMembers"] = new Array();
                        if (rowHeaderWidth > 1) {
                            var chartLabel = "", isSummary = false, labelTag = "";
                            for (var j = 0; j < rowHeaderWidth; j++) {
                                if (pivotEngine[j][i].CSS == "rowheader") {
                                    chartLabel += chartLabel == "" ? pivotEngine[j][i].Value : " ~ " + pivotEngine[j][i].Value;
                                    if (pivotEngine[j][i].Info.indexOf("[Measures]") == -1) labelTag += labelTag == "" ? pivotEngine[j][i].Info : " ~ " + pivotEngine[j][i].Info;
                                    if ($.inArray(pivotEngine[j][i].Value, this._labelCurrentTags.collapsedMembers) < 0 && pivotEngine[j][i].State == 2) this._labelCurrentTags.collapsedMembers.push(pivotEngine[j][i].Value);
                                    if ($.inArray(pivotEngine[j][i].Info, chartData.seriesTags) < 0 && pivotEngine[j][i].Info.indexOf("[Measures]") == -1) chartData.seriesTags.push(pivotEngine[j][i].Info);
                                }
                                else {
                                    isSummary = true;
                                    summaryRows.push(i);
                                    break
                                }
                            }
                            if (!isSummary) {
                                chartData.chartLables.push(chartLabel);
                                chartData.labelTags.push(labelTag);
                            }
                        }
                        else {
                            if (pivotEngine[0][i].CSS == "rowheader") {
                                chartData.chartLables.push(pivotEngine[0][i].Value);
                                chartData.labelTags.push(pivotEngine[0][i].Info);
                                chartData.seriesTags.push(pivotEngine[0][i].Info);
                            }
                            if (pivotEngine[0][i].State == 2) this._labelCurrentTags.collapsedMembers.push(pivotEngine[0][i].Value);
                        }
                    }
                }

                //Forming Data Points
                for (var i = columnHeaderHeight; i < rowCount; i++) {
                    var pointsArray = new Array();
                    if (rowHeaderWidth > 1) {
                        if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                            if (pivotEngine[0][i].CSS == "summary rstot" && pivotEngine[0][i].Value != "Grand Total") {
                                for (var j = rowHeaderWidth; j < columnCount; j++) {
                                    if ($.inArray(j, summaryColumns) < 0)
                                        pointsArray.push(pivotEngine[j][i].Value);
                                }
                                chartData.points_Y.push(pointsArray);
                            }
                        }
                        else {
                            if ($.inArray(i, summaryRows) < 0) {
                                for (var j = rowHeaderWidth; j < columnCount; j++) {
                                    if ($.inArray(j, summaryColumns) < 0)
                                        pointsArray.push(pivotEngine[j][i].Value == "" ? 0 : ej.parseFloat(pivotEngine[j][i].Value, this.locale()));
                                }
                                chartData.points_Y.push(pointsArray);
                            }
                        }
                    }
                    else if (pivotEngine[0][i].CSS == "rowheader") {
                        for (var j = pivotEngine[0][0].ColSpan; j < columnCount; j++) {
                            if ($.inArray(j, summaryColumns) < 0)
                                pointsArray.push(this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap ? (pivotEngine[j][i].Value == "" ? 0 : ej.parseFloat(pivotEngine[j][i].Value, this.locale())) : pivotEngine[j][i].Value);
                        }
                        chartData.points_Y.push(pointsArray);
                    }
                }
            }

            //Getting Value Names
            if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap) {
                chartData.measureNames = measure;
            }
            else {
                var measureNames = $(this.model.dataSource.values).map(function (index, item) { return item.fieldCaption });
                for (var i = 0; i < measureNames.length; i++)
                chartData.measureNames += chartData.measureNames == "" ? measureNames[i] : "~" + measureNames[i];
            }
            this.renderControlSuccess({ JsonRecords: JSON.stringify(chartData), OlapReport: JSON.stringify(this.model.dataSource) });
            chartData = {};
        },

        _cloneEngine: function (pivotEngine) {
            var clonedEngine = $.extend([], pivotEngine);
            for (var i = 0; i < pivotEngine.length; i++)
                clonedEngine[i] = $.extend([], pivotEngine[i]);
            return clonedEngine;
        },

        _cropData: function (pivotEngine, selectedMember, drilledDimensionIndex, isRemoved) {
            var j = this.model.dataSource.columns.length + 1;
            while (j < pivotEngine[drilledDimensionIndex].length) {
                if (pivotEngine[drilledDimensionIndex][j].Value != selectedMember) {
                    for (var i = 0; i < pivotEngine.length; i++)
                        pivotEngine[i].splice(j, 1);
                }
                else
                    j += pivotEngine[drilledDimensionIndex][j].RowSpan;
            }
            if (isRemoved) pivotEngine.splice(drilledDimensionIndex, 1);
        },

        refreshPagedPivotChart: function (axis, pageNo) {
            if (typeof ochartWaitingPopup != 'undefined' && ochartWaitingPopup != null)
                ochartWaitingPopup.show();
            axis = axis.indexOf('categ') != -1 ? "categorical" : "series";
            var report;
            try {
                report = JSON.parse(this.getOlapReport());
            }
            catch (err) {
                report = this.getOlapReport();
            }
            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.paging, JSON.stringify({ "action": "paging", "pagingInfo": axis + ":" + pageNo, "currentReport": report, "customObject": JSON.stringify(this.model.customObject) }), this.renderControlSuccess);
        },
        _updatePageSettings: function (msg, oclientProxy) {
            var pageSettings = $.map(msg, function (obj, index) { if (obj.Key == "PageSettings") return obj; });
            var headerSettings = $.map(msg, function (obj, index) { if (obj.Key == "HeaderCounts") return obj; });
            if (pageSettings.length > 0 && oclientProxy._pagerObj != null) {
                oclientProxy._pagerObj.element.css("opacity", "1");
                oclientProxy._pagerObj.element.find(".pagerTextBox").removeAttr('disabled');
                oclientProxy._pagerObj._unwireEvents();
                oclientProxy._pagerObj._wireEvents();
                oclientProxy._pagerObj.initPagerProperties(JSON.parse(headerSettings[0].Value), JSON.parse(pageSettings[0].Value));
            }
        },
        renderControlSuccess: function (msg) {
            if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                if ($("#" + oclientProxy._id + "_maxView")[0])
                    $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                else
                    oclientWaitingPopup.show();
            try {
                if (msg[0] != undefined) {
                    this.setJSONRecords(msg[0].Value); this.setOlapReport(msg[1].Value);
                    if (!ej.isNullOrUndefined(msg[2]) && msg[2].Key == "AnalysisMode" && msg[2].Value == "Olap") this.model.analysisMode = ej.PivotChart.AnalysisMode.Olap;
                    if (typeof (oclientProxy) != "undefined") {
                        oclientProxy.currentReport = msg[1].Value;
                        if (msg[2] != null && msg[2] != undefined && msg[2].Key == "ClientReports")
                            oclientProxy.reports = msg[2].Value;
                        this._updatePageSettings(msg, oclientProxy);
                    }
                    if (msg[2] != null && msg[2] != undefined && !msg[2].Key == "ClientReports" && msg[2].Key != "AnalysisMode")
                        this.model.customObject = msg[2].Value;
                    if ($(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined) {
                        if (this._pagerObj != null && msg[2] != null && msg.d[2] != undefined)
                            this._pagerObj.initPagerProperties(JSON.parse(msg.d[3].Value), JSON.parse(msg.d[2].Value));
                    }
                }
                else if (msg.d != undefined) {
                    this.setJSONRecords(msg.d[0].Value); this.setOlapReport(msg.d[1].Value);
                    if (msg.d[2].Key == "AnalysisMode" && msg.d[2].Value == "Olap") this.model.analysisMode = ej.PivotChart.AnalysisMode.Olap;
                    if (typeof (oclientProxy) != "undefined") {
                        oclientProxy.currentReport = msg.d[1].Value;
                        if (msg.d[2] != null && msg.d[2] != undefined && msg.d[2].Key == "ClientReports")
                            oclientProxy.reports = msg.d[2].Value;
                        this._updatePageSettings(msg.d, oclientProxy);
                    }
                    if (msg.d[2] != null && msg.d[2] != undefined && !(msg.d[2].Key == "ClientReports") && msg.d[2].Key != "AnalysisMode")
                        this.model.customObject = msg.d[2].Value;
                    if (this._pagerObj != null && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined) {
                        if (msg.d[2] != null && msg.d[2] != undefined && msg.d[2].Key == "PageSettings")
                            this._pagerObj.initPagerProperties(JSON.parse(msg.d[3].Value), JSON.parse(msg.d[2].Value));
                        if (msg.d[3] != null && msg.d[3] != undefined && msg.d[3].Key == "PageSettings")
                            this._pagerObj.initPagerProperties(JSON.parse(msg.d[4].Value), JSON.parse(msg.d[3].Value));
                    }
                }
                else {
                    this.setJSONRecords(msg.JsonRecords); this.setOlapReport(msg.OlapReport);
                    if (msg.AnalysisMode == "Olap") this.model.analysisMode = ej.PivotChart.AnalysisMode.Olap;
                    if (msg.customObject != null && msg.customObject != null)
                        this.model.customObject = msg.customObject;
                    if (typeof (oclientProxy) != "undefined") {
                        if (typeof (oclientProxy.currentReport) != "undefined")
                            oclientProxy.currentReport = msg.OlapReport;
                        if (typeof (oclientProxy.reports) != "undefined" && msg.reports != undefined && msg.reports != "undefined")
                            oclientProxy.reports = msg.reports;
                    }
                }
                if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                    var eventArgs;
                    if (this._drillAction != "")
                        eventArgs = { action: this._drillAction, element: this.element, customObject: this.model.customObject };
                    else
                        eventArgs = { action: this._currentAction, element: this.element, customObject: this.model.customObject };
                    this._trigger("afterServiceInvoke", eventArgs);
                }
                $("#" + this._id + "Container").ejChart('destroy');
                var htmlTag = ej.buildTag("div#" + this._id + "Container", "", { "height": (typeof (oclientProxy) != "undefined") ? oclientProxy._chartHeight : this.element.height(), "width": (typeof (oclientProxy) != "undefined") ? (oclientProxy.model.enableSplitter ? oclientProxy.element.find(".controlPanelTD").width() : (oclientProxy._toggleExpand ? (oclientProxy.element.find(".controlPanelTD").width()-15) : oclientProxy._chartWidth)) : this.element.width() })[0].outerHTML;
                this.element.html(htmlTag);
                if (this.model.commonSeriesOptions.type == ej.PivotChart.ChartTypes.Funnel || this.model.commonSeriesOptions.type == ej.PivotChart.ChartTypes.Pyramid)
                    this.model.legend.toggleSeriesVisibility = false;
                else
                    this.model.legend.toggleSeriesVisibility = true;
                this.renderChartFromJSON(this.getJSONRecords());
                this._unWireEvents();
                this._wireEvents();
                if (this._drillAction != "") {
                    this.model.currentReport = this.getOlapReport();
                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                        if (this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode) {
                            var chartData = this.getJSONRecords();
                            if (this.model.dataSource.rows.length - this._labelCurrentTags.expandedMembers.length > 1) {
                                this._labelCurrentTags["collapsedMembers"] = new Array();
                                for (var i = 0; i < chartData.chartLables.length; i++)
                                    this._labelCurrentTags["collapsedMembers"].push(chartData.chartLables[i]);
                            }
                        }
                        else {
                            var chartData = this.getJSONRecords();
                            var rows = JSON.parse(JSON.parse(this.getOlapReport()).rows);
                            this._labelCurrentTags["collapsedMembers"] = new Array();
                            if (rows.length - this._labelCurrentTags.expandedMembers.length > 1) {
                                for (var i = 0; i < chartData.chartLables.length; i++)
                                    this._labelCurrentTags["collapsedMembers"].push(chartData.chartLables[i]);
                            }
                        }
                    }
                    this._trigger("drillSuccess", this.element);
                }
                else {
                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                        if (this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode) {
                            var chartData = this.getJSONRecords();
                            this._labelCurrentTags = { collapsedMembers: [] };
                            if (this.model.dataSource.rows.length > 1) {
                                for (var i = 0; i < chartData.chartLables.length; i++)
                                    this._labelCurrentTags["collapsedMembers"].push(chartData.chartLables[i]);
                            }
                        }
                        else {
                            var chartData = this.getJSONRecords();
                            this.model.currentReport = JSON.parse(this.getOlapReport());
                            this._labelCurrentTags = { collapsedMembers: [] };
                            if ($(this.element).parents(".e-pivotclient").length > 0 ? this.model.currentReport.PivotRows.length > 1 : JSON.parse(this.model.currentReport.rows).length > 1) {
                                for (var i = 0; i < chartData.chartLables.length; i++) {
                                    this._labelCurrentTags["collapsedMembers"].push(chartData.chartLables[i]);
                                }
                            }
                        }
                    }
                }
                if (typeof oclientProxy != 'undefined' && oclientProxy._waitingPopup != null) {
                    if ($("#" + oclientProxy._id + "_maxView")[0]) {
                        $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: false });
                        oclientProxy._waitingPopup.hide();
                    }
                    else if (typeof oclientProxy._pivotGrid != "undefined") {
                        if (oclientProxy && (oclientProxy._pivotGrid._drillAction && !oclientProxy._pivotGrid._startDrilldown) || oclientProxy._pivotChart._drillAction && !oclientProxy._pivotChart._startDrilldown)
                            oclientProxy._waitingPopup.hide();
                        else if (oclientProxy && oclientProxy._pivotGrid._drillAction == "" && oclientProxy._pivotChart._drillAction == "" && !oclientProxy._pivotGrid._startDrilldown && !oclientProxy._pivotChart._startDrilldown && (oclientProxy._pivotGrid._JSONRecords != null || oclientProxy._pivotChart._JSONRecords == null))
                            oclientProxy._waitingPopup.hide();
                        else if (oclientProxy._pivotChart._startDrilldown && !oclientProxy._pivotGrid._startDrilldown && !$("#" + oclientProxy._id + "_maxView")[0])
                            oclientProxy._waitingPopup.show();
                        else if (!oclientProxy._pivotChart._startDrilldown && !oclientProxy._pivotGrid._startDrilldown && oclientProxy._pivotChart._drillAction == "" && oclientProxy._pivotGrid._drillAction == "" && (oclientProxy._pivotGrid._JSONRecords != null || oclientProxy._pivotChart._JSONRecords == null))
                            oclientProxy._waitingPopup.hide();
                    }
                    if (oclientProxy.model.displaySettings.mode == "chartonly")
                        oclientProxy._waitingPopup.hide();
                }
                else
                    this._waitingPopup.hide();
                if (typeof oclientProxy != 'undefined')
                    oclientProxy._pivotChart._startDrilldown = false;
            }
            catch (err) {
            }
            //var eventArgs = { "action": this._currentAction, "customObject": this.model.customObject, "element": this.element };
            this._trigger("renderSuccess", this);
        },

        renderChartFromJSON: function (jsonData) {
            this.setJSONRecords(JSON.stringify(jsonData));
            var chartSeries = new Array();
            if (jsonData == null || jsonData == "") {
                if (jsonData == "") {
                    var htmlTag = ej.buildTag("div#" + this._id + "Container")[0].outerHTML;
                    this.element.html(htmlTag);
                }
                chartSeries = [];
            }
            else if (jsonData != null && jsonData.chartLables.length > 0 && jsonData.points_Y.length > 0) {
                if (this.model.enableRTL) {
                    jsonData.chartLables = $.map(jsonData.chartLables, function (x) { return x.split("~~").reverse().join("~~"); });
                    jsonData.seriesNames = $.map(jsonData.seriesNames, function (x) { return x.split("~").reverse().join("~"); });
                }
                var seriesPoints = new Array(); var XValues = jsonData.chartLables; var tempArray = new Array();
                var YValues = new Array(); var pointsCount = pCnt = 0; var count = 0; var seriesName = new Array(); var points, measureRCnt = 0, chartLabels = [];
                measureRCnt = jsonData.measureInfo != "" ? parseInt(jsonData.measureInfo) : 0;
                var pivotChartObj = this;
                jQuery.each(jsonData.chartLables, function (index, value) {
                    var YPoints = new Array();
                    if (measureRCnt > 1 && jsonData.addInfo.action != "DrillChart" || (measureRCnt > 1 && jsonData.addInfo.levelHash == "1")) {
                        var lblVal = (((index + 1) * measureRCnt) - measureRCnt);
                        for (var mCnt = 0; mCnt < measureRCnt; mCnt++) {
                            if (jsonData.points_Y[(lblVal + mCnt)] != undefined && jsonData.chartLables[index] == jsonData.points_Y[(lblVal + mCnt)][0].Item1)
                                for (var i = 0; i < jsonData.points_Y[index].length; i++) {
                                    points = { "xValues": jsonData.chartLables[index], "yValues": (jsonData.points_Y[lblVal + mCnt][i].Item2).indexOf(",") > -1 ? ej.globalize.parseFloat(ej.globalize.format((jsonData.points_Y[lblVal + mCnt][i].Item2), "c", pivotChartObj.model.locale), pivotChartObj.model.locale) : (jsonData.points_Y[lblVal + mCnt][i].Item2) == "" ? 0 : ej.globalize.parseFloat((jsonData.points_Y[lblVal + mCnt][i].Item2)), "text": (jsonData.points_Y[lblVal + mCnt][i].Item2) == "" ? 0 : (jsonData.points_Y[lblVal + mCnt][i].Item2) };
                                    YPoints.push(points);
                                }
                        }
                    }
                    else
                        for (var i = 0; i < jsonData.points_Y[index].length; i++) {
                            if (pivotChartObj.model.analysisMode == ej.PivotChart.AnalysisMode.Olap && pivotChartObj.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                                if (pivotChartObj.seriesType() == "bubble")
                                    points = { "xValues": jsonData.chartLables[index], "yValues": (jsonData.points_Y[index])[i].Item2 == "" ? 0 : (jsonData.points_Y[index])[i].Item2, "size": (jsonData.points_Y[index])[i].Item2 == "" ? 0 : (jsonData.points_Y[index])[i].Item2 };
                                else
                                    points = { "xValues": jsonData.chartLables[index], "yValues": (jsonData.points_Y[index])[i].Item2.indexOf(",") > -1 ? ej.globalize.parseFloat(ej.globalize.format((jsonData.points_Y[index])[i].Item2, "c", pivotChartObj.model.locale), pivotChartObj.model.locale) : (jsonData.points_Y[index])[i].Item2 == "" ? 0 : ej.globalize.parseFloat((jsonData.points_Y[index])[i].Item2), "text": (jsonData.points_Y[index])[i].Item2 == "" ? 0 : (jsonData.points_Y[index])[i].Item2 };
                            }
                            else {
                                if (pivotChartObj.seriesType() == "bubble")
                                    points = { "xValues": jsonData.chartLables[index], "yValues": (jsonData.points_Y[index])[i] == "" ? 0 : (jsonData.points_Y[index])[i], "size": (jsonData.points_Y[index])[i] == "" ? 0 : (jsonData.points_Y[index])[i] };
                                else
                                    points = { "xValues": jsonData.chartLables[index], "yValues": (jsonData.points_Y[index])[i] == "" ? 0 : (jsonData.points_Y[index])[i] };
                            }
                            YPoints.push(points);
                        }
                    seriesPoints.push(YPoints);
                });

                if (measureRCnt > 1 && jsonData.addInfo.action != "DrillChart" || (measureRCnt > 1 && jsonData.addInfo.levelHash == "1"))
                    for (var mCnt = 0; mCnt < (measureRCnt * jsonData.seriesNames.length) ; mCnt++)
                        tempArray.push(new Array());
                else {
                    jQuery.each(jsonData.seriesNames, function (index, value) {
                        tempArray.push(new Array());
                    });
                }
                jQuery.each(jsonData.chartLables, function (index, value) {
                    for (var i = 0; i < seriesPoints[index].length; i++) {
                        tempArray[i].push((seriesPoints[index])[i]);
                    }
                });
                if (measureRCnt > 1 && jsonData.addInfo.action != "DrillChart" || (measureRCnt > 1 && jsonData.addInfo.levelHash == "1")) {
                    for (var index = 0; index < (measureRCnt * jsonData.seriesNames.length) ; index++) {
                        chartSeries[pCnt] = { dataSource: tempArray[index], xName: "xValues", yName: "yValues", name: jsonData.seriesNames[pointsCount] };
                        pointsCount++; pCnt++;
                        if (pointsCount == jsonData.seriesNames.length)
                            pointsCount = 0;
                    }
                }
                else {
                    if (this.seriesType() == "bubble") {
                        jQuery.each(jsonData.seriesNames, function (index, value) {
                            chartSeries[pointsCount] = { dataSource: tempArray[index], xName: "xValues", yName: "yValues", size: "size", name: jsonData.seriesNames[pointsCount] };
                            pointsCount++;
                        });
                        if (this.model.commonSeriesOptions.marker.dataLabel)
                            this.model.commonSeriesOptions.marker.dataLabel.visible = false;
                    }
                    else {
                        jQuery.each(jsonData.seriesNames, function (index, value) {
                            chartSeries[pointsCount] = { dataSource: tempArray[index], xName: "xValues", yName: "yValues", name: jsonData.seriesNames[pointsCount], marker: { dataLabel: { textMappingName: "text" } } };
                            pointsCount++;
                        });
                        if (this.model.commonSeriesOptions.marker.dataLabel)
                            this.model.commonSeriesOptions.marker.dataLabel.visible = false;
                    }
                }
                if (jsonData.chartLables.length > 10 && this.model.zooming == "")
                    this.model.zooming = { enable: true, type: 'x,y', enableMouseWheel: true };
                else if (jsonData.chartLables.length < 10 && this._initZooming == "")
                    this.model.zooming = this._initZooming;
                if (jQuery.inArray(this.seriesType(), ["line", "spline", "area", "splinearea", "stepline", "steparea", "stackingarea", "scatter"]) > -1 && !this.model.commonSeriesOptions.marker.visible)
                    this.model.commonSeriesOptions.marker = {
                        shape: ej.PivotChart.SymbolShapes.Circle,
                        size: { height: 12, width: 12 },
                        visible: true,
                        connectorLine: { height: 30, type: "line" },
                        dataLabel: { visible: false },
                        border: { width: 3, color: 'white' }
                    };
                else if ((this.seriesType() == "pie" || this.seriesType() == "doughnut")){
                    this.model.commonSeriesOptions.marker.visible = false;
                    if (this.model.commonSeriesOptions.marker.dataLabel)
                        this.model.commonSeriesOptions.marker.dataLabel.visible = false;
                }
                else if ((this.seriesType() == "pyramid" || this.seriesType() == "funnel")) {
                    this.model.commonSeriesOptions.marker = {
                        dataLabel: {
                            visible: true
                        }
                    };
                }
                else if (jQuery.inArray(this.seriesType(), ["column", "stackingcolumn", "bar", "stackingbar"]) > -1 && this.model.commonSeriesOptions.marker) {
                    if (this.model.commonSeriesOptions.marker.dataLabel)
                        this.model.commonSeriesOptions.marker.dataLabel.visible = false;
                    this.model.commonSeriesOptions.marker.visible = false;
                }
                if (this.model.crosshair.visible) {
                    this.model.commonSeriesOptions.tooltip.format = "#point.x# : #point.y#";
                }
                else {
                    if (this.model.enableRTL) {
                        this.model.commonSeriesOptions.tooltip = { visible: true, template: 'e-toolTip' };
                    }
                    else {
                        this.model.commonSeriesOptions.tooltip.format = (this._getLocalizedLabels("Measure")) + " : " + jsonData.measureNames + " <br/>" +
                                      (this._getLocalizedLabels("Column")) + " : #series.name# <br/>" +
                                      (this._getLocalizedLabels("Row")) + " : #point.x# <br/>" +
                                      (this._getLocalizedLabels("Value")) + " : #point.y#";
                    }
                }

                if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                    this.model.primaryYAxis.labelFormat = (this.model.primaryYAxis.labelFormat != null || this.model.primaryYAxis.labelFormat != "") && (this.model.primaryYAxis.labelFormat) ? this.model.primaryYAxis.labelFormat : (jsonData.labelFormat.indexOf("#") > -1 && jsonData.measureNames.indexOf("~") < 0) ? "Number" : (jsonData.labelFormat.toLowerCase().indexOf("percent") > -1 && jsonData.measureNames.indexOf("~") < 0) ? "{value}%" : (jsonData.labelFormat.toLowerCase().indexOf("currency") > -1 && jsonData.measureNames.indexOf("~") < 0) ? "Currency" : "";
                }

                if (this.model.zooming.enableScrollbar) {
                    if (ej.isNullOrUndefined(this.model.size.width)) this.model.size.width = "800px";
                    if (ej.isNullOrUndefined(this.model.size.height)) this.model.size.height = "400px";
                    var chartWidthPixel = this.model.size.width.indexOf("%") > -1 ? (this.element.width() * this.model.size.width.split("%")[0]) / 100 : this.model.size.width.split("px")[0];
                    var chartHeightPixel = this.model.size.height.indexOf("%") > -1 ? (this.element.height() * this.model.size.height.split("%")[0]) / 100 : this.model.size.height.split("px")[0];
                    var pointsPerFrame = (this.seriesType() == "bar" || this.seriesType() == "stackingbar") ? (chartHeightPixel / 100) * 6 : (chartWidthPixel / 100) * 3;
                    this.model.primaryXAxis.zoomFactor = pointsPerFrame / (jsonData.chartLables.length * jsonData.seriesNames.length);
                }
                else
                    this.model.primaryXAxis.zoomFactor = 1;
            }
            $("#" + this._id + "Container").ejChart({
                border: this.model.border,
                backGroundImageUrl: this.model.backGroundImageUrl,
                palette: this.model.palette,
                chartArea: this.model.chartArea,
                primaryXAxis: this.model.primaryXAxis,
                primaryYAxis: this.model.primaryYAxis,
                secondaryX: this.model.secondaryX,
                secondaryY: this.model.secondaryY,
                striplineDefault: this.model.striplineDefault,
                title: {
                    text: this.titleText(),
                    textAlignment: this.model.title.textAlignment,
                    font: {
                        color: this.model.title.color,
                        fontFamily: this.model.title.fontFamily,
                        fontWeight: this.model.title.fontWeight,
                        opacity: this.model.title.opacity,
                        size: this.model.title.size,
                        fontStyle: this.model.title.fontStyle
                    }
                },
                lineCap: this.model.lineCap,
                lineJoin: this.model.lineJoin,
                legendAlignment: this.model.legendAlignment,
                legendPosition: this.model.legendPosition,
                legend: this.model.legend,
                animation: this.model.animation,
                crosshair: this.model.crosshair,
                commonSeriesOptions: {
                    doughnutCoefficient: this.model.commonSeriesOptions.doughnutCoefficient,
                    explodeOffset: this.model.commonSeriesOptions.explodeOffset,
                    pyramidMode: this.model.commonSeriesOptions.pyramidMode,
                    gapRatio: this.model.commonSeriesOptions.gapRatio,
                    pieCoefficient: this.model.commonSeriesOptions.pieCoefficient,
                    doughnutSize: this.model.commonSeriesOptions.doughnutSize,
                    startAngle: this.model.commonSeriesOptions.startAngle,
                    xAxisName: this.model.commonSeriesOptions.xAxisName,
                    yAxisName: this.model.commonSeriesOptions.yAxisName,
                    explodeAll: this.model.commonSeriesOptions.explodeAll,
                    explodeIndex: this.model.commonSeriesOptions.explodeIndex,
                    tooltipOptions: this.model.commonSeriesOptions.tooltipOptions,
                    marker: this.model.commonSeriesOptions.marker || this.model.marker,
                    font: this.model.commonSeriesOptions.font,
                    type: this.seriesType(),
                    enableAnimation: this.model.commonSeriesOptions.enableAnimation,
                    style: this.model.commonSeriesOptions.style,
                    explode: this.model.commonSeriesOptions.explode,
                    labelPosition: this.model.commonSeriesOptions.labelPosition,
                    tooltip: this.model.commonSeriesOptions.tooltip,
                    zOrder: this.model.commonSeriesOptions.zOrder,
                    drawType: this.model.commonSeriesOptions.drawType,
                    isStacking: this.model.commonSeriesOptions.isStacking,
                    enableSmartLabels: this.model.commonSeriesOptions.enableSmartLabels
                },
                seriesStyle: this.model.seriesStyle,
                pointStyle: this.model.pointStyle,
                textStyle: this.model.textStyle,
                initSeriesRender: this.model.initSeriesRender,
                theme: this.model.theme,
                canResize: this.model.isResponsive,
                rotation: this.model.rotation,
                enable3D: this.model.enable3D,
                zooming: this.model.zooming,
                margin: this.model.margin,
                elementSpacing: this.model.elementSpacing,
                seriesColors: this.model.seriesColors,
                seriesBorderColors: this.model.seriesBorderColors,
                pointColors: this.model.pointColors,
                pointBorderColors: this.model.pointBorderColors,
                series: chartSeries,
                size: this.model.size,
                load: this.model.load,
                axesRangeCalculate: this.model.axesRangeCalculate,
                axesTitleRendering: this.model.axesTitleRendering,
                chartAreaBoundsCalculate: this.model.chartAreaBoundsCalculate,
                legendItemRendering: this.model.legendItemRendering,
                lengendBoundsCalculate: this.model.lengendBoundsCalculate,
                preRender: this.model.preRender,
                seriesRendering: this.model.seriesRendering,
                symbolRendering: this.model.symbolRendering,
                titleRendering: this.model.titleRendering,
                axesLabelsInitialize: this.model.axesLabelsInitialize,
                pointRegionMouseMove: this.model.pointRegionMouseMove,
                legendItemClick: this.model.legendItemClick,
                legendItemMouseMove: this.model.legendItemMouseMove,
                displayTextRendering: this.model.displayTextRendering,
                toolTipInitialize: this.model.toolTipInitialize,
                trackAxisToolTip: this.model.trackAxisToolTip,
                trackToolTip: this.model.trackToolTip,
                animationComplete: this.model.animationComplete,
                destroy: this.model.destroy,
                create: this.model.create,
                axesLabelRendering: ej.proxy(this._labelRenders, this),
                pointRegionClick: (typeof (oclientProxy) != "undefined" ? (!oclientProxy.model.enableDeferUpdate ? ej.proxy(this._seriesClick, this) : null) : ej.proxy(this._seriesClick, this)),
            });
            if (this.model.enableRTL && jsonData != null) {
                var toolTipInfo = ej.buildTag("div#e-toolTip.e-toolTip",
                   ej.buildTag("div.toolTipInfo",
                    ej.buildTag("div", jsonData.measureNames + " : " + (this._getLocalizedLabels("Measure")) + " <br/>")[0].outerHTML +
                    ej.buildTag("div", "#series.name#: " + (this._getLocalizedLabels("Row")) + " <br/>")[0].outerHTML +
                    ej.buildTag("div", "#point.x# : " + (this._getLocalizedLabels("Column")) + " <br/>")[0].outerHTML +
                    ej.buildTag("div", "#point.y# : " + (this._getLocalizedLabels("Value")))[0].outerHTML//,
                    ).addClass("e-rtl")[0].outerHTML, {
                        "display": "none", "width": "auto", "min-width": "200px",
                        "font-size": "12px", "padding": "2px 5px",
                        "background-color": "rgb(255, 255, 255)",
                        "border": "1px solid rgb(0, 0, 0)"
                    }
                 )[0].outerHTML
                $("#" + this._id).append(toolTipInfo);
            }
            $("#" + this._id + "progressContainer").hide();
            if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                if (jsonData != null && jsonData != "") {
                    this._labelCurrentTags.splice(0, this._labelCurrentTags.length);
                    var pivotChartObj = this;
                    jQuery.each(jsonData.labelTags, function (index, value) {
                        var currentTag = new Object();
                        var splitData = value.split("::");
                        currentTag = { "name": splitData[2], "state": splitData[splitData.length - 1], "tag": value };
                        pivotChartObj._labelCurrentTags.push(currentTag);
                    });
                    jQuery.each(this._labelCurrentTags, function (index, value) {
                        if (value.name == pivotChartObj._selectedItem && pivotChartObj._drillAction == "drillup") {
                            pivotChartObj._selectedTagInfo = pivotChartObj._labelCurrentTags[index].tag;
                            return false;
                        }
                    });
                }
            }
            if (this._waitingPopup != null)
                this._waitingPopup.hide();
            if (typeof (oclientProxy) != "undefined" && !ej.isNullOrUndefined(oclientProxy) && oclientProxy.model.isResponsive)
                $("#" + this._id + "Container").width('100%');           
        },

        _labelRenders: function (args) {
            this._trigger("axesLabelRendering", args);
            if ((args.data.axis.orientation.toLowerCase() == "horizontal" && args.data.label.Text != undefined) || ((this.seriesType() == "bar" || this.seriesType() == "stackingbar") && args.data.axis.orientation.toLowerCase() == "vertical" && args.data.label.Text != undefined)) {
                var splitName = this.model.enableRTL ? args.data.label.Text.toString().split("~~").reverse(): args.data.label.Text.toString().split("~~");
                if (this._tagCollection.length == 0)
                    args.data.label.Text = splitName[splitName.length - 1];
                else if (this._drillAction == "drilldown" && splitName.indexOf(this._selectedItem) + 1 < splitName.length)
                    args.data.label.Text = splitName[splitName.indexOf(this._selectedItem) + 1];
                else if (this._drillAction == "drilldown" && splitName.indexOf(this._selectedItem) + 1 >= splitName.length)
                    args.data.label.Text = splitName[splitName.indexOf(this._selectedItem)];
                else if (splitName.length == 1)
                    args.data.label.Text = splitName[0];
                else if (this._drillAction == "drillup")
                    args.data.label.Text = splitName[this._selectedIndex];
                else
                    args.data.label.Text = splitName[splitName.length - 1];
            }
        },

        _reSizeHandler: function (args) {
            var chart_resize = this.element.find("#" + this._id + "Container").height(this.element.height()).width(this.element.width()).data("ejChart");
            chart_resize.redraw();
        },

        _getLocalizedLabels: function (property) {
            return ej.PivotChart.Locale[this.locale()][property] === undefined ? ej.PivotChart.Locale["en-US"][property] : ej.PivotChart.Locale[this.locale()][property];
        },

        _onPreventPanelClose: function (e) {
            $('body').find("#preventDiv").remove();
            if ($(".e-pivotgrid").data("ejWaitingPopup") && !(!ej.isNullOrUndefined(e) && ($(e.target).hasClass("pivotTree") || $(e.target).hasClass("pivotTreeContext") || $(e.target).hasClass("pivotTreeContextMenu"))))
                $(".e-pivotgrid").data("ejWaitingPopup").hide()
        },

        _seriesClick: function (sender) {
            this.element.find("#" + this._id + "ExpandMenu, .expandMenu, .e-dialog").remove();
            var selectedLabel, menuList = new Array(), chartOffset = this.element.position(), me = this;
            var pivotChartObj = this;
            if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                var tempLabel; var pointIndex;
                this._selectedTags = [];
                if (sender.data.region != null && sender.data.region != undefined) {
                    var labels = this.model.enableRTL ? $.map(sender.model.primaryXAxis.labels, function (x) { return x.split("~~").reverse().join("~~"); }) : sender.model.primaryXAxis.labels;
                    selectedLabel = labels[sender.data.region.Region.PointIndex];
                    pointIndex = sender.data.region.Region.PointIndex;
                }
                else if (sender.data.point.x != null && sender.data.point.x != undefined && sender.data.point.x != "") {
                    var labels = this.model.enableRTL ? $.map(sender.data.series.xAxis.labels, function (x) { return x.split("~~").reverse().join("~~"); }) : sender.data.series.xAxis.labels;
                    selectedLabel = labels[sender.data.point.X];
                    pointIndex = sender.data.point.X;
                }
                if ($($("#" + this._id + "Container_vml_XAxisLabels_0")[0]).children()[pointIndex] != undefined)
                    tempLabel = $($("#" + this._id + "Container_vml_XAxisLabels_0")[0]).children()[pointIndex].innerHTML;
                else if ($("#" + this._id + "Container_svg_XAxisLabels_0").children()[pointIndex])
                    tempLabel = $("#" + this._id + "Container_svg_XAxisLabels_0").children()[pointIndex].textContent;
                else if (this.seriesType() == "bar" || this.seriesType() == "stackingbar") {
                    if ($($("#" + this._id + "Container_vml_YAxisLabels_0")[0]).children()[pointIndex] != undefined)
                        tempLabel = $($("#" + this._id + "Container_vml_YAxisLabels_0")[0]).children()[pointIndex].innerHTML;
                    else if ($("#" + this._id + "Container_svg_YAxisLabels_0").children()[pointIndex])
                        tempLabel = $("#" + this._id + "Container_svg_YAxisLabels_0").children()[pointIndex].textContent;
                    else {
                        var temp = sender.model.primaryXAxis.labels[pointIndex].split("~~");
                        tempLabel = temp[temp.length - 1];
                    }
                }
                else {
                    var temp = sender.model.primaryXAxis.labels[pointIndex].split("~~");
                    tempLabel = temp[temp.length - 1];
                }
                if (tempLabel) {
                    $("#" + this._id).find("#" + this._id + "ExpandMenu, .expandMenu, .e-dialog").remove();
                    var splitLabel = selectedLabel.split("~~");

                    jQuery.each(splitLabel, function (index, value) {
                        jQuery.each(pivotChartObj._labelCurrentTags, function (key, val) {
                            if ($.trim(value) == val.name) {
                                pivotChartObj._selectedTags.push(val);
                                return false;
                            }
                        });
                    });

                    jQuery.each(this._selectedTags, function (index, value) {
                        if (value.state > 1)
                            if (me.model.enableRTL)
                                menuList.push($(ej.buildTag("li.menuList", value.name + " - " + (pivotChartObj._getLocalizedLabels("Expand")))[0]).attr("role", "presentation")[0].outerHTML);
                            else
                                menuList.push($(ej.buildTag("li.menuList", (pivotChartObj._getLocalizedLabels("Expand")) + " - " + value.name)[0]).attr("role", "presentation")[0].outerHTML);
                    });
                    jQuery.each(this._selectedTags, function (index, value) {
                        for (var label = 0; label < selectedLabel.split("~~").length - 1; label++) {
                            if ((selectedLabel.split("~~")[label] == value.name) && value.state == 1)
                                if (me.model.enableRTL)
                                    menuList.push($(ej.buildTag("li.menuList", value.name + " - " + (pivotChartObj._getLocalizedLabels("Collapse")))[0]).attr("role", "presentation")[0].outerHTML);
                                else
                                    menuList.push($(ej.buildTag("li.menuList", (pivotChartObj._getLocalizedLabels("Collapse")) + " - " + selectedLabel.split("~~")[label])[0]).attr("role", "presentation")[0].outerHTML);
                        }
                    });
                }
            }
            else {
                selectedLabel = (sender.data.region != null && sender.data.region != undefined) ? sender.model.primaryXAxis.labels[sender.data.region.Region.PointIndex] : sender.data.series.xAxis.labels[sender.data.point.X];
                if (!ej.isNullOrUndefined(this._labelCurrentTags.collapsedMembers)) {
                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap) {
                        var memberNames = selectedLabel.split(" ~ ");
                        if (this.model.dataSource.values[0].axis == ej.olap.AxisName.Row) {
                            var measureNames = $.map(this.model.dataSource.values[0].measures, function (item) { return item.fieldName });
                            if ($.inArray(memberNames[memberNames.length - 1], measureNames) >= 0)
                                memberNames.splice(memberNames.length - 1, 1);
                        }
                        this._selectedSeriesInfo = new Array();
                        for (var i = 0; i < memberNames.length; i++) {
                            if ($(this.getJSONRecords().seriesTags).filter(function (index, item) { return item.split('::')[2] == memberNames[i] }).length > 0) this._selectedSeriesInfo.push($(this.getJSONRecords().seriesTags).filter(function (index, item) { return item.split('::')[2] == memberNames[i] })[0]);
                            if ($.inArray(memberNames[i], this._labelCurrentTags.collapsedMembers) >= 0) {
                                if (me.model.enableRTL)
                                    menuList.push($(ej.buildTag("li.menuList",  memberNames[i] +" - " +(this._getLocalizedLabels("Expand")) )[0]).attr("role", "presentation")[0].outerHTML);
                                else
                                    menuList.push($(ej.buildTag("li.menuList", (this._getLocalizedLabels("Expand")) + " - " + memberNames[i])[0]).attr("role", "presentation")[0].outerHTML);
                            }
                        }
                    }
                    else {
                        if ($.inArray(selectedLabel, this._labelCurrentTags.collapsedMembers) >= 0)
                            if (me.model.enableRTL)
                                menuList.push($(ej.buildTag("li.menuList", selectedLabel + " - " + (this._getLocalizedLabels("Expand")))[0]).attr("role", "presentation")[0].outerHTML);
                            else
                                menuList.push($(ej.buildTag("li.menuList", (this._getLocalizedLabels("Expand")) + " - " + selectedLabel)[0]).attr("role", "presentation")[0].outerHTML);
                    }
                }
                if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) {
                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap) {
                        for (var j = 0; j < this._labelCurrentTags.expandedMembers.length; j++) {
                            if (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers[j])) {
                                for (var i = 0; i < this._labelCurrentTags.expandedMembers[j].length; i++) {
                                    if (me.model.enableRTL)
                                        menuList.push($(ej.buildTag("li.menuList", this._labelCurrentTags.expandedMembers[j][i].split('::')[2] + " - " + (this._getLocalizedLabels("Collapse")))[0]).attr("role", "presentation")[0].outerHTML);
                                    else
                                        menuList.push($(ej.buildTag("li.menuList", (this._getLocalizedLabels("Collapse")) + " - " + this._labelCurrentTags.expandedMembers[j][i].split('::')[2])[0]).attr("role", "presentation")[0].outerHTML);
                                }
                            }
                        }
                    }
                    else {
                        for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++) {
                            if (me.model.enableRTL)
                                menuList.push($(ej.buildTag("li.menuList", this._labelCurrentTags.expandedMembers[i] + " - " + (this._getLocalizedLabels("Collapse")))[0]).attr("role", "presentation")[0].outerHTML);
                            else
                                menuList.push($(ej.buildTag("li.menuList", (this._getLocalizedLabels("Collapse")) + " - " + this._labelCurrentTags.expandedMembers[i])[0]).attr("role", "presentation")[0].outerHTML);
                        }
                    }
                }                
            }
            if (menuList.length > 0) {
                menuList.push($(ej.buildTag("li.menuList", this._getLocalizedLabels("Exit"))[0]).attr("role", "presentation")[0].outerHTML);
                var expandMenu = $(ej.buildTag("div#" + this._id + "ExpandMenu.expandMenu", menuList)[0]).attr("role", "presentation")[0].outerHTML;
                $(expandMenu).ejDialog({ width: "auto", target: "#" + this._id, enableResize: false, enableRTL: this.model.enableRTL });
                $("#" + this._id + "ExpandMenu_wrapper").appendTo(this.element).css({ "left": sender.data.location.x + 8 + chartOffset.left, "top": sender.data.location.y + 8 + chartOffset.top, "min-height": navigator.userAgent.toLowerCase().indexOf('webkit') > 0 ? "initial" : "auto" });
                $("#" + this._id + "ExpandMenu").css({ "min-height": navigator.userAgent.toLowerCase().indexOf('webkit') > 0 ? "initial" : "auto" });
            }
            this.element.find(".e-titlebar, .e-header").remove();
            this._trigger("pointRegionClick", sender);
        },

        exportPivotChart: function (exportOption, fileName, exportFormat) {
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version <= 8) return;
            if (ej.isNullOrUndefined(fileName) || fileName == "") fileName = "Sample";
            var chartObj = $("#" + this._id + "Container").data("ejChart");
            var zoomFactor = chartObj.model.primaryXAxis.zoomFactor;
            chartObj.model.primaryXAxis.zoomFactor = 1;
            chartObj.model.enableCanvasRendering = true;
            chartObj.redraw();
            var canvasElement = chartObj["export"]();
            var chartString = canvasElement.toDataURL("image/png");
            chartObj.model.primaryXAxis.zoomFactor = zoomFactor;
            chartObj.model.enableCanvasRendering = false;
            chartObj.redraw();
            var bgColor = $(this.element).css('background-color') != "" ? $(this.element).css('background-color') : "rgb(255, 255, 255)";
            var exportSetting = { url: "", fileName: "PivotChart", exportMode: ej.PivotChart.ExportMode.ClientMode, title: "", description: "" };
            this._trigger("beforeExport", exportSetting);
            if (exportSetting.exportMode == ej.PivotChart.ExportMode.ClientMode) {
                var params = {
                    args: JSON.stringify({
                        fileName: ej.isNullOrUndefined(fileName) ? (ej.isNullOrUndefined(exportSetting.fileName) ? "PivotChart" : exportSetting.fileName) : fileName,
                        chartdata: chartString.split(',')[1],
                        bgColor: bgColor,
                        exportFormat: exportFormat,
                        title: exportSetting.title,
                        description: exportSetting.description
                    })
                };
                if (ej.raiseWebFormsServerEvents) {
                    var serverArgs = { model: this.model, originalEventType: exportOption };
                    var clientArgs = params;
                    ej.raiseWebFormsServerEvents(exportOption, serverArgs, clientArgs);
                    setTimeout(function () {
                        ej.isOnWebForms = true;
                    }, 1000);
                }
                else
                    this.doPostBack(exportOption, params);
            }
            else {
                var params = {
                    args: JSON.stringify({
                        exportOption: exportOption,
                        chartdata: chartString.split(',')[1],
                        bgColor: bgColor,
                        title: exportSetting.title,
                        description: exportSetting.description
                    })
                };
                this.doPostBack($.trim(exportSetting.url) != "" ? exportSetting.url : this.model.url + "/" + this.model.serviceMethodSettings.exportPivotChart, params);
            }            
        },

        doAjaxPost: function (type, url, data, onSuccess, onComplete, customArgs) {
            var contentType, dataType, successEvt, isAsync = true;
            if ((data["XMLA"] == undefined))
                contentType = 'application/json; charset=utf-8', dataType = 'json', successEvt = $.proxy(onSuccess, this);
            else
                contentType = 'text/xml', dataType = 'xml', data = data["XMLA"], successEvt = $.proxy(onSuccess, ej.olap.base, customArgs), isAsync = (ej.browserInfo().name == "msie" && ej.browserInfo().version <= 9) ? false : true;
            $.ajax({
                type: type,
                url: url,
                data: data,
                async: isAsync,
                contentType: contentType,
                dataType: dataType,
                success: successEvt,
                complete: ej.proxy(function () {
                    var eventArgs = { "action": this._currentAction, "customObject": this.model.customObject, "element": this.element };
                    this._trigger("renderComplete", eventArgs);
                }, this),
                error: ej.proxy(function (msg, textStatus, errorThrown) {
                    if (typeof this._waitingPopup != 'undefined' && this._waitingPopup != null)
                        this._waitingPopup.hide();
                    if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                        oclientWaitingPopup.hide();
                    var eventArgs = { "action": this._currentAction, "customObject": this.model.customObject, "element": this.element, "Message": msg };
                    this._trigger("renderFailure", eventArgs);
                    this.renderChartFromJSON("");
                }, this)
            });
        },

        doPostBack: function (url, params) {
            var form = $('<form>').attr({ 'action': url, 'method': 'POST', 'name': 'export' });
            var addParam = function (paramName, paramValue) {
                var input = $('<input type="hidden" title="params">').attr({
                    'id': paramName,
                    'name': paramName,
                    'value': paramValue
                }).appendTo(form);
            };
            for (var item in params)
                addParam(item, params[item]);
            form.appendTo(document.body).submit().remove();
                    }
            });

    ej.PivotChart.Locale = {};

    ej.PivotChart.Locale["en-US"] = {
        Measure: "Measure",
        Row: "Row",
        Column: "Column",
        Value: "Value",
        Expand: "Expand",
        Collapse: "Collapse",
        Exit: "Exit"
    };

    ej.PivotChart.ChartTypes = {
        Line: 'line', Spline: 'spline', Column: 'column', Area: 'area', SplineArea: 'splinearea', StepLine: 'stepline', StepArea: 'steparea', Pie: 'pie', Bar: 'bar', StackingArea: 'stackingarea', StackingColumn: 'stackingcolumn', StackingBar: 'stackingbar', Pyramid: 'pyramid', Funnel: 'funnel', Doughnut: 'doughnut', Scatter: 'scatter', Bubble: 'bubble', WaterFall: 'waterfall'
    };

    ej.PivotChart.ExportOptions = {
        Excel: 'excel',
        Word: 'word',
        PDF: 'pdf',
        CSV: 'csv',
        PNG: 'png',
        JPG: 'jpg',
        EMF: 'emf',
        GIF: 'gif',
        BMP: 'bmp'
    };

    ej.PivotChart.SymbolShapes = {
        None: "none",
        LeftArrow: "leftarrow",
        RightArrow: "rightarrow",
        Circle: "circle",
        Cross: "cross",
        HorizLine: "horizline",
        VertLine: "vertline",
        Diamond: "diamond",
        Rectangle: "rectangle",
        Triangle: "triangle",
        InvertedTriangle: "invertedtriangle",
        Hexagon: "hexagon",
        Pentagon: "pentagon",
        Star: "star",
        Ellipse: "ellipse",
        Wedge: "wedge",
        Trapezoid: "trapezoid",
        UpArrow: "uparrow",
        DownArrow: "downarrow",
        Image: "image"
    };

    ej.PivotChart.AnalysisMode = {
        Olap: "olap",
        Pivot: "pivot"
    };

    ej.PivotChart.OperationalMode = {
        ClientMode: "clientmode",
        ServerMode: "servermode"
    };
    ej.PivotChart.ExportMode = {
        ClientMode: "clientmode",
        ServerMode: "servermode"
    };
})(jQuery, Syncfusion);;

});