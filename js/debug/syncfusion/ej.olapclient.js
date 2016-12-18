/*!
*  filename: ej.olapclient.js
*  version : 14.2.0.26
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.globalize","jquery-easing","./../common/ej.core","./../common/ej.data","./../common/ej.touch","./../common/ej.draggable","./../common/ej.scroller","./ej.button","./ej.checkbox","./ej.dropdownlist","./ej.dialog","./ej.toolbar","./ej.maskedit","./ej.waitingpopup","./ej.treeview","./ej.tab","./ej.pivotchart","./ej.pivotgrid","./../datavisualization/ej.vmlrenderer","./../datavisualization/ej.svgrenderer","./../datavisualization/ej.axisrenderer","./../datavisualization/ej.legendrender","./../datavisualization/ej.seriesrender","./../datavisualization/ej.chart","./../datavisualization/ej.synchart"], fn) : fn();
})
(function () {
	
/**
* @fileOverview Plugin to experience Html OLAP Client component elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {

    ej.widget("ejOlapClient", "ej.olap.OlapClient", {

        _rootCSS: "e-olapclient",
        element: null,
        model: null,
        validTags: ["div", "span"],
        defaults: {
            url: "",
            cssClass: "",
            title: "",
            gridLayout: "normal",
            chartType: "column",
            clientExportMode: "chartandgrid",
            enableDeferUpdate: false,
            enablePivotTreeMap: false,
            enableRTL:false,
            displaySettings: {
                mode: "chartandgrid",
                defaultView: "grid",
                controlPlacement: "tab",
                enableTogglePanel: false,
                isResponsive: false,
                enableFullScreen: false
            },
            serviceMethodSettings: {
                initialize: "InitializeClient",
                removeSplitButton: "RemoveSplitButton",
                filterElement: "FilterElement",
                nodeDropped: "NodeDropped",
		        toggleAxis: "ToggleAxis",
                fetchMemberTreeNodes: "FetchMemberTreeNodes",
                cubeChanged: "CubeChanged",
                measureGroupChanged: "MeasureGroupChanged",
                toolbarServices: "ToolbarOperations",
                memberExpand: "MemberExpanded",
                saveReport: "SaveReportToDB",
                fetchReportList: "FetchReportListFromDB",
                loadReport: "LoadReportFromDB",
                updateReport: "UpdateReport",
                exportOlapClient: "Export",
                mdxQuery: "GetMDXQuery"
            },
            customObject: {},
            enableMeasureGroups: false,
            locale: "en-US",
            renderSuccess: null,
            renderFailure: null,
            renderComplete: null,
            load: null,
            chartLoad: null,
            treeMapLoad: null,
            beforeServiceInvoke: null,
            afterServiceInvoke: null
        },

        dataTypes: {
            displaySettings: "data",
            serviceMethodSettings: "data",
            customObject: "data"
        },

        observables: ["title", "gridLayout", "displaySettings.mode", "displaySettings.defaultView", "displaySettings.controlPlacement", "displaySettings.enableTogglePanel", "locale"],
        title: ej.util.valueFunction("title"),
        gridLayout: ej.util.valueFunction("gridLayout"),
        displayMode: ej.util.valueFunction("displaySettings.mode"),
        defaultView: ej.util.valueFunction("displaySettings.defaultView"),
        controlPlacement: ej.util.valueFunction("displaySettings.controlPlacement"),
        enableTogglePanel: ej.util.valueFunction("displaySettings.enableTogglePanel"),
        locale: ej.util.valueFunction("locale"),

        _init: function () {
            this._initPrivateProperties();
            this._load();
        },

        _initPrivateProperties: function () {
            this._id = this.element.attr("id");
            oclientProxy = this;
            currentReport = "";
            currentCubeName = "";
            reports = "";
            reportsCount = 0;
            ogridObj = null;
            ochartObj = null;
            otreemapObj = null;
            chartObj = null;
            this._deferReport = "";
            this._keypress = false;
            memberTreeObj = null;
            this._chartHeight = 0;
            this._chartWidth = 0;
            this._gridHeight = 0;
            this._gridWidth = 0;
            this._initStyles = new Array();
            this._toggleStyles = new Array();
            this._initToggle = true;
            this._toggleExpand = false;
            this._treemapRender = false;
            this._dimensionName = "";
            this._dllSortMeasure = null;
            this._axis = "";
            this._isSorted = false;
            this._isFiltered = false;
            this._sortOrFilterTab = '';
            this._currentAxis = "";
            this._parentElwidth = 0;
            this.pNode = "";
            this.progressPos = null;
            this._selectedReport = "";
            this._isMembersFiltered = false;
            this._dialogTitle = "";
            draggedSplitBtn = null;
            isDragging = false;
            isDropped = false;
            oclientWaitingPopup = null;
            measureGroupInfo = "";
            currentTab = this.defaultView();
            this._currentItem = null;
            this._currentReportItems = [];
            this._treeViewData = {};
            this._isNodeOrButtonDropped = false;
            this._ischartTypesChanged = false;
            this._isrenderTreeMap = false;
            this._isRemoved = false;
            this._index = {tab:0,icon:1,chartimg:0,button:1,dialog:0,editor:0,tree:0};
            this._curFocus = {tab:null,icon:null,chartimg:null,button:null,dialog:null,editor:null,tree:null};
        },

        _destroy: function () {
            this.element.empty().removeClass("e-olapclient" + this.model.cssClass);
            if (this.oclientWaitingPopup != undefined)
                this.oclientWaitingPopup._destroy();
        },

        _load: function () {
            this.element.addClass(this.model.cssClass);
            $("#" + this._id).ejWaitingPopup({ showOnInit: true });
            oclientWaitingPopup = $("#" + this._id).data("ejWaitingPopup");

            if (this.model.beforeServiceInvoke != null)
                this._trigger("beforeServiceInvoke", { action: "initializeClient", element: this.element, customObject: this.model.customObject });
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({
                "action": "initializeClient", "customObject": serializedCustomObject, "clientParams": this.model.enableMeasureGroups + "-" + this.model.chartType
            }), this._renderControlSuccess);
        },

        _setFirst: true,

        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
                    case "title": this.element.find(".titleText").text(this.title()); break;
                    case "currentCubeName": this.currentCubeName = options[key]; break;
                    case "gridLayout": this._renderPivotGrid(); break;
                    case "olapReport": this.currentReport = options[key]; break;
                    case "clientReports": this.reports = options[key]; break;
                    case "customObject": this.model.customObject = options[key]; break;
                    case "locale": { this.locale(); if (this.ogridObj || this.ochartObj) this._load(); break; }
                    case "displaySettings": { if (this.ogridObj || this.ochartObj) this._load(); break; }
                }
            }
        },

        _updateTreeView: function () {
            for (var i = 0; i < $(".editorTreeView").find("li").length; i++) {
                for (var j = 0; j < oclientProxy.memberTreeObj.dataSource().length; j++) {
                    if ($(".editorTreeView").find("li")[i].id == oclientProxy.memberTreeObj.dataSource()[j].id && ($($(".editorTreeView").find("li")[i]).find("span:first").attr('aria-checked') == "mixed" || $($(".editorTreeView").find("li")[i]).find("span:first").attr('aria-checked') == "true")) {
                        oclientProxy.memberTreeObj.dataSource()[j].checkedStatus = true;
                        break;
                    }
                    else if ($(".editorTreeView").find("li")[i].id == oclientProxy.memberTreeObj.dataSource()[j].id && $($(".editorTreeView").find("li")[i]).find("span:first").attr('aria-checked') == "false") {
                        oclientProxy.memberTreeObj.dataSource()[j].checkedStatus = false;
                        break;
                    }
                }
            }
            for (var i = 0; i < oclientProxy.memberTreeObj.dataSource().length; i++) {
                var memberStatus = false;
                    if (oclientProxy.memberTreeObj.dataSource()[i].checkedStatus == true) {
                        for (var j = 0; j < oclientProxy.memberTreeObj.dataSource().length; j++) {
                            if (oclientProxy.memberTreeObj.dataSource()[j].hasOwnProperty("pid") && oclientProxy.memberTreeObj.dataSource()[j].pid == oclientProxy.memberTreeObj.dataSource()[i].id && oclientProxy.memberTreeObj.dataSource()[j].checkedStatus == true) {
                                    memberStatus = true;
                                    break;
                            }
                        }
                        if (!memberStatus) {
                        for (var m = 0; m < oclientProxy.memberTreeObj.dataSource().length; m++) {
                            if (oclientProxy.memberTreeObj.dataSource()[m].hasOwnProperty("pid") && oclientProxy.memberTreeObj.dataSource()[m].pid == oclientProxy.memberTreeObj.dataSource()[i].id)
                                    oclientProxy.memberTreeObj.dataSource()[m].checkedStatus = true;
                        }
                    }
                }
                else if (oclientProxy.memberTreeObj.dataSource()[i].checkedStatus == false) {
                    for (var k = 0; k < oclientProxy.memberTreeObj.dataSource().length; k++) {
                        if (oclientProxy.memberTreeObj.dataSource()[k].hasOwnProperty("pid") && oclientProxy.memberTreeObj.dataSource()[k].pid == oclientProxy.memberTreeObj.dataSource()[i].id)
                                oclientProxy.memberTreeObj.dataSource()[k].checkedStatus = false;
                    }
                }
            }
            for (var i = 0; i < $(".editorTreeView").find("li").length; i++) {
                if ($($(".editorTreeView").find("li")[i]).attr("tag") == null || undefined) {
                    for (var j = 0; j < oclientProxy.memberTreeObj.dataSource().length; j++) {
                        if ($($(".editorTreeView").find("li")[i])[0].id == oclientProxy.memberTreeObj.dataSource()[j].id) {
                            $($(".editorTreeView").find("li")[i]).attr("tag", oclientProxy.memberTreeObj.dataSource()[j].tag);
                            break;
                        }
                    }
                }
            }
        },

        _getMeasuresList: function () {
            var measureName = "";
            this.element.find(".memberEditorDiv").find("div").each(function () { measureName += $(this)[0].id + ","; });
            return measureName;
        },

        _getUnSelectedNodes: function () {
            var unselectedNodes = "";
            if ((oclientProxy._currentItem.indexOf("Measures") < 0)) {
                for (var i = 0; i < oclientProxy.memberTreeObj.dataSource().length; i++) {
                    if (oclientProxy.memberTreeObj.dataSource()[i].checkedStatus == false)
                        unselectedNodes += "::" + oclientProxy.memberTreeObj.dataSource()[i].id + "||" + oclientProxy.memberTreeObj.dataSource()[i].tag;
                }
            }
            return unselectedNodes;
        },

        _getSelectedNodes: function (isSlicer) {
            if (isSlicer) {
                var treeElement = this.element.find(".editorTreeView")[0].childNodes[0];
                var selectedNodes = new Array();
                var data = $(treeElement).children();
                for (var i = 0; i < data.length; i++) {
                    var parentNode = data[i];
                    var nodeInfo = { caption: $(parentNode.firstChild).find("a").text(), parentId: parentNode.parentElement.parentElement.className.indexOf("editorTreeView") > -1 ? "None" : $(parentNode).parents()[1].id, id: parentNode.id, checked: ($(parentNode).find(':input.nodecheckbox')[0].checked || $(parentNode).find('span:nth-child(1)').attr('class').indexOf("e-chk-indeter") > -1), expanded: $(parentNode.firstChild).find(".e-minus").length > 0 ? true : false, childNodes: new Array(), tag: $(parentNode).attr('tag') };
                    if ($(parentNode).find("ul:first").children().length > 0) {
                        var liElements = $(parentNode).find("ul:first").children();
                        for (var j = 0; j < liElements.length; j++) {
                            nodeInfo.childNodes.push(this._getNodeInfo(liElements[j]));
                        }
                    }
                    selectedNodes.push(nodeInfo);
                }
                return JSON.stringify(selectedNodes);
            }
            else {
                var selectedNodes = "";
                if ((oclientProxy._currentItem.indexOf(oclientProxy._getLocalizedLabels("Measures")) < 0)) {
                    for (var i = 0; i < oclientProxy.memberTreeObj.dataSource().length; i++) {
                        if (oclientProxy.memberTreeObj.dataSource()[i].checkedStatus == true)
                            selectedNodes += "::" + oclientProxy.memberTreeObj.dataSource()[i].id + "||" + oclientProxy.memberTreeObj.dataSource()[i].tag;
                    }
                }
                return selectedNodes;
            }
        },

        _getNodeInfo: function (node) {
            var childNode = { caption: $(node.firstChild).find("a").text(), parentId: node.parentElement.parentElement.className.indexOf("editorTreeView") > -1 ? "None" : $(node).parents()[1].id, id: node.id, checked: ($(node).find(':input.nodecheckbox')[0].checked || $(node).find('span:nth-child(1)').attr('class').indexOf("e-chk-indeter") > -1), expanded: $(node.firstChild).find(".e-minus").length > 0 ? true : false, childNodes: new Array(), tag: $(node).attr('tag') };
            if ($(node).find("ul:first").children().length > 0) {
                var liElements = $(node).find("ul:first").children();
                for (var i = 0; i < liElements.length; i++) {
                    childNode.childNodes.push(this._getNodeInfo(liElements[i]));
                }
            }
            return childNode;
        },

        _removeSplitBtn: function () {

            var dragBtn = $(document).find(".dragClone"); var btnTag;
            var clientBtns = this.element.find(".splitBtn");
            jQuery.each(clientBtns, function (index, value) {
                if ($($(value).children()[0]).attr("title") == $(dragBtn).attr("title")) {
                    btnTag = $(value).attr("tag");
                    $(value).remove();
                }
            });
            if (oclientProxy._currentReportItems.length != 0) {
                if (oclientProxy._treeViewData.hasOwnProperty($(dragBtn).attr("title"))) {
                    delete oclientProxy._treeViewData[$(dragBtn).attr("title")];
                    oclientProxy._currentReportItems.splice($.inArray($(dragBtn).attr("title"), oclientProxy._currentReportItems), 1);
                }
            }
            $(".dragClone").remove();
            oclientWaitingPopup.show();
            if (oclientProxy.model.beforeServiceInvoke != null)
                this._trigger("beforeServiceInvoke", { action: "removeSplitButton", element: this.element, customObject: oclientProxy.model.customObject });
            var serializedCustomObject = JSON.stringify(oclientProxy.model.customObject);
            oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.removeSplitButton, JSON.stringify({ "action": "removeSplitButton", "clientParams": btnTag, "olapReport": oclientProxy.currentReport, "clientReports": oclientProxy.reports, "customObject": serializedCustomObject }), oclientProxy._removeSplitButtonSuccess)
            oclientProxy._isNodeOrButtonDropped = true;
        },

        _wireEvents: function () {
            oclientProxy._wireDialogEvent();
            oclientProxy._wireEditorRemoveEvent();
            oclientProxy._wireMeasureRemoveEvent();

            this._on($(document), 'keydown', this._keyPressDown);
            this._on($(document), 'keyup', this._keyPressUp);

            this.element.find(".categoricalAxis, .rowAxis, .slicerAxis").find("button").ejDraggable({
                handle: 'button',
                clone: true,
                cursorAt: { top: -10, left: -10 },
                dragStart: function (event, ui) {
                    event.event.preventDefault();
                    $(this.element.find(".e-txt")).unbind('touchstart');
                    $(this.element.find(".e-txt")).unbind(ej.eventType.click);
                    isDragging = true;
                    this.element.find(".e-dialog").hide();
                    draggedSplitBtn = event.event.target;
                },
                dragStop: function (event, ui) {
                    this.element.find(".targetAxis").removeClass("targetAxis");
                    isDragging = false;
                    var cssName = null; var droppedPosition;
                    if (event.event.type == "touchend")
                        droppedPosition = oclientProxy._setSplitBtnTargetPos(event);
                    else
                        droppedPosition = oclientProxy._setSplitBtnTargetPos(event.event);
                    if (oclientProxy._dropAxisClassName != undefined && oclientProxy._dropAxisClassName != "") {
                        if (oclientProxy._dropAxisClassName == "outOfAxis")
                            oclientProxy._removeSplitBtn();
                        else
                            cssName = oclientProxy._dropAxisClassName;
                        oclientProxy._dropAxisClassName = "";
                    }
                    else if (event.target != undefined) {
                        if ($(event.target).hasClass("e-btn") || $(event.target).hasClass("removeSplitBtn"))
                            cssName = $(event.target).parents("div:eq(1)").attr("class");
                        else if (jQuery.type(event.target.className) != "string")
                            oclientProxy._removeSplitBtn();
                        else {
                            if (event.target.className.indexOf("splitBtn") > -1)
                                cssName = $(event.target).parents("div:eq(0)").attr("class");
                            else
                                cssName = event.target.className;
                        }
                    }
                    else {
                        if ($(event.event.originalEvent.srcElement).hasClass("e-btn") || $(event.event.originalEvent.srcElement).hasClass("removeSplitBtn"))
                            cssName = $(event.event.originalEvent.srcElement).parents("div:eq(1)").attr("class");
                        else if (event.event.originalEvent.srcElement.className.indexOf("splitBtn") > -1)
                            cssName = $(event.event.originalEvent.srcElement).parents("div:eq(0)").attr("class");
                        else
                            cssName = event.event.originalEvent.srcElement.className;
                    }
                    if (cssName != undefined && cssName != null) {
                        var axisName = (cssName.indexOf("categoricalAxis") > cssName.indexOf("rowAxis")) ? ((cssName.indexOf("categoricalAxis") > cssName.indexOf("slicerAxis")) ? "Categorical" : "Slicer") : ((cssName.indexOf("rowAxis") > cssName.indexOf("slicerAxis")) ? "Series" : (cssName.indexOf("slicerAxis") >= 0) ? "Slicer" : null);
                        if (axisName != null)
                            oclientProxy._splitButtonDropped(axisName, droppedPosition);
                        else
                            oclientProxy._removeSplitBtn();
                        oclientProxy._setSplitBtnTitle();
                    }
                },
                helper: function (event, ui) {
                    if (event.sender.target.className.indexOf("e-btn") > -1)
                        return $(event.sender.target).clone().addClass("dragClone").appendTo(oclientProxy.element);
                    else
                        return false;
                }
            });

            this.element.find(".categoricalAxis, .rowAxis, .slicerAxis").mouseover(function () {
                if (isDragging)
                    $(this).addClass("targetAxis");
            });

            this.element.find(".categoricalAxis, .rowAxis, .slicerAxis").mouseleave(function () {
                $(this).removeClass("targetAxis");
            });

            this.element.find(".e-btn").mouseover(function (evt) {
                $(evt.target.parentNode).find("span").css("display", "inline");
            });

            this.element.find(".splitBtn").mouseover(function (evt) {
                if (isDragging)
                    $(this).addClass("dropIndicator");
            });

            this.element.find(".splitBtn").mouseleave(function (evt) {
                $(this).removeClass("dropIndicator");
            });

            this.element.find(".sortDisable, .sortEnable, .filterDisable, .filterEnable ").bind(ej.eventType.click, function (evt) {
                if (evt.target.className == "sortDisable") {
                    $('.measuresList_wrapper,.radioBtnAsc, .radioBtnDesc, .preserveHrchy').attr("disabled", "disabled");
                    $('.measureListLbl, .orderLbl, .radioBtnAscLbl, .radioBtnDescLbl, .preserveHrchyLbl').addClass('sortFilterDisable');
                    oclientProxy._dllSortMeasure.disable();
                }
                else if (evt.target.className == "sortEnable") {
                    $('.measuresList_wrapper,.radioBtnAsc, .radioBtnDesc, .preserveHrchy').removeAttr("disabled");
                    $('.measureListLbl, .orderLbl, .radioBtnAscLbl, .radioBtnDescLbl, .preserveHrchyLbl').removeClass('sortFilterDisable');
                    oclientProxy._dllSortMeasure.enable();
                }
                else if (evt.target.className == "filterDisable") {
                    $('.filterFrom, .filterTo').attr("disabled", "disabled");
                    $('.filterMeasureListLbl, .conditionLbl, .filterValueLbl, .filterBtw').addClass('sortFilterDisable');
                    oclientProxy._dllFilterCondition.disable();
                    oclientProxy._dllfMeasuresList.disable();
                }
                else if (evt.target.className == "filterEnable") {
                    $('.filterFrom, .filterTo').removeAttr("disabled");
                    $('.filterMeasureListLbl, .conditionLbl, .filterValueLbl, .filterBtw').removeClass('sortFilterDisable');
                    oclientProxy._dllFilterCondition.enable();
                    oclientProxy._dllfMeasuresList.enable();
                }
            });

            this.element.find(".filterFrom , .filterTo").keypress(function (event) {
                if (event.which == 8 || event.which == 0) {
                    return true;
                }

                if (event.which < 46 || event.which > 58) {
                    return false;
                }
                if ((event.which == 46 && $(this).val().indexOf('.') != -1) || event.which == 47) {
                    return false;
                }
            });

            this.element.find(".toggleExpandButton").click(function (evt) {
                if (oclientProxy.model.isResponsive)
                    oclientProxy._rwdToggleCollapse();
                else {
                    oclientProxy._toggleExpand = true;
                    if (oclientProxy._initToggle) {
                        oclientProxy._initToggle = false; var items = {};
                        var tempWidth = oclientProxy.element.find(".cubeTable").width() + oclientProxy.element.find(".controlPanel").width() - 17;
                        items["controlPanelWidth"] = (tempWidth - 3);
                        items["chartOuterWidth"] = items["chartModelWidth"] = items["gridOuterWidth"] = tempWidth - 17;
                        oclientProxy._toggleStyles.push(items);
                    }
                    if (oclientProxy.displayMode() == ej.olap.OlapClient.DisplayMode.GridOnly)
                        oclientProxy.element.find(".gridContainer").width(960);
                    else if (oclientProxy.displayMode() == ej.olap.OlapClient.DisplayMode.ChartOnly)
                        oclientProxy.element.find(".chartContainer").width(954);
                    else if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile) {
                        if (oclientProxy.defaultView() == ej.olap.OlapClient.DefaultView.Grid) {
                            oclientProxy.element.find(".gridContainer").width(962);
                            oclientProxy.element.find(".chartContainer").width(957);
                        }
                        else {
                            oclientProxy.element.find(".gridContainer").width(960);
                            oclientProxy.element.find(".chartContainer").width(955);
                        }
                    }
                    else if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tab) {
                        if (oclientProxy.defaultView() == ej.olap.OlapClient.DefaultView.Grid) {
                            //oclientProxy.element.find(".gridContainer").width(962);
                            oclientProxy.element.find(".chartContainer").width(953);
                        }
                        else {
                            oclientProxy.element.find(".gridContainer").width(960);
                            oclientProxy.element.find(".chartContainer").width(953);
                        }
                    }
                    oclientProxy._performToggleAction(oclientProxy._toggleStyles);
                    oclientProxy.element.find(".csHeader, .cubeTable").hide();
                    oclientProxy.element.find(".toggleCollapseButton").show();
                    oclientProxy.element.find(".toggleText").show();
                    if (oclientProxy.model.enablePivotTreeMap) {
                        if (oclientProxy.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                            oclientProxy.chartObj = null;
                            oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                            if (ej.isNullOrUndefined(oclientProxy.chartObj) && !ej.isNullOrUndefined(oclientProxy.otreemapObj))
                                oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                            if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                                if ((oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                                    oclientProxy.otreemapObj._treeMap.refresh();
                                }
                                else {
                                    oclientProxy.chartObj.redraw();
                                }
                            }
                        }
                    }
                }

            });

            this.element.find(".toggleCollapseButton").click(function (evt) {
                if (oclientProxy.model.isResponsive)
                    oclientProxy._rwdToggleExpand();
                else {
                    oclientProxy._toggleExpand = false;
                    oclientProxy._performToggleAction(oclientProxy._initStyles);
                    oclientProxy.element.find(".csHeader, .cubeTable").show();
                    oclientProxy.element.find(".toggleCollapseButton").hide();
                    oclientProxy.element.find(".toggleText").hide();
                    if (oclientProxy.displayMode() == ej.olap.OlapClient.DisplayMode.GridOnly)
                        oclientProxy.element.find(".gridContainer").width(571);
                    else if (oclientProxy.displayMode() == ej.olap.OlapClient.DisplayMode.ChartOnly)
                        oclientProxy.element.find(".chartContainer").width(565);
                    else if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile) {
                        if (oclientProxy.defaultView() == ej.olap.OlapClient.DefaultView.Grid) {
                            oclientProxy.element.find(".gridContainer").width(574);
                            oclientProxy.element.find(".chartContainer").width(569);
                        }
                        else {
                            oclientProxy.element.find(".gridContainer").width(571);
                            oclientProxy.element.find(".chartContainer").width(566);
                        }
                    }
                    else if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tab) {
                        if (oclientProxy.defaultView() == ej.olap.OlapClient.DefaultView.Grid) {
                            //oclientProxy.element.find(".gridContainer").width(574);
                            oclientProxy.element.find(".chartContainer").width(564);
                        }
                        else {
                            oclientProxy.element.find(".gridContainer").width(569);
                            oclientProxy.element.find(".chartContainer").width(564);
                        }
                    }
                    if (oclientProxy.model.enablePivotTreeMap) {
                        if (oclientProxy.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                            oclientProxy.chartObj = null;
                            oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                            if (ej.isNullOrUndefined(oclientProxy.chartObj) && !ej.isNullOrUndefined(oclientProxy.otreemapObj))
                                oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                            if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                                if ((oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                                    oclientProxy.otreemapObj._treeMap.refresh();
                                }
                                else {
                                    oclientProxy.chartObj.redraw();
                                }
                            }
                        }
                    }
                }
            });

            this.element.find(".maximizedView").click(function (evt) {
                oclientProxy._maxViewBtnClick();
            });

            $(document).on('click', '.winCloseBtn', function () {
                oclientProxy._maxViewClsBtnClick();
            });

            if (this.model.isResponsive)
                $(window).bind('resize', $.proxy(this._reSizeHandler, this));
        },

        _keyPressUp: function(e){
            if (e.keyCode === 93 && !this.element.find(".e-dialog:visible").length > 0) {
                e.preventDefault();
                if (!ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.hasClass("e-text")) {
                    var position = { x: this.element.find(".hoverCell").offset().left + this.element.find(".hoverCell").outerWidth(), y: this.element.find(".hoverCell").offset().top + this.element.find(".hoverCell").outerHeight() };
                    this.element.find(".hoverCell").trigger({type: 'mouseup',which: 3,clientX: position.x,clientY: position.y,pageX: position.x,pageY: position.y});
                }
            }
        },
        _keyPressDown: function (e) {
            var btnTab;
            if (!ej.isNullOrUndefined(this._curFocus.button)) {
                btnTab = this._curFocus.button;
            }
            else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                btnTab = this._curFocus.tab;
            }
            if (e.keyCode === 93 && !ej.isNullOrUndefined(btnTab) && !this.element.find(".e-dialog:visible").length > 0) {
                e.preventDefault();
                var position = { x: $(btnTab).offset().left + $(btnTab).outerWidth(), y: $(btnTab).offset().top + $(btnTab).outerHeight() };
                btnTab.trigger({type: 'mouseup',which: 3,clientX: position.x,clientY: position.y,pageX: position.x,pageY: position.y});
            }
            if (((e.which === 46) || (e.which === 82 && e.ctrlKey)) && !this.element.find(".e-dialog:visible").length > 0 && !ej.isNullOrUndefined(btnTab)) {
                    e.preventDefault();
                    btnTab.parent().find(".removeSplitBtn:visible").click();
            }
            else if ((e.which === 46) || (e.which === 82 && e.ctrlKey) && ((!ej.isNullOrUndefined(this._curFocus.dialog) && this._curFocus.dialog.hasClass("measureEditor")) || (!ej.isNullOrUndefined(this._curFocus.editor) && this._curFocus.editor.hasClass("measureEditor")))) {
                if (!ej.isNullOrUndefined(this._curFocus.editor)) {
                    this._curFocus.editor.find(".removeMeasure:visible").click();
                }
                else if (!ej.isNullOrUndefined(this._curFocus.dialog)) {
                    this._curFocus.dialog.find(".removeMeasure:visible").click();
                }
            }
            if (e.keyCode == 79 && this.element.find(".e-dialog:visible").length > 0) {
                if (e.ctrlKey) {
                    e.preventDefault();
                    if (!ej.isNullOrUndefined(this._curFocus.icon) && this._curFocus.icon.hasClass("mdxImg")) {
                        this.element.find(".dialogCancelBtn:visible").click();
                    }
                    else {
                        this.element.find(".dialogOKBtn:visible").click();
                    }
                    this._curFocus.dialog = null;
                }
            }
            if (e.which === 70 && e.ctrlKey && !ej.isNullOrUndefined(btnTab)) {
                    btnTab.click();
            }
            if (e.keyCode == 67 && this.element.find(".e-dialog:visible").length > 0) {
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.element.find(".dialogCancelBtn:visible").click();
                    this._curFocus.dialog = null;
                }
            }           
            if (this.element.find(".e-dialog:visible").length > 0 && e.keyCode == 27) {
                if (!ej.isNullOrUndefined(this._curFocus.icon)) {
                    this._curFocus.icon.attr("tabindex", "-1").addClass("hoverCell").focus().mouseover();
                }
                else if (!ej.isNullOrUndefined(this._curFocus.editor)) {
                    this._curFocus.editor.attr("tabindex", "-1").addClass("hoverCell").focus().mouseover();
                }
                else if (!ej.isNullOrUndefined(this._curFocus.dialog)) {
                    this._curFocus.dialog.attr("tabindex", "-1").addClass("hoverCell").focus().mouseover();
                }
                this._curFocus.dialog = null;
                this._index.editor = 0;
            }
            else if (this.element.find(".e-dialog:visible").length == 0 && e.keyCode == 27 && $(".fullScreenView").length != 0) {
                this._maxViewClsBtnClick();
                if (!ej.isNullOrUndefined(oclientProxy.ogridObj._curFocus.cell)) {
                    oclientProxy.ogridObj._curFocus.cell.focus().mouseover();
                }
                else if (!this._curFocus.tab.hasClass("e-icon")) {
                    this._curFocus.tab.focus().mouseover();
                }               
            }
            else if (this.element.find(".chartTypesDialog:visible").length > 0 && e.which === 27) {
                this.element.find(".chartTypesDialog").remove();
                this._curFocus.chartimg = null;
            }
            else if ($(".pivotTree:visible,.pivotTreeContext:visible").length > 0 && e.which === 27) {
                if (!ej.isNullOrUndefined(this._curFocus.tree)) {
                    this._curFocus.tree.attr("tabindex", "-1").focus().addClass("hoverCell");
                }
                else if (!ej.isNullOrUndefined(btnTab)) {
                    btnTab.attr("tabindex", "-1").focus().addClass("hoverCell");
                }
            }
            if (((e.which === 9 && e.shiftKey) || e.which === 9) && this.element.find(".e-dialog:visible").length > 0) {
                e.preventDefault();
                this._curFocus.editor = null;
                this.element.find(".e-dialog .hoverCell:visible").removeClass("hoverCell");
                var focEle;
                if ((!ej.isNullOrUndefined(oclientProxy._dllSortMeasure) && oclientProxy._dllSortMeasure.model.enabled && this.element.find("#measuresList_container:visible").length > 0) || (!ej.isNullOrUndefined(oclientProxy._dllfMeasuresList) && oclientProxy._dllfMeasuresList.model.enabled && this.element.find("#fMeasuresList_container:visible").length > 0)) {
                    focEle = this.element.find(".e-dialog .filterEnable:visible,#measuresList_container:visible,#fMeasuresList_container:visible,#filterCondition_container:visible,.e-dialog .filterFrom:visible:not([disabled='disabled']),.e-dialog .filterTo:visible:not([disabled='disabled']),.e-dialog .radioBtnAsc:visible:not([disabled='disabled']),.e-dialog .preserveHrchy:visible:not([disabled='disabled']),.e-dialog .dialogOKBtn:visible:not([aria-disabled='true']),.e-dialog .dialogCancelBtn:visible,.e-dialog .e-close:visible,.e-dialog .checkAll:visible,.e-dialog .unCheckAll:visible,.e-dialog .sortfiltTab .e-active:visible,.e-dialog .measureEditor:visible:first,.e-dialog .e-text:visible:first,.e-dialog .sortEnable:visible,.e-dialog .reportName:visible,#reportNameList_container:visible");
                }
                else {
                    focEle = this.element.find(".e-dialog .filterEnable:visible,.e-dialog .filterFrom:visible:not([disabled='disabled']),.e-dialog .filterTo:visible:not([disabled='disabled']),.e-dialog .radioBtnAsc:visible:not([disabled='disabled']),.e-dialog .preserveHrchy:visible:not([disabled='disabled']),.e-dialog .dialogOKBtn:visible:not([aria-disabled='true']),.e-dialog .dialogCancelBtn:visible,.e-dialog .e-close:visible,.e-dialog .checkAll:visible,.e-dialog .unCheckAll:visible,.e-dialog .sortfiltTab .e-active:visible,.e-dialog .measureEditor:visible:first,.e-dialog .e-text:visible:first,.e-dialog .sortEnable:visible,.e-dialog .reportName:visible,#reportNameList_container:visible");
                }      
                if (!ej.isNullOrUndefined(this._curFocus.dialog)) {
                    this._curFocus.dialog.attr("tabindex", "0").removeClass("hoverCell").mouseleave();
                    if (e.which === 9 && e.shiftKey) {
                        this._index.dialog = this._index.dialog - 1 < 0 ? focEle.length - 1 : this._index.dialog - 1;
                    }
                    else if (e.which === 9){
                        this._index.dialog = this._index.dialog + 1 > focEle.length - 1 ? 0 : this._index.dialog + 1;
                    }
                    this._curFocus.dialog = focEle.eq(this._index.dialog);
                }
                else {
                    this._index.dialog = focEle.length > 4 ? 4 : 2;
                    this._curFocus.dialog = focEle.eq(this._index.dialog);
                }
                if (this._curFocus.dialog.hasClass("e-input") || this._curFocus.dialog.attr("type") == "radio") {
                    this._curFocus.dialog.attr("tabindex", "-1").focus();
                }
                else {
                    this._curFocus.dialog.attr("tabindex", "-1").focus().addClass("hoverCell").mouseover;
                }
            }
            else if (((e.which === 9 && e.shiftKey) || e.which === 9) && !$(".pivotTree:visible,.pivotTreeContext:visible").length > 0) {
                e.preventDefault();
                this.element.find(".hoverCell").removeClass("hoverCell").mouseleave();
                this.element.find(".e-node-focus").removeClass("e-node-focus");
                this._index.button = 1;this._index.icon = 1;this._index.chartimg = 0;this._index.tree = 0;this._index.dialog = 0;
                this._curFocus.button = null;this._curFocus.icon = null;this._curFocus.chartimg = null;this._curFocus.tree = null;this._curFocus.editor = null;this._curFocus.dialog = null;
                var focEle;
                if ($(".fullScreenView").length != 0) {
                    if ($("[role='columnheader']:visible:not([p='0,0'])").first().length > 0) {
                        focEle = $("[role='columnheader']:visible:not([p='0,0']):first");
                    }
                }
                else {
                    focEle = this.element.find("[role='columnheader']:visible:not([p='0,0']):first,.reportToolbar li:visible:first,#reportList_wrapper:visible,#cubeSelector_wrapper:visible,.cubeTreeView .e-text:visible:first,.categoricalAxis button:visible:first,.rowAxis button:visible:first,.slicerAxis button:visible:first,.toggleExpandButton:visible:first,.toggleCollapseButton:visible:first,#clientTab .e-active:visible");
                }
                if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.attr("tabindex", "0").removeClass("hoverCell").mouseleave();
                    if (e.which === 9 && e.shiftKey) {

                        this._index.tab = this._index.tab - 1 < 0 ? focEle.length - 1 : this._index.tab - 1;
                    }
                    else if (e.which === 9){
                        this._index.tab = this._index.tab + 1 > focEle.length - 1 ? 0 : this._index.tab + 1;
                    }
                    this._curFocus.tab = focEle.eq(this._index.tab).attr("tabindex", "-1").focus().addClass("hoverCell").mouseover();
                    if (this._curFocus.tab.hasClass("e-button")) {
                        this._curFocus.tab.parent().find(".removeSplitBtn:visible").addClass("hoverCell");
                    }
                }
                else {
                    this._index.tab = 0;
                    this._curFocus.tab = focEle.eq(this._index.tab).attr("tabindex", "-1").focus().addClass("hoverCell").mouseover();
                    if (this._curFocus.tab.hasClass("e-button")) {
                        this._curFocus.tab.parent().find(".removeSplitBtn:visible").addClass("hoverCell");
                    }
                }
            }
            if (this.element.find(".e-dialog:visible").length > 0 && e.keyCode == 13) {
                e.preventDefault();
                if (!ej.isNullOrUndefined(this._curFocus.editor)) {
                    if (this._curFocus.editor.hasClass("e-text")) {
                        this.element.find(".e-dialog .hoverCell").parent().find(".e-chkbox-small").click();
                    }
                }
                else if (!ej.isNullOrUndefined(this._curFocus.dialog)) {
                    if (this._curFocus.dialog.hasClass("e-text")) {
                        this.element.find(".e-dialog .hoverCell").parent().find(".e-chkbox-small").click();
                    }
                    else {
                        this._curFocus.dialog.click();
                        if (this._curFocus.dialog.hasClass("dialogOKBtn") || this._curFocus.dialog.hasClass("dialogCancelBtn") || this._curFocus.dialog.hasClass("e-close")) {
                            this._curFocus.dialog = null;
                        }
                        this._index.editor = 0;
                    }
                }
                else if (!ej.isNullOrUndefined(this._curFocus.icon)) {
                    this._curFocus.icon.attr("tabindex", "-1").focus().mouseover();
                }
                else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.attr("tabindex", "-1").focus().mouseover();
                }    
            }
            else if (e.keyCode == 13 && !ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.attr("role") != "columnheader") {
                e.preventDefault();
                if (!ej.isNullOrUndefined(this._curFocus.icon) || (!ej.isNullOrUndefined(this._curFocus.tab) && !$(".pivotTree:visible,.pivotTreeContext:visible").length > 0)) {
                    this.element.find(".hoverCell:visible")[0].click();
                }
                    if (!ej.isNullOrUndefined(this.element.find(".chartTypesDialog")) && (!ej.isNullOrUndefined(this._curFocus.chartimg))) {
                        this._curFocus.chartimg.click();
                        if (!ej.isNullOrUndefined(this._curFocus.icon)) {
                            this._curFocus.icon.attr("tabindex", "-1").focus().mouseover();
                        }
                        this._index.chartimg = 0;
                        this._curFocus.chartimg = null;
                    }
            }
            if ((e.which === 39 || e.which === 37) && this.element.find(".e-dialog:visible").length > 0 && this.element.find(".e-dialog .e-text:visible").hasClass("hoverCell")) {
                this.element.find(".e-dialog .hoverCell").parent().find(".e-plus,.e-minus").click();
            }
            else if ((e.which === 39 || e.which === 37) && (this.element.find(".cubeTreeView .e-text:visible").hasClass("hoverCell")) && !this.element.find(".editorTreeView:visible").length > 0) {
                this.element.find(".cubeTreeView .hoverCell").parent().find(".e-plus,.e-minus").click();
            }
            else if ((e.which === 37 || e.which === 39) && this.element.find(".chartTypesDialog").length > 0) {
                e.preventDefault();
                    var dia = this.element.find(".chartTypesDialog");
                    dia.tabindex = -1;
                    dia.focus();
                    var td = dia.find(".chartTypesIcon");                  
                        if (!ej.isNullOrUndefined(this._curFocus.chartimg)) {
                            this._curFocus.chartimg.removeClass("hoverCell").mouseleave();
                            if (e.which === 39) {
                                this._index.chartimg = this._index.chartimg + 1 > td.length - 1 ? 0 : this._index.chartimg + 1;
                            }
                            else if (e.which === 37) {
                                this._index.chartimg = this._index.chartimg - 1 < 0 ? td.length - 1 : this._index.chartimg - 1;
                            }
                            this._curFocus.chartimg = td.eq(this._index.chartimg).addClass("hoverCell").mouseover();
                        }
                        else {
                            this._index.chartimg = e.which == 39 ? 0 : e.which == 37 ? td.length - 1 : 0 ;
                            this._curFocus.chartimg = td.eq(this._index.chartimg).addClass("hoverCell").mouseover();
                        }               
            }
            else if ((e.which === 37 || e.which === 39) && !ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.hasClass("e-icon") && !this._curFocus.tab.hasClass("toggleCollapseButton") && !this._curFocus.tab.hasClass("toggleExpandButton") && !this.element.find(".e-dialog:visible").length > 0) {
                e.preventDefault();
                this._curFocus.tab.removeClass("hoverCell").mouseleave();
                var td = this.element.find(".reportToolbar .e-icon:visible:not(.reportCol)");                
                    if (!ej.isNullOrUndefined(this._curFocus.icon)) {
                        this._curFocus.icon.removeClass("hoverCell").mouseleave();
                        if (e.which === 39) {
                            this._index.icon = this._index.icon + 1 > td.length - 2 ? 0 : this._index.icon + 1;
                        }
                        else if (e.which === 37) {
                            this._index.icon = this._index.icon - 1 < 0 ? td.length - 2 : this._index.icon - 1;
                        }
                        this._curFocus.icon = td.eq(this._index.icon).addClass("hoverCell").mouseover();
                        }
                        else {
                            this._index.icon = e.which == 39 ? 1 : e.which == 37 ? td.length - 2 : 0;
                            this._curFocus.icon = td.eq(this._index.icon).addClass("hoverCell").mouseover();
                        }
            }
            if ((e.which === 40 || e.which === 38) && this.element.find(".e-dialog:visible").length > 0 && !$(".pivotTree:visible,.pivotTreeContext:visible").length > 0 && (this.element.find(".e-dialog .e-text").hasClass("hoverCell") || this.element.find(".e-dialog .measureEditor").hasClass("hoverCell"))) {
                e.preventDefault();
                this.element.find(".e-dialog .hoverCell").removeClass("hoverCell");
                this.element.find(".e-dialog .e-node-focus").removeClass("e-node-focus");
                if (!ej.isNullOrUndefined(this._curFocus.dialog)) {
                    this._curFocus.dialog.mouseleave();
                }
                var td = this.element.find(".e-dialog .measureEditor:visible,.e-dialog .e-text:visible");
                        if (!ej.isNullOrUndefined(this._curFocus.editor)) {
                            this._curFocus.editor.attr("tabindex", "0").removeClass("hoverCell");
                            if (e.which === 40) {
                                this._index.editor = this._index.editor + 1 > td.length - 1 ? 0 : this._index.editor + 1;
                            }
                            else if (e.which === 38) {
                                this._index.editor = this._index.editor - 1 < 0 ? td.length - 1 : this._index.editor - 1;
                            }
                            this._curFocus.editor = td.eq(this._index.editor).attr("tabindex", "0").focus().addClass("hoverCell");
                        }
                        else {
                            if (td.length > 1) {
                                this._index.editor = e.which == 40 ? 1 : e.which == 38 ? td.length - 1 : 0;
                            }
                            else {
                                this._index.editor = 0;
                            }
                            this._curFocus.editor = td.eq(this._index.editor).attr("tabindex", "0").focus().addClass("hoverCell");
                        }
                }
            else if ((e.which === 40 || e.which === 38) && !this.element.find(".e-dialog:visible").length > 0 && !ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.hasClass("e-text") && !$(".pivotTree:visible,.pivotTreeContext:visible").length > 0) {
                this.element.find(".hoverCell").removeClass("hoverCell");
                this._curFocus.tab.mouseleave();
                e.preventDefault();
                var td = this.element.find(".cubeTreeView .e-text:visible");
                if (!ej.isNullOrUndefined(this._curFocus.tree)) {
                    this._curFocus.tree.attr("tabindex", "0").removeClass("hoverCell").mouseleave();
                    if (e.which === 40) {
                        this._index.tree = this._index.tree + 1 > td.length - 1 ? 0 : this._index.tree + 1;
                    }
                    else if (e.which === 38) {
                        this._index.tree = this._index.tree - 1 < 0 ? td.length - 1 : this._index.tree - 1;
                    }
                    this._curFocus.tree = td.eq(this._index.tree).attr("tabindex", "-1").focus().addClass("hoverCell").mouseover();
                    this.element.find(".e-node-focus").removeClass("e-node-focus");
                }
                else {
                    this._index.tree = e.which == 40 ? 1 : e.which == 38 ? td.length - 1 : 0;
                    this._curFocus.tree = td.eq(this._index.tree).attr("tabindex", "-1").focus().addClass("hoverCell").mouseover();
                    this.element.find(".e-node-focus").removeClass("e-node-focus");
                }
            }
            else if ((e.which === 40 || e.which === 38) && !ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.hasClass("e-button") && !$(".pivotTree:visible,.pivotTreeContext:visible").length > 0 && !this.element.find(".e-dialog:visible").length > 0) {
                e.preventDefault();
                var td = null;
                if (this._curFocus.tab.parent().parent().hasClass("categoricalAxis") || this._curFocus.tab.parent().parent().hasClass("rowAxis") || this._curFocus.tab.parent().parent().hasClass("slicerAxis")) {
                    if (this._curFocus.tab.parent().parent().hasClass("categoricalAxis")) {
                        td = this.element.find(".categoricalAxis button");
                    }
                    else if (this._curFocus.tab.parent().parent().hasClass("rowAxis")) {
                        td = this.element.find(".rowAxis button");
                    }
                    else if (this._curFocus.tab.parent().parent().hasClass("slicerAxis")) {
                        td = this.element.find(".slicerAxis button");
                    }
                    if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                        this._curFocus.tab.removeClass("hoverCell").attr("tabindex", "0").mouseleave();
                        this._curFocus.tab.parent().find(".removeSplitBtn:visible").focus().removeClass("hoverCell");
                    }
                    if (!ej.isNullOrUndefined(this._curFocus.button)) {
                        this._curFocus.button.attr("tabindex", "0").removeClass("hoverCell");
                        this._curFocus.button.parent().find(".removeSplitBtn:visible").removeClass("hoverCell");
                            if (e.which === 40) {
                                this._index.button = this._index.button + 1 > td.length - 1 ? 0 : this._index.button + 1;
                            }
                            else if (e.which === 38) {
                                this._index.button = this._index.button - 1 < 0 ? td.length - 1 : this._index.button - 1;
                            }
                            this._curFocus.button = td.eq(this._index.button).attr("tabindex", "0").focus().addClass("hoverCell");
                            this._curFocus.button.parent().find(".removeSplitBtn:visible").addClass("hoverCell");
                        }
                    else {
                        this._index.button = e.which == 40 ? td.length > 1 ? 1 : 0 : e.which == 38 ? td.length - 1 : 0;
                        this._curFocus.button = td.eq(this._index.button).attr("tabindex", "0").focus().addClass("hoverCell");
                        this._curFocus.button.parent().find(".removeSplitBtn:visible").addClass("hoverCell");
                        }
                }
            }
        },

        _wireMeasureRemoveEvent: function () {

            this.element.find(".removeMeasure").click(function (evt) {
                oclientProxy._isMembersFiltered = true;
                $($(evt.target).parent()).remove();
            });
        },

        _wireEditorRemoveEvent: function () {

            this.element.find(".removeSplitBtn").click(function (evt) {
                oclientWaitingPopup.show();
                $($(evt.target).parent()).remove();
                if (oclientProxy._currentReportItems.length != 0) {
                    if (oclientProxy._treeViewData.hasOwnProperty($(evt.target).parent().find("button").attr("title"))) {
                        delete oclientProxy._treeViewData[$(evt.target).parent().find("button").attr("title")];
                        oclientProxy._currentReportItems.splice($.inArray($(evt.target).parent().find("button").attr("title"), oclientProxy._currentReportItems), 1);
                    }
                }
                oclientProxy._off(this.element, "click", ".removeSplitBtn");
                if (oclientProxy.model.beforeServiceInvoke != null)
                    oclientProxy._trigger("beforeServiceInvoke", { action: "removeSplitButton", element: this.element, customObject: oclientProxy.model.customObject });
                var serializedCustomObject = JSON.stringify(oclientProxy.model.customObject);
                oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.removeSplitButton, JSON.stringify({ "action": "removeSplitButton", "clientParams": $(evt.target).parent().attr("tag"), "olapReport": oclientProxy.currentReport, "clientReports": oclientProxy.reports, "customObject": serializedCustomObject }), oclientProxy._removeSplitButtonSuccess);
                oclientProxy._isNodeOrButtonDropped = true;
            });
        },

        _wireDialogEvent: function () {
            oclientProxy.element.find(".newReportImg, .addReportImg, .removeReportImg, .renameReportImg, .saveReportImg, .loadReportImg, .mdxImg, .e-txt,.colSortFilterImg, .rowSortFilterImg, .autoExecuteImg").bind(ej.eventType.click, function (evt) {
                if (evt.currentTarget.parentElement.className.indexOf("splitBtn") > -1) {
                    if ($($(evt.currentTarget).parents(".splitBtn")[0]).attr('tag').indexOf("NAMEDSET") > -1) return false;
                    oclientProxy._currentAxis = $($(evt.currentTarget).parents(".splitBtn")[0]).attr('tag').split(':')[0];
                }
                if (!isDragging && !isDropped) {
                    evt.preventDefault();
                    if (evt.target.innerHTML != oclientProxy._getLocalizedLabels("Cancel") && evt.target.innerHTML != oclientProxy._getLocalizedLabels("OK") && evt.target.parentElement.innerHTML != oclientProxy._getLocalizedLabels("Cancel") && evt.target.parentElement.innerHTML != oclientProxy._getLocalizedLabels("OK")) {
                        oclientProxy._off(oclientProxy.element, "click", ".newReportImg, .addReportImg, .removeReportImg, .renameReportImg, .saveReportImg, .loadReportImg, .mdxImg, .e-txt,.colSortFilterImg, .rowSortFilterImg, .chartTypesImg, .autoExecuteImg");
                        if (evt.target.className.indexOf("loadReportImg") >= 0) {
                            oclientWaitingPopup.show();
                            if (oclientProxy.model.beforeServiceInvoke != null)
                                oclientProxy._trigger("beforeServiceInvoke", { action: "FetchingReportList", element: oclientProxy.element, customObject: oclientProxy.model.customObject });
                            var serializedCustomObject = JSON.stringify(oclientProxy.model.customObject);
                            oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.fetchReportList, JSON.stringify({ "customObject": serializedCustomObject }), oclientProxy._fetchReportListSuccess);
                        }
                        else if (evt.target.className.indexOf("colSortFilterImg") >= 0 || evt.target.className.indexOf("rowSortFilterImg") >= 0) {
                            if (evt.target.className.indexOf("SortImg") >= 0)
                                oclientProxy._sortOrFilterTab = "sort";
                            else
                                oclientProxy._sortOrFilterTab = "filter";
                            if (!(evt.target.className.indexOf("colSortFilterImg") >= 0 || evt.target.className.indexOf("rowSortFilterImg") >= 0) && (oclientProxy.element.find(".rowAxis").html() == "" && oclientProxy.element.find(".categoricalAxis").html() == ""))
                            oclientWaitingPopup.show();
                            oclientProxy._isSorted = false;
                            oclientProxy._isFiltered = false;
                            oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.toolbarServices, JSON.stringify({ "action": "FetchSortState", "toolbarOperation": null, "clientInfo": (oclientProxy._axis = (evt.target.className.indexOf("colSortFilterImg") >= 0) ? "Column" : "Row"), "olapReport": oclientProxy.currentReport, "clientReports": "" }), oclientProxy._fetchSortState);
                        }
                        else if (evt.target.className.indexOf("mdx") >= 0) {
                            oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.mdxQuery, JSON.stringify({ "olapReport": oclientProxy.currentReport }), oclientProxy._mdxQuery);
                        }
                        else if (evt.target.className.indexOf("autoExecute") >= 0) {
                            oclientProxy.model.enableDeferUpdate = false;
                            oclientProxy._renderControls();
                            oclientProxy._deferReport = oclientProxy.currentReport;
                            oclientProxy.model.enableDeferUpdate = true;
                        }
                        else
                            oclientProxy._createDialogRequest(evt);
                        oclientProxy._dimensionName = $(evt.currentTarget).parent().attr("tag");
                    }
                }
                isDropped = false;
            });
            this.element.find(".excelExportImg, .wordExportImg, .pdfExportImg").click(function (e) {
                if (oclientProxy.model.displaySettings.mode != oclientProxy.model.clientExportMode && oclientProxy.model.displaySettings.mode != ej.olap.OlapClient.DisplayMode.ChartAndGrid && oclientProxy.model.clientExportMode != ej.olap.OlapClient.ClientExportMode.ChartAndGrid) return;
                if (ej.browserInfo().name == "msie" && ej.browserInfo().version <= 8)
                    oclientProxy.model.clientExportMode = ej.olap.OlapClient.ClientExportMode.GridOnly;
                var exportOption = e.target.className.indexOf("excel") >= 0 ? "Excel" : e.target.className.indexOf("word") >= 0 ? "Word" : "Pdf";
                var params, chartString, legendString, mode;
                if (oclientProxy.model.displaySettings.mode != ej.olap.OlapClient.DisplayMode.GridOnly && oclientProxy.model.clientExportMode != ej.olap.OlapClient.ClientExportMode.GridOnly) {
                    oclientProxy.chartObj = null;
                    oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                    if (ej.isNullOrUndefined(oclientProxy.chartObj) && !ej.isNullOrUndefined(oclientProxy.otreemapObj))
                        oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                    if ((oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() != "treemap") {
                        var zoomFactor = oclientProxy.chartObj.model.primaryXAxis.zoomFactor;
                        oclientProxy.chartObj.model.primaryXAxis.zoomFactor = 1;
                        oclientProxy.chartObj.model.enableCanvasRendering = true;
                        oclientProxy.chartObj.redraw();
                        oclientProxy.chartObj.model.primaryXAxis.zoomFactor = zoomFactor;
                        oclientProxy.chartObj.redraw();
                        var canvasElement = oclientProxy.chartObj["export"]();
                        chartString = canvasElement.toDataURL("image/png");
                        //if (chartsvgElement != undefined && chartsvgElement != null) {
                        //    var chartsvg = ej.buildTag("div").append(chartsvgElement).html();
                        //    canvg(canvasElement, chartsvg);
                        //    chartString = canvasElement.toDataURL("image/png");
                        //    var legendsvgElement = $("#legend_" + oclientProxy.ochartObj._id + "Container_svg").clone()[0];
                        //    var legendsvg = ej.buildTag("div").append(legendsvgElement).html();
                        //    canvg(canvasElement, legendsvg);
                        //    legendString = canvasElement.toDataURL("image/png");
                        //}
                        //else {
                        //    if (oclientProxy.model.displaySettings.mode == ej.olap.OlapClient.DisplayMode.ChartOnly || oclientProxy.model.clientExportMode == ej.olap.OlapClient.ClientExportMode.ChartOnly) return;
                        //    oclientProxy.model.clientExportMode = ej.olap.OlapClient.ClientExportMode.GridOnly;
                        //}
                    }
                }
                if (oclientProxy.model.displaySettings.mode != ej.olap.OlapClient.DisplayMode.ChartOnly && oclientProxy.model.clientExportMode != ej.olap.OlapClient.ClientExportMode.ChartOnly) {
                    var colorDetails = {
                        valueCellColor: oclientProxy.ogridObj.element.find(".value").css("color"),
                        valueCellBGColor: oclientProxy.ogridObj.element.find(".value").css("background-color"),
                        summaryCellColor: oclientProxy.ogridObj.element.find(".summary").css("color"),
                        summaryCellBGColor: oclientProxy.ogridObj.element.find(".summary").css("background-color")
                    }
                }
                if (oclientProxy.model.displaySettings.mode == ej.olap.OlapClient.DisplayMode.GridOnly || oclientProxy.model.clientExportMode == ej.olap.OlapClient.ClientExportMode.GridOnly) {
                    mode = ej.olap.OlapClient.ClientExportMode.GridOnly;
                    params = {
                        args: JSON.stringify({
                            exportMode: mode,
                            exportOption: exportOption,
                            currentReport: oclientProxy.model.enableDeferUpdate ? oclientProxy._deferReport : oclientProxy.currentReport,
                            layout: oclientProxy.gridLayout(),
                            colorSettings: JSON.stringify(colorDetails)
                        })
                    };
                }
                else if (oclientProxy.model.displaySettings.mode == ej.olap.OlapClient.DisplayMode.ChartOnly || oclientProxy.model.clientExportMode == ej.olap.OlapClient.ClientExportMode.ChartOnly) {
                    mode = ej.olap.OlapClient.ClientExportMode.ChartOnly;
                    params = {
                        args: JSON.stringify({
                            exportMode: mode,
                            exportOption: exportOption,
                            currentReport: oclientProxy.model.enableDeferUpdate ? oclientProxy._deferReport : oclientProxy.currentReport,
                            chartdata: chartString.split(',')[1],
                            legenddata: "",//legendString.split(',')[1],
                            bgColor: $(oclientProxy.ochartObj.element).css('background-color')
                        })
                    };
                }
                else {
                    mode = ej.olap.OlapClient.ClientExportMode.ChartAndGrid;
                    params = {
                        args: JSON.stringify({
                            exportMode: mode,
                            exportOption: exportOption,
                            currentReport: oclientProxy.model.enableDeferUpdate ? oclientProxy._deferReport : oclientProxy.currentReport,
                            layout: oclientProxy.gridLayout(),
                            colorSettings: JSON.stringify(colorDetails),
                            chartdata: chartString.split(',')[1],
                            legenddata: "",//legendString.split(',')[1],
                            bgColor: $(oclientProxy.ochartObj.element).css('background-color')
                        })
                    };
                }
                oclientProxy.doPostBack(oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.exportOlapClient, params);
            });
            this.element.find(".toggleaxisImg").click(function (evt) {
                if (oclientProxy.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                    oclientProxy.chartObj = null;
                    oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                    if (ej.isNullOrUndefined(oclientProxy.chartObj) && !ej.isNullOrUndefined(oclientProxy.otreemapObj))
                        oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                }
	           if ((oclientProxy.element.find(".rowAxis").html() != "") || (oclientProxy.element.find(".categoricalAxis").html() != ""))
	                oclientProxy.doAjaxPost("POST",oclientProxy.model.url + "/"+ oclientProxy.model.serviceMethodSettings.toggleAxis,JSON.stringify({"action": "toggleAxis","currentReport":oclientProxy.currentReport, "clientReports": oclientProxy.reports}),oclientProxy._toggleAxisSuccess);
            });

            this.element.find(".chartTypesImg").click(function (evt) {
                var chartTypesDlg = ej.buildTag("div.chartTypesDialog#chartTypesDialog", ej.buildTag("table", ej.buildTag("tbody", ej.buildTag("tr",
                    ej.buildTag("td", ej.buildTag("div.line chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("Line"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.spline chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("Spline"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.column chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("Column"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.area chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("Area"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.splinearea chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("SplineArea"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML +
                    ej.buildTag("tr", ej.buildTag("td", ej.buildTag("div.stepline chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("StepLine"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.steparea chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("StepArea"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.pie chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("Pie"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.bar chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("Bar"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.stackingarea chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("StackingArea"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML +
                    ej.buildTag("tr", ej.buildTag("td", ej.buildTag("div.stackingcolumn chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("StackingColumn"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.stackingbar chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("StackingBar"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.funnel chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("Funnel"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.pyramid chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("Pyramid"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.doughnut chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("Doughnut"), tabindex: 0 })[0].outerHTML)[0].outerHTML)[0].outerHTML +
                    ej.buildTag("tr", ej.buildTag("td", ej.buildTag("div.scatter chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("Scatter"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    ej.buildTag("td", ej.buildTag("div.bubble chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("Bubble"), tabindex: 0 })[0].outerHTML)[0].outerHTML +
                    (oclientProxy.model.enablePivotTreeMap ? (ej.buildTag("td", ej.buildTag("div.treemap chartTypesIcon").attr({ "title": oclientProxy._getLocalizedLabels("TreeMap"), tabindex: 0 })[0].outerHTML)[0].outerHTML) : ""))[0].outerHTML)[0].outerHTML)[0].outerHTML);

                var ele = oclientProxy.element.find('div.chartTypesDialog');
                if (ele.length == 0) {
                    $(chartTypesDlg).appendTo(oclientProxy.element);
                    $(chartTypesDlg).css("left", this.offsetLeft + 20 + "px").css("top", this.offsetTop + 20 + "px");
                    oclientProxy.element.find("." + oclientProxy.ochartObj.seriesType()).addClass("activeChartType");
                }
                $(".chartTypesIcon").click(function (e) {
                    oclientProxy.element.find(".chartTypesIcon").removeClass("activeChartType");
                    $(chartTypesDlg).remove();
                    var selectedtype = e.target.className.split(" ")[0];
                    oclientProxy.model.chartType = selectedtype;
                    oclientProxy.ochartObj.model.type = selectedtype;
                    oclientProxy.ochartObj.model.commonSeriesOptions.type = selectedtype;
                    if (selectedtype == "funnel") {
                        oclientProxy.ochartObj.model.commonSeriesOptions.marker = {
                            dataLabel: {
                                visible: true,
                                shape: 'none',
                                font: { color: oclientProxy.element.css("color"), size: '12px', fontWeight: 'lighter' }
                            }
                        }
                    }
                    if (oclientProxy.ochartObj.getJSONRecords() != null) {
                        oclientProxy.chartObj = null;
                        oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                        if (ej.isNullOrUndefined(oclientProxy.chartObj) && !ej.isNullOrUndefined(oclientProxy.otreemapObj))
                            oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                        if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                            oclientProxy._isrenderTreeMap = true;
                            if (!oclientProxy.model.enableDeferUpdate) {
                                if (oclientProxy.model.enablePivotTreeMap && this.title.toLocaleLowerCase() == "treemap") {
                                    if (oclientProxy.model.enablePivotTreeMap) {
                                        oclientProxy.element.find("#PivotChartContainer").remove();
                                        oclientProxy.element.find("#PivotChart").removeClass("e-pivotchart")
                                        if (oclientProxy.element.find("#PivotChart").hasClass("e-pivottreemap"))
                                            oclientProxy.otreemapObj.renderControlSuccess({ "JsonRecords": JSON.stringify(oclientProxy.ochartObj.getJSONRecords()), "OlapReport": oclientProxy.ochartObj.getOlapReport() });
                                        else {
                                            oclientProxy.element.find("#PivotChart").ejPivotTreeMap({ url: oclientProxy.model.url, canResize: oclientProxy.model.isResponsive, currentReport: oclientProxy.currentReport, locale: oclientProxy.locale(), size: { height: oclientProxy._chartHeight, width: oclientProxy._chartWidth }, drillSuccess: ej.proxy(oclientProxy._treemapDrillSuccess, oclientProxy), beforeServiceInvoke: oclientProxy.model.treeMapLoad });
                                            oclientProxy.otreemapObj = oclientProxy.element.find('#PivotChart').data("ejPivotTreeMap");
                                            oclientProxy.chartObj = null;
                                        }
                                    }
                                }
                                else {
                                    oclientProxy.element.find("#PivotChartTreeMapContainer").remove();
                                    oclientProxy.element.find("#PivotChart").removeClass("e-pivottreemap")
                                    if (oclientProxy.element.find("#PivotChart").hasClass("e-pivotchart"))
                                        oclientProxy.ochartObj.renderControlSuccess({ "JsonRecords": JSON.stringify(oclientProxy.ochartObj.getJSONRecords()), "OlapReport": oclientProxy.ochartObj.getOlapReport() });
                                    else {
                                        oclientProxy.element.find("#PivotChart").ejPivotChart({ url: oclientProxy.model.url, enableRTL: oclientProxy.model.enableRTL, canResize: oclientProxy.model.isResponsive, currentReport: oclientProxy.currentReport, customObject: oclientProxy.model.customObject, locale: oclientProxy.locale(), showTooltip: true, size: { height: oclientProxy._chartHeight, width: oclientProxy._chartWidth }, commonSeriesOptions: { type: oclientProxy.model.chartType, tooltip: { visible: true } }, beforeServiceInvoke: oclientProxy.model.chartLoad, drillSuccess: ej.proxy(oclientProxy._chartDrillSuccess, oclientProxy) });
                                        oclientProxy.ochartObj = oclientProxy.element.find('#PivotChart').data("ejPivotChart");
                                        oclientProxy.chartObj = null;
                                    }

                                }
                            }
                            else {
                                oclientProxy._ischartTypesChanged = true;
                                if (oclientProxy.model.enablePivotTreeMap && this.title.toLocaleLowerCase() == "treemap") {
                                    if (oclientProxy.model.enablePivotTreeMap) {
                                        oclientProxy.element.find("#PivotChartContainer").remove();
                                        oclientProxy.element.find("#PivotChart").removeClass("e-pivotchart")
                                        if (oclientProxy.element.find("#PivotChart").hasClass("e-pivottreemap"))
                                            oclientProxy.otreemapObj.renderTreeMapFromJSON(oclientProxy.ochartObj.getJSONRecords());
                                        else {
                                            oclientProxy.element.find("#PivotChart").ejPivotTreeMap({ url: oclientProxy.model.url, canResize: oclientProxy.model.isResponsive, currentReport: oclientProxy.currentReport, locale: oclientProxy.locale(), size: { height: oclientProxy._chartHeight, width: oclientProxy._chartWidth }, drillSuccess: ej.proxy(oclientProxy._treemapDrillSuccess, oclientProxy), beforeServiceInvoke: oclientProxy.model.treeMapLoad });
                                            oclientProxy.otreemapObj = oclientProxy.element.find('#PivotChart').data("ejPivotTreeMap");
                                            oclientProxy._isrenderTreeMap = true;
                                            oclientProxy.chartObj = null;
                                        }
                                    }
                                }
                                else {
                                    oclientProxy.element.find("#PivotChartTreeMapContainer").remove();
                                    oclientProxy.element.find("#PivotChart").removeClass("e-pivottreemap")
                                    if (oclientProxy.element.find("#PivotChart").hasClass("e-pivotchart"))
                                        oclientProxy.ochartObj.renderControlSuccess({ "JsonRecords": JSON.stringify(oclientProxy.ochartObj.getJSONRecords()), "OlapReport": oclientProxy.ochartObj.getOlapReport() });
                                    else {
                                        oclientProxy.element.find("#PivotChart").ejPivotChart({ url: oclientProxy.model.url, enableRTL: oclientProxy.model.enableRTL, canResize: oclientProxy.model.isResponsive, currentReport: oclientProxy.currentReport, customObject: oclientProxy.model.customObject, locale: oclientProxy.locale(), showTooltip: true, size: { height: oclientProxy._chartHeight, width: oclientProxy._chartWidth }, commonSeriesOptions: { type: oclientProxy.model.chartType, tooltip: { visible: true } }, beforeServiceInvoke: oclientProxy.model.chartLoad, drillSuccess: ej.proxy(oclientProxy._chartDrillSuccess, oclientProxy) });
                                        oclientProxy.ochartObj = oclientProxy.element.find('#PivotChart').data("ejPivotChart");
                                        oclientProxy.chartObj = null;
                                    }
                                }
                            }
                            var serializedCustomObject = JSON.stringify(oclientProxy.model.customObject);
                            oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.updateReport, JSON.stringify({
                                "action": "chartTypeChanged", "clientParams": selectedtype, "olapReport": oclientProxy.currentReport, "clientReports": oclientProxy.reports, "customObject": serializedCustomObject
                            }), oclientProxy._chartTypeChangedSuccess);
                        }
                    }
                    else
                        oclientWaitingPopup.hide();
                });
            });

            $(document).click(function (e) {
                if (e.target.className.indexOf('chartTypesImg') == -1)
                    $(".chartTypesDialog").remove();
            })

            this.element.find(".dialogCancelBtn").bind(ej.eventType.click, function (e) {
                e.preventDefault();
                oclientProxy.element.find(".e-dialog").hide();
                oclientProxy.element.find(".e-dialog, .clientDialog").remove();
                oclientProxy._onPreventPanelClose();
            });

            this.element.find(".dialogOKBtn").bind(ej.eventType.click, function (e) {
                e.preventDefault();
                if (oclientProxy.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                    oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                    if (ej.isNullOrUndefined(oclientProxy.chartObj) && oclientProxy.model.enablePivotTreeMap && !ej.isNullOrUndefined(oclientProxy.otreemapObj))
                        oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                }
                var loadDlgTitle = (ej.browserInfo().name == "msie" && ej.browserInfo().version <= 8) ? oclientProxy._dialogTitle : oclientProxy.element.find(".e-titlebar")[0].textContent == undefined ? oclientProxy.element.find(".e-titlebar")[0].innerText : oclientProxy.element.find(".e-titlebar")[0].textContent;
                if (loadDlgTitle == oclientProxy._getLocalizedLabels("LoadReport")) {
                    var selectedReport = oclientProxy.element.find(".reportNameList")[0].value;
                    if (selectedReport != "") {
                        oclientWaitingPopup.show();
                        if (oclientProxy.model.beforeServiceInvoke != null)
                            oclientProxy._trigger("beforeServiceInvoke", { action: "loadReport", element: this.element, customObject: oclientProxy.model.customObject });
                        var serializedCustomObject = JSON.stringify(oclientProxy.model.customObject);
                        oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.loadReport, JSON.stringify({
                            "reportName": selectedReport, "olapReport": currentReport, "clientReports": oclientProxy.reports, "customObject": serializedCustomObject, "clientParams" : JSON.stringify(oclientProxy.model.enableMeasureGroups)
                        }), oclientProxy._toolbarOperationSuccess);
                    }
                    else {
                        oclientProxy._createAlertDialog(oclientProxy._getLocalizedLabels("LoadReportAlertMsg"));
                        return false;
                    }
                }

                else if (oclientProxy.element.find(".sortingDlg").length > 0) {
                    if (oclientProxy.element.find(".sortEnable")[0].checked == true && oclientProxy.element.find(".measuresList")[0].value == "") {
                        oclientProxy._createAlertDialog(oclientProxy._getLocalizedLabels("FilterMeasureSelectionAlertMsg"));
                        return false;
                    }
                    else if (oclientProxy.element.find(".filterEnable")[0].checked == true) {
                        if (oclientProxy.element.find(".fMeasuresList")[0].value == "") {
                            oclientProxy._createAlertDialog(oclientProxy._getLocalizedLabels("FilterMeasureSelectionAlertMsg")); return false;
                        }
                        else if (oclientProxy.element.find(".filterCondition")[0].value == "") {
                            oclientProxy._createAlertDialog(oclientProxy._getLocalizedLabels("FilterConditionAlertMsg")); return false;
                        }
                        else if (oclientProxy.element.find(".filterFrom")[0].value == "") {
                            oclientProxy._createAlertDialog(oclientProxy._getLocalizedLabels("FilterStartValueAlertMsg")); return false;
                        }
                        else if ((oclientProxy.element.find(".filterCondition")[0].value == "Between" || oclientProxy.element.find(".filterCondition")[0].value == "NotBetween") && oclientProxy.element.find(".filterTo")[0].value == "") {
                            oclientProxy._createAlertDialog(oclientProxy._getLocalizedLabels("FilterEndValueAlertMsg")); return false;
                        }

                    }
                    var sortingDetails = null, filteringDetails = null;
                    if ((oclientProxy._isSorted == false || oclientProxy._isSorted == true) && oclientProxy.element.find(".sortEnable")[0].checked == true)
                        sortingDetails = $("li[tag*='" + oclientProxy.element.find(".measuresList")[0].value + "']").attr("tag") + "::" + ((oclientProxy.element.find(".radioBtnAsc")[0].checked == true) ? "ASC" : "DESC") + "::" + oclientProxy._axis + "::" + ((oclientProxy.element.find(".preserveHrchy")[0].checked == true) ? "PHT" : "PHF");
                    else if (oclientProxy._isSorted == true && oclientProxy.element.find(".sortDisable")[0].checked == true)
                        sortingDetails = "Disable Sorting" + "::" + " " + "::" + oclientProxy._axis + "::" + " ";
                    else
                        sortingDetails = " " + "::" + " " + "::" + oclientProxy._axis + "::" + " ";
                    if ((oclientProxy._isFiltered == false || oclientProxy._isFiltered == true) && oclientProxy.element.find(".filterEnable")[0].checked == true)
                        filteringDetails = $("li[tag*='" + oclientProxy.element.find(".fMeasuresList")[0].value + "']").attr("tag") + "::" + oclientProxy.element.find(".filterCondition")[0].value + "::" + oclientProxy.element.find(".filterFrom")[0].value + "::" + oclientProxy.element.find(".filterTo")[0].value;
                    else if (oclientProxy._isFiltered == true && oclientProxy.element.find(".filterDisable")[0].checked == true)
                        filteringDetails = "Disable Filtering";
                    else
                        filteringDetails = "";
                    oclientProxy._SortFilterDetails = sortingDetails + "||" + filteringDetails;

                    oclientWaitingPopup.show();
                    if (oclientProxy.element.find(".sortEnable")[0].checked == true || oclientProxy.element.find(".filterEnable")[0].checked == true) {
                        oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.toolbarServices, JSON.stringify({ "action": "toolbarOperation", "toolbarOperation": "SortOrFilter", "clientInfo": oclientProxy._SortFilterDetails, "olapReport": oclientProxy.currentReport, "clientReports": oclientProxy.reports }), oclientProxy._toolbarOperationSuccess);
                    }
                    else if (oclientProxy.element.find(".sortDisable")[0].checked == true || oclientProxy.element.find(".filterDisable")[0].checked == true) {
                        if (oclientProxy._isSorted == true || oclientProxy._isFiltered == true) {
                            oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.toolbarServices, JSON.stringify({ "action": "toolbarOperation", "toolbarOperation": "SortOrFilter", "clientInfo": oclientProxy._SortFilterDetails, "olapReport": oclientProxy.currentReport, "clientReports": oclientProxy.reports }), oclientProxy._toolbarOperationSuccess);
                            oclientProxy._isSorted = false;
                        }
                        else {
                            oclientProxy._createAlertDialog(oclientProxy._getLocalizedLabels("FilterInvalidAlertMsg"));
                            oclientWaitingPopup.hide();
                            return false;
                        }
                    }
                }
                else {
                    if ($(".memberEditorDiv").length > 0 && e.target.id == "OKBtn") {
                        if ((oclientProxy._currentItem.indexOf(oclientProxy._getLocalizedLabels("Measures")) < 0))
                            oclientProxy._updateTreeView();
                        if (oclientProxy._getSelectedNodes() == 0 && args_innerHTML != oclientProxy._getLocalizedLabels("Measures") && args_innerHTML != "ToolbarButtons")
                            return false;
                        if ((oclientProxy._currentItem.indexOf(oclientProxy._getLocalizedLabels("Measures")) < 0)) {
                            if (oclientProxy._currentReportItems.length != 0) {
                                var nodeContain = false;
                                for (var i = 0; i < oclientProxy._currentReportItems.length; i++) {
                                    if (oclientProxy._currentReportItems[i] == oclientProxy._currentItem) {
                                        nodeContain = true;
                                        break;
                                    }
                                }
                            }
                            if (!nodeContain || oclientProxy._currentReportItems.length == 0)
                                oclientProxy._currentReportItems.push(oclientProxy._currentItem);
                            oclientProxy._treeViewData[oclientProxy._currentItem] = oclientProxy.memberTreeObj.dataSource();
                        }
                    }
                    var unselectedNodes = null;
                    if (args_innerHTML != "ToolbarButtons") {
                        if (!oclientProxy._isMembersFiltered) {
                            oclientProxy.element.find(".e-dialog, .clientDialog").remove();
                            oclientProxy._onPreventPanelClose();
                            return;
                        }
                        else if (args_innerHTML == oclientProxy._getLocalizedLabels("Measures"))
                            unselectedNodes = "Measures:" + oclientProxy._getMeasuresList();
                        else if (args_innerHTML != "ToolbarButtons" && args_innerHTML != undefined) {
                            unselectedNodes = oclientProxy._getUnSelectedNodes() + "CHECKED" + oclientProxy._getSelectedNodes(oclientProxy._currentAxis == "Slicers" ? true : false);
                        }
                        oclientWaitingPopup.show();
                        if (args_innerHTML == oclientProxy._getLocalizedLabels("Measures") && unselectedNodes != null && unselectedNodes.split(":")[1] == "") {
                            $(oclientProxy.element).find(".splitBtn").each(function (index, value) {
                                if (value.firstChild.innerHTML == oclientProxy._getLocalizedLabels("Measures"))
                                    $(value).remove();
                            });
                        }
                        $(oclientProxy).find(".e-dialog").hide();
                        if (oclientProxy.model.beforeServiceInvoke != null)
                            oclientProxy._trigger("beforeServiceInvoke", { "action": "filtering", element: this.element, customObject: oclientProxy.model.customObject });
                        var serializedCustomObject = JSON.stringify(oclientProxy.model.customObject);
                        oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.filterElement, JSON.stringify({ "action": "filtering", "clientParams": unselectedNodes, "olapReport": oclientProxy.currentReport, "clientReports": oclientProxy.reports, "customObject": serializedCustomObject }), oclientProxy._filterElementSuccess);
                    }
                    else {
                        if (oclientProxy.element.find(".e-titlebar").first().text() == oclientProxy._getLocalizedLabels("RemoveReport") && reportsCount < 2)
                            oclientProxy.element.find(".e-dialog").hide();
                        else if ($.trim(oclientProxy.element.find(".reportName").val()) === "" && oclientProxy.element.find(".reportName").val()!= undefined) {
                            return false;
                        }
                        else {
                            var reportName = oclientProxy.element.find(".reportName").val() || reportDropTarget.selectedTextValue;
                            var operation = oclientProxy.element.find(".e-titlebar").first().attr("tag");
                            var olapReport = (operation == "New Report" ? "" : oclientProxy.currentReport);
                            var clientReports = (operation == "New Report" ? "" : oclientProxy.reports);
                            oclientProxy.element.find(".e-dialog").hide();
                            oclientWaitingPopup.show();
                            if (operation == "Save Report") {
                                if (oclientProxy.model.beforeServiceInvoke != null)
                                    oclientProxy._trigger("beforeServiceInvoke", { action: "saveReport", element: this.element, customObject: oclientProxy.model.customObject });
                                var serializedCustomObject = JSON.stringify(oclientProxy.model.customObject);
                                oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.saveReport, JSON.stringify({
                                    "reportName": reportName, "olapReport": olapReport, "clientReports": clientReports, "customObject": serializedCustomObject
                                }), oclientProxy._toolbarOperationSuccess);

                            } else {
                                if (oclientProxy.model.beforeServiceInvoke != null)
                                    oclientProxy._trigger("beforeServiceInvoke", { action: "toolbarOperation", element: this.element, customObject: oclientProxy.model.customObject });
                                var serializedCustomObject = JSON.stringify(oclientProxy.model.customObject);
                                oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.toolbarServices, JSON.stringify({
                                    "action": "toolbarOperation", "toolbarOperation": operation, "clientInfo": reportName, "olapReport": olapReport, "clientReports": clientReports, "customObject": serializedCustomObject
                                }), oclientProxy._toolbarOperationSuccess);
                            }
                        }
                    }
                }
                oclientProxy.element.find(".e-dialog, .clientDialog").remove();
                oclientProxy._onPreventPanelClose();
            });
            this.element.find(".unCheckAll,.checkAll").click(function (evt) {
                if (evt.target.className.indexOf("checkAll") > -1) {
                    oclientProxy.element.find(".editorTreeView").ejTreeView("checkAll");
                    oclientProxy._isMembersFiltered = true;
                    oclientProxy.element.find(".dialogOKBtn").data("ejButton").enable();
                }
                else {
                    oclientProxy.element.find(".editorTreeView").ejTreeView("unCheckAll");
                    oclientProxy.element.find(".dialogOKBtn").data("ejButton").disable();
                }
            });
        },

        _getLocalizedLabels: function (property) {
            return ej.olap.OlapClient.Locale[this.locale()][property] === undefined ? ej.olap.OlapClient.Locale["en-US"][property] : ej.olap.OlapClient.Locale[this.locale()][property];
        },

        _createAlertDialog: function (message) {
            var transparent = ej.buildTag("div#preventDiv").css({ "width": $("#" + oclientProxy._id).width() + "px", "height": $("#" + oclientProxy._id).height() + "px", "position": "relative", "margin-top": -($("#" + oclientProxy._id).height()) + "px" })[0].outerHTML;
            $(transparent).appendTo("#" + oclientProxy._id);
            var dialogElem = ej.buildTag("div.alertDialog#alertDialog", ej.buildTag("div.alertImg")[0].outerHTML + ej.buildTag("div.alertContent", message)[0].outerHTML + ej.buildTag("div", ej.buildTag("button#alertOKBtn.alertOKBtn", this._getLocalizedLabels("OK"))[0].outerHTML)[0].outerHTML).attr("title", this._getLocalizedLabels("Alert"))[0].outerHTML;
            this.element.append(dialogElem);
            this.element.find(".alertDialog").ejDialog({ width: 400, target: "#" + oclientProxy._id, enableResize: false, enableRTL: oclientProxy.model.enableRTL, close: oclientProxy._onPreventPanelClose });
            this.element.find(".alertOKBtn").ejButton({ type: ej.ButtonType.Button }).bind(ej.eventType.click, function (e) {
                e.preventDefault();
                oclientProxy.element.find("#alertDialog_wrapper").remove();
                oclientProxy._onPreventPanelClose();
            });
            this.element.find(".e-dialog .e-close").attr("title", this._getLocalizedLabels("Close"));
        },

        _unWireEvents: function () {
            $(this.element.find(".dialogCancelBtn, .dialogOKBtn, .newReportImg, .addReportImg, .removeReportImg, .renameReportImg, .e-txt, .removeSplitBtn, .unCheckAll, .checkAll, .removeMeasure, .toggleCollapseButton, .toggleExpandButton, .saveReportImg, .loadReportImg,.mdxImg,.maximizedView,.colSortFilterImg, .rowSortFilterImg, .chartTypesImg, .toggleaxisImg, .autoExecuteImg")).unbind(ej.eventType.click);
            $(this.element.find(".dialogCancelBtn, .dialogOKBtn, .newReportImg, .addReportImg, .removeReportImg, .renameReportImg, .e-txt, .removeSplitBtn, .unCheckAll, .checkAll, .removeMeasure, .toggleCollapseButton, .toggleExpandButton, .saveReportImg, .loadReportImg,.mdxImg,.maximizedView,.colSortFilterImg, .rowSortFilterImg, .chartTypesImg, .toggleaxisImg,.autoExecuteImg")).unbind('click');
            $(document).find(".winCloseBtn").unbind(ej.eventType.click);
            $(document).find(".winCloseBtn").unbind('click');
            this._off($(document), 'keydown', this._keyPressDown);
            this._off($(document), 'keyup', this._keyPressUp);
            if (this.model.isResponsive)
                $(window).unbind('resize', $.proxy(this._reSizeHandler, this));
        },

        _performToggleAction: function (styles) {
            this.element.find(".controlPanel").width(styles[0].controlPanelWidth);
            if ((this.controlPlacement() != "horizontal") || (this.controlPlacement() == "horizontal" && this.displayMode() == "chartOnly") ||
                this.controlPlacement() == "horizontal" && this.displayMode() == "gridOnly") {
                this.element.find(".e-pivotchart").width(styles[0].chartOuterWidth);
                this.element.find(".e-pivotgrid").width(styles[0].gridOuterWidth);
                this.element.find("#PivotChart").css({ "width": "100%" });
                if (!ej.isNullOrUndefined(this.ochartObj) || !ej.isNullOrUndefined(this.otreemapObj)) {
                    this.element.find("#" + this.ochartObj._id).ejPivotChart("option", "width", styles[0].chartOuterWidth + "px");
                    oclientProxy.chartObj = this.element.find("#" + this.ochartObj._id + "Container").data("ejChart");
                    if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                        this.element.find("#" + oclientProxy.chartObj._id).ejChart("option", { "model": { size: { width: styles[0].chartOuterWidth + "px" } } });
                        this.element.find("#" + oclientProxy.chartObj._id + "_svg").width(styles[0].chartOuterWidth);
                        oclientProxy.chartObj.redraw();
                    }
                }
            }
        },

        _rwdToggleExpand: function () {
            oclientProxy.element.find(".csHeader, .cubeTable").show();
            oclientProxy.element.find(".toggleCollapseButton").hide();
            oclientProxy.element.find(".toggleText").hide();
            if (oclientProxy._parentElwidth < 850) {
                this.element.find(".outerTable").css({ "position": "absolute", "float": (this.model.enableRTL?"right":"left"), "tableLayout": "auto" });
                this.element.find("table.cubeTable").css({ "width": "71%" });
                this.element.find(".csHeader").css({ "width": navigator.userAgent.toLowerCase().indexOf('webkit') > 0 ? "74%" : "100%" });
                this.element.find("#cubeSelector_wrapper").css({ "width": "100%" });
                this.element.find(".controlPanelTD").css({ "width": (this.element.find(".oClientTbl").width() - this.element.find("table.cubeTable").width()), "float": (this.model.enableRTL ? "left" : "right"), "left": (this.model.enableRTL ?"0px": "15px"), "right": (this.model.enableRTL ?"15px": "0px"), "position": "relative" });
                this.element.find(".controlPanel").css({ "width": this.element.find(".controlPanelTD").width() - 20 });

            }

            if (oclientProxy._parentElwidth > 850) {
                this.element.find(".controlPanelTD").css({ "width": "56%", "left": "inherit", "float": "left", "margin-left" : "5px" });
                this.element.find("table.cubeTable").css({ "width": "98%" });
                this.element.find(".outerTable,.controlPanelTD").css({ "position": "inherit" });
                if (currentTab == "grid")
                    $(".controlPanel")[0].style.width = ($("#" + oclientProxy._id).width() * 55 / 100) + "px";
                else if (currentTab == "chart")
                    $(".controlPanel")[0].style.width = ($("#" + oclientProxy._id).width() * 55 / 100) + "px";
                else
                    $(".controlPanel")[0].style.width = "100%";

                if (window.navigator.userAgent.indexOf('Trident') > 0) {
                    oclientProxy.element.find(".outerTable")[0].style.width = ($("#" + oclientProxy._id).width() * 43 / 100) + "px";
                    oclientProxy.element.find(".csHeader")[0].style.width = ($("#" + oclientProxy._id).width() * 41 / 100) + "px";
                    this.element.find("#cubeSelector_wrapper")[0].style.width = ($("#" + oclientProxy._id).width() * 29 / 100 - 60) + "px";
                    if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile && oclientProxy.displayMode() == "chartandgrid")
                        oclientProxy.element.find(".gridPanel")[0].style.width = ($("#" + oclientProxy._id).width() * 56 / 100) + "px";
                }
                else {
                    this.element.find(".outerTable").css({ "width": ($("#" + oclientProxy._id).width() * 42 / 100) + "px", "tableLayout": "auto" });
                    this.element.find(".csHeader")[0].style.width = ($("#" + oclientProxy._id).width() * 42 / 100) + "px";
                    this.element.find("#cubeSelector_wrapper")[0].style.width = ($("#" + oclientProxy._id).width() * 32 / 100 - 60) + "px";
                    if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile && oclientProxy.displayMode() == "chartandgrid")
                        oclientProxy.element.find(".gridPanel")[0].style.width = ($("#" + oclientProxy._id).width() * 57 / 100) + "px";
                }

            }
            if (this.displayMode() != "gridonly") {
                if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile && oclientProxy.displayMode() == "chartandgrid") {
                    oclientProxy.element.find(".gridPanel").width($(".controlPanel").width() - 7)
                    $("#" + oclientProxy.ochartObj._id).width($(".controlPanel").width() - 7);
                }
                else {
                    $("#" + oclientProxy.ochartObj._id).width($(".controlPanel").width());
                }
                oclientProxy.chartObj = null;
                oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                if (ej.isNullOrUndefined(oclientProxy.chartObj) && oclientProxy.model.enablePivotTreeMap && !ej.isNullOrUndefined(oclientProxy.otreemapObj))
                    oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                    if ((oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                        oclientProxy.otreemapObj._treeMap.refresh();
                    }
                    else {
                        oclientProxy.chartObj.redraw();
                    }
                }
            }
        },

        _rwdToggleCollapse: function () {
            if (oclientProxy._parentElwidth < 850) {
                this.element.find(".outerTable").css({ "position": "absolute"});
                this.element.find(".controlPanelTD").css({ "left": (this.model.enableRTL ? "0px" : "35px"), "right": (this.model.enableRTL ? "35px" : "0px"), "position": "relative" });
            }
            if (currentTab == "grid") {
                $(".controlPanel")[0].style.width = $("#" + oclientProxy._id).width() * 94 / 100 + "px";
            }
            else
                $(".controlPanel")[0].style.width = "100%";
            if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile && oclientProxy.displayMode() == "chartandgrid")
                oclientProxy.element.find(".gridPanel")[0].style.width = $("#" + oclientProxy._id).width() * 94 / 100 + "px";
            oclientProxy.element.find(".csHeader, .cubeTable").hide();
            this.element.find(".controlPanelTD").css({ "left": (this.model.enableRTL ? "0" : "4%"), "right": (this.model.enableRTL ? "4%" : "0px"),"position": "relative", "width": "95%", "tableLayout": "fixed", "float": "" });
            $("#" + this._id).width("98%");
            this.element.find(".outerTable").css({ "position": "absolute", "width": "0px", "tableLayout": "fixed" });
            oclientProxy.element.find(".toggleCollapseButton").show();
            oclientProxy.element.find(".toggleText").show();
            if (oclientProxy.displayMode() != "gridonly") {
                if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile && oclientProxy.displayMode() == "chartandgrid")
                    $("#" + oclientProxy.ochartObj._id).width($(".controlPanel").width() - 17);
                else
                    $("#" + oclientProxy.ochartObj._id).width($(".controlPanel").width());
                if (oclientProxy.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                    oclientProxy.chartObj = null;
                    oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                    if (ej.isNullOrUndefined(oclientProxy.chartObj) && oclientProxy.model.enablePivotTreeMap && !ej.isNullOrUndefined(oclientProxy.otreemapObj))
                        oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                }
                if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                    if ((oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                            oclientProxy.otreemapObj._treeMap.refresh();
                    }
                    else {
                            oclientProxy.chartObj.redraw();
                    }
                }
            }
        },

        _splitButtonDropped: function (axis, droppedPosition) {
            isDropped = true;
            var cssname = axis == "Series" ? "row" : axis.toLowerCase();
            if (($.trim(droppedPosition) == "" && this.element.find("." + cssname + "Axis").find("button:last").attr("title") == this.element.find("button.dragClone").attr("title")) || ($.trim(droppedPosition) != "" && this.element.find($("." + cssname + "Axis").find(".splitBtn")[droppedPosition]).attr("tag").split(":")[1].replace(".", " - ") == this.element.find("button.dragClone").attr("title"))) {
                this.element.find("button.dragClone").remove()
                return false
            }
            if (($.trim(droppedPosition) == "") || (draggedSplitBtn != null && this.element.find($("." + cssname + "Axis").find(".splitBtn")[droppedPosition]).attr("tag").split(":")[1].replace(".", " - ") != this.element.find("button.dragClone").attr("title"))) {
                var params = this.element.find(".cubeName").html() + "--" + $(draggedSplitBtn).parent("div:eq(0)").attr("Tag") + "--" + axis + "--" + droppedPosition;
                draggedSplitBtn = null;
                oclientWaitingPopup.show();
                if (oclientProxy.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(oclientProxy.model.customObject);
                oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.nodeDropped, JSON.stringify({ "action": "nodeDropped", "dropType": "SplitButton", "nodeInfo": params, "olapReport": oclientProxy.currentReport, "clientReports": oclientProxy.reports, "customObject": serializedCustomObject }), oclientProxy._nodeDroppedSuccess);
            }
            oclientProxy._isNodeOrButtonDropped = true;
         },

        _filterElementSuccess: function (report) {
            if (report[0] != undefined) {
                oclientProxy.currentReport = report[0].Value; oclientProxy.reports = report[1].Value;
                if (report[2] != null && report[2] != undefined)
                    oclientProxy.model.customObject = report[2].Value;
            }
            else if (report.d != undefined) {
                oclientProxy.currentReport = report.d[0].Value; oclientProxy.reports = report.d[1].Value;
                if (report.d[2] != null && report.d[2] != undefined)
                    oclientProxy.model.customObject = report.d[2].Value;
            }
            else {
                oclientProxy.currentReport = report.UpdatedReport; oclientProxy.reports = report.ClientReports;
                if (report.customObject != null && report.customObject != undefined)
                    oclientProxy.model.customObject = report.customObject;
            }
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "filtering", element: this.element, customObject: this.model.customObject });
            oclientProxy._renderControls();
            oclientProxy._unWireEvents();
            oclientProxy._wireEvents();
            oclientProxy._successAction = "Filter";
            oclientProxy._trigger("renderSuccess", oclientProxy);
        },

        _maxViewBtnClick: function () {
            var winWidth = $(window).width() - 150;
            var winHeight = $(window).height() - 100;
            var docDivTag = ej.buildTag("div.fullScreenView", "", { width: $(document).width(), height: $(document).height() });
            var winDivTag = ej.buildTag("div#" + oclientProxy._id + "_maxView.maximumView", "", { width: winWidth, height: winHeight });
            var maxViewCls = ej.buildTag("div#Winclose.winCloseBtn e-icon", "").attr("role","button").attr("aria-label","close");
            if (oclientProxy.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                oclientProxy.chartObj = null;
                oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                if (ej.isNullOrUndefined(oclientProxy.chartObj) && oclientProxy.model.enablePivotTreeMap && !ej.isNullOrUndefined(oclientProxy.otreemapObj))
                    oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
            }
            if (oclientProxy.displayMode() == "chartonly" && ($("#" + oclientProxy.ochartObj._id + "Container_svg")[0] || $("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").children().length > 0)) {
                oclientProxy._fullScreenView(100, 160);
                if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                    if ((oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                        $("#" + oclientProxy.otreemapObj._id).css({ width: "99%" });
                        $("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").css({ width: "100%" });
                    }
                }
                winDivTag.append(oclientProxy.element.find("#PivotChart"));
            }
            if (oclientProxy.displayMode() == "gridonly")
                winDivTag.append(oclientProxy.element.find("#PivotGrid").css({ "max-height": winHeight, "width": winWidth }));
            if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tab && oclientProxy.displayMode() == "chartandgrid") {
                if (currentTab == "grid")
                    winDivTag.append(oclientProxy.element.find("#PivotGrid").css({ "max-height": winHeight, "width": winWidth }));
                else if (currentTab == "chart" && ($("#" + oclientProxy.ochartObj._id + "Container_svg")[0] || $("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").children().length > 0)) {
                    oclientProxy._fullScreenView(100, 160);
                    if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                        if ((oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                            $("#" + oclientProxy.otreemapObj._id).css({ width: "99%" });
                            $("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").css({ width: "100%" });
                        }
                    }
                    winDivTag.append(oclientProxy.element.find("#PivotChart"));
                }
            }
            else if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile && oclientProxy.displayMode() == "chartandgrid") {
                var hght = ($(window).height() / 2) - 50;
                oclientProxy.element.find("#PivotGrid").css({ "max-height": hght, "margin-left": "0px" });
                if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                    if ((oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                        $("#" + oclientProxy.otreemapObj._id).css({ width: "99%" });
                        $("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").css({ width: "100%" });
                    }
                }
                oclientProxy._fullScreenView(50, 160);
                if (($("#" + oclientProxy.ochartObj._id + "Container_svg")[0] || $("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").children().length > 0))
                    if (oclientProxy.defaultView() == "chart")
                        winDivTag.append(oclientProxy.element.find("#PivotChart")).append(oclientProxy.element.find("#PivotGrid").width(($(window).width() - 160)));
                    else
                        winDivTag.append(oclientProxy.element.find("#PivotGrid").width($(window).width() - 160)).append(oclientProxy.element.find("#PivotChart"));
                winDivTag.append(oclientProxy.element.find("#PivotGrid").width($(window).width() - 160));
            }
            winDivTag.append(maxViewCls);
            docDivTag.append(winDivTag);
            $("body").append(docDivTag);
            if (oclientProxy.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                    if (oclientProxy.model.enablePivotTreeMap && (oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                        oclientProxy.otreemapObj._treeMap.refresh();
                    }
                    else {
                            oclientProxy.chartObj.redraw();
                    }
                }
            }
        },

        _maxViewClsBtnClick: function () {
            var fullScreen = $(".fullScreenView");
            fullScreen.find("#PivotGrid").css("margin-left", "7px");
            fullScreen.find("#PivotChart").appendTo(oclientProxy.element.find(".chartContainer"));
            if (oclientProxy.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                oclientProxy.chartObj = null;
                oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                if (ej.isNullOrUndefined(oclientProxy.chartObj) && oclientProxy.model.enablePivotTreeMap && !ej.isNullOrUndefined(oclientProxy.otreemapObj))
                    oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
            }
            if (oclientProxy.displayMode() == "chartonly" && ($("#" + oclientProxy.ochartObj._id + "Container_svg")[0]))
                oclientProxy._fullScreenViewCls(560, 557);
            if (oclientProxy.displayMode() == "gridOnly")
                fullScreen.find("#PivotGrid").css({ "width": "inherit", "max-height": '' });
            if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tab && oclientProxy.displayMode() == "chartandgrid") {
                if (currentTab == "chart" && $("#" + oclientProxy.ochartObj._id + "Container_svg")[0])
                    oclientProxy._fullScreenViewCls(547, 557);
                else
                    fullScreen.find("#PivotGrid").css({ "max-height": "550px", "width": "555px" });
            }
            if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile && oclientProxy.displayMode() == "chartandgrid")
                if ($("#" + oclientProxy.ochartObj._id + "Container_svg")[0]) {
                    oclientProxy._fullScreenViewCls(275, 555);
                    fullScreen.find("#PivotGrid").css({ "max-height": "300px", "width": "555px" });
                } else
                    fullScreen.find("#PivotGrid").css({ "max-height": "275px", "width": "555px" });
            if (oclientProxy.enableTogglePanel() && (oclientProxy.element.find(".cubeTable").is(':visible')) == false)
                fullScreen.find("#PivotGrid").css("width", "950px");
            fullScreen.find("#PivotGrid").appendTo(oclientProxy.element.find(".gridContainer"));
            $(".maximumView").remove();
            $(".fullScreenView").remove();
            if (oclientProxy.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                    if (oclientProxy.model.enablePivotTreeMap && (oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap")
                        oclientProxy.otreemapObj._treeMap.refresh();
                    else {
                        oclientProxy.chartObj.redraw();
                    }
                }
            }
        },

        _enableResponsive: function () {

            $(".outerPanel")[0].style.width = "100%";
            $(".e-olapclient")[0].style.width = "100%";
            oclientProxy.element.find(".outerTable").css({ "float": this.model.enableRTL?"right":"left" });
            oclientProxy.element.find(".cdbHeader, .cubeBrowser").addClass("responsive");
            oclientProxy.element.find(".rowAxis, .slicerAxis, .categoricalAxis").width("99%");
            oclientProxy.element.find(".controlPanelTD").width("56%");
            if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile && oclientProxy.displayMode() == "chartandgrid")
                oclientProxy.element.find(".controlPanelTD").css("display", "inline-block");
            $(".cubeTable")[0].style.width = "98%";
            if (window.navigator.userAgent.indexOf('Trident') > 0) {
                if (currentTab == "grid")
                    $(".controlPanel")[0].style.width = $("#" + oclientProxy._id).width() * 55 / 100 + "px";
                else
                    $(".controlPanel")[0].style.width = "99%";
                oclientProxy.element.find(".outerTable")[0].style.width = $("#" + oclientProxy._id).width() * 39 / 100 + "px";
                oclientProxy.element.find(".csHeader")[0].style.width = ($("#" + oclientProxy._id).width() * 38 / 100) + "px";
                if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile && oclientProxy.displayMode() == "chartandgrid")
                    oclientProxy.element.find(".gridPanel")[0].style.width = $("#" + oclientProxy._id).width() * 55 / 100 + "px";
            }
            else {
                oclientProxy.element.find(".outerTable")[0].style.width = $("#" + oclientProxy._id).width() * 38 / 100 + "px";
                oclientProxy.element.find(".csHeader")[0].style.width = ($("#" + oclientProxy._id).width() * 38 / 100) + "px";
            }
        },

        _fullScreenView: function (height, width) {
            if (oclientProxy.ochartObj != null && oclientProxy.ochartObj != undefined && ($("#" + oclientProxy.ochartObj._id + "Container_svg")[0])) {
                oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                var chartWidth = oclientProxy.chartObj.model.size.width = oclientProxy.ochartObj.model.size.width = $(window).width() - width + "px";
                if (oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile && oclientProxy.displayMode() == "chartandgrid")
                    var chartHeight = oclientProxy.ochartObj.model.size.height = oclientProxy.chartObj.model.size.height = ($(window).height() / 2) - height + "px";
                else
                    var chartHeight = oclientProxy.ochartObj.model.size.height = oclientProxy.chartObj.model.size.height = $(window).height() - height + "px";
                oclientProxy.element.find("#PivotChart").css({ "min-height": chartHeight, "width": chartWidth });
                oclientProxy.chartObj.redraw();
            }
        },

        _fullScreenViewCls: function (height, width) {
            if (oclientProxy.ochartObj != null && oclientProxy.ochartObj != undefined) {
                oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                var chartHeight = oclientProxy.chartObj.model.size.height = oclientProxy.ochartObj.model.size.height = height + "px";
                if (oclientProxy.enableTogglePanel() && (oclientProxy.element.find(".cubeTable").is(':visible')) == false)
                    var chartWidth = oclientProxy.chartObj.model.size.width = oclientProxy.ochartObj.model.size.width = "950px";
                else
                    var chartWidth = oclientProxy.chartObj.model.size.width = oclientProxy.ochartObj.model.size.width = width + "px";
                oclientProxy.element.find("#PivotChart").css({ "min-height": chartHeight, "width": chartWidth });
                oclientProxy.chartObj.redraw();
            }
        },

        _nodeDroppedSuccess: function (data) {
            var columnElements, rowElements, slicerElements;
            if (data[0] != undefined) {
                columnElements = data[0].Value; rowElements = data[1].Value; slicerElements = data[2].Value;
                oclientProxy.currentReport = data[3].Value; oclientProxy.reports = data[4].Value;
                if (data[5] != null && data[5] != undefined)
                    oclientProxy.model.customObject = data[5].Value;
            }
            else if (data.d != undefined) {
                columnElements = data.d[0].Value; rowElements = data.d[1].Value; slicerElements = data.d[2].Value;
                oclientProxy.currentReport = data.d[3].Value; oclientProxy.reports = data.d[4].Value;
                if (data.d[5] != null && data.d[5] != undefined)
                    oclientProxy.model.customObject = data.d[5].Value;
            }
            else {
                columnElements = data.Columns; rowElements = data.Rows; slicerElements = data.Slicers;
                oclientProxy.currentReport = data.UpdatedReport; oclientProxy.reports = data.ClientReports;
                if (data.customObject != null && data.customObject != undefined)
                    oclientProxy.model.customObject = data.customObject;
            }
            if (oclientProxy._isRemoved) {
                oclientProxy._isRemoved = false;
                tempArray = [];

                if (columnElements.length > 0)
                    tempArray.push(columnElements);
                if (rowElements.length > 0)
                    tempArray.push(rowElements);
                if (slicerElements.length > 0)
                    tempArray.push(slicerElements);

                if (tempArray.length > 0) {
                    for (var j = 0; j < tempArray.length; j++) {
                        var filterName;
                        var target = tempArray[j]
                        if (!ej.isNullOrUndefined(target)) {
                            for (var i = 0; i < target.split("#").length; i++) {
                                if (target.split("#")[i] == "" || target.split("#")[i] == "Measures")
                                    filterName = null;
                                else
                                    filterName = target.split("#")[i].split(".").length > 0 ? target.split("#")[i].replace(".", " - ") : target.split("#")[i];
                                if (!ej.isNullOrUndefined(filterName)) {
                                    if (oclientProxy._currentReportItems.length != 0) {
                                        if (oclientProxy._treeViewData.hasOwnProperty(filterName)) {
                                            delete oclientProxy._treeViewData[filterName];
                                            oclientProxy._currentReportItems.splice($.inArray(filterName, oclientProxy._currentReportItems), 1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
            this.element.find(".splitBtn, .e-btn").remove();
            $(oclientProxy._createSplitButtons(columnElements, "Columns")).appendTo(".categoricalAxis");
            $(oclientProxy._createSplitButtons(rowElements, "Rows")).appendTo(".rowAxis");
            $(oclientProxy._createSplitButtons(slicerElements, "Slicers")).appendTo(".slicerAxis");
            this.element.find(".categoricalAxis, .rowAxis, .slicerAxis").find("button").ejButton({ height: "20px", type: ej.ButtonType.Button });
            oclientProxy._setSplitBtnTitle();
            oclientProxy._renderControls();
            oclientProxy._unWireEvents();
            oclientProxy._wireEvents();
            oclientProxy._successAction = "NodeDrop";
            oclientProxy._trigger("renderSuccess", oclientProxy);
            this._buttonContextMenu();
        },
        _buttonContextMenu : function(){
            var context = ej.buildTag("ul.pivotTree#pivotTree", ej.buildTag("li", ej.buildTag("a", oclientProxy._getLocalizedLabels("AddToColumn"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", oclientProxy._getLocalizedLabels("AddToRow"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", oclientProxy._getLocalizedLabels("AddToSlicer"))[0].outerHTML)[0].outerHTML)[0].outerHTML;
            this.element.append(context);
            $("#pivotTree").ejMenu({
                menuType: ej.MenuType.ContextMenu,
                openOnClick: false,
                contextMenuTarget: oclientProxy.element.find(".e-button"),
                click: ej.proxy(oclientProxy._contextClick, oclientProxy),
                beforeOpen: ej.proxy(oclientProxy._contextOpen, oclientProxy),
                close: ej.proxy(oclientProxy._onPreventPanelClose, oclientProxy)
            });
        },
        _editorTreeInfoSuccess: function (editorTree) {
            
            if (editorTree[0] != undefined) {
                if (editorTree[2] != null && editorTree[2] != undefined)
                    oclientProxy.model.customObject = editorTree[2].Value;
            }
            else if (editorTree.d != undefined) {
                if (editorTree.d[2] != null && editorTree.d[2] != undefined)
                    oclientProxy.model.customObject = editorTree.d[2].Value;
            }
            else {
                if (editorTree.customObject != null && editorTree.customObject != undefined)
                    oclientProxy.model.customObject = editorTree.customObject;
            }
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "fetchMemberTreeNodes", element: this.element, customObject: this.model.customObject });
            oclientProxy._createDialog(args_className, args_innerHTML, editorTree);
            oclientWaitingPopup.hide();
            oclientProxy._successAction = "EditorTreeInfo";
            oclientProxy._trigger("renderSuccess", oclientProxy);
            if (this.element.find(".e-dialog .e-text:visible").first().length > 0) {
                this._curFocus.editor = this.element.find(".e-dialog .e-text:visible").first().attr("tabindex", "-1").focus().addClass("hoverCell");
            }
            else if (this.element.find(".e-dialog .measureEditor:visible").first().length > 0) {
                this._curFocus.editor = this.element.find(".e-dialog .measureEditor:visible").first().attr("tabindex", "-1").focus().addClass("hoverCell");
            }
        },

        _renderControlSuccess: function (msg) {
            if (oclientProxy.model.isResponsive)
                oclientProxy.model.displaySettings.enableTogglePanel = oclientProxy.model.isResponsive;
            eventArgs = { element: this.element, customObject: this.model.customObject };
            oclientProxy._trigger("load", eventArgs);
            var cubes ="", columnElements = "", rowElements = "", slicerElements = "", cubeTreeInfo = "";
            if (msg[0] != undefined) {
                cubes = msg[0].Value; columnElements = msg[1].Value; rowElements = msg[2].Value;
                slicerElements = msg[3].Value; cubeTreeInfo = msg[4].Value; oclientProxy.currentReport = oclientProxy._deferReport = msg[5].Value;
                oclientProxy.reports = msg[6].Value; reportsCount = msg[7].Value; reportList = $.parseJSON(msg[8].Value);
                if (oclientProxy.model.enableMeasureGroups) oclientProxy.measureGroupInfo = $.parseJSON(msg[9].Value);
                oclientProxy.currentCubeName = msg[10].Value;
                if (msg[11] != null && msg[11] != undefined)
                    oclientProxy.model.customObject = msg[11].Value;
            }
            else if (msg.d != undefined) {
                cubes = msg.d[0].Value; columnElements = msg.d[1].Value; rowElements = msg.d[2].Value;
                slicerElements = msg.d[3].Value; cubeTreeInfo = msg.d[4].Value; oclientProxy.currentReport = oclientProxy._deferReport = msg.d[5].Value;
                oclientProxy.reports = msg.d[6].Value; reportsCount = msg.d[7].Value; reportList = $.parseJSON(msg.d[8].Value);
                if (oclientProxy.model.enableMeasureGroups) oclientProxy.measureGroupInfo = $.parseJSON(msg.d[9].Value);
                oclientProxy.currentCubeName = msg.d[10].Value;
                if (msg.d[11] != null && msg.d[11] != undefined)
                    oclientProxy.model.customObject = msg.d[11].Value;
            }
            else {
                if (msg != ""){
                cubes = msg.Cubes; columnElements = msg.Columns; rowElements = msg.Rows;
                slicerElements = msg.Slicers; cubeTreeInfo = msg.CubeTreeInfo; oclientProxy.currentReport = msg.CurrentReport;
                oclientProxy.reports = msg.ClientReports; reportList = $.parseJSON(msg.ReportList); reportsCount = msg.ReportsCount;
                if (oclientProxy.model.enableMeasureGroups) oclientProxy.measureGroupInfo = $.parseJSON(msg.MeasureGroups);
                oclientProxy.currentCubeName = msg.CurrentCubeName;
                if (msg.customObject != null && msg.customObject != undefined)
                    oclientProxy.model.customObject = msg.customObject;
            }
        }
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "initialize", element: this.element, customObject: this.model.customObject });
            var treeViewData = null;
            if(msg != "")
                treeViewData = $.parseJSON(cubeTreeInfo); 
            var reportBar = ej.buildTag("div.reportToolbar#reportToolbar", oclientProxy._reportToolbar(), { width: "410px", height: "29px" })[0].outerHTML;
            var browserPanel, htmlTag;
            if (!oclientProxy.model.isResponsive) {
                browserPanel = oclientProxy._createCubeSelector() + "<table class=cubeTable><tr><td valign=\"bottom\">" + oclientProxy._createCubeBrowser(cubeTreeInfo) + "</td><td valign=\"bottom\" style='" +( oclientProxy.model.enableRTL ? "padding-right:5px;" : "padding-left:5px;") + "'>" + oclientProxy._createAxisElementBuilder(columnElements, rowElements, slicerElements) + "</td></tr></table>";
                htmlTag = ej.buildTag("span.outerPanel", "", { width: "1000px", height: "600px" }).append("<div class=\"titleText\"><span>" + oclientProxy.title() + "</span></div>" + reportBar + "<table class=\"outerTable\"><tr><td>" + browserPanel + "</td><td class=\"controlPanelTD\">" + oclientProxy._controlPanel() + "</td></tr></table>");
            }
            else if (oclientProxy.model.isResponsive) {
                browserPanel = oclientProxy._createCubeSelector() + ej.buildTag("table.cubeTable", ej.buildTag("tbody", ej.buildTag("tr", ej.buildTag("td.cubeTabletd", oclientProxy._createCubeBrowser(cubeTreeInfo)).attr({ valign: "bottom", width: "50%" })[0].outerHTML + ej.buildTag("td.cubeTabletd", oclientProxy._createAxisElementBuilder(columnElements, rowElements, slicerElements)).attr({ valign: "bottom", width: "50%" })[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML;

                htmlTag = ej.buildTag("span.outerPanel", "").append(ej.buildTag("div.titleText", ej.buildTag("span", oclientProxy.title(), { "padding-left": "10px" })[0].outerHTML)[0].outerHTML + reportBar + ej.buildTag("table.oClientTbl", ej.buildTag("tr", ej.buildTag("td", ej.buildTag("table.outerTable", ej.buildTag("tr", ej.buildTag("td", browserPanel)[0].outerHTML)[0].outerHTML)[0].outerHTML + ej.buildTag("table.controlPanelTD", ej.buildTag("tr", ej.buildTag("td", oclientProxy._controlPanel())[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML, { width: "100%" })[0].outerHTML);
            }
            oclientProxy.element.html(htmlTag).width($(".outerPanel").width());
            oclientProxy.element.find(".reportToolbar").ejToolbar({ enableRTL: this.model.enableRTL, height: "35px" });
            if (oclientProxy.model.enableRTL) {
                oclientProxy.element.addClass("e-rtl");
            }
            if ((oclientProxy.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tab && oclientProxy.defaultView() == ej.olap.OlapClient.DefaultView.Grid) || (oclientProxy.displayMode() == ej.olap.OlapClient.DisplayMode.GridOnly))
                oclientProxy.element.find(".chartTypesImg").addClass("chartTypesOnGridView");
            var reportDropDown = "<div class ='reportList' ><input type='text' id='reportList' class='reportlist' title='" + this._getLocalizedLabels("ReportList") + "'/></div>";
            if (oclientProxy.model.enableMeasureGroups) {
                oclientProxy._createMeasureGroup();
            }
            $(reportDropDown).appendTo(".reportCol");
            oclientProxy.element.find(".reportlist").ejDropDownList({
                dataSource: reportList,
                enableRTL: this.model.enableRTL,
                fields: { text: "name", value: "name" },
                height: "26px"
            });
            oclientProxy.element.find(".reportlist").attr("tabindex", 0);
            var tempddlwidth = oclientProxy.element.find(".csHeader").width() - oclientProxy.element.find(".cubeText").width() - oclientProxy.element.find(".toggleExpandButton").width() - 20;
            var cubeddlWidth = oclientProxy.enableTogglePanel() ? tempddlwidth - 25 : tempddlwidth;
            var cubeCollection = (cubes == "" ? "" : $.parseJSON(cubes));
            oclientProxy.element.find(".cubeSelector").ejDropDownList({
                    dataSource: cubeCollection,
                enableRTL: this.model.enableRTL,
                fields: { text: "name", value: "name" },
                width: "" + cubeddlWidth + "px"
            });
             
            ddlTarget = oclientProxy.element.find('.cubeSelector').data("ejDropDownList");
            reportDropTarget = oclientProxy.element.find('#reportList').data("ejDropDownList");
            if (msg != "") {
            ddlTarget.selectItemByText(oclientProxy.currentCubeName);
                if (reportDropTarget.model.dataSource.length)
            reportDropTarget.selectItemByText(reportDropTarget.model.dataSource[0].name);
            this._selectedReport = reportDropTarget.currentValue;
            }
            oclientProxy.element.find(".cubeSelector").ejDropDownList("option", "change", ej.proxy(oclientProxy._cubeChanged, oclientProxy));
            oclientProxy.element.find(".cubeSelector").attr("tabindex", 0);
            oclientProxy.element.find(".reportlist").ejDropDownList("option", "change", reportList.length > 1 ? ej.proxy(oclientProxy.reportChanged, oclientProxy) : null);
            if (oclientProxy.model.enableMeasureGroups)
                oclientProxy.element.find(".measureGroupSelector").ejDropDownList("option", "change", ej.proxy(oclientProxy._measureGroupChanged, oclientProxy));
            oclientProxy.element.find(".cubeTreeView").ejTreeView({
                fields: { id: "id", parentId: "pid", text: "name", spriteCssClass: "spriteCssClass", dataSource: treeViewData },
                allowDragAndDrop: true,
                enableRTL: this.model.enableRTL,
                allowDropChild: false,
                allowDropSibling: false,
                dragAndDropAcrossControl: true,
                nodeDragStart: function () {
                    isDragging = true;
                },
                beforeDelete: function () {
                    return false;
                },
                nodeDropped: ej.proxy(oclientProxy._nodeDropped, oclientProxy),
                height: this.model.enableMeasureGroups? "464px": "495px",
            });
            oclientProxy.element.find(".cubeTreeView").attr("tabindex", 0);
            var treeViewElements = oclientProxy.element.find(".cubeTreeView").find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                treeViewElements[i].setAttribute("tag", treeViewData[i].tag);
            }
            var folders = oclientProxy.element.find(".cubeTreeView .folderCDB");
            for (var i = 0; i < folders.length; i++) {
                $(folders[i].parentElement).removeClass("e-draggable");
            }

            var cubeName = ej.buildTag("div.cubeName", oclientProxy.currentCubeName);
            $(cubeName).prependTo(".cubeBrowser");
            oclientProxy.element.find(".categoricalAxis, .rowAxis, .slicerAxis").ejDroppable({ drop: ej.proxy(oclientProxy._onDropped, oclientProxy) });
            oclientProxy.element.find(".categoricalAxis, .rowAxis, .slicerAxis").find("button").ejButton({ height: "20px", type: ej.ButtonType.Button });
            if (oclientProxy.enableTogglePanel()) {
                $(ej.buildTag("div.toggleExpandButton e-icon", ej.buildTag("p#toggleexpand", "toggle expanded", {"display":"none"})[0].outerHTML).attr("aria-describedby","toggleexpand")[0].outerHTML).appendTo(oclientProxy.element.find(".csHeader"));
                $(oclientProxy.element.find(".outerTable").find("td")[0]).append(ej.buildTag("div.toggleCollapseButton e-icon", ej.buildTag("p#togglecollapse", "toggle collapsed", {"display":"none"})[0].outerHTML).attr("aria-describedby","togglecollapse")[0].outerHTML);
                $((ej.buildTag("div.toggleText")[0].outerHTML)).insertAfter(oclientProxy.element.find(".toggleCollapseButton"));
                oclientProxy.element.find(".toggleCollapseButton").hide();
                oclientProxy.element.find(".toggleText").hide();
            }
            oclientProxy._setSplitBtnTitle();
            oclientProxy.element.find("#clientTab").ejTab({ enableRTL: this.model.enableRTL, itemActive: ej.proxy(oclientProxy._onTabClick, oclientProxy) });
            if (oclientProxy.defaultView() == ej.olap.OlapClient.DefaultView.Chart) {
                oclientProxy.element.find("#PivotChart").ejPivotChart({ url: oclientProxy.model.url, enableRTL: oclientProxy.model.enableRTL, canResize: oclientProxy.model.isResponsive, enableRTL: oclientProxy.model.enableRTL, currentReport: oclientProxy.currentReport, locale: oclientProxy.locale(), showTooltip: true, size: { height: oclientProxy._chartHeight, width: oclientProxy._chartWidth }, commonSeriesOptions: { type: oclientProxy.model.chartType, tooltip: { visible: true } }, beforeServiceInvoke: oclientProxy.model.chartLoad, drillSuccess: ej.proxy(oclientProxy._chartDrillSuccess, oclientProxy) });
                if (oclientProxy.gridLayout() != ej.PivotGrid.Layout.Normal)
                    oclientProxy.element.find("#PivotGrid").ejPivotGrid({ url: oclientProxy.model.url, isResponsive: oclientProxy.model.isResponsive, enableRTL: oclientProxy.model.enableRTL, currentReport: oclientProxy.currentReport, layout: oclientProxy.gridLayout(), locale: oclientProxy.locale(), drillSuccess: ej.proxy(oclientProxy._gridDrillSuccess, oclientProxy) });
                else
                    oclientProxy.element.find("#PivotGrid").ejPivotGrid({ url: oclientProxy.model.url, isResponsive: oclientProxy.model.isResponsive, enableRTL: oclientProxy.model.enableRTL, currentReport: oclientProxy.currentReport, locale: oclientProxy.locale(), drillSuccess: ej.proxy(oclientProxy._gridDrillSuccess, oclientProxy) });
            }
            else {
                if (oclientProxy.gridLayout() != ej.PivotGrid.Layout.Normal)
                    oclientProxy.element.find("#PivotGrid").ejPivotGrid({ url: oclientProxy.model.url, isResponsive: oclientProxy.model.isResponsive, enableRTL: oclientProxy.model.enableRTL, currentReport: oclientProxy.currentReport, locale: oclientProxy.locale(), layout: oclientProxy.gridLayout(), drillSuccess: ej.proxy(oclientProxy._gridDrillSuccess, oclientProxy) });
                else
                    oclientProxy.element.find("#PivotGrid").ejPivotGrid({ url: oclientProxy.model.url, isResponsive: oclientProxy.model.isResponsive, enableRTL: oclientProxy.model.enableRTL, currentReport: oclientProxy.currentReport, locale: oclientProxy.locale(), drillSuccess: ej.proxy(oclientProxy._gridDrillSuccess, oclientProxy) });
                oclientProxy.element.find("#PivotChart").ejPivotChart({ url: oclientProxy.model.url, enableRTL: oclientProxy.model.enableRTL, canResize: oclientProxy.model.isResponsive, currentReport: oclientProxy.currentReport, locale: oclientProxy.locale(), showTooltip: true, size: { height: oclientProxy._chartHeight, width: oclientProxy._chartWidth }, commonSeriesOptions: { type: oclientProxy.model.chartType, tooltip: { visible: true } }, drillSuccess: ej.proxy(oclientProxy._chartDrillSuccess, oclientProxy), beforeServiceInvoke: oclientProxy.model.chartLoad });
            }
            if (oclientProxy.displayMode() != "chartonly")
                oclientProxy.ogridObj = oclientProxy.element.find('#PivotGrid').data("ejPivotGrid");
            if (oclientProxy.displayMode() != "gridOnly")
                oclientProxy.ochartObj = oclientProxy.element.find('#PivotChart').data("ejPivotChart");
            var items = {};
            if (oclientProxy.ochartObj != null) {
                oclientProxy.element.find('#PivotChart').width(oclientProxy.ochartObj.model.size.width);
                items["chartModelWidth"] = oclientProxy.ochartObj.model.size.width;
            }
            items["controlPanelWidth"] = oclientProxy.element.find(".controlPanel").width();
            items["chartOuterWidth"] = oclientProxy._chartWidth;
            items["gridOuterWidth"] = oclientProxy._gridWidth;
            oclientProxy._initStyles.push(items);
            oclientProxy._wireEvents();
            if (oclientProxy.model.isResponsive) {
                oclientProxy._enableResponsive();
                oclientProxy._parentElwidth = $("#" + oclientProxy._id).parent().width();
                if (oclientProxy._parentElwidth < 850) {
                    oclientProxy._rwdToggleCollapse();
                }
                else if (oclientProxy._parentElwidth > 850) {
                    oclientProxy._rwdToggleExpand();
                }
            }
            oclientProxy._trigger("renderSuccess", oclientProxy);
            oclientProxy._successAction = "ClientRender";
            oclientProxy.progressPos = $("#" + oclientProxy._id).position();
            this._treeContextMenu();
            this._buttonContextMenu();
        },

        _contextOpen: function (args) {
            var backgroundDiv = ej.buildTag("div#preventDiv").css({ "width": $('body').width() + "px", "height": $('body').height() + "px", "position": "absolute", "top": $('body').offset().top + "px", "left": $('body').offset().left + "px", "z-index": 10 })[0].outerHTML;
            oclientProxy.element.append(backgroundDiv);
            var menuObj = $("#pivotTree").data('ejMenu');
            oclientProxy._selectedMember = $(args.target);
            menuObj.enableItem(oclientProxy._getLocalizedLabels("AddToColumn"));
            menuObj.enableItem(oclientProxy._getLocalizedLabels("AddToRow"));
            menuObj.enableItem(oclientProxy._getLocalizedLabels("AddToSlicer"));
        },

        _contextClick: function (args) {
            oclientProxy._onPreventPanelClose();
            var axisName = args.events.text;
            var droppedPosition = "";
            axisName = axisName == oclientProxy._getLocalizedLabels("AddToSlicer") ? "Slicer" : axisName == oclientProxy._getLocalizedLabels("AddToColumn") ? "Categorical" : axisName == oclientProxy._getLocalizedLabels("AddToRow") ? "Series" : "";
            oclientWaitingPopup.show();
            if (this.model.beforeServiceInvoke != null)
                this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            var params = oclientProxy.currentCubeName + "--" + this._selectedMember.parent().attr("tag") + "--" + axisName + "--" + droppedPosition;
            oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.nodeDropped, JSON.stringify({ "action": "nodeDropped", "dropType": "SplitButton", "nodeInfo": params, "olapReport": oclientProxy.currentReport, "clientReports": oclientProxy.reports, "customObject": serializedCustomObject }), oclientProxy._nodeDroppedSuccess);

        },

        _onContextOpen: function (args) {
            if ($(args.target).find(".folderCDB").length > 0)
                return false;
            var backgroundDiv = ej.buildTag("div#preventDiv").css({ "width": $('body').width() + "px", "height": $('body').height() + "px", "position": "absolute", "top": $('body').offset().top + "px", "left": $('body').offset().left + "px", "z-index": 10 })[0].outerHTML;
            oclientProxy.element.append(backgroundDiv);
            var menuObj = $("#pivotTreeContext").data('ejMenu');
            oclientProxy._selectedMember = $(args.target);
            menuObj.enableItem(oclientProxy._getLocalizedLabels("AddToColumn"));
            menuObj.enableItem(oclientProxy._getLocalizedLabels("AddToRow"));
            $(args.target.parentElement).find(".namedSetCDB").length > 0 ? menuObj.disableItem(oclientProxy._getLocalizedLabels("AddToSlicer")) : menuObj.enableItem(oclientProxy._getLocalizedLabels("AddToSlicer"));
        },

        _onTreeContextClick: function (args) {
            if (!ej.isNullOrUndefined(this._curFocus.tree)) {
                this._curFocus.tree.attr("tabindex", "-1").focus().addClass("hoverCell");
            }
            else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                this._curFocus.tab.attr("tabindex", "-1").focus().addClass("hoverCell");
            }
            oclientProxy._onPreventPanelClose();
            var axisName = args.events.text;
            var droppedPosition="";
            axisName = axisName == oclientProxy._getLocalizedLabels("AddToSlicer") ? "Slicer" : axisName == oclientProxy._getLocalizedLabels("AddToColumn") ? "Categorical" : axisName == oclientProxy._getLocalizedLabels("AddToRow") ? "Series" : "";
            oclientWaitingPopup.show();
            if (this.model.beforeServiceInvoke != null)
                this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            var params = oclientProxy.currentCubeName + "--" + this._selectedMember.parent().parent().attr("tag") + "--" + axisName + "--" + droppedPosition;
            oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.nodeDropped, JSON.stringify({ "action": "nodeDropped", "dropType": "TreeNode", "nodeInfo": params, "olapReport": oclientProxy.currentReport, "clientReports": oclientProxy.reports, "customObject": serializedCustomObject }), oclientProxy._nodeDroppedSuccess);
                
        },

        _toggleAxisSuccess: function (msg) {
            var columnElements, rowElements, slicerElements;
            if (msg[0] != undefined) {
              columnElements = msg[0].Value; rowElements = msg[1].Value;
                slicerElements = msg[2].Value;oclientProxy.currentReport = msg[3].Value; oclientProxy.reports= msg[4].Value;
            }
            else if (msg.d != undefined) {
               columnElements = msg.d[0].Value; rowElements = msg.d[1].Value;
                slicerElements = msg.d[2].Value; oclientProxy.currentReport = msg.d[3].Value; oclientProxy.reports = msg.d[4].Value
             }
            else {
              columnElements = msg.Columns; rowElements = msg.Rows;
                slicerElements = msg.Slicers; oclientProxy.currentReport = msg.CurrentReport;
                oclientProxy.reports = msg.ClientReports;
            }
            oclientProxy.element.find(".cubeTable").find(".categoricalAxis").parent().html("").html(oclientProxy._createAxisElementBuilder(columnElements, rowElements, slicerElements));
            oclientProxy.element.find(".categoricalAxis, .rowAxis, .slicerAxis").find("button").ejButton({ height: "20px", type: ej.ButtonType.Button });
            oclientProxy.element.find(".categoricalAxis, .rowAxis, .slicerAxis").addClass("e-droppable");
            oclientProxy._renderControls();
            oclientProxy._setSplitBtnTitle();
            oclientProxy._unWireEvents();
            oclientProxy._wireEvents();
            oclientProxy._trigger("renderSuccess", oclientProxy);
            this._buttonContextMenu();
        },

        _measureGroupChangedSuccess: function (cubeTree) {
            var cubeTreeInfo;
            if (cubeTree[0] != undefined) {
                cubeTreeInfo = cubeTree[0].Value;
            }
            if (cubeTree.d != undefined) {
                cubeTreeInfo = cubeTree.d[0].Value;
            }
            else
                cubeTreeInfo = cubeTree.CubeTreeInfo;
            this.element.find(".e-treeview, .cubeTreeView").remove();
            var cubeTree = ej.buildTag("div#cubeTreeView.cubeTreeView")[0].outerHTML;
            this.element.find(".cubeBrowser").append(cubeTree);
            var treeViewData = $.parseJSON(cubeTreeInfo);
            this.element.find(".cubeTreeView").ejTreeView({
                fields: { id: "id", parentId: "pid", text: "name", spriteCssClass: "spriteCssClass", dataSource: treeViewData },
                allowDragAndDrop: true,
                allowDropChild: false,
                allowDropSibling: false,
                enableRTL: this.model.enableRTL,
                dragAndDropAcrossControl: true,
                nodeDragStart: function () {
                    isDragging = true;
                },
                nodeDropped: ej.proxy(this._nodeDropped, this),
                beforeDelete: function () {
                    return false;
                },
                height: "464px"
            });
            var treeViewElements = oclientProxy.element.find(".cubeTreeView").find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                treeViewElements[i].setAttribute("tag", treeViewData[i].tag);
            }
            oclientProxy._unWireEvents();
            oclientProxy._wireEvents();
            oclientWaitingPopup.hide();
            oclientProxy._successAction = "MeasureGroupChange";
        },

        _cubeChangedSuccess: function (report) {
            var cubeTreeInfo, chartSettings;
            if (report[0] != undefined) {
                oclientProxy.currentReport = report[0].Value; cubeTreeInfo = report[1].Value; oclientProxy.reports = report[2].Value;
                reportsCount = report[3].Value; reportList = $.parseJSON(report[4].Value);
                if (oclientProxy.model.enableMeasureGroups) oclientProxy.measureGroupInfo = $.parseJSON(report[5].Value);
                chartSettings = $.parseJSON(report[6].Value);
                if (report[7] != null && report[7] != undefined)
                    oclientProxy.model.customObject = report[7].Value;
            }
            else if (report.d != undefined) {
                oclientProxy.currentReport = report.d[0].Value; cubeTreeInfo = report.d[1].Value; oclientProxy.reports = report.d[2].Value;
                reportsCount = report.d[3].Value; reportList = $.parseJSON(report.d[4].Value);
                if (oclientProxy.model.enableMeasureGroups) oclientProxy.measureGroupInfo = $.parseJSON(report.d[5].Value);
                chartSettings = $.parseJSON(report.d[6].Value);
                if (report.d[7] != null && report.d[7] != undefined)
                    oclientProxy.model.customObject = report.d[7].Value;
            }
            else {

                oclientProxy.currentReport = report.NewReport; cubeTreeInfo = report.CubeTreeInfo; oclientProxy.reports = report.ClientReports;
                reportsCount = report.ReportsCount; reportList = $.parseJSON(report.ReportList);
                if (oclientProxy.model.enableMeasureGroups) oclientProxy.measureGroupInfo = $.parseJSON(report.MeasureGroups);
                chartSettings = $.parseJSON(report.ControlSettings);
                if (report.customObject != null && report.customObject != undefined)
                    oclientProxy.model.customObject = report.customObject;
            }
            oclientProxy.model.chartType = chartSettings.ChartType.toLowerCase();
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "cubeChanged", element: this.element, customObject: this.model.customObject });
            if (!this.model.enableDeferUpdate)
            this.element.find(".splitBtn, .e-pivotgrid, .e-pivotchart, .e-treeview, .cubeTreeView, .cubeName").remove();
            else
                this.element.find(".splitBtn, .e-treeview, .cubeTreeView, .cubeName").remove();
            var cubeTree = ej.buildTag("div#cubeTreeView.cubeTreeView")[0].outerHTML;
            var cubeName = ej.buildTag("div.cubeName", this.currentCubeName)[0].outerHTML;
            if (this.model.enableMeasureGroups) {
                this._createMeasureGroup();               
            }
            var treeViewData = $.parseJSON(cubeTreeInfo);
            $(cubeTree).appendTo(".cubeBrowser");
            this.element.find(".cubeTreeView").ejTreeView({
                fields: { id: "id", parentId: "pid", text: "name", spriteCssClass: "spriteCssClass", dataSource: treeViewData },
                allowDragAndDrop: true,
                allowDropChild: false,
                allowDropSibling: false,
                enableRTL: this.model.enableRTL,
                dragAndDropAcrossControl: true,
                nodeDragStart: function () {
                    isDragging = true;
                },
                nodeDropped: ej.proxy(this._nodeDropped, this),
                beforeDelete: function () {
                    return false;
                },
                height: this.model.enableMeasureGroups ? "464px" : "495px"
            });
             var treeViewElements = oclientProxy.element.find(".cubeTreeView").find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                treeViewElements[i].setAttribute("tag", treeViewData[i].tag);
            }
            this.element.find(".reportlist").ejDropDownList("option", "change", "");
            this.element.find(".reportlist").ejDropDownList("option", "dataSource", reportList);
            this.element.find(".reportlist").ejDropDownList("option", "value", reportList[0].name);
            $(cubeName).prependTo(".cubeBrowser");
            oclientProxy._renderControls();
            oclientProxy._unWireEvents();
            oclientProxy._wireEvents();
            oclientWaitingPopup.hide();
            oclientProxy._successAction = "CubeChange";
            oclientProxy._trigger("renderSuccess", oclientProxy);
            this._treeContextMenu();
        },
        _createMeasureGroup : function() {
            this.element.find(".measureGroupselector").remove();
            var measureGroupDropdown = "<div class ='measureGroupselector' style='margin:5px 5px 0px 5px'><input type='text' id='measureGroupSelector' class='measureGroupSelector' /></div>";
            $(measureGroupDropdown).prependTo(".cubeBrowser");
            this.element.find(".measureGroupSelector").ejDropDownList({
                dataSource: oclientProxy.measureGroupInfo,
                enableRTL: this.model.enableRTL,
                fields: { text: "name", value: "name" },
                height: "25px",
                width: "100%"
            });
            this.element.find(".measureGroupSelector").attr("tabindex", 0);
            measureDropTarget = oclientProxy.element.find('.measureGroupSelector').data("ejDropDownList");
            measureDropTarget.selectItemByText(measureDropTarget.model.dataSource[0].name);
            this.element.find(".measureGroupSelector").ejDropDownList("option", "change", ej.proxy(oclientProxy._measureGroupChanged, oclientProxy));  
        },
        _treeContextMenu : function(){
            var contextTag = ej.buildTag("ul.pivotTreeContext#pivotTreeContext", ej.buildTag("li", ej.buildTag("a", oclientProxy._getLocalizedLabels("AddToColumn"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", oclientProxy._getLocalizedLabels("AddToRow"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", oclientProxy._getLocalizedLabels("AddToSlicer"))[0].outerHTML)[0].outerHTML)[0].outerHTML;
            $(oclientProxy.element).append(contextTag);
            $("#pivotTreeContext").ejMenu({
                menuType: ej.MenuType.ContextMenu,
                openOnClick: false,
                contextMenuTarget: oclientProxy.element.find(".cubeTreeView")[0],
                click: ej.proxy(oclientProxy._onTreeContextClick, oclientProxy),
                beforeOpen: ej.proxy(oclientProxy._onContextOpen, oclientProxy),
                close: ej.proxy(oclientProxy._onPreventPanelClose, oclientProxy)
            });
        },
        _removeSplitButtonSuccess: function (report) {
            if (report[0] != undefined) {
                oclientProxy.currentReport = report[0].Value; oclientProxy.reports = report[1].Value;
                if (report[2] != null && report[2] != undefined)
                    oclientProxy.model.customObject = report[2].Value;
            }
            else if (report.d != undefined) {
                oclientProxy.currentReport = report.d[0].Value; oclientProxy.reports = report.d[1].Value;
                if (report.d[2] != null && report.d[2] != undefined)
                    oclientProxy.model.customObject = report.d[2].Value;
            }
            else {
                oclientProxy.currentReport = report.UpdatedReport; oclientProxy.reports = report.ClientReports;
                if (report.customObject != null && report.customObject != undefined)
                    oclientProxy.model.customObject = report.customObject;
            }
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "removeSplitButton", element: this.element, customObject: this.model.customObject });
            oclientProxy._renderControls();
            oclientProxy._unWireEvents();
            oclientProxy._wireEvents();
            oclientProxy._successAction = "ButtonRemove";
            oclientProxy._trigger("renderSuccess", oclientProxy);
        },

        _chartTypeChangedSuccess: function (report) {
            if (report[0] != undefined) {
                this.currentReport = report[0].Value;
                this.reports = report[1].Value;
            }
            else if (report.d != undefined) {
                this.currentReport = report.d[0].Value;
                this.reports = report.d[1].Value;
            }
            else {
                this.currentReport = report.CurrentReport;
                this.reports = report.ClientReports;
            }

        },

        _mdxQuery: function (mdxquery) {
            oclientProxy.element.find(".e-dialog").hide();
            oclientProxy.element.find(".e-dialog, .clientDialog").remove();
            if (mdxquery.d != undefined)
                oclientProxy._createDialog("mdx", mdxquery.d, "");
            else
                oclientProxy._createDialog("mdx", mdxquery, "");
        },

        _toolbarOperationSuccess: function (report) {
            if (report != null)
                if ((report.d != undefined && report.d || report[0] != undefined && report[0]) || report.CurrentReport) {
                    var columnElements, rowElements, slicerElements, action, renamedReport, chartSettings;
                    if (report.length > 1 && report[0] != undefined) {
                        oclientProxy.currentReport = report[0].Value; oclientProxy.reports = report[1].Value; reportsCount = report[2].Value; columnElements = report[3].Value;
                        rowElements = report[4].Value; slicerElements = report[5].Value; action = report[6].Value; reportList = $.parseJSON(report[7].Value);
                        renamedReport = report[8].Value; chartSettings = $.parseJSON(report[9].Value); cubeTreeInfo = report[10].Value; var cubeSelector = report[11].Value; if (oclientProxy.model.enableMeasureGroups) oclientProxy.measureGroupInfo = report[12].Value;
                        if (report[13] != null && report[13] != undefined)
                            oclientProxy.model.customObject = report[13].Value;
                    }
                    else if (report.d != undefined) {
                        oclientProxy.currentReport = report.d[0].Value; oclientProxy.reports = report.d[1].Value; reportsCount = report.d[2].Value; columnElements = report.d[3].Value;
                        rowElements = report.d[4].Value; slicerElements = report.d[5].Value; action = report.d[6].Value; reportList = $.parseJSON(report.d[7].Value);
                        renamedReport = report.d[8].Value; chartSettings = $.parseJSON(report.d[9].Value); cubeTreeInfo = report.d[10].Value; cubeSelector = report.d[11].Value; if (oclientProxy.model.enableMeasureGroups) oclientProxy.measureGroupInfo = report.d[12].Value;
                        if (report.d[13] != null && report.d[13] != undefined)
                            oclientProxy.model.customObject = report.d[13].Value;
                    }
                    else {

                        oclientProxy.currentReport = report.CurrentReport; oclientProxy.reports = report.Reports; reportsCount = report.ReportsCount; columnElements = report.Columns;
                        rowElements = report.Rows; slicerElements = report.Slicers; action = report.CurrentAction; reportList = $.parseJSON(report.ReportList);
                        renamedReport = report.RenamedReport; chartSettings = $.parseJSON(report.ControlSettings); cubeTreeInfo = report.CubeTreeInfo; cubeSelector = report.CubeSelector; if (oclientProxy.model.enableMeasureGroups) oclientProxy.measureGroupInfo = $.parseJSON(report.MeasureGroups);
                        if (report.customObject != null && report.customObject != undefined)
                            oclientProxy.model.customObject = report.customObject;
                    }
                    oclientProxy.model.chartType = chartSettings.ChartType.toLowerCase();

                    if (this.model.afterServiceInvoke != null)
                        this._trigger("afterServiceInvoke", { action: "toolbarOperation", element: this.element, customObject: this.model.customObject });
                    if (action != "Report Change") {
                        this.element.find(".reportlist").ejDropDownList("option", "change", "");
                        this.element.find(".reportlist").ejDropDownList("option", "dataSource", reportList);
                        if (action == "Load Report") {
                            ddlTarget._initValue = true;
                            ddlTarget.selectItemByText(cubeSelector);
                            ddlTarget._initValue = false;
                            reportDropTarget.selectItemByText(reportDropTarget.model.dataSource[0].name);
                            this._selectedReport = reportDropTarget.currentValue;
                            $(".cubeName").html(cubeSelector);
                            var treeViewData = $.parseJSON(cubeTreeInfo);
                            this.element.find(".cubeTreeView").ejTreeView({
                                fields: { id: "id", parentId: "pid", text: "name", spriteCssClass: "spriteCssClass", dataSource: treeViewData },
                                allowDragAndDrop: true,
                                allowDropChild: false,
                                allowDropSibling: false,
                                enableRTL: this.model.enableRTL,
                                dragAndDropAcrossControl: true,
                                nodeDragStart: function () {
                                    isDragging = true;
                                },
                                nodeDropped: ej.proxy(this._nodeDropped, this),
                                beforeDelete: function () {
                                    return false;
                                },
                                height: this.model.enableMeasureGroups ? "464px" : "495px"
                            });
                            var treeViewElements = oclientProxy.element.find(".cubeTreeView").find("li");
                            for (var i = 0; i < treeViewElements.length; i++) {
                                treeViewElements[i].setAttribute("tag", treeViewData[i].tag);
                            }
                            if (this.model.enableMeasureGroups) {
                                this._createMeasureGroup();
                            }
                        }
                        else if (action != "Rename Report") {
                            reportDropTarget.selectItemByText(reportDropTarget.model.dataSource[reportList.length - 1].name);
                            this._selectedReport = reportDropTarget.currentValue;
                        }
                        else {
                            reportDropTarget.selectItemByText(renamedReport);
                            this._selectedReport = reportDropTarget.currentValue;
                        }
                        this.element.find(".reportlist").ejDropDownList("option", "change", ej.proxy(this._reportChanged, this));
                    }
                    if (action != "Rename Report")
                        if (this.model.enableDeferUpdate)
                            this.element.find(".splitBtn").remove();
                        else
                        this.element.find(".splitBtn, .e-pivotgrid, .e-pivotchart").remove();
                    if (action == "Remove Report" || action == "Report Change" || action == "Load Report" || action == "SortOrFilter" || action == "Save Report") {
                        $(oclientProxy._createSplitButtons(columnElements, "Columns")).appendTo(".categoricalAxis");
                        $(oclientProxy._createSplitButtons(rowElements, "Rows")).appendTo(".rowAxis");
                        $(oclientProxy._createSplitButtons(slicerElements, "Slicers")).appendTo(".slicerAxis");
                        this.element.find(".categoricalAxis, .rowAxis, .slicerAxis").find("button").ejButton({ height: "20px", type: ej.ButtonType.Button });
                            oclientProxy._renderControls();
                        }
                    if (action == "Add Report" || action == "New Report")
                            oclientProxy._renderControls();
                    }
            this._treeContextMenu();
            this._buttonContextMenu();
            oclientProxy._setSplitBtnTitle();
            oclientProxy._unWireEvents();
            oclientProxy._wireEvents();
            oclientProxy._successAction = "ToolbarOperation";
            oclientProxy._trigger("renderSuccess", oclientProxy);
            oclientWaitingPopup.hide();
        },

        _fetchChildNodeSuccess: function (data) {
 
            var newDataSource; var parentNode;
            if (data.length > 1 && data[0] != undefined)
                newDataSource = JSON.parse(data[0].Value);
            else if (data.d != undefined)
                newDataSource = JSON.parse(data.d[0].Value);
            else
                newDataSource = JSON.parse(data.ChildNodes);
            if (data[0] != undefined) {
                if (data[2] != null && data[2] != undefined)
                    oclientProxy.model.customObject = data[2].Value;
            }
            else if (data.d != undefined) {
                if (data.d[2] != null && data.d[2] != undefined)
                    oclientProxy.model.customObject = data.d[2].Value;
            }
            else {
                if (data.customObject != null && data.customObject != undefined)
                    oclientProxy.model.customObject = data.customObject;
            }
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "memberExpanded", element: this.element, customObject: this.model.customObject });
            var mapper = { id: "id", parentId: "pid", hasChild: "hasChildren", text: "name", isChecked: "checkedStatus" };
            if ($(this.pNode).parents("li").length > 1)
                parentNode = $(this.pNode).parents("li").first();
            else
                parentNode = $(this.pNode).parents("li");
            $($(parentNode).find('input.nodecheckbox')[0]).ejCheckBox({ checked: false })
            this.memberTreeObj.addNode(newDataSource, parentNode);
            $.each($(parentNode).children().find("li"), function (index, value) {
                value.setAttribute("tag", newDataSource[index].tag);
            });
            //this.memberTreeObj._expandCollapseAction(this.pNode);
            oclientProxy._successAction = "FetchChildNode";
            oclientProxy._trigger("renderSuccess", oclientProxy);
        },

        _reportToolbar: function () {
            return ej.buildTag("ul", ej.buildTag("li.newReportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("NewReport")).attr({ "title": this._getLocalizedLabels("NewReport"), tabindex: 0 })[0].outerHTML +
            ej.buildTag("li.addReportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("AddReport")).attr({ "title": this._getLocalizedLabels("AddReport"), tabindex: 0 })[0].outerHTML +
            ej.buildTag("li.removeReportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("RemoveReport")).attr({ "title": this._getLocalizedLabels("RemoveReport"), tabindex: 0 })[0].outerHTML +
            ej.buildTag("li.renameReportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("RenameReport")).attr({ "title": this._getLocalizedLabels("RenameReport"), tabindex: 0 })[0].outerHTML +
            ej.buildTag("li.saveReportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("SaveReport")).attr({ "title": this._getLocalizedLabels("SaveReport"), tabindex: 0 })[0].outerHTML +
            ej.buildTag("li.loadReportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("LoadReport")).attr({ "title": this._getLocalizedLabels("LoadReport"), tabindex: 0 })[0].outerHTML +
            ej.buildTag("li.mdxImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("MDXQuery")).attr({ "title": this._getLocalizedLabels("MDXQuery"), tabindex: 0 })[0].outerHTML +
            (this.model.enableDeferUpdate ? (ej.buildTag("li.autoExecuteImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("DeferUpdate")).attr({ "title": this._getLocalizedLabels("DeferUpdate"), tabindex: 0 })[0].outerHTML) : "") +
            ej.buildTag("li.excelExportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("ExportToExcel")).attr({ "title": this._getLocalizedLabels("ExportToExcel"), tabindex: 0 })[0].outerHTML +
            ej.buildTag("li.wordExportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("ExportToWord")).attr({ "title": this._getLocalizedLabels("ExportToWord"), tabindex: 0 })[0].outerHTML +
            ej.buildTag("li.pdfExportImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("ExportToPdf")).attr({ "title": this._getLocalizedLabels("ExportToPdf"), tabindex: 0 })[0].outerHTML +
            (oclientProxy.model.displaySettings.enableFullScreen ? (ej.buildTag("li.maximizedView e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("FullScreen")).attr({ "title": this._getLocalizedLabels("FullScreen"), tabindex: 0 })[0].outerHTML) : "") +
			ej.buildTag("li.colSortFilterImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("SortOrFilterColumn")).attr({ "title": this._getLocalizedLabels("SortOrFilterColumn"), tabindex: 0 })[0].outerHTML +
            ej.buildTag("li.rowSortFilterImg e-icon", "", {}).attr("aria-label",this._getLocalizedLabels("SortOrFilterRow")).attr({ "title": this._getLocalizedLabels("SortOrFilterRow"), tabindex: 0 })[0].outerHTML +
	        ej.buildTag("li.toggleaxisImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("ToggleAxis")).attr({ "title": this._getLocalizedLabels("ToggleAxis"), tabindex: 0 })[0].outerHTML +
            ej.buildTag("li.chartTypesImg e-icon", "", {}).attr("aria-label", this._getLocalizedLabels("ChartTypes")).attr({ "title": this._getLocalizedLabels("ChartTypes"), tabindex: 0 })[0].outerHTML +
            ej.buildTag("li.reportCol e-icon", "", {}).attr("aria-label", "report").attr({ "title": this._getLocalizedLabels("ReportList"), tabindex: 0 })[0].outerHTML);
        },

        _createCubeSelector: function () {
            return ej.buildTag("div.csHeader", ej.buildTag("span.cubeText", this._getLocalizedLabels("CubeSelector"), { "padding-left": "6px", "float": "left", "margin-bottom" : "10px" })[0].outerHTML + ej.buildTag("div", "<input type='text' id='cubeSelector' class ='cubeSelector' />", { display: "inline", "float": "left", "padding-left": "5px", "position": "relative", "top": "-3px" })[0].outerHTML, { width: (oclientProxy.model.isResponsive) ? "100%" : "415px", height: "20px" })[0].outerHTML;
        },

        _createCubeBrowser: function (cubeTreeInfo) {
            return ej.buildTag("div.cdbHeader", ej.buildTag("span", this._getLocalizedLabels("CubeDimensionBrowser"))[0].outerHTML, { width: "200px", height: "30px" })[0].outerHTML + ej.buildTag("div.cubeBrowser", ej.buildTag("div.cubeTreeView.visibleHide")[0].outerHTML, { width: "200px", height: "523px" })[0].outerHTML;
        },

        _createAxisElementBuilder: function (columnDimensions, rowDimensions, slicerDimensions) {
            var AEBPanel = ej.buildTag("div.axisHeader", ej.buildTag("span", this._getLocalizedLabels("Column"))[0].outerHTML, { height: "30px" })[0].outerHTML + ej.buildTag("div.categoricalAxis",ej.buildTag("p#categcol","colum",{"display":"none"})[0].outerHTML+this._createSplitButtons(columnDimensions, "Columns"), { width: this.model.isResponsive ? "99%" : "200px", height: "150px" }).attr("aria-describedby","categcol")[0].outerHTML +
            ej.buildTag("div.axisHeader", ej.buildTag("span", this._getLocalizedLabels("Row"))[0].outerHTML, { height: "30px" })[0].outerHTML + ej.buildTag("div.rowAxis", ej.buildTag("p#categrow", "row", {"display":"none"})[0].outerHTML+this._createSplitButtons(rowDimensions, "Rows"), { width: this.model.isResponsive ? "99%" : "200px", height: "150px" }).attr("aria-describedby","categrow")[0].outerHTML +
            ej.buildTag("div.axisHeader", ej.buildTag("span", this._getLocalizedLabels("Slicer"))[0].outerHTML, { height: "30px" })[0].outerHTML + ej.buildTag("div.slicerAxis",ej.buildTag("p#sliceaxis","slicer",{"display":"none"})[0].outerHTML+this._createSplitButtons(slicerDimensions, "Slicers"), { width: this.model.isResponsive ? "99%" : "200px", height: "150px" }).attr("aria-describedby","sliceaxis")[0].outerHTML;
            return AEBPanel;
        },

        _createSplitButtons: function (dimensionElements, axis) {
            var splitButtons = '';
            var captionName = '';
            if (dimensionElements.indexOf("~") > -1)
                for (var i = 0; i < dimensionElements.split('~')[0].split('#').length - 1; i++) {
                    captionName = dimensionElements.split('~')[0].split('#')[i + 1].split('.')[0];
                    if (captionName == "Measures") {
                        captionName = oclientProxy._getLocalizedLabels("Measures");
                    }
                    else if (!(dimensionElements.startsWith("#Measure")))
                        captionName = dimensionElements.split('~')[i + 2];
                    else if ((dimensionElements.indexOf("#Measure")) > -1)
                        captionName = dimensionElements.split('~')[i + 1];
                    if (captionName == undefined)
                        captionName = dimensionElements.split('~')[i + 1];
                    splitButtons += ej.buildTag("div.splitBtn", ej.buildTag("button", captionName).attr({ "title": dimensionElements.split('~')[0].split('#')[i + 1].replace('.', ' - ') })[0].outerHTML + ej.buildTag("span.removeSplitBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML, "", { "tag": axis + ':' + dimensionElements.split('~')[0].split('#')[i + 1] })[0].outerHTML;
                }
            else
                for (var i = 0; i < dimensionElements.split('#').length - 1; i++) {
                    var caption = dimensionElements.split('#')[i + 1].split('.')[0] == "Measures" ? oclientProxy._getLocalizedLabels("Measures") : dimensionElements.split('#')[i + 1].split('.')[0];
                    if (caption.split("::")[1] == "NAMEDSET") {
                        caption = caption.split("::")[0];
                    }
                    var splitBtnTitle = dimensionElements.split('#')[i + 1].replace('.', ' - ') == "Measures" ? oclientProxy._getLocalizedLabels("Measures") : dimensionElements.split('#')[i + 1].replace('.', ' - ');
                    if (this.model.enableRTL && splitBtnTitle.indexOf("-")>0) {
                        splitBtnTitle = splitBtnTitle.split("-").reverse().join(" - ");
                    }
                    splitButtons += ej.buildTag("div.splitBtn", ej.buildTag("button", caption).attr({ "title": splitBtnTitle })[0].outerHTML + ej.buildTag("span.removeSplitBtn e-icon").attr("role","button").attr("aria-label","remove")[0].outerHTML, "", { "tag": axis + ':' + dimensionElements.split('#')[i + 1] })[0].outerHTML;
                }
            return splitButtons;
        },

        _setSplitBtnTitle: function () {
            var pivotButtons = this.element.find(".splitBtn");
            for (var i = 0; i < pivotButtons.length; i++) {
                var tagValue = $(pivotButtons[i]).attr("tag").split(":")[1].split("."),
                uniqueName = "", orgName = "";
                for (var j = 0; j < tagValue.length; j++) {
                    if (tagValue[0].toUpperCase() != "[Measures]")
                        uniqueName += "[" + tagValue[j] + "]" + (j % 2 == 0 ? "." : "");
                    else
                        uniqueName += tagValue[j] + (j % 2 == 0 ? "." : "");
                }
                if (oclientProxy.element.find(".cubeTreeView").length > 0 && !(uniqueName.indexOf("Measures") >= 0)) {
                    uniqueName = uniqueName.indexOf("<>") > 0 ? uniqueName.replace("<>", ".") : uniqueName;
                    var liElementText = oclientProxy.element.find(".cubeTreeView").find("li[tag='" + uniqueName + "'] a:eq(0)").text();
                    if (liElementText == "")
                        liElementText = oclientProxy.element.find(".cubeTreeView").find("li[tag='" + "[" + tagValue[1] + "]" + "'] a:eq(0)").text();
                    if (liElementText.indexOf(".") > 0)
                        $(pivotButtons[i]).find("button").attr("title", (this.model.enableRTL ? liElementText.split(".").reverse().join(" - ") : liElementText.replace('.', ' - ')));
                    else {
                        var splBtnTitle = $(pivotButtons[i]).text() + " - " + (oclientProxy.element.find(".cubeTreeView").find("li[tag='" + uniqueName + "'] a:eq(0)").text() || oclientProxy.element.find(".cubeTreeView").find("li[tag='" + uniqueName.toUpperCase() + "'] a:eq(0)").text() || liElementText);
                        splBtnTitle = (this.model.enableRTL && splBtnTitle.indexOf("-")>0 ? splBtnTitle.split("-").reverse().join(" - ") : splBtnTitle);
                        $(pivotButtons[i]).find("button").attr("title", splBtnTitle);
                    }
                }


            }
        },

        _controlPanel: function () {
            var controlTable; var gridDiv;
            if (this.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tab && (this.displayMode() == ej.olap.OlapClient.DisplayMode.ChartAndGrid || this.displayMode() == "")) {
                if (oclientProxy.model.isResponsive) {
                    this._chartHeight = "542px";
                    this._chartWidth = "98%";
                    this._gridHeight = "100%";
                    this._gridWidth = "100%";
                }
                else {
                    this._chartHeight = "538px";
                    this._chartWidth = "558px";
                    this._gridHeight = "535px";
                    this._gridWidth = 555;
                }

            }
            else if (this.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile && (this.displayMode() == ej.olap.OlapClient.DisplayMode.ChartAndGrid || this.displayMode() == "")) {
                if (oclientProxy.model.isResponsive) {
                    this._chartHeight = "275px";
                    this._chartWidth = "98%";
                    this._gridHeight = "550px";
                    this._gridWidth = "100%";
                }
                else {
                    this._chartHeight = "275px";
                    this._chartWidth = "559px";
                    this._gridHeight = "550px";
                    this._gridWidth = 555;
                }
            }
            else {
                if (oclientProxy.model.isResponsive) {
                    this._chartHeight = "560px";
                    this._chartWidth = "98%";
                    this._gridHeight = "550px";
                    this._gridWidth = "100%";
                }
                else {
                    this._chartHeight = "571px";
                    this._chartWidth = "557px";
                    this._gridHeight = "572px";
                    this._gridWidth = 555;
                }
            }
            if (this.displayMode() != ej.olap.OlapClient.DisplayMode.ChartOnly) {
                if (this.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile && this.displayMode() == ej.olap.OlapClient.DisplayMode.ChartAndGrid) {
                    if (this.defaultView() == ej.olap.OlapClient.DefaultView.Grid)
                        gridDiv = ej.buildTag("div#gridPanel.gridPanel", ej.buildTag("div.gridContainer", ej.buildTag("div#PivotGrid", "", { "margin": "5px 7px 7px", "max-height": "290px", "overflow": "auto", "padding": "1px" })[0].outerHTML, { "position": "relative", "left": "5px", "top": "5px", "height": "300px", "width": this.model.isResponsive ? "98%" : "574px" })[0].outerHTML, { width: "auto", height: "auto" })[0].outerHTML;
                    else
                        gridDiv = ej.buildTag("div#gridPanel.gridPanel", ej.buildTag("div.gridContainer", ej.buildTag("div#PivotGrid", "", { "margin": "10px 7px 7px", "max-height": "290px", "padding": "1px", "width": this.model.isResponsive ? "auto" : "554px" })[0].outerHTML, { "position": "relative", "left": "7px", "border-top": "none", "margin-top": "-7px", "overflow": "auto", "height": "297px", "width": this.model.isResponsive ? "98%" : "571px" })[0].outerHTML, { width: "auto", height: "auto" })[0].outerHTML;
                }
                else {
                    if (this.displayMode() == ej.olap.OlapClient.DisplayMode.GridOnly)
                        gridDiv = ej.buildTag("div#gridPanel.gridPanel", ej.buildTag("div.gridContainer", ej.buildTag("div#PivotGrid", "", { "margin": "5px 7px 7px", "min-height": "300px", "overflow": "auto", "max-height": this._gridHeight, "padding": "1px" })[0].outerHTML, { "position": "absolute", "left": "7px", "height": "584px", "padding-top": "2px", "width": this.model.isResponsive ? "98%" : "571px", "top": "3px" })[0].outerHTML, { width: "auto", height: "auto" })[0].outerHTML;
                    else
                        gridDiv = ej.buildTag("div#gridPanel.gridPanel", ej.buildTag("div.gridContainer", ej.buildTag("div#PivotGrid", "", { "margin": "5px 7px 7px", "min-height": "300px", "overflow": "auto", "max-height": this._gridHeight, "padding": "1px" })[0].outerHTML, { "position": "relative", "left": window.navigator.userAgent.indexOf('Trident') > 0 ? "0px" : "7px", "height": "548px", "padding-top": "5px", "border-top": "none" })[0].outerHTML, { width: "auto", height: "auto" })[0].outerHTML;
                }
            }
            if (this.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                var chartDiv;
                if (this.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile && this.displayMode() == ej.olap.OlapClient.DisplayMode.ChartAndGrid) {
                    if (this.defaultView() == ej.olap.OlapClient.DefaultView.Grid)
                        chartDiv = ej.buildTag("div#chartPanel.chartPanel", ej.buildTag("div.chartContainer", ej.buildTag("div#PivotChart", "", { "min-height": "285px" })[0].outerHTML, { "position": "relative", "left": "-2px", "height": "283px", "padding": "5px 0px 5px 5px", "width": this.model.isResponsive ? "98%" : "569px", "border-top": "none", "margin-right": "-11px" })[0].outerHTML, { width: "98%", height: "auto" })[0].outerHTML;
                    else
                        chartDiv = ej.buildTag("div#chartPanel.chartPanel", ej.buildTag("div.chartContainer", ej.buildTag("div#PivotChart", "", { "min-height": "275px" })[0].outerHTML, { "position": "relative", "height": "280px", "padding": "5px 0px 5px 5px", "width": this.model.isResponsive ? "98%" : "566px" })[0].outerHTML, { width: "98%", height: "auto" })[0].outerHTML;
                }
                else {
                    if (this.displayMode() == ej.olap.OlapClient.DisplayMode.ChartOnly)
                        chartDiv = ej.buildTag("div#chartPanel.chartPanel", ej.buildTag("div.chartContainer", ej.buildTag("div#PivotChart", "", { "min-height": "275px", "height": "576px" })[0].outerHTML, { "position": "relative", "height": "578px", "padding": this.model.enableRTL ? "5px 25px 2px 6px" : "5px 0px 5px 5px", "margin-right": this.model.enableRTL ? "1px" : "-11px" })[0].outerHTML, { width: "98%", height: "auto" })[0].outerHTML;
                    else
                        chartDiv = ej.buildTag("div#chartPanel.chartPanel", ej.buildTag("div.chartContainer", ej.buildTag("div#PivotChart", "", { "min-height": "275px" })[0].outerHTML, { "position": "relative", "top": "-5px", "left": window.navigator.userAgent.indexOf('Trident') > 0 ? "-7px" : "0px", "height": "543px", "padding": this.model.enableRTL ? "5px 5px 0px 5px" : "5px 0px 5px 5px", "border-top": "none", "margin-right": this.model.enableRTL ? "0px":"-11px" ,"margin-left": this.model.enableRTL ? "-11px":"0px"})[0].outerHTML, { width: "98%", height: "auto" })[0].outerHTML;
                }
            }
            if (this.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tab && this.displayMode() == ej.olap.OlapClient.DisplayMode.ChartAndGrid) {
                var tabUl; var tabDiv;
                var gridAnchor = "<a style='font: bold 12px Segoe UI' href='#gridPanel' tabindex='0'>" + this._getLocalizedLabels("Grid") + "</a>";
                var chartAnchor = "<a style='font: bold 12px Segoe UI' href='#chartPanel' tabindex='0'>" + this._getLocalizedLabels("Chart") + "</a>";
                var marginLeft = window.navigator.userAgent.indexOf('Trident') > 0 ? "none" : "7px", marginRight = 0;
                if (this.model.enableRTL) {
                    marginRight = "-" + marginLeft;
                    marginLeft = 0;
                }
                if (this.defaultView() == ej.olap.OlapClient.DefaultView.Chart) {
                    tabUl = ej.buildTag("ul.clientTab", ej.buildTag("li", chartAnchor)[0].outerHTML + ej.buildTag("li", gridAnchor)[0].outerHTML, { "margin-left": marginLeft, "margin-right": marginRight })[0].outerHTML;
                    tabDiv = ej.buildTag("div#clientTab", tabUl + chartDiv + gridDiv)[0].outerHTML;
                }
                else {
                    tabUl = ej.buildTag("ul.clientTab", ej.buildTag("li", gridAnchor)[0].outerHTML + ej.buildTag("li", chartAnchor)[0].outerHTML, { "margin-left": marginLeft, "margin-right": marginRight  })[0].outerHTML;
                    tabDiv = ej.buildTag("div#clientTab", tabUl + gridDiv + chartDiv, { "height": "100%" })[0].outerHTML;
                }
                controlTable = tabDiv;
            }
            else {
                controlTable = this._createControlContainer(this.controlPlacement(), chartDiv, gridDiv);
            }

            return ej.buildTag("div.controlPanel", controlTable, { width: oclientProxy.model.isResponsive ? "100%" : oclientProxy.model.displaySettings.controlPlacement == "tab" ? "572px" : "auto", height: "600px", "top": oclientProxy.model.displaySettings.mode == ej.olap.OlapClient.DisplayMode.GridOnly ? "3px" : "none" })[0].outerHTML;
        },

        _createControlContainer: function (controlPlacement, chartDiv, gridDiv) {
            var controlTable;
            if (this.displayMode() == ej.olap.OlapClient.DisplayMode.ChartOnly)
                controlTable = "<table style='width:100%'><tr><td>" + chartDiv + "</td></tr></table>";
            else if (this.displayMode() == ej.olap.OlapClient.DisplayMode.GridOnly)
                controlTable = "<table style='width:100%'><tr><td>" + gridDiv + "</td></tr></table>";
            else {
                if (this.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile) {
                    if (this.defaultView() == ej.olap.OlapClient.DefaultView.Chart)
                        controlTable = "<table style='width:100%'><tr><td>" + chartDiv + "</td></tr><tr><td>" + gridDiv + "</td></tr></table>";
                    else
                        controlTable = "<table style='width:100%'><tr><td>" + gridDiv + "</td></tr><tr><td>" + chartDiv + "</td></tr></table>";
                }
                else {
                    if (this.defaultView() == ej.olap.OlapClient.DefaultView.Chart)
                        controlTable = "<table style='width:100%'><tr><td valign='top'>" + chartDiv + "</td><td valign='top'>" + gridDiv + "</td></tr></table>";
                    else
                        controlTable = "<table style='width:100%'><tr><td valign='top'>" + gridDiv + "</td><td valign='top'>" + chartDiv + "</td></tr></table>";
                }
            }
            return controlTable;
        },

        _renderPivotGrid: function (tagInfo) {

            this.element.find(".e-dialog").hide();
            if (this.displayMode() != ej.olap.OlapClient.DisplayMode.ChartOnly) {
                var gridDiv;
                if (this.ochartObj != undefined && this.ochartObj._startDrilldown) {
                    var report;
                    try {
                        report = JSON.parse(this.ogridObj.getOlapReport()).Report;
                    }
                    catch (err) {
                        report = this.ogridObj.getOlapReport();
                    }
                    this.ogridObj.doAjaxPost("POST", this.model.url + "/" + this.ogridObj.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillDownGrid", "cellPosition": "", "currentReport": report, "clientReports": this.reports, "headerInfo": tagInfo, layout: this.gridLayout() ,enableRTL:this.model.enableRTL}), this.ogridObj._drillDownSuccess);
                }
                else {
                    if (!this.model.enableDeferUpdate) {
                        this.element.find(".e-pivotgrid, #PivotGrid").remove();
                        if (this.controlPlacement() == ej.olap.OlapClient.ControlPlacement.Tile && this.displayMode() == ej.olap.OlapClient.DisplayMode.ChartAndGrid)
                            gridDiv = ej.buildTag("div#PivotGrid", "", { "margin": "5px 7px 7px", "max-height": "280px", "overflow": "auto", "width": this.model.isResponsive ? "auto" : "563px", "padding": "1px" })[0].outerHTML;
                        else
                            gridDiv = ej.buildTag("div#PivotGrid", "", { "margin": "5px 7px 7px", "min-height": "300px", "overflow": "auto", "max-height": this._gridHeight, "padding": "1px" })[0].outerHTML;
                        $(gridDiv).appendTo(this.element.find(".gridContainer"));
                        if (this.gridLayout() != ej.PivotGrid.Layout.Normal)
                            this.element.find("#PivotGrid").ejPivotGrid({ url: this.model.url, enableRTL:this.model.enableRTL, isResponsive: oclientProxy.model.isResponsive, currentReport: this.currentReport, locale: oclientProxy.locale(), layout: this.gridLayout(), drillSuccess: ej.proxy(this._gridDrillSuccess, this) });
                        else
                            this.element.find("#PivotGrid").ejPivotGrid({ url: this.model.url, enableRTL: this.model.enableRTL, isResponsive: oclientProxy.model.isResponsive, currentReport: this.currentReport, locale: oclientProxy.locale(), drillSuccess: ej.proxy(this._gridDrillSuccess, this) });
                        this.ogridObj = this.element.find('#PivotGrid').data("ejPivotGrid");
                    }
                    else {
                        oclientWaitingPopup.hide();
                    }
                }
            }
        },

        _renderPivotChart: function (drillTag, drillAction) {

            this.element.find(".e-dialog").hide();
            if (this.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                if (this.ogridObj != undefined && this.ogridObj._startDrilldown) {
                    var report = this.ochartObj.getOlapReport();
                    this.ochartObj.doAjaxPost("POST", this.model.url + "/" + this.ochartObj.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": drillAction, "drilledSeries": drillTag, "olapReport": report, "clientReports": this.reports }), this.ochartObj.renderControlSuccess);
                }
                else {
                    if (!this.model.enableDeferUpdate) {
                        this.element.find(".e-pivotchart").remove();
                        var chartDiv = ej.buildTag("div#PivotChart", "", { "min-height": "271px", "height": "auto" })[0].outerHTML;
                        if (this.element.find(".chartContainer").children().length == 0)
                            $(chartDiv).appendTo(this.element.find(".chartContainer"));
                        this.element.find("#PivotChart").ejPivotChart({ url: this.model.url, enableRTL: oclientProxy.model.enableRTL, canResize: oclientProxy.model.isResponsive, currentReport: this.currentReport, customObject: this.model.customObject, locale: oclientProxy.locale(), showTooltip: true, size: { height: oclientProxy._chartHeight, width: oclientProxy._chartWidth }, commonSeriesOptions: { type: oclientProxy.model.chartType, tooltip: { visible: true } }, beforeServiceInvoke: oclientProxy.model.chartLoad, drillSuccess: ej.proxy(oclientProxy._chartDrillSuccess, oclientProxy) });
                        this.ochartObj = this.element.find('#PivotChart').data("ejPivotChart");
                        this.element.find('#PivotChart').width(this.ochartObj.model.size.width);
                    }
                    else {
                        oclientWaitingPopup.hide();
                    }
                }
            }
            if (this.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly)
            if (oclientProxy._toggleExpand && !this.model.isResponsive && (oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() != "treemap") {
                this.element.find(".toggleExpandButton").click();
            }
        },

        _renderPivotTreeMap: function (drillTag, currentAction) {
            this.element.find(".e-dialog").hide();
            if (this.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                if (this.ogridObj != undefined && this.ogridObj._startDrilldown) {
                    var report = this.otreemapObj.getOlapReport();
                    this.otreemapObj.doAjaxPost("POST", this.model.url + "/" + this.otreemapObj.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": currentAction, "drillInfo": drillTag, "olapReport": report, "clientReports": this.reports }), this.otreemapObj.renderControlSuccess);
                    if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                        if (oclientProxy.model.displaySettings.enableFullScreen || oclientProxy.enableTogglePanel() && (oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                            $("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").css({ width: "100%" });
                            oclientProxy.otreemapObj._treeMap.refresh();
                        }
                    }
                }
                else {
                    if (!this.model.enableDeferUpdate) {
                        this.element.find(".e-pivottreemap").remove();
                        var chartDiv = ej.buildTag("div#PivotChart", "", { "min-height": "271px", "height": "auto" })[0].outerHTML;
                        if (this.element.find(".chartContainer").children().length == 0)
                            $(chartDiv).appendTo(this.element.find(".chartContainer"));
                        this.element.find("#PivotChart").ejPivotTreeMap({ url: this.model.url, canResize: oclientProxy.model.isResponsive, currentReport: this.currentReport, customObject: this.model.customObject, locale: oclientProxy.locale(), size: { height: oclientProxy._chartHeight, width: oclientProxy._chartWidth }, beforeServiceInvoke: oclientProxy.model.treeMapLoad, drillSuccess: ej.proxy(oclientProxy._treemapDrillSuccess, oclientProxy) });
                        this.otreemapObj = this.element.find('#PivotChart').data("ejPivotTreeMap");
                        this.element.find('#PivotChart').width(this.otreemapObj.model.size.width);
                    }
                    else {
                        oclientWaitingPopup.hide();
                    }
                }
            }
            if (this.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly)
            if (oclientProxy._toggleExpand && !this.model.isResponsive && (oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                this.element.find(".toggleExpandButton").click();
            }
        },

        _renderControls: function () {
            if ((oclientProxy._isNodeOrButtonDropped && ej.isNullOrUndefined(oclientProxy.chartObj) || oclientProxy._isrenderTreeMap) && oclientProxy.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                oclientProxy._isNodeOrButtonDropped = false;
                oclientProxy._isrenderTreeMap = false;
                oclientProxy.chartObj = null;
                oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                if (ej.isNullOrUndefined(oclientProxy.chartObj) && !ej.isNullOrUndefined(oclientProxy.otreemapObj))
                    oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
            }
            if (oclientProxy.displayMode() == ej.olap.OlapClient.DisplayMode.GridOnly) {
                if (this.defaultView() == ej.olap.OlapClient.DefaultView.Chart) {
                    oclientProxy._renderPivotChart();
                    oclientProxy._renderPivotGrid();
                }
                else {
                    oclientProxy._renderPivotGrid();
                    oclientProxy._renderPivotChart();
                }
            }
            else {
                if (this.defaultView() == ej.olap.OlapClient.DefaultView.Chart) {
                    if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                        if ((oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() != "treemap")
                            oclientProxy._renderPivotChart();
                        else
                            if (oclientProxy.model.enablePivotTreeMap)
                                oclientProxy._renderPivotTreeMap()
                    }
                    else {
                        if (oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").length > 0)
                            oclientProxy._renderPivotChart();
                        else
                            if (oclientProxy.model.enablePivotTreeMap)
                                oclientProxy._renderPivotTreeMap()
                    }
                    oclientProxy._renderPivotGrid();
                }
                else {
                    oclientProxy._renderPivotGrid();
                    if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                        if ((oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() != "treemap")
                            oclientProxy._renderPivotChart();
                        else
                            if (oclientProxy.model.enablePivotTreeMap)
                                oclientProxy._renderPivotTreeMap();
                    }
                    else {
                        if (oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").length > 0)
                            oclientProxy._renderPivotChart();
                        else
                            if (oclientProxy.model.enablePivotTreeMap)
                                oclientProxy._renderPivotTreeMap();
                    }
                }
            }
        },

        _createDialogRequest: function (evt) {
            if (evt.target.className.indexOf("dialogOKBtn") >= 0)
                return;
            args_className = evt.target.className;
            args_innerHTML = (evt.target.innerHTML == "" ? "ToolbarButtons" : evt.target.innerHTML);
            this._dialogTitle = hierarchyCaption = (ej.browserInfo().name == "msie" && ej.browserInfo().version <= 8) ? $(evt.currentTarget)[0].title  : (evt.currentTarget.attributes == "" ? "" : evt.currentTarget.attributes.getNamedItem("title").value);
            oclientProxy._currentItem = hierarchyCaption;
            this.element.find(".e-dialog, .clientDialog").remove();
            if (args_innerHTML != "ToolbarButtons" && args_innerHTML != undefined) {
                oclientWaitingPopup.show();
                if (this.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: "fetchMemberTreeNodes", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                this.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.fetchMemberTreeNodes, JSON.stringify({ "action": "fetchMemberTreeNodes", "dimensionName": $(evt.target).parent().attr("Tag"), "olapReport": oclientProxy.currentReport, "customObject": serializedCustomObject }), oclientProxy._editorTreeInfoSuccess);
            }
            else {
                oclientProxy._createDialog(args_className, args_innerHTML, "");
            }
        },

        _fetchReportListSuccess: function (reportNameList) {

            if (reportNameList[0] != undefined) {
                if (reportNameList[2] != null && reportNameList[2] != undefined)
                    oclientProxy.model.customObject = reportNameList[2].Value;
            }
            else if (reportNameList.d != undefined) {
                if (reportNameList.d[2] != null && reportNameList.d[2] != undefined)
                    oclientProxy.model.customObject = reportNameList.d[2].Value;
            }
            else {
                if (reportNameList.customObject != null && reportNameList.customObject != undefined)
                    oclientProxy.model.customObject = reportNameList.customObject;
            }
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "fetchReportList", element: this.element, customObject: this.model.customObject });
            if (this.model.afterServiceInvoke != null)
                this._trigger("afterServiceInvoke", { action: "fetchReportList", element: this.element, customObject: this.model.customObject });
            oclientProxy.element.find(".e-dialog, .clientDialog").remove();
            if (reportNameList.d != undefined)
                reportNameList = (reportNameList.d[0].Value || reportNameList[0].Value);
            else
                reportNameList = reportNameList.ReportNameList;
            oclientProxy._createDialog("LoadReport", reportNameList, "");
        },

        _fetchSortState: function (value) {

            oclientWaitingPopup.hide();
            if (value[0] != undefined) {
                oclientProxy._createDialog("SortFilterDlg", value[0].Value, "");
            }
            else if (value.d != undefined) {
                oclientProxy._createDialog("SortFilterDlg", value.d[0].Value, "");
            }
            else {
                oclientProxy._createDialog("SortFilterDlg", value.FetchSortState, "");
            }
        },

        _createDialog: function (args_className, args_innerHTML, editorTree) {
               
                 if ((args_className == "SortFilterDlg" || args_className == "mdx")) {
                var pivotButtons, measureCnt, dimCntRw, dimCntCol;
                pivotButtons = this.element.find(".splitBtn");
                measureCnt = jQuery.grep(pivotButtons, function (button) { return ($(button).attr("tag").split(":")[1] == "Measures"); }).length;
                dimCntRw = jQuery.grep(pivotButtons, function (button) { return (($(button).attr("tag").split(":")[1] != "Measures") && ($(button).attr("tag").split(":")[0] == "Rows")); }).length;
                dimCntCol = jQuery.grep(pivotButtons, function (button) { return (($(button).attr("tag").split(":")[1] != "Measures") && ($(button).attr("tag").split(":")[0] == "Columns")); }).length;
                if(args_className == "mdx" && measureCnt == 0 && dimCntCol == 0 ){
                    oclientProxy._createAlertDialog(oclientProxy._getLocalizedLabels("MDXAlertMsg"));
                    return false;
                }

                if (measureCnt > 0 && this.element.find(".categoricalAxis ")[0].childElementCount != 0 ) {
                    if ((!dimCntRw) && (document.activeElement.className.indexOf("rowSortFilterImg") > -1)){
                        oclientProxy._createAlertDialog(oclientProxy._getLocalizedLabels("FilterSortRowAlertMsg"));
                        return false;
                    }
                    else if ((!dimCntCol) && (document.activeElement.className.indexOf("colSortFilterImg") > -1)){
                        oclientProxy._createAlertDialog(oclientProxy._getLocalizedLabels("FilterSortColumnAlertMsg"));
                        return false;
                    }
                }
                else if(args_className != "mdx") {
                    if (!measureCnt && oclientProxy._axis == "Column")
                        oclientProxy._createAlertDialog(oclientProxy._getLocalizedLabels("FilterSortcolMeasureAlertMsg"));
                    else if (!measureCnt && oclientProxy._axis == "Row")
                        oclientProxy._createAlertDialog(oclientProxy._getLocalizedLabels("FilterSortrowMeasureAlertMsg"));
                    else if (!($(".categoricalAxis ")[0].childElementCount))
                        oclientProxy._createAlertDialog(oclientProxy._getLocalizedLabels("FilterSortElementAlertMsg"));
                    return false;
                }
            }
            var transparent = ej.buildTag("div#preventDiv").css({ "width": $("#" + oclientProxy._id).width() + "px", "height": $("#" + oclientProxy._id).height() + "px", "position": "relative", "margin-top": -($("#" + oclientProxy._id).height()) + "px" })[0].outerHTML;
            $(transparent).appendTo("#" + oclientProxy._id);
            var sortDlgField = "";
            var sortState = "", filterState = "";
            var editorTreeInfo;
            if (editorTree[0] != undefined)
                editorTreeInfo = editorTree[0].Value;
            else if (editorTree.d != undefined)
                editorTreeInfo = editorTree.d[0].Value;
            else
                editorTreeInfo = editorTree.EditorTreeInfo;
            var ejDialog = ej.buildTag("div#clientDialog.clientDialog", { "opacity": "1" })[0].outerHTML;
            var dialogContent; var dialogTitle; var currentTag; var searchText;

            if (args_className.split(" ")[0] == "newReportImg") {
                dialogTitle = this._getLocalizedLabels("NewReport");
                currentTag = "New Report";
                var newReportLabel = "<p class='dialogPara'>" + this._getLocalizedLabels("ReportName") + "</p>";
                var newReport = "<input type=text id=reportName class='reportName'/></br>";
                dialogContent = ej.buildTag("div#reportDlg.reportDlg", "<table><tr><td>" + newReportLabel + "</td><td>" + newReport + "</td></tr></table>")[0].outerHTML;
            }
            else if (args_className.split(" ")[0] == "addReportImg") {
                dialogTitle = this._getLocalizedLabels("AddReport");
                currentTag = "Add Report";
                var addReportLabel = "<p class='dialogPara'>" + this._getLocalizedLabels("ReportName") + "</p>";
                var addReport = "<input type=text id=reportName class='reportName'/></br>";
                dialogContent = ej.buildTag("div#reportDlg.reportDlg", "<table><tr><td>" + addReportLabel + "</td><td>" + addReport + "</td></tr></table>")[0].outerHTML;
            }
            else if (args_className.split(" ")[0] == "removeReportImg") {
                dialogTitle = this._getLocalizedLabels("RemoveReport");
                currentTag = "Remove Report";
                if (reportsCount > 1)
                    dialogContent = "<p>" + this._getLocalizedLabels("AreYouSureToDeleteTheReport") + "?</p>";
                else
                    dialogContent = "<p>" + this._getLocalizedLabels("CannotRemoveSingleReport") + "!</p>";
            }
            else if (args_className.split(" ")[0] == "SortFilterDlg") {

                sortDlgField = args_innerHTML.split("||");
                if (sortDlgField[1] != "")
                    sortState = sortDlgField[1].split("<<");
                if (sortDlgField[2] != "")
                    filterState = sortDlgField[2].split("<<");
                oclientProxy.element.find(".e-dialog, .clientDialog").remove();
                dialogTitle = this._getLocalizedLabels("SortingAndFiltering");

                var sortingLbl = ej.buildTag("label#sortingLbl.sortingLbl", this._getLocalizedLabels("Sorting"))[0].outerHTML;
                var measureListLbl = ej.buildTag("label#measureListLbl.measureListLbl", this._getLocalizedLabels("Measure"))[0].outerHTML;
                var orderLbl = ej.buildTag("label#orderLbl.orderLbl", this._getLocalizedLabels("Order"))[0].outerHTML;
                var measureListDropDown = ej.buildTag("input#measuresList.measuresList", "", {}, { type: 'text', accesskey: 'M' })[0].outerHTML;

                var sortDisableRadio = ej.buildTag("input#sortDisable.sortDisable", "", {}, { name: "sort", type: "radio", checked: 'checked', role: 'radio', tabindex: 0, accesskey: 'i' })[0].outerHTML + ej.buildTag("label.sortDisableLbl", this._getLocalizedLabels("Disable"))[0].outerHTML;
                var sortEnableRadio = ej.buildTag("input#sortEnable.sortEnable", "", {}, { name: 'sort', type: 'radio', role: 'radio', tabindex: 1, accesskey: 'n' })[0].outerHTML + ej.buildTag("label.sortEnableLbl", this._getLocalizedLabels("Enable"))[0].outerHTML + "<br/>";
                var newascRadio = ej.buildTag("input#radioBtnAsc.radioBtnAsc", "", {}, { name: 'order', type: 'radio', checked: 'checked', role: 'radio', tabindex: 0, accesskey: 'A' })[0].outerHTML + ej.buildTag("label.radioBtnAscLbl", this._getLocalizedLabels("Ascending"))[0].outerHTML + "<br/>";
                var newdescRadio = ej.buildTag("input#radioBtnDesc.radioBtnDesc", "", {}, { name: 'order', type: 'radio', role: 'radio', tabindex: 2, accesskey: 'e' })[0].outerHTML + ej.buildTag("label.radioBtnDescLbl", this._getLocalizedLabels("Descending"))[0].outerHTML;
                var preservHierarchy = ej.buildTag("input#preserveHrchy.preserveHrchy", "", {}, { type: 'checkbox', checked: 'checked', tabindex: 0, role: 'radio', accesskey: 'r' })[0].outerHTML + ej.buildTag("label.preserveHrchyLbl", this._getLocalizedLabels("PreserveHierarchy"))[0].outerHTML;

                var filter = ej.buildTag("label#filterLbl.filterLbl", this._getLocalizedLabels("Filtering"))[0].outerHTML;
                var filterDisableRadio = ej.buildTag("input#filterDisable.filterDisable", "", {}, { name: 'filter', type: 'radio', checked: 'checked', role: 'radio', tabindex: 0, accesskey: 'i' })[0].outerHTML + ej.buildTag("label.filterDisableLbl", this._getLocalizedLabels("Disable"))[0].outerHTML;
                var filterEnableRadio = ej.buildTag("input#filterEnable.filterEnable", "", {}, { name: 'filter', type: 'radio', role: 'radio', tabindex: 0, accesskey: 'n' })[0].outerHTML + ej.buildTag("label.filterDisableLbl", this._getLocalizedLabels("Enable"))[0].outerHTML + "<br/>";
                var conditionLbl = ej.buildTag("label#conditionLbl.conditionLbl", this._getLocalizedLabels("Condition"))[0].outerHTML;
                var conditionDropDown = ej.buildTag("input#filterCondition.filterCondition", "", {}, { type: 'text', tabindex: 0, accesskey: 'o' })[0].outerHTML;

                var filterFrom = ej.buildTag("div#filterfrom.filterFrmDiv", ej.buildTag("input#filterFrom.filterFrom", "", {}, { name: 'inputVal', type: ej.isMobile() ? 'number' : 'text', inputmode: ej.isMobile() ? 'numeric' : '', pattern: ej.isMobile() ? '[0-9]*' : '', tabindex: 0 })[0].outerHTML)[0].outerHTML;
                var filterbtw = ej.buildTag("div#filterbtw.filterBtw", "<p>" + this._getLocalizedLabels("and") + "</p>")[0].outerHTML;
                var filterTo = ej.buildTag("div#filterto.filterToDiv", ej.buildTag("input#filterTo.filterTo", "", {}, { name: 'inputVal', type: ej.isMobile() ? 'number' : 'text', inputmode: ej.isMobile() ? 'numeric' : '', pattern: ej.isMobile() ? '[0-9]*' : '', tabindex: 0, accesskey: 'd' })[0].outerHTML)[0].outerHTML;
                var fMeasureListLbl = ej.buildTag("label#filterMeasureListLbl.filterMeasureListLbl", this._getLocalizedLabels("Measure"))[0].outerHTML;
                var fMeasureList = ej.buildTag("input#fMeasuresList.fMeasuresList", "", {}, { type: 'text', tabindex: 0, accesskey: 'M' })[0].outerHTML;
                var fValueLbl = ej.buildTag("label#filterValueLbl.filterValueLbl", this._getLocalizedLabels("Value"), {}, { tabindex: 0, accesskey: 'a' })[0].outerHTML;

                var sortDiv = ej.buildTag("div#sortingDlg.sortingDlg", "<table class='sortReportTbl'><tr><td style='vertical-align:top;'>" + sortingLbl + "</td><td>" + sortEnableRadio + sortDisableRadio + "</td></tr><tr><td>" + measureListLbl + "</td><td>" + measureListDropDown + "</td></tr> <tr><td>" + orderLbl + "</td><td>" + newascRadio + newdescRadio + "</td></tr><tr><td></td><td>" + preservHierarchy + "</td></tr></table>")[0].outerHTML;
                var filterDiv = ej.buildTag("div#filteringDlg.filteringDlg", "<table class='sortReportTbl'><tr><td>" + filter + "</td><td>" + filterEnableRadio + filterDisableRadio + "</td></tr><tr><td>" + fMeasureListLbl + "</td><td>" + fMeasureList + "</td></tr><tr><td>" + conditionLbl + "</td><td>" + conditionDropDown + "</td></tr><tr><td>" + fValueLbl + "</td><td>" + filterFrom + filterbtw + filterTo + "</td></tr></table>")[0].outerHTML;

                var sortTab = "<li><a style='font: bold 12px Segoe UI' href='#sortingDlg'>" + this._getLocalizedLabels("Sorting") + "</a></li>";
                var filterTab = "<li><a style='font: bold 12px Segoe UI' href='#filteringDlg'>" + this._getLocalizedLabels("Filtering") + "</a></li>";
                var sortfilterTab = ej.buildTag("div#sortfilterTab.sortfilterTab", "<ul class ='sortfiltTab'>" + (sortTab + filterTab + "</ul>" + sortDiv + filterDiv ))[0].outerHTML;

                dialogContent = sortfilterTab;
            }
            else if (args_className.split(" ")[0] == "renameReportImg") {
                dialogTitle = this._getLocalizedLabels("RenameReport");
                currentTag = "Rename Report";
                var currentReportName = oclientProxy.element.find(".reportlist").val();
                var renameReportLabel = "<p class='dialogPara'>" + oclientProxy._getLocalizedLabels("ReportName") + "</p>";
                renameReport = "<input type=text id=reportName class='reportName' value='" + currentReportName + "' /></br>";
                dialogContent = ej.buildTag("div#reportDlg.reportDlg", "<table><tr><td>" + renameReportLabel + "</td><td>" + renameReport + "</td></tr></table>")[0].outerHTML;
            }
            else if (args_className.split(" ")[0] == "saveReportImg") {
                dialogTitle = this._getLocalizedLabels("SaveReport");
                currentTag = "Save Report";
                var reportNameLabel = "<p class='dialogPara'>" + oclientProxy._getLocalizedLabels("ReportName") + "</p>";
                reportName = "<input type=text id=reportName class='reportName'/></br>";
                dialogContent = ej.buildTag("div#reportDlg.reportDlg", "<table><tr><td>" + reportNameLabel + "</td><td>" + reportName + "</td></tr></table>")[0].outerHTML;
            }
            else if (args_className.split(" ")[0] == "LoadReport") {
                dialogTitle = this._getLocalizedLabels("LoadReport");
                currentTag = "Load Report";
                var reportNameLabel = "<table class='loadReportTbl'><tr><td class='loadReportTd'>" + oclientProxy._getLocalizedLabels("ReportName") + "</td>";
                var reportNamesDropdown = "<td><input type='text' id='reportNameList' class='reportNameList'/></td></tr></table>";
                dialogContent = reportNameLabel + reportNamesDropdown;
            }
            else if (args_className.split(" ")[0] == "mdx") {
                dialogTitle = this._getLocalizedLabels("MDXQuery");
                currentTag = "MDX Query";
                var textarea = "<textarea readonly='readonly' style='width:460px; height:180px; resize:none; margin:3px'>" + args_innerHTML + "</textarea>";
                dialogContent = textarea;
            }
            else if (args_className.split(" ")[0] == "chartTypesImg") {
                dialogTitle = this._getLocalizedLabels("ChartTypes");
                currentTag = "Chart Types";
                var reportNameLabel = "<p class='dialogPara'>" + oclientProxy._getLocalizedLabels("ChartTypes") + "</p>";
                reportName = "<input type=text id=reportName class='reportName'/></br>";
                dialogContent = reportNameLabel + reportName;
            }
            else if (args_className.indexOf("e-txt") > -1) {

                if (args_innerHTML == oclientProxy._getLocalizedLabels("Measures")) {
                    dialogTitle = this._getLocalizedLabels("MeasureEditor");
                    dialogContent = "<p class='editorPara'>" + this._getLocalizedLabels("Measures") + "</p>"
                }
                else {
                    dialogTitle = this._getLocalizedLabels("MemberEditor");
                    dialogContent = "<p class='editorPara'>" + hierarchyCaption + "</p>"

                }
                var memberEditor; var checkOption = "";
                $(innerDiv).appendTo(EditorDiv);
                if (args_innerHTML != oclientProxy._getLocalizedLabels("Measures")) {
                    var checkAll = ej.buildTag("div.checkAll e-icon").attr("role","button").attr("aria-label","checkall")[0].outerHTML;
                    var unCheckAll = ej.buildTag("div.unCheckAll e-icon").attr("role","button").attr("aria-label","uncheckall")[0].outerHTML;
                    checkOption = ej.buildTag("div", checkAll + unCheckAll, { "height": "19px" })[0].outerHTML;
                }
                if (args_innerHTML == oclientProxy._getLocalizedLabels("Measures")) {
                    oclientProxy._isMembersFiltered = false;
                    memberEditor = oclientProxy._createMeasureEditor(editorTree);
                }
                else
                    memberEditor = ej.buildTag("div#editorTreeView.editorTreeView")[0].outerHTML;
                var memberEditorDiv = ej.buildTag("div.memberEditorDiv", memberEditor)[0].outerHTML;
                var innerDiv = ej.buildTag("div", checkOption + memberEditorDiv)[0].outerHTML;
                var EditorDiv = ej.buildTag("div#EditorDiv.editorDiv", innerDiv)[0].outerHTML;
                dialogContent += EditorDiv;
            }
            var dialogFooter;
            if (args_className.split(" ")[0] == "mdx") {
                var cancelBtn = "<button id=CancelBtn class='dialogCancelBtn'>" + this._getLocalizedLabels("OK") + "</button>";
                dialogFooter = ej.buildTag("div.dialogFooter", cancelBtn)[0].outerHTML;
                $(ejDialog).appendTo("#" + oclientProxy._id);
                $(dialogContent + dialogFooter).appendTo(this.element.find(".clientDialog"));
                this.element.find(".clientDialog").ejDialog({ enableRTL:this.model.enableRTL, width: 500, target: "#" + oclientProxy._id, enableResize: false, close: oclientProxy._onPreventPanelClose });
            }
            else {
                var okBtn = "<button id=OKBtn class='dialogOKBtn'>" + this._getLocalizedLabels("OK") + "</button>";
                var cancelBtn = "<button id=CancelBtn class='dialogCancelBtn'>" + this._getLocalizedLabels("Cancel") + "</button>";
                dialogFooter = ej.buildTag("div.dialogFooter", okBtn + ((args_className.split(" ")[0] == "removeReportImg" && reportsCount == 1) ? "" : cancelBtn))[0].outerHTML;
                $(ejDialog).appendTo("#" + oclientProxy._id);
                $(dialogContent + dialogFooter).appendTo(this.element.find(".clientDialog"));
                this.element.find(".clientDialog").ejDialog({ enableRTL: this.model.enableRTL, width: 'auto', target: "#" + oclientProxy._id, enableResize: false, close: oclientProxy._onPreventPanelClose });
                if (args_className.split(" ")[0] == "removeReportImg") {
                    this.element.find(".clientDialog").css("min-height", "60px");
                    this.element.find("#clientDialog_wrapper").css("min-height", "100px");
                }
            }
            this.element.find(".e-titlebar").prepend(ej.buildTag("div", dialogTitle, { "display": "inline" })[0].outerHTML)[0].setAttribute("tag", currentTag)
            this.element.find(".reportName").ejMaskEdit({ enableRTL: this.model.enableRTL,width: "155px" });
            this.element.find(".e-mask").addClass("dialogInput");
            this.element.find(".dialogOKBtn, .dialogCancelBtn").ejButton({ type: ej.ButtonType.Button});
            $(".sortfilterTab").ejTab({ enableRTL: this.model.enableRTL });
            $(".reportNameList").ejDropDownList({
                dataSource: args_innerHTML.split("__"),
                enableRTL: this.model.enableRTL,
                width: "150px",
                height: "20px",
            });
            $(".filterFrom,.filterTo").ejMaskEdit({ width: "80px", height: "20px" });
            $(".measuresList").ejDropDownList({
                dataSource: args_innerHTML.split("||")[0].split("__"),
                enableRTL: this.model.enableRTL,
                width: "80%",
                height: "20px",
            });
            $(".fMeasuresList").ejDropDownList({
                dataSource: args_innerHTML.split("||")[0].split("__"),
                width: "80%",
                enableRTL: this.model.enableRTL,
                height: "20px",
            });
            $(".filterCondition").ejDropDownList({
                change: "_onActiveConditionChange",
                enableRTL: this.model.enableRTL,
                dataSource: [{ option: "EqualTo", value: oclientProxy._getLocalizedLabels("EqualTo") },
                             { option: "NotEquals", value: oclientProxy._getLocalizedLabels("NotEquals") },
                             { option: "GreaterThan", value: oclientProxy._getLocalizedLabels("GreaterThan") },
                             { option: "GreaterThanOrEqualTo", value: oclientProxy._getLocalizedLabels("GreaterThanOrEqualTo") },
                             { option: "LessThan", value: oclientProxy._getLocalizedLabels("LessThan") },
                             { option: "LessThanOrEqualTo", value: oclientProxy._getLocalizedLabels("LessThanOrEqualTo") },
                             { option: "Between", value: oclientProxy._getLocalizedLabels("Between") },
                             { option: "NotBetween", value: oclientProxy._getLocalizedLabels("NotBetween") },
                ],
                fields: { text: "value", value: "option" },
                width: "80%",
                height: "20px",
            });
            oclientProxy.element.find(".filterCondition").ejDropDownList("option", "change", ej.proxy(oclientProxy._onActiveConditionChange, oclientProxy));
            oclientProxy._dllSortMeasure = $(".measuresList").data("ejDropDownList");
            oclientProxy._dllFilterCondition = $(".filterCondition").data("ejDropDownList");
            oclientProxy._dllfMeasuresList = $(".fMeasuresList").data("ejDropDownList");
            if (sortState != "") {
                this.element.find(".radioBtnAsc")[0].checked = sortState[0] == "ASC" ? true : false;
                this.element.find(".radioBtnDesc")[0].checked = sortState[0] == "DESC" ? true : false;
                this.element.find(".sortDisable")[0].checked = !(this.element.find(".sortEnable")[0].checked = true);
                this.element.find(".preserveHrchy")[0].checked = sortState[1] == "PH" ? true : false;
                oclientProxy._isSorted = true;
                oclientProxy._dllSortMeasure.setModel({ value: (sortState[2]) });
            }
            if (filterState != "") {
                this.element.find(".filterEnable")[0].checked = true;
                oclientProxy._dllfMeasuresList.setModel({ value: (filterState[0]) });
                oclientProxy._dllFilterCondition.setModel({ value: (filterState[1]) });
                oclientProxy.element.find(".filterFrom").val(filterState[2]);
                if (filterState[3] != undefined && filterState[3] != "" && (filterState[1] == "Between" || filterState[1] == "NotBetween"))
                    oclientProxy.element.find(".filterTo").val(filterState[3]);
                else
                    $(".filterTo").attr("disabled", "disabled");
                oclientProxy._isFiltered = true;
            }
            if (this.element.find(".sortDisable")[0] != undefined && this.element.find(".sortDisable")[0].checked == true) {
                $('.measuresList_wrapper,.radioBtnAsc, .radioBtnDesc, .preserveHrchy').attr("disabled", "disabled");
                $('.measureListLbl, .orderLbl, .radioBtnAscLbl, .radioBtnDescLbl, .preserveHrchyLbl').addClass('sortFilterDisable');
                oclientProxy._dllSortMeasure.disable();
            }
            if (this.element.find(".filterDisable")[0] != undefined && this.element.find(".filterDisable")[0].checked == true) {
                $('.filterFrom, .filterTo').attr("disabled", "disabled");
                $('.filterMeasureListLbl, .conditionLbl, .filterValueLbl, .filterBtw').addClass('sortFilterDisable');
                oclientProxy._dllFilterCondition.disable();
                oclientProxy._dllfMeasuresList.disable();
            }
            this.element.find(".e-widget-content").height("auto");
            if (editorTree != "" && editorTree != undefined && args_innerHTML != oclientProxy._getLocalizedLabels("Measures")) {
                var treeViewData = null;
                if (oclientProxy._currentReportItems.length != 0) {
                    for (var i = 0; i < oclientProxy._currentReportItems.length; i++) {
                        if (oclientProxy._currentReportItems[i] == oclientProxy._currentItem) {
                            treeViewData = JSON.parse(JSON.stringify(oclientProxy._treeViewData[oclientProxy._currentItem]));
                            break;
                        }
                    }
                }
                if (treeViewData == null)
                    treeViewData = $.parseJSON(editorTreeInfo);
                this.element.find(".editorTreeView").ejTreeView({
                    showCheckbox: true,
                    loadOnDemand: true,
                    enableRTL: this.model.enableRTL,
                    nodeUncheck: function (e, args) {
						oclientProxy._isMembersFiltered = true;
                        if ($(e.currentElement).parents(".e-treeview").find(".e-checkbox:checked").length == 0)
                            oclientProxy.element.find(".dialogOKBtn").data("ejButton").disable();
                    },
                    nodeCheck: function (e) { 
						oclientProxy._isMembersFiltered = true;
						oclientProxy.element.find(".dialogOKBtn").data("ejButton").enable(); 
                    },
                    beforeDelete: function () {
                        return false;
                    },
                    height: $(".memberEditorDiv").height(),
                    fields: { id: "id", hasChild: "hasChildren", text: "name", isChecked: "checkedStatus", dataSource: treeViewData },
                    beforeExpand: ej.proxy(this._onNodeExpand, this),
                });
				oclientProxy._isMembersFiltered = false;
                var treeViewElements = this.element.find(".editorTreeView").find("li");
                for (var i = 0; i < treeViewElements.length; i++) {
                    treeViewElements[i].setAttribute("tag", treeViewData[i].tag);
                }
            }
            this.memberTreeObj = this.element.find('.editorTreeView').data("ejTreeView");
            oclientProxy.element.find("#clientDialog_closebutton").attr("title", oclientProxy._getLocalizedLabels("Close"))
            oclientProxy._unWireEvents();
            oclientProxy._wireEvents();
            oclientWaitingPopup.hide();
        },

        _onPreventPanelClose: function () {
            oclientProxy.element.find("#preventDiv").remove();
        },

        _createMeasureEditor: function (editorTree) {
            var editorTreeInfo;
            if (editorTree[0] != undefined)
                editorTreeInfo = $.parseJSON(editorTree[0].Value);
            else if (editorTree.d != undefined)
                editorTreeInfo = $.parseJSON(editorTree.d[0].Value);
            else
                editorTreeInfo = $.parseJSON(editorTree.EditorTreeInfo);
            var measureEditor = "";
            for (var i = 0; i < editorTreeInfo.length; i++) {
                measureEditor += "<div id=\"" + editorTreeInfo[i].uniqueName + "\"class=measureEditor>" + editorTreeInfo[i].name + "<span class='removeMeasure e-icon' role='button' aria-label='remove'></span></div>";
            }
            return measureEditor;
        },

        _onNodeExpand: function (args) {
            var selectedItem = args.targetElement; var tagInfo;
            var childCount = $(selectedItem).parents("li").first().children().find("li").length;
            for (var i = 0; i < oclientProxy.memberTreeObj.dataSource().length; i++) {
                if (oclientProxy.memberTreeObj.dataSource()[i].parentId == args.id) {
                    args.isChildLoaded = true;
                    break;
                }
            }
            if (!args.isChildLoaded) {
                var checkedState = $(selectedItem).parent().find("input.e-checkbox").prop("checked");
                var tagInfo = $(selectedItem).parents("li").first().attr("tag");
                if (tagInfo == undefined) {
                    for (var i = 0; i < oclientProxy.memberTreeObj.dataSource().length; i++) {
                        if (oclientProxy.memberTreeObj.dataSource()[i].id == args.id) {
                            tagInfo = oclientProxy.memberTreeObj.dataSource()[i].tag;
                            $(args.currentElement[0]).attr("tag", oclientProxy.memberTreeObj.dataSource()[i].tag)
                            break;
                        }
                    }
                }
                this.pNode = selectedItem;
                if (this.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: "memberExpanded", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.memberExpand, JSON.stringify({
                    "action": "memberExpanded", "checkedStatus": checkedState, "parentNode": $(selectedItem).parents("li")[0].id, "tag": tagInfo, "dimensionName": this._dimensionName, "cubeName": this.currentCubeName, "olapReport": this.currentReport, "clientReports": this.reports, "customObject": serializedCustomObject
                }), this._fetchChildNodeSuccess);
            }
        },

        _onActiveConditionChange: function (args) {
            if (args.selectedValue == "Between" || args.selectedValue == "NotBetween") {
                $(".filterTo").removeAttr("disabled");
                $(".filterBtw").removeClass("sortFilterDisable");
            }
            else {
                $(".filterTo").attr("disabled", "disabled");
                oclientProxy.element.find(".filterTo").val("");
                $(".filterBtw").addClass("sortFilterDisable");
            }
        },

        _reSizeHandler: function (args) {
            var isUpdate = true;
            oclientProxy._parentElwidth = $("#" + oclientProxy._id).parent().width();
            if (oclientProxy._parentElwidth < 850 && isUpdate) {
                oclientProxy._rwdToggleCollapse();
            }
            else if (oclientProxy._parentElwidth > 850) {
                oclientProxy._rwdToggleExpand();
                isUpdate = true;
            }
        },

        _chartDrillSuccess: function (sender) {
   
            if (oclientProxy.currentReport != undefined)
                currentReport = oclientProxy.currentReport;
            if (oclientProxy.reports != undefined)
                reports = oclientProxy.reports;
            if (this.ochartObj._startDrilldown && this.ogridObj != null && this.ogridObj != undefined)
                this._renderPivotGrid(this.ochartObj._selectedTagInfo);
            else if (oclientProxy.ogridObj != undefined && oclientProxy.ogridObj.element.find("table") == "block")
                oclientWaitingPopup.hide();
        },

        _treemapDrillSuccess: function (sender) {
            if (oclientProxy.currentReport != undefined)
                currentReport = oclientProxy.currentReport;
            if (oclientProxy.reports != undefined)
                reports = oclientProxy.reports;
            if (this.otreemapObj._startDrilldown && this.ogridObj != null && this.ogridObj != undefined)
                this._renderPivotGrid(this.otreemapObj._selectedTagInfo);
            else if (oclientProxy.ogridObj != undefined && oclientProxy.ogridObj.element.find("table") == "block")
                oclientWaitingPopup.hide();
            if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                if (oclientProxy.model.displaySettings.enableFullScreen || oclientProxy.enableTogglePanel() && (oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap") {
                    $("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").css({ width: "100%" });
                    oclientProxy.otreemapObj._treeMap.refresh();
                }
            }
        },

        _gridDrillSuccess: function (sender) {
            if (oclientProxy.currentReport != undefined)
                currentReport = oclientProxy.currentReport;
            if (oclientProxy.reports != undefined)
                reports = oclientProxy.reports;
            if (this.ogridObj._startDrilldown && !ej.isNullOrUndefined(this.ochartObj)) {
                var masktag; var levelCaption; var levelTag;
                levelCaption = this.ogridObj._drillCaption;
                if (oclientProxy.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                    oclientProxy.chartObj = null;
                    oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                    if (ej.isNullOrUndefined(oclientProxy.chartObj) && oclientProxy.model.enablePivotTreeMap && !ej.isNullOrUndefined(oclientProxy.otreemapObj))
                        oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
                }
                if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                    if ((oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() != "treemap") {
                        jQuery.each(this.ochartObj._labelCurrentTags, function (index, value) {
                            if (value != undefined && value.name == levelCaption) {
                                levelTag = value.tag;
                                masktag = value;
                            }
                        });
                        oclientProxy.ochartObj._drillAction = this.ogridObj._drillAction;
                        oclientProxy.ochartObj._selectedItem = levelCaption;
                        if (this.ogridObj._drillAction == "drilldown" && !ej.isNullOrUndefined(masktag))
                            oclientProxy.ochartObj._tagCollection.push(masktag)
                        else if (!ej.isNullOrUndefined(masktag)) {
                            jQuery.each(this.element.find(".rowAxis").find("button"), function (index, value) {
                                if (value.innerHTML == masktag.tag.split("[")[1].split("]")[0])
                                    oclientProxy.ochartObj._dimensionIndex = index;
                            });
                            jQuery.each(oclientProxy.ochartObj._tagCollection, function (index, value) {
                                if (value != undefined && value.name == levelCaption) {
                                    oclientProxy.ochartObj._selectedIndex = index + oclientProxy.ochartObj._dimensionIndex;
                                    oclientProxy.ochartObj._tagCollection.splice(index, oclientProxy.ochartObj._tagCollection.length);
                                    return false;
                                }
                            });
                        }
                        if (levelTag != null && levelTag != undefined)
                            oclientProxy._renderPivotChart(levelTag, this.ogridObj._drillAction);
                        else
                            oclientWaitingPopup.hide();
                    }
                    else {
                        for (var i = 0 ; i < oclientProxy.otreemapObj.getJsonRecords().labelTags.length ; i++) {
                            if (oclientProxy.otreemapObj.getJsonRecords().labelTags[i].split("::")[2] == levelCaption) {
                                levelTag = oclientProxy.otreemapObj.getJsonRecords().labelTags[i];
                                break;
                            }
                        }
                        oclientProxy.otreemapObj_currentAction = this.ogridObj._drillAction;
                        oclientProxy.otreemapObj._selectedItem = levelCaption;
                        if (this.ogridObj._drillAction == "drilldown" && !ej.isNullOrUndefined(masktag))
                            oclientProxy.otreemapObj._tagCollection.push(masktag)
                        else if (!ej.isNullOrUndefined(masktag)) {
                            jQuery.each(this.element.find(".rowAxis").find("button"), function (index, value) {
                                if (value.innerHTML == masktag.tag.split("[")[1].split("]")[0])
                                    oclientProxy.otreemapObj._dimensionIndex = index;
                            });
                            jQuery.each(oclientProxy.otreemapObj._tagCollection, function (index, value) {
                                if (value != undefined && value.name == levelCaption) {
                                    oclientProxy.otreemapObj._selectedIndex = index + oclientProxy.otreemapObj._dimensionIndex;
                                    oclientProxy.otreemapObj._tagCollection.splice(index, oclientProxy.otreemapObj._tagCollection.length);
                                    return false;
                                }
                            });
                        }
                        if (levelTag != null && levelTag != undefined)
                            oclientProxy._renderPivotTreeMap(levelTag, this.ogridObj._drillAction);
                        else
                            oclientWaitingPopup.hide();
                    }
                }
            }
            else if ($("#" + oclientWaitingPopup._id + "_WaitingPopup")[0].style.display == "block")
                oclientWaitingPopup.hide();
        },

        _nodeDropped: function (sender) {
            if (sender.dropTarget.prevObject != undefined)
                sender.dropTarget.prevObject.removeClass("targetAxis");
            else
                $(sender.dropTarget).removeClass("targetAxis");
            isDragging = false;
            var droppedPosition = this._setSplitBtnTargetPos(sender.event);
            sender.dropTarget.prevObject != undefined ? sender.dropTarget.prevObject.parents().find(".e-dialog").hide() : $(sender.dropTarget).parents().find(".e-dialog").hide();
            var cssName = null;
            if ($(sender.dropTarget).hasClass("splitBtn"))
                cssName = $(sender.dropTarget).parents("div:eq(0)").attr("class");
            else if (sender.event.type == "touchend")
                cssName = sender.dropTarget.context.className;
            else if (sender.event.target != undefined) {
                if (sender.event.target.className == undefined || sender.event.target.className == null || $(sender.event.target).parents(".chartContainer").length > 0)
                    return false;
                if (sender.event.target.className.toLowerCase().indexOf("splitbtn") > -1 || $(sender.event.target).hasClass("e-button"))
                    cssName = $(sender.dropTarget).attr("class");
                else
                    cssName = sender.event.target.className;
            }
            else {
                if (sender.event.originalEvent.srcElement.className.toLowerCase().indexOf("splitbtn") > -1)
                    cssName = sender.dropTarget.context.className;
                else
                    cssName = sender.event.originalEvent.srcElement.className;
            }

            var axisName = (cssName.indexOf("categoricalAxis") > cssName.indexOf("rowAxis")) ? ((cssName.indexOf("categoricalAxis") > cssName.indexOf("slicerAxis")) ? "Categorical" : "Slicer") : ((cssName.indexOf("rowAxis") > cssName.indexOf("slicerAxis")) ? "Series" : (cssName.indexOf("slicerAxis") >= 0) ? "Slicer" : null);
            var tagVal = $(sender.droppedElement).attr("tag");
            if (axisName != null && tagVal != "Measures" && tagVal.lastIndexOf(".DF") != tagVal.length - ".DF".length) {
                if (!(axisName == "Slicer" && (tagVal.indexOf("Measures") >= 0 || $(sender.droppedElement[0].childNodes[0]).find(".namedSetCDB").length > 0))) {
                    oclientWaitingPopup.show();
                    if (this.model.beforeServiceInvoke != null)
                        this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
                    var serializedCustomObject = JSON.stringify(this.model.customObject);
                    var params = oclientProxy.currentCubeName + "--" + $(sender.droppedElement).attr("tag") + "--" + axisName + "--" + droppedPosition;
                    oclientProxy.doAjaxPost("POST", oclientProxy.model.url + "/" + oclientProxy.model.serviceMethodSettings.nodeDropped, JSON.stringify({ "action": "nodeDropped", "dropType": "TreeNode", "nodeInfo": params, "olapReport": oclientProxy.currentReport, "clientReports": oclientProxy.reports, "customObject": serializedCustomObject }), oclientProxy._nodeDroppedSuccess);
                }
            }
            oclientProxy._isRemoved = true;
            oclientProxy._isNodeOrButtonDropped = true;
        },

        _setSplitBtnTargetPos: function (event) {
            var targetPosition = ""; var AEBdiv; var targetSplitBtn; var className;
            if (event.event != undefined && event.event.type == "touchend") {
                targetSplitBtn = event.event.originalEvent.target != null ? $(event.event.originalEvent.target).parents(".splitBtn") : $(event.event.originalEvent.srcElement).parents(".splitBtn");
                className = event.event.originalEvent.target != null ? event.event.originalEvent.target.className : event.event.originalEvent.srcElement.className;
            }
            else {
                targetSplitBtn = event.originalEvent.target != null ? $(event.originalEvent.target).parents(".splitBtn") : $(event.originalEvent.srcElement).parents(".splitBtn");
                className = event.originalEvent.target != null ? event.originalEvent.target.className : event.originalEvent.srcElement.className;
            }
            if (targetSplitBtn[0] || (className != undefined && className != null && jQuery.type(className) == "string" && className.indexOf("splitBtn") > -1)) {
                targetSplitBtn = targetSplitBtn[0] ? targetSplitBtn[0] : event.originalEvent.target != null ? event.originalEvent.target : event.originalEvent.srcElement;
                if (event.event != undefined && event.event.type == "touchend")
                    AEBdiv = event.target;
                else if (this._dropAxisClassName != null && this._dropAxisClassName != undefined && this._dropAxisClassName != "")
                    AEBdiv = this.element.find("." + this._dropAxisClassName)[0];
                else
                    AEBdiv = targetSplitBtn.parentNode;
                if (AEBdiv != undefined) {
                    for (var i = 0; i < $(AEBdiv).find(".splitBtn").length; i++) {
                        if ($(AEBdiv).find(".splitBtn")[i] == targetSplitBtn)
                            targetPosition = i;
                    }
                }
                else {
                    oclientProxy._dropAxisClassName = "";
                }
            }
            return targetPosition;
        },

        _cubeChanged: function (sender) {
            if (oclientProxy.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                oclientProxy.chartObj = null;
                oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                if (ej.isNullOrUndefined(oclientProxy.chartObj) && oclientProxy.model.enablePivotTreeMap && !ej.isNullOrUndefined(oclientProxy.otreemapObj))
                    oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
            }
            if(this.currentCubeName == sender.text)
				return false
			else
				this.currentCubeName = sender.text;
            oclientWaitingPopup.show();
            if (this.model.beforeServiceInvoke != null)
                this._trigger("beforeServiceInvoke", { action: "cubeChanged", element: this.element, customObject: this.model.customObject });
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.cubeChanged, JSON.stringify({ "action": "cubeChanged", "cubeName": this.currentCubeName, "customObject": serializedCustomObject, "clientParams": JSON.stringify(this.model.enableMeasureGroups) }), this._cubeChangedSuccess);
        },

        _measureGroupChanged: function (sender) {
            oclientWaitingPopup.show();
            if (this.model.beforeServiceInvoke != null)
                this._trigger("beforeServiceInvoke", { action: "cubeChanged", element: this.element, customObject: this.model.customObject });
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.measureGroupChanged, JSON.stringify({ "action": "measureGroupChanged", "measureGroupName": sender.text, "customObject": serializedCustomObject }), this._measureGroupChangedSuccess);
        },

        _reportChanged: function (sender) {
            if (sender.selectedText != this._selectedReport) {
                oclientWaitingPopup.show();
                if (oclientProxy.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: "toolbarOperation", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(oclientProxy.model.customObject);
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.toolbarServices, JSON.stringify({ "action": "toolbarOperation", "toolbarOperation": "Report Change", "clientInfo": sender.text, "olapReport": null, "clientReports": this.reports, "customObject": serializedCustomObject }), this._toolbarOperationSuccess);
            }
            this._selectedReport = reportDropTarget.currentValue;
        },

        _onDropped: function (sender) {
            if (sender.target.className.indexOf("e-button") > -1) {
                var columnPosInfo = this._getAxisPosition(this.element.find(".categoricalAxis"));
                var rowPosInfo = this._getAxisPosition(this.element.find(".rowAxis"));
                var slicerPosInfo = this._getAxisPosition(this.element.find(".slicerAxis"));
                this._dropAxisClassName;
                if (sender.pageX != undefined && sender.pageY != undefined) {
                    if (sender.pageX > columnPosInfo.left && sender.pageX < columnPosInfo.right && sender.pageY > columnPosInfo.top && sender.pageY < columnPosInfo.bottom)
                        this._dropAxisClassName = "categoricalAxis";
                    else if (sender.pageX > rowPosInfo.left && sender.pageX < rowPosInfo.right && sender.pageY > rowPosInfo.top && sender.pageY < rowPosInfo.bottom)
                        this._dropAxisClassName = "rowAxis";
                    else if (sender.pageX > slicerPosInfo.left && sender.pageX < slicerPosInfo.right && sender.pageY > slicerPosInfo.top && sender.pageY < slicerPosInfo.bottom)
                        this._dropAxisClassName = "slicerAxis";
                    else
                        this._dropAxisClassName = "outOfAxis";
                }
            }
        },

        _getAxisPosition: function (targetElement) {
            var tempPos = targetElement.position();
            var item = {};
            item["top"] = tempPos.top;
            item["right"] = tempPos.left + $(targetElement).width();
            item["bottom"] = tempPos.top + $(targetElement).height();
            item["left"] = tempPos.left;
            return item;
        },

        _onTabClick: function (args) {
            if (oclientProxy.displayMode() != ej.olap.OlapClient.DisplayMode.GridOnly) {
                oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.ochartObj._id + "Container").data("ejChart");
                if (ej.isNullOrUndefined(oclientProxy.chartObj) && oclientProxy.model.enablePivotTreeMap && !ej.isNullOrUndefined(oclientProxy.otreemapObj))
                    oclientProxy.chartObj = oclientProxy.element.find("#" + oclientProxy.otreemapObj._id + "TreeMapContainer").data("ejTreeMap");
            }
            currentTab = "chart";
            if ($(args.activeHeader).find("a").text() == this._getLocalizedLabels("Grid")) {
                currentTab = "grid";
                oclientProxy.element.find(".chartTypesImg").addClass("chartTypesOnGridView");
                oclientProxy.element.find(".gridPanel").css("display", "inline");
            }
            else if (!ej.isNullOrUndefined(oclientProxy.chartObj)) {
                currentTab = "chart";
                oclientProxy.element.find(".chartTypesImg").removeClass("chartTypesOnGridView");
                if (!ej.isNullOrUndefined(oclientProxy.chartObj))
                (oclientProxy.chartObj.sfType.split(".")).pop().toLowerCase() == "treemap" ? oclientProxy.otreemapObj._treeMap.refresh() : oclientProxy.chartObj.redraw();
            }
        },

        doAjaxPost: function (type, url, data, onSuccess, onComplete) {
            $.ajax({
                type: type,
                url: url,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: data,
                success: $.proxy(onSuccess, this),
                complete: ej.proxy(function () {
                    var eventArgs = { "customObject": this.model.customObject, "element": this.element };
                    this._trigger("renderComplete", eventArgs);
                }, this),
                error: ej.proxy(function (msg, textStatus, errorThrown) {
                    oclientWaitingPopup = $("#" + this._id).data("ejWaitingPopup");
                    oclientWaitingPopup.hide();
                    var eventArgs = { "customObject": this.model.customObject, "element": this.element, "Message": msg };
                    this._trigger("renderFailure", eventArgs);
                    this._renderControlSuccess("");
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

    ej.olap.OlapClient.Locale = {};

    ej.olap.OlapClient.Locale["en-US"] = {
        DeferUpdate: "Defer Update",
        MDXQuery: "MDX Query",
        Column: "Column",
        Row: "Row",
        Slicer: "Slicer",
        CubeSelector: "Cube Selector",
        ReportName: "Report Name",
        NewReport: "New Report",
        CubeDimensionBrowser: "Cube Dimension Browser",
        AddReport: "Add Report",
        RemoveReport: "Remove Report",
        CannotRemoveSingleReport: "Can not remove single report",
        AreYouSureToDeleteTheReport: "Are you sure to delete the Report",
        RenameReport: "Rename Report",
        SaveReport: "Save Report",
        ChartTypes: "Chart Types",
	    ToggleAxis: "Toggle Axis",
        LoadReport: "Load Report",
        ExportToExcel: "Export To Excel",
        ExportToWord: "Export To Word",
        ExportToPdf: "Export To Pdf",
        FullScreen: "Full Screen",
        Grid: "Grid",
        Chart: "Chart",
        OK: "<u>O</u>K",
        Cancel: "<u>C</u>ancel",
        Close: "Close",
        AddToColumn: "Add to Column",
        AddToRow: "Add to Row",
        AddToSlicer: "Add to Slicer",
        MeasureEditor: "Measure Editor",
        MemberEditor: "Member Editor",
        Measures: "Measures",
        SortOrFilterColumn: "Sort/Filter (Column)",
        SortOrFilterRow: "Sort/Filter (Row)",
        SortingAndFiltering: "Sorting And Filtering",
        Sorting: "Sorting",
        Measure: "<u>M</u>easure",
        Order: "Order",
        Filtering: "Filtering",
        Condition: "C<u>o</u>ndition",
        Value: "Val<u>u</u>e",
        PreserveHierarchy: "P<u>r</u>eserve  Hierarchy",
        Ascending: "<u>A</u>scending",
        Descending: "D<u>e</u>scending",
        Enable: "E<u>n</u>able",
        Disable: "D<u>i</u>sable",
        and: "<u>a</u>nd",
        EqualTo: "EqualTo",
        NotEquals: "NotEquals",
        GreaterThan: "GreaterThan",
        GreaterThanOrEqualTo: "GreaterThanOrEqualTo",
        LessThan: "LessThan",
        LessThanOrEqualTo: "LessThanOrEqualTo",
        Between: "Between",
        NotBetween: "NotBetween",
        ReportList:"Report List",
        Line: "Line",
        Spline: "Spline",
        Column: "Column",
        Area: "Area",
        SplineArea: "Spline Area",
        StepLine: "Step Line",
        StepArea: "Step Area",
        Pie: "Pie",
        Bar: "Bar",
        StackingArea: "Stacking Area",
        StackingColumn: "Stacking Column",
        StackingBar: "Stacking Bar",
        Pyramid: "Pyramid",
        Funnel: "Funnel",
        Doughnut: "Doughnut",
        Scatter: "Scatter",
        Bubble: "Bubble",
        TreeMap: "TreeMap",
        Alert: "Alert",
        MDXAlertMsg: "Please add a measure, dimension or hierarchy in an appropriate axis to view the MDX Query.",
        FilterSortRowAlertMsg: "Dimension not found in row axis. Please add Dimension element in row axis for sorting/filtering.",
        FilterSortColumnAlertMsg: "Dimension not found in column axis. Please add Dimension element in column axis for sorting/filtering.",
        FilterSortcolMeasureAlertMsg: "Please add measure to the Column axis",
        FilterSortrowMeasureAlertMsg: "Please add measure to the Row axis",
        FilterSortElementAlertMsg: "Element not found in column axis. Please add an element in column axis for sorting/filtering.",
        LoadReportAlertMsg: "Please select a valid report",
        FilterMeasureSelectionAlertMsg: "Please select a valid measure.",
        FilterConditionAlertMsg: "Please set a valid condition.",
        FilterStartValueAlertMsg: "Please set a start value.",
        FilterEndValueAlertMsg: "Please set a end value.",
        FilterInvalidAlertMsg: "Invalid operation !"
    };

    ej.olap.OlapClient.ControlPlacement = {
        Tab: "tab",
        Tile: "tile"
    };

    ej.olap.OlapClient.DisplayMode = {
        ChartOnly: "chartonly",
        GridOnly: "gridonly",
        ChartAndGrid: "chartandgrid"
    };

    ej.olap.OlapClient.ClientExportMode = {
        ChartAndGrid: "chartandgrid",
        ChartOnly: "chartonly",
        GridOnly: "gridonly"
    };

    ej.olap.OlapClient.DefaultView = {
        Chart: "chart",
        Grid: "grid"
    };

})(jQuery, Syncfusion);;

});