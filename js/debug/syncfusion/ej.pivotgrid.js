/*!
*  filename: ej.pivotgrid.js
*  version : 14.4.0.20
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.core","./../common/ej.data","./../common/ej.touch","./ej.button","./ej.waitingpopup","./ej.pivotpager","./ej.pivotanalysis.base","./ej.treeview","./ej.olap.base","./ej.pivot.common"], fn) : fn();
})
(function () {
	
/**
* @fileOverview PivotGrid control to visualize the data
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {

    ej.olap = ej.olap || {};

    ej.widget("ejPivotGrid", "ej.PivotGrid", {

        _rootCSS: "e-pivotgrid",
        element: null,
        model: null,
        _requiresID: true,
        validTags: ["div", "span"],
        defaults: {
            url: "",
            cssClass: "",
            jsonRecords: "",
            currentReport: "",
            layout: "normal",
            analysisMode: "olap",
            operationalMode: "clientmode",
            filterType:"filterType",
            enablePivotFieldList: true,
            enableGroupingBar: false,
            enableDeferUpdate: false,
            enableJSONRendering: false,
            enableVirtualScrolling: false,
            enablePaging: false,
            enableColumnResizing:false,
            enableCellContext: false,
            enableRTL: false,
            enableToolTip: true,
            enableToolTipAnimation: true,
            enableCellSelection: false,
            enableConditionalFormatting: false,
			enableCellEditing : false,
            enableColumnGrandTotal: true,
            enableRowGrandTotal: true,
            enableGrandTotal: true,
            enableCollapseByDefault: false,
            enableCellDoubleClick: false,
			enableDrillThrough: false,
			isResponsive: false,
            enableAdvancedFilter:false,
			editCellsInfo: {},
            hyperlinkSettings: {
                enableValueCellHyperlink: false,
                enableRowHeaderHyperlink: false,
                enableColumnHeaderHyperlink: false,
                enableSummaryCellHyperlink: false
            },
            frozenHeaderSettings: {
                enableFrozenRowHeaders: false,
                enableFrozenColumnHeaders: false,
                enableFrozenHeaders: false
            },
            serviceMethodSettings: {
                initialize: "InitializeGrid",
                drillDown: "DrillGrid",
                exportPivotGrid: "Export",
                paging: "Paging",
                fetchMembers: "FetchMembers",
                nodeStateModified: "NodeStateModified",
                nodeDropped: "NodeDropped",
                filtering: "Filtering",
                sorting: "Sorting",
                deferUpdate: "DeferUpdate",
                memberExpand: "MemberExpanded",
                writeBack: "WriteBack",
                cellEditing : "CellEditing",
                saveReport: "SaveReport",
                loadReport: "LoadReportFromDB",
                calculatedField: "CalculatedField",
                drillThroughHierarchies: "DrillThroughHierarchies",
                drillThroughDataTable: "DrillThroughDataTable",
                removeButton:"RemoveButton"
            },
            customObject: {},
            locale: "en-US",
            dataSource: {
                data: null,
                enableAdvancedFilter: false,
                isFormattedValues: false,
                reportName: "Default",
                columns: [],
                cube: "",
                catalog:"",
                rows: [],
                values: [],
                filters: [],
                pagerOptions: {
                    categoricalPageSize: 0,
                    seriesPageSize: 0,
                    categoricalCurrentPage: 0,
                    seriesCurrentPage: 0
                }
            },
            pivotTableFieldListID:"",
            collapsedMembers: null,
            cellSelection: null,
            valueCellHyperlinkClick: null,
            rowHeaderHyperlinkClick: null,
            columnHeaderHyperlinkClick: null,
            summaryCellHyperlinkClick: null,
            beforeServiceInvoke: null,
            afterServiceInvoke: null,
            drillThrough: null,
            drillSuccess: null,
            cellContext: null,
            load: null,
            renderComplete: null,
            renderFailure: null,
            renderSuccess: null,
            cellDoubleClick: null,
            applyFieldCaption: null,
            beforeExport:null,
			beforePivotEnginePopulate: null,
            saveReport: null,
            loadReport: null,
            cellEdit: null
        },

        dataTypes: {
            serviceMethodSettings: "data",
            customObject: "data"
        },

        observables: ["layout", "enableCellContext", "hyperlinkSettings.enableValueCellHyperlink", "hyperlinkSettings.enableRowHeaderHyperlink", "hyperlinkSettings.enableColumnHeaderHyperlink", "hyperlinkSettings.enableSummaryCellHyperlink"],
        layout: ej.util.valueFunction("layout"),
        enableCellContext: ej.util.valueFunction("enableCellContext"),
        enableValueCellHyperlink: ej.util.valueFunction("hyperlinkSettings.enableValueCellHyperlink"),
        enableRowHeaderHyperlink: ej.util.valueFunction("hyperlinkSettings.enableRowHeaderHyperlink"),
        enableColumnHeaderHyperlink: ej.util.valueFunction("hyperlinkSettings.enableColumnHeaderHyperlink"),
        enableSummaryCellHyperlink: ej.util.valueFunction("hyperlinkSettings.enableSummaryCellHyperlink"),
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
            if ($(this.element).next().length > 0 && $(this.element).next()[0].className == "pGridTooltip")
                $(this.element).next().remove();
            this.element.empty().removeClass("e-pivotgrid" + this.model.cssClass);
            if (this._waitingPopup != undefined)
                this._waitingPopup._destroy();
        },

        _initPrivateProperties: function () {
            this._id = this.element.attr("id");
            this._olapReport = "";
            this._JSONRecords = null;
            this._excelLikeJSONRecords = null;
            this._drillCaption = "";
            this._drillAction = "";
            this._startDrilldown = false;
            this._pagerObj = null;
            this._seriesPageCount = null;
            this._categPageCount = null;
            this._seriesCurrentPage = 1;
            this._categCurrentPage = 1;
            this._drillHeaders = new Array();
            this._collapsedRowHeaders = new Array();
            this._isDragging = false;
            this._droppedClass = "";
            this._dataModel = "";
            this._ascdes = "";
            this._filterUpdate = new Array();
            this._pivotRow = new Array();
            this._pivotColumn = new Array();
            this._pivotCalculation = new Array();
            this._pivotFilter = new Array();
            this._pivotTableFields = new Array();
            this._schemaData = null;
            this._waitingPopup = null;
            this._oriX = null;
            this._oriY = null;
            this._startPosCell = null;
            this._maxViewLoading = null;
            this._list = new Array();
            this._list.push(this._getLocalizedLabels("AddNew"));
            this._rowCount = 0;
            this._excelRowCount = 0;
            this._dialogTitle = "";
            this._selectedField = "";
            this._selectedAxis = "";
            this._isUpdateRequired = false;
            this._isMembersFiltered = false;
            this._selectedCell = null;
            this._onholdKey = "";
            this._primaryCellPos = "";
            this._currentReportItems = [];
			this._rowHeader = [];
			this._colHeader = [];
			this._cellInfo = [];
            this._editorFlag = true;
            this._isSubTotalHide = false;
            this._isSubTotalhidden = false;
			this._dimension;
			this._calculatedField = [];
			this._isFormatApply = false;
			this._cFormat = [];
			this._curFocus = { cell: null, tab: null, tree: null, cformat: null, grp: null, selection: null, filter: null, field: null, formula: null };
			this._index = { index: 0, grp: 1, cell: 1, dialog: 1, paging: 1, cformat: 1, filter: 0, field: 0, formula: 0 };
			var i, j, k, l;
			this._dataSet = [];
			this._currentCell = -1;
			this._target = null;
		    this._orgX = null;
			this._orgY = null;
			this._expand = false;
			this._excelFilterInfo = [];
			this._pagingSavedObjects = {
			    drillEngine: [],
			    savedHdrEngine: [],
			    curDrilledItem: {}
			};
			this._isSchemaInitialize = true;
			this._fieldMembers = {};
			this._fieldSelectedMembers = {};
			this._allMember = "";
        },

        _load: function () {
            var eventArgs = { element: this.element, customObject: this.model.customObject };
            if (this.model.enableAdvancedFilter)
                this.model.dataSource.enableAdvancedFilter = this.model.enableAdvancedFilter;
            this._trigger("load", eventArgs);
            this.element.addClass(this.model.cssClass);
            if ($(this.element).parents(".e-pivotclient").length > 0) {
                var pivotClientObj = $(this.element).parents(".e-pivotclient").data("ejPivotClient");
                if ($("#" + pivotClientObj._id + "_maxView")[0])
                    $("#" + pivotClientObj._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                if (ej.isNullOrUndefined(this._waitingPopup) && !ej.isNullOrUndefined(pivotClientObj._waitingPopup))
                    this._waitingPopup = pivotClientObj._waitingPopup;
                this._waitingPopup.show();
            }
            else {
                if (ej.isNullOrUndefined(this._waitingPopup)) {
                    $("#" + this._id).ejWaitingPopup({ showOnInit: true });
                    this._waitingPopup = $("#" + this._id).data("ejWaitingPopup");
                }
            }
            this._waitingPopup.show();
            if (this.model.enableJSONRendering) {
                this.setJSONRecords(this.model.jsonRecords)
                if (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout)
                    this.excelLikeLayout(this.getJSONRecords());
                else
                    this.renderControlFromJSON();
            }
            else if (ej.isNullOrUndefined(this.model.dataSource.data) && this.model.url == "" && typeof (oclientProxy) == "undefined") {
                this.renderControlFromJSON();
                this._waitingPopup.hide();
            }
            else {
                if ((this.model.dataSource.data == null && this.model.url != "") || (this.model.dataSource.data != null && this.model.url != "" && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)) {
                    this.model.operationalMode = ej.Pivot.OperationalMode.ServerMode;
                    if (!ej.isNullOrUndefined(this.model.beforeServiceInvoke))
                        this._trigger("beforeServiceInvoke", { action: "initialize", element: this.element, customObject: this.model.customObject });
                    var serializedCustomObject = JSON.stringify(this.model.customObject);
                    if (this.model.enableVirtualScrolling) this.model.layout = ej.PivotGrid.Layout.NoSummaries;
                    if (this.element[0] != null && this.element.parents().find(".controlPanel").length > 0 && this.layout() != "" && this.layout() != ej.PivotGrid.Layout.Normal)
                        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": "initializeGrid", "currentReport": this.model.currentReport, "gridLayout": this.layout(), "customObject": serializedCustomObject }), this._renderControlSuccess);
                    else if (this.element[0] != null && this.element.parents().find(".controlPanel").length > 0)
                        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": this.model.enableCellDoubleClick ? "initializeGrid:getDataSet" : "initializeGrid", "currentReport": this.model.currentReport, "customObject": serializedCustomObject }), this._renderControlSuccess);
                    else
                        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": this.model.enableCellDoubleClick ? "initializeGrid:getDataSet" : "initializeGrid", "gridLayout": this.layout(), "enablePivotFieldList": this.model.enablePivotFieldList, "customObject": serializedCustomObject }), this._renderControlSuccess);
                }
                else {
                    this.model.operationalMode = ej.Pivot.OperationalMode.ClientMode;
                    if (this.model.dataSource.cube != "") {
                        this.model.analysisMode = ej.Pivot.AnalysisMode.Olap;
                        this._trigger("beforePivotEnginePopulate", { pivotGridObj: this });
                        ej.olap.base.getJSONData({ action: "initialLoad" }, this.model.dataSource, this);
                    }
                    else if (this.model.dataSource.data != null) {
                        this.model.analysisMode = ej.Pivot.AnalysisMode.Pivot;
                        ej.PivotAnalysis.setFieldCaptions(this.model.dataSource);
                        this._populatePivotGrid();
                    }
                }
            }
        },

        refreshControl: function () {
            ej.Pivot.openPreventPanel(this);
            this._trigger("beforePivotEnginePopulate", { pivotObject: this });
            if (this.model.enableGroupingBar)
                this._createGroupingBar(this.model.dataSource);
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var pivotEngine = ej.PivotAnalysis.pivotEnginePopulate(this.model);
                this.setJSONRecords(JSON.stringify(pivotEngine.json));
                if (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout)
                    this.excelLikeLayout(pivotEngine.json);
                else
                    this.renderControlFromJSON(pivotEngine.json);
                this._trigger("renderSuccess", this);
            }
            else
                ej.olap.base.getJSONData({ action: "initialLoad" }, this.model.dataSource, this);
        },

        _setCaptions: function () {
            $.each(this.model.dataSource.rows, function (index, value) { if (ej.isNullOrUndefined(value.fieldCaption)) value.fieldCaption = value.fieldName; });
            $.each(this.model.dataSource.columns, function (index, value) { if (ej.isNullOrUndefined(value.fieldCaption)) value.fieldCaption = value.fieldName; });
            $.each(this.model.dataSource.filters, function (index, value) { if (ej.isNullOrUndefined(value.fieldCaption)) value.fieldCaption = value.fieldName; });
            $.each(this.model.dataSource.values, function (index, value) { if (ej.isNullOrUndefined(value.fieldCaption)) value.fieldCaption = value.fieldName; });
        },

        refreshFieldCaption: function (name, caption, className) {
            if (className.indexOf("row") >= 0) {
                for (var i = 0; i < this.model.dataSource.rows.length; i++) {
                    if (name == this.model.dataSource.rows[i].fieldName)
                        this.model.dataSource.rows[i].fieldCaption = caption;
                }
            }
            else if (className.indexOf("calc") >= 0) {
                for (var i = 0; i < this.model.dataSource.values.length; i++) {
                    if (name == this.model.dataSource.values[i].fieldName)
                        this.model.dataSource.values[i].fieldCaption = caption;
                }
            }
            else if (className.indexOf("col") >= 0) {
                for (var i = 0; i < this.model.dataSource.columns.length; i++) {
                    if (name == this.model.dataSource.columns[i].fieldName)
                        this.model.dataSource.columns[i].fieldCaption = caption;
                }
            }
            else {
                for (var i = 0; i < this.model.dataSource.filters.length; i++) {
                    if (name == this.model.dataSource.filters[i].fieldName)
                        this.model.dataSource.filters[i].fieldCaption = caption;
                }
            }
            for (var i = 0; i < this._pivotTableFields.length; i++) {
                if (name == this._pivotTableFields[i].name)
                    this._pivotTableFields[i]["caption"] = caption;
            }
        },

        refreshPivotGrid: function () {
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    if (this.getOlapReport()) {
                        if (this.model.dataSource.rows)
                            this.model.dataSource.rows = this.getOlapReport().rows;
                        if (this.model.dataSource.columns)
                            this.model.dataSource.columns = this.getOlapReport().columns;
                        if (this.model.dataSource.filters)
                            this.model.dataSource.filters = this.getOlapReport().filters;
                        if (this.model.dataSource.values)
                            this.model.dataSource.values = this.getOlapReport().values;
                    }
                    this.model.editCellsInfo = {};
                    this._populatePivotGrid();
                }
                else {
                    this._trigger("beforePivotEnginePopulate", { olapObject: this });
                    ej.olap.base.getJSONData({ action: "initialLoad" }, this.model.dataSource, this);
                }
            }
            else
                this._load();
        },

		_populatePivotGrid: function () {         
		    this._trigger("beforePivotEnginePopulate", { pivotObject: this });
		    var calculatedField = $.grep(this.model.dataSource.values, function (value) { return value.isCalculatedField == true; });
		    this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) { return ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false; });
		    for (var i = 0; i < calculatedField.length; i++) {
		        var formula = calculatedField[i].formula;
		        if ($.grep(this._calculatedField, function (value) { return value.name == calculatedField[i].fieldName; }).length == 0) {
		            formula = formula.replace(/\s+|\s+$/gm, '');
		            formula = this._parenthesisAsterisk(formula);
		            formula = formula.replace(/[-+/^%*]/g, function (text) { return " " + text + " "; });
		            this._calculatedField.push({ name: calculatedField[i].fieldName, formula: formula });
		        }
		        calculatedField[i].formula = formula;
		        this.model.dataSource.values.push(calculatedField[i]);
		    }
		    var pivotEngine = ej.PivotAnalysis.pivotEnginePopulate(this.model);
		    this.setJSONRecords(JSON.stringify(pivotEngine.json));
		    this.setOlapReport(this.model.dataSource);
            this._createGroupingBar(this.model.dataSource);
		    if (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout)
		        this.excelLikeLayout(pivotEngine.json);
		    else
		    this.renderControlFromJSON();
		    this._waitingPopup.hide();
		    this._trigger("renderSuccess", this);
		    if (this._schemaData != null) {
		        pschemaDesignerWaitingPopup.hide();
		        if (this._calculatedField.length > 0)
		            this._schemaCalculatedField();
		    }
		},

        _setFirst: true,

        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
                    case "OlapReport": this.setOlapReport(options[key]); break;
                    case "JsonData": this.setOlapReport(options[key]); break;
                    case "RefreshOlapGrid": this.element.renderControlFromJSON(options[key]); break;
                    case "layout": this._load(); break;
                    case "customObject": this.model.customObject = options[key]; break;
                    case "enableCellContext": this._load(); break;
                    case "enableValueCellHyperlink": this._load(); break;
                    case "enableRowHeaderHyperlink": this._load(); break;
                    case "enableColumnHeaderHyperlink": this._load(); break;
                    case "enableSummaryCellHyperlink": this._load(); break;
                    case "locale": this._load(); break;
                }
            }
        },

        _wireEvents: function () {
            this._on(this.element, "mouseover", ".value,.rowheader,.colheader,.summary", ej.proxy(function (evt) {
                if (!$(evt.target).hasClass("cellValue") && !$(evt.target).children().hasClass("cellValue")) {
                    var val = $(evt.target).contents().filter(function () { return this.nodeType == 3; });
                    if (val.text() != 0) {
                        $(evt.target).contents().filter(function () { return this.nodeType == 3; }).remove();
                        $(evt.target).append("<span class='cellValue'>" + val.text() + "</span>");
                    }
                }
            }));
            this._on($(document), 'keydown', this._keyDownPress);
            this._on($(document), 'keyup', this._keyUpPress);
			if (this.model.enableCellSelection) {
                this._on(this.element, "mousedown touchstart", ".value", this._initCellSelection);
                this._on(this.element, "click", ".colheader,.rowheader", this._headerClickCellSelection);
            }
            if (this.enableCellContext() == true) {
                if (document.addEventListener) {
                    document.removeEventListener('contextmenu', this._cellContext, false);
                    document.addEventListener('contextmenu', this._cellContext, false);
                }
                else {
                    document.detachEvent('oncontextmenu', this._cellContext);
                    document.attachEvent('oncontextmenu', this._cellContext);
                }
            }

            this._on(this.element, "mouseover", ".pivotButton", ej.proxy(function (evt) {
                if (this._isDragging) {
                    this.element.append(ej.buildTag("span.dropIndicator dropIndicatorActive")[0].outerHTML);
                    if (evt.target.className.indexOf("pivotButton") >= 0)
                        this.element.find(".dropIndicator").css("top", $(evt.target).position().top - 20).css("left", $(evt.target).position().left - 3);
                    else
                        this.element.find(".dropIndicator").css("top", $(evt.target).parents(".pivotButton").position().top - 20).css("left", $(evt.target).parents(".pivotButton").position().left - 3);
                }
            }, this));

            this._on(this.element, "mouseleave", ".pivotButton", ej.proxy(function (evt) {
                if (this._isDragging)
                    this.element.find(".dropIndicator").removeClass("dropIndicatorActive");
            }, this));
            if (this.model.enableCellEditing) {
                this._on(this.element, "mousedown", ".value", this._initCellEditing)
            }
            this.drillDownHandler = $.proxy(this._drillDown, this);
            this.addHyperlinkHandler = $.proxy(this._addHyperlink, this);
            this.removeHyperlinkHandler = $.proxy(this._removeHyperlink, this);
            if (this.model.enableCellSelection) {
                $(document).on("click", this._clearSelection);
                $(document).on("keyup", this._endCellSelection);
                $(document).on("keydown", this._startCellSelection);
            }
            this._on(this.element, "mouseover", this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ".value .cellValue, .rowheader .cellValue, .colheader .cellValue" : ".value .cellValue, .rowheader .cellValue, .colheader .cellValue, .summary .cellValue", this.addHyperlinkHandler);
            this._on(this.element, "mouseleave", this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ".value, .rowheader, .colheader" : ".value .cellValue, .rowheader .cellValue, .colheader .cellValue, .summary .cellValue", this.removeHyperlinkHandler);
            this._on(this.element, "click", this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ".value .cellValue, .rowheader .cellValue, .colheader .cellValue" : ".value .cellValue, .rowheader .cellValue, .colheader .cellValue, .summary .cellValue", function (e) {
                if (e.target.className.indexOf("hyperlink") != -1) {
                    var cellPos = this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? $(e.target.parentElement).attr("i") : $(e.target.parentElement).attr("p");
                    var rawdata = this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? this._excelLikeJSONRecords[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))].Info : this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._excelRowCount) + parseInt(cellPos.split(",")[1]))].Info;
                    var cellInfo = {
                        cellValue: e.target.innerHTML,
                        cellPosition: cellPos,
                        cellType: e.target.parentElement.className.split(' ')[0],
                        uniqueName: rawdata.split('::')[0],
                        args: e,
                        rawdata: rawdata
                    };
                    if ((this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && e.target.parentElement.className.indexOf("summary") >= 0) || e.target.parentElement.className.indexOf("summary value") >= 0)
                        this._trigger("summaryCellHyperlinkClick", { element: this.element, customObject: this.model.customObject, args: cellInfo });
                    else if (e.target.parentElement.className.indexOf("value") >= 0)
                        this._trigger("valueCellHyperlinkClick", { element: this.element, customObject: this.model.customObject, args: cellInfo });
                    else if (e.target.parentElement.className.indexOf("rowheader") >= 0)
                        this._trigger("rowHeaderHyperlinkClick", { element: this.element, customObject: this.model.customObject, args: cellInfo });
                    else if (e.target.parentElement.className.indexOf("colheader") >= 0)
                        this._trigger("columnHeaderHyperlinkClick", { element: this.element, customObject: this.model.customObject, args: cellInfo });
                     if (e.target.parentElement.className.indexOf("value") >= 0 && this.model.enableDrillThrough){
						 this._rowHeader = []; this._colHeader = [];
                        ej.Pivot._drillThroughCellClick(e, this);
                     }
                }
                if (this.model.enableCellSelection) {
                    if (!($(e.target).hasClass("cellValue") && $(e.target).hasClass("hyperlinkHeaderCell"))) {
                        var targetCell = $(e.target).hasClass("cellValue") ? e.target.parentElement : e.target;
                        if (e.shiftKey) {
                            window.getSelection().removeAllRanges();
                            $(this.element).find(".selected").removeClass("selected");
                            var selectedCellPos = $(this._selectedCell).attr('p'), targetCellPos = $(targetCell).attr('p');
                            if (($(targetCell).hasClass("rowheader") || $(targetCell).attr('role') == "rowheader") && ($(this._selectedCell).hasClass("rowheader") || $(this._selectedCell).attr('role') == "rowheader")) //|| 
                                for (var i = Math.min(selectedCellPos.split(',')[1], targetCellPos.split(',')[1]) ; i <= Math.max(selectedCellPos.split(',')[1], targetCellPos.split(',')[1]) ; i++)
                                    this.element.find("[p='" + selectedCellPos.split(',')[0] + "," + i + "']").addClass("selected");
                            if (($(targetCell).hasClass("colheader") || $(targetCell).attr('role') == "columnheader") && ($(this._selectedCell).hasClass("colheader") || $(this._selectedCell).attr('role') == "columnheader"))
                                for (var i = Math.min(selectedCellPos.split(',')[0], targetCellPos.split(',')[0]) ; i <= Math.max(selectedCellPos.split(',')[0], targetCellPos.split(',')[0]) ; i++)
                                    this.element.find("[p='" + i + "," + selectedCellPos.split(',')[1] + "']").addClass("selected");
                            var selectedCells = $(this.element).find(".selected");
                            if (selectedCells.length > 0) {
                                var selectedCellsInfo = new Array();
                                for (var i = 0; i < selectedCells.length; i++) {
                                    var cellPos = $(selectedCells[i]).attr('p');
                                    var cellInfo = this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))];
                                    cellInfo.Value = $(selectedCells[i]).text().trim();
                                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) cellInfo["Field"] = this._getFieldName(selectedCells[i]);
                                    selectedCellsInfo.push(cellInfo);
                                }
                                this._trigger("cellSelection", { JSONRecords: selectedCellsInfo });
                            }
                        }
                        else {
                            if (!e.ctrlKey) $(this.element).find(".selected").removeClass("selected");
                            if ($(targetCell).hasClass("colheader") || $(targetCell).hasClass("rowheader") || $(targetCell).attr("role") == "rowheader" || $(targetCell).attr("role") == "columnheader") {
                                e.ctrlKey ? $(targetCell).toggleClass("selected") : $(targetCell).addClass("selected");
                                this._selectedCell = targetCell;
                                this._primaryCellPos = $(targetCell).attr('p');
                                var cellInfo = this.getJSONRecords()[parseInt((parseInt(this._primaryCellPos.split(",")[0]) * this._rowCount) + parseInt(this._primaryCellPos.split(",")[1]))];
                                cellInfo.Value = $(targetCell).text().trim();
                                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) cellInfo["Field"] = this._getFieldName(targetCell);
                                if (!e.ctrlKey) this._trigger("cellSelection", { JSONRecords: [cellInfo] });
                            }
                        }
                    }
                }
            });
            if (typeof (oclientProxy) != "undefined") {
                if (!oclientProxy.model.enableDeferUpdate)
                    this._on(this.element, "click", ".expand, .collapse", ej.proxy(this._drillDown, this));
            }
            else
                this._on(this.element, "click", ".expand, .collapse", ej.proxy(this._drillDown, this));
            this._on(this.element, "mouseover", ".colheader, .rowheader, .expand, .collapse", function (evt) {
                if (evt.target.className.indexOf("expand") > -1 && !$(evt.target).hasClass("header-hover-expand"))
                    $(evt.target).addClass("header-hover-expand");
                else if (evt.target.className.indexOf("collapse") > -1 && !$(evt.target).hasClass("header-hover-collapse"))
                    $(evt.target).addClass("header-hover-collapse");
                else if ((evt.target.className.indexOf("expand") < 0 || evt.target.className.indexOf("collapse") < 0) && $(evt.target).children("span").length > 0) {
                    var child = $(evt.target).children("span")[0];
                    if (!$(child).hasClass("header-hover-expand") && child.className.indexOf("expand") > -1)
                        $(child).addClass("header-hover-expand");
                    else if (!$(child).hasClass("header-hover-collapse") && child.className.indexOf("collapse") > -1)
                        $(child).addClass("header-hover-collapse");
                }
            });
            this._on(this.element, "mouseleave", ".colheader, .rowheader, .expand, .collapse", function (evt) {
                this.element.find(".expand, .collapse").removeClass("header-hover-expand header-hover-collapse");
            });
            if (this.model.enableToolTip) {
                this._on(this.element, "mouseover", ".value", this._applyToolTip);
                this._on(this.element, "mouseleave", ".value", function (e) {
                    if(this.model.enableToolTipAnimation)
                        $("#" + this._id + "_gridTooltip").hide("slow");
                    else
                        $("#" + this._id + "_gridTooltip").hide();
                });
            }
			if (this.model.enableDrillThrough) {
                $.proxy(this._addHyperlink, this);
            }
            this._on(this.element, "click", ".filter", ej.proxy(this._filterBtnClick, this));
            this._on(this.element, "click", ".sorting", ej.proxy(this._sortBtnClick, this));
            this._on(this.element, "click", ".removeBtn", ej.proxy(this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._removePvtBtn : this._clientRemovePvtBtn, this));
            this._on(this.element, "click", ".ascOrder, .descOrder", ej.proxy(this._sortField, this));
            this._on(this.element, "mouseover", ".pvtBtn", function (evt) {
                $(evt.target.parentElement).addClass("e-btn e-select");
            });
            this._on(this.element, "mouseleave", ".pvtBtn", function (evt) {
                $(evt.target.parentElement).removeClass("e-btn e-select");
                $(evt.target).removeClass("hoverBtn");
            });
            this._on(this.element, "mouseover", ".pivotButton", function (evt) {
                evt.target.title = evt.target.textContent;
                $(evt.target).find("button").addClass("hoverBtn");
            });
            this._on(this.element, "mouseleave", ".pivotButton", function (evt) {
                $(evt.target).find("button").removeClass("hoverBtn");
            });
            this._on(this.element, "mouseover", ".filter,.sorting,.removeBtn", function (evt) {
                $(evt.target.parentElement).find("button").addClass("hoverBtn");
            });
            this._on(this.element, "mouseleave", ".filter,.sorting,.removeBtn", function (evt) {
                $(evt.target.parentElement).find("button").removeClass("hoverBtn");
            });
            this._on(this.element, "mouseleave", ".value,.rowheader,.colheader,.summary", ej.proxy(function (evt) {
                var val = $(evt.target).find(".cellValue").contents().filter(function () { return this.nodeType == 3; });
                if (val.text() != 0) {
                    $(evt.target).find(".cellValue").remove();
                    $(evt.target).append(val.text());
                }
            }));
            if (this.model.enableColumnResizing) {
                this._on(this.element, "mousemove", ej.proxy(function (evt) {
                    this._colResizing(evt);
                }));
                this._on(this.element, "mousedown", "thead,.pivotGridFrozenTable,.pivotGridColValueTable", ej.proxy(function (evt) {
                    this._startColResizing(evt);
                }));
                this._on(this.element, "mouseup", ".e-reSizeColbg",ej.proxy(function (evt) {
                    this._endColResizing(evt);
                }));
                }
        },
        _keyUpPress:function(e){

            if (e.which === 16 && this.model.enableCellSelection) {
                this._completeCellSelection(e);
                this.element.find(".value").removeClass("hoverCell");
                this._startPosCell = null;
                _startPosCell = null;
            }  
        },
        _keyDownPress: function (e) {
            if ($(".e-pivotpager[targetcontrolid='" + this._id + "']:visible").length > 0) {
                if (document.activeElement.id == "Pager_CategCurrentPage" || document.activeElement.id == "Pager_SeriesCurrentPage") {
                    if (e.which === 35) {
                        e.preventDefault();
                        if (document.activeElement.id == "Pager_CategCurrentPage") {
                            $(".e-pivotpager[targetcontrolid='" + this._id + "'] .moveLast").first().trigger("click");
                        }
                        else if (document.activeElement.id == "Pager_SeriesCurrentPage") {
                            $(".e-pivotpager[targetcontrolid='" + this._id + "'] .moveLast").last().trigger("click");
                        }
                    }
                    else if (e.which == 36) {
                        e.preventDefault();
                        if (document.activeElement.id == "Pager_CategCurrentPage") {
                            $(".e-pivotpager[targetcontrolid='" + this._id + "'] .moveFirst").first().trigger("click");
                        }
                        else if (document.activeElement.id == "Pager_SeriesCurrentPage") {
                            $(".e-pivotpager[targetcontrolid='" + this._id + "'] .moveFirst").last().trigger("click");
                        }
                    }
                    if (e.which === 39) {
                        if (document.activeElement.id == "Pager_CategCurrentPage") {
                            $(".e-pivotpager[targetcontrolid='" + this._id + "'] .moveNext").first().trigger("click");
                        }
                        else if (document.activeElement.id == "Pager_SeriesCurrentPage") {
                            $(".e-pivotpager[targetcontrolid='" + this._id + "'] .moveNext").last().trigger("click");
                        }
                    }
                    else if (e.which === 37) {
                        if (document.activeElement.id == "Pager_CategCurrentPage") {
                            $(".e-pivotpager[targetcontrolid='" + this._id + "'] .movePrevious").first().trigger("click");
                        }
                        else if (document.activeElement.id == "Pager_SeriesCurrentPage") {
                            $(".e-pivotpager[targetcontrolid='" + this._id + "'] .movePrevious").last().trigger("click");
                        }
                    }
                }
                e.stopImmediatePropagation();
            }
            if (e.which === 27 && (!ej.isNullOrUndefined(this._curFocus.grp) || (!ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.hasClass("pivotButton")))) {
                var focEl;
                this._curFocus.tab.mouseleave().removeClass("hoverCell");
                if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                    var tag = this._curFocus.grp.attr("tag");
                    focEl = this._curFocus.grp = this.element.find("[tag='" + tag + "']");
                }
                else if (!ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.hasClass("pivotButton")) {
                    var tag = this._curFocus.tab.attr("tag");
                    focEl = this._curFocus.tab = this.element.find("[tag='" + tag + "']");
                }
                focEl.mouseover().addClass("hoverCell").focus();
                this._index.filter = 0;
                if (this.model.dataSource.enableAdvancedFilter) {
                    this._index.dialog = 0;
                }
                else {
                    this._index.dialog = 1;
                }
                this._index.field = 0;
            }
            else if (e.which === 27) {
                this._index.dialog = 0;
            }
            if (e.which === 70 && e.ctrlKey) {
                e.preventDefault();
                if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                    this._curFocus.grp.find(".filter").click();
                }
                else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.find(".filter").click();
                }
            }
            if (e.which === 83 && e.ctrlKey) {
                e.preventDefault();
                var focEl;
                if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                    this._curFocus.grp.find(".sorting").click();
                    var tag = this._curFocus.grp.attr("tag");
                    focEl = this._curFocus.grp = this.element.find("[tag='" + tag + "']");
                }
                else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.find(".sorting").click();
                    var tag = this._curFocus.tab.attr("tag");
                    focEl = this._curFocus.tab = this.element.find("[tag='" + tag + "']");
                }
                focEl.mouseover().addClass("hoverCell").focus();
            }
            if (e.which === 46 || (e.which === 82 && e.ctrlKey)) {
                if (e.which != 46)
                    e.preventDefault();
                if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                    this._curFocus.grp.find(".removeBtn").click();
                }
                else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.find(".removeBtn").click();
                }
            }
            if (e.shiftKey) {
                if (ej.isNullOrUndefined(this._startPosCell)) {
                    _startPosCell = e.target.getAttribute("p");
                    this._startPosCell = e.target.getAttribute("p");
                }
            }
            if (e.which === 39 && this.element.find(".e-dialog .hoverCell").length > 0) {
                this.element.find(".e-dialog .hoverCell").parent().find(".e-plus").click();
            }
            else if (e.which === 37 && this.element.find(".e-dialog .hoverCell").length > 0) {
                this.element.find(".e-dialog .hoverCell").parent().find(".e-minus").click();
            }
            if ((e.which === 40 || e.which === 39 || e.which === 38 || e.which === 37) && e.shiftKey && this.model.enableCellSelection) {
                this.element.find(".hoverCell").removeClass("hoverCell");
                if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.attr("tabindex", "0");
                }
                var selectedCell = $(e.target);
                if (e.which == "40") {  //Down arrow
                    var selectedCellPos = selectedCell.attr('p'), i = parseInt(selectedCellPos.split(',')[1]) + Number(selectedCell.attr("rowspan"));
                    var cell;
                    while (ej.isNullOrUndefined(cell) && i < this._rowCount) {
                        var currentCell = $(this.element).find("[p='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        this._curFocus.selection = $(cell);
                        i++;
                    }
                }
                else if (e.which == "38") {  //Up arrow
                    var selectedCellPos = selectedCell.attr('p'), i = parseInt(selectedCellPos.split(',')[1]) - 1;
                    var cell;
                    while (ej.isNullOrUndefined(cell) && i >= 0) {
                        var currentCell = $(this.element).find("[p='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                        if (ej.isNullOrUndefined(currentCell)) {
                            currentCell = $(this.element).find("[p='" + (parseInt(selectedCellPos.split(',')[0]) - 1) + "," + i + "']")[0];
                        }
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        this._curFocus.selection = $(cell);
                        i--;
                    }
                }
                else if (e.which == "39") {  //Right arrow
                    var selectedCellPos = selectedCell.attr('p'), i = parseInt(selectedCellPos.split(',')[0]) + Number(selectedCell.attr("colspan"));
                    var cell;
                    while (ej.isNullOrUndefined(cell) && i < Math.ceil(this.getJSONRecords().length / this._rowCount)) {
                        var currentCell = $(this.element).find("[p='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        this._curFocus.selection = $(cell);
                        i++;
                    }
                }
                else if (e.which == "37") {  //Left Arrow
                    var selectedCellPos = selectedCell.attr('p'), i = parseInt(selectedCellPos.split(',')[0]) - 1;
                    var cell = $(this.element).find("[p='" + (parseInt(selectedCellPos.split(',')[0]) - 1) + "," + selectedCellPos.split(',')[1] + "']")[0];
                    while (ej.isNullOrUndefined(cell) && i >= 0) {
                        var currentCell = $(this.element).find("[p='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        i--;
                    }
                    this._curFocus.selection = $(cell);
                }
                this._curFocus.selection.attr("tabindex", "-1").focus().addClass("hoverCell");
                if (Number(_startPosCell.split(",")[0]) <= Number(this._curFocus.selection.attr("p").split(",")[0]) && Number(_startPosCell.split(",")[1]) <= Number(this._curFocus.selection.attr("p").split(",")[1])) {
                    for (i = Number(_startPosCell.split(",")[0]) ; i <= Number(this._curFocus.selection.attr("p").split(",")[0]) ; i++) {
                        for (j = Number(_startPosCell.split(",")[1]) ; j <= Number(this._curFocus.selection.attr("p").split(",")[1]) ; j++) {
                            if (this.element.find("[p='" + i + "," + j + "']").hasClass("value")) {
                                this.element.find("[p='" + i + "," + j + "']").addClass("hoverCell");
                            }
                        }
                    }
                }
                else if (Number(_startPosCell.split(",")[0]) >= Number(this._curFocus.selection.attr("p").split(",")[0]) && Number(_startPosCell.split(",")[1]) >= Number(this._curFocus.selection.attr("p").split(",")[1])) {
                    for (i = Number(_startPosCell.split(",")[0]) ; i >= Number(this._curFocus.selection.attr("p").split(",")[0]) ; i--) {
                        for (j = Number(_startPosCell.split(",")[1]) ; j >= Number(this._curFocus.selection.attr("p").split(",")[1]) ; j--) {
                            if (this.element.find("[p='" + i + "," + j + "']").hasClass("value")) {
                                this.element.find("[p='" + i + "," + j + "']").addClass("hoverCell");
                            }
                        }
                    }
                }
                else if (Number(_startPosCell.split(",")[0]) <= Number(this._curFocus.selection.attr("p").split(",")[0]) && Number(_startPosCell.split(",")[1]) >= Number(this._curFocus.selection.attr("p").split(",")[1])) {
                    for (i = Number(_startPosCell.split(",")[0]) ; i <= Number(this._curFocus.selection.attr("p").split(",")[0]) ; i++) {
                        for (j = Number(_startPosCell.split(",")[1]) ; j >= Number(this._curFocus.selection.attr("p").split(",")[1]) ; j--) {
                            if (this.element.find("[p='" + i + "," + j + "']").hasClass("value")) {
                                this.element.find("[p='" + i + "," + j + "']").addClass("hoverCell");
                            }
                        }
                    }
                }
                else if (Number(_startPosCell.split(",")[0]) >= Number(this._curFocus.selection.attr("p").split(",")[0]) && Number(_startPosCell.split(",")[1]) <= Number(this._curFocus.selection.attr("p").split(",")[1])) {
                    for (i = Number(_startPosCell.split(",")[0]) ; i >= Number(this._curFocus.selection.attr("p").split(",")[0]) ; i--) {
                        for (j = Number(_startPosCell.split(",")[1]) ; j <= Number(this._curFocus.selection.attr("p").split(",")[1]) ; j++) {
                            if (this.element.find("[p='" + i + "," + j + "']").hasClass("value")) {
                                this.element.find("[p='" + i + "," + j + "']").addClass("hoverCell");
                            }
                        }
                    }
                }
            }
            else if ((e.which === 40 || e.which === 38 || e.which === 37 || e.which === 39) && this.element.find(".calcFormulaDiv:visible").length > 0) {
                e.preventDefault();
                var td = this.element.find(".calcFormulaDiv td:visible");
                if (!ej.isNullOrUndefined(this._curFocus.formula)) {
                    this._curFocus.formula.removeClass("hoverCell").mouseleave();
                    if (e.which === 39) {
                        this._index.formula = this._index.formula + 1 > td.length - 1 ? 0 : this._index.formula + 1;
                    }
                    else if (e.which === 37) {
                        this._index.formula = this._index.formula - 1 < 0 ? td.length - 1 : this._index.formula - 1;
                    }
                    else if (e.which === 40) {
                        this._index.formula = this._index.formula + 4 > td.length - 1 ? (this._index.formula + 4) % 10 : this._index.formula + 4;
                    }
                    else if (e.which === 38) {
                        this._index.formula = this._index.formula - 4 < 0 ? (this._index.formula - 4) + 20 : this._index.formula - 4;
                    }
                    this._curFocus.formula = td.eq(this._index.formula).addClass("hoverCell").mouseover();
                }
                else {
                    this._index.formula = e.which == 39 ? 0 : e.which == 37 ? td.length - 1 : 0;
                    this._curFocus.formula = td.eq(this._index.formula).addClass("hoverCell").mouseover();
                }
            }
            else if ((e.keyCode === 40 || e.which === 38) && this.element.find(".e-dialog:visible").length > 0 && !ej.isNullOrUndefined(this.element.find(".e-dialog .e-text")) && $(".e-dialog .e-text").hasClass("hoverCell")) {
                this.element.find(".e-dialog .hoverCell").removeClass("hoverCell");
                e.preventDefault();
                var td = this.element.find(".e-dialog .e-text:visible");
                if (!ej.isNullOrUndefined(this._curFocus.filter)) {
                    this._curFocus.filter.attr("tabindex", "0").removeClass("hoverCell");
                    if (e.which === 40) {
                        this._index.filter = this._index.filter + 1 > td.length - 1 ? 0 : this._index.filter + 1;
                    }
                    else if (e.which === 38) {
                        this._index.filter = this._index.filter - 1 < 0 ? td.length - 1 : this._index.filter - 1;
                    }
                    this._curFocus.filter = td.eq(this._index.filter).attr("tabindex", "-1");
                }
                else {
                    this._index.filter = e.which == 40 ? 1 : e.which == 38 ? td.length - 1 : 0;
                    this._curFocus.filter = td.eq(this._index.filter).attr("tabindex", "-1");
                }
                this._curFocus.filter.focus().addClass("hoverCell");
                $(".e-node-focus").removeClass("e-node-focus");
            }
            else if ((e.which === 40 || e.which === 38 || e.which === 37 || e.which === 39) && !ej.isNullOrUndefined(this._curFocus.tab) && this._curFocus.tab.hasClass("pivotButton") && !$(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0 && !this.element.find(".e-dialog:visible").length > 0) {
                e.preventDefault();
                if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.mouseleave().attr("tabindex", "0").removeClass("hoverCell");
                }
                var td = this.element.find(".pivotButton");
                if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                    this._curFocus.grp.attr("tabindex", "0").removeClass("hoverCell").mouseleave();
                    if (e.which === 40 || e.which === 39) {
                        this._index.grp = this._index.grp + 1 > td.length - 1 ? 0 : this._index.grp + 1;
                    }
                    else if (e.which === 38 || e.which === 37) {
                        this._index.grp = this._index.grp - 1 < 0 ? td.length - 1 : this._index.grp - 1;
                    }
                    this._curFocus.grp = td.eq(this._index.grp);
                }
                else {
                    if (e.which === 40 || e.which === 39) {
                        this._curFocus.grp = td.eq(1).attr("tabindex", "-1");
                    }
                    else if (e.which === 38 || e.which === 37) {
                        this._curFocus.grp = td.eq(td.length - 1).attr("tabindex", "-1");
                    }
                }
                this._curFocus.grp.addClass("hoverCell").mouseover().focus();
            }
            else if ((e.which === 40 || e.which === 38 || e.which === 37 || e.which === 39) && !$(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0 && (document.activeElement.getAttribute("role") == "columnheader" || document.activeElement.getAttribute("role") == "rowheader" || document.activeElement.getAttribute("role") == "gridcell")) {
                if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.attr("tabindex", "0");
                }
                if (!ej.isNullOrUndefined(this._curFocus.cell)) {
                    this._curFocus.cell.attr("tabindex", "0").removeClass("hoverCell");
                    if (this.model.hyperlinkSettings.enableColumnHeaderHyperlink) {
                        this._curFocus.cell.find("span").mouseleave();
                    }
                }
                this._index.menu = 0;
                this._curFocus.cmenu = null;
                var selectedCell = $(e.target);
                if (e.which == "40") {  //Down arrow
                    var selectedCellPos = selectedCell.attr('p'), i = parseInt(selectedCellPos.split(',')[1]) + Number(selectedCell.attr("rowspan"));
                    var cell;
                    while (ej.isNullOrUndefined(cell) && i <= this._rowCount) {
                        var currentCell = $("#" + this._id).find("[p='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                        if (ej.isNullOrUndefined(currentCell) /*&& i == 0*/) {
                            for (k = parseInt(selectedCellPos.split(',')[0]) - 1; k >= 0; k--) {
                                if (ej.isNullOrUndefined(currentCell)) {
                                    currentCell = $("#" + this._id).find("[p='" + k + "," + i + "']")[0];
                                }
                            }
                        }
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        if (!ej.isNullOrUndefined(cell)) {
                            this._curFocus.cell = $(cell);
                        }
                        i++;
                    }
                }
                else if (e.which == "38") {  //Up arrow
                    var selectedCellPos = selectedCell.attr('p'), i = parseInt(selectedCellPos.split(',')[1]) - 1;
                    var cell;
                    var j = parseInt(selectedCellPos.split(',')[0]);
                    while (ej.isNullOrUndefined(cell) && i >= 0) {
                        var currentCell = $("#" + this._id).find("[p='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                        if (ej.isNullOrUndefined(currentCell) && ((selectedCell.attr("role") == "gridcell") || (selectedCell.hasClass("summary") && (selectedCell.hasClass("calc"))))) {
                            for (k = parseInt(selectedCellPos.split(',')[1]) - 1; k >= 0; k--) {
                                if (ej.isNullOrUndefined(currentCell)) {
                                    currentCell = $("#" + this._id).find("[p='" + j + "," + k + "']")[0];
                                }
                            }
                        }
                        if (ej.isNullOrUndefined(currentCell) /*&& i == 0*/) {
                            for (k = parseInt(selectedCellPos.split(',')[0]) - 1; k >= 0; k--) {
                                if (ej.isNullOrUndefined(currentCell)) {
                                    currentCell = $("#" + this._id).find("[p='" + k + "," + i + "']")[0];
                                }
                            }
                        }
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        if (!ej.isNullOrUndefined(cell) && !$(cell).hasClass("grpRow")) {
                            this._curFocus.cell = $(cell);
                        }
                        i--;
                        j--;
                    }
                }
                else if (e.which == "39") {  //Right arrow
                    var selectedCellPos = selectedCell.attr('p'), i = parseInt(selectedCellPos.split(',')[0]) + Number(selectedCell.attr("colspan"));
                    var cell;
                    while (ej.isNullOrUndefined(cell) && i <= Math.ceil((Number(this.element.find(".pivotGridTable td:last").attr("p").split(",")[0]) + 1) * (Number(this.element.find(".pivotGridTable td:last").attr("p").split(",")[1]) + 1) / this._rowCount)) {
                        var currentCell = $("#" + this._id).find("[p='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                        if (ej.isNullOrUndefined(currentCell) /*&& i == 0*/) {
                            for (k = parseInt(selectedCellPos.split(',')[1]) - 1; k >= 0; k--) {
                                if (ej.isNullOrUndefined(currentCell)) {
                                    currentCell = $("#" + this._id).find("[p='" + i + "," + k + "']")[0];
                                }
                            }
                        }
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        if (!ej.isNullOrUndefined(cell)) {
                            this._curFocus.cell = $(cell);
                        }
                        i++;
                    }
                }
                else if (e.which == "37") {  //Left Arrow
                    var selectedCellPos = selectedCell.attr('p'), i = parseInt(selectedCellPos.split(',')[0]) - 1;
                    var cell = $("#" + this._id).find("[p='" + (parseInt(selectedCellPos.split(',')[0]) - 1) + "," + selectedCellPos.split(',')[1] + "']")[0];
                    var j = parseInt(selectedCellPos.split(',')[1]);
                    while (ej.isNullOrUndefined(cell) && i >= 0) {
                        var currentCell = $("#" + this._id).find("[p='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                        if (ej.isNullOrUndefined(currentCell) && (selectedCell.attr("role") == "gridcell")) {
                            for (k = parseInt(selectedCellPos.split(',')[0]) - 1; k >= 0; k--) {
                                if (ej.isNullOrUndefined(currentCell)) {
                                    currentCell = $("#" + this._id).find("[p='" + k + "," + j + "']")[0];
                                }
                            }
                        }
                        if (ej.isNullOrUndefined(currentCell)) {
                            for (k = parseInt(selectedCellPos.split(',')[1]) - 1; k >= 0; k--) {
                                if (ej.isNullOrUndefined(currentCell)) {
                                    currentCell = $("#" + this._id).find("[p='" + i + "," + k + "']")[0];
                                }
                            }
                        }
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                        i--;
                        j--;
                    }
                    if (!ej.isNullOrUndefined(cell) && !$(cell).hasClass("grpRow")) {
                        this._curFocus.cell = $(cell);
                    }
                }
                if (!ej.isNullOrUndefined(this._curFocus.cell)) {
                    $(".hoverCell").removeClass("hoverCell");
                    this._curFocus.cell.attr("tabindex", "-1").focus().addClass("hoverCell");
                    if (this.model.hyperlinkSettings.enableColumnHeaderHyperlink) {
                        this._curFocus.cell.mouseover();
                        this._curFocus.cell.find("span").mouseover();
                    }
                }
            }
            if (e.which === 9 && this.element.find(".colheader.hoverCell")) {
                this._curFocus.cell = this.element.find(".colheader.hoverCell");
            }
            if (((e.which === 9 && e.shiftKey) || e.which === 9) && this.element.find("#" + this._id + "_clientDlg_wrapper :visible").length > 0) {
                e.preventDefault();
                if (!$("#" + this._id + "_editCon_hidden").hasClass("e-disable") && $("#" + this._id + "_conTo").attr("disabled") != "disabled") {
                    var td = this.element.find("#" + this._id + "_conType_wrapper,#" + this._id + "_editCon_wrapper,#" + this._id + "_removeBtn,#" + this._id + "_conFrom,#" + this._id + "_conTo,#" + this._id + "_backcolor_wrapper,#" + this._id + "_borderrange_wrapper,#" + this._id + "_conFrom,#" + this._id + "_backcolor_wrapper,#" + this._id + "_bordercolor_wrapper,#" + this._id + "_borderstyle_wrapper,#" + this._id + "_fStyle_wrapper,#" + this._id + "_fSize_wrapper,#" + this._id + "_OKBtn,#" + this._id + "_CancelBtn,.e-dialog .e-close");
                }
                else if ($("#" + this._id + "_conTo").attr("disabled") != "disabled") {
                    var td = this.element.find("#" + this._id + "_conType_wrapper,#" + this._id + "_conFrom,#" + this._id + "_conTo,#" + this._id + "_backcolor_wrapper,#" + this._id + "_borderrange_wrapper,#" + this._id + "_conFrom,#" + this._id + "_backcolor_wrapper,#" + this._id + "_bordercolor_wrapper,#" + this._id + "_borderstyle_wrapper,#" + this._id + "_fStyle_wrapper,#" + this._id + "_fSize_wrapper,#" + this._id + "_OKBtn,#" + this._id + "_CancelBtn,.e-dialog .e-close");
                }
                else if (!$("#" + this._id + "_editCon_hidden").hasClass("e-disable")) {
                    var td = this.element.find("#" + this._id + "_conType_wrapper,#" + this._id + "_editCon_wrapper,#" + this._id + "_removeBtn,#" + this._id + "_conFrom,#" + this._id + "_backcolor_wrapper,#" + this._id + "_borderrange_wrapper,#" + this._id + "_conFrom,#" + this._id + "_backcolor_wrapper,#" + this._id + "_bordercolor_wrapper,#" + this._id + "_borderstyle_wrapper,#" + this._id + "_fStyle_wrapper,#" + this._id + "_fSize_wrapper,#" + this._id + "_OKBtn,#" + this._id + "_CancelBtn,.e-dialog .e-close");
                }
                else {
                    var td = this.element.find("#" + this._id + "_conType_wrapper,#" + this._id + "_backcolor_wrapper,#" + this._id + "_borderrange_wrapper,#" + this._id + "_conFrom,#" + this._id + "_backcolor_wrapper,#" + this._id + "_bordercolor_wrapper,#" + this._id + "_borderstyle_wrapper,#" + this._id + "_fStyle_wrapper,#" + this._id + "_fSize_wrapper,#" + this._id + "_OKBtn,#" + this._id + "_CancelBtn,.e-dialog .e-close");
                }
                if (!ej.isNullOrUndefined(this._curFocus.cformat)) {
                    this._curFocus.cformat.attr("tabindex", "0").removeClass("hoverCell");
                    if (e.which === 9 && e.shiftKey) {
                        this._index.cformat = this._index.cformat - 1 < 0 ? td.length - 1 : this._index.cformat - 1;
                    }
                    else if (e.which === 9) {
                        this._index.cformat = this._index.cformat + 1 > td.length - 1 ? 0 : this._index.cformat + 1;
                    }
                    this._curFocus.cformat = td.eq(this._index.cformat).attr("tabindex", "-1");
                }
                else {
                    this._index.cformat = 1;
                    this._curFocus.cformat = td.eq(this._index.cformat).attr("tabindex", "-1");
                }
                this._curFocus.cformat.focus().addClass("hoverCell");
            }
            else if (((e.which === 9 && e.shiftKey) || e.which === 9) && $("#" + this._id).find(".dlgCalculatedField:visible").length > 0) {
                e.preventDefault();
                if ($("#" + this._id).find(".calcFormulaDiv:visible").length > 0) {
                    $("#" + this._id).find(".calcFormulaDiv").css("display", "none");
                }
                var focEle = [];
                focEle.push($("#" + this._id).find("#" + this._id + "_calculateFieldName:visible"));
                focEle.push($("#" + this._id).find("#" + this._id + "_calculateFieldList_dropdown:visible"));
                focEle.push($("#" + this._id).find(".calculatorFields:visible"));
                focEle.push($("#" + this._id).find(".editFormula:visible"));
                focEle.push($("#" + this._id).find("#" + this._id + "_fieldCollection_container:visible"));
                if ($("#" + this._id).find("#" + this._id + "_btnInsert:visible:not([aria-disabled='true'])").length > 0) {
                    focEle.push($("#" + this._id).find("#" + this._id + "_btnInsert:visible:not([aria-disabled='true'])"));
                }
                focEle.push($("#" + this._id).find("#" + this._id + "_btnAdd:visible"));
                focEle.push($("#" + this._id).find("#" + this._id + "_btnDelete:visible"));
                focEle.push($("#" + this._id).find("#" + this._id + "_btnOk:visible"));
                focEle.push($("#" + this._id).find("#" + this._id + "_btnCancel:visible"));
                if (!ej.isNullOrUndefined(this._curFocus.field)) {
                    this._curFocus.field.attr("tabindex", "0").removeClass("hoverCell").blur();
                    if (e.which === 9 && e.shiftKey) {
                        this._index.field = this._index.field - 1 < 0 ? focEle.length - 1 : this._index.field - 1;
                    }
                    else if (e.which === 9) {
                        this._index.field = this._index.field + 1 > focEle.length - 1 ? 0 : this._index.field + 1;
                    }
                    this._curFocus.field = focEle[this._index.field].attr("tabindex", "-1");
                }
                else {
                    this._index.field = focEle.length > 5 ? 6 : 0;
                    this._curFocus.field = focEle[this._index.field].attr("tabindex", "-1");
                }
                this._curFocus.field.focus().addClass("hoverCell");
            }
            else if (((e.which === 9 && e.shiftKey) || e.which === 9) && this.element.find(".e-dialog:visible").length > 0) {
                e.preventDefault();
                this.element.find(".e-dialog .hoverCell").removeClass("hoverCell");
                this._curFocus.filter = null;
                this._index.filter = 0;
                var focEle = $("#" + this._id).find(".dialogOKBtn:visible:not([aria-disabled='true']),.dialogCancelBtn:visible,.e-close:visible,#GroupLabelDrop_wrapper:visible,.ascOrder:visible,.descOrder:visible,.clearSorting:visible:not([disabled='disabled']),.clearAllFilters:visible:not([disabled='disabled']),#labelFilterBtn:visible,#valueFilterBtn:visible,.e-dialog .e-text:visible:first,.filterValues:visible,#filterMeasures_wrapper:visible,#filterOptions_wrapper:visible,#filterValue1:visible,#filterValue2:visible");
                if (!ej.isNullOrUndefined(this._curFocus.tree)) {
                    this._curFocus.tree.attr("tabindex", "0").removeClass("hoverCell");
                    if (e.which === 9 && e.shiftKey) {
                        this._index.dialog = this._index.dialog - 1 < 0 ? focEle.length - 1 : this._index.dialog - 1;
                    }
                    else if (e.which === 9) {
                        this._index.dialog = this._index.dialog + 1 > focEle.length - 1 ? 0 : this._index.dialog + 1;
                    }
                    this._curFocus.tree = focEle.eq(this._index.dialog).attr("tabindex", "-1").focus();
                }
                else {
                    if (this.model.dataSource.enableAdvancedFilter) {
                        this._index.dialog = 1;
                    }
                    else {
                        this._index.dialog = 2;
                    }
                    this._curFocus.tree = focEle.eq(this._index.dialog).attr("tabindex", "-1").focus();
                }
                if (this._curFocus.tree.hasClass("filterElementTag")) {
                    this._curFocus.tree.find(".e-list:visible").addClass("hoverCell");
                }
                else {
                    this._curFocus.tree.addClass("hoverCell");
                }
            }
            else if (((e.which === 9 && e.shiftKey) || e.which === 9) && !$(".e-dialog:visible").length > 0 && typeof (oclientProxy) == "undefined") {
                e.preventDefault();
                $("#" + this._id).find(".hoverCell").removeClass("hoverCell");
                if (!ej.isNullOrUndefined(this._schemaData)) {
                    this._schemaData.element.find(".hoverCell").removeClass("hoverCell");
                }
                if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                    this._curFocus.grp.mouseleave();
                }
                this._index.field = 0;
                this._index.grp = 1;
                this._index.cell = 1;
                this._index.filter = 0;
                if (this.model.dataSource.enableAdvancedFilter) {
                    this._index.dialog = 0;
                }
                else {
                    this._index.dialog = 1;
                }
                if (!ej.isNullOrUndefined(this._schemaData) && !ej.isNullOrUndefined(this._schemaData._curFocus)) {
                    this._schemaData._curFocus.tree = null;
                    this._schemaData._curFocus.node = null;
                    this._schemaData._curFocus.button = null;
                }
                this._curFocus.field = null;
                this._curFocus.cell = null;
                this._curFocus.grp = null;
                this._curFocus.tree = null;
                this._curFocus.cmenu = null;
                this._curFocus.cformat = null;
                this._curFocus.selection = null;
                var focEle = [];
                if (this.model.enableGroupingBar && this.element.find(".pivotButton:visible").first().length > 0) {
                    focEle.push(this.element.find(".pivotButton:visible").first());
                }
                if ($(".e-pivotpager[targetcontrolid='" + this._id + "']:visible").length > 0 && $("[role='columnheader']:visible:not([p='0,0'])").first().length > 0) {
                    focEle.push($("[role='columnheader']:visible:not([p='0,0'])").first());
                }
                else if ($("#" + this._id).find("[role='columnheader']:visible").first().length > 0) {
                    focEle.push($("[role='columnheader']:not('.grpRow'):visible:first"));
                }
                if (!ej.isNullOrUndefined(this._schemaData) && this._schemaData.element.find(".e-text:visible").first().length > 0) {
                    focEle.push(this._schemaData.element.find(".e-text:visible").first());
                }
                if (!ej.isNullOrUndefined(this._schemaData) && this._schemaData.element.find(".pvtBtn:visible").first().length > 0) {
                    focEle.push(this._schemaData.element.find(".pvtBtn:visible").first());
                }
                if ($(".e-pivotpager[targetcontrolid='" + this._id + "']:visible").length > 0 && $("#Pager_CategCurrentPage:visible").length > 0) {
                    focEle.push($("#Pager_CategCurrentPage:visible"));
                }
                if ($(".e-pivotpager[targetcontrolid='" + this._id + "']:visible").length > 0 && $("#Pager_SeriesCurrentPage:visible").length > 0) {
                    focEle.push($("#Pager_SeriesCurrentPage:visible"));
                }
                if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.attr("tabindex", "0").removeClass("hoverCell");
                    if (this._curFocus.tab.hasClass("e-active")) {
                        this._curFocus.tab.removeClass("e-active");
                    }
                    if (!ej.isNullOrUndefined(this._schemaData)) {
                        this._schemaData.element.find(".e-active").removeClass("e-active");
                        this._schemaData.element.find(".e-node-hover").removeClass("e-node-hover");
                        this._schemaData.element.find(".e-node-focus").removeClass("e-node-focus");
                    }
                    if (this._curFocus.tab.hasClass("e-node-hover")) {
                        this._curFocus.tab.removeClass("e-node-hover");
                    }
                    this._curFocus.tab.mouseleave();
                    if (e.which === 9 && e.shiftKey) {
                        this._index.index = this._index.index - 1 < 0 ? focEle.length - 1 : this._index.index - 1;
                    }
                    else if (e.which === 9) {
                        this._index.index = this._index.index + 1 > focEle.length - 1 ? 0 : this._index.index + 1;
                    }
                    this._curFocus.tab = focEle[this._index.index].attr("tabindex", "-1");
                }
                else {
                    this._curFocus.tab = focEle[0].attr("tabindex", "-1");
                }
                this._curFocus.tab.focus().addClass("hoverCell").mouseover();
                if (this.model.hyperlinkSettings.enableColumnHeaderHyperlink) {
                    this._curFocus.tab.mouseover();
                    this._curFocus.tab.find("span").mouseover();
                }
                $(".e-node-focus").removeClass("e-node-focus");
                e.stopImmediatePropagation();
            }
            if (e.which === 93 && !$(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0 && this.model.enableGroupingBar && (!ej.isNullOrUndefined(this._curFocus.grp) || !ej.isNullOrUndefined(this._curFocus.tab))) {
                e.preventDefault();
                if (document.activeElement.className.startsWith("pivotButton")) {
                    if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                        var position = { x: $(this._curFocus.grp).offset().left + $(this._curFocus.grp).outerWidth(), y: $(this._curFocus.grp).offset().top + $(this._curFocus.grp).outerHeight() };
                        this._curFocus.grp.find("button").trigger({ type: 'mouseup', which: 3, clientX: position.x, clientY: position.y, pageX: position.x, pageY: position.y });
                    }
                    else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                        var position = { x: $(this._curFocus.tab).offset().left + $(this._curFocus.tab).outerWidth(), y: $(this._curFocus.tab).offset().top + $(this._curFocus.tab).outerHeight() };
                        this._curFocus.tab.find("button").trigger({ type: 'mouseup', which: 3, clientX: position.x, clientY: position.y, pageX: position.x, pageY: position.y });
                    }
                }
            }
            if (e.which === 13 && this.model.hyperlinkSettings.enableColumnHeaderHyperlink) {
                if (!ej.isNullOrUndefined(this._curFocus.cell)) {
                    this._curFocus.cell.find(".cellValue").click();
                }
                else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.find(".cellValue").click();
                }
            }
            else if (e.which == 13 && !$(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0) {
                if (this.element.find(".e-dialog .hoverCell").length > 0 && this.element.find(".e-dialog .hoverCell").hasClass("e-text")) {
                    this.element.find(".e-dialog .hoverCell").parent().find(".e-chkbox-small").click();
                }
                else if (document.activeElement.className.startsWith("pivotGridTable") || document.activeElement.getAttribute("role") == "rowheader" || document.activeElement.getAttribute("role") == "columnheader") {
                    if (!ej.isNullOrUndefined(this._curFocus.cell)) {
                        if ((this._curFocus.cell).find(".expand").length > 0) {
                            this._curFocus.cell.find(".expand").click();
                        }
                        else if ((this._curFocus.cell).find(".collapse").length > 0) {
                            this._curFocus.cell.find(".collapse").click();
                        }
                        this._curFocus.cell.removeClass("hoverCell").attr("tabindex", "0");
                        this._curFocus.cell = this.element.find("[role='" + this._curFocus.cell.attr("role") + "']:contains('" + this._curFocus.cell.text() + "'):visible").first();
                        this._curFocus.cell.attr("tabindex", "-1").focus().addClass("hoverCell");
                    }
                    else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                        if ((this._curFocus.tab).find(".expand").length > 0) {
                            this._curFocus.tab.find(".expand").click();
                        }
                        else if ((this._curFocus.tab).find(".collapse").length > 0) {
                            this._curFocus.tab.find(".collapse").click();
                        }
                        this._curFocus.tab = this.element.find("[role='" + this._curFocus.tab.attr("role") + "']:contains('" + this._curFocus.tab.text() + "'):visible").first();
                        this._curFocus.tab.attr("tabindex", "-1").focus().addClass("hoverCell");
                    }
                }
                else if (!ej.isNullOrUndefined(this._curFocus.tree) || !ej.isNullOrUndefined(this._curFocus.formula) || (!ej.isNullOrUndefined(this._curFocus.field) && this._curFocus.field.hasClass("editFormula"))) {
                    if ($("#" + this._id).find(".e-dialog .hoverCell:visible").length > 0) {
                        $("#" + this._id).find(".e-dialog .hoverCell:visible").click();
                        this._index.tree = 1;
                    }
                }
                if ($(".e-pivotpager[targetcontrolid='" + this._id + "']:visible").length > 0 && (!ej.isNullOrUndefined(this._curFocus.tab))) {
                    this._curFocus.tab.attr("tabindex", "-1").focus();
                }
            }
            if (e.keyCode == 79 && this.element.find(".e-dialog").length > 0) {
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.element.find(".dialogOKBtn:visible").click();
                    this._index.field = 0;
                    this._index.filter = 0;
                    if (this.model.dataSource.enableAdvancedFilter) {
                        this._index.dialog = 0;
                    }
                    else {
                        this._index.dialog = 1;
                    }
                    this._curFocus.tree = null;
                    var focEl;
                    if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                        this._curFocus.tab.mouseleave().removeClass("hoverCell");
                    }
                    if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                        var tag = this._curFocus.grp.attr("tag");
                        focEl = this._curFocus.grp = this.element.find("[tag='" + tag + "']");
                    }
                    else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                        var tag = this._curFocus.tab.attr("tag");
                        focEl = this._curFocus.tab = this.element.find("[tag='" + tag + "']");
                    }
                    if (!ej.isNullOrUndefined(focEl)) {
                        focEl.mouseover().addClass("hoverCell").focus();
                    }
                }
            }
            if (e.keyCode == 67 && this.element.find(".e-dialog:visible").length > 0) {
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.element.find(".dialogCancelBtn:visible").click();
                    this._index.field = 0;
                    this._index.filter = 0;
                    if (this.model.dataSource.enableAdvancedFilter) {
                        this._index.dialog = 0;
                    }
                    else {
                        this._index.dialog = 1;
                    }
                    this._curFocus.tree = null;
                    var focEl;
                    if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                        this._curFocus.tab.mouseleave().removeClass("hoverCell");
                    }
                    if (!ej.isNullOrUndefined(this._curFocus.grp)) {
                        var tag = this._curFocus.grp.attr("tag");
                        focEl = this._curFocus.grp = this.element.find("[tag='" + tag + "']");
                    }
                    else if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                        var tag = this._curFocus.tab.attr("tag");
                        focEl = this._curFocus.tab = this.element.find("[tag='" + tag + "']");
                    }
                    if (!ej.isNullOrUndefined(focEl)) {
                        focEl.mouseover().addClass("hoverCell").focus();
                    }
                }
            }
        },

        _unWireEvents: function () {
            this._off($(document), 'keydown', this._keyDownPress);
            this._off($(document), 'keyup', this._keyUpPress);
            this._off(this.element, "click", ".expand, .collapse");
            this._off(this.element, "dblclick", ".value, .summary");
            this._off(this.element, "mouseover", ".colheader, .rowheader, .expand, .collapse");
            this._off(this.element, "mouseleave", ".colheader, .rowheader, .expand, .collapse");
            this._off(this.element, "mouseover", this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ".value, .rowheader, .colheader" : ".value, .rowheader, .colheader, .summary", this.addHyperlinkHandler);
            this._off(this.element, "mouseleave", this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ".value, .rowheader, .colheader" : ".value, .rowheader, .colheader, .summary", this.removeHyperlinkHandler);
            this._off(this.element, "click", this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ".value, .rowheader, .colheader" : ".value, .rowheader, .colheader, .summary");
            this._off(this.element, "click", this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ".value .cellValue, .rowheader .cellValue, .colheader .cellValue" : ".value .cellValue, .rowheader .cellValue, .colheader .cellValue, .summary .cellValue");
            this._off(this.element, "mouseover", ".value");
            this._off(this.element, "mouseleave", ".value");
            this._off(this.element, "mousedown touchstart", ".value");
            this._off(this.element, "mouseup touchend", ".value");
            this._off(this.element, "click", ".filter");
            this._off(this.element, "click", ".sorting");
            this._off(this.element, "click", ".removeBtn");
            this._off(this.element, "mouseover", ".pvtBtn");
            this._off(this.element, "mouseleave", ".pvtBtn");
            $(document).off("keyup", this._endCellSelection);
            $(document).off("keydown", this._startCellSelection);
            $(document).off("click", this._clearSelection);
            this._off(this.element, "click", ".calculatedFieldPopup .menuItem ");
            this._off(this.element, "contextmenu", ".values .pivotButton");
            this._off(this.element, "click", ".filter", ej.proxy(this._filterBtnClick, this));
            this._off(this.element, "click", ".sorting", ej.proxy(this._sortBtnClick, this));
            this._off(this.element, "click", ".removeBtn", ej.proxy(this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode? this._removePvtBtn:this._clientRemovePvtBtn, this));
            this._off(this.element, "click", ".ascOrder, .descOrder");
            this._off(this.element, "click", ".clearAllFilters, .clearSorting");
        },

        _getFieldName: function (cell) {
            if ($(cell).hasClass("colheader") || $(cell).attr("role") == "columnheader") {
                var columnPos = parseInt($(cell).attr('p').split(',')[1]);
                var items = ej.isNullOrUndefined(this.model.dataSource.data) ? JSON.parse(this.getOlapReport()).PivotColumns : this.model.dataSource.columns;
                var textContent = cell.textContent.replace("expanded", "");
                return columnPos < items.length ? this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? items[columnPos].fieldName : items[columnPos].FieldName : textContent;
            }
            else if ($(cell).hasClass("rowheader") || $(cell).attr("role") == "rowheader") {
                var rowPos = parseInt($(cell).attr('p').split(',')[0]);
                //return ej.isNullOrUndefined(this.model.dataSource.rows[rowPos]) ? JSON.parse(this.getOlapReport()).PivotRows[rowPos].FieldName : this.model.dataSource.rows[rowPos].fieldName;
                return (ej.isNullOrUndefined(this.model.dataSource.data) || this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) ? JSON.parse(this.getOlapReport()).PivotRows[rowPos].FieldName : (ej.isNullOrUndefined(this.model.dataSource.rows) ? this.model.dataSource.rows[rowPos].fieldName : "");
            }
        },
        _colResizing: function (e) {
            if (this._expand) {
                x = e.clientX;
                y = e.clientY;
                _hedBound = this.element.find('thead,.pivotGridFrozenTable,.pivotGridColValueTable').first()[0].getBoundingClientRect();
                if ((_hedBound.left + document.documentElement.scrollLeft + _hedBound.width < x) || (x < _hedBound.left + document.documentElement.scrollLeft)) {
                    this.element.find(".e-reSizeColbg").remove();
                }
                else if (this._currentCell != -1) {
                    this.element.find(".e-reSizeColbg").css({ left: x, top: this._tableY });
                }
                }
            else {
               if (this.element.find(".e-reSizeColbg").is(":visible"))
                   return;
               if ($(e.target).attr("role") == "columnheader") {
                   var resCell =this.resCell= e.target;
                   var celLoc = resCell.getBoundingClientRect();
                   x = e.clientX;
                   y = e.clientY;
                   if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                       var tothedwidth = $('.pivotGridFrozenTable,.pivotGridColValueTable').width() + $('.pivotGridFrozenTable,.pivotGridColValueTable').find('tr').offset().left;
                   else
                       var tothedwidth = $(this.element).find('thead').width() + $(this.element).find('thead tr').offset().left;
               if (((x >= (celLoc.left + document.documentElement.scrollLeft + resCell.offsetWidth - 5)) || (x <= (celLoc.left + 3))) && (x < tothedwidth) && (x >= celLoc.left) && (y <= (celLoc.top + document.documentElement.scrollTop + e.target.offsetHeight))) {
                       if (x > (celLoc.left + 3)) {
                           var tempTarget = $(e.target).find("span");
                           this._currentCell = e.target;
                       }
                       else {
                           var tempTarget = $(e.target).prevAll("th:visible:first").find("span");
                           this._currentCell = $(e.target).prev();
                       }
               if (tempTarget.length)
                           $(e.target).parents('tr').css("cursor", "col-resize");
                       }
                      else {
                       $(e.target).parent('tr').css("cursor", "pointer");
                       this._currentCell = null;
                   }
               }
                else {
                   this.element.find("thead,.pivotGridFrozenTable,.pivotGridColValueTable tr").css("cursor", "pointer");
                   this._currentCell = null;
                 }
               }
           },

        _startColResizing: function (e) {
            if ($(e.target).closest("tr").css("cursor") == 'col-resize') {
                x = e.clientX, y = e.clientY;
                this._target = e.target;
                this._orgX = x;
                x += document.documentElement.scrollLeft;
               if (e.button != 2)
               {
                   var hedCel = $(this._target).parent("tr").find("[role='columnheader']");
                   if (this._currentCell != null)
                        var j = $(this._currentCell)[0].getBoundingClientRect();
                   _top = this._tableY = (j == undefined ? 0 : j.top) + document.documentElement.scrollTop;
                   if ($(this._target).closest("tr").css("cursor") == 'col-resize') {
                       var vElement  = $(document.createElement('div'));
                       var _height = this.model.enableGroupingBar ? this.element.height() - this.element.find(".groupingBarPivot").height() : this.element.height();
                       var hRow = this.element.find("thead,.pivotGridFrozenTable,.pivotGridColValueTable").find("tr[role='row']");
                       var curentIndex = ($(this._target).parent("tr")[0]) == undefined ? 0 : $(this._target).parent("tr")[0].rowIndex;
                       for (i = 0; i < curentIndex; i++) {
                           _height = (_height - $(hRow[i]).height());
                       }
                       vElement.addClass("e-reSizeColbg").appendTo(this.element).attr("unselectable", "on").css("visibility", "hidden");
                       vElement.css({ visibility: "visible", height: _height + 'px', cursor: 'col-resize', left: x, top: _top, position: 'fixed' });
                       this._orgX = x;
                       this._orgY = y;
                       this._expand = true;
                   }
                   else {
                       this._currentCell = null;
                   }
               }
            }
        },
        _endColResizing: function (e) {
           if (this._expand) 
                x = e.clientX, y = e.clientY;
           this.element.find(".e-reSizeColbg").remove();
           x += document.documentElement.scrollLeft;
           var _rowobj = $(this._target).parents('thead,.pivotGridFrozenTable,.pivotGridColValueTable');
           if (this._currentCell != null && this._expand) {
                var _colMinWid = 30;
                this._expand = false;
                var _outerCell = this._currentCell;
                var _oldWidth = $(_outerCell)[0].offsetWidth;
                var _extra = x - this._orgX;
           if (parseInt(_extra) + parseInt(_oldWidth) > _colMinWid) {
                  if (_extra != 0){
                    _rowobj.css("cursor", 'default');
                    var colspn = parseInt($(this._currentCell).attr("colspan"));
                    if (((this.model.frozenHeaderSettings.enableFrozenHeaders || (!this.model.frozenHeaderSettings.enableFrozenColumnHeaders && this.model.frozenHeaderSettings.enableFrozenRowHeaders) || (this.model.frozenHeaderSettings.enableFrozenColumnHeaders && this.model.frozenHeaderSettings.enableFrozenRowHeaders)) && this._JSONRecords[0].CSS == "none"))
                        var pos = parseInt($(_outerCell).attr("p").split(",")[0]) - this._JSONRecords[0].ColSpan;
                    else if (this.model.layout == ej.PivotGrid.Layout.ExcelLikeLayout)
                        var pos = parseInt($(_outerCell).attr("i").split(",")[0]);
                    else
                        var pos = parseInt($(_outerCell).attr("p").split(",")[0]);
                    var _newExtra = Math.round(_extra / colspn);
                    var colWidth = (this.element.find("col:eq(" + pos + ")").width()) + (_newExtra);
                    this._setWidthColResize(pos, colspn, colWidth);
           if ($(_outerCell).next().length) {
                     var colspn1 = parseInt($(_outerCell).next().attr("colspan"));
                     if (((this.model.frozenHeaderSettings.enableFrozenHeaders || (!this.model.frozenHeaderSettings.enableFrozenColumnHeaders && this.model.frozenHeaderSettings.enableFrozenRowHeaders)|| (this.model.frozenHeaderSettings.enableFrozenColumnHeaders && this.model.frozenHeaderSettings.enableFrozenRowHeaders)) && this._JSONRecords[0].CSS == "none"))
                         var pos1 = parseInt($(_outerCell).next().attr("p").split(",")[0]) - this._JSONRecords[0].ColSpan;
                     else if (this.model.layout == ej.PivotGrid.Layout.ExcelLikeLayout)
                         var pos1 = parseInt($(_outerCell).next().attr("i").split(",")[0]);
                     else
                         var pos1 = parseInt($(_outerCell).next().attr("p").split(",")[0]);
                     var _newExtra1 = Math.round(_extra / colspn1);
                     var colWidth1 = (this.element.find("col:eq(" + pos1 + ")").width()) - (_newExtra1);
                     this._setWidthColResize(pos1, colspn1, colWidth1);
                     this.element.find("tr").css("cursor", "default");
                        }
                    }
                }
            }
           if (this.model.enableGroupingBar)
               this.element.find("#groupingBarPivot").width($("#" + this._id).find(".pivotGridTable").width());
               if (this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenHeaders)
                   this._refreshScroller();
               if(!this.model.frozenHeaderSettings.enableFrozenColumnHeaders&&this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                {
                    var scroll = this.element.find(".e-scroller").data("ejScroller");
                    scroll.model.enableTouchScroll = false;
                }
                if (this.model.frozenHeaderSettings.enableFrozenColumnHeaders && !this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                {
                   if (this.element.find("#coltable").width() < this.element.find("#rowvaluecontent").width())
                     this.element.find("#coltable").width(this.element.find("#rowvaluecontent").width());
                }
            this._target = null;
            this.element.find(".e-reSizeColbg").remove();
            this._expand = false;
            this._currentCell = null;
        },
        _setWidthColResize: function (pos, colspn, colWidth) {
            var colMinWidth = 30;
            var newWidth = colWidth > colMinWidth ? colWidth : colMinWidth;
            for (var lim = pos; lim < (pos + colspn) ; lim++)
                this.element.find("colgroup").find("col:eq(" + lim + ")").outerWidth(newWidth);
         },
        _direction: function (value) {
            if (this.model.enableRTL && value.indexOf('-') > -1)
                return value.split('-').reverse().join('-');
            else
                return value;
        },

        _clearSelection: function (e) {
            if ($(e.target).parents(".pivotGridTable").length == 0)
                $(this.element).find(".selected").removeClass("selected");
        },

        _startCellSelection: function (e) {
            if (this._onholdKey == "Control" || ej.isNullOrUndefined(this._selectedCell)) return;
            e.preventDefault();
            if (this._onholdKey == "") this._onholdKey = e.which.toString() == "16" ? "Shift" : e.which.toString() == "17" ? "Control" : "";
            if (e.which == "40") {  //Down arrow
                var selectedCellPos = $(this._selectedCell).attr('p'), i = parseInt(selectedCellPos.split(',')[1]) + this._selectedCell.rowSpan, newCell;
                while (ej.isNullOrUndefined(newCell) && i < this._rowCount) {
                    var currentCell = $(this.element).find("[p='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                    if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader")) newCell = currentCell;
                    i++;
                }
                if (!ej.isNullOrUndefined(newCell))
                    this._selectCells("Down", newCell);
            }
            else if (e.which == "38") {  //Up arrow
                var selectedCellPos = $(this._selectedCell).attr('p'), i = parseInt(selectedCellPos.split(',')[1]) - 1, newCell;
                while (ej.isNullOrUndefined(newCell) && i >= 0) {
                    var currentCell = $(this.element).find("[p='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                    if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader")) newCell = currentCell;
                    i--;
                }
                if (ej.isNullOrUndefined(newCell) && this._onholdKey != "Shift" && ($(this._selectedCell).hasClass("colheader") || $(this._selectedCell).attr('role') == "columnheader")) {
                    for (column = parseInt(selectedCellPos.split(',')[0]) - 1; column > 0 && ej.isNullOrUndefined(newCell) ; column--) {
                        for (row = parseInt(selectedCellPos.split(',')[1] - 1) ; row >= 0 && ej.isNullOrUndefined(newCell) ; row--) {
                            var currentCell = $(this.element).find("[p='" + column + "," + row + "']")[0];
                            if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader")) newCell = currentCell;
                        }
                    }
                }
                if (!ej.isNullOrUndefined(newCell))
                    this._selectCells("Up", newCell);
            }
            else if (e.which == "39") {  //Right arrow
                var selectedCellPos = $(this._selectedCell).attr('p'), i = parseInt(selectedCellPos.split(',')[0]) + this._selectedCell.colSpan, newCell;
                while (ej.isNullOrUndefined(newCell) && i < Math.ceil(this.getJSONRecords().length / this._rowCount)) {
                    var currentCell = $(this.element).find("[p='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                    if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader")) newCell = currentCell;
                    i++;
                }
                if (!ej.isNullOrUndefined(newCell))
                    this._selectCells("Right", newCell);
            }
            else if (e.which == "37") {  //Left Arrow
                var selectedCellPos = $(this._selectedCell).attr('p'), i = parseInt(selectedCellPos.split(',')[0]) - 1, newCell;
                var newCell = $(this.element).find("[p='" + (parseInt(selectedCellPos.split(',')[0]) - 1) + "," + selectedCellPos.split(',')[1] + "']")[0];
                while (ej.isNullOrUndefined(newCell) && i >= 0) {
                    var currentCell = $(this.element).find("[p='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                    if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader")) newCell = currentCell;
                    i--;
                }
                if (ej.isNullOrUndefined(newCell) && this._onholdKey != "Shift" && ($(this._selectedCell).hasClass("rowheader") || $(this._selectedCell).attr('role') == "rowheader")) {
                    var j = parseInt(selectedCellPos.split(',')[1]) - 1;
                    while (ej.isNullOrUndefined(newCell) && j > 0) {
                        var currentCell = $(this.element).find("[p='" + parseInt(selectedCellPos.split(',')[0] - 1) + "," + j + "']")[0];
                        if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader")) newCell = currentCell;
                        j--;
                    }
                }
                if (!ej.isNullOrUndefined(newCell))
                    this._selectCells("Left", newCell);
            }
        },

        _endCellSelection: function (e) {
            if (ej.isNullOrUndefined(this._selectedCell)) return;
            e.preventDefault();
            if (e.which == 16 || e.which == 17) {
                this._onholdKey = "";
                var selectedCells = $(this.element).find(".selected");
                if (selectedCells.length > 0) {
                    var selectedCellsInfo = new Array();
                    for (var i = 0; i < selectedCells.length; i++) {
                        var cellPos = $(selectedCells[i]).attr('p');
                        var cellInfo = this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))];
                            cellInfo.Value = $(selectedCells[i]).text().trim();
                            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) cellInfo["Field"] = this._getFieldName(selectedCells[i]);
                        selectedCellsInfo.push(cellInfo);
                    }
                    this._trigger("cellSelection", { JSONRecords: selectedCellsInfo });
                }
            }
        },

        _selectCells: function (key, newCell) {
            if (this._onholdKey == "Shift") {
                if ((key == "Up" || key == "Down") && ($(newCell).hasClass("rowheader") || $(newCell).attr("role") == "rowheader") || (key == "Right" || key == "Left") && ($(newCell).hasClass("colheader") || $(newCell).attr("role") == "columnheader")) {
                    var index = key == "Up" || key == "Down" ? 1 : 0;
                    if ((key == "Up" || key == "Left") && (parseInt($(newCell).attr('p').split(',')[index]) >= parseInt(this._primaryCellPos.split(',')[index])) || (key == "Right" || key == "Down") && (parseInt($(newCell).attr('p').split(',')[index]) <= parseInt(this._primaryCellPos.split(',')[index])))
                        $(this._selectedCell).removeClass("selected");
                    else
                        if ($(newCell).attr('p') != "0,0") $(newCell).addClass("selected");
                }
            }
            else if ($(newCell).attr('p') != "0,0") {
                this.element.find(".selected").removeClass("selected");
                $(newCell).addClass("selected");
                this._primaryCellPos = $(newCell).attr('p');
                var selectedCells = $(this.element).find(".selected");
                if (selectedCells.length > 0) {
                    var selectedCellsInfo = new Array();
                    for (var i = 0; i < selectedCells.length; i++) {
                        var cellPos = $(selectedCells[i]).attr('p');
                        var cellInfo = this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))];
                            cellInfo.Value = $(selectedCells[i]).text().trim();
                            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) cellInfo["Field"] = this._getFieldName(selectedCells[i]);
                        selectedCellsInfo.push(cellInfo);
                    }
                    this._trigger("cellSelection", { JSONRecords: selectedCellsInfo });
                }
            }
            var isValidCell = key == "Up" || key == "Down" ? !$(this._selectedCell).hasClass("colheader") && $(this._selectedCell).attr('role') != "columnheader" : !$(this._selectedCell).hasClass("rowheader") && $(this._selectedCell).attr('role') != "rowheader";
            if ($(newCell).attr('p') != "0,0" && (this._onholdKey != "Shift" || isValidCell)) this._selectedCell = newCell;
        },

        _sortBtnClick: function (args) {
            this._isUpdateRequired = true;
            if ($(args.delegateTarget).attr("id") == this._id) {
                $(args.target).toggleClass("descending");
                if (!ej.isNullOrUndefined(this._schemaData)) {
                    this._schemaData.element.find(".pivotButton[tag='" + $(args.target).parent().attr('tag') + "']").find(".sorting").toggleClass("descending");
                }
            }
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                var fieldName = $(args.target).siblings(".pvtBtn").attr("fieldName");
                var reportItem = ej.Pivot.getReportItemByFieldName(fieldName, this.model.dataSource).item;
                reportItem.sortOrder = args.target.className.indexOf("descending") >= 0 ? ej.PivotAnalysis.SortOrder.Descending : ej.PivotAnalysis.SortOrder.Ascending;
                this.refreshControl();
            }
            else {
                var sortValues = this._ascdes.split("##"), count = 0;
                for (var i = 0; i < sortValues.length; i++) {
                    if (sortValues[i] == $($(args.target).siblings(".pvtBtn")).text())
                        count = 1;
                }
                classNames = args.target.className;
                isDescending = new RegExp("descending");
                if (isDescending.test(classNames)) {
                    if (count == 0)
                        this._ascdes += ($($(args.target).siblings(".pvtBtn")).text() + "##");
                }
                else {
                    if (count == 1)
                        this._ascdes = (this._ascdes.replace($($(args.target).siblings(".pvtBtn")).text() + "##", ""));
                }
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                var report;
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
                if (this.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: "sorting", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                var eventArgs = JSON.stringify({ "action": "sorting", "sortedHeaders": this._ascdes, "currentReport": report, "customObject": serializedCustomObject });
                this._waitingPopup = this.element.data("ejWaitingPopup");
                if (!ej.isNullOrUndefined(this._waitingPopup))
                    this._waitingPopup.show();
                if (!this.model.enableDeferUpdate)
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.sorting, eventArgs, this._sortingSuccess);
                else {
                    if (!ej.isNullOrUndefined(this._waitingPopup))
                        this._waitingPopup.hide();
                }
            }
        },

        calculateCellWidths: function () {
            var args = {
                rowHeight: 0,
                columnWidths: []
            }
            var columnCount;
            columnCount = this._excelLikeJSONRecords != null ? this._excelLikeJSONRecords.length / this._excelRowCount : this.getJSONRecords() != null ? this.getJSONRecords().length / this._rowCount : 0;
            var colSpan = 1, isInserted = false;
            if (columnCount > 0) {
                args.rowHeight = this.element.find('tbody tr:visible').length > 0 ? this.element.find('tbody tr:visible').outerHeight() : 0;
                for (var index = 0; index < columnCount && colSpan <= columnCount; index++) {
                    $((this._excelLikeJSONRecords != null ? this.element.find("th[i^=" + index + "]:visible") : this.element.find("th[p^=" + index + "]:visible"))).each(function () {
                        if ($(this).length > 0 && $(this).attr("colspan") == colSpan && ($(this).attr('i') != null ? $(this).attr('i').split(",")[0] == index : $(this).attr('p').split(",")[0] == index)) {
                            args.columnWidths.push($(this).outerWidth());
                            index += colSpan - 1; colSpan = 1; isInserted = true;
                            return false;
                        }
                        else
                            isInserted = false;
                    });
                    if (!isInserted && colSpan != columnCount) {
                        index--;
                        colSpan++;
                    }
                    else
                        colSpan = 1;
                }
            }
            return args;
        },

        _deferUpdate: function () {
            if (!this._isUpdateRequired) return false;
            this._isUpdateRequired = false;
            var report;
            try {
                report = JSON.parse(this.getOlapReport()).Report;
            }
            catch (err) {
                report = this.getOlapReport();
            }
            var filterValues = "";
            for (var i = 0; i < this._filterUpdate.length; i++) {
                filterValues += this._filterUpdate[i] + "%%";
            }
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            var eventArgs = JSON.stringify({ "action": "deferUpdate", "sortedHeaders": this._ascdes, "filterParams": filterValues, "currentReport": report, customObject: serializedCustomObject });
            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.deferUpdate, eventArgs, this._renderControlSuccess);
            this._filterUpdate = [];
            this._waitingPopup = this.element.data("ejWaitingPopup");
            if (!ej.isNullOrUndefined(this._waitingPopup))
                this._waitingPopup.show();
        },

        _dialogBtnClick: function (args) {
            this.element.find(".e-dialog, .clientDialog").hide();
            if (args.model.text.toLowerCase() == "cancel" || !this._isMembersFiltered) {
                ej.Pivot.closePreventPanel(this);
                if (!ej.isNullOrUndefined(this._schemaData))
                    this._schemaData.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
                return false;
            }
            this._isUpdateRequired = true;
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                var selectedNodes = [], unSelectedNodes = [];
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    jQuery.each(this._memberTreeObj.element.find(":input.nodecheckbox:checked"), function (index, item) { if (item.value != "All") selectedNodes.push(item.value); });
                    jQuery.each(this._memberTreeObj.element.find(":input.nodecheckbox:not(:checked)"), function (index, item) {
                        unSelectedNodes.push(item.value = item.value == "(blank)" ? "" : item.value);
                    });
                    this._pivotFilterItems(selectedNodes, unSelectedNodes);
                    this.model.editCellsInfo = {};
                    this._populatePivotGrid();
                }
                else {
                    this._waitingPopup.show();
                    var currElement = this._selectedField.toLocaleLowerCase(),treeNodeState;
                    this._currentReportItems = $.grep(this._currentReportItems, function (value, i) { if (value["fieldName"] != undefined && value["fieldName"].toLocaleLowerCase() != currElement) return value; });
                    this._memberTreeObj = ej.Pivot.updateTreeView(this);
                    treeNodeState = ej.Pivot.getNodesState(this._memberTreeObj);
                    if (this._schemaData != null)
                        this._schemaData._memberTreeObj = this._memberTreeObj;
                    this._currentReportItems.push({ filterItems: this._memberTreeObj.dataSource(), fieldName: this._selectedField });
                    selectedNodes = $.map(treeNodeState.selectedNodes.split("::"), function (element, index) { { return { Id: element.split("||")[0], tag: element.split("||")[1], parentId: element.split("||")[2] } } });//$.map(this._getSelectedNodes().split("::"), function (element, index) { return { Id: element.split("||")[0], tag: element.split("||")[1],parentId:element.split("||")[2] } });
                    if (this.model.enableGroupingBar) {
                        var member = ej.Pivot._getEditorMember(currElement, this);
                        this._fieldSelectedMembers[currElement] = $.map(this._fieldMembers[currElement], function (item) { if (!item.checked) return item }).length == 0 ? "All" : ((member != "All" && member != "multiple") ? member : this._getLocalizedLabels("MultipleItems"));
                    }
                    var reportItem = ej.Pivot.getReportItemByFieldName(currElement, this.model.dataSource).item;
                    if (!ej.isNullOrUndefined(reportItem)) {
                        if (treeNodeState.unSelectedNodes != "") {
                            this.model.dataSource = this.clearDrilledItems(this.model.dataSource, { action: "filtering" },this);
                            reportItem["advancedFilter"] = [];
                            reportItem.filterItems = { filterType: "include", values: this._removeSelectedNodes(selectedNodes) };
                            this.element.find(".pivotButton:contains('" + this._selectedField + "') .filter").addClass("filtered")
                            if (this._schemaData != null && this._schemaData._tableTreeObj.element.find("li[tag='" + this._selectedField + "'] .filter").length == 0){
                                this._schemaData._tableTreeObj.element.find("li[tag='" + this._selectedField + "'] div:first .e-text").after(ej.buildTag("span.e-icon", { "display": "none" }).addClass("filter")[0].outerHTML);
                                this._schemaData.element.find(".pvtBtn[fieldname='"+this._selectedField+"']").parent().find(".filter").addClass("filtered");                            
                            }
                        }
                        else {
                            delete reportItem.filterItems;
                            if (this._schemaData != null){
                                this._schemaData._tableTreeObj.element.find("li[tag='" + this._selectedField + "'] .filter").remove();
                                this._schemaData.element.find(".pvtBtn[fieldname='" + this._selectedField + "']").parent().find(".filter").removeClass("filtered");
                            }
                        }
                    }
                    this.getJSONData({action:"filtering"}, this.model.dataSource, this);
                }
            }
            else {
                var unselectedNodes = "", editorNodes = "", enableFilterIndigator;
                editorNodes = this.element.find(".editorTreeView :input.nodecheckbox");
                var uncheckedNodes = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? unselectedNodes = this._getUnSelectedNodes() + "FILTERED" + this._getSelectedNodes(this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this._curFilteredAxis == "Slicers" ? true : false : this._curFilteredAxis == "Filter" ? true : false) : this._memberTreeObj.element.find(":input:gt(0).nodecheckbox:not(:checked)"), isFiltered = false,
                filterParams = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? uncheckedNodes : this._curFilteredAxis + "::" + this._curFilteredText + "::FILTERED";
                var text = this._curFilteredText, textArr = new Array(), obj = {};
                enableFilterIndigator = this._getUnSelectedNodes() != "" ? true : false;
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    if (this.model.enableGroupingBar && ej.isNullOrUndefined(this._fieldMembers[text]))
                        this._fieldMembers[text] = ej.Pivot._getEditorMember(editorNodes, this);
                    for (var i = 0; i < uncheckedNodes.length; i++)
                        textArr.push($(uncheckedNodes[i].parentElement).siblings("a").text());
                    obj[text] = textArr;
                    if (ej.isNullOrUndefined(this._tempFilterData))
                        this._tempFilterData = new Array();
                    for (var i = 0; i < this._tempFilterData.length; i++) {
                        if (!ej.isNullOrUndefined(this._tempFilterData[i][text])) {
                            this._tempFilterData[i][text] = textArr;
                            isFiltered = true;
                        }
                    }
                    if (!isFiltered)
                        this._tempFilterData.push(obj);
                    if (this._schemaData != null) {
                        this._schemaData._tempFilterData = this._tempFilterData;
                    }
                    if (ej.isNullOrUndefined(this._curFilteredAxis) || this._curFilteredAxis != "") {
                        for (var i = 0; i < uncheckedNodes.length; i++)
                            filterParams += "##" + $(uncheckedNodes[i].parentElement).siblings("a").text();
                    }
                }
                else {
                    if (this.model.enableGroupingBar) {
                        var member = ej.Pivot._getEditorMember(text.split(":")[1], this);
                        this._fieldSelectedMembers[text.split(":")[1]] = $.map(this._fieldMembers[text.split(":")[1]], function (item) { if (!item.checked) return item; }).length == 0 ? "All" : ((member != "All" && member != "multiple") ? member : this._getLocalizedLabels("MultipleItems"));
                    }
                    obj[(this._curFilteredText).split(":")[1]] = filterParams;
                    if (ej.isNullOrUndefined(this._tempFilterData))
                        this._tempFilterData = new Array();
                    for (var i = 0; i < this._tempFilterData.length; i++) {
                        if (!ej.isNullOrUndefined(this._tempFilterData[i][(this._curFilteredText).split(":")[1]])) {
                            this._tempFilterData[i] = obj;
                            isFiltered = true;
                        }
                    }
                    if (!isFiltered)
                        this._tempFilterData.push(obj);
                }
                filteredBtn = this.model.layout == "excel" ? this.element.find(".schemaFieldTree li:contains('" + this._curFilteredText + "')") : this.element.find("." + this._curFilteredAxis + " .pivotButton:contains(" + this._curFilteredText + ") .filterBtn");
                var filterEle = this._curFilteredText;
                if (this.model.layout == ej.PivotGrid.Layout.Normal && this._schemaData != null) {
                    for (var i = 0; i < this._schemaData.element.find(".fieldTable").find("li").length; i++) {
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                            if (this._curFilteredText.split(":")[1] == $(this._schemaData.element.find(".fieldTable").find("li")[i]).attr("tag").replace(/\]/g, '').replace(/\[/g, '')) {
                                this._schemaData._selectedTreeNode = this._schemaData.element.find(".fieldTable").find("li")[i];
                                filterEle = this._curFilteredText.split(":")[1].split(".")[1];
                                }
                        }
                        else {
                            if (this._curFilteredText == this._schemaData.element.find(".fieldTable").find("li")[i].id) {
                                this._schemaData._selectedTreeNode = this._schemaData.element.find(".fieldTable").find("li")[i];
                                filterEle = this._curFilteredText;
                                }
                        }
                    }
                    if ($(this._schemaData._selectedTreeNode).parents("li:eq(0)").children().children("span").hasClass("hierarchyCDB")) {
                        this._schemaData._selectedTreeNode = $($(this._schemaData._selectedTreeNode).parents("li:eq(0)"));
                    }
                    if (enableFilterIndigator && $(this._schemaData._selectedTreeNode).find(".filter").length <= 0) {
                        var filterSpan = ej.buildTag("span.e-icon", { "display": "none" }).addClass("filter")[0].outerHTML;
                        $($(this._schemaData._selectedTreeNode).find(".e-text")[0]).after(filterSpan);
                        this._schemaData.element.find(".pvtBtn:contains('" + filterEle + "')").parent().find(".filter").addClass("filtered");
                    }
                    else if (!enableFilterIndigator) {
                        $(this._schemaData._selectedTreeNode).find(".filter").remove();
                        this._schemaData.element.find(".pvtBtn:contains('" + filterEle + "')").parent().find(".filter").removeClass("filtered");
                    }
                    if (this._curFilteredAxis == "")
                        return false;
                }
                var report;
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
                if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._trigger("beforeServiceInvoke", { action: "filtering", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject), eventArgs = this.model.customObject != {} && filterParams != "" ? JSON.stringify({ "action": "filtering", "filterParams": filterParams, "sortedHeaders": this._ascdes, "currentReport": report, "customObject": serializedCustomObject, "gridLayout": this.model.layout }) : this.model.customObject != {} ? JSON.stringify({ "action": "filtering", "currentReport": report, "customObject": serializedCustomObject, "gridLayout": this.model.layout }) : filterParams != "" ? JSON.stringify({ "action": "filtering", "filterParams": filterParams, "sortedHeaders": this._ascdes, "currentReport": report, "gridLayout": this.model.layout }) : JSON.stringify({ "action": "filtering" });
                this._waitingPopup = this.element.data("ejWaitingPopup");
                if (!ej.isNullOrUndefined(this._waitingPopup))
                    this._waitingPopup.show();
                if (!ej.isNullOrUndefined(this._schemaData))
                    this._schemaData.element.find(".schemaNoClick").addClass("freeze").width($(this._schemaData.element).width()).height($(this._schemaData.element).height()).css({ "top": $(this._schemaData.element).offset().top, "left": $(this._schemaData.element).offset().left });
                if (!this.model.enableDeferUpdate)
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filtering, eventArgs, this._filterElementSuccess);
                else {
                    this._filterUpdate.push(filterParams);
                    if (!ej.isNullOrUndefined(this._tempFilterData)) {
                        for (var j = 0; j < this._tempFilterData.length; j++) {
                            for (var key in this._tempFilterData[j]) {
                                if (key == text && this._tempFilterData[j][text].length > 0)
                                    this.element.find("#pivotButton" + text).next().addClass("filtered");
                            }
                        }
                    }
                    ej.Pivot.closePreventPanel(this);
                    if (!ej.isNullOrUndefined(this._schemaData))
                        this._schemaData.element.find(".schemaNoClick").removeClass("freeze").removeAttr("style");
                }
            }
        },
        _removeSelectedNodes: function (selectedNodes) {
            var selectedElements = $.extend([], selectedNodes);
            for (var i = 0; i < selectedNodes.length; i++) {
                for (var j = 0; j < selectedElements.length; j++) {
                    if (selectedElements[j].Id == selectedNodes[i].parentId) {
                        selectedElements.splice(j, 1);
                    }
                }
            }
            return $.map(selectedElements, function (element, index) { if (element.tag != "" && element.tag != undefined) return element.tag.replace(/\&/g, "&amp;") });
        },
        _pivotFilterItems: function (selectedNodes, unSelectedNodes) {
            var axisItems = this.model.dataSource[this._selectedAxis == "Slicers" ? "filters" : this._selectedAxis.toLowerCase()];
            var members = ej.PivotAnalysis.getMembers(this._selectedField);
            jQuery.each(members, function (itemIndex, itemValue) {
                if (itemValue == null || !itemValue.toString().replace(/^\s+|\s+$/gm, '')) {
                    jQuery.each(unSelectedNodes, function (nodeIndex, nodeValue) {
                        if (!nodeValue.toString().replace(/^\s+|\s+$/gm, ''))
                            unSelectedNodes[nodeIndex] = itemValue;
                    });
                }
            });
            var selectedField = this._selectedField, dialogTitle = this._dialogTitle;
            var items = $.grep(axisItems, function (item) { return item.fieldName == selectedField});
            for (var i = 0; i < items.length; i++)
                items[i].filterItems = selectedNodes.length == members.length ? null : { filterType: ej.PivotAnalysis.FilterType.Exclude, values: unSelectedNodes };
            if (this._schemaData != null) {
                if (unSelectedNodes.length > 0 && this._schemaData.element.find(".schemaFieldTree li[id='" + this._selectedField + "']").find(".filter").length <= 0) {
                    var filterSpan = ej.buildTag("span.e-icon", { "display": "none" }).addClass("filter")[0].outerHTML;
                    this._schemaData.element.find(".schemaFieldTree li[id='" + this._selectedField + "']").find(".e-text").after(filterSpan);
                    this._schemaData.element.find(".pvtBtn[fieldname='" + this._selectedField + "']").parent().find(".filter").addClass("filtered");
                }
                else if (unSelectedNodes.length == 0) {
                    this._schemaData.element.find(".schemaFieldTree li[id='" + this._selectedField + "']").find(".filter").remove();
                    this._schemaData.element.find(".pvtBtn[fieldname='" + this._selectedField + "']").parent().find(".filter").removeClass("filtered");
                }
            }
        },
        
        _getTreeViewItems: function () {
            var treeElement = $(".editorTreeView");
            var treeItems = [];
            var data = $(treeElement).find(':input.nodecheckbox');
            for (var i = 0; i < data.length; i++) {
                var parentNode = $(data[i]).parents('li:eq(0)');
                treeItems.push({ Id: parentNode[0].id, name: $(parentNode[0]).find('a:eq(0)').text() });
            }
            return treeItems;
        },

        _getUnSelectedNodes: function () {
            var treeElement = this.element.find(".editorTreeView")[0];
            var unselectedNodes = "";
            var data = $(treeElement).find(":input.nodecheckbox:not(:checked)");
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                for (var i = 0; i < data.length; i++) {
                    if (!($(data[i].parentElement).find('span:nth-child(1)').attr('class').indexOf("e-chk-act") > -1) && $(data[i].parentElement).attr('aria-checked') != 'mixed') {
                        var parentNode = $(data[i]).parents('li:eq(0)');
                        unselectedNodes += "::" + parentNode[0].id + "||" + $(parentNode).attr('tag');
                    }
                }
            }


            return unselectedNodes;
        },
        _getSelectedNodes: function (isSlicer) {
   
                {

                if (isSlicer) {
                    var treeElement;
                    if (this.element.find(".editorTreeView").length > 0)
                        treeElement = this.element.find(".editorTreeView")[0].childNodes[0];
                    else if (!ej.isNullOrUndefined(this._schemaData)) {
                        treeElement = this._memberTreeObj.element[0].childNodes[0];
                    }
                    var selectedNodes = new Array();
                    var data = $(treeElement).children();
                    for (var i = 0; i < data.length; i++) {
                        var parentNode = data[i];
                        var nodeInfo = { caption: $(parentNode.firstChild).find("a").text(), parentId: parentNode.parentElement.parentElement.className.indexOf("editorTreeView") > -1 ? "None" : $(parentNode).parents()[1].id, id: parentNode.id, checked: $(parentNode).find(':input.nodecheckbox')[0].checked || ($(parentNode).find('span:nth-child(1)').attr('class').indexOf("e-chk-indeter") > -1), expanded: $(parentNode.firstChild).find(".e-minus").length > 0 ? true : false, childNodes: new Array(), tag: $(parentNode).attr('tag') };
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
                    var treeElement = $(".editorTreeView");
                    var selectedNodes = "";
                    var data = $(treeElement).find(':input.nodecheckbox');
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].checked || $(data[i].parentElement).attr('aria-checked') == 'mixed') {
                            var parentNode = $(data[i]).parents('li:eq(0)');
                            selectedNodes += "::" + parentNode[0].id + "||" + $(parentNode).attr('tag');
                        }
                    }
                    return selectedNodes;
                }
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

        _getLevelInfo: function (customArgs, e) {
            var newData = $.map($(e).find("row"), function (obj, index) {
                if ((parseInt($(obj).children("LEVEL_TYPE").text()) != "1" && $(obj).children("HIERARCHY_UNIQUE_NAME").text().toLowerCase() != "[measures]") && ($(obj).find("HIERARCHY_UNIQUE_NAME").text() == customArgs.hierarchy))
                    return { value: $(obj).find("LEVEL_UNIQUE_NAME").text(), text: $(obj).find("LEVEL_CAPTION").text() };
            });
            this.olapCtrlObj._currentReportItems.push({ fieldName: customArgs.hierarchy, dropdownData: newData });
        },

     
        _sortField: function (args, me) {
            //if (!ej.isNullOrUndefined(me))
            //    me.element.find(".e-dialog, .clientDialog").remove();
            //else
                this.element.find(".e-dialog, .clientDialog").remove();
                ej.Pivot.closePreventPanel(this);
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var reportItem = ej.Pivot.getReportItemByFieldName(this._selectedField, this.model.dataSource).item;
                reportItem.sortOrder = $(args.target).hasClass("descOrder") ? ej.PivotAnalysis.SortOrder.Descending : ej.PivotAnalysis.SortOrder.Ascending;
                this.refreshControl();
            }
            else {
                ej.olap.base._clearDrilledCellSet();
                if ($(args.target).find(".selectedSort").length == 0) {
                    var reportItem = ej.Pivot.getReportItemByFieldName(this._selectedField, this.model.dataSource).item;
                    ($(args.target).hasClass("descOrder")) ? reportItem["sortOrder"] = ej.olap.SortOrder.Descending : reportItem["sortOrder"] = ej.olap.SortOrder.Ascending;
                    this._waitingPopup.show();
                    ej.olap.base.getJSONData({ action: "sorting" }, this.model.dataSource, this)
                }
            }
        },
        _createDialog: function (title, treeViewData) {
            //var backgroundDiv = ej.buildTag("div#preventDiv").css({ "width": $('body').width() + "px", "height": $('body').height() + "px", "position": "absolute", "top": $('body').offset().top + "px", "left": $('body').offset().left + "px", "z-index": 10 })[0].outerHTML;
            //$('#' + this._id).append(backgroundDiv);
            var isAdvancedFilter = (
                (this.model.enableAdvancedFilter &&this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode  ) ||
                this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode &&
                this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap &&
                this.model.dataSource.enableAdvancedFilter &&
                ej.Pivot.getReportItemByFieldName(this._selectedField, this.model.dataSource).axis != "filters" &&
                ej.Pivot.getReportItemByFieldName(this._selectedField, this.model.dataSource).item
                || (this.model.dataSource.enableAdvancedFilter && this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)) ? true : false, pos;
            this.element.find(".e-dialog, .clientDialog").remove();
            var currentHierarchy, levelInfo,clearFilterTag="", sortElements = "",  groupDropDown = "", valueFilterTag = "", labelFilterTag = "", memberSearchEditor = "";
            currentHierarchy = this._selectedField;
            var documentHeight = $(document).height();
            if (isAdvancedFilter) {
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap)
                {
                    var treeviewInfo = JSON.parse(treeViewData);
                    levelInfo = treeviewInfo.splice(treeviewInfo.length - 1, 1);
                    levelInfo = JSON.parse(levelInfo[0].levels);
                    treeViewData = JSON.stringify(treeviewInfo);                    
                }
                else if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap) {
                    levelInfo = $.map(this._currentReportItems, function (obj, index) { if (obj["fieldName"] == currentHierarchy) { return obj["dropdownData"]; } });
                    if (levelInfo.length == 0) {
                        var conStr = this._getConnectionInfo(this.model.dataSource.data);
                        var soapInfo = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>MDSCHEMA_LEVELS</RequestType><Restrictions><RestrictionList><CATALOG_NAME>" + this.model.dataSource.catalog + "</CATALOG_NAME><CUBE_NAME>" + this.model.dataSource.cube + "</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>" + this.model.dataSource.catalog + "</Catalog> <LocaleIdentifier>" + conStr.LCID + "</LocaleIdentifier> </PropertyList></Properties></Discover></Body></Envelope>";
                        this.doAjaxPost("POST", conStr.url, { XMLA: soapInfo }, this._getLevelInfo, null, { pvtGridObj: this, action: "loadFieldElements", hierarchy: this._selectedField });
                        levelInfo = $.map(this._currentReportItems, function (obj, index) { if (obj["fieldName"] == currentHierarchy) { return obj["dropdownData"]; } });
                    }
                }
                else {
                    levelInfo = [{ value: this._selectedField, text: this._selectedField }]
                }
                sortElements =  this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? ej.Pivot.createAdvanceFilterTag({ action: "sort", fieldName: currentHierarchy }, this) :"";
                groupDropDown = ej.buildTag("div.ddlGroupWrap", "Select field:" + ej.buildTag("input#GroupLabelDrop.groupLabelDrop").attr("type", "text")[0].outerHTML, {})[0].outerHTML;
                valueFilterTag = ej.Pivot.createAdvanceFilterTag({ action: "valueFiltering" },this);
                labelFilterTag = ej.Pivot.createAdvanceFilterTag({ action: "labelFiltering" },this);
                clearFilterTag = this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ?  ej.Pivot.createAdvanceFilterTag({ action: "clearFilter", selectedLevel: (levelInfo.length > 0 ? levelInfo[0] : "") },this) :"";
            }
            memberSearchEditor = ej.buildTag("div.memberSearchEditorDiv", ej.buildTag("input#searchEditorTreeView.searchEditorTreeView").attr("type", "text")[0].outerHTML)[0].outerHTML;
            var dialogContent = ej.buildTag("div#EditorDiv.editorDiv", groupDropDown + sortElements + clearFilterTag + ej.buildTag("div", labelFilterTag + valueFilterTag + memberSearchEditor + ej.buildTag("div.memberEditorDiv", ej.buildTag("div#editorTreeView.editorTreeView")[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML + "</br>",
            dialogFooter = ej.buildTag("div", ej.buildTag("button#OKBtn.dialogOKBtn", this._getLocalizedLabels("OK"))[0].outerHTML + ej.buildTag("button#CancelBtn.dialogCancelBtn", this._getLocalizedLabels("Cancel"))[0].outerHTML, { "float": "right", "margin": "-5px " + (isAdvancedFilter ? " 5px  11px " : "0px 5px ")  + "  0px" })[0].outerHTML,
            ejDialog = ej.buildTag("div#clientDialog.clientDialog", dialogContent + dialogFooter, { "opacity": "1" }).attr("title", title)[0].outerHTML,
            treeViewData = JSON.parse(treeViewData);
            for (var i = 0; i < treeViewData.length; i++)
            if (treeViewData[i].name == null || !treeViewData[i].name.toString().replace(/^\s+|\s+$/gm, '')) { treeViewData[i].name = "(blank)"; treeViewData[i].id = "(blank)"; }
            var selectedData;
            if (!ej.isNullOrUndefined(this._tempFilterData)) {
                for (var i = 0; i < this._tempFilterData.length; i++) {
                    if (!ej.isNullOrUndefined(this._tempFilterData[i][title]))
                        selectedData = this._tempFilterData[i][title];
                }
                if (!ej.isNullOrUndefined(selectedData)) {
                    for (var i = 0; i < selectedData.length; i++) {
                        for (var j = 0; j < treeViewData.length; j++) {
                            if (selectedData[i] == treeViewData[j].name)
                                treeViewData[j].checkedStatus = false;
                        }
                    }
                }
            }
            $(ejDialog).appendTo("#" + this._id);
            $("#searchEditorTreeView").ejMaskEdit({
                name: "inputbox",
                width: "100%",
                inputMode: ej.InputMode.Text,
                watermarkText: this._getLocalizedLabels("Search") + " " + title,
                maskFormat: "",
                change: ej.proxy(ej.Pivot._searchTreeNodes, this),
            });
            this.element.find(".editorTreeView").ejTreeView({
                showCheckbox: true,
                loadOnDemand: true,
                enableRTL: this.model.enableRTL,
                beforeDelete: function () {
                    return false;
                },
                height: $(".memberEditorDiv").height(),
                fields: { id: "id", text: "name", isChecked: "checkedStatus", hasChild: "hasChildren", dataSource: treeViewData },
            });
            if (isAdvancedFilter) {
                pos = this.element.find("[tag*='" + (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this._selectedField : this._curFilteredText) + "']").offset();
                this.element.find(".filterElementTag").ejMenu({
                    menuType: ej.MenuType.NormalMenu,
                    enableRTL: this.model.enableRTL,
                    width: "100%",
                    orientation: ej.Orientation.Vertical,
                    click: ej.proxy(this._filterElementClick, this)
                });
                this.element.find(".groupLabelDrop").ejDropDownList({
                    width: "99%",
                    enableRTL: this.model.enableRTL,
                    dataSource: levelInfo,
                    fields: { id: "id", text: "text", value: "value" },
                    change : ej.proxy(this._groupLabelChange, this)
                });
                var levelDropTarget = this.element.find('.groupLabelDrop').data("ejDropDownList");
                levelDropTarget.selectItemByText(levelDropTarget.model.dataSource[0].text);
                this.element.find(".memberEditorDiv").addClass("advancedFilter");
                this.element.find(".clearAllFilters").click(ej.proxy(this._clearAllFilters, this));
                this.element.find(".clearSorting").click(ej.proxy(this._clearSorting, this));
            }
            var treeViewElements = this.element.find(".editorTreeView").find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                treeViewElements[i].setAttribute("tag", treeViewData[i].tag);
            }
            this.element.find(".dialogOKBtn, .dialogCancelBtn").ejButton({ type: ej.ButtonType.Button, click: ej.proxy(this._dialogBtnClick, this) });
            this._dialogOKBtnObj = this.element.find(".dialogOKBtn").data("ejButton");
            this._memberTreeObj = this.element.find(".editorTreeView").data("ejTreeView");
            var treeViewLi = this.element.find(".editorTreeView li:gt(0)"),
            uncheckedNodes = $(treeViewLi).find(":input.nodecheckbox:not(:checked)");
            if (uncheckedNodes.length > 0) {
                var firstNode = $(this._memberTreeObj.element.find("li:first")).find("div .e-chkbox-small > span > span:eq(0)");
                $(firstNode).removeClass("e-checkmark").addClass("e-stop");
            }
            this.element.find(".clientDialog").ejDialog({ width: 265, target: "#" + this._id, enableResize: false, enableRTL: this.model.enableRTL, close: ej.proxy(ej.Pivot.closePreventPanel, this) });

            this.element.find("#clientDialog_wrapper").css("top", this.element[0].offsetTop + 20);
            this.element.find(".clientDialog").next(".e-scrollbar").hide();
            if (isAdvancedFilter) {
                this.element.find("#clientDialog_wrapper").addClass("advancedFilterDlg");
                var cntrlWidth = $(".cols-sample-area").position();
                if (cntrlWidth.left > 0) {
                    this.element.find("#clientDialog_wrapper").css({ "left": (pos.left + 50 - cntrlWidth.left), top: pos.top });
                }
                else if (!ej.isNullOrUndefined(pos))
                    this.element.find("#clientDialog_wrapper").css({ "left": pos.left+50, top: pos.top });
                this.element.find(".clientDialog").css("padding", "0px").parents().find(".e-titlebar").remove();
            }
            this._memberTreeObj.model.nodeCheck = ej.proxy(this._nodeCheckChanges, this);
            this._memberTreeObj.model.nodeUncheck = ej.proxy(this._nodeCheckChanges, this);
            if (this.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap)
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode)
                    this._memberTreeObj.model.beforeExpand = ej.proxy(this._beforeNodeExpand, this);
                else
                    this._memberTreeObj.model.nodeClick = ej.proxy(this._nodeExpand, this);
            if (this._memberTreeObj.element.find(".e-plus").length == 0) {
                this._memberTreeObj.element.find(".e-item").css("padding", "0px");
            }
            this._isMembersFiltered = false;
            this._unWireEvents();
            this._wireEvents();
            this.element.find(".e-dialog .e-close").attr("title", this._getLocalizedLabels("Close"));
            this.element.find(".e-dialog .e-close").click(function (args) {
                var pivotGrid = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                if (!ej.isNullOrUndefined(pivotGrid._schemaData))
                    pivotGrid._schemaData.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
            });
        },
        _clearSorting: function (args) {
            if ($(args.target).parent().attr("disabled") == "disabled")
                return false;
			ej.Pivot.closePreventPanel(this);
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var reportItem = ej.Pivot.getReportItemByFieldName(this._selectedField, this.model.dataSource).item;
                reportItem.sortOrder = ej.PivotAnalysis.SortOrder.None;
                this.refreshControl();
            }
            else {
                var dataSource = this.model.dataSource;
                var currElement = this._selectedField.toLowerCase();
                var reportItem = $.map(dataSource.columns, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currElement)) return obj; });
                if (reportItem.length == 0)
                    reportItem = $.map(dataSource.rows, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currElement)) return obj; });
                if (reportItem.length > 0)
                    delete reportItem[0]["sortOrder"];
                this.model.dataSource = dataSource;
                this.element.find(".e-dialog").remove();
                this.element.find("#preventDiv").remove();
                if (this._schemaData != null) {
                    this._schemaData.element.find(".e-dialog").remove();
                }
                this._waitingPopup.show();
                this.getJSONData({ action: "clearSorting" }, this.model.dataSource, this);
            }
        },

        _clearAllFilters: function (args) {
            if ($(args.target).parent().attr("disabled") == "disabled")
                return false;
            ej.Pivot.closePreventPanel(this);
            var dataSource = this.model.dataSource;
            var currElement = this._selectedField.toLowerCase();
            var reportItem = $.map(dataSource.columns, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currElement)) return obj; });
            if (reportItem.length == 0) {
                reportItem = $.map(dataSource.rows, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currElement)) return obj; });
            }
            if (reportItem.length > 0) {
                var selectedLevelInfo = this.element.find(".groupLabelDrop").length > 0 ? this.element.find(".groupLabelDrop").data("ejDropDownList") : (this._schemaData == null ? null : this._schemaData.element.find(".groupLabelDrop").data("ejDropDownList"));
                if (selectedLevelInfo != null) {
                    if (reportItem[0]["advancedFilter"])
                        reportItem[0]["advancedFilter"] = $.map(reportItem[0]["advancedFilter"], function (obj, index) { if (obj.name != undefined && (obj.name.toLowerCase() != selectedLevelInfo.getSelectedValue().toLowerCase())) return obj; });
                    if (this._schemaData != null) {
                        if (reportItem[0]["advancedFilter"].length == 0)
                            this._schemaData._tableTreeObj.element.find("li[tag ='" + reportItem[0].fileName + "'] div:eq(0) .filter").remove();
                        this._schemaData._tableTreeObj.element.find("li[tag='" + selectedLevelInfo.getSelectedValue() + "'] div:eq(0) .filter").remove();
                    }
                }
                else
                    delete reportItem[0].advancedFilter;
                delete reportItem[0].filterItems;
            }
            this._currentReportItems = $.grep(this._currentReportItems, function (value, i) { if (value["fieldName"] != undefined && value["fieldName"].toLocaleLowerCase() != currElement) return value; });
            this.model.dataSource = dataSource;
            this.element.find(".e-dialog").remove();
            this.element.find("#preventDiv").remove();
            if (this._schemaData != null)
            {
                this._schemaData._tableTreeObj.element.find("li[tag ='" + this._selectedField + "'] .filter").remove();
                this._schemaData.element.find(".e-dialog").remove();
            }
            this._waitingPopup.show();
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                ej.PivotAnalysis._valueFilterArray = $.grep(ej.PivotAnalysis._valueFilterArray, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() != currElement)) return obj; });
                this.refreshControl();
            }
            else
                this.getJSONData({ action: "advancedfiltering" }, this.model.dataSource, this);
        },

        _removeFilterTag: function (uniqueName) {
            if (uniqueName.indexOf("].") >= 0) {
                var removeElement = uniqueName.split("].").length > 2 ? "levelUniqueName" : "hierarchyUniqueName";
                if (this._excelFilterInfo.length > 0) {
                        levelName = this._selectedLevelUniqueName, hierarchyName = this._selectedFieldName;
                    this._excelFilterInfo = $.grep(this._excelFilterInfo, function (item, index) {
                        if (!(item[removeElement] == uniqueName))
                            return item;
                    });
                }
            }
        },
        _groupLabelChange: function (args) {

            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {

                var me = this.element.hasClass("e-pivotschemadesigner") ? this.model.pivotControl : this;
                var selectedLevelInfo = this.element.find(".groupLabelDrop").length > 0 ? this.element.find(".groupLabelDrop").data("ejDropDownList") : [];
                var filterData = me._getAdvancedFiltervalue(me._selectedField, selectedLevelInfo.getSelectedValue());

                var valueFilterMenuObj = this.element.find("#valueFilterBtn").data("ejMenu");
                var labelFilterMenuObj = this.element.find("#labelFilterBtn").data("ejMenu");
                var isIncludeFilter = ej.Pivot.getReportItemByFieldName(me._selectedField, me.model.dataSource).item;

                var filterIndicator = ej.buildTag("span.filterState").addClass("e-icon").attr("aria-label", "filter state")[0].outerHTML;
                var activeFilter = ej.buildTag("span.activeFilter").addClass("e-icon")[0].outerHTML

                valueFilterMenuObj.disableItem("Clear Filter");
                labelFilterMenuObj.disableItem("Clear Filter");

                var reportItem = ej.Pivot.getReportItemByFieldName(me._selectedField, me.model.dataSource).item, selectedOrder;

                if (reportItem) {
                    if (reportItem["sortOrder"] && reportItem["sortOrder"] != ej.olap.SortOrder.None) {
                        selectedOrder = (reportItem && reportItem["sortOrder"] == ej.olap.SortOrder.Descending) ? "desc" : "asc";
                        if (ej.isNullOrUndefined(selectedOrder) || selectedOrder == "asc")
                            this.element.find(".clientDialog .ascImage").addClass("selectedSort");
                        else
                            this.element.find(".clientDialog .descImage").addClass("selectedSort");
                    }
                    else
                        this.element.find(".clearSorting").css("opacity", "0.5").attr("disabled", "disabled");
                }

                this.element.find(".clearAllFilters").css("opacity", "0.5").attr("disabled", "disabled");
                this.element.find(".filterState,.activeFilter").remove();
                this.element.find(".clearFltrText").text(this._getLocalizedLabels("ClearFilter") + " from \"" + args.text + "\"");

                if (filterData.length > 0) {
                    if (filterData[0]["advancedFilterType"] == ej.olap.AdvancedFilterType.LabelFilter) {
                        this.element.find("#labelFilterBtn a:eq(0)").append(filterIndicator);
                        this.element.find("#labelFilterBtn .clearFilter").css("opacity", "1").removeAttr("disabled");
                        this.element.find("#labelFilterBtn ." + filterData[0]["labelFilterOperator"] + " a").append(activeFilter);
                        labelFilterMenuObj.enableItem("Clear Filter");
                    }
                    else {
                        this.element.find("#valueFilterBtn a:eq(0)").append(filterIndicator);
                        this.element.find("#valueFilterBtn .clearFilter").css("opacity", "1").removeAttr("disabled");
                        this.element.find("#valueFilterBtn ." + filterData[0]["valueFilterOperator"] + " a").append(activeFilter);
                        valueFilterMenuObj.enableItem("Clear Filter");
                    }
                    this.element.find(".clearAllFilters").css("opacity", "1").removeAttr("disabled");
                }
                else if (isIncludeFilter && isIncludeFilter["filterItems"]) {
                    this.element.find(".memberEditorDiv").before(filterIndicator);
                    this.element.find(".filterState").addClass("memberFilter");
                    this.element.find(".clearAllFilters").css("opacity", "1").removeAttr("disabled");
                }
            }
            else {
                this._selectedLevelUniqueName = args.selectedValue;
                var filterIndicator = ej.buildTag("span.filterState").addClass("e-icon").attr("aria-label", "filter state")[0].outerHTML;
                var filterInfo = [];
                if (this._excelFilterInfo.length > 0) {
                    var levelName = this._selectedLevelUniqueName, hierarchyName = this._selectedFieldName;
                    filterInfo = $.map(this._excelFilterInfo, function (item, index) {
                        if ( item.hierarchyUniqueName == hierarchyName && item.levelUniqueName == levelName)
                            return { action: item.action, operator: item.operator, value1: item.value1 };
                    });
                }
                this.element.find(".filterElementTag .activeFilter,.filterIndicator").remove();
                this.element.find(".clearFilter").css("opacity", "0.5").attr("disable", true);

                if (filterInfo.length > 0 && !ej.isNullOrUndefined(filterInfo[0]["operator"])) {
                    var filterTag = (filterInfo[0].action == "valuefiltering") ? "valueFilterBtn" : "labelFilterBtn";
                    this.element.find("#"+filterTag+" a:eq(0)").append(filterIndicator);
                    this.element.find("#" + filterTag + " .clearFilter").removeAttr("style disable");
                    if (filterInfo[0]["operator"].replace(/ /g, '') == "BottomCount") 
                        this.element.find("#" + filterTag + " ." + filterInfo[0]["operator"].replace(/ /g, '').replace("Bottom", "top") + " a").append($(ej.buildTag("span.activeFilter e-icon")[0].outerHTML));
                    else
                        this.element.find("#" + filterTag + " ." + filterInfo[0]["operator"].replace(/ /g, '') + " a").append($(ej.buildTag("span.activeFilter e-icon")[0].outerHTML));
                }
                else {
                    if (this._getUnSelectedNodes() != "")
                        this.element.find(".memberEditorDiv").before("<div class='filterState e-icon' style='top:126px;position:absolute' />");
                }
            }
        },

        _getAdvancedFiltervalue: function (hierarchyUqName, levelUqName) {
            var filterItem = ej.Pivot.getReportItemByFieldName(hierarchyUqName, this.model.dataSource).item, levelItem = [];
            if (filterItem && filterItem.advancedFilter)
                levelItem = $.map(filterItem.advancedFilter, function (obj, index) { if (obj.name != undefined && (obj.name.toLocaleLowerCase() == levelUqName.toLowerCase())) return obj; });
            return levelItem;

        },
        _filterElementClick: function (args, me) {

            if ($(args.element).parent().hasClass("filterElementTag")) return;
            var currentHierarchy = this._selectedField;
            if (!ej.isNullOrUndefined(args.element)) {
                this._filterAction = $(args.element).parents(".filterElementTag")[0].textContent.indexOf("Label Filters") > -1 ? "labelFiltering" : "valueFiltering";
            }
            else {
                this._filterAction = args.menuId == "valueFilterBtn" ? "valueFiltering" : args.menuId == "labelFilterBtn" ? "labelFiltering" : "";
            }
            var selectedLevelInfo = this.element.find(".groupLabelDrop").length > 0 ? this.element.find(".groupLabelDrop").data("ejDropDownList") : me.element.find(".groupLabelDrop").data("ejDropDownList");
            this._selectedLevelUniqueName = selectedLevelInfo.getSelectedValue();

            this.element.find(".e-dialog, .filterDialog, #preventDiv").remove();
            if (this._schemaData != null) { this._schemaData.element.find(".e-dialog").remove(); }
            {
                if ($.trim(args.text) == $.trim(this._getLocalizedLabels("ClearFilter"))) {
                    if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                        this._removeFilterTag(this._selectedLevelUniqueName);
                        var report;
                        try {
                            report = JSON.parse(this.getOlapReport()).Report;
                        }
                        catch (err) {
                            report = this.getOlapReport();
                        }
                        var serializedCustomObject = JSON.stringify(this.model.customObject),
                        eventArgs = JSON.stringify({ "action": this._filterAction.toLowerCase(), "filterParams": this._selectedLevelUniqueName + "--Clear Filter", "currentReport": report, "customObject": serializedCustomObject, "gridLayout": this.model.layout });
                        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filtering, eventArgs, this._filterElementSuccess);
                    }
                    else {
                        ej.Pivot.closePreventPanel(this);
                        var currentLevelInfo = this._selectedLevelUniqueName.toLowerCase(), filterInfo = [];
                        var reportItem = $.map(this.model.dataSource.columns, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currentHierarchy.toLowerCase())) return obj; });
                        if (reportItem.length == 0) {
                            reportItem = $.map(this.model.dataSource.rows, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() == currentHierarchy.toLowerCase())) return obj; });
                        }
                        ej.PivotAnalysis._valueFilterArray = $.grep(ej.PivotAnalysis._valueFilterArray, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() != currentHierarchy.toLowerCase())) return obj; });
                        if (reportItem.length > 0) {

                            if (reportItem[0]["advancedFilter"])
                                filterInfo = $.map(reportItem[0]["advancedFilter"], function (obj, index) { if (obj.name != undefined && (obj.name.toLowerCase() != currentLevelInfo)) return obj; });
                            reportItem[0]["advancedFilter"] = filterInfo;

                            if (this._schemaData) {
                                if (reportItem[0]["advancedFilter"].length == 0)
                                    this._schemaData._tableTreeObj.element.find("li[tag ='" + currentHierarchy + "'] div:eq(0) .filter").remove();
                                this._schemaData._tableTreeObj.element.find("li[tag='" + this._selectedLevelUniqueName + "'] div:eq(0) .filter").remove();
                            }
                        }
                        this._waitingPopup.show();
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                            this.refreshControl();
                        else
                            this.getJSONData({ action: "advancedfiltering" }, this.model.dataSource, this);
                        return false;
                    }
                }
                else {

                    if (this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                        var filterVal = [], levelName = this._selectedLevelUniqueName;
                        if (this._excelFilterInfo.length > 0 && $(args.element).siblings("li:eq(0)").attr("disable") != "true") {

                            filterVal = $.map(this._excelFilterInfo, function (item, index) {
                                if (item.levelUniqueName == levelName)
                                    return { value1: item.value1, value2: item.value2, operator: item.operator, measure: item.measure };
                            });
                            if ((!$(args.element).hasClass(filterVal[0]["operator"].replace(/ /g, ''))) && filterVal.length > 0)
                                filterVal = [];
                        }
                        ej.Pivot.createAdvanceFilterTag({ action:( this._filterAction == "labelFiltering" ? "labelFilterDlg" :"valueFilterDlg"), selectedArgs: args, filterInfo: filterVal }, this);
                        return false;
                    }

                    var dialogtitle, hierarchyLi, isHierarchyNode = false;
                    var dialogContent, dropdownValues, filterValue = this._getAdvancedFiltervalue(currentHierarchy, this._selectedLevelUniqueName), topCountFilterParams = "";
                    filterValue = ($(args.element).find(".activeFilter").length > 0 && filterValue.length > 0) ? filterValue[0].values : [""];
                    if (this._filterAction == "labelFiltering") {
                        dialogContent = ej.buildTag("table.labelfilter",
                                          ej.buildTag("tr", ej.buildTag("td", this._getLocalizedLabels("LabelFilterLabel")).attr("colspan", "2")[0].outerHTML)[0].outerHTML +
                                          ej.buildTag("tr", ej.buildTag("td", "<input type='text' id='filterOptions' class='filterOptions' style='width:220px'/>")[0].outerHTML +
                                          ej.buildTag("td.filterValuesTd", "<input type='text' id='filterValue1' value='" + filterValue[0] + "' style='display:inline; width:190px; height:19px;' class='filterValues'/></br>")[0].outerHTML)[0].outerHTML)[0].outerHTML;

                        dropdownValues = [{ option: "equals", value: this._getLocalizedLabels("Equals") },
                                          { option: "not equals", value: this._getLocalizedLabels("NotEquals") },
                                          { option: "begins with", value: this._getLocalizedLabels("BeginsWith") },
                                          { option: "not begins with", value: this._getLocalizedLabels("NotBeginsWith") },
                                          { option: "ends with", value: this._getLocalizedLabels("EndsWith") },
                                          { option: "not ends with", value: this._getLocalizedLabels("NotEndsWith") },
                                          { option: "contains", value: this._getLocalizedLabels("Contains") },
                                          { option: "notcontains", value: this._getLocalizedLabels("NotContains") },
                                          { option: "greater than", value: this._getLocalizedLabels("GreaterThan") },
                                          { option: "greater than or equal to", value: this._getLocalizedLabels("GreaterThanOrEqualTo") },
                                          { option: "less than", value: this._getLocalizedLabels("LessThan") },
                                          { option: "less than or equal to", value: this._getLocalizedLabels("LessThanOrEqualTo") },
                        ];
                    }
                    else if (this._filterAction == "valueFiltering") {

                        var measureNames = new Array(), innerContent, colSpan = ($(args.element).hasClass("between") || $(args.element).hasClass("notbetween")) ? "4" : "3";

                        var valueItems = []
                        if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                            valueItems = (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) ? this.model.dataSource.values : this.model.dataSource.values[0]["measures"];
                            for (var i = 0; i < valueItems.length ; i++)
                                measureNames.push({ "option": valueItems[i].fieldCaption, "value": valueItems[i].fieldName });
                        }
                        else {
                            var pvtBtns = this.element.find(".groupingBarPivot .values .pivotButton");
                            pvtBtns = (this._schemaData && pvtBtns.length == 0) ? $(this._schemaData.element.find(".schemaValue .pivotButton")) : pvtBtns;
                            for (i = 0; i < pvtBtns.length; i++) {
                                measureNames.push({ "option": $(pvtBtns[i]).text(), "value": $(pvtBtns).attr("tag").split(":")[1] });
                            }
                        }
                        innerContent = ej.buildTag("td", "<input type='text' id='filterMeasures' class='filterMeasures' />").attr("width", "180px")[0].outerHTML +
                                         ej.buildTag("td", "<input type='text' id='filterOptions' class='filterOptions'/>").attr("width", "180px")[0].outerHTML +
                                         ej.buildTag("td.filterValuesTd", "<input type='text' id='filterValue1' value='" + filterValue[0] + "' style='display:inline; width:190px; height:19px;' class='filterValues'/>" + (colSpan == "4" ? "<span> and </span><input type='text' id='filterValue2' value='" + (filterValue[1] != undefined ? filterValue[1] : "") + "' style='display:inline; width:190px; height:19px;' class='filterValues'/> </br>" : "</br>"))[0].outerHTML;

                        dialogContent = ej.buildTag("table.valuefilter",
                                         ej.buildTag("tr", ej.buildTag("td", (this._getLocalizedLabels("ValueFilterLabel"))).attr("colspan", (args.text == "Between" ? "4" : "3"))[0].outerHTML)[0].outerHTML +
                                         ej.buildTag("tr", innerContent)[0].outerHTML)[0].outerHTML;

                        dropdownValues = [{ option: "equals", value: this._getLocalizedLabels("Equals") },
                                          { option: "not equals", value: this._getLocalizedLabels("NotEquals") },
                                          { option: "greater than", value: this._getLocalizedLabels("GreaterThan") },
                                          { option: "greater than or equal to", value: this._getLocalizedLabels("GreaterThanOrEqualTo") },
                                          { option: "less than", value: this._getLocalizedLabels("LessThan") },
                                          { option: "less than or equal to", value: this._getLocalizedLabels("LessThanOrEqualTo") },
                                          { option: "between", value: this._getLocalizedLabels("Between") },
                                          { option: "not between", value: this._getLocalizedLabels("NotBetween") }];
                    }

                    var dialogFooter = ej.buildTag("div", ej.buildTag("button#filterDlgOKBtn.dialogOKBtn", "OK")[0].outerHTML + ej.buildTag("button#filterDlgCancelBtn.dialogCancelBtn", "Cancel")[0].outerHTML, { "float": "right", "margin": "8px 0 6px" })[0].outerHTML;
                    var filterDialog = ej.buildTag("div#filterDialog.filterDialog", dialogContent + dialogFooter, { "opacity": "1" }).attr("title", (this._filterAction == "labelFiltering" ? "Label Filter(" : "Value Filter(") +
                       (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? this._selectedField : this._selectedLevelUniqueName.split('.')[2].replace(/\[/g, '').replace(/\]/g, ''))
                        + ")").attr("tag", this._dialogTitle)[0].outerHTML;
                    $(filterDialog).appendTo("#" + this._id);

                    this.element.find(".filterDialog").ejDialog({ enableResize: false, width: "auto", content: "#" + this._id, close: ej.proxy(ej.Pivot.closePreventPanel, this) });
                    this.element.find(".filterOptions").ejDropDownList({
                        dataSource: dropdownValues,
                        width: this._filterAction == "labelFiltering" ? "220px" : "180px",
                        height: "25px",
                        fields: { text: "value", value: "option" },
                        change: ej.proxy(this._filterOptionChanged, this)
                    });

                    var ddlTarget = this.element.find('.filterOptions').data("ejDropDownList");
                    ddlTarget.setSelectedText(args.text);

                    if (this._filterAction == "valueFiltering") {
                        this.element.find(".filterMeasures").ejDropDownList({ dataSource: measureNames, width: "180px", height: "25px", fields: { text: "option", value: "value" }, });
                        this._measureDDL = this.element.find(".filterMeasures").data("ejDropDownList");

                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.dataSource.values.length > 0)
                            this._measureDDL.setSelectedText(this.model.dataSource.values[0]["fieldCaption"]);
                        else if (this.model.dataSource.values.length > 0 && this.model.dataSource.values[0]["measures"].length > 0)
                            this._measureDDL.setSelectedText(this.model.dataSource.values[0]["measures"][0]["fieldCaption"]);
                        else if (this._measureDDL.model.dataSource.length>0) {
                            this._measureDDL.setSelectedText(this._measureDDL.model.dataSource[0].option);
                        }
                    }

                    var dialogObj = this.element.find("#filterDialog").data("ejDialog");
                    this.element.find("#filterDlgOKBtn").ejButton({ click: ej.proxy(this._filterElementOkBtnClick, this) });
                    this.element.find("#filterDlgCancelBtn").ejButton({
                        type: ej.ButtonType.Button,
                        click: function () {
                            $(".e-dialog").hide();
                            var pGridObj = $(this.element).parents(".e-pivotgrid").data("ejPivotGrid");
                            ej.Pivot.closePreventPanel(pGridObj);
                        }
                    });
                }
            }
        },

        _filterOptionChanged: function (args) {
            var filterValue = this._getAdvancedFiltervalue(this._selectedField, this._selectedLevelUniqueName);
            if (filterValue.length > 0) {
                if (filterValue[0].advancedFilterType == 'label' && args.value.replace(/ /g, '') == filterValue[0].labelFilterOperator)
                    filterValue = filterValue[0].values;
                else if (filterValue[0].advancedFilterType == 'value' && args.value.replace(/ /g, '') == filterValue[0].valueFilterOperator)
                    filterValue = filterValue[0].values;
                else
                    filterValue = [""];
            }
            else
                filterValue = [""];            
            var valuesTd = this.element.find(".filterValuesTd")[0];
            if (args.value.toLowerCase().indexOf("between") >= 0)
                $(valuesTd).html("<input type='text' id='filterValue1' class='filterValues' value='" + filterValue[0] + "' style='display:inline'/> <span>and</span> <input type='text' id='filterValue2' value='" + (ej.isNullOrUndefined(filterValue[1]) ? "" : filterValue[1]) + "' class='filterValues' style='display:inline' /> </br>");
            if (args.value.toLowerCase().indexOf("between") < 0)
                $(valuesTd).html("<input type='text' id='filterValue1' class='filterValues' value='" + filterValue[0] + "' style='display:inline'/>");
        },

        _filterElementOkBtnClick: function (args) {
            ej.Pivot.closePreventPanel(this);
            var selectedOperator = this.element.find(".filterOptions")[0].value,
                enteredValue = [this.element.find("#filterValue1")[0].value],
                selectedMeasure, filterInfo = [], currentHierarchy = this._selectedField;

            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                var filterValue1 = enteredValue[0].value,
                     filterValue2 = (this.element.find("#filterValue2").length > 0 ? this.element.find("#filterValue2")[0].value : ""),
             selectedMeasure, params, levelFilterInfo = [], actionName = "labelfiltering";
                params = this._selectedLevelUniqueName + "--" + selectedOperator + "--" + enteredValue[0];
                if (this.element.find(".filterMeasures").length > 0) {
                    if (this.element.find("#filterValue2").length > 0)
                        params = params + "," + filterValue2;
                    selectedMeasure = this.element.find(".filterMeasures").data("ejDropDownList").model.value;
                    params = params + "--" + selectedMeasure;
                    actionName = "valuefiltering";
                }
                var report;
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }

                var serializedCustomObject = JSON.stringify(this.model.customObject),
                    eventArgs = JSON.stringify({ "action": actionName, "filterParams": params, "currentReport": report, "customObject": serializedCustomObject, "gridLayout": this.model.layout });
                this._waitingPopup = this.element.data("ejWaitingPopup");
                if (!ej.isNullOrUndefined(this._waitingPopup))
                    this._waitingPopup.show();
                if (!ej.isNullOrUndefined(this._schemaData))
                    this._schemaData.element.find(".schemaNoClick").addClass("freeze").width($(this._schemaData.element).width()).height($(this._schemaData.element).height()).css({ "top": $(this._schemaData.element).offset().top, "left": $(this._schemaData.element).offset().left });

                this._removeFilterTag(this._selectedLevelUniqueName);
                this._excelFilterInfo.push({ action: actionName, hierarchyUniqueName: this._selectedFieldName, levelUniqueName: this._selectedLevelUniqueName, operator: selectedOperator, measure: selectedMeasure, value1: enteredValue[0], value2: filterValue2 });
                if (!this.model.enableDeferUpdate)
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.filtering, eventArgs, this._filterElementSuccess);
                return false;
            }

            if (this._filterAction == "valueFiltering") {
                selectedMeasure = this._measureDDL.getSelectedValue();
                if (!(!isNaN(parseFloat(enteredValue[0])) && isFinite(enteredValue[0])) || selectedMeasure == "") { return; };
                this.element.find("#filterValue2")[0] != undefined ? "," + enteredValue.push(this.element.find("#filterValue2")[0].value) : enteredValue;
            }
            this.element.find(".e-dialog").remove();

            if (this._schemaData) {
                var filterIndicator = ej.buildTag("span.filter").addClass("e-icon")[0].outerHTML;
                var selectedLevel   = this._schemaData._tableTreeObj.element.find("li[tag='" + this._selectedLevelUniqueName + "'] div:eq(0)");
                var selectedHierarchy = this._schemaData._tableTreeObj.element.find("li[tag ='" + currentHierarchy + "'] div:eq(0)");
                if(selectedLevel.find(".filter").length==0)
                    selectedLevel.append(filterIndicator);
                if (selectedHierarchy.find(".filter").length === 0)
                    selectedHierarchy.append(filterIndicator);
            }
           
            var currentLevelInfo = this._selectedLevelUniqueName.toLowerCase();
            var reportItem = $.map(this.model.dataSource.columns, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLocaleLowerCase() == currentHierarchy.toLowerCase())) return obj; });
            if (reportItem.length == 0) {
                reportItem = $.map(this.model.dataSource.rows, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLocaleLowerCase() == currentHierarchy.toLowerCase())) return obj; });
            }

            if (reportItem.length > 0) {
                delete reportItem[0]["filterItems"];
                if (reportItem[0]["advancedFilter"])
                    filterInfo = $.map(reportItem[0]["advancedFilter"], function (obj, index) { if (obj.name != undefined && (obj.name.toLocaleLowerCase() != currentLevelInfo)) return obj; });
                if (this._filterAction.toLowerCase() == "labelfiltering")
                    filterInfo.push({ name: this._selectedLevelUniqueName, labelFilterOperator: selectedOperator.replace(/ /g, ""), advancedFilterType: ej.olap.AdvancedFilterType.LabelFilter, values: enteredValue });
                else
                    filterInfo.push({ name: this._selectedLevelUniqueName, valueFilterOperator: selectedOperator.replace(/ /g, ""), advancedFilterType: ej.olap.AdvancedFilterType.ValueFilter, values: enteredValue, measure: selectedMeasure });

                this._currentReportItems = $.grep(this._currentReportItems, function (value, i) { if (value["fieldName"] != currentHierarchy) return value; });
                reportItem[0]["advancedFilter"] = filterInfo;
            }

            this._waitingPopup.show();

            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {

                ej.PivotAnalysis._valueFilterArray = $.grep(ej.PivotAnalysis._valueFilterArray, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() != currentHierarchy.toLowerCase())) return obj; });
                if (this._filterAction == "valueFiltering") {
                    ej.PivotAnalysis._valueFilterArray.push(reportItem[0]);
                }
                this.refreshControl();
            }
            else
                this.getJSONData({ action: "advancedfiltering" }, this.model.dataSource, this);
        },

        _nodeCheckChanges: function (args) {
            this._isMembersFiltered = true;
            if ((args.value == "(All)" || args.value == "All") && args.type == "nodeUncheck") {
                this._memberTreeObj.model.nodeCheck = "";
                this._memberTreeObj.model.nodeUncheck = "";
                this.element.find(".editorTreeView").ejTreeView("unCheckAll");
                this._memberTreeObj.model.nodeCheck = ej.proxy(this._nodeCheckChanges, this);
                this._memberTreeObj.model.nodeUncheck = ej.proxy(this._nodeCheckChanges, this);
                this._dialogOKBtnObj.disable();
            }
            else if ((args.value == "(All)" || args.value == "All") && args.type == "nodeCheck") {
                this._memberTreeObj.model.nodeCheck = "";
                this._memberTreeObj.model.nodeUncheck = "";
                this.element.find(".editorTreeView").ejTreeView("checkAll");
                $(this._memberTreeObj.element.find("li:first")).find("div .e-chkbox-small > span > span:eq(0)").removeClass("e-stop");
                this._memberTreeObj.model.nodeCheck = ej.proxy(this._nodeCheckChanges, this);
                this._memberTreeObj.model.nodeUncheck = ej.proxy(this._nodeCheckChanges, this);
                this._dialogOKBtnObj.enable();
            }
            else if (args.value != "(All)") {
                var uncheckedNodes = this._memberTreeObj.element.find(":input:gt(0).nodecheckbox:not(:checked)"),
                firstNode = $(this._memberTreeObj.element.find("li:first")).find("div .e-chkbox-small > span > span:eq(0)");
                if (uncheckedNodes.length == 0 || (uncheckedNodes.length == 1 && uncheckedNodes[0].id[uncheckedNodes[0].id.length - 1] == 0)) {
                    $(firstNode).parent().removeClass("e-chk-inact").removeClass("e-chk-ind").addClass("e-chk-act");
                    firstNode.removeClass("e-stop").addClass("e-checkmark");
                }
                else if (args.type == "nodeCheck" && uncheckedNodes.length == 1 && uncheckedNodes[0].id[uncheckedNodes[0].id.length - 1] == 0)
                    firstNode.removeClass("e-stop").addClass("e-checkmark");
                else if (uncheckedNodes.length > 0)
                    firstNode.removeClass("e-checkmark").addClass("e-stop");
                this._dialogOKBtnObj.enable();
                if (args.type == "nodeUncheck" && uncheckedNodes.length + 1 == this._memberTreeObj.element.find("li").length) {
                    firstNode.removeClass("e-checkmark").removeClass("e-stop");
                    this._dialogOKBtnObj.disable();
                }
            }
        },

        _fetchMemberSuccess: function (msg) {
            if (msg[0] != undefined && msg.length > 0) {
                this._currentMembers = msg[0].Value;
                if (msg[1] != null && msg[1] != undefined)
                    this.model.customObject = msg[1].Value;
            }
            else if (msg.d != undefined && msg.d.length > 0) {
                this._currentMembers = msg.d[0].Value;
                if (msg.d[1] != null && msg.d[1] != undefined)
                    this.model.customObject = msg.d[1].Value;
            }
            else if (msg != undefined && msg.length > 0) {
                this._currentMembers = msg.EditorTreeInfo;
                if (msg != null && msg != undefined)
                    this.model.customObject = msg.customObject;
            }
            else if (msg != undefined) {
                this._currentMembers = msg.EditorTreeInfo;
            }
            this._createDialog(this._dialogHead, this._currentMembers);
            if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "fetchMembers", element: this.element, customObject: this.model.customObject });
            if (this.model.dataSource.enableAdvancedFilter) {
                this.element.find(".e-dialog #GroupLabelDrop_wrapper:visible").first().attr("tabindex", "-1").focus().addClass("hoverCell");
            }
            else if (!ej.isNullOrUndefined(this.element.find(".e-dialog .e-text:visible").first())) {
                this.element.find(".e-dialog .e-text:visible").first().attr("tabindex", "-1").focus().addClass("hoverCell");
            }
            this._waitingPopup.hide();
        },

        _filterElementSuccess: function (report) {
            if (report[0] != undefined) {
                if (report[2] != null && report[2] != undefined)
                    this.model.customObject = report[2].Value;
            }
            else if (report.d != undefined) {
                if (report.d[2] != null && report.d[2] != undefined)
                    this.model.customObject = report.d[2].Value;
            }
            else {
                if (report.customObject != null && report.customObject != undefined)
                    this.model.customObject = report.customObject;
            }
            if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "filtering", element: this.element, customObject: this.model.customObject });
            this._renderControlSuccess(report);
        },

        _sortingSuccess: function (msg) {
            if (msg[0] != undefined) {
                if (msg[2] != undefined && msg.length > 0)
                    this.model.customObject = msg[2].Value;
            }
            else if (msg.d != undefined && msg.d.length > 0) {
                if (msg.d[2] != null && msg.d[2] != undefined)
                    this.model.customObject = msg.d[2].Value;
            }
            else if (msg != undefined && msg.length > 0) {
                if (msg.customObject != null && msg.customObject != undefined)
                    this.model.customObject = msg.customObject;
            }
            if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "sorting", element: this.element, customObject: this.model.customObject });
            this._renderControlSuccess(msg)
        },
        _nodeExpand: function (args) {
            var selectedItem = (args.event.originalEvent != undefined && args.event.originalEvent.target != undefined) ? args.event.originalEvent.target : args.event.target; var tagInfo, dimenName = "";
            var childCount = $(selectedItem).parents("li").first().children().find("li").length;
            if (selectedItem != undefined && selectedItem.className != undefined && selectedItem.className != "" && selectedItem.className.indexOf("e-plus") > -1 && childCount == 0) {
                $(selectedItem).removeClass("e-plus").addClass("e-load");
                var checkedState = $(selectedItem).parent().find("input.e-checkbox").prop("checked"), report;
                var tagInfo = $(selectedItem).parents("li").first().attr("tag");
                this.pNode = selectedItem;
                try {
                    report = JSON.parse(this.model.pivotControl != undefined ? this.model.pivotControl.getOlapReport() : this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.model.pivotControl != undefined ? this.model.pivotControl.getOlapReport() : this.getOlapReport();
                }
                var pivotButtons = this.element.find(".pivotButton"), parentTag, tagName;
                for (var bt = 0; bt < pivotButtons.length > 0; bt++) {
                    if ($(pivotButtons[bt]).attr("tag").indexOf(!ej.isNullOrUndefined(this._curFilteredText) ? this._curFilteredText : !ej.isNullOrUndefined(this._schemaData) ? this._schemaData._curFilteredText : "") > -1 && $(pivotButtons[bt]).attr("tag").split(":")[1].length == (!ej.isNullOrUndefined(this._curFilteredText) ? this._curFilteredText.length : !ej.isNullOrUndefined(this._schemaData)? this._schemaData._curFilteredText.length : 0))
                        dimenName = $(pivotButtons[bt]).attr("tag");
                    else if ($(pivotButtons[bt]).attr("tag").indexOf(!ej.isNullOrUndefined(this._curFilteredText) ? this._curFilteredText : !ej.isNullOrUndefined(this._schemaData) ? this._schemaData._curFilteredText : "") > -1)
                        tagName = $(pivotButtons[bt]).attr("tag");
                }
                dimenName = dimenName == "" ? !ej.isNullOrUndefined(tagName) ? tagName.split(":")[1] : !ej.isNullOrUndefined(this._curFilteredText) ? this._curFilteredText : this._schemaData._curFilteredText : dimenName.split(":")[1];
                if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._trigger("beforeServiceInvoke", { action: "memberExpanded", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.memberExpand, JSON.stringify({
                    "action": "memberExpanded", "checkedStatus": checkedState, "parentNode": $(selectedItem).parents("li")[0].id, "tag": tagInfo, "cubeName": JSON.parse(this._olapReport).CurrentCube + "##" + dimenName, "currentReport": report, "customObject": serializedCustomObject
                }), this._fetchChildNodeSuccess);
            }
        },

        _fetchChildNodeSuccess: function (data) {
            var newDataSource; var parentNode;
            if (data.length > 1 && data[0] != undefined) {
                newDataSource = JSON.parse(data[0].Value);
                if (data[1] != null && data[1] != undefined)
                    this.model.customObject = data[1].Value;
            }
            else if (data.d != undefined) {
                newDataSource = JSON.parse(data.d[0].Value);
                if (data.d[1] != null && data.d[1] != undefined)
                    this.model.customObject = data.d[1].Value;
            }
            else {
                newDataSource = JSON.parse(data.ChildNodes);
                if (data.customObject != null && data.customObject != undefined)
                    this.model.customObject = data.customObject;
            }
            var mapper = { id: "id", parentId: "pid", hasChild: "hasChildren", text: "name", isChecked: "checkedStatus" };
            if ($(this.pNode).parents("li").length > 1)
                parentNode = $(this.pNode).parents("li").first();
            else
                parentNode = $(this.pNode).parents("li");
            $($(parentNode).find('input.nodecheckbox')[0]).ejCheckBox({ checked: false })
            if (!ej.isNullOrUndefined(this._memberTreeObj) && (this._editorFlag))
                this._memberTreeObj._createSubNodesWhenLoadOnDemand(newDataSource, this.pNode, mapper);
            else if (!ej.isNullOrUndefined(this._schemaData._memberTreeObj))
                this._schemaData._memberTreeObj._createSubNodesWhenLoadOnDemand(newDataSource, this.pNode, mapper);
            $.each($(parentNode).children().find("li"), function (index, value) {
                value.setAttribute("tag", newDataSource[index].tag);
            });
            if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "memberExpanded", element: this.element, customObject: this.model.customObject });
            // this._memberTreeObj._expandCollapseAction(this.pNode);
            if (!ej.isNullOrUndefined(this._schemaData))
                this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
        },

        _beforeNodeExpand: function (args) {
            ej.Pivot.getChildNodes(args, this._selectedField, this._currentReportItems, this.model.dataSource, this);
        },
        _generateAllMember: function(customArgs,args){
            this.olapCtrlObj._allMember = $($(args).find("Axis:eq(0) Tuple:eq(0)").children().children()[1]).text();
        },
        _generateMembers: function (customArgs,args) {
            var data = $(args).find("Axis:eq(0) Tuple"),    treeViewData = [],treeNodeInfo={};
            treeViewData.push({ id: "All", name: "All", checkedStatus: true,tag:"" });
            for(var i=0;i<data.length;i++){
                var memberUqName=$($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[0]).text(), 
                    memberName=$($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[1]).text();
                treeNodeInfo = { hasChildren:  $(data[i]).find("CHILDREN_CARDINALITY").text()!="0", checkedStatus:true, id: memberUqName.replace(/\]*\]/g, '-').replace(/\[*\[/g, '-'), name: memberName,    tag: memberUqName };
                treeViewData.push(treeNodeInfo);
            }
            if (!ej.isNullOrUndefined(this.olapCtrlObj)) {
                this.olapCtrlObj._waitingPopup.hide();
                this.olapCtrlObj._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(treeViewData) });
            }
        },
        _filterBtnClick: function (args) {
            this._editorFlag = true;
            ej.Pivot.openPreventPanel(this);
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    var currentHierarchy = this._selectedField = $(args.currentTarget.parentNode).attr("tag").split(":")[1], filteredData = [], reportItem = {} ;
                    this._dialogHead = $(args.target).siblings(".pvtBtn").attr("fieldCaption");
                    filteredData = $.map(this._currentReportItems, function (obj, index) { if (obj["fieldName"] == currentHierarchy) return obj["filterItems"]; });
                    if (filteredData.length > 0)
                        this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(filteredData) });
                    else {
                        ej.olap._mdxParser.getMembers(this.model.dataSource, currentHierarchy, this);
                        this._waitingPopup.show();
                    }
                }
                else {
                    this._selectedField = $(args.target).siblings(".pvtBtn").attr("fieldName");
                    this._dialogHead = $(args.target).siblings(".pvtBtn").attr("fieldCaption");
                    this._selectedAxis = $(args.target).siblings(".pvtBtn").attr("axis");                   
                    var treeViewData = this._getTreeViewData(this._selectedField, this._selectedAxis);
                    this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(treeViewData) });
                }
            }
            else {
                this._curFilteredAxis = args.target.parentElement.attributes.tag.value.split(":")[0];
                this._curFilteredText = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? args.target.parentElement.attributes.tag.value : $($(args.target).siblings()[1]).attr("fieldname");
                this._dialogTitle = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? args.target.parentElement.attributes.tag.value : $($(args.target).siblings()[1]).attr("fieldname");
                this._dialogHead = $($(args.target).siblings()[1]).attr("fieldcaption");
                var report;
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
                this._waitingPopup.show();
                if (!ej.isNullOrUndefined(this._schemaData))
                    this._schemaData.element.find(".schemaNoClick").addClass("freeze").width($(this._schemaData.element).width()).height($(this._schemaData.element).height()).css({ "top": $(this._schemaData.element).offset().top, "left": $(this._schemaData.element).offset().left });
                if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._trigger("beforeServiceInvoke", { action: "fetchMembers", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                eventArgs = JSON.stringify({ "action": "fetchMembers", "headerTag": this.model.enableAdvancedFilter ? this._dialogTitle + "##" + this.model.enableAdvancedFilter : (this._dialogTitle), "sortedHeaders": this._ascdes, "currentReport": report, "customObject": serializedCustomObject });
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.fetchMembers, eventArgs, this._fetchMemberSuccess);
            }
        },

        _getTreeViewData: function (fieldName) {
            var item = ej.Pivot.getReportItemByFieldName(fieldName, this.model.dataSource).item;
            var members = ej.PivotAnalysis.getMembers(fieldName);
            var treeViewData = [{ id: "All", name: "All", checkedStatus: true }];
            if (item.filterItems != null && item.filterItems != undefined)
                for (var i = 0; i < members.length; i++) treeViewData.push({ id: members[i], name: members[i], checkedStatus: item.filterItems.filterType == ej.PivotAnalysis.FilterType.Include ? $.inArray(members[i] != null ? members[i].toString() : members[i], item.filterItems.values) >= 0 : $.inArray(members[i] != null ? members[i].toString() : members[i], item.filterItems.values) < 0 });
            else
                for (var i = 0; i < members.length; i++) treeViewData.push({ id: members[i], name: members[i], checkedStatus: true });
            return treeViewData;
        },

        _applyToolTip: function (e) {
            var toolTipInfo; var rowValue; var cellPos; var columnValue = ""; valueCell = "";
            var targetCell = $(e.target).hasClass("cellValue") ? e.target.parentElement : e.target;
            if ($(targetCell).find("input").length == 0 && !$(targetCell).hasClass("curInput") && !ej.isNullOrUndefined($(targetCell).attr("role"))) {
                cellPos = this.element.find(".summary[role!='gridcell'][p$='," + $(targetCell).attr('p').split(',')[1] + "'] , .rowheader[role!='gridcell'][p$='," + $(targetCell).attr('p').split(',')[1] + "']").last().attr("p")
                if (cellPos == null)
                    cellPos = this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? $(targetCell).parent("tr").find(".summary,.rowheader").attr("p") : $(targetCell).parent("tr").find(".summary").attr("p");
                if (cellPos != null) {
                    if ((cellPos[0] == 0) && ((parseInt(cellPos.split(",")[0])) != null)) {
                        if (cellPos == this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))].Index) {
                            rowValue = this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))].Value;
                        }
                    }
                    else
                        while (cellPos[0] >= 0) {
                            if (cellPos == this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))].Index) {
                                toolTipInfo = this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))].Value;
                                cellPos = parseInt(cellPos.split(",")[0]) - 1 + "," + parseInt(cellPos.split(",")[1]);
                            }
                            if (rowValue)
                                rowValue = toolTipInfo != "" ? toolTipInfo + "-" + rowValue : rowValue;
                            else
                                rowValue = toolTipInfo;
                        }
                }
                var columnHeaderCount = this.element.find('tr:has(".colheader")').length - 1;
                var currentCellPos = $(targetCell).attr("p");
                if ((currentCellPos != undefined) && (currentCellPos == this.getJSONRecords()[parseInt((parseInt(currentCellPos.split(",")[0]) * this._rowCount) + parseInt(currentCellPos.split(",")[1]))].Index)) {
                    var colPos = parseInt(currentCellPos.split(",")[0]);
                }
                for (var i = 0; i <= columnHeaderCount; i++) {
                    var columnHeaderPos = colPos + "," + i;
                    if (colPos != null)
                        if (columnHeaderPos == this.getJSONRecords()[parseInt((parseInt(columnHeaderPos.split(",")[0]) * this._rowCount) + parseInt(columnHeaderPos.split(",")[1]))].Index) {
                            toolTipInfo = this.getJSONRecords()[parseInt((parseInt(columnHeaderPos.split(",")[0]) * this._rowCount) + parseInt(columnHeaderPos.split(",")[1]))].Value;
                            if (columnValue == "")
                                columnValue = toolTipInfo;
                            else if (toolTipInfo != "")
                                columnValue = columnValue + "-" + toolTipInfo;
                        }
                }
                $("#" + this._id + "_gridTooltip").remove();
                this.element.find("span#celval").remove();
                var tdPos = $(targetCell).position();
                if (this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenHeaders)
                    tdPos.left = tdPos.left + (this.model.frozenHeaderSettings.enableFrozenHeaders ? this.element.find(".rowhead").width() : this.model.frozenHeaderSettings.enableFrozenRowHeaders ? this.element.find("#coltable").width() : 0);
                $("#" + this._id).append("<div id=\"" + this._id + "_gridTooltip\" class=\"pGridTooltip\" role='tooltip'></div>");
                $(targetCell).append("<span id='celval' style='display:none'>" + "row- " + rowValue + ": column- " + columnValue + "</span>");
                $(targetCell).find("span.cellValue").attr("aria-describedby", "span#celval");
                var tooltipval = $(targetCell).find("span.cellValue:not('#celval')").text();
                if (this.model.enableRTL) {
                    $("#" + this._id + "_gridTooltip").append("<p id=\"value\" class=\"tooltipText\">" + (tooltipval ? tooltipval : this._getLocalizedLabels("NoValue")) + ":" + this._getLocalizedLabels("ToolTipValue") + "</p>");
                    $("#" + this._id + "_gridTooltip").append("<p id=\"row\" class=\"tooltipText\">" + ((rowValue == undefined || this._rowCount == 1) ? this._getLocalizedLabels("NoValue") : this._direction(rowValue)) + ":" + this._getLocalizedLabels("ToolTipRow") + "</p>");
                    $("#" + this._id + "_gridTooltip").append("<p id=\"column\" class=\"tooltipText\">" + ((columnValue == undefined || columnValue == "") ? this._getLocalizedLabels("NoValue") : this._direction(columnValue)) + ":" + this._getLocalizedLabels("ToolTipColumn") + "</p>");
                }
                else {
                    $("#" + this._id + "_gridTooltip").append("<p id=\"value\" class=\"tooltipText\">" + this._getLocalizedLabels("ToolTipValue") + ": " + (tooltipval ? tooltipval : this._getLocalizedLabels("NoValue")) + "</p>");
                    $("#" + this._id + "_gridTooltip").append("<p id=\"row\" class=\"tooltipText\">" + this._getLocalizedLabels("ToolTipRow") + ": " + ((rowValue == undefined || this._rowCount == 1) ? this._getLocalizedLabels("NoValue") : rowValue) + "</p>");
                    $("#" + this._id + "_gridTooltip").append("<p id=\"column\" class=\"tooltipText\">" + this._getLocalizedLabels("ToolTipColumn") + ": " + ((columnValue == undefined || columnValue == "") ? this._getLocalizedLabels("NoValue") : columnValue) + "</p>");
                }
                var containerEndPos = 0;
                if (typeof (oclientProxy) != "undefined")
                    containerEndPos = $("#" + this._id).parent().position().left + oclientProxy.element.find(".gridContainer").width();
                else
                    containerEndPos = $("#" + this._id).parent().position().left + $("#" + this._id).parent().width();
                var tooltipEndPos = tdPos.left + $("#" + this._id + "_gridTooltip").width();
                $("#" + this._id + "_gridTooltip").css({ left: ((tdPos.left > 0 ? tdPos.left : 0) + ((containerEndPos - tooltipEndPos) < 0 ? ((containerEndPos - tooltipEndPos) - 20) : 5)), top: ($(this.element).height() - tdPos.top) < 100 ? (tdPos.top - $("#" + this._id + "_gridTooltip").outerHeight() - 2) : tdPos.top + 40 });
                if (this.model.enableToolTipAnimation)
                    $("#" + this._id + "_gridTooltip").show("fast");
                else
                    $("#" + this._id + "_gridTooltip").show();
                if (typeof (oclientProxy) != "undefined" && oclientProxy.controlPlacement() == "tile")
                    $("#" + this._id + "_gridTooltip").css("position", "absolute");
            }
        },

        _applyVScrolling: function () {           
            var _mouseWheel, isPivotClient = (typeof (oclientProxy) != "undefined" && oclientProxy.model.enableVirtualScrolling),
            oGridDiv = !isPivotClient ? $(this.element).find('.virtualScrollGrid') : oclientProxy.element.find(".e-pivotgrid"),
            ctrlObj = !isPivotClient ? this : oclientProxy,
            pGridObj = (isPivotClient && !ej.isNullOrUndefined(oclientProxy._pivotGrid)) ? oclientProxy._pivotGrid : this;
            
            if (pGridObj._seriesPageCount > 1) {
                var getMinVerticalPos = function () { return (Math.round(ctrlObj.element.find(".vScrollPanel").position().top) + 1); };
                var vScrollBar = $(ctrlObj.element).find(".vScrollPanel");
                vScrollBar.height(!isPivotClient ? $(oGridDiv).height() : parseInt(oclientProxy._gridHeight));
                vScrollBar.html(ej.buildTag("div.vScrollThumb")[0].outerHTML);
                var vScrollHandle = vScrollBar.find(".vScrollThumb");
                vScrollHandle.height(Math.max(Math.ceil((!isPivotClient ? $(oGridDiv).height() : parseInt(oclientProxy._gridHeight)) / pGridObj._seriesPageCount), 15));
                var vDragRange = vScrollBar.height() - vScrollHandle.height() - 2;
                vScrollHandle.offset({ top: getMinVerticalPos() + (pGridObj._seriesCurrentPage - 1) * (vDragRange / (pGridObj._seriesPageCount - 1)) });

                $(".vScrollPanel").on('mousewheel DOMMouseScroll', function (e) {
                  
                    $('body').on('mousewheel DOMMouseScroll', function (e) { e.preventDefault(); e.stopPropagation(); return false; });
                    initThumbPos = vScrollHandle.position().top - getMinVerticalPos(), currentPage = pGridObj._seriesCurrentPage;
                    movedDistance = (e.originalEvent.wheelDelta < 0 || e.originalEvent.detail > 0) ? e.target.offsetParent.offsetTop + 10 : -e.target.offsetParent.offsetTop - 10;
                    ctrlObj.element.find(".seriesPageIndicator").removeClass("inActive").css({ top: vScrollHandle.position().top, left: vScrollHandle.position().left + 20 });
                    var currentPage = pGridObj._seriesCurrentPage;
                    window.navigator.userAgent.indexOf('MSIE ') > -1 ? $(document).on("selectstart", function (e) { e.preventDefault(); }) : window.getSelection().removeAllRanges();
                    var topPos;
                    ((movedDistance > 0 && initThumbPos + movedDistance <= vDragRange) || (movedDistance < 0 && initThumbPos + movedDistance >= 0)) ? topPos = initThumbPos + movedDistance + getMinVerticalPos() : (initThumbPos + movedDistance > vDragRange) ? topPos = getMinVerticalPos() + vDragRange : (initThumbPos + movedDistance < 0) ? topPos = getMinVerticalPos() : "";
                    vScrollHandle.offset({ top: topPos });
                    currentPage = Math.ceil((vScrollHandle.position().top - getMinVerticalPos()) / (vDragRange / pGridObj._seriesPageCount)) == 0 ? 1 : Math.ceil((vScrollHandle.position().top - getMinVerticalPos()) / (vDragRange / pGridObj._seriesPageCount));
                    if (currentPage > pGridObj._seriesPageCount) { currentPage = pGridObj._seriesPageCount }
                    ctrlObj.element.find(".seriesPageIndicator").css({ top: vScrollHandle.position().top });
                    ctrlObj.element.find(".series_CurrentPage").html(currentPage);
                    if (currentPage != pGridObj._seriesCurrentPage) {
                        pGridObj._seriesCurrentPage = currentPage;
                        clearTimeout(_mouseWheel);
                        _mouseWheel = setTimeout(function () {
                            isPivotClient ? oclientProxy.refreshPagedPivotClient("series", pGridObj._seriesCurrentPage) :
                            pGridObj.refreshPagedPivotGrid("series", pGridObj._seriesCurrentPage);
                        }, 250);
                    }
                });

                $(vScrollHandle).on('mousedown touchstart', function (e) {                   
                    $(this).addClass("dragging");
                    var initCursorPos = e.pageY - getMinVerticalPos();
                    var initThumbPos = vScrollHandle.position().top - getMinVerticalPos();
                    ctrlObj.element.find(".seriesPageIndicator").removeClass("inActive").css({ top: vScrollHandle.position().top, left: vScrollHandle.position().left + 20 });
                    var currentPage = pGridObj._seriesCurrentPage;
                    $(document).on('mousemove touchmove', function (e) {
                        if (window.navigator.userAgent.indexOf('Trident') > -1)
                            $(document).on("selectstart", function (e) { e.preventDefault(); });
                        else
                            window.getSelection().removeAllRanges();
                        var movedDistance = (e.pageY - getMinVerticalPos()) - initCursorPos;
                        if (movedDistance > 0 && initThumbPos + movedDistance <= vDragRange)
                            vScrollHandle.offset({ top: initThumbPos + movedDistance + getMinVerticalPos() });
                        else if (movedDistance < 0 && initThumbPos + movedDistance >= 0)
                            vScrollHandle.offset({ top: initThumbPos + movedDistance + getMinVerticalPos() });
                        else if (initThumbPos + movedDistance > vDragRange)
                            vScrollHandle.offset({ top: getMinVerticalPos() + vDragRange });
                        else if (initThumbPos + movedDistance < 0)
                            vScrollHandle.offset({ top: getMinVerticalPos() });
                        currentPage = Math.floor((Math.round(vScrollHandle.position().top) - getMinVerticalPos()) / (vDragRange / pGridObj._seriesPageCount)) == 0 ? 1 : Math.floor((Math.round(vScrollHandle.position().top) - getMinVerticalPos()) / (vDragRange / pGridObj._seriesPageCount));
                        ctrlObj.element.find(".seriesPageIndicator").css({ top: vScrollHandle.position().top });
                        ctrlObj.element.find(".series_CurrentPage").html(currentPage);
                        ctrlObj.element.find(".vScrollThumb").attr("title", ctrlObj.element.find(".seriesPageIndicator").text());
                    });
                    $(document).on('mouseup touchend', function () {
                        $(document).off("selectstart");
                        $(this).off('mousemove touchmove').off('mouseup touchend');
                        $(vScrollHandle).removeClass("dragging");
                        if (currentPage != pGridObj._seriesCurrentPage) {
                            pGridObj._seriesCurrentPage = currentPage;
                            isPivotClient ? oclientProxy.refreshPagedPivotClient("series", pGridObj._seriesCurrentPage) : pGridObj.refreshPagedPivotGrid("series", pGridObj._seriesCurrentPage);
                        }
                        else
                            ctrlObj.element.find(".seriesPageIndicator").addClass("inActive");
                    });
                });
            }

            if (pGridObj._categPageCount > 1) {
                var getMinHorizontalPos = function () { return (Math.round(ctrlObj.element.find(".hScrollPanel").position().left) + 1); };
                if (this.element.parents(".e-pivotclient").length > 0 && oclientProxy.element.find(".childsplit").length > 0)
                    oclientProxy.element.find(".childsplit").data("ejSplitter").refresh();
                var hScrollBar = $(ctrlObj.element).find(".hScrollPanel");
                hScrollBar.width(!isPivotClient ? $(oGridDiv).width() : (oclientProxy.model.enableSplitter ? parseInt(oclientProxy.element.find(".controlPanelTD").width()) : parseInt(oclientProxy._gridWidth)));
                hScrollBar.html(ej.buildTag("div.hScrollThumb")[0].outerHTML);
                var hScrollHandle = hScrollBar.find(".hScrollThumb");
                hScrollHandle.width(Math.max(Math.ceil((!isPivotClient ? $(oGridDiv).width() : (oclientProxy.model.enableSplitter ? parseInt(oclientProxy.element.find(".controlPanelTD").width()) : parseInt(oclientProxy._gridWidth))) / pGridObj._categPageCount), 15));
                var hDragRange = hScrollBar.width() - hScrollHandle.width() - 2;
                if (this.model.enableRTL)
                    hScrollHandle.css({ right: ((pGridObj._categCurrentPage - 1) * (hDragRange / (pGridObj._categPageCount - 1))) });
                else
                    hScrollHandle.offset({ left: getMinHorizontalPos() + (pGridObj._categCurrentPage - 1) * (hDragRange / (pGridObj._categPageCount - 1)) });

                $(".hScrollPanel").on('mousewheel DOMMouseScroll', function (e) {
                    $('body').on('mousewheel DOMMouseScroll', function (e) { e.preventDefault(); e.stopPropagation(); return false; });
                    initThumbPos = ctrlObj.model.enableRTL ? ctrlObj.element.find(".hScrollPanel").width() - ((hScrollHandle.position().left + 16) - getMinHorizontalPos()) : hScrollHandle.position().left - getMinHorizontalPos(), currentPage = pGridObj._categCurrentPage;
                    movedDistance = (e.originalEvent.wheelDelta < 0 || e.originalEvent.detail > 0) ? (isPivotClient ? e.target.offsetParent.children[1].offsetLeft + 10 : e.target.offsetParent.offsetLeft + 10) : (isPivotClient ? -e.target.offsetParent.children[1].offsetLeft - 10 : -e.target.offsetParent.offsetLeft - 10);
                    movedDistance = ctrlObj.model.enableRTL ? -movedDistance : movedDistance;
                    ctrlObj.element.find(".categPageIndicator").removeClass("inActive").css({ left: hScrollHandle.position().left, top: hScrollHandle.position().top + 20 });
                    window.navigator.userAgent.indexOf('MSIE ') > -1 ? $(document).on("selectstart", function (e) { e.preventDefault(); }) : window.getSelection().removeAllRanges();
                    var leftPos;
                    ctrlObj.model.enableRTL ? (((movedDistance > 0 && initThumbPos + movedDistance <= hDragRange) || (movedDistance < 0 && initThumbPos + movedDistance >= 0)) ? leftPos = initThumbPos + movedDistance : (initThumbPos + movedDistance > hDragRange) ? leftPos = hDragRange : (initThumbPos + movedDistance < 0) ? leftPos = 0 : "") : (((movedDistance > 0 && initThumbPos + movedDistance <= hDragRange) || (movedDistance < 0 && initThumbPos + movedDistance >= 0)) ? leftPos = initThumbPos + movedDistance + getMinHorizontalPos() : (initThumbPos + movedDistance > hDragRange) ? leftPos = getMinHorizontalPos() + hDragRange : (initThumbPos + movedDistance < 0) ? leftPos = getMinHorizontalPos() : "");
                    ctrlObj.model.enableRTL ? hScrollHandle.css("right", leftPos) : hScrollHandle.offset({ left: leftPos });
                    currentPage = ctrlObj.model.enableRTL ? (Math.floor((ctrlObj.element.find(".hScrollPanel").width() - ((hScrollHandle.position().left + 16) - getMinHorizontalPos())) / (hDragRange / pGridObj._categPageCount)) == 0 ? 1 : Math.floor((ctrlObj.element.find(".hScrollPanel").width() - ((hScrollHandle.position().left + 16) - getMinHorizontalPos())) / (hDragRange / pGridObj._categPageCount))) : (Math.floor((Math.round(hScrollHandle.position().left) - getMinHorizontalPos()) / (hDragRange / pGridObj._categPageCount)) == 0 ? 1 : Math.floor((Math.round(hScrollHandle.position().left) - getMinHorizontalPos()) / (hDragRange / pGridObj._categPageCount)));
                    currentPage = currentPage > pGridObj._categPageCount ? pGridObj._categPageCount : (currentPage < 1 ? 1 : currentPage);
                    ctrlObj.element.find(".categPageIndicator").css({ left: hScrollHandle.position().left });
                    ctrlObj.element.find(".categ_CurrentPage").html(currentPage);
                    if (currentPage != pGridObj._categCurrentPage) {
                        pGridObj._categCurrentPage = currentPage;
                        clearTimeout(_mouseWheel);
                        _mouseWheel = setTimeout(function () {
                            isPivotClient ? oclientProxy.refreshPagedPivotClient("categ", pGridObj._categCurrentPage) :
                            pGridObj.refreshPagedPivotGrid("categ", pGridObj._categCurrentPage);
                        }, 250);
                    }
                });

                $(hScrollHandle).on('mousedown touchstart', function (e) {
                    $(this).addClass("dragging");
                    var initCursorPos = ctrlObj.model.enableRTL ? ctrlObj.element.find(".hScrollPanel").width() - (e.pageX - getMinHorizontalPos()) : e.pageX - getMinHorizontalPos();
                    var initThumbPos = ctrlObj.model.enableRTL ? ctrlObj.element.find(".hScrollPanel").width() - ((hScrollHandle.position().left + 16) - getMinHorizontalPos()) : hScrollHandle.position().left - getMinHorizontalPos();
                    ctrlObj.element.find(".categPageIndicator").removeClass("inActive").css({ left: hScrollHandle.position().left, top: hScrollHandle.position().top + 20 });
                    var currentPage = pGridObj._categCurrentPage;
                    $(document).on('mousemove touchmove', function (e) {
                        if (window.navigator.userAgent.indexOf('Trident') > -1)
                            $(document).on("selectstart", function (e) { e.preventDefault(); });
                        else
                            window.getSelection().removeAllRanges();
                        var movedDistance = ctrlObj.model.enableRTL ? (ctrlObj.element.find(".hScrollPanel").width() - (e.pageX - getMinHorizontalPos())) - initCursorPos : (e.pageX - getMinHorizontalPos()) - initCursorPos;
                        if (movedDistance > 0 && initThumbPos + movedDistance <= hDragRange)
                            ctrlObj.model.enableRTL ? hScrollHandle.css({ right: (initThumbPos + movedDistance) }) : hScrollHandle.offset({ left: initThumbPos + movedDistance + getMinHorizontalPos() });
                        else if (movedDistance < 0 && initThumbPos + movedDistance >= 0)
                            ctrlObj.model.enableRTL ? hScrollHandle.css({ right: (initThumbPos + movedDistance) }) : hScrollHandle.offset({ left: initThumbPos + movedDistance + getMinHorizontalPos() });
                        else if (initThumbPos + movedDistance > hDragRange)
                            ctrlObj.model.enableRTL ? hScrollHandle.css({ right: (hDragRange) }) : hScrollHandle.offset({ left: getMinHorizontalPos() + hDragRange });
                        else if (initThumbPos + movedDistance < 0)
                            ctrlObj.model.enableRTL ? hScrollHandle.css({ right: "0px" }) : hScrollHandle.offset({ left: getMinHorizontalPos() });
                        currentPage = ctrlObj.model.enableRTL ? (Math.floor((ctrlObj.element.find(".hScrollPanel").width() - ((hScrollHandle.position().left + 16) - getMinHorizontalPos())) / (hDragRange / pGridObj._categPageCount)) == 0 ? 1 : Math.floor((ctrlObj.element.find(".hScrollPanel").width() - ((hScrollHandle.position().left + 16) - getMinHorizontalPos())) / (hDragRange / pGridObj._categPageCount))) : (Math.floor((Math.round(hScrollHandle.position().left) - getMinHorizontalPos()) / (hDragRange / pGridObj._categPageCount)) == 0 ? 1 : Math.floor((Math.round(hScrollHandle.position().left) - getMinHorizontalPos()) / (hDragRange / pGridObj._categPageCount)));
                        currentPage = currentPage > pGridObj._categPageCount ? pGridObj._categPageCount : (currentPage < 1 ? 1 : currentPage);
                        ctrlObj.element.find(".categPageIndicator").css({ left: hScrollHandle.position().left });
                        ctrlObj.element.find(".categ_CurrentPage").html(currentPage);
                        ctrlObj.element.find(".hScrollThumb").attr("title", ctrlObj.element.find(".categPageIndicator").text());
                    });
                    $(document).on('mouseup touchend', function () {
                        $(document).off("selectstart");
                        $(this).off('mousemove touchmove').off('mouseup touchend');
                        $(hScrollHandle).removeClass("dragging");
                        if (currentPage != pGridObj._categCurrentPage) {
                            pGridObj._categCurrentPage = currentPage;
                            isPivotClient ? oclientProxy.refreshPagedPivotClient("categ", pGridObj._categCurrentPage) :
                            pGridObj.refreshPagedPivotGrid("categ", pGridObj._categCurrentPage);
                        }
                        else
                            ctrlObj.element.find(".categPageIndicator").addClass("inActive");
                    });
                });
            }
            $('body').off('mousewheel DOMMouseScroll');
        },

        _getLocalizedLabels: function (property) {
            return ej.PivotGrid.Locale[this.locale()][property] === undefined ? ej.PivotGrid.Locale["en-US"][property] : ej.PivotGrid.Locale[this.locale()][property];
        },

        _drillDown: function (e) {
            this._drillCaption = $(e.target).parent().find(".cellValue").text();
            var targetClass = e.target.className;
            this._startDrilldown = true;
            targetClass = targetClass.split(" ");
            if ($(e.target).hasClass("expand"))
                this._drillAction = "drilldown";
            else if ($(e.target).hasClass("collapse"))
                this._drillAction = "drillup";
            var axis = $($(e.target).parent()).hasClass("rowheader") || $($(e.target).parent()).attr("role") == "rowheader" ? "rowheader" : "colheader";
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode== ej.Pivot.OperationalMode.ClientMode) {
                //this._waitingPopup = this.element.data("ejWaitingPopup");
                this._waitingPopup.show();
                var cPos = $(e.target).parent().attr("p");
                var memberInfo = this.getJSONRecords()[parseInt((parseInt(cPos.split(",")[0]) * this._rowCount) + parseInt(cPos.split(",")[1]))].Info, drilledMember;

                var uniqName = memberInfo.replace(/&/g, "&amp;");
                // drilledMember = this._getDrilledMemeber(uniqName, axis);                
                
                var colPos = parseInt(cPos.split(',')[0]), rowPos = parseInt(cPos.split(',')[1]);
                while (colPos > 0) {
                    colPos--;
                    var tempCellInfo = this.getJSONRecords()[(colPos * this._rowCount) + rowPos].Info;
                    while (tempCellInfo == "" && rowPos > 0) {
                        rowPos--;
                        tempCellInfo = this.getJSONRecords()[(colPos * this._rowCount) + rowPos].Info;
                    }
                    memberInfo = tempCellInfo + ">#>" + memberInfo;
                }

                var currentObj;
                if (this.element.parents(".e-pivotclient").length > 0 ) {
                    currentObj = this.element.parents(".e-pivotclient").data("ejPivotClient");                    
                    if (axis == "rowheader" && currentObj.displayMode() != ej.PivotClient.DisplayMode.GridOnly) {
                        currentObj._drillInfo = memberInfo;
                        currentObj.setChartDrillParams(memberInfo, this._drillAction);
                    }
                }
                else
                    currentObj = this;
                currentObj["_pivotRecords"] = { records: this.getJSONRecords(), rowCount: this._rowCount };

                if ($(e.target).hasClass("collapse")) {
                    this.updateDrilledReport({ uniqueName: uniqName, index: cPos, action: "collapse" }, axis, currentObj);
                }
                else {
                    this.updateDrilledReport({ uniqueName: uniqName, index: cPos }, axis, currentObj);
                }
                return false;
            }
            this.element.find(".e-dialog").remove();
            if (!this.model.enableDeferUpdate) {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                    this._off(this.element, "click", ".expand, .collapse");
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                    this.element.find(".colheader, .rowheader, .value").removeClass("e-droppable");
                var targetClass = e.target.className;
                this._startDrilldown = true;
                targetClass = targetClass.split(" ");
                if (targetClass[0] == "expand")
                    this._drillAction = "drilldown";
                else if (targetClass[0] == "collapse")
                    this._drillAction = "drillup";

                if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._trigger("beforeServiceInvoke", { action: "drillDown", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                var cellPos = $(e.target).parent().attr("p");
                this._drillCaption = $(e.target).parent().find(".cellValue").text();

                if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null) {
                    if ($("#" + oclientProxy._id + "_maxView")[0]) {
                        $("#" + oclientProxy._id + "_maxView").ejWaitingPopup({ showOnInit: true });
                        this._maxViewLoading = $("#" + oclientProxy._id + "_maxView").data("ejWaitingPopup");
                    }
                    else
                        oclientWaitingPopup.show();
                }
                else {
                    this._waitingPopup.show();
                }
                var headerInfo = this.model.analysisMode == "relational" ? this._drillHeaders.join("||") : this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + parseInt(cellPos.split(",")[1]))].Info;
                var report;
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }

                if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode || this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    var pGridTb = this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders ? $(this.element).find("pivotGridTable") : $(this.element).find("table").detach();
                    var field = this._getFieldName($(e.target).parent()[0]);
                    if ($(e.target).hasClass("collapse")) {
                        if (ej.isNullOrUndefined(this.model.collapsedMembers)) this.model.collapsedMembers = {};
                        ej.isNullOrUndefined(this.model.collapsedMembers[field]) ? this.model.collapsedMembers[field] = [$(e.target).parent()[0].textContent] : this.model.collapsedMembers[field].push($($(e.target).parent()[0]).clone().children().remove().end().text());
                    }
                    else if ($(e.target).hasClass("expand"))
                        this.model.collapsedMembers[field] = $.grep(this.model.collapsedMembers[field], function (item) { return item != $(e.target).parent()[0].textContent });
                    var drilledCellType = $($(e.target).parent()).hasClass("rowheader") || $($(e.target).parent()).attr("role") == "rowheader" ? "rowheader" : $($(e.target).parent()).hasClass("colheader") || $($(e.target).parent()).attr("role") == "columnheader" ? "columnheader" : "";
                    this._collapseMember(pGridTb, e.target);
                    this.element.append(pGridTb);
                    if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                        this._applyFrozenHeaderWidth(this._JSONRecords, this._drillAction);
                    this._hideGrandTotal(pGridTb);
                    if (this.model.enableGroupingBar) {
                        tableWidth = $("#" + this._id).find(".pivotGridTable").width();
                        this.element.find(".groupingBarPivot .drag").width(tableWidth - 5);
                        cellWidth = $("#" + this._id).find(".pivotGridTable").find("th").width();
                        this.element.find(".groupingBarPivot .values").width(cellWidth - 2);
                        this.element.find(".groupingBarPivot .columns").width(tableWidth - cellWidth);
                        this.element.find(".groupingBarPivot .valueColumn").width(tableWidth);
                    }
                    this.element.find(".colheader, .rowheader, .value").addClass("e-droppable");
                    this._waitingPopup.hide();
                    var eventArgs = e;
                    var colPos = parseInt(cellPos.split(',')[0]), rowPos = parseInt(cellPos.split(',')[1]);
                    var memberInfo = this._drillCaption;
                    if (drilledCellType == "rowheader") {
                        while (colPos > 0) {
                            colPos--;
                            var tempCellInfo = this.getJSONRecords()[this._rowCount * colPos + rowPos].Value;
                            while (tempCellInfo == "" && rowPos > 0) {
                                rowPos--;
                                tempCellInfo = this.getJSONRecords()[this._rowCount * colPos + rowPos].Value;
                            }
                            memberInfo = tempCellInfo + ">#>" + memberInfo;
                        }
                    }
                    this._trigger("drillSuccess", { gridObj: this, drillAction: this._drillAction, drilledMember: memberInfo, fieldName: field, axis: axis, cellPosition: cellPos });
                    if (this.model.enableGroupingBar)
                        this._createFields("drilldown", $("#" + this._id).find(".pivotGridTable").width(), $("#" + this._id).find(".pivotGridTable th").outerWidth());
                    this._unWireEvents();
                    this._wireEvents();
                    this._drillAction = "";
                }
                else {
                    if (this.layout() != "" || this.layout() != "normal") {
                        if (typeof (oclientProxy) != "undefined")
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillDownGrid", "cellPosition": cellPos, "currentReport": report, "clientReports": oclientProxy.reports, "headerInfo": headerInfo, "layout": this.layout(), "customObject": serializedCustomObject }), this._drillDownSuccess);
                        else
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillDownGrid", "cellPosition": cellPos, "currentReport": report, "headerInfo": headerInfo, "layout": this.layout(), "customObject": serializedCustomObject }), this._drillDownSuccess);
                    }
                    else {
                        if (typeof (oclientProxy) != "undefined")
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillDownGrid", "cellPosition": cellPos, "currentReport": report, "clientReports": oclientProxy.reports, "headerInfo": headerInfo, "customObject": serializedCustomObject }), this._drillDownSuccess);
                        else
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillDown, JSON.stringify({ "action": "drillDownGrid", "cellPosition": cellPos, "currentReport": report, "headerInfo": headerInfo, "customObject": serializedCustomObject }), this._drillDownSuccess);
                    }
                }
            }
        },

        _collapseMember: function (pGridTb, targetCell) {
            var clickedTh = $(targetCell).parent()[0];
            var positionTh = $(clickedTh).attr("p");            
            var rowSpan = $(targetCell).attr("tag") != undefined ? (parseInt($(targetCell).attr("tag")) + clickedTh.rowSpan) : clickedTh.rowSpan;
            var colsSpan = $(targetCell).attr("tag") != undefined ? (parseInt($(targetCell).attr("tag")) + clickedTh.colSpan) : clickedTh.colSpan;
            var row = $(targetCell).closest("tr")[0];
            var nextRow = null, prevRow = null, isTdFRow = "false", hiddenRCnt = 0;

            if (clickedTh.className.indexOf("rowheader") >= 0 || (clickedTh.className.indexOf("summary") >= 0 && $(clickedTh).attr("role") == "rowheader")) {
                if (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout) {
                    var indexRow = this.getJSONRecords()[1].Index == "0,0" ? 1 : 0;
                    var rowSpan = this.getJSONRecords()[(parseInt(positionTh.split(',')[0]) * this._rowCount + (parseInt(positionTh.split(',')[1]))) + indexRow].RowSpan;
                    var drillCell = row;
                    if ($(targetCell).attr("class").indexOf("expand") > -1)
                        $(row).removeAttr("tag");
                    for (var rCount = 0; rCount < rowSpan; rCount++) {
                        if ($(targetCell).attr("class").indexOf("collapse") > -1) {
                            if ($($(row).next()).attr("tag") == undefined)
                                $($(row).next()).attr("tag", positionTh);
                            $($(row).next()).css("display", "none");
                            if (this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenHeaders) {
                                this.element.find(".valueCell td[i$='," + $($(row).next()).find("td").attr('i').split(',')[1] + "']").css("display", "none");
                            }
                        }
                        if ($(targetCell).attr("class").indexOf("expand") > -1) {
                            if ($($(row).next()).attr("tag") == undefined || $($(row).next()).attr("tag") == positionTh) {
                                $($(row).next()).css("display", "table-row");
                                $($(row).next()).removeAttr("tag");
                                if ( this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenHeaders) {
                                    this.element.find(".valueCell td[i$='," + $($(row).next()).find("td").attr('i').split(',')[1] + "']").css("display", "");
                                }
                            }
                        }
                        row = $(row).next();
                    }
                    var tableTag = (this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenHeaders) ? "td" : "th";
                    var level = $(drillCell).find(tableTag+" span:not(.cellValue)").css("margin-left")
                    $(drillCell).find(tableTag+" span:not(.cellValue)").remove();
                    $(drillCell).find(tableTag).prepend($(targetCell).attr("class").indexOf("collapse") > -1 ? "<span style=\"margin-left:" + level + "\" class=\"expand\ e-icon\" aria-describedby='expansion' title=\"" + this._getLocalizedLabels("Expand") + "\">&nbsp;<p id='expansion' style='display:none'>collapsed</p></span>" : "<span style=\"margin-left:" + level + "\" class=\"collapse\ e-icon\" aria-describedby='collapsing' title=\"" + this._getLocalizedLabels("Collapse") + "\">&nbsp;<p id='collapsing' style='display:none'>expanded</p></span>");
                    return;
                }
                var isTdSameRow = !$(clickedTh).index() > 0;
                var isHide = isLeafHide = false;
                var subNode = true;
                if ($(targetCell).attr("class").indexOf("collapse") > -1) {
                    for (var rCount = 0; rCount < rowSpan; rCount++) {
                        nextRow = $(row).next();
                        if (isTdSameRow) {
                            if ($(row).find(".stot,.rstot").length >= 1)
                                if (rCount == 1 && $($(row).find(".stot,.rstot")).find(".expand").length >= 1)
                                    isLeafHide = true;
                            if ($($(row).find(".stot,.rstot")).find(".expand").length >= 1 || $(row).css('display') == 'none')
                                isHide = true;
                            $(row).css("display", "none");
                            if (this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenHeaders) {
                                this.element.find(".valueCell td[p$='," + $(row).find("td").attr('p').split(',')[1] + "']").css("display", "none");
                                this.element.find(".valueCell td[p$='," + $(row).find("td").attr('p').split(',')[1] + "']").attr("tag", $(row).attr("tag") != undefined ? parseInt($(row).attr("tag")) + 1 : 1);
                            }
                            $(row).attr("tag", $(row).attr("tag") != undefined ? parseInt($(row).attr("tag")) + 1 : 1);
                        }
                        else {
                            var nextTd = clickedTh;
                            for (tdCnt = 0; tdCnt <= $(clickedTh).nextAll().length; tdCnt++) {
                                $(nextTd).css("display", "none").attr("hc", $(nextTd).attr("hc") == undefined ? 1 : parseInt($(nextTd).attr("hc")) + 1);
                                nextTd = $(nextTd).next();
                            }
                            isTdSubSameRow = false;
                            isTdFRow = "true";
                        }
                        row = nextRow;
                        isTdSameRow = true;
                    }
                    var subractRSpan = isTdFRow == "true" ? (clickedTh.rowSpan - 1) : clickedTh.rowSpan;
                    var rowSubSpan;
                    if ($(row).css('display') != 'none' && isLeafHide)
                        rowSubSpan = $(targetCell).attr("subTag") != undefined ? parseInt($(targetCell).attr("subTag")) == -1 ? clickedTh.rowSpan + 1 : (parseInt($(targetCell).attr("subTag")) + clickedTh.rowSpan) : clickedTh.rowSpan;
                    if ($(row).css('display') == 'none') {
                        $(row).css("display", "");
                            isHide = true;
                        subractRSpan = subractRSpan - 1;
                    }
                    if (isHide && ej.isNullOrUndefined(rowSubSpan))
                        rowSubSpan = $(targetCell).attr("subTag") != undefined ? parseInt($(targetCell).attr("subTag")) == -1 ? clickedTh.rowSpan : (parseInt($(targetCell).attr("subTag")) + clickedTh.rowSpan) : clickedTh.rowSpan;
                    if ((this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders) && this.element.find(".valueCell").length > 0) {
                        $(row).find("td").text($(row).find("td").text().replace(" Total", ""));
                        $(row).find("td span:not(.cellValue)").remove();
                        $(row).find("td").prepend("<span class=\"expand\ e-icon\" title=\"" + this._getLocalizedLabels("Expand") + "\" tag=\"" + rowSpan + ":" + isTdFRow + "\">&nbsp;</span>");
                    }
                    else {
                        $(row).find("th").text($(row).find("th").text().replace(" Total", ""));
                        $(row).find("th span:not(.cellValue)").remove();
                        $(row).find("th").prepend("<span class=\"expand\ e-icon\" title=\"" + this._getLocalizedLabels("Expand") + "\" tag=\"" + rowSpan + ":" + isTdFRow + ((!ej.isNullOrUndefined(rowSubSpan)) ? ($(targetCell).attr("isChildSubNode") == "true") ? "\" subTag=\"" + rowSubSpan + ":" + isTdFRow + "\" isChildSubNode=\"" + subNode : "\" subTag=\"" + rowSubSpan + ":" + isTdFRow : "") + "\">&nbsp;</span>");
                    }
                    var prevThRowSpan = $(row).prevAll().find("th:has(span):not(.summary)");
                    for (var rCount = 0; rCount < prevThRowSpan.length; rCount++) {
                        if (parseInt($(prevThRowSpan[rCount]).attr("p").split(",")[0]) < parseInt(positionTh.split(",")[0]) && (parseInt($(prevThRowSpan[rCount]).attr("p").split(",")[1]) + prevThRowSpan[rCount].rowSpan + ($(prevThRowSpan[rCount]).find("span").attr("tag") != undefined ? parseInt($(prevThRowSpan[rCount]).find("span").attr("tag")) : 0)) >= (parseInt(positionTh.split(",")[1]) + rowSpan)) {
                            prevThRowSpan[rCount].rowSpan -= subractRSpan;
                            if ($(prevThRowSpan[rCount]).find("span").attr("tag") == undefined)
                                $(prevThRowSpan[rCount]).find("span").attr("isChildSubNode", true);
                            $(prevThRowSpan[rCount]).find("span").attr("tag", $(prevThRowSpan[rCount]).find("span").attr("tag") != undefined ? (parseInt($(prevThRowSpan[rCount]).find("span").attr("tag")) + (subractRSpan)) : subractRSpan);
                            $(prevThRowSpan[rCount]).find("span").attr("subTag", $(prevThRowSpan[rCount]).find("span").attr("subTag") != undefined ? (parseInt($(prevThRowSpan[rCount]).find("span").attr("subTag")) + (subractRSpan)) : subractRSpan);
                        }
                    }
                }
                else if ($(targetCell).attr("class").indexOf("expand") > -1) {
                    var removeSpan = removeSubSpan = this._isSubTotalhidden = false;
                    var loop = 0;
                    for (var rCount = parseInt($(targetCell).attr("tag").split(":")[0]) ; rCount >= 0 ; rCount--) {
                        prevRow = $(row).prev();
                        if ($(row).attr("tag") == undefined || parseInt($(row).attr("tag")) <= 1) {
                            this._hideSubTotal($(row), loop, $(targetCell))
                            if (this._isSubTotalHide) {
                                removeSpan = true;
                                this._isSubTotalHide = false;
                                $(row).css("display", "none");;
                            }
                            else {
                                $(row).css("display", "table-row");
                                if (this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders || this.model.frozenHeaderSettings.enableFrozenHeaders) {
                                    this.element.find(".valueCell td[p$='," + $(row).find("td").attr('p').split(',')[1] + "']").css("display", "");
                                }
                            }
                        }
                        else
                            hiddenRCnt++;
                        loop = loop == 0 ? 1 : loop;
                        if ($(row).attr("tag") != undefined) {
                            if ((parseInt($(row).attr("tag") - 1)) == 0)
                                $(row).removeAttr("tag");
                            else
                                $(row).attr("tag", parseInt($(row).attr("tag")) - 1);
                        }
                        row = prevRow;
                    }
                    if ($(targetCell).attr("tag").split(":")[1] == "true") {
                        var nextTd = $(pGridTb).find("th[p='" + parseInt($(clickedTh).attr("p").split(",")[0]) + "," + (parseInt($(clickedTh).attr("p").split(",")[1]) - parseInt($(targetCell).attr("tag").split(":")[0])) + "']"), ttCnt = $(nextTd).nextAll().length;
                        for (tdCnt = 0; tdCnt <= ttCnt; tdCnt++) {
                            if ($(nextTd).attr("hc") == undefined || parseInt($(nextTd).attr("hc")) <= 1) {
                                $(nextTd).removeAttr("hc");
                                if ($(nextTd).attr("ch") == undefined)
                                    $(nextTd).css("display", "");
                            }
                            else
                                $(nextTd).attr("hc", (parseInt($(nextTd).attr("hc")) - 1));
                            nextTd = $(nextTd).next();
                        }
                    }
                    var prevThRowSpan = $($(targetCell).closest("tr")[0]).prevAll().find("th:has(span):not(.summary)");
                    var rSpnCnt;
                    if ($(targetCell).attr("subTag") != undefined && removeSpan)
                        rSpnCnt = ($(targetCell).attr("subTag").split(":")[1] == "true" ? (parseInt($(targetCell).attr("subTag").split(":")[0]) - 1) : parseInt($(targetCell).attr("subTag").split(":")[0]));
                    else
                        rSpnCnt = ($(targetCell).attr("tag").split(":")[1] == "true" ? (parseInt($(targetCell).attr("tag").split(":")[0]) - 1) : parseInt($(targetCell).attr("tag").split(":")[0])) - hiddenRCnt;
                    if (removeSpan)
                        rSpnCnt = $(targetCell).attr("subTag") != undefined ? parseInt($(targetCell).attr("subTag").split(":")[0]) == -1 ? rSpnCnt : rSpnCnt - 1 : rSpnCnt - 1;
                    for (var rCount = 0; rCount < prevThRowSpan.length; rCount++) {
                        if (parseInt($(prevThRowSpan[rCount]).attr("p").split(",")[0]) < parseInt(positionTh.split(",")[0]) && (parseInt($(prevThRowSpan[rCount]).attr("p").split(",")[1]) + prevThRowSpan[rCount].rowSpan + ($(prevThRowSpan[rCount]).find("span").attr("tag") != undefined ? parseInt($(prevThRowSpan[rCount]).find("span").attr("tag")) : 0)) >= (parseInt(positionTh.split(",")[1]))) {
                            if (removeSpan) {
                                removeSpan = false;
                                rSpnCnt = $($(prevThRowSpan[rCount]).find("span")[0]).attr("subTag") != undefined ? parseInt($($(prevThRowSpan[rCount]).find("span")[0]).attr("subTag").split(":")[0]) <= rSpnCnt ? rSpnCnt : rSpnCnt + 1 : rSpnCnt;
                                if ($(targetCell).attr("isChildSubNode") == "true") {
                                    rSpnCnt = rSpnCnt - hiddenRCnt;
                                    $(targetCell).removeAttr("isChildSubNode");
                                }
                            }
                            prevThRowSpan[rCount].rowSpan += rSpnCnt;
                            if ($(prevThRowSpan[rCount]).find("span").attr("tag") != undefined)
                                $(prevThRowSpan[rCount]).find("span").attr("tag", (parseInt($(prevThRowSpan[rCount]).find("span").attr("tag")) - rSpnCnt));
                            if (parseInt($(prevThRowSpan[rCount]).find("span").attr("tag")) == 0)
                                $(prevThRowSpan[rCount]).find("span").removeAttr("tag");
                            if ($(prevThRowSpan[rCount]).find("span").attr("subTag") != undefined)
                                $(prevThRowSpan[rCount]).find("span").attr("subTag", (parseInt($(prevThRowSpan[rCount]).find("span").attr("subTag")) - rSpnCnt));
                            if (parseInt($(prevThRowSpan[rCount]).find("span").attr("subTag")) == 0)
                                $(prevThRowSpan[rCount]).find("span").removeAttr("subTag");
                        }
                    }
                    if ($(clickedTh).find(".cellValue").length>0)
                        $(clickedTh).find(".cellValue").text($.trim($(clickedTh).find(".cellValue").text()) + " Total");
                    else
                        $(clickedTh).text($.trim($(clickedTh).text()) + " Total");
                    $(clickedTh).find(".expand").remove();
                    $(clickedTh).prepend("<span style='margin-left:10px'></span>");
                }
            }
            if (clickedTh.className.indexOf("colheader") >= 0 || (clickedTh.className.indexOf("summary") >= 0 && $(clickedTh).attr("role") == "columnheader")) {
                var tdPosVal = parseInt(positionTh.split(",")[0]), tbRows = $(pGridTb).find("tr");
                if ($(targetCell).attr("class").indexOf("collapse") > -1) {
                    var span = clickedTh.colSpan;
                    if ($(clickedTh).next().css('display') == 'none') {
                        var positionSubTh = $(clickedTh).next().attr("p"), tdSubPosVal = parseInt(positionSubTh.split(",")[0]), tbSubRows = $(pGridTb).find("tr"), colsSpanSub = parseInt($(clickedTh).next().attr("colspan"));
                        if ($(clickedTh).next().attr("class").indexOf("stot","cstot") > -1) {
                            for (var cCount = 0; cCount < colsSpanSub; cCount++) {
                                var thList = $(row).nextAll().find("th[p^='" + (cCount + tdSubPosVal) + ",']");
                                for (var thCnt = 0; thCnt < $(thList).length; thCnt++) {
                                    $(thList[thCnt]).css("display", "");;
                                }
                                if ($(thList[thCnt]).attr("hc") == undefined || parseInt($(thList[thCnt]).attr("hc")) < 1) {
                                    $(pGridTb).find("td[p^='" + (cCount + tdSubPosVal) + ",']").css("display", "");;
                                    for (var i = 0; i < $(pGridTb).find("td[p^='" + (cCount + tdSubPosVal) + ",']").length; i++) {
                                        if ($($(pGridTb).find("td[p^='" + (cCount + tdSubPosVal) + ",']")[i]).attr("hc") != undefined || $($(pGridTb).find("td[p^='" + (cCount + tdSubPosVal) + ",']")[i]).attr("hc") > -1)
                                            $($(pGridTb).find("td[p^='" + (cCount + tdSubPosVal) + ",']")[i]).css('display', 'none');
                                    }
                                }
                            }
                        }
                        $(clickedTh).next().css("display", "");;
                        span = clickedTh.colSpan - colsSpanSub;
                    }
                    for (var cCount = 0; cCount < colsSpan; cCount++) {
                        var thList = this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders ? $(row).nextAll().find("td[p^='" + (cCount + tdPosVal) + ",']") : $(row).nextAll().find("th[p^='" + (cCount + tdPosVal) + ",']");
                        for (var thCnt = 0; thCnt < $(thList).length; thCnt++) {
                            $(thList[thCnt]).attr("hc", $(thList[thCnt]).attr("hc") != undefined ? parseInt($(thList[thCnt]).attr("hc")) + 1 : 1).css("display", "none");
                        }
                        if ($(thList[thCnt]).attr("hc") == undefined || parseInt($(thList[thCnt]).attr("hc")) < 1) {
                            if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders) {
                                this.element.find(".valueCell").find("td[p^='" + (cCount + tdPosVal) + ",']").css("display", "none");
                                this.element.find(".valueCell").find("td[p^='0,']:not(.summary)").parent().find("td[p^='" + (cCount + tdPosVal) + ",']").attr("ch", 1)
                            }
                            else {
                                $(pGridTb).find("td[p^='" + (cCount + tdPosVal) + ",']").css("display", "none");
                                $(pGridTb).find("th[p^='0,']:not(.summary)").parent().find("td[p^='" + (cCount + tdPosVal) + ",']").attr("ch", 1);
                            }
                        }
                    }
                    $(clickedTh).attr("hc", 1).css("display", "none");
                    $(clickedTh).next().text($(clickedTh).next().text().replace(" Total", ""));
                    $(clickedTh).next().find("span:not(.cellValue)").remove();
                    $(clickedTh).next().prepend("<span class=\"expand\ e-icon\" title=\"" + this._getLocalizedLabels("Expand") + "\" tag=\"" + colsSpan + "\">&nbsp;</span>");
                    var prevThColSpan = $(row).prevAll().find("th:has(span):not(.summary)");
                    for (var cCount = 0; cCount < prevThColSpan.length; cCount++) {
                        if ((parseInt($(prevThColSpan[cCount]).attr("p").split(",")[1]) < parseInt(positionTh.split(",")[1]) && parseInt($(prevThColSpan[cCount]).attr("p").split(",")[0]) <= parseInt(positionTh.split(",")[0])) && (parseInt($(prevThColSpan[cCount]).attr("p").split(",")[0]) + prevThColSpan[cCount].colSpan + ($(prevThColSpan[cCount]).find("span").attr("tag") != undefined ? parseInt($(prevThColSpan[cCount]).find("span").attr("tag")) : 0)) >= (parseInt(positionTh.split(",")[0]) + colsSpan)) {
                            prevThColSpan[cCount].colSpan -= span;
                            $(prevThColSpan[cCount]).find("span").attr("tag", $(prevThColSpan[cCount]).find("span").attr("tag") != undefined ? (parseInt($(prevThColSpan[cCount]).find("span").attr("tag")) + (span)) : span);
                        }
                    }
                }
                else if ($(targetCell).attr("class").indexOf("expand") > -1) {
                    var hdnCCount = 0;
                    var removeSpan = removeCell = this._isSubTotalhidden = false;
                    var loop = 0;
                    var colsSpanSub = parseInt($(clickedTh).attr("colspan"));
                    this._hideSubTotal($(row), loop, $(targetCell))
                    if (this._isSubTotalHide) {
                        removeCell = removeSpan = true;
                        this._isSubTotalHide = false;
                        var positionSubTh = $(clickedTh).attr("p"), tdSubPosVal = parseInt(positionSubTh.split(",")[0]), tbSubRows = $(pGridTb).find("tr");
                        if ($(clickedTh).attr("class").indexOf("stot","cstot") > -1) {
                            for (var cCount = 0; cCount < colsSpanSub; cCount++) {
                                var thSubList = $(row).nextAll().find("th[p^='" + (cCount + tdSubPosVal) + ",']");
                                for (var thCnt = 0; thCnt < $(thSubList).length; thCnt++) {
                                    $(thSubList[thCnt]).css('display', 'none');
                                }
                                if ($(thSubList[thCnt]).attr("hc") == undefined || parseInt($(thSubList[thCnt]).attr("hc")) < 1) {
                                    $(pGridTb).find("td[p^='" + (cCount + tdSubPosVal) + ",']").css('display', 'none');
                                }
                            }
                        }
                        $(clickedTh).css('display', 'none');
                    }
                    var span = colsSpan - (colsSpanSub - 1);
                    for (var cCount = 1; cCount < span; cCount++) {
                        var thList = this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders ? $(row).nextAll().find("td[p^='" + (tdPosVal - cCount) + ",']") : $(row).nextAll().find("th[p^='" + (tdPosVal - cCount) + ",']");
                        for (var thCnt = 0; thCnt < $(thList).length; thCnt++) {
                            removeCell = false;
                            for (var k = 0; k < $(thList[thCnt]).length; k++) {
                                if (($($(thList[thCnt])[k]).hasClass("stot") || $($(thList[thCnt])[k]).hasClass("cstot")) && !$($(thList[thCnt])[k]).hasClass("calc"))
                                    this._hideSubTotal($($(thList[thCnt])[k]), loop, $(targetCell))
                            }
                            if (this._isSubTotalHide) {
                                removeCell = true;
                                this._isSubTotalHide = false;
                                var positionSubTh = $(thList[thCnt]).attr("p"), tdSubPosVal = parseInt(positionSubTh.split(",")[0]), tbSubRows = $(pGridTb).find("tr"), colsSpanSub = parseInt($(thList[thCnt]).attr("colspan"));
                                if ($(thList[thCnt]).attr("class").indexOf("stot","cstot") > -1 && !($(thList[thCnt]).find(".expand").length > 0)) {
                                    for (var cSubCount = 0; cSubCount < colsSpanSub; cSubCount++) {
                                        var thSubList = $(row).nextAll().find("th[p^='" + (cSubCount + tdSubPosVal) + ",']");
                                        for (var thCnt = 0; thCnt < $(thSubList).length; thCnt++) {
                                            $(thSubList[thCnt]).css('display', 'none');
                                        }
                                        if ($(thSubList[thCnt]).attr("hc") == undefined || parseInt($(thSubList[thCnt]).attr("hc")) < 1) {
                                            $(pGridTb).find("td[p^='" + (cSubCount + tdSubPosVal) + ",']").css('display', 'none');
                                        }
                                        else
                                            hdnCCount++;
                                    }
                                }
                                $(thList[thCnt]).css('display', 'none');
                            }
                            if ($(thList[thCnt]).attr("hc") == undefined || parseInt($(thList[thCnt]).attr("hc")) == 1) {
                                $(thList[thCnt]).css("display", "");
                                $(thList[thCnt]).removeAttr("hc");
                            }
                            else {
                                if ((parseInt($(thList[thCnt]).attr("hc")) - 1) == 0)
                                    $(thList[thCnt]).removeAttr("hc");
                                else
                                    $(thList[thCnt]).attr("hc", (parseInt($(thList[thCnt]).attr("hc")) - 1));
                            }
                        }
                        loop = loop == 0 ? 1 : loop;
                        if (!removeCell) {
                            if ($(thList).last().attr("hc") == undefined) {
                                this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders ? this.element.find(".valueCell").find("td[p^='" + (tdPosVal - cCount) + ",']").css("display", "") : $(pGridTb).find("td[p^='" + (tdPosVal - cCount) + ",']").css("display", "");
                                var rHdnTds = $(pGridTb).find("th[p^='0,']:not(.summary)").parent().find("td[p^='" + (tdPosVal - cCount) + ",']");
                                $(rHdnTds).removeAttr("ch");
                                for (var tdCnt = 0; tdCnt <= $(rHdnTds).length; tdCnt++) {
                                    if ($(rHdnTds[tdCnt]).attr("hc") != undefined)
                                        $(rHdnTds[tdCnt]).css("display", "none");
                                }
                            }
                            else
                                hdnCCount++;
                        }
                    }
                    $(clickedTh).prev().removeAttr("hc").css("display", "");
                    var spanRemove = parseInt($(clickedTh).prev().attr("colspan"));
                    var cSpnCnt = parseInt($(targetCell).attr("tag")) - hdnCCount;
                    var prevThColSpan = $(row).prevAll().find("th:has(span):not(.summary)");
                    if (removeSpan) {
                        removeSpan = false;
                        cSpnCnt = this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? parseInt($(clickedTh).prev().attr("colSpan")) - this.model.dataSource.values.length : parseInt($(clickedTh).prev().attr("colSpan")) - JSON.parse(this.getOlapReport()).PivotCalculations.length;
                    }
                    for (var cCount = 0; cCount < prevThColSpan.length; cCount++) {
                        if ((parseInt($(prevThColSpan[cCount]).attr("p").split(",")[1]) < parseInt(positionTh.split(",")[1]) && parseInt($(prevThColSpan[cCount]).attr("p").split(",")[0]) < parseInt(positionTh.split(",")[0])) && (parseInt($(prevThColSpan[cCount]).attr("p").split(",")[0]) + prevThColSpan[cCount].colSpan + ($(prevThColSpan[cCount]).find("span").attr("tag") != undefined ? parseInt($(prevThColSpan[cCount]).find("span").attr("tag")) : 0)) >= (parseInt(positionTh.split(",")[0]))) {
                            prevThColSpan[cCount].colSpan += cSpnCnt;
                            if ($(prevThColSpan[cCount]).find("span").attr("tag") != undefined)
                                $(prevThColSpan[cCount]).find("span").attr("tag", (parseInt($(prevThColSpan[cCount]).find("span").attr("tag")) - cSpnCnt));
                            if (parseInt($(prevThColSpan[cCount]).find("span").attr("tag")) == 0)
                                $(prevThColSpan[cCount]).find("span").removeAttr("tag");
                        }
                    }
                    if ($(clickedTh).find(".cellValue").length > 0)
                        $(clickedTh).find(".cellValue").text($.trim($(clickedTh).find(".cellValue").text()) + " Total");
                    else
                        $(clickedTh).text($.trim($(clickedTh).text()) + " Total");
                    $(clickedTh).find(".expand").remove();
                    $(clickedTh).prepend("<span style='margin-left:10px'></span>");
                }
            }
        },

		_drillThroughCellClick: function (args) {
            var measures, measureGrp;
            var cellPos = $(args.currentTarget.parentElement).attr('p');
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                this._waitingPopup.show()
                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.drillThroughDataTable, JSON.stringify({ "currentReport": JSON.parse(this.getOlapReport()).Report, "layout": this.model.layout, "cellPos": cellPos, "customObject": JSON.stringify(this.model.customObject) }), function (args) {
                    this._trigger("drillThrough", { element: this.element, data: args });
                });
            }
            else {
                var rowSpan = $("#" + this._id).find("tbody").find('tr:first').find('th').length;
                for (i = 0; i < rowSpan; i++) {
                    var rowInfo = (this.getJSONRecords()[parseInt((i * this._rowCount) + parseInt(cellPos.split(",")[1]))].Info.indexOf("Measures") != -1 || this.getJSONRecords()[parseInt((i * this._rowCount) + parseInt(cellPos.split(",")[1]))].RowSpan <= 1) ? this.getJSONRecords()[parseInt((i * this._rowCount) + parseInt(cellPos.split(",")[1]))].Info.split("::")[0] : "";
                    if (rowInfo.indexOf("Measures") != -1)
                        measures = rowInfo;
                    if(rowInfo != "")
                        this._rowHeader[i] = rowInfo;
                }
                var columnHeaderCount = $("#" + this._id).find("tbody").find('[p="' + parseInt(cellPos.split(",")[0]) + "," + parseInt(cellPos.split(",")[1]) + '"]').closest('tbody').prev().children('tr').length;
                for (i = 0; i < columnHeaderCount; i++) {
                    var colInfo = (this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + i)].Info.indexOf("Measures") != -1 || this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + i)].ColSpan <= 1) ? this.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * this._rowCount) + i)].Info.split("::")[0] : "";
                    if (colInfo.indexOf("Measures") != -1)
                        measures = colInfo;
                    if (colInfo != "")
                        this._colHeader[i] = colInfo;
                }
                for (j = 0; j < this._fieldData.measures.length; j++) {
                    if (measures == this._fieldData.measures[j].id)
                        this.measureGrp = this._fieldData.measures[j].pid
                }
                this._rowHeader = $.grep(this._rowHeader, function (n) { return n == 0 || n });
                this._colHeader = $.grep(this._colHeader, function (n) { return n == 0 || n });
                this._createDrillThroughQuery();
            }
		},
		openHierarchySelector: function (e) {
		    var conStr = this._getConnectionInfo(this.model.dataSource.data);
		    var pData = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>MDSCHEMA_MEASUREGROUP_DIMENSIONS</RequestType><Restrictions><RestrictionList><CATALOG_NAME>" + this.model.dataSource.catalog + "</CATALOG_NAME><CUBE_NAME>" + this.model.dataSource.cube + "</CUBE_NAME><MEASUREGROUP_NAME>" + this.measureGrp + "</MEASUREGROUP_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>" + this.model.dataSource.catalog + "</Catalog> <LocaleIdentifier>" + conStr.LCID + "</LocaleIdentifier></PropertyList></Properties></Discover></Body></Envelope>";
		    this.doAjaxPost("POST", conStr.url, { XMLA: pData }, this._loadDimensionElements, null, { pvtGridObj: this, action: "loadMeasureElements" });
		},
        _generateTreeViewData: function (e) {
            var args = { catalog: this.model.dataSource.catalog, cube: this.model.dataSource.cube, url: this.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" }
            this._getTreeData(args, this._loadDimensionElements, { pvtGridObj: this, action: "loadFieldElements" });
        },
        _dimensionsDetails: function (customArgs, e) {
            customArgs.pvtGridObj._dimension = $(e).find("row");
        },
        _loadDimensionElements: function (customArgs, e) {
            customArgs.pvtGridObj._waitingPopup.show();
            var dimensionName, treeNodeElement = {}, measures = {}, conStr = customArgs.pvtGridObj._getConnectionInfo(customArgs.pvtGridObj.model.dataSource.data);
            customArgs.pvtGridObj["schemaTreeView"] = []; customArgs.pvtGridObj["reportItemNames"] = [];
            var data = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>MDSCHEMA_DIMENSIONS</RequestType><Restrictions><RestrictionList><CATALOG_NAME>" + customArgs.pvtGridObj.model.dataSource.catalog + "</CATALOG_NAME><CUBE_NAME>" + customArgs.pvtGridObj.model.dataSource.cube + "</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>" + customArgs.pvtGridObj.model.dataSource.catalog + "</Catalog> <LocaleIdentifier>" + conStr.LCID + "</LocaleIdentifier></PropertyList></Properties></Discover></Body></Envelope>";
            customArgs.pvtGridObj.doAjaxPost("POST", conStr.url, { XMLA: data }, customArgs.pvtGridObj._dimensionsDetails, null, { pvtGridObj: customArgs.pvtGridObj, action: "loadFieldElements" });
            var dimension = customArgs.pvtGridObj._dimension;
            for (var i = 0; i < $(e).find("row").length; i++) {
                var element = $($(e).find("row")[i]);
                var dimensionUniqueName = element.find("DIMENSION_UNIQUE_NAME").text();
                if (customArgs.pvtGridObj.model.enableDrillThrough){
                    for (var j = 0; j < dimension.length; j++) {
                        if(dimensionUniqueName == $(dimension[j]).find("DIMENSION_UNIQUE_NAME").text())
                            dimensionName = $(dimension[j]).find("DIMENSION_CAPTION").text();
                    }
                }
                else 
                    dimensionName = element.find("DIMENSION_CAPTION").text();

                if (dimensionUniqueName.toLowerCase() == "[measures]")
                    measures = { hasChildren: true, isSelected: false, id: dimensionUniqueName, name: dimensionName, spriteCssClass: dimensionUniqueName.toLowerCase() == "[measures]" ? "folderCDB e-icon" : "dimensionCDB e-icon", tag: dimensionUniqueName }
                else if (!$($(e).find("row")[0]).find("HIERARCHY_CAPTION").length > 0) {
                    treeNodeElement = { hasChildren: true, isSelected: false, id: dimensionUniqueName, name: dimensionName, spriteCssClass: "dimensionCDB e-icon", tag: dimensionUniqueName };
                    customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                }
            }
            customArgs.pvtGridObj.schemaTreeView.splice(0, 0, measures);
            var args = { catalog: customArgs.pvtGridObj.model.dataSource.catalog, cube: customArgs.pvtGridObj.model.dataSource.cube, url: customArgs.pvtGridObj.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" }
            if (!customArgs.pvtGridObj.model.enableDrillThrough || (customArgs.pvtGridObj._schemaData != undefined && customArgs.pvtGridObj._schemaData.model.olap.showNamedSets)) {
                args.request = "MDSCHEMA_SETS";
                customArgs.pvtGridObj._getTreeData(args, customArgs.pvtGridObj._loadNamedSetElements, customArgs);
            }
            else {
                args.request = "MDSCHEMA_HIERARCHIES";
                if (customArgs.pvtGridObj._fieldData.hierarchySuccess == undefined)
                    customArgs.pvtGridObj._getTreeData(args, customArgs.pvtGridObj._loadHierarchyElements, customArgs);
                else {
                    customArgs.pvtGridObj._loadHierarchyElements(customArgs, customArgs.pvtGridObj._fieldData.hierarchySuccess);
                }
            }
        },
        _loadNamedSetElements: function (customArgs, e) {
            customArgs.pvtGridObj._waitingPopup.show();
            var args = { catalog: customArgs.pvtGridObj.model.dataSource.catalog, cube: customArgs.pvtGridObj.model.dataSource.cube, url: customArgs.pvtGridObj.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" }
            var data = customArgs.pvtGridObj.model.dataSource;
            var reportElement = $.map(data.rows, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName });
            $.merge(reportElement, ($.map(data.columns, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));
            $.merge(reportElement, ($.map(data.filters, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));

            measureGroupItems = [];

            for (var i = 0; i < $(e).find("row").length; i++) {
                var element = $($(e).find("row")[i]);
                if ((!($.inArray(element.find("DIMENSIONS").text().split(".")[0], measureGroupItems) >= 0))) {
                    treeNodeElement = {
                        hasChildren: true, isSelected: false, pid: element.find("DIMENSIONS").text().split(".")[0], id: element.find("SET_DISPLAY_FOLDER").text() + "_" + element.find("DIMENSIONS").text().split(".")[0],
                        name: element.find("SET_DISPLAY_FOLDER").text(), spriteCssClass: "folderCDB e-icon namedSets"
                    }
                    customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                    measureGroupItems.push(element.find("DIMENSIONS").text().split(".")[0]);
                }
                treeNodeElement = {
                    hasChildren: true, isSelected: ($.inArray("[" + $.trim(element.children("SET_NAME").text()) + "]", reportElement) >= 0),
                    pid: element.find("SET_DISPLAY_FOLDER").text() + "_" + element.find("DIMENSIONS").text().split(".")[0],
                    id: "[" + $.trim(element.children("SET_NAME").text()).replace(/\&/g, "&amp;") + "]",
                    name: element.children("SET_CAPTION").text(), spriteCssClass: "namedSetCDB e-icon", tag: element.find("EXPRESSION").text()
                }
                customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
            }
            args.request = "MDSCHEMA_HIERARCHIES";
            if (customArgs.pvtGridObj._fieldData.hierarchySuccess == undefined)
                customArgs.pvtGridObj._getTreeData(args, customArgs.pvtGridObj._loadHierarchyElements, customArgs);
            else {
                customArgs.pvtGridObj._loadHierarchyElements(customArgs, customArgs.pvtGridObj._fieldData.hierarchySuccess);
            }
        },
        _loadHierarchyElements: function (customArgs, e) {
            customArgs.pvtGridObj._waitingPopup.show();
            var args = { catalog: customArgs.pvtGridObj.model.dataSource.catalog, cube: customArgs.pvtGridObj.model.dataSource.cube, url: customArgs.pvtGridObj.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" }
            var data = customArgs.pvtGridObj.model.dataSource;
            var reportElement = $.map(data.rows, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName });
            $.merge(reportElement, ($.map(data.columns, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));
            $.merge(reportElement, ($.map(data.filters, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));
            var treeNodeElement = {}, displayFolder = "";
            for (var i = 0; i < $(e).find("row").length; i++) {
                var element = $($(e).find("row")[i]);
                var dimensionUniqueName = element.find("DIMENSION_UNIQUE_NAME").text();
                var hierarchyUniqueName = element.find("HIERARCHY_UNIQUE_NAME").text();
                var currElement = $(customArgs.pvtGridObj.schemaTreeView).filter(function (i,x) { return x.tag == dimensionUniqueName; }).map(function (i,x) { return x });
                if (currElement.length > 0 && dimensionUniqueName != hierarchyUniqueName) {
                    treeNodeElement = {
                        hasChildren: true, isSelected: ($.inArray(hierarchyUniqueName, reportElement) >= 0), pid: dimensionUniqueName, id: hierarchyUniqueName, name: element.find("HIERARCHY_CAPTION").text(),
                        spriteCssClass: ((element.find("HIERARCHY_ORIGIN").text() != "2") && element.find("HIERARCHY_ORIGIN").text() != "6") ? "hierarchyCDB e-icon" : "attributeCDB e-icon", tag: hierarchyUniqueName  //HIERARCHY_ORDINAL
                    },
                    customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                }
            }
            args.request = "MDSCHEMA_LEVELS"
            customArgs.pvtGridObj._getTreeData(args, customArgs.pvtGridObj._loadLevelElements, customArgs);
        },
        _loadLevelElements: function (customArgs, args) {
            customArgs.pvtGridObj._waitingPopup.show();
            var newDataSource = $.map($(args).find("row"), function (obj, index) {
                if (parseInt($(obj).children("LEVEL_TYPE").text()) != "1" && $(obj).children("HIERARCHY_UNIQUE_NAME").text().toLowerCase() != "[measures]") {
                    treeNodeElement = {
                        hasChildren: false, isChecked: false, id: $(obj).find("LEVEL_UNIQUE_NAME").text(), pid: $(obj).find("HIERARCHY_UNIQUE_NAME").text(), name: $(obj).find("LEVEL_CAPTION").text(),
                        spriteCssClass: "level" + parseInt($(obj).children("LEVEL_NUMBER").text()) + " e-icon", tag: $(obj).find("LEVEL_UNIQUE_NAME").text()
                    };
                    return treeNodeElement;
                }
            });
            $.merge(customArgs.pvtGridObj.schemaTreeView, newDataSource);
            if (!customArgs.pvtGridObj.model.enableDrillThrough || customArgs.pvtGridObj._fieldData.measureSuccess) {
                if (!customArgs.pvtGridObj._fieldData.measureSuccess) {
                    var args = { catalog: customArgs.pvtGridObj.model.dataSource.catalog, cube: customArgs.pvtGridObj.model.dataSource.cube, url: customArgs.pvtGridObj.model.dataSource.data, request: "MDSCHEMA_MEASURES" }
                    customArgs.pvtGridObj._getTreeData(args, customArgs.pvtGridObj._loadMeasureElements, customArgs);
                }
                else {
                    customArgs.pvtGridObj._loadMeasureElements(customArgs, customArgs.pvtGridObj._fieldData.measureSuccess);
                }
            }
            else
                ej.Pivot._createDrillThroughDialog(customArgs.pvtGridObj, customArgs.pvtGridObj.schemaTreeView);
        },
        _loadMeasureGroups: function (customArgs, e) {
            customArgs.pvtGridObj._fieldData["measuresGroups"] = $(e).find("row");
        },
        _loadMeasureElements: function (customArgs, e) {
            var args = { catalog: customArgs.pvtGridObj.model.dataSource.catalog, cube: customArgs.pvtGridObj.model.dataSource.cube, url: customArgs.pvtGridObj.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" }
            var data = customArgs.pvtGridObj.model.dataSource;
            var elements = $.map(data.values, function (obj, index) { if (obj["measures"] != undefined) return obj["measures"] });
            this.reportItemNames = $.map(elements, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName });
            var measureGroupItems = [], measureGroup = "", caption;
            {
                if (customArgs.pvtGridObj.model.locale != "en-US") {
                    var args = { catalog: customArgs.pvtGridObj.model.dataSource.catalog, cube: customArgs.pvtGridObj.model.dataSource.cube, url: customArgs.pvtGridObj.model.dataSource.data, request: "MDSCHEMA_MEASUREGROUPS" }
                    customArgs.pvtGridObj._getTreeData(args, this._loadMeasureGroups, {pvtGridObj: this, action: "loadFieldElements" });
                }
                for (var i = 0; i < $(e).find("row").length; i++) {
                    var element = $($(e).find("row")[i]), measureGRPName = element.children("MEASUREGROUP_NAME").text(), measureUQName = element.find("MEASURE_UNIQUE_NAME").text();
                    if ((!($.inArray(measureGRPName, measureGroupItems) >= 0))) {
                        if (customArgs.pvtGridObj.model.locale != "en-US") {
                            var measureInfo = $.map(customArgs.pvtGridObj._fieldData["measuresGroups"], function (item) { if ($(item).children("MEASUREGROUP_NAME").text() == measureGRPName) return $(item).children("MEASUREGROUP_CAPTION").text() });
                            caption = measureInfo.length > 0 ? measureInfo[0] : measureGRPName
                        }
                        else
                            caption = measureGRPName;

                        treeNodeElement = { hasChildren: true, isChecked: false, pid: "[Measures]", id: measureGRPName, name: caption, spriteCssClass: "measureGroupCDB e-icon", tag: measureGRPName }
                        customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                        measureGroupItems.push(measureGRPName);
                    }
                    treeNodeElement = { hasChildren: true, isSelected: ($.inArray(measureUQName, this.reportItemNames) >= 0), id: measureUQName, pid: measureGRPName, name: element.children("MEASURE_CAPTION").text(), spriteCssClass: "measure", tag: measureUQName }
                    customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                    if (($.inArray(measureUQName, customArgs.pvtGridObj.reportItemNames) >= 0)) {
                        customArgs.pvtGridObj.reportItemNames.splice(customArgs.pvtGridObj.reportItemNames.indexOf(measureUQName), 1)
                    }
                }
            }
            if (customArgs.pvtGridObj._schemaData.model.olap.showKpi) {
                treeNodeElement = { hasChildren: true, isChecked: false, id: "folderStruct", name: "KPI", spriteCssClass: "KPICDB folderCDB e-icon", tag: "" }
                customArgs.pvtGridObj.schemaTreeView.splice(1, 0, treeNodeElement);
                args.request = "MDSCHEMA_KPIS";
                customArgs.pvtGridObj._getTreeData(args, customArgs.pvtGridObj._loadKPIElements, customArgs);
            }
            else
                customArgs.pvtGridObj._schemaData._createTreeView(this, customArgs.pvtGridObj.schemaTreeView);

        },
        _loadKPIElements: function (customArgs, e) {
            var data = customArgs.pvtGridObj.model.dataSource;
            var reportElement = this.reportItemNames;
            var measureGroupItems = [];
            var measureGroup = "";
            for (var i = 0; i < $(e).find("row").length; i++) {
                var element = $($(e).find("row")[i]),
                    kpiName = element.children("KPI_CAPTION").text(),
                    kpiGoal = element.children("KPI_goal").text(),
                    kpiStatus = element.children("KPI_STATUS").text(),
                    kpiTrend = element.children("KPI_TREND").text(),
                    kpiValue = element.find("KPI_VALUE").text();
                if ((!($.inArray(element.children("KPI_NAME").text(), measureGroupItems) >= 0))) {
                    treeNodeElement = { hasChildren: true, isChecked: false, pid: "folderStruct", id: kpiName, name: kpiName, spriteCssClass: "measureGroupCDB e-icon", tag: kpiName }
                    customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                    measureGroupItems.push(kpiName);
                }

                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiGoal, reportElement) >= 0), id: kpiGoal, pid: kpiName, name: customArgs.pvtGridObj._getLocalizedLabels("Goal"), spriteCssClass: "kpiGoal e-icon", tag: kpiGoal };
                customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiStatus, reportElement) >= 0), id: kpiStatus, pid: kpiName, name: customArgs.pvtGridObj._getLocalizedLabels("Status"), spriteCssClass: "kpiStatus e-icon", tag: kpiStatus };
                customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiTrend, reportElement) >= 0), id: kpiTrend, pid: kpiName, name: customArgs.pvtGridObj._getLocalizedLabels("Trend"), spriteCssClass: "kpiTrend e-icon", tag: kpiTrend };
                customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiValue, reportElement) >= 0), id: kpiValue, pid: kpiName, name: customArgs.pvtGridObj._getLocalizedLabels("Value"), spriteCssClass: "kpiValue e-icon", tag: kpiValue };
                customArgs.pvtGridObj.schemaTreeView.push(treeNodeElement);
            }

            customArgs.pvtGridObj._schemaData._createTreeView(this, customArgs.pvtGridObj.schemaTreeView);
            delete customArgs.pvtGridObj.reportItemNames;
            delete customArgs.pvtGridObj.schemaTreeView;
        },
        _getTreeData: function (args, successMethod, customArgs) {
            var conStr = ej.olap.base._getConnectionInfo(args.url);
            var pData = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>" + args.request + "</RequestType><Restrictions><RestrictionList><CATALOG_NAME>" + args.catalog + "</CATALOG_NAME><CUBE_NAME>" + args.cube + "</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>" + args.catalog + "</Catalog><LocaleIdentifier>" + conStr.LCID + "</LocaleIdentifier> </PropertyList></Properties></Discover></Body></Envelope>";
            this.doAjaxPost("POST", conStr.url, { XMLA: pData }, successMethod, null, customArgs);
        },

        _addHyperlink: function (e) {
            if ($(".hyperlinkValueCell")[0])
                $($(".hyperlinkValueCell")[0]).removeClass("hyperlinkValueCell");
            if ($(".hyperlinkHeaderCell")[0])
                $($(".hyperlinkHeaderCell")[0]).removeClass("hyperlinkHeaderCell");
            if ($(e.target).text() == "" || $(e.target).text() == null)
                return false;
            if (e.target.parentElement.className.replace(/^\s+/, "").split(" ")[0] == "value" && (this.enableValueCellHyperlink() || ((typeof (oclientProxy) != "undefined") ? oclientProxy.model.enableDrillThrough : this.model.enableDrillThrough )))
                $(e.target).addClass("hyperlinkValueCell");
            else if ($(e.target.parentElement).hasClass("summary value") && this.enableSummaryCellHyperlink())
                $(e.target).addClass("hyperlinkValueCell");

            else if (e.target.parentElement.className.split(" ")[0] == "rowheader" || (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && $(e.target.parentElement).attr("role") == "rowheader")) {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && !this.model.enableDeferUpdate && $(this.element).parents(".e-pivotclient").length == 0) {
                    if (!$(e.target.parentElement).hasClass("rgtot")) {
                        fieldIndex = $(e.target.parentElement).attr("p").split(",")[0];
                        if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && JSON.parse(this.getOlapReport()).PivotRows[fieldIndex].EnableHyperlink)
                            $(e.target).addClass("hyperlinkHeaderCell");
                        else if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.dataSource.rows.length > 0 && !ej.isNullOrUndefined(this.model.dataSource.rows[fieldIndex].enableHyperlink) && this.model.dataSource.rows[fieldIndex].enableHyperlink)
                            $(e.target).addClass("hyperlinkHeaderCell");
                        else if (this.enableRowHeaderHyperlink())
                            $(e.target).addClass("hyperlinkHeaderCell");
                    }
                }
                else if (this.enableRowHeaderHyperlink())
                    $(e.target).addClass("hyperlinkHeaderCell");
            }
            else if (e.target.parentElement.className.split(" ")[0] == "colheader" || (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && $(e.target.parentElement).attr("role") == "columnheader")) {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && !this.model.enableDeferUpdate && $(this.element).parents(".e-pivotclient").length == 0) {
                    if (!$(e.target.parentElement).hasClass("calc") && !$(e.target.parentElement).hasClass("cgtot") && !$(e.target.parentElement).hasClass("gtot")) {
                        fieldIndex = $(e.target.parentElement).attr("p").split(",")[1];
                        if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && JSON.parse(this.getOlapReport()).PivotColumns[fieldIndex].EnableHyperlink)
                            $(e.target).addClass("hyperlinkHeaderCell");
                        else if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && !ej.isNullOrUndefined(this.model.dataSource.columns[fieldIndex].enableHyperlink) && this.model.dataSource.columns[fieldIndex].enableHyperlink)
                            $(e.target).addClass("hyperlinkHeaderCell");
                        else if (this.enableColumnHeaderHyperlink())
                            $(e.target).addClass("hyperlinkHeaderCell");
                    }
                }
                else if (this.enableColumnHeaderHyperlink())
                    $(e.target).addClass("hyperlinkHeaderCell");
            }
        },

        _removeHyperlink: function (e) {
            $(e.target).removeClass("hyperlinkValueCell").removeClass("hyperlinkHeaderCell");
        },

        _cellContext: function (e) {
            var pGridObj = $(e.target).parents(".e-pivotgrid").data("ejPivotGrid");
            var currentCell = ($(e.target).hasClass("cellValue") ? $(e.target).parent()[0] : e.target) || ($(e.srcElement).hasClass("cellValue") ? $(e.srcElement).parent()[0] : e.srcElement);
            if (pGridObj.enableCellContext() == true && $(currentCell).parents("#" + pGridObj._id)[0]) {
                var cellPos = $(currentCell).attr("p");
                if (cellPos) {
                    var cellPos = pGridObj._excelLikeJSONRecords != null && pGridObj.model.layout.toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? $(currentCell).attr("i") : $(currentCell).attr("p");
                    var rawdata = pGridObj._excelLikeJSONRecords != null && pGridObj.model.layout.toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? pGridObj._excelLikeJSONRecords[parseInt((parseInt(cellPos.split(",")[0]) * pGridObj._excelRowCount) + parseInt(cellPos.split(",")[1]))].Info : pGridObj.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * pGridObj._rowCount) + parseInt(cellPos.split(",")[1]))].Info;
                    var cellInfo = {
                        cellValue: currentCell.innerHTML,
                        cellPosition: cellPos,
                        cellType: currentCell.className.split(" ")[0] != "" ? currentCell.className.split(" ")[0] : currentCell.className.split(" ")[1],
                        role: $(currentCell).attr('role'),
                        uniqueName: rawdata.split('::')[0],
                        args: e,
                        rawdata: rawdata
                    };
                    if (cellInfo.cellType != "")
                        pGridObj._trigger("cellContext", { args: cellInfo });
                    e.target ? e.preventDefault() : (window.event.returnValue = false);
                }
            }
        },

        _initCellSelection: function (e) {
            $("#" + this._id + " td,th").removeClass("highlighted");
            this._on(this.element, "mouseup touchend", ".value", this._completeCellSelection);
            var targetCell;
            _oriX = e.pageX, _oriY = e.pageY;
            targetCell = e.target || window.event.srcElement;
            if ($(targetCell).hasClass("cellValue")) targetCell = targetCell.parentElement;
            $(".value").addClass("selection");
            $("#" + this._id).append(ej.buildTag("div.cellSelection#" + this._id + "_cellSelection", "", {}));
            _startPosCell = $(targetCell)[0].attributes.getNamedItem("p").value;
            if (this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout) {
                var startIndex = this._excelLikeJSONRecords[(0 * this._rowCount + (parseInt($(targetCell)[0].attributes.getNamedItem("i").value.split(',')[1])))].Index;
                _startPosCell = this.getJSONRecords()[((parseInt($(targetCell)[0].attributes.getNamedItem("p").value.split(',')[0])) * this._rowCount + parseInt(startIndex.split(',')[1]))].Index;
            }
            this._on(this.element, "mousemove touchmove", ".value, .cellSelection", this._cellSelection);
        },

        _headerClickCellSelection: function (e) {
            var target = ($(e.target).attr("class").indexOf("colheader") && $(e.target).attr("class").indexOf("rowheader") == -1) ? ($(e.target).attr("class").indexOf("cellValue") != -1 ? $(e.target).parent() : null) : $(e.target);
            if (target != null) {
                $("#" + this._id + " td,th").removeClass("highlighted");
                var _headerType, _span, _position, _cellInfo = [], _colHeader = [], _rowHeader = [], _measureCount = 0;
                _headerType = target.attr("role");
                _position = _headerType == "columnheader" ? target.attr("p").split(',')[0] : target.attr("p").split(',')[1];
                _span = _headerType == "columnheader" ? target.attr("colspan") : target.attr("rowspan");
                if (this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout) {
                    var rowSpanIndex = (parseInt(target.attr("p").split(',')[0]) * this._rowCount + (parseInt(target.attr("p").split(',')[1])));
                    _span = _headerType == "columnheader" ? this._excelLikeJSONRecords[(parseInt(target.attr("i").split(',')[0]) * this._rowCount + (parseInt(target.attr("i").split(',')[1])))].ColSpan : this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.getJSONRecords()[rowSpanIndex + this._rowCount] != null && this.getJSONRecords()[rowSpanIndex + this._rowCount].CSS.indexOf("value") == -1 ? this.getJSONRecords()[rowSpanIndex].RowSpan + 1 : this.getJSONRecords()[rowSpanIndex].RowSpan;
                }
                for (var i = 0; i < _span; i++) {
                    if (_headerType == "columnheader") {
                        $("#" + this._id + " [p^='" + (parseInt(i) + parseInt(_position)) + ",']").addClass("highlighted");
                        $("#" + this._id + " [p^='" + (parseInt(i) + parseInt(_position)) + ",']" + "[role='columnheader']").each(function (index, el) {
                            if (parseInt(el.attributes['p'].value.split(',')[1]) <= parseInt(target.attr("p").split(',')[1]) || parseInt(el.attributes['colspan'].value) > parseInt(target.attr("colspan")))
                                $(el).removeClass("highlighted");
                        })
                    }
                    else {
                        $("#" + this._id + " [p$='," + (parseInt(i) + parseInt(_position)) + "']").addClass("highlighted");
                        $("#" + this._id + " [p$='," + (parseInt(i) + parseInt(_position)) + "']" + "[role='rowheader']").each(function (index, el) {
                            if (parseInt(el.attributes['p'].value.split(',')[0]) <= parseInt(target.attr("p").split(',')[0]) || parseInt(el.attributes['rowspan'].value) > parseInt(target.attr("rowspan")))
                                $(el).removeClass("highlighted");
                        })
                    }
                }
                _startPosCell = _headerType == "columnheader" ? $("#" + this._id + " [p^='" + (0 + parseInt(_position)) + ",']" + ".value").eq(0).attr("p") : $("#" + this._id + " [p$='," + (0 + parseInt(_position)) + "']" + ".value").eq(0).attr("p");
                if (this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout && !(this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode))
                    _startPosCell = _headerType == "columnheader" ? $("#" + this._id + " [p^='" + (0 + parseInt(_position)) + ",']" + ".value:not(.summary)").eq(0).attr("p") : $("#" + this._id + " [p$='," + (0 + parseInt(_position)) + "']" + ".value:not(.summary)").eq(0).attr("p");
                var el = _headerType == "columnheader" ? $("#" + this._id + " [p^='" + ((parseInt(_span) - 1) + parseInt(_position)) + ",']").eq($("#" + this._id + " [p^='" + ((parseInt(_span) - 1) + parseInt(_position)) + ",']").length - 1) : $("#" + this._id + " [p$='," + ((parseInt(_span) - 1) + parseInt(_position)) + "']").eq($("#" + this._id + " [p$='," + ((parseInt(_span) - 1) + parseInt(_position)) + "']").length - 1);
                this._completeCellSelection(el);
            }
        },

        _cellSelection: function (e) {
            $("#" + this._id + "_gridTooltip").hide();
            if (e.pageX < _oriX) {
                $("#" + this._id + "_cellSelection").css({ left: e.pageX + 2, width: _oriX - e.pageX });
            }
            else {
                $("#" + this._id + "_cellSelection").css({ left: _oriX - 6, width: e.pageX - _oriX });
            }
            if (e.pageY < _oriY) {
                $("#" + this._id + "_cellSelection").css({ top: e.pageY, height: _oriY - e.pageY - 7 });
            }
            else {
                $("#" + this._id + "_cellSelection").css({ top: _oriY + 7, height: e.pageY - _oriY - 11 });
            }
            $(".pivotGridTable").mouseleave(function (e) {
                var pGridObj = $(e.target).parents(".e-pivotgrid").data("ejPivotGrid");
                if (!ej.isNullOrUndefined(e.toElement) && !ej.isNullOrUndefined(e.toElement.classList) && e.toElement.classList[0] == "e-pivotgrid") {
                    $("#" + pGridObj._id + "_cellSelection").remove();
                    $(".value").removeClass("selection");
                    pGridObj._off(pGridObj.element, "mouseup mouseend", ".value");
                }
            });
        },

        _completeCellSelection: function (e) {
            var targetCell, endPosCell, cellInfo = [], rowHeader = [], rowLThPos, colHeader = [], curCelPos;
            this._off(this.element, "mousemove touchmove", ".value");
            $(".value").removeClass("selection");
            targetCell = $(e).hasClass("value") ? e : e.target || window.event.srcElement;
            if ($(targetCell).hasClass("cellValue")) targetCell = targetCell.parentElement;
            endPosCell = $(targetCell)[0].attributes.getNamedItem("p").value;
            if (this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout && !($(e).hasClass("value"))) {
                var endIndex = this._excelLikeJSONRecords[(0 * this._rowCount + (parseInt($(targetCell)[0].attributes.getNamedItem("i").value.split(',')[1])))].Index;
                endPosCell = this.getJSONRecords()[((parseInt($(targetCell)[0].attributes.getNamedItem("p").value.split(',')[0])) * this._rowCount + parseInt(endIndex.split(',')[1]))].Index;

            }
            var count = 0;
            for (var rowSelCnt = (parseInt(_startPosCell.split(",")[1]) < parseInt(endPosCell.split(",")[1]) ? parseInt(_startPosCell.split(",")[1]) : parseInt(endPosCell.split(",")[1])) ; rowSelCnt <= (parseInt(_startPosCell.split(",")[1]) > parseInt(endPosCell.split(",")[1]) ? parseInt(_startPosCell.split(",")[1]) : parseInt(endPosCell.split(",")[1])) ; rowSelCnt++) {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap || $("#" + this._id).find("td[p*='," + rowSelCnt + "']").parent().is(":visible")) {
                    for (var colSelCnt = (parseInt(_startPosCell.split(",")[0]) < parseInt(endPosCell.split(",")[0]) ? parseInt(_startPosCell.split(",")[0]) : parseInt(endPosCell.split(",")[0])) ; colSelCnt <= (parseInt(_startPosCell.split(",")[0]) > parseInt(endPosCell.split(",")[0]) ? parseInt(_startPosCell.split(",")[0]) : parseInt(endPosCell.split(",")[0])) ; colSelCnt++) {
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap || $("#" + this._id).find("[p*='" + colSelCnt + ",']").last("th").is(":Visible")) {
                            cellInfo[count] = this.getJSONRecords()[((colSelCnt) * this._rowCount) + rowSelCnt];
                            var rowInfo, rowValue = "";
                            var tempThPos, measureColumn, measureRowCount = 0, measureColCount = 0;
                            rowLThPos = this.element.find(".summary[role!='gridcell'][p$='," + rowSelCnt + "'] , .rowheader[role!='gridcell'][p$='," + rowSelCnt + "']").last().attr("p");
                            if (rowLThPos == undefined) {
                                rowLThPos = $("#" + this._id).find("tbody").find('[p="' + colSelCnt + "," + rowSelCnt + '"]').parent("tr").find(".summary").first().attr('p');
                            }
                            tempThPos = rowLThPos;
                            if (rowLThPos != null) {
                                while (rowLThPos[0] >= 0) {
                                    if (rowLThPos == this.getJSONRecords()[parseInt((parseInt(rowLThPos.split(",")[0]) * this._rowCount) + parseInt(rowLThPos.split(",")[1]))].Index) {
                                        rowInfo = this.getJSONRecords()[parseInt((parseInt(rowLThPos.split(",")[0]) * this._rowCount) + parseInt(rowLThPos.split(",")[1]))].Value;
                                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                                            rowInfo = ($("#" + this._id).find("td[p*='" + colSelCnt + "," + rowSelCnt + "']")).prevAll("th").children(".expand").length > 0 ? rowInfo.replace("Total", "") : rowInfo;
                                        }
                                        rowLThPos = parseInt(rowLThPos.split(",")[0]) - 1 + "," + parseInt(rowLThPos.split(",")[1]);
                                    }
                                    if ((rowValue) && (rowInfo != ""))
                                        rowValue = rowInfo + "##" + rowValue;
                                    else if (rowInfo != "")
                                        rowValue = rowInfo;
                                }
                                rowHeader[count] = rowValue;
                            }
                            var columnValue = "", headerInfo;
                            var colHeadRCnt = this.element.find('tr:has(".colheader")').length - 1;
                            measureColumn = colHeadRCnt;
                            curCelPos = cellInfo[count].Index;
                            if ((curCelPos != undefined) && (curCelPos == this.getJSONRecords()[parseInt((parseInt(curCelPos.split(",")[0]) * this._rowCount) + parseInt(curCelPos.split(",")[1]))].Index)) {
                                var colPos = parseInt(curCelPos.split(",")[0]);
                            }
                            for (var rCnt = 0; rCnt <= colHeadRCnt; rCnt++) {
                                if (colPos != null)
                                    if ((colPos + "," + rCnt) == (this.getJSONRecords()[parseInt((parseInt(colPos) * this._rowCount) + rCnt)].Index)) {
                                        headerInfo = this.getJSONRecords()[parseInt((parseInt(colPos) * this._rowCount) + rCnt)].Value;
                                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                                            for (var i = colPos; i >= 0; i--) {
                                                if ($("#" + this._id).find("th[p*='" + i + "," + rCnt + "']").length > 0) {
                                                    headerInfo = $("#" + this._id).find("th[p*='" + i + "," + rCnt + "']").find(".expand").length > 0 ? headerInfo.replace("Total", "") : headerInfo;
                                                    break;
                                                }
                                            }
                                        }
                                        if (columnValue == "")
                                            columnValue = headerInfo;
                                        else if (headerInfo != "")
                                            columnValue = columnValue + "##" + headerInfo;
                                    }
                                colHeader[count] = columnValue;
                            }
                            count++;
                        }
                    }
                }
            }
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
            var measureValue = this.getJSONRecords()[parseInt((parseInt(tempThPos.split(",")[0]) * this._rowCount) + parseInt(tempThPos.split(",")[1]))].Info;
            while (measureValue[0] >= 0) {
                rowInfo = this.getJSONRecords()[parseInt((parseInt(measureValue.split(",")[0]) * this._rowCount) + parseInt(measureValue.split(",")[1]))].Info;
                if (rowInfo.split("::")[0].indexOf("Measures") > 0 || rowInfo.split("::")[0].indexOf("MEASURES") > 0) {
                    measureRowCount++;
                }
                rowLThPos = parseInt(rowLThPos.split(",")[0]) - 1 + "," + parseInt(rowLThPos.split(",")[1]);
            }
            var columnpos = parseInt(curCelPos.split(",")[0]);
            if (measureRowCount == 0)
                for (var colRCnt = 0; colRCnt <= measureColumn; colRCnt++) {
                    if (columnpos != null)
                        var headerValue = this.getJSONRecords()[parseInt((parseInt(columnpos) * this._rowCount) + colRCnt)].Info;
                    if (headerValue.split("::")[0].indexOf("Measures") > 0 || headerValue.split("::")[0].indexOf("MEASURES") > 0) {
                        measureColCount++;
                    }
                }
            }
            else
                measureCount = (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) ? (JSON.parse(this.getOlapReport()).PivotCalculations.length) : (this.model.dataSource.values.length);
            args = { JSONRecords: cellInfo, rowHeader: rowHeader, columnHeader: colHeader, measureCount: (measureRowCount > 0 ? ("Row:" + measureRowCount) : ("Column:" + measureColCount)) }
            this._trigger("cellSelection", args);
            cellInfo = rowHeader = colHeader = [];
            $("#" + this._id + "_cellSelection").remove();
            if (this.model.enableToolTip) {
                this._on(this.element, "mousemove touchmove", ".value", this._applyToolTip);
            }
            this._off(this.element, "mouseup touchend", ".value");
        },

        exportPivotGrid: function (exportOption, fileName) {
            var exportSetting = { url: "", fileName: "PivotGrid", exportMode: ej.PivotGrid.ExportMode.JSON, title: "", description: "" };
            this._trigger("beforeExport", exportSetting);
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ||  exportSetting.exportMode == ej.PivotGrid.ExportMode.JSON) {  //this.model.layout == "excellikelayout"
                var params = {
                    args: JSON.stringify({ "pGridData": (this.exportRecords != null && this.exportRecords != "") ? this.exportRecords : null, "rowCount": this._excelLikeJSONRecords != null ? this._excelRowCount : this._rowCount, "columnCount": this._excelLikeJSONRecords != null ? Math.floor(this._excelLikeJSONRecords.length / this._excelRowCount) : this.getJSONRecords() != null ? Math.floor(this.getJSONRecords().length / this._rowCount) : 0, "fileName": ej.isNullOrUndefined(fileName) ? (ej.isNullOrUndefined(exportSetting.fileName) ? "PivotGrid" : exportSetting.fileName) : fileName, "Formatting": this._cFormat, title: exportSetting.title, description: exportSetting.description, customObject: JSON.stringify(this.model.customObject) })
                };
                if (ej.raiseWebFormsServerEvents && ((exportOption == "excelExport" || exportOption == "wordExport" || exportOption == "pdfExport" || exportOption == "csvExport") && ej.PivotGrid.ExportMode.JSON)) {
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
                var report;
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
                var colorDetails;
                if (this.element.find(".summary").length > 0) {
                    colorDetails = {
                        valueCellColor: this.element.find(".value").css("color") == null ? "rgb(51, 51, 51)" : this.element.find(".value").css("color"),
                        valueCellBGColor: this.element.find(".value").css("background-color") == null ? "rgb(255, 255, 255)" : this.element.find(".value").css("background-color"),
                        summaryCellColor: this.element.find(".summary").css("color"),
                        summaryCellBGColor: this.element.find(".summary").css("background-color")
                    }
                }
                else if (this.element.find(".value").length > 0) {
                    colorDetails = {
                        valueCellColor: this.element.find(".value").css("color") == null ? "rgb(51, 51, 51)" : this.element.find(".value").css("color"),
                        valueCellBGColor: this.element.find(".value").css("background-color") == null ? "rgb(255, 255, 255)" : this.element.find(".value").css("background-color")
                    }
                }
                var params = {
                    args: JSON.stringify({
                        exportOption: exportOption,
                        currentReport: report,
                        layout: this.layout(),
                        colorSettings: colorDetails != undefined ? JSON.stringify(colorDetails) : "",
                        customObject: JSON.stringify(this.model.customObject),
                        title: exportSetting.title,
                        description: exportSetting.description
                    })
                };
                this.doPostBack($.trim(exportSetting.url) != "" ? exportSetting.url : this.model.url + "/" + this.model.serviceMethodSettings.exportPivotGrid, params);
            }
        },

        _createCalculatedField: function () {
            ej.Pivot.openPreventPanel(this);
            this.element.find(".calculatedFieldPopup", ".clientDialog", ".e-dialog").remove();
            dialogTitle = this._getLocalizedLabels("CalculatedField");
            var nameLabel = ej.buildTag("label#" + this._id + "_lblCalFieldName", this._getLocalizedLabels("Name"))[0].outerHTML;
            var calculateFieldList = ej.buildTag("span.fieldDropDown", ej.buildTag("input#" + this._id + "_calculateFieldList", "", {}, { type: 'text' })[0].outerHTML + ej.buildTag("input#" + this._id + "_calculateFieldName.calculateFieldName", "", { "margin-left": this.model.enableRTL ? "56px" : "2px", "outline": "none" }, { type: 'text' })[0].outerHTML, {})[0].outerHTML;
            var addBtn = ej.buildTag("button#" + this._id + "_btnAdd", this._getLocalizedLabels("Add"), {"margin-top":"-5px"}, { name: this._getLocalizedLabels("Add") })[0].outerHTML;
            var formulaLabel = ej.buildTag("label#" + this._id + "_lblCalFieldFormula", this._getLocalizedLabels("Formula"))[0].outerHTML;
            var formulaTextBox = ej.buildTag("input.calculatedFieldFormula#" + this._id + "_calculatedFieldFormula", "", { width: "192px", height: "27px" }, { type: 'text', disabled: "disabled" })[0].outerHTML;
            var deleteBtn = ej.buildTag("button#" + this._id + "_btnDelete", this._getLocalizedLabels("Delete"), { "margin-top": "-24px" }, { name: this._getLocalizedLabels("Delete") })[0].outerHTML;
            var fieldsLabel = ej.buildTag("label#" + this._id + "_pivotGridValueFields", this._getLocalizedLabels("Fields"))[0].outerHTML;
            var fieldCollection = ej.buildTag("ul#" + this._id + "_fieldCollection", "")[0].outerHTML;
            //  var calculatorFields = ej.buildTag("span.calculatorFields e-icon e-sigma", "", { "padding": "3px" }).attr("aria-label","calculated button")[0].outerHTML;
            var calculatorFields = ej.buildTag("button.calculatorFields", "", { "margin-left": this.model.enableRTL ? "0px" : "10px", "margin-right": this.model.enableRTL ? "10px" : "0px"})[0].outerHTML;
            var editFormula = ej.buildTag("span.editFormula e-icon e-cancel", "", { "padding": "3px", "margin-left": "-54px", "margin-right": this.model.enableRTL ?"-54px":"0px","position":"relative"}).attr("aria-label","cancel")[0].outerHTML;
            var insertButton = ej.buildTag("span", ej.buildTag("button#" + this._id + "_btnInsert", this._getLocalizedLabels("InsertField"), {}, { name: this._getLocalizedLabels("InsertField") })[0].outerHTML, { "margin-right": "150px", "margin-left": "150px" })[0].outerHTML;

            var okBtn = ej.buildTag("button#" + this._id + "_btnOk", this._getLocalizedLabels("OK"), { "margin-left": "10px", }, { name: this._getLocalizedLabels("OK") })[0].outerHTML;
            var cancelBtn = ej.buildTag("button#" + this._id + "_btnCancel", this._getLocalizedLabels("Cancel"), { "margin-left": this.model.enableRTL ? "0px" : "10px", }, { name: this._getLocalizedLabels("Cancel") })[0].outerHTML;
            dialogFooter = ej.buildTag("div", okBtn + cancelBtn, { "float": this.model.enableRTL ? "left" : "right", "margin-bottom": "15px", "margin-top": "4px" })[0].outerHTML;

            var calculatorDiv = ej.buildTag("div.calcFormulaDiv", ej.buildTag("table", ej.buildTag("tbody",
                               ej.buildTag("tr", ej.buildTag("td", "+")[0].outerHTML + ej.buildTag("td", "-")[0].outerHTML + ej.buildTag("td", "*")[0].outerHTML + ej.buildTag("td", "/")[0].outerHTML)[0].outerHTML +
                               ej.buildTag("tr", ej.buildTag("td", "7")[0].outerHTML + ej.buildTag("td", "8")[0].outerHTML + ej.buildTag("td", "9")[0].outerHTML + ej.buildTag("td", "%")[0].outerHTML)[0].outerHTML +
                               ej.buildTag("tr", ej.buildTag("td", "4")[0].outerHTML + ej.buildTag("td", "5")[0].outerHTML + ej.buildTag("td", "6")[0].outerHTML + ej.buildTag("td", "^")[0].outerHTML)[0].outerHTML +
                               ej.buildTag("tr", ej.buildTag("td", "1")[0].outerHTML + ej.buildTag("td", "2")[0].outerHTML + ej.buildTag("td", "3")[0].outerHTML + ej.buildTag("td", "(")[0].outerHTML)[0].outerHTML +
                               ej.buildTag("tr", ej.buildTag("td", ".")[0].outerHTML + ej.buildTag("td", "0")[0].outerHTML + ej.buildTag("td", "C")[0].outerHTML + ej.buildTag("td", ")")[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML, { "display": "none" })[0].outerHTML;

            var dialogContent = ej.buildTag("div#calculatedField.dlgCalculatedField", "<table class=\"outerTable\"><tr><td>" + nameLabel + "</td><td>" + calculateFieldList + "</td><td>" + addBtn + "</td></tr>" + "<tr><td>" + formulaLabel + "</td><td>" + formulaTextBox + calculatorFields + editFormula + "</td><td>" + deleteBtn + "</td></tr></table>" +"<p class=\"borderLine\"></p>"+ "<table class=\"fieldTable\"><tr><td>" + fieldsLabel + "</td></tr><tr><td>" + fieldCollection + "</td></tr><tr><td>" + insertButton + "</td></tr></table>")[0].outerHTML,
            ejDialog = ej.buildTag("div#clientDialog.clientDialog", dialogContent + dialogFooter + calculatorDiv, { "opacity": "1" }).attr("title", dialogTitle)[0].outerHTML;
            $(ejDialog).appendTo("#" + this._id);

            this.element.find(".clientDialog").ejDialog({ width: "auto", target: "#" + this._id, enableRTL: this.model.enableRTL, enableResize: false, close: ej.proxy(ej.Pivot.closePreventPanel, this) });
            $("#" + this._id + "_btnAdd" + "," + "#" + this._id + "_btnDelete" + "," + "#" + this._id + "_btnOk" + "," + "#" + this._id + "_btnCancel").ejButton({ type: ej.ButtonType.Button, width: "80", enableRTL: this.model.enableRTL });
            $("#" + this._id + "_btnInsert").ejButton({ type: ej.ButtonType.Button, enabled: false, width: "100", enableRTL: this.model.enableRTL });
            $(".calculatorFields").ejButton({ type: ej.ButtonType.Button,contentType: "imageonly", prefixIcon: "e-icon e-sigma", htmlAttributes: { title: "Click Me" }, enableRTL: this.model.enableRTL });
            $("#" + this._id + "_calculateFieldList").ejDropDownList({ width: "230px", enableRTL: this.model.enableRTL, dataSource: this._calculatedField, fields: { text: "name", value: "name" }, select: ej.proxy(this._calculatedFieldListChange, this) });

            var valueFields = [];
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                $(JSON.parse(this.getOlapReport()).PivotCalculations).each(function (e) { if (this.CalculationType != 8 && this.CalculationType != "Formula") valueFields.push({ fields: this.FieldName }); });
            }
            else {
                $($.grep(this.model.dataSource.values, function (item) { return ej.isNullOrUndefined(item.isCalculatedField) || item.isCalculatedField == false; })).each(function (e) { valueFields.push({ fields: this.fieldName }) });
            }

            var btnobject1 = $("#" + this._id + "_btnInsert").data("ejButton");
            if (this._calculatedField.length == 0) { $("#" + this._id + "_btnOk").ejButton("disable"); $("#" + this._id + "_btnOk").attr('disabled', 'disabled'); }
            $("#" + this._id + "_fieldCollection").ejListBox({ dataSource: valueFields, enableRTL: this.model.enableRTL, select: function () { btnobject1.enable(); }, height: "130", width: "400" });

            this.element.find(".e-dialog .e-close").attr("title", this._getLocalizedLabels("Close"));

            $(".calculatorFields").click(function (evt) {
                $('div.calcFormulaDiv').removeAttr("style");
            });

            $(".editFormula").click(function (evt) {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                var index = $("#" + pGridObj._id + "_calculatedFieldFormula").val().lastIndexOf(" ");
                if ($("#" + pGridObj._id + "_calculatedFieldFormula").val() !== "" && index > 0) {
                    if (index + 1 == $("#" + pGridObj._id + "_calculatedFieldFormula").val().length)
                        $("#" + pGridObj._id + "_calculatedFieldFormula").val($("#" + pGridObj._id + "_calculatedFieldFormula").val().substring(0, index - 2));
                    else
                        $("#" + pGridObj._id + "_calculatedFieldFormula").val($("#" + pGridObj._id + "_calculatedFieldFormula").val().substring(0, index) + " ");
                }
                else
                    $("#" + pGridObj._id + "_calculatedFieldFormula").val("");
            });


            $(document).click(function (event) {
                if (($(event.target).hasClass("calculatorFields")) || $(event.target).hasClass("e-sigma") || ($(event.target).parents(".calcFormulaDiv").length > 0))
                    return;
                $('div.calcFormulaDiv').css("display", "none");
            });

            $("div.calcFormulaDiv").on("click", "td", function (evt) {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                var text = this.textContent == "C" ? $("#" + pGridObj._id + "_calculatedFieldFormula").val("") : $("#" + pGridObj._id + "_calculatedFieldFormula").val($("#" + pGridObj._id + "_calculatedFieldFormula").val() + ("+-/%^*".indexOf(this.textContent) > -1 ? " " + this.textContent + " " : this.textContent));
            });

            $("#" + this._id + "_btnInsert").click(function (evt) {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                var text = $("#" + pGridObj._id + "_fieldCollection").data("ejListBox");
                $("#" + pGridObj._id + "_calculatedFieldFormula").val($("#" + pGridObj._id + "_calculatedFieldFormula").val() + text.value());
            });

            $("#" + this._id + "_btnAdd").click(function (evt) {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                var text = $("#" + pGridObj._id + "_calculatedFieldFormula").val().split(" ");
                var index = -1;
                if ($("#" + pGridObj._id + "_calculateFieldName").val() == '' || $("#" + pGridObj._id + "_calculatedFieldFormula").val() == '') {
                    ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("EmptyField"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                    return;
                }

                for (var i = 0; i < text.length; i++) {
                    index = "+-/%^*".indexOf(text[i]) > -1 ? i : -1;
                    if (index > -1 && text.length > 0 && (text[0] == "" || text[0] == "." || text[text.length - 1] == "" || text[text.length - 1] == "." || text[index + 1] == "" || text[index + 1] == ".")) {
                        ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("NotValid"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                        return;
                    }
                    else if (text[i].indexOf("(") == (text[i].length - 1) || text[i].indexOf(")") == 0 || ($("#" + pGridObj._id + "_calculatedFieldFormula").val().replace(/[^\(_]/g, "")).length != ($("#" + pGridObj._id + "_calculatedFieldFormula").val().replace(/[^\)_]/g, "")).length) {
                        ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("NotValid"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                        return;
                    }
                }

                var valueFields = [];
                if (pGridObj.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    $(JSON.parse(pGridObj.getOlapReport()).PivotCalculations).each(function (e) { if (this.CalculationType != 8 && this.CalculationType != "Formula") valueFields.push({ fields: this.FieldName }); });
                }
                else
                    $(pGridObj.model.dataSource.values).each(function (fields) { valueFields.push({ fields: this.fieldName }) });

                text = $("#" + pGridObj._id + "_calculatedFieldFormula").val().replace(/\(|\)/g, ' ').split(" ");
                for (var i = 0; i < text.length; i++) {
                    var flag = false;;
                    for (var j = 0; j < valueFields.length; j++) {
                        if ((text[i].indexOf(valueFields[j].fields) > -1) && text[i] != valueFields[j].fields) 
                            flag = true;
                        else if (text[i] == valueFields[j].fields) {
                            flag = false;
                            break;
                        }

                    }
                    if (flag) {
                        ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("NotPresent"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                        return;
                    }
                }

                for (var i = 0; i < pGridObj._calculatedField.length; i++) {
                    if (pGridObj._calculatedField[i].name == $("#" + pGridObj._id + "_calculateFieldName").val()) {
                        if (confirm(pGridObj._getLocalizedLabels("Confirm"))) {
                            pGridObj._calculatedField[i].formula = $("#" + pGridObj._id + "_calculatedFieldFormula").val();
                            $("#" + pGridObj._id + "_calculatedFieldFormula").val("");
                            $("#" + pGridObj._id + "_calculateFieldName").val("");
                            $("#" + pGridObj._id + "_calculateFieldList").ejDropDownList({ dataSource: pGridObj._calculatedField, fields: { text: "name", value: "name" }, enableRTL: pGridObj.model.enableRTL });
                            return;
                        } else
                            return;
                    }
                }

                pGridObj._calculatedField.push({ name: $("#" + pGridObj._id + "_calculateFieldName").val(), formula: $("#" + pGridObj._id + "_calculatedFieldFormula").val() });
                $("#" + pGridObj._id + "_calculatedFieldFormula").val("");
                $("#" + pGridObj._id + "_calculateFieldName").val("");
                $("#" + pGridObj._id + "_calculateFieldList").ejDropDownList({ dataSource: pGridObj._calculatedField, fields: { text: "name", value: "name" }, enableRTL: pGridObj.model.enableRTL });
                if (pGridObj._calculatedField.length > 0) { $("#" + pGridObj._id + "_btnOk").ejButton("enable"); $("#" + pGridObj._id + "_btnOk").removeAttr("disabled"); }
            });

            $("#" + this._id + "_btnDelete").click(function (evt) {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                if (pGridObj._calculatedField.length == 0) { ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("CalculatedFieldNameNotFound"), pGridObj._getLocalizedLabels("Warning"), pGridObj); return; }
                for (var i = 0; i < pGridObj._calculatedField.length; i++) {
                    if (pGridObj._calculatedField[i].name == $("#" + pGridObj._id + "_calculateFieldName").val()) {
                        //pGridObj.model.dataSource.values = $.grep(pGridObj.model.dataSource.values, function (value) { return value.fieldCaption != (pGridObj._calculatedField[i].name); });
                        pGridObj._calculatedField.splice(i, 1);
                        //pGridObj._populatePivotGrid();
                        break;
                    }
                    else if (i == pGridObj._calculatedField.length - 1) { ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("CalculatedFieldNameNotFound"), pGridObj._getLocalizedLabels("Warning"), pGridObj); return; }
                }
                $("#" + pGridObj._id + "_calculatedFieldFormula").val("");
                $("#" + pGridObj._id + "_calculateFieldName").val("");
                $("#" + pGridObj._id + "_calculateFieldList").ejDropDownList({ dataSource: pGridObj._calculatedField, fields: { text: "name", value: "name" }, enableRTL: pGridObj.model.enableRTL });
            });

            $("#" + this._id + "_btnOk").click(function (evt) {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                if (pGridObj.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode)
                    pGridObj.model.dataSource.values = $.grep(pGridObj.model.dataSource.values, function (value) { return ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false; });
                for (var i = 0; i < pGridObj._calculatedField.length; i++) {
                    var items = pGridObj._calculatedField[i].formula.replace(/\(|\)/g, " ").replace(/[-+*/^%]/g, " ").split(" ");
                    for (var k = 0; k < items.length; k++) {
                        if (!$.isNumeric(items[k]) && items[k].replace(/\s+|\s+$/gm, "") != "") {
                            var isPresent = pGridObj.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? $.grep(JSON.parse(pGridObj.getOlapReport()).PivotCalculations, function (value) { return value.FieldName == items[k] }).length : $.grep(pGridObj.model.dataSource.values, function (value) { return value.fieldName == items[k] }).length;
                            if (isPresent == 0) {
                                ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("NotPresent"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                                return;
                            }
                        }
                    }
                    var formula = pGridObj._calculatedField[i].formula.replace(/\s+|\s+$/gm, '');
                    formula = pGridObj._parenthesisAsterisk(formula);
                    if (pGridObj.model.operationalMode != ej.PivotGrid.OperationalMode.ServerMode) {
                        if ($.grep(pGridObj.model.dataSource.values, function (item) { if (item.fieldName == pGridObj._calculatedField[i].name) { item.formula = pGridObj._calculatedField[i].formula; } return item.fieldName == pGridObj._calculatedField[i].name }).length == 0) {
                            pGridObj.model.dataSource.values.push({ fieldName: pGridObj._calculatedField[i].name, fieldCaption: pGridObj._calculatedField[i].name, isCalculatedField: true, formula: formula });
                            if (pGridObj._schemaData != null && pGridObj._schemaData._tableTreeObj.element.find("li[id='" + pGridObj._calculatedField[i].name + "']").find(".e-chk-inact").length > 0)
                                pGridObj._schemaData._tableTreeObj.checkNode(pGridObj._calculatedField[i].name);
                        }
                    }
                }
                pGridObj.element.find(".e-dialog, .clientDialog").remove();
                ej.Pivot.closePreventPanel(pGridObj);
                if (pGridObj.model.operationalMode != ej.PivotGrid.OperationalMode.ServerMode)
                    pGridObj._populatePivotGrid();
                else
                {
                    if (!ej.isNullOrUndefined(pGridObj._waitingPopup))
                        pGridObj._waitingPopup.show();
                    try {
                        report = JSON.parse(pGridObj.getOlapReport()).Report;
                    }
                    catch (err) {
                        report = pGridObj.getOlapReport();
                    }
                    if (pGridObj.model.beforeServiceInvoke != null)
                        pGridObj._trigger("beforeServiceInvoke", { action: "calculatedField", element: pGridObj.element, customObject: pGridObj.model.customObject });
                    var serializedCustomObject = JSON.stringify(pGridObj.model.customObject);
                    eventArgs = JSON.stringify({ "action": "calculatedField", "headerTag": JSON.stringify(pGridObj._calculatedField), "currentReport": report, "customObject": serializedCustomObject });
                    if (!pGridObj.model.enableDeferUpdate)
                        pGridObj.doAjaxPost("POST", pGridObj.model.url + "/" + pGridObj.model.serviceMethodSettings.calculatedField, eventArgs, pGridObj._schemaData == null ? pGridObj._renderControlSuccess : pGridObj._schemaCalculatedField);
                    else {
                        if (!ej.isNullOrUndefined(pGridObj._waitingPopup))
                            pGridObj._waitingPopup.hide();
                        pGridObj.doAjaxPost("POST", pGridObj.model.url + "/" + pGridObj.model.serviceMethodSettings.calculatedField, eventArgs.replace("calculatedField", "calculatedFieldDeferUpdate"), pGridObj._schemaData == null ? pGridObj._renderControlSuccess : pGridObj._schemaCalculatedField);
                    }
                }
            });

            $("#" + this._id + "_btnCancel").click(function () {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                pGridObj.element.find(".e-dialog, .clientDialog").remove();
                ej.Pivot.closePreventPanel(pGridObj);
            });
            this._curFocus.field = this.element.find(".e-dialog .calculateFieldName").attr("tabindex", "-1").focus().addClass("hoverCell");
        },

        _schemaCalculatedField: function (msg) {
                this._schemaData._tableTreeObj.model.nodeCheck = null;
                this._schemaData._tableTreeObj.model.nodeUncheck = null;
                for (var i = 0; i < this._calculatedField.length; i++) {
                    var treeObj = this._schemaData.element.find(".schemaFieldTree").data("ejTreeView");
                    if (this._schemaData._tableTreeObj.element.find("li[id='" + this._calculatedField[i].name + "']").length == 0) {
                        var item;
                        if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode)
                            item = { id: this._calculatedField[i].name, name: this._calculatedField[i].name, caption: this._calculatedField[i].name, isSelected: true, spriteCssClass: "" }
                        else
                            item = { id: this._calculatedField[i].name, name: this._calculatedField[i].name, isSelected: true, calculationType: 8, formula: this._calculatedField[i].formula, summaryType: 6, format: null, allowRunTimeGroupByField: "false", pivotType: "PivotComputationInfo", spriteCssClass: "" };
                        this._pivotTableFields.push(item);
                        if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode)
                            this._pivotTableFields = ej.PivotAnalysis.getTreeViewData(this.model.dataSource);
                        this._schemaData._setTableFields(this._pivotTableFields);
                        treeObj.addNode(item);
                        this._schemaData._tableTreeObj.element.find(".e-item").css("padding", "0px");

                    }
                    else if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this._schemaData != null && this._schemaData._tableTreeObj.element.find("li[id='" + this._calculatedField[i].name + "']").find(".e-chk-inact").length > 0)
                        this._schemaData._tableTreeObj.checkNode(this._calculatedField[i].name);
                    else
                        this._schemaData._tableTreeObj.element.find("li[id='" + this._calculatedField[i].name + "']").removeClass("filter").find(".treeDrop , .filter").remove();
                }
                this._schemaData.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
                
                this._schemaData._tableTreeObj.model.nodeCheck = this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? ej.proxy(this._schemaData._checkedStateModified, this._schemaData) : ej.proxy(this._schemaData._pivotCheckedStateModified, this._schemaData);
                this._schemaData._tableTreeObj.model.nodeUncheck = this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? ej.proxy(this._schemaData._checkedStateModified, this._schemaData) : ej.proxy(this._schemaData._pivotCheckedStateModified, this._schemaData);
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    if (!this.model.enableDeferUpdate)
                        this._renderControlSuccess(msg);
                    else {
                        this._isUpdateRequired = true;
                        this._deferUpdateSuccess(msg);
                    }
                }
                $(this._schemaData.element.find(".schemaValue .pivotButton")).each(function () { $(this).remove(); });
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    report = JSON.parse(this.getOlapReport());
                    for (var i = 0; i < report.PivotCalculations.length; i++)
                        this._schemaData._createPivotButton(report.PivotCalculations[i].FieldHeader, "value", "", "", "");
                }
                else {
                    for (var i = 0; i < this.model.dataSource.values.length; i++)
                        this._schemaData._createPivotButton(this.model.dataSource.values[i], "value", "", "", "");
                }
                this._schemaData._setPivotBtnWidth();
        },

        _calculatedFieldListChange: function (e) {
            $("#" + this._id + "_calculateFieldName").val(e.selectedText);
            for (var i = 0; i < this._calculatedField.length; i++) {
                if (this._calculatedField[i].name == e.selectedText)
                    $("#" + this._id + "_calculatedFieldFormula").val(this._calculatedField[i].formula);
            }
        },

        _parenthesisAsterisk: function (formula) {
            for (var j = 1; j < formula.length - 1; j++) {
                if (formula[j] == "(" && "+-/%^*(".indexOf(formula[j - 1]) == -1) {
                    formula = formula.substring(0, j) + "*" + formula.substring(j);
                    j--;
                }
                if (formula[j] == ")" && "+-/%^*)".indexOf(formula[j + 1]) == -1) {
                    formula = formula.substring(0, j + 1) + "*" + formula.substring(j + 1);
                    j--;
                }
            }
            return formula;
        },

        _calcFieldNodeDrop:function(droppedItem){
                var schemaRemoveElement = $.grep(this.model.dataSource.values, function (value) {
                    return value.isCalculatedField == true && value.formula.indexOf(droppedItem.fieldName) > -1;
                });
                for (var i = 0; i < schemaRemoveElement.length; i++)
                    this._schemaData._tableTreeObj.uncheckNode(schemaRemoveElement[i].fieldName);
        },

        _schemaButtonCreate:function(){

            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                $(this._schemaData.element.find(".schemaValue .pivotButton")).each(function () { $(this).remove(); });
                report = JSON.parse(this.getOlapReport());
                for (var i = 0; i < report.PivotCalculations.length; i++)
                    this._schemaData._createPivotButton(report.PivotCalculations[i].FieldHeader, "value", "", "", "");
            }
            this._schemaData._setPivotBtnWidth();
        },

        _calculatedFieldNodeRemove: function (headerTag) {
        
            var removeElement = $.grep(JSON.parse(this.getOlapReport()).PivotCalculations, function (value) { return value.CalculationType == 8 && value.Formula.indexOf(headerTag["id"]) > -1; })
            for (var i = 0; i < removeElement.length; i++) {
                this._schemaData._tableTreeObj.model.nodeUncheck = null;
                this._schemaData._tableTreeObj.uncheckNode(removeElement[i].FieldName);
                this._schemaData._tableTreeObj.element.find("li[id='" + removeElement[i].FieldName + "']").removeClass("filter").find(".treeDrop").remove()
                this._schemaData._tableTreeObj.model.nodeUncheck = ej.proxy(this._schemaData._checkedStateModified, this._schemaData);
            }
        },

        openConditionalFormattingDialog: function () {
            ej.Pivot.openPreventPanel(this);
            this.element.find(".e-dialog").remove();
            var ejDialog = ej.buildTag("div#" + this._id + "_clientDlg.clientDialog", { "opacity": "1" })[0].outerHTML;
            var dialogContent; var dialogTitle; var currentTag;
            var ddlBackColor, ddlBorderColor, ddlBorderStyle, ddlBorderWidth, ddlFont, ddlFontSize, ddlEditCondition, ddlConditionTYpe, removeBtn, okBtn, cancelBtn;
            dialogTitle = this._getLocalizedLabels("ConditionalFormatting");
            var conditionLbl = ej.buildTag("label#" + this._id + "_conLbl.conditionLbl", this._getLocalizedLabels("Condition"))[0].outerHTML;
            var conditionDropDown = ej.buildTag("input#" + this._id + "_conType.conditionType", "", {}, { type: 'text', tabindex: 0, accesskey: 'f' })[0].outerHTML;
            var editcondition = ej.buildTag("label#" + this._id + "_editcond.editcondition", this._getLocalizedLabels("Editcondtion"))[0].outerHTML;
            var value1Lbl = ej.buildTag("label#" + this._id + "_value1.value1", this._getLocalizedLabels("Value1"))[0].outerHTML;
            var value2Lbl = ej.buildTag("label#" + this._id + "_value2.value2", this._getLocalizedLabels("Value2"))[0].outerHTML;
            var backcolorLbl = ej.buildTag("label#" + this._id + "_backcolorLbl.backcolorLbl", this._getLocalizedLabels("Backcolor"))[0].outerHTML;
            var bordercolorLbl = ej.buildTag("label#" + this._id + "_bordercolorLbl.bordercolorLbl", this._getLocalizedLabels("Bordercolor"))[0].outerHTML;
            var borderrangeLbl = ej.buildTag("label#" + this._id + "_borderrangeLbl.borderrangeLbl", this._getLocalizedLabels("Borderrange"))[0].outerHTML;
            var borderstyleLbl = ej.buildTag("label#" + this._id + "_borderstyleLbl.borderstyleLbl", this._getLocalizedLabels("Borderstyle"))[0].outerHTML;
            var fStyleLbl = ej.buildTag("label#" + this._id + "_fStyleLbl.fStyleLbl", this._getLocalizedLabels("Fontstyle"))[0].outerHTML;
            var fSizeLbl = ej.buildTag("label#" + this._id + "_fSizeLbl.fSizeLbl", this._getLocalizedLabels("Fontsize"))[0].outerHTML;
            var fValueLbl = ej.buildTag("label#" + this._id + "_fValueLbl.fValueLbl", this._getLocalizedLabels("Measures"))[0].outerHTML;
            var editconditionDropDown = ej.buildTag("input#" + this._id + "_editCon.editconditionDropDown", "", {}, { type: 'text', tabindex: 1, accesskey: 'e' })[0].outerHTML;
            var removeBtn = ej.buildTag("button#" + this._id + "_removeBtn.dialogremoveBtn e-icon", "", {}, { name: this._getLocalizedLabels("Remove") }).attr("role", "button").attr("aria-label", "remove")[0].outerHTML;
            var value1 = ej.buildTag("input#" + this._id + "_conFrom.conditionFrom", "", {}, { name: 'inputVal', type: ej.isMobile() ? 'number' : 'text', inputmode: ej.isMobile() ? 'numeric' : '', pattern: ej.isMobile() ? '[0-9]*' : '', tabindex: 2 })[0].outerHTML;
            var value2 = ej.buildTag("input#" + this._id + "_conTo.conditionTo", "", {}, { name: 'inputVal', type: ej.isMobile() ? 'number' : 'text', inputmode: ej.isMobile() ? 'numeric' : '', pattern: ej.isMobile() ? '[0-9]*' : '', tabindex: 3 })[0].outerHTML;
            var backcolor = ej.buildTag("input#" + this._id + "_backcolor.backcolor", "", {}, { type: 'text', tabindex: 4, accesskey: 'b' })[0].outerHTML;
            var bordercolor = ej.buildTag("input#" + this._id + "_bordercolor.bordercolor", "", {}, { type: 'text', tabindex: 5, accesskey: 'c' })[0].outerHTML;
            var borderrange = ej.buildTag("input#" + this._id + "_borderrange.borderrange", "", {}, { type: 'text', tabindex: 6, accesskey: 'r' })[0].outerHTML;
            var borderstyle = ej.buildTag("input#" + this._id + "_borderstyle.borderstyle", "", {}, { type: 'text', tabindex: 7, accesskey: 's' })[0].outerHTML;
            var fStyle = ej.buildTag("input#" + this._id + "_fStyle.fStyle", "", {}, { type: 'text', tabindex: 8, accesskey: 'o' })[0].outerHTML;
            var fSize = ej.buildTag("input#" + this._id + "_fSize.fSize", "", {}, { type: 'text', tabindex: 9, accesskey: 'l' })[0].outerHTML;
            var fValue = ej.buildTag("input#" + this._id + "_fValue.fValue", "", {}, { type: 'text', tabindex: 10, accesskey: 'v' })[0].outerHTML;
            var conditionDiv = ej.buildTag("div#" + this._id + "_conditionDlg.conditionDlg", "<table class='conditionformatTbl'><tr><td>" + conditionLbl + "</td><td>" + conditionDropDown + "</td><td>" + editcondition + "</td><td>" + editconditionDropDown + "</td><td>" + removeBtn + "</td></tr><tr><td>" + value1Lbl + "</td><td>" + value1 + "</td><td>" + value2Lbl + "</td><td>" + value2 + "</td></tr><tr><td>" + backcolorLbl + "</td><td>" + backcolor + "</td><td>" + borderrangeLbl + "</td><td>" + borderrange + "</td></tr><tr><td>" + bordercolorLbl + "</td><td>" + bordercolor + "</td><td>" + borderstyleLbl + "</td><td>" + borderstyle + "</td></tr><tr><td>" + fStyleLbl + "</td><td>" + fStyle + "</td><td>" + fSizeLbl + "</td><td>" + fSize + "</td></tr><tr><td>" + fValueLbl + "</td><td>" + fValue + "</td></tr></table>")[0].outerHTML;
            dialogContent = conditionDiv;
            var OKBtn = ej.buildTag("button#" + this._id + "_OKBtn.dialogOKBtn", "", {}, { name: this._getLocalizedLabels("OK") })[0].outerHTML;
            var CancelBtn = ej.buildTag("button#" + this._id + "_CancelBtn.dialogCancelBtn", "", {}, { name: this._getLocalizedLabels("Cancel") })[0].outerHTML;
            dialogFooter = ej.buildTag("div", OKBtn + CancelBtn, { "float": this.model.enableRTL ? "left" : "right", "margin": "20px 39px 6px" })[0].outerHTML;
            $("#" + this._id).after(ejDialog);

            $("#" + this._id + "_clientDlg").append(dialogContent + dialogFooter);

            $("#" + this._id + "_clientDlg").ejDialog({ width: "auto", target: "#" + this._id, enableResize: false, enableRTL: this.model.enableRTL, close: ej.proxy(ej.Pivot.closePreventPanel, this) });
            $(".e-titlebar").prepend(ej.buildTag("div", dialogTitle, { "display": "inline" })[0].outerHTML)[0];
            $("#" + this._id + "_OKBtn" + "," + "#" + this._id + "_CancelBtn" + "," + "#" + this._id + "_removeBtn").ejButton({ type: ej.ButtonType.Button });
            $("#" + this._id + "_OKBtn" + "," + "#" + this._id + "_CancelBtn").css({ margin: "0 0 0 10px", width: "67px" });
            $("#" + this._id + "_removeBtn").css({ width: "29px", height: "29px" });
            $("#" + this._id + "_conFrom" + "," + "#" + this._id + "_conTo").css({ width: "200px", height: "26px" });
            $("#" + this._id + "_conditionDlg").css({ margin: "13px 0 0 0" });
            $("#" + this._id + "_editcond" + "," + "#" + this._id + "_value2" + "," + "#" + this._id + "_borderrangeLbl" + "," + "#" + this._id + "_borderstyleLbl" + "," + "#" + this._id + "_fSizeLbl").css({ margin: "0 0 0 15px" });

            $("#" + this._id + "_conTo").attr("disabled", "disabled");
            this.removeBtn = $("#" + this._id + "_removeBtn").data("ejButton");
            okBtn = $("#" + this._id + "_OKBtn").data("ejButton");
            cancelBtn = $("#" + this._id + "_CancelBtn").data("ejButton");
            this.removeBtn.setModel({ "enabled": false });
            okBtn.setModel({ text: this._getLocalizedLabels("OK") });
            cancelBtn.setModel({ text: this._getLocalizedLabels("Cancel") });
            $("#" + this._id + "_conType").ejDropDownList({
                change: "_activeConditionChange",
                dataSource: [{ option: "Less Than", value: this._getLocalizedLabels("LessThan") },
                             { option: "Less Than Or Equal To", value: this._getLocalizedLabels("LessThanOrEqualTo") },
                             { option: "Greater Than", value: this._getLocalizedLabels("GreaterThan") },
                             { option: "Greater Than Or Equal To", value: this._getLocalizedLabels("GreaterThanOrEqualTo") },
                             { option: "Equals", value: this._getLocalizedLabels("Equals") },
                             { option: "Not Equals", value: this._getLocalizedLabels("NotEquals") },
                             { option: "Between", value: this._getLocalizedLabels("Between") },
                             { option: "Not Between", value: this._getLocalizedLabels("NotBetween") },
                            ],
                fields: { text: "value", value: "option" },
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px"
            });
            $("#" + this._id + "_editCon").ejDropDownList({
                change: "_editConditionChange",
                dataSource: this._list,
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px"
            });
            $("#" + this._id + "_backcolor").ejDropDownList({
                dataSource: [{ option: "AliceBlue", value: this._getLocalizedLabels("AliceBlue") },
                             { option: "Black", value: this._getLocalizedLabels("Black") },
                             { option: "Blue", value: this._getLocalizedLabels("Blue") },
                             { option: "Brown", value: this._getLocalizedLabels("Brown") },
                             { option: "Gold", value: this._getLocalizedLabels("Gold") },
                             { option: "Green", value: this._getLocalizedLabels("Green") },
                             { option: "Lime", value: this._getLocalizedLabels("Lime") },
                             { option: "Maroon", value: this._getLocalizedLabels("Maroon") },
                             { option: "Orange", value: this._getLocalizedLabels("Orange") },
                             { option: "Pink", value: this._getLocalizedLabels("Pink") },
                             { option: "Red", value: this._getLocalizedLabels("Red") },
                             { option: "Violet", value: this._getLocalizedLabels("Violet") },
                             { option: "White", value: this._getLocalizedLabels("White") },
                             { option: "Yellow", value: this._getLocalizedLabels("Yellow") },
                           ],
                fields: { text: "value", value: "option" },
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px"
            });
            $("#" + this._id + "_bordercolor").ejDropDownList({
                dataSource: [{ option: "AliceBlue", value: this._getLocalizedLabels("AliceBlue") },
                             { option: "Black", value: this._getLocalizedLabels("Black") },
                             { option: "Blue", value: this._getLocalizedLabels("Blue") },
                             { option: "Brown", value: this._getLocalizedLabels("Brown") },
                             { option: "Gold", value: this._getLocalizedLabels("Gold") },
                             { option: "Green", value: this._getLocalizedLabels("Green") },
                             { option: "Lime", value: this._getLocalizedLabels("Lime") },
                             { option: "Maroon", value: this._getLocalizedLabels("Maroon") },
                             { option: "Orange", value: this._getLocalizedLabels("Orange") },
                             { option: "Pink", value: this._getLocalizedLabels("Pink") },
                             { option: "Red", value: this._getLocalizedLabels("Red") },
                             { option: "Violet", value: this._getLocalizedLabels("Violet") },
                             { option: "White", value: this._getLocalizedLabels("White") },
                             { option: "Yellow", value: this._getLocalizedLabels("Yellow") },
                            ],
                fields: { text: "value", value: "option" },
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px"
            });
            $("#" + this._id + "_borderrange").ejDropDownList({
                dataSource: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px"
            });
            $("#" + this._id + "_borderstyle").ejDropDownList({
                dataSource: [{ option: "Solid", value: this._getLocalizedLabels("Solid") },
                             { option: "Dashed", value: this._getLocalizedLabels("Dashed") },
                             { option: "Dotted", value: this._getLocalizedLabels("Dotted") },
                             { option: "Double", value: this._getLocalizedLabels("Double") },
                             { option: "Groove", value: this._getLocalizedLabels("Groove") },
                             { option: "Inset", value: this._getLocalizedLabels("Inset") },
                             { option: "Outset", value: this._getLocalizedLabels("Outset") },
                             { option: "Ridge", value: this._getLocalizedLabels("Ridge") },
                             { option: "None", value: this._getLocalizedLabels("None") },
                            ],
                fields: { text: "value", value: "option" },
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px"
            });
            $("#" + this._id + "_fStyle").ejDropDownList({
                dataSource: [{ option: "Algerian", value: this._getLocalizedLabels("Algerian") },
                             { option: "Arial", value: this._getLocalizedLabels("Arial") },
                             { option: "Bodoni MT", value: this._getLocalizedLabels("BodoniMT") },
                             { option: "Britannic Bold", value: this._getLocalizedLabels("BritannicBold") },
                             { option: "Cambria", value: this._getLocalizedLabels("Cambria") },
                             { option: "Calibri", value: this._getLocalizedLabels("Calibri") },
                             { option: "Courier New", value: this._getLocalizedLabels("CourierNew") },
                             { option: "DejaVu Sans", value: this._getLocalizedLabels("DejaVuSans") },
                             { option: "Forte", value: this._getLocalizedLabels("Forte") },
                             { option: "Gerogia", value: this._getLocalizedLabels("Gerogia") },
                             { option: "Impact", value: this._getLocalizedLabels("Impact") },
                             { option: "Segoe UI", value: this._getLocalizedLabels("SegoeUI") },
                             { option: "Tahoma", value: this._getLocalizedLabels("Tahoma") },
                             { option: "Times New Roman", value: this._getLocalizedLabels("TimesNewRoman") },
                             { option: "Verdana", value: this._getLocalizedLabels("Verdana") },
                             { option: "None", value: this._getLocalizedLabels("None") },
                            ],
                fields: { text: "value", value: "option" },
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px"
            });
            $("#" + this._id + "_fSize").ejDropDownList({
                dataSource: ["12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px"
            });
            var dataSource = [],value,fvalue;
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                value = JSON.parse(this.getOlapReport()).PivotCalculations;
                fvalue = "FieldHeader";
            }
            else {
                fvalue = "fieldCaption";
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    value = this.model.dataSource.values;
                }
                else {
                    for (var i = 0; i < this.model.dataSource.values.length; i++) {
                        value = this.model.dataSource.values[i].measures;
                    }
                }
            }
            dataSource = value.length > 0 ? ["All"] : dataSource;
            for (var j = 0; j < value.length; j++) {
                dataSource.push(value[j][fvalue]);
            }
            dataSource = dataSource.length > 0 ? dataSource : ["No Measure"];
            $("#" + this._id + "_fValue").ejDropDownList({
                dataSource: dataSource,
                selectedIndices: [0],
                enableRTL: this.model.enableRTL,
                width: "200px",
                height: "30px"
            });
            this.element.find("#" + this._id + "_conType").ejDropDownList("option", "change", ej.proxy(this._activeConditionChange, this));
            this.element.find("#" + this._id + "_editCon").ejDropDownList("option", "change", ej.proxy(this._editConditionChange, this));

            this.isNewFormat = true;
            this.ddlEditCondition = $("#" + this._id + "_editCon").data("ejDropDownList");
            this.ddlConditionType = $("#" + this._id + "_conType").data("ejDropDownList");
            this.ddlFont = $("#" + this._id + "_fStyle").data("ejDropDownList");
            this.ddlFontSize = $("#" + this._id + "_fSize").data("ejDropDownList");
            this.ddlBackColor = $("#" + this._id + "_backcolor").data("ejDropDownList");
            this.ddlBorderColor = $("#" + this._id + "_bordercolor").data("ejDropDownList");
            this.ddlBorderStyle = $("#" + this._id + "_borderstyle").data("ejDropDownList");
            this.ddlBorderWidth = $("#" + this._id + "_borderrange").data("ejDropDownList");
            this.ddlFieldValue = $("#" + this._id + "_fValue").data("ejDropDownList");
            this.element.find("#" + this._id + "_conFrom" + "," + "#" + this._id + "_conTo").keypress(function (event) {
                if (event.which == 8 || event.which == 0) {
                    return true;
                }

                if (event.which < 45 || (event.which ==45 && (event.target.value != "" || (event.target.value.indexOf("-") > -1))) || event.which > 58) {
                    return false;
                }
                if ((event.which == 46 && $(this).val().indexOf('.') != -1) || event.which == 47) {
                    return false;
                }
            });
            $("#" + this._id + "_OKBtn").click(function () {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                this.ddlEditCondition = $("#" + pGridObj._id + "_editCon").data("ejDropDownList");
                if ($("#" + pGridObj._id + '_conFrom').val() == '') {
                    ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("EnterOperand1"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                }

                else if (!($("#" + pGridObj._id + "_conTo").attr("disabled")) && $("#" + pGridObj._id + '_conTo').val() == '') {
                    ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("EnterOperand2"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                }
                else if ($("#" + pGridObj._id + "_fValue").attr("disabled") && $("#" + pGridObj._id + '_fValue').val() == 'No Measure') {
                    ej.Pivot._createErrorDialog(pGridObj._getLocalizedLabels("NoMeasure"), pGridObj._getLocalizedLabels("Warning"), pGridObj);
                }
                else {
                    pGridObj._applyFormatting();
                    ej.Pivot.closePreventPanel(pGridObj);
                }
            });

            if (this.ddlEditCondition.getListData().length > 1) {
                $("#" + this._id + "_editCon").ejDropDownList("enable");
            }
            else {
                $("#" + this._id + "_editCon").ejDropDownList("disable");
                $("#" + this._id + "_editcond").css("color", "#cbcbcb");
            }
            if (this.ddlFieldValue.getListData().length == 1 && this.ddlFieldValue._selectedValue == "No Measure") {
                $("#" + this._id + "_fValue").ejDropDownList("disable");
                $("#" + this._id + "_fValueLbl").css("color", "#cbcbcb");
            }
            else {
                $("#" + this._id + "_fValue").ejDropDownList("enable");
            }
            if (this._cFormat.length > 0) {
                this.ddlEditCondition.selectItemByValue(this._cFormat[this._cFormat.length - 1].split(",")[0]);
                this._editConditionChange();
            }
            $("#" + this._id + "_removeBtn").click(function () {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                if (!pGridObj.removeBtn.option('enabled')) return;
                var condition = confirm(pGridObj._getLocalizedLabels("ConditionalFormattingConformMsg"));
                if (condition == true){
                    var Index = pGridObj.ddlEditCondition._selectedIndices[0];
                    pGridObj._removeCellFormatting(Index, condition);
                }
            });
            $("#" + this._id + "_CancelBtn").click(function () {
                var pGridObj = $(this).parents(".e-pivotgrid").data("ejPivotGrid");
                pGridObj.element.find(".e-dialog, .clientDialog").remove();
                ej.Pivot.closePreventPanel(pGridObj);
            });
            return false;
        },

        _activeConditionChange: function (args) {
            if (args.selectedValue == "Between" || args.selectedValue == "Not Between")
                $("#" + this._id + "_conTo").removeAttr("disabled");
            else {
                $("#" + this._id + "_conTo").attr("disabled", "disabled");
                $("#" + this._id + "_conTo").val("");
            }
        },

        _editConditionChange: function () {
            if (this.ddlEditCondition._selectedIndices[0] > 0) {
                var i = (this.ddlEditCondition._selectedIndices[0]) - 1;
                var array = this._cFormat[i].split(",");
                this.ddlConditionType.selectItemByValue(array[1]);
                $("#" + this._id + '_conFrom').val(array[8]);
                if (array[9] != "undefined")
                    $("#" + this._id + '_conTo').val(array[9]);
                this.ddlBackColor.selectItemByValue(array[2]);
                this.ddlBorderColor.selectItemByValue(array[3]);
                this.ddlBorderStyle.selectItemByValue(array[7]);
                this.ddlBorderWidth.selectItemByValue(array[4]);
                this.ddlFont.selectItemByValue(array[5]);
                this.ddlFontSize.selectItemByValue(array[6]);
                this.ddlFieldValue.selectItemByValue(array[10]);
                this.removeBtn.option('enabled', true);
                this._conditionTypeChange();
            }
            else {
                this.removeBtn.option('enabled', false);
                this._clearWindow();
            }
        },

        _clearWindow: function () {
            $("#" + this._id + "_clientDlg").find("#" + this._id + "_conFrom" + "," + "#" + this._id + "_conTo").val('');
            $("#" + this._id + "_conTo").disabled = true;
        },

        _conditionTypeChange: function () {
            $("#" + this._id + "_conTo").disabled = !(this.ddlConditionType._selectedIndices[0] == 4 || this.ddlConditionType._selectedIndices[0] == 5);
        },

        _removeCellFormatting: function (index, flag) {
            var Index = index;
            for (var j = 0; j < this._cFormat.length && index; j++) { 
                if (flag) {
                    j = index - 1;
                    index = 0;
                }
                for (var i = 0; i < this._JSONRecords.length; i++) {
                    this._JSONRecords[i].CSS = this._JSONRecords[i].CSS.replace(" " + this._cFormat[j].split(",")[0], "");
                }
            }
            if (flag) {
                this._cFormat.splice(Index - 1, 1);
                this._list.splice(Index, 1);
            }
            else {
                this._cFormat = [];
                this._list = [];
            }
            this.renderControlFromJSON();
        },

        _applyStyle: function(axis,jsonValue,mValue,val,fv1,fv2,condition,i,format){
            var css = jsonValue.CSS, isValue = false;
            var value = axis == "rows" ? jsonValue.Index.split(",")[1] : axis == "columns" ? jsonValue.Index.split(",")[0] : null;
            if (jsonValue.Value == mValue || mValue == "All") {
                $.inArray(Number(value), val) == -1 ? val.push(Number(value)) : val;
            }
            var num = $.isNumeric(jsonValue.Value) == true ? jsonValue.Value : jsonValue.Value.replace(/[^\d.]/g, '');
            $.inArray(Number(value), val) != -1 ? isValue = true : isValue = false;
            if (this._getResult(Number(fv1), Number(fv2), num, condition) && num != "" && $.isNumeric(num) && isValue && jsonValue.CSS.indexOf("value") != -1) {
                jsonValue.CSS = css + " " + format;
            }
        },

        _refreshCellFormatting: function (jsonObj) {
            var axis = this._getAxis();
            var isValue = false;
            for (var j = 0; j < this._cFormat.length; j++) {
                var val = [];
                var array = this._cFormat[j].split(",");
                for (var i = 0; i < jsonObj.length; i++) {
                    if (jsonObj[i].CSS.indexOf(array[0]) === -1) {
                        this._applyStyle(axis, jsonObj[i], array[10], val, array[8], array[9], array[1], i, this._cFormat[j].split(",")[0]);
                    }
                }
            }
            return jsonObj;
        },

        _createDynamicRule: function (bgcolor, borderstyle, borderwidth, bordercolor, fontsize, fontstyle, name) {
            var sheet = (function () {
                var style = document.createElement("style");
                style.appendChild(document.createTextNode(""));
                document.head.appendChild(style);
                return style.sheet;
            })();
            var str = "background-color: " + bgcolor + " !important;border:" + borderstyle + " " + borderwidth + "px " + bordercolor + " !important;font:" + fontsize + "px " + fontstyle + " !important;"
            sheet.insertRule("." + name +"{"+str+"}",0);
        },

        _getAxis: function () {
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                var field = null,axis;
                if (this.getOlapReport() != undefined && this.getOlapReport() != "" && JSON.parse(this.getOlapReport()).PivotCalculations.length > 0) {
                    field = JSON.parse(this.getOlapReport()).PivotCalculations[0].FieldHeader
                }
                for (var i = 0; i < this._JSONRecords.length; i++) {
                    if (this._JSONRecords[i].Value == field) {
                        axis = this._JSONRecords[i].CSS == "colheader" ? "columns" : this._JSONRecords[i].CSS == "rowheader" ? "rows" : "";
                        break;
                    }
                }
            }
            else {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    axis = "columns";
                }
                else {
                    for (var i = 0; i < this.getOlapReport().values.length; i++) {
                        axis = this.getOlapReport().values[i].axis;
                    }
                }
            }
            return axis;
        },
        _applyCodeBehindFormatting: function (jsonObj) {
            var st;
            var isValue = false;
            this._isFormatApply = true;
            var axis = this._getAxis();
            if (!ej.isNullOrUndefined(this.model.conditionalFormatSettings)) {
                for (var l = 0; l < this.model.conditionalFormatSettings.length; l++) {
                    var array = [];
                    array = this.model.conditionalFormatSettings[l].measures.split(",");
                    if ($.inArray(this.model.conditionalFormatSettings[l].name, this._list) == -1) {
                        for (var j = 0; j < array.length; j++) {
                            var val = [];
                            st = array[j];
                            for (var i = 0; i < jsonObj.length; i++) {
                                this._applyStyle(axis, jsonObj[i], st, val, this.model.conditionalFormatSettings[l].value.split(",")[0], this.model.conditionalFormatSettings[l].value.split(",")[1], this.model.conditionalFormatSettings[l].condition, i, this.model.conditionalFormatSettings[l].name);
                            }
                        }
                        var format = this.model.conditionalFormatSettings[l].name + "," + this.model.conditionalFormatSettings[l].condition + "," + this.model.conditionalFormatSettings[l].style.backgroundcolor + "," + this.model.conditionalFormatSettings[l].style.bordercolor + "," + this.model.conditionalFormatSettings[l].style.borderwidth + "," + this.model.conditionalFormatSettings[l].style.fontstyle + "," + this.model.conditionalFormatSettings[l].style.fontsize + "," + this.model.conditionalFormatSettings[l].style.borderstyle + "," + this.model.conditionalFormatSettings[l].value.split(",")[0] + "," + this.model.conditionalFormatSettings[l].value.split(",")[1] + "," + st;
                        this._cFormat.push(format);
                        this._list.push(this.model.conditionalFormatSettings[l].name);
                        this._createDynamicRule(this.model.conditionalFormatSettings[l].style.backgroundcolor, this.model.conditionalFormatSettings[l].style.borderstyle, this.model.conditionalFormatSettings[l].style.borderwidth, this.model.conditionalFormatSettings[l].style.bordercolor, this.model.conditionalFormatSettings[l].style.fontsize, this.model.conditionalFormatSettings[l].style.fontstyle, this.model.conditionalFormatSettings[l].name);
                    }
                }
            }
            this._JSONRecords = jsonObj;
            return jsonObj;
        },

        _applyFormatting: function () {
            var format, formatName, json, index, st, val = [], axis;
            var isValue = false;
            if (!ej.isNullOrUndefined($("#" + this._id + '_conFrom').val())) {
                this._formatValue1 = $("#" + this._id + '_conFrom').val(), this._formatValue2 = $("#" + this._id + '_conTo').val(), cdnTxt = this.ddlConditionType._selectedValue, color = this.ddlBackColor._selectedValue, bordercolor = this.ddlBorderColor._selectedValue,
                    borderrange = this.ddlBorderWidth._selectedValue, fStyle = this.ddlFont._selectedValue, fSize = this.ddlFontSize._selectedValue, borderstyle = this.ddlBorderStyle._selectedValue, editCdn = this.ddlEditCondition._selectedValue;
            }
            st = this.ddlFieldValue._selectedValue != undefined ? this.ddlFieldValue._selectedValue : "";
            axis = this._getAxis();
            if ($("#" + this._id + "_editCon").val() == this._getLocalizedLabels("AddNew")) {
                for (var i = this._cFormat.length; i < this._cFormat.length + 1; i++) {
                    formatName = "Format" + i;
                    for (var j = i; $.inArray(formatName, this._list) != -1; j++) {
                        formatName = "Format" + j;
                    }
                }
                format = formatName + "," + this.ddlConditionType._selectedValue + "," + color + "," + bordercolor + "," + borderrange + "," + fStyle + "," + fSize + "," + borderstyle + "," + this._formatValue1 + "," + this._formatValue2 + "," + st;
                this._cFormat.push(format);
                this._list.push(formatName);
            }
            else {
                formatName = this.ddlEditCondition._selectedValue;
                index = this.ddlEditCondition._selectedIndices[0] - 1;
                this._cFormat[index] = formatName + "," + this.ddlConditionType._selectedValue + "," + color + "," + bordercolor + "," + borderrange + "," + fStyle + "," + fSize + "," + borderstyle + "," + this._formatValue1 + "," + this._formatValue2 + "," + st;
                for (var i = 0; i < this._JSONRecords.length; i++) {
                    this._JSONRecords[i].CSS = this._JSONRecords[i].CSS.replace(" " + formatName, "");
                }
            }
            for (var i = 0; i < this._JSONRecords.length; i++) {
                this._applyStyle(axis, this._JSONRecords[i], st, val, this._formatValue1, this._formatValue2, this.ddlConditionType._selectedValue, i, formatName);
            }
            this._createDynamicRule(color, borderstyle, borderrange, bordercolor, fSize, fStyle, formatName);
            this.renderControlFromJSON();
            this.element.find(".e-dialog, .clientDialog").remove();
        },

        _getResult: function (conditionalValue1, conditionalValue2, cellValue, operator) {
            switch (operator) {
                case "Less Than":
                    return cellValue < conditionalValue1;
                    break;
                case "Less Than Or Equal To":
                    if (cellValue <= conditionalValue1)
                        return cellValue;
                    break;
                case "Greater Than":
                    return cellValue > conditionalValue1;
                    break;
                case "Greater Than Or Equal To":
                    if (cellValue >= conditionalValue1)
                        return cellValue;
                    break;
                case "Equals":
                    if (cellValue == conditionalValue1)
                        return cellValue;
                    break;
                case "Not Equals":
                    return cellValue != conditionalValue1;
                    break;
                case "Between":
                    return (conditionalValue1 < conditionalValue2 && cellValue > conditionalValue1 && cellValue < conditionalValue2) ||
                    (conditionalValue1 > conditionalValue2 && cellValue < conditionalValue1 && cellValue > conditionalValue2) ||
                    (cellValue == conditionalValue1 && cellValue == conditionalValue2);
                    break;
                case "Not Between":
                    return !((conditionalValue1 < conditionalValue2 && cellValue > conditionalValue1 && cellValue < conditionalValue2) ||
                    (conditionalValue1 > conditionalValue2 && cellValue < conditionalValue1 && cellValue > conditionalValue2) ||
                    (cellValue == conditionalValue1 && cellValue == conditionalValue2));
                    break;
            }
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
        _renderControlSuccess: function (msg) {
            try {
                if (msg[0] != undefined && msg.length > 0) {
                    this.setJSONRecords(msg[0].Value); this.setOlapReport(msg[1].Value);
                    if (msg[2] != null && msg[2] != undefined && msg[2].Key == "PageSettings") {
                        if (this.model.enableVirtualScrolling || ((typeof (oclientProxy) != "undefined") && oclientProxy.model.enableVirtualScrolling)) {
                            this._categPageCount = Math.ceil(JSON.parse(msg[3].Value).Column / JSON.parse(msg[2].Value).CategorialPageSize);
                            this._seriesPageCount = Math.ceil(JSON.parse(msg[3].Value).Row / JSON.parse(msg[2].Value).SeriesPageSize);
                            this._categCurrentPage = JSON.parse(msg[2].Value).CategorialCurrentPage;
                            this._seriesCurrentPage = JSON.parse(msg[2].Value).SeriesPageSize;
                        }
                        else if ($(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined && this._pagerObj!=null)
                            this._pagerObj.initPagerProperties(JSON.parse(msg[3].Value), JSON.parse(msg[2].Value));
                        if (!ej.isNullOrUndefined(msg[4])) {
                            if (msg[4].Key == "DataSet") {
                                this._dataSet = msg[4].Value;
                                if (!ej.isNullOrUndefined(msg[5]))
                                    this.model.customObject = msg[5].Value;
                            }
                            else
                                this.model.customObject = msg[4].Value;
                        }
                    }
                    if (!ej.isNullOrUndefined(msg[2]) && msg[2].Key != "PageSettings") {
                        if (msg[2].Key == "DataSet") {
                            this._dataSet = msg[2].Value;
                            if (!ej.isNullOrUndefined([3]))
                                this.model.customObject = msg[3].Value;
                        }
                        else
                            this.model.customObject = msg[2].Value;
                    }
                    if ((typeof (oclientProxy) != "undefined") && oclientProxy._pagerObj != null) {
                        this._updatePageSettings(msg, oclientProxy)
                    }
                }
                else if (msg.d != undefined && msg.d.length > 0) {
                    this.setJSONRecords(msg.d[0].Value); this.setOlapReport(msg.d[1].Value);
                    if (msg.d[2] != null && msg.d[2] != undefined && msg.d[2].Key == "PageSettings") {
                        if (this.model.enableVirtualScrolling || ((typeof (oclientProxy) != "undefined") && oclientProxy.model.enableVirtualScrolling)) {
                            this._categPageCount = Math.ceil(JSON.parse(msg.d[3].Value).Column / JSON.parse(msg.d[2].Value).CategorialPageSize);
                            this._seriesPageCount = Math.ceil(JSON.parse(msg.d[3].Value).Row / JSON.parse(msg.d[2].Value).SeriesPageSize);
                            this._categCurrentPage = JSON.parse(msg.d[2].Value).CategorialCurrentPage;
                            this._seriesCurrentPage = JSON.parse(msg.d[2].Value).SeriesCurrentPage;
                        }
                        else if (this._pagerObj !=null && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                            this._pagerObj.initPagerProperties(JSON.parse(msg.d[3].Value), JSON.parse(msg.d[2].Value));
                        if (!ej.isNullOrUndefined(msg.d[4])) {
                            if (msg.d[4].Key == "DataSet") {
                                this._dataSet = msg.d[4].Value;
                                if (!ej.isNullOrUndefined(msg.d[5]))
                                    this.model.customObject = msg.d[5].Value;
                            }
                            else
                                this.model.customObject = msg.d[4].Value;
                        }
                        if ((typeof (oclientProxy) != "undefined") && oclientProxy._pagerObj != null) {
                            this._updatePageSettings(msg.d, oclientProxy);
                        }
                    }
                    else if ((typeof (oclientProxy) != "undefined") && oclientProxy._pagerObj != null && (msg.d.length==2)) {
                        oclientProxy._pagerObj.element.css("opacity", "0.5");
                        oclientProxy._pagerObj.element.find(".pagerTextBox").attr('disabled', 'disabled');
                        oclientProxy._pagerObj._unwireEvents();
                    }
                    if (!ej.isNullOrUndefined(msg[2]) && msg.d[2].Key != "PageSettings") {
                        if (msg.d[2].Key == "DataSet") {
                            this._dataSet = msg.d[2].Value;
                            if (!ej.isNullOrUndefined([3]))
                                this.model.customObject = msg.d[3].Value;
                        }
                        else
                            this.model.customObject = msg.d[2].Value;
                    }
                }
                else if (!ej.isNullOrUndefined(msg) && ej.isNullOrUndefined(msg.d)) {
                    if (msg.PivotRecords != undefined) {
                        this.setJSONRecords(msg.PivotRecords); this.setOlapReport(msg.OlapReport);
                        if (msg.HeaderCounts != undefined && (this.model.enableVirtualScrolling || (typeof (oclientProxy) != "undefined" && oclientProxy.model.enableVirtualScrolling))) {
                            this._categPageCount = Math.ceil(JSON.parse(msg.HeaderCounts).Column / JSON.parse(msg.PageSettings).CategorialPageSize);
                            this._seriesPageCount = Math.ceil(JSON.parse(msg.HeaderCounts).Row / JSON.parse(msg.PageSettings).SeriesPageSize);
                            this._categCurrentPage = JSON.parse(msg.PageSettings).CategorialCurrentPage;
                            this._seriesCurrentPage = JSON.parse(msg.PageSettings).SeriesCurrentPage;
                        }
                        else if (msg.HeaderCounts != undefined && this._pagerObj != null && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                            this._pagerObj.initPagerProperties(JSON.parse(msg.HeaderCounts), JSON.parse(msg.PageSettings));
                        else if (msg.HeaderCounts != undefined && (typeof (oclientProxy) != "undefined") && oclientProxy._pagerObj != null)
                            oclientProxy._pagerObj.initPagerProperties(JSON.parse(msg.HeaderCounts), JSON.parse(msg.PageSettings));
                    }
                    else if (msg.JsonRecords != undefined && this.model.enableJSONRendering == true) {
                        this.setJSONRecords(JSON.stringify(msg.JsonRecords)); this.setOlapReport(JSON.stringify(msg.PivotReport));
                        if (msg.DataSet != null) this._dataSet = msg.DataSet;
                    }
                    else if (msg.JsonRecords != undefined) {
                        this.setJSONRecords(msg.JsonRecords); this.setOlapReport(msg.PivotReport);
                        if (msg.DataSet != null) this._dataSet = msg.DataSet;
                    }
                    else if (msg.JsonRecords == undefined) {
                        this.setJSONRecords(null);
                        if (msg.PivotReport)
                            this.setOlapReport(msg.PivotReport);
                        if (msg.OlapReport)
                            this.setOlapReport(msg.OlapReport);
                    }
                    if (msg.customObject != null && msg.customObject != undefined)
                        this.model.customObject = msg.customObject;
                }
                if (this.model.enableVirtualScrolling || ($(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined))
                    this.layout("nosummaries");
                if (this.getOlapReport() != undefined && this.getOlapReport() != "" && this.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                    try {
                        if (!ej.isNullOrUndefined(JSON.parse(this.getOlapReport()).DataModel))
                            this.model.analysisMode = JSON.parse(this.getOlapReport()).DataModel == "Olap" ? ej.Pivot.AnalysisMode.Olap : ej.Pivot.AnalysisMode.Pivot;
                    }
                    catch (err) {
                    }
                }
                if (this.model.enableGroupingBar == true) {
                    report = JSON.parse(this.getOlapReport());
                    var itemProp = JSON.parse(report.ItemsProperties);
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                        var items = report.PivotRows.concat(report.PivotColumns, report.PivotCalculations, report.Filters);
                        var itemProps = $.grep(itemProp, function (value) { $.grep(items, function (field) { if (value.id == (field.FieldHeader || field.DimensionHeader)) value.id = (field.FieldName || field.DimensionName); }); return value; });
                        this._pivotTableFields = itemProps;
                    }
                    else
                        this._pivotTableFields = itemProp;
                    this._createGroupingBar(report);
                }
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    report = JSON.parse(this.getOlapReport());
                    for (var i = 0; i < report.PivotCalculations.length; i++) {
                        if (report.PivotCalculations[i].CalculationType == 8 || report.PivotCalculations[i].CalculationType == "Formula") {
                            if ($.grep(this._calculatedField, function (field) { return field.name == report.PivotCalculations[i].FieldName; }).length == 0)
                                this._calculatedField.push({ name: report.PivotCalculations[i].FieldName, formula: report.PivotCalculations[i].Formula });
                        }
                    }
                }
                if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._trigger("afterServiceInvoke", { action: "initialize", element: this.element, customObject: this.model.customObject });
                if (this.getJSONRecords() != null && this.getJSONRecords().length > 0) {
                    if (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout && this.model.enableVirtualScrolling == false && $(".e-pivotpager")[0] == null)
                        this.excelLikeLayout(this.getJSONRecords());
                    else
                    this.renderControlFromJSON(this.getJSONRecords());
                }
                else
                    this.renderControlFromJSON("");
                if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null) {
                    if ($("#" + oclientProxy._id + "_maxView")[0] && this._maxViewLoading) {
                        this._maxViewLoading.hide();
                    }
                    else
                        oclientWaitingPopup.hide();
                }
                else
                    this._waitingPopup.hide();
                if (!ej.isNullOrUndefined(this._schemaData))
                    this._schemaData.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
            }
            catch (err) {
            }
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this._calculatedField.length > 0 && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this._schemaData != null)
                this._schemaButtonCreate();
            var eventArgs = { action: "initialize", customObject: this.model.customObject, element: this.element };
            this._trigger("renderSuccess", eventArgs);
            if (!ej.isNullOrUndefined(msg.Exception)) {
                ej.Pivot._createErrorDialog(msg, "Exception", this);
            }
        },

        _hideGrandTotal: function (tableGrid) {
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                if ((!this.model.enableRowGrandTotal || !this.model.enableGrandTotal)) {
                    if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                        tableGrid.find(".rowhead tr:last").hide();
                    tableGrid.find("tr:last").hide();
                }
                if (tableGrid.find("tr:first th.summary").attr("p") != undefined && (!this.model.enableColumnGrandTotal || !this.model.enableGrandTotal) && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    var calcGTTh = (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? tableGrid.find("th.gtot[role^='columnheader']") : tableGrid.find("th.cgtot[role^='columnheader']"));
                    for (cLen = 0; cLen < calcGTTh.length; cLen++) {
                        tableGrid.find("[p^=\"" + (parseInt($(calcGTTh[cLen]).attr("p").split(",")[0])) + ",\"]").hide();
                        tableGrid.find("[p^=\"" + (parseInt($(calcGTTh[cLen]).attr("p").split(",")[0])) + ",\"]").hide();
                    }
                }
            }
            else {
                if (this.model.layout == "normal") {
                    var isCheckSum = true, count = 0, gTotCells;
                    if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode || this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        if (!this.model.enableColumnGrandTotal || !this.model.enableGrandTotal) {
                            rwLen = $(tableGrid).find("thead tr").length;
                            if (rwLen > 1 || (rwLen == 1 && $(tableGrid).find("th[p$='," + count + "']").attr("class") == "summary")) {
                                while (isCheckSum) {
                                    gTotCells = $(tableGrid).find("th.summary[p$='," + count + "']");
                                    if (gTotCells.length)
                                        isCheckSum = false;
                                         count++;
                                }
                                for (var p = 0; p < gTotCells.length; p++) {
                                    var cnt = count, cols = 0, colcel;
                                    var selectedCell = gTotCells[p]; selectedCellPos = $(selectedCell).attr('p'), i = parseInt(selectedCellPos.split(',')[1]) - 1;
                                    var colspn = $(selectedCell).attr("colspan");
                                    var rowLen = $(tableGrid).find("thead tr").length + $(tableGrid).find("tbody tr").length;
                                    for (var cl = 0; cl < parseInt(colspn) ; cl++) {
                                        $(tableGrid).find(" [p^='" + (parseInt(selectedCellPos.split(',')[0]) + cl) + ",']").css("display", "none");
                                    }
                                    if (i >= 0) {
                                        var cell = $(tableGrid).find(" [p^='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                                        while (cnt > 1) {
                                            if (ej.isNullOrUndefined(cell)) {
                                                for (i = parseInt(selectedCellPos.split(',')[1]) - 1; i >= 0; i--) {
                                                    var currentCell = $(tableGrid).find("[p='" + selectedCellPos.split(',')[0] + "," + i + "']")[0];
                                                    if (ej.isNullOrUndefined(currentCell)) {
                                                        for (k = parseInt(selectedCellPos.split(',')[0]) - 1; k >= 0; k--) {
                                                            if (ej.isNullOrUndefined(currentCell)) {
                                                                currentCell = $(tableGrid).find("[p='" + k + "," + i + "']")[0];
                                                            }
                                                        }
                                                    }
                                                    if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                                                    {
                                                        set_spn = parseInt($(currentCell).attr("colspan")) - parseInt(colspn);
                                                        $(currentCell).attr("colspan", set_spn)
                                                    }
                                                }
                                            }
                                            if (!ej.isNullOrUndefined(currentCell))
                                                cnt--;
                                        }
                                    }
                                }
                            }
                        }
                        isCheckSum = true, count = 0, gTotCells = "";
                        if (!this.model.enableRowGrandTotal || !this.model.enableGrandTotal) {
                            rwLen = $(tableGrid).find("tbody tr").length;
                            if (rwLen > 1 || (rwLen == 1 && $(tableGrid).find("th[p^='" + count + ",']") == "summary")) {
                                rwLen = $(tableGrid).find("tbody tr").length;
                                while (isCheckSum) {
                                    gTotCells = $(tableGrid).find("th.summary[p^='" + count + ",']");
                                    if (gTotCells.length)
                                        isCheckSum = false;
                                          count++;
                                 }
                            }
                            if (rwLen > 0) {
                                for (var p = 0; p < gTotCells.length; p++) {
                                    var cnt = count;
                                    var selectedCell = gTotCells[p]; selectedCellPos = $(selectedCell).attr('p'), i = parseInt(selectedCellPos.split(',')[0]) - 1;
                                    var rwspn = $(selectedCell).attr("rowspan");
                                    var row = $(selectedCell).parent();
                                    for (var rl = 0; rl < selectedCell.rowSpan; rl++) {
                                        $(row).css("display", "none");
                                        row = $(row).next();
                                    }
                                    if (i >= 0) {
                                        var cell = $(tableGrid).find(" [p^='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                                        while (cnt > 1) {
                                            if (ej.isNullOrUndefined(cell)) {
                                                for (i = parseInt(selectedCellPos.split(',')[0]) - 1; i >= 0; i--) {
                                                    var currentCell = $(tableGrid).find("[p='" + i + "," + selectedCellPos.split(',')[1] + "']")[0];
                                                    if (ej.isNullOrUndefined(currentCell)) {
                                                        for (k = parseInt(selectedCellPos.split(',')[1]) - 1; k >= 0; k--) {
                                                            if (ej.isNullOrUndefined(currentCell)) {
                                                                currentCell = $(tableGrid).find("[p='" + i + "," + k + "']")[0];
                                                            }
                                                        }
                                                    }
                                                    if (!ej.isNullOrUndefined(currentCell) && $(currentCell).css("display") != "none" && $($(currentCell).parents("tr")[0]).css("display") != "none" && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader" || $(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader" || $(currentCell).hasClass("value") || $(currentCell).attr('role') == "gridcell")) cell = currentCell;
                                                    {
                                                        set_spn = parseInt($(currentCell).attr("rowspan")) - parseInt(rwspn);
                                                        $(currentCell).attr("rowspan", set_spn)
                                                    }
                                                }
                                            }
                                            if (!ej.isNullOrUndefined(currentCell))
                                                cnt--;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        _hideSubTotal: function (gridTable, targetLoop, target) {
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var rowData = this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? this.model.dataSource.rows : JSON.parse(this.getOlapReport()).PivotRows, subThs;
                var columnData = this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? this.model.dataSource.columns : JSON.parse(this.getOlapReport()).PivotColumns;
                if (!ej.isNullOrUndefined(rowData)) {
                    for (var i = 0; i < rowData.length; i++) {
                        if (rowData[i].showSubTotal == false) {
                            var rowIndex = i.toString();
                            if ($(gridTable).attr("role") == "row" && $(gridTable).parent().is("tbody")) {
                                if (($(gridTable).find(".stot,.rstot").length == 0 || (this._isSubTotalhidden && $(gridTable).find(".stot,.rstot").find(".expand").length >= 1)) || ($(gridTable).find(".stot,.rstot").attr("p").split(",")[0] == rowIndex && (targetLoop == 1 && ($(gridTable).find(".stot,.rstot").find(".expand").length >= 1))))
                                    break;
                                else if ($(gridTable).find(".stot,.rstot").attr("p").split(",")[0] == rowIndex) {
                                    this._isSubTotalhidden = this._isSubTotalHide = true;
                                    break;
                                }
                            }
                            else if ($(gridTable).find("tbody").length > 0) {
                                subThs = this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? gridTable.find(".summary.rstot[p^=\"" + i + ",\"]") : gridTable.find(".summary.stot[p^=\"" + i + ",\"]");
                                if (subThs.length > 0)
                                    for (var j = 0; j < subThs.length; j++) {
                                        var thHide = $(subThs[j]).closest("tr");
                                        var positionTh = $(thHide).find(".stot,.rstot").attr("p"), cnt = parseInt(positionTh.split(',')[0]) - 1;
                                        var rowSpan = parseInt($(thHide).find(".stot,.rstot").attr("rowspan"));
                                        $(thHide).css("display", "none");
                                        $(gridTable).find(".valueCell td[p$='," + positionTh.split(',')[1] + "']").css("display", "none");
                                        var lnt = parseInt(positionTh.split(',')[1]);
                                        while (cnt >= 0) {
                                            var currentCell = null;
                                            while (ej.isNullOrUndefined(currentCell) && lnt >= 0) {
                                                currentCell = $(gridTable).find("[p='" + cnt + "," + lnt + "']")[0];
                                                if (!ej.isNullOrUndefined(currentCell) && $($(currentCell).closest("tr")[0]).css("display") != "none" && $(currentCell).hasClass("rowheader") && $(currentCell).attr('role') == "rowheader") {
                                                    if (parseInt($(currentCell).attr("p").split(",")[0]) < parseInt(positionTh.split(",")[0]) && (parseInt($(currentCell).attr("p").split(",")[1]) + currentCell.rowSpan + ($(currentCell).find("span").attr("tag") != undefined ? parseInt($(currentCell).find("span").attr("tag")) : 0)) >= (parseInt(positionTh.split(",")[1]) + rowSpan)) {
                                                        currentCell.rowSpan -= 1;
                                                        $(currentCell).find("span").attr("tag", $(currentCell).find("span").attr("tag") != undefined ? (parseInt($(currentCell).find("span").attr("tag")) + (1)) : 1);
                                                        break;
                                                    }
                                                }
                                                lnt--;
                                            }
                                            cnt--;
                                        }
                                    }
                            }
                        }
                    }
                }
                if (!ej.isNullOrUndefined(columnData)) {
                    for (var i = 0; i < columnData.length; i++) {
                        if (columnData[i].showSubTotal == false) {
                            var columnIndex = i.toString()
                            if (($(gridTable).hasClass("stot") || $(gridTable).hasClass("cstot")) && $(gridTable).attr("role") == "columnheader") {
                                if ((this._isSubTotalhidden && $(gridTable).find(".stot,.cstot").find(".expand").length >= 1) || ($(gridTable).attr("p").split(",")[1] == columnIndex && (targetLoop == 1 && ($(gridTable).find(".expand").length >= 1))))
                                    break;
                                else if ($(gridTable).attr("p").split(",")[1] == columnIndex) {
                                    this._isSubTotalhidden = this._isSubTotalHide = true;
                                    break;
                                }
                            }
                            else if ($(gridTable).attr("role") == "row" && $(gridTable).parent().is("thead")) {
                                if (($(gridTable).find(".stot,.cstot").length == 0 || (this._isSubTotalhidden && $(gridTable).find(".stot,.cstot").find(".expand").length >= 1)) || ($(gridTable).find(".stot,.cstot").attr("p").split(",")[1] == columnIndex && (targetLoop == 1 && ($(gridTable).find(".stot,.cstot").find(".expand").length >= 1))))
                                    break;
                                else if ($(gridTable).find(".stot,.cstot").attr("p").split(",")[1] == columnIndex) {
                                    this._isSubTotalhidden = this._isSubTotalHide = true;
                                    break;
                                }
                            }
                            else if ($(gridTable).find("thead").length > 0|| $(gridTable).find(".colhead").length > 0) {
                                subThs = this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? gridTable.find("th.summary.cstot[p$=\"," + i + "\"]") : gridTable.find("th.summary.stot[p$=\"," + i + "\"]");
                                if (subThs.length > 0) {
                                    var colsTotal = subThs;
                                    for (var k = 0; k < colsTotal.length; k++) {
                                        var hideTh = $(colsTotal[k]), pGridTb = $(gridTable), positionTh = $(colsTotal[k]).attr("p"), row = $(colsTotal[k]).closest("tr")[0], tdPosVal = parseInt(positionTh.split(",")[0]), rowSpan = parseInt($(colsTotal[k]).attr("rowspan")), colsSpan = parseInt($(colsTotal[k]).attr("colspan")), lnt = parseInt(positionTh.split(',')[1]) - 1;;
                                        for (var cCount = 0; cCount < colsSpan; cCount++) {
                                            var thList = $(row).nextAll().find("[p^='" + (cCount + tdPosVal) + ",']");
                                            for (var thCnt = 0; thCnt < $(thList).length; thCnt++) {
                                                $(thList[thCnt]).css("display", "none");
                                            }
                                            if ($(thList[thCnt]).attr("hc") == undefined || parseInt($(thList[thCnt]).attr("hc")) < 1) {
                                                $(pGridTb).find("[p^='" + (cCount + tdPosVal) + ",']").css("display", "none");
                                                $(pGridTb).find("[p^='0,']:not(.summary)").parent().find("td[p^='" + (cCount + tdPosVal) + ",']").attr("ch", 1);
                                            }
                                        }
                                        $(hideTh).css("display", "none");
                                        var cnt = parseInt(positionTh.split(',')[0]);
                                        while (lnt >= 0) {
                                            var currentCell = null;
                                            while (ej.isNullOrUndefined(currentCell) && cnt >= 0) {
                                                currentCell = $(gridTable).find("[p='" + cnt + "," + lnt + "']")[0];
                                                if (!ej.isNullOrUndefined(currentCell) && $($(currentCell).closest("tr")[0]).css("display") != "none" && $(currentCell).hasClass("colheader") && $(currentCell).attr('role') == "columnheader") {
                                                    if ((parseInt($(currentCell).attr("p").split(",")[1]) < parseInt(positionTh.split(",")[1]) && parseInt($(currentCell).attr("p").split(",")[0]) <= parseInt(positionTh.split(",")[0])) && (parseInt($(currentCell).attr("p").split(",")[0]) + currentCell.colSpan + ($(currentCell).find("span").attr("tag") != undefined ? parseInt($(currentCell).find("span").attr("tag")) : 0)) >= (parseInt(positionTh.split(",")[0]) + colsSpan)) {
                                                        currentCell.colSpan -= colsSpan;
                                                        $(currentCell).find("span").attr("tag", $(currentCell).find("span").attr("tag") != undefined ? (parseInt($(currentCell).find("span").attr("tag")) + (colsSpan)) : colsSpan);
                                                        break;
                                                    }
                                                }
                                                cnt--;
                                            }
                                            lnt--;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
       },

        _filterReport: function (report) {
            for (var i = 0; i < report.Filters.length; i++) {
                if (report.PivotColumns.length >= 1) {
                    for (var j = 0; j < report.PivotColumns.length; j++) {
                        if (report.Filters.length != 0 && !ej.isNullOrUndefined(report.Filters[i]) && report.Filters[i].Tag == report.PivotColumns[j].FieldName) {
                            report.Filters.splice(i, 1);
                            i = -1;
                        }
                    }
                }
            }
            for (var i = 0; i < report.Filters.length; i++) {
                if (report.PivotRows.length >= 1) {
                    for (var j = 0; j < report.PivotRows.length; j++) {
                        if (report.Filters.length != 0 && !ej.isNullOrUndefined(report.Filters[i]) && report.Filters[i].Tag == report.PivotRows[j].FieldName) {
                            report.Filters.splice(i, 1);
                            i = -1;
                        }
                    }
                }
            }
            for (var i = 0; i < report.Filters.length; i++) {
                if (report.PivotCalculations.length >= 1) {
                    for (var j = 0; j < report.PivotCalculations.length; j++) {
                        if (report.Filters.length != 0 && !ej.isNullOrUndefined(report.Filters[i]) && report.Filters[i].Tag == report.PivotCalculations[j].FieldName) {
                            report.Filters.splice(i, 1);
                            i = -1;
                        }
                    }
                }
            }

            return report;
        },
        _createGroupingBar: function (report) {
            this._pivotFilter = this._getLocalizedLabels("DragFieldHere");
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                report = this._filterReport(report);
                filterTag = this._createPivotButtons(this._pivotFilter != null && report.Filters.length > 1 && report.Filters[0].Tag == report.Filters[1].Tag ? report.Filters.slice(1) : report.Filters, "filter");
            }
            else
                filterTag = this._createPivotButtons(this._pivotFilter != null && report.filters.length > 0 ? report.filters : "", "filter");
            this._pivotFilter = filterTag;
            this._pivotRow = this._createPivotButtons(this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? report.PivotRows : report.rows, "row");            
            this._pivotColumn = this._createPivotButtons(this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? report.PivotColumns : report.columns, "column");
            this._pivotCalculation = this._createPivotButtons(this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? report.PivotCalculations : report.values, "values");
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && (report.values.length > 0 && report.values[0]["measures"])) {
                if (report.values[0]["axis"] == "columns" && report.values[0]["measures"].length > 0)
                    this._pivotColumn = this._pivotColumn + this._createPivotButtons(this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? report.PivotColumns : [{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }], "column");
                else if (report.values[0]["axis"] == "rows" && report.values[0]["measures"].length > 0)
                    this._pivotRow = this._pivotRow + this._createPivotButtons(this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? report.PivotColumns : [{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }], "row");
            }
        },

        _contextOpen: function (args) {
            ej.Pivot._contextMenuOpen(args, this);
        },
        _pivotContextClick: function (args) {
            if (args.text != this._getLocalizedLabels("CalculatedField")) {
                if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                    var droppedClass = args.text == this._getLocalizedLabels("AddToColumn") ? "column" : args.text == this._getLocalizedLabels("AddToRow") ? "row" : args.text == this._getLocalizedLabels("AddToValues") ? "value" : args.text == this._getLocalizedLabels("AddToFilter") ? "filter" : "";
                    var droppedField = $(this._selectedMember).attr("fieldName");
                    var droppedFieldCaption = $(this._selectedMember).text();
                    var dropArgs = { droppedFieldName: droppedField, droppedFieldCaption: droppedFieldCaption, droppedClass: droppedClass, droppedPosition: "", isMeasuresDropped: (droppedField.toLocaleLowerCase().indexOf("measures") == 0) };
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this._calculatedField.length > 0 && droppedClass != "values") {
                        this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) {
                            return (ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false) || (value.isCalculatedField == true && value.formula.indexOf(dropArgs.droppedFieldName) == -1);
                        });
                    }
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        this.model.dataSource = this.clearDrilledItems(this.model.dataSource, { action: "pvtBtnDropped" }, this);
                    }
                    ej.Pivot.addReportItem(this.model.dataSource, dropArgs);
                    this.refreshControl();
					if (!ej.isNullOrUndefined(this._schemaData))
						this._schemaData.refreshControl();
                }
                else {
                    var droppedPosition = args.text == this._getLocalizedLabels("AddToColumn") ? this.element.find(".columns") : args.text == this._getLocalizedLabels("AddToRow") ? this.element.find(".grpRow") : args.text == this._getLocalizedLabels("AddToValues") ? this.element.find(".values") : args.text == this._getLocalizedLabels("AddToFilter") ? this.element.find(".drag") : "";
                    var params = { element: this._selectedMember, target: droppedPosition, cancel: false };
                    this._pvtBtnDropped(params);
                }
            }
            else
                this._createCalculatedField();
        },

        _getAdvancedFilterInfo: function (levelUqName) {
            var filterItem=[];
            if(this._excelFilterInfo.length>0){
                var hierarchy=levelUqName;
                filterItem = $.grep(this._excelFilterInfo, function (value) {
                    try {
                        //.split('.').splice(0, 2).join(".")
                        if(value.levelUniqueName.replace(/]/g, "").replace(/\[/g, "").indexOf(levelUqName)>-1)
                            return value;
                    }
                    catch (e){}
                   
                });
            }
            return filterItem;
        },
        _createPivotButtons: function (axisItems, axis) {
            var clientMode = (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) ? true : false;
            if (!ej.isNullOrUndefined(axisItems)) {
                var rowBtns = "", tagAxis = axis == "column" ? "Columns" : axis == "row" ? "Rows" : axis == "filter" ? "Slicers" : "Values";
                var filterState = "";

                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    var tagAxis = axis == "column" ? "Columns" : axis == "row" ? "Rows" : axis == "filter" ? "filters" : "values";
                    if (tagAxis == "values" && clientMode)
                        axisItems = $.map(axisItems, function (obj, index) { return obj["measures"]; });
                    for (var i = 0; i < axisItems.length; i++) {
                        filterState = axisItems[i].fieldCaption;
                        var members = clientMode ? "" : ej.PivotAnalysis.getMembers(axisItems[i].fieldName);
                        var filtered = ((axisItems[i].filterItems != null && axisItems[i].filterItems.values.length > 0) || (!ej.isNullOrUndefined(axisItems[i]["advancedFilter"]) && axisItems[i]["advancedFilter"].length > 0)) ? "filtered" : "";
                        if (axis == "filter") {
                            if (filtered == "filtered") {
                                if (clientMode) {
                                    if (this._fieldSelectedMembers[axisItems[i].fieldName.toLowerCase()] == "All")
                                        ej.olap._mdxParser.getAllMember(this.model.dataSource, axisItems[i].fieldName, this);
                                    filterState = (this._fieldSelectedMembers[axisItems[i].fieldName.toLowerCase()] == "All" ? this._allMember : this._fieldSelectedMembers[axisItems[i].fieldName.toLowerCase()]);
                                }
                                else {
                                    if (axisItems[i].filterItems.filterType == "exclude") {
                                        if (members.length - (axisItems[i].filterItems.values.indexOf("All") == -1 ? axisItems[i].filterItems.values.length : axisItems[i].filterItems.values.length - 1) == 1)
                                            filterState = members.filter(function (item) { if (axisItems[i].filterItems.values.indexOf(item.toString()) == -1) return item });
                                        else
                                            filterState = this._getLocalizedLabels("MultipleItems");
                                    }
                                    else {
                                        if (axisItems[i].filterItems.values.length == 1)
                                            filterState = axisItems[i].filterItems.values[0];
                                        else
                                            filterState = this._getLocalizedLabels("MultipleItems");
                                    }
                                }
                            }
                            else if (clientMode) {
                                ej.olap._mdxParser.getAllMember(this.model.dataSource, axisItems[i].fieldName, this);
                                filterState = this._allMember;
                            }
                            else
                                filterState = this._getLocalizedLabels("All");
                        }
                        var sort = clientMode ? "" : axisItems[i].sortOrder == ej.PivotAnalysis.SortOrder.Descending ? "descending" : "";
                        rowBtns += ej.buildTag("span.pivotButton", ej.buildTag("button.pvtBtn#pivotButton_" + axisItems[i].fieldName || axisItems[i], (1 == 1 ? (axisItems[i].fieldCaption == undefined ? axisItems[i].fieldName : axisItems[i].fieldCaption || axisItems[i]) + (axis == "filter" ? " (" + filterState + ")" : "") : $.grep(this._pivotTableFields, function (item) { return item.name == axisItems[i].fieldName; })[0].caption || $.grep(this._pivotTableFields, function (item) { return item.name == axisItems[i]; })[0].caption), {}, { "fieldName": axisItems[i].fieldName, "fieldCaption": axisItems[i].fieldCaption, "axis": tagAxis })[0].outerHTML +
                                  (clientMode && (axisItems[i].fieldName.toLowerCase() == "measures" || (!ej.isNullOrUndefined(axisItems[i].isNamedSet) && !axisItems[i].isNamedSet)) ? "" : ej.buildTag("span.filter e-icon " + filtered).attr("role", "button").attr("aria-label", "filter")[0].outerHTML) + (clientMode ? " " : ej.buildTag("span.sorting e-icon " + sort).attr("role", "button").attr("aria-label", "sort").attr("aria-expanded", "false")[0].outerHTML) + ej.buildTag("span.removeBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML).attr("tag", tagAxis + ":" + axisItems[i].fieldName || axisItems[i])[0].outerHTML;
                    }
                }
                else {
                    if (tagAxis == "Values" && axis == "values") {
                        var tempAxis = this.element.find(".pivotButton:contains('" + this._getLocalizedLabels("Measures") + "')").length > 0 ? this.element.find(".pivotButton:contains('" + this._getLocalizedLabels("Measures") + "')").parent()[0].className.split(" ")[0] : "schemaColumn";
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                            tagAxis = tempAxis == "schemaColumn" || tempAxis == "columns" ? "Columns" : "Rows";
                    }
                    for (var i = 0; i < axisItems.length; i++) {
                        var l = this._ascdes.split("##"), count = 0; sort = "", filtered = "";
                        for (var j = 0; j < l.length; j++) {
                            if ((this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && l[j] == axisItems[i].Tag) || (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && l[j] == axisItems[i])) {
                                count = 1;
                            }
                        }
                        if (count == 1) {
                            sort = "descending";
                        }
                        if (!ej.isNullOrUndefined(this._tempFilterData)) {
                            for (var j = 0; j < this._tempFilterData.length; j++) {
                                for (var key in this._tempFilterData[j]) {
                                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                                        if (key == ((axisItems[i].FieldName || axisItems[i].DimensionName)) && this._tempFilterData[j][(axisItems[i].FieldName || axisItems[i].DimensionName)] != "")
                                            filtered = "filtered";
                                    }
                                    else if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                                        if (key == (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? axisItems[i].Tag : axisItems[i]) && this._tempFilterData[j][axisItems[i].Tag].indexOf("FILTERED") != 0)
                                            filtered = "filtered";
                                    }
                                }
                            }
                        }
                        if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                            axisItems[i].FieldHeader = axisItems[i].FieldHeader == "Measures" ? this._getLocalizedLabels("Measures") : axisItems[i].FieldHeader;
                            filtered = (this.model.enableAdvancedFilter && this._getAdvancedFilterInfo(axisItems[i].Tag).length > 0) ? "filtered" : filtered;
                            var filterIcon = axisItems[i].FieldHeader == "Measures" || axisItems[i].Tag == "Measures" ? "" : ej.buildTag("span.filter e-icon " + filtered).attr("role", "button").attr("aria-label", "filter")[0].outerHTML;
                            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                                var excludeMem = $.map(this._tempFilterData, function (item) { return item[axisItems[i].DimensionHeader] });
                                if (axis == "filter") {
                                    if (filtered)
                                        filterState = this._fieldMembers[axisItems[i].DimensionHeader].length - excludeMem.length == 1 ? (this._fieldMembers[axisItems[i].DimensionHeader]).filter(function (item) { if (excludeMem.indexOf(item) == -1) return item }) : this._getLocalizedLabels("MultipleItems");
                                    else
                                        filterState = this._getLocalizedLabels("All");
                                }
                            }
                            else {
                                if (axis == "filter") {
                                    filterState = (this._fieldSelectedMembers[axisItems[i].Tag] == "All" ? axisItems[i].AllMember : this._fieldSelectedMembers[axisItems[i].Tag]) || axisItems[i].AllMember;
                                }
                            }
                            rowBtns += ej.buildTag("span.pivotButton", ej.buildTag("span.dropIndicator")[0].outerHTML + ej.buildTag("button.pvtBtn#pivotButton" + axisItems[i].FieldHeader || axisItems[i].FieldName || axisItems[i].Name || axisItems[i].DimensionHeader || axisItems[i].DimensionName, ((axisItems[i].FieldHeader || axisItems[i].FieldName || axisItems[i].Name || axisItems[i].DimensionHeader || axisItems[i].DimensionName) + (axis == "filter" ? " (" + filterState + ")" : "")), {}, this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? { "fieldname": axisItems[i].FieldName || axisItems[i].DimensionName || axisItems[i].FieldHeader || axisItems[i].DimensionHeader, "fieldCaption": axisItems[i].FieldHeader || axisItems[i].FieldName || axisItems[i].DimensionName || axisItems[i].DimensionHeader } : { "fieldCaption": axisItems[i].FieldHeader })[0].outerHTML +
                              filterIcon + ej.buildTag("span.sorting e-icon " + sort).attr("role", "button").attr("aria-label", "sort")[0].outerHTML + ej.buildTag("span.removeBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML).attr("tag", tagAxis + ":" + axisItems[i].Tag)[0].outerHTML;
                        }
                        else
                            rowBtns += ej.buildTag("span.pivotButton", ej.buildTag("span.dropIndicator")[0].outerHTML + ej.buildTag("button.pvtBtn#pivotButton" + axisItems[i], axisItems[i])[0].outerHTML + ej.buildTag("span.filter e-icon " + filtered).attr("role", "button").attr("aria-label", "filter")[0].outerHTML + ej.buildTag("span.sorting e-icon " + sort).attr("role", "button").attr("aria-label", "sort").attr("aria-expanded", "false")[0].outerHTML + ej.buildTag("span.removeBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML).attr("tag", tagAxis + ":" + axisItems[i])[0].outerHTML;
                    }
                }
                return rowBtns;
            }
        },

        _createFields: function (tableOlapGrid, tableWidth, cellWidth) {
            this.element.find(".groupingBarPivot").remove();
            this.element.prepend(ej.buildTag("div#groupingBarPivot.groupingBarPivot")[0].outerHTML);
            this.element.find(".groupingBarPivot").prepend(ej.buildTag("div.valueColumn", ej.buildTag("span.values", ej.buildTag("span#grpvalue", "values", { "display": "none" })[0].outerHTML).attr("aria-describedby", "grpvalue")[0].outerHTML + ej.buildTag("span.columns", ej.buildTag("span#grpcol", "column", { "display": "none" })[0].outerHTML).attr("aria-describedby", "grpcol")[0].outerHTML, { "width": "100%" })); // Math.max(valueColumnWidth, 280) - 5
            this.element.find(".groupingBarPivot").prepend(ej.buildTag("div.drag", ej.buildTag("span", "", { "width": "5px", "display": "inline-block" })[0].outerHTML + ej.buildTag("span#grpdrag", "filter", { "display": "none" })[0].outerHTML + this._getLocalizedLabels("DragFieldHere"), { "width": "100%" })[0].outerHTML).attr("aria-describedby", "grpdrag");// Math.max(filterWidth, 280)
            if (this._pivotFilter != "" && this._pivotFilter != null)
                this.element.find(".drag").text("").append("<span id='grpdrag' style='display:none'>filter</span>");
            this.element.find(".drag").append(this._pivotFilter);
            this.element.find(".values").append(this._pivotCalculation);
            this.element.find(".columns").append(this._pivotColumn);
            if (this.element.find(".values .pivotButton").length == 0) {
                this.element.find(".values").append(ej.buildTag("span", "", { "width": "5px", "display": "inline-block" })[0].outerHTML + this._getLocalizedLabels("ValueArea"));
            }
            if (this.element.find(".columns .pivotButton").length == 0) {
                this.element.find(".columns").append(ej.buildTag("span", "", { "width": "5px", "display": "inline-block" })[0].outerHTML + this._getLocalizedLabels("ColumnArea"));
            }
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.element.find(".rows").length == 0 && !ej.isNullOrUndefined(this.getJSONRecords()) && this.getJSONRecords().length > 0 && this.getJSONRecords()[0].CSS == "colheader") {
                this.element.find(".pivotGridTable thead tr:first").prepend(ej.buildTag('th.grpRow', ej.buildTag("div.rows", ej.buildTag("span", "", { "width": "5px", "display": "inline-block" })[0].outerHTML + this._getLocalizedLabels("RowArea"))[0].outerHTML, {}, { rowspan: this.element.find("thead tr").length })[0].outerHTML);
                this.element.find(".pivotGridTable tbody tr:first").prepend(ej.buildTag('td.rowheader', "Total")[0].outerHTML);
            }
            else if (this.element.find(".rows .pivotButton").length == 0) {
                this.element.find(".rows").text("").children("span").remove();
                this.element.find(".rows").append(ej.buildTag("span", "", { "width": "5px", "display": "inline-block" })[0].outerHTML + this._getLocalizedLabels("RowArea"));
            }
            if (this.element.find(".rowheader").length == 0 && this.element.find(".colheader").length == 0 && this.element.find(".values .pivotButton").length == 0 || this.element.find(".pivotGridTable th").length == 0) {
                var rowArea = ej.buildTag("div.emptyRows", ej.buildTag("span.rows", this._pivotRow != "" ? this._pivotRow : this._getLocalizedLabels("RowArea"), { "width": "5px" })[0].outerHTML, { "width": 140 })[0].outerHTML;
                this.element.find(".rows").length == 0 ? this.element.find(".groupingBarPivot").append(rowArea) : "";
                if (this.model.enableDeferUpdate && this._pivotRow != "") {
                    this.element.find(".rows").text("");
                    this.element.find(".rows").append(this._pivotRow);
                }
                this.element.find(".emptyRows,.rows").ejDroppable({
                });
            }
            this.element.find(".values").find(".filter").remove();
            this.element.find(".values").find(".sorting").remove();
            this.element.find(".drag").find(".sorting").remove();
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                this.element.find(".pivotButton").find(".sorting").remove();
            this.element.find(".pivotButton .pvtBtn").ejButton({ size: "normal", type: ej.ButtonType.Button }).ejDraggable({
                handle: 'button', clone: true,
                cursorAt: { left: -5, top: -5 },
                dragStart: ej.proxy(function (args) {
                    this._isDragging = true;
                }, this),
                dragStop: ej.proxy(this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this._clientPvtBtnDropped : this._pvtBtnDropped, this),
                helper: ej.proxy(function (event, ui) {
                    $(event.element).parent().addClass("dragHover");
                    $(event.element).addClass("dragHover");
                    if (event.sender.target.className.indexOf("e-btn") > -1)
                        return $(event.sender.target).clone().addClass("dragClone").appendTo(this.element);
                    else
                        return false;
                }, this)
            });

            this.element.find(".drag, .values, .columns, .grpRow, .rows").ejDroppable({
            });
            if (this.element.find(".pivotGridTable").find("thead th:eq(1), tbody td:eq(0)").length > 0) {
                this.element.find(".groupingBarPivot").width(this.element.find(".pivotGridTable").width());
            }
            else if (this.element.find(".pivotGridTable").find("thead, tbody").length > 0) {
                if (!this.model.isResponsive)
                    this.element.find(".groupingBarPivot").width(this.element.find(".rows").width() + 150);
            }
            else {
                if (this.element.find(".columns .pivotButton").length == 0 || (this.element.find(".values .pivotButton").length == 0 && this.element.find(".columns .pivotButton").length == 1))
                    this.element.find(".groupingBarPivot").width(300);
                else {
                    var MaxBtnWidth = 0;
                    for (var i = 0; i < $(this.element.find(".columns .pivotButton")).length; i++) {
                        MaxBtnWidth = Math.max($(this.element.find(".columns .pivotButton")[i]).width(), MaxBtnWidth);
                    }
                    MaxBtnWidth < 140 ? this.element.find(".columns").css("min-width", MaxBtnWidth + "px") : "";
                    var grpwidth = (MaxBtnWidth * $(this.element.find(".columns .pivotButton")).length) + this.element.find(".values").width() + 10;
                    this.element.find(".groupingBarPivot").width(grpwidth);
                }
            }
            if (this.element.find(".rows").width() > 140 || (this.model.enableDeferUpdate) && (this.element.find(".rows").width() < this.element.find(".grpRow").width()) && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                if (this.enableDeferUpdate)
                    this.element.find(".rows").width(this.element.find(".colheader").length == 0 ? this.element.find(".grpRow").width() - 140 : this.element.find(".grpRow").width());
                else if (!this.model.isResponsive)
                    this.element.find(".rows").width((this.model.enableDeferUpdate) ? (this.element.find(".grpRow").width()) - 8 : (this.element.find(".grpRow").width()));
            }
            if (this.element.find(".pivotGridTable thead").length > 0 || this.model.enableDeferUpdate && this.element.find(".pivotGridTable thead").length == 0 && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode || this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders) {
                if (this.model.isResponsive && this.element.find(".values .pivotButton").length == 0 && this.element.find(".columns .pivotButton").length == 0) {
                    this.element.find(".values").width(140);
                }
                else
                    this.element.find(".values").width(this.element.find(".grpRow").length > 0 ? this.model.enableDeferUpdate && this.element.find(".colheader").length == 0 ? this.element.find(".grpRow").width() : this.element.find(".grpRow").width() + 4 : 140);//this.element.find(".colheader").length==0?this.element.find(".grpRow").width()+140:
                if (this.model.enableDeferUpdate && this.element.find(".colheader").length == 0 && this.element.find(".pivotGridTable .rowheader").length != 0) {
                    var columnWidth = this.element.find(".groupingBarPivot").width() - this.element.find(".values").width();
                    if (columnWidth < 140)
                        this.element.find(".groupingBarPivot").width(this.element.find(".groupingBarPivot").width() + 140)
                }
                if (this.element.find(".pivotGridTable").find("thead th:eq(1), tbody td:eq(0)").length > 0 || this.model.enableDeferUpdate && this.element.find(".columns .pivotButton").length == 0 || this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders) {
                    var colWidth = this.element.find(".pivotGridTable").width() - this.element.find(".values").width() - 4;
                    if (this.element.find(".pivotGridTable").find("thead th:eq(2), tbody td:eq(1)").length == 0) {
                        this.element.find(".columns").css("min-width", colWidth >= 30 && this.element.find(".pivotGridTable .colheader").length == 0 && this.element.find(".columns .pivotButton").length == 0 ? 140 : colWidth).width(colWidth >= 30 && this.element.find(".pivotGridTable .colheader").length == 0 && this.element.find(".columns .pivotButton").length == 0 ? 82 : colWidth);
                        this.element.find(".values").height(colWidth >= 30 && this.element.find(".pivotGridTable .colheader").length == 0 && this.element.find(".columns .pivotButton").length == 0 ? this.element.find(".columns").height() : this.element.find(".values").height());
                        if (this.element.find(".columns .pivotButton").length == 0 || this.model.enableDeferUpdate && this.element.find(".pivotGridTable .colheader").length == 0) {
                            if (this.element.find(".columns .pivotButton").length == 0) {
                                var colWidth = this.element.find(".groupingBarPivot").width() - this.element.find(".values").width() - 5;
                                this.element.find(".columns").width(colWidth);
                                if (colWidth < 140 && ($(".groupingBarPivot .values .pivotButton").length == 1 || $(".groupingBarPivot .values .pivotButton").length == 0 && this.model.enableDeferUpdate))
                                    this.element.find(".columns").css("min-width", colWidth + "px");
                            }
                            this.element.find(".columns").addClass("widthSetter");
                        }
                    }
                    else {
                        if (colWidth < 140) {
                            if ($('.columns .pivotButton').length < 2)
                                this.element.find(".columns").css("min-width", colWidth).addClass("widthSetter");
                            else {
                                this.element.find(".columns").width(colWidth).css("min-width", colWidth);
                                this.element.find(".values").height(this.element.find(".columns").height());
                                
                            }
                        }
                        else
                            this.element.find(".columns").width(colWidth);
                    }
                }
                else if (this.element.find(".pivotGridTable").find("thead th:eq(1)").length == 0 && !this.model.enableDeferUpdate) {
                    var colBtnCount = this.element.find(".columns .pivotButton").length < 1 ? 1 : this.element.find(".columns .pivotButton").length;
                    this.element.find(".columns").addClass("widthSetter");
                    this.element.find(".columns").css("min-width", (this.element.find(".groupingBarPivot").width() - this.element.find(".values").width() - 7) / colBtnCount);
                }
            }
            if (this.model.dataSource.data != null && this.model.url == "") {
                var totalWidth = 0;
                $('.columns .pivotButton').each(function (index) { totalWidth += parseInt($(this).width() + 10); });
                if ($(".valueColumn").height() > 30 && this.element.find(".values button").length == 0 && this.element.find(".columns").width() < totalWidth) {
                    var btnCnt = (this.element.find(".columns .pivotButton").length);
                    var btnWidth = ((this.element.find(".valueColumn").width() - this.element.find(".values").width()) / (btnCnt == 0 ? 1 : btnCnt)) - 70;
                    this.element.find(".columns .pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
                }
            }
            if (this.element.find(".columns").height() > 30) {
                if (!this.model.isResponsive)
                    var btnWidth = this.element.find(".columns").width() / 2 - 60;
                else
                    var btnWidth = this.element.find(".columns").width() / (this.element.find(".columns .pivotButton").length) - 5;
                this.element.find(".columns .pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
            }
            else {
                if (this.element.find(".columns .pivotButton").width() > this.element.find(".columns").width()) {
                    var btnWidth = this.element.find(".columns").width() - 60;
                    this.element.find(".columns .pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
                }
            }

            if (this.element.find(".drag").height() > 30) {
                var btnWidth = this.element.find(".groupingBarPivot").width() / 4 - 35;
                this.element.find(".drag .pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
            }
            if (this.element.find(".values").height() > 30) {
                if (!this.model.isResponsive)
                    var btnWidth = this.element.find(".values").width() / 2 - 40;
                else
                    var btnWidth = this.element.find(".values").width() / (this.element.find(".values .pivotButton").length) - 5;
                this.element.find(".values .pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
            }
            else {
                if (this.element.find(".values .pivotButton").width() > this.element.find(".values").width() || (this.element.find(".pivotGridTable").find("thead th:eq(1), tbody td:eq(0)").length == 0 && this.element.find(".values .pivotButton").length > 0)) {
                    var btnWidth = this.element.find(".values").width() - 40;
                    this.element.find(".values .pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
                }
            }
            var addedbtnwidth = 0;
            for (var i = 0; i < this.element.find(".rows .pivotButton").length; i++) {
                addedbtnwidth = addedbtnwidth + this.element.find(".rows .pivotButton:eq(" + i + ")").width()
            }
            if (addedbtnwidth > this.element.find(".rows").width() || (this.element.find(".rows").parent(".emptyRows").length > 0 && this.element.find(".rows").parent(".emptyRows").width() < addedbtnwidth)) {
                var btnWidth = this.element.find(".rows").width() / 2 - 40;
                this.element.find(".rows .pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
            }
            if (this.model.enableDeferUpdate && this.element.find(".columns .pivotButton").length != 0 && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                var pvtBtnWidth = 0, columnWidth = 0;
                for (var i = 0; this.element.find(".columns .pivotButton").length > i; i++) {
                    pvtBtnWidth = this.element.find(".columns .pivotButton:eq(" + i + ")").width() + pvtBtnWidth + 7;
                }
                this.element.find('.pivotGridTable .colheader,.pivotGridTable tr:eq(0) .summary').each(function () {
                    columnWidth = columnWidth + $(this).width();
                });
                if (pvtBtnWidth >= columnWidth) {
                    var isempty = this.element.find(".pivotGridTable .colheader").length > 0 ? 1 : 0;
                    var colWidth = isempty == 0 ? 140 : columnWidth;
                    var btnWidth = colWidth / (this.model.enableDeferUpdate ? this.element.find(".columns .pivotButton").length : 3) - 15;
                    this.model.enableDeferUpdate ? this.element.find(".columns .pvtBtn").width(30).css({ "text-overflow": "ellipsis" }) : this.element.find(".columns .pvtBtn").width(btnWidth).css({ "text-overflow": "ellipsis" });
                }
            }

            if (this.element.find(".values").height() > this.element.find(".columns").height() || this.element.find(".columns").height() > this.element.find(".values").height()) {
                if (this.element.find(".values").height() > this.element.find(".columns").height()) {
                    this.element.find(".columns").height(this.element.find(".values").height());
                }
                else
                    this.element.find(".values").height(this.element.find(".columns").height());
            }
            this.element.find(".colheader, .rowheader, .value").addClass("e-droppable");
            this.element.find(".summary").removeClass("e-droppable");
            if (this.model.enableGroupingBar) {
                var ele = this.element.find(".pvtBtn");
                var contextTag = ej.buildTag("ul.pivotTree#pivotTree", (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? ej.buildTag("li.calculatedFieldMenuItem", ej.buildTag("a.menuItem", this._getLocalizedLabels("CalculatedField"))[0].outerHTML)[0].outerHTML : " ") + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToFilter"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToRow"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToColumn"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToValues"))[0].outerHTML)[0].outerHTML)[0].outerHTML;
                $(this.element).append(contextTag);
                $("#pivotTree").ejMenu({
                    menuType: ej.MenuType.ContextMenu,
                    enableRTL: this.model.enableRTL,
                    openOnClick: false,
                    contextMenuTarget: ele,
                    click: ej.proxy(this._pivotContextClick, this),
                    beforeOpen: ej.proxy(this._contextOpen, this),
                    close: ej.proxy(ej.Pivot.closePreventPanel, this)
                });
            }
        },

        _clientPvtBtnDropped: function (args) {
            this._isDragging = false;
            ej.Pivot.openPreventPanel(this);
            args.element.removeClass("dragHover").css("background-color", "inherit");
            args.element.parent().removeClass("dragHover");
            this.element.find(".dragClone").remove();
            this.element.find(".dropIndicator").removeClass("dropIndicatorHover");
            this.element.find(".dragClone,.dropIndicator").remove();
            var droppedClass = $(args.target).hasClass("columns") || $(args.target).parents(".columns").length > 0 ? "column" : $(args.target).hasClass("grpRow") || $(args.target).parents(".grpRow").length > 0 || $(args.target).hasClass("rows") ? "row" : $(args.target).hasClass("values") || $(args.target).parents(".values").length > 0 ? "value" : $(args.target).hasClass("drag") || $(args.target).parents(".drag").length > 0 ? "filter" : "";
            var droppedFieldCaption = args.element.text();
            var droppedField = $(args.element).attr("fieldName");
            if (droppedClass != "" && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if ((droppedField.toLowerCase().indexOf("[measures]") >= 0 && droppedClass != "value") || (droppedField == this._getLocalizedLabels("Measures") && droppedClass != "row" && droppedClass != "column") || (droppedField.toLowerCase().indexOf("[measures]") < 0 && droppedClass == "value")) {
                    ej.Pivot._createErrorDialog(this._getLocalizedLabels("GroupingBarAlertMsg"), this._getLocalizedLabels("Warning"), this);
                    return;
                }
            }
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && droppedClass != "value" && $.grep(this._calculatedField, function (value) { return value.name == droppedField; }).length > 0) {
                ej.Pivot._createErrorDialog(this._getLocalizedLabels("CalcValue"), this._getLocalizedLabels("Warning"), this);
                this.element.find(".dragClone,.dropIndicator").remove();
                return;
            }
            var droppedPosition = droppedClass == "" ? "" : this._setSplitBtnTargetPos(args.event, droppedClass, "drop");
            var orginalPosition = droppedClass == "" ? "" : this._setSplitBtnTargetPos(args, droppedClass, "original");
            var droppedAxis = $(args.element).hasClass("columns") || $(args.element).parents(".columns").length > 0 ? "column" : $(args.element).hasClass("grpRow") || $(args.element).parents(".grpRow").length > 0 || $(args.element).hasClass("rows") ? "row" : $(args.element).hasClass("values") || $(args.element).parents(".values").length > 0 ? "value" : $(args.element).hasClass("drag") || $(args.element).parents(".drag").length > 0 ? "filter" : "";
            if (droppedClass != "" && droppedClass.toLowerCase() == droppedAxis.toLowerCase() && droppedPosition > orginalPosition) droppedPosition = droppedPosition - 1;
            var dropArgs = { droppedFieldName: droppedField, droppedFieldCaption: droppedFieldCaption, droppedClass: droppedClass, droppedPosition: droppedPosition, isMeasuresDropped: (droppedField.toLocaleLowerCase().indexOf("measures") == 0) };
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this._calculatedField.length > 0 && droppedClass != "value") {
                this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) {
                    return (ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false) || (value.isCalculatedField == true && value.formula.indexOf(dropArgs.droppedFieldName) == -1);
                });
            }
            else if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                this._fieldMembers = {};
                this._fieldSelectedMembers = {};
                this.model.dataSource = this.clearDrilledItems(this.model.dataSource, { action: "pvtBtnDropped" }, this);
            }
            if (!ej.isNullOrUndefined(this._waitingPopup))
                this._waitingPopup.show();
            ej.Pivot.addReportItem(this.model.dataSource, dropArgs);
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var calculatedField = $.grep(this.model.dataSource.values, function (value) { return value.isCalculatedField == true; });
                this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) { return ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false; });
                $.merge(this.model.dataSource.values, calculatedField);
            }
            this.refreshControl();
            if (!ej.isNullOrUndefined(this._schemaData)) {
                if (ej.Pivot.getReportItemByFieldName(droppedField, this.model.dataSource).item == null && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                    this._schemaData._tableTreeObj.element.find("li[tag='" + droppedField + "']").removeClass("filter").find(".treeDrop,.filter").remove();
                this._schemaData.refreshControl();
            }
        },

        _pvtBtnDropped: function (args) {
            ej.Pivot.openPreventPanel(this);
            $(args.element).parent().removeClass("dragHover");
            $(args.element).removeClass("dragHover");
            this._isUpdateRequired = true;
                var buttonDrag = $(args.target).parents();
                for (var i = 0; i < buttonDrag.length; i++) {
                    if (buttonDrag[i].className.split(" ")[0] == "e-pivotschemadesigner") {
                        this.element.find(".dragClone").remove();
                        return;
                    }
                }
            this._isDragging = false;
            this.element.find(".dropIndicator").removeClass("dropIndicatorHover");
            var axis = null, axisName = "", headerTag = "", headerText, isFiltered = false, isSorted = false;
            if (!ej.isNullOrUndefined(args.target.className)) {
                droppedClass = args.target.className.indexOf("e-droppable") >= 0 ? args.target.className.split(" ")[0] : "";
            }
            else {
                droppedClass = $(args.target).hasClass("columns") ? "columns" : $(args.target).hasClass("grpRow") ? "rows" : $(args.target).hasClass("values") ? "values" : $(args.target).hasClass("drag") ? "drag" : "";
            }
            droppedClass = droppedClass == "grpRow" ? "rows" : droppedClass;
            isFiltered = $(args.element).parent().find(".filtered").length > 0 ? true : false;
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                if ($(args.target).hasClass("pvtBtn") && (this.model.operationalMode != ej.PivotGrid.OperationalMode.ServerMode))
				droppedClass = $(args.target).attr("axis").toLowerCase();
                        headerText =  args.element.attr("fieldName");
                        isSorted = $(args.element).parent().find(".descending").length > 0 ? true : false;
                
                if (droppedClass == "" && (args.target.tagName == "BUTTON" || args.target.tagName == "SPAN")) {
                    droppedClass = args.target.parentNode.parentElement.className.split(" ")[0];
                }
                for (var i = 0; i < this._pivotTableFields.length; i++) {
                    if (this._pivotTableFields[i].name == headerText) {
                        this._pivotTableFields[i].isSelected = true;
                        headerTag = this._pivotTableFields[i];
                    }
                }
            }
            else
            {
                if (!ej.isNullOrUndefined(args.target.className)) {
                    axis = args.target.className.indexOf("pvtBtn") > -1 ? $(args.target).parents(".e-droppable")[0] : args.target.className.indexOf("e-droppable") ? args.target : args.target[0].tagName.toLowerCase() == "td" ? args.target.children(":last")[0] : args.target;
                    axisName = axis.className.split(" ")[0] == "columns" ? "Categorical" : axis.className.split(" ")[0] == "rows" || axis.className.split(" ")[0] == "grpRow" ? "Series" : axis.className.split(" ")[0] == "filters" ? "Slicer" : "";
                    droppedClass = axis.className.split(" ")[0];
                }
                else {
                    axis = $(args.target);
                    axisName = $(args.target).hasClass("columns") ? "Categorical" : $(args.target).hasClass("grpRow") ? "Series" : $(args.target).hasClass("drag") ? "Slicer" : "";
                    droppedClass = $(args.target).hasClass("columns") ? "columns" : $(args.target).hasClass("grpRow") ? "rows" : $(args.target).hasClass("values") ? "values" : $(args.target).hasClass("drag") ? "drag" : "";
                }
                if (axisName == "" && args.element.parent().attr("tag").indexOf("[Measures]") > -1)
                    axisName = this.element.find(".schemaRow .pivotButton:contains('" + this._getLocalizedLabels("Measures") + "')").length > 0 ? "Series" : "Categorical";
                headerTag = $(args.element.parent()[0]).attr("tag");
                droppedClass = droppedClass == "grpRow" ? "rows" : droppedClass;
                axisName = axisName == "grpRow" ? "Series" : axisName;
                headerText = args.element.text();
            }
            this.element.find(".dragClone").remove();
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if ((headerTag.split(":")[1].toLocaleUpperCase() == "MEASURES" && (droppedClass != "columns" || droppedClass != "rows") && (droppedClass == "drag" || droppedClass == "values")) || (headerTag.toUpperCase().indexOf("[MEASURES]") > -1 && droppedClass != "values" && (droppedClass == "rows" || droppedClass == "columns" || droppedClass == "drag"))) {
                    ej.Pivot._createErrorDialog(this._getLocalizedLabels("GroupingBarAlertMsg"), this._getLocalizedLabels("Error"), this);
                    this.element.find(".dragClone,.dropIndicator").remove();
                    args.element.parent().removeAttr("style");
                    args.element.css("background-color", "inherit");
                    return false;
                }
                else if (headerTag.toUpperCase().indexOf("[MEASURES]") == -1 && droppedClass == "values") {
                    ej.Pivot._createErrorDialog(this._getLocalizedLabels("GroupingBarAlertMsg"), this._getLocalizedLabels("Error"), this);
                    this.element.find(".dragClone,.dropIndicator").remove();
                    args.element.parent().removeAttr("style");
                    args.element.css("background-color", "inherit");
                    return false;
                }
            }
            if (droppedClass == "rows" || droppedClass == "columns" || droppedClass == "values" || droppedClass == "drag") {
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && droppedClass != "values" && ($.grep(this._calculatedField, function (value) { return value.name == headerText; }).length > 0 || $.grep(JSON.parse(this.getOlapReport()).PivotCalculations, function (value) { return value.FieldHeader == headerText && value.CalculationType == 8; }).length > 0)) {
                    ej.Pivot._createErrorDialog(this._getLocalizedLabels("CalcValue"), this._getLocalizedLabels("Warning"),this);
                    args.element.parent().removeAttr("style");
                    args.element.css("background-color", "inherit");
                    return;
                }
                var droppedPosition = this._setSplitBtnTargetPos(args, droppedClass, "drop");
                var orignalPosition = this._setSplitBtnTargetPos(args, droppedClass, "original");
                if (droppedClass == "drag") {
                    this.element.find(".drag").text("").append("<span id='grpdrag' style='display:none'>filter</span>");
                }
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
                $(args.element.parent()).remove();
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    var droppedAxis = args.element.parents(".pivotButton").attr("tag").split(":")[0];
                    this._waitingPopup = this.element.data("ejWaitingPopup");
                    if (!ej.isNullOrUndefined(this._waitingPopup))
                        this._waitingPopup.show();

                    if ($.isNumeric(droppedPosition)) {
                        if (droppedClass == droppedAxis.toLowerCase() && droppedPosition > orignalPosition)
                            droppedPosition = droppedPosition - 1;
                    }

                    if (this._schemaData != null) {
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                            this._schemaData.element.find("#pivotButton" + headerText).parent().parent().remove();
                            this._schemaData._createPivotButton(headerText, droppedClass == "rows" ? "row" : droppedClass == "columns" ? "column" : droppedClass == "drag" ? "filter" : droppedClass == "values" ? "value" : "", isFiltered, isSorted, droppedPosition);
                        }
                        else {
                            var fieldCaption = this._schemaData.element.find("div[tag ^=" + "'" + headerTag + "'" + "]:first").text();
                            this._schemaData.element.find("div[tag ^=" + "'" + headerTag + "'" + "]:first").remove();
                            this._schemaData._createPivotButton({ fieldName: headerTag.split(":")[1], fieldCaption: fieldCaption }, droppedClass == "rows" ? "row" : droppedClass == "columns" ? "column" : droppedClass == "drag" ? "filter" : droppedClass == "values" ? "value" : "", isFiltered, isSorted, droppedPosition);
                        }
                    }
                    droppedClass = droppedClass == "rows" ? "schemaRow" : droppedClass == "columns" ? "schemaColumn" : droppedClass == "drag" ? "schemaFilter" : droppedClass == "values" ? "schemaValue" : "";
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        params = JSON.parse(this._olapReport).CurrentCube + "--" + headerTag + "--" + axisName + "--" + droppedPosition;
                        if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                            this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
                        var serializedCustomObject = JSON.stringify(this.model.customObject);
                        eventArgs = JSON.stringify({ "action": "nodeDropped", "dropType": "SplitButton", "nodeInfo": params, "currentReport": report, "gridLayout": this.model.layout, "customObject": serializedCustomObject });
                        if (!this.model.enableDeferUpdate)
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.nodeDropped, eventArgs, this._pvtBtnDroppedSuccess);
                        else {
                            if (!ej.isNullOrUndefined(this._waitingPopup))
                                this._waitingPopup.hide();
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._pvtBtnDroppedSuccess);
                        }
                    }
                    else {
                        if (this._calculatedField.length > 0 && droppedClass != "schemaValue" && this._schemaData != null)
                            this._calculatedFieldNodeRemove(headerTag);
                        if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                            this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
                        var serializedCustomObject = JSON.stringify(this.model.customObject);
                        var filterParams = ej.Pivot._getFilterParams(droppedClass, this._tempFilterData, headerText);
                        eventArgs = JSON.stringify({ "action": "nodeDropped", "dropAxis": droppedClass + "::" + droppedPosition, "headerTag": JSON.stringify(headerTag), "sortedHeaders": this._ascdes, "filterParams": filterParams, "currentReport": report, "customObject": serializedCustomObject });
                            successMethod = this._renderControlSuccess;
                            if (!this.model.enableDeferUpdate)
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.nodeDropped, eventArgs, this._pvtBtnDroppedSuccess);
                            else {
                                if (!ej.isNullOrUndefined(this._waitingPopup))
                                    this._waitingPopup.hide();
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._pvtBtnDroppedSuccess);
                            }
                    }
                }
                else {
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && droppedClass != "values" && $.grep(this._calculatedField, function (value) { return value.name == headerText; }).length > 0) {
                        ej.Pivot._createErrorDialog(this._getLocalizedLabels("CalcValue"), this._getLocalizedLabels("Warning"), this);
                        this.model.editCellsInfo = {};
                        this._populatePivotGrid();
                        return;
                    }
                    var droppedItem = this._getDroppedItem(headerText);
                    var buttonFields = { fieldName: droppedItem[0].fieldName, fieldCaption: droppedItem[0].fieldCaption };
                    var droppedAxis = args.element.parents(".pivotButton").attr("tag").split(":")[0];
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && droppedItem.length > 0 && (droppedClass == "drag"))
                        droppedItem[0]["advancedFilter"] = [];
                    if ($.isNumeric(droppedPosition)) {
                        if (droppedClass == droppedAxis.toLowerCase() && droppedPosition > orignalPosition)
                            droppedClass == "rows" ? this.model.dataSource.rows.splice(droppedPosition - 1, 0, droppedItem[0]) : droppedClass == "columns" ? this.model.dataSource.columns.splice(droppedPosition - 1, 0, droppedItem[0]) : droppedClass == "values" ? (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this.model.dataSource.values[0]["measures"].splice(droppedPosition - 1, 0, droppedItem[0]) : this.model.dataSource.values.splice(droppedPosition, 0, droppedItem[0])) : this.model.dataSource.filters.splice(droppedPosition, 0, droppedItem[0]);
                        else
                            droppedClass == "rows" ? this.model.dataSource.rows.splice(droppedPosition, 0, droppedItem[0]) : droppedClass == "columns" ? this.model.dataSource.columns.splice(droppedPosition, 0, droppedItem[0]) : droppedClass == "values" ? (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this.model.dataSource.values[0]["measures"].splice(droppedPosition, 0, droppedItem[0]) : this.model.dataSource.values.splice(droppedPosition, 0, droppedItem[0])) : this.model.dataSource.filters.splice(droppedPosition, 0, droppedItem[0]);
                    }
                    else
                        droppedClass == "rows" ? this.model.dataSource.rows.push(droppedItem[0]) : droppedClass == "columns" ? this.model.dataSource.columns.push(droppedItem[0]) : droppedClass == "values" ? this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this.model.dataSource.values[0]["measures"].push(droppedItem[0]) : this.model.dataSource.values.push(droppedItem[0]) : this.model.dataSource.filters.push(droppedItem[0]);

                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this._calculatedField.length > 0 && droppedClass != "values") {
                        if (this._schemaData != null)
                            this._calcFieldNodeDrop(droppedItem[0]);
                        this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) {
                            return (ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false) || (value.isCalculatedField == true && value.formula.indexOf(droppedItem[0].fieldName) == -1);
                        });
                    }

                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        this.model.dataSource = this.clearDrilledItems(this.model.dataSource, { action: "pvtBtnDropped" },this);
                    }
                    if (this._schemaData != null) {
                        if (droppedClass == droppedAxis && droppedPosition > orignalPosition)
                            droppedPosition = droppedPosition - 1;
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                            this._schemaData.element.find("button[fieldName='" + headerText + "']").remove();
                        else
                            this._schemaData.element.find("#pivotButton" + headerText).parent().remove();
                        this._schemaData._createPivotButton(buttonFields, droppedClass == "rows" ? "row" : droppedClass == "columns" ? "column" : droppedClass == "drag" ? "filter" : droppedClass == "values" ? "value" : "", isFiltered, isSorted, droppedPosition);
                    }
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        if (!ej.isNullOrUndefined(this._waitingPopup))
                            this._waitingPopup.show();
                        this.getJSONData({ action: "pvtBtnDropped" }, this.model.dataSource, this);
                    }
                    else {
                        this.model.editCellsInfo = {};
                        this._populatePivotGrid();
                    }
                }
            }
            else
                this._removePvtBtn(args);
            if (!ej.isNullOrUndefined(this._schemaData))
            this._schemaData._setPivotBtnWidth();
        },

        _getDroppedItem1: function (headerText) {
            var isOlapMode = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? true : false;
            var droppedItem = $.grep(this.model.dataSource.columns, function (value) { return value.fieldName == headerText; });
            if (droppedItem.length > 0) this.model.dataSource.columns = $.grep(this.model.dataSource.columns, function (value) { return value.fieldName != headerText; });
            else {
                droppedItem = $.grep(this.model.dataSource.rows, function (value) { return value.fieldName == headerText; });
                if (droppedItem.length > 0) this.model.dataSource.rows = $.grep(this.model.dataSource.rows, function (value) { return value.fieldName != headerText; });
                else {
                    var valuesItems = this.model.dataSource.values;
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                    {
                        valuesItems = this.model.dataSource.values[0]["measures"];
                    }
                    droppedItem = $.grep(valuesItems, function (value) { return value.fieldName == headerText; });
                    if (droppedItem.length > 0)
                    {
                        if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                            this.model.dataSource.values[0]["measures"] = $.grep(valuesItems, function (value) { return value.fieldName != headerText; });
                        else
                            this.model.dataSource.values = $.grep(valuesItems, function (value) { return value.fieldName != headerText; });
                    }
                    else {
                        droppedItem = $.grep(this.model.dataSource.filters, function (value) { return value.fieldName == headerText; });
                        if (droppedItem.length > 0) this.model.dataSource.filters = $.grep(this.model.dataSource.filters, function (value) { return value.fieldName != headerText; });
                    }
                }
            }
            return droppedItem;
        },
       
        _clearCollapsedItems: function (dragAxis, headerText, dataSource) {
            if (dragAxis == "rowheader") {
                dataSource.rows = $.map(dataSource.rows, function (value) { 
                    if ((value.drilledItems != undefined) && value.drilledItems.length){
                        value.drilledItems = $.map(value.drilledItems, function (values) { if (values.join("").indexOf(headerText.repItms.replace(/&/g, "&amp;")) < 0) return [values]; });
                    }
                    return value;
                });
            }
            else if (dragAxis == "colheader") {
                dataSource.columns = $.map(dataSource.columns, function (value) {
                    if ((value.drilledItems != undefined) && value.drilledItems.length) {
                        value.drilledItems = $.map(value.drilledItems, function (values) {
                            if (values.join("").indexOf(headerText.repItms.replace(/&/g, "&amp;")) < 0)
                                return [values];
                        });
                    }
                    return value;
                });
            }
            return dataSource;
        },

        _setSplitBtnTargetPos: function (args, droppedClass, element) {
            var targetPosition = ""; var AEBdiv; var targetSplitBtn; var className;
            if (element == "drop")
                targetSplitBtn = $(args.target).parents(".pivotButton");
            else
                targetSplitBtn = $(args.element).parents(".pivotButton");
            droppedClass = droppedClass == "column" ? "columns" : droppedClass == "row" ? "rows" : droppedClass == "filter" ? "drag" : droppedClass == "value" ? "values" : droppedClass;
            AEBdiv = this.element.find("." + droppedClass).children(".pivotButton");
            for (var i = 0; i < AEBdiv.length; i++) {
                if ($(AEBdiv[i]).attr("tag") == $(targetSplitBtn).attr("tag"))
                    targetPosition = i;
            }
            return targetPosition;
        },

        _pvtBtnDroppedSuccess: function (args) {
            var report = null;
            if (!ej.isNullOrUndefined(args[0]) && args.length > 0) {
                if (args[2] != null && args[2] != undefined)
                    this.model.customObject = args[2].Value;
            }
            else if (!ej.isNullOrUndefined(args.d) && args.d.length > 0) {
                if (args.d[2] != null && args.d[2] != undefined)
                    this.model.customObject = args.d[2].Value;
            }
            else if (!ej.isNullOrUndefined(args) && !ej.isNullOrUndefined(args.OlapReport)) {
                if (args != null && args.customObject != undefined)
                    this.model.customObject = args.customObject;
            }
            if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
            if (!this.model.enableDeferUpdate)
                this._renderControlSuccess(args);
            else
                this._deferUpdateSuccess(args);
        },

        _deferUpdateSuccess: function (msg) {
            if (!ej.isNullOrUndefined(msg.PivotReport) || !ej.isNullOrUndefined(msg.OlapReport)) {
                ej.isNullOrUndefined(msg.PivotReport) ? this.setOlapReport(msg.OlapReport) : this.setOlapReport(msg.PivotReport);
                if (msg.HeaderCounts != undefined && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                    this.model.pivotControl._pagerObj.initPagerProperties(JSON.parse(msg.HeaderCounts), JSON.parse(msg.PageSettings));
            }
            else {
                this.setOlapReport(msg.d[0].Value);
                if ($(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                    this.model.pivotControl._pagerObj.initPagerProperties(JSON.parse(msg.d[2].Value), JSON.parse(msg.d[1].Value));
            }
            if (this.model.enableGroupingBar) {
                report = JSON.parse(this.getOlapReport());
                this._pivotTableFields = JSON.parse(report.ItemsProperties);
                this._createGroupingBar(report);
                this.element.find(".grpRow .rows").text("");
                this.element.find(".grpRow .rows").children().remove();
                this.element.find(".grpRow .rows").append(this._pivotRow);
                this._createFields(null, $("#" + this._id).find(".pivotGridTable").width(), $("#" + this._id).find(".pivotGridTable th").outerWidth());
            }
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this._calculatedField.length > 0 && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this._schemaData != null)
                this._schemaButtonCreate();
            ej.Pivot.closePreventPanel(this);
        },

        _clientRemovePvtBtn: function (args) {
            if (!ej.isNullOrUndefined(this._waitingPopup))
                this._waitingPopup.show();
            var headerText = $($(args.target).siblings()[0]).attr("fieldName");
            delete this._fieldMembers[headerText.toLowerCase()];
            delete this._fieldSelectedMembers[headerText.toLowerCase()];
            if (this._calculatedField.length > 0 && $.grep(this.model.dataSource.values, function (value) { return value.fieldName == headerText; }).length > 0)
                this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) { return ((value.isCalculatedField == null || value.isCalculatedField == false) || value.formula.indexOf(headerText) == -1) && value.fieldName != headerText; });
            else
                ej.Pivot.removeReportItem(this.model.dataSource, headerText, headerText.toLocaleLowerCase().indexOf("measures") == 0);
            this.refreshControl();
            if (!ej.isNullOrUndefined(this._schemaData)) {
                this._schemaData._tableTreeObj.element.find("li[tag='" + headerText + "']").removeClass("filter").find(".treeDrop,.filter").remove();
                this._schemaData.refreshControl();
            }
        },

        _removePvtBtn: function (args) {
            this._isUpdateRequired = true;
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                var caption;
                if (args.type == "click") {
                    var headerText = $($(args.target).siblings()[0]).attr("fieldName"), selectedElement = "", uniqueName = "";
                    caption = $($(args.target).siblings()[0]).text();
                }
                else {
                    var headerText = args.element.attr("fieldName"), selectedElement = "", uniqueName = "";
                    caption = args.element.text();
                }
                for (var i = 0; i < this.element.find(".pivotButton").length; i++) {
                    uniqueName = $(this.element.find(".pivotButton")[i]).find("button").attr("fieldName");
                    if (uniqueName == headerText)
                        selectedElement = $(this.element.find(".pivotButton")[i]);
                }
                $(selectedElement).remove();
                if (this._schemaData != null) {
                    var schemaUncheck = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this._schemaData._tableTreeObj.element.find("li [tag='" + headerText + "']") : this._schemaData._tableTreeObj.element.find("li[id='" + headerText + "']");
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && schemaUncheck.length == 0 && headerText.toLowerCase() == "measures") {
                        this._schemaData.element.find("div[tag='" + selectedElement.attr("tag") + "']").remove();
                        for (var i = 0; i < this.model.dataSource.values[0]["measures"].length; i++) {
                            this._schemaData._nodeCheck = true;
                            selectedTreeNode = this._schemaData._tableTreeObj.element.find("li[tag='" + this.model.dataSource.values[0]["measures"][i].fieldName + "']");
                            this._schemaData._tableTreeObj.uncheckNode(selectedTreeNode);
                            this.element.find("div[tag='values:" + this.model.dataSource.values[0]["measures"][i].fieldName + "']").remove();
                            this._schemaData.element.find("div[tag='values:" + this.model.dataSource.values[0]["measures"][i].fieldName + "']").remove();
                        }
                        this.model.dataSource.values[0]["measures"] = [];
                        if (!ej.isNullOrUndefined(this._waitingPopup))
                            this._waitingPopup.show();
                        this.getJSONData({ action: "removeBtn" }, this.model.dataSource, this);
                    }
                    this._schemaData._tableTreeObj.uncheckNode(schemaUncheck);
                }
                else {
                    this.model.dataSource.columns = $.grep(this.model.dataSource.columns, function (value) {
                        return value.fieldName != headerText;
                    });
                    this.model.dataSource.rows = $.grep(this.model.dataSource.rows, function (value) {
                      
                        return value.fieldName != headerText;
                    });
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        if ((selectedElement.attr("tag").split(":")[1].toLowerCase() == "measures")) {
                            this.model.dataSource.values[0]["measures"] = []
                        }
                        else if ((this._getItemPosition(this.model.dataSource.values[0]["measures"], selectedElement.attr("tag").split(":")[1])).length > 0)
                            this.model.dataSource.values[0]["measures"].splice(this._getItemPosition(this.model.dataSource.values[0]["measures"], selectedElement.attr("tag").split(":")[1])[0], 1);
                    }
                    else {
                        if (this._calculatedField.length > 0)
                            this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) { return ((value.isCalculatedField == null || value.isCalculatedField == false)|| value.formula.indexOf(headerText) == -1) && value.fieldName != headerText; });
                        else
                            this.model.dataSource.values = $.grep(this.model.dataSource.values, function (value) { return value.fieldName != headerText; });
                    }
                    this.model.dataSource.filters = $.grep(this.model.dataSource.filters, function (value) {
                        return value.fieldName != headerText;
                    });
                    if (this.model.analysisMode != ej.Pivot.AnalysisMode.Olap && this.model.operationalMode != ej.Pivot.OperationalMode.ClientMode) {
                        this.model.editCellsInfo = {};
                        this._populatePivotGrid();
                    }
                    else {
                        if (!ej.isNullOrUndefined(this._waitingPopup))
                            this._waitingPopup.show();
                        this.model.dataSource = this.clearDrilledItems(this.model.dataSource, { action: "removeButton" },this);
                        this.getJSONData({ action: "removeButton" }, this.model.dataSource, this);
                    }

                }
            }
            else {
                var headerText;
                if (args.type == "click") {
                    headerText = $($(args.target).siblings()[1]).attr("fieldcaption");
                    var headerTag = $($(args.target).siblings()[1]).parent().attr('tag');
                    var report, eventArgs;
                }
                else {
                    headerText = args.element.attr("fieldcaption");
                    var headerTag = args.element.parent().attr("tag"), eventArgs;
                }
                delete this._fieldMembers[headerTag.split(':')[headerTag.split(':').length - 1]];
                delete this._fieldSelectedMembers[headerTag.split(':')[headerTag.split(':').length - 1]];
                filterTag = "", filterItems = "", selectedElement = "", headerTag = "", uniqueName = "", report = "";
                selectedElement = this.element.find(".pivotButton:contains(" + headerText + ")");
                for (var i = 0; i < this._pivotTableFields.length; i++) {
                    if (this._pivotTableFields[i].name == headerText) {
                        this._pivotTableFields[i].isSelected = false;
                        headerTag = this._pivotTableFields[i];
                    }
                }
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    headerTag = $(selectedElement).attr("tag");
                    var uniqueName = ((headerTag.indexOf("[Measures]") > -1) || (headerTag.indexOf("[") > -1)) ? headerTag.split(":")[1] : this._getNodeUniqueName(headerTag);
                    if (uniqueName == "[Measures]") {
                        selectedElement.remove();
                        if (!ej.isNullOrUndefined(this._schemaData)) {
                            this._schemaData.element.find(".pivotButton:contains(" + headerText + ")").remove();
                            for (var i = 0; i < this._schemaData.model.pivotCalculations.length && headerTag.indexOf("Measures") > -1; i++) {
                                uniqueName = this._schemaData.model.pivotCalculations[i].Tag;
                                this._schemaData._isMeasureBtnRemove = true;
                                selectedTreeNode = this._getNodeByUniqueName(uniqueName);
                                this._schemaData._tableTreeObj.uncheckNode(selectedTreeNode);
                            }
                            this._schemaData.element.find(".schemaNoClick").addClass("freeze");
                        }
                        this._waitingPopup.show();                            
                        if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                            this._trigger("beforeServiceInvoke", { action: "removeButton", element: this.element, customObject: this.model.customObject });
                        var serializedCustomObject = JSON.stringify(this.model.customObject);
                        eventArgs = JSON.stringify({ "action": "removeButton", "headerInfo": headerTag, "currentReport": report, "gridLayout": this.model.layout, "customObject": serializedCustomObject });
                        if ((!ej.isNullOrUndefined(this._schemaData)) && headerTag.indexOf("[Measures]") < 0 && headerTag.indexOf("Measures") >= 0) {
                            this._schemaData.element.find(".schemaValue .pivotButton").remove()
                        }
                        if (this.model.enableDeferUpdate && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                            this._removeButtonDeferUpdate = true;
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.removeButton, eventArgs.replace("removeButton", "removeButtonDeferUpdate"), this._pvtBtnDroppedSuccess)
                            this.element.find(".schemaNoClick").removeClass("freeze");
							this._waitingPopup.hide(); 
                        }
                        else {
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.removeButton, eventArgs, this._pvtBtnDroppedSuccess);
                        }
                    }
                    else {
                        if (!ej.isNullOrUndefined(this._schemaData)) {
                            selectedTreeNode = this._getNodeByUniqueName(uniqueName);
                            this._schemaData._tableTreeObj.uncheckNode(selectedTreeNode);
                        }
                        else {
                            var serializedCustomObject = JSON.stringify(this.model.customObject);
                            eventArgs = JSON.stringify({ "action": "removeButton", "headerInfo": headerTag, "currentReport": report, "gridLayout": this.model.layout, "customObject": serializedCustomObject });
                            if (ej.isNullOrUndefined(headerTag))
                                return false;
                            if (!ej.isNullOrUndefined(this._waitingPopup))
                                this._waitingPopup.show();
                            if (!this.model.enableDeferUpdate)
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.removeButton, eventArgs, this._pvtBtnDroppedSuccess)
                            else {
                                this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.removeButton, eventArgs.replace("removeButton", "removeButtonDeferUpdate"), this._pvtBtnDroppedSuccess)
                            }
                        }
                    }
                }
                else {
                    filterTag = "schemaRow::" + headerTag.id + "::FILTERED" + filterItems;
                    var dropAxis = this._droppedClass != "" ? this._droppedClass : headerTag.pivotType == "PivotItem" ? "schemaRow" : "schemaValue", eventArgs, axisName, params;
                    this._droppedClass = "";
                    $(selectedElement).remove();
                    this._waitingPopup = this.element.data("ejWaitingPopup");
                    if (!ej.isNullOrUndefined(this._waitingPopup))
                        this._waitingPopup.show();
                    if (this._schemaData != null) {
                            var schemaUncheck = this._schemaData._tableTreeObj.element.find("li:contains('" + headerText + "')");
                            this._schemaData._tableTreeObj.uncheckNode(schemaUncheck);
                    }
                    else {
                        if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "nodeStateModified", element: this.element, customObject: this.model.customObject });
                        var serializedCustomObject = JSON.stringify(this.model.customObject);
                        eventArgs = JSON.stringify({ "action": "nodeStateModified", "headerTag": JSON.stringify(headerTag), "dropAxis": dropAxis + "::", "sortedHeaders": this._ascdes, "filterParams": filterTag, "currentReport": report, "customObject": serializedCustomObject });
                        if (!this.model.enableDeferUpdate)
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.nodeStateModified, eventArgs, this._nodeStateModifiedSuccess);
                        else {
                            this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.nodeStateModified, eventArgs.replace("nodeStateModified", "nodeStateModifiedDeferUpdate"), this._nodeStateModifiedSuccess);
                            if (!ej.isNullOrUndefined(this._waitingPopup))
                                this._waitingPopup.hide();
                        }
                    }
                }
            }
        },

        _getNodeUniqueName: function (headerTag) {
            var uniqueName = "", selectedTreeNode = null;
            for (var i = 0; i < (headerTag.split(':')[1]).split('.').length; i++) {
                if (uniqueName != "")
                    uniqueName += ".";
                uniqueName += "[" + ((headerTag.split(':')[1]).split('.')[i]) + "]";
            }
            return uniqueName;
        },

        _getNodeByUniqueName: function (nodeUniqueName) {
            var selectedTreeNode = null;
            for (var i = 0; i < $(this._schemaData._tableTreeObj.element.find("li")).length; i++) {
                if ($(this._schemaData._tableTreeObj.element.find("li")[i]).attr("tag").toLowerCase() == nodeUniqueName.toLowerCase())
                    selectedTreeNode = $((this._schemaData._tableTreeObj.element.find("li"))[i]);
            }

            return selectedTreeNode;
        },

        _nodeStateModifiedSuccess: function (report) {
            if (report[0] != undefined) {
                if (report[2] != null && report[2] != undefined)
                    this.model.customObject = report[2].Value;
            }
            else if (report.d != undefined) {
                if (report.d[2] != null && report.d[2] != undefined)
                    this.model.customObject = report.d[2].Value;
            }
            else {
                if (report.customObject != null && report.customObject != undefined)
                    this.model.customObject = report.customObject;
            }
            if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "nodeStateModified", element: this.element, customObject: this.model.customObject });
            if (!this.model.enableDeferUpdate)
                this._renderControlSuccess(report);
            else
                this._deferUpdateSuccess(report);
        },

        _drillDownSuccess: function (msg) {
            if (msg[0] != undefined) {
                this.setJSONRecords(msg[0].Value);
                this.setOlapReport(msg[1].Value);
                if (typeof (oclientProxy) != "undefined") {
                    oclientProxy.currentReport = JSON.parse(msg[1].Value).Report;
                    if (msg[2].Value != undefined && msg[2].Value != "undefined")
                        oclientProxy.reports = msg[2].Value;
                }
                if (msg[3] != null && msg[3] != undefined && msg[3].Key == "PageSettings") {
                    if (this.model.enableVirtualScrolling) {
                        this._categPageCount = Math.ceil(JSON.parse(msg[4].Value).Column / JSON.parse(msg[3].Value).CategorialPageSize);
                        this._seriesPageCount = Math.ceil(JSON.parse(msg[4].Value).Row / JSON.parse(msg[3].Value).SeriesPageSize);
                        this._categCurrentPage = JSON.parse(msg[3].Value).CategorialCurrentPage;
                        this._seriesCurrentPage = JSON.parse(msg[3].Value).SeriesPageSize;
                    }
                    else if (this._pagerObj !=null && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                        this._pagerObj.initPagerProperties(JSON.parse(msg[4].Value), JSON.parse(msg[3].Value));
                    else if (typeof (oclientProxy) != "undefined" && oclientProxy._pagerObj != null) {
                        oclientProxy._pagerObj.initPagerProperties(JSON.parse(msg[4].Value), JSON.parse(msg[3].Value));
                    }
                    if (msg[5] != null && msg[5] != undefined)
                        this.model.customObject = msg[5].Value;
                }
                if (msg[3] != null && msg[3] != undefined && msg[3].Key != "PageSettings")
                    this.model.customObject = msg[3].Value;
            }
            else if (msg.d != undefined) {
                this.setJSONRecords(msg.d[0].Value);
                this.setOlapReport(msg.d[1].Value);
                if (typeof (oclientProxy) != "undefined") {
                    oclientProxy.currentReport = JSON.parse(msg.d[1].Value).Report;
                    if (msg.d[2].Value != undefined && msg.d[2].Value != "undefined")
                        oclientProxy.reports = msg.d[2].Value;
                    this._updatePageSettings(msg.d, oclientProxy);
                }
                if (msg.d[3] != null && msg.d[3] != undefined && msg.d[3].Key == "PageSettings") {
                    if (this.model.enableVirtualScrolling || ((typeof (oclientProxy) != "undefined") && oclientProxy.model.enableVirtualScrolling)) {
                        this._categPageCount = Math.ceil(JSON.parse(msg.d[4].Value).Column / JSON.parse(msg.d[3].Value).CategorialPageSize);
                        this._seriesPageCount = Math.ceil(JSON.parse(msg.d[4].Value).Row / JSON.parse(msg.d[3].Value).SeriesPageSize);
                        this._categCurrentPage = JSON.parse(msg.d[3].Value).CategorialCurrentPage;
                        this._seriesCurrentPage = JSON.parse(msg.d[3].Value).SeriesCurrentPage;
                    }
                    else if (this._pagerObj != null && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                        this._pagerObj.initPagerProperties(JSON.parse(msg.d[4].Value), JSON.parse(msg.d[3].Value));
                    else if (typeof (oclientProxy) != "undefined" && oclientProxy._pagerObj != null) {
                        oclientProxy._pagerObj.initPagerProperties(JSON.parse(msg.d[4].Value), JSON.parse(msg.d[3].Value));
                    }
                    if (msg.d[5] != null && msg.d[5] != undefined)
                        this.model.customObject = msg.d[5].Value;
                }
                if (msg.d[3] != null && msg.d[3] != undefined && msg.d[3].Key != "PageSettings")
                    this.model.customObject = msg.d[3].Value;
            }
            else {
                this.setJSONRecords(msg.PivotRecords);
                this.setOlapReport(msg.OlapReport);
                if (typeof (oclientProxy) != "undefined") {
                    oclientProxy.currentReport = JSON.parse(msg.OlapReport).Report;
                    if (msg.ClientReports != undefined && msg.ClientReports != "undefined")
                        oclientProxy.reports = msg.ClientReports;
                    if ((msg.PageSettings != undefined && msg.PageSettings != null) && oclientProxy._pagerObj != null) {
                        oclientProxy._pagerObj.initPagerProperties(JSON.parse(msg.HeaderCounts), JSON.parse(msg.PageSettings));
                    }
                }
                if (msg.PageSettings != undefined && msg.PageSettings != null) {
                    if (this.model.enableVirtualScrolling || ((typeof (oclientProxy) != "undefined") && oclientProxy.model.enableVirtualScrolling)) {
                        this._categPageCount = Math.ceil(JSON.parse(msg.HeaderCounts).Column / JSON.parse(msg.PageSettings).CategorialPageSize);
                        this._seriesPageCount = Math.ceil(JSON.parse(msg.HeaderCounts).Row / JSON.parse(msg.PageSettings).SeriesPageSize);
                        this._categCurrentPage = JSON.parse(msg.PageSettings).CategorialCurrentPage;
                        this._seriesCurrentPage = JSON.parse(msg.PageSettings).SeriesCurrentPage;
                    }
                    else if (this._pagerObj && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                        this._pagerObj.initPagerProperties(JSON.parse(msg.HeaderCounts), JSON.parse(msg.PageSettings));
                }
                if (msg.customObject != null && msg.customObject != undefined)
                    this.model.customObject = msg.customObject;
            }
            if (this.model.afterServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "drillDown", element: this.element, customObject: this.model.customObject });
            if (this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout && this.model.enableVirtualScrolling == false && $(".e-pivotpager")[0] == null)
                this.excelLikeLayout(this.getJSONRecords());
            else
            this.renderControlFromJSON(this.getJSONRecords());
            try {
                this.model.currentReport = JSON.parse(this.getOlapReport()).Report;
            }
            catch (err) {
                this.model.currentReport = this.getOlapReport();
            }
            this._trigger("drillSuccess", this.element);
            if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null) {
                if ($("#" + oclientProxy._id + "_maxView")[0] && this._maxViewLoading) {
                    this._maxViewLoading.hide();
                    oclientWaitingPopup.hide();
                }
                else if (oclientProxy.model.displaySettings.mode == "gridOnly")
                    oclientWaitingPopup.hide();
            }
            else if (typeof oclientProxy != 'undefined') {
                if (oclientProxy && !oclientProxy._pivotGrid._startDrilldown && !oclientProxy._pivotChart._startDrilldown || oclientProxy.model.displaySettings.mode == "gridOnly")
                    oclientProxy._waitingPopup.hide();
            }
            else if (typeof oclientWaitingPopup == 'undefined') {
                this._waitingPopup = $("#" + this._id).data("ejWaitingPopup");
                this._waitingPopup.hide();
            }
            if (typeof oclientProxy != 'undefined')
                oclientProxy._pivotGrid._startDrilldown = false;
            else
                this._waitingPopup.hide();
            var eventArgs = { action: this._drillAction, customObject: this.model.customObject, element: this.element };
            this._trigger("renderSuccess", eventArgs);
        },
		
        saveReport: function (name, storage, url) {
            var mode;
            if (storage.toLowerCase() == "local")
                this._trigger("saveReport", ({ report: this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? this.model.dataSource : this.getOlapReport() }));
            else {
                if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    report = JSON.stringify(this.model.dataSource);
                    mode = "clientMode";
                }
                else if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    report = JSON.parse(this.getOlapReport()).Report;
                    mode = "serverMode";
                }
                if (this.model.beforeServiceInvoke != null)
                    this._trigger("beforeServiceInvoke", { action: "saveReport", element: this.element, customObject: this.model.customObject });
                var serializedCustomObject = JSON.stringify(this.model.customObject);
                this.doAjaxPost("POST", url + "/" + this.model.serviceMethodSettings.saveReport, JSON.stringify({
                    "reportName": name, "clientReports": report, "operationalMode": mode, "customObject": serializedCustomObject
                }));
            }
        },

        loadReport: function (name, storage, url) {
            var args, mode;
			this._waitingPopup.show();
			if (storage.toLowerCase() == "local") {
			    if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
			        this._trigger("loadReport", { targetControl: this, dataModel: this.model.analysisMode });
			        this.refreshPivotGrid();
			    }
			    else {
			        this._trigger("loadReport", { targetControl: this, dataModel: this.model.analysisMode });
			        var clientReports;
			        try {
			            clientReports = JSON.parse(this.getOlapReport()).Report;
			        }
			        catch (err) {
			            clientReports = this.getOlapReport();
			        }
			        if (this.model.beforeServiceInvoke != null)
			            this._trigger("beforeServiceInvoke", { action: "loadReport", element: this.element, customObject: this.model.customObject });
			        this._trigger("beforeServiceInvoke", { action: "loadReport", element: this.element, customObject: this.model.customObject });
			        var serializedCustomObject = JSON.stringify(this.model.customObject);
			        if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
			            mode = "clientMode";
			            this.doAjaxPost("POST", url + "/" + this.model.serviceMethodSettings.loadReport, JSON.stringify({ "action": "loadReport", "gridLayout": this.layout(), "enablePivotFieldList": this.model.enablePivotFieldList, "reportName": name, "operationalMode": mode, "customObject": serializedCustomObject }), this._loadReportSuccess);
			        }

			        else if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
			            mode = "serverMode";
			            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
			                args = JSON.stringify({ "action": "loadReport", "reportName": name, "gridLayout": this.model.layout, "enablePivotFieldList": this.model.enablePivotFieldList, "operationalMode": mode, "customObject": serializedCustomObject });
			            }
			            else
			                args = JSON.stringify({ "action": "loadReport", "gridLayout": this.layout(), "enablePivotFieldList": this.model.enablePivotFieldList, "reportName": name, "operationalMode": mode, "customObject": serializedCustomObject });
			            this.doAjaxPost("POST", url + "/" + this.model.serviceMethodSettings.loadReport, args, this._renderControlSuccess);
			        }
			    }
			}
        },

        _loadReportSuccess: function (input) {
			(input.d != undefined && input.d.length > 0) ? this.setOlapReport(JSON.parse(input.d[0].Value)) : this.setOlapReport(JSON.parse(input.report));
            this.model.dataSource = this.getOlapReport();
            this.refreshPivotGrid();
            this._unWireEvents();
            this._wireEvents();
        },
		
        doAjaxPost: function (type, url, data, onSuccess, onComplete, customArgs) {
            if (ej.isNullOrUndefined(data["XMLA"]) && JSON.parse(data)["action"] != "cellEditing") 
                this.model.editCellsInfo = {};
            var contentType, dataType, successEvt, isAsync=true;
            if ((data["XMLA"] == undefined))
                contentType = 'application/json; charset=utf-8', dataType = 'json', successEvt = $.proxy(onSuccess, this);
            else
                contentType = 'text/xml', dataType = 'xml', data = data["XMLA"], successEvt = $.proxy(onSuccess, ej.olap.base, customArgs), isAsync = ((ej.browserInfo().name == "msie" && ej.browserInfo().version <= 9) ? false : (!ej.isNullOrUndefined(customArgs) && customArgs["action"] != "loadFieldElements") ? true : false);
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
                    if (typeof this._waitingPopup !='undefined' && this._waitingPopup != null)
                    this._waitingPopup.hide();
                    if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                        oclientWaitingPopup.hide();
                    var eventArgs = { "action": this._drillAction != "" ? this._drillAction : "initialize", "customObject": this.model.customObject, "element": this.element, "Message": msg };
                    this._trigger("renderFailure", eventArgs);
                    this.renderControlFromJSON("");
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                       ej.Pivot._createErrorDialog(msg.statusText, this._getLocalizedLabels("Error"), this); msg.statusText
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
        },

        refreshPagedPivotGrid: function (axis, pageNo) {
            this._isUpdateRequired = true;
            if (typeof oclientWaitingPopup == 'undefined') {
                this._waitingPopup = $("#" + this._id).data("ejWaitingPopup");
                this._waitingPopup.show();
            }
            axis = axis.indexOf('categ') != -1 ? "categorical" : "series";
            if (this.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if (axis == "categorical")
                    this._categCurrentPage = parseInt(pageNo);
                else
                    this._seriesCurrentPage = parseInt(pageNo);
                ej.olap.base.getJSONData({ action: "navPaging" }, this.model.dataSource, this);
            }
            else {
                var report;
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
                if (!this.model.enableDeferUpdate)
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.paging, JSON.stringify({ "action": "paging", "pagingInfo": axis + ":" + pageNo, "currentReport": report, "layout": this.layout(), "customObject": JSON.stringify(this.model.customObject) }), this._renderControlSuccess);
                else {
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.paging, JSON.stringify({ "action": "pagingDeferUpdate", "pagingInfo": axis + ":" + pageNo, "currentReport": report, "layout": this.layout(), "customObject": JSON.stringify(this.model.customObject) }), this._deferUpdateSuccess);
                    if (!ej.isNullOrUndefined(this._waitingPopup))
                        this._waitingPopup.hide();
                }
            }
        },

        excelLikeLayout: function (jsonObj) {
            this._excelRowCount = 0;
            for (var index = 0; index < jsonObj.length; index++) {
                if (parseInt(jsonObj[index].Index.split(',')[0]) == 0)
                    this._excelRowCount++;
                else
                    break;
            }
            this._rowCount = this._excelRowCount;
            var copiedObject = jQuery.extend(true, [], jsonObj), excelLikeJSONRecords = [], tempRecord = [], measurePosition = null, tempColSpan = 0;
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && ((this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.dataSource.rows.length == 0 && this.model.dataSource.data != null) || (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this.getOlapReport() !== "" && JSON.parse(this.getOlapReport()).PivotRows.length == 0))) {
                this._excelLikeJSONRecords = null;
                this.renderControlFromJSON();
                this._excelRowCount = 0;
                return;
            }
            else if (this.model.analysisMode != ej.Pivot.AnalysisMode.Pivot && copiedObject != null && copiedObject != "") {
                var colMeasurePos = null, colHeaderLen;
                //for (var pos = (copiedObject[0].CSS != "colheader" ? (copiedObject[0].ColSpan) * this._rowCount : 0) ; pos < (copiedObject[0].CSS != "colheader" ? (copiedObject[0].ColSpan * this._rowCount + copiedObject[0].RowSpan - 1) : copiedObject.length) && copiedObject[pos].CSS.indexOf("value") == -1 && this._dataModel != "Pivot"; pos++) {
                for (var pos = (copiedObject[0].CSS != "colheader" ? (copiedObject[0].ColSpan) * this._excelRowCount : 0) ; pos < copiedObject.length; pos++) {
                    if (copiedObject[pos].Info.toLowerCase().indexOf("[measure") > -1)
                        colMeasurePos = parseInt(copiedObject[pos].Index.split(',')[1]);
                    if (copiedObject[pos].CSS.indexOf("value") > -1)
                        break;
                    colHeaderLen = parseInt(copiedObject[pos].Index.split(',')[1]);
                }
                if (colMeasurePos != null && colMeasurePos != colHeaderLen && colMeasurePos != 0)
                    this._columnExcelLikeLayout(copiedObject, colMeasurePos, colHeaderLen);  // measure in middle,moved totals at last of the current item
                var columnCount = copiedObject.length / this._excelRowCount;
                for (var columnC = 0; columnC < columnCount && columnC < copiedObject.length; columnC++) {  //Moved total cell to top.
                    for (var rowC = 0; rowC <= colHeaderLen && rowC < copiedObject.length; rowC++) {
                        var index = columnC * this._excelRowCount + rowC;
                        if (copiedObject[index].CSS == "colheader" && copiedObject[index].Span != "Block" && (copiedObject[index].Info.toLowerCase().indexOf("[measure") == -1 ||(copiedObject[index].Info.toLowerCase().indexOf("[measure") > -1 &&  colMeasurePos != null && colMeasurePos == 0)) && copiedObject[index].ColSpan > 1) {
                            for (var i = index; i < index + copiedObject[index].RowSpan; i++) {
                                for (var j = i + this._excelRowCount; j < i + (copiedObject[index].ColSpan * this._excelRowCount) ; j = j + this._excelRowCount)
                                    copiedObject[j].Span = "Block";
                                if (i != index)
                                    copiedObject[i].Span = "Block";
                            }
                            var totalCell = index + (copiedObject[index].RowSpan - 1) + ((copiedObject[index].ColSpan - 1) * this._excelRowCount) + 1, parentIndex = null;
                            if (copiedObject[totalCell].CSS.indexOf("summary") > -1 && copiedObject[totalCell].Value == "Total" && copiedObject[totalCell - this._excelRowCount].CSS.indexOf("summary") == -1)
                                parentIndex = totalCell;             //index + (copiedObject[index].RowSpan - 1) + ((copiedObject[index].ColSpan - 1) * this._rowCount) + 1;
                            else if (copiedObject[totalCell].CSS.indexOf("summary") > -1 && copiedObject[totalCell - this._excelRowCount].CSS.indexOf("summary") > -1) {
                                for (var i = totalCell - this._excelRowCount; i >= 0 && i < copiedObject.length; i = i - this._excelRowCount) {
                                    if (copiedObject[i].ColSpan > 1 || (copiedObject[i - this._excelRowCount].CSS.indexOf("summary") == -1 && this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode)) {
                                        parentIndex = i;  //Select total cell parent including unwanted total and multiple measure total.
                                        break;
                                    }
                                }
                            }
                            if (parentIndex != null) {
                                copiedObject[parentIndex].ColSpan = (this.model.operationalMode != ej.PivotGrid.OperationalMode.ClientMode ? copiedObject[parentIndex].ColSpan : (parseInt(copiedObject[totalCell].Index.split(",")[0]) - parseInt(copiedObject[parentIndex].Index.split(",")[0])) + 1);
                                copiedObject[index].ColSpan = copiedObject[index].ColSpan - copiedObject[parentIndex].ColSpan;
                                copiedObject[index + ((copiedObject[index].ColSpan) * this._excelRowCount)] = $.extend(true, {}, copiedObject[parentIndex]);
                                copiedObject[index + ((copiedObject[index].ColSpan) * this._excelRowCount)].RowSpan = copiedObject[parentIndex].RowSpan + copiedObject[index].RowSpan;
                                copiedObject[index + ((copiedObject[index].ColSpan) * this._excelRowCount)].Value = copiedObject[index].Value + " Total";
                            }
                        }
                    }
                }
            }
            if (copiedObject != null && copiedObject != "" && copiedObject[0].CSS != "colheader" && !(this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)) {
                if (copiedObject[0].Index == "0,0" && copiedObject[0].CSS != "colheader") {
                    tempColSpan = copiedObject[0].ColSpan;
                    if (copiedObject[0].RowSpan == 0)
                        copiedObject[0].RowSpan = 1;
                    for (var i = 0; i < copiedObject[0].RowSpan && i < copiedObject.length; i++) {
                        excelLikeJSONRecords.push(copiedObject[i]);
                        copiedObject[i].Level = 1;
                        copiedObject[i].Span = "Block";
                        //copiedObject[i].itemIndex = copiedObject[i].Index;
                    }
                }
                for (var pos = copiedObject[0].RowSpan; pos < copiedObject.length && this.model.analysisMode != ej.Pivot.AnalysisMode.Pivot && this.model.dataSource.rows.length > 0; pos = pos + this._excelRowCount) {
                    if (copiedObject[pos].Info.toLowerCase().indexOf("[measure") > -1) {
                        measurePosition = parseInt(copiedObject[pos].Index.split(',')[0]);
                        break;
                    }
                }
                for (var index = 0; index < copiedObject.length && index < this._excelRowCount; index++) {
                    if (copiedObject[index].CSS == "rowheader" && parseInt(copiedObject[index].Index.split(',')[0]) == 0 && copiedObject[index].Span != "Block") {
                        copiedObject[index].Level = 1;
                        if (copiedObject[index + this._excelRowCount] != null && copiedObject[index + this._excelRowCount].CSS.indexOf("value") == -1)
                            copiedObject[index].itemIndex = copiedObject[index + copiedObject[index].RowSpan - (this.model.analysisMode != ej.Pivot.AnalysisMode.Pivot ? 1 : 0)].Index;
                        excelLikeJSONRecords.push(copiedObject[index]);
                        if (measurePosition != null && measurePosition == 0 && copiedObject[index].Info.toLowerCase().indexOf("[measure") > -1)
                            tempRecord.push(copiedObject[index]);
                        for (var i = index + 1; i < index + copiedObject[index].RowSpan; i++) {
                            if (copiedObject[i].Info.toLowerCase().indexOf("[measure") == -1 || measurePosition != null && measurePosition != tempColSpan - 1)
                                copiedObject[i].Span = "Block";
                        }
                        this._rowExcelLikeLayout(index, copiedObject, excelLikeJSONRecords, 2, measurePosition, tempRecord, tempColSpan);
                    }
                    else if ((copiedObject[index].CSS == "summary rgtot" || copiedObject[index].CSS == "summary gtot" || copiedObject[index].CSS == "summary calc gtot" || (copiedObject[index].CSS == "colheader" && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) || (((copiedObject[index].CSS == "summary" && copiedObject[index].Value.indexOf("Total") > -1) || copiedObject[index].CSS == "summary row") && this.model.analysisMode != ej.Pivot.AnalysisMode.Pivot)) && parseInt(copiedObject[index].Index.split(',')[0]) == 0) {
                        if (measurePosition != null && measurePosition == tempColSpan - 1)
                            copiedObject[index].Value += " " + copiedObject[index + (this._excelRowCount * parseInt(copiedObject[index].ColSpan))].Value;
                        copiedObject[index].Value = copiedObject[index].Value == "Total" ? "Grand Total" : copiedObject[index].Value;
                        excelLikeJSONRecords.push(copiedObject[index]);
                        copiedObject[index].Level = 1;
                    }
                }
                if (measurePosition != null && measurePosition == 0) {
                    for (var index = 0; index < tempRecord.length; index++) {
                        excelLikeJSONRecords.push($.extend(true, {}, tempRecord[index]));
                        excelLikeJSONRecords[excelLikeJSONRecords.length - 1].CSS = "summary";
                        excelLikeJSONRecords[excelLikeJSONRecords.length - 1].Value = "Total " + excelLikeJSONRecords[excelLikeJSONRecords.length - 1].Value;
                    }
                    tempRecord.splice(0, tempRecord.length);
                }
                var len = excelLikeJSONRecords.length, currentIndex = 0, valueIndex, nextIndex;
                var isInsertable = false;
                for (var index = 0; index < len; index++) {
                    currentIndex = currentIndex + index;
                    valueIndex = excelLikeJSONRecords[index].itemIndex != null ? excelLikeJSONRecords[index].itemIndex : excelLikeJSONRecords[index].Index;
                    nextIndex = (parseInt(valueIndex.split(',')[0]) * this._excelRowCount + (parseInt(valueIndex.split(',')[1])));
                    for (var nextItem = nextIndex ; nextItem < copiedObject.length; nextItem = nextItem + this._excelRowCount) {
                        if (((copiedObject[nextItem].CSS.indexOf("value") > -1 || copiedObject[nextItem].CSS.indexOf("colheader") > -1 || copiedObject[nextItem].CSS.indexOf("calc") > -1 || copiedObject[nextItem].CSS.indexOf("cstot") > -1 || copiedObject[nextItem].CSS.indexOf("cgtot") > -1) || copiedObject[nextItem].CSS.indexOf("none") > -1) && parseInt(copiedObject[nextItem].Index.split(',')[0]) >= tempColSpan)
                            isInsertable = true;
                        if (isInsertable) {
                            currentIndex = currentIndex + (this.model.analysisMode != ej.Pivot.AnalysisMode.Pivot ? parseInt(len) : this._excelRowCount);
                            excelLikeJSONRecords[currentIndex] = $.extend(true, {}, copiedObject[nextItem]);
                        }
                    }
                    currentIndex = 0;
                    isInsertable = false;
                }
                for (var index = 0; index < len; index++) {
                    if (excelLikeJSONRecords[index] != null) {
                        excelLikeJSONRecords[index].Span = "none";
                        if (isNaN(excelLikeJSONRecords[index].Level))
                            excelLikeJSONRecords[index].Level = 1;
                        // excelLikeJSONRecords[index].Index = '0,' + index + '';
                        if (!(excelLikeJSONRecords[index].Index == "0,0" && excelLikeJSONRecords[index].CSS != "colheader" && index == 0))
                            excelLikeJSONRecords[index].RowSpan = 1;
                        if (measurePosition != null && measurePosition == tempColSpan - 1 && excelLikeJSONRecords[index].CSS == "rowheader" && excelLikeJSONRecords[index].Info.toLowerCase().indexOf("[measure") == -1)
                            excelLikeJSONRecords[index].ColSpan = excelLikeJSONRecords.length / len;
                        else if (measurePosition != null && measurePosition == 0 && (excelLikeJSONRecords[index].Info.toLowerCase().indexOf("[measure") > -1 && (excelLikeJSONRecords[index].CSS == "rowheader")))
                            excelLikeJSONRecords[index].ColSpan = excelLikeJSONRecords.length / len;
                        else if (measurePosition != null && measurePosition != tempColSpan - 1 && measurePosition != 0 && (excelLikeJSONRecords[index].Info.toLowerCase().indexOf("[measure") > -1 || (excelLikeJSONRecords[index].CSS == "rowheader" && parseInt(excelLikeJSONRecords[index].Index.split(",")[0]) < measurePosition)))
                            excelLikeJSONRecords[index].ColSpan = excelLikeJSONRecords.length / len;
                        else
                            excelLikeJSONRecords[index].ColSpan = 1;
                    }
                }
                this._excelRowCount = len;
            }
            if (copiedObject != null && excelLikeJSONRecords.length == 0)
                excelLikeJSONRecords = copiedObject;
            for (var i = 0; i < excelLikeJSONRecords.length / this._excelRowCount ; i++) {
                for (var j = 0; j < this._excelRowCount ; j++) {
                    excelLikeJSONRecords[i * this._excelRowCount + j].i = "" + i + "," + j + "";
                    excelLikeJSONRecords[i * this._excelRowCount + j].Span = "none";
                }
            }
            this._excelLikeJSONRecords = excelLikeJSONRecords;
            this.renderControlFromJSON();

        },
        _rowExcelLikeLayout: function (index, copiedObject, excelLikeJSONRecords, level, measurePosition, tempRecord,tempColSpan) {
            var isMeasure = false;
            for (var rowCellIndex = index + (this.model.analysisMode != ej.Pivot.AnalysisMode.Pivot ? copiedObject[index].ColSpan * this._excelRowCount : this._excelRowCount), span = 0; span < copiedObject[index].RowSpan && rowCellIndex < copiedObject.length && (copiedObject[rowCellIndex].CSS.indexOf("value")==-1) ; rowCellIndex++, span++) {
                if ((measurePosition != null && measurePosition != tempColSpan - 1 && measurePosition != 0) && copiedObject[rowCellIndex].Info.toLowerCase().indexOf("[measure")>-1 && copiedObject[rowCellIndex].Span != "Block")
                    isMeasure = true;
                var isMeasureLast = (measurePosition != null && measurePosition == tempColSpan - 1) ? (copiedObject[rowCellIndex].CSS == "summary row" && (copiedObject[rowCellIndex + this._excelRowCount].CSS == "summary row" || copiedObject[rowCellIndex + this._excelRowCount].CSS == "none" || copiedObject[rowCellIndex + this._excelRowCount].Info.toLowerCase().indexOf("[measure") > -1)) : (measurePosition != null && measurePosition != tempColSpan - 1 && measurePosition != 0) ? (copiedObject[rowCellIndex].CSS == "summary" && (copiedObject[rowCellIndex + this._excelRowCount].CSS == "summary" || copiedObject[rowCellIndex + this._excelRowCount].CSS == "none" || copiedObject[rowCellIndex + this._excelRowCount].Info.toLowerCase().indexOf("[measure") > -1 || parseInt(copiedObject[rowCellIndex].Index.split(",")[0]) - 1 <= measurePosition)) : false;
                if (((copiedObject[rowCellIndex].CSS == "rowheader" || copiedObject[rowCellIndex].CSS == "none") || isMeasureLast) && copiedObject[rowCellIndex].Span != "Block") {
                    for (var i = rowCellIndex + 1; i < rowCellIndex + copiedObject[rowCellIndex].RowSpan; i++) {
                        if (copiedObject[i].Info.toLowerCase().indexOf("[measure") == -1 || measurePosition != null && measurePosition != tempColSpan - 1)
                            copiedObject[i].Span = "Block";
                    }
                    copiedObject[rowCellIndex].Level = level;
                    if (copiedObject[rowCellIndex].CSS != "none") {
                        if (copiedObject[rowCellIndex + this._excelRowCount] != null && copiedObject[rowCellIndex + this._excelRowCount].CSS.indexOf("value") == -1)
                            copiedObject[rowCellIndex].itemIndex = copiedObject[rowCellIndex + copiedObject[rowCellIndex].RowSpan - (this.model.analysisMode != ej.Pivot.AnalysisMode.Pivot ? 1 : 0)].Index;
                        if (isMeasureLast) {
                            for (var rowIndex = rowCellIndex - copiedObject[index].ColSpan * this._excelRowCount; rowIndex >= 0 && rowIndex < copiedObject.length; rowIndex--) {
                                if (copiedObject[rowIndex].Value != "") {
                                    copiedObject[rowCellIndex].Value = copiedObject[rowIndex].Value;
                                    copiedObject[rowCellIndex].Level = copiedObject[index].Level; //== 1 ? 1 : (copiedObject[index].Level - 2) <= 1 ? ;
                                    break;
                                }
                            }
                            if ((measurePosition != null && measurePosition != tempColSpan - 1 && measurePosition != 0) && parseInt(copiedObject[rowCellIndex].Index.split(",")[0]) - 1 == measurePosition)
                                tempRecord.push(copiedObject[rowCellIndex]);
                            else {
                                copiedObject[rowCellIndex].Value += " " + copiedObject[rowCellIndex + (this._excelRowCount * parseInt(copiedObject[rowCellIndex].ColSpan))].Value;
                                excelLikeJSONRecords.push(copiedObject[rowCellIndex]);
                            }
                        }
                        else
                            excelLikeJSONRecords.push(copiedObject[rowCellIndex]);
                    }
                    copiedObject[rowCellIndex].Span = "Block";
                    if (copiedObject[rowCellIndex].CSS != "summary row" && copiedObject[rowCellIndex].CSS != "summary")
                        this._rowExcelLikeLayout(rowCellIndex, copiedObject, excelLikeJSONRecords, level + 1, measurePosition, tempRecord, tempColSpan);
                }
                if (isMeasure && span + 1 == copiedObject[index].RowSpan) {
                    isMeasure = false;
                    for (var i = 0; i < tempRecord.length; i++) {
                        // tempRecord[i].Value = tempRecord[i].Value.split(" ")[0];
                        tempRecord[i].Value = copiedObject[index].Value + " " + tempRecord[i].Value;
                        excelLikeJSONRecords.push(tempRecord[i]);
                    }
                    tempRecord.splice(0, tempRecord.length);
                }
            }
        },
        _columnExcelLikeLayout: function (copiedObject, colMeasurePos, colHeaderLen) {    //Moves total to last of current item, when measure is above 1
            var columnCount = copiedObject.length / this._excelRowCount;
            for (var columnC = 0; columnC < columnCount && columnC < copiedObject.length; columnC++) {
                for (var rowC = 0; rowC <= colHeaderLen && rowC < copiedObject.length; rowC++) {
                    var index = columnC * this._excelRowCount + rowC;
                    if (copiedObject[index].CSS == "colheader" && copiedObject[index].Span != "Block" && copiedObject[index].Info.toLowerCase().indexOf("[measure") == -1 && copiedObject[index].ColSpan > 1) {
                        for (var i = index; i < index + copiedObject[index].RowSpan; i++) {
                            for (var j = i + this._excelRowCount; j < i + (copiedObject[index].ColSpan * this._excelRowCount) ; j = j + this._excelRowCount)
                                copiedObject[j].Span = "Block";
                            if (i != index)
                                copiedObject[i].Span = "Block";
                        }
                        var measureCell = index + (copiedObject[index].RowSpan - 1) + ((copiedObject[index].ColSpan - 1) * this._excelRowCount) + 1;
                        if (copiedObject[measureCell].Info.toLowerCase().indexOf("[measure") > -1 && JSON.parse(this.getOlapReport()).PivotCalculations.length > 1 && colMeasurePos != null && colMeasurePos != colHeaderLen && colMeasurePos != 0) {
                            //var start = parseInt(copiedObject[index].Index.split(",")[0]), end = parseInt(copiedObject[measureCell - 1].Index.split(",")[0]);
                            var removeIndex = [];
                            for (var i = index + (copiedObject[index].RowSpan) ; i <= measureCell; i = i + (copiedObject[i].ColSpan + 1) * this._excelRowCount) { //loop from start to end of the current item for slecting measure totals
                                var totalCell = i + (copiedObject[i].RowSpan - 1) + ((copiedObject[i].ColSpan - 1) * this._excelRowCount) + 1;
                                if (copiedObject[totalCell].CSS.indexOf("summary") > -1) {       //&& copiedObject[totalCell].Value == "Total" && copiedObject[totalCell - this._rowCount].CSS.indexOf("summary") == -1) {                                     copiedObject[totalCell].Value = "";
                                    copiedObject[totalCell - 1].RowSpan = copiedObject[totalCell - 1].RowSpan + copiedObject[totalCell].RowSpan;
                                    var colToDel = (parseInt(copiedObject[totalCell].Index.split(',')[0]) * this._excelRowCount);
                                    for (var j = 0; j < this._excelRowCount; j++)
                                        copiedObject.splice((parseInt(copiedObject[measureCell].Index.split(',')[0]) * this._excelRowCount + this._excelRowCount) + j + removeIndex.length * this._excelRowCount, 0, $.extend(true, {}, copiedObject[colToDel + j]));  //Insert total cell column at last of current item and store that index
                                    removeIndex.push(colToDel);
                                    copiedObject[i].ColSpan = copiedObject[i].ColSpan - 1;
                                }
                            }
                            for (var colIndex = removeIndex.length - 1; colIndex >= 0; colIndex--)
                                copiedObject.splice((parseInt(copiedObject[removeIndex[colIndex]].Index.split(',')[0]) * this._excelRowCount), this._excelRowCount); // after inserting all totals for current item at last , remove the column at initial posiiton
                            if (removeIndex.length > 0) {
                                copiedObject[index].ColSpan = copiedObject[index].ColSpan - removeIndex.length;
                                var newTotal = index + ((copiedObject[index].ColSpan) * this._excelRowCount);
                                copiedObject[newTotal].ColSpan = removeIndex.length;
                                copiedObject[newTotal].RowSpan = copiedObject[index].RowSpan;
                                copiedObject[newTotal].Value = copiedObject[index].Value + " Total";
                                copiedObject[newTotal].CSS = "summary";
                                copiedObject[newTotal].Span = "none";
                                copiedObject[newTotal].State = 0;
                            }
                        }
                        else if (copiedObject[measureCell].Info.toLowerCase().indexOf("[measure") > -1 && copiedObject[measureCell + 1].CSS.indexOf("summary") > -1 && JSON.parse(this.getOlapReport()).PivotCalculations.length == 1 && colMeasurePos != null && colMeasurePos != colHeaderLen && colMeasurePos != 0) {
                            copiedObject[index].ColSpan = copiedObject[index].ColSpan - 1;
                            copiedObject[index + ((copiedObject[index].ColSpan) * this._excelRowCount)] = $.extend(true, {}, copiedObject[measureCell + 1]);
                            copiedObject[measureCell + 1].Value = "";
                            copiedObject[index + ((copiedObject[index].ColSpan) * this._excelRowCount)].Value = copiedObject[index].Value + " Total";
                            copiedObject[index + ((copiedObject[index].ColSpan) * this._excelRowCount)].RowSpan = copiedObject[index].RowSpan;
                        }
                    }
                }
            }
        },
        renderControlFromJSON: function () {
            var jsonObj = this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? this._excelLikeJSONRecords : this.getJSONRecords();
            if (this.model.enableConditionalFormatting && this._isFormatApply)
                jsonObj = this._refreshCellFormatting(jsonObj);
            if (this.model.enableConditionalFormatting && !this._isFormatApply)
                jsonObj = this._applyCodeBehindFormatting(jsonObj);
            var tableOlapGrid = $("<table class=\"pivotGridTable\" cellspacing=\"0\" cellpadding=\"0\" role='grid'  aria-readonly='true'></table>");
            if (this.model.isResponsive)
                tableOlapGrid.addClass("e-table");
            if (((jsonObj == null || jsonObj == "") && !this.model.enableGroupingBar)) {
                var theademptyGrid = ej.buildTag("tr", ej.buildTag("th", "", { "width": "70px" })[0].outerHTML + ej.buildTag("th", "", { "width": "70px" })[0].outerHTML + ej.buildTag("th", "", { "width": "70px" })[0].outerHTML);
                var tbodyemptyGrid = ej.buildTag("tr", ej.buildTag("td", "", { "width": "70px" })[0].outerHTML + ej.buildTag("td", "", { "width": "70px" })[0].outerHTML + ej.buildTag("td", "", { "width": "70px" })[0].outerHTML)[0].outerHTML +
                                     ej.buildTag("tr", ej.buildTag("td", "", { "width": "70px" })[0].outerHTML + ej.buildTag("td", "", { "width": "70px" })[0].outerHTML + ej.buildTag("td", "", { "width": "70px" })[0].outerHTML)[0].outerHTML +
                                     ej.buildTag("tr", ej.buildTag("td", "", { "width": "70px" })[0].outerHTML + ej.buildTag("td", "", { "width": "70px" })[0].outerHTML + ej.buildTag("td", "", { "width": "70px" })[0].outerHTML)[0].outerHTML;

                $(tableOlapGrid).append(theademptyGrid);
                $(tableOlapGrid).append(tbodyemptyGrid);
                this._rowCount = 0;
            }
            else if (jsonObj != null && jsonObj != "") {
                var rowCount = this._rowCount;
                this._rowCount = 0;
                var pGridObj = this;
                //***************Finding row count with first column***********

                for (index = 0; index < jsonObj.length; index++) {
                    if (parseInt(jsonObj[index].Index.split(',')[0]) == 0)
                        this._rowCount++;
                    else
                        break;
                }

                //***************Finding row count by last json record***********
                //this._rowCount = parseInt(jsonObj[jsonObj.length - 1].Index.split(',')[1]) + 1;
                this._rowCount = this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout ? this._excelRowCount : this._rowCount;
                var theadOlapGrid = $("<thead></thead>");
                var tbodyOlapGrid = $("<tbody></tbody>");
                var istheadOlapGrid = true; var columnHeaderHeight = 0;
                if (jsonObj[0].CSS == "none")
                    columnHeaderHeight = jsonObj[0].RowSpan - 1;
                else {
                    jQuery.each(jsonObj, function (index, value) {
                        // if (jsonObj[index].CSS == "colheader")
                        columnHeaderHeight += jsonObj[index].RowSpan;
                        return (jsonObj[index].CSS == "colheader");
                    });
                    columnHeaderHeight = columnHeaderHeight - 2;
                }
                if (this.model.frozenHeaderSettings.enableFrozenHeaders || (this.model.frozenHeaderSettings.enableFrozenRowHeaders && !this.model.frozenHeaderSettings.enableFrozenColumnHeaders) || (this.model.frozenHeaderSettings.enableFrozenRowHeaders && this.model.frozenHeaderSettings.enableFrozenColumnHeaders))
                    this._renderFrozenGridTable(istheadOlapGrid, columnHeaderHeight, jsonObj, tableOlapGrid)
                else {
                    var isNoRow = false;
                    for (index = 0; index < jsonObj.length; index++) {
                        if (index < this._rowCount) {
                            if (istheadOlapGrid) {
                                istheadOlapGrid = (index >= columnHeaderHeight) ? false : true;
                                var tRow = "<tr role='row'>";
                                if (this.model.enableGroupingBar) {
                                    if (jsonObj[index].Index == "0,0" && jsonObj[index].CSS == "colheader"){
                                        tRow = tRow + "<th class='grpRow'" + " p='-1,-1' colspan= 1 rowspan=" + (this._rowCount - 1) + "> <div class=rows>" + this._getLocalizedLabels("DragFieldHere") + "</div></th>";
                                        isNoRow = true;
                                    }
                                    
                                }
                                for (var column = index; column < jsonObj.length; column = column + this._rowCount) {
                                    if (jsonObj[column].Span != "Block") {
                                        
                                        if (jsonObj[column].Index == "0,0" && jsonObj[column].CSS != "colheader" && this.model.enableGroupingBar) {
                                            tRow = tRow + "<th class=" + "grpRow" + " p=" + jsonObj[column].Index + " colspan=" + jsonObj[column].ColSpan + " rowspan=" + jsonObj[column].RowSpan + " role='columnheader' aria-describedby='row'" + ((jsonObj[column].i == null) ? "" : "i=" + jsonObj[column].i) + ">" + ej.buildTag("span#row", "rows", { "display": "none" })[0].outerHTML + (jsonObj[column].State == 0 ? "<span style=\"margin-left: 0px\"></span>" : jsonObj[column].State == 2 ? "<span class=\"expand\ e-icon\" aria-describedby='expansion' title=\"" + this._getLocalizedLabels("Expand") + "\">&nbsp;<p id='expansion' style='display:none'>collapsed</p></span>" : (jsonObj[column].State == 1 ? "<span class=\"collapse\ e-icon\" aria-describedby='collapsing' title=\"" + this._getLocalizedLabels("Collapse") + "\">&nbsp;<p id='collapsing' style='display:none'>expanded</p></span>" : "")) + jsonObj[column].Value + ej.buildTag("div.rows", this._pivotRow, {})[0].outerHTML + "</th>";
                                        }
                                        else
                                            tRow = tRow + "<th" + (jsonObj[column].CSS == "none" ? "" : " class=\"" + jsonObj[column].CSS) + (jsonObj[column].CSS == "none" ? " p=" + jsonObj[column].Index : "\" p=" + jsonObj[column].Index) + " colspan=" + jsonObj[column].ColSpan + " rowspan=" + jsonObj[column].RowSpan + " role='columnheader'" + ((jsonObj[column].i == null) ? "" : "i=" + jsonObj[column].i) + ">" + (jsonObj[column].State == 0 ? "<span style=\"margin-left: 10px\"></span>" : (jsonObj[column].State == 2) ? "<span class=\"expand\ e-icon\" aria-describedby='expansion' title=\"" + this._getLocalizedLabels("Expand") + "\">&nbsp;<p id='expansion' style='display:none'>collapsed</p></span>" : (jsonObj[column].State == 1 ? "<span class=\"collapse\ e-icon\" aria-describedby='collapsing' title=\" " + this._getLocalizedLabels("Collapse") + "\">&nbsp;<p id='collapsing' style='display:none'>expanded</p></span>" : "")) + jsonObj[column].Value + "</th>";
                                        if (jsonObj[column].RowSpan > 1 && jsonObj[column].ColSpan <= 1) {
                                            for (var i = column + 1; i < column + jsonObj[column].RowSpan; i++)
                                                jsonObj[i].Span = "Block";
                                        }
                                        else if (jsonObj[column].ColSpan > 1 && jsonObj[column].RowSpan <= 1) {
                                            for (var i = column + this._rowCount; i < column + (jsonObj[column].ColSpan * this._rowCount) ; i = i + this._rowCount)
                                                jsonObj[i].Span = "Block";
                                        }
                                        else if (jsonObj[column].ColSpan > 1 && jsonObj[column].RowSpan > 1) {
                                            for (var i = column; i < column + jsonObj[column].RowSpan; i++) {
                                                for (var j = i + this._rowCount; j < i + (jsonObj[column].ColSpan * this._rowCount) ; j = j + this._rowCount)
                                                    jsonObj[j].Span = "Block";
                                                if (i != column)
                                                    jsonObj[i].Span = "Block";
                                            }
                                        }
                                    }
                                }
                                tRow += "</tr>";
                                $(theadOlapGrid).append(tRow);
                            }
                            else {
                                var tRow = "<tr role='row'>";
                                if (parseInt(jsonObj[index].Index.split(',')[0]) == 0 && parseInt(jsonObj[index].Index.split(',')[1]) == (this._rowCount - 1) && isNoRow)
                                    tRow = tRow + "<td class='rowheader'" + " p='-1,-2' colspan=1 rowspan=1>" + "Grant total" + "</td>";
                                for (var column = index; column < jsonObj.length; column = column + this._rowCount) {
                                    if (jsonObj[column].Span != "Block") {
                                        if (jsonObj[column].CSS == "rowheader" || jsonObj[column].CSS == "summary" || jsonObj[column].CSS.indexOf("summary rstot") > -1 || jsonObj[column].CSS.indexOf("summary stot") > -1 || jsonObj[column].CSS == "summary row" || jsonObj[column].CSS.indexOf("summary rgtot") > -1) {
                                            if (this.layout().toLowerCase() == "excellikelayout") {
                                                tRow = tRow + "<th" + (jsonObj[column].CSS == "none" ? "" : " class=\"" + jsonObj[column].CSS) + "\" p=" + jsonObj[column].Index + " colspan=" + jsonObj[column].ColSpan + " rowspan=" + jsonObj[column].RowSpan + " role='rowheader'" + ((jsonObj[column].i == null) ? "" : "i=" + jsonObj[column].i) + ">" + (jsonObj[column].State == 2 ? "<span style=\"margin-left:" + (jsonObj[column].Level * 10) + "px\" class=\"expand\ e-icon\" aria-describedby='expansion' title=\"" + this._getLocalizedLabels("Expand") + "\">&nbsp;<p id='expansion' style='display:none'>collapsed</p></span>" : (jsonObj[column].State == 1 ? "<span style=\"margin-left:" + (jsonObj[column].Level * 10) + "px\" class=\"collapse\ e-icon\" aria-describedby='collapsing' title=\"" + this._getLocalizedLabels("Collapse") + "\">&nbsp;<p id='collapsing' style='display:none'>expanded</p></span>" : "<span style=\"margin-left:" + ((this._excelLikeJSONRecords != null && jsonObj[column].CSS == "summary row") ? jsonObj[column].Level * 10 : ((jsonObj[column].Level == 1 ? 1 : jsonObj[column].Level + 2) * 10)) + "px\">&nbsp;</span>")) + jsonObj[column].Value + "</th>";
                                            }
                                            else {
                                                tRow = tRow + "<th" + (jsonObj[column].CSS == "none" ? "" : " class=\"" + jsonObj[column].CSS) + "\" p=" + jsonObj[column].Index + " colspan=" + jsonObj[column].ColSpan + " rowspan=" + jsonObj[column].RowSpan + " role='rowheader'>" + (jsonObj[column].State == 0 ? "<span style=\"margin-left: 10px\"></span>" : (jsonObj[column].State == 2) ? "<span class=\"expand\ e-icon\" aria-describedby='expansion' title=\"" + this._getLocalizedLabels("Expand") + "\">&nbsp;<p id='expansion' style='display:none'>collapsed</p></span>" : (jsonObj[column].State == 1 ? "<span class=\"collapse\ e-icon\" aria-describedby='collapsing' title=\"" + this._getLocalizedLabels("Collapse") + "\">&nbsp;<p id='collapsing' style='display:none'>expanded</p></span>" : "")) + jsonObj[column].Value + "</th>";
                                            }
                                        }
                                        else
                                            tRow = tRow + "<td" + (jsonObj[column].CSS == "none" ? "" : " class=\"" + jsonObj[column].CSS) + "\" p=" + jsonObj[column].Index + " colspan=" + jsonObj[column].ColSpan + " rowspan=" + jsonObj[column].RowSpan + " role='gridcell'" + ((jsonObj[column].i == null) ? "" : "i=" + jsonObj[column].i)+">" + (jsonObj[column].State == 2 ? "<span class=\"expand\ e-icon\" title=\"" + this._getLocalizedLabels("Expand") + "\">&nbsp;</span>" : (jsonObj[column].State == 1 ? "<span class=\"collapse\ e-icon\" title=\"" + this._getLocalizedLabels("Collapse") + "\">&nbsp;</span>" : "")) + jsonObj[column].Value + "</td>";
                                        if (jsonObj[column].RowSpan > 1 && jsonObj[column].ColSpan <= 1) {
                                            for (var i = column + 1; i < column + jsonObj[column].RowSpan; i++)
                                                jsonObj[i].Span = "Block";
                                        }
                                        else if (jsonObj[column].ColSpan > 1 && jsonObj[column].RowSpan <= 1) {
                                            for (var i = column + this._rowCount; i < column + (jsonObj[column].ColSpan * this._rowCount) ; i = i + this._rowCount)
                                                jsonObj[i].Span = "Block";
                                        }
                                        else if (jsonObj[column].ColSpan > 1 && jsonObj[column].RowSpan > 1) {
                                            for (var i = column; i < column + jsonObj[column].RowSpan; i++) {
                                                for (var j = i + this._rowCount; j < i + (jsonObj[column].ColSpan * this._rowCount) ; j = j + this._rowCount)
                                                    jsonObj[j].Span = "Block";
                                                if (i != column)
                                                    jsonObj[i].Span = "Block";
                                            }
                                        }
                                    }
                                }
                                tRow += "</tr>";
                                $(tbodyOlapGrid).append(tRow);
                            }
                        }
                    }
                    
                    if (this.model.frozenHeaderSettings.enableFrozenColumnHeaders) {
                        var scrollContent = ej.buildTag("div#scrollContent")[0].outerHTML
                        var rowvaldiv = ej.buildTag("div#rowvaluecontent")[0].outerHTML
                        $(tableOlapGrid).append($(scrollContent).append($("<div></div>").append($("<div id='coltable'></div>").append($("<table class='pivotGridColValueTable' style='width: 100%'></table>").append(theadOlapGrid)), $(rowvaldiv).append($("<div></div>").append($("<table class='pivotGridRowValueTable' style='width: 100%'></table>").append(tbodyOlapGrid))))))
                    }
                    else {
                        $(tableOlapGrid).append(theadOlapGrid);
                        $(tableOlapGrid).append(tbodyOlapGrid);
                    }
                }
            }
            this._unWireEvents();
            this._wireEvents();
            if ((!this.model.enableVirtualScrolling) && $(tableOlapGrid).find("tr:last > td").length > 0 && ($(tableOlapGrid).find("tr:last").find("td").text() == "" && (!(this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot))) && (this._pagerObj == null))
                $(tableOlapGrid).find("tr:last").hide();
            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.enableCollapseByDefault && !ej.isNullOrUndefined(jsonObj)) {
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.enableCollapseByDefault) {
                    var _rowCount = (!ej.isNullOrUndefined(this.model.dataSource.data)) ? this.model.dataSource.rows.length : JSON.parse(this.getOlapReport()).PivotRows.length;
                    var columnCount = (!ej.isNullOrUndefined(this.model.dataSource.data)) ? this.model.dataSource.columns.length : JSON.parse(this.getOlapReport()).PivotColumns.length;
                    this.model.collapsedMembers = {};
                    for (var rh = _rowCount; rh >= 0; rh--) {
                        thRList = $(tableOlapGrid).find("th[p^='" + rh + ",']:has('span.collapse')[class^='rowheader']");
                        var field = this._getFieldName(thRList[0]);
                        this.model.collapsedMembers[field] = new Array();
                        for (var thcnt = 0; thcnt < thRList.length; thcnt++) {
                            this.model.collapsedMembers[field].push($(thRList[thcnt]).clone().children().remove().end().text());
                            this._collapseMember(tableOlapGrid, $(thRList[thcnt]).find('.collapse'));
                        }
                    }
                    for (var ch = columnCount; ch >= 0; ch--) {
                        thCList = $(tableOlapGrid).find("th[p$='," + ch + "']:has('span.collapse')[class$='colheader']");
                        var field = this._getFieldName(thCList[0]);
                        this.model.collapsedMembers[field] = new Array();
                        for (var thcnt = 0; thcnt < thCList.length; thcnt++) {
                            this.model.collapsedMembers[field].push($(thRList[thcnt]).clone().children().remove().end().text());
                            this._collapseMember(tableOlapGrid, $(thCList[thcnt]).find('.collapse'));
                        }
                    }
                }
                else if (!ej.isNullOrUndefined(this.model.collapsedMembers)) {
                    for (var index = 0; index < this.model.collapsedMembers.length; index++) {
                        var item = this.model.collapsedMembers[index];
                        var fieldIndex, axis;
                        if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                            for (var i = 0; i < this.model.dataSource.rows.length; i++)
                                if (this.model.dataSource.rows[i].fieldName == index) { fieldIndex = i; axis = "row"; }
                            for (var i = 0; i < this.model.dataSource.columns.length; i++)
                                if (this.model.dataSource.columns[i].fieldName == index) { fieldIndex = i; axis = "column"; }
                            if (!ej.isNullOrUndefined(fieldIndex)) {
                                if (axis == "row") {
                                    for (var i = this.model.dataSource.columns.length + 1, currentCell; i < this._rowCount; i += ej.isNullOrUndefined(currentCell) ? 1 : currentCell.rowSpan) {
                                        currentCell = $(tableOlapGrid).find("tBody th[p='" + fieldIndex + "," + i + "']")[0];
                                        var isMatched = false;
                                        for (var j = 0; j < item.length; j++) {
                                            if ($(currentCell).text().trim() == item[j].toString().trim()) {
                                                isMatched = true;
                                                break;
                                            }
                                        }
                                        if (!ej.isNullOrUndefined(currentCell) && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader") && isMatched && $(currentCell).find('.collapse').length > 0)
                                            this._collapseMember(tableOlapGrid, $(currentCell).find('.collapse'));
                                    }
                                }
                                else if (axis == "column") {
                                    for (var i = this.model.dataSource.rows.length, currentCell; i < Math.ceil(this.getJSONRecords().length / this._rowCount) ; i += ej.isNullOrUndefined(currentCell) ? 1 : currentCell.colSpan) {
                                        currentCell = $(tableOlapGrid).find("thead th[p='" + i + "," + fieldIndex + "']")[0];
                                        var isMatched = false;
                                        for (var j = 0; j < item.length; j++) {
                                            if ($(currentCell).text().trim() == item[j].toString().trim()) {
                                                isMatched = true;
                                                break;
                                            }
                                        }
                                        if (!ej.isNullOrUndefined(currentCell) && ($(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader") && isMatched && $(currentCell).find('.collapse').length > 0)
                                            this._collapseMember(tableOlapGrid, $(currentCell).find('.collapse'));
                                    }
                                }
                            }
                        }
                        else {
                            var pivotRows = JSON.parse(this.getOlapReport()).PivotRows, pivotColumns = JSON.parse(this.getOlapReport()).PivotColumns;
                            for (var i = 0; i < pivotRows.length; i++)
                                if (pivotRows[i].FieldName == index) { fieldIndex = i; axis = "row"; }
                            for (var i = 0; i < pivotColumns.length; i++)
                                if (pivotColumns[i].FieldName == index) { fieldIndex = i; axis = "column"; }
                            if (!ej.isNullOrUndefined(fieldIndex)) {
                                if (axis == "row") {
                                    for (var i = pivotColumns.length + 1, currentCell; i < this._rowCount; i += ej.isNullOrUndefined(currentCell) ? 1 : currentCell.rowSpan) {
                                        currentCell = $(tableOlapGrid).find("tBody th[p='" + fieldIndex + "," + i + "']")[0];
                                        var isMatched = false;
                                        for (var j = 0; j < item.length; j++) {
                                            if ($(currentCell).text().trim() == item[j].toString().trim()) {
                                                isMatched = true;
                                                break;
                                            }
                                        }
                                        if (!ej.isNullOrUndefined(currentCell) && ($(currentCell).hasClass("rowheader") || $(currentCell).attr('role') == "rowheader") && isMatched && $(currentCell).find('.collapse').length > 0)
                                            this._collapseMember(tableOlapGrid, $(currentCell).find('.collapse'));
                                    }
                                }
                                else if (axis == "column") {
                                    for (var i = pivotRows.length, currentCell; i < Math.ceil(this.getJSONRecords().length / this._rowCount) ; i += ej.isNullOrUndefined(currentCell) ? 1 : currentCell.colSpan) {
                                        currentCell = $(tableOlapGrid).find("thead th[p='" + i + "," + fieldIndex + "']")[0];
                                        var isMatched = false;
                                        for (var j = 0; j < item.length; j++) {
                                            if ($(currentCell).text().trim() == item[j].toString().trim()) {
                                                isMatched = true;
                                                break;
                                            }
                                        }
                                        if (!ej.isNullOrUndefined(currentCell) && ($(currentCell).hasClass("colheader") || $(currentCell).attr('role') == "columnheader") && isMatched && $(currentCell).find('.collapse').length > 0)
                                            this._collapseMember(tableOlapGrid, $(currentCell).find('.collapse'));
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.element.html("");
            this._hideGrandTotal(tableOlapGrid);
            this._hideSubTotal(tableOlapGrid);
            if (this.model.enableColumnResizing) {
                this.element.addClass("column-resize");
            }
            if (this.model.enableVirtualScrolling) {
                this._createVirtualPivotGrid(tableOlapGrid);
                if (this.model.enableRTL)
                    this.element.addClass("e-rtl");
                this._applyVScrolling();
            }
            else if (this.model.enableGroupingBar) {
                this.element.append(tableOlapGrid);
                if (this._JSONRecords == null || this._JSONRecords.length == 0)
                    this.element.append(ej.buildTag("span", this._getLocalizedLabels("NoRecordsToDisplay"), { "display": "inline-block", "padding": "10px 0px 0px 0px", "font-family": "Segoe UI" })[0].outerHTML);
                if (this.model.enableRTL)
                    this.element.addClass("e-rtl");
                this._createFields(tableOlapGrid, $("#" + this._id).find(".pivotGridTable").width(), $("#" + this._id).find(".pivotGridTable th").outerWidth());
            }
            else
                this.element.append(tableOlapGrid);
            if (this.model.enableColumnResizing && (!this.model.frozenHeaderSettings.enableFrozenHeaders && !this.model.frozenHeaderSettings.enableFrozenColumnHeaders && !this.model.frozenHeaderSettings.enableFrozenRowHeaders)) {
                        var colgroup = $("<colgroup></colgroup>");
                        for (var i = 0; i < (jsonObj.length / this._rowCount) ; i++) {
                             var col = "<col style='width:"+this.element.find("tbody tr:first").children()[i].offsetWidth+"px'></col>";
                             colgroup.append(col);
                            
                        }
                        $(tableOlapGrid).append(colgroup);
                    }
            if (typeof (oclientProxy) != "undefined" && oclientProxy.model.enableVirtualScrolling && !oclientProxy.model.enablePaging) {
                oclientProxy.element.find(".categPageIndicator, .seriesPageIndicator , .vScrollThumb, .hScrollThumb").remove();
                var seriesPageIndicator = ej.buildTag("div.seriesPageIndicator inActive", ej.buildTag("span.axislabel", this._getLocalizedLabels("SeriesPage")+" : ")[0].outerHTML + ej.buildTag("span.series_CurrentPage", this._seriesCurrentPage)[0].outerHTML + " / " + ej.buildTag("span.series_pageCount", this._seriesPageCount)[0].outerHTML)[0].outerHTML;
                if (this._seriesPageCount > 1) {
                    if (oclientProxy.element.find(".vScrollPanel").width() != 12) {
                        oclientProxy.element.width(oclientProxy.element.width() + 12);
                    }
                    oclientProxy.element.find(".vScrollPanel").width(12);
                    oclientProxy.element.find(".virtualScrolling").append(seriesPageIndicator);
                    if (oclientProxy.controlPlacement() == ej.PivotClient.ControlPlacement.Tab && oclientProxy.model.displaySettings.mode == ej.PivotClient.DisplayMode.ChartAndGrid) {
                        oclientProxy.element.find(".virtualScrolling").css("padding-top", "35px");
                    }
                    else
                        oclientProxy.element.find(".virtualScrolling").css("padding-left", "2px");
                }
                else {
                    if (oclientProxy.element.find(".vScrollPanel").width() == 12) {
                        oclientProxy.element.width(oclientProxy.element.width() - 12);
                        oclientProxy.element.find(".vScrollPanel").width(0);
                    }
                }
                var categPageIndicator = ej.buildTag("div.categPageIndicator inActive", ej.buildTag("span.axislabel", this._getLocalizedLabels("CategoricalPage") + " : ")[0].outerHTML + ej.buildTag("span.categ_CurrentPage", this._categCurrentPage)[0].outerHTML + " / " + ej.buildTag("span.categ_pageCount", this._categPageCount)[0].outerHTML)[0].outerHTML;
                if (this._categPageCount > 1) {
                    if (oclientProxy.element.find(".hScrollPanel").height() != 12) {
                        oclientProxy.element.find(".hScrollPanel").height(12);
                        oclientProxy.element.find(".cubeBrowser").height(oclientProxy.element.find(".cubeBrowser").height() + 20);
                        oclientProxy.element.find(".categoricalAxis, .rowAxis,.slicerAxis").height(oclientProxy.element.find(".categoricalAxis, .rowAxis,.slicerAxis").height() + 6);
                    }
                    if (oclientProxy.controlPlacement() == ej.PivotClient.ControlPlacement.title) 
                        oclientProxy.element.find(".hsVirtualScrolling").css("margin-top", "3px");
                    oclientProxy.element.find(".hsVirtualScrolling").append(categPageIndicator);
                }
                else {
                    if (oclientProxy.element.find(".hScrollPanel").height() == 12) {
                        if (!oclientProxy.model.isResponsive) {
                            oclientProxy.element.find(".categoricalAxis, .rowAxis,.slicerAxis").height(150);
                        } else
                            oclientProxy.element.find(".categoricalAxis, .rowAxis,.slicerAxis").height(oclientProxy.element.find(".categoricalAxis, .rowAxis,.slicerAxis").height() - 6);
                        oclientProxy.element.find(".cubeBrowser").height(oclientProxy.element.find(".cubeBrowser").height() - 20);
                        oclientProxy.element.find(".hScrollPanel").height(0);
                    }
                }
                this._applyVScrolling();
            }
            if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                this._applyFrozenHeaderWidth(jsonObj);
            
            if (this.model.enableCellDoubleClick)
                this._on(this.element, "dblclick", ".value, .summary", this._cellRangeInfo)
            if (this.model.enableRTL) {
                this.element.addClass("e-rtl");
                this.element.find(".groupingBarPivot").addClass("e-rtl");
                this.element.find(".groupingBarPivot").width($(".pivotGridTable").width());
                this.element.find('table .rowheader,.colheader,.summary, .groupingBarPivot, .grpRow').css("text-align", "right");
            }
            else {
                this.element.removeClass("e-rtl");
                this.element.find(".groupingBarPivot").removeClass("e-rtl");
                this.element.find('table .rowheader,.colheader,.summary, .grpRow, .groupingBarPivot ').css("text-align", "left");
            }

            if ($.trim(this.model.pivotTableFieldListID) != "" && this._isSchemaInitialize)
                this._renderPivotSchemaDesigner();

            if (this._schemaData != null)
                this.element.find(".colheader, .rowheader, .value").addClass("e-droppable");
            this.exportRecords = jsonObj;
                	ej.Pivot.closePreventPanel(this);
            if (this._excelLikeJSONRecords != null && this.layout().toLowerCase() == ej.PivotGrid.Layout.ExcelLikeLayout)
                this._rowCount = rowCount;

        },

        _renderPivotSchemaDesigner :function()
        {
            if ($("#" + this.model.pivotTableFieldListID).length > 0) {
                var pivotSchemaDesigner = $("#" + this.model.pivotTableFieldListID).data('ejPivotSchemaDesigner');
                if (pivotSchemaDesigner != null) {
                    pivotSchemaDesigner.model.pivotControl = this;
                    pivotSchemaDesigner.model.enableWrapper = true;
                    pivotSchemaDesigner._load();
                    if(this._waitingPopup)
                    this._waitingPopup.hide()
                    this._isSchemaInitialize = false;
                }
                else {
                    var _this = this;
                    var timer = setInterval(function () {
                        var pivotSchemaDesigner = $("#" + _this.model.pivotTableFieldListID).data('ejPivotSchemaDesigner');
                        if (pivotSchemaDesigner != null) {
                            clearInterval(timer);
                            pivotSchemaDesigner.model.pivotControl = _this;
                            pivotSchemaDesigner.model.enableWrapper = true;
                            pivotSchemaDesigner._load();
                            if (_this._waitingPopup)
                                _this._waitingPopup.hide()
                            _this._isSchemaInitialize = false;
                        }
                    }, 10);
                }
            }
       },

        _renderFrozenGridTable: function (istheadOlapGrid, columnHeaderHeight, jsonObj, tableOlapGrid) {
			this.model.enableToolTip = false;
            var frozenColTable = $("<table class=\"pivotGridFrozenTable\" style='width: 100%' ></table>"), theadOlapGrid, tbodyFrozenCol, tbodyFrozenRow, tbodyFrozenVal;
            theadOlapGrid = tbodyFrozenCol = $("<tbody></tbody>");
            tbodyFrozenRow = $("<tbody></tbody>")
            var tRow, tRow1; tRow = tRow1 = "<tr role='row'>";
            var frozenRowTable = $("<table class=\"pivotGridRowTable\" style='table-layout: fixed' ></table>");
            tbodyFrozenVal = $("<tbody></tbody>");
            var frozenValTable = $("<table class=\"pivotGridValueTable\" style='width: 100%' ></table>");
            _isNoRow = false;
            for (index = 0; index < jsonObj.length; index++) {
                if (index < this._rowCount) {
                    if (istheadOlapGrid) {
                        istheadOlapGrid = (index >= columnHeaderHeight) ? false : true;
                        var tRow1 = "<tr role='row'>";                        
                        if (this.model.enableGroupingBar) {
                            if (jsonObj[index].Index == "0,0" && jsonObj[index].CSS == "colheader"){
                                tRow = tRow + "<th class='grpRow'" + " p='-1,-1' colspan= 1 rowspan=" + (this._rowCount - 1) + "> <div class=rows>" + this._getLocalizedLabels("DragFieldHere") + "</div></th>";
                                _isNoRow = true;
                            }
                                    
                        }
                        for (var column = index; column < jsonObj.length; column = column + this._rowCount) {
                            if (jsonObj[column].Span != "Block") {
                                if (jsonObj[column].Index == "0,0" && jsonObj[column].CSS != "colheader" && this.model.enableGroupingBar) {
                                    tRow = tRow + "<td class=" + "grpRow" + " p=" + jsonObj[column].Index + " colspan=" + jsonObj[column].ColSpan + " rowspan=" + jsonObj[column].RowSpan + " role='columnheader'" + ((jsonObj[column].i == null) ? "" : "i=" + jsonObj[column].i) + ">" + (jsonObj[column].State == 0 ? "<span style=\"margin-left: 0px\"></span>" : jsonObj[column].State == 2 ? "<span class=\"expand\ e-icon\">&nbsp;</span>" : (jsonObj[column].State == 1 ? "<span class=\"collapse\ e-icon\" title=\"Collapsed\">&nbsp;</span>" : "")) + jsonObj[column].Value + ej.buildTag("div.rows", this._pivotRow, {})[0].outerHTML + "</td>";
                                }
                                else if (jsonObj[column].Index == "0,0" && jsonObj[column].Value == "")
                                    tRow = tRow + "<td" + (jsonObj[column].CSS == "none" ? "" : " class=\"" + jsonObj[column].CSS) + (jsonObj[column].CSS == "none" ? " p=" + jsonObj[column].Index : "\" p=" + jsonObj[column].Index) + " colspan= 1 rowspan= 1 role='columnheader'" + ((jsonObj[column].i == null) ? "" : "i=" + jsonObj[column].i) + ">" + (jsonObj[column].State == 0 ? "<span style=\"margin-left: 10px\"></span>" : (jsonObj[column].State == 2) ? "<span class=\"expand\ e-icon\">&nbsp;</span>" : (jsonObj[column].State == 1 ? "<span class=\"collapse\ e-icon\" title=\"Collapsed\">&nbsp;</span>" : "")) + ej.buildTag("span.cellValue", jsonObj[column].Value)[0].outerHTML + "</td>";
                                else
                                    tRow1 = tRow1 + "<td" + (jsonObj[column].CSS == "none" ? "" : " class=\"" + jsonObj[column].CSS) + (jsonObj[column].CSS == "none" ? " p=" + jsonObj[column].Index : "\" p=" + jsonObj[column].Index) + " colspan=" + jsonObj[column].ColSpan + " rowspan=" + jsonObj[column].RowSpan + " role='columnheader'" + ((jsonObj[column].i == null) ? "" : "i=" + jsonObj[column].i) + ">" + (jsonObj[column].State == 0 ? "<span style=\"margin-left: 10px\"></span>" : (jsonObj[column].State == 2) ? "<span class=\"expand\ e-icon\">&nbsp;</span>" : (jsonObj[column].State == 1 ? "<span class=\"collapse\ e-icon\" title=\"Collapsed\">&nbsp;</span>" : "")) + ej.buildTag("span.cellValue", jsonObj[column].Value)[0].outerHTML + "</td>";
                                if (jsonObj[column].RowSpan > 1 && jsonObj[column].ColSpan <= 1) {
                                    for (var i = column + 1; i < column + jsonObj[column].RowSpan; i++)
                                        jsonObj[i].Span = "Block";
                                    tRow += "</tr>";
                                }
                                else if (jsonObj[column].ColSpan > 1 && jsonObj[column].RowSpan <= 1) {
                                    for (var i = column + this._rowCount; i < column + (jsonObj[column].ColSpan * this._rowCount) ; i = i + this._rowCount)
                                        jsonObj[i].Span = "Block";
                                }
                                else if (jsonObj[column].ColSpan > 1 && jsonObj[column].RowSpan > 1) {
                                    for (var i = column; i < column + jsonObj[column].RowSpan; i++) {
                                        for (var j = i + this._rowCount; j < i + (jsonObj[column].ColSpan * this._rowCount) ; j = j + this._rowCount)
                                            jsonObj[j].Span = "Block";
                                        if (i != column)
                                            jsonObj[i].Span = "Block";
                                    }
                                }
                            }
                        }
                        tRow1 += "</tr>";
                        $(tbodyFrozenCol).append(tRow1);
                    }
                    else {
                        tRow1 = "<tr role='row'>";
                        if (parseInt(jsonObj[index].Index.split(',')[0]) == 0 && parseInt(jsonObj[index].Index.split(',')[1]) == (this._rowCount - 1) && _isNoRow) {
                            tRow1 = tRow1 + "<td class='rowheader'" + " p='-1,-2' colspan=1 rowspan=1>" + "Grant total" + "</td>";
                            tRow1 += "</tr>";
                            $(tbodyFrozenRow).append(tRow1);
                            tRow1 = "<tr role='row'>";
                            var rowtd = $("<td style='padding: 0px'></td>");
                            var rowdiv = $("<div class='rowhead' style='position: relative; float: left;display: inline-block'>");
                            $(frozenRowTable).append(tbodyFrozenRow);
                            $(rowdiv).append(frozenRowTable);
                            $(rowtd).append(rowdiv);
                            tRow1 = "<tr>";
                        }
                        for (var column = index; column < jsonObj.length; column = column + this._rowCount) {
                            if (jsonObj[column].Span != "Block") {
                                if (jsonObj[column].CSS == "rowheader" || jsonObj[column].CSS == "summary row" || jsonObj[column].CSS == "summary rstot" || jsonObj[column].CSS == "summary rgtot" || jsonObj[column].CSS == "summary stot" || jsonObj[column].CSS == "summary gtot" || jsonObj[column].CSS == "summary") {
                                    if (this.layout().toLowerCase() == "excellikelayout") {
                                        tRow1 = tRow1 + "<td" + (jsonObj[column].CSS == "none" ? "" : " class=\"" + jsonObj[column].CSS) + "\" p=" + jsonObj[column].Index + " colspan=" + jsonObj[column].ColSpan + " rowspan=" + jsonObj[column].RowSpan + " role='rowheader'"+((jsonObj[column].i == null) ? "" : "i=" + jsonObj[column].i)+">" + (jsonObj[column].State == 2 ? "<span style=\"margin-left:" + (jsonObj[column].Level * 10) + "px\" class=\"expand\ e-icon\">&nbsp;</span>" : (jsonObj[column].State == 1 ? "<span style=\"margin-left:" + (jsonObj[column].Level * 10) + "px\" class=\"collapse\ e-icon\">&nbsp;</span>" : "<span style=\"margin-left:" + ((this._excelLikeJSONRecords != null && jsonObj[column].CSS == "summary row") ? jsonObj[column].Level * 10 :((jsonObj[column].Level += jsonObj[column].Level == 1 ? 0 : 2) * 10)) + "px\">&nbsp;</span>")) + ej.buildTag("span.cellValue", jsonObj[column].Value)[0].outerHTML + "</td>";
                                    }
                                    else 
                                        tRow1 = tRow1 + "<td" + (jsonObj[column].CSS == "none" ? "" : " class=\"" + jsonObj[column].CSS) + "\" p=" + jsonObj[column].Index + " colspan=" + jsonObj[column].ColSpan + " rowspan=" + jsonObj[column].RowSpan + " role='rowheader'>" + (jsonObj[column].State == 0 ? "<span style=\"margin-left: 10px\"></span>" : (jsonObj[column].State == 2) ? "<span class=\"expand\ e-icon\">&nbsp;</span>" : (jsonObj[column].State == 1 ? "<span class=\"collapse\ e-icon\">&nbsp;</span>" : "")) + ej.buildTag("span.cellValue", jsonObj[column].Value)[0].outerHTML + "</td>";
                                    if ((jsonObj[column + this._rowCount].CSS != "rowheader" && jsonObj[column + this._rowCount].CSS != "none") || (jsonObj[column + this._rowCount].RowSpan <= 1 && jsonObj[column].Value != jsonObj[column + 1].Value && (jsonObj[column].Expander != 1 || (jsonObj[column + 1].Value != "" && jsonObj[column + 1].CSS != "summary rstot")))) {
                                        tRow1 += "</tr>";
                                        $(tbodyFrozenRow).append(tRow1);
                                        tRow1 = "<tr role='row'>";
                                    }
                                    if (jsonObj[column + 1].CSS == "colheader" || ((jsonObj[column].CSS == "summary row" || jsonObj[column].CSS == "summary rstot" || jsonObj[column].CSS == "summary stot" || jsonObj[column].CSS == "summary") && jsonObj[column].ColSpan > 1 ) || (jsonObj[column + 1].CSS == "rowheader" && (jsonObj[column + 1].Span == "Block" || jsonObj[0].ColSpan == 1)) || (jsonObj[column].CSS == "rowheader" && jsonObj[column].Value == "Grand Total")) {
                                        var rowtd = $("<td style='padding: 0px'></td>");
                                        var rowdiv = $("<div class='rowhead' style='position: relative; float: left;display: inline-block'>");
                                        $(frozenRowTable).append(tbodyFrozenRow);
                                        $(rowdiv).append(frozenRowTable);
                                        $(rowtd).append(rowdiv);
                                        tRow1 = "<tr>";
                                    }
                                }
                                else if (jsonObj[column].CSS != "colheader") {
                                    tRow1 = tRow1 + "<td" + (jsonObj[column].CSS == "none" ? "" : " class=\"" + jsonObj[column].CSS) + "\" p=" + jsonObj[column].Index + " colspan=" + jsonObj[column].ColSpan + " rowspan=" + jsonObj[column].RowSpan + " role='gridcell'"+((jsonObj[column].i == null) ? "" : "i=" + jsonObj[column].i)+">" + (jsonObj[column].State == 2 ? "<span class=\"expand\ e-icon\">&nbsp;</span>" : (jsonObj[column].State == 1 ? "<span class=\"collapse\ e-icon\">&nbsp;</span>" : "")) + ej.buildTag("span.cellValue", jsonObj[column].Value)[0].outerHTML + "</td>";
                                    if ((jsonObj.length - 1 > column && (jsonObj[column + 1].Span != "Block" && jsonObj[column + 1].CSS == "colheader" && jsonObj[column - 1].CSS != "colheader" && jsonObj[column - 1].CSS != "none") && jsonObj[column].CSS != "summary value" && jsonObj[0].Value == "") && (jsonObj[column-this._rowCount].CSS != "rowheader" && jsonObj[column-this._rowCount].CSS != "value")) {
                                        tRow1 += "</tr>";
                                        $(tbodyFrozenVal).append(tRow1);
                                        tRow1 = "<tr role='row'>";
                                    }
                                }

                                if (jsonObj[column].RowSpan > 1 && jsonObj[column].ColSpan <= 1) {
                                    for (var i = column + 1; i < column + jsonObj[column].RowSpan; i++)
                                        jsonObj[i].Span = "Block";
                                }
                                else if (jsonObj[column].ColSpan > 1 && jsonObj[column].RowSpan <= 1) {
                                    for (var i = column + this._rowCount; i < column + (jsonObj[column].ColSpan * this._rowCount) ; i = i + this._rowCount)
                                        jsonObj[i].Span = "Block";
                                }
                                else if (jsonObj[column].ColSpan > 1 && jsonObj[column].RowSpan > 1) {
                                    for (var i = column; i < column + jsonObj[column].RowSpan; i++) {
                                        for (var j = i + this._rowCount; j < i + (jsonObj[column].ColSpan * this._rowCount) ; j = j + this._rowCount)
                                            jsonObj[j].Span = "Block";
                                        if (i != column)
                                            jsonObj[i].Span = "Block";
                                    }
                                }
                            }
                        }
                        tRow1 += "</tr>";
                        $(tbodyFrozenVal).append(tRow1);
                    }
                }
            }
            var coltd = $("<td style='padding: 0px' colspan=" + jsonObj.length / this._rowCount + " ></td>");
            var coldiv = $(ej.buildTag("div.colhead").css({ 'position': 'relative', 'overflow': 'hidden' })[0].outerHTML);
            var colgroup = $("<colgroup></colgroup>");
            $(frozenColTable).append(tbodyFrozenCol);
            $(coldiv).append(frozenColTable);
            $(coltd).append(coldiv);
            var colmovdiv = $(ej.buildTag("div#colmovable").css({ 'float': 'left' })[0].outerHTML);
            var colfrediv = $(ej.buildTag("div#colfreeze").css({ 'float': 'left' })[0].outerHTML);
            var coltable = $("<table></table>");
            if ($(tRow).children().length == 0)
                tRow = $("<tr role='row'></tr>");
            if ($(tRow).length > 0) {
                $(colmovdiv).append(coldiv);
                $(colfrediv).append($("<table id='colfretable'></table>").append(tRow));
            }

            tRow = $("<tr role='Row' id='row1'></tr>");
            var valtd = $("<td style='padding: 0px'></td>");
            var rowvaldiv = $(ej.buildTag("div#rowvaluecontent")[0].outerHTML);
            var valdiv = $(ej.buildTag("div.valueCell").css({ 'position': 'relative', 'float': 'left' })[0].outerHTML);
            $(frozenValTable).append(tbodyFrozenVal);
            $(valdiv).append(frozenValTable);
            $(coltable).append($(tRow).append(rowtd, valtd));
            var scrollContent = $(ej.buildTag("div#scrollContent")[0].outerHTML);
            if (this.model.frozenHeaderSettings.enableFrozenRowHeaders && !this.model.frozenHeaderSettings.enableFrozenColumnHeaders)
                $(tableOlapGrid).append($(scrollContent).append($("<div></div>").append(this.model.enableRTL ? $("<div id='coltable'></div>").append(colmovdiv, valdiv) : $("<div id='coltable'></div>").append(colfrediv, rowdiv), this.model.enableRTL ? $(rowvaldiv).append($("<div></div>").append(colfrediv, rowdiv)) : $(rowvaldiv).append(colmovdiv, valdiv))))
            else
                $(tableOlapGrid).append(this.model.enableRTL ? $("<div id='coltable'></div>").append(colmovdiv, colfrediv) : $("<div id='coltable'></div>").append(colfrediv, colmovdiv), this.model.enableRTL ? $(rowvaldiv).append($("<div></div>").append(valdiv, rowdiv)) : $(rowvaldiv).append($("<div></div>").append(rowdiv, valdiv)))
        },

        _applyFrozenHeaderWidth: function (jsonObj, drillAction) {
            if (jsonObj.length != 0) {
                var colgroup = $("<colgroup></colgroup>");
                if (!this.model.frozenHeaderSettings.enableFrozenRowHeaders && this.model.frozenHeaderSettings.enableFrozenColumnHeaders) {
                    this.element.find("#coltable").width(this.element.width()).css("overflow", "hidden")
                    for (var i = 0; i < $("#rowvaluecontent").find("tr:first").find("td, th").length; i++) {
                        var col = "<col style='width:" + Math.max((this.element.find(".pivotGridColValueTable").find("[p^='" + i + "']").length > 0 ? parseInt(this.element.find(".pivotGridColValueTable").find("[p^='" + i + "']").attr("colspan")) > 1 && i != 0 ? this.element.find(".pivotGridColValueTable").find("[p^='" + i + "']").eq(-2)[0].offsetWidth : this.element.find(".pivotGridColValueTable").find("[p^='" + i + "']")[0].offsetWidth : 0), this.element.find(".pivotGridRowValueTable").find("[p^='" + i + "']")[0].offsetWidth) + "px'></col>";
                        //var col = "<col style='width:160px'></col>"
                        colgroup.append(col);
                    }
                    this.element.find(".pivotGridRowValueTable, .pivotGridColValueTable").append(colgroup).css({ "table-layout": "fixed" });
                    this.element.find("#coltable").find("tr:first").find("th:first").width(this.element.find("#rowvaluecontent").find("tr:first").find("th:eq(0)").width() * parseInt(this.element.find("#coltable").find("tr:first").find("th:first").attr("colspan")));
                }
                else {
                    if (_isNoRow) {
                        for (var i = 0; i < (this.layout().toLowerCase() != "excellikelayout" || this._excelLikeJSONRecords == null || (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) ? (jsonObj.length / this._rowCount) : ((this._excelLikeJSONRecords.length / this._rowCount) + this.getJSONRecords()[0].ColSpan - 1)) ; i++) {
                            var col = "<col style='width:" + (Math.max(this.element.find(".pivotGridValueTable").find("[p^='" + i + "']").length > 0 ? this.element.find(".pivotGridValueTable").find("[p^='" + i + "']")[0].offsetWidth : 0, (parseInt($(this.element.find(".pivotGridFrozenTable").find("[p^='" + i + "']")[0]).attr("colspan")) > 1 ? parseInt($(this.element.find(".pivotGridFrozenTable").find("[p^='" + i + "']").last()).attr("colspan")) > 1 ? $(this.element.find(".pivotGridFrozenTable").find("[p^='" + i + "']")).eq(-2)[0].offsetWidth : this.element.find(".pivotGridFrozenTable").find("[p^='" + i + "']").last()[0].offsetWidth : this.element.find(".pivotGridFrozenTable").find("[p^='" + i + "']")[0].offsetWidth)) + 10) + "px'></col>";
                            //var col = "<col style='width:160px'></col>"
                            colgroup.append(col);
                        }
                    }
                    else {
                        for (var i = this.layout().toLowerCase() != "excellikelayout" ? jsonObj[0].ColSpan : this.getJSONRecords()[0].ColSpan; i < (this.layout().toLowerCase() != "excellikelayout" || this._excelLikeJSONRecords == null || (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) ? (jsonObj.length / this._rowCount) : ((this._excelLikeJSONRecords.length / this._rowCount) + this.getJSONRecords()[0].ColSpan - 1)) ; i++) {
                            var col = "<col style='width:" + (Math.max(this.element.find(".pivotGridValueTable").find("[p^='" + i + "']").length > 0 ? this.element.find(".pivotGridValueTable").find("[p^='" + i + "']")[0].offsetWidth : 0, (parseInt($(this.element.find(".pivotGridFrozenTable").find("[p^='" + i + "']")[0]).attr("colspan")) > 1 ? parseInt($(this.element.find(".pivotGridFrozenTable").find("[p^='" + i + "']").last()).attr("colspan")) > 1 ? $(this.element.find(".pivotGridFrozenTable").find("[p^='" + i + "']")).eq(-2)[0].offsetWidth : this.element.find(".pivotGridFrozenTable").find("[p^='" + i + "']").last()[0].offsetWidth : this.element.find(".pivotGridFrozenTable").find("[p^='" + i + "']")[0].offsetWidth)) + 10) + "px'></col>";
                            //var col = "<col style='width:160px'></col>"
                            colgroup.append(col);
                        }
                    }

                    if(drillAction == undefined) this.element.find(".pivotGridValueTable, .pivotGridFrozenTable").append(colgroup).css({ "table-layout": "fixed" });
                    //if(_isNoRow) 
                    //    $(this.element.find(".pivotGridFrozenTable").find("colgroup")[0]).find("col:first").remove();
                    if (this.model.frozenHeaderSettings.enableFrozenRowHeaders && !this.model.frozenHeaderSettings.enableFrozenColumnHeaders) { this.element.find("#colfreeze").removeAttr("style"); this.element.find("#coltable").css("float", "left"); this.element.find("#rowvaluecontent").css({ "float": "left", "width": this.element.width() - this.element.find("#coltable").width() - 1 }); }
                    if (this.element.find(".pivotGridValueTable").height() > 0) { this.element.find(".rowhead").height(this.element.find(".pivotGridValueTable").height() > (this.element.height() - this.element.find(".colhead").height()) ? this.element.height() - this.element.find(".colhead").height() : this.element.find(".pivotGridValueTable").height()); }
                    this.element.find(".colhead").width(this.element.width() - this.element.find(".rowhead").width() - 1); this.element.find(".valueCell").width(this.element.width() - this.element.find(".rowhead").width() - 3);
                    this.element.find("#colfretable").css({ width: this.element.find(".rowhead").width(), height: this.element.find(".colhead").height() + 1 })
                    if (this.model.enableRTL) { this.element.find(".pivotGridRowTable, .rowhead").width(this.element.find("#colfretable").width() + 3); this.element.find(".rowhead").css("float", "none") }
                }
                if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && drillAction != undefined) {
                    this.element.find(".valueCell").removeAttr("style").css({ "position": "relative", "overflow": "hidden" })
                    if (this.model.frozenHeaderSettings.enableFrozenRowHeaders && !this.model.frozenHeaderSettings.enableFrozenColumnHeaders) {
                        this.element.find(".valueCell").width(this.element.width() - this.element.find(".rowhead").width() - 1);
                        this.element.find(".colhead").width(this.element.width() - this.element.find(".rowhead").width() - 1);
                    }
                }
                if (this.model.enableGroupingBar) {
                    this.element.find(".groupingBarPivot, .columns").css({ "width": "", "min-width": "" });
                    this.element.find("#rowvaluecontent").removeAttr("style").width($(".groupingBarPivot").width());
                    this.element.find(".values").width(this.element.find(".grpRow").length != 0 ? this.element.find(".rowhead").width() > this.element.find(".grpRow")[0].offsetWidth ? this.element.find(".rowhead").width() : this.element.find(".grpRow")[0].offsetWidth : this.element.find(".rowhead").width());
                    this.element.find(".colhead, .valueCell").width(this.element.find(".valueColumn").width() - this.element.find(".values").width() - 2);
                    this.element.find(".rowhead, .pivotGridRowTable").width(this.element.find(".grpRow").length != 0 ? this.element.find(".grpRow")[0].offsetWidth : this.element.find(".emptyRows")[0].offsetWidth);
                    if (this._dataModel == "XMLA") {
                        this.element.find("#colfretable").width(this.element.find(".grpRow").length != 0 ? this.element.find(".grpRow")[0].offsetWidth : this.element.find(".emptyRows")[0].offsetWidth);
                        if (this.element.find(".grpRow").length == 0 && this.element.find("#colfretable").find("tr td").length == 0)
                            this.element.find("#colfreeze").remove();
                    }
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.dataSource.columns.length == 0 && this.model.dataSource.values.length == 0)
                        this.element.find(".valueCell").width(this.element.find("#colfretable").width());
                    this.element.find(".colhead, .pivotGridFrozenTable").height(this.element.find(".grpRow").length != 0 ? this.element.find(".grpRow")[0].offsetHeight - 2 : this.element.find(".emptyRows")[0].offsetHeight - 2);
                }
                this._refreshScroller();
            }
        },
		_refreshScroller: function () {
            if (!this.model.frozenHeaderSettings.enableFrozenRowHeaders && this.model.frozenHeaderSettings.enableFrozenColumnHeaders)
                this.element.find("#rowvaluecontent").ejScroller({ height: this.element.height() - this.element.find("#coltable").height(), width: this.element.width(), targetControl: this, scroll: this._applyScroll, autoHide: true, enableRTL: this.model.enableRTL });
            else if (this.model.frozenHeaderSettings.enableFrozenRowHeaders && !this.model.frozenHeaderSettings.enableFrozenColumnHeaders)
                this.element.find("#scrollContent").ejScroller({ height: this.element.height(), width: this.element.width(), targetControl: this, scroll: this._applyScroll, autoHide: true, enableRTL: this.model.enableRTL });
            else
                this.element.find("#rowvaluecontent").ejScroller({ width: this.element.find("#rowvaluecontent").width(), height: this.element.find(".rowhead").height(), targetControl: this, scroll: this._applyScroll, autoHide: true, enableRTL: this.model.enableRTL });
            scrollerObj = $(".e-scroller").ejScroller("instance");
            scrollerObj.refresh();
        },

        _applyScroll: function (args) {
            if (args.model.targetControl.model.frozenHeaderSettings.enableFrozenColumnHeaders && !args.model.targetControl.model.frozenHeaderSettings.enableFrozenRowHeaders && args.scrollData.position == "Left")
                args.model.targetControl.element.find("#coltable").scrollLeft(args.scrollLeft);
            else if (args.model.targetControl.model.frozenHeaderSettings.enableFrozenRowHeaders && !args.model.targetControl.model.frozenHeaderSettings.enableFrozenColumnHeaders && args.scrollData.position == "Left") {
                args.model.targetControl.element.find(".valueCell").css('overflow', 'hidden');
                args.model.targetPane = ".valueCell";
                args.model.targetControl.element.find(".colhead").scrollLeft(args.scrollLeft);
            }
            else {
                args.model.targetControl.element.find(".valueCell").css('overflow', 'hidden');
                args.model.targetPane = ".valueCell";
                args.model.targetControl.element.find(".colhead").scrollLeft(args.scrollLeft);
            }
        },

        _cellRangeInfo: function (e) {
            if ($(e.target).hasClass("cellValue")) e.target = e.target.parentElement;
            var colHaederLength = $("thead tr").length, selectedCellsDetails = [], selectedCells = [], j = 0, l = 0;
            var colheaders = $.grep(this.getJSONRecords(), function (item) { return (item.CSS == "colheader" || item.CSS == "summary" || item.CSS == " calc") && item.Index.split(',')[0] == $(e.target).attr("p").split(",")[0] });
            var rowheaders = $.grep(this.getJSONRecords(), function (item) { return (item.CSS == "rowheader" || item.CSS == "summary" || item.CSS == "summary rstot") && item.Index.split(',')[1] == $(e.target).attr("p").split(",")[1] });
            if (rowheaders.length == 1 && colheaders.length == 1 && (rowheaders[0].Value.indexOf("Grand") >= 0 || colheaders[0].Value.indexOf("Grand") >= 0 || colheaders[0].CSS == " calc")) {
                var obj = [];

                if ((colheaders[0].Value.indexOf("Grand") >= 0 || colheaders[0].CSS == " calc") && rowheaders[0].Value.indexOf("Grand") >= 0) {
                    for (var i = 0; i < this.model.dataSource.data.length; i++) {
                        selectedCellsDetails[i] = this.model.dataSource.data[i];
                    }
                }
                else {
                    if (rowheaders[0].Value.indexOf("Grand") >= 0)
                        var text = colheaders[0].Value.indexOf("Total") >= 0 ? colheaders[0].Value.replace(" Total", "") : colheaders[0].Value
                    else if(colheaders[0].Value.indexOf("Total") >= 0 || colheaders[0].CSS == " calc")
                        var text = rowheaders[0].Value.indexOf("Total") >= 0 ? rowheaders[0].Value.replace(" Total", "") : rowheaders[0].Value

                    for (var i = 0; i < this.model.dataSource.data.length; i++) {
                        $.each(this.model.dataSource.data[i], function (key, value) {
                            if (value == text) {
                                selectedCellsDetails[j] = this.model.dataSource.data[i];
                                j++;
                            }
                        })
                    }
                }
            }

            else if (rowheaders.length >= 1 && colheaders.length >= 1 && (rowheaders[0].Value.indexOf("Total") >= 0 || colheaders[0].Value.indexOf("Total") >= 0)) {
                if (rowheaders[0].Value.indexOf("Total") >= 0)
                    var text = colheaders, text1 = rowheaders;
                else if (colheaders[0].Value.indexOf("Total") >= 0)
                    var text = rowheaders, text1 = colheaders;
                var selectedCellTempArray = this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? this.model.dataSource.data : JSON.parse(this._dataSet);

                for (var k = text.length - 1; k >= 0; k--) {
                    var selectedCellArray = new Array();
                    for (var i = 0; i < selectedCellTempArray.length; i++) {
                        $.each(selectedCellTempArray[i], function (key, value) {
                            if (value == text[k].Value) {
                                selectedCellArray.push(selectedCellTempArray[i]);
                            }

                        });
                    }
                    selectedCellTempArray = selectedCellArray;
                }
                selectedCellsDetails = selectedCellArray;
                if (text1[0].Value.indexOf("Grand") <= 0) {
                    var selectedCellArray = new Array();
                    for (var i = 0; i < selectedCellTempArray.length; i++) {
                        $.each(selectedCellTempArray[i], function (key, value) {
                            if (value == text1[0].Value.replace(" Total", "")) {
                                selectedCellsDetails = [];
                                selectedCellArray.push(selectedCellTempArray[i]);
                            }
                        });
                    }
                }
                selectedCellsDetails = selectedCellsDetails.length == 0 ? selectedCellArray : selectedCellsDetails;
            }
            else {
                var rowText = rowheaders, colText = colheaders;
                var selectedCellTempArray = this.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? this.model.dataSource.data : JSON.parse(this._dataSet);

                for (var k = rowText.length - 1; k >= 0; k--) {
                    var selectedCellArray = new Array();
                    for (var i = 0; i < selectedCellTempArray.length; i++) {
                        $.each(selectedCellTempArray[i], function (key, value) {
                            if (value == rowText[k].Value) {
                                selectedCellArray.push(selectedCellTempArray[i]);
                            }
                        });
                    }
                    selectedCellTempArray = selectedCellArray;
                }
                for (var k = colText.length - 1; k >= 0; k--) {
                    var selectedCellArray = new Array();
                    for (var i = 0; i < selectedCellTempArray.length; i++) {
                        $.each(selectedCellTempArray[i], function (key, value) {
                            if (value == colText[k].Value) {
                                selectedCellArray.push(selectedCellTempArray[i]);
                            }

                        });
                    }
                    selectedCellTempArray = selectedCellArray;
                }
                selectedCellsDetails = selectedCellsDetails.length == 0 ? selectedCellArray : selectedCellsDetails;
            }
            if (this.model.cellDoubleClick != null) {
                var eventArgs = { selectedData: selectedCellsDetails, element: this.element, customObject: this.model.customObject };
                this._trigger("cellDoubleClick", eventArgs);
            }
        },

        _initCellEditing: function (e) {
            if (e.target.tagName != "INPUT" && !$(e.target).hasClass("summary") && !$(e.target).parent().hasClass("summary")) {
                this._on(this.element, "mouseup", ".value", this._completeCellEditing);
                var targetCell;
                _oriX = e.pageX, _oriY = e.pageY;
                targetCell = e.target || window.event.srcElement;
                if ($(targetCell).hasClass("cellValue")) targetCell = $(targetCell).parent()[0];
                $(".value").addClass("selection");
                $("#" + this._id).append(ej.buildTag("div.cellSelection#" + this._id + "_cellSelection", "", {}));
                _startPosCell = $(targetCell)[0].attributes.getNamedItem("p").value;
                this._on(this.element, "mousemove", ".value, .cellSelection", this._cellSelection);
            }
            else
                this._off(this.element, "mouseup", ".value", this._completeCellEditing);
        },

        _completeCellEditing: function (e) {
            var targetCell, endPosCell, cellInfo = [], rowLThPos, curCelPos;
            if (e.target.tagName != "INPUT") {
                this._off(this.element, "mousemove", ".value");
                $(".value").removeClass("selection");
                targetCell = e.target || window.event.srcElement;
                if ($(targetCell).hasClass("cellValue")) targetCell = $(targetCell).parent()[0];
                endPosCell = $(targetCell)[0].attributes.getNamedItem("p").value;
                var count = 0;
                var inputBoxes = this.element.find(".curInput");
                if (inputBoxes.length > 0) {
                    if ($(targetCell).find(".curInput").length == 0)
                        this._updateTableCell();
                    $("#" + this._id + "_cellSelection").remove();
                    if (this.model.enableToolTip) {
                        this._on(this.element, "mousemove", ".value", this._applyToolTip);
                    }
                    this._off(this.element, "mouseup", ".value");
                    return false;
                }
                for (var rowSelCnt = (parseInt(_startPosCell.split(",")[1]) < parseInt(endPosCell.split(",")[1]) ? parseInt(_startPosCell.split(",")[1]) : parseInt(endPosCell.split(",")[1])) ; rowSelCnt <= (parseInt(_startPosCell.split(",")[1]) > parseInt(endPosCell.split(",")[1]) ? parseInt(_startPosCell.split(",")[1]) : parseInt(endPosCell.split(",")[1])) ; rowSelCnt++) {
                    if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap || $("#" + this._id).find("td[p*='," + rowSelCnt + "']").parent().is(":visible")) {
                        for (var colSelCnt = (parseInt(_startPosCell.split(",")[0]) < parseInt(endPosCell.split(",")[0]) ? parseInt(_startPosCell.split(",")[0]) : parseInt(endPosCell.split(",")[0])) ; colSelCnt <= (parseInt(_startPosCell.split(",")[0]) > parseInt(endPosCell.split(",")[0]) ? parseInt(_startPosCell.split(",")[0]) : parseInt(endPosCell.split(",")[0])) ; colSelCnt++) {
                            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap || $("#" + this._id).find("[p*='" + colSelCnt + ",']").last("th").is(":Visible")) {
                                cellInfo[count] = this.getJSONRecords()[((colSelCnt) * this._rowCount) + rowSelCnt];
                                if (!$("[p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "]").hasClass("summary")) {
                                    if ($("[p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "] span.cellValue").length > 0) {
                                        var value = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ($("[p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "] span.cellValue").text() != "" ? $("[p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "] span.cellValue").text() : $(".curInput").val()) : $("[p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "] span.cellValue").text();
                                        $("[p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "] span.cellValue").html("<input type='text' class='curInput' value='" + value + "' />");
                                    }
                                    else if ($("[p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "]").children().length > 0) {
                                        $("[p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "]").append("<input type='text' class='curInput' value='' />");
                                    }
                                    else {
                                        var value = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? ($("[p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "]").text() != "" ? $("[p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "]").text() : $(".curInput").val()) : $("[p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "]").text();
                                        $("[p=" + "'" + colSelCnt + ',' + rowSelCnt + "'" + "]").html("<input type='text' class='curInput' value='" + value + "' />");
                                    }
                                }
                                var rowInfo, rowValue = "";
                                var tempThPos, measureColumn, measureRowCount = 0, measureColCount = 0;
                                if (this.model.frozenHeaderSettings.enableFrozenHeaders || this.model.frozenHeaderSettings.enableFrozenColumnHeaders || this.model.frozenHeaderSettings.enableFrozenRowHeaders)
                                    rowLThPos = this.element.find(".summary[role!='gridcell'][p$='," + $(targetCell).attr('p').split(',')[1] + "'] , .rowheader[role!='gridcell'][p$='," + $(targetCell).attr('p').split(',')[1] + "']").last().attr("p");
                                else
                                    rowLThPos = this.element.find(".summary[role!='gridcell'][p$='," + rowSelCnt + "'] , .rowheader[role!='gridcell'][p$='," + rowSelCnt + "']").last().attr("p");
                                if (rowLThPos == undefined) {
                                    rowLThPos = $("#" + this._id).find("tbody").find('[p="' + colSelCnt + "," + rowSelCnt + '"]').parent("tr").find(".summary").first().attr('p');
                                }
                                tempThPos = rowLThPos;
                                if (rowLThPos != null) {
                                    while (rowLThPos[0] >= 0) {
                                        if (rowLThPos == this.getJSONRecords()[parseInt((parseInt(rowLThPos.split(",")[0]) * this._rowCount) + parseInt(rowLThPos.split(",")[1]))].Index) {
                                            rowInfo = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this.getJSONRecords()[parseInt((parseInt(rowLThPos.split(",")[0]) * this._rowCount) + parseInt(rowLThPos.split(",")[1]))].Info.split("::")[0] : this.getJSONRecords()[parseInt((parseInt(rowLThPos.split(",")[0]) * this._rowCount) + parseInt(rowLThPos.split(",")[1]))].Value;
                                            rowLThPos = parseInt(rowLThPos.split(",")[0]) - 1 + "," + parseInt(rowLThPos.split(",")[1]);
                                        }
                                        if ((rowValue) && (rowInfo != ""))
                                            rowValue = rowInfo + "#" + rowValue;
                                        else if (rowInfo != "")
                                            rowValue = rowInfo;
                                    }
                                    this._rowHeader[count] = rowValue;
                                    var header = this._rowHeader[count].toString().split('#');
                                    if (header.length > 1) {
                                        for (var i = 0; i < header.length - 1; i++) {
                                            for (var j = 0; j < header[i].split('.').length; j++) {
                                                if (header[i].split('.')[j] == header[i + 1].split('.')[j] && header[i].split('.')[j + 1] == header[i + 1].split('.')[j + 1]) {
                                                    header.splice(i, 1);
                                                    break;
                                                }
                                            }
                                        }
                                        this._rowHeader[count] = "";
                                        for (var i = 0; i < header.length; i++) {
                                            this._rowHeader[count] += this._rowHeader[count] == "" ? header[i] : "#" + header[i];
                                        }
                                    }
                                }
                                var columnValue = "", headerInfo;
                                var colHeadRCnt = this.element.find('tr:has(".colheader")').length - 1;
                                measureColumn = colHeadRCnt;
                                curCelPos = cellInfo[count].Index;
                                if ((curCelPos != undefined) && (curCelPos == this.getJSONRecords()[parseInt((parseInt(curCelPos.split(",")[0]) * this._rowCount) + parseInt(curCelPos.split(",")[1]))].Index)) {
                                    var colPos = parseInt(curCelPos.split(",")[0]);
                                }
                                for (var rCnt = 0; rCnt <= colHeadRCnt; rCnt++) {
                                    if (colPos != null)
                                        if ((colPos + "," + rCnt) == (this.getJSONRecords()[parseInt((parseInt(colPos) * this._rowCount) + rCnt)].Index)) {
                                            headerInfo = this.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? this.getJSONRecords()[parseInt((parseInt(colPos) * this._rowCount) + rCnt)].Info.split("::")[0] : this.getJSONRecords()[parseInt((parseInt(colPos) * this._rowCount) + rCnt)].Value;
                                            if (columnValue == "")
                                                columnValue = headerInfo;
                                            else if (headerInfo != "")
                                                columnValue = columnValue + "#" + headerInfo;
                                        }
                                    this._colHeader[count] = columnValue;

                                }
                                var header = this._colHeader[count].split('#');
                                if (header.length > 1) {
                                    for (var i = 0; i < header.length - 1; i++) {
                                        for (var j = 0; j < header[i].split('.').length; j++) {
                                            if (header[i].split('.')[j] == header[i + 1].split('.')[j] && header[i].split('.')[j + 1] == header[i + 1].split('.')[j + 1]) {
                                                header.splice(i, 1);
                                                break;
                                            }
                                        }
                                    }
                                    this._colHeader[count] = "";
                                    for (var i = 0; i < header.length; i++) {
                                        this._colHeader[count] += this._colHeader[count] == "" ? header[i] : "#" + header[i];
                                    }
                                }
                                count++;
                            }
                        }
                    }
                }
                this._originalValue = "";
                this._cellInfo = cellInfo;
                for (var index = 0; index < this.element.find(".curInput").length; index++) {
                    var cell = this.element.find(".curInput")[index];
                    this._originalValue += this._originalValue == "" ? cell.value : "#" + cell.value;
                }
                args = { JSONRecords: cellInfo, rowHeader: this._rowHeader, columnHeader: this._colHeader, measureCount: (measureRowCount > 0 ? ("Row:" + measureRowCount) : ("Column:" + measureColCount)) }
                this._trigger("cellSelection", args);
                cellInfo = rowHeader = colHeader = [];
                $("#" + this._id + "_cellSelection").remove();
                if (this.model.enableToolTip) {
                    this._on(this.element, "mousemove", ".value", this._applyToolTip);
                }
                this._off(this.element, "mouseup", ".value");
            }
            $(".curInput").keypress(function (event) {
                if (event.which == 13) {
                    var pGridObj = $(event.target).parents(".e-pivotgrid").data("ejPivotGrid");
                    pGridObj._updateTableCell();
                }
            })
        },

        _updateTableCell: function () {
            var updateValue = "", tempVal = "";
            var editValue = $(".curInput");
            $.each(editValue, function (index, cell) {
                updateValue += updateValue == "" ? cell.value : "#" + cell.value;
            })
            var originalValueCmp = [];
            var rowHeaderName = this._rowHeader;
            var columnHeaderName = this._colHeader;
            tempVal = updateValue.split("#");
            for (var i = tempVal.length - 1; i >= 0; i--) {
                if (tempVal[i] == this._originalValue.split("#")[i]) {
                    rowHeaderName.splice(i, 1);
                    columnHeaderName.splice(i, 1);
                    tempVal.splice(i, 1);
                    this._cellInfo.splice(i, 1);
                }
                else {
                    originalValueCmp.push(this._originalValue.split("#")[i]);
                    this._cellInfo[i].Value = tempVal[i] = tempVal[i] == "" ? "0" : tempVal[i];
                }
            }
            originalValueCmp = originalValueCmp.reverse();
            updateValue = "";
            for (var j = 0; j < tempVal.length; j++) {
                updateValue += updateValue == "" ? tempVal[j] : "#" + tempVal[j];
            }
            if (updateValue.length == 0) {
                for (var j = editValue.length - 1; j >= 0; j--) {
                    $(editValue[j]).closest("td").text($(".curInput")[j].value)
                }
                return false;
            }
            this._waitingPopup.show();

            var report;
            if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                try {
                    report = JSON.parse(this.getOlapReport()).Report;
                }
                catch (err) {
                    report = this.getOlapReport();
                }
            }

            if (this.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {

                if (ej.isNullOrUndefined(this.model.editCellsInfo.JSONRecords) || this.model.editCellsInfo.JSONRecords.length == 0)
                    this.model.editCellsInfo = { JSONRecords: [], rowHeader: [], columnHeader: [] };

                var rowHeaders = this.model.editCellsInfo.rowHeader, colHeaders = this.model.editCellsInfo.columnHeader, values = this.model.editCellsInfo.JSONRecords, updateValueArray = this._cellInfo;
                for (uV = 0; uV < updateValueArray.length; uV++) {
                    var existCount = 0;
                    for (var vC = 0; vC < values.length; vC++) {
                        if (rowHeaders[vC] == rowHeaderName[uV] && colHeaders[vC] == columnHeaderName[uV]) {
                            values[vC].Value = updateValueArray[uV].Value;
                            existCount++;
                            break;
                        }
                    }
                    if (existCount == 0) {
                        rowHeaders.push(rowHeaderName[uV]);
                        colHeaders.push(columnHeaderName[uV]);
                        values.push(updateValueArray[uV]);
                    }
                }
                this._trigger("cellEdit", { editCellsInfo: this.model.editCellsInfo });

                if (!ej.isNullOrUndefined(this.model.editCellsInfo.JSONRecords) && this.model.editCellsInfo.JSONRecords.length > 0) {
                    if (this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                        var updateValue = "", cellPos = "", measure = "";
                        $.each(this.model.editCellsInfo.JSONRecords, function (index, val) {
                            updateValue = updateValue == "" ? val.Value : updateValue + ":" + val.Value;
                            cellPos = cellPos == "" ? val.Index : cellPos + ":" + val.Index;
                            measure = measure == "" ? colHeaders[index].toString().split('#')[colHeaders[index].toString().split('#').length - 1] : measure + ":" + colHeaders[index].toString().split('#')[colHeaders[index].toString().split('#').length - 1];
                        })
                        var eventArgs = JSON.stringify({ action: "cellEditing", "index": cellPos, "valueHeaders": measure, "summaryValues": updateValue, "currentReport": report, "customObject" : JSON.stringify(this.model.customObject) });
                        this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.cellEditing, eventArgs, this._renderControlSuccess);
                        for (var j = editValue.length - 1; j >= 0; j--) {
                            $(editValue[j]).closest("td").text($(editValue[j]).val());
                        }
                    }
                    else
                        this._populatePivotGrid();
                }
                else {
                    for (var j = editValue.length - 1; j >= 0; j--) {
                        $(editValue[j]).closest("td").text(ej.isNullOrUndefined(this._originalValue.split('#')[j]) ? "" : this._originalValue.split('#')[j]);
                    }
                    this._waitingPopup.hide();
                }
            }
            else if (this.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if (this.model.beforeServiceInvoke != null && this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._trigger("beforeServiceInvoke", { action: "writeBack", element: this.element });

                this.model.editCellsInfo.JSONRecords = this._cellInfo;
                this.model.editCellsInfo.rowHeader = rowHeaderName;
                this.model.editCellsInfo.columnHeader = columnHeaderName;

                this._trigger("cellEdit", { editCellsInfo: this.model.editCellsInfo });
                var updateValue = "";
                if (!ej.isNullOrUndefined(this.model.editCellsInfo.JSONRecords) && this.model.editCellsInfo.JSONRecords.length > 0) {
                    $.each(this.model.editCellsInfo.JSONRecords, function (index, val) {
                        updateValue = updateValue == "" ? val.Value : updateValue + ":" + val.Value;
                    })
                }

                eventArgs = JSON.stringify({ action: "writeBack", "value": updateValue, "rowUniqueName": JSON.stringify(this.model.editCellsInfo.rowHeader), "columnUniqueName": JSON.stringify(this.model.editCellsInfo.columnHeader), "currentReport": report, "customObject": JSON.stringify(this.model.customObject) });
                if (!ej.isNullOrUndefined(this.model.editCellsInfo.JSONRecords) && this.model.editCellsInfo.JSONRecords.length > 0)
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.writeBack, eventArgs, this._renderControlSuccess);
                else {
                    for (var j = editValue.length - 1; j >= 0; j--) {
                        $(editValue[j]).closest("td").text(ej.isNullOrUndefined(this._originalValue.split('#')[j]) ? "" : this._originalValue.split('#')[j]);
                    }
                    this._waitingPopup.hide();
                }
            }
            this._rowHeader = [];
            this._colHeader = [];
        },

        _createVirtualPivotGrid: function (tableOlapGrid) {
            var verticalScroll = this._seriesPageCount > 1 ? ej.buildTag("div.vScrollPanel")[0].outerHTML : "";
            var horizontalScroll = this._categPageCount > 1 ? ej.buildTag("div.hScrollPanel")[0].outerHTML : "";
            var oGridDiv = ej.buildTag("td.virtualScrollGrid", tableOlapGrid[0].outerHTML)[0];
            var vertiScrollTd = ej.buildTag("td.virtualScrollElement", verticalScroll);
            var horiScrollTd = ej.buildTag("td.virtualScrollElement", horizontalScroll);
            var trow = ej.buildTag("tr.virtualScrollElement", oGridDiv.outerHTML + vertiScrollTd[0].outerHTML);
            var trow2 = ej.buildTag("tr.virtualScrollElement", horiScrollTd[0].outerHTML + ej.buildTag("td.virtualScrollElement")[0].outerHTML);
            var virtualOlapGrid = ej.buildTag("tbody.oGridOuterDiv.virtualScrollElement", trow[0].outerHTML + trow2[0].outerHTML);
            this.element.html(ej.buildTag("table.virtualScrollElement", virtualOlapGrid[0].outerHTML));
            var seriesPageIndicator = ej.buildTag("div.seriesPageIndicator inActive", ej.buildTag("span.axislabel", this._getLocalizedLabels("SeriesPage"))[0].outerHTML + ej.buildTag("span.series_CurrentPage", this._seriesCurrentPage)[0].outerHTML + " / " + ej.buildTag("span.series_pageCount", this._seriesPageCount)[0].outerHTML)[0].outerHTML;
            if (this._seriesPageCount > 1) this.element.append(seriesPageIndicator);
            var categPageIndicator = ej.buildTag("div.categPageIndicator inActive", ej.buildTag("span.axislabel", this._getLocalizedLabels("CategoricalPage"))[0].outerHTML + ej.buildTag("span.categ_CurrentPage", this._categCurrentPage)[0].outerHTML + " / " + ej.buildTag("span.categ_pageCount", this._categPageCount)[0].outerHTML)[0].outerHTML;
            if (this._categPageCount > 1) this.element.append(categPageIndicator);
        }

    });

    ej.PivotGrid.Layout = {
        Normal: "normal",
        NormalTopSummary: "normaltopsummary",
        NoSummaries: "nosummaries",
        ExcelLikeLayout: "excellikelayout"
    };

    ej.PivotGrid.Locale = {};

    ej.PivotGrid.Locale["en-US"] = {
        Sort: "Sort",
        Search: "Search",
        SelectField: "select Field",
        LabelFilterLabel:"Show the items for which the label",
        ValueFilterLabel:"Show the items for which",

        LabelFilters: "Label Filters  ",
        BeginsWith: "Begins With",
        NotBeginsWith: "Not Begins With",
        EndsWith: "Ends With",
        NotEndsWith: "Not Ends With",
        Contains: "Contains",
        NotContains: "Not Contains",

        ValueFilters: "Value Filters",
        ClearFilter: "Clear Filter",
        Equals: "Equals",
        NotEquals: "Not Equals",
        GreaterThan: "Greater Than ",
        GreaterThanOrEqualTo: "Greater Than Or Equal To ",
        LessThan: "Less Than ",
        LessThanOrEqualTo: "Less Than Or Equal To ",
        Between: "Between",
        NotBetween: "Not Between",
        Top10: "Top Count",

        AddToFilter: "Add to Filter",
        AddToRow: "Add to Row",
        AddToColumn: "Add to Column",
        AddToValues: "Add to Values",
        Warning: "Warning",
        Error: "Error",
        GroupingBarAlertMsg: "The field you are moving cannot be placed in that area of the report",
        Measures: "Measures",
        Expand: "Expand",
        Collapse:"Collapse",
        ToolTipRow: "Row",
        ToolTipColumn: "Column",
        ToolTipValue: "Value",
        NoValue: "No value",
        SeriesPage: "Series Page",
        CategoricalPage: "Categorical Page",
        DragFieldHere: "Drag field here",
        ColumnArea: "Drop column here",
        RowArea: "Drop row here",
        ValueArea: "Drop values here",
        Close:"Close",
        OK: "OK",
        Cancel: "Cancel",
        Remove: "Remove",
        Goal: "Goal",
        Status: "Status",
        Trend: "Trend",
        Value: "value",
        ConditionalFormattingErrorMsg: "The given value is not matched",
        ConditionalFormattingConformMsg: "Are you sure you want to remove the selected format?",
        EnterOperand1: "Enter Operand1",
        EnterOperand2: "Enter Operand2",
        ConditionalFormatting: "Conditional Formatting",
        Condition: "Conditional Type",
        Value1: "Value1",
        Value2: "Value2",
        Editcondtion: "Edit Condition",
        AddNew: "Add New",
        Format: "Format",
        Backcolor: "Back Color",
        Borderrange: "Border Range",
        Borderstyle: "Border Style",
        Fontsize: "Font Size",
        Fontstyle: "Font Style",
        Bordercolor: "Border Color",
        NoMeasure: "Please add any measure",
        AliceBlue: "AliceBlue",
        Black: "Black",
        Blue: "Blue",
        Brown: "Brown",
        Gold: "Gold",
        Green: "Green",
        Lime: "Lime",
        Maroon: "Maroon",
        Orange: "Orange",
        Pink: "Pink",
        Red: "Red",
        Violet: "Violet",
        White: "White",
        Yellow: "Yellow",
        Solid: "Solid",
        Dashed: "Dashed",
        Dotted: "Dotted",
        Double: "Double",
        Groove: "Groove",
        Inset: "Inset",
        Outset: "Outset",
        Ridge: "Ridge",
        None: "None",
        Algerian: "Algerian",
        Arial: "Arial",
        BodoniMT: "Bodoni MT",
        BritannicBold: "Britannic Bold",
        Cambria: "Cambria",
        Calibri: "Calibri",
        CourierNew: "Courier New",
        DejaVuSans: "DejaVu Sans",
        Forte: "Forte",
        Gerogia: "Gerogia",
        Impact: "Impact",
        SegoeUI: "Segoe UI",
        Tahoma: "Tahoma",
        TimesNewRoman: "Times New Roman",
        Verdana: "Verdana",
        CubeDimensionBrowser: "Cube Dimension Browser",
        SelectHierarchy: "Select Hierarchy",
        CalculatedField: "Calculated Field",
        Name: "Name:",
        Add: "Add",
        Formula: "Formula:",
        Delete: "Delete",
        Fields: "Fields:",
        MultipleItems: "Multiple items",
        All:"All",
        CalculatedFieldNameNotFound: "Given CalculatedField name is not found",
        InsertField: "Insert Field",
        EmptyField: "Please enter Calculated field name or formula",
        NotValid: "Given formula is not valid",
        NotPresent: "Value field used in any of the Calculated Field formula is not present in the PivotGrid",
        Confirm: "Calculated field with the same name already exists. Due to want to Replace ?",
        CalcValue: "Calculated field can be inserted only in value area field",
        NoRecordsToDisplay : "No records to display."
    };

    ej.PivotGrid.ExportOptions = {
        Excel: 'excel',
        Word: 'word',
        PDF: 'pdf',
        CSV: 'csv'
    };

    ej.PivotGrid.ConditionalOptions = {
        Equals: "Equals",
        NotEquals: "Not Equals",
        GreaterThan: "Greater Than",
        GreaterThanOrEqualTo: "Greater Than Or Equal To",
        LessThan: "Less Than",
        LessThanOrEqualTo: "Less Than Or Equal To",
        Between: "Between",
        NotBetween: "Not Between"
    };

    ej.PivotGrid.AnalysisMode = {
        Olap: "olap",
        Relational: "relational"
    };
    ej.PivotGrid.ExportMode = {
        JSON: "json",
        PivotEngine: "pivotengine"
    };
    ej.PivotGrid.OperationalMode = {
        ClientMode: "clientmode",
        ServerMode: "servermode"
    };

    if (ej.olap.base)
        $.extend(ej.PivotGrid.prototype, ej.olap.base);
    if (ej.olap._mdxParser)
        $.extend(ej.PivotGrid.prototype, ej.olap._mdxParser);

})(jQuery, Syncfusion);;

});