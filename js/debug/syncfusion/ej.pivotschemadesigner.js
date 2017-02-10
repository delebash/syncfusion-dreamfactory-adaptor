/*!
*  filename: ej.pivotschemadesigner.js
*  version : 14.4.0.20
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.core","./../common/ej.data","./../common/ej.touch","./../common/ej.draggable","./../common/ej.scroller","./ej.button","./ej.checkbox","./ej.dialog","./ej.maskedit","./ej.waitingpopup","./ej.treeview","./../datavisualization/ej.chart"], fn) : fn();
})
(function () {
	
/**
* @fileOverview Pivot Schema Designer control to list out and analyze the data
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {

    ej.widget("ejPivotSchemaDesigner", "ej.PivotSchemaDesigner", {
        _rootCSS: "e-pivotschemadesigner",
        element: null,
        model: null,
        _requiresID: true,
        validTags: ["div", "span"],
        defaults: {
            url: "",
            cssClass: "",
            height: "630px",
            width: "415px",
            locale: "en-US",
            layout: "excel",
            enableRTL: false,
            pivotControl: null,
            pivotTableFields: [],
            pivotCalculations: [],
            pivotColumns: [],
            pivotRows: [],
            filters: [],
            olap: {
                showKpi: false,
                showNamedSets: false,
            },
            enableWrapper: false,
			enableDragDrop: true,
            serviceMethods: {
                fetchMembers: "FetchMembers", nodeStateModified: "NodeStateModified",
                nodeDropped: "NodeDropped", removeButton: "RemoveButton", memberExpand: "MemberExpanded", filtering: "filtering"
            },
            customObject: {},
            beforeServiceInvoke: null,
            afterServiceInvoke: null,
            dragMove: null,
            applyFieldCaption: null
        },

        dataTypes: {
            serviceMethods: "data",
            customObject: "data",
            pivotControl: "data",
            pivotTableFieldList: "array",
            pivotCalculationList: "array",
            pivotColumnList: "array",
            pivotRowList: "array",
            filterList: "array"
        },

        locale: ej.util.valueFunction("locale"),

        _init: function () {
            this._initPrivateProperties();
            this._load();
        },

        _destroy: function () {
            this.element.empty().removeClass("e-pivotschemadesigner" + this.model.cssClass);
        },

        _initPrivateProperties: function () {
            this._id = this.element.attr("id");
            this._dialogTitle = "";
            this._currentMembers = new Array();
            this._memberTreeObj = null;
            this._tableTreeObj = null;
            this._dialogOKBtnObj = null;
            this._curFilteredText = "";
            this._curFilteredAxis = "";
            this._tempFilterData = null;
            this._droppedClass = "";
            this._selectedTreeNode = null;
            this._selectedMember = "";
            this._selectedLevel = "";
            this._isDragging = false;
            this._dataModel = "";
            this._droppedPosition = "";
            this._currentCubeName = "";
            this._errorDialog = "";
            this._nodeDropedParams = "";
            this._contextMenuObj = null;
            this._removeButtonDeferUpdate = false;
            this._isMeasureBtnRemove = false;
            this._nodeCheck = false;
            this._isFiltered = false;
            this._curFocus = { tree: null, node: null, tab: null, button: null };
            this._index = { tree: 0, node: 0, tab: 0, button: 0};
            this._selectedFieldName = "";
            this._selectedFieldCaption = "";
            this._selectedFieldAxis = "";
            this._isDropAction = false;
        },

        _load: function () {
            var itemProps = "", report;
            if (this.model.pivotControl != null) {
                this.model.pivotControl._schemaData = this;
                if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    itemProps = JSON.parse(JSON.parse(this.model.pivotControl.getOlapReport()).ItemsProperties);
                    report = JSON.parse(this.model.pivotControl.getOlapReport());
                    if (this.model.pivotControl._dataModel == "Pivot") {
                        report = this.model.pivotControl._filterReport(report);
                        var items = report.PivotRows.concat(report.PivotColumns, report.PivotCalculations, report.Filters);
                        var treeViewData = $.grep(itemProps, function (value) { $.grep(items, function (field) { if (value.id == (field.FieldHeader || field.DimensionHeader)) value.id = (field.FieldName || field.DimensionName); }); return value; });
                        this._setTableFields(treeViewData);
                    }
                    else
                        this._setTableFields(itemProps);
                    this._setPivotRows(report.PivotRows);
                    this._setPivotColumns(report.PivotColumns);
                    this._setPivotCalculations(report.PivotCalculations);
                    this._setFilters(report.Filters);
                    this._dataModel = report.DataModel;
                    this._currentCubeName = report.CurrentCube;
                }
                else {
                    report = this.model.pivotControl.model.dataSource;
                    if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                        this.model.pivotTableFields = ej.PivotAnalysis.getTreeViewData(this.model.pivotControl.model.dataSource);
                }
                if (this.model._waitingPopup) {
                    this._waitingPopup = this.model._waitingPopup;
                }
                else {
                    $("#" + this._id).ejWaitingPopup({ showOnInit: true });
                    this._waitingPopup = $("#" + this._id).data("ejWaitingPopup");
                }
                this.element.width(this.model.width).height(this.model.height);
                pschemaDesignerWaitingPopup = this._waitingPopup;
                this._waitingPopup.show();
            }
            if (!this.model.enableWrapper) {
                var fieldTable =
                    (this.model.layout == "onebyone" ? "" : ej.buildTag("table.headerTable", ej.buildTag("tr", ej.buildTag("td", ej.buildTag("div.listHeader", ej.buildTag("span.headerText", this._getLocalizedLabels("PivotTableFieldList"), {})[0].outerHTML, {})[0].outerHTML + ej.buildTag("div.listSubhead", ej.buildTag("span.subheadText", this._getLocalizedLabels("ChooseFieldsToAddToReport"), {})[0].outerHTML, {})[0].outerHTML, {}).attr("valign", "top")[0].outerHTML, {})[0].outerHTML, { "width": "100%", "height": "10%" })[0].outerHTML) +

                    ej.buildTag("div.fieldTable",
                    ((this.model.pivotControl != null && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne) ? ej.buildTag("div.cubelists", ej.buildTag("input#cubeList.cubeList").attr("type", "text")[0].outerHTML)[0].outerHTML : "") +
                    ej.buildTag("div.schemaFieldTree#schemaFieldTree", {}, { "width": "100%", "overflow": "auto" })[0].outerHTML).attr("valign", "top")[0].outerHTML;

                    filterAxis =
                    ej.buildTag("div.axisTd1", ej.buildTag("div.pivotHeader", ej.buildTag("span.headerText", this._getLocalizedLabels("ReportFilter"), {})[0].outerHTML, {})[0].outerHTML +
                    ej.buildTag("div.schemaFilter", ej.buildTag("p#reportfilter", "report filter", { "display": "none" })[0].outerHTML +
                this._createPivotButtons(this.model.filters, "filter")).attr("aria-describedby", "reportfilter").attr("aria-dropeffect", "none").attr("aria-selected", "false")[0].outerHTML, {})[0].outerHTML;

                    columnAxis =
                    ej.buildTag("div.axisTd2", ej.buildTag("div.rPivotHeader", ej.buildTag("span.headerText", this._getLocalizedLabels("ColumnLabel"), {})[0].outerHTML, {})[0].outerHTML +
                    ej.buildTag("div.schemaColumn", ej.buildTag("p#columnlabel", "column label", { "display": "none" })[0].outerHTML + this._createPivotButtons(this.model.pivotColumns, "column") +
                (this._dataModel != "XMLA" || this.model.pivotCalculations.length == 0 ? "" : (this.model.pivotCalculations[0]["measures"] != undefined && this.model.pivotCalculations[0]["measures"].length > 0 && this.model.pivotCalculations[0]["axis"] != undefined && this.model.pivotCalculations[0]["axis"] == "columns" ? this._createPivotButtons([{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }], "column") : "")), {})[0].outerHTML, {}).attr("aria-describedby", "columnlabel").attr("aria-dropeffect", "none").attr("aria-selected", "false")[0].outerHTML;

                    rowAxis =
                    ej.buildTag("div.axisTd1#axisTd", ej.buildTag("div.pivotHeader", ej.buildTag("span.headerText", this._getLocalizedLabels("RowLabel"), {})[0].outerHTML, {})[0].outerHTML +
                    ej.buildTag("div.schemaRow", ej.buildTag("p#rowlabel", "row label", { "display": "none" })[0].outerHTML +
                    this._createPivotButtons(this.model.pivotRows, "row") +
                (this._dataModel != "XMLA" || this.model.pivotCalculations.length == 0 ? "" : (this.model.pivotCalculations[0]["measures"] != undefined && this.model.pivotCalculations[0]["measures"].length > 0 && this.model.pivotCalculations[0]["axis"] != undefined && this.model.pivotCalculations[0]["axis"] == "rows" ? this._createPivotButtons([{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }], "row") : "")), {})[0].outerHTML, {}).attr("aria-describedby", "rowlabel").attr("aria-dropeffect", "none").attr("aria-selected", "false")[0].outerHTML;

                    values =
                    ej.buildTag("div.axisTd2#axisTd", ej.buildTag("div.rPivotHeader", ej.buildTag("span.headerText", this._getLocalizedLabels("Values"), {})[0].outerHTML, {})[0].outerHTML +
                ej.buildTag("div.schemaValue", ej.buildTag("p#valuelabel", "values", { "display": "none" })[0].outerHTML + this._createPivotButtons(this.model.pivotCalculations, "values"), {}).attr("aria-describedby", "valuelabel").attr("aria-dropeffect", "none").attr("aria-selected", "false")[0].outerHTML, {})[0].outerHTML;

                    axisTable = ej.buildTag("div.axisTable", (this.model.layout == "onebyone" ? (columnAxis + rowAxis + filterAxis + values) : (ej.buildTag("div", filterAxis + columnAxis, {})[0].outerHTML + ej.buildTag("div", rowAxis + values, {})[0].outerHTML)), (this.model.enableRTL && this.model.layout == "onebyone" ? { "position": "relative", "left": "15px" } : {}))[0].outerHTML;

                deferUpdate = ej.buildTag("div.deferUpdateLayout", ej.buildTag("input.chkDeferUpdate", "", {}).attr("type", "checkbox")[0].outerHTML + ej.buildTag("button.btnDeferUpdate", this._getLocalizedLabels("Update"), {}).attr("type", "button")[0].outerHTML)[0].outerHTML;
                if (this.model.enableRTL && this.element.parents(".e-pivotclient").length > 0 && oclientProxy.model.enableSplitter) {
                    htmlTag = axisTable + (this.model.layout == "onebyone" ? "" : ej.buildTag("div.centerDiv")[0].outerHTML + ej.buildTag("div.centerHead", this._getLocalizedLabels("DragFieldBetweenAreasBelow"))[0].outerHTML) +
                              fieldTable + ($(this.element).parents(".e-pivotclient").length > 0 ? "" : ej.buildTag("span.responsiveSchema", "")[0].outerHTML) + (this.model.pivotControl != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && $(this.element).parents(".e-pivotclient").length == 0 ? deferUpdate : "") + ($(this.element).parents(".e-pivotclient").length > 0 ? "" : ej.buildTag("div.schemaNoClick", "")[0].outerHTML);
                }
                else {
                    htmlTag = fieldTable + (this.model.layout == "onebyone" ? "" : ej.buildTag("div.centerDiv")[0].outerHTML + ej.buildTag("div.centerHead", this._getLocalizedLabels("DragFieldBetweenAreasBelow"))[0].outerHTML) +
                              axisTable + ($(this.element).parents(".e-pivotclient").length > 0 ? "" : ej.buildTag("span.responsiveSchema", "")[0].outerHTML) + (this.model.pivotControl != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && $(this.element).parents(".e-pivotclient").length == 0 ? deferUpdate : "") + ($(this.element).parents(".e-pivotclient").length > 0 ? "" : ej.buildTag("div.schemaNoClick", "")[0].outerHTML);
                }
                $(htmlTag).appendTo("#" + this._id);
                if (this.element.parents(".e-pivotclient").length > 0&&!oclientProxy.model.enableSplitter) {
                    this.element.find(".fieldTable").addClass("addedFieldTable");
                    if(!this.model.enableRTL)
                    this.element.find(".fieldTable").addClass("fieldDisSplitTable");
                 }
                if (this.element.parents(".e-pivotclient").length > 0 && oclientProxy.model.enableSplitter) {
                    this.element.find(".fieldTable").addClass("fieldEnSplitTable");
                }
                if (this.model.enableRTL && this.element.parents(".e-pivotclient").length > 0) {
                    this.element.find(".fieldTable").addClass("clientFieldTable");
                    this.element.find(".fieldTable").addClass("rtlSplitTable");
                    if (this.element.parents(".e-pivotclient").length > 0 && oclientProxy.model.enableSplitter) {
                        this.element.find(".axisTable").addClass("clientAxisSplitterTable");
                    }
                    else
                        this.element.find(".axisTable").addClass("clientAxisTable");
                }
                if (this.model.pivotControl != null) {
                    if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode || this.model.pivotControl.element.hasClass("e-pivotclient"))
                        this._refreshPivotButtons();
                    this._reSizeHandler();
                }
                else
                    this.element.hide();
            }
            else {
                this.element.show();
                if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                    this._refreshPivotButtons();
                }
                else {
                this._setFilters(report.Filters);
                this.element.find(".axisTable .schemaFilter").append(this._createPivotButtons(this.model.filters, "filter"));
                this.element.find(".axisTable .schemaRow").append(this._createPivotButtons(this.model.pivotRows, "row") + (this._dataModel != "XMLA" || this.model.pivotCalculations.length == 0 ? "" : (this.model.pivotCalculations[0]["measures"] != undefined && this.model.pivotCalculations[0]["measures"].length > 0 && this.model.pivotCalculations[0]["axis"] != undefined && this.model.pivotCalculations[0]["axis"] == "rows" ? this._createPivotButtons([{ fieldName: "Measures" }], "row") : "")));
                this.element.find(".axisTable .schemaColumn").append(this._createPivotButtons(this.model.pivotColumns, "column") + (this._dataModel != "XMLA" || this.model.pivotCalculations.length == 0 ? "" : (this.model.pivotCalculations[0]["measures"] != undefined && this.model.pivotCalculations[0]["measures"].length > 0 && this.model.pivotCalculations[0]["axis"] != undefined && this.model.pivotCalculations[0]["axis"] == "columns" ? this._createPivotButtons([{ fieldName: "Measures" }], "column") : "")));
                this.element.find(".axisTable .schemaValue").append(this._createPivotButtons(this.model.pivotCalculations, "values"));
                if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this.element.append(ej.buildTag("div.deferUpdateLayout", ej.buildTag("input.chkDeferUpdate", "", {}).attr("type", "checkbox")[0].outerHTML + ej.buildTag("button.btnDeferUpdate", this._getLocalizedLabels("Update"), {}).attr("type", "button")[0].outerHTML)[0].outerHTML);
                    if (this.model.pivotControl != null) {
                if (this.model.enableDragDrop) {
                    this.element.find(".pivotButton .pvtBtn").ejButton({ size: "normal", type: ej.ButtonType.Button, enableRTL: this.model.enableRTL }).ejDraggable({
						handle: 'button', clone: true,
						cursorAt: { left: -5, top: -5 },
						dragStart: ej.proxy(function (args) {
							this._isDragging = true;
						}, this),
                                dragStop: ej.proxy(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._pvtBtnDropped : this._clientOnPvtBtnDropped, this),
						helper: ej.proxy(function (event, ui) {
						    $(event.element).addClass("dragHover");
							if (event.sender.target.className.indexOf("e-btn") > -1) {
								var btnClone = $(event.sender.target).clone().attr("id",this._id+"_dragClone").appendTo('body');
								$("#"+this._id + "_dragClone").removeAttr("style").height($(event.sender.target).height());
								return btnClone;            
							}
							else
								return false;
						}, this)
					});
                        }
                    }
                }
                this._reSizeHandler();
            }
			
			if (this.model.enableDragDrop && this.model.pivotControl) {
			    this.element.find(".pivotButton .pvtBtn").ejButton({ size: "normal", type: ej.ButtonType.Button, enableRTL: this.model.enableRTL }).ejDraggable({
					handle: 'button', clone: true,
					cursorAt: { left: -5, top: -5 },
					dragStart: ej.proxy(function (args) {
						this._isDragging = true;
					}, this),
                    dragStop: ej.proxy(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._pvtBtnDropped : this._clientOnPvtBtnDropped, this),
					helper: ej.proxy(function (event, ui) {
					    $(event.element).addClass("dragHover");
						if (event.sender.target.className.indexOf("e-btn") > -1) {
							var btnClone = $(event.sender.target).clone().attr("id",this._id+"_dragClone").appendTo('body');
                            $("#"+this._id + "_dragClone").removeAttr("style").height($(event.sender.target).height());
                            return btnClone;            
                        }
						else
							return false;
					}, this)
				});
			}
            this.element.find(".pivotButton .filterBtn").ejButton({
                size: "normal",
                enableRTL: this.model.enableRTL,
                type: ej.ButtonType.Button,
                contentType: "imageonly",
                prefixIcon: "filter"
            });
            if (this.model.pivotControl && this.model.pivotControl.model.operationalMode==ej.Pivot.OperationalMode.ClientMode && this.model.pivotControl.model.analysisMode==ej.Pivot.AnalysisMode.Olap&& this.model.layout==ej.PivotSchemaDesigner.Layouts.OneByOne) {
                var parms = { url: this.model.pivotControl.model.dataSource.data, cube: this.model.pivotControl.model.dataSource.cube, catalog: this.model.pivotControl.model.dataSource.catalog, request: "MDSCHEMA_CUBES" };
                ej.Pivot._getTreeData(parms, ej.Pivot.getCubeList, { pvtCtrldObj: this, action: "loadcubelist", hierarchy: this._selectedField });
                this.element.find(".cubeList").ejDropDownList({
                    dataSource: this.model.cubeCollection,
                    enableRTL: this.model.enableRTL,
                    fields: { text: "name", value: "name" },
                    width: "100%",
                    height:"27px",
                    change: ej.proxy(this._cubeChanged, this)
                });
                ddlTarget = this.element.find('.cubeList').data("ejDropDownList");
                if (!ej.isNullOrUndefined(ddlTarget)) {
                    ddlTarget.selectItemByText(this.model.pivotControl.model.dataSource.cube);
                }
            }
            this.element.find(".pivotButton input").ejToggleButton({
                size: "normal",
                enableRTL: this.model.enableRTL,
                contentType: "imageonly",
                defaultPrefixIcon: "ascending",
                activePrefixIcon: "descending",
                click: ej.proxy(this._sortBtnClick, this)
            });

            if (this.model.pivotControl != null) {
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot || this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._createTreeView(this, this.model.pivotTableFields);
                else {
                    ej.Pivot.generateTreeViewData(this);
                }
            }
            if (this.model.enableRTL)
                this.element.addClass("e-rtl");
            this._createContextMenu();
            if(this._waitingPopup) this._waitingPopup.hide();
            this._setPivotBtnWidth();
        },

        setCubeList: function (cubeCollection) {
            this.model.cubeCollection = cubeCollection;
        },

        refreshControl: function () {
            $(this._tableTreeObj.element).ejTreeView("unCheckAll");
            this._isDropAction = true;
            var dataSource = this.model.pivotControl.model.dataSource;
            for (var i = 0; i < dataSource.rows.length; i++)
                this._tableTreeObj.checkNode(dataSource.rows[i].fieldName);
            for (var i = 0; i < dataSource.columns.length; i++)
                this._tableTreeObj.checkNode(dataSource.columns[i].fieldName);
            for (var i = 0; i < dataSource.filters.length; i++)
                this._tableTreeObj.checkNode(dataSource.filters[i].fieldName);
            for (var i = 0; i < dataSource.values.length; i++)
                this._tableTreeObj.checkNode(dataSource.values[i].fieldName);
            this._isDropAction = false;
            this._refreshPivotButtons();
        },

        _cubeChanged: function (args) {
            if (this.model.pivotControl.model.dataSource.cube != args.selectedValue) {
				if(oclientProxy._waitingPopup)
                oclientProxy._waitingPopup.show();
                this.model.pivotControl.model.dataSource.cube = args.selectedValue;
                this.model.pivotControl.model.dataSource.rows = this.model.pivotControl.model.dataSource.columns = this.model.pivotControl.model.dataSource.values = this.model.pivotControl.model.dataSource.filters = [];
              
                delete this.model.pivotControl._fieldData;
                this.element.find(".pivotButton").remove();
                this.element.find(".schemaFieldTree").empty();
                ej.Pivot.generateTreeViewData(this, this.model.pivotControl.model.dataSource);
                if (!ej.isNullOrUndefined(oclientProxy._waitingPopup)) {
                    oclientProxy.refreshControl();
                    oclientProxy._waitingPopup.hide();
                }
            }
        },

        _setPivotBtnWidth: function () {
            if (this.model.layout != "excel" && this.model.pivotControl) {
                var mode = this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? true : false;
                var model = mode ? this._dataModel : this.model.pivotControl._dataModel
                var wid = model == "Olap" || model == "XMLA" ? 15 : 20;
                $.each(this.element.find(".schemaRow .pvtBtn,.schemaColumn .pvtBtn"), function (index, value) {
                    if ($(value).attr("aria-describedby") == "Measures") {
                        $(value).width($(value).parent().width() - wid - 10);
                    }
                    else {
                        $(value).width($(value).parent().width() - (3 * wid));
                        if (this._dataModel != "Pivot" && mode && $(".pivotButton:contains('" + $(value).text() + "'):first").find(".filtered").length > 0) {
                            $(value).parent().find(".filter").addClass("filtered");
                        }
                    }
                });
                $.each(this.element.find(".schemaValue .pvtBtn"), function (index, value) {
                    $(value).width($(value).parent().width() - wid - 10);
                });
                $.each(this.element.find(".schemaFilter .pvtBtn"), function (index, value) {
                    $(value).width($(value).parent().width() - (2 * wid) - 10);
                    if (this._dataModel != "Pivot" && mode && $(".pivotButton:contains('" + $(value).text() + "'):first").find(".filtered").length > 0) {
                        $(value).parent().find(".filter").addClass("filtered");
                    }
                });
            }
            else {
                $.each(this.element.find(".pvtBtn"), function (index, value) {
                    $(value).width($(value).parent().width() - 15);
                });
            }
        },

        _onContextOpen: function (args) {
            ej.Pivot._contextMenuOpen(args, this);
        },

        _contextClick: function (args) {
            this.model.pivotControl._waitingPopup.show();
            var droppedPosition = args.text == this._getLocalizedLabels("AddToColumn") ? this.element.find(".schemaColumn") : args.text == this._getLocalizedLabels("AddToRow") ? this.element.find(".schemaRow") : args.text == this._getLocalizedLabels("AddToValues") ? this.element.find(".schemaValue") : args.text == this._getLocalizedLabels("AddToFilter") ? this.element.find(".schemaFilter") : "";
            var params = { element: this._selectedMember, target: droppedPosition[0], cancel: false };
            if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                this._pvtBtnDropped(params);
            else
                this._clientOnPvtBtnDropped(params);
        },

        _createTreeView: function (args, dataSourceInfo) {
            this.element.find(".schemaFieldTree").ejTreeView({
                showCheckbox: this.model.layout == "onebyone" ? false : true,
                fields: { id: "id", parentId: "pid", text: (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode || this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) ? "name" : "caption", isChecked: "isSelected", spriteCssClass: "spriteCssClass", dataSource: dataSourceInfo },
                enableRTL: this.model.enableRTL,
                allowDragAndDrop: this.model.enableDragDrop ? true : false,
                allowDropChild: false,
                allowDropSibling: false,
                dragAndDropAcrossControl: true,
                beforeDelete: function () {
                    return false;
                },
                nodeDropped: ej.proxy(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._nodeDropped : this._clientOnNodeDropped, this),
                nodeDragStart: ej.proxy(this._nodeDrag, this),
                nodeDrag: ej.proxy(this._nodeDraged, this)
            });
            var treeViewElements = [];
            this._tableTreeObj = this.element.find(".schemaFieldTree").data("ejTreeView");
            this._tableTreeObj.element.find(".e-ul").css({"width":"100%","height":"100%"});
            this._tableTreeObj.element.find(".measureGroupCDB").parent().siblings(".e-chkbox-wrap").remove();
            this._tableTreeObj.element.find(".folderCDB").parent().siblings(".e-chkbox-wrap").remove();
            this._tableTreeObj.element.find(".dimensionCDB").parent().siblings(".e-chkbox-wrap").remove();
			if(this.model.layout!=ej.PivotSchemaDesigner.Layouts.OneByOne){
            this._tableTreeObj.element.find(".measureGroupCDB").parents("li").append(ej.buildTag("span.elementSeparator")[0].outerHTML);
            this._tableTreeObj.element.find(".dimensionCDB").parents("li").append(ej.buildTag("span.elementSeparator")[0].outerHTML);
			}
			if (this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne) {
			    treeViewElements = this._tableTreeObj.element;
			    $.map(dataSourceInfo, function (obj, index) { if (obj["defaultHierarchy"]) $(treeViewElements).find("li[id='" + obj.tag + "']").attr("defaultHierarchy", obj["defaultHierarchy"]); });
			}
			treeViewElements = this._tableTreeObj.element.find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                var tagValue = this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? $(treeViewElements[i]).attr("id") : this.model.pivotTableFields[i].tag; 
                treeViewElements[i].setAttribute("tag", tagValue);
                var checkedBoxNode = $(treeViewElements[i]).find(".e-chkbox-wrap");
                if ($(checkedBoxNode[0]).attr("aria-checked") == "true" && $($(treeViewElements[i])).find(".folderCDB").length <= 0 && $(treeViewElements[i]).attr("tag").toLowerCase().indexOf("[measures]") == -1) {
                    if (this.model.pivotControl._dataModel == "XMLA") {
                        if ($(treeViewElements[i]).parents("li:eq(0)").length>0 && $(treeViewElements[i]).parents("li:eq(0)").attr("tag").toLowerCase().indexOf("[measures]") == -1) {
                            var currentItem = (ej.Pivot.getReportItemByFieldName(($(treeViewElements[i]).attr("tag")), this.model.pivotControl.model.dataSource, this._dataModel)).item;
                            if (!ej.isNullOrUndefined(currentItem) > 0 && (currentItem["isNamedSets"] == undefined || !currentItem["isNamedSets"])) {
                                var dropSpan = ej.buildTag("span.e-icon").css("display", "inline-block").addClass("treeDrop").attr("role","button").attr("aria-label","filter button")[0].outerHTML;
                                $($(treeViewElements[i]).find(".e-text")[0]).after(dropSpan);
                            }
                        }
                    }
                    else {
                        var dropSpan = ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML;
                        $($(treeViewElements[i]).find(".e-text")[0]).after(dropSpan);
                    }
                }
            }
            if (this.model.pivotControl != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                this._tableTreeObj.model.nodeCheck = ej.proxy(this._clientPivotCheckedStateModified, this);
                this._tableTreeObj.model.nodeUncheck = ej.proxy(this._clientPivotCheckedStateModified, this);
            }
            else {
                this._tableTreeObj.model.nodeCheck = ej.proxy(this._checkedStateModified, this);
                this._tableTreeObj.model.nodeUncheck = ej.proxy(this._checkedStateModified, this);
            }
            this._tableTreeObj.element.find(".attributeCDB").parent().siblings("ul").remove();
            this._tableTreeObj.element.find(".attributeCDB").closest('div').find('.e-plus').remove();
            this._tableTreeObj.element.find(".hierarchyCDB").parent().parent().siblings("ul").find(".e-chkbox-wrap").remove();
            if (this._tableTreeObj.element.find(".e-plus").length == 0) {
                this._tableTreeObj.element.find(".e-item").css("padding", "0px");
            }
            this.element.find(".schemaFilter, .schemaColumn, .schemaRow, .schemaValue").ejDroppable({
            });
            if (this.model.pivotControl != null) {
				var ele = this.element.find(".e-text");
                var contextTag = ej.buildTag("ul.pivotTreeContext#pivotTreeContext", ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToFilter"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToRow"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToColumn"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToValues"))[0].outerHTML)[0].outerHTML)[0].outerHTML;
                $(this.element).append(contextTag);
                $("#pivotTreeContext").ejMenu({
                    menuType: ej.MenuType.ContextMenu,
                    openOnClick: false,
                    enableRTL: this.model.enableRTL,
                    contextMenuTarget: ele,
                    click: ej.proxy(this._treeContextClick, this),
                    beforeOpen: ej.proxy(this._contextOpen, this),
                    close: ej.proxy(ej.Pivot.closePreventPanel, this)
                });
            }
            
            if (this.model.pivotControl != null) {
                var deferCheck = false;
                if (this.model.pivotControl.model.enableDeferUpdate)
                    deferCheck = true;
                this.element.find(".btnDeferUpdate").ejButton({
                    size: "mini",
                    type: ej.ButtonType.Button,
                    enabled: deferCheck,
                    click: ej.proxy(this.model.pivotControl._deferUpdate, this.model.pivotControl)
                });
                this.element.find(".chkDeferUpdate").ejCheckBox({
                    text: this._getLocalizedLabels("DeferLayoutUpdate"),
                    change: this._checkedChange,
                    size: "normal",
                    checked: deferCheck
                });
            }
            pschemaDesignerWaitingPopup.hide();
            this._unWireEvents();
            this._wireEvents();
        },
        _nodeDraged: function (args) {
            if (this._trigger("dragMove", args))
                return;
        },
        _setFirst: true,

        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
                    case "OlapReport": this.setOlapReport(options[key]); break;
                    case "locale": this._load(); break;
                    case "locale": case "enableRTL": $(this.element).html(""); this._load(); break;
                }
            }
        },

        _wireEvents: function () {
            this._on($(document), 'keydown', this._keyDownPress);
            if (this.model.layout != "excel" && this.model.layout != ej.PivotSchemaDesigner.Layouts.OneByOne) {
                this._on(this.element, "mouseover", ".pivotButton .pvtBtnDiv", ej.proxy(function (evt) {
                    if (!this._isDragging)
                        $(evt.target).find("button").removeClass("e-hoverBtn").addClass("e-hoverBtn");
                }, this));
                this._on(this.element, "mouseleave", ".pivotButton .pvtBtnDiv", ej.proxy(function (evt) {
                        $(evt.target).find("button").length > 0 ? $(evt.target).find("button").removeClass("e-hoverBtn") : $(evt.target).removeClass("e-hoverBtn");
                }, this));
                this._on(this.element, "mouseover", ".filter,.sorting,.removeBtn", ej.proxy(function (evt) {
                    if (!this._isDragging)
                        $(evt.target.parentElement).find("button").removeClass("e-hoverBtn").addClass("e-hoverBtn");
                }, this));
                this._on(this.element, "mouseleave", ".filter,.sorting,.removeBtn", ej.proxy(function (evt) {
                    $(evt.target.parentElement).find("button").removeClass("e-hoverBtn");
                }, this));
            }
            this._on(this.element, "mouseover", ".pvtBtnDiv .pvtBtn", ej.proxy(function (evt) {
                    if (this._isDragging) {
                        this.element.find(".dropIndicator").removeClass("dropIndicatorHover");
                        $(evt.target).parent().siblings(".dropIndicator").addClass("dropIndicatorHover");
                    }
                }, this));
            this._on(this.element, "mouseleave", ".pivotButton", ej.proxy(function (evt) { if (this._isDragging) $(evt.target).siblings(".dropIndicator").removeClass("dropIndicatorHover"); }, this));
            this._on(this.element, "mouseover", ".pivotButton", ej.proxy(function (evt) { $(evt.target).attr("title", evt.target.textContent);}, this));
            this._tableTreeObj.element.find("li").mouseover(ej.proxy(function (evt) {
                var margin;
                if ($(evt.target).siblings("span.e-icon.filter:eq(0)").length > 0 || $(evt.target).find("span.e-icon.filter:eq(0)").length > 0 || $(evt.target).parentsUntil("li").find("span.e-icon.filter:eq(0)").length > 0) {
                    margin = "-35px";
                    this.element.find("span.e-icon.filter").attr("role","button").attr("aria-label","filtered");
                }
                else {
                    margin = "-20px";
                    this.element.find("span.e-icon.treeDrop").attr("role", "button").attr("aria-label", "filter button");
                }
                var left = ($(evt.target).siblings("span.e-icon.filter:eq(0)").length > 0 || $(evt.target).find("span.e-icon.filter:eq(0)").length > 0 || $(evt.target).parentsUntil("li").find("span.e-icon.filter:eq(0)").length > 0) ? 10 : 5;
                if (this.model.enableRTL) {
                   if (this.model.pivotControl.model.analysisMode != ej.Pivot.AnalysisMode.Pivot)
                        $(evt.target).siblings("span.e-icon.treeDrop:eq(0)").length > 0 ? $(evt.target).siblings("span.e-icon.treeDrop:eq(0)").css({ display: "inline-block", "position": "absolute", "top": ($(evt.target).hasClass("filter") ? $(evt.target).position().top - 22 : $(evt.target).position().top + 2), "left": ($(evt.target).hasClass("filter") ? ($(evt.target).position().left + (6 - left)) : (($(evt.target).attr("role") == "" ? $(evt.target).position().left : -2) + (5 - left))) }) : $(evt.target).find("span.e-icon.treeDrop:eq(0)").length > 0 ? $(evt.target).find("span.e-icon.treeDrop:eq(0)").css({ "display": "inline-block", "position": "absolute" }) : $(evt.target).parentsUntil("li").find("span.e-icon.treeDrop:eq(0)").css({ "display": "inline-block", "position": "absolute" });
                    else
                        $(evt.target).siblings("span.e-icon.treeDrop:eq(0)").length > 0 ? $(evt.target).siblings("span.e-icon.treeDrop:eq(0)").css({ display: "inline-block", "position": "absolute", "top": ($(evt.target).hasClass("filter") ? $(evt.target).position().top - 22 : $(evt.target).position().top + 2), "left": ($(evt.target).hasClass("filter") ? $(evt.target).position().left + (7 - left) : $(evt.target).position().left + (10 - left)) }) : $(evt.target).find("span.e-icon.treeDrop:eq(0)").length > 0 ? $(evt.target).find("span.e-icon.treeDrop:eq(0)").css({ "display": "inline-block", "position": "absolute" }) : $(evt.target).parentsUntil("li").find("span.e-icon.treeDrop:eq(0)").css({ "display": "inline-block", "position": "absolute" });
                }
                else
                    $(evt.target).siblings("span.e-icon.treeDrop:eq(0)").length > 0 ? $(evt.target).siblings("span.e-icon.treeDrop:eq(0)").css({ display: "inline-block", "position": "static", "margin-left": margin}) : $(evt.target).find("span.e-icon.treeDrop:eq(0)").length > 0 ? $(evt.target).find("span.e-icon.treeDrop:eq(0)").css({ "display": "inline-block", "position": "static" }) : $(evt.target).parentsUntil("li").find("span.e-icon.treeDrop:eq(0)").css({ "display": "inline-block", "position": "static" });
                if ($(evt.target).parent().find(".measureGroupCDB, .folderCDB",(this.model.layout==ej.PivotSchemaDesigner.Layouts.OneByOne?"":".dimensionCDB") ).length > 0)
                    $(evt.target).css("cursor", "default");
            }, this))
          .mouseout(ej.proxy(function (evt) {
              $(this._tableTreeObj.element).find("span.e-icon.treeDrop").css({ display: "none" });
          }, this));
            this._on(this.element, "click", ".filterBtn,.filter", ej.proxy(this._filterBtnClickCommon, this));
            this._on(this.element, "click", ".sorting", ej.proxy(this._sortBtnClick, this));
            this._on(this.element, "click", ".removeBtn", ej.proxy(this._removePvtBtn, this));
            this._on(this.element, "click", ".pvtBtn", ej.proxy(this._filterBtnClickCommon, this));

            this._on(this._tableTreeObj.element, "click", ".treeDrop", ej.proxy(this._filterBtnClickCommon, this));

            this._on(this.element, "click", ".removeClientPivotBtn", ej.proxy(this._removeBtnClick, this));
            this._on(this.element, "click", ".removePivotBtn", ej.proxy(this._removeBtnClick, this));

            this._on(this.element, "click", ".ascOrder, .descOrder", ej.proxy(this._sortDimensionElement, this));
            this._on(this.element, "click", ".collapseSchema", ej.proxy(this._hideSchemaDesigner, this));
            this._on(this.element, "click", ".expandSchema", ej.proxy(this._showSchemaDesigner, this));
            this._on(this.element, "click", ".nextPage, .prevPage, .firstPage, .lastPage", ej.proxy(this._navigateTreeData, this));
            $(window).on('resize', $.proxy(this._reSizeHandler, this));
        },
        
        _navigateTreeData: function (args) {
            ej.Pivot.editorTreeNavigatee(args, this.model.pivotControl);
        },
        _filterBtnClickCommon: function (args) {
            if(($(args.target).hasClass("pvtBtn") && (this.element.parents(".e-pivotclient").length > 0)) || $(args.target).hasClass("treeDrop") || $(args.target).hasClass("filter")){
                if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode)
                    this._clientOnFilterBtnClick(args);
                else {
                    if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && !ej.isNullOrUndefined($(args.target.nextElementSibling)))
                        if ($(args.target.nextElementSibling).hasClass("treeDrop"))
                            return false;
                        else
                            this._filterBtnClick(args);
                    else
                        this._filterBtnClick(args);
                }
			}
        },

        _unWireEvents: function () {
            this._off(this.element, "click", ".filterBtn, .ascOrder, .descOrder, .nextPage, .prevPage, .firstPage, .lastPage");
            this._off($(document), 'keydown', this._keyDownPress);
            this._off(this.element, "mouseover", ".pivotButton");
            this._off(this.element, "mouseover", ".pivotButton .pvtBtn");
            this._off(this.element, "mouseleave", ".pivotButton");
            this._off(this.element, "click", ".sorting");
            this._off(this.element, "click", ".filter");
            this._off(this.element, "click", ".removeBtn,.removeClientPivotBtn");
            this._off(this.element, "mouseover", ".schemaFieldTree li");
            this._off(this.element, "mouseout", ".schemaFieldTree li");
            this._off(this._tableTreeObj.element, "click", ".treeDrop");
            this._off(this.element, "click", ".ascOrder, .descOrder", ej.proxy(this._sortDimensionElement, this));
            this._off(this.element, "click", ".filterBtn", ej.proxy(this._filterBtnClick, this));
            this._off(this.element, "click", ".pvtBtn", ej.proxy(this._clientOnFilterBtnClick, this))
            this._off(this._tableTreeObj.element, "click", ".treeDrop", ej.proxy(this._filterBtnClick, this));
            this._off(this._tableTreeObj.element, "click", "li");
            this._off(this.element, "click", ".removeClientPivotBtn, .removePivotBtn");
            $(window).off('resize', $.proxy(this._reSizeHandler, this));
        },
        _keyDownPress: function (e) {           
            if ((e.keyCode === 40 || e.which === 38) && ((!ej.isNullOrUndefined(this.model.pivotControl._curFocus.tab) && this.model.pivotControl._curFocus.tab.hasClass("e-text")) || this.element.find(".schemaFieldList .e-text:visible").hasClass("hoverCell")) && !$(".editorTreeView:visible").length > 0 && !$(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0) {
                this.element.find(".hoverCell").removeClass("hoverCell");
                this.model.pivotControl._curFocus.tab.mouseleave();
                e.preventDefault();
                var td = this.element.find(".schemaFieldTree .e-text:visible");
                if (!ej.isNullOrUndefined(this._curFocus.tree)) {
                    this._curFocus.tree.attr("tabindex", "0").removeClass("hoverCell").mouseleave();
                    if (e.which === 40) {
                        this._index.tree = this._index.tree + 1 > td.length - 1 ? 0 : this._index.tree + 1;
                    }
                    else if (e.which === 38) {
                        this._index.tree = this._index.tree - 1 < 0 ? td.length - 1 : this._index.tree - 1;
                    }
                    this._curFocus.tree = td.eq(this._index.tree).attr("tabindex", "-1");
                }
                else {
                    this._index.tree = e.which == 40 ? 1 : e.which == 38 ? td.length - 1 : 0;
                    this._curFocus.tree = td.eq(this._index.tree).attr("tabindex", "-1");
                }
                this._curFocus.tree.focus().addClass("hoverCell").mouseover();
                $(".e-node-focus").removeClass("e-node-focus");
            }
            else if ((e.which === 40 || e.which === 38 || e.which === 37 || e.which === 39) && !ej.isNullOrUndefined(this.model.pivotControl._curFocus.tab) && this.model.pivotControl._curFocus.tab.hasClass("pvtBtn") && !$(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0 && document.activeElement.className.startsWith("pvtBtn")) {
                e.preventDefault();
                this.element.find(".hoverCell").removeClass("hoverCell");
                if (!ej.isNullOrUndefined(this.model.pivotControl._curFocus.tab)) {
                    this.model.pivotControl._curFocus.tab.mouseleave().attr("tabindex", "0").removeClass("hoverCell");
                }
                var td = this.element.find(".pvtBtn")
                if (!ej.isNullOrUndefined(this._curFocus.button)) {
                    this._curFocus.button.attr("tabindex", "0").removeClass("hoverCell").mouseleave();
                    if (e.which === 40 || e.which === 39) {
                        this._index.button = this._index.button + 1 > td.length - 1 ? 0 : this._index.button + 1;
                    }
                    else if (e.which === 38 || e.which === 37) {
                        this._index.button = this._index.button - 1 < 0 ? td.length - 1 : this._index.button - 1;
                    }
                    this._curFocus.button = td.eq(this._index.button);
                }
                else {
                    if (e.which === 40 || e.which === 39) {
                        this._curFocus.button = td.eq(1).attr("tabindex", "-1");
                    }
                    else if (e.which === 38 || e.which === 37) {
                        this._curFocus.button = td.eq(td.length - 1).attr("tabindex", "-1");
                    }
                }
                this._curFocus.button.addClass("hoverCell").mouseover().focus();
            }
            else if ((e.keyCode === 40 || e.which === 38) && this.element.find(".editorTreeView:visible").length > 0 && !ej.isNullOrUndefined(this.element.find(".e-dialog .e-text")) && $(".e-dialog .e-text").hasClass("hoverCell")) {
                this.element.find(".editorTreeView .hoverCell").removeClass("hoverCell");
                e.preventDefault();
                var td = this.element.find(".e-dialog .e-text:visible");
                if (!ej.isNullOrUndefined(this._curFocus.node)) {
                    this._curFocus.node.attr("tabindex", "0").removeClass("hoverCell");
                    if (e.which === 40) {
                        this._index.node = this._index.node + 1 > td.length - 1 ? 0 : this._index.node + 1;
                    }
                    else if (e.which === 38) {
                        this._index.node = this._index.node - 1 < 0 ? td.length - 1 : this._index.node - 1;
                    }
                    this._curFocus.node = td.eq(this._index.node).attr("tabindex", "-1");
                }
                else {
                    this._index.node = e.which == 40 ? 1 : e.which == 38 ? td.length - 1 : 0;
                    this._curFocus.node = td.eq(this._index.node).attr("tabindex", "-1");             
                }
                this._curFocus.node.focus().addClass("hoverCell");
                $(".e-node-focus").removeClass("e-node-focus");
            }
            if ((e.which === 39 || e.which === 37) && (this.element.find(".schemaFieldTree .e-text:visible").hasClass("hoverCell")) && !$(".editorTreeView:visible").length > 0) {
                    this.element.find(".schemaFieldTree .hoverCell").parent().find(".e-plus,.e-minus").click();
            }
            else if ((e.which === 39 || e.which === 37) && (this.element.find(".editorTreeView .e-text:visible").hasClass("hoverCell"))) {
                this.element.find(".editorTreeView .hoverCell").parent().find(".e-plus,.e-minus").click();
            }
            else if (e.which === 9 && this.element.find(".editorTreeView:visible").length > 0) {
                e.preventDefault();
                this.element.find(".e-dialog .hoverCell").removeClass("hoverCell");
                this._curFocus.node = null;
                this._index.node = 0;
                var focEle = [];
                focEle.push(this.element.find(".e-dialog .e-text").first());
                if (!this.element.find(".dialogOKBtn:visible").hasClass("e-disable")) {
                    focEle.push(this.element.find(".dialogOKBtn:visible"));
                }
                focEle.push(this.element.find(".dialogCancelBtn:visible"));
                focEle.push(this.element.find(".e-close:visible"));
                if (!ej.isNullOrUndefined(this._curFocus.tab)) {
                    this._curFocus.tab.attr("tabindex", "0").removeClass("hoverCell");
                    this._index.tab = this._index.tab + 1 > focEle.length - 1 ? 0 : this._index.tab + 1;
                    this._curFocus.tab = focEle[this._index.tab].attr("tabindex", "-1");
                }
                else {
                    this._index.tab = 1;
                    this._curFocus.tab = focEle[this._index.tab].attr("tabindex", "-1");
                }
                this._curFocus.tab.focus().addClass("hoverCell");
                e.stopImmediatePropagation();
            }
            if (e.which === 13 && this.element.find(".hoverCell").length > 0 && !$(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0) {
                if (this.element.find(".e-dialog:visible").length > 0) {
                    if ($(e.target).hasClass("memberCurrentPage")) {
                        ej.Pivot.editorTreeNavigatee(args, this.model.pivotControl);
                        return;
                    }
                    if (this.element.find(".e-dialog .hoverCell").parent().find(".e-chkbox-small").length > 0) {
                        this.element.find(".e-dialog .hoverCell").parent().find(".e-chkbox-small").click();
                    }
                    else {
                        this.element.find(".e-dialog .hoverCell").click();
                        this._index.tab = 0;
                        if (!ej.isNullOrUndefined(this._curFocus.tree)) {
                            this._curFocus.tree.attr("tabindex", "-1").focus().mouseover().addClass("hoverCell");
                        }
                        else if (!ej.isNullOrUndefined(this.model.pivotControl._curFocus.tab)) {
                            this.model.pivotControl._curFocus.tab.attr("tabindex", "-1").focus().mouseover().addClass("hoverCell");
                        }
                    }
                }
                else if (this.element.find(".schemaFieldTree .hoverCell").length > 0) {
                    this.element.find(".schemaFieldTree .hoverCell").parent().find(".e-chkbox-small").click();
                }
                else if ($(".pivotTree:visible,.pivotTreeContext:visible,.pivotTreeContextMenu:visible").length > 0) {
                    if (this._curFocus.button)
                        var tag = this._curFocus.button.parent().attr("tag");
                    this.model.pivotControl._curFocus.button = this.element.find("[tag='" + tag + "'] button");
                    this.model.pivotControl._curFocus.button.attr("tabindex", "-1").focus().addClass("hoverCell");
                }
                e.stopImmediatePropagation();
            }
            if (e.which === 70 && e.ctrlKey) {
                e.preventDefault();
                if (this.element.find(".treeDrop").length > 0 && this.element.find(".hoverCell").length > 0) {
                    this.element.find(".hoverCell").parent().find(".treeDrop").click();
                }
            }
            if (e.keyCode === 93) {
                e.preventDefault();
                var position = { x: $(".hoverCell").offset().left + $(".hoverCell").outerWidth(), y: $(".hoverCell").offset().top + $(".hoverCell").outerHeight() };
                $(".hoverCell").trigger({ type: 'mouseup', which: 3, clientX: position.x, clientY: position.y, pageX: position.x, pageY: position.y });
            }
            if ((((e.which === 79 || e.which === 67) && e.ctrlKey) || e.which === 27) && this.element.find(".hoverCell").length > 0) {
                if (e.keyCode == 79 && this.element.find(".e-dialog").length > 0) {
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.element.find(".dialogOKBtn:visible").click();
                    }
                }
                if (e.keyCode == 67 && this.element.find(".e-dialog").length > 0) {
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.element.find(".dialogCancelBtn:visible").click();
                    }
                }
                this._index.node = 0;             
                this.element.find(".hoverCell").removeClass("hoverCell");
                if (!ej.isNullOrUndefined(this._curFocus.tree)) {
                    this._curFocus.tree.attr("tabindex", "-1").focus().mouseover().addClass("hoverCell");
                }
                else if (!ej.isNullOrUndefined(this._curFocus.button)) {
                    this._curFocus.button.attr("tabindex", "-1").focus().mouseover().addClass("hoverCell");
                }
                else if (!ej.isNullOrUndefined(this.model.pivotControl._curFocus.tab)) {
                    this.model.pivotControl._curFocus.tab.attr("tabindex", "-1").focus().mouseover().addClass("hoverCell");
                }
            }
        },

        _getLocalizedLabels: function (property) {
            return ej.PivotSchemaDesigner.Locale[this.locale()][property] === undefined ? ej.PivotSchemaDesigner.Locale["en-US"][property] : ej.PivotSchemaDesigner.Locale[this.locale()][property];
        },

        _setTableFields: function (items) {
            if (!ej.isNullOrUndefined(items))
                this.model.pivotTableFields = items;
        },

        _setPivotRows: function (items) {
            if (!ej.isNullOrUndefined(items))
                this.model.pivotRows = items;
        },

        _setPivotColumns: function (items) {
            if (!ej.isNullOrUndefined(items))
                this.model.pivotColumns = items;
        },

        _setPivotCalculations: function (items) {
            if (!ej.isNullOrUndefined(items))
                this.model.pivotCalculations = items;
        },

        _setFilters: function (items) {
            if (!ej.isNullOrUndefined(items))
                this.model.filters = items;
        },

        _getSortedHeaders: function () {
            var labels = this.element.find(".descending").parents("label"), headers = "";
            for (var i = 0; i < labels.length; i++)
                headers += $(labels[i]).attr("for").replace("toggleBtn", "") + "##";
            return headers;
        },

        _contextOpen: function (args) {            
            if ($(args.target.parentElement).find(".measureGroupCDB").length > 0 || $(args.target.parentElement).find(".folderCDB").length > 0 || (!(this.element.parents(".e-pivotclient").length>0) && $(args.target.parentElement).find(".dimensionCDB").length > 0))
                return false;
            ej.Pivot.openPreventPanel(this);
            this._selectedMember = $(args.target);
            
            if (this.model.pivotControl.model.analysisMode==ej.Pivot.AnalysisMode.Olap) {
                var menuObj = $("#pivotTreeContext").data('ejMenu');
                if ($(args.target).parents("li:eq(0)").attr("tag").toLowerCase().indexOf("[measures]") >= 0) {
                    menuObj.disableItem(this._getLocalizedLabels("AddToFilter"));
                    menuObj.disableItem(this._getLocalizedLabels("AddToRow"));
                    menuObj.disableItem(this._getLocalizedLabels("AddToColumn"));
                    menuObj.enableItem(this._getLocalizedLabels("AddToValues"));
                }
                else {
                    menuObj.disableItem(this._getLocalizedLabels("AddToValues"));
                    $(args.target.parentElement).find(".namedSetCDB").length > 0 ? menuObj.disableItem(this._getLocalizedLabels("AddToFilter")) : menuObj.enableItem(this._getLocalizedLabels("AddToFilter"));
                    menuObj.enableItem(this._getLocalizedLabels("AddToRow"));
                    menuObj.enableItem(this._getLocalizedLabels("AddToColumn"));
                }
            }
            else if (this._dataModel == "Pivot") {
                var targetText = args.target.textContent;
                if ($(args.target).hasClass("e-text") && ($(this.element).parents(".e-pivotclient").length > 0 || $.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == targetText; }).length == 0)) {
                        var menuObj = $("#pivotTreeContext").data('ejMenu');
                        menuObj.enable();
                }
                else {
                    var menuObj = $("#pivotTreeContext").data('ejMenu');
                    menuObj.disable();
                }
            }
        },

        _nodeDrag: function (args) {
            this._isDragging = true;
            if (($(args.dragTarget.parentElement).find(".measureGroupCDB").length > 0 || $(args.dragTarget.parentElement).find(".folderCDB").length > 0 || $(args.dragTarget.parentElement).find(".dimensionCDB").length > 0) && !($(args.dragTarget.parentElement).find(".dimensionCDB").length>0 && this.model.layout==ej.PivotSchemaDesigner.Layouts.OneByOne))
                return false;
        },

        _treeContextClick: function (args) {
            if (!ej.isNullOrUndefined(this._curFocus.tree))
                this._curFocus.tree.attr("tabindex", "-1").focus().addClass("hoverCell");
            else if (!ej.isNullOrUndefined(this.model.pivotControl._curFocus.tab))
                this.model.pivotControl._curFocus.tab.attr("tabindex", "-1").focus().addClass("hoverCell");
            var droppedPosition = args.text == this._getLocalizedLabels("AddToColumn") ? this.element.find(".schemaColumn") : args.text == this._getLocalizedLabels("AddToRow") ? this.element.find(".schemaRow") : args.text == this._getLocalizedLabels("AddToValues") ? this.element.find(".schemaValue") : args.text == this._getLocalizedLabels("AddToFilter") ? this.element.find(".schemaFilter") : "";
            var params = { dropTarget: droppedPosition, droppedElement: this._selectedMember.parent().parent(), target: droppedPosition };
            this.model.pivotControl._waitingPopup.show();
            this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._nodeDropped(params) : this._clientOnNodeDropped(params);
        },

        _checkedChange: function (args) {
            var pSchemaObj = $(args.event.target).parents(".e-pivotschemadesigner").data("ejPivotSchemaDesigner");
            var deferButton = $(".btnDeferUpdate").data("ejButton");
            if (args.isChecked) {
                pSchemaObj.model.pivotControl.model.enableDeferUpdate = true;
                deferButton.enable();
            }
            else {
                pSchemaObj.model.pivotControl.model.enableDeferUpdate = false;
                if (pSchemaObj.model.pivotControl._isUpdateRequired)
                    pSchemaObj.model.pivotControl._deferUpdate();
                deferButton.disable();
            }
        },

        _sortBtnClick: function (args) {
            $(args.target).toggleClass("descending");
            if (this.model.pivotControl._dataModel != "Olap" && this.model.pivotControl._dataModel != "XMLA") {
                if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    var fieldName = $(args.target).parents(".pivotButton").attr("tag").split(":")[1];
                    var axisItems = this.model.pivotControl.model.dataSource[$(args.target).parents(".pivotButton").attr("tag").split(":")[0].toLowerCase()];
                    var items = $.grep(axisItems, function (item) { return item.fieldName == fieldName });
                    var sortOrder = args.target.className.indexOf("descending") >= 0 ? ej.PivotAnalysis.SortOrder.Descending : ej.PivotAnalysis.SortOrder.Ascending;
                    for (var i = 0; i < items.length; i++) items[i].sortOrder = sortOrder;
                    this.model.pivotControl._populatePivotGrid();
                }
                else if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    this.model.pivotControl._sortBtnClick(args);
                }
            }
        },

        _generateMembers: function (customArgs, args) {
            if (customArgs.action == "loadFieldElements") {
                this._memberCount = $(args).find("Axis:eq(0) Tuple").length;
                return;
            }
            var data = $(args).find("Axis:eq(0) Tuple"), treeViewData = [], treeNodeInfo = {};
            treeViewData.push({ id: "All", name: "All", checkedStatus: true, tag: "" });
            for (var i = 0; i < data.length; i++) {
                var memberUqName = $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[0]).text(),
                    memberName = $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[1]).text();
                treeNodeInfo = { hasChildren:  $(data[i]).find("CHILDREN_CARDINALITY").text()!="0", checkedStatus: true, id: memberUqName.replace(/\]*\]/g, '-').replace(/\[*\[/g, '-'), name: memberName, tag: memberUqName };
                treeViewData.push(treeNodeInfo);
            }
            if (!ej.isNullOrUndefined(pschemaDesignerWaitingPopup))
                pschemaDesignerWaitingPopup.hide();
            this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(treeViewData) });
        },
        _generateChildMembers: function (customArgs,args) {
            var data = $(args).find("Axis:eq(0) Tuple"), treeViewData = [];
            var pNode = this.element.find("[tag='" + customArgs.currentNode.replace(/&amp;/g, "&") + "']");
            for (var i = 0; i < data.length; i++) {
                var memberUqName = $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[0]).text();
                var memberName = $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children()).find("Caption").text();
                var treeNodeInfo = { hasChildren: $(data[i]).find("CHILDREN_CARDINALITY").text() != "0", checkedStatus: false, id: memberUqName.replace(/\]*\]/g, '-').replace(/\[*\[/g, '-'), name: memberName, tag: memberUqName }
                treeViewData.push(treeNodeInfo);
            }
            if ($(pNode).parents("li").length > 1)
                parentNode = $(pNode).parents("li").first();
            else
                parentNode = $(pNode).parents("li");
            pNode.find(".e-load").removeClass("e-load");
            $($(parentNode).find('input.nodecheckbox')[0]).ejCheckBox({ checked: false })
            $.each(pNode.find("li"), function (index, value) { value.setAttribute("tag", treeViewData[index].tag); });


            this._memberTreeObj = $(".editorTreeView").data("ejTreeView");
            this._memberTreeObj.addNode(treeViewData, $(pNode));
        },

        _sortDimensionElement: function (args) {
            ej.Pivot.closePreventPanel(this);
            this.element.find(".e-dialog, .clientDialog").remove();
                       
            if ($(args.target).find(".selectedSort").length == 0) {
                var reportItem = ej.Pivot.getReportItemByFieldName(this._selectedFieldName, this.model.pivotControl.model.dataSource).item;
                if (!ej.isNullOrUndefined(reportItem))
                    $(args.target).hasClass("descOrder") ? reportItem["sortOrder"] = ej.olap.SortOrder.Descending : reportItem["sortOrder"] = ej.olap.SortOrder.Ascending;

                if (this.model.pivotControl && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                    this.model.pivotControl.refreshControl();
                else {
                    ej.olap.base._clearDrilledCellSet();
                    ej.olap.base.getJSONData({ action: "sorting" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                }
            }
        },

        _clientOnFilterBtnClick: function (args) {
            ej.Pivot.openPreventPanel(this);
            this._waitingPopup.show();
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if ($(args.target).parents().hasClass("pivotButton") && $(args.target).parents(".pivotButton").attr("tag").indexOf(":[") >= 0 && !($(args.target).parents(".pivotButton").attr("tag").toLowerCase().indexOf("[measures]") >= 0)) {
                    this._selectedFieldName = $(args.target).parents(".pivotButton").attr("tag").split(":")[1];
                }
                else if ($(args.target).parents().attr("tag") != null && ($(args.target).parents().attr("tag").split(":")[1] == "Measures" || $(args.target).parent().attr("tag").toLowerCase().indexOf("[measures]") >= 0)) {
                    ej.Pivot.closePreventPanel(this);
                    return false;
                }
                else {
                    this._selectedLevel = $($(args.target).parents("li:eq(0)")).attr("tag");
                    this._selectedFieldName = ($(args.target).parents("li:eq(0)").children("div:eq(0)").find(".levels").length > 0) ? $($(args.target).parents("li:eq(1)")).attr("tag") : $($(args.target).parents("li:eq(0)")).attr("tag");
                }
                if (this.model.pivotControl.model.enableMemberEditorPaging) {
                    this.model.pivotControl._memberPageSettings._endPage = this.model.pivotControl.model.memberEditorPageSize;					
                    this.model.pivotControl._memberPageSettings.startPage = 0;
                    this.model.pivotControl._memberPageSettings.currentMemeberPage = 1;
				}
                if (ej.isNullOrUndefined(this._selectedFieldName) || this._selectedFieldName.toLocaleLowerCase().indexOf("measures") >= 0)
                    return false;
                var  hierarchyName = this._selectedFieldName, currentDataSrc = this.model.pivotControl.model.dataSource;
                var filteredData= $.map(this.model.pivotControl._currentReportItems, function (obj, index) {
                    if (obj["fieldName"] == hierarchyName && (ej.isNullOrUndefined(obj.dataSrc) ||(obj.dataSrc.cube == currentDataSrc.cube && obj.dataSrc.reportName == currentDataSrc.reportName))) {
                        return obj.filterItems;
                    }
                });
                if (filteredData.length > 0)
                    this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(filteredData) });
                else
                    ej.olap._mdxParser.getMembers(this.model.pivotControl.model.dataSource, this._selectedFieldName, this);
            }
            else {
                if ($(args.target).parent().hasClass("pivotButton") && $(args.target).parent().attr("tag").indexOf(":") >= 0) 
                    this._selectedFieldName = $.grep(this.model.pivotTableFields, function (item) { return item.caption == $(args.target).parent().attr("tag").split(":")[1]; })[0].name;
                else
                    this._selectedFieldName = $.grep(this.model.pivotTableFields, function (item) { return item.caption == $($(args.target).parent()).text(); })[0].name;
            }
            var pivotBtn= $(this.element.find(".pivotButton button[fieldname='" + this._selectedFieldName + "']"));
            this._dialogHead = this._selectedFieldCaption = pivotBtn.text();
            this._selectedFieldAxis = pivotBtn.parents().hasClass("schemaRow") ? "rows" : pivotBtn.parents().hasClass("schemaColumn") ? "columns" : pivotBtn.parents().hasClass("schemaValue") ? "values" : "filters";

            if ((this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)) 
                this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(this._getTreeViewData()) });
        },

        _getTreeViewData: function () {
            var axisItems = this.model.pivotControl.model.dataSource[this._selectedFieldAxis];
            var fieldName = this._selectedFieldName;
            var item = $.grep(axisItems, function (item) { return item.fieldName == fieldName; })[0];
            var members = ej.PivotAnalysis.getMembers(fieldName);
            var treeViewData = [{ id: "All", name: "All", checkedStatus: true }];
            if (item.filterItems != null && item.filterItems != undefined)
                for (var i = 0; i < members.length; i++) treeViewData.push({ id: members[i], name: members[i], checkedStatus: item.filterItems.filterType == ej.PivotAnalysis.FilterType.Include ? $.inArray(members[i].toString(), item.filterItems.values) >= 0 : $.inArray(members[i].toString(), item.filterItems.values) < 0 });
            else
                for (var i = 0; i < members.length; i++) treeViewData.push({ id: members[i], name: members[i], checkedStatus: true });
            return treeViewData;
        },
        _filterBtnClick: function (args) {
            this.model.pivotControl._editorFlag = false;
            ej.Pivot.openPreventPanel(this);
            if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                var fieldName, fieldCaption;
                if (this.model.pivotControl._dataModel == "XMLA") {
                    if ($(args.target).parents("li:eq(0)").length > 0) {
                        this._selectedLevel = $($(args.target).parents("li:eq(0)")).attr("tag");
                        fieldName = ($(args.target).parents("li:eq(0)").children("div:eq(0)").find(".levels").length > 0) ? $($(args.target).parents("li:eq(1)")).attr("tag") : $($(args.target).parents("li:eq(0)")).attr("tag");
                    }
                    else {
                        this._selectedLevel = $(args.target).parent().attr("tag").split(":")[1];
                        fieldName = $(args.target).parent().attr("tag").split(":")[1];
                    }
                }
                else
                    fieldName = $.grep(this.model.pivotTableFields, function (item) { return item.caption == $($(args.target).parent()).text(); })[0].name;
                for (var i = 0; i < this.element.find(".pivotButton").length; i++) {
                    uniqueName = $(this.element.find(".pivotButton")[i]).find("button").attr("fieldName");
                    if (uniqueName == fieldName) {
                        fieldCaption = $(this.element.find(".pivotButton")[i]).find("button").text();
                        this._selectedAxis = $(this.element.find(".pivotButton")[i]).parent()[0].className.split(" ")[0];
                        break;
                    }

                }
                this._selectedAxis = this.model.pivotControl._selectedAxis = this._selectedAxis == "schemaRow" ? "rows" : this._selectedAxis == "schemaColumn" ? "columns" : this._selectedAxis == "schemaValue" ? "values" : "filters";
                this._dialogTitle = this.model.pivotControl._dialogTitle = fieldCaption;
                this._dialogHead = this.model.pivotControl._dialogHead = fieldCaption;
                this._selectedMember = this.model.pivotControl._selectedField = fieldName;

                if (this.model.pivotControl._dataModel == "XMLA") {
                    if ($(args.target).parents("li:eq(0)").length > 0) {
                        var currentHierarchy = $(args.currentTarget).parents("li:eq(0)").attr("tag");//this._selectedMember = $(args.currentTarget.parentNode).attr("tag").split(":")[1];
                    }
                    else {
                        var currentHierarchy = $(args.target).parent().attr("tag").split(":")[1];
                    }
                    var filteredData = $.map(this.model.pivotControl._currentReportItems, function (obj, index) { if (obj["fieldName"] == currentHierarchy) return obj["filterItems"]; });
                    if (filteredData.length > 0)
                        this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(filteredData) });
                    else {
                        //if (!ej.isNullOrUndefined(pschemaDesignerWaitingPopup))
                        //    pschemaDesignerWaitingPopup.show();
                        this._selectedMember = fieldName;
                        //var reportItem = this.model.pivotControl.getReportItemByFieldName(fieldName), conStr;
                        //parsedMDX = "select {" + ((reportItem.item.length > 0 && reportItem["item"][0]["hasAllMember"]) ? fieldName + ".levels(0).members" : fieldName + ".children") + "} dimension properties CHILDREN_CARDINALITY on 0 from [" + $.trim(this.model.pivotControl.model.dataSource.cube) + "]";
                        //conStr = this.model.pivotControl._getConnectionInfo(this.model.pivotControl.model.dataSource.data);
                        //pData = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"> <Header></Header> <Body> <Execute xmlns=\"urn:schemas-microsoft-com:xml-analysis\"> <Command> <Statement> " + parsedMDX + " </Statement> </Command> <Properties> <PropertyList> <Catalog>" + this.model.pivotControl.model.dataSource.catalog + "</Catalog> <LocaleIdentifier>"+conStr.LCID+"</LocaleIdentifier></PropertyList> </Properties> </Execute> </Body> </Envelope>";
                        //this.doAjaxPost("POST", conStr.url, { XMLA: pData }, this._generateMembers, null, { action: "fetchMembers" });
                    }
                }
                else {
                    var treeViewData = this.model.pivotControl._getTreeViewData(fieldName, fieldCaption, this._selectedAxis);
                    this._fetchMemberSuccess({ EditorTreeInfo: JSON.stringify(treeViewData) });
                }
            }
            else {
                $(this._tableTreeObj.element).find("span.e-icon.treeDrop").css({ display: "none" });
                var hierarClass, selectedNd;
                if (this._dataModel == "Olap") {
                    if ($(args.target).attr("class").indexOf("filter") > -1) {
                        for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                            if ((this.model.pivotTableFields[i].tag.replace(/\[/g, "").replace(/\]/g, "").indexOf("Measures") > -1 && this.model.pivotTableFields[i].isSelected == true) || (this.model.pivotTableFields[i].isSelected == true && $(args.target.parentElement).attr("tag").split(":")[1] == this.model.pivotTableFields[i].tag.replace(/\[/g, "").replace(/\]/g, "")))
                                hierarClass = this.model.pivotTableFields[i].spriteCssClass;
                        }
                        for (var f = 0; f < this._tableTreeObj.element.find("li").length; f++) {
                            if ($($(args.target).parent()).attr("tag").split(":")[1] == $(this._tableTreeObj.element.find("li")[f]).attr("tag").replace(/\]/g, '').replace(/\[/g, ''))
                                selectedNd = $(this._tableTreeObj.element.find("li")[f]);
                        }
                    }
                    else
                        hierarClass = $(args.target).parent().find("a>span").attr("class");
                    if (!($(args.target).attr("class").indexOf("filter") > -1)) {
                        if (hierarClass.indexOf("hierarchyCDB") > -1 || hierarClass.indexOf("attributeCDB") > -1) {
                            selectedNd = $(args.target).parents("li")[0];
                        }
                        else {
                            selectedNd = $(args.target).parents("li")[1];
                        }
                    }
                }
                else
                    if (!($(args.target).attr("class").indexOf("filter") > -1))
                        selectedNd = $($(args.target).parent()).parent();
                    else
                        selectedNd = this._tableTreeObj.element.find("li:contains('" + $($(args.target).parent()).attr("tag").split(":")[1] + "')");
                this._selectedTreeNode = selectedNd;
                if (args.target.tagName.toLowerCase() == "span" || args.target.tagName.toLowerCase() == "button") {
                    this.model.layout != "excel" && $(args.target).attr("class").indexOf("filter") > -1 ? this._curFilteredText = $($(args.target).parents(".pivotButton")).attr("tag").split(":")[1].replace(/\]/g, '').replace(/\[/g, '') : this._curFilteredText = this._dataModel == "Olap" ? $(selectedNd).attr("tag").replace(/\]/g, '').replace(/\[/g, '') : $(selectedNd).find("div:first").text();
                    if ($(this.element).parents(".e-pivotclient").length > 0 && $(selectedNd)[0].className.split(" ")[0] != "schemaFilter") this._curFilteredText = $($(args.target).parents(".pivotButton")).attr("tag").split(":")[1].replace(/\]/g, '').replace(/\[/g, '');
                    if ($(args.target).parents("li:eq(1)").find("div:first>a>span").hasClass("hierarchyCDB")) {
                        this._curFilteredText = $(args.target).parents("li:eq(1)").find("div:first>a").text();
                    }
                    if (this._dataModel == "Pivot") {
                        // this._curFilteredAxis = !ej.isNullOrUndefined(this.element.find(".e-btn[fieldName='" + this._curFilteredText + "']").parents(".e-droppable")[0]) ? this.element.find(".e-btn[fieldName='" + this._curFilteredText + "']").parents(".e-droppable")[0].className.split(" ")[0] : "";
                        if ($(this.element).parents(".e-pivotclient").length > 0)
                            this._curFilteredAxis = $(selectedNd)[0].className.split(" ")[0];
                        else
                            this._curFilteredAxis = !ej.isNullOrUndefined(this.element.find(".e-btn:contains('" + ($(this.element).parents(".e-pivotclient").length > 0 ? $(selectedNd).text() : $(selectedNd).find("div:first").text()) + "')").parents(".e-droppable")[0]) ? this.element.find(".e-btn:contains('" + $(selectedNd).find("div:first").text() + "')").parents(".e-droppable")[0].className.split(" ")[0] : "";
                        this._dialogHead = $(args.target).parent().text();
                    }
                    this._dialogTitle = this._dataModel == "Olap" ? $(this.element.find(".pivotButton:contains('" + $(selectedNd).find("div:first").text() + "')")[0]).attr("tag") : $(args.target).parents("li").length > 0 ? $(args.target).parents("li").attr("id") || args.target.id.replace("filterBtn", "") || $(args.target).parents(".filterBtn")[0].id.replace("filterBtn", "") : $(args.target).parent().attr("tag").split(":")[1] || args.target.id.replace("filterBtn", "") || $(args.target).parents(".filterBtn")[0].id.replace("filterBtn", "");
                    if ($(this.element).parents(".e-pivotclient").length > 0 && $(selectedNd)[0].className.split(" ")[0] == "schemaFilter" && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                        this._dialogTitle = this._dialogHead;
                    if (this._dataModel == "Olap")
                        for (var btnCount = 0 ; btnCount < this.element.find(".e-btn").length; btnCount++) {
                            if (!ej.isNullOrUndefined($($($(this.element.find(".e-btn"))[btnCount]).parent()[0]).attr("tag")) && $($($(this.element.find(".e-btn"))[btnCount]).parent()[0]).attr("tag").split(":")[1] == $(this._selectedTreeNode).attr("tag").replace(/\]/g, '').replace(/\[/g, '') && $($($(this.element.find(".e-btn"))[btnCount]).parent()[0]).attr("tag").indexOf(this._curFilteredText) > -1) {
                                this._curFilteredAxis = !ej.isNullOrUndefined($($(this.element.find(".e-btn"))[0]).parents(".e-droppable")[0]) ? $($(this.element.find(".e-btn"))[0]).parents(".e-droppable")[0].className.split(" ")[0] : "";
                                this._dialogTitle = $($($(this.element.find(".e-btn"))[btnCount]).parent()[0]).attr("tag");
                                this._dialogHead = $($($(this.element.find(".e-btn"))[btnCount]).parent()[0]).text();
                                break;
                            }
                        }
                    var report;
                    try {
                        report = JSON.parse(this.model.pivotControl.getOlapReport()).Report;
                    }
                    catch (err) {
                        if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                            report = this.model.pivotControl.getOlapReport();
                    }
                    sortedHeaders = this._getSortedHeaders();
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "fetchMembers", element: this.element, customObject: this.model.pivotControl.model.customObject });                    
                    var eventArgs = JSON.stringify({ "action": "fetchMembers", "headerTag": (this._dialogTitle + (this.model.pivotControl.model.enableAdvancedFilter? "##true" :"")) || "UniqueName##" + $(selectedNd).attr("tag"), "sortedHeaders": this.model.pivotControl._ascdes, "currentReport": report, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    this.model.pivotControl._waitingPopup.show();
                    this.element.find(".schemaNoClick").addClass("freeze").width($(this.element).width()).height($(this.element).height()).css({ "top": $(this.element).offset().top, "left": $(this.element).offset().left });
                    this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.fetchMembers, eventArgs, this._fetchMemberSuccess);
                }
            }
        },

        _removeBtnClick: function (args) {
            this.model.pivotControl._waitingPopup.show();
            if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                var currentFieldName = $(args.target).parent().attr("tag").split(":")[1];
                ej.Pivot.removeReportItem(this.model.pivotControl.model.dataSource, currentFieldName, (currentFieldName.toLocaleLowerCase().indexOf("measures") == 0));
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                    ej.olap.base.clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "nodeDropped" }, this.model.pivotControl)
                if (this.model.pivotControl.element.hasClass("e-pivotclient") && this.model.pivotControl._pivotChart)
                    this.model.pivotControl._pivotChart._labelCurrentTags = {};
                this._refreshPivotButtons();
                this.model.pivotControl.refreshControl();
                $(args.target).parent().remove();
            }
            else {
                var headerText = $(args.target.parentElement).text(), headerTag,
                selectedTreeNode = $($(this._tableTreeObj.element).find("div:contains(" + headerText + ")>span")[1]).find(".e-chk-act");

                $(selectedTreeNode).removeClass("e-chk-act").addClass("e-chk-inact");
                $(selectedTreeNode).children("e-checkmark").removeClass("e-checkmark");
                for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                    if (this.model.pivotTableFields[i].FieldHeader == headerText) {
                        this.model.pivotTableFields[i].IsSelected = false;
                        headerTag = this.model.pivotTableFields[i];
                    }
                }
                $(args.target.parentElement).remove();
                if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._trigger("beforeServiceInvoke", { action: "nodeStateModified", element: this.element, customObject: this.model.pivotControl.model.customObject });
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && $(this.element).parents(".e-pivotclient").length > 0) {
                    var report;
                    try { report = JSON.parse(this.model.pivotControl.getOlapReport()).Report; }
                    catch (err) {
                        if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                            report = this.model.pivotControl.getOlapReport();
                    }
                    var eventArgs = JSON.stringify({ "action": "removeButton", "args": JSON.stringify({ "headerTag": headerText, "currentReport": report }), "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._droppedSuccess);
                }
                else {
                    var eventArgs = JSON.stringify({ "action": "nodeStateModified", "headerTag": JSON.stringify(headerTag), "sortedHeaders": this._getSortedHeaders(), "currentReport": this.model.pivotControl.getOlapReport(), "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeStateModified, eventArgs, this._nodeStateModifiedSuccess);
                }
            }
        },

        _nodeCheckChanges: function (args) {
            this._isFiltered = true;
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
        _pivotCheckedStateModified: function (args) {
            if (this._nodeCheck == true) {
                this._nodeCheck = false;
                return false;
            }
            var headerName = this.model.pivotControl._dataModel == "XMLA" ? $(args.currentElement).attr("tag") : this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? $.grep(this.model.pivotTableFields, function (item) { return item.caption == $(args.currentElement).find("a")[0].textContent; })[0].name : $(args.currentElement).find("a")[0].textContent,
			headerCaption = $(args.currentElement).find("a")[0].textContent, filterTag = "", filterItems = "", selectedElement = "", headerTag = "", uniqueName = "", report = "", isClientMode = this.model.pivotControl._dataModel == "XMLA" ? "XMLA" : "";
            var selectedElement = new Array();
            for (var i = 0; i < this.element.find(".pivotButton").length; i++) {
                uniqueName = $(this.element.find(".pivotButton")[i]).find("button").attr("fieldName");
                if (uniqueName == headerName) {
                    selectedElement.push(this.element.find(".pivotButton")[i]);
                    if (isClientMode == "XMLA")
                        break;
                }
            }
            for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                if (this.model.pivotTableFields[i].name == headerName && args.type == "nodeCheck") {
                    this.model.pivotTableFields[i].isSelected = true;
                    headerTag = this.model.pivotTableFields[i];
                }
                else if (this.model.pivotTableFields[i].name == headerName && args.type == "nodeUncheck") {
                    this.model.pivotTableFields[i].isSelected = false;
                    headerTag = this.model.pivotTableFields[i];
                }
            }
            if (args.type == "nodeUncheck") {
                if (selectedElement.length > 1)
                    for (var i = 0; i < selectedElement.length; i++) {
                        if ($(selectedElement[i]).find('button').attr('fieldName') == headerName)
                            $(selectedElement[i]).remove();
                    }
                else
                    $(selectedElement).remove();
            }
            try {
                report = JSON.parse(this.model.pivotControl.getOlapReport()).Report;
            }
            catch (err) {
                if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                    report = this.model.pivotControl.getOlapReport();
            }
            if (isClientMode == "XMLA"&&report == "") {
                report = this.model.pivotControl.model.dataSource;
                this._selectedMember = headerName;
                this._selectedTreeNode = $(args.currentElement);
                this.model.pivotControl.dataSource = this.model.pivotControl._clearDrilledItems(this.model.pivotControl.model.dataSource, {action:"nodeStateModefied"});
            }
            var dropAxis = this._droppedClass != "" ? this._droppedClass : headerTag.pivotType != undefined ? headerTag.pivotType == "PivotItem" ? "schemaRow" : "schemaValue" : "schemaRow", eventArgs, axisName, params;
            this._droppedClass = "";

            if (args.type == "nodeCheck") {
                if (isClientMode == "XMLA") {
                    headerCaption = $(args.currentElement).find(".kpi").length > 0 ? $(args.currentElement).parents("li:eq(0)").children("div").text() + " " + headerCaption : headerCaption;
                    var liElement = this.model.pivotControl.model.dataSource.enableAdvancedFilter ? $(args.currentElement.find(".e-text")) : $(args.currentElement.find(".e-text")[0]);
                    (($(args.currentElement).attr("tag").toLowerCase().indexOf("[measures]") < 0) && !($(args.currentElement).find(".namedSetCDB").length > 0)) ? liElement.after(ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML) : "";
                    if ($(args.currentElement).attr("tag").toLocaleLowerCase().indexOf("[measures]") >= 0)
                        dropAxis = "schemaValue";
                    droppedItem = $(args.currentElement).find(".namedSetCDB").length > 0 ? { fieldName: $(args.currentElement).attr("tag"), fieldCaption: $(args.currentElement).text(), isNamedSets: true } : ej.olap.base._getCaption({ fieldName: headerName, fieldCaption: headerCaption }, this.model.pivotControl._fieldData.hierarchy);
                }
                else {
                $(args.currentElement.find(".e-text")[0]).after(ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML);
                droppedItem = { fieldName: headerName, fieldCaption: headerCaption };
                }
                dropAxis = dropAxis == "" ? "row" : dropAxis == "schemaColumn" ? "column" : dropAxis == "schemaRow" ? "row" : dropAxis == "schemaValue" ? "value" : dropAxis == "schemaFilter" ? "filter" : "";

                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    var dropItem = $.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == headerName; });
                    if (dropItem.length > 0) {
                        if (this._calculatedFieldItems(dropItem))
                            return;
                        dropAxis = "value";
                        droppedItem = { fieldName: headerName, fieldCaption: headerCaption, isCalculatedField: true, formula: dropItem[0].formula };
                    }
                }

                this._createPivotButton(droppedItem, dropAxis, "", "", "");

                if (isClientMode == "XMLA" && dropAxis == "value") {
                    if (this.model.pivotControl.model.dataSource.values.length == 0) {
                        this.model.pivotControl.model.dataSource.values.push(({ measures: [], axis: "columns" }))
                    }
                    measuresAxis = this.model.pivotControl.model.dataSource.values[0]["axis"] == "columns" ? "Columns:" : "Rows:";
                    if ((this.element.find("div[tag='" + measuresAxis + "Measures" + "']").length == 0))
                        this._createPivotButton({ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }, measuresAxis == "Columns:" ? "column" : "row", "", "", "");
                    this.model.pivotControl.model.dataSource.values[0]["measures"].push(droppedItem)
                }
                else {
                if ($.grep(this.model.pivotControl.model.dataSource.values, function (value) { return value.fieldName == droppedItem.fieldName; }).length == 0)
                    dropAxis == "row" ? this.model.pivotControl.model.dataSource.rows.push(droppedItem) : dropAxis == "column" ? this.model.pivotControl.model.dataSource.columns.push(droppedItem) : dropAxis == "filter" ? this.model.pivotControl.model.dataSource.filters.push(droppedItem) : this.model.pivotControl.model.dataSource.values.push(droppedItem);
                }
                if (isClientMode == "XMLA") {
                    if (!ej.isNullOrUndefined(this.model.pivotControl._ogridWaitingPopup))
                        this.model.pivotControl._ogridWaitingPopup.show();
                    ej.olap.base.getJSONData({ action: "nodeCheck" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                }
                else{
                this._trigger("fieldItemDropped", { axis: dropAxis, fieldItem: args.currentElement });
                this.model.pivotControl.model.editCellsInfo = {};
                this.model.pivotControl._populatePivotGrid();
            }
            }
            else if (args.type == "nodeUncheck") {
                $(args.currentElement).removeClass("filter").find(".filter").remove();
                $(args.currentElement).removeClass("filter").find(".treeDrop").remove();
                this.model.pivotControl.model.dataSource.columns = $.grep(this.model.pivotControl.model.dataSource.columns, function (value) { return value.fieldName != headerName; });
                this.model.pivotControl.model.dataSource.rows = $.grep(this.model.pivotControl.model.dataSource.rows, function (value) { return value.fieldName != headerName; });
                var valueElements = this.model.pivotControl.model.dataSource.values;
                if (isClientMode == "XMLA") {
                    if ((ej.olap._mdxParser._getItemPosition(this.model.pivotControl.model.dataSource.values[0]["measures"], headerName)).length > 0)
                        this.model.pivotControl.model.dataSource.values[0]["measures"].splice(ej.olap._mdxParser._getItemPosition(this.model.pivotControl.model.dataSource.values[0]["measures"], headerName)[0], 1);
                    if (this.model.pivotControl.model.dataSource.values[0]["measures"].length == 0)
                        this.element.find("div[tag='" + (this.model.pivotControl.model.dataSource.values[0]["axis"] == "columns" ? "Columns" : "Rows") + ":Measures" + "']").remove();
                }
                else {
                this.model.pivotControl.model.dataSource.values = $.grep(valueElements, function (value) { return value.fieldName != headerName; });
                if (this.model.pivotControl._calculatedField.length > 0) {
                    var removeElement = $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return value.isCalculatedField == true && value.formula.indexOf(headerName) > -1; });
                    for (var i = 0; i < removeElement.length; i++)
                        this._tableTreeObj.uncheckNode(removeElement[i].fieldName);
                }
                }
                this.model.pivotControl.model.dataSource.filters = $.grep(this.model.pivotControl.model.dataSource.filters, function (value) { return value.fieldName != headerName; });

                if (isClientMode == "XMLA") {
                    if (!ej.isNullOrUndefined(this.model.pivotControl._ogridWaitingPopup))
                        this.model.pivotControl._ogridWaitingPopup.show();
                    ej.olap.base.getJSONData({ action: "nodeUncheck" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                }
                else {
                dropAxis = dropAxis == "" ? "row" : dropAxis == "schemaColumn" ? "column" : dropAxis == "schemaRow" ? "row" : dropAxis == "schemaValue" ? "value" : dropAxis == "schemaFilter" ? "filter" : "";
                this._trigger("fieldItemDropped", { axis: dropAxis, fieldItem: args.currentElement });
                this.model.pivotControl.model.editCellsInfo = {};
                this.model.pivotControl._populatePivotGrid();
            }
            }
            this._setPivotBtnWidth();
        },

        _calculatedFieldItems: function (dropItem) {
            if (dropItem.length > 0) {
                var items = dropItem[0].formula.replace(/\(|\)/g, " ").replace(/[-+*/^%]/g, " ").split(" ");
                for (var k = 0; k < items.length; k++) {
                    if (!$.isNumeric(items[k]) && items[k].replace(/\s+|\s+$/gm, "") != "")
                        if ((this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return value.fieldName == items[k] }).length == 0) || (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && $.grep(JSON.parse(this.model.pivotControl.getOlapReport()).PivotCalculations, function (value) { return value.FieldName == items[k] }).length == 0)) {
                            alert(this.model.pivotControl._getLocalizedLabels("NotPresent"));
                            this._tableTreeObj.model.nodeCheck = null;
                            this._tableTreeObj.model.nodeUncheck = null;
                            this._tableTreeObj.uncheckNode(dropItem[0].name);
                            this._tableTreeObj.model.nodeCheck = this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? ej.proxy(this._checkedStateModified, this) : ej.proxy(this._pivotCheckedStateModified, this);
                            this._tableTreeObj.model.nodeUncheck = this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? ej.proxy(this._checkedStateModified, this) : ej.proxy(this._pivotCheckedStateModified, this);
                            return true;
                        }
                }
            }
            return false;
        },

        _checkedStateModified: function (args) {
            this.model.pivotControl._isUpdateRequired = true;
                if (this._isMeasureBtnRemove == true) {
                this._isMeasureBtnRemove = false;
                return false;
                }
                if(this._nodeCheck == true){
                this._nodeCheck = false;
                return false;
                }
                var headerText = $(args.currentElement).find("a")[0].textContent, filterTag = "", filterItems = "", selectedElement = "", headerTag = "", uniqueName = "";
                if (this._dataModel == "Pivot" && args.type == "nodeCheck") {
                    var dropItem = $.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == $(args.currentElement).attr("id"); });
                    if (this._calculatedFieldItems(dropItem))
                        return;
                }
            if (this._dataModel == "Olap") {
                if (!args.currentElement[0].id.indexOf("[Measures]") > -1)
                    for (var i = 0; i < this.element.find(".pivotButton").length; i++) {
                        headerTag = $(this.element.find(".pivotButton")[i]).attr("tag"); uniqueName = "";
                        uniqueName = ((headerTag.indexOf("[Measures]") > -1) || (headerTag.indexOf("[") > -1)) ? headerTag.split(":")[1] : this.model.pivotControl._getNodeUniqueName(headerTag);
                        uniqueName = uniqueName.replace("<>", ".");
                        if ($(args.currentElement).attr("tag").toLowerCase() == uniqueName.toLowerCase()) {
                            selectedElement = $(this.element.find(".pivotButton")[i]);
                            break;
                        }
                    }
                else
                    selectedElement = this.element.find(".pivotButton:contains(" + headerText + ")"), headerTag, report;
            }
            else
                selectedElement = this.element.find(".pivotButton:contains(" + headerText + ")"), headerTag, report;
            var isFiltered = selectedElement.length > 0 && $(selectedElement).siblings(".filterIndicator").length > 0 ? true : false,
            isSorted = args.currentElement.find("~ span:eq(0) span.descending").length > 0 ? true : false;
            for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                if (this.model.pivotTableFields[i].name == headerText && args.type == "nodeCheck") {
                    this.model.pivotTableFields[i].isSelected = true;
                    headerTag = this.model.pivotTableFields[i];
                }
                else if (this.model.pivotTableFields[i].name == headerText && args.type == "nodeUncheck") {
                    this.model.pivotTableFields[i].isSelected = false;
                    headerTag = this.model.pivotTableFields[i];
                }
            }
            if (ej.isNullOrUndefined(headerTag))
                headerTag = $(args.currentElement).attr("tag");

            if (args.type == "nodeUncheck") {
                if (selectedElement.length > 1)
                    for (var i = 0; i < selectedElement.length; i++) {
                        if ($(selectedElement[i]).text() == headerText)
                            $(selectedElement[i]).remove();
                    }
                else
                    $(selectedElement).remove();
            }
            else {
                if (this._droppedClass != "")
                    this._createPivotButton(headerText, this._droppedClass == "schemaColumn" ? "column" : this._droppedClass == "schemaRow" ? "row" : this._droppedClass == "schemaValue" ? "value" : this._droppedClass == "schemaFilter" ? "filter" : "", isFiltered, isSorted, "");
                else
                    this._createPivotButton(headerText, ((this._dataModel == "Olap" && $(args.currentElement).attr("tag").indexOf("[Measures]") < 0) || (this._dataModel == "Pivot" && headerTag.pivotType == "PivotItem")) ? "row" : "value", isFiltered, isSorted, "");
            }
            if (!ej.isNullOrUndefined(this._tempFilterData)) {
                for (var i = 0; i < this._tempFilterData.length; i++) {
                    if (!ej.isNullOrUndefined(this._tempFilterData[i][headerText])) {
                        for (var j = 0; j < this._tempFilterData[i][headerText].length; j++)
                            filterItems += "##" + this._tempFilterData[i][headerText][j];
                    }
                }
            }
            try {
                report = JSON.parse(this.model.pivotControl.getOlapReport()).Report;
            }
            catch (err) {
                if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                report = this.model.pivotControl.getOlapReport();
            }
            filterTag = "schemaRow::" + headerText + "::FILTERED" + filterItems;
            var dropAxis = this._droppedClass != "" ? this._droppedClass : headerTag.pivotType == "PivotItem" ? "schemaRow" : "schemaValue", eventArgs, axisName, params;
            this._droppedClass = "";
            if (!this.model.pivotControl.model.enableDeferUpdate && !ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                this.model.pivotControl._waitingPopup.show();
            this.element.find(".schemaNoClick").addClass("freeze").width($(this.element).width()).height($(this.element).height()).css({ "top": $(this.element).offset().top, "left": $(this.element).offset().left });
            if (!(args.type == "nodeCheck") && !(args.type == "nodeUncheck") && dropAxis != "") {
                if (this._dataModel == "Pivote") {
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "nodeStateModified", element: this.element, customObject: this.model.pivotControl.model.customObject });
                    eventArgs = JSON.stringify({ "action": "nodeStateModified", "headerTag": JSON.stringify(headerTag), "dropAxis": dropAxis + "::" + this._droppedPosition, "sortedHeaders": this.model.pivotControl._ascdes, "filterParams": filterTag, "currentReport": report, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    this._droppedPosition = "";
                    if (!this.model.pivotControl.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeStateModified, eventArgs, this._nodeStateModifiedSuccess);
                    else {
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeStateModified, eventArgs.replace("nodeStateModified", "nodeStateModifiedDeferUpdate"), this._nodeStateModifiedSuccess);
                    }
                }
                else {
                    if ($(args.currentElement).attr("tag").toLowerCase().indexOf("[measures]") == -1) {
                        var dropSpan = ej.buildTag("span.e-icon").attr("role", "button").attr("aria-label", "filter button").addClass("treeDrop")[0].outerHTML;
                        $(args.currentElement.find(".e-text")[0]).after($(dropSpan).hide());
                    }
                    headerTag = $(args.currentElement).attr("tag");
                    axisName = this._nodeDropedParams == "" ? ($(args.currentElement).attr("tag").toLowerCase().indexOf("[Measures]") >= 0 ? "Categorical" : "Series") : this._nodeDropedParams;
                    params = this._currentCubeName + "--" + headerTag + "--" + axisName + "--", report;
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.pivotControl.model.customObject });
                    eventArgs = JSON.stringify({ "action": "nodeDropped", "dropType": "TreeNode", "nodeInfo": params, "currentReport": report, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    if (!this.model.pivotControl.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._droppedSuccess);
                    else {
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._droppedSuccess);
                    }
                }
            }
            else if (args.type == "nodeCheck") {
                if (this._dataModel == "Olap") {
                    if ($(args.currentElement).attr("tag").indexOf("[Measures]") == -1) {
                        var dropSpan = ej.buildTag("span.e-icon").attr("role", "button").attr("aria-label", "filter button").addClass("treeDrop")[0].outerHTML;
                        $(args.currentElement.find(".e-text")[0]).after($(dropSpan).hide());
                    }
                    this._nodeDropedParams = dropAxis == "schemaColumn" ? "Categorical" : dropAxis == "schemaRow" ? "Series" : dropAxis == "schemaFilter" ? "Slicer" : "";
                    headerTag = $(args.currentElement).attr("tag");
                    axisName = this._nodeDropedParams == "" ? ($(args.currentElement).attr("tag").indexOf("[Measures]") >= 0 ? "Categorical" : "Series") : this._nodeDropedParams;
                    if (headerTag.toLowerCase().indexOf("[measures]") > -1)
                        axisName = "Categorical";
                    params = this._currentCubeName + "--" + headerTag + "--" + axisName + "--", report;
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.pivotControl.model.customObject });
                    eventArgs = JSON.stringify({ "action": "nodeDropped", "dropType": "TreeNode", "nodeInfo": params, "currentReport": report, "gridLayout": this.model.pivotControl.model.layout, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    if (!this.model.pivotControl.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._droppedSuccess);
                    else {
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._droppedSuccess);
                    }
                }
                else {
                    $(args.currentElement.find(".e-text")[0]).after($(ej.buildTag("span.e-icon").attr("role", "button").attr("aria-label", "filter button").addClass("treeDrop")[0].outerHTML).hide());
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "nodeStateModified", element: this.element, customObject: this.model.pivotControl.model.customObject });
                    eventArgs = JSON.stringify({ "action": "nodeStateModified", "headerTag": JSON.stringify(headerTag), "dropAxis": dropAxis + "::", "sortedHeaders": this.model.pivotControl._ascdes, "filterParams": filterTag, "currentReport": report, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    if (!this.model.pivotControl.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeStateModified, eventArgs, this._nodeStateModifiedSuccess);
                    else {
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeStateModified, eventArgs.replace("nodeStateModified", "nodeStateModifiedDeferUpdate"), this._nodeStateModifiedSuccess);
                        if (!ej.isNullOrUndefined(this.model.pivotControl._ogridWaitingPopup))
                            this.model.pivotControl._ogridWaitingPopup.hide();
                    }
                }
            }
            else if (args.type == "nodeUncheck") {
                if (this._dataModel == "Olap") {
                    $(args.currentElement.find(".treeDrop")).remove();
                   // $(args.currentElement.find(".e-icon:not(.e-chk-image, .e-plus,.e-minus)")).remove();
                    $(args.currentElement).find(".filter").removeClass("filter");
                    var headerTag = $(selectedElement).attr("tag"), report, eventArgs;
                    delete this.model.pivotControl._fieldMembers[headerTag.split(':')[headerTag.split(':').length - 1]];
                    delete this.model.pivotControl._fieldSelectedMembers[headerTag.split(':')[headerTag.split(':').length - 1]];
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "removeButton", element: this.element, customObject: this.model.pivotControl.model.customObject });
                    eventArgs = JSON.stringify({ "action": "removeButton", "headerInfo": headerTag, "currentReport": report, "gridLayout": this.model.pivotControl.model.layout, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    if (ej.isNullOrUndefined(headerTag))
                        return false;
                    if ((headerTag.indexOf("[Measures]") >= 0 || headerTag.toLowerCase().indexOf("[measures]")) && this.element.find(".schemaValue .pivotButton").length == 0) {
                        var tmp = headerTag.split(":"),
                        tempAxis = tmp[0] == "Rows" ? ".schemaRow" : tmp[0] == "Columns" ? ".schemaColumn" : "";
                        this.element.find(tempAxis + " .pivotButton:contains('Measures')").remove();
                    }
                    else if (headerTag.indexOf("[Measures]") < 0 && headerTag.indexOf("Measures") >= 0)
                        this.element.find(".schemaValue .pivotButton").remove();
                    if (!this.model.pivotControl.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.removeButton, eventArgs, this._pvtBtnDroppedSuccess)
                    else {
                        this._removeButtonDeferUpdate = true;
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.removeButton, eventArgs.replace("removeButton", "removeButtonDeferUpdate"), this._droppedSuccess)
                    }
                }
                else {
                    if (!ej.isNullOrUndefined(this._tempFilterData)) {
                        for (var i = 0; i < this._tempFilterData.length; i++) {
                            for (var key in this._tempFilterData[i]) {
                                if (key == headerText) {
                                    this._tempFilterData[i][headerText] = [];
                                }
                            }
                        }
                    }
                    if (!ej.isNullOrUndefined(this.model.pivotControl._tempFilterData)) {
                        for (var i = 0; i < this.model.pivotControl._tempFilterData.length; i++) {
                            for (var key in this.model.pivotControl._tempFilterData[i]) {
                                if (key == headerTag.id) {
                                    this.model.pivotControl._tempFilterData[i][headerTag.id] = [];
                                }
                            }
                        }
                    }
                    if (this.model.pivotControl._calculatedField.length > 0) {
                        var removeElement = $.grep(JSON.parse(this.model.pivotControl.getOlapReport()).PivotCalculations, function (value) { return value.CalculationType == 8 && value.Formula.indexOf(headerTag["id"]) > -1; })
                        for (var i = 0; i < removeElement.length; i++) {
                            this._tableTreeObj.model.nodeUncheck = null;
                            this._tableTreeObj.uncheckNode(removeElement[i].FieldName);
                            this._tableTreeObj.element.find("li[id='" + removeElement[i].FieldName + "']").removeClass("filter").find(".treeDrop").remove()
                            this._tableTreeObj.model.nodeUncheck = ej.proxy(this._checkedStateModified, this);
                        }
                    }
                    delete this.model.pivotControl._fieldMembers[headerTag.name];
                    $(args.currentElement).removeClass("filter").find(".filter").remove();
                    $(args.currentElement).removeClass("filter").find(".treeDrop").remove();
                    this.model.pivotControl._ascdes = this.model.pivotControl._ascdes.replace(headerText + "##", "");
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "nodeStateModified", element: this.element, customObject: this.model.pivotControl.model.customObject });
                    eventArgs = JSON.stringify({ "action": "nodeStateModified", "headerTag": JSON.stringify(headerTag), "dropAxis": dropAxis + "::", "sortedHeaders": this.model.pivotControl._ascdes, "filterParams": filterTag, "currentReport": report, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    if (!this.model.pivotControl.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeStateModified, eventArgs, this._nodeStateModifiedSuccess);
                    else {
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeStateModified, eventArgs.replace("nodeStateModified", "nodeStateModifiedDeferUpdate"), this._nodeStateModifiedSuccess);
                        if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                            this.model.pivotControl._waitingPopup.hide();
                    }
                }
            }
            this._setPivotBtnWidth();
        },

        _nodeDropped: function (args) {
            if ($(args.dropTarget).hasClass("pvtBtn"))
                args.dropTarget = $(args.dropTarget).parents('div.e-droppable').length > 0 && $(args.dropTarget).parents('.e-pivotschemadesigner').length > 0 ? $(args.dropTarget).parents('div.e-droppable') : args.dropTarget;
            if ($(this.element).parents(".e-pivotclient").length > 0 && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var headerTag = "";
                var headerText = (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.pivotControl._dataModel != "XMLA") ? $.grep(this.model.pivotTableFields, function (item) { return item.caption == args.droppedElement.text() })[0].name : (this._dataModel == "XMLA") ? args.droppedElement.attr("tag") : args.droppedElement.text();
                var headerName = $(args.droppedElement).attr("id");
                var droppedAxis = args.dropTarget.hasClass("schemaColumn") ? "schemaColumn" : args.dropTarget.hasClass("schemaRow") ? "schemaRow" : args.dropTarget.hasClass("schemaFilter") ? "schemaFilter" : args.dropTarget.hasClass("schemaValue") ? "schemaValue" : "";
                if (droppedAxis == "")
                    return false;
                var droppedPosition = this._setSplitBtnTargetPos(!ej.isNullOrUndefined(args.event) ? args.event : args);

                try { report = JSON.parse(this.model.pivotControl.getOlapReport()).Report; }
                catch (err) { report = this.model.pivotControl.getOlapReport(); }
                if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                    this.model.pivotControl._waitingPopup.show();
                for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                    if (this.model.pivotTableFields[i].name == headerText) {
                        this.model.pivotTableFields[i].isSelected = true;
                        headerTag = this.model.pivotTableFields[i];
                        break;
                    }
                }
                var eventArgs = JSON.stringify({ "action": this.model.pivotControl.model.enableDeferUpdate ? "nodeDroppedDeferUpdate" : "nodeDropped", "args": JSON.stringify({ "droppedFieldCaption": headerText, "droppedFieldName": headerName, "headerTag": headerTag, "dropAxis": droppedAxis, "droppedPosition": droppedPosition, "currentReport": report }), "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._pvtNodeDroppedSuccess);
                return;
            }
            this.model.pivotControl._isUpdateRequired = true;
            if (args.dropTarget[0] == undefined && args.dropTarget.className == undefined)
                return;
            var pivotDrop = false;
            if (this._dataModel == "Pivot") {
                var buttonDrag = $(args.dropTarget).parents();
                for (var i = 0; i < buttonDrag.length; i++) {
                    if ($(buttonDrag[i]).hasClass("e-pivotgrid"))
                        pivotDrop = true;
                }
            }
            if (args.dropTarget.hasClass("e-droppable") || (args.dropTarget[0] != undefined && args.dropTarget[0].className.indexOf("e-droppable") >= 0) || (args.dropTarget.className != undefined && args.dropTarget.className.indexOf("e-droppable") >= 0) || pivotDrop) {
                this._isDragging = false;
                this.element.find(".dropIndicator").removeClass("dropIndicatorHover");
                var headerTag = $(args.droppedElement).attr("tag"),
                    headerText = (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && this.model.pivotControl._dataModel != "XMLA") ? $.grep(this.model.pivotTableFields, function (item) { return item.caption == args.droppedElement.text() })[0].name : (this._dataModel == "XMLA") ? args.droppedElement.attr("tag") : args.droppedElement.text(),
                    filterTag, filterItems = "", report,
                    selectedPvtBtn = this.element.find(".pivotButton:contains(" + headerText + ")"),
                    selectedTreeNode = (this._dataModel == "XMLA") ? (this._tableTreeObj.element.find("li[tag='" + headerTag + "']").length > 1 ? args.droppedElement : this._tableTreeObj.element.find("li[tag='" + headerTag + "']")) : this._dataModel == "Pivot" && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? this._tableTreeObj.element.find("li[id=" + headerText + "]") : this._dataModel == "Pivot" ? this._tableTreeObj.element.find("li:contains('" + headerText + "'):last") : this._tableTreeObj.element.find("li[tag='" + headerTag + "']"),
                    isFiltered = $(selectedPvtBtn).find(".filterIndicator").length > 0 ? true : false,
                    isSorted = $(selectedPvtBtn).find("~ span:eq(0) span.descending").length > 0 ? true : false;
                if (args.dropTarget.parent().attr("role") == "presentation")
                    return false;
                if (this.model.pivotControl._dataModel == "XMLA") {
                    var _tag = $.map($(headerTag.split('].')), function (a) { var name = a.lastIndexOf("]") >= 0 ? a : a + "]"; return name; });
                    if (_tag.length >= 2) {
                        var tagName = _tag[0] + "." + _tag[1];
                        selectedTreeNode = this._tableTreeObj.element.find("li[tag='" + tagName + "']");
                        headerTag = selectedTreeNode.attr("tag");
                    }
                    var isPivotGrid = (($(args.dropTarget).hasClass("value") || $(args.dropTarget).hasClass("colheader") || $(args.dropTarget).hasClass("rowheader") || $(args.dropTarget).hasClass("summary")) || $(args.dropTarget).parents("table:eq(0)").hasClass("pivotGridTable") || $(args.dropTarget).parents(".groupingBarPivot").length > 0);
                    var isNamedSet = ((args.droppedElement.find(".namedSetCDB").length > 0) && $(args.dropTarget).hasClass("schemaFilter"));
                    if (isPivotGrid || isNamedSet || ($(args.droppedElement).attr("tag").toLowerCase().indexOf("measures") >= 0 && !$(args.dropTarget).hasClass("schemaValue")) || ($(args.droppedElement).attr("tag").indexOf("Measures") < 0 && $(args.dropTarget).hasClass("schemaValue"))) {
                        this._createErrorDialog();
                        pschemaDesignerWaitingPopup.hide();
                        return false;
                    }
                    var fieldItem = ej.Pivot.getReportItemByFieldName(headerTag, this.model.pivotControl.model.dataSource, this._dataModel);
                    var fieldAxis = fieldItem.axis;
                    if (!(selectedTreeNode.length > 1) && fieldItem.item.length > 0 && (fieldAxis == "rows" && args.dropTarget.hasClass("schemaRow") || (fieldAxis == "columns" && args.dropTarget.hasClass("schemaColumn")) || (fieldAxis == "values" && $(args.dropTarget).hasClass("schemaValue")) || (fieldAxis == "filters" && $(args.dropTarget).hasClass("schemaFilter"))))
                        return false;

                    if (selectedTreeNode.length > 1 && args.droppedElement.find(".kpiValue").length > 0) {
                        selectedTreeNode = selectedTreeNode.find(".kpiValue").parents("li:eq(0)");
                    }
                    if (this._tableTreeObj.isNodeChecked(selectedTreeNode))
                        for (var i = 0; i < this.element.find(".pivotButton").length; i++)
                            this.element.find(".pivotButton:eq(" + i + ")").attr("tag").split(":")[1] == headerTag ? this.element.find(".pivotButton:eq(" + i + ")").remove() : "";
                }
                else if (this._dataModel == "Olap")
                    if (($(args.droppedElement).attr("tag").indexOf("Measures") >= 0 && $(args.dropTarget).hasClass("schemaFilter")) || ($(args.droppedElement).attr("tag").indexOf("Measures") < 0 && $(args.dropTarget).hasClass("schemaValue"))) {
                        this._createErrorDialog();
                        pschemaDesignerWaitingPopup.hide();
                        return false;
                    }

                $(selectedTreeNode).find(".filter").remove();
                if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    selectedPvtBtn = new Array();
                    for (var i = 0; i < this.element.find(".pivotButton").length; i++) {
                        uniqueName = $(this.element.find(".pivotButton")[i]).find("button").attr("fieldName");
                        if (uniqueName == headerText)
                            selectedPvtBtn.push(this.element.find(".pivotButton")[i]);
                    }
                }
                if (pivotDrop)
                    if (args.event.target.tagName == "TH" || args.event.target.tagName == "TD") {
                        this._droppedClass = args.event.target.className.split(" ")[0] == "rowheader" || args.event.target.className.split(" ")[0] == "grpRow" ? "schemaRow" : args.event.target.className.split(" ")[0] == "colheader" ? "schemaColumn" : $(args.event.target).hasClass("value") ? "schemaValue" : "";
                        if (this._droppedClass == "") return;
                    }
                    else
                        this._droppedClass = (args.event.target.className.split(" ")[0] == "rows" || args.event.target.className.split(" ")[0] == "emptyRows") ? "schemaRow" : args.event.target.className.split(" ")[0] == "columns" ? "schemaColumn" : args.event.target.className.split(" ")[0] == "values" ? "schemaValue" : args.event.target.className.split(" ")[0] == "drag" ? "schemaFilter" : "";
                else
                    if (!ej.isNullOrUndefined(args.event)) {
                        this._droppedClass = args.event.target.className.split(" ")[0];
                    }
                    else {
                        this._droppedClass = args.dropTarget.hasClass("schemaColumn") ? "schemaColumn" : args.dropTarget.hasClass("schemaRow") ? "schemaRow" : args.dropTarget.hasClass("schemaFilter") ? "schemaFilter" : args.dropTarget.hasClass("schemaValue") ? "schemaValue" : "";
                    }
                if (this._dataModel == "Olap") {
                    var isHierarchy = $(args.droppedElement).children("div:eq(0)").find(".e-checkbox").length;
                    if (isHierarchy == 0)
                        selectedTreeNode = args.droppedElement.parent("ul").parent("li:eq(0)");
                    else
                        selectedTreeNode = args.droppedElement;
                }
                if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this._dataModel == "Pivot" && this._droppedClass != "schemaValue" && ($.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == selectedTreeNode.attr("id"); }).length > 0 || $.grep(JSON.parse(this.model.pivotControl.getOlapReport()).PivotCalculations, function (value) { return value.FieldName == selectedTreeNode.attr("id") && value.CalculationType == 8; }).length > 0)) {
                    this.model.pivotControl._createErrorDialog(this.model.pivotControl._getLocalizedLabels("CalcValue"), this.model.pivotControl._getLocalizedLabels("Warning"));
                    return;
                }
                if (selectedTreeNode.find(".e-chk-inact").length > 0 && (this._droppedClass != "" && (this._droppedClass == "schemaRow" || this._droppedClass == "schemaColumn" || this._droppedClass == "schemaFilter" || this._droppedClass == "schemaValue"))) {
                    this._tableTreeObj.checkNode(selectedTreeNode);
                    return false;
                }
                else if (selectedTreeNode.find(".e-chk-inact").length > 0 && (this._droppedClass != "" && (this._droppedClass == "pvtBtn" || this._droppedClass == "rowheader" || this._droppedClass == "colheader" || ((this._droppedClass == "value" && $(args.droppedElement).attr("tag").indexOf("Measures") < 0))))) {
                    this._nodeCheck = true;
                    this._tableTreeObj.checkNode(selectedTreeNode);
                }
                if (ej.isNullOrUndefined(headerTag))
                    for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                        if (this.model.pivotTableFields[i].name == headerText) {
                            this.model.pivotTableFields[i].isSelected = true;
                            headerTag = this.model.pivotTableFields[i];
                        }
                    }
                if (!ej.isNullOrUndefined(this._tempFilterData))
                    for (var i = 0; i < this._tempFilterData.length; i++) {
                        if (!ej.isNullOrUndefined(this._tempFilterData[i][headerText])) {
                            for (var j = 0; j < this._tempFilterData[i][headerText].length; j++)
                                filterItems += "##" + this._tempFilterData[i][headerText][j];
                        }
                    }
                if (args.droppedElement[0].tagName.toLowerCase() == "button") {
                    if (selectedPvtBtn.length > 1)
                        for (var i = 0; i < selectedPvtBtn.length; i++) {
                            if ($(selectedPvtBtn[i]).text() == headerText)
                                $(selectedPvtBtn[i]).remove();
                        }
                    else
                        $(selectedPvtBtn).remove();
                }
                try {
                    report = JSON.parse(this.model.pivotControl.getOlapReport()).Report;
                }
                catch (err) {
                    if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                        report = this.model.pivotControl.getOlapReport();
                }
                if (this.model.pivotControl._dataModel == "XMLA")
                    report = this.model.pivotControl.model.dataSource;

                if (this._dataModel == "Pivot" || this.model.pivotControl._dataModel == "XMLA") {
                    this.model.pivotControl._dataModel == "XMLA" ? headerText = headerTag : headerText = headerText;
                    var droppedPosition = "";
                    if (pivotDrop)
                        droppedPosition = this._droppedPosition = "";
                    else
                        if (!ej.isNullOrUndefined(args.event)) {
                            droppedPosition = this._droppedPosition = this._setSplitBtnTargetPos(args.event);
                        }
                        else {
                            droppedPosition = "";
                        }
                    for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                        if (this.model.pivotTableFields[i].name == headerText) {
                            this.model.pivotTableFields[i].isSelected = true;
                            headerTag = this.model.pivotTableFields[i];
                            $(selectedPvtBtn).remove();
                            break;
                        }
                    }
                    if (selectedTreeNode.find(".e-chk-inact").length > 0 && (this._droppedClass != "" && (this._droppedClass == "schemaRow" || this._droppedClass == "schemaColumn" || this._droppedClass == "schemaFilter" || this._droppedClass == "schemaValue")))
                        this._tableTreeObj.checkNode(selectedTreeNode);
                    else {
                        if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                            var droppedItem = this.model.pivotControl._getDroppedItem(headerText);
                            if (droppedItem.length && droppedItem[0].filterItems && droppedItem[0].filterItems.values && droppedItem[0].filterItems.values.length)
                                $($(selectedTreeNode).find(".e-text")[0]).after(ej.buildTag("span.e-icon").attr("role", "button").attr("aria-label", "filtered").addClass("filter")[0].outerHTML);
                            if (!droppedItem.length)
                                droppedItem[0] = { fieldName: headerText, fieldCaption: ((this._dataModel == "XMLA" && selectedTreeNode.find(".hierarchyCDB ").length > 0) ? selectedTreeNode.find("div:eq(0)").text() : headerText) };
                            this.model.pivotControl.model.dataSource.columns = $.grep(this.model.pivotControl.model.dataSource.columns, function (value) {
                                return value.fieldName != headerText;
                            });
                            this.model.pivotControl.model.dataSource.rows = $.grep(this.model.pivotControl.model.dataSource.rows, function (value) { return value.fieldName != headerText; });

                            if (this._dataModel != "XMLA") {
                                this.model.pivotControl.model.dataSource.values = $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return value.fieldName != headerText; });
                            }
                            else {
                                this.model.pivotControl.model.dataSource.values[0]["measures"] = $.grep(this.model.pivotControl.model.dataSource.values[0]["measures"], function (value) { return value.fieldName != headerText; });
                            }

                            this.model.pivotControl.model.dataSource.filters = $.grep(this.model.pivotControl.model.dataSource.filters, function (value) { return value.fieldName != headerText; });
                            var dropAxis = this._droppedClass == "schemaRow" ? "row" : this._droppedClass == "schemaColumn" ? "column" : this._droppedClass == "schemaFilter" ? "filter" : this._droppedClass == "schemaValue" ? "value" : "";
                            if (this.model.pivotControl._dataModel == "Pivot" && $.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == droppedItem[0].fieldCaption; }).length > 0 && dropAxis != "value") {
                                alert(this.model.pivotControl._getLocalizedLabels("CalcValue"));
                                this._tableTreeObj.checkNode(droppedItem[0].fieldCaption);
                                return;
                            }
                            this._createPivotButton(droppedItem[0], dropAxis, isFiltered, isSorted, droppedPosition);
                            if ($.isNumeric(droppedPosition))
                                this._droppedClass == "schemaRow" ? this.model.pivotControl.model.dataSource.rows.splice(droppedPosition, 0, droppedItem[0]) : this._droppedClass == "schemaColumn" ? this.model.pivotControl.model.dataSource.columns.splice(droppedPosition, 0, droppedItem[0]) : this._droppedClass == "schemaValue" ? ((this.model.pivotControl._dataModel == "XMLA") ? this.model.pivotControl.model.dataSource.values[0]["measures"].splice(droppedPosition, 0, droppedItem[0]) : this.model.pivotControl.model.dataSource.values.splice(droppedPosition, 0, droppedItem[0])) : this.model.pivotControl.model.dataSource.filters.splice(droppedPosition, 0, droppedItem[0]);
                            else
                                this._droppedClass == "schemaRow" ? this.model.pivotControl.model.dataSource.rows.push(droppedItem[0]) : this._droppedClass == "schemaColumn" ? this.model.pivotControl.model.dataSource.columns.push(droppedItem[0]) : this._droppedClass == "schemaValue" ? ((this.model.pivotControl._dataModel == "XMLA") ? this.model.pivotControl.model.dataSource.values[0]["measures"].push(droppedItem[0]) : this.model.pivotControl.model.dataSource.values.push(droppedItem[0])) : this.model.pivotControl.model.dataSource.filters == null ? (this.model.pivotControl.model.dataSource.filters = [], this.model.pivotControl.model.dataSource.filters.push(droppedItem[0])) : this.model.pivotControl.model.dataSource.filters.push(droppedItem[0]);

                            if (this.model.pivotControl._dataModel == "Pivot" && this.model.pivotControl._calculatedField.length > 0 && dropAxis != "value") {
                                this.model.pivotControl._calcFieldNodeDrop(droppedItem[0]);
                                this.model.pivotControl.model.dataSource.values = $.grep(this.model.pivotControl.model.dataSource.values, function (value) {
                                    return (ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false) || (value.isCalculatedField == true && value.formula.indexOf(droppedItem[0].fieldName) == -1);
                                });
                            }

                            if (this.model.pivotControl._dataModel == "XMLA") {
                                if (this._droppedClass == "schemaFilter")
                                    this.model.pivotControl.model.dataSource.filters = $.map(this.model.pivotControl.model.dataSource.filters, function (obj, index) { obj["advancedFilter"] = []; return obj; });
                                ej.olap.base.getJSONData({ action: "nodeDropped" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                            }
                            else {
                                this._trigger("fieldItemDropped", { axis: dropAxis, fieldItem: selectedTreeNode });
                                this.model.pivotControl.model.editCellsInfo = {};
                                this.model.pivotControl._populatePivotGrid();
                            }
                        }
                        else {
                            var isFiltered = false;
                            if (this._tempFilterData != null)
                                $.each(this._tempFilterData, function (index, object) { $.each(object, function (key, value) { if (key == $(selectedTreeNode).attr("id") && value.length > 0) isFiltered = true; }); });
                            if (isFiltered)
                                $($(selectedTreeNode).find(".e-text")[0]).after(ej.buildTag("span.e-icon").addClass("filter")[0].outerHTML);
                            if (this._dataModel == "Pivot" && this.model.pivotControl._calculatedField.length > 0 && this._droppedClass != "schemaValue")
                                this.model.pivotControl._calculatedFieldNodeRemove(headerTag);
                            this._createPivotButton(headerText, this._droppedClass == "schemaRow" ? "row" : this._droppedClass == "schemaColumn" ? "column" : this._droppedClass == "schemaFilter" ? "filter" : this._droppedClass == "schemaValue" ? "value" : "", isFiltered, isSorted, droppedPosition);
                            if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                                this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.pivotControl.model.customObject });
                            var eventArgs = JSON.stringify({ "action": "nodeDropped", "dropAxis": this._droppedClass + "::" + droppedPosition, "headerTag": JSON.stringify(headerTag), "sortedHeaders": this.model.pivotControl._ascdes, "currentReport": report, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                            if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                                this.model.pivotControl._waitingPopup.show();
                            this.element.find(".schemaNoClick").addClass("freeze").width($(this.element).width()).height($(this.element).height()).css({ "top": $(this.element).offset().top, "left": $(this.element).offset().left });
                            if (!this.model.pivotControl.model.enableDeferUpdate)
                                this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._pvtNodeDroppedSuccess);
                            else {
                                this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._pvtNodeDroppedSuccess);
                                if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                                    this.model.pivotControl._waitingPopup.hide();
                            }
                        }
                    }
                }
                else {
                    var axis = (args.dropTarget[0] != undefined && args.dropTarget[0].className == "pivotButton") ? $(args.dropTarget).parents()[0] : (args.dropTarget[0] != undefined && args.dropTarget[0].tagName.toLowerCase() == "td" && !$(args.dropTarget.parents("table.pivotGridTable")[0]).length) ? args.dropTarget.children(":last")[0] : args.dropTarget;
                    this._droppedClass = axis[0].className.split(" ")[0];
                    var curAxis = "", axisName = "";
                    curAxis = axis[0].className.split(" ")[0];
                    if ($(args.dropTarget.parents("table.pivotGridTable")[0]).length) {
                        axisName = $(axis).hasClass("rowheader") ? "Series" : $(axis).hasClass("grpRow") ? "Series" : $(axis).hasClass("rows") ? "Series" : $(axis).hasClass("colheader") ? "Categorical" : $(axis).hasClass("columns") ? "Categorical" : $(axis).hasClass("value") ? "Slicer" : $(axis).hasClass("drag") ? "Slicer" : "";
                        if ($(args.droppedElement).attr("tag").indexOf("Measures") > 0 && axisName == "Slicer") {
                            this._createErrorDialog();
                            return false;
                        }
                    }
                    else
                        axisName = curAxis == "columns" ? "Categorical" : curAxis == "schemaColumn" ? "Categorical" : curAxis == "rows" ? "Series" : curAxis == "schemaRow" ? "Series" : curAxis == "drag" ? "Slicer" : curAxis == "schemaFilter" ? "Slicer" : "";
                    if (axisName == "")
                        axisName = (this.element.find(".schemaRow .pivotButton:contains('Measures')").length > 0 || this.element.find(".schemaRow .pivotButton:contains('MEASURES')").length > 0) ? "Series" : "Categorical";
                    if (!ej.isNullOrUndefined(args.event)) {
                        var droppedPosition = this._setSplitBtnTargetPos(args.event);
                    }
                    else {
                        var droppedPosition = "";
                    }
                    var isFiltered = false;
                    if (this.model.pivotControl._tempFilterData != null)
                        $.each(this.model.pivotControl._tempFilterData, function (index, object) { $.each(object, function (key, value) { if (key == headerTag.replace(/[\[\]']/g, '') && value.length > 0) isFiltered = true; }); });
                    if (isFiltered)
                        $($(selectedTreeNode).find(".e-text")[0]).after(ej.buildTag("span.e-icon").addClass("filter")[0].outerHTML);

                    var params = this._currentCubeName + "--" + headerTag + "--" + axisName + "--" + droppedPosition, filterParams = "";
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.pivotControl.model.customObject });
                    var eventArgs = JSON.stringify({ "action": "nodeDropped", "dropType": "TreeNode", "nodeInfo": params, "filterParams": filterParams, "currentReport": report, "gridLayout": this.model.pivotControl.model.layout, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                    if (!this.model.pivotControl.model.enableDeferUpdate && !ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                        this.model.pivotControl._waitingPopup.show();
                    this.element.find(".schemaNoClick").addClass("freeze").width($(this.element).width()).height($(this.element).height()).css({ "top": $(this.element).offset().top, "left": $(this.element).offset().left });
                    if (!this.model.pivotControl.model.enableDeferUpdate)
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._droppedSuccess);
                    else {
                        this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._droppedSuccess);
                    }
                }
            }
            this._setPivotBtnWidth();
        },

        _addTreeDropIcon: function (treeviewItem) {
            if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                if ($(args.currentElement).attr("tag").toLowerCase().indexOf("[measures]") < 0 && !($(args.currentElement).find(".namedSetCDB").length > 0)) treeviewItem.after(ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML);
            else
                treeviewItem.after(ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML);
        },

        _clientPivotCheckedStateModified: function (args) {
            if (this._isDropAction) return;
            var droppedFieldName = "";
            if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode)
                droppedFieldName = this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? $.grep(this.model.pivotTableFields, function (item) { return item.caption == $(args.currentElement).find("a")[0].textContent; })[0].name : $(args.currentElement).attr("tag");
            else
                droppedFieldName = $(args.currentElement).find("a")[0].textContent;

            if (args.type == "nodeUncheck") {
                delete this.model.pivotControl._fieldMembers[droppedFieldName.toLowerCase()];
                delete this.model.pivotControl._fieldSelectedMembers[droppedFieldName.toLowerCase()];
                ej.Pivot.removeReportItem(this.model.pivotControl.model.dataSource, droppedFieldName, false);
                $(args.currentElement).removeClass("filter").find(".treeDrop,.filter").remove();
            }
            else {
                var droppedClass = "row";
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && $(args.currentElement).attr("tag").toLocaleLowerCase().indexOf("[measures]") >= 0) droppedClass = "value";
                if (this.model.pivotControl.model.analysisMode != ej.Pivot.AnalysisMode.Olap || ($(args.currentElement).attr("tag").toLowerCase().indexOf("[measures]") < 0 && $(args.currentElement).find(".namedSetCDB").length == 0))
                    $(args.currentElement.find(".e-text")).after(ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML);
                var droppedFieldCaption = $(args.currentElement).find("a")[0].textContent;
                var dropArgs = { droppedFieldName: droppedFieldName, droppedFieldCaption: droppedFieldCaption, droppedClass: droppedClass, droppedPosition: "", isMeasuresDropped: (droppedFieldName.toLocaleLowerCase().indexOf("measures") == 0) };
                ej.Pivot.addReportItem(this.model.pivotControl.model.dataSource, dropArgs);
            }
            this._refreshPivotButtons();
            this.model.pivotControl.refreshControl();
			this._setPivotBtnWidth();
        },

        _clientOnNodeDropped: function (args) {
            this._isDragging = false;
            var pivotDrop = false;
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var buttonDrag = $(args.dropTarget).parents();
                for (var i = 0; i < buttonDrag.length; i++) {
                    if (buttonDrag[i].className.split(" ")[0] == "e-pivotgrid")
                        pivotDrop = true;
                }
            }
            var droppedFieldName = this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? $.grep(this.model.pivotTableFields, function (item) { return item.caption == args.droppedElement.text() })[0].name : (args.droppedElement.attr("defaulthierarchy") || args.droppedElement.attr("tag"));
            var droppedFieldCaption = $(args.droppedElement).find("div:first").text();
            var droppedClass = "";
            if ($(args.dropTarget).hasClass("pvtBtn"))
                droppedClass = $(args.dropTarget).parents('div.e-droppable').hasClass("schemaColumn") ? "column" : $(args.dropTarget).parents('div.e-droppable').hasClass("schemaRow") ? "row" : $(args.dropTarget).parents('div.e-droppable').hasClass("schemaFilter") ? "filter" : $(args.dropTarget).parents('div.e-droppable').hasClass("schemaValue") ? "value" : "";
            else
                var droppedClass = args.dropTarget.hasClass("schemaColumn") ? "column" : args.dropTarget.hasClass("schemaRow") ? "row" : args.dropTarget.hasClass("schemaFilter") ? "filter" : args.dropTarget.hasClass("schemaValue") ? "value" : "";
            if (pivotDrop) {
                if ($(args.dropTarget).prop("tagName") == "TH" || $(args.dropTarget).prop("tagName") == "TD")
                    droppedClass = $(args.dropTarget).hasClass("rowheader") || $(args.dropTarget).hasClass("grpRow") ? "row" : $(args.dropTarget).hasClass("colheader") ? "column" : $(args.dropTarget).hasClass("value") ? "value" : "";
                else
                    droppedClass = ($(args.dropTarget).hasClass("rows") || $(args.dropTarget).hasClass("emptyRows")) ? "row" : $(args.dropTarget).hasClass("columns") ? "column" : $(args.dropTarget).hasClass("values") ? "value" : $(args.dropTarget).hasClass("drag") ? "filter" : "";
            }
            if (droppedClass == "")
                return false;
            var droppedPosition = ej.isNullOrUndefined(args.event) ? "" : this._setSplitBtnTargetPos(args.event);
            //validating drop action
            var isPivotGrid = (($(args.dropTarget).hasClass("value") || $(args.dropTarget).hasClass("colheader") || $(args.dropTarget).hasClass("rowheader") || $(args.dropTarget).hasClass("summary")) || $(args.dropTarget).parents("table:eq(0)").hasClass("pivotGridTable") || $(args.dropTarget).parents(".groupingBarPivot").length > 0);
            if ((droppedFieldName.toLowerCase().indexOf("[measures]") >= 0 && droppedClass != "value") || (droppedFieldName == this._getLocalizedLabels("Measures") && droppedClass != "row" && droppedClass != "column") || (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && droppedFieldName.toLowerCase().indexOf("[measures]") < 0 && droppedClass == "value") || (isPivotGrid && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap)) {
                this._createErrorDialog();
                return;
            }
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if (droppedFieldName.toLowerCase().indexOf("[measures") >= 0) {
                    this.model.pivotControl.model.dataSource.values[0].axis = droppedClass == "column" ? "columns" : droppedClass == "row" ? "rows" : this.model.pivotControl.model.dataSource.values[0].axis;
                    droppedClass = "value";
                }
            }

            this.model.pivotControl._waitingPopup.show();
            var dropArgs = { droppedFieldName: droppedFieldName, droppedFieldCaption: droppedFieldCaption, droppedClass: droppedClass, droppedPosition: droppedPosition, isMeasuresDropped: (droppedFieldName.toLocaleLowerCase().indexOf("measures") == 0) };
            ej.Pivot.addReportItem(this.model.pivotControl.model.dataSource, dropArgs);
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                ej.olap.base.clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "nodeDropped" }, this.model.pivotControl);
            if (this.model.pivotControl.element.hasClass("e-pivotclient") && this.model.pivotControl._pivotChart)
                this.model.pivotControl._pivotChart._labelCurrentTags = {};

            var droppedElement = args.droppedElement;
            this._isDropAction = true;
            if (droppedClass == "")
                this._tableTreeObj.uncheckNode(args.droppedElement);
            else {
                if ($(args.droppedElement).find(".treeDrop").length == 0 && this.element.parents(".e-pivotclient").length == 0 && (this.model.pivotControl.model.analysisMode != ej.Pivot.AnalysisMode.Olap || ($(args.droppedElement).attr("tag").toLowerCase().indexOf("[measures]") < 0 && $(args.droppedElement).find(".namedSetCDB").length == 0)))
                    $(args.droppedElement.find(".e-text")).after(ej.buildTag("span.e-icon").css("display", "none").addClass("treeDrop")[0].outerHTML);
                this._tableTreeObj.checkNode(args.droppedElement);
            }
            this._isDropAction = false;

            this._refreshPivotButtons();
            this.model.pivotControl.refreshControl();
			this._setPivotBtnWidth();
        },

        _clientOnPvtBtnDropped: function (args) {
            if ($(args.target).hasClass("removeClientPivotBtn"))
                args.target = $(args.target).parent();
            this._isDragging = false;
            $("#" + this._id + "_dragClone").remove();
            //Getting dropped item name
            var droppedField = "";
            if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode)
                droppedField = this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? $.grep(this.model.pivotTableFields, function (item) { return item.caption == args.element.text(); })[0].name : $(args.element).attr("fieldName");
            else
                droppedField = args.element.text();
            var droppedFieldCaption = args.element.text();
            if(!ej.isNullOrUndefined(this.model.pivotControl._fieldMembers)) {
				delete this.model.pivotControl._fieldMembers[droppedField.toLowerCase()];
				delete this.model.pivotControl._fieldSelectedMembers[droppedField.toLowerCase()];
			}

            //Getting dropped axis
            var droppedClass = "";
            if ($(args.target).hasClass("pvtBtn") || (this.element.parents(".e-pivotclient").length > 0 && $(args.target).hasClass("pivotButton")))
                droppedClass = $(args.target).parents('div.e-droppable').hasClass("schemaColumn") ? "column" : $(args.target).parents('div.e-droppable').hasClass("schemaRow") ? "row" : $(args.target).parents('div.e-droppable').hasClass("schemaFilter") ? "filter" : $(args.target).parents('div.e-droppable').hasClass("schemaValue") ? "value" : "";
            else
                droppedClass = $(args.target).hasClass("schemaColumn") ? "column" : $(args.target).hasClass("schemaRow") ? "row" : $(args.target).hasClass("schemaFilter") ? "filter" : $(args.target).hasClass("schemaValue") ? "value" : "";

            //validating drop action
            if ((droppedField.toLowerCase().indexOf("[measures]") >= 0 && droppedClass != "value" && (droppedClass == "row" || droppedClass == "column" || droppedClass == "filter")) || (droppedField == this._getLocalizedLabels("Measures") && droppedClass != "row" && droppedClass != "column") || (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && droppedField.toLowerCase().indexOf("[measures]") < 0 && droppedClass == "value")) {
                this._createErrorDialog();
                args.element.removeClass("dragHover").parent().removeClass("dragHover");
                return;
            }
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl._calculatedField != null && droppedClass != "value" && $.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == droppedField; }).length > 0) {
                alert(this.model.pivotControl._getLocalizedLabels("CalcValue"));
                args.element.removeClass("dragHover").parent().removeClass("dragHover");
                this.element.find(".dropIndicator").removeClass("dropIndicatorHover");
                return;
            }
            //Getting dropped position
            var droppedPosition =!ej.isNullOrUndefined(args.event)? this._setSplitBtnTargetPos(args.event):"";
            
            var dropArgs = { droppedFieldName: droppedField, droppedFieldCaption: droppedFieldCaption, droppedClass: droppedClass, droppedPosition: droppedPosition, isMeasuresDropped: (droppedField.toLocaleLowerCase().indexOf("measures") == 0) };
            ej.Pivot.addReportItem(this.model.pivotControl.model.dataSource, dropArgs);
            if (this.model.pivotControl._calculatedField != null && this.model.pivotControl._calculatedField.length > 0 && droppedClass != "value") {
                var removeElement = $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return value.isCalculatedField == true && value.formula.indexOf(droppedField) > -1; });
                for (var i = 0; i < removeElement.length; i++)
                    this._tableTreeObj.uncheckNode(removeElement[i].fieldName);
            }
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl._calculatedField != null && this.model.pivotControl._calculatedField.length > 0) {
                var calculatedField = $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return value.isCalculatedField == true; });
                this.model.pivotControl.model.dataSource.values = $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false; });
                $.merge(this.model.pivotControl.model.dataSource.values, calculatedField);
            }
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) 
                ej.olap.base.clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "nodeDropped" }, this.model.pivotControl)
            if (this.model.pivotControl.element.hasClass("e-pivotclient") && this.model.pivotControl._pivotChart)
                this.model.pivotControl._pivotChart._labelCurrentTags = {};
            if (droppedClass == "") {
                this._isDropAction = true;
                this._tableTreeObj.element.find("li[tag='" + droppedField + "']").removeClass("filter").find(".treeDrop,.filter").remove();
                this._tableTreeObj.uncheckNode(this._tableTreeObj.element.find("li[tag='" + droppedField + "']"));
                this._isDropAction = false;
            }
            this._refreshPivotButtons();
            this.model.pivotControl.refreshControl();
			this._setPivotBtnWidth();
        },

        _refreshPivotButtons: function () {
            if (this.model.layout == "normal") {
                this.element.find(".axisTable .schemaFilter").html(this._createPivotButtons(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.filters : JSON.parse(this.model.pivotControl.getOlapReport()).Filters, "filter"));
                this.element.find(".axisTable .schemaRow").html(this._createPivotButtons(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.rows : JSON.parse(this.model.pivotControl.getOlapReport()).PivotRows, "row"));
                this.element.find(".axisTable .schemaColumn").html(this._createPivotButtons(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.columns : JSON.parse(this.model.pivotControl.getOlapReport()).PivotColumns, "column"));
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.pivotControl.model.dataSource.values.length > 0 && (!ej.isNullOrUndefined(this.model.pivotControl.model.dataSource.values[0].measures)) && this.model.pivotControl.model.dataSource.values[0].measures.length > 0) {
                    if (this.model.pivotControl.model.dataSource.values[0].axis == "columns")
                        this.element.find(".axisTable .schemaColumn").append(this._createPivotButtons([{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }], "column"));// this.model.pivotControl.model.dataSource.values[0].measures));
                    else if (this.model.pivotControl.model.dataSource.values[0].axis == "rows")
                        this.element.find(".axisTable .schemaRow").append(this._createPivotButtons([{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }], "row"));// this.model.pivotControl.model.dataSource.values[0].measures));
                }   
                this.element.find(".axisTable .schemaValue").html(this._createPivotButtons(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.values : JSON.parse(this.model.pivotControl.getOlapReport()).PivotCalculations, "values"));
            }
            else{
                this.element.find(".axisTable .schemaFilter").html(this._createPivotButtons1("filters", this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.filters : JSON.parse(this.model.pivotControl.getOlapReport()).Filters));
                this.element.find(".axisTable .schemaRow").html(this._createPivotButtons1("rows", this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.rows : JSON.parse(this.model.pivotControl.getOlapReport()).PivotRows));
                this.element.find(".axisTable .schemaColumn").html(this._createPivotButtons1("columns", this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.columns : JSON.parse(this.model.pivotControl.getOlapReport()).PivotColumns));
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.pivotControl.model.dataSource.values.length > 0 && (!ej.isNullOrUndefined(this.model.pivotControl.model.dataSource.values[0].measures)) && this.model.pivotControl.model.dataSource.values[0].measures.length > 0) {
                    if (this.model.pivotControl.model.dataSource.values[0].axis == "columns")
                        this.element.find(".axisTable .schemaColumn").append(this._createPivotButtons1("columns", [{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }]));// this.model.pivotControl.model.dataSource.values[0].measures));
                    else if (this.model.pivotControl.model.dataSource.values[0].axis == "rows")
                        this.element.find(".axisTable .schemaRow").append(this._createPivotButtons1("rows", [{ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }]));// this.model.pivotControl.model.dataSource.values[0].measures));
                }
                this.element.find(".axisTable .schemaValue").html(this._createPivotButtons1("values", this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this.model.pivotControl.model.dataSource.values : JSON.parse(this.model.pivotControl.getOlapReport()).PivotCalculations));
            }
            
                if (this.model.enableDragDrop) {
                    this.element.find(".pivotButton .pvtBtn").ejButton({ size: "normal", type: ej.ButtonType.Button, enableRTL: this.model.enableRTL }).ejDraggable({
                        handle: 'button', clone: true,
                        cursorAt: { left: -5, top: -5 },
                        dragStart: ej.proxy(function (args) {
                            this._isDragging = true;
                        }, this),
                        dragStop: ej.proxy(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._pvtBtnDropped : this._clientOnPvtBtnDropped, this),
                        helper: ej.proxy(function (event, ui) {
							if (event.sender.target.className.indexOf("e-btn") > -1) {
								var btnClone = $(event.sender.target).clone().attr("id",this._id+"_dragClone").appendTo('body');
								$("#"+this._id + "_dragClone").removeAttr("style").height($(event.sender.target).height());
								return btnClone;            
							}
							else
								return false;
                        }, this)
                    });
                }
                if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.pivotControl.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne)
                    this.element.find(".pvtBtn").css("max-width", this.element.find(".schemaColumn").width() - this.element.find(".removeClientPivotBtn").width() - 6);
                this._createContextMenu();
                this._setSplitButtonTitle();
			    if(!(this.element.parents(".e-pivotclient").length > 0))
				    this._setPivotBtnWidth();
        },

        _setSplitButtonTitle: function () {
            if (this.element.find(".pvtBtn").length > 0 && this._tableTreeObj != null)
            {
                for (var i = 0; i < this.element.find(".pvtBtn").length; i++) {
                    var fieldName = this.element.find(".pvtBtn:eq(" + i + ")").attr("fieldname");
                    if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        var dimenstionCaption = this._tableTreeObj.element.find("li[tag='" + fieldName + "']").parents("li:eq(0)").find("a:eq(0)").text();
                        var hierarchyCaption = this.element.find(".pvtBtn:eq(" + i + ")").text();
                        if (fieldName.toLowerCase().indexOf("measures") >= 0)
                            this.element.find(".pvtBtn:eq(" + i + ")").attr("title", hierarchyCaption);
                        else
                            this.element.find(".pvtBtn:eq(" + i + ")").attr("title", dimenstionCaption + " - " + hierarchyCaption);
                    }
                    else
                        this.element.find(".pvtBtn:eq(" + i + ")").attr("title", $.grep(this.model.pivotTableFields, function (item) { return item.name == fieldName; })[0].caption);
                }
            }
        },

        _createPivotButtons1: function (axis, items) {
            var rowBtns = "";
            if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                if (axis == "values" && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) items = $.map(items, function (obj, index) { return obj["measures"]; });
                for (var i = 0; i < items.length; i++) {
                     var buttonId = this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? "" : items[i].fieldName;
					var fldName = $.grep(this.model.pivotTableFields, function (item) { return item.name == items[i].fieldName; }),
					fldCaption = $.grep(this.model.pivotTableFields, function (item) { return item.name == items[i]; });
					if(fldName.length > 0)
						fldName = fldName[0].caption;
					if(fldCaption.length > 0)
						fldCaption = fldCaption[0].caption;
                    rowBtns += ej.buildTag("div.pivotButton",
                                ej.buildTag("div.dropIndicator")[0].outerHTML +
                                ej.buildTag("button.pvtBtn#pivotButton" + buttonId, this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? (items[i].fieldCaption != undefined ? items[i].fieldCaption : items[i].fieldName) || items[i] : fldName || fldCaption, {}, { "fieldName": items[i].fieldName || items[i], "axis": axis })[0].outerHTML +   //+#pivotButton items[i].fieldName || items[i]
                                ej.buildTag("span." + (this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne ? "removeClientPivotBtn" : "removePivotBtn"), {}, { "display": (this.model.layout != ej.PivotSchemaDesigner.Layouts.OneByOne ? "none" : "inline-block") }).addClass("e-icon")[0].outerHTML).attr("tag", axis + ":" + items[i].fieldName || items[i])[0].outerHTML;
                }
            }
            else {
                //if (axis == "values" && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) items = $.map(items, function (obj, index) { return obj["measures"]; });
                for (var i = 0; i < items.length; i++) {
                    rowBtns += ej.buildTag("div.pivotButton",
                                ej.buildTag("div.dropIndicator")[0].outerHTML +
                                ej.buildTag("button.pvtBtn#pivotButton" + (items[i].FieldHeader || items[i].FieldName || items[i].DimensionHeader || items[i].DimensionName || items[i].Name), (items[i].FieldHeader || items[i].FieldName || items[i].DimensionHeader || items[i].DimensionName || items[i].Name), {}, { "fieldName": items[i].fieldName || items[i].FieldHeader || items[i].DimensionHeader || items[i].DimensionName || items[i].Name || items[i], "axis": axis })[0].outerHTML +   //+#pivotButton items[i].fieldName || items[i]
                                ej.buildTag("span." + (this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne ? "removeClientPivotBtn" : "removePivotBtn"), {}, { "display": (this.model.layout != ej.PivotSchemaDesigner.Layouts.OneByOne ? "none" : "inline-block") }).addClass("e-icon")[0].outerHTML).attr("tag", axis + ":" + (items[i].FieldName || items[i].FieldHeader || items[i].DimensionHeader || items[i].DimensionName || items[i].Name || items[i]))[0].outerHTML;
                }
            }
            return rowBtns;
        },

        _pvtBtnDropped: function (args) {
            this.element.find(".dropIndicator").removeClass("dropIndicatorHover");
            $(args.element).parent().removeClass("dragHover");
            $(args.element).removeClass("dragHover");
            $("#" + this._id + "_dragClone").remove();
            var headerTag = "";
            if ($(this.element).parents(".e-pivotclient").length > 0 && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                if($(args.target).hasClass("pivotButton"))
                    args.target = args.target.childNodes[1];
                var droppedClass = args.target.className.indexOf("e-droppable") >= 0 ? args.target.className.split(" ")[0] : (args.target.className.split(" ")[0] == "pvtBtn" ? $(args.target).parents('div.e-droppable').attr("class").split(" ")[0] : "");
                var headerText = args.element.text(), report;
                var headerName = args.element.parent().attr("tag").split(":")[1];
                var droppedPosition = ej.isNullOrUndefined(args.event) ? "" : this._setSplitBtnTargetPos(args.event);
                for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                    if (this.model.pivotTableFields[i].name == headerText) {
                        this.model.pivotTableFields[i].isSelected = true;
                        headerTag = this.model.pivotTableFields[i];
                        break;
                    }
                }
                try { report = JSON.parse(this.model.pivotControl.getOlapReport()).Report; }
                catch (err) { report = this.model.pivotControl.getOlapReport(); }
                if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                    this.model.pivotControl._waitingPopup.show();
                var eventArgs = JSON.stringify({ "action": this.model.pivotControl.model.enableDeferUpdate ? "nodeDroppedDeferUpdate" : "nodeDropped", "args": JSON.stringify({ "droppedFieldCaption": headerText, "droppedFieldName": headerName, "headerTag": headerTag, "dropAxis": droppedClass, "droppedPosition": droppedPosition, "currentReport": report }), "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._pvtNodeDroppedSuccess);
                return;
            }
            this.model.pivotControl._isUpdateRequired = true;
            this._isDragging = false;
            var axis = null, axisName = "", headerText, droppedClass, isFiltered = isFiltered = args.element.find("~ .filtered").length > 0 ? true : false, isSorted = false;
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if (!ej.isNullOrUndefined(args.target.className)) {
                    axis = args.target.className.indexOf("pvtBtn") > -1 ? $(args.target).parents(".e-droppable")[0] : args.target.className.indexOf("e-droppable") ? args.target : args.target[0].tagName.toLowerCase() == "td" ? args.target.children(":last")[0] : args.target;
                }
                else {
                    axis = args.target;
                }
                if (!ej.isNullOrUndefined(axis.className)) {
                    axisName = axis.className.split(" ")[0] == "schemaColumn" ? "Categorical" : axis.className.split(" ")[0] == "schemaRow" ? "Series" : axis.className.split(" ")[0] == "schemaFilter" ? "Slicer" : "";
                    droppedClass = axis.className.split(" ")[0];
                }
                else {
                    axisName = axis.hasClass("schemaColumn") ? "Categorical" : axis.hasClass("schemaRow") ? "Series" : axis.hasClass("schemaFilter") ? "Slicer" : "";
                    this._droppedClass = droppedClass = axis.hasClass("schemaColumn") ? "schemaColumn" : axis.hasClass("schemaRow") ? "schemaRow" : axis.hasClass("schemaFilter") ? "schemaFilter" : axis.hasClass("schemaValue") ? "schemaValue" : "";
                }
                if (axisName == "" && args.element.parent().attr("tag").toLowerCase().indexOf("[measures]") > -1)
                    axisName = this.element.find(".schemaRow .pivotButton:contains('" + this._getLocalizedLabels("Measures") + "')").length > 0 ? "Series" : "Categorical";
                this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? (headerText = headerTag = $(args.element.parent()[0]).attr("tag").split(":")[1]) : headerTag = $(args.element.parent()[0]).attr("tag");
            }
            else {
                if (!ej.isNullOrUndefined(args.target.className)) {
                    droppedClass = args.target.className.indexOf("e-droppable") >= 0 ? args.target.className.split(" ")[0] : (args.target.className.split(" ")[0] == "pvtBtn" ? $(args.target).parents('div.e-droppable').attr("class").split(" ")[0] : "");
                }
                else {
                    droppedClass = $(args.target).hasClass("schemaColumn") ? "schemaColumn" : $(args.target).hasClass("schemaRow") ? "schemaRow" : $(args.target).hasClass("schemaFilter") ? "schemaFilter" : $(args.target).hasClass("schemaValue") ? "schemaValue" : "";
                }
                headerText = this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode ? $.grep(this.model.pivotTableFields, function (item) { return item.caption == args.element.text(); })[0].name : args.element.text(), headerTag, isFiltered = args.element.find("~ .filterIndicator").length > 0 ? true : false,
                isSorted = args.element.find("~ span:eq(0) span.descending").length > 0 ? true : false;
                for (var i = 0; i < this.model.pivotTableFields.length; i++) {
                    if (this.model.pivotTableFields[i].name == headerText) {
                        this.model.pivotTableFields[i].isSelected = true;
                        headerTag = this.model.pivotTableFields[i];
                    }
                }
            }
            if (this._dataModel == "Olap") {
                if ((headerTag.split(":")[1].toLocaleUpperCase() == "MEASURES" && (droppedClass != "schemaColumn" || droppedClass != "schemaRow") && (droppedClass == "schemaFilter" || droppedClass == "schemaValue")) || (headerTag.toUpperCase().indexOf("[MEASURES]") > -1 && droppedClass != "schemaValue" && (droppedClass == "schemaRow" || droppedClass == "schemaColumn" || droppedClass == "schemaFilter"))) {
                    this._createErrorDialog();
                    return false;
                }
                else if (headerTag.toUpperCase().indexOf("[MEASURES]") == -1 && droppedClass == "schemaValue") {
                    this._createErrorDialog();
                    return false;
                }
            }
            if (droppedClass == "schemaValue" || droppedClass == "schemaRow" || droppedClass == "schemaColumn" || droppedClass == "schemaFilter") {
                if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && this._dataModel == "Pivot" && droppedClass != "schemaValue" && ($.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == headerText; }).length > 0 || $.grep(JSON.parse(this.model.pivotControl.getOlapReport()).PivotCalculations, function (value) { return value.FieldHeader == headerText && value.CalculationType == 8; }).length > 0)) {
                    this.model.pivotControl._createErrorDialog(this.model.pivotControl._getLocalizedLabels("CalcValue"), this.model.pivotControl._getLocalizedLabels("Warning"));
                    return;
                }
                if (!ej.isNullOrUndefined(args.event)) {
                    var droppedPosition = this._setSplitBtnTargetPos(args.event), params, report, eventArgs;
                }
                else {
                    var droppedPosition = "", params, report, eventArgs;
                }
                try {
                    report = JSON.parse(this.model.pivotControl.getOlapReport()).Report;
                }
                catch (err) {
                    if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                    report = this.model.pivotControl.getOlapReport();
                }
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    this.model.pivotControl.dataSource = this.model.pivotControl._clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "nodeDropped" });
                    var isNamedSet = droppedClass == "schemaFilter" && (this.model.pivotControl._getNodeByUniqueName(headerText) != null && this.model.pivotControl._getNodeByUniqueName(headerText).find(".namedSetCDB").length > 0);
                    var isMeasures = ($(args.element.parent()).attr("tag").split(":")[0] == "Columns" && this._droppedClass == "schemaColumn" && headerTag.toLowerCase() == "measures") || ($(args.element.parent()).attr("tag").split(":")[0] == "Rows" && this._droppedClass == "schemaRow" && headerTag.toLowerCase() == "measures")
                    if (isMeasures || isNamedSet || headerText.toLowerCase().indexOf("[measures]") >= 0 && droppedClass != "schemaValue" || (droppedClass == "schemaValue" && !(headerText.toLowerCase().indexOf("[measures]") >= 0)) || (droppedClass == "schemaFilter" && headerText.toLowerCase().indexOf("measures") >= 0)) {
                        pschemaDesignerWaitingPopup.hide();
                        if (!isMeasures)
                            this._createErrorDialog();
                        return args.Cancel;
                    }
                    else if (headerText.toLowerCase().indexOf(("measures")) >= 0 && (!(headerText.toLowerCase().indexOf("[measures]") >= 0))) {
                        $(args.element.parent().parent()).remove();
                        this.model.pivotControl.model.dataSource.values[0]["axis"] = droppedClass == "schemaRow" ? "rows" : droppedClass == "schemaColumn" ? "columns" : "columns";
                        this._createPivotButton({ fieldName: "Measures", fieldCaption: this._getLocalizedLabels("Measures") }, droppedClass == "schemaRow" ? "row" : droppedClass == "schemaColumn" ? "column" : "column", "", "", droppedPosition);
                        ej.olap.base.getJSONData({ action: "nodeDropped" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                        pschemaDesignerWaitingPopup.hide();
                        this._setPivotBtnWidth();
                        return false;
                    }
                }
                if (this.model.pivotControl._dataModel == "Pivot" && droppedClass != "schemaValue" && $.grep(this.model.pivotControl._calculatedField, function (value) { return value.name == headerText; }).length > 0) {
                    alert(this.model.pivotControl._getLocalizedLabels("CalcValue"));
                    return;
                }
                $(args.element.parent().parent()).remove();
                if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                    if (!this.model.pivotControl.model.enableDeferUpdate && !ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                        this.model.pivotControl._waitingPopup.show();
                    this.element.find(".schemaNoClick").addClass("freeze").width($(this.element).width()).height($(this.element).height()).css({ "top": $(this.element).offset().top, "left": $(this.element).offset().left });
                    if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        params = this._currentCubeName + "--" + headerTag + "--" + axisName + "--" + droppedPosition;
                        if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                            this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.pivotControl.model.customObject });
                        eventArgs = JSON.stringify({ "action": "nodeDropped", "dropType": "SplitButton", "nodeInfo": params, "currentReport": report, "gridLayout": this.model.pivotControl.model.layout, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                        if (!this.model.pivotControl.model.enableDeferUpdate)
                            this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._droppedSuccess);
                        else {
                            this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._droppedSuccess);
                        }
                    }
                    else {
                        this._createPivotButton(headerText, droppedClass == "schemaRow" ? "row" : droppedClass == "schemaColumn" ? "column" : droppedClass == "schemaFilter" ? "filter" : droppedClass == "schemaValue" ? "value" : "", isFiltered, isSorted, droppedPosition);
                        if (!ej.isNullOrUndefined(this.model.pivotControl._calculatedField) && this.model.pivotControl._calculatedField.length > 0 && droppedClass != "schemaValue")
                            this.model.pivotControl._calculatedFieldNodeRemove(headerTag);
                        if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                            this._trigger("beforeServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.pivotControl.model.customObject });
                        var filterParams = "";
                        filterParams = ej.Pivot._getFilterParams(droppedClass, this._tempFilterData, headerText);
                        eventArgs = JSON.stringify({ "action": "nodeDropped", "dropAxis": droppedClass + "::" + droppedPosition, "filterParams": filterParams, "headerTag": JSON.stringify(headerTag), "sortedHeaders": this.model.pivotControl._ascdes, "currentReport": report, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) });
                        successMethod = this.model.pivotControl._renderControlSuccess;
                        if (!this.model.pivotControl.model.enableDeferUpdate)
                            this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs, this._pvtNodeDroppedSuccess);
                        else {
                            this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.nodeDropped, eventArgs.replace("nodeDropped", "nodeDroppedDeferUpdate"), this._pvtNodeDroppedSuccess);
                            if (!ej.isNullOrUndefined(this.model.pivotControl._ogridWaitingPopup))
                                this.model.pivotControl._ogridWaitingPopup.hide();
                        }
                    }
                }
                else {
                    var droppedItem = this.model.pivotControl._getDroppedItem(headerText), buttonFields = {};

                    if (droppedItem.length > 0) {
                        buttonFields = (droppedItem[0]["isNamedSets"] != undefined) ? { fieldName: droppedItem[0].fieldName, fieldCaption: droppedItem[0].fieldCaption, isNamedSets: droppedItem[0]["isNamedSets"] } : { fieldName: droppedItem[0].fieldName, fieldCaption: droppedItem[0].fieldCaption };
                    }
                    var dropAxis = droppedClass == "schemaRow" ? "row" : droppedClass == "schemaColumn" ? "column" : droppedClass == "schemaFilter" ? "filter" : droppedClass == "schemaValue" ? "value" : "";
                    this._createPivotButton(buttonFields, dropAxis, isFiltered, isSorted, droppedPosition);
                    if ($.isNumeric(droppedPosition))
                        droppedClass == "schemaRow" ? this.model.pivotControl.model.dataSource.rows.splice(droppedPosition, 0, droppedItem[0]) : droppedClass == "schemaColumn" ? this.model.pivotControl.model.dataSource.columns.splice(droppedPosition, 0, droppedItem[0]) : droppedClass == "schemaValue" ?
                            (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) ? this.model.pivotControl.model.dataSource.values[0]["measures"].splice(droppedPosition, 0, droppedItem[0]) : this.model.pivotControl.model.dataSource.values.splice(droppedPosition, 0, droppedItem[0]) : this.model.pivotControl.model.dataSource.filters.splice(droppedPosition, 0, droppedItem[0]);
                    else
                        droppedClass == "schemaRow" ? this.model.pivotControl.model.dataSource.rows.push(droppedItem[0]) : droppedClass == "schemaColumn" ? this.model.pivotControl.model.dataSource.columns.push(droppedItem[0]) : droppedClass == "schemaValue" ? (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) ? this.model.pivotControl.model.dataSource.values[0]["measures"].push(droppedItem[0]) : this.model.pivotControl.model.dataSource.values.push(droppedItem[0]) : this.model.pivotControl.model.dataSource.filters.push(droppedItem[0]);

                    if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl._calculatedField.length > 0 && droppedClass != "schemaValue") {
                        var removeElement = $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return (ej.isNullOrUndefined(value.isCalculatedField) || value.isCalculatedField == false) || (value.isCalculatedField == true && value.formula.indexOf(droppedItem[0].fieldName) == -1); });
                        var schemaRemoveElement = $.grep(this.model.pivotControl.model.dataSource.values, function (value) { return value.isCalculatedField == true && value.formula.indexOf(droppedItem[0].fieldName) > -1; });
                        for (var i = 0; i < schemaRemoveElement.length; i++)
                            this._tableTreeObj.uncheckNode(schemaRemoveElement[i].fieldName);
                        this.model.pivotControl.model.dataSource.values = removeElement;
                    }

                    if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        var measuresAxis = this.model.pivotControl.model.dataSource.values[0]["axis"] == "columns" ? "Columns:" : "Rows:";
                        var measureElement = (this.element.find("div[tag='" + measuresAxis + "Measures" + "']:first"));
                        measureElement.appendTo(measureElement.parent());
                        var dragAxis = args.element.attr("axis").toLowerCase();
                        this.model.pivotControl.model.dataSource = this.model.pivotControl._clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "nodeDropped" });
                    }

                    if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                        if (!ej.isNullOrUndefined(this.model.pivotControl._ogridWaitingPopup))
                            this.model.pivotControl._ogridWaitingPopup.show();
                        ej.olap.base.getJSONData({ action: "nodeDropped" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                    }
                    else {
                        this._trigger("fieldItemDropped", { axis: dropAxis, fieldItem: droppedItem });
                        this.model.pivotControl.model.editCellsInfo = {};
                        this.model.pivotControl._populatePivotGrid();
                    }
                }
            }
            else
                this._removePvtBtn(args);
            this._setPivotBtnWidth();
        },

        _createErrorDialog: function () {
            ej.Pivot.openPreventPanel(this);
            if (this.element.find(".errorDialog").length == 0) {
                var dialogElem = ej.buildTag("div.errorDialog#ErrorDialog", ej.buildTag("div.warningImg")[0].outerHTML + ej.buildTag("div.warningContent", this._getLocalizedLabels("AlertMsg"))[0].outerHTML + ej.buildTag("div", ej.buildTag("button#ErrOKBtn.errOKBtn", "OK")[0].outerHTML)[0].outerHTML).attr("title", this._getLocalizedLabels("Warning"))[0].outerHTML;
                this.element.append(dialogElem);
                this.element.find(".errorDialog").ejDialog({ target: "#" + this._id, enableResize: false, enableRTL: this.model.enableRTL, width: "400px", close: ej.proxy(ej.Pivot.closePreventPanel, this) });
                this._errorDialog = this.element.find(".errorDialog").data("ejDialog");
                $("#" + this._errorDialog._id + "_wrapper").css({ left: "10%", top: "50%" });
                this.element.find(".errOKBtn").ejButton({ type: ej.ButtonType.Button, click: ej.proxy(this._errOKBtnClick, this) });
                this.element.find(".e-dialog .e-close").attr("title", this._getLocalizedLabels("Close"));
            }
            else {
                this._errorDialog.open();
            }
        },

        _errOKBtnClick: function (args) {
            ej.Pivot.closePreventPanel(this);
            this._errorDialog._ejDialog.find("div.e-dialog-icon").trigger("click");
        },

        _hideSchemaDesigner: function (args) {
            $("#PivotSchemaDesigner").animate({ left: "-" + $("#" + this._id).width() + "px" }, 500, function () {
            });
            this.element.find(".collapseSchema").addClass("expandSchema").removeClass("collapseSchema");
        },

        _showSchemaDesigner: function (args) {
            $("#PivotSchemaDesigner").animate({ left: "5px" });
            this.element.find(".expandSchema").addClass("collapseSchema").removeClass("expandSchema");
        },
        _reSizeHandler: function (args) {
		if(this.model.pivotControl){
            var axisTblWidth = $("#" + this._id).width();
            if (this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne) {
                this.element.find("div.axisTable").css("width", "50%");
                this.element.find(".axisTd1, .axisTd2").css({ "width": "100%" });
            }
            else {
                this.element.find("div.axisTable").width(axisTblWidth);
                var axisTdwidth = (axisTblWidth - 2) / 2;
                this.element.find(".axisTd1, .axisTd2").css({ "width": axisTdwidth });
            }
            var sFldHeight = (ej.PivotSchemaDesigner.Layouts.OneByOne == this.model.layout) ? $("#" + this._id).height() - 15 : (25 / 100) * $("#" + this._id).height();

            if (this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne)
                sFldHeight = (this.element.find(".cubelists").length > 0) ? sFldHeight - this.element.find(".cubelists").height() - 6 : sFldHeight + 5;
            this.element.find("div.schemaFieldTree,div.fieldTable").height(sFldHeight);

            if ($("#" + this._id).height() < 450) {
                $("#" + this._id).css("min-height", "450px");
            }
            if ($("#" + this._id).width() < 240) {
                $("#" + this._id).css("min-width", "240px");
            }

            var axisTblHeight, axisTrHeight;
            var pivotSchemaHeight = $("#" + this._id).height() + 20;
            var axisRemainingHeight = (ej.PivotSchemaDesigner.Layouts.OneByOne == this.model.layout) ? -15 : this.element.find("table.headerTable").height() + this.element.find("div.fieldTable").height() + this.element.find("div.centerDiv").height() + this.element.find("div.centerHead").height();
            if (this.model.pivotControl != null && (!this.model.pivotControl.element.hasClass("e-pivotclient")) && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) 
                axisTblHeight = pivotSchemaHeight - (axisRemainingHeight + 105);
            else 
                axisTblHeight = pivotSchemaHeight - (axisRemainingHeight + 80);
            this.element.find("div.axisTable").height(axisTblHeight);
            axisTrHeight = (axisTblHeight / ((this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne) ? 4 : 2)) + ((this.model.layout == ej.PivotSchemaDesigner.Layouts.OneByOne) ? 10 : 0);
            this.element.find(".axisTd1,.axisTd2").css({ "height": axisTrHeight });
            this._setPivotBtnWidth();
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var treeList = $(".schemaFieldTree ul>li div").width();
                $($(".e-pivotschemadesigner .schemaFieldTree.e-treeview .e-text")).each(function (e) {
                    var percent = ((treeList - (50)) / treeList) * 100;
                    $(this).width(percent.toString() + "%");
                });
            }
			}
        },

        _clientDialogBtnClick: function (args) {
            this.element.find(".e-dialog, .clientDialog").hide();
            this.element.find("#preventDiv").remove();
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                if (this.model.pivotControl.element.hasClass("e-pivotclient") && !ej.isNullOrUndefined(this.model.pivotControl._pivotChart))
                    this.model.pivotControl._pivotChart._labelCurrentTags = {};
                ej.olap.base.clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "filtering" }, this.model.pivotControl)
            }
            if (args.model.text.toLowerCase() == "cancel") {
                return;
            }
            var selectedNodes = [], unSelectedNodes = [], hierarchyUQName = this._selectedFieldName, getTreeNodeState = {}, reportItem, me = this;
            this.model.pivotControl._waitingPopup.show();
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                this._memberTreeObj = ej.Pivot.updateTreeView(this);      
                var hierarchyName = this._selectedFieldName, currentDataSrc = this.model.pivotControl.model.dataSource;
                this.model.pivotControl._currentReportItems = $.map(this.model.pivotControl._currentReportItems, function (obj, index) {
                    if (obj["fieldName"] == hierarchyName && (ej.isNullOrUndefined(obj.dataSrc)|| (obj.dataSrc.cube == currentDataSrc.cube && obj.dataSrc.reportName == currentDataSrc.reportName))) {
                        obj.filterItems = me._memberTreeObj.dataSource();
                    }
                    return obj;
                });
                getTreeNodeState = ej.Pivot.getNodesState(this._memberTreeObj);
                if (this.model.pivotControl.model.enableGroupingBar) {
                    var member = ej.Pivot._getEditorMember(hierarchyName.toLocaleLowerCase(), this.model.pivotControl);
                    this.model.pivotControl._fieldSelectedMembers[hierarchyName.toLocaleLowerCase()] = $.map(this.model.pivotControl._fieldMembers[hierarchyName.toLocaleLowerCase()], function (item) { if (!item.checked) return item }).length == 0 ? "All" : ((member != "All" && member != "multiple") ? member : this.model.pivotControl._getLocalizedLabels("MultipleItems"));
                }
                reportItem = ej.Pivot.getReportItemByFieldName(this._selectedFieldName, this.model.pivotControl.model.dataSource, this._dataModel)["item"];
                selectedNodes = $.map(getTreeNodeState["selectedNodes"].split("::"), function (element, index) { { return { Id: element.split("||")[0], tag: element.split("||")[1], parentId: element.split("||")[2] } } });
                if (!ej.isNullOrUndefined(this.model.pivotControl._selectedNodes)) {
                    for (var i = 0; i < this.model.pivotControl._selectedNodes.length; i++) {
                        var selectedTreeNode = this.model.pivotControl._selectedNodes[i],
                        sameTreeEle = $.map(selectedNodes, function (item, index) { if (selectedTreeNode.tag == item.tag) return item });
                        if (sameTreeEle.length == 0)
                            selectedNodes.push(this.model.pivotControl._selectedNodes[i]);
                    }
                }
                if (!ej.isNullOrUndefined(reportItem)) {
                    reportItem["advancedFilter"] = [];
                    reportItem.filterItems = { filterType: "include", values: ej.Pivot.removeParentSelectedNodes(selectedNodes) };
                    this._selectedTreeNode = this.element.find(".schemaFieldTree").find("li[tag='" + reportItem.fieldName + "']");
                    if ($(this._selectedTreeNode).parents("li:eq(0) span:eq(0)").hasClass("hierarchyCDB"))
                        this._selectedTreeNode = $(this._selectedTreeNode).parents("li:eq(0)");
                    if (getTreeNodeState["unSelectedNodes"] != ""){
                        this.model.pivotControl.model.dataSource = ej.olap.base.clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "filtering" }, this.model.pivotControl);
						if ($(this._selectedTreeNode).find(".filter").length <= 0) {
							$($(this._selectedTreeNode).find(".e-text")[0]).after(ej.buildTag("span.e-icon").attr("role", "button").attr("aria-label", "filtered").addClass("filter")[0].outerHTML);
							this.element.find(".pivotButton:contains('" + this._selectedFieldName + "') .filter").addClass("filtered");
							this.element.find(".pvtBtn[fieldname='" + this._selectedFieldName + "']").parent().find(".filter").addClass("filtered");
						}
					}					
                    else if(this.model.pivotControl._unSelectedNodes){
                        this.model.pivotControl.model.dataSource = ej.olap.base.clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "filtering" }, this.model.pivotControl);
						if ($(this._selectedTreeNode).find(".filter").length <= 0) {
							$($(this._selectedTreeNode).find(".e-text")[0]).after(ej.buildTag("span.e-icon").attr("role", "button").attr("aria-label", "filtered").addClass("filter")[0].outerHTML);
							this.element.find(".pivotButton:contains('" + this._selectedFieldName + "') .filter").addClass("filtered");
							this.element.find(".pvtBtn[fieldname='" + this._selectedFieldName + "']").parent().find(".filter").addClass("filtered");
						}
                    }
                    else {
                        this.element.find(".pvtBtn[fieldname='" + this._selectedFieldName + "']").parent().find(".filter").removeClass("filtered");
                        this._selectedTreeNode.find(".filter").remove();
                        delete reportItem.filterItems;
                    }
                }
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                    var hierarchyName = this._selectedFieldName, currentDataSrc=this.model.pivotControl.model.dataSource ; 
                    this.model.pivotControl._currentReportItems = $.map(this.model.pivotControl._currentReportItems, function (obj, index) {
                        if (obj["fieldName"] != hierarchyName && (ej.isNullOrUndefined(obj.dataSrc)|| (obj.dataSrc.cube != currentDataSrc.cube && obj.dataSrc.reportName != currentDataSrc.reportName))) {
                            return obj;
                        }
                    });
                    this.model.pivotControl._currentReportItems.push({ filterItems: $.extend([], this._memberTreeObj.dataSource()), fieldName: hierarchyName, dataSrc: this.model.pivotControl.model.dataSource });
                }

                ej.olap.base.getJSONData({ action: "filtering" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
            }
            else {
                jQuery.each(this._memberTreeObj.element.find(":input.nodecheckbox:checked"), function (index, item) { if (item.value != "All") selectedNodes.push(item.value); });
                jQuery.each(this._memberTreeObj.element.find(":input.nodecheckbox:not(:checked)"), function (index, item) {
                    unSelectedNodes.push(item.value = item.value == "(blank)" ? "" : item.value);
                });
                this._pivotFilterItems(selectedNodes, unSelectedNodes);
                this.model.pivotControl.refreshControl()
            }
            this.model.pivotControl._isMemberPageFilter = true;
        },

        _pivotFilterItems: function (selectedNodes, unSelectedNodes) {
            var axisItems = this.model.pivotControl.model.dataSource[this._selectedFieldAxis];
            var members = ej.PivotAnalysis.getMembers(this._selectedFieldName);
            jQuery.each(members, function (itemIndex, itemValue) {
                if (itemValue == null || !itemValue.toString().replace(/^\s+|\s+$/gm, '')) {
                    jQuery.each(unSelectedNodes, function (nodeIndex, nodeValue) {
                        if (!nodeValue.toString().replace(/^\s+|\s+$/gm, ''))
                            unSelectedNodes[nodeIndex] = itemValue;
                    });
                }
            });
            var selectedField = this._selectedFieldName;
            var items = $.grep(axisItems, function (item) { return item.fieldName == selectedField });
            for (var i = 0; i < items.length; i++)
                items[i].filterItems = selectedNodes.length == members.length ? null : { filterType: ej.PivotAnalysis.FilterType.Exclude, values: unSelectedNodes };
            if (unSelectedNodes.length > 0 && this.element.find(".schemaFieldTree li[id='" + this._selectedFieldName + "']").find(".filter").length <= 0) {
                var filterSpan = ej.buildTag("span.e-icon", { "display": "none" }).addClass("filter")[0].outerHTML;
                this.element.find(".schemaFieldTree li[id='" + this._selectedFieldName + "']").find(".e-text").after(filterSpan);
                this.element.find(".pvtBtn[fieldname='" + this._selectedFieldName + "']").parent().find(".filter").addClass("filtered");
            }
            else if (unSelectedNodes.length == 0) {
                this.element.find(".pvtBtn[fieldname='" + this._selectedFieldName + "']").parent().find(".filter").removeClass("filtered");
                this.element.find(".schemaFieldTree li[id='" + this._selectedFieldName + "']").find(".filter").remove();
            }
        },
        _dialogBtnClick: function (args) {
            ej.Pivot.closePreventPanel(this);
            this.element.find(".e-dialog, .clientDialog").hide();
            if (!this._isFiltered) return false;
            this.model.pivotControl._isUpdateRequired = true;
            if (this.model.pivotControl != null)
                this.model.pivotControl._memberTreeObj = this._memberTreeObj;
            if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                if (args.model.text.toLowerCase() == "cancel") return;
                var selectedNodes = [], unSelectedNodes = [];
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    var hierarchyUQName = this._selectedMember;
                    this.model.pivotControl._currentReportItems = $.grep(this.model.pivotControl._currentReportItems, function (value, i) { if (value["fieldName"] != undefined && value["fieldName"].toLocaleLowerCase() != hierarchyUQName.toLocaleLowerCase()) return value; });
                    this._memberTreeObj = this.model.pivotControl._updateTreeView(this);
                    this.model.pivotControl._currentReportItems.push({ filterItems: $.extend([], this._memberTreeObj.dataSource()), fieldName: this._selectedMember });
                    selectedNodes = $.map(this.model.pivotControl._getSelectedNodes().split("::"), function (element, index) { { return { Id: element.split("||")[0], tag: element.split("||")[1], parentId: element.split("||")[2] } } });//$.map(this._getSelectedNodes().split("::"), function (element, index) { return { Id: element.split("||")[0], tag: element.split("||")[1],parentId:element.split("||")[2] } });

                    var currElement = (this._selectedMember != undefined) ? this._selectedMember.toLocaleLowerCase() : this._selectedMember.toLocaleLowerCase();
                    var reportItem = $.map(this.model.pivotControl.model.dataSource.columns, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLocaleLowerCase() == currElement)) return obj; });
                    if (reportItem.length == 0) { reportItem = $.map(this.model.pivotControl.model.dataSource.rows, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLocaleLowerCase() == currElement)) return obj; }); }
                    if (reportItem.length == 0) { reportItem = $.map(this.model.pivotControl.model.dataSource.filters, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLocaleLowerCase() == currElement)) return obj; }); }

                    if (reportItem.length > 0) {
                        if (this._getUnSelectedNodes() != "") {
                            this.model.pivotControl.model.dataSource = this.model.pivotControl._clearDrilledItems(this.model.pivotControl.model.dataSource, { action: "filtering" });
                        }
                        reportItem[0]["advancedFilter"] = [];
                        reportItem[0].filterItems = { filterType: "include", values: this.model.pivotControl._removeSelectedNodes(selectedNodes) };
                        this._selectedTreeNode = this.element.find(".schemaFieldTree").find("li[tag='" + reportItem[0].fieldName + "']");
                        if ($(this._selectedTreeNode).parents("li:eq(0)").children().children("span").hasClass("hierarchyCDB")) {
                            this._selectedTreeNode = $($(this._selectedTreeNode).parents("li:eq(0)"));
                        }
                        if (this._getUnSelectedNodes() == "") {
                            this._selectedTreeNode.find(".filter").remove();
                            this.element.find(".pvtBtn[fieldname='" + this._selectedMember + "']").parent().find(".filter").removeClass("filtered");
                            delete reportItem[0].filterItems;
                        }
                        else if ($($(this._selectedTreeNode)).find(".filter").length <= 0) {
                            $($(this._selectedTreeNode).find(".e-text")[0]).after(ej.buildTag("span.e-icon").attr("role", "button").attr("aria-label", "filtered").addClass("filter")[0].outerHTML);
                            this.element.find(".pvtBtn[fieldname='" + this._selectedMember + "']").parent().find(".filter").addClass("filtered");
                        }
                    }
                    if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                        this.model.pivotControl._waitingPopup.show();
                    ej.olap.base.getJSONData({ action: "filtering" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                }
                else {
                    jQuery.each(this._memberTreeObj.element.find(":input.nodecheckbox:checked"), function (index, item) { if (item.value != "All") selectedNodes.push(item.value); });
                    jQuery.each(this._memberTreeObj.element.find(":input.nodecheckbox:not(:checked)"), function (index, item) {
                        unSelectedNodes.push(item.value = item.value == "(blank)" ? "" : item.value);
                    });
                    this.element.find(".e-dialog, .clientDialog").hide();
                    this.model.pivotControl._pivotFilterItems(selectedNodes, unSelectedNodes);
                    this.model.pivotControl.model.editCellsInfo = {};
                    this.model.pivotControl._populatePivotGrid();
                }
            }
            else {
                var unselectedNodes = "", enableFilterIndigator;
                var editorNodes = this.element.find(".editorTreeView :input.nodecheckbox");
                if (args.model.text.toLowerCase() != "cancel") {
                    var uncheckedNodes = this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? unselectedNodes = this._getUnSelectedNodes() + "FILTERED" + this.model.pivotControl._getSelectedNodes(this._curFilteredAxis == "schemaFilter" ? true : false) : this._memberTreeObj.element.find(":input:gt(0).nodecheckbox:not(:checked)"), isFiltered = false,
                    filterParams = this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? uncheckedNodes : this._curFilteredAxis + "::" + this._curFilteredText + "::FILTERED";
                    var text = this._curFilteredText, textArr = new Array(), obj = {};
                    enableFilterIndigator = this._getUnSelectedNodes() != "" ? true : false;
                    if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                        if (this.model.pivotControl.model.enableGroupingBar && ej.isNullOrUndefined(this.model.pivotControl._fieldMembers[text]))
                            this.model.pivotControl._fieldMembers[text] = ej.Pivot._getEditorMember(editorNodes, this.model.pivotControl);
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
                        this.model.pivotControl._tempFilterData = this._tempFilterData;
                        if ((ej.isNullOrUndefined(this._curFilteredAxis) || this._curFilteredAxis != "") && this._curFilteredAxis != "schemaValue") {
                            for (var i = 0; i < uncheckedNodes.length; i++)
                                filterParams += "##" + $(uncheckedNodes[i].parentElement).siblings("a").text();
                        }
                    }
                    else {
                        if (this.model.pivotControl.model.enableGroupingBar) {
                            var member = ej.Pivot._getEditorMember(text, this.model.pivotControl);
                            this.model.pivotControl._fieldSelectedMembers[text] = $.map(this.model.pivotControl._fieldMembers[text], function (item) { if (!item.checked) return item }).length == 0 ? "All" : ((member != "All" && member != "multiple") ? member : this.model.pivotControl._getLocalizedLabels("MultipleItems"));
                        }
                        obj[this._curFilteredText] = filterParams;
                        if (ej.isNullOrUndefined(this.model.pivotControl._tempFilterData))
                            this.model.pivotControl._tempFilterData = new Array();
                        for (var i = 0; i < this.model.pivotControl._tempFilterData.length; i++) {
                            if (!ej.isNullOrUndefined(this.model.pivotControl._tempFilterData[i][this._curFilteredText])) {
                                this.model.pivotControl._tempFilterData[i][this._curFilteredText] = filterParams;
                                isFiltered = true;
                            }
                        }
                        if (!isFiltered)
                            this.model.pivotControl._tempFilterData.push(obj);
                    }
                    var filterEle = this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? this._curFilteredText : this._curFilteredText.split(".")[1];;
                    var sortedHeaders = this._getSortedHeaders(),
                    filteredBtn = this.model.layout == "excel" ? this.element.find(".schemaFieldTree li:contains('" + this._curFilteredText + "')") : this.element.find("." + this._curFilteredAxis + " .pivotButton:contains(" + this._curFilteredText + ") .filterBtn");
                    if (this.model.layout == "excel" || this.model.layout == "normal") {
                        if ($(this._selectedTreeNode).parents("li:eq(0)").children().children("span").hasClass("hierarchyCDB")) {
                            this._selectedTreeNode = $($(this._selectedTreeNode).parents("li:eq(0)"));
                        }
                        if (enableFilterIndigator && $($(this._selectedTreeNode)).find(".filter").length <= 0) {
                            var filterSpan = ej.buildTag("span.e-icon", { "display": "none" }).addClass("filter")[0].outerHTML;
                            $($(this._selectedTreeNode).find(".e-text")[0]).after(filterSpan);
                            this.element.find(".pvtBtn:contains('" + filterEle + "')").parent().find(".filter").addClass("filtered");
                        }
                        else if (!enableFilterIndigator) {
                            $(this._selectedTreeNode).find(".filter").remove();
                            this.element.find(".pvtBtn:contains('" + filterEle + "')").parent().find(".filter").removeClass("filtered");
                        }
                        if (this._curFilteredAxis == "")
                            return false;
                    }
                    var report;
                    try {
                        report = JSON.parse(this.model.pivotControl.getOlapReport()).Report;
                    }
                    catch (err) {
                        if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                        report = this.model.pivotControl.getOlapReport();
                    }
                    if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                        this._trigger("beforeServiceInvoke", { action: "filtering", element: this.element, customObject: this.model.pivotControl.model.customObject });
                var eventArgs = this.model.pivotControl.model.customObject != {} && filterParams != "" ? JSON.stringify({ "action": "filtering", "filterParams": filterParams, "sortedHeaders": this.model.pivotControl._ascdes, "currentReport": report, "gridLayout": this.model.pivotControl.model.layout, "customObject": JSON.stringify(this.model.pivotControl.model.customObject) }) :
                this.model.pivotControl.model.customObject != {} ? JSON.stringify({ "action": "filtering", "currentReport": report, "customObject": serializedCustomObject }) :
                filterParams != "" ? JSON.stringify({ "action": "filtering", "filterParams": filterParams, "sortedHeaders": this.model.pivotControl._ascdes, "currentReport": report }) : JSON.stringify({ "action": "filtering" });
                if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                    this.model.pivotControl._waitingPopup.show();
                this.element.find(".schemaNoClick").addClass("freeze").width($(this.element).width()).height($(this.element).height()).css({ "top": $(this.element).offset().top, "left": $(this.element).offset().left });
                if (!this.model.pivotControl.model.enableDeferUpdate)
                    this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.filtering, eventArgs, this._filterElementSuccess);
                    else {
                    this.model.pivotControl._filterUpdate.push(filterParams);
                    if (!ej.isNullOrUndefined(this.model.pivotControl._waitingPopup))
                        this.model.pivotControl._waitingPopup.hide();
                    this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
                }
            }
            this._selectedTreeNode = null;
            }
        },

        _beforeNodeExpand:function(args){
            ej.Pivot.getChildNodes(args, this._selectedFieldName, this.model.pivotControl._currentReportItems, this.model.pivotControl.model.dataSource, this);
        },

        _nodeExpand: function (args) {
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                this.model.pivotControl._nodeExpand(args);
        },

        _nodeStateModifiedSuccess: function (report) {
            this.model.pivotControl._isUpdateRequired = true;
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
            if (this.model.afterServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "nodeStateModified", element: this.element, customObject: this.model.customObject });
            if (!this.model.pivotControl.model.enableDeferUpdate)
                this.model.pivotControl._renderControlSuccess(report);
            else
                this.model.pivotControl._deferUpdateSuccess(report);
            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
        },

        _pvtNodeDroppedSuccess: function (report) {
            if (report[0] != undefined) {
                if (report[2] != null && report[2] != undefined)
                    this.model.customObject = report[2].Value;
            }
            else if (report.d != undefined) {
                if (report.d[2] != null && report.d[2] != undefined)
                    this.model.customObject = report.d[2].Value;
                if(report.d[0].Key == "PivotReport")
                    this.model.pivotControl.setOlapReport(report.d[0].Value);
            }
            else {
                if (report.customObject != null && report.customObject != undefined)
                    this.model.customObject = report.customObject;
                this.model.pivotControl.setOlapReport(report.PivotReport);
            }
            if (this.model.afterServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });

            if (!this.model.pivotControl.model.enableDeferUpdate) {
                if ($(this.element).parents(".e-pivotclient").length > 0 && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    this.model.pivotControl.refreshControl(report);
                }
                else
                    this.model.pivotControl._renderControlSuccess(report);
            }
            else
                this.model.pivotControl._deferUpdateSuccess(report);
            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
        },

        _pvtBtnDroppedSuccess: function (report) {
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
            if (this.model.afterServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "removeButton", element: this.element, customObject: this.model.customObject });
            this.model.pivotControl._renderControlSuccess(report);
            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
        },

        _filterElementSuccess: function (report) {
            if ($(this.element).parents(".e-pivotclient").length > 0) {
                if (!ej.isNullOrUndefined(report.d)) {
                    var tempObj = {};
                    tempObj["PivotReport"] = report.d[0].Value;
                    tempObj["GridJSON"] = report.d[1].Value;
                    tempObj["ChartJSON"] = report.d[2].Value;
                    report = tempObj;
                }
                this.model.pivotControl._renderClientControls(report);
            }
            else {
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
                if (this.model.afterServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                    this._trigger("afterServiceInvoke", { action: "filtering", element: this.element, customObject: this.model.customObject });
                this.model.pivotControl._renderControlSuccess(report);
            }   
            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
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
            this._memberTreeObj._createSubNodesWhenLoadOnDemand(newDataSource, this.pNode, mapper);
            $.each($(parentNode).children().find("li"), function (index, value) {
                value.setAttribute("tag", newDataSource[index].tag);
            });
            if (this.model.afterServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "memberExpanded", element: this.element, customObject: this.model.customObject });
            // this._memberTreeObj._expandCollapseAction(this.pNode);
            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
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
                if (msg != null && msg.customObject != undefined)
                    this.model.customObject = msg.customObject;
            }
            else if (msg != undefined) {
                this._currentMembers = msg.EditorTreeInfo;
                if (msg != null && msg.customObject != undefined)
                    this.model.customObject = msg.customObject;
            }
            if (this.model.afterServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "fetchMembers", element: this.element, customObject: this.model.customObject });
            this._createDialog(this._dialogHead, this._currentMembers);

           
            if (this.model.pivotControl._waitingPopup)
                this.model.pivotControl._waitingPopup.hide();
            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
            if (!ej.isNullOrUndefined(this.element.find(".e-dialog .e-text:visible").first())) {
                this.element.find(".e-dialog .e-text:visible").first().attr("tabindex", "-1").focus().addClass("hoverCell");
            }
        },

        _droppedSuccess: function (args) {
            var report = null;
            if (this.model.pivotControl.model.enableDeferUpdate) {
                report = this._removeButtonDeferUpdate == false ? (!ej.isNullOrUndefined(args.OlapReport) ? JSON.parse(args.OlapReport) : JSON.parse(args.d[0].Value)) : (!ej.isNullOrUndefined(args.OlapReport) ? report = args.OlapReport : report = args.d[0].Value);
            }
            else {
                if (!ej.isNullOrUndefined(args[0]) && args.length > 0) {
                    report = JSON.parse(args[1].Value);
                    if (args[2] != null && args[2] != undefined)
                        this.model.customObject = (args[2].Value);
                }
                else if (!ej.isNullOrUndefined(args.d) && args.d.length > 0) {
                    if ($(this.element).parents(".e-pivotclient").length > 0 && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot)
                        report = JSON.parse($.grep(args.d, function (item) { return item.Key == "PivotReport" })[0].Value);
                    else
                        report = JSON.parse(args.d[1].Value);
                    if (args.d[2] != null && args.d[2] != undefined)
                        this.model.customObject = (args.d[2].Value);
                }
                else if (!ej.isNullOrUndefined(args) && !ej.isNullOrUndefined(args.OlapReport))
                    report = JSON.parse(args.OlapReport);
                else if (!ej.isNullOrUndefined(args) && !ej.isNullOrUndefined(args.PivotReport))
                    report = JSON.parse(args.PivotReport);
                if (args.customObject != null && args.customObject != undefined)
                    this.model.customObject = (args.customObject);
            }
            if (this._removeButtonDeferUpdate == false) {
                this.element.find(".axisTable .pivotButton").remove();
                this._setPivotRows(report.PivotRows);
                this._setPivotColumns(report.PivotColumns);
                this._setPivotCalculations(report.PivotCalculations);
                this._setFilters(report.Filters);
                this.model.pivotControl.setOlapReport(JSON.stringify(report));
                this.element.find(".axisTable .schemaFilter").append(this._createPivotButtons(this.model.filters, "filter"));
                this.element.find(".axisTable .schemaRow").append(this._createPivotButtons(this.model.pivotRows, "row"));
                this.element.find(".axisTable .schemaColumn").append(this._createPivotButtons(this.model.pivotColumns, "column"));
                this.element.find(".axisTable .schemaValue").append(this._createPivotButtons(this.model.pivotCalculations, "values"));
                if (this.model.enableDragDrop) {
                    this.element.find(".pivotButton .pvtBtn").ejButton({ size: "normal", type: ej.ButtonType.Button, enableRTL: this.model.enableRTL }).ejDraggable({
						handle: 'button', clone: true,
						cursorAt: { left: -5, top: -5 },
						dragStart: ej.proxy(function (args) {
							this._isDragging = true;
						}, this),
						dragStop: ej.proxy(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode ? this._pvtBtnDropped : this._clientOnPvtBtnDropped, this),
						helper: ej.proxy(function (event, ui) {
						    $(event.element).addClass("dragHover");
							if (event.sender.target.className.indexOf("e-btn") > -1) {
								var btnClone = $(event.sender.target).clone().attr("id",this._id+"_dragClone").appendTo('body');
								$("#"+this._id + "_dragClone").removeAttr("style").height($(event.sender.target).height());
								return btnClone;            
							}
							else
								return false;
						}, this)
					});
				}
                this._unWireEvents();
                this._wireEvents();
            }
            if (!this.model.pivotControl.model.enableDeferUpdate) {
                if ($(this.element).parents(".e-pivotclient").length > 0 && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    this.model.pivotControl.refreshControl(args);
                }
                else
                    this.model.pivotControl._renderControlSuccess(args);
            }
            else {
                if (!ej.isNullOrUndefined(this.model.pivotControl._ogridWaitingPopup))
                    this.model.pivotControl._ogridWaitingPopup.hide();
                if (!ej.isNullOrUndefined(args.OlapReport)) {
                    this.model.pivotControl.setOlapReport(args.OlapReport);
                    if (args.HeaderCounts != undefined && $(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                        this.model.pivotControl._pagerObj.initPagerProperties(JSON.parse(args.HeaderCounts), JSON.parse(args.PageSettings));
                }
                else {
                    this.model.pivotControl.setOlapReport(args.d[0].Value);
                    if ($(".e-pivotpager")[0] != null && $(".e-pivotpager")[0] != undefined)
                        this.model.pivotControl._pagerObj.initPagerProperties(JSON.parse(args.d[2].Value), JSON.parse(args.d[1].Value));
                }
                this._removeButtonDeferUpdate = false;
                this.model.pivotControl._deferUpdateSuccess(args);
            }
            if (this.model.afterServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                this._trigger("afterServiceInvoke", { action: "nodeDropped", element: this.element, customObject: this.model.customObject });
            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
            this._createContextMenu();
            this._setPivotBtnWidth();
        },

        _removePvtBtn: function (args) {
            this.model.pivotControl._waitingPopup.show();
            var headerText, headerTag, report, eventArgs;
            if ($(args.element).length > 0) {
                headerText = $(args.element).parent().attr("tag").split(":")[1], headerTag = $(args.element).parent().attr("tag");
            }
            else {
                headerText = $(args.target).parent().attr("tag").split(":")[1], headerTag = $(args.target).parent().attr("tag");
            }
            try {
                report = JSON.parse(this.model.pivotControl.getOlapReport()).Report;
            }
            catch (err) {
                if (!ej.isNullOrUndefined(this.model.pivotControl.getOlapReport))
                report = this.model.pivotControl.getOlapReport();
            }
            if (report == "" && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap)
                report = this.model.pivotControl.model.dataSource;
            if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                var uniqueName = ((headerTag.indexOf("[Measures]") > -1) || (headerTag.indexOf("[") > -1)) ? headerTag.split(":")[1] : this.model.pivotControl._getNodeUniqueName(headerTag);
                uniqueName = uniqueName.indexOf("<>") ? uniqueName.replace("<>", ".") : uniqueName;
                if (uniqueName == "[Measures]") {
                    if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                        ej.Pivot.removeReportItem(this.model.pivotControl.model.dataSource, headerText, headerText.toLocaleLowerCase().indexOf("measures") == 0);
                        this.model.pivotControl.refreshControl(); 
                        this.refreshControl();
                    }
                    else if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                        $(args.element).length > 0 ? $(args.element).parent().parent().remove() : $(args.target).parent().parent().remove();
                        for (var i = 0; i < this.model.pivotCalculations.length && headerTag.indexOf(this._getLocalizedLabels("Measures")) > -1; i++) {
                            uniqueName = this.model.pivotCalculations[i].Tag;
                            this._isMeasureBtnRemove = true;
                            selectedTreeNode = this.model.pivotControl._getNodeByUniqueName(uniqueName);
                            this._tableTreeObj.uncheckNode(selectedTreeNode);
                        }
                        this.element.find(".schemaNoClick").addClass("freeze").width($(this.element).width()).height($(this.element).height()).css({ "top": $(this.element).offset().top, "left": $(this.element).offset().left });
                        if (this.model.beforeServiceInvoke != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode)
                            this._trigger("beforeServiceInvoke", { action: "removeButton", element: this.element, customObject: this.model.pivotControl.model.customObject });
                        var eventArgs = JSON.stringify({ "action": "removeButton", "headerInfo": headerTag, "currentReport": report, "customObject": JSON.stringify(this.model.pivotControl.model.customObject), "gridLayout": this.model.pivotControl.model.layout });
                        if (headerTag.indexOf("[Measures]") < 0 && headerTag.indexOf("Measures") >= 0)
                            this.element.find(".schemaValue .pivotButton").remove();
                        if (this.model.pivotControl.model.enableDeferUpdate) {
                            this._removeButtonDeferUpdate = true;
                            this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.removeButton, eventArgs.replace("removeButton", "removeButtonDeferUpdate"), this._droppedSuccess)
                            this.element.find(".schemaNoClick").removeClass("freeze").removeAttr('style');
                        }
                        else {
                            this.doAjaxPost("POST", this.model.pivotControl.model.url + "/" + this.model.serviceMethods.removeButton, eventArgs, this._pvtBtnDroppedSuccess);
                        }
                    }
                }
                else {
                    selectedTreeNode = this.model.pivotControl._getNodeByUniqueName(uniqueName);
                    this._tableTreeObj.uncheckNode(selectedTreeNode);
                  }
            }
            else if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                headerText = $(args.element).length > 0 ? $(args.element).parent().find(".pvtBtn").attr("fieldname") : $(args.target).parent().find(".pvtBtn").attr("fieldname");
                if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    if (headerTag.split(":")[1].toLowerCase() == "measures") {
                        this.model.pivotControl._ogridWaitingPopup.show();
                        this.element.find("div[tag='" + headerTag + "']").remove();
                        for (var i = 0; i < this.model.pivotControl.model.dataSource.values[0]["measures"].length; i++) {
                            this._nodeCheck = true;
                            selectedTreeNode = this._tableTreeObj.element.find("li[tag='" + this.model.pivotControl.model.dataSource.values[0]["measures"][i].fieldName + "']");
                            this._tableTreeObj.uncheckNode(selectedTreeNode);
                            this.element.find("div[tag='values:" + this.model.pivotControl.model.dataSource.values[0]["measures"][i].fieldName + "']").remove();
                        }
                        this.model.pivotControl.model.dataSource.values[0]["measures"] = [];
                        ej.olap.base.getJSONData({ action: "removeButton" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                    }
                    selectedTreeNode = this._tableTreeObj.element.find("li[tag='" + headerText + "']");
                    if (selectedTreeNode.length > 1) {
                        for (var i = 0; i < selectedTreeNode.length; i++) {
                            if (this._tableTreeObj.isNodeChecked(selectedTreeNode[i]))
                                selectedTreeNode = selectedTreeNode[i];
                        }
                    }
                }
                else
                    selectedTreeNode = this._tableTreeObj.element.find("li[id=" + headerText + "]");
                this._tableTreeObj.uncheckNode(selectedTreeNode);
            }
            else {
                selectedTreeNode = this._tableTreeObj.element.find("li:contains('" + headerText + "')");
                this._tableTreeObj.uncheckNode(selectedTreeNode);
            }
        },

        _createDialog: function (title, treeViewData) {
            this.element.find(".e-dialog, .clientDialog").remove();

           var currentHierarchy, levelInfo, sortState, sortElements = "", clearFilterTag = "", seperator, groupDropDown = "", valueFilterTag = "", labelFilterTag = "", memberSearchEditor = "";
           var isAdvancedFilter = (
               this.model.pivotControl && 
               (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode && this.model.pivotControl.model.enableAdvancedFilter)||
               this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode && this.model.pivotControl.model.dataSource.enableAdvancedFilter &&
               ej.Pivot.getReportItemByFieldName(this._selectedFieldName, this.model.pivotControl.model.dataSource, this._dataModel).axis != "filters" && 
               (!ej.isNullOrUndefined(ej.Pivot.getReportItemByFieldName(this._selectedFieldName, this.model.pivotControl.model.dataSource, this._dataModel).item))? true : false);

           if (isAdvancedFilter) {
               currentHierarchy = this._selectedFieldName;
               if (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                   if (this.model.pivotControl.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap) {
                       levelInfo = $.map(this.model.pivotControl._currentReportItems, function (obj, index) { if (obj["fieldName"] == currentHierarchy) { return obj["dropdownData"]; } });
                       if (levelInfo.length == 0)
                           levelInfo = $.map(this._tableTreeObj.element.find("li[tag ='" + this._selectedFieldName + "'] li"), function (obj, index) { return { value: $(obj).attr("tag"), text: $(obj).find("a").text() }; });
                   }
                   else
                       levelInfo = [{ value: this._selectedFieldName, text: this._selectedFieldName }]
               }
               else if (this.model.pivotControl.model.analysisMode == ej.PivotGrid.AnalysisMode.Olap) {
                   var treeviewInfo = JSON.parse(treeViewData);
                   levelInfo = treeviewInfo.splice(treeviewInfo.length - 1, 1);
                   levelInfo = JSON.parse(levelInfo[0].levels);
                   treeViewData = JSON.stringify(treeviewInfo);
               }
               sortElements = (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) ? ej.Pivot.createAdvanceFilterTag({ action: "sort", fieldName: currentHierarchy }, this) :"";
               groupDropDown = ej.buildTag("div.ddlGroupWrap", this._getLocalizedLabels("SelectField") + ":" + ej.buildTag("input#GroupLabelDrop.groupLabelDrop").attr("type", "text")[0].outerHTML, {})[0].outerHTML;
               valueFilterTag = ej.Pivot.createAdvanceFilterTag({ action: "valueFiltering" },this);
               labelFilterTag = ej.Pivot.createAdvanceFilterTag({ action: "labelFiltering" },this);
               clearFilterTag = (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) ?  ej.Pivot.createAdvanceFilterTag({ action: "clearFilter", selectedLevel: (levelInfo.length > 0 ? levelInfo[0] : "") },this) :"";
           }
           memberSearchEditor = ej.buildTag("div.memberSearchEditorDiv", ej.buildTag("input#searchEditorTreeView.searchEditorTreeView").attr("type", "text")[0].outerHTML, { "padding": (this.model.pivotControl.model.enableAdvancedFilter ? "5px 5px 0px 9px" : 0) })[0].outerHTML;
           var dialogContent = ej.buildTag("div#EditorDiv.editorDiv", groupDropDown + sortElements + clearFilterTag + labelFilterTag + valueFilterTag + ej.buildTag("div", memberSearchEditor + ej.buildTag("div.memberEditorDiv", ej.buildTag("div#editorTreeView.editorTreeView")[0].outerHTML)[0].outerHTML)[0].outerHTML)[0].outerHTML + "</br>",
           dialogFooter = ej.buildTag("div", ej.buildTag("button#OKBtn.dialogOKBtn", this._getLocalizedLabels("OK"))[0].outerHTML + ej.buildTag("button#CancelBtn.dialogCancelBtn", this._getLocalizedLabels("Cancel"))[0].outerHTML, { "float": "right", "margin": (!ej.isNullOrUndefined(treeViewData) && $.parseJSON(treeViewData).length >= this.model.pivotControl.model.memberEditorPageSize ? "10px" : "-5px ") + " " + (isAdvancedFilter ? " 5px " : " 0px ") + " 6px 0px" })[0].outerHTML,
           editorNavPanel = ej.buildTag("div", ej.buildTag("div#NextpageDiv.nextPageDiv", ej.buildTag("div.e-icon e-media-backward_01 firstPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-left prevPage", {})[0].outerHTML + ej.buildTag("input.memberCurrentPage#memberCurrentPage", {}, { "width": "20px", "height": "10px" })[0].outerHTML + ej.buildTag("span.memberPageCount#memberPageCount")[0].outerHTML + ej.buildTag("div.e-icon e-arrowhead-right nextPage", {})[0].outerHTML + ej.buildTag("div.e-icon e-media-forward_01 lastPage", {})[0].outerHTML)[0].outerHTML)[0].outerHTML,
           ejDialog = ej.buildTag("div#clientDialog.clientDialog", dialogContent + (!ej.isNullOrUndefined(treeViewData) && this.model.pivotControl.model.enableMemberEditorPaging && ($.parseJSON(treeViewData).length >= this.model.pivotControl.model.memberEditorPageSize || this.model.pivotControl.model.memberEditorPageSize < this.model.pivotControl._memberPageSettings._endPage) ? editorNavPanel : "") + dialogFooter, { "opacity": "1" }).attr("title", title)[0].outerHTML,

           treeViewData = JSON.parse(treeViewData),
            selectedData;
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
            if (this.model.pivotControl.model.enableMemberEditorPaging && (treeViewData.length >= this.model.pivotControl.model.memberEditorPageSize || this.model.pivotControl.model.memberEditorPageSize < this.model.pivotControl._memberPageSettings._endPage)) {
                this.element.find(".prevPage, .firstPage").addClass("disabled");
                this.element.find(".nextPage, .lastPage").addClass("enabled");
                this.element.find(".memberPageCount").html("/ " + Math.round(this._memberCount / this.model.pivotControl.model.memberEditorPageSize));
                this.element.find(".memberCurrentPage").val(this.model.pivotControl._memberPageSettings.currentMemeberPage);
                this.model.pivotControl._memberPageSettings.currentMemeberPage > 1 ? this.element.find(".prevPage, .firstPage").removeClass("disabled").addClass("enabled") : this.element.find(".prevPage, .firstPage").removeClass("enabled").addClass("disabled");
                this.model.pivotControl._memberPageSettings.currentMemeberPage == parseInt(this.element.find(".memberPageCount").text().split("/")[1].trim()) ? this.element.find(".nextPage, .lastPage").removeClass("enabled").addClass("disabled") : this.element.find(".nextPage, .lastPage").removeClass("disabled").addClass("enabled");
            }
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
            if (isAdvancedFilter)
            {
                this.element.find(".filterElementTag").ejMenu({
                    menuType: ej.MenuType.NormalMenu,
                    width: "100%",
                    enableRTL:this.model.enableRTL,
                    orientation: ej.Orientation.Vertical,
                    click: ej.proxy(this._filterElementClick, this)
                });
                this.element.find(".groupLabelDrop").ejDropDownList({
                    width: "99%",
                    enableRTL: this.model.enableRTL,
                    dataSource: levelInfo,
                    fields: { id: "id", text: "text", value: "value" },
                    change: ej.proxy(this._groupLabelChange, this)
                });
                var selectedlevel = ej.isNullOrUndefined(this._selectedLevel) ? "" : this._selectedLevel;
                selectedlevel=  $.map(levelInfo, function (obj, index) { if(obj.value.toLowerCase()==selectedlevel.toLowerCase())return obj.text; });

                var levelDropTarget = this.element.find('.groupLabelDrop').data("ejDropDownList");
                levelDropTarget.selectItemByText((selectedlevel.length > 0) ? selectedlevel[0] : levelDropTarget.model.dataSource[0].text);

                this.element.find(".memberEditorDiv").addClass("advancedFilter");
                this.element.find(".clearAllFilters").click(ej.proxy(this._clearAllFilter, this));
                this.element.find(".clearSorting").click(ej.proxy(this.model.pivotControl._clearSorting, this.model.pivotControl));
            }
            var treeViewElements = this.element.find(".editorTreeView").find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                treeViewElements[i].setAttribute("tag", treeViewData[i].tag);
            }
            this.element.find(".dialogOKBtn, .dialogCancelBtn").ejButton({ type: ej.ButtonType.Button, click: ej.proxy(this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode ? this._clientDialogBtnClick: this._dialogBtnClick, this) });
            this._dialogOKBtnObj = this.element.find(".dialogOKBtn").data("ejButton");
            this._memberTreeObj = this.element.find(".editorTreeView").data("ejTreeView");
            var treeViewLi = this.element.find(".editorTreeView li:gt(0)"), firstNode = $(this._memberTreeObj.element.find("li:first")).find("div .e-chkbox-small > span > span:eq(0)"),
            uncheckedNodes = $(treeViewLi).find(":input.nodecheckbox:not(:checked)");
            if (uncheckedNodes.length > 0) {
                $(firstNode).removeClass("e-checkmark").addClass("e-stop");
            }
            if (!ej.isNullOrUndefined(this.model.pivotControl._unSelectedNodes) && this.model.pivotControl._isMemberPageFilter) {
                var unSelectedNodes = this.model.pivotControl._unSelectedNodes;
                $.map(treeViewLi, function (ele, index) {
                    var member = ele;
                    $.map(unSelectedNodes, function (item, index) {
                        if ($(member).attr("tag") == item.tag) {
                            $($(member).find("div .e-chkbox-small > span > span:eq(0)")).removeClass("e-checkmark");
                            $(firstNode).removeClass("e-checkmark").addClass("e-stop");
                        }
                    })
                })
            }
            this.element.find(".clientDialog").ejDialog({ width: 265, target: "#" + this._id, enableResize: false, enableRTL: this.model.enableRTL, close: ej.proxy(ej.Pivot.closePreventPanel, this) });
            this.element.find(".clientDialog").next(".e-scrollbar").hide();
            this.element.find(".e-dialog .e-close").attr("title", this._getLocalizedLabels("Close"));
            if (isAdvancedFilter) {
                this.element.find("#clientDialog_wrapper").addClass("advancedFilterDlg");
                if (this._droppedClass != "schemaFilter") {
                    this.element.find(".clientDialog").css("padding", "0px").parents().parents().find(".e-titlebar").remove();
                    var reportItem = ej.Pivot.getReportItemByFieldName(currentHierarchy, this.model.pivotControl.model.dataSource).item, selectedOrder;
                    if (reportItem) {
                        if (reportItem["sortOrder"] && reportItem["sortOrder"] != ej.olap.SortOrder.None) {
                            selectedOrder = (reportItem["sortOrder"] == ej.olap.SortOrder.Descending) ? "desc" : "asc";
                            if (ej.isNullOrUndefined(selectedOrder) || selectedOrder == "asc")
                                this.element.find(".clientDialog .ascImage").addClass("selectedSort");
                            else
                                this.element.find(".clientDialog .descImage").addClass("selectedSort");
                        }
                    }
                }
            }
            this._memberTreeObj.model.nodeCheck = ej.proxy(this._nodeCheckChanges, this);
            this._memberTreeObj.model.nodeUncheck = ej.proxy(this._nodeCheckChanges, this);
            (this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) ? this._memberTreeObj.model.beforeExpand = ej.proxy(this._beforeNodeExpand, this) : this._memberTreeObj.model.nodeClick = ej.proxy(this._nodeExpand, this);
            if (this._memberTreeObj.element.find(".e-plus").length == 0) {
                this._memberTreeObj.element.find(".e-item").css("padding", "0px");
            }
            this._isFiltered = false;
            this.model.pivotControl._isMemberPageFilter = false
            if (!ej.isNullOrUndefined(pschemaDesignerWaitingPopup))
                pschemaDesignerWaitingPopup.hide();
        },

        _filterElementClick: function (args) {
            this.model.pivotControl._selectedField = this._selectedFieldName;
            if (this.model.pivotControl && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                this.model.pivotControl._filterElementClick(args, this);
                return false;
            }
            if ($(args.element).parent().hasClass("filterElementTag")) return;

            var currentHierarchy = this._selectedFieldName;
            if (!ej.isNullOrUndefined(args.element)) 
                this._filterAction = $(args.element).parents(".filterElementTag")[0].textContent.indexOf("Label Filters") > -1 ? "labelFiltering" : "valueFiltering";            
            else 
                this._filterAction = args.menuId == "valueFilterBtn" ? "valueFiltering" : args.menuId == "labelFilterBtn" ? "labelFiltering" : "";            
            var selectedLevelInfo = this.element.find(".groupLabelDrop").data("ejDropDownList");
            this._selectedLevelUniqueName = selectedLevelInfo.getSelectedValue();
            this.element.find(".e-dialog, .filterDialog, #preventDiv").remove();
            if ($.trim(args.text) == $.trim(this._getLocalizedLabels("ClearFilter"))) {
                this._clearFilter(currentHierarchy, this._selectedLevelUniqueName, this.model.pivotControl.model.dataSource);
                if (this.model.pivotControl && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                    ej.PivotAnalysis._valueFilterArray = $.grep(ej.PivotAnalysis._valueFilterArray, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() != currentHierarchy.toLowerCase())) return obj; });
                    this.model.pivotControl.refreshControl();
                }
                else {
                    ej.olap.base.getJSONData({ action: "advancedfiltering" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
                }
                return false;
            }
            else {
                var dialogtitle, hierarchyLi, isHierarchyNode = false;
                var dialogContent, dropdownValues, filterValue = this._getAdvancedFiltervalue(currentHierarchy, this._selectedLevelUniqueName), topCountFilterParams = "";
                filterValue = ($(args.element).find(".activeFilter").length>0 &&  filterValue.length > 0) ? filterValue[0].values : [""];
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

                        var valueItems = (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) ?
                            this.model.pivotControl.model.dataSource.values : this.model.pivotControl.model.dataSource.values[0]["measures"];
                        for (var i = 0; i < valueItems.length ; i++)
                            measureNames.push({ "option": valueItems[i].fieldCaption, "value": valueItems[i].fieldName });
                    innerContent =   ej.buildTag("td", "<input type='text' id='filterMeasures' class='filterMeasures' />").attr("width", "180px")[0].outerHTML +
                                     ej.buildTag("td", "<input type='text' id='filterOptions' class='filterOptions'/>").attr("width", "180px")[0].outerHTML +
                                     ej.buildTag("td.filterValuesTd", "<input type='text' id='filterValue1' value='" + filterValue[0] + "' style='display:inline; width:190px; height:19px;' class='filterValues'/>" + (colSpan == "4" ? "<span> and </span><input type='text' id='filterValue2' value='" + (filterValue[1] != undefined ? filterValue[1] : "") + "' style='display:inline; width:190px; height:19px;' class='filterValues'/> </br>" : "</br>"))[0].outerHTML;

                    dialogContent =  ej.buildTag("table.valuefilter",
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
                    (this.model.pivotControl && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot ? this._selectedFieldName : this._selectedLevelUniqueName.split('.')[2].replace(/\[/g, '').replace(/\]/g, ''))
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

                    if (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl.model.dataSource.values.length > 0)
                        this._measureDDL.setSelectedText(this.model.pivotControl.model.dataSource.values[0]["fieldCaption"]);
                    else if (this.model.pivotControl.model.dataSource.values[0]["measures"].length > 0)
                        this._measureDDL.setSelectedText(this.model.pivotControl.model.dataSource.values[0]["measures"][0]["fieldCaption"]);
                }

                var dialogObj = this.element.find("#filterDialog").data("ejDialog");
                this.element.find("#filterDlgOKBtn").ejButton({ click: ej.proxy(this._filterElementOkBtnClick, this) });
                this.element.find("#filterDlgCancelBtn").ejButton({
                    type: ej.ButtonType.Button,
                    click: function () {
                        $(".e-dialog").hide();
                        var pGridObj = $(this.element).parents(".e-pivotgrid").data("ejPivotGrid");
                        if (!ej.isNullOrUndefined(pGridObj))
                            ej.Pivot.closePreventPanel(pGridObj);
                    }
                });
            }
        },
        _getAdvancedFiltervalue: function (hierarchyUqName, levelUqName) {
            
            var filterItem = ej.Pivot.getReportItemByFieldName(hierarchyUqName, this.model.pivotControl.model.dataSource, "XMLA").item, levelItem = [];
            if ( filterItem.advancedFilter)
                levelItem = $.map(filterItem.advancedFilter, function (obj, index) { if (obj.name != undefined && (obj.name.toLocaleLowerCase() == levelUqName.toLowerCase())) return obj; });
            return levelItem;

        },
        _filterOptionChanged: function (args) {
            var filterValue = this._getAdvancedFiltervalue(this._selectedFieldName, this._selectedLevelUniqueName);
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
            var selectedOperator = this.element.find(".filterOptions")[0].value,
                enteredValue = [this.element.find("#filterValue1")[0].value],
                filterInfo = [], currentHierarchy = this._selectedFieldName,
                currentLevelInfo = this._selectedLevelUniqueName.toLowerCase();

            if (this._filterAction == "valueFiltering") {
                if (!(!isNaN(parseFloat(enteredValue[0])) && isFinite(enteredValue[0])) || this._measureDDL.getSelectedValue() == "") { return; };
                this.element.find("#filterValue2")[0] != undefined ? "," + enteredValue.push(this.element.find("#filterValue2")[0].value) : enteredValue;
            }
            this.element.find(".e-dialog").remove();
            var reportItem = ej.Pivot.getReportItemByFieldName(currentHierarchy, this.model.pivotControl.model.dataSource).item
            if (reportItem) {
                delete reportItem["filterItems"];
                if (reportItem["advancedFilter"])
                    filterInfo = $.map(reportItem["advancedFilter"], function (obj, index) { if (obj.name != undefined && (obj.name.toLocaleLowerCase() != currentLevelInfo.toLowerCase())) return obj; });
                if (this._filterAction.toLowerCase() == "labelfiltering")
                    filterInfo.push({ name: this._selectedLevelUniqueName, labelFilterOperator: selectedOperator.replace(/ /g, ""), advancedFilterType: ej.olap.AdvancedFilterType.LabelFilter, values: enteredValue });
                else
                    filterInfo.push({ name: this._selectedLevelUniqueName, valueFilterOperator: selectedOperator.replace(/ /g, ""), advancedFilterType: ej.olap.AdvancedFilterType.ValueFilter, values: enteredValue, measure: this._measureDDL.getSelectedValue() });

                this.model.pivotControl._currentReportItems = $.grep(this.model.pivotControl._currentReportItems, function (value, i) { if (value["fieldName"] != currentHierarchy) return value; });
                reportItem["advancedFilter"] = filterInfo;
            }
            if (this.model.pivotControl && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                ej.PivotAnalysis._valueFilterArray = $.grep(ej.PivotAnalysis._valueFilterArray, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() != currentHierarchy.toLowerCase())) return obj; });
                if (this._filterAction == "valueFiltering" && !ej.isNullOrUndefined(reportItem)) {
                    ej.PivotAnalysis._valueFilterArray.push(reportItem);
                }
                this.model.pivotControl.refreshControl();
            }
            else
                ej.olap.base.getJSONData({ action: "advancedfiltering" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
        },
        _groupLabelChange: function (args) {
            if (this.model.pivotControl && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) {
                this.model.pivotControl._selectedLevelUniqueName = args.selectedValue;
                var filterInfo = [], filterIndicator = ej.buildTag("span.filterState").addClass("e-icon").attr("aria-label", "filter state")[0].outerHTML;
                if (this.model.pivotControl._excelFilterInfo.length > 0) {
                    var levelName = this.model.pivotControl._selectedLevelUniqueName, hierarchyName = this.model.pivotControl._selectedFieldName;
                    filterInfo = $.map(this.model.pivotControl._excelFilterInfo, function (item, index) {
                        if (item.hierarchyUniqueName == hierarchyName && item.levelUniqueName == levelName)
                            return { action: item.action, operator: item.operator, value1: item.value1 };
                    });
                }
                this.element.find(".filterElementTag .activeFilter,.filterState").remove();
                this.element.find(".clearFilter").css("opacity", "0.5").attr("disable", true);

                if (filterInfo.length > 0 && !ej.isNullOrUndefined(filterInfo[0]["operator"])) {
                    var filterTag = (filterInfo[0].action == "valuefiltering") ? "valueFilterBtn" : "labelFilterBtn";
                    this.element.find("#" + filterTag + " a:eq(0)").append(filterIndicator);
                    this.element.find("#" + filterTag + " .clearFilter").removeAttr("style disable");
                    if (filterInfo[0]["operator"].replace(/ /g, '') == "BottomCount") {
                        this.element.find("#" + filterTag + " ." + filterInfo[0]["operator"].replace(/ /g, '').replace("Bottom", "top") + " a").append($(ej.buildTag("span.activeFilter e-icon")[0].outerHTML));
                    }
                    else
                        this.element.find("#" + filterTag + " ." + filterInfo[0]["operator"].replace(/ /g, '') + " a").append($(ej.buildTag("span.activeFilter e-icon")[0].outerHTML));
                }
                else {
                    if (this._getUnSelectedNodes() != "")
                        this.element.find(".memberEditorDiv").before("<div class='filterState e-icon' style='top:126px;position:absolute' />");
                }
                return false;
            }
            var me = this;//this.element.hasClass("e-pivotschemadesigner") ? this.model.pivotControl : 
            var selectedLevelInfo = this.element.find(".groupLabelDrop").length > 0 ? this.element.find(".groupLabelDrop").data("ejDropDownList") : [];
            var filterData = me._getAdvancedFiltervalue(me._selectedFieldName, selectedLevelInfo.getSelectedValue());

            var valueFilterMenuObj = this.element.find("#valueFilterBtn").data("ejMenu");
            var labelFilterMenuObj = this.element.find("#labelFilterBtn").data("ejMenu");
            var isIncludeFilter = ej.Pivot.getReportItemByFieldName(me._selectedFieldName, me.model.pivotControl.model.dataSource).item;
            var filterIndicator = ej.buildTag("span.filterState").addClass("e-icon").attr("aria-label", "filter state")[0].outerHTML;
            var activeFilter = ej.buildTag("span.activeFilter").addClass("e-icon")[0].outerHTML

            valueFilterMenuObj.disableItem("Clear Filter");
            labelFilterMenuObj.disableItem("Clear Filter");

            var reportItem = ej.Pivot.getReportItemByFieldName(me._selectedFieldName, me.model.pivotControl.model.dataSource).item, selectedOrder;
            if (reportItem) {
                if (reportItem["sortOrder"] && reportItem["sortOrder"] != ej.olap.SortOrder.None) {
                    selectedOrder = (reportItem["sortOrder"] == ej.olap.SortOrder.Descending) ? "desc" : "asc";
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
            else if ((isIncludeFilter.length > 0 && isIncludeFilter[0]["filterItems"]) || (this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && isIncludeFilter && isIncludeFilter.filterItems)) {
                this.element.find(".memberEditorDiv").before(filterIndicator);
                this.element.find(".filterState").addClass("memberFilter");
                this.element.find(".clearAllFilters").css("opacity", "1").removeAttr("disabled");
            }
        },

        _clearAllFilter: function (args) {
            ej.Pivot.closePreventPanel(this);
            this.element.find(".e-dialog").remove();
            this._clearFilter(this._selectedFieldName, this._selectedLevelUniqueName, this.model.pivotControl.model.dataSource);
            var reportItem = ej.Pivot.getReportItemByFieldName(this._selectedFieldName, this.model.pivotControl.model.dataSource);
            if (reportItem && reportItem.item && reportItem.item.filterItems)
                reportItem.item.filterItems.values = [];
            if (this.model.pivotControl && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot) {
                var fieldName = this._selectedFieldName;
                ej.PivotAnalysis._valueFilterArray = $.grep(ej.PivotAnalysis._valueFilterArray, function (obj, index) { if (obj.fieldName != undefined && (obj.fieldName.toLowerCase() != fieldName.toLowerCase())) return obj; });
                this.model.pivotControl.refreshControl();
            }
            else
                ej.olap.base.getJSONData({ action: "advancedfiltering" }, this.model.pivotControl.model.dataSource, this.model.pivotControl);
        },

        _clearFilter: function (currentHierarchy, currentLevelInfo, dataSource) {
            var reportItem = ej.Pivot.getReportItemByFieldName(currentHierarchy, dataSource);
            if (reportItem.item && reportItem.item["advancedFilter"]) {
                currentLevelInfo =(this.model.pivotControl && this.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Pivot && this.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) ? currentHierarchy: currentLevelInfo;
                reportItem.item["advancedFilter"] = $.map(reportItem.item["advancedFilter"], function (obj, index) { if (obj.name != undefined && (obj.name.toLowerCase() != currentLevelInfo.toLowerCase())) return obj; });
            }
        },
        _createPivotButton: function (text, axis, isFiltered, isSorted, dropPostion) {
            var filtered = "", descending = "";
            if (isFiltered) { filtered = "filtered" };
            if (isSorted) { descending = "descending" };
            var pvtAxis = axis == "row" ? ".schemaRow" : axis == "column" ? ".schemaColumn" : axis == "value" ? ".schemaValue" : ".schemaFilter";
            if (this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                var tagAxis = axis == "column" ? "Columns" : axis == "row" ? "Rows" : axis == "filter" ? "Slicers" : "values";
              //test  var rowBtn = ej.buildTag("div.pivotButton", ej.buildTag("div.dropIndicator")[0].outerHTML + ej.buildTag("button.pvtBtn#pivotButton" + text.fieldName, ((text.fieldCaption != undefined) ? text.fieldName : text.fieldCaption), {}, { "fieldName": text.fieldName, "axis": tagAxis })[0].outerHTML +
                var sortBtn = (axis == "column" || axis == "row") && this.model.layout != "excel" && this._dataModel != "Olap" && this._dataModel != "XMLA" ? ej.buildTag("span.sorting e-icon " + descending).attr("role", "button").attr("aria-label", "sort").attr("aria-expanded", "false")[0].outerHTML : "",
                filterBtn = (axis == "column" || axis == "row" || axis == "filter") && this.model.layout != "excel" && text.fieldCaption != "Measures" ? ej.buildTag("span.filter e-icon " + filtered).attr("role", "button").attr("aria-label", "filter")[0].outerHTML : "",
                removeBtn = this.model.layout != "excel" ? ej.buildTag("span.removeBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML : "",
                    rowBtn = ej.buildTag("div.pivotButton", ej.buildTag("div.dropIndicator")[0].outerHTML + ej.buildTag("div.pvtBtnDiv", ej.buildTag("button.pvtBtn#pivotButton" + text.fieldName, this.model.pivotControl._dataModel != "XMLA" ? $.grep(this.model.pivotTableFields, function (item) { return item.name == text.fieldName; })[0].caption : text.fieldCaption, {}, { "fieldName": text.fieldName, "axis": tagAxis })[0].outerHTML +
                   filterBtn + sortBtn + removeBtn).attr("tag", tagAxis + ":" + text.fieldName)[0].outerHTML).attr("tag", tagAxis + ":" + text.fieldName)[0].outerHTML;
            }
            else {
                var tagAxis = axis == "column" ? "Columns" : axis == "row" ? "Rows" : axis == "filter" ? "Slicers" : "values";
                var sortBtn = (axis == "column" || axis == "row") && this.model.layout != "excel" && this._dataModel != "Olap" && this._dataModel != "XMLA" ? ej.buildTag("span.sorting e-icon " + descending).attr("role", "button").attr("aria-label", "sort").attr("aria-expanded", "false")[0].outerHTML : "",
                filterBtn = (axis == "column" || axis == "row" || axis == "filter") && this.model.layout != "excel" && text.fieldCaption != "Measures" ? ej.buildTag("span.filter e-icon " + filtered).attr("role", "button").attr("aria-label", "filter")[0].outerHTML : "",
                removeBtn = this.model.layout != "excel" ? ej.buildTag("span.removeBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML : "",
                rowBtn = ej.buildTag("div.pivotButton", ej.buildTag("div.dropIndicator")[0].outerHTML + ej.buildTag("div.pvtBtnDiv", ej.buildTag("button.pvtBtn#pivotButton" + text, this._dataModel == "Pivot" ? text : text == "Measures" ? text : (!ej.isNullOrUndefined(text["fieldCaption"]) ? text["fieldCaption"] : text.split(".")[1]))[0].outerHTML +
                filterBtn + sortBtn + removeBtn).attr("tag", tagAxis + ":" + text)[0].outerHTML).attr("tag", tagAxis + ":" + (!ej.isNullOrUndefined(text["fieldName"]) ? text["fieldName"] : text))[0].outerHTML;
            }
            if (typeof (dropPostion) == "number" && $(this.element.find(pvtAxis + " .pivotButton")[dropPostion]).length > 0)
                axis == "row" ? $(this.element.find(".schemaRow .pivotButton")[dropPostion]).before(rowBtn) : axis == "column" ? $(this.element.find(".schemaColumn .pivotButton")[dropPostion]).before(rowBtn) :
            axis == "value" ? $(this.element.find(".schemaValue .pivotButton")[dropPostion]).before(rowBtn) : axis == "filter" ? $(this.element.find(".schemaFilter .pivotButton")[dropPostion]).before(rowBtn) : "";
            else
                axis == "row" ? this.element.find(".schemaRow").append(rowBtn) : axis == "column" ? this.element.find(".schemaColumn").append(rowBtn) :
            axis == "value" ? this.element.find(".schemaValue").append(rowBtn) : axis == "filter" ? this.element.find(".schemaFilter").append(rowBtn) : "";
            var pvtExp = (typeof (dropPostion) != "number" && dropPostion == "") ? " .pivotButton .pvtBtn:last" : " .pivotButton .pvtBtn:eq(" + dropPostion + ")";
            if (this.model.enableDragDrop) {
                this.element.find(pvtAxis + pvtExp).ejButton({ size: "normal", type: ej.ButtonType.Button, enableRTL: this.model.enableRTL }).ejDraggable({
					handle: 'button', clone: true,
					cursorAt: { left: -5, top: -5 },
					dragStart: ej.proxy(function (args) {
						this._isDragging = true;
					}, this),
					dragStop: ej.proxy(this.model.pivotControl.model.operationalMode==ej.Pivot.OperationalMode.ServerMode?this._pvtBtnDropped:this._clientOnPvtBtnDropped, this),
					helper: ej.proxy(function (event, ui) {
					    $(event.element).addClass("dragHover");
						if (event.sender.target.className.indexOf("e-btn") > -1) {
							var btnClone = $(event.sender.target).clone().attr("id",this._id+"_dragClone").appendTo('body');
                            $("#"+this._id + "_dragClone").removeAttr("style").height($(event.sender.target).height());
                            return btnClone;            
                        }
						else
							return false;
					}, this)
				});
			}
            this.element.find(pvtAxis + " .pivotButton .filterBtn:last").ejButton({
                size: "normal",
                enableRTL: this.model.enableRTL,
                type: ej.ButtonType.Button,
                contentType: "imageonly",
                prefixIcon: "filter"
            });
            this.element.find(pvtAxis + " .pivotButton input:last").ejToggleButton({
                size: "normal",
                enableRTL: this.model.enableRTL,
                contentType: "imageonly",
                defaultPrefixIcon: "ascending",
                activePrefixIcon: "descending",
                click: ej.proxy(this._sortBtnClick, this)
            });
            if (isSorted) {
                this.element.find(pvtAxis + " .pivotButton:contains(" + text + ") span:eq(0) span").removeClass("ascending").addClass("descending");
                this.element.find(pvtAxis + " .pivotButton:contains(" + text + ") span:eq(0) button").addClass("e-active");
            }
            if (this.model.pivotControl._dataModel == "XMLA") {
                if (this.element.find(".pivotButton[tag*=':Measures']").length > 0) {
                    var cloneBtn = $(pvtAxis + " .pivotButton[tag*=':Measures']");
                    $(pvtAxis).append(cloneBtn);
                }
            }
            this.element.find(".dropIndicator").removeClass("dropIndicatorHover");
            this._createContextMenu();
        },

        _createContextMenu: function () {
            var ele = this.element.find(".pivotButton");
            if (this.model.pivotControl != null) {
                var contextTag = ej.buildTag("ul.pivotTreeContextMenu#pivotTreeContextMenu", ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToFilter"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToRow"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToColumn"))[0].outerHTML)[0].outerHTML + ej.buildTag("li", ej.buildTag("a", this._getLocalizedLabels("AddToValues"))[0].outerHTML)[0].outerHTML)[0].outerHTML;
                $(this.element).append(contextTag);
                $("#pivotTreeContextMenu").ejMenu({
                    menuType: ej.MenuType.ContextMenu,
                    enableRTL: this.model.enableRTL,
                    openOnClick: false,
                    contextMenuTarget: ele,
                    click: ej.proxy(this._contextClick, this),
                    beforeOpen: ej.proxy(this._onContextOpen, this),
                    close: ej.proxy(ej.Pivot.closePreventPanel, this)
                });
            }
        },

        _createPivotButtons: function (rows, axis) {
            if (!ej.isNullOrUndefined(rows)) {
                var rowBtns = "", tagAxis = axis == "column" ? "Columns" : axis == "row" ? "Rows" : axis == "filter" ? "Slicers" : "";
                if (this.model.pivotControl != null && this.model.pivotControl.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                    var tagAxis = axis == "column" ? "Columns" : axis == "row" ? "Rows" : axis == "filter" ? "Slicers" : "values";
                    if (tagAxis == "values" && this.model.pivotControl._dataModel == "XMLA")
                        rows = $.map(rows, function (obj, index) { return obj["measures"]; });
                    for (var i = 0; i < rows.length; i++) {
                        var filter = (this.model.pivotControl._dataModel == "XMLA" || this.model.pivotControl._dataModel == "Olap") ? "" : !ej.isNullOrUndefined(rows[i].filterItems) ? "filtered" : "";
                        var sort = (this.model.pivotControl._dataModel == "XMLA" || this.model.pivotControl._dataModel == "Olap") ? "" : rows[i].sortOrder == ej.PivotAnalysis.SortOrder.Descending ? "descending" : "";
                        var buttonId = this.model.pivotControl._dataModel == "XMLA" ? "" : rows[i].fieldName;
                        var sortBtn = (axis == "column" || axis == "row") && this.model.layout != "excel" && this.model.pivotControl._dataModel != "Olap" && this.model.pivotControl._dataModel != "XMLA" ? ej.buildTag("span.sorting e-icon " + sort).attr("role", "button").attr("aria-label", "sort").attr("aria-expanded", "false")[0].outerHTML : "",
                        filterBtn = (axis == "column" || axis == "row" || axis == "filter") && this.model.layout != "excel" && rows[i].fieldCaption != "Measures" ? ej.buildTag("span.filter e-icon " + filter).attr("role", "button").attr("aria-label", "filter")[0].outerHTML : "",
                        removeBtn = this.model.layout != "excel" ? ej.buildTag("span.removeBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML : "";
                        rowBtns += ej.buildTag("div.pivotButton",
                                    ej.buildTag("div.dropIndicator")[0].outerHTML + ej.buildTag("div.pvtBtnDiv",
                                    ej.buildTag("button.pvtBtn#pivotButton" + buttonId, this.model.pivotControl._dataModel == "XMLA" ? (rows[i].fieldCaption != undefined ? rows[i].fieldCaption : rows[i].fieldName) || rows[i] : $.grep(this.model.pivotTableFields, function (item) { return item.name == rows[i].fieldName; })[0].caption || $.grep(this.model.pivotTableFields, function (item) { return item.name == rows[i]; })[0].caption, {}, { "fieldName": rows[i].fieldName || rows[i], "axis": tagAxis })[0].outerHTML +   //+#pivotButton rows[i].fieldName || rows[i]
                                    filterBtn + sortBtn + removeBtn).attr("tag", tagAxis + ":" + rows[i].fieldName || rows[i])[0].outerHTML).attr("tag", tagAxis + ":" + rows[i].fieldName || rows[i])[0].outerHTML;
                    }
                }
                else {
                    if (tagAxis == "" && axis == "values") {
                        var tempAxis = this.element.find(".pivotButton:contains(" + this._getLocalizedLabels("Measures") + ")").length > 0 ? this.element.find(".pivotButton:contains('" + this._getLocalizedLabels("Measures") + "')").parent()[0].className.split(" ")[0] : "schemaColumn";
                        tagAxis = tempAxis == "schemaColumn" ? "Columns" : "Rows";
                    }
                    for (var i = 0; i < rows.length; i++) {
                        rows[i].FieldHeader = rows[i].FieldHeader == "Measures" ? this._getLocalizedLabels("Measures") : rows[i].FieldHeader;
                        var sortBtn = (axis == "column" || axis == "row") && this.model.layout != "excel" && this._dataModel != "Olap" && this._dataModel != "XMLA" ? ej.buildTag("span.sorting e-icon ").attr("role", "button").attr("aria-label", "sort").attr("aria-expanded", "false")[0].outerHTML : "",
                        filterBtn = (axis == "column" || axis == "row" || axis == "filter") && this.model.layout != "excel" && rows[i].FieldHeader != "Measures" ? ej.buildTag("span.filter e-icon").attr("role", "button").attr("aria-label", "filter")[0].outerHTML : "",
                        removeBtn = this.model.layout != "excel" ? ej.buildTag("span.removeBtn e-icon").attr("role", "button").attr("aria-label", "remove")[0].outerHTML : "";
                        rowBtns += ej.buildTag("div.pivotButton", ej.buildTag("div.dropIndicator")[0].outerHTML + ej.buildTag("div.pvtBtnDiv", ej.buildTag("button.pvtBtn#pivotButton" + rows[i].FieldHeader || rows[i].FieldName || rows[i].Name || rows[i].DimensionName, rows[i].FieldHeader || rows[i].FieldName || rows[i].Name || rows[i].DimensionName)[0].outerHTML +
                        filterBtn + sortBtn + removeBtn).attr("tag", tagAxis + ":" + rows[i].Tag)[0].outerHTML).attr("tag", tagAxis + ":" + rows[i].Tag)[0].outerHTML;
                    }
                }
                this._createContextMenu();
                return rowBtns;
            }
        },

        _setSplitBtnTargetPos: function (event) {
            var targetPosition = ""; var AEBdiv; var targetSplitBtn; var className;
            if (event.event != undefined && event.event.type == "touchend") {
                targetSplitBtn = event.event.originalEvent.target != null ? $(event.event.originalEvent.target).parents(".pivotButton") : $(event.event.originalEvent.srcElement).parents(".pivotButton");
                className = event.event.originalEvent.target != null ? event.event.originalEvent.target.className : event.event.originalEvent.srcElement.className;
            }
            else {
                targetSplitBtn = ej.isNullOrUndefined(event.originalEvent) ? $(event.target).parents(".pivotButton") : event.originalEvent.target != null ? $(event.originalEvent.target).parents(".pivotButton") : $(event.originalEvent.srcElement).parents(".pivotButton");
                className = ej.isNullOrUndefined(event.originalEvent) ? event.target[0].className : event.originalEvent.target != null ? event.originalEvent.target.className : event.originalEvent.srcElement.className;
            }
            this._droppedClass = targetSplitBtn.length > 0 ? $(targetSplitBtn[0]).parent()[0].className.split(" ")[0] : className.split(" ")[0];
            if (targetSplitBtn[0] || (className != undefined && className != null && jQuery.type(className) == "string" && className.indexOf("pivotButton") > -1)) {
                targetSplitBtn = targetSplitBtn[0] ? targetSplitBtn[0] : event.originalEvent.target != null ? event.originalEvent.target : event.originalEvent.srcElement;
                if (event.event != undefined && event.event.type == "touchend")
                    AEBdiv = event.target;
                else if (this._droppedClass != null && this._droppedClass != undefined && this._droppedClass != "")
                    AEBdiv = this.element.find("." + this._droppedClass)[0];
                else
                    AEBdiv = targetSplitBtn.parentNode;
                AEBdiv =$(AEBdiv).children(".pivotButton");
                for (var i = 0; i < AEBdiv.length; i++) {
                    if ($(AEBdiv[i]).attr("tag") == $(targetSplitBtn).attr("tag"))
                        targetPosition = i;
                }
            }
            return targetPosition;
        },

        _getUnSelectedNodes: function () {
            var treeElement = this.element.find(".editorTreeView")[0];
            var unselectedNodes = "";
            var data = $(treeElement).find(":input.nodecheckbox:not(:checked)");
            for (var i = 0; i < data.length; i++) {
                if (!($(data[i].parentElement).find('span:nth-child(1)').attr('class').indexOf("e-chk-act") > -1) && $(data[i].parentElement).attr('aria-checked') != 'mixed') {
                    var parentNode = $(data[i]).parents('li:eq(0)');
                    unselectedNodes += "::" + parentNode[0].id + "||" + $(parentNode).attr('tag');
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

        doAjaxPost: function (type, url, data, onSuccess, onComplete, customArgs) {
            this.model.pivotControl.model.editCellsInfo = {};
            var contentType, dataType, successEvt, isAsync = true;
            if ((data["XMLA"] == undefined))
                contentType = 'application/json; charset=utf-8', dataType = 'json', successEvt = $.proxy(onSuccess, this);
            else
                contentType = 'text/xml', dataType = 'xml', data = data["XMLA"], successEvt = $.proxy(onSuccess, this, customArgs), isAsync = (!ej.isNullOrUndefined(customArgs) && customArgs["action"] != "loadFieldElements") ? true : false;
            $.ajax({
                type: type,
                url: url,
                contentType: contentType,
                dataType: dataType,
                async: isAsync,
                data: data,
                success: successEvt,
                complete: $.proxy(onComplete, this),
                error: function (msg, textStatus, errorThrown) {
                    this.model.pivotControl._ogridWaitingPopup.hide();
                }
            });
        },
    });

    ej.PivotSchemaDesigner.Locale = {};

    ej.PivotSchemaDesigner.Locale["en-US"] = {
        Sort: "Sort",
        Search: "Search",
        SelectField: "select Field",
        LabelFilterLabel: "Show the items for which the label",
        ValueFilterLabel: "Show the items for which",

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

        ClearFilter: "Clear Filter",
        SelectField:"select Field",
        Measures: "Measures",
        Warning: "Warning",
        AlertMsg:"The field you are moving cannot be placed in that area of the report",
        Goal: "Goal",
        Status:"Status",
        Trend:"Trend",
        Value: "value",
        AddToFilter: "Add to Filter",
        AddToRow: "Add to Row",
        AddToColumn: "Add to Column",
        AddToValues: "Add to Value",
        PivotTableFieldList: "PivotTable Field List",
        ChooseFieldsToAddToReport: "Choose fields to add to report:",
        DragFieldBetweenAreasBelow: "Drag fields between areas below:",
        ReportFilter: "Filters",
        ColumnLabel: "Columns",
        RowLabel: "Rows",
        Values: "Values",
        DeferLayoutUpdate: "Defer Layout Update",
        Update: "Update",
        OK: "OK",
        Cancel: "Cancel",
        Close: "Close"
    };

    ej.PivotSchemaDesigner.Layouts = {
        Excel: "excel",
        Normal: "normal",
        OneByOne:"onebyone"
    };

})(jQuery, Syncfusion);;

});