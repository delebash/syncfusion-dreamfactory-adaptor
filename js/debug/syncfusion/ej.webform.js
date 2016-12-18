/*!
*  filename: ej.webform.js
*  version : 14.2.0.26
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/

(function () {
    setViewstate(ej.Accordion, ["cssClass", "enabled", "enableRTL", "selectedItems", "selectedItemIndex"]);
    setViewstate(ej.Autocomplete, ["cssClass", "enabled", "enableRTL", "readOnly", "value", "selectValueByKey"]);
    setViewstate(ej.Button, ["enabled", "cssClass", "enableRTL"]);
    setViewstate(ej.Captcha, ["characterSet", "maximumLength", "caseSensitive", "autoValidate", "successMessage", "errorMessage", "encryptedCode", "isValid", "enableAudio", "enableRefreshImage", "enableRTL", "audioUrl"]);
    setViewstate(ej.CheckBox, ["checked", "checkState", "enabled", "cssClass", "enableRTL"]);
    setViewstate(ej.ColorPicker, ["value", "cssClass", "enabled", "showRecentColors", "opacityValue", "toolIcon", "columns", "palette", "modelType"]);
    setViewstate(ej.CurrencyTextbox, ["cssClass", "locale", "enabled", "enableRTL", "readOnly", "value"]);
    setViewstate(ej.DatePicker, ["value", "dateFormat", "minDate", "maxDate", "locale", "enabled", "readOnly", "cssClass", "enableRTL"]);
    setViewstate(ej.DateTimePicker, ["value", "minDateTime", "dateTimeFormat", "maxDateTime", "locale", "enabled", "readOnly", "cssClass", "enableRTL"]);
    setViewstate(ej.Dialog, ["enabled", "cssClass", "enableRTL"]);
    setViewstate(ej.DropDownList, ["value", "text", "enabled", "readOnly", "cssClass", "enableRTL", "selectedIndex", "selectedIndices"]);
    setViewstate(ej.FileExplorer, ["allowMultiSelection", "showToolbar", "showCheckbox", "showRoundedCorner", "showTreeview", "showContextMenu", "showFooter", "selectedFolder", "selectedItems", "fileTypes", "locale", "layout", "enableRTL", "cssClass", "gridSettings", "filterSettings"]);
    setViewstate(ej.MaskEdit, ["value", "maskFormat", "inputMode", "enabled", "readOnly", "cssClass" ]);
    setViewstate(ej.Menu, ["animationType", "enabled", "cssClass", "enableRTL", "orientation"]);
    setViewstate(ej.NumericTextbox, ["cssClass", "locale", "enabled", "enableRTL", "readOnly", "value"]);
    setViewstate(ej.PercentageTextbox, ["cssClass", "locale", "enabled", "enableRTL", "readOnly", "value"]);
    setViewstate(ej.ProgressBar, ["value", "text", "percentage", "minValue", "maxValue", "enabled", "cssClass", "enableRTL"]);
    setViewstate(ej.RadioButton, ["checked", "enabled", "cssClass", "enableRTL"]);
    setViewstate(ej.Rating, ["value", "minValue", "maxValue", "readOnly", "cssClass"]);
    setViewstate(ej.RTE, ["cssClass", "locale", "enabled", "enableRTL", "value"]);
    setViewstate(ej.Slider, ["value", "values", "minValue", "maxValue", "incrementStep", "readOnly", "enabled", "enableRTL", "sliderType", "cssClass"]);
    setViewstate(ej.SplitButton, ["text", "cssClass", "enableRTL", "enabled"]);
    setViewstate(ej.Tab, ["selectedItemIndex", "enabled", "cssClass", "enableRTL"]);
    setViewstate(ej.Ribbon,["selectedItemIndex"]);
    setViewstate(ej.ListBox, ["selectedItemIndex", "selectedItemlist", "checkedItemlist", "selectedIndices", "checkedIndices", "selectedIndex", "cssClass", "enabled", "enableRTL", "selectedItems", "checkedItems", "text", "value" ]);
	setViewstate(ej.ListView, ["showHeaderBackButton", "enableCache", "enableFiltering","headerBackButtonText","transition"]);
	setViewstate(ej.Tile, ["enabled", "showText", "maxValue","minValue","value","text"]);
	setViewstate(ej.RadialMenu, ["enableAnimation", "autoOpen"]);
	setViewstate(ej.NavigationDrawer, ["enableListView"]);
    setViewstate(ej.TagCloud, ["enableRTL", "cssClass", "titleText", "titleImage", "format"]);
    setViewstate(ej.TimePicker, ["value", "minTime", "maxTime", "locale", "enabled", "readOnly", "cssClass", "enableRTL"]);
    setViewstate(ej.ToggleButton, ["enabled", "cssClass", "enableRTL", "toggleState", "activePrefixIcon",
                                            "activeSuffixIcon", "activeText", "defaultText", "defaultPrefixIcon", "defaultSuffixIcon"]);
    setViewstate(ej.Toolbar, ["enabled", "cssClass", "enableRTL", "orientation", "hide"]);
    setViewstate(ej.TreeView, ["cssClass", "enabled", "enableRTL", "expandedNodes", "checkedNodes", "selectedNode"]);
    setViewstate(ej.Uploadbox, ["enabled", "multipleFilesSelection", "enableRTL", "cssClass", "showFileDetails"]);
    setViewstate(ej.PivotGrid, ["currentReport"]);
    setViewstate(ej.Schedule, ["currentDate", "currentView", "endHour", "startHour", "orientation", "timeMode", "views", "dateFormat", "timeZone", "highlightBusinessHours", "enablePersistence",
	                           "showQuickWindow", "businessStartHour", "businessEndHour", "cellHeight", "cellWidth", "minDate", "maxDate", "locale", "readOnly", "enableRTL", "enableAppointmentNavigation",
							   "appointmentTemplateId", "resourceHeaderTemplateId", "allowDragDrop", "enableAppointmentResize", "showCurrentTimeIndicator", "reminderSettings", "contextMenuSettings", "group",
							   "allowKeyboardNavigation", "query", "renderDates", "categorizeSettings", "enableLoadOnDemand", "showAllDayRow", "isResponsive", "showHeaderBar", "agendaViewSettings", "firstDayOfWeek", "workWeek", "showDeleteConfirmationDialog", "showNextPrevMonth"]);
    setViewstate(ej.Grid, ["allowFiltering", "allowGrouping", "allowKeyboardNavigation", "allowMultiSorting", "allowPaging", "allowReordering","allowTextWrap","allowCellMerging",
                                             "allowResizing", "allowScrolling", "allowSearching", "allowSelection", "allowSorting", "showSummary",
                                             "cssClass", "detailsTemplate", "enableAltRow", "enableHeaderHover", "enablePersistence", "enableRTL", "enableRowHover", "enableTouch", "locale",
                                             "query", "rowTemplate", "selectedRowIndex", "selectionType", "editSettings", "filterSettings", "groupSettings", "pageSettings",
                                             "scrollSettings", "sortSettings", "toolbarSettings", "columns", "searchSettings", "_groupingCollapsed", "allowRowDragAndDrop", "textWrapSettings", "rowDropSettings"]);
	setViewstate(ej.Kanban, ["allowFiltering", "allowKeyboardNavigation", "allowScrolling", "allowSearching", "allowSelection","cssClass","allowHover", "allowPrinting", "enableRTL", "keyField", "allowTitle","enableTouch", "locale",
                                             "query", "allowDragAndDrop", "allowPrinting", "selectionType", "editSettings", "filterSettings", "cardSettings", "fields",
                                             "scrollSettings", "sortSettings", "customToolbarItems", "columns", "searchSettings", "_collapsedCards", "tooltipSettings", "enableTotalCount","allowToggleColumn"]);										 
    setViewstate(ej.Gantt, ["allowSorting", "allowColumnResize", "dataSource", "allowSelection", "highlightWeekends", "enableProgressBarResizing",
                            "includeWeekend", "showTaskNames", "showGridCellTooltip", "showGridExpandCellTooltip", "showProgressStatus", "showResourceNames", "enableTaskbarDragTooltip",
                            "enableTaskbarTooltip", "allowKeyboardNavigation", "allowMultiSorting", "enableAltRow", "enableVirtualization", "allowGanttChartEditing",
                            "renderBaseline", "enableContextMenu", "showColumnChooser", "taskIdMapping", "parentTaskIdMapping", "taskNameMapping", "startDateMapping",
                            "endDateMapping", "baselineStartDateMapping", "baselineEndDateMapping", "childMapping", "durationMapping", "milestoneMapping",
                            "progressMapping", "predecessorMapping", "resourceInfoMapping", "scheduleStartDate", "scheduleEndDate", "taskbarBackground", "progressbarBackground",
                            "connectorLineBackground", "parentTaskbarBackground", "parentProgressbarBackground", "cssClass", "locale", "taskbarTooltipTemplate",
                            "progressbarTooltipTemplate", "taskbarTooltipTemplateId", "dateFormat", "resourceIdMapping", "resourceNameMapping", "progressbarTooltipTemplateId",
                            "taskbarEditingTooltipTemplateId", "taskbarEditingTooltipTemplate", "weekendBackground", "baselineColor", "splitterPosition", "resources", "holidays",
                            "stripLines", "editDialogFields", "rowHeight", "connectorlineWidth", "progressbarHeight", "selectedRowIndex", "treeColumnIndex", "workingTimeScale",
                            "roundOffDayworkingTime", "durationUnit", "enableCollapseAll", "query", "enableResize", "splitterSettings", "enablePredecessorValidation", "isResponsive","taskbarTemplate","parentTaskbarTemplate","milestoneTemplate"]);
    setViewstate(ej.TreeGrid, ["allowSorting", "allowMultiSorting", "allowColumnResize", "allowKeyboardNavigation", "allowFiltering", "allowSelection",
                             "dataSource", "enableResize", "filterBarMode", "query", "selectionType", "showGridCellTooltip", "showGridExpandCellTooltip",
                             "enableAltRow", "enableVirtualization", "showColumnChooser", "idMapping", "parentIdMapping", "childMapping",
                             "cssClass", "locale", "rowHeight", "selectedRowIndex", "treeColumnIndex", "enableCollapseAll", "columns", "sortSettings",
                             "toolbarSettings", "contextMenuSettings", "editSettings", "filterSettings","showSummaryRow","showTotalSummary","isResponsive"]);
    if (ej.olap)
        setViewstate(ej.PivotChart, ["currentReport"]);
    if (ej.datavisualization) {
        setViewstate(ej.datavisualization.Chart, ["series"]);
        setViewstate(ej.datavisualization.Map, ["enablePan", "enableAnimation", "enableResize"]);
        setViewstate(ej.datavisualization.TreeMap, ["highlightOnSelection", "enableResize"]);
        setViewstate(ej.datavisualization.CircularGauge, ["scales"]);
        setViewstate(ej.datavisualization.LinearGauge, ["scales"]);
        setViewstate(ej.datavisualization.Diagram, ["nodes", "connectors", "width", "height", "labels"]);
        
    }
    setViewstate(ej.Spreadsheet, ["allowAutoFill", "allowAutoSum", "allowCellFormatting", "allowCharts", "allowClipboard", "allowComments",
        "allowConditionalFormats", "allowDataValidation", "allowDelete", "allowDragAndDrop", "allowEditing", "allowFiltering", "allowFormatAsTable",
        "allowFormatPainter", "allowFormulaBar", "allowFreezing", "allowHyperlink", "allowImport", "allowInsert", "allowKeyboardNavigation", "allowLockCell",
        "allowMerging", "allowPivotTable", "allowResizing", "allowSearching", "allowSelection", "allowSorting", "allowUndoRedo", "allowWrap", "autoFillSettings",
        "apWidth", "chartSettings", "columnCount", "columnWidth", "cssClass", "enableContextMenu", "enablePersistence", "exportSettings", "formatSettings",
        "importSettings", "locale", "nameManager", "pageSettings", "pageSize", "pictureSettings", "printSettings", "rowCount", "rowHeight", "scrollSettings",
        "selectionSettings", "sheetCount", "showRibbon", "undoRedoStep", "userName"]);
})();

function setViewstate( namespace, viewstateData) {
    if (namespace)
        namespace.prototype._includeOnViewstate = viewstateData;
}
;

(function () {

    var args, clientArgs;
    refreshFlag();
    ej.raiseWebFormsServerEvents = function (eventName, eventProp, clientProp) {
        if (eventProp.model.serverEvents.indexOf(eventName) != -1) {
            args = eventProp, clientArgs = ignoreDOMElement(clientProp);
            if (args.type == "ejButtonclick" && args.model.type.toLowerCase() == "submit") {
                args.e.preventDefault();
                (typeof theForm == "undefined" ? $("body form") : $(theForm)).submit();
            }
            setTimeout(function () {
                try {
                    var modelStr = JSON.stringify({ type: args.originalEventType, args: clientArgs });
                    __doPostBack(args.model.uniqueId, modelStr);
                }
                catch (e) { }
            }, 0);
        }
    }
    function ignoreDOMElement(args) {
        if (!args) return null;
        for (var name in args) {
            var ele = args[name];
            if (isDOMObj(ele) || (ele && typeof ele.preventDefault == "function"))
                delete args[name];
            else if ($.isPlainObject(ele)) ignoreDOMElement(ele);
        }
        return args;
    }
    function isDOMObj(o) {
        return o instanceof $ || (o && o.nodeType && o.nodeType == 1);
    }

})();

function refreshFlag() {
    setTimeout(function () { ej.isOnWebForms = true; }, 1000);
}

function EJ_ClientSideOnPostBack() {
    var $form = typeof theForm == "undefined" ? $("body form") : $(theForm);
    if (!$form.length) return;
    $form.append(getPostBackData());
    addPostBackHandler();
    ej.isOnWebForms = false;
}

function getPostBackData() {
    var controls = $("body .e-js");
    $("#ej-hidden-model-container").remove();
    var div = $(document.createElement("div"));
    div.attr("id", "ej-hidden-model-container");
    for (var i = 0; i < controls.length; i++) {
        var widgets = $(controls[i]).data("ejWidgets");
        if (!widgets) continue;
        for (var j = 0; j < widgets.length; j++) {
            var that = $(controls[i]).data(widgets[j]);
            if (!that || !that.model.clientId) continue;
            var hidden = $(document.createElement("input")).attr({
                "type": "hidden",
                "id": that.model.clientId + "_hidden_model",
                "name": that.model.clientId + "_hidden_model"
            }).val(JSON.stringify(includeRequiredProp(that)));
            div.append(hidden);
        }
    }
    return div;
}

function includeRequiredProp(that) {
    var propArray = that._includeOnViewstate || [], model = {};
    for (var n = 0; n < propArray.length; n++)
        model[propArray[n]] = ej.util.getObject(propArray[n], that.model);
    return model;
}

function clearPostBackData() {
    refreshFlag();
    removePostBackHandler();
    $("#ej-hidden-model-container").remove();
}

function addPostBackHandler() {
    if (typeof Sys != "undefined")
        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(clearPostBackData);
}
function removePostBackHandler() {
    if (typeof Sys != "undefined")
        Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(clearPostBackData);
};