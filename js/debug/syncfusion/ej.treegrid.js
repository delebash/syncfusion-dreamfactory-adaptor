/*!
*  filename: ej.treegrid.js
*  version : 14.2.0.26
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["jquery-easing","./../common/ej.globalize","jsrender","./../common/ej.core","./../common/ej.data","./../common/ej.scroller","./ej.dialog","./ej.datepicker","./ej.datetimepicker","./ej.checkbox","./ej.dropdownlist","./ej.editor","./ej.maskedit","./ej.toolbar","./ej.pager"], fn) : fn();
})
(function () {
	
/**
 * @fileOverview Plugin to style the Html TreeGrid elements
 * @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
 *  Use of this code is subject to the terms of our license.
 *  A copy of the current license can be obtained at any time by e-mailing
 *  licensing@syncfusion.com. Any infringement will be prosecuted under
 *  applicable laws. 
 * @version 12.1 
 * @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
 */

(function ($, ej, undefined) {
   
    ej.widget("ejTreeGrid", "ej.TreeGrid", {
        // widget element will be automatically set in this
        _rootCSS: "e-treegrid",

        // widget element will be automatically set in this
        element: null,

        validTags: ["div"],

        // user defined model will be automatically set in this
        model: null,

        _requiresID: true,
        _tags: [
        {
            tag: "columns",
            attr: ["field", "headerText", "allowSorting", "editType", "allowFiltering", "filterEditType", "width", "visible", "editParams", "format", "isFrozen", "allowFreezing", "headerTemplateID", "allowCellSelection"],
            content: "template"
        },
        {
            tag: "summaryRows",
            attr: ["title", "summaryColumns"],
            content: "template"
        },
         {
             tag: "summaryRows.summaryColumns",
             attr: ["summaryType", "dataMember", "displayColumn", "prefix", "suffix", "format"],
             content: "template"
         },
        {
            tag: "sortSettings.sortedColumns",
            attr: ["field", "direction"]
        },
        {
            tag: "sizeSettings",
            attr:["height","width"]
        }
        ],
        _columns: function (index, property, value, old){
            var $header = this.element.find(".e-headercelldiv");
            $header[index.columns].innerHTML=value;
            this._trigger("refresh");
        },
        keyConfigs: {
            focus: "e",
            editRecord: "113", //F2
            saveRequest: "13", // enter
            cancelRequest: "27", //Esc         
            firstRowSelection: "36", //"Home",
            lastRowSelection: "35", //"End",
            leftArrow:"37",//Left arrow
            upArrow: "38", //Up arrow
            rightArrow:"39",//Right arrow
            downArrow: "40", //Down arrow
            moveCellRight: "9", //tab
            moveCellLeft: "shift+9", //shifttab
            shiftDownArrow: "shift+40", //shift + DownArrow
            shiftUpArrow: "shift+38", //shift + UpArrow
            shiftRightArrow: "shift+39", //shift + RightArrow
            shiftLeftArrow: "shift+37", //shift + LeftArrow
            shiftHomeButton: "shift+36",//shift + HomeButton
            shiftEndButton: "shift+35",//shift + EndButton
            selectedRowExpand: "alt+40", //"AltPlusDownArrow",
            totalRowExpand: "ctrl+40", //"CtrlPlusDownArrow",
            selectedRowCollapse: "alt+38", //"AltPlusUpArrow",
            totalRowCollapse: "ctrl+38", //"CtrlPlusUpArrow"
            deleteRecord: "46", // delete
            spaceBar: "32", // spacebar
            topRowSelection: "ctrl+36", //CtrlPlusHome
            bottomRowSelection: "ctrl+35",//CtrlPlusEnd
            nextPage: "33", //PageUp
            prevPage:"34", //PageDown            
        },
      
        defaults: {
            
            allowFiltering: false,            
            allowDragAndDrop: false,            
            dragTooltip: {                
                showTooltip: false,                
                tooltipItems:[],                
                tooltipTemplate: "",
            },  
            allowSorting: false,            
            allowColumnResize: false, 
            allowSelection: true,   
            allowPaging: false,
            dataSource: null,
            query: ej.Query(),            
            idMapping: "",            
            parentIdMapping: "",  
            readOnly: false,
            showGridCellTooltip: false,
            cellTooltipTemplate:null,
            showGridExpandCellTooltip: false,
            showColumnChooser: false,
            showColumnOptions: false,
            enableAltRow: true,			
            selectedItem: null,            
            toolbarSettings: {                
                showToolbar: false,                
                toolbarItems: []
            },         
            editSettings: {       
                allowEditing: false,  
                allowAdding: true,
                allowDeleting: true,                
                editMode: "cellEditing",                
                rowPosition: "top",
                beginEditAction: "dblclick"
            },                   
            enableVirtualization: false,   
            allowMultiSorting: false,
            sortSettings: {                
                sortedColumns: []
            },
            filterSettings: {
                filterBarMode: "immediate",
                filteredColumns: []
            },
            selectionType: "single",    
            selectionMode: "row",
            selectedCellIndexes: [],
            selectedRowIndex: -1,
            showSummaryRow: false,
            summaryRows: [],            
            showTotalSummary: false,    
            allowKeyboardNavigation: true,
            cssClass: "",           
            locale: "en-US",
            isEdit: false,
            allowScrolling: false,
            scrollSettings: {
                frozenColumns: 0
            },
            groupSettings: {
                groupedColumns:[]
            },            
            sizeSettings: {                
                height: "",                
                width: "",
            },            
            enableResize: true,            
            isResponsive: true,
            showDetailsRow: false,            
            showDetailsRowInfoColumn: false,            
            detailsTemplate: "",            
            detailsRowHeight: 100,    
            rowDataBound: null,                        
            load: null,
            create:null,
            queryCellInfo: null,            
            rowSelecting: null,           
            rowSelected: null,           
            cellSelecting: null,
            cellSelected: null,
            beginEdit: null,            
            endEdit: null,            
            expanding: null,            
            expanded: null,            
            collapsing: null,            
            collapsed: null,            
            actionComplete: null,            
            actionBegin: null,
            currentViewData: [],
            flatRecords: [],
            parentRecords: [],
            updatedRecords:[],
            summaryRowRecords: [],
            selectedItems: [],
            ids: [],      
            columns: [
            {
                field: "",
                headerText: "",
                editType: "",
                filterEditType: "",
                allowFiltering: false,
                allowFilteringBlankContent: true,
                allowSorting: false,
                visible: "",
                textAlign: ej.TextAlign.Left,
                headerTextAlign: ej.TextAlign.Left,
                allowCellSelection: true
                //isFrozen: false,
                //allowFreezing: false
            },
            ],
            columnDialogFields: [],
            commonWidth: 150,
            dateFormat: "MM/dd/yyyy",   
            rowHeight: 30,
            emptyRecordText: "No Records To Display",            
            treeColumnIndex: 0,
            //API for toggle between datepicker and datetimepicker
            workingTimeScale: 'TimeScale8Hours',            
            childMapping: "",             
            enableCollapseAll:false,
            rowTemplateID: "",
            altRowTemplateID: "",            
            contextMenuSettings: {                
                showContextMenu: false,                
                contextMenuItems: []
            },            
            contextMenuOpen: null,            
            rowDragStart: null,            
            rowDrag: null,            
            rowDragStop: null,       
            detailsDataBound: null,            
            detailsShown: null,            
            detailsHidden: null,
            toolbarClick: null,
            columnResizeStart: null,
            columnResizeEnd: null,
            columnResized:null,
            exportToPdfAction: "",
            exportToExcelAction: "",
            allowMultipleExporting: false,
            headerTextOverflow: "none",
            pageSettings: {
                pageSize: 12,
                pageCount: 8,
                currentPage: 1,
                totalPages: 0,
                totalRecordsCount: null,
                pageSizeMode: "all",
                template: null,                
            },
        },

        dataTypes: {
            columns: "array",
            summaryRows: "array",
            summaryRows: {
                summaryColumns: "array"
            },
            sortSettings: {
                sortedColumns: "array"
            },
            filterSettings: {
                filteredColumns: "array"
            },
            dataSource: "data",
            query: "data",
            currentViewData: "array",
            flatRecords: "array",
            parentRecords: "array",
            updatedRecords:"array",
            summaryRowRecords: "array",
            ids: "array",
            contextMenuSettings: {
                contextMenuItems: "array"
            },
            toolbarSettings: {
                toolbarItems: "array"
            },
            selectedItem: "data",
            summaryRows: "array"
        },
        ignoreOnExport: [
            "isEdit", "toolbarClick", "query", "queryCellInfo", "selectionType", "currentViewData", "enableRTL", "rowDataBound", "rowTemplate",
             "detailsTemplate", "editSettings", "localization", "cssClass", "dataSource", "allowKeyboardNavigation","pageSettings"
        ],
        observables: ["selectedRowIndex", "dataSource", "selectedCellIndexes","pageSettings.currentPage"],
        selectedItem: ej.util.valueFunction("selectedItem"),
        selectedRowIndex: ej.util.valueFunction("selectedRowIndex"),
        selectedCellIndexes: ej.util.valueFunction("selectedCellIndexes"),
        dataSource: ej.util.valueFunction("dataSource"),
        _currentPage: ej.util.valueFunction("pageSettings.currentPage"),

        //GET THE LOCALIZATION OBJECT
        _getLocalizedLabels: function () {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        },

        //GET THE GRID HEADER TABLE FOR COLUMNRESIZE
        getHeaderTable: function () {
            return this._$gridHeaderTable;
        },

        //SET THE GRID HEADER TABLE
        setGridHeaderTable: function (value) {
            this._$gridHeaderTable = value;
        },

        //GET THE GRIDHEADERCONTENT
        getHeaderContent: function () {
            return this._$gridHeaderContent;
        },

        //SET THE GRIDHEADERCONTENT
        setGridHeaderContent: function (value) {
            this._$gridHeaderContent = value;
        },

        //GET THE GRID CONTENT TABLE
        getContentTable: function () {
            return this._$gridContentTable;
        },

        getContent: function () {
            return this._$gridContent;
        },
        
        //SET THE GRID CONTENT TABLE
        setGridContentTable: function (value) {
            this._$gridContentTable = value;
        },

        //GET TREEGRID ROWS
        getRows: function () {
            var $gridRows = this._excludeDetailRows();
            return $gridRows;
        },

        //GET SELECTED CELLS
        getSelectedCells: function () {
            var proxy = this, model = proxy.model;
            var selectedCellElement = [];
            this._selectedCellDetails.forEach(function (item) {
                //Replace the current view cell Element after scrolling.
                var record = item.data,
                    currentRowIndex = model.currentViewData.indexOf(record);
                if (currentRowIndex != -1) {
                    item.cellElement = proxy.getRows()[currentRowIndex].childNodes[item.cellIndex];
                }
                selectedCellElement.push(item.cellElement);
            })
            return selectedCellElement;
        },

        //SET TREEGRID ROWS
        setGridRows: function (value) {
            this._$gridRows = value;
        },

        //GET CURRENTVIEWPORT DATA
        getCurrentViewData: function () {
            return this.model.currentViewData;
        },

        //GET UPDATED CURRENT VIEW DATA
        getUpdatedCurrentViewData: function () {
            this._updateCurrentViewData();
            return this.model.currentViewData;
        },

        //GET FLAT RECORDS
        getFlatRecords: function () {
            return this.model.flatRecords;
        },

        //SET THE HEIGHT BASED ON THE RECORD COUNT
        setHeight: function (value) {
            this._totalHeight = value;
        },

        //GET THE UPDATEDRECORDS[SORTED,FILTERED,EXPANDCOLLAPSED]
        getUpdatedRecords: function () {
            return this.model.updatedRecords;
        },

        //GET THE SUMMARY ROW RECORDS
        getsummaryRowRecords: function () {
            return this.model.summaryRowRecords;
        },
        //GET THE UPDATED DATASOURCE
        getDataSource: function () {
            return this.dataSource();
        },

        //get the ids collection after perform the addition/delete operation
        //GET THE IDS COLLECTION AFTER PERFORM THE ADDITION/DELETE OPERATION
        getUpdatedIds: function () {
            return this.model.ids;
        },

        //GET THE RECORDS COUNT
        getRecordsCount: function () {
            return this._recordsCount;
        },

        //SET THE RECORDS COUNT
        setRecordsCount: function (value) {
            this._recordsCount = value;
        },

        //update the collapseRecount by updatedRecord collection
        updateCollapsedRecordCount:function()
        {
            var proxy = this,
                model = this.model,
                resultRecord = [];
            resultRecord = model.updatedRecords.filter(function (record) {
                return proxy.getExpandStatus(record) == false;
            });
            proxy._totalCollapsedRecordCount = resultRecord.length;
        },

        //In virtualization get expaned records from total record collection only
        _getDetailsExpandedRecords: function (records) {
            var proxy = this;
            var resultRecord = records.filter(function (record) {
                return record.isDetailsExpanded == true;
            });
            return resultRecord;
        },

        /* Get expanded details row height */
        _getExpandedDetailsRowHeight:function()
        {
            var proxy = this,
                model = this.model,
                expandedRecords = this.getExpandedRecords(model.updatedRecords),
                detailExpadedRecords = this._getDetailsExpandedRecords(expandedRecords);
            detailExpadedRecords = $(detailExpadedRecords).not(model.summaryRowRecords);
            return (proxy._detailsRowHeight * detailExpadedRecords.length);
        },
        //return collapsed recount length in updatedRecord collectio
        getCollapsedRecordCount: function (records) {
            return this._totalCollapsedRecordCount
        },
        
        _colgroupRefresh: function () {
            var model = this.model;
            
            if (this._frozenColumnsLength > 0) {
                var gridheaderCol = $(this.getHeaderTable()).find('colgroup');
                var gridcontentCol = $(this.getContentTable()).find('colgroup');
            }
            else {
                var gridheaderCol = $(this.getHeaderTable()).find('colgroup')[0];
                var gridcontentCol = $(this.getContentTable()).find('colgroup')[0];
            }
            var headerColClone = $(gridheaderCol).clone();
            var contentColClone = $(gridcontentCol).clone();
            var footerColClone = $(gridcontentCol).clone();
            $(gridcontentCol).remove();
            $(gridheaderCol).remove();
            if (this._frozenColumnsLength > 0) {
                $(headerColClone[0]).prependTo(this.getHeaderTable()[0]);
                $(headerColClone[1]).prependTo(this.getHeaderTable()[1]);
                $(contentColClone[0]).prependTo(this.getContentTable()[0]);
                $(contentColClone[1]).prependTo(this.getContentTable()[1]);
                if (this._$footertableContent) {
                    $(this._$footertableContent).find('colgroup').remove();
                    $(footerColClone[0]).prependTo(this._$footertableContent[0]);
                    $(footerColClone[1]).prependTo(this._$footertableContent[1]);
                }
                if (this._$totalSummaryRowContainer) {
                    if (this.getBrowserDetails().browser == "safari")
                        this._$totalSummaryRowContainer.find("#e-movablefooter" + this._id).css("margin-left", "auto");
                }
                if (this.getBrowserDetails().browser == "safari")
                    this.getHeaderContent().find("#e-movableheader" + this._id).add(this.getContent().find("#e-movablecontainer" + this._id)).css("margin-left", "auto");
                $("#e-frozencontentdiv" + this._id).length && $("#e-frozencontentdiv" + this._id).css("width", "100%");
            }
            else {
                $(headerColClone).prependTo(this.getHeaderTable());
                $(contentColClone).prependTo(this.getContentTable());
                if (this._$footertableContent) {
                    $(this._$footertableContent).find('colgroup').remove();
                    $(footerColClone).prependTo(this._$footertableContent);
                }
            }
        },
        _detailColsRefresh: function () {
            this._$headerCols = this.getHeaderTable().children("colgroup").find("col");
            this._$contentCols = this.getContentTable().children("colgroup").find("col");
            if (this.model.detailsTemplate && this.model.showDetailsRow && this.model.showDetailsRowInfoColumn || this.model.isFromGantt) {
                var colCount = this.model.columns.length;
                if (this._$headerCols.length > colCount) this._$headerCols.splice(colCount, 1);
                if (this._$contentCols.length > colCount) this._$contentCols.splice(colCount, 1);
            }
        },
        // Move to the given page number
        gotoPage: function (pageIndex) {
            if (!this.model.allowPaging)
                return;
            var proxy = this, model = proxy.model,
                args = {}, returnValue;
            if (ej.isNullOrUndefined(pageIndex))
                pageIndex = proxy._currentPage();
            else {
                if (pageIndex <= 0)
                    pageIndex = 1;
                else if (pageIndex > model.pageSettings.totalPages)
                    pageIndex = model.pageSettings.totalPages;
            }
            pageIndex = ej.isNullOrUndefined(pageIndex) ? proxy._currentPage() : pageIndex;
            args.previousPage = this._currentPage();            
            this._currentPage(pageIndex);           
            args.currentPage = pageIndex;
            if (model.allowPaging) {                
                args.requestType = ej.TreeGrid.Actions.Paging;
            }            
            proxy._updateCurrentViewData();            
            proxy.renderRecords(args);
            proxy.updateHeight();
            proxy._setScrollTop();
            proxy.getScrollElement().ejScroller("refresh");
            proxy._updateScrollCss();
            if (returnValue)
                this._currentPage(args.previousPage);
            if (args.previousPage != args.currentPage) {                
                proxy.clearSelection(-1);
                proxy.selectedRowIndex(-1);
                proxy.model.selectedItem = null;
                proxy._cancelSaveTools();
                proxy._clearContextMenu();                
            }
        },
        _pagerClickHandler: function (sender) {
            var proxy = this;
            if (this._prevPageNo == sender.currentPage)
                return;
            proxy._isNextPage = true;
            if (proxy._isRowEdit)
                proxy.cancelRowEditCell();
            else if (proxy.model.isEdit)
                proxy.cancelEditCell();
            this.gotoPage(sender.currentPage);
            return false;
        },
        /*CONSTRUCTOR FUNCTION*/
        _init: function () {

            var proxy = this;

            /* default value for asp designer */
            if (proxy.model.isdesignMode) {
                proxy.model.columns = [
                    { "field": "Column1", "HeaderText": "Column1" },
                    { "field": "Column2", "HeaderText": "Column2" },
                    { "field": "Column3", "HeaderText": "Column3" },
                    { "field": "Column4", "HeaderText": "Column4" }];
                proxy.model.childMapping = "Children";
                var tempDataSource = [{ Column1: "Value 1", Column2: "Value 2", Column3: "Value 3", Column4: "Value 4", Children: [] }];

                for (var count = 1; count < 4; count++) {
                    var data = { Column1: "Value 1", Column2: "Value 2", Column3: "Value 3", Column4: "Value 4" };
                    tempDataSource[0].Children.push(data);
                }
                this.dataSource(tempDataSource);
                this.model.sizeSettings.height = "250px";
                this.model.sizeSettings.width = "600px";
            }
            proxy._trigger("load");
            proxy._initPrivateProperties();
            proxy._setCultureInfo();
            proxy._processEditing();
            proxy._initDatasource();
            if (proxy.model.showColumnChooser && proxy.model.showColumnOptions) {
                proxy.columnAddDialogTemplate();
                proxy._renderUpdateConfirmDialog();
            }
            proxy._createDragTooltipTemplate();
            proxy._createTooltipTemplate();
        },
        /* update allow keyboard navigation value*/
        updateAllowKeyboardNavigation: function (bool)
        {
            this.model.allowKeyboardNavigation = bool;
        },
        /* Refresh footer summary records if total summary exist */
        _refreshFooterSummaryRecords: function () {
            var proxy = this,
                model = this.model;
            if (model.showTotalSummary && proxy._$footerContainer.length > 0) {
                if (this._frozenColumnsLength > 0) {
                    proxy._$footerContainer.html(this._renderSummaryByFrozenDesign());
                    this._renderFrozenSummary();
                } else {
                    var $table = ej.buildTag('table.e-table#' + proxy._id + "summarye-table", "",
                    { top: "0px" }, { 'cellspacing': '0px' }),
                      $tbody = ej.buildTag('tbody');
                    $table.append(proxy.getContentTable().find('colgroup').clone()).append($tbody);
                    $tbody.html($.render[this._id + "_Template"](proxy._footerSummaryRecord));
                    proxy._$footerContainer.empty().append($table);
                }
                proxy._$footertableContent = proxy._$footerContainer.find(".e-table");
            }
        },
        /* update scrollLeft of header container with content scrollLeft*/
        _updateHeaderScrollLeft: function (scrollLeft) {
            var proxy = this, model = this.model;
            if (ej.isNullOrUndefined(scrollLeft))
                scrollLeft = proxy.getScrollElement().ejScroller("option", "scrollLeft");
            if (this._frozenColumnsLength > 0) {
                proxy._$gridHeaderContainer.find("#e-movableheader" + this._id).scrollLeft(scrollLeft);
                if (proxy.model.showTotalSummary && proxy._$footerContainer)
                    proxy._$footerContainer.find("#e-movablefooter" + this._id).scrollLeft(scrollLeft);
            } else {
                proxy._$gridHeaderContainer.scrollLeft(scrollLeft);
                if (proxy.model.showTotalSummary && proxy._$footerContainer)
                    proxy._$footerContainer.scrollLeft(scrollLeft);
            }
        },
        //Update Columns Dynamically.
        updateColumns: function (columns) {
            var proxy = this,
               model = this.model;
            model.columns = columns;
            proxy._refreshFrozenColumns();
        },
        //Update the Gantt Columns from TreeGrid Columns.
        updateToGanttColumns: function () {
            var proxy = this,
                model = proxy.model,
                columns = model.columns,
                ganttObject = $("#" + proxy._id.replace("ejTreeGrid", "")).data("ejGantt");
            ganttObject.updateGanttColumns(columns);            
        },
        /* Refresh columns collection with freeze and unfreeze*/
        _refreshFrozenColumns: function () {
            var proxy = this,
               model = this.model,
               layoutUpdated = false;
            proxy._initFrozenColumns();
            proxy._processEditing();
            //Rerendering the column header with new columns.;
            proxy._$gridHeaderContent.replaceWith(proxy._renderGridHeader());
            proxy._addInitTemplate();
            if (model.isFromGantt)
                proxy._$gridContent.removeClass("e-borderbox");
            /* Render frozen and movable table if any column is frozen*/
            if (this._frozenColumnsLength > 0 && proxy._$frozenTableContent.length == 0) {
                layoutUpdated = true;
                var contentWidth = proxy._$gridContent.css("width"),
                    contentHeight = proxy._$gridContent.css("height");
                proxy._$gridContent.ejScroller("destroy");
                proxy._$gridContent.css("width", contentWidth);
                proxy._$gridContent.css("height", contentHeight);
                proxy._$gridContainer.html(proxy._renderByFrozenDesign());
                proxy.setGridContentTable(proxy._$gridContainer.find(".e-table"));
                proxy._$gridContainer.find("#e-movablecontent" + proxy._id + ",#e-movablecontentdiv" + proxy._id + ",#e-frozencontentdiv" + proxy._id).css("height", proxy._$gridContainer.css("height"));
                proxy._renderScroller(true);
            } else if (proxy._$frozenTableContent.length > 0 && this._frozenColumnsLength == 0) {
                layoutUpdated = true;
                proxy._$gridContent.find("#e-movablecontainer" + proxy._id).ejScroller("destroy");
                var $table = ej.buildTag('table.e-table#' + proxy._id + "e-table", "",
                     { top: "0px", "position": "relative" }, { 'cellspacing': '0px' }),
                     $tbody = ej.buildTag('tbody');
                $table.append(proxy.getHeaderTable().find('colgroup').clone()).append($tbody);
                proxy._$gridContainer.html($table);
                proxy.setGridContentTable($table);
                proxy._renderScroller(true);
            }
            /* Update table private  properties*/
            proxy._$frozenTableContent = $("#" + proxy._id + "frozene-table");
            proxy._$movableTableContent = $("#" + proxy._id + "movablee-table");
            proxy._$tableContent = $("#" + proxy._id + "e-table");

            if (model.showTotalSummary && proxy._$footerContainer.length > 0) {
                proxy._refreshFooterSummaryRecords();
            }

            if (layoutUpdated) {
                proxy.onScrollHelper(0);
            }
            var args = {};
            args.requestType = ej.TreeGrid.Actions.Refresh;
            /* for details rows detailsDataBound event can be called after the width update of column */
            proxy._isRendered = false;
            //Rerendering the content of the tree grid
            proxy.sendDataRenderingRequest(args);
            proxy.setWidthToColumns();
            proxy._isRendered = true;
            /* trigger queryCellInfo ,detailsDataBoundEvent after update the width of the columns */
            proxy._trigger("refresh");
            this._eventBindings();
            this._hideCollapsedDetailsRows();
            /* Update the scrollbar*/           
            proxy.getScrollElement().ejScroller("refresh");
            proxy._updateScrollCss();                
            if (model.isFromGantt) {
                var gridContent = proxy.getScrollElement(),
                    isHorizontalScroll = gridContent.ejScroller("isHScroll");
                if (!isHorizontalScroll) {
                    proxy._$gridContent.addClass("e-borderbox");
                }
                else {
                    proxy._$gridContent.removeClass("e-borderbox");
                }
            }
            if (model.showColumnChooser)
                proxy._renderColumnChooserList(true);
            /* update header and footer scrollLeft value*/
            proxy._updateHeaderScrollLeft();            
            
            if (model.isFromGantt) {
                /*Add additional td on column header to maintain column width*/
                proxy._addEmptyColumntoGrid();
                /*Updating the column properties to Gantt's model.columns*/
                proxy.updateToGanttColumns();
            }           
        },
        /* Freeze all Columns before argumented column*/
        freezePrecedingColumns: function (field) {
            var proxy = this, model = this.model,
                columns = model.columns,
                currentColumn = this.getColumnByField(field),
                columnIndex = columns.indexOf(currentColumn);
            /* Clear edit state , context menu and details template*/
            if (model.isEdit)
                this.saveCell();
            else if (this._isRowEdit)
                this._saveRow();
            this._clearContextMenu();
            this._removeDetailsRow();
            this._clearColumnMenu();

            /* Check column is available or not*/
            if (ej.isNullOrUndefined(currentColumn) || columnIndex == -1)
                return false;
            /*Check all previous columns are in frozen*/
            if (columnIndex == 0 && columnIndex <= this._frozenColumnsLength)
                return false;
            /*Check frozen column width and container width */
            var frozenWidth = this._getFrozenColumnWidth(columnIndex);
            frozenWidth = frozenWidth + 18;
            if (frozenWidth > this._gridWidth)
                return false;
            /* update isFrozen API of columns and refresh the columns*/
            for (var count = 0; count < columnIndex; count++) {
                columns[count].isFrozen = true;
            }
            proxy._refreshFrozenColumns();
        },
        /* Public method for freeze or unfreeze the columns */
        freezeColumn: function (field, isFrozen) {
            var proxy = this, model = this.model,
                columns = model.columns,
                layoutUpdated = false,
                currentColumn = this.getColumnByField(field);

            /* Clear edit state , context menu and details template*/
            if (model.isEdit)
                this.saveCell();
            else if (this._isRowEdit)
                this._saveRow();
            this._clearContextMenu();
            this._removeDetailsRow();
            this._clearColumnMenu();

            if (model.selectionMode == "cell")
                proxy.clearSelection();

            /* Check column is available or not*/
            if (ej.isNullOrUndefined(currentColumn))
                return false;
            /*Check all other columns are in frozen*/
            if (proxy._frozenColumnsLength == model.columns.length - 1 && isFrozen)
                return false;
            /* Check column is in same state*/
            if (currentColumn.isFrozen == isFrozen)
                return false;
            /*Check frozen column width and container width */
            var frozenWidth = this._getFrozenColumnWidth(),
                columnIndex = columns.indexOf(currentColumn);
            frozenWidth = frozenWidth + (isFrozen ? (this.columnsWidthCollection[columnIndex] + 18) : (-this.columnsWidthCollection[columnIndex]));
            if (frozenWidth > this._gridWidth)
                return false;

            currentColumn.isFrozen = isFrozen;
            /* refresh columns collection in UI*/
            proxy._refreshFrozenColumns();
        },
        //#region RUNTIME UPDATE METHOD FOR TREEGRID
        //METHOD FOR UPDATE THE TREEGRID IN RUN TIME
        _setModel: function (options) {

            var proxy = this,
                model = proxy.model,
                updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;

            for (var prop in options) {

                switch (prop) {

                    case "enableAltRow":
                        model.enableAltRow = options[prop];
                        proxy._addInitTemplate();
                        proxy.renderRecords(args);
                        break;
                    case "allowFiltering":
                        model.allowFiltering = options[prop];
                        proxy._initiateSetModel();
                        model.allowFiltering = options[prop];
                        var scroller = proxy.getScrollElement().ejScroller("instance"),
                          left = scroller.scrollLeft(),
                          top = scroller.scrollTop();
                        //Re render the grid header
                        proxy._$gridHeaderContent.replaceWith(proxy._renderGridHeader());
                        proxy._setWidthToHeaders();
                        proxy._viewPortHeight = proxy._getViewPortHeight();
                        if (proxy._frozenColumnsLength > 0) {
                            proxy._$gridContent.css("height", proxy._viewPortHeight);
                        }
                        scroller.option("height", proxy._viewPortHeight);
                        if (model.enableVirtualization) {
                            var length = model.currentViewData.length,
                                rowHeight = model.rowHeight, isTopChanged;
                            rowHeight += (model.showDetailsRow && !model.showDetailsRowInfoColumn) ? model.detailsRowHeight : 0;
                            if ((length * rowHeight) < proxy._viewPortHeight) {
                                if (length > 0) {
                                    top = top - (proxy._viewPortHeight - ((length - 1) * rowHeight));
                                    if (top < 0)
                                        top = 0;
                                } else {
                                    proxy.processBindings();
                                    proxy.renderRecords();
                                }
                            }
                        }
                        //Update columnOptions fields
                        if (model.showColumnChooser && showColumnOptions)
                            proxy.columnAddDialogTemplate();
                        //update the column width
                        this.setWidthToColumns();
                        scroller.scrollY(top, true);
                        scroller.scrollX(left, true);
                        proxy._updateHeaderScrollLeft(left);
                        proxy._updateScrollCss();
                        break;
                    case "enableResize":
                        proxy.model.enableResize = options[prop];
                        if (model.enableResize) {
                            proxy._on($(window), "resize", proxy._windowResize);
                        }
                        else {
                            proxy._off($(window), "resize", proxy._windowResize);
                        }
                        break;

                    case "isResponsive":
                        proxy.model.isResponsive = options[prop];
                        if (model.isResponsive) {
                            proxy._on($(window), "resize", proxy._windowResize);
                        }
                        else {
                            proxy._off($(window), "resize", proxy._windowResize);
                        }
                        break;

                    case "headerTextOverflow":
                        model.headerTextOverflow = options[prop];
                        proxy._$gridHeaderContent.replaceWith(proxy._renderGridHeader());                        
                        proxy.updateViewPortHeight();

                        if (model.enableVirtualization) {
                            proxy.cancelRowEditCell(); // To hide or destroy popup menu
                            proxy.processBindings();
                            var tempArgs = {},
                                rowHeight = model.rowHeight;
                            tempArgs.requestType = ej.TreeGrid.Actions.Refresh;
                            proxy.sendDataRenderingRequest(tempArgs);
                            /* check detail template and its row height */
                            if (model.showDetailsRow && model.detailsTemplate && !model.showDetailsRowInfoColumn) {
                                rowHeight += model.detailsRowHeight;
                            }

                            if ((model.currentViewData.length * rowHeight) < proxy._viewPortHeight) {

                                var currentPosition = top - (proxy._viewPortHeight - model.currentViewData.length * rowHeight);
                                if (currentPosition < 0)
                                    currentPosition = 0;
                                proxy._$gridContent.ejScroller("scrollY", currentPosition, true);
                            }
                        }
                        
                        proxy._$gridContent.ejScroller({ height: proxy._viewPortHeight });
                        proxy._updateScrollCss();
                        proxy.setWidthToColumns();
                                           
                        break;

                    case "enableVirtualization":
                        model.enableVirtualization = options[prop];
                        var previousRecord = proxy._prevSelectedItem,
                            selectedRecord = proxy.selectedRowIndex() && updatedRecords[proxy.selectedRowIndex()];
                        proxy.processBindings();
                        // change the table top position is 0 and change the update records for non-virtulization mode.
                        if (!model.enableVirtualization) {
                            if (this._frozenColumnsLength > 0) {
                                proxy._$frozenTableContent.css({
                                    "top": 0
                                });
                                proxy._$movableTableContent.css({
                                    "top": 0
                                });
                            } else {
                                proxy._$tableContent.css({
                                    "top": 0
                                });
                            }
                        }
                        selectedRecord && proxy.selectedRowIndex(updatedRecords.indexOf(selectedRecord));
                        var args = {};
                        args.requestType = ej.TreeGrid.Actions.Refresh;
                        proxy.sendDataRenderingRequest(args);
                        proxy._isRowEdit = model.isEdit = false;
                        proxy._cancelSaveTools();
                        proxy._clearColumnMenu();
                        proxy._clearContextMenu();
                        this._removeDetailsRow();
                        break;

                    case "allowColumnResize":
                        model.allowColumnResize = options[prop];
                        if (model.allowColumnResize)
                            proxy._resizer = new ej.gridFeatures.gridResize(proxy);
                        proxy._enableColumnResizeEvents();
                        break;

                    case "allowSorting":
                        model.allowSorting = options[prop];
                        proxy.sortSetting(options[prop]);
                        if (model.showColumnChooser && showColumnOptions)
                            proxy.columnAddDialogTemplate();
                        break;
                    case "allowPaging":
                        if (model.allowPaging) {                            
                            proxy.element.append(proxy._renderGridPager());
                            proxy.element.append(proxy.element.find(".e-pager").first());
                            proxy.element.find(".e-pager").css({ "width": proxy._$gridContent.width() });
                            var scroller = proxy.getScrollElement().ejScroller("instance"),
                                left = scroller.scrollLeft(),
                                top = scroller.scrollTop();                            
                            proxy._viewPortHeight = proxy._getViewPortHeight();                            
                            scroller.option("height", proxy._viewPortHeight);                            
                            scroller.scrollY(top, true);
                            scroller.scrollX(left, true);                            
                            proxy.gotoPage();                            
                        }
                        else {
                            proxy.element.find(".e-pager").first().remove();
                            if(model.pageSettings.totalRecordsCount > 0)
                                proxy._refreshDataSource();
                            else
                                proxy.processBindings();
                        }                
                        break;
                   
                    case "dragTooltip":
                        var tooltipValue = options[prop].tooltipItems;
                        if (tooltipValue && !$.isArray(tooltipValue)) {
                            tooltipValue = tooltipValue.length > 0 ? tooltipValue.split(",") : [];
                            options[prop].tooltipItems = tooltipValue;
                        }
                        $.extend(model.dragTooltip, options[prop]);
                        proxy._createDragTooltipTemplate();
                        proxy.refreshContent();
                        break;

                    case "allowDragAndDrop":
                        model.allowDragAndDrop = options[prop];
                        var matched = jQuery.uaMatch(navigator.userAgent);
                        if (model.allowDragAndDrop) {
                            //Events binded for Row drag and drop
                            proxy._on(proxy.element, "mousedown", ".e-treegridrows, .e-templatecell", proxy.dragRecord);
                            proxy._on($(document), "mouseup", proxy.dragMouseUp);
                            // touch events binded for row drag and drop 
                            if (matched.browser.toLowerCase() == "chrome") {
                                proxy._on(proxy.element, "touchstart", ".e-treegridrows, .e-templatecell", proxy.dragRecord);
                                $(document.body).bind("touchmove", function (event) {
                                    event.preventDefault();
                                });
                                $(document.body).bind("touchmove", $.proxy(proxy.dragToolTip, proxy));
                                proxy._on(proxy.element, "touchend", ".e-treegridrows, .e-templatecell", proxy.dragMouseUp);
                                proxy._on(proxy.element, "touchleave", ".e-treegridrows, .e-templatecell", proxy.dragMouseUp);
                                $(proxy._$bodyContainer).bind("touchend", $.proxy(proxy.dragMouseUp, proxy));
                                $(proxy._$bodyContainer).bind("touchleave", $.proxy(proxy.dragMouseUp, proxy));
                            }
                        }
                        else {
                            proxy._off(proxy.element, "mousedown", ".e-treegridrows, .e-templatecell", proxy.dragRecord);
                            proxy._off($(document), "mouseup", proxy.dragMouseUp);

                            if (matched.browser.toLowerCase() == "chrome") {
                                proxy._off(proxy.element, "touchstart", ".e-treegridrows, .e-templatecell", proxy.dragRecord);
                                $(document.body).unbind("touchmove", function (event) {
                                    event.preventDefault();
                                });
                                $(document.body).unbind("touchmove", $.proxy(proxy.dragToolTip, proxy));
                                proxy._off(proxy.element, "touchend", ".e-treegridrows, .e-templatecell", proxy.dragMouseUp);
                                proxy._off(proxy.element, "touchleave", ".e-treegridrows, .e-templatecell", proxy.dragMouseUp);
                                $(proxy._$bodyContainer).unbind("touchend", $.proxy(proxy.dragMouseUp, proxy));
                                $(proxy._$bodyContainer).unbind("touchleave", $.proxy(proxy.dragMouseUp, proxy));
                            }
                        }
                        proxy.refreshContent();
                        break;

                    case "sortSettings":
                        $.extend(model.sortSettings, options[prop]);
                        proxy.refreshContent();
                        var refreshArgs = {};
                        refreshArgs.requestType = ej.TreeGrid.Actions.Refresh;
                        proxy.sendDataRenderingRequest(refreshArgs);                       
                        break;

                    case "allowSelection":                      
                        model.allowSelection = options[prop];
                        if (!model.allowSelection) {                                                   
                            proxy.clearSelection(-1);
                            proxy.selectedRowIndex(-1);
                            proxy.model.selectedItem = null;
                            proxy._cancelSaveTools();
                        }
                        break;

                    case "selectionType":
                        proxy.clearSelection(-1);
                        proxy.selectedRowIndex(-1);
                        proxy.model.selectedItem = null;
                        proxy._cancelSaveTools();
                        model.selectionType = options[prop];
                        break;
                    case "selectionMode":
                        proxy.clearAllSelection();
                        model.selectionMode = options[prop];
                        if (model.showColumnChooser && showColumnOptions)
                            proxy.columnAddDialogTemplate();
                        break;
                    case "showSummaryRow":
                        model.showSummaryRow = options[prop];
                        if (model.showSummaryRow) {
                            proxy._createSummaryRow();
                            var refreshArgs = {};
                            refreshArgs.requestType = ej.TreeGrid.Actions.Refresh;
                            proxy.sendDataRenderingRequest(refreshArgs);
                        }
                        else {
                            $(proxy.element).find(".e-summaryrow").hide();
                            model.updatedRecords = $(model.updatedRecords).not(model.summaryRowRecords).get();
                        }
                        proxy.updateCollapsedRecordCount();
                        proxy.updateHeight();
                        break;
                    case "showTotalSummary":
                        model.showTotalSummary = options[prop];
                        if (model.showTotalSummary) {
                            proxy._createTotalSummaryRow();
                            proxy._setWidthToFooters();
                            proxy._viewPortHeight = proxy._getViewPortHeight();
                            proxy._viewPortHeight -= $(proxy._$totalSummaryRowContainer).height();
                        }
                        else {
                            $(proxy.element).find(".e-footersummaryrowdiv").remove();
                            proxy._viewPortHeight = proxy._getViewPortHeight();
                        }

                        var scroller = proxy.getScrollElement().ejScroller("instance"),
                            left = scroller.scrollLeft(),
                            top = scroller.scrollTop();
                        if (proxy._frozenColumnsLength > 0) {
                            proxy._$gridContent.css("height", proxy._viewPortHeight);
                        }
                        scroller.option("height", proxy._viewPortHeight);
                        if (model.enableVirtualization) {
                            var length = model.currentViewData.length,
                                rowHeight = model.rowHeight;
                            rowHeight += (model.showDetailsRow && !model.showDetailsRowInfoColumn) ? model.detailsRowHeight : 0;
                            if ((length * rowHeight) < proxy._viewPortHeight) {
                                if (length > 0) {
                                    top = top - (proxy._viewPortHeight - ((length - 1) * rowHeight));
                                    if (top < 0)
                                        top = 0;
                                } else {
                                    proxy.processBindings();
                                    proxy.renderRecords();
                                }
                            }
                        }
                        scroller.scrollY(top, true);
                        scroller.scrollX(left, true);
                        proxy._updateHeaderScrollLeft(left);
                        proxy._updateScrollCss();
                        break;
                    case "selectedRowIndex":
                        if (!this.isEdit && !this._isRowEdit) {
                            if (this.selectedRowIndex() >= 0
                                && !ej.isNullOrUndefined(this.selectedRowIndex()) && model.allowSelection && updatedRecords.length > this.selectedRowIndex()
                                && this.getExpandStatus(updatedRecords[this.selectedRowIndex()])) {
                                var index = this.selectedRowIndex();
                                if (!proxy._rowSelectingEventTrigger(this._previousIndex, index)) {
                                    if (model.showSummaryRow) {
                                        var recordsWithOutSummary = $(updatedRecords).not(model.summaryRowRecords).get(),
                                            currentSelectedRecord = recordsWithOutSummary[index];
                                        index = updatedRecords.indexOf(currentSelectedRecord);
                                    }
                                    proxy.selectRows(index);
                                    proxy._rowSelectedEventTrigger(index);
                                }
                            } else {
                                proxy.clearSelection(-1);
                                proxy.selectedRowIndex(-1);
                                proxy.model.selectedItem = null;
                                proxy._previousIndex = -1;
                            }
                            proxy._cancelSaveTools();
                        } else {
                            this.selectedRowIndex(updatedRecords.indexOf(proxy._prevSelectedItem));
                        }
                        break;
                    case "selectedCellIndexes":
                        if (model.allowSelection && model.selectionMode == "cell") {                            
                            proxy.selectCells(options[prop]);                            
                        }
                        break;
                    case "editSettings":
                        $.extend(model.editSettings, options[prop]);
                        proxy._processEditing();
                        proxy._enableEditingEvents();
                        proxy._updateToolbarItems();
                        break;

                    case "allowKeyboardNavigation":
                        model.allowKeyboardNavigation = options[prop];
                        break;

                    case "dataSource":
                        if (!proxy._isRowEdit && !proxy.model.isEdit) {
                            proxy._refreshDataSource();
                        }
                        break;

                    case "columns":
                        model.columns = options[prop].slice(0);
                        proxy._refreshFrozenColumns();
                        break;
                    
                    case "rowHeight":
                        model.rowHeight = options[prop];
                        proxy._addInitTemplate();
                        proxy.renderRecords(args);
                        proxy.updateHeight();
                        break;

                    case "treeColumnIndex":
                        proxy.columnIndex(options[prop]);
                        break;

                    case "showColumnChooser":
                        model.showColumnChooser = options[prop];
                        proxy._$gridHeaderContent.replaceWith(proxy._renderGridHeader());
                        proxy.setWidthToColumns();
                        proxy.getScrollElement().ejScroller("refresh");
                        proxy._updateScrollCss();
                        if (!model.showColumnChooser){
                            proxy._clearColumnMenu();
                            $("#" + proxy._id + "ccDiv_wrapper").remove();
                        }
                        else
                            proxy._renderColumnChooser();
                        /*Add empty column in gantt*/
                        if (model.isFromGantt) {
                            proxy._addEmptyColumntoGrid();
                        }
                        break;
                    case "showColumnOptions":
                        model.showColumnOptions = options[prop];
                        proxy._$gridHeaderContent.replaceWith(proxy._renderGridHeader());
                        proxy.setWidthToColumns();
                        proxy.getScrollElement().ejScroller("refresh");
                        proxy._updateScrollCss();
                        if (model.showColumnChooser && model.showColumnOptions) {
                            proxy.columnAddDialogTemplate();
                            proxy._renderUpdateConfirmDialog();
                        }
                        else {
                            proxy._clearColumnMenu();
                            $("#" + proxy._id + "ccDiv_wrapper").remove();
                        }
                        /*Add empty column in gantt*/
                        if (model.isFromGantt) {
                            proxy._addEmptyColumntoGrid();
                        }
                        break;
                    case "locale":
                        proxy._clearContextMenu();
                        proxy._clearColumnMenu();
                        proxy._removeDetailsRow();
                        model.locale = options[prop];
                        proxy._setCultureInfo();
                        proxy._processEditing();
                        proxy._addInitTemplate();
                        proxy.refreshContent();
                        //Re render the grid header(for updating filtering elements also) and content
                        proxy._$gridHeaderContent.replaceWith(proxy._renderGridHeader());
                        proxy.renderRecords(args);
                        proxy.setWidthToColumns();
                        // Update the scrollbar
                        proxy.getScrollElement().ejScroller("refresh");
                        proxy._updateScrollCss();
                        // Update the column chooser
                        if (model.showColumnChooser)
                            proxy._renderColumnChooserList(true);
                        // Update the toolbar
                        if (model.toolbarSettings.showToolbar)
                            proxy._updateToolbar();
                        if (model.allowPaging)
                            proxy.getPager().ejPager("option", options[prop]).ejPager("refreshPager");
                        break;
                    case "toolbarSettings": 
                        $.extend(proxy.model.toolbarSettings, options[prop]);
                        proxy._updateToolbar();
                        break;
                    case "contextMenuSettings":
                        $.extend(proxy.model.contextMenuSettings, options[prop]);
                        if (!model.contextMenuSettings.showContextMenu)
                            proxy._clearContextMenu();
                        this._removeDetailsRow();
                        break;
                    case "enableCollapseAll":
                        model.enableCollapseAll = options[prop];
                        if (model.enableCollapseAll)
                            proxy.collapseAll();
                        else
                            proxy._expandAll();
                        break;
                    case "showDetailsRow":
                        model.showDetailsRow = options[prop];
                        this._updateDetailsRowProperties("showDetailsRow");
                        break;
                    case "detailsRowHeight":
                        model.detailsRowHeight = options[prop];
                        this._updateDetailsRowProperties("detailsRowHeight");
                        break;
                    case "detailsTemplate":
                        model.detailsTemplate = options[prop];
                        this._updateDetailsRowProperties("detailsTemplate");
                        break;
                    case "showDetailsRowInfoColumn":
                        model.showDetailsRowInfoColumn = options[prop];
                        this._updateDetailsRowProperties("showDetailsRowInfoColumn");
                        break;
                    case "altRowTemplateID":
                        this._initiateSetModel();
                        model.altRowTemplateID = options[prop];
                        proxy._addInitTemplate();
                        proxy.renderRecords(args);
                        this.updateHeight();
                        break;
                    case "rowTemplateID":
                        this._initiateSetModel();
                        model.rowTemplateID = options[prop];
                        proxy._addInitTemplate();
                        proxy.renderRecords(args);
                        this.updateHeight();
                        break;
                    case "pageSettings":
                        this._initiateSetModel();
                        if (model.allowPaging) {
                            $.extend(model.pageSettings, options[prop]);
                            this.getPager().ejPager("option", model.pageSettings).ejPager("refreshPager");
                            if (options[prop].totalRecordsCount > 0) {
                                proxy._refreshDataSource();
                            }
                            else
                                proxy.gotoPage();
                        }
                        break;
                    case "sizeSettings":
                        this._initiateSetModel();
                        $.extend(model.sizeSettings, options[prop]);

                        this._calculateDimensions();
                        if (this._getViewPortHeight() <= 0) {
                            model.sizeSettings.height = "450px";
                            this._updateElementHeight();
                        }
                        this._windowResize();
                        break;
                    case "readOnly":
                        model.readOnly = options[prop];
                        break;
                    case "showGridCellTooltip":
                        model.showGridCellTooltip = options[prop];
                        break;

                    case "showGridExpandCellTooltip":
                        model.showGridExpandCellTooltip = options[prop];
                        break;

                    case "allowMultiSorting":
                        model.allowMultiSorting = options[prop];
                        break;

                    case "query":
                        var proxy = this;
                        if (!ej.isNullOrUndefined(options[prop]))
                            model.query = options[prop];
                        else
                            model.query = ej.Query();
                        proxy._refreshDataSource();
                        break;
                    case "filterSettings":
                        if (model.allowFiltering) {
                            var filterSettings,
                                filterBarMode, args = {};
                            $.extend(proxy.model.filterSettings, options[prop]);
                            filterSettings = proxy.model.filterSettings
                            filterBarMode = ej.isNullOrUndefined(filterSettings.filterBarMode) ? "immediate" : filterSettings.filterBarMode
                            // Get the filteredColumn value before going to clear the filter columns
                            var newFilterColumn = $.extend([], filterSettings.filteredColumns);

                            for (var column = 0; column < model.columns.length; column++) {
                                proxy._clearFilterElementValue(model.columns[column]);
                            }

                            filterSettings.filteredColumns = newFilterColumn;
                            filterSettings.filterBarMode = filterBarMode;
                            args.requestType = "filtering";

                            for (var i = 0; i < newFilterColumn.length; i++)
                                $("#" + proxy._id + "_" + newFilterColumn[i].field + "_filterbarcell").val(newFilterColumn[i].value);
                            //Render the record with sorting and filtering
                            proxy._ensureDataSource(args);
                            proxy._off(proxy.element, "keyup", ".e-filterbarcell input", proxy._filterBarHandler);
                            proxy._off(proxy.element, "click", ".e-filterbarcell .e-checkbox", proxy._filterBarHandler);
                            //Method binding for filtering data.
                            if (filterBarMode == "immediate") {
                                proxy._on(proxy.element, "keyup", ".e-filterbarcell input", proxy._filterBarHandler);
                                proxy._off(proxy.element, "click", ".e-filterbarcell .e-checkbox")._on(proxy.element, "click", ".e-filterbarcell .e-checkbox", proxy._filterBarHandler);
                            }                            
                        }
                        break;
                }
            }
        },
        /* clear contextMenu, columnChooser, detailsTemplate and save edited item before change
        property by setModel*/
        _initiateSetModel: function ()
        {
            var model = this.model;
            if (model.isEdit)
                this.saveCell();
            else if (this._isRowEdit)
                this._saveRow();
            this._clearContextMenu();
            this._clearColumnMenu();
            this._removeDetailsRow();
        },
        /* update the tree grid control as per new detailsRow fetaures API values by setModel */
        _updateDetailsRowProperties: function (property) {

            var proxy = this,
                model = this.model;

            /* cance edited cell or row */
            if(model.isEdit || this._isRowEdit){
                this.cancelRowEditCell();
                this._cancelSaveTools();
            }
            /* clear columnchooser menu and contextmenu and detail wrapper */
            this.clearColumnMenu();
            this._clearContextMenu();
            this._removeDetailsRow();
             
            /* update the detailsRowHeight private property */
            if (model.showDetailsRow && model.detailsTemplate && !model.showDetailsRowInfoColumn) {
                proxy._detailsRowHeight = model.detailsRowHeight;
            } else {
                proxy._detailsRowHeight = 0;
            }

            /* update the details expand status as per details feture API values */
            model.flatRecords.forEach(function (record) {
                if (model.showDetailsRow && model.detailsTemplate) {
                    record.isDetailsExpanded = model.showDetailsRowInfoColumn ? false : true;
                } else {
                    record.isDetailsExpanded = false;
                }
            });
            
            /* update the tree grid control as per new detailsRow API's */
            if ((property == "detailsTemplate" || property == "detailsRowHeight") && model.showDetailsRowInfoColumn) {
                proxy._addInitTemplate();
            } else {
                proxy._$gridHeaderContent.replaceWith(proxy._renderGridHeader());
                proxy._addInitTemplate();
                /* while changing details row features API scroll top is assigned to beacause of rowHeight changes*/
                this.onScrollHelper(0);
                proxy.refreshContent();

                /* for details rows detailsDataBound event can be called after the width update of column */
                proxy._isRendered = false;
                //Rerendering the content of the tree grid
                var refreshArgs = {};
                refreshArgs.requestType = ej.TreeGrid.Actions.Refresh;
                proxy.sendDataRenderingRequest(refreshArgs);
                proxy.setWidthToColumns();
                proxy._isRendered = true;
                proxy._trigger("refresh");
                /* trigger queryCellInfo ,detailsDataBoundEvent after update the width of the columns */
                this._eventBindings();
                this._hideCollapsedDetailsRows();

                proxy.getScrollElement().ejScroller("refresh");
                proxy._updateScrollCss();
            }
        },
        /* hide the collapsed state detail rows for prevent alignement issue for rendering sf control in  display none state*/
        _hideCollapsedDetailsRows:function()
        {
            var proxy = this, model = this.model;
            /* Collapse hidden expanded details rows */
            if (model.showDetailsRow && model.detailsTemplate && !model.showDetailsRowInfoColumn) {
                if (this._frozenColumnsLength > 0)
                    $(proxy.getTreeGridRows()[0]).add(proxy.getTreeGridRows()[1]).filter("tr.collapsedrowexpandeddetailsrow").css("display", "none");
                else
                    $(proxy.getTreeGridRows()).filter("tr.collapsedrowexpandeddetailsrow").css("display", "none");
            }
        },
        _updateToolbar: function () {
            var proxy = this,
                model = proxy.model,
                scroller = proxy.getScrollElement().ejScroller("instance"),
                           left = scroller.scrollLeft(),
                           top = scroller.scrollTop();
            //$.extend(proxy.model.toolbarSettings, options[prop]);
            $("#" + proxy._id + "_toolbarItems").remove();
            if (model.toolbarSettings.showToolbar)
                proxy._renderToolbarTemplate().insertBefore($("#" + proxy._id + "e-gridheader"));
            if (model.isEdit)
                proxy.cancelEditCell();
            if (proxy._isRowEdit) {
                proxy.cancelRowEditCell();
                proxy._cancelSaveTools();
            }
            proxy._viewPortHeight = proxy._getViewPortHeight();
            if (proxy._frozenColumnsLength > 0) {
                proxy._$gridContent.css("height", proxy._viewPortHeight);
            }
            scroller.option("height", proxy._viewPortHeight);
            if (model.enableVirtualization) {
                proxy.processBindings();
                proxy.renderRecords();
            }
            scroller.option("scrollTop", top);
            scroller.option("scrollLeft", left);
            proxy._clearContextMenu();
            this._removeDetailsRow();

        },
        //refresh data source on set model     
        _refreshDataSource: function ()
        {
            var proxy = this, model = this.model;
            //Cancelling the editable state of the row
            if (proxy._isRowEdit || proxy.model.isEdit) {
                proxy.cancelRowEditCell();
            }
            proxy.resetModelCollections();
            proxy._createdAt = "load";
            if (this.dataSource() instanceof ej.DataManager) {
                var queryPromise = this.dataSource().executeQuery(model.query);
                queryPromise.done(ej.proxy(function (e) {
                    if (proxy.dataSource().dataSource.offline) {
                        proxy._retrivedData = proxy.dataSource().dataSource.json;
                    } else {
                        proxy._retrivedData = e.result;
                    }
                    if (model.idMapping && model.parentIdMapping) {
                        //cloning the datasource
                        var dataArray = e.result.slice(0);
                        var data = [];
                        $.each(dataArray, function (indx, value) {
                            data.push(jQuery.extend(true, {}, value));
                        });
                        proxy._reconstructDatasource(data);
                    } else {
                        proxy._reconstructDatasource(e.result);
                    }
                    proxy._createRecords(proxy.secondaryDatasource);

                    args = {};
                    args["requestType"] = ej.TreeGrid.Actions.RefreshDataSource;
                    proxy._ensureDataSource(args);
                    if (proxy.selectedRowIndex() !== -1 && proxy.selectedRowIndex() < proxy.model.currentViewData.length) {
                        proxy.selectRows(proxy.selectedRowIndex());
                    }
                    if (proxy.getScrollElement().hasClass("e-scroller"))
                        proxy.getScrollElement().ejScroller("refresh");
                    proxy._createdAt = null;
                }));
            }
            else if (this.dataSource()) {
                proxy._retrivedData = proxy.dataSource();
                if (model.idMapping && model.parentIdMapping) {
                    if ((model.idMapping.length > 0) && (model.parentIdMapping.length > 0)) {
                        var dataArray = this.dataSource().slice(0);
                        proxy._reconstructDatasource(dataArray);
                        proxy._createRecords(proxy.secondaryDatasource);
                    }
                }
                else if (model.flatRecords.length === 0 && this.dataSource() !== null) {
                    proxy._createRecords(this.dataSource());
                }
                args = {};
                args["requestType"] = ej.TreeGrid.Actions.RefreshDataSource;
                proxy._ensureDataSource(args);
                if (this.selectedRowIndex() !== -1 && this.selectedRowIndex() < proxy.model.currentViewData.length) {
                    proxy.selectRows(this.selectedRowIndex());
                }
                if (proxy.getScrollElement().hasClass("e-scroller"))
                    proxy.getScrollElement().ejScroller("refresh");
                proxy._createdAt = null;
            }
            else if (this.dataSource() == null) {
                args = {};
                args["requestType"] = ej.TreeGrid.Actions.RefreshDataSource;
                proxy._ensureDataSource(args);
                proxy._createdAt = null;
            }
            $(".e-tooltiptable").remove();
            if(model.showSummaryRow || model.showTotalSummary)
                proxy._summaryRow();
        },
        //REFRESH THE TREEGRIDCONTENT
        refreshContent: function () {

            var proxy = this,
                args = {};     
            args.requestType = ej.TreeGrid.Actions.Refresh;
            proxy.processBindings(args);
        },


        //RESET THE COLLECTIONS WHILE CHANGING THE DATASOURCE
       
        resetModelCollections: function () {

            var proxy = this,
            model = proxy.model;

            // model.sortSettings.sortedColumns = [];
            model.currentViewData = [];
            model.flatRecords = [];
            model.parentRecords = [];
            model.updatedRecords = [];
            model.summaryRowRecords = [];
            model.ids = [];
            proxy.secondaryDatasource = [];
            proxy._parentRecords = [];
            proxy._storedIndex = -1;

        },        

        //#endregion

        //DECLARE THE PRIVATE VARIABLES
        _initPrivateProperties: function () {

            var proxy = this,
                model = this.model;

            proxy._id = proxy.element.attr("id"),
            proxy.columnsWidthCollection = [],
            proxy._cSortedColumn = null,
            proxy._cSortedDirection = null,
            proxy._dataManager = null,
            proxy._disabledSortableColumns = [],
            proxy._filteredRecords = [],
            proxy._disabledToolItems = [],
            proxy_currentFilterColumn = [],
            proxy._fieldColumnNames = [],
            proxy._multiSortRequest = null,
            proxy._$gridContainer = null,
            proxy._$gridContent = null,
            proxy._$gridContentTable = null,
            proxy._$gridHeaderTable = null,
            proxy._$gridHeaderContainer = null,
            proxy._$totalSummaryRowContainer = null,
            proxy._recordsCount = null,
            proxy._$gridRows = null,
            proxy._gridRows = null,
            this._frozenColumnsLength = 0,
            proxy._initFrozenColumns(),
            proxy._allowFreezingDefault = this._frozenColumnsLength > 0 ? true : false;
            proxy._calculateDimensions(),
            proxy._headerColumnNames = [],
            proxy._hiddenColumns = [],
            proxy._multiSelectCtrlRequest = false,
            proxy._multiSelectShiftRequest = false,
            proxy._offset = 0,
            proxy._previousIndex = -1,
            proxy._prevRBottom = 0,
            proxy._prevRTop = 0,
            proxy._prevScrollTop = 0,
            proxy._prevScrollLeft = 0,
            proxy._prevVBottom = 0,
            proxy._resizer = null,
            proxy._scrollTop = 0,
            proxy._scrollLeft = 0,
            proxy._searchString = "",
            proxy._fieldName = "",
            proxy._selectedCellsinARow = [],
            proxy._currentRecordIndex = -1,
            proxy._sortedRecords = [],
            proxy._storedIndex = -1,
            proxy._rowIndex = -1,
            proxy._$tableContent = null,
            proxy._$footertableContent = null,
             proxy._$footerContainer = null,
            proxy._tempsortedrecords = [],
            proxy._totalHeight = 0,
            proxy._viewPortHeight = 0,
            proxy._recordIndexCount = 0,
            proxy._totalCollapsedRecordCount = 0,
            proxy._visibleColumns = [],
            proxy._visibleRange = null,
            proxy._vScrollDir = 1,
            proxy._vScrollDist = 0,
            proxy._cellEditTemplate = $(),
            proxy._tooltipTimer,
            proxy._totalBorderWidth = 2;//left and right border width
            proxy._totalBorderHeight = 1;
            proxy._toolboxTooltipTexts = null;
            proxy._contextMenuTexts = null;
            proxy._columnMenuTexts = null;
            proxy._deleteColumnText = null;
            proxy._okButtonText = null;
            proxy._cancelButtonText = null;
            proxy._confirmDeleteText = null;
            proxy._dropDownListBlanksText = null;
            proxy._dropDownListClearText = null;
            proxy._trueText = null;
            proxy._falseText = null;
            proxy._rowDragIndexes = [];
            proxy._dropCancel = false;
            proxy._cellEditingDetails = {
                cellValue: null,
                rowIndex: -1,
                columnIndex: -1,
                fieldName: null,
                _data: null,
                cellEditType: "",
                cancelSave: false,
                defaultData: null,
                insertedTrCollection: [],
                data: null
            },
           proxy._previousSelectedCellDetails = {
               rowElement: null,
               cellElement: null,
               cellIndex: -1,
               rowIndex: -1,
           },
           proxy._shiftKeyFirstElementDetails = {
               firstElementRowIndex: -1,
               firstElementCellIndex: -1
           },
            proxy._selectedCellDetails = [];
            proxy._focusingRowIndex = -1,
            proxy._rowIndexOfLastSelectedCell = -1,
            proxy._lastSelectedCellIndex = -1,
            proxy._tdsOffsetWidth = [],
            proxy._isEnterKeyPressed = false,
            proxy._isShiftKeyNavigation = false;
            proxy._scrollBarHeight = 18,
            proxy._removedCount = 0,
            proxy._$gridHeaderContent = null,
            proxy.secondaryDatasource = [],
            //variables for context menu items
            proxy._contextMenuItems = null;
            proxy._subContextMenuItems = null;
           
            proxy._createContextMenuTemplate();
            proxy._createColumnMenuTemplate();
            proxy._retrivedData = this.dataSource();
            proxy._createdAt = "load";
            proxy._isInExpandCollapseAll = false;
            proxy._dataManager = proxy.dataSource() instanceof ej.DataManager ? proxy.dataSource() :
                proxy.dataSource() != null ? ej.DataManager(proxy.dataSource()) : null;
            proxy._dragMouseDown = false;
            proxy._dragTooltip = false;
            proxy._dragMouseLeave = false;
            _timerDragDown = null;
            _timerDragUp = null;  
            /* Check data manger is updatable */ 
            proxy._isDataManagerUpdate = false;
            proxy._jsonData = null;

            /* flag for refreshing newly added record */
            proxy._isRefreshAddedRecord = false;
            /* Used as flag for refresh chart and grid rows on adding when parent item is in collpased state*/
            proxy._isInAdd = false;         
            /* get unique index for tree grid add whil add */
            proxy._maxRowIndex = 0;
           /* used to check treegrid rendering is completed on load time*/
            proxy._isRendered = false;

            proxy._isSummaryRow = false;
            proxy._flatChildRecords = [];
            proxy._footerSummaryRecord = [];
            proxy._filteredChildRecords = [];
            proxy._parentRecords = [];
            proxy._zerothLevelParentRecords = [];
            proxy._detailsRowHeight = 0;
            if (model.showDetailsRow && model.detailsTemplate && !model.showDetailsRowInfoColumn)
            {
                proxy._detailsRowHeight = model.detailsRowHeight;
            }
            proxy._isEmptyRow = false;
            proxy._isPublicAdd = false;
            proxy._prevSelectedItem = null;
            proxy._dataSourcefields = [];
            proxy._columnDialogTexts = null;
            proxy._columnDialogTitle = null;
            proxy._addColumnFields = [];
            proxy._addColumnFieldsTxt = [];
            proxy._targetColumnIndex = 0;
            proxy._insertPosition = null;
            proxy._updateconfirmDialog = null;
            proxy._columnRenameDialog = null;
            proxy.localizedLabels = proxy._getLocalizedLabels();
            proxy._gridRecordsCount = proxy.model.pageSettings.totalRecordsCount;                            
            proxy._gridPager = null;
            proxy._summaryRowsCount = 0;                                 
            proxy._updatedPageData = [];
            proxy._isNextPage = false;
        },
        //set size to treegrid core by user values
        _calculateDimensions: function ()
        {
            var proxy = this, model = this.model;

            if (!model.isFromGantt) {
                if (model.sizeSettings.width)
                    proxy.element.css("width", model.sizeSettings.width);

                if (model.sizeSettings.height)
                    proxy.element.css("height", model.sizeSettings.height);
                else
                {
                    if (!proxy.element[0].style.height) {
                        proxy.element.height(450);
                    }
                    else
                        model.sizeSettings.height = proxy.element[0].style.height;
                }
            }
            proxy._gridHeight = proxy.element.height();
            proxy._gridWidth = proxy.element.width();

            if (this._frozenColumnsLength > 0) {
                var frozenWidth = 0;
                for (var count = 0; count <= this._frozenColumnsLength; count++) {
                    if (model.columns[count])
                        frozenWidth += ej.isNullOrUndefined(model.columns[count].width) ? 150 : parseInt(model.columns[count].width);
                }
                if (proxy._gridWidth < frozenWidth) {
                    proxy.element.css("width", frozenWidth);
                    model.sizeSettings.width = proxy._gridWidth = frozenWidth;
                }
            }
        },

        /* Reordering and initialize frozen and unfrozen columns*/
        _initFrozenColumns: function ()
        {
            var frozen = [], unfrozen = [], visibleFrozenColumns = 0, visibleUnfrozenColumns = 0,
                model = this.model, columns = model.columns, treeColumn;
            treeColumn = columns[model.treeColumnIndex];
            for (var columnCount = 0; columnCount < columns.length; columnCount++) {
                if (columns[columnCount]["isFrozen"] === true) {
                    frozen.push(columns[columnCount]);
                    if (ej.isNullOrUndefined(columns[columnCount].visible) || columns[columnCount].visible)
                        visibleFrozenColumns += 1;
                }
                else {
                    unfrozen.push(columns[columnCount]);
                    if (ej.isNullOrUndefined(columns[columnCount].visible) || columns[columnCount].visible)
                        visibleUnfrozenColumns += 1;
                }
            }
            if (frozen.length > 0) {
                /*one column must be in un frozen state*/
                if (model.columns.length && model.columns.length == frozen.length) {
                    unfrozen = frozen.splice(frozen.length - 1, 1);
                    unfrozen[0].isFrozen = false;
                }
                model.columns = $.merge($.merge([], frozen), unfrozen);
            }
            this._frozenColumns = frozen;
            this._unFrozenColumns = unfrozen;
            /*Update minimum number of column to visible*/
            if (visibleFrozenColumns == 0 && this._frozenColumns[0])
                this._frozenColumns[0].visible = true;
            if (visibleUnfrozenColumns == 0 && this._unFrozenColumns[0])
                this._unFrozenColumns[0].visible = true;
            if (treeColumn)
                model.treeColumnIndex = model.columns.indexOf(treeColumn);

            this._frozenColumnsLength = frozen.length;
            model.scrollSettings.frozenColumns = this._frozenColumnsLength;
        },
        //DATASOURCE CHECKING
        _checkDataBinding: function () {

            var proxy = this,
                model = proxy.model;
            proxy._createdAt = null;
            proxy.element.addClass('e-treegrid-core');
            proxy.element.attr("tabindex", "0");
            proxy._renderToolbar();
            if(proxy.model.showColumnChooser)
                proxy._renderColumnChooser();
            proxy._renderAfterColumnInitialize();
            proxy._setWidthToHeaders();
            if (proxy.model.allowPaging) {
                proxy.element.append(proxy._renderGridPager());
                proxy.element.append(proxy.element.find(".e-pager").attr({ "id": this._id + "Pager" }));
            }
            proxy._viewPortHeight = proxy._getViewPortHeight();

            /* check if viewport heigth value*/
            if (!model.isFromGantt && proxy._viewPortHeight < 0) {
                proxy._updateElementHeight();
            }
            proxy._ensureDataSource();
            if (model.showSummaryRow)
                proxy._createSummaryRow();
            proxy._initGridRender();
            proxy._$gridContent = $("#" + proxy._id + "e-gridcontent");
            proxy._$gridContainer = $("#" + proxy._id + "e-gridcontainer");
            proxy._$tableContent = $("#" + proxy._id + "e-table");
            proxy._$frozenTableContent = $("#" + proxy._id + "frozene-table");
            proxy._$movableTableContent = $("#" + proxy._id + "movablee-table");
            proxy._$gridContent.css({ "height": proxy._viewPortHeight + "px" });
            proxy.element.find(".e-pager").css({ "width": proxy._$gridContent.width() });
            proxy.updateHeight();
            if (model.showTotalSummary) {
                proxy._createTotalSummaryRow();
                if (!model.allowPaging || model.sizeSettings.height)
                    proxy._viewPortHeight = proxy._viewPortHeight - proxy._$totalSummaryRowContainer.height();
            }
            proxy._wireEvents();
            
            proxy.setWidthToColumns();
            
            proxy._renderScroller();
            proxy._updateScrollCss();
            proxy._resizeFilteringElements();
            proxy._initialEndRendering();
            if (model.isFromGantt) {
                proxy._addEmptyColumntoGrid();
            }
            if (!model.isFromGantt) {
                proxy._checkDataManagerUpdate();
            } else {
                proxy._isDataManagerUpdate = model.dataManagerUpdate.isDataManagerUpdate;
                proxy._jsonData = model.dataManagerUpdate.jsonData;
            }
        },
        //Updated records of online data manager 
        getUpdatedDataManagerData: function () {
            var proxy = this, data;
            data = proxy._jsonData;
            return data;
        },

        //Check if data manager is updatable
        _checkDataManagerUpdate: function () {
            var proxy = this,
                dataSource = this.dataSource();
            proxy._isDataManagerUpdate = false;
            proxy._jsonData = null;

            if (dataSource instanceof ej.DataManager) {
                if (dataSource.dataSource.offline && dataSource.dataSource.json) {
                    proxy._isDataManagerUpdate = true;
                    proxy._jsonData = dataSource.dataSource.json;
                }
                else if (!dataSource.dataSource.offline) {
                    proxy._isDataManagerUpdate = true;
                    proxy._jsonData = proxy._retrivedData;
                }
            }
        },

        _initDatasource: function () {
            var proxy = this,
                model = proxy.model,retriveData;
            if (!model.isFromGantt) {
            if (this.dataSource() instanceof ej.DataManager) {

                var queryPromise = this.dataSource().executeQuery(model.query);
                queryPromise.done(ej.proxy(function (e) {
                    if (proxy.dataSource().dataSource.offline) {
                        proxy._retrivedData = proxy.dataSource().dataSource.json;
                    } else {
                        proxy._retrivedData = e.result;
                    }
                    if (model.idMapping && model.parentIdMapping) {
                        //cloning the datasource
                        var dataArray = e.result.slice(0);
                        var data = [];
                        $.each(dataArray, function (indx, value) {
                            data.push(jQuery.extend(true, {}, value));
                        });
                        proxy._reconstructDatasource(data);
                    } else {
                        proxy._reconstructDatasource(e.result);
                    }
                    proxy._createRecords(proxy.secondaryDatasource);
                    proxy._checkDataBinding();
                }));
            }

            else if (this.dataSource()) {
                proxy._retrivedData = proxy.dataSource();
                if (model.idMapping && model.parentIdMapping) {
                        //cloning the datasource
                        var dataArray = this.dataSource().slice(0);
                        var data = [];
                        $.each(dataArray, function (indx, value) {
                            data.push(jQuery.extend(true, {}, value));
                        });
                        proxy._reconstructDatasource(data);
                        proxy._createRecords(proxy.secondaryDatasource);
                }
                else if (model.flatRecords.length === 0 && this.dataSource() !== null) {
                    proxy._createRecords(this.dataSource());
                }
                proxy._checkDataBinding();
            }
             else {
                    proxy._checkDataBinding();
            }
            } else {
                proxy._checkDataBinding();
            }
            
        },

        _reconstructDatasource: function (datasource) {
            var proxy = this, model = proxy.model,
                childItems, data, tempRecord = [];

            for (var i = 0; i < datasource.length; i++) {
                var data = {};
                data = ej.DataManager(datasource).executeLocal(ej.Query().where(model.parentIdMapping,
                    ej.FilterOperators.equal,
                    datasource[i][model.idMapping]));


                if ((ej.isNullOrUndefined(datasource[i][model.parentIdMapping]))
                    && data.length > 0) {
                    datasource[i][model.childMapping] = data;
                    proxy.secondaryDatasource.push(datasource[i]);
                }
                else if (ej.isNullOrUndefined(datasource[i][model.parentIdMapping]) && !(data && data.length > 0)) {
                    proxy.secondaryDatasource.push(datasource[i]);
                }

                else if (data && data.length > 0 && !(ej.isNullOrUndefined(data[0][model.parentIdMapping]))){
                    proxy._appendChildDataItems(proxy.secondaryDatasource, data);
                }
                else if ((ej.isNullOrUndefined(datasource[i][model.parentIdMapping]))
                    && data.length == 0) {
                    proxy.secondaryDatasource.push(datasource[i]);
                }

                if (data && data.length > 0) {

                    proxy._datasourceChildItems = proxy._reconstructDatasource(data);
                    if (ej.isNullOrUndefined(datasource[i][model.childMapping])) {
                        datasource[i][model.childMapping] = proxy._datasourceChildItems;
                        proxy._getParentIndex(datasource);
                    }
                    proxy._datasourceChildItems = [];

                }

                else if (!(ej.isNullOrUndefined(datasource[i][model.parentIdMapping]))) {
                    tempRecord.push(datasource[i]);
                }
            }

            if (tempRecord && tempRecord.length > 0) {
                return tempRecord;
            }
        },

        _appendChildDataItems: function (parentDatasource,data) {
            var proxy = this,
                model = proxy.model;
            
            for (var count = 0; count < parentDatasource.length; count++) {
                
                if (parentDatasource[count][model.idMapping] === data[0][model.parentIdMapping]) {
                    parentDatasource[count][model.childMapping] = data;
                }
                else if (!(ej.isNullOrUndefined(parentDatasource[count][model.childMapping])) &&
                    parentDatasource[count][model.childMapping].length > 0) {
                    proxy._appendChildDataItems(parentDatasource[count], data);
                }
            }

            if ((ej.isNullOrUndefined(parentDatasource.length)) && parentDatasource) {
                if (parentDatasource[model.idMapping] === data[0][model.parentIdMapping]) {
                    parentDatasource[model.childMapping] = data;
                }
                else if (!(ej.isNullOrUndefined(parentDatasource[model.childMapping])) &&
                    parentDatasource[model.childMapping].length > 0) {
                    proxy._appendChildDataItems(parentDatasource[model.childMapping], data);
                }
            }

        },
        
        _getParentIndex: function (datasource) {
            var proxy = this, model = proxy.model,
                dataArr = proxy.secondaryDatasource, parentIndex = 0;

            if (datasource.length > 0) {
                parentIndex = datasource[0][model.parentIdMapping];
            }
            for (var i = 0; i < dataArr.length; i++) {
                if (dataArr[i][model.idMapping] == parentIndex && ej.isNullOrUndefined(dataArr[i][model.childMapping])) {
                    dataArr[i][model.childMapping] = (datasource);
                    return true;
                }
                else {
                    var childItems = dataArr[i][model.childMapping];
                    if (childItems) {
                        for (var k = 0; k < childItems.length; k++) {
                            if (childItems[k][model.idMapping] == parentIndex && ej.isNullOrUndefined(childItems[k][model.childMapping])) {
                                childItems[k][model.childMapping] = (datasource);
                                return true;
                            }
                        }
                    }
                }
            }
        },
        //Window resize event
        _windowResize: function (e)
        {
            var proxy = this,
               model = this.model,
               treeGridHeader = proxy._$gridHeaderContent,
               totalSummaryRowContent = proxy._$totalSummaryRowContainer,
               treeGridContent,
               treegridToolbar = $("#" + proxy._id + "_toolbarItems"),
               sizeSettingsHeight = model.sizeSettings.height,
               sizeSettingsWidth = model.sizeSettings.width,
               elementStyleWidth = proxy.element[0].style.width,
               elementStyleHeight = proxy.element[0].style.height,
               width, height;

            proxy._clearContextMenu();
            proxy._clearColumnMenu();

            if (this._frozenColumnsLength > 0)
                treeGridContent = this.element.find("#e-movablecontainer" + this._id);
            else
                treeGridContent = this._$gridContent;


            $("#" + this._id + "detailscellwrapper").length > 0 && this._removeDetailsRow();

            //Width calculation
            if ((sizeSettingsWidth && (typeof(sizeSettingsWidth) != "number" && sizeSettingsWidth.indexOf("%") != -1)) || elementStyleWidth.indexOf("%") != -1) {
                var ganttWidth = sizeSettingsWidth ? sizeSettingsWidth : elementStyleWidth;
                var containerWidth = $(proxy.element).parent().width() ? $(proxy.element).parent().width() : $(proxy.element).width();
                var tempWidth = (containerWidth / 100) * parseInt(ganttWidth);
                width = tempWidth;
            }
            else
                width = $(proxy.element).width();
            proxy._gridWidth = width;
            if (proxy._frozenColumnsLength > 0) {
                var totalWidth = 0;
                for (var i = 0; i <= proxy._frozenColumnsLength; i++)
                    totalWidth += proxy.columnsWidthCollection[i];
                if (width < totalWidth)
                    proxy._gridWidth = width = totalWidth;
            }
            //height calculation
            if ((sizeSettingsHeight && (typeof (sizeSettingsHeight) != "number" && sizeSettingsHeight.indexOf("%") != -1)) || elementStyleHeight.indexOf("%") != -1) {
                var ganttHeight = sizeSettingsHeight ? sizeSettingsHeight : elementStyleHeight;
                var containerHeight = $(proxy.element).parent().height() ? $(proxy.element).parent().height() : $(proxy.element).height();
                var tempHeight;
                if ($(proxy.element).parent().height())
                    tempHeight = (containerHeight / 100) * parseInt(ganttHeight);
                else
                    tempHeight = $(proxy.element).height();
                height = tempHeight;
            }
            else
                height = $(proxy.element).height();

            //excludes border 
            height = height - proxy._totalBorderHeight;
            if (model.allowPaging){
                height = height - proxy.element.find('.e-pager').outerHeight();
                if(!model.sizeSettings.height)
                    height = height + proxy.element.find('.e-hscrollbar').outerHeight();
            }
            if (proxy._$totalSummaryRowContainer)
                height -= proxy._$totalSummaryRowContainer.height();
            width = Math.round(width - proxy._totalBorderWidth);
            var treeGridWidth, headerHeight, headerWidth, top, left;
            top = treeGridContent.ejScroller("option", "scrollTop");
            left = treeGridContent.ejScroller("option", "scrollLeft");
            var scrollerWidth = width;
            if (this._frozenColumnsLength > 0) {
                proxy._$gridContent.css("width", width);
                proxy._$gridContent.css("height", height - $(treeGridHeader).outerHeight() - treegridToolbar.outerHeight());
                scrollerWidth = width - this._getFrozenColumnWidth() - 1;//frozen div border width
            }
            proxy.getScrollElement().ejScroller({
                width: scrollerWidth,
                height: height - $(treeGridHeader).outerHeight() - treegridToolbar.outerHeight(),//for border-width of gridcontent
            });
            proxy._updateScrollCss();
            if ($(treeGridHeader).hasClass("e-scrollcss") && proxy.getScrollElement().children(".e-vscrollbar").length > 0) {
                $(treeGridHeader).width(width - 17);
            }
            else {
                $(treeGridHeader).width(width);
            }

            if (proxy._$totalSummaryRowContainer) {
                if (proxy._$totalSummaryRowContainer.height() >= 90 && proxy._$totalSummaryRowContainer.hasClass("e-scroller"))
                    proxy._$totalSummaryRowContainer.ejScroller("refresh");
                else if ($(totalSummaryRowContent).hasClass("e-scrollcss") && proxy.getScrollElement().children(".e-vscrollbar").length > 0 )
                    $(totalSummaryRowContent).width(width - 17);
                else 
                    $(totalSummaryRowContent).width(width);
            }
            if (model.toolbarSettings.showToolbar && treegridToolbar.length > 0) {
                treegridToolbar.width(width);
                treegridToolbar.children(".e-ul:first-child").width(width);
            }

            proxy.getScrollElement().ejScroller("refresh");
            proxy.updateViewPortHeight();

            if(model.showTotalSummary)
                proxy._viewPortHeight = proxy._viewPortHeight - proxy._$totalSummaryRowContainer.height();
            proxy.getScrollElement().ejScroller("option", "scrollTop",top);
            proxy.getScrollElement().ejScroller("option", "scrollLeft", left);
            proxy._updateHeaderScrollLeft();
            if (model.enableVirtualization) {
                proxy.cancelRowEditCell(); // To hide or destroy popup menu
                var tempArgs = {},
                    rowHeight = model.rowHeight;
                tempArgs.requestType = ej.TreeGrid.Actions.Refresh;
                proxy.processBindings(tempArgs);                
                proxy.sendDataRenderingRequest(tempArgs);
                /* check detail template and its row height */
                if (model.showDetailsRow && model.detailsTemplate && !model.showDetailsRowInfoColumn)
                {
                    rowHeight += model.detailsRowHeight;
                }
                
                if ((model.currentViewData.length * rowHeight) < proxy._viewPortHeight) {

                    var currentPosition = top - (proxy._viewPortHeight - model.currentViewData.length * rowHeight);
                    if (currentPosition < 0)
                        currentPosition = 0;
                    proxy.getScrollElement().ejScroller("scrollY",currentPosition, true);
                }
            }
            if (model.allowPaging)
                proxy.element.find(".e-pager").css({ "width": proxy._$gridContent.width() });
            proxy._resizeFilteringElements();
            
        },

        //PROCESSBINDING
        processBindings: function (args) {

            var proxy = this,
                model = proxy.model;

            model.query = new ej.Query();

            if (!proxy._isEmptyRow && proxy._trigger("actionBegin", args)) {
                if (args.requestType == "filtering") 
                    $("#" + proxy._id + "_" + args.currentFilteringColumn + "_filterbarcell").val("");               
                return true;
            }

            proxy._ensureDataSource(args);

        },
        //updated the treegrid record collection after record update in Gantt
        setUpdatedRecords: function (flatRecords, updatedRecords, ids, parentRecords, dataSource) {
            var model = this.model;
            model.flatRecords = flatRecords;
            model.updatedRecords = updatedRecords;
            model.ids = ids;
            model.parentRecords = parentRecords;
            this.dataSource(dataSource);
        },
        //In virtualization get expaned records from total record collection only
        getExpandedRecords: function (records) {
            var proxy = this;
            var resultRecord = records.filter(function (record) {
                return proxy.getExpandStatus(record) == true;
            });
            return resultRecord;
        },

        //update the expandStatus of all child records in non-virtualization mode
        updateExpandStatus:function(record , expanded)
        {
            var proxy = this,
                childRecords = record.childRecords;
                for (var count = 0; count < childRecords.length; count++) {
                    childRecords[count].isExpanded = expanded;
                    if (childRecords[count].hasChildRecords && childRecords[count].expanded) {
                        proxy.updateExpandStatus(childRecords[count], expanded);
                    }
                }
        },
        //Expand collapse, sort, delete, filter search the record collections
        _ensureDataSource: function (args) {

            var proxy = this,
                model = proxy.model,
                sortcolumns = model.sortSettings.sortedColumns,
                filteredColumns = model.filterSettings.filteredColumns,
                isupdatedHeight = false,
                index,
                dataSource =this.dataSource(),
                childIndex;
                proxy._filteredRecords = [];

            model.query.requiresCount();
            proxy._queryManagar = model.query;

            if ($.type(dataSource) !== "array" && !(dataSource instanceof ej.DataManager)) {
                this.dataSource([]);
                dataSource = this.dataSource();
            }

            //Expand Collapse Opearation
            if (args && args.requestType === ej.TreeGrid.Actions.ExpandCollapse) {

                isupdatedHeight = true;
                proxy._filteredRecords = [];
                args.data.expanded = args.expanded;

                proxy._filteredRecords = model.flatRecords.filter(function (record) {
                    return proxy.getExpandStatus(record) == true;
                });
                model.updatedRecords = proxy._filteredRecords;
            }

            //Delete selected record
            if (args && (model.editSettings.allowDeleting || args.isDragAndDropDelete) && args.requestType === ej.TreeGrid.Actions.Delete) {

                var deletedRow = args.data,
                    recordIndex,
                    rowindex;
                recordIndex = model.flatRecords.indexOf(deletedRow);
                if (deletedRow.parentItem) {

                    var childRecords = deletedRow.parentItem.childRecords;
                    childIndex = childRecords.indexOf(deletedRow);

                    deletedRow.parentItem.childRecords.splice(childIndex, 1);
                    //Delete the summary row of one parent after deleted the all child records of the parent
                    if (model.showSummaryRow) {
                        var summaryRowLength = model.summaryRows.length;
                        if (summaryRowLength == childRecords.length) {
                            deletedRow.parentItem.childRecords.splice(0, summaryRowLength);
                            model.flatRecords.splice(recordIndex, summaryRowLength);
                        }
                    }
                    if (!model.parentIdMapping)
                        deletedRow.parentItem.item[model.childMapping].splice(childIndex, 1);
                }
                //Delete from parent collection if item is parent
                var parentIndex=model.parentRecords.indexOf(deletedRow);
                if (parentIndex!== -1)
                {
                    model.parentRecords.splice(parentIndex, 1);
                }
                if (recordIndex !== -1) {
                    var deletedRecordCount = proxy.getChildCount(deletedRow, 0);
                    model.flatRecords.splice(recordIndex, deletedRecordCount + 1);
                    model.ids && model.ids.splice(recordIndex, deletedRecordCount + 1);
                }

                model.updatedRecords = model.enableVirtualization ? proxy.getExpandedRecords(model.flatRecords) : model.flatRecords.slice();
                proxy.updateCollapsedRecordCount();
                proxy.updateHeight();
                isupdatedHeight = true;
               
                
                if(!model.parentIdMapping)
                {
                    if (dataSource instanceof ej.DataManager) {
                        if (dataSource.dataSource.offline && dataSource.dataSource.json) {
                            rowindex = dataSource.dataSource.json.indexOf(deletedRow.item);
                            if (rowindex !== -1)
                                dataSource.dataSource.json.splice(rowindex, 1);
                        }
                        else if (proxy._isDataManagerUpdate) {
                            rowindex = proxy._jsonData.indexOf(deletedRow.item);
                            proxy._jsonData.splice(rowindex, 1);
                        }
                    } else {
                        rowindex = dataSource.indexOf(deletedRow.item);
                        if (rowindex !== -1)
                            dataSource.splice(rowindex, 1);
                    }
                }
                else
                {
                    //remove child item
                    if (deletedRow.hasChildRecords && deletedRow.childRecords.length > 0)
                    {
                        proxy._removeChildItem(deletedRow);
                    }
                    //remove deleting item

                    if (dataSource instanceof ej.DataManager) {
                        if (dataSource.dataSource.offline && dataSource.dataSource.json) {
                            var idx = dataSource.dataSource.json.indexOf(deletedRow.item);
                            if (idx !== -1)
                                dataSource.dataSource.json.splice(idx, 1);
                        }
                        else if (proxy._isDataManagerUpdate) {
                            var idx = proxy._jsonData.indexOf(deletedRow.item);
                            if (idx !== -1)
                                proxy._jsonData.splice(idx, 1);
                        }
                    }
                    else
                    {
                        var idx = dataSource.indexOf(deletedRow.item);
                        if (idx !== -1)
                            dataSource.splice(idx, 1);
                    }
                }
                model.selectedItem = null;
                this.selectedRowIndex(-1);
                if (!model.isFromGantt && deletedRow.parentItem)
                    if (deletedRow.parentItem.childRecords.length == 0) {
                        deletedRow.parentItem.expanded = false;
                        deletedRow.parentItem.hasChildRecords = false;
                    }
                //Update the summary and total summary row after deleted a record.
                if (model.showSummaryRow)
                    proxy._updateSummaryRow(args);
                if (model.showTotalSummary)
                    proxy._updateTotalSummaryRow(args);
            }

            // Condition for filtering columns.
            if ((args && args.requestType == "filtering") || (model.allowFiltering && !model.isFromGantt && filteredColumns.length)) {
                //Removed the summary rows before filtering the datasource.
                if (model.showSummaryRow) {
                    model.updatedRecords = $(model.updatedRecords).not(model.summaryRowRecords).get();
                    model.flatRecords = $(model.flatRecords).not(model.summaryRowRecords).get();
                }
                if ((model.allowFiltering && !model.isFromGantt &&filteredColumns.length)) {
                    var predicate, firstFilterCondition =filteredColumns[0];
                    // Condition to collect the details of filtering column.
                    if (firstFilterCondition.value == proxy._dropDownListBlanksText) {
                        predicate = ej.Predicate(firstFilterCondition.field, "equal", null);
                        predicate = predicate["or"](firstFilterCondition.field, "equal", "");
                    }
                    else if (!firstFilterCondition.isComplex)
                        predicate = ej.Predicate(firstFilterCondition.field, firstFilterCondition.operator, firstFilterCondition.value, !firstFilterCondition.matchcase);
                    else
                        predicate = firstFilterCondition;
                    for (var i = 1; i <filteredColumns.length; i++) {
                        //Loop to gather all the column condition as array.
                        if (!filteredColumns[i].isComplex)
                            predicate = predicate[filteredColumns[i].predicate](filteredColumns[i].field,filteredColumns[i].operator,filteredColumns[i].value, !filteredColumns[i].matchcase);
                        else
                            predicate = predicate["and"](filteredColumns[i]);
                    }
                    proxy._queryManagar.where(predicate);
                    proxy._filteredRecords = model.flatRecords.slice();
                    var dataManager = new ej.DataManager(proxy._filteredRecords);
                    proxy._tempfilteredrecords = dataManager.executeLocal(proxy._queryManagar).result;
                    proxy._updateFilteredRecords(proxy._tempfilteredrecords);
                    model.updatedRecords = proxy._filteredRecords;
                    if (model.allowPaging && model.pageSettings.pageSizeMode === ej.TreeGrid.PageSizeMode.Root)
                        model.parentRecords = proxy._getParentRecords(model.updatedRecords, proxy, true);
                    if (model.allowSorting && model.sortSettings.sortedColumns.length > 0) {
                        proxy._sortingRecords();
                    }
                } else {
                    model.updatedRecords = model.enableVirtualization ? proxy.getExpandedRecords(model.flatRecords) : model.flatRecords.slice();
                    proxy._updateHasFilteredChildRecordsStatus(model.updatedRecords);
                    if (model.allowPaging && model.pageSettings.pageSizeMode === ej.TreeGrid.PageSizeMode.Root)
                        model.parentRecords = proxy._getParentRecords(model.updatedRecords, proxy, true);
                }

                if (model.showSummaryRow)
                    proxy._createSummaryRow(args);
                if (model.showTotalSummary)
                    proxy._updateTotalSummaryRow(args);

                proxy.updateCollapsedRecordCount();
                proxy.updateHeight();
                isupdatedHeight = true;
                if (model.enableAltRow) {
                    proxy.updateAltRow();
                }
            }

            if ((model.allowSearching && proxy._searchString.length) || (args && args.requestType==="searching")) {

                proxy._queryManagar.search(proxy._searchString, proxy.getColumnFieldNames(),
                    ej.FilterOperators.contains, true);

                proxy._filteredRecords = model.flatRecords.filter(function (record) {
                    return record.hasChildRecords === false;
                });

                var dataManager = new ej.DataManager(proxy._filteredRecords);
                proxy._tempfilteredrecords = dataManager.executeLocal(proxy._queryManagar).result;
                proxy._updateFilteredRecords(proxy._tempfilteredrecords);
                model.updatedRecords = proxy._filteredRecords;

                if (model.allowSorting && model.sortSettings.sortedColumns.length > 0) {
                    proxy._sortingRecords();
                }
                proxy.updateCollapsedRecordCount();
                proxy.updateHeight();
                isupdatedHeight = true;

                if (model.enableAltRow) {

                    proxy.updateAltRow();
                }

                proxy.clearSelection();

            }
            else if (model.allowSorting && sortcolumns.length > 0 || (args && args.requestType == "sorting")) {
                
                proxy._sortingRecords();
                if (model.showSummaryRow)
                    proxy._createSummaryRow(args);
                if (!isupdatedHeight)
                {
                    proxy.updateCollapsedRecordCount();
                    proxy.updateHeight();
                    isupdatedHeight = true;
                }
            }

            if (args && (args.requestType === "outdent" || args.requestType === "indent")) {
                args = {};
                args.requestType = ej.TreeGrid.Actions.Refresh;
                isupdatedHeight = true;
            }

            if (!isupdatedHeight) {
                proxy._zerothLevelParentRecords = model.parentRecords.slice();
                model.updatedRecords = model.enableVirtualization ? ((model.enableCollapseAll && !args) ? proxy._zerothLevelParentRecords : proxy.getExpandedRecords(model.flatRecords)) : model.flatRecords.slice();
                proxy.updateCollapsedRecordCount();
                proxy.updateHeight();
            }

            if (!args) {
                args = {};
                if (model.allowPaging)
                    args.requestType = ej.TreeGrid.Actions.Paging;
                else
                    args.requestType = ej.TreeGrid.Actions.Refresh;
                args.inital = true;
            }
            if (model.allowPaging && args.requestType == "delete") {
                var arg = {};
                arg.totalRecordsCount = proxy.getExpandedRecords(model.flatRecords).length;
                //proxy.getPager().ejPager("option", arg).ejPager("refreshPager");
                proxy.getPager().ejPager("option",arg).ejPager("refreshPager");                
                var pagerModel = pagerModel = this.getPager().ejPager("model");
                if (proxy._currentPage() > pagerModel.totalPages)
                    proxy._currentPage(pagerModel.totalPages);
            }

            proxy._updateCurrentViewData();

            if ((!model.isFromGantt && args.requestType === "save") || args.requestType === "sorting" || args.requestType === "searching"
                || args.requestType === "delete" || args.requestType === "refreshDataSource" || args.requestType === "filtering"
                || args.requestType === "dragAndDrop" || ( !args.inital && args.requestType === "paging")) {
				    proxy._isRefreshAddedRecord = false; /* flag new added record is sorted or filtered in treegrid */
                proxy.renderRecords(args);
                proxy._setScrollTop();
                proxy.getScrollElement().ejScroller("refresh");
                proxy._updateScrollCss();
            }
        },
        //remove child record in data source on self reference
        _removeChildItem: function (record) {
            var currentRecord, proxy = this;
            for (var i = 0; i < record.childRecords.length; i++) {
                currentRecord = record.childRecords[i];
                if (this.dataSource() instanceof ej.DataManager) {
                    if (this.dataSource().dataSource.offline && this.dataSource().dataSource.json) {
                        var idx = this.dataSource().dataSource.json.indexOf(currentRecord.item);
                        if(idx!==-1)
                            this.dataSource().dataSource.json.splice(idx, 1);

                        if (currentRecord.hasChildRecords) {
                            proxy._removeChildItem(currentRecord);
                        }
                    }
                    else if (proxy._isDataManagerUpdate) {
                        var idx = proxy._jsonData.indexOf(currentRecord.item);
                        if (idx !== -1)
                            proxy._jsonData.splice(idx, 1);
                        if (currentRecord.hasChildRecords) {
                            proxy._removeChildItem(currentRecord);
                        }
                    }
                } else {
                    var idx = this.dataSource().indexOf(currentRecord.item);
                    if (idx !== -1)
                        this.dataSource().splice(idx, 1);

                    if (currentRecord.hasChildRecords) {
                        proxy._removeChildItem(currentRecord);
                    }
                }
            }
        },

        //CHECK EDITING OPTIONS 
        _processEditing:function(){

            var proxy = this,
                model = proxy.model;

            if (model.editSettings.allowEditing || model.editSettings.allowAdding) {
                if (model.editSettings.editMode.toLowerCase() === "cellediting" || model.editSettings.editMode.toLowerCase() === "rowediting" || (model.editSettings.editMode.toLowerCase() === "normal" && model.selectionMode.toLowerCase() === "cell")) {
                    proxy._addCellEditTemplate();
                }
            }

        },

        _toolBarClick: function (sender) {

            //Skip the mouse right click and mouse wheel
            if ((sender.event.which && (sender.event.which == 3 || sender.event.which == 2)) ||
                     (sender.event.button && sender.event.button == 2))
                return false;

            var proxy = this,
               model = proxy.model,
               $gridEle = $(this.itemsContainer).closest(".e-treegrid"),
               gridInstance = $gridEle.ejTreeGrid("instance"),
               gridId = $gridEle.attr('id'),
                toolbarObj = $("#" + gridInstance._id + "_toolbarItems");
            
            if (sender.event == undefined && sender.target.tagName == "INPUT" && sender.currentTarget.id == gridId + "_search")
                return false;

            if (gridInstance.model.dateFormat.toLowerCase().indexOf("hh") != -1)
                $.isFunction($.fn.ejDateTimePicker) && $("#" + gridId + "EditForm").find(".e-datepicker").ejDateTimePicker("hide");
            else
                $.isFunction($.fn.ejDatePicker) && $("#" + gridId + "EditForm").find(".e-datepicker").ejDatePicker("hide");
            var currentTarget = sender.currentTarget; var target = sender.target;
            var args = {
                itemName: currentTarget.title,
                currentTarget: currentTarget,
                model: gridInstance.model,
            };
            if ($gridEle.ejTreeGrid("instance")._trigger("toolbarClick", args))
                return false;
            $(toolbarObj).ejToolbar('deselectItem', sender.currentTarget);
            switch (sender.currentTarget.id) {

                case gridId + "_add":
                    gridInstance._toolbarOperation(gridId + "_add", sender);
                    break;

                case gridId + "_edit":
                    gridInstance._toolbarOperation(gridId + "_edit", sender);
                    break;

                case gridId + "_delete":
                    gridInstance._toolbarOperation(gridId + "_delete", sender);
                    break;

                case gridId + "_update":
                    gridInstance._toolbarOperation(gridId + "_update", sender);
                    break;

                case gridId + "_cancel":
                    gridInstance._toolbarOperation(gridId + "_cancel", sender);
                    break;

                case gridId + "_expandAll":
                    gridInstance._toolbarOperation(gridId + "_expandAll", sender);
                    break;

                case gridId + "_collapseAll":
                    gridInstance._toolbarOperation(gridId + "_collapseAll", sender);
                    break;
                case gridId + "_pdfExport":
                    gridInstance._toolbarOperation(gridId + "_pdfExport",sender);
                    break;
                case gridId + "_excelExport":
                    gridInstance._toolbarOperation(gridId + "_excelExport", sender);
                    break;
            }
            return false;
        },
        _toolbarOperation: function (operation, searchEle) {
            var $gridEle = this.element, gridObject = $gridEle.ejTreeGrid("instance"), gridId = $gridEle.attr('id'), proxy = this;
            var selectedrow = this.selectedItem();
            var parentEle = searchEle.target
            var index = this.selectedRowIndex();
            gridObject._exportTo = gridObject["export"];
            switch (operation) {

                case gridId + "_add":
                    if (proxy.model.selectionMode == "cell") {
                        proxy.model.editSettings.rowPosition = "top";
                    }
                    proxy._startAdd(parentEle,null);
                    break;
                    
                case gridId + "_edit":
                    proxy.updateScrollBar();
                    proxy._editRow(index);
                    break;

                case gridId + "_delete":
                    proxy.deleteRow();
                    proxy._cancelSaveTools();
                    proxy._isRefreshAddedRecord = false;/* flag new added record is sorted or filtered in treegrid */
                    break;

                case gridId + "_update":
                    editMode = proxy.model.editSettings.editMode;
                    if (editMode.toLowerCase() == "cellediting") {
                        if (proxy._isRowEdit)
                            proxy._saveRow();
                        else proxy.saveCell();
                    }
                    else if (editMode.toLowerCase() == "rowediting")
                        proxy._saveRow();
                    proxy._clearContextMenu();
                    this._removeDetailsRow();
                    proxy._focusTreeGridElement();

                    break;

                case gridId + "_cancel":
                    var editMode = proxy.model.editSettings.editMode;
                    if (editMode.toLowerCase() == "cellediting") {
                        if (proxy._isRowEdit)
                            proxy.cancelRowEditCell();
                        else proxy.cancelEditCell();
                    }
                    else if (editMode.toLowerCase() == "rowediting")
                        proxy.cancelRowEditCell();
                    proxy._cancelSaveTools();
                    proxy._clearContextMenu();
                    this._removeDetailsRow();
                    break;

                case gridId + "_expandAll":
                    proxy._expandAll();
                    break;

                case gridId + "_collapseAll":
                    proxy.collapseAll();
                    break;
                case gridId + "_pdfExport":
                    gridObject._exportTo(gridObject.model.exportToPdfAction, 'pdfExporting', gridObject.model.allowMultipleExporting);
                    break;
                case gridId + "_excelExport":
                    gridObject._exportTo(gridObject.model.exportToExcelAction, 'excelExporting', gridObject.model.allowMultipleExporting);
                    break;
            }
            proxy._refreshToolBar();
            return false;
        },
		 // Perform Tree grid context menu operations.
        _contextMenuOperations:function(option){
            var proxy = this,
                model = proxy.model,
                index = proxy._contextMenuSelectedIndex,
                e = proxy._contextMenuEvent,
                item = proxy._contextMenuSelectedItem;
            switch (option)
            {
                case "Delete":
                    proxy.deleteRow(null,true);
                    proxy._cancelSaveTools();
                    proxy._clearContextMenu();
                    break;
                case "Above":
                    proxy._subContextMenuAction(item, index, "Above");
                    proxy._focusTreeGridElement();
                    break;
                case "Below":
                    proxy._subContextMenuAction(item, index, "Below");
                    proxy._focusTreeGridElement();
                    break;
                case "Add":
                    proxy._setInitialData();
                    proxy._clearContextMenu();
                    break;
                case "Edit":
                    if (model.editSettings.editMode.toLowerCase() == "cellediting") {
                        var column = model.columns[proxy.getCellIndex(e)];
                        if (!ej.isNullOrUndefined(column) && column.allowEditing != false) {
                            proxy._focusTreeGridElement();
                            proxy._cellEditingDetails.columnIndex = proxy.getCellIndex(e);
                            proxy._editedRowIndex = proxy._cellEditingDetails.rowIndex = proxy.getRowIndex(e);
                            fieldName = proxy._cellEditingDetails.columnIndex >= 0 && column.field;
                            if (fieldName) {
                                model.editSettings.allowEditing &&
                                    model.editSettings.editMode == ej.TreeGrid.EditMode.CellEditing &&
                                    proxy.cellEdit(proxy._cellEditingDetails.rowIndex, fieldName);
                                proxy._editAddTools();
                            }
                        }
                    }
                    else if (model.editSettings.editMode.toLowerCase() == "rowediting")
                        proxy._editRow(index);
                    proxy._clearContextMenu();
                    break;
                case "Save":
                    if (model.editSettings.editMode.toLowerCase() == "cellediting") {
                        if (proxy._isRowEdit)
                            proxy._endEdit();
                        else proxy.saveCell();
                    }
                    else if (model.editSettings.editMode.toLowerCase() == "rowediting")
                        proxy._saveRow();
                    proxy._clearContextMenu();
                    proxy._focusTreeGridElement();
                    break;
                case "Cancel":
                    var editMode = proxy.model.editSettings.editMode;
                    if (editMode.toLowerCase() == "cellediting") {
                        if (proxy._isRowEdit)
                            proxy.cancelRowEditCell();
                        else if (model.isEdit) proxy.cancelEditCell();
                    }
                    else if (editMode.toLowerCase() == "rowediting")
                        proxy.cancelRowEditCell();
                    proxy._clearContextMenu();
                    proxy._focusTreeGridElement();
                    break;
                default:
                    var eventArgs = {};
                    eventArgs.data = item;
                    eventArgs.menuId = option;
                    proxy._triggerMenuEventHandler(option, eventArgs);
                    proxy._clearContextMenu();
                    break;
            }
            if (model.enableAltRow && model.currentViewData[0])
                ej.TreeGrid.updateAltRow(proxy, model.currentViewData[0], 0, 0);            
        },
        //Change the text based on culture information.
        _setCultureInfo: function () {
            var proxy = this,
              model = proxy.model,
              culture = model.locale,
              localization = proxy.localizedLabel, 
              defaultLocalization = ej.TreeGrid.Locale["default"];
            if (!model.predecessorTable)
                localization = ej.TreeGrid.Locale[culture];
            else
                localization = ej.Gantt.Locale[culture];
            //Tooltip Text to be displayed in the Toolbar
            proxy._toolboxTooltipTexts = (localization && localization["toolboxTooltipTexts"])?
                localization["toolboxTooltipTexts"] : defaultLocalization["toolboxTooltipTexts"];

            //Context Menu Text
            proxy._contextMenuTexts = (localization && localization["contextMenuTexts"]) ?
                localization["contextMenuTexts"] : defaultLocalization["contextMenuTexts"];

            if (proxy.model.isFromGantt) {
                proxy._columnMenuTexts = proxy.model.columnMenuTexts;
                proxy._deleteColumnText = proxy.model.deleteColumnText;
                proxy._okButtonText = proxy.model.okButtonText;
                proxy._cancelButtonText = proxy.model.cancelButtonText;
                proxy._columnDialogTexts = proxy.model.columnDialogTexts;
                proxy._columnDialogTitle = proxy.model.columnDialogTitle;
                proxy._confirmDeleteText = proxy.model.confirmDeleteText
            }
            else {
                //Column Menu Text
                proxy._columnMenuTexts = (localization && localization["columnMenuTexts"]) ?
                    localization["columnMenuTexts"] : defaultLocalization["columnMenuTexts"];
                
                //Add Column Dialog Text to be displayed in popup window
                proxy._columnDialogTexts = (localization && localization["columnDialogTexts"]) ?
                    localization["columnDialogTexts"] : defaultLocalization["columnDialogTexts"];

                //Add Column Dialog Titles
                proxy._columnDialogTitle = (localization && localization["columnDialogTitle"]) ?
                    localization["columnDialogTitle"] : defaultLocalization["columnDialogTitle"];

                //Deleting the column texts 
                proxy._deleteColumnText = (localization && localization["deleteColumnText"]) ?
                    localization["deleteColumnText"] : defaultLocalization["deleteColumnText"];
                proxy._okButtonText = (localization && localization["okButtonText"]) ?
                    localization["okButtonText"] : defaultLocalization["okButtonText"];
                proxy._cancelButtonText = (localization && localization["cancelButtonText"]) ?
                    localization["cancelButtonText"] : defaultLocalization["cancelButtonText"];
                proxy._confirmDeleteText = (localization && localization["confirmDeleteText"]) ?
                    localization["confirmDeleteText"] : defaultLocalization["confirmDeleteText"];

                //String to be displayed in drop down list for filtering blank items
                proxy._dropDownListBlanksText = (localization && localization["dropDownListBlanksText"]) ?
                    localization["dropDownListBlanksText"] : defaultLocalization["dropDownListBlanksText"];

                //String to be displayed in drop down list to clear filtered items
                proxy._dropDownListClearText = (localization && localization["dropDownListClearText"]) ?
                    localization["dropDownListClearText"] : defaultLocalization["dropDownListClearText"];

                //Text to be displayed in drop down list for TRUE value in boolean edit type column
                proxy._trueText = (localization && localization["trueText"]) ?
                    localization["trueText"] : defaultLocalization["trueText"];

                //Text to be displayed in drop down list for FALSE value in boolean edit type column
                proxy._falseText = (localization && localization["falseText"]) ?
                    localization["falseText"] : defaultLocalization["falseText"];

                //EmptyRecord text to be displayed with dataSource is null
                proxy.model.emptyRecordText = (localization && localization["emptyRecord"]) ?
                    localization["emptyRecord"] : defaultLocalization["emptyRecord"];
            }
        },

        //Create the instances for newly added row.
        _createNewRowInstance: function (obj) {
            var keys = [];
            for (var key in obj) {
                keys.push(key);
            }
            return keys;
        },
		
        //Public method to pass a datasource from customer side.

        //REFRESH THE TREEGRIDCONTENT
        

        refresh:function(datasource, query){
            var proxy = this, model = proxy.model;
            if (!ej.isNullOrUndefined(datasource)) {
                proxy.resetModelCollections();
                model.dataSource = datasource;
                model.query = query;
                proxy.element.ejTreeGrid("destroy").ejTreeGrid(model);
            }
            else {
                var args = {};
                args.requestType = ej.TreeGrid.Actions.Refresh;
                this.sendDataRenderingRequest(args);
            }
        },		
        /* get index for new record */
        _getNewIndex: function () {
            var proxy = this;
            proxy._maxRowIndex += 1;
            return (proxy._maxRowIndex);            
        },
        //Add new record in treeGrid control
        _addRecord: function (data, rowPosition, isEdit) {
            var proxy = this;

            /*Cancel if treegrid is in edit*/
            if (proxy.model.isEdit || proxy._isRowEdit) {
                proxy.cancelRowEditCell();
            }

            var model = this.model,
                selectedRowIndex = this.selectedRowIndex(),
                //selectedCellIndexes = this.selectedCellIndexes(),
                _cAddedRecord,
                updatedRecords = model.updatedRecords,
                flatRecords = model.flatRecords,
                parentRecords = model.parentRecords,
                selectedItem = model.selectionMode == "row" ? this.selectedItem() : updatedRecords[proxy._rowIndexOfLastSelectedCell],
                columns = model.columns,
                dataSource = this.dataSource(),
                level = 0, insertIndex, validateArgs = {}, currentPageRowIndex = -1,
                isRecordAdded = false,
                isToolbarAdd = false,
                newIndex = this._getNewIndex(),
                parentItem, nextBelowItemInflatRecords, nextBelowItemInUpdatedRecords,
                isParentItemAdd = false;

            if ($.type(dataSource) !== "array" && !(dataSource instanceof ej.DataManager)) {
                this.dataSource([]);
                dataSource = this.dataSource();
            }

            if (model.idMapping && model.parentIdMapping && !ej.isNullOrUndefined(data[proxy.model.parentIdMapping])) {
                var parentRec  = model.flatRecords.filter(function (item) {
                    return item[model.idMapping] == data[model.parentIdMapping];
                });
                if (parentRec.length > 0) {
                    selectedItem = parentRec[0];
                    rowPosition = ej.TreeGrid.RowPosition.Child;
                    isParentItemAdd = true;
                }
            }

            if ((selectedRowIndex === -1 && proxy._rowIndexOfLastSelectedCell == -1) && (rowPosition === ej.TreeGrid.RowPosition.Above
                 || rowPosition === ej.TreeGrid.RowPosition.Below
                 || rowPosition === ej.TreeGrid.RowPosition.Child) || !rowPosition || model.selectedItems.length > 1) {
                if (!isParentItemAdd)
                    rowPosition = ej.TreeGrid.RowPosition.Top;
            }

            if (ej.isNullOrUndefined(data)) {
                var data = {};
                for (var count = 0; count < columns.length; count++) {
                    data[columns[count].field] = "";
                }
                isToolbarAdd = true;
            }
            if (data[model.childMapping] && data[model.childMapping].length)
                delete data[model.childMapping]; // Remove the child items for externally adding row

            //Clear previously selected Item
            //proxy.clearSelection()
              proxy.selectRows(-1);

            switch (rowPosition) {
                case ej.TreeGrid.RowPosition.Top:
                    level = 0;
                    parentItem = null;
                    _cAddedRecord = proxy._createRecord(data, level);
                    _cAddedRecord.index = newIndex;

                    if (model.idMapping && model.parentIdMapping && !proxy._isPublicAdd) {
                        _cAddedRecord[model.idMapping] = newIndex;
                        _cAddedRecord.item[model.idMapping] = newIndex;
                    }
                    /*record update*/
                    flatRecords.splice(0, 0, _cAddedRecord);
                    updatedRecords.splice(0, 0, _cAddedRecord);
                    parentRecords.splice(0, 0, _cAddedRecord);

                    /*data source update*/
                    if (proxy._isDataManagerUpdate) {
                        proxy._jsonData.splice(0, 0, _cAddedRecord.item);
                    } else {
                        dataSource.splice(0, 0, _cAddedRecord.item);
                    }
                    insertIndex = 0;
                    break;

                case ej.TreeGrid.RowPosition.Bottom:
                    level = 0;
                    parentItem = null;
                    _cAddedRecord = proxy._createRecord(data, level);
                    _cAddedRecord.index = newIndex;
                    if (model.idMapping && model.parentIdMapping && !proxy._isPublicAdd) {
                        _cAddedRecord[model.idMapping] = newIndex;
                        _cAddedRecord.item[model.idMapping] = newIndex;
                    }
                    /*record update*/
                    flatRecords.push(_cAddedRecord);
                    updatedRecords.push(_cAddedRecord);
                    //ids.push(newIndex);
                    parentRecords.push(_cAddedRecord);
                    /*data source update*/
                    if (proxy._isDataManagerUpdate) {
                        proxy._jsonData.push(_cAddedRecord.item);
                    } else {
                        dataSource.push(_cAddedRecord.item);
                    }
                    insertIndex = updatedRecords.indexOf(_cAddedRecord);
                    break;

                case ej.TreeGrid.RowPosition.Above:
                    level = selectedItem.level;
                    parentItem = selectedItem.parentItem;
                    _cAddedRecord = proxy._createRecord(data, level, parentItem);
                    _cAddedRecord.index = newIndex;
                    if (model.idMapping && model.parentIdMapping && !proxy._isPublicAdd) {
                        _cAddedRecord[model.idMapping] = newIndex;
                        _cAddedRecord.item[model.idMapping] = newIndex;
                    }

                    var childIndex, recordIndex, updatedCollectionIndex;
                    /*Record Updates*/
                    recordIndex = flatRecords.indexOf(selectedItem);
                    updatedCollectionIndex = updatedRecords.indexOf(selectedItem);
                    flatRecords.splice(recordIndex, 0, _cAddedRecord);
                    updatedRecords.splice(updatedCollectionIndex, 0, _cAddedRecord);
                    //ids.splice(recordIndex, 0, newIndex);

                    if (!ej.isNullOrUndefined(parentItem)) {
                        childIndex = parentItem.childRecords.indexOf(selectedItem);
                        /*Child collection update*/
                        parentItem.childRecords.splice(childIndex, 0, _cAddedRecord);
                        if (!model.parentIdMapping) {
                            parentItem.item[model.childMapping].splice(childIndex, 0, _cAddedRecord.item);
                        }
                        else {
                            _cAddedRecord.item[model.parentIdMapping] = _cAddedRecord.parentItem.item[model.idMapping];
                            _cAddedRecord[model.parentIdMapping] = _cAddedRecord.parentItem.item[model.idMapping];
                            if (proxy._isDataManagerUpdate) {
                                proxy._jsonData.push(_cAddedRecord.item);

                            } else {
                                dataSource.push(_cAddedRecord.item);
                            }
                        }
                    } else {
                        /* Parent records collection and data source update*/
                        parentRecords.splice(parentRecords.indexOf(selectedItem), 0, _cAddedRecord);
                        if (proxy._isDataManagerUpdate) {
                            proxy._jsonData.splice(proxy._jsonData.indexOf(selectedItem.item), 0, _cAddedRecord.item);
                        }
                        else {
                            dataSource.splice(dataSource.indexOf(selectedItem.item), 0, _cAddedRecord.item);
                        }
                    }
                    insertIndex = updatedCollectionIndex;
                    break;
                case ej.TreeGrid.RowPosition.Below:
                    level = selectedItem.level;
                    parentItem = selectedItem.parentItem;
                    _cAddedRecord = proxy._createRecord(data, level, parentItem);
                    _cAddedRecord.index = newIndex;
                    if (model.idMapping && model.parentIdMapping && !proxy._isPublicAdd) {
                        _cAddedRecord[model.idMapping] = newIndex;
                        _cAddedRecord.item[model.idMapping] = newIndex;
                    }
                    //find next item position
                    var currentItemIndex = flatRecords.indexOf(selectedItem)

                    if (selectedItem.hasChildRecords) {
                        dataChildCount = proxy.getChildCount(selectedItem, 0);
                        recordIndex = currentItemIndex + dataChildCount + 1;
                        updatedCollectionIndex = updatedRecords.indexOf(selectedItem) + proxy._getVisibleChildRecordCount(selectedItem, 0, updatedRecords) + 1;

                    } else {
                        recordIndex = currentItemIndex + 1;
                        updatedCollectionIndex = updatedRecords.indexOf(selectedItem) + 1;
                    }

                    /* Record collection update */
                    flatRecords.splice(recordIndex, 0, _cAddedRecord);
                    updatedRecords.splice(updatedCollectionIndex, 0, _cAddedRecord);
                    //ids.splice(recordIndex, 0, newIndex);

                    /* data Source update */
                    if (!ej.isNullOrUndefined(parentItem)) {
                        childIndex = parentItem.childRecords.indexOf(selectedItem);
                        /*Child collection update*/
                        parentItem.childRecords.splice(childIndex + 1, 0, _cAddedRecord);
                        if (!model.parentIdMapping) {
                            parentItem.item[model.childMapping].splice(childIndex + 1, 0, _cAddedRecord.item);
                        }
                        else {
                            _cAddedRecord.item[model.parentIdMapping] = _cAddedRecord.parentItem.item[model.idMapping];
                            _cAddedRecord[model.parentIdMapping] = _cAddedRecord.parentItem.item[model.idMapping];
                            if (proxy._isDataManagerUpdate) {
                                proxy._jsonData.push(_cAddedRecord.item);

                            } else {
                                dataSource.push(_cAddedRecord.item);
                            }
                        }
                    } else {
                        /* Parent records collection and data source update*/
                        parentRecords.splice(parentRecords.indexOf(selectedItem) + 1, 0, _cAddedRecord);
                        if (proxy._isDataManagerUpdate) {
                            proxy._jsonData.splice(proxy._jsonData.indexOf(selectedItem.item) + 1, 0, _cAddedRecord.item);
                        }
                        else {
                            dataSource.splice(dataSource.indexOf(selectedItem.item) + 1, 0, _cAddedRecord.item);
                        }
                    }
                    insertIndex = updatedCollectionIndex;
                    break;
                case ej.TreeGrid.RowPosition.Child:
                    level = selectedItem.level + 1;
                    parentItem = selectedItem;
                    _cAddedRecord = proxy._createRecord(data, level, parentItem);
                    _cAddedRecord.index = newIndex;
                    if (model.idMapping && model.parentIdMapping && !proxy._isPublicAdd) {
                        _cAddedRecord[model.idMapping] = newIndex;
                        _cAddedRecord.item[model.idMapping] = newIndex;
                    }
                    //find next item position
                    var currentItemIndex = flatRecords.indexOf(selectedItem)

                    if (selectedItem.hasChildRecords) {
                        dataChildCount = proxy.getChildCount(selectedItem, 0);
                        recordIndex = currentItemIndex + dataChildCount + 1;
                        //Expand Add record's parent item 
                        if (!selectedItem.expanded||!proxy.getExpandStatus(selectedItem)) {
                            var expanargs = {};                  
                            expanargs.expanded = true;
                            expanargs.data = selectedItem;
                            proxy._isInAdd = true;
                            /* refresh Added row on expand collapse */
                            if (proxy._isRefreshAddedRecord) {
                                expanargs.data.expanded = true;
                                proxy.updateExpandStatus(args.data, args.expanded);
                                proxy.refreshContent();
                                proxy._isRefreshAddedRecord = false;
                            } else {
                                proxy._expandRecord(selectedItem);
                            }
                            proxy._isInAdd = false;
                            updatedRecords = proxy.getUpdatedRecords();
                        }
                        updatedCollectionIndex = updatedRecords.indexOf(selectedItem) + proxy._getVisibleChildRecordCount(selectedItem, 0, updatedRecords) + 1 - model.summaryRows.length;

                    } else {
                        if(!proxy.getExpandStatus(selectedItem))
                            proxy._expandRecord(selectedItem.parentItem);
                        updatedRecords = proxy.getUpdatedRecords();
                        selectedItem.hasChildRecords = true;
                        selectedItem.childRecords = [];
                        selectedItem.expanded = true;
                        if (!model.parentIdMapping) {
                            selectedItem.item[model.childMapping] = [];
                        }
                        selectedItem.isMilestone = false;
                        recordIndex = currentItemIndex + 1;
                        updatedCollectionIndex = updatedRecords.indexOf(selectedItem) + 1;
                    }

                    /* Record collection update */
                    flatRecords.splice(recordIndex, 0, _cAddedRecord);
                    updatedRecords.splice(updatedCollectionIndex, 0, _cAddedRecord);
                    //ids.splice(recordIndex, 0, newIndex);

                    /* data Source update */
                    if (!ej.isNullOrUndefined(parentItem)) {
                        childIndex = parentItem.childRecords.indexOf(selectedItem);
                        /*Child collection update*/
                        parentItem.childRecords.splice(childIndex + 1, 0, _cAddedRecord);
                        if (!model.parentIdMapping) {
                            parentItem.item[model.childMapping].splice(childIndex + 1, 0, _cAddedRecord.item);
                        }
                        else {
                            _cAddedRecord.item[model.parentIdMapping] = _cAddedRecord.parentItem.item[model.idMapping];
                            _cAddedRecord[model.parentIdMapping] = _cAddedRecord.parentItem.item[model.idMapping];
                            if (proxy._isDataManagerUpdate) {
                                proxy._jsonData.push(_cAddedRecord.item);
                            } else {
                                dataSource.push(_cAddedRecord.item);
                            }
                        }
                    }
                    insertIndex = updatedCollectionIndex;
                    break;
            }
            if (model.allowPaging) {                
                //Goto next page if New record insertIndex exit than pagesize
                if (rowPosition == ej.TreeGrid.RowPosition.Below || rowPosition == ej.TreeGrid.RowPosition.Child) {
                    if ((model.pageSettings.pageSizeMode !== "root" || ej.isNullOrUndefined(selectedItem.parentItem))) {
                        var data = proxy._updatedPageData[proxy._updatedPageData.length - 1],
                            currentIndex = proxy._updatedPageData.length == model.pageSettings.pageSize ?
                            model.updatedRecords.indexOf(data) : insertIndex;
                        if (insertIndex > currentIndex) {
                            proxy._currentPage(this._currentPage() + 1);
                            currentPageRowIndex = 0;
                        }
                    }
                }
                    //Goto first page
                else if (rowPosition == ej.TreeGrid.RowPosition.Top && (proxy._currentPage() > 1 || proxy._currentPage() < 1)) {
                    proxy._currentPage(1);
                    currentPageRowIndex = 0;
                }
                    //Goto last page
                else if (rowPosition == ej.TreeGrid.RowPosition.Bottom && proxy._currentPage() < model.pageSettings.totalPages) {
                    proxy._currentPage(model.pageSettings.totalPages);
                    currentPageRowIndex = insertIndex;
                }
                
            }
            if (!isToolbarAdd && (ej.TreeGrid.RowPosition.Above || ej.TreeGrid.RowPosition.Below)) {
                var args = {},
                    currentValue = {},
                    columns = model.columns,
                    length = columns.length;
                if (!model.allowPaging)
                    currentPageRowIndex = insertIndex;                                                        
                args.rowIndex = insertIndex;
                args.requestType = "addNewRow";
                args.addedRow = data;

                if (!proxy._trigger("actionComplete", args)) {
                    proxy._renderAddedRow(insertIndex, _cAddedRecord);
                    if (model.showSummaryRow) {
                        if (args.requestType == "addNewRow" && rowPosition == "child") {
                            proxy._createAndRenderSummaryRecords(args);
                        }
                        proxy._updateSummaryRow(args);
                    }
                    if (model.showTotalSummary)
                        proxy._updateTotalSummaryRow(args);
                    isRecordAdded = true;
                }
                else {
                    updatedRecords.splice(insertIndex, 1);
                }
            }
            else {
                proxy._renderAddedRow(insertIndex, _cAddedRecord);
                isRecordAdded = true;
            }

            /*Set flag for refresh newly added record in non virtalization mode*/
            if (model.enableVirtualization === false &&
                (model.sortSettings.sortedColumns.length > 0 || model.filterSettings.filteredColumns.length > 0)) {
                proxy._isRefreshAddedRecord = true;
            }
            if (model.allowPaging)
                updatedRecords = proxy._updatedPageData;
            /* select add row */
            if (model.allowSelection && model.selectionMode == "row") {
                var currentRowIndex = isRecordAdded ? updatedRecords.indexOf(_cAddedRecord) : selectedRowIndex;
                if (!proxy._rowSelectingEventTrigger(this._previousIndex, currentRowIndex)) {
                    proxy.selectRows(currentRowIndex);
                    proxy._rowSelectedEventTrigger(currentRowIndex);
                }
            }
            if (model.selectionMode == "cell")
                proxy._rowIndexOfLastSelectedCell = updatedRecords.indexOf(_cAddedRecord);
            /* scroll to new added record */
            proxy.updateScrollBar();
           
            if (isEdit == "isEditRow") {
                proxy._editRow(updatedRecords.indexOf(_cAddedRecord), _cAddedRecord);
            }
            else {
                ej.TreeGrid.refreshRow(proxy, model.currentViewData.indexOf(_cAddedRecord));
                proxy._cancelSaveTools();
                if (model.enableAltRow)
                    ej.TreeGrid.updateAltRow(proxy, proxy.model.currentViewData[0], 0, 0);
            }
            //refresh parent item for expand collapse icons
            if (_cAddedRecord.parentItem && rowPosition == ej.TreeGrid.RowPosition.Child && (_cAddedRecord.parentItem.childRecords.length == 1 || !_cAddedRecord.parentItem.hasFilteredChildRecords)) {
                _cAddedRecord.parentItem.hasFilteredChildRecords = true;
                ej.TreeGrid.refreshRow(proxy, model.currentViewData.indexOf(_cAddedRecord.parentItem));
            }
        },

        //validate the taskId to avoid duplicate value
        _validateIdValue: function (dataID) {
            var proxy = this, model = proxy.model,
                matchedItem = [],
                fRecords = model.flatRecords;
            matchedItem = $.map(fRecords, function (record) {
                if (record[model.idMapping] == dataID)
                    return record;
            });
            if (matchedItem.length)
                return true;
            else return false;
        },         
         
        //Public method for adding new record
        addRow: function (data, rowPosition) {
            var proxy = this, model = proxy.model;
            /* Cancel edited cell before sort the column*/
            proxy._cancelEditState();

            if (!data) {
                proxy._addRecord(null, rowPosition, "isEditRow");
            } else {
                if (model.idMapping && model.parentIdMapping) {
                    if (data[model.idMapping] && !proxy._validateIdValue(data[model.idMapping])) {
                        proxy._isPublicAdd = true;
                        proxy._addRecord(data, rowPosition);
                        proxy._isPublicAdd = false;
                    }
                    else return false;
                }
                else proxy._addRecord(data, rowPosition);
            } 
        },

        _startAdd: function (parentEle, rowPos) {
            var proxy = this, model = this.model, rowPosition;
            proxy._addRecord(null, model.editSettings.rowPosition, "isEditRow");
        },
        _getRecordIndexByItem: function (item, collection) {
            var record = ej.DataManager(collection).executeLocal(ej.Query().where("item", ej.FilterOperators.equal, item));
            if (record.length > 0)
                return collection.indexOf(record[0]);
            else
                return -1;
        },
        /* update the reord's expand status in expanded state*/
        _expandRecord: function (record)
        {
            var parentItem = record, args = {};
            while (parentItem != null) {
                if (parentItem.expanded == false) {
                    args.expanded = true;
                    args.data = parentItem;
                    if (!parentItem.parentItem)
                        this._isInExpandCollapseAll = false;
                    else
                        this._isInExpandCollapseAll = true;
                    ej.TreeGrid.sendExpandCollapseRequest(this, args);
                }
                parentItem = parentItem.parentItem;
            }
        },

        /* Public method for scroll to the corresponding offset value */
        scrollOffset: function (left, top) {
            var scrollerObj = this._$gridContent.data("ejScroller"),
                model = this.model;
            if (model.isEdit)
                this.saveCell();
            else if (this._isRowEdit)
                this._saveRow();
            if ((typeof top == "number" || typeof parseInt(top) == "number")) {
                top = parseInt(top);
                if(top >= 0 && this.getMaxScrollHeight() > top)
                    scrollerObj.scrollY(top, true);
            }
            if (typeof left == "number" || typeof parseInt(left) == "number") {
                left = parseInt(left);
                if (left >= 0 && this.getMaxScrollWidth() > left)
                    scrollerObj.scrollX(left, true);
            } 
        },
        /* Public method for get scrollTop value*/
        getScrollTopOffset: function () {
            return this.getScrollElement().ejScroller("model.scrollTop");
        },
        /* Public method for get scrollLeft value*/
        getScrollLeftOffset: function () {
            return this.getScrollElement().ejScroller("model.scrollLeft");
        },
        /* Public method for scroll to first row of treegrid*/
        scrollToTop:function()
        {
            var model = this.model,
                updatedRecords, record, rowIndex = -1;
            if (model.isEdit)
                this.saveCell();
            else if (this._isRowEdit)
                this._saveRow();
            updatedRecords = this.getExpandedRecords(model.updatedRecords);
            if (updatedRecords.length > 0) {
                rowIndex = 0;
                record = updatedRecords[0];
                rowIndex = model.updatedRecords.indexOf(record);
                if (model.allowSelection && !this._rowSelectingEventTrigger(this.selectedRowIndex(), rowIndex)) {
                    this.selectRows(rowIndex);
                    this._rowSelectedEventTrigger(rowIndex);
                }
                this.updateScrollBar(rowIndex);
            }
        },
        /* Public method for scroll to last row of treegrid*/
        scrollToBottom: function ()
        {
            var model = this.model,
                updatedRecords, record, rowIndex = -1;

            if (model.isEdit)
                this.saveCell();
            else if (this._isRowEdit)
                this._saveRow();
            updatedRecords = this.getExpandedRecords(model.updatedRecords);

            if (updatedRecords.length > 0) {
                rowIndex = updatedRecords.length - 1;
                record = updatedRecords[rowIndex];
                rowIndex = model.updatedRecords.indexOf(record);
                if (model.allowSelection && !this._rowSelectingEventTrigger(this.selectedRowIndex(), rowIndex)) {
                    this.selectRows(rowIndex);
                    this._rowSelectedEventTrigger(rowIndex);
                }
                this.updateScrollBar(rowIndex);
            }
        },

        //ENABLE AND DISABLE THE CORRESPONDING TOOLS WHILE ADDING AND EDITING THE ROW RECORD.
        _editAddTools: function () {
            var proxy = this, model = proxy.model;
            var toolbar = $("#" + proxy._id + "_toolbarItems");
            var editSettings = proxy.model.editSettings;
            toolbarItems = model.toolbarSettings.toolbarItems;
            var disableToolItems = [];
            if (editSettings.allowAdding && toolbarItems.indexOf("add") !== -1 && !$(toolbar).find(".e-addnew").parent("li").hasClass("e-disable"))
                disableToolItems.push($(toolbar).find(".e-addnew").parent()[0]);
            if (editSettings.allowEditing && toolbarItems.indexOf("edit") !== -1 && !$(toolbar).find(".e-edit").parent("li").hasClass("e-disable"))
                disableToolItems.push($(toolbar).find(".e-edit").parent()[0]);
            if (editSettings.allowDeleting && toolbarItems.indexOf("delete") !== -1 && !$(toolbar).find(".e-delete").parent("li").hasClass("e-disable") && model.editSettings.beginEditAction != "click")
                disableToolItems.push($(toolbar).find(".e-delete").parent()[0]);
            disableToolItems.forEach(function (element) {
                $(toolbar).ejToolbar('disableItem', element);
            });

            var enabledToolItems = [];
            if (toolbarItems.indexOf("cancel") !== -1)
                enabledToolItems.push($(toolbar).find(".e-cancel").parent()[0]);
            if (toolbarItems.indexOf("update") !== -1)
                enabledToolItems.push($(toolbar).find(".e-save").parent()[0]);
            if (model.editSettings.beginEditAction == "click")
                enabledToolItems.push($(toolbar).find(".e-delete").parent()[0]);
            enabledToolItems.forEach(function (element) {
                $(toolbar).ejToolbar('enableItem', element);
            });

        },
        //ENABLE AND DISABLE THE CORRESPONDING TOOLS WHILE CANCEL AND SAVING THE ROW RECORD.
        _cancelSaveTools: function () {
            var proxy = this,
                model = proxy.model,
                editSettings = proxy.model.editSettings,
                toolbar = $("#" + proxy._id + "_toolbarItems"),
                parentRecords = [],
                toolbarItems = model.toolbarSettings.toolbarItems;
            if (!model.isFromGantt) {
                var enabledToolItems = [];
                var disableToolItems = [];
                if (editSettings.allowAdding) {
                    if (toolbarItems.indexOf("add") !== -1)
                        enabledToolItems.push($(toolbar).find(".e-addnew").parent()[0]);
                } else {
                    disableToolItems.push($(toolbar).find(".e-addnew").parent()[0]);
                }

                if (editSettings.allowEditing && toolbarItems.indexOf("edit") !== -1) {
                    if (proxy.selectedRowIndex() != -1 && model.allowSelection && model.selectedItems.length == 1 && editSettings.beginEditAction != "click")
                        enabledToolItems.push($(toolbar).find(".e-edit").parent()[0]);
                    else if (!$(toolbar).find(".e-edit").parent("li").hasClass("e-disable"))
                        disableToolItems.push($(toolbar).find(".e-edit").parent()[0]);
                } else {
                    disableToolItems.push($(toolbar).find(".e-edit").parent()[0]);
                }
                if (editSettings.allowDeleting && toolbarItems.indexOf("delete") !== -1) {
                    if (proxy.selectedRowIndex() != -1 && model.allowSelection && model.selectedItems.length > 0)
                        enabledToolItems.push($(toolbar).find(".e-delete").parent()[0]);
                    else if (!$(toolbar).find(".e-delete").parent("li").hasClass("e-disable"))
                        disableToolItems.push($(toolbar).find(".e-delete").parent()[0]);
                } else {
                    disableToolItems.push($(toolbar).find(".e-delete").parent()[0]);
                }

                parentRecords = proxy._getParentRecords(model.updatedRecords, proxy);

                if (parentRecords.length <= 0) {
                    if (toolbarItems.indexOf("expandAll") !== -1 && !$(toolbar).find(".e-expandall").parent("li").hasClass("e-disable"))
                        disableToolItems.push($(toolbar).find(".e-expandall").parent()[0]);
                    if (toolbarItems.indexOf("collapseAll") !== -1 && !$(toolbar).find(".e-collapseall").parent("li").hasClass("e-disable"))
                        disableToolItems.push($(toolbar).find(".e-collapseall").parent()[0]);
                }
                else {
                    if (toolbarItems.indexOf("expandAll") !== -1)
                        enabledToolItems.push($(toolbar).find(".e-expandall").parent()[0]);
                    if (toolbarItems.indexOf("collapseAll") !== -1)
                        enabledToolItems.push($(toolbar).find(".e-collapseall").parent()[0]);
                }
                if (editSettings.beginEditAction != "click" || (editSettings.beginEditAction == "click" && !model.isEdit)) {
                    if (toolbarItems.indexOf("cancel") !== -1 && !$(toolbar).find(".e-cancel").parent("li").hasClass("e-disable"))
                        disableToolItems.push($(toolbar).find(".e-cancel").parent()[0]);
                    if (toolbarItems.indexOf("update") !== -1 && !$(toolbar).find(".e-save").parent("li").hasClass("e-disable"))
                        disableToolItems.push($(toolbar).find(".e-save").parent()[0]);
                }

                disableToolItems.forEach(function (element) {
                    $(toolbar).ejToolbar('disableItem', element);
                });
                enabledToolItems.forEach(function (element) {
                    $(toolbar).ejToolbar('enableItem', element);
                });
            }
            else {
                var toolbar = $("#" + proxy._id.replace("ejTreeGrid", "") + "_toolbarItems");
                var enabledToolItems = [];
                if (model.readOnly == true) {
                    var disableToolItems = [];
                    disableToolItems.push($(toolbar).find(".e-addnewitem").parent()[0]);
                    disableToolItems.push($(toolbar).find(".e-edititem").parent()[0]);
                    disableToolItems.push($(toolbar).find(".e-edititem").parent()[0]);
                }
                else {
                    if (editSettings.allowAdding && toolbarItems.indexOf("add") !== -1)
                        enabledToolItems.push($(toolbar).find(".e-addnewitem").parent()[0]);

                    if (editSettings.allowEditing && toolbarItems.indexOf("edit") !== -1 && model.allowSelection && editSettings.beginEditAction != "click") {
                        if (proxy.selectedRowIndex() != -1)
                            enabledToolItems.push($(toolbar).find(".e-edititem").parent()[0]);
                    }
                    if (editSettings.allowDeleting && toolbarItems.indexOf("delete") !== -1 && model.allowSelection) {
                        if (proxy.selectedRowIndex() != -1)
                            enabledToolItems.push($(toolbar).find(".e-deleteitem").parent()[0]);
                    }
                    $(toolbar).ejToolbar('enableItem', enabledToolItems);

                    var disableToolItems = [];
                    if (toolbarItems.indexOf("cancel") !== -1)
                        disableToolItems.push($(toolbar).find(".e-cancel").parent()[0]);
                    if (toolbarItems.indexOf("update") !== -1)
                        disableToolItems.push($(toolbar).find(".e-saveitem").parent()[0]);
                }
                disableToolItems.forEach(function (element) {
                    $(toolbar).ejToolbar('disableItem', element);

                });
            }
        },

        
        _checkIsEmptyRow:function(item){
            for (var key in item) {
                var val = item[key];
                if (val === " " || val === null || val === "" || val === false)
                    continue;
                    return false;                
            }
            return true;
        },
              
        _beginEdit: function () {
            var proxy = this;
            proxy._trigger("beginEdit", args);
            proxy._isinBeginEdit = true;           
        },

        _endEdit: function () {
            var proxy = this;

            proxy._isinBeginEdit = false;
            var index = this.selectedRowIndex();
            var tr = ej.TreeGrid.getRowByIndex(proxy, index);
            if ($('tr').hasClass("e-addedrow") || $('tr').hasClass("e-rowedit"))
                proxy._saveRow();
            else
                proxy.saveCell();

        },
        //Refresh the treegrid content after expandAll or collapseAll
        _refreshTreeGridOnExpandCollapseAll:function(args)
        {
            var proxy = this,
                model = this.model;
            if (model.enableVirtualization) {
                if (model.enableAltRow)
                    proxy.updateAltRow();
                proxy.sendDataRenderingRequest(args);
                proxy._setScrollTop();
                proxy.updateHeight();
            }             
            else {
                if (model.allowPaging) {
                    var arg = {};
                        arg.totalRecordsCount = this.getExpandedRecords(model.updatedRecords).length;
                    proxy.getPager().ejPager("option", arg).ejPager("refreshPager");
                    pagerModel = this.getPager().ejPager("model");
                    proxy._currentPage(pagerModel.currentPage);
                    arg.requestType = "paging";
                    proxy.processBindings(arg);
                }
                //If need refresh chart if record is added after searching or sorting
                if (proxy._isRefreshAddedRecord) {
                    proxy.processBindings();
                    this.renderRecords();
                    proxy._isRefreshAddedRecord = false;
                    return;
                }
                proxy.updateHeight();
                if (model.enableAltRow && model.currentViewData.length > 0)
                    ej.TreeGrid.updateAltRow(proxy, proxy.model.currentViewData[0], 0, 0);
            }
        },
        //expand or collapse all inner level child records on expandAll or collapseAll
        _expandCollapseInnerLevelRecord: function (record, expanded) {
            var proxy = this,
                length = record.childRecords.length,
                tempArgs = {};

            for (var count = 0; count < length; count++) {
                if (record.childRecords[count].hasChildRecords) {
                    proxy._expandCollapseInnerLevelRecord(record.childRecords[count], expanded);
                    tempArgs.data = record.childRecords[count];
                    tempArgs.expanded = expanded;
                    ej.TreeGrid.sendExpandCollapseRequest(proxy, tempArgs);
                }
            }
        },
        _expandParentLevelRecord: function (record, expanded) {
            var proxy = this,               
                tempArgs = {};
            var parentExpandState = proxy.getExpandStatus(treegridRecord);
            if (!record.expanded || !parentExpandState) {
                tempArgs.data = record;
                tempArgs.expanded = expanded;
                ej.TreeGrid.sendExpandCollapseRequest(proxy, tempArgs);
                if (tempArgs.data.parentItem) {
                    proxy._expandParentLevelRecord(tempArgs.data.parentItem, expanded);
                }
            }
        },
        // expand the specified level record
        expandAtLevel: function (index) {
            var proxy = this, args = {};
            var parentRecords = proxy._getParentRecords(model.updatedRecords, proxy);
            for (count = 0; count < parentRecords.length; count++) {
                treegridRecord = parentRecords[count];
                if (treegridRecord.level == index) {
                    args.data = treegridRecord;
                    args.expanded = true;
                    ej.TreeGrid.sendExpandCollapseRequest(proxy, args);
                    // expand its parent if it is collapsed.
                    if (treegridRecord.parentItem) {
                        proxy._expandParentLevelRecord(treegridRecord.parentItem, args.expanded);
                    }
                    
                }
            }
        },
        // collapse the specified level record
        collapseAtLevel: function (index) {
            var proxy = this, args = {};
            var parentRecords = proxy._getParentRecords(model.updatedRecords, proxy);
            for (count = 0; count < parentRecords.length; count++) {
                treegridRecord = parentRecords[count];                
                if (treegridRecord.level == index && treegridRecord.expanded) {
                    var parentExpandState = proxy.getExpandStatus(treegridRecord);
                    if (parentExpandState) {
                        args.data = treegridRecord;
                        args.expanded = false;
                        ej.TreeGrid.sendExpandCollapseRequest(proxy, args);
                    }
                }
            }
        },
        //Expand the child records from parent.
        _expandAll: function () {

            var proxy = this,
                model = proxy.model,
                count = 0,
                treegridRecord,
                args = {};

            if (proxy._isRowEdit)
                proxy.cancelRowEditCell();
            else if(proxy.model.isEdit)
                proxy.cancelEditCell();

            args.requestType = ej.TreeGrid.Actions.ExpandCollapse;

            proxy._isInExpandCollapseAll = true;
            //loop excecute for iterate the GanttRecords preseent in the Gantt Control

            for (count = 0; count < proxy.model.parentRecords.length; count++) {
                treegridRecord = proxy.model.parentRecords[count];
                args.data = treegridRecord;
                args.recordIndex = count;
                args.expanded = true;
                if (treegridRecord.hasChildRecords) {
                    proxy._expandCollapseInnerLevelRecord(treegridRecord, args.expanded);
                    ej.TreeGrid.sendExpandCollapseRequest(proxy, args);
                }
            }
            if (model.flatRecords.length > 0)
                proxy._refreshTreeGridOnExpandCollapseAll(args);

            proxy._isInExpandCollapseAll = false;
        },

           

        _refreshToolBar: function () {
            var $toolbar = $("#" + this._id + "_toolbarItems");
            $toolbar.find("li").removeClass("e-hover");
        },

        //RENDER TOOL BAR
        _renderToolbar: function () {
            var proxy = this,
            model = proxy.model;
            if (!model.isFromGantt) {
                var proxy = this, element = proxy.element, model = proxy.model;
                if (proxy.model.toolbarSettings.showToolbar) {
                    if (proxy.model.toolbarSettings.toolbarItems.length == 0)
                        proxy.model.toolbarSettings.toolbarItems = [ej.TreeGrid.ToolbarItems.Add,
                        ej.TreeGrid.ToolbarItems.Edit, ];
                    element.append(proxy._renderToolbarTemplate());
                }
            }
        },

        //RENDER TOOLBAR TEMPLATE
        _renderToolbarTemplate: function () {
            var proxy = this,
                model = proxy.model,
                $div = ej.buildTag("div.e-treegridtoolbar#" + proxy._id + "_toolbarItems", "", { 'height': '36px', 'border': '1px solid' }, { "unselectable": "on" }),
                $ul = ej.buildTag("ul", "", { 'width': proxy._gridWidth, 'box-sizing': ' ' }, { "unselectable": "on" });
            (!ej.isNullOrUndefined(model.toolbarSettings.toolbarItems) && model.toolbarSettings.toolbarItems.length) && proxy._renderLi($ul);
            $div.append($ul);
            var $customUl = ej.buildTag("ul", "", {}, { "unselectable": "on" });
            $div.append($customUl);
            var helper = {};
            helper.click = proxy._toolBarClick;
            helper.cssClass = "";
            helper.rtl = false;
            helper.itemSeparator = false;
            helper.itemLeave = proxy._toolbarItemLeave;
            helper.width= proxy._gridWidth,
            helper.fields = {
                id: "",
                tooltipText: "",
                imageUrl: "",
                text: "",
                imageAttributes: "",
                spriteCSS: "",
                htmlAttributes: "",
            };
            $div.ejToolbar(helper);
            $div.ejToolbar("disableItem", proxy._disabledToolItems);
            proxy._disabledToolItems = $();
            return $div;
        },
        //Render list to display the tools in toolbar.
        _renderLi: function ($ul) {
            var proxy = this,
                toolBarItems = proxy.model.toolbarSettings.toolbarItems,
                length = toolBarItems.length,
                i = 0,
                $li;
            for (i; i < length; i++) {

                $li = ej.buildTag("li", "", {}, {
                    id: proxy._id + "_" + toolBarItems[i]
                });

                if (toolBarItems[i] !== "search")
                    $li.css({ 'width': '30px', 'height': '24px', });

                proxy._renderLiContent($li, toolBarItems[i]);
                $ul.append($li);
            }
        },

        //RENDER TOOLBAR ICONS
        _renderLiContent: function ($li, item) {
            var $a, $input;
            var selectedRowIndex = this.selectedRowIndex();
            var editSetting = this.model.editSettings;
            switch (item) {

                case "add":
                    $a = ej.buildTag("span.e-addnew e-toolbaricons e-icon e-treegrid-add", "", {});
                    var addTitle = this._toolboxTooltipTexts["addTool"];
                    $li.attr("title", addTitle);
                    if (!this.model.editSettings.allowAdding)
                        this._disabledToolItems.push($li.get(0));
                    break;

                case "edit":
                    $a = ej.buildTag("span.e-edit e-toolbaricons e-icon e-treegrid-edit", "", {});
                    var editTitle = this._toolboxTooltipTexts["editTool"];
                    $li.attr("title", editTitle);
                    if (!this.model.editSettings.allowEditing || selectedRowIndex == -1 || !this.model.allowSelection) {
                        this._disabledToolItems.push($li.get(0));
                    }

                    break;

                case "delete":
                    var deleteTitle = this._toolboxTooltipTexts["deleteTool"];
                    $li.attr("title", deleteTitle);
                    $a = ej.buildTag("span.e-delete e-toolbaricons e-icon e-treegrid-delete", "", {});

                    if (!this.model.editSettings.allowDeleting || selectedRowIndex == -1 || !this.model.allowSelection) {
                        this._disabledToolItems.push($li.get(0));
                    }

                    break;

                case "update":
                    var updateTitle = this._toolboxTooltipTexts["updateTool"];
                    $li.attr("title", updateTitle);
                    $a = ej.buildTag("span.e-save e-toolbaricons e-icon e-treegrid-save e-disabletool", "", {});
                    this._disabledToolItems.push($li.get(0));
                    break;

                case "cancel":
                    var cancelTitle = this._toolboxTooltipTexts["cancelTool"];
                    $li.attr("title", cancelTitle);
                    $a = ej.buildTag("span.e-cancel e-toolbaricons e-icon e-treegrid-cancel e-disabletool", "", {});
                    this._disabledToolItems.push($li.get(0));
                    break;

                case "expandAll":
                    var expandAllTitle = this._toolboxTooltipTexts["expandAllTool"];
                    $li.attr("title", expandAllTitle);
                    $input = ej.buildTag("span.e-expandall e-toolbaricons e-icon e-treegrid-expandall", "", {}, {});
                    $li.append($input);
                    break;

                case "collapseAll":
                    var collapseAllTitle = this._toolboxTooltipTexts["collapseAllTool"];
                    $li.attr("title", collapseAllTitle);
                    $input = ej.buildTag("span.e-collapseall e-toolbaricons e-icon e-treegrid-collapseall", "", {}, {});
                    $li.append($input);
                    break;

                case "pdfExport":
                    var pdfExportTitle = this._toolboxTooltipTexts["pdfExportTool"];
                    $li.attr("title", pdfExportTitle);
                    $input = ej.buildTag("span.e-pdfIcon e-toolbaricons e-icon", "", {}, {});
                    $li.append($input);
                    break;
                case "excelExport":
                    var excelExportTitle = this._toolboxTooltipTexts["excelExportTool"];
                    $li.attr("title", excelExportTitle);
                    $input = ej.buildTag("span.e-excelIcon e-toolbaricons e-icon", "", {}, {});
                    $li.append($input);
                    break;
            }

            $li.append($a);
        },

        //update the toolbar items when dynamically update the editSettings property
        _updateToolbarItems: function () {
            var proxy = this,
                model = proxy.model,
                toolbarItems = model.toolbarSettings.toolbarItems,
                editSettings = model.editSettings,
                toolbar = $("#" + proxy._id + "_toolbarItems"),
                selectedRowIndex = proxy.selectedRowIndex(),
                editMode = editSettings.editMode;
                disableToolItems = [],
                enableToolItems = [], toolbarItems = model.toolbarSettings.toolbarItems;
                if (editMode.toLowerCase() == "cellediting") {
                    /* We can able perform rowEditing using toolbar, whether the editMode also in cellEditing.
                       So cancel the editing based on edit type.*/
                    if (proxy._isRowEdit)
                        proxy.cancelRowEditCell();
                    else if (model.isEdit)
                        proxy.cancelEditCell();
                }
                else if (editMode.toLowerCase() == "rowediting")
                    proxy.cancelRowEditCell();
                proxy._cancelSaveTools();
        },


        //#region TREEGRIDHEADER RENDERIGN

        //TREEGRID HEADER RENDER INITIALIZATION
        _renderAfterColumnInitialize:function(){
            var proxy = this;
            proxy.element.append(proxy._renderGridHeader());
        },

        //TO CHECK FILTER FORM ELEMENTS EDIT TYPE
        filterEditType: function (column, element, filterValue) {

            var proxy = this,
                model = proxy.model;
               
            if (ej.isNullOrUndefined(column["filterEditType"]))
                column["filterEditType"] = column["editType"];

            switch (column["filterEditType"]) {
                case "stringedit":
                    element.html(ej.buildTag('input.e-ejinputtext e-filtertext e-field e-filterwidth', "", {}, { id: proxy._id + "_" + column.field + "_filterbarcell", name: column.field, value: filterValue }));
                    break;
                case "booleanedit":
                    element.html('<input class="e-field e-checkbox e-filtertext" type ="checkbox" id=' + proxy._id + "_" + column.field + "_filterbarcell" + ' name=' + column.field, 'value =' + filterValue + '/>');
                    break;
                case "numericedit":
                    var $numericText = ej.buildTag('input.e-numerictextbox e-field', "", { "width": column.width - 15 }, { type: "text", id: proxy._id + "_" + column.field + "_filterbarcell", name: column.field, value: filterValue });
                    element.append($numericText);
                    break;
                case "datepicker":
                case "datetimepicker":
                    var $datePicker = ej.buildTag('input.e-' + column["filterEditType"] + ' e-field', "", {}, { type: "text", id: proxy._id + "_" + column.field + "_filterbarcell", name: column.field, value: filterValue });
                    element.append($datePicker);
                    break;
                case "dropdownedit":
                    var $dropDownList = ej.buildTag('input.e-field e-dropdownlist e-field', "", {}, { type: "text", id: proxy._id + "_" + column.field + "_filterbarcell", name: column.field, value: filterValue });
                    element.append($dropDownList);
                    break;
            }
        },


        //RENDER FILTER BAR ELEMENTS ACCORDING TO ITS TYPE
        _filteringElements: function (args) {
            var proxy = this,
                model=proxy.model,
                elementFocused = false,
                $formElement,
                form, length,
                $element,
                width,
                params = {},
                value,
                column,
                customParams,
                toformat,
                formatVal;
            selectedItem = model.selectedItem;

            if (args.requestType == "filtering") {
                form = document.getElementById(proxy._id + "_filterBar" + args.fieldname);
            }
            
            var column = customParams = ej.TreeGrid.getColumnByField(model.columns,args.fieldname)
            $formElement = $(form).find("input,select");
            length = $formElement.length;
            for (var i=0; i < length; i++) {
                $element = $formElement.eq(i);
                params = {};
                //inputWidth = column.width ? column.width - 2 : proxy.model.commonWidth - 2;
                inputWidth = $element.closest("div").width()-2;
                if ($element.hasClass("e-numerictextbox")) {
                    width = inputWidth;
                    value = $element.val();
                    params.width = width;                    
                    params.showSpinButton = true;
                    params.cssClass = model.cssClass;
                    params.height = 28;
                    params.focusIn = $.proxy(proxy._cancelEditState, proxy, $element);
                    //for parent editing 
                    var tempId = $element[0].id;
                    tempId=tempId.replace(proxy._id, '');
                    if (model.filterSettings.filterBarMode == "immediate")
                        params.change = $.proxy(proxy._filterBarHandler, proxy, $element);
                    else
                        params.change = null;
                    if (value.length)
                        params.value = parseFloat(value);
                    else
                        params.value = null;
                    customParams = ej.TreeGrid.getColumnByField(proxy.model.columns, $element.prop("name"));
                    if (!ej.isNullOrUndefined(customParams) && !ej.isNullOrUndefined(customParams["editParams"]))
                        $.extend(params, customParams["editParams"]);
                    $element.ejNumericTextbox(params);
                    $element.prop("name", $element.prop("name").replace(proxy._id, ""));
                }
                else if ($element.hasClass("e-datepicker")) {
                    width = inputWidth;
                    params.width = width;                    
                    params.cssClass = model.cssClass;
                    params.dateFormat = model.dateFormat;
                    params.locale = model.locale;
                    params.height = 28;
                    params.focusIn = $.proxy(proxy._cancelEditState, proxy, $element);
                    var tempId = $element[0].id;
                    tempId = tempId.replace(proxy._id, '');
                    //To filter the records once the date seleted.
                    if (model.filterSettings.filterBarMode == "immediate")
                        params.select = $.proxy(proxy._filterBarHandler, proxy, $element);
                    else
                        params.select = null;
                    column = ej.TreeGrid.getColumnByField(proxy.model.columns, $element.prop("name"));
                    if (column["format"] !== undefined && column.format.length > 0) {
                        toformat = new RegExp("\\{0(:([^\\}]+))?\\}", "gm");
                        formatVal = toformat.exec(column.format);
                        params.dateFormat = formatVal[2];
                    }
                    if (!ej.isNullOrUndefined(column["editParams"]))
                        $.extend(params, column["editParams"]);

                    if (model.dateFormat.toLowerCase().indexOf("hh") != -1)
                        $element.ejDateTimePicker(params);
                    else
                        $element.ejDatePicker(params);
                    proxy._preventDoubleClick(column); //To prevent double click event
                }
                else if ($element.hasClass("e-datetimepicker")) {
                    width = inputWidth;
                    params = {
                        width: width,
                        rtl: model.rtl,
                        locale:model.locale,
                        cssClass: model.cssClass,
                        showButton: false,
                        focusIn : $.proxy(proxy._cancelEditState, proxy, $element),
                    };
                    params.height = 28;
                    column = ej.TreeGrid.getColumnByField(proxy.model.columns, $element.prop("name"));
                    if (column["format"] !== undefined && column.format.length > 0) {
                        toformat = new RegExp("\\{0(:([^\\}]+))?\\}", "gm");
                        formatVal = toformat.exec(column.format);
                        params.dateTimeFormat = formatVal[2];
                    }
                    if (!ej.isNullOrUndefined(column["editParams"]))
                        $.extend(params, column["editParams"]);

                    $element.ejDateTimePicker(params);
                    proxy._preventDoubleClick(column); //To prevent double click event

                }
                else if ($element.hasClass("e-dropdownlist")) {
                    column = ej.TreeGrid.getColumnByField(model.columns, args.fieldname);
                    var text = (column.editParams && column.editParams.fields && column.editParams.fields.text) ? column.editParams.fields.text : "text";
                    var value = (column.editParams && column.editParams.fields && column.editParams.fields.value) ? column.editParams.fields.value : "value";
                    var clear, emptyString, dropData = [], blank, selectAll, dropDatatrue, dropDatafalse;
                    //Collecting the drop down data for drop down filter bar
                    if (column.dropdownData && column.dropdownData.length > 0)
                        dropData = $.extend(true, [], column.dropdownData);
                    else {
                        //Default drop down data for boolean editType columns
                        if (column.editType == "booleanedit") {
                            dropData = [];
                            dropDatatrue = {};
                            dropDatatrue[text] = proxy._trueText;
                            dropDatatrue[value] = "true";
                            dropData.push(dropDatatrue);
                            dropDatafalse = {};
                            dropDatafalse[text] = proxy._falseText;
                            dropDatafalse[value] = "false";
                            dropData.push(dropDatafalse);
                        }
                        else
                            dropData = proxy._dropDownArrayCollection(column, args.fieldname);  //Gathering dropdown data from datasource                       
                    }
                    //To append selectAll(clear) label in the drop down list                   
                    //clear = { text: proxy._dropDownListClearText, value: "" };
                    clear = {};
                    clear[text] = proxy._dropDownListClearText;
                    clear[value] = "";
                    dropData.splice(0, 0, clear);
                    //To append (Blanks) label in the drop down list
                        blank = column.allowFilteringBlankContent == undefined ? true : column.allowFilteringBlankContent;
                    if (blank) {
                        //emptyString = { text: proxy._dropDownListBlanksText, value: proxy._dropDownListBlanksText };
                        emptyString = {};
                        emptyString[text] = proxy._dropDownListBlanksText;
                        emptyString[value] = proxy._dropDownListBlanksText;
                        dropData.push(emptyString);
                    }
                    var param = {}, inputValue = $element.val(), $dropDownObj, dropObject = $("#" + $element[0].id).data("ejDropDownList");
                    if (dropObject) {
                        $dropDownObj = $(dropObject.popupList);
                    }
                    
                    param.width = inputWidth;
                    param.showCheckbox = false;
                    param.dataSource = dropData;
                    param.height = 28;
                    param.popupShown = $.proxy(proxy._cancelEditState, proxy, $element);
                    param.fields = { text: text, value: value };
                    //To filter the records once the item has been selected.
                    if (model.filterSettings.filterBarMode == "immediate")
                        param.popupHide = $.proxy(proxy._filterBarHandler, proxy, $element);
                    else
                        param.popupHide = null;
                    $element.ejDropDownList(param);
                    //Apply italic font style for "(Clear Filter)" and "(Blanks)" label
                    if ($dropDownObj) {
                        $dropDownObj.find(".e-ul :first-child").find(".e-ddltxt").css("font-style", "italic");
                        if(blank)
                            $dropDownObj.find(".e-ul :last-child").find(".e-ddltxt").css("font-style", "italic");
                    }
                    if (inputValue == proxy._dropDownListClearText)
                        inputValue = "";
                    $element.ejDropDownList("selectItemByValue", inputValue);//To retain the selected value in dropdown    
                    proxy._preventDoubleClick(column); //To prevent double click event                 
                } else {
                    switch ($element.prop('tagName')) {
                        case "INPUT":
                            $element.width(inputWidth - 4);
                            if (column.filterEditType == "stringedit")
                                proxy._on($("#" + proxy._id + "_" + column.field + "_filterbarcell"), "focus", proxy._cancelEditState);                                
                            break;

                        case "SELECT":
                            $element.width(inputWidth).height(15);
                            break;
                    }
                }
                if (!$element.is(":disabled") && !elementFocused && (!$element.is(":hidden") || typeof $element.data("ejDropDownList") == "object")) {
                    if (!proxy._isEnterKeyPressed) {
                        elementFocused = true;
                    }
                }
            }
        },

        // Method for retriving drop down data to filterbar from data source
        _dropDownArrayCollection: function (column, fieldItems) {
            var proxy = this,
                model = proxy.model,
                fieldName = fieldItems,
                dropDownRecords = [],
                uniqueDropDownRecords = [],
                dropdownData = [],
                columnEditType = column.editType;

            dropDownRecords = $.map(model.flatRecords, function (record) {
                if (record.item[fieldName])
                    return record.item[fieldName];
            });
            $.each(dropDownRecords, function (i, el) {
                el=$.trim(el); 
                if ($.inArray(el, uniqueDropDownRecords) === -1) uniqueDropDownRecords.push(el);
            });
            if (columnEditType != "numericedit")
                uniqueDropDownRecords.sort(proxy.stringCompare);
            else {
                uniqueDropDownRecords = uniqueDropDownRecords.sort(function (a, b) {
                    return a - b;
                });
            }
            $.each(uniqueDropDownRecords, function (i, val) {
                dropdownData.push({ text: val, value: val });
            });
            return dropdownData;
        },

        stringCompare: function (s1, s2) {
            var str1 = [], str2 = [];

            s1.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { str1.push([$1 || Infinity, $2 || ""]) });
            s2.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { str2.push([$1 || Infinity, $2 || ""]) });
    
            while (str1.length && str2.length) {
                var st1 = str1.shift();
                var st2 = str2.shift();
                var val = (st1[0] - st2[0]) || st1[1].localeCompare(st2[1]);
                if(val) return val;
            }

            return str1.length - str2.length;
        },
        // Method to prevent double click event during dropDown list and date picker filtering
        _preventDoubleClick: function (col) {
            var proxy = this,
                filterBoxTool = $("#" + proxy._id + "_" + col.field + "_filterbarcell_popup");
            if (filterBoxTool.length != 0) {
                $(filterBoxTool).on('click', function (e) {
                    proxy._off(proxy.element, "dblclick", ".e-gridcontent", proxy._editdblClickHandler);
                    setTimeout(function () {
                        proxy._on(proxy.element, "dblclick", ".e-gridcontent", proxy._editdblClickHandler);
                    }, 300);
                });
            }
        },
        // METHOD TO RENDER FILDERING ELEMENTS
        _renderFiltering: function (columns, showDetailColumn) {
            var proxy = this, model = this.model;
            totColumns = model.columns,
            filteredColumns = model.filterSettings.filteredColumns;
            var $tr = ej.buildTag('tr.e-filterbar', "", {}, {});
            if (proxy.model.allowFiltering) {
                $.each(totColumns, function (i, column) {
                    if (ej.isNullOrUndefined(column["allowFiltering"]))
                        column["allowFiltering"] = true;
                });
                var filterEnabled = false;
                //To check whether atleast any one of the column's allowFiltering has been enabled
                $.each(totColumns, function (i, column) {
                    if (column.allowFiltering == true) {
                        filterEnabled = true;
                        return false;
                    }
                });
                if (filterEnabled) {
                    for (var column = 0; column < columns.length; column++) {

                    var $th = ej.buildTag('th.e-filterbarcell .e-editValue', "", {}, {});
                    columns[column]["visible"] === false && $th.addClass("e-hide");
                    $div = ej.buildTag('div.e-filterdiv', "", {}, { id: proxy._id + "_filterBar" + columns[column].field });
                        $tr.append($th.append($div));
                        //Condition to check whether allow filtering enabled for the individual column before rendering filtering elements
                        if (columns[column].allowFiltering == false)
                            continue;
                        else {
                            var filterValue = "";
                            if (filteredColumns.length > 0) {
                                for (var fcolumn = 0; fcolumn < filteredColumns.length; fcolumn++) {
                                    if (columns[column].field == filteredColumns[fcolumn].field) {
                                        filterValue = filteredColumns[fcolumn].value;
                                    }
                                }
                            }
                       
                            this.filterEditType(columns[column], $div, filterValue);
                        var $span = ej.buildTag('span.e-cancel e-icon e-hide e-spanstyle');
                        $div.append($span);
                    }                   
                }          
                }
            }
            /* add details column to last in column header */
            if (model.showDetailsRow && model.detailsTemplate && model.showDetailsRowInfoColumn && showDetailColumn) {
                $tr.append(ej.buildTag('th.e-filterbarcell e-detailheadercell', '<div style="width:35px;"></div>'));
            }
            return $tr;
        },


        _getIndentCol: function () {
            return ej.buildTag("col", "", { width: "35px" });
        },

        //METHOD FOR RENDERING TREEGRID HEADER
        _renderGridHeader: function () {

            var proxy = this,
                model = proxy.model,
                doc = document, temp, $frozenDiv, $movableDiv,
                $innerDiv = ej.buildTag('div.e-gridheadercontainer', "", { "overflow": "hidden" }, { "unselectable": "on" }),
                $div = model.isFromGantt ? ej.buildTag('div.e-gridheader#' + proxy._id + "e-gridheader", "", {
                    "border-left-style": "solid",
                    "border-left-width": "1px"
                }, "") :
                    ej.buildTag('div.e-gridheader#' + proxy._id + "e-gridheader", "",
                {
                    "border-top-style": "solid",
                    "border-left-style": "solid",
                    "border-right-style": "solid",
                    "border-top-width": "1px",
                    "border-left-width": "1px",
                    "border-right-width": "1px",
                    "width": proxy._gridWidth,
                }, "");
            

            proxy.setGridHeaderContent($div);
            proxy._$gridHeaderContainer = $innerDiv;
            proxy._hiddenColumns = [];
            proxy._visibleColumns = [];
            proxy.columnsWidthCollection = [];

            if (this._frozenColumnsLength > 0) {
                $frozenDiv = ej.buildTag("div.e-frozenheaderdiv#e-frozenheaderdiv" + proxy._id, this._renderGridHeaderInternalDesign(model.columns.slice(0, this._frozenColumnsLength), false));
                $movableDiv = ej.buildTag("div.e-movableheader#e-movableheader" + proxy._id, ej.buildTag("div.e-movableheaderdiv#e-movableheaderdiv" + proxy._id, this._renderGridHeaderInternalDesign(this.model.columns.slice(this._frozenColumnsLength), true)));
                $innerDiv.append($frozenDiv).append($movableDiv);
            } else
                $innerDiv.append(this._renderGridHeaderInternalDesign(this.model.columns, true));
            $div.html($innerDiv);
            this.setGridHeaderTable(this.getHeaderContent().find(".e-table"));
            return $div;
        },

        getPager: function () {
            return this._gridPager;
        },

        setTreeGridPager: function (value) {
            this._gridPager = value;
        },

        _renderGridPager: function () {
            var proxy = this,
                $div = $(document.createElement('div')),
                pagerModel = {}, pageSettings = proxy.model.pageSettings;

            pageSettings.click = $.proxy(proxy._pagerClickHandler, proxy);
            pageSettings.totalRecordsCount = proxy._gridRecordsCount;                        
            $.extend(pagerModel, pageSettings);
            pagerModel.locale = proxy.model.locale;
            if (proxy._currentPage() < 0)
                proxy._currentPage(1);
            pagerModel.currentPage = proxy._currentPage();
            pagerModel.masterObject = proxy;
            proxy.setTreeGridPager($div);
            $div.ejPager(pagerModel);
            $div.ejPager("refreshPager");
            pagerModel = $div.ejPager("model");
            pageSettings.totalPages = pagerModel.totalPages;
            if (proxy._currentPage() !== pagerModel.currentPage)
                proxy._currentPage(pagerModel.currentPage);
            //Create custom Paging Template
            if (!ej.isNullOrUndefined(pageSettings.template) && pageSettings.template.length > 0) {
                $div.children().remove();                
                var $customDiv = ej.buildTag('div.e-pagercontainer'),
                $template = this._createTemplateElement(pageSettings, true);
                $customDiv.append($template.innerHTML);
                $div.append($customDiv)
            }
            return $div;
        },
        _renderGridHeaderInternalDesign: function (columns, showDetailColumn)
        {
            var proxy = this,
             model = proxy.model,
             doc = document,
             $table = ej.buildTag('table.e-table', "", {}, { "cellspacing": "0px", "border-spacing": "0px" }),
             $thead = ej.buildTag('thead'),
             $tbody = ej.buildTag('tbody.e-hide'),
             $columnHeader = ej.buildTag('tr.e-columnheader'),
             $colGroup = $(doc.createElement('colgroup')),
             $rowBody = $(doc.createElement('tr')),
             columnCount = 0,
             length = columns.length,
             $headerCell,
             bodyCell,
             $headerCellDiv,
             col, $filterHeader;

            //CHECK SORTING ENABLED OR NOT
            if (model.allowSorting || model.showColumnChooser) {
                $columnHeader.css({ 'cursor': 'pointer' });
            }

            if (model.headerTextOverflow === "wrap")
                proxy.element.addClass("e-wrap");
            else
                proxy.element.removeClass("e-wrap");

            for (columnCount; columnCount < length; columnCount++) {
                if (columns[columnCount]) {
                    var headerTextAlign = columns[columnCount].headerTextAlign ? columns[columnCount].headerTextAlign
                                                           : (columns[columnCount].textAlign ? columns[columnCount].textAlign : ej.TextAlign.Left);
                    // set padding right 35px for displaying column menu icon
                    if (proxy.model.showColumnChooser)
                        $headerCell = ej.buildTag('th.e-headercell', "", { "height": "45px", "padding-right": "35px" }, {});
                    else
                        $headerCell = ej.buildTag('th.e-headercell', "", { "height": "45px" }, {});
                    bodyCell = doc.createElement('td');

                    $headerCellDiv = ej.buildTag(
                        'div.e-headercelldiv', columns[columnCount]["headerTemplateID"] ? columns[columnCount]["headerText"] = columns[columnCount]["field"] :
                        columns[columnCount]["headerText"] == undefined ?
                        columns[columnCount]["headerText"] = columns[columnCount]["field"] :
                        columns[columnCount]["headerText"],
                        { "text-align": headerTextAlign },
                        { 'ej-mappingname': columns[columnCount]["field"], 'unselectable': "on" }
                    );

                    $headerCell.append($headerCellDiv);
                    // Add column menu icon in header columns
                    if (proxy.model.showColumnChooser) {
                        $columnChooser = ej.buildTag('div.e-columnmenu-icon e-icon e-columnicon', "", { "cursor": "pointer" });
                        $columnChooser.data("isClicked", false);
                        $headerCell.append($columnChooser);
                    }
                    
                    col = doc.createElement('col');

                    $rowBody.append(bodyCell);
                    $columnHeader.append($headerCell);
                    $colGroup.append(col);


                    //CHECK VISIBLE PROPERTY OF THE COLUMN
                    if (columns[columnCount]["visible"] === false && columns[columnCount] != model.columns[model.treeColumnIndex]) {
                        $headerCell.addClass("e-hide") && $(col).css("display", "none") &&
                        proxy._hiddenColumns.push(columns[columnCount].headerText);

                    } else {
                        proxy._visibleColumns.push(columns[columnCount].headerText);
                        columns[columnCount]["visible"] = true;
                    }

                    if (columns[columnCount]["allowSorting"] === false) {
                        proxy._disabledSortableColumns.push(columns[columnCount].headerText);
                        $headerCell.css({ 'cursor': 'normal' });
                    }

                    if (!ej.isNullOrUndefined(columns[columnCount]["headerTemplateID"])) {
                        $headerCellDiv.html($(columns[columnCount]["headerTemplateID"]).hide().html()).parent().addClass("e-headertemplate");
                    }
                    if (columns[columnCount]["allowCellSelection"] == undefined) {
                        columns[columnCount]["allowCellSelection"] = true;
                    }
                    if (columns[columnCount]["width"] == undefined && model.commonWidth !== undefined) {
                        proxy.columnsWidthCollection.push(model.commonWidth);
                    } else {
                        proxy.columnsWidthCollection.push(parseFloat(columns[columnCount]["width"]));
                    }

                    proxy._fieldColumnNames[columns[columnCount].headerText] = columns[columnCount].field;
                    proxy._headerColumnNames[columns[columnCount].field] = columns[columnCount].headerText;
                }
            }
            //Updating the column properties to Gantt's model.columns also
            if (model.isFromGantt)
                proxy.updateToGanttColumns();

            /* add detail column to last*/
            if (model.showDetailsRow && model.detailsTemplate && model.showDetailsRowInfoColumn && showDetailColumn) {
                $columnHeader.append(ej.buildTag('th.e-headercell e-detailheadercell', '<div style="width:35px;"></div>', {}, {}));
                $colGroup.append(this._getIndentCol());
            }

            // Condition to check whether filtering enabled to render filter elements.
            if (this.model.allowFiltering && !proxy.model.isFromGantt) {
                $filterHeader = this._renderFiltering(columns, showDetailColumn);
            }            
            $thead.append($columnHeader);
            if ($filterHeader)
                $thead.append($filterHeader);
            $table.append($colGroup).append($thead);
            return $table;
        },

        //#endregion

        //#region TREEGRIDCONTENT RENDERING
        //TREEGRID CONTENT RENDER INITIALIZATION
        _initGridRender: function () {

            var proxy = this;
            proxy._addInitTemplate();
            proxy._renderGrid();

            //CHECK COLUMN RESIZE IS ENABLED OR NOT AND INITIALIZE THE RESIZER
            if (proxy.model.allowColumnResize) {
                proxy._resizer = new ej.gridFeatures.gridResize(proxy);
            }

        },
        //Create a summary row.
        _summaryRow: function () {
            var proxy = this, model = proxy.model;
            if (model.showSummaryRow)
                proxy._createSummaryRow();
            if (model.showTotalSummary) {
                proxy._createTotalSummaryRow();
                proxy._viewPortHeight = proxy._viewPortHeight - proxy._$totalSummaryRowContainer.height();
            }
        },


        //ADD GRIDCONTENT TO THE TREEGRID
        _renderGrid: function () {
            
            var proxy = this;
            proxy._renderGridContent().insertAfter(proxy.element.children(".e-gridheader"));
            

        },
        _renderFrozenSummary: function ()
        {
            this._$footerContainer.find("#e-frozenfooterdiv" + this._id + " .e-table colgroup").replaceWith(this._getMetaColGroup()[0]);
            this._$footerContainer.find("#e-movablefooterdiv" + this._id + " .e-table colgroup").replaceWith(this._getMetaColGroup()[1]);
            this._$footerContainer.find("#e-frozenfooterdiv" + this._id + " .e-table tbody").html($.render[this._id + "_JSONFrozenTemplate"](this._footerSummaryRecord));
            this._$footerContainer.find("#e-movablefooterdiv" + this._id + " .e-table tbody").html($.render[this._id + "_Template"](this._footerSummaryRecord));
        },

        _renderSummaryByFrozenDesign: function () {
            var $div = $(document.createElement('div')), col = this._getMetaColGroup().find("col"), colgroups = {};
            colgroups["colgroup1"] = $div.append(ej.buildTag("colgroup").append(col.splice(0, this._frozenColumnsLength))).html();
            colgroups["colgroup2"] = $div.html(ej.buildTag("colgroup").append(col)).html();
            if (!$.templates[this._id + "_FrozenSummaryTemplate"])
                this.addFrozenSummaryTemplate();
            return $.render[this._id + "_FrozenSummaryTemplate"](colgroups);
           
        },
        addFrozenSummaryTemplate: function () {
            var template = "<div class='e-frozenfooterdiv' id='e-frozenfooterdiv" + this._id +"'>"
            + "<table class='e-table' style='width:100%' cellspacing='0' id='" + this._id + "frozensummarye-table'>{{:colgroup1}}<tbody>"
            + "</tbody></table></div>"
            + "<div class='e-movablefooter' id='e-movablefooter" + this._id + "'><div class='e-movablefooterdiv' id='e-movablefooterdiv" + this._id + "'><table class='e-table' id='" + this._id + "movablesummarye-table' cellspacing='0'>{{:colgroup2}}<tbody>"
            + "</tbody></table></div></div>", templates = {};
            templates[this._id + "_FrozenSummaryTemplate"] = template;
            $.templates(templates);
        },

        //Add a total summary row after treegrid content.
        _createTotalSummaryRow: function () {
            var proxy = this, $summaryDiv, $table, model = proxy.model, flatRecords = model.flatRecords,
                summaryRows = model.summaryRows, summaryRowLength = summaryRows.length,
                updatedRecords = model.updatedRecords, parentRecords = model.parentRecords,
                columns = model.columns, $tbody = ej.buildTag('tbody');

            proxy._footerSummaryRecord = [];
            proxy._footerSummaryRows = [];
            $("#" + proxy._id + "-footersummaryrow").remove();
            $summaryDiv = ej.buildTag('div.e-footersummaryrowdiv#' + proxy._id + '-footersummaryrow', '',
                {
                    "overflow": "hidden",
                    "cursor": "default"
                });
            var $footerContainer = ej.buildTag('div.e-footercontainer#e-footercontainer' + proxy._id, '',
               {                                  
                   "overflow": "hidden"
               });

            if (model.showSummaryRow)
                proxy._flatChildRecords = $(model.updatedRecords).not(model.summaryRowRecords).get();
            else
                proxy._flatChildRecords = updatedRecords;

            for (var summaryRowIndex = 1; summaryRowIndex <= summaryRowLength; summaryRowIndex++) {
                var item = {}
                for (var columnLength = 0; columnLength < columns.length; columnLength++) {
                    item[columns[columnLength].field] = "";
                }
                item = proxy._createSummaryItem(item, summaryRows[summaryRowIndex - 1]);
                var record = proxy._createRecord(item, 0);
                record.footerSummaryRowRecord = true;
                record.index = summaryRowIndex;
                proxy._footerSummaryRecord.push(record);
                //GridRow = $.render[this._id + "_Template"](record);
                //proxy._footerSummaryRows.push(GridRow);
                //$tbody.append(GridRow);
            }
            proxy._$footerContainer = $footerContainer;
            if (this._frozenColumnsLength > 0) {
                $footerContainer.html(this._renderSummaryByFrozenDesign());
                this._renderFrozenSummary();
            } else {
                var $table = ej.buildTag('table.e-table#' + proxy._id + "summarye-table", "",
                { top: "0px" }, { 'cellspacing': '0px' });
                $table.append(proxy.getContentTable().find('colgroup').clone()).append($tbody);
                $tbody.html($.render[this._id + "_Template"](proxy._footerSummaryRecord));
                $footerContainer.append($table);
            }
            proxy._$totalSummaryRowContainer = $summaryDiv;
            proxy._$footertableContent = $footerContainer.find(".e-table");
            $summaryDiv.append($footerContainer);
            //Always display after TotalSummaryRow
            if (model.allowPaging) {
                proxy.element.append($("#" + this._id + "Pager").before($summaryDiv));
            }
            else
                proxy.element.append($summaryDiv);

            proxy._flatChildRecords = [];
            this._setWidthToFooters();
            if (this._$totalSummaryRowContainer.height() < 90) {
                if (proxy.isVScroll())
                    proxy._$totalSummaryRowContainer.addClass("e-scrollcss");
            }
            else {
                proxy._$totalSummaryRowContainer.ejScroller({ height: 90 });
            }
        },
        _getFooterRows: function ()
        {
            var gridFooterRows = $();
            if (this.model.showTotalSummary && this._$footertableContent) {
                gridFooterRows = this._$footertableContent.get(0).rows;
                if (this._frozenColumnsLength > 0)
                    gridFooterRows = [gridFooterRows, this._$footertableContent.get(1).rows];
            }
            return $(gridFooterRows);
        },
        //update footer container width for frozen columns
        _setWidthToFooters: function () {
            var width = this._gridWidth;
            if (this._frozenColumnsLength > 0) {
                var totalWidth = 0, frozenWidth;
                for (var i = 0; i < this.columnsWidthCollection.length; i++) {
                    totalWidth += this.columnsWidthCollection[i];
                    if (this._frozenColumnsLength - 1 == i)
                        frozenWidth = Math.ceil(totalWidth);
                }
                this._$totalSummaryRowContainer.find("#e-frozenfooterdiv" + this._id).width(width).next().css("margin-left", frozenWidth + "px");
                this._$totalSummaryRowContainer.find("#e-frozenfooterdiv" + this._id).outerWidth(frozenWidth)
                    .end().find("#e-movablefooterdiv" + this._id).css("width", "100%");
            }
        },
        _excludeSummaryRows: function () {

            var $gridRows = $(), model = this.model;
            if (this.getTreeGridRows() && this.getTreeGridRows().length > 0) {
                    if (this._frozenColumnsLength > 0)
                        $gridRows = [$(this.getTreeGridRows()[0]).not(".e-summaryrow"), $(this.getTreeGridRows()[1]).not(".e-summaryrow")];
                    else
                        $gridRows = $(this.getTreeGridRows()).not(".e-summaryrow");
            }
            return $gridRows;
        },

        //Add a summary row for every parent item in Tree grid.
        _createSummaryRow: function (args) {
            var proxy = this, model = proxy.model, parentRecords,
                recordIndex,
                item = {},
                docsummaryRow,
                totalChildRecordsLength,
                summaryRows = model.summaryRows,
                summaryRowLength = summaryRows.length,
                columns = model.columns;
            if (args && (args.requestType == "dragAndDrop" || args.requestType == "addNewRow" ||
                 args.requestType == "sorting")) {
                parentRecords = proxy._getParentRecords(model.updatedRecords, proxy);
                //Remove the summaryRow records from the childRecords collection of parentRecords
                if (args.requestType == "dragAndDrop") {
                    for (var i = 0; i < parentRecords.length; i++) {
                        var nonSummaryRowChildRecords = [];
                        nonSummaryRowChildRecords = parentRecords[i].childRecords.filter(function (data) {
                            if (!data.isSummaryRow)
                                return true;

                        });
                        parentRecords[i].childRecords = nonSummaryRowChildRecords.slice();
                    }
                }
            }
            else
                parentRecords = proxy._parentRecords;
            var length = parentRecords.length;
            if (args && ej.isNullOrUndefined(args.filterCollection))
                args.filterCollection = [];
            if (model.enableCollapseAll && model.enableVirtualization && !args)
                model.updatedRecords = model.flatRecords.slice();
            model.updatedRecords = $(model.updatedRecords).not(model.summaryRowRecords).get();
            model.flatRecords = $(model.flatRecords).not(model.summaryRowRecords).get();
            model.summaryRowRecords = [];
            //$(proxy.element).find(".e-summaryrow").remove();                       
            //this._$gridRows = proxy._excludeSummaryRows();
            proxy._flatChildRecords = [];
            for (var parentIndex = 0; parentIndex < length; parentIndex++) {
                parentRecord = parentRecords[parentIndex];
                totalChildRecordsLength = proxy._getChildRecordsLength(parentRecord, model.updatedRecords);              
                if (totalChildRecordsLength == 0)
                    continue;
                for (var summaryRowIndex = 1; summaryRowIndex <= summaryRowLength; summaryRowIndex++) {
                    for (var columnLength = 0; columnLength < columns.length; columnLength++) {
                        item[columns[columnLength].field] = "";
                    }
                    item = proxy._createSummaryItem(item, summaryRows[summaryRowIndex - 1], parentRecord);
                    var currentIndex = model.updatedRecords.indexOf(parentRecord) + totalChildRecordsLength + summaryRowIndex,
                        summaryRecord = proxy._createRecord(item, currentIndex);
                    proxy._isSummaryRow = true;
                    summaryRecord.level = parentRecord.level + 1;
                    summaryRecord.parentItem = parentRecord;
                    summaryRecord.isSummaryRow = true;
                    summaryRecord.index = model.flatRecords.length + 1;
                    if (model.enableVirtualization) {                        
                            model.updatedRecords.splice(currentIndex, 0, summaryRecord);
                            if (!args || (args && args.filterCollection))
                                model.summaryRowRecords.push(model.updatedRecords[currentIndex]);
                    }
                    else {
                        model.updatedRecords.splice(currentIndex, 0, summaryRecord);
                        model.summaryRowRecords.push(model.updatedRecords[currentIndex]);
                    }
                    currentIndex = model.flatRecords.indexOf(parentRecord) + totalChildRecordsLength + summaryRowIndex;
                    model.flatRecords.splice(currentIndex, 0, summaryRecord);
                    parentRecord.childRecords.push(summaryRecord);
                    item = {};
                    if (summaryRowIndex == summaryRowLength) {
                        summaryRecord.isLastSummary = true;
                    }
                }
                proxy._flatChildRecords = [];
            }
            proxy._isSummaryRow = false;
            proxy._summaryRowsCount = parentRecords.length;
            this._updateCurrentViewData();
        },
        //Get all inner parent records for Virtualization is true
        _getInnerParentRecords: function (records, proxy, parentRecords) {
            var recordLength = records.childRecords.length;

            for (var count = 0; count < records.childRecords.length; count++) {
                
                if (records.childRecords[count].hasChildRecords) {
                    if (parentRecords.indexOf(records.childRecords[count]) == -1)
                        parentRecords.push(records.childRecords[count]);
                    proxy._getInnerParentRecords(records.childRecords[count], proxy, parentRecords);
                }
            }           
        },

        //Get all parent records from updated records.
        _getParentRecords: function (updatedRecords, proxy, rootParent) {
            var recordLength = updatedRecords.length, record, parentRecords = [];
            for (var length = 0; length < recordLength; length++) {
                record = updatedRecords[length]
                if (rootParent) {
                    if (ej.isNullOrUndefined(record.parentItem))
                        parentRecords.push(record);
                }
                else if (record.childRecords && record.childRecords.length > 0) {
                    if ((proxy.model.enableVirtualization) || (proxy.model.allowPaging && proxy.model.showSummaryRow)) {
                        if (parentRecords.indexOf(record) == -1)
                            parentRecords.push(record);
                        proxy._getInnerParentRecords(record, proxy, parentRecords);
                    }
                    else
                        parentRecords.push(record);
                }
            }
            return parentRecords;
        },
        //To get all child and grand child of one parent record when the datasource is in hierarchy form.
        _getChildRecordsLength: function (parentRecord, updatedRecords) {
            var proxy = this,
                recordLength = updatedRecords.length, record;
            for (var length = 0; length < recordLength; length++) {
                record = updatedRecords[length];
                if (record.summaryRow)
                    continue;
                if (parentRecord == record.parentItem) {
                    proxy._flatChildRecords.push(record);
                    if (record.hasChildRecords)
                        proxy._getChildRecordsLength(record, updatedRecords);
                }
            }
            return proxy._flatChildRecords.length;
        },

        //Assign the values for item properties to create a summary record.
        _createSummaryItem: function (item, targetSummaryRow, parentRecord) {
            var proxy = this,
                summaryColumns = targetSummaryRow.summaryColumns,
                summaryColumnsLength = summaryColumns.length;
            for (var columnLength = 0; columnLength < summaryColumnsLength; columnLength++) {
                var targetSummaryColumn = summaryColumns[columnLength],
                    prefix = targetSummaryColumn.prefix,
                    suffix = targetSummaryColumn.suffix,
                    displayColumn = targetSummaryColumn.displayColumn;

                if (ej.isNullOrUndefined(displayColumn))
                    displayColumn = targetSummaryColumn.dataMember;
                if (ej.isNullOrUndefined(prefix))
                    prefix = "";
                if (ej.isNullOrUndefined(suffix))
                    suffix = "";
                item.summaryColumn = targetSummaryColumn;
                item.summaryRow = targetSummaryRow;

                for (var key in item) {
                    if (key == displayColumn) {
                        if (item[key])
                            item[key] = item[key] + " " + prefix + proxy._getSummaryValues(targetSummaryColumn, proxy._flatChildRecords) + suffix;
                        else
                            item[key] = prefix + proxy._getSummaryValues(targetSummaryColumn, proxy._flatChildRecords) + suffix;
                    }
                }
            }
            return item;
        },

        //Calculate the summary values.
        _getSummaryValues: function (summaryColumn, summaryData) {
            var dataMember = summaryColumn.dataMember, format = summaryColumn.format,
                jsonData = summaryData;
            var dbMgr, $value;
            if (jsonData instanceof ej.DataManager) {
                dbMgr = jsonData;
                jsonData = jsonData.dataSource.json;
            } else
                dbMgr = ej.DataManager(jsonData);
            switch (summaryColumn.summaryType) {
                case ej.TreeGrid.SummaryType.Sum:
                    $value = ej.sum(jsonData, dataMember);
                    break;
                case ej.TreeGrid.SummaryType.Average:
                    $value = ej.avg(jsonData, dataMember);
                    break;
                case ej.TreeGrid.SummaryType.Maximum:
                    var obj = ej.max(jsonData, dataMember);
                    $value = parseInt(obj[summaryColumn.dataMember]);
                    break;
                case ej.TreeGrid.SummaryType.Minimum:
					var filteringData = jsonData.filter(function (data) {
                        if (data[dataMember] !== "")
                            return true;
                    });
                    var obj = ej.min(filteringData, dataMember);
                    $value = parseInt(obj[summaryColumn.dataMember]);
                    break;
                case ej.TreeGrid.SummaryType.MaximumDate:
                    $value = this._getMaxDate(jsonData, dataMember);
                    break;
                case ej.TreeGrid.SummaryType.MinimumDate:
                    $value = this._getMinDate(jsonData, dataMember);
                    break;
                case ej.TreeGrid.SummaryType.Count:
                    $value = jsonData.length;
                    break;
                case ej.TreeGrid.SummaryType.TrueCount:
                    var predicate = ej.Predicate(summaryColumn.dataMember, "equal", true);
                    $value = dbMgr.executeLocal(ej.Query().where(predicate)).length;
                    break;
                case ej.TreeGrid.SummaryType.FalseCount:
                    var predicate = ej.Predicate(summaryColumn.dataMember, "equal", false);
                    $value = dbMgr.executeLocal(ej.Query().where(predicate)).length;
                    break;
            }
            if (!ej.isNullOrUndefined(format))
                $value = this.formatting(format, $value, this.model.locale);
            return $value;
        },
        // To Get Maximum Date of Particular Datamember in JSON data.
        _getMaxDate: function (jsonData, dataMember) {
            var max = 0;
            var maxDate = null;
            for (var i = 0; i < jsonData.length; i++) {
                var item = jsonData[i],
                    date = new Date(item[dataMember]),
                    time = date.getTime();
                if (time > max) {
                    max = time;
                    maxDate = item[dataMember];
                }
            }

            return maxDate;
        },
        // To Get Minimum Date of Particular Datamember in JSON data.
        _getMinDate: function (jsonData, dataMember) {
            var firstMinDate = new Date(jsonData[0][dataMember]),
                min = firstMinDate.getTime();
            var minDate = jsonData[0][dataMember];
            for (var i = 0; i < jsonData.length; i++) {
                var item = jsonData[i],
                    date = new Date(item[dataMember]),
                    time = date.getTime();
                if (time < min) {
                    min = time;
                    minDate = item[dataMember];
                }
            }

            return minDate;
        },
        /*Create new summary records and re render all records*/
        _createAndRenderSummaryRecords: function (args)
        {
            var proxy = this;
            proxy._createSummaryRow(args);
            var refreshArgs = {};
            refreshArgs.requestType = ej.TreeGrid.Actions.Refresh;
            proxy.sendDataRenderingRequest(refreshArgs);
            proxy.updateCollapsedRecordCount();
            proxy.updateHeight();
        },
        //Update the summary after add, edit or delete the record.
        _updateSummaryRow: function (args) {
            var proxy = this, model = proxy.model, summaryRow,
                editedRecord, editedRecordIndex, updatedSummaryRecords = [],
                _pRecords = [],cellvalue;
            if (args && args.requestType == "dragAndDrop") {
                args.rowIndex = model.updatedRecords.indexOf(proxy._droppedRecord);
            }
            if (args && args.requestType == "delete") {
                proxy._updateAfterDeleteRecord(args);
                return;
            }

            if (args && args.editType == "celledit") {
                if (args.columnObject.editType == "numericedit") {
                    cellvalue = parseInt(args.value);
					args.value = isNaN(cellvalue) ? "" : cellvalue;
                    args.data[args.columnName] = args.value;
                }
                args.currentValue = args.value;
                var rowIndex = proxy.getIndexByRow(args.rowElement);
                var data = model.enableVirtualization ? model.currentViewData[rowIndex] : model.updatedRecords[rowIndex];
                args.rowIndex = model.updatedRecords.indexOf(data);
            }
            if ((args.currentValue != args.previousValue) || args.requestType == "dragAndDrop"
                || args.requestType == "addNewRow") {
                editedRecord = model.updatedRecords[args.rowIndex];
                if (editedRecord.parentItem)
                    _pRecords = proxy._getpRecords(editedRecord, proxy);
                if (ej.isNullOrUndefined(_pRecords))
                    return;
                for (var parentLength = 0; parentLength < _pRecords.length; parentLength++) {
                    var summaryRowRecords = model.summaryRowRecords;
                    proxy._getChildRecordsLength(_pRecords[parentLength], model.updatedRecords);
                    $.each(summaryRowRecords, function (index, record) {
                        summaryRow = record.summaryRow;
                        if (record.parentItem === _pRecords[parentLength]) {
                            var summaryColumnLength = summaryRow.summaryColumns.length;
                            for (var length = 0; length < summaryColumnLength; length++) {
                                var summaryColumn = summaryRow.summaryColumns[length],
                                    prefix = summaryColumn.prefix,
                                    suffix = summaryColumn.suffix;
                                if (ej.isNullOrUndefined(prefix))
                                    prefix = "";
                                if (ej.isNullOrUndefined(suffix))
                                    suffix = "";
                                if (args.editType == "rowedit") {
                                    args.columnName = summaryColumn.dataMember;
                                        var columnList = model.columns,
                                            dataMemberColumnIndex = proxy.getColumnIndexByField(args.columnName);
                                    //To convert empty string to integer while adding the new row.    
                                        if (model.columns[dataMemberColumnIndex].editType == "numericedit")
                                            editedRecord[args.columnName] = parseInt(editedRecord[args.columnName]);                                   
                                }
                                var displayColumn = summaryColumn.displayColumn;
                                if (!displayColumn)
                                    displayColumn = summaryColumn.dataMember;
                                if (model.enableVirtualization)
                                    recordindex = model.currentViewData.indexOf(record);
                                else
                                    recordindex = model.updatedRecords.indexOf(record);
                                columnIndex = proxy.getColumnIndexByField(displayColumn);
                                args.data = record;

                                if (proxy._frozenColumnsLength > 0) {
                                    if (proxy._frozenColumnsLength > columnIndex)
                                        args.rowElement = $(proxy.getRows()[0][recordindex]);
                                    else {
                                        args.rowElement = $(proxy.getRows()[1][recordindex]);
                                        columnIndex -= proxy._frozenColumnsLength;
                                    }
                                } else {
                                    args.rowElement = $(proxy.getRows()[recordindex]);
                                }
                                args.cellElement = args.rowElement.find(".e-rowcell").eq(columnIndex);

                                value = proxy._getSummaryValues(summaryColumn, proxy._flatChildRecords);
                                record[displayColumn] = prefix + value + suffix;
                                args.cellElement.empty().html(prefix + value + suffix);
                                updatedSummaryRecords.push(record);
                            }
                        }
                    })
                    proxy._flatChildRecords = [];
                    proxy._summaryRowCount = _pRecords.length;
                }
            }
        },
        //Update the Total summary after add, edit or delete the record.
        _updateTotalSummaryRow: function (args) {
            if (args.requestType == "dragAndDrop" || args.isDragAndDropDelete)
                return;
            var proxy = this, model = proxy.model, summaryRows = model.summaryRows, summaryColumns, 
                summaryColumnsLength, record, summaryRowLength = summaryRows.length;
            if (model.updatedRecords.length == 0) {
                $("#" + proxy._id + "-footersummaryrow").hide();
                return;
            }
            else
                $("#" + proxy._id + "-footersummaryrow").show();
            for (var length = 0; length < summaryRowLength; length++) {
                summaryRow = summaryRows[length];
                summaryColumns = summaryRow.summaryColumns;
                summaryColumnsLength = summaryColumns.length;
                record = proxy._footerSummaryRecord[length];
                for (var columnLength = 0; columnLength < summaryColumnsLength; columnLength++) {
                    var summaryColumn = summaryColumns[columnLength],
                        prefix = summaryColumn.prefix,
                        suffix = summaryColumn.suffix;
                    if (ej.isNullOrUndefined(prefix))
                        prefix = "";
                    if (ej.isNullOrUndefined(suffix))
                        suffix = "";
                    if (args.editType == "rowedit")
                        args.columnName = summaryColumn.dataMember;
                    if (!displayColumn)
                        displayColumn = summaryColumn.dataMember;
                    if (summaryColumn.dataMember == args.columnName || args.requestType == "delete"
                        || args.requestType == "filtering" || args.requestType == "addNewRow") {
                        var displayColumn = summaryColumn.displayColumn,
                            recordindex = proxy._footerSummaryRecord.indexOf(record),
                            columnIndex = proxy.getColumnIndexByField(displayColumn);
                        args.data = record;
                        if (this._frozenColumnsLength > 0) {
                            if (this._frozenColumnsLength > columnIndex)
                                args.rowElement = this._getFooterRows()[0][recordindex];
                            else {
                                args.rowElement = this._getFooterRows()[1][recordindex];
                                columnIndex -= this._frozenColumnsLength;
                            }
                        } else {
                            args.rowElement = this._getFooterRows()[recordindex];
                        }
                        args.cellElement = args.rowElement.childNodes[columnIndex];
                        var footerUpdatedRecords = $(model.updatedRecords).not(model.summaryRowRecords).get();
                        value = proxy._getSummaryValues(summaryColumn, footerUpdatedRecords);
                        record[displayColumn] = prefix + value + suffix;
                        args.cellElement.innerHTML = prefix + value + suffix;
                    }
                }
            }
        },
        //Update summary row after deleted the record.
        _updateAfterDeleteRecord: function (args) {
            var proxy = this, model = proxy.model, summaryRow,
                editedRecord, editedRecordIndex, updatedSummaryRecords = [],
                _pRecords;
            deletedRecord = args.data;
            if (deletedRecord.parentItem)
                _pRecords = proxy._getpRecords(deletedRecord, proxy);
            if (ej.isNullOrUndefined(_pRecords))
                return;
            for (var parentLength = 0; parentLength < _pRecords.length; parentLength++) {
                var summaryRowRecords = model.summaryRowRecords,
                    childRecords = _pRecords[parentLength].childRecords;
                if (childRecords.length == 0)
                    continue;
                proxy._getChildRecordsLength(_pRecords[parentLength], model.updatedRecords);
                $.each(summaryRowRecords, function (index, record) {
                    summaryRow = record.summaryRow;
                    if (record.parentItem === _pRecords[parentLength]) {
                        var summaryColumnLength = summaryRow.summaryColumns.length;
                        for (var length = 0; length < summaryColumnLength; length++) {
                            var summaryColumn = summaryRow.summaryColumns[length],
                                displayColumn = summaryColumn.displayColumn,
                                recordindex = model.updatedRecords.indexOf(record),
                                columnIndex = proxy.getColumnIndexByField(displayColumn),
                                 prefix = summaryColumn.prefix,
                                 suffix = summaryColumn.suffix;
                            if (ej.isNullOrUndefined(prefix))
                                prefix = "";
                            if (ej.isNullOrUndefined(suffix))
                                suffix = "";
                            args.data = record;
                            if (proxy._frozenColumnsLength > 0) {
                                if (proxy._frozenColumnsLength > columnIndex)
                                    args.tr = $(proxy.getRows()[0][recordindex]);
                                else {
                                    args.tr = $(proxy.getRows()[1][recordindex]);
                                    columnIndex -= proxy._frozenColumnsLength;
                                }
                            } else {
                                args.tr = $(proxy.getRows()[recordindex]);
                            }
                            args.tr = $(proxy.getRows()[recordindex]);
                            args.cellElement = args.tr.find(".e-rowcell").eq(columnIndex);
                            value = proxy._getSummaryValues(summaryColumn, proxy._flatChildRecords);
                            record[displayColumn] = prefix + value + suffix;
                            args.cellElement.empty().html(prefix + value + suffix);
                        }
                        updatedSummaryRecords.push(record);
                    }

                })
                proxy._flatChildRecords = [];
            }
        },
        //To get parent and grand Parent of one Child record.
        _getpRecords: function (record, proxy) {
            var recordParents = [];
            do {
                record = record.parentItem;
                recordParents.push(record);
            } while (record.parentItem);
            return recordParents;
        },

        //RENDER THE GRIDCONTENT
        _renderGridContent:function(){
            
            var proxy = this,
                doc = document,
                model = proxy.model,
                $tbody = $(doc.createElement('tbody')),
                $div = ej.buildTag("div.e-gridcontent#" + proxy._id + "e-gridcontent", "",
                {                    
                    "height": proxy._viewPortHeight
                }),
                $innderDiv = ej.buildTag('div.e-gridcontainer#' + proxy._id + "e-gridcontainer", "", {}, {});
                //Insert e-contet div for ejScroller
                $scrolllerContentDiv = ej.buildTag('div', {}, { "width": "auto", "height": "auto" });
                $scrolllerContentDiv.append($innderDiv);
            //CHECK VIRTUALIZATION ENABLED OR NOT
            if (model.enableVirtualization || model.allowPaging) {
                $innderDiv.css({ 'height': proxy._totalHeight });
            }

            if (this._frozenColumnsLength > 0) {
                $innderDiv.html(proxy._renderByFrozenDesign());
                proxy.setGridContentTable($innderDiv.find(".e-table"));

            }
            else {
                var $table = ej.buildTag('table.e-table#' + proxy._id + "e-table", "",
                    { top: "0px", "position": "relative" }, { 'cellspacing': '0px' });
                $table.append(proxy.getHeaderTable().find('colgroup').clone()).append($tbody);
                $innderDiv.html($table);
                proxy.setGridContentTable($table);
            }
            $div.html($scrolllerContentDiv);
            proxy._$gridContent = $div;
            //CHECK DATASOURCE IS DEFINED OR NOT
            if (this.dataSource() === null || this.model.currentViewData.length == 0) {
                if (this._frozenColumnsLength > 0) {
                    var $emptyTd = ej.buildTag('td', model.emptyRecordText, {}, { colSpan: this._frozenColumns.length });
                    $innderDiv.find("#e-frozencontentdiv" + proxy._id + " .e-table tbody").append($(doc.createElement("tr")).append($emptyTd));
                    $emptyTd = ej.buildTag('td', model.emptyRecordText, { visibility: "hidden" }, { colSpan: this._unFrozenColumns.length });
                    $innderDiv.find("#e-movablecontentdiv" + proxy._id + " .e-table tbody").append($(doc.createElement("tr")).append($emptyTd));
                } else {
                    var $emptyTd = ej.buildTag('td', model.emptyRecordText, {}, { colSpan: model.columns.length });
                    $tbody.append($(doc.createElement("tr")).append($emptyTd));
                    $innderDiv.css('height', model.rowHeight);
                }
            } else
            {
                proxy.renderRecords();
            }

            if (!model.isFromGantt) {
                $div.css({
                    "border-bottom-style": "solid",
                    "border-bottom-width": "1px",
                    "border-left-style": "solid",
                    "border-left-width": "1px",
                    "border-right-style": "solid",
                    "border-right-width": "1px",
                    "width": "auto",
                    "height": "auto",
                    "cursor": "default"
                });
            } else {
                $div.css({
                    "border-left-style": "solid",
                    "border-left-width": "1px"
                });
            }
            return $div;

        },


        //AFTER INITIALIZATION END RENDERING
        _initialEndRendering: function () {

            var proxy = this, model = proxy.model, currentSelectingRecord,
                expandedRecords = proxy.getExpandedRecords(model.updatedRecords),
                index = proxy.selectedRowIndex(), cellIndexes = proxy.selectedCellIndexes();

            if (model.allowSelection) {
                if (model.selectionMode == "row" && index != -1 && !model.isFromGantt) {
                if (model.showSummaryRow) {
                    var recordsWithOutSummary = $(model.updatedRecords).not(model.summaryRowRecords).get(),
                        currentSelectedRecord = recordsWithOutSummary[index];
                    index = model.updatedRecords.indexOf(currentSelectedRecord);                    
                }
                if (!proxy._rowSelectingEventTrigger(this._previousIndex, index)) {
                    proxy.selectRows(index);
                    proxy._cancelSaveTools();
                    proxy._rowSelectedEventTrigger(index);

                }
            }
                if (model.selectionMode == "cell" && cellIndexes.length > 0) {
                    proxy.selectedRowIndex(-1);
                    proxy.selectCells(cellIndexes);
                    proxy._cancelSaveTools();
                }
                }

            /* treegrid rendering completed here at load time*/
            proxy._isRendered = true;

            proxy._trigger("refresh");
            proxy._eventBindings();
            proxy._hideCollapsedDetailsRows();
        },

        //#endregion
        
        //#region TEMPLATE

        //ADD CELLEDITING TEMPLATE
        _addCellEditTemplate: function () {

            var proxy = this,
                model = proxy.model,
                columns = model.columns,
                columnCount = 0,
                $outerDiv = ej.buildTag('div', "", { display: 'none' }, { id: proxy._id + "_CellEditTemplate" }),
                $innerDiv,
                length =columns&& columns.length;

            for (columnCount = 0; columnCount < length; columnCount++) {
                if (columns[columnCount]) {
                    $innerDiv = ej.buildTag('div', "", {}, { id: columns[columnCount].field + "_CellEdit" });
                    ej.TreeGrid._initCellEditType(proxy, $innerDiv, proxy._id, columnCount);
                    $outerDiv.append($innerDiv);
                }
            }

            if ($outerDiv.children().length) {
                proxy._cellEditTemplate = $outerDiv;
            }

        },

        _getState: function () {
            if (this.data.parentItem)
                return false;
            else
                return true;
        },

        _getSelectedCellClass: function (data, columnCount) {
            var proxy = this, model = proxy.model,
                columnIndex = parseInt(columnCount),
                selectedCellDetails = proxy._selectedCellDetails;
            if (model.selectionMode == "cell" && selectedCellDetails.length > 0) {
                if (proxy._currentRecordIndex != data.index)
                    proxy._getSelectedCellsinARow(data.index, selectedCellDetails);
                if (proxy._selectedCellsinARow.length > 0) {
                    var currentSelectingCellIndex = proxy._selectedCellsinARow.map(function (e) { return e.cellIndex }).indexOf(columnIndex);
                    if (currentSelectingCellIndex != -1) {
                        if (proxy._selectedCellsinARow[currentSelectingCellIndex].cellIndex == columnIndex)
                            return "selectingcell";
                    }
                }
            }
            return "";
        },

        _getSelectedCellsinARow: function (recordIndex, selectedCellDetails) {
            var proxy = this;
            proxy._selectedCellsinARow = [];
            selectedCellDetails.forEach(function (selectedcell) {
                if (selectedcell.data.index == recordIndex)
                    proxy._selectedCellsinARow.push(selectedcell);
            })
            proxy._currentRecordIndex = recordIndex;
        },
        _getrowName: function () {
            var rowClass = "gridrowIndex",
                proxy = this;
            rowClass += proxy.data.index.toString() + "level" + proxy.data.level.toString();
            return rowClass;
        },
        /* get details row col span with showDetailROwInfoColumn API value */
        _getDetailsColSpan:function(isFrozenTable)
        {
            var model = this.model, visibleColumns = [];
            if (this._frozenColumnsLength > 0) {
                if (!isFrozenTable) {
                    visibleColumns = this._unFrozenColumns.filter(function (value) {
                        return value.visible !== false;
                    });
                    return visibleColumns.length;
                } else {
                    visibleColumns = this._frozenColumns.filter(function (value) {
                        return value.visible !== false;
                    });
                    return visibleColumns.length;
                }
            }
            return model.showDetailsRowInfoColumn ? this._visibleColumns.length + 1 : this._visibleColumns.length;
        },
        /* expand status for details rows */
        _getDetailsExpandStatus: function (data) {
            var proxy = this;
            if (proxy.getExpandStatus(data) && data.isDetailsExpanded) {
                return true;
            } else
            {
                return false;
            }
        },
        _createDetailsRowTemplate: function (isFrozenTable) {
            var proxy = this,
                model = this.model,
                helpers = {};

            helpers["_" + proxy._id + "getDetailsColSpan"] = $.proxy(proxy._getDetailsColSpan, proxy);
            helpers["_" + proxy._id + "getDetailsExpandStatus"] = $.proxy(proxy._getDetailsExpandStatus, proxy);
            helpers["_" + proxy._id + "getExpandStatus"] = $.proxy(proxy.getExpandStatus, proxy);
            
            $.views.helpers(helpers);

            var tr = '{{if !isSummaryRow && !footerSummaryRowRecord}}' + "<tr class='e-detailsrow e-treegridrows detailsrow{{:~_" + proxy._id + "rowClassName()}} {{if isDetailsExpanded}}" +
                      "e-detailsrowexpanded{{else}}e-detailsrowcollapsed{{/if}}{{if !~_" + proxy._id + "getExpandStatus(#data) && isDetailsExpanded}} collapsedrowexpandeddetailsrow{{/if}}' " +
                      "style='{{if ~_" + proxy._id + "getDetailsExpandStatus(#data)}}display:table-row;{{else}}visibility:none;{{/if}}height:" + model.detailsRowHeight + "px;'>" +
                      "<td class='e-detailsrowcell' colspan='{{:~_" + proxy._id + "getDetailsColSpan(" + isFrozenTable + ")}}'>" +
                      "<div class='e-detailscellwrapper' style='height:" + (model.detailsRowHeight - 1) + "px;'>";

            var templateString = "";
            if (model.detailsTemplate && model.detailsTemplate.length > 0) {

                if (document.getElementById(model.detailsTemplate))
                {
                    templateString = $("#" + model.detailsTemplate)[0].innerHTML;
                } else
                {
                    templateString = model.detailsTemplate;
                }
            }
            if (!isFrozenTable) {
                $("#treeGridDetailsRowTemplateElement" + proxy._id).remove();
                var scriptElement = this._createDetailRowTemplateElement(templateString);
                tr += "{{:~_treeGridTemplating('" + scriptElement.id + "')}}";
            }
            tr += "</div></td></tr>";
            tr += "{{/if}}";
            if (!isFrozenTable) {
                var templates = {};
                templates[proxy._id + "_detailRowTemplate"] = tr;
                $.templates(templates);
            }
            return tr;

        },

        _SelectState:function(args){
            var proxy = this,
                model = this.model;
            if (model.allowSelection)
                return true;
            else
                return false;
        },
        //ADD TEMPLATE FOR RENDERING GRIDCONTENT
        _addInitTemplate:function(){

            var proxy = this,
                model = proxy.model,
                columns = model.columns,
                columnCount = 0,
                length = columns.length,
                columnName,
                column,
                tdCell,
                summaryTitle,
                helpers = {};

            //CHECK THE COLUMNS ARRAY CONTAIN THE COLUMN OBJECT
            if (columns.length === 0) {
                return false;
            }
            if (this._frozenColumnsLength > 0) {
                this.addFrozenTemplate();
                if (model.showTotalSummary)
                    this.addFrozenSummaryTemplate();
            }
            helpers["_" + proxy._id + "rowClassName"] = ej.TreeGrid._getrowClassName;
            helpers["_" + proxy._id + "SummaryRowtdClassName"] = ej.TreeGrid._getSummaryRowtdClassName;
            helpers["_" + proxy._id + "isSelectedCell"] = $.proxy(proxy._getSelectedCellClass, proxy);
            helpers["_" + proxy._id + "summaryTitle"] = proxy._getSummaryTitle;
            // helpers for drag row indicator icon class
            helpers["_" + proxy._id + "rowName"] = proxy._getrowName;
            helpers["getState"] = proxy._getState;
            helpers["SelectState"] = $.proxy(proxy._SelectState, proxy);
            helpers["_" + proxy._id + "expandStatus"] = $.proxy(proxy._getExpandStatusRecord, proxy);         
            helpers["_" + proxy._id + "cellValue"] = proxy._getCellValue;
            helpers["_" + proxy._id + "TemplateCellValue"] = $.proxy(proxy._getTemplateCellValue, proxy);
            helpers["_" + proxy._id + "isTreeColumnIndex"] = $.proxy(proxy._isTreeColumnIndex, proxy);
            helpers["_" + proxy._id + "getIndentWidth"] = $.proxy(proxy._getIndentWidth, proxy);
            helpers["_" + proxy._id + "checkColumn"] = $.proxy(proxy._getCellColumn, proxy);
            helpers["_" + proxy._id + "formatting"] = $.proxy(proxy.formatting, proxy);
            helpers["_treeGridTemplating"] = ej.proxy(proxy._gridTemplate, null, proxy);

            $.views.helpers(helpers);

            
            if (model.rowTemplateID.length > 0 || model.altRowTemplateID.length > 0) {
                
                var altRowTemplateElement = ej.buildTag("tbody", "", {}, {});
                var rowTemplateElement = ej.buildTag("tbody", "", {}, {});
                var rowTemplateHTML = "";
                var altRowTemplateHTML = "";


                var altRowTemplate = model.altRowTemplateID.length > 0 ? $("#" + model.altRowTemplateID)[0].innerHTML : $("#" + model.rowTemplateID)[0].innerHTML;
                var rowTemplate = model.rowTemplateID.length > 0 ? $("#" + model.rowTemplateID)[0].innerHTML : $("#" + model.altRowTemplateID)[0].innerHTML;

                $(altRowTemplateElement[0]).html(altRowTemplate);
                $(rowTemplateElement[0]).html(rowTemplate);

                if (rowTemplateElement[0].childNodes.length > 0) {
                    for (var i = 0; i < rowTemplateElement[0].childNodes.length; i++) {
                        if (rowTemplateElement[0].childNodes[i].nodeName == 'TR') {

                            rowTemplateElement[0].className = rowTemplateElement[0].childNodes[i].className;
                            rowTemplateElement[0].style.cssText = rowTemplateElement[0].childNodes[i].style.cssText;

                            if (rowTemplateElement[0].childNodes[i].childNodes.length > 0) {
                                var tdCount = 0;
                                for (var j = 0; j < rowTemplateElement[0].childNodes[i].childNodes.length; j++) {

                                    var childNode = rowTemplateElement[0].childNodes[i].childNodes[j];

                                    if (childNode.nodeName == 'TD') {
                                        var innerHtml = childNode.innerHTML,
                                            templateId = proxy._id + "RowTemplateElement" + tdCount;

                                        $("#" + templateId).remove();
                                        var scriptElement = this._createRowTemplateElement(innerHtml, templateId);
                                        childNode.innerHTML = "{{:~_treeGridTemplating('" + scriptElement.id + "')}}";
                                        childNode.className += " e-rowcell e-templatecell";


                                        if (columns[tdCount]) {
                                            column = columns[tdCount];
                                            columnName = column.field;
                                            var visible = column.visible == undefined ? true : column.visible;
                                            //To create a seperate div in summary cell to display a summary title.
                                            var summaryTitlediv = "";
                                            if (column.headerText == proxy._visibleColumns[0]) {
                                                summaryTitlediv = '{{if isSummaryRow || footerSummaryRowRecord}}' + "<div " +
                                                    "class='e-summarytitle{{if isLastSummary}} e-lastsummaryrow{{/if}}'" + "style='float:left;display:block;'>" + "{{:~_" + proxy._id + "summaryTitle()}}"
                                                     + "</div>" + '{{/if}}';
                                            }

                                            if (tdCount == model.treeColumnIndex) {
                                                var indentDiv = "<div class='e-inner-treecolumn-container' style='height:20px;' unselectable='on'>" +
                                                "<div class='intend' style='height:1px; float:left;width:{{:~_" + proxy._id + "getIndentWidth(#data)}}; display:inline-block;'>" +
                                                 //indicator icons included for drag and drop
                                                "{{if !~getState() || !hasChildRecords }}" +
                                                "<div class={{:~_" + proxy._id + "rowName()}} >" +
                                                "<span class='aboveIcon e-icon'  style='position:relative;float:right;display:none;'></span>" +
                                                "<span class='belowIcon e-icon' style='position:relative;float:right;display:none;'></span>" +
                                                "<span class='childIcon e-icon' style='position:relative;float:right;display:none;'></span>" +
                                                "<span class='cancelIcon e-icon' style='position:relative;float:right;display:none;'></span>" +
                                                "</div>" +
                                                "{{/if}}" +
                                                "</div>" +
                                                "{{if ~getState() && hasChildRecords}}" +
                                                "<div class='intendparent'>" +
                                                "<div class={{:~_" + proxy._id + "rowName()}} >" +
                                                "<span class='aboveIcon e-icon'  style='position:relative;float:left;display:none;'></span>" +
                                                "<span class='belowIcon e-icon' style='float:left;display:none;'></span>" +
                                                "<span class='childIcon e-icon' style='float:left;display:none;'></span>" +
                                                "<span class='cancelIcon e-icon' style='float:left;display:none;'></span>" +
                                                "</div>" +
                                                "</div>" +
                                                "{{/if}}" +
                                                "<div class='{{if expanded && hasFilteredChildRecords}}e-treegridexpand e-icon{{else hasChildRecords && hasFilteredChildRecords}}e-treegridcollapse e-icon{{/if}}' " +
                                                "style='height:20px;width:30px;margin:auto;float:left;margin-left:10px;display:inline-block;'>" +
                                                "</div>" +
                                                "<div class='e-cell' style='display:inline-block;width:100%'>";

                                                rowTemplateHTML += "<td class='" + childNode.className + "{{if isSummaryRow || footerSummaryRowRecord}} e-summaryrowcell{{/if}}{{if isSelected && ~SelectState()}} e-selectionbackground{{/if}} {{:~_" + proxy._id + "isSelectedCell(#data,'" + columnCount + "')}} {{if " + !visible + "}} e-hide{{/if}}{{if isLastSummary}} e-lastsummaryrow{{/if}}' style='{{if !isSummaryRow && !footerSummaryRowRecord}}"
                                                    + childNode.style.cssText + "'>" + indentDiv + "{{else}}'>{{/if}}" +
                                                    '{{if !isSummaryRow && !footerSummaryRowRecord}}' +
                                                     childNode.innerHTML +
                                                    '{{else}}' + summaryTitlediv + '{{/if}}';

                                                     if (!ej.isNullOrUndefined(column["format"]))
                                                         rowTemplateHTML += '{{if isSummaryRow || footerSummaryRowRecord}}' + "{{:~_" + proxy._id + "formatting('" + column["format"] + "',~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "'),'" + this.model.locale + "')}}" + '{{/if}}';
                                                     else
                                                         rowTemplateHTML += '{{if isSummaryRow || footerSummaryRowRecord}}' + "{{:~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "')}}" + '{{/if}}';
                                                     rowTemplateHTML += "</div></div></td>";
                                            }
                                            else {
                                                rowTemplateHTML += "<td class='" + childNode.className + "{{if isSummaryRow || footerSummaryRowRecord}} e-summaryrowcell{{/if}}{{if isSelected && ~SelectState()}} e-selectionbackground{{/if}} {{:~_" + proxy._id + "isSelectedCell(#data,'" + columnCount + "')}} {{if " + !visible + "}} e-hide{{/if}}{{if isLastSummary}} e-lastsummaryrow{{/if}}' style='{{if !isSummaryRow && !footerSummaryRowRecord}}"
                                                    + childNode.style.cssText + "{{/if}}'>" +
                                                    '{{if !isSummaryRow && !footerSummaryRowRecord}}' +
                                                     childNode.innerHTML +
                                                    '{{else}}' + summaryTitlediv + '{{/if}}';

                                                if (!ej.isNullOrUndefined(column["format"]))
                                                    rowTemplateHTML += '{{if isSummaryRow || footerSummaryRowRecord}}' + "{{:~_" + proxy._id + "formatting('" + column["format"] + "',~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "'),'" + this.model.locale + "')}}" + '{{/if}}';
                                                else
                                                    rowTemplateHTML += '{{if isSummaryRow || footerSummaryRowRecord}}' + "{{:~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "')}}" + '{{/if}}';
                                                rowTemplateHTML += "</td>";
                                            }
                                            if (this._frozenColumnsLength > 0 && this._frozenColumnsLength == tdCount + 1) {
                                                var frozenRowTemplate = "";
                                                frozenRowTemplate += rowTemplateHTML;
                                                frozenRowTemplate += "</tr>";
                                                rowTemplateHTML = "";
                                            }
                                            tdCount++;

                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (altRowTemplateElement[0].childNodes.length > 0) {
                    for (var i = 0; i < altRowTemplateElement[0].childNodes.length; i++) {
                        if (altRowTemplateElement[0].childNodes[i].nodeName == 'TR') {
                            altRowTemplateElement[0].className = altRowTemplateElement[0].childNodes[i].className;
                            altRowTemplateElement[0].style.cssText = altRowTemplateElement[0].childNodes[i].style.cssText;
                            var tdCount = 0;

                            for (var j = 0; j < altRowTemplateElement[0].childNodes[i].childNodes.length; j++) {

                                var childNode = altRowTemplateElement[0].childNodes[i].childNodes[j];

                                if (childNode.nodeName == 'TD') {

                                    var innerHtml = childNode.innerHTML,
                                        templateId = proxy._id + "AltRowTemplateElement" + tdCount;
                                    $("#" + templateId).remove();
                                    var scriptElement = this._createRowTemplateElement(innerHtml, templateId);
                                    childNode.innerHTML = "{{:~_treeGridTemplating('" + scriptElement.id + "')}}";

                                    childNode.className += " e-rowcell e-templatecell";
                                    if (columns[tdCount]) {
                                        column = columns[tdCount];
                                        columnName = column.field;
                                        var visible = column.visible == undefined ? true : column.visible;
                                        //To create a seperate div in summary cell to display a summary title.
                                        var summaryTitlediv = "";
                                        if (column.headerText == proxy._visibleColumns[0]) {
                                            summaryTitlediv = '{{if isSummaryRow || footerSummaryRowRecord}}' + "<div " +
                                                "class='e-summarytitle{{if isLastSummary}} e-lastsummaryrow{{/if}}'" + "style='float:left;display:block;'>" + "{{:~_" + proxy._id + "summaryTitle()}}"
                                                 + "</div>" + '{{/if}}';
                                        }
                                        if (tdCount == model.treeColumnIndex) {
                                            var indentDiv = "<div class='e-inner-treecolumn-container' style='height:20px;width:{{:(level+1)*30}}px;'>" +
                                            "<div class='intend' style='height:1px; float:left;width:{{:~_" + proxy._id + "getIndentWidth(#data)}}; display:inline-block;'>" +
                                             //indicator icons included for drag and drop
                                            "{{if !~getState() || !hasChildRecords }}" +
                                            "<div class={{:~_" + proxy._id + "rowName()}} >" +
                                            "<span class='aboveIcon e-icon'  style='position:relative;float:right;display:none;'></span>" +
                                            "<span class='belowIcon e-icon' style='position:relative;float:right;display:none;'></span>" +
                                            "<span class='childIcon e-icon' style='position:relative;float:right;display:none;'></span>" +
                                            "<span class='cancelIcon e-icon' style='position:relative;float:right;display:none;'></span>" +
                                            "</div>" +
                                            "{{/if}}" +
                                            "</div>" +
                                            "{{if ~getState() && hasChildRecords}}" +
                                            "<div class='intendparent'>" +
                                            "<div class={{:~_" + proxy._id + "rowName()}} >" +
                                            "<span class='aboveIcon e-icon'  style='position:relative;float:left;display:none;'></span>" +
                                            "<span class='belowIcon e-icon' style='float:left;display:none;'></span>" +
                                            "<span class='childIcon e-icon' style='float:left;display:none;'></span>" +
                                            "<span class='cancelIcon e-icon' style='float:left;display:none;'></span>" +
                                            "</div>" +
                                            "</div>" +
                                            "{{/if}}" +
                                            "<div class='{{if expanded&& hasFilteredChildRecords}}e-treegridexpand e-icon{{else hasChildRecords && hasFilteredChildRecords}}e-treegridcollapse e-icon{{/if}}' " +
                                            "style='height:20px;width:30px;margin:auto;float:left;margin-left:10px;display:inline-block;'></div>" +
                                            "<div class='e-cell' style='display:inline-block;width:100%'>";

                                            altRowTemplateHTML += "<td class='" + childNode.className + "{{if isSummaryRow || footerSummaryRowRecord}} e-summaryrowcell{{/if}}{{if isSelected && ~SelectState()}} e-selectionbackground{{/if}} {{:~_" + proxy._id + "isSelectedCell(#data,'" + columnCount + "')}} {{if " + !visible + "}} e-hide{{/if}}{{if isLastSummary}} e-lastsummaryrow{{/if}}' style='{{if !isSummaryRow && !footerSummaryRowRecord}}"
                                                 + childNode.style.cssText + "'>" + indentDiv + "{{else}}'>{{/if}}" +
                                                    '{{if !isSummaryRow && !footerSummaryRowRecord}}' +
                                                     childNode.innerHTML +
                                                    '{{else}}' + summaryTitlediv + '{{/if}}';

                                            if (!ej.isNullOrUndefined(column["format"]))
                                                altRowTemplateHTML += '{{if isSummaryRow || footerSummaryRowRecord}}' + "{{:~_" + proxy._id + "formatting('" + column["format"] + "',~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "'),'" + this.model.locale + "')}}" + '{{/if}}';
                                            else
                                                altRowTemplateHTML += '{{if isSummaryRow || footerSummaryRowRecord}}' + "{{:~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "')}}" + '{{/if}}';
                                            altRowTemplateHTML += "</div></div></td>";

                                        }
                                        else {
                                            altRowTemplateHTML += "<td class='" + childNode.className + "{{if isSummaryRow || footerSummaryRowRecord}} e-summaryrowcell{{/if}}{{if isSelected && ~SelectState()}} e-selectionbackground{{/if}} {{:~_" + proxy._id + "isSelectedCell(#data,'" + columnCount + "')}} {{if " + !visible + "}} e-hide{{/if}}{{if isLastSummary}} e-lastsummaryrow{{/if}}' style='{{if !isSummaryRow && !footerSummaryRowRecord}}"
                                                    + childNode.style.cssText + "{{/if}}'>" +
                                                    '{{if !isSummaryRow && !footerSummaryRowRecord}}' +
                                                     childNode.innerHTML +
                                                    '{{else}}' + summaryTitlediv + '{{/if}}';

                                            if (!ej.isNullOrUndefined(column["format"]))
                                                altRowTemplateHTML += '{{if isSummaryRow || footerSummaryRowRecord}}' + "{{:~_" + proxy._id + "formatting('" + column["format"] + "',~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "'),'" + this.model.locale + "')}}" + '{{/if}}';
                                            else
                                                altRowTemplateHTML += '{{if isSummaryRow || footerSummaryRowRecord}}' + "{{:~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "')}}" + '{{/if}}';
                                            altRowTemplateHTML += "</td>";
                                        }
                                        if (this._frozenColumnsLength > 0 && this._frozenColumnsLength == tdCount + 1) {
                                            var frozenAltRowTemplate = "";
                                            frozenAltRowTemplate += altRowTemplateHTML;
                                            frozenAltRowTemplate += "</tr>";
                                            altRowTemplateHTML = "";
                                        }
                                        tdCount++;
                                    }
                                }
                            }
                        }
                    }
                }
               
                /* add details column to end of headers */
                if (model.showDetailsRow && model.detailsTemplate && model.showDetailsRowInfoColumn) {
                    altRowTemplateHTML += "<td class='{{if isSelected && ~SelectState()}}e-selectionbackground{{/if}} {{if isDetailsExpanded}}e-detailsrowexpand{{else}}e-detailsrowcollapse{{/if}}  " +
                                          "e-detailsrowcell{{if isLastSummary}} e-lastsummaryrow{{/if}}'>{{if !isSummaryRow && !footerSummaryRowRecord}}<div class='e-detailsiconcell e-icon {{if isDetailsExpanded}}e-detailsinfoiconhide{{else}}e-detailsinfoiconshow{{/if}}'></div>{{/if}}";
                    rowTemplateHTML += "<td class='{{if isSelected && ~SelectState()}}e-selectionbackground{{/if}} {{if isDetailsExpanded}}e-detailsrowexpand{{else}}e-detailsrowcollapse{{/if}}  " +
                                        "e-detailsrowcell{{if isLastSummary}} e-lastsummaryrow{{/if}}'>{{if !isSummaryRow && !footerSummaryRowRecord}}<div class='e-detailsiconcell e-icon {{if isDetailsExpanded}}e-detailsinfoiconhide{{else}}e-detailsinfoiconshow{{/if}}'></div>{{/if}}";
                }

                var trRow = "{{if isAltRow}}" + "<tr class='{{:~_" + proxy._id + "rowClassName()}} " +
                    "{{if expanded && hasFilteredChildRecords}}e-treegridrowexpand {{else hasChildRecords && hasFilteredChildRecords}} e-treegridrowcollapse {{/if}} e-templaterow "
                    + altRowTemplateElement[0].className + "' style='{{if !isSummaryRow && !footerSummaryRowRecord}}" + altRowTemplateElement[0].style.cssText + "{{else}}height:" + model.rowHeight + "px;{{/if}}display:{{:~_" + proxy._id + "expandStatus(#data)}}'" + "'>" + altRowTemplateHTML + "</tr>"

                    + "{{else}}" + "<tr class='{{:~_" + proxy._id + "rowClassName()}} " +
                    "{{if expanded && hasFilteredChildRecords}}e-treegridrowexpand {{else hasChildRecords && hasFilteredChildRecords}} e-treegridrowcollapse {{/if}} e-templaterow "
                    + rowTemplateElement[0].className + "' style='{{if !isSummaryRow && !footerSummaryRowRecord}}" + rowTemplateElement[0].style.cssText + "{{else}}height:" + model.rowHeight + "px;{{/if}}display:{{:~_" + proxy._id + "expandStatus(#data)}}'" + "'>" + rowTemplateHTML + "</tr>" +
                    "{{/if}}";


                var frozenTrRow = "{{if isAltRow}}" + "<tr class='{{:~_" + proxy._id + "rowClassName()}} " +
                    "{{if expanded && hasFilteredChildRecords}}e-treegridrowexpand {{else hasChildRecords && hasFilteredChildRecords}} e-treegridrowcollapse {{/if}} e-templaterow "
                    + altRowTemplateElement[0].className + "' style='{{if !isSummaryRow && !footerSummaryRowRecord}}" + altRowTemplateElement[0].style.cssText + "{{else}}height:" + model.rowHeight + "px;{{/if}}display:{{:~_" + proxy._id + "expandStatus(#data)}}'" + "'>" + frozenRowTemplate + "</tr>"

                    + "{{else}}" + "<tr class='{{:~_" + proxy._id + "rowClassName()}} " +
                    "{{if expanded && hasFilteredChildRecords}}e-treegridrowexpand {{else hasChildRecords && hasFilteredChildRecords}} e-treegridrowcollapse {{/if}} e-templaterow "
                    + rowTemplateElement[0].className + "' style='{{if !isSummaryRow && !footerSummaryRowRecord}}" + rowTemplateElement[0].style.cssText + "{{else}}height:" + model.rowHeight + "px;{{/if}}display:{{:~_" + proxy._id + "expandStatus(#data)}}'" + "'>" + frozenAltRowTemplate + "</tr>" +
                    "{{/if}}";
            }

            else {

                var trRow = "<tr class='e-treegridrows {{:~_" + proxy._id + "rowClassName()}} ";

                if (model.enableAltRow) {
                    trRow += "{{if isAltRow}}e-alt-row{{/if}} ";
                }

              
                var tdCellCollections = "";
                for (columnCount = 0; columnCount < length; columnCount++) {
                    if (columns[columnCount]) {
                        columnName = columns[columnCount].field;
                        column = columns[columnCount];
                        var visible = columns[columnCount].visible == undefined ? true : columns[columnCount].visible;
                        var textAlign = columns[columnCount].textAlign;
                        //To create a seperate div in summary cell to display a summary title.
                        summaryTitlediv = "";
                        if (column.headerText == proxy._visibleColumns[0]) {
                            summaryTitlediv = '{{if isSummaryRow || footerSummaryRowRecord}}' + "<div " +
                                "class='e-summarytitle{{if isLastSummary}} e-lastsummaryrow{{/if}}'" + "style='float:left;display:block;'>" + "{{:~_" + proxy._id + "summaryTitle()}}"
                                 + "</div>" + '{{/if}}';
                        }

                        //CHECK THE template COLUMN OR NOT
                        if (column["isTemplateColumn"]) {

                            trRow += "e-templaterow "

                            var templateId = column["templateID"],
                                template = column["template"],
                                angularTemplate = column["angularTemplate"];

                            if (angularTemplate) {
                                $("#" + proxy._id + column.headerText + columnCount + "_Template").remove();
                                var scriptElement = this._createTemplateElement(column);

                                tdCell = "<td " +
                                     "class='{{if !isSummaryRow && !footerSummaryRowRecord}} e-intend{{/if}} e-rowcell e-templatecell{{if isSelected && ~SelectState()}} e-selectionbackground{{/if}} {{:~_" + proxy._id + "isSelectedCell(#data,'" + columnCount + "')}} {{if " + !visible + "}} e-hide{{/if}}{{if isLastSummary}} e-lastsummaryrow{{/if}}'" +
                                     "style='text-Align:" + textAlign + "'" +
                                     "role='gridcell'>" +
                                     '{{if !isSummaryRow && !footerSummaryRowRecord}}' +
                                     "{{:~_treeGridTemplating('" + scriptElement.id + "')}}" +
                                     '{{else}}' + summaryTitlediv + '{{/if}}';

                                     if (!ej.isNullOrUndefined(column["format"]))
                                         tdCell += '{{if isSummaryRow || footerSummaryRowRecord}}' + "{{:~_" + proxy._id + "formatting('" + column["format"] + "',~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "'),'" + this.model.locale + "')}}" + '{{/if}}';
                                     else
                                         tdCell += '{{if isSummaryRow || footerSummaryRowRecord}}' + "{{:~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "')}}" + '{{/if}}';
                                     tdCell += "</td>";
                            }
                            else if (templateId) {
                                
                                tdCell = "<td "+
                                     "class='{{if !isSummaryRow && !footerSummaryRowRecord}} e-intend{{/if}} e-rowcell e-templatecell{{if isSelected && ~SelectState()}} e-selectionbackground{{/if}} {{:~_" + proxy._id + "isSelectedCell(#data,'" + columnCount + "')}} {{if " + !visible + "}} e-hide{{/if}}{{if isLastSummary}} e-lastsummaryrow{{/if}}'" +
                                     " style='text-Align:" + textAlign + ";padding-left:10px;'" +
                                     " role='gridcell'>" +
                                     '{{if !isSummaryRow && !footerSummaryRowRecord}}' +
                                      $("#" + templateId)[0].innerHTML +
                                      '{{else}}' + summaryTitlediv + '{{/if}}';

                                if (!ej.isNullOrUndefined(column["format"]))
                                    tdCell += '{{if isSummaryRow || footerSummaryRowRecord}}' + "{{:~_" + proxy._id + "formatting('" + column["format"] + "',~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "'),'" + this.model.locale + "')}}" + '{{/if}}';
                                else
                                    tdCell += '{{if isSummaryRow || footerSummaryRowRecord}}' + "{{:~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "')}}" + '{{/if}}';

                                tdCell += "</td>";

                            }
                            else if (template) {

                                tdCell = "<td " +
                                     "class='{{if !isSummaryRow && !footerSummaryRowRecord}} e-intend{{/if}} e-rowcell e-templatecell{{if isSelected && ~SelectState()}} e-selectionbackground{{/if}} {{:~_" + proxy._id + "isSelectedCell(#data,'" + columnCount + "')}} {{if " + !visible + "}} e-hide{{/if}}{{if isLastSummary}} e-lastsummaryrow{{/if}}'" +
                                     " style='text-Align:" + textAlign + "';padding-left:10px;" +
                                     " role='gridcell'>" +
                                     '{{if !isSummaryRow && !footerSummaryRowRecord}}' +
                                     template +
                                       '{{else}}' + summaryTitlediv + '{{/if}}';

                                if (!ej.isNullOrUndefined(column["format"]))
                                    tdCell += '{{if isSummaryRow || footerSummaryRowRecord}}' + "{{:~_" + proxy._id + "formatting('" + column["format"] + "',~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "'),'" + this.model.locale + "')}}" + '{{/if}}';
                                else
                                    tdCell += '{{if isSummaryRow || footerSummaryRowRecord}}' + "{{:~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "')}}" + '{{/if}}';

                                tdCell += "</td>";
                            }

                            //EXPAND COLLAPSE COLUMN BASED ON THE TREECOLUMNINDEX
                        } else if (columnCount === model.treeColumnIndex) {

                            tdCell = "<td " +
                                 "class='{{if isSelected && ~SelectState()}}e-rowcell e-selectionbackground e-intend {{else}}e-rowcell {{:~_" + proxy._id + "isSelectedCell(#data,'" + columnCount + "')}} {{if !isSummaryRow && !footerSummaryRowRecord}} e-intend{{/if}} {{/if}} {{:~_" + proxy._id + "SummaryRowtdClassName()}}{{if isLastSummary}} e-lastsummaryrow{{/if}}'" +
                                 "style='padding-left:{{if ~_" + proxy._id + "isTreeColumnIndex('" + columnName + "') && isSummaryRow }}{{:(level*20)}}" + "px{{/if}};background-color:{{if cellBackgroundColor && ~_" + proxy._id + "checkColumn('" + columnName + "',#data)=='" + columnName + "'}}" +
                                 "{{:cellBackgroundColor}}{{else}}none{{/if}};'" +
                                 "role='gridcell'>" +
                                 '{{if !isSummaryRow && !footerSummaryRowRecord}}' +
                                 "<div class='e-inner-treecolumn-container' style='height:20px;width:{{if isSummaryRow}}100%{{else}}{{:(level+1)*30}}px{{/if}};'>" +
                                 "{{if hasChildRecords && hasFilteredChildRecords}}" +
                                 "<div " +
                                 "class='intend'" +
                                 "style='height:1px; float:left; width:{{:level*20}}" + "px; display:inline-block;'>" +
                                 //indicators include for drag and drop
                                 "{{if !~getState() || !hasChildRecords}}" +
                                  "<div class={{:~_" + proxy._id + "rowName()}} >" +
                                 "<span class='aboveIcon e-icon'  style='position:relative;float:right;display:none;'></span>" +
                                 "<span class='belowIcon e-icon' style='position:relative;float:right;display:none;'></span>" +
                                 "<span class='childIcon e-icon' style='position:relative;float:right;display:none;'></span>" +
                                 "<span class='cancelIcon e-icon' style='position:relative;float:right;display:none;'></span>" +
                                 "</div>" +
                                 "{{/if}}"+
                                 "</div>" +
                                 "{{else !hasChildRecords || (!hasFilteredChildRecords && hasChildRecords)}}" +
                                 "<div " +
                                 "class='intend'" +
                                 "style='height:1px; float:left; width:{{:(level+1)*20}}" + "px; display:inline-block;'>" +
                                   //indicator icons included for drag and drop
                                 "{{if !~getState() || !hasChildRecords}}" +
                                 "<div class={{:~_" + proxy._id + "rowName()}} >"+
                                 "<span class='aboveIcon e-icon'  style='position:relative;float:right;display:none;'></span>" +
                                 "<span class='belowIcon e-icon' style='float:right;display:none;'></span>" +
                                 "<span class='childIcon e-icon' style='float:right;display:none;'></span>" +
                                 "<span class='cancelIcon e-icon' style='float:right;display:none;'></span>" +
                                 "</div>" +
                                  "{{/if}}" +
                                 "</div>" +
                                 "{{/if}}" +
                                 //indicator icons included for drag and drop
                                 "{{if ~getState() && hasChildRecords}}" +
                                 "<div " +
                                 "class='intendparent'>" +
                                 "<div class={{:~_" + proxy._id + "rowName()}} >" +
                                 "<span class='aboveIcon e-icon'  style='position:relative;float:left;display:none;'></span>" +
                                 "<span class='belowIcon e-icon' style='float:left;display:none;'></span>" +
                                 "<span class='childIcon e-icon' style='float:left;display:none;'></span>" +
                                 "<span class='cancelIcon e-icon' style='float:left;display:none;'></span>" +
                                 "</div>" +
                                 "</div>" +
                                 "{{/if}}" +
                                 "<div " +
                                 "class='{{if expanded && hasFilteredChildRecords}}e-treegridexpand e-icon{{else hasChildRecords && hasFilteredChildRecords}}" +
                                 "e-treegridcollapse e-icon{{/if}}'" +
                                 "style='float:left;display:inline-block; font-size:10px;'>" +
                                 "</div>" +
                                 "<div class='e-cell'" +
                                 "style='display:inline-block;width:100%;padding-left:{{if ~_" + proxy._id + "isTreeColumnIndex('" + columnName + "') && isSummaryRow}}{{:(level+1)*20}}" + "px{{/if}};'>" +
                                '{{/if}}';
                            if (!ej.isNullOrUndefined(column["format"]))
                                tdCell += "{{:~_" + proxy._id + "formatting('" + column["format"] + "',~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "'),'" + this.model.locale + "')}}";
                            else if (model.isFromGantt && column.mappingName === model.resourceInfoMapping) {
                                helpers = {};
                                helpers["_" + proxy._id + "resourceName"] = proxy._getResourceName;
                                $.views.helpers(helpers);
                                tdCell += "{{:~_" + proxy._id + "resourceName('" + proxy._id + "Object','"
                                 + model.resourceNameMapping + "','" + columnName + "')}}" +
                                "</div>" +
                                "</div>" +
                                "</td>";
                            } else if (model.isFromGantt && column.mappingName === model.predecessorMapping) {

                                helpers = {};
                                helpers["_" + proxy._id + "predecessor"] = proxy._getPredecessorsValue;
                                $.views.helpers(helpers);

                                tdCell += "{{:~_" + proxy._id + "predecessor('" + proxy._id + "Object','"
                                    + model.predecessorMapping + "','" + columnName + "')}}" +
                                "</div>" +
                                "</div>" +
                                "</td>";
                            }
                            else {
                                tdCell += "{{:#data['" + columnName + "']}}" + summaryTitlediv +
                                '{{if !isSummaryRow && !footerSummaryRowRecord}}' +
                                "</div>" +
                                "</div>" +
                                "</td>" +
                                '{{/if}}';
                                summaryTitlediv = "";
                            }
                            //CHECK RESOURCE COLUMN FROM GANTT OR NOT
                        } else if (model.isFromGantt && column.mappingName === model.resourceInfoMapping) {
                            helpers = {};
                            helpers["_" + proxy._id + "resourceName"] = proxy._getResourceName;
                            $.views.helpers(helpers);

                            tdCell = "<td  " +
                                 "class='{{if isSelected && ~SelectState()}}e-rowcell e-selectionbackground{{else}}e-rowcell {{/if}} {{:~_" + proxy._id + "isSelectedCell(#data,'" + columnCount + "')}} {{if " + !visible + "}}e-hide{{/if}}'" +
                                 "style='background-color:{{if cellBackgroundColor && ~_" + proxy._id + "checkColumn('" + columnName + "',#data)=='" + columnName + "'}}" +
                                 "{{:cellBackgroundColor}}{{else}}none{{/if}};'" +
                                 "role='gridcell'>" +
                                 "{{:~_" + proxy._id + "resourceName('" + proxy._id + "Object','"
                                 + model.resourceNameMapping + "','" + columnName + "')}}" +
                                 "</td>";
                            //CHECK PREDECESSOR COLUMN FROM GANTT OR NOT
                        } else if (model.isFromGantt && column.mappingName === model.predecessorMapping) {

                            helpers = {};
                            helpers["_" + proxy._id + "predecessor"] = proxy._getPredecessorsValue;
                            $.views.helpers(helpers);

                            tdCell = "<td " +
                                "class='{{if isSelected && ~SelectState()}}e-rowcell e-selectionbackground{{else}}e-rowcell {{/if}} {{:~_" + proxy._id + "isSelectedCell(#data,'" + columnCount + "')}} {{if " + !visible + "}}e-hide{{/if}}' " +
                                "style='background-color:{{if cellBackgroundColor && ~_" + proxy._id + "checkColumn('" + columnName + "',#data)=='" + columnName + "'}}" +
                                "{{:cellBackgroundColor}}{{else}}none{{/if}};'" +
                                "role='gridcell'>" +
                                "{{:~_" + proxy._id + "predecessor('" + proxy._id + "Object','"
                                + model.predecessorMapping + "','" + columnName + "')}}" +
                                "</td>";

                        }
                        else {
                            tdCell = "<td " +
                                "class='{{if isSelected && ~SelectState()}}e-rowcell e-selectionbackground{{else}}e-rowcell{{/if}} {{:~_" + proxy._id + "isSelectedCell(#data,'" + columnCount + "')}} {{if " + !visible + "}}e-hide{{/if}} {{:~_" + proxy._id + "SummaryRowtdClassName()}}{{if isLastSummary}} e-lastsummaryrow{{/if}}'" +
                                "style='background-color:{{if cellBackgroundColor && ~_" + proxy._id + "checkColumn('" + columnName + "',#data)=='" + columnName + "'}}" +
                                "{{:cellBackgroundColor}}{{else}}none{{/if}};text-Align:" + textAlign + "'" +
                                "role='gridcell'" +
                                ">" + summaryTitlediv;

                            if (!ej.isNullOrUndefined(column["format"]))
                                tdCell += "{{:~_" + proxy._id + "formatting('" + column["format"] + "',~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "'),'" + this.model.locale + "')}}";
                            else {
                                tdCell += "{{:~_" + proxy._id + "TemplateCellValue(#data,'" + columnName + "')}}";

                            }    
                            tdCell+= "</td>";
                            summaryTitlediv = "";
                        }

                        tdCellCollections += tdCell;
                    }
                    if (this._frozenColumnsLength > 0 && this._frozenColumnsLength == columnCount + 1) {
                        var frozenTrRow = "";
                        frozenTrRow += tdCellCollections;
                        frozenTrRow += "</tr>";
                        tdCellCollections = "";
                    }
                }

                /* add details column to end of header cell*/
                if (model.showDetailsRow && model.detailsTemplate && model.showDetailsRowInfoColumn) {
                    tdCellCollections += "<td class='{{if isSelected && ~SelectState()}}e-selectionbackground{{/if}} {{if isDetailsExpanded}}e-detailsrowexpand{{else}}e-detailsrowcollapse{{/if}}  " +
                                         "e-detailsrowcell{{if isLastSummary}} e-lastsummaryrow{{/if}}'>{{if !isSummaryRow && !footerSummaryRowRecord}}<div class='e-detailsiconcell e-icon {{if isDetailsExpanded}}e-detailsinfoiconhide{{else}}e-detailsinfoiconshow{{/if}}'></div>{{/if}}";
                }

                trRow += "{{if expanded && hasFilteredChildRecords}}e-treegridrowexpand {{else hasChildRecords && hasFilteredChildRecords}} " +
                      "e-treegridrowcollapse {{/if}} '" +
                      "style='background-color:{{if rowBackgroundColor }}{{:rowBackgroundColor}}{{else}}none{{/if}}; height:" + model.rowHeight + "px;" +
                      "display:{{:~_" + proxy._id + "expandStatus(#data)}}'" +
                      "role='row'>";
                frozenTrRow = trRow + frozenTrRow;
                trRow += tdCellCollections;

                if (model.isFromGantt) {
                    trRow += "<td class='e-extendcolumn'></td></tr>";
                } else {
                    trRow += "</tr>";
                }
            }

            if (model.showDetailsRow && model.detailsTemplate)
            {
                trRow += "{{if isDetailsExpanded}}" + proxy._createDetailsRowTemplate() + "{{/if}}";
                frozenTrRow += "{{if isDetailsExpanded}}" + proxy._createDetailsRowTemplate(true) + "{{/if}}";
            }

            var templates = {};
            templates[proxy._id + "_Template"] = trRow;
            templates[proxy._id + "_JSONFrozenTemplate"] = frozenTrRow;

            $.templates(templates);

            

        },
        
        //#endregion template

        //#region template METHODS

        _gridTemplate: function (self, templateId) {
            return self._renderEjTemplate("#" + templateId, this.data, this.data.index);
        },

        //method for calculating the indent width for expander column
        _getIndentWidth:function(data){
            var level = data.level;
			return (level * 20) + "px";
		},


        //creating template element for angulartemplate in details row template
        _createDetailRowTemplateElement: function (innerHtml) {
            var scriptElement = document.createElement("script");
            scriptElement.id = ("treeGridDetailsRowTemplateElement" + this._id).split("").join("");
            scriptElement.type = "text/x-template";
            scriptElement.text = innerHtml;
            $("body").append(scriptElement);
            return scriptElement;
        },


        //creating template element for angulartemplate in row template
        _createRowTemplateElement: function (innerHtml, id) {
            var scriptElement = document.createElement("script");
            scriptElement.id = id;
            scriptElement.type = "text/x-template";
            scriptElement.text = innerHtml;

            $("body").append(scriptElement);
            return scriptElement;
        },

        //creating a template element for angularjs template
        _createTemplateElement: function (column, text) {
            var idText = text ? "Pager" : column.headerText + $.inArray(column, this.model.columns) + "_Template";
            var scriptElement = document.createElement("script");
            scriptElement.id = ("treeGrid" + idText).split(" ").join("");
            scriptElement.type = "text/x-template";
            scriptElement.text = $(column["angularTemplate"] ? column["angularTemplate"] : column["template"]).html();



            $("body").append(scriptElement);
            return scriptElement;
        },

        //Get the cell value while rendering the tree grid.
        _getTemplateCellValue:function(data,columnName)
        {
            var proxy = this,
                column = proxy.getColumnByField(columnName),
                editType = column.editType,
                cellValue = data[columnName],
                value, text;
            if (cellValue || cellValue === 0) {
                cellValue = cellValue;
            } else {
                cellValue = data.item && data.item[columnName];
            }
            if (editType == ej.TreeGrid.EditingType.Dropdown)
            {
                var editParams = column.editParams;
                cellValue = cellValue ? cellValue : "";
                if(editParams && editParams.fields)
                {
                    text = editParams.fields.text ? editParams.fields.text : "text";
                    value = editParams.fields.value ? editParams.fields.value : "value";
                }
                else
                {
                    value = "value";
                    text = "text";
                }
                if (editParams && editParams.showCheckbox) {
                    cellValueCollection = cellValue.split(",");
                    var length = cellValueCollection.length;
                    cellValue = "";
                    if (column.dropdownData) {
                        for (var i = 0; i < length; i++) {
                            var dropdownDataCollection = column.dropdownData;
                            dropdownValue = $.map(dropdownDataCollection, function (dropdownData) {
                                if (!ej.isNullOrUndefined(dropdownData[value])) {
                                    if (dropdownData[value] == cellValueCollection[i])
                                        return dropdownData[text]
                                }
                                else {
                                    if (dropdownData[text] == cellValueCollection[i])
                                        return dropdownData[text]
                                }
                            });
                            dropdownValue[0] = dropdownValue[0] ? dropdownValue[0] : "";
                            cellValue += i == 0 ? dropdownValue[0] : ","+dropdownValue[0];
                        }
                    }
                }
                else {
                    if (column.dropdownData) {
                        var dropdownDataCollection = column.dropdownData;
                        dropdownValue = $.map(dropdownDataCollection, function (dropdownData) {
                            if (!ej.isNullOrUndefined(dropdownData[value])) {
                                if (dropdownData[value] == cellValue)
                                    return dropdownData[text]
                            }
                            else {
                                if (dropdownData[text] == cellValue)
                                    return dropdownData[text]
                            }
                        });
                        dropdownValue[0] = dropdownValue[0] ? dropdownValue[0] : "";
                        cellValue = dropdownValue[0];
                    }
                }
            }
            return cellValue;
        },

        _getCellValue: function (columnName) {

            var cellValue = this.data[columnName];

            if (cellValue || cellValue===0) {
                return cellValue;
            } else {
                return this.data.item && this.data.item[columnName];
            }


        },
        _isTreeColumnIndex: function (columnName) {
            var proxy = this; model = proxy.model,
            currentColumn = model.columns[model.treeColumnIndex];
            if (currentColumn && currentColumn.field == columnName)
                return true;
            else
                return false;
        },
        _getSummaryTitle: function () {
            var proxy = this;
            var summaryTitleValue = proxy.data.summaryRow.title;
            if (summaryTitleValue)
                return summaryTitleValue;
            else
                return proxy.data.item && proxy.data.item.summaryRow.title;
        },

        _getCellColumn: function (columnName,data) {
            var proxy = this;

            if (data.treeMappingName.indexOf(columnName) !== -1) {
                return columnName;
            }
            else {
                return "none"
            }


        },

        //GET RESOURCE NAME FOR RESOURCE COLUMN IN THE GANTT CONTROL
        _getResourceName: function (gridObject, mappingName, columnName) {

            var proxy = this,
                data = proxy.data[columnName],
                count = 0,
                length = data && data.length,
                resourceName = [];

            if (data && data.length > 0) {
                for (count; count < length; count++) {
                    resourceName.push(data[count][mappingName]);
                }
            }
            return resourceName;
        },


        //GET PREDECESSOR VALUE FOR PREDECESSOR COLUMN IN THE GANTT CONTROL
        _getPredecessorsValue: function (gridObject, mappingName) {

            return this.data.item[mappingName];

        },


        //GET THE EXPAND COLLAPSE STATUS OF TABLE ROW
        _getExpandStatusRecord: function (data) {

            var proxy = this;

            if (proxy.getExpandStatus(data)) {

                return 'table-row';

            }

            return 'none';
        },

        //#endregion TEMPLATE METHODS

        //#region CONVERT HIERARCHICAL RECORDS TO FLAT RECORDS
        //CREATE FLATRECORDS FROM HIERARCHICAL DATASOURCE
        _createRecords: function (dataSource) {

            var proxy = this,
                model = proxy.model,
                ids=proxy.model.ids,
                flatRecords = model.flatRecords,
                length = dataSource.length,
                count = 0,
                expanded = true,
                parentRecord,
                parentRecords = model.parentRecords;

            if (!model.isFromGantt && model.enableCollapseAll) 
                expanded = false;
            if (model.allowPaging && model.pageSettings.totalRecordsCount > 0 && model.pageSettings.pageSizeMode === ej.TreeGrid.PageSizeMode.Root)
                length = model.pageSettings.totalRecordsCount < length ? model.pageSettings.totalRecordsCount : length;

            for (count; count < length; count++) {

                parentRecord = proxy._createRecord(dataSource[count], 0, null, expanded);
                proxy._storedIndex++;

                //CHECK ALTROW ENABLED OR NOT
                
                parentRecord.isAltRow = proxy._storedIndex % 2 == 0 ? false : true;
                

                //CHECK SORTING ENABLED OR NOT
                
                parentRecords.push(parentRecord);
                

                parentRecord.index = proxy._storedIndex;
                ids[proxy._storedIndex] = parentRecord.index;
                flatRecords.push(parentRecord);
                if (parentRecord.hasChildRecords)
                    proxy._parentRecords.push(parentRecord);
                parentRecord.childRecords && proxy._addNestedRecords(parentRecord.childRecords);

            }
            if (model.allowPaging && model.pageSettings.totalRecordsCount > 0 && model.pageSettings.pageSizeMode !== ej.TreeGrid.PageSizeMode.Root) {
                if (model.pageSettings.totalRecordsCount <= flatRecords.length) {
                    var totalRecordsCount = model.pageSettings.totalRecordsCount;
                    model.flatRecords = flatRecords.slice(0, totalRecordsCount);
                    if (model.flatRecords[totalRecordsCount - 1].hasChildRecords) {
                        model.flatRecords[totalRecordsCount - 1].hasChildRecords = false;
                        model.flatRecords[totalRecordsCount - 1].expanded = false;
                        model.flatRecords[totalRecordsCount - 1].childRecords = null;
                        model.flatRecords[totalRecordsCount - 1].hasFilteredChildRecords = false;
                    }
                }
            }
            /* assign records length as max index */
            proxy._maxRowIndex = this.model.flatRecords.length;
        },


        //CREATE RECORD OBJECT
        _createRecord: function (data, level, parentItem, expanded) {

            var proxy = this,
                record,
                childDataSource = data[proxy.model.childMapping], model = this.model;

            //To create and maintain record collections for multi select dropdownedit of columns
            record = $.extend({}, data);
            var tempData;
            if (model.parentIdMapping && proxy._createdAt==="load") {
                tempData = ej.DataManager(proxy._retrivedData).executeLocal(ej.Query().where(model.idMapping,
                ej.FilterOperators.equal,
                record[model.idMapping]));
                record.item = tempData[0];
            }
            else {

                if (this.dataSource() instanceof ej.DataManager && this.dataSource().dataSource.json && this.dataSource().dataSource.offline && proxy._createdAt === "load") {
                    var tempData = ej.DataManager(proxy._retrivedData).executeLocal(ej.Query().where(model.idMapping,
                    ej.FilterOperators.equal,
                    record[model.idMapping]));
                    if (tempData.length > 0) {
                        record.item = tempData[0];
                    } else {
                        record.item = data;
                    }
                }
                else {
                    record.item = data;
                }
            }
            record.parentItem = parentItem;
			record.childRecords = (childDataSource && childDataSource.length > 0) && proxy._createChildRecords(childDataSource, level + 1, record);
            record.hasChildRecords = (childDataSource && childDataSource.length > 0) ? true : false;
            record.expanded = (expanded !== undefined && childDataSource !== undefined && record.hasChildRecords==true) ? expanded : childDataSource ? childDataSource.length > 0 : false;
            record.dragState = true;
            record.isSelected = false;
            record.hasFilteredChildRecords = true;//Used to Indicates Parent records can expandable or not on Filtering operation
            record.level = level;
            record.cellBackgroundColor = null;
            record.rowBackgroundColor = null;
            record.treeMappingName = [];
            if (model.showDetailsRow && model.detailsTemplate) {
                record.isDetailsExpanded = model.showDetailsRowInfoColumn ? false : true;
            } else {
                record.isDetailsExpanded = false;
            }
            delete record[model.childMapping];
            return record;
        },


        //CREATE CHILD GANTT RECORDS
        _createChildRecords: function (childDataSource, level, parentItem) {

            var proxy = this,
                model=proxy.model,
                records = [],
                count = 0,
                length = childDataSource.length,
                record = null,
                expanded,
                childRecord;

            if (!model.isFromGantt && model.enableCollapseAll)
                expanded = false;

            for (count = 0; count < length; count++) {

                record = childDataSource[count];

                if (record) {
                    childRecord = proxy._createRecord(record, level, parentItem, expanded);
                    records.push(childRecord);
                }
            }

            return records;

        },


        //ADD NESTED RECORDS TO FLATRECORDS
        _addNestedRecords: function (childDataSource) {

            var proxy = this,
                model = proxy.model,
                ids=proxy.model.ids,
                flatRecords = model.flatRecords,
                updatedRecords = model.updatedRecords,
                count = 0,
                length = childDataSource.length,
                records = [],
                record;
                

            for (count = 0; count < length; count++) {

                record = childDataSource[count];
                proxy._storedIndex++;

                //CHECK ALTROW ENABLED OR NOT
                
                record.isAltRow = proxy._storedIndex % 2 == 0 ? false : true;
                

                record.index = proxy._storedIndex;
                ids[proxy._storedIndex] = record.index;
                flatRecords.push(record);
                updatedRecords.push(record);
                if (record.hasChildRecords)
                    proxy._parentRecords.push(record);
                records = record.childRecords;

                if (records) {

                    var j = 0,
                        recordlength = records.length,
                        childRecord = null;

                    for (j = 0; j < recordlength; j++) {

                        childRecord = records[j];
                        proxy._storedIndex++;     
                        childRecord.index = proxy._storedIndex;
                        ids[proxy._storedIndex] = childRecord.index;
                        //CHECK ALTROW ENABLED OR NOT
                        
                        childRecord.isAltRow = proxy._storedIndex % 2 == 0 ? false : true;
                        
                        flatRecords.push(childRecord);
                        updatedRecords.push(record);
                        if (childRecord.hasChildRecords)
                            proxy._parentRecords.push(childRecord);
                        childRecord.childRecords && proxy._addNestedRecords(childRecord.childRecords);
                    }
                }
            }
        },

        //#endregion CONVERT HIERARCHICAL RECORDS TO FLAT RECORDS

        //#region METHOD FOR EVENTS

        //INITIALIZE THE EVENTS
        _wireEvents: function () {

            var proxy = this,
                model = proxy.model,
                matched = jQuery.uaMatch(navigator.userAgent);

            //proxy._$gridContent.bind("scroll", $.proxy(proxy._onScroll, proxy));
            proxy._on(proxy.element, "click", proxy._onClick);
            proxy._on(proxy.element, "keydown", proxy._keyDown);
            proxy._on(proxy.element, "click", "#" + proxy._id + "e-gridheader", proxy._onHeaderClick);
            proxy._on(proxy.element, "mousedown", "#" + proxy._id + "e-gridheader", proxy._headerMouseDown);
            proxy._on($(document), "mousedown", proxy._mouseDownHandler);
            if (model.allowDragAndDrop) {
                proxy._on(proxy.element, "mousedown", ".e-gridcontent", proxy._contentMouseDown);
               
                //Events binded for Row drag and drop
                proxy._on(proxy.element, "mousedown", ".e-treegridrows, .e-templatecell", proxy.dragRecord);
                proxy._on($(document), "mouseup", proxy.dragMouseUp);

                // touch events binded for row drag and drop 
                if (matched.browser.toLowerCase() == "chrome") {
                    proxy._on(proxy.element, "touchstart", ".e-treegridrows, .e-templatecell", proxy.dragRecord);
                    $(document.body).bind("touchmove", function (event) {
                        event.preventDefault();
                    });
                    $(document.body).bind("touchmove", $.proxy(proxy.dragToolTip, proxy));
                    proxy._on(proxy.element, "touchend", ".e-treegridrows, .e-templatecell", proxy.dragMouseUp);
                    proxy._on(proxy.element, "touchleave", ".e-treegridrows, .e-templatecell", proxy.dragMouseUp);
                    $(proxy._$bodyContainer).bind("touchend", $.proxy(proxy.dragMouseUp, proxy));
                    $(proxy._$bodyContainer).bind("touchleave", $.proxy(proxy.dragMouseUp, proxy));
                }
            }
            //Method binding for filtering data.
            if (model.filterSettings.filterBarMode == "immediate") {
                proxy._on(proxy.element, "keyup", ".e-filterbarcell input", proxy._filterBarHandler);
                proxy._off(proxy.element, "click", ".e-filterbarcell .e-checkbox")._on(proxy.element, "click", ".e-filterbarcell .e-checkbox", proxy._filterBarHandler);
            }
            proxy._on(proxy.element, "focus click", ".e-filterbarcell input", proxy._filterBarClose);
            proxy._on(proxy.element, "click", ".e-filterbarcell .e-cancel", proxy._filterBarClose);
            if (proxy.model.showGridCellTooltip && !proxy.model.showGridExpandCellTooltip) {

                if (ej.browserInfo().name == "msie") {
                    proxy._on(proxy.element, "mouseenter", ".e-rowcell", proxy._mouseHover);
                }
                else {
                    proxy._on(proxy.element, "mousemove", ".e-rowcell", proxy._mouseHover);
                }
            }
            else {
                proxy._on(proxy.element, "mouseenter", ".e-rowcell", proxy._mouseHover);
            }
            proxy._on(proxy.element, "mouseleave", ".e-rowcell", proxy._cellMouseLeave);
            proxy._on(proxy.element, "mouseleave", proxy._cellMouseLeave);
            proxy._enableColumnResizeEvents();

            //MOUSE WHEEL EVENT FOR GANTT CONTROL
            if (model.isFromGantt || this._frozenColumnsLength) {
                proxy._on(proxy.element, "mousewheel DOMMouseScroll", proxy._mouseWheel);
            }

            if (model.enableResize && model.isResponsive && !model.isFromGantt) {
                proxy._on($(window), "resize", proxy._windowResize);
            }
            proxy._enableEditingEvents();
            //Mouse right click event for tree grid
            if (!proxy.model.isFromGantt && model.contextMenuSettings.showContextMenu)
                proxy._on(proxy.element, "contextmenu", proxy._rightClick);

            if (model.contextMenuSettings.showContextMenu) {
                proxy._on(proxy.element, "keyup", this._preventContextMenu);
            }

        },
        /* prevent context menu action by menu option key*/
        _preventContextMenu: function (e) {
            if (e.keyCode == 93) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        },
        _mouseDownHandler:function(e)
        {
            var proxy = this,
                target = $(e.target);
            //Check the whether the mouse down on column menu and column menu items
            if (target.closest("div.e-columnmenuitem").length == 0 && target.closest("div.e-columnMenuListDiv").length == 0 && !target.hasClass("e-columnmenu-icon"))
                proxy._clearColumnMenu();
            //Check the whether the mouse down on context menu items
            if (target.closest("div.e-menuitem").length == 0)
                proxy._clearContextMenu();
            //Check the detail template items on mouse down event
            if (target.closest("div.e-detailscellwrapperfly").length == 0)
                proxy._removeDetailsRow(e);
        },
        // Auto scroll the content if mouse move out of grid area while dragging a row.
        _mouseout: function (e) {
            var proxy = this,
                model = proxy.model,
                topvalue,
                position = proxy.getOffsetRect($("#" + proxy._id)[0]),
                height = proxy._$gridHeaderContainer.height() + position.top;

            if (model.toolbarSettings.showToolbar)
                height += $("#" + proxy._id + "_toolbarItems").height();
            if (proxy._dragMouseDown) {
                if (e.originalEvent.pageX || e.originalEvent.pageY) {
                    posx = e.originalEvent.pageX;
                    posy = e.originalEvent.pageY;
                }
                else if (e.originalEvent.clientX || e.originalEvent.clientY) {
                    posx = e.originalEvent.clientX + document.body.scrollLeft
                       + document.documentElement.scrollLeft;
                    posy = e.originalEvent.clientY + document.body.scrollTop
                        + document.documentElement.scrollTop;
                }
                else if (e.originalEvent && e.originalEvent.changedTouches
                   && e.originalEvent.changedTouches.length > 0) {
                    posx = e.originalEvent.changedTouches[0].pageX;
                    posy = e.originalEvent.changedTouches[0].pageY;
                }
                if ((posx + 200) > proxy._windowWidth) {
                    posx -= (posx + 200) - proxy._windowWidth;
                }
                if ((posy + model.rowHeight) > proxy._windowHeight) {
                    posy -= (posy + model.rowHeight) - proxy._windowHeight;
                }
                if (proxy.model.isFromGantt) {
                    var ganttbody = $(document).find(".e-ganttviewerbodyContianer"),
                        isVscroll = ganttbody.ejScroller("isVScroll"),
                        max = isVscroll ? ganttbody.find(".e-content").get(0).scrollHeight - 1 : 0;
                }
                else
                var max = proxy.isVScroll() ? proxy._$gridContent.find(".e-content").get(0).scrollHeight - 1 : 0;
                //Condition to check whether mouse move above the content or below the content.
                if (posy > (proxy._viewPortHeight + height) || (posy < height && proxy._scrollTop != 0)) {
                    //condition to whether the mouse pointer below the content.

                    if (posy > proxy._viewPortHeight + height) {
                        //Condition to check whether the scroller reaches the end.

                        if (max > (proxy._scrollTop + proxy._viewPortHeight)) {
                            if (!_timerDragDown) {

                                //Timer started for scrolling the content till the end.
                                _timerDragDown = window.setInterval(function () {
                                    if (max > (proxy._scrollTop + proxy._viewPortHeight)) {
                                        topvalue = proxy._scrollTop;
                                        topvalue = topvalue + model.rowHeight;
                                        if (proxy.model.isFromGantt)
                                            ganttbody.ejScroller("scrollY", topvalue, true);
                                        else
                                        proxy.getScrollElement().ejScroller("scrollY", topvalue, true);                       
                                    }
                                }, 100);
                            }
                        }
                        else {
                            _timerDragDown && (_timerDragDown = window.clearInterval(_timerDragDown));
                        }
                    }
                    else {
                        _timerDragDown  && (_timerDragDown = window.clearInterval(_timerDragDown));                        
                    }
                    //condition to check if the mouse points above to content area.
                    if (posy < height && proxy._scrollTop != 0) {
                        if (proxy._scrollTop > 0) {
                            if (!_timerDragUp) {
                                _timerDragUp = window.setInterval(function () {
                                    if (proxy._scrollTop > 0) {
                                        topvalue = proxy._scrollTop;
                                        topvalue = topvalue - model.rowHeight;
                                        if (topvalue < 0)
                                            topvalue = 0;
                                        if (proxy.model.isFromGantt)
                                            ganttbody.ejScroller("scrollY", topvalue, true);
                                        else
                                            proxy.getScrollElement().ejScroller("scrollY", topvalue, true);;
                                    }
                                }, 100);
                            }
                        }
                        else {
                            _timerDragUp && (_timerDragUp = window.clearInterval(_timerDragUp));
                        }
                    }
                    else {
                        _timerDragUp && (_timerDragUp = window.clearInterval(_timerDragUp));                        
                    }
                }
                else {
                    // cleared timer once the mouse enters into the grid area.
                    _timerDragDown && (_timerDragDown = window.clearInterval(_timerDragDown));
                    _timerDragUp && (_timerDragUp = window.clearInterval(_timerDragUp));
                }
            }
        },
        // row selection while selecting row for drag and moving row to destination.
        _dragRowSelection: function (e) {
            var proxy = this,
                model = this.model,
                updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords,
                $target = $(e.target),
                $tr = $target.closest('tr'),
                recordIndex = proxy.getIndexByRow($tr),
                rowIndex = -1;
            if (recordIndex != -1 && model.selectionMode == "row") {
                record = model.currentViewData[recordIndex];
                if (!record.isSummaryRow)
                    rowIndex = updatedRecords.indexOf(record);
                var args = { rowElement: $tr, recordIndex: this.selectedRowIndex() };
                if (!proxy._trigger('rowSelecting', args)) {
                    model.selectedItem = record;
                    proxy._rowDragIndexes = [];
                    proxy._rowDragIndexes.push(rowIndex);
                    this.selectedRowIndex(rowIndex);
                    proxy.selectRows(this.selectedRowIndex());
                    args = {
                        rowElement: $tr,
                        data: model.selectedItem,
                        target: "ejTreeGrid",
                        recordIndex: proxy.selectedRowIndex(),
                    };
                    if (proxy.model.isFromGantt) {
                        args.requestType = "rowDragAndDrop";
                        proxy._trigger("rowSelected", args);
                    }
                }
            }
        },
        // This method is to get the row range to enable the drag row indicators consequently.
        getRange: function (record, index,$tr) {
            
            var proxy = this,
                model = proxy.model;
                roundOff = 0,
                rowHeight = $tr[0].offsetHeight,
                position = proxy.getOffsetRect($("#" + proxy._id)[0]),
                height = proxy._$gridHeaderContainer.height() + position.top;
                rowHeight += proxy._detailsRowHeight;

            if (model.toolbarSettings.showToolbar)
                height += $("#" + proxy._id + "_toolbarItems").height();
            if(proxy._scrollTop!=0)
                roundOff = rowHeight - proxy._scrollTop % rowHeight;
            // 7 is to equalize the height.
            var rowTop = (index * rowHeight) + height + roundOff + 7,
                rowBottom = rowTop + $tr[0].offsetHeight,
                difference = rowBottom - rowTop,
                divide = difference / 3,
                topRowSegment = rowTop + divide,
                middleRowSegment = topRowSegment + divide,
                bottomRowSegment = middleRowSegment + divide,
                position = {
                    topRowSegment: topRowSegment,
                    middleRowSegment: middleRowSegment,
                    bottomRowSegment: bottomRowSegment
                };
            return position;
        },
        //Child validation to display the child indicator.
        _childValidation: function (record) {            
            var childIndex,
                proxy = this,
                draggedRecord = proxy._draggedRecord,
                parentItem = draggedRecord.parentItem,
                childRecords;
            if (parentItem) {
                childRecords = parentItem.childRecords;
                childIndex = childRecords.indexOf(this._draggedRecord);
                if (record == parentItem && childIndex != -1)
                    this._childItem = true;
            }
        },
        _isColumnHidable: function (column) {
            var model = this.model, visibleFrozenColumn = [], visibleUnfrozenColumn = [], returnValue = true;

            visibleFrozenColumn = this._frozenColumns.filter(function (value) {
                return value.visible == true;
            });
            visibleUnfrozenColumn = this._unFrozenColumns.filter(function (value) {
                return value.visible == true;
            });
            if (visibleFrozenColumn.length == 1 && visibleFrozenColumn[0].field == column.field) {
                returnValue = false;
            }
            if (visibleUnfrozenColumn.length == 1 && visibleUnfrozenColumn[0].field == column.field) {
                returnValue = false;
            }
            return returnValue;
        },
        _updateColumnMenuVisibility: function () {
            var model = this.model, visibleFrozenColumn = [], visibleUnfrozenColumn = [];
            if (model.showColumnChooser) {
                visibleFrozenColumn = this._frozenColumns.filter(function (value) {
                    return value.visible == true;
                });
                visibleUnfrozenColumn = this._unFrozenColumns.filter(function (value) {
                    return value.visible == true;
                });
                if (visibleFrozenColumn.length == 1) {
                    var checkBoxData = $("#" + this._id + "_columnMenu_" + visibleFrozenColumn[0].field).data("ejCheckBox");
                    if (checkBoxData)
                        checkBoxData.option("enabled", false);
                }
                if (visibleUnfrozenColumn.length == 1) {
                    var checkBoxData = $("#" + this._id + "_columnMenu_" + visibleUnfrozenColumn[0].field).data("ejCheckBox");
                    if (checkBoxData)
                        checkBoxData.option("enabled", false);
                }
            }
        },
        //This method is to render the tooltip while dragging.
        _renderToolTip: function (e, element, args) {
            var proxy = this,
                $target = $(e.target),
                model = this.model,
                positions = [],
                doc = document,
                item,
                columns = proxy.model.columns,
                tooltipItemLength = model.dragTooltip.tooltipItems.length,
                columnTooltipValue,
                $tr = $target.closest('tr'),
                $td,
                recordIndex = proxy.getIndexByRow($tr),
                positions = {}, records, dragRecIndex, index,
            updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;
            proxy._insertAbove = false;
            proxy._insertAsChild = false;
            proxy._insertBelow = false;
            proxy._childItem = false;
            proxy._currentRecord = model.currentViewData[recordIndex];
            item = proxy._draggedRecord;

            if (proxy._frozenColumnsLength > 0 && recordIndex != -1) {
                var tempTr, index = $tr.index();
                if ($tr.closest(".e-movablecontentdiv").length > 0)
                    tempTr = $(proxy._gridRows[0])[recordIndex];
                else
                    tempTr = $(proxy._gridRows[1])[recordIndex];
                $tr = $tr.add(tempTr);
            }
            // disable all the icons initially.
            $(".intend").find(".e-icon").css({ "display": "none" });
            $(".intendparent").find(".e-icon").css({ "display": "none" });
            $(".e-treegridexpand").css({ "display": "inline-block" });
            $(".e-treegridcollapse").css({ "display": "inline-block" });           
               
            // to get the record index to find its mouse position.            

            if (!model.rowTemplateID) {
                records = proxy.getExpandedRecords(updatedRecords);
                proxy.getVisibleRange();
                currentViewData = records.slice(proxy._visibleRange.top,
            proxy._visibleRange.bottom);
                if (proxy._scrollTop != 0) {
                    dragRecIndex = updatedRecords.indexOf(proxy._draggedRecord) - 1;
                    index = currentViewData.indexOf(proxy._currentRecord) - 1;
                }
                else {
                    dragRecIndex = updatedRecords.indexOf(proxy._draggedRecord);
                    var index = currentViewData.indexOf(proxy._currentRecord);
                }
            }
            else {
                records = updatedRecords;
                index = updatedRecords.indexOf(proxy._currentRecord);
            }
            var currentIndex = updatedRecords.indexOf(proxy._currentRecord),
            isNextRecord =proxy._currentRecord &&proxy._checkPrevNextRecord(proxy._draggedRecord, currentIndex, proxy._currentRecord.level, "next"),
            isPrevRecord = proxy._currentRecord && proxy._checkPrevNextRecord(proxy._draggedRecord, currentIndex, proxy._currentRecord.level, "prev");
                   
            
            
            positions = proxy.getRange(proxy._currentRecord, index, $tr);
            if (e.originalEvent.pageX || e.originalEvent.pageY) {
                posx = this.getOffsetRect(proxy._$gridContent[0]).left;
                posy = e.originalEvent.pageY;
            }                
            else if (e.originalEvent.clientX || e.originalEvent.clientY) {
                posx = e.originalEvent.clientX + document.body.scrollLeft
                   + document.documentElement.scrollLeft;
                posy = e.originalEvent.clientY + document.body.scrollTop
                    + document.documentElement.scrollTop;
            }
            else if (e.originalEvent && e.originalEvent.changedTouches
                    && e.originalEvent.changedTouches.length > 0) {
                posx = e.originalEvent.changedTouches[0].pageX;
                posy = e.originalEvent.changedTouches[0].pageY;
            }
            if ((posx + 200) > proxy._windowWidth) {
                posx -= (posx + 200) - proxy._windowWidth;
            }
            if ((posy + model.rowHeight) > proxy._windowHeight) {
                posy -= (posy + model.rowHeight) - proxy._windowHeight;
            }
            var isTopRowSegment = posy <= positions.topRowSegment,
                isMiddleRowSegment = (posy > positions.topRowSegment && posy <= positions.middleRowSegment),
                isBottomRowSegment = (posy > positions.middleRowSegment && posy <= positions.bottomRowSegment);
            /* check current record or else render previous records tootip*/
            if (proxy._currentRecord) {
                proxy.data = proxy._currentRecord;
                var classname = this._getrowName();
                proxy._childValidation(proxy._currentRecord);
                // This condition is to disapper the expand collapse icon if it is top most level.
                if (!proxy._currentRecord.parentItem) {
                    if (proxy._currentRecord.hasChildRecords &&
                            !((isTopRowSegment && isPrevRecord) || (isMiddleRowSegment && proxy._childItem) || (isBottomRowSegment && isNextRecord)))
                        if (proxy._currentRecord.expanded)
                            $tr.find(".e-treegridexpand").css({ "display": "none" });
                        else
                            $tr.find(".e-treegridcollapse").css({ "display": "none" });
                }
                else {
                    if (proxy._currentRecord.hasChildRecords)
                        if (proxy._currentRecord.expanded)
                            $tr.find(".e-treegridexpand").css({ "display": "inline-block" });
                        else
                            $tr.find(".e-treegridcollapse").css({ "display": "inline-block" });
                }

                //To render the indicators according to its position.
                if (proxy._currentRecord.dragState == true && args.canDrop != false) {
                    if (isTopRowSegment && !isPrevRecord) {
                        $(proxy.element).find("." + classname).find(".aboveIcon").css({ "display": "block" });
                        proxy._insertAbove = true;
                    }
                    else if (isMiddleRowSegment && proxy._childItem == false) {
                        $(proxy.element).find("." + classname).find(".childIcon").css({ "display": "block" });
                        proxy._insertAsChild = true;
                    }
                    else if (isBottomRowSegment && !isNextRecord) {
                        $(proxy.element).find("." + classname).find(".belowIcon").css({ "display": "block" });
                        proxy._insertBelow = true;
                    }
                }
                else {
                    $(proxy.element).find("." + classname).find(".cancelIcon").css({ "display": "block" });
                    proxy.cancelDrop = true;
                }
            }

            var width = proxy._$gridContainer[0].scrollWidth;

            tooltiptable = ej.buildTag("table", "", { 'padding': '1', "width": "100%","border-collapse":"collapse" }, { 'cellspacing': '1' });
            //to render the tooltip according the option given in the model.
            if (proxy.model.dragTooltip.showTooltip) {
                if (!proxy.model.dragTooltip.tooltipTemplate && proxy.model.dragTooltip.tooltipItems.length == 0) {
                    if (proxy._dragTooltip == false) {
                        tooltipbody = ej.buildTag("tbody", "", {}, {});
                        element.find(".e-treegridexpand").css({ "display": "none" });
                        element.find("td.e-detailsrowcell").css({ "display": "none" });
                        element.find(".e-treegridcollapse").css({ "display": "none" });
                        $(element.find(".intend")).css({ "width": 0 });
                        element.find(".e-intend").removeClass("e-intend");
                        element.find(".e-rowcell ").removeClass("e-rowcell ").addClass("e-dragrowcell");
                        element.addClass("e-dragtooltipbackground");
                        if (model.isFromGantt)
                            element.find("td:last").remove();
                        if (element.length == 2 && this._frozenColumnsLength > 0) {
                            $(element[0]).append($(element[1].childNodes));
                            element.splice(1, 1);
                        }
                        tooltipbody.append(element);
                        tooltiptable.append(tooltipbody);
                        proxy._dragmouseOverTooltip = ej.buildTag("div.e-tooltipgantt#tooltiptreegrid" + proxy._id + "", tooltiptable,
                            {
                                "top": (posy + 10) + "px", "left": (posx + 15) + "px",
                                'position': 'absolute',
                                'z-index': '5',
                                'padding': '0',
                                'border-radius': '3px',
                                'border-right': '0',
                                'border-bottom': '0',
                                'width': width,
                            }, {});
                        $(proxy._dragmouseOverTooltip).addClass("e-dragtooltipbackground").addClass("e-dragrowcell");
                        $(document.body).append(proxy._dragmouseOverTooltip);
                        proxy._dragTooltip = true;
                    }
                    else {
                        //element.find(".e-treegridexpand").css({ "display": "none" });
                        //element.find(".e-treegridcollapse").css({ "display": "none" });
                        //element.find("td.e-detailsrowcell").css({ "display": "none" });
                        //if (element.length == 2 && this._frozenColumnsLength > 0) {
                        //    $(element[0]).append($(element[1].childNodes));
                        //    element.splice(1, 1);
                        //}
                        $(proxy._dragmouseOverTooltip).css({
                            "top": (posy + 10) + "px", "left": (posx + 15) + "px",
                            'position': 'absolute',
                            'z-index': '5',
                            'padding': '0',
                            'border-radius': '3px',
                            'border-right': '0',
                            'border-bottom': '0',
                            'width': width,
                        });
                    }
                }
                else if (tooltipItemLength != 0) {
                    if (proxy._dragTooltip == false) {
                        tooltipbody = ej.buildTag("tbody", "", {}, {});
                        tooltiptr = ej.buildTag("tr.e-dragtooltipbackground", "", {}, {});
                        for (var j = 0; j < tooltipItemLength; j++) {
                            for (var i = 0; i < columns.length; i++) {
                                //Skip the columns which is not visible in TreeGrid.
                                if (columns[i].visible == false)
                                    continue;
                                if (model.isFromGantt)
                                    columnTooltipValue = columns[i].mappingName
                                else
                                    columnTooltipValue = columns[i].field
                                if (model.dragTooltip.tooltipItems[j] == columnTooltipValue) {
                                    var value = !ej.isNullOrUndefined(proxy._draggedRecord[columns[i].field])?proxy._draggedRecord[columns[i].field].toString():false;
                                    if (value) {
                                        $td = ej.buildTag("td.e-dragrowcell", value.toString(), { "padding": "5px", "width": proxy.columnsWidthCollection[i], "height": model.rowHeight }, {});
                                        tooltiptr.append($td);
                                    }                                 
                                    tooltiptr.append($td);
                                    break;
                                }
                            }
                        }
                        tooltipbody.append(tooltiptr);
                        tooltiptable.append(tooltipbody);
                        proxy._dragmouseOverTooltip = ej.buildTag("div.e-tooltipgantt#tooltiptreegrid" + proxy._id + "", tooltiptable,
                            {
                                "top": (posy + 10) + "px", "left": (posx + 15) + "px",
                                'position': 'absolute',
                                'z-index': '5',
                                'padding': '0',
                                'border-right': '0',
                                'border-bottom': '0',
                                'border-radius': '3px',
                                'height': "auto",
                            }, {});
                        $(proxy._dragmouseOverTooltip).addClass("e-dragtooltipbackground").addClass("e-dragrowcell");
                        $(document.body).append(proxy._dragmouseOverTooltip);
                        proxy._dragTooltip = true;
                    }
                    else {
                        $(proxy._dragmouseOverTooltip).css({
                            "top": (posy + 10) + "px", "left": (posx + 15) + "px",
                            'position': 'absolute',
                            'z-index': '5',
                            'padding': '0',
                            'border-right': '0',
                            'border-bottom': '0px',
                            'border-radius': '3px',
                            'height': "auto"
                        });
                    }
                }
                else if (proxy.model.dragTooltip.tooltipTemplate) {
                    if (proxy._dragTooltip == false) {
                        proxy._dragmouseOverTooltip = ej.buildTag("div.e-tooltipgantt#tooltiptreegrid" + proxy._id + "", "",
                            {
                                "top": (posy + 10) + "px", "left": (posx + 15) + "px",
                                'position': 'absolute',
                                'z-index': '5',
                                'padding': '0',
                                'border-right': '0',
                                'border-bottom': '0',
                                'border-radius': '3px',
                                'height': "auto"
                            }, {});
                        $(document.body).append(proxy._dragmouseOverTooltip);
                        proxy.tooltipState = "TemplateID";
                        var tooltipbody = ej.buildTag("tbody", $.render[proxy._id + "dragtooltipTemplate"](item), {}, {});
                        proxy._dragmouseOverTooltip[0].innerHTML = "<table>" + tooltipbody[0].innerHTML + "</table>";
                        proxy._dragTooltip = true;
                    }
                    else {
                        $(proxy._dragmouseOverTooltip).css({
                            "top": (posy + 10) + "px", "left": (posx + 15) + "px",
                            'position': 'absolute',
                            'z-index': '5',
                            'padding': '0',
                            'border-right': '0',
                            'border-bottom': '0',
                            'border-radius': '3px',
                            'height': "auto",
                        });
                    }
                }
            }
        },

        //Used for check whether the dragged record is previous or next to current record based on position argument
        //If it is previous or next to current record, this method return true otherwise return false.
        _checkPrevNextRecord:function(record,index,level, position)
        {
            var proxy = this,
                model = proxy.model,
                updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords,
                currentIndex = index;
            position == "next" ? index++ : index--;
            while(updatedRecords[index])
            {
                if (updatedRecords[index].level == level)
                {
                    if (updatedRecords[index] == record && record.parentItem == updatedRecords[currentIndex].parentItem)
                        return true;
                    return false;
                }
                position == "next" ? index++ : index--;
            }
            return false;
        },
        //Tooltip template for row drag and drop
        _createDragTooltipTemplate: function () {
            var proxy = this,
                td,               
                template = proxy.model.dragTooltip.tooltipTemplate,
                parentTr;
            if (template) {
                var templateString = template.charAt(0);
             
                if (templateString == "#")
                     parentTr = $(proxy.model.dragTooltip.tooltipTemplate)[0].innerHTML;
                else
                     parentTr = proxy.model.dragTooltip.tooltipTemplate;
            }            
            var templates = {};
            templates[proxy._id + "dragtooltipTemplate"] = parentTr;
            $.templates(templates);
        },       

        //render the cancel icon if drag over its child.
		_updateDragStateFalse: function (record, count) {
		    var currentRecord, proxy = this, length;
		    record.dragState = false;		   
		    if (record.hasChildRecords) {
		        length = record.childRecords.length;
		        for (var i = 0; i < length; i++) {
		            currentRecord = record.childRecords[i];
		            currentRecord.dragState = false;
		            if (currentRecord.hasChildRecords) {
		                count = proxy._updateDragStateFalse(currentRecord, count);
		            }
		        }
		    }
		    return;
		},

        //Turn all the records dragState to true once dragging finished.
		_updateDragStateTrue: function (record, count) {
		    var currentRecord, proxy = this, length;
		    if (!ej.isNullOrUndefined(record)) {
		        record.dragState = true;
		        if (record.hasChildRecords) {
		            length = record.childRecords.length;
		            for (var i = 0; i < length; i++) {
		                currentRecord = record.childRecords[i];
		                currentRecord.dragState = true;
		                if (currentRecord.hasChildRecords) {
		                    count = proxy._updateDragStateTrue(currentRecord, count);
		                }
		            }
		        }
		    }
		    return;
		},
        //Mouse down action for to drag a record   
		dragRecord: function (e) {
            /*verify ctlkey and shift key and mouse button*/
		    if (e.ctrlKey || e.shiftKey || e.which == 2 || e.which == 3)
		        return true;

		    var $target = $(e.target),
               proxy = this,
               model=proxy.model,
               recordIndex,
               args = {},
               $tr = $target.closest('tr');
            
		    if (!$tr.hasClass("e-editedrow")) {
		        proxy._clearContextMenu();
		        proxy._clearColumnMenu();

		        proxy._posx = e.pageX;
		        proxy._posy = e.pageY;
		        if ($target.hasClass("e-summaryrowcell") || $target.hasClass("e-footersummaryrowcell")
                || $target.hasClass("e-summarytitle"))
		            return;
		        if (!model.enableVirtualization || model.allowPaging)
		            proxy._currentIndex = proxy.getIndexByRow($tr);
		        else {
		            proxy._currentIndex = proxy.getIndexByRow($tr);
		            record = model.currentViewData[proxy._currentIndex];
		            proxy._currentIndex = model.updatedRecords.indexOf(record);
		        }
		        recordIndex = proxy.getIndexByRow($tr);
		        proxy._draggedRecord = proxy.model.currentViewData[recordIndex];
		        args.draggedRowIndex = recordIndex;
		        args.draggedRow = proxy._draggedRecord;
		        proxy._trigger("rowDragStart", args);
		        if (args.draggedRow && args.draggedRow.isSummaryRow)
		            args.cancel = true;
		        // For normal treegrid records
		        proxy._on(proxy.element, "mousemove", ".e-treegridrows", proxy.dragToolTip);
		        // For Template treegrid records.
		        proxy._on(proxy.element, "mousemove", ".e-templatecell  ", proxy.dragToolTip);
		        proxy._on($(window), "mouseenter", proxy._mouseout);

		        if (proxy._draggedRecord) {
		            proxy._updateDragStateFalse(proxy._draggedRecord);
		            proxy._dragMouseDown = true;
		        }
		        if (args.cancel) {
		            proxy._dragMouseDown = false;
		            proxy._updateDragStateTrue(proxy._draggedRecord);
		        }
		    }
		},

        //Mouse Move action to rendering the tooltip for drag and drop
        dragToolTip: function (e) {
            var proxy = this,
                model = proxy.model,
                args = {},
                draggedrows = [],
                $target = $(e.target),
                $tr = $target.closest('tr'),
                length,
                recordIndex, item,
                $trClone;

            if (proxy._dragMouseDown == true && proxy.model.allowDragAndDrop == true && e.pageX != proxy._posx && e.pageY != proxy._posy) {
                /*remove the details row while drag and drop */
                this._removeDetailsRow();
                proxy._saveCellHandler(e);
                if (model.selectionMode == "cell")
                    proxy.clearSelection();
                if (!args.cancel) {
                    length=proxy._rowDragIndexes.length;
                    for (i = 0; i < length; i++) {
                        var currentRow = ej.TreeGrid.getRowByIndex(proxy, this._rowDragIndexes[i]);
                        if (this._frozenColumnsLength > 0)
                            currentRow = $(currentRow[0]).add(currentRow[1]);

                        currentRow.find(".e-selectionbackground")
                            .removeClass("e-selectionbackground").removeClass("e-active");
                    }
                    if (proxy.model.allowSelection)
                        proxy._dragRowSelection(e);
                    recordIndex = proxy.getIndexByRow($tr),
                    updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;
                    if (recordIndex != -1) {
                        item = proxy.model.currentViewData[recordIndex];
                        $tr = ej.TreeGrid.getRowByIndex(proxy, proxy._currentIndex);
                        $trClone = $tr.clone();
                        //Remove the hided columns.
                        $trClone.find(".e-hide").remove();                      
                        args.targetRowIndex = recordIndex;
                        args.targetRow = item;
                        args.canDrop = true;
                        args.draggedRow = proxy._draggedRecord;
                        args.draggedRowIndex = updatedRecords.indexOf(proxy._draggedRecord);
                        proxy._trigger("rowDrag", args);
                        proxy._renderToolTip(e, $trClone, args);
                        if (args.targetRow.isSummaryRow) {
                            proxy._draggedRecord.canDrop = false;
                            $(".intend").find(".e-icon").css({ "display": "none" });
                            $(".intendparent").find(".e-icon").css({ "display": "none" });
                        }
                        else if (args.canDrop == false) {
                            proxy._draggedRecord.canDrop = false;
                        }
                        else {
                            proxy._draggedRecord.canDrop = true;
                        }
                    } else if (proxy._draggedRecord && proxy._dragMouseDown)
                    {
                        item = null;
                        $tr = ej.TreeGrid.getRowByIndex(proxy, proxy._currentIndex);
                        $trClone = $tr.clone();
                        args.targetRowIndex = null;
                        args.targetRow = null;
                        args.canDrop = true;
                        args.draggedRow = proxy._draggedRecord;
                        args.draggedRowIndex = proxy._draggedRecord.index;
                        proxy._trigger("rowDrag", args);
                        proxy._renderToolTip(e, $trClone, args);
                    }
                }
            }
        },
         
        //Mouse up event for drag and drop
        dragMouseUp: function (e) {            
            var $target = $(e.target),
                count = 0,
                args = {},
                arg = {},      
                proxy = this,
                model=proxy.model,
                draggedRecord = proxy._draggedRecord,
                currentRecord = proxy._currentRecord,
                $tr = $target.closest('tr'),    
                canDrop,
                length = model.selectedItems.length,

                dropPosition;
            _timerDragDown && (_timerDragDown = window.clearInterval(_timerDragDown));
            _timerDragUp && (_timerDragUp = window.clearInterval(_timerDragUp));

            // unbind the drag events once row dropped
            proxy._off(proxy.element, "mousemove", ".e-treegridrows", proxy.dragToolTip);
            proxy._off(proxy.element, "mousemove", ".e-templatecell  ", proxy.dragToolTip);

            proxy._off($(document), "mousemove", proxy._mouseout);

            proxy._dragMouseDown = false;
            if (ej.isNullOrUndefined(draggedRecord))
               canDrop = true;
            else
               canDrop = draggedRecord.canDrop;
            $(proxy._dragmouseOverTooltip).remove();
            proxy._dragTooltip = false;
            $(".intend").find(".e-icon").css({ "display": "none" });
            $(".intendparent").find(".e-icon").css({ "display": "none" });
            if (this.cancelDrop == true &&  !ej.isNullOrUndefined(draggedRecord) && draggedRecord.parentItem == null) {
                if (draggedRecord.expanded)
                    $tr.find(".e-treegridexpand").css({ "display": "inline-block" });
                else
                    $tr.find(".e-treegridcollapse").css({ "display": "inline-block" });
            }
            proxy._dragMouseLeave = true;           
            if ($target.closest("div#" + proxy._id).length == 1 && !ej.isNullOrUndefined(draggedRecord) && proxy._dropCancel == false) {               
                proxy._dragMouseDown = false;
                if (model.allowDragAndDrop && canDrop ) {
                    proxy._dragMouseLeave = false;
                    proxy._dragMouseDown = false;
                    var recordIndex = proxy.getIndexByRow($tr);
                    if (recordIndex != proxy._currentIndex && recordIndex != -1) {
                        proxy._droppedRecord = model.currentViewData[recordIndex];
                        droppedRecord = proxy._droppedRecord;
                        args.previousItem = draggedRecord;
                        var flatRecords = model.flatRecords;
                        args.previousItemIndex = flatRecords.indexOf(args.previousItem);
                        args.previousParentItem = draggedRecord.parentItem;
                        if (!ej.isNullOrUndefined(draggedRecord.parentItem)) {
                            args.parentChildState = draggedRecord.parentItem.hasChildRecords;
                            args.parentExpandedState = draggedRecord.parentItem.expanded;
                        }
                        arg.targetRow = $.extend({}, proxy._droppedRecord);
                        arg.targetRowIndex = model.updatedRecords.indexOf(droppedRecord);
                        arg.draggedRow = $.extend({}, proxy._draggedRecord);
                        arg.draggedRowIndex = model.updatedRecords.indexOf(draggedRecord);

                        args.hasChildRecords = droppedRecord.hasChildRecords;
                        args.expanded = droppedRecord.expanded;
                        args.childIndex = args.previousParentItem ? args.previousParentItem.childRecords.indexOf(draggedRecord) : 0;
                        args.previousLevel = draggedRecord.level;
                        var draggedrows = [];

                        if (droppedRecord.dragState == true) {
                            proxy._updateDragStateTrue(draggedRecord);

                            if (proxy._insertAbove == true || proxy._insertBelow == true || proxy._insertAsChild == true) {
                                proxy._cancelSaveTools();
                                for (i = 0; i < length; i++)
                                    proxy.clearSelection(model.selectedItems[i]);

                                proxy._deleteDragRow();
                                var recordIndex1 = flatRecords.indexOf(droppedRecord);

                                //Condition to splice above to the dropped record.
                                if (proxy._insertAbove == true) {
                                    dropPosition = "insertAbove";
                                    args.index = recordIndex1;
                                    draggedRecord.parentItem = flatRecords[recordIndex1].parentItem;
                                    draggedRecord.level = flatRecords[recordIndex1].level;
                                    flatRecords.splice(recordIndex1, 0, draggedRecord);
                                    model.updatedRecords.splice(recordIndex1, 0, draggedRecord);
                                    if (model.isFromGantt)
                                        model.ids.splice(recordIndex1, 0, (draggedRecord.taskId).toString());
                                    if (draggedRecord.hasChildRecords) {
                                        var level = 1;
                                        proxy._updateChildRecord(draggedRecord, recordIndex1);
                                        proxy._updateChildRecordLevel(draggedRecord, level);
                                    }
                                    if (droppedRecord.parentItem)
                                        droppedRecord.parentItem.childRecords.splice(droppedRecord.parentItem.childRecords.indexOf(droppedRecord), 0, draggedRecord);
                                }

                                //condition to splice below to the dropped record.
                                else if (proxy._insertBelow == true) {
                                    dropPosition = "insertBelow";
                                    args.index = recordIndex1 + 1;
                                    if (!droppedRecord.hasChildRecords) {
                                        flatRecords.splice(recordIndex1 + 1, 0, draggedRecord);
                                        model.updatedRecords.splice(recordIndex1 + 1, 0, draggedRecord);
                                        if (model.isFromGantt)
                                            model.ids.splice(recordIndex1 + 1, 0, (draggedRecord.taskId).toString());
                                    }
                                    else {
                                        count = proxy.getChildCount(droppedRecord, 0);
                                        flatRecords.splice(recordIndex1 + count + 1, 0, draggedRecord);
                                        model.updatedRecords.splice(recordIndex1 + count + 1, 0, draggedRecord);
                                        if (model.isFromGantt)
                                            model.ids.splice(recordIndex1 + count + 1, 0, (draggedRecord.taskId).toString());
                                    }
                                    draggedRecord.parentItem = flatRecords[recordIndex1].parentItem;
                                    draggedRecord.level = flatRecords[recordIndex1].level;
                                    if (draggedRecord.hasChildRecords) {
                                        var level = 1;
                                        proxy._updateChildRecordLevel(draggedRecord, level);
                                        proxy._updateChildRecord(draggedRecord, recordIndex1 + count + 1);
                                    }
                                    if (droppedRecord.parentItem)
                                        droppedRecord.parentItem.childRecords.splice(droppedRecord.parentItem.childRecords.indexOf(droppedRecord) + 1, 0, draggedRecord);
                                }

                                // Condition to insert as child to the dropped Record.
                                else if (proxy._insertAsChild == true) {
                                    dropPosition = "insertAsChild";
                                    args.index = recordIndex1 + 1;
                                    if (!draggedRecord.hasChildRecords) {
                                        flatRecords.splice(recordIndex1 + 1, 0, draggedRecord);
                                        model.updatedRecords.splice(recordIndex1 + 1, 0, draggedRecord);
                                        if (model.isFromGantt)
                                            model.ids.splice(recordIndex1 + 1, 0, (draggedRecord.taskId).toString());
                                        proxy._recordLevel(recordIndex);
                                    }
                                    else {
                                        flatRecords.splice(recordIndex1 + 1, 0, draggedRecord);
                                        model.updatedRecords.splice(recordIndex1 + 1, 0, draggedRecord);
                                        if (model.isFromGantt)
                                            model.ids.splice(recordIndex1 + 1, 0, (draggedRecord.taskId).toString());
                                        proxy._recordLevel(recordIndex);
                                        proxy._updateChildRecord(draggedRecord, recordIndex1 + 1, droppedRecord.expanded);
                                    }                                    
                                }
                            }                                                    
                            if (draggedRecord.parentItem == null) {
                                var newPIndex = model.parentRecords.indexOf(proxy._droppedRecord);
                                if (proxy._insertBelow == true)
                                    model.parentRecords.splice(newPIndex + 1, 0, draggedRecord);
                                else if (proxy._insertAbove == true)
                                    model.parentRecords.splice(newPIndex, 0, draggedRecord);
                            }
                            args.requestType = "dragAndDrop";
                            args.draggedRow = draggedRecord;
                            args.targetRow = droppedRecord;
                            args.droppedPosition = dropPosition;
                            proxy._updateDataSource();
                            /*update summary rows collection*/
                            if (model.showSummaryRow && proxy._insertAsChild == true)
                                proxy._createSummaryRow(args);
                            proxy.processBindings(args);                          
                            arg.requestType = dropPosition;
                            proxy._trigger("rowDragStop", arg);                                                     
                            if (model.enableAltRow && model.currentViewData.length > 0)
                                ej.TreeGrid.updateAltRow(proxy, proxy.model.currentViewData[0], 0, 0);                           
                            if (arg.cancel)
                                proxy._revertDragging(args);
                            if (model.enableWBS && !arg.cancel) {
                                var ddSiblings;
                                if (draggedRecord.parentItem)
                                    ddSiblings = draggedRecord.parentItem.childRecords;
                                else {
                                    var flatData = model.flatRecords,
                                        Level0 = flatData.filter(function (item) {
                                            return item && item.level == 0;
                                        });
                                    ddSiblings = Level0;
                                }
                                var ddIndex = ddSiblings.indexOf(draggedRecord),
                                    selectedRecords = ddSiblings.slice(ddIndex, ddSiblings.length),
                                    parentVal = draggedRecord.parentItem ? draggedRecord.parentItem.WBS : null,
                                    lastVal = ddIndex + 1;
                                proxy.reCalculateWBS(selectedRecords, lastVal, parentVal);
                            }
                            if (model.allowSelection) {
                                if (model.selectionMode == "row")
                                    proxy._selectDraggedRow($tr);
                                if (model.selectionMode == "cell")
                                    proxy.updateScrollBar(model.updatedRecords.indexOf(proxy._draggedRecord));
                            }
                        }
                        else
                            //If drag state false then drop will cancel so have change the drag state.
                            proxy._updateDragStateTrue(draggedRecord);                        
                    }
                    else {
                        // If drop record not found means condition failed and drag state should change
                        proxy._updateDragStateTrue(draggedRecord);
                        proxy._cancelSaveTools();
                    }
                }
                else {
                    // if canDrop true then drop will cancelled and state should change
                    proxy._updateDragStateTrue(draggedRecord);
                    return 0;
                }
            }
            else
                // if esc key pressed or user drops a record other the tree grid content then 
                //drop cancelled and have to change the drag state.
                proxy._updateDragStateTrue(draggedRecord);            
            // to enable expand and collapse icon of top most record if user mouse up outside of the grid area. 
            if (!ej.isNullOrUndefined(proxy._currentRecord)) {
                if (proxy._currentRecord.parentItem == null) {
                    $tr = ej.TreeGrid.getRowByIndex(proxy, model.updatedRecords.indexOf(proxy._currentRecord));
                    if (proxy._currentRecord.expanded)
                        $tr.find(".e-treegridexpand").css({ "display": "inline-block" });
                    else
                        $tr.find(".e-treegridcollapse").css({ "display": "inline-block" });
                }
            }            
            //Update the summary row after perform the drag and drop action.
            if (model.showSummaryRow && args.requestType == "dragAndDrop" && proxy._insertAsChild != true)
                proxy._updateSummaryRow(args);
            proxy._dropCancel = false;
            proxy._resetPrivateProperties();
            if (!ej.isNullOrUndefined(draggedRecord))
            proxy._cancelSaveTools();
        },

        _resetPrivateProperties: function () {
            _timerDragDown && (_timerDragDown = window.clearInterval(_timerDragDown));
            _timerDragUp && (_timerDragUp = window.clearInterval(_timerDragUp));
            var proxy = this;
            proxy.cancelDrop = false;
            proxy._draggedRecord = null;
            proxy._dragMouseDown = false;
            _timerDragDown = null;
            _timerDragUp = null;
            proxy._childItem = false;
            proxy._dragMouseLeave = false;
            proxy._currentRecord = null;
            proxy._currentIndex = null;
            proxy._droppedRecord = null;
            proxy._insertAsChild = false;
            proxy._insertAbove = false;
            proxy._insertBelow = false;
        },
        // To select the dragged Record after drag stopped.
        _selectDraggedRow: function ($tr) {
            var proxy = this, model = proxy.model,
                updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;
            if (model.isFromGantt)
                var rowIndex = updatedRecords.map(function (e) { return e.taskId; }).indexOf(proxy._draggedRecord.taskId);
            else
                rowIndex = updatedRecords.indexOf(proxy._draggedRecord);            
			proxy._focusTreeGridElement();
            if (model.allowSelection && !(proxy._rowSelectingEventTrigger(this.selectedRowIndex(), rowIndex))) {                
                proxy.selectRows(rowIndex);
                proxy._rowSelectedEventTrigger(rowIndex);
            }
        },
        //Add child records to the data source
        _addChildItem: function (record) {
            var currentRecord, proxy = this, length=0;
            length = record.childRecords.length;
            for (var i = 0; i < length; i++) {
                currentRecord = record.childRecords[i];
                if (proxy.dataSource() instanceof ej.DataManager) {
                    if (proxy.dataSource().dataSource.offline && proxy.dataSource().dataSource.json) {
                        proxy.dataSource().dataSource.json.push(currentRecord.item);
                        if (currentRecord.hasChildRecords) {
                            proxy._addChildItem(currentRecord);
                        }
                    }
                } else {
                    proxy.dataSource().push(currentRecord.item);                     
                    if (currentRecord.hasChildRecords) {
                        proxy._addChildItem(currentRecord);
                    }
                }
            }
        },
        //Update the changes in DataSource.
        _updateDataSource: function () {
            var proxy = this,
                model = proxy.model,
                draggedRecord = proxy._draggedRecord,
                droppedRecord = proxy._droppedRecord,
                tempDataSource, idx, childIndex;
            if (proxy.dataSource() instanceof ej.DataManager) {
                if (proxy.dataSource().dataSource.offline && proxy.dataSource().dataSource.json) {
                    tempDataSource = proxy.dataSource().dataSource.json;
                }
            }
            else 
                tempDataSource = proxy.dataSource();
            
            if (tempDataSource && !droppedRecord.parentItem) {
                idx = tempDataSource.indexOf(droppedRecord.item);
                if (proxy._insertAbove) {
                    if (!model.parentIdMapping)
                        tempDataSource.splice(idx, 0, draggedRecord.item);
                }
                else if (proxy._insertBelow) {
                    if (!model.parentIdMapping)
                        tempDataSource.splice(idx + 1, 0, draggedRecord.item);
                }
            }
            else if (!model.parentIdMapping && droppedRecord.parentItem) {
                childIndex = droppedRecord.parentItem.childRecords.indexOf(draggedRecord);
                if (proxy._insertAbove) 
                    droppedRecord.parentItem.item[proxy.model.childMapping].splice(childIndex, 0, draggedRecord.item);
                else if (proxy._insertBelow)
                    droppedRecord.parentItem.item[proxy.model.childMapping].splice(childIndex, 0, draggedRecord.item);
            }

            if (model.parentIdMapping) {
                if (draggedRecord.parentItem) {
                    if (proxy._insertAbove || proxy._insertBelow) {
                        draggedRecord[model.parentIdMapping] = droppedRecord[proxy.model.parentIdMapping];
                        draggedRecord.item[model.parentIdMapping] = droppedRecord[proxy.model.parentIdMapping];
                    }
                    else {
                        draggedRecord[model.parentIdMapping] = droppedRecord[proxy.model.idMapping];
                        draggedRecord.item[model.parentIdMapping] = droppedRecord[proxy.model.idMapping];
                    }
                }
                else {
                    draggedRecord.item[model.parentIdMapping] = null;
                    draggedRecord[model.parentIdMapping] = null;
                }

                if (proxy.dataSource() instanceof ej.DataManager) {
                    if (proxy.dataSource().dataSource.offline && proxy.dataSource().dataSource.json) {
                        proxy.dataSource().dataSource.json.push(draggedRecord.item);
                    }
                } else {

                    if (proxy._insertAbove || proxy._insertBelow || proxy._insertAsChild)
                        proxy.dataSource().push(draggedRecord.item);
                    if (draggedRecord.hasChildRecords) {
                        proxy._addChildItem(draggedRecord);
                    }
                }
                proxy.updateScrollBar();
            }
        },

        //This method is to delete the dragged record 
        _deleteDragRow: function ($tr) {
            var proxy = this,
                model=proxy.model,
                 deletedRowIndex,
                 deletedRow,
                 args = {};
            deletedRowIndex = proxy.model.updatedRecords.indexOf(proxy._draggedRecord);
            deletedRow = proxy.model.updatedRecords[deletedRowIndex];
            args.tr = $tr;
            args.data = deletedRow;
            args.requestType = ej.TreeGrid.Actions.Delete;
            args.isDragAndDropDelete = true;
            if (proxy._trigger("actionBegin", args)) {
                return true;
            }
            if (proxy.model.enableWBS) {
                var dataRows, targetRowIndex, isUpdateWBS = false;
                if (deletedRow && deletedRow.parentItem) {
                    dataRows = deletedRow.parentItem.childRecords,
                    targetRowIndex = dataRows.indexOf(deletedRow);
                } else if (model.flatRecords.length) {
                    var flatData = model.flatRecords,
                    Level0 = flatData.filter(function (item) {
                        return item && item.level == 0;
                    });
                    dataRows = Level0;
                    targetRowIndex = dataRows.indexOf(deletedRow);
                }
                if (targetRowIndex != dataRows.length - 1)
                    isUpdateWBS = true;
            }
            proxy.processBindings(args);           
            if (isUpdateWBS) {
                var targetRow;
                if (deletedRow.parentItem)
                    targetRow = dataRows[targetRowIndex];//Here we are having the updated 'dataRows'
                else {
                    //for level 0 records
                    dataRows.splice(targetRowIndex, 1);
                    targetRow = dataRows[targetRowIndex];
                }
                proxy.updateWBSdetails(targetRow);
            }
            model.selectedItems = [];
            proxy._previousIndex = -1;
        },
        // To revert the changes if drop get cancelled.
        _revertDragging: function (args) {
            var proxy = this,
                model=proxy.model,
                flatRecords = model.flatRecords;
            proxy._draggedRecord = args.draggedRow;
            proxy._deleteDragRow();
            if (!proxy._draggedRecord.hasChildRecords) {
                flatRecords.splice(args.previousItemIndex, 0, proxy._draggedRecord);
                if (!ej.isNullOrUndefined(flatRecords[args.previousItemIndex].parentItem)) {
                    flatRecords[args.previousItemIndex].parentItem = args.previousParentItem;
                    if (!ej.isNullOrUndefined(args.previousParentItem))
                        flatRecords[args.previousItemIndex].parentItem.childRecords.splice(args.childIndex, 0, proxy._draggedRecord);
                }
                flatRecords[args.previousItemIndex].level = args.previousLevel;
            }
            else {
                flatRecords.splice(args.previousItemIndex, 0, proxy._draggedRecord);
                if (!ej.isNullOrUndefined(flatRecords[args.previousItemIndex].parentItem)) {
                    flatRecords[args.previousItemIndex].parentItem = args.previousParentItem;
                    if (!ej.isNullOrUndefined(args.previousParentItem))
                        flatRecords[args.previousItemIndex].parentItem.childRecords.splice(args.childIndex, 0, proxy._draggedRecord);
                }
                proxy._updateChildRecord(proxy._draggedRecord, args.previousItem.index);
                proxy._draggedRecord.level = args.previousLevel;
                proxy._updateChildRecordLevel(proxy._draggedRecord, args.previousLevel);
            }
            if (!ej.isNullOrUndefined(args.previousItem.parentItem)) {
                args.previousItem.parentItem.hasChildRecords = args.parentChildState;
                args.previousItem.parentItem.expanded = args.parentExpandedState;
                if(model.childMapping)
                    args.previousItem.parentItem.item[proxy.model.childMapping].splice(args.childIndex, 0, args.previousItem.item);
            }
            args.targetRow.hasChildRecords = args.hasChildRecords;
            args.targetRow.expanded = args.expanded;            
            proxy.processBindings(args);
            if (model.currentViewData.length > 0)
                ej.TreeGrid.updateAltRow(proxy, model.currentViewData[0], 0, 0);
        },

        //To splice the child records if user drag and dropped the parent item.
        _updateChildRecord: function (record, count,expandState){
            var currentRecord,
                proxy = this,
                model = proxy.model,
                length;
            if (!record.hasChildRecords)
                return 0;
            length = record.childRecords.length;
            for (var i = 0; i < length; i++) {
                currentRecord = record.childRecords[i];
                count++;
                model.flatRecords.splice(count, 0, currentRecord);
                model.updatedRecords.splice(count, 0, currentRecord);
                if (model.isFromGantt)
                    model.ids.splice(count, 0, (currentRecord.taskId).toString());
                if (currentRecord.hasChildRecords) {
                    count = proxy._updateChildRecord(currentRecord, count);
                }
            }
            return count;
        },
        //This method is to leveling the records when it is inserted as child.
        _recordLevel: function (recordIndex) {
            var j = 0, proxy = this,
                model = proxy.model,
                draggedRecord=proxy._draggedRecord,
                droppedRecord = proxy._droppedRecord,
                childItem = proxy.model.childMapping;
            if (!droppedRecord.hasChildRecords) {
                droppedRecord.hasChildRecords = true;
                if (ej.util.isNullOrUndefined(droppedRecord.childRecords) || $.isEmptyObject(droppedRecord.childRecords)) {
                    droppedRecord.childRecords = [];
                    if (!model.parentIdMapping)
                        droppedRecord.item[childItem] = [];
                }
            }
            if (proxy._insertAsChild) {
                draggedRecord.parentItem = droppedRecord;
                droppedRecord.childRecords.splice(0, 0, draggedRecord);
                if (!ej.isNullOrUndefined(draggedRecord) && !ej.isNullOrUndefined(droppedRecord.item[childItem]) && !model.parentIdMapping) {
                    droppedRecord.item[childItem].splice(0, 0, draggedRecord.item);
                }
                if (!draggedRecord.hasChildRecords)
                    draggedRecord.level = droppedRecord.level + 1;
                else {
                    var level = 1;
                    draggedRecord.level = droppedRecord.level + 1;
                    proxy._updateChildRecordLevel(draggedRecord, level);
                }
                droppedRecord.expanded = true;
                proxy._parentRecords.push(droppedRecord);
            }
        },
        // This method is to level the parent record at the end of it hierarchy.
        _updateChildRecordLevel: function (record,level) {
            var proxy = this,
                length=0;
            level++;
            if (!record.hasChildRecords)
                return 0;
            length = record.childRecords.length;
            for (var i = 0; i < length ; i++) {
                currentRecord = record.childRecords[i];
                currentRecord.level = record.parentItem ? record.parentItem.level + level : record.level + 1;
                if (currentRecord.hasChildRecords) {
                    level--;
                    level = proxy._updateChildRecordLevel(currentRecord, level);
                }
            }
            return level;
        },
                   
        //To renter cancel icon in filtering elements.
        _filterBarClose: function (e) {
            var $target = $(e.target);
            if (e.type == "click" && $target.hasClass("e-cancel")) {
                var $targetText = $target.prev();
                    $targetText.focus().val("");
                $targetText.prop('checked', false);
                $targetText.trigger("keyup");
                e.stopPropagation();
            }
            if (e.type == "focusin") { 
                $target = $(e.target).next();
                this.getHeaderTable().find(".e-cancel").addClass("e-hide");
                $target.removeClass("e-hide");
            }
        },

        checkIdenticalValue: function(val){
            var proxy = this,
                model = proxy.model,
                filteredColumns = model.filterSettings.filteredColumns,
                columnLength = filteredColumns.length;
            for (var col = 0; col < columnLength; col++) {
                if (filteredColumns[col].value == val) {
                    var flag = true;
                    break;
                }               
            }
            return flag;            
        },
        //To wireup method while user enter text to the filter textbox.
        _filterBarHandler: function (e) {
            var proxy = this,
                model = proxy.model,filteringColumn;
            //cancel the edited cell and row
            if (proxy.model.isEdit)
                proxy.cancelEditCell();
            else if (proxy._isRowEdit)
                proxy.cancelRowEditCell();
            /* flag new added record is sorted or filttered in treegrid */
            proxy._isRefreshAddedRecord = false;

            /* clear selction*/
            proxy.clearAllSelection();

            if (e.target == undefined)
                var $target =$(e);
            else
                var $target = $(e.target);
            
            if (this.model.allowFiltering ) {
                var cols=proxy.model.columns;
                var matchcase;
                matchcase = proxy._cellEditingDetails;
                var key = proxy._queryManagar.queries[0];
                proxy._fieldName = $target[0].id.replace(proxy._id + "_" , "").replace("_filterbarcell","");
                this._currentFilterColumn = ej.TreeGrid.getColumnByField(model.columns, proxy._fieldName);
                if ($target.hasClass("e-checkbox"))
                    proxy._searchString = $target[0].checked;
                else if ($target.hasClass("e-ddl")) {
                    // To get the value from dropdown filter (onEnter) mode
                    $target = $target.find("input.e-dropdownlist");
                    var dropDownElement = $("#" + $target[0].id).data("ejDropDownList");
                    if (dropDownElement.selectedIndexValue == -1 || (proxy.checkIdenticalValue(dropDownElement._selectedValue, this._currentFilterColumn)))
                        return true;
                    proxy._searchString = dropDownElement._selectedValue;
                }
                else if ($target.hasClass("e-dropdownlist")) {
                    // To get the value from dropdown filter (immediate) mode
                    var dropdownobject = $("#" + $target[0].id).data("ejDropDownList");
                    if (dropdownobject.selectedIndexValue == -1 || (proxy.checkIdenticalValue(dropdownobject._selectedValue, this._currentFilterColumn)))
                        return true;
                    if (dropdownobject._selectedValue==proxy._dropDownListClearText)
                        proxy._searchString = "";
                    else
                        proxy._searchString = dropdownobject._selectedValue;
                }
                else
                    proxy._searchString = $target.closest("input").val();
                if (proxy._searchString == "") {
                    filteringColumn = model.filterSettings.filteredColumns.filter(function (column) {
                        if (column.field === proxy._fieldName)
                            return true;
                    });
                    if (!filteringColumn.length) {
                        proxy._resizeFilteringElements();
                        return true;
                    }
                }
               
                proxy._validateFilterValue(proxy._searchString);
                proxy.filterColumn(proxy._fieldName, this._operator, proxy._searchString, this._predicate);                
                if (proxy.model.currentViewData.length > 0 && proxy.model.enableAltRow)
                    ej.TreeGrid.updateAltRow(proxy, proxy.model.currentViewData[0], 0, 0);                
            }
        },
        //Method to validate search string type and assign operators accordingly.
        _validateFilterValue: function (_value) {
            var proxy = this;
            this._predicate = "and";
            switch (this._currentFilterColumn.filterEditType) {
                case "numericedit":
                    this._operator = ej.FilterOperators.equal;
                    break;
                case "datepicker":
                    this._operator = ej.FilterOperators.equal;
                    
                    var _format;
                    if (this._currentFilterColumn.format == "" || this._currentFilterColumn.format == undefined)
                        _format = ej.preferredCulture().calendar.patterns.d; //System Date format
                    else
                        _format = this._currentFilterColumn.format.split(':')[1].replace('}', "");
                    if (this._currentFilterbarValue != "")
                        this._currentFilterbarValue = ej.format(_value, _format);
                    break;
                case "datetimepicker":
                    this._operator = ej.FilterOperators.equal;
                  
                    var _format;
                    if (this._currentFilterColumn.format == "" || this._currentFilterColumn.format == undefined)
                        _format = ej.preferredCulture().calendar.patterns.f; //System DateTime format
                    else
                        _format = this._currentFilterColumn.format.split(':')[1].replace('}', "");
                    if (this._currentFilterbarValue != "")
                        this._currentFilterbarValue = ej.format(_value, _format);
                    break;
                case "stringedit":
                    this._operator = ej.FilterOperators.startsWith;
                    break;
                case "dropdownedit":
                    var filterColumn = this._currentFilterColumn;
                    if (filterColumn.editType == "dropdownedit" && filterColumn.editParams && filterColumn.editParams.showCheckbox)
                        this._operator = ej.FilterOperators.contains;
                    else
                        this._operator = ej.FilterOperators.equal;
                    break;
                case "booleanedit":
                    if (proxy._searchString == true || proxy._searchString == "1")
                        proxy._searchString = true;
                    else if (proxy._searchString == "false" || proxy._searchString == "0")
                        proxy._searchString = false;
                    this._operator = ej.FilterOperators.equal;
                    break;
                default:
                    this._operator = ej.FilterOperators.equal;
            }
        },
        
        _mouseHover: function (e) {
            e.preventDefault();
            var proxy = this,
                model = proxy.model;
            if (model.showGridCellTooltip) {
                if (this._dragMouseDown != true) {
                    var $target = $(e.target), proxy = this,
                        posx = 0,
                        posy = 0,
                        $ganttGridRows = proxy.getRows(),
                        row = $target.closest('tr'),
                        column = $target.closest('td.e-rowcell'),
                        recordIndex = this.getIndexByRow(row),
                        item = model.currentViewData[recordIndex],
                        tooltiptable, tooltipbody, textContent, tooltipWidth,
                        tooltipHeight, containerWidth, containerHeight,
                        columns = model.columns,
                        currentColumn;
                    
                    if (recordIndex >= 0 || row.hasClass("e-footersummaryrow")) {
                        columnIndex = proxy.getCellIndex(e);
                        proxy._cellMouseLeave();

                        if (!e) e = window.event;
                        if (e.originalEvent.pageX || e.originalEvent.pageY) {
                            posx = e.originalEvent.pageX;
                            posy = e.originalEvent.pageY;
                        }
                        else if (e.originalEvent.clientX || e.originalEvent.clientY) {
                            posx = e.originalEvent.clientX + document.body.scrollLeft
                                + document.documentElement.scrollLeft;
                            posy = e.originalEvent.clientY + document.body.scrollTop
                                + document.documentElement.scrollTop;
                        }

                        if (item || row.hasClass("e-footersummaryrow")) {
                            if (columnIndex != model.treeColumnIndex)
                                textContent = column.children().length ? column.children().clone() : column.clone(); // Copying the DOM element of particular cell.
                            else {
                                if (column.find(".e-cell").length > 0)
                                    textContent = column.find(".e-cell").clone();
                                else if (column.hasClass("e-summaryrowcell")) {
                                    if (column.find(".e-summarytitle").length > 0) {
                                        textContent = column.find(".e-summarytitle").clone();
                                    }else{
                                        textContent = column.clone();
                                        $(textContent).css({ "cssText": "padding-left: 0px;" });
                                    }
                                }
                            }
                            tooltiptable = ej.buildTag("table.e-tooltiptable", "", { 'padding': '0' }, { 'cellspacing': '1' });

                            if (!model.showGridExpandCellTooltip || (model.showGridExpandCellTooltip && columnIndex == proxy.model.treeColumnIndex)) {
                                tooltipbody = ej.buildTag("tbody", textContent, {}, {});
                            }
                            tooltiptable.append(tooltipbody);

                            var isNonEmptyText = $(textContent).text().replace(/[ \t\r]+/g, "").length > 0 ? true : false;

                            if (tooltipbody && $(column).find("#" + proxy._id + "EditForm").length == 0) {
                                if (!model.cellTooltipTemplate) {
                                    if (!(model.showGridExpandCellTooltip) && isNonEmptyText
                                        || (model.showGridExpandCellTooltip && isNonEmptyText)) {
                                        var z_index = $("#" + this._id + "detailscellwrapper").length > 0 ? 110 : 5;
                                        proxy._mouseOverTooltip = ej.buildTag("div.e-tooltipgantt#tooltipgantt" + proxy._id + "", tooltiptable,
                                            {
                                                "top": (posy + 10) + "px", "left": (posx + 15) + "px",
                                                'position': 'absolute',
                                                'z-index': z_index,
                                                'padding': '0',
                                                'border-radius': '3px'
                                            }, {});

                                        //Providing a time delay to render the tooltip to improve UI
                                        proxy._tooltipTimer = setTimeout(function () {
                                            $(document.body).append(proxy._mouseOverTooltip);
                                            if (!model.isFromGantt) {
                                                var position = proxy.getOffsetRect(proxy.element[0]);
                                                containerWidth = $(proxy.element).width() + position.left;
                                                containerHeight = $(proxy.element).height() + position.top;
                                            }
                                            else {
                                                var element = $("#" + proxy._id.replace("ejTreeGrid", "")),
                                                    position = proxy.getOffsetRect(element[0]);
                                                containerWidth = $(element).width() + position.left;
                                                containerHeight = $(element).height() + position.top;
                                            }
                                            tooltipWidth = $(proxy._mouseOverTooltip).width();
                                            tooltipHeight = $(proxy._mouseOverTooltip).height();
                                            // Calculation for reposition the tooltip when tooltip is exist the container height or width
                                            if ((posx + tooltipWidth + 15) >= containerWidth) {
                                                posx = posx - tooltipWidth - 15;
                                            }

                                            if ((posy + tooltipHeight + 10) >= containerHeight) {
                                                posy = posy - tooltipHeight - 10;
                                            }
                                            $(proxy._mouseOverTooltip).css({ "top": posy, "left": posx })
                                        }, 700);
                                    }
                                }
                        else if (model.cellTooltipTemplate) {
                            var z_index = $("#" + this._id + "detailscellwrapper").length > 0 ? 110 : 5,
                                dataObj = {};
                            dataObj["record"] = item;
                            dataObj["column"] = columns[columnIndex];
                                proxy._mouseOverTooltip = ej.buildTag("div.e-tooltipgantt#tooltipgantt" + proxy._id + "", "",
                                    {
                                        "top": (posy + 10) + "px", "left": (posx + 15) + "px",
                                        'position': 'absolute',
                                        'z-index': z_index,
                                        'padding': '0',
                                        'border-radius': '3px'
                                    }, {});
                            proxy.tooltipState = "Template";
                            var tooltipbody = ej.buildTag("tbody", $.render[proxy._id + "tooltipTemplate"](dataObj), {}, {});
                                proxy._mouseOverTooltip[0].innerHTML = "<table>" + tooltipbody[0].innerHTML + "</table>";
                                proxy._tooltipTimer = setTimeout(function () {
                                    $(document.body).append(proxy._mouseOverTooltip);
                                    if (!model.isFromGantt) {
                                        var position = proxy.getOffsetRect(proxy.element[0]);
                                        containerWidth = $(proxy.element).width() + position.left;
                                        containerHeight = $(proxy.element).height() + position.top;
                                    }
                                    else {
                                        var element = $("#" + proxy._id.replace("ejTreeGrid", "")),
                                            position = proxy.getOffsetRect(element[0]);
                                        containerWidth = $(element).width() + position.left;
                                        containerHeight = $(element).height() + position.top;
                                    }
                                    tooltipWidth = $(proxy._mouseOverTooltip).width();
                                    tooltipHeight = $(proxy._mouseOverTooltip).height();
                                    // Calculation for reposition the tooltip when tooltip is exist the container height or width
                                    if ((posx + tooltipWidth + 15) >= containerWidth) {
                                        posx = posx - tooltipWidth - 15;
                                    }

                                    if ((posy + tooltipHeight + 10) >= containerHeight) {
                                        posy = posy - tooltipHeight - 10;
                                    }
                                    $(proxy._mouseOverTooltip).css({ "top": posy, "left": posx })
                                }, 700);
                            }

                    }
                }
            }
        }

     }
 },
        _cellMouseLeave: function () {

            var proxy = this;
            if (proxy._mouseOverTooltip != null) {
                $("#tooltipgantt").remove();
                window.clearTimeout(proxy._tooltipTimer);
                $(proxy._mouseOverTooltip).remove();
            }
        },

        disableTooltip: function () {
            this._cellMouseLeave();
        },
       
        _createTooltipTemplate: function () {

            var proxy = this,
                td,
                columnHeaderTexts = proxy.model.columnHeaderTexts,
                helpers = {
                    _getTaskName: proxy._tooltipTaskName
                },
                template = proxy.model.cellTooltipTemplate;
               var parentTr = null;
            $.views.helpers(helpers);
            var templateString = "";
            if (template) {

                if (document.getElementById(template)) {
                    templateString = $("#" + template)[0].innerHTML;
                } else {
                    templateString = template;
                }
                 parentTr = templateString;
                
            }
            else {
                var parentTr = "<tr class='e-tooltip_rowcell'>";

                td = "{{if ~_getTaskName()}}" +
                    "<td class='e-tooltiptaskname' style='height:auto;width:auto;font-weight:normal;'>{{:ttiptaskname}}</td>{{/if}}";

                parentTr += td;
                parentTr += "</tr>";
            }
            var templates = {};
            templates[proxy._id + "tooltipTemplate"] = parentTr;
            $.templates(templates);
        },

        _tooltipTaskName: function () {
            return this.data.ttiptaskname;
        },

        //SCROLL EVENT FOR VIRTUALIZATION
        _onScroll: function (args) {

            var proxy = this,
                model = this.model,
                hScrollDist;
            proxy._popupHide();
            proxy._clearContextMenu();

            $("#" + this._id + "detailscellwrapper").length > 0 && this._removeDetailsRow();

            if (proxy.model.showGridCellTooltip) {
                proxy._cellMouseLeave();
            }

            if (!proxy.isVScroll() && !proxy.model.isFromGantt && args.source === "wheel") {
                args.cancel = true;
                return;
            }

            if (args.scrollLeft != undefined) {
                proxy._scrollLeft = args.scrollLeft;
                hScrollDist = Math.abs(proxy._scrollLeft - proxy._prevScrollLeft);
            }

            if (hScrollDist) {
                proxy._updateHeaderScrollLeft(proxy._scrollLeft);
                proxy._prevScrollLeft = proxy._scrollLeft;
            }
            
            if (args.scrollTop != undefined) {

                /*Cancel if treegrid is in edit*/
                if (proxy.model.isEdit) {
                    proxy.cancelEditCell();
                    proxy._focusTreeGridElement();
                }
                else if (proxy._isRowEdit) {
                    proxy.cancelRowEditCell();
                    proxy._focusTreeGridElement();
                }

                proxy._scrollTop = args.scrollTop; //Maintain the scroll top for dynamic update of virtualization and non-virtualization mode.
                proxy._vScrollDist = Math.abs(proxy._scrollTop - proxy._prevScrollTop);
                //CHECK VIRTUALIZATION IS ENABLED OR NOT
                if (proxy.model.enableVirtualization) {

                    proxy._vScrollDir = proxy._prevScrollTop <= proxy._scrollTop ? 1 : -1;
                    //console.log("VScrollDist:" + proxy._vScrollDist);
               
                    if (proxy._vScrollDist) {
                        proxy._updateCurrentViewData();
                        proxy._prevScrollTop = proxy._scrollTop;
                    }
                }
                proxy._scrollTop = args.scrollTop;
                if(this._frozenColumnsLength)
                    proxy.getContent().find("#e-frozencontainer" + proxy._id).scrollTop(proxy._scrollTop);
            }
        },

        //Save the edited row

        _saveRow:function()
        {
            var proxy = this,
                model = proxy.model,
                form = $("#" + proxy._id + "EditForm"),
                frozenForm = $("#" + proxy._id + "EditFrozenForm"),
                formElement = frozenForm.add(form).find("td"),
                index = this.getIndexByRow(form.closest("tr")),
                isAddRow = form.closest("tr").hasClass("e-addedrow"),
                columns = model.columns,
                columnLength = columns.length,
                currentItem =model.currentViewData[index],
                currentValue = {},
                previousValue = {},
                args = {};

           proxy._focusTreeGridElement();

            if (form.length <= 0 && index == -1)
                return;

            for (i = 0; i < columnLength; i++) {
                column = columns[i];
                if (!ej.isNullOrUndefined(column)) {
                    if (column.visible) {
                        value = proxy.getCurrentEditCellDataForRowEdit(column["field"], column["editType"], i);
                        //To avoid duplicate ID for TreeGrid on self reference while row editing
                        if (model.idMapping && model.parentIdMapping && column["field"] == model.idMapping) {
                            if (proxy._validateIdValue(value))
                                value = currentItem[column["field"]]; //Replacing the old value
                        }
                        previousValue[column["field"]] = currentItem.item[column["field"]];
                        currentValue[column["field"]] = currentItem[column["field"]] = currentItem.item[column["field"]] = value;
                    }
                    else
                        previousValue[column["field"]] = currentValue[column["field"]] = currentItem[column["field"]];
                }
            }

            if (!isAddRow) {
                args.rowIndex = proxy.selectedRowIndex();
                args.previousValue = previousValue;
                args.requestType = "update";
                args.currentValue = currentItem.item;
                args.rowElement = form.add(frozenForm).closest("tr");
                if (proxy._trigger("endEdit", args)) {
                    for (i = 0; i < columnLength; i++) {
                        column = columns[i];
                        if (!ej.isNullOrUndefined(column))
                            if (column.visible)
                                currentItem[column["field"]] = currentItem.item[column["field"]] = previousValue[column["field"]];
                    }
                }
            }
            else {
                args.rowIndex = proxy.selectedRowIndex();
                args.previousValue = previousValue;
                args.requestType = "addNewRow";
                args.addedRow = proxy._checkIsEmptyRow(currentItem.item) ? null : currentItem.item;
                args.rowElement = form.closest("tr");
                if (proxy._trigger("actionComplete", args)) {
                    for (i = 0; i < columnLength; i++) {
                        column = columns[i];
                        if (!ej.isNullOrUndefined(column))
                            if (column.visible)
                                currentItem[column["field"]] = currentItem.item[column["field"]] = previousValue[column["field"]];
                    }
                }
            }

            /* delete the row if new added row is not have any values */
            if (proxy._checkIsEmptyRow(currentItem.item) && isAddRow) {
                var deleteValueUpdated = false;
                proxy._isEmptyRow = true;
                if (!model.editSettings.allowDeleting) {
                    deleteValueUpdated = true;
                    model.editSettings.allowDeleting = true;
                }
                proxy.deleteRow();
                proxy._isEmptyRow = false;
                if (deleteValueUpdated) {
                    model.editSettings.allowDeleting = false;
                }
            } else {
                // Save the edited row           
                ej.TreeGrid.refreshRow(proxy, index);
                if (isAddRow && currentItem.parentItem && currentItem.parentItem.childRecords.length == 1) {
                    ej.TreeGrid.refreshRow(proxy, model.currentViewData.indexOf(currentItem.parentItem));
                }
            }
            proxy._isRowEdit = false;
            if (model.currentViewData.length > 0 && model.enableAltRow && !model.enableVirtualization)
                ej.TreeGrid.updateAltRow(proxy, model.currentViewData[0], 0, 0);
            if (model.showSummaryRow) {
                args.editType = "rowedit";
                if (args.requestType == "addNewRow" && model.editSettings.rowPosition == "child") {
                    proxy._createAndRenderSummaryRecords(args);
                }
                proxy._updateSummaryRow(args);
            }
            if (model.showTotalSummary) {
                args.editType = "rowedit";
                proxy._updateTotalSummaryRow(args);
            }
            proxy._cancelSaveTools();
            var colObject = columns.filter(function (column) {
                if (column.filterEditType == "dropdownedit" && column.editType != "dropdownedit")
                    return true;
            });
            if (model.allowFiltering && colObject.length)
                proxy._resizeFilteringElements();

        },
        _excludeDetailRows : function()
        {
            var $gridRows = $(), model = this.model;
            if (this.getTreeGridRows() && this.getTreeGridRows().length > 0) {
                if (model.showDetailsRow && model.detailsTemplate) {
                    if (this._frozenColumnsLength > 0)
                        $gridRows = [$(this.getTreeGridRows()[0]).not(".e-detailsrow"), $(this.getTreeGridRows()[1]).not(".e-detailsrow")];
                    else
                        $gridRows = $(this.getTreeGridRows()).not(".e-detailsrow");
                }
                else {
                    if (this._frozenColumnsLength > 0)
                        $gridRows = [$(this.getTreeGridRows()[0]), $(this.getTreeGridRows()[1])];
                    else
                        $gridRows = $(this.getTreeGridRows());
                }
            }
            return $gridRows;
        },

        getIndexByRow: function ($tr) {
            var $gridRows = this._excludeDetailRows(), rowIndex = -1;
            if (this._frozenColumnsLength > 0) {
                rowIndex = $($gridRows[0]).index($tr);
                if (rowIndex == -1)
                    rowIndex = $($gridRows[1]).index($tr);
                return rowIndex;
            }
            return $gridRows.index($tr);
        },
        /*get all treegrid rows with details rows*/
        getTreeGridRows: function () {
            return this._gridRows;
        },

        _keyDown: function (e) {
            var proxy = this;
            if (e.shiftKey && proxy._shiftKeyFirstElementDetails.firstElementRowIndex == -1) {
                proxy._shiftKeyFirstElementDetails.firstElementRowIndex = proxy._focusingRowIndex;
                proxy._shiftKeyFirstElementDetails.firstElementCellIndex = proxy._cellIndex;
            }
        },

        /*focus treegrid element*/
        _focusTreeGridElement: function () {
                if (this.getBrowserDetails().browser == "msie")
                    this.element[0].setActive();
                else
                    this.element[0].focus();
        },
        //CLICK HANDLER FOR PERFORM ROWSELECTION AND EXPANDCOLLAPSE THE RECORD
        _onClick: function (e) {

            var proxy = this,
                model = proxy.model,
                $target = $(e.target), currentRowIndex, args = {}, rowIndex = -1, expandRecord,
                updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;
            /* check inner treegrid click events and  */
            if ($target.closest(".e-treegrid").attr("id") !== this._id) return false;
            proxy._clearContextMenu();
            this._removeDetailsRow(e);
            proxy._cellIndex = proxy.getCellIndex(e);
            this.getHeaderTable().find(".e-cancel").addClass("e-hide");
            if ((model.editSettings.beginEditAction == "click" || $target.hasClass('e-treegridexpand')
                || $target.hasClass("e-treegridcollapse")) && $target.closest('.e-scrollbar').length==0) {  //
                                rowIndex = proxy.getRowIndex(e);
                                if(model.editSettings.editMode.toLowerCase() == "cellediting")
                                    proxy._cellEditingDetails.rowIndex = rowIndex;
                                expandRecord = model.currentViewData && model.currentViewData[rowIndex];
                            }          
            proxy._saveCellHandler(e);
            if ($target.hasClass("e-summaryrowcell") || $target.hasClass("e-footersummaryrowcell")
                || $target.hasClass("e-summarytitle"))
                return;
            if ($target.hasClass('e-treegridexpand') || $target.hasClass("e-treegridcollapse") && rowIndex != -1) {
                var $tr = $target.closest('tr'),
                    recordIndex = updatedRecords.indexOf(expandRecord),
                    args = {},
                    isExpandCollapseEnabeled;

                args.data = record;
                args.data = expandRecord;
                args.recordIndex = recordIndex;
                args.expanded = $tr.hasClass("e-treegridrowexpand") ? false : true;
                //Set the focus to the element when row or column not in edit mode.
                if ($("#" + proxy._id + "EditForm").length == 0 && ($target.hasClass("e-rowcell") ||  !$target.closest(".e-rowcell").hasClass("e-templatecell"))) {
                   proxy._focusTreeGridElement();
                } else {
                    proxy._cancelEditState();
                }
                if (args.expanded) {

                    isExpandCollapseEnabeled = proxy._trigger("expanding", args);

                } else {

                    isExpandCollapseEnabeled = proxy._trigger("collapsing", args);
                    
                }

                if (!isExpandCollapseEnabeled&&!model.isFromGantt) {

                    /* refresh Added row on expand collapse */
                    if (proxy._isRefreshAddedRecord) {
                        args.data.expanded = args.expanded;
                        proxy.updateExpandStatus(args.data, args.expanded);
                        proxy.refreshContent();
                        proxy.renderRecords();
                        proxy._isRefreshAddedRecord = false;
                    } else {
                        ej.TreeGrid.sendExpandCollapseRequest(proxy, args);
                    }
                }
                
            } else if ($target.hasClass("e-rowcell") || $target.parent().hasClass("e-rowcell") || ($target.closest("td").hasClass("e-rowcell")) || $target.parent().hasClass("e-detailsrowcell") || $target.hasClass("e-detailsrowcell")
                || ($target.closest("td").hasClass("e-rowcell")) && $target.hasClass("e-cell")) {

                //Set the focus to the element when row or column not in edit mode.
                if ($("#" + proxy._id + "EditForm").length == 0 && ($target.hasClass("e-rowcell") || !$target.closest(".e-rowcell").hasClass("e-templatecell"))) {
                    proxy._focusTreeGridElement();
                }
                //Check selction is enabled or not
                if (model.allowSelection) {
                    currentRowIndex = proxy.getIndexByRow($target.closest('tr'));
                    if (model.selectionMode == ej.TreeGrid.SelectionMode.Row) {
                if (model.selectionType == ej.TreeGrid.SelectionType.Multiple) {

                    if (e.ctrlKey) proxy._multiSelectCtrlRequest = true;

                    if (e.shiftKey) {
                        currentRowIndex = proxy.getIndexByRow($target.closest('tr'));
                                record = model.currentViewData[currentRowIndex];
                                currentRowIndex = model.updatedRecords.indexOf(record);
                        proxy._multiSelectShiftRequest = true;
                        if (!proxy._rowSelectingEventTrigger(this.selectedRowIndex(), currentRowIndex)) {
                                    if (proxy.getRows() && proxy._prevSelectedItem != null) {
                                        if (proxy.getExpandStatus(proxy._prevSelectedItem))
                                            proxy.selectRows(model.updatedRecords.indexOf(proxy._prevSelectedItem), currentRowIndex);
                                        else
                                            proxy.selectRows(currentRowIndex);
                            }
                                    else if (proxy.getRows() && proxy._prevSelectedItem == null) {
                                        proxy.selectRows(0, currentRowIndex);
                            }
                            proxy._cancelSaveTools();
                            proxy._rowSelectedEventTrigger(currentRowIndex);
                        }
                    }
                }
                if (!proxy._multiSelectShiftRequest && ($("#" + proxy._id + "EditForm").length == 0 || model.editSettings.beginEditAction == "click")) {

                    recordIndex = proxy.getIndexByRow($target.closest('tr'));

                    if (recordIndex != -1) {

                        record = model.currentViewData[recordIndex];
                        if (model.allowPaging)
                            currentRowIndex = proxy._updatedPageData.indexOf(record);
                        else
                            currentRowIndex = model.updatedRecords.indexOf(record);

                                if (!proxy._rowSelectingEventTrigger(this.selectedRowIndex(), currentRowIndex)) {
                            proxy.selectRows(currentRowIndex);
                            proxy._cancelSaveTools();
                            proxy._rowSelectedEventTrigger(currentRowIndex);
                        }
                    }
                }
                proxy._multiSelectShiftRequest = false;
                    }
                    if (model.selectionMode == ej.TreeGrid.SelectionMode.Cell && $("#" + proxy._id + "EditForm").length == 0 && proxy._cellIndex != -1 &&
                        currentRowIndex != -1) {
                        var frozenColumnRowIndex = proxy._cellIndex >= proxy._frozenColumnsLength ? 1 : 0;
                        if (proxy._frozenColumnsLength > 0) {
                            targetRow = proxy.getRows()[frozenColumnRowIndex][currentRowIndex];
                        }
                        else
                            targetRow = proxy.getRows()[currentRowIndex];
                        var columns = model.columns,
                            record = model.currentViewData && model.currentViewData[currentRowIndex],
                            targetIndex = model.updatedRecords.indexOf(record),
                            targetCellIndex = proxy._cellIndex >= proxy._frozenColumnsLength ? proxy._cellIndex - proxy._frozenColumnsLength : proxy._cellIndex,
                            target = targetRow.childNodes[targetCellIndex],
                            previousRowIndex = proxy._previousSelectedCellDetails.rowIndex,
                            previousCellIndex = proxy._previousSelectedCellDetails.cellIndex,
                            targetCell = $(target).closest("td"),
                            currentCellIndex;
                        proxy._focusingRowIndex = targetIndex;

                        if (currentRowIndex != -1) {

                            if (record.isSummaryRow)
                                return;
                            var args = {
                                rowIndex: targetIndex,
                                cellIndex: targetCellIndex,
                                rowElement: targetRow,
                                cellElement: targetCell[0]
                            };
                            
                            var selectedCellInfo = {
                                rowIndex: targetIndex,
                                cellIndex: targetCellIndex,
                                cellElement: targetCell[0],                                
                                data: record
                            };

                            if (!proxy._cellSelectingEventTrigger(args) && columns[targetCellIndex].allowCellSelection) {
                                if (model.selectionType == "multiple" && (e.ctrlKey || e.shiftKey)) {
                                    //Select Multiple cells dynamically using Ctrl Key + mouse click.
                                    if (e.ctrlKey) {
                                        currentCellIndex = proxy._selectedCellDetails.map(function (e) { return e.cellElement; }).indexOf(targetCell[0]);
                                        if (currentCellIndex == -1) {                                           
                                            $(targetCell[0]).addClass("selectingcell");
                                                proxy._selectedCellDetails.push(selectedCellInfo);                                            
                                            model.selectedCellIndexes.push({ rowIndex: selectedCellInfo.rowIndex, cellIndex: selectedCellInfo.cellIndex });
                                                proxy._cellSelectedEventTrigger(args, proxy._previousSelectedCellDetails);
                                        }
                                        else {
                                            $(targetCell[0]).removeClass("selectingcell");
                                            proxy._selectedCellDetails.splice(currentCellIndex, 1);
                                            model.selectedCellIndexes.splice(currentCellIndex, 1);
                                        }                                       
                                    }
                                        //Select multiple cells using Shift Key + mouse Click.
                                    else if (e.shiftKey) {
                                        var args = {
                                            rowIndex: targetIndex,
                                            cellIndex: proxy._cellIndex,
                                        };
                                        proxy._shiftKeySelectCells(args);
                                        proxy._rowIndexOfLastSelectedCell = targetIndex;
                                        proxy._focusingRowIndex = proxy._shiftKeyFirstElementDetails.firstElementRowIndex;                                     
                                    }
                                }
                                    //Select single cell using mouse click.
                                else  {
                                    proxy._selectedCellDetails = [];
                                    model.selectedCellIndexes = [];
                                    $("#" + proxy._id).find(".selectingcell").removeClass("selectingcell");
                                    $(targetCell[0]).addClass("selectingcell");
                                    proxy._selectedCellDetails.push(selectedCellInfo);
                                    model.selectedCellIndexes.push({ rowIndex: selectedCellInfo.rowIndex, cellIndex: selectedCellInfo.cellIndex });                                   
                                    proxy._cellSelectedEventTrigger(args, proxy._previousSelectedCellDetails);
                                    //Clear the Details of shiftKeyFirstElement.
                                    proxy._shiftKeyFirstElementDetails = {
                                        firstElementRowIndex: -1,
                                        firstElementCellIndex: -1
                                    }
                                    proxy._updateSecondRowIndexBy = 1;
                                }
                                if (!e.shiftKey) {
                                    proxy._previousSelectedCellDetails = {
                                        rowElement: targetRow,
                                        cellElement: targetCell[0],
                                        cellIndex: args.cellIndex,
                                        rowIndex: targetIndex,
                                    }
                                    proxy._rowIndexOfLastSelectedCell = proxy._focusingRowIndex;
                                    proxy._isShiftKeyNavigation = false;
                                }
                            }
                            proxy._cancelSaveTools();
                            //Get back default values to perform keypressed event.                            
                            proxy._lastSelectedCellIndex = proxy._cellIndex;
                        }
                    }
                }
            }

            /* detail row show and hide */
            if (($target.hasClass("e-detailsrowcell") || $target.parent("td").hasClass("e-detailsrowcell")) && !$target.closest("tr").hasClass('e-detailsrow')) {
                if (!e.ctrlKey && !e.shiftKey) {
                    if (proxy._isRowEdit) {
                        this._saveRow();
                    } else
                    {
                        proxy._detailsExpandCollapse($target);
                    }
                }
            }

            if (proxy._isRowEdit)
                $target.focus();
            if (!$target.closest("#" + proxy._id + "_ColumnMenu").hasClass("e-columnmenu"))
            {
                proxy._clearColumnMenu();
            }
            if (model.editSettings.beginEditAction == "click" && $target.closest("#" + proxy._id + "EditForm").length == 0 &&
                !proxy._isShiftKeyNavigation)
                proxy._editdblClickHandler(e);
        },
         /* remove child detail row wraper when detail row contains another treegrid*/
        _removeInnerDetailRows: function ($target, eventCheck)
        {
            /* check if target is in any of detail rows */
            var detailRows = $(".e-detailscellwrapperfly"),
                detailRowsLength = detailRows.length, count = 0, containsFlag = false;

            for (count; count < detailRowsLength; count++) {
                if ($.contains(detailRows[count], $target[0]) || $target == detailRows[count]) {
                    containsFlag = true;
                    break;
                }
            }

            var countFlag = false;
            if (ej.isNullOrUndefined(detailRows[count])) {
                count = detailRows.index($("#" + this._id + "detailscellwrapper"));
                countFlag = true;
            }
            var countFlagString = countFlag ? "" : ",";
            var parentTreeGridId = $(detailRows[count]).attr("parentTreeGridIds");
            var parentDetailWrapperElement = $("[parentTreeGridIds$='" + countFlagString + parentTreeGridId + "']"),
                length = parentDetailWrapperElement.length, i = 0;
            this._triggerDetailRowHideEvent(parentDetailWrapperElement, eventCheck);
        },

        /* trigger detail row collaspse event */
        _triggerDetailRowHideEvent: function (elements, eventCheck)
        {
            var proxy = this,
                model = this.model;
            var length = elements.length, i = 0;

            if (length > 0 && $("#" + this._id + "detailscellwrapper").length > 0)
            {
                var detailElement = $("#" + this._id + "detailscellwrapper"),
                    selectedItem = model.selectedItem;
                var detailsCollapseEventArgs = {};
                detailsCollapseEventArgs.rowData = selectedItem;

                if (!this._trigger("detailsHidden", detailsCollapseEventArgs) || eventCheck) {
                    for (i; i < length; i++) {
                        var treeGridContainerId = $(elements[i]).attr('id').replace("detailscellwrapper", "");
                       
                            $("#" + treeGridContainerId).find(".e-detailsrowexpand").removeClass("e-detailsrowexpand").addClass("e-detailsrowcollapse");
                            $("#" + treeGridContainerId).find(".e-detailsinfoiconhide").removeClass("e-detailsinfoiconhide").addClass("e-detailsinfoiconshow");
                        
                            $(elements[i]).remove();
                    }
                }
            }
        },
        /* remove all child detail row */
        _removeDetailsRow: function (e, eventCheck)
        {
            var model= this.model;
            
                if (e) {
                    var target = $(e.target);
                    var detailCellElement = target;
                    if (target.parent("td").hasClass("e-detailsrowcell"))
                        detailCellElement = target.parent("td");

                    if (target.closest(".e-popup").length == 0 && target[0] != $('html').get(0)) {

                        /* check if target is in any of detail rows */
                        var detailRows = $(".e-detailscellwrapperfly"),
                            detailRowsLength = detailRows.length, count = 0, containsFlag = false;

                        for (count; count < detailRowsLength; count++) {
                            if ($.contains(detailRows[count], target[0]) || target[0] == detailRows[count]) {
                                containsFlag = true;
                                break;
                            }
                        }

                        if (!target.hasClass("e-detailscellwrapperfly") && !detailCellElement.hasClass("e-detailsrowexpand") && !detailCellElement.hasClass("e-detailsrowcollapse")
                            && !containsFlag) {
                            this._removeInnerDetailRows($("#" + this._id + "detailscellwrapper"), eventCheck);
                        }

                        if (target.hasClass("e-detailscellwrapperfly") || detailCellElement.hasClass("e-detailsrowcollapse") || (!detailCellElement.hasClass("e-detailsrowexpand") && containsFlag)) {
                            var countFlag = false;
                            if (ej.isNullOrUndefined(detailRows[count])) {
                                count = detailRows.index($("#" + this._id + "detailscellwrapper"));;
                                countFlag = true;
                            }
                            var countFlagString = countFlag ? "" : ",";
                            var parentTreeGridId = $(detailRows[count]).attr("parentTreeGridIds");
                            var parentDetailWrapperElement = $("[parentTreeGridIds$='" + countFlagString + parentTreeGridId + "']");
                            this._triggerDetailRowHideEvent(parentDetailWrapperElement, eventCheck);
                        }
                    }
                } else {
                    $("#" + this._id + "detailscellwrapper").length > 0 && this._removeInnerDetailRows($("#" + this._id + "detailscellwrapper")[0], eventCheck);
                    this._triggerDetailRowHideEvent($("#" + this._id + "detailscellwrapper"), eventCheck);
                }
            
        },

        /* show hide detail rows public method*/
        
        showHideDetailsRow:function(rowIndex)
        {
            var proxy = this, model = this.model;
            /* save if tree grid is in edit state */
            if (proxy._isRowEdit) {
                this._saveRow();
            }
            if (model.isEdit)
            {
                this.saveCell();
            }

            if (model.showDetailsRow && model.detailsTemplate && model.showDetailsRowInfoColumn && !ej.isNullOrUndefined(rowIndex)
                 && rowIndex <= model.updatedRecords.length && proxy.getExpandStatus(model.updatedRecords[rowIndex])) {
                if (rowIndex != this.selectedRowIndex()) {
                    if (rowIndex != -1 && $.inArray(rowIndex, proxy._selectedRowsIndexes == -1) && model.allowSelection && model.updatedRecords.length > rowIndex) {
                        if (!proxy._rowSelectingEventTrigger(this.selectedRowIndex(), rowIndex)) {
                            proxy.selectRows(rowIndex);
                            proxy._rowSelectedEventTrigger(rowIndex);
                        }
                    }
                }

                this.updateScrollBar(rowIndex);
                var targetRowElement = $(ej.TreeGrid.getRowByIndex(proxy, rowIndex)), targetCellElement;
                if (targetRowElement.length > 0 && model.updatedRecords[rowIndex] && proxy.getExpandStatus(model.updatedRecords[rowIndex]))
                {
                    targetCellElement = $(targetRowElement).find(".e-detailsrowcell");
                    if ($(targetCellElement).length > 0 && $(targetCellElement).hasClass("e-detailsrowcell"))
                    {
                        if (this.element.find(".e-detailsrowexpand")[0] != targetCellElement[0])
                            this._removeDetailsRow();

                            this._detailsExpandCollapse($(targetCellElement))
                    }
                }
            }
        },
        /* expand collapse the detail row */
        _detailsExpandCollapse:function($target)
        {
            var proxy = this,
                model = this.model;
            
            if ($target.parent("td").hasClass("e-detailsrowcell"))
                $target = $target.parent("td");
            var rowElement = $target.closest('tr'),
                detailsIconElement = rowElement.find(".e-detailsrowcell");

            if (detailsIconElement.hasClass("e-detailsrowcollapse")) {

                var rowIndexValue = this.getIndexByRow(rowElement),
                   rowData = this.model.currentViewData[rowIndexValue];
                if (ej.isNullOrUndefined(rowData) || rowData.isSummaryRow)
                    return;
                var rowBottom = this.getOffsetRect(rowElement[0]),
                   detailtr = $($.render[proxy._id + "_detailRowTemplate"](rowData)),
                   detailsCellElement = $(detailtr).find(".e-detailscellwrapper").attr({ "id": this._id + "detailscellwrapper" }),
                   width = proxy._gridWidth - (proxy.element.find(".e-scrollcss").length > 0 ? 18 : 0) - 2;//2 - treegrid border

                /* add treegrid attribute for detail row wraaper element */
                var rowWrapperElement = this.element.parents().filter(".e-detailscellwrapperfly"),
                    wrapperElementID = this._id, tempTreeGridId = "";
                while (rowWrapperElement.length > 0) {
                    tempTreeGridId = rowWrapperElement.attr("id").replace("detailscellwrapper", "");
                    wrapperElementID += "," + tempTreeGridId;
                    rowWrapperElement = $("#" + tempTreeGridId).parents().filter(".e-detailscellwrapperfly");
                }

                detailsCellElement.attr("parentTreeGridIds", wrapperElementID);
                
                //Edge detection for detail rows
                var treeGridContentOffset = this.getOffsetRect(proxy._$gridContent[0]), topPosition, bottomPosition;
                treeGridContentOffset.bottom = treeGridContentOffset.top + proxy._$gridContent[0].offsetHeight;
                topPosition = rowBottom.top + rowElement[0].offsetHeight;
                bottomPosition = topPosition + model.detailsRowHeight;
                if (topPosition > treeGridContentOffset.bottom || bottomPosition > treeGridContentOffset.bottom)
                {
                    var tempTopPosition = rowBottom.top - model.detailsRowHeight;
                    if (tempTopPosition > treeGridContentOffset.top)
                        topPosition = tempTopPosition;
                }

                detailsCellElement.removeClass("e-detailscellwrapper").addClass("e-detailscellwrapperfly");
                var scrollerLeft = proxy.getScrollElement().ejScroller("isHScroll") ? proxy.getScrollElement().ejScroller("option", "scrollLeft") : 0;
                var frozenTableWidth = 0;
                if (this._frozenColumnsLength > 0) {
                    frozenTableWidth = $(this.element).find("#e-frozencontentdiv" + this._id).width();
                }
                detailsCellElement.css({
                    "top": topPosition, "left": rowBottom.left + scrollerLeft - frozenTableWidth,
                                       "z-index": 100, position: "absolute", width: width }).appendTo("body");
                this._trigger("refresh");
                var eventArgs = {};
                eventArgs.detailsElement = detailsCellElement;
                eventArgs.data = rowData;
                eventArgs.rowIndex = this.selectedRowIndex();
                this._trigger("detailsDataBound", eventArgs);

                /* details show/expand event trigger*/
                var expandEventArgs = {};
                expandEventArgs.detailsElement = detailsCellElement;
                expandEventArgs.data = rowData;
                expandEventArgs.rowIndex = this.selectedRowIndex();
                expandEventArgs.appendTarget = null;
                if (this._trigger("detailsShown", expandEventArgs)) {
                    this._removeInnerDetailRows($target);
                }else
                {
                    detailsIconElement.find(".e-detailsinfoiconshow").removeClass("e-detailsinfoiconshow").addClass("e-detailsinfoiconhide");
                    detailsIconElement.removeClass("e-detailsrowcollapse").addClass("e-detailsrowexpand");
                    if (expandEventArgs.appendTarget)
                    {
                        $(detailsCellElement).css({ "top": "auto", left: "auto", position: "auto" });
                        $(detailsCellElement).detach().appendTo($("#" + expandEventArgs.appendTarget));
                    }

                }
            }else
            {
                this._removeInnerDetailRows($target);
            }
        },

        //CLICK HANDLER FOR PERFORM THE SORTING ACTION
        _onHeaderClick: function (e) {

            var proxy = this,
                model = proxy.model;
            proxy._cellMouseLeave();
            proxy._clearContextMenu();
            this._removeDetailsRow();
            if ($(e.target).is(".e-ascending, .e-descending")) e.target = e.target.parentNode;

            var $target = $(e.target),
                columnFieldName,
                columnSortDirection,
                column;

            proxy.getHeaderTable().find(".e-columnheader").find(".e-headercellactive").removeClass("e-headercellactive");
           
            if ($target.closest(".e-headercelldiv") && !$target.hasClass("e-columnmenu-icon")) {
                columnFieldName = $target.closest(".e-headercell").find(".e-headercelldiv").attr("ej-mappingname");
                if (!model.allowSorting || (ej.isNullOrUndefined(columnFieldName) && ej.isNullOrUndefined(this.getColumnByField(columnFieldName)) || this.getColumnByField(columnFieldName).allowSorting == false)) {
                    if (proxy.model.isEdit)
                        proxy.saveCell();
                    else if (proxy._isRowEdit)
                        proxy._saveRow();
                    if (!$target.hasClass("e-checkbox"))
                    return false;
                }
                column = this.getColumnByField(columnFieldName);
                if ($target.closest(".e-headercell").find('span').hasClass("e-ascending")) {
                    columnSortDirection = ej.sortOrder.Descending;
                } else {
                    columnSortDirection = ej.sortOrder.Ascending;
                }

                if (model.allowMultiSorting && e.ctrlKey) {
                    proxy._multiSortRequest = true;
                }
                proxy._isRefreshAddedRecord = false;

                proxy.sortColumn(column.headerText, columnSortDirection);
                if (proxy.model.isFromGantt && this.selectedRowIndex()>=0) {
                    var args = {};
                    args.data = proxy.model.selectedItem;
                    args.target = "ejTreeGrid";
                    args.recordIndex = this.selectedRowIndex();
                    proxy._trigger("rowSelected", args);
                }
            }

            // Show the column menu while clicking the column menu icon

            if ($target.hasClass("e-columnmenu-icon"))
            {
                
                if (!$target.data("isClicked")) {
                    proxy._renderColumnMenu(e);
                    $(".e-columnicon").data("isClicked", false);
                    $target.data("isClicked", true);
                }
                else{
                    proxy._clearColumnMenu();
                    $target.data("isClicked", false);
                }

            }
            else
                proxy._clearColumnMenu();
            if ($target.hasClass("e-checkbox"))
                return true
            else
                return false;
        },

        // Method to trigger the column resizing events.
        _triggerColumnResize: function (event, _x, e) {
            var proxy = this;
            var _rowobj = proxy.getHeaderTable().find(".e-columnheader");
            var _childTH = _rowobj.find(".e-headercell");
            var cellIndex = proxy._cellIndex, newWidth;
            var target = $(proxy._target), columnIndex = []; col = [];
            if (event == "columnResizeStart") {
                proxy._orgX = _x;
                cellIndex = proxy._currentCell = proxy._cellIndex= proxy.getCellIndex(e);
            }
            if (proxy._currentCell !=-1) {
                var _outerCell = _childTH[proxy._currentCell];
                var _oldWidth = _outerCell.offsetWidth;
                // condition for column resize start event
                if (event == "columnResizeStart") {
                    var args = {};
                    args = { columnIndex: cellIndex, column: proxy.model.columns[cellIndex], target: $(_outerCell), oldWidth: _oldWidth };
                    return proxy._trigger("columnResizeStart", args);
                }
                    //condition for column resize end event
                else if (event == "columnResizeEnd") {
                    var _childth = _rowobj.find(".e-headercell").not(".e-detailheadercell").filter(":visible");
                    //to calculate old, new and extra width values for event argument
                    var _extra = _x - proxy._orgX;
                    proxy._newWidth = _oldWidth + _extra;
                    proxy.__oldWidth = _oldWidth;
                    var args = {};
                    args = { columnIndex: cellIndex, column: model.columns[cellIndex], target: $(_outerCell), oldWidth: _oldWidth, newWidth: proxy._newWidth, extra: _extra };
                    return proxy._trigger("columnResizeEnd", args);
                }
                    //condition for column resized event
                else {
                    var args = {};
                    //to calculate old, new and extra width values for event argument
                    var _extra = _x - proxy._orgX;
                    newWidth = _oldWidth + _extra;
                    args = { columnIndex: cellIndex, column: model.columns[cellIndex], oldWidth: proxy.__oldWidth, newWidth: proxy._newWidth };
                    return proxy._trigger("columnResized", args);
                }
            }
        },

        //HEADER MOUSE DOWN EVENT FOR COLUMN RESIZING
        _headerMouseDown: function (e) {

            var proxy = this,
                $target = $(e.target),
            div = $target.closest('tr');
                model = proxy.model;
            proxy._cellMouseLeave();
           
            if (model.allowColumnResize) {
                this._target = e.target;
                var _x = e.clientX, _y = e.clientY,
                    isFrozenColumn;
                if (navigator.userAgent.indexOf("WebKit") != -1) {
                    _x = e.pageX;
                    _y = e.pageY - document.body.scrollTop;
                }
                if (div.length > 0 && div[0].style.cursor == "col-resize" && !$(e.target).hasClass("e-columnicon")) {
                    if ($(e.target).is(".e-headercelldiv"))
                        e.target = e.target.parentNode;
                    this._target = e.target;

                    if (proxy._frozenColumnsLength > 0) {
                        var columnFieldName = $(e.target).closest(".e-headercell").find(".e-headercelldiv").attr("ej-mappingname"),
                         column = proxy.getColumnByField(columnFieldName);
                        isFrozenColumn = proxy._frozenColumns.indexOf(column) > -1 ? true : false;
                    }
                    // Event triggered when we start to resize the column
                    if (isFrozenColumn || this._triggerColumnResize("columnResizeStart", _x, e))
                        return;
                }
                    proxy._resizer._mouseDown(e)
            };

            if (($(e.target).hasClass("headercelldiv") && $(e.target).hasClass("headercell"))) {

                var $headercell = $(e.target).hasClass("headercelldiv") ? $(e.target).parent() : $(e.target);
                model.headerEffects && $headercell.addClass("headercellactive");

            }
        },

        //TREE GRID CONTENT MOUSE DOWN EVENT

        _contentMouseDown: function (e) {
            var $target = $(e.target),
                proxy = this;
            if ($target.hasClass("e-vhandle") || $target.hasClass("e-vscrollbar") || $target.hasClass("e-vup") || $target.hasClass("e-vdown")
                  || $target.hasClass("e-vhandlespace") || $target.hasClass("e-hhandle") || $target.hasClass("e-hscrollbar") || $target.hasClass("e-hdown")
                  || $target.hasClass("e-hhandlespace"))
            {
                proxy._clearContextMenu();
                proxy._clearColumnMenu();
            }
        },


        //EVENT FOR COLUMN RESIZE
        _enableColumnResizeEvents: function () {

            var proxy = this;

            if (proxy.model.allowColumnResize) {
                proxy._on(proxy.element, "mousemove", proxy._mouseMove);
                proxy._on(proxy.element, "mouseup", proxy._mouseUp);
            } else {
                proxy._off(proxy.element, "mousemove", proxy._mouseMove);
                proxy._off(proxy.element, "mouseup", proxy._mouseUp);
            }
        },


        _mouseMove: function (e) {

            var proxy = this, model = this.model;

            if (proxy.model.allowColumnResize) {
                proxy._resizer._mouseMove(e);
                if (proxy._resizer._expand)
                    proxy._cancelEditState();
                if ($(e.target).parent().css("cursor") !== "col-resize") {
                    if ((model.allowSorting || model.showColumnChooser) && !$(e.target).closest("th").hasClass("e-detailheadercell")) {
                        proxy.getHeaderTable().find(".e-columnheader").css({ 'cursor': 'pointer' });
                    } else {
                        proxy.getHeaderTable().find(".e-columnheader").css({ 'cursor': 'default' });
                    }
                }
            }
        },


        _mouseUp: function (e) {

            var proxy = this,
                model = proxy.model;

            if (model.allowColumnResize) {
                
                if ($(e.target).hasClass('e-headercelldiv') || $(e.target).hasClass('e-reSizeColbg')) {
                    proxy._focusTreeGridElement();
                    proxy._clearColumnMenu();
                }

                // if treegrid column resizer initiated
                if (proxy._resizer._expand) {
                    var _x = e.clientX, _y = e.clientY;
                    if (navigator.userAgent.indexOf("WebKit") != -1) {
                        _x = e.pageX;
                        _y = e.pageY;
                    }
                    // Event triggered when we mouse the column resize
                    if (proxy._currentCell && this._triggerColumnResize("columnResizeEnd", _x, e))
                    {
                        this.element.find(".e-reSizeColbg").remove();
                        return;
                    }
                    proxy._resizer._mouseUp(e);
                    // Event triggered after column resized
                    if (proxy._currentCell && this._triggerColumnResize("columnResized", _x, e))
                        return;
                    if (model.isFromGantt)
                        proxy.refreshScroller(proxy._$gridContent.width());
                    else {
                        proxy.getScrollElement().ejScroller("refresh");
                        proxy._updateHeaderScrollLeft();
                    }
                    proxy._updateScrollCss();
                    proxy._resizeFilteringElements();
                }
            }
        },

        // resize the filtering elements after column resized.

        _resizeFilteringElements:function()
        {
            var proxy = this;
            if (proxy.model.allowFiltering) {
                var args = {}, colLength = proxy.model.columns.length;
                ej.TreeGrid.Actions.Filter = "filtering";
                args.requestType = ej.TreeGrid.Actions.Filter;
                for (var item = 0; item < colLength ; item++) {
                    proxy.model.columns[item].width = proxy.columnsWidthCollection[item];
                    args.fieldname = proxy.model.columns[item].field;
                    this._filteringElements(args);
                }
            }
        },

        //ENABLE THE EDITING EVENTS
        _enableEditingEvents: function () {

            var proxy = this,
                model = proxy.model;

            if (model.editSettings.allowEditing) {
                proxy._on(proxy.element, "dblclick", ".e-gridcontent", proxy._editdblClickHandler);
            } else {
                proxy._off(proxy.element, "dblclick", ".e-gridcontent", proxy._editdblClickHandler);
            }
        },


        //ENABLE THE MOUSEDOWNEVENT HANDLER FOR SAVE CELL
        _saveCellHandler: function (e) {

            var $target = $(e.target),
                proxy = this, model = proxy.model, targetIndex;
            if (model.isFromGantt && $target.closest("tr").length) {
                var $targetElement = $target.closest("tr"),
                    $gridRows = proxy.getRows(),
                    rowIndex = this.getIndexByRow($targetElement),
                    record = model.currentViewData && model.currentViewData[rowIndex];
                targetIndex = model.updatedRecords.indexOf(record);             
            }
            //SKIP THE SCROLL BAR CLICK IN TREE GRID.
            if ($target.hasClass("e-vhandle") || $target.hasClass("e-vscrollbar") || $target.hasClass("e-vup") || $target.hasClass("e-vdown") || $target.hasClass("e-vhandlespace") || $target.hasClass("e-vscroll"))
                return;
            if ($target.hasClass("e-hhandle") || $target.hasClass("e-hscrollbar") || $target.hasClass("e-hup") || $target.hasClass("e-hdown") || $target.hasClass("e-hhandlespace") || $target.hasClass("e-hscroll"))
                return;
            e.stopPropagation();
            if ($target.closest(".e-gridcontent").length > 0 || $target.hasClass(".e-gridcontent")) {
                if (proxy._isRowEdit) {
                    if ($target.closest("form#" + proxy._id + "EditForm").length == 0 && $target.closest("form#" + proxy._id + "EditFrozenForm").length == 0 &&  $("#" + proxy._id + "EditForm").length > 0)
                        proxy._saveRow();
                }else if ($target.closest(".e-popup").length == 0 &&
                     $target.closest(".e-rowcell").find("#" + proxy._id + "EditForm").length == 0 && $target.closest("form#" + proxy._id + "EditFrozenForm").length == 0 &&  $("#" + proxy._id + "EditForm").length > 0) {
                    proxy.saveCell();
                }
            }

            //Row selection for Gantt alone here
            //Why because, To select the clicked row after saving the edited cell (Due to predecessor and Row refresh)
            if (model.selectedMode == "row" && model.isFromGantt && model.updatedRecords.length && !ej.isNullOrUndefined(targetIndex) && !$target.hasClass('e-treegridexpand') && !$target.hasClass("e-treegridcollapse")) {
               if (this.selectedRowIndex() != targetIndex && !proxy._rowSelectingEventTrigger(this.selectedRowIndex(), targetIndex)) {
                    if (model.allowSelection)
                   proxy.selectRows(targetIndex);
                   proxy._rowSelectedEventTrigger(targetIndex);
               }
           }
        },

        //Mouse right click (Context Menu) handler

        _rightClick: function (e) {
            e.preventDefault();
            var proxy = this,
                model = proxy.model,
               $target = $(e.target),
               div = $target[0].parentNode,
               $ganttGridRows,
               row,
               recordIndexr,
               item, selectIndex,
               args = {},
               checkEditMenu = false,
               updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;
            /* check inner treegrid click events and  */
            if ($target.closest(".e-treegrid").attr("id") !== this._id) return false;

            if (proxy.model.contextMenuSettings.showContextMenu) {
                proxy._clearContextMenu();
                this._removeDetailsRow();
                proxy.disableTooltip();
                if ($target.hasClass("e-summaryrowcell") || $target.hasClass("e-summarytitle"))
                    return;
                if ($target.hasClass("e-cell") || $target.hasClass("e-treegridexpand"))
                    div = $target.closest('tr');
                row = $target.closest('tr');
                recordIndexr = proxy.getIndexByRow(row);
                proxy.model.currentViewData = proxy.getCurrentViewData();
                item = proxy.model.currentViewData[recordIndexr];
                recordIndexr = updatedRecords.indexOf(item);
                args.data = item;
                args.recordIndex = recordIndexr;
                if (model.isEdit)
                    checkEditMenu = ($target.closest(".e-rowcell").find("form#" + proxy._id + "EditForm").length > 0) || ($target.closest(".e-rowcell").find("form#" + proxy._id + "EditFrozenForm").length > 0);
                else if (this._isRowEdit) {
                    checkEditMenu = ($target.closest(".e-rowedit").find("form#" + proxy._id + "EditForm").length > 0) || ($target.closest(".e-rowedit").find("form#" + proxy._id + "EditFrozenForm").length > 0) ||
                                    ($target.closest(".e-addedrow").find("form#" + proxy._id + "EditForm").length > 0) || ($target.closest(".e-addedrow").find("form#" + proxy._id + "EditFrozenForm").length > 0);
                }
                /* save edited value before rendering contextmenu on non edited cell*/
                if (!checkEditMenu) {
                    if (model.isEdit)
                        this.saveCell();
                    else if (this._isRowEdit)
                        this._saveRow();
                }
                //Context menu for edited row or empty records
                if ((proxy.dataSource() == null || proxy.dataSource().length == 0 || checkEditMenu || model.flatRecords.length == 0)) {
                    proxy._contextMenuItems = [];
                    proxy._contextMenuItems = proxy._getContextMenuItems();
                    proxy._subContextMenuItems = [];
                    proxy._updateContextmenuOption(recordIndexr, item);
                    proxy._clearContextMenu();
                    if (proxy._contextMenuItems.length > 0)
                        proxy._renderContextMenu(e, recordIndexr, item);

                } else if (item) {
                    e.preventDefault();
                    proxy._contextMenuItems = [];
                    proxy._contextMenuItems = proxy._getContextMenuItems();
                    proxy._subContextMenuItems = [];
                    proxy._subContextMenuItems = proxy._getsubContextMenuItems();
                    proxy._updateContextmenuOption(recordIndexr, item);
                    proxy._clearContextMenu();

                    if (model.allowSelection) {
                        if (model.selectionMode == "row" && !proxy._rowSelectingEventTrigger(this.selectedRowIndex(), recordIndexr)) {
                        proxy.selectRows(recordIndexr);
                        proxy._rowSelectedEventTrigger(recordIndexr);
                    }
                        if (model.selectionMode == "cell") {
                            selectCellIndex = proxy.getCellIndex(e);
                            proxy.selectCells([{ rowIndex: recordIndexr, cellIndex: selectCellIndex }]);
                            proxy._rowIndexOfLastSelectedCell = recordIndexr;
                        }
                    }

                    if (proxy._contextMenuItems.length > 0)
                        proxy._renderContextMenu(e, recordIndexr, item);
                    proxy._cancelSaveTools();
                }
            }
            proxy._clearColumnMenu();
        },

        //DOUBLE CLICK EVENT HANDLER FOR DIALOG EDITING

        _editdblClickHandler: function (e) {

            var proxy = this,
                model = proxy.model,
                $form = $("#" + proxy._id + "EditForm"),
                args = {},
                $target = $(e.target),
                row = $target.closest('tr'),
                record,
                cellEditingDetails = proxy._cellEditingDetails;
            if (model.readOnly == true)
            {
                return true;
            }
            if (model.selectionMode == "cell") {
                model.editSettings.editMode = "cellEditing";
            }
            updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;
            if ($target.hasClass("e-vhandle") || $target.hasClass("e-vscrollbar") || $target.hasClass("e-vup") || $target.hasClass("e-vdown") || $target.hasClass("e-vhandlespace") ||
                $target.hasClass("e-treegridexpand") || $target.hasClass("e-treegridcollapse"))
                return;
            if ($target.hasClass("e-hhandle") || $target.hasClass("e-hscrollbar") || $target.hasClass("e-hup") || $target.hasClass("e-hdown") || $target.hasClass("e-hhandlespace"))
                return;
            if ($target.hasClass("e-summaryrowcell") || $target.hasClass("e-footersummaryrowcell")
                || $target.hasClass("e-summarytitle"))
                return;
            /* check inner treegrid click events and  */
            if ($target.closest(".e-treegrid").length && $target.closest(".e-treegrid").attr("id") !== this._id) return false;            

            if ($target.hasClass("e-rowcell") || $target.parent().hasClass("e-rowcell") || ($target.closest("td").hasClass("e-rowcell"))
                || ($target.closest("td").hasClass("e-rowcell")) && $target.hasClass("e-cell")) {

                if (model.editSettings.editMode === "normal" && model.editSettings.allowEditing) {
                    args.requestType = ej.TreeGrid.Actions.BeginEdit;
                    proxy._trigger("actionBegin", args);
                }

                if (proxy._cellEditingDetails.cancelSave) {

                    proxy._cellEditingDetails.cancelSave = false;
                    return;

                }

                if ($form.length === 0 && proxy.getRows() !== null) {

                    if (model.editSettings.editMode.toLowerCase() == "cellediting") {
                        proxy._focusTreeGridElement();
                        proxy._cellEditingDetails.columnIndex = proxy.getCellIndex(e);
                        if (model.editSettings.beginEditAction != "click")
                        proxy._cellEditingDetails.rowIndex = proxy.getRowIndex(e);
                        record = model.currentViewData[proxy._cellEditingDetails.rowIndex];
                        if (record.summaryRow)
                            return;
                        model.selectedItem = record;
                        if (model.columns[cellEditingDetails.columnIndex].allowEditing == false)
                            return;
                        fieldName = proxy._cellEditingDetails.columnIndex >= 0 && model.columns[proxy._cellEditingDetails.columnIndex].field;
                        if (fieldName) {
                            model.editSettings.allowEditing &&
                                model.editSettings.editMode.toLowerCase() == ej.TreeGrid.EditMode.CellEditing.toLowerCase() &&
                                proxy.cellEdit(proxy._cellEditingDetails.rowIndex, fieldName);
                        }
                    }
                    else if (model.editSettings.editMode.toLowerCase() == "rowediting") {
                        model.currentViewData = proxy.getCurrentViewData();
                        if (proxy.getCellIndex(e) != -1 && proxy.getRowIndex(e) != -1) {
                            var rowIndex = proxy.getRowIndex(e);
                            if (model.enableVirtualization) {
                                var selectedItem = model.selectionMode == "row" ? model.selectedItem : model.updatedRecords[proxy._rowIndexOfLastSelectedCell];
                                rowIndex = updatedRecords.indexOf(selectedItem);
                            }
                            proxy._editRow(rowIndex);
                        }
                    }
                    $form = $("#" + proxy._id + "EditForm");
                    if ($form.length > 0)
                        proxy._editAddTools();
                }

                if (!proxy.model.allowSelection)
                    row.find(".e-active").removeClass("e-active").removeClass("e-selectionbackground");
                proxy._clearContextMenu();
                this._removeDetailsRow();
            }
        },

        //To hide the datepicker and dropdown list.
        _popupHide: function (element) {
            var proxy = this,
             column = proxy.model.columns,
             object = null,
             dateobj = null,
             tdElement = element && $(element).closest("td");
            if (proxy.model.allowFiltering) {
                tdElement = element && $(element).closest("td, th");
            }
            var columnChooser = $("#" + proxy._id + "_ColumnMenu").length
            if (columnChooser > 0)
                proxy._clearColumnMenu();
            for (i = 0; i < column.length; i++) {
                object = null;

                if (column[i]) {
                    if (column[i].editType == "datepicker" || column[i].editType == "datetimepicker")
                        object = $("#" + proxy._id + column[i].field).data("ejDatePicker");
                    else if (column[i].editType == "dropdownedit") {
                        var dropdownobject = $("#" + proxy._id + column[i].field).data("ejDropDownList");
                        if (dropdownobject && $(tdElement).find("#" + dropdownobject._id).length == 0)
                            dropdownobject.hidePopup();
                    }                    
                    if (object && $(tdElement).find("#" + object._id).length == 0)
                        object.hide();

                    if (column[i].filterEditType == "datepicker" || column[i].filterEditType == "datetimepicker") {
                        dateobj = $("#" + proxy._id + "_" + column[i].field + "_filterbarcell").data("ejDatePicker");
                        if (dateobj && $(tdElement).find("#" + dateobj._id).length == 0)
                            dateobj.hide();
                    }
                    if (column[i].filterEditType == "dropdownedit") {
                        var dropdownobject = $("#" + proxy._id + "_" + column[i].field + "_filterbarcell").data("ejDropDownList");
                        if (dropdownobject && $(tdElement).find("#" + dropdownobject._id).length == 0)
                            dropdownobject.hidePopup();
                    }
                }
            }
        },
        //PERFORM SCROLLING IN TREEGRID
        _mouseWheel: function (e) {

            var proxy = this,
                delta = null,
                ori = e;            
            proxy._popupHide();
            
            e = e.originalEvent;

            try {
                e.preventDefault ? e.preventDefault() : ori.preventDefault();
            }
            catch (err) {
            }
			
            if (proxy.getScrollElement().height() > proxy._$gridContainer.height()) {
                proxy.getScrollElement().ejScroller("scrollY", 0, true);
                return;
            }

            if (e.wheelDelta) {
                delta = -e.wheelDelta / 120;
                if (window.opera) {
                    if (parseFloat(window.opera.version, 10) < 10)
                        delta = -delta;
                }
            } else if (e.detail) {
                delta = e.detail / 3;
            }
	
            if (!delta) return false;

            var scrollTop = proxy.getScrollElement().ejScroller("option", "scrollTop"),

                change = scrollTop + (delta * 57);  

            var h = this.model.isFromGantt ? parseInt(proxy.model.updatedRecords.length * model.rowHeight) - (proxy._viewPortHeight - 18) : this.getMaxScrollHeight();
            if (change > h) {
                change = h;
            }
            if (change < 0) {
                change = 0;
            }
            proxy._updateScrollTop(change);
            return true;

        },
        _getCollapsedParentItem:function(record)
        {
            var parentRecord = record.parentItem;
            if (parentRecord) {
                if (this.getExpandStatus(parentRecord) === true) {
                    return parentRecord;
                } else {
                    return this._getCollapsedParentItem(parentRecord)
                }
            }
            else {
                return null;
            }
        },


        // Update the scroll bar while edit, expand and collapse the record for focusing the row.
        updateScrollBar: function (rowIndex) {
            var proxy = this,
                model = proxy.model, horizontalScrollBarHeight = 0,
                currentUpdatedRecords, recordIndex,
                rowHeight = model.rowHeight + proxy._detailsRowHeight,
                isInViewPortAbove, isInViewPortBelow,
                updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords,
                selectedItem = model.selectionMode == "row" ? this.selectedItem() : updatedRecords[proxy._rowIndexOfLastSelectedCell];
            if (model.allowPaging && model.sizeSettings.height) {
                currentUpdatedRecords = proxy._updatedPageData;
                recordIndex = currentUpdatedRecords.indexOf(this.selectedItem());
            }
            else {
                currentUpdatedRecords = proxy.getExpandedRecords(updatedRecords);
                if (rowIndex || rowIndex == 0) {
                    recordIndex = currentUpdatedRecords.indexOf(model.updatedRecords[rowIndex]);
                } else {
                    recordIndex = currentUpdatedRecords.indexOf(selectedItem);
                }
            }

            var rowTop = recordIndex * rowHeight,
                rowBottom = rowTop + model.rowHeight,
                scrollTop,
                containerWidth,
                scrollerExist = proxy.getScrollElement().children(".e-content").length;
   
            if (scrollerExist)
                scrollTop = proxy.getScrollElement().children(".e-content").scrollTop();
            else
                scrollTop = proxy.getScrollElement().scrollTop();
    
            if(proxy.getScrollElement().ejScroller("isHScroll")  || proxy.element.find(".e-borderbox").length > 0)
            {
                horizontalScrollBarHeight = 18; /* default horizontal scrollbar height*/
            }

            isInViewPortAbove = (rowTop < scrollTop);
            isInViewPortBelow = (scrollTop + proxy._viewPortHeight - horizontalScrollBarHeight) < rowBottom;


            if (isInViewPortAbove || isInViewPortBelow) {
    
                if ((rowTop + proxy._viewPortHeight) > currentUpdatedRecords.length * rowHeight) {
                    rowTop = currentUpdatedRecords.length * rowHeight - proxy._viewPortHeight;

                    if (isInViewPortBelow)
                        rowTop += horizontalScrollBarHeight;
                }

                    var args = {
                         requestType: "scroll",
                         delta: rowTop
                    };
                    if (scrollerExist)
                        proxy._updateScrollTop(rowTop);
                    else {
                        proxy.getScrollElement().scrollTop(args.delta);
                        proxy._completeAction(args);
                    }
                    if (model.enableVirtualization) {
                       proxy._focusTreeGridElement();
                    }
            }
        },

        //KEY PRESSED EVENT FOR KEY BOARD INTERACTION IN TREEGRID CONTROL

        _keyPressed: function (action, target, e) {

            var proxy = this,
            model = this.model,
            lastRowIndex,
            selectingRowIndex,
            updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords,
            expandedRecords = proxy.getExpandedRecords(model.updatedRecords),            
            currentSelectingRecord;
            this._removeDetailsRow();
            //CHECK THE ALLOWKEYBOARDNAVIGATION
            if (!model.allowKeyboardNavigation){
                return false;
            }

            var returnValue = false,
                $target = $(target);
            $form = $("#" + proxy._id + "EditForm");
            if (action !="downArrow" && action != "upArrow" && action != "saveRequest" && action != "moveCellLeft" && action != "moveCellRight"
                   && action != "cancelRequest" && $target.prop("tagName") == "INPUT") // Skip the keypress event for filter bar input box except enter
                return true;
            var contextMenu, subContextMenu, columnMenu, columnChooserMenu, isVisible, isVisibleColumnChooserMenu;
            if (model.isFromGantt) {
                contextMenu = $("#" + proxy._id.replace("ejTreeGrid", "") + "_ContextMenu");
                subContextMenu = $("#" + proxy._id.replace("ejTreeGrid", "") + "_SubContextMenu");
            }
            else {
                contextMenu = $("#" + proxy._id + "_ContextMenu");
                subContextMenu = $("#" + proxy._id + "_SubContextMenu");
            }
            columnMenu = $("#" + proxy._id + "_ColumnMenu");
            columnChooserMenu = $("#" + proxy._id + "ccDiv_wrapper");
            isVisible = subContextMenu.css("visibility") == "visible" ? true : false;
            isVisibleColumnChooserMenu = columnChooserMenu.is(":visible");
            switch (action) {

                //save the current edited cellValue on Enter key press
                case "saveRequest":
                    if (contextMenu.length == 0 && columnMenu.length == 0) {
                        if (proxy._isRowEdit || proxy.model.isEdit) {
                            $target.blur();
                            proxy._endEdit();
                           proxy._focusTreeGridElement();
                        }
                        if (model.filterSettings.filterBarMode == "onEnter" && model.allowFiltering && $target.closest("th").hasClass("e-filterbarcell"))
                            proxy._filterBarHandler(target);
                    }
                    else
                    {
                        if (contextMenu.length)
                        {
                            proxy._moveToNextMenuItem("save");
                        }
                        else if (columnMenu.length)
                        {
                            var option = null,
                                columnChooserMenuItem = columnChooserMenu.find("div.e-columnmenuselection");                            
                            if (isVisibleColumnChooserMenu) {                                
                                option = columnChooserMenuItem.data("column");
                            }
                            else
                            {
                                var columnMenuItem = columnMenu.find("div.e-columnmenuselection");
                                if (columnMenuItem.length > 0) {
                                    option = columnMenuItem[0].id;
                                }
                            }
                            if (!ej.isNullOrUndefined(option))
                            {
                                $target = proxy._columnMenuTarget;
                                var columnFieldName = $.trim($target.prev("div.e-headercelldiv").attr("ej-mappingname")),
                                column = proxy.getColumnByField(columnFieldName);
                                switch(option)
                                {
                                    case proxy._id + "_SortAscendingChooser":
                                        
                                        if (proxy.model.allowMultiSorting) proxy._multiSortRequest = true;
                                        proxy.sortColumn(column.headerText, ej.sortOrder.Ascending);
                                        proxy._multiSortRequest = false;
                                        break;
                                    case proxy._id + "_SortDescendingChooser":
                                       
                                        if (proxy.model.allowMultiSorting) proxy._multiSortRequest = true;
                                        proxy.sortColumn(column.headerText, ej.sortOrder.Descending);
                                        proxy._multiSortRequest = false;
                                        break;
                                    case proxy._id + "_FreezeColumnsChooser":
                                        if (column && !$(proxy._id + "_FreezeColumnChooser").hasClass("e-disable"))
                                            proxy.freezeColumn(column.field, true);
                                        break;
                                    case proxy._id + "_UnfreezeColumnsChooser":
                                        if (column && !$(proxy._id + "_UnfreezeColumnChooser").hasClass("e-disable"))
                                            proxy.freezeColumn(column.field, false);
                                        break;
                                    case proxy._id + "_FreezePrecedingColumnsChooser":
                                        if (column && !$(proxy._id + "_FreezePrecedingColumnsChooser").hasClass("e-disable"))
                                            proxy.freezePrecedingColumns(column.field);
                                        break;
                                    case proxy._id + "_ColumnLeftChooser":
                                        if (column && !$(proxy._id + "_ColumnLeftChooser").hasClass("e-disable"))
                                            proxy.insertColumnChooser(column, "left");
                                        break;
                                    case proxy._id + "_ColumnRightChooser":
                                        if (column && !$(proxy._id + "_ColumnRightChooser").hasClass("e-disable"))
                                            proxy.insertColumnChooser(column, "right");
                                        break;
                                    case proxy._id + "_DeleteColumnChooser":
                                        if (column && !$(proxy._id + "_DeleteColumnChooser").hasClass("e-disable")) {
                                            proxy._targetColumnIndex = model.columns.indexOf(column);
                                            proxy._updateConfirmDialog.ejDialog("open");
                                            proxy._clearColumnMenu();
                                        }
                                        break;
                                    case proxy._id + "_RenameColumnChooser":
                                        if (column && !$(proxy._id + "_RenameColumnChooser").hasClass("e-disable")) {
                                            proxy._targetColumnIndex = model.columns.indexOf(column);
                                            proxy._renderColumnRenameDialog(column);
                                            proxy._columnRenameDialog.ejDialog("open");
                                            proxy._clearColumnMenu();
                                        }
                                        break;
                                    default:
                                        if (!columnChooserMenuItem.find("span").hasClass("e-disable")) {
                                            var isColumnVisible = columnChooserMenuItem.find("span").attr("aria-checked");
                                            isColumnVisible == "true" ? proxy.hideColumn(option) : proxy.showColumn(option);
                                        }
                                        break;
                                }
                            }
                        }

                    }
                    break;

                    //cancel the cell editing in the current cell Esc key press
                case "cancelRequest":
                    if (contextMenu.length == 0 && columnMenu.length == 0) {
                        if ($form.length > 0) {
                            var editMode = model.editSettings.editMode;
                            if (editMode.toLowerCase() == "cellediting") {
                                if (proxy._isRowEdit)
                                    proxy.cancelRowEditCell();
                                else
                                    proxy.cancelEditCell();
                            }
                            else if (editMode.toLowerCase() == "rowediting") {
                                proxy.cancelRowEditCell();
                            }
                            proxy._cancelSaveTools();
                        }
                       proxy._focusTreeGridElement();
                        if (proxy._dragMouseDown == true) {
                            $(proxy._dragmouseOverTooltip).remove();
                            $(".intend").find(".e-icon").css({ "display": "none" });
                            $(".intendparent").find(".e-icon").css({ "display": "none" });
                            proxy._dropCancel = true;
                            proxy._dragMouseDown = false;
                        }
                    }
                    else {
                        proxy._clearContextMenu();
                        proxy._clearColumnMenu();
                    }
                    break;
                case "editRecord":
                    if (contextMenu.length == 0 && columnMenu.length == 0) {
                        var editSettings = model.editSettings,
                            editMode = editSettings.editMode;
                        if (model.readOnly == false && ((editSettings.allowEditing && model.selectedItems.length == 1) || (editSettings.allowEditing && proxy.model.selectionMode == "cell"))) {
                            if (editMode.toLowerCase() == "cellediting" || proxy.model.selectionMode == "cell") {
                                var column = proxy.model.columns[proxy._cellIndex];
                                if (ej.isNullOrUndefined(column) || !column.visible || column.allowEditing == false)
                                    return;
                                if (proxy.model.selectionMode === "cell")
                                    proxy._cellEditingDetails.rowIndex = this._rowIndexOfLastSelectedCell;
                                else
                                    proxy._cellEditingDetails.rowIndex = this.selectedRowIndex();
                                proxy._cellEditingDetails.columnIndex = proxy._cellIndex;//proxy.getCellIndex(e, target);
                                model.selectedItem = updatedRecords[this.selectedRowIndex()];
                                if (proxy._cellEditingDetails.columnIndex > -1) {
                                    proxy.updateScrollBar();
                                    fieldName = column.field;
                                    fieldName && proxy.cellEdit(proxy._cellEditingDetails.rowIndex, fieldName);
                                    proxy._editAddTools();
                                }
                            }
                            else if (editMode.toLowerCase() == "rowediting" && !proxy._isRowEdit && proxy.model.selectionMode != "cell") {
                                var index = proxy.selectedRowIndex();
                                if (index >= 0) {
                                    if (model.enableVirtualization)
                                        proxy.updateScrollBar();
                                    proxy._editRow(index)
                                }
                            }
                        }
                    }
                    break;
                    //Select first row of current Page if Paging is enabled
                case "topRowSelection":
                    if (model.allowPaging && contextMenu.length == 0 && columnMenu.length == 0) {
                        if (proxy._isRowEdit || proxy.model.isEdit)
                            return true;
                        if (updatedRecords.length > 0) {
                            var topRowIndex = 0;
                            if (updatedRecords[0].isSummaryRow) {
                                var record = proxy._getNextRecord(topRowIndex +1, updatedRecords, action);
                                topRowIndex = updatedRecords.indexOf(record);
                            }
                            if (!proxy._rowSelectingEventTrigger(this.selectedRowIndex(), topRowIndex)) {
                                proxy.selectRows(topRowIndex);
                               proxy._focusTreeGridElement();
                                proxy.updateScrollBar();
                                proxy._rowSelectedEventTrigger(topRowIndex);
                            }
                        }
                    }
                    break;
                    //Move to next page
                case "nextPage":
                    if (model.allowPaging) {
                        var currentPage = proxy._currentPage();
                       proxy._focusTreeGridElement();
                        if (currentPage < model.pageSettings.totalPages)
                            proxy.gotoPage(currentPage + 1);
                    }
                    break;
                    //Move to previous page
                case "prevPage":
                    if (model.allowPaging) {
                        var currentPage = proxy._currentPage();
                       proxy._focusTreeGridElement();
                        if (currentPage != 1)
                            proxy.gotoPage(currentPage - 1);
                    }
                    break;
                    //Select last row of current Page if Paging is enabled
                case "bottomRowSelection":
                    if (contextMenu.length == 0 && columnMenu.length == 0) {
                        if (proxy._isRowEdit || proxy.model.isEdit)
                            return true;
                        if (updatedRecords.length > 0) {

                            var bottomRowIndex = updatedRecords.length - 1;
                            if (updatedRecords[bottomRowIndex].isSummaryRow) {
                                var record = proxy._getNextRecord(bottomRowIndex - 1, updatedRecords, action);
                                bottomRowIndex = updatedRecords.indexOf(record);
                            }
                            if (!proxy._rowSelectingEventTrigger(this.selectedRowIndex(), bottomRowIndex)) {
                                proxy.selectRows(bottomRowIndex);
                               proxy._focusTreeGridElement();
                                proxy.updateScrollBar();
                                proxy._rowSelectedEventTrigger(bottomRowIndex);
                            }
                        }

                    }
                    break;

                    //select the first row while press the Home key 
                case "firstRowSelection":
                    if (contextMenu.length == 0 && columnMenu.length == 0) {
                        if (proxy._isRowEdit || proxy.model.isEdit)
                            return true;

                        if (updatedRecords.length > 0) {
                            if (model.selectionMode == "row" && !proxy._rowSelectingEventTrigger(this.selectedRowIndex(), 0)) {
                                if (model.allowPaging)
                                    proxy.gotoPage(1);
                                proxy.selectRows(0);
                                proxy.updateScrollBar();
                               proxy._focusTreeGridElement();
                                proxy._rowSelectedEventTrigger(0);
                            }
                                //Select first cell of a row.
                            else if (model.selectionMode == "cell") {
                                var rowIndex = proxy._focusingRowIndex,
                                    cellInfo = {
                                        rowIndex: rowIndex,
                                        cellIndex: 0
                                    };
                                proxy._isShiftKeyNavigation = false;
                                proxy._cellIndex = 0;
                                proxy.selectCells([cellInfo]);

                            }
                            proxy._cancelSaveTools();
                        }  
                    }
                    break;

                case "lastRowSelection":
                    if (contextMenu.length == 0 && columnMenu.length == 0) {
                        if (proxy._isRowEdit || proxy.model.isEdit)
                            return true;
                        if (updatedRecords.length > 0) {
                            lastRowIndex = expandedRecords.length - 1;
                            currentSelectingRecord = expandedRecords[lastRowIndex];                            
                            if (currentSelectingRecord.isSummaryRow)
                                currentSelectingRecord = proxy._getNextRecord(lastRowIndex - 1, expandedRecords, action);
                            if (model.allowPaging && currentSelectingRecord) {
                                proxy.gotoPage(model.pageSettings.totalPages);
                                updatedRecords = proxy._updatedPageData;
                            }
                            selectingRowIndex = updatedRecords.indexOf(currentSelectingRecord);
                            if (model.selectionMode == "row" && !proxy._rowSelectingEventTrigger(this.selectedRowIndex(), selectingRowIndex)) {
                                proxy.selectRows(selectingRowIndex);
                               proxy._focusTreeGridElement();
                                proxy.updateScrollBar();
                                proxy._rowSelectedEventTrigger(selectingRowIndex);
                            }
                                //Select last cell of a row.
                            else if (model.selectionMode == "cell") {
                                var rowIndex = proxy._focusingRowIndex, columns = model.columns;
                                proxy._isShiftKeyNavigation = false;
                                proxy._cellIndex = columns.length - 1;

                                var cellInfo = {
                                    rowIndex: rowIndex,
                                    cellIndex: proxy._cellIndex
                                };

                                proxy.selectCells([cellInfo]);
                            }
                            proxy._cancelSaveTools();
                        }
                    }
                    break;
                    //set the edit mode to previous cell by press shift +tab key
                case "moveCellLeft":
                    if (contextMenu.length == 0 && columnMenu.length == 0) {
                        //Row edit Element focusing for Shift + tab key press
                        if (proxy._isRowEdit) {
                            previousElement = $target.closest("td").prev("td");
                            if (this._frozenColumnsLength > 0 && previousElement.length == 0 && $target.closest("#" + proxy._id + "EditForm").length > 0)
                                previousElement = $("#" + proxy._id + "EditFrozenForm").find('td').last();
                            if (previousElement.length)
                                proxy._focusElementsForRowEdit(previousElement);
                        } else if (model.editSettings.allowEditing && model.editSettings.editMode.toLowerCase() == "cellediting" && $form.length > 0) {
                            $target.blur();
                            returnValue = proxy._moveCurrentCell("left");
                        }
                        if (model.allowSelection && model.selectionMode == "cell" && !proxy._isRowEdit && (proxy._focusingRowIndex != 0 || proxy._cellIndex != 0)) {
                            proxy._selectNextCell("left", action);
                    }
                    }
                    break;

                    //set the edit mode to next cell by tab key
                case "moveCellRight":
                    if (contextMenu.length == 0 && columnMenu.length == 0) {
                        if (proxy._isRowEdit) {
                            nextElement = $target.closest("td").next("td");
                            if (this._frozenColumnsLength > 0 && nextElement.length == 0 && $target.closest("#" + proxy._id + "EditFrozenForm").length > 0)
                                nextElement = $($form).find('td').eq(0);
                            if (nextElement.length)
                                proxy._focusElementsForRowEdit(nextElement);
                        } else if (model.editSettings.allowEditing && (model.editSettings.editMode == "cellEditing" || model.selectionMode == "cell" )  && $target && $form.length > 0) {
                            $target.blur();
                            returnValue = proxy._moveCurrentCell("right");
                        }
                        if (model.allowSelection && model.selectionMode == "cell" && !proxy._isRowEdit && (proxy._focusingRowIndex != proxy.getRows().length - 1 || proxy._cellIndex != columnLength - 1)) {
                            proxy._selectNextCell("right", action);
                    }
                    }
                    break;

                    //select the next row by press down arrow key
                case "downArrow":
                    if (model.allowSelection) {
                        if (contextMenu.length == 0 && columnMenu.length == 0) {
                            if (proxy._isRowEdit || proxy.model.isEdit)
                                return true;

                            if (updatedRecords.length > 0 && model.selectedItem && proxy.selectedRowIndex() > -1 && model.selectionMode == "row") {
                                //get the last row index of the ganttchart control
                                lastRowIndex = updatedRecords.length - 1;
                                if (proxy.selectedRowIndex() != lastRowIndex) {
                                    var selectedItem = updatedRecords[proxy.selectedRowIndex()];
                                    selectingRowIndex = expandedRecords.indexOf(selectedItem);
                                    currentSelectingRecord = expandedRecords[selectingRowIndex + 1];
                                        //To skip the key Navigation from summary row.
                                    if (currentSelectingRecord && currentSelectingRecord.isSummaryRow)
                                        currentSelectingRecord = proxy._getNextRecord(selectingRowIndex + 1, expandedRecords);
                                    //if (model.allowPaging && currentSelectingRecord) {                                        
                                    //    selectingRowIndex = updatedRecords.indexOf(currentSelectingRecord);
                                    //    if (selectingRowIndex < 0) {                                           
                                    //        proxy.gotoPage(proxy._currentPage() + 1);
                                    //    }
                                    //}                                    
                                        selectingRowIndex = updatedRecords.indexOf(currentSelectingRecord);
                                    if (currentSelectingRecord && selectingRowIndex <= lastRowIndex && !proxy._rowSelectingEventTrigger(this.selectedRowIndex(), selectingRowIndex)) {
                                        proxy.selectRows(selectingRowIndex);
                                        proxy.updateScrollBar();
                                       proxy._focusTreeGridElement();
                                        proxy._rowSelectedEventTrigger(proxy.selectedRowIndex());
                                    }
                                }
                            proxy._cancelSaveTools();
                        }
                            else if (model.selectionMode == "cell" && proxy.selectedCellIndexes().length > 0) {
                                var rowIndex = proxy._focusingRowIndex + 1, cellIndex = proxy._cellIndex,
                                    recordLength = model.updatedRecords.length;
                                proxy._isShiftKeyNavigation = false;
                                if (rowIndex < recordLength) {
                                    var selectedItem = updatedRecords[proxy._rowIndexOfLastSelectedCell];
                                    selectingRowIndex = expandedRecords.indexOf(selectedItem);
                                    currentSelectingRecord = expandedRecords[selectingRowIndex + 1];
                                    //To skip the key Navigation from summary row.
                                    if (currentSelectingRecord && currentSelectingRecord.isSummaryRow) {
                                        currentSelectingRecord = proxy._getNextRecord(selectingRowIndex + 1, expandedRecords);
                                        rowIndex = updatedRecords.indexOf(currentSelectingRecord);
                                    }
                                    if (currentSelectingRecord) {
                                    cellInfo = {
                                        rowIndex: rowIndex,
                                        cellIndex: cellIndex
                                    };
                                        proxy._focusingRowIndex = rowIndex;
                                        proxy.updateScrollBar();
                                    proxy.selectCells([cellInfo]);
                                }
                            }
                        }
                        }
                        else {
                            if (contextMenu.length) {
                                proxy._moveToNextMenuItem("next");
                            }
                            else if (columnMenu.length) {
                                if (isVisibleColumnChooserMenu) {
                                    var columnChooserMenuItem = columnChooserMenu.find("div.e-columnmenuselection"),
                                       nextItem = columnChooserMenuItem.next("div.e-columnMenuListDiv");
                                    if (nextItem.length > 0) {
                                        columnChooserMenuItem.removeClass("e-columnmenuselection");
                                        nextItem.addClass("e-columnmenuselection");
                                    }
                                }
                                else {
                                    var columnMenuItem = columnMenu.find("div.e-columnmenuselection"),
                                        nextItem = proxy._findNextColumnMenuItem(columnMenuItem, "next");
                                    if (nextItem.length > 0) {
                                        columnMenuItem.removeClass("e-columnmenuselection");
                                        nextItem.addClass("e-columnmenuselection");
                                    }
                                }
                            }
                        }
					}
                    break;
                // expand the child task by press right arrow
                case "rightArrow":
					if (model.allowSelection) {
                    if (contextMenu.length == 0 && columnMenu.length == 0) {
                        if (proxy._isRowEdit || proxy.model.isEdit) return true;
                        var rowIndex = proxy.selectedRowIndex(),
                        record = updatedRecords[rowIndex],
                        args = {},
                        isExpandCollapseEnabeled;
                        args.data = record;
                        args.recordIndex = rowIndex;
                        args.expanded = true;
                        if (record) {
                            if (record.hasChildRecords && !record.expanded) {
                                if (proxy.selectedRowIndex() >= 0) {
                                    isExpandCollapseEnabeled = proxy._trigger("expanding", args);
                                    if (!isExpandCollapseEnabeled && !model.isFromGantt) {
                                        ej.TreeGrid.sendExpandCollapseRequest(proxy, args);
                                    }
                                    if (model.enableVirtualization)
                                       proxy._focusTreeGridElement();
                                    proxy.updateScrollBar();
                                }
                            }
                        }
                        proxy._cancelSaveTools();
                        if (model.allowSelection && model.selectionMode == "cell" && (proxy._focusingRowIndex != proxy.getRows().length -1 || proxy._cellIndex != columnLength - 1)) {
                            proxy._selectNextCell("right", action);
                    }
                    }
                    else
                    {
                        if (contextMenu.length && !isVisible) {
                            proxy._moveToNextMenuItem("expand");
                        }
                        else if (columnMenu.length && !isVisibleColumnChooserMenu) {
                            var columnMenuItem = columnMenu.find("div.e-columnmenuselection"),
                                columnChooserMenuList = columnChooserMenu.find("div.e-columnMenuListDiv")
                                columnListPosX = proxy._columnListPosX,
                                columnChooserListIndex = proxy._columnChooserListIndex,
                                windowWidth = $(document).width();
                            if (columnMenuItem.length > 0 && columnMenuItem[0].id == proxy._id + "_ColumnsChooser") {
                                var columnchooser = $("#" + proxy._id + "ccDiv").ejDialog("instance"),
                                    columnListWidth = $("#" + proxy._id + "ccDiv_wrapper").width();
                                columnchooser.open();
                                if (windowWidth < columnListPosX + columnMenu.width()) {
                                    columnListPosX = columnListPosX - columnMenu.width() - columnListWidth;
                                }
                                var position = {
                                    X: columnListPosX,
                                    Y: posY + columnChooserListIndex * 30 + (columnChooserListIndex == 0 ? 0 : 1)
                                }
                                columnchooser.option({ "position": position });
                                columnMenu.css("z-index", "10033");
                                columnChooserMenuList.removeClass("e-columnmenuselection");
                                columnChooserMenuList.eq(0).addClass("e-columnmenuselection");
                                proxy._focusTreeGridElement();
                            }
                        }
                    }
					}
                    break;
				
                //collapse the child task by press left arrow 
                case "leftArrow":
					if (model.allowSelection) {
                    if (contextMenu.length == 0 && columnMenu.length == 0) {
                        if (proxy._isRowEdit || proxy.model.isEdit) return true;
                        var rowIndex = proxy.selectedRowIndex(),
                        record = updatedRecords[rowIndex],
                        args = {},
                        isExpandCollapseEnabeled;
                        args.data = record;
                        args.recordIndex = rowIndex;
                        args.expanded = false;
                        if (record) {
                            if (record.hasChildRecords && record.expanded) {
                                if (proxy.selectedRowIndex() >= 0) {
                                    isExpandCollapseEnabeled = proxy._trigger("collapsing", args);
                                    if (!isExpandCollapseEnabeled && !model.isFromGantt) {
                                        ej.TreeGrid.sendExpandCollapseRequest(proxy, args);
                                    }
                                    if (model.enableVirtualization)
                                       proxy._focusTreeGridElement();
                                    proxy.updateScrollBar();
                                }
                            }
                        }
                        proxy._cancelSaveTools();
                        if (model.allowSelection && model.selectionMode == "cell" && (proxy._focusingRowIndex != 0 || proxy._cellIndex != 0)) {
                            proxy._selectNextCell("left", action);
                    }
                    }
                    else if (contextMenu.length)
                        proxy._moveToNextMenuItem("collapse");
                    else if (columnMenu.length && isVisibleColumnChooserMenu)
                        $("#" + proxy._id + "ccDiv").ejDialog("close");
					}
                    break;
				
                    //select the previous row by press down arrow key
                case "upArrow":
					if (model.allowSelection) {
					    if (contextMenu.length == 0 && columnMenu.length == 0) {
					       if (proxy._isRowEdit || proxy.model.isEdit)
                                return true;

                            if (model.selectionMode == "row" && this.selectedRowIndex() > 0 && updatedRecords.length > 0 && model.selectedItem) {
                            var selectedItem = updatedRecords[proxy.selectedRowIndex()];
                            selectingRowIndex = expandedRecords.indexOf(selectedItem);
                            currentSelectingRecord = expandedRecords[selectingRowIndex - 1];
                                if (currentSelectingRecord.isSummaryRow)
                                    currentSelectingRecord = proxy._getNextRecord(selectingRowIndex - 1, expandedRecords, action);
                                selectingRowIndex = updatedRecords.indexOf(currentSelectingRecord);

                            if (!proxy._rowSelectingEventTrigger(this.selectedRowIndex(), selectingRowIndex)) {
                                proxy.selectRows(selectingRowIndex);
                                proxy.updateScrollBar();
                               proxy._focusTreeGridElement();
                                proxy._rowSelectedEventTrigger(proxy.selectedRowIndex());
                            }
                            proxy._cancelSaveTools();
                        }
                            else if (model.selectionMode == "cell") {
                                var rowIndex = proxy._focusingRowIndex - 1, cellIndex = proxy._cellIndex,
                                   recordLength = model.flatRecords.length;
                                proxy._isShiftKeyNavigation = false;
                                if (rowIndex != -1) {
                                    var selectedItem = updatedRecords[proxy._rowIndexOfLastSelectedCell];
                                    selectingRowIndex = expandedRecords.indexOf(selectedItem);
                                    currentSelectingRecord = expandedRecords[selectingRowIndex - 1];
                                    //To skip the key Navigation from summary row.
                                    if (currentSelectingRecord && currentSelectingRecord.isSummaryRow) {
                                        currentSelectingRecord = proxy._getNextRecord(selectingRowIndex - 1, expandedRecords, action);
                                        rowIndex = updatedRecords.indexOf(currentSelectingRecord);
                    }
                                    if (currentSelectingRecord) {
                                   cellInfo = {
                                       rowIndex: rowIndex,
                                       cellIndex: cellIndex
                                   };
                                        proxy._focusingRowIndex = rowIndex;
                                    proxy.selectCells([cellInfo]);
                                        proxy.updateScrollBar();
                                    }

                    }
                            }
                        }
                        else {
                        if (contextMenu.length) {
                            proxy._moveToNextMenuItem("prev");
                        }
                        else if (columnMenu.length) {
                            if (isVisibleColumnChooserMenu) {
                                var columnChooserMenuItem = columnChooserMenu.find("div.e-columnmenuselection"),
                                  prevItem = columnChooserMenuItem.prev("div.e-columnMenuListDiv");
                                if (prevItem.length > 0) {
                                    columnChooserMenuItem.removeClass("e-columnmenuselection");
                                    prevItem.addClass("e-columnmenuselection");
                                }
                            }
                            else {
                                var columnMenuItem = columnMenu.find("div.e-columnmenuselection"),
                                    prevItem = proxy._findNextColumnMenuItem(columnMenuItem, "prev");
                                if (prevItem.length > 0) {
                                    columnMenuItem.removeClass("e-columnmenuselection");
                                    prevItem.addClass("e-columnmenuselection");
                                }
                            }
                        }
                    }
					}
                    break;
                case "deleteRecord":
                    if (model.readOnly == false && model.editSettings.allowDeleting && contextMenu.length == 0 && columnMenu.length == 0) {
                        if (proxy._isRowEdit || proxy.model.isEdit) return true;
                        if (proxy.selectedRowIndex() >= 0) {
                            proxy.deleteRow();
                            proxy._cancelSaveTools();
                           proxy._focusTreeGridElement();
                        }
                    }
                    break;
                case "totalRowCollapse":
                    if (contextMenu.length == 0 && columnMenu.length == 0) {
                        if (proxy.model.isFromGantt) {
                            args = {};
                            args.requestType = "collapseAll";
                            proxy._trigger("expandAllCollapseAllRequest", args);
                        }
                        else
                            proxy.collapseAll();
                        break;
                    }
                case "totalRowExpand":
                    if (contextMenu.length == 0 && columnMenu.length == 0) {
                        if (proxy.model.isFromGantt) {
                            args = {};
                            args.requestType = "expandAll";
                            proxy._trigger("expandAllCollapseAllRequest", args);
                        }
                        else
                            proxy._expandAll();
                    }
                    break;
                case "spaceBar":
                var option = null;
                if (columnMenu.length && isVisibleColumnChooserMenu) {
                    var columnChooserMenuItem = columnChooserMenu.find("div.e-columnmenuselection");
                    option = columnChooserMenuItem.data("column");
                    if (!ej.isNullOrUndefined(option) && !columnChooserMenuItem.find("span").hasClass("e-disable")) {
                        var isColumnVisible = columnChooserMenuItem.find("span").attr("aria-checked");
                        isColumnVisible == "true" ? proxy.hideColumn(option) : proxy.showColumn(option);
                    }
                }
                break;
                case "shiftDownArrow":
                    if (model.allowSelection && model.selectionMode == "cell" && model.selectionType == "multiple") {
                        var recordLength = model.updatedRecords.length,                            
                            selectedCellElementLength = proxy._selectedCellDetails.length;

                        var selectedItem = updatedRecords[proxy._rowIndexOfLastSelectedCell];
                        selectingRowIndex = expandedRecords.indexOf(selectedItem);
                        currentSelectingRecord = expandedRecords[selectingRowIndex + 1];
                        //To skip the key Navigation from summary row.
                        if (currentSelectingRecord && currentSelectingRecord.isSummaryRow)
                            currentSelectingRecord = proxy._getNextRecord(selectingRowIndex + 1, expandedRecords);
                        if (!currentSelectingRecord)
                            return;
                        nextRowIndex = updatedRecords.indexOf(currentSelectingRecord);                        
                        if (proxy._focusingRowIndex > proxy._rowIndexOfLastSelectedCell) {
                            proxy._rowIndexOfLastSelectedCell = nextRowIndex;
                            proxy._selectedCellDetails.sort(function (a, b) {
                                return parseFloat(a.rowIndex) - parseFloat(b.rowIndex);
                            });
                            proxy._getSelectedCellsinARow(proxy._selectedCellDetails[0].data.index, proxy._selectedCellDetails);
                            for (var i = 0; i < proxy._selectedCellsinARow.length; i++) {
                                var selectedCellIndex = proxy._selectedCellDetails.indexOf(proxy._selectedCellsinARow[i]);
                                $(proxy._selectedCellsinARow[i].cellElement).removeClass("selectingcell");
                                proxy._selectedCellDetails.splice(selectedCellIndex, 1);
                            }
                            proxy.updateScrollBar();
                        }
                        else if (nextRowIndex < recordLength) {
                            var args = {
                                rowIndex: nextRowIndex,
                                cellIndex: proxy._lastSelectedCellIndex,
                            }
                            proxy.updateScrollBar();
                            proxy._shiftKeySelectCells(args);
                            proxy._rowIndexOfLastSelectedCell = nextRowIndex;
                        }

                    }
                    break;
                case "shiftUpArrow":
                    if (model.allowSelection && model.selectionMode == "cell" && model.selectionType == "multiple") {
                        var selectedCellElementLength = proxy._selectedCellDetails.length;
                        var selectedItem = updatedRecords[proxy._rowIndexOfLastSelectedCell];
                        selectingRowIndex = expandedRecords.indexOf(selectedItem);
                        currentSelectingRecord = expandedRecords[selectingRowIndex - 1];
                        //To skip the key Navigation from summary row.
                        if (currentSelectingRecord && currentSelectingRecord.isSummaryRow)
                            currentSelectingRecord = proxy._getNextRecord(selectingRowIndex - 1, expandedRecords, "upArrow");
                        if (!currentSelectingRecord)
                            return;
                        nextRowIndex = updatedRecords.indexOf(currentSelectingRecord);                        
                        if (selectedCellElementLength > 0 && proxy._focusingRowIndex < proxy._rowIndexOfLastSelectedCell) {
                            proxy._rowIndexOfLastSelectedCell = nextRowIndex;
                            proxy._getSelectedCellsinARow(proxy._selectedCellDetails[selectedCellElementLength - 1].data.index, proxy._selectedCellDetails);
                            for (var i = 0; i < proxy._selectedCellsinARow.length; i++) {
                                var selectedCellIndex = proxy._selectedCellDetails.indexOf(proxy._selectedCellsinARow[i]);
                                $(proxy._selectedCellsinARow[i].cellElement).removeClass("selectingcell");
                                proxy._selectedCellDetails.splice(selectedCellIndex, 1);
                            }
                            proxy.updateScrollBar();
                        }
                        else if (nextRowIndex >= 0) {
                            var args = {
                                rowIndex: nextRowIndex,
                                cellIndex: proxy._lastSelectedCellIndex,
                            }
                            proxy._rowIndexOfLastSelectedCell = nextRowIndex;
                            proxy.updateScrollBar();
                            proxy._shiftKeySelectCells(args);
                        }

                    }
                    break;

                case "shiftRightArrow":
                    if (model.allowSelection && model.selectionMode == "cell" && model.selectionType == "multiple") {
                        var columnLength = model.columns.length, cellIndex = proxy._lastSelectedCellIndex + 1;
                        if (cellIndex < columnLength - 1 && (!model.columns[cellIndex].visible || !model.columns[cellIndex].allowCellSelection))
                            cellIndex = proxy.getUpNextVisibleColumnIndex(cellIndex);
                        if (cellIndex < columnLength) {

                            var args = {
                                rowIndex: proxy._rowIndexOfLastSelectedCell,
                                cellIndex: cellIndex,
                            }
                            proxy._shiftKeyFirstElementDetails.firstElementRowIndex = proxy._focusingRowIndex;
                            proxy._shiftKeySelectCells(args);
                            proxy._lastSelectedCellIndex = cellIndex;                            
                        }
                    }
                    //proxy.updateScrollBar(proxy._rowIndexOfLastSelectedCell);                    
                    break;
                case "shiftLeftArrow":
                    if (model.allowSelection && model.selectionMode == "cell" && model.selectionType == "multiple") {
                        var cellIndex = proxy._lastSelectedCellIndex - 1;
                        if (cellIndex != -1 && (!model.columns[cellIndex].visible || !model.columns[cellIndex].allowCellSelection))
                            cellIndex = proxy.getPreviousVisibleColumnIndex(cellIndex);
                        var args = {
                            rowIndex: proxy._rowIndexOfLastSelectedCell,
                            cellIndex: cellIndex,
                        }
                        if (cellIndex != -1) {
                            proxy._shiftKeyFirstElementDetails.firstElementRowIndex = proxy._focusingRowIndex;
                            proxy._shiftKeySelectCells(args);
                            proxy._lastSelectedCellIndex = cellIndex;
                        }
                    }
                    //proxy.updateScrollBar(targetIndex);                    
                    break;

                case "shiftHomeButton":
                    if (model.selectionMode == "cell" && model.selectionType == "multiple") {
                        var rowIndex = proxy._rowIndexOfLastSelectedCell,
                           args = {
                               rowIndex: rowIndex,
                               cellIndex: 0
                           };
                        proxy._cellIndex = 0;
                        proxy._lastSelectedCellIndex = 0;
                        proxy._shiftKeySelectCells(args);

                    }
                    break;
                case "shiftEndButton":
                    if (model.selectionMode == "cell" && model.selectionType == "multiple") {
                        var rowIndex = proxy._rowIndexOfLastSelectedCell, columns = model.columns;
                        proxy._cellIndex = columns.length - 1;
                        args = {
                            rowIndex: rowIndex,
                            cellIndex: proxy._cellIndex
                        };
                        proxy._lastSelectedCellIndex = proxy._cellIndex;
                        proxy._shiftKeySelectCells(args);

                    }
                    break;
                default:
                    returnValue = true;
            }

            return returnValue;
        },

        //Method to bind all the filter condition and splice the over writed condition.
        filterColumn: function (fieldName, filterOperator, filterValue, predicate, matchcase, actualFilterValue) {
           
            var proxy = this,
                model = proxy.model,
                filteredColumns = model.filterSettings.filteredColumns;
            if (!this.model.allowFiltering)
                return;
            var args = {};
            ej.TreeGrid.Actions.Filter = "filtering";
            args.requestType = ej.TreeGrid.Actions.Filter;
            args.currentFilterObject = [];           
            if (!$.isArray(filterOperator))
                filterOperator = $.makeArray(filterOperator);
            if (!$.isArray(filterValue))
                filterValue = $.makeArray(filterValue);
            var firstLoop = false;
            var filterCol = this._filterCollection;
            if (ej.util.isNullOrUndefined(this._currentFilterColumn))
                this._currentFilterColumn = this.getColumnByField(fieldName);
            for (var index = 0; index < filterOperator.length; index++) {
                    var filterObject = {
                        field: fieldName,
                        operator: filterOperator[index],
                        value: filterValue[index],
                        matchcase: matchcase,
                        predicate: predicate,
                        actualFilterValue: actualFilterValue
                    };
                this._$colType = "string";
                if (filteredColumns.length == 0 && filterObject.value !== "") {
                    if (this._$colType == "date" && (filterOperator == "equal" || filterOperator == "notequal") && typeof (filterObject.value) !== "string")
                        this._setDateFilters(filterObject);
                    else
                        filteredColumns.push(filterObject);
                } else {
                    var proxy = this;
                    if (!firstLoop) {
                        var dataManger = ej.DataManager(filteredColumns);
                        var query = new ej.Query().where("field", ej.FilterOperators.equal, filterObject.field);
                        var object = dataManger.executeLocal(query);
                        for (var i = 0; i < object.length; i++) {
                            var objectIndex = $.inArray(object[i], filteredColumns)
                            if (objectIndex != -1)
                                filteredColumns.splice(objectIndex, 1);
                        }
                    }
                    if (filterObject.value !== "") {
                        if (this._$colType == "date" && (filterOperator == "equal" || filterOperator == "notequal") && typeof (filterObject.value) !== "string")
                            this._setDateFilters(filterObject);
                        else
                            filteredColumns.push(filterObject);
                    }
                }
                firstLoop = true;
                args.currentFilterObject.push(filterObject);
            }
            args.filterCollection = filteredColumns;
            args.currentFilteringColumn = fieldName;
            args.fieldName = fieldName;
            var returnValue = this.processBindings(args);
            if (returnValue) {
                filteredColumns.reverse().splice(0, filterOperator.length);
                filteredColumns.reverse();
            }
        },

        _cellSelectingEventTrigger: function (selectedCellInfo) {
            var proxy = this,
               model = proxy.model,
               args = {}, targetIndex = selectedCellInfo.rowIndex,
               currentCellIndex = selectedCellInfo.cellIndex;
            args.data = model.updatedRecords[targetIndex];
            args.targetRow = selectedCellInfo.rowElement;
            args.targetCell = selectedCellInfo.cellElement;
            args.rowIndex = targetIndex;
            args.cellIndex = currentCellIndex;
            return proxy._trigger('cellSelecting', args);
        },
        _cellSelectedEventTrigger: function (selectedCellInfo, previousSelectedCellDetails) {
            var proxy = this,
                model = proxy.model,
                args = {}, targetIndex = selectedCellInfo.rowIndex,
                currentCellIndex = selectedCellInfo.cellIndex,
                previousRowIndex = previousSelectedCellDetails.rowIndex,
                previousCellIndex = previousSelectedCellDetails.cellIndex;

            //previousSelectedCellDetails
            args.PreviousTargetRow = previousSelectedCellDetails.rowElement;
            args.previousTargetCell = previousSelectedCellDetails.cellElement;
            args.previousData = model.updatedRecords[previousRowIndex];
            args.previousRowIndex = previousRowIndex;
            args.previousCellIndex = previousCellIndex;
            //currentSelectedCellDetails
            args.data = model.updatedRecords[targetIndex];           
            args.targetRow = selectedCellInfo.rowElement;
            args.targetCell = selectedCellInfo.cellElement;
            args.rowIndex = targetIndex;
            args.cellIndex = currentCellIndex;
            return proxy._trigger('cellSelected', args);
        },

        //ROWSELECTING EVENT METHOD
        _rowSelectingEventTrigger: function (previousIndex, currentIndex) {

            var proxy = this,
                model = proxy.model,
                args = {},
                selectedItem,
                $gridRows;
                updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;
                args.targetRow = ej.TreeGrid.getRowByIndex(proxy, currentIndex);
                args.previousTreeGridRow = ej.TreeGrid.getRowByIndex(proxy, previousIndex);
                args.data = updatedRecords[currentIndex];
                args.previousData = updatedRecords[previousIndex];
                args.recordIndex = currentIndex;
                args.previousIndex = previousIndex;
                var isCancel = proxy._trigger('rowSelecting', args);
                if (isCancel)
                    model.selectedItem = args.data;
                return isCancel;
        },


        //ROWSELECTED EVENT METHOD
        _rowSelectedEventTrigger: function (index) {

            var proxy = this, model = proxy.model,
                args = {};
            var record = $.extend({}, model.updatedRecords[index]);
            /*Remove childRecords and parentItem from record object, 
              To avoid the cyclic dependency when performing postback action in ASP.NET */
            delete record.childRecords;
            delete record.parentItem;

            args = {
                targetRow: ej.TreeGrid.getRowByIndex(proxy, index),
                recordIndex: index
            };
            if (proxy.model.isFromGantt) {
                args.target = "ejTreeGrid";
                args.data = model.updatedRecords[index];
            }
            else
                args.data = record;

                proxy._trigger("rowSelected", args);
        },


        //QUERYCELLINFO,ROWDATABOUND EVENT BINDING FOR TREEGRID
        _eventBindings: function () {

            var proxy = this,
                model = proxy.model,
                count = 0,
                row,
                gridRows = proxy.getRows(),
                length = this._frozenColumnsLength > 0 ? $(gridRows[0]).length : $(gridRows).length;

            if (model.queryCellInfo != null || model.rowDataBound != null || model.detailsDataBound) {

                for (count; count < length; count++) {
                    var rowIndex = model.allowPaging ? proxy._updatedPageData.indexOf(model.currentViewData[count]) : model.updatedRecords.indexOf(model.currentViewData[count]);
                    row = ej.TreeGrid.getRowByIndex(this, rowIndex);
                    proxy._rowEventTrigger(row, model.currentViewData[count]);
                }
            }
        },

        //ROWDATABOUND EVENT TRIGGER
        _rowEventTrigger: function (row, data) {

            var proxy = this,
                model = this.model;

            if (model.rowDataBound) {
                proxy._trigger("rowDataBound", {
                    rowElement: row,
                    data: data
                });
            }
           
            var tdCells = row.cells,
                $tdRowcells = $(row).find(".e-rowcell"),
                cellIndex = 0,
                length = $tdRowcells.length,
                column=null,
                columns = proxy.model.columns;
            if (model.queryCellInfo) {
                for (cellIndex; cellIndex < length; cellIndex++) {

                    if ($($tdRowcells[cellIndex]).hasClass("e-rowcell")) {
                        column = columns[cellIndex];
                    }

                    if (column) {
                        proxy._cellEventTrigger($tdRowcells[cellIndex], data, column);
                    }
                }
            }

            if (model.detailsDataBound && $(row).next("tr").hasClass("e-detailsrow")) {
                var detailsRowElement = $(row).next("tr");
                if (this._frozenColumnsLength > 0)
                    detailsRowElement = $(detailsRowElement[1]);
                this._trigger("detailsDataBound", { detailsElement: detailsRowElement, data: data });
            }
        },


        //QUERYCELLINFO EVENT TRIGGER
        _cellEventTrigger: function (cell, data, column) {

            var args = {
                cellElement: cell,
                data: data,
                column: column,

            };

            args.cellValue = args.column && data[args.column.field];
            this._trigger("queryCellInfo", args);
        },


        //ACTION COMPLETE EVENT TRIGGER
        _completeAction: function (args) {

            var proxy = this,
                model = proxy.model,
                sortcolumns = model.sortSettings.sortedColumns;

            model.isEdit = false;

            if (ej.TreeGrid.Actions.Paging == args.requestType || model.allowPaging)
                this._refreshGridPager();
            if ((ej.TreeGrid.Actions.Sorting == args.requestType && model.allowSorting)
                || (ej.TreeGrid.Actions.Refresh == args.requestType)) {

                if (model.allowSorting) {

                    if (!proxy._multiSortRequest) {
                        proxy.getHeaderTable().find(".e-columnheader").
                            find(".e-headercelldiv").find(".e-ascending,.e-descending").remove();

                        proxy.getHeaderTable().find("[aria-sort]").removeAttr("aria-sort");
                    }

                    for (var i = 0; i < sortcolumns.length; i++) {
                        proxy._addSortElementToColumn(sortcolumns[i].field, sortcolumns[i].direction);
                    }

                }

                proxy._multiSortRequest = false;
            } else if (ej.TreeGrid.Actions.BeginEdit == args.requestType || ej.TreeGrid.Actions.Add == args.requestType) {

                var $form = $("#" + proxy._id + "EditForm");

                proxy.model.isEdit = true;
                proxy.setWidthToColumns();

                if (ej.TreeGrid.Actions.Add == args.requestType) {

                    $form.find(".e-field:disabled").not(".e-identity").removeAttr("disabled").removeClass("e-disable");

                }

            }
            else if (args.requestType === "scroll")
            {
                proxy._updateCurrentViewData();
            }
            proxy._trigger("actionComplete", args);
        },


        //#endregion

        //#region METHOD FOR DATA PROCESSING

        //RENDERING THE DATA
        sendDataRenderingRequest: function (args) {

            var proxy = this, model = this.model,
                temp;
            if (proxy.model.currentViewData.length) {

                switch (args.requestType) {

                    case ej.TreeGrid.Actions.Delete:
                    case ej.TreeGrid.Actions.Refresh:
                    case ej.TreeGrid.Actions.Save:
                    case ej.TreeGrid.Actions.Filter:
                    case ej.TreeGrid.Actions.Sorting:
                    case ej.TreeGrid.Actions.Searching:
                    case ej.TreeGrid.Actions.ExpandCollapse:
                    case ej.TreeGrid.Actions.RefreshDataSource:
                    case ej.TreeGrid.Actions.DragAndDrop:
                    case ej.TreeGrid.Actions.Paging:
                        temp = document.createElement('div');
                       

                        if (this._frozenColumnsLength > 0) {
                            proxy._renderFrozenRecords();
                        }
                        else {
                            proxy.getContentTable().find("colgroup").first().replaceWith(proxy._getMetaColGroup());
                            var $tbody = proxy.getContentTable().children('tbody');
                            $tbody.empty();

                            temp.innerHTML = ['<table>', $.render[proxy._id + "_Template"](proxy.model.currentViewData), '</table>'].join("");

                            proxy.getContentTable().get(0).replaceChild(temp.firstChild.firstChild,
                                proxy.getContentTable().get(0).lastChild);

                            proxy._gridRows = proxy.getContentTable().get(0).rows;
                            proxy.setGridRows($(proxy.getContentTable().get(0).rows));
                        }

                        this._gridRows = this.getContentTable().get(0).rows;
                        if (this._frozenColumnsLength > 0)
                            this._gridRows = [this._gridRows, this.getContentTable().get(1).rows];

                        /* check treee grid rows are append in DOM and Trigger refresh and querycellInfo events */
                        if (proxy._$gridContent && proxy._isRendered){
                            proxy._trigger("refresh");
                            proxy._eventBindings();
                            this._hideCollapsedDetailsRows();
                        }
                        break;
                }

            } else {
                if (proxy._frozenColumnsLength > 0) {
                    var $emptyTd = ej.buildTag('td', model.emptyRecordText, {}, { colSpan: this._frozenColumns.length }), doc = document;
                    proxy.getContent().find("#e-frozencontentdiv" + proxy._id + " .e-table tbody").empty().append($(doc.createElement("tr")).append($emptyTd));
                    $emptyTd = ej.buildTag('td', model.emptyRecordText, { visibility: "hidden" }, { colSpan: this._unFrozenColumns.length });
                    proxy.getContent().find("#e-movablecontentdiv" + proxy._id + " .e-table tbody").empty().append($(doc.createElement("tr")).append($emptyTd));
                    proxy._$gridContainer.find("#e-movablecontentdiv" + proxy._id + ",#e-frozencontentdiv" + proxy._id).css("height", "30px");
                } else {
                    proxy.getContentTable().find('tbody').empty().append(proxy._getEmptyTbody());
                    proxy._$gridContainer && proxy._$gridContainer.css({ height: "30px" }); // for render no record text
                }
                proxy._gridRows = null;
                proxy.setGridRows(null);

            }

            if (proxy.model.showGridCellTooltip || proxy.model.showGridExpandCellTooltip)
                proxy._cellMouseLeave();

            proxy._completeAction(args);

        },
        _renderFrozenRecords: function ()
        {
            /* Update colgroup of frozen and movable tables while rendering records*/
            this.getContent().find("#e-frozencontentdiv" + this._id + " .e-table colgroup").replaceWith(this._getMetaColGroup()[0]);
            this.getContent().find("#e-movablecontentdiv" + this._id + " .e-table colgroup").replaceWith(this._getMetaColGroup()[1]);
            var $tbody = this.getContentTable().children('tbody');
            $tbody.empty();
            /*Render frozen Table*/
            temp = document.createElement('div');
            temp.innerHTML = ['<table>', $.render[this._id + "_JSONFrozenTemplate"](this.model.currentViewData),
                '</table>'].join("");
            this.getContentTable().get(0).replaceChild(temp.firstChild.firstChild,
                this.getContentTable().get(0).lastChild);
            /*Render movable Table*/
            temp = document.createElement('div');
            temp.innerHTML = ['<table>', $.render[this._id + "_Template"](this.model.currentViewData),
                '</table>'].join("");
            this.getContentTable().get(1).replaceChild(temp.firstChild.firstChild,
                this.getContentTable().get(1).lastChild);

            this.setGridContentTable(this.getContent().find(".e-table"));
        },

        _renderByFrozenDesign: function () {
            var $div = $(document.createElement('div')), col = this._getMetaColGroup().find("col"), colgroups = {};
            colgroups["colgroup1"] = $div.append(ej.buildTag("colgroup").append(col.splice(0, this._frozenColumnsLength))).html();
            colgroups["colgroup2"] = $div.html(ej.buildTag("colgroup").append(col)).html();
            return $.render[this._id + "_FrozenTemplate"](colgroups);
           
        },
        addFrozenTemplate: function () {
            var template = "<div class='e-frozencontainer' id='e-frozencontainer" + this._id + "' style='overflow:hidden;float:left;'><div class='e-frozencontentdiv' id='e-frozencontentdiv" + this._id + "' style='width:100%;'>"
            + "<table class='e-table' style='width:100%' cellspacing='0' id='" + this._id + "frozene-table'>{{:colgroup1}}<tbody>"
            + "</tbody></table></div></div>"
            + "<div class='e-movablecontainer' id='e-movablecontainer" + this._id + "'><div class='e-movablecontent' id='e-movablecontent" + this._id + "'><div class='e-movablecontentdiv' id='e-movablecontentdiv" + this._id + "'><table class='e-table' id='" + this._id + "movablee-table' cellspacing='0'>{{:colgroup2}}<tbody>"
            + "</tbody></table></div></div></div>", templates = {};
            templates[this._id + "_FrozenTemplate"] = template;
            $.templates(templates);
        },
       

        //Public method to change the allowSorting value dynamically.
        sortSetting: function (value) {
            var proxy = this;
                ascendingIcon = $("#" + proxy._id).find(".e-ascending.e-icon"),
                descendingIcon = $("#" + proxy._id).find(".e-descending.e-icon");
                proxy.model.allowSorting = value;               
                if (ascendingIcon.length > 0) {
                    for (var length = 0 ; length < ascendingIcon.length; length++) {
                        $(ascendingIcon[length]).css("visibility", "hidden");
                    }
                }                                      
            if (descendingIcon.length > 0)
                for (var length = 0 ; length < descendingIcon.length; length++) {
                    $(descendingIcon[length]).css("visibility", "hidden");
                }
        },
        //Public method to change the treeColumnIndex value dynamically.
        columnIndex:function(value){
            var proxy = this, model = proxy.model;
            if (!isNaN(parseInt(value)) && parseInt(value) >= 0 && parseInt(value) < model.columns.length) {
                model.treeColumnIndex = parseInt(value);
                proxy._addInitTemplate();
                this.renderRecords();
                if (model.showColumnChooser)
                    proxy._renderColumnChooserList(true);
            }
        },


        //SORTING THE DATA BASED ON THE PARTICULAR FIELDS
        
        sortColumn: function (columnName, columnSortDirection) {

            var proxy = this,
                model = proxy.model,
                sortColumns = model.sortSettings.sortedColumns,
                args = {},
                count = 0,
                length = sortColumns.length;
            /* Cancel edited cell before sort the column*/
            proxy._cancelEditState();
            proxy.clearSelection();
            if (!model.allowSorting || $.inArray(columnName, proxy._disabledSortableColumns) != -1
                || columnName.length == 0) {
                return;
            }

            if (!proxy._multiSortRequest) {
                model.sortSettings.sortedColumns = [];
            }

            args.requestType = ej.TreeGrid.Actions.Sorting;
            args.columnName = columnName;

            proxy._cSortedColumn = proxy.getFieldNameByHeaderText(columnName);
            proxy._cSortedDirection = args.columnSortDirection = columnSortDirection === undefined ?
                ej.sortOrder.Ascending : columnSortDirection;

            for (count; count < length; count++) {
                
                if (sortColumns[count].field == proxy._cSortedColumn) {
                    sortColumns.splice(count, 1);
                    break;
                }

            }

            model.sortSettings.sortedColumns.push({
                field: proxy._cSortedColumn,
                direction: proxy._cSortedDirection
            });

            var returnValue = proxy.processBindings(args);

            if (returnValue) {

                proxy._cSortedDirection = proxy._cSortedColumn = null;

            }
            if (proxy.selectedRowIndex() >= 0 && proxy._isRendered) {
                proxy.selectedRowIndex(proxy._sortedRecords.indexOf(this.selectedItem()));
            }
            proxy._clearColumnMenu();
        },


        //Clear the sorting
        clearSorting: function()
        {
            var proxy = this,
                model = proxy.model;
            model.sortSettings.sortedColumns = [];
            var args = {};
            args.requestType = ej.TreeGrid.Actions.Sorting;
            proxy.processBindings(args);
        },


        //DELETE THE PARTICULAR RECORD AND MULTIPLE RECORD
        deleteRow: function ($tr, isFromContextmenu, index) {

            var proxy = this,
                deletedRowIndex,
                deletedRow,
                args = {},
                eveArgs = {},
                model = proxy.model,               
                length = isFromContextmenu ? 1 : model.selectedItems.length,
                updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;

            if (!model.editSettings.allowDeleting)
                return false;
            if (proxy._isEmptyRow && model.selectionMode == "cell")
                length = 1;
            var deletedrowCount = 0;
            for (var del = 0; del < length; del++) {
                if (model.isFromGantt && isFromContextmenu)
                    args.data = updatedRecords[index]
                else
                args.data = model.selectionMode == "row" ? model.selectedItems[del] : updatedRecords[proxy._rowIndexOfLastSelectedCell];
                deletedRow = args.data;
                if (proxy.model.enableWBS) {
                    var dataRows, targetRowIndex, isUpdateWBS = false;
                    if (deletedRow && deletedRow.parentItem) {
                        dataRows = deletedRow.parentItem.childRecords,
                        targetRowIndex = dataRows.indexOf(deletedRow);
                    } else if (model.flatRecords.length) {
                        var flatData = model.flatRecords,
                            Level0 = flatData.filter(function (item) {
                                return item && item.level == 0;
                            });
                        dataRows = Level0;
                        targetRowIndex = dataRows.indexOf(deletedRow);
                    }
                    if (targetRowIndex != dataRows.length - 1)
                        isUpdateWBS = true;
                }
                if (model.flatRecords.indexOf(args.data) != -1) {
            args.requestType = ej.TreeGrid.Actions.Delete;   
                    proxy._selectedCellDetails = [];
            if (proxy.processBindings(args))
                return true;
            if (proxy.model.allowPaging)
                proxy.updateHeight();
            deletedrowCount++;
                    if (model.currentViewData.length > 0 && model.enableAltRow)
                        ej.TreeGrid.updateAltRow(proxy, model.currentViewData[0], 0, 0);
            }
                if (isUpdateWBS) {
                    var targetRow;
                    if (deletedRow.parentItem)
                        targetRow = dataRows[targetRowIndex];//Here we are having the updated 'dataRows'
                    else {
                        //for level 0 records
                        dataRows.splice(targetRowIndex, 1);
                        targetRow = dataRows[targetRowIndex];
            }
                    proxy.updateWBSdetails(targetRow);
                }
            }
            model.selectedItems = [];
            model.selectedCellIndexes = [];           
            proxy._prevSelectedItems = null;
        },

        /*Update the WBS value of all the records that are below the newly added row*/
        updateWBSdetails: function (delTargetRow) {
            var proxy = this,
                model = proxy.model,
                dataW = delTargetRow,
                newWBS = dataW["WBS"];

            //Updating the WBS value of other records that are below the newly added row
            var childItems, markedIndex, markedRecords, dataS, dataLength;
            if (dataW.parentItem) {
                childItems = dataW.parentItem.childRecords;
                markedIndex = childItems.indexOf(dataW);
                dataS = childItems;
                dataLength = dataS.length;
            } else if (model.flatRecords.length) {
                var flatData = model.flatRecords,
                    Level0 = flatData.filter(function (item) {
                        return item && item.level == 0;
                    });
                dataS = Level0;
                markedIndex = dataS.indexOf(dataW);
                dataLength = dataS.length;
            }
            markedRecords = dataS.slice(markedIndex, dataLength);
            if (markedRecords.length) {
                var lastVal = newWBS.lastIndexOf('.') != -1 ? parseInt(newWBS.substr(newWBS.lastIndexOf('.') + 1)) : parseInt(newWBS),
                    parentVal = dataW.parentItem ? dataW.parentItem.WBS : null;
                lastVal--;
                proxy.reCalculateWBS(markedRecords, lastVal, parentVal);
            }
        },

        /* To recalculate the WBS value */
        reCalculateWBS: function (selectedRecords, lastDigit, parentWBS) {
            var proxy = this, model = proxy.model,
                cViewData = model.currentViewData, final;

            if (parentWBS) {
                for (var i = 0; i < selectedRecords.length; i++) {
                    final = lastDigit + i;
                    selectedRecords[i]["WBS"] = parentWBS + "." + final;
                    selectedRecords[i]["item"]["WBS"] = parentWBS + "." + final;
                    if (model.enableWBSPredecessor)
                        proxy._getPredecessorIds(selectedRecords[i]);
                    proxy.refreshRow(cViewData.indexOf(selectedRecords[i]));
                    if (selectedRecords[i].hasChildRecords)
                        proxy._updateChildWBS(selectedRecords[i])
                }
            }
            else {
                for (var i = 0; i < selectedRecords.length; i++) {
                    final = (lastDigit + i).toString();
                    selectedRecords[i]["WBS"] = final;
                    selectedRecords[i]["item"]["WBS"] = final;
                    if (model.enableWBSPredecessor)
                        proxy._getPredecessorIds(selectedRecords[i]);
                    proxy.refreshRow(cViewData.indexOf(selectedRecords[i]));
                    if (selectedRecords[i].hasChildRecords)
                        proxy._updateChildWBS(selectedRecords[i])
                }
            }
        },

        _updateChildWBS: function (parentRecord) {
            var proxy = this, model = proxy.model,
                cViewData = model.currentViewData,
                childRecs = parentRecord.childRecords,
                pWBS = parentRecord["WBS"];
            for (var c = 0; c < childRecs.length; c++) {
                childRecs[c]["WBS"] = pWBS + "." + (c + 1);
                childRecs[c]["item"]["WBS"] = pWBS + "." + (c + 1);
                if (model.enableWBSPredecessor)
                    proxy._getPredecessorIds(childRecs[c]);
                proxy.refreshRow(cViewData.indexOf(childRecs[c]));
                if (childRecs[c].hasChildRecords) {
                    proxy._updateChildWBS(childRecs[c])
                }
            }
        },

        /*Get all the predecessor rows that are matching the taskId*/
        _getPredecessorIds: function (pData) {
            var proxy = this,
                model = proxy.model,
                dataTID = pData.taskId,
                flatDatas = model.flatRecords,
                updatedRecs = model.updatedRecords,
                targetRecords = flatDatas.filter(function (item) {
                    if (item["predecessorsName"]) {
                        var prdcList = item["predecessorsName"].split(',');
                        for (var p = 0; p < prdcList.length; p++) {
                            var ref = prdcList[p].match(/(\d+|[A-z]+)/g),
                                refId = +ref[0];
                            if (refId == dataTID)
                                return item;
                        }
                    }
                });
            for (t = 0; t < targetRecords.length; t++) {
                proxy.updateWBSPredecessor(targetRecords[t]);
                proxy.refreshRow(updatedRecs.indexOf(targetRecords[t]));
            }
        },

        //SEARCH THE TASK FROM TREE GRID CONTROL

        

        search: function (searchString) {

            var proxy = this,
                args = {};

            args.requestType = ej.TreeGrid.Actions.Searching;
            args.keyValue = searchString;

            proxy._searchString = searchString;

            proxy.processBindings(args);
        },

        //SEND SAVE REQUEST
        endEdit: function () {

            var proxy = this;

            if (proxy.model.editSettings.editMode.toLowerCase() == "cellediting" && !proxy._isRowEdit)
                return proxy.saveCell();

            return true;

        },
        updateReadOnly:function(bool){
            var proxy=this;
            proxy.model.readOnly = bool;           
           
        },
        updateShowGridExpandCellTooltip: function (bool) {
            var proxy = this;
            proxy.model.showGridExpandCellTooltip = bool;
            proxy.refreshContent();
        },
        updateShowGridCellTooltip: function (bool) {
            var proxy = this;
            proxy.model.showGridCellTooltip = bool;
            proxy.refreshContent();
        },

        //#endregion

        //#region PUBLIC METHODS

        //CALCULATE THE VISIBLE RANGE OF RECORDS TO DISPLAYED IN CURRENT VIEWPORT
        getVisibleRange: function () {

            var proxy = this,
                model = proxy.model,
                calcHeight = (proxy.model.rowHeight + proxy._detailsRowHeight),
                top = proxy._scrollTop / calcHeight,
                coeff = top - Math.floor(top),
                topIndex, bottomIndex;

                proxy._offset = coeff * calcHeight;
                topIndex = Math.floor(top);
                bottomIndex = proxy._getRowPosition(proxy._scrollTop + proxy._viewPortHeight);
                topIndex = Math.max(0, topIndex);
                bottomIndex = Math.min(proxy.model.updatedRecords.length, bottomIndex);

                proxy._visibleRange = {
                    top: topIndex,
                    bottom: bottomIndex
                };

            return proxy._visibleRange;

        },
        /* set width to frozen and movable header columns to prevent
        improper view port height calculation while load time*/
        _setWidthToHeaders: function ()
        {
            var width = this._gridWidth;
            if (this._frozenColumnsLength > 0) {
                var totalWidth = 0, frozenWidth;
                for (var i = 0; i < this.columnsWidthCollection.length; i++) {
                    totalWidth += this.columnsWidthCollection[i];
                    if (this._frozenColumnsLength - 1 == i)
                        frozenWidth = Math.ceil(totalWidth);
                }
                this.getHeaderContent().find("#e-frozenheaderdiv" + this._id).width(width).next().css("margin-left", frozenWidth + "px");
                this.getHeaderContent().find("#e-frozenheaderdiv" + this._id).outerWidth(frozenWidth)
                    .end().find("#e-movableheaderdiv" + this._id).css("width", "100%");
            }
        },
        //SET THE COLUMNWIDTH TO EACH COLUMN IN TREEGRID
        setWidthToColumns: function () {

            var proxy = this,
                model = proxy.model,
                $cols1 = proxy.getContentTable().children("colgroup").find("col"),
                $cols2 = proxy.getHeaderTable().children("colgroup").find("col"),
                width = proxy._gridWidth,
                colCount = model.columns.length;

            for (var i = 0; i < $cols2.length; i++) {

                if (!ej.isNullOrUndefined(proxy.columnsWidthCollection[i])) {

                    $cols1.eq(i).width(proxy.columnsWidthCollection[i]);
                    $cols2.eq(i).width(proxy.columnsWidthCollection[i]);
                    }
            }
            /* width fro details col group cell */
            if ($cols1.length > colCount) {
                $cols1.eq(colCount).width(35);
            }

            if ($cols2.length > colCount) {
                $cols2.eq(colCount).width(35);
            }

            /* Update column width in total summary table*/
            if (model.showTotalSummary && this._$totalSummaryRowContainer) {
                var gridheaderCol = $(this.getHeaderTable()).find('colgroup');
                var footerColClone = $(gridheaderCol).clone();
                if (this._frozenColumnsLength > 0) {
                    if (this._$footertableContent) {
                        $(this._$footertableContent).find('colgroup').remove();
                        $(footerColClone[0]).prependTo(this._$footertableContent[0]);
                        $(footerColClone[1]).prependTo(this._$footertableContent[1]);
                    }
                }
                else {
                    if (this._$footertableContent) {
                        $(this._$footertableContent).find('colgroup').remove();
                        $(footerColClone).prependTo(this._$footertableContent);
                    }
                }
            }

            if (this._frozenColumnsLength > 0) {
                var frozenWidth = this._getFrozenColumnWidth();
                this.getContent().find("#e-movablecontainer" + this._id).css("margin-left", frozenWidth + "px");
                this.getContent().find("#e-frozencontainer" + this._id).outerWidth(frozenWidth);
                if (this.getScrollElement().data("ejScroller")) {
                    this.getScrollElement().ejScroller("option", "width", this._gridWidth - frozenWidth - this._totalBorderWidth - 1);
                    this.getScrollElement().ejScroller("option", "scrollTop", proxy._scrollTop);
                    this.getScrollElement().ejScroller("option", "scrollLeft", proxy._scrollLeft);
                }
                this.getHeaderContent().find("#e-frozenheaderdiv" + this._id).next().css("margin-left", frozenWidth + "px");
                this.getHeaderContent().find("#e-frozenheaderdiv" + this._id).outerWidth(frozenWidth)
                    .end().find("#e-movableheaderdiv" + this._id).css("width", "100%");
                if (this._$totalSummaryRowContainer) {
                    this._$totalSummaryRowContainer.find("#e-frozenfooterdiv" + this._id).width(width).next().css("margin-left", frozenWidth + "px");
                    this._$totalSummaryRowContainer.find("#e-frozenfooterdiv" + this._id).outerWidth(frozenWidth)
                        .end().find("#e-movablefooterdiv" + this._id).css("width", "100%");
                    if (this.getBrowserDetails().browser == "safari")
                        this._$totalSummaryRowContainer.find("#e-movablefooter" + this._id).css("margin-left", "auto");
                }
                if (this.getBrowserDetails().browser == "safari")
                    this.getHeaderContent().find("#e-movableheader" + this._id).add(this.getContent().find("#e-movablecontainer" + this._id)).css("margin-left", "auto");
            }
        },

        //ENTER EDIT MODE INTO THE TREEGRID CELL
        cellEdit: function (index, fieldName) {

            var proxy = this,
                $form,
                model = proxy.model,
                row, rowIndex = index,
                updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords,
                selectedItem = model.selectionMode == "row" ? this.selectedItem() : updatedRecords[proxy._rowIndexOfLastSelectedCell];

            if (proxy.model.showGridCellTooltip) {
                proxy._cellMouseLeave();
            }

            proxy.model.isEdit && proxy.saveCell();

            $form = $("#" + proxy._id + "EditForm");

            if ($form.length > 0) return true;

            if (!selectedItem) return false;

            if (model.isFromGantt && ((fieldName === "status" ||
                fieldName === "startDate" ||
                fieldName === "endDate" ||
                fieldName === "duration" ||
                fieldName === "predecessor") &&
                selectedItem.hasChildRecords) ||
                (fieldName === "baselineStartDate" ||
                    fieldName === "baselineEndDate") || (fieldName==="taskId")) {

                return false;

            }
            if (model.enableVirtualization || model.selectionMode === "cell" ) {
                rowIndex = updatedRecords.indexOf(selectedItem);
                index = model.currentViewData.indexOf(selectedItem);
            }

            row = ej.TreeGrid.getRowByIndex(this, rowIndex);
            if (row && $(row).find(".e-rowcell").length > 0) {
                var $targetTr = $(row),
                columnIndex = proxy.getColumnIndexByField(fieldName),
                $targetTd = $targetTr.find(".e-rowcell").eq(columnIndex),
                column = proxy.model.columns[columnIndex],
                data = selectedItem,
                beginEditArgs = {},
                args = {
                    validationRules: ej.isNullOrUndefined(column.validationRules) ? {} : $.extend(true, {},
                        column.validationRules),
                    columnName: column.field,
                    value: !ej.isNullOrUndefined(data[fieldName]) ? data[fieldName] : data.item && data.item[fieldName],
                    data: data,
                    columnObject: column,
                    cell: $targetTd
                },
                isEditable = true;

            if (model.isFromGantt && args.columnName === "predecessor") {

                var predecessor = args.data.item[proxy.model.predecessorMapping];
                args.value = predecessor ? predecessor : "";

            }

            beginEditArgs.data = data;
            beginEditArgs.columnIndex = columnIndex;
            beginEditArgs.rowElement = $targetTr;
            beginEditArgs.cellElement = $targetTd;

          

                proxy._cellEventTrigger($targetTr[0].cells[proxy._cellEditingDetails.columnIndex], data, args.columnObject);

                if (proxy._trigger("beginEdit", beginEditArgs)) return false;               

                if ($targetTr.hasClass("e-insertedrow") && (!args.columnObject.isTemplateColumn)) isEditable = true;

                if (isEditable) {

                    $.extend(proxy._cellEditingDetails, {
                        rowIndex: index,
                        cellValue: args.value,
                        columnIndex: columnIndex,
                        fieldName: fieldName,
                        cellEditType: args.columnObject.editType,
                        data: data
                    });
                }

                proxy._renderCellEditObject(args, $targetTd);
                if (!$targetTr.hasClass("e-templaterow")) {
                    $targetTr.addClass("e-editedrow");
                }

                args.cell && args.cell.addClass("e-editedcell");

                if (proxy._cellEditingDetails && proxy._cellEditingDetails.cellEditType == "dropdownedit")
                   proxy._focusTreeGridElement(); //To block keypress (enter & spacebar) event on dropdownlist
                 proxy._updateHorizontalScrollBar(fieldName);
                return true;
            }
        },

        _updateHorizontalScrollBar: function (fieldName)
        {
            var proxy = this,
                gridContent = proxy.getScrollElement(),
                isHorizontalScroll = gridContent.ejScroller("isHScroll");
            //Check if the horizontal scrollbar is exists or not
            if (isHorizontalScroll) {
                var model = proxy.model,
                columns = model.columns,
                columnLength = columns.length,
                columnIndex = proxy.getColumnIndexByField(fieldName),                
                width = 0, startWidth = 0,
                endWidth = 0, left = 0,
                viewPortWidth = gridContent.find(".e-content").width(),
                scrollLeft = gridContent.ejScroller("option", "scrollLeft"),
                form = $("#" + proxy._id + "EditForm"), row,
                cells=[];                
                if (model.selectionMode == "cell" && form.length == 0)
                    cells = $("#" + proxy._id).find(".selectingcell");//$(proxy._selectedCellDetails[proxy._selectedCellDetails.length - 1].cellElement).clone();
                else {
                    row = $(form).closest("tr.e-treegridrows");
                    cells = $(row).find("td.e-rowcell");
                }
                if (proxy._frozenColumnsLength > 0 && columnIndex < proxy._frozenColumnsLength)
                    return false;

                //Calculate the start and end width for edited cell
                for (var index = proxy._frozenColumnsLength; index <= columnIndex; index++) {
                    if (model.selectionMode == "cell" && form.length == 0)
                        var cell = cells[cells.length - 1];
                    else
                        var cell = $(cells[index - proxy._frozenColumnsLength]);
                    if (index == columnIndex) {
                        startWidth = width;
                        endWidth = width + $(cell).width() + parseFloat($(cell).css("padding-left")) + parseFloat($(cell).css("padding-right")) + 1; // 1 for border
                    }
                    if (columns[index].visible) {
                        width = width + $(cell).width() + parseFloat($(cell).css("padding-left")) + parseFloat($(cell).css("padding-right")) + 1; // 1 for border
                    }
                }
                // Check if the edited cell in viewport.
                if (startWidth < scrollLeft || endWidth > scrollLeft + viewPortWidth) {
                    if (startWidth < scrollLeft) {
                        left = scrollLeft - (scrollLeft - startWidth) - 3;
                    } else {
                        left = scrollLeft + (endWidth - (scrollLeft + viewPortWidth) + 3);// 3 for slightly adjust the left scrollbar
                    }
                    gridContent.ejScroller("option", { "scrollLeft": left });
                    proxy._updateHeaderScrollLeft(left);
                }
            }
        },
        updateAllowColumnResize: function (bool) {
            var proxy = this,
                model = proxy.model;
            model.allowColumnResize = bool;
            if (model.allowColumnResize)
                proxy._resizer = new ej.gridFeatures.gridResize(proxy);
            proxy._enableColumnResizeEvents();
        },

        //validate predecessor string

        _validatePredecessorString: function (string) {
            var proxy = this, result;
            if (string.length > 0) {
                string.split(',').forEach(function (el) {
                    values = el.split('+');
                    offsetvalue = '+';
                    if (el.indexOf('-') >= 0) {
                        values = el.split('-');
                        offsetvalue = '-';
                    }
                    match = values[0].match(/(\d+|[A-z]+)/g);
                    if (match && proxy.model.ids.indexOf(match[0]) != -1) {
                        if (match[1]) {
                            if (match[1].toUpperCase() == 'FS' || match[1].toUpperCase() == 'FF' || match[1].toUpperCase() == 'SF' || match[1].toUpperCase() == 'SS') {
                            }
                            else {
                                result = false;
                            }
                        }
                    } else {
                        result = false;
                    }
                });
            } else {
                return true;
            }
            if (result === undefined || result)
                return true;
            else
                return false;
        },

        //SAVE THE EDITED CELL
        
        saveCell: function () {

            var proxy = this,
                model = proxy.model;

            if ($("#" + proxy._id + "EditForm").length > 0) {

                if (!proxy.editFormValidate()) return true;

                if (proxy._cellEditingDetails.columnIndex >= 0) {
                   proxy._focusTreeGridElement();

                    var $form = $("#" + proxy._id + "EditForm"),
                        recordIndex = model.allowPaging ? proxy._updatedPageData.indexOf(proxy._cellEditingDetails.data) : model.updatedRecords.indexOf(proxy._cellEditingDetails.data),
                        $targetTr = ej.TreeGrid.getRowByIndex(this, recordIndex),
                        $targetTd = $form.closest("td"),
                        formattedValue, args = {},
                        column = model.columns[proxy._cellEditingDetails.columnIndex],
                        $element = $("#" + proxy._id + proxy._cellEditingDetails.fieldName),
                        cellElement;

                    args = {
                        columnName: column.field,
                        value: proxy.getCurrentEditCellData(),
                        data: proxy._cellEditingDetails.data,
                        previousValue: proxy._cellEditingDetails.cellValue,
                        columnObject: column,
                        cellElement: $targetTd,
                        rowElement: $targetTr,
                    };

                    if (proxy._cellEditingDetails.cellEditType == "datetimepicker" ||
                        proxy._cellEditingDetails.cellEditType == "dropdownedit" ||
                        proxy._cellEditingDetails.cellEditType == "datepicker") {

                        $element.data("ejWidgets") && $element[$element.data("ejWidgets")[0]]("destroy");                        

                    }

                    if (!ej.isNullOrUndefined(column.format)) {

                        formattedValue = proxy.formatting(column.format, args.value , model.locale);
                        args.cellElement.empty().html(formattedValue);

                    } else {

                        if (args.columnObject.type == "boolean") {

                            var cellData = {};
                            cellData[args.columnObject.field] = args.value;
                            args.cellElement.empty().html(
                                $($.templates.Grid_JSONTemplate.render(cellData))[0].cells[proxy._cellEditingDetails.columnIndex].innerHTML
                            );

                        } else args.cellElement.empty().html(args.value);
                    }

                    var isValueModified = ((proxy._cellEditingDetails.cellEditType == "datepicker" ||
                            proxy._cellEditingDetails.cellEditType == "datetimepicker") &&
                        args.value instanceof Date && args.previousValue instanceof Date) ?
                        (args.value.getTime() !== args.previousValue.getTime()) :
                        (args.value !== args.previousValue);

                    model.isEdit = false;

                    var fieldName = proxy._cellEditingDetails["fieldName"];

                    //To avoid duplicate ID for TreeGrid on self reference while editing ID value
                    if (!model.isFromGantt && model.idMapping && model.parentIdMapping && fieldName == model.idMapping) {
                        if (proxy._validateIdValue(args.value)) {
                            args.value = args.previousValue
                            isValueModified = false;
                        }
                    }

                    if (model.isFromGantt && fieldName === "predecessor") {

                        var eventArg = {}, stringResult, logicResult;
                        args.value = args.value.trim();
                        stringResult = proxy._validatePredecessorString(args.value);
                        if (stringResult) {
                            eventArg.predecessorString = args.value.split(',');
                            eventArg.currentRecord = args.data;
                            eventArg.requestType = "validatePredecessor";
                            proxy._trigger("actionComplete", eventArg);
                            logicResult = eventArg.result;
                            if (!logicResult) {
                                args.value = args.previousValue;
                            }
                        }
                        else {
                            args.value = args.previousValue;
                        }
                        args.value = args.value.toUpperCase();
                        var ganttPredecessor = [],
                        prevPredecessors = [],
                        modifiedPredecessors = [],
                        count = 0,
                        length, predecessor;
                        args.previousValue = args.data.predecessor;
                        prevPredecessors = args.previousValue;
                        if (args.value.length > 0) {
                            modifiedPredecessors = args.data._calculatePredecessor(args.value);
                        }
                        length = modifiedPredecessors.length;
                        var index = 0,
                            prevPrdecessorlength = args.previousValue && args.previousValue.length;
                        for (index = 0; index < prevPrdecessorlength; index++) {
                            predecessor = prevPredecessors[index];
                            if (predecessor.from === args.data.taskId.toString()) {
                                ganttPredecessor.push(predecessor);
                            }
                        }
                        for (count = 0; count < length; count++) {
                            ganttPredecessor.push(modifiedPredecessors[count]);
                        }
                        args.data[proxy._cellEditingDetails["fieldName"]] = ganttPredecessor;
                        args.data.item[model.predecessorMapping] = args.value;
                        args.data.predecessorsName = args.value;
                        if (model.enableWBS && model.enableWBSPredecessor)
                            proxy.updateWBSPredecessor(args.data);

                    } else if (isValueModified) {
                        if (model.isFromGantt) {

                            switch (fieldName) {

                                case "taskId":
                                    args.data.item[model.taskIdMapping] = args.value;
                                    break;
                                case "taskName":
                                    args.data.item[model.taskNameMapping] = args.value;
                                    break;
                                case "startDate":
                                    args.data.item[model.startDateMapping] = args.value;
                                    break;
                                case "endDate":
                                    args.data.item[model.endDateMapping] = args.value;
                                    break;
                                case "resourceInfo":
                                    args.data.item[model.resourceInfoMapping] = proxy._getResourceId( args.value);                                    
                                    break;
                                case "duration":
                                    args.data.item[model.durationMapping] = args.value;
                                    break;
                                case "status":
                                    args.data.item[model.progressMapping] = args.value;
                                    break;
                                default:
                                    args.data.item[proxy._cellEditingDetails.fieldName] = args.value;
                                    break;
                            }

                        } else {
                            args.data.item[proxy._cellEditingDetails.fieldName] = args.value;
                        }
                        
                        args.data[proxy._cellEditingDetails.fieldName] = args.value;
                        
                    }

                    if (model.isFromGantt && (args.columnName === "startDate" ||
                        args.columnName === "endDate" ||
                        args.columnName === "duration" ||
                        args.columnName === "predecessor" ||
                        args.columnName == "status")) {

                        args.isModified = true;

                    }
                    if (this._frozenColumnsLength > 0) {
                        if (!model.allowSelection)
                            args.data.isSelected = false;
                        if (proxy._cellEditingDetails.columnIndex < this._frozenColumnsLength)
                            cellElement = $($.render[proxy._id + "_JSONFrozenTemplate"](args.data))[0].cells[proxy._cellEditingDetails.columnIndex];
                        else
                            cellElement = $($.render[proxy._id + "_Template"](args.data))[0].cells[(proxy._cellEditingDetails.columnIndex - this._frozenColumnsLength)];
                    } else {
                        if (!model.allowSelection)
                            args.data.isSelected = false;
                        cellElement = $($.render[proxy._id + "_Template"](args.data))[0].cells[proxy._cellEditingDetails.columnIndex];
                    }
                    args.cellElement.removeClass("e-editedcell").replaceWith(cellElement);
                    args.cellElement = $(cellElement);
                    /* refresh details Row */
                    if (model.showDetailsRow && !model.showDetailsRowInfoColumn && model.detailsTemplate) {
                        this._refreshDetailsRow(model.currentViewData.indexOf(args.data));
                    }

                    proxy._trigger("refresh");
                    if (!args.data.treeMappingName)
                        args.data.treeMappingName = [];
                    args.data.treeMappingName.push(args.columnName);
                    if (proxy._trigger("endEdit", args)) {
                        args.data[args.columnName] = args.previousValue;
                        args.data.item[args.columnObject.field] = args.previousValue;
                        proxy.selectRows(this.selectedRowIndex());
                        ej.TreeGrid.refreshRow(proxy, model.currentViewData.indexOf(args.data));
                    }
                    
                    proxy._cellEventTrigger(args.cellElement[0], args.data, args.columnObject);
                    $targetTr.removeClass("e-editedrow");                    
                }
                if (model.showSummaryRow) {
                    args.editType = "celledit";
                    proxy._updateSummaryRow(args);
                }
                if (model.showTotalSummary) {
                    args.editType = "celledit";
                    proxy._updateTotalSummaryRow(args);
                }
                proxy._cancelSaveTools();
                var colObject = args.columnObject;
                if (model.allowFiltering && colObject && colObject.filterEditType == "dropdownedit" && colObject.editType != "dropdownedit")
                    proxy._resizeFilteringElements();
            }
            return false;
        },

        //VALIDATE THE MODIFIED CELLVALUE
        editFormValidate: function () {

            if ($.isFunction($.validator))
                return $("#" + this._id + "EditForm").validate({
                    onsubmit: false
                }).form();

            return true;
        },

        /*Update WBS predecessors value*/
        updateWBSPredecessor: function (preData) {
            var proxy = this,
                model = proxy.model,
                prdc = preData["predecessorsName"],
                wbspred = null;
            if (prdc && prdc.length > 0) {
                var prdcList = prdc.split(',');
                for (var p = 0; p < prdcList.length; p++) {
                    var ref = prdcList[p].match(/(\d+|[A-z]+)/g),
                        refId = +ref[0],
                        refType = ref[1],
                        refRecord;
                    refRecord = model.flatRecords.filter(function (record) {
                        return record && record.taskId == refId;
                    });
                    var newOne;
                    if (refType)
                        newOne = refRecord[0] && refRecord[0]["WBS"] + refType;
                    else
                        newOne = refRecord[0] && refRecord[0]["WBS"];
                    wbspred = wbspred ? (wbspred + "," + newOne) : newOne;
                }
                preData["WBSPredecessor"] = wbspred;
                preData["item"]["WBSPredecessor"] = wbspred;
            }
            else {
                preData["WBSPredecessor"] = "";
                preData["item"]["WBSPredecessor"] = "";
            }
        },

        //GET THE CURRENT CELL DATA
        getCurrentEditCellData: function () {

            var proxy = this,
                model = proxy.model,
                columns = model.columns,
                column, cellDate;

            if ($("#" + proxy._id + "EditForm").length) {

                var $element = $("#" + proxy._id + proxy._cellEditingDetails.fieldName),
                    cellValue;
                column = columns[proxy._cellEditingDetails.columnIndex];
                switch (proxy._cellEditingDetails.cellEditType) {

                    case ej.TreeGrid.EditingType.String:
                        cellValue = $element.val();
                        break;

                    case ej.TreeGrid.EditingType.Numeric:
                        cellValue = parseFloat($element.val());
                        if (model.isFromGantt && (column.field == "status" || column.field == "duration")) {
                            cellValue = isNaN(cellValue) ? proxy._cellEditingDetails.cellValue : cellValue;
                        } else {
                            cellValue = $element.ejNumericTextbox("model.value");
                        }
                        break;

                    case ej.TreeGrid.EditingType.Maskedit:
                        cellValue = $element.ejMaskEdit("model.value");
                        break;
                    case ej.TreeGrid.EditingType.Dropdown:
                        if (model.isFromGantt && proxy._cellEditingDetails.fieldName  === "resourceInfo") {
                            cellValue = proxy._getSelectedItem($element.ejDropDownList("model.selectedItems"));
                        } else
                            cellValue = $element.ejDropDownList("model.value");
                        break;

                    case ej.TreeGrid.EditingType.Boolean:
                        cellValue = $element.is(':checked');
                        break;

                    case ej.TreeGrid.EditingType.DatePicker:
                        if (column && !column.format) {
                            cellValue = ej.format($element.ejDatePicker("model.value"), this.model.dateFormat)
                        }
                        else {
                            cellValue = $element.ejDatePicker("model.value");
                        }
                        if (cellValue == "" && model.isFromGantt)
                            cellValue = proxy._cellEditingDetails.cellValue;
                        break;

                    case ej.TreeGrid.EditingType.DateTimePicker:

                        var dateTimePickerValue = $element.ejDateTimePicker("model.value"),
                            dateTimePickerFormat = $element.ejDateTimePicker("model.dateTimeFormat"),
                            tempValue;

                        if (column && !column.format) {
                            cellValue = ej.format($element.ejDateTimePicker("model.value"), this.model.dateFormat)
                        }
                        else {
                            cellValue = $element.ejDateTimePicker("model.value");
                        }
                        cellDate = ej.format($element.val(), dateTimePickerFormat);
                        tempValue = ej.format(dateTimePickerValue, dateTimePickerFormat);
                        if (cellDate !== tempValue && model.isFromGantt)
                            cellValue = proxy._cellEditingDetails.cellValue;
                        break;

                }
                if (typeof cellValue == "string" && cellValue.length &&
                    model.columns[proxy._cellEditingDetails.columnIndex].type == "number") {

                    cellValue = parseFloat(cellValue);

                }

                return cellValue;
            }

            return null;
        },
        //Get the value from edited row

        getCurrentEditCellDataForRowEdit: function (field,type,cellIndex) {

            var proxy = this,
                model = proxy.model,
                columns = model.columns,
                column;

            if ($("#" + proxy._id + "EditForm").length) {

                var $element = $("#" + proxy._id + field),
                    cellValue, dateValue;
                column = columns[cellIndex];

                switch (type) {

                    case ej.TreeGrid.EditingType.String:
                        cellValue = $element.val();
                        break;

                    case ej.TreeGrid.EditingType.Numeric:
                        cellValue = parseFloat($element.val());
                        cellValue = $element.ejNumericTextbox("model.value");
                        break;

                    case ej.TreeGrid.EditingType.Dropdown:
                        cellValue = $element.ejDropDownList("model.value");
                        $element.data("ejWidgets") && $element[$element.data("ejWidgets")[0]]("destroy");
                        break;

                    case ej.TreeGrid.EditingType.Boolean:
                        cellValue = $element.is(':checked');
                        break;

                    case ej.TreeGrid.EditingType.DatePicker:

                        if (model.dateFormat.toLowerCase().indexOf("hh") == -1)
                            dateValue = $element.ejDatePicker("model.value");
                        else {
                            dateValue = $element.ejDateTimePicker("model.value");
                        }

                        if (column && !column.format) {
                            cellValue = proxy.getFormatedDate(dateValue);
                        }
                        else {
                            cellValue = dateValue;
                        }
                       
                        $element.data("ejWidgets") && $element[$element.data("ejWidgets")[0]]("destroy");
                        break;

                    case ej.TreeGrid.EditingType.DateTimePicker:

                        if (column && !column.format) {
                            cellValue = ej.format($element.ejDateTimePicker("model.value"), this.model.dateFormat)
                        }
                        else {
                            cellValue = $element.ejDateTimePicker("model.value");
                        }
                        $element.data("ejWidgets") && $element[$element.data("ejWidgets")[0]]("destroy");
                        break;

                    case ej.TreeGrid.EditingType.Maskedit:
                        cellValue = $element.ejMaskEdit("model.value");
                        break;

                }
                if (typeof cellValue == "string" && cellValue.length &&
                    model.columns[cellIndex].type == "number") {
                    cellValue = parseFloat(cellValue);
                }

                return cellValue;
            }

            return null;
        },

        _getResourceId:function(dataSource){

            var resourceIds = [],
                count = 0, length = dataSource.length;

            for (count = 0; count < length; count++) {
                resourceIds.push(dataSource[count][this.model.resourceIdMapping]);
            }
            return resourceIds;
        },

        _getSelectedItem: function (indexArray) {

            var proxy = this,
                count = 0,
                length = indexArray.length,
                dropDownData = proxy.model.columns[proxy._cellEditingDetails.columnIndex].dropdownData,
                selectedItems = [];

            if (dropDownData) {

                for (count = 0; count < length; count++) {

                    $.each(dropDownData, function (index, resourceInfo) {
                        if (indexArray[count] === index) {
                            selectedItems.push(resourceInfo);
                        }
                    });

                }
            }

            return selectedItems;
        },

        //GET THE FORMATED DATE 
        getFormatedDate: function (date) {
            return ej.format(date, this.model.dateFormat);
        },
        //Get formated string from date object
        getDateFromFormat: function (date) {

            if (typeof date === "object") {
                return new Date(date);
            }
            if (date) {
                return ej.parseDate(date, this.model.dateFormat) == null ?
                    new Date(date) : ej.parseDate(date, this.model.dateFormat);
            }
        },

        //GET THE FORMATTED TEXT
        formatting: function (formatstring, str, locale) {
            formatstring = formatstring.replace(/%280/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            locale = ej.preferredCulture[locale] ? locale : "en-US";
            var s = formatstring;
            var frontHtmlidx, FrontHtml, RearHtml, lastidxval;
            frontHtmlidx = formatstring.split("{0:");
            lastidxval = formatstring.split("}");
            FrontHtml = frontHtmlidx[0];
            RearHtml = lastidxval[1];
            if (typeof (str) == "string" && $.isNumeric(str))
                str = Number(str);
            if (formatstring.indexOf("{0:") != -1) {
                var toformat = new RegExp("\\{0(:([^\\}]+))?\\}", "gm");
                var formatVal = toformat.exec(formatstring);
                if (formatVal != null && str != null) {
                    if (FrontHtml != null && RearHtml != null)
                        str = FrontHtml + ej.format(str, formatVal[2], locale) + RearHtml;
                    else
                        str = ej.format(str, formatVal[2], locale);
                } else if (str != null)
                    str = str;
                else
                    str = "";
                return str;
            } else if (this.data != null && this.data.Value == null) {
                $.each(this.data, function (dataIndex, dataValue) {
                    s = s.replace(new RegExp('\\{' + dataIndex + '\\}', 'gm'), dataValue);
                });
                return s;
            } else {
                return this.data.Value;
            }
        },


        //GET THE COLUMNINDEX BY USIGN THE FIELD NAME
        getColumnIndexByField: function (fieldName) {

            var proxy = this,
                columns = proxy.model.columns,
                length = columns.length,
                column = 0;

            for (column; column < length; column++) {
                if (columns[column]["field"] == fieldName)
                    break;
            }

            return column == columns.length ? -1 : column; // if field name not available in columns collection, it return -1 value.
        },

        getUpNextVisibleColumnIndex: function (index, action) {
            var proxy = this, columns = proxy.model.columns;
            if (!index)
                index = 0;
            for (index; index <= columns.length; index++) {
                if (index == columns.length && (action == "rightArrow" || action == "moveCellRight")) {
                    index = 0;
                    proxy._focusingRowIndex += 1;
                }
                if (columns[index].visible && columns[index].allowCellSelection)
                    return columns.indexOf(columns[index]);
            }
        },
        getPreviousVisibleColumnIndex: function (index, action) {
            var proxy = this, columns = proxy.model.columns;
            if (!index)
                index = columns.length - 1;
            for (index; index < columns.length; index--) {
                if (index < 0 && (action == "leftArrow" || action == "moveCellLeft")) {
                    index = columns.length - 1;
                    proxy._focusingRowIndex -= 1;
                }
                if (columns[index].visible && columns[index].allowCellSelection)
                    return columns.indexOf(columns[index]);
            }
        },
        //GET THE BROWSER DETAILS
        getBrowserDetails: function () {
            var b = navigator.userAgent.match(/(firefox|chrome|opera|msie|safari)\s?\/?(\d+(.\d+)*)/i);
            if (!!navigator.userAgent.match(/Trident\/7\./))
                return { browser: "msie", version: jQuery.uaMatch(navigator.userAgent).version };
            return { browser: b[1].toLowerCase(), version: b[2] };
        },
        //Check whether the Browser is Mobile Device's or not.
        mobileDevice: function () {
            if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)
                || navigator.userAgent.match(/Windows Phone/i)) {
                return true;
            }
            else {
                return false;
            }
        },


        setValidation: function () {

            var proxy = this,
                columns = proxy.model.columns,
                length = columns.length,
                count = 0;

            proxy._initValidator();

            for (count; count < length; count++) {

                if (!ej.isNullOrUndefined(columns[count]["validationRules"])) {

                    proxy.setValidationToField(columns[count].field, columns[count].validationRules);

                }
            }
        },

        //SET THE VALIDATION TO THE PARTICULAR FIELD
        setValidationToField: function (name, rules) {

            var proxy = this,
                ele = $("#" + proxy._id + name).length > 0 ? $("#" + proxy._id + name) : $("#" + name);
            ele.rules("add", rules);

            var validator = $("#" + proxy._id + "EditForm").validate({
                onsubmit: false

            });

            if (!ej.isNullOrUndefined(rules["required"])) {

                validator.settings.messages[name] = {};
                validator.settings.messages[name]["required"] = ej.TreeGrid.getColumnByField(proxy.model.columns, name).headerText + " is required";

            }
        },


        //GET THE FIELDNAME OF COLUMN BY USING THE HEADERTEXT
        getFieldNameByHeaderText: function (headerText) {

            var proxy = this;

            if (ej.isNullOrUndefined(proxy._fieldColumnNames[headerText])) return null;

            return proxy._fieldColumnNames[headerText];
        },


        //CLEAR THE SELECTION

        

        clearSelection: function (index) {

            var proxy = this,
                model = proxy.model,
                updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;

            if (this.selectedRowIndex() != -1 || (this.selectedRowIndex() == -1 && proxy._previousIndex != -1) || index == -1) {
                                                 //To clear the row selection of previously selected row via set model (selectedRowIndex)
                var $gridRows,
                    index;
                if (this._frozenColumnsLength) {
                    $gridRows = $(proxy.getRows()[0]).add(proxy.getRows()[1]);
                } else {
                    $gridRows = proxy.getRows();
                }     
                if (!ej.isNullOrUndefined(index) && index != -1) {
                    ej.TreeGrid.getRowByIndex(proxy, index).find(".e-selectionbackground").removeClass("e-selectionbackground").removeClass("e-active");
                    var record = updatedRecords[index];
                    record && (record.isSelected = false);
                    }
                    else {

                        if ($gridRows) {
                            $gridRows.find(".e-rowcell,.e-detailsrowcell").removeClass("e-selectionbackground").removeClass("e-active");
                        }
                        var dataManager = new ej.DataManager(model.flatRecords);

                        var query = new ej.Query();
                        query.search(true, ['isSelected'], ej.FilterOperators.Equals, true);

                        var records = dataManager.executeLocal(query);
                        var length = records && records.length;

                        if (length > 0) {

                            var count = 0;

                            for (count = 0; count < length; count++) {
                                records[count].isSelected = false;
                            }

                        }

                    }
                    //Clearing the selected item and index while clearing the row selection itself
                    if (!model.selectedItems.length || (model.selectedItems.length && model.selectionType == "single")) {
                        proxy.selectedRowIndex(-1);
                        model.selectedItem = null;//For single selection only
                        model.selectedItems = [];
                        proxy._cancelSaveTools();
                    }
                
            }
            if (model.selectionMode == "cell") {
                proxy._selectedCellDetails = [];
                model.selectedCellIndexes = [];
                $("#" + proxy._id).find(".selectingcell").removeClass("selectingcell");

                proxy._rowIndexOfLastSelectedCell = -1;
                proxy._lastSelectedCellIndex = -1;
                proxy._focusingRowIndex = -1;
            }
        },


        //COUNT THE CHILDRECORDS COUNT
        getChildRecordsCount: function (record) {

            var proxy = this,
                childRecords = record.childRecords,
                count = 0,
                length = childRecords ? childRecords.length : 0;

            for (count; count < length; count++) {

                if (proxy._filteredRecords.length > 0) {

                    var recordIndex = proxy._filteredRecords.indexOf(childRecords[count]);

                    if (recordIndex != -1) {

                        ++proxy._removedCount;

                        if (childRecords[count].hasChildRecords && childRecords[count].expanded) {
                            proxy.getChildRecordsCount(childRecords[count]);
                        }

                    }
                } else {

                    ++proxy._removedCount;

                    if (childRecords[count].hasChildRecords && childRecords[count].expanded) {
                        proxy.getChildRecordsCount(childRecords[count]);
                    }

                }
            }

            return proxy._removedCount;
        },


        //GET THE EXPAND STATUS OF RECORD
        getExpandStatus: function (record) {

            var parentRecord = record.parentItem;

            if (parentRecord != null) {

                if (parentRecord.expanded === false) {
                    return false;
                } else if (parentRecord.parentItem) {

                    if (parentRecord.parentItem.expanded === false) {
                        return false;
                    } else {
                        return this.getExpandStatus(parentRecord.parentItem);
                    }

                } else return true;
            } else return true;
        },


        //RETURN THE COLUMN FIELD NAMES
        getColumnFieldNames: function () {

            var columnNames = [],
                columns = this.model.columns,
                count = 0,
                length = columns.length;

            for (count; count < length; count++) {

                if (columns[count]["field"] && (columns[count]["field"] != "resourceInfo") && (columns[count]["field"] != "predecessor")) { 
                    columnNames.push(columns[count]["field"]);
                }
                else if (columns[count]["field"] == "resourceInfo") {
                    
                    columnNames.push("resourceNames");
                }
                else if (columns[count]["field"] == "predecessor")
                {
                    
                    columnNames.push("predecessorsName");
                }

            }

            return columnNames;
        },


        //RENDERED  RECORDS
        renderRecords: function (args) {

            var proxy = this,
                model = proxy.model;

            if (!args) {

                args = {};
                if (!model.isFromGantt && model.enableCollapseAll) {
                    args.requestType = ej.TreeGrid.Actions.ExpandCollapse;                   
                    proxy._isInExpandCollapseAll = true;                                    
                }
                else
                    args.requestType = ej.TreeGrid.Actions.Refresh;

            }

            this.sendDataRenderingRequest(args);
            proxy._isInExpandCollapseAll = false;
        },       

        _shiftKeySelectCells: function (args, targetIndex) {
            var proxy = this, model = proxy.model,
                //Get First Row Details for shift key functions.
                firstRowElementIndex = proxy._shiftKeyFirstElementDetails.firstElementRowIndex,
                firstRowCellIndex = proxy._shiftKeyFirstElementDetails.firstElementCellIndex,
                secondRowElementIndex = args.rowIndex,
                secondRowCellIndex = args.cellIndex,
                shiftKeyRowIndexes = [firstRowElementIndex, secondRowElementIndex],
                shiftKeyCellIndexes = [firstRowCellIndex, secondRowCellIndex];

            //Sort the two Selected row and cell Indexes.
            shiftKeyRowIndexes.sort(function (a, b) {
                return (a - b);
            });
            shiftKeyCellIndexes.sort(function (a, b) {
                return (a - b);
            });
            proxy._isShiftKeyNavigation = true;
            proxy._selectedCellDetails = [];
            model.selectedCellIndexes = [];
            $("#" + proxy._id).find(".selectingcell").removeClass("selectingcell");

            for (var rowIndex = shiftKeyRowIndexes[0]; rowIndex <= shiftKeyRowIndexes[1]; rowIndex++) {
                var record = model.updatedRecords && model.updatedRecords[rowIndex],
                    currentRowIndex = model.currentViewData.indexOf(record);
                if (record.isSummaryRow)
                    continue;
                for (var cellIndex = shiftKeyCellIndexes[0]; cellIndex <= shiftKeyCellIndexes[1]; cellIndex++) {
                    proxy.selectCells([{ rowIndex: rowIndex, cellIndex: cellIndex }]);
                }
            }
        },

        selectCells: function (indexes, preservePreviousSelectedCells) {
            var proxy = this,
                model = proxy.model,
                $gridRows = proxy.getRows(), $targetRow, targetCell, record, length = indexes.length, columns=model.columns;

            if (model.selectionType == "single")
                length = 1;
            if ((!preservePreviousSelectedCells || ej.isNullOrUndefined(preservePreviousSelectedCells)) &&
                proxy._isShiftKeyNavigation == false) {
            proxy._selectedCellDetails = [];
                model.selectedCellIndexes = [];
            $("#" + proxy._id).find(".selectingcell").removeClass("selectingcell");
            }
            if (model.selectionMode == "cell" && model.allowSelection && $gridRows.length > 0) {
                for (index = 0; index < length; index++) {
                    if (indexes[index].rowIndex == -1)
                        continue;
                    var record = model.updatedRecords && model.updatedRecords[indexes[index].rowIndex],
                        currentRowIndex = model.currentViewData.indexOf(record);
                    if (record.isSummaryRow)
                        continue;
                    var frozenColumnRowIndex = indexes[index].cellIndex >= proxy._frozenColumnsLength ? 1 : 0,
                       targetCellIndex = indexes[index].cellIndex >= proxy._frozenColumnsLength ? indexes[index].cellIndex - proxy._frozenColumnsLength : indexes[index].cellIndex;
                    if (proxy._frozenColumnsLength > 0) {
                        $targetRow = $gridRows[frozenColumnRowIndex][currentRowIndex];
                    }
                    else
                        $targetRow = $gridRows[currentRowIndex];

                    if (!ej.isNullOrUndefined(record) && ej.isNullOrUndefined($targetRow))
                        $targetRow = $($.render[proxy._id + "_Template"](record))[0];

                    targetCell = $targetRow.childNodes[targetCellIndex];
                    if (indexes[index].cellIndex != -1 && columns[indexes[index].cellIndex].allowCellSelection && columns[indexes[index].cellIndex].visible &&
                           !proxy._cellSelectingEventTrigger({ rowIndex: indexes[index].rowIndex, cellIndex: indexes[index].cellIndex, rowElement: $targetRow, cellElement: targetCell })) {
                        $(targetCell).addClass("selectingcell");

                        var selectedCellInfo = {
                            rowIndex: indexes[index].rowIndex,
                            cellIndex: indexes[index].cellIndex,
                            cellElement: targetCell,
                            data: record
                        };

                        currentCellIndex = proxy._selectedCellDetails.map(function (e) { return e.cellElement; }).indexOf(targetCell);
                        if (currentCellIndex == -1) {
                            proxy._selectedCellDetails.push(selectedCellInfo);
                            model.selectedCellIndexes.push({ rowIndex: selectedCellInfo.rowIndex, cellIndex: selectedCellInfo.cellIndex });
                        }
                        proxy._cellSelectedEventTrigger({ rowIndex: indexes[index].rowIndex, cellIndex: indexes[index].cellIndex, rowElement: $targetRow, cellElement: targetCell }, proxy._previousSelectedCellDetails);
                        proxy._previousSelectedCellDetails = {
                            rowElement: $targetRow,
                            cellElement: targetCell,
                            cellIndex: indexes[index].cellIndex,
                            rowIndex: indexes[index].rowIndex,
                        }
                        proxy._updateHorizontalScrollBar(columns[indexes[index].cellIndex].field);
                    }
                }
            }
            if (proxy._isShiftKeyNavigation == false) {
            //For selecting multiple cells with Shift key.
            proxy._shiftKeyFirstElementDetails.firstElementRowIndex = proxy._focusingRowIndex;
            proxy._shiftKeyFirstElementDetails.firstElementCellIndex = proxy._cellIndex;
            //Get back Default values for key board navigation.           
            proxy._rowIndexOfLastSelectedCell = selectedCellInfo ? selectedCellInfo.rowIndex : proxy._rowIndexOfLastSelectedCell;
            proxy._lastSelectedCellIndex = proxy._cellIndex;
            }
        },

        //SELECT THE ROW IN TREEGRID
        selectRows: function (rowIndex, toIndex) {

            var proxy = this,
                model = proxy.model;

            var $gridRows = proxy.getRows(),
            selectedItem;
            if (model.selectionMode == "cell" && rowIndex != -1)
                return;
            if (ej.TreeGrid.getRowByIndex(proxy, rowIndex).hasClass("e-summaryrow"))
                return;
            if ((model.editSettings.allowEditing || model.editSettings.allowAdding) && !proxy._isRowEdit && model.editSettings.beginEditAction != "click") {
                if ($("#" + proxy._id + "EditForm").length > 0 && proxy.endEdit()) {
                    $gridRows = proxy.getRows();
                    return;
                }
            }
            if (this._frozenColumnsLength > 0)
                $gridRows = $(proxy.getRows()[0]);

            if (ej.isNullOrUndefined(toIndex) || ej.isNullOrUndefined(rowIndex)) {

                rowIndex = ej.isNullOrUndefined(rowIndex) ? toIndex : rowIndex;        

                    switch (model.selectionType) {

                        case ej.TreeGrid.SelectionType.Multiple:

                            if (proxy._multiSelectCtrlRequest) {
                            var currentRecord = model.updatedRecords[rowIndex],
                            selectedRowIndex = $.inArray(currentRecord, model.selectedItems);
                            proxy._prevSelectedItem = model.updatedRecords[rowIndex];
                                if (selectedRowIndex != -1) {
                                    proxy.clearSelection(rowIndex);
                                model.selectedItems.splice(selectedRowIndex, 1);
                                currentRecord.isSelected = false;
                                model.selectedItem = model.selectedItems.length > 0 ? model.selectedItems[model.selectedItems.length - 1] : null;
                                }

                                if (selectedRowIndex == -1) {
                                model.selectedItems.push(currentRecord);
                                    if (model.allowSelection)
                                        ej.TreeGrid.getRowByIndex(proxy, rowIndex).attr("aria-selected", "true").find('.e-rowcell,.e-detailsrowcell').addClass(" e-selectionbackground e-active").attr("tabindex", "0");
                                currentRecord.isSelected = true;
                                model.selectedItem = model.updatedRecords[rowIndex];
                                }
                                break;
                            }
                            

                        case ej.TreeGrid.SelectionType.Single:
                            proxy.clearSelection(-1);
                            model.selectedItem = null,
                            updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;
                            if (rowIndex <= updatedRecords.length - 1) {
                            (rowIndex != -1) && model.selectedItems.push(updatedRecords[rowIndex]);
                            proxy._prevSelectedItem = updatedRecords[rowIndex];
                                if (model.allowSelection)
                                    ej.TreeGrid.getRowByIndex(proxy, rowIndex).find('.e-rowcell,.e-detailsrowcell').addClass(" e-selectionbackground e-active");
                                if (updatedRecords[rowIndex]) {
                                    updatedRecords[rowIndex].isSelected = true;  //Selection issue Changes
                                    model.selectedItem = updatedRecords[rowIndex];
                                }
                                
                            if (proxy._prevSelectedItem && proxy._prevSelectedItem != model.selectedItem) {
                                proxy._prevSelectedItem.isSelected = false;
                                }

                            }
                            break;
                    }
                if (model.selectedItems.length && model.selectedItems.indexOf(updatedRecords[rowIndex]) != -1) {
                    proxy._prevSelectedItem = updatedRecords[rowIndex];
                    if (this.selectedRowIndex() != rowIndex) {
                        this.selectedRowIndex(rowIndex);
                    }
              
                }
                else if (model.selectedItems.length == 0 && !proxy._prevSelectedItem && this.selectedRowIndex() != -1) {
                    this.selectedRowIndex(-1);
            } else {
                    this.selectedRowIndex(model.updatedRecords.indexOf(model.selectedItems[model.selectedItems.length - 1]));
                }

            } else {

                if (model.selectionType == ej.TreeGrid.SelectionType.Multiple) {
                proxy.clearSelection(-1);
                    proxy.selectedRowIndex(rowIndex);
                    model.selectedItem = model.updatedRecords[rowIndex];
                    var count = 0,
                    records = rowIndex - toIndex < 0 ? model.updatedRecords.slice(rowIndex, toIndex + 1) : model.updatedRecords.slice(toIndex, rowIndex + 1),
                    row, updatedRowIndex, tempRows;
                    for (count; count < records.length; count++) {
                        if (proxy.getExpandStatus(records[count])) {
                            records[count].isSelected = true;
                            updatedRowIndex = model.updatedRecords.indexOf(records[count]);
                            row = ej.TreeGrid.getRowByIndex(proxy, updatedRowIndex);
                    if (this._frozenColumnsLength) {
                                tempRows = $(row[0]).add(row[1]);
                                row = row[0];
                    } else {
                                tempRows = row;
                    }
                            tempRows && $(tempRows).find('.e-rowcell,.e-detailsrowcell').addClass(" e-selectionbackground e-active");
                    }
                }

                }
            }

            model.selectedItems = proxy.getSelectedRecords();
            proxy._multiSelectCtrlRequest = false;
            return false;
        },

        /* Get all selected records from treegrid*/
        getSelectedRecords: function () {
            var proxy = this,
                model = this.model,
                selectedRecords = [];
            selectedRecords = model.updatedRecords.filter(function (record) {
                return record.isSelected;
            });
            return selectedRecords.slice();
        },
        /* Clear all selected rows and cells*/
        clearAllSelection: function () {
            var proxy = this,
                model = this.model;
            proxy.selectRows(-1);
            proxy.selectedRowIndex(-1);
            model.selectedItem = null;
            model.selectedItems = [];

            //To clear cell Selections
            proxy._selectedCellDetails = [];
            model.selectedCellIndexes = [];            
            proxy._rowIndexOfLastSelectedCell = -1;
            proxy._lastSelectedCellIndex = -1;
            proxy._focusingRowIndex = -1;
            $("#" + proxy._id).find(".selectingcell").removeClass("selectingcell");

            proxy._cancelSaveTools();
        },
        //GET THE CURRENTCELLINDEX
        getCellIndex: function (e, target) {

            var $target = $(e.target),
                cellIndex = -1,
                model =this.model;

            if (target) $target = $(target);
            if ($target.hasClass("e-detailsrowcell") || $target.closest("td").hasClass("e-detailsrowcell"))
                return -1;
            if ($target.prop("tagName") == "TD") {
                cellIndex =  $target.index();
            } else if ($target.prop('tagName') == "DIV" && $target.hasClass('e-cell')) {

                var $td = $target.closest('td');
                cellIndex = $td.index();

            } else if ($target.prop('tagName') == "DIV" && $($target.closest('td')[0]).hasClass("e-templatecell")) {

                var $td = $target.closest('td');
                cellIndex = $td.index();
            }
            else if ($($target.closest('td')[0]).hasClass("e-templatecell") && $($target.closest("tr")[0]).hasClass("e-templaterow")) {

                var $td = $target.closest('td');
                cellIndex = $td.index();
            }
            else if ($target.parent().prop("tagName") == "TD") {
                var $td = $target.closest('td');
                cellIndex = $target.parent().index();
            }
            else if ($target.prop("tagName") == "TH") {
                var $th;
                var location = $target[0].getBoundingClientRect();
                var scrollLeft = navigator.userAgent.indexOf("WebKit") != -1 ? document.body.scrollLeft : document.documentElement.scrollLeft;
                if (this._orgX < location.left + 5 + scrollLeft)
                    cellIndex = $($target).prevAll(":visible:first")[0].cellIndex;
                else
                    cellIndex = $target.index();
            }
            else if ($target.closest("td.e-rowcell").length > 0) {
                var $td = $target.closest('td.e-rowcell');
                cellIndex = $td.index();
            }

            /*get cellIndex with frozen columns*/
            if (cellIndex != -1 && this._frozenColumnsLength > 0 && $target.closest(".e-movablecontentdiv").length > 0)
                cellIndex += this._frozenColumnsLength;
            return cellIndex;
        },


        //GET THE CURRENT ROW INDEX
        getRowIndex: function (e) {

            var proxy = this,
                $target = $(e.target),
                $gridRows = proxy.getRows(),
                index = -1,
                model = this.model;

            if ($target.closest('.e-gridcontainer').length > 0) {
                if (this._frozenColumnsLength > 0) {
                    if ($target.closest(".e-frozencontentdiv").length > 0 || $target.closest(".e-frozencontainer").length > 0)
                        $gridRows = $($gridRows[0]);
                    else if ($target.closest(".e-movablecontentdiv").length > 0 || $target.closest(".e-movablecontainer").length > 0)
                        $gridRows = $($gridRows[1]);
                }
                index = $gridRows.index($target);
                if (index == -1) {

                    var row = $target.closest('tr');
                    index = $gridRows.index(row);

                }
            }

            return index;
        },

        //Cancel the edited cell and row
        _cancelEditState: function (e) {
            var proxy = this;
            if (!ej.isNullOrUndefined(e)) {
                if (!ej.isNullOrUndefined(e.target))
                    e.stopImmediatePropagation();
                /*Change scrollLeft of content while header is auto scrolled on filtering element focus*/
                var scrollLeft = proxy.getScrollElement().ejScroller("option", "scrollLeft")
                headerScrollLeft = 0;
                if (this._frozenColumnsLength > 0)
                    headerScrollLeft = proxy._$gridHeaderContainer.find("#e-movableheader" + this._id).scrollLeft();
                else
                    headerScrollLeft = proxy._$gridHeaderContainer.scrollLeft();
                if (scrollLeft != headerScrollLeft) {
                    proxy.getScrollElement().ejScroller("option", "scrollLeft", headerScrollLeft);
                    if (proxy.model.showTotalSummary && proxy._$footerContainer) {
                        if (this._frozenColumnsLength > 0)
                            proxy._$footerContainer.find("#e-movablefooter" + this._id).scrollLeft(headerScrollLeft);
                        else
                            proxy._$footerContainer.scrollLeft(headerScrollLeft);
                    }
                }
            }
            if (proxy.model.isEdit)
                proxy.cancelEditCell();
            else if (proxy._isRowEdit)
                proxy.cancelRowEditCell();
        },

        //cancel the editMode of the cell
        cancelEditCell: function (e) {

            var proxy = this,
                model = proxy.model,
                tr,
                data = proxy.model.selectedItem,
                cell, cellIndex = proxy._cellEditingDetails.columnIndex,
                args = {}, column = model.columns[cellIndex];
            if (model.isFromGantt && !model.isEdit)
                return true;
            args = {
                columnName: column.field,
                value: proxy.getCurrentEditCellData(),
                data: proxy._cellEditingDetails.data,
                previousValue: proxy._cellEditingDetails.cellValue,
                columnObject: column,                
            };
            if (this._frozenColumnsLength > 0) {
                if (this._frozenColumnsLength <= proxy._cellEditingDetails.columnIndex) {
                    cellIndex = proxy._cellEditingDetails.columnIndex - this._frozenColumnsLength;
                    tr = $(proxy.getRows()[1])[proxy._cellEditingDetails.rowIndex];
                    if ($(tr).hasClass("e-editedrow"))
                        $(tr).removeClass("e-editedrow");
                    cell = tr.cells[cellIndex];
                    $(cell).removeClass("e-editedcell").empty().html(
                       $($.render[proxy._id + "_Template"](args.data))[0].cells[cellIndex].innerHTML
                    );
                } else {
                    tr = $(proxy.getRows()[0])[proxy._cellEditingDetails.rowIndex];
                    if ($(tr).hasClass("e-editedrow"))
                        $(tr).removeClass("e-editedrow");
                    cell = tr.cells[cellIndex];
                    $(cell).removeClass("e-editedcell").empty().html(
                      $($.render[proxy._id + "_JSONFrozenTemplate"](args.data))[0].cells[cellIndex].innerHTML
                    );
                }
            } else {
                tr = $(proxy.getRows())[proxy._cellEditingDetails.rowIndex];
                if ($(tr).hasClass("e-editedrow"))
                    $(tr).removeClass("e-editedrow");
                cell = tr.cells[cellIndex];
                $(cell).removeClass("e-editedcell").empty().html(
                    $($.render[proxy._id + "_Template"](args.data))[0].cells[cellIndex].innerHTML
                );
            }
            proxy._cellEventTrigger($(cell)[0], args.data, args.columnObject);
            proxy.model.isEdit = false;
            proxy._cancelSaveTools();
            proxy._trigger("refresh");
        },

        // To destroy the edit forms and popup menu
        _destroyWidgetElements:function()
        {
            var proxy = this, model = this.model, column = model.columns, columnLength = column.length
            for (i = 0; i < columnLength; i++) {
                var $element = $("#" + proxy._id + column[i].field);
                $element.data("ejWidgets") && $element[$element.data("ejWidgets")[0]]("destroy");
            }
        },

        //Cancel row edit.
        cancelRowEditCell: function () {

            var proxy = this, model = this.model,
            //  To delete the empty added row when allowDeleting is false.
            temp = model.editSettings.allowDeleting,
            form = $(document.getElementById(proxy._id + "EditForm")), $tr,
            frozenForm = $("#" + proxy._id + "EditFrozenForm"), $frozenTr;
            if (form.length > 0)
                this._destroyWidgetElements();
            $tr = $(form.closest("tr"));
            $frozenTr = frozenForm.closest("tr");

            rowIndex = proxy.getIndexByRow($tr);
            data = model.currentViewData[rowIndex];
            if (rowIndex == -1 && form.length == 0)
                return;
            
            if ($tr.hasClass('e-addedrow')) {
                if (!proxy.model.editSettings.allowDeleting)
                    proxy.model.editSettings.allowDeleting = true;
            }
            
            //Cancel the edited row.
            if ($tr.hasClass('e-editedrow')) {
                $tr.removeClass("e-editedrow").empty().html(
                    $($.render[proxy._id + "_Template"](data))[0].innerHTML);
                if ($frozenTr.length > 0) {
                    $frozenTr.removeClass("e-editedrow").empty().html(
                        $($.render[proxy._id + "_JSONFrozenTemplate"](data))[0].innerHTML);
                }
            }
            else if ($tr.hasClass('e-rowedit')) {
                $tr.removeClass("e-rowedit").empty().html(
                    $($.render[proxy._id + "_Template"](data))[0].innerHTML);
                if ($frozenTr.length > 0) {
                    $frozenTr.removeClass("e-rowedit").empty().html(
                        $($.render[proxy._id + "_JSONFrozenTemplate"](data))[0].innerHTML);
                }
            }               
            //Cancel the newly added row.
            else if ($tr.hasClass('e-addedrow')) {
                proxy._isRefreshAddedRecord = false;
                proxy._isEmptyRow = true;
                proxy.deleteRow();
                proxy._isEmptyRow = false;
            }           
            model.isEdit = proxy._isRowEdit = false;
            model.editSettings.allowDeleting = temp;
            proxy._cancelSaveTools();
            proxy._trigger("refresh");
        },

        //RERENDERED THE EDITED RECORD
        refreshRow: function (index) {
            var proxy = this,
                model = proxy.model,
                data = model.updatedRecords[index], eventArgs = {},
                editIndex = proxy.getIndexByRow($("#" + proxy._id + "EditForm").closest("tr"))
            if (model.enableVirtualization)
            {
                index = model.currentViewData.indexOf(data);
            }
            if (data && index > -1) {
                ej.TreeGrid.refreshRow(this, index);

                //var currentRefreshingRow = $(proxy.getRows()[index]);

                //if (model.showDetailsRow && model.detailsTemplate && data.isDetailsExpanded) {
                //    var detailsRow = currentRefreshingRow.next("tr");
                //    if (detailsRow.hasClass("e-detailsrow"))
                //        detailsRow.remove();
                //}
                //currentRefreshingRow.replaceWith($($.render[proxy._id + "_Template"](data)));
                //proxy.setGridRows($(proxy.getContentTable().get(0).rows));

                //eventArgs.rowElement = $(proxy.getRows()[index])[0];
                //eventArgs.data = data;
                //proxy._trigger("refresh");
                //proxy._refreshedCellEventTrigger(eventArgs);

                // Check whether the edited index and refreshed index are same
                // If it is same either rowEdit or cellEdit is enable in particular row.
                // So update the _isRowEdit and isEdit value is false, and also update the toolbar item.s
                if (editIndex == index) {
                    proxy._isRowEdit = proxy.model.isEdit = false;
                    proxy._cancelSaveTools();
                }
            }
        },
        /* refresh the details row while cell editing */
        _refreshDetailsRow: function (index) {
            var proxy = this,
                model = this.model,
                data = proxy.model.currentViewData[index], eventArgs = {},
                gridRows = {};

            if (data) {
                if (this._frozenColumnsLength > 0)
                    gridRows = $(proxy.getRows()[1]);
                else
                    gridRows = $(proxy.getRows());

                var currentRefreshingRow = $(gridRows[index]).next("tr");
                if (currentRefreshingRow.hasClass("e-detailsrow")) {
                    currentRefreshingRow.remove();
                    var detailsRow = $($.render[proxy._id + "_detailRowTemplate"](data));
                    $(gridRows[index]).after(detailsRow);
                    proxy.setGridRows($(proxy.getContentTable().get(0).rows));
                    this._gridRows = this.getContentTable().get(0).rows;
                    if (this._frozenColumnsLength > 0)
                        this._gridRows = [this._gridRows, this.getContentTable().get(1).rows];
                    proxy._trigger("refresh");
                    if (model.detailsDataBound) {
                        this._trigger("detailsDataBound", { detailsElement: detailsRow, data: data });
                    }
                }
            }
        },
        //Trigger rowDataBound and queryCellInfo event when row is refreshed
        _refreshedCellEventTrigger:function(eventArgs)
        {
            var proxy = this, model = this.model;
            if (model.queryCellInfo != null || model.rowDataBound != null || model.detailsDataBound != null) {
                if (model.rowDataBound != null){
                    proxy._trigger("rowDataBound", {
                        rowElement: eventArgs.rowElement,
                        data: eventArgs.data
                    });
                }

                var tdCells = eventArgs.rowElement.cells,
                $tdRowcells = $(eventArgs.rowElement).find(".e-rowcell"),
                cellIndex = 0,
                length = tdCells.length,
                column = null,
                columns = proxy.model.columns;

                if (model.queryCellInfo != null) {

                    for (cellIndex; cellIndex < length; cellIndex++) {
                        if ($(tdCells[cellIndex]).hasClass("e-rowcell")) {
                            column = columns[$tdRowcells.index(tdCells[cellIndex])];
                        }
                        if (column) {
                            proxy._cellEventTrigger(tdCells[cellIndex], eventArgs.data, column);
                        }
                    }
                }
                if (model.detailsDataBound && $(eventArgs.rowElement).next("tr").hasClass("e-detailsrow")) {
                    var detailsRowElement = $(eventArgs.rowElement).next("tr");
                    if (this._frozenColumnsLength > 0)
                        detailsRowElement = $(detailsRowElement[1]);
                    this._trigger("detailsDataBound", { detailsElement: $(eventArgs.rowElement).next("tr"), data: eventArgs.data });
                }
            }
        },

        _refreshGridPager: function () {
            if (this.getPager() != null) {
                var proxy = this,
                    model = proxy.model,
                     pagerModel = this.getPager().ejPager("model"), args = {};
                args.currentPage = this._currentPage();
                if (model.currentViewData.length == 0 && model.updatedRecords.length > 0) {
                    if (pagerModel.totalPages != 1) {
                        proxy.gotoPage(args.currentPage - 1);
                        return;
                    }                   
                }
                args.totalRecordsCount = proxy._gridRecordsCount;          
                this.getPager().ejPager("option", args).ejPager("refreshPager");
                pagerModel = this.getPager().ejPager("model");
                model.pageSettings.totalPages = pagerModel.totalPages;
                model.pageSettings.totalRecordsCount = pagerModel.totalRecordsCount;                

            }
        },
        /* get visible child record count in udpated records */
        _getVisibleChildRecordCount: function (data, count, collection) {
            var proxy = this, model = this.model, childRecords, length;;

            if (data.hasChildRecords) {
                childRecords = data.childRecords;
                length = childRecords.length;
                for (var i = 0; i < length; i++) {
                    if (collection.indexOf(childRecords[i]) !== -1)
                        count++;
                    if (childRecords[i].hasChildRecords) {
                        count = proxy._getVisibleChildRecordCount(childRecords[i], count, collection);
                    }
                }
            }
            else {
                if (collection.indexOf(data) !== -1) {
                    count++;
                }
            }
            return count;
        },
        //Insert templated row in DOM for newly added record
        _renderAddedRow: function (index, data) {
            var proxy = this, model = this.model;
            proxy._updateCurrentViewData();
            if (model.enableVirtualization || model.allowPaging) {
                proxy.updateAltRow();
                var tempArgs = {};
                tempArgs.requestType = ej.TreeGrid.Actions.Refresh;
                proxy.sendDataRenderingRequest(tempArgs);
            }
            else {
                proxy.renderNewAddedRow(index, data);
            }
            proxy.updateHeight();
        },

        //insert new item in DOM 
        renderNewAddedRow:function(index, data)
        {
            var proxy = this, model = this.model, length,
                gridRows = proxy.getRows(),
                addedGridRow = $.render[this._id + "_Template"](data),
                isFrozenColumn = this._frozenColumnsLength > 0,
                addedFrozenRow,
                frozenTableRows;
            if (isFrozenColumn) {
                gridRows = $(proxy.getRows()[1]);
                frozenTableRows = $(proxy.getRows()[0]);
                addedFrozenRow = $.render[this._id + "_JSONFrozenTemplate"](data);
            }


            if (!ej.isNullOrUndefined(gridRows) && gridRows.length > 0) {
                if (gridRows.length == index) {
                    var insertPositionRow = gridRows.eq(index - 1),
                        insertPositionFrRow;
                    if (isFrozenColumn)
                        insertPositionFrRow = frozenTableRows.eq(index - 1);
                    /*check whether the next row is detail row or not */
                    if($(insertPositionRow).next("tr").hasClass("e-detailsrow"))
                    {
                        $(insertPositionRow).next("tr").after(addedGridRow);
                        isFrozenColumn && $(insertPositionFrRow).next("tr").after(addedFrozenRow);
                    }else
                    {
                        $(insertPositionRow).after(addedGridRow);
                        isFrozenColumn && $(insertPositionFrRow).after(addedFrozenRow);
                    }
                } else {
                    gridRows.eq(index).before(addedGridRow);
                    isFrozenColumn && frozenTableRows.eq(index).before(addedFrozenRow);
                }
            } else {
                if (this._frozenColumnsLength > 0)
                    proxy._renderFrozenRecords();
                else {
                    proxy.getContentTable().find('tbody').empty().append(proxy._getEmptyTbody());
                    var temp = document.createElement('div');
                    proxy.getContentTable().find("colgroup").first().replaceWith(proxy._getMetaColGroup());
                    var $tbody = proxy.getContentTable().children('tbody');
                    $tbody.empty();
                    temp.innerHTML = ['<table>', $.render[proxy._id + "_Template"](proxy.model.currentViewData),
                        '</table>'].join("");
                    proxy.getContentTable().get(0).replaceChild(temp.firstChild.firstChild,
                        proxy.getContentTable().get(0).lastChild);
                }
            }
            this._gridRows = this.getContentTable().get(0).rows;
            if (this._frozenColumnsLength > 0)
                this._gridRows = [this._gridRows, this.getContentTable().get(1).rows];

            proxy.setGridRows($(proxy.getContentTable().get(0).rows));
          
        },


        
        onScrollHelper: function (scrolltop) {
            var proxy = this;            
            proxy.getScrollElement().ejScroller("scrollY", scrolltop, true);
            var isHorizontalScroll = proxy.getScrollElement().ejScroller("isHScroll");
            if (!isHorizontalScroll && this.model.isFromGantt)
                proxy.getScrollElement().scrollTop(scrolltop);
        },

        isVScroll: function () {
            if (this.getScrollElement().hasClass("e-scroller")) {
                return this.getScrollElement().ejScroller("isVScroll");
            }
            else
            {
                return false;
            }
        },

        //REFRESH THE SCROLLER FOR TREEGRIDCONTENT
        refreshScroller:function(panSize){
            
            var proxy = this;                       
            proxy._$gridContent.removeClass("e-borderbox");
            
            var scrollTop = proxy.getScrollElement().ejScroller("option", "scrollTop");
            var scrollLeft = proxy.getScrollElement().ejScroller("option", "scrollLeft");

            proxy.getScrollElement().ejScroller("option", { "persist": true });
            proxy.getScrollElement().ejScroller("option", { "width": panSize });
            
            var maxScrollWidth = proxy.getMaxScrollWidth();
            if (scrollLeft > maxScrollWidth)
                scrollLeft = maxScrollWidth > 0 ? maxScrollWidth : 0;

            proxy._$gridContent.css("height", proxy._viewPortHeight);
            proxy.getScrollElement().ejScroller("refresh");
            var isHorizontalScroll = proxy.getScrollElement().ejScroller("isHScroll");

            if (proxy.model.isFromGantt)
                if (!isHorizontalScroll) {
                    proxy._$gridContent.addClass("e-borderbox");
                }
                else {
                    proxy._$gridContent.removeClass("e-borderbox");
                }
            proxy.getScrollElement().ejScroller("option", { "scrollTop": scrollTop });
            proxy.getScrollElement().ejScroller("option", { "scrollLeft": scrollLeft });
            proxy._$gridHeaderContainer.scrollLeft(scrollLeft);

            if (!isHorizontalScroll)
                this.getScrollElement().scrollTop(scrollTop);
            else {
                this.getScrollElement().scrollTop(0)
            }
        },
        getMaxScrollHeight: function () {
            var proxy = this;
            return proxy.getScrollElement().children(".e-content").children().height() - this.getScrollElement().children(".e-content").height();
        },
        getMaxScrollWidth:function()
        {
            var proxy=this;
            return proxy.getScrollElement().children(".e-content").children(".e-gridcontainer").children(".e-table").width() - this.getScrollElement().children(".e-content").width();
        },
        refreshHeight:function(){

            var proxy = this;
            proxy.getScrollElement().ejScroller("refresh");            

        },

		// Get the column using header text
        // argument headerText is column header text value

        getColumnByHeaderText: function (headerText) {
            var proxy = this;
            var length = proxy.model.columns.length;
            var columns = proxy.model.columns;
            for (var column = 0; column < length; column++) {
                if (columns[column]["headerText"] == headerText)
                    break;
            }
            return column == columns.length ? null : columns[column];
        },

        //Hide the column by using header text
        //argument headerText is column header text value
        
        hideColumn: function (headerText) {
            var proxy = this,
                model = proxy.model,
                column = this.getColumnByHeaderText(headerText),
                index = $.inArray(column, model.columns),
                hiddenColumnIndex = $.inArray(headerText, proxy._hiddenColumns);

            /* check this is single column in frozen or movable column*/
            if (column && !proxy._isColumnHidable(column))
                return;
            if (index != -1 && index != model.treeColumnIndex && hiddenColumnIndex == -1) {
                /* Cancel edited cell before sort the column*/
                proxy._cancelEditState();
                proxy._hiddenColumns.push(headerText);
                proxy.model.columns[index].visible = false;
               
				//Table column width not properly set in firefox, so just remove and add the e-table class from both header and content table
                proxy.getHeaderTable().removeClass("e-table");
                proxy.getContentTable().removeClass("e-table");
                var headerColgroup = proxy.getHeaderTable().find('colgroup').find("col");
                $(headerColgroup).eq(index).hide();
                var headerRows = proxy.getHeaderTable().find('thead').find("th.e-headercell");
                $(headerRows).eq(index).addClass("e-hide");
                if (model.allowFiltering) {
                    var headerrows = proxy.getHeaderTable().find('thead').find("th.e-filterbarcell");
                    $(headerrows).eq(index).addClass("e-hide");
                }
                var gridrows = proxy.getContentTable().find("colgroup").find("col"),
                    isFrozenTable = true, cellIndex = index, footerRows;
                $(gridrows).eq(index).hide();
                gridrows = proxy.getRows();
                footerRows = this._getFooterRows();
                //hidding the specified column
                if (this._frozenColumnsLength > 0) {
                    if (index < this._frozenColumnsLength) {
                        gridrows = $(proxy.getRows()[0]);
                        footerRows = $(footerRows[0]);
                        if (proxy._gridRows && $(proxy.getTreeGridRows()[0]).find(".e-detailscellwrapper").parent(".e-detailsrowcell").length > 0) {
                            var tempColSpan = parseInt($(proxy.getTreeGridRows()[0]).find(".e-detailscellwrapper").parent(".e-detailsrowcell").attr("colspan"));
                            $(proxy.getTreeGridRows()[0]).find(".e-detailscellwrapper").parent(".e-detailsrowcell").attr("colspan", tempColSpan - 1);
                        }
                    }
                    else {
                        gridrows = $(proxy.getRows()[1]);
                        footerRows = $(footerRows[1]);
                        isFrozenTable = false;
                        cellIndex = index - this._frozenColumnsLength;
                        if (proxy._gridRows && $(proxy.getTreeGridRows()[1]).find(".e-detailscellwrapper").parent(".e-detailsrowcell").length > 0) {
                            var tempColSpan = parseInt($(proxy.getTreeGridRows()[1]).find(".e-detailscellwrapper").parent(".e-detailsrowcell").attr("colspan"));
                            $(proxy.getTreeGridRows()[1]).find(".e-detailscellwrapper").parent(".e-detailsrowcell").attr("colspan", tempColSpan - 1);
                        }
                    }
                } else {
                    if (proxy._gridRows && $(proxy.getTreeGridRows()).find(".e-detailscellwrapper").parent(".e-detailsrowcell").length > 0) {
                        var tempColSpan = parseInt($(proxy.getTreeGridRows()).find(".e-detailscellwrapper").parent(".e-detailsrowcell").attr("colspan"));
                        $(proxy.getTreeGridRows()).find(".e-detailscellwrapper").parent(".e-detailsrowcell").attr("colspan", tempColSpan - 1);
                    }
                }
                
                gridrows.each(function () {
                    var td = $(this).children("td").eq(cellIndex);
                    $(td).addClass("e-hide");
                    if (model.showSummaryRow && $(td).hasClass('e-summaryrowcell') && isFrozenTable)
                        proxy._updateSummaryRowTitleCell(headerColgroup, td[0].parentElement);
                });
                //Hide the specific column from total summary row.
                if (model.showTotalSummary) {
                    var footerColGroup = proxy._$footertableContent.find("colgroup").find("col");
                    $(footerColGroup).eq(index).hide();
                    footerRows.each(function () {
                        var footerSummarytd = $(this).children("td").eq(cellIndex);
                        $(footerSummarytd).addClass("e-hide");
                        if ($(footerSummarytd).hasClass('e-footersummaryrowcell'))
                            proxy._updateSummaryRowTitleCell(footerColGroup, footerSummarytd[0].parentElement);
                    });
                }
                proxy.getHeaderTable().addClass("e-table");
                proxy.getContentTable().addClass("e-table");
                var gridContent = proxy.getScrollElement();
                if (model.isFromGantt) {
                    var isHorizontalScroll = gridContent.ejScroller("isHScroll");
                    if (!isHorizontalScroll)
                        gridContent.addClass("e-borderbox");
                    else
                        gridContent.removeClass("e-borderbox");
                }
                gridContent.ejScroller("refresh");
                proxy._updateScrollCss();                
                proxy._updateHeaderScrollLeft();
                /* update scrollTop in gantt when treegrid horizontal scroller not exist*/
                if (model.isFromGantt && !gridContent.ejScroller("isHScroll")) {
                    gridContent.scrollTop(gridContent.data("ejScroller").scrollTop());
                }
                index = $.inArray(headerText, proxy._visibleColumns);
                if (index != -1)
                    proxy._visibleColumns.splice(index, 1);
                if (model.showColumnChooser) {
                    proxy._renderColumnChooserList(true, headerText);
                    proxy._updateColumnMenuVisibility();
                }
                proxy._addInitTemplate();
            }
            //Updating the column properties to Gantt's model.columns
            if (model.isFromGantt)
                proxy.updateToGanttColumns();
        },

        //Clear the filter based on fieldName.
        //clearFilter method without argumentment means, it clear the all filter in tree grid.
        clearFilter: function (fieldName) {
            var proxy = this,
                model = proxy.model;
            if (ej.isNullOrUndefined(fieldName)) {
                var filteredColumns = model.filterSettings.filteredColumns,
                    length = filteredColumns && filteredColumns.length;
                //Loop for clearing all the filter in tree grid
                while (filteredColumns && filteredColumns.length > 0) {
                    proxy.clearFilter(filteredColumns[0].field);
                }

            } else {
                var column = proxy.getColumnByField(fieldName),
                    filteredColumn = $.grep(model.filterSettings.filteredColumns, function (filterColumn, index) {
                        return filterColumn.field === fieldName;
                    });
                if (column && filteredColumn.length > 0) {
                    /*Skip the filterColumn method for numeric textbox in immediate filterbar mode.
                      Because while set the empty value to numeric text box, it automatically triiger filterBarHanlder method*/
                    if (!(model.filterBarMode == "immediate" && column.filterEditType == "numericedit")) {
                        proxy._searchString = "";
                        proxy._fieldName = "";
                        proxy.filterColumn(fieldName, "equal", "", "and");
                    }
                    proxy._clearFilterElementValue(column);
                }
            }
        },

        //Get the column details based on the given field in tree grid
        getColumnByField: function (fieldName) {
            var proxy = this,
              model = proxy.model,
              columns = model.columns;
            for (var index = 0; index < columns.length; index++) {
                if (columns[index]["field"] == fieldName)
                    break;
            }
            return index == columns.length ? null : columns[index]; //If field name not available in column collection, it returns null value.
        },

        //Set the empty value to filter input elements
        _clearFilterElementValue: function (column) {
            var proxy = this,
                element = $("#" + proxy._id + "_" + column.field + "_filterbarcell");
            switch (column.filterEditType) {
                case "stringedit":
                    $(element).val("");
                    break;
                case "booleanedit":
                    $(element).prop("checked", false);
                    break;
                case "numericedit":
                    $(element).ejNumericTextbox("instance").option("value", "");
                    break;
                case "dropdownedit":
                    $(element).ejDropDownList("instance").option("value", "");
                    break;
                case "datepicker":
                    $(element).ejDatePicker("instance").option("value", "");
                    break;
                case "datetimepicker":
                    $(element).ejDateTimePicker("instance").option("value", "");
                    break;
            }
        },

        //To maintain the summary row title after hide/show the column using columnChooser.
        _updateSummaryRowTitleCell: function (colgroup, summaryRow) {
            var length = colgroup.length;
            for (var cell = 0; cell < length; cell++) {
                if ($(colgroup[cell]).css('display') == 'none')
                    continue;
                var summaryTitleElement = $(summaryRow).find(".e-summarytitle")[0],
                    currentColumnSummaryTitle = $(summaryRow.childNodes[cell]).find(".e-summarytitle")[0];
                if (currentColumnSummaryTitle)
                    return;
                else
                    $(summaryRow.childNodes[cell]).append(summaryTitleElement);
                return;

            }

        },

        //Show the column by using header text
        // argument headerText is column header text value

        
        showColumn: function (headerText) {
            var proxy = this,
                model = proxy.model,
                column = this.getColumnByHeaderText(headerText),
                index = $.inArray(column, model.columns),
                visibleColumnIndex = $.inArray(headerText, proxy._visibleColumns);
            if (index != -1 && visibleColumnIndex == -1) {
                /* Cancel edited cell before sort the column*/
                proxy._cancelEditState();
                proxy._visibleColumns.push(headerText);
                proxy.model.columns[index].visible = true;
                var headerColgroup = proxy.getHeaderTable().find('colgroup').find("col");
                $(headerColgroup).eq(index).show();
                var headerRows = proxy.getHeaderTable().find('thead').find("th.e-headercell");
                $(headerRows).eq(index).removeClass("e-hide");
                if (model.allowFiltering) {
                    var headerrows = proxy.getHeaderTable().find('thead').find("th.e-filterbarcell");
                    $(headerrows).eq(index).removeClass("e-hide");
                }
                var gridrows = proxy.getContentTable().find("colgroup").find("col"),
                    isFrozenTable = true, cellIndex = index, footerRows;
                $(gridrows).eq(index).show();
                gridrows = proxy.getRows();
                footerRows = this._getFooterRows();

                if (this._frozenColumnsLength > 0) {
                    if (index < this._frozenColumnsLength) {
                        gridrows = $(proxy.getRows()[0]);
                        footerRows = $(footerRows[0]);
                        if (proxy._gridRows && $(proxy.getTreeGridRows()[0]).find(".e-detailscellwrapper").parent(".e-detailsrowcell").length > 0) {
                            var tempColSpan = parseInt($(proxy.getTreeGridRows()[0]).find(".e-detailscellwrapper").parent(".e-detailsrowcell").attr("colspan"));
                            $(proxy.getTreeGridRows()[0]).find(".e-detailscellwrapper").parent(".e-detailsrowcell").attr("colspan", tempColSpan + 1);
                        }
                    }
                    else {
                        gridrows = $(proxy.getRows()[1]);
                        footerRows = $(footerRows[1]);
                        isFrozenTable = false;
                        cellIndex = index - this._frozenColumnsLength;
                        if (proxy._gridRows && $(proxy.getTreeGridRows()[1]).find(".e-detailscellwrapper").parent(".e-detailsrowcell").length > 0) {
                            var tempColSpan = parseInt($(proxy.getTreeGridRows()[1]).find(".e-detailscellwrapper").parent(".e-detailsrowcell").attr("colspan"));
                            $(proxy.getTreeGridRows()[1]).find(".e-detailscellwrapper").parent(".e-detailsrowcell").attr("colspan", tempColSpan + 1);
                        }
                    }
                } else {
                    if (proxy._gridRows && $(proxy.getTreeGridRows()).find(".e-detailscellwrapper").parent(".e-detailsrowcell").length > 0) {
                        var tempColSpan = parseInt($(proxy.getTreeGridRows()).find(".e-detailscellwrapper").parent(".e-detailsrowcell").attr("colspan"));
                        $(proxy.getTreeGridRows()).find(".e-detailscellwrapper").parent(".e-detailsrowcell").attr("colspan", tempColSpan + 1);
                    }
                }


				//Display the specified column
                gridrows.each(function () {
                    var td = $(this).children("td").eq(cellIndex);
                    $(td).removeClass("e-hide");
                    if (model.showSummaryRow && $(td).hasClass('e-summaryrowcell') && isFrozenTable)
                        proxy._updateSummaryRowTitleCell(headerColgroup, td[0].parentElement);
                });
                //Show the specific column from total summary row.
                if (model.showTotalSummary) {
                    var footerColGroup = proxy._$footertableContent.find("colgroup").find("col");
                    $(footerColGroup).eq(index).show();
                    footerRows.each(function () {
                        var footerSummarytd = $(this).children("td").eq(cellIndex);
                        $(footerSummarytd).removeClass("e-hide");
                        if ($(footerSummarytd).hasClass('e-footersummaryrowcell'))
                            proxy._updateSummaryRowTitleCell(footerColGroup, footerSummarytd[0].parentElement);
                    });
                }
                proxy._addInitTemplate();
                var gridContent = proxy.getScrollElement();
                if (model.isFromGantt) {
                    var isHorizontalScroll = gridContent.ejScroller("isHScroll");
                    if (!isHorizontalScroll) {
                        gridContent.addClass("e-borderbox");
                    }
                    else {
                        gridContent.removeClass("e-borderbox");
                    }
                }
                gridContent.ejScroller("refresh");
                proxy._updateScrollCss();
                proxy._updateHeaderScrollLeft();
                /* update scrollTop in gantt when treegrid horizontal scroller not exist*/
                if (model.isFromGantt && !gridContent.ejScroller("isHScroll")) {
                    gridContent.scrollTop(gridContent.data("ejScroller").scrollTop());
                }
                index = $.inArray(headerText, proxy._hiddenColumns);
                if (index != -1)
                    proxy._hiddenColumns.splice(index, 1);
                if (model.showColumnChooser) {
                    proxy._renderColumnChooserList(true, headerText);
                    proxy._updateColumnMenuVisibility();
                }
            }
            //Updating the column properties to Gantt's model.columns
            if (model.isFromGantt)
                proxy.updateToGanttColumns();
        },

        // Get the hidden columns detail in tree grid
        getHiddenColumns: function () {
            var proxy = this,
                model = proxy.model,
                hiddenColumn = proxy._hiddenColumns,
                length = hiddenColumn.length,
                hiddenColumns = [];
            for (var i = 0; i < length; i++)
                hiddenColumns.push(proxy.getColumnByHeaderText(hiddenColumn[i])); //Get the column by using header text
            return hiddenColumns;

        },

        // Get the column details based on the given column index in tree grid
        getColumnByIndex: function (index) {
            var proxy = this,
                model = proxy.model,
                columns = model.columns;
            if (columns.length > index)
                return columns[index];
            return null;
        },

        // Get the visible columns detail in tree grid
        getVisibleColumns: function () {
            var proxy = this,
                model = proxy.model,
                visibleColumn = proxy._visibleColumns,
                length = visibleColumn.length,
                visibleColumns = [];
            for (var i = 0; i < length; i++)
                visibleColumns.push(proxy.getColumnByHeaderText(visibleColumn[i])); //Get the column by using header text
            return visibleColumns;

        },

        //Cancel the edit cell or row based on editing.
        cancelEdit: function () {
            if (this._isRowEdit)
                this.cancelRowEditCell();
            else if (this.model.isEdit)
                this.cancelEditCell();
        },

        //Rerender the tree grid content.
        redraw: function () {
            this.resetModelCollections();
            this._clearColumnMenu();
            this._clearContextMenu();
            this._removeDetailsRow();
            this.element.empty();
            /*Remove all events binded in treegrid*/
            this.element.off();
            var matched = jQuery.uaMatch(navigator.userAgent),
                proxy = this, model = this.model;
            proxy._off($(document), "mouseup", proxy.dragMouseUp);
            proxy._off($(document), "mousedown", proxy._mouseDownHandler);
            if (matched.browser.toLowerCase() == "chrome") {
                proxy._off(proxy.element, "touchstart", ".e-treegridrows, .e-templatecell", proxy.dragRecord);
                $(document.body).unbind("touchmove", function (event) {
                    event.preventDefault();
                });
                $(document.body).unbind("touchmove", $.proxy(proxy.dragToolTip, proxy));
                proxy._off(proxy.element, "touchend", ".e-treegridrows, .e-templatecell", proxy.dragMouseUp);
                proxy._off(proxy.element, "touchleave", ".e-treegridrows, .e-templatecell", proxy.dragMouseUp);
                $(proxy._$bodyContainer).unbind("touchend", $.proxy(proxy.dragMouseUp, proxy));
                $(proxy._$bodyContainer).unbind("touchleave", $.proxy(proxy.dragMouseUp, proxy));
            }
            /*Redraw all elements in treegrid toolbar, header,content and summary*/
            this._init();
        },

        // Public method for removing column menu
		clearColumnMenu:function()
        {
            var proxy=this;
            proxy._clearColumnMenu();
		},

		"export": function (action, serverEvent, multipleExport) {
		    var proxy = this,
                model = proxy.model;
		    var updatedRecords = model.updatedRecords,
               currentViewData = model.currentViewData,
               flatRecords = model.flatRecords,
               parentRecords = model.parentRecords,
               summaryRowRecords = model.summaryRowRecords,
               selectedItem = model.selectedItem,
               selectedItems = model.selectedItems;
		    proxy._contextMenuOperations("Cancel"); // Cancel the edit row or empty newly added row.
            // Delete the below internal items in model for avoid the circular reference while extend the model
		    delete model.updatedRecords;
		    delete model.currentViewData;
		    delete model.flatRecords;
		    delete model.parentRecords;
		    delete model.summaryRowRecords;
		    delete model.selectedItem;
		    delete model.selectedItems;
		    var modelClone = $.extend(true, {}, model);
		    model.updatedRecords = updatedRecords;
		    model.currentViewData = currentViewData;
		    model.flatRecords = flatRecords;
		    model.parentRecords = parentRecords;
		    model.selectedItem = selectedItem;
		    model.selectedItems = selectedItems;
		    model.summaryRowRecords = summaryRowRecords;
		    var columns = modelClone.columns,
                columnLength = columns.length,
                filteredColumns = modelClone.filterSettings.filteredColumns,
                filterColumnLength = filteredColumns.length;
		    for (var i = 0; i < columnLength; i++) {
		        if (modelClone.columns[i].editType != undefined) {
		            switch (columns[i].editType) {
		                case "stringedit":
		                    columns[i].editType = "string";
		                    break;
		                case "numericedit":
		                    columns[i].editType = "numeric";
		                    break;
		                case "dropdownedit":
		                    columns[i].editType = "dropdown";
		                    break;
		                case "booleanedit":
		                    columns[i].editType = "boolean";
		                    break;
		                default:
		                    break;
		            }
		        }
		        if (columns[i].filterEditType != undefined) {
		            switch (columns[i].filterEditType) {
		                case "stringedit":
		                    columns[i].filterEditType = "string";
		                    break;
		                case "numericedit":
		                    columns[i].filterEditType = "numeric";
		                    break;
		                case "dropdownedit":
		                    columns[i].filterEditType = "dropdown";
		                    break;
		                case "booleanedit":
		                    columns[i].filterEditType = "boolean";
		                    break;
		                default:
		                    break;
		            }
		        }
		    }
		    for (var i = 0; i < filterColumnLength; i++) {
		        if (filteredColumns[i].operator == "equal")
		            filteredColumns[i].operator = "equals";
		        else if (modelClone.filterSettings.filteredColumns[i].operator == "notequal")
		            filteredColumns[i].operator = "notequals";
		    }
		    var attr = { action: action, method: 'post', "data-ajax": "false" };
		    $('form#' + proxy._id + 'export').remove();
		    var form = ej.buildTag('form#'+proxy._id+'export', "", null, attr);
            var ignoreOnExport = proxy.ignoreOnExport,
                igonreLength = ignoreOnExport.length;
		    if (this.ignoreOnExport) {
		        for (var i = 0; i < igonreLength; i++) {
		            delete modelClone[ignoreOnExport[i]];
		        }
		    }
		    if (ej.raiseWebFormsServerEvents) {
		        var args = { model: modelClone, originalEventType: serverEvent };
		        var clientArgs = { model: JSON.stringify(modelClone) };
		        ej.raiseWebFormsServerEvents(serverEvent, args, clientArgs);
		    }
		    else {
		        var treegridObjectArray = {};
		        if (multipleExport) {
		            $('body').find('.e-treegrid').each(function (index, object) {
		                var gridObject = $(object).data('ejTreeGrid');
		                if (!ej.isNullOrUndefined(gridObject)) {
		                    var gridmodel = gridObject.model;
		                    updatedRecords = gridmodel.updatedRecords;
		                    flatRecords = gridmodel.flatRecords;
		                    currentViewData = gridmodel.currentViewData;
		                    parentRecords = gridmodel.parentRecords;
		                    summaryRowRecords = gridmodel.summaryRowRecords;
		                    selectedItem = gridmodel.selectedItem;
		                    // Delete the below internal items in model for avoid the circular reference while extend the model
		                    delete gridmodel.updatedRecords;
		                    delete gridmodel.flatRecords;
		                    delete gridmodel.currentViewData;
		                    delete gridmodel.parentRecords;
		                    delete gridmodel.summaryRowRecords;
		                    delete gridmodel.selectedItem;
		                    var modelClone = JSON.parse(JSON.stringify(gridmodel));
		                    gridmodel.updatedRecords = updatedRecords;
		                    gridmodel.flatRecords = flatRecords;
		                    gridmodel.currentViewData = currentViewData;
		                    gridmodel.parentRecords = parentRecords;
		                    gridmodel.summaryRowRecords = summaryRowRecords;
		                    gridmodel.selectedItem = selectedItem;

		                    columns = modelClone.columns;
		                    columnLength = columns.length;
		                    filteredColumns = modelClone.filterSettings.filteredColumns,
                            filterColumnLength = filteredColumns.length;
                            for (var i = 0; i < columnLength; i++) {
		                        if (columns[i].editType != undefined) {
		                            switch (columns[i].editType) {
		                                case "stringedit":
		                                    columns[i].editType = "string";
		                                    break;
		                                case "numericedit":
		                                    columns[i].editType = "numeric";
		                                    break;
		                                case "dropdownedit":
		                                    columns[i].editType = "dropdown";
		                                    break;
		                                case "booleanedit":
		                                    columns[i].editType = "boolean";
		                                    break;
		                                default:
		                                    break;
		                            }
		                        }
		                        if (columns[i].filterEditType != undefined) {
		                            switch (columns[i].filterEditType) {
		                                case "stringedit":
		                                    columns[i].filterEditType = "string";
		                                    break;
		                                case "numericedit":
		                                    columns[i].filterEditType = "numeric";
		                                    break;
		                                case "dropdownedit":
		                                    columns[i].filterEditType = "dropdown";
		                                    break;
		                                case "booleanedit":
		                                    columns[i].filterEditType = "boolean";
		                                    break;
		                                default:
		                                    break;
		                            }
		                        }
		                    }
                            for (var i = 0; i < filterColumnLength; i++) {
		                        if (filteredColumns[i].operator == "equal")
		                            filteredColumns[i].operator = "equals";
		                        else if (filteredColumns[i].operator == "notequal")
		                            filteredColumns[i].operator = "notequals";
                            }
		                    if (ignoreOnExport) {
		                        for (var i = 0; i < igonreLength; i++) {
		                            delete modelClone[ignoreOnExport[i]];
		                        }
		                        treegridObjectArray[index] = JSON.stringify(modelClone);
		                        var inputAttr = { name: 'TreeGridModel', type: 'hidden', value: JSON.stringify(modelClone) }
		                        var input = ej.buildTag('input', "", null, inputAttr);
		                        form.append(input);
		                    }
		                }
		            });
		        }
		        else {
		            var inputAttr = { name: 'TreeGridModel', type: 'hidden', value: JSON.stringify(modelClone) }
		            var input = ej.buildTag('input', "", null, inputAttr);
		            form.append(input);
		            form.append(this);
		        }
		        $('body').append(form);
		        form.submit();
		    }
		    return true;
		},
        //#endregion

        //#region PRIVATE METHODS

		_getNonContentHeight: function(){
		    var proxy = this, model = proxy.model,
                height = 0, borderTopWidth = 0;
		    borderTopWidth = proxy.model.isFromGantt ? 0 : 1;
		    height = proxy._$gridHeaderContent.height() + parseFloat(borderTopWidth) +
                parseFloat(proxy._$gridHeaderContent.css("border-bottom-width"));
		    if (proxy.model.toolbarSettings.showToolbar) {
		        height += $("#" + proxy._id + "_toolbarItems").outerHeight();
		    }
		    if (model.allowPaging)
		        height += proxy.element.find('.e-pager').outerHeight();		    	    

		    if (!proxy.model.isFromGantt)
		        height += 1;//in gantt gridcontent does't contain border-width but have in treeGrid
		    return height;
                
		},
        //CALCULATE THE VIEWPORTHEIGHT
		_getViewPortHeight: function () {		    
		    return (this.element.height() - this._getNonContentHeight());
        },

        updateViewPortHeight: function () {
            var proxy = this;
            proxy._viewPortHeight = proxy._getViewPortHeight();
        },

        _updateScrollCss: function () {
            var proxy = this,
                model = proxy.model;
            if (!model.isFromGantt) {
                var isVscroll = proxy.isVScroll(),
                    isPaddingExist = proxy._$gridHeaderContent.hasClass("e-scrollcss");
                var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
                if (isSafari)
                    proxy._$gridHeaderContent.removeClass("e-gridheader");
                if (isVscroll) {
                    proxy._$gridHeaderContent.addClass("e-scrollcss");
                    if (model.showTotalSummary && proxy._$totalSummaryRowContainer && proxy._$totalSummaryRowContainer.height() < 90) {
                        proxy._$totalSummaryRowContainer.addClass("e-scrollcss");
                        proxy._$totalSummaryRowContainer.width(proxy._$gridContent.width() - 17);
                    }
                } else {
                    proxy._$gridHeaderContent.removeClass("e-scrollcss");
                    if (model.showTotalSummary && proxy._$totalSummaryRowContainer && proxy._$totalSummaryRowContainer.height() < 90) {
                        proxy._$totalSummaryRowContainer.removeClass("e-scrollcss");
                        proxy._$totalSummaryRowContainer.width(proxy._$gridContent.width());
                    }
                }

                //update frozenContainer height
                if (this._frozenColumnsLength) {
                    var movableContainerHeight = this.getContent().find("#e-movablecontent" + proxy._id).height();
                    if (movableContainerHeight != this.getContent().find("#e-frozencontainer" + proxy._id).height()) {
                        this.getContent().find("#e-frozencontainer" + proxy._id).height(movableContainerHeight);
                    }
                }
                // Tree grid header not properly aligned in safari browser.
                // Because dynamically add or remove any css class it not affected immediately in safari browser
                // So just refresh the tree grid header
                if (isSafari) {
                    proxy._$gridHeaderContent.width(proxy._gridWidth);
                    proxy._$gridHeaderContent.addClass("e-gridheader");
                }
                proxy._resizeFilteringElements();
            }
        },

        _updatePagerIndex: function(){
            var proxy = this,
                model = proxy.model,
                expandedRecords = [], endIndex = -1, startIndex = -1,
                updatedRecords = model.updatedRecords;
            if (model.allowPaging) {
                var pageSize = model.pageSettings.pageSize;

                if (model.pageSettings.pageSizeMode === ej.TreeGrid.PageSizeMode.Root) {
                    var rootParentRecords = model.parentRecords.slice(),
                        index = -1, rootEndIndex = -1, rootStartIndex = -1;
                    proxy._gridRecordsCount = rootParentRecords.length;
                    rootEndIndex = this._currentPage() * pageSize;
                    rootStartIndex = (this._currentPage() * pageSize) - pageSize;
                    //currentPage is greater than totalPage
                    if ((this._currentPage() * pageSize) >= this._gridRecordsCount) {
                        rootEndIndex = this._gridRecordsCount - 1;
                        endIndex = updatedRecords.length;
                    }
                    else
                        endIndex = updatedRecords.indexOf(rootParentRecords[rootEndIndex]);
                    
                    if (rootStartIndex > rootEndIndex)
                        rootStartIndex = rootEndIndex - pageSize;
                    startIndex = updatedRecords.indexOf(rootParentRecords[rootStartIndex]);
                    //if (proxy._summaryRowsCount > 0) {
                    //    var currentViewParentRecords = proxy._getParentRecords(rootParentRecords.slice(rootStartIndex, rootEndIndex), proxy);
                    //    endIndex += currentViewParentRecords.length;
                    //}
                    proxy._updatedPageData = this.getExpandedRecords(updatedRecords.slice(startIndex, endIndex));
                }
                else {
                    expandedRecords = this.getExpandedRecords(updatedRecords);
                    if (model.enableVirtualization) {
                        proxy._gridRecordsCount = updatedRecords.length;                        
                    }
                    else {                        
                        proxy._gridRecordsCount = expandedRecords.length;                        
                    }
                    endIndex = ((proxy._currentPage() * pageSize) > proxy._gridRecordsCount) ? (proxy._gridRecordsCount) : (proxy._currentPage() * pageSize),
                    startIndex = (proxy._currentPage() * pageSize) - pageSize;
                    if (startIndex > endIndex)
                        startIndex = endIndex-pageSize
                    proxy._updatedPageData = expandedRecords.slice(startIndex, endIndex);
                }                
                //if (!ej.isNullOrUndefined(this.getPager())) {
                //    if (model.currentViewData.length == 0) {
                //        var currentPage = proxy._currentPage() != 1 ? proxy._currentPage() - 1 : 1;
                //        this.getPager().ejPager("model.currentPage", currentPage);
                //    }
                //}
            }
        },

        //UPDATE CURRENT VIEWPORT DATA FROM FLATRECORDS/UPDATED RECORDS
        _updateCurrentViewData: function () {

            var proxy = this,
                model = proxy.model,
                args = {},
                tMargin,
                isRangeModified = false;

            //CHECK VIRTUALIZATION IS ENABLED OR NOT 
            if (model.enableVirtualization) {

                
                
                if (model.allowPaging) {
                    proxy._updatePagerIndex();
                    proxy.getVisibleRange();
                    if (model.sizeSettings.height)
                        model.currentViewData = proxy._updatedPageData.slice(proxy._visibleRange.top,
                        proxy._visibleRange.bottom);
                    else
                        model.currentViewData = proxy._updatedPageData;                    
                }

                else {
                    proxy.getVisibleRange();
                    model.currentViewData = proxy.model.updatedRecords.slice(proxy._visibleRange.top,
                    proxy._visibleRange.bottom);
                }



                if (proxy._vScrollDist !== 0) {

                    tMargin = proxy._scrollTop - proxy._offset;

                    

                    if ((proxy._prevRTop - proxy._visibleRange.top !== 0) ||
                        (proxy._prevRBottom - proxy._visibleRange.bottom !== 0)) {

                        args.requestType = ej.TreeGrid.Actions.Refresh;
                        proxy.sendDataRenderingRequest(args);
                        isRangeModified = true;

                    }
                    if (this._frozenColumnsLength > 0) {
                        proxy._$frozenTableContent.css({
                            "top": tMargin
                        });
                        proxy._$movableTableContent.css({
                            "top": tMargin
                        });
                    } else {
                        proxy._$tableContent.css({
                            "top": tMargin
                        });
                    }

                    proxy._prevRTop = proxy._visibleRange.top;
                    proxy._prevRBottom = proxy._visibleRange.bottom;

                }

            } else {
                if (model.allowPaging) {
                    proxy._updatePagerIndex();
                    model.currentViewData = proxy._updatedPageData;                    
                }
                else
                    model.currentViewData = proxy.model.updatedRecords.slice();
            }
            

            if (proxy._isEnterKeyPressed) {

                proxy._isEnterKeyPressed = false;
                if (model.allowSelection && model.editSettings.allowEditing) {

                    if (!isRangeModified) proxy._cellEditingDetails.rowIndex += 1;

                    if (!proxy._rowSelectingEventTrigger(this.selectedRowIndex(), proxy._cellEditingDetails.rowIndex)) {

                        proxy.selectRows(proxy._cellEditingDetails.rowIndex);
                        proxy._rowSelectedEventTrigger(proxy._cellEditingDetails.rowIndex);

                    }

                    proxy.cellEdit(proxy._cellEditingDetails.rowIndex, proxy.model.columns[proxy._cellEditingDetails.columnIndex].field);

                }
            }
        },


        //GET THE TABLE ROW POSITION
        _getRowPosition: function (y) {
            return Math.ceil((y) / (this.model.rowHeight + this._detailsRowHeight));
        },


        //GET THE COLUMNGROUP FOR HEADER TABLE
        _getMetaColGroup: function () {

            var $colgroup = this.getHeaderTable().find('colgroup').clone();
            return $colgroup;

        },


        //CREATE EMPTY ROW WHILE DATASOURCE OBJECT AS NULL
        _getEmptyTbody: function () {

            var proxy = this,
                $emptyTd = ej.buildTag('td', proxy.model.emptyRecordText, {}, { colSpan: proxy.model.columns.length });
            return $(document.createElement("tr")).append($emptyTd);

        },


        //ADD SORTICON TO THE COLUMN HEADER
        _addSortElementToColumn: function (field, direction) {

            var proxy = this, model = this.model,
                column = ej.TreeGrid.getColumnByField(proxy.model.columns, field),
                index = $.inArray(column, proxy.model.columns);

            var $headerCellDiv = proxy.getHeaderTable().find("thead").
                find(".e-headercell").eq(index).find(".e-headercelldiv");
            $headerCellDiv.find(".e-ascending,.e-descending").remove();
            $headerCellDiv.append(proxy._createSortElement().addClass("e-" + direction).addClass("e-icon"));
            $headerCellDiv.parent().attr("aria-sort", direction);
        },


        //CREATE SORT ELEMENT        
        _createSortElement: function () {
            return ej.buildTag('span', "&nbsp;");
        },


        //RENDERED EDITED CELL
        _renderCellEditObject: function (cellEditArgs, $td) {

            var proxy = this,
                $form = ej.buildTag("form.#" + proxy._id + "EditForm", "", {}, {}),
                $cellEditTemplate = proxy._cellEditTemplate,
                $element,
                htmlString,
                cellData = {},
                cellValue,
                columnObject = cellEditArgs.columnObject;

            cellValue = cellEditArgs.value;
            if (columnObject.editType == "dropdownedit" && cellValue == false)
                cellValue = cellValue.toString();
            cellData[columnObject.field] = cellValue,
            columnIndex = proxy.getColumnIndexByField(columnObject.field);

            if (columnIndex===proxy.model.treeColumnIndex) {
                $td.find('.e-cell').empty();
            } else $td.empty();

            htmlString = $cellEditTemplate.find("#" + columnObject.field + "_CellEdit").html();
            if (columnObject.field === "predecessor")
                $element = $($.templates(htmlString).render(cellEditArgs.data));
            else
                 $element = $($.templates(htmlString).render(cellData));

            if ($element.get(0).tagName == "SELECT") {

                $element.val(cellData[columnObject.field]);
                $element.val() == null && $element.val($element.find("option").first().val());

            }

            $form.append($element);

           if (columnIndex===proxy.model.treeColumnIndex) {
                $td.find('.e-cell').append($form);
            } else $td.append($form);

            proxy._setoffsetWidth();
            proxy._refreshEditForm();

            if ($.isFunction($.validator) && !$.isEmptyObject(cellEditArgs.validationRules)) {

                proxy._initValidator();
                proxy.setValidationToField(columnObject.field, cellEditArgs.validationRules);

            }
            proxy.model.isEdit = true;

        },


        //SET WIDTH FOR EDITING ELEMENTS
        _setoffsetWidth: function () {

            var proxy = this,
                model = proxy.model,
                tds, $form = $("#" + proxy._id + "EditForm"), $frozenForm = $("#" + proxy._id + "EditFrozenForm"),
                i = 0,
                rowIndex = proxy._cellEditingDetails.rowIndex,
                length, child;

            if (model.editSettings.editMode.toLowerCase() == "cellediting" && !proxy._isRowEdit) {
                tds = $form.closest("td");
            } else {
                tds = $frozenForm.add($form).find("tr").find(".e-rowcell");
            }

            length = tds.length;

            for (i; i < length; i++) {

                child = $(tds.children()[0]).children();

                if (child.length > 1) {
                    if (model.currentViewData[rowIndex].level == 0 && model.currentViewData[rowIndex].hasChildRecords)
                        proxy._tdsOffsetWidth[i] = tds.get(i).offsetWidth - child[0].offsetWidth - child[2].offsetWidth;
                    else
                        proxy._tdsOffsetWidth[i] = tds.get(i).offsetWidth - child[0].offsetWidth - child[1].offsetWidth;
                } else {
                    proxy._tdsOffsetWidth[i] = tds.get(i).offsetWidth;
                }
            }

        },


        //get Index of resourceInfo
        getIndexofresourceInfo: function (dataSource) {

            var proxy = this,
                data = proxy._cellEditingDetails.data,
                resourceInfo = data.resourceInfo,
                count = 0,
                length = resourceInfo && resourceInfo.length,
                resourceIndex = [];

            for (count; count < length; count++)
                resourceIndex.push(dataSource.indexOf(resourceInfo[count]));

            return resourceIndex;

        },

        //REFRESH THE EDITED FORM
        _refreshEditForm: function () {

            var proxy = this,
                $form = $("#" + proxy._id + "EditForm"),
                $frozenForm = $("#" + proxy._id + "EditFrozenForm"),
                elementFocused = false,
                $formElement = $frozenForm.add($form).find("input,select"),
                percent = 86,
                i = 0,
                length = $formElement.length,
                $element, inputWidth,
                model = proxy.model,
                width,
                params = {},
                value,
                column,
                customParams,
                toformat,
                formatVal,
                rowHeight = proxy.model.rowHeight,
                cellEditType;

            for (i; i < length; i++) {

                $element = $formElement.eq(i);

                if (model.editSettings.editMode.toLowerCase() == "cellediting")
                    percent = 96.5;
                if (proxy._isRowEdit && $element.attr("type") != "checkbox")
                    inputWidth = "100%";
                else
                    inputWidth = proxy._tdsOffsetWidth[i] * (percent / 100);

                cellEditType = $element.attr("edittype");
                column = ej.TreeGrid.getColumnByField(model.columns, $element.prop("name"));

                switch (cellEditType) {

                    case ej.TreeGrid.EditingType.Numeric:
                        params = {};
                        width = inputWidth;
                        value = $element.val();
                        params.width = width;
                        params.locale = model.locale;
                        params.height = rowHeight - 5;
                        params.showSpinButton = true;
                        params.cssClass = model.cssClass;
                  
                        if (value.length)
                           {
                                  params.value = parseFloat(value);
                           }

                        if (model.isFromGantt && (column.field === "duration" || column.field === "status"))
                        {
                            params.minValue = 0;
                            if (column.field == "status")
                                params.maxValue = 100;
                        }

                        if (!ej.isNullOrUndefined(column["editParams"]))
                            $.extend(params, column["editParams"]);

                        $element.ejNumericTextbox(params);
                        $element.prop("name", $element.prop("name").replace(proxy._id, ""));
                        break;

                    case ej.TreeGrid.EditingType.DatePicker:
                        params = {};
                        params.width = inputWidth;
                        params.height = rowHeight - 5;
                        params.locale = model.locale;
                        params.cssClass = model.cssClass;
                        params.dateFormat = model.dateFormat;
                        params.enableStrictMode = true;
                        params.change = function (args) {
                            this.option("value", args.value)
                        };
                        if ($element.val().length) params.value = proxy.getDateFromFormat($element.val());

                        if (column["format"] !== undefined && column.format.length > 0) {

                            toformat = new RegExp("\\{0(:([^\\}]+))?\\}", "gm");
                            formatVal = toformat.exec(column.format);
                            params.dateFormat = formatVal[2];
                            if ($element.val().length) {
                                params.value = ej.format(new Date($element.val()), params.dateFormat);
                                $element.val(params.value);
                            }
                        }

                        if (!ej.isNullOrUndefined(column["editParams"]))
                            $.extend(params, column["editParams"]);

                        if (model.dateFormat.toLowerCase().indexOf("hh") == -1)
                            $element.ejDatePicker(params);
                        else {
                            $element.ejDateTimePicker(params);
                        }
                        break;
                    case ej.TreeGrid.EditingType.DateTimePicker:
                        params = {};
                        params.width = inputWidth;
                        params.height = rowHeight - 5;
                        params.locale = model.locale;
                        params.cssClass = model.cssClass;
                        params.displayDefaultDate = true;
                        params.dateTimeFormat = model.dateFormat;
                        params.enableStrictMode = true;                       
                        params.change = function (args) {
                            this.option("value", args.value)
                        };
                        if ($element.val().length) params.value = proxy.getDateFromFormat($element.val());

                        if (column["format"] !== undefined && column.format.length > 0) {

                            toformat = new RegExp("\\{0(:([^\\}]+))?\\}", "gm");
                            formatVal = toformat.exec(column.format);
                            params.dateTimeFormat = formatVal[2];
                            params.value = ej.format(new Date($element.val()), params.dateTimeFormat);
                            $element.val(params.value);
                        }

                        if (!ej.isNullOrUndefined(column["editParams"]))
                            $.extend(params, column["editParams"]);

                            $element.ejDateTimePicker(params);
                        break;
                    case ej.TreeGrid.EditingType.Dropdown:

                        var dataSource, fieldName;

                        if (proxy._isRowEdit)
                        {
                            dataSource = column.dropdownData;
                            fieldName = column.field;
                        }
                        else{
                            dataSource = column.dropdownData;
                            fieldName = column.field;
                        }

                        if(model.isFromGantt && fieldName === "resourceInfo"){
                            $element.ejDropDownList({
                                width: inputWidth + "px",
                                height: rowHeight - 5,
                                showCheckbox: true,
                                dataSource: dataSource,
                                fields: {
                                    id: model.resourceIdMapping,
                                    text: model.resourceNameMapping,
                                    value: model.resourceNameMapping
                                },
                                selectedItems: proxy.getIndexofresourceInfo(dataSource)
                            });
                        
                        } else {
                            var controlArgs = {};
                            controlArgs.cssClass = model.cssClass;
                            controlArgs.width = inputWidth;
                            controlArgs.height = rowHeight - 5;
                            controlArgs.dataSource = dataSource;
                            if (!ej.isNullOrUndefined(column["editParams"]))
                                $.extend(controlArgs, column["editParams"]);

                            $element.ejDropDownList(controlArgs);

                            var obj = $element.ejDropDownList("instance");
                            obj._setValue($element.attr("cellValue"));
                           
                        }
                        break;

                    case ej.TreeGrid.EditingType.String:
                        $element.outerWidth(inputWidth).height(model.rowHeight - 9);
                        break;
                    case ej.TreeGrid.EditingType.Boolean:
                        var controlArgs = {};
                        controlArgs.cssClass = model.cssClass;
                        controlArgs.size = "small";

                        if (!ej.isNullOrUndefined(column["editParams"]))
                            $.extend(controlArgs, column["editParams"]);

                        $element.ejCheckBox(controlArgs);
                        ////center align of check box control
                        var parentElement = $element.parent(".e-chkbox-wrap"),
                            formElement = parentElement.parent("form");

                        if (formElement.length > 0)
                            formElement.css("margin-left", "45%");
                        else
                            parentElement.css("margin-left", "45%");
                       
                        break;
                   
                    case ej.TreeGrid.EditingType.Maskedit:
                        var controlArgs = {};
                        controlArgs.locale = model.locale;
                        controlArgs.cssClass = model.cssClass;
                        controlArgs.width = inputWidth;
                        controlArgs.height = rowHeight - 5;
                        if (!ej.isNullOrUndefined(column["editParams"]))
                            $.extend(controlArgs, column["editParams"]);

                        $element.ejMaskEdit(controlArgs);
                        break;
                }

                if (!$element.is(":disabled") && !elementFocused &&
                   (!$element.is(":hidden") || typeof ($element.data("ejDropDownList") || $element.data("ejNumericTextbox") ||
                   $element.data("ejDatePicker") || $element.data("ejCheckBox")) == "object")) {

                    if (!proxy._isEnterKeyPressed) {

                        proxy._focusElements($element.closest('td'));
                        elementFocused = true;

                    }
                }
            }
        },


        //INITIALIZE THE VALIDATOR
        _initValidator: function() {

            var proxy = this;

            $("#" + proxy._id + "EditForm").validate({
                onclick: false,
                onfocusout: false,
                errorClass: 'e-field-validation-error',
                errorElement: 'div',
                wrapper: "div",

                errorPlacement: function(error, element) {
                    var $td = element.closest("td"),
                        $container = $(error).addClass("e-error"),
                        $tail = ej.buildTag("div.e-errortail e-toparrow");

                    $td.find(".e-error").remove();
                    element.hasClass("e-numerictextbox") ? $container.insertAfter(element.closest(".e-numeric")) :
                                                          $container.insertAfter(element);
                    $container.prepend($tail);
                    proxy.model.editSettings.editMode != "normal" && $container.offset({
                        left: element.offset().left
                    });

                    $container.fadeIn("slow");
                }
            });
        },


        //SET FOCUS TO EDITED ELEMENT
        _focusElements: function ($currentCell) {
            var proxy = this;

            if ($currentCell.length) {

                $currentCell.focus();
                var $childElem = $currentCell.children();

                if ($childElem[0]) {

                    if ($childElem[0].tagName.toLowerCase() == "select" || 
                        $childElem[0].tagName.toLowerCase() == "input") {

                        $childElem.focus().select();
                        $childElem[0].focus();

                    } else if ($childElem.find(".e-field.e-dropdownlist").length) {

                        $childElem.find(".e-ddl").focus();

                    } else if ($childElem.find(".e-chkbox-wrap.e-widget").length) {

                        $childElem.find(".e-chkbox-wrap.e-widget").focus();

                    }
                    else {

                        $childElem.find('input,select').select().focus();
                    }
                }
            }

            var contentScrollLeft = proxy.getScrollElement().children('.e-content').scrollLeft(),
                scrollLeft = proxy.getScrollElement().ejScroller("option", "scrollLeft");
            if (proxy.getScrollElement().hasClass("e-scroller") && contentScrollLeft != scrollLeft) {
                proxy.getScrollElement().ejScroller("option", "scrollLeft", contentScrollLeft);
            }
            proxy._updateHeaderScrollLeft(proxy.getScrollElement().children('.e-content').scrollLeft());
        },
        //Set the focus for edit row elements
        _focusElementsForRowEdit: function ($currentCell) {
            if ($currentCell.length) {
                var $childElem = $currentCell.children();
                if ($childElem[0].tagName.toLowerCase() == "select" || $childElem[0].tagName.toLowerCase() == "input") {
                    $childElem.focus().select();
                    $childElem[0].focus();
                }
                else if ($childElem.find(".e-field.e-dropdownlist").length)
                    $childElem[0].focus();
                else
                    $childElem.find('input:visible,select').first().select().focus();
            }
        },
        //UPDATE THE GRID CONTAINER HEIGHT
        //By updatedRecords and CollapsedRecord count length
        updateHeight: function () {

            var proxy = this,
                model = this.model,
                height = 0,
                detailsRowHeight = 0;
            if (proxy._$gridContainer && proxy._$gridContent) {
                if (model.allowPaging) {                    
                    height = model.rowHeight * proxy._updatedPageData.length;
                }
                else if (model.enableVirtualization) {
                    height = model.updatedRecords.length * model.rowHeight;
                }

                else {
                    height = model.rowHeight * (model.updatedRecords.length - proxy.getCollapsedRecordCount());
                }

                if (model.showDetailsRow && model.detailsTemplate && !model.showDetailsRowInfoColumn) {
                    detailsRowHeight = proxy._getExpandedDetailsRowHeight();
                }

                height += detailsRowHeight;

                if (height == 0 && (model.currentViewData.length == 0 || model.flatRecords.length == 0))
                    height = 30;
                //To skip Vertical scrollbar
                if (model.allowPaging && !model.sizeSettings.height) {
                    proxy._viewPortHeight = height;
                    proxy._gridHeight = height + proxy._getNonContentHeight();
                    if (proxy._summaryRowsCount > 0 && model.showTotalSummary)
                        proxy._gridHeight += model.rowHeight;
                    proxy.element.height(proxy._gridHeight);
                    if (this._frozenColumnsLength > 0) {
                        proxy._$gridContent.css("height", height);
                    }
                    else {
                        proxy.getScrollElement().ejScroller({
                            height: height,//for border-width of gridcontent
                        });
                    }
                }
                proxy._$gridContainer.css({
                    "height": height + "px",
                    "width": "auto"
                });
                if (this._frozenColumnsLength) {
                    proxy._$gridContainer.find("#e-movablecontentdiv" + proxy._id + ",#e-frozencontentdiv" + proxy._id).css("height", height + "px");
                }
                if (proxy.getScrollElement().hasClass("e-scroller")) {
                    proxy.getScrollElement().ejScroller("refresh");
                    proxy._updateScrollCss();
                }
            }
        },
        //check scroller position in virtualization
        _setScrollTop: function () {

            var proxy = this,
            model = this.model,
            currentPosition = 0,
            top = proxy._scrollTop,
            rowHeight = model.rowHeight,
            length = model.currentViewData.length,
            ganttbody = $(document).find(".e-ganttviewerbodyContianer");

            /* check detail template and its row height */
            if (model.showDetailsRow && model.detailsTemplate && !model.showDetailsRowInfoColumn) {
                rowHeight += proxy._detailsRowHeight;
            }
            if (model.allowPaging && proxy._isNextPage) {
                top = 0;
                proxy._isNextPage = false;
                proxy.getScrollElement().ejScroller("scrollY", top, true);
            }
            if (top !== 0) {
                if(model.enableVirtualization){
                    if ((length * rowHeight) < proxy._viewPortHeight) {
                        if (length > 0) {
                            currentPosition = top - (proxy._viewPortHeight - ((length - 1) * rowHeight));
                            if (currentPosition < 0)
                                currentPosition = 0;
                        }
                        if (model.isFromGantt)
                            ganttbody.ejScroller("scrollY", currentPosition, true);
                        else
                        proxy.getScrollElement().ejScroller("scrollY", currentPosition, true);
                    }
                }
                else {
                    if (model.isFromGantt)
                        ganttbody.ejScroller("scrollY", top, true);
                else
                    proxy.getScrollElement().ejScroller("scrollY", top, true);
            }
            }
        },

        getChildCount:function(record,count)
        {
            var currentRecord, proxy = this;
            if (!record.hasChildRecords)
                return 0;
            for (var i = 0; i < record.childRecords.length;i++)
            {
                currentRecord= record.childRecords[i];
                count++;
                if(currentRecord.hasChildRecords)
                {
                    count=proxy.getChildCount(currentRecord, count);
                }
            }
            return count;
        },
        //UPDATE THE FILTERED RECORDS FOR ADDING PARENTRECORDS
        _updateFilteredRecords: function (data) {

            var proxy = this,
                count = 0,
                length = data.length,
                record,virtualization=proxy.model.enableVirtualization;

            proxy._filteredRecords = [];
            proxy._filteredGanttRecords = [];

            for (count; count < length; count++) {

                record = data[count];

                if (record.parentItem != null) {

                    proxy._addParentRecord(record.parentItem);

                    if ($.inArray(record, proxy._filteredRecords) === -1) {
                        if (virtualization)
                        {
                            if (proxy.getExpandStatus(record))
                            {
                                proxy._filteredRecords.push(record);
                            }
                        }
                        else
                        {
                            proxy._filteredRecords.push(record);
                        }
                           
                    }

                } else {

                    if ($.inArray(record, proxy._filteredRecords) === -1) {
                        if (virtualization) {
                            if (proxy.getExpandStatus(record)) {
                                proxy._filteredRecords.push(record);
                            }
                        }
                        else {
                            proxy._filteredRecords.push(record);
                        }
                    }
                }
                if (!this.model.isFromGantt) {
                    if (record.hasChildRecords && record.childRecords.length > 0) {
                        if (!this._checkChildExsist(record, data)) {
                            record.hasFilteredChildRecords = false;
                        } else {
                            record.hasFilteredChildRecords = true;
                        }
                    }
                    if (record.parentItem) {
                        record.parentItem.hasFilteredChildRecords = true;
                    }
                }
            }
        },
        /* Check child records of filtered parent records exists or not in updated records*/
        _checkChildExsist: function (record, collection)
        {
            var childRecords = record.childRecords,
                length = childRecords.length, isExsist = false;
            for (var count = 0; count < length; count++) {
                if ($.inArray(childRecords[count], collection) != -1) {
                    isExsist = true;
                    break;
                } else if (childRecords[count].hasChildRecords) {
                    isExsist = this._checkChildExsist(childRecords[count], collection);
                }
            }
            return isExsist;
        },
        /* While clear the filter, update hasFilteredChildRecords status of all records*/
        _updateHasFilteredChildRecordsStatus: function (collection)
        {
            var count=0,length=collection.length,currentRecord;
            for (count; count < length; count++) {
                currentRecord = collection[count];
                if (currentRecord.hasChildRecords && !currentRecord.hasFilteredChildRecords)
                    currentRecord.hasFilteredChildRecords = true;
            }
        },
        //ADD PARENTRECORD FOR FILTERED OTH LEVEL ITEMS
        _addParentRecord: function (record) {

            var proxy = this,
            virtualization = proxy.model.enableVirtualization;

            if (record.parentItem) {
                proxy._addParentRecord(record.parentItem);

                if ($.inArray(record, proxy._filteredRecords) === -1) {

                    if (virtualization) {
                        if (proxy.getExpandStatus(record)) {
                            proxy._filteredRecords.push(record);
                        }
                    }
                    else {
                        proxy._filteredRecords.push(record);
                    }
                     

                }
            } else {

                if ($.inArray(record, proxy._filteredRecords) === -1) {

                    if (virtualization) {
                        if (proxy.getExpandStatus(record)) {
                            proxy._filteredRecords.push(record);
                        }
                    }
                    else {
                        proxy._filteredRecords.push(record);
                    }

                }
            }
        },


        //UPDATEEXPANDCOLLAPSE FOR SORTED RECORDS
        _updateExpandCollapseForSortedRecords: function (Record, expanded) {

            var proxy = this,
                count = 0,
                length = proxy._sortedRecords.length,
                record,
                index = proxy._sortedRecords.indexOf(Record);

            if (expanded) {

                proxy._addNestedSortRecords(Record, index);

            } else {

                var removedCount = 0;

                for (count = index + 1; count < length; count++) {

                    record = proxy._sortedRecords[count];

                    if (record.level === Record.level) {
                        break;
                    } else if (!proxy.getExpandStatus(record)) {
                        removedCount++;
                    }

                }

                proxy._sortedRecords.splice(index + 1, removedCount);

            }
        },


        //ADD NESTEDSORTRECORDS
        _addNestedSortRecords: function (record, index) {

            var proxy = this,
                childRecords,
                sortColumns = proxy.model.sortSettings.sortedColumns,
                length;

            if (sortColumns.length) {

                length = sortColumns.length - 1;
                proxy._queryManagar.queries = [];

                for (var i = length; i >= 0; i--) {

                    proxy._queryManagar.sortBy(sortColumns[i].field, sortColumns[i].direction);

                }

            }
            if (record.hasChildRecords) {

                var dataManager = ej.DataManager(record.childRecords),
                    count,
                    childrecord;

                childRecords = dataManager.executeLocal(proxy._queryManagar).result;
                length = childRecords.length;

                for (count = 0; count < length; count++) {

                    childrecord = childRecords[count];

                    if (proxy._filteredRecords.length) {

                        if ($.inArray(childrecord, proxy._filteredRecords) !== -1) {
                            proxy._sortedRecords.splice(++index, 0, childrecord);
                        }

                    } else {
                        proxy._sortedRecords.splice(++index, 0, childrecord);
                    }

                    if (childrecord.hasChildRecords && childrecord.expanded) {
                        proxy._addNestedSortRecords(childrecord, index);
                    }
                }
            }
        },

        //UPDATE Edit Settings
        updateEditSettings: function (edit) {

            var proxy = this;

            if (edit) {
                if (edit.editMode) {
                    if (proxy.model.editSettings.editMode === "normal" && edit.editMode === "cellEditing") {
                        proxy.model.editSettings.editMode = edit.editMode;
                        proxy._processEditing();
                    } else {
                        proxy.model.editSettings.editMode = edit.editMode;
                    }
                }
                if (!ej.isNullOrUndefined(edit.allowAdding))
                    proxy.model.editSettings.allowAdding = edit.allowAdding;
                if (!ej.isNullOrUndefined(edit.allowEditing))
                    proxy.model.editSettings.allowEditing = edit.allowEditing;
                if (!ej.isNullOrUndefined(edit.allowDeleting))
                    proxy.model.editSettings.allowDeleting = edit.allowDeleting;
                if (!ej.isNullOrUndefined(edit.beginEditAction))
                    proxy.model.editSettings.beginEditAction = edit.beginEditAction;
                proxy._enableEditingEvents();
            }
        },

        //UPDATE ALTROW
        updateAltRow: function () {

            var proxy = this,
                count = 0,
                currentViewData = proxy.model.updatedRecords,
                length = currentViewData.length,
                record;

            for (count = 0; count < length; count++) {
                record = currentViewData[count];
                if (record.isSummaryRow)
                    continue;
                record.isAltRow = count % 2 == 0 ? false : true;
            }

        },


        
        //COUNT THE NUMBER OF CHILD RECORDS PRESENT IN THE GANTTRECORD
        _getFilteredChildRecordsCount: function (Record) {

            var proxy = this,
                model=proxy.model,
                length = Record&&Record.childRecords && Record.childRecords.length,
                i = 0,
                record;

            for (i = 0; i < length; i++) {

                record = Record.childRecords[i];
                if (model.enableVirtualization)
                {
                    if(proxy.getExpandStatus(record))
                    {
                        proxy._removedCount++;
                    }
                }
                else
                {
                    proxy._removedCount++;
                }
                   
                if (record.childRecords) {
                    proxy._getFilteredChildRecordsCount(record);
                }
            }

            return proxy._removedCount;
        },


        //SORTING THE RECORDS
        _sortingRecords: function (args) {

            var proxy = this,
                model = proxy.model,
                sortcolumns = model.sortSettings.sortedColumns;

            proxy._queryManagar.queries = [];

            if (sortcolumns.length) {

                var length = sortcolumns.length - 1;

                for (var i = length; i >= 0; i--) {
                    var fieldName = sortcolumns[i].field;
                    if (model.isFromGantt) {
                            if (fieldName === "resourceInfo")
                                fieldName = "resourceNames";
                            else if (fieldName === "predecessor")
                                fieldName = "predecessorsName";
                    }

                    proxy._queryManagar.sortBy(fieldName, sortcolumns[i].direction);
                }
            }

            var dataManager = new ej.DataManager(model.parentRecords),
                records = dataManager.executeLocal(proxy._queryManagar).result;

            proxy._sortedRecords = [];
            proxy._storedIndex = -1;
            proxy._rowIndex = -1;

            proxy._createSortedRecords(records);
            proxy._tempsortedrecords = proxy._sortedRecords;
            proxy.model.updatedRecords = proxy._sortedRecords;
            //Update zeroLevelParentRecords
            if (model.allowPaging && model.pageSettings.pageSizeMode === ej.TreeGrid.PageSizeMode.Root)
                model.parentRecords = proxy._getParentRecords(proxy.model.updatedRecords, proxy, true);

            return true;
        },


        /**
        * Create sorted collection argumented data
        * @param {data} collection of records to sorting
        */
        _createSortedRecords: function (data) {

            var proxy = this, model = proxy.model,
                sortedRecords = proxy._sortedRecords,
                dataManager,
                enableAltRow = proxy.model.enableAltRow,model=this.model;
            data = $(data).not(model.summaryRowRecords).get();
            $.each(data, function (index, record) {
                //Skip the summary record from sorting.
                if (record.isSummaryRow) {
                    var recordIndex = record.parentItem.childRecords.indexOf(record);
                    record.parentItem.childRecords.splice(recordIndex, 1);
                    return;
                }
                if (proxy._searchString.length > 0 || (model.filterSettings.filteredColumns.length > 0)) {

                    if (proxy._filteredRecords.length > 0 && proxy._filteredRecords.indexOf(record) !== -1) {

                        proxy._storedIndex++;
                        proxy._rowIndex++;

                        if (enableAltRow) {

                            record.isAltRow = proxy._rowIndex % 2 == 0 ? false : true;

                        }

                        sortedRecords[proxy._storedIndex] = record;

                    }
                } else {

                    proxy._storedIndex++;
                    proxy._rowIndex++;

                    if (enableAltRow) {

                        record.isAltRow =proxy._rowIndex % 2 == 0 ? false : true;

                    }

                    sortedRecords[proxy._storedIndex] = record;

                }

                if (record.hasChildRecords && record.expanded) {
                    record.childRecords = $(record.childRecords).not(model.summaryRowRecords).get();
                    dataManager = ej.DataManager(record.childRecords);
                    var childRecords = dataManager.executeLocal(proxy._queryManagar).result;
                    proxy._createSortedRecords(childRecords);

                }
                else if (record.hasChildRecords && !record.expanded && !model.enableVirtualization) {
                    record.childRecords = $(record.childRecords).not(model.summaryRowRecords).get();
                    proxy._setChildRecords(record, sortedRecords);
                }
            });
        },

        _setChildRecords:function(record,sortedRecords)
        {
            var proxy = this,
                model = proxy.model,
            enableAltRow = proxy.model.enableAltRow;
            var length = record.childRecords.length;

            dataManager = ej.DataManager(record.childRecords);
            var childRecords = dataManager.executeLocal(proxy._queryManagar).result;
            for(var count=0;count<length;count++)
            {
                if (proxy._searchString.length > 0 || (model.filterSettings.filteredColumns.length > 0)) {

                    if (proxy._filteredRecords.length > 0 && proxy._filteredRecords.indexOf(childRecords[count]) !== -1) {
                        proxy._storedIndex++;
                        if (enableAltRow) {
                            childRecords[count].isAltRow = proxy._storedIndex % 2 == 0 ? false : true;
                        }
                        sortedRecords[proxy._storedIndex] = childRecords[count];
                        if (childRecords[count].hasChildRecords) {
                            this._setChildRecords(childRecords[count], sortedRecords);
                        }
                    }
                } else
                {
                    proxy._storedIndex++;
                    if (enableAltRow) {
                        childRecords[count].isAltRow = proxy._storedIndex % 2 == 0 ? false : true;
                    }
                    sortedRecords[proxy._storedIndex] = childRecords[count];
                    if (childRecords[count].hasChildRecords) {
                        this._setChildRecords(childRecords[count], sortedRecords);
                    }
                }
            }
        },
        //UPDAT THE SORTED RECORDS
        _updateSortedRecords: function (data) {

            var proxy = this,
                count = 0,
                length = data.length,
                record,model=this.model;

            for (count; count < length; count++) {

                record = data[count];

                if (!model.enableVirtualization) {

                    if (proxy._filteredRecords.length > 0) {

                        if ($.inArray(record, proxy._filteredRecords) !== -1 && $.inArray(record, proxy._sortedRecords) === -1) {
                            proxy._sortedRecords.push(record);
                        }

                    } else {

                        if ($.inArray(record, proxy._sortedRecords) === -1) {
                            proxy._sortedRecords.push(record);
                        }

                    }

                    if (record.hasChildRecords && record.childRecords.length > 0) {

                        var dataManager = ej.DataManager(record.childRecords),
                            sortedChildRecords = dataManager.executeLocal(proxy._queryManagar).result;
                        proxy._updateSortedRecords(sortedChildRecords);

                    }
                }
            }
        },


        //REMOVE SORT ICON FORM COLUMN HEADER
        _removeSortElementFromColumn: function (field) {

            var proxy = this,
                column = ej.TreeGrid.getColumnByField(proxy.model.columns, field),
                index = $.inArray(column, proxy.model.columns),
                $headerCellDiv = proxy.getHeaderTable().find("thead").find(".e-headercell").eq(index).find(".e-headercelldiv");

            $headerCellDiv.find(".ascending,.descending").remove();
            $headerCellDiv.parent().removeAttr("aria-sort");
        },


        //ADD EMPTYCOLUMN TO THE TREEGRID
        _addEmptyColumntoGrid: function () {

            var proxy = this;
            $(proxy.element).find('.e-gridheadercontainer table colgroup').append(ej.buildTag('col', "", {
                "width": "auto"
            },
            {}));
            proxy._$gridContainer.find('table colgroup').append(ej.buildTag('col', "", {
                "width": "auto"
            },
            {}));
            $(proxy.element).find('.e-gridheadercontainer table thead tr').append(ej.buildTag('th.e-headercell'));
        },


        //UPDATE THE SCROLLTOP OF THE GRIDCONTAINER
        _updateScrollTop: function (y) {

            var args = {},
                proxy = this;

            args.requestType = "scroll";
            args.delta = y;

            var isHorizontalScroll = proxy.getScrollElement().ejScroller("isHScroll");

            if (!isHorizontalScroll && this.model.isFromGantt) {
                proxy._$gridContent.scrollTop(y);//grid container
            }
            else
            {
                proxy._$gridContent.scrollTop(0)
            }
            proxy.getScrollElement().ejScroller("scrollY", y, true);
            if (proxy.model.isFromGantt) {
                proxy._completeAction(args);
               proxy._focusTreeGridElement();
            }
            
        },

        _selectNextCell: function (direction, action) {
            var proxy = this, model = proxy.model,
                columns = model.columns,
                columnLength = columns.length,
                rowElement, cellElement,
                updatedRecords = model.updatedRecords,
                expandedRecords = expandedRecords = proxy.getExpandedRecords(updatedRecords);
            proxy._isShiftKeyNavigation = false;

            switch (direction) {
                case "right":                   
                    if (proxy._focusingRowIndex >= updatedRecords.length - 1 && proxy._cellIndex >= columnLength - 1)
                        return;
                    proxy._cellIndex += 1;
                    if (proxy._cellIndex == columnLength) {
                        proxy._cellIndex = 0;
                        var selectedItem = updatedRecords[proxy._rowIndexOfLastSelectedCell];
                        selectingRowIndex = expandedRecords.indexOf(selectedItem);
                        currentSelectingRecord = expandedRecords[selectingRowIndex + 1];
                        //To skip the key Navigation from summary row.
                        if (currentSelectingRecord && currentSelectingRecord.isSummaryRow)
                            currentSelectingRecord = proxy._getNextRecord(selectingRowIndex + 1, expandedRecords);

                        if (!currentSelectingRecord)
                            return;
                        proxy._focusingRowIndex = updatedRecords.indexOf(currentSelectingRecord);
                    }
                    if (proxy._focusingRowIndex >= model.updatedRecords.length)
                        return;
                    if ((!columns[proxy._cellIndex].visible || !columns[proxy._cellIndex].allowCellSelection) && $form.length <= 0)
                        proxy._cellIndex = proxy.getUpNextVisibleColumnIndex(proxy._cellIndex, action);
                    if ($form.length > 0 && columns[proxy._cellEditingDetails.columnIndex].allowCellSelection)
                        proxy._cellIndex = proxy._cellEditingDetails.columnIndex;
                    var cellInfo = {
                        rowIndex: proxy._focusingRowIndex,
                        cellIndex: proxy._cellIndex
                    };
                    proxy.selectCells([cellInfo]);
                    proxy.updateScrollBar();
                    break;
                case "left":                    
                    proxy._cellIndex -= 1;
                    columnLength = columns.length;

                    if (proxy._cellIndex < 0) {
                        proxy._cellIndex = columnLength - 1;
                        var selectedItem = updatedRecords[proxy._rowIndexOfLastSelectedCell];
                        selectingRowIndex = expandedRecords.indexOf(selectedItem);
                        currentSelectingRecord = expandedRecords[selectingRowIndex - 1];
                        //To skip the key Navigation from summary row.
                        if (currentSelectingRecord && currentSelectingRecord.isSummaryRow)
                            currentSelectingRecord = proxy._getNextRecord(selectingRowIndex - 1, expandedRecords, "upArrow");

                        if (!currentSelectingRecord)
                            return;
                        proxy._focusingRowIndex = updatedRecords.indexOf(currentSelectingRecord);
                    }
                    if (proxy._focusingRowIndex < 0)
                        return;
                    if (proxy._focusingRowIndex >= model.updatedRecords.length)
                        proxy._focusingRowIndex = model.updatedRecords.length - 1;
                    if ((!columns[proxy._cellIndex].visible || !columns[proxy._cellIndex].allowCellSelection) && $form.length <= 0)
                        proxy._cellIndex = proxy.getPreviousVisibleColumnIndex(proxy._cellIndex, action);
                    if ($form.length > 0 && columns[proxy._cellEditingDetails.columnIndex].allowCellSelection)
                        proxy._cellIndex = proxy._cellEditingDetails.columnIndex;

                    var cellInfo = {
                        rowIndex: proxy._focusingRowIndex,
                        cellIndex: proxy._cellIndex
                    };
                    proxy.selectCells([cellInfo]);
                    proxy.updateScrollBar();
                    break;
            }
        },
        //MOVE CURRENT CELL FOR KEYBOARD INTERACTION
        _moveCurrentCell: function (direction) {

            var proxy = this,
                rowIndex = proxy._cellEditingDetails.rowIndex,
                columnIndex = proxy._cellEditingDetails.columnIndex,
                model = proxy.model,
                updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;

            if (rowIndex == -1 && columnIndex == -1) return false;

            if (proxy.model.isEdit) {

                proxy.saveCell();
                proxy.model.isEdit = false;

            }
            if (model.enableVirtualization && !model.allowPaging) {
                var record = model.currentViewData[rowIndex];
                proxy._cellEditingDetails.rowIndex = rowIndex = model.updatedRecords.indexOf(record);
            }
            switch (direction) {

                case "right":
                    var columns = model.columns,
                        columnLength = columns.length,
                        hiddenColumn = proxy.getHiddenColumns(),
                        visibleColumn = $.extend([], columns),
                        nextColumnIndex, newColumnIndex, visibleColumnLength;
                    if(hiddenColumn)
                    hiddenColumn.forEach(function (item) {
                        visibleColumn.splice(visibleColumn.indexOf(item), 1);
                    });
                    newColumnIndex = visibleColumn.indexOf(columns[columnIndex]);
                    visibleColumnLength = visibleColumn.length;
                    if (rowIndex == updatedRecords.length - 1 && newColumnIndex == visibleColumnLength - 1) {
                        return true;
                    }
                    if (newColumnIndex == visibleColumnLength - 1) {
                        nextColumnIndex = 0;
                        while (!columns[nextColumnIndex].visible) {
                            nextColumnIndex++;
                        }
                        proxy._cellEditingDetails.columnIndex = nextColumnIndex;
                        if(proxy._getNextRow(direction, rowIndex, proxy))
                            return true;
                        
                    }
                    else {
                        nextColumnIndex = columnIndex + 1;
                        while (!columns[nextColumnIndex].visible) {
                            nextColumnIndex++;
                        }
                        proxy._cellEditingDetails.columnIndex = nextColumnIndex;
                    }
                    while (model.columns[nextColumnIndex].allowEditing == false || !columns[nextColumnIndex].visible) {
                        if ((nextColumnIndex + 1) == model.columns.length) {
                            proxy._cellEditingDetails.columnIndex = nextColumnIndex = 0;
                            if (proxy._getNextRow(direction, rowIndex, proxy))
                                return true;
                            continue;
                        }
                        proxy._cellEditingDetails.columnIndex = ++nextColumnIndex;
                    }
                    proxy.updateScrollBar();
                    proxy.cellEdit(proxy._cellEditingDetails.rowIndex,
                        model.columns[proxy._cellEditingDetails.columnIndex].field);
                    proxy._editAddTools();
                    break;

                case "left":
                    var columns = model.columns,
                       columnLength = columns.length,
                       hiddenColumn = proxy.getHiddenColumns(),
                       visibleColumn = $.extend([], columns),
                       prevColumnIndex, newColumnIndex, visibleColumnLength;
                    if (hiddenColumn)
                        hiddenColumn.forEach(function (item) {
                            visibleColumn.splice(visibleColumn.indexOf(item), 1);
                        });
                    newColumnIndex = visibleColumn.indexOf(columns[columnIndex]);
                    visibleColumnLength = visibleColumn.length;
                    if ((rowIndex == 0 && newColumnIndex == 0)) return true;
                    if (newColumnIndex == 0) {
                        prevColumnIndex = model.columns.length - 1;
                        while (!columns[prevColumnIndex].visible) {
                            prevColumnIndex--;
                        }
                        proxy._cellEditingDetails.columnIndex = prevColumnIndex;
                        if(proxy._getNextRow(direction, rowIndex, proxy))
                            return true;
                    } else {
                        prevColumnIndex = columnIndex - 1;
                        while (!columns[prevColumnIndex].visible) {
                            prevColumnIndex--;
                        }
                        proxy._cellEditingDetails.columnIndex = prevColumnIndex;
                    }

                    while (model.columns[prevColumnIndex].allowEditing == false || !columns[prevColumnIndex].visible) {

                        if ((prevColumnIndex - 1) == -1) {
                            proxy._cellEditingDetails.columnIndex = prevColumnIndex = columnLength - 1;
                            if (proxy._getNextRow(direction, rowIndex, proxy))
                                return true;
                            continue;
                        }
                        proxy._cellEditingDetails.columnIndex = --prevColumnIndex;
                    }
                    proxy.updateScrollBar();
                    proxy.cellEdit(proxy._cellEditingDetails.rowIndex, model.columns[proxy._cellEditingDetails.columnIndex].field);
                    proxy._editAddTools();
                    break;

                case "up":
                    if (rowIndex == 0) return true;
                    proxy._cellEditingDetails.rowIndex = rowIndex - 1;
                    proxy.selectRows(proxy._cellEditingDetails.rowIndex);
                    proxy._rowSelectedEventTrigger(proxy._cellEditingDetails.rowIndex);
                    proxy.cellEdit(proxy._cellEditingDetails.rowIndex, model.columns[proxy._cellEditingDetails.columnIndex].field);
                    break;

                case "down":
                    if (rowIndex + 1 == proxy.model.updatedRecords.length) {
                        proxy._focusTreeGridElement();
                        proxy._isEnterKeyPressed = true;
                    }
                    if (model.showSummaryRow) {
                        if (rowIndex + 1 == model.updatedRecords.length - model.summaryRows.length)
                            proxy._isEnterKeyPressed = true;
                    }
                    if (!proxy._isEnterKeyPressed) {
                        if (proxy.model.updatedRecords.length > (rowIndex + 1))
                            if (!model.enableVirtualization) {
                                var currentRecord = model.updatedRecords[rowIndex],
                                    expandedRecords = proxy.getExpandedRecords(model.updatedRecords),
                                    nextRecord = expandedRecords[expandedRecords.indexOf(currentRecord) + 1];
                                //Skip the summary row from keyboard navigation.
                                if (nextRecord && nextRecord.isSummaryRow)
                                    nextRecord = proxy._getNextRecord(rowIndex + 1, expandedRecords);
                                var index = model.updatedRecords.indexOf(nextRecord);
                                if ((rowIndex == expandedRecords.length - 1 && columnIndex == model.columns.length - 1) || index == -1) {
                                    return true;
                                }
                                proxy._cellEditingDetails.rowIndex = index;
                            }
                            else {
                                var nextRecord = model.updatedRecords[rowIndex + 1];
                                //Skip the summary row from keyboard navigation.
                                if (nextRecord && nextRecord.isSummaryRow)
                                    nextRecord = proxy._getNextRecord(rowIndex + 1, model.updatedRecords);
                                index = model.updatedRecords.indexOf(nextRecord);
                                if (index == -1)
                                    return true;
                                proxy._cellEditingDetails.rowIndex = index;
                            }
                        if (!proxy._rowSelectingEventTrigger(proxy.selectedRowIndex(), proxy._cellEditingDetails.rowIndex)) {
                            proxy.selectRows(proxy._cellEditingDetails.rowIndex);
                            proxy._rowSelectedEventTrigger(proxy._cellEditingDetails.rowIndex);
                        }
                        proxy.updateScrollBar();
                        args = {};
                        args.requestType = "scroll";
                        args.delta = proxy._$gridContent.children('.e-content').scrollTop();
                        proxy._trigger("actionComplete", args);
                        proxy.cellEdit(proxy._cellEditingDetails.rowIndex, model.columns[proxy._cellEditingDetails.columnIndex].field);
                        proxy._editAddTools();
                    }
                    else
                        proxy._isEnterKeyPressed = false;
                    break;
            }

            return false;

        },
        //To skip the summary record. 
        _getNextRecord: function (index, expandedRecords, action) {
            do {
                nextRecord = expandedRecords[index];
                if (action == "upArrow" || action == "lastRowSelection" || action == "bottomRowSelection")
                    index--
                else
                    index++;
            } while (nextRecord && nextRecord.isSummaryRow);
            return nextRecord;
        },

        _getNextRow: function (direction, rowIndex, proxy) {
            var cellIndex,
            model = proxy.model,
            updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;
            if (direction == "right")
                cellIndex = 1;
            else
                cellIndex = -1;

            if (!model.enableVirtualization) {
                var currentRecord = updatedRecords[rowIndex],
                  expandedRecords = proxy.getExpandedRecords(model.updatedRecords),
                  nextRecord = expandedRecords[expandedRecords.indexOf(currentRecord) + cellIndex];
                //Skip the summary row from keyboard navigation.
                if (nextRecord && nextRecord.isSummaryRow) {
                    var action = cellIndex > 0 ? "" : "lastRowSelection"
                    nextRecord = proxy._getNextRecord(rowIndex + cellIndex, expandedRecords, action);
                }
                if (model.allowPaging && nextRecord) {
                    index = updatedRecords.indexOf(nextRecord);
                    if (index < 0 && cellIndex == 1)
                        proxy.gotoPage(proxy._currentPage() + 1);
                    else if (index < 0 && cellIndex == -1)
                        proxy.gotoPage(proxy._currentPage() - 1);
                }
                index = updatedRecords.indexOf(nextRecord);
                if(index == -1) {
                    return true;
                }
                proxy._cellEditingDetails.rowIndex = index;
            }
            else {
                var nextRecord = model.updatedRecords[rowIndex + cellIndex];
                //Skip the summary row from keyboard navigation.
                if (nextRecord && nextRecord.isSummaryRow) {
                    var action = cellIndex > 0 ? "" : "lastRowSelection"
                    nextRecord = proxy._getNextRecord(rowIndex + cellIndex, model.updatedRecords, action);
                }
                if (model.allowPaging && nextRecord) {
                    index = updatedRecords.indexOf(nextRecord);
                    if (index < 0 && cellIndex == 1)
                        proxy.gotoPage(proxy._currentPage() + 1);
                    else if(index < 0 && cellIndex == -1)
                        proxy.gotoPage(proxy._currentPage() - 1);
                }
                index = updatedRecords.indexOf(nextRecord);
                if (index == -1)
                    return true;
                proxy._cellEditingDetails.rowIndex = index;
            }
            if (model.allowSelection && model.selectionMode == "cell")
                model.selectedItem = model.updatedRecords[proxy._cellEditingDetails.rowIndex];
            else if (!proxy._rowSelectingEventTrigger(proxy.selectedRowIndex(), proxy._cellEditingDetails.rowIndex)) {
                proxy.selectRows(proxy._cellEditingDetails.rowIndex);
                proxy._rowSelectedEventTrigger(proxy._cellEditingDetails.rowIndex);
            }

        },

        //FIND THE COLUMNWIDTH OF THE TREEGRID COLUMN
        _findColumnsWidth: function (extra) {

            var proxy = this,
                length = proxy.model.columns.length,
                j = proxy.getHeaderTable().find("colgroup").find("col");
            
            for (var i = 0; i < length; i++)
                proxy.columnsWidthCollection[i] = j.eq(i).width();

        },

        //CALCULATE THE TOTAL WIDTH OF THE COLUMNS
        _calculateWidth: function () {

            var j = this.getHeaderTable().find("colgroup").find("col"),
                width = 0;

            for (var i = 0; i < j.length; i++)
                width += j.eq(i).width();

            return width;
        },
        getScrollObject: function () {
            return this.getScrollElement().data("ejScroller");

        },
        //update element height when viewport height is <0
        _updateElementHeight:function()
        {
            var proxy = this;
            proxy._calculateDimensions();
            proxy.updateViewPortHeight();
        },
        /* Get scroller rendered div in treegrid*/
        getScrollElement: function () {
            if (this._frozenColumnsLength > 0)
                return this.element.find("#e-movablecontainer" + this._id);
            else
                return this._$gridContent;
        },
        /* Get width of all columns before the index or get frozen column width*/
        _getFrozenColumnWidth: function (index) {
            var width = 0,
                index = ej.isNullOrUndefined(index) ? this._frozenColumnsLength : index,
                columns = ej.isNullOrUndefined(index) ? this._frozenColumns : this.model.columns;
            if (index > 0)
            {
                for (var count = 0; count < index; count++) {
                    width += columns[count] ? this.columnsWidthCollection[count] : 0;
                }
            }
            return width;
        },
        _renderScroller: function (isFromFreezeColumn) {

            var proxy = this,
            model = proxy.model;
            var containerHeight = model.flatRecords.length * model.rowHeight;
            var contentHeight = proxy._viewPortHeight;

            if (!proxy._$gridContent.hasClass("e-scroller") || (model.allowPaging && !model.sizeSettings.height)) {
                var height = proxy._gridHeight ? contentHeight : "auto";
                var width = proxy.element.width(), targetPane = null;
                if (this._frozenColumnsLength > 0) {
                    proxy._$gridContent.css("width", width - proxy._totalBorderWidth);
                    width = width - this._getFrozenColumnWidth() - 1;//frozen div border width
                }
                proxy.getScrollElement().ejScroller({
                    enableTouchScroll: false,
                    height: proxy.model.isFromGantt ? 0 : height,
                    width: proxy.model.isFromGantt ? width : width - proxy._totalBorderWidth,
                    scroll: $.proxy(proxy._onScroll, proxy)
                });
            }
            else {
                proxy.getScrollElement().ejScroller("refresh");
            }
            proxy.getScrollElement().ejScroller("model.keyConfigs", { up: "", down: "", left: "", right: "" });
            if (ej.isNullOrUndefined(isFromFreezeColumn))
                proxy._updateScrollCss();
            var isHorizontalScroll = proxy.getScrollElement().ejScroller("isHScroll");
            if (model.allowPaging && !model.sizeSettings.height && isHorizontalScroll) {
                proxy._gridHeight = proxy._gridHeight + 18;
                proxy.element.height(proxy._gridHeight);
                proxy.getScrollElement().ejScroller("refresh");
            }
            if (proxy.model.isFromGantt) {
                if (!isHorizontalScroll) {
                    proxy._$gridContent.addClass("e-borderbox");
                }
                else {
                    proxy._$gridContent.removeClass("e-borderbox");
                }
            }

            if (!this.mobileDevice() && this.getBrowserDetails().browser == "safari" && this._frozenColumnsLength > 0) {
                this.getHeaderContent().find("#e-movableheader" + proxy._id).add(this.getContent().find("#e-movablecontainer" + proxy._id)).css("margin-left", "auto");
                if(this._$totalSummaryRowContainer)
                    this._$totalSummaryRowContainer.find("#e-movablefooter" + proxy._id).css("margin-left", "auto");
            }
            if (this._frozenColumnsLength > 0) {
                proxy._$gridContent.height(height);
                proxy.getContent().find("#e-frozencontainer" + proxy._id).height(proxy.getContent().find("#e-movablecontent" + proxy._id).height());
            }
        },
        

        
        //ALL EVENTS BOUND USING THIS._ON WILL BE UNBIND AUTOMATICALLY
        _destroy: function () {

            var proxy = this;
            proxy.element.empty().removeClass("e-treegrid-core e-treegrid " + proxy.model.cssClass);
            
        },

        

        collapseAll: function () {
            var proxy = this,
                model = proxy.model,
                count = 0,
                ganttRecord,
                args = {},
                enableVirtualization = model.enableVirtualization,
                $gridRows = proxy.getRows(),
                $rowElement = null;

            
            //To cancel the cell edit or row edit mode when collapse the all record.
            if (proxy._isRowEdit || proxy.model.isEdit) {
                proxy._isRowEdit ? proxy.cancelRowEditCell() : proxy.cancelEditCell();
                proxy.selectRows(-1);                          
                proxy._cancelSaveTools();
            }
            args.requestType = ej.TreeGrid.Actions.ExpandCollapse;
            //loop excecute for iterate the GanttRecords preseent in the Gantt Control
            proxy._isInExpandCollapseAll = true;

            for (count = 0; count < proxy.model.parentRecords.length; count++) {
                treegridRecord = proxy.model.parentRecords[count];
                args.data = treegridRecord;
                args.recordIndex = count;
                args.expanded = false;
                if (treegridRecord.hasChildRecords) {
                    proxy._expandCollapseInnerLevelRecord(treegridRecord, args.expanded);
                    ej.TreeGrid.sendExpandCollapseRequest(proxy, args);
                }
            }
            if (model.flatRecords.length > 0)
                proxy._refreshTreeGridOnExpandCollapseAll(args);

            proxy._isInExpandCollapseAll = false;

        },
        //populate the context menu with items
        _getContextMenuItems: function () {
            var contextMenuItems = [];
            proxy = this,
            contextMenuLabel = proxy._contextMenuTexts;
            contextMenuItems = [ {
                headerText: contextMenuLabel["addRowText"],
                eventHandler: null,
                isDefault: true,
                disable: false,
                menuId: "Add",
                parentMenuId: null
            },
             {
                 iconClass: "e-edit",
                 headerText: contextMenuLabel["editText"],
                 eventHandler: null,
                 isDefault: true,
                 disable: false,
                 menuId: "Edit",
                 parentMenuId: null
             },
            {
                headerText: contextMenuLabel["deleteText"],
                eventHandler: null,
                isDefault: true,
                disable: false,
                menuId: "Delete",
                parentMenuId: null
            },
            {
                iconClass: "e-save",
                headerText: contextMenuLabel["saveText"],
                eventHandler: null,
                isDefault: true,
                isEdit: true,
                disable: false,
                menuId: "Save",
                parentMenuId: null
            },
             {
                 iconClass: "e-cancel",
                 headerText: contextMenuLabel["cancelText"],
                 eventHandler: null,
                 isDefault: true,
                 isEdit: true,
                 disable: false,
                 menuId: "Cancel",
                 parentMenuId: null
             },
             {
                 iconPath: null,
                 headerText: contextMenuLabel["aboveText"],
                 eventHandler: null,
                 menuId: "Above",
                 parentMenuId: "Add"
             }, {
                 iconPath: null,
                 headerText: contextMenuLabel["belowText"],
                 eventHandler: null,
                 menuId: "Below",
                 parentMenuId: "Add"
             }
            ];
            return contextMenuItems;
        },

        //populate sub context menu items
        _getsubContextMenuItems: function () {
            var contextMenuItems = [];
            proxy = this,
            contextMenuLabel = proxy._contextMenuTexts;
            contextMenuItems = [{
                iconPath: null,
                headerText: contextMenuLabel["aboveText"],
                eventHandler: null,
                menuId: "Above",
                parentMenuId: "Add"
            }, {
                iconPath: null,
                headerText: contextMenuLabel["belowText"],
                eventHandler: null,
                menuId: "Below",
                parentMenuId: "Add"
            }
            ];
            return contextMenuItems;
        },
        _clearContextMenu: function () {
            //remove context menu items
            $('.e-contextmenu').remove();
            $('.e-innerContextmenu').remove();
        },
        // create and append a context menu and also bind the events for context menu option
        _renderContextMenu: function (e, index, item) {

            var proxy = this,
            model = proxy.model,
                eventArgs = {},
                args = {},
                posx,
				subposx,
                posy,
                subposx,
                contextMenu,
                contextMenuUList,
                subContextMenu,
                subContextMenuUList;
            proxy._contextMenuSelectedIndex = index;
            proxy._contextMenuSelectedItem = item;
            proxy._contextMenuEvent = e;
            if (!e) e = window.event;
            if (e.pageX || e.pageY) {
               subposx = posx = e.pageX;
                posy = e.pageY;
            } else if (e.clientX || e.clientY) {
                subposx = posx = e.clientX + document.body.scrollLeft
                    + document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop
                    + document.documentElement.scrollTop;
            }
            //Edge detection for context menu
            var treeGridOffset = this.getOffsetRect(proxy.element[0]);
            treeGridOffset.bottom = treeGridOffset.top + this.element[0].offsetHeight;
            treeGridOffset.right = treeGridOffset.left + $(this.element).width();
           
            args.targetElement = e;
            args.item = item;
            args.index = index;
            args.columnIndex = proxy.getCellIndex(e);
            args.requestType = "ContextMenuOpen";
            args.contextMenuItems = proxy._contextMenuItems;
            if (proxy._trigger("contextMenuOpen", args)) return false;
            proxy._activeMenuItemId = null;
            proxy._contextMenuItems = args.contextMenuItems;
            contextMenu = ej.buildTag("div.e-contextmenu", "", {
                'display': 'table',
                'position': 'absolute',
                'border-width': '1px',
                'border-style': 'solid',
                'z-index': '10033',
            }, { "id": proxy._id + "_ContextMenu" });

            //Get zero th level menu items
            var parentMenuItems = args.contextMenuItems.filter(function (value) {
                if (value.parentMenuId == null || value.parentMenuId == undefined)
                    return true;
            });
            contextMenuUList = ej.buildTag("ul", $.render[proxy._id + "contextMenuTemplate"](parentMenuItems), {
                'margin': '0px',
                'padding-left': '0px'
            }, {
                'data-icon': false,
                'type': 'none',
                'data-role': 'list-divider'
            });
            
            
            contextMenu.append(contextMenuUList);
            $(document.body).append(contextMenu);

            var contextMenuHeight = $(contextMenu).height(),
                contextMenuWidth = $(contextMenu).width(),
                contextMenuItems = contextMenu.find(".e-menuitem"),
                contextMenuSelectItem = contextMenuItems.eq(0);

            if (treeGridOffset.left > posx || (treeGridOffset.right < (posx + contextMenuWidth))) {
                if (treeGridOffset.right < (posx + contextMenuWidth)) {
                    posx = posx - contextMenuWidth;
                }
                if (posx < 0) {
                    posx = treeGridOffset.left + 10;
                }
            }
            if (treeGridOffset.bottom < posy + (30 * parentMenuItems.length)) {
                var tempPosY = posy - (30 * parentMenuItems.length);
                if (tempPosY > 0) {
                    posy = tempPosY;
                }
            }         
            contextMenu.css({ 'left': posx + 'px', 'top': posy + 'px', });
            contextMenuItems.css({ 'width': contextMenuWidth + 2 });
            proxy._focusTreeGridElement();
            $(contextMenu).css({ 'height': 'auto' });
            proxy._on(contextMenu, "contextmenu", function (argsE) {
                argsE.preventDefault();
            });
            //click event handlers for contextmenu items and subcontextmenu items
            $(contextMenuItems).click(function () {
                proxy._contextMenuClickHandler(this);
            });

            //Mouseenter and mouse leave handler for contextmenu items and Subcontextmenuitems
            $(contextMenuItems).mouseenter(function () {
                if (!$(this).hasClass("e-disable")) {
                    contextMenu.find(".e-contextmenu-mouseover").removeClass("e-contextmenu-mouseover");
                    $(this).addClass("e-contextmenu-mouseover");
                    proxy._activeMenuItemId = $(this).attr("id");
                    proxy._showSubContextMenu(this, args.contextMenuItems);
                }
            });

            e.preventDefault();
        },

        //Show SubContext menu for selected Menu items
        _showSubContextMenu: function (element, menuItems) {
            var model = this.model,
                proxy = this,
                currentMenuItem = [],
                menuId = $(element).attr("id"),
                subContextMenu, subContextMenuUList, subMenuItems = [], subContextMenuItems;

            subMenuItems = menuItems.filter(function (value) {
                if (value.menuId == menuId)
                    currentMenuItem = value;
                if (value.parentMenuId == menuId)
                    return true;
            });

            if (!currentMenuItem.parentMenuId)
                $(".e-innerContextmenu").remove();

            if (currentMenuItem.parentMenuId) {
                this._removeContextMenu(currentMenuItem, menuItems);
            }

            if (subMenuItems.length > 0) {
                subContextMenu = ej.buildTag("div.e-innerContextmenu", "", {
                    'display': 'table',
                    'position': 'absolute',
                    'border-width': '1px',
                    'border-style': 'solid',
                    'z-index': '10034',
                }, { "id": this._id + "_SubContextMenu" + menuId });

                subContextMenuUList = ej.buildTag("ul", $.render[proxy._id + "contextMenuTemplate"](subMenuItems), {
                    'margin': '0px',
                    'padding-left': '0px'
                }, {
                    'data-icon': false,
                    'type': 'none',
                    'data-role': 'list-divider'
                });
                subContextMenu.append(subContextMenuUList);
                $(document.body).append(subContextMenu);
                var subMenuOffset = proxy._getSubContextMenuPosition(element, subContextMenu);
                $(subContextMenu).css({ "top": subMenuOffset.top, "left": subMenuOffset.left });
                subContextMenuItems = subContextMenu.find(".e-menuitem");
                subContextMenuItems.css({ 'width': $(subContextMenu).width() + 2 });
                $(subContextMenuItems).mouseenter(function () {
                    if (!$(this).hasClass("e-disable")) {
                        proxy._showSubContextMenu(this, menuItems);
                        $(this).closest(".e-innerContextmenu").find(".e-contextmenu-mouseover").removeClass("e-contextmenu-mouseover");
                        $(this).addClass("e-contextmenu-mouseover");
                        proxy._activeMenuItemId = $(this).attr("id");
                    }
                });
                proxy._on(subContextMenu, "contextmenu", function (argsE) {
                    argsE.preventDefault();
                });
                $(subContextMenuItems).click(function () {
                    proxy._contextMenuClickHandler(this);
                });
            }
        },
        _removeContextMenu: function (menuItem, menuItems) {

            var currentMeuItemContainer = $("#" + this._id + "_SubContextMenu" + menuItem.parentMenuId),
                expandedMenu = $(currentMeuItemContainer).find(".e-contextmenu-mouseover");
            if ($(expandedMenu).length > 0 ) {
                var innerMenu = menuItems.filter(function (value) {
                    if (value.menuId == $(expandedMenu).attr("id"))
                        return true;
                });
                if (innerMenu.length > 0) {
                    var nextLevelItem = menuItems.filter(function (value) {
                        if (value.parentMenuId == innerMenu[0].menuId)
                            return true;
                    });
                    if (nextLevelItem.length > 0)
                        this._removeContextMenu(nextLevelItem[0], menuItems);
                }
                $("#" + this._id + "_SubContextMenu" + $(expandedMenu).attr("id")).remove();
            }
        },
        _getSubContextMenuPosition: function (element, subMenu) {
            var model = this.model,
                subContextMenuWidth = $(subMenu).width(),
                subContextMenuHeight = $(subMenu).height(),
                elementOffset = this.getOffsetRect(element), subMenuOffset = { top: "", left: "" },
                parentElement = $(element).closest(".e-contextmenu"),
                posx, posy,
                contextMenuWidth;
            if (parentElement.length == 0)
                parentElement = $(element).closest(".e-innerContextmenu");
            contextMenuWidth = $(parentElement).width();
            subMenuOffset.top = elementOffset.top - 1;
            subMenuOffset.left = elementOffset.left + $(parentElement).width() + 1;
            posx = subMenuOffset.left;

            //Edge detection for context menu
            var treeGridOffset = this.getOffsetRect(this.element[0]);
            treeGridOffset.bottom = treeGridOffset.top + this.element[0].offsetHeight;
            treeGridOffset.right = treeGridOffset.left + $(this.element).width();
            if (treeGridOffset.left > posx || (treeGridOffset.right < (posx + subContextMenuWidth))) {
                if (treeGridOffset.right < (posx + subContextMenuWidth)) {
                    posx = posx - contextMenuWidth - subContextMenuWidth - 5;
                }
                if (posx > 0) {
                    subMenuOffset.left = posx;
                }
            }
            if (treeGridOffset.bottom < subMenuOffset.top + subContextMenuHeight) {
                var tempPosY = (subMenuOffset.top + subContextMenuHeight) - treeGridOffset.bottom;
                tempPosY = subMenuOffset.top - tempPosY - 2;
                if (tempPosY > 0) {
                    subMenuOffset.top = tempPosY;
                }
            }
            return subMenuOffset;
        },
        _contextMenuClickHandler: function (target)
        {
            var choice = $(target).attr('id'),
                proxy = this;
            if (!$(target).hasClass("e-disable") && $(target).find(".e-expander").length == 0) {
                switch (choice) {
                    case "Delete":
                        proxy._contextMenuOperations("Delete");
                        break;
                    case "Above":
                        proxy._contextMenuOperations("Above");
                        break;
                    case "Below":
                        proxy._contextMenuOperations("Below");
                        break;
                    case "Add":
                        proxy._contextMenuOperations("Add");
                        break;
                    case "Edit":
                        proxy._contextMenuOperations("Edit");
                        break;
                    case "Save":
                        proxy._contextMenuOperations("Save");
                        break;
                    case "Cancel":
                        proxy._contextMenuOperations("Cancel");
                        break;
                    default:
                        proxy._contextMenuOperations(choice);
                        break;
                }
            }
        },

        //Call custom context menu event handlers
        _triggerMenuEventHandler: function (menuId, eventArgs) {
            var proxy = this,
                contextMenuItems = proxy._contextMenuItems,
                currentMenuItemCollection, menuItem;

            if (!ej.isNullOrUndefined(contextMenuItems)) {
                currentMenuItemCollection = contextMenuItems.filter(function (value) {
                    //convert menu id to string if it is given as number
                    if (value.menuId.toString() === menuId)
                        return true;
                });

                if (currentMenuItemCollection.length > 0) {
                    menuItem = currentMenuItemCollection[0];
                    var fn = menuItem.eventHandler;
                    if (fn) {
                        if (typeof fn === "string") {
                            fn = ej.util.getObject(fn, window);
                        }
                        if ($.isFunction(fn)) {
                            args = ej.event("customContextMenuHandler", this.model, eventArgs);
                            fn.call(this, args);
                        }
                    }

                }
            }
        },

        _createContextMenuTemplate: function () {
            var proxy = this;
            var helpers = {};
            helpers["_" + proxy._id + "getHeaderName"] = $.proxy(proxy._getHeaderName, proxy);

            $.views.helpers(helpers);

            var menuItemList = "<li style='list-style-type:none;margin:0px;'>";
            var listChild = "<div class='e-menuitem {{if disable}}e-disable{{/if}}' id={{:menuId}}  style='display:table;cursor:{{if disable}}default{{else}}pointer{{/if}};min-width:100px;'>" +
                            "{{if iconPath}}" +
                           "<div class='e-icon e-treegridicon' style='display:inline-block;margin-left:7px;position:relative;top:0px;" +
                            "background-image:{{:iconPath}};background-repeat:no-repeat;'/> " + 
                            "{{else}}" +
                            "<span class='e-icon {{:iconClass}} e-treegridicon' style='display:inline-block;padding:0px 5px 0px 7px;position:relative;top:0px;'/>" +
                            "{{/if}}" +
                            "<div style='display:inline-block;padding:5px;position:relative;top:-2px;'>" +
                            "<span style='font-size:12px;padding:5px;'>{{:headerText}}</span></div>" +
                            "{{if ~_" + proxy._id + "getHeaderName(#data)}}<div class='e-icon e-expander e-treegridicon' style='display:inline-block;padding:5px;float:right;position:relative;top:0px;'/> {{/if}}";

            menuItemList += listChild;
            menuItemList += "</div></li>";
            var templates = {};
            templates[proxy._id + "contextMenuTemplate"] = menuItemList;
            $.templates(templates);
        },
        _getHeaderName: function (data) {
            var childMenuItems = this._contextMenuItems.filter(function (value) {
                if (data.menuId != null && data.menuId == value.parentMenuId)
                    return true;
            });
            if (childMenuItems.length > 0) {
                return true;
            }
            return false;
        },

        // Remove the speace from column menu name for chaning name to id.

        _getColumnId: function (data) {
            return data.name.replace(/\s/g, "");
        },

        //Change the context menu based on context menu item list.
        _updateContextmenuOption: function (recordIndex) {
            //removing empty string and undefined from contextmenu items.
            Array.prototype.clean = function (deleteValue) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == deleteValue) {
                        this.splice(i, 1);
                        i--;
                    }
                }
                return this;
            };
            var proxy = this;
            
            if(proxy._isRowEdit || proxy.model.isEdit)
            {
                //Remove add, delete and edit context menu when row in edit mode.
                proxy._contextMenuItems.splice(0, 3);
            }
            else
            {
                proxy._contextMenuItems.splice(3, 2); //Remove save and cancel when row not in edit mode
                var editSetting = proxy.model.editSettings
                var contextMenuItems = $.extend(true, [], proxy._contextMenuItems);
                var contextMenuList = proxy.model.contextMenuSettings.contextMenuItems.clean("").clean(undefined);
                var contextMenuItemList = [];
                //removing duplicate conetxt menu items
                $.each(contextMenuList, function (i, el) {
                    if ($.inArray(el.toLowerCase(), contextMenuItemList) === -1) contextMenuItemList.push(el.toLowerCase());
                });
                proxy._contextMenuItems = [];
                if (recordIndex == -1) {
                    if (contextMenuItemList.indexOf("add") != -1 || contextMenuItemList.length==0)
                        proxy._contextMenuItems[0] = contextMenuItems[0];
                    if (!editSetting.allowAdding)
                        proxy._contextMenuItems[0].disable = true;
                    proxy._contextAddMenuIndex = 0;
                }
                //Adding default context menu when user not specify the context menu items.
                else if (contextMenuItemList.length == 0)
                {
                    proxy._contextMenuItems[0] = contextMenuItems[0];
                    if (!editSetting.allowAdding)
                        proxy._contextMenuItems[0].disable = true;
                    proxy._contextAddMenuIndex = 0;
                    proxy._contextMenuItems[1] = contextMenuItems[2];
                    if (!editSetting.allowDeleting)
                        proxy._contextMenuItems[1].disable = true;
                    proxy._contextMenuItems.push.apply(proxy._contextMenuItems, proxy._subContextMenuItems);
                }
                //Change the context menu order based on context menu items order
                else {
                for(i=0;i<contextMenuItemList.length;i++)
                {
                    var item=contextMenuItemList[i];
                    switch(item.toLowerCase())
                    {
                        case "add":
                            proxy._contextMenuItems[i] = contextMenuItems[0];
                            proxy._contextAddMenuIndex = i;
                            if (!editSetting.allowAdding)
                                proxy._contextMenuItems[i].disable = true;
                            break;
                        case "delete":
                            proxy._contextMenuItems[i] = contextMenuItems[2];
                            if (!editSetting.allowDeleting)
                                proxy._contextMenuItems[i].disable = true;
                            break;
                        case "edit":
                            proxy._contextMenuItems[i] = contextMenuItems[1];
                            if (!editSetting.allowEditing)
                                proxy._contextMenuItems[i].disable = true;
                            break;
                    }
                }
                proxy._contextMenuItems.push.apply(proxy._contextMenuItems, proxy._subContextMenuItems);
                }
            }
        },
        //Assign default value to columns based on column edit type
        _setInitialData:function()
        {
            var eventArgs = {}, proxy = this,
               model = proxy.model, data = [], item, initialData = {};
            for (i = 0; i < model.columns.length; i++)
            {
                var column = model.columns[i];
                switch(column.editType)
                {
                    case "booleanedit":
                        initialData[column.field] = false;
                        break;
                    case "stringedit":
                        initialData[column.field] = null;
                        break;
                    case "datepicker":
                        initialData[column.field] = ej.format(new Date(), this.model.dateFormat);
                        break;
                    case "datetimepicker":
                        today = new Date();
                        initialData[column.field] = ej.format(new Date(), "MM/dd/yyyy hh:mm tt");
                        break;
                    case "numericedit":
                        initialData[column.field] = 0;
                        break;
                    default:
                        initialData[column.field] = null;

            }
            }
            data.push(initialData);
            if (proxy.dataSource() == null || proxy.dataSource().length == 0 || model.flatRecords.length == 0) {
                
                item = proxy._createRecord(data[0], 0, null);
                item.index = 0;
                proxy._addRecord(item, ej.TreeGrid.RowPosition.Top);
                proxy._clearContextMenu();
                this._removeDetailsRow();
            }
        },
        
        // Perform add new row operation
           
        _subContextMenuAction: function (item, index, position, addrow)
        {
            var proxy = this, model = proxy.model,
            eventArgs = {},
            newItem, selectionIndex;

            eventArgs.requestType = "save";
            newItem = jQuery.extend(true, {}, item.item);
            newItem[proxy.model.childMapping] = null;
            if (position == "Above") {
                proxy._addRecord(newItem, ej.TreeGrid.RowPosition.Above);
            } else if (position == "Below") {
                proxy._addRecord(newItem, ej.TreeGrid.RowPosition.Below);
            }
            proxy._clearContextMenu();
        },

        _appendEditTemplateRow: function (columns, $targetTr, index, isFrozenTr, addrow) {

            var model = this.model,
                proxy = this,
                rowHeight = proxy.model.rowHeight, $mainTd,
                $form, $frozenForm, $table, $detailCell, visibleColumns = [],
                updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;

            this._editedRowIndex = index;
            $table = ej.buildTag('table.e-table', "", {}, { "cellspacing": "0px", "cellpadding": "0" });
            if (this._frozenColumnsLength > 0) {
                if (isFrozenTr) {
                    $form = ej.buildTag("form.#" + proxy._id + "EditFrozenForm", "", { "margin": "-2px" }, {});
                    $table.append(proxy._$gridHeaderContainer.find("#e-frozenheaderdiv" + proxy._id).find('colgroup').clone());
                } else {
                    $form = ej.buildTag("form.#" + proxy._id + "EditForm", "", { "margin": "-2px" }, {});
                    $table.append(proxy._$gridHeaderContainer.find("#e-movableheaderdiv" + proxy._id).find('colgroup').clone());
                }
            } else {
                $form = ej.buildTag("form.#" + proxy._id + "EditForm", "", { "margin": "-2px" }, {});
                $table.append(proxy.getHeaderTable().find('colgroup').clone());
            }


            if (!isFrozenTr && model.showDetailsRow && model.showDetailsRowInfoColumn && model.detailsTemplate) {
                $detailCell = $targetTr.find("td.e-detailsrowcell");
            }

            $targetTr.empty();
            if (addrow) {
                $targetTr.addClass('e-addedrow');
                if ($targetTr.next('tr').hasClass('e-detailsrow'))
                    $targetTr.next('tr').remove();
            }
            else
                $targetTr.addClass('e-rowedit');

            visibleColumns = columns.filter(function (value) {
                return !(value.visible === false);
            });
            $mainTd = ej.buildTag("td", "", {}, { "colspan": $detailCell ? visibleColumns.length + 1 : visibleColumns.length });
            if (model.allowSelection)
                var $tr = ej.buildTag('tr.e-treegridrows e-selectionbackground e-active', { "height": rowHeight }, {});
            else
                var $tr = ej.buildTag('tr.e-treegridrows', { "height": rowHeight }, {});
            $tbody = ej.buildTag('tbody');
            $cellEditTemplate = proxy._cellEditTemplate;
            var columnLength = columns.length;
            for (var column = 0; column < columnLength; column++) {
                if (!ej.isNullOrUndefined(column)) {
                    if (columns[column].visible) {
                        var data = {};
                        //Create a html string for column field with specific edit type using cellEditTemplate
                        htmlString = $cellEditTemplate.find("#" + columns[column].field + "_CellEdit").html();
                        data[columns[column]["field"]] = updatedRecords[index][columns[column]["field"]];
                        if (columns[column]["editType"] == "dropdownedit" && data[columns[column]["field"]] == false)
                            data[columns[column]["field"]] = data[columns[column]["field"]].toString();
                        $element = $($.templates(htmlString).render(data));
                        var $td = ej.buildTag('td.e-rowcell e-editedcell', "", { "height": rowHeight, "vertical-align": "middle;", "overflow": "hidden" }, {});

                        if (columns[column].allowEditing == false)
                            $element.attr('disabled', true).addClass('e-disable');

                        if ($element.get(0).tagName == "SELECT") {
                            $element.val(data[columns[column]["field"]]);
                            $element.val() == null && $element.val($element.find("option").first().val());
                        }
                        $tr.append($td.append($element));
                        $tbody.append($tr);
                    }
                }
            }
            if ($detailCell) {
                $tr.append($detailCell);
            }
            $table.append($tbody);
            $form.append($table)
            $mainTd.append($form);
            $targetTr.append($mainTd);

        },
        //Create editable row with specific edit type.

        _editRow: function (index, addrow) {
            var proxy = this,
                model = proxy.model,
            rowHeight = model.rowHeight,
            $form, $frozenForm, $table,
            updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;

            proxy._editedRowIndex = index;

            var $targetTr = ej.TreeGrid.getRowByIndex(proxy, index);
            if ($targetTr.hasClass("e-summaryrow")) {
                proxy._editAddTools();
                return;
            }
            if (ej.isNullOrUndefined(addrow)) {
                var args = {};
                args.data = updatedRecords[index];
                args.rowElement = $targetTr;
                args.rowIndex = index;

                if (proxy._trigger("beginEdit", args)) return false;
            }
            if (this._frozenColumnsLength > 0) {
                proxy._appendEditTemplateRow(proxy._frozenColumns, $($targetTr[0]), index, true, addrow);
                proxy._appendEditTemplateRow(proxy._unFrozenColumns, $($targetTr[1]), index, false, addrow);
            } else {
                proxy._appendEditTemplateRow(model.columns, $($targetTr), index, false, addrow);
            }
            proxy._isRowEdit = true;
            proxy._setoffsetWidth();
            proxy._editAddTools();
            proxy._refreshEditForm();
            model.selectedItem = model.updatedRecords[index];
        },

        //Creating column chooser menu

        _renderColumnChooser: function () {
            var proxy = this,
                $outerDiv = ej.buildTag("div.e-columnSelector", '',"", { id: this._id + "ccDiv" });
            $("#" + proxy._id + "ccDiv_wrapper").remove();
            proxy._renderColumnChooserList(false);
            $outerDiv.append(proxy._columnChooserList);
            $outerDiv.insertAfter(proxy.element);
            $outerDiv.data("columnMenuDialog", "TreeGrid");
            $outerDiv.ejDialog({ showOnInit: false, allowKeyboardNavigation: false, enableResize: false, "enableRTL": false, showHeader: false, width: "auto",
                                 position: { X: 1, Y: 1 }, enableAnimation: false, minWidth:"0px", minHeight:"0px" });
            $("#" + proxy._id + "ccDiv_wrapper").removeClass("e-dialog").removeClass("e-shadow").find("div.e-dialog-scroller").css("height", "100%").removeClass("e-widget-content");
        },

        /*  Creating Column Chooser menu list with column header name
		    argument refresh in boolean data type
		    If it is false, rendering the column chooser list
            If is is true, rerendering the column chooser list
        */

        _renderColumnChooserList: function (refresh, headerText) {
            var proxy = this,
                length = proxy.model.columns.length,
                columns = proxy.model.columns,
                $listBox = ej.buildTag("div", '', { 'margin-left': '0px', "width": "auto" });
            for (var index = 0; index < length; index++) {
                if (proxy.model.treeColumnIndex != index) {
                    var column = columns[index];
                    if (!ej.isNullOrUndefined(column)) {
                        var $innerDiv = ej.buildTag('div', '',"", { 'class': 'e-columnMenuListDiv' }),
                            styleAttr = {},
                            colValue = ej.isNullOrUndefined(column.headerText) ? column.field : column.headerText,
                            $input = ej.buildTag('input', '', styleAttr, { 'id': proxy._id+"_columnMenu_"+column.field, 'value': colValue, 'type': 'checkbox' }),
                            label = ej.buildTag('label', colValue, { 'font-size': '12px', "width": "auto" }, { 'for': proxy._id + "_columnMenu_" + column.field });
                        $innerDiv.append($input);
                        $innerDiv.append(label);
                        $innerDiv.data("column", column.headerText);
                        $listBox.append($innerDiv);
                        if (column.headerText == headerText)
                            $innerDiv.addClass("e-columnmenuselection");
                        $input.ejCheckBox({
                            checked: !ej.isNullOrUndefined(column.visible) ? column.visible : true,
                            change: function(args)
                            {
                                if (!args.isChecked)
                                    proxy.hideColumn(args.model.value);
                                else
                                    proxy.showColumn(args.model.value);
                            }
                        });
                    }
                }
            }
            if (!refresh) 
                proxy._columnChooserList = $listBox;
            else {
                proxy._columnChooserList.empty().append($listBox.children());
                proxy._focusTreeGridElement();
            }
            var columnChooserListItem = proxy._columnChooserList.find("div.e-columnMenuListDiv");
            $(columnChooserListItem).mouseenter(function () {
                columnChooserListItem.removeClass("e-columnmenuselection");
                $(this).addClass("e-columnmenuselection");
            });
        },

        //Template for column menu

        _createColumnMenuTemplate:function()
        {
            var proxy = this;
            var columnMenuList = "<li style='list-style-type:none;margin:1px;'>" +
                                 "<div class='e-columnmenuitem{{if enabled==false}} e-disable{{/if}}' style='display:table;cursor:pointer'" +
                                    " id='" + proxy._id + "_{{:menuId}}Chooser'>" +
                                "<div class='e-icon {{:icon}} e-treegridicon' style='display:inline-block;padding:5px;'></div>" +
                                "<div style='display:inline-block;font-size:12px;padding:5px;'>" +
                                "<span>{{:name}}</span></div>" +
                                "{{if (menuId =='Columns')}}<div class='e-icon e-expander e-treegridicon' style='display:inline-block;padding:5px;float:right;'/> {{/if}}" +
                                "{{if menuId == 'RenameColumn' || menuId == 'SortDescending'}}<hr style='margin:1px;border-width:1px 0px 0px 0px;border-style:solid;border-color: #c8c8c8'>{{/if}}" +
                                "</div>" +
                                "</li>";            
            var templates = {};
            templates[proxy._id + "columnMenuTemplate"] = columnMenuList;
            $.templates(templates);
        },

        //Creating Column Menu

        _renderColumnMenu: function (e) {
            var proxy = this,
                model = proxy.model,
                posX = columnListPosX = posY = 0,
                $target = $(e.target),
                targetWidth = targetHeight = 0,
                columnMenuItems = [],
                columnChooserListIndex = 0,
                targetWidth = $target[0].offsetWidth,
                targetHeight = $target[0].offsetHeight,
                columnMenuText = proxy._columnMenuTexts,
                columnFieldName = $.trim($target.prev("div.e-headercelldiv").attr("ej-mappingname")),
                column = proxy.getColumnByField(columnFieldName),
                allowSorting = column.allowSorting == undefined ? true : column.allowSorting;
            proxy._clearColumnMenu();
            proxy._columnMenuTarget = $target;
            /* save edited value before rendering contextmenu on non edited cell*/
            if (model.isEdit)
                this.saveCell();
            else if (this._isRowEdit)
                this._saveRow();

            if (model.showColumnChooser && model.showColumnOptions) {
                var isInsert = proxy._enableDisableInsertLabel();
                columnMenuItems.push({ "name": columnMenuText["insertColumnLeft"], "icon": "e-column-insertleft-icon", "menuId": "ColumnLeft", enabled: isInsert });
                columnMenuItems.push({ "name": columnMenuText["insertColumnRight"], "icon": "e-column-insertright-icon", "menuId": "ColumnRight", enabled: isInsert });
                columnMenuItems.push({ "name": columnMenuText["deleteColumn"], "icon": "e-column-delete-icon", "menuId": "DeleteColumn", enabled: proxy._enableDisableDEL(column) });
                columnMenuItems.push({ "name": columnMenuText["renameColumn"], "icon": "e-column-rename-icon", "menuId": "RenameColumn" });
            }
            if (model.allowSorting && allowSorting)
            {
                columnMenuItems.push({ "name": columnMenuText["sortAscendingText"], "icon": "e-columnmenu-ascending", "menuId": "SortAscending" });
                columnMenuItems.push({ "name": columnMenuText["sortDescendingText"], "icon": "e-columnmenu-descending", "menuId": "SortDescending" });
            }
            if (model.showColumnChooser) {
                columnChooserListIndex = columnMenuItems.length;
                columnMenuItems.push({ "name": columnMenuText["columnsText"], "icon": "e-columnchooser-icon", "menuId": "Columns" });
            }

            if (!model.isFromGantt) {
                if (column.allowFreezing || (proxy._allowFreezingDefault && ej.isNullOrUndefined(column.allowFreezing))) {
                    var enableFreeze, enableFreezeBefore = false;
                    /*Check all other columns are in frozen*/
                    if (proxy._frozenColumnsLength == model.columns.length - 1 && !column.isFrozen)
                        enableFreeze = true;

                    /*Check frozen column width and container width */
                    var frozenWidth = this._getFrozenColumnWidth(),
                        columnIndex = model.columns.indexOf(column);
                    frozenWidth = frozenWidth + this.columnsWidthCollection[columnIndex] + 18;
                    if (frozenWidth > this._gridWidth)
                        enableFreeze = true;

                    columnMenuItems.push({ "name": columnMenuText["freezeText"], "icon": "e-freezecolumn-icon", "menuId": "FreezeColumns", enabled: enableFreeze ? false : !column.isFrozen });
                    columnMenuItems.push({ "name": columnMenuText["unfreezeText"], "icon": "e-unfreezecolumn-icon", "menuId": "UnfreezeColumns", enabled: (column.isFrozen == true) });
                    if (model.columns.indexOf(column) != 0 && model.columns.indexOf(column) > this._frozenColumnsLength)
                        enableFreezeBefore = true;

                    /*Check frozen column width and container width */
                    frozenWidth = this._getFrozenColumnWidth(columnIndex);
                    frozenWidth = frozenWidth + 18;
                    if (frozenWidth > this._gridWidth)
                        enableFreezeBefore = false;
                    columnMenuItems.push({ "name": columnMenuText["freezePrecedingColumnsText"], "icon": "e-freezecolumnbefore-icon", "menuId": "FreezePrecedingColumns", enabled: enableFreezeBefore });
                }
            }
            var position = proxy.getOffsetRect($target[0]);            
            var elementPosition = proxy.getOffsetRect(proxy.element[0]);           
            if (!proxy.model.isFromGantt)
                posY = position.top + targetHeight;
            else
                posY = position.top + targetHeight;            
            proxy._columnChooserListIndex = columnChooserListIndex;
            var $outerDiv = ej.buildTag("div.e-columnmenu", "", {
                "border-width": "1px",
                "border-style": "solid",
                "display": "table",
                "position": "absolute", "top": posY, "z-index": "10033"
            }, { id: proxy._id + "_ColumnMenu" }),
                $outerUl = ej.buildTag("ul", "", { "padding": "0px", "margin": "0px" }, {}),                                       
                $columnMenuList = $.render[proxy._id + "columnMenuTemplate"](columnMenuItems);
            $outerUl.append($columnMenuList);
            $outerDiv.append($outerUl);
            $(document.body).append($outerDiv);
            var columnMenuHeight = $outerDiv.height(),
                columnMenuWidth = $outerDiv.width();
            posX = position.left + targetWidth - columnMenuWidth;
            if (posX <= elementPosition.left)
                posX = elementPosition.left;
            columnListPosX = posX + columnMenuWidth + 4;
            proxy._columnListPosX = columnListPosX;
            $outerDiv.css({ 'left': posX })
            $outerDiv.find(".e-columnmenuitem").css({ 'width': columnMenuWidth });

            //Edge detection for column menu
            var element = !model.isFromGantt ? $(this.element) : $(this.element).closest(".e-gantt"),
                containerOffset = this.getOffsetRect(element[0]);
            containerOffset.bottom = containerOffset.top + element[0].offsetHeight;
            containerOffset.right = containerOffset.left + $(element).width();

            $("#" + proxy._id + "_ColumnsChooser").mouseenter(function () {
                proxy._updateColumnMenuVisibility();
                var columnchooser = $("#" + proxy._id + "ccDiv").ejDialog("instance"),
                    columnChooserList = $("#" + proxy._id + "ccDiv_wrapper"),
                    columnChooserMenuList = columnChooserList.find("div.e-columnMenuListDiv");
                columnchooser.open();
                if (containerOffset.right < columnListPosX + columnChooserList.width()) {
                    columnListPosX = columnListPosX - columnChooserList.width() - columnMenuWidth - 4;
                    if (columnListPosX <= (columnMenuWidth - 4)) {
                        columnListPosX = posX + columnMenuWidth - 4;
                    }
                }
                proxy._columnListPosX = columnListPosX;
                var position = {
                    X:columnListPosX,
                    Y: posY + columnChooserListIndex * 30 + (columnChooserListIndex == 0 ? 0 : 1)
                }
                columnchooser.option({ "position": position });
                columnChooserList.css("z-index", "10033");
                columnChooserMenuList.removeClass("e-columnmenuselection");
                columnChooserMenuList.eq(0).addClass("e-columnmenuselection");
                proxy._focusTreeGridElement();
            });
            $("#" + proxy._id + "_SortAscendingChooser," + "#" + proxy._id + "_SortDescendingChooser," +
              "#" + proxy._id + "_FreezeColumnsChooser," + "#" + proxy._id + "_UnfreezeColumnsChooser," +
              "#" + proxy._id + "_FreezePrecedingColumnsChooser," + "#" + proxy._id + "_ColumnLeftChooser," +
              "#" + proxy._id + "_ColumnRightChooser," + "#" + proxy._id + "_DeleteColumnChooser," +
              "#" + proxy._id + "_RenameColumnChooser").mouseenter(function () {
                $("#" + proxy._id + "ccDiv").ejDialog("close");
            });
            $("#" + proxy._id + "_SortAscendingChooser").click(function () {
                if (model.allowMultiSorting)  proxy._multiSortRequest = true;
                proxy.sortColumn(column.headerText, ej.sortOrder.Ascending);
                proxy._multiSortRequest = false;
            });
            $("#" + proxy._id + "_SortDescendingChooser").click(function () {
                if(model.allowMultiSorting) proxy._multiSortRequest = true;
                proxy.sortColumn(column.headerText, ej.sortOrder.Descending);
                proxy._multiSortRequest = false;
            });
            $("#" + proxy._id + "_FreezeColumnsChooser").click(function () {
                if (!$(this).hasClass("e-disable"))
                    proxy.freezeColumn(column.field, true);
            });
            $("#" + proxy._id + "_UnfreezeColumnsChooser").click(function () {
                if (!$(this).hasClass("e-disable"))
                    proxy.freezeColumn(column.field, false);
            });
            $("#" + proxy._id + "_FreezePrecedingColumnsChooser").click(function () {
                if (!$(this).hasClass("e-disable"))
                    proxy.freezePrecedingColumns(column.field);
            });

            $("#" + proxy._id + "_ColumnLeftChooser").click(function () {
                if (!$(this).hasClass("e-disable"))
                    proxy.insertColumnChooser(column, "left");
                else
                    return false;
            });
            $("#" + proxy._id + "_ColumnRightChooser").click(function () {
                if (!$(this).hasClass("e-disable"))
                    proxy.insertColumnChooser(column, "right");
                else
                    return false;
            });

            $("#" + proxy._id + "_DeleteColumnChooser").click(function () {
                if (!$(this).hasClass("e-disable")) {
                    proxy._targetColumnIndex = model.columns.indexOf(column);
                    proxy._updateConfirmDialog.ejDialog("open");
                    proxy._clearColumnMenu();
                }
                else
                    return false;
            });

            $("#" + proxy._id + "_RenameColumnChooser").click(function () {
                proxy._targetColumnIndex = model.columns.indexOf(column);
                proxy._renderColumnRenameDialog(column);
                proxy._columnRenameDialog.ejDialog("open");
                proxy._clearColumnMenu();
            });

            var columnMenu = $("#" + proxy._id + "_ColumnMenu"),
                columnMenuItem = columnMenu.find("div.e-columnmenuitem");
            columnMenuItem.eq(0).addClass("e-columnmenuselection");
            $(columnMenuItem).mouseenter(function () {
                if (!$(this).hasClass("e-disable")) {
                    columnMenuItem.removeClass("e-columnmenuselection");
                    $(this).addClass("e-columnmenuselection");
                }
            });
        },

        //Clear the column menu and menu list

        _clearColumnMenu:function()
        {
            var proxy = this;
            $("div[id$='_ColumnMenu']").remove();
            $("div[id$='ccDiv']").each(function () {
                if ($(this).data("columnMenuDialog") == "TreeGrid")
                    $(this).data("ejDialog") && $(this).ejDialog("close");
            });
            $(".e-columnicon").data("isClicked", false);
        },

        //Enabling or disabling delete button of columnchooser
        _enableDisableDEL: function (colItem) {
            var proxy = this, model = proxy.model,
                fieldName = colItem.field,
                columnIndex = model.columns.indexOf(colItem);
            if (model.isFromGantt) {
                if (fieldName == "taskId" || fieldName == "taskName" || fieldName == "startDate" || fieldName == "endDate" || (fieldName == "duration" && !model.endDateMapping) || columnIndex == model.treeColumnIndex)
                    return false;
                else
                    return true;
            }
            else {
                if (columnIndex == model.treeColumnIndex)
                    return false;
                else
                    return true;
            }
        },

        //Enabling or disabling Insert column label columnchooser
        _enableDisableInsertLabel: function () {
            var proxy = this, model = proxy.model;
            //Block column add operation while frozen columns Width is near to grid width
            if (!model.isFromGantt && proxy._frozenColumnsLength > 0) {
                var frozenWidth = this._getFrozenColumnWidth();
                frozenWidth = frozenWidth + 250;
                if (frozenWidth > this._gridWidth)
                    return false;
                else
                    return true;
            }
            else
                return true;
        },

        //Insert column through column chooser
        insertColumnChooser: function (column, position) {
            var proxy = this, model = proxy.model;
            if ($("#" + proxy._id + "_dialogColumnAdd").length === 0) {
                var $dialogCol = ej.buildTag("div.e-dialog e-dialog-content e-shadow e-widget-content", "", { display: "none" }, { id: proxy._id + "_dialogColumnAdd" });
                proxy.element.append($dialogCol);
                proxy._on($("#" + proxy._id + "_dialogColumnAdd"),
               "click keypress", "#ColumnAddDialog_" + proxy._id + "_Ok ,#ColumnAddDialog_" + proxy._id + "_Cancel", proxy._buttonClick);
            }
            proxy.renderColumnAddDialog();
            proxy._targetColumnIndex = model.columns.indexOf(column);
            proxy._insertPosition = position;
        },

        // To change the headerText of column
        renameColumn: function (colIndex, name) {
            var proxy = this, model = proxy.model,
                columns = model.columns;
            columns[colIndex].headerText = name;
            proxy._refreshFrozenColumns();
        },

        //Method to render dialog box for renaming column
        _renderColumnRenameDialog: function (columnItem) {
            var proxy = this,
                $contentDiv = ej.buildTag('div', "", {}, { 'unselectable': 'on' }),
                $form = ej.buildTag('form', "", { 'height': 'auto', 'width': 'auto', 'font-size': '14px' }, { id: proxy._id + "ColumnRenameForm", onsubmit:"return false" });
            $buttons = ej.buildTag('span.e-buttons', "<input type='button' id=" + proxy._id + 'RenameDialogOK' + " value='" + proxy._okButtonText + "' /> "
            + "<input type='button' id=" + proxy._id + 'RenameDialogCancel' + " value='" + proxy._cancelButtonText + "' />"),
            btnDiv = ej.buildTag('div', "", { 'margin-top': '20px', 'float': 'right', 'margin-bottom': '15px', 'margin-right': '15px' }, { 'class': "e-editform-btn" });

            $innerTable = ej.buildTag('table', "", { "outline": "none" }, { 'unselectable': "on" });

            $inTr1 = ej.buildTag('tr');

            $inTd = ej.buildTag('td.editLabel', "", { "outline": "none" }, { 'unselectable': "on" });
            $inTd.append("<label style='font-weight:normal;'>" + proxy._columnDialogTitle["renameColumn"] + "</label>");

            $inTr1.append($inTd);

            $innerTable.append($inTr1);

            $inTr2 = ej.buildTag('tr');
            $inTd2 = ej.buildTag('td.e-editValue');

            $input = ej.buildTag('input.e-field e-ejinputtext',
                                            "",
                                            {},
                                            {
                                                value: columnItem.headerText,
                                                id: proxy._id + "RenameHeaderText",
                                                name: columnItem.field,
                                                dialog: "RenameHeaderText",
                                                style: "height:25px;width:210px;"
                                            });
            $inTd2.html($input);
            $inTr2.append($inTd2);
            $innerTable.append($inTr2);
            $form.append($innerTable);
            $contentDiv.append($form);

            proxy._columnRenameDialog = ej.buildTag('div', '', '', { 'title': 'Rename Column', 'id': proxy._id + 'ColumnRenameDialog' });
            btnDiv.append($buttons);
            proxy._columnRenameDialog.append($contentDiv).append(btnDiv);
            proxy.element.append(proxy._columnRenameDialog);
            $buttons.find("input").ejButton({
                cssClass: proxy.model.cssClass,
                showRoundedCorner: true,
                size: "mini",
                click: $.proxy(proxy._triggerRenameColumn, proxy)
            });
            proxy._columnRenameDialog.ejDialog({ width: "auto", minHeight: 0, minWidth: 0, showOnInit: false, enableResize: false, enableModal: true });
            $input.focus().select();
        },

        _triggerRenameColumn: function (args) {
            var proxy = this, $elem, text;
            if (args !== undefined && args.model.text == proxy._okButtonText) {
                $elem = proxy._columnRenameDialog.find("#" + proxy._id + "RenameHeaderText");
                text = $elem.val();
                proxy.renameColumn(proxy._targetColumnIndex, text);
            }
            proxy._columnRenameDialog.ejDialog("close");
        },

        //To render dialog for adding custom column
        renderColumnAddDialog: function () {

            var proxy = this, model = proxy.model, colDialogFields = model.columnDialogFields,
                args = {};

            args.requestType = "openColumnAddDialog";
            if (colDialogFields.length) {
                args.data = {};
                for (var i = 0; i < colDialogFields.length; i++) {
                    var val = colDialogFields[i];
                    args.data[val] = "";
                }
            }
            else args.data = { "field": "", "headerText": "", "editType": "" };

            if (!proxy._trigger("actionBegin", args)) {
                args.requestType = "columnAdd";
                var temp = document.createElement('div');
                $(temp).addClass("e-addedColumn");
                temp.innerHTML = $.render[proxy._id + "_ColumnAddTemplate"](args.data);
                $("#" + proxy._id + "_dialogColumnAdd").html($(temp));
                var evntArgs = {};
                evntArgs.cssClass = this.model.cssClass,
                evntArgs.enableModal = true,
                evntArgs.width = "auto",
                evntArgs.enableResize = false,
                evntArgs.contentSelector = "#" + proxy._id,
                evntArgs.rtl = proxy.model.rtl,
                evntArgs.allowKeyboardNavigation = false,
                title = proxy._columnDialogTitle["insertColumn"];
                evntArgs.title = title;
                $("#" + proxy._id + "_dialogColumnAdd").ejDialog(evntArgs);
                $("#" + proxy._id + "_dialogColumnAdd").ejDialog("open");
                proxy._clearColumnMenu();
                proxy._refreshColumnAddForm();
            }
        },

        setAddColumnFields: function () {
            var proxy = this,
                model = proxy.model;
            if (model.columnDialogFields.length) {
                proxy._addColumnFields = model.columnDialogFields;
                var tempFields = ["field", "headerText", "editType"];
                //Ensure the above 3 default fields with "model.columnDialogFields"
                for (var i = 0; i < tempFields.length; i++) {
                    if ($.inArray(tempFields[i], proxy._addColumnFields) == -1) {
                        switch (tempFields[i]) {
                            case "field":
                                proxy._addColumnFields.splice(0, 0, tempFields[i]);
                                break;
                            case "headerText":
                                proxy._addColumnFields.splice(1, 0, tempFields[i]);
                                break;
                            case "editType":
                                proxy._addColumnFields.splice(2, 0, tempFields[i]);
                                break;
                        }
                    }
                }
                //Check the "model.columnDialogFields" with allowSorting, allowFiltering and selectionType APIs
                if (model.isFromGantt) {
                    if (!model.allowSorting && proxy._addColumnFields.indexOf("allowSorting") != -1) {
                        proxy._addColumnFields.splice(proxy._addColumnFields.indexOf("allowSorting"), 1);
                    }
                    if (model.selectionMode == "row" && proxy._addColumnFields.indexOf("allowCellSelection") != -1) {
                        proxy._addColumnFields.splice(proxy._addColumnFields.indexOf("allowCellSelection"), 1);
                    }
                }
                else {
                    if (!model.allowSorting && proxy._addColumnFields.indexOf("allowSorting") != -1) {
                        proxy._addColumnFields.splice(proxy._addColumnFields.indexOf("allowSorting"), 1);
                    }
                    if (!model.allowFiltering && proxy._addColumnFields.indexOf("allowFiltering") != -1) {
                        proxy._addColumnFields.splice(proxy._addColumnFields.indexOf("allowFiltering"), 1);
                    }
                    if (model.selectionMode == "row" && proxy._addColumnFields.indexOf("allowCellSelection") != -1) {
                        proxy._addColumnFields.splice(proxy._addColumnFields.indexOf("allowCellSelection"), 1);
                    }
                }
                //Assign appropriate header text to fields
                for (var i = 0; i < proxy._addColumnFields.length; i++) {
                    switch (proxy._addColumnFields[i]) {
                        case "field":
                            proxy._addColumnFieldsTxt.push(proxy._columnDialogTexts["field"]);
                            break;
                        case "headerText":
                            proxy._addColumnFieldsTxt.push(proxy._columnDialogTexts["headerText"]);
                            break;
                        case "editType":
                            proxy._addColumnFieldsTxt.push(proxy._columnDialogTexts["editType"]);
                            break;
                        case "filterEditType":
                            proxy._addColumnFieldsTxt.push(proxy._columnDialogTexts["filterEditType"]);
                            break;
                        case "allowFiltering":
                            proxy._addColumnFieldsTxt.push(proxy._columnDialogTexts["allowFiltering"]);
                            break;
                        case "allowFilteringBlankContent":
                            proxy._addColumnFieldsTxt.push(proxy._columnDialogTexts["allowFilteringBlankContent"]);
                            break;
                        case "allowSorting":
                            proxy._addColumnFieldsTxt.push(proxy._columnDialogTexts["allowSorting"]);
                            break;
                        case "visible":
                            proxy._addColumnFieldsTxt.push(proxy._columnDialogTexts["visible"]);
                            break;
                        case "width":
                            proxy._addColumnFieldsTxt.push(proxy._columnDialogTexts["width"]);
                            break;
                        case "textAlign":
                            proxy._addColumnFieldsTxt.push(proxy._columnDialogTexts["textAlign"]);
                            break;
                        case "headerTextAlign":
                            proxy._addColumnFieldsTxt.push(proxy._columnDialogTexts["headerTextAlign"]);
                            break;
                        case "isFrozen":
                            proxy._addColumnFieldsTxt.push(proxy._columnDialogTexts["isFrozen"]);
                            break;
                        case "allowFreezing":
                            proxy._addColumnFieldsTxt.push(proxy._columnDialogTexts["allowFreezing"]);
                            break;
                        case "allowCellSelection":
                            proxy._addColumnFieldsTxt.push(proxy._columnDialogTexts["allowCellSelection"]);
                            break;
                    }                  
                }
            }
            else {
                proxy._addColumnFields = ["field", "headerText", "editType"];
                proxy._addColumnFieldsTxt = [proxy._columnDialogTexts["field"], proxy._columnDialogTexts["headerText"], proxy._columnDialogTexts["editType"]];
            }
        },

        //Method for creating cell edit type
        setColumnCelEditType: function (columnAttr) {
            var proxy = this,
                model = proxy.model,
                columns = model.columns,
                $input;
            if (columnAttr == "field" || columnAttr == "filterEditType" || columnAttr == "editType" || columnAttr == "textAlign" || columnAttr == "headerTextAlign") {
                $input = ej.buildTag('input.e-field e-dropdownlist',
                                         "",
                                         {},
                                         {
                                             value: "{{:#data." + columnAttr + "}}",
                                             id: proxy._id + columnAttr + "ColumnAdd",
                                             name: columnAttr,
                                             dialog: "ColumnAdd"
                                         });
            }
            else if (columnAttr == "headerText") {
                $input = ej.buildTag('input.e-field e-ejinputtext',
                                         "",
                                         {},
                                         {
                                             value: "{{:#data." + columnAttr + "}}",
                                             id: proxy._id + columnAttr + "ColumnAdd",
                                             name: columnAttr,
                                             dialog: "ColumnAdd"
                                         });
            }
            else if (columnAttr == "allowFiltering" || columnAttr == "allowSorting" || columnAttr == "isFrozen" || columnAttr == "allowFreezing") {
                $input = ' <input' +
                         ' type ="checkbox"' +
                         ' id="' + proxy._id + columnAttr + 'ColumnAdd"' +
                         ' dialog ="ColumnAdd"' +
                         ' name="' + columnAttr + '" edittype="booleanedit">';
            }
            else if (columnAttr == "allowFilteringBlankContent" || columnAttr == "visible") {
                $input = ' <input' +
                         ' type ="checkbox"' +
                         ' id="' + proxy._id + columnAttr + 'ColumnAdd"' +
                         ' dialog = "ColumnAdd"' +
                         ' checked = "checked"' +
                         ' name="' + columnAttr + '" edittype="booleanedit">';
            }
            else if (columnAttr == "allowCellSelection") {
                $input = ' <input' +
                         ' type ="checkbox"' +
                         ' id="' + proxy._id + columnAttr + 'ColumnAdd"' +
                         ' dialog = "ColumnAdd"' +
                         ' checked = "checked"' +
                         ' name="' + columnAttr + '" edittype="booleanedit">';
            }
            else if (columnAttr == "allowCellSelection") {
                $input = ' <input' +
                         ' type ="checkbox"' +
                         ' id="' + proxy._id + columnAttr + 'ColumnAdd"' +
                         ' dialog = "ColumnAdd"' +
                         ' checked = "checked"' +
                         ' name="' + columnAttr + '" edittype="booleanedit">';
            }
            else if (columnAttr == "width") {
                $input = ej.buildTag('input.e-numerictextbox e-field',
                                         "",
                                         {},
                                         {
                                             type: "text",
                                             value: "{{:#data." + columnAttr + "}}",
                                             id: proxy._id + columnAttr + "ColumnAdd",
                                             name: columnAttr,
                                             dialog: "ColumnAdd"
                                         });
                $input.attr("edittype", "numericedit")
            }
            return $input;
        },

        //Template for adding custom column through dialog
        columnAddDialogTemplate: function () {

            var proxy = this,
                model = proxy.model,
                columns = model.columns,
                length = columns.length,
                $inputElem;

            if (length == 0)
                return;

            proxy.setAddColumnFields();

            var $tbody = ej.buildTag('div', "", {}, { 'unselectable': 'on' });
            $form = ej.buildTag('form', "", { 'height': 'auto', 'width': 'auto', 'font-size': '14px' }, { id: proxy._id + "ColumnAddForm" });
            $table = ej.buildTag('table', "", { width: "500px" }, { 'unselectable': "on" });
            $tr = ej.buildTag('tr');
            for (var i = 0; i < proxy._addColumnFields.length; i++) {
                if ($tr.children("td").length < 2) {
                    $td = ej.buildTag('td', "", { "text-align": "left", 'padding': '5px 15px 0', 'font-weight': 'normal', "outline": "none" }, { 'unselectable': "on" });
                    $innerTable = ej.buildTag('table', "", { "outline": "none" }, { 'unselectable': "on" });

                    $inTr = ej.buildTag('tr');

                    $inTd = ej.buildTag('td.editLabel', "", { "outline": "none" }, { 'unselectable': "on" });
                    $inTd.append("<label style='font-weight:normal;'>" + proxy._addColumnFieldsTxt[i] + "</label>");

                    $inTr.append($inTd);

                    $innerTable.append($inTr);

                    $inTr2 = ej.buildTag('tr');
                    $inTd2 = ej.buildTag('td.e-editValue');

                    $inputElem = proxy.setColumnCelEditType(proxy._addColumnFields[i]);


                    $inTd2.html($inputElem);

                    $inTr2.append($inTd2);
                    $innerTable.append($inTr2);

                    $td.append($innerTable);
                    $tr.append($td);

                }
                else {
                    $table.append($tr);
                    $tr = $tempTr = ej.buildTag('tr');
                    i--;
                }

            }
            $table.append($tr);

            //Table of Dropdown data for drop down edit type
            $tr2 = ej.buildTag("tr");

            if (model.showColumnChooser) {

                $td = ej.buildTag('td', "", { "text-align": "left", 'padding': '10px 15px 0', 'font-weight': 'normal', "outline": "none" }, { colspan: 2, 'unselectable': "on" });

                $innerTable = ej.buildTag('table#' + proxy._id + 'dropdownDataTable', "", { "width": "100%", "outline": "none" }, { 'unselectable': "on" });

                $inTr3 = ej.buildTag('tr');
                $inTd3 = ej.buildTag('td.editLabel', "", { "outline": "none" }, { 'unselectable': "on" });
                $inTd3.append("<label for='dropdownData' style='font-weight:normal;'>" + proxy._columnDialogTexts["columnsDropdownData"] + "</label>");

                $inTr3.append($inTd3);
                $innerTable.append($inTr3);

                $inTr = ej.buildTag('tr');
                $inTd = ej.buildTag('td.editLabel', "", { "outline": "none" }, { 'unselectable': "on" });

                $inTd.append("<span class='e-addpre e-icon e-enable e-add-dialog' style='cursor:pointer; width: auto;'>" + proxy._columnDialogTexts["addData"] + "</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class='e-deletepre e-icon e-disable e-add-dialog' style='cursor:pointer; width: auto;'>&nbsp;&nbsp;" + proxy._columnDialogTexts["deleteData"] + "</span>");

                $inTr.append($inTd);
                $innerTable.append($inTr);

                $inTr2 = ej.buildTag('tr');
                $inTd2 = ej.buildTag('td.e-editValue');

                $preDiv = ej.buildTag("div#treegrid" + proxy._id + "dropdownData", "", { "width": "100%", "height": "150px" }, {});

                $inTd2.append($preDiv);

                $inTr2.append($inTd2);
                $innerTable.append($inTr2);

                $td.append($innerTable);
                $tr2.append($td);
                $table.append($tr2);
            }


            $form.append($table);

            $tbody = proxy.renderColumnAddDialogButton($form, $tbody);
            $.templates(proxy._id + "_ColumnAddTemplate", $tbody.html());
        },

        //button templates for column add dialog
        renderColumnAddDialogButton: function (form, tbody) {

            var btnId = "ColumnAddDialog_",
                proxy = this,
                model = proxy.model;

            var okbtn = ej.buildTag('input', "",
                 {
                     'border-radius': '3px'
                 },
                 { type: "button", id: btnId + proxy._id + "_Ok" }),
             okText = proxy._okButtonText;

            okbtn.ejButton(
                {
                    cssClass: model.cssClass,
                    text: okText,
                    width: "70"
                });

            var cancelText = proxy._cancelButtonText,
             cancelbtn = ej.buildTag('input', "",
                 {
                     'margin-left': '20px',
                     'border-radius': '3px'
                 },
                 {
                     type: "button",
                     id: btnId + proxy._id + "_Cancel"
                 });

            cancelbtn.ejButton(
                {
                    cssClass: model.cssClass,
                    text: cancelText,
                    width: "70"
                });

            var btnDiv = ej.buildTag('div', "", { 'margin-top': '20px', 'float': 'right', 'margin-bottom': '15px', 'margin-right': '15px' }, { 'class': "e-editform-btn" });

            btnDiv.append(okbtn);
            btnDiv.append(cancelbtn);
            form.appendTo(tbody);
            btnDiv.appendTo(tbody);

            return tbody;
        },

        //button click event column add dialog
        _buttonClick: function (e) {

            if (e.keyCode !== undefined && e.keyCode != 13)
                return true;

            var proxy = this,
                model = proxy.model, treeIndex = model.treeColumnIndex, setFrozen = false,
                dialogId = "ColumnAdd", $element, columnVals = {}, colFields = proxy._addColumnFields, columns = model.columns,
                insertIndex, args = {};

            if (e.target.id == "ColumnAddDialog_" + proxy._id + "_Ok") {
                var formelement = document.getElementById(proxy._id + "ColumnAddForm"), ddl;
                proxy.clearSelection();
                for (var count = 0; count < colFields.length; count++) {
                    var colField = colFields[count];
                    $element = $(formelement).find("#" + proxy._id + colField + dialogId);
                    if (colField == "editType" || colField == "filterEditType" || colField == "textAlign" || colField == "headerTextAlign") {
                        ddl = $element.data("ejDropDownList");
                        columnVals[colField] = ddl._selectedValue;
                        //To get column's dropdown data if edit type is dropdownedit
                        if (colField == "editType" && columnVals[colField] == "dropdownedit") {
                            var tableTreeGrid = $(formelement).find("#treegrid" + proxy._id + "dropdownData"),
                                tableTreeGridObj = tableTreeGrid.data("ejTreeGrid"),
                                treeData = tableTreeGridObj.model.dataSource;
                            if (treeData.length > 0)
                                columnVals["dropdownData"] = treeData;
                        }
                    }
                    else if (colField == "allowCellSelection" || colField == "allowSorting" || colField == "allowFiltering" || colField == "allowFilteringBlankContent" || colField == "visible" || colField == "isFrozen" || colField == "allowFreezing") {
                        ch = $element.data("ejCheckBox");
                        columnVals[colField] = ch._isChecked;
                    }
                    else if ($element.val() == "" && (colField == "headerText" || colField == "field")) {
                        if (colField == "field")
                            columnVals[colField] = "Column" + (model.columns.length + 1);
                        else if (colField == "headerText")
                            columnVals[colField] = "Column " + (model.columns.length + 1);
                    }
                    else
                        columnVals[colField] = $element.val();
                }
                if (proxy._insertPosition == "left")
                    insertIndex = proxy._targetColumnIndex;
                else if (proxy._insertPosition == "right")
                    insertIndex = proxy._targetColumnIndex + 1;
                //To shift and maintain treecolumn index
                if (insertIndex <= treeIndex)
                    model.treeColumnIndex = treeIndex + 1;
                //Inserting new columns between frozen columns
                if (!model.isFromGantt) {
                    if (insertIndex <= proxy._frozenColumnsLength - 1)
                        setFrozen = true;
                }
                //Inserting columns -  left or right
                var newColumnObject = {};
                if (model.isFromGantt) {
                    newColumnObject = {
                        field: columnVals.field,
                        headerText: columnVals.headerText,
                        editType: columnVals.editType,
                        allowSorting: ej.isNullOrUndefined(columnVals.allowSorting) ? null : columnVals.allowSorting,
                        visible: columnVals.visible == false ? false : true,
                        width: columnVals.width ? columnVals.width : 150,
                        textAlign: columnVals.textAlign ? columnVals.textAlign : "left",
                        headerTextAlign: columnVals.headerTextAlign ? columnVals.headerTextAlign : "left",
                        dropdownData: columnVals.dropdownData ? columnVals.dropdownData : null,
                        allowCellSelection: ej.isNullOrUndefined(columnVals.allowCellSelection) ? null : columnVals.allowCellSelection,
                    }                    
                }
                else {
                    newColumnObject = {
                        field: columnVals.field,
                        headerText: columnVals.headerText,
                        editType: columnVals.editType,
                        filterEditType: columnVals.filterEditType ? columnVals.filterEditType : "stringedit",
                        allowFiltering: ej.isNullOrUndefined(columnVals.allowFiltering) ? null : columnVals.allowFiltering,
                        allowFilteringBlankContent: ej.isNullOrUndefined(columnVals.allowFilteringBlankContent) ? null : columnVals.allowFilteringBlankContent,
                        allowSorting: ej.isNullOrUndefined(columnVals.allowSorting) ? null : columnVals.allowSorting,
                        visible: columnVals.visible == false ? false : true,
                        width: columnVals.width ? columnVals.width : 150,
                        textAlign: columnVals.textAlign ? columnVals.textAlign : "left",
                        headerTextAlign: columnVals.headerTextAlign ? columnVals.headerTextAlign : "left",
                        isFrozen: (columnVals.isFrozen == true || setFrozen == true) ? true : false,
                        allowFreezing: ej.isNullOrUndefined(columnVals.allowFreezing) ? null : columnVals.allowFreezing,
                        dropdownData: columnVals.dropdownData ? columnVals.dropdownData : null,
                        allowCellSelection: ej.isNullOrUndefined(columnVals.allowCellSelection) ? null : columnVals.allowCellSelection,
                    }
                }
                args.requestType = "insertColumn";
                args.columnObject = newColumnObject;
                args.insertIndex = insertIndex;
                if (!proxy._trigger("actionComplete", args)) {
                    columns.splice(args.insertIndex, 0, args.columnObject);
                    proxy._refreshFrozenColumns();
                }
                $("#" + proxy._id + "_dialogColumnAdd").ejDialog("close");
            }
            else if (e.target.id == "ColumnAddDialog_" + proxy._id + "_Cancel") {
                $("#" + proxy._id + "_dialogColumnAdd").ejDialog("close");
            }
            return false;
        },

        //REFRESH THE EDITED FORM
        _refreshColumnAddForm: function () {
            var proxy = this,
               $form = $("#" + proxy._id + "ColumnAddForm"),
               $formElement = $form.find("input,select"),
               i = 0,
               elementFocused = false,
               length = $formElement.length,
               $element, inputWidth,
               model = proxy.model,
               width,
               params = {},
               value,
               columnPpty,
               customParams,
               toformat,
               formatVal,
               tableTreeGridId,
               dropdownDataTable,
               allColFields = [],
               rowHeight = proxy.model.rowHeight,
               cellEditType;


            for (i; i < length; i++) {

                $element = $formElement.eq(i);
                inputWidth = 210;

                columnPpty = $element.prop("name");

                if ($element.hasClass("e-dropdownlist")) {
                    if (columnPpty == "field") {
                        var fieldData = [], reqFields = [];

                        if (model.columns.length) {
                            allColFields = $.map(model.columns, function (col) {
                                if (model.isFromGantt)
                                    return col.mappingName ? col.mappingName : col.field;
                                else
                                    return col.field;
                            });
                        }

                        //getting all the fields of datasource
                        if (!proxy._dataSourcefields.length) {
                            proxy._dataSourcefields = $.extend(true, [], allColFields);
                            proxy.getAllDataSourceFields();
                        }
                        //comaparing and taking the non column fields alone for add column dialog - fields
                        for (k = 0; k < proxy._dataSourcefields.length; k++) {
                            if ($.inArray(proxy._dataSourcefields[k], allColFields) == -1)
                                reqFields.push(proxy._dataSourcefields[k]);
                        }

                        for (var fd = 0; fd < reqFields.length; fd++) {
                            fieldData.push({ "id": fd + 1, "text": reqFields[fd] });
                        }
                        $element.ejDropDownList({
                            width: inputWidth,
                            dataSource: fieldData,
                            fields: {
                                id: "id",
                                text: "text",
                                value: "text"
                            },
                        });
                    }
                    else if (columnPpty == "editType" || columnPpty == "filterEditType") {
                        var fieldData = [
                            { "id": "1", "text": "String", "value": "stringedit" }, { "id": "2", "text": "Numeric", "value": "numericedit" },
                            { "id": "3", "text": "Date Picker", "value": "datepicker" }, { "id": "4", "text": "Date Time Picker", "value": "datetimepicker" },
                            { "id": "5", "text": "Dropdown", "value": "dropdownedit" }, { "id": "6", "text": "Boolean", "value": "booleanedit" }
                        ];
                        $element.ejDropDownList({
                            width: inputWidth,
                            dataSource: fieldData,
                            fields: {
                                id: "id",
                                text: "text",
                                value: "value"
                            },
                            selectedIndex: 0,
                            change: function (args) {
                                if (dropdownDataTable.hidden == true && args.value == "dropdownedit")
                                    dropdownDataTable.hidden = false;
                                else if (dropdownDataTable.hidden == false && args.value != "dropdownedit")
                                    dropdownDataTable.hidden = true;
                            }
                        });
                    }
                    else if (columnPpty == "textAlign" || columnPpty == "headerTextAlign") {
                        var fieldData1 = [
                            { "id": "1", "text": "Left", "value": "left" }, { "id": "2", "text": "Right", "value": "right" },
                            { "id": "3", "text": "Center", "value": "center" }];

                        $element.ejDropDownList({
                            width: inputWidth,
                            dataSource: fieldData1,
                            fields: {
                                id: "id",
                                text: "text",
                                value: "value"
                            },
                            selectedIndex: 0
                        });
                    }
                }
                else if ($element.hasClass("e-numerictextbox") && columnPpty == "width") {

                    value = $element.val();
                    params.width = inputWidth;
                    params.showSpinButton = true;
                    params.cssClass = model.cssClass;
                    params.maxValue = 250;
                    params.minValue = 30;

                    if (value.length)
                        params.value = parseFloat(value);
                    else
                        params.value = 150;
                    
                    $element.ejNumericTextbox(params);
                }
                else if (columnPpty == "allowCellSelection" || columnPpty == "allowFiltering" || columnPpty == "allowFilteringBlankContent" || columnPpty == "allowSorting" || columnPpty == "visible" || columnPpty == "isFrozen" || columnPpty == "allowFreezing") {

                    var controlArgs = {};
                    controlArgs.cssClass = model.cssClass;
                    controlArgs.size = "small";
                    $element.ejCheckBox(controlArgs);
                }
                else {
                    if ($element.prop('tagName') == "INPUT")
                        $element.outerWidth(inputWidth).height(25);
                }

                if (!$element.is(":disabled") && !elementFocused && (!$element.is(":hidden") || typeof $element.data("ejDropDownList") == "object")) {
                    if (!proxy._isEnterKeyPressed) {
                        proxy._focusElements($element.closest('td'));
                        elementFocused = true;
                    }
                }
            }

            tableTreeGridId = "#treegrid" + proxy._id + "dropdownData";
            //Render dropdown data table for column add dialog 
            if ($(tableTreeGridId).length) {
                var ds = [];

                $(tableTreeGridId).ejTreeGrid({
                    dataSource: ds,
                    allowSorting: false,
                    allowAdding: true,
                    columns: [{ headerText: proxy._columnDialogTexts["dropdownTableText"], field: "text", editType: ej.TreeGrid.EditingType.String, width: "150px" },
                              { headerText: proxy._columnDialogTexts["dropdownTableValue"], field: "value", editType: ej.TreeGrid.EditingType.String, width: "150px" }],
                    enableAltRow: true,
                    allowColumnResize: true,
                    editSettings: {
                        allowAdding: true,
                        allowDeleting: true,
                        allowEditing: true,
                        editMode: "cellEditing",
                    },
                    locale: model.locale,
                    treeColumnIndex: 5,
                    emptyRecordText: "Add values for dropdown",
                    rowSelected: function (args) {
                        if (args.data) {
                            $('.e-deletepre').addClass('e-enable').removeClass('e-disable');
                            $(".e-deletepre").bind("click", $.proxy(proxy._deleteDropDownRow, proxy, $(tableTreeGridId)));
                        }
                    },

                });
                //Hide the dropdown data table while initializing
                dropdownDataTable = $form.find("#" + proxy._id + "dropdownDataTable").parent()[0];
                dropdownDataTable.hidden = true;
                //Enable the click event for Add icon
                $(".e-addpre").bind("click", $.proxy(proxy._addDropDownRow, proxy, $(tableTreeGridId)));
            }

        },

        // Add new row for the drop down table
        _addDropDownRow: function (tableTreeGrid, e) {
            var proxy = this, args = {},
                treeGridObj = tableTreeGrid.data("ejTreeGrid"),
                treeData = treeGridObj.model.dataSource,
                dlength = treeData.length,
                item = { text: "Text " + (dlength + 1), value: "Value" + (dlength + 1) };
            treeGridObj.addRow(item, "bottom");
        },
        // delete row from the drop down table
        _deleteDropDownRow: function (tableTreeGrid, e) {
            var proxy = this, args = {},
                treeGridObj = tableTreeGrid.data("ejTreeGrid"),
                treeData = treeGridObj.model.updatedRecords,
                dlength = treeData.length,
                selectedItem = treeGridObj.model.selectedItem;
            if (dlength != 0 && selectedItem) {
                treeGridObj.deleteRow();
                $('.e-deletepre').addClass('e-disable').removeClass('e-enable');
                $(".e-deletepre").unbind("click", $.proxy(proxy._deleteDropDownRow, proxy, tableTreeGrid));
            }

        },

        //get all the fields of the dataSource
        getAllDataSourceFields: function () {
            var proxy = this, model = proxy.model,
                dataSourceCol = model.dataSource;
            for (var d = 0; d < dataSourceCol.length; d++) {
                var jsonData = dataSourceCol[d];
                for (var dsKey in jsonData) {
                    if (dsKey == model.childMapping) {
                        proxy.getChildKeys(jsonData[dsKey]);
                    }
                    else if ($.inArray(dsKey, proxy._dataSourcefields) == -1)
                        proxy._dataSourcefields.push(dsKey);
                }
            }
        },

        //get keys of child from datasource.
        getChildKeys: function (childData) {
            var proxy = this, model = proxy.model;
            if (childData) {
                for (var c = 0; c < childData.length; c++) {
                    var chData = childData[c];
                    for (var childKey in chData)
                        if (childKey == model.childMapping) {
                            proxy.getChildKeys(chData[childKey]);
                        }
                        else if ($.inArray(childKey, proxy._dataSourcefields) == -1)
                            proxy._dataSourcefields.push(childKey);
                }
            }
        },

        //Method to render confirm dialog box while saving and cancelling and deleting
        _renderUpdateConfirmDialog: function () {
            var proxy = this,
                confDelTxt = proxy._confirmDeleteText,
                $contentDiv = ej.buildTag('div.e-content', proxy._deleteColumnText),
                $buttons = ej.buildTag('span.e-buttons', "<input type='button' id=" + proxy._id + 'ConfirmDialogOK' + " value='" + proxy._okButtonText + "' /> "
                + "<input type='button' id=" + proxy._id + 'ConfirmDialogCancel' + " value='" + proxy._cancelButtonText + "' />"),
                btnDiv = ej.buildTag('div', "", { 'margin-top': '20px', 'float': 'right', 'margin-bottom': '15px', 'margin-right': '15px' }, { 'class': "e-editform-btn" });
            btnDiv.append($buttons);
            proxy._updateConfirmDialog = ej.buildTag('div', '', '', { 'title': confDelTxt, 'id': proxy._id + 'ConfirmDialog' });
            proxy._updateConfirmDialog.append($contentDiv).append(btnDiv);
            proxy.element.append(proxy._updateConfirmDialog);
            $buttons.find("input").ejButton({
                cssClass: proxy.model.cssClass,
                showRoundedCorner: true,
                size: "mini",
                click: $.proxy(proxy._triggerUpdateConfirm, proxy)
            });
            proxy._updateConfirmDialog.ejDialog({ width: "auto", minHeight: 0, minWidth: 0, showOnInit: false, enableResize: false, enableModal: true });
        },

        _triggerUpdateConfirm: function (args) {
            var proxy = this;
            if (args !== undefined && args.model.text == proxy._okButtonText) {
                if (proxy._updateConfirmDialog.find(".e-content").text() == proxy._deleteColumnText)
                    proxy.deleteColumn(proxy._targetColumnIndex);
            }
            proxy._updateConfirmDialog.ejDialog("close");
        },

        //Method to delete column
        deleteColumn: function (columnIndex) {
            var proxy = this, model = proxy.model, columns = model.columns, deletedColumn,
                sortedColumns = model.sortSettings && model.sortSettings.sortedColumns.length ? model.sortSettings.sortedColumns : null;
            deletedColumn = columns.splice(columnIndex, 1);
            if (sortedColumns) {
                var resultCol = $.grep(sortedColumns, function (sCol) { return sCol.field == deletedColumn[0].field; });
                if (resultCol.length)
                    sortedColumns.splice(sortedColumns.indexOf(resultCol[0]), 1);
            }
            if (proxy._targetColumnIndex <= model.treeColumnIndex)
                model.treeColumnIndex = model.treeColumnIndex - 1;
            proxy._refreshFrozenColumns();
        },

        //Get the element Left and Top position

        getOffsetRect:function(elem) {
            var box = elem.getBoundingClientRect(),
                body = document.body,
                docElem = document.documentElement,
                scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
                scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
                clientTop = docElem.clientTop || body.clientTop || 0 ,
                clientLeft = docElem.clientLeft || body.clientLeft || 0 ,
                top  = box.top +  scrollTop - clientTop ,
                left = box.left + scrollLeft- clientLeft;
            return { top: Math.round(top), left: Math.round(left) }
        },
        _moveToNextMenuItem: function (move) {

            var proxy,
              currentMenuItem,
              contextMenu, model = this.model,
              nextMenuItem = {};
            if (model.isFromGantt) {
                proxy = $("#" + this._id.replace("ejTreeGrid", "")).data("ejGantt");
                contextMenu = $("#" + this._id.replace("ejTreeGrid", "") + "_ContextMenu");
            }
            else {
                proxy = this;
                contextMenu = $("#" + this._id + "_ContextMenu");
            }
            currentMenuItem = $("#" + proxy._activeMenuItemId);

            switch (move) {
                case "next":
                    if (currentMenuItem.length == 0) {
                        nextMenuItem = contextMenu.find("div.e-menuitem:not(.e-disable)").first();
                    } else {
                        nextMenuItem = currentMenuItem.closest("li").next("li").find("div.e-menuitem");
                        if (nextMenuItem.length > 0) {
                            if (nextMenuItem.hasClass("e-disable")) {
                                nextMenuItem = this._findContextMenuItem(nextMenuItem, "next");
                            }
                        }
                    }
                    var nextSubContextMenu = $("#" + proxy._id + "_SubContextMenu" + proxy._activeMenuItemId);
                    nextSubContextMenu.remove();
                    break;
                case "prev":
                    nextMenuItem = this._findContextMenuItem(currentMenuItem, "prev");
                    var nextSubContextMenu = $("#" + proxy._id + "_SubContextMenu" + proxy._activeMenuItemId);
                    nextSubContextMenu.remove();
                    break;
                case "expand":
                    if (currentMenuItem.length > 0) {
                        proxy._showSubContextMenu(currentMenuItem[0], proxy._contextMenuItems);
                        var subContextMenu = $("#" + proxy._id + "_SubContextMenu" + proxy._activeMenuItemId);
                        if (subContextMenu.length > 0) {
                            nextMenuItem = subContextMenu.find("div.e-menuitem:not(.e-disable)").first();
                        }
                    }
                    break;
                case "collapse":
                    var subContextMenu = $(currentMenuItem).closest(".e-innerContextmenu");
                    if (subContextMenu.length > 0) {
                        var parentMenuId = subContextMenu.attr("id").replace(proxy._id + "_SubContextMenu", "");
                        nextMenuItem = $("#" + parentMenuId);
                        var nextSubContextMenu = $("#" + proxy._id + "_SubContextMenu" + proxy._activeMenuItemId);
                        nextSubContextMenu.remove();
                        subContextMenu.remove();
                    }
                    break;
                case "save":
                    if (currentMenuItem.length > 0) {
                        if ($("#" + proxy._activeMenuItemId).find(".e-expander").length == 0) {
                            if (!model.isFromGantt)
                                proxy._contextMenuOperations(proxy._activeMenuItemId);
                            else
                                proxy._contextMenuClickHandler($("#" + proxy._activeMenuItemId));
                            proxy._clearContextMenu();
                        } else {
                            proxy._showSubContextMenu(currentMenuItem[0], proxy._contextMenuItems);
                            var subContextMenu = $("#" + proxy._id + "_SubContextMenu" + proxy._activeMenuItemId);
                            if (subContextMenu.length > 0) {
                                nextMenuItem = subContextMenu.find("div.e-menuitem:not(.e-disable)").first();
                            }
                        }
                    }
            }

            if (nextMenuItem.length > 0) {
                if((move == "next" || move == "prev"))
                    currentMenuItem.removeClass("e-contextmenu-mouseover");
                nextMenuItem.addClass("e-contextmenu-mouseover");
                proxy._activeMenuItemId = $(nextMenuItem).attr("id");
            }
        },
        /*Get Next active columnMenu item*/
        _findNextColumnMenuItem: function (item, move) {
            var proxy = this;
            if (move === "next") {
                nextItem = item.closest("li").next("li").find("div.e-columnmenuitem");
                if (nextItem.length > 0) {
                    if (!nextItem.hasClass("e-disable")) {
                        return nextItem;
                    }
                    else
                        return proxy._findNextColumnMenuItem(nextItem, "next");
                }
                else
                    return nextItem;
            }
            else {
                prevItem = item.closest("li").prev("li").find("div.e-columnmenuitem");
                if (prevItem.length > 0) {
                    if (!prevItem.hasClass("e-disable")) {
                        return prevItem;
                    }
                    else
                        return proxy._findNextColumnMenuItem(prevItem, "prev");
                }
                else
                    return prevItem;
            }
        },
        // Find the next context menu item to select
        _findContextMenuItem: function (item, move) {
            var proxy = this;
            if (move === "next") {
                nextItem = item.closest("li").next("li").find("div.e-menuitem");
                if (nextItem.length > 0) {
                    if (!nextItem.hasClass("e-disable")) {
                        return nextItem;
                    }
                    else
                        return proxy._findContextMenuItem(nextItem, "next");
                }
                else
                    return nextItem;
            }
            else {
                prevItem = item.closest("li").prev("li").find("div.e-menuitem");
                if (prevItem.length > 0) {
                    if (!prevItem.hasClass("e-disable")) {
                        return prevItem;
                    }
                    else
                        return proxy._findContextMenuItem(prevItem, "prev");
                }
                else
                    return prevItem;
            }
        }
    });

    //ENUM FOR EACH ACTION IN TREEGRID
    ej.TreeGrid.Actions = {
        Sorting: "sorting",
        BeginEdit: "beginedit",
        Save: "save",
        Add: "add",
        Delete: "delete",
        Cancel: "cancel",
        Refresh: "refresh",
        Searching: "searching",
        ExpandCollapse: "expandcollapse",
        Selection: "selection",
        rowHover: "rowHover",
        Scroll: "scroll",
        ContextMenuAdd: "contextMenuAdd",
        RefreshDataSource: "refreshDataSource",
        DragAndDrop: "dragAndDrop",
        Paging: "paging"
    };

    //ENUM FOR SELECTION MODE IN TREEGRID
    ej.TreeGrid.SelectionType = {
        Single: "single",
        Multiple: "multiple"
    };

    //ENUM FOR DIFFERENT EDIT MODE IN TREEGRID
    ej.TreeGrid.EditMode = {
        CellEditing: "cellEditing",
        RowEditing:"rowEditing",
    };

    //ENUM FOR DIFFERENT PAGE MODE IN TREEGRID
    ej.TreeGrid.PageSizeMode = {
        All: "all",
        Root: "root",
    };

    //Enum for position of new added row.
    ej.TreeGrid.RowPosition = {
        Top: "top",
        Bottom: "bottom",
        Above: "aboveSelectedRow",
        Below: "belowSelectedRow",
        Child : "child"
    }

    //Enum for Edit Action of TreeGrid.
    ej.TreeGrid.BeginEditAction = {
        DblClick: "dblClick",
        Click: "click"
    };
    /* enum for six different columnEditType for treegrid */
    ej.TreeGrid.EditingType = {
        String: "stringedit",
        Boolean: "booleanedit",
        Numeric: "numericedit",
        Dropdown: "dropdownedit",
        DatePicker: "datepicker",
        DateTimePicker: "datetimepicker",
        Maskedit : "maskedit"
    };
    /* enum for different context menu in treegrid */
    ej.TreeGrid.ContextMenuItems = {
        Add: "add",
        Edit: "edit",
        Delete: "delete",
    };
    
    ej.TreeGrid = ej.TreeGrid || {};


    //INITIALIZE THE CELLEDIT ELEMENT FOR DIFFERENT TYPES OF EDITORS
    ej.TreeGrid._initCellEditType = function (instance, $element, id, columnCount , dialogId) {

        var proxy=instance,
            model=proxy.model,
            columns=model.columns,
            column=columns[columnCount],
            dialogId = dialogId ? dialogId : "";
        
        if (ej.isNullOrUndefined(columns[columnCount]["editType"])) {
            column["editType"] = "stringedit";
        }

        switch (column["editType"]) {
            
            case "stringedit":

                if (model.isFromGantt) {
                    
                    var helpers={};
                    
                    helpers["_" + id + "cellValue"] = ej.TreeGrid._getCellValue;
                    
                    if(column.field==="predecessor"){
                        helpers["_" + id + "predecessorCell"] = ej.Gantt._getPredecessorsValue;
                    }
                    
                    $.views.helpers(helpers);


                    if(column.field==="predecessor"){ //get the predecessor value from item of GanttRecord
                     
                        var $input=ej.buildTag('input.e-field e-ejinputtext',
                                       "",{},
                                       {
                                           value:"{{:~_" + id + "predecessorCell('"+model.predecessorMapping+"')}}",
                                           id: id + column.field + dialogId,
                                           name: column.field,
                                           dialog: dialogId
                                       });

                    }else { /*get the cellValue if the column does not exist in the GanttRecord object and
                           present in the item of GanttRecord*/
                        $input= ej.buildTag('input.e-field e-ejinputtext', 
                                            "",
                                            {},
                                            {
                                                value: "{{:~_" + proxy._id + "cellValue('" + columns[columnCount].field + "')}}",
                                                id: id + model.columns[columnCount].field + dialogId,
                                                name: model.columns[columnCount].field,
                                                dialog: dialogId
                                            });
                       
                    }

                }else { /*Get the cellvalue of the normal gridcell*/
                    $input=ej.buildTag('input.e-field e-ejinputtext',
                                          "",
                                          {}, 
                                          {
                                              value: "{{:#data['" + column.field + "']}}", 
                                              id: id + column.field + dialogId,
                                              name: column.field,
                                              dialog: dialogId
                                          });
                }
                $input.attr("edittype", columns[columnCount].editType)
                $element.html($input);
            
                break;

            case "maskedit":
                $input = ej.buildTag('input.e-field e-maskedit', "", {},
                                         {
                                             value: "{{:~_" + proxy._id + "cellValue('" + columns[columnCount].field + "')}}",
                                             id: id + column.field + dialogId,
                                             name: column.field,
                                             dialog: dialogId
                                         });
                $input.attr("edittype", columns[columnCount].editType)
                $element.html($input);
                break;

            case "booleanedit":
                $element.html('{{if true===~_' + proxy._id + 'cellValue("' + columns[columnCount].field + '")}}' +
                         '<input type ="checkbox" ' +
                         'id="' + id + columns[columnCount].field + dialogId +
                         '" dialog ="' + dialogId +
                         '" name="' + columns[columnCount].field +
                         '" checked="checked" edittype="' +columns[columnCount].editType +'"></input>' +
                         ' {{else}} ' +
                         ' <input' +
                         ' type ="checkbox"' +
                         ' id="' + id + columns[columnCount].field + dialogId +
                         '" dialog ="'+ dialogId +
                         '" name="' + columns[columnCount].field + '" edittype="' + columns[columnCount].editType + '">' +
                         '{{/if}}');

                break;
            
            case "numericedit":

                var $numericText = ej.buildTag('input.e-numerictextbox e-field', "", {}, {
                    type: "text",
                    value: "{{:~_" + proxy._id + "cellValue('" + columns[columnCount].field + "')}}",
                    id: id + columns[columnCount].field + dialogId,
                    name: columns[columnCount].field,
                    dialog: dialogId
                });
                $numericText.attr("edittype", columns[columnCount].editType)
                $element.append($numericText);

                break;

            case "datepicker":
                
                var $datePicker = ej.buildTag('input.e-datepicker e-field', "",
                                             {}, 
                                             {
                                                 type: "text",
                                                 value: "{{:~_" + proxy._id + "cellValue('" + columns[columnCount].field + "')}}",
                                                 id: id + columns[columnCount].field + dialogId,
                                                 name: columns[columnCount].field,
                                                 dialog: dialogId
                                             });
                $datePicker.attr("edittype", columns[columnCount].editType)
                $element.append($datePicker);

                break;
            case "datetimepicker":

                var $datePicker = ej.buildTag('input.e-datetimepicker e-field', "",
                                             {},
                                             {
                                                 type: "text",
                                                 value: "{{:~_" + proxy._id + "cellValue('" + columns[columnCount].field + "')}}",
                                                 id: id + columns[columnCount].field + dialogId,
                                                 name: columns[columnCount].field,
                                                 dialog: dialogId
                                             });
                $datePicker.attr("edittype", columns[columnCount].editType)
                $element.append($datePicker);

                break;
            case "dropdownedit":

                    var $dropDownList = ej.buildTag('input.e-field e-dropdownlist',
                        "", 
                        {}, 
                        {
                            type: "text",
                            id: id + columns[columnCount].field + dialogId,
                            name: columns[columnCount].field,
                            dialog: dialogId
                        });
                    $dropDownList.attr("edittype", columns[columnCount].editType)
                        .attr("cellValue", "{{:~_" + proxy._id + "cellValue('" + columns[columnCount].field + "')}}");
                    $element.append($dropDownList);

                            break;
                    }
    };
    
    ej.TreeGrid._getCellValue= function (columnName) {

        var cellValue = this.data[columnName];

        if (cellValue) {
            return cellValue;
        } else {
            return this.data.item && this.data.item[columnName];
        }


    };
    //Initialize tree grid toolbar item.
    ej.TreeGrid.ToolbarItems = {
        Add: "add",
        Edit: "edit",
        Delete: "delete",
        Update: "update",
        Cancel: "cancel",
        ExpandAll: "expandAll",
        CollapseAll: "collapseAll",
        PdfExport: "pdfExport",
        ExcelExport: "excelExport"
    };

    //Enum Values of summaryType
    ej.TreeGrid.SummaryType = {
        Sum: "sum",
        Average: "average",
        Maximum: "maximum",
        Minimum: "minimum",
        Count: "count",
        MinimumDate: "minimumDate",
        MaximumDate: "maximumDate",
        TrueCount: "trueCount",
        FalseCount: "falseCount",
    };

    //Enum Value of selectionMode.
    ej.TreeGrid.SelectionMode = {
        Row: "row",
        Cell: "cell"
    };

    ej.TreeGrid.Locale = ej.TreeGrid.Locale || {};

    ej.TreeGrid.Locale["default"] = ej.TreeGrid.Locale["en-US"] = {
        //string to be displayed in Toolbox's tooltip 
        toolboxTooltipTexts: {
            addTool: "Add",
            editTool: "Edit",
            updateTool: "Update",
            deleteTool: "Delete",
            cancelTool: "Cancel",
            expandAllTool: "ExpandAll",
            collapseAllTool: "CollapseAll",
            pdfExportTool: "PDF Export",
            excelExportTool: "Excel Export"
        },
        //string to be displayed in context menu 
        contextMenuTexts: {
            addRowText: "Add Row",
            editText: "Edit",
            deleteText: "Delete",
            saveText: "Save",
            cancelText : "Cancel",
            aboveText: "Above",
            belowText: "Below"
        },
        //string to be displayed in column menu 
        columnMenuTexts: {
            sortAscendingText: "Sort Ascending",
            sortDescendingText: "Sort Descending",
            columnsText: "Columns",
            freezeText: "Freeze",
            unfreezeText: "Unfreeze",
            freezePrecedingColumnsText: "Freeze Preceding Columns",
            insertColumnLeft: "Insert Column Left",
            insertColumnRight: "Insert Column Right",
            deleteColumn: "Delete Column",
            renameColumn: "Rename Column"
        },

        //string to display in column add dialog 
        columnDialogTexts: {
            field: "Field",
            headerText: "Header Text",
            editType: "Edit Type",
            filterEditType: "Filter Edit Type",
            allowFiltering: "Allow Filtering",
            allowFilteringBlankContent: "Allow Filtering Blank Content",
            allowSorting: "Allow Sorting",
            visible: "Visible",
            width: "Width",
            textAlign: "Text Alignment",
            headerTextAlign: "Header Text Alignment",
            isFrozen: "Is Frozen",
            allowFreezing: "Allow Freezing",
            columnsDropdownData: "Column Dropdown Data",
            dropdownTableText: "Text",
            dropdownTableValue: "Value",
            addData: "Add",
            deleteData: "Remove",
            allowCellSelection: "Allow Cell Selection"
        },

        //string to be displayed in column add dialog title 
        columnDialogTitle: {
            insertColumn: "Insert Column",
            deleteColumn: "Delete Column",
            renameColumn: "Rename Column"
        },

        //Locale Text for delete confirm dialog
        deleteColumnText: "Are you sure you want to delete this column?",
        okButtonText: "OK",
        cancelButtonText: "Cancel",
        confirmDeleteText: "Confirm Delete",

        //String to be displayed in drop down list for filtering blank items
        dropDownListBlanksText: "(Blanks)",
        //String to be displayed in drop down list to clear filtered items
        dropDownListClearText: "(Clear Filter)",
        //Text to be displayed in drop down list for FALSE value in boolean edit type column
        trueText: "True",
        //Text to be displayed in drop down list for True value in boolean edit type column
        falseText: "False",
        emptyRecord: "No records to display",
    };

    //GET ROW CLASS NAME FOR EXPAND COLLAPSE ACTION
    ej.TreeGrid._getrowClassName = function () {

        var rowClass = "gridrowIndex",
            proxy = this;

        if (proxy.data.parentItem) {

            rowClass += proxy.data.parentItem.index.toString();

        }

        rowClass += "level";
        rowClass += proxy.data.level.toString();
        if (proxy.data.isSummaryRow) {
            rowClass += " ";
            rowClass += "e-summaryrow";
        }
        if (proxy.data.footerSummaryRowRecord) {
            rowClass += " ";
            rowClass += "e-footersummaryrow";
        }

        return rowClass;
    };
    ej.TreeGrid._getSummaryRowtdClassName = function () {
        proxy = this;
        var tdClass = "";
        if (proxy.data.isSummaryRow) {
            tdClass += " ";
            tdClass += "e-summaryrowcell";
        }
        if (proxy.data.footerSummaryRowRecord) {
            tdClass += " ";
            tdClass += "e-footersummaryrowcell";
        }
        return tdClass;
    };

    //GET COLUMN BY FIELD NAME
    ej.TreeGrid.getColumnByField = function (columns, field) {

        var column = 0;

        for (column; column < columns.length; column++) {

            if (columns[column]["field"] == field) break;

        }

        return column == columns.length ? null : columns[column];
    };


    ej.TreeGrid.getColumnByMappingName = function (columns, field) {
        var column = 0;
        for (column; column < columns.length; column++) {
            if (columns[column]["mappingName"] == field) break;
        }
        return column == columns.length ? null : columns[column];
    };

    //EXPAND COLLAPSE THE PARTICULAR RECORD OBJECT
    ej.TreeGrid.sendExpandCollapseRequest = function (element, args) {

        var proxy = element,
             model = proxy.model,
             toolbarItems = model.toolbarSettings.toolbarItems,
             updatedRecords;

        args.requestType = ej.TreeGrid.Actions.ExpandCollapse;
        //To cancel the cell edit or row edit mode when expand the all record.
        if (proxy._isRowEdit) 
            proxy.cancelRowEditCell();
        else if (proxy.model.isEdit)
            proxy.cancelEditCell();

        if (model.enableVirtualization) {

            if (proxy._isFromGantt) {
                proxy._$treegridHelper.ejTreeGrid("processBindings", args);
            } else {
                proxy.processBindings(args);
            }

            if (proxy._isFromGantt) {
                if (proxy._isInExpandCollapseAll === false) {
                    if (model.enableAltRow) {
                        proxy._$treegridHelper.ejTreeGrid("updateAltRow");
                    }
                    proxy._$treegridHelper.ejTreeGrid("sendDataRenderingRequest", args);
                    proxy._$treegridHelper.ejTreeGrid("updateHeight");
                    proxy.model.updatedGanttRecords = proxy.getUpdatedRecords();
                    proxy.model.currentViewData = proxy.getCurrentViewData();
                    proxy._$ganttchartHelper.ejGanttChart("clearConnectorLines");
                    proxy._$ganttchartHelper.ejGanttChart("refreshHelper", proxy.model.currentViewData, proxy.model.updatedGanttRecords);
                  
                }
            }
            else {
                if (proxy._isInExpandCollapseAll === false) {
                    if (model.enableAltRow) {
                        proxy.updateAltRow();
                    }
                    proxy.sendDataRenderingRequest(args);
                    proxy._setScrollTop();
                    proxy.updateHeight();
                }
            }
            
        } else {
            var record = args.data,
                index,
                $row,
                height = 0,
                isModified = record.expanded !== args.expanded;
                index = proxy.model.currentViewData.indexOf(record);
            
                if (proxy._frozenColumnsLength && proxy.getRows()) {
                    $row = $(proxy.getRows()[0][index]).add(proxy.getRows()[1][index]);
                }
                else if (proxy.getRows()) {
                    $row = proxy.getRows() && $(proxy.getRows()[index]);
                }

                if (args.expanded) {
                    record.expanded = args.expanded;
                    $row && ej.TreeGrid.expandRecord(proxy, record, args.expanded, args);
                    if (record.hasFilteredChildRecords) {
                        $row && $row.find(".e-treegridcollapse").removeClass('e-treegridcollapse').addClass('e-treegridexpand');
                        $row && $row.removeClass('e-treegridrowcollapse').addClass('e-treegridrowexpand');
                    }
                    if (model.enableAltRow && proxy._isInExpandCollapseAll === false) {
                        ej.TreeGrid.updateAltRow(proxy, record, index, 1);
                    }
                }
                else {
                    proxy._collapsedRecordCount = 0;//For update alt row
                    $row && ej.TreeGrid.collapseRecord(proxy, record, args.expanded);
                    record.expanded = args.expanded;
                    if (record.hasFilteredChildRecords) {
                        $row && $row.find(".e-treegridexpand").removeClass('e-treegridexpand').addClass('e-treegridcollapse');
                        $row && $row.removeClass('e-treegridrowexpand').addClass('e-treegridrowcollapse');
                    }
                    if (model.enableAltRow && proxy._isInExpandCollapseAll === false)
                        ej.TreeGrid.updateAltRow(proxy, record, index, proxy._collapsedRecordCount);
                }

            var collapsedRecordCount= 0;
            if (proxy._isFromGantt) {
                proxy._$treegridHelper.ejTreeGrid("updateExpandStatus", record, args.expanded);
                proxy._$treegridHelper.ejTreeGrid("updateCollapsedRecordCount");
                collapsedRecordCount =  proxy._$treegridHelper.ejTreeGrid("getCollapsedRecordCount");
            } else {
                proxy.updateExpandStatus(record, args.expanded);
                proxy.updateCollapsedRecordCount();
                collapsedRecordCount = proxy.getCollapsedRecordCount();
            }

            height = (proxy.model.updatedRecords.length - collapsedRecordCount) * model.rowHeight;

            if (model.allowPaging && (args.type == "ejTreeGridcollapsing" || args.type =="ejTreeGridexpanding")) {
                if (!ej.isNullOrUndefined(proxy.getPager())) {                    
                    proxy.gotoPage();
                }
            }
            
            if (proxy._isFromGantt)
            {
                if (proxy._isInExpandCollapseAll === false) {
                    proxy._totalCollapseRecordCount = collapsedRecordCount;
                    proxy._$ganttchartHelper.ejGanttChart("clearConnectorLines");
                    proxy._$treegridHelper.ejTreeGrid("updateHeight");
                    proxy._$ganttchartHelper.ejGanttChart("updateHeight", height);
                    proxy._$ganttchartHelper.ejGanttChart("setCollapsedRecordCount", collapsedRecordCount);
                    proxy._$ganttchartHelper.ejGanttChart("refreshGridLinesTable", proxy.model.updatedRecords.length - collapsedRecordCount);
                }
                
            } else {
                if (proxy._isInExpandCollapseAll === false) {
                    proxy.updateHeight();
                }
            }
        }

        
        if (proxy._isFromGantt && proxy.model.predecessorMapping && proxy._isInExpandCollapseAll === false) {
            proxy._isValidationEnabled = false;
            proxy._connectorlineIds = [];
            proxy._connectorLinesCollection = [];
            proxy._createConnectorLinesCollection();
        }

        if (proxy._isFromGantt) {
            var treeGrid = proxy._$treegridHelper.ejTreeGrid("instance");
            var chart = proxy._$ganttchart.ejGanttChart("instance");
            var top = treeGrid._$gridContent.ejScroller("option", "scrollTop");
            chart._$bodyContainer.ejScroller("option", "scrollTop", top);
        }
       
        var argstemp = {};
        argstemp.recordIndex = args.recordIndex;
        argstemp.data = args.data;
        argstemp.requestType = args.requestType;
        argstemp.expanded = args.expanded;
        if (args.expanded) {
            proxy._trigger("expanded", argstemp);
        } else {
            proxy._trigger("collapsed", argstemp);
        }

        var selectItem = proxy.selectedItem();
        if (!proxy._isFromGantt && selectItem && model.selectedItems.length == 1) {
            var expanded = proxy.getExpandStatus(selectItem);
            if (!expanded && !args.expanded) {
                proxy.selectRows(-1);
                proxy.selectedRowIndex(-1);
                selectItem.isSelected = false;
                model.selectedItem = null;
                selectItem = null;
            }
            if (model.allowPaging)
                updatedRecords = proxy._updatedPageData;
            else
                updatedRecords = proxy.model.updatedRecords;
            if (model.enableVirtualization && selectItem && updatedRecords.indexOf(selectItem) !== proxy.selectedRowIndex())
                proxy.selectRows(updatedRecords.indexOf(selectItem));
            proxy._cancelSaveTools();
        }
    };

    //EXPAND THE RECORD
    ej.TreeGrid.expandRecord = function (controlObject, Record, expanded, args) {
  
        var proxy = controlObject,
            rowClassName = ".gridrowIndex" + Record.index.toString() + "level" + (Record.level + 1).toString(),
            detailsRowClassName = ".detailsrowgridrowIndex" + Record.index.toString() + "level" + (Record.level + 1).toString(),
            $rows = $(proxy.element).find(rowClassName),
            count = 0,
            length = $rows.length,
            row,
            index,
            record,
            model = proxy.model,
            $detailRows = $(proxy.element).find(detailsRowClassName),
            $expandedRows = $(proxy.element).find(rowClassName),
            index,
            $gridRows = proxy.getRows(),
            $row = $($gridRows[index]);

            index = model.currentViewData.indexOf(Record);

        if (Record.hasChildRecords && Record.childRecords.length > 0) {
            $row.find(".e-treegridcollapse").removeClass('e-treegridcollapse').addClass('e-treegridexpand');
            $row.removeClass('e-treegridrowcollapse').addClass('e-treegridrowexpand');
        }
        proxy._expandedRecordsCount += (proxy._isFromGantt || proxy._frozenColumnsLength > 0) ? $expandedRows.length / 2 : $expandedRows.length;
        $expandedRows.css({ 'display': 'table-row' });
        $detailRows.filter("tr.e-detailsrowexpanded").css('display', 'table-row');
        if (proxy._isFromGantt || proxy._frozenColumnsLength > 0) {
            length = length / 2;
        }

        for (count; count < length; count++) {
            row = $rows[count];
            index = -1;
            if (proxy._frozenColumnsLength > 0)
                index = $(proxy.getRows()[0]).index(row);
            else
                index = proxy.getRows().index(row);

            if (index !== -1) {
                record = proxy._isFromGantt ? proxy.model.updatedRecords[index] : proxy.model.updatedRecords[index];
                record.isExpanded = true;
                if (record.expanded)
                    ej.TreeGrid.expandRecord(proxy,record, expanded);
            }
        }
    },
    
    //COLLAPSE THE RECORD
    ej.TreeGrid.collapseRecord = function (controlObject, Record, expanded) {

        var proxy = controlObject,
            model = proxy.model,
            rowClassName = ".gridrowIndex" + Record.index.toString() + "level" + (Record.level + 1).toString(),
            detailsRowClassName = ".detailsrowgridrowIndex" + Record.index.toString() + "level" + (Record.level + 1).toString(),
            $rows = $(proxy.element).find(rowClassName),
            count = 0,
            length = $rows.length,
            row,
            index,
            record,
            $detailRows = $(proxy.element).find(detailsRowClassName),
            $collapsedRows = $(proxy.element).find(rowClassName),
        $gridRows = proxy.getRows();

        proxy._collapsedRecordCount += (proxy._isFromGantt || proxy._frozenColumnsLength > 0) ? $collapsedRows.length / 2 : $collapsedRows.length;
        $collapsedRows.css({ 'display': 'none' });
        $detailRows.css({ 'display': 'none' });

        if (proxy._isFromGantt || proxy._frozenColumnsLength > 0) {
            length = length / 2;
        }

        for (count; count < length; count++) {

            row = $rows[count];
            index = -1;
            if (proxy._frozenColumnsLength > 0)
                index = $(proxy.getRows()[0]).index(row);
            else
                index = proxy.getRows().index(row);


            if (index !== -1) {
                if (model.allowPaging)
                    record = proxy._updatedPageData[index];
                else
                    record = proxy.getUpdatedRecords()[index];

                if (record.expanded)
                    ej.TreeGrid.collapseRecord(proxy,record, expanded);
            }
        }
    },

    //UPDATE THE ALT ROW FUNCTION
    ej.TreeGrid.updateAltRow = function (controlObject, Record, recordIndex, offset) {

        var proxy = controlObject,
            count = 0,
            model = proxy.model,
            currentViewData = model.currentViewData,
            length = currentViewData.length,
            isAltRow = Record.isAltRow,
            record,
            $gridRows,
            $gridAllRows = proxy.getRows();

        if (proxy._frozenColumnsLength)
            $gridRows = proxy.getRows()[0];
        else
            $gridRows = proxy.getRows();

        /* for rowTemplate no need set alt row class*/
        if (model.rowTemplateID || model.altRowTemplateID)
            return;

        for (count = recordIndex + offset; count < length; count++) {

            if ($($gridRows[count]).hasClass("e-summaryrow"))
                continue;

            if ($($gridRows[count]).css('display') === "none")
                continue;

            record = currentViewData[count];
            if(count!=0)
            record.isAltRow = !isAltRow;
            isAltRow = record.isAltRow;
            var currentRow = {};
            if (proxy._frozenColumnsLength) {
                currentRow = $($gridAllRows[0][count]).add($gridAllRows[1][count]);
            }
            else
                currentRow = $($gridAllRows[count])
            if (isAltRow) {
                $(currentRow).addClass('e-alt-row');
            }
            else {
                $(currentRow).removeClass('e-alt-row');
            }
        }
    };

    //RERENDERED THE EDITED RECORD
    ej.TreeGrid.refreshRow = function (controlObject, index) {
        var proxy = controlObject,
            model = proxy.model,
            data = proxy.model.currentViewData[index], eventArgs = {},
            currentRefreshingRow, currentFrozenRow;
        if (data) {
            if (proxy._frozenColumnsLength > 0) {
                currentFrozenRow = $(proxy.getRows()[0][index]);
                currentRefreshingRow = $(proxy.getRows()[1][index]);
                if (model.showDetailsRow && model.detailsTemplate && data.isDetailsExpanded) {
                    var detailsRow = currentFrozenRow.next("tr");
                    if (detailsRow.hasClass("e-detailsrow")) {
                        detailsRow.remove();
                        currentRefreshingRow.next("tr").remove();
                    }
                }
                currentFrozenRow.replaceWith($($.render[proxy._id + "_JSONFrozenTemplate"](data)));
                currentRefreshingRow.replaceWith($($.render[proxy._id + "_Template"](data)));
            } else {
                currentRefreshingRow = $(proxy.getRows()[index]);
                if (model.showDetailsRow && model.detailsTemplate && data.isDetailsExpanded) {
                    var detailsRow = currentRefreshingRow.next("tr");
                    if (detailsRow.hasClass("e-detailsrow"))
                        detailsRow.remove();
            }
            if (!model.allowSelection)
                data.isSelected = false;
            currentRefreshingRow.replaceWith($($.render[proxy._id + "_Template"](data)));
            }
            proxy.setGridRows($(proxy.getContentTable().get(0).rows));

            proxy._gridRows = proxy.getContentTable().get(0).rows;
            if (proxy._frozenColumnsLength > 0)
                proxy._gridRows = [proxy._gridRows, proxy.getContentTable().get(1).rows];

            var rowElement = ej.TreeGrid.getRowByIndex(proxy, model.updatedRecords.indexOf(model.currentViewData[index]));
            proxy._trigger("refresh");
            proxy._rowEventTrigger(rowElement, data);
        }
    };

    //Return corressponding treegrid rows jquery object
    ej.TreeGrid.getRowByIndex = function (controlObject, from, to) {

        try {
            var proxy;
            if (controlObject.pluginName == "ejTreeGrid")
                proxy = controlObject;
            else
                proxy = controlObject._$treegridHelper.data("ejTreeGrid");

            var $gridRows = proxy.getRows(),
                model = proxy.model
                updatedRecords = model.allowPaging ? proxy._updatedPageData : model.updatedRecords;
               // gridRows=proxy._gridRows,
                $row = $();

            if (proxy.model.enableVirtualization) {
                var recordstart = updatedRecords[from];
                from = proxy.model.currentViewData.indexOf(recordstart);
            }

            if (ej.isNullOrUndefined(to)) {
                if (proxy._frozenColumnsLength > 0) {
                    if ($gridRows[0][from]) {
                        $row.push($gridRows[0][from]);
                        $row.push($gridRows[1][from]);
                    }
                    return $row;
                }
                return $($gridRows[from]);
            } else {
                if (proxy.model.enableVirtualization) {
                    var recordend = updatedRecords[to];
                    to = proxy.model.currentViewData.indexOf(recordend);
                }
                if (proxy._frozenColumnsLength > 0) {
                    $row.push($($gridRows[0]).slice(from, to));
                    $row.push($($gridRows[1]).slice(from, to));
                    return $row;
                }
                return $($gridRows.slice(from, to));
            }
        } catch (e) {
            return $();
        }
    }

})(jQuery, Syncfusion);;;;
(function ($, ej, undefined) {
    ej.gridFeatures = ej.gridFeatures || {};
    ej.gridFeatures.gridResize = function (instance) {
        this.$headerTable = instance.getHeaderTable();
        this.gridInstance = instance;
        this._colMinWidth = 15;
        this._$visualElement = $();
        this._currentCell = -1;
        this._allowStart = false;
        this._oldWidth = null;
        this._orgX = null;
        this._orgY = null;
        this._extra = null;
        this._expand = false;
        this._target = null;
        this._cellIndex = -1;
    }

    ej.gridFeatures.gridResize.prototype = {
        _mouseHover: function (e) {
            if (this._$visualElement.is(":visible"))
                return;
            this._allowStart = false;
            if ($(e.target).is(".e-headercelldiv"))
                e.target = e.target.parentNode;
            var $target = $(e.target);
			if ($(e.target).hasClass("e-filtericon") && ($(e.target).css("cursor") == "col-resize" || $(e.target).closest("tr").css("cursor") == "col-resize")) {
                $(e.target).css("cursor", "pointer");
                $(e.target).closest("tr").css("cursor", "pointer");
            }
            if ($target.hasClass("e-headercell")) {
                var _resizableCell = e.target;
                var location = _resizableCell.getBoundingClientRect(), _x = 0, _y = 0;
                if (e.type = "mousemove") {
                    _x = e.clientX;
                    _y = e.clientY;
                }
                else if (e.type = "touchmove") {
                    _x = evt.originalEvent.changedTouches[0].clientX;
                    _y = evt.originalEvent.changedTouches[0].clientY;
                }
                else if (e.type = "MSPointerMove") {
                    _x = e.originalEvent.clientX;
                    _y = e.originalEvent.clientY;
                }
                if (this.gridInstance.model.scrollSettings && this.gridInstance.model.scrollSettings.frozenColumns)
                    var _nlx = this.gridInstance.getHeaderContent().width() + this.gridInstance.element.children(".e-gridheader").find(".e-columnheader").offset().left;
                else
                    var _nlx = this.gridInstance.getHeaderTable().width() + this.gridInstance.element.children(".e-gridheader").find(".e-columnheader").offset().left;
                if (((_x >= (location.left + document.documentElement.scrollLeft + _resizableCell.offsetWidth - 5)) || ((_x <= (location.left + 3)))) && (_x < _nlx) && (_x >= location.left) && (_y <= location.top + document.documentElement.scrollTop + e.target.offsetHeight)) {
                    if (_x > location.left + 3)
                        var tempTarget = $(e.target).find(".e-headercelldiv");
                    else
                        var tempTarget = $(e.target).prevAll("th:visible:first").find(".e-headercelldiv");
                    if ((this.gridInstance.model.enableRTL && _x >= (location.left + 10)) || (_x >= ((this.gridInstance.element.find(".e-headercell").not('.e-detailheadercell').offset().left + 10) - window.pageXOffset))) {
                        if ((this.gridInstance.model.showStackedHeader || tempTarget.length) && $.inArray($(tempTarget).attr("ej-mappingname"), this.gridInstance._disabledResizingColumns) == -1) {
                            this.gridInstance.model.showStackedHeader && $($target.parents('thead')).find('tr').css("cursor", "col-resize");
                            !this.gridInstance.model.showStackedHeader && $target.parent().css("cursor", "col-resize");
                            if ($(e.target).hasClass('e-stackedHeaderCell'))
                                this._currentCell = this.gridInstance.getHeaderContent().find(".e-headercell:visible").index(_resizableCell);
                            else
                                this._currentCell = this.gridInstance.getHeaderContent().find(".e-headercell:visible").not(".e-stackedHeaderCell").index(_resizableCell);
                            this._allowStart = true;
                        }
                        else {
                            $target.parent().css("cursor", "pointer");
                            this._currentCell = -1;
                        }
                    }
                }
                else {
                    this.gridInstance.element.find(".e-columnheader").css("cursor", "pointer");
                    this._currentCell = -1;
                }
            }
        },
        _start: function (_x, _y) {
            var _myrow = this.gridInstance.getHeaderTable().find(".e-columnheader"), _top;
            var _cells, _mycel;
            if ($(this._target).hasClass('e-stackedHeaderCell'))
                _cells = _myrow.find(".e-headercell").not(".e-hide");
            else
                _cells = _myrow.find(".e-headercell").not(".e-stackedHeaderCell,.e-hide");
            if (this._currentCell != -1 && this._currentCell < _cells.length)
                _mycel = _cells[this._currentCell];
            if (typeof (_mycel) == 'undefined')
                return;
            var _j = _mycel.getBoundingClientRect();
            _top = this._tableY = _j.top + parseInt(navigator.userAgent.indexOf("WebKit") != -1 ? document.body.scrollTop : document.documentElement.scrollTop);
            if (this._allowStart) {
                var vElement = this._$visualElement = $(document.createElement('div'));
                _height = this.gridInstance.element.find(".e-gridcontent").first().height() + this.gridInstance.element.find(".e-gridheader").height();
                if (this.gridInstance.model.showStackedHeader && this.gridInstance.model.stackedHeaderRows.length > 0) {
                    var headerRow = this.gridInstance.getHeaderTable().find('tr.e-columnheader')
                    var lenght = headerRow.length;
                    var currentIndex = $(this._target).parent('tr')[0].rowIndex;
                    for (var i = 0; i < currentIndex; i++) {
                        _height = _height - $(headerRow[i]).height();
                    }
                    // _height = _height - $(".e-stackedHeaderRow").height();
                }
                vElement.addClass("e-reSizeColbg").appendTo(this.gridInstance.element).attr("unselectable", "on").css("visibility", "hidden");
                this.gridInstance._resizeTimeOut = setTimeout(function() {
                    vElement.css({ visibility: "visible", height: _height + 'px', cursor: 'col-resize', left: _x, top: _top, position: 'fixed' });
                }, 100);
                this._oldWidth = _mycel.offsetWidth;
                this._orgX = _x;
                this._orgY = _y;
                this._extra = _x - this._orgX;
                this._expand = true;
            }
            else {
                this._currentCell = -1;
            }
        },
        _mouseMove: function (e) {
            if (this._expand) {
                var _x = 0, _y = 0;
                if (e.type = "mousemove") {
                    _x = e.clientX;
                    _y = e.clientY;
                }
                else if (e.type = "touchmove") {
                    _x = evt.originalEvent.changedTouches[0].clientX;
                    _y = evt.originalEvent.changedTouches[0].clientY;
                }
                else if (e.type = "MSPointerMove") {
                    _x = e.originalEvent.clientX;
                    _y = e.originalEvent.clientY;
                }
                if (navigator.userAgent.indexOf("WebKit") != -1) {
                    _x = e.pageX;
                    _y = e.pageY;
                }
                _x += document.documentElement.scrollLeft;
                e.preventDefault();
                this._moveVisual(_x);
            }
            else
                this._mouseHover(e);
        },
        _getCellIndex: function (e) {
            var $target = $(e._target);
            var targetCell = e._target;
            var location = targetCell.getBoundingClientRect();
            var scrollLeft = navigator.userAgent.indexOf("WebKit") != -1 ? document.body.scrollLeft : document.documentElement.scrollLeft;
            if (this._orgX < location.left + 5 + scrollLeft)
                targetCell = $(targetCell).prevAll(":visible:first")[0];
            var hCellIndex = targetCell.cellIndex;
            var cellIndex = hCellIndex;
            if (e.gridInstance.model.groupSettings.groupedColumns.length) {
                cellIndex = hCellIndex - e.gridInstance.model.groupSettings.groupedColumns.length;
            }
            return cellIndex;
        },
        _reSize: function (_x, _y) {
            // Function used for Resizing the column
            var proxy = this;
            var resized = false, $content;
            if (this.gridInstance.model.scrollSettings && this.gridInstance.model.scrollSettings.frozenColumns)
                this._initialTableWidth = this.gridInstance.getHeaderTable().first().parent().width() + this.gridInstance.getHeaderTable().last().parent().width();
            else
                this._initialTableWidth = this.gridInstance.getHeaderTable().parent().width();
            !this.gridInstance.model.enableRTL && this._getResizableCell();
            if (this.gridInstance.model.scrollSettings && this.gridInstance.model.scrollSettings.frozenColumns > 0)
                var _rowobj = this.gridInstance.getHeaderTable().find('thead');
            else
                var _rowobj = $(this._target).parents('thead');
            if (this._currentCell != -1 && this._expand) {
                this._expand = false;
                var _childTH = $(this._target).hasClass('e-stackedHeaderCell') ? _rowobj.find(".e-headercell:not(.e-detailheadercell)").filter(":visible") : _rowobj.find(".e-headercell:not(.e-detailheadercell,.e-stackedHeaderCell)").filter(":visible");
                var _outerCell = _childTH[this._currentCell];
                var _oldWidth = _outerCell.offsetWidth;
                var _extra = _x - this._orgX;
                //Check whether the column minimum width reached
                if (parseInt(_extra) + parseInt(_oldWidth) > this._colMinWidth) {
                    if (_extra != 0)
                        _rowobj.css("cursor", 'default');
                    this._resizeColumnUsingDiff(_oldWidth, _extra);
                    $content = this.gridInstance.element.find(".e-gridcontent").first();
                    var scrollContent = $content.find("div").hasClass("e-content");                    
                    var browser = this.gridInstance.getBrowserDetails();
                    if (browser.browser == "msie" && this.gridInstance.model.allowScrolling) {
                        var oldWidth = this.gridInstance.getContentTable().width(), newwidth = this.gridInstance._calculateWidth();
                        if (this.gridInstance.model.scrollSettings && this.gridInstance.model.scrollSettings.frozenColumns > 0) {
                            this.gridInstance.getHeaderTable().last().width(newwidth - this.gridInstance.getHeaderContent().find(".e-frozenheaderdiv").width());
                            this.gridInstance.getContentTable().last().width(newwidth - this.gridInstance.getContent().find(".e-frozencontentdiv").width());
                            this.gridInstance.model.showSummary && this.gridInstance.getFooterTable().last().width(newwidth - this.gridInstance.getFooterContent().find(".e-frozenfootertdiv").width());
                        }
                        else {
                            if (newwidth > oldWidth) {
                                this.gridInstance.getHeaderTable().width(newwidth);
                                this.gridInstance.getContentTable().width(newwidth);
                                this.gridInstance.model.showSummary && this.gridInstance.getFooterTable().width(newwidth);
                            }
                        }
                        if (parseInt(browser.version, 10) > 8 && this.gridInstance.model.groupSettings && this.gridInstance.model.groupSettings.groupedColumns.length) {
                            if (newwidth > oldWidth) {
                                this.gridInstance.getContentTable().width(newwidth);
                                this.gridInstance.getContentTable().children("colgroup").find("col").first().css("width", (20 / $content.find("table").first().width()) * 100 + "%");
                            }
                            else {
                                this.gridInstance.getContentTable().css("width", "100%");
                                this.gridInstance._groupingAction(true);
                                this.gridInstance.getContentTable().children("colgroup").find("col").first().css("width", ((this.gridInstance.getHeaderTable().find("colgroup").find("col").first().width() / $content.find("table").first().width()) * 100).toFixed(2) + "%");
                            }
                        }
                        this.gridInstance.getHeaderTable().parent().scrollLeft($content.find(".e-content").scrollLeft() - 1);
                    }
                    this.gridInstance._colgroupRefresh();
                    if (this.gridInstance.model.allowTextWrap)
                        this.gridInstance.rowHeightRefresh();
                    if (this.gridInstance.model.groupSettings.groupedColumns.length && !this.gridInstance.model.isEdit)
                        this.gridInstance._recalculateIndentWidth();
                    if (this.gridInstance.pluginName != "ejGrid" || ej.getObject("resizeSettings.resizeMode", this.gridInstance.model) == ej.Grid.ResizeMode.NextColumn) {
                        var $headerCols = this.gridInstance.getHeaderTable().find('colgroup').find("col");
                        var $ContentCols = this.gridInstance.getContentTable().find('colgroup').find("col");
                        if (!ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate)) {
                            this.gridInstance._detailColsRefresh();
                            $headerCols = this.gridInstance._$headerCols;
                            $ContentCols = this.gridInstance._$contentCols;
                        }
                        var nextCell = this._currentCell + 1;
                        var $headerCol = $headerCols.filter(this._diaplayFinder).eq(!this.gridInstance.model.allowGrouping || !ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate) ? nextCell : nextCell + this.gridInstance.model.groupSettings.groupedColumns.length)
                        var newWidth = ($headerCol.width() - (_extra)) > this._colMinWidth ? $headerCol.width() - (_extra) : this._colMinWidth;
                        $headerCol.width(newWidth);
                        if (this.gridInstance.model.scrollSettings && this.gridInstance.model.scrollSettings.frozenColumns) {
                            if (nextCell >= 0 && nextCell < this.gridInstance.model.scrollSettings.frozenColumns && this._getFrozenResizeWidth() + _extra > this.gridInstance.element.find(".e-headercontent").first().width())
                                return;
                            $ContentCol = $ContentCols.filter(this._diaplayFinder).eq(nextCell);
                        }
                        else
                            $ContentCol = $ContentCols.filter(this._diaplayFinder).eq(!this.gridInstance.model.allowGrouping || !ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate) ? nextCell : nextCell + this.gridInstance.model.groupSettings.groupedColumns.length);
                        $ContentCol.width(newWidth);
                        this.gridInstance._findColumnsWidth();
                        if (this.gridInstance.model.scrollSettings.frozenColumns > 0 && $(this._target).parent('tr').parents('div:first').hasClass('e-frozenheaderdiv')) {
                            this.gridInstance.getHeaderContent().find('.e-frozenheaderdiv').width(this._newWidth);
                            this.gridInstance.getContent().find('.e-frozencontentdiv').width(this._newWidth);
                            this.gridInstance.setWidthToColumns()
                        }
                    }
                    else if (this.gridInstance.model.scrollSettings.frozenColumns > 0 && $(this._target).parent('tr').parents('div:first').hasClass('e-frozenheaderdiv')) {
                        this.gridInstance.getHeaderContent().find('.e-frozenheaderdiv').width(this._newWidth);
                        this.gridInstance.getContent().find('.e-frozencontentdiv').width(this._newWidth);
                    }
                    else if (!this.gridInstance.model.scrollSettings.frozenColumns) {
                        var oldTableWidth = this.gridInstance.getHeaderTable().width();
                        this.gridInstance.getHeaderTable().width(oldTableWidth + parseInt(_extra));
                        this.gridInstance.getContentTable().width(oldTableWidth + parseInt(_extra));
                        this.gridInstance.model.scrollSettings.width += parseInt(_extra);
                        if (this.gridInstance.getContent().width() > this.gridInstance.getContentTable().width()) {
                            this.gridInstance.getContentTable().addClass('e-tableLastCell');
                            this.gridInstance.getHeaderTable().addClass('e-tableLastCell');
                        }
                        else {
                            this.gridInstance.getContentTable().removeClass('e-tableLastCell');
                            this.gridInstance.getHeaderTable().removeClass('e-tableLastCell');
                        }
                    }
                    if (!(browser.browser == "msie") && this.gridInstance.model.allowScrolling && this.gridInstance.model.scrollSettings.frozenColumns == 0) {
                        this.gridInstance.getHeaderTable().width("100%");
                        this.gridInstance.getContentTable().width("100%");
                        var tableWidth = this.gridInstance._calculateWidth();
                        if (tableWidth <= this.gridInstance.getContentTable().width() || this.gridInstance.getHeaderTable().width() > this.gridInstance.getContentTable().width()) {
                            this.gridInstance.getHeaderTable().width(tableWidth);
                            this.gridInstance.getContentTable().width(tableWidth);
                        }
                    }
                    if (this.gridInstance.model.allowResizing && this.gridInstance.getHeaderTable().find(".e-columnheader").css('cursor') == 'default') {
                        var cellIndex = this._currentCell;
                        var target = $(this._target), columnIndex = [], col = [];
                        var newWidth = _oldWidth + _extra;
                        var args = {};
                        if (this.gridInstance.model.showStackedHeader && target.hasClass("e-stackedHeaderCell")) {
                            var rowindex = target.parent(".e-stackedHeaderRow").index();
                            var stackedHeaderCell = target.parent(".e-stackedHeaderRow").children()[this._cellIndex].cellIndex;
                            var stackedHeaderColumns = this.gridInstance.model.stackedHeaderRows[rowindex].stackedHeaderColumns[stackedHeaderCell].column;
                            var columns = stackedHeaderColumns;
                            if (!(stackedHeaderColumns instanceof Array))
                                columns = stackedHeaderColumns.split(",");
                            for (var i = 0 ; i < columns.length; i++) {
                                var index = this.gridInstance.getColumnIndexByField(columns[i]);
                                columnIndex.push(index)
                                col.push(this.gridInstance.model.columns[index]);
                            }
                            args = { columnIndex: columnIndex, column: col, oldWidth: _oldWidth, newWidth: newWidth };
                        }
                        else
                        args = { columnIndex: cellIndex, column: this.gridInstance.model.columns[cellIndex], oldWidth: _oldWidth, newWidth: newWidth };
                        this.gridInstance._trigger("resized", args);
                    }
                    if (this.gridInstance.model.allowScrolling) {
                        this.gridInstance._scrollObject.refresh(this.gridInstance.model.scrollSettings.frozenColumns > 0);
                        if (!scrollContent && $content.find("div").hasClass("e-content"))
                            this.gridInstance.refreshScrollerEvent();
                        this.gridInstance._isHscrollcss();
                    }
                }

            }

            this._target = null;
            this._$visualElement.remove();
            this._expand = false;
            this._currentCell = -1;
            this._allowStart = false;

        },
        _getFrozenResizeWidth: function () {
            var $frozenColumnsCol = this.gridInstance.getHeaderTable().find('colgroup').find("col").slice(0, this.gridInstance.model.scrollSettings ? this.gridInstance.model.scrollSettings.frozenColumns : 0), width = 0;
            for (var i = 0; i < $frozenColumnsCol.length; i++) {
                if ($frozenColumnsCol.eq(i).css("display") != "none")
                    width += parseInt($frozenColumnsCol[i].style.width.replace("px", ""));
            }
            return width;
        },
        _diaplayFinder: function () {
            return $(this).css('display') != 'none';
        },
        _resizeColumnUsingDiff: function (_oldWidth, _extra) {
            var proxy = this, _extraVal;			
            this._currntCe = this._currentCell;
            
            var $headerCols = this.gridInstance.getHeaderTable().find('colgroup').find("col");
            var $ContentCols = this.gridInstance.getContentTable().find('colgroup').find("col");
            if (!ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate || this.gridInstance.model.childGrid)) {
                this.gridInstance._detailColsRefresh();
                $headerCols = this.gridInstance._$headerCols;
                $ContentCols = this.gridInstance._$contentCols;
            }
            var $headerCol = $headerCols.filter(this._diaplayFinder).eq(!this.gridInstance.model.allowGrouping || !ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate || this.gridInstance.model.childGrid) ? this._currentCell : this._currentCell + this.gridInstance.model.groupSettings.groupedColumns.length)
                    , $ContentCol, $footerCol, $frozenCols = $headerCols.slice(0, this.gridInstance.model.scrollSettings ? this.gridInstance.model.scrollSettings.frozenColumns : 0);
            var colWidth = $headerCol[0].style.width, isPercent = colWidth.indexOf("%") != -1;
            var _inlineWidth = (!colWidth || isPercent)? $(this._target).outerWidth() : colWidth;
            var indent = !isPercent ? _oldWidth / parseInt(_inlineWidth) : 1;
            _extraVal = _extra = _extra / indent
            var _newWidth = this._newWidth = parseInt(_extra) + parseInt(_inlineWidth);
            if (_newWidth > 0 && _extra != 0) {
                if (_newWidth < this._colMinWidth)
                    _newWidth = this._colMinWidth;
                var _extra = _newWidth - _oldWidth;
                if (this.gridInstance.model.scrollSettings && this.gridInstance.model.scrollSettings.frozenColumns) {
                    if (this._currentCell >= 0 && this._currentCell < this.gridInstance.model.scrollSettings.frozenColumns && this._getFrozenResizeWidth() + _extra > this.gridInstance.element.find(".e-headercontent").first().width())
                        return;
                    $ContentCol = $ContentCols.filter(this._diaplayFinder).eq(this._currentCell);
                }
                else
                    $ContentCol = $ContentCols.filter(this._diaplayFinder).eq(!this.gridInstance.model.allowGrouping || !ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate || this.gridInstance.model.childGrid) ? this._currentCell : this._currentCell + this.gridInstance.model.groupSettings.groupedColumns.length);
                if (this.gridInstance.model.showSummary) {
                    this._$footerCols = this.gridInstance.getFooterTable().find('colgroup').find("col");
                    var colCount = this.gridInstance.model.columns.length;
                    if (this._$footerCols.length > colCount) this._$footerCols.splice(0, (this._$footerCols.length - colCount));
                    $footerCols = this._$footerCols;
                    $footerCol = $footerCols.filter(this._diaplayFinder).eq(this._currentCell);
                    $footerCol.outerWidth(_newWidth);
                }
                if ($(this._target).parent('tr').hasClass('e-stackedHeaderRow')) {
                    this._resizeStackedHeaderColumn($(this._target).parent('tr'), _extraVal, this._currntCe);
                }
                else
                    $headerCol.outerWidth(_newWidth);
                if ($(this._target).parent('tr').hasClass('e-stackedHeaderRow')) {
                    if (this.gridInstance.model.groupSettings.groupedColumns.length) {
                        var $tables = this.gridInstance.getContentTable().find(".e-recordtable");
                        var $colGroup = $tables.find("colgroup");
                        for (var i = 0; i < this._changedcell.length; i++) {
                            var cellIndex = this._changedcell[i];
                            for (var j = 0 ; j < $colGroup.length; j++) {
                                var visibleCols = $($colGroup[j]).children().filter(this._diaplayFinder);
                                var width = parseInt((_extraVal)) + parseInt(visibleCols[cellIndex].style.width);
                                if (width < this._colMinWidth)
                                    width = this._colMinWidth
                                $(visibleCols[cellIndex]).width(width);
                            }
                        }
                    }
                    var length = this.gridInstance.getContentTable().find('colgroup').find("col").filter(this._diaplayFinder).length;
                    for (var i = 0; i < this._changedcell.length; i++) {
                        var $conCol = this.gridInstance.getContentTable().find('colgroup').find("col").filter(this._diaplayFinder)[this._changedcell[i]]
                        var width = parseInt((_extraVal)) + parseInt($conCol.style.width);
                        if (width < this._colMinWidth)
                            width = this._colMinWidth
                        $($conCol).outerWidth(width);
                        if (this.gridInstance.model.isEdit && (this.gridInstance.model.allowGrouping && this.gridInstance.model.groupSettings.groupedColumns.length == 0)) {
                            $sEditCol = this.gridInstance.getContentTable().find(".gridform").find("colgroup col").filter(this._diaplayFinder)[this._changedcell[i]];
                            $($sEditCol).outerWidth(width);
                        }
                    }
                }
                else {
                    if (this.gridInstance.model.groupSettings && this.gridInstance.model.groupSettings.groupedColumns.length) {
                        var $tables = this.gridInstance.getContentTable().find(".e-recordtable");
                        var $colGroup = $tables.find("colgroup");
                        var cellIndex = this._currentCell;
                        var colCount = this.gridInstance.getVisibleColumnNames().length;
                        if (this.gridInstance.getContentTable().find('.e-detailrow').length)
                            $colGroup = $colGroup.not($tables.find(".e-detailrow").find("colgroup")).get();
                        for (var i = 0 ; i < $colGroup.length; i++) {
                            var cols = $($colGroup[i]).find("col").filter(this._diaplayFinder);
                            if (cols.length > colCount) cols.splice(0, (cols.length - colCount));
                            $(cols[cellIndex]).width(_newWidth);
                        }
                    }
                    $ContentCol.outerWidth(_newWidth);
                    if (this.gridInstance.model.isEdit) {
                        var $editableRow = this.gridInstance.getContentTable().find(".e-editedrow,.e-addedrow");
                        var $editCols = $editableRow.find("table").find("colgroup col");
                        var addCol;
                        if ($editableRow.hasClass("e-addedrow") && this.gridInstance.model.groupSettings.groupedColumns.length)
                            addCol = this._currentCell + this.gridInstance.model.groupSettings.groupedColumns.length - 1;
                        else
                            addCol = this._currentCell;
                        var $editCol = $editCols.filter(this._diaplayFinder).eq(addCol);
                        $editCol.outerWidth(_newWidth);
                    }
                }
                this.gridInstance._findColumnsWidth();
                if (this.gridInstance.model.scrollSettings && this.gridInstance.model.scrollSettings.frozenColumns && ej.getObject("resizeSettings.resizeMode", this.gridInstance.model) != ej.Grid.ResizeMode.NextColumn) {
                    var frozenColumns = this.gridInstance.getContentTable().find('colgroup').find("col").slice(0, this.gridInstance.model.scrollSettings.frozenColumns)
                        , width = 0, direction;
                    for (i = 0; i < frozenColumns.length; i++)
                        width += frozenColumns[i].style.display == 'none' ? 0 : parseInt(frozenColumns[i].style.width.replace("px", ""));
                    this.gridInstance.getHeaderContent().find(".e-frozenheaderdiv").width(width);
                    direction = this.gridInstance.model.enableRTL ? "margin-right" : "margin-left";
                    this.gridInstance.getContent().find(".e-frozencontentdiv").width(width).next().css(direction, width + "px");
                    this.gridInstance.getHeaderContent().find(".e-frozenheaderdiv").width(width).next().css(direction, width + "px");
                    this.gridInstance.model.showSummary && this.gridInstance.getFooterContent().find(".e-frozenfooterdiv").width(width);
                }
                this.gridInstance.getHeaderTable().find(".e-columnheader").css("cursor", "default");
            }
        },
        _resizeStackedHeaderColumn: function (currentTr, extra, currentCell) {
            // var currentIndex = this._currntCe;
            this._changedcell = [];
            var headerCells = this.gridInstance.getHeaderContent().find(".e-headercell").not(".e-detailheadercell");
            var preCol = 0, limit = 0, currentTh = headerCells[currentCell], currentSpan = $(currentTh).attr('colspan'), commonExtra = extra / currentSpan, tr = $(currentTh).parent('tr');
            var nextTr = tr.next();
            var currentIndex = currentTh.cellIndex;
            if (this.gridInstance.model.groupSettings.showGroupedColumn) {
                limit = this.gridInstance.model.groupSettings.groupedColumns.length;
                preCol += limit
            }
            while (currentIndex > limit) {
                currentIndex--;
                var th = $(tr).children('th').not(".e-detailheadercell")[currentIndex];
                preCol += parseInt($(th).attr('colspan'));
            }
            this._currentCell = preCol;
            var length = preCol + parseInt(currentSpan);
            for (var i = preCol; i < length; i++) {
                var $colG = this.gridInstance.getHeaderTable().find('col').filter(this._diaplayFinder)[i];
                this._changedcell.push(i - limit)
                var width = parseInt(extra) + parseInt($colG.style.width);
                if (width < this._colMinWidth)
                    width = this._colMinWidth;
                $($colG).outerWidth(width);
             }
        },
        _triggerResizeEvents: function (event, _x) {
            var _rowobj = this.gridInstance.getHeaderTable().find(".e-columnheader");
            var _childTH = _rowobj.find(".e-headercell").filter(":visible");
            var cellIndex = this._cellIndex;
            var target = $(this._target), columnIndex = []; col = [];
            if (event == "resizeStart") {
                this._orgX = _x;
                cellIndex = this._cellIndex = this._getCellIndex(this, _x);
            }
            var _outerCell = _childTH[this._currentCell];
            var _oldWidth = _outerCell.offsetWidth;
            if (this.gridInstance.model.showStackedHeader && target.hasClass("e-stackedHeaderCell")) {
                var rowindex = target.parent(".e-stackedHeaderRow").index();
                var stackedHeaderCell = target.parent(".e-stackedHeaderRow").children()[this._cellIndex].cellIndex;
                var stackedHeaderColumns = this.gridInstance.model.stackedHeaderRows[rowindex].stackedHeaderColumns[stackedHeaderCell].column;
                var columns = stackedHeaderColumns;
                if (!(stackedHeaderColumns instanceof Array))
                    columns = stackedHeaderColumns.split(",");
                for (var i = 0 ; i < columns.length; i++) {
                    var index = this.gridInstance.getColumnIndexByField(columns[i]);
                    columnIndex.push(index)
                    col.push(this.gridInstance.model.columns[index]);
                }
            }
            if (event == "resizeStart") {
                var args = {};
                if (this.gridInstance.model.showStackedHeader && target.hasClass("e-stackedHeaderCell")) {
                    args = { columnIndex: columnIndex, column: col, target: target, oldWidth: _oldWidth };
                }
                else
                    args = { columnIndex: cellIndex, column: this.gridInstance.model.columns[cellIndex], target: $(_outerCell), oldWidth: _oldWidth };
                return this.gridInstance._trigger("resizeStart", args);
            }
            else {
                var _childth = _rowobj.find(".e-headercell").not(".e-detailheadercell").filter(":visible");
                var _extra = _x - this._orgX;
                var newWidth = _oldWidth + _extra;
                this.gridInstance._colgroupRefresh();
                var args = {};
                if (this.gridInstance.model.showStackedHeader && target.hasClass("e-stackedHeaderCell")) {
                    args = { columnIndex: columnIndex, column: col, target: $(_outerCell), oldWidth: _oldWidth, newWidth: newWidth, extra: _extra };
                }
                else
                    args = { columnIndex: cellIndex, column: this.gridInstance.model.columns[cellIndex], target: $(_outerCell), oldWidth: _oldWidth, newWidth: newWidth, extra: _extra };
                return this.gridInstance._trigger("resizeEnd", args);
            }
        },
        _mouseUp: function (e) {
            if (this.gridInstance._resizeTimeOut){
                clearTimeout(this.gridInstance._resizeTimeOut);
                this.gridInstance._resizeTimeOut = 0;
            }
            if (this._expand) {
                var _x = e.clientX, _y = e.clientY;
                if (navigator.userAgent.indexOf("WebKit") != -1) {
                    _x = e.pageX;
                    _y = e.pageY;
                }
                if (this.gridInstance.model.allowResizing && this.gridInstance.getHeaderTable().find(".e-columnheader").css('cursor') == 'col-resize') {
                    if (this._triggerResizeEvents("resizeEnd", _x)) {
                        this.gridInstance.element.find(".e-reSizeColbg").remove();
                        return;
                    }
                }
                _x += document.documentElement.scrollLeft;
                this._reSize(_x, _y);
                if (!ej.isNullOrUndefined(this._currntCe) && this._currntCe >= 0)
                    this.gridInstance.model.columns[this._currntCe].width = this.gridInstance.columnsWidthCollection[this._currntCe];
            }
        },
        _getResizableCell: function () {
            var row;
            if ($(this._target).hasClass('e-stackedHeaderCell'))
                row = this.gridInstance.getHeaderTable().find(".e-columnheader");
            else
                row = this.gridInstance.getHeaderTable().find(".e-columnheader").not('.e-stackedHeaderRow');
            var cell = row.find(".e-headercell").not(".e-hide,.e-detailheadercell");
            var scrollLeft = navigator.userAgent.indexOf("WebKit") != -1 ? document.body.scrollLeft : document.documentElement.scrollLeft;
            for (var i = 0; i < cell.length; i++) {
                point = cell[i].getBoundingClientRect();
                var xlimit = point.left + scrollLeft + 5;
                if (xlimit > this._orgX && $(cell[i]).height() + point.top >= this._orgY) {
                    this._currentCell = i - 1;
                    return;
                }
                if (i == cell.length - 1 || (this.gridInstance.model.showStackedHeader && $(this._target).get(0) === cell[i])) {
                    this._currentCell = i;
                    return;
                }
            }
        },
        _moveVisual: function (_x) {
            /// Used to move the visual element in mouse move
            var _bounds = this.gridInstance.getHeaderContent().find("div").first()[0].getBoundingClientRect();
            if ((_bounds.left + document.documentElement.scrollLeft + _bounds.width < _x) || (_x < _bounds.left + document.documentElement.scrollLeft))
                this._$visualElement.remove();
            else if (this._currentCell != -1)
                this._$visualElement.css({ left: _x, top: this._tableY });
        },
        _mouseDown: function (e) {
            if (this._allowStart && ($(e.target).closest("tr").css("cursor") == 'col-resize')) {
                this._target = e.target;
                var _x = e.clientX, _y = e.clientY;
                if (navigator.userAgent.indexOf("WebKit") != -1) {
                    _x = e.pageX;
                    _y = e.pageY - document.body.scrollTop;
                }
                if (this.gridInstance.model.allowResizing && this.gridInstance.getHeaderTable().find(".e-columnheader").css('cursor') == 'col-resize') {
                    if ($(e.target).is(".e-headercelldiv"))
                        e.target = e.target.parentNode;
                    this._target = e.target;
                    if (this._triggerResizeEvents("resizeStart", _x))
                        return;
                }
                var gridobj = this;
                _x += document.documentElement.scrollLeft;
                if (e.button != 2)
                    this._start(_x, _y);
                return false;
            }
            return true;
        },
        _columnResizeToFit: function (e) {
            var resize = this.gridInstance.getHeaderTable().find(".e-columnheader").filter(function (e) {
                return $(this).css("cursor") == "col-resize";
            });
            if (this.gridInstance.model.allowResizeToFit && resize.length) {
                if ($(e.target).is(".e-headercelldiv"))
                    e.target = e.target.parentNode;
                var $target = $(e.target);
                var headerCells, preCol = 0, indent = 0;
                if ($target.hasClass('e-stackedHeaderCell'))
                    headerCells = this.gridInstance.getHeaderContent().find(".e-headercell").not(".e-detailheadercell");
                else
                    headerCells = this.gridInstance.getHeaderContent().find(".e-headercell").not(".e-stackedHeaderCell,.e-detailheadercell");
                this._target = $target;
                if ($target.hasClass("e-headercell")) {
                    var targetCell = e.target;
                    var hCellIndex = $.inArray(targetCell, headerCells);
                    var cellIndex = hCellIndex;
                    this._orgX = e.pageX;
                    if(!this.gridInstance.model.enableRTL) 
						this._getResizableCell();
					else
						this._currentCell = hCellIndex;
                    if (hCellIndex != this._currentCell) {
                        hCellIndex = cellIndex = this._currentCell;
                        targetCell = e.target.previousSibling;
                    }
                    var currentTh = headerCells.filter(":visible")[cellIndex], changesCellIndex = [], changesFinalWdith = [], changesOldWidth = [];
                    indent = this.gridInstance.model.groupSettings.groupedColumns.length;
                    if (!ej.isNullOrUndefined(this.gridInstance.model.detailsTemplate) || !ej.isNullOrUndefined(this.gridInstance.model.childGrid))
                        indent += 1;
                    if ($(targetCell).parent("tr").hasClass('e-stackedHeaderRow')) {
                        currentSpan = $(currentTh).attr('colspan'), tr = $(currentTh).parent('tr'), tHeadIndex = currentTh.cellIndex;
                        var nextTr = tr.next();
                        while (tHeadIndex > indent) {
                            tHeadIndex--
                            var th = $(tr).children('th')[tHeadIndex];
                            preCol += parseInt($(th).attr('colspan'))
                        };
                        var length = preCol + parseInt(currentSpan);
                    }
                    else {

                        preCol = cellIndex; length = cellIndex + 1;
                    }
                    var finalWidth = 0, headerWidth = 0, contentWidth = 0, argCols = [], argExtra = [];
                    if (preCol != -1) {
                        var hiddenLen = headerCells.slice(0, preCol + 1).filter(".e-hide").length;
                        var args = { columnIndex: preCol + hiddenLen, column: this.gridInstance.model.columns[preCol + hiddenLen], target: $target, oldWidth: oldWidth };
                        this.gridInstance._trigger("resizeStart", args);
                        for (var i = preCol; i < length; i++) {
                            hiddenLen = headerCells.slice(0, i + 1).filter(".e-hide").length;
                            contentWidth = this._getContentWidth(i + hiddenLen);
                            $cellDiv = this.gridInstance.getHeaderTable().find('.e-headercell:not(.e-hide, .e-stackedHeaderCell)').children(".e-headercelldiv").eq(i);
                            headerWidth = this._getHeaderContentWidth($cellDiv);
                            finalWidth = headerWidth > contentWidth ? headerWidth : contentWidth;
                            finalWidth += parseInt($cellDiv.css("padding-left"), 10);
                            var oldWidth = this.gridInstance.getHeaderTable().find('col').filter(this._diaplayFinder).eq(i + indent).width();
                            finalWidth = oldWidth > finalWidth ? finalWidth : (this._colMinWidth < finalWidth ? finalWidth : this._colMinWidth);

                            var headerCols = this.gridInstance.getHeaderTable().find('col').filter(this._diaplayFinder);
                            if(this.gridInstance.model.detailsTemplate || this.gridInstance.model.childGrid)
                                headerCols.splice(0, 1);
                            headerCols.eq(i + indent).width(finalWidth);
                            if (this.gridInstance.model.groupSettings.groupedColumns.length) {
                                var $colGroups = this.gridInstance.getContentTable().find('.e-recordtable').find('colgroup');
                                var proxy = this;
                                $.each($colGroups, function (indx, colgroup) {
                                    $(colgroup).find('col').filter(proxy._diaplayFinder).eq(i).width(finalWidth);
                                });
                            }
                            var contentCols = this.gridInstance.getContentTable().find('col').filter(this._diaplayFinder);
                            if(this.gridInstance.model.detailsTemplate || this.gridInstance.model.childGrid)
                                contentCols.splice(0, 1);
                            contentCols.eq(i + indent).width(finalWidth);
                            if (this.gridInstance.model.isEdit) {
                                var $editableCol = this.gridInstance.getContentTable().find(".e-editedrow").find("col");
                                $editableCol.eq(i + indent).width(finalWidth);
                            }
                            argCols.push(this.gridInstance.model.columns[i + hiddenLen]);
                            argExtra.push(Math.abs(finalWidth - oldWidth))
                            changesCellIndex.push(i + hiddenLen); changesFinalWdith.push(finalWidth); changesOldWidth.push(oldWidth);
                            if (this.gridInstance.model.scrollSettings.frozenColumns > 0 || (this.gridInstance.model.groupSettings.groupedColumns.length && this.gridInstance.model.isEdit)) {
                                var colIndex = i + hiddenLen;
                                this.gridInstance.columnsWidthCollection[colIndex] = finalWidth;
                                this.gridInstance.setWidthToColumns();
                                if (this.gridInstance.model.scrollSettings.frozenColumns <= colIndex + 1) {
                                    this.gridInstance.getHeaderContent().find(".e-movableheader").css("margin-left", finalWidth);
                                    this.gridInstance.getContent().find(".e-movablecontent").css("margin-left", finalWidth);
                                }
                            }
                        }

                    }
                    this.gridInstance._colgroupRefresh();
                    this.gridInstance._recalculateIndentWidth();
                    args = { columnIndex: changesCellIndex, column: argCols, target: currentTh, oldWidth: changesOldWidth, newWidth: changesFinalWdith, extra: argExtra };
                    this.gridInstance._trigger("resizeEnd", args);
                    for (var i = 0; i < changesCellIndex.length; i++) {
                        this.gridInstance.columnsWidthCollection[changesCellIndex[i]] = changesFinalWdith[i];
                        this.gridInstance.model.columns[changesCellIndex[i]]["width"] = changesFinalWdith[i];
                    }
                    args = { columnIndex: changesCellIndex, column: argCols, target: currentTh, oldWidth: changesOldWidth, newWidth: changesFinalWdith, extra: argExtra };
                    this.gridInstance._trigger("resized", args);
                    if (this.gridInstance.model.summaryRows.length > 0)
                        this.gridInstance._summaryColRrefresh();
					this.gridInstance._findColumnsWidth();
                }				
            }
        },
        _getContentWidth: function (cellindx) {
            var contentWidth = 0;
            var $span = ej.buildTag('span', {}, {}), proxy = this.gridInstance, tdWidth;
            if (!ej.isNullOrUndefined(proxy._gridRows)) {
                var rows = proxy._gridRows;
                if (this.gridInstance.model.scrollSettings.frozenColumns && cellindx >= this.gridInstance.model.scrollSettings.frozenColumns) {
                    rows = rows[1];
                    cellindx = cellindx - this.gridInstance.model.scrollSettings.frozenColumns;
                }
                $.each(rows, function (indx, row) {
                    if ($(row).is('.e-row,.e-alt_row') && !$(row).is('.e-editedrow')) {
					    var td = $(row).find('td.e-rowcell').eq(cellindx);
					    var content = $(td).html();
					    if (proxy.model.columns[cellindx]["commands"])
					        $span.html($(content).children());
					    else if (td.hasClass("e-validError"))
					        $span.html($(content).attr("value"));
					    else
						    $span.html(content);
					    $(td).html($span);
					    tdWidth = td.find('span:first').width();
					    if (tdWidth > contentWidth)
						    contentWidth = tdWidth;
					    $(td).html(content);
                    }
				});
			}
            proxy._refreshUnboundTemplate(this.gridInstance.getContentTable());
            return contentWidth;
        },
        _getHeaderContentWidth: function ($cellDiv) {
            var headerWidth = 0, $span = ej.buildTag('span', {}, {});
            var content = $cellDiv.html();
            $span.html(content);
            $cellDiv.html($span);
            headerWidth = $cellDiv.find('span:first').width();
            if (this.gridInstance.model.allowFiltering && this.gridInstance.model.filterSettings.filterType == "menu" || this.gridInstance.model.filterSettings.filterType == "excel")
                headerWidth = headerWidth + $cellDiv.parent().find(".e-filtericon").width() + 10;
            $cellDiv.html(content);
            return headerWidth;
        },
    };
})(jQuery, Syncfusion);;

});