/*!
*  filename: ej.pivotchart.js
*  version : 14.2.0.26
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.globalize","./../common/ej.core","./../common/ej.data","./../common/ej.touch","./../common/ej.draggable","./../common/ej.scroller","./ej.dialog","./ej.waitingpopup","./../datavisualization/ej.chart"], fn) : fn();
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
                exportPivotChart: "Export"
            },
            dataSource: {
                data: null,
                columns: [],
                cube: "",
                catalog: "",
                rows: [],
                values: [],
                filters: []
            },
            locale: "en-US",
            drillSuccess: null,
            load: null,
            beforeServiceInvoke: null,
            afterServiceInvoke: null,
            renderComplete: null,
            renderFailure: null,
            renderSuccess: null
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

        _init: function () {
            this._initPrivateProperties();
            this._load();
        },

        _destroy: function () {
            this._pivotEngine = null;
            this.element.empty().removeClass("e-pivotchart" + this.model.cssClass);
            if (this.ochartWaitingPopup != undefined)
                this.ochartWaitingPopup._destroy();
        },

        _initPrivateProperties: function () {
            this._id = this.element.attr("id");
            ochartProxy = this;
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
            ochartWaitingPopup = null;
            ochartProgressBar = null;
            oChartTimer = null;
        },

        _load: function () {
            var eventArgs = { action: "initialize", element: this.element, customObject: this.model.customObject };
            this._trigger("load", eventArgs);
            this.element.addClass(this.model.cssClass);
            if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null) {
                this.model.customObject = oclientProxy.model.customObject;
                if ($("#" + oclientProxy._id + "_maxView")[0]) {
                    $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                }
                else
                    oclientWaitingPopup.show();
            }
            else {
                this.element.ejWaitingPopup({ showOnInit: true });
                ochartWaitingPopup = this.element.data("ejWaitingPopup");
            }
            if (this.model.zooming != "")
                this._initZooming = true;
            if ((this.model.dataSource.data == null && this.model.url != "") || (this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode)) {
                this.model.operationalMode = ej.PivotChart.OperationalMode.ServerMode;
                if (this.model.beforeServiceInvoke != null)
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
                if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                    var data = ej.PivotAnalysis.pivotEnginePopulate(this.model);
                    this._pivotEngine = data.pivotEngine;
                    this._generateData(data.pivotEngine);
                }
                else
                    ej.olap.base.getJSONData({ action: "initialLoad" }, this.model.dataSource, this);
            }
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
            window.clearInterval(oChartTimer);
            this._on(this.element, "click", ".menuList", function (evt) {
                this._curFocus = null;
                ochartWaitingPopup = this.element.data("ejWaitingPopup");
                if (evt.target.innerHTML == ochartProxy._getLocalizedLabels("Exit")) {
                    this.element.find("#" + ochartProxy._id + "ExpandMenu, .expandMenu, .e-dialog").remove();
                }
                else if (evt.target.innerHTML.indexOf(ochartProxy._getLocalizedLabels("Expand")) > -1) {
                    this._drillAction = "drilldown";
                    if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null) {
                        if ($("#" + oclientProxy._id + "_maxView")[0])
                            $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                        else
                            oclientWaitingPopup.show();
                    }
                    else {
                        ochartWaitingPopup.show();
                    }
                    if (this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode) {
                        var selectedMember = this.model.enableRTL ? evt.target.innerHTML.split(" - ")[0] : evt.target.innerHTML.split(" - ")[1];
                        if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                            if (ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) this._labelCurrentTags["expandedMembers"] = new Array();
                            this._labelCurrentTags.expandedMembers.push(selectedMember);
                            var clonedEngine = this._cloneEngine(this._pivotEngine);
                            for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++)
                                this._cropData(clonedEngine, this._labelCurrentTags.expandedMembers[i], 0, true);
                            this._generateData(clonedEngine);
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
                            ej.olap._mdxParser.updateDrilledReport({ uniqueName: memberInfo, seriesInfo: this._selectedSeriesInfo, uniqueNameArray: uniqueNameArray }, "rowheader", this);
                        }
                    }
                    else {
                        if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                            var selectedMember = this.model.enableRTL ? evt.target.innerHTML.split(" - ")[0] : evt.target.innerHTML.split(" - ")[1];
                            if (ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) this._labelCurrentTags["expandedMembers"] = new Array();
                            this._labelCurrentTags.expandedMembers.push(selectedMember);
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drilledSeries": JSON.stringify(this._labelCurrentTags.expandedMembers) }), this.renderControlSuccess);
                        }
                        else {
                            if (!this._isDrilled) {
                                this._isDrilled = true;
                                jQuery.each(evt.target.parentElement.children, function (index, value) {
                                    if (value.innerHTML == evt.target.innerHTML)
                                        ochartProxy._dimensionIndex = index;
                                });
                            }
                            var report = this.getOlapReport();
                            this._drillAction = "drilldown";
                            if (this.model.enableRTL)
                                this._selectedItem = $.trim(evt.target.innerHTML.replace(" - " + this._getLocalizedLabels("Expand"), ""));
                            else
                                this._selectedItem = $.trim(evt.target.innerHTML.replace(this._getLocalizedLabels("Expand") + " - ", ""));
                            jQuery.each(this._labelCurrentTags, function (index, value) {
                                if (value.name == ochartProxy._selectedItem) {
                                    ochartProxy._tagCollection = [];
                                    ochartProxy._tagCollection = ochartProxy._selectedTags.slice();
                                    ochartProxy._selectedTagInfo = value.tag;
                                    ochartProxy._selectedMenuItem = value.name;
                                    return false;
                                }
                            });
                            this._startDrilldown = true;
                            if (this.model.beforeServiceInvoke != null)
                                this._trigger("beforeServiceInvoke", { action: this._drillAction, element: this.element, customObject: this.model.customObject });
                            var serializedCustomObject = JSON.stringify(this.model.customObject);
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
                    if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null) {
                        if ($("#" + oclientProxy._id + "_maxView")[0])
                            $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                        else
                            oclientWaitingPopup.show();
                    }
                    else {
                        ochartWaitingPopup.show();
                    }
                    if (this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode) {
                        var selectedMember = this.model.enableRTL ? evt.target.innerHTML.split(" - ")[0] : evt.target.innerHTML.split(" - ")[1];
                        if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                            var flag = false, tempArray = new Array();
                            jQuery.map(this._labelCurrentTags.expandedMembers, function (member) {
                                if (member == selectedMember) flag = true;
                                if (!flag) tempArray.push(member);
                            });
                            this._labelCurrentTags.expandedMembers = tempArray;
                            var clonedEngine = this._cloneEngine(this._pivotEngine);
                            for (var i = 0; i < this._labelCurrentTags.expandedMembers.length; i++)
                                this._cropData(clonedEngine, this._labelCurrentTags.expandedMembers[i], 0, true);
                            this._generateData(clonedEngine);
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
                            ej.olap._mdxParser.updateDrilledReport({ uniqueName: memberInfo, seriesInfo: this._selectedSeriesInfo, uniqueNameArray: uniqueNameArray, action: "collapse" }, "rowheader", this);
                        }
                    }
                    else {
                        if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                            var selectedMember = this.model.enableRTL ? evt.target.innerHTML.split(" - ")[0] : evt.target.innerHTML.split(" - ")[1];
                            var flag = false, tempArray = new Array();
                            jQuery.map(this._labelCurrentTags.expandedMembers, function (member) {
                                if (member == selectedMember) flag = true;
                                if (!flag) tempArray.push(member);
                            });
                            this._labelCurrentTags.expandedMembers = tempArray;
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drilledSeries": JSON.stringify(this._labelCurrentTags.expandedMembers) }), this.renderControlSuccess);
                        }
                        else {
                            var report = this.getOlapReport();
                            this._drillAction = "drillup";
                            if (this.model.enableRTL)
                                this._selectedItem = $.trim(evt.target.innerHTML.replace(" - " + this._getLocalizedLabels("Collapse"), ""));
                            else
                                this._selectedItem = $.trim(evt.target.innerHTML.replace(this._getLocalizedLabels("Collapse") + " - ", ""));
                            ochartProxy._tagCollection = [];
                            ochartProxy._tagCollection = ochartProxy._selectedTags.slice();
                            jQuery.each(ochartProxy._tagCollection, function (index, value) {
                                if (value.name == ochartProxy._selectedItem) {
                                    ochartProxy._selectedIndex = index;
                                    ochartProxy._selectedTagInfo = value.tag;
                                    ochartProxy._tagCollection.splice(index, ochartProxy._tagCollection.length);
                                    return false;
                                }
                            });
                            if (ochartProxy._tagCollection.length == 0)
                                this._isDrilled = false;
                            this._startDrilldown = true;
                            if (this.model.beforeServiceInvoke != null)
                                this._trigger("beforeServiceInvoke", { action: this._drillAction, element: this.element, customObject: this.model.customObject });
                            var serializedCustomObject = JSON.stringify(this.model.customObject);
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
                $(window).bind('resize', $.proxy(this._reSizeHandler, this));
        },

        _unWireEvents: function () {
            this._off($(document), 'keydown', this._keyDownPress);
            $(document.body).unbind("click");
            this._off(this.element, "click", ".menuList");
            $(window).unbind('resize', $.proxy(this._reSizeHandler, this));
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
            var rowCount = pivotEngine[0].length;
            var summaryColumns = new Array();
            var summaryRows = new Array();

            if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot)
                var rowHeaderWidth = (!ej.isNullOrUndefined(this._labelCurrentTags.expandedMembers)) ? this.model.dataSource.rows.length - this._labelCurrentTags.expandedMembers.length : this.model.dataSource.rows.length;
            else
                var rowHeaderWidth = this.model.dataSource.rows.length + (this.model.dataSource.values[0].axis == "rows" ? 1 : 0);

            var columnHeaderHeight = this.model.dataSource.columns.length + ((this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot || this.model.dataSource.values[0].axis == "columns") ? 1 : 0);

            //Getting Series Labels
            for (var i = rowHeaderWidth; i < columnCount; i++) {
                var seriesName = "";
                var isSummary = false;
                for (var j = 0; j < columnHeaderHeight; j++) {
                    if (pivotEngine[i][j].CSS.indexOf("summary") >= 0) {
                        isSummary = true;
                        summaryColumns.push(i);
                        break;
                    }
                    seriesName += (seriesName == "" ? "" : " - ") + pivotEngine[i][j].Value;
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
                                    pointsArray.push(pivotEngine[j][i].Value == "" ? 0 : ej.parseFloat(pivotEngine[j][i].Value));
                            }
                            chartData.points_Y.push(pointsArray);
                        }
                    }
                }
                else if (pivotEngine[0][i].CSS == "rowheader") {
                    for (var j = pivotEngine[0][0].ColSpan; j < columnCount; j++) {
                        if ($.inArray(j, summaryColumns) < 0)
                            pointsArray.push(this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap ? (pivotEngine[j][i].Value == "" ? 0 : ej.parseFloat(pivotEngine[j][i].Value)) : pivotEngine[j][i].Value);
                    }
                    chartData.points_Y.push(pointsArray);
                }
            }

            //Getting Value Names
            var measureNames = $(this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap ? this.model.dataSource.values[0].measures : this.model.dataSource.values).map(function (index, item) { return item.fieldName });
            for (var i = 0; i < measureNames.length; i++)
                chartData.measureNames += chartData.measureNames == "" ? measureNames[i] : "~" + measureNames[i];
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

        renderControlSuccess: function (msg) {
            ochartProxy = this;
            if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                if ($("#" + oclientProxy._id + "_maxView")[0])
                    $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                else
                    oclientWaitingPopup.show();
            try {
                if (msg[0] != undefined) {
                    ochartProxy.setJSONRecords(msg[0].Value); ochartProxy.setOlapReport(msg[1].Value);
                    if (msg[2].Key == "AnalysisMode" && msg[2].Value == "Olap") ochartProxy.model.analysisMode = ej.PivotChart.AnalysisMode.Olap;
                    if (typeof (oclientProxy) != "undefined") {
                        oclientProxy.currentReport = msg[1].Value;
                        if (msg[2] != null && msg[2] != undefined && msg[2].Key == "ClientReports")
                            oclientProxy.reports = msg[2].Value;
                    }
                    if (msg[2] != null && msg[2] != undefined && !msg[2].Key == "ClientReports")
                        ochartProxy.model.customObject = msg[2].Value;
                }
                else if (msg.d != undefined) {
                    ochartProxy.setJSONRecords(msg.d[0].Value); ochartProxy.setOlapReport(msg.d[1].Value);
                    if (msg.d[2].Key == "AnalysisMode" && msg.d[2].Value == "Olap") ochartProxy.model.analysisMode = ej.PivotChart.AnalysisMode.Olap;
                    if (typeof (oclientProxy) != "undefined") {
                        oclientProxy.currentReport = msg.d[1].Value;
                        if (msg.d[2] != null && msg.d[2] != undefined && msg.d[2].Key == "ClientReports")
                            oclientProxy.reports = msg.d[2].Value;
                    }
                    if (msg.d[2] != null && msg.d[2] != undefined && !(msg.d[2].Key == "ClientReports"))
                        ochartProxy.model.customObject = msg.d[2].Value;
                }
                else {
                    ochartProxy.setJSONRecords(msg.JsonRecords); ochartProxy.setOlapReport(msg.OlapReport);
                    if (msg.AnalysisMode == "Olap") ochartProxy.model.analysisMode = ej.PivotChart.AnalysisMode.Olap;
                    if (msg.customObject != null && msg.customObject != null)
                        ochartProxy.model.customObject = msg.customObject;
                    if (typeof (oclientProxy) != "undefined") {
                        if (typeof (oclientProxy.currentReport) != "undefined")
                            oclientProxy.currentReport = msg.OlapReport;
                        if (typeof (oclientProxy.reports) != "undefined" && msg.reports != undefined && msg.reports != "undefined")
                            oclientProxy.reports = msg.reports;
                    }
                }
                if (ochartProxy.model.afterServiceInvoke != null) {
                    var eventArgs;
                    if (ochartProxy._drillAction != "")
                        eventArgs = { action: ochartProxy._drillAction, element: ochartProxy.element, customObject: ochartProxy.model.customObject };
                    else
                        eventArgs = { action: ochartProxy._currentAction, element: ochartProxy.element, customObject: ochartProxy.model.customObject };
                    ochartProxy._trigger("afterServiceInvoke", eventArgs);
                }
                $("#" + ochartProxy._id + "Container").ejChart('destroy');
                var htmlTag = ej.buildTag("div#" + ochartProxy._id + "Container", "", { "height": (typeof (oclientProxy) != "undefined") ? oclientProxy._chartHeight : this.element.height(), "width": (typeof (oclientProxy) != "undefined") ? oclientProxy._chartWidth : this.element.width() })[0].outerHTML;
                ochartProxy.element.html(htmlTag);
                if (ochartProxy.model.commonSeriesOptions.type == ej.PivotChart.ChartTypes.Funnel || ochartProxy.model.commonSeriesOptions.type == ej.PivotChart.ChartTypes.Pyramid)
                    ochartProxy.model.legend.toggleSeriesVisibility = false;
                else
                    ochartProxy.model.legend.toggleSeriesVisibility = true;
                ochartProxy.renderChartFromJSON(ochartProxy.getJSONRecords());
                ochartProxy._unWireEvents();
                ochartProxy._wireEvents();
                if (ochartProxy._drillAction != "") {
                    ochartProxy.model.currentReport = ochartProxy.getOlapReport();
                    ochartProxy._trigger("drillSuccess", ochartProxy.element);
                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                        if (this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode) {
                            var chartData = ochartProxy.getJSONRecords();
                            if (ochartProxy.model.dataSource.rows.length - ochartProxy._labelCurrentTags.expandedMembers.length > 1) {
                                ochartProxy._labelCurrentTags["collapsedMembers"] = new Array();
                                for (var i = 0; i < chartData.chartLables.length; i++)
                                    ochartProxy._labelCurrentTags["collapsedMembers"].push(chartData.chartLables[i]);
                            }
                        }
                        else {
                            var chartData = ochartProxy.getJSONRecords();
                            var rows = JSON.parse(JSON.parse(ochartProxy.getOlapReport()).rows);
                            ochartProxy._labelCurrentTags["collapsedMembers"] = new Array();
                            if (rows.length - ochartProxy._labelCurrentTags.expandedMembers.length > 1) {
                                for (var i = 0; i < chartData.chartLables.length; i++)
                                    ochartProxy._labelCurrentTags["collapsedMembers"].push(chartData.chartLables[i]);
                            }
                        }
                    }
                }
                else {
                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Pivot) {
                        if (this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode) {
                            var chartData = ochartProxy.getJSONRecords();
                            ochartProxy._labelCurrentTags = { collapsedMembers: [] };
                            if (ochartProxy.model.dataSource.rows.length > 1) {
                                for (var i = 0; i < chartData.chartLables.length; i++)
                                    ochartProxy._labelCurrentTags["collapsedMembers"].push(chartData.chartLables[i]);
                            }
                        }
                        else {
                            var chartData = ochartProxy.getJSONRecords();
                            ochartProxy.model.currentReport = JSON.parse(ochartProxy.getOlapReport());
                            var rows = JSON.parse(ochartProxy.model.currentReport.rows);
                            ochartProxy._labelCurrentTags = { collapsedMembers: [] };
                            if (rows.length > 1) {
                                for (var i = 0; i < chartData.chartLables.length; i++) {
                                    ochartProxy._labelCurrentTags["collapsedMembers"].push(chartData.chartLables[i]);
                                }
                            }
                        }
                    }
                }
                if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null) {
                    if ($("#" + oclientProxy._id + "_maxView")[0]) {
                        $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: false });
                        oclientWaitingPopup.hide();
                    }
                    else if (typeof oclientProxy.ogridObj != "undefined") {
                        if (oclientProxy && (oclientProxy.ogridObj._drillAction && !oclientProxy.ogridObj._startDrilldown) || oclientProxy.ochartObj._drillAction && !oclientProxy.ochartObj._startDrilldown)
                            oclientWaitingPopup.hide();
                        else if (oclientProxy && oclientProxy.ogridObj._drillAction == "" && oclientProxy.ochartObj._drillAction == "" && !oclientProxy.ogridObj._startDrilldown && !oclientProxy.ochartObj._startDrilldown && (oclientProxy.ogridObj._JSONRecords != null || oclientProxy.ochartObj._JSONRecords == null))
                            oclientWaitingPopup.hide();
                        else if (oclientProxy.ochartObj._startDrilldown && !oclientProxy.ogridObj._startDrilldown && !$("#" + oclientProxy._id + "_maxView")[0])
                            oclientWaitingPopup.show();
                        else if (!oclientProxy.ochartObj._startDrilldown && !oclientProxy.ogridObj._startDrilldown && oclientProxy.ochartObj._drillAction == "" && oclientProxy.ogridObj._drillAction == "" && (oclientProxy.ogridObj._JSONRecords != null || oclientProxy.ochartObj._JSONRecords == null))
                            oclientWaitingPopup.hide();
                    }
                    if (oclientProxy.model.displaySettings.mode == "chartonly")
                        oclientWaitingPopup.hide();
                }
                else
                    ochartWaitingPopup.hide();
                if (typeof oclientProxy != 'undefined')
                    oclientProxy.ochartObj._startDrilldown = false;
            }
            catch (err) {
            }
            var eventArgs = { "action": this._currentAction, "customObject": this.model.customObject, "element": this.element };
            this._trigger("renderSuccess", eventArgs);
        },

        renderChartFromJSON: function (jsonData) {
            window.clearInterval(oChartTimer);
            var chartSeries = new Array();
            if (jsonData == null || jsonData == "") {
                if (jsonData == "") {
                    var htmlTag = ej.buildTag("div#" + ochartProxy._id + "Container")[0].outerHTML;
                    ochartProxy.element.html(htmlTag);
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
                jQuery.each(jsonData.chartLables, function (index, value) {
                    var YPoints = new Array();
                    if (measureRCnt > 1 && jsonData.addInfo.action != "DrillChart" || (measureRCnt > 1 && jsonData.addInfo.levelHash == "1")) {
                        var lblVal = (((index + 1) * measureRCnt) - measureRCnt);
                        for (var mCnt = 0; mCnt < measureRCnt; mCnt++) {
                            if (jsonData.points_Y[(lblVal + mCnt)] != undefined && jsonData.chartLables[index] == jsonData.points_Y[(lblVal + mCnt)][0].Item1)
                                for (var i = 0; i < jsonData.points_Y[index].length; i++) {
                                    points = { "xValues": jsonData.chartLables[index], "yValues": (jsonData.points_Y[lblVal + mCnt][i].Item2).indexOf(",") > -1 ? ej.globalize.parseFloat(ej.globalize.format((jsonData.points_Y[lblVal + mCnt][i].Item2), "c")) : (jsonData.points_Y[lblVal + mCnt][i].Item2), text: (jsonData.points_Y[lblVal + mCnt][i].Item2) };
                                    YPoints.push(points);
                                }
                        }
                    }
                    else
                        for (var i = 0; i < jsonData.points_Y[index].length; i++) {
                            if (ochartProxy.model.analysisMode == ej.PivotChart.AnalysisMode.Olap && ochartProxy.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                                if (ochartProxy.seriesType() == "bubble")
                                    points = { "xValues": jsonData.chartLables[index], "yValues": (jsonData.points_Y[index])[i].Item2, "size": (jsonData.points_Y[index])[i].Item2 };
                                else
                                    points = { "xValues": jsonData.chartLables[index], "yValues": (jsonData.points_Y[index])[i].Item2.indexOf(",") > -1 ? ej.globalize.parseFloat(ej.globalize.format((jsonData.points_Y[index])[i].Item2, "c")) : (jsonData.points_Y[index])[i].Item2, "text": (jsonData.points_Y[index])[i].Item2 };
                            }
                            else {
                                if (ochartProxy.seriesType() == "bubble")
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
                    }
                    else {
                        jQuery.each(jsonData.seriesNames, function (index, value) {
                            chartSeries[pointsCount] = { dataSource: tempArray[index], xName: "xValues", yName: "yValues", name: jsonData.seriesNames[pointsCount], marker: { dataLabel: { textMappingName: "text" } } };
                            pointsCount++;
                        });
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
                        border: { width: 3, color: 'white' }
                    };
                else if ((this.seriesType() == "pie" || this.seriesType() == "doughnut"))
                    this.model.commonSeriesOptions.marker.visible = false;
                else if ((this.seriesType() == "pyramid" || this.seriesType() == "funnel")) {
                    this.model.commonSeriesOptions.marker = {
                        dataLabel: {
                            visible: true
                        }
                    };
                }
                else if (jQuery.inArray(this.seriesType(), ["column", "stackingcolumn", "bar", "stackingcolumn"]) > -1 && this.model.commonSeriesOptions.marker) {
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

                if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap && this.model.operationalMode == ej.PivotChart.ServerMode) {
                    this.model.primaryYAxis.labelFormat = (ochartProxy.model.primaryYAxis.labelFormat != null || ochartProxy.model.primaryYAxis.labelFormat != "") && (this.model.primaryYAxis.labelFormat) ? this.model.primaryYAxis.labelFormat : (jsonData.labelFormat.indexOf("#") > -1 && jsonData.measureNames.indexOf("~") < 0) ? "Number" : (jsonData.labelFormat.toLowerCase().indexOf("percent") > -1 && jsonData.measureNames.indexOf("~") < 0) ? "{value}%" : (jsonData.labelFormat.toLowerCase().indexOf("currency") > -1 && jsonData.measureNames.indexOf("~") < 0) ? "Currency" : "";
                }

                if (this.model.enable3D != true) {
                    this.model.zooming.enableScrollbar = true;
                    var chartWidthPixel = this.model.size.width.indexOf("%") > -1 ? (this.element.width() * this.model.size.width.split("%")[0]) / 100 : this.model.size.width.split("px")[0];
                    var chartHeightPixel = this.model.size.height.indexOf("%") > -1 ? (this.element.height() * this.model.size.height.split("%")[0]) / 100 : this.model.size.height.split("px")[0];
                    var pointsPerFrame = (this.seriesType() == "bar" || this.seriesType() == "stackingbar") ? (chartHeightPixel / 100) * 6 : (chartWidthPixel / 100) * 3;
                    this.model.primaryXAxis.zoomFactor = pointsPerFrame / (jsonData.chartLables.length * jsonData.seriesNames.length);
                }
                else
                    this.model.primaryXAxis.zoomFactor = 1;
            }
            $("#" + ochartProxy._id + "Container").ejChart({
                border: ochartProxy.model.border,
                backGroundImageUrl: ochartProxy.model.backGroundImageUrl,
                palette: ochartProxy.model.palette,
                chartArea: ochartProxy.model.chartArea,
                primaryXAxis: ochartProxy.model.primaryXAxis,
                primaryYAxis: ochartProxy.model.primaryYAxis,
                secondaryX: ochartProxy.model.secondaryX,
                secondaryY: ochartProxy.model.secondaryY,
                striplineDefault: ochartProxy.model.striplineDefault,
                title: {
                    text: ochartProxy.titleText(),
                    textAlignment: ochartProxy.model.title.textAlignment,
                    font: {
                        color: ochartProxy.model.title.color,
                        fontFamily: ochartProxy.model.title.fontFamily,
                        fontWeight: ochartProxy.model.title.fontWeight,
                        opacity: ochartProxy.model.title.opacity,
                        size: ochartProxy.model.title.size,
                        fontStyle: ochartProxy.model.title.fontStyle
                    }
                },
                lineCap: ochartProxy.model.lineCap,
                lineJoin: ochartProxy.model.lineJoin,
                legendAlignment: ochartProxy.model.legendAlignment,
                legendPosition: ochartProxy.model.legendPosition,
                legend: ochartProxy.model.legend,
                animation: ochartProxy.model.animation,
                crosshair: ochartProxy.model.crosshair,
                commonSeriesOptions: {
                    doughnutCoefficient: ochartProxy.model.commonSeriesOptions.doughnutCoefficient,
                    explodeOffset: ochartProxy.model.commonSeriesOptions.explodeOffset,
                    pyramidMode: ochartProxy.model.commonSeriesOptions.pyramidMode,
                    gapRatio: ochartProxy.model.commonSeriesOptions.gapRatio,
                    pieCoefficient: ochartProxy.model.commonSeriesOptions.pieCoefficient,
                    doughnutSize: ochartProxy.model.commonSeriesOptions.doughnutSize,
                    startAngle: ochartProxy.model.commonSeriesOptions.startAngle,
                    xAxisName: ochartProxy.model.commonSeriesOptions.xAxisName,
                    yAxisName: ochartProxy.model.commonSeriesOptions.yAxisName,
                    explodeAll: ochartProxy.model.commonSeriesOptions.explodeAll,
                    explodeIndex: ochartProxy.model.commonSeriesOptions.explodeIndex,
                    tooltipOptions: ochartProxy.model.commonSeriesOptions.tooltipOptions,
                    marker: ochartProxy.model.commonSeriesOptions.marker || ochartProxy.model.marker,
                    font: ochartProxy.model.commonSeriesOptions.font,
                    type: ochartProxy.seriesType(),
                    enableAnimation: ochartProxy.model.commonSeriesOptions.enableAnimation,
                    style: ochartProxy.model.commonSeriesOptions.style,
                    explode: ochartProxy.model.commonSeriesOptions.explode,
                    labelPosition: ochartProxy.model.commonSeriesOptions.labelPosition,
                    tooltip: ochartProxy.model.commonSeriesOptions.tooltip,
                    zOrder: ochartProxy.model.commonSeriesOptions.zOrder,
                    drawType: ochartProxy.model.commonSeriesOptions.drawType,
                    isStacking: ochartProxy.model.commonSeriesOptions.isStacking,
                    enableSmartLabels: ochartProxy.model.commonSeriesOptions.enableSmartLabels
                },
                seriesStyle: ochartProxy.model.seriesStyle,
                pointStyle: ochartProxy.model.pointStyle,
                textStyle: ochartProxy.model.textStyle,
                initSeriesRender: ochartProxy.model.initSeriesRender,
                theme: ochartProxy.model.theme,
                canResize: ochartProxy.model.isResponsive,
                rotation: ochartProxy.model.rotation,
                enable3D: ochartProxy.model.enable3D,
                zooming: ochartProxy.model.zooming,
                margin: ochartProxy.model.margin,
                elementSpacing: ochartProxy.model.elementSpacing,
                seriesColors: ochartProxy.model.seriesColors,
                seriesBorderColors: ochartProxy.model.seriesBorderColors,
                pointColors: ochartProxy.model.pointColors,
                pointBorderColors: ochartProxy.model.pointBorderColors,
                series: chartSeries,
                size: ochartProxy.model.size,
                load: ochartProxy.model.load,
                axesRangeCalculate: ochartProxy.model.axesRangeCalculate,
                axesTitleRendering: ochartProxy.model.axesTitleRendering,
                chartAreaBoundsCalculate: ochartProxy.model.chartAreaBoundsCalculate,
                legendItemRendering: ochartProxy.model.legendItemRendering,
                lengendBoundsCalculate: ochartProxy.model.lengendBoundsCalculate,
                preRender: ochartProxy.model.preRender,
                seriesRendering: ochartProxy.model.seriesRendering,
                symbolRendering: ochartProxy.model.symbolRendering,
                titleRendering: ochartProxy.model.titleRendering,
                axesLabelsInitialize: ochartProxy.model.axesLabelsInitialize,
                pointRegionMouseMove: ochartProxy.model.pointRegionMouseMove,
                legendItemClick: ochartProxy.model.legendItemClick,
                legendItemMouseMove: ochartProxy.model.legendItemMouseMove,
                displayTextRendering: ochartProxy.model.displayTextRendering,
                toolTipInitialize: ochartProxy.model.toolTipInitialize,
                trackAxisToolTip: ochartProxy.model.trackAxisToolTip,
                trackToolTip: ochartProxy.model.trackToolTip,
                animationComplete: ochartProxy.model.animationComplete,
                destroy: ochartProxy.model.destroy,
                create: ochartProxy.model.create,
                axesLabelRendering: ej.proxy(ochartProxy._onLabelRenders, ochartProxy),
                pointRegionClick: (typeof (oclientProxy) != "undefined" ? (!oclientProxy.model.enableDeferUpdate ? ej.proxy(ochartProxy._onSeriesClick, ochartProxy) : null) : ej.proxy(ochartProxy._onSeriesClick, ochartProxy)),
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
                $("#" + ochartProxy._id).append(toolTipInfo);
            }
            $("#" + ochartProxy._id + "progressContainer").hide();
            if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                if (jsonData != null && jsonData != "") {
                    ochartProxy._labelCurrentTags.splice(0, ochartProxy._labelCurrentTags.length);
                    jQuery.each(jsonData.labelTags, function (index, value) {
                        var currentTag = new Object();
                        var splitData = value.split("::");
                        currentTag = { "name": splitData[2], "state": splitData[splitData.length - 1], "tag": value };
                        ochartProxy._labelCurrentTags.push(currentTag);
                    });
                    jQuery.each(ochartProxy._labelCurrentTags, function (index, value) {
                        if (value.name == ochartProxy._selectedItem && ochartProxy._drillAction == "drillup") {
                            ochartProxy._selectedTagInfo = ochartProxy._labelCurrentTags[index].tag;
                            return false;
                        }
                    });
                }
            }
            if (ochartWaitingPopup != null)
                this.element.ejWaitingPopup({ showOnInit: false });
        },

        _onLabelRenders: function (args) {
            ochartProxy._trigger("axesLabelRendering", args);
            if ((args.data.axis.orientation.toLowerCase() == "horizontal" && args.data.label.Text != undefined) || ((ochartProxy.seriesType() == "bar" || ochartProxy.seriesType() == "stackingbar") && args.data.axis.orientation.toLowerCase() == "vertical" && args.data.label.Text != undefined)) {
                var splitName = this.model.enableRTL ? args.data.label.Text.toString().split("~~").reverse(): args.data.label.Text.toString().split("~~");
                if (ochartProxy._tagCollection.length == 0)
                    args.data.label.Text = splitName[splitName.length - 1];
                else if (ochartProxy._drillAction == "drilldown" && splitName.indexOf(ochartProxy._selectedItem) + 1 < splitName.length)
                    args.data.label.Text = splitName[splitName.indexOf(ochartProxy._selectedItem) + 1];
                else if (ochartProxy._drillAction == "drilldown" && splitName.indexOf(ochartProxy._selectedItem) + 1 >= splitName.length)
                    args.data.label.Text = splitName[splitName.indexOf(ochartProxy._selectedItem)];
                else if (splitName.length == 1)
                    args.data.label.Text = splitName[0];
                else if (ochartProxy._drillAction == "drillup")
                    args.data.label.Text = splitName[ochartProxy._selectedIndex];
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

        _onSeriesClick: function (sender) {
            this.element.find("#" + ochartProxy._id + "ExpandMenu, .expandMenu, .e-dialog").remove();
            var selectedLabel, menuList = new Array(), chartOffset = this.element.position(), me = this;
            ochartProxy = this;
            if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap && this.model.operationalMode == ej.PivotChart.OperationalMode.ServerMode) {
                var tempLabel; var pointIndex;
                ochartProxy._selectedTags = [];
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
                if ($($("#" + ochartProxy._id + "Container_vml_XAxisLabels_0")[0]).children()[pointIndex] != undefined)
                    tempLabel = $($("#" + ochartProxy._id + "Container_vml_XAxisLabels_0")[0]).children()[pointIndex].innerHTML;
                else if ($("#" + ochartProxy._id + "Container_svg_XAxisLabels_0").children()[pointIndex])
                    tempLabel = $("#" + ochartProxy._id + "Container_svg_XAxisLabels_0").children()[pointIndex].textContent;
                else if (this.seriesType() == "bar" || this.seriesType() == "stackingbar") {
                    if ($($("#" + ochartProxy._id + "Container_vml_YAxisLabels_0")[0]).children()[pointIndex] != undefined)
                        tempLabel = $($("#" + ochartProxy._id + "Container_vml_YAxisLabels_0")[0]).children()[pointIndex].innerHTML;
                    else if ($("#" + ochartProxy._id + "Container_svg_YAxisLabels_0").children()[pointIndex])
                        tempLabel = $("#" + ochartProxy._id + "Container_svg_YAxisLabels_0").children()[pointIndex].textContent;
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
                    $("#" + ochartProxy._id).find("#" + ochartProxy._id + "ExpandMenu, .expandMenu, .e-dialog").remove();
                    var splitLabel = selectedLabel.split("~~");

                    jQuery.each(splitLabel, function (index, value) {
                        jQuery.each(ochartProxy._labelCurrentTags, function (key, val) {
                            if ($.trim(value) == val.name) {
                                ochartProxy._selectedTags.push(val);
                                return false;
                            }
                        });
                    });

                    jQuery.each(ochartProxy._selectedTags, function (index, value) {
                        if (value.state > 1)
                            if (me.model.enableRTL)
                                menuList.push($(ej.buildTag("li.menuList", value.name + " - " + (ochartProxy._getLocalizedLabels("Expand")))[0]).attr("role", "presentation")[0].outerHTML);
                            else
                                menuList.push($(ej.buildTag("li.menuList", (ochartProxy._getLocalizedLabels("Expand")) + " - " + value.name)[0]).attr("role", "presentation")[0].outerHTML);
                    });
                    jQuery.each(ochartProxy._selectedTags, function (index, value) {
                        for (var label = 0; label < selectedLabel.split("~~").length - 1; label++) {
                            if ((selectedLabel.split("~~")[label] == value.name) && value.state == 1)
                                if (me.model.enableRTL)
                                    menuList.push($(ej.buildTag("li.menuList", value.name + " - " + (ochartProxy._getLocalizedLabels("Collapse")))[0]).attr("role", "presentation")[0].outerHTML);
                                else
                                    menuList.push($(ej.buildTag("li.menuList", (ochartProxy._getLocalizedLabels("Collapse")) + " - " + selectedLabel.split("~~")[label])[0]).attr("role", "presentation")[0].outerHTML);
                        }
                    });
                }
            }
            else {
                selectedLabel = (sender.data.region != null && sender.data.region != undefined) ? sender.model.primaryXAxis.labels[sender.data.region.Region.PointIndex] : sender.data.series.xAxis.labels[sender.data.point.X];
                if (!ej.isNullOrUndefined(ochartProxy._labelCurrentTags.collapsedMembers)) {
                    if (this.model.analysisMode == ej.PivotChart.AnalysisMode.Olap) {
                        var memberNames = selectedLabel.split(" ~ ");
                        this._selectedSeriesInfo = new Array();
                        for (var i = 0; i < memberNames.length; i++) {
                            this._selectedSeriesInfo.push($(this.getJSONRecords().seriesTags).filter(function (index, item) { return item.split('::')[2] == memberNames[i] })[0]);
                            if ($.inArray(memberNames[i], ochartProxy._labelCurrentTags.collapsedMembers) >= 0) {
                                if (me.model.enableRTL)
                                    menuList.push($(ej.buildTag("li.menuList",  memberNames[i] +" - " +(ochartProxy._getLocalizedLabels("Expand")) )[0]).attr("role", "presentation")[0].outerHTML);
                                else
                                    menuList.push($(ej.buildTag("li.menuList", (ochartProxy._getLocalizedLabels("Expand")) + " - " + memberNames[i])[0]).attr("role", "presentation")[0].outerHTML);
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
                                for (var i = 0; i < ochartProxy._labelCurrentTags.expandedMembers[j].length; i++) {
                                    if (me.model.enableRTL)
                                        menuList.push($(ej.buildTag("li.menuList", ochartProxy._labelCurrentTags.expandedMembers[j][i].split('::')[2] + " - " + (ochartProxy._getLocalizedLabels("Collapse")))[0]).attr("role", "presentation")[0].outerHTML);
                                    else
                                        menuList.push($(ej.buildTag("li.menuList", (ochartProxy._getLocalizedLabels("Collapse")) + " - " + ochartProxy._labelCurrentTags.expandedMembers[j][i].split('::')[2])[0]).attr("role", "presentation")[0].outerHTML);
                                }
                            }
                        }
                    }
                    else {
                        for (var i = 0; i < ochartProxy._labelCurrentTags.expandedMembers.length; i++) {
                            if (me.model.enableRTL)
                                menuList.push($(ej.buildTag("li.menuList", ochartProxy._labelCurrentTags.expandedMembers[i] + " - " + (ochartProxy._getLocalizedLabels("Collapse")))[0]).attr("role", "presentation")[0].outerHTML);
                            else
                                menuList.push($(ej.buildTag("li.menuList", (ochartProxy._getLocalizedLabels("Collapse")) + " - " + ochartProxy._labelCurrentTags.expandedMembers[i])[0]).attr("role", "presentation")[0].outerHTML);
                        }
                    }
                }                
            }
            if (menuList.length > 0) {
                menuList.push($(ej.buildTag("li.menuList", ochartProxy._getLocalizedLabels("Exit"))[0]).attr("role", "presentation")[0].outerHTML);
                var expandMenu = $(ej.buildTag("div#" + ochartProxy._id + "ExpandMenu.expandMenu", menuList)[0]).attr("role", "presentation")[0].outerHTML;
                $(expandMenu).ejDialog({ width: "auto", target: "#" + ochartProxy._id, enableResize: false, enableRTL: this.model.enableRTL });
                $("#" + ochartProxy._id + "ExpandMenu_wrapper").appendTo(this.element).css({ "left": sender.data.location.x + 8 + chartOffset.left, "top": sender.data.location.y + 8 + chartOffset.top, "min-height": navigator.userAgent.toLowerCase().indexOf('webkit') > 0 ? "initial" : "auto" });
                $("#" + ochartProxy._id + "ExpandMenu").css({ "min-height": navigator.userAgent.toLowerCase().indexOf('webkit') > 0 ? "initial" : "auto" });
            }
            this.element.find(".e-titlebar, .e-header").remove();
            ochartProxy._trigger("pointRegionClick", sender);
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
            
            if (this.model.operationalMode == ej.PivotChart.OperationalMode.ClientMode) {
                var params = {
                    args: JSON.stringify({
                        fileName: fileName,
                        chartdata: chartString.split(',')[1],
                        bgColor: $(this.element).css('background-color'),
                        exportFormat: exportFormat
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
                        bgColor: $(this.element).css('background-color')
                    })
                };
                this.doPostBack(this.model.url + "/" + this.model.serviceMethodSettings.exportOlapChart, params);
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
                    if (typeof ochartWaitingPopup != 'undefined' && ochartWaitingPopup != null)
                        ochartWaitingPopup.hide();
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
        Line: 'line', Spline: 'spline', Column: 'column', Area: 'area', SplineArea: 'splinearea', StepLine: 'stepline', StepArea: 'steparea', Pie: 'pie', Bar: 'bar', StackingArea: 'stackingarea', StackingColumn: 'stackingcolumn', StackingBar: 'stackingbar', Pyramid: 'pyramid', Funnel: 'funnel', Doughnut: 'doughnut', Scatter: 'scatter', Bubble: 'bubble'
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

})(jQuery, Syncfusion);;

});