/*!
*  filename: ej.pdfviewer.js
*  version : 14.4.0.20
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.globalize","jquery-easing","./../common/ej.core","./../common/ej.data","./../common/ej.scroller","./ej.button","./ej.dropdownlist","./ej.toolbar","./ej.waitingpopup"], fn) : fn();
})
(function () {
	
/**
* @fileOverview Plugin to style the Html PDFViewer elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author &lt;a href="mailto:licensing@syncfusion.com"&gt;Syncfusion Inc&lt;/a&gt;
*/
(function ($, ej, undefined) {
    ej.widget("ejPdfViewer", "ej.PdfViewer", {

        _rootCSS: "e-pdfviewer",
		_requiresID: true,
        element: null,
        model: null,
        validTags: ["div"],

        //#region Defaults
        defaults: {
            serviceUrl: "",
            hyperlinkOpenState: 1,
            toolbarSettings: {
                toolbarItem: 1 | 2 | 4| 8 | 16,
                showTooltip: true
            },
            enableHyperlink: true,
            pdfService: 1,
            locale: "en-US",
            pageChange: "",
            documentLoad: "",
            beforePrint: "",
            afterPrint: "",
            zoomchange: "",
            isResponsive: true,
            pageClick: "",
            allowClientBuffering: false,
        },
        //#endregion

        //#region Local Members
        _isToolbarClick: false,
        _curYPos: 0,
        _curXPos: 0,
        _curDown: false,
        _pageModel: null,
        _currentPage: 1,
        _zoomLevel: 2,
        _preZoomVal: 1,
        _fitType: null,
        _higherZoomIndex: 0,
        _lowerZoomIndex: 0,
        _actionUrl: null,
        _isDevice: false,
        _contextMenu: false,
        _zoomVal: 1,
        _currentPageBackup: 0,
        _zoomValBackup: 0,
        _zoomLevelBackup: 0,
        _fitTypeBackup: null,
        _scrollTop: 0,
        _bgRenderTimer: 0,
        _renderCount: 0,
        _prevDiff: -1,
        _pointerCount: 0,
        _searchText: null,
        _selectedIndex: 0,
        _searchPageIndex: 0,
        _isRenderedByPinch: false,
        _isPinchLimitReached: false,
        _isRerenderCanvasCreated: false,
        _isPrinting: false,
        _isContainImage: false,
        _isPercentHeight: -1,
        _isPercentWidth: -1,
        _isHeight: false,
        _isWidth: false,
        _isFindboxPresent: false,
        _isTextSearch: false,
        _isTextHighlighted: false,
        _isRequestFired: false,
        _isPageScrollHighlight: false,
        _isPageScrolledForSearch: false,
        _searchAjaxRequestState: null,
        _isPrevSearch: false,
        _isMatchCase: false,
        _isPrintHidden: false,
        _isNavigationHidden: false,
        _isMagnificationHidden: false,
        _isDownloadHidden: false,
        _isTextSearchHidden: false,
        _isZoomCntlHidden: false,
        _isDownloadCntlHidden: false,
        _isToolbarHidden: false,
        _viewerAction: {
            getPageModel: 'GetPageModel',
        },
        _scrollTimer: null,
        _isDestroyed: false,
        _pdfService: null,
        _toolbar: null,
        _printIframe: null,
        _currentPrintPage: 0,
        _abortPrinting: false,
        _isWindowResizing: false,
        _ejViewerInstance: null,
        _isAutoZoom: false,
        _ejDropDownInstance: null,
        _clientx: null,
        _clienty: null,
        _curPosX: null,
        _curPosY: null,
        _previousBounds: null,
        _topValue: false,
        _clearText: false,
        _timers: null,
        _scrollMove: null,
        _rangePosition: null,
        _selectedRanges: null,
        _longTouch: false,
        _ranges: false,
        _touchcontextMenu: false,
        _selectionNodes: null,
        _selectionRange: null,
        _touched: false,
        _lockTimer: null,
        _timer: null,
        _displaySearch: false,
        _isCopyRestrict: false,
        _isPrintRestrict: false,
        _isTargetPage: false,
        _targetPage: 0,
        _isBuffering: false,
        _pagesGot: null,
        _isPrintingProcess: false,
        _isRequestSuccess: false,
        _isLoadMethod: false,
        _fileId: null,
        _isFormFields: false,
        _imageObj: null,
        _isJsondataAvailable: false,
        //#endregion

        //#region public members
        pageCount: 0,
        currentPageNumber: this._currentPage,
        zoomPercentage: 100,
        fileName: this._pdfFileName,
        enableTextSelection: true,
        //#endregion

        //#region Initialization
        _init: function () {
            this._actionUrl = this.model.serviceUrl + "/Load";
            this._renderViewer();
            this._initViewer();
            this._createContextMenu();
            this._createWaterDropDiv();
            this._createTouchContextMenu();
            this._ejDropDownInstance = $('#' + this._id + '_toolbar_zoomSelection').data("ejDropDownList");
            this._getPdfService(this.model.pdfService);
            if (this.model.serviceUrl) {
                var jsonResult = new Object();
                jsonResult["viewerAction"] = "GetPageModel";
                jsonResult["controlId"] = this._id;
                jsonResult["pageindex"] = "1";
                jsonResult["isInitialLoading"] = "true";
                jsonResult["id"] = this._createGUID();
                this._fileId = jsonResult["id"];
                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                    this._doAjaxPost("POST", this._actionUrl, JSON.stringify(jsonResult), "_getPageModel");
                else
                    this._doAjaxPost("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }), "_getPageModel");
            }
            this._printIframe = document.createElement("iframe");
        },

        _getPdfService: function (isLocal) {
            if (isLocal == 1)
                this._pdfService = ej.PdfViewer.PdfService.Local;
            else
                this._pdfService = ej.PdfViewer.PdfService.Remote;
        },

        _initViewer: function () {
            this._wireEvents();
            this._initToolbar();
            this._currentPage = 1;
            var tbSettings = this.model.toolbarSettings;
            if (!tbSettings.templateId) {
                this._showToolbar(true);
                this._showPrintButton(tbSettings.toolbarItem & ej.PdfViewer.ToolbarItems.PrintTools);
                this._showZoomControl(tbSettings.toolbarItem & ej.PdfViewer.ToolbarItems.MagnificationTools);
                this._showFittoPage(tbSettings.toolbarItem & ej.PdfViewer.ToolbarItems.MagnificationTools);
                this._showPageNavigationControls(tbSettings.toolbarItem & ej.PdfViewer.ToolbarItems.PageNavigationTools);
                this._showDownloadButton(tbSettings.toolbarItem & ej.PdfViewer.ToolbarItems.DownloadTool);
                this._showTextSearchButton(tbSettings.toolbarItem & ej.PdfViewer.ToolbarItems.TextSearchTool);
            }
            this._showViewerBlock(false);
            this._setContainerSize();
            this._showloadingIndicator(true);
            this._on($('#'+this._id + 'e-pdf-viewer'), "keydown", this._keyboardShortcutFind);
        },

        _destroy: function () {
            this._isDestroyed = true;
            $('#' + this._id + '_toolbarContainer span.e-pdfviewer-labelpageno').html(" / " + 0);
            $('#' + this._id + '_txtpageNo').val(0);
            clearTimeout(this._scrollTimer);
            this._unwireEvents();
            var count = this._canvascount;
            while (count >= 1) {
                $('#' + this._id + 'pageDiv_' + count).remove();
                $('#' + this._id +'selectioncanvas_' + count).remove();
                count--;
            }
            $('#' + this._id + '_pageviewContainer').remove();
            $('#' + this._id + '_toolbarContainer').remove();
            $('#' + this._id + '_viewerContainer').remove();
            $('#' + this._id + '_viewBlockContainer').remove();
            $('#' + this._id + '_toolbar_zoomSelection_popup_wrapper').remove();
            $('#' + this._id + '_rptTooltip').remove();
            $('#' + this._id + '_loadingIndicator_WaitingPopup').remove();
            $('#' + this._id + '_viewerContainer_WaitingPopup').remove();
            $('#' + this._id + '_WaitingPopup').remove();

            $(this.element).find('.e-pdfviewer-viewer').remove();
            this._renderedCanvasList.length = 0;
            this._raiseClientEvent("destroy", null);
        },
        //#endregion

        //-------------------- Render the pdfviewer Ctrl [start] -------------------------//

        _renderToolTip: function () {
            var $divTooltip = ej.buildTag("div.e-pdfviewer-tbdiv e-pdfviewer-tooltip", "", { 'display': 'none' }, { 'id': this._id + '_rptTooltip' });
            var $tooltipHeader = ej.buildTag("span.e-pdfviewer-headerspan", "", { 'display': 'block' }, { 'id': this._id + '_rptTooltip_Header' });
            var $tooltipContent = ej.buildTag("span.e-pdfviewer-contentspan", "", { 'display': 'block' }, { 'id': this._id + '_rptTooltip_Content' });
            $divTooltip.append($tooltipHeader);
            $divTooltip.append($tooltipContent);
            return $divTooltip;
        },

        _renderToolBar: function (targetTag) {
            if (!this.model.toolbarSettings.templateId) {
                var div = ej.buildTag("div.e-pdfviewer-toolbarcontainer .e-pdfviewer-viewer", "", { 'width': '100%' }, { 'id': this._id + '_toolbarContainer' });
                targetTag.append(div);

                if (this._isDevice) {
                    var $ultoolbaritems = ej.buildTag("ul.e-pdfviewer-toolbarul", "", {});
                    this._appendToolbarItems($ultoolbaritems, 'zoomin');
                    this._appendToolbarItems($ultoolbaritems, 'zoomout');
                    this._appendToolbarItems($ultoolbaritems, 'fitWidth');
                    this._appendToolbarItems($ultoolbaritems, 'fitPage');
                    div.append($ultoolbaritems);
                } else {
                    var $ulnavigate = ej.buildTag("ul.e-pdfviewer-toolbarul", "", { 'padding-right': '10px' }, {});
                    this._appendToolbarItems($ulnavigate, 'gotoprevious');
                    this._appendToolbarItems($ulnavigate, 'gotonext');
                    this._appendToolbarItems($ulnavigate, 'gotopage');
                    div.append($ulnavigate);

                    var $ulzoom = ej.buildTag("ul.e-pdfviewer-toolbarul", "", {'padding-right':'10px'}, { 'id': this._id + '_pdfviewer_zoomul' });
                    this._appendToolbarItems($ulzoom, 'zoomin');
                    this._appendToolbarItems($ulzoom, 'zoomout');
                    this._appendToolbarItems($ulzoom, 'zoom');
                    //Appending the fitWidth and the fitPage buttons to the toolbar
                    this._appendToolbarItems($ulzoom, 'fitWidth');
                    this._appendToolbarItems($ulzoom, 'fitPage');
                    div.append($ulzoom);

                    var $ulsearch = ej.buildTag("ul.e-pdfviewer-toolbarul", "", {}, { 'id': this._id + '_pdfviewer_searchul' });
                    this._appendToolbarItems($ulsearch, 'search');
                    div.append($ulsearch);

                    var $uldownload = ej.buildTag("ul.e-pdfviewer-toolbarul", "", { 'float': 'right' }, { 'id': this._id + '_pdfviewer_downloadul' });
                    this._appendToolbarItems($uldownload, 'download');
                    div.append($uldownload);

                    var $ulprintExport = ej.buildTag("ul.e-pdfviewer-toolbarul", "", { 'float': 'right' }, { 'id': this._id + '_pdfviewer_printul' });
                    this._appendToolbarItems($ulprintExport, 'print');
                    div.append($ulprintExport);

                    $('#' + this._id + '_toolbar_zoomSelection').ejDropDownList({ height: "27px", width: "75px", cssClass: "e-pdfviewer-ddl", change: this._zoomValChange, selectedItem: 0 });
                }
                div.ejToolbar({ enableSeparator: !this._isDevice, click: $.proxy(this._toolbarClick, this), isResponsive: true });
                this._toolbar = $('#' + this._id + '_toolbarContainer').data('ejToolbar');
                $('#' +this._id +'_toolbarContainer_hiddenlist').removeClass("e-responsive-toolbar").addClass("e-pdfviewer-responsivesecondarytoolbar");
                $('#' + this._id + '_pdfviewer_searchul').removeClass('e-separator');
                $('#' + this._id + '_pdfviewer_downloadul').removeClass('e-separator');
                $('#' +this._id +'_toolbarContainer_hiddenlist').removeClass("e-toolbarspan");
            } else {
                var templateDiv = document.getElementById(this.model.toolbarSettings.templateId);
                targetTag.append(templateDiv);
                templateDiv.ejToolbar({ enableSeparator: true, height: templateDiv.height(), click: this.model.toolbarSettings.click, isResponsive: true });
                templateDiv.css('display', 'block');
            }
        },

        _appendToolbarItems: function (litag, eletype) {
            var $divouter;
            var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
            switch (eletype) {
                case 'print':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_Print' });
                    var $spanprint = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-print", "", {}, { 'id': this._id + '_toolbar_Print' });
                    $divouter.append($spanprint);
                    break;
                case 'download':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_download' });
                    var $spandownload = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-download", "", {}, { 'id': this._id + '_toolbar_download' });
                    $divouter.append($spandownload);
                    break;
                case 'gotofirst':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_gotofirst' });
                    var $spangotofirst = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-gotofirst", "", {});
                    $divouter.append($spangotofirst);
                    break;
                case 'gotolast':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_gotolast' });
                    var $spangotolast = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-gotolast", "", {});
                    $divouter.append($spangotolast);
                    break;
                case 'gotonext':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_gotonext' });
                    var $spangotonext = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-gotonext", "", {});
                    $divouter.append($spangotonext);
                    break;
                case 'gotoprevious':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_gotoprevious' });
                    var $spangotoprevious = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-gotoprevious", "", {});
                    $divouter.append($spangotoprevious);
                    break;
                case 'gotopage':
                    $divouter = ej.buildTag("div.e-pdfviewer-tbpage", "", { 'display': 'block' }, {});
                    var $inputpageno = ej.buildTag("input.e-pdfviewer-pagenumber e-pdfviewer-elementalignments ejinputtext", "", {}, { 'type': 'text', 'value': '0', 'id': this._id + '_txtpageNo', 'data-role': 'none' });
                    var $spanpageno = ej.buildTag("span.e-pdfviewer-labelpageno", "", {}, {});
                    $divouter.append($inputpageno);
                    $divouter.append($spanpageno);
                    break;
                case 'zoomin':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_zoomin' });
                    var $spanzoomin = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-zoomin", "", {}, { 'id': this._id + '_toolbar_zoomin' });
                    $divouter.append($spanzoomin);
                    break;
                case 'zoomout':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_zoomout' });
                    var $spanzoomout = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-zoomout", "", {}, { 'id': this._id + '_toolbar_zoomout' });
                    $divouter.append($spanzoomout);
                    break;
                case 'zoom':
                    $divouter = ej.buildTag("div.e-pdfviewer-ejdropdownlist", "", {}, { 'id': this._id + '_pdfviewer_toolbar_zoom' });
                    var $sltzoom = ej.buildTag("select.e-pdfviewer-tbdiv e-pdfviewer-zoomlist", "", {}, { 'id': this._id + '_toolbar_zoomSelection', 'data-role': 'none' });
                    $sltzoom.append("<option Selected>Auto</option>");
                    $sltzoom.append("<option>50%</option>");
                    $sltzoom.append("<option>75%</option>");
                    $sltzoom.append("<option>100%</option>");
                    $sltzoom.append("<option>125%</option>");
                    $sltzoom.append("<option>150%</option>");
                    $sltzoom.append("<option>200%</option>");
                    $sltzoom.append("<option>400%</option>");
                    $divouter.append($sltzoom);
                    break;
                    //Creating the fitWidth and the fitPage spans in the HTML page and appending them to the toolbar of the PDF viewer
                case 'fitWidth':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_fitWidth' });
                    var $spanexport = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-fitwidth", "", {}, { 'id': this._id + '_fitWidth' });
                    $divouter.append($spanexport);
                    break;
                case 'fitPage':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_fitPage' });
                    var $spanFitPage = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-fitpage", "", {}, { 'id': this._id + '_fitPage' });
                    $divouter.append($spanFitPage);
                    break;
                case 'search':
                    $divouter = ej.buildTag("li.e-pdfviewer-toolbarli", "", {}, { 'id': this._id + '_pdfviewer_toolbar_search' });
                    var $spansearch = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-find", "", {}, { 'id': this._id + '_find' });
                    $divouter.append($spansearch);
                    break;
            }
            litag.append($divouter);
        },

        _renderViewerBlockinWeb: function (targetTag) {
            var div = ej.buildTag("div.e-pdfviewer-viewer e-pdfviewer-viewerblock", "", {}, { 'id': this._id + '_viewBlockContainer' });
            targetTag.append(div);

            var $innerContent = ej.buildTag("table.e-pdfviewer-viewerblockcellcontent", "", { 'margin': '1px', 'padding': '5px 5px 10px' });
            var $tr = ej.buildTag("tr", "", { 'width': '100%' });
            var $tdleft = ej.buildTag("td.e-pdfviewer-viewerblockcontent", "", {});
            $tr.append($tdleft);
            $innerContent.append($tr);
            div.append($innerContent);
            return div;
        },

        _renderViewerContainer: function (targetTag) {
            var div = ej.buildTag("div", "", {}, { 'id': this._id + '_pdfviewerContainer' });
            targetTag.append(div);

            var $pdfviewContainer = ej.buildTag("div.e-pdfviewer-viewer e-pdfviewer-scrollcontainer e-pdfviewer-viewercontainer", "", { 'height': '100%', 'width': '100%', 'font-size': '8pt' }, { 'id': this._id + '_viewerContainer' });
            var $loadingindicator = ej.buildTag("div", "", { 'margin': '0px', 'height': '99.8%', 'width': '100%' }, { 'id': this._id + '_loadingIndicator' });
            var $loadingemptybackview = ej.buildTag("div", "", { 'margin': '0px', 'height': '99.8%', 'width': '100%', 'background-color': 'rgba(164, 183, 216, 0.18)', 'display': 'block' }, { 'id': this._id + '_loadingIndicatorBackView' });

            var $pageviewContainer = ej.buildTag("div", "", {}, { 'id': this._id + '_pageviewContainer' });

            $loadingindicator.append($loadingemptybackview);
            $pdfviewContainer.append($loadingindicator);

            $pdfviewContainer.append($pageviewContainer);

            if (this._isDevice) {
                this._renderViewerBlockinDevice($pdfviewContainer);
            }

            div.append($pdfviewContainer);
            
            return div;
        },

        _renderViewer: function () {
            var height = this.element.height();
            var width = this.element.width();
            //control root div tag.
            var viewer = ej.buildTag("div.e-pdfviewer-viewer", "", {}, { 'id': this._id +'e-pdf-viewer' });

            if (!this.element[0].style.height && this.element[0].parentElement.clientHeight != 0) {
                this._isHeight = true;
            }

            if (!this.element[0].style.width && this.element[0].parentElement.clientWidth != 0) {
                this._isWidth = true;
            }

            if (height === 0 && this.element[0].parentElement.clientHeight != 0) {
                this.element.height(this.element[0].parentElement.clientHeight);
            }

            if (width === 0 && this.element[0].parentElement.clientWidth != 0) {
                this.element.width(this.element[0].parentElement.clientWidth);
            }

            this.element.append(viewer);
            this._renderToolBar(viewer);
            if (!this._isDevice) {
                this._renderViewerBlockinWeb(viewer);
                var tooltip = this._renderToolTip();
            }
            var div = this._renderViewerContainer(viewer);
            div.append(tooltip);
            this._renderSearchBox();
        },

        _renderSearchBox: function () {
            var div = ej.buildTag('div.e-pdfviewer-searchbox e-pdfviewer-arrow', "", {}, { 'id': this._id + '_pdfviewer_searchbox' });
            var ulItem = ej.buildTag('ul.e-pdfviewer-toolbarul-search', "", {});
            div.append(ulItem);
            var inputContainer = ej.buildTag('div.e-pdfviewer-searchboxitem.e-pdfviewer-search-inputcontainer', "", { 'float': 'left', 'margin-top': '4px' }, {});
            var findLabel = ej.buildTag('span.e-pdfviewer-label.e-pdfviewer-searchboxitem', "Find : ", { 'float': 'left', 'padding-top': '1px', 'margin-right': '5px' }, {});
            var input = ej.buildTag('input.e-pdfviewer-searchinput e-pdfviewer-elementalignments ejinputtext', '', { 'width' : '150px' }, { 'id': this._id + '_pdfviewer_searchinput' });
            inputContainer.append(findLabel);
            inputContainer.append(input);
            var prevbutton = ej.buildTag('li.e-pdfviewer-toolbarli-search.e-pdfviewer-search-previous', '', { 'float': 'left' }, { 'id': this._id + '_pdfviewer_previous_search' });
            var nextbutton = ej.buildTag('li.e-pdfviewer-toolbarli-search.e-pdfviewer-search-next', '', { 'float': 'left' }, { 'id': this._id + '_pdfviewer_next_search' });
            var closebutton = ej.buildTag('li.e-pdfviewer-toolbarli-search.e-pdfviewer-search-close', '', { 'float': 'left', 'margin-left': '4px' }, { 'id': this._id + '_pdfviewer_close_search' });
            var prevBtnSpan = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-prevfind", "", {}, { 'id': this._id + '_prevfind' });
            prevbutton.append(prevBtnSpan);
            var nextBtnSpan = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-nextfind", "", {}, { 'id': this._id + '_nextfind' });
            nextbutton.append(nextBtnSpan);
            var checkboxContainer = ej.buildTag('div.e-pdfviewer-searchboxitem.e-pdfviewer-search-checkboxcontainer', "", { 'float': 'left' }, {});
            var checkbox = ej.buildTag("input", "", {}, { 'type': 'checkbox' });
            var spanElement = ej.buildTag("span.e-pdfviewer-label.e-pdfviewer-searchboxitem", "Match case", { 'float': 'left', 'padding-top': '3px', 'margin-left': '5px', 'margin-top': '4px' }, {});
            checkboxContainer.append(checkbox);
            checkboxContainer.append(spanElement);
            var closeBtnSpan = ej.buildTag("span.e-pdfviewer-icon e-pdfviewer-closefind", "", {}, { 'id': this._id + '_closefind' });
            closebutton.append(closeBtnSpan);
            ulItem.append(inputContainer);
            ulItem.append(prevbutton);
            ulItem.append(nextbutton);
            ulItem.append(checkboxContainer);
            ulItem.append(closebutton);
            div.ejToolbar({ enableSeparator: false, isResponsive: false, width: '400px', hide: true, height: '35px' });
            checkbox.ejCheckBox({ cssClass: 'e-pdfviewer-match-checkbox', id: this._id + '_search_matchcase', size: ej.CheckboxSize.Medium, change: $.proxy(this._matchcase, this) });
            $('#' + this._id + '_pdfviewerContainer').append(div);
        },
        //-------------------- Render the pdfviewer Ctrl [End] -------------------------//

        //-------------------- Apply Page Style and Actions [Start] -------------------------//
        _setContainerSize: function () {
            var ctrlheight = document.getElementById(this._id).clientHeight;
            var viewerblockHeight = 0;
            if (!this._isDevice) {
                var viewerContainer = $('#' + this._id + '_viewBlockContainer');
                if (viewerContainer.css('display').toLowerCase() == 'block') {
                    viewerblockHeight = viewerContainer.height();
                }
            }

            var toolbarHeight = this.model.toolbarSettings.templateId ? $('#' + this.model.toolbarSettings.templateId).height() : $('#' + this._id + '_toolbarContainer').height();

            var calcHeight = ctrlheight - viewerblockHeight - toolbarHeight - 4;
            $('#' + this._id + '_viewerContainer').css({ "height": calcHeight + "px" });
        },

        _setPageSize: function (pageHeight, pageWidth, headerHeight, footerHeight) {
            headerHeight = 0;
            var scalePageSize = $('#' + this._id + '_pageviewContainer')[0].getBoundingClientRect();
            var ins = this;
            this._renderPreviousPage = false;
            $('#' + this._id + '_viewerContainer').unbind('scroll').on('scroll', function () {
                ins._computeCurrentPage(pageHeight);
            });
            $('#' + this._id + '_pageviewContainer').mouseup(function (e) {
                ins._raiseClientEvent("pageClick", e);
            });
            //timer
            this._scrollTimer = setInterval(function () { ins._pageviewscrollchanged(pageHeight) }, 500);
            ins._backgroundPage = 1;

            this._previousZoom = 1;
            ins._previousPage = ins._currentPage;
            this._pageLocation = new Array();
            this._renderedCanvasList = new Array();
            this._pageContents = new Array();
            this._pageText = new Array();
            this._textDivs = new Array();
            this._textContents = new Array();
            this._searchMatches = new Array();
            this._searchCollection = new Array();
            this._pageLocation[1] = 0;
            this._searchedPages = new Array();
            this._canvascount = this._totalPages;
            this._pointers = new Array();
            this._imageObj = new Array();
            this._pagesGot = new Array();
            this._designPageCanvas();
        },

        _designPageCanvas: function () {
            var cummulativepageheight = 5;
            var pageviewcontainer = $('#' + this._id + '_pageviewContainer');
            var pageViewerContainer = $('#' + this._id + '_viewerContainer');
            var pageViewline = $('#' + this._id + '_pageviewOuterline');
            var w = pageViewerContainer.width();
            var h = pageViewerContainer.height();
            var pageW = this._pageWidth;
            var pageH = this._pageHeight;
            var scaleX = 1;
            var scaleY = 1;
            scaleX = (w - 25) / pageW;
            scaleX = Math.min(1, scaleX);
            this._zoomVal = scaleX;
            for (var index = 1; index <= this._totalPages; index++) {
                var leftpos = (this.element.width() - this._pageSize[index - 1].PageWidth) / 2;
                if (leftpos < 0)
                    leftpos = 5;
                var imageDiv = ej.buildTag("div", "", {}, { id: this._id + 'pageDiv_' + index });
                pageviewcontainer.append(imageDiv);
                imageDiv.css("position", "absolute");
                imageDiv.css("top", this._zoomVal * cummulativepageheight);
                imageDiv.css("left", leftpos + "px");
                this._pageLocation[index] = cummulativepageheight;
                var imgwidth = '100%';
                var imgheight = '100%';
                var canvas = document.createElement('canvas');
                canvas.id = this._id +"pagecanvas_" + index;
                canvas.className = "e-pdfviewer-pageCanvas";
                canvas.style.height = this._zoomVal * this._pageSize[index - 1].PageHeight + 'px';
                canvas.style.width = this._zoomVal * this._pageSize[index - 1].PageWidth + 'px';
                canvas.height = this._zoomVal * this._pageSize[index - 1].PageHeight;
                canvas.style.backgroundColor = "white";
                canvas.width = this._zoomVal * this._pageSize[index - 1].PageWidth;
                imageDiv.append(canvas);

                var selectionlayer = document.createElement('div');
                selectionlayer.id = this._id +'selectioncanvas_' + index;
                selectionlayer.className = 'e-pdfviewer-selectiondiv';
                selectionlayer.style.height = canvas.height + 'px';
                selectionlayer.style.width = canvas.width + 'px';
                selectionlayer.style.position = 'absolute';
                selectionlayer.style.left = 0;
                selectionlayer.style.top = 0;
                selectionlayer.style.backgroundColor = 'transparent';
                selectionlayer.style.zIndex = '2';
                imageDiv.append(selectionlayer);
                //Setting border style for page canvas
                $('#' + this._id +'pagecanvas_' + index).css( 'box-shadow', '0px 0px 0px 1px #000000');
                //Add loading indicator in every page
                $('#' + this._id + 'pageDiv_' + index).ejWaitingPopup({ showOnInit: true });
                $('#' + this._id + 'pageDiv_' + index + '_WaitingPopup').appendTo($('#' + this._id + 'pageDiv_' + index)).css({ 'left': '0px', 'top': '0px', 'background-color': '#dbdbdb' });

                cummulativepageheight = parseFloat(cummulativepageheight) + parseFloat(this._pageSize[index - 1].PageHeight) + 8;
            }
            this._cummulativeHeight = cummulativepageheight;
        },

        _computeCurrentPage: function (pageHeight) {
            var sum = 0;
            var currentPageNum = 0;
            var vscrolBar = document.getElementById(this._id + '_viewerContainer');
            var vscrolvalue = vscrolBar.scrollTop;
            if (this._zoomVal != 1) {
                vscrolvalue = vscrolvalue + ((this._currentPage) * (8 - this._zoomVal * 8));
            }
            var pagevalue = 0;
            var pageupdatevalue = 0;
            var pagenumbervalue = { currentPageNumber: 0 };
            for (var i = 0; i < this._totalPages; i++) {
                if (this._isDestroyed)
                    return;
                if (sum > vscrolvalue) {
                    currentPageNum = i;

                    var currentpageheightinview = parseFloat(sum) - parseFloat(vscrolvalue);
                    var nextpageheightinview = this.element[0].parentElement.clientHeight - currentpageheightinview;
                    var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                    if (this.element[0].parentElement.clientHeight < ((this._pageSize[i - 1].PageHeight * this._zoomVal) + (this._pageSize[i].PageHeight * this._zoomVal)) && (parseInt(this._pageLocation[i] * this._zoomVal) < pageviewcontainer.scrollTop)) {
                        if (nextpageheightinview > currentpageheightinview) {
                            currentPageNum = parseFloat(currentPageNum) + 1;
                            this._renderPreviousPage = true;
                        }
                    }
                    this._renderPreviousPage = false;
                    break;
                }
                else {
                    sum = parseFloat(sum) + parseFloat(this._pageSize[i].PageHeight * this._zoomVal) + 8;
                }
                currentPageNum = i + 1;
            }

            $('#' + this._id + '_toolbarContainer span.e-pdfviewer-labelpageno').html(" / " + this._totalPages);
            pagevalue = document.getElementById(this._id + "_txtpageNo").value;
            $('#' + this._id + '_txtpageNo').val(currentPageNum);
            this._updatePageNavigation(currentPageNum, this._totalPages);
            pageupdatevalue = document.getElementById(this._id + "_txtpageNo").value;
            pagenumbervalue.currentPageNumber = pageupdatevalue;
            this._currentPage = currentPageNum;
            this.currentPageNumber = this._currentPage;
            if (pagevalue != pageupdatevalue) {
                this._raiseClientEvent("pageChange", pagenumbervalue);
            }
        },

        _pageviewscrollchanged: function (pageHeight) {
            var sum = 0;
            var currentPageNum = 0;
            var vscrolvalue = $('#' + this._id + '_viewerContainer').scrollTop();
            if (this._isTargetPage) {
                if (this.model.allowClientBuffering) {
                    this._isTargetPage = false;
                    this._isBuffering = true;
                    if (this._targetPage <= this._totalPages) {
                        var jsonString = { "viewerAction": this._viewerAction.getPageModel, "pageindex": this._targetPage.toString(), "enableOfflineMode": true, "isPageScrolled": "false" };
                        var proxy = this;
                        this._ajaxRequestState = $.ajax({
                            type: 'POST',
                            url: this.model.serviceUrl + '/Load',
                            crossDomain: true,
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            data: JSON.stringify(jsonString),
                            traditional: true,
                            success: function (data) {
                                if (typeof data === 'object')
                                    jsondata = JSON.parse(JSON.stringify(data));
                                else
                                    jsondata = JSON.parse(data);
                                jsondata = jsondata["pdf"];
                                var count = 0;
                                var isLoopBreak = false;
                                if (jsondata) {
                                    for (var i = proxy._targetPage; i <= proxy._totalPages; i++) {
                                        var backupjson = jsondata[i];
                                        if (backupjson) {
                                            proxy._pageContents[parseInt(backupjson["currentpage"])] = JSON.stringify(backupjson);
                                            proxy._pageText[parseInt(backupjson["currentpage"])] = backupjson["pageContents"];
                                            proxy._pagesGot.push(parseInt(backupjson["currentpage"]));
                                            count++;
                                        } else {
                                            isLoopBreak = true;
                                            break;
                                        }
                                    }
                                    if (backupjson == undefined && !isLoopBreak) {
                                        for (var i = proxy._targetPage; i <= proxy._totalPages; i++) {
                                            if (proxy._pagesGot.indexOf(i)) {
                                                count++;
                                            }
                                        }
                                    }
                                    if (count) {
                                        proxy._targetPage = proxy._targetPage + count;
                                    } else {
                                        proxy._targetPage = proxy._targetPage
                                    }
                                    proxy._isTargetPage = true;
                                    proxy._isBuffering = false;
                                }
                            },
                            error: function () {
                                if (!proxy._isLoadMethod) {
                                    proxy._ajaxRequestState = $.ajax({
                                        type: 'POST',
                                        url: proxy.model.serviceUrl + '/PostViewerAction',
                                        crossDomain: true,
                                        contentType: 'application/json; charset=utf-8',
                                        dataType: 'json',
                                        data: JSON.stringify(jsonString),
                                        traditional: true,
                                        success: function (data) {
                                            if (typeof data === 'object')
                                                jsondata = JSON.parse(JSON.stringify(data));
                                            else
                                                jsondata = JSON.parse(data);;
                                            for (var i = proxy._targetPage; i <= proxy._totalPages; i++) {
                                                var backupjson = jsondata;
                                                if (backupjson) {
                                                    proxy._pageContents[parseInt(backupjson["currentpage"])] = JSON.stringify(backupjson);
                                                    proxy._pageText[parseInt(backupjson["currentpage"])] = backupjson["pageContents"];
                                                } else
                                                    break;
                                            }
                                            proxy._targetPage = proxy._pageText.length;
                                            proxy._isTargetPage = true;
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            }
            if (vscrolvalue == this._previousPosition) {
                currentPageNum = this._currentPage;

                if (this._totalPages && this._previousPage != currentPageNum) {
                    var pagenumber = parseInt(currentPageNum);
                    this._previousPage = currentPageNum;
                    if (pagenumber >= 1 && pagenumber <= this._totalPages) {
                        if (!this._isJsondataAvailable) {
                            this._showloadingIndicator(true);
                            $('#' + this._id + '_toolbarContainer span.e-pdfviewer-labelpageno').html("");
                            $('#' + this._id + '_txtpageNo').val('0');
                        }
                        else {

                            $('#' + this._id + '_toolbarContainer span.e-pdfviewer-labelpageno').html(" / " + this._totalPages);
                            $('#' + this._id + '_txtpageNo').val(pagenumber);
                        }
                        this._currentPage = pagenumber;
                        this._updatePageNavigation(this._currentPage, this._totalPages);
                        if (this._renderedCanvasList.indexOf(parseInt(this._currentPage)) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && !this._pageContents[parseInt(this._currentPage)]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = this._currentPage.toString();
                                jsonResult["id"] = this._fileId;
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                    }
                }
            }
            if (this._renderedCanvasList.indexOf(parseInt(this._currentPage)) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && this._currentPage <= this._totalPages) {
                if (!this._pageContents[parseInt(this._currentPage)]) {
                    if (!this._scrollTriggered) {
                        this._scrollTriggered = true;
                        var jsonResult = new Object();
                        jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                        jsonResult["pageindex"] = this._currentPage.toString();
                        jsonResult["id"] = this._fileId;
                        if (this._pdfService == ej.PdfViewer.PdfService.Local)
                            this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                        else
                            this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                    }
                }
                else {
                    var jsdata = this._pageContents[parseInt(this._currentPage)];
                    this._drawPdfPage(jsdata);
                }
            }
            var nextpage = parseInt(this._currentPage) + 1;
            if (this.model.allowClientBuffering) {
                if (!this._renderPreviousPage) {
                    if (this._renderedCanvasList.indexOf(parseInt(this._currentPage) - 1) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && (parseInt(this._currentPage) - 1) > 0) {
                        if (!this._pageContents[parseInt(this._currentPage) - 1]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = (parseInt(this._currentPage) - 1).toString();
                                jsonResult["id"] = this._fileId;
                                if (this.model.allowClientBuffering) {
                                    jsonResult["isPageScrolled"] = true;
                                }
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(this._currentPage) - 1];
                            this._drawPdfPage(jsdata);
                        }
                    } else if (this._renderedCanvasList.indexOf(parseInt(nextpage)) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && nextpage <= this._totalPages) {
                        if (!this._pageContents[parseInt(nextpage)]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = nextpage.toString();
                                jsonResult["id"] = this._fileId;
                                if (this.model.allowClientBuffering) {
                                    var isTargetFire = true;
                                    if (!this._isPrintingProcess) {
                                        jsonResult["isPageScrolled"] = false;
                                    }
                                }
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult), isTargetFire);
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(nextpage)];
                            this._drawPdfPage(jsdata);
                        }
                    }
                }
                else {
                    if (this._renderedCanvasList.indexOf(parseInt(this._currentPage) - 1) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && (parseInt(this._currentPage) - 1) > 0) {
                        if (!this._pageContents[parseInt(this._currentPage) - 1]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = (parseInt(this._currentPage) - 1).toString();
                                jsonResult["id"] = this._fileId;
                                if (this.model.allowClientBuffering) {
                                    jsonResult["isPageScrolled"] = true;
                                }
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(this._currentPage) - 1];
                            this._drawPdfPage(jsdata);
                        }
                    }
                    else if (this._renderedCanvasList.indexOf(parseInt(nextpage)) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && nextpage <= this._totalPages) {
                        if (!this._pageContents[parseInt(nextpage)]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = nextpage.toString();
                                jsonResult["id"] = this._fileId;
                                if (this.model.allowClientBuffering) {
                                    jsonResult["isPageScrolled"] = true;
                                }
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(nextpage)];
                            this._drawPdfPage(jsdata);
                        }
                    }
                }
            } else {
                if (!this._renderPreviousPage) {
                    if (this._renderedCanvasList.indexOf(parseInt(nextpage)) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && nextpage <= this._totalPages) {
                        if (!this._pageContents[parseInt(nextpage)]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = nextpage.toString();
                                jsonResult["id"] = this._fileId;
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(nextpage)];
                            this._drawPdfPage(jsdata);
                        }
                    }
                    else if (this._renderedCanvasList.indexOf(parseInt(this._currentPage) - 1) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && (parseInt(this._currentPage) - 1) > 0) {
                        if (!this._pageContents[parseInt(this._currentPage) - 1]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = (parseInt(this._currentPage) - 1).toString();
                                jsonResult["id"] = this._fileId;
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(this._currentPage) - 1];
                            this._drawPdfPage(jsdata);
                        }
                    }
                }
                else {
                    if (this._renderedCanvasList.indexOf(parseInt(this._currentPage) - 1) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && (parseInt(this._currentPage) - 1) > 0) {
                        if (!this._pageContents[parseInt(this._currentPage) - 1]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = (parseInt(this._currentPage) - 1).toString();
                                jsonResult["id"] = this._fileId;
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(this._currentPage) - 1];
                            this._drawPdfPage(jsdata);
                        }
                    }
                    else if (this._renderedCanvasList.indexOf(parseInt(nextpage)) == -1 && (!this._scrollTriggered || this.model.allowClientBuffering) && nextpage <= this._totalPages) {
                        if (!this._pageContents[parseInt(nextpage)]) {
                            if (!this._scrollTriggered) {
                                this._scrollTriggered = true;
                                var jsonResult = new Object();
                                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                                jsonResult["pageindex"] = nextpage.toString();
                                jsonResult["id"] = this._fileId;
                                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                    this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                                else
                                    this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                            }
                        }
                        else {
                            var jsdata = this._pageContents[parseInt(nextpage)];
                            this._drawPdfPage(jsdata);
                        }
                    }
                }
            }
            this._previousPosition = vscrolvalue;
            var proxy = this;
            setTimeout(function () {
                $('.e-pdfviewer-formFields').show();
                if (proxy._selectionRange != null && !proxy._displaySearch) {
                    proxy._selectionNodes.addRange(proxy._selectionRange);
                    proxy._selectionRange = null;
                    proxy._selectionNodes = null;
                }
            }, 5000);
        },

        _doAjaxPostscroll: function (type, url, jsonResult, isTargetFire) {
            var proxy = this;
            if (this._ajaxRequestState != null) {
                this._ajaxRequestState.abort();
                this._ajaxRequestState = null;
            }
            ($.ajax({                
                type: type,
                url: url,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: jsonResult,
                traditional: true,
                success: function (data) {
                    if (typeof data === 'object')
                        proxy._drawPdfPage(JSON.stringify(data));
                    else
                        proxy._drawPdfPage(data);
                    proxy._scrollTriggered = false;
                    if (isTargetFire) {
                        if (proxy.model.allowClientBuffering) {
                            if (typeof data === 'object')
                                var jsonData = JSON.parse(JSON.stringify(data));
                            else
                                var jsonData = JSON.parse(data);
                            proxy._pagesGot.push(parseInt(jsonData["currentpage"]));
                            if (parseInt(jsonData["currentpage"]) <= proxy._totalPages) {
                                proxy._targetPage = jsonData["currentpage"] + 1;
                                proxy._isTargetPage = true;
                            }
                        }
                    }
                },
                error: function (msg, textStatus, errorThrown) {
                    if (!proxy._isLoadMethod) {
                        $.ajax({
                            type: type,
                            url: proxy.model.serviceUrl + "/PostViewerAction",
                            crossDomain: true,
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            data: jsonResult,
                            traditional: true,
                            success: function (data) {
                                if (typeof data === 'object')
                                    proxy._drawPdfPage(JSON.stringify(data));
                                else
                                    proxy._drawPdfPage(data);
                                proxy._scrollTriggered = false;
                            },
                            error: function (msg, textStatus, errorThrown) {
                                if (msg.readyState == 0) {
                                    return;
                                }
                                alert('Exception' + msg.responseText);
                            }
                        });
                    }
                }
            }));
        },

        _drawPdfPage: function (jsondata) {
            var backupjson = jsondata;
            if (this._pdfService == ej.PdfViewer.PdfService.Local)
                jsondata = JSON.parse(jsondata);
            else
                jsondata = JSON.parse(jsondata["d"]);
            this._renderedCanvasList.push(parseInt(jsondata["currentpage"]));
            var pageindex = parseInt(jsondata["currentpage"]);
            if (!this._isWindowResizing)
                this._showPageLoadingIndicator(pageindex, true);
            var pageimageList = jsondata["imagestream"];
            var canvas = document.getElementById(this._id + 'pagecanvas_' + parseInt(jsondata["currentpage"]));
            if (canvas) {
                var context = canvas.getContext('2d');
                this._pageContents[parseInt(jsondata["currentpage"])] = backupjson;
                this._pageText[parseInt(jsondata["currentpage"])] = jsondata["pageContents"];
                this._imageObj = new Array();
                if (!$('#' + this._id + 'selectioncanvas_' + pageindex).hasClass('text_container')) {
                    this._textSelection(jsondata, pageindex, context);
                } else {
                    this._resizeSelection(jsondata, pageindex, context);
                }
                if (!$('#' + this._id + 'selectioncanvas_' + pageindex).hasClass('input_container')) {
                    this._createFormFields(jsondata, pageindex);
                } else {
                    this._generateFormFields(jsondata, pageindex);
                }
                if (this._isTextSearch) {
                    var proxy = this;
                    setTimeout(function () {
                        proxy._isPageScrollHighlight = true;
                        proxy._isPageScrolledForSearch = true;
                        proxy._highlightOtherOccurrences();
                    }, 100)
                }
                // Hyperlink
                var children = $('#' + this._id + 'selectioncanvas_' + pageindex).children();
                for (i = 0; i < children.length; i++) {
                    if (children[i].hasAttribute('href'))
                        $(children[i]).remove();
                }
                var linkannot = jsondata["linkannotation"];
                var documentlinkpagenumber = jsondata["annotpagenum"];
                var ins = this;
                if (this.model.enableHyperlink) {
                    for (var l = 0; l < linkannot.length; l++) {
                        var aTag = document.createElement('a');
                        aTag.id = 'linkdiv_' + l;
                        var rect = linkannot[l].AnnotRectangle;
                        aTag.style.background = 'transparent';
                        aTag.style.position = 'absolute';
                        aTag.style.left = this._convertPointToPixel(rect.Left * this._zoomVal) + 'px';
                        aTag.style.top = this._convertPointToPixel(rect.Top * this._zoomVal) + 'px';
                        aTag.style.width = this._convertPointToPixel(rect.Width * this._zoomVal) + 'px';
                        aTag.style.height = this._convertPointToPixel(rect.Height * this._zoomVal) + 'px';
                        aTag.style.color = 'transparent';
                        if (linkannot[l].URI.indexOf("mailto:") != -1) {
                            var mail = linkannot[l].URI.substring(linkannot[l].URI.indexOf("mailto:"), linkannot[l].URI.length);
                            aTag.title = mail;
                            aTag.setAttribute('href', mail);
                        } else {
                            aTag.title = linkannot[l].URI;
                            aTag.setAttribute('href', linkannot[l].URI);
                        }
                        if (this.model.hyperlinkOpenState == ej.PdfViewer.LinkTarget.Default) {
                            aTag.target = "_self";
                            aTag.onclick = function () {
                                var hyperlink = { hyperlink: this.href }
                                ins._raiseClientEvent("hyperlinkClick", hyperlink);
                            }
                        } else if (this.model.hyperlinkOpenState == ej.PdfViewer.LinkTarget.NewTab) {
                            aTag.target = "_blank";
                            aTag.onclick = function () {
                                var hyperlink = { hyperlink: this.href }
                                ins._raiseClientEvent("hyperlinkClick", hyperlink);

                            }
                        } else if (this.model.hyperlinkOpenState == ej.PdfViewer.LinkTarget.NewWindow) {

                            aTag.onclick = function () {
                                var hyperlink = { hyperlink: this.href }
                                ins._raiseClientEvent("hyperlinkClick", hyperlink);
                                window.open(this.href, '_blank', 'scrollbars=yes,resizable=yes');
                                return false;
                            }
                        }
                        if (documentlinkpagenumber[l] != undefined) {
                            var destPageHeight = (this._pageSize[pageindex - 1].PageHeight);
                            var destAnnotLoc = this._convertPointToPixel(linkannot[l].AnnotLocation);
                            var dest = (destPageHeight - destAnnotLoc);
                            var scrollvalue = (parseFloat(this._pageLocation[documentlinkpagenumber[l]] * this._zoomVal)) + parseFloat(dest * this._zoomVal);
                            aTag.name = scrollvalue;
                            aTag.onclick = function () {
                                var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                                pageviewcontainer.scrollTop = this.name;
                                return false;
                            }
                        }
                        var selectioncanvas = document.getElementById(this._id + 'selectioncanvas_' + pageindex);
                        selectioncanvas.appendChild(aTag);
                    }
                }
                //Hyperlink

                var index = parseInt(jsondata["currentpage"]);
                var imageObjCollection = new Array();
                var imageTransformCollection = new Array();
                var imageDataCollection = new Array();
                var currentIndexCollection = new Array();
                var pageDataCollection = new Array();
                var zoomFactor;
                var browserUserAgent = navigator.userAgent;
                var offsett;
                var imageIndex = 0;

                var charPath = new Array();
                var shapes = pageimageList["textelements"];
                for (var j = 0; j < shapes.length; j++) {
                    var pathdata = shapes[j];
                    var color = pathdata["color"];
                    var matrix = pathdata["matrix"];
                    if (matrix != null)
                        matrix = matrix["Elements"];
                    var brushMode = pathdata["brush"];
                    var pathValue = pathdata["pathValue"];
                    var isClipping = pathdata["iscliping"];
                    var restoreCanvas = pathdata["restorecanvas"];
                    var imageData = pathdata["imagedata"];
                    var fillMode = pathdata["fillrule"];
                    var fillStroke = pathdata["isFillandStroke"];
                    var fillColor = pathdata["fillcolor"];
                    var strokeColor = pathdata["strokecolor"];
                    var lineWidth = pathdata["linewidth"];
                    var lineCap = pathdata["linecap"];
                    var linearGradient = pathdata["linearGradientBrush"];
                    var charID = pathdata["charID"];
                    var rectangle = pathdata["rectvalue"];
                    if (pathValue != null) {
                        pathValue = pathValue.split(";");
                        if (charID)
                            charPath[charID] = pathValue;
                    }
                    else if (pathValue == null && charID) {
                        pathValue = charPath[charID];
                    }
                    if (restoreCanvas == false) {
                        context.save();
                    }
                    if (pathValue != undefined) {
                        context.setTransform(matrix[0] * this._zoomVal, matrix[1] * this._zoomVal, matrix[2] * this._zoomVal, matrix[3] * this._zoomVal, matrix[4] * this._zoomVal, matrix[5] * this._zoomVal);
                    }
                    if (pathValue != null) {
                        context.beginPath();

                        for (var i = 0; i < pathValue.length; i++) {
                            var val = pathValue[i];
                            var pathType = val[0];
                            if (pathType == "M") {
                                val = val.substring(1, val.length);
                                val = val.split(" ");
                                context.moveTo((val[0]), val[1]);
                            }
                            else if (pathType == "L") {
                                val = val.substring(1, val.length);
                                val = val.split(" ");
                                context.lineTo((val[0]), val[1]);
                            }
                            else if (pathType == "C") {
                                val = val.substring(1, val.length);
                                val = val.split(" ");
                                context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
                            }
                            else if (pathType == "Z") {
                                context.closePath();
                            }
                        }
                        if (isClipping == true) {
                            if (fillMode == "evenodd")
                                context.msFillRule = "evenodd";
                            context.clip();

                        }
                        else {
                            if (fillStroke == undefined) {
                                if (brushMode == "Fill") {
                                    if (linearGradient != undefined) {
                                        context.fillStyle = this._getGradientBrush(linearGradient, context);
                                    }
                                    else
                                        context.fillStyle = color;
                                    if (fillMode == "evenodd")
                                        context.msFillRule = "evenodd";
                                    context.fill();
                                }
                                else if (brushMode == "FillandStroke") {
                                    context.fillStyle = color;
                                    context.fill();
                                    context.strokeStyle = strokeColor;
                                    context.stroke();
                                }
                                else if (brushMode == "Stroke") {
                                    context.strokeStyle = strokeColor;
                                    context.lineWidth = lineWidth;
                                    context.lineCap = lineCap;
                                    context.stroke();
                                }
                                else {
                                    context.strokeStyle = color;
                                    context.lineWidth = lineWidth;
                                    context.lineCap = lineCap;
                                    context.stroke();
                                }
                            }
                            else {
                                context.strokeStyle = strokeColor;
                                context.lineWidth = lineWidth;
                                context.lineCap = lineCap;
                                context.stroke();
                                if (linearGradient != undefined) {
                                    context.fillStyle = this._getGradientBrush(linearGradient, context);
                                }
                                else
                                    context.fillStyle = fillColor;
                                if (fillMode == "evenodd")
                                    context.msFillRule = "evenodd";
                                context.fill();
                            }
                        }
                    }

                    if (restoreCanvas)
                        context.restore();
                    if (imageData != undefined) {
                        if ((offsett = browserUserAgent.indexOf("Firefox")) != -1 || (offsett = browserUserAgent.indexOf("Chrome")) != -1 || (offsett = browserUserAgent.indexOf("Safari")) != -1 || (offsett = browserUserAgent.indexOf("AppleWebKit")) != -1) {
                            imageObjCollection.push(imageData);
                            imageTransformCollection.push(matrix);
                            pageDataCollection.push(shapes);
                            currentIndexCollection.push(j);
                            zoomFactor = this._zoomVal;
                            this._isContainImage = true;
                            break;
                        }
                        else {
                            var imageObj = new Image();
                            imageObj.src = imageData;
                            context.setTransform(matrix[0] * this._zoomVal, matrix[1], matrix[2], matrix[3] * this._zoomVal, matrix[4] * this._zoomVal, matrix[5] * this._zoomVal);
                            context.drawImage(imageObj, 0, 0, 1, 1);
                        }
                    }
                }

                if ((offsett = browserUserAgent.indexOf("Firefox")) != -1 || (offsett = browserUserAgent.indexOf("Chrome")) != -1 || (offsett = browserUserAgent.indexOf("Safari")) != -1 || (offsett = browserUserAgent.indexOf("AppleWebKit")) != -1) {
                    for (var k = 0; k < imageObjCollection.length; k++) {
                        this._imageRendering(shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, k, pageDataCollection, currentIndexCollection, charPath, canvas, index, imageIndex);
                        imageIndex++;
                    }
                }
                this._showPageLoadingIndicator(pageindex, false);
                return canvas;
            }
        },

        _convertPointToPixel: function (value) {
            return (parseFloat(value) * (96 / 72));
        },

        _getRandomNum: function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        },

        _createGUID: function () {
            var guid;
            return guid = (this._getRandomNum() + this._getRandomNum() + "-" + this._getRandomNum() + "-4" + this._getRandomNum().substr(0, 3) + "-" + this._getRandomNum() + this._getRandomNum() + this._getRandomNum()).toLowerCase();
        },

        _createFormFields: function (jsondata, pageindex) {
            var TextBoxField = jsondata["PdfRenderedFields"];
            var browserUserAgent = navigator.userAgent;
            var backgroundcolor;
            var proxy = this;
            if (TextBoxField != null) {
                for (var l = 0; l < TextBoxField.length; l++) {
                    var inputdiv;
                    if ((TextBoxField[l].PageIndex + 1) == pageindex) {
                        var boundingRect = TextBoxField[l].LineBounds;
                        if (TextBoxField[l].Name == "Textbox") {
                            inputdiv = document.createElement("input");
                            inputdiv.type = "text";
                            var backColor = TextBoxField[l].BackColor;
                            var foreColor = TextBoxField[l].FontColor;
                            $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                            $(inputdiv).css("color", "rgb(" + foreColor.R + "," + foreColor.G + "," + foreColor.B + ")");
                            $(inputdiv).css("border-width", TextBoxField[l].BorderWidth);
                            $(inputdiv).attr("name", TextBoxField[l].FieldName);
                            var fontSize = this._convertPointToPixel(TextBoxField[l].Font.Height * this._zoomVal) + 'px';
                            if (TextBoxField[l].MaxLength > 0) {
                                $(inputdiv).attr("maxlength", TextBoxField[l].MaxLength);
                                $(inputdiv).css("letter-spacing", fontSize);
                            }
                            if (TextBoxField[l].Text != "")
                                $(inputdiv).val(TextBoxField[l].Text);
                            else
                                $(inputdiv).val('');
                        }
                        else if (TextBoxField[l].Name == "Password") {
                            inputdiv = document.createElement("input");
                            inputdiv.type = "password";
                            var backColor = TextBoxField[l].BackColor;
                            var foreColor = TextBoxField[l].FontColor;
                            $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                            $(inputdiv).css("color", "rgb(" + foreColor.R + "," + foreColor.G + "," + foreColor.B + ")");
                            $(inputdiv).css("border-width", TextBoxField[l].BorderWidth);
                            $(inputdiv).attr("name", TextBoxField[l].FieldName);
                            var fontSize = this._convertPointToPixel(TextBoxField[l].Font.Height * this._zoomVal) + 'px';
                            if (TextBoxField[l].MaxLength > 0) {
                                $(inputdiv).attr("maxlength", TextBoxField[l].MaxLength);
                                $(inputdiv).css("letter-spacing", fontSize);
                            }
                            if (TextBoxField[l].Text != "")
                                $(inputdiv).val(TextBoxField[l].Text);
                            else
                                $(inputdiv).val('');
                        }
                        else if (TextBoxField[l].Name == "RadioButton") {
                            inputdiv = document.createElement("input");
                            inputdiv.type = "radio";
                            $(inputdiv).css('border-width', TextBoxField[l].BorderWidth);
                            if (TextBoxField[l].Selected == true)
                                $(inputdiv).prop("checked", true);
                            $(inputdiv).val(TextBoxField[l].Value);
                            $(inputdiv).attr("name", TextBoxField[l].GroupName);
                            $(inputdiv).css("cursor", "pointer");
                            if (browserUserAgent.indexOf('Chrome') != -1)
                                $(inputdiv).css("-webkit-apperance", "none");
                        }
                        else if (TextBoxField[l].Name == "CheckBox") {
                            inputdiv = document.createElement("input");
                            inputdiv.type = "checkbox";
                            $(inputdiv).css('border-width', TextBoxField[l].BorderWidth);
                            if (TextBoxField[l].Selected == true)
                                $(inputdiv).prop('checked', true);
                            else if (browserUserAgent.indexOf('Chrome') != -1)
                                $(inputdiv).css("-webkit-appearance", "none");
                            $(inputdiv).attr("name", TextBoxField[l].GroupName);
                            var backColor = TextBoxField[l].BackColor;
                            $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                            $(inputdiv).css("cursor", "pointer");
                        }
                        else if (TextBoxField[l].Name == "DropDown") {
                            inputdiv = document.createElement("select");
                            $(inputdiv).attr("name", TextBoxField[l].Text);
                            if (TextBoxField[l].SelectedValue == "") {
                                var option = document.createElement("option");
                                option.id = "dropdownhide";
                                $(option).css("display", "none");
                                option.selected = "selected";
                                option.innerHTML = "";
                                inputdiv.appendChild(option);
                            }
                            for (var j = 0; j < TextBoxField[l].TextList.length; j++) {
                                var option = document.createElement("option");
                                option.className = "e-dropdownSelect";
                                if (TextBoxField[l].SelectedValue == TextBoxField[l].TextList[j])
                                    $(option).prop("selected", true);
                                else
                                    $(option).prop("selected", false);
                                option.innerHTML = TextBoxField[l].TextList[j];
                                inputdiv.appendChild(option);
                            }
                            var backColor = TextBoxField[l].BackColor;
                            $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                        }
                        else if (TextBoxField[l].Name == "ListBox") {
                            inputdiv = document.createElement("select");
                            $(inputdiv).attr("multiple", "multiple");
                            $(inputdiv).attr("name", TextBoxField[l].Text);
                            for (var j = 0; j < TextBoxField[l].TextList.length; j++) {
                                var option = document.createElement("option");
                                option.className = "e-pdfviewer-ListBox"
                                for (var k = 0; k < TextBoxField[l].SelectedList.length; k++) {
                                    if (TextBoxField[l].SelectedList[k] == j)
                                        $(option).prop("selected", true);
                                }
                                option.innerHTML = TextBoxField[l].TextList[j];
                                inputdiv.appendChild(option);
                                var backColor = TextBoxField[l].BackColor;
                                $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                            }
                        }
                        if (TextBoxField[l].Font != null) {
                            if (TextBoxField[l].Font.Bold || TextBoxField[l].Font.Italic || TextBoxField[l].Font.Strikeout ||
                                 TextBoxField[l].Font.Underline) {
                                if (TextBoxField[l].Font.Italic)
                                    inputdiv.style.fontStyle = "italic";
                                if (TextBoxField[l].Font.Bold)
                                    inputdiv.style.fontWeight = "Bold";
                            }
                            $(inputdiv).css("font-family", TextBoxField[l].Font.Name);
                            var heights = this._convertPointToPixel(TextBoxField[l].Font.Height * this._zoomVal) + 'px';
                            $(inputdiv).css("font-size", heights);
                        }
                        inputdiv.id = this._id + 'input_' + pageindex + '_' + l;
                        inputdiv.className = 'e-pdfviewer-formFields';
                        inputdiv.style.margin = "0px";
                        inputdiv.style.zIndex = 1000;
                        inputdiv.style.left = this._convertPointToPixel(boundingRect.X * this._zoomVal) + 'px';
                        inputdiv.style.top = this._convertPointToPixel(boundingRect.Y * this._zoomVal) + 'px';
                        inputdiv.style.width = this._convertPointToPixel(boundingRect.Width * this._zoomVal) + 'px';
                        inputdiv.style.height = this._convertPointToPixel(boundingRect.Height * this._zoomVal) + 'px';
                        inputdiv.style.position = 'absolute';
                        var selectioncanvas = document.getElementById(this._id + 'selectioncanvas_' + pageindex);
                        $('#' + this._id + 'selectioncanvas_' + pageindex).addClass('input_container');
                        selectioncanvas.appendChild(inputdiv);
                        var borderwidth;
                        var proxy = this;
                        var is_chrome = navigator.userAgent.indexOf('Chrome') != -1;
                        $(inputdiv).on("focus", function (e) {
                            var type = $(e.target).attr('type');
                            var list = $(e.target)[0].type;
                            var backgroundColour = $(e.target).css("background-color");
                            var currentIndex = backgroundColour.lastIndexOf(',');
                            var color = backgroundColour.slice(0, currentIndex + 1) + 0 + ")";
                            if (type = "checkbox" && is_chrome)
                                $(e.target).css("-webkit-appearance", "");
                            $(e.target).css("background-color", color);
                            borderwidth = $(inputdiv).css('border-width');
                            $(e.target).css('border-width', '0');
                            proxy._isFormFields = true;
                        });
                        $(inputdiv).on("blur", function (e) {
                            var type = $(e.target).attr('type');
                            var list = $(e.target)[0].type;
                            if (is_chrome)
                                var backgroundColour = $(e.target).css("background-color");
                            else
                                var backgroundColour = e.target.style["background-color"];
                            var currentIndex = backgroundColour.lastIndexOf(',');
                            if (type == "checkbox" && $(e.target).prop("selected") == true) {
                                var colors = backgroundColour.slice(0, currentIndex + 1) + 0 + ")";
                                $(e.target).css("background-color", colors);
                            }
                            else {
                                var color = backgroundColour.slice(0, currentIndex + 1) + 0.2 + ")";
                                $(e.target).css("background-color", color);
                            }
                            $(e.target).css('border-width', borderwidth);
                            proxy._isFormFields = false;
                        });
                        $(inputdiv).unbind('click').on("click touchstart", function (e) {
                            var type = $(e.target).attr('type');
                            var list = $(e.target)[0].type;
                            if (type == "password" || type == "text") {
                                $(e.target).select();
                                var target = $(e.target)[0];
                                $(target).on('keypress', function (e) {
                                    var MaxLength = $(target).attr("maxlength");
                                    if ($(target).val().length > (MaxLength - 2)) {
                                        var value = $(target).val() + String.fromCharCode(e.keyCode);
                                        $(target).val(value);
                                        $(target).blur();

                                    }
                                });
                                $(target).unbind('change').on("change", function (e) {
                                    var value = $(target).val();
                                    $(target).val(value);
                                });
                            }
                            if (type == "radio") {
                                var name = $(e.target).attr("name");
                                var radioButton = $('.e-pdfviewer-formFields:radio');
                                for (var m = 0; m < radioButton.length; m++) {
                                    if ($(radioButton[m]).attr("name") == name) {
                                        $(radioButton[m]).prop("checked", false);
                                    }
                                }
                                $(e.target).prop("checked", true);
                            }
                            else if (type == "checkbox") {
                                if ($(e.target).prop("checked") == true) {
                                    $(e.target).prop("checked", true);
                                    if (is_chrome)
                                        $(e.target).css("-webkit-appearance", "");
                                }
                                else {
                                    $(e.target).prop("checked", false);
                                    if (is_chrome)
                                        $(e.target).css("-webkit-appearance", "none");
                                }
                            }
                            else if (list == "select-one") {
                                var target = $(e.target)[0];
                                $(target).unbind('change').on("change", function (e) {
                                    var target = $(e.target)[0];
                                    var value = target.options[target.selectedIndex].text;
                                    var childrens = target.children;
                                    for (var k = 0; k < childrens.length; k++) {
                                        if (childrens[k].text == value)
                                            $(childrens[k]).prop("selected", true);
                                        else
                                            $(childrens[k]).prop("selected", false);
                                    }
                                });
                            }
                        });
                    }
                }
            }
        },
        _saveFormFieldsValue: function () {
            var result = {};
            var values = {};
            $('#' + this._id + '_toolbar_download').parent().parents(".e-pdfviewer-toolbarul").css("visibility", "");
            var input = $('.e-pdfviewer-formFields');
            if (input != null) {
                for (var i = 0; i < input.length; i++) {
                    if (input[i].type == "text" || input[i].type == "password")
                        result[input[i].name] = input[i].value;
                    else if (input[i].type == "radio" && $(input[i]).prop("checked") == true)
                        result[input[i].name] = input[i].value;
                    else if (input[i].type == "checkbox") {
                        if ($(input[i]).prop("checked") == true)
                            result[input[i].name] = $(input[i]).prop("checked");
                        else
                            result[input[i].name] = $(input[i]).prop("checked");
                    }
                    else if (input[i].type == "select-one") {
                        result[input[i].name] = input[i].options[input[i].selectedIndex].text;
                    }
                    else if (input[i].type == "select-multiple") {
                        var text = [];
                        var children = $(input[i]).children();
                        for (var j = 0; j < children.length; j++) {
                            if ($(children[j]).prop("selected") == true)
                                text.push(children[j].text);
                        }
                        text = JSON.stringify(text);
                        result[input[i].name] = text;
                    }
                }
            }
            values["savedFields"] = JSON.stringify(result);
            values["Download"] = this.fileName;
            this._saveAs("POST", this.model.serviceUrl, JSON.stringify(values));
        },
        _saveAs: function (type, actionUrl, data) {
            var proxy = this;
            ($.ajax({
                type: type,
                url: actionUrl + "/Download",
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: data,
                traditional: true,
                aync: false,
                success: function (data) {
                    proxy._save(data);
                },
                error: function () {
                    if (!proxy._isLoadMethod) {
                        $.ajax({
                            type: type,
                            url: proxy.model.serviceUrl + "/DocumentDownloadAction",
                            crossDomain: true,
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            data: data,
                            traditional: true,
                            aync: false,
                            success: function (data) {
                                proxy._save(data);
                            }
                        });
                    }
                }
            }))
        },
        _generateFormFields: function (jsondata, pageindex) {
            var TextBoxField = jsondata["PdfRenderedFields"];
            var backgroundcolor;
            if (TextBoxField != null) {
                for (var l = 0; l < TextBoxField.length; l++) {
                    var boundingRect = TextBoxField[l].LineBounds;
                    var inputdiv = document.getElementById(this._id + 'input_' + pageindex + '_' + l);
                    if ((TextBoxField[l].PageIndex + 1) == pageindex) {
                        if (TextBoxField[l].Name == "Password" || TextBoxField[l].Name == "Textbox") {
                            var backColor = TextBoxField[l].BackColor;
                            var foreColor = TextBoxField[l].FontColor;
                            $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                            $(inputdiv).css("color", "rgb(" + foreColor.R + "," + foreColor.G + "," + foreColor.B + ")");
                            $(inputdiv).css("border-width", TextBoxField[l].BorderWidth);
                            var fontSize = this._convertPointToPixel(TextBoxField[l].Font.Height * this._zoomVal) + 'px';
                            if (TextBoxField[l].MaxLength > 0) {
                                $(inputdiv).attr("maxlength", TextBoxField[l].MaxLength);
                                $(inputdiv).css("letter-spacing", fontSize);
                            }
                            var value = $(inputdiv).val();
                            $(inputdiv).val(value);
                        }
                        else if (TextBoxField[l].Name == "RadioButton") {
                            $(inputdiv).css('border-width', TextBoxField[l].BorderWidth);
                            if ($(inputdiv).prop("checked") == true)
                                $(inputdiv).prop("checked", true);
                            $(inputdiv).attr("name", TextBoxField[l].GroupName);
                            $(inputdiv).css("cursor", "pointer");
                        }
                        else if (TextBoxField[l].Name == "CheckBox") {
                            $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                            $(inputdiv).css('border-width', TextBoxField[l].BorderWidth);
                            if ($(inputdiv).prop("checked") == true)
                                $(inputdiv).prop('checked', true);
                            $(inputdiv).css("cursor", "pointer");
                        }
                        else if (TextBoxField[l].Name == "DropDown") {
                            if (TextBoxField[l].SelectedValue == "") {
                                var option = $(inputdiv).children()[0];
                                option.id = "dropdownhide";
                                $(option).css("display", "none");
                                if ($(option).prop("selected") == true)
                                    $(option).prop('selected', true);
                                option.innerHTML = "";
                            }
                            for (var j = 0; j < TextBoxField[l].TextList.length; j++) {
                                var option;
                                if ($(inputdiv).children()[0].id == "dropdownhide")
                                    option = $(inputdiv).children()[j + 1];
                                else
                                    option = $(inputdiv).children()[j];
                                if ($(option).prop("selected") == true)
                                    $(option).prop('selected', true);
                                option.innerHTML = TextBoxField[l].TextList[j];
                                var backColor = TextBoxField[l].BackColor;
                                $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                            }
                        }
                        else if (TextBoxField[l].Name == "ListBox") {
                            $(inputdiv).attr("multiple", "multiple");
                            for (var j = 0; j < TextBoxField[l].TextList.length; j++) {
                                var option = $(inputdiv).children()[j];
                                if ($(option).prop("selected") == true)
                                    $(option).prop('selected', true);
                                else
                                    $(option).prop('selected', false);
                                option.innerHTML = TextBoxField[l].TextList[j];
                                var backColor = TextBoxField[l].BackColor;
                                $(inputdiv).css("background-color", "rgba(" + backColor.R + "," + backColor.G + "," + backColor.B + "," + 0.2 + ")");
                            }
                        }
                        if (TextBoxField[l].Font != null) {
                            if (TextBoxField[l].Font.Bold || TextBoxField[l].Font.Italic || TextBoxField[l].Font.Strikeout ||
                                 TextBoxField[l].Font.Underline) {
                                if (TextBoxField[l].Font.Italic)
                                    inputdiv.style.fontStyle = "italic";
                                if (TextBoxField[l].Font.Bold)
                                    inputdiv.style.fontWeight = "Bold";
                            }
                            $(inputdiv).css("font-family", TextBoxField[l].Font.Name);
                            var heights = this._convertPointToPixel(TextBoxField[l].Font.Height * this._zoomVal) + 'px';
                            $(inputdiv).css("font-size", heights);
                        }
                        inputdiv.style.margin = "0px";
                        inputdiv.style.zIndex = 1000;
                        inputdiv.style.left = this._convertPointToPixel(boundingRect.X * this._zoomVal) + 'px';
                        inputdiv.style.top = this._convertPointToPixel(boundingRect.Y * this._zoomVal) + 'px';
                        inputdiv.style.width = this._convertPointToPixel(boundingRect.Width * this._zoomVal) + 'px';
                        inputdiv.style.height = this._convertPointToPixel(boundingRect.Height * this._zoomVal) + 'px';
                        inputdiv.style.position = 'absolute';
                    }
                }
            }
        },

        _textSelection: function (jsondata, pageindex, context) {
            //Text selection line by line
            var is_edge = navigator.userAgent.indexOf("Edge") != -1;
            var is_edgeNew = document.documentMode || /Edge/.test(navigator.userAgent);
            var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
            var selectionlines = jsondata["selection"];
            var textDivs = [];
            var textContents = [];
            for (var l = 0; l < selectionlines.length; l++) {
                var innerText = " ";
                var boundingRect = selectionlines[l].LineBounds;
                var textdiv = document.createElement("DIV");
                textdiv.id = this._id +'text_' + pageindex + '_' + l;
                textdiv.className = 'e-pdfviewer-textLayer';
                var text = selectionlines[l].Line;
				textContents.push(selectionlines[l].Line.toString());
                text = text.replace(/</g, "&lt;");
                text = text.replace(/>/g, "&gt;");
                if (is_edgeNew && !is_ie) {
                    textdiv.innerHTML = text;
                }
                else {
                    if (this._previousBounds == parseInt(boundingRect.Y) || this._previousBounds == parseInt((boundingRect.Y) + 1) || this._previousBounds == parseInt((boundingRect.Y) - 1)) {
                        innerText = document.getElementById(this._id +'text_' + pageindex + '_' + (l - 1));
                        if (innerText.innerHTML != " ")
                            innerText.innerHTML = innerText.innerHTML.replace(/(\r\n|\n|\r)/gm, "");
                    }
                    this._previousBounds = parseInt(boundingRect.Y);
                    textdiv.innerHTML = text + "\r\n";
                }
                var newLines = text.replace(/  +/g, ' ');
                if (newLines != " ") {
                    textdiv.style.whiteSpace = 'pre';
                }
                textdiv.style.background = 'transparent';
                textdiv.style.position = 'absolute';
                textdiv.style.left = this._convertPointToPixel(boundingRect.X * this._zoomVal) + 'px';
                textdiv.style.top = this._convertPointToPixel(boundingRect.Y * this._zoomVal) + 'px';
                textdiv.style.width = this._convertPointToPixel(boundingRect.Width * this._zoomVal) + 'px';
                textdiv.style.color = 'transparent';
                textdiv.style.fontSize = this._convertPointToPixel(boundingRect.Height * this._zoomVal) + 'px';
                textdiv.style.fontFamily = 'sans-serif';
                textdiv.style.whiteSpace = 'pre';
                textdiv.style.opacity = '0.2';
                textdiv.style.transformOrigin = '0%';
                //settting the properties of div to context to calculate the width of the text in canvas
                context.fontFamily = 'sans-serif'
                context.fontSize = textdiv.style.fontSize;
                context.font = textdiv.style.fontSize + " " + textdiv.style.fontFamily;
                //scaling the div to match the width of the line in canvas
                var ctxwidth = context.measureText(selectionlines[l].Line).width;
                var scale = parseFloat(textdiv.style.width) / ctxwidth;
                textdiv.style.transform = 'scaleX(' + scale + ')';
                var selectioncanvas = document.getElementById(this._id +'selectioncanvas_' + pageindex);
                $('#' +this._id +'selectioncanvas_' + pageindex).addClass('text_container');
                selectioncanvas.appendChild(textdiv);
                var selectioncanvasWidth = selectioncanvas.getBoundingClientRect();
                var textDivWidth = textdiv.getBoundingClientRect();
                if ((textDivWidth.width + textDivWidth.left) >= (selectioncanvasWidth.width + selectioncanvasWidth.left) || (textDivWidth.width > selectioncanvasWidth.width)) {
                    $(textdiv).css("width", "auto");
                    var newWidth = textdiv.clientWidth;
                    $(textdiv).css("width", newWidth + "px");
                }
                textDivs.push(textdiv);
            }
            this._previousBounds = null;
            this._textDivs[pageindex] = textDivs;
            this._textContents[pageindex] = textContents;
            //Text selection line by line
        },

        _resizeSelection: function (jsondata, pageindex, context) {
            var selectionlines = jsondata["selection"];
            for (var l = 0; l < selectionlines.length; l++) {
                var boundingRect = selectionlines[l].LineBounds;
                var textdiv = document.getElementById(this._id + 'text_' + pageindex + '_' + l);
                if (textdiv) {
                    var text = selectionlines[l].Line;
                    textdiv.style.position = 'absolute';
                    textdiv.style.left = this._convertPointToPixel(boundingRect.X * this._zoomVal) + 'px';
                    textdiv.style.top = this._convertPointToPixel(boundingRect.Y * this._zoomVal) + 'px';
                    textdiv.style.width = this._convertPointToPixel(boundingRect.Width * this._zoomVal) + 'px';
                    var newLines = text.replace(/  +/g, ' ');
                    if (newLines != " ") {
                        textdiv.style.whiteSpace = 'pre';
                    }
                    textdiv.style.transformOrigin = '0%';
                    textdiv.style.opacity = '0.2';
                    textdiv.style.fontSize = this._convertPointToPixel(boundingRect.Height * this._zoomVal) + 'px';
                    context.font = textdiv.style.fontSize + " " + textdiv.style.fontFamily;
                    context.fontSize = textdiv.style.fontSize;
                    var ctxwidth = context.measureText(selectionlines[l].Line).width;
                    var scale = parseFloat(textdiv.style.width) / ctxwidth;
                    textdiv.style.transform = 'scaleX(' + scale + ')';
                    var selectioncanvas = document.getElementById(this._id + 'selectioncanvas_' + pageindex);
                    var selectioncanvasWidth = selectioncanvas.getBoundingClientRect();
                    var textDivWidth = textdiv.getBoundingClientRect();
                    if ((textDivWidth.width + textDivWidth.left) >= (selectioncanvasWidth.width + selectioncanvasWidth.left) || (textDivWidth.width > selectioncanvasWidth.width)) {
                        $(textdiv).css("width", "auto");
                        var newWidth = textdiv.clientWidth;
                        $(textdiv).css("width", newWidth + "px");
                    }
                }
            }
        },

        _maintainSelection: function () {
            var selection = this._selectionNodes;
            var range = document.createRange();
            if (selection.anchorNode != null) {
                var position = selection.anchorNode.compareDocumentPosition(selection.focusNode)
                var backward = false;
                if (!position && selection.anchorOffset > selection.focusOffset ||
                  position === Node.DOCUMENT_POSITION_PRECEDING)
                    backward = true;
                if (backward) {
                    range.setStart(selection.focusNode, selection.focusOffset);
                    range.setEnd(selection.anchorNode, selection.anchorOffset);
                }
                else {
                    range.setStart(selection.anchorNode, selection.anchorOffset);
                    range.setEnd(selection.focusNode, selection.focusOffset);
                }
                this._selectionRange = range;
            }
            selection.removeAllRanges();
        },

        /*function helps to enable and disable the loading indicator of the requested page*/
        _showPageLoadingIndicator: function (pageIndex, isShow) {
            if (isShow) {
                $('#' + this._id + 'pageDiv_' + pageIndex + '_WaitingPopup').css('display', 'block');
            }
            else {
                $('#' + this._id + 'pageDiv_' + pageIndex + '_WaitingPopup').css('display', 'none');
            }
        },

        _imageRendering: function (shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, index, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex) {
            var zoomValue = this._zoomVal;
            var imageObject = new Image();
            var proxy = this;
            var browserUserAgent = navigator.userAgent;
            if ((browserUserAgent.indexOf("Chrome")) == -1) {
                imageObject.onload = function () {
                    var isImageContentChanged = false;
                    for (var l = 0; l < imageTransformCollection.length; l++) {
                        if (isImageContentChanged == false) {
                            var matrixData = imageTransformCollection[l];
                            context.setTransform(matrixData[0] * zoomValue, matrixData[1], matrixData[2], matrixData[3] * zoomValue, matrixData[4] * zoomValue, matrixData[5] * zoomValue);
                            if (imageDataCollection[imageIndex] != undefined) {
                                context.drawImage(imageDataCollection[imageIndex], 0, 0, 1, 1);
                            }
                            var dataIndex = currentIndexCollection[l];
                            dataIndex = dataIndex + 1;
                            var data = pageDataCollection[l];
                            while (dataIndex < data.length) {
                                var pathdata = data[dataIndex];
                                var color = pathdata["color"];
                                var matrix = pathdata["matrix"];
                                if (matrix != null)
                                    matrix = matrix["Elements"];
                                var brushMode = pathdata["brush"];
                                var pathValue = pathdata["pathValue"];
                                var isClipping = pathdata["iscliping"];
                                var restoreCanvas = pathdata["restorecanvas"];
                                var imageData = pathdata["imagedata"];
                                var fillMode = pathdata["fillrule"];
                                var fillStroke = pathdata["isFillandStroke"];
                                var fillColor = pathdata["fillcolor"];
                                var strokeColor = pathdata["strokecolor"];
                                var lineWidth = pathdata["linewidth"];
                                var lineCap = pathdata["linecap"];
                                var linearGradient = pathdata["linearGradientBrush"];
                                var charID = pathdata["charID"];
                                var rectangle = pathdata["rectvalue"];
                                if (pathValue != null) {
                                    pathValue = pathValue.split(";");
                                    if (charID)
                                        charPath[charID] = pathValue;
                                }
                                else if (pathValue == null && charID) {
                                    pathValue = charPath[charID];
                                }
                                if (restoreCanvas == false) {
                                    context.save();
                                }
                                if (pathValue != undefined) {
                                    context.setTransform(matrix[0] * zoomValue, matrix[1], matrix[2], matrix[3] * zoomValue, matrix[4] * zoomValue, matrix[5] * zoomValue);
                                }

                                if (pathValue != null) {
                                    context.beginPath();

                                    for (var i = 0; i < pathValue.length; i++) {
                                        var val = pathValue[i];
                                        var pathType = val[0];
                                        if (pathType == "M") {
                                            val = val.substring(1, val.length);
                                            val = val.split(" ");
                                            context.moveTo((val[0]), val[1]);
                                        }
                                        else if (pathType == "L") {
                                            val = val.substring(1, val.length);
                                            val = val.split(" ");
                                            context.lineTo((val[0]), val[1]);
                                        }
                                        else if (pathType == "C") {
                                            val = val.substring(1, val.length);
                                            val = val.split(" ");
                                            context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
                                        }
                                        else if (pathType == "Z") {
                                            context.closePath();
                                        }
                                    }
                                    if (isClipping == true) {
                                        if (fillMode == "evenodd")
                                            context.msFillRule = "evenodd";
                                        context.clip();

                                    }
                                    else {
                                        if (fillStroke == undefined) {
                                            if (brushMode == "Fill") {
                                                if (linearGradient != undefined) {
                                                    context.fillStyle = this._getGradientBrush(linearGradient, context);
                                                }
                                                else
                                                    context.fillStyle = color;
                                                if (fillMode == "evenodd")
                                                    context.msFillRule = "evenodd";
                                                context.fill();
                                            }
                                            else if (brushMode == "FillandStroke") {
                                                context.fillStyle = color;
                                                context.fill();
                                                context.strokeStyle = strokeColor;
                                                context.stroke();
                                            }
                                            else if (brushMode == "Stroke") {
                                                context.strokeStyle = strokeColor;
                                                context.lineWidth = lineWidth;
                                                context.lineCap = lineCap;
                                                context.stroke();
                                            }
                                            else {
                                                context.strokeStyle = color;
                                                context.lineWidth = lineWidth;
                                                context.lineCap = lineCap;
                                                context.stroke();
                                            }
                                        }
                                        else {
                                            context.strokeStyle = strokeColor;
                                            context.lineWidth = lineWidth;
                                            context.lineCap = lineCap;
                                            context.stroke();
                                            if (linearGradient != undefined) {
                                                context.fillStyle = this._getGradientBrush(linearGradient, context);
                                            }
                                            else
                                                context.fillStyle = fillColor;
                                            if (fillMode == "evenodd")
                                                context.msFillRule = "evenodd";
                                            context.fill();
                                        }
                                    }
                                }

                                if (restoreCanvas)
                                    context.restore();
                                if (imageData != undefined) {
                                    isImageContentChanged = true;
                                    imageObjCollection.pop();
                                    imageTransformCollection.pop();
                                    pageDataCollection.pop();
                                    currentIndexCollection.pop();
                                    imageObjCollection.push(imageData);
                                    imageTransformCollection.push(matrix);
                                    pageDataCollection.push(shapes);
                                    currentIndexCollection.push(dataIndex);
                                    l = -1;
                                    imageIndex++;
                                    break;
                                }
                                dataIndex++;
                            }
                        }
                        else {
                            proxy._imageRendering(shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, l, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex);
                            imageIndex++;
                        }
                    }
                };
            }
            imageObject.src = imageObjCollection[index];
            imageDataCollection.push(imageObject);
            if ((browserUserAgent.indexOf("Chrome")) != -1) {
                imageObject.addEventListener("load", this._imageOnLoad(shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, index, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex, zoomValue));
                this._imageObj.push(imageObject);
            }
        },

        _imageOnLoad: function (shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, index, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex, zoomValue) {
            var proxy = this;
            var isImageContentChanged = false;
            for (var l = 0; l < imageTransformCollection.length; l++) {
                if (isImageContentChanged == false) {
                    var matrixData = imageTransformCollection[l];
                    context.setTransform(matrixData[0] * zoomValue, matrixData[1], matrixData[2], matrixData[3] * zoomValue, matrixData[4] * zoomValue, matrixData[5] * zoomValue);
                    if (imageDataCollection[imageIndex] != undefined) {
                        context.drawImage(imageDataCollection[imageIndex], 0, 0, 1, 1);
                    }
                    var dataIndex = currentIndexCollection[l];
                    dataIndex = dataIndex + 1;
                    var data = pageDataCollection[l];
                    while (dataIndex < data.length) {
                        var pathdata = data[dataIndex];
                        var color = pathdata["color"];
                        var matrix = pathdata["matrix"];
                        if (matrix != null)
                            matrix = matrix["Elements"];
                        var brushMode = pathdata["brush"];
                        var pathValue = pathdata["pathValue"];
                        var isClipping = pathdata["iscliping"];
                        var restoreCanvas = pathdata["restorecanvas"];
                        var imageData = pathdata["imagedata"];
                        var fillMode = pathdata["fillrule"];
                        var fillStroke = pathdata["isFillandStroke"];
                        var fillColor = pathdata["fillcolor"];
                        var strokeColor = pathdata["strokecolor"];
                        var lineWidth = pathdata["linewidth"];
                        var lineCap = pathdata["linecap"];
                        var linearGradient = pathdata["linearGradientBrush"];
                        var charID = pathdata["charID"];
                        var rectangle = pathdata["rectvalue"];
                        if (pathValue != null) {
                            pathValue = pathValue.split(";");
                            if (charID)
                                charPath[charID] = pathValue;
                        }
                        else if (pathValue == null && charID) {
                            pathValue = charPath[charID];
                        }
                        if (restoreCanvas == false) {
                            context.save();
                        }
                        if (pathValue != undefined) {
                            context.setTransform(matrix[0] * zoomValue, matrix[1], matrix[2], matrix[3] * zoomValue, matrix[4] * zoomValue, matrix[5] * zoomValue);
                        }

                        if (pathValue != null) {
                            context.beginPath();

                            for (var i = 0; i < pathValue.length; i++) {
                                var val = pathValue[i];
                                var pathType = val[0];
                                if (pathType == "M") {
                                    val = val.substring(1, val.length);
                                    val = val.split(" ");
                                    context.moveTo((val[0]), val[1]);
                                }
                                else if (pathType == "L") {
                                    val = val.substring(1, val.length);
                                    val = val.split(" ");
                                    context.lineTo((val[0]), val[1]);
                                }
                                else if (pathType == "C") {
                                    val = val.substring(1, val.length);
                                    val = val.split(" ");
                                    context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
                                }
                                else if (pathType == "Z") {
                                    context.closePath();
                                }
                            }
                            if (isClipping == true) {
                                if (fillMode == "evenodd")
                                    context.msFillRule = "evenodd";
                                context.clip();

                            }
                            else {
                                if (fillStroke == undefined) {
                                    if (brushMode == "Fill") {
                                        if (linearGradient != undefined) {
                                            context.fillStyle = this._getGradientBrush(linearGradient, context);
                                        }
                                        else
                                            context.fillStyle = color;
                                        if (fillMode == "evenodd")
                                            context.msFillRule = "evenodd";
                                        context.fill();
                                    }
                                    else if (brushMode == "FillandStroke") {
                                        context.fillStyle = color;
                                        context.fill();
                                        context.strokeStyle = strokeColor;
                                        context.stroke();
                                    }
                                    else if (brushMode == "Stroke") {
                                        context.strokeStyle = strokeColor;
                                        context.lineWidth = lineWidth;
                                        context.lineCap = lineCap;
                                        context.stroke();
                                    }
                                    else {
                                        context.strokeStyle = color;
                                        context.lineWidth = lineWidth;
                                        context.lineCap = lineCap;
                                        context.stroke();
                                    }
                                }
                                else {
                                    context.strokeStyle = strokeColor;
                                    context.lineWidth = lineWidth;
                                    context.lineCap = lineCap;
                                    context.stroke();
                                    if (linearGradient != undefined) {
                                        context.fillStyle = this._getGradientBrush(linearGradient, context);
                                    }
                                    else
                                        context.fillStyle = fillColor;
                                    if (fillMode == "evenodd")
                                        context.msFillRule = "evenodd";
                                    context.fill();
                                }
                            }
                        }

                        if (restoreCanvas)
                            context.restore();
                        if (imageData != undefined) {
                            isImageContentChanged = true;
                            imageObjCollection.pop();
                            imageTransformCollection.pop();
                            pageDataCollection.pop();
                            currentIndexCollection.pop();
                            imageObjCollection.push(imageData);
                            imageTransformCollection.push(matrix);
                            pageDataCollection.push(shapes);
                            currentIndexCollection.push(dataIndex);
                            l = -1;
                            imageIndex++;
                            break;
                        }
                        dataIndex++;
                    }
                }
                else {
                    proxy._imageRendering(shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, l, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex);
                    imageIndex++;
                }
            }
        },

        _getGradientBrush: function (linearGradient, context) {
            var rectangle = linearGradient["Rectangle"];
            var interpolationColors = linearGradient["InterpolationColors"];
            var gradientColor = interpolationColors["Colors"];
            var gradientPosition = interpolationColors["Positions"];
            var gradient = context.createLinearGradient(rectangle["X"], rectangle["Y"], rectangle["Width"], rectangle["Height"]);
            for (var k = 0; k < gradientPosition.length; k++) {
                var colorCodeString = gradientColor[k];
                colorCodeString = colorCodeString.split(",");
                var colorCode = this._rgb2Color(colorCodeString[0], colorCodeString[1], colorCodeString[2]);
                gradient.addColorStop(gradientPosition[k], colorCode);
            }
            return gradient;
        },

        _rgb2Color: function (r, g, b) {
            return '#' + this._byte2Hex(r) + this._byte2Hex(g) + this._byte2Hex(b);
        },
        _byte2Hex: function (n) {
            var nybHexString = "0123456789ABCDEF";
            return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
        },
        //-------------------- Apply Page Style and Actions [End] -------------------------//

        //-------------------- Ajax Web API Call back methods[start] -------------------------//
        _doAjaxPost: function (type, url, jsonResult, onSuccess) {
            var proxy = this;
            var inVokemethod = onSuccess;
            if (this._ajaxRequestState != null) {
                this._ajaxRequestState.abort();
                this._ajaxRequestState = null;
             }
            this._ajaxRequestState = ($.ajax({
                type: type,
                url: url,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: jsonResult,
                traditional: true,
                success: function (data) {
                    proxy._isLoadMethod = true;
                    if (typeof data === 'object')
                        proxy[inVokemethod](JSON.stringify(data));
                    else
                        proxy[inVokemethod](data);
                    proxy._raiseClientEvent("documentLoad", null);
                    if (proxy.model.allowClientBuffering) {
                        if (typeof data === 'object')
                            var jsonData = JSON.parse(JSON.stringify(data));
                        else
                            var jsonData = JSON.parse(data);
                        proxy._pagesGot.push(parseInt(jsonData["currentpage"]));
                    }
                },
                error: function (msg, textStatus, errorThrown) {
                    var newUrl;
                    if (jsonResult.indexOf("uploadedFile") != -1) {
                        newUrl = proxy.model.serviceUrl + "/FileUploadPostAction";
                    } else {
                        newUrl = proxy.model.serviceUrl + "/PostViewerAction";
                    }
                    proxy._ajaxRequestState = $.ajax({
                        type: type,
                        url: newUrl,
                        crossDomain: true,
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        data: jsonResult,
                        traditional: true,
                        success: function (data) {
                            proxy._isLoadMethod = false;
                            if (typeof data === 'object')
                                proxy[inVokemethod](JSON.stringify(data));
                            else
                                proxy[inVokemethod](data);
                            proxy._raiseClientEvent("documentLoad", null);
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
                }
            }));
        },

        /*
         * This function [_raiseClientEvent] is triggered when client side events (documentload,beforePrint,afterPrint,zoomchange,pageChange) are occured.
         */
        _raiseClientEvent: function (eventName, argument) {
            var eventfunction = this.model[eventName];
            var val = new Array();
            if (argument === null) {
                val = "";
            }
            else {
                val = argument;
            }
            if (eventfunction) {

                if (typeof eventfunction === "string") {
                    eventfunction = ej.util.getObject(eventfunction, window);
                }
                if ($.isFunction(eventfunction)) {
                    var args;
                    if (eventName == "pageChange")
                        args = { currentPageNumber: parseInt(argument.currentPageNumber) };
                    else if (eventName == "zoomChange")
                        args = { previousZoomPercentage: argument.previousZoomPercentage, currentZoomPercentage: argument.currentZoomPercentage };
                    else if (eventName == "hyperlinkClick")
                        args = { hyperlink: argument.hyperlink };
                    else if (eventName == "pageClick")
                        args = { XCoordinate: argument.offsetX, YCoordinate: argument.offsetY };
                    this._trigger(eventName, args);
                }
            }
        },

        _getPageModel: function (jsondata) {
            this._on($(window), "resize", this._viewerResize);
            if (jsondata) {
                this._isJsondataAvailable = true;
            }
            if (jsondata == "" || jsondata == null) {
                this._showloadingIndicator(true);
                $('#' + this._id + '_toolbarContainer span.e-pdfviewer-labelpageno').html("");
                $('#' + this._id + '_txtpageNo').val('0');
            }
            var jsData;
            if (this._pdfService == ej.PdfViewer.PdfService.Local)
                jsData = JSON.parse(jsondata);
            else
                jsData = JSON.parse(jsondata["d"]);
            if (jsData) {
                this._pageWidth = jsData["pagewidth"];
                this._pageHeight = jsData["pageheight"];
                this._imageUrl = jsData["imageurl"];
                this._pageSize = jsData["pagesize"];
                this._totalPages = jsData["pagecount"];
                this.pageCount = this._totalPages;
                this._pdfFileName = jsData["filename"];
                this.fileName = this._pdfFileName;
                this._currentPage = jsData["currentpage"];
                this._restrictionSummary = jsData["restrictionSummary"];
                this._isRestrictionEnabled();
                if (this._isPrintRestrict)
                    this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_Print');
                else if (!this._isPrintRestrict)
                    this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_Print');
                this.currentPageNumber = this._currentPage;
                if (!this._isToolbarClick) {
                    this._enableToolbarItems();
                }
                this._gotoPage(this._currentPage);
                this._toolbarResizeHandler();
                this._setSearchToolbarTop();
                this._resizeSearchToolbar();
                this._drawPdfPage(jsondata);
                this._showNavigationIndicator(false);
                this._showloadingIndicator(false);
            }
        },
        _isRestrictionEnabled: function () {
            if (this._restrictionSummary) {
                for (var i = 0; i < this._restrictionSummary.length; i++) {
                    switch (this._restrictionSummary[i]) {
                        case 'Print':
                            this._isPrintRestrict = true;
                            break;
                        case 'CopyContent':
                            this._isCopyRestrict = true;
                            break;
                        default:
                            this._isPrintRestrict = false;
                            this._isCopyRestrict = false;
                    }
                }
            }
        },
        //-------------------- Ajax Web API Call back methods[end] -------------------------//

        //-------------------- Print Actions[Start] -------------------------//
        _print: function () {
            this._abortPrinting = false;
            this._isPrintingProcess = true;
            this._raiseClientEvent("beforePrint", null);
            this._showPrintLoadingIndicator(true);
            this._setViewerForPrint();
            this._scrollPageByPage();

        },

        //Set the viewer for printing with zoom as 100% and moves the page to first page.
        _setViewerForPrint: function () {
            this._isPrinting = true;
            this._currentPageBackup = this._currentPage;
            this._scrollTop = $('#' + this._id + '_viewerContainer').scrollTop();
            this._zoomValBackup = this._zoomVal;
            this._zoomLevelBackup = this._zoomLevel;
            if (this._zoomVal != 1) {
                this._zoomVal = 1;
                this._zoomLevel = 2;
                this._fitTypeBackup = this._fitType;
                this._zoomContainer(this._zoomVal, false);
            }
        },

        //Changes the page one by one to render the pages in the viewer.
        _scrollPageByPage: function () {
            
            for (var i = 1; i <= this._totalPages; i++) {
                this._scrollTriggered = false;
                var isPrintingStarted = this._scrollToPageNo(i);
                if (isPrintingStarted)
                    break;
            }
            this._isPrinting = false;
            if (!isPrintingStarted) {
                var browserUserAgent = navigator.userAgent;
                if ((browserUserAgent.indexOf('Chrome') != -1) || (browserUserAgent.indexOf('Safari') != -1) || (browserUserAgent.indexOf("Firefox")) != -1) {
                    var proxy = this;
                    setTimeout(function () { proxy._printPages() }, 1000);
                } else {
                    this._printPages();
                }
                this._raiseClientEvent("afterPrint", null);
            }
        },

        //Gets the current page canvas and the scroll position.
        _scrollToPageNo: function (pageNo) {
            var currentPageNum = this._currentPage;
            if (this._totalPages) {
                var pagenumber = parseInt(pageNo);
                if (pagenumber >= 1 && pagenumber <= this._totalPages) {
                    this._currentPage = pagenumber;
                    var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                    pageviewcontainer.scrollTop = (parseFloat(this._pageLocation[this._currentPage] * this._zoomVal));
                    var isPrintingStarted = this._scrollPage(this._pageHeight);
                    return isPrintingStarted;
                }
            }
        },

        //Renders the current page and the next page in the viewer canvas.
        _scrollPage: function (pageHeight) {
            var currentPageNum = 0;
            if (this._renderedCanvasList.indexOf(parseInt(this._currentPage)) == -1 && !this._scrollTriggered && this._currentPage <= this._totalPages) {
                if (!this._pageContents[parseInt(this._currentPage)]) {
                    this._scrollTriggered = true;
                    var jsonResult = new Object();
                    jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                    jsonResult["pageindex"] = this._currentPage.toString();
                    if (this._pdfService == ej.PdfViewer.PdfService.Local)
                        this._doAjaxPostPrint("POST", this._actionUrl, JSON.stringify(jsonResult));
                    else
                        this._doAjaxPostPrint("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                    return true;
                }
                else {
                    var jsdata = this._pageContents[parseInt(this._currentPage)];
                    this._printPdfPages(jsdata);
                }
                return false;
            }
        },

        //Opens the print window, displays print dialog box and closes the print function.
        _printPages: function () {
            var browserUserAgent = navigator.userAgent;
            var proxy = this;
            var iframe = this._printIframe;
            iframe.name = "printFrame";
            iframe.style.position = "absolute";
            iframe.style.top = "-100000000px";
            document.body.appendChild(iframe);
            var frameDoc = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.document ? iframe.contentDocument.document : iframe.contentDocument;
            frameDoc.document.open();
            if (browserUserAgent.indexOf('Edge') == -1) {
                if ((browserUserAgent.indexOf('Chrome') != -1) || (browserUserAgent.indexOf('Safari') != -1) || (browserUserAgent.indexOf("Firefox")) != -1) {
                    //chrome and firefox
                    frameDoc.document.write('<!DOCTYPE html>');
                    frameDoc.document.write('<html moznomarginboxes mozdisallowselectionprint><head><style>html, body { height: 100%; } img { height: 100%; width: 100%; display: block; }@media print { body { margin: 0cm; }img { box-sizing: border-box; }br, button { display: none; }} @page{margin:0cm; size: 816px 1056px;}</style></head><body><center>');
                    //chrome and firefox
                }
                else {
                    //ie
                    frameDoc.document.write('<!DOCTYPE html>');
                    frameDoc.document.write('<html><head><style>html, body { height: 99%; } img { height: 99%; width: 100%; display: block; }@media print { body { margin: 0cm; }img { box-sizing: border-box; }br, button { display: none; }} @page{margin:0cm; size: 816px 1056px;}</style></head><body><center>');

                }
            }
            else {
                //ie
                frameDoc.document.write('<!DOCTYPE html>');
                frameDoc.document.write('<html><head><style>html, body { height: 99%; } img { height: 99%; width: 100%; display: block; }@media print { body { margin: 0cm; }img { box-sizing: border-box; }br, button { display: none; }} @page{margin:0cm; size: 816px 1056px;}</style></head><body><center>');
            }

            for (var i = 1; i <= proxy._totalPages; i++) {
                var canvasUrl = "", values = "";
                var canvas = document.getElementById(this._id + 'pagecanvas_' + i);
                var selectionCanvas = document.getElementById(this._id + 'selectioncanvas_' + i);
                canvasUrl = canvas.toDataURL();
                if (window.innerWidth < screen.width) {
                    values = proxy._zoomVal;
                    proxy._topValue = true;
                    var jsdata = proxy._pageContents[parseInt(i)];
                    var newData = proxy._printPdfPages(jsdata);
                    canvasUrl = newData.toDataURL();
                }
                else
                    values = 1;
                if ((browserUserAgent.indexOf("Firefox")) == -1) {
                    if (proxy._pageSize[i - 1].PageWidth > proxy._pageSize[i - 1].PageHeight) {
                        var context = canvas.getContext('2d');
                        var image = new Image();
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        canvas.width = proxy._pageSize[i - 1].PageHeight;
                        canvas.height = proxy._pageSize[i - 1].PageWidth;
                        canvas.style.height = proxy._pageSize[i - 1].PageWidth + 'px';
                        canvas.style.width = proxy._pageSize[i - 1].PageHeight + 'px';
                        context.save();
                        context.translate(canvas.width / 2, canvas.height / 2);
                        context.rotate(-Math.PI / 2);
                        image.src = canvasUrl;
                        context.drawImage(image, -image.width / 2, -image.height / 2);
                        context.restore();
                        canvasUrl = canvas.toDataURL();
                    }
                }
                frameDoc.document.write('<div style="margin:0px;width:816px;height:1056px;position:relative"><img src="' + canvasUrl + '" id="' + 'image_' + i + '" /><div id="' + 'fields_' + i + '"></div></div><br/>');
                var length = $(selectionCanvas).find('.e-pdfviewer-formFields').length;
                var cummulativepageheight = 2;
                for (var l = 0; l < length; l++) {
                    var index = "";
                    var inputdiv = $(selectionCanvas).find('.e-pdfviewer-formFields')[l];
                    var currentInput = inputdiv.cloneNode(true);
                    if (inputdiv.type == "select-one") {
                        index = inputdiv.selectedIndex;
                        var childrens = currentInput.children;
                        $(childrens[index]).prop("selected", true);
                    }
                    var PagesWidth = proxy._pageSize[i - 1].PageWidth;
                    var PagesHeight = proxy._pageSize[i - 1].PageHeight;
                    var heightRatio = PagesHeight / 1056;
                    var widthRatio = PagesWidth / 816;
                    var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
                    if (is_ie || browserUserAgent.indexOf('Edge') != -1) {
                        $(currentInput).css("left", ((parseFloat($(currentInput).css("left")))) + "px");
                        $(currentInput).css("top", ((parseFloat($(currentInput).css("top")) - 6)) + "px");
                    }
                    if (window.innerWidth < screen.width) {
                        $(currentInput).css("left", ((parseFloat($(currentInput).css("left")) / values)) + "px");
                        $(currentInput).css("top", ((parseFloat($(currentInput).css("top")) / values)) + "px");
                    }
                    $(currentInput).css("left", ((parseFloat($(currentInput).css("left")) / widthRatio)) + "px");
                    $(currentInput).css("top", ((parseFloat($(currentInput).css("top")) / heightRatio)) + "px");
                    $(currentInput).css("width", (parseFloat($(currentInput).css("width")) / values) + "px");
                    $(currentInput).css("height", (parseFloat($(currentInput).css("height")) / values) + "px");
                    $(frameDoc.document.getElementById('fields_' + i)).append(currentInput);
                }
            }
            this._topValue = false;
            frameDoc.document.write('</center></body></html>');
            if (navigator.userAgent.match("Firefox")) {
                window.frames["printFrame"].close();
            } else {
                frameDoc.document.close();
            }
            if (browserUserAgent.indexOf('Edge') == -1) {
                if ((browserUserAgent.indexOf('Chrome') != -1) || (browserUserAgent.indexOf('Safari') != -1) || (browserUserAgent.indexOf("Firefox")) != -1) {
                    var proxy = this;
                    setTimeout(function () {
                        window.frames["printFrame"].focus();
                        window.frames["printFrame"].print();
                        document.body.removeChild(iframe);
                    }, 500);
                }
                    else {
                        var target = $('iframe')[0];
                        try {
                            target.contentWindow.document.execCommand('print', false, null);
                        } catch (e) {
                            target.contentWindow.print();
                        }
                    }
            }
            else {
                var target = $('iframe')[0];
                try {
                    target.contentWindow.document.execCommand('print', false, null);
                } catch (e) {
                    target.contentWindow.print();
                }
            }
            this._restoreViewer();
        },

        //Cancels the printing and restores the PDF viewer.
        _printCancel: function () {
            this._abortPrinting = true;
            this._restoreViewer();
            this._raiseClientEvent("afterPrint", null);
        },

        //Restores the viewer with the current zoom value and scroll position.
        _restoreViewer: function () {
            this._isPrintingProcess = false;
            this._currentPage = this._currentPageBackup;
            this._zoomVal = this._zoomValBackup;
            this._zoomLevel = this._zoomLevelBackup;
            for (var i = 1; i <= this._totalPages; i++) {
                var canvas = document.getElementById(this._id +'pagecanvas_' + i);
                if (this._pageSize[i - 1].PageWidth > this._pageSize[i - 1].PageHeight) {
                    canvas.style.height = this._pageSize[i - 1].PageHeight + 'px';
                    canvas.style.width = this._pageSize[i - 1].PageWidth + 'px';
                    canvas.width = this._pageSize[i - 1].PageWidth;
                    canvas.height = this._pageSize[i - 1].PageHeight;
                    this._renderedCanvasList.length = 0;
                }
            }
            if (this._fitTypeBackup == null) {
                this._zoomContainer(this._zoomVal, false);
            } else {
                var _scaleXY = this._fitToPage(this._fitTypeBackup);
                this._applyDropDownVal(_scaleXY, true, false);
                this._updatePageFitModel(this._fitType);
            }
            var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
            pageviewcontainer.scrollTop = this._scrollTop;
            this._showPrintLoadingIndicator(false);
        },

        _doAjaxPostPrint: function (type, url, jsonResult) {
            var parseJson = JSON.parse(jsonResult);
            if (this._pdfService == ej.PdfViewer.PdfService.Local) {
                this._currentPrintPage = parseJson["pageindex"];
            }
            else {
                var jsonData = parseJson["jsonResult"];
                this._currentPrintPage = jsonData["pageindex"];
            }
            if (this.model.allowClientBuffering && this._isBuffering) {
                if (this._ajaxRequestState != null) {
                    this._ajaxRequestState.abort();
                    this._ajaxRequestState = null;
                }
            }
            var proxy = this;
            ($.ajax({
                type: type,
                url: url,
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: jsonResult,
                traditional: true,
                success: function (data) {
                    if (typeof data === 'object')
                        proxy._printPdfPages(JSON.stringify(data));
                    else
                        proxy._printPdfPages(data);
                    proxy._scrollTriggered = false;
                    if (proxy._abortPrinting) {
                        return;
                    }
                    if (parseFloat(proxy._currentPrintPage) < proxy.pageCount) {
                        var jsonResult = new Object();
                        jsonResult["viewerAction"] = proxy._viewerAction.getPageModel;
                        jsonResult["pageindex"] = (parseFloat(proxy._currentPrintPage) + 1).toString();//proxy._currentPage.toString();
                        if (proxy._pdfService == ej.PdfViewer.PdfService.Local)
                            proxy._doAjaxPostPrint("POST", proxy._actionUrl, JSON.stringify(jsonResult));
                        else
                            proxy._doAjaxPostPrint("POST", proxy.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                    }
                    else {
                        var browserUserAgent = navigator.userAgent;
                        if ((browserUserAgent.indexOf('Chrome') != -1) || (browserUserAgent.indexOf('Safari') != -1) || (browserUserAgent.indexOf("Firefox")) != -1) {
                            setTimeout(function () { proxy._printPages() }, 1000);
                        } else {
                            proxy._printPages();
                        }
                        proxy._raiseClientEvent("afterPrint", null);
                    }
                },
                error: function (msg, textStatus, errorThrown) {
                    if (!proxy._isLoadMethod) {
                        $.ajax({
                            type: type,
                            url: proxy.model.serviceUrl + '/PostViewerAction',
                            crossDomain: true,
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            data: jsonResult,
                            traditional: true,
                            success: function (data) {
                                if (typeof data === 'object')
                                    proxy._printPdfPages(JSON.stringify(data));
                                else
                                    proxy._printPdfPages(data);
                                proxy._scrollTriggered = false;
                                if (proxy._abortPrinting) {
                                    return;
                                }
                                if (parseFloat(proxy._currentPrintPage) < proxy.pageCount) {
                                    var jsonResult = new Object();
                                    jsonResult["viewerAction"] = proxy._viewerAction.getPageModel;
                                    jsonResult["pageindex"] = (parseFloat(proxy._currentPrintPage) + 1).toString();//proxy._currentPage.toString();
                                    if (proxy._pdfService == ej.PdfViewer.PdfService.Local)
                                        proxy._doAjaxPostPrint("POST", proxy._actionUrl, JSON.stringify(jsonResult));
                                    else
                                        proxy._doAjaxPostPrint("POST", proxy.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                                }
                                else {
                                    var browserUserAgent = navigator.userAgent;
                                    if ((browserUserAgent.indexOf('Chrome') != -1) || (browserUserAgent.indexOf('Safari') != -1) || (browserUserAgent.indexOf("Firefox")) != -1) {
                                        setTimeout(function () { proxy._printPages() }, 1000);
                                    } else {
                                        proxy._printPages();
                                    }
                                    proxy._raiseClientEvent("afterPrint", null);
                                }
                            },
                            error: function (msg, textStatus, errorThrown) {
                                if (msg.readyState == 0) {
                                    return;
                                }
                            }
                        });
                    }
                }
            }));
        },

        //Rendering function for print.
        _printPdfPages: function (printData) {
            var imageIndex = 0;
            var backupjson = printData;
            if (this._pdfService == ej.PdfViewer.PdfService.Local)
                jsondata = JSON.parse(printData);
            else
                jsondata = JSON.parse(printData["d"]);
            var pageindex = parseInt(jsondata["currentpage"]);
            this._showPageLoadingIndicator(pageindex, true);
            var pageimageList = jsondata["imagestream"];
            var index = parseInt(jsondata["currentpage"]);
            this._pageContents[parseInt(jsondata["currentpage"])] = backupjson;
            var canvas;
            if (this._topValue == true) {
                var currentpage = parseInt(jsondata["currentpage"]);
                var canvas = document.createElement('canvas');
                var height = this._pageSize[currentpage - 1].PageHeight;
                var width = this._pageSize[currentpage - 1].PageWidth;
                canvas.style.visibility = 'hidden';
                canvas.style.width = width + "px";
                canvas.style.height = height + "px";
                canvas.style.backgroundColor = 'white';
                canvas.style.boxShadow = '0px 0px 0px 1px #000000';
                canvas.height = height;
                canvas.width = width;
            }
            else
                canvas = document.getElementById(this._id + 'pagecanvas_' + parseInt(jsondata["currentpage"]));
            var context = canvas.getContext('2d');
            var imageObjCollection = new Array();
            var imageTransformCollection = new Array();
            var imageDataCollection = new Array();
            var currentIndexCollection = new Array();
            var pageDataCollection = new Array();
            var zoomFactor;
            var browserUserAgent = navigator.userAgent;
            var offsett;

            var charPath = new Array();
            this._regenerateFormFields(jsondata, pageindex);
            var children = $('#' + this._id + 'selectioncanvas_' + pageindex).children();
            for (i = 0; i < children.length; i++) {
                if (children[i].hasAttribute('href') || $(children[i]).hasClass('e-pdfviewer-formFields'))
                    $(children[i]).remove();
            }
            this._createFormFields(jsondata, pageindex);
            var shapes = pageimageList["textelements"];
            for (var j = 0; j < shapes.length; j++) {
                var pathdata = shapes[j];
                var color = pathdata["color"];
                var matrix = pathdata["matrix"];
                if (matrix != null)
                    matrix = matrix["Elements"];
                var brushMode = pathdata["brush"];
                var pathValue = pathdata["pathValue"];
                var isClipping = pathdata["iscliping"];
                var restoreCanvas = pathdata["restorecanvas"];
                var imageData = pathdata["imagedata"];
                var fillMode = pathdata["fillrule"];
                var fillStroke = pathdata["isFillandStroke"];
                var fillColor = pathdata["fillcolor"];
                var strokeColor = pathdata["strokecolor"];
                var lineWidth = pathdata["linewidth"];
                var lineCap = pathdata["linecap"];
                var linearGradient = pathdata["linearGradientBrush"];
                var charID = pathdata["charID"];
                if (pathValue != null) {
                    pathValue = pathValue.split(";");
                    if (charID)
                        charPath[charID] = pathValue;
                }
                else if (pathValue == null && charID) {
                    pathValue = charPath[charID];
                }
                if (restoreCanvas == false) {
                    context.save();
                }
                if (pathValue != undefined) {
                    context.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
                }

                if (pathValue != null) {
                    context.beginPath();

                    for (var i = 0; i < pathValue.length; i++) {
                        var val = pathValue[i];
                        var pathType = val[0];
                        if (pathType == "M") {
                            val = val.substring(1, val.length);
                            val = val.split(" ");
                            context.moveTo((val[0]), val[1]);
                        }
                        else if (pathType == "L") {
                            val = val.substring(1, val.length);
                            val = val.split(" ");
                            context.lineTo((val[0]), val[1]);
                        }
                        else if (pathType == "C") {
                            val = val.substring(1, val.length);
                            val = val.split(" ");
                            context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
                        }
                        else if (pathType == "Z") {
                            context.closePath();
                        }
                    }
                    if (isClipping == true) {
                        if (fillMode == "evenodd")
                            context.msFillRule = "evenodd";
                        context.clip();

                    }
                    else {
                        if (fillStroke == undefined) {
                            if (brushMode == "Fill") {
                                if (linearGradient != undefined) {
                                    context.fillStyle = this._getGradientBrush(linearGradient, context);
                                }
                                else
                                    context.fillStyle = color;
                                if (fillMode == "evenodd")
                                    context.msFillRule = "evenodd";
                                context.fill();
                            }
                            else if (brushMode == "FillandStroke") {
                                context.fillStyle = color;
                                context.fill();
                                context.strokeStyle = strokeColor;
                                context.stroke();
                            }
                            else {
                                context.strokeStyle = color;
                                context.lineWidth = lineWidth;
                                context.lineCap = lineCap;
                                context.stroke();
                            }
                        }
                        else {
                            context.strokeStyle = strokeColor;
                            context.lineWidth = lineWidth;
                            context.lineCap = lineCap;
                            context.stroke();
                            if (linearGradient != undefined) {
                                context.fillStyle = this._getGradientBrush(linearGradient, context);
                            }
                            else
                                context.fillStyle = fillColor;
                            if (fillMode == "evenodd")
                                context.msFillRule = "evenodd";
                            context.fill();
                        }
                    }
                }

                if (restoreCanvas)
                    context.restore();
                if (imageData != undefined) {
                    if (((offsett = browserUserAgent.indexOf("Firefox")) != -1 || (offsett = browserUserAgent.indexOf("Chrome")) != -1 || (offsett = browserUserAgent.indexOf("Safari")) != -1 || (offsett = browserUserAgent.indexOf("AppleWebKit")) != -1) && !this._topValue) {
                        imageObjCollection.push(imageData);
                        imageTransformCollection.push(matrix);
                        this._printWinImageRendering(imageObjCollection, imageTransformCollection, imageDataCollection, context, canvas, imageIndex);
                        imageIndex++;
                    }
                    else {
                        var imageObj = new Image();
                        imageObj.src = imageData;
                        context.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
                        context.drawImage(imageObj, 0, 0, 1, 1);
                    }
                }
            }
            this._showPageLoadingIndicator(pageindex, false);
            return canvas;
        },

        //Renders images while the image is loaded.
        _printWinImageRendering: function (imageObjCollection, imageTransformCollection, imageDataCollection, context, canvas, index) {
            var proxy = this;
            var imageObject = new Image();
            imageObject.onload = function () {
                var matrixData = imageTransformCollection[index];
                context.setTransform(matrixData[0], matrixData[1], matrixData[2], matrixData[3], matrixData[4], matrixData[5]);
                if (imageDataCollection[index] != undefined) {
                    context.drawImage(imageDataCollection[index], 0, 0, 1, 1);
                }
            };
            imageObject.src = imageObjCollection[index];
            imageDataCollection.push(imageObject);
        },

        _showPrintButton: function (show) {
            if (show) {
                $('#' + this._id + '_toolbar_Print').parent().parents(".e-pdfviewer-toolbarul").css("display", "block");
                this._isPrintHidden = false;
            }
            else {
                $('#' + this._id + '_toolbar_Print').parent().parents(".e-pdfviewer-toolbarul").css("display", "none");
                this._isPrintHidden = true;
            }
        },
        _showDownloadButton: function (show) {
            if (show) {
                $('#' + this._id + '_toolbar_download').parent().parents(".e-pdfviewer-toolbarul").css("display", "block");
                this._isDownloadHidden = false;
            }
            else {
                $('#' + this._id + '_toolbar_download').parent().parents(".e-pdfviewer-toolbarul").css("display", "none");
                this._isDownloadHidden = true;
            }
        },
        //-------------------- Print Actions[end] -------------------------//

        //-------------------- Page Navigation Actions[Start] -------------------------//
        _updatePageNavigation: function (pageNo, totalPage) {
            if (pageNo > 1 && pageNo < totalPage) {
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotofirst');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotoprevious');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotonext');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotolast');
            } else if (pageNo == 1 && pageNo < totalPage) {
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotofirst');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotoprevious');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotonext');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotolast');
            } else if (pageNo == totalPage && totalPage != 1) {
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotofirst');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_gotoprevious');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotonext');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotolast');
            } else {
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotofirst');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotoprevious');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotonext');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotolast');
            }
            if (!this._isJsondataAvailable) {
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotofirst');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotoprevious');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotonext');
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotolast');
            }

            this.currentPageNumber = this._currentPage;
        },

        _gotoFirstPage: function () {
            if (this._totalPages) {
                if (this._totalPages > 0) {
                    this._currentPage = 1;
                    var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                    pageviewcontainer.scrollTop = (parseFloat(this._pageLocation[this._currentPage] * this._zoomVal));
                    this._pageviewscrollchanged(this._pageHeight);
                    this._updatePageNavigation(this._currentPage, this._totalPages);
                }
            }
        },

        _gotoLastPage: function () {
            if (this._totalPages) {
                if (this._totalPages > 0) {
                    this._currentPage = this._totalPages;
                    var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                    pageviewcontainer.scrollTop = (parseFloat(this._pageLocation[this._currentPage] * this._zoomVal));
                    this._pageviewscrollchanged(this._pageHeight);
                    this._updatePageNavigation(this._currentPage, this._totalPages);
                }
            }
        },

        _gotoNextPage: function () {
            if (this._totalPages) {
                if (this._currentPage < this._totalPages) {
                    this._currentPage = this._currentPage + 1;
                    var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                    pageviewcontainer.scrollTop = (parseFloat(this._pageLocation[this._currentPage] * this._zoomVal));
                    this._pageviewscrollchanged(this._pageHeight);
                    this._updatePageNavigation(this._currentPage, this._totalPages);
                }
            }
        },

        _gotoPreviousPage: function () {
            if (this._totalPages) {
                if (this._currentPage > 1) {
                    this._currentPage = this._currentPage - 1;
                    var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                    pageviewcontainer.scrollTop = (parseFloat(this._pageLocation[this._currentPage] * this._zoomVal));
                    this._pageviewscrollchanged(this._pageHeight);
                    this._updatePageNavigation(this._currentPage, this._totalPages);
                }
            }
        },

        _gotoPageNo: function (pageNo) {
            var pagenumbervalue = { currentPageNumber: 0 };
            var pagenoentered = pageNo;
            var currentPageNum = this._currentPage;
            if (this._totalPages) {
                var pagenumber = parseInt(pageNo);
                if (pagenumber >= 1 && pagenumber <= this._totalPages && this._currentPage != pagenumber) {
                    this._currentPage = pagenumber;
                    var pageviewcontainer = document.getElementById(this._id + '_viewerContainer');
                    pageviewcontainer.scrollTop = (parseFloat(this._pageLocation[this._currentPage] * this._zoomVal));
                    this._pageviewscrollchanged(this._pageHeight);
                    this._updatePageNavigation(this._currentPage, this._totalPages);
                }
            }
            if (currentPageNum != pagenoentered) {
                pagenumbervalue.currentPageNumber = pagenoentered;
                this._raiseClientEvent("pageChange", pagenumbervalue);
            }
        },

        _gotoPage: function (pageNo) {
            this._setPageSize(this._pageHeight, this._pageWidth, null, null);
            var pagenumber = parseInt(pageNo);
            this._updatePageNavigation(pagenumber, this._totalPages);
            if (this._totalPages > 0 && this._totalPages) {
                $('#' + this._id + '_toolbarContainer span.e-pdfviewer-labelpageno').html(" / " + this._totalPages);
                $('#' + this._id + '_txtpageNo').val(pagenumber);
            }
        },

        _allowOnlyNumbers: function (event) {
            if ((event.which < 48 || event.which > 57) && event.which != 8 && event.which != 13) {
                return false;
            }
            else {
                return true;
            }
        },

        _onkeyPress: function (event) {
            if (event.which == 13) {
                try {
                    var val = parseInt($(event.currentTarget).val());
                    if (val > 0 && val <= this.pageCount)
                        this._gotoPageNo(val);
                    else
                        $(event.currentTarget).val(this.currentPageNumber);
                } catch (err) {
                }
            }
        },

        _showPageNavigationControls: function (show) {
            if (show) {
                $('#' + this._id + '_txtpageNo').parents(".e-pdfviewer-toolbarul").css("display", "block");
                $('#' + this._id + '_toolbar_Print').parent().parents(".e-pdfviewer-toolbarul").css("border-right-width", "1px");
                this._isNavigationHidden = false;
            } else {
                $('#' + this._id + '_txtpageNo').parents(".e-pdfviewer-toolbarul").css("display", "none");
                this._isNavigationHidden = true;
                if (!this._isPrintHidden && this._isNavigationHidden && this._isMagnificationHidden) {
                    $('#' + this._id + '_toolbar_Print').parent().parents(".e-pdfviewer-toolbarul").css("border-right-width", "0px");
                }
            }
        },
        //-------------------- Page Navigation Actions[End] -------------------------//


        //-------------------- FitToPage[start] -------------------------//
        _showFittoPage: function (show) {
            if (show) {
                $('#' + this._id + '_fitWidth').parents("li.e-pdfviewer-toolbarli").css("display", "block");
                $('#' + this._id + '_fitPage').parents("li.e-pdfviewer-toolbarli").css("display", "block");
            } else {
                $('#' + this._id + '_fitWidth').parents("li.e-pdfviewer-toolbarli").css("display", "none");
                $('#' + this._id + '_fitPage').parents("li.e-pdfviewer-toolbarli").css("display", "none");
            }
        },

        _resetPage: function () {
            var pagecontainer = $('#' + this._id + '_pageviewContainer');
            var pageViewline = $('#' + this._id + '_pageviewOuterline');
            if (pagecontainer[0] != undefined) {
                pageViewline.css({ "width": pagecontainer.width(), "height": pagecontainer.height() });
                pageViewline.css({ "width": pagecontainer[0].getBoundingClientRect().width, "height": pagecontainer[0].getBoundingClientRect().height });
            }
        },

        /*  _applyFitToWidth() is a event handler for the fitWidth button. This function fits the page to width of the container and applies the
            dropDown value to the zoom dropdown list. Then updates the page fit button.
        */
        _applyFitToWidth: function () {
            this._isAutoZoom = false;
            _scaleXY = this._fitToPage("fitToWidth");
            this._applyDropDownVal(_scaleXY, true, false);
            this._updatePageFitModel(this._fitType);
            this.model.isResponsive = false;
        },

        /*  _applyFitToPage() is a event handler for the fitPage button. This function fits the page to the container and applies the
            dropDown value to the zoom dropdown list. Then updates the page fit button.
        */
        _applyFitToPage: function () {
            this._isAutoZoom = false;
            _scaleXY = this._fitToPage("fitToPage");
            this._applyDropDownVal(_scaleXY, false, true);
            this._updatePageFitModel(this._fitType);
            this.model.isResponsive = false;
        },


        /* _updatePageFitModel() function is used to enable or disable the PageFit button. This is done by adding and removing 
          a class "e-pdfviewer-disabled-fitButton".
        */
        _updatePageFitModel: function (fitType) {
            if (fitType == "fitToWidth") {
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_fitWidth');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitPage');
            } else if (fitType == "fitToPage") {
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_fitPage');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitWidth');
            }
        },

        _applyFitToWidthAuto: function () {
            _scaleXY = this._fitToAuto("fitToWidth");
            this._applyDropDownValAuto(_scaleXY, true, false);
        },

        _fitToAuto: function (fitType) {
            this._resetPage();
            var pageViewerContainer = $('#' + this._id + '_viewerContainer');
            var pagecontainer = $('#' + this._id + '_pageviewContainer');
            var pageViewline = $('#' + this._id + '_pageviewOuterline');
            if (pageViewerContainer[0] != undefined) {
                var w = pageViewerContainer.width();
                var h = pageViewerContainer.height();
                var pageW = this._pageWidth;
                var pageH = this._pageHeight;
                var scaleX = 1;
                var scaleY = 1;
                scaleX = (w - 25) / pageW;
                if (this._isAutoZoom) {
                    scaleX = Math.min(1, scaleX);
                    if (scaleX == 1)
                        this._zoomLevelBackup = this._zoomLevel = 3;

                }
                if (window.innerWidth >= screen.width) {
                    this._isWindowResizing = false;
                }
                scaleY = scaleX;
                this._zoomVal = scaleX;
                this._fitToAutoSize();
                this._calculateZoomLevel(this._zoomVal);
                this._initRerendering();
                this._updateZoomButtons();
                return { scalX: scaleX, scalY: scaleY }
            }
        },

        _fitToPage: function (fitType) {
            this._resetPage();
            var pageViewerContainer = $('#' + this._id + '_viewerContainer');
            var pagecontainer = $('#' + this._id + '_pageviewContainer');
            var pageViewline = $('#' + this._id + '_pageviewOuterline');
            var w = pageViewerContainer.width();
            var h = pageViewerContainer.height();
            var pageW = this._pageWidth;
            var pageH = this._pageHeight;
            var scaleX = 1;
            var scaleY = 1;
            this._fitType = fitType;
            if (fitType == "fitToPage") {
                scaleX = (w - 25) / pageW;
                scaleY = (h) / pageH;
                if (h > pageH) {
                    scaleY = this._preZoomVal;
                }

                if (w > pageW) {
                    scaleX = this._preZoomVal;
                }
                scaleX = scaleY;
                this._zoomVal = scaleX;
                this._zoomInContainer();
                this._calculateZoomLevel(this._zoomVal);

            } else if (fitType == "fitToWidth") {
                scaleX = (w - 25) / pageW;
                scaleY = scaleX;
                this._zoomVal = scaleX;
                this._zoomInContainer();
                this._calculateZoomLevel(this._zoomVal);
            }
            this._updateZoomButtons();
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
                $('#' + this._id + '_toolbar_zoomSelection_hidden').val(Math.round((_maxScale * 100)) + "%");
                this._ejDropDownInstance.model.value = Math.round(_maxScale * 100) + "%";
                this._ejDropDownInstance.model.selectedIndices[0] = "";
                $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
            }
            else if (orientationX) {
                $('#' + this._id + '_toolbar_zoomSelection_hidden').val(Math.round((scaleXY.scalX * 100)) + "%");
                this._ejDropDownInstance.model.value = Math.round(scaleXY.scalX * 100) + "%";
                this._ejDropDownInstance.model.selectedIndices[0] = "";
                $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
            } else {
                $('#' + this._id + '_toolbar_zoomSelection_hidden').val(Math.round((scaleXY.scalY * 100)) + "%");
                this._ejDropDownInstance.model.value = Math.round(scaleXY.scalY * 100) + "%";
                this._ejDropDownInstance.model.selectedIndices[0] = "";
                $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
            }
        },

        _applyDropDownValAuto: function (scaleXY, orientationX, isFittoPage) {
            if (!this._isAutoZoom) {
                $('#' + this._id + '_toolbar_zoomSelection_hidden').val(Math.round((scaleXY.scalY * 100)) + "%");
                this._ejDropDownInstance.model.value = Math.round(scaleXY.scalY * 100) + "%";
                this._ejDropDownInstance.model.selectedIndices[0] = "";
            }
            else {
                $('#' + this._id + '_toolbar_zoomSelection_hidden').val("Auto");
                this._ejDropDownInstance.model.value = "Auto";
            }
            $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
        },

        _showFitToPagetip: function () {
            var fittoPage = $('#' + this._id + '_toolbar_fittoPagePopup');
            if (!(fittoPage.length > 0)) {
                fittoPage = this._renderPageFitPopup();
                $('body').append(fittoPage);
                this._on($('#' + this._id + '_toolbar_fittoPagePopup li.e-pdfviewer-popupli'), "click", this._pageFitMenuClick);
            }

            if (fittoPage.css('display') == 'block') {
                fittoPage.css('display', 'none');
            } else {
                fittoPage.css('display', 'block');
            }

            var exportTagPos = $('#' + this._id + '_toolbarContainer .e-pdfviewer-pagefit')[0].getBoundingClientRect();
            var expTagPos = $($('#' + this._id + '_toolbarContainer .e-pdfviewer-pagefit')[0]).offset();
            fittoPage.css({ 'top': (expTagPos.top + exportTagPos.height) - 3, 'left': (expTagPos.left - 5) });
        },
        //-------------------- FitToPage[end] -------------------------//

        //-------------------- Page Zoom[start] -------------------------//
        _zoomValChange: function (sender) {
            if (!this._ejViewerInstance) {
                var id = this._id.split('_toolbar')[0];
                var ejViewer = $("#"+ id);
                ejViewerInstance = ejViewer.ejPdfViewer("instance");
            }
            var zoomVal;
            if (sender.value != undefined) {
                if (sender.value == "Auto") {
                    ejViewerInstance.model.isResponsive = true;
                    zoomVal = 1;
                    ejViewerInstance._zoomLevel = 3;
                    ejViewerInstance._isAutoZoom = true;
                }
                else {
                    zoomVal = parseInt(sender.value) / 100;
                    ejViewerInstance.model.isResponsive = false;
                    ejViewerInstance._zoomLevel = sender.itemId;
                    ejViewerInstance._isAutoZoom = false;
                }

                ejViewerInstance._zoomContainer(zoomVal, false);
            } else if (sender.target.innerHTML != undefined) {
                var str = sender.target.innerHTML;
                if (sender.target.innerHTML == "Auto") {
                    ejViewerInstance.model.isResponsive = true;
                    zoomVal = 1;
                    ejViewerInstance._isAutoZoom = true;
                }
                else {
                    var str = str.substring(0, str.length - 1);
                    zoomVal = parseInt(str) / 100;
                    ejViewerInstance.model.isResponsive = false;
                    ejViewerInstance._isAutoZoom = false;
                }
                ejViewerInstance._zoomContainer(zoomVal, false);
            }
        },

        _zoomIn: function () {
            if (this._zoomLevel >= 7) {
                this._zoomLevel = 7;
            } else {
                this._zoomLevel++;
            }
            if (this._isDevice) {
                this._mobileLayoutZoomChange();
            } else {
                var zoomddl = $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList');
                zoomddl._selectItemByIndex(this._zoomLevel);
            }
            this.model.isResponsive = false;
        },

        _zoomOut: function () {
            if (this._zoomLevel <= 1) {
                this._zoomLevel = 1;
            } else {
                this._zoomLevel--;
            }
            if (this._isDevice) {
                this._mobileLayoutZoomChange();
            } else {
                var zoomddl = $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList');
                zoomddl._selectItemByIndex(this._zoomLevel);
            }
            this.model.isResponsive = false;
        },

        _zoomInContainer: function (isFactor, scaleFactor) {
            var zoomFactor = scaleFactor;
            var pageViewerContainer = $('#' + this._id + '_viewerContainer');
            var pagecontainer = $('#' + this._id + '_pageviewContainer');
            this._selectionNodes = window.getSelection();
            $('.e-pdfviewer-formFields').hide();
            if (!(this._selectionNodes.anchorOffset == 0 && this._selectionNodes.focusOffset == 0)) {
                this._maintainSelection();
            }
            if (isFactor) {
                this._zoomVal = this._zoomVal + zoomFactor;
            }
            var w = pagecontainer.width();
            var h = pagecontainer.height();
            var zoomineventvalue = { currentZoomPercentage: 0, previousZoomPercentage: 0 };
            var vscrolBar = document.getElementById(this._id + '_viewerContainer');
            var vscrolValue = vscrolBar.scrollTop;
            var scrollValue = (vscrolValue / this._previousZoom) * this._zoomVal;
            var transform = "scale(" + this._zoomVal + "," + this._zoomVal + ")";
            for (var i = 1; i <= this._totalPages; i++) {
                var leftpos = (this.element.width() - this._pageSize[i - 1].PageWidth * this._zoomVal) / 2;
                if (leftpos < 0 || this._fitType=="fitToWidth")
                    leftpos = 5;
                var canvas = document.getElementById(this._id +'pagecanvas_' + i);
                var context = canvas.getContext('2d');
                canvas.height = this._pageSize[i - 1].PageHeight * this._zoomVal;
                canvas.width = this._pageSize[i - 1].PageWidth * this._zoomVal;
                canvas.style.height = this._pageSize[i - 1].PageHeight * this._zoomVal + 'px';
                canvas.style.width = this._pageSize[i - 1].PageWidth * this._zoomVal + 'px';
                var height = this._pageSize[i - 1].PageHeight * this._zoomVal;
                var width = this._pageSize[i - 1].PageWidth * this._zoomVal;
                canvas.style.width = width + "px";
                canvas.style.height = height + "px";
                context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
                var pagediv = $('#' + this._id + 'pageDiv_' + i);
                pagediv[0].style.top = this._pageLocation[i] * this._zoomVal + "px";
                pagediv[0].style.left = leftpos + "px";

                //Hyperlink canvas

                var hyperlinklayer = document.getElementById(this._id +'selectioncanvas_' + i);
                hyperlinklayer.style.height = canvas.height + 'px';
                hyperlinklayer.style.width = canvas.width + 'px';
                hyperlinklayer.style.position = 'absolute';
                hyperlinklayer.style.left = 0;
                hyperlinklayer.style.top = 0;
                hyperlinklayer.style.backgroundColor = 'transparent';
                hyperlinklayer.style.zIndex = '2';

                if (!this._isAutoZoom) {
                    //resizing the loding indicator of the page
                    $('#' + this._id + 'pageDiv_' + i + '_WaitingPopup').css({ 'display': 'block', 'height': canvas.height + 'px', 'width': canvas.width + 'px','left':'0px','top':'0px' });
                    var loadingindicator = document.getElementById(this._id + 'pageDiv_' + i + '_WaitingPopup');
                    var spanDiv = loadingindicator.childNodes[0];
                    spanDiv.style.top = (canvas.height - spanDiv.clientHeight) / 2 + 'px';
                }
            }
            if (this._renderedCanvasList)
                this._renderedCanvasList.length = 0;

            if (this._zoomVal < 1)
                pageViewerContainer.css({ '-ms-scroll-limit-y-max': (this._cummulativeHeight * this._zoomVal) - this.element.height() + 50 + "px" });
            else {
                pageViewerContainer.css({ '-ms-scroll-limit-y-max': "" });
            }
            if (this._imageObj) {
                for (var i = 0; i < this._imageObj.length; i++) {
                    this._imageObj[i].removeEventListener("load", this._imageOnLoad);
                }
            }
            vscrolBar.scrollTop = scrollValue;
            this._eventpreviouszoomvalue = this._preZoomVal;
            this._eventzoomvalue = this._zoomVal;
            this._preZoomVal = this._zoomVal;
            this._previousZoom = this._zoomVal;
            zoomineventvalue.previousZoomPercentage = Math.round(this._eventpreviouszoomvalue * 100);
            zoomineventvalue.currentZoomPercentage = Math.round(this._eventzoomvalue * 100);
            this._raiseClientEvent("zoomChange", zoomineventvalue);
            this.zoomPercentage = Math.round(this._zoomVal * 100);
        },

        _zoomOutContainer: function (isFactor, scaleFactor) {

            var zoomFactor = scaleFactor;
            var pageViewerContainer = $('#' + this._id + '_viewerContainer');
            var pagecontainer = $('#' + this._id + '_pageviewContainer');
            this._selectionNodes = window.getSelection();
            $('.e-pdfviewer-formFields').hide();
            if (!(this._selectionNodes.anchorOffset == 0 && this._selectionNodes.focusOffset == 0)) {
                this._maintainSelection();
            }
            if (isFactor) {
                this._zoomVal = this._zoomVal + zoomFactor;
            }
            var w = pagecontainer.width();
            var h = pagecontainer.height();
            var zoomouteventvalue = { currentZoomPercentage: 0, previousZoomPercentage: 0 };
            var vscrolBar = document.getElementById(this._id + '_viewerContainer');
            var vscrolValue = vscrolBar.scrollTop;
            var scrollValue = (vscrolValue / this._previousZoom) * this._zoomVal;
            var transform = "scale(" + this._zoomVal + "," + this._zoomVal + ")";
            for (var i = 1; i <= this._totalPages; i++) {
                var leftpos = (this.element.width() - this._pageSize[i - 1].PageWidth * this._zoomVal) / 2;
                if (leftpos < 0)
                    leftpos = 5;
                var canvas = document.getElementById(this._id +'pagecanvas_' + i);
                var context = canvas.getContext('2d');
                canvas.height = this._pageSize[i - 1].PageHeight * this._zoomVal;
                canvas.width = this._pageSize[i - 1].PageWidth * this._zoomVal;
                canvas.style.height = this._pageSize[i - 1].PageHeight * this._zoomVal + 'px';
                canvas.style.width = this._pageSize[i - 1].PageWidth * this._zoomVal + 'px';
                var height = this._pageSize[i - 1].PageHeight * this._zoomVal;
                var width = this._pageSize[i - 1].PageWidth * this._zoomVal;
                canvas.style.width = width + "px";
                canvas.style.height = height + "px";
                context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
                var pagediv = $('#' + this._id + 'pageDiv_' + i);
                pagediv[0].style.top = this._pageLocation[i] * this._zoomVal + "px";
                pagediv[0].style.left = leftpos + "px";

                //Hyperlink canvas

                var hyperlinklayer = document.getElementById(this._id +'selectioncanvas_' + i);
                hyperlinklayer.style.height = canvas.height + 'px';
                hyperlinklayer.style.width = canvas.width + 'px';
                hyperlinklayer.style.position = 'absolute';
                hyperlinklayer.style.left = 0;
                hyperlinklayer.style.top = 0;
                hyperlinklayer.style.backgroundColor = 'transparent';
                hyperlinklayer.style.zIndex = '2';

                //resizing the loding indicator of the page
                $('#' + this._id + 'pageDiv_' + i + '_WaitingPopup').css({ 'display': 'block', 'height': canvas.height + 'px', 'width': canvas.width + 'px' ,'left':'0px','top':'0px'});
                var loadingindicator = document.getElementById(this._id + 'pageDiv_' + i + '_WaitingPopup');
                var spanDiv = loadingindicator.childNodes[0];
                spanDiv.style.top = (canvas.height - spanDiv.clientHeight) / 2 + 'px';
            }
            if (this._renderedCanvasList)
                this._renderedCanvasList.length = 0;
            if (this._zoomVal < 1)
                pageViewerContainer.css({ '-ms-scroll-limit-y-max': (this._cummulativeHeight * this._zoomVal) - this.element.height() + 50 + "px" });
            else {
                pageViewerContainer.css({ '-ms-scroll-limit-y-max': "" });
            }
            if (this._imageObj) {
                for (var i = 0; i < this._imageObj.length; i++) {
                    this._imageObj[i].removeEventListener("load", this._imageOnLoad);
                }
            }
            vscrolBar.scrollTop = scrollValue;
            this._eventpreviouszoomvalue = this._preZoomVal;
            this._eventzoomvalue = this._zoomVal;
            this._previousZoom = this._zoomVal;
            zoomouteventvalue.previousZoomPercentage = Math.round(this._eventpreviouszoomvalue * 100);
            zoomouteventvalue.currentZoomPercentage = Math.round(this._eventzoomvalue * 100);
            this._raiseClientEvent("zoomChange", zoomouteventvalue);
            this.zoomPercentage = Math.round(this._zoomVal * 100);
        },

        _zoomContainer: function (zoomfactor, isMode) {
            this._fitType = null;
            this._zoomVal = zoomfactor;
            /*When the zoom options are used after the page fit operations, the buttons that are disabled during page fit operation
               must be enabled. So the class that disables the button is removed.
            */
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitPage');
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitWidth');

            if (this._isAutoZoom && this._renderedCanvasList && this._isWindowResizing) {
                this._applyFitToWidthAuto();
                zoomfactor = this._zoomVal;
            }
            else {
                var scalefactor = Math.abs(this._preZoomVal - zoomfactor);
                if (scalefactor == 0) return false;
                if (this._preZoomVal > zoomfactor) {
                    this._zoomOutContainer(isMode, scalefactor);
                } else {
                    this._zoomInContainer(isMode, scalefactor);
                }
            }
            this._preZoomVal = zoomfactor;
            this._updateZoomButtons();
        },

        /*  *Since the pageFit option does not have a index for zoom level,assign the zoom level based on its nearest value. 
            * _calculateZoomLevel() function  does this function by getting the nearest lower index and higher index of 
            zoom percent in "container_toolbar_zoomSelection_popup" using binary search algorithm.
        */

        _calculateZoomLevel: function (zoomfactor) {
            this._calculateZoomArrayValues();
            //searching the nearest lower index and higher index for the fitType in the zoom level.
            var zoomVal = zoomfactor;
            var min = 0, max = this._zoomArray.length - 1;
            while (min <= max) {
                var mid = Math.round((min + max) / 2);
                if (this._zoomArray[mid] <= zoomVal) {
                    min = mid + 1;
                } else if (this._zoomArray[mid] >= zoomVal) {
                    max = mid - 1;
                }
                else {
                    return mid;
                }
            }
            this._lowerZoomIndex = max;
            this._higherZoomIndex = min;
        },

        /*  If zoomIn() function is used after the page fit option, the lower zoom index must be set as the value for _zoomLevel.
            This is done by _applyLowerZoomIndex(). This function is executed only if the fitType is "fitToWidth" or "fitToPage".
        */

        _applyLowerZoomIndex: function () {
            var currentZoomArrayCount = 0;
            this._calculateZoomArrayValues();
            for (var i = 0; i < this._zoomArray.length; i++) {
                if (this._preZoomVal != this._zoomArray[i]) {
                    currentZoomArrayCount++;
                }
            }
            if (currentZoomArrayCount == this._zoomArray.length)
                this._zoomLevel = this._lowerZoomIndex;
            this._fitType = null;
        },

        /*  If zoomOut() function is used after the page fit option, the higher zoom index must be set as the value for _zoomLevel.
            This is done by _applyHigherZoomIndex(). This function is executed only if the fitType is "fitToWidth" or "fitToPage".
        */

        _applyHigherZoomIndex: function () {
            var currentZoomArrayCount = 0;
            this._calculateZoomArrayValues();
            for ( var i = 0; i < this._zoomArray.length; i++) {
                if (this._preZoomVal != this._zoomArray[i]) {
                    currentZoomArrayCount++;
                }
            }
            if (currentZoomArrayCount == this._zoomArray.length)
                this._zoomLevel = this._higherZoomIndex;
            this._fitType = null;
        },
        _calculateZoomArrayValues: function () {
            if (this._zoomArray == undefined) {
                var popupLiItems = document.getElementById(this._id + "_toolbar_zoomSelection_popup").getElementsByTagName("li"); //getting the list of zoom percent in the div
                var zoomArray = [];
                this._zoomArray = zoomArray;
                //Converting the list into an array.
                for (var i = 0; i < popupLiItems.length; i++) {
                    zoomArray.push(parseInt(popupLiItems[i].textContent) / 100);
                }
            }
        },

        _updateZoomButtons: function () {
            if (this._zoomVal <= 0.5) {
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_zoomout');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_zoomin');
            } else if (this._zoomVal == 4) {
                this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_zoomin');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_zoomout');
            } else {
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_zoomout');
                this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_zoomin');
            }
        },

        _showZoomControl: function (show) {
            if (show) {
                $('#' + this._id + '_toolbar_zoomin').parents("li.e-pdfviewer-toolbarli").css("display", "block");
                $('#' + this._id + '_toolbar_zoomout').parents("li.e-pdfviewer-toolbarli").css("display", "block");
                $('#' + this._id + '_toolbar_zoomSelection').parents("div.e-pdfviewer-ejdropdownlist").css("display", "block");
                this._isMagnificationHidden = false;
            }
            else {
                $('#' + this._id + '_toolbar_zoomin').parents("li.e-pdfviewer-toolbarli").css("display", "none");
                $('#' + this._id + '_toolbar_zoomout').parents("li.e-pdfviewer-toolbarli").css("display", "none");
                $('#' + this._id + '_toolbar_zoomSelection').parents("div.e-pdfviewer-ejdropdownlist").css("display", "none");
                this._isMagnificationHidden = true;
            }
        },
        //-------------------- Page Zoom[end] -------------------------//

        _fitToAutoSize: function () {
            var zoomFactor = this._zoomVal;
            var pageViewerContainer = $('#' + this._id + '_viewerContainer');
            var pagecontainer = $('#' + this._id + '_pageviewContainer');
            var w = pagecontainer.width();
            var h = pagecontainer.height();
            var zoomouteventvalue = { currentZoomPercentage: 0, previousZoomPercentage: 0 };
            var vscrolBar = document.getElementById(this._id + '_viewerContainer');
            var vscrolValue = vscrolBar.scrollTop;
            var scrollValue = (vscrolValue / this._previousZoom) * this._zoomVal;
            var transform = "scale(" + this._zoomVal + "," + this._zoomVal + ")";
            for (var i = 1; i <= this._totalPages; i++) {
                var leftpos;
                leftpos = (this.element.width() - this._pageSize[i - 1].PageWidth * this._zoomVal) / 2;
                if ((this._isAutoZoom && this._zoomVal < 1) || leftpos < 0)
                    leftpos = 5;
                var canvas = document.getElementById(this._id +'pagecanvas_' + i);
                var context = canvas.getContext('2d');
                var height = this._pageSize[i - 1].PageHeight * this._zoomVal;
                var width = this._pageSize[i - 1].PageWidth * this._zoomVal;
                canvas.style.height = height + 'px';
                canvas.style.width = width + 'px';
                var pagediv = $('#' + this._id + 'pageDiv_' + i);
                pagediv[0].style.top = this._pageLocation[i] * this._zoomVal + "px";
                pagediv[0].style.left = leftpos + "px";

                var selectionlayer = document.getElementById(this._id +'selectioncanvas_' + i);
                selectionlayer.style.height = height + 'px';
                selectionlayer.style.width = width + 'px';
                selectionlayer.style.position = 'absolute';
                selectionlayer.style.left = 0;
                selectionlayer.style.top = 0;
                selectionlayer.style.backgroundColor = 'transparent';
                selectionlayer.style.zIndex = '2';
                //resizing the loding indicator of the page
                var jsonData = this._pageContents[parseInt(i)];
                if (jsonData && this._renderedCanvasList.indexOf(i) != -1) {
                    if (this._pdfService == ej.PdfViewer.PdfService.Local)
                        jsondata = JSON.parse(jsonData);
                    else
                        jsondata = JSON.parse(jsonData["d"]);
                    var children = $('#' + this._id + 'selectioncanvas_' + i).children();
                    for (k = 0; k < children.length; k++) {
                        if ($(children[k]).hasClass('e-pdfviewer-textLayer')) {
                            $(children[k]).remove();
                            $('#' + this._id + 'selectioncanvas_' + i).removeClass('text_container');
                        }
                    }
                    if (!$('#' + this._id + 'selectioncanvas_' + i).hasClass('text_container')) {
                        this._textSelection(jsondata, i, context);
                    } else {
                        this._resizeSelection(jsondata, i, context);
                    }
                }

                $('#' + this._id + 'pageDiv_' + i + '_WaitingPopup').css({ 'display': 'none', 'height': height + 'px', 'width': width + 'px', 'left': '0px', 'top': '0px' });
                var loadingindicator = document.getElementById(this._id + 'pageDiv_' + i + '_WaitingPopup');
                if (loadingindicator) {
                    var spanDiv = loadingindicator.childNodes[0];
                    spanDiv.style.top = (canvas.height - spanDiv.clientHeight) / 2 + 'px';
                }
            }
            if (this._zoomVal < 1)
                pageViewerContainer.css({ '-ms-scroll-limit-y-max': (this._cummulativeHeight * this._zoomVal) - this.element.height() + 50 + "px" });
            else {
                pageViewerContainer.css({ '-ms-scroll-limit-y-max': "" });
            }
            vscrolBar.scrollTop = scrollValue;
            this._eventpreviouszoomvalue = this._preZoomVal;
            this._eventzoomvalue = this._zoomVal;
            this._previousZoom = this._zoomVal;
            this._preZoomVal = this._zoomVal;
            zoomouteventvalue.previousZoomPercentage = Math.round(this._eventpreviouszoomvalue * 100);
            zoomouteventvalue.currentZoomPercentage = Math.round(this._eventzoomvalue * 100);
            this._raiseClientEvent("zoomChange", zoomouteventvalue);
            this.zoomPercentage = Math.round(this._zoomVal * 100);
        },

        _initRerendering: function () {
            if (!this._isRerenderCanvasCreated) {
                this._designNewCanvas();
                var renderList = [];
                var currentPage = this._currentPage;
                renderList.push(parseInt(this._currentPage));
                var prevPage; var nextPage;
                if (this._renderedCanvasList) {
                    prevPage = parseInt(this._currentPage) - 1;
                    if (this._renderedCanvasList.indexOf(prevPage) != -1)
                        renderList.push(prevPage);
                    nextPage = parseInt(this._currentPage) + 1;
                    if (this._renderedCanvasList.indexOf(nextPage) != -1)
                        renderList.push(nextPage);
                }
                else {
                    prevPage = parseInt(this._currentPage) - 1;
                    renderList.push(prevPage);
                    nextPage = parseInt(this._currentPage) + 1;
                    renderList.push(nextPage);
                }
                this._rerenderCanvasList = renderList;
                if (true) {
                    var proxy = this;
                    clearInterval(proxy._scrollTimer);
                    proxy._bgRenderTimer = setInterval(function () { proxy._rerenderCanvas(currentPage) }, 10);
                }
                this._renderedCanvasList.length = 0;
            }
        },

        _designNewCanvas: function () {
            for (var i = 1; i <= this._totalPages; i++) {
                var pageDiv = document.getElementById(this._id + 'pageDiv_' + i);
                var canvas = document.getElementById(this._id +'pagecanvas_' + i);
                var newCanvas = document.createElement('canvas');
                var height = this._pageSize[i - 1].PageHeight * this._zoomVal;
                var width = this._pageSize[i - 1].PageWidth * this._zoomVal;
                newCanvas.style.visibility = 'hidden';
                newCanvas.style.width = width + "px";
                newCanvas.style.height = height + "px";
                newCanvas.style.backgroundColor = 'white';
                newCanvas.style.boxShadow = '0px 0px 0px 1px #000000';
                newCanvas.height = height;
                newCanvas.width = width;
                newCanvas.id = canvas.id;
                newCanvas.className = "e-pdfviewer-pageCanvas";
                canvas.id = this._id + 'oldcanvas_' + i;
                pageDiv.appendChild(newCanvas);
                $(newCanvas).css({ 'user-select': 'none' });
            }
            this._isRerenderCanvasCreated = true;
        },

        _replaceOldCanvas: function () {
            for (var i = 1; i <= this._totalPages; i++) {
                var pageDiv = document.getElementById(this._id + 'pageDiv_' + i);
                var canvas = document.getElementById(this._id +'pagecanvas_' + i);
                var oldcanvas = document.getElementById(this._id +'oldcanvas_' + i);
                canvas.style.visibility = 'visible';
                pageDiv.removeChild(oldcanvas);
            }
            this._isRerenderCanvasCreated = false;
            var proxy = this;
            clearInterval(proxy._bgRenderTimer);
            proxy._scrollTimer = setInterval(function () { proxy._pageviewscrollchanged(proxy._pageHeight) }, 500);
        },

        _rerenderCanvas: function (currentPage) {
            if (this._renderedCanvasList.indexOf(parseInt(currentPage)) == -1 && currentPage <= this._totalPages && this._rerenderCanvasList.indexOf(parseInt(currentPage)) != -1) {
                var jsdata = this._pageContents[parseInt(currentPage)];
                this._rerenderPdfPage(jsdata);
                this._renderCount = this._renderCount + 1;
            } else if (this._renderedCanvasList.indexOf(parseInt(currentPage) - 1) == -1 && (currentPage - 1) <= this._totalPages && this._rerenderCanvasList.indexOf(parseInt(currentPage) - 1) != -1) {
                var jsdata = this._pageContents[parseInt(currentPage) - 1];
                this._rerenderPdfPage(jsdata);
                this._renderCount = this._renderCount + 1;
            } else if (this._renderedCanvasList.indexOf(parseInt(currentPage) + 1) == -1 && (currentPage + 1) <= this._totalPages && this._rerenderCanvasList.indexOf(parseInt(currentPage) + 1) != -1) {
                var jsdata = this._pageContents[parseInt(currentPage) + 1];
                this._rerenderPdfPage(jsdata);
                this._renderCount = this._renderCount + 1;
            }
            if (this._renderCount == this._rerenderCanvasList.length) {
                this._replaceOldCanvas();
                for (var i = 1; i <= this._totalPages; i++) {
                    if (this._renderedCanvasList.indexOf(i) == -1) {
                        $('#' + this._id + 'pageDiv_' + i + '_WaitingPopup').css({ 'display': 'block' });
                    }
                }
                this._renderCount = 0;
                this._rerenderCanvasList.length = 0;
            }
        },

        _rerenderPdfPage: function (jsondata) {
            var backupjson = jsondata;
            if (this._pdfService == ej.PdfViewer.PdfService.Local)
                jsondata = JSON.parse(jsondata);
            else
                jsondata = JSON.parse(jsondata["d"]);
            this._renderedCanvasList.push(parseInt(jsondata["currentpage"]));
            var pageindex = parseInt(jsondata["currentpage"]);
            var pageimageList = jsondata["imagestream"];

            this._pageContents[parseInt(jsondata["currentpage"])] = backupjson;

            //  Hyperlink
            this._regenerateFormFields(jsondata, pageindex);
            var children = $('#' + this._id + 'selectioncanvas_' + pageindex).children();
            for (i = 0; i < children.length; i++) {
                if (children[i].hasAttribute('href') || $(children[i]).hasClass('e-pdfviewer-formFields'))
                    $(children[i]).remove();
            }
            this._createFormFields(jsondata, pageindex);
            var linkannot = jsondata["linkannotation"];
            var documentlinkpagenumber = jsondata["annotpagenum"];
            var ins = this;
            if (this.model.enableHyperlink) {
                for (var l = 0; l < linkannot.length; l++) {
                    var aTag = document.createElement('a');
                    aTag.id = 'linkdiv_' + l;
                    var rect = linkannot[l].AnnotRectangle;
                    aTag.style.background = 'transparent';
                    aTag.style.position = 'absolute';
                    aTag.style.left = this._convertPointToPixel(rect.Left * this._zoomVal) + 'px';
                    aTag.style.top = this._convertPointToPixel(rect.Top * this._zoomVal) + 'px';
                    aTag.style.width = this._convertPointToPixel(rect.Width * this._zoomVal) + 'px';
                    aTag.style.height = this._convertPointToPixel(rect.Height * this._zoomVal) + 'px';
                    aTag.style.color = 'transparent';
                    if (linkannot[l].URI.indexOf("mailto:") != -1) {
                        var mail = linkannot[l].URI.substring(linkannot[l].URI.indexOf("mailto:"), linkannot[l].URI.length);
                        aTag.title = mail;
                        aTag.setAttribute('href', mail);
                    } else {
                        aTag.title = linkannot[l].URI;
                        aTag.setAttribute('href', linkannot[l].URI);
                    }
                    if (this.model.hyperlinkOpenState == ej.PdfViewer.LinkTarget.Default) {
                        aTag.target = "_self";
                        aTag.onclick = function () {
                            var hyperlink = { hyperlink: this.href }
                            ins._raiseClientEvent("hyperlinkClick", hyperlink);
                        }
                    } else if (this.model.hyperlinkOpenState == ej.PdfViewer.LinkTarget.NewTab) {
                        aTag.target = "_blank";
                        aTag.onclick = function () {
                            var hyperlink = { hyperlink: this.href }
                            ins._raiseClientEvent("hyperlinkClick", hyperlink);

                        }
                    } else if (this.model.hyperlinkOpenState == ej.PdfViewer.LinkTarget.NewWindow) {

                        aTag.onclick = function () {
                            var hyperlink = { hyperlink: this.href }
                            ins._raiseClientEvent("hyperlinkClick", hyperlink);
                            window.open(this.href, '_blank', 'scrollbars=yes,resizable=yes');
                            return false;
                        }
                    }
                    if (documentlinkpagenumber[l] != undefined) {
                        var destPageHeight = (this._pageSize[pageindex - 1].PageHeight);
                        var destAnnotLoc = this._convertPointToPixel(linkannot[l].AnnotLocation);
                        var dest = (destPageHeight - destAnnotLoc);
                        var scrollvalue = (parseFloat(this._pageLocation[documentlinkpagenumber[l]] * this._zoomVal)) + parseFloat(dest * this._zoomVal);
                        aTag.name = scrollvalue;
                        aTag.onclick = function () {
                            var pageviewcontainer = document.getElementById('container_viewerContainer');
                            pageviewcontainer.scrollTop = this.name;
                            return false;
                        }
                    }
                    var selectioncanvas = document.getElementById(this._id +'selectioncanvas_' + pageindex);
                    selectioncanvas.appendChild(aTag);
                }
            }
            //Hyperlink

            var index = parseInt(jsondata["currentpage"]);
            var canvas = document.getElementById(this._id +'pagecanvas_' + parseInt(jsondata["currentpage"]));
            var context = canvas.getContext('2d');
            var imageObjCollection = new Array();
            var imageTransformCollection = new Array();
            var imageDataCollection = new Array();
            var currentIndexCollection = new Array();
            var pageDataCollection = new Array();
            var zoomFactor;
            var browserUserAgent = navigator.userAgent;
            var offsett;
            var imageIndex = 0;

            var charPath = new Array();
            var shapes = pageimageList["textelements"];
            for (var j = 0; j < shapes.length; j++) {
                var pathdata = shapes[j];
                var color = pathdata["color"];
                var matrix = pathdata["matrix"];
                if (matrix != null)
                    matrix = matrix["Elements"];
                var brushMode = pathdata["brush"];
                var pathValue = pathdata["pathValue"];
                var isClipping = pathdata["iscliping"];
                var restoreCanvas = pathdata["restorecanvas"];
                var imageData = pathdata["imagedata"];
                var fillMode = pathdata["fillrule"];
                var fillStroke = pathdata["isFillandStroke"];
                var fillColor = pathdata["fillcolor"];
                var strokeColor = pathdata["strokecolor"];
                var lineWidth = pathdata["linewidth"];
                var lineCap = pathdata["linecap"];
                var linearGradient = pathdata["linearGradientBrush"];
                var charID = pathdata["charID"];
                if (pathValue != null) {
                    pathValue = pathValue.split(";");
                    if (charID)
                        charPath[charID] = pathValue;
                }
                else if (pathValue == null && charID) {
                    pathValue = charPath[charID];
                }
                if (restoreCanvas == false) {
                    context.save();
                }
                if (pathValue != undefined) {
                    context.setTransform(matrix[0] * this._zoomVal, matrix[1], matrix[2], matrix[3] * this._zoomVal, matrix[4] * this._zoomVal, matrix[5] * this._zoomVal);
                }

                if (pathValue != null) {
                    context.beginPath();

                    for (var i = 0; i < pathValue.length; i++) {
                        var val = pathValue[i];
                        var pathType = val[0];
                        if (pathType == "M") {
                            val = val.substring(1, val.length);
                            val = val.split(" ");
                            context.moveTo((val[0]), val[1]);
                        }
                        else if (pathType == "L") {
                            val = val.substring(1, val.length);
                            val = val.split(" ");
                            context.lineTo((val[0]), val[1]);
                        }
                        else if (pathType == "C") {
                            val = val.substring(1, val.length);
                            val = val.split(" ");
                            context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
                        }
                        else if (pathType == "Z") {
                            context.closePath();
                        }
                    }
                    if (isClipping == true) {
                        if (fillMode == "evenodd")
                            context.msFillRule = "evenodd";
                        context.clip();

                    }
                    else {
                        if (fillStroke == undefined) {
                            if (brushMode == "Fill") {
                                if (linearGradient != undefined) {
                                    context.fillStyle = this._getGradientBrush(linearGradient, context);
                                }
                                else
                                    context.fillStyle = color;
                                if (fillMode == "evenodd")
                                    context.msFillRule = "evenodd";
                                context.fill();
                            }
                            else if (brushMode == "FillandStroke") {
                                context.fillStyle = color;
                                context.fill();
                                context.strokeStyle = strokeColor;
                                context.stroke();
                            }
                            else if (brushMode == "Stroke") {
                                context.strokeStyle = strokeColor;
                                context.lineWidth = lineWidth;
                                context.lineCap = lineCap;
                                context.stroke();
                            }
                            else {
                                context.strokeStyle = color;
                                context.lineWidth = lineWidth;
                                context.lineCap = lineCap;
                                context.stroke();
                            }
                        }
                        else {
                            context.strokeStyle = strokeColor;
                            context.lineWidth = lineWidth;
                            context.lineCap = lineCap;
                            context.stroke();
                            if (linearGradient != undefined) {
                                context.fillStyle = this._getGradientBrush(linearGradient, context);
                            }
                            else
                                context.fillStyle = fillColor;
                            if (fillMode == "evenodd")
                                context.msFillRule = "evenodd";
                            context.fill();
                        }
                    }
                }

                if (restoreCanvas)
                    context.restore();
                if (imageData != undefined) {
                    if ((offsett = browserUserAgent.indexOf("Firefox")) != -1 || (offsett = browserUserAgent.indexOf("Chrome")) != -1 || (offsett = browserUserAgent.indexOf("Safari")) != -1 || (offsett = browserUserAgent.indexOf("AppleWebKit")) != -1) {
                        imageObjCollection.push(imageData);
                        imageTransformCollection.push(matrix);
                        pageDataCollection.push(shapes);
                        currentIndexCollection.push(j);
                        zoomFactor = this._zoomVal;
                        this._isContainImage = true;
                        break;
                    }
                    else {
                        var imageObj = new Image();
                        imageObj.src = imageData;
                        context.setTransform(matrix[0] * this._zoomVal, matrix[1], matrix[2], matrix[3] * this._zoomVal, matrix[4] * this._zoomVal, matrix[5] * this._zoomVal);
                        context.drawImage(imageObj, 0, 0, 1, 1);
                    }
                }
            }

            if ((offsett = browserUserAgent.indexOf("Firefox")) != -1 || (offsett = browserUserAgent.indexOf("Chrome")) != -1 || (offsett = browserUserAgent.indexOf("Safari")) != -1 || (offsett = browserUserAgent.indexOf("AppleWebKit")) != -1) {
                for (var k = 0; k < imageObjCollection.length; k++) {
                    this._imageRenderingPinch(shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, k, pageDataCollection, currentIndexCollection, charPath, canvas, index, imageIndex);
                    imageIndex++;
                }
            }
            this._showPageLoadingIndicator(pageindex, false);
            return canvas;
        },
        _regenerateFormFields: function (jsondata, pageindex) {
            var TextBoxField = jsondata["PdfRenderedFields"];
            var backgroundcolor;
            if (TextBoxField != null) {
                for (var l = 0; l < TextBoxField.length; l++) {
                    if ((TextBoxField[l].PageIndex + 1) == pageindex) {
                        var boundingRect = TextBoxField[l].LineBounds;
                        var inputdiv = document.getElementById(this._id + 'input_' + pageindex + '_' + l);
                        if (TextBoxField[l].Name == "Textbox") {
                            var name = $(inputdiv).attr("name");
                            if (TextBoxField[l].FieldName == name)
                                TextBoxField[l].Text = $(inputdiv).val();
                        }
                        else if (TextBoxField[l].Name == "Password") {
                            var name = $(inputdiv).attr("name");
                            if (TextBoxField[l].FieldName == name)
                                TextBoxField[l].Text = $(inputdiv).val();
                        }
                        else if (TextBoxField[l].Name == "RadioButton") {
                            var name = $(inputdiv).attr("name");
                            if (TextBoxField[l].GroupName == name) {
                                if ($(inputdiv).prop("checked") == true)
                                    TextBoxField[l].Selected = true;
                                else
                                    TextBoxField[l].Selected = false;
                            }
                        }
                        else if (TextBoxField[l].Name == "CheckBox") {
                            var name = $(inputdiv).attr("name");
                            if (TextBoxField[l].GroupName == name) {
                                if ($(inputdiv).prop("checked") == true)
                                    TextBoxField[l].Selected = true;
                                else
                                    TextBoxField[l].Selected = false;
                            }
                        }
                        else if (TextBoxField[l].Name == "DropDown") {
                            var name = $(inputdiv).attr("name");
                            if (TextBoxField[l].Text == name) {
                                if (TextBoxField[l].SelectedValue == "") {
                                    var option = $(inputdiv).children()[0];
                                    option.id = "dropdownhide";
                                    if ($(option).prop("selected") == true)
                                        TextBoxField[l].SelectedValue = "";
                                }
                                for (var j = 0; j < TextBoxField[l].TextList.length; j++) {
                                    var option;
                                    if ($(inputdiv).children()[0].id == "dropdownhide")
                                        option = $(inputdiv).children()[j + 1];
                                    else
                                        option = $(inputdiv).children()[j];
                                    if ($(option).prop("selected") == true)
                                        TextBoxField[l].SelectedValue = TextBoxField[l].TextList[j];
                                }
                            }
                        }
                        else if (TextBoxField[l].Name == "ListBox") {
                            var k = 0;
                            for (var j = 0; j < TextBoxField[l].TextList.length; j++) {
                                var option = $(inputdiv).children()[j];
                                if ($(option).prop("selected") == true) {
                                    TextBoxField[l].SelectedList[k] = j;
                                    k++;
                                }
                            }
                        }
                    }
                }
            }


        },
        _imageRenderingPinch: function (shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, index, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex) {
            var proxy = this;
            var zoomValue = proxy._zoomVal;
            var imageObject = new Image();
            imageObject.onload = function () {
                var isImageContentChanged = false;
                for (var l = 0; l < imageTransformCollection.length; l++) {
                    if (isImageContentChanged == false) {
                        var matrixData = imageTransformCollection[l];
                        context.setTransform(matrixData[0] * zoomValue, matrixData[1], matrixData[2], matrixData[3] * zoomValue, matrixData[4] * zoomValue, matrixData[5] * zoomValue);
                        if (imageDataCollection[imageIndex] != undefined) {
                            context.drawImage(imageDataCollection[imageIndex], 0, 0, 1, 1);
                        }
                        var dataIndex = currentIndexCollection[l];
                        dataIndex = dataIndex + 1;
                        var data = pageDataCollection[l];
                        while (dataIndex < data.length) {
                            var pathdata = data[dataIndex];
                            var color = pathdata["color"];
                            var matrix = pathdata["matrix"];
                            if (matrix != null)
                                matrix = matrix["Elements"];
                            var brushMode = pathdata["brush"];
                            var pathValue = pathdata["pathValue"];
                            var isClipping = pathdata["iscliping"];
                            var restoreCanvas = pathdata["restorecanvas"];
                            var imageData = pathdata["imagedata"];
                            var fillMode = pathdata["fillrule"];
                            var fillStroke = pathdata["isFillandStroke"];
                            var fillColor = pathdata["fillcolor"];
                            var strokeColor = pathdata["strokecolor"];
                            var lineWidth = pathdata["linewidth"];
                            var lineCap = pathdata["linecap"];
                            var linearGradient = pathdata["linearGradientBrush"];
                            var charID = pathdata["charID"];
                            if (pathValue != null) {
                                pathValue = pathValue.split(";");
                                if (charID)
                                    charPath[charID] = pathValue;
                            }
                            else if (pathValue == null && charID) {
                                pathValue = charPath[charID];
                            }
                            if (restoreCanvas == false) {
                                context.save();
                            }
                            if (pathValue != undefined) {
                                context.setTransform(matrix[0] * zoomValue, matrix[1], matrix[2], matrix[3] * zoomValue, matrix[4] * zoomValue, matrix[5] * zoomValue);
                            }

                            if (pathValue != null) {
                                context.beginPath();

                                for (var i = 0; i < pathValue.length; i++) {
                                    var val = pathValue[i];
                                    var pathType = val[0];
                                    if (pathType == "M") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.moveTo((val[0]), val[1]);
                                    }
                                    else if (pathType == "L") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.lineTo((val[0]), val[1]);
                                    }
                                    else if (pathType == "C") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
                                    }
                                    else if (pathType == "Z") {
                                        context.closePath();
                                    }
                                }
                                if (isClipping == true) {
                                    if (fillMode == "evenodd")
                                        context.msFillRule = "evenodd";
                                    context.clip();

                                }
                                else {
                                    if (fillStroke == undefined) {
                                        if (brushMode == "Fill") {
                                            if (linearGradient != undefined) {
                                                context.fillStyle = this._getGradientBrush(linearGradient, context);
                                            }
                                            else
                                                context.fillStyle = color;
                                            if (fillMode == "evenodd")
                                                context.msFillRule = "evenodd";
                                            context.fill();
                                        }
                                        else if (brushMode == "FillandStroke") {
                                            context.fillStyle = color;
                                            context.fill();
                                            context.strokeStyle = strokeColor;
                                            context.stroke();
                                        }
                                        else if (brushMode == "Stroke") {
                                            context.strokeStyle = strokeColor;
                                            context.lineWidth = lineWidth;
                                            context.lineCap = lineCap;
                                            context.stroke();
                                        }
                                        else {
                                            context.strokeStyle = color;
                                            context.lineWidth = lineWidth;
                                            context.lineCap = lineCap;
                                            context.stroke();
                                        }
                                    }
                                    else {
                                        context.strokeStyle = strokeColor;
                                        context.lineWidth = lineWidth;
                                        context.lineCap = lineCap;
                                        context.stroke();
                                        if (linearGradient != undefined) {
                                            context.fillStyle = this._getGradientBrush(linearGradient, context);
                                        }
                                        else
                                            context.fillStyle = fillColor;
                                        if (fillMode == "evenodd")
                                            context.msFillRule = "evenodd";
                                        context.fill();
                                    }
                                }
                            }

                            if (restoreCanvas)
                                context.restore();
                            if (imageData != undefined) {
                                isImageContentChanged = true;
                                imageObjCollection.pop();
                                imageTransformCollection.pop();
                                pageDataCollection.pop();
                                currentIndexCollection.pop();
                                imageObjCollection.push(imageData);
                                imageTransformCollection.push(matrix);
                                pageDataCollection.push(shapes);
                                currentIndexCollection.push(dataIndex);
                                l = -1;
                                imageIndex++;
                                break;
                            }
                            dataIndex++;
                        }
                    }
                    else {
                        proxy._imageRenderingPinch(shapes, imageDataCollection, imageObjCollection, imageTransformCollection, context, l, pageDataCollection, currentIndexCollection, charPath, canvas, currentindex, imageIndex);
                        imageIndex++;
                    }
                }
            }
            imageObject.src = imageObjCollection[index];
            imageDataCollection.push(imageObject);
        },
        //-------------------- Pinch Zoom [Start] -----------------------------//

        _touchStart: function (event) {
            var eventTouch = event.touches;
            if (eventTouch.length > 1) {
                event.preventDefault();
            }
            var ejViewer = $(event.target).parents('.e-pdfviewer.e-js');
            var ejViewerInstance = ejViewer.ejPdfViewer("instance");
            ejViewerInstance._touched = false;
        },
        _touchMove: function (event) {
            var eventTouch = event.touches;
            if (eventTouch.length > 1) {
                var ejViewer = $(event.target).parents('.e-pdfviewer.e-js');
                var ejViewerInstance = ejViewer.ejPdfViewer("instance");
                ejViewerInstance._touched = true;
                if (!ejViewerInstance._isRerenderCanvasCreated) {
                    $('.e-pdfviewer-formFields').hide();
                    var currentDiff = Math.sqrt(Math.pow((eventTouch[0].clientX - eventTouch[1].clientX), 2) + Math.pow((eventTouch[0].clientY - eventTouch[1].clientY), 2));
                    if (ejViewerInstance._prevDiff > -1) {
                        if (currentDiff > ejViewerInstance._prevDiff) {
                            ejViewerInstance._pinchOut(event);
                        } else if (currentDiff < ejViewerInstance._prevDiff) {
                            ejViewerInstance._pinchIn(event);
                        }
                    } else if (ejViewerInstance._zoomVal < 2) {
                        if (ejViewerInstance._prevDiff != -1) {
                            if (currentDiff > ejViewerInstance._prevDiff) {
                                ejViewerInstance._pinchIn(event);
                            }
                        }
                    } else if (ejViewerInstance._prevDiff == -1) {
                        if (ejViewerInstance._zoomVal > 2) {
                            if (currentDiff > ejViewerInstance._prevDiff) {
                                ejViewerInstance._pinchIn(event);
                            }
                        }
                    }
                    ejViewerInstance._prevDiff = currentDiff;
                }
            }
        },

        _touchEnd: function (event) {
            var ejViewer = $(event.target).parents('.e-pdfviewer.e-js');
            var ejViewerInstance = ejViewer.ejPdfViewer("instance");
            ejViewerInstance._prevDiff = -1;
            if (ejViewerInstance._isRenderedByPinch) {
                if (ejViewerInstance._renderedCanvasList.length != 0) {
                    if (!ejViewerInstance._isRerenderCanvasCreated) {
                        ejViewerInstance._designNewCanvas();
                        var renderList = [];
                        var currentPage = ejViewerInstance._currentPage;
                        renderList.push(parseInt(ejViewerInstance._currentPage));
                        var prevPage = parseInt(ejViewerInstance._currentPage) - 1;
                        if (ejViewerInstance._renderedCanvasList.indexOf(prevPage) != -1)
                            renderList.push(prevPage);
                        var nextPage = parseInt(ejViewerInstance._currentPage) + 1;
                        if (ejViewerInstance._renderedCanvasList.indexOf(nextPage) != -1)
                            renderList.push(nextPage);
                        ejViewerInstance._rerenderCanvasList = renderList;
                        var proxy = ejViewerInstance;
                        window.clearInterval(proxy._scrollTimer);
                        proxy._bgRenderTimer = setInterval(function () { proxy._rerenderCanvas(currentPage) }, 10);
                        ejViewerInstance._renderedCanvasList.length = 0;
                    }
                }
                ejViewerInstance._isRenderedByPinch = false;
            }
        },

        _pointerdown: function (event) {
            if (event.originalEvent.pointerType == 'touch') {
                this._pointerCount = this._pointerCount + 1;
                if (this._pointerCount <= 2) {
                    event.preventDefault();
                    this._pointers.push(event.originalEvent);
                    if (this._pointerCount == 2)
                        this._pointerCount = 0;
                }
            }
        },

        _pointermove: function (event) {
            if (event.originalEvent.pointerType == 'touch') {
                if (this._pointers.length == 2) {
                    event.preventDefault();
                    for (var i = 0; i < this._pointers.length; i++) {
                        if (event.originalEvent.pointerId == this._pointers[i].pointerId) {
                            this._pointers[i] = event.originalEvent;
                            break;
                        }
                    }
                    if (!this._isRerenderCanvasCreated) {
                        var currentDiff = Math.sqrt(Math.pow((this._pointers[0].clientX - this._pointers[1].clientX), 2) + Math.pow((this._pointers[0].clientY - this._pointers[1].clientY), 2));
                        if (this._prevDiff > -1) {
                            if (currentDiff > this._prevDiff) {
                                this._pinchOut(event);
                            } else if (currentDiff < this._prevDiff) {
                                this._pinchIn(event);
                            }
                        }
                        var vscrolBar = document.getElementById(this._id + '_viewerContainer');
                        var scroltop = vscrolBar.scrollTop;
                        if (!(scroltop == 0)) {
                            if (currentDiff > this._prevDiff) {
                                this._pinchOut(event);
                            } else if (currentDiff < this._prevDiff) {
                                this._pinchIn(event);
                            }
                        }
                        this._prevDiff = currentDiff;
                    }
                }
            }
        },

        _pointerup: function (event) {
            if (event.originalEvent.pointerType == 'touch') {
                this._pointers = new Array();
                this._pointerCount = 0;
                this._prevDiff = -1;
                if (this._isRenderedByPinch) {
                    event.preventDefault();
                    if (this._renderedCanvasList.length != 0) {
                        if (!this._isRerenderCanvasCreated) {
                            this._designNewCanvas();
                            var renderList = [];
                            var currentPage = this._currentPage;
                            renderList.push(parseInt(this._currentPage));
                            var prevPage = parseInt(this._currentPage) - 1;
                            if (this._renderedCanvasList.indexOf(prevPage) != -1)
                                renderList.push(prevPage);
                            var nextPage = parseInt(this._currentPage) + 1;
                            if (this._renderedCanvasList.indexOf(nextPage) != -1)
                                renderList.push(nextPage);
                            this._rerenderCanvasList = renderList;
                            var proxy = this;
                            window.clearInterval(proxy._scrollTimer);
                            proxy._bgRenderTimer = setInterval(function () { proxy._rerenderCanvas(currentPage) }, 10);
                            this._renderedCanvasList.length = 0;
                        }
                    }
                    this._isRenderedByPinch = false;
                }
            }
        },

        _pinchOut: function (event) {
            this._isAutoZoom = false;
            this._zoomVal = this._zoomVal + 0.01;
            if (this._zoomVal > 2) {
                this._zoomVal = this._zoomVal + 0.01;
            }
            if (this._zoomVal > 4) {
                this._zoomVal = 4;
                this._isPinchLimitReached = true;
            }
            if (this._zoomVal <= 4) {
                if (!this._isPinchLimitReached) {
                    this._fitType = null;
                    this._fitToAutoSize();
                    this._calculateZoomLevel(this._zoomVal);
                    $('#' + this._id + '_toolbar_zoomSelection_hidden').val(Math.round((this._zoomVal * 100)) + "%");
                    this._ejDropDownInstance.model.value = (this._zoomVal * 100) + "%";
                    this._ejDropDownInstance.model.selectedIndices[0] = "";
                    $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
                    this._updateZoomButtons();
                    this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitPage');
                    this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitWidth');
                    this._isRenderedByPinch = true;
                }
                this._isPinchLimitReached = false;
            } else {
                this._zoomVal = 4;
            }
        },

        _pinchIn: function (event) {
            this._isAutoZoom = false;
            this._zoomVal = this._zoomVal - 0.01;
            if (this._zoomVal < 4 && this._zoomVal > 2) {
                this._zoomVal = this._zoomVal - 0.01;
            }
            if (this._zoomVal < 0.5) {
                this._zoomVal = 0.5;
                this._isPinchLimitReached = true;
            }
            if (this._zoomVal >= 0.5) {
                if (!this._isPinchLimitReached) {
                    this._fitType = null;
                    this._fitToAutoSize();
                    this._calculateZoomLevel(this._zoomVal);
                    $('#' + this._id + '_toolbar_zoomSelection_hidden').val(Math.round((this._zoomVal * 100)) + "%");
                    this._ejDropDownInstance.model.value = (this._zoomVal * 100) + "%";
                    this._ejDropDownInstance.model.selectedIndices[0] = "";
                    $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
                    this._updateZoomButtons();
                    this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitPage');
                    this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitWidth');
                    this._isRenderedByPinch = true;
                }
                this._isPinchLimitReached = false;
            } else {
                this._zoomVal = 0.5;
            }
        },

        //------------------------------- Pinch Zoom [End] ----------------------------------//
        //-------------------------------Text Select and Search [start] ---------------------------//

        _textSearch: function () {
            this._clearAllOccurrences();
            this._selectedIndex = 0;
            this._isTextSearch = true;
            this._searchedPages = new Array();
            this._searchCollection = new Array();
            var searchText = $('#' + this._id + '_pdfviewer_searchinput').val();
            this._searchText = searchText;
            if (searchText == '' || searchText == ' ' || !searchText) {
                return true;
            }
            this._searchPageIndex = parseInt(this._currentPage);
            this._initSearch(this._searchPageIndex);
            this._highlightOtherOccurrences();
        },

        _prevSearch: function () {
            this._clearAllOccurrences();
            this._isPrevSearch = true;
            this._isTextSearch = true;
            this._selectedIndex = this._selectedIndex - 1;
            if (this._selectedIndex < 0) {
                this._searchPageIndex = this._searchPageIndex - 1;
                if (this._searchPageIndex < 1) {
                    this._searchPageIndex = parseInt(this._totalPages);
                }
                this._initSearch(this._searchPageIndex);
            } else {
                this._highlightText(this._searchPageIndex, this._selectedIndex);
            }
            this._highlightOtherOccurrences();
        },

        _nextSearch: function () {
            this._clearAllOccurrences();
            this._isPrevSearch = false;
            this._isTextSearch = true;
            this._selectedIndex = this._selectedIndex + 1;
            if (this._searchCollection[this._searchPageIndex]) {
                if (this._selectedIndex >= this._searchCollection[this._searchPageIndex].length) {
                    this._selectedIndex = 0;
                    if (this._searchPageIndex < this._totalPages) {
                        this._searchPageIndex = this._searchPageIndex + 1;
                    } else {
                        this._searchPageIndex = 1;
                    }
                    this._initSearch(this._searchPageIndex);
                } else {
                    this._highlightText(this._searchPageIndex, this._selectedIndex);
                }
            } else {
                this._searchPageIndex = this._currentPage;
                this._selectedIndex = 0;
                this._initSearch(this._searchPageIndex);
            }
            this._highlightOtherOccurrences();
        },

        _matchcase: function () {
            var checkBox = $('#' + this._id + '_search_matchcase').data('ejCheckBox');
            if (checkBox.model.checkState == "check") {
                this._isMatchCase = true;
            } else {
                this._isMatchCase = false;
            }
            this._textSearch();
        },

        _searchKeypressHandler: function (event) {
            if (event.which == 13) {
                this._searchText = $('#' + this._id + '_pdfviewer_searchinput').val();
                if (this._searchMatches[this._searchPageIndex] && this._searchText != "") {
                    if (this._searchMatches[this._searchPageIndex].length == 0) {
                        this._initSearch(this._searchPageIndex);
                    } else {
                        this._nextSearch();
                    }
                } else if (this._searchText != "") {
                    this._searchPageIndex = this._currentPage;
                    this._selectedIndex = 0;
                    this._initSearch(this._searchPageIndex);
                }
            }
        },

        _initSearch: function (pageIndex) {
            var queryLength = this._searchText.length;
            var searchText = this._searchText;
            this._getPossibleMatches(pageIndex, searchText, queryLength);
        },

        _getPossibleMatches: function (pageIndex, searchText, queryLength) {
            if (!this._pageText[parseInt(pageIndex)] && pageIndex == this._searchPageIndex) {
                this._isRequestFired = true;
                var jsonResult = new Object();
                jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                jsonResult["pageindex"] = pageIndex.toString();
                $('#' + this._id + '_pdfviewer_searchinput').addClass('e-pdfviewer-progressloader');
                this._doAjaxPostSearch(JSON.stringify(jsonResult), pageIndex);
            }
            var pageText = this._pageText[pageIndex];
            if (pageText) {
                if (!this._isMatchCase) {
                    pageText = pageText.toLowerCase();
                    searchText = searchText.toLowerCase();
                }
                var matches = [];
                var matchIndex = -queryLength;
                while (true) {
                    matchIndex = pageText.indexOf(searchText, matchIndex + queryLength);
                    if (matchIndex == -1)
                        break;
                    matches.push(matchIndex);
                }
                this._searchMatches[pageIndex] = matches;
                if (pageIndex == this._searchPageIndex) {
                    if (this._selectedIndex < 0 && this._isPrevSearch) {
                        this._selectedIndex = this._searchMatches[pageIndex].length - 1;
                    }
                    if (this._isRequestFired && this._searchMatches[pageIndex].length != 0 || this._renderedCanvasList.indexOf(pageIndex) == -1 && this._searchMatches[pageIndex].length != 0) {
                        this._gotoPageNo(pageIndex);
                        this._isPageScrolledForSearch = true;
                    }
                    if (this._searchMatches[pageIndex].length == 0) {
                        if (pageIndex != this._totalPages) {
                            if (this._searchedPages.indexOf(parseInt(pageIndex)) == -1) {
                                this._searchedPages.push(pageIndex);
                            }
                            if (this._isPrevSearch) {
                                this._searchPageIndex = this._searchPageIndex - 1;
                                if (this._searchPageIndex <= 0)
                                    this._searchPageIndex = this._totalPages;
                            } else {
                                this._searchPageIndex = this._searchPageIndex + 1;
                            }
                        }
                        else {
                            if (this._searchedPages.indexOf(parseInt(pageIndex)) == -1) {
                                this._searchedPages.push(pageIndex);
                            }
                            if (this._isPrevSearch) {
                                this._searchPageIndex = this._searchPageIndex - 1;
                            } else {
                                this._searchPageIndex = 1;
                            }
                        }
                        if (this._searchedPages.length != this._totalPages || this._searchMatches[pageIndex].length != 0) {
                            this._initSearch(this._searchPageIndex);
                        } else {
                            $('#' + this._id + '_pdfviewer_searchinput').addClass('e-pdfviewer-nooccurrence');
                            $('#' + this._id + '_pdfviewer_searchinput').removeClass('e-pdfviewer-progressloader');
                            this._isRequestFired = false;
                        }
                    } else {
                        if (this._isRequestFired) {
                            $('#' + this._id + '_pdfviewer_searchinput').removeClass('e-pdfviewer-progressloader');
                            var proxy = this;
                            setTimeout(function () {
                                proxy._convertMatches(pageIndex, queryLength);
                                proxy._isRequestFired = false;
                                proxy._isPageScrolledForSearch = false;
                            }, 100);
                        } else {
                            this._convertMatches(pageIndex, queryLength);
                        }
                    }
                } else {
                    if (this._searchMatches[pageIndex].length != 0) {
                        this._convertMatches(pageIndex, queryLength);
                    }
                }
                if (!this._isRequestFired && !this._isPageScrollHighlight) {
                    this._isPageScrolledForSearch = false;
                }
            }
        },

        _convertMatches: function (index, queryLength) {
            var m = 0;
            var matches = this._searchMatches[index];
            var textDiv = this._textDivs[index];
            var divIndex = 0;
            var end = textDiv.length - 1;
            var matchCollection = [];
            for (var i = 0, l = matches.length; i < l; i++) {
                var matchIndex = matches[i];
                if (!this._isPageScrolledForSearch) {
                    while (m != end && matchIndex >= (divIndex + textDiv[m].textContent.length)) {
                        divIndex += textDiv[m].textContent.length;
                        m++;
                    }
                } else {
                    while (m != end && matchIndex >= (divIndex + textDiv[m].textContent.split('\n')[0].length)) {
                        divIndex += textDiv[m].textContent.split('\n')[0].length;
                        m++;
                    }
                }
                var match = {
                    begin: {
                        divId: m,
                        offsetValue: matchIndex - divIndex,
                    }
                };
                matchIndex += queryLength;
                while (m != end && matchIndex > (divIndex + textDiv[m].textContent.length)) {
                    divIndex += textDiv[m].textContent.length;
                    m++;
                }
                match.end = {
                    divId: m,
                    offsetValue: matchIndex - divIndex,
                };
                matchCollection.push(match);
            }
            this._searchCollection[index] = matchCollection;
            this._highlightText(index, this._selectedIndex);
        },

        _highlightText: function (pageIndex, index) {
            var matches = this._searchCollection[pageIndex];
            var textDiv = this._textDivs[pageIndex];
            var prevEnd = null;
            var scrollPoint = { y: -70, x: -400 }
            var startId, className;
            var index0 = 0, index1 = matches.length;
            for (var i = index0; i < index1; i++) {
                var match = matches[i];
                var start = match.begin;
                var end = match.end;
                if (i == this._selectedIndex && pageIndex == this._searchPageIndex) {
                    className = 'e-pdfviewer-texthighlight';
                    startId = start.divId;
                } else {
                    className = 'e-pdfviewer-text-highlightother'
                }
                if (!prevEnd || start.divId !== prevEnd.divId) {
                    if (prevEnd !== null) {
                        this._addSpanForSearch(prevEnd.divId, prevEnd.offsetValue, undefined, pageIndex, textDiv, null);
                    }
                    this._beginText(start, textDiv, pageIndex, null);
                } else {
                    this._addSpanForSearch(prevEnd.divId, prevEnd.offsetValue, start.offsetValue, pageIndex, textDiv, null);
                }
                if (start.divId == end.divId) {
                    this._addSpanForSearch(start.divId, start.offsetValue, end.offsetValue, pageIndex, textDiv, className);
                } else {
                    this._addSpanForSearch(start.divId, start.offsetValue, undefined, pageIndex, textDiv, className);
                    for (var i = start.divId + 1, j = end.divId; i < j; i++) {
                        this._addSpanForSearch(i, 0, undefined, pageIndex, textDiv, className + ' middle');
                    }
                    this._beginText(end, textDiv, pageIndex, className);
                }
                prevEnd = end;
            }
            if (prevEnd) {
                this._addSpanForSearch(prevEnd.divId, prevEnd.offsetValue, undefined, pageIndex, textDiv, null);
            }
            if (pageIndex == this._searchPageIndex)
            this._scrollToSearchStr(textDiv[startId], scrollPoint);
            this._isTextHighlighted = true;
        },

        _beginText: function (span, textDiv, pageIndex, className) {
            var divIndex = span.divId;
            textDiv[divIndex].textContent = '';
            this._addSpanForSearch(divIndex, 0, span.offsetValue, pageIndex, textDiv, className);
        },

        _addSpanForSearch: function (divIndex, fromOffset, toOffset, pageIndex, textDiv, className) {
            var textContent = this._textContents[pageIndex];
            var divTextContent = textContent[divIndex].substring(fromOffset, toOffset);
            var node = document.createTextNode(divTextContent);
            if (className) {
                this._isTextHighlighted = true;
                var spanElement = document.createElement('span');
                spanElement.className = className + ' e-pdfviewer-textLayer';
                if ($(spanElement).hasClass('middle')) {
                    textDiv[divIndex].textContent = '';
                }
                spanElement.appendChild(node);
                textDiv[divIndex].appendChild(spanElement);
                return;
            }
            textDiv[divIndex].appendChild(node);
        },

        _scrollToSearchStr: function (textDiv, scrollPoint) {
            var parent = textDiv.offsetParent;
            var offsetY = textDiv.offsetTop + textDiv.clientTop;
            var offsetX = textDiv.offsetLeft + textDiv.clientLeft;
            while (parent.id != this._id + '_viewerContainer') {
                offsetY += parent.offsetTop;
                offsetX += parent.offsetLeft;
                parent = parent.offsetParent;
            }
            if (scrollPoint) {
                offsetY += scrollPoint.y;
                offsetX += scrollPoint.x;
                if (this._zoomVal > 1.5) {
                    parent.scrollLeft = offsetX;
                }
            }
            parent.scrollTop = offsetY;
        },

        _highlightOtherOccurrences: function () {
            for (var i = 1; i <= this._totalPages; i++) {
                if (this._renderedCanvasList.indexOf(i) != -1 && i != this._searchPageIndex)
                    this._initSearch(i);
            }
            this._isPageScrollHighlight = false;
        },

        _clearAllOccurrences: function () {
            this._isTextHighlighted = false;
            this._isTextSearch = false;
            if (this._searchAjaxRequestState != null) {
                this._searchAjaxRequestState.abort();
                this._searchAjaxRequestState = null;
            }
            if (this._ajaxRequestState != null) {
                this._ajaxRequestState.abort();
                this._ajaxRequestState = null;
            }
            $('#' + this._id + '_pdfviewer_searchinput').removeClass('e-pdfviewer-nooccurrence');
            for (var i = 1; i <= this._totalPages; i++) {
                if (this._renderedCanvasList.indexOf(parseInt(i)) !== -1) {
                    var textDiv = this._textDivs[i];
                    var textContent = this._textContents[i];
                    if (!textDiv || textDiv == undefined) {
                        break;
                    }
                    for (var j = 0; j < textDiv.length; j++) {
                        textDiv[j].textContent = textContent[j];
                        if (!this._isFindboxPresent) {
                            textDiv[j].textContent = '';
                            textDiv[j].textContent = textContent[j] + '\r\n';
                        }
                    }
                }
            }
        },

        _doAjaxPostSearch: function (jsonResult, pageIndex) {
            var proxy = this;
            this._searchAjaxRequestState = $.ajax({
                type: 'POST',
                url: this.model.serviceUrl + '/Load',
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: jsonResult,
                traditional: true,
                success: function (data) {
                    if (typeof data === 'object')
                        var backupjson=(JSON.stringify(data));
                    else
                        var backupjson = data;
                    if (typeof data === 'object') {
                        if (proxy._pdfService == ej.PdfViewer.PdfService.Local)
                            jsondata = JSON.parse((JSON.stringify(data)));
                        else
                            jsondata = JSON.parse((JSON.stringify(data))["d"]);
                    }
                    else
                    {
                        if (proxy._pdfService == ej.PdfViewer.PdfService.Local)
                            jsondata = JSON.parse(data);
                        else
                            jsondata = JSON.parse(data["d"]);
                    }
                    proxy._pageContents[parseInt(jsondata["currentpage"])] = backupjson;
                    proxy._pageText[parseInt(jsondata["currentpage"])] = jsondata["pageContents"];
                    proxy._initSearch(pageIndex);
                },
                error: function () {
                    if (!proxy._isLoadMethod) {
                        proxy._searchAjaxRequestState = $.ajax({
                            type: 'POST',
                            url: proxy.model.serviceUrl + '/PostViewerAction',
                            crossDomain: true,
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            data: jsonResult,
                            traditional: true,
                            success: function (data) {
                                if (typeof data === 'object')
                                    var backupjson = (JSON.stringify(data));
                                else
                                    var backupjson = data;
                                if (typeof data === 'object') {
                                    if (proxy._pdfService == ej.PdfViewer.PdfService.Local)
                                        jsondata = JSON.parse((JSON.stringify(data)));
                                    else
                                        jsondata = JSON.parse((JSON.stringify(data))["d"]);
                                }
                                else {
                                    if (proxy._pdfService == ej.PdfViewer.PdfService.Local)
                                        jsondata = JSON.parse(data);
                                    else
                                        jsondata = JSON.parse(data["d"]);
                                }
                                proxy._pageContents[parseInt(jsondata["currentpage"])] = backupjson;
                                proxy._pageText[parseInt(jsondata["currentpage"])] = jsondata["pageContents"];
                                proxy._initSearch(pageIndex);
                            }
                        });
                    }
                }
            });
        },

        _keyboardShortcutFind: function (event) {
            if (event.ctrlKey && event.which == 70) {
                event.preventDefault();
                if (!this._isTextSearchHidden) {
                    this._displaySearchBox();
                }
            }
        },

        _setSearchToolbarTop: function () {
            var searchToolbar = document.getElementById(this._id + '_pdfviewer_searchbox');
            searchToolbar.style.top = '0px';
        },

        _displaySearchBox: function () {
            if (!this._isToolbarHidden) {
                if ($('#' + this._id + '_pdfviewer_searchbox').css('display') == 'none') {
                    this._clearSelector();
                    this._displaySearch = true;
                    $('#' + this._id + '_pdfviewer_searchbox').css({ 'position': 'absolute', 'display': 'block' });
                    this._resizeSearchToolbar();
                    $('#' + this._id + '_pdfviewer_searchinput').focus().select();
                    this._isFindboxPresent = true;
                } else {
                    this._displaySearch = false;
                    this._isFindboxPresent = false;
                    this._clearAllOccurrences();
                    $('#' + this._id + '_pdfviewer_searchinput').removeClass('e-pdfviewer-progressloader');
                    $('#' + this._id + '_pdfviewer_searchbox').css({ 'display': 'none' });
                }
            }
        },

        _showTextSearchButton: function (show) {
            if (show) {
                $('#' + this._id + '_find').parent().parents(".e-pdfviewer-toolbarul").css("display", "block");
                this._isTextSearchHidden = false;
            }
            else {
                $('#' + this._id + '_find').parent().parents(".e-pdfviewer-toolbarul").css("display", "none");
                if (this._isFindboxPresent) {
                    this._displaySearchBox();
                }
                this._isTextSearchHidden = true;
            }
        },

        //-------------------------------Text Select and Search [end] -----------------------------//
        //-------------------- Toolbar Actions[Start] -------------------------//
        _wireEvents: function () {
            var is_chrome = navigator.userAgent.indexOf('Chrome') != -1;
            var is_firefox = navigator.userAgent.indexOf('Firefox') != -1;
            var is_safari = navigator.userAgent.indexOf("Safari") != -1;
            var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
            var is_edge = navigator.userAgent.indexOf("Edge") != -1;
            var is_edgeNew = document.documentMode || /Edge/.test(navigator.userAgent);

            if (!this.model.toolbarSettings.templateId) {
                this._on($('#' + this._id + '_txtpageNo'), "keypress", this._allowOnlyNumbers);
                this._on($('#' + this._id + '_txtpageNo'), "keypress", this._onkeyPress);
                this._on($('#' + this._id + '_txtpageNo'), "click ", this._onToolbarItemClick);
                this._on($('#' + this._id + '_zoomSelection'), "change", this._zoomValChange);
                this._on($('#' + this._id + '_toolbar_zoomSelection_container'), "click ", this._onToolbarItemClick);
                this._on($('#' + this._id + '_toolbarContainer'), "mousedown", this._onToolBarContainerMouseDown);
                this._on($('.e-pdfviewer-ejdropdownlist'), "mousedown", this._onToolBarContainerMouseDown);
                if (this.enableTextSelection) {
                    if (document.documentMode || is_ie) {
                        this._on($('#' + this._id + '_viewerContainer'), "keydown", this._onTextKeyboardCopy);
                        this._on($('#' + this._id + '_viewerContainer'), "dblclick", this._selectingTextOnDblClick);
                        this._on($('#' + this._id + '_viewerContainer'), "click", this._selectingTextOnClick);
                    }
                    else if (!is_edgeNew) {
                        if (is_firefox) {
                            this._on($('#' + this._id + '_viewerContainer'), "keydown", this._onTextKeyboardCopy);
                        }
                        else if (is_chrome) {
                            this._on($('#' + this._id + '_viewerContainer'), "touchstart", this._onTextContainerTouch);
                            this._on($('#' + this._id + '_viewerContainer'), "touchmove", this._onTextContainerTouchMove);
                            this._on($('#' + this._id + '_viewerContainer'), "touchend", this._onTextContainerTouchEnd);
                        }
                        this._on($('#' + this._id + '_viewerContainer'), "mousemove", this._onTextContainerMouseMove);
                        this._on($('#' + this._id + '_viewerContainer'), "mousedown", this._onTextContainerMouseDown);
                        this._on($('#' + this._id + '_viewerContainer'), "mouseleave", this._onTextContainerMouseLeave);
                        this._on($('#' + this._id + '_viewerContainer'), "mouseenter", this._onTextContainerMouseEnter);
                        this._on($('#' + this._id + '_viewerContainer'), "mouseover", this._onTextContainerMouseIn);
                        this._on($('#' + this._id + '_viewerContainer'), "dragstart", this._onTextContainerDragStart);
                    }
                    if (is_chrome || is_firefox || is_ie || is_edge || is_edgeNew) {
                        this._on($('#' + this._id + '_viewerContainer'), "mouseup", this._onTextContainerMouseUp);
                        this._on($('#' + this._id + '_pageviewContainer'), "click touchstart", "a.copy", this._copySelectedText);
                        this._on($('#' + this._id + '_pageviewContainer'), "click touchstart", "a.googleSearch", this._openInNewTab);
                        this._on($('#' + this._id + '_pageviewContainer'), "contextmenu", this._onTextContainerMouseUp);
                        this._on($('#' + this._id + '_viewerContainer'), "click", this._onTextContainerclick);
                    }
                    else if (is_safari)
                        this._on($('#' + this._id + '_viewerContainer'), "mouseup", this._onTextContainerMouseUp);
                }
                else if (!this.enableTextSelection) {
                    $('#' + this._id + '_viewerContainer').attr('unselectable', 'on')
                         .css({
                             '-moz-user-select': '-moz-none',
                             '-moz-user-select': 'none',
                             '-o-user-select': 'none',
                             '-khtml-user-select': 'none',
                             '-webkit-user-select': 'none',
                             '-ms-user-select': 'none',
                             'user-select': 'none'
                         }).bind('selectstart', function () { return false; });
                }
            }
            $(window).on("keydown", function (e) {
                if (e.ctrlKey && (e.keyCode == 65 || e.keyCode == 97)) {
                    e.preventDefault();
                }
            });
            var viewer = document.getElementById(this._id + '_viewerContainer');
            $('#' + this._id + '_viewerContainer').css({ 'touch-action': 'pan-x pan-y' });
            $('#' + this._id + '_pdfviewerContainer').css({ 'touch-action': 'pan-x pan-y', 'position': 'relative' });
            if (navigator.userAgent.match("Firefox") || navigator.userAgent.match("Chrome")) {
                viewer.addEventListener('touchstart', this._touchStart);
                viewer.addEventListener('touchmove', this._touchMove);
                viewer.addEventListener('touchleave', this._touchEnd);
                viewer.addEventListener('touchend', this._touchEnd);
                viewer.addEventListener('touchcancel', this._touchEnd);
            }
            //Wire search events
            this._on($('#' + this._id + '_pdfviewer_searchinput'), 'input', this._textSearch);
            this._on($('#' + this._id + '_pdfviewer_searchinput'), 'keypress', this._searchKeypressHandler);
            this._on($('#' + this._id + '_pdfviewer_previous_search'), 'click', this._prevSearch);
            this._on($('#' + this._id + '_pdfviewer_next_search'), 'click', this._nextSearch);
            this._on($('#' + this._id + '_pdfviewer_close_search'), "click ", this._displaySearchBox);
            //Wire search events
            this._on($('#' + this._id + '_viewerContainer'), 'pointerdown', this._pointerdown);
            this._on($('#' + this._id + '_viewerContainer'), 'pointermove', this._pointermove);
            this._on($('#' + this._id + '_viewerContainer'), 'pointerup', this._pointerup);
            this._on($('#' + this._id + '_viewerContainer'), 'pointerleave', this._pointerup);
            this._on($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-pdfviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-pdfviewer-tbpage'), "mouseover", this._showIconToolTip);
            this._on($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-pdfviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-pdfviewer-tbpage'), "mouseout", this._hideIconToolTip);
        },

        _unwireEvents: function () {
            var is_chrome = navigator.userAgent.indexOf('Chrome') != -1;
            var is_firefox = navigator.userAgent.indexOf('Firefox') != -1;
            var is_safari = navigator.userAgent.indexOf("Safari") != -1;
            var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
            var is_edge = navigator.userAgent.indexOf("Edge") != -1;
            var is_edgeNew = document.documentMode || /Edge/.test(navigator.userAgent);
            if (!this.model.toolbarSettings.templateId) {
                this._on($('#' + this._id + '_txtpageNo'), "keypress", this._allowOnlyNumbers);
                this._off($('#' + this._id + '_txtpageNo'), "keypress", this._onkeyPress);
                this._off($('#' + this._id + '_txtpageNo'), "click ", this._onToolbarItemClick);
                this._off($('#' + this._id + '_zoomSelection'), "change", this._zoomValChange);
                this._off($('#' + this._id + '_toolbar_zoomSelection_container'), "click ", this._onToolbarItemClick);
            }

            var viewer = document.getElementById(this._id + '_viewerContainer');
            if (document.documentMode || is_edge || is_ie || is_edgeNew) {
                this._off($('#' + this._id + '_viewerContainer'), "keydown", this._onTextKeyboardCopy);
                this._off($('#' + this._id + '_viewerContainer'), "dblclick", this._selectingTextOnDblClick);
                this._off($('#' + this._id + '_viewerContainer'), "click", this._selectingTextOnClick);
            }
            else {
                if (is_firefox)
                    this._off($('#' + this._id + '_viewerContainer'), "keydown", this._onTextKeyboardCopy);
                this._off($('#' + this._id + '_viewerContainer'), "mousemove", this._onTextContainerMouseMove);
                this._off($('#' + this._id + '_viewerContainer'), "mousedown", this._onTextContainerMouseDown);
                this._off($('#' + this._id + '_viewerContainer'), "mouseleave", this._onTextContainerMouseLeave);
                this._off($('#' + this._id + '_viewerContainer'), "mouseover", this._onTextContainerMouseIn);
                this._off($('#' + this._id + '_viewerContainer'), "touchstart", this._onTextContainerTouch);
                this._off($('#' + this._id + '_viewerContainer'), "touchend", this._onTextContainerTouchEnd);
                this._off($('#' + this._id + '_viewerContainer'), "touchmove", this._onTextContainerTouchMove);
                this._off($('#' + this._id + '_viewerContainer'), "dragstart", this._onTextContainerDragStart);
                this._off($('#' + this._id + '_viewerContainer'), "click", this._onTextContainerclick);
            }
            if (is_chrome || is_firefox || is_ie || is_edgeNew || is_edge) {
                this._off($('#' + this._id + '_viewerContainer'), "mouseup", this._onTextContainerMouseUp);
                this._off($('#' + this._id + '_pageviewContainer'), "click", "a.copy", this._copySelectedText);
                this._off($('#' + this._id + '_pageviewContainer'), "click", "a.googleSearch", this._openInNewTab);
                this._off($('#' + this._id + '_pageviewContainer'), "contextmenu", this._onTextContainerMouseUp);
            }
            if (navigator.userAgent.match("Firefox") || navigator.userAgent.match("Chrome")) {
                viewer.removeEventListener('touchstart', this._touchStart);
                viewer.removeEventListener('touchmove', this._touchMove);
                viewer.removeEventListener('touchleave', this._touchEnd);
                viewer.removeEventListener('touchend', this._touchEnd);
                viewer.removeEventListener('touchcancel', this._touchEnd);
            }
            this._off($('#' + this._id + '_viewerContainer'), 'pointerdown', this._pointerdown);
            this._off($('#' + this._id + '_viewerContainer'), 'pointermove', this._pointermove);
            this._off($('#' + this._id + '_viewerContainer'), 'pointerup', this._pointerup);
            this._off($('#' + this._id + '_viewerContainer'), 'pointerleave', this._pointerup);
            //Unwire search events
            this._off($('#' + this._id + '_pdfviewer_searchinput'), 'input', this._textSearch);
            this._off($('#' + this._id + '_pdfviewer_searchinput'), 'keypress', this._searchKeypressHandler);
            this._off($('#' + this._id + '_pdfviewer_previous_search'), 'click', this._prevSearch);
            this._off($('#' + this._id + '_pdfviewer_next_search'), 'click', this._nextSearch);
            this._off($('#' + this._id + '_pdfviewer_close_search'), "click ", this._displaySearchBox);
            //Unwire search events
            this._off($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-pdfviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-pdfviewer-tbpage'), "mouseover", this._showIconToolTip);
            this._off($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-pdfviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-pdfviewer-tbpage'), "mouseout", this._hideIconToolTip);
            this._off($(window), "resize", this._viewerResize);
        },

        _onToolBarContainerMouseDown: function (e) {
            e.preventDefault();
            return false;
        },
        _onToolbarItemClick: function (event) {
            if (event.target.id == this._id + "_txtpageNo") {
                $('#' + this._id + '_txtpageNo').select();
            }
            $('#' + this._id + '_rptTooltip').css('display', 'none');
        },
        _selectingTextOnClick: function (e) {
            if (this._timers && this._clientx == e.clientX && this._clienty == e.clientY) {
                clearTimeout(this._timers);
                this._timers = null;
                this._selectingEntireLine(e);
            }
        },
        _selectingEntireLine: function (e) {
            var textNode, range, offset;
            var textIds = [];
            var target = e.target;
            var targetTop = target.getBoundingClientRect();
            var len = $('.e-pdfviewer-textLayer').length;
            if ($(e.target).hasClass('e-pdfviewer-textLayer')) {
                for (var i = 0; i < len; i++) {
                    var rect = $('.e-pdfviewer-textLayer')[i].getBoundingClientRect();
                    var top = parseInt(rect.top);
                    var targetPosition = parseInt(targetTop.top);
                    if (top == targetPosition || (top + 1) == targetPosition || (top - 1) == targetPosition) {
                        var textId = $('.e-pdfviewer-textLayer')[i].id;
                        if (textId != "") {
                            textIds.push(textId);
                        }
                    }
                }
                var selection = window.getSelection();
                selection.removeAllRanges();
                var range = document.createRange();
                var lengths = (textIds.length - 1);
                var d1 = document.getElementById(textIds[0]);
                var d2 = document.getElementById(textIds[lengths]);
                var childNodes = d2.childNodes.length;
                if (childNodes > 0) {
                    var nodes = d2.childNodes[childNodes - 1]
                    range.setStart(d1, 0);
                    range.setEnd(nodes, nodes.length);
                }
                else {
                    range.setStart(d1, 0);
                    range.setEnd(d2, 1);
                }
                selection.addRange(range);
            }
        },
        _selectingTextOnDblClick: function (e) {
            this._clientx = e.clientX;
            this._clienty = e.clientY;
            this._getElementTouch(e.target, e.clientX, e.clientY);
            this._timers = setTimeout(function () {
                this._timers = null;
            }, 200);
        },
        _onTextContainerMouseIn: function (e) {
            if (this.Clicked) {
                e.preventDefault();
                return false;
            }
        },
        _onTextContainerMouseUp: function (e) {
            this._curDown = false;
            var storedSelection = [];
            var target = e.target;
            var customMenu = document.getElementById(this._id +"custom-menu");
            var targetValue, focusNode, anchorNode, focusPage, anchorPage, targetPage;
            var is_ie = navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true;
            var searchText = window.getSelection().toString();
            if (e.type == "contextmenu") {
                var selection = window.getSelection();
                if (selection.anchorNode) {
                    var ranges = selection.getRangeAt(0);
                    var cloneRange = ranges.cloneContents();
                    var childNodes = cloneRange.childNodes;
                    var className = ranges.startContainer.parentNode.className;
                    var textHighlight = $(cloneRange).find('span');
                    if (textHighlight.length > 0) {
                        if (textHighlight[0].className == "e-pdfviewer-texthighlight e-pdfviewer-textLayer" || textHighlight[0].className == "e-pdfviewer-text-highlightother e-pdfviewer-textLayer") {
                            if (ranges.startContainer.id)
                                storedSelection.push(ranges.startContainer.id);
                        }
                    }
                    if (is_ie && $(cloneRange).children().length == 0) {
                        if (className == "e-pdfviewer-textLayer")
                            storedSelection.push(ranges.startContainer.parentElement.id);
                        else
                            storedSelection.push(ranges.startContainer.id);
                    }
                    if (cloneRange.childElementCount == 0) {
                        if (className == "e-pdfviewer-textLayer")
                            storedSelection.push(ranges.startContainer.parentElement.id);
                        else
                            storedSelection.push(ranges.startContainer.id);
                    }
                    else {
                        if (childNodes.length > 0) {
                            if (childNodes[0].className == "e-waitingpopup e-js") {
                                for (var k = 0; k < childNodes.length; k++) {
                                    var children = $(childNodes[k]).find('.text_container').children();
                                    for (var l = 0; l < children.length; l++)
                                        storedSelection.push(children[l].id);
                                }
                            }
                            else {
                                for (var i = 0; i < childNodes.length; i++) {
                                    var element = childNodes[i].id;
                                    storedSelection.push(element);
                                }
                            }
                        }
                    }
                    for (var j = 0; j < storedSelection.length; j++) {
                        if ($(target).hasClass('e-pdfviewer-text-highlightother') || $(target).hasClass('e-pdfviewer-texthighlight')) {
                            target = target.parentElement;
                        }
                        if (target.id == storedSelection[j]) {
                            this._contextMenu = true;
                            break;
                        }
                        else
                            this._contextMenu = false;
                    }
                }
                else
                    this._contextMenu = false;
            }
            if (searchText != "" && e.which == 3 && this._contextMenu && e.type == "contextmenu" && !this._isCopyRestrict) {
                e.preventDefault();
                if (searchText.length > 20) {
                    var trimmed = searchText.substring(0, 18);
                    str = trimmed + "...";
                    $(customMenu).find('li a.googleSearch').text("Search Google For " + "'" + str + "'");
                }
                else
                    $(customMenu).find('li a.googleSearch').text("Search Google For " + "'" + searchText + "'");
                var pos = this._setContextMenuPostion(e);
                $(customMenu).show();
                $(customMenu).offset({ top: pos.y, left: pos.x }).show();
                $(customMenu).show();
                $(customMenu).offset({ top: pos.y, left: pos.x }).show();
                this._contextMenu = false;
            }
            else if ($(customMenu).has(e.target).length == 0) {
                $(customMenu).hide();
                if (e.type == "contextmenu" && !this._contextMenu)
                    this._clearSelector();
                else if (this._contextMenu)
                    e.preventDefault();
            }
        },
        _setContextMenuPostion: function (event) {
            var contextMenu = $("#" +this._id +"custom-menu");
            var mousePosition = {};
            var menuPostion = {};
            var menuDimension = {};

            menuDimension.x = contextMenu.outerWidth();
            menuDimension.y = contextMenu.outerHeight();
            mousePosition.x = event.pageX;
            mousePosition.y = event.pageY;

            if (mousePosition.x + menuDimension.x > $(window).width() + $(window).scrollLeft()) {
                menuPostion.x = mousePosition.x - menuDimension.x;
            } else {
                menuPostion.x = mousePosition.x;
            }

            if (mousePosition.y + menuDimension.y > $(window).height() + $(window).scrollTop()) {
                menuPostion.y = mousePosition.y - menuDimension.y;
            } else {
                menuPostion.y = mousePosition.y;
            }
            return menuPostion;
        },
        _createWaterDropDiv: function (e) {
            var pageviewcontainer = $('#' + this._id + '_pageviewContainer');
            var dropdownX = document.createElement("DIV");
            dropdownX.id = this._id +"droplet1";
            dropdownX.className = "e-pdfviewer-droplet1";
            var dropdownY = document.createElement("DIV");
            dropdownY.id = this._id +"droplet2";
            dropdownY.className = "e-pdfviewer-droplet2";
            pageviewcontainer.append(dropdownX);
            pageviewcontainer.append(dropdownY);
            var vscrolvalue = $('#' + this._id + '_viewerContainer');
            var instance = this;
            $('#' +this._id +'droplet2').on("touchmove", function (e) {
                var scrollTop = $(vscrolvalue).scrollTop();
                $('#' + instance._id + 'touchcustom-menu').hide();
                var touchX, touchY, curX, curY;
                e.preventDefault();
                var backwardPos = $('#' + instance._id + 'droplet1').offset();
                if (e.type == "touchmove") {
                    touchX = e.originalEvent.changedTouches[0].clientX;
                    touchY = e.originalEvent.changedTouches[0].clientY;
                    $(e.target).css("z-index", 0);
                    curX = e.originalEvent.changedTouches[0].clientX;
                    curY = e.originalEvent.changedTouches[0].clientY;
                    $(e.target).css("z-index", 1000);
                }
                if (curY >= backwardPos.top) {
                    if (document.caretPositionFromPoint) {
                        range = document.caretPositionFromPoint(curX, curY);
                        textNode = range.offsetNode;
                    } else if (document.caretRangeFromPoint) {
                        range = document.caretRangeFromPoint(curX, curY);
                        if (range != null) {
                            textNode = range.startContainer;
                            if (!$(textNode).hasClass('e-pdfviewer-toolbarcontainer')) {
                                offset = range.startOffset;
                            }
                            else
                                $(vscrolvalue).scrollTop(scrollTop + 30);
                        }
                        else
                            $(vscrolvalue).scrollTop(scrollTop + 30);
                    }
                    parent = textNode.parentElement;
                    var point = instance._selectingTextByTouch(parent, curX, curY, true);
                }
                else {
                    if (document.caretPositionFromPoint) {
                        range = document.caretPositionFromPoint(curX, curY);
                        textNode = range.offsetNode;
                    } else if (document.caretRangeFromPoint) {
                        range = document.caretRangeFromPoint(curX, curY);
                        if (range != null) {
                            textNode = range.startContainer;
                            if (!$(textNode).hasClass('e-pdfviewer-toolbarcontainer')) {
                                offset = range.startOffset;
                            }
                            else
                                $(vscrolvalue).scrollTop(scrollTop - 30);
                        }
                        else
                            $(vscrolvalue).scrollTop(scrollTop - 30);
                    }
                    parent = textNode.parentElement;
                    var point = instance._selectingTextByTouch(parent, curX, curY, false);
                }
                if ($(parent).hasClass('e-pdfviewer-textLayer')) {
                    var width = $('#' + instance._id + 'droplet2').width();
                    $('#' + instance._id + 'droplet2').offset({ 'top': curY + window.scrollY, 'left': (curX - width) });
                }
            });
            $('#' + this._id + 'droplet1').on("touchmove", function (e) {
                var scrollTop = $(vscrolvalue).scrollTop();
                $('#' + instance._id + 'touchcustom-menu').hide();
                var touchX, touchY, curX, curY;
                e.preventDefault();
                var forwardPos = $('#' + instance._id + 'droplet2').offset();
                if (e.type == "touchmove") {
                    touchX = e.originalEvent.changedTouches[0].clientX;
                    touchY = e.originalEvent.changedTouches[0].clientY;
                    $(e.target).css("z-index", 0);
                    curX = e.originalEvent.changedTouches[0].clientX;
                    curY = e.originalEvent.changedTouches[0].clientY;
                    $(e.target).css("z-index", 1000);
                }
                if (curY <= forwardPos.top) {
                    if (document.caretPositionFromPoint) {
                        range = document.caretPositionFromPoint(curX, curY);
                        textNode = range.offsetNode;
                    } else if (document.caretRangeFromPoint) {
                        range = document.caretRangeFromPoint(curX, curY);
                        if (range != null) {
                            textNode = range.startContainer;
                            if (!$(textNode).hasClass('e-pdfviewer-toolbarcontainer')) {
                                offset = range.startOffset;
                            }
                            else
                                $(vscrolvalue).scrollTop(scrollTop - 30);
                        }
                        else
                            $(vscrolvalue).scrollTop(scrollTop - 30);
                    }
                    parent = textNode.parentElement;
                    var point = instance._selectingTextByTouch(parent, curX, curY, false);
                }
                else {
                    if (document.caretPositionFromPoint) {
                        range = document.caretPositionFromPoint(curX, curY);
                        textNode = range.offsetNode;
                    } else if (document.caretRangeFromPoint) {
                        range = document.caretRangeFromPoint(curX, curY);
                        if (range != null) {
                            textNode = range.startContainer;
                            if (!$(textNode).hasClass('e-pdfviewer-toolbarcontainer')) {
                                offset = range.startOffset;
                            }
                            else
                                $(vscrolvalue).scrollTop(scrollTop + 30);
                        }
                        else
                            $(vscrolvalue).scrollTop(scrollTop + 30);
                    }
                    parent = textNode.parentElement;
                    var point = instance._selectingTextByTouch(parent, curX, curY, true);
                }
                $(e.target).css("z-index", 1000);
                if ($(parent).hasClass('e-pdfviewer-textLayer')) {
                    var width = $('#' + instance._id + 'droplet1').width();
                    $('#' + instance._id + 'droplet1').offset({ 'top': curY + window.scrollY, 'left': (curX - width) });
                }
            });
        },
        _selectingTextByTouch: function (elem, x, y, type) {
            if (elem.nodeType == elem.TEXT_NODE) {
                var range = elem.ownerDocument.createRange();
                var selection = window.getSelection();
                range.selectNodeContents(elem);
                var currentPos = 0;
                var endPos = range.endOffset;
                while (currentPos < endPos) {
                    range.setStart(elem, currentPos);
                    range.setEnd(elem, currentPos + 1);
                    if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                       range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                        var singleWord = range.toString();
                        var rangesPosition = range.getBoundingClientRect();
                        if (selection.anchorNode != null && selection.anchorNode.parentNode.className == "e-pdfviewer-textLayer" && type) {
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                            selection.removeAllRanges();
                            selection.addRange(range);
                            selection.extend(elem, currentPos);
                        }
                        else if (selection.anchorNode != null && !type) {
                            range.setEnd(selection.focusNode, selection.focusOffset);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                        range.detach();
                        return (singleWord);
                    }
                    currentPos += 1;
                }
            } else {
                for (var i = 0; i < elem.childNodes.length; i++) {
                    var range = elem.childNodes[i].ownerDocument.createRange();
                    range.selectNodeContents(elem.childNodes[i]);
                    if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                       range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                        range.detach();
                        return (this._selectingTextByTouch(elem.childNodes[i], x, y, type));
                    } else {
                        range.detach();
                    }
                }
            }
            return (null);
        },
        _onTextContainerTouchMove: function (e) {
            if ($(e.target).hasClass('e-pdfviewer-textLayer') && this._lockTimer) {
                var curX = e.originalEvent.changedTouches[0].clientX;
                var curY = e.originalEvent.changedTouches[0].clientY;
                var touchmenu = document.getElementById(this._id +'touchcustom-menu');
                if (parseInt(curX) != parseInt(this._curPosX) && parseInt(curY) != parseInt(this._curPosY)) {
                    $('.text_container').css("visibility", "hidden");
                    $('.e-pdfviewer-formFields').css("visibility", "visible");
                    $(touchmenu).hide();
                    e.preventDefault();
                }
            }
        },
        _setTouchContextMenu: function (e) {
            var contextMenu = $('#' +this._id +'touchcustom-menu');
            var mousePosition = {};
            var menuPostion = {};
            var menuDimension = {};

            menuDimension.x = contextMenu.outerWidth();
            menuDimension.y = contextMenu.outerHeight();
            mousePosition.x = e.originalEvent.changedTouches[0].pageX;
            mousePosition.y = e.originalEvent.changedTouches[0].pageY;

            if (mousePosition.x + menuDimension.x > $(window).width() + $(window).scrollLeft()) {
                menuPostion.x = mousePosition.x;
            } else {
                menuPostion.x = mousePosition.x - (menuDimension.x / 2);
            }
            if (mousePosition.y) {
                menuPostion.y = mousePosition.y - menuDimension.y;
            }
            return menuPostion;
        },
        _onTextContainerTouch: function (e) {
            var eventTouch = e.originalEvent.touches.length;
            this._curPosX = e.originalEvent.changedTouches[0].clientX;
            this._curPosY = e.originalEvent.changedTouches[0].clientY;
            if (this._lockTimer)
                return;
            var proxy = this;

            this._timer = setTimeout(function () {
                proxy._onlongtouch(e);
            }, 1000);
            this._lockTimer = true;
            if ($(e.target).hasClass('e-pdfviewer-textLayer')) {
                e.preventDefault();
                $('.text_container').css("visibility", "");
                return false;
            }
        },
        _onlongtouch: function (e) {
            if (e.type == "touchstart" && e.target.id != this._id +"droplet2" || e.target.id != this._id +"droplet2") {
                this._longTouch = true;
                $('.text_container').css("visibility", "");
                this._curXPos = e.originalEvent.changedTouches[0].clientX;
                this._curYPos = e.originalEvent.changedTouches[0].clientY;
                var point = this._getElementTouch(e.target, this._curXPos, this._curYPos, true);
                e.preventDefault();
            }
        },
        _onTextContainerTouchEnd: function (e) {
            e.preventDefault();
            var touchSelection = [];
            var target = e.target;
            var ranges;
            var eventTouch = e.originalEvent.touches.length;
            if (this._timer) {
                clearTimeout(this._timer);
                this._lockTimer = false;
                var touchmenu = document.getElementById(this._id +'touchcustom-menu');
                var curX = e.originalEvent.changedTouches[0].clientX;
                var curY = e.originalEvent.changedTouches[0].clientY;
                var selection = window.getSelection();
                if (selection.anchorNode) {
                    ranges = selection.getRangeAt(0);
                    var cloneRange = ranges.cloneContents();
                    var childNodes = cloneRange.childNodes;
                    var className = ranges.startContainer.parentElement.className;
                    if (cloneRange.childElementCount == 0 && !this._longTouch) {
                        if (className == "e-pdfviewer-textLayer")
                            touchSelection.push(ranges.startContainer.parentElement.id);
                        else
                            touchSelection.push(ranges.startContainer.id);
                    }
                    else {
                        if (childNodes.length > 0) {
                            if (childNodes[0].className == "e-waitingpopup e-js") {
                                for (var k = 0; k < childNodes.length; k++) {
                                    var children = $(childNodes[k]).find('.text_container').children();
                                    for (var l = 0; l < children.length; l++)
                                        touchSelection.push(children[l].id);
                                }
                            }
                            else {
                                for (var i = 0; i < childNodes.length; i++) {
                                    var element = childNodes[i].id;
                                    touchSelection.push(element);
                                }
                            }
                        }
                    }
                    for (var j = 0; j < touchSelection.length; j++) {
                        if (target.id == touchSelection[j]) {
                            this._touchcontextMenu = true;
                            break;
                        }
                        else
                            this._touchcontextMenu = false;
                    }
                }
                else
                    this._touchcontextMenu = false;
                if (this._rangePosition && this._longTouch) {
                    $('.text_container').css("visibility", "");
                    var outerHeight = $(touchmenu).outerHeight();
                    var outerWidth = $(touchmenu).outerWidth();
                    var width = this._rangePosition.width / 2;
                    var searchText = window.getSelection().toString();
                    if (this._ranges || this._touchcontextMenu || e.target.id == this._id + "droplet1" || e.target.id == this._id + "droplet2") {
                        if (e.target.id == this._id + "droplet1" || e.target.id == this._id + "droplet2") {
                            $(touchmenu).show();
                            var context = this._setTouchContextMenu(e);
                            $(touchmenu).show();
                            $(touchmenu).offset({ 'top': context.y, 'left': context.x }).show();
                        }
                        else {
                            $(touchmenu).show();
                            $(touchmenu).offset({ 'top': this._rangePosition.top - outerHeight + window.scrollY, 'left': this._rangePosition.left + width - (outerWidth / 2) });
                        }
                        this._ranges = false;
                        $('.text_container').css("visibility", "");
                    }
                    else {
                        if ($(e.target).hasClass('copy') || $(e.target).hasClass('googleSearch')) {
                            $(touchmenu).hide();
                        }
                        else {
                            $(touchmenu).hide();
                            this._waterDropletDivHide();
                        }
                    }
                }
                else {
                    $(touchmenu).hide();
                }
                if ($(touchmenu).css('display') == 'none' && e.target.id != this._id + "droplet2"
                    && e.target.id != this._id + "droplet1" && e.target.className != "copy" && e.target.className != "googleSearch"
                                && $('#' + this._id +'custom-menu').css('display') == 'none' && !this._touched && !this._touchcontextMenu) {
                    this._clearSelector();
                    this._clearText = true;
                }
                else if (this._touchcontextMenu) {
                    var selection = window.getSelection();
                    var range = document.createRange();
                    var position = selection.anchorNode.compareDocumentPosition(selection.focusNode)
                    var backward = false;
                    if (!position && selection.anchorOffset > selection.focusOffset ||
                      position === Node.DOCUMENT_POSITION_PRECEDING)
                        backward = true;
                    if (backward) {
                        range.setStart(selection.focusNode, selection.focusOffset);
                        range.setEnd(selection.anchorNode, selection.anchorOffset);
                    }
                    else {
                        range.setStart(selection.anchorNode, selection.anchorOffset);
                        range.setEnd(selection.focusNode, selection.focusOffset);
                    }
                    var outerHeight = $(touchmenu).outerHeight();
                    var outerWidth = $(touchmenu).outerWidth();
                    var rangesPosition = range.getBoundingClientRect();
                    var boundingClient = range.getClientRects();
                    var length = boundingClient.length - 1;
                    var customMenuWidth = rangesPosition.width / 2;
                    var droplet1 = document.getElementById(this._id +'droplet1');
                    var droplet2 = document.getElementById(this._id + 'droplet2');
                    var width = $(droplet1).outerWidth();
                    var height = $(droplet1).outerHeight();
                    var searchText = window.getSelection().toString();
                    if (searchText != "") {
                        var context = this._setTouchContextMenu(e);
                        $(droplet1).show();
                        $(droplet1).offset({ "top": boundingClient[0].top + window.scrollY, "left": boundingClient[0].left - width }).show();
                        $(droplet2).show();
                        $(droplet2).offset({ "top": boundingClient[length].top + window.scrollY, "left": boundingClient[length].left + boundingClient[length].width - width }).show();
                        $(touchmenu).show();
                        $(touchmenu).offset({ 'top': context.y, 'left': context.x }).show();
                    }
                    e.preventDefault();
                }
                if (this._clearText) {
                    $(touchmenu).hide();
                    this._waterDropletDivHide();
                    this._clearText = false;
                }
            }

        },
        _onTextContainerMouseDown: function (e) {
            $('.text_container').css("visibility", "");
            var target = e.target;
            this._waterDropletDivHide();
            $('#' + this._id + 'touchcustom-menu').hide();
            this._curYPos = e.clientY;
            this._curXPos = e.clientX;
            if ((!$(e.target).hasClass('text_container')) && (!$(e.target).hasClass('e-pdfviewer-viewercontainer')) && e.which != 3) {
                this._curDown = true;
            }
            if ($('#' +this._id +'custom-menu').css('display') == 'none' && e.which != 3) {
                this._clearSelector();
            }
            $('#' + this._id + '_viewerContainer').focus();
            if (!$(target).hasClass('e-pdfviewer-formFields') && !$(target).hasClass('e-pdfviewer-ListBox') && !this._isFormFields && !$(target).hasClass('e-dropdownSelect'))
                e.preventDefault();
        },
        _onTextContainerclick: function (e) {
            this._waterDropletDivHide();
            var target = e.target;
            if (e.originalEvent.detail == 2 && $(target).hasClass('e-pdfviewer-textLayer')) {
                e.preventDefault();
                this._getElementTouch(target, e.clientX, e.clientY, false);
                e.preventDefault();
            }
            if (e.originalEvent.detail == 3 && $(target).hasClass('e-pdfviewer-textLayer')) {
                this._selectingEntireLine(e);
            }
        },
        _onTextContainerMouseMove: function (e) {
            e.preventDefault();
            $('.text_container').css("visibility", "");
            var curY, curX;
            var target = e.target;
            this.pageY = e.pageY;
            if (this._curDown == true && ($('#' + this._id +'custom-menu').css('display') == 'none')) {
                curY = e.clientY;
                curX = e.clientX;
                var point = this._getWordAtPoint(target, curX, curY);
                e.preventDefault();
            }
        },
        _onTextContainerMouseLeave: function (e) {
            if (this._curDown == true) {
                var instance = this;
                var value;
                e.preventDefault();
                var vscrolvalue = $('#' + this._id + '_viewerContainer');
                var documentHeight = $(vscrolvalue).offset().top;
                if (e.clientY > documentHeight) {
                    this._scrollMove = setInterval(function () {
                        $(vscrolvalue).animate({ scrollTop: $(vscrolvalue).scrollTop() + (200) }, 'fast');
                    }, 500);
                }
                else {
                    this._scrollMove = setInterval(function () {
                        $(vscrolvalue).animate({ scrollTop: $(vscrolvalue).scrollTop() - (200) }, 'fast');
                    }, 500);
                }
                $(window).on('mouseup', function (e) {
                    this._curDown = false;
                    instance._onMouseClickedOutside(e);
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });
            }
        },
        _onTextContainerMouseEnter: function (e) {
            if (this._scrollMove)
                clearInterval(this._scrollMove);
        },
        _onMouseClickedOutside: function (e) {
            this._curDown = false;
            if (this._scrollMove)
                clearInterval(this._scrollMove);
            e.preventDefault();
            e.stopPropagation();
        },
        _onTextContainerDragStart: function (e) {
            e.preventDefault();// cancel the native drag event chain
        },
        _clearSelector: function (e) {
            if (window.getSelection) {
                if (window.getSelection().removeAllRanges) {  // Firefox
                    window.getSelection().removeAllRanges();
                }
                else if (document.selection) {  // IE?
                    document.selection.empty();
                }
            }
        },
        _createContextMenu: function (e) {
            var containerDiv = document.createElement("div");//create a new div
            var pageviewcontainer = $('#' + this._id + '_pageviewContainer');
            containerDiv.id =this._id + "custom-menu";
            containerDiv.className = "e-pdfviewer-custom-menu";
            pageviewcontainer.append(containerDiv);
            var orderedList = document.createElement('ol');
            orderedList.className = 'orderedList'
            containerDiv.appendChild(orderedList);
            var searchText = window.getSelection().toString();
            $(orderedList).append("<li><a href='javascript:void(0);' class='copy'>Copy</a></li>");
            $(orderedList).append("<li><a href='javascript:void(0);' class='googleSearch'>Search Google For </a></li>");
        },
        _createTouchContextMenu: function (e) {
            var containerDiv = document.createElement("div");//create a new div
            var pageviewcontainer = $('#' + this._id + '_pageviewContainer');
            containerDiv.id = this._id +"touchcustom-menu";
            containerDiv.className = "e-pdfviewer-touchcustom-menu";
            pageviewcontainer.append(containerDiv);
            var searchText = window.getSelection().toString();
            $(containerDiv).append("<div class='e-pdfviewer-touchCopy'><a href='javascript:void(0);' class='copy'>Copy</a></div>");
            $(containerDiv).append("<div class='e-pdfviewer-touchDot'><a href='javascript:void(0);' class='googleSearch'>Search</a></div>");
        },
        _onTextKeyboardCopy: function (e) {
            if (e.ctrlKey && e.keyCode == 67) {
                e.preventDefault();
                if (!this._isCopyRestrict)
                    this._copySelectedText(e);
            }
        },
        _copySelectedText: function (e) {
            if (!this._isCopyRestrict) {
                var searchText = window.getSelection().getRangeAt(0).toString();
                var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
                if (window.clipboardData && window.clipboardData.setData) {
                    var data = clipboardData.setData("Text", searchText);
                    if ($('#' + this._id + 'custom-menu'))
                        $('#' + this._id + 'custom-menu').hide();
                    return data;

                } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
                    var selection = window.getSelection();
                    var range = document.createRange();
                    var position = selection.anchorNode.compareDocumentPosition(selection.focusNode)
                    var backward = false;
                    if (!position && selection.anchorOffset > selection.focusOffset ||
                      position === Node.DOCUMENT_POSITION_PRECEDING)
                        backward = true;
                    if (backward) {
                        range.setStart(selection.focusNode, selection.focusOffset);
                        range.setEnd(selection.anchorNode, selection.anchorOffset);
                    }
                    else {
                        range.setStart(selection.anchorNode, selection.anchorOffset);
                        range.setEnd(selection.focusNode, selection.focusOffset);
                    }
                    var textarea = document.createElement("textarea");
                    $(textarea).css("contenteditable", "true");
                    textarea.textContent = searchText;
                    textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
                    document.body.appendChild(textarea);
                    textarea.select();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                try {
                    return document.execCommand("copy");
                } catch (ex) {
                    console.warn("Copy to clipboard failed.", ex);
                } finally {
                    document.body.removeChild(textarea);
                    $('#' + this._id + 'custom-menu').hide();
                }

                e.preventDefault();
            }
        },
        _openInNewTab: function () {
            var searchText = window.getSelection().toString();
            var url = "http://www.google.com/search?q=" + searchText;
            var win = window.open(url, '_blank');
            win.focus();
            $('#' + this._id + 'custom-menu').hide();
        },
        _waterDropletDivHide: function (e) {
            $(document.getElementById(this._id + 'droplet1')).hide();
            $(document.getElementById(this._id + 'droplet2')).hide();
        },
        _getWordAtPoint: function (elem, x, y) {
            if (elem.nodeType == elem.TEXT_NODE) {
                var backward = false;
                var range = elem.ownerDocument.createRange();
                var selection = window.getSelection();
                if (selection.anchorNode != null) {
                    var position = selection.anchorNode.compareDocumentPosition(selection.focusNode)
                    if (!position && selection.anchorOffset > selection.focusOffset ||
                          position === Node.DOCUMENT_POSITION_PRECEDING)
                        backward = true;
                }
                range.selectNodeContents(elem);
                var currentPos = 0;
                var endPos = range.endOffset;
                while (currentPos < endPos) {
                    range.setStart(elem, currentPos);
                    range.setEnd(elem, currentPos + 1);
                    if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                       range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                        var singleWord = range.toString();
                        if (selection.anchorNode != null && selection.anchorNode.parentNode.className == "e-pdfviewer-textLayer")
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        if (backward)
                            selection.extend(elem, currentPos);
                        else
                            selection.extend(elem, currentPos + 1);
                        range.detach();
                        return (singleWord);
                    }
                    currentPos += 1;
                }
            } else {
                for (var i = 0; i < elem.childNodes.length; i++) {
                    var range = elem.childNodes[i].ownerDocument.createRange();
                    range.selectNodeContents(elem.childNodes[i]);
                    if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                       range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                        range.detach();
                        return (this._getWordAtPoint(elem.childNodes[i], x, y));
                    } else {
                        range.detach();
                    }
                }
            }
            return (null);
        },
        _getElementTouch: function (elem, x, y, type) {
            if (elem.nodeType == elem.TEXT_NODE) {
                var selection = window.getSelection();
                var range = elem.ownerDocument.createRange();
                range.selectNodeContents(elem);
                var currentPos = 0;
                var endPos = range.endOffset;
                while (currentPos < endPos) {
                    range.setStart(elem, currentPos);
                    range.setEnd(elem, currentPos + 1);
                    if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                       range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                        var singleWord = range.toString();
                        var textContent = elem.textContent;
                        var indices = [];
                        var startPos, endPos;
                        for (var i = 0; i < textContent.length; i++) {
                            if (textContent[i] == " ") indices.push(i);
                        }
                        for (var j = 0; j < indices.length; j++) {
                            if (currentPos == indices[j]) {
                                startPos = indices[j];
                                endPos = indices[j];
                            }
                            if (indices[0] > currentPos) {
                                startPos = 0;
                                endPos = indices[j];
                                break;
                            }
                            if (currentPos > indices[j] && currentPos < indices[j + 1]) {
                                startPos = indices[j];
                                endPos = indices[j + 1];
                            }
                            else if (currentPos > indices[j]) {
                                if (!indices[j + 1])
                                    startPos = indices[j];
                            }
                        }
                        this.startelem = startPos;
                        this.endelem = endPos;
                        if (startPos == 0)
                            range.setStart(elem, startPos);
                        else
                            range.setStart(elem, startPos + 1);
                        range.setEnd(elem, endPos);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        if (type) {
                            var rangesPosition = range.getBoundingClientRect();
                            this._rangePosition = rangesPosition;
                            this._ranges = true;
                            this._selectedRanges = range;
                            var droplet1 = document.getElementById(this._id + 'droplet1');
                            var droplet2 = document.getElementById(this._id + 'droplet2');
                            var width = $(droplet1).width();
                            var height = $(droplet1).height();
                            $(droplet1).show();
                            $(droplet1).offset({ "top": rangesPosition.top + window.scrollY + (height / 2), "left": rangesPosition.left - width }).show();
                            $(droplet2).show();
                            $(droplet2).offset({ "top": rangesPosition.top + window.scrollY + (height / 2), "left": rangesPosition.left + rangesPosition.width - width }).show();
                        }
                        range.detach();
                        return (singleWord);
                    }
                    currentPos += 1;
                }
            } else {
                for (var i = 0; i < elem.childNodes.length; i++) {
                    var range = elem.childNodes[i].ownerDocument.createRange();
                    range.selectNodeContents(elem.childNodes[i]);
                    if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                       range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                        range.detach();
                        return (this._getElementTouch(elem.childNodes[i], x, y, type));
                    } else {
                        range.detach();
                    }
                }
            }
            return (null);
        },

        _toolbarClick: function (event) {
            var targetItem = event.target
            var clickedItem = event.target;
            if (this._isToolbarClick) {
                $('#' + this._id + '_rptTooltip').css('display', 'none');
                this._selectionNodes = window.getSelection();
                this._maintainSelection();
                this._displaySearch = false;
                if ($(clickedItem).hasClass('e-pdfviewer-toolbarli')) {
                    clickedItem = $(clickedItem).find('span');
                }
                if ($(clickedItem).hasClass("e-pdfviewer-print")) {
                    if (!this._isPrintRestrict)
                        this._print();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-download")) {
                    this._saveFormFieldsValue();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-gotofirst") && !($(clickedItem).hasClass("e-pdfviewer-disabled"))) {
                    this._gotoFirstPage();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-gotolast") && !($(clickedItem).hasClass("e-pdfviewer-disabled"))) {
                    this._gotoLastPage();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-gotonext") && !($(clickedItem).hasClass("e-pdfviewer-disabled"))) {
                    this._gotoNextPage();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-gotoprevious") && !($(clickedItem).hasClass("e-pdfviewer-disabled"))) {
                    this._gotoPreviousPage();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-zoomin")) {
                    this._applyLowerZoomIndex();
                    this._zoomIn();
                }
                else if ($(clickedItem).hasClass("e-pdfviewer-zoomout")) {
                    this._applyHigherZoomIndex();
                    this._zoomOut();
                }
                    /*  * The event handler for the click event of the fiWidth and fitPage operations are given below. 
                        * The handler is chosen based on the id name of the target element. 
                    */
                else if ($(clickedItem).hasClass("e-pdfviewer-fitpage") || $(clickedItem).hasClass("e-pdfviewer-fitwidth")) {
                    var clickedSpan = clickedItem;
                    var spanId = $(clickedSpan).attr('id');
                    switch (spanId) {
                        case this._id+"_fitWidth":
                            this._applyFitToWidth();
                            break;
                        case this._id+"_fitPage":
                            this._applyFitToPage();
                            break;
                    }
                }
				else if ($(clickedItem).hasClass('e-pdfviewer-find')) {
                    this._displaySearchBox();
                }
            }
        },

        _save: function (data) {
            var filename;
            if (this.fileName.indexOf('\\') == -1) {
                filename = "sample.pdf";
            } else
                filename = this.fileName.replace(/^.*[\\\/]/, '')
            var browserUserAgent = navigator.userAgent;
            var url = '';
            var blob = this._base64toBlob(data["DocumentStream"], 'application/pdf', 512);
            if (browserUserAgent.indexOf('Edge') == -1) {
                if ((browserUserAgent.indexOf("Firefox")) != -1 || (browserUserAgent.indexOf("Chrome")) != -1 || (browserUserAgent.indexOf("Safari")) != -1 || (browserUserAgent.indexOf("AppleWebKit")) != -1) {
                    this._download(blob, url, filename);
                }
                else
                    window.navigator.msSaveOrOpenBlob(blob, filename);
            }
            else
                window.navigator.msSaveOrOpenBlob(blob, filename);
        },
        _base64toBlob: function (b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
            var byteCharacters = atob(b64Data);
            var byteArrays = [];
            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);
                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        },
        _createBlob: function (data, contentType) {
            if (typeof Blob !== 'undefined') {
                return new Blob([data], { type: contentType });
            }
            warn('The "Blob" constructor is not supported.');
        },

        _download: function (blob, url, filename) {
            var blobUrl = URL.createObjectURL(blob);
            var a = document.createElement('a');
            if (a.click) {
                a.href = blobUrl;
                a.target = '_parent';
                if ('download' in a) {
                    a.download = filename;
                }
                (document.body || document.documentElement).appendChild(a);
                a.click();
                a.parentNode.removeChild(a);
            } else {
                if (window.top === window &&
                    blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
                    var padCharacter = blobUrl.indexOf('?') === -1 ? '?' : '&';
                    blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
                }
                window.open(blobUrl, '_parent');
            }
        },

        _showToolbar: function (showToolbar) {
            if (showToolbar) {
                $('#' + this._id + '_toolbarContainer').css("display", "block");
                this._setSearchToolbarTop();
                this._isToolbarHidden = false;
            }
            else {
                $('#' + this._id + '_toolbarContainer').css("display", "none");
                if (this._isFindboxPresent) {
                    this._displaySearchBox();
                }
                this._isToolbarHidden = true;
            }
        },

        _initToolbar: function () {
            this._isToolbarClick = false;

            if (!this.model.toolbarSettings.templateId) {
                if (!this._isDevice) {
                    var zoomddl = $('#' + this._id + '_toolbar_zoomSelection').data('ejDropDownList');
                    zoomddl._selectItemByIndex(0);
                    zoomddl.disable();

                    $('#' + this._id + '_txtpageNo').attr('disabled', 'disabled');

                    this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotofirst');
                    this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotoprevious');
                    this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotonext');
                    this._toolbar.disableItemByID(this._id + '_pdfviewer_toolbar_gotolast');
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
            if (jqueryEement.css('display') == 'block') {
                return false;
            } else {
                return true;
            }
        },

        _showTooltipContent: function (event) {
            var currentToolbarItem = event.target;
            if (this.model.toolbarSettings.showTooltip && !this._isDevice) {
                var TagPos;
                var toolTipText;
                var isShowTooltip = true;
                if ($(currentToolbarItem).hasClass('e-pdfviewer-toolbarli')) {
                    currentToolbarItem = $(currentToolbarItem).find('span');
                }
                var disabledItem = $(currentToolbarItem).prev();
                if ($(currentToolbarItem).hasClass("e-pdfviewer-print")) {
                    var printId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-print')[0];
                    if (printId)
                        TagPos = printId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-print')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('print');
                }
                if ($(currentToolbarItem).hasClass("e-pdfviewer-download")) {
                    var printId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-download')[0];
                    if (printId)
                        TagPos = printId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-download')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('download');
                }
                else if (($(currentToolbarItem).hasClass("e-pdfviewer-gotofirst")) || ($(disabledItem).hasClass('e-pdfviewer-gotofirst'))) {
                    var gotoFirstId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-gotofirst')[0];
                    if (gotoFirstId)
                        TagPos = gotoFirstId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-gotofirst')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('first');
                }
                else if (($(currentToolbarItem).hasClass("e-pdfviewer-gotolast")) || ($(disabledItem).hasClass('e-pdfviewer-gotolast'))) {
                    var gotoLastId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-gotolast')[0];
                    if (gotoLastId)
                        TagPos = gotoLastId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-gotolast')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('last');
                }
                else if (($(currentToolbarItem).hasClass("e-pdfviewer-gotonext")) || ($(disabledItem).hasClass('e-pdfviewer-gotonext'))) {
                    var gotoNextId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-gotonext')[0];
                    if (gotoNextId)
                        TagPos = gotoNextId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-gotonext')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('next');
                }
                else if (($(currentToolbarItem).hasClass("e-pdfviewer-gotoprevious")) || ($(disabledItem).hasClass('e-pdfviewer-gotoprevious'))) {
                    var gotoPreviousId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-gotoprevious')[0];
                    if (gotoPreviousId)
                        TagPos = gotoPreviousId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-gotoprevious')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('previous');
                }
                else if (($(currentToolbarItem).hasClass("e-pdfviewer-zoomin")) || ($(disabledItem).hasClass('e-pdfviewer-zoomin'))) {
                    var zoomInId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-zoomin')[0];
                    if (zoomInId)
                        TagPos = zoomInId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-zoomin')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('zoomin');
                }
                else if (($(currentToolbarItem).hasClass("e-pdfviewer-zoomout")) || ($(disabledItem).hasClass('e-pdfviewer-zoomout'))) {
                    var zoomOutId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-zoomout')[0];
                    if (zoomOutId)
                        TagPos = zoomOutId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-zoomout')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('zoomout');
                }
                else if ($(currentToolbarItem).hasClass("e-pdfviewer-tbpage") || $(currentToolbarItem).hasClass("e-pdfviewer-pagenumber") || $(currentToolbarItem).hasClass("e-pdfviewer-labelpageno")) {
                    var pageNumberId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-tbpage')[0];
                    if (pageNumberId)
                        TagPos = pageNumberId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-tbpage')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('pageIndex');
                }
                else if ($(currentToolbarItem).hasClass("e-pdfviewer-ejdropdownlist") || $(currentToolbarItem).hasClass("e-dropdownlist") || $(currentToolbarItem).hasClass("e-select") || $(currentToolbarItem).hasClass("e-down-arrow")) {
                    var zoomDropdownId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-ejdropdownlist')[0];
                    if (zoomDropdownId)
                        TagPos = zoomDropdownId.getBoundingClientRect();
                    else
                        TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-ejdropdownlist')[0].getBoundingClientRect();
                    toolTipText = this._getTootipText('zoom');
                    isShowTooltip = this._viewpopupBlockNone($('#' + this._id + '_toolbar_zoomSelection_popup_list_wrapper'));
                }
                    //The below code is used to render the tooltip for fitWidth and fitPage buttons based on the id name of the target element
                else if ($(currentToolbarItem).hasClass("e-pdfviewer-fitwidth") || $(currentToolbarItem).hasClass("e-pdfviewer-fitpage") || ($(disabledItem).hasClass('e-pdfviewer-fitwidth')) || ($(disabledItem).hasClass('e-pdfviewer-fitpage'))) {
                    var hoverSpan = currentToolbarItem;
                    var spanId = $(hoverSpan).attr('id');
                    switch (spanId) {
                        case this._id + "_fitWidth":
                            var fitWidthId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-fitwidth')[0];
                            if (fitWidthId)
                                TagPos = fitWidthId.getBoundingClientRect();
                            else
                                TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-fitwidth')[0].getBoundingClientRect();
                            toolTipText = this._getTootipText('fittoWidth');
                            break;
                        case this._id + "_fitPage":
                            var fitPageId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-fitpage')[0];
                            if (fitPageId)
                                TagPos = fitPageId.getBoundingClientRect();
                            else
                                TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-fitpage')[0].getBoundingClientRect();
                            toolTipText = this._getTootipText('fittopage');
                            break;
                        default:
                            var prevElement = $(hoverSpan).prev();
                            if ($(prevElement).hasClass('e-pdfviewer-fitwidth')) {
                                fitWidthId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-fitwidth')[0];
                                if (fitWidthId)
                                    TagPos = fitWidthId.getBoundingClientRect();
                                else
                                    TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-fitwidth')[0].getBoundingClientRect();
                                toolTipText = this._getTootipText('fittoWidth');
                            } else if ($(prevElement).hasClass('e-pdfviewer-fitpage')) {
                                fitPageId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-fitpage')[0];
                                if (fitPageId)
                                    TagPos = fitPageId.getBoundingClientRect();
                                else
                                    TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-fitpage')[0].getBoundingClientRect();
                                toolTipText = this._getTootipText('fittopage');
                            }
                    }
                } else if ($(currentToolbarItem).hasClass("e-pdfviewer-find")) {
                    if (!this._isFindboxPresent) {
                        var searchSpanId = $('#' + this._id + '_toolbarContainer .e-pdfviewer-find')[0];
                        if (searchSpanId)
                            TagPos = searchSpanId.getBoundingClientRect();
                        else
                            TagPos = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-find')[0].getBoundingClientRect();
                        toolTipText = this._getTootipText('search');
                    }
                }

                if (toolTipText && isShowTooltip) {
                    var maxZindex = this._viewerMaxZindex();
                    $('#' + this._id + '_rptTooltip_Header').html(toolTipText.header);
                    $('#' + this._id + '_rptTooltip_Content').html(toolTipText.content);
                    var toolbarPosition = document.getElementById(this._id + "_toolbarContainer").getBoundingClientRect();
                    var windowWidth = this.element[0].clientWidth;
                    if (windowWidth < TagPos.left + 2 * TagPos.width) {
                        if (toolTipText.header == "Zoom") {
                            $('#' + this._id + '_rptTooltip').css({ 'zIndex': maxZindex + 1, 'top': ((TagPos.top - toolbarPosition.top)) - 21, 'left': ((TagPos.left - toolbarPosition.left) - (2 * TagPos.width)), 'display': 'block', 'position': 'absolute' });
                        }
                        else
                            $('#' + this._id + '_rptTooltip').css({ 'zIndex': maxZindex + 1, 'top': ((TagPos.top - toolbarPosition.top)) - 21, 'left': ((TagPos.left - toolbarPosition.left) - (3 * TagPos.width)), 'display': 'block', 'position': 'absolute' });
                    }
                    else
                        $('#' + this._id + '_rptTooltip').css({ 'zIndex': maxZindex + 1, 'top': ((TagPos.top - toolbarPosition.top)) - 21, 'left': ((TagPos.left - toolbarPosition.left) + (TagPos.width / 2)), 'display': 'block', 'position': 'absolute' });
                }
            }
        },

        _viewerMaxZindex: function () {
            var parents = this.element.parents(), bodyEle, contEle;
            bodyEle = $('body').children(), index = bodyEle.index(this.popup);
            bodyEle.splice(index, 1);
            $(bodyEle).each(function (i, ele) { parents.push(ele); });
            contEle = $(this.model.target).children(), cindex = contEle.index(this.popup);
            contEle.splice(cindex, 1);
            $(contEle).each(function (i, ele) { parents.push(ele); });
            var maxZ = Math.max.apply(maxZ, $.map(parents, function (e, n) {
                if ($(e).css('position') != 'static') return parseInt($(e).css('z-index')) || 1;
            }));
            if (!maxZ || maxZ < 10000) maxZ = 10000;
            else maxZ += 1;
            return maxZ;
        },

        _getTootipText: function (tipType) {
            var localeObj = ej.PdfViewer.Locale[this.model.locale] ? ej.PdfViewer.Locale[this.model.locale] : ej.PdfViewer.Locale["default"];
            var headerTxt = '';
            var contentTxt = '';
            switch (tipType) {
                case 'print':
                    headerTxt = localeObj['toolbar']['print']['headerText'];
                    contentTxt = localeObj['toolbar']['print']['contentText'];
                    break;
                case 'download':
                    headerTxt = localeObj['toolbar']['download']['headerText'];
                    contentTxt = localeObj['toolbar']['download']['contentText'];
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
                case 'pageIndex':
                    headerTxt = localeObj['toolbar']['pageIndex']['headerText'];
                    contentTxt = localeObj['toolbar']['pageIndex']['contentText'];
                    break;
                case 'zoom':
                    headerTxt = localeObj['toolbar']['zoom']['headerText'];
                    contentTxt = localeObj['toolbar']['zoom']['contentText'];
                    break;
                case 'fittoWidth':
                    headerTxt = localeObj['toolbar']['fitToWidth']['headerText'];
                    contentTxt = localeObj['toolbar']['fitToWidth']['contentText'];
                    break;
                case 'fittopage':
                    headerTxt = localeObj['toolbar']['fitToPage']['headerText'];
                    contentTxt = localeObj['toolbar']['fitToPage']['contentText'];
                    break;
                case 'search':
                    headerTxt = localeObj['toolbar']['search']['headerText'];
                    contentTxt = localeObj['toolbar']['search']['contentText'];
                    break;
            }
            return { header: headerTxt, content: contentTxt };
        },
        //-------------------- Tooltip Localization Actions[End]------------------------//

        //-------------------- DrillThrough Actions[Start]----------------------//

        _setInitialization: function () {
            this._canvascount = 0;
            this._fileName = '';
            this._isToolbarClick = false;
            this._pageModel = null;
            this._currentPage = 1;
            this._zoomLevel = 2;
            this._pageImageStream = null;
            this._pageWidth;
            this._pageHeight;
            this._pageLocation = new Array();
            this._scrollTriggered = false;
            this._previousPage = 1;
            this._totalPages;
            this._previousPosition;
            this._cummulativeHeight;
            this._backgroundPage = 1;
            this._renderedCanvasList = new Array();
            this._pageContents = new Array();
            this._pageText = new Array();
            this._searchMatches = new Array();
            this._pagePrinted = false;
            this._printingPage = 1;
            this._printingTimer;
            this._previousZoom = 1;
            this._renderPreviousPage = false;
            this._pageSize;
            this._eventpreviouszoomvalue;
            this._eventzoomvalue;
            this._pdfFileName;
            this._zoomArray = new Array();
            this._rerenderCanvasList = new Array();
            this._ajaxRequestState = null;
        },

        //-------------------- DrillThrough Actions[End]----------------------//

        //-------------------- Common pdfviewer events & utils[start]----------------------//
        _showViewerBlock: function (showblock) {
            if (showblock) {
                $('#' + this._id + '_viewBlockContainer').css("display", "block");
                var parameterBlock = $('#' + this._id + '_viewBlockContainer .e-pdfviewer-viewerblockcellcontent').find('table');
                this._selectparamToolItem(parameterBlock.is('[isviewclick]'));
            } else {
                $('#' + this._id + '_viewBlockContainer').css("display", "none");
            }
            if (this._isDevice) {
                $('#' + this._id + '_viewBlockContainer.e-pdfviewer-blockstyle').css('z-index', showblock ? '10' : '0');
            }
        },

        _showNavigationIndicator: function (isShow) {
            $('#' + this._id + '_viewerContainer').ejWaitingPopup({ showOnInit: isShow, appendTo: '#' + this._id + '_viewerContainer' });
            $('#' + this._id + '_viewerContainer_WaitingPopup').addClass('e-pdfviewer-waitingpopup');
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
            $('#' + this._id + '_loadingIndicator').ejWaitingPopup({ showOnInit: isShow, appendTo: '#' + this._id + '_loadingIndicator' });
            $('#' + this._id + '_loadingIndicator_WaitingPopup').addClass('e-pdfviewer-waitingpopup');
        },

        _showPrintLoadingIndicator: function (isShow) {
            $('#' + this._id +'e-pdf-viewer').css({ 'position': 'relative' });
            $('#' + this._id + 'e-pdf-viewer').ejWaitingPopup({ showOnInit: isShow, text: "Preparing document for printing...", cssClass: 'e-pdfviewer-waitingpopup-print', appendTo: '#' + this._id + 'e-pdf-viewer' });
        },

        _viewerResize: function (event) {
            var proxy = this;
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
            proxy._toolbar._activeItem = undefined;
            proxy._toolbar._reSizeHandler();
            $('#' + proxy._id + '_pdfviewer_searchul').removeClass('e-separator');
            $('#' + proxy._id + '_pdfviewer_downloadul').removeClass('e-separator');
            var toolbar = $('#' + this._id + '_toolbarContainer');
            if ($('#' + this._id + '_pdfviewer_printul').parent()[0] != toolbar[0]) {
                if (!this._isDownloadCntlHidden) {
                    toolbar.append($('#' + this._id + '_pdfviewer_printul')[0]);
                    this._toolbar._liTemplte.append($('#' + this._id + '_pdfviewer_downloadul')[0]);
                    this._isDownloadCntlHidden = true;
                }
            }
            if ($('#' + this._id + '_pdfviewer_downloadul').parent()[0] != toolbar[0]) {
                if(this._isDownloadCntlHidden){
                    this._toolbar._liTemplte.append($('#' + this._id + '_pdfviewer_printul')[0]);
                    this._isDownloadCntlHidden = false;
                }
            }
            proxy._toolbarResizeHandler();
            proxy._resizeSearchToolbar();
            if (proxy.model.isResponsive && proxy._renderedCanvasList && proxy._isAutoZoom) {
                proxy._applyFitToWidthAuto();
            }
            if (proxy._fitType == "fitToWidth" && !proxy.model.isResponsive) {
                proxy._applyFitToWidth();
            }
            proxy._isWindowResizing = true;
            //Function for assigning left style property for page Canvas.
            proxy._applyLeftPosition();
        },

        /*  * _applyLeftPosition() assigns the left style property of the page canvas.
            * The left style property is calculated and added to each page canvas.
            * So the page canvas is centered.
        */
        _applyLeftPosition: function () {
            for (var i = 1; i <= this._totalPages; i++) {
                var leftPosition;
                if ((this._fitType=="fitToWidth")||(this._isAutoZoom&&this._zoomVal<1))
                    leftPosition = 5;
                else
                    leftPosition = (this.element.width() - this._pageSize[i - 1].PageWidth * this._zoomVal) / 2;
                if (leftPosition < 0)
                    leftPosition = 5;
                var pageDiv = document.getElementById(this._id + 'pageDiv_' + i);
                if (pageDiv) {
                    pageDiv.style.left = leftPosition + "px";
                }
            }
        },

        _toolbarResizeHandler: function () {
            var toolbar = $('#' + this._id + '_toolbarContainer');
            if ($('#' + this._id + '_pdfviewer_searchul').parent()[0] != toolbar[0]) {
                this._isZoomCntlHidden = true;
                toolbar.append($('#' + this._id + '_pdfviewer_searchul')[0]);
                this._toolbar._liTemplte.append($('#' + this._id + '_pdfviewer_zoomul')[0]);
            }
            if (($('#' + this._id + '_pdfviewer_zoomul').parent()[0] == toolbar[0]) && this._isZoomCntlHidden) {
                toolbar.append($('#' + this._id + '_pdfviewer_zoomul')[0]);
                toolbar.append($('#' + this._id + '_pdfviewer_searchul')[0]);
                this._isZoomCntlHidden = false;
            }
        },

        _resizeSearchToolbar: function () {
            var searchToolbar = document.getElementById(this._id + '_pdfviewer_searchbox');
            if (searchToolbar) {
                var searchicon = $('#' + this._id + '_toolbarContainer .e-pdfviewer-find')[0];
                if (!searchicon) {
                    searchicon = $('#' + this._id + '_toolbarContainer_hiddenlist .e-pdfviewer-find')[0];
                }
                var position = searchicon.getBoundingClientRect();
                var style = document.getElementById('e-pdfviewer-arrow-responsive');
                if (style) {
                    document.head.removeChild(style);
                }
                if (!$('#' + this._id + '_toolbarContainer_target').hasClass('e-display-block')) {
                    searchToolbar.style.left = (searchicon.parentNode.parentNode.offsetLeft - searchicon.parentNode.parentNode.parentNode.offsetLeft - 2) + 'px';
                    var searchInput = $('#' + this._id + '_pdfviewer_searchinput')[0];
                    searchInput.style.width = '150px';
                    searchToolbar.style.width = '400px';
                } else {
                    var viewerToolbar = document.getElementById(this._id + '_toolbarContainer');
                    searchToolbar.style.left = '0px';
                    var searchInput = $('#' + this._id + '_pdfviewer_searchinput')[0];
                    searchInput.style.width = '150px';
                    searchToolbar.style.width = '400px';
                }
                var viewer = document.getElementById(this._id + 'e-pdf-viewer');
                if ((viewer.clientWidth) < (searchToolbar.offsetLeft + searchToolbar.clientWidth)) {
                    var searchInput = $('#' + this._id + '_pdfviewer_searchinput')[0];
                    if (this._isZoomCntlHidden) {
                        searchInput.style.width = parseInt(searchInput.style.width) - ((searchToolbar.offsetLeft + searchToolbar.clientWidth) - (viewer.clientWidth)) + 'px';
                        searchToolbar.style.width = parseInt(searchToolbar.style.width) - ((searchToolbar.offsetLeft + searchToolbar.clientWidth) - (viewer.clientWidth)) + 'px';
                    } else {
                        searchToolbar.style.left = parseInt(searchToolbar.style.left) - ((searchToolbar.offsetLeft + searchToolbar.clientWidth) - (viewer.clientWidth)) + 'px';
                    }
                }
                this._responsiveArrow(position, searchToolbar);
            }
        },

        _responsiveArrow: function (position, searchToolbar) {
            var styleSheet = document.createElement("Style");
            styleSheet.id = 'e-pdfviewer-arrow-responsive';
            document.head.appendChild(styleSheet);
            style = styleSheet.sheet;
            if (!navigator.userAgent.match("Firefox") && style) {
                var searchToolbarPosition = searchToolbar.getBoundingClientRect();
                var left = position.left - searchToolbarPosition.left;
                style.addRule('.e-pdfviewer-arrow::before', 'left:' + left + 'px');
                style.addRule('.e-pdfviewer-arrow::after', 'left:' + left + 'px');
            } else {
                $('#' + this._id + '_pdfviewer_searchbox').removeClass('e-pdfviewer-arrow');
            }
        },

        //-------------------- Common pdfviewer events & utils[End]----------------------//

        /*---------------------client side methods[start]----------------------------------------------------------*/

        goToPage: function (pageNo) {
            this._gotoPageNo(pageNo);
        },

        goToLastPage: function () {
            this._gotoLastPage();
        },

        goToFirstPage: function () {
            this._gotoFirstPage();
        },

        goToNextPage: function () {
            this._gotoNextPage();
        },

        goToPreviousPage: function () {
            this._gotoPreviousPage();
        },

        print: function () {
            this._print();
        },

        abortPrint: function () {
            this._printCancel();
        },

        showPrintTools: function (show) {
            this._showPrintButton(show);
        },

        showDownloadTool: function (show) {
            this._showDownloadButton(show);
        },

        showTextSearchTool: function (show) {
            this._showTextSearchButton(show);
        },

        showPageNavigationTools: function (show) {
            this._showPageNavigationControls(show);
        },

        showMagnificationTools: function (show) {
            this._showZoomControl(show);
            this._showFittoPage(show);
        },

        showToolbar: function (showToolbar) {
            this._showToolbar(showToolbar);
        },

        load: function (file) {
            $('#' + this._id + '_viewerContainer').scrollTop(0);
            this._showloadingIndicator(true);
            this._fitType = null;
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitPage');
            this._toolbar.enableItemByID(this._id + '_pdfviewer_toolbar_fitWidth');
            this._zoomVal = 1;
            this._zoomLevel = 3;
            $('#' + this._id + '_toolbar_zoomSelection_hidden').val("Auto");
            this._ejDropDownInstance.model.value = "Auto";
            this._initToolbar();
            if (file) {
                var count = this._canvascount;
                while (count >= 1) {
                    $('#' + this._id + 'pageDiv_' + count).remove();
                    count--;
                }
            }

            window.clearInterval(this._scrollTimer);
            var jsonResult = new Object();
            jsonResult["viewerAction"] = "GetPageModel";
            jsonResult["controlId"] = this._id;
            jsonResult["pageindex"] = "1";
            jsonResult["isInitialLoading"] = "true";

            var fileUrl = file.split("base64,")[1];
            if (fileUrl == undefined) {
                this._fileName = file;
                jsonResult["newFileName"] = this._fileName;
                this._fileId = this._createGUID();
                jsonResult["id"] = this._fileId;
                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                    this._doAjaxPost("POST", this._actionUrl, JSON.stringify(jsonResult), "_getPageModel");
                else
                    this._doAjaxPost("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }), "_getPageModel");
            } else {
                var actionUrl = this.model.serviceUrl;
                jsonResult["uploadedFile"] = fileUrl;
                this._fileId = this._createGUID();
                jsonResult["id"] = this._fileId;
                if (this._pdfService == ej.PdfViewer.PdfService.Local) {
                    actionUrl = this.model.serviceUrl + "/FileUpload";
                    this._doAjaxPost("POST", actionUrl, JSON.stringify(jsonResult), "_getPageModel");
                }
                else {
                    actionUrl = actionUrl.replace("Load", "FileUpload");
                    this._doAjaxPost("POST", actionUrl, JSON.stringify({ 'jsonResult': jsonResult }), "_getPageModel");
                }
            }
        },


        fitToPage: function () {
            this._applyFitToPage();
        },

        fitToWidth: function () {
            this._applyFitToWidth();
        },

        download: function () {
            this._saveFormFieldsValue();
        },

        zoomIn: function () {
            this._applyLowerZoomIndex();
            this._zoomIn();
        },

        zoomOut: function () {
            this._applyHigherZoomIndex();
            this._zoomOut();
        },

        zoomTo: function (zoomvalue) {
            if (zoomvalue < 50)
                zoomvalue = 50;
            else if (zoomvalue > 400)
                zoomvalue = 400;
            var zoomfactor = parseInt(zoomvalue) / 100;
            if (zoomvalue == "Auto") {
                zoomfactor = 1;
                this.model.isResponsive = true;
            }
            else {
                zoomvalue = zoomvalue + "%";
                this.model.isResponsive = false;
            }
            this._calculateZoomLevel(zoomfactor);
            this._zoomContainer(zoomfactor, false);
            $('#' + this._id + '_toolbar_zoomSelection_hidden').val(zoomvalue);
            this._ejDropDownInstance.model.selectedIndices[0] = "";
            $('#' + this._id + '_toolbar_zoomSelection_popup li').removeClass('e-active');
            this._ejDropDownInstance.model.value = zoomvalue;
        },

        /*---------------------client side methods[end]----------------------------------------------------------*/
    });

    /**
	* Enum for enable and disable toolbar items.	 
	* @enum {number}
	* @global 
	*/
    ej.PdfViewer.ToolbarItems = {
        /**  Enables zoom toolbar item. */
        MagnificationTools: 1 << 0,
        /**  Enables page navigation toolbar item. */
        PageNavigationTools: 1 << 1,
        /**  Enables print toolbar item. */
        PrintTools: 1 << 2,
        /**  Enables download toolbar item. */
        DownloadTool: 1 << 3,
        /**  Enables Search toolbar item. */
        TextSearchTool: 1 << 4,
        /**   Enables all the toolbar items. */
        All: 1 << 0 | 1 << 1 | 1 << 2| 1 << 3 | 1 << 4
    };

    ej.PdfViewer.PdfService = {
        Local: 1 << 0,
        Remote: 1 << 1,
    };
    ej.PdfViewer.LinkTarget = {
        Default: 1 << 0,
        NewTab: 1 << 1,
        NewWindow: 1 << 2,
    };

    ej.PdfViewer.Locale = ej.PdfViewer.Locale || {};

    ej.PdfViewer.Locale["default"] = ej.PdfViewer.Locale["en-US"] = {
        toolbar: {
            print: {
                headerText: 'Print',
                contentText: 'Print the PDF document.'
            },
            download: {
                headerText: 'Download',
                contentText: 'Download the PDF document.'
            },
            first: {
                headerText: 'First',
                contentText: 'Go to the first page of the PDF document.'
            },
            previous: {
                headerText: 'Previous',
                contentText: 'Go to the previous page of the PDF document.'
            },
            next: {
                headerText: 'Next',
                contentText: 'Go to the next page of the PDF document.'
            },
            last: {
                headerText: 'Last',
                contentText: 'Go to the last page of the PDF document.'
            },
            zoomIn: {
                headerText: 'Zoom-In',
                contentText: 'Zoom in to the PDF document.'
            },
            zoomOut: {
                headerText: 'Zoom-Out',
                contentText: 'Zoom out of the PDF document.'
            },
            pageIndex: {
                headerText: 'Page Number',
                contentText: 'Current page number to view.'
            },
            zoom: {
                headerText: 'Zoom',
                contentText: 'Zoom in or out on the PDF document.'
            },
            fitToWidth: {
                headerText: 'Fit to Width',
                contentText: 'Fit the PDF page to the width of the container.',
            },
            fitToPage: {
                headerText: 'Fit to Page',
                contentText: 'Fit the PDF page to the container.',
            },
            search: {
                headerText: 'Search Text',
                contentText: 'Search text in the PDF pages.',
            }
        },
    };
})(jQuery, Syncfusion);
;;

});