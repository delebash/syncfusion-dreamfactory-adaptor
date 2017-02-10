/*!
*  filename: ej.pivottreemap.js
*  version : 14.4.0.20
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.globalize","./../common/ej.core","./../common/ej.data","./../common/ej.touch","./ej.waitingpopup","./../datavisualization/ej.treemap","./ej.pivot.common"], fn) : fn();
})
(function () {
	
/**
* @fileOverview Plugin to style the Html Pivot TreeMap elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {

    ej.widget("ejPivotTreeMap", "ej.PivotTreeMap", {

        _rootCSS: "e-pivottreemap",
        element: null,
        model: null,
        validTags: ["div", "span"],
        defaults: $.extend(ej.datavisualization.TreeMap.prototype.defaults, {
            url: "",
            cssClass: "",
            currentReport: "",
            operationalMode: "clientmode",
            customObject: {},
            isResponsive: false,
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
            serviceMethodSettings: {
                initialize: "InitializeTreeMap",
                drillDown: "DrillTreeMap",
            },
            locale: "en-US",
            drillSuccess: null,
            beforeServiceInvoke: null,
            afterServiceInvoke: null,
            load: null,
            renderComplete: null,
            renderFailure: null,
            renderSuccess: null,
            beforePivotEnginePopulate: null
        }),

        dataTypes: {
            serviceMethodSettings: "data",
            customObject: "data"
        },

        locale: ej.util.valueFunction("locale"),

        getOlapReport: function () {
            return this._olapReport;
        },

        setOlapReport: function (value) {
            this._olapReport = value;
        },

        getJsonRecords: function () {
            return this._JSONRecords;
        },

        setJsonRecords: function (value) {
            this._JSONRecords = JSON.parse(value);
        },

        _init: function () {
            this._initPrivateProperties();
            this._load();
        },

        _destroy: function () {
            this.element.empty().removeClass("e-pivottreemap" + this.model.cssClass);
            if (this._waitingPopup != undefined)
                this._waitingPopup._destroy();
        },

        _initPrivateProperties: function () {
            this._id = this.element.attr("id");
            ptreemapProxy = this;
            this._olapReport = "";
            this._JSONRecords = null;
            this._treeMapDatasource = [];
            this._currentAction = "initialize";
            this._selectedItem = "";
            this._selectedTagInfo = null;
            this._tagCollection = new Array();
            this._drilledMembers = new Array();
            this._startDrilldown = false;
            this._isDrilled = false;
            this._treeMap = null;
            this._waitingPopup = null;
            this._drillText = "";
            this._showDrillText = "";
        },

        _load: function () {
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
                this._waitingPopup = this.element.data("ejWaitingPopup");
            }
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            if (this.model.dataSource.data == null && this.model.url == "" && this.model.dataSource.cube == "") {
                this.renderTreeMapFromJSON(null);
                this._waitingPopup.hide();
                return
            };
            if ((this.model.dataSource.data == null && this.model.url != "") || (this.model.dataSource.data != null && this.model.url != "" && this.model.operationalMode == ej.PivotTreeMap.OperationalMode.ServerMode)) {
                this.model.operationalMode = ej.PivotTreeMap.OperationalMode.ServerMode;
                if (this.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: this._currentAction, element: this.element, customObject: serializedCustomObject});
                if (this.model.customObject != "" && this.model.customObject != null && this.model.customObject != undefined)
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": "initialize", "currentReport": this.model.currentReport, "customObject": serializedCustomObject }), this.renderControlSuccess);
                else
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": "initialize" }), this.renderControlSuccess);
            }
            else {
                this.model.operationalMode = ej.PivotTreeMap.OperationalMode.ClientMode;
                if (this.model.dataSource.rows.length > 1)
                    this.model.dataSource.rows = [this.model.dataSource.rows[this.model.dataSource.rows.length - 1]];
                if (this.model.dataSource.cube != "") {
                    this._trigger("beforePivotEnginePopulate", { treeMapObject: this });
                    ej.olap.base.getJSONData({ action: "initialLoad" }, this.model.dataSource, this);
                }
            }
        },

        generateJSON: function (dataObj, pivotengine) {
            var labelTags = [], drillTags = [], measureNames = "", points_Y = [], seriesNames = [], treemapLabels = [], valuePoints = [], jsonData = {};

            for (var i = 0; i < this.model.dataSource.values[0].measures.length; i++) {
                measureNames += measureNames == "" ? this.model.dataSource.values[0].measures[i].fieldCaption : "~~" + this.model.dataSource.values[0].measures[i].fieldCaption;
            }
            var axis = this.model.dataSource.values[0].axis;
            var rowCount = this.model.dataSource.rows.length;
            var rowHeaderWidth = pivotengine[0][0].ColSpan;
            var elementCount = 0;
            if (rowHeaderWidth - rowCount <= 0) {
                rowHeaderWidth = 0;
                elementCount = rowCount;
                rowElementCount = rowCount;
            }
            else {
                if (axis == "rows")
                    elementCount = rowHeaderWidth - 1;
                else
                elementCount = rowHeaderWidth;
                rowHeaderWidth = elementCount - 1;
            }

            ///  for treemapLabels

            var tempArray = new Array();
            for (var i = 0; i < pivotengine.length; i++) {
                for (var j = 0; j < pivotengine[i].length; j++) {
                    var tag = null;
                    if (pivotengine[i][j].CSS == " value")
                        valuePoints.push(pivotengine[i][j].Value);
                    if (pivotengine[i][j].CSS == "rowheader" && pivotengine[i][j].Value != "") {
                        var obj = {};
                        tag = pivotengine[i][j].Info + "::" + pivotengine[i][j].State;
                        drillTags.push((pivotengine[i][j].Info).replace(/&/g, "&amp;"))
                        labelTags.push(tag);
                        if (tempArray.length == 0 && pivotengine[i][j].Info.split(".")[0].indexOf("Measures") < 0) {
                            obj["level"] = i;
                            obj["index"] = j;
                            obj["label"] = pivotengine[i][j].Value;
                            tempArray.push(obj);
                        }
                        if (tempArray.length != 0 && pivotengine[i][j].Info.split(".")[0].indexOf("Measures") < 0) {
                            for (var k = 0; k < tempArray.length; k++) {
                                if (!ej.isNullOrUndefined(tempArray[k])) {
                                    if (tempArray[k].index == j && tempArray[k].level != i) {
                                        tempArray[k].level = i;
                                        tempArray[k].label = tempArray[k].label + "~~" + pivotengine[i][j].Value;
                                        break;
                                    }
                                    else if (tempArray[k].level == i) {
                                        var islevel = false;
                                        for (var m = 0; m < tempArray.length; m++) {
                                            if (!ej.isNullOrUndefined(tempArray[m]))
                                                if (tempArray[m].index == j) {
                                                    islevel = true;
                                                    break;
                                                }
                                        }
                                        if (!islevel && pivotengine[i][j].Info.split(".")[0].indexOf("Measures") < 0) {
                                            obj["level"] = i;
                                            obj["index"] = j;
                                            obj["label"] = pivotengine[i][j].Value;
                                            tempArray.push(obj);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (pivotengine[i][j].CSS == "summary") {
                        if (tempArray.length != 0) {
                            for (var k = 0; k < tempArray.length; k++) {
                                if (!ej.isNullOrUndefined(tempArray[k]))
                                    if (tempArray[k].index == j) {
                                        delete tempArray[k];
                                        break;
                                    }
                            }
                        }
                    }
                }
            }
            for (var k = 0; k < tempArray.length; k++) {
                if (!ej.isNullOrUndefined(tempArray[k]))
                    if (elementCount == tempArray[k].label.split("~~").length)
                        treemapLabels.push(tempArray[k].label);
            }

            /// for seriesNames

            var tempArray = new Array();
            for (var i = 0; i < pivotengine.length; i++) {
                for (var j = 0; j < pivotengine[i].length; j++) {
                    if (pivotengine[i][j].CSS == "colheader" && pivotengine[i][j].Value != "") {
                        var obj = {};
                        if (tempArray.length == 0) {
                            obj["level"] = j;
                            obj["index"] = i;
                            obj["label"] = pivotengine[i][j].Value;
                            tempArray.push(obj);
                        }
                        if (tempArray.length != 0) {
                            for (var k = 0; k < tempArray.length; k++) {
                                if (!ej.isNullOrUndefined(tempArray[k])) {
                                    if (tempArray[k].index == i && tempArray[k].level != j && pivotengine[i][j].Info.split(".")[0].indexOf("Measures") < 0) {
                                        tempArray[k].index = i;
                                        tempArray[k].label = tempArray[k].label + "~~" + pivotengine[i][j].Value;
                                        break;
                                    }
                                    else if (tempArray[k].level == j && pivotengine[i][j].Info.split(".")[0].indexOf("Measures") < 0) {
                                        var islevel = true;
                                        for (var m = 0; m < tempArray.length; m++) {
                                            if (!ej.isNullOrUndefined(tempArray[m])) {
                                                islevel = false;
                                                if (tempArray[m].index == i) {
                                                    islevel = true;
                                                    break;
                                                }
                                            }
                                        }
                                        if (!islevel && pivotengine[i][j].Info.split(".")[0].indexOf("Measures") < 0) {
                                            obj["level"] = j;
                                            obj["index"] = i;
                                            obj["label"] = pivotengine[i][j].Value;
                                            tempArray.push(obj);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (pivotengine[i][j].CSS == "summary") {
                        if (tempArray.length != 0) {
                            for (var k = 0; k < tempArray.length; k++) {
                                if (!ej.isNullOrUndefined(tempArray[k]))
                                    if (tempArray[k].index == i) {
                                        delete tempArray[k];
                                        break;
                                    }
                            }
                        }
                    }
                }
            }

            for (var k = 0; k < tempArray.length; k++) {
                if (!ej.isNullOrUndefined(tempArray[k]))
                    seriesNames.push(tempArray[k].label);
            }

            //// Add MeasureName with Dimension

            if (measureNames != "" && axis == ej.olap.AxisName.Column) {
                for (var i = 0; i < seriesNames.length; i++) {
                    seriesNames[i] = seriesNames[i] + "~" + measureNames;
                }
            }

            ///  for points_Y

            if (rowHeaderWidth == 0) {
                var valueCount = (valuePoints.length / seriesNames.length);
                for (var i = 0; i < treemapLabels.length; i++) {
                    var tempArray = new Array();
                    for (var j = i; j < valuePoints.length; j = j + valueCount) {
                        var obj = {};
                        obj["Item1"] = (treemapLabels[i].indexOf("~~") >= 0 ? treemapLabels[i].split("~~")[0] : treemapLabels[i]);
                        obj["Item2"] = valuePoints[j];
                        tempArray.push(obj);
                    }
                    points_Y.push(tempArray);
                }
            }
            else {
                var cellCount = [];
                var index = null;
                for (var i = 0; i < treemapLabels.length; i++) {
                    var tempArray = new Array();
                    for (var j = 0; j < pivotengine[rowHeaderWidth].length; j++) {
                        if (pivotengine[rowHeaderWidth][j].CSS == "rowheader" && pivotengine[rowHeaderWidth][j].Value != "")
                            if (treemapLabels[i].split("~~")[treemapLabels[i].split("~~").length - 1] == pivotengine[rowHeaderWidth][j].Value) {
                                index = j;
                                tempArray.push(index);
                                tempArray.push(treemapLabels[i]);
                                cellCount.push(tempArray);
                                break;
                            }
                    }
                }
                for (var k = 0; k < cellCount.length; k++) {
                    var tempArray = new Array();
                    for (var i = 0; i < pivotengine.length; i++) {
                        for (var j = cellCount[k][0]; j < pivotengine[i].length; j++) {
                            if (pivotengine[i][j].CSS == " value") {
                                var obj = {};
                                obj["Item1"] = (cellCount[k][1].indexOf("~~") >= 0 ? cellCount[k][1].split("~~")[0] : cellCount[k][1]);
                                obj["Item2"] = pivotengine[i][j].Value;
                                tempArray.push(obj);
                            }
                            break;
                        }
                    }
                    if (tempArray.length != 0)
                        points_Y.push(tempArray);
                }
            }

            //// for jsonData

            jsonData["labelTags"] = labelTags;
            jsonData["drillTags"] = drillTags;
            jsonData["measureNames"] = measureNames;
            jsonData["points_Y"] = points_Y;
            jsonData["seriesNames"] = seriesNames;
            jsonData["treemapLabels"] = treemapLabels;
            ptreemapProxy._JSONRecords = jsonData;
            this.renderTreeMapFromJSON(jsonData);
            this._unWireEvents();
            this._wireEvents();
        },

        _wireEvents: function () {
            if (typeof (oclientProxy) == "undefined")
                $(window).on('resize', $.proxy(this._reSizeHandler, this));
            this._on(this.element, "click", ".drillItem", this._drillTreeMap);
        },

        _drillTreeMap: function (event) {
            var memberInfo = null;
            if (event.type == "treeMapGroupSelected") {
                if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null) {
                    if ($("#" + oclientProxy._id + "_maxView")[0])
                        $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                    else
                        oclientWaitingPopup.show();
                }
                else
                    ptreemapProxy._waitingPopup.show();
                if (event.selectedGroups.length == 0) {
                    if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                        $("#" + oclientProxy._id + "_maxView")[0] != (undefined || null) ? $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: false }) : oclientWaitingPopup.hide();
                    else
                        ptreemapProxy._waitingPopup.hide();
                    return;
                }
                ptreemapProxy._currentAction = "drilldown";                
                ptreemapProxy._selectedItem = event.selectedGroups[0].header;
                for (var j = 0; j < ptreemapProxy._treeMapDatasource.length; j++) {
                    if (ptreemapProxy._treeMapDatasource[j].Tag.split("::")[2] == ptreemapProxy._selectedItem) {
                        ptreemapProxy._selectedTagInfo = ptreemapProxy._treeMapDatasource[j].Tag;
                        if (ptreemapProxy.model.operationalMode == ej.PivotTreeMap.OperationalMode.ClientMode)
                            memberInfo = ptreemapProxy._treeMapDatasource[j].drillTag;
                        if (ptreemapProxy._selectedTagInfo.split("::")[ptreemapProxy._selectedTagInfo.split("::").length - 1] != 2) {
                            ptreemapProxy._treeMap.refresh();
                            if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                                $("#" + oclientProxy._id + "_maxView")[0] != (undefined || null) ? $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: false }) : oclientWaitingPopup.hide();
                            else
                                ptreemapProxy._waitingPopup.hide();
                            return;
                        }
                        else
                            break;
                    }
                }
                ptreemapProxy._startDrilldown = true;
                if (ptreemapProxy.model.operationalMode == ej.PivotTreeMap.OperationalMode.ServerMode) {
                    if (ptreemapProxy.model.beforeServiceInvoke != null)
                        ptreemapProxy._trigger("beforeServiceInvoke", { action: ptreemapProxy._currentAction, element: ptreemapProxy.element, customObject: ptreemapProxy.model.customObject });
                    var serializedCustomObject = JSON.stringify(ptreemapProxy.model.customObject);
                    if (ptreemapProxy.model.customObject != "" && ptreemapProxy.model.customObject != null && ptreemapProxy.model.customObject != undefined) {
                        if (typeof (oclientProxy) != "undefined")
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport(), "clientReports": oclientProxy.reports, "customObject": serializedCustomObject }), ptreemapProxy.renderControlSuccess);
                        else
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport(), "customObject": serializedCustomObject }), ptreemapProxy.renderControlSuccess);
                    }
                    else {
                        if (!typeof (oclientProxy) != "undefined")
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport() }), ptreemapProxy.renderControlSuccess);
                        else
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drilldown", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport(), "clientReports": oclientProxy.reports }), ptreemapProxy.renderControlSuccess);
                    }
                }
                else {
                    ptreemapProxy._drilledMembers.push(memberInfo);
                    ej.olap._mdxParser.updateDrilledReport({ uniqueName: memberInfo, seriesInfo: [memberInfo], uniqueNameArray: ptreemapProxy._drilledMembers }, "rowheader", ptreemapProxy);
                }
            }
            else {
                if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null) {
                    if ($("#" + oclientProxy._id + "_maxView")[0])
                        $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                    else
                        oclientWaitingPopup.show();
                }
                else
                    ptreemapProxy._waitingPopup.show();
                ptreemapProxy._currentAction = "drillup";
                if ($(event.target).hasClass("drillItem")) {
                    if (ptreemapProxy.getJsonRecords().treemapLabels[0].indexOf("~~") >= 0) {
                        ptreemapProxy._selectedItem = $(event.target).text();
                        for (var i = 0; i < ptreemapProxy.getJsonRecords().labelTags.length; i++) {
                            if (ptreemapProxy.getJsonRecords().labelTags[i].split("::")[2] == ptreemapProxy._selectedItem && ptreemapProxy.getJsonRecords().labelTags[i].split("::")[ptreemapProxy.getJsonRecords().labelTags[i].split("::").length - 1] == 1) {
                                ptreemapProxy._selectedTagInfo = ptreemapProxy.getJsonRecords().labelTags[i];
                                if (ptreemapProxy.model.operationalMode == ej.PivotTreeMap.OperationalMode.ClientMode)
                                    memberInfo = ptreemapProxy.getJsonRecords().drillTags[i];
                                if (ptreemapProxy._selectedTagInfo.split("::")[ptreemapProxy._selectedTagInfo.split("::").length - 1] != 1) {
                                    if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                                        $("#" + oclientProxy._id + "_maxView")[0] != (undefined || null) ? $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: false }) : oclientWaitingPopup.hide();
                                    else
                                        ptreemapProxy._waitingPopup.hide();
                                    return;
                                }
                                else
                                    break;
                            }
                        }
                    }
                    else {
                        if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                            $("#" + oclientProxy._id + "_maxView")[0] != (undefined || null) ? $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: false }) : oclientWaitingPopup.hide();
                        else
                            ptreemapProxy._waitingPopup.hide();
                        return;
                    }
                }
                if (ptreemapProxy._tagCollection.length == 0)
                    ptreemapProxy._isDrilled = false;
                ptreemapProxy._startDrilldown = true;
                if (ptreemapProxy.model.operationalMode == ej.PivotTreeMap.OperationalMode.ServerMode) {
                    if (ptreemapProxy.model.beforeServiceInvoke != null)
                        ptreemapProxy._trigger("beforeServiceInvoke", { action: ptreemapProxy._currentAction, element: ptreemapProxy.element, customObject: ptreemapProxy.model.customObject });
                    var serializedCustomObject = JSON.stringify(ptreemapProxy.model.customObject);
                    if (ptreemapProxy.model.customObject != "" && ptreemapProxy.model.customObject != null && ptreemapProxy.model.customObject != undefined) {
                        if (typeof (oclientProxy) != "undefined")
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillup", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport(), "clientReports": oclientProxy.reports, "customObject": serializedCustomObject }), ptreemapProxy.renderControlSuccess);
                        else
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillup", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport(), "customObject": serializedCustomObject }), ptreemapProxy.renderControlSuccess);
                    }
                    else {
                        if (!typeof (oclientProxy) != "undefined")
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillup", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport() }), ptreemapProxy.renderControlSuccess);
                        else
                            ptreemapProxy.doAjaxPost("POST", ptreemapProxy.model.url + "/" + ptreemapProxy.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillup", "drillInfo": ptreemapProxy._selectedTagInfo, "olapReport": ptreemapProxy.getOlapReport(), "clientReports": oclientProxy.reports }), ptreemapProxy.renderControlSuccess);
                    }
                }
                else {
                    var uniqueNameArray = ptreemapProxy._drilledMembers.slice(0, $.inArray(memberInfo, ptreemapProxy._drilledMembers) + 1);
                    ptreemapProxy._drilledMembers = ptreemapProxy._drilledMembers.slice(0, $.inArray(memberInfo, ptreemapProxy._drilledMembers));
                    ej.olap._mdxParser.updateDrilledReport({ uniqueName: memberInfo, seriesInfo: [memberInfo], uniqueNameArray: uniqueNameArray, action: "collapse" }, "rowheader", ptreemapProxy);
                }
            }
        },

        _unWireEvents: function () {
            $(window).off('resize', $.proxy(this._reSizeHandler, this));
            this._off(this.element, "click", ".drillItem", this._drillTreeMap);
        },

        renderControlSuccess: function (msg) {
            ptreemapProxy = this;
            if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                if ($("#" + oclientProxy._id + "_maxView")[0])
                    $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                else
                    oclientWaitingPopup.show();
            try {
                if (msg[0] != undefined) {
                    this.setJsonRecords(msg[0].Value); this.setOlapReport(msg[1].Value);
                    if (typeof (oclientProxy) != "undefined") {
                        oclientProxy.currentReport = msg[1].Value;
                        if (msg[2] != null && msg[2] != undefined && msg[2].Key == "ClientReports")
                            oclientProxy.reports = msg[2].Value;
                    }
                    if (msg[2] != null && msg[2] != undefined && !msg[2].Key == "ClientReports")
                        this.model.customObject = msg[2].Value;
                }
                else if (msg.d != undefined) {
                    this.setJsonRecords(msg.d[0].Value); this.setOlapReport(msg.d[1].Value);
                    if (typeof (oclientProxy) != "undefined") {
                        oclientProxy.currentReport = msg.d[1].Value;
                        if (msg.d[2] != null && msg.d[2] != undefined && msg.d[2].Key == "ClientReports")
                            oclientProxy.reports = msg.d[2].Value;
                    }
                    if (msg.d[2] != null && msg.d[2] != undefined && !(msg.d[2].Key == "ClientReports"))
                        this.model.customObject = msg.d[2].Value;
                }
                else {
                    this.setJsonRecords(msg.JsonRecords); this.setOlapReport(msg.OlapReport);
                    if (msg.customObject != null && msg.customObject != null)
                        this.model.customObject = msg.customObject;
                    if (typeof (oclientProxy) != "undefined") {
                        if (typeof (oclientProxy.currentReport) != "undefined")
                            oclientProxy.currentReport = msg.OlapReport;
                        if (typeof (oclientProxy.reports) != "undefined" && msg.reports != undefined && msg.reports != "undefined")
                            oclientProxy.reports = msg.reports;
                    }
                }
                if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotTreeMap.OperationalMode.ServerMode) {
                    var eventArgs;
                    if (this._currentAction != "initialize")
                        eventArgs = { action: this._currentAction, element: this.element, customObject: this.model.customObject };
                    else
                        eventArgs = { action: this._currentAction, element: this.element, customObject: this.model.customObject };
                    this._trigger("afterServiceInvoke", eventArgs);
                }
                this.renderTreeMapFromJSON(this.getJsonRecords())
                this._unWireEvents();
                this._wireEvents();
                if (this._currentAction != "initialize") {
                    this.model.currentReport = this.getOlapReport();
                    this._trigger("drillSuccess", this.element);
                }
                if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null) {
                    if ($("#" + oclientProxy._id + "_maxView")[0]) {
                        $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: false });
                        oclientWaitingPopup.hide();
                    }
                    else if (typeof oclientProxy.ogridObj != "undefined") {
                        if (oclientProxy && (oclientProxy.ogridObj._drillAction && !oclientProxy.ogridObj._startDrilldown) || oclientProxy.otreemapObj._currentAction && !oclientProxy.otreemapObj._startDrilldown)
                            oclientWaitingPopup.hide();
                        else if (oclientProxy && oclientProxy.ogridObj._drillAction == "" && oclientProxy.otreemapObj._currentAction == "" && !oclientProxy.ogridObj._startDrilldown && !oclientProxy.otreemapObj._startDrilldown && (oclientProxy.ogridObj._JSONRecords != null || oclientProxy.otreemapObj._JSONRecords == null))
                            oclientWaitingPopup.hide();
                        else if (oclientProxy.otreemapObj._startDrilldown && !oclientProxy.ogridObj._startDrilldown && !$("#" + oclientProxy._id + "_maxView")[0])
                            oclientWaitingPopup.show();
                        else if (!oclientProxy.otreemapObj._startDrilldown && !oclientProxy.ogridObj._startDrilldown && oclientProxy.otreemapObj._currentAction == "" && oclientProxy.ogridObj._drillAction == "" && (oclientProxy.ogridObj._JSONRecords != null || oclientProxy.otreemapObj._JSONRecords == null))
                            oclientWaitingPopup.hide();
                    }
                    if (oclientProxy.model.displaySettings.mode == "chartonly")
                        oclientWaitingPopup.hide();
                }
                else
                    this._waitingPopup.hide();
                if (typeof oclientProxy != 'undefined')
                    oclientProxy.otreemapObj._startDrilldown = false;
            }
            catch (err) {
            }
            if (!ej.isNullOrUndefined(msg.Exception)) {
                this._createErrorDialog(msg,"Exception",this);
            }
        },

        renderTreeMapFromJSON: function (jsonData) {
            this._treeMapDatasource = [];
            var rowElement = "";
            if ((ej.isNullOrUndefined(jsonData)) || jsonData.length <= 0 || jsonData.labelTags.length == 0 || jsonData.points_Y.length == 0) {
                (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null ? oclientWaitingPopup.hide() : this._waitingPopup.hide());
                return;
            }
            (!ej.isNullOrUndefined(jsonData.chartLables)) ? jsonData.treemapLabels = jsonData.chartLables : jsonData.treemapLabels;
            if (jsonData.points_Y.length != jsonData.treemapLabels.length) {
                oclientProxy._onFiltered = false
                var treeMapData = [];
                for (var i = 0; i < JSON.parse(JSON.stringify(ptreemapProxy.getJsonRecords().points_Y)).length - 1; i++) {
                    treeMapData.push(JSON.parse(JSON.stringify(ptreemapProxy.getJsonRecords().points_Y))[i]);
                }
            }
            else
                var treeMapData = JSON.parse(JSON.stringify(ptreemapProxy.getJsonRecords().points_Y));
            if (typeof (oclientProxy) != "undefined")
                if (oclientProxy.model.enableDeferUpdate && oclientProxy._ischartTypesChanged)
                    oclientProxy._ischartTypesChanged = false;

            for (var i = 0; i < treeMapData.length; i++) {
                var rowName = ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~")[ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~").length - 1];
                for (var j = 0; j < treeMapData[i].length; j++) {
                    treeMapData[i][j]['Item1'] = treeMapData[i][j]['Item1'].replace(treeMapData[i][j]['Item1'], rowName);
                    treeMapData[i][j]['Column'] = ptreemapProxy.getJsonRecords().seriesNames[j].split("~")[0];
                    treeMapData[i][j]['Measures'] = ptreemapProxy.getJsonRecords().measureNames;
                    treeMapData[i][j]['Tag'] = $.grep(ptreemapProxy.getJsonRecords().labelTags, function (tag) { return tag.split("::")[2] == treeMapData[i][j]['Item1']; })[0];
                    if (this.model.operationalMode == ej.PivotTreeMap.OperationalMode.ClientMode)
                        treeMapData[i][j]['drillTag'] = $.grep(ptreemapProxy.getJsonRecords().drillTags, function (drilltag) { return drilltag.split("::")[2] == treeMapData[i][j]['Item1']; })[0];
                    treeMapData[i][j][treeMapData[i][j].Tag.split("::")[1].split('.')[0].replace("[", "").replace("]", "")] = treeMapData[i][j].Item1;
                    treeMapData[i][j]['RowItem'] = treeMapData[i][j].Item1;
                    treeMapData[i][j]['Value'] = (treeMapData[i][j].Item2 != "" ? treeMapData[i][j].Item2 : 0);
                    treeMapData[i][j]['Index'] = j;
                    delete treeMapData[i][j]['Item1'];
                    delete treeMapData[i][j]['Item2'];
                    rowElement += (rowElement == "" ? "" : ";") + treeMapData[i][j].Tag.split("::")[1].split('.')[0].replace("[", "").replace("]", "");
                }
            }

            var minValue, maxValue;
            for (var i = 0; i < treeMapData.length; i++) {
                for (var j = 0; j < treeMapData[i].length; j++) {
                    treeMapData[i][j].Value = ej.isNullOrUndefined(treeMapData[i][j].Value) ? 0 : ej.globalize.parseFloat(ej.globalize.format(treeMapData[i][j].Value, "c"));
                    this._treeMapDatasource.push(treeMapData[i][j]);
                    if (ej.isNullOrUndefined(minValue) || minValue >= treeMapData[i][j].Value)
                        minValue = treeMapData[i][j].Value;
                    else
                        if (ej.isNullOrUndefined(maxValue) || maxValue <= treeMapData[i][j].Value)
                            maxValue = treeMapData[i][j].Value;
                }
            }
            if (ptreemapProxy.getJsonRecords().treemapLabels.length > 0) {
                ptreemapProxy._drillText = "";
                var temp = [];
                for (var i = 0; i < ptreemapProxy.getJsonRecords().treemapLabels.length; i++) {
                    if (ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~").length > 1) {
                        for (var j = 0; j < ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~").length - 1; j++) {
                            var drillstate = 0;
                            for (var k = 0; k < ptreemapProxy.getJsonRecords().labelTags.length; k++) {
                                if (ptreemapProxy.getJsonRecords().labelTags[k].split("::")[2] == ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~")[j] && ptreemapProxy.getJsonRecords().labelTags[k].split("::")[ptreemapProxy.getJsonRecords().labelTags[k].split("::").length - 1] == 1) {
                                    drillstate = 1;
                                    break;
                                }
                            }
                            if (temp.length == 0 && drillstate == 1)
                                temp.push(ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~")[j]);
                            else {
                                if (temp.length > 0) {
                                    var index = jQuery.inArray(ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~")[j], temp);
                                    if (index == -1 && drillstate == 1)
                                        temp.push(ptreemapProxy.getJsonRecords().treemapLabels[i].split("~~")[j]);
                                }
                            }
                        }
                    }
                }
                for (var i = 0; i < temp.length; i++) {
                    ptreemapProxy._drillText += ptreemapProxy._drillText == "" ? ej.buildTag("a.drillItem", temp[i])[0].outerHTML : " > " + ej.buildTag("a.drillItem", temp[i])[0].outerHTML;
                }
            }
            this._showDrillText = ptreemapProxy._drillText == "" ? ej.buildTag("span.drillup", rowElement.split(";")[0], { "margin-left": "5px" })[0].outerHTML : ej.buildTag("span.drillup", rowElement.split(";")[0], { "margin-left": "5px" })[0].outerHTML + ": " + ptreemapProxy._drillText;
            var htmlTag = ej.buildTag("div#" + this._id + "TreeMapContainer", "", { "height": (typeof (oclientProxy) != "undefined") ? (parseInt(oclientProxy._chartHeight) - 50).toString() + "px" : this.element.height(), "width": (typeof (oclientProxy) != "undefined") ? oclientProxy._chartWidth : this.element.width(), "margin-top": "50px" })[0].outerHTML;
            this.element.html(htmlTag);
            minValue = minValue - 1;
            maxValue = maxValue + 1;
            rowElement = rowElement.split(";")[0];
            $("#" + this._id + "TreeMapContainer").ejTreeMap({
                dataSource: this._treeMapDatasource,
                showTooltip: true,
                colorValuePath: "Value",
                tooltipTemplate: "tooltipTemplate",
                enableDrillDown: false,
                enableGradient: true,
                highlightGroupOnSelection: (typeof (oclientProxy) != "undefined" ? (!oclientProxy.model.enableDeferUpdate ? true : false) : true),
                treeMapGroupSelected: this._drillTreeMap,
                refreshed: this._treeMapRenderSuccess,
                showLegend: true,
                legendSettings: {
                    leftLabel: minValue.toString(),
                    width: 150,
                    height: 20,
                    title: this._treeMapDatasource[0].Measures,
                    rightLabel: maxValue.toString(),
                    mode: "interactive",
                    dockPosition: "bottom",
                    alignment: "center"
                },
                rangeColorMapping: [{
                    from: minValue,
                    to: maxValue,
                    gradientColors: ["#fde6cc", "#fab665"]
                }],
                weightValuePath: "Value",
                leafItemSettings: { showLabels: true, labelPath: "Column", labelVisibilityMode: "hideonexceededlength" },
                levels: [{ groupPath: rowElement, groupGap: 2, showHeader: true, headerHeight: 25, labelPosition: "topleft", headerVisibilityMode: "hideonexceededlength" }]
            });

            this._treeMap = $("#" + this._id + "TreeMapContainer").data("ejTreeMap");
            this._treeMap["rowItem"] = rowElement;
            
            $.views.helpers({
                Measures: function (data) {
                    var measures = null;
                    measures = data.Measures;
                    return measures;
                },
                Row: function (data) {
                    var column = null;
                    column = data.Column;
                    return column;
                },
                Column: function (data) {
                    var row = null;
                    row = data.RowItem;
                    return row;
                },
                Value: function (data) {
                    var value = 0;
                        value = data.Value;
                    return value;
                },
            });
            var eventArgs = { "action": this._currentAction, "customObject": this.model.customObject, "element": this.element };
            this._trigger("renderSuccess", eventArgs);
            if (typeof (oclientProxy) != "undefined")
                $("#" + this._id + "TreeMapContainer").css({ width: "100%" });
            this._treeMap.refresh();
            ptreemapProxy = this;
	        ptreemapProxy._JSONRecords = jsonData;
            if (this.model.operationalMode == ej.PivotTreeMap.OperationalMode.ClientMode)
                this._waitingPopup.hide();
        },

        _treeMapRenderSuccess: function (args) {
            ptreemapProxy._treeMap = $("#" + ptreemapProxy._id + "TreeMapContainer").data("ejTreeMap");
            if (!ej.isNullOrUndefined(ptreemapProxy._treeMap)) {
                if (ptreemapProxy._treeMap.model.legendSettings.dockPosition == "top") {
                    if (!ptreemapProxy.element.find("#" + ptreemapProxy._id + "TreeMapContainer").children().hasClass("drillupAction"))
                        $(ej.buildTag("div#drillHeader .drillupAction", ptreemapProxy._showDrillText, { "height": "25px", "width": "99.8%", "z-index": "10", "position": "absolute", "margin-top": "33px" })[0].outerHTML).insertAfter($("#" + ptreemapProxy._id + "TreeMapContainer").find(".LegendDiv").css("margin-top", "-50px").css("font-size", "12px"));
                }
                else {
                    $("#" + ptreemapProxy._id + "TreeMapContainer").find(".LegendDiv").css("font-size", "12px").insertAfter($("#" + ptreemapProxy._id + "TreeMapContainer").find("._templateDiv"));
                    $(ej.buildTag("div#drillHeader .drillupAction", ptreemapProxy._showDrillText, { "height": "25px", "width": "99.8%", "position": "absolute", "margin-top": "-32px" })[0].outerHTML).insertBefore($("#" + ptreemapProxy._id + "TreeMapContainer").find("#backgroundTile"));
                }
            }
        },

        _reSizeHandler: function (args) {
            var resize = ptreemapProxy.element.find("#" + ptreemapProxy._id + "TreeMapContainer").width(ptreemapProxy.element.width()).data("ejTreeMap");
            if (!ej.isNullOrUndefined(resize))
                resize.refresh();
        },

        doAjaxPost: function (type, url, data, onSuccess, onComplete, customArgs) {
            var contentType, dataType, successEvt, isAsync = true;
            if ((data["XMLA"] == undefined))
                contentType = 'application/json; charset=utf-8', dataType = 'json', successEvt = $.proxy(onSuccess, this);
            else
                contentType = 'text/xml', dataType = 'xml', data = data["XMLA"], successEvt = $.proxy(onSuccess, ej.olap.base, customArgs), isAsync = (ej.browserInfo().name == "msie" && ej.browserInfo().version <= 9) ? false : ((!ej.isNullOrUndefined(customArgs) && customArgs["action"] != "loadFieldElements") ? true : false);
            $.ajax({
                type: type,
                url: url,
                contentType: contentType,
                async: isAsync,
                dataType: dataType,
                data: data,
                success: successEvt,
                complete: ej.proxy(function (onComplete) {
                    $.proxy(onComplete, this);
                    var eventArgs = { "action": this._currentAction, "customObject": this.model.customObject, element: this.element };
                    this._trigger("renderComplete", eventArgs);
                }, this),
                error: ej.proxy(function (msg, textStatus, errorThrown) {
                    if (typeof this._waitingPopup != 'undefined' && this._waitingPopup != null)
                        this._waitingPopup.hide();
                    if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                        oclientWaitingPopup.hide();
                    var eventArgs = { "action": this._currentAction, "customObject": this.model.customObject, "element": this.element, "Message": msg };
                    this._trigger("renderFailure", eventArgs);
                    this.renderTreeMapFromJSON("");
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

    ej.PivotTreeMap.OperationalMode = {
        ClientMode: "clientmode",
        ServerMode: "servermode"
    };
})(jQuery, Syncfusion);;

});