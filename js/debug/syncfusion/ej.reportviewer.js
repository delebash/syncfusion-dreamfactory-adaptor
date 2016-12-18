/*!
*  filename: ej.reportviewer.js
*  version : 14.2.0.26
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.globalize","jquery-easing","./../common/ej.core","./../common/ej.data","./../common/ej.touch","./../common/ej.scroller","./ej.editor","./ej.button","./ej.checkbox","./ej.toolbar","./ej.treeview","./ej.splitter","./ej.waitingpopup","./ej.radiobutton","./ej.datepicker","./ej.dropdownlist","./ej.dialog","./../datavisualization/ej.chart","./../datavisualization/ej.map","./../datavisualization/ej.circulargauge","./../datavisualization/ej.lineargauge"], fn) : fn();
})
(function () {
	
/**
* @fileOverview Plugin to style the Html ReportViewer elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author &lt;a href="mailto:licensing@syncfusion.com"&gt;Syncfusion Inc&lt;/a&gt;
*/

(function ($, ej, undefined) {

    

    ej.widget("ejReportViewer", "ej.ReportViewer", {        
        _rootCSS: "e-reportviewer",        
        element: null,        
        model: null,
        validTags: ["div"],

        //#region Defaults
        defaults: {            
            reportServiceUrl: "",
            reportServerId: "",
            reportPath: "",            
            reportServerUrl: "",            
            dataSources: [],            
            parameters: [],            
            exportSettings: {                
                exportOptions: 1 | 2 | 4 | 8 | 16,
                excelFormat: "excel97to2003",
                pptFormat: "powerpoint97to2003",
                wordFormat: "doc"
            },            
            toolbarSettings: {                
                items: 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256| 512,                
                showToolbar: true,                
                templateId: "",                
                click: "",               
                showTooltip: true
            },            
            locale: "en-US",            
            printMode: false,            
            renderMode: 1 | 2,
            printOption: "Default",
            enablePageCache: false,            
            pageSettings: {                
                orientation: null,               
                paperSize: null
            },            
            processingMode: "remote",            
            zoomFactor: 1,            
            isResponsive: true,            
            reportLoaded: null,            
            renderingBegin: null,            
            renderingComplete: null,            
            reportError: null,
            reportExport: null,            
            drillThrough: null,            
            reportPrint: null,
            viewReportClick: null,            
            destroy: null,
            enableNotificationBar: true
        },

        dataTypes: {
            dataSources: "array",
            parameters: "array",
            toolbarSettings: {
                showToolbar: "boolean"
            }
        },
        //#endregion

        //#region Local Members
        _dataSources: null,
        _svg: true,
        _authenticationToken: null,
        _dataRefresh: false,
        _refresh: false,
        _isToolbarClick: false,
        _printMode: false,
        _pageSetup: false,
        _pageModel: null,
        _currentPage: 1,
        _pageLayoutPage: 1,
        _reportParameters: null,
        _reportDataSources: null,
        _reporDataSets: null,
        _zoomLevel: 2,
        _preZoomVal: 1,
        _actionUrl: null,
        _isDocumentMap: false,
        _isPageDocMap: false,
        _pageDocMapFlag: false,
        _childReportAuthentication: null,
        _parents: [],
        _parentPageXY: null,
        _browserInfo: null,
        _isDevice: false,
        _zoomVal: 1,
        _originX: 0,
        _originY: 0,
        _paperName: null,
        _isPercentHeight: -1,
        _isPercentWidth: -1,
        _isHeight: false,
        _isWidth: false,
        _paperOrientation: null,
        _pageCache: {},
        _paperSetup: {
            paperHeight: null,
            paperWidth: null,
            MarginTop: 0.0,
            MarginRight: 0.0,
            MarginBottom: 0.0,
            MarginLeft: 0.0
        },
        _reportAction: {
            reportLoad: 'ReportLoad',
            getDataSourceCredential: 'GetDataSourceCredential',
            validateDSCredential: 'ValidateDSCredential',
            updateDSCredential: 'UpdateDSCredential',
            getParameters: 'GetParameters',
            setParameters: 'SetParameters',
            updateParameters: 'UpdateParameters',
            updateDataSource: 'UpdateDataSource',
            getPageModel: 'GetPageModel',
            getPrintModel: 'GetPrintModel',
            drillDown: 'DrillDown',
            clearCache: 'ClearCache',
            documentMap: 'DocumentMap',
            drillThrough: 'DrillThrough',
            sorting: 'Sorting'
        },
        //#endregion

        _parameters: function (eventArgs) {
            this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getDataSourceCredential, 'dataSources': this.model.dataSources, 'parameters': this.model.parameters }), "_getDataSourceCredential");;
        },

        _dataSources: function (eventArgs) {
            this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getDataSourceCredential, 'dataSources': this.model.dataSources, 'parameters': this.model.parameters }), "_getDataSourceCredential");
        },

        //#region angular
        _tags: [{
            tag: "parameters",
            attr: ["",
                [{
                    tag: "parameter", attr: ["name", "labels", "values", "nullable"]
                }]
            ]
        },
        {
            tag: "dataSources",
            attr: ["",
                [{
                    tag: "datasource", attr: ["name", "value"]
                }]
            ]
        }],
        //#endregion

        //#region Initialization
        _setModel: function (options) {
            var reload = false;
            var update = false;
            for (var prop in options) {
                switch (prop) {
                    case "reportPath":
                    case "reportServerUrl":
                    case "reportServiceUrl":
                        reload = true;
                        break;
                    case "dataSources":
                    case "parameters":
                        this._refresh = true;
                        this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.setParameters, 'parameters': options.parameters }), "_setParameters");
                        break;
                    case "processingMode":
                        update = true;
                        break;
                    case "zoomFactor":
                        this._zoomContainer(options[prop], false);
                        break;
                    case "printMode":
                        this._updatePreviewLayout(options[prop], false);
                        break;
                    case "toolbarSettings":
                        this._updateToolbarmodel();
                        break;
                    case "locale":
                        this._setCultureInfo();
                        break;
                    case "renderMode":
                        this._reInit();
                        break;
                }
            }
            if (update && !reload) {
                this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getDataSourceCredential, 'dataSources': this.model.dataSources, 'parameters': this.model.parameters }), "_getDataSourceCredential");
            }

            if (reload) {
                this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.clearCache }), '_reportReload');
            }
        },

        _reInit: function () {
            this._destroy();
            this._init();
        },

        _destroyEJObjects: function (_ejObjects) {
            for (var i = 0; i < _ejObjects.length; i++) {
                var _ejEle = $(_ejObjects[i]);
                var _ejName = _ejEle.data('ejWidgets');
                if (_ejName) {
                    var _ejObj = _ejEle.data(_ejName[0]);
                    if (_ejObj) {
                        var _ejInnerObjs = _ejObj.element.find('.e-js');
                        if (_ejInnerObjs && _ejInnerObjs.length > 0) {
                            this._destroyEJObjects(_ejInnerObjs);
                        }
                        _ejInnerObjs = null;
                        _ejObj.destroy();
                    }
                }
            }
        },

        _destroy: function () {

            var _ejObjects = this.element.find('.e-js');
            if (_ejObjects && _ejObjects.length > 0) {
                this._destroyEJObjects(_ejObjects);
            }
            _ejObjects = null;

            this._clearPageCache();
            $('#' + this._id + '_exportForm').remove();
            $('#' + this._id + '_toolbar_exportListTip').remove();
            $('#' + this._id + '_toolbar_fittoPagePopup').remove();
            $('#' + this._id + '_rptTooltip').remove();
            $(this.element).find('.e-reportviewer-viewer').remove();
            $('#' + this._id + '_pageInfoPopup').remove();
            $('#' + this._id + '_printPageIframe').remove();
            this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.clearCache }), '_clearCurrentServerCache');
        },

        _init: function () {
            this._svg = (window.SVGSVGElement) ? true : false;
            this._actionUrl = this.model.reportServiceUrl + "/PostReportAction";
            this._authenticationToken = this._getAuthenticationToken();
            this._renderViewer();
            this._initViewer();
            this._on($(window), "resize", this._viewerResize);
            if (this.model.reportServiceUrl) {
                this.doAjaxPost("POST", this._actionUrl, JSON.stringify({
                    'reportAction': this._reportAction.reportLoad, 'controlId': this._id, 'reportPath': this.model.reportPath,
                    'reportServerUrl': this.model.reportServerUrl, 'processingMode': this.model.processingMode
                }), "_reportLoaded");
            }
            this._browserInfo = ej.browserInfo();
        },

        _initViewer: function () {
            this._wireEvents();
            this._initToolbar();
            this._clearPageCache();
            this._currentPage = 1;
            this._pageLayoutPage = this._currentPage;

            if (this.model.pageSettings.paperSize) {
                this._paperName = this.model.pageSettings.paperSize;
                var paperDimension = this._getPaperSize(this.model.pageSettings.paperSize);
                this._paperOrientation = this.model.pageSettings.orientation == "Landscape" ? "Landscape" : "Portrait";
                if (this.model.pageSettings.orientation == "Landscape") {
                    this._paperSetup.paperHeight = paperDimension.width;
                    this._paperSetup.paperWidth = paperDimension.height;
                } else {
                    this._paperSetup.paperHeight = paperDimension.height;
                    this._paperSetup.paperWidth = paperDimension.width;
                }
            }

            if (!this._refresh) {
                this._preZoomVal = 1;
                this._zoomLevel = 2;
            }
            this._isDocumentMap = false;
            this._printMode = this.model.printMode;
            this._isPageDocMap = false;
            this._pageDocMapFlag = false;
            var tbSettings = this.model.toolbarSettings;
            if (!tbSettings.templateId) {
                this._showToolbar(tbSettings.showToolbar);
                this._showPrintButton(tbSettings.items & ej.ReportViewer.ToolbarItems.Print);
                this._showRefreshButton(tbSettings.items & ej.ReportViewer.ToolbarItems.Refresh);
                this._showZoomControl(tbSettings.items & ej.ReportViewer.ToolbarItems.Zoom);
                this._showFittoPage(tbSettings.items & ej.ReportViewer.ToolbarItems.FittoPage);
                this._showExportControls(tbSettings.items & ej.ReportViewer.ToolbarItems.Export);
                this._showPrintPageSetupButton(tbSettings.items & ej.ReportViewer.ToolbarItems.PageSetup);
                this._showExportList();
                this._showPageNavigationControls(tbSettings.items & ej.ReportViewer.ToolbarItems.PageNavigation);
                this._showParameterBlock(tbSettings.items & ej.ReportViewer.ToolbarItems.Parameters);
                this._showPreviewButton(tbSettings.items & ej.ReportViewer.ToolbarItems.PrintLayout);
                this._showDrillThrough(this._parents.length > 0);
                this._showDocumentMap(false);
            }
            this._showViewerBlock(false);
            this._setContainerSize();
            this._showloadingIndicator(true);
        },
        //#endregion

        //-------------------- Render the ReportViewer Ctrl [start] -------------------------//
        _renderPageInfoPopup: function () {
            var pagePopup = $('#' + this._id + '_pageInfoPopup');
            if (!(pagePopup.length > 0)) {
                pagePopup = ej.buildTag("div.e-reportviewer-pagepopupinfo", "", { 'WHITE-SPACE': 'nowrap' }, { id: this._id + '_pageInfoPopup' });
                var pageNoDiv = ej.buildTag("input.e-reportviewer-pagenumber e-reportviewer-elementalignments ejinputtext", "", {}, { 'type': 'text', 'value': this._currentPage, id: this._id + '_popupPageNo' });
                pageNoDiv.css('height', '25.5px');
                pageNoDiv.css('width', '25px');
                pageNoDiv.css('background-color', 'black');
                pageNoDiv.css('color', 'white');
                pageNoDiv.css('border-color', 'black');

                var pageSeparateSpan = ej.buildTag("span.e-reportviewer-popuptotalpage", "", {}, {});
                pageSeparateSpan.append(' / ' + this._pageModel.TotalPages);
                pagePopup.append(pageNoDiv);
                pagePopup.append(pageSeparateSpan);
                $('body').append(pagePopup);
                this._on($('#' + this._id + '_popupPageNo'), "click", this._popupClick);
                this._on($('#' + this._id + '_popupPageNo'), "keypress", this._onkeyPress);
            }

            if (pagePopup.css('display') == 'block') {
                pagePopup.stop().fadeIn();
                pagePopup.stop().fadeOut(3000);
                pagePopup.hide(3000);
            }
            else {
                pagePopup.show();
                pagePopup.stop().fadeIn();
                pagePopup.stop().fadeOut(3000);
                pagePopup.hide(3000);
            }

            var viewerContainer = $('#' + this._id + '_viewerContainer');
            var popupX = (viewerContainer.offset().left + (viewerContainer.width() / 2)) - (pagePopup.width() / 2);
            var popupY = (viewerContainer.offset().top + (viewerContainer.height() / 2)) - (pagePopup.height() / 2);
            pagePopup.css({ 'left': popupX, 'top': popupY });
            this._updatePageNo();
        },

        _renderToolTip: function () {
            var $divTooltip = ej.buildTag("div.e-reportviewer-tbdiv e-reportviewer-tooltip", "", { 'display': 'none' }, { 'id': this._id + '_rptTooltip' });
            var $tooltipHeader = ej.buildTag("span.e-reportviewer-headerspan", "", { 'display': 'block' }, { 'id': this._id + '_rptTooltip_Header' });
            var $tooltipContent = ej.buildTag("span.e-reportviewer-contentspan", "", { 'display': 'block' }, { 'id': this._id + '_rptTooltip_Content' });
            $divTooltip.append($tooltipHeader);
            $divTooltip.append($tooltipContent);
            $('body').append($divTooltip);
        },

        _renderToolBar: function (targetTag) {
            if (!this.model.toolbarSettings.templateId) {
                var div = ej.buildTag("div.e-reportviewer-toolbarcontainer .e-reportviewer-viewer", "", { 'width': '100%' }, { 'id': this._id + '_toolbarContainer' });
                targetTag.append(div);

                if (this._isDevice) {
                    var $ultoolbaritems = ej.buildTag("ul.e-reportviewer-toolbarul", "", {});
                    this._appendToolbarItems($ultoolbaritems, 'export');
                    this._appendToolbarItems($ultoolbaritems, 'gotoparent');
                    this._appendToolbarItems($ultoolbaritems, 'zoomin');
                    this._appendToolbarItems($ultoolbaritems, 'zoomout');
                    this._appendToolbarItems($ultoolbaritems, 'pagefit');
                    this._appendToolbarItems($ultoolbaritems, 'refresh');
                    this._appendToolbarItems($ultoolbaritems, 'documentmap');
                    this._appendToolbarItems($ultoolbaritems, 'parameter');
                    div.append($ultoolbaritems);
                } else {
                    var $ulprintExport = ej.buildTag("ul.e-reportviewer-toolbarul", "", {});
                    this._appendToolbarItems($ulprintExport, 'print');
                    this._appendToolbarItems($ulprintExport, 'export');
                    this._appendToolbarItems($ulprintExport, 'preview');
                    this._appendToolbarItems($ulprintExport, 'pagesetup');
                    div.append($ulprintExport);

                    var $ulnavigate = ej.buildTag("ul.e-reportviewer-toolbarul", "", {});
                    this._appendToolbarItems($ulnavigate, 'gotofirst');
                    this._appendToolbarItems($ulnavigate, 'gotoprevious');
                    this._appendToolbarItems($ulnavigate, 'gotopage');
                    this._appendToolbarItems($ulnavigate, 'gotonext');
                    this._appendToolbarItems($ulnavigate, 'gotolast');
                    this._appendToolbarItems($ulnavigate, 'gotoparent');
                    div.append($ulnavigate);

                    var $ulzoom = ej.buildTag("ul.e-reportviewer-toolbarul", "", {});
                    this._appendToolbarItems($ulzoom, 'zoomin');
                    this._appendToolbarItems($ulzoom, 'zoomout');
                    this._appendToolbarItems($ulzoom, 'zoom');
                    this._appendToolbarItems($ulzoom, 'pagefit');
                    div.append($ulzoom);

                    var $ulro = ej.buildTag("ul.e-reportviewer-toolbarul", "", {});
                    this._appendToolbarItems($ulro, 'refresh');
                    this._appendToolbarItems($ulro, 'documentmap');
                    this._appendToolbarItems($ulro, 'parameter');
                    div.append($ulro);
                    $('#' + this._id + '_toolbar_zoomSelection').ejDropDownList({ height: "27px", width: "75px", change: this._zoomValChange, selectedItem: 2 });
                }
                div.ejToolbar({ enableSeparator: !this._isDevice, click: $.proxy(this._toolbarClick, this) });
            } else {
                var templateDiv = $('#' + this.model.toolbarSettings.templateId);
                targetTag.append(templateDiv);
                templateDiv.ejToolbar({ enableSeparator: true, height: templateDiv.height(), click: this.model.toolbarSettings.click });
                templateDiv.css('display', 'block');
            }
        },

        _appendToolbarItems: function (litag, eletype) {
            var $divouter;
            var localeObj = ej.ReportViewer.Locale[this.model.locale] ? ej.ReportViewer.Locale[this.model.locale] : ej.ReportViewer.Locale["en-us"];
            switch (eletype) {
                case 'print':
                    $divouter = ej.buildTag("li.e-reportviewer-toolbarli", "", {}, {});
                    var $spanprint = ej.buildTag("span.e-reportviewer-icon e-reportviewer-print", "", {}, { 'id': this._id + '_toolbar_Print' });
                    $divouter.append($spanprint);
                    break;
                case 'export':
                    $divouter = ej.buildTag("li.e-reportviewer-toolbarli", "", {}, {});
                    var $spanexport = ej.buildTag("span.e-reportviewer-icon e-reportviewer-export", "", {}, { 'id': this._id + '_ejtb_export' });
                    $divouter.append($spanexport);
                    break;
                case 'pagesetup':
                    $divouter = ej.buildTag("li.e-reportviewer-toolbarli", "", {}, {});
                    var $spanpagesetup = ej.buildTag("span.e-reportviewer-icon e-reportviewer-pagesetup", "", {}, { 'id': this._id + '_ejtb_PageSetup' });
                    $divouter.append($spanpagesetup);
                    break;
                case 'gotofirst':
                    $divouter = ej.buildTag("li.e-reportviewer-toolbarli", "", {}, {});
                    var $spangotofirst = ej.buildTag("span.e-reportviewer-icon e-reportviewer-gotofirst", "", {});
                    $divouter.append($spangotofirst);
                    break;
                case 'gotolast':
                    $divouter = ej.buildTag("li.e-reportviewer-toolbarli", "", {}, {});
                    var $spangotolast = ej.buildTag("span.e-reportviewer-icon e-reportviewer-gotolast", "", {});
                    $divouter.append($spangotolast);
                    break;
                case 'gotonext':
                    $divouter = ej.buildTag("li.e-reportviewer-toolbarli", "", {}, {});
                    var $spangotonext = ej.buildTag("span.e-reportviewer-icon e-reportviewer-gotonext", "", {});
                    $divouter.append($spangotonext);
                    break;
                case 'gotoprevious':
                    $divouter = ej.buildTag("li.e-reportviewer-toolbarli", "", {}, {});
                    var $spangotoprevious = ej.buildTag("span.e-reportviewer-icon e-reportviewer-gotoprevious", "", {});
                    $divouter.append($spangotoprevious);
                    break;
                case 'gotoparent':
                    $divouter = ej.buildTag("li.e-reportviewer-toolbarli", "", {}, {});
                    var $spangotoparentreport = ej.buildTag("span.e-reportviewer-icon e-reportviewer-gotoparent", "", {});
                    $divouter.append($spangotoparentreport);
                    break;
                case 'gotopage':
                    $divouter = ej.buildTag("div.e-reportviewer-tbpage", "", { 'display': 'block' }, {});
                    var $inputpageno = ej.buildTag("input.e-reportviewer-pagenumber e-reportviewer-elementalignments ejinputtext", "", {}, { 'type': 'text', 'value': '0', 'id': this._id + '_txtpageNo', 'data-role': 'none' });
                    var $spanpageno = ej.buildTag("span.e-reportviewer-labelpageno", "", {}, {});
                    $divouter.append($inputpageno);
                    $divouter.append($spanpageno);
                    break;
                case 'zoomin':
                    $divouter = ej.buildTag("li.e-reportviewer-toolbarli", "", {}, {});
                    var $spanzoomin = ej.buildTag("span.e-reportviewer-icon e-reportviewer-zoomin", "", {}, { 'id': this._id + '_toolbar_zoomin' });
                    $divouter.append($spanzoomin);
                    break;
                case 'zoomout':
                    $divouter = ej.buildTag("li.e-reportviewer-toolbarli", "", {}, {});
                    var $spanzoomout = ej.buildTag("span.e-reportviewer-icon e-reportviewer-zoomout", "", {}, { 'id': this._id + '_toolbar_zoomout' });
                    $divouter.append($spanzoomout);
                    break;
                case 'zoom':
                    $divouter = ej.buildTag("div.e-reportviewer-ejdropdownlist", "", {}, {});
                    var $sltzoom = ej.buildTag("select.e-reportviewer-tbdiv e-reportviewer-zoomlist", "", {}, { 'id': this._id + '_toolbar_zoomSelection', 'data-role': 'none' });
                    $sltzoom.append("<option>50%</option>");
                    $sltzoom.append("<option>75%</option>");
                    $sltzoom.append("<option Selected>100%</option>");
                    $sltzoom.append("<option>125%</option>");
                    $sltzoom.append("<option>150%</option>");
                    $sltzoom.append("<option>200%</option>");
                    $sltzoom.append("<option>400%</option>");
                    $divouter.append($sltzoom);
                    break;
                case 'pagefit':
                    $divouter = ej.buildTag("li.e-reportviewer-toolbarli", "", {}, {});
                    var $spanexport = ej.buildTag("span.e-reportviewer-icon e-reportviewer-pagefit", "", {}, { 'id': this._id + '_ejtb_fittopage' });
                    $divouter.append($spanexport);
                    break;
                case 'preview':
                    $divouter = ej.buildTag("li.e-reportviewer-toolbarli", "", {}, { 'id': this._id + '_ejtb_preview' });
                    var $spanpreview = ej.buildTag("span.e-reportviewer-icon e-reportviewer-preview", "", {}, {});
                    $divouter.append($spanpreview);
                    break;
                case 'refresh':
                    $divouter = ej.buildTag("li.e-reportviewer-toolbarli", "", {}, {});
                    var $spanrefresh = ej.buildTag("span.e-reportviewer-icon e-reportviewer-refresh", "", {}, { 'id': this._id + '_toolbar_refresh' });
                    $divouter.append($spanrefresh);
                    break;
                case 'documentmap':
                    $divouter = ej.buildTag("li.e-reportviewer-toolbarli", "", {}, { 'id': this._id + '_ejtb_documentmap' });
                    var $spandocumentMap = ej.buildTag("span.e-reportviewer-icon e-reportviewer-documentmap", "", {});
                    $divouter.append($spandocumentMap);
                    break;
                case 'parameter':
                    $divouter = ej.buildTag("li.e-reportviewer-toolbarli", "", {}, { 'id': this._id + '_ejtb_parameter' });
                    var $spanparameter = ej.buildTag("span.e-reportviewer-icon e-reportviewer-parameter", "", {});
                    $divouter.append($spanparameter);
                    break;
                case 'pdf':
                    $divouter = ej.buildTag("li.e-reportviewer-popupli e-pdf", "", {}, { 'id': this._id + '_pdf' });
                    $divouter.append(localeObj['toolbar']['exportformat']['Pdf']);
                    break;
                case 'xls':
                    $divouter = ej.buildTag("li.e-reportviewer-popupli e-excel", "", {}, { 'id': this._id + '_xls' });
                    $divouter.append(localeObj['toolbar']['exportformat']['Excel']);
                    break;
                case 'word':
                    $divouter = ej.buildTag("li.e-reportviewer-popupli e-word", "", {}, { 'id': this._id + '_word' });
                    $divouter.append(localeObj['toolbar']['exportformat']['Word']);
                    break;
                case 'html':
                    $divouter = ej.buildTag("li.e-reportviewer-popupli e-html", "", {}, { 'id': this._id + '_html' });
                    $divouter.append(localeObj['toolbar']['exportformat']['Html']);
                    break;
                case 'ppt':
                    $divouter = ej.buildTag("li.e-reportviewer-popupli e-ppt", "", {}, { 'id': this._id + '_ppt' });
                    $divouter.append(localeObj['toolbar']['exportformat']['PPT']);
                    break;
                case 'fittopage':
                    $divouter = ej.buildTag("li.e-reportviewer-popupli", "", {}, { 'id': this._id + '_fittoPage' });
                    break;
                case 'fittopagewidth':
                    $divouter = ej.buildTag("li.e-reportviewer-popupli e-fitpagewidth", "", { 'padding-right': '5px' }, { 'id': this._id + '_pageWidth', 'isSelect': 'false' });
                    var $spanTagWidth = ej.buildTag("span.e-reportviewer-icon e-reportviewer-emptyconetent", "", { 'padding-right': '4px', 'cursor': 'pointer' }, { 'id': this._id + 'Pagewidthspan', 'fitType': 'PAGEWIDTH' });
                    $divouter.append($spanTagWidth);
                    $divouter.append(localeObj['toolbar']['fittopage']['pageWidth']);
                    break;
                case 'fittowholepage':
                    $divouter = ej.buildTag("li.e-reportviewer-popupli e-fitpageheight", "", { 'padding-right': '5px' }, { 'id': this._id + '_pageHeight', 'isSelect': 'false' });
                    var $spanTagHeight = ej.buildTag("span.e-reportviewer-icon e-reportviewer-emptyconetent", "", { 'padding-right': '4px', 'cursor': 'pointer' }, { 'id': this._id + 'pageheightSpan', 'fitType': 'WHOLEPAGE' });
                    $divouter.append($spanTagHeight);
                    $divouter.append(localeObj['toolbar']['fittopage']['pageHeight']);
                    break;
            }
            litag.append($divouter);
        },

        _renderToolTipExport: function () {
            var $tipExport = ej.buildTag("div.e-reportviewer-tbdiv e-reportviewer-icon e-reportviewer-exporttip", "", { 'display': 'none' }, { 'id': this._id + '_toolbar_exportListTip' });
            this._appendToolbarItems($tipExport, 'pdf');
            this._appendToolbarItems($tipExport, 'xls');
            this._appendToolbarItems($tipExport, 'word');
            this._appendToolbarItems($tipExport, 'html');
            this._appendToolbarItems($tipExport, 'ppt');
            return $tipExport;
        },

        _renderPageFitPopup: function () {
            var $tipFittoPage = ej.buildTag("div.e-reportviewer-tbdiv e-reportviewer-icon e-reportviewer-fittopagetip", "", { 'display': 'none' }, { 'id': this._id + '_toolbar_fittoPagePopup' });
            //this._appendToolbarItems($tipFittoPage, 'fittopage');
            this._appendToolbarItems($tipFittoPage, 'fittopagewidth');
            this._appendToolbarItems($tipFittoPage, 'fittowholepage');
            return $tipFittoPage;
        },

        _renderFitopagePopup: function () {
            var pageViewline = $('#' + this._id + '_pageviewOuterline');
            var pageViewerContainer = $('#' + this._id + '_viewerContainer');
            var _pageWidth = $('#' + this._id + '_pageWidth');
            var _pageHeight = $('#' + this._id + '_pageHeight');
            var w = pageViewerContainer.width();
            var h = pageViewerContainer.height();
            var pageW = pageViewline.width();
            var pageH = pageViewline.height();
            if (h > pageH && _pageHeight.attr('isSelect') == 'false') {
                _pageHeight.css('opacity', '0.4');
            } else {
                _pageHeight.css('opacity', '1');
            }
            if (w > pageW && _pageWidth.attr('isSelect') == 'false') {
                _pageWidth.css('opacity', '0.4');
            }
            else {
                _pageWidth.css('opacity', '1');
            }
        },

        //------------------------Render Print Page Setup [Start] ------------------------//

        _showPrintPageSetupButton: function (enable) {
            if (enable) {
                $('#' + this._id + '_toolbarContainer').find('.e-reportviewer-pagesetup').parent().css("display", "block");
            }
            else {
                $('#' + this._id + '_toolbarContainer').find('.e-reportviewer-pagesetup').parent().css("display", "none");
            }
        },

        _renderPrintPageSetup: function () {
            var localeObj = ej.ReportViewer.Locale[this.model.locale] ? ej.ReportViewer.Locale[this.model.locale] : ej.ReportViewer.Locale["en-us"];
            var printPageWidth = null, printPageHeight = null;
            var $printPageSetup = ej.buildTag("div", "", { 'padding-left': '20px' }, { 'id': this._id + '_printPageSetup' });

            var $paperSetup = ej.buildTag("div", "", { 'padding-bottom': '10px' }, { 'id': this._id + '_paperSetup' });
            var $printAlignSetup = ej.buildTag("div", "", {}, { 'id': this._id + '_printAlignSetup' });
            var $defaultSetup = ej.buildTag("div", "", {}, { 'id': this._id + '_defaultSetup' });
            var position = $('#' + this._id + '.e-reportviewer')[0].getBoundingClientRect();

            if (this._browserInfo.name == "msie" && this._browserInfo.version == 8) {
                printPageWidth = position.right;
                printPageHeight = position.bottom;
            }
            else {
                printPageWidth = position.width;
                printPageHeight = position.height;
            }            
            $printPageSetup.ejDialog({ width: 348, position: { X: (position.left + (printPageWidth) / 3) + 20, Y: (position.top + (printPageHeight / 2)) / 2 }, enableModal: false, title: localeObj['toolbar']['pagesetup']['headerText'], enableResize: false, enablePersistance: false, close: $.proxy(this._pageSettingClose, this) });
            var $sizeHeader = ej.buildTag("div", "", { 'font-weight': 'bold' }, { 'id': this._id + '_paperSizeLabel'});
            var $paperSizeType = ej.buildTag("div.e-reportviewer-ejdropdownlist", "", { 'width': '315px', 'padding-bottom': '10px' }, {});
            
            $sizeHeader.append('&nbsp;' + localeObj['pagesetupDialog']['paperSize']);
            $paperSetup.append($sizeHeader);

            $paperSizeDDl = ej.buildTag("select", "", {}, { 'id': this._id + '_PaperSize' });
            $paperSizeDDl.append('<option value="A3">A3</option>');
            $paperSizeDDl.append('<option value="A4">A4</option>');
            $paperSizeDDl.append('<option value="B4(JIS)">B4(JIS)</option>');
            $paperSizeDDl.append('<option value="B5(JIS)">B5(JIS)</option>');
            $paperSizeDDl.append('<option value="Envelope #10">Envelope #10</option>');
            $paperSizeDDl.append('<option value="Envelope Monarch">Envelope Monarch</option>');
            $paperSizeDDl.append('<option value="Executive">Executive</option>');
            $paperSizeDDl.append('<option value="Legal">Legal</option>');
            $paperSizeDDl.append('<option value="Letter">Letter</option>');
            $paperSizeDDl.append('<option value="Tabloid">Tabloid</option>');
            $paperSizeDDl.append('<option value="Custom">Custom</option>');

            $paperSizeType.append($paperSizeDDl);
            $paperSizeDDl.ejDropDownList({ width: '95%', height: '26px', selectedIndex: 10, watermarkText: 'Select Option', change: $.proxy(this._setUpChange, this), enableIncrementalSearch: true });
            $paperSetup.append($paperSizeType);

            var $paperSizeContainer = ej.buildTag("div", "", { 'float': 'left', 'width': '100%', 'padding-left': '4px', 'padding-bottom': '20px', 'padding-top': '5px' }, {});
            var $paperSizeWidthLabel = ej.buildTag("div", "", { 'float': 'left', 'width': '15%', 'margin-top': '4px', 'margin-left': '20px' }, { 'id': this._id + "_widthLabel" });
            var $paperSizeWidth = ej.buildTag("div", "", { 'float': 'left', 'width': '25%' }, {});
            var $paperSizeHeightLabel = ej.buildTag("div", "", { 'float': 'left', 'width': '17%', 'margin-top': '4px' }, { 'id': this._id + "_heightLabel" });
            var $paperSizeHeight = ej.buildTag("div", "", { 'float': 'left', 'width': '25%' }, {});
            var $paperHeightUnitLabel = ej.buildTag("div", "", { 'float': 'left', 'width': '5%', 'margin-top': '4px', 'font-weight': 'bold' }, {'id' : this._id + "_heightUnitLabel"});
            var $paperWidthUnitLabel = ej.buildTag("div", "", { 'float': 'left', 'width': '5%', 'margin-top': '4px', 'font-weight': 'bold' }, { 'id': this._id + "_widthUnitLabel"});

            var $height = ej.buildTag("input.e-reportviewer-textbox", "", { 'margin-right': '5px' }, { 'type': 'text', 'id': this._id + "_paperHeight" });
            var $width = ej.buildTag("input.e-reportviewer-textbox", "", {}, { 'type': 'text', 'id': this._id + "_paperWidth" });
            $paperSizeHeight.append($height);
            $paperSizeWidth.append($width);
            
            $paperSizeHeightLabel.append(localeObj['pagesetupDialog']['height'] + '&nbsp;');
            $paperHeightUnitLabel.append(localeObj['pagesetupDialog']['unit'] + '&nbsp;');
            $paperSizeWidthLabel.append(localeObj['pagesetupDialog']['width'] + '&nbsp;');
            $paperWidthUnitLabel.append(localeObj['pagesetupDialog']['unit'] + '&nbsp;');

            $paperSizeContainer.append($paperSizeHeightLabel);
            $paperSizeContainer.append($paperSizeHeight);
            $paperSizeContainer.append($paperHeightUnitLabel);
            $paperSizeContainer.append($paperSizeWidthLabel);
            $paperSizeContainer.append($paperSizeWidth);
            $paperSizeContainer.append($paperWidthUnitLabel);

            $paperSetup.append($paperSizeContainer);
            $height.ejNumericTextbox({ enableStrictMode: true, width: '75px', minValue: 1, enable: false });
            $width.ejNumericTextbox({ enableStrictMode: true, width: "75px", minValue: 1, enable: false });

            var $marginHeader = ej.buildTag("div", "", { 'padding-top': '10px', 'font-weight': 'bold' }, { 'id': this._id + '_marginheader'});
            var $margins = ej.buildTag("div", "", { 'padding-top': '10px', 'padding-left': '5px' }, {});

            var $tbsubrow1 = ej.buildTag("div", "", { 'float': 'left', 'width': '100%' }, {});
            var $tbsubrow1Cell1 = ej.buildTag("div", "", { 'float': 'left', 'width': '17%', 'margin-top': '4px' }, { 'id': this._id + "_topLabel"});
            var $tbsubrow1Cell2 = ej.buildTag("div", "", { 'float': 'left', 'width': '25%' }, {});
            var $topUnitLabel = ej.buildTag("div", "", { 'float': 'left', 'width': '5%', 'margin-top': '4px', 'font-weight': 'bold' }, { 'id': this._id + "_topUnitLabel"});
            var $tbsubrow1Cell3 = ej.buildTag("div", "", { 'float': 'left', 'width': '15%', 'margin-top': '4px', 'margin-left': '20px' }, { 'id': this._id + "_rightLabel"});
            var $tbsubrow1Cell4 = ej.buildTag("div", "", { 'float': 'left', 'width': '25%' }, {});
            var $rightUnitLabel = ej.buildTag("div", "", { 'float': 'left', 'width': '5%', 'margin-top': '4px', 'font-weight': 'bold' }, { 'id': this._id + "_rightUnitLabel" });

            var $tbsubrow2 = ej.buildTag("div", "", { 'float': 'left', 'width': '100%', 'padding-top': '12px', 'padding-bottom': '18px' }, {});
            var $tbsubrow2Cell1 = ej.buildTag("div", "", { 'float': 'left', 'width': '17%', 'margin-top': '4px' }, { 'id': this._id + "_bottomLabel"});
            var $tbsubrow2Cell2 = ej.buildTag("div", "", { 'float': 'left', 'width': '25%' }, {});
            var $bottomUnitLabel = ej.buildTag("div", "", { 'float': 'left', 'width': '5%', 'margin-top': '4px', 'font-weight': 'bold' }, { 'id': this._id + "_bottomUnitLabel" });
            var $tbsubrow2Cell3 = ej.buildTag("div", "", { 'float': 'left', 'width': '15%', 'margin-top': '4px', 'margin-left': '20px' }, { 'id': this._id + "_leftLabel"});
            var $tbsubrow2Cell4 = ej.buildTag("div", "", { 'float': 'left', 'width': '25%' }, {});
            var $leftUnitLabel = ej.buildTag("div", "", { 'float': 'left', 'width': '5%', 'margin-top': '4px', 'font-weight': 'bold' }, { 'id': this._id + "_leftUnitLabel" });
            
            $marginHeader.append('&nbsp;' + localeObj['pagesetupDialog']['margins']);
            $printAlignSetup.append($marginHeader);

            var $top = ej.buildTag("input.e-reportviewer-textbox", "", { 'margin-right': '5px' }, { 'type': 'text', 'id': this._id + "_paperMarginTop" });
            var $right = ej.buildTag("input.e-reportviewer-textbox", "", {}, { 'type': 'text', 'id': this._id + "_paperMarginRight" });
            var $bottom = ej.buildTag("input.e-reportviewer-textbox", "", { 'margin-right': '5px' }, { 'type': 'text', 'id': this._id + "_paperMarginBottom" });
            var $left = ej.buildTag("input.e-reportviewer-textbox", "", {}, { 'type': 'text', 'id': this._id + "_paperMarginLeft" });
            
            $tbsubrow1Cell1.append(localeObj['pagesetupDialog']['top'] + '&nbsp;');
            $topUnitLabel.append(localeObj['pagesetupDialog']['unit'] + '&nbsp;');
            $tbsubrow1Cell2.append($top);            
            $tbsubrow1Cell3.append(localeObj['pagesetupDialog']['right'] + '&nbsp;');
            $rightUnitLabel.append(localeObj['pagesetupDialog']['unit'] + '&nbsp;');
            $tbsubrow1Cell4.append($right);
            $tbsubrow1.append($tbsubrow1Cell1);
            $tbsubrow1.append($tbsubrow1Cell2);
            $tbsubrow1.append($topUnitLabel);
            $tbsubrow1.append($tbsubrow1Cell3);
            $tbsubrow1.append($tbsubrow1Cell4);
            $tbsubrow1.append($rightUnitLabel);
            $margins.append($tbsubrow1);
            
            $tbsubrow2Cell1.append(localeObj['pagesetupDialog']['bottom'] + '&nbsp;');
            $bottomUnitLabel.append(localeObj['pagesetupDialog']['unit'] + '&nbsp;');
            $tbsubrow2Cell2.append($bottom);            
            $tbsubrow2Cell3.append(localeObj['pagesetupDialog']['left'] + '&nbsp;');
            $leftUnitLabel.append(localeObj['pagesetupDialog']['unit'] + '&nbsp;');
            $tbsubrow2Cell4.append($left);
            $tbsubrow2.append($tbsubrow2Cell1);
            $tbsubrow2.append($tbsubrow2Cell2);
            $tbsubrow2.append($bottomUnitLabel);
            $tbsubrow2.append($tbsubrow2Cell3);
            $tbsubrow2.append($tbsubrow2Cell4);
            $tbsubrow2.append($leftUnitLabel);
            $margins.append($tbsubrow2);
            $printAlignSetup.append($margins);

            $top.ejNumericTextbox({ width: "75px", minValue: 0, maxValue: 22 });
            $right.ejNumericTextbox({ width: "75px", minValue: 0, maxValue: 22 });
            $bottom.ejNumericTextbox({ width: "75px", minValue: 0, maxValue: 22 });
            $left.ejNumericTextbox({ width: "75px", minValue: 0, maxValue: 22 });

            var $orientation = ej.buildTag("div", "", { 'padding-top': '10px', 'font-weight': 'bold' }, { 'id': this._id + '_orientationLabel'});            
            $orientation.append('&nbsp;' + localeObj['pagesetupDialog']['orientation']);
            $printAlignSetup.append($orientation);
            var $radio = ej.buildTag("div", "", { 'width': '100%', 'padding-left': '5px', 'padding-top': '5px' }, {});

            var $radio1 = ej.buildTag("div", "", { 'width': '50%', 'float': 'left' }, {});
            var $radio1div1 = ej.buildTag("div", "", { 'float': 'left', 'margin-top': '2px' }, {});
            var $radio1div2 = ej.buildTag("div", "", { 'float': 'left' }, { 'id': this._id + '_portraitLabel'});

            var $portraitradio = ej.buildTag("input", "", {}, { 'type': 'radio', 'id': this._id + '_portrait', 'value': 'Portrait' });

            $radio1div1.append($portraitradio);            
            $radio1div2.append('&nbsp;' + localeObj['pagesetupDialog']['portrait']);
            $radio1.append($radio1div1);
            $radio1.append($radio1div2);
            $radio.append($radio1);
            $portraitradio.ejRadioButton({ change: $.proxy(this._orientationChanged, this), name: 'orientation', checked: true });

            var $radio2 = ej.buildTag("div", "", { 'width': '50%', 'float': 'left' }, {});
            var $radio2div1 = ej.buildTag("div", "", { 'float': 'left', 'margin-top': '2px' }, {});
            var $radio2div2 = ej.buildTag("div", "", { 'float': 'left' }, { 'id': this._id + '_landscapeLabel' });

            var $landscaperadio = ej.buildTag("input", "", {}, { 'type': 'radio', 'id': this._id + '_landscape', 'value': 'Landscape' });

            $radio2div1.append($landscaperadio);            
            $radio2div2.append("&nbsp;" + localeObj['pagesetupDialog']['landscape']);
            $radio2.append($radio2div1);
            $radio2.append($radio2div2);
            $radio.append($radio2);

            $printAlignSetup.append($radio);
            $landscaperadio.ejRadioButton({ change: $.proxy(this._orientationChanged, this), name: 'orientation' });

            var $confirm = ej.buildTag("div", "", { 'padding-top': '10px', 'float': 'right', 'padding-right': '13px', 'padding-bottom': '10px' }, {});
            
            var $submitButton = ej.buildTag("input.e-reportviewer-viewreportbutton e-btn", "", { 'margin-left': '50px', 'margin-top': '10px', 'min-width': '65px' }, { 'type': 'button', 'value': localeObj['pagesetupDialog']['doneButton'], 'id': this._id + '_Submit' });
            $submitButton.ejButton({ showRoundedCorner: true, height: 30, click: $.proxy(this._pageSetupSubmit, this) });

            var $cancelButton = ej.buildTag("input.e-reportviewer-viewreportbutton e-btn", "", { 'margin-left': '10px', 'margin-top': '10px', 'min-width': '65px' }, { 'type': 'button', 'value': localeObj['pagesetupDialog']['cancelButton'], 'id': this._id + '_Cancel' });
            $cancelButton.ejButton({ showRoundedCorner: true, height: 30, click: $.proxy(this._pageSetupCancel, this) });

            $confirm.append($submitButton);
            $confirm.append($cancelButton);
            $defaultSetup.append($confirm);

            $printPageSetup.append($paperSetup);
            $printPageSetup.append($printAlignSetup);
            $printPageSetup.append($defaultSetup);

            if (this._browserInfo.name == 'msie') {
                $('#' + this._id + '_PaperSize_input').css('margin-top', '-2px');
            } else if (this._browserInfo.name == 'opera' || this._browserInfo.name == 'webkit' || this._browserInfo.name == 'chrome' || this._browserInfo.name == 'mozilla') {
                $('#' + this._id + '_PaperSize_input').css('padding-bottom', '3px');
            }
        },

        //------------------------Render Print Page Setup [End] ------------------------//

        _renderViewerBlockinDevice: function (targetTag) {
            var div = ej.buildTag("div.e-reportviewer-viewer e-reportviewer-viewerblock e-reportviewer-blockstyle", "", {}, { 'id': this._id + '_viewBlockContainer' });
            targetTag.append(div);

            var $innerConetnt = ej.buildTag("div.e-reportviewer-viewerblockcellcontent", "", { 'margin': '1px', 'padding': '1px', 'width': '99%', 'height': '99%', 'display': 'inline-table' });
            var $blockContent = ej.buildTag("div.e-reportviewer-viewerblockcontent", "", { 'width': '100%', 'height': 'auto' });
            var $buttonConetnt = ej.buildTag("div.e-reportviewer-viewreport", "", { 'width': '100%', 'height': '30px', 'border-left': '0px', 'padding': '10px 0' });
            var $button = ej.buildTag("input.e-reportviewer-viewreportbutton e-btn", "", {}, { 'type': 'button', 'value': ej.ReportViewer.Locale[this.model.locale] ? ej.ReportViewer.Locale[this.model.locale]["viewButton"] : ej.ReportViewer.Locale["en-us"]["viewButton"], 'id': this._id + '_viewReportClick', 'data-role': 'none' });
            $buttonConetnt.append($button);
            $innerConetnt.append($blockContent);
            $innerConetnt.append($buttonConetnt);

            $button.ejButton({ showRoundedCorner: true });

            div.append($innerConetnt);
            return div;
        },

        _renderViewerBlockinWeb: function (targetTag) {
            var div = ej.buildTag("div.e-reportviewer-viewer e-reportviewer-viewerblock", "", {}, { 'id': this._id + '_viewBlockContainer' });
            targetTag.append(div);

            var $innerConetnt = ej.buildTag("table.e-reportviewer-viewerblockcellcontent", "", { 'margin': '1px', 'padding': '5px 5px 10px' });
            var $tr = ej.buildTag("tr", "", { 'width': '100%' });
            var $tdleft = ej.buildTag("td.e-reportviewer-viewerblockcontent", "", {});
            var $tdright = ej.buildTag("td.e-reportviewer-viewreport", "", {});
            var $button = ej.buildTag("input.e-reportviewer-viewreportbutton e-btn", "", {'margin-top':'4px'}, { 'type': 'button', 'value': ej.ReportViewer.Locale[this.model.locale] ? ej.ReportViewer.Locale[this.model.locale]["viewButton"] : ej.ReportViewer.Locale["en-US"]["viewButton"], 'id': this._id + '_viewReportClick', 'data-role': 'none' });
			$button.ejButton({ height: 30 });
            $tdright.append($button);
            $tr.append($tdleft);
            $tr.append($tdright);
            $innerConetnt.append($tr);

            $button.ejButton({ showRoundedCorner: true });

            div.append($innerConetnt);
            return div;
        },

        _renderViewerContainer: function (targetTag) {
            var div = ej.buildTag("div", "", {}, { 'id': this._id + '_reportviewerContainer' });
            targetTag.append(div);

            var $reportviewContainer = ej.buildTag("div.e-reportviewer-viewer e-reportviewer-scrollcontainer e-reportviewer-viewercontainer", "", { 'height': '100%', 'width': '100%', 'font-size': '8pt' }, { 'id': this._id + '_viewerContainer' });

            var $loadingindicator = ej.buildTag("div", "", { 'margin': '0px', 'height': '99.8%', 'width': '100%' }, { 'id': this._id + '_loadingIndicator' });
            var $loadingemptybackview = ej.buildTag("div", "", { 'margin': '0px', 'height': '99.8%', 'width': '100%', 'background-color': 'rgba(164, 183, 216, 0.18)', 'display': 'block' }, { 'id': this._id + '_loadingIndicatorBackView' });

            var $pageviewOuterContainer = ej.buildTag("div.e-reportviewer-pageviewcontainer", "", {}, { 'id': this._id + '_pageviewOuterContainer' });
            var $pageviewOuterline = ej.buildTag("div.e-reportviewer-pageouterline", "", {}, { 'id': this._id + '_pageviewOuterline' });
            var $pageviewContainer = ej.buildTag("div.e-reportviewer-pageview", "", { 'background-color': '#FFFFFF' }, { 'id': this._id + '_pageviewContainer' });

            var $pageviewheaderContainer = ej.buildTag("div", "", { 'position': 'relative', 'background-color': 'transparent' }, { 'id': this._id + '_pageviewheaderContainer' });
            var $pageviewbodyContainer = ej.buildTag("div", "", { 'position': 'relative', 'background-color': 'transparent' }, { 'id': this._id + '_pageviewbodyContainer' });
            var $pageviewfooterContainer = ej.buildTag("div", "", { 'position': 'relative', 'background-color': 'transparent' }, { 'id': this._id + '_pageviewfooterContainer' });

            var $pageviewheaderborder = ej.buildTag("div.pageHeaderBorder", "", { 'position': 'relative', 'background-color': '#FFFFFF' });
            var $pageviewbodyborder = ej.buildTag("div.pageBodyBorder", "", { 'position': 'relative', 'background-color': '#FFFFFF' });
            var $pageviewfooterborder = ej.buildTag("div.pageFooterBorder", "", { 'position': 'relative', 'background-color': '#FFFFFF' });

            $pageviewheaderborder.append($pageviewheaderContainer);
            $pageviewbodyborder.append($pageviewbodyContainer);
            $pageviewfooterborder.append($pageviewfooterContainer);
            $pageviewContainer.append($pageviewheaderborder);
            $pageviewContainer.append($pageviewbodyborder);
            $pageviewContainer.append($pageviewfooterborder);

            $loadingindicator.append($loadingemptybackview);
            $reportviewContainer.append($loadingindicator);
            $pageviewOuterline.append($pageviewContainer);
            $pageviewOuterContainer.append($pageviewOuterline);
            $reportviewContainer.append($pageviewOuterContainer);

            if (this._isDevice) {
                this._renderViewerBlockinDevice($reportviewContainer);
            } else {
                var $documentmapcontainer = ej.buildTag("div.e-reportviewer-documentmapcontainer", "", {}, { 'id': this._id + '_documentmapContainer' });
                div.append($documentmapcontainer);
            }

            div.append($reportviewContainer);

            return div;
        },

        _renderViewer: function () {
            var height = this.element.height();
            var width = this.element.width();
            
            var viewer = ej.buildTag("div.e-reportviewer-viewer", "", {});

            if (!this.element[0].style.height && this.element[0].parentElement.clientHeight != 0) {
                this._isHeight = true;
            }

            if (!this.element[0].style.width && this.element[0].parentElement.clientWidth != 0) {
                this._isWidth = true;
            }

            if (height === 0 && this.element[0].parentElement.clientHeight != 0) {
                this.element.height(this.element[0].parentElement.clientHeight);
                //viewer.height(this.element[0].parentElement.clientHeight);
            }

            if (width === 0 && this.element[0].parentElement.clientWidth != 0) {
                this.element.width(this.element[0].parentElement.clientWidth);
                //viewer.width(this.element[0].parentElement.clientWidth);
            }

            this.element.append(viewer);
            if ((this.model.renderMode & ej.ReportViewer.RenderMode.Mobile) && (this.model.renderMode & ej.ReportViewer.RenderMode.Desktop)) {
                this._isDevice = this._isMobileDevice();
            } else if (this.model.renderMode & ej.ReportViewer.RenderMode.Mobile) {
                this._isDevice = true;
            } else {
                this._isDevice = false;
            }
            this._renderToolBar(viewer);
            if (!this._isDevice) {
                this._renderViewerBlockinWeb(viewer);
                this._renderToolTip();
            }
            this._renderViewerContainer(viewer);
        },
        //-------------------- Render the ReportViewer Ctrl [End] -------------------------//

        //-------------------- Render Credential Block and Actions [Start] -------------------------//
        _renderCredentialBlock: function (datasources) {
            var table = ej.buildTag("table", "", {}, {});
            for (var index = 0; index < datasources.length; index++) {
                var datasource = datasources[index];
                var $headertr = ej.buildTag("tr", "", {}, {});
                var $headertd = ej.buildTag("td", "", {}, { 'colspan': !this._isDevice ? '5' : '1' });
                $headertd.html(!this._isDevice ? datasource.Prompt : 'Specify the ' + datasource.Name + ':');
                $headertr.append($headertd);

                if (!this._isDevice) {
                    var $row = ej.buildTag("tr", "", {}, {});
                    this._appendCredentialItems($row, 'namelbl', datasource);
                    this._appendCredentialItems($row, 'nametxt', datasource);
                    $row.append(ej.buildTag("td.e-reportviewer-viewerblockcellcontent", "", { 'width': '7px' }, {}));
                    this._appendCredentialItems($row, 'passwdlbl', datasource);
                    this._appendCredentialItems($row, 'passwdtxt', datasource);

                    table.append($headertr);
                    table.append('<tr height="6px"/>');
                    table.append($row);
                    table.append('<tr height="6px"/>');
                } else {
                    table.append($headertr);
                    table.append('<tr height="4px"/>');

                    var $row1 = ej.buildTag("tr", "", {}, {});
                    this._appendCredentialItems($row1, 'namelbl', datasource);
                    var $row2 = ej.buildTag("tr", "", {}, {});
                    this._appendCredentialItems($row2, 'nametxt', datasource);
                    var $row3 = ej.buildTag("tr", "", {}, {});
                    this._appendCredentialItems($row3, 'passwdlbl', datasource);
                    var $row4 = ej.buildTag("tr", "", {}, {});
                    this._appendCredentialItems($row4, 'passwdtxt', datasource);

                    table.append($row1);
                    table.append($row2);
                    table.append($row3);
                    table.append($row4);
                    table.append('<tr height="6px"/>');
                }
            }
            this._wiredViewClickEvent(datasources);
            var viewerBlock = $('#' + this._id + '_viewBlockContainer').find(".e-reportviewer-viewerblockcontent");
            viewerBlock.append(table);

        },

        _wiredViewClickEvent: function(datasources){
            this._on($('#' + this._id + '_viewReportClick'), "click", { ds: datasources }, this._viewReportCredentialClick);
        },

        _unwiredViewClickEvent: function () {
            this._off($('#' + this._id + '_viewReportClick'), "click", this._viewReportCredentialClick);
        },

        _appendCredentialItems: function (targetTag, eleType, datasource) {
            var $tbcell;
            switch (eleType) {
                case 'namelbl':
                    $tbcell = ej.buildTag("td.e-reportviewer-viewerblockcellcontent", "", {}, {});
                    $tbcell.append('Login Name&nbsp;');
                    break;
                case 'nametxt':
                    $tbcell = ej.buildTag("td.e-reportviewer-viewerblockcellcontent", "", {}, {});
                    var $loginname = ej.buildTag("input.e-reportviewer-textbox", "", {}, { 'type': 'text', 'autocomplete': 'off', 'id': datasource.ControlId + "_loginName" });
                    $tbcell.append($loginname);
                    break;
                case 'passwdlbl':
                    $tbcell = ej.buildTag("td.e-reportviewer-viewerblockcellcontent", "", {}, {});
                    $tbcell.append('Password&nbsp;');
                    break;
                case 'passwdtxt':
                    $tbcell = ej.buildTag("td.e-reportviewer-viewerblockcellcontent", "", {}, {});
                    var $password = ej.buildTag("input.e-reportviewer-textbox", "", {}, { 'type': 'password', 'autocomplete': 'off', 'id': datasource.ControlId + "_password" });
                    $tbcell.append($password);
                    break;
            }
            targetTag.append($tbcell);
        },

        _viewReportCredentialClick: function (event) {
            var datasources = event.data.ds;
            var jsdatasource = [];
            for (var index = 0; index < datasources.length; index++) {
                var datasource = datasources[index];
                var username = $('#' + datasource.ControlId + '_loginName').val();
                var password = $('#' + datasource.ControlId + '_password').val();
                jsdatasource.push({ 'Name': datasource.Name, 'UserName': username, 'Password': password });
            }
            this._dataSources = jsdatasource;
            this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.validateDSCredential, 'datasoures': jsdatasource }), "_validateDSCredential");
        },
        //-------------------- Render Credential Block and Actions [End] -------------------------//

        //-------------------- Render Parameter Block and Actions [Start] -------------------------//
        _renderParameterBlock: function (parameters) {
            var table = ej.buildTag("table", "", {}, { 'isViewClick': false });
            if (this._isDevice) {
                table.css('width', '100%');
            }
            if (parameters != null && parameters.length > 0) {
                var viewerBlock = $('#' + this._id + '_viewBlockContainer').find(".e-reportviewer-viewerblockcontent");
                var isRender = this._onRenderingBegin({ reportParameters: $.extend(true, {}, parameters), parameterBlock: $('#' + this._id + '_viewBlockContainer') });
                if (!isRender) {
                    viewerBlock.html(table);
                    for (var index = 0; index < parameters.length; index++) {
                        var parameter = parameters[index];

                        var tablerow;
                        var $contentDiv;
                        var $tdCell01;
                        var $tdCell02;
                        if (!this._isDevice) {
                            if (index % 2 == 0) {
                                table.append('<tr height="10px"/>');
                                tablerow = ej.buildTag("tr", "", {}, {});
                                table.append(tablerow);
                            } else {
                                var $tdmiddle = ej.buildTag("td", "", { 'width': '15px' }, {});
                                tablerow.append($tdmiddle);
                            }
                            $tdCell01 = ej.buildTag("td.e-reportviewer-viewerblockcellcontent", "", {}, {});
                            $tdCell01.append(parameter.Prompt + '&nbsp;&nbsp;');
                            tablerow.append($tdCell01);
                            $tdCell02 = ej.buildTag("td.e-reportviewer-viewerblockcellcontent", "", { 'min-width': '130px', 'max-width': '185px' }, {});
                            tablerow.append($tdCell02);

                            $contentDiv = ej.buildTag("div", "", { 'width': '100%', 'display': 'flex', 'white-space': 'nowrap' }, { 'id': parameter.ControlId + '_div' });
                            $tdCell02.append($contentDiv);

                        } else {
                            table.append('<tr height="10px"/>');
                            tablerow = ej.buildTag("tr", "", {}, {});
                            table.append(tablerow);
                            $tdCell01 = ej.buildTag("td.e-reportviewer-viewerblockcellcontent", "", {}, {});
                            $tdCell01.append(parameter.Prompt + '&nbsp;&nbsp;');
                            tablerow.append($tdCell01);

                            tablerow = ej.buildTag("tr", "", {}, {});
                            table.append(tablerow);
                            $tdCell02 = ej.buildTag("td.e-reportviewer-viewerblockcellcontent", "", { 'min-width': '130px', 'max-width': '185px' }, {});
                            tablerow.append($tdCell02);

                            $contentDiv = ej.buildTag("div", "", { 'width': '100%', 'display': 'flex', 'white-space': 'nowrap' }, { 'id': parameter.ControlId + '_div' });
                            $tdCell02.append($contentDiv);
                        }
                        this._renderParameterElements(parameter, $contentDiv);
                    }
                }
            }
            else {
                this._showParameterBlock(false);
            }
            table.append('<tr height="10px"/>');
            this._onRenderingComplete({ reportParameters: $.extend(true, {}, parameters) });
            this._on($('#' + this._id + '_viewReportClick'), "click", { params: parameters }, this._viewReportParamsClick);
            return isRender;
        },

        _renderParameterElements: function (parameter, $contentDiv) {
            var indexddl;
            var $parameterSpan;
            var $parameterNull;
            var $optionText;
            if (parameter.IsMultiValue) {
                var itemindex = [];
                var $paramMultiValuedropdown = ej.buildTag("select", "", {}, { 'id': parameter.ControlId, 'name': parameter.Name, 'sf-name': parameter.Name });
                if (parameter.AvailableLabels) {
                    $optionText = $('<option value="parameter_SelectAll">Select All</option>"');
                    $paramMultiValuedropdown.append($optionText);
                    var _selectedFieldVals = $.extend(parameter.DefaultValuesfields, true);
                    if (parameter.Values && parameter.Values.length > 0) {
                        _selectedFieldVals = parameter.Values;
                    }

                    for (var indexddl = 0; indexddl < parameter.AvailableLabels.length; indexddl++) {
                        $optionText = $('<option value="' + parameter.AvailableValues[indexddl] + '">' + parameter.AvailableLabels[indexddl] + '</option>');
                        if (jQuery.inArray(parameter.AvailableValues[indexddl], _selectedFieldVals) != -1) {
                            itemindex.push(indexddl + 1);
                        }
                        $paramMultiValuedropdown.append($optionText);
                    }
                    if (parameter.AvailableValues.length == itemindex.length) {
                        itemindex.push(0);
                    }
                    $contentDiv.append($paramMultiValuedropdown);
                    $paramMultiValuedropdown.ejDropDownList({ width: '95%', height: '26px', showCheckbox: true, selectedIndices: itemindex, watermarkText: 'Select Option', change: parameter.IsDependent ? this._paramsChangeEvent : '', checkChange: this._selectionChanged });
                }
                else if (parameter.DefaultValues) {
                    $optionText = $('<option value="parameter_SelectAll">Select All</option>"');
                    $paramMultiValuedropdown.append($optionText);
                    var _selectedFieldVals = $.extend(parameter.DefaultValuesfields, true);
                    if (parameter.Values && parameter.Values.length > 0) {
                        _selectedFieldVals = parameter.Values;
                    }
                    for (var indexddl = 0; indexddl < parameter.DefaultValues.length; indexddl++) {
                        $optionText = $('<option value="' + parameter.DefaultValues[indexddl] + '">' + parameter.DefaultValues[indexddl] + '</option>');
                        if (jQuery.inArray(parameter.DefaultValues[indexddl], _selectedFieldVals) != -1) {
                            itemindex.push(indexddl + 1);
                        }
                        $paramMultiValuedropdown.append($optionText);
                    }
                    if (parameter.DefaultValues.length == itemindex.length) {
                        itemindex.push(0);
                    }
                    $contentDiv.append($paramMultiValuedropdown);
                    $paramMultiValuedropdown.ejDropDownList({ width: '95%', height: '26px', showCheckbox: true, selectedIndices: itemindex, watermarkText: 'Select Option', change: parameter.IsDependent ? this._paramsChangeEvent : '', checkChange: this._selectionChanged });
                }
            } else if (parameter.AvailableValues != null) {
                var $parameterdropdown = ej.buildTag("select", "", {}, { 'id': parameter.ControlId, 'name': parameter.Name, 'data': 'select', 'sf-name': parameter.Name });
                var selectindex = 9999;
                var isSelectVal = false;
                for (indexddl = 0; indexddl < parameter.AvailableLabels.length; indexddl++) {
                    if (parameter.AvailableLabels[indexddl] != 'Select a value') {
                        $optionText = $('<option value="' + parameter.AvailableValues[indexddl] + '">' + parameter.AvailableLabels[indexddl] + '</option>');
                        if (parameter.AvailableLabels[indexddl] == parameter.Label) {
                            selectindex = indexddl;
                        }
                        $parameterdropdown.append($optionText);
                    } else if (parameter.AvailableLabels[indexddl] == 'Select a value') {
                        isSelectVal = true;
                    }
                }

                if (isSelectVal) {
                    selectindex = selectindex - 1;
                }

                $contentDiv.append($parameterdropdown);
                var _dropDownJson = { width: '95%', height: '26px', watermarkText: 'Select a Value', change: parameter.IsDependent ? this._paramsChangeEvent : '', enableIncrementalSearch: true };
                if (selectindex != 9999) {
                    _dropDownJson.selectedIndex = selectindex;
                }
                $parameterdropdown.ejDropDownList(_dropDownJson);
            } else if (parameter.DataType == "DateTime") {
                var $parameterdatepicker = ej.buildTag("input.e-reportviewer-textbox e-reportviewer-DateTime", "", {}, { 'type': 'text', 'id': parameter.ControlId, 'maxlength': '256', 'name': parameter.Name });
                $contentDiv.append($parameterdatepicker);
                var datestring = ((parameter.Label.indexOf('-')) ? (parameter.Label.replace(/\-/g, "/")) : parameter.Label);
                $parameterdatepicker.ejDatePicker({ width: parameter.IsNullable ? "75%" : "95%", height: '26px', value: parameter.Label != null && parameter.Label.length > 0 ? new Date(datestring ? datestring : parameter.Label) : null, change: parameter.IsDependent ? this._paramsChangeEvent : '', locale: this.model.locale });
                if (parameter.IsNullable) {
                    $parameterSpan = ej.buildTag("span", "", { 'WHITE-SPACE': 'nowrap', 'display': 'block' }, {});
                    $parameterNull = ej.buildTag("input", "", {}, { 'type': 'checkbox', 'name': 'chkDateTime', 'id': parameter.ControlId + '~chk', 'value': this._id });
                    $parameterSpan.append($parameterNull);
                    $parameterSpan.append('&nbsp;<span class=e-reportviewer-label>Null</span>');
                    $contentDiv.append('&nbsp;');
                    $contentDiv.append($parameterSpan);
                    if (parameter.Label != null && parameter.Label.length > 0) {
                        $parameterNull.ejCheckBox({ "change": this._paramNullChange });
                    } else {
                        $parameterNull.ejCheckBox({ "change": this._paramNullChange, checked: true });
                        this._paramElementDisable(parameter.ControlId, 'chkDateTime', true);
                    }
                }
            } else if (parameter.DataType == "Boolean") {
                var $parametertable = ej.buildTag("table", "", {}, {});
                var $parametertr = ej.buildTag("tr", "", {}, {});
                $parametertable.append($parametertr);

                var propStat = false;
                if (parameter.Label != null && parameter.Label.length > 0) {
                    if (parameter.Label.toLowerCase() == "true") {
                        propStat = true;
                    }
                }

                var $parametertd01 = ej.buildTag("td", "", {}, {});
                var $parameterradio01 = ej.buildTag("input", "", {}, { 'type': 'radio', 'name': parameter.Name, 'id': parameter.ControlId + '_01' });
                $parametertd01.append($parameterradio01);
                $parametertd01.append("&nbsp;<span>True</span>");
                $parameterradio01.ejRadioButton({ checked: propStat });
                $parametertr.append($parametertd01);

                $parametertr.append('<td width=10px/>');

                var $parametertd02 = ej.buildTag("td", "", {}, {});
                var $parameterradio02 = ej.buildTag("input", "", {}, { 'type': 'radio', 'name': parameter.Name, 'id': parameter.ControlId + '_02' });
                $parametertd02.append($parameterradio02);
                $parametertd02.append("&nbsp;<span>False</span>");
                if (parameter.Label != null && parameter.Label.length > 0) {
                    propStat = !propStat;
                }
                $parameterradio02.ejRadioButton({ checked: propStat });
                $parametertr.append($parametertd02);

                $contentDiv.append($parametertable);

                if (parameter.IsNullable) {
                    $parameterSpan = ej.buildTag("span", "", { 'WHITE-SPACE': 'nowrap', 'display': 'block' }, {});
                    $parameterNull = ej.buildTag("input", "", {}, { 'type': 'checkbox', 'name': 'chkRadio', 'id': parameter.ControlId + '~chk', 'value': this._id });
                    $parameterSpan.append($parameterNull);
                    $parameterSpan.append('&nbsp;<span class=e-reportviewer-label>Null</span>');
                    $contentDiv.append('&nbsp;');
                    $contentDiv.append($parameterSpan);
                    $parameterNull.ejCheckBox({ "change": this._paramNullChange });
                    if (parameter.Label != null && parameter.Label.length > 0) {
                        $parameterNull.ejCheckBox({ "change": this._paramNullChange });
                    } else {
                        $parameterNull.ejCheckBox({ "change": this._paramNullChange, checked: true });
                        this._paramElementDisable(parameter.ControlId, 'chkRadio', true);
                    }
                }
            } else {
                var $parametertxtbx = ej.buildTag("input.e-reportviewer-textbox", "", {}, { 'type': 'text', 'autocomplete': 'off', 'id': parameter.ControlId, 'maxlength': '256', 'name': parameter.Name, 'value': parameter.Label });
                $contentDiv.append($parametertxtbx);
                if (parameter.IsNullable) {
                    $parametertxtbx.css('width', '75%');
                    $parameterSpan = ej.buildTag("span", "", { 'WHITE-SPACE': 'nowrap', 'display': 'block' }, {});
                    $parameterNull = ej.buildTag("input", "", {}, { 'type': 'checkbox', 'name': 'chkTextbox', 'id': parameter.ControlId + '~chk', 'value': this._id });
                    $parameterSpan.append($parameterNull);
                    $parameterSpan.append('&nbsp;<span class=e-reportviewer-label>Null</span>');
                    $contentDiv.append('&nbsp;');
                    $contentDiv.append($parameterSpan);
                    $parameterNull.ejCheckBox({ "change": this._paramNullChange });
                    if (parameter.Label != null && parameter.Label.length > 0) {
                        $parameterNull.ejCheckBox({ "change": this._paramNullChange });
                    } else {
                        $parameterNull.ejCheckBox({ "change": this._paramNullChange, checked: true });
                        this._paramElementDisable(parameter.ControlId, 'chkTextbox', true);
                    }
                } else {
                    $parametertxtbx.css('width', '96%');
                }

                if (parameter.IsDependent) {
                    this._on($parametertxtbx, "change", this._paramsChangeEvent);
                }
            }
        },

        _selectionChanged: function (event) {
            var activeItem = this._activeItem;
            if (this.selectedIndexValue == 0 && this.selectedTextValue == "Select All") {
                if (this.checkedStatus) {
                    for (var index = 1; index < this.listitems.length; index++) {
                        this._setModel({ selectedIndex: index });
                    };
                }
                else {
                    for (var index = 1; index < this.listitems.length; index++) {
                        this.unselectItemsByIndices(index);
                    };
                }
            }
            else if (this._selectedIndices.length == this.listitems.length - 1) {
                if (this.checkedStatus) {
                    this._setModel({ selectedIndex: 0 });
                }
                else {
                    this.unselectItemsByIndices(0);
                }
            }
            this._activeItem = activeItem;
        },

        _updateParamElements: function (parameters) {
            var isRender = this._onRenderingBegin({ reportParameters: $.extend(true, {}, parameters) });
            if (!isRender) {
                for (var index = 0; index < parameters.length; index++) {
                    var parameter = parameters[index];
                    var targetTag = $('#' + parameter.ControlId + '_div');
                    if (parameter.IsMultiValue || parameter.AvailableValues != null || parameter.DataType == "Boolean") {
                        targetTag.empty();
                        parameter.Labels = parameter.Values = null;
                        this._renderParameterElements(parameter, targetTag);
                    } else if (parameter.DataType == "DateTime") {
                        var ejDatePick = $('#' + parameter.ControlId).data("ejDatePicker");
                        ejDatePick.setModel({ value: parameter.Label });
                    } else {
                        $('#' + parameter.ControlId).val(parameter.Label);
                    }
                }
            }
            this._onRenderingComplete({ reportParameters: $.extend(true, {}, parameters) });
            return isRender;
        },

        _paramsChangeEvent: function (event) {
            var ejViewerId = this._id.substr(0, (this._id.lastIndexOf('Param') - 1));
            var proxy = $('#' + ejViewerId).data('ejReportViewer');
            var updateParam = {
                Name: '',
                Labels: [],
                Values: []
            };
            var targetTag = $('#' + this._id);
            updateParam.Name = targetTag.attr('name');
            if (this.pluginName == 'ejDropDownList') {
                if (updateParam.Name == undefined) {
                    updateParam.Name = targetTag.attr('sf-name');
                }
                if (this.model.showCheckbox) {
                    for (var optIndex = 0; optIndex < this.model.selectedIndices.length; optIndex++) {
                        if (this.model.selectedIndices[optIndex] != 0 && this.selectOptionItems[this.model.selectedIndices[optIndex]].value != "parameter_SelectAll") {
                            updateParam.Labels.push(this.selectOptionItems[this.model.selectedIndices[optIndex]].text);
                            updateParam.Values.push(this.selectOptionItems[this.model.selectedIndices[optIndex]].value);
                        }
                    }
                } else {
                    updateParam.Labels.push(this.selectOptionItems[this.model.selectedIndex].text);
                    updateParam.Values.push(this.selectOptionItems[this.model.selectedIndex].value);
                }
            } else if (this.pluginName == 'ejDatePicker') {
                var dateTime = targetTag.data("ejDatePicker").getValue();
                updateParam.Labels.push(dateTime);
                updateParam.Values.push(dateTime);
            } else if (this.pluginName == 'ejRadioButton') {
                var isCheck = data("ejRadioButton").model.checked;
                updateParam.Labels.push(isCheck);
                updateParam.Values.push(isCheck);
            } else {
                updateParam.Labels.push(targetTag.val());
                updateParam.Values.push(targetTag.val());
            }
            proxy.doAjaxPost("POST", proxy._actionUrl, JSON.stringify({ 'reportAction': proxy._reportAction.updateParameters, 'updateParam': updateParam }), "_updateParameters");
        },

        _viewReportParamsClick: function (event) {
            this._showloadingIndicator(true);
            var parameters = event.data.params;
            var reportParams = this._getParameterJson(parameters, true);
            if (reportParams) {
                this._viewReportEnableDisable(true);
                this._refresh = true;
                $('#' + this._id + '_viewBlockContainer .e-reportviewer-viewerblockcontent table:first').attr('isviewclick', 'true');
                this._onViewReportClick(reportParams);
                this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.setParameters, 'parameters': reportParams }), "_setParameters");
            }
        },

        _viewReportEnableDisable: function (enable) {
            $('#' + this._id + '_viewReportClick').attr('disabled', enable)
        },

        _getDefaultParameters: function (defaultparameters) {
            var values = [];
            var labels = [];
            for (var parameterIndex = 0; parameterIndex < defaultparameters.length; defaultparameters++) {
                if (defaultparameters[parameterIndex].DefaultValues) {
                    for (var optIndex = 0; optIndex < defaultparameters[parameterIndex].DefaultValues.length; optIndex++) {
                        labels.push(defaultparameters[0].DefaultValues[optIndex]);
                        values.push(defaultparameters[0].DefaultValues[optIndex]);
                    }
                    var reportParams = [{ Name: defaultparameters[parameterIndex].Name, Values: values, Labels: labels, Nullable: defaultparameters[parameterIndex].IsNullable }];
                    this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.setParameters, 'parameters': reportParams }), "_setParameters");
                }
            }
        },

        _getParameterJson: function (parameters, isUIUpdate) {
            var reportParams = [];
            for (var index = 0; index < parameters.length; index++) {
                var parameter = parameters[index];
                var values = [];
                var labels = [];
                var nullable = false;
                var isNull;
                if (parameter.IsMultiValue) {
                    var ddl = $('#' + parameter.ControlId).data("ejDropDownList");
                    var selectedIndex = ddl._selectedIndices; 
                    for (var optIndex = 0; optIndex < selectedIndex.length; optIndex++) {
                        if (selectedIndex[optIndex] != 0 && ddl.selectOptionItems[selectedIndex[optIndex]].value != "parameter_SelectAll") {
                            labels.push(ddl.selectOptionItems[selectedIndex[optIndex]].text);
                            values.push(ddl.selectOptionItems[selectedIndex[optIndex]].value);
                        }
                    }
                } else if (parameter.AvailableValues != null) {
                    if (parameter.IsNullable) {
                        nullable = parameter.IsNullable;                                                       
                    }
                    var ddlVal = $('#' + parameter.ControlId).data("ejDropDownList").getSelectedValue();
                    var ddltxt = $('#' + parameter.ControlId).data("ejDropDownList").getSelectedItem();
                    ddlVal = (ddlVal == "") ? parameter.Value : ddlVal;
                    ddltxt = (ddltxt && $(ddltxt).text() == "") ? parameter.Label : $(ddltxt).text();
                    labels.push(ddltxt);
                    values.push(ddlVal);
                } else if (parameter.DataType == "DateTime") {
                    isNull = $('#' + parameter.ControlId + '_div').find('.e-chkbox-wrap').attr('aria-checked');
                    if (isNull == 'true') {
                        nullable = true;
                    } else {
                        var dateTime = $('#' + parameter.ControlId).data("ejDatePicker").getValue();
                        labels.push(dateTime);
                        values.push(dateTime);
                    }
                } else if (parameter.DataType == "Boolean") {
                    var radio1 = $('#' + parameter.ControlId + '_01').data("ejRadioButton");
                    var radio2 = $('#' + parameter.ControlId + '_02').data("ejRadioButton");
                    isNull = $('#' + parameter.ControlId + '_div').find('.e-chkbox-wrap').attr('aria-checked');
                    if (isNull == 'true') {
                        nullable = true;
                    } else if (radio1.model.checked || radio2.model.checked) {
                        labels.push(radio1.model.checked);
                        values.push(radio1.model.checked);
                    }
                } else {
                    isNull = $('#' + parameter.ControlId + '_div').find('.e-chkbox-wrap').attr('aria-checked');
                    if (isNull == 'true') {
                        nullable = true;
                    } else {
                        var val = $('#' + parameter.ControlId).val();
                        if (isUIUpdate) {
                            if (parameter.DataType == "Float" && !val.match('^[-+]?[0-9]+\.[0-9]+$')) {
                                alert('Please give the float data type input');
                                return false;
                            } else if (parameter.DataType == "Integer" && !val.match('^[-+]?[0-9]+$')) {
                                alert('Please give the integer data type input');
                                return false;
                            }
                        }
                        labels.push(val);
                        values.push(val);
                    }
                }

                var parameterValue = { Name: parameter.Name, Values: values, Labels: labels, Nullable: nullable };
                reportParams.push(parameterValue);
            }
            return reportParams;
        },

        _paramNullChange: function (event) {
            var id = event.model.id.split('~');
            var ejReport = $('#' + event.model.value).data("ejReportViewer");
            ejReport._paramElementDisable(id[0], event.model.name, event.isChecked);
        },

        _paramElementDisable: function (elementId, elementType, isEnable) {
            if (elementType == 'chkDateTime') {
                var dateTime = $('#' + elementId).data("ejDatePicker");
                if (isEnable) {
                    dateTime.disable();
                } else {
                    dateTime.enable();
                }
            } else if (elementType == 'chkTextbox') {
                if (isEnable) {
                    $('#' + elementId).attr('disabled', 'disabled');
                    $('#' + elementId).css('opacity', '0.45');
                } else {
                    $('#' + elementId).removeAttr('disabled');
                    $('#' + elementId).css('opacity', '1');
                }
            } else if (elementType == 'chkRadio') {
                var radio1 = $('#' + elementId + '_01').data("ejRadioButton");
                var radio2 = $('#' + elementId + '_02').data("ejRadioButton");
                if (isEnable) {
                    radio1.disable();
                    radio2.disable();
                } else {
                    radio1.enable();
                    radio2.enable();
                }
            }
        },

        _selectparamToolItem: function (enable) {
            if (!this.model.toolbarSettings.templateId) {
                var _ejToolbar = $('#' + this._id + '_toolbarContainer').data("ejToolbar");
                if (enable) {
                    _ejToolbar.selectItemByID(this._id + '_ejtb_parameter');
                } else {
                    _ejToolbar.deselectItemByID(this._id + '_ejtb_parameter');
                }
            }
        },

        _showParameterBlock: function (enable) {
            if (enable) {
                $('#' + this._id + '_viewBlockContainer .e-reportviewer-viewerblockcellcontent').css("display", "block");
                $('#' + this._id + '_toolbarContainer').find('.e-reportviewer-parameter').parent().css("display", "block");
            } else {
                $('#' + this._id + '_viewBlockContainer .e-reportviewer-viewerblockcellcontent').css("display", "none");
                $('#' + this._id + '_toolbarContainer').find('.e-reportviewer-parameter').parent().css("display", "none");
            }

            if (this._isDevice) {
                this._showViewerBlock(enable);
                this._showViewerPage(!enable);
            }
        },

        _toggleParameterBlock: function () {
            this._selectparamToolItem(!($('#' + this._id + '_viewBlockContainer .e-reportviewer-viewerblockcellcontent').css("display") == 'block'));
            $('#' + this._id + '_viewBlockContainer .e-reportviewer-viewerblockcellcontent').toggle();
            this._setContainerSize();

            if (this._isDevice) {
                var isEnable = $('#' + this._id + '_viewBlockContainer .e-reportviewer-viewerblockcellcontent').css("display") == "block";
                this._showViewerBlock(isEnable);
                this._showViewerPage(!isEnable);
            }
        },
        //-------------------- Render Parameter Block and Actions [End] -------------------------//

        //-------------------- Render Exception Block and Actions [Start] -------------------------//
        _renderExceptionBlock: function (errmsg) {
            this._resetExceptionBlock();
            $('#' + this._id + '_viewBlockContainer .e-reportviewer-viewerblockcellcontent').css("display", "none");
            var table = ej.buildTag("table.errmsg", "", {'width': '100%'}, {});
            var $row = ej.buildTag("tr", "", {}, {});
            var $cell = ej.buildTag("td.e-reportviewer-viewerblockcellcontent", "", {}, {});
            var $closeCell = ej.buildTag("td.e-reportviewer-viewerblockcellcontent", "", { 'width': '50px' }, {});
            var $cancelbutton = ej.buildTag("span.e-reportviewer-icon e-reportviewer-close", "", {}, { 'id': this._id + '_closebutton', 'title': 'Close this message' });
            $row.append($cell);
            $row.append($closeCell);
            $closeCell.append($cancelbutton);
            $cell.append("<h5>Report Viewer encountered some issues loading this report. Please click <a id=" + this._id + '_viewBlockContainer_errmsg' + " href=javascript:void(0); >here</a>  to see the error details</h5>");
            table.append($row);
            $('#' + this._id + '_viewBlockContainer').append(table);
            this._on($('#' + this._id + '_viewBlockContainer_errmsg'), "click", { err: errmsg }, this._errorPopupblock);
            this._on($('#' + this._id + '_closebutton'), "click", this._closeException);
        },

        _closeException: function () {
            $('#' + this._id + '_viewBlockContainer table.errmsg').remove();
            this._setContainerSize();
        },

        _errorPopupblock: function (event) {
            alert(event.data.err);
        },

        _resetExceptionBlock: function () {
            $('#' + this._id + '_viewBlockContainer table.errmsg').remove();
        },

        _renderExcpetion: function (exception) {
            this._showloadingIndicator(false);
            //$('#' + this._id + '_viewerContainer').html('Exception:' + exception);
            this._renderExceptionBlock(exception);
            this._showViewerBlock(true);
        },

        _showExceptionResult: function (isError, reportresult) {
            if (!isError && this.model.enableNotificationBar) {
                if (this._isDevice) {
                    alert(reportresult);
                } else {
                    this._renderExceptionBlock(reportresult);
                    this._showViewerBlock(true);
                }
            }
        },
        //-------------------- Render Exception Block and Actions [End] -------------------------//

        //-------------------- Apply Page Style and Actions [Start] -------------------------//
        _setContainerSize: function () {
            var ctrlheight = $('#' + this._id).height();
            
            
            
            var viewerblockHeight = 0;
            if (!this._isDevice) {
                var viewerContainer = $('#' + this._id + '_viewBlockContainer');
                if (viewerContainer.length > 0 && viewerContainer.css('display').toLowerCase() == 'block') {
                    viewerblockHeight = $('#' + this._id + '_viewBlockContainer').height();
                }
            }

            var toolbarHeight = this.model.toolbarSettings.templateId ? $('#' + this.model.toolbarSettings.templateId).height() : $('#' + this._id + '_toolbarContainer').height();

            var calcHeight = ctrlheight - viewerblockHeight - toolbarHeight - 4;
            $('#' + this._id + '_viewerContainer').css({ "height": calcHeight + "px" });
        },

        _setPageSize: function (pageHeight, pageWidth, headerHeight, footerHeight) {
            var pageSizeWidth = null, pageSizeHeight = null;
            var totalpageHeight = pageHeight + headerHeight + footerHeight + 3;

            $('#' + this._id + '_pageviewContainer').css({ "width": pageWidth + "px", "height": totalpageHeight + "px" });
            $('#' + this._id + '_pageviewheaderContainer').css({ "width": pageWidth + "px", "height": headerHeight + "px" });
            $('#' + this._id + '_pageviewfooterContainer').css({ "width": pageWidth + "px", "height": footerHeight + "px" });
            $('#' + this._id + '_pageviewbodyContainer').css({ "height": pageHeight + "px", "width": pageWidth + "px" });
            var scalePageSize = $('#' + this._id + '_pageviewContainer')[0].getBoundingClientRect();

            if (this._browserInfo.name == 'msie' && this._browserInfo.version == 8) {
                pageSizeWidth = scalePageSize.right;
                pageSizeHeight = scalePageSize.bottom;
            }
            else {
                pageSizeWidth = scalePageSize.width;
                pageSizeHeight = scalePageSize.height;
            }
            $('#' + this._id + '_pageviewOuterline').css({ "width": pageSizeWidth + "px", "height": pageSizeHeight + "px" });
        },

        _renderPageModels: function (pageData) {
            $('#' + this._id + '_pageviewheaderContainer').empty();
            $('#' + this._id + '_pageviewfooterContainer').empty();
            $('#' + this._id + '_pageviewbodyContainer').empty();
            if (pageData) {
                if (pageData.ReportStyleModel) {
                    this._applyPageStyle($('#' + this._id + '_pageviewContainer'), pageData.ReportStyleModel, false);
                }

                if (pageData.HeaderStyleModel) {
                    this._applyPageStyle($('#' + this._id + '_pageviewContainer .pageHeaderBorder'), pageData.HeaderStyleModel, false);
                }

                if (pageData.FooterStyleModel) {
                    this._applyPageStyle($('#' + this._id + '_pageviewContainer .pageFooterBorder'), pageData.FooterStyleModel, false);
                }

                if (pageData.BodyStyleModel) {
                    this._applyPageStyle($('#' + this._id + '_pageviewContainer .pageBodyBorder'), pageData.BodyStyleModel, false);
                }

                if (pageData.HeaderModel && pageData.HeaderModel.length > 0) {
                    this._renderPageControls(pageData.HeaderModel, $('#' + this._id + '_pageviewheaderContainer'), false, null);
                }

                if (pageData.FooterModel && pageData.FooterModel.length > 0) {
                    this._renderPageControls(pageData.FooterModel, $('#' + this._id + '_pageviewfooterContainer'), false, null);
                }

                if (pageData.PageModel && pageData.PageModel.length > 0) {
                    this._renderPageControls(pageData.PageModel, $('#' + this._id + '_pageviewbodyContainer'), false, null);
                }
            }

            if ($('.txtToggle_' + this._id).length > 0) {
                this._drillAction();
            }

            if ($('.drillAction_' + this._id).length > 0) {
                this._drillThroughAction();
            }

            if ($('.txtSorting_' + this._id).length > 0) {
                this._sortingAction();
            }

            if (this._isDocumentMap && !this._printMode) {
                this._documentMapAction();
                this._isDocumentMap = false;
                this._pageDocMapFlag = true;
            }

            if (this._parentPageXY) {
                $('#' + this._id + '_viewerContainer').animate({ scrollTop: this._parentPageXY.y, scrollLeft: this._parentPageXY.x }, 1000);
                this._parentPageXY = null;
            }

            if (this._isDevice) {
                this._renderPageInfoPopup();
            }

            if (this.model.printMode) {
                $('#' + this._id + '_pageviewContainer').css({ 'padding-left': this._pageModel.MarginLeft, 'padding-top': this._pageModel.MarginTop, 'padding-right': this._pageModel.MarginRight, 'padding-bottom': this._pageModel.MarginBottom });
            } else {
                $('#' + this._id + '_pageviewContainer').css('padding', '0px');
            }
        },

        _applyPageStyle: function (page, styleModel, printMode) {
            var resourceName = printMode ? 'PrintImage' : 'GetResource';
            if (styleModel.BackgroundColor) {
                page.css("background-color", styleModel.BackgroundColor);
            }
            if (styleModel.BackgroundSrc) {
                page.css("background-image", "url(" + this.model.reportServiceUrl + '/' + resourceName + '/?key=' + styleModel.BackgroundSrc + '&resourcetype=sfimg&isPrint=' + printMode + ")");
            }
            if (styleModel.Border) {
                this._applyBorderStyle(styleModel.Border, page);
            }
        },

        _renderPageControls: function (pageModelItems, renderArea, printMode, printPageId) {
            var $reportItemsContainer = ej.buildTag("div", "", {}, {});
            renderArea.html($reportItemsContainer);
            for (var index = 0; index < pageModelItems.length; index++) {
                var reportItem = pageModelItems[index];
                if (reportItem.ItemType == "TextBoxModel") {
                    var textboxControl = this._renderTextBoxControl(reportItem, false, null, printMode, printPageId);
                    $reportItemsContainer.append(textboxControl);
                }
                else if (reportItem.ItemType == "LineModel") {
                    var lineControl = this._renderLineControl(reportItem, null, printMode, printPageId);
                    $reportItemsContainer.append(lineControl);
                }
                else if (reportItem.ItemType == "ImageModel") {
                    this._renderImageControl(reportItem, false, $reportItemsContainer, null, printMode, printPageId);
                }
                else if (reportItem.ItemType == "TablixModel") {
                    this._renderTablixControl(reportItem, false, {}, $reportItemsContainer, null, printMode, printPageId);
                }
                else if (reportItem.ItemType == "GaugeModel") {
                    this._renderGaugeControl(reportItem, false, {}, $reportItemsContainer, null, printMode, printPageId);
                }
                else if (reportItem.ItemType == "RectangleModel") {
                    this._renderRectangleControl(reportItem, false, $reportItemsContainer, null, printMode, printPageId);
                }
                else if (reportItem.ItemType == "ChartModel") {
                    this._renderChartControl(reportItem, false, {}, $reportItemsContainer, null, printMode, printPageId);
                }
                else if (reportItem.ItemType == "MapModel") {
                    this._renderMapControl(reportItem, $reportItemsContainer, null, printMode, printPageId);
                }
                else if (reportItem.ItemType == "SubReportModel") {
                    this._renderSubReportControl(reportItem, false, $reportItemsContainer, null, printMode, printPageId);
                }
            }
        },
        //-------------------- Apply Page Style and Actions [End] -------------------------//

        //-------------------- Render the Page ReportItems [start] -------------------------//
        _controlKeyGenerator: function (currentKey, parentId, printMode, printPageId) {
            var objId = !ej.isNullOrUndefined(parentId) ? '^' + parentId : '';
            if (printMode) {
                objId = objId.length == 0 ? '^' + printPageId : objId + '_' + printPageId;
            }
            return currentKey + objId;
        },

        _applyBorderStyle: function (border, tag) {
            if (border.Default) {
                tag.css("border-width", border.Default.Thickness + 'px');
                tag.css("border-color", border.Default.BorderBrush);
                tag.css("border-style", border.Default.BorderStyle);
            }

            if (border.LeftBorder) {
                tag.css("border-left-width", border.LeftBorder.Thickness + 'px');
                tag.css("border-left-color", border.LeftBorder.BorderBrush);
                tag.css("border-left-style", border.LeftBorder.BorderStyle);
            }

            if (border.RightBorder) {
                tag.css("border-right-width", border.RightBorder.Thickness + 'px');
                tag.css("border-right-color", border.RightBorder.BorderBrush);
                tag.css("border-right-style", border.RightBorder.BorderStyle);
            }

            if (border.TopBorder) {
                tag.css("border-top-width", border.TopBorder.Thickness + 'px');
                tag.css("border-top-color", border.TopBorder.BorderBrush);
                tag.css("border-top-style", border.TopBorder.BorderStyle);
            }

            if (border.BottomBorder) {
                tag.css("border-bottom-width", border.BottomBorder.Thickness + 'px');
                tag.css("border-bottom-color", border.BottomBorder.BorderBrush);
                tag.css("border-bottom-style", border.BottomBorder.BorderStyle);
            }
        },

        _applyTextStyle: function (textboxModel, tag, textbox, tabcolWidth, tabcolHeight) {
            var paddingTop = 0, paddingRight = 0, paddingBottom = 0, paddingLeft = 0;
            var topBorder = 0, rightBorder = 0, bottomBorder = 0, leftBorder = 0;
            if (textboxModel.Padding) {
                if (textboxModel.Padding.Top) {
                    tag.css("padding-top", textboxModel.Padding.Top);
                    paddingTop = textboxModel.Padding.Top;
                }

                if (textboxModel.Padding.Right) {
                    tag.css("padding-right", textboxModel.Padding.Right);
                    paddingRight = textboxModel.Padding.Right;
                }

                if (textboxModel.Padding.Bottom) {
                    tag.css("padding-bottom", textboxModel.Padding.Bottom);
                    paddingBottom = textboxModel.Padding.Bottom;
                }

                if (textboxModel.Padding.Left) {
                    tag.css("padding-left", textboxModel.Padding.Left);
                    paddingLeft = textboxModel.Padding.Left;
                }
            }

            if (textboxModel.TextBoxBackgroundColor) {
                tag.css("backgroundColor", textboxModel.TextBoxBackgroundColor);
            }

            if (textboxModel.VerticalAlign && textboxModel.VerticalAlign != 'Default') {
                tag.css("vertical-align", textboxModel.VerticalAlign);
            }

            if (textboxModel.Border) {
                if (textboxModel.Border.Default) {
                    tag.css({ "border-width": textboxModel.Border.Default.Thickness + 'px', "border-color": textboxModel.Border.Default.BorderBrush, "border-style": textboxModel.Border.Default.BorderStyle });
                    topBorder = rightBorder = bottomBorder = leftBorder = textboxModel.Border.Default.Thickness;
                }

                if (textboxModel.Border.LeftBorder) {
                    tag.css({ "border-left-width": textboxModel.Border.LeftBorder.Thickness + 'px', "border-left-color": textboxModel.Border.LeftBorder.BorderBrush, "border-left-style": textboxModel.Border.LeftBorder.BorderStyle });
                    leftBorder = textboxModel.Border.LeftBorder.Thickness;
                }

                if (textboxModel.Border.RightBorder) {
                    tag.css({ "border-right-width": textboxModel.Border.RightBorder.Thickness + 'px', "border-right-color": textboxModel.Border.RightBorder.BorderBrush, "border-right-style": textboxModel.Border.RightBorder.BorderStyle });
                    rightBorder = textboxModel.Border.RightBorder.Thickness;
                }

                if (textboxModel.Border.TopBorder) {
                    tag.css({ "border-top-width": textboxModel.Border.TopBorder.Thickness + 'px', "border-top-color": textboxModel.Border.TopBorder.BorderBrush, "border-top-style": textboxModel.Border.TopBorder.BorderStyle });
                    topBorder = textboxModel.Border.TopBorder.Thickness;
                }

                if (textboxModel.Border.BottomBorder) {
                    tag.css({ "border-bottom-width": textboxModel.Border.BottomBorder.Thickness + 'px', "border-bottom-color": textboxModel.Border.BottomBorder.BorderBrush, "border-bottom-style": textboxModel.Border.BottomBorder.BorderStyle });
                    bottomBorder = textboxModel.Border.BottomBorder.Thickness;
                }
            }

            var tagName = tag.get(0).tagName;
            if (tagName.toLowerCase() == 'td') {

                var padwidthadjust = parseFloat(paddingLeft, 10) + parseFloat(paddingRight, 10);
                var padheightadjust = parseFloat(paddingTop, 10) + parseFloat(paddingBottom, 10);

                var borderwidthadjust = parseFloat(leftBorder, 10) + parseFloat(rightBorder, 10);
                var borderheightadjust = parseFloat(topBorder, 10) + parseFloat(bottomBorder, 10);

                var adjusWidth = (parseFloat(tabcolWidth, 10) - (padwidthadjust + borderwidthadjust));
                var adjusHeight = (parseFloat(textboxModel.CanGrow ? textboxModel.Height : tabcolHeight, 10) - (padheightadjust + borderheightadjust));

                tag.css('width', adjusWidth + 'px');
                tag.css('height', adjusHeight + 'px');
                if (!textboxModel.ToggleInfo) {
                    var childrens = $(textbox).children();
                    for (var i = 0; i < childrens.length; i++) {
                        var _child = $(childrens[i]);
                        if (!_child.hasClass('e-reportviewer-usersort')) {
                            _child.width(adjusWidth);                           
                        }
                    }
                    $(textbox).height(adjusHeight);
                }
            }
        },

        //-------------------- Render the Tablix ReportItem [start] -------------------------//
        _renderTablixControl: function (tablixmodel, isTablixCell, cellSize, renderarea, parentId, printMode, printPageId) {
            var proxy = this;
            var _height = tablixmodel.Height;
            var _width = tablixmodel.Width;
            var ctrlId = proxy._controlKeyGenerator(proxy._id + '_' + tablixmodel.Name, parentId, printMode, printPageId);
            var tablixDiv = ej.buildTag("div", "", {}, { 'id': ctrlId, title: tablixmodel.Tooltip });
            var _tablixDivCss = {};
            renderarea.append(tablixDiv);
            _tablixDivCss["top"] = tablixmodel.Top;
            _tablixDivCss["left"] = tablixmodel.Left;

            if (isTablixCell) {
                _height = cellSize.height;
                var borderwidthadjust = parseFloat(tablixDiv.css("border-left-width"), 10) + parseFloat(tablixDiv.css("border-right-width"), 10);
                var borderheightadjust = parseFloat(tablixDiv.css("border-top-width"), 10) + parseFloat(tablixDiv.css("border-bottom-width"), 10);
                _width = (_width - (borderwidthadjust));
                _height = (_height - (borderheightadjust));
                _tablixDivCss["position"] = 'relative';
            } else {
                _tablixDivCss["position"] = 'absolute';
            }

            _tablixDivCss["width"] = _width;
            _tablixDivCss["height"] = _height;

            var tablixtable = ej.buildTag("table", "", { 'border-collapse': 'collapse', 'font-size': '8pt' }, { 'cellspacing': '0', 'cellpadding': '0' });
            var _tablixtableCss = {};
            tablixDiv.append(tablixtable);

            if (tablixmodel.BackgroundColor) {
                _tablixtableCss["background-color"] = tablixmodel.BackgroundColor;
            }

            if (tablixmodel.StyleVal) {
                if (tablixmodel.StyleVal.Font) {
                    if (tablixmodel.StyleVal.Font.FontFamily) {
                        _tablixtableCss["font-family"] = tablixmodel.StyleVal.Font.FontFamily;
                    }

                    if (tablixmodel.StyleVal.Font.FontSize) {
                        _tablixtableCss["font-size"] = tablixmodel.StyleVal.Font.FontSize;
                    }

                    if (tablixmodel.StyleVal.Font.FontStyle) {
                        _tablixtableCss["font-style"] = tablixmodel.StyleVal.Font.FontStyle;
                    }

                    if (tablixmodel.StyleVal.Font.FontWeight) {
                        _tablixtableCss["font-weight"] = tablixmodel.StyleVal.Font.FontWeight + ' !important';
                    }
                }

                _tablixtableCss["color"] = tablixmodel.StyleVal.TextColor ? tablixmodel.StyleVal.TextColor : 'black';

                if (tablixmodel.StyleVal.TextDecoration) {
                    _tablixtableCss["text-decoration"] = tablixmodel.StyleVal.TextDecoration;
                }
            }

            if (tablixmodel.Padding) {
                if (tablixmodel.Padding.Left) {
                    _tablixtableCss["padding-left"] = tablixmodel.Padding.Left;
                }

                if (tablixmodel.Padding.Right) {
                    _tablixtableCss["padding-right"] = tablixmodel.Padding.Right;
                }

                if (tablixmodel.Padding.Top) {
                    _tablixtableCss["padding-top"] = tablixmodel.Padding.Top;
                }

                if (tablixmodel.Padding.Bottom) {
                    _tablixtableCss["padding-bottom"] = tablixmodel.Padding.Bottom;
                }
            }

            //if (tablixmodel.LineHeight) {
            //    tablixtable.css("line-height", tablixmodel.LineHeight);
            //}

            if (tablixmodel.TextAlign) {
                _tablixtableCss["text-align"] = tablixmodel.TextAlign;
            }

            if (tablixmodel.VerticalAlign) {
                _tablixtableCss["vertical-align"] = tablixmodel.VerticalAlign;
            }

            var resourceName = printMode ? 'PrintImage' : 'GetResource';
            if (tablixmodel.BackgroundImageSrc) {
                _tablixtableCss["background-image"] = "url(" + this.model.reportServiceUrl + '/' + resourceName + '/?key=' + tablixmodel.BackgroundImageSrc + '&resourcetype=sfimg&isPrint=' + printMode + ")";
            }

            if (tablixmodel.Border) {
                var _topBorder = tablixmodel.Border.TopBorder;
                tablixmodel.Border.TopBorder = null;
                this._applyBorderStyle(tablixmodel.Border, tablixtable);
                if (_topBorder) {
                    _tablixDivCss["border-top-width"] = _topBorder.Thickness + 'px';
                    _tablixDivCss["border-top-color"] = _topBorder.BorderBrush;
                    _tablixDivCss["border-top-style"] = _topBorder.BorderStyle;
                }
                tablixmodel.Border.TopBorder = _topBorder;
            }
            tablixtable.css(_tablixtableCss);
            tablixDiv.css(_tablixDivCss);

            if (tablixmodel.CellModels && tablixmodel.CellModels.length > 0) {
                var emptyRow = ej.buildTag("tr", "", { 'padding': '0px', 'margin': '0px', 'height': '0px', 'visibility': 'collapse' }, {});

                if ((tablixmodel.Border.TopBorder && tablixmodel.Border.TopBorder.BorderStyle != "None") || (tablixmodel.Border.Default && tablixmodel.Border.Default.BorderStyle != "None")) {
                    emptyRow.css('visibility', 'visible');
                }

                tablixtable.append(emptyRow);
                var colindex;
                var headerEmptyRow = null;
                var headerTableRow = null;
                for (colindex = 0; colindex < tablixmodel.CellModels[0].length; colindex++) {
                    var emptyCol = ej.buildTag("td", "", { 'padding': '0px', 'margin': '0px', 'width': tablixmodel.ColWidths[colindex] + 'px' }, { 'rowSpan': '1', 'colSpan': '1' });
                    emptyRow.append(emptyCol);
                }

                for (var rowindex = 0; rowindex < tablixmodel.CellModels.length; rowindex++) {
                    var tableRow = ej.buildTag("tr", "", { 'padding': '0px', 'margin': '0px', 'text-align': 'left', 'height': tablixmodel.RowHeights[rowindex] + 'px' }, { 'vAlign': 'top' });
                    tablixtable.append(tableRow);
                    var row = tablixmodel.CellModels[rowindex];
                    for (colindex = 0; colindex < row.length; colindex++) {
                        var tableCol = ej.buildTag("td", "", { 'padding': '0px', 'margin': '0px', 'text-align': 'left', 'height': '100%' }, { 'rowSpan': '1', 'colSpan': '1' });
                        tableRow.append(tableCol);
                        var cell = row[colindex].ItemModel;
                        var border = row[colindex].Border;
                        var rowSpan = row[colindex].RowSpan;
                        var colSpan = row[colindex].ColSpan;
                        if (border) {
                            proxy._applyBorderStyle(border, tableCol);
                        }

                        if (cell) {
                            if (cell.ItemType == "TextBoxModel") {
                                var textboxControl = proxy._renderTextBoxControl(cell, true, ctrlId + 'tablixRow' + rowindex + 'xCol' + colindex, printMode, printPageId);
                                textboxControl.css('max-height', '99.9% !important');
                                tableCol.css('height', tablixmodel.RowHeights[rowindex] + 'px');
                                proxy._applyTextStyle(cell, tableCol, textboxControl, tablixmodel.ColWidths[colindex], tablixmodel.RowHeights[rowindex]);
                                tableCol.append(textboxControl);
                            } else if (cell.ItemType == "LineModel") {
                                var lineControl = proxy._renderLineControl(cell, ctrlId + 'tablixRow' + rowindex + 'xCol' + colindex, printMode, printPageId);
                                lineControl.css("position", "relative");
                                tableCol.append(lineControl);
                            } else if (cell.ItemType == "ImageModel") {
                                proxy._renderImageControl(cell, true, tableCol, ctrlId + 'tablixRow' + rowindex + 'xCol' + colindex, printMode, printPageId);
                            } else if (cell.ItemType == "TablixModel") {
                                proxy._renderTablixControl(cell, true, { height: tablixmodel.RowHeights[rowindex] }, tableCol, ctrlId + 'tablixRow' + rowindex + 'xCol' + colindex, printMode, printPageId);
                            } else if (cell.ItemType == "GaugeModel") {
                                proxy._renderGaugeControl(cell, true, { height: tablixmodel.RowHeights[rowindex] }, tableCol, ctrlId + 'tablixRow' + rowindex + 'xCol' + colindex, printMode, printPageId);
                            } else if (cell.ItemType == "RectangleModel") {
                                proxy._renderRectangleControl(cell, true, tableCol, ctrlId + 'tablixRow' + rowindex + 'xCol' + colindex, printMode, printPageId);
                            } else if (cell.ItemType == "ChartModel") {
                                this._renderChartControl(cell, true, { height: tablixmodel.RowHeights[rowindex] }, tableCol, ctrlId + 'tablixRow' + rowindex + 'xCol' + colindex, printMode, printPageId);
                            } else if (cell.ItemType == "MapModel") {
                                this._renderMapControl(cell, tableCol, ctrlId + 'tablixRow' + rowindex + 'xCol' + colindex, printMode, printPageId);
                            } else if (cell.ItemType == "SubReportModel") {
                                proxy._renderSubReportControl(cell, true, tableCol, ctrlId + 'tablixRow' + rowindex + 'xCol' + colindex, printMode, printPageId);
                            }

                            if (rowSpan > 1) {
                                tableCol.attr("rowspan", rowSpan);
                            }

                            if (colSpan > 1) {
                                tableCol.attr("colspan", colSpan);
                            }
                        } else {
                            tableCol.css('display', 'none');
                        }
                    }

                    if (row[0].FixedData) {
                        if (headerEmptyRow == null && headerTableRow == null) {
                            var tablixheaderDiv = ej.buildTag("div", "", { 'top': tablixmodel.Top, 'left': tablixmodel.Left, 'position': 'absolute' }, { 'id': ctrlId + '_headertable' });
                            tablixDiv.addClass('fixed-data');
                            renderarea.append(tablixheaderDiv);
                            var tabixheadertable = ej.buildTag("table", "", { 'border-collapse': 'collapse', 'font-size': '8pt' }, { 'cellspacing': '0', 'cellpadding': '0' });
                            tablixheaderDiv.append(tabixheadertable);
                        }

                        headerEmptyRow = $(emptyRow).clone();
                        headerTableRow = $(tableRow).clone(true);
                        tabixheadertable.append(headerEmptyRow);
                        tabixheadertable.append(headerTableRow);
                    }
                }
            }
        },
        //-------------------- Render the Tablix ReportItem [end] -------------------------//
        _renderTextBoxControl: function (textboxModel, isTablixCell, parentId, printMode, printPageId) {
            var ctrlId = this._controlKeyGenerator(this._id + '_' + textboxModel.Name, parentId, printMode, printPageId);

            var textboxDiv = ej.buildTag("div", "", {}, { 'id': ctrlId, title: textboxModel.ToolTip });
            var _textboxCss = {};
            if (!isTablixCell) {
                _textboxCss["position"] = 'absolute';
                _textboxCss["top"] = textboxModel.Top;
                _textboxCss["left"] = textboxModel.Left;
                _textboxCss["width"] = textboxModel.Width;
                _textboxCss["height"] = textboxModel.Height;
                this._applyTextStyle(textboxModel, textboxDiv, null, null, null);
            } else if (isTablixCell) {
                _textboxCss["word-wrap"] = 'break-word';
                _textboxCss["white-space"] = 'pre-wrap';
                if (!textboxModel.CanGrow) {
                    _textboxCss["overflow"] = 'hidden';
                }
            }

            var resourceName = printMode ? 'PrintImage' : 'GetResource';
            if (textboxModel.BackgroundSrc) {
                _textboxCss["background-image"] = "url(" + this.model.reportServiceUrl + '/' + resourceName + '/?key=' + textboxModel.BackgroundSrc + '&resourcetype=sfimg&isPrint=' + printMode + ")";
            }

            if (textboxModel.ToggleInfo && !printMode) {
                var cssToggleName = textboxModel.IsToggle ? 'e-reportviewer-collapsetoggle' : 'e-reportviewer-expandtoggle';
                var toogleiconDiv = ej.buildTag('div.' + cssToggleName + ' txtToggle_' + this._id, '', { 'display': 'block', 'width': '14px', 'height': '14px', 'margin-Top': '1px' }, {});
                var _objToogleDivCss = {};
                if (this._browserInfo.name == 'msie') {
                    _objToogleDivCss["margin-right"] = '1px';
                    _objToogleDivCss["float"] = 'left';
                } else if (this._browserInfo.name == 'opera' || this._browserInfo.name == 'webkit' || this._browserInfo.name == 'chrome' || this._browserInfo.name == 'mozilla' || this._browserInfo.name == 'edge') {
                    _objToogleDivCss["display"] = 'table';
                    _objToogleDivCss["margin-right"] = '2px';
                    _objToogleDivCss["float"] = 'left';
                }

                toogleiconDiv.data('drillObj', textboxModel.ToggleInfo);
                toogleiconDiv.css(_objToogleDivCss);
                textboxDiv.append(toogleiconDiv);
                _textboxCss["display"] = this._browserInfo.name == 'msie' ? 'inline-block' : 'flex';
                _textboxCss["word-wrap"] = 'inherit';
                _textboxCss["white-space"] = 'inherit';
            }

            if (textboxModel.WritingMode != "Default" && textboxModel.WritingMode == "Vertical") {
                    if (this._browserInfo.name == 'msie') {
                        _textboxCss["writing-mode"] = 'tb-rl';
                    } else {
                        _textboxCss["transform"] = 'rotate(90deg)';
                    }
            }

            if (textboxModel.ActionInfo) {
                textboxDiv.data('actionObj', textboxModel.ActionInfo);
                textboxDiv.addClass('drillAction_' + this._id + ' e-reportviewer-drillhover');
            }

            if (textboxModel.Paragraphval) {
                for (var indexi = 0; indexi < textboxModel.Paragraphval.length; indexi++) {
                    var $textboxParaDiv = ej.buildTag("div.e-reportviewer-paragrap", "", {});
                    var _objParaDivCss = {};
                    var paragraph = textboxModel.Paragraphval[indexi];
                    for (var indexj = 0; indexj < paragraph.Runs.length; indexj++) {
                        var run = paragraph.Runs[indexj];
                        var $textboxSpanDiv = ej.buildTag("span", "", {});
                        var _objSpanDivCss = {};
                       
                        _objSpanDivCss["white-space"] = (textboxModel.ToggleInfo && !printMode) ? 'inherit' : 'pre-wrap';

                        //if (paragraph.HangingIndent && paragraph.HangingIndent != 0) {
                        //    $textboxSpanDiv.css("text-indent", paragraph.HangingIndent)
                        //}                    

                        if (run.ActionInfo) {
                            $textboxSpanDiv.data('actionObj', run.ActionInfo);
                            $textboxSpanDiv.addClass('drillAction_' + this._id + ' e-reportviewer-drillhover');
                        }

                        if (run.Style.Font.FontFamily) {
                            _objSpanDivCss["font-family"] = run.Style.Font.FontFamily;
                        }

                        if (run.Style.Font.FontSize) {
                            _objSpanDivCss["font-size"] = run.Style.Font.FontSize;
                        }

                        if (run.Style.Font.FontStyle) {
                            _objSpanDivCss["font-style"] = run.Style.Font.FontStyle;
                        }

                        if (run.Style.Font.FontWeight) {
                            _objSpanDivCss["font-weight"] = run.Style.Font.FontWeight;
                        }

                        if (run.Style.TextColor) {
                            _objSpanDivCss["color"] = run.Style.TextColor;
                        } else {
                            _objSpanDivCss["color"] = 'black';
                        }

                        if (run.Style.TextDecoration) {
                            _objSpanDivCss["text-decoration"] = run.Style.TextDecoration;
                        }

                        if (run.RunText) {
                            run.IsHtmlText ? $textboxSpanDiv.append(run.RunText) : $textboxSpanDiv.text(run.RunText).text();
                        }

                        if (run.IsHtmlText && run.RunText != null && (run.RunText.indexOf("<p>") > -1)) {
                            $textboxSpanDiv.find("p:first").css("padding-top", "12px");
                            $textboxSpanDiv.find("p").css({ "padding-bottom": "12px", "margin": "0px" });
                        }

                        if (this._browserInfo.name == 'mozilla' && run.Style != null && run.Style.Font != null && run.Style.Font.FontSize != null) {
                            _objSpanDivCss["line-height"] = run.Style.Font.FontSize * 1.17 + "px";
                        }

                        $textboxSpanDiv.css(_objSpanDivCss);
                        $textboxParaDiv.append($textboxSpanDiv);
                    }

                    if (paragraph.TextAlignment) {
                        _objParaDivCss["text-align"] = paragraph.TextAlignment;
                    }

                    if (textboxModel.Direction != "Default") {
                        if (textboxModel.Direction != "LTR") {
                            _objParaDivCss["text-align"] = 'right';
                        }
                    }

                    if (textboxModel.VerticalAlign != "Default") {
                        _objParaDivCss["vertical-align"] = textboxModel.VerticalAlign;
                        if (!isTablixCell || textboxModel.IsNoRowMessage) {
                            _textboxCss["display"] = 'table';
                            _objParaDivCss["display"] = 'table-cell';
                        }
                    }

                    if (paragraph.LeftIndent) {
                        _objParaDivCss["padding-left"] = paragraph.LeftIndent;
                    }

                    if (paragraph.RightIndent) {
                        if (paragraph.TextAlignment == "Right") {
                            _objParaDivCss["padding-right"] = paragraph.RightIndent;
                            _objParaDivCss["float"] = 'right';
                        }
                        else {
                            _objParaDivCss["padding-right"] = paragraph.RightIndent;
                        }                        
                    }

                    if (paragraph.SpaceBefore) {
                        _objParaDivCss["padding-top"] = paragraph.SpaceBefore;
                    }

                    if (paragraph.SpaceAfter) {
                        _objParaDivCss["padding-bottom"] = paragraph.SpaceAfter;
                    }

                    if (paragraph.LineHeight) {
                        _objParaDivCss["line-height"] = paragraph.LineHeight + 'px';
                    }

                    if (paragraph.ListStyle) {
                        _objParaDivCss["list-style-type"] = paragraph.ListStyle;
                    }

                    if (paragraph.HangingIndent) {
                        _objParaDivCss["text-indent"] = paragraph.HangingIndent;
                    }

                    if (isTablixCell) {
                        _objParaDivCss["min-width"] = '99.9%';
                    }

                    if (paragraph.ListLevel && paragraph.ListLevel != 0 && textboxModel.Direction != "RTL") {
                        _objParaDivCss["margin-left"] = paragraph.ListLevel * '30';
                    }
                    else if (paragraph.ListLevel != 0 && textboxModel.Direction == "RTL") {
                        _objParaDivCss["margin-Right"] = paragraph.ListLevel * '30';
                        _objParaDivCss["direction"] = 'rtl';
                    }

                    if (paragraph.ListStyle == "Numbered" && paragraph.ListLevel >= 1) {
                        if (paragraph.ListLevel == 1 || paragraph.ListLevel == 4 || paragraph.ListLevel == 7) {
                            _objParaDivCss["display"] = 'list-item';
                            _objParaDivCss["list-style-type"] = 'decimal';
                        }
                        else if (paragraph.ListLevel == 2 || paragraph.ListLevel == 5 || paragraph.ListLevel == 8) {
                            _objParaDivCss["display"] = 'list-item';
                            _objParaDivCss["list-style-type"] = 'lower-roman';
                        }
                        else if (paragraph.ListLevel == 3 || paragraph.ListLevel == 6 || paragraph.ListLevel == 9) {
                            _objParaDivCss["display"] = 'list-item';
                            _objParaDivCss["list-style-type"] = 'lower-alpha';
                        }
                    }
                    else if (paragraph.ListStyle == "Bulleted" && paragraph.ListLevel >= 1) {
                        _objParaDivCss["display"] = 'list-item';
                        _objParaDivCss["list-style-type"] = paragraph.ListStyle;
                    }
                    $textboxParaDiv.css(_objParaDivCss);
                    textboxDiv.append($textboxParaDiv);
                }
            }

            if (textboxModel.Sorting) {
                var _sortingType = "sortingUpDown";
                if (textboxModel.Sorting.Sorting == 'UpDown') {
                    _sortingType = "sortingUpDown";
                } else if (textboxModel.Sorting.Sorting == 'Up') {
                    _sortingType = "sortingUp";
                } else {
                    _sortingType = "sortingDown";
                }
                var sortingiconDiv = ej.buildTag('div.e-reportviewer-' + _sortingType + ' txtSorting_' + this._id + ' e-reportviewer-usersort', '', { 'display': 'block', 'width': '14px', 'height': '14px', 'padding-right': '1px', 'margin-Top': '1px', 'float': 'right', 'vertical-align': 'middle', 'position': 'absolute', 'left': (textboxModel.Width - 14) < 0 ? '80%' : ((textboxModel.Width - 14)+ 'px'), 'top': '10%' }, {});
                sortingiconDiv.data('sortingObj', textboxModel.Sorting);
                textboxDiv.append(sortingiconDiv);
                _textboxCss["position"] = "relative";
            }
            textboxDiv.css(_textboxCss);
            return textboxDiv;
        },

        //-------------------- Render the Chart ReportItem [start] -------------------------//
        _renderChartControl: function (chartModel, isTablixCell, cellSize, parentObj, parentId, printMode, printPageId) {
            if (chartModel.ChartAreas) {
                var _height = chartModel.Height;
                var _width = chartModel.Width;
                var _parentID = 'chartCtrl';
                var ctrlId = this._controlKeyGenerator(this._id + '_' + chartModel.Name, parentId, printMode, printPageId);
                var chartDiv = ej.buildTag("div", "", {}, { 'id': ctrlId, 'title': chartModel.ToolTip });
                parentObj.append(chartDiv);
                chartDiv.css("position", "absolute");

                if (chartModel.ChartStyle) {
                    if (chartModel.ChartStyle.Border) {
                        this._applyBorderStyle(chartModel.ChartStyle.Border, chartDiv);
                    }

                    if (chartModel.ChartStyle.FillStyle) {
                        chartDiv.css('background-color', chartModel.ChartStyle.FillStyle.BackgroundColor);
                        this._applyBackgroundGradientStyle(chartModel.ChartStyle.FillStyle, chartDiv);
                    }
                    var resourceName = printMode ? 'PrintImage' : 'GetResource';
                    if (chartModel.BackgroundImge) {
                        chartDiv.css({ 'background-image': 'url(' + this.model.reportServiceUrl + '/' + resourceName + '/?key=' + chartModel.BackgroundImge + '&resourcetype=sfimg&isPrint=' + printMode + ')', 'background-size': '100% 100%' });
                    }
                }

                if (isTablixCell) {
                    _parentID = parentId;
                    _height = cellSize.height;
                    var borderwidthadjust = parseFloat(chartDiv.css("border-left-width"), 10) + parseFloat(chartDiv.css("border-right-width"), 10);
                    var borderheightadjust = parseFloat(chartDiv.css("border-top-width"), 10) + parseFloat(chartDiv.css("border-bottom-width"), 10);
                    _width = (_width - (borderwidthadjust));
                    _height = (_height - (borderheightadjust));
                    chartDiv.css("position", "relative");
                }

                var chartAreaHeight = ((_height) / (chartModel.ChartAreas.length));

                if (chartModel.Top) {
                    chartDiv.css("top", chartModel.Top);
                }

                if (chartModel.Left) {
                    chartDiv.css("left", chartModel.Left);
                }

                if (_width) {
                    chartDiv.css("width", _width);
                }

                if (_height) {
                    chartDiv.css("height", _height);
                }

                for (var areaIndex = 0; areaIndex < chartModel.ChartAreas.length; areaIndex++) {
                    var chartArea = chartModel.ChartAreas[areaIndex];
                    var chartChildDiv = null;
                    if (printMode) {
                        chartChildDiv = ej.buildTag("div", "", {}, { 'id': _parentID + '_' + this._id + '_' + chartModel.Name + '_' + chartArea.Name + '_' + printPageId, 'title': chartModel.ToolTip });
                    } else {
                        chartChildDiv = ej.buildTag("div", "", {}, { 'id': _parentID + '_' + this._id + '_' + chartModel.Name + '_' + chartArea.Name, 'title': chartModel.ToolTip });
                    }

                    chartDiv.append(chartChildDiv);
                    chartChildDiv.css("height", chartAreaHeight);
                    //chartChildDiv.css("margin", "1px");
                    chartChildDiv.ejChart();
                    var ejChartCtrl = chartChildDiv.data("ejChart");

                    var ejchartSeries = ejChartCtrl.model.series[0];
                    ejChartCtrl.model.series.pop(ejchartSeries);

                    if (chartArea.Style) {
                        if (chartArea.Style.FillStyle && chartArea.Style.FillStyle.BackgroundColor != "#00ffffff") {
                            ejChartCtrl.model.chartArea.background = chartArea.Style.FillStyle.BackgroundColor;
                        }
                       
                        var resourceName = printMode ? 'PrintImage' : 'GetResource';
                        if (chartArea.BackgroundImg) {
                            ejChartCtrl.model.backGroundImageUrl = (this.model.reportServiceUrl + '/' + resourceName + '/?key=' + chartArea.BackgroundImg+ '&resourcetype=sfimg&isPrint=' + printMode);
                        }

                        if (chartArea.Style.Border && chartArea.Style.Border.Default) {
                            if (chartArea.Style.Border.Default.BorderBrush) {
                                ejChartCtrl.model.chartArea.border.color = chartArea.Style.Border.Default.BorderBrush;
                            }
                            if (chartArea.Style.Border.Default.BorderStyle == "Default" || chartArea.Style.Border.Default.BorderStyle == "None") {
                                ejChartCtrl.model.chartArea.border.width = 0;
                                ejChartCtrl.model.chartArea.border.opacity = 0;
                            }
                            else {
                                ejChartCtrl.model.chartArea.border.width = chartArea.Style.Border.Default.Thickness;
                            }
                        }
                        else {
                            ejChartCtrl.model.chartArea.border.opacity = 1;
                            ejChartCtrl.model.chartArea.border.color = "Transparent";
                        }
                    }

                    if (areaIndex == 0 && chartModel.ChartTiles.length > 0) {
                        var charttile = chartModel.ChartTiles[areaIndex];
                        if (charttile.Caption && charttile.Visible) {
                            ejChartCtrl.model.title.text = charttile.Caption;
                            if (charttile.Style) {
                                if (charttile.Style.Color) {
                                    ejChartCtrl.model.title.font.color = charttile.Style.Color;
                                }

                                if (charttile.Style.Font) {
                                    if (charttile.Style.Font.FontFamily) {
                                        ejChartCtrl.model.title.font.fontFamily = charttile.Style.Font.FontFamily;
                                    }

                                    if (charttile.Style.Font.FontStyle) {
                                        ejChartCtrl.model.title.font.fontStyle = charttile.Style.Font.FontStyle;
                                    }

                                    if (charttile.Style.Font.FontWeight) {
                                        ejChartCtrl.model.title.font.fontWeight = charttile.Style.Font.FontWeight;
                                    }

                                    if (charttile.Style.Font.FontSize != 0) {
                                        ejChartCtrl.model.title.font.size = charttile.Style.Font.FontSize + 'px';
                                    }
                                }
                            }
                        }
                    }

                    for (var seriesIndex = 0; seriesIndex < chartArea.ChartSeries.length; seriesIndex++) {
                        var chartseries = chartArea.ChartSeries[seriesIndex];
                        var seriesObj = $.extend(true, {}, ejchartSeries);
                        var seriesPoints = seriesObj.points[0];
                        seriesObj.points = [];
                        seriesObj.type = chartseries.Type;
                        seriesObj.name = (chartseries.Legend && chartseries.Legend.LegendText) ? chartseries.Legend.LegendText : chartseries.Label;
                        seriesObj.name = (seriesObj.name == "" && chartseries.Name == "EmptySeriesName") ? chartseries.Name : seriesObj.name;

                        if (chartseries.Type == "explodedpie") {
                            seriesObj.type = "pie";
                            seriesObj.explodeAll = true;
                            seriesObj.explodeOffset = 8;
                        }

                        else if (chartseries.Type == "explodeddoughnut") {
                            seriesObj.type = "doughnut";
                            seriesObj.explodeAll = true;
                            seriesObj.explodeOffset = 10;
                        }

                        if (chartseries.Type == "stackingcolumn") {
                            seriesObj.isStacking = true;
                        } else {
                            seriesObj.isStacking = false;
                        }

                        var actionInfos = [];
                        for (var pointIndex = 0; pointIndex < chartseries.PointValues.length; pointIndex++) {
                            var pointObj = $.extend(true, {}, seriesPoints);
                            var point = chartseries.PointValues[pointIndex];
                            pointObj.YValues = [];
                            if (point.X) {
                                pointObj.X = pointObj.x = point.X;
                            } else {
                                pointObj.X = pointObj.x = "0";
                            }

                            if (point.Y) {
                                pointObj.Y = pointObj.y = point.Y;
                                pointObj.YValues.push(pointObj.Y);
                            } else {
                                pointObj.Y = pointObj.y = 0;
                                pointObj.YValues.push(pointObj.Y);
                            }

                            if (point.Low) {
                                pointObj.YValues.push(point.Low);
                            }

                            if (point.High) {
                                pointObj.YValues.push(point.High);
                            }

                            if (point.Start) {
                                pointObj.YValues.push(point.Start);
                            }

                            if (point.End) {
                                pointObj.YValues.push(point.End);
                            }

                            if (chartseries.Type == "bubble") {
                                pointObj.size = 0.5;
                            }

                            if (point.ChartDataLabel && !point.ChartDataLabel.Visible) {
                                pointObj.text = "";
                            }
                            else {
                                if (point.ChartDataLabel && point.ChartDataLabel.Format) {
                                    pointObj.text = point.ChartDataLabel.Format
                                }
                            }

                            if (point.ActionInfo) {
                                actionInfos.push(point.ActionInfo);
                            }

                            if (chartModel.ColorPalette == "Custom") {
                                for (var paletteIndex = 0; paletteIndex < chartModel.CustomPaletteColors.length; paletteIndex++) {
                                    ejChartCtrl.model.colors[paletteIndex] = chartModel.CustomPaletteColors[paletteIndex];
                                }
                            }
                            else {
                                if (!chartseries.Type == "doughnut" || !chartseries.Type == "pie") {
                                    ejChartCtrl.model.colors = [];
                                }
                                else if (point.Style && point.Style.Color) {
                                    ejChartCtrl.model.colors[pointIndex] = point.Style.Color;
                                }
                            }

                            if (point.Style && point.Style.Color) {
                                seriesObj.fill = point.Style.Color;
                            }

                            seriesObj.points.push(pointObj);

                        }

                        if (actionInfos.length > 0) {
                            ejChartCtrl.model.pointRegionClick = this._drillThroughClick;
                            ejChartCtrl.ejreportid = this._id;
                            chartChildDiv.data(ejChartCtrl._id + 'actionObj_Series' + seriesIndex, actionInfos);
                            ejChartCtrl.model.pointRegionMouseMove = function chartSeriesMouseHover(event) {
                                if (ej.isNullOrUndefined($('#' + this._id).data(this._id + 'actionObj_Series' + event.data.region.SeriesIndex))) {
                                    return false;
                                }
                                $('#' + this._id + '_svg_Series' + event.data.region.SeriesIndex + '_Point' + event.data.region.Region.PointIndex).css("cursor", "pointer");
                            };
                        }

                        seriesObj.visibility = chartseries.Visibility ? 'visible' : 'hide';
                        seriesObj.tooltip.format = " x: #point.x#<br/>y: #point.y#";
                        seriesObj.tooltip.visible = true;
                        seriesObj.enableAnimation = false;

                        if (chartModel.CustomPaletteColors && (chartModel.ColorPalette) && chartModel.ColorPalette == "Custom") {
                            seriesObj.fill = chartModel.CustomPaletteColors[seriesIndex];
                        }

                        if (chartseries.Style && chartseries.Style.Border && chartseries.Style.Border.Default) {
                            if (chartseries.Style.Border.Default.BorderBrush) {
                                seriesObj.border.color = chartseries.Style.Border.Default.BorderBrush;
                            }

                            if (chartseries.Style.Border.Default.Thickness != 0) {
                                seriesObj.border.width = chartseries.Style.Border.Default.Thickness;
                            }

                            if (chartseries.Style.Border.Default.BorderStyle == "Dashed") {
                                seriesObj.border.dashArray = "2,4";
                            }
                            else if (chartseries.Style.Border.Default.BorderStyle == "Dotted") {
                                seriesObj.border.dashArray = "2,2";
                            }
                        }

                        if (chartseries.DataPointsStyle && chartseries.DataPointsStyle.length > 0) {
                            if (chartseries.Type == "scatter") {
                                var datapointStyle = chartseries.DataPointsStyle[0];

                                if (datapointStyle.ChartMarker && datapointStyle.ChartMarker.MarkerType) {
                                    seriesObj.marker.shape = datapointStyle.ChartMarker.MarkerType;
                                } else {
                                    seriesObj.marker.shape = "Circle";
                                }
                                if (datapointStyle.ChartMarker.Color) {
                                    seriesObj.marker.fill = datapointStyle.ChartMarker.Color;
                                }

                                if (datapointStyle.ChartMarker.BorderColor) {
                                    seriesObj.marker.border.color = datapointStyle.ChartMarker.BorderColor;
                                }

                                if (datapointStyle.ChartMarker.Borderwidth) {
                                    seriesObj.marker.border.width = datapointStyle.ChartMarker.Borderwidth == 0 ? 2 : datapointStyle.ChartMarker.Borderwidth;
                                }

                                if (datapointStyle.ChartMarker.Size) {
                                    seriesObj.marker.size.height = seriesObj.marker.size.width = parseInt((datapointStyle.ChartMarker.Size == 0 || datapointStyle.ChartMarker.Size < 6)) ? 6 : (datapointStyle.ChartMarker.Size);
                                } else {
                                    seriesObj.marker.size.height = seriesObj.marker.size.width = 10;
                                }
                                seriesObj.marker.visible = true;
                            } else {
                                var datapointStyle = chartseries.DataPointsStyle[0];
                                if (datapointStyle.ChartMarker) {
                                    if (datapointStyle.ChartMarker.MarkerType) {
                                        seriesObj.marker.shape = datapointStyle.ChartMarker.MarkerType;
                                    }

                                    if (datapointStyle.ChartMarker.Color) {
                                        seriesObj.marker.fill = datapointStyle.ChartMarker.Color;
                                    }

                                    if (datapointStyle.ChartMarker.BorderColor) {
                                        seriesObj.marker.border.color = datapointStyle.ChartMarker.BorderColor;
                                    }

                                    if (datapointStyle.ChartMarker.Borderwidth) {
                                        seriesObj.marker.border.width = datapointStyle.ChartMarker.Borderwidth == 0 ? 2 : datapointStyle.ChartMarker.Borderwidth;
                                    }

                                    if (datapointStyle.ChartMarker.Size) {
                                        seriesObj.marker.size.height = seriesObj.marker.size.width = parseInt((datapointStyle.ChartMarker.Size == 0 || datapointStyle.ChartMarker.Size < 6)) ? 6 : (datapointStyle.ChartMarker.Size);
                                    }
                                }

                                if (chartseries.Visibility && datapointStyle.ChartMarker && datapointStyle.ChartMarker.MarkerType) {
                                    seriesObj.marker.visible = true;
                                }
                                else {
                                    seriesObj.marker.visible = false;
                                }

                                if (chartseries.PointValues.length > 0 && chartseries.PointValues[0].ChartDataLabel) {
                                    seriesObj.marker.dataLabel.visible = false;
                                    var pointDatalbl = chartseries.PointValues[0].ChartDataLabel;
                                    seriesObj.marker.dataLabel.visible = pointDatalbl.Visible;
                                    if (pointDatalbl.Visible) {
                                        seriesObj.marker.dataLabel.connectorLine.type = "line";
                                        seriesObj.marker.dataLabel.connectorLine.width = 0.5;
                                        seriesObj.marker.dataLabel.textPosition = (pointDatalbl.Position && pointDatalbl.Position == "Default") ? "top" : pointDatalbl.Position;
                                        seriesObj.marker.dataLabel.font.color = !pointDatalbl.TextColor ? "Black" : pointDatalbl.TextColor;
                                        if(pointDatalbl.Font){
                                            seriesObj.marker.dataLabel.font.fontFamily = pointDatalbl.Font.FontFamily;
                                            seriesObj.marker.dataLabel.font.fontStyle = pointDatalbl.Font.FontStyle;
                                            seriesObj.marker.dataLabel.font.fontWeight = pointDatalbl.Font.FontWeight;
                                            seriesObj.marker.dataLabel.font.size = pointDatalbl.Font.FontSize + "px";
                                        }
                                        if (pointDatalbl.BorderStyle && pointDatalbl.BorderStyle != "None") {
                                            seriesObj.marker.dataLabel.border.color = pointDatalbl.BorderColor;
                                            seriesObj.marker.dataLabel.border.width = pointDatalbl.BorderWidth;
                                            seriesObj.marker.dataLabel.shape = "Rectangle";
                                        }
                                        if (pointDatalbl.BackGroundColor && pointDatalbl.BackGroundColor != "Transparent") {
                                            seriesObj.marker.dataLabel.fill = pointDatalbl.BackGroundColor;
                                            seriesObj.marker.dataLabel.shape = "Rectangle";
                                        }
                                    }
                                }
                            }
                        }
                        ejChartCtrl.model.series.push(seriesObj);
                    }

                    if (chartModel.ChartLegends && chartModel.ChartLegends.length > 0) {
                        var chartLegend = chartModel.ChartLegends[0];
                        ejChartCtrl.model.legend.visible = chartLegend.Visibilty;

                        if (chartLegend.Alignment) {
                            ejChartCtrl.model.legend.alignment = chartLegend.Alignment;
                        }

                        if (chartLegend.Position) {
                            ejChartCtrl.model.legend.position = chartLegend.Position;
                        }

                        if (chartLegend.Style) {
                            if (chartLegend.Style.Color) {
                                ejChartCtrl.model.legend.font.color = chartLegend.Style.Color;
                            }

                            if (chartLegend.Style.Font) {
                                if (chartLegend.Style.Font.FontFamily) {
                                    ejChartCtrl.model.legend.font.fontFamily = chartLegend.Style.Font.FontFamily;
                                }

                                if (chartLegend.Style.Font.FontStyle) {
                                    ejChartCtrl.model.legend.font.fontStyle = chartLegend.Style.Font.FontStyle;
                                }

                                if (chartLegend.Style.Font.FontWeight) {
                                    ejChartCtrl.model.legend.font.fontWeight = chartLegend.Style.Font.FontWeight;
                                }

                                if (chartLegend.Style.Font.FontSize != 0) {
                                    ejChartCtrl.model.legend.font.size = chartLegend.Style.Font.FontSize + 'px';
                                }
                            }

                            if (chartLegend.Style.Border && chartLegend.Style.Border.Default) {
                                if (chartLegend.Style.Border.Default.BorderBrush) {
                                    ejChartCtrl.model.legend.border.color = chartLegend.Style.Border.Default.BorderStyle == "Default" ? "transparent" : chartLegend.Style.Border.Default.BorderBrush;
                                }

                                if (chartLegend.Style.Border.Default.Thickness != 0) {
                                    ejChartCtrl.model.legend.border.width = chartLegend.Style.Border.Default.Thickness;
                                }
                            }
                        }
                    }
                    else {
                        ejChartCtrl.model.legend.visible = false;
                    }

                    if (ejChartCtrl.model.series.length > 0 && ejChartCtrl.model.series[0].type != 'polar' && ejChartCtrl.model.series[0].type != 'radar') {
                        for (var chartAreaXaxisIndex = 0; chartAreaXaxisIndex < chartArea.ChartAreaXAxis.length; chartAreaXaxisIndex++) {
                            var chartXAxis = chartArea.ChartAreaXAxis[chartAreaXaxisIndex];
                            if (chartXAxis.Name.toString().toLowerCase() == "primary") {
                                this._applyAxis(chartXAxis, ejChartCtrl.model.primaryXAxis, 'XAxis', 'primary', ejChartCtrl.model.series[0].type, chartArea.Chart3D ? chartArea.Chart3D.Enabled:null);
                            }
                            //else if (chartXAxis.Name.toString().toLowerCase() == "secondary") {
                            //    if (!ej.isNullOrUndefined(ejChartCtrl.model.axes)) {
                            //        var xaxesObj = $.extend(true, {}, ejChartCtrl.model._axes[0]);
                            //        this._applyAxis(chartXAxis, xaxesObj, 'XAxis', 'secondary');
                            //        xaxesObj.opposedPosition = true;
                            //        xaxesObj.orientation = 'Horizontal';
                            //        ejChartCtrl.model.axes.push(xaxesObj);
                            //    }
                            //}
                        }

                        for (var chartAreaYaxisIndex = 0; chartAreaYaxisIndex < chartArea.ChartAreaYAxis.length; chartAreaYaxisIndex++) {
                            var chartYAxis = chartArea.ChartAreaYAxis[chartAreaYaxisIndex];
                            if (chartYAxis.Name.toString().toLowerCase() == "primary") {
                                this._applyAxis(chartYAxis, ejChartCtrl.model.primaryYAxis, 'YAxis', 'primary', ejChartCtrl.model.series[0].type, chartArea.Chart3D ? chartArea.Chart3D.Enabled:null);
                            }
                            //else if (chartYAxis.Name.toString().toLowerCase() == "secondary") {
                            //    if (!ej.isNullOrUndefined(ejChartCtrl.model.axes)) {
                            //        var yaxesObj = $.extend(true, {}, ejChartCtrl.model._axes[0]);
                            //        yaxesObj.opposedPosition = true;
                            //        yaxesObj.orientation = "vertical";
                            //        this._applyAxis(chartYAxis, yaxesObj, 'YAxis', 'secondary');
                            //        ejChartCtrl.model.axes.push(yaxesObj);
                            //    }
                            //}
                        }
                    }

                    if (chartArea.Chart3D && chartArea.Chart3D.Enabled) {
                        ejChartCtrl.model.enable3D = chartArea.Chart3D.Enabled;
                        ejChartCtrl.model.depth = chartArea.Chart3D.DepthRatio;
                        ejChartCtrl.model.wallSize = chartArea.Chart3D.WallThickness;
                        ejChartCtrl.model.tilt = 0;
                        ejChartCtrl.model.rotation = 20;
                        ejChartCtrl.model.perspectiveAngle = chartArea.Chart3D.Perspective == 0 ? 90 : chartArea.Chart3D.Perspective;
                        ejChartCtrl.model.crosshair.visible = true;
                    }

                    if (chartseries && chartseries.PointValues.length <= 0) {
                        ejChartCtrl.model.legend.visible = false;
                        ejChartCtrl.model.primaryXAxis.visible = false;
                        ejChartCtrl.model.primaryYAxis.visible = false;
                        ejChartCtrl.model.series = [];
                        ejChartCtrl.model.chartArea.visible = false;
                        var chartsubtile = chartModel.ChartNoDataMessage;
                        if (ejChartCtrl.model.title.text == "") {
                            ejChartCtrl.model.title.text = " ";
                        }
                        if (chartsubtile.Caption && chartsubtile.Visible) {
                            ejChartCtrl.model.title.subTitle.textAlignment = "center";
                            ejChartCtrl.model.title.subTitle.text = chartsubtile.Caption;
                            if (chartsubtile.Style) {
                                if (chartsubtile.Style.Color) {
                                    ejChartCtrl.model.title.subTitle.font.color = chartsubtile.Style.Color;
                                }

                                if (chartsubtile.Style.Font) {
                                    if (chartsubtile.Style.Font.FontFamily) {
                                        ejChartCtrl.model.title.subTitle.font.fontFamily = chartsubtile.Style.Font.FontFamily;
                                    }

                                    if (chartsubtile.Style.Font.FontStyle) {
                                        ejChartCtrl.model.title.subTitle.font.fontStyle = chartsubtile.Style.Font.FontStyle;
                                    }

                                    if (chartsubtile.Style.Font.FontWeight) {
                                        ejChartCtrl.model.title.subTitle.font.fontWeight = chartsubtile.Style.Font.FontWeight;
                                    }

                                    if (chartsubtile.Style.Font.FontSize != 0) {
                                        ejChartCtrl.model.title.subTitle.font.size = chartsubtile.Style.Font.FontSize + 'px';
                                    }
                                }
                            }
                        }
                    }
                    ejChartCtrl.redraw();
                }
            }
        },

        _applyBackgroundGradientStyle: function (style, tag) {
            var type;
            switch (style.BackgroundGradientType) {
                case "None":
                    break;
                case "Default":
                    break;
                case "LeftRight":
                    type = "to right";
                    tag.css('background', 'linear-gradient(' + type + ',' + style.BackgroundColor + ', ' + style.BackgroundGradientEndcolor + ')');
                    break;
                case "TopBottom":
                    tag.css('background', 'linear-gradient(' + style.BackgroundColor + ', ' + style.BackgroundGradientEndcolor + ')');
                    break;
                case "Center":
                    tag.css('background', 'radial-gradient(' + style.BackgroundColor + ', ' + style.BackgroundGradientEndcolor + ')');
                    break;
                case "DiagonalLeft":
                    type = "to bottom right";
                    tag.css('background', 'linear-gradient(' + type + ',' + style.BackgroundColor + ', ' + style.BackgroundGradientEndcolor + ')');
                    break;
                case "DiagonalRight":
                    type = "to bottom left";
                    tag.css('background', 'linear-gradient(' + type + ',' + style.BackgroundColor + ', ' + style.BackgroundGradientEndcolor + ')');
                    break;
                case "HorizontalCenter":
                    tag.css('background', 'linear-gradient(' + style.BackgroundColor + ',' + style.BackgroundGradientEndcolor + ', ' + style.BackgroundColor + ')');
                    break;
                case "VerticalCenter":
                    tag.css('background', 'linear-gradient(90deg,' + style.BackgroundColor + ',' + style.BackgroundGradientEndcolor + ', ' + style.BackgroundColor + ')');
                    break;
            }
        },

        _applyAxis: function (axisModelProp, axisName, axisSpecific, axistype, seriestype, threeDEnabled) {
            if (seriestype != 'pie' && !threeDEnabled) {
                axisName.labelPlacement = 'onticks';
            }

            if (axisModelProp.ChartAxisTitle) {

                if (axisModelProp.ChartAxisTitle.Caption) {
                    axisName.title.text = axisModelProp.ChartAxisTitle.Caption;
                }

                if (axisModelProp.ChartAxisTitle.TextColor) {
                    axisName.title.font.color = axisModelProp.ChartAxisTitle.TextColor;
                }

            if (axisModelProp.ChartAxisTitle.Font) {
                if (axisModelProp.ChartAxisTitle.Font.FontSize) {
                    axisName.title.font.size = axisModelProp.ChartAxisTitle.Font.FontSize;
                }

                if (axisModelProp.ChartAxisTitle.Font.FontFamily) {
                    axisName.title.font.fontFamily = axisModelProp.ChartAxisTitle.Font.FontFamily;
                }

                    if (axisModelProp.ChartAxisTitle.Font.FontStyle) {
                        axisName.title.font.fontStyle = axisModelProp.ChartAxisTitle.Font.FontStyle;
                    }
                }
            }

            if ((axisModelProp.Maximum && axisModelProp.Maximum != "NaN" && axisModelProp.Maximum != 0) && (axisModelProp.Minimum && axisModelProp.Minimum != "NaN" && axisModelProp.Minimum != 0)) {
                axisName.range.max = axisModelProp.Maximum;
                axisName.range.min = axisModelProp.Minimum;
            }
            if (axisModelProp.Interval != "NaN") {
                //axisName.range.interval = axisModelProp.Interval;
            }

            if (axisModelProp.IntervalType) {
                //axisName.intervalType = axisModelProp.IntervalType;
            }

            axisName.font.color = axisModelProp.LabelColor ? axisModelProp.LabelColor : "Black";
            axisName.labelFormat = axisModelProp.LabelFormat;
            if (axisModelProp.LabelFont) {
                axisName.font.fontFamily = axisModelProp.LabelFont.FontFamily;
                axisName.font.size = axisModelProp.LabelFont.FontSize;
                axisName.font.fontStyle = axisModelProp.LabelFont.FontStyle == "Default" ? "Normal" : axisModelProp.LabelFont.FontStyle;
                axisName.font.fontWeight = axisModelProp.LabelFont.FontWeight;
            }

            if (axisModelProp.ChartMajorGridLines) {
                this._applyGridLines(axisModelProp.ChartMajorGridLines, axisName.majorGridLines);
            }

            if (axisModelProp.ChartMinorGridLines) {
                this._applyGridLines(axisModelProp.ChartMinorGridLines, axisName.minorGridLines);
            }

            if (axisModelProp.ChartMajorTickMarks) {
                this._applyTickMarks(axisModelProp.ChartMajorTickMarks, axisName.majorTickLines);
            }

            if (axisModelProp.ChartMinorTickMarks) {
                this._applyTickMarks(axisModelProp.ChartMinorTickMarks, axisName.minorTickLines);
            }

            if (axisName.minorTicksPerInterval == null)
            {
                axisName.minorTicksPerInterval = 1;
            }

            if (axisModelProp.LabelsAutoFitEnabled) {
                if (axisModelProp.PrExventWordWrap) {
                    if (axisModelProp.PrExventLabelOffset) {
                        if (axisModelProp.AllowLabelRotation) {
                            axisName.labelIntersectAction = axisModelProp.AllowLabelRotation;
                        }
                        else {
                            axisName.labelIntersectAction = 'multiplerows';
                        }
                    }
                }
                else {
                    axisName.labelIntersectAction = 'none';
                }
            }
            else {
                axisName.labelRotation = axisModelProp.Angle;
            }

            if (axisModelProp.LineColor) {
                axisName.axisLine.color = axisModelProp.LineColor;
            }
            if (axisModelProp.LineWidth) {
                axisName.axisLine.width = axisModelProp.LineWidth;
            }

            if (axisModelProp.HideEndLabels) {
                axisName.edgeLabelPlacement = 'hide';
            }

            if (axisModelProp.VisibleStatus == "True" || (axistype == 'primary' && axisModelProp.VisibleStatus == 'Auto')) {
                axisName.visible = true;
                axisName.axisLine.visible = true;
            } else {
                axisName.visible = false;
                axisName.axisLine.visible = false;
            }
            axisName.rangePadding = 'none';
        },

        _applyGridLines: function (applySrc, applyTarget) {
            applyTarget.visible = applySrc.Enabled;
            if (applySrc.Enabled) {
                if (applySrc.Style && applySrc.Style.Default) {
                    if (applySrc.Style.Default.BorderBrush) {
                        applyTarget.color = applySrc.Style.Default.BorderBrush;
                    }

                    applyTarget.width = applySrc.Style.Default.BorderStyle == "None" ? applyTarget.width : applySrc.Style.Default.Thickness;

                    if (applySrc.Style.Default.BorderStyle == "Dashed") {
                        applyTarget.dashArray = "2,4";
                    }
                    else if (applySrc.Style.Default.BorderStyle == "Dotted") {
                        applyTarget.dashArray = "2,2";
                    }
                }
            }
        },

        _applyTickMarks: function (applySrc, applyTarget) {
            applyTarget.visible = applySrc.Enabled;

            if (applySrc.Style && applySrc.Style.Default) {
                if (applySrc.Style.Default.BorderBrush) {
                    applyTarget.color = applySrc.Style.Default.BorderBrush;
                }

                if (applySrc.Style.Default.Thickness) {
                    applyTarget.width = applySrc.Style.Default.Thickness;
                }
            }

            if (applySrc.Length) {
                applyTarget.size = applySrc.Length;
            }
        },
        //-------------------- Render the Chart ReportItem [end] -------------------------//

        _renderImageControl: function (imgModel, isTablixCell, parnetObj, parentId, printMode, printPageId) {
            var ctrlId = this._controlKeyGenerator(this._id + '_' + imgModel.Name, parentId, printMode, printPageId);
            var imageDiv = ej.buildTag("div", "", {}, { id: ctrlId, title: imgModel.ToolTip });
            var _imageDivCss = {};
            parnetObj.append(imageDiv);
            _imageDivCss["position"] = (isTablixCell && imgModel.IsTablixChild) ? 'relative' : 'absolute';
            _imageDivCss["top"] = imgModel.Top;
            _imageDivCss["left"] = imgModel.Left;
            _imageDivCss["width"] = imgModel.Width;
            _imageDivCss["height"] = imgModel.Height;

            _imageDivCss["padding-left"] = imgModel.PaddingLeft;
            _imageDivCss["padding-right"] = imgModel.PaddingRight;
            _imageDivCss["padding-top"] = imgModel.PaddingTop;
            _imageDivCss["padding-bottom"] = imgModel.PaddingBottom;

            if (imgModel.ActionInfo) {
                imageDiv.data('actionObj', imgModel.ActionInfo);
                imageDiv.addClass('drillAction_' + this._id + ' e-reportviewer-drillhover');
            }

            if (imgModel.Border && !imgModel.IsTablixChild) {
                this._applyBorderStyle(imgModel.Border, imageDiv);
            }

            var resourceName = printMode ? 'PrintImage' : 'GetResource';
            var imgwidth = imgModel.IsTablixChild ? imgModel.Width : '100%';
            var imgheight = imgModel.IsTablixChild ? imgModel.Height : '100%';
            var imagetag = ej.buildTag("img", "", { 'width': imgwidth, 'height': imgheight }, { 'src': this.model.reportServiceUrl + '/' + resourceName + '/?key=' + imgModel.ImageUrl + '&resourcetype=sfimg&isPrint=' + printMode });
            imageDiv.append(imagetag);
            imageDiv.css(_imageDivCss);
        },

        _renderRectangleControl: function (rectModel, isTablixCell, parentObj, parentId, printMode, printPageId) {
            var ctrlId = this._controlKeyGenerator(this._id + '_' + rectModel.Name, parentId, printMode, printPageId);
            var rectDiv = ej.buildTag("div", "", {}, { 'id': ctrlId, title: rectModel.ToolTip });
            var _rectDivCss = {};            
            parentObj.append(rectDiv);
            _rectDivCss["position"] = isTablixCell ? 'relative' : 'absolute';
            _rectDivCss["top"] = rectModel.Top;
            _rectDivCss["left"] = rectModel.Left;
            _rectDivCss["width"] = rectModel.Width;
            _rectDivCss["height"] = rectModel.Height;
            _rectDivCss["background-color"] = rectModel.BackgroundColor;

            var resourceName = printMode ? 'PrintImage' : 'GetResource';
            if (rectModel.BackgroundImageSrc) {
                _rectDivCss["background-image"] = "url(" + this.model.reportServiceUrl + '/' + resourceName + '/?key=' + rectModel.BackgroundImageSrc + '&resourcetype=sfimg&isPrint=' + printMode + ")";
            }

            if (rectModel.Border && !isTablixCell) {
                this._applyBorderStyle(rectModel.Border, rectDiv);
            }

            if (rectModel.IsTablixChild && rectModel.ReportModels && rectModel.ReportModels.length > 0) {
                for (var i = 0; i < rectModel.ReportModels.length; i++) {
                    var innerItem = rectModel.ReportModels[i];
                    if (innerItem) {
                        if (innerItem.ItemType == "TextBoxModel") {
                            var textboxControl = this._renderTextBoxControl(innerItem, false, ctrlId + '_' + innerItem.Name, printMode, printPageId);
                            rectDiv.append(textboxControl);
                        }
                        else if (innerItem.ItemType == "LineModel") {
                            var lineControl = this._renderLineControl(innerItem, ctrlId + '_' + innerItem.Name, printMode, printPageId);
                            rectDiv.append(lineControl);
                        }
                        else if (innerItem.ItemType == "ImageModel") {
                            this._renderImageControl(innerItem, false, rectDiv, ctrlId + '_' + innerItem.Name, printMode, printPageId);
                        }
                        else if (innerItem.ItemType == "TablixModel") {
                            this._renderTablixControl(innerItem, false, {}, rectDiv, ctrlId + '_' + innerItem.Name, printPageId);
                        }
                        else if (innerItem.ItemType == "GaugeModel") {
                            this._renderGaugeControl(innerItem, false, {}, rectDiv, ctrlId + '_' + innerItem.Name, printMode, printPageId);
                        }
                        else if (innerItem.ItemType == "RectangleModel") {
                            this._renderRectangleControl(innerItem, false, rectDiv, ctrlId + + '_' + innerItem.Name, printMode, printPageId);
                        }
                        else if (innerItem.ItemType == "ChartModel") {
                            this._renderChartControl(innerItem, false, {}, rectDiv, ctrlId + '_' + innerItem.Name, printMode, printPageId);
                        }
                        else if (innerItem.ItemType == "MapModel") {
                            this._renderMapControl(innerItem, rectDiv, ctrlId + '_' + innerItem.Name, printMode, printPageId);
                        }
                        else if (innerItem.ItemType == "SubReportModel") {
                            this._renderSubReportControl(innerItem, false, rectDiv, ctrlId + + '_' + innerItem.Name, printMode, printPageId);
                        }
                    }
                }
            }
            rectDiv.css(_rectDivCss);
        },

        _renderMapControl: function (mapModel, parentObj, parentId, printMode, printPageId) {
            var mapContainer = mapModel.MapProperties;
            var ctrlId = this._controlKeyGenerator(this._id + '_' + mapModel.Name, parentId, printMode, printPageId);
            var mapDiv = ej.buildTag("div", "", {}, { 'id': ctrlId });
            var titleContainerHeight = 0;
            parentObj.append(mapDiv);

            mapDiv.css("position", "absolute");
            mapDiv.css("top", mapModel.Top);
            mapDiv.css("left", mapModel.Left);
            mapDiv.css("height", mapModel.Height);
            mapDiv.css("width", mapModel.Width);
            if (mapContainer.Background && mapContainer.Background.BackgroundColor) {
                mapDiv.css("background-color", mapContainer.Background.BackgroundColor);
            }

            if (mapModel.IsTablixChild) {
                mapDiv.css("position", "relative");
            }

            if (mapContainer.ActionInfo) {
                mapDiv.data('actionObj', mapContainer.ActionInfo);
                mapDiv.addClass('drillAction_' + this._id + ' e-reportviewer-drillhover');
            }

            if (mapContainer.Border) {
                this._applyBorderStyle(mapContainer.Border, mapDiv);
            }
            var title = mapContainer.MapTitles;
            if (title && title.length > 0) {

                for (var i = 0; i < title.length; i++) {
                    var titleDiv = ej.buildTag("div", "", {}, { 'id': ctrlId + '_' + title[i].Name });
                    titleDiv.css("position", "relative");
                    titleDiv.css("left", "1px");
                    titleDiv.css("height", title[i].Style.Font.FontSize - (3 * title[i].Border.Thickness));
                    titleDiv.css("width", mapModel.Width - (3 * title[i].Border.Thickness));
                    titleDiv.css("text-align", "center");
                    titleDiv.css("background-color", title[i].BackGround.BackgroundColor);
                    titleDiv.css("border-color", title[i].Border.BorderBrush);
                    titleDiv.css("border-width", title[i].Border.Thickness);
                    titleDiv.css("border-style", title[i].Border.BorderStyle);

                    var span = ej.buildTag("span", "", {}, { 'id': ctrlId + '_' + title[i].Name + '_' + i });
                    span.css("font-family", title[i].Style.Font.FontFamily);
                    span.css("font-size", (title[i].Style.Font.FontSize / 1.33));
                    span.css("font-style", title[i].Style.Font.FontStyle);
                    span.css("font-weight", title[i].Style.Font.FontWeight);
                    span.append(title[i].Text);
                    titleDiv.append(span);
                    mapDiv.append(titleDiv);
                }
            }

            if (mapContainer.MapViewport) {
                var viewPort = mapContainer.MapViewport;
                var shapDiv = ej.buildTag("div", "", {}, { 'id': ctrlId + '_' + mapModel.Name });
                mapDiv.append(shapDiv);
                shapDiv.css("left", "1px");
                shapDiv.css("top", "1px");

                if (title && title.length > 0) {
                    for (var titleIndex = 0; titleIndex < title.length; titleIndex++) {
                        titleContainerHeight = titleContainerHeight + title[titleIndex].Style.Font.FontSize;
                    }
                    shapDiv.css("height", ((mapModel.Height - titleContainerHeight) - (3 * viewPort.Border.Thickness)));
                    shapDiv.css("top", "10px");
                }
                else {
                    shapDiv.css("height", (mapModel.Height - (3 * viewPort.Border.Thickness)));
                }

                shapDiv.css("width", mapModel.Width - (3 * viewPort.Border.Thickness));
                shapDiv.css("background-color", viewPort.BackGround.BackgroundColor);
                shapDiv.css("border-color", viewPort.Border.BorderBrush);
                shapDiv.css("border-width", viewPort.Border.Thickness);
                shapDiv.css("border-style", viewPort.Border.BorderStyle);

                shapDiv.ejMap({ layers: [{ layerType: "geometry" }] });
                var map = shapDiv.data("ejMap");
                map.model.zoomSettings.minValue = 1;
                map.model.zoomSettings.level = 1;
                map.model.zoomSettings.enableZoom = false;

                map.model.centerPosition = [viewPort.MapView.CenterX, viewPort.MapView.CenterY];

                if (mapContainer.MapPolygonLayers && mapContainer.MapPolygonLayers.length > 0) {
                    for (var polygonIndex = 0; polygonIndex < mapContainer.MapPolygonLayers.length; polygonIndex++) {
                        var polygon = mapContainer.MapPolygonLayers[polygonIndex];
                        var layer = $.extend(true, {}, map.model.layers[0]);
                        layer.layerType = "geometry";
                        layer.enableSelection = false;
                        layer.enableMouseHover = false;
                        layer.shapeData = polygon.MapFields;
                        if (polygon.MapBindingFieldPairs) {
                            layer.shapePropertyPath = polygon.MapBindingFieldPairs.FieldName;
                        }
                        layer.shapeDataPath = 'Value';
                        layer.dataSource = mapModel.MapModelData;

                        if (mapModel.MapModelData && mapModel.MapModelData.length > 0 && mapModel.MapModelData[0].ShapeActionInfo) {
                            map.ejreportid = this._id;
                            map.model.shapeSelected = this._drillThroughClick;
                            layer.enableSelection = true;
                            layer.enableMouseHover = true;
                            map.model.mouseover = function (event) {
                                if (event.originalEvent.data && event.originalEvent.data.ShapeActionInfo) {
                                    $(event.originalEvent.shape).css('cursor', 'pointer');
                                }
                            };
                        }

                        if (polygon.ShapeSettings) {
                            var shapesettings = $.extend(true, {}, layer.shapeSettings);
                            shapesettings.colorValuePath = polygon.ShapeSettings.ShapeColorValuePath;
                            shapesettings.valuePath = polygon.ShapeSettings.ShapeValuePath;
                            if (polygon.ShapeColorMappings && polygon.ShapeColorMappings.length > 1) {
                                shapesettings.colorMappings = { equalColorMapping: polygon.ShapeColorMappings };
                            }
                            else {
                                shapesettings.autoFill = true;
                                shapesettings.colorPalette = "palette1";
                            }
                            layer.shapeSettings = shapesettings;
                        }
                        if (polygon.MapCenterPointRules && polygon.MapCenterPointRules.length > 0 && polygon.MapCenterPointRules.MapSizeRule) {
                            var bubblesettings = $.extend(true, {}, layer.bubbleSettings);
                            bubblesettings.maxValue = polygon.BubbleSettings.MaxSize;
                            bubblesettings.minValue = polygon.BubbleSettings.MinSize;
                            bubblesettings.colorValuePath = polygon.BubbleSettings.ColorValuePath == null ? "Value" : polygon.BubbleSettings.ColorValuePath;
                            bubblesettings.valuePath = polygon.BubbleSettings.ValuePath;
                            if (polygon.BubbleColorMappings && polygon.BubbleColorMappings.length > 1) {
                                bubblesettings.colorMappings = { equalColorMapping: polygon.BubbleColorMappings };
                            }
                            layer.bubbleSettings = bubblesettings;
                        }

                        if (polygon.MapPolygonTemplate) {
                            var labelsettings = $.extend(true, {}, layer.labelSettings);
                            labelsettings.showLabels = true;
                            if (polygon.ShapeSettings) {
                                labelsettings.labelPath = polygon.ShapeSettings.LabelPath;
                            }
                            labelsettings.enableSmartLabel = false;
                            layer.labelSettings = labelsettings;
                        }

                        if (mapContainer.MapLegends && mapContainer.MapLegends.length > 0) {
                            var legendsettings = $.extend(true, {}, layer.legendSettings);
                            legendsettings.showLegend = true;
                            layer.legendSettings = legendsettings;
                        }
                        map.model.layers[polygonIndex] = layer;
                    }
                }
                map.refresh();
                shapDiv.css("position", "relative");
            }
        },

        //-------------------- Render the Gauge ReportItem [start] -------------------------//
        _renderGaugeControl: function (gaugeModel, isTablixCell, cellSize, parentObj, parentId, printMode, printPageId) {
            var gaugePanel = gaugeModel.GaugePanel;
            var ctrlId = this._controlKeyGenerator(this._id + '_' + gaugeModel.Name, parentId, printMode, printPageId);
            var gaugeDiv = ej.buildTag("div", "", {}, { 'id': ctrlId });
            parentObj.append(gaugeDiv);
            gaugeDiv.css("position", "absolute");
            var containerHeight = gaugeModel.Height;
            var containerWidth = gaugeModel.Width;

            if (gaugeModel.Top) {
                gaugeDiv.css("top", gaugeModel.Top);
            }

            if (gaugeModel.Left) {
                gaugeDiv.css("left", gaugeModel.Left);
            }
            var panelOrientation = 'Horizontal';
            var itemCount = 0;

            if (gaugePanel.RadialGauges && gaugePanel.RadialGauges.length > 0) {
                itemCount = itemCount + gaugePanel.RadialGauges.length;
            }

            if (gaugePanel.LinearGauges && gaugePanel.LinearGauges.length > 0) {
                itemCount = itemCount + gaugePanel.LinearGauges.length;
            }

            if (gaugePanel.Indicator && gaugePanel.Indicator.length > 0) {
                itemCount = itemCount + gaugePanel.Indicator.length;
            }

            var resourceName = printMode ? 'PrintImage' : 'GetResource';
            if (gaugePanel.GaugeFrame && gaugePanel.GaugeFrame.FrameImage) {
                gaugeDiv.css("background-image", "url(" + this.model.reportServiceUrl + '/' + resourceName + '/?key=' + gaugePanel.GaugeFrame.FrameImage + '&resourcetype=sfimg&isPrint=' + printMode + ")");
            }

            if (gaugePanel.Border) {
                this._applyBorderStyle(gaugePanel.Border, gaugeDiv);
            }

            if (isTablixCell) {
                _parentID = parentId;
                containerHeight = cellSize.height;
                var borderwidthadjust = parseFloat(gaugeDiv.css("border-left-width"), 10) + parseFloat(gaugeDiv.css("border-right-width"), 10);
                var borderheightadjust = parseFloat(gaugeDiv.css("border-top-width"), 10) + parseFloat(gaugeDiv.css("border-bottom-width"), 10);
                containerWidth = (containerWidth - (borderwidthadjust));
                containerHeight = (containerHeight - (borderheightadjust));
            }

            if (itemCount != 0) {
                if (containerHeight > containerWidth) {
                    containerHeight = containerHeight / itemCount;
                    panelOrientation = 'Vertical';
                } else {
                    containerWidth = containerWidth / itemCount;
                }
            }

            if (gaugePanel.GaugeLabel) {
                this._renderGaugeLabels(gaugePanel.GaugeLabel, gaugeDiv, gaugeModel.Name, parentId, printMode, printPageId);
            }

            if (gaugePanel.RadialGauges && gaugePanel.RadialGauges.length > 0) {
                this._renderRadialGauge(gaugePanel.RadialGauges, gaugeDiv, gaugeModel.Name, panelOrientation, containerWidth, containerHeight, parentId, printMode, printPageId);
            }

            if (gaugePanel.LinearGauges && gaugePanel.LinearGauges.length > 0) {
                this._renderLinearGauge(gaugePanel.LinearGauges, gaugeDiv, gaugeModel.Name, panelOrientation, containerWidth, containerHeight, parentId, printMode, printPageId);
            }

            if (gaugePanel.Indicator && gaugePanel.Indicator.length > 0) {
                this._renderIndicator(gaugePanel.Indicator, gaugeDiv, gaugeModel.Name, containerWidth, containerHeight, parentId, printMode, printPageId);
            }

            if (isTablixCell) {
                gaugeDiv.css({ 'position': 'relative', 'width': containerWidth, 'height': containerHeight, 'background-color': gaugePanel.BackgroundColor });
            } else {
                gaugeDiv.css({ 'width': gaugeModel.Width, 'height': gaugeModel.Height, 'background-color': gaugePanel.BackgroundColor });
            }
        },

        _renderIndicator: function (indicators, gaugeDiv, gaugeName, containerWidth, containerHeight, parentId, printMode, printPageId) {
            var svgNs = "http://www.w3.org/2000/svg";
            for (var guageIndex = 0; guageIndex < indicators.length; guageIndex++) {
                var svgelement = document.createElementNS(svgNs, "svg");
                var groupElement = document.createElementNS(svgNs, "g");
                var scaleXy = (containerWidth < containerHeight) ? containerWidth : containerHeight;
                var indicator = indicators[guageIndex];
                var indicatorDiv = ej.buildTag("div", "", { 'width': containerWidth, 'height': containerHeight, 'top': '0px', 'left': '0px' }, { 'id': this._controlKeyGenerator(this._id + '_' + gaugeName + '_' + indicator.Name, parentId, printMode, printPageId), title: indicator.ToolTip });
                var indicatorinnerDiv = ej.buildTag("div", "", { 'width': '20px', 'height': '20px', 'position': 'relative', 'display': 'block' });
                //svgelement.setAttributeNS(null, 'width', 'auto');
                //svgelement.setAttributeNS(null, 'height', 'auto');
                svgelement.setAttributeNS(null, 'style', 'display: block;margin:auto');
                for (var state = 0; state < indicator.IndicatorState.length; state++) {
                    var style = indicator.IndicatorState[state].IndicatorStyle;
                    var startValue = indicator.IndicatorState[state].StartValue.Value;
                    var endValue = indicator.IndicatorState[state].EndValue.Value;

                    var temStart=startValue;
                    var temEnd=endValue;
                    if(startValue >= endValue){
                        startValue = temEnd;
                        endValue = temStart;
                    }

                    if ((indicator.IndicatorData.Value >= startValue && indicator.IndicatorData.Value <= endValue)) {
                        var fillColor = indicator.IndicatorState[state].FillColor;
                        var svgAttribute = 'display: block;';
                        var innerDivWidth = 17;
                        var innerDivHeight = 17;
                        switch (style) {
                            case "ArrowDown":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M7.60501098632813,16.3990020751953L14.06298828125,10.0289993286133 10.3890075683594,10.0289993286133 10.3890075683594,2.32599639892578 4.61099243164063,2.32599639892578 4.61099243164063,10.0289993286133 1.14801025390625,10.0289993286133 7.60501098632813,16.3990020751953z" });
                                innerDivWidth = 16;
                                innerDivHeight = 19;
                                svgAttribute = svgAttribute + 'margin-left:.5px;';
                                break;
                            case "ArrowDownIncline":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M13.5499877929688,13.8919982910156L13.6119995117188,4.822998046875 11.0130004882813,7.42100524902344 5.5670166015625,1.9739990234375 1.48101806640625,6.05900573730469 6.92901611328125,11.5059967041016 4.47900390625,13.9550018310547 13.5499877929688,13.8919982910156z" });
                                innerDivWidth = innerDivHeight = 16;
                                svgAttribute = svgAttribute + 'margin-left:.5px;';
                                break;
                            case "ArrowSide":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M15.1960144042969,8.43499755859375L8.8280029296875,1.97899627685547 8.8280029296875,5.65299987792969 1.125,5.65299987792969 1.125,11.4300003051758 8.8280029296875,11.4300003051758 8.8280029296875,14.8919982910156 15.1960144042969,8.43499755859375z" });
                                svgAttribute = svgAttribute + 'margin-left:.5px;';
                                break;
                            case "ArrowUp":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M7.27099609375,1.47299957275391L0.81500244140625,7.84200286865234 4.48800659179688,7.84200286865234 4.48800659179688,15.5439987182617 10.2659912109375,15.5439987182617 10.2659912109375,7.84200286865234 13.7279968261719,7.84200286865234 7.27099609375,1.47299957275391z" });
                                innerDivWidth = 16;
                                svgAttribute = svgAttribute + 'margin-left:.5px;';
                                break;
                            case "ArrowUpIncline":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M13.0830078125,2.04299926757813L4.0159912109375,1.98199462890625 6.61300659179688,4.58000183105469 1.16598510742188,10.0269927978516 5.25100708007813,14.1119995117188 10.697998046875,8.66499328613281 13.14599609375,11.1130065917969 13.0830078125,2.04299926757813z" });
                                innerDivWidth = 15;
                                innerDivHeight = 16;
                                svgAttribute = svgAttribute + 'margin-left:.5px;';
                                break;
                            case "BoxesAllFilled":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M2.031005859375,7.5L8.031005859375,7.5 8.031005859375,1.5 2.031005859375,1.5 2.031005859375,7.5z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M8.96798706054688,7.5L14.9679870605469,7.5 14.9679870605469,1.5 8.96798706054688,1.5 8.96798706054688,7.5z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M2.031005859375,14.43701171875L8.031005859375,14.43701171875 8.031005859375,8.43798828125 2.031005859375,8.43798828125 2.031005859375,14.43701171875z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M8.96798706054688,14.43701171875L14.9679870605469,14.43701171875 14.9679870605469,8.43798828125 8.96798706054688,8.43798828125 8.96798706054688,14.43701171875z" });
                                svgAttribute = svgAttribute + 'margin-top:2.5px;';
                                break;
                            case "BoxesNoneFilled":
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M2.031005859375,7.5L8.031005859375,7.5 8.031005859375,1.5 2.031005859375,1.5 2.031005859375,7.5z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M8.96798706054688,7.5L14.9679870605469,7.5 14.9679870605469,1.5 8.96798706054688,1.5 8.96798706054688,7.5z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M2.031005859375,14.43701171875L8.031005859375,14.43701171875 8.031005859375,8.43798828125 2.031005859375,8.43798828125 2.031005859375,14.43701171875z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M8.96798706054688,14.43701171875L14.9679870605469,14.43701171875 14.9679870605469,8.43798828125 8.96798706054688,8.43798828125 8.96798706054688,14.43701171875z" });
                                innerDivHeight = 16;
                                break;
                            case "BoxesOneFilled":
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M2.031005859375,7.5L8.031005859375,7.5 8.031005859375,1.5 2.031005859375,1.5 2.031005859375,7.5z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M8.96798706054688,7.5L14.9679870605469,7.5 14.9679870605469,1.5 8.96798706054688,1.5 8.96798706054688,7.5z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M2.031005859375,14.43701171875L8.031005859375,14.43701171875 8.031005859375,8.43798828125 2.031005859375,8.43798828125 2.031005859375,14.43701171875z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M8.96798706054688,14.43701171875L14.9679870605469,14.43701171875 14.9679870605469,8.43798828125 8.96798706054688,8.43798828125 8.96798706054688,14.43701171875z" });
                                innerDivHeight = 16;
                                break;
                            case "BoxesThreeFilled":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M2.031005859375,7.5L8.031005859375,7.5 8.031005859375,1.5 2.031005859375,1.5 2.031005859375,7.5z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M8.96798706054688,7.5L14.9679870605469,7.5 14.9679870605469,1.5 8.96798706054688,1.5 8.96798706054688,7.5z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M2.031005859375,14.43701171875L8.031005859375,14.43701171875 8.031005859375,8.43798828125 2.031005859375,8.43798828125 2.031005859375,14.43701171875z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M8.96798706054688,14.43701171875L14.9679870605469,14.43701171875 14.9679870605469,8.43798828125 8.96798706054688,8.43798828125 8.96798706054688,14.43701171875z" });
                                innerDivHeight = 16;
                                break;
                            case "BoxesTwoFilled":
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M2.031005859375,7.5L8.031005859375,7.5 8.031005859375,1.5 2.031005859375,1.5 2.031005859375,7.5z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M8.96798706054688,7.5L14.9679870605469,7.5 14.9679870605469,1.5 8.96798706054688,1.5 8.96798706054688,7.5z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M2.031005859375,14.43701171875L8.031005859375,14.43701171875 8.031005859375,8.43798828125 2.031005859375,8.43798828125 2.031005859375,14.43701171875z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M8.96798706054688,14.43701171875L14.9679870605469,14.43701171875 14.9679870605469,8.43798828125 8.96798706054688,8.43798828125 8.96798706054688,14.43701171875z" });
                                innerDivHeight = 16;
                                break;
                            case "Circle":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M15.3310852050781,8.3330078125L14.7622108459473,11.150749206543 13.2108383178711,13.4517440795898 10.9098434448242,15.003116607666 8.09210205078125,15.5719909667969 5.27377843856812,15.003116607666 2.97248458862305,13.4517440795898 1.42100191116333,11.150749206543 0.85211181640625,8.3330078125 1.42100191116333,5.51524877548218 2.97248458862305,3.2142448425293 5.27377843856812,1.66286897659302 8.09210205078125,1.093994140625 10.9098434448242,1.66286897659302 13.2108383178711,3.2142448425293 14.7622108459473,5.51524877548218 15.3310852050781,8.3330078125" });
                                innerDivWidth = innerDivHeight = 17;
                                svgAttribute = svgAttribute + 'margin-left:0.5px;';
                                break;
                            case "Flag":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M1.53518676757813,1.97268676757813L1.71956861019135,1.87765264511108 2.22404956817627,1.65059661865234 3.90132141113281,1.14869689941406 5.98302745819092,1.16354370117188 6.99305105209351,1.58242082595825 7.88519287109375,2.39169311523438 9.55474090576172,4.09454298019409 11.1795692443848,5.14020156860352 12.5349636077881,5.63535928726196 13.3962097167969,5.68670654296875 13.5080919265747,5.78957939147949 13.3250951766968,6.16205215454102 12.1980743408203,7.28895568847656 10.2623682022095,8.2137336730957 9.06851482391357,8.33354949951172 7.76519775390625,8.08270263671875 5.64992141723633,7.59151554107666 4.50045776367188,7.73744964599609 4.02486801147461,8.11925792694092 3.93121337890625,8.335693359375 1.53518676757813,1.97268676757813z" });
                                innerDivWidth = 16;
                                innerDivHeight = 15;
                                break;
                            case "QuartersAllFilled":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M15.3310852050781,8.3330078125L14.7622108459473,11.150749206543 13.2108383178711,13.4517440795898 10.9098434448242,15.003116607666 8.09210205078125,15.5719909667969 5.27377843856812,15.003116607666 2.97248458862305,13.4517440795898 1.42100191116333,11.150749206543 0.85211181640625,8.3330078125 1.42100191116333,5.51524877548218 2.97248458862305,3.2142448425293 5.27377843856812,1.66286897659302 8.09210205078125,1.093994140625 10.9098434448242,1.66286897659302 13.2108383178711,3.2142448425293 14.7622108459473,5.51524877548218 15.3310852050781,8.3330078125" });
                                svgAttribute = svgAttribute + 'margin-left:0.5px;';
                                break;
                            case "QuartersNoneFilled":
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M15.3310852050781,8.3330078125L14.7622108459473,11.150749206543 13.2108383178711,13.4517440795898 10.9098434448242,15.003116607666 8.09210205078125,15.5719909667969 5.27377843856812,15.003116607666 2.97248458862305,13.4517440795898 1.42100191116333,11.150749206543 0.85211181640625,8.3330078125 1.42100191116333,5.51524877548218 2.97248458862305,3.2142448425293 5.27377843856812,1.66286897659302 8.09210205078125,1.093994140625 10.9098434448242,1.66286897659302 13.2108383178711,3.2142448425293 14.7622108459473,5.51524877548218 15.3310852050781,8.3330078125" });
                                svgAttribute = svgAttribute + 'margin-left:0.5px;';
                                break;
                            case "QuartersOneFilled":
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M1.2958984375,8.71868896484375L1.864914894104,11.5364475250244 3.41652679443359,13.8374519348145 5.71757793426514,15.3888282775879 8.534912109375,15.9577026367188 11.353235244751,15.3888282775879 13.6545295715332,13.8374519348145 15.2060127258301,11.5364475250244 15.77490234375,8.71868896484375 15.2060127258301,5.90094757080078 13.6545295715332,3.59995269775391 11.353235244751,2.04858016967773 8.534912109375,1.47970581054688 5.71757793426514,2.04858016967773 3.41652679443359,3.59995269775391 1.864914894104,5.90094757080078 1.2958984375,8.71868896484375" });
                                createElement(groupElement, "path", { fill: fillColor, d: "M8.57321166992188,1.86428833007813L11.3244533538818,2.38370847702026 13.4967041015625,3.80480575561523 14.9227085113525,5.96914529800415 15.4352111816406,8.71829223632813 15.5302124023438,8.7222900390625 8.57321166992188,8.7222900390625 8.57321166992188,1.86428833007813z" });
                                svgAttribute = svgAttribute + 'margin-top:0.5px;';
                                break;
                            case "QuartersThreeFilled":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M16.033203125,9.3330078125L15.4643287658691,12.150749206543 13.9129524230957,14.4517440795898 11.6119480133057,16.003116607666 8.794189453125,16.5719909667969 5.97586584091187,16.003116607666 3.6745719909668,14.4517440795898 2.12308931350708,12.150749206543 1.55419921875,9.3330078125 2.12308931350708,6.51524877548218 3.6745719909668,4.2142448425293 5.97586584091187,2.66286897659302 8.794189453125,2.093994140625 11.6119480133057,2.66286897659302 13.9129524230957,4.2142448425293 15.4643287658691,6.51524877548218 16.033203125,9.3330078125" });
                                createElement(groupElement, "path", { fill: "white", d: "M8.75729370117188,2.4794921875L6.00546979904175,2.99834585189819 3.83292007446289,4.41925430297852 2.40680551528931,6.58378267288208 1.894287109375,9.33349609375 1.79928588867188,9.33648681640625 8.75729370117188,9.33648681640625 8.75729370117188,2.4794921875z" });
                                svgAttribute = svgAttribute + 'margin-top:0.5px;';
                                break;
                            case "QuartersTwoFilled":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M15.1328125,8.3330078125L14.563796043396,11.150749206543 13.0121841430664,13.4517440795898 10.7111330032349,15.003116607666 7.893798828125,15.5719909667969 5.07547521591187,15.003116607666 2.7741813659668,13.4517440795898 1.22269868850708,11.150749206543 0.65380859375,8.3330078125 1.22269868850708,5.51524877548218 2.7741813659668,3.2142448425293 5.07547521591187,1.66286897659302 7.893798828125,1.093994140625 10.7111330032349,1.66286897659302 13.0121841430664,3.2142448425293 14.563796043396,5.51524877548218 15.1328125,8.3330078125" });
                                createElement(groupElement, "path", { fill: "white", d: "M7.81930541992188,1.45999145507813L5.0907883644104,1.99271726608276 2.95392227172852,3.42375564575195 1.56049299240112,5.59241724014282 1.06228637695313,8.3380126953125 1.57205629348755,11.0836029052734 2.99092483520508,13.252254486084 5.1532301902771,14.6832828521729 7.893310546875,15.2160034179688 7.81930541992188,1.45999145507813z" });
                                svgAttribute = svgAttribute + 'margin-top:0.5px;margin-left:0.5px;';
                                break;
                            case "SignalMeterFourFilled":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M3.44400024414063,17.3070068359375L1.53201293945313,17.3070068359375 1.53201293945313,11.5700073242188 3.44400024414063,11.5700073242188 3.44400024414063,17.3070068359375z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M7.14999389648438,17.3070068359375L5.23699951171875,17.3070068359375 5.23699951171875,9.65701293945313 7.14999389648438,9.65701293945313 7.14999389648438,17.3070068359375z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M10.8550109863281,17.3070068359375L8.9429931640625,17.3070068359375 8.9429931640625,5.83200073242188 10.8550109863281,5.83200073242188 10.8550109863281,17.3070068359375z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M14.56201171875,17.3070068359375L12.6489868164063,17.3070068359375 12.6489868164063,2.00698852539063 14.56201171875,2.00698852539063 14.56201171875,17.3070068359375z" });
                                innerDivHeight = 19;
                                svgAttribute = svgAttribute + 'margin-top:-10px;;margin-left:0.5px;';
                                break;
                            case "SignalMeterNoneFilled":
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M3.44400024414063,17.3070068359375L1.53201293945313,17.3070068359375 1.53201293945313,11.5700073242188 3.44400024414063,11.5700073242188 3.44400024414063,17.3070068359375z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M7.14999389648438,17.3070068359375L5.23699951171875,17.3070068359375 5.23699951171875,9.65701293945313 7.14999389648438,9.65701293945313 7.14999389648438,17.3070068359375z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M10.8550109863281,17.3070068359375L8.9429931640625,17.3070068359375 8.9429931640625,5.83200073242188 10.8550109863281,5.83200073242188 10.8550109863281,17.3070068359375z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M14.56201171875,17.3070068359375L12.6489868164063,17.3070068359375 12.6489868164063,2.00698852539063 14.56201171875,2.00698852539063 14.56201171875,17.3070068359375z" });
                                innerDivHeight = 19;
                                svgAttribute = svgAttribute + 'margin-top:-10px;;margin-left:0.5px;';
                                break;
                            case "SignalMeterThreeFilled":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M3.44400024414063,17.3070068359375L1.53201293945313,17.3070068359375 1.53201293945313,11.5700073242188 3.44400024414063,11.5700073242188 3.44400024414063,17.3070068359375z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M7.14999389648438,17.3070068359375L5.23699951171875,17.3070068359375 5.23699951171875,9.65701293945313 7.14999389648438,9.65701293945313 7.14999389648438,17.3070068359375z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M10.8550109863281,17.3070068359375L8.9429931640625,17.3070068359375 8.9429931640625,5.83200073242188 10.8550109863281,5.83200073242188 10.8550109863281,17.3070068359375z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M14.56201171875,17.3070068359375L12.6489868164063,17.3070068359375 12.6489868164063,2.00698852539063 14.56201171875,2.00698852539063 14.56201171875,17.3070068359375z" });
                                innerDivHeight = 19;
                                svgAttribute = svgAttribute + 'margin-top:-10px;;margin-left:0.5px;';
                                break;
                            case "SignalMeterOneFilled":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M3.44400024414063,17.3070068359375L1.53201293945313,17.3070068359375 1.53201293945313,11.5700073242188 3.44400024414063,11.5700073242188 3.44400024414063,17.3070068359375z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M7.14999389648438,17.3070068359375L5.23699951171875,17.3070068359375 5.23699951171875,9.65701293945313 7.14999389648438,9.65701293945313 7.14999389648438,17.3070068359375z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M10.8550109863281,17.3070068359375L8.9429931640625,17.3070068359375 8.9429931640625,5.83200073242188 10.8550109863281,5.83200073242188 10.8550109863281,17.3070068359375z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M14.56201171875,17.3070068359375L12.6489868164063,17.3070068359375 12.6489868164063,2.00698852539063 14.56201171875,2.00698852539063 14.56201171875,17.3070068359375z" });
                                innerDivHeight = 19;
                                svgAttribute = svgAttribute + 'margin-top:-10px;;margin-left:0.5px;';
                                break;
                            case "SignalMeterTwoFilled":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M3.44400024414063,17.3070068359375L1.53201293945313,17.3070068359375 1.53201293945313,11.5700073242188 3.44400024414063,11.5700073242188 3.44400024414063,17.3070068359375z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M7.14999389648438,17.3070068359375L5.23699951171875,17.3070068359375 5.23699951171875,9.65701293945313 7.14999389648438,9.65701293945313 7.14999389648438,17.3070068359375z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M10.8550109863281,17.3070068359375L8.9429931640625,17.3070068359375 8.9429931640625,5.83200073242188 10.8550109863281,5.83200073242188 10.8550109863281,17.3070068359375z" });
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M14.56201171875,17.3070068359375L12.6489868164063,17.3070068359375 12.6489868164063,2.00698852539063 14.56201171875,2.00698852539063 14.56201171875,17.3070068359375z" });
                                innerDivHeight = 19;
                                svgAttribute = svgAttribute + 'margin-top:-10px;;margin-left:0.5px;';
                                break;
                            case "StarQuartersAllFilled":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M6.41500854492188,6.37100219726563L1.56698608398438,7.07400512695313 5.07501220703125,10.4939880371094 4.24700927734375,15.3210144042969 8.58200073242188,13.0409851074219 12.9169921875,15.3210144042969 12.0899963378906,10.4939880371094 15.5979919433594,7.07400512695313 10.75,6.37100219726563 8.58200073242188,1.97698974609375 6.41500854492188,6.37100219726563z" });
                                break;
                            case "StarQuartersNoneFilled":
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M6.41500854492188,6.37100219726563L1.56698608398438,7.07400512695313 5.07501220703125,10.4939880371094 4.24700927734375,15.3210144042969 8.58200073242188,13.0409851074219 12.9169921875,15.3210144042969 12.0899963378906,10.4939880371094 15.5979919433594,7.07400512695313 10.75,6.37100219726563 8.58200073242188,1.97698974609375 6.41500854492188,6.37100219726563z" });
                                break;
                            case "StarQuartersOneFilled":
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M8.64109802246094,1.97750854492188L10.80810546875,6.37149047851563 15.6560974121094,7.07449340820313 12.1490936279297,10.4945068359375 12.9761047363281,15.3204956054688 8.64109802246094,13.0404968261719 4.30610656738281,15.3204956054688 5.13409423828125,10.4945068359375 1.6260986328125,7.07449340820313 6.47309875488281,6.37149047851563 8.64109802246094,1.97750854492188z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "none", d: "M6.22300720214844,6.37100219726563L1.50100708007813,7.07400512695313 5.07099914550781,10.4939880371094 4.06300354003906,15.531005859375 7.08399963378906,13.864013671875 7.072998046875,4.968994140625 6.22300720214844,6.37100219726563z" });
                                break;
                            case "StarQuartersThreeFilled":
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M8.60209655761719,1.97750854492188L10.7691040039063,6.37149047851563 15.6170959472656,7.07449340820313 12.110107421875,10.4945068359375 12.9371032714844,15.3204956054688 8.60209655761719,13.0404968261719 4.26710510253906,15.3204956054688 5.0950927734375,10.4945068359375 1.58709716796875,7.07449340820313 6.43409729003906,6.37149047851563 8.60209655761719,1.97750854492188z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "none", d: "M6.40199279785156,6.37100219726563L1.58700561523438,7.07400512695313 5.11000061035156,10.4939880371094 4.28999328613281,15.3210144042969 8.49000549316406,13.0989990234375 10.6970062255859,14.27099609375 10.6970062255859,6.2239990234375 8.60200500488281,1.97698974609375 6.40199279785156,6.37100219726563z" });
                                break;
                            case "StarQuartersTwoFilled":
                                createElement(groupElement, "path", { fill: "none", stroke: "lightgray", d: "M8.17819213867188,1.97750854492188L10.34521484375,6.37149047851563 15.1932067871094,7.07449340820313 11.6861877441406,10.4945068359375 12.5132141113281,15.3204956054688 8.17819213867188,13.0404968261719 3.84320068359375,15.3204956054688 4.67120361328125,10.4945068359375 1.1632080078125,7.07449340820313 6.01019287109375,6.37149047851563 8.17819213867188,1.97750854492188z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "none", d: "M6.010009765625,6.37100219726563L1.16299438476563,7.07400512695313 4.67098999023438,10.4939880371094 3.84298706054688,15.3210144042969 7.83499145507813,13.2219848632813 7.90399169921875,2.53201293945313 6.010009765625,6.37100219726563z" });
                                break;
                            case "ThreeSignsCircle":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M15.3310852050781,8.3330078125L14.7622108459473,11.150749206543 13.2108383178711,13.4517440795898 10.9098434448242,15.003116607666 8.09210205078125,15.5719909667969 5.27377843856812,15.003116607666 2.97248458862305,13.4517440795898 1.42100191116333,11.150749206543 0.85211181640625,8.3330078125 1.42100191116333,5.51524877548218 2.97248458862305,3.2142448425293 5.27377843856812,1.66286897659302 8.09210205078125,1.093994140625 10.9098434448242,1.66286897659302 13.2108383178711,3.2142448425293 14.7622108459473,5.51524877548218 15.3310852050781,8.3330078125" });
                                svgAttribute = svgAttribute + 'margin-top:1px;margin-left:0.5px;';
                                break;
                            case "ThreeSignsDiamond":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M1.08401489257813,8.01901245117188L8.10400390625,15.1589965820313 15.2929992675781,8.01901245117188 8.10400390625,0.878997802734375 1.08401489257813,8.01901245117188z" });
                                innerDivWidth = 16;
                                svgAttribute = svgAttribute + 'margin-top:3px;margin-left:1px;';
                                break;
                            case "ThreeSignsTriangle":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M0.83099365234375,14.2340087890625L15.7950134277344,14.2340087890625 8.31298828125,1.27499389648438 0.83099365234375,14.2340087890625z" });
                                svgAttribute = svgAttribute + 'margin-top:1px;';
                                break;
                            case "ThreeSymbolCheck":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M15.3310852050781,8.3330078125L14.7622108459473,11.150749206543 13.2108383178711,13.4517440795898 10.9098434448242,15.003116607666 8.09210205078125,15.5719909667969 5.27377843856812,15.003116607666 2.97248458862305,13.4517440795898 1.42100191116333,11.150749206543 0.85211181640625,8.3330078125 1.42100191116333,5.51524877548218 2.97248458862305,3.2142448425293 5.27377843856812,1.66286897659302 8.09210205078125,1.093994140625 10.9098434448242,1.66286897659302 13.2108383178711,3.2142448425293 14.7622108459473,5.51524877548218 15.3310852050781,8.3330078125" });
                                createElement(groupElement, "path", { fill: "white", stroke: "lightgray", d: "M12.15869140625,4.38958740234375L11.3836975097656,3.86260986328125 10.7337036132813,3.98660278320313 6.94171142578125,9.57958984375 5.19769287109375,7.83660888671875 4.53570556640625,7.83660888671875 3.87469482421875,8.49859619140625 3.87469482421875,9.16061401367188 6.5546875,11.8416137695313 7.1536865234375,12.1086120605469 7.71771240234375,11.7735900878906 12.28369140625,5.03860473632813 12.15869140625,4.38958740234375" });
                                svgAttribute = svgAttribute + 'margin-top:1px;margin-left:0.5px;';
                                break;
                            case "ThreeSymbolCross":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M1.10299682617188,7.94601440429688L1.66799592971802,10.7435569763184 3.20874404907227,13.0283813476563 5.49386739730835,14.569019317627 8.2919921875,15.1340026855469 8.2919921875,15.1340026855469 11.0901165008545,14.569019317627 13.3752403259277,13.0283813476563 14.9159889221191,10.7435569763184 15.4809875488281,7.94601440429688 15.4809875488281,7.94601440429688 14.9159889221191,5.14773225784302 13.3752403259277,2.86226272583008 11.0901165008545,1.32116842269897 8.2919921875,0.756011962890625 8.2919921875,0.756011962890625 5.49386739730835,1.32116842269897 3.20874404907227,2.86226272583008 1.66799592971802,5.14773225784302 1.10299682617188,7.94601440429688" });
                                createElement(groupElement, "path", { fill: "white", stroke: "lightgray", d: "M10.0479125976563,7.94430541992188L11.9789123535156,6.0133056640625 11.9789123535156,5.31130981445313 10.9259033203125,4.25729370117188 10.222900390625,4.25729370117188 8.2908935546875,6.18930053710938 6.35989379882813,4.25729370117188 5.65689086914063,4.25729370117188 4.60488891601563,5.31130981445313 4.60488891601563,6.0133056640625 6.534912109375,7.94430541992188 4.60488891601563,9.87728881835938 4.60488891601563,10.5783081054688 5.65689086914063,11.6322937011719 6.35989379882813,11.6322937011719 8.2908935546875,9.70028686523438 10.2239074707031,11.6322937011719 10.9259033203125,11.6322937011719 11.9789123535156,10.5783081054688 11.9789123535156,9.87728881835938 10.0479125976563,7.94430541992188z" });
                                svgAttribute = svgAttribute + 'margin-top:3px;margin-left:1px;';
                                break;
                            case "ThreeSymbolExclamation":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M0.983001708984375,7.94601440429688L1.54785919189453,10.7435569763184 3.08837127685547,13.0283813476563 5.37344741821289,14.569019317627 8.1719970703125,15.1340026855469 8.1719970703125,15.1340026855469 10.9699649810791,14.569019317627 13.2547416687012,13.0283813476563 14.7951431274414,10.7435569763184 15.3599853515625,7.94601440429688 15.3599853515625,7.94601440429688 14.7951431274414,5.14773225784302 13.2547416687012,2.86226272583008 10.9699649810791,1.32116842269897 8.1719970703125,0.756011962890625 8.1719970703125,0.756011962890625 5.37344741821289,1.32116842269897 3.08837127685547,2.86226272583008 1.54785919189453,5.14773225784302 0.983001708984375,7.94601440429688" });
                                createElement(groupElement, "path", { fill: "white", stroke: "lightgray", d: "M7.59280395507813,9.60159301757813L8.71978759765625,9.60159301757813 9.00180053710938,9.60159301757813 9.12579345703125,2.8916015625 7.143798828125,2.8916015625 7.31280517578125,9.60159301757813 7.59280395507813,9.60159301757813z" });
                                createElement(groupElement, "path", { fill: "white", stroke: "lightgray", d: "M8.96728515625,10.69140625L8.17428588867188,10.3753967285156 7.37130737304688,10.6924133300781 7.03228759765625,11.4764099121094 7.37530517578125,12.244384765625 8.17428588867188,12.54541015625 8.96328735351563,12.244384765625 9.310302734375,11.4764099121094 8.96728515625,10.69140625" });
                                svgAttribute = svgAttribute + 'margin-top:3px;margin-left:1px;';
                                break;
                            case "ThreeSymbolUnCircledCheck":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M13.8515930175781,2.2255859375L12.6495971679688,1.402587890625 12.1062202453613,1.29134368896484 11.6416015625,1.59561157226563 5.755615234375,10.32958984375 3.04959106445313,7.60760498046875 2.53897094726563,7.39609527587891 2.02459716796875,7.60760498046875 0.997589111328125,8.64260864257813 0.785346984863281,9.15935516357422 0.997589111328125,9.6776123046875 5.1575927734375,13.8635864257813 6.0845947265625,14.2785949707031 6.96060180664063,13.755615234375 14.0445861816406,3.2406005859375 14.1565895080566,2.69297027587891 13.8515930175781,2.2255859375" });
                                innerDivWidth = innerDivHeight = 16;
                                svgAttribute = svgAttribute + 'margin-top:3px;margin-left:.5px;';
                                break;
                            case "ThreeSymbolUnCircledCross":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M9.36907958984375,6.86331176757813L12.423095703125,3.71530151367188 12.6540832519531,3.14280700683594 12.423095703125,2.5703125 10.7581176757813,0.851287841796875 10.2026062011719,0.613548278808594 9.6470947265625,0.851287841796875 6.59613037109375,4.00131225585938 3.5421142578125,0.851287841796875 2.98759841918945,0.613548278808594 2.43310546875,0.851287841796875 0.768096923828125,2.5703125 0.537109375,3.14205169677734 0.768096923828125,3.71530151367188 3.82012939453125,6.86331176757813 0.768096923828125,10.0133056640625 0.537109375,10.5845413208008 0.768096923828125,11.1572875976563 2.43310546875,12.8763122558594 2.98723220825195,13.1140518188477 3.5421142578125,12.8763122558594 6.59613037109375,9.72628784179688 9.6480712890625,12.8763122558594 10.2027282714844,13.1140518188477 10.7581176757813,12.8763122558594 12.423095703125,11.1572875976563 12.6540832519531,10.5845413208008 12.423095703125,10.0133056640625 9.36907958984375,6.86331176757813z" });
                                innerDivWidth = innerDivHeight = 16;
                                svgAttribute = svgAttribute + 'margin-top:5px;margin-left:1.5px;';
                                break;
                            case "ThreeSymbolUnCircledExclamation":
                                createElement(groupElement, "path", { fill: "none", stroke: "none", d: "M0.983001708984375,7.94601440429688L1.54785919189453,10.7435569763184 3.08837127685547,13.0283813476563 5.37344741821289,14.569019317627 8.1719970703125,15.1340026855469 8.1719970703125,15.1340026855469 10.9699649810791,14.569019317627 13.2547416687012,13.0283813476563 14.7951431274414,10.7435569763184 15.3599853515625,7.94601440429688 15.3599853515625,7.94601440429688 14.7951431274414,5.14773225784302 13.2547416687012,2.86226272583008 10.9699649810791,1.32116842269897 8.1719970703125,0.756011962890625 8.1719970703125,0.756011962890625 5.37344741821289,1.32116842269897 3.08837127685547,2.86226272583008 1.54785919189453,5.14773225784302 0.983001708984375,7.94601440429688" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "none", d: "M7.59280395507813,9.60159301757813L8.71978759765625,9.60159301757813 9.00180053710938,9.60159301757813 9.12579345703125,2.8916015625 7.143798828125,2.8916015625 7.31280517578125,9.60159301757813 7.59280395507813,9.60159301757813z" });
                                createElement(groupElement, "path", { fill: fillColor, stroke: "none", d: "M8.96728515625,10.69140625L8.17428588867188,10.3753967285156 7.37130737304688,10.6924133300781 7.03228759765625,11.4764099121094 7.37530517578125,12.244384765625 8.17428588867188,12.54541015625 8.96328735351563,12.244384765625 9.310302734375,11.4764099121094 8.96728515625,10.69140625" });
                                svgAttribute = svgAttribute + 'margin-top:1px;margin-left:1px;';
                                break;
                            case "TrafficLight":
                                createElement(groupElement, "path", { fill: "black", stroke: "lightgray", d: "M3.83200073242188,1.46800231933594L2.76542282104492,1.68336224555969 1.89412689208984,2.27062797546387 1.3065185546875,3.14157843589783 1.09100341796875,4.20799255371094 1.09100341796875,4.20799255371094 1.09100341796875,13.3419952392578 1.3065185546875,14.4091548919678 1.89412689208984,15.2807502746582 2.76542282104492,15.8684692382813 3.83200073242188,16.0839996337891 3.83200073242188,16.0839996337891 12.9670104980469,16.0839996337891 14.0340003967285,15.8684692382813 14.9052505493164,15.2807502746582 15.4926300048828,14.4091548919678 15.7080078125,13.3419952392578 15.7080078125,13.3419952392578 15.7080078125,4.20799255371094 15.4926300048828,3.14157843589783 14.9052505493164,2.27062797546387 14.0340003967285,1.68336224555969 12.9670104980469,1.46800231933594 12.9670104980469,1.46800231933594 3.83200073242188,1.46800231933594z" });
                                createElement(groupElement, "path", { fill: fillColor, d: "M3.78421020507813,8.77540588378906L4.14698934555054,6.97894716262817 5.13620376586914,5.51202392578125 6.60316896438599,4.52304029464722 8.39920043945313,4.160400390625 10.1958141326904,4.52304029464722 11.6630783081055,5.51202392578125 12.6524028778076,6.97894716262817 13.0151977539063,8.77540588378906 12.6524028778076,10.5718555450439 11.6630783081055,12.0387744903564 10.1958141326904,13.027756690979 8.39920043945313,13.3903961181641 6.60316896438599,13.027756690979 5.13620376586914,12.0387744903564 4.14698934555054,10.5718555450439 3.78421020507813,8.77540588378906" });
                                innerDivWidth = innerDivHeight = 18;
                                svgAttribute = svgAttribute + 'margin-top:3px;margin-left:.5px;';
                                break;
                            case "TrafficLightUnrimmed":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M15.3310852050781,8.3330078125L14.7622108459473,11.150749206543 13.2108383178711,13.4517440795898 10.9098434448242,15.003116607666 8.09210205078125,15.5719909667969 5.27377843856812,15.003116607666 2.97248458862305,13.4517440795898 1.42100191116333,11.150749206543 0.85211181640625,8.3330078125 1.42100191116333,5.51524877548218 2.97248458862305,3.2142448425293 5.27377843856812,1.66286897659302 8.09210205078125,1.093994140625 10.9098434448242,1.66286897659302 13.2108383178711,3.2142448425293 14.7622108459473,5.51524877548218 15.3310852050781,8.3330078125" });
                                svgAttribute = svgAttribute + 'margin-top:3px;margin-left:.5px;';
                                break;
                            case "TriangleDash":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M13.9800109863281,7.56300354003906L0.501007080078125,7.56300354003906 0.501007080078125,4.67400360107422 13.9800109863281,4.67400360107422 13.9800109863281,7.56300354003906z" });
                                innerDivWidth = 15;
                                innerDivHeight = 9;
                                break;
                            case "TriangleDown":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M14.06201171875,0.788002014160156L7.60501098632813,7.15699768066406 1.14801025390625,0.788002014160156 14.06201171875,0.788002014160156z" });
                                innerDivWidth = 15;
                                innerDivHeight = 9;
                                svgAttribute = svgAttribute + 'margin-top:3px;margin-left:.5px;';
                                break;
                            case "TriangleUp":
                                createElement(groupElement, "path", { fill: fillColor, stroke: "lightgray", d: "M0.89599609375,7.30400085449219L7.35198974609375,0.93499755859375 13.8089904785156,7.30400085449219 0.89599609375,7.30400085449219z" });
                                innerDivWidth = 15;
                                innerDivHeight = 9;
                                svgAttribute = svgAttribute + 'margin-top:3px;margin-left:.5px;';
                                break;
                        }
                        indicatorinnerDiv.css({ 'width': innerDivWidth + 'px', 'height': innerDivHeight + 'px' });
                        svgelement.setAttributeNS(null, 'style', svgAttribute);
                        svgelement.appendChild(groupElement);
                        break;
                    }
                }
                indicatorinnerDiv.append(svgelement);
                indicatorDiv.append(indicatorinnerDiv);
                gaugeDiv.append(indicatorDiv);

                var innerScaleWidth = indicatorinnerDiv.width();
                var innerScaleHeight = indicatorinnerDiv.height();
                var indidenomintaorLen = innerScaleWidth < innerScaleHeight ? innerScaleWidth : innerScaleHeight;
                scaleXy = scaleXy / indidenomintaorLen;

                if (this._browserInfo.name == 'msie') {
                    indicatorinnerDiv.css('transform', 'scale(' + scaleXy + ',' + scaleXy + ')');
                } else if (this._browserInfo.name == 'opera') {
                    indicatorinnerDiv.css('-o-transform', 'scale(' + scaleXy + ',' + scaleXy + ')');
                } else if (this._browserInfo.name == 'mozilla') {
                    indicatorinnerDiv.css('-ms-transform', 'scale(' + scaleXy + ',' + scaleXy + ')');
                } else if (this._browserInfo.name == 'webkit' || this._browserInfo.name == 'chrome') {
                    indicatorinnerDiv.css('-webkit-transform', 'scale(' + scaleXy + ',' + scaleXy + ')');
                }

                if (innerScaleWidth < innerScaleHeight) {
                    indicatorinnerDiv.css({ 'left': '50%', 'margin-left': -(innerScaleWidth / 2), 'top': '50%', 'margin-top': -(innerScaleWidth / 2) });
                } else {
                    indicatorinnerDiv.css({ 'left': '50%', 'margin-left': -(innerScaleHeight / 2), 'top': '50%', 'margin-top': -(innerScaleHeight / 2) });
                }
            }

            function createElement(root, name, attrs) {
                var element = document.createElementNS(svgNs, name);
                for (var attr in attrs) {
                    if (attrs.hasOwnProperty(attr)) {
                        element.setAttribute(attr, attrs[attr]);
                    }
                }
                root.appendChild(element);
            }
        },

        _renderGaugeLabels: function (gaugeLabels, gaugeDiv, gaugeName, parentId, printMode, printPageId) {
            var guageIndex;
            for (guageIndex = 0; guageIndex < gaugeLabels.length; guageIndex++) {
                var labelModel = gaugeLabels[guageIndex];
                var labelGaugeDiv = ej.buildTag("div", "", {}, { 'id': this._controlKeyGenerator(this._id + '_' + gaugeName + '_' + labelModel.Name, parentId, printMode, printPageId), title: labelModel.ToolTip });
                labelGaugeDiv.css({ "position": "absolute", "top": labelModel.Top, "left": labelModel.Left, "width": labelModel.length + 10, "height": labelModel.Height + 10, "background-color": labelModel.BackgroundColor, "border-color": labelModel.Style.BorderColor, "border-style": labelModel.Style.BorderStyle, "border-width": labelModel.Style.BorderWidth });
                var span = document.createElement("span");
                span.innerHTML = labelModel.Text;
                span.style.fontFamily = labelModel.Font.FontFamily;
                span.style.fontSize = labelModel.Font.FontSize;
                span.style.fontStyle = labelModel.Font.FontStyle;
                span.style.fontWeight = labelModel.Font.FontWeight;
                span.style.textAlign = labelModel.TextAlign;
                span.style.color = labelModel.TextColor;
                span.style.textDecoration = labelModel.TextDecoration;
                labelGaugeDiv.append(span);
                gaugeDiv.append(labelGaugeDiv);
            }
        },

        _renderRadialGauge: function (radialGauges, gaugeDiv, gaugeName, panelOrientation, containerWidth, containerHeight, parentId, printMode, printPageId) {
            for (var guageIndex = 0; guageIndex < radialGauges.length; guageIndex++) {
                var radialGauge = radialGauges[guageIndex];
                var radialframe = radialGauge.GaugeFrame;
                var radialGaugeDiv = ej.buildTag("div", "", {}, { 'id': this._controlKeyGenerator(this._id + '_' + gaugeName + '_' + radialGauge.Name, parentId, printMode, printPageId), title: radialGauge.ToolTip });
                gaugeDiv.append(radialGaugeDiv);
                radialGaugeDiv.ejCircularGauge();
                var resourceName = printMode ? 'PrintImage' : 'GetResource';
                if (radialframe.FrameImage) {
                    radialGaugeDiv.css("background-image", "url(" + this.model.reportServiceUrl + '/' + resourceName + '/?key=' + radialframe.FrameImage + '&resourcetype=sfimg&isPrint=' + printMode + ")");
                }
                var circular = radialGaugeDiv.data("ejCircularGauge");
                var radialscaleobj = circular.model.scales[0];
                circular.model.scales.pop(circular.model.scales[0]);

                var radialheight = (containerWidth < containerHeight) ? (containerWidth / 2) - radialframe.FrameWidth : (containerHeight / 2) - radialframe.FrameWidth;
                circular.model.radius = radialheight;
                circular.model.width = containerWidth;
                circular.model.height = containerHeight;
                circular.model.backgroundColor = radialGauge.BackgroundColor;
                circular.model.enableAnimation = false;

                if (radialGauge.ScaleProperties && radialGauge.ScaleProperties.length > 0) {
                    var radialscaleLen = radialGauge.ScaleProperties.length;
                    for (var radialscaleIndex = 0; radialscaleIndex < radialscaleLen; radialscaleIndex++) {
                        var radialScale = radialGauge.ScaleProperties[radialscaleIndex];
                        var radialscale = $.extend(true, {}, radialscaleobj);
                        radialscale.radius = (radialheight * ((radialscaleLen - radialscaleIndex) / radialscaleLen)) - radialframe.FrameWidth;
                        radialscale.startAngle = radialScale.StartAngle + 90;
                        radialscale.sweepAngle = radialScale.SweepAngle;
                        radialscale.showRanges = true;
                        radialscale.showScaleBar = true;
                        radialscale.maximum = radialScale.Maximum;
                        radialscale.minimum = radialScale.Minimum;
                        radialscale.border.color = radialScale.BorderColor;
                        radialscale.border.width = radialScale.BorderWidth;
                        radialscale.showPointers = true;
                        radialscale.showTicks = true;
                        radialscale.showLabels = true;
                        radialscale.showIndicators = true;
                        radialscale.backgroundColor = radialScale.BackgroundColor;
                        radialscale.shadowOffset = radialScale.ShadowOffset;

                        if (radialScale.RadialPointer && radialScale.RadialPointer.length > 0) {
                            var radialpointerobj = radialscale.pointers[0];
                            radialscale.pointers.pop(radialscale.pointers[0]);
                            var radialpointerLen = radialScale.RadialPointer.length;
                            for (var radialpointerIndex = 0; radialpointerIndex < radialpointerLen; radialpointerIndex++) {
                                var radialpointer = $.extend(true, {}, radialpointerobj);
                                var scalePointer = radialScale.RadialPointer[radialpointerIndex];
                                radialpointer.value = scalePointer.Value;
                                radialpointer.length = radialheight * ((radialscaleLen - radialscaleIndex) / radialscaleLen) - 30;
                                radialpointer.backgroundColor = scalePointer.BackgroundColor;
                                radialpointer.type = scalePointer.Type == "Needle" ? "needle" : "marker";
                                radialpointer.showBackNeedle = false;
                                radialpointer.width = scalePointer.Width;
                                radialpointer.border.width = scalePointer.BorderWidth;
                                radialpointer.border.color = scalePointer.BorderColor;

                                switch (scalePointer.NeedleStyle) {
                                    case "Rectangular":
                                        radialpointer.needleType = "rectangle";
                                        break;
                                    case "Arrow":
                                        radialpointer.needleType = "arrow";
                                        break;
                                    default:
                                        radialpointer.needleType = "triangle";
                                        break;
                                }

                                if (scalePointer.MarkerStyle == "wedge" || scalePointer.MarkerStyle == "triangle" || scalePointer.MarkerStyle == "circle" || scalePointer.MarkerStyle == "diamond" || scalePointer.MarkerStyle == "pentagon" || scalePointer.MarkerStyle == "trapezoid") {
                                    radialpointer.markerType = scalePointer.MarkerStyle.toLowerCase();
                                } else {
                                    radialpointer.markerType = "rectangle";
                                }

                                radialpointer.distanceFromScale = scalePointer.distanceFromScale;
                                radialscale.pointerCap.backgroundColor = scalePointer.CapBackGroundColor;
                                radialscale.pointerCap.radius = scalePointer.CapRadius / 3;
                                radialscale.pointers.push(radialpointer);
                            }
                        } else {
                            radialscale.pointers = [];
                        }

                        if (radialScale.Range && radialScale.Range.length > 0) {
                            var radialrangeobj = radialscale.ranges[0];
                            radialscale.ranges.pop(radialscale.ranges[0]);
                            var raddialrangeLen = radialScale.Range.length;
                            for (var raddialrangeIndex = 0; raddialrangeIndex < raddialrangeLen; raddialrangeIndex++) {
                                var radialrange = $.extend(true, {}, radialrangeobj);
                                var radialscaleRange = radialScale.Range[raddialrangeIndex];
                                radialrange.distanceFromScale = radialscaleRange.DistanceFromScale;
                                radialrange.backgroundColor = radialscaleRange.BackgroundColor;
                                if (radialscaleRange.EndValue == 0 && radialscaleRange.StartValue == 0) {
                                    radialrange.startValue = 70;
                                    radialrange.endValue = 100;
                                } else {
                                    radialrange.startValue = radialscaleRange.StartValue;
                                    radialrange.endValue = radialscaleRange.EndValue;
                                }
                                radialrange.startWidth = radialscaleRange.StartWidth;
                                radialrange.endWidth = radialscaleRange.EndWidth;
                                radialrange.border.color = radialscaleRange.BorderColor;
                                radialrange.border.width = radialscaleRange.BorderWidth;
                                radialscale.ranges.push(radialrange);
                            }
                        } else {
                            radialscale.ranges = [];
                        }

                        var radialtick = radialScale.TickMark;
                        var radialmajortickobj = radialscale.ticks[0];
                        var radialminortickobj = radialscale.ticks[1];
                        radialscale.ticks.pop(radialscale.ticks[0]);
                        radialscale.ticks.pop(radialscale.ticks[1]);

                        if (!radialtick.MajorTickHide) {
                            radialmajortickobj.type = "major";
                            radialmajortickobj.width = radialtick.MajorTickWidth + 1;
                            radialmajortickobj.distanceFromScale = radialtick.MajorTickDistanceFromScale;
                            radialmajortickobj.height = radialtick.MajorTickLength - 2;
                            radialmajortickobj.color = radialtick.MajorTickColor == null ? "black" : radialtick.MajorTickColor;
                            radialmajortickobj.placement = "near";
                            radialscale.ticks.push(radialmajortickobj);
                        }

                        if (!radialtick.MinorTickHide) {
                            radialminortickobj.type = "minor";
                            radialminortickobj.width = radialtick.MinorTickWidth;
                            radialminortickobj.distanceFromScale = radialtick.MinorTickDistanceFromScale;
                            radialminortickobj.height = radialtick.MinorTickLength - 1;
                            radialminortickobj.color = radialtick.MinorTickColor == null ? "black" : radialtick.MinorTickColor;
                            radialminortickobj.placement = "near";
                            radialscale.ticks.push(radialminortickobj);
                        }

                        var radiallabelValue = radialScale.Label;
                        var radialscalelabel = radialscale.labels[0];
                        radialscale.labels.pop(radialscale.labels[0]);
                        radialscalelabel.font.fontFamily = radiallabelValue.FontFamily;
                        radialscalelabel.font.size = radiallabelValue.FontSize;
                        radialscalelabel.font.fontStyle = radiallabelValue.FontStyle;
                        radialscalelabel.distanceFromScale = radiallabelValue.DistanceFromScale;
                        radialscalelabel.color = radiallabelValue.Color;
                        radialscale.labels.push(radialscalelabel);
                        radialscale.indicators = null;
                        circular.model.scales.push(radialscale);
                    }
                }
                circular.refresh();
                circular.contextEl.beginPath();
                circular.contextEl.arc((containerWidth / 2), (containerHeight / 2), radialheight, 0, 2 * Math.PI, false);
                circular.contextEl.fillStyle = "transparent";
                circular.contextEl.fill();
                circular.contextEl.lineWidth = radialframe.FrameWidth;
                circular.contextEl.strokeStyle = (radialframe.FrameColor != null) ? radialframe.FrameColor : "Transparent";
                circular.contextEl.stroke();
                circular.contextEl.closePath();

                if (printMode) {
                    radialGaugeDiv.append('<img src=' + circular.contextEl.canvas.toDataURL("image/png") + ' width=100% height=100%/>');
                    $(circular.contextEl.canvas).remove();
                }
                radialGaugeDiv.css({ 'width': containerWidth, 'height': containerHeight, 'float': panelOrientation == 'Horizontal' ? 'left' : 'top' });
            }
        },

        _renderLinearGauge: function (linearGauges, gaugeDiv, gaugeName, panelOrientation, containerWidth, containerHeight, parentId, printMode, printPageId) {
            for (var guageIndex = 0; guageIndex < linearGauges.length; guageIndex++) {
                var linearGauge = linearGauges[guageIndex];

                if (guageIndex % 2 != 0) {
                    var emptyDiv = ej.buildTag("div", "", { 'width': panelOrientation == 'Horizontal' ? '3px' : containerWidth - (frame.FrameWidth * 2), 'float': panelOrientation == 'Horizontal' ? 'left' : 'top', 'height': panelOrientation == 'Horizontal' ? containerHeight - (frame.FrameWidth * 2) : '3px' }, {});
                    gaugeDiv.append(emptyDiv);
                }

                var frame = linearGauge.GaugeFrame;
                var linearGaugeDiv = ej.buildTag("div", "", {}, { 'id': this._controlKeyGenerator(this._id + '_' + gaugeName + '_' + linearGauge.Name, parentId, printMode, printPageId), title: linearGauge.ToolTip });
                var resourceName = printMode ? 'PrintImage' : 'GetResource';
                if (frame.FrameImage) {
                    linearGaugeDiv.css("background-image", "url(" + this.model.reportServiceUrl + '/' + resourceName + '/?key=' + frame.FrameImage + '&resourcetype=sfimg&isPrint=' + printMode + ")");
                }

                gaugeDiv.append(linearGaugeDiv);
                linearGaugeDiv.ejLinearGauge();
                var linear = linearGaugeDiv.data("ejLinearGauge");

                var scaleobj = linear.model.scales[0];
                linear.model.scales.pop(linear.model.scales[0]);
                linear.model.width = containerWidth - (frame.FrameWidth * 2);
                linear.model.height = containerHeight - (frame.FrameWidth * 2);

                linear.model.enableAnimation = false;
                linear.model.backgroundColor = linearGauge.BackgroundColor;
                linear.model.orientation = linearGauge.Orientation;

                if (linearGauge.Orientation == "Horizontal") {
                    linear.model.orientation = linearGauge.Orientation;
                } else if (linearGauge.Orientation == "Vertical") {
                    linear.model.orientation = linearGauge.Orientation;
                } else {
                    if (containerWidth > containerHeight) {
                        linear.model.orientation = "Horizontal";
                    } else {
                        linear.model.orientation = "Vertical";
                    }
                }

                if (linearGauge.ScaleProperties && linearGauge.ScaleProperties.length > 0) {
                    var scaleLen = linearGauge.ScaleProperties.length;

                    for (var scaleIndex = 0; scaleIndex < scaleLen; scaleIndex++) {
                        var linearScale = linearGauge.ScaleProperties[scaleIndex];
                        var scale = $.extend(true, {}, scaleobj);
                        scale.maximum = linearScale.Maximum;
                        scale.minimum = linearScale.Minimum;
                        scale.length = linear.model.orientation == "Horizontal" ? (containerWidth / 100) * 85 : (containerHeight / 100) * 85;                         scale.border.color = linearScale.BorderColor;
                        scale.border.width = linearScale.BorderWidth;
                        scale.backgroundColor = linearScale.BackgroundColor;
                        scale.shadowOffset = linearScale.ShadowOffset;
                        scale.width = linear.model.orientation == "Vertical" ? (linear.model.width / 4) : (linear.model.height / 4);

                        if (linearScale.PointerType && linearScale.PointerType == "thermometer") {
                            scale.type = linearScale.PointerType;
                        }

                        if (linearScale.LinearPointer && linearScale.LinearPointer.length > 0) {


                            var pointerobj;
                            if (linearScale.PointerType != "thermometer") {
                                pointerobj = $.extend(true, {}, scale.markerPointers[0]);
                                scale.markerPointers.pop(scale.markerPointers[0]);
                            } else {
                                pointerobj = $.extend(true, {}, scale.barPointers[0])
                                scale.barPointers.pop(scale.barPointers[0]);
                            }
                            var pointerLen = linearScale.LinearPointer.length;
                            for (var pointerIndex = 0; pointerIndex < pointerLen; pointerIndex++) {
                                var pointer = $.extend(true, {}, pointerobj);
                                var scaleMarkerPointer = linearScale.LinearPointer[pointerIndex];
                                pointer.value = scaleMarkerPointer.MarkerValue;
                                pointer.length = scaleMarkerPointer.MarkerLength;
                                pointer.backgroundColor = scaleMarkerPointer.MarkerBackgroundColor;
                                pointer.width = scaleMarkerPointer.MarkerWidth;
                                pointer.border.width = scaleMarkerPointer.MarkerBorderWidth;
                                pointer.border.color = scaleMarkerPointer.MarkerBorderColor;
                                pointer.type = scaleMarkerPointer.MarkerStyle.toLowerCase();
                                pointer.distanceFromScale = scaleMarkerPointer.MarkerDistanceFromScale;
                                if (linearScale.PointerType != "thermometer") {
                                    scale.markerPointers.push(pointer);
                                } else {
                                    scale.showBarPointers = true;
                                    scale.barPointers.push(pointer);
                                    scale.markerPointers[pointerIndex].opacity = 0;
                                }
                            }
                        } else {
                            scale.markerPointers = [];
                            scale.barPointers = [];
                        }

                        if (linearScale.Range && linearScale.Range.length > 0) {
                            var rangeobj = $.extend(true, {}, scale.ranges[0]);
                            scale.ranges.pop(scale.ranges[0]);
                            var rangeLen = linearScale.Range.length;

                            for (var rangeIndex = 0; rangeIndex < rangeLen; rangeIndex++) {
                                var range = $.extend(true, {}, rangeobj);
                                var scaleRange = linearScale.Range[rangeIndex];

                                range.distanceFromScale = scaleRange.DistanceFromScale;
                                range.backgroundColor = scaleRange.BackgroundColor;
                                range.startValue = scaleRange.StartValue;
                                range.startWidth = scaleRange.StartWidth;
                                range.endValue = scaleRange.EndValue;
                                range.endWidth = scaleRange.EndWidth;
                                range.border.color = scaleRange.BorderColor;
                                range.border.width = scaleRange.BorderWidth;
                                scale.ranges.push(range);
                            }
                        } else {
                            scale.ranges = [];
                        }

                        var tick = linearScale.TickMark;
                        var majortickobj = scale.ticks[0];
                        var minortickobj = scale.ticks[1];
                        scale.ticks.pop(scale.ticks[0]);
                        scale.ticks.pop(scale.ticks[1]);
                        majortickobj.type = "majorInterval";
                        majortickobj.width = tick.MajorTickWidth;
                        majortickobj.height = tick.MajorTickLength / 2;
                        majortickobj.color = tick.MajorTickColor == null ? "black" : tick.MajorTickColor;
                        scale.ticks.push(majortickobj);
                        minortickobj.type = "minorInterval";
                        minortickobj.width = tick.MinorTickWidth;
                        minortickobj.height = tick.MinorTickLength * 2;
                        minortickobj.color = tick.MinorTickColor == null ? "black" : tick.MinorTickColor;
                        scale.ticks.push(minortickobj);

                        var labelValue = linearScale.Label;
                        var scalelabel = scale.labels[0];
                        scale.labels.pop(scale.labels[0]);
                        scalelabel.font.fontFamily = labelValue.LinearLabelFontFamily;
                        scalelabel.font.size = labelValue.LinearLabelFontSize;
                        scalelabel.font.fontStyle = labelValue.LinearLabelFontStyle;
                        scalelabel.distanceFromScale = labelValue.LinearLabelDistanceFromScale;
                        scalelabel.textColor = labelValue.TextColor;
                        scale.labels.push(scalelabel);

                        scale.indicators = null;
                        scale.customLabels = [];

                        linear.model.scales.push(scale);
                    }
                    linear.refresh();

                    if (printMode) {
                        linearGaugeDiv.append('<img src=' + linear.contextEl.canvas.toDataURL("image/png") + ' width=100% height=100%/>');
                        $(linear.contextEl.canvas).remove();
                    }
                    linearGaugeDiv.css({ 'width': panelOrientation == 'Horizontal' ? (containerWidth - (frame.FrameWidth * 2) - 3) : containerWidth - (frame.FrameWidth * 2), 'height': panelOrientation == 'Horizontal' ? containerHeight - (frame.FrameWidth * 2) : ((containerHeight - (frame.FrameWidth * 2)) - 3), 'float': panelOrientation == 'Horizontal' ? 'left' : 'top', 'border-color': (frame.FrameColor != null) ? frame.FrameColor : "Transparent", 'border-width': frame.FrameWidth, 'border-style': 'solid', 'background-color': linearGauge.BackgroundColor });
                }
            }
        },
        //-------------------- Render the Gauge ReportItem [start] -------------------------//

        _renderLineControl: function (lineModel, parentId, printMode, printPageId) {
            var svgNs = "http://www.w3.org/2000/svg";
            var ctrlId = this._controlKeyGenerator(this._id + '_' + lineModel.Name, parentId, printMode, printPageId);
            var linDiv = ej.buildTag("div", "", {}, { 'id': ctrlId });
            var _linDivCss = {};
            _linDivCss["position"] = 'absolute';
            _linDivCss["top"] = lineModel.Top;
            _linDivCss["left"] = lineModel.Left;
            _linDivCss["width"] = lineModel.Width == 0 ? '11.00064' : (lineModel.Width);
            _linDivCss["height"] = lineModel.Height == 0 ? '16.00128' : (lineModel.Height);
            linDiv.css(_linDivCss);

            if (this._svg) {
                var svgelement = document.createElementNS(svgNs, "svg");
                svgelement.setAttributeNS(null, 'width', lineModel.Width == 0 ? "11.00064" : (lineModel.Width));
                svgelement.setAttributeNS(null, 'height', lineModel.Height == 0 ? "16.00128" : (lineModel.Height));

                var svgtagelement = document.createElementNS(svgNs, "line");
                svgtagelement.setAttributeNS(null, "x1", lineModel.X1 == 0 ? lineModel.LineWidth : (lineModel.X1 - lineModel.LineWidth));
                svgtagelement.setAttributeNS(null, "y1", lineModel.Y1 == 0 ? lineModel.LineWidth : (lineModel.Y1 - lineModel.LineWidth));
                svgtagelement.setAttributeNS(null, "x2", lineModel.X2 == 0 ? lineModel.LineWidth : (lineModel.X2 - lineModel.LineWidth));
                svgtagelement.setAttributeNS(null, "y2", lineModel.Y2 == 0 ? lineModel.LineWidth : (lineModel.Y2 - lineModel.LineWidth));
                svgtagelement.setAttributeNS(null, "stroke", lineModel.LineColor);
                svgtagelement.setAttributeNS(null, "stroke-width", lineModel.LineWidth);
                svgtagelement.setAttributeNS(null, "shape-rendering", "crispEdges");
                if (lineModel.LineStyle == "Dashed") {
                    svgtagelement.setAttributeNS(null, "stroke-dasharray", "" + (lineModel.LineWidth * 2) + "," + (lineModel.LineWidth * 2) + "");
                } else if (lineModel.LineStyle == "Dotted") {
                    svgtagelement.setAttributeNS(null, "stroke-dasharray", lineModel.LineWidth);
                }
                svgelement.appendChild(svgtagelement);
                linDiv.append(svgelement);
            } else {
                document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
                document.createStyleSheet().cssText = 'v\\:fill, v\\:path, v\\:polyline, v\\:line, v\\:rect,v\\:shape,v\\:oval, v\\:stroke' + '{ behavior:url(#default#VML); display: inline-block; } ';

                var vmlObject = document.createElement("<v:line id='line' from='" + lineModel.X1 + ',' + lineModel.Y1 + "' to='" + lineModel.X2 + ',' + lineModel.Y2 + "' strokecolor='" + lineModel.LineColor + "' strokeweight='" + lineModel.LineWidth + "pt'>" + "<v:stroke dashstyle='dot'></v:stroke>" + "</v:line>");
                var str = document.createElement("v:stroke");
                if (lineModel.LineStyle == "Dotted") {
                    str.setAttribute("dashstyle", "dot");
                } else if (lineModel.LineStyle == "Dashed") {
                    str.setAttribute("dashstyle", "dash");
                } else {
                    str.setAttribute("dashstyle", "solid");
                }
                str.outerHTML = str.outerHTML;
                vmlObject.appendChild(str);

                vmlObject.style.position = "absolute";
                vmlObject.style.width = lineModel.Width;
                vmlObject.style.height = lineModel.Height;
                vmlObject.style.visibility = "visible";

                linDiv.append(vmlObject);
            }
            return linDiv;
        },

        _renderSubReportControl: function (subreportModel, isTablixCell, parentObj, parentId, printMode, printPageId) {
            var ctrlId = this._controlKeyGenerator(this._id + '_' + subreportModel.Name, parentId, printMode, printPageId);
            var subReportDiv = ej.buildTag("div", "", {}, { 'id': ctrlId, title: subreportModel.ToolTip });

            parentObj.append(subReportDiv);
            subReportDiv.css('position', isTablixCell ? 'relative' : 'absolute');
            subReportDiv.css('top', subreportModel.Top);
            subReportDiv.css('left', subreportModel.Left);
            subReportDiv.css('width', subreportModel.Width);
            subReportDiv.css('height', subreportModel.Height);
            subReportDiv.css('background-color', subreportModel.BackgroundColor);

            if (subreportModel.Padding) {
                if (subreportModel.Padding.Left) {
                    subReportDiv.css("padding-left", subreportModel.Padding.Left);
                }

                if (subreportModel.Padding.Right) {
                    subReportDiv.css("padding-right", subreportModel.Padding.Right);
                }

                if (subreportModel.Padding.Top) {
                    subReportDiv.css("padding-top", subreportModel.Padding.Top);
                }

                if (subreportModel.Padding.Bottom) {
                    subReportDiv.css("padding-bottom", subreportModel.Padding.Bottom);
                }
            }

            if (subreportModel.Style) {
                if (subreportModel.Style.Font) {
                    if (subreportModel.Style.Font.FontFamily) {
                        subReportDiv.css("font-family", subreportModel.Style.Font.FontFamily);
                    }

                    if (subreportModel.Style.Font.FontSize) {
                        subReportDiv.css("font-size", subreportModel.Style.Font.FontSize);
                    }

                    if (subreportModel.Style.Font.FontStyle) {
                        subReportDiv.css("font-style", subreportModel.Style.Font.FontStyle);
                    }

                    if (subreportModel.Style.Font.FontWeight) {
                        subReportDiv.css("font-weight", subreportModel.Style.Font.FontWeight);
                    }
                }

                subReportDiv.css("color", subreportModel.Style.TextColor ? subreportModel.Style.TextColor : "black");

                if (subreportModel.Style.TextDecoration) {
                    subReportDiv.css("text-decoration", subreportModel.Style.TextDecoration);
                }
            }

            if (subreportModel.LineHeight) {
                subReportDiv.css("line-height", subreportModel.LineHeight);
            }

            if (subreportModel.TextAlign) {
                subReportDiv.css("text-align", subreportModel.TextAlign);
            }

            if (subreportModel.VerticalAlign) {
                subReportDiv.css("vertical-align", subreportModel.VerticalAlign);
            }

            if (subreportModel.Border && !isTablixCell) {
                this._applyBorderStyle(subreportModel.Border, subReportDiv);
            }

            if (subreportModel.ReportItemModels && subreportModel.ReportItemModels.length > 0) {
                for (var i = 0; i < subreportModel.ReportItemModels.length; i++) {
                    var innerItem = subreportModel.ReportItemModels[i];
                    if (innerItem) {
                        if (innerItem.ItemType == "TextBoxModel") {
                            var textboxControl = this._renderTextBoxControl(innerItem, false, ctrlId + '_' + innerItem.Name, printMode, printPageId);
                            subReportDiv.append(textboxControl);
                        } else if (innerItem.ItemType == "LineModel") {
                            var lineControl = this._renderLineControl(innerItem, ctrlId + '_' + innerItem.Name, printMode, printPageId);
                            subReportDiv.append(lineControl);
                        } else if (innerItem.ItemType == "ImageModel") {
                            this._renderImageControl(innerItem, false, subReportDiv, ctrlId + '_' + innerItem.Name, printMode, printPageId);
                        } else if (innerItem.ItemType == "TablixModel") {
                            this._renderTablixControl(innerItem, false, {}, subReportDiv, ctrlId + '_' + innerItem.Name, printPageId);
                        } else if (innerItem.ItemType == "GaugeModel") {
                            this._renderGaugeControl(innerItem, false, {}, subReportDiv, ctrlId + '_' + innerItem.Name, printMode, printPageId);
                        } else if (innerItem.ItemType == "RectangleModel") {
                            this._renderRectangleControl(innerItem, false, subReportDiv, ctrlId + +'_' + innerItem.Name, printMode, printPageId);
                        } else if (innerItem.ItemType == "ChartModel") {
                            this._renderChartControl(innerItem, false, {}, subReportDiv, ctrlId + '_' + innerItem.Name, printMode, printPageId);
                        } else if (innerItem.ItemType == "MapModel") {
                            this._renderMapControl(innerItem, subReportDiv, ctrlId + '_' + innerItem.Name, printMode, printPageId);
                        } else if (innerItem.ItemType == "SubReportModel") {
                            this._renderSubReportControl(innerItem, false, subReportDiv, ctrlId + +'_' + innerItem.Name, printMode, printPageId);
                        }
                    }
                }
            }
        },
        //-------------------- Render the Page ReportItems[End] -------------------------//

        //-------------------- Ajax Web API Call back methods[start] -------------------------//
        doAjaxPost: function (type, url, jsondata, onSuccess) {
            var proxy = this;
            var inVokemethod = onSuccess;
            $.ajax({
                type: type,
                url: url,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: jsondata,
                beforeSend: function (req) {
                    if (inVokemethod == "_getPageModel" || inVokemethod == "_getPreviewModel") {
                        if (!proxy._isToolbarClick) {
                            proxy._showloadingIndicator(true);
                        } else {
                            proxy._showNavigationIndicator(true);
                        }
                    }
                    req.setRequestHeader('ejAuthenticationToken', proxy._authenticationToken);
                    if (proxy.model.reportServerId) {
                        req.setRequestHeader('ejServerInstance', proxy.model.reportServerId);
                    }
                },
                success: function (data) {
                    if (data && typeof (data.Data) != "undefined") {
                        data = data.Data;
                    }
                    if (typeof (data) == "string") {
                        if (data.indexOf("Sf_Exception") != -1) {
                            proxy._renderExcpetion(inVokemethod + ":" + data);
                            return;
                        }
                    }
                    proxy[inVokemethod](data);
                },
                error: function (msg, textStatus, errorThrown) {
                    if (inVokemethod != "_clearCurrentServerCache") {
                        if (msg.readyState == 0) {
                            return;
                        }
                        alert('Exception' + msg.responseText);
                    }
                }
            });
        },

        _reportLoaded: function (reportresult) {
            if (typeof (reportresult) == "object" && reportresult.isReportLoad) {
                if (reportresult) {
                    this._reportParameters = reportresult.parameters;
                    this._reportDataSources = reportresult.dataSources;
                    this._reporDataSets = reportresult.dataSets;
                    this._onReportLoaded();
                    this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getDataSourceCredential, 'dataSources': this.model.dataSources, 'parameters': this.model.parameters }), "_getDataSourceCredential");
                }
                else {
                    this._renderExcpetion("Could not load the report");
                    var isError = this._onReportError({ errmsg: "Could not load the report" });
                    this._showExceptionResult(isError, "Could not load the report");
                }
            } else {
                this._renderExcpetion("Report Loaded:" + reportresult);
                var isError = this._onReportError({ errmsg: "Report Loaded:" + reportresult, innerMessage: reportresult });
                this._showExceptionResult(isError, "Report Loaded:" + reportresult);
            }
        },

        _getDataSourceCredential: function (jsondata) {
            if (ej.isNullOrUndefined(jsondata) || jsondata == "Sf_legacy") {
                this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.updateDataSource }), "_updateDataSource");
            } else {
                this._renderCredentialBlock(jsondata);
                this._showViewerBlock(true);
            }
            this._showloadingIndicator(false);
            this._setContainerSize();
            this._showloadingIndicator(true);
        },

        _validateDSCredential: function (jsondata) {
            if (jsondata == "Sf_legacy") {
                this._showloadingIndicator(false);
                this._showViewerBlock(false);
                this._setContainerSize();
                this._showloadingIndicator(true);
                this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.updateDSCredential, 'datasoures': this._dataSources }), "_updateDSCredential");
                this._dataSources = null;
				this._unwiredViewClickEvent();
            }
            else {
                alert(jsondata);
            }
        },

        _updateDSCredential: function (jsondata) {
            this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.updateDataSource }), "_updateDataSource");
        },

        _getParameters: function (jsondata) {
            if (jsondata != "Sf_legacy") {
                var isCustomBlock = this._renderParameterBlock(jsondata);
                if (!isCustomBlock) {
                    this._showViewerBlock(true);
                    this._showloadingIndicator(false);
                    this._setContainerSize();
                    this._showloadingIndicator(true);
                    var reportParams = this._getParameterJson(jsondata, false);
                    this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.setParameters, 'parameters': reportParams }), "_setParameters");
                } else {
                    this._setContainerSize();
                    this._getDefaultParameters(jsondata);
                }
            }
            else {
                this._showParameterBlock(false);
                this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getPageModel, 'refresh': this._refresh, 'dataRefresh': this._dataRefresh, 'pageindex': this._currentPage, 'pageInit': this._isToolbarClick, 'isPrint': this._printMode }), !this._printMode ? "_getPageModel" : "_getPreviewModel");
            }
        },

        _setParameters: function (jsondata) {
            var isClick = $('#' + this._id + '_viewBlockContainer .e-reportviewer-viewerblockcontent table:first').attr('isviewclick');
            if (typeof (jsondata) == "boolean") {
                if (jsondata == false) {
                    this._showloadingIndicator(true);
                    this._setContainerSize();
                    if (this._isDevice) {
                        this._showViewerBlock(false);
                        this._showViewerPage(true);
                        this._selectparamToolItem(false);
                    }
                    this._currentPage = 1;
                    this._clearPageCache();
                    this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getPageModel, 'refresh': this._refresh, 'dataRefresh': this._dataRefresh, 'pageindex': this._currentPage, 'pageInit': this._isToolbarClick, 'isPrint': this._printMode }), !this._printMode ? "_getPageModel" : "_getPreviewModel");
                } else {
                    this._showloadingIndicator(false);
                    if (isClick == 'true') {
                        this._viewReportEnableDisable(false);
                        alert('Please select the parameter values.');
                    }
                }
            }
        },

        _updateParameters: function (jsondata) {
            if (jsondata != "Sf_legacy") {
                this._updateParamElements(jsondata);
            }
        },

        _updateDataSource: function (jsondata) {
            this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getParameters }), "_getParameters");
        },

        _getPageModel: function (jsondata) {
            var jsData = jsondata;
            this._showNavigationIndicator(false);
            this._showloadingIndicator(false);
            this._viewReportEnableDisable(false);
            if (jsData) {
                if (jsData === 'IsDrillDown' || jsData === 'IsSorting') {
                    return;
                }
                if (jsData.isDocumentMap) {
                    this._isDocumentMap = this._isPageDocMap = jsData.isDocumentMap;
                }
                if (jsData.errmsg && jsData.errmsg.length > 0) {
                    var isError = this._onReportError({ errmsg: jsData.errmsg });
                    this._showExceptionResult(isError, jsData.errmsg);
                } else {
                    this._resetExceptionBlock();
                }
                if (jsData.pgmodel && jsData.pgmodel.PageData) {
                    this._pageModel = jsData.pgmodel;
                    if (!this._isToolbarClick) {
                        this._enableToolbarItems();
                    }
                    this._onRenderingBegin();
                    this._gotoPage(this._currentPage);
                    this._pageLayoutPage = this._currentPage;
                    if (this.model.enablePageCache) {
                        this._storePageCache(this._currentPage);
                    }
                    this._onRenderingComplete();
                    this._refresh = false;
                    this._dataRefresh = false;
                }
                if (jsData.pgsetting) {
                    this._updatePageSetup(jsData.pgsetting);
                }
            }
        },

        _getPreviewModel: function (jsonData) {
            this._showNavigationIndicator(false);
            this._showloadingIndicator(false);
            if (jsonData) {
                if (jsonData.isDocumentMap) {
                    this._isDocumentMap = jsonData.isDocumentMap;
                    this._isPageDocMap = this._isDocumentMap;
                    this._pageDocMapFlag = false;
                }
                if (jsonData.pgmodel && jsonData.pgmodel.PageData) {
                    this._pageModel = jsonData.pgmodel;
                    if (!this._isToolbarClick) {
                        this._selectPreviewToolItem(true);
                        this._enableToolbarItems();
                    }
                    this._gotoPage(this._currentPage);
                    this._refresh = false;
                    this._initialPageSetup(jsonData);
                }
            }
        },

        _getPrintModel: function (jsonData) {
            if (jsonData && jsonData.PageData && jsonData.PageData.length > 0) {
                if (this.model.printOption == "None") {
                    this._renderSilentPrinting(jsonData);
                }
                else {
                    this._printReport(jsonData);
                }
            }
        },

        _documentMapModel: function (jsondata) {
            if (jsondata && jsondata.indexOf("<ul id=treeViewID>") != -1) {
                this._showDocumentMap(this.model.toolbarSettings.items & ej.ReportViewer.ToolbarItems.DocumentMap);
                this._containerSplit(jsondata);
            }
        },

        _drillThroughModel: function (jsondata) {
            var pageXy = { x: $('#' + this._id + '_viewerContainer').scrollLeft(), y: $('#' + this._id + '_viewerContainer').scrollTop() };
            var reportProperties = this._cloneReportViewerProperties();
            this._parents.push({ pagePos: pageXy, parentPro: reportProperties });
            this._setInitialization();
            this._authenticationToken = reportProperties._childReportAuthentication;
            this._unwireEvents();
            this._initViewer();
            this._reportLoaded(jsondata);
        },

        _gotoParentReportModel: function (jsondata) {
            this._setParentReportViewerProperties();
            var currentpgno = this._currentPage;
            this._unwireEvents();
            this._initViewer();
            this._currentPage = currentpgno;
            this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getParameters }), "_getParameters");
        },

        _clearCurrentServerCache: function (jsonData) {
        },
        //-------------------- Ajax Web API Call back methods[end] -------------------------//

        //-------------------- Print Actions[Start] -------------------------//
        _print: function () {
            this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getPrintModel }), "_getPrintModel");
        },

        _printReport: function (printModel) {
            var reportModel = printModel;

            var pageHeight = reportModel.PaperHeight;
            var pageWidth = reportModel.PaperWidth;
            var headerTop = reportModel.MarginTop;
            var contentLeft = reportModel.MarginLeft;
            var links = $('head').find('link');
            var isIe9 = (this._browserInfo.name == 'msie' && (parseInt(this._browserInfo.version) <= 9.0));
            var printWind = this.model.printOption == "Default" ? window.open('', 'pint', "tabbar=no,scrollbars = yes,resizable = yes") : window.open('', '_blank');
            var pageStyle = '<style>h1 {display:block;height:0px;page-break-after:always;}@page { size:' + pageWidth + 'px ' + pageHeight + 'px; margin:0px;}@media print{ #header, #footer { display:none } }</style>';
            var isCssLoad = true;

            if (printWind != null) {
                printWind.document.write('<!DOCTYPE html>');
                printWind["printDelay"] = 500;
                isCssLoad = this._onReportPrint({ printWind: printWind, isStyleLoad: true });
                var bodyTag = this._browserInfo.name === "msie" ? '<body style="width:' + pageWidth + 'px">' : '<body>';

                if (isCssLoad) {
                    var a = "";
                    links.each(function (index, obj) {
                        $(obj).attr('href', obj.href);
                        a += obj.outerHTML;
                    });
                    printWind.document.write('<html><head>' + a + pageStyle + '</head>' + bodyTag);
                }else{
				    printWind.document.write('<html><head>' + pageStyle + '</head>' + bodyTag);
				}

                for (var i = 0; i < reportModel.TotalPages; i++) {
                    var pagdata = reportModel.PageData[i];
                    if (!ej.isNullOrUndefined(pagdata)) {
                        printWind.document.write('<div style="position:relative;height:' + pageHeight + 'px;width:' + pageWidth + 'px;'+(this._browserInfo.name == 'mozilla' ? 'page-break-inside:avoid' : '' )+';">');
                        var printContent = this._renderPrintContainer(pagdata, headerTop, contentLeft, i);
                        printWind.document.write(printContent);
                        printWind.document.write('</div>');

                        if (!isIe9) {
                            printWind.document.write('<h1></h1>');
                        }
                        else if (isIe9 && (i < reportModel.TotalPages)) {
                            printWind.document.write('<h1></h1>');
                        }
                    }
                }
                var delay = (printWind.printDelay && printWind.printDelay === parseInt(printWind.printDelay, 10)) ? printWind.printDelay : 500;
                printWind.document.write('</body></html>');
                printWind.document.close();
                printWind.focus();
                setTimeout(function () {
                    if (!ej.isNullOrUndefined(printWind.window)) {
                        printWind.print();
                        setTimeout(function () { printWind.close() }, 300);
                    }
                }, delay);
            }
        },

        _renderSilentPrinting: function (printModel) {
            var reportModel = printModel;

            var pageHeight = reportModel.PaperHeight;
            var pageWidth = reportModel.PaperWidth;
            var headerTop = reportModel.MarginTop;
            var contentLeft = reportModel.MarginLeft;
            var links = $('head').find('link');
            var isIe9 = (this._browserInfo.name == 'msie' && (parseInt(this._browserInfo.version) <= 9.0));
            var pageStyle = '<style>h1 {display:block;height:0px;page-break-after:always;}@page { size:' + pageWidth + 'px ' + pageHeight + 'px; margin:0px;}@media print{ #header, #footer { display:none } }</style>';

            var PrintPageIframe = $('#' + this._id + '_printPageIframe');
            if (!(PrintPageIframe.length > 0)) {
                PrintPageIframe = $('<iframe id="' + (this._id + '_printPageIframe') + '"></iframe>');
                PrintPageIframe.css({ 'height': '.0001px', 'width': '.0001px', 'backgroundColor': 'Transparent', 'border': 'none' });
                $('body').append(PrintPageIframe);
            }

            var printFrame = PrintPageIframe[0].contentWindow ? PrintPageIframe[0].contentWindow : PrintPageIframe[0].contentDocument.document ? PrintPageIframe[0].contentDocument.document : PrintPageIframe[0].contentDocument;

            if (printFrame != null) {
                printFrame.document.open();
                printFrame.document.write('<!DOCTYPE html>');
                printFrame["printDelay"] = 500;
                isCssLoad = this._onReportPrint({ printFrame: printFrame, isStyleLoad: true });
                var bodyTag = this._browserInfo.name === "msie" ? '<body style="width:' + pageWidth + 'px">' : '<body>';
				if (isCssLoad) {
                    var a = "";
                    links.each(function (index, obj) {
                        $(obj).attr('href', obj.href);
                        a += obj.outerHTML;
                    });
                    printFrame.document.write('<html><head>' + a + pageStyle + '</head>' + bodyTag);
                } else{
				    printFrame.document.write('<html><head>' + pageStyle + '</head>' + bodyTag);
				}

                for (var i = 0; i < reportModel.TotalPages; i++) {
                    var pagdata = reportModel.PageData[i];
                    if (!ej.isNullOrUndefined(pagdata)) {
                        printFrame.document.write('<div style="position:relative;height:' + pageHeight + 'px;width:' + pageWidth + 'px;' + (this._browserInfo.name == 'mozilla' ? 'page-break-inside:avoid' : '') + ';">');
                        var printContent = this._renderPrintContainer(pagdata, headerTop, contentLeft, i);
                        printFrame.document.write(printContent);
                        printFrame.document.write('</div>');

                        if (!isIe9) {
                            printFrame.document.write('<h1></h1>');
                        }
                        else if (isIe9 && (i < reportModel.TotalPages)) {
                            printFrame.document.write('<h1></h1>');
                        }
                    }
                }
                var delay = (printFrame.printDelay && printFrame.printDelay === parseInt(printFrame.printDelay, 10)) ? printFrame.printDelay : 500;
                printFrame.document.write('</body></html>');
                printFrame.document.close();
                printFrame.focus();
                setTimeout(function () {
                    if (!ej.isNullOrUndefined(printFrame.window)) {
                        printFrame.print();
                        setTimeout(function () { printFrame.window.close(); }, 300);
                    }
                }, delay);
            }
        },

        _renderPrintContainer: function (pagedata, top, left, index) {
            var oDiv = document.createElement("div");
            document.body.appendChild(oDiv);
            $(oDiv).css({ 'overflow': 'auto', 'width': '1px', 'height': '1px' });
            //$(oDiv).hide();

            var $printviewContainer = ej.buildTag("div", "", { 'position': 'relative', 'background-color': 'transparent' });
            $(oDiv).append($printviewContainer);

            var $printviewheaderContainer = ej.buildTag("div", "", { 'position': 'relative', 'background-color': 'transparent', 'width': pagedata.Width + 'px', 'height': pagedata.HeaderHeight + 'px' }, {});
            var $printviewheaderborder = ej.buildTag("div.pageHeaderBorder", "", { 'position': 'relative', 'background-color': '#FFFFFF', 'left': left, 'top': top });
            $printviewheaderborder.append($printviewheaderContainer);
            $printviewContainer.append($printviewheaderborder);

            var $printviewbodyContainer = ej.buildTag("div", "", { 'position': 'relative', 'background-color': 'transparent', 'width': pagedata.Width + 'px', 'height': pagedata.Height + 'px' }, {});
            var $printviewbodyborder = ej.buildTag("div.pageBodyBorder", "", { 'position': 'relative', 'background-color': '#FFFFFF', 'left': left, 'top': top });
            $printviewbodyborder.append($printviewbodyContainer);
            $printviewContainer.append($printviewbodyborder);

            var $printviewfooterContainer = ej.buildTag("div", "", { 'position': 'relative', 'background-color': 'transparent', 'width': pagedata.Width + 'px', 'height': pagedata.FooterHeight + 'px' }, {});
            var $printviewfooterborder = ej.buildTag("div.pageFooterBorder", "", { 'position': 'relative', 'background-color': '#FFFFFF', 'left': left, 'top': top });
            $printviewfooterborder.append($printviewfooterContainer);
            $printviewContainer.append($printviewfooterborder);

            if (pagedata.ReportStyleModel) {
                this._applyPageStyle($printviewContainer, pagedata.ReportStyleModel, true);
            }

            if (pagedata.HeaderStyleModel) {
                this._applyPageStyle($printviewheaderborder, pagedata.HeaderStyleModel, true);
            }

            if (pagedata.FooterStyleModel) {
                this._applyPageStyle($printviewfooterborder, pagedata.FooterStyleModel, true);
            }

            if (pagedata.BodyStyleModel) {
                this._applyPageStyle($printviewbodyborder, pagedata.BodyStyleModel, true);
            }

            if (pagedata.HeaderModel && pagedata.HeaderModel.length > 0) {
                this._renderPageControls(pagedata.HeaderModel, $printviewheaderContainer, true, 'Print' + index);
            }

            if (pagedata.FooterModel && pagedata.FooterModel.length > 0) {
                this._renderPageControls(pagedata.FooterModel, $printviewfooterContainer, true, 'Print' + index);
            }

            if (pagedata.PageModel && pagedata.PageModel.length > 0) {
                this._renderPageControls(pagedata.PageModel, $printviewbodyContainer, true, 'Print' + index);
            }

            var htmlele = oDiv.innerHTML.replace(/PrintImage/g, 'GetResource');
            document.body.removeChild(oDiv);
            return htmlele;
        },

        _showPrintButton: function (enable) {
            if (enable) {
                $('#' + this._id + '_toolbar_Print').parent().css("display", "block");
            }
            else {
                $('#' + this._id + '_toolbar_Print').parent().css("display", "none");
            }
        },
        //-------------------- Print Actions[end] -------------------------//

        //-------------------- Export Actions[Start] -------------------------//    
        _exportMenuClick: function (event) {
            var exportType;
            var exportformat = $(event.target);
            if (exportformat) {
                if (exportformat.hasClass('e-pdf')) {
                    exportType = 'PDF';
                } else if (exportformat.hasClass('e-word')) {
                    exportType = 'Word_' + this.model.exportSettings.wordFormat;
                } else if (exportformat.hasClass('e-excel')) {
                    exportType = 'Excel_' + this.model.exportSettings.excelFormat;
                } else if (exportformat.hasClass('e-html')) {
                    exportType = 'Html';
                } else if (exportformat.hasClass('e-ppt')) {
                    exportType = 'PPT_' + this.model.exportSettings.pptFormat;
                }
                this._exportReport(exportType);
            }
        },

        _exportReport: function (exportType) {
            var _exportFormObj = null;
            if (exportType && exportType.length > 0) {
                var requrl = this.model.reportServiceUrl + '/PostReportAction';
                if ($('#' + this._id + '_exportForm').length > 0) {
                    var _exportForm = $('#' + this._id + '_exportForm');
                    _exportForm.attr("action", requrl);
                    $('#' + this._id + "_exportKey").val(this._authenticationToken);
                    $('#' + this._id + "_exportRes").val(exportType);
                    _exportFormObj = { exportAction: _exportForm };
                    this._onReportExport(_exportFormObj);
                    _exportForm.submit();
                } else {
                    var exportForm = document.createElement("form");
                    $(exportForm).attr({ "id": this._id + "_exportForm", "method": "post", "action": requrl, "data-ajax": "false" });

                    var exportKey = document.createElement("input");
                    $(exportKey).attr({ "type": "hidden", "id": this._id + "_exportKey", "name": "controlID", "value": this._authenticationToken });

                    var exportRes = document.createElement("input");
                    $(exportRes).attr({ "type": "hidden", "id": this._id + "_exportRes", "name": "resourcetype", "value": exportType });

                    var exportPrint = document.createElement("input");
                    $(exportPrint).attr({ "type": "hidden", "id": this._id + "_exportPrint", "name": "isPrint", "value": false });

                    var exportName = document.createElement("input");
                    $(exportName).attr({ "type": "hidden", "id": this._id + "_exportfileName", "name": "reportName", "value": "" });

                    $(exportForm).append(exportKey);
                    $(exportForm).append(exportRes);
                    $(exportForm).append(exportPrint);
                    $(exportForm).append(exportName);
                    $('body').append(exportForm);
                    $(exportForm).hide();
                    _exportFormObj = { exportAction: exportForm };
                    this._onReportExport(_exportFormObj);
                    $(exportForm).submit();
                }
            }
            $('#' + this._id + '_toolbar_exportListTip').hide();
        },

        _showExportList: function () {
            if (this.model.exportSettings.exportOptions & ej.ReportViewer.ExportOptions.Html) {
                $('#' + this._id + '_html').css('display', 'block');
            } else {
                $('#' + this._id + '_html').css('display', 'none');
            }

            if (this.model.exportSettings.exportOptions & ej.ReportViewer.ExportOptions.Word) {
                $('#' + this._id + '_word').css('display', 'block');
            } else {
                $('#' + this._id + '_word').css('display', 'none');
            }

            if (this.model.exportSettings.exportOptions & ej.ReportViewer.ExportOptions.Excel) {
                $('#' + this._id + '_xls').css('display', 'block');
            } else {
                $('#' + this._id + '_xls').css('display', 'none');
            }

            if (this.model.exportSettings.exportOptions & ej.ReportViewer.ExportOptions.Pdf) {
                $('#' + this._id + '_pdf').css('display', 'block');
            } else {
                $('#' + this._id + '_pdf').css('display', 'none');
            }

            if (this.model.exportSettings.exportOptions & ej.ReportViewer.ExportOptions.PPT) {
                $('#' + this._id + '_ppt').css('display', 'block');
            } else {
                $('#' + this._id + '_ppt').css('display', 'none');
            }
        },

        _showExportControls: function (enable) {
            if (enable) {
                $('#' + this._id + '_toolbarContainer .e-reportviewer-export').parent().css("display", "block");
            }
            else {
                $('#' + this._id + '_toolbarContainer .e-reportviewer-export').parent().css("display", "none");
            }
        },

        _showTooltip: function () {
            var exportTooltip = $('#' + this._id + '_toolbar_exportListTip');
            if (!(exportTooltip.length > 0)) {
                exportTooltip = this._renderToolTipExport();
                $('body').append(exportTooltip);
                this._showExportList();
                this._on($('#' + this._id + '_toolbar_exportListTip .e-reportviewer-popupli'), "click", this._exportMenuClick);
            }

            if (exportTooltip.css('display') == 'block') {
                exportTooltip.css('display', 'none');
            } else {
                exportTooltip.css('display', 'block');
            }

            var exportTagHeight = $('#' + this._id + '_toolbarContainer .e-reportviewer-export').height();
            var expoTagPos = $($('#' + this._id + '_toolbarContainer .e-reportviewer-export')[0]).offset();
            exportTooltip.css({ 'top': (expoTagPos.top + exportTagHeight) - 3, 'left': (expoTagPos.left - 5) });
        },

        //-------------------- Export Actions[End] -------------------------//

        //-------------------- Page Navigation Actions[Start] -------------------------//
        _updatePageNavigation: function (pageNo, totalPage) {
            if (pageNo > 1 && pageNo < totalPage) {
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotofirst').removeClass('e-reportviewer-disabled');
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotoprevious').removeClass('e-reportviewer-disabled');
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotonext').removeClass('e-reportviewer-disabled');
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotolast').removeClass('e-reportviewer-disabled');
            } else if (pageNo == 1 && pageNo < totalPage) {
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotofirst').addClass('e-reportviewer-disabled');
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotoprevious').addClass('e-reportviewer-disabled');
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotonext').removeClass('e-reportviewer-disabled');
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotolast').removeClass('e-reportviewer-disabled');
            } else if (pageNo == totalPage && totalPage != 1) {
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotofirst').removeClass('e-reportviewer-disabled');
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotoprevious').removeClass('e-reportviewer-disabled');
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotonext').addClass('e-reportviewer-disabled');
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotolast').addClass('e-reportviewer-disabled');
            } else {
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotofirst').addClass('e-reportviewer-disabled');
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotoprevious').addClass('e-reportviewer-disabled');
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotonext').addClass('e-reportviewer-disabled');
                $('#' + this._id + '_toolbarContainer .e-reportviewer-gotolast').addClass('e-reportviewer-disabled');
            }
        },

        _gotoRenderPage: function () {
            this._onRenderingBegin();
            this._pageModel = this._retrievePageCache(this._currentPage);
            this._gotoPage(this._currentPage);
            this._pageLayoutPage = this._currentPage;
            this._onRenderingComplete();
            this._refresh = false;
        },

        _gotoFirstPage: function () {
            if (this._pageModel && this._pageModel.TotalPages) {
                if (this._pageModel.TotalPages > 0) {
                    this._currentPage = 1;
                    this._refresh = false;
                    if (this.model.enablePageCache && this._pageContains(this._currentPage)) {
                        this._gotoRenderPage();
                    } else {
                        this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getPageModel, 'refresh': this._refresh, 'dataRefresh': this._dataRefresh, 'pageindex': this._currentPage, 'pageInit': this._isToolbarClick, 'isPrint': this._printMode }), !this._printMode ? "_getPageModel" : "_getPreviewModel");
                    }
                }
            }
        },

        _gotoLastPage: function () {
            if (this._pageModel && this._pageModel.TotalPages) {
                if (this._pageModel.TotalPages > 0) {
                    this._currentPage = this._pageModel.TotalPages;
                    this._refresh = false;
                    if (this.model.enablePageCache && this._pageContains(this._currentPage)) {
                        this._gotoRenderPage();
                    } else {
                        this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getPageModel, 'refresh': this._refresh, 'dataRefresh': this._dataRefresh, 'pageindex': this._currentPage, 'pageInit': this._isToolbarClick, 'isPrint': this._printMode }), !this._printMode ? "_getPageModel" : "_getPreviewModel");
                    }
                }
            }
        },

        _gotoNextPage: function () {
            if (this._pageModel && this._pageModel.TotalPages) {
                if (this._currentPage < this._pageModel.TotalPages) {
                    this._currentPage = this._currentPage + 1;
                    this._refresh = false;
                    if (this.model.enablePageCache && this._pageContains(this._currentPage)) {
                        this._gotoRenderPage();
                    } else {
                        this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getPageModel, 'refresh': this._refresh, 'dataRefresh': this._dataRefresh, 'pageindex': this._currentPage, 'pageInit': this._isToolbarClick, 'isPrint': this._printMode }), !this._printMode ? "_getPageModel" : "_getPreviewModel");
                    }
                }
            }
        },

        _gotoPreviousPage: function () {
            if (this._pageModel && this._pageModel.TotalPages) {
                if (this._currentPage > 1) {
                    this._currentPage = this._currentPage - 1;
                    this._refresh = false;
                    if (this.model.enablePageCache && this._pageContains(this._currentPage)) {
                        this._gotoRenderPage();
                    } else {
                        this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getPageModel, 'refresh': this._refresh, 'dataRefresh': this._dataRefresh, 'pageindex': this._currentPage, 'pageInit': this._isToolbarClick, 'isPrint': this._printMode }), !this._printMode ? "_getPageModel" : "_getPreviewModel");
                    }
                }
            }
        },

        _gotoPageNo: function (pageNo) {
            if (this._pageModel && this._pageModel.TotalPages) {
                var pagenumber = parseInt(pageNo);
                if (pagenumber >= 1 && pagenumber <= this._pageModel.TotalPages && this._currentPage != pagenumber) {
                    this._currentPage = pagenumber;
                    this._refresh = false;
                    if (this.model.enablePageCache && this._pageContains(this._currentPage)) {
                        this._gotoRenderPage();
                    } else {
                        this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getPageModel, 'refresh': this._refresh, 'dataRefresh': this._dataRefresh, 'pageindex': this._currentPage, 'pageInit': this._isToolbarClick, 'isPrint': this._printMode }), !this._printMode ? "_getPageModel" : "_getPreviewModel");
                    }
                }
            }
        },

        _gotoPage: function (pageNo) {
            if (this._pageModel && this._pageModel.PageData && this._pageModel.PageData.length > 0) {
                var pagenumber = parseInt(pageNo);
                this._updatePageNavigation(pagenumber, this._pageModel.TotalPages);
                if (this._pageModel.TotalPages > 0 && this._pageModel.TotalPages) {
                    $('#' + this._id + '_toolbarContainer span.e-reportviewer-labelpageno').html(" / " + this._pageModel.TotalPages);
                    $('#' + this._id + '_txtpageNo').val(pagenumber);
                }

                var _ejObjects = $('#' + this._id + '_viewerContainer').find('.e-js');
                if (_ejObjects && _ejObjects.length > 0) {
                    this._destroyEJObjects(_ejObjects);
                }
                _ejObjects = null;

                var pageData = this._pageModel.PageData[0];
                this._renderPageModels(pageData);
                if (pageData) {
                    this._setPageSize(pageData.Height, pageData.Width, pageData.HeaderHeight, pageData.FooterHeight);
                }
            }
        },

        _onkeyPress: function (event) {
            if (event.keyCode == 13) {
                try {
                    var val = parseInt($(event.currentTarget).val());
                    this._gotoPageNo(val);
                } catch (err) {
                }
            }
            if (event.keyCode > 31 && (event.keyCode < 48 || event.keyCode > 57)) {
                return false;
            }
        },

        _showPageNavigationControls: function (enable) {
            if (enable) {
                $('#' + this._id + '_txtpageNo').parents(".e-reportviewer-toolbarul").css("display", "block");
            } else {
                $('#' + this._id + '_txtpageNo').parents(".e-reportviewer-toolbarul").css("display", "none");
            }
        },
        //-------------------- Page Navigation Actions[End] -------------------------//

        //-------------------- Print Page Setup [Start] -----------------------------//

        _showPrintPageSetup: function () {
            var pageSetup = $('#' + this._id + '_printPageSetup');
            var eDialog;
            if (!(pageSetup.length > 0)) {
                pageSetup = this._renderPrintPageSetup();
                this._bindPageSetupModel();
                $('body').append(pageSetup);
            } else {
                eDialog = $('#' + this._id + '_printPageSetup').data('ejDialog');
            }

            if (eDialog && eDialog.model) {
                var _isopen = eDialog.isOpen();
                if (_isopen) {
                    $('#' + this._id + '_printPageSetup').ejDialog("close");
                } else {
                    $('#' + this._id + '_printPageSetup').ejDialog("open");
                    this._bindPageSetupModel();
                }
            }
            
            this._enableToolbarContents(false);
        },

        _pageSettingClose: function(args){
            this._enableToolbarContents(true);
        },

        _updatePageSetup: function (_pageSetting) {
            if (!ej.isNullOrUndefined(_pageSetting)) {
                this._paperSetup.paperHeight = (_pageSetting.PaperHeight / 96).toFixed(2);
                this._paperSetup.paperWidth = (_pageSetting.PaperWidth / 96).toFixed(2);
                this._paperSetup.MarginTop = (_pageSetting.MarginTop / 96).toFixed(2);
                this._paperSetup.MarginRight = (_pageSetting.MarginRight / 96).toFixed(2);
                this._paperSetup.MarginBottom = (_pageSetting.MarginBottom / 96).toFixed(2);
                this._paperSetup.MarginLeft = (_pageSetting.MarginLeft / 96).toFixed(2);
                this._paperOrientation = parseInt(this._paperSetup.paperHeight) < parseInt(this._paperSetup.paperWidth) ? "Landscape" : "Portrait";
                this._paperName = this._getPaperName(this._paperSetup.paperWidth, this._paperSetup.paperHeight);
            }
        },

        _initialPageSetup: function (jsonData) {
            if (!ej.isNullOrUndefined(jsonData.pgmodel.PaperHeight)) {
                this._paperSetup.paperHeight = (jsonData.pgmodel.PaperHeight / 96).toFixed(2);
            }
            if (!ej.isNullOrUndefined(jsonData.pgmodel.PaperWidth)) {
                this._paperSetup.paperWidth = (jsonData.pgmodel.PaperWidth / 96).toFixed(2);
            }
            if (!ej.isNullOrUndefined(jsonData.pgmodel.MarginTop)) {
                this._paperSetup.MarginTop = (jsonData.pgmodel.MarginTop / 96).toFixed(2);
            }
            if (!ej.isNullOrUndefined(jsonData.pgmodel.MarginRight)) {
                this._paperSetup.MarginRight = (jsonData.pgmodel.MarginRight / 96).toFixed(2);
            }
            if (!ej.isNullOrUndefined(jsonData.pgmodel.MarginBottom)) {
                this._paperSetup.MarginBottom = (jsonData.pgmodel.MarginBottom / 96).toFixed(2);
            }
            if (!ej.isNullOrUndefined(jsonData.pgmodel.MarginLeft)) {
                this._paperSetup.MarginLeft = (jsonData.pgmodel.MarginLeft / 96).toFixed(2);
            }
        },

        _bindPageSetupModel: function () {
            var heightNum = $('#' + this._id + '_paperHeight').data('ejNumericTextbox');
            var widthNum = $('#' + this._id + '_paperWidth').data('ejNumericTextbox');
            var marginLeft = $('#' + this._id + '_paperMarginLeft').data('ejNumericTextbox');
            var marginTop = $('#' + this._id + '_paperMarginTop').data('ejNumericTextbox');
            var marginRight = $('#' + this._id + '_paperMarginRight').data('ejNumericTextbox');
            var marginBottom = $('#' + this._id + '_paperMarginBottom').data('ejNumericTextbox');
            this._paperName = this._getPaperName(this._paperSetup.paperWidth, this._paperSetup.paperHeight);
            if (this._paperName) {
                var paperDDL = $('#' + this._id + '_PaperSize').data("ejDropDownList");
                paperDDL.selectItemByText(this._paperName);

                var landscape = $('#' + this._id + '_landscape').data('ejRadioButton');
                var portrait = $('#' + this._id + '_portrait').data('ejRadioButton');

                if (this._paperName == "Custom") {
                    if (landscape.model.checked == true) {
                        heightNum.option('value', this._paperSetup.paperWidth ? this._paperSetup.paperWidth : 1);
                        widthNum.option('value', this._paperSetup.paperHeight ? this._paperSetup.paperHeight : 1);
                    } else {
                        heightNum.option('value', this._paperSetup.paperHeight ? this._paperSetup.paperHeight : 1);
                        widthNum.option('value', this._paperSetup.paperWidth ? this._paperSetup.paperWidth : 1);
                    }
                } else {
                    var dimension = this._getPaperSize(this._paperName);
                    if (this._paperOrientation == "Landscape") {
                        heightNum.option('value', dimension.width.toFixed(2));
                        widthNum.option('value', dimension.height.toFixed(2));
                        landscape.model.checked = true;
                    } else {
                        heightNum.option('value', dimension.height.toFixed(2));
                        widthNum.option('value', dimension.width.toFixed(2));
                        portrait.model.checked = true;
                    }
                }
                marginTop.option('value', this._paperSetup.MarginTop);
                marginRight.option('value', this._paperSetup.MarginRight);
                marginBottom.option('value', this._paperSetup.MarginBottom);
                marginLeft.option('value', this._paperSetup.MarginLeft);
            }
            else {
                var jsonheight = this._paperSetup.paperHeight;
                var jsonwidth = this._paperSetup.paperWidth;
                marginTop.option('value', this._paperSetup.MarginTop);
                marginRight.option('value', this._paperSetup.MarginRight);
                marginBottom.option('value', this._paperSetup.MarginBottom);
                marginLeft.option('value', this._paperSetup.MarginLeft);

                heightNum.option('value', jsonheight ? jsonheight : 1);
                widthNum.option('value', jsonwidth ? jsonwidth : 1);

                this._paperName = "Custom";
            }
        },

        _orientationChanged: function (event) {
            var heightNum = $('#' + this._id + '_paperHeight').data('ejNumericTextbox');
            var widthNum = $('#' + this._id + '_paperWidth').data('ejNumericTextbox');
            var marginLeft = $('#' + this._id + '_paperMarginLeft').data('ejNumericTextbox');
            var marginTop = $('#' + this._id + '_paperMarginTop').data('ejNumericTextbox');
            var marginRight = $('#' + this._id + '_paperMarginRight').data('ejNumericTextbox');
            var marginBottom = $('#' + this._id + '_paperMarginBottom').data('ejNumericTextbox');
            if (heightNum && widthNum) {
                var height = heightNum.getValue();
                var width = widthNum.getValue();
                heightNum.option('value', width);
                widthNum.option('value', height);

                if (event.model.id == this._id + '_landscape' && event.model.checked == true) {
                    var temp1 = marginLeft.getValue();
                    marginLeft.option('value', marginTop.getValue());
                    var temp2 = marginBottom.getValue();
                    marginBottom.option('value', temp1);
                    temp1 = marginRight.getValue();
                    marginRight.option('value', temp2);
                    marginTop.option('value', temp1);
                }
                else {
                    var temp1 = marginRight.getValue();
                    marginRight.option('value', marginTop.getValue());
                    var temp2 = marginBottom.getValue();
                    marginBottom.option('value', temp1);
                    temp1 = marginLeft.getValue();
                    marginLeft.option('value', temp2);
                    marginTop.option('value', temp1);
                }
            }
        },

        _setUpChange: function (event) {
            var paperType = event.value;
            var initVal = 0;
            var heightNum = $('#' + this._id + '_paperHeight').data('ejNumericTextbox');
            var widthNum = $('#' + this._id + '_paperWidth').data('ejNumericTextbox');
            var marginLeft = $('#' + this._id + '_paperMarginLeft').data('ejNumericTextbox');
            var marginTop = $('#' + this._id + '_paperMarginTop').data('ejNumericTextbox');
            var marginRight = $('#' + this._id + '_paperMarginRight').data('ejNumericTextbox');
            var marginBottom = $('#' + this._id + '_paperMarginBottom').data('ejNumericTextbox');
            var paperSize = this._getPaperSize(paperType);
            heightNum.option('value', paperSize.height);
            widthNum.option('value', paperSize.width);
            if (!marginTop.getValue()) {
                marginTop.option('value', initVal.toFixed(2));
            }
            if (!marginRight.getValue()) {
                marginRight.option('value', initVal.toFixed(2));
            }
            if (!marginBottom.getValue()) {
                marginBottom.option('value', initVal.toFixed(2));
            }
            if (!marginLeft.getValue()) {
                marginLeft.option('value', initVal.toFixed(2));
            }
            if (paperType == "Custom") {
                heightNum.enable();
                widthNum.enable();
            } else {
                heightNum.disable();
                widthNum.disable();
            }
        },

        _getPaperName: function (width, height) {
            if (width == 11.70 && height == 16.50) {
                return "A3";
            } else if (width == 8.27 && height == 11.69) {
                return "A4";
            } else if (width == 10.12 && height == 14.33) {
                return "B4(JIS)";
            } else if (width == 7.17 && height == 10.12) {
                return "B5(JIS)";
            } else if (width == 4.13 && height == 9.50) {
                return "Envelope #10";
            } else if (width == 3.88 && height == 7.50) {
                return "Envelope Monarch";
            } else if (width == 7.25 && height == 10.50) {
                return "Executive";
            } else if (width == 8.50 && height == 14.00) {
                return "Legal";
            } else if (width == 8.50 && height == 11.00) {
                return "Letter";
            } else if (width == 11.00 && height == 17.00) {
                return "Tabloid";
            } else {
                return "Custom";
            }
        },

        _getPaperSize: function (paperType) {
            var paperSize = {};
            var height;
            var width;
            switch (paperType) {
                case "A3":
                    width = 11.70;
                    height = 16.50;
                    break;
                case "A4":
                    width = 8.27;
                    height = 11.69;
                    break;
                case "B4(JIS)":
                    width = 10.12;
                    height = 14.33;
                    break;
                case "B5(JIS)":
                    width = 7.17;
                    height = 10.12;
                    break;
                case "Envelope #10":
                    width = 4.13;
                    height = 9.50;
                    break;
                case "Envelope Monarch":
                    width = 3.88;
                    height = 7.50;
                    break;
                case "Executive":
                    width = 7.25;
                    height = 10.50;
                    break;
                case "Legal":
                    width = 8.50;
                    height = 14.00;
                    break;
                case "Letter":
                    width = 8.50;
                    height = 11.00;
                    break;
                case "Tabloid":
                    width = 11.00;
                    height = 17.00;
                    break;
                case "Custom":
                    height = $('#' + this._id + '_paperHeight').data('ejNumericTextbox').getValue();
                    width = $('#' + this._id + '_paperWidth').data('ejNumericTextbox').getValue();
                    break;
            }
            paperSize.height = height;
            paperSize.width = width;
            return paperSize;
        },

        _pageSetupSubmit: function () {
            var _paperHeight = $('#' + this._id + '_paperHeight').data('ejNumericTextbox').getValue();
            var _paperWidth = $('#' + this._id + '_paperWidth').data('ejNumericTextbox').getValue();
            var _paperMarginTop = $('#' + this._id + '_paperMarginTop').data('ejNumericTextbox').getValue();
            var _paperMarginRight = $('#' + this._id + '_paperMarginRight').data('ejNumericTextbox').getValue();
            var _paperMarginBottom = $('#' + this._id + '_paperMarginBottom').data('ejNumericTextbox').getValue();
            var _paperMarginLeft = $('#' + this._id + '_paperMarginLeft').data('ejNumericTextbox').getValue();

            this._paperSetup.paperHeight = (!ej.isNullOrUndefined(_paperHeight) ? _paperHeight : null);
            this._paperSetup.paperWidth = (!ej.isNullOrUndefined(_paperWidth) ? _paperWidth : null);
            this._paperSetup.MarginTop = (!ej.isNullOrUndefined(_paperMarginTop) ? _paperMarginTop : null);
            this._paperSetup.MarginRight = (!ej.isNullOrUndefined(_paperMarginRight) ? _paperMarginRight : null);
            this._paperSetup.MarginBottom = (!ej.isNullOrUndefined(_paperMarginBottom) ? _paperMarginBottom : null);
            this._paperSetup.MarginLeft = (!ej.isNullOrUndefined(_paperMarginLeft) ? _paperMarginLeft : null);
            var paperSizeDDl = $('#' + this._id + '_PaperSize').data('ejDropDownList');
            this._paperName = paperSizeDDl.model.value;

            if ($('#' + this._id + '_portrait').attr('checked') == 'checked') {
                this._paperOrientation = "Portrait";
            } else {
                this._paperOrientation = "Landscape";
            }

            this._pageSetup = true;

            if ($('#' + this._id + '_ejtb_preview').hasClass('e-active')) {
                if (!ej.isNullOrUndefined(this._paperSetup.paperWidth) && !ej.isNullOrUndefined(this._paperSetup.paperHeight)) {
                    this._updatePreviewLayout(!this._id._printMode, true);
                }
            }

            $('#' + this._id + '_printPageSetup').ejDialog('close');
        },

        _pageSetupCancel: function (events) {
            var ejDialog = $('#' + this._id + '_printPageSetup').ejDialog('close');
        },

        //-------------------- Print Page Setup [End] -------------------------------//


        //-------------------- FitToPage[start] -------------------------//
        _showFittoPage: function (enable) {
            if (enable) {
                $('#' + this._id + '_ejtb_fittopage').parents("li.e-reportviewer-toolbarli").css("display", "block");
            } else {
                $('#' + this._id + '_ejtb_fittopage').parents("li.e-reportviewer-toolbarli").css("display", "none");
            }
        },

        _resetPage: function () {
            var pageContainerWidth = null, pageContainerHeight = null;

            var pagecontainer = $('#' + this._id + '_pageviewContainer');
            var pageViewline = $('#' + this._id + '_pageviewOuterline');
            pageViewline.css({ "width": pagecontainer.width(), "height": pagecontainer.height() });
            this._applyPageTransform(pagecontainer,this._preZoomVal, this._preZoomVal);

            if (this._browserInfo.name == 'msie' && this._browserInfo.version == 8) {
                pageContainerWidth = pagecontainer[0].getBoundingClientRect().right;
                pageContainerHeight = pagecontainer[0].getBoundingClientRect().bottom;
            }
            else {
                pageContainerWidth = pagecontainer[0].getBoundingClientRect().width;
                pageContainerHeight = pagecontainer[0].getBoundingClientRect().height;
            }
            pageViewline.css({ "width": pageContainerWidth, "height": pageContainerHeight });
        },

        _fitToPage: function (fitType) {
            var pageContainerWidth = null, pageContainerHeight = null;
            this._resetPage();
            var pageViewerContainer = $('#' + this._id + '_viewerContainer');
            var pagecontainer = $('#' + this._id + '_pageviewContainer');
            var pageViewline = $('#' + this._id + '_pageviewOuterline');
            var w = pageViewerContainer.width();
            var h = pageViewerContainer.height();
            var pageW = pageViewline.width();
            var pageH = pageViewline.height();
            var scaleX = 1;
            var scaleY = 1;

            if (this._browserInfo.name == 'msie' && this._browserInfo.version == 8) {
                pageContainerWidth = pagecontainer[0].getBoundingClientRect().right;
                pageContainerHeight = pagecontainer[0].getBoundingClientRect().bottom;
            }
            else {
                pageContainerWidth = pagecontainer[0].getBoundingClientRect().width;
                pageContainerHeight = pagecontainer[0].getBoundingClientRect().height;
            }

            if (fitType == "fitToPage") {
                scaleX = (w - 40) / pageW * this._preZoomVal;
                scaleY = (h - 40) / pageH * this._preZoomVal;
                if (h > pageH) {
                    scaleY = this._preZoomVal;
                }

                if (w > pageW) {
                    scaleX = this._preZoomVal;
                }

                this._applyPageTransform(pagecontainer,scaleX , scaleY , fitType);
                pageViewline.css({ "width": pageContainerWidth, "height": pageContainerHeight });
            } else if (fitType == "wholepage") {
                if (h < pageH) {
                    scaleY = (h - 40) / pageH * this._preZoomVal;
                    this._applyPageTransform(pagecontainer,this._preZoomVal , scaleY , fitType);
                    scaleX = this._preZoomVal;
                    pageViewline.css({ "width": pageContainerWidth, "height": pageContainerHeight });
                }
            } else if (fitType == "fitToWidth") {
                if (w < pageW) {
                    scaleX = (w - 40) / pageW * this._preZoomVal;
                     this._applyPageTransform(pagecontainer, scaleX,this._preZoomVal, fitType);
                    scaleY = this._preZoomVal;
                    pageViewline.css({ "width": pageContainerWidth, "height": pageContainerHeight });
                }
            }
            return { scalX: scaleX, scalY: scaleY }
        },

        _selectDropDownIndex: function (index) {
            var _selectedObj = $($('#' + this._id + '_toolbar_zoomSelection_popup li')[index]);
            _selectedObj.addClass('e-active');
            $('#' + this._id + '_toolbar_zoomSelection_input').val(_selectedObj.text());
        },

        _applyDropDownVal: function (scaleXY, orientationX, isFittoPage) {
            if (isFittoPage) {
                var _maxScale = scaleXY.scalX > scaleXY.scalY ? scaleXY.scalY : scaleXY.scalX;
                $('#' + this._id + '_toolbar_zoomSelection_input').val(Math.round((_maxScale * 100)) + "%");
                $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
            }
            else if (orientationX) {
                $('#' + this._id + '_toolbar_zoomSelection_input').val(Math.round((scaleXY.scalX * 100)) + "%");
                $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
            } else {
                $('#' + this._id + '_toolbar_zoomSelection_input').val(Math.round((scaleXY.scalY * 100)) + "%");
                $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
            }
        },

        _pageFitMenuClick: function (event) {
            var pagefitTxt;
            if ($(event.target).hasClass('e-reportviewer-icon')) {
                pagefitTxt = $(event.target).attr('fitType');
            } else {
                pagefitTxt = (event.target).className;
            }
            if (pagefitTxt) {
                var _anchorWidth = $('#' + this._id + '_pageWidth');
                var spanWidth = _anchorWidth.find('span.e-reportviewer-icon');
                var _anchorHeight = $('#' + this._id + '_pageHeight');
                var spanHeight = _anchorHeight.find('span.e-reportviewer-icon');
                var pageViewerContainer = $('#' + this._id + '_viewerContainer');
                var pageViewline = $('#' + this._id + '_pageviewOuterline');
                var viewContainer = $('#' + this._id + '_pageviewContainer')
                var w = pageViewerContainer.width();
                var h = pageViewerContainer.height();
                var pageW = pageViewline.width();
                var pageH = pageViewline.height();
                var previousPageWidth = viewContainer.width();
                var zoomddl = $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList');
                var _scaleXY;
                var _pageFitType = pagefitTxt;

                switch (_pageFitType) {
                    case "FITTOPAGE":
                        _scaleXY = this._fitToPage("fitToPage");
                        this._applyDropDownVal(_scaleXY, false, true);
                        break;
                    case "PAGEWIDTH":
                    case 'e-reportviewer-popupli e-fitpagewidth':
                        if (_anchorWidth.attr('isSelect') == 'true') {
                            if (_anchorHeight.attr('isSelect') == 'true') {
                                _scaleXY = this._fitToPage("fitToPage");
                                this._applyDropDownVal(_scaleXY, false, true);
                            } else {
                                this._resetPage();
                                this._selectDropDownIndex(this._zoomLevel);
                            }
                            spanWidth.removeClass('e-reportviewer-pagefittopage');
                            spanWidth.addClass('e-reportviewer-emptyconetent');
                            _anchorWidth.attr('isSelect', 'false');
                        } else {
                            if (w > pageW) {
                                if (_anchorHeight.attr('isSelect') == 'true' && pageW != previousPageWidth) {
                                    _scaleXY = this._fitToPage("fitToWidth");
                                    this._applyDropDownVal(_scaleXY, true, false);
                                    _anchorWidth.attr('isSelect', 'true');
                                    spanWidth.addClass('e-reportviewer-pagefittopage');
                                    spanWidth.removeClass('e-reportviewer-emptyconetent');
                                    spanHeight.addClass('e-reportviewer-emptyconetent');
                                    spanHeight.removeClass('e-reportviewer-pagefittopage');
                                    _anchorHeight.attr('isSelect', 'false');
                                }
                                return;
                            }
                            if (_anchorHeight.attr('isSelect') == 'true') {
                                _scaleXY = this._fitToPage("fitToPage");
                                this._applyDropDownVal(_scaleXY, false, true);
                            } else {
                                _scaleXY = this._fitToPage("fitToWidth");
                                this._applyDropDownVal(_scaleXY, true, false);
                            }
                            _anchorWidth.attr('isSelect', 'true');
                            spanWidth.addClass('e-reportviewer-pagefittopage');
                            spanWidth.removeClass('e-reportviewer-emptyconetent');
                        }
                        break;
                    case "WHOLEPAGE":
                    case 'e-reportviewer-popupli e-fitpageheight':
                        if (_anchorHeight.attr('isSelect') == 'true') {
                            if (_anchorWidth.attr('isSelect') == 'true') {
                                _scaleXY = this._fitToPage("fitToWidth");
                                this._applyDropDownVal(_scaleXY, true, false);
                            } else {
                                this._resetPage();
                                this._selectDropDownIndex(this._zoomLevel);
                            }
                            spanHeight.addClass('e-reportviewer-emptyconetent');
                            spanHeight.removeClass('e-reportviewer-pagefittopage');
                            _anchorHeight.attr('isSelect', 'false');
                        } else {
                            if (h > pageH) {
                                return;
                            }
                            _scaleXY = this._fitToPage("fitToPage");
                            this._applyDropDownVal(_scaleXY, false, true);
                            spanHeight.addClass('e-reportviewer-pagefittopage');
                            spanHeight.removeClass('e-reportviewer-emptyconetent');
                            _anchorHeight.attr('isSelect', 'true');
                            spanWidth.removeClass('e-reportviewer-pagefittopage');
                            spanWidth.addClass('e-reportviewer-emptyconetent');
                            _anchorWidth.attr('isSelect', 'false');
                        }
                        break;
                }
                $('#' + this._id + '_toolbar_fittoPagePopup').hide();
            }
        },

        _showFitToPagetip: function () {
            var fittoPage = $('#' + this._id + '_toolbar_fittoPagePopup');
            if (!(fittoPage.length > 0)) {
                fittoPage = this._renderPageFitPopup();
                $('body').append(fittoPage);
                this._on($('#' + this._id + '_toolbar_fittoPagePopup li.e-reportviewer-popupli'), "click", this._pageFitMenuClick);
            }

            if (fittoPage.css('display') == 'block') {
                fittoPage.css('display', 'none');
            } else {
                fittoPage.css('display', 'block');
                this._renderFitopagePopup();
            }

            var exportTagHeight = $('#' + this._id + '_toolbarContainer .e-reportviewer-pagefit').height();
            var expTagPos = $($('#' + this._id + '_toolbarContainer .e-reportviewer-pagefit')[0]).offset();
            fittoPage.css({ 'top': (expTagPos.top + exportTagHeight) - 3, 'left': (expTagPos.left - 5) });
        },
        //-------------------- FitToPage[end] -------------------------//

        //-------------------- Page Zoom[start] -------------------------//
        _zoomValChange: function (sender) {
            var ejViewer = $(this.element).closest(".e-reportviewer");
            var ejViewerInstance = ejViewer.ejReportViewer("instance");
            var zoomVal = parseInt(sender.value) / 100;
            ejViewerInstance._zoomLevel = sender.itemId;
            ejViewerInstance._zoomContainer(zoomVal, false);
        },

        _zoomIn: function () {
            if (this._zoomLevel >= 6) {
                this._zoomLevel = 6;
            } else {
                this._zoomLevel++;
            }
            if (this._isDevice) {
                this._mobileLayoutZoomChange();
            } else {
                var zoomddl = $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList');
                zoomddl.selectItemsByIndices(this._zoomLevel);
            }
        },

        _zoomOut: function () {
            if (this._zoomLevel <= 0) {
                this._zoomLevel = 0;
            } else {
                this._zoomLevel--;
            }
            if (this._isDevice) {
                this._mobileLayoutZoomChange();
            } else {
                var zoomddl = $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList');
                zoomddl.selectItemsByIndices(this._zoomLevel);
            }
        },

        _mobileLayoutZoomChange: function () {
            var _zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 2, 4];
            this._zoomContainer(_zoomLevels[this._zoomLevel], false);
        },

        _zoomInContainer: function (isFactor, scaleFactor) {
            var zoomFactor = scaleFactor;
            var pageViewerContainer = $('#' + this._id + '_viewerContainer');
            var pagecontainer = $('#' + this._id + '_pageviewContainer');
            var pageViewline = $('#' + this._id + '_pageviewOuterline');
            if (isFactor) {
                this._zoomVal = this._zoomVal + zoomFactor;
            }
            var w = pagecontainer.width();
            var h = pagecontainer.height();
            if (this.model.printMode) {
                w = w + (this._pageModel.MarginLeft + this._pageModel.MarginRight);
                h = h + (this._pageModel.MarginTop + this._pageModel.MarginBottom);
            }

            this._applyPageTransform(pagecontainer, this._zoomVal , this._zoomVal);
            pageViewline.css({ "width": w * this._zoomVal, "height": h * this._zoomVal });

            if (!this.model.printMode) {
                if (pageViewerContainer.width() < pageViewline.outerWidth()) {
                    pageViewerContainer.scrollLeft(this._originX + (((w + 10) * zoomFactor) / 2));
                }

                if (pageViewerContainer.height() < pageViewline.outerHeight()) {
                    pageViewerContainer.scrollTop(this._originY + (((h + 10) * zoomFactor) / 2));
                }
            }
        },

        _zoomOutContainer: function (isFactor, scaleFactor) {
            var zoomFactor = scaleFactor;
            var pageViewerContainer = $('#' + this._id + '_viewerContainer');
            var pagecontainer = $('#' + this._id + '_pageviewContainer');
            var pageViewline = $('#' + this._id + '_pageviewOuterline');
            if (isFactor) {
                this._zoomVal = this._zoomVal - zoomFactor;
            }
            var w = pagecontainer.width();
            var h = pagecontainer.height();
            this._applyPageTransform(pagecontainer, this._zoomVal , this._zoomVal);
            pageViewline.css({ "width": w * this._zoomVal, "height": h * this._zoomVal });

            if (pageViewerContainer.width() < pageViewline.outerWidth()) {
                pageViewerContainer.scrollLeft(this._originX - (((w + 10) * zoomFactor) / 2));
            }

            if (pageViewerContainer.height() < pageViewline.outerHeight()) {
                pageViewerContainer.scrollTop(this._originY - (((h + 10) * zoomFactor) / 2));
            }
        },

        _applyPageTransform: function (targetTag, transformX, transformY, fittype) {
            var transform = "scale(" + transformX + "," + transformY + ")";
            if (this._browserInfo.name == 'msie') {
				if (this._browserInfo.version == "8.0") {
					 targetTag.css({ 'zoom': transformX })
				}
				else {
						 targetTag.css({ '-ms-transform': transform, '-ms-transform-origin': '0 0' });
				}
                this._setZoomScrollerIE();
                var scrollContainer = $('#' + this._id + '_viewerContainer');
                switch (fittype) {
                    case 'fitToPage':
                        scrollContainer.css({ "overflow-x": "hidden", "overflow-y": "hidden" });
                        break;
                    case 'wholepage':
                        scrollContainer.css({ "overflow-y": "hidden" });
                        break;
                    case 'fitToWidth':
                        scrollContainer.css({ "overflow-x": "hidden" });
                        break;
                }
            } else if (this._browserInfo.name == 'opera') {
                targetTag.css({ '-o-transform': transform, '-o-transform-origin': '0 0' });
            }
            else if (this._browserInfo.name == 'mozilla') {
                if (this._browserInfo.version == '11.0') {
                    targetTag.css({ 'transform': transform, 'transform-origin': '0 0' });
                } else {
                    targetTag.css({ '-moz-transform': transform, '-moz-transform-origin': '0 0' });
                }
            } else if (this._browserInfo.name == 'webkit' || this._browserInfo.name == 'chrome') {
                targetTag.css({ '-webkit-transform': transform, '-webkit-transform-origin': '0 0' });
            }
        },

        _zoomContainer: function (zoomfactor, isMode) {
            this._zoomVal = zoomfactor;
            var _anchorWidth = $('#' + this._id + '_pageWidth');
            var _anchorHeight = $('#' + this._id + '_pageHeight');
            var spanWidth = _anchorWidth.find('span.e-reportviewer-icon');
            var spanHeight = _anchorHeight.find('span.e-reportviewer-icon');
            if (_anchorWidth.attr('isSelect') == 'true' || _anchorHeight.attr('isSelect') == 'true') {
                this._resetPage();
            }
            if (spanWidth) {
                spanWidth.removeClass('e-reportviewer-pagefittopage');
                spanWidth.addClass('e-reportviewer-emptyconetent');
            }
            if (spanHeight) {
                spanHeight.addClass('e-reportviewer-emptyconetent');
                spanHeight.removeClass('e-reportviewer-pagefittopage');
            }

            var scalefactor = Math.abs(this._preZoomVal - zoomfactor);
            if (scalefactor == 0) return false;
            if (this._preZoomVal > zoomfactor) {
                this._zoomOutContainer(isMode, scalefactor);
            } else {
                this._zoomInContainer(isMode, scalefactor);
            }
            this._preZoomVal = zoomfactor;
        },

        _setZoomScrollerIE: function (zoomfact) {
            if (this._browserInfo.name == 'msie') {
                if (this._pageModel && this._pageModel.PageData && this._pageModel.PageData.length > 0) {
                    var scrollContainer = $('#' + this._id + '_viewerContainer');
                    var pagdata = this._pageModel.PageData[0];
                    var pageHeight = pagdata.Height;
                    var pageWidth = pagdata.Width;

                    var headerHeight = pagdata.HeaderHeight;
                    var footerHeight = pagdata.FooterHeight;

                    var totalpageHeight = pageHeight + headerHeight + footerHeight;

                    var height = scrollContainer.height();
                    var width = scrollContainer.width();

                    totalpageHeight = totalpageHeight * zoomfact;
                    pageWidth = pageWidth * zoomfact;

                    scrollContainer.css({ "overflow": "hidden" });
                    scrollContainer.css({ "overflow-x": "Auto" });
                    scrollContainer.css({ "overflow-y": "Auto" });

                    if (totalpageHeight < height && pageWidth < width) {
                        scrollContainer.css({ "overflow-x": "hidden" });
                        scrollContainer.css({ "overflow-y": "hidden" });
                    } else if (pageWidth < width) {
                        scrollContainer.css({ "overflow-x": "hidden" });
                    } else if (totalpageHeight < height) {
                        scrollContainer.css({ "overflow-y": "hidden" });
                    }
                }
            }
        },

        _showZoomControl: function (enable) {
            if (enable) {
                $('#' + this._id + '_toolbar_zoomin').parents("li.e-reportviewer-toolbarli").css("display", "block");
                $('#' + this._id + '_toolbar_zoomout').parents("li.e-reportviewer-toolbarli").css("display", "block");
                $('#' + this._id + '_toolbar_zoomSelection').parents("div.e-reportviewer-ejdropdownlist").css("display", "block");
            }
            else {
                $('#' + this._id + '_toolbar_zoomin').parents("li.e-reportviewer-toolbarli").css("display", "none");
                $('#' + this._id + '_toolbar_zoomout').parents("li.e-reportviewer-toolbarli").css("display", "none");
                $('#' + this._id + '_toolbar_zoomSelection').parents("div.e-reportviewer-ejdropdownlist").css("display", "none");
            }
        },
        //-------------------- Page Zoom[end] -------------------------//

        //-------------------- Refresh Report[Start] -------------------------//
        _refreshReport: function () {
            this._refresh = true;
            this._dataRefresh = true;
            this._unwireEvents();
            this._initViewer();
            this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getDataSourceCredential, 'dataSourceCredentials': this.model.dataSourceCredentials, 'dataSources': this.model.dataSources, 'parameters': this.model.parameters }), "_getDataSourceCredential");
        },

        _showRefreshButton: function (enable) {
            if (enable) {
                $('#' + this._id + '_toolbar_refresh').parent().css("display", "block");
            }
            else {
                $('#' + this._id + '_toolbar_refresh').parent().css("display", "none");
            }
        },
        //-------------------- Refresh Report[End] -------------------------//

        //-------------------- Toolbar Actions[Start] -------------------------//
        _wireEvents: function () {
            if (!this.model.toolbarSettings.templateId) {
                this._on($('#' + this._id + '_txtpageNo'), "keypress", this._onkeyPress);
                this._on($('#' + this._id + '_txtpageNo'), "click ", this._onToolbarItemClick);
                this._on($('#' + this._id + '_zoomSelection'), "change", this._zoomValChange);
                this._on($('#' + this._id + '_toolbar_zoomSelection_container'), "click ", this._onToolbarItemClick);
            }

            this._on($('#' + this._id + '_viewerContainer'), "scroll", this._scrollPage);
            this._on($('#' + this._id + '_pageviewOuterContainer'), "click", this._viewerClick);
            //this._on($('#' + this._id + '_viewerContainer'), "pinchin pinchout swipeleft swiperight", this._pinchAndSwipe);
            this._on($(document), "click", this._onReporClick);


            if (this._isDevice) {
                this._on($('#' + this._id + '_viewerContainer'), "scroll", this._scrollPage);
                this._on($('#' + this._id + '_viewerContainer'), "scrollstop", this._containerScrollStop);
            } else {
                this._on($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-reportviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-reportviewer-tbpage'), "mouseover", this._showIconToolTip);
                this._on($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-reportviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-reportviewer-tbpage'), "mouseout", this._hideIconToolTip);
            }
        },

        _unwireEvents: function () {
            if (!this.model.toolbarSettings.templateId) {
                this._off($('#' + this._id + '_txtpageNo'), "keypress", this._onkeyPress);
                this._off($('#' + this._id + '_txtpageNo'), "click ", this._onToolbarItemClick);
                this._off($('#' + this._id + '_zoomSelection'), "change", this._zoomValChange);
                this._off($('#' + this._id + '_toolbar_zoomSelection_container'), "click ", this._onToolbarItemClick);
            }

            this._off($('#' + this._id + '_viewerContainer'), "scroll", this._scrollPage);
            this._off($('#' + this._id + '_pageviewOuterContainer'), "click", this._viewerClick);
            //this._off($('#' + this._id + '_viewerContainer'), "pinchin pinchout swipeleft swiperight", this._pinchAndSwipe);
            this._off($(document), "click", this._onReporClick);
            this._off($('#' + this._id + '_viewReportClick'), "click", this._viewReportParamsClick);
            this._off($(window), "resize", this._viewerResize);

            if (this._isDevice) {
                this._off($('#' + this._id + '_viewerContainer'), "scroll", this._scrollPage);
                this._off($('#' + this._id + '_viewerContainer'), "scrollstop", this._containerScrollStop);
            } else {
                this._off($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-reportviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-reportviewer-tbpage'), "mouseover", this._showIconToolTip);
                this._off($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-reportviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-reportviewer-tbpage'), "mouseout", this._hideIconToolTip);
            }
        },

        _onReporClick: function (event) {
            if (!($(event.target).hasClass('e-reportviewer-export') || $($(event.target).children()).hasClass('e-reportviewer-export'))) {
                $('#' + this._id + '_toolbar_exportListTip').css('display', 'none');
            } else {
                if ($('#' + this._id + '_toolbar_exportListTip').css('display') != "block") {
                    $('#' + this._id + '_toolbar_exportListTip').css('display', 'none');
                }
            }

            if (!($(event.target).hasClass('e-reportviewer-pagefit') || $($(event.target).children()).hasClass('e-reportviewer-pagefit'))) {
                $('#' + this._id + '_toolbar_fittoPagePopup').css('display', 'none');
            } else {
                if ($('#' + this._id + '_toolbar_fittoPagePopup').css('display') != "block") {
                    $('#' + this._id + '_toolbar_fittoPagePopup').css('display', 'none');
                }
            }
        },

        _onToolbarItemClick: function (event) {
            $('#' + this._id + '_rptTooltip').css('display', 'none');
        },

        _toolbarClick: function (event) {
            var targetItem = event.target
            var clickedItem = event.target;
            if (this._isToolbarClick) {
                if (this._isPageDialogOpened()) {
                    return;
                }

                $('#' + this._id + '_rptTooltip').css('display', 'none');
                if ($(clickedItem).hasClass('e-reportviewer-toolbarli')) {
                    clickedItem = $(clickedItem).find('span');
                }
                if ($(clickedItem).hasClass("e-reportviewer-print")) {
                    this._print();
                }
                else if ($(clickedItem).hasClass("e-reportviewer-export")) {
                    this._showTooltip();
                }
                else if ($(clickedItem).hasClass("e-reportviewer-pagesetup")) {
                    this._showPrintPageSetup();
                }
                else if ($(clickedItem).hasClass("e-reportviewer-gotofirst") && !($(clickedItem).hasClass("e-reportviewer-disabled"))) {
                    this._gotoFirstPage();
                }
                else if ($(clickedItem).hasClass("e-reportviewer-gotolast") && !($(clickedItem).hasClass("e-reportviewer-disabled"))) {
                    this._gotoLastPage();
                }
                else if ($(clickedItem).hasClass("e-reportviewer-gotonext") && !($(clickedItem).hasClass("e-reportviewer-disabled"))) {
                    this._gotoNextPage();
                }
                else if ($(clickedItem).hasClass("e-reportviewer-gotoprevious") && !($(clickedItem).hasClass("e-reportviewer-disabled"))) {
                    this._gotoPreviousPage();
                }
                else if ($(clickedItem).hasClass("e-reportviewer-gotoparent")) {
                    this._gotoParentReport();
                }
                else if ($(clickedItem).hasClass("e-reportviewer-documentmap") && !this._printMode) {
                    this._documentMapClick();
                }
                else if ($(clickedItem).hasClass("e-reportviewer-zoomin")) {
                    this._zoomIn();
                }
                else if ($(clickedItem).hasClass("e-reportviewer-zoomout")) {
                    this._zoomOut();
                }
                else if ($(clickedItem).hasClass("e-reportviewer-pagefit")) {
                    this._showFitToPagetip();
                }
                else if ($(clickedItem).hasClass("e-reportviewer-preview")) {
                    this._printlayout();
                }
                else if ($(clickedItem).hasClass("e-reportviewer-refresh")) {
                    this._refreshReport();
                }
                else if ($(clickedItem).hasClass("e-reportviewer-parameter")) {
                    this._toggleParameterBlock();
                }
            }
        },

        _showToolbar: function (enableToolbar) {
            if (enableToolbar) {
                $('#' + this._id + '_toolbarContainer').css("display", "block");
            }
            else {
                $('#' + this._id + '_toolbarContainer').css("display", "none");
            }
        },

        _initToolbar: function () {
            this._isToolbarClick = false;

            if (!this.model.toolbarSettings.templateId) {
                if (!this._isDevice) {
                    var zoomddl = $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList');
                    if (this._refresh) {
                        zoomddl.selectItemsByIndices(zoomddl.model.selectedIndex);
                    } else {
                        zoomddl.selectItemsByIndices(2);
                    }
                    zoomddl.disable();

                    $('#' + this._id + '_txtpageNo').attr('disabled', 'disabled');

                    $('#' + this._id + '_toolbarContainer .e-reportviewer-gotofirst').addClass('e-reportviewer-disabled');
                    $('#' + this._id + '_toolbarContainer .e-reportviewer-gotoprevious').addClass('e-reportviewer-disabled');
                    $('#' + this._id + '_toolbarContainer .e-reportviewer-gotonext').addClass('e-reportviewer-disabled');
                    $('#' + this._id + '_toolbarContainer .e-reportviewer-gotolast').addClass('e-reportviewer-disabled');
                }
            }
        },

        _enableToolbarItems: function () {
            this._isToolbarClick = true;
            if (!this.model.toolbarSettings.templateId) {
                if (!this._isDevice) {
                    $('#' + this._id + '_txtpageNo').removeAttr('disabled');
                    $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList').enable();
                }
            }
        },

        _enableToolbarContents: function (enable) {
            if (enable) {
                $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList').enable();
                $('#' + this._id + '_txtpageNo').attr('readonly', false);
            } else {
                $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList').disable();
                $('#' + this._id + '_txtpageNo').attr('readonly', true);
            }
        },

        //-------------------- Toolbar Actions[End] -------------------------//

        //-------------------- Tooltip Localization Actions[Start]------------------------//
        _showIconToolTip: function (event) {
            if ($('#' + this._id + '_rptTooltip').css('display') == 'none') {
                this._showTooltipContent(event);
            }
        },

        _hideIconToolTip: function () {
            $('#' + this._id + '_rptTooltip').css('display', 'none');
        },

        _viewpopupBlockNone: function (jqueryEement) {
            if (ej.isNullOrUndefined(jqueryEement) || jqueryEement.length == 0 || jqueryEement.css('display') != 'block') {
                return false;
            }
            return true;
        },

        _isPageDialogOpened: function () {
            var _ejPageDialog = $('#' + this._id + '_printPageSetup').data("ejDialog");
            if (!ej.isNullOrUndefined(_ejPageDialog) && _ejPageDialog.isOpen()) {
                return true;
            }
            return false;
        },

        _showTooltipContent: function (event) {
            var currentToolbarItem = event.target;
            if (this.model.toolbarSettings.showTooltip && !this._isDevice) {
                var TagPos;
                var toolTipText;
                var isShowTooltip = true;
                if ($(currentToolbarItem).hasClass('e-reportviewer-toolbarli')) {
                    currentToolbarItem = $(currentToolbarItem).find('span');
                }

                if (this._viewpopupBlockNone($('#' + this._id + '_toolbar_fittoPagePopup')) || this._viewpopupBlockNone($('#' + this._id + '_toolbar_exportListTip')) || this._isPageDialogOpened()) {
                    isShowTooltip = false;
                }

                if ($(currentToolbarItem).hasClass("e-reportviewer-print")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-print')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('print');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-export")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-export')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('export');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-gotofirst")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-gotofirst')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('first');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-gotolast")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-gotolast')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('last');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-gotonext")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-gotonext')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('next');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-gotoprevious")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-gotoprevious')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('previous');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-documentmap")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-documentmap')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('documentmap');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-zoomin")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-zoomin')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('zoomin');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-zoomout")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-zoomout')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('zoomout');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-preview")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-preview')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('preview');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-refresh")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-refresh')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('refresh');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-parameter")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-parameter')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('parameter');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-gotoparent")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-gotoparent')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('back');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-tbpage") || $(currentToolbarItem).hasClass("e-reportviewer-pagenumber") || $(currentToolbarItem).hasClass("e-reportviewer-labelpageno")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-tbpage')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('pageIndex');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-ejdropdownlist") || $(currentToolbarItem).hasClass("e-dropdownlist") || $(currentToolbarItem).hasClass("e-select") || $(currentToolbarItem).hasClass("e-down-arrow")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-ejdropdownlist')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('zoom');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-pagefit")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-pagefit')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('fittopage');
                }
                else if ($(currentToolbarItem).hasClass("e-reportviewer-pagesetup")) {
                    TagPos = $('#' + this._id + '_toolbarContainer .e-reportviewer-pagesetup')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('pagesetup');
                }

                if (toolTipText && isShowTooltip) {
                    $('#' + this._id + '_rptTooltip_Header').html(toolTipText.header);
                    $('#' + this._id + '_rptTooltip_Content').html(toolTipText.content);
                    $('#' + this._id + '_rptTooltip').css({ 'top': (TagPos.top + TagPos.height) + 5, 'left': (TagPos.left + (TagPos.width / 2)), 'display': 'block', 'position': 'fixed' });
                }
            }
        },

        _getTootipText: function (tipType) {
            var localeObj = ej.ReportViewer.Locale[this.model.locale] ? ej.ReportViewer.Locale[this.model.locale] : ej.ReportViewer.Locale["en-us"];
            var headerTxt = '';
            var contentTxt = '';
            switch (tipType) {
                case 'print':
                    headerTxt = localeObj['toolbar']['print']['headerText'];
                    contentTxt = localeObj['toolbar']['print']['contentText'];
                    break;
                case 'export':
                    headerTxt = localeObj['toolbar']['exportformat']['headerText'];
                    contentTxt = localeObj['toolbar']['exportformat']['contentText'];
                    break;
                case 'first':
                    headerTxt = localeObj['toolbar']['first']['headerText'];
                    contentTxt = localeObj['toolbar']['first']['contentText'];
                    break;
                case 'previous':
                    headerTxt = localeObj['toolbar']['previous']['headerText'];
                    contentTxt = localeObj['toolbar']['previous']['contentText'];
                    break;
                case 'next':
                    headerTxt = localeObj['toolbar']['next']['headerText'];
                    contentTxt = localeObj['toolbar']['next']['contentText'];
                    break;
                case 'last':
                    headerTxt = localeObj['toolbar']['last']['headerText'];
                    contentTxt = localeObj['toolbar']['last']['contentText'];
                    break;
                case 'zoomin':
                    headerTxt = localeObj['toolbar']['zoomIn']['headerText'];
                    contentTxt = localeObj['toolbar']['zoomIn']['contentText'];
                    break;
                case 'zoomout':
                    headerTxt = localeObj['toolbar']['zoomOut']['headerText'];
                    contentTxt = localeObj['toolbar']['zoomOut']['contentText'];
                    break;
                case 'preview':
                    headerTxt = localeObj['toolbar']['printLayout']['headerText'];
                    contentTxt = localeObj['toolbar']['printLayout']['contentText'];
                    break;
                case 'documentmap':
                    headerTxt = localeObj['toolbar']['documentMap']['headerText'];
                    contentTxt = localeObj['toolbar']['documentMap']['contentText'];
                    break;
                case 'refresh':
                    headerTxt = localeObj['toolbar']['refresh']['headerText'];
                    contentTxt = localeObj['toolbar']['refresh']['contentText'];
                    break;
                case 'parameter':
                    headerTxt = localeObj['toolbar']['parameter']['headerText'];
                    contentTxt = localeObj['toolbar']['parameter']['contentText'];
                    break;
                case 'back':
                    headerTxt = localeObj['toolbar']['back']['headerText'];
                    contentTxt = localeObj['toolbar']['back']['contentText'];
                    break;
                case 'pageIndex':
                    headerTxt = localeObj['toolbar']['pageIndex']['headerText'];
                    contentTxt = localeObj['toolbar']['pageIndex']['contentText'];
                    break;
                case 'zoom':
                    headerTxt = localeObj['toolbar']['zoom']['headerText'];
                    contentTxt = localeObj['toolbar']['zoom']['contentText'];
                    break;
                case 'fittopage':
                    headerTxt = localeObj['toolbar']['fittopage']['headerText'];
                    contentTxt = localeObj['toolbar']['fittopage']['contentText'];
                    break;
                case 'pagesetup':
                    headerTxt = localeObj['toolbar']['pagesetup']['headerText'];
                    contentTxt = localeObj['toolbar']['pagesetup']['contentText'];
                    break;
            }
            return { header: headerTxt, content: contentTxt };
        },
        //-------------------- Tooltip Localization Actions[End]------------------------//

        //-------------------- DrillDown Actions[Start] -------------------------//
        _drillAction: function () {
            if ($._data($('.txtToggle_' + this._id).get(0), 'events') == undefined) {
                this._on($('.txtToggle_' + this._id), "click", this._drillClick);
            }
        },

        _drillClick: function (event) {
            var drillInfo = $(event.currentTarget).data('drillObj');
            if (drillInfo) {
                this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.drillDown, 'pageindex': this._currentPage, 'toggleInfo': drillInfo, 'refresh': false, 'dataRefresh': false, 'pageInit': this._isToolbarClick, 'isPrint': this._printMode }), !this._printMode ? "_getPageModel" : "_getPreviewModel");
            }
        },
        //-------------------- DrillDown Actions[End] -------------------------//

        //-------------------- Sorting Actions[Start] -------------------------//
        _sortingAction: function () {
            if ($._data($('.txtSorting_' + this._id).get(0), 'events') == undefined) {
                this._on($('.txtSorting_' + this._id), "click", this._sortingClick);
            }
        },

        _sortingClick: function (event) {
            var sortingInfo = $(event.currentTarget).data('sortingObj');
            if (sortingInfo) {
                this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.sorting, 'pageindex': this._currentPage, 'sortingInfo': sortingInfo, 'refresh': false, 'dataRefresh': false, 'pageInit': this._isToolbarClick, 'isPrint': this._printMode }), !this._printMode ? "_getPageModel" : "_getPreviewModel");
            }
        },
        //-------------------- Sorting Actions[End] -------------------------//

        //-------------------- Document Map Actions[Start]----------------------//
        _showDocumentMap: function (enable) {
            if (enable) {
                $('#' + this._id + '_toolbarContainer').find('.e-reportviewer-documentmap').parent().css("display", "block");
            }
            else {
                $('#' + this._id + '_toolbarContainer').find('.e-reportviewer-documentmap').parent().css("display", "none");
            }
        },

        _appendDocumentMapDiv: function () {
            if (this._isDevice) {
                var documentMapDiv = $('#' + this._id + '_documentmapContainer');
                if (documentMapDiv.length == 0) {
                    documentMapDiv = ej.buildTag("div.e-reportviewer-documentmappopup", "", {}, { id: this._id + '_documentmapContainer' });
                    $('body').append(documentMapDiv);
                }
            }
        },

        _selectDocMapToolItem: function (enable) {
            if (!this.model.toolbarSettings.templateId) {
                var _ejToolbar = $('#' + this._id + '_toolbarContainer').data("ejToolbar");
                if (enable) {
                    _ejToolbar.selectItemByID(this._id + '_ejtb_documentmap');
                } else {
                    _ejToolbar.deselectItemByID(this._id + '_ejtb_documentmap');
                }
            }
        },

        _documentMapClick: function () {
            if (!this._isDevice) {
                var ejSplitterCtrl = $('#' + this._id + '_reportviewerContainer').data('ejSplitter');
                if ($(ejSplitterCtrl.panes[0]).hasClass('collapsed')) {
                    this._pageDocMapFlag = true;
                    ejSplitterCtrl.expand(0);
                    this._selectDocMapToolItem(true);
                } else {
                    this._pageDocMapFlag = false;
                    ejSplitterCtrl.collapse(0);
                    this._selectDocMapToolItem(false);
                }
            } else {
                var documentMapDiv = $('#' + this._id + '_documentmapContainer');
                if (documentMapDiv.css('display') == 'block') {
                    this._pageDocMapFlag = true;
                    documentMapDiv.css('display', 'none');
                    this._selectDocMapToolItem(false);
                } else {
                    this._pageDocMapFlag = false;
                    documentMapDiv.css('display', 'block');
                    this._selectDocMapToolItem(true);
                }
            }
        },

        _showDocumentMapContainer: function (enable) {
            if (!this._isDevice) {
                var ejSplitterCtrl = $('#' + this._id + '_reportviewerContainer').data('ejSplitter');
                if (enable) {
                    ejSplitterCtrl.expand(0);
                } else {
                    ejSplitterCtrl.collapse(0);
                }
            } else {
                if (enable) {
                    $('#' + this._id + '_documentmapContainer').css('display', 'block');
                } else {
                    $('#' + this._id + '_documentmapContainer').css('display', 'none');
                }
            }
        },

        _documentMapAction: function () {
            this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.documentMap }), "_documentMapModel");
        },

        _containerSplit: function (jsondocmap) {
            var viewerContainer = $('#' + this._id + '_viewerContainer');
            this._appendDocumentMapDiv();
            jsondocmap = jsondocmap.replace("treeViewID", this._id + '_ejtreeView');
            $('#' + this._id + '_documentmapContainer').css("height", "100%");
            $('#' + this._id + '_documentmapContainer').html(jsondocmap);
            $('#' + this._id + '_ejtreeView').css("display", "none");
            $('#' + this._id + '_ejtreeView').ejTreeView({ height: viewerContainer.height(), nodeSelect: this._pageNavigate });

            if (this._isDevice) {
                $('#' + this._id + '_documentmapContainer').css({ 'position': 'absolute', 'left': viewerContainer.offset().left, 'top': viewerContainer.offset().top, 'height': viewerContainer.height(), 'width': viewerContainer.width() / 6 });
            } else {
                $('#' + this._id + '_reportviewerContainer').ejSplitter({ height: viewerContainer.height() + 1, orientation: ej.Orientation.Horizontal, properties: [{ paneSize: 140 }, {}] });
            }
            $('#' + this._id + '_ejtreeView').css("display", "block");
            this._selectDocMapToolItem(true);
        },

        _pageNavigate: function (args) {
            try {
                var jsondata = JSON.parse($(args.currentElement).attr('id'));
                var ejviewerCtrlId = this._id.replace('_ejtreeView', '');
                var ejReportViewer = $('#' + ejviewerCtrlId).data('ejReportViewer');
                if (ejReportViewer._isDevice) {
                    $('#' + ejviewerCtrlId + '_documentmapContainer').css('display', 'none');
                    this._selectDocMapToolItem(false);
                }
                ejReportViewer._gotoPageNo(jsondata.PageNo);
                $('#' + ejviewerCtrlId + '_viewerContainer').animate({ scrollTop: jsondata.TopPos - 12, scrollLeft: jsondata.LeftPos - 12 }, "600");
            } catch (err) {
            }
        },
        //-------------------- Document Map Actions[End]------------------------//

        //-------------------- DrillThrough Actions[Start]----------------------//
        _showDrillThrough: function (enable) {
            if (enable) {
                $('#' + this._id + '_toolbarContainer').find('.e-reportviewer-gotoparent').parent().css("display", "block");
            }
            else {
                $('#' + this._id + '_toolbarContainer').find('.e-reportviewer-gotoparent').parent().css("display", "none");
            }
        },

        _drillThroughAction: function () {
            if ($._data($('.drillAction_' + this._id).get(0), 'events') == undefined) {
                this._on($('.drillAction_' + this._id), "click", this._drillThroughClick);
            }
        },

        _drillThroughClick: function (event) {
            var drillActionInfo = null;
            var proxy = null;
            if (this.pluginName == 'ejChart') {
                proxy = $('#' + this.ejreportid).data('ejReportViewer');
                $('#' + this._id + '_svg_TrackToolTip').css('display', 'none');
                var chartActionInfo = $('#' + this._id).data(this._id + 'actionObj_Series' + event.data.region.SeriesIndex);
                if (ej.isNullOrUndefined(chartActionInfo)) {
                    return false;
                }
                drillActionInfo = chartActionInfo[event.data.region.Region.PointIndex];
            } else if (this.pluginName == 'ejMap') {
                proxy = $('#' + this.ejreportid).data('ejReportViewer');
                if (event.originalEvent[0] == null || ej.isNullOrUndefined(event.originalEvent[0].data)) {
                    return;
                }
                drillActionInfo = event.originalEvent[0].data.ShapeActionInfo;
            } else {
                proxy = this;
                drillActionInfo = $(event.currentTarget).data('actionObj');
            }

            if (drillActionInfo) {
                var actionInfo = { actionInfo: $.extend(true, {}, drillActionInfo) };
                var isDrill = proxy._onDrillThrough(actionInfo);
                if (!isDrill) {
                    if (drillActionInfo.Hyperlink) {
                        window.open(drillActionInfo.Hyperlink);
                    } else if (drillActionInfo.ReportName) {
                        var _actionInfo = actionInfo.actionInfo;
                        proxy._childReportAuthentication = proxy._getAuthenticationToken();
                        proxy._showloadingIndicator(true);
                        proxy.doAjaxPost("POST", proxy._actionUrl, JSON.stringify({ 'reportAction': proxy._reportAction.drillThrough, 'reportName': _actionInfo.ReportName, 'parameters': _actionInfo.Parameters, 'authKey': proxy._childReportAuthentication }), "_drillThroughModel");
                    }
                }
            }
        },

        _gotoParentReport: function () {
            this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.clearCache }), '_gotoParentReportModel');
        },

        _setInitialization: function () {
            this._dataSources = null;
            this._authenticationToken = null;
            this._childReportAuthentication = null;
            this._refresh = false;
            this._isToolbarClick = false;
            this._pageModel = null;
            this._currentPage = 1;
            this._reportParameters = null;
            this._reportDataSources = null;
            this._reporDataSets = null;
            this._zoomLevel = 2;
            this._isDocumentMap = false;
        },

        _cloneReportViewerProperties: function () {
            var reportProperties = {};
            reportProperties.model = $.extend(true, {}, this.model);
            reportProperties._dataSources = $.extend(true, {}, this._dataSources);
            reportProperties._authenticationToken = this._authenticationToken;
            reportProperties._childReportAuthentication = this._childReportAuthentication;
            reportProperties._refresh = this._refresh;
            reportProperties._isToolbarClick = this._isToolbarClick;
            reportProperties._pageModel = $.extend(true, {}, this._pageModel);
            reportProperties._currentPage = this._currentPage;
            reportProperties._reportParameters = $.extend(true, {}, this._reportParameters);
            reportProperties._reportDataSources = $.extend(true, {}, this._reportDataSources);
            reportProperties._reporDataSets = $.extend(true, {}, this._reporDataSets);
            reportProperties._zoomLevel = this._zoomLevel;
            reportProperties._preZoomVal = this._preZoomVal;
            reportProperties._isDevice = this._isDevice;
            reportProperties._originX = this._originX;
            reportProperties._originY = this._originY;
            reportProperties._printMode = this._printMode;
            reportProperties._pageSetup = this._pageSetup;
            reportProperties._isDocumentMap = this._isDocumentMap;
            return reportProperties;
        },

        _setParentReportViewerProperties: function () {
            var parentObj = this._parents[this._parents.length - 1];
            var parentProperties = parentObj.parentPro;
            this.model = parentProperties.model;
            this._dataSources = parentProperties._dataSources;
            this._authenticationToken = parentProperties._authenticationToken;
            this._childReportauthentication = parentProperties._childReportAuthentication;
            this._refresh = parentProperties._refresh;
            this._isToolbarClick = parentProperties._isToolbarClick;
            this._pageModel = parentProperties._pageModel;
            this._currentPage = parentProperties._currentPage;
            this._reportParameters = parentProperties._reportParameters;
            this._reportDataSources = parentProperties._reportDataSources;
            this._reporDataSets = parentProperties._reporDataSets;
            this._zoomLevel = parentProperties._zoomLevel;
            this._isDocumentMap = parentProperties._isDocumentMap;
            this._preZoomVal = parentProperties._preZoomVal;
            this._printMode = parentProperties._printMode;
            this._originX = parentProperties._originX;
            this._originY = parentProperties._originY;
            this._parentPageXY = parentObj.pagePos;
            this._parents.pop();
        },
        //-------------------- DrillThrough Actions[End]----------------------//

        //-------------------- Print Preview Layout[Start]----------------------//
        _printlayout: function () {
            this._updatePreviewLayout(!this._printMode, this._pageSetup);
        },

        _selectPreviewToolItem: function (enable) {
            if (!this.model.toolbarSettings.templateId) {
                var _ejToolbar = $('#' + this._id + '_toolbarContainer').data("ejToolbar");
                if (enable) {
                    _ejToolbar.selectItemByID(this._id + '_ejtb_preview');
                } else {
                    _ejToolbar.deselectItemByID(this._id + '_ejtb_preview');
                }
            }
        },

        _updatePreviewLayout: function (isPrintMode, isPageSetup) {
            this._printMode = isPrintMode;
            if (this._printMode) {
                this._pageLayoutPage = this._currentPage;
            } else {
                this._currentPage = this._pageLayoutPage;
            }

            this._selectPreviewToolItem(this._printMode);

            if (this._isPageDocMap && !this._isDocumentMap) {
                this._showDocumentMapContainer(this._printMode ? false : this._pageDocMapFlag);
            }
            this.model.printMode = this._printMode;
            if (isPageSetup) {
                var paperType = $('#' + this._id + '_PaperSize').data("ejDropDownList");
                var paperDimension = this._getPaperSize(paperType.model.value);
                var landscape = $('#' + this._id + '_landscape').data('ejRadioButton');
                var portrait = $('#' + this._id + '_portrait').data('ejRadioButton');

                if (landscape.model.checked == true) {
                    this._paperSetup.paperHeight = paperDimension.width;
                    this._paperSetup.paperWidth = paperDimension.height;
                } else {
                    this._paperSetup.paperHeight = paperDimension.height;
                    this._paperSetup.paperWidth = paperDimension.width;
                }

                this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getPageModel, 'refresh': this._refresh, 'dataRefresh': this._dataRefresh, 'pageindex': this._currentPage, 'pageInit': this._isToolbarClick, 'isPrint': this._printMode, 'PageSetup': this._paperSetup }), !this._printMode ? "_getPageModel" : "_getPreviewModel");
            } else {
                this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.getPageModel, 'refresh': this._refresh, 'dataRefresh': this._dataRefresh, 'pageindex': this._currentPage, 'pageInit': this._isToolbarClick, 'isPrint': this._printMode }), !this._printMode ? "_getPageModel" : "_getPreviewModel");
            }
        },

        _showPreviewButton: function (enable) {
            if (enable) {
                $('#' + this._id + '_toolbarContainer').find('.e-reportviewer-preview').parent().css("display", "block");
            }
            else {
                $('#' + this._id + '_toolbarContainer').find('.e-reportviewer-preview').parent().css("display", "none");
            }
        },
        //-------------------- Print Preview Layput[End]----------------------//

        //-------------------- SetCulture Layput[Start]----------------------//
        _setCultureInfo: function () {
            var culture = this.model.locale;
            var spanTagWidth = $('#' + this._id + 'Pagewidthspan');
            var spanTagHeight = $('#' + this._id + 'pageheightSpan');
            var _pageWidth = $('#' + this._id + '_pageWidth');
            var _pageHeight = $('#' + this._id + '_pageHeight');
            $('#' + this._id + '_viewReportClick').val(ej.ReportViewer.Locale[culture] ? ej.ReportViewer.Locale[culture]["viewButton"] : ej.ReportViewer.Locale["en-US"]["viewButton"]);
            $('#' + this._id + '_pdf').html(ej.ReportViewer.Locale[culture] ? ej.ReportViewer.Locale[culture]['toolbar']['exportformat']["Pdf"] : ej.ReportViewer.Locale["en-US"]['toolbar']['exportformat']["Pdf"]);
            $('#' + this._id + '_xls').html(ej.ReportViewer.Locale[culture] ? ej.ReportViewer.Locale[culture]['toolbar']['exportformat']["Excel"] : ej.ReportViewer.Locale["en-US"]['toolbar']['exportformat']["Excel"]);
            $('#' + this._id + '_word').html(ej.ReportViewer.Locale[culture] ? ej.ReportViewer.Locale[culture]['toolbar']['exportformat']["Word"] : ej.ReportViewer.Locale["en-US"]['toolbar']['exportformat']["Word"]);
            $('#' + this._id + '_html').html(ej.ReportViewer.Locale[culture] ? ej.ReportViewer.Locale[culture]['toolbar']['exportformat']["Html"] : ej.ReportViewer.Locale["en-US"]['toolbar']['exportformat']["Html"]);
            $('#' + this._id + '_ppt').html(ej.ReportViewer.Locale[culture] ? ej.ReportViewer.Locale[culture]['toolbar']['exportformat']["PPT"] : ej.ReportViewer.Locale["en-US"]['toolbar']['exportformat']["PPT"]);
                        
            var pagesetupDialog = $('#' + this._id + '_printPageSetup').data("ejDialog");
            if (pagesetupDialog) {
                pagesetupDialog.setTitle(ej.ReportViewer.Locale[culture] ? ej.ReportViewer.Locale[culture]['toolbar']['pagesetup']['headerText'] : ej.ReportViewer.Locale["en-US"]['toolbar']['pagesetup']['headerText'] );
            }

            $('#' + this._id + '_Submit').val(ej.ReportViewer.Locale[culture] ? ej.ReportViewer.Locale[culture]['pagesetupDialog']['doneButton'] : ej.ReportViewer.Locale["en-US"]['pagesetupDialog']['doneButton']);
            $('#' + this._id + '_Cancel').val(ej.ReportViewer.Locale[culture] ? ej.ReportViewer.Locale[culture]['pagesetupDialog']['cancelButton'] : ej.ReportViewer.Locale["en-US"]['pagesetupDialog']['cancelButton']);

            $('#' + this._id + "_heightLabel").html(ej.ReportViewer.Locale[culture] ? (ej.ReportViewer.Locale[culture]['pagesetupDialog']['height'] + '&nbsp;') : (ej.ReportViewer.Locale["en-US"]['pagesetupDialog']['height'] + '&nbsp;'));
            $('#' + this._id + "_widthLabel").html(ej.ReportViewer.Locale[culture] ? (ej.ReportViewer.Locale[culture]['pagesetupDialog']['width'] + '&nbsp;') : (ej.ReportViewer.Locale["en-US"]['pagesetupDialog']['width'] + '&nbsp;'));
            $('#' + this._id + "_topLabel").html(ej.ReportViewer.Locale[culture] ? (ej.ReportViewer.Locale[culture]['pagesetupDialog']['top'] + '&nbsp;') : (ej.ReportViewer.Locale["en-US"]['pagesetupDialog']['top'] + '&nbsp;'));
            $('#' + this._id + "_bottomLabel").html(ej.ReportViewer.Locale[culture] ? (ej.ReportViewer.Locale[culture]['pagesetupDialog']['bottom'] + '&nbsp;') : (ej.ReportViewer.Locale["en-US"]['pagesetupDialog']['bottom'] + '&nbsp;'));
            $('#' + this._id + "_rightLabel").html(ej.ReportViewer.Locale[culture] ? (ej.ReportViewer.Locale[culture]['pagesetupDialog']['right'] + '&nbsp;') : (ej.ReportViewer.Locale["en-US"]['pagesetupDialog']['right'] + '&nbsp;'));
            $('#' + this._id + "_leftLabel").html(ej.ReportViewer.Locale[culture] ? (ej.ReportViewer.Locale[culture]['pagesetupDialog']['left'] + '&nbsp;') : (ej.ReportViewer.Locale["en-US"]['pagesetupDialog']['left'] + '&nbsp;'));
            $('#' + this._id + "_heightUnitLabel", '#' + this._id + "_widthUnitLabel", '#' + this._id + "_topUnitLabel", '#' + this._id + "_rightUnitLabel", '#' + this._id + "_bottomUnitLabel", '#' + this._id + "_leftUnitLabel").html(ej.ReportViewer.Locale[culture] ? (ej.ReportViewer.Locale[culture]['pagesetupDialog']['unit'] + '&nbsp;') : (ej.ReportViewer.Locale["en-US"]['pagesetupDialog']['unit'] + '&nbsp;'));

            $('#' + this._id + "_portraitLabel").html(ej.ReportViewer.Locale[culture] ? ('&nbsp;' + ej.ReportViewer.Locale[culture]['pagesetupDialog']['portrait']) : ('&nbsp;' + ej.ReportViewer.Locale["en-US"]['pagesetupDialog']['portrait']));
            $('#' + this._id + "_landscapeLabel").html(ej.ReportViewer.Locale[culture] ? ('&nbsp;' + ej.ReportViewer.Locale[culture]['pagesetupDialog']['landscape']) : ('&nbsp;' + ej.ReportViewer.Locale["en-US"]['pagesetupDialog']['landscape']));

            $('#' + this._id + "_paperSizeLabel").html(ej.ReportViewer.Locale[culture] ? ('&nbsp;' + ej.ReportViewer.Locale[culture]['pagesetupDialog']['paperSize']) : ('&nbsp;' + ej.ReportViewer.Locale["en-US"]['pagesetupDialog']['paperSize']));
            $('#' + this._id + "_marginheader").html(ej.ReportViewer.Locale[culture] ? ('&nbsp;' + ej.ReportViewer.Locale[culture]['pagesetupDialog']['margins']) : ('&nbsp;' + ej.ReportViewer.Locale["en-US"]['pagesetupDialog']['margins']));
            $('#' + this._id + "_orientationLabel").html(ej.ReportViewer.Locale[culture] ? ('&nbsp;' + ej.ReportViewer.Locale[culture]['pagesetupDialog']['orientation']) : ('&nbsp;' + ej.ReportViewer.Locale["en-US"]['pagesetupDialog']['orientation']));
            _pageWidth.html(spanTagWidth);
            _pageWidth.append(ej.ReportViewer.Locale[culture] ? ej.ReportViewer.Locale[culture]['toolbar']['fittopage']["pageWidth"] : ej.ReportViewer.Locale["en-US"]['toolbar']['fittopage']["pageWidth"]);
            _pageHeight.html(spanTagHeight);
            _pageHeight.append(ej.ReportViewer.Locale[culture] ? ej.ReportViewer.Locale[culture]['toolbar']['fittopage']["pageHeight"] : ej.ReportViewer.Locale["en-US"]['toolbar']['fittopage']["pageHeight"]);

            var _dateTimePicker = $('#' + this._id + '_viewBlockContainer .e-reportviewer-viewerblockcellcontent').find('.e-reportviewer-DateTime');
            if (_dateTimePicker && _dateTimePicker.length > 0) {
                for (var i = 0; i < _dateTimePicker.length; i++) {
                    $('#' + $(_dateTimePicker[i]).attr('id')).data('ejDatePicker').setModel({ 'locale': this.model.locale });
                }
            }
        },
        //-------------------- SetCulture Layput[End]----------------------//

        //-------------------- ReportViewer Page Cache[start]----------------------//
        _storePageCache: function (key) {
            if (this._pageModel && this._pageModel.PageData && this._pageModel.PageData.length > 0) {
                this._pageCache[key] = $.extend(true, {}, this._pageModel);
            }
        },

        _retrievePageCache: function (key) {
            return this._pageCache[key];
        },

        _pageContains: function (key) {
            var _page = this._pageCache[key];
            return !ej.isNullOrUndefined(_page);
        },

        _clearPageCache: function () {
            this._pageCache = {};
        },
        //-------------------- ReportViewer Page Cache[end]----------------------//

        //-------------------- Common ReportViewer events & utils[start]----------------------//
        _itemfadeToggle: function (targetTag) {
            targetTag.fadeToggle();
        },

        _popupClick: function (event) {
            var pagePopup = $('#' + this._id + '_pageInfoPopup');
            pagePopup.fadeIn();
            pagePopup.finish();
        },

        _containerScrollStop: function (event) {
            var pagePopup = $('#' + this._id + '_pageInfoPopup');
            pagePopup.finish().fadeIn();
            pagePopup.finish().fadeOut(3000);
        },

        _viewerClick: function (event) {
            if (this._isDevice) {
                var pagePopup = $('#' + this._id + '_pageInfoPopup');
                pagePopup.finish().fadeIn(1000);
                pagePopup.finish().fadeOut(3000);
                pagePopup.hide(4000);
                $('#' + this._id + '_documentmapContainer').css('display', 'none');
            }
            $('#' + this._id + '_toolbar_exportListTip').css('display', 'none');
        },

        _pinchAndSwipe: function (event) {
            switch (event.type) {
                case "pinchin":
                    this._zoomOut();
                    break;
                case "pinchout":
                    this._zoomIn();
                    break;
                case "swipeleft":
                    this._gotoNextPage();
                    if (this._isDevice) {
                        this._updatePageNo();
                    }
                    break;
                case "swiperight":
                    this._gotoPreviousPage();
                    if (this._isDevice) {
                        this._updatePageNo();
                    }
                    break;
            }
        },

        _scrollPage: function (event) {
            var scrollContainer = $(event.target);
            var scrollY = this._orginY = scrollContainer.scrollTop();
            this._orginX = scrollContainer.scrollLeft();
            var headertabletop = $('#' + this._id + '_reportviewerContainer').offset().top;
            $('.fixed-data').each(function () {
                var tablixH = $(this).height();
                var tablixActualT = $(this).offset().top;
                var tablixFixedT = $(this).position().top;
                var tablixB = ((tablixH) + (tablixActualT)) - (headertabletop);
                if ((tablixActualT <= headertabletop) && !(tablixB <= headertabletop)) {
                    var tablixD = ((headertabletop) - (tablixActualT))
                    var tablixS = ((tablixFixedT) + (tablixD));
                    $(this).next('div').css({ 'top': tablixS, 'visibility': 'visible' });
                } else {
                    $(this).next('div').css("visibility", "collapse");
                }
            })

            if (this._isDevice) {
                if (scrollY + scrollContainer.innerHeight() >= scrollContainer[0].scrollHeight) {
                    scrollContainer.scrollTop(2);
                    if (!this._pageModel || this._currentPage == this._pageModel.TotalPages) {
                        return;
                    }
                    this._gotoNextPage();
                    this._updatePageNo();
                } else if (scrollY == 0) {
                    scrollContainer.scrollTop(2);
                    if (!this._pageModel || this._currentPage == 1) {
                        return;
                    }
                    this._gotoPreviousPage();
                    this._updatePageNo();
                }
            }
        },

        _showViewerBlock: function (showblock) {
            if (showblock) {
                $('#' + this._id + '_viewBlockContainer').css("display", "block");
                var parameterBlock = $('#' + this._id + '_viewBlockContainer .e-reportviewer-viewerblockcellcontent').find('table');
                this._selectparamToolItem(parameterBlock.is('[isviewclick]'));
            } else {
                $('#' + this._id + '_viewBlockContainer').css("display", "none");
            }
            if (this._isDevice) {
                $('#' + this._id + '_viewBlockContainer.e-reportviewer-blockstyle').css('z-index', showblock ? '10' : '0');
            }
        },

        _showNavigationIndicator: function (isShow) {
            $('#' + this._id + '_viewerContainer').ejWaitingPopup({ showOnInit: isShow });
            $('#' + this._id + '_viewerContainer_WaitingPopup').addClass('e-reportviewer-waitingpopup');
        },

        _showloadingIndicator: function (isShow) {
            if (isShow) {
                $('#' + this._id + '_loadingIndicator').css('display', 'block');
                $('#' + this._id + '_pageviewOuterContainer').css('display', 'none');
            }
            else {
                $('#' + this._id + '_loadingIndicator').css('display', 'none');
                $('#' + this._id + '_pageviewOuterContainer').css('display', 'block');
            }
            $('#' + this._id + '_loadingIndicator').ejWaitingPopup({ showOnInit: isShow });
            $('#' + this._id + '_loadingIndicator_WaitingPopup').addClass('e-reportviewer-waitingpopup');
        },

        _isMobileDevice: function () {
            //return (/mobile|tablet|android|kindle/i.test(navigator.userAgent.toLowerCase()));  
            return (/windows phone|android|iphone/i.test(navigator.userAgent.toLowerCase()));
        },

        _getAuthenticationToken: function () {
            function _guid() {
                function guid() {
                    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                }
                return (guid() + guid() + "-" + guid() + "-" + guid() + "-" + guid() + "-" + guid() + guid() + guid()).toUpperCase();
            }
            return _guid() + "^" + this._id;
        },

        _updateToolbarmodel: function () {
            this._showToolbar(this.model.toolbarSettings.showToolbar);
            this._showPrintButton(this.model.toolbarSettings.items & ej.ReportViewer.ToolbarItems.Print);
            this._showRefreshButton(this.model.toolbarSettings.items & ej.ReportViewer.ToolbarItems.Refresh);
            this._showZoomControl(this.model.toolbarSettings.items & ej.ReportViewer.ToolbarItems.Zoom);
            this._showFittoPage(this.model.toolbarSettings.items & ej.ReportViewer.ToolbarItems.FittoPage);
            this._showExportControls(this.model.toolbarSettings.items & ej.ReportViewer.ToolbarItems.Export);
            this._showExportList();
            this._showPageNavigationControls(this.model.toolbarSettings.items & ej.ReportViewer.ToolbarItems.PageNavigation);
            this._showParameterBlock(this.model.toolbarSettings.items & ej.ReportViewer.ToolbarItems.Parameters);
            this._showPreviewButton(model.toolbarSettings.items & ej.ReportViewer.ToolbarItems.PrintLayout);
            this._showPrintPageSetupButton(this.model.toolbarSettings.items & ej.ReportViewer.ToolbarItems.PageSetup);
        },

        _viewerResize: function (event) {
            var proxy = this;
            if (this.model.isResponsive) {
                if (this.resizeTO) clearTimeout(this.resizeTO);
                this.resizeTO = setTimeout(function () {
                    var elementWidth = proxy._isWidth ? proxy.element[0].parentElement.style.width : proxy.element[0].style.width;
                    var elementHeight = proxy._isHeight ? proxy.element[0].parentElement.style.height : proxy.element[0].style.height;
                    var _height = $(proxy.element).height();
                    var _width = $(proxy.element).width();

                    if (elementHeight.indexOf("%") != -1) {
                        proxy._isPercentHeight = parseInt(elementHeight);
                        var containerHeight = proxy._isHeight ? $(proxy.element).parent().height() : _height;
                        _height = !proxy._isHeight ? ((containerHeight / 100) * proxy._isPercentHeight) : containerHeight;
                    } else if (proxy.element[0].parentElement.clientHeight != 0 && proxy._isPercentHeight != -1) {
                        _height = !proxy._isHeight ? ((proxy.element[0].parentElement.clientHeight / 100) * proxy._isPercentHeight) : proxy.element[0].parentElement.clientHeight;
                    } else if (proxy._isHeight && proxy.element[0].parentElement.clientHeight != 0) {
                        _height = proxy.element[0].parentElement.clientHeight;
                    }
                    proxy.element.height(_height);

                    if (elementWidth.indexOf("%") != -1) {
                        proxy._isPercentWidth = parseInt(elementWidth);
                        var containerWidth = proxy._isWidth ? $(proxy.element).parent().width() : _width;
                        _width = !proxy._isWidth ? (containerWidth / 100) * proxy._isPercentWidth : containerWidth;
                    } else if (proxy.element[0].parentElement.clientWidth != 0 && proxy._isPercentWidth != -1) {
                        _width = !proxy._isWidth ? (proxy.element[0].parentElement.clientWidth / 100) * proxy._isPercentWidth : proxy.element[0].parentElement.clientWidth;
                    } else if (proxy._isWidth && proxy.element[0].parentElement.clientWidth != 0) {
                        _width = proxy.element[0].parentElement.clientWidth;
                    }
                    proxy.element.width(_width);

                    proxy._setContainerSize();
                }, 200);
            }
        },

        _showViewerPage: function (isEnable) {
            if (isEnable) {
                $('#' + this._id + '_pageviewOuterline').css('display', 'block');
            } else {
                $('#' + this._id + '_pageviewOuterline').css('display', 'none');
            }
            if (this._isDevice) {
                $('#' + this._id + '_pageviewOuterline').css('z-index', isEnable ? '10' : '0');
            }
        },

        _updatePageNo: function () {
            $('#' + this._id + '_popupPageNo').val(this._currentPage);
            $('#' + this._id + '_pageInfoPopup .e-reportviewer-popuptotalpage').html(' / ' + this._pageModel.TotalPages);
        },

        _reportReload: function () {
            this._refresh = true;
            this._unwireEvents();
            this._initViewer();
            this.doAjaxPost("POST", this._actionUrl, JSON.stringify({ 'reportAction': this._reportAction.reportLoad, 'controlId': this._id, 'reportPath': this.model.reportPath, 'reportServerUrl': this.model.reportServerUrl, 'processingMode': this.model.processingMode }), "_reportLoaded");
        },
        //-------------------- Common ReportViewer events & utils[End]----------------------//

        /*---------------------client side methods[start]----------------------------------------------------------*/
        
        getDataSetNames: function () {
            var reportdatasets = $.extend(true, {}, this._reporDataSets);
            return reportdatasets;
        },

        
        getParameters: function () {
            var reportparameters = $.extend(true, {}, this._reportParameters);
            return reportparameters;
        },

        
        gotoPageIndex: function (pageNo) {
            this._gotoPageNo(pageNo);
        },

        
        gotoLastPage: function () {
            this._gotoLastPage();
        },

        
        gotoFirstPage: function () {
            this._gotoFirstPage();
        },

        
        gotoNextPage: function () {
            this._gotoNextPage();
        },

        
        gotoPreviousPage: function () {
            this._gotoPreviousPage();
        },

        
        print: function () {
            this._print();
        },

        
        printLayout: function () {
            this._printlayout();
        },

        
        exportReport: function (format) {
            this._exportReport(format);
        },

        
        refresh: function () {
            this._refreshReport();
        },

        
        fitToPage: function () {
            this._fitToPage('fitToPage');
        },

        
        fitToPageWidth: function () {
            this._fitToPage('fitToWidth');
        },

        fitToPageHeight: function () {
            this._fitToPage('wholepage');
        },
        /*---------------------client side methods[end]----------------------------------------------------------*/

        /*---------------------client side Events[start]----------------------------------------------------------*/
        _onReportLoaded: function () {
            this._trigger("reportLoaded");
        },

        _onRenderingBegin: function (args) {
            return this._trigger("renderingBegin", args);
        },

        _onRenderingComplete: function (args) {
            this._trigger("renderingComplete", args);
        },

        _onReportError: function (args) {
            return this._trigger("reportError", args);
        },

        _onViewReportClick: function (args) {
            return this._trigger("viewReportClick", args);
        },

        _onDrillThrough: function (args) {
            return this._trigger("drillThrough", args);
        },

        _onReportExport: function (args) {
            this._trigger("reportExport", args);
        },

        _onReportPrint: function (args) {
            this._trigger("reportPrint", args);
            return args.isStyleLoad;
        }
        /*---------------------client side Events[end]----------------------------------------------------------*/
    });
    
    ej.ReportViewer.ExportOptions = {        
        Excel: 1 << 0,        
        Html: 1 << 1,        
        Pdf: 1 << 2,        
        Word: 1 << 3,
        PPT: 1 << 4,
        All: 1 << 0 | 1 << 1 | 1 << 2 | 1 << 3 | 1 << 4
    };
    ej.ReportViewer.ExcelFormats = {        
        Excel97to2003: "excel97to2003",        
        Excel2007: "excel2007",        
        Excel2010: "excel2010",        
        Excel2013: "excel2013"
    };
    ej.ReportViewer.PPTFormats = {
        PowerPoint97to2003: "powerpoint97to2003",
        PowerPoint2007: "powerpoint2007",
        PowerPoint2010: "powerpoint2010",
        PowerPoint2013: "powerpoint2013"
    };
    ej.ReportViewer.WordFormats = {        
        Doc: "doc",       
        Dot: "dot",        
        Docx: "docx",        
        Word2007: "word2007",        
        Word2010: "word2010",        
        Word2013: "word2013",        
        Word2007Dotx: "word2007dotx",        
        Word2010Dotx: "word2010dotx",       
        Word2013Dotx: "word2013dotx",        
        Word2007Docm: "word2007docm",        
        Word2010Docm: "word2010docm",        
        Word2013Docm: "word2013docm",        
        Word2007Dotm: "word2007dotm",       
        Word2010Dotm: "word2010dotm",        
        Word2013Dotm: "word2013dotm",        
        Rtf: "rtf",      
        Txt: "txt",        
        EPub: "epub",        
        Html: "html",        
        Xml: "xml",       
        Automatic: "automatic"
    };
    ej.ReportViewer.ProcessingMode = {        
        Remote: "remote",        
        Local: "local"
    };    
    ej.ReportViewer.Orientation = {        
        Portrait: "Portrait",       
        Landscape: "Landscape"
    };  
    ej.ReportViewer.PaperSize = {        
        A3: "A3",        
        A4: "A4",        
        B4_JIS: "B4(JIS)",        
        B5_JIS: "B5(JIS)",        
        Envelope_10: "Envelope #10",        
        Envelope_Monarch: "Envelope Monarch",        
        Executive: "Executive",        
        Legal: "Legal",        
        Letter: "Letter",
    };    
    ej.ReportViewer.ToolbarItems = {        
        Export: 1 << 0,        
        Zoom: 1 << 1,        
        PageNavigation: 1 << 2,        
        Refresh: 1 << 3,        
        Print: 1 << 4,        
        DocumentMap: 1 << 5,        
        Parameters: 1 << 6,        
        PrintLayout: 1 << 7,        
        FittoPage: 1 << 8,        
        PageSetup: 1 << 9,        
        All: 1 << 0 | 1 << 1 | 1 << 2 | 1 << 3 | 1 << 4 | 1 << 5 | 1 << 6 | 1 << 7 | 1 << 8 | 1 << 9
    };    
    ej.ReportViewer.RenderMode = {        
        Default: 1 << 0 | 1 << 1,        
        Mobile: 1 << 0,       
        Desktop: 1 << 1
    };

    ej.ReportViewer.PrintOptions = {
        Default: "Default",
        NewTab: "NewTab",
        None: "None"
    };

    ej.ReportViewer.Locale = {};

    ej.ReportViewer.Locale["en-US"] = {
        toolbar: {
            print: {
                headerText: 'Print',
                contentText: 'Print the report.'
            },
            exportformat: {
                headerText: 'Export',
                contentText: 'Select the exported file format.',
                Pdf: 'PDF',
                Excel: 'Excel',
                Word: 'Word',
                Html: 'Html',
                PPT: 'PPT',
            },
            first: {
                headerText: 'First',
                contentText: 'Go to the first page of the report.'
            },
            previous: {
                headerText: 'Previous',
                contentText: 'Go to the previous page of the report.'
            },
            next: {
                headerText: 'Next',
                contentText: 'Go to the next page of the report.'
            },
            last: {
                headerText: 'Last',
                contentText: 'Go to the last page of the report.'
            },
            documentMap: {
                headerText: 'Document Map',
                contentText: 'Show or hide the document map.'
            },
            parameter: {
                headerText: 'Parameter',
                contentText: 'Show or hide the parameters pane.'
            },
            zoomIn: {
                headerText: 'Zoom-In',
                contentText: 'Zoom in to the report.'
            },
            zoomOut: {
                headerText: 'Zoom-Out',
                contentText: 'Zoom out of the report.'
            },
            refresh: {
                headerText: 'Refresh',
                contentText: 'Refresh the report.'
            },
            printLayout: {
                headerText: 'Print Layout',
                contentText: 'Change between print layout and normal modes.'
            },
            pageIndex: {
                headerText: 'Page Number',
                contentText: 'Current page number to view.'
            },
            zoom: {
                headerText: 'Zoom',
                contentText: 'Zoom in or out on the report.'
            },
            back: {
                headerText: 'Back',
                contentText: 'Go back to the parent report.'
            },
            fittopage: {
                headerText: 'Fit to Page',
                contentText: 'Fit the report page to the container.',
                pageWidth: 'Page Width',
                pageHeight: 'Whole Page'
            },
            pagesetup: {
                headerText: 'Page Setup',
                contentText: 'Choose page setup option to change paper size, orientation and margins.'
            }
        },
        pagesetupDialog: {
            paperSize: 'Paper Size',
            height: 'Height',
            width: 'Width',
            margins: 'Margins',
            top: 'Top',
            bottom: 'Bottom',
            right: 'Right',
            left: 'Left',
            unit: 'in',
            orientation: 'Orientation',
            portrait: 'Portrait',
            landscape: 'Landscape',
            doneButton: 'Done',
            cancelButton: 'Cancel'
        },
        viewButton: 'View Report'
    };
})(jQuery, Syncfusion);
;

});