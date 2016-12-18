/*!
*  filename: ej.pdfviewer.js
*  version : 14.2.0.26
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
                toolbarItem: 1 | 2 | 4,
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
        },
        //#endregion

        //#region Local Members
        _isToolbarClick: false,
        _pageModel: null,
        _currentPage: 1,
        _zoomLevel: 2,
        _preZoomVal: 1,
        _fitType: null,
        _higherZoomIndex: 0,
        _lowerZoomIndex: 0,
        _actionUrl: null,
        _isDevice: false,
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
        _isRenderedByPinch: false,
        _isPinchLimitReached: false,
        _isRerenderCanvasCreated: false,
        _isPrinting: false,
        _isContainImage: false,
        _isPercentHeight: -1,
        _isPercentWidth: -1,
        _isHeight: false,
        _isWidth: false,
        _isPrintHidden: false,
        _isNavigationHidden: false,
        _isMagnificationHidden: false,
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
        _ejDropDownInstance:null,
        //#endregion

        //#region public members
        pageCount: 0,
        currentPageNumber: this._currentPage,
        zoomPercentage: 100,
        fileName: this._pdfFileName,
        //#endregion

        //#region Initialization
        _init: function () {
            this._actionUrl = this.model.serviceUrl + "/PostViewerAction";
            var ejViewer = $(this.element).closest(".e-pdfviewer", "container");
            this._ejViewerInstance = ejViewer.ejPdfViewer("instance");
            this._renderViewer();
            this._initViewer();
            this._ejDropDownInstance = $('#' + this._id + '_toolbar_zoomSelection').data("ejDropDownList");
            this._getPdfService(this.model.pdfService);
            if (this.model.serviceUrl) {
                var jsonResult = new Object();
                jsonResult["viewerAction"] = "GetPageModel";
                jsonResult["controlId"] = this._id;
                jsonResult["pageindex"] = "1";
                jsonResult["isInitialLoading"] = "true";
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
            }
            this._showViewerBlock(false);
            this._setContainerSize();
            this._showloadingIndicator(true);
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
                $('#hyperlinkcanvas_' + count).remove();
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
            $('body').append($divTooltip);
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
                    var $ulprintExport = ej.buildTag("ul.e-pdfviewer-toolbarul", "", {});
                    this._appendToolbarItems($ulprintExport, 'print');
                    div.append($ulprintExport);

                    var $ulnavigate = ej.buildTag("ul.e-pdfviewer-toolbarul", "", {});
                    this._appendToolbarItems($ulnavigate, 'gotofirst');
                    this._appendToolbarItems($ulnavigate, 'gotoprevious');
                    this._appendToolbarItems($ulnavigate, 'gotopage');
                    this._appendToolbarItems($ulnavigate, 'gotonext');
                    this._appendToolbarItems($ulnavigate, 'gotolast');
                    div.append($ulnavigate);

                    var $ulzoom = ej.buildTag("ul.e-pdfviewer-toolbarul", "", {});
                    this._appendToolbarItems($ulzoom, 'zoomin');
                    this._appendToolbarItems($ulzoom, 'zoomout');
                    this._appendToolbarItems($ulzoom, 'zoom');
                    //Appending the fitWidth and the fitPage buttons to the toolbar
                    this._appendToolbarItems($ulzoom, 'fitWidth');
                    this._appendToolbarItems($ulzoom, 'fitPage');
                    div.append($ulzoom);

                    $('#' + this._id + '_toolbar_zoomSelection').ejDropDownList({ height: "27px", width: "75px", cssClass: "e-pdfviewer-ddl", change: this._zoomValChange, selectedItem: 0 });
                }
                div.ejToolbar({ enableSeparator: !this._isDevice, click: $.proxy(this._toolbarClick, this), isResponsive: true });
                this._toolbar = $('#' + this._id + '_toolbarContainer').data('ejToolbar');
                $('#container_toolbarContainer_hiddenlist').removeClass("e-responsive-toolbar").addClass("e-pdfviewer-responsivesecondarytoolbar");
                $('#container_toolbarContainer_hiddenlist').removeClass("e-toolbarspan");
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
            var viewer = ej.buildTag("div.e-pdfviewer-viewer", "", {});

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
                this._renderToolTip();
            }
            this._renderViewerContainer(viewer);
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
            //timer
            this._scrollTimer = setInterval(function () { ins._pageviewscrollchanged(pageHeight) }, 500);
            ins._backgroundPage = 1;

            this._previousZoom = 1;
            ins._previousPage = ins._currentPage;
            this._pageLocation = new Array();
            this._renderedCanvasList = new Array();
            this._pageContents = new Array();
            this._pageLocation[1] = 0;
            this._canvascount = this._totalPages;
            this._pointers = new Array();
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
                canvas.id = "pagecanvas_" + index;
                canvas.style.height =this._zoomVal* this._pageSize[index - 1].PageHeight + 'px';
                canvas.style.width = this._zoomVal*this._pageSize[index - 1].PageWidth +'px';
                canvas.height = this._zoomVal * this._pageSize[index - 1].PageHeight;
                canvas.style.backgroundColor = "white";
                canvas.width = this._zoomVal * this._pageSize[index - 1].PageWidth;
                imageDiv.append(canvas);

                //Hyperlink canvas

                var hyperlinklayer = document.createElement('div');
                hyperlinklayer.id = 'hyperlinkcanvas_' + index;
                hyperlinklayer.style.height = canvas.height + 'px';
                hyperlinklayer.style.width = canvas.width + 'px';
                hyperlinklayer.style.position = 'absolute';
                hyperlinklayer.style.left = 0;
                hyperlinklayer.style.top = 0;
                hyperlinklayer.style.backgroundColor = 'transparent';
                hyperlinklayer.style.opacity = '0.2';
                hyperlinklayer.style.zIndex = '2';
                imageDiv.append(hyperlinklayer);

                //Setting border style for page canvas
                $('#pagecanvas_' + index).css( 'box-shadow', '0px 0px 0px 1px #000000');
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
                    if (nextpageheightinview > currentpageheightinview) {
                        currentPageNum = parseFloat(currentPageNum) + 1;
                        this._renderPreviousPage = true;
                    }
                    this._renderPreviousPage = false;
                    break;
                }
                else {
                    sum = parseFloat(sum) + parseFloat(pageHeight * this._zoomVal) + 8;
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
            if (vscrolvalue == this._previousPosition) {
                currentPageNum = this._currentPage;

                if (this._totalPages && this._previousPage != currentPageNum) {
                    var pagenumber = parseInt(currentPageNum);
                    this._previousPage = currentPageNum;
                    if (pagenumber >= 1 && pagenumber <= this._totalPages) {
                        if (this._jsondata == "" || this._jsondata == null) {
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
                        if (this._renderedCanvasList.indexOf(parseInt(this._currentPage)) == -1 && !this._scrollTriggered && !this._pageContents[parseInt(this._currentPage)]) {
                            this._scrollTriggered = true;
                            var jsonResult = new Object();
                            jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                            jsonResult["pageindex"] = this._currentPage.toString();
                            if (this._pdfService == ej.PdfViewer.PdfService.Local)
                                this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                            else
                                this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                        }
                    }
                }
            }
            if (this._renderedCanvasList.indexOf(parseInt(this._currentPage)) == -1 && !this._scrollTriggered && this._currentPage <= this._totalPages) {
                if (!this._pageContents[parseInt(this._currentPage)]) {
                    this._scrollTriggered = true;
                    var jsonResult = new Object();
                    jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                    jsonResult["pageindex"] = this._currentPage.toString();
                    if (this._pdfService == ej.PdfViewer.PdfService.Local)
                        this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                    else
                        this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                }
                else {
                    var jsdata = this._pageContents[parseInt(this._currentPage)];
                    this._drawPdfPage(jsdata);
                }
            }
            var nextpage = parseInt(this._currentPage) + 1;
            if (!this._renderPreviousPage) {
                if (this._renderedCanvasList.indexOf(parseInt(nextpage)) == -1 && !this._scrollTriggered && nextpage <= this._totalPages) {
                    if (!this._pageContents[parseInt(nextpage)]) {
                        this._scrollTriggered = true;
                        var jsonResult = new Object();
                        jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                        jsonResult["pageindex"] = nextpage.toString();
                        if (this._pdfService == ej.PdfViewer.PdfService.Local)
                            this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                        else
                            this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                    }
                    else {
                        var jsdata = this._pageContents[parseInt(nextpage)];
                        this._drawPdfPage(jsdata);
                    }
                }
                else if (this._renderedCanvasList.indexOf(parseInt(this._currentPage) - 1) == -1 && !this._scrollTriggered && (parseInt(this._currentPage) - 1) > 0) {
                    if (!this._pageContents[parseInt(this._currentPage) - 1]) {
                        this._scrollTriggered = true;
                        var jsonResult = new Object();
                        jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                        jsonResult["pageindex"] = (parseInt(this._currentPage) - 1).toString();
                        if (this._pdfService == ej.PdfViewer.PdfService.Local)
                            this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                        else
                            this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                    }
                    else {
                        var jsdata = this._pageContents[parseInt(this._currentPage) - 1];
                        this._drawPdfPage(jsdata);
                    }
                }
            }
            else {
                if (this._renderedCanvasList.indexOf(parseInt(this._currentPage) - 1) == -1 && !this._scrollTriggered && (parseInt(this._currentPage) - 1) > 0) {
                    if (!this._pageContents[parseInt(this._currentPage) - 1]) {
                        this._scrollTriggered = true;
                        var jsonResult = new Object();
                        jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                        jsonResult["pageindex"] = (parseInt(this._currentPage) - 1).toString();
                        if (this._pdfService == ej.PdfViewer.PdfService.Local)
                            this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                        else
                            this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                    }
                    else {
                        var jsdata = this._pageContents[parseInt(this._currentPage) - 1];
                        this._drawPdfPage(jsdata);
                    }
                }
                else if (this._renderedCanvasList.indexOf(parseInt(nextpage)) == -1 && !this._scrollTriggered && nextpage <= this._totalPages) {
                    if (!this._pageContents[parseInt(nextpage)]) {
                        this._scrollTriggered = true;
                        var jsonResult = new Object();
                        jsonResult["viewerAction"] = this._viewerAction.getPageModel;
                        jsonResult["pageindex"] = nextpage.toString();
                        if (this._pdfService == ej.PdfViewer.PdfService.Local)
                            this._doAjaxPostscroll("POST", this._actionUrl, JSON.stringify(jsonResult));
                        else
                            this._doAjaxPostscroll("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }));
                    }
                    else {
                        var jsdata = this._pageContents[parseInt(nextpage)];
                        this._drawPdfPage(jsdata);
                    }
                }
            }
            this._previousPosition = vscrolvalue;
        },

        _doAjaxPostscroll: function (type, url, jsonResult) {
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
                    proxy._drawPdfPage(data);
                    proxy._scrollTriggered = false;
                },
                error: function (msg, textStatus, errorThrown) {
                    if (msg.readyState == 0) {
                        return;
                    }
                    alert('Exception' + msg.responseText);
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
            this._pageimageList = jsondata["imagestream"];

            this._pageContents[parseInt(jsondata["currentpage"])] = backupjson;
            this._pageCompleted = this._pageimageList["pagecompleted"];

            //Hyperlink
            if ($('#' + 'hyperlinkcanvas_' + pageindex).children().length > 0) {
                document.getElementById("hyperlinkcanvas_" + pageindex).innerHTML = "";
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
                    if (documentlinkpagenumber.length != 0) {
                        var destPageHeight = (this._pageSize[pageindex].PageHeight);
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
                    var hyperlinkcanvas = document.getElementById('hyperlinkcanvas_' + pageindex);
                    hyperlinkcanvas.appendChild(aTag);
                }
            }
            //Hyperlink

            var index = parseInt(jsondata["currentpage"]);
            var canvas = document.getElementById('pagecanvas_' + parseInt(jsondata["currentpage"]));
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
            var shapes = this._pageimageList["textelements"];
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
                    context.setTransform(matrix[0] * this._zoomVal, matrix[1]* this._zoomVal, matrix[2]* this._zoomVal, matrix[3] * this._zoomVal, matrix[4] * this._zoomVal, matrix[5] * this._zoomVal);
                }
                if (pathValue != null ) {
                    context.beginPath();

                    for (var i = 0; i < pathValue.length; i++) {
                        var val = pathValue[i];
                        var pathType = val[0];
                        if (pathType == "M") {
                            val = val.substring(1, val.length);
                            val = val.split(" ");
                            context.moveTo(parseInt(val[0]), val[1]);
                        }
                        else if (pathType == "L") {
                            val = val.substring(1, val.length);
                            val = val.split(" ");
                            context.lineTo(parseInt(val[0]), val[1]);
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
        },

        _convertPointToPixel: function (value) {
            return (parseFloat(value) * (96 / 72));
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

                            if (rectangle != undefined) {
                                context.fillStyle = color;
                                context.fillRect(rectangle[0], rectangle[1], rectangle[2], rectangle[3]);

                            }

                            if (pathValue != null && rectangle == undefined) {
                                context.beginPath();

                                for (var i = 0; i < pathValue.length; i++) {
                                    var val = pathValue[i];
                                    var pathType = val[0];
                                    if (pathType == "M") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.moveTo(parseInt(val[0]), val[1]);
                                    }
                                    else if (pathType == "L") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.lineTo(parseInt(val[0]), val[1]);
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
            }
            imageObject.src = imageObjCollection[index];
            imageDataCollection.push(imageObject);
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
                    this._trigger(eventName, args);
                }
            }
        },

        _getPageModel: function (jsondata) {
            this._on($(window), "resize", this._viewerResize);
            this._jsondata = jsondata;
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
                this.currentPageNumber = this._currentPage;
                if (!this._isToolbarClick) {
                    this._enableToolbarItems();
                }
                this._gotoPage(this._currentPage);
                this._drawPdfPage(jsondata);
                this._showNavigationIndicator(false);
                this._showloadingIndicator(false);
            }
        },
        //-------------------- Ajax Web API Call back methods[end] -------------------------//

        //-------------------- Print Actions[Start] -------------------------//
        _print: function () {
            this._abortPrinting = false;
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
                    frameDoc.document.write('<html><head><style>@page{margin:0cm; size: 816px 1056px;} </style></head><body><center>');
                }
            }
            else {
                //ie
                frameDoc.document.write('<html><head><style>@page{margin:0cm; size: 816px 1056px;} </style></head><body><center>');
            }

            for (var i = 1; i <= proxy._totalPages; i++) {
                var canvas = document.getElementById('pagecanvas_' + i);
                var canvasUrl = canvas.toDataURL();
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
                    }
                }
                if (browserUserAgent.indexOf('Edge') == -1) {
                    if ((browserUserAgent.indexOf('Chrome') != -1) || (browserUserAgent.indexOf('Safari') != -1) || (browserUserAgent.indexOf("Firefox")) != -1) {
                        //chrome and firefox
                        if ((browserUserAgent.indexOf('Chrome') != -1) || (browserUserAgent.indexOf('Safari') != -1))
                            frameDoc.document.write('<div><img src="' + canvas.toDataURL() + '" style="margin:0px;display:block;width:816px;height:1056px" id="' + 'image_' + i + '"/></div><br/>');
                        else
                            frameDoc.document.write('<div><img src="' + canvas.toDataURL() + '" style="margin:0px;display:block;width:' + proxy._pageSize[i - 1].PageWidth + ';height:' + proxy._pageSize[i - 1].PageHeight + '" id="' + 'image_' + i + '"/></div><br/>');
                        //chrome and firefox
                    }
                    else {
                        //ie
                        frameDoc.document.write('<img src="' + canvas.toDataURL() + '" style="width:816px;height:1056px;margin:0px" id="' + 'image_' + i + '"/><br />');
                    }
                }
                else {
                    //ie
                    frameDoc.document.write('<img src="' + canvas.toDataURL() + '" style="width:816px;height:1056px;margin:0px" id="' + 'image_' + i + '"/><br />');
                }
            }
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
            this._currentPage = this._currentPageBackup;
            this._zoomVal = this._zoomValBackup;
            this._zoomLevel = this._zoomLevelBackup;
            for (var i = 1; i <= this._totalPages; i++) {
                var canvas = document.getElementById('pagecanvas_' + i);
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
            this._renderedCanvasList.push(parseInt(jsondata["currentpage"]));
            var pageindex = parseInt(jsondata["currentpage"]);
            this._showPageLoadingIndicator(pageindex, true);
            this._pageimageList = jsondata["imagestream"];
            var index = parseInt(jsondata["currentpage"]);
            this._pageContents[parseInt(jsondata["currentpage"])] = backupjson;

            var canvas = document.getElementById('pagecanvas_' + parseInt(jsondata["currentpage"]));
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
            var shapes = this._pageimageList["textelements"];
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
                            context.moveTo(parseInt(val[0]), val[1]);
                        }
                        else if (pathType == "L") {
                            val = val.substring(1, val.length);
                            val = val.split(" ");
                            context.lineTo(parseInt(val[0]), val[1]);
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
                    if ((offsett = browserUserAgent.indexOf("Firefox")) != -1 || (offsett = browserUserAgent.indexOf("Chrome")) != -1 || (offsett = browserUserAgent.indexOf("Safari")) != -1 || (offsett = browserUserAgent.indexOf("AppleWebKit")) != -1) {
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
            if (this._jsondata == "" || this._jsondata == null) {
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
            pageViewline.css({ "width": pagecontainer.width(), "height": pagecontainer.height() });
            pageViewline.css({ "width": pagecontainer[0].getBoundingClientRect().width, "height": pagecontainer[0].getBoundingClientRect().height });
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
                var ejViewer = $(".e-pdfviewer");
                ejViewerInstance = ejViewer.ejPdfViewer("instance");
                ejViewerInstance._ejViewerInstance = ejViewerInstance;
            }
            var zoomVal;
            if (sender.value != undefined) {
                if (sender.value == "Auto") {
                    ejViewerInstance.model.isResponsive = true;
                    zoomVal = 1;
                    ejViewerInstance._ejViewerInstance._zoomLevel = 3;
                    ejViewerInstance._ejViewerInstance._isAutoZoom = true;
                }
                else {
                    zoomVal = parseInt(sender.value) / 100;
                    ejViewerInstance.model.isResponsive = false;
                    ejViewerInstance._ejViewerInstance._zoomLevel = sender.itemId;
                    ejViewerInstance._ejViewerInstance._isAutoZoom = false;
                }

                ejViewerInstance._ejViewerInstance._zoomContainer(zoomVal, false);
            } else if (sender.target.innerHTML != undefined) {
                var str = sender.target.innerHTML;
                if (sender.target.innerHTML == "Auto") {
                    ejViewerInstance.model.isResponsive = true;
                    zoomVal = 1;
                    ejViewerInstance._ejViewerInstance._isAutoZoom = true;
                }
                else {
                    var str = str.substring(0, str.length - 1);
                    zoomVal = parseInt(str) / 100;
                    ejViewerInstance.model.isResponsive = false;
                    ejViewerInstance._ejViewerInstance._isAutoZoom = false;
                }
                ejViewerInstance._ejViewerInstance._zoomContainer(zoomVal, false);
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
                var canvas = document.getElementById('pagecanvas_' + i);
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

                var hyperlinklayer = document.getElementById('hyperlinkcanvas_' + i);
                hyperlinklayer.style.height = canvas.height + 'px';
                hyperlinklayer.style.width = canvas.width + 'px';
                hyperlinklayer.style.position = 'absolute';
                hyperlinklayer.style.left = 0;
                hyperlinklayer.style.top = 0;
                hyperlinklayer.style.backgroundColor = 'transparent';
                hyperlinklayer.style.opacity = '0.2';
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
                var canvas = document.getElementById('pagecanvas_' + i);
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

                var hyperlinklayer = document.getElementById('hyperlinkcanvas_' + i);
                hyperlinklayer.style.height = canvas.height + 'px';
                hyperlinklayer.style.width = canvas.width + 'px';
                hyperlinklayer.style.position = 'absolute';
                hyperlinklayer.style.left = 0;
                hyperlinklayer.style.top = 0;
                hyperlinklayer.style.backgroundColor = 'transparent';
                hyperlinklayer.style.opacity = '0.2';
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
                $('#' + this._id + '_txtpageNo').parents(".e-pdfviewer-toolbarul").css("border-right-width", "1px");
                $('#' + this._id + '_toolbar_zoomin').parents("li.e-pdfviewer-toolbarli").css("display", "block");
                $('#' + this._id + '_toolbar_zoomout').parents("li.e-pdfviewer-toolbarli").css("display", "block");
                $('#' + this._id + '_toolbar_zoomSelection').parents("div.e-pdfviewer-ejdropdownlist").css("display", "block");
                $('#' + this._id + '_toolbar_Print').parent().parents(".e-pdfviewer-toolbarul").css("border-right-width", "1px");
                this._isMagnificationHidden = false;
            }
            else {
                $('#' + this._id + '_txtpageNo').parents(".e-pdfviewer-toolbarul").css("border-right-width", "0px");
                $('#' + this._id + '_toolbar_zoomin').parents("li.e-pdfviewer-toolbarli").css("display", "none");
                $('#' + this._id + '_toolbar_zoomout').parents("li.e-pdfviewer-toolbarli").css("display", "none");
                $('#' + this._id + '_toolbar_zoomSelection').parents("div.e-pdfviewer-ejdropdownlist").css("display", "none");
                this._isMagnificationHidden = true;
                if (!this._isPrintHidden && this._isNavigationHidden && this._isMagnificationHidden) {
                    $('#' + this._id + '_toolbar_Print').parent().parents(".e-pdfviewer-toolbarul").css("border-right-width", "0px");
                }
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
                var canvas = document.getElementById('pagecanvas_' + i);
                var context = canvas.getContext('2d');
                var height = this._pageSize[i - 1].PageHeight * this._zoomVal;
                var width = this._pageSize[i - 1].PageWidth * this._zoomVal;
                canvas.style.height = height + 'px';
                canvas.style.width = width + 'px';
                var pagediv = $('#' + this._id + 'pageDiv_' + i);
                pagediv[0].style.top = this._pageLocation[i] * this._zoomVal + "px";
                pagediv[0].style.left = leftpos + "px";

                //Hyperlink canvas

                var hyperlinklayer = document.getElementById('hyperlinkcanvas_' + i);
                hyperlinklayer.style.height = height + 'px';
                hyperlinklayer.style.width = width + 'px';
                hyperlinklayer.style.position = 'absolute';
                hyperlinklayer.style.left = 0;
                hyperlinklayer.style.top = 0;
                hyperlinklayer.style.backgroundColor = 'transparent';
                hyperlinklayer.style.opacity = '0.2';
                hyperlinklayer.style.zIndex = '2';
                    //resizing the loding indicator of the page
                    $('#' + this._id + 'pageDiv_' + i + '_WaitingPopup').css({ 'display': 'none', 'height': height + 'px', 'width': width + 'px', 'left': '0px', 'top': '0px' });
                   var loadingindicator = document.getElementById(this._id + 'pageDiv_' + i + '_WaitingPopup');
                    var spanDiv = loadingindicator.childNodes[0];
                   spanDiv.style.top = (canvas.height - spanDiv.clientHeight) / 2 + 'px';

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
                var canvas = document.getElementById('pagecanvas_' + i);
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
                canvas.id = 'oldcanvas_' + i;
                pageDiv.appendChild(newCanvas);
            }
            this._isRerenderCanvasCreated = true;
        },

        _replaceOldCanvas: function () {
            for (var i = 1; i <= this._totalPages; i++) {
                var pageDiv = document.getElementById(this._id + 'pageDiv_' + i);
                var canvas = document.getElementById('pagecanvas_' + i);
                var oldcanvas = document.getElementById('oldcanvas_' + i);
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
            this._pageimageList = jsondata["imagestream"];

            this._pageContents[parseInt(jsondata["currentpage"])] = backupjson;
            this._pageCompleted = this._pageimageList["pagecompleted"];

            //Hyperlink
            if ($('#' + 'hyperlinkcanvas_' + pageindex).children().length > 0) {
                 document.getElementById("hyperlinkcanvas_" + pageindex).innerHTML = "";
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
                    if (documentlinkpagenumber.length != 0) {
                        var destPageHeight = (this._pageSize[pageindex].PageHeight);
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
                    var hyperlinkcanvas = document.getElementById('hyperlinkcanvas_' + pageindex);
                    hyperlinkcanvas.appendChild(aTag);
                }
            }
            //Hyperlink

            var index = parseInt(jsondata["currentpage"]);
            var canvas = document.getElementById('pagecanvas_' + parseInt(jsondata["currentpage"]));
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
            var shapes = this._pageimageList["textelements"];
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
                            context.moveTo(parseInt(val[0]), val[1]);
                        }
                        else if (pathType == "L") {
                            val = val.substring(1, val.length);
                            val = val.split(" ");
                            context.lineTo(parseInt(val[0]), val[1]);
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
                                        context.moveTo(parseInt(val[0]), val[1]);
                                    }
                                    else if (pathType == "L") {
                                        val = val.substring(1, val.length);
                                        val = val.split(" ");
                                        context.lineTo(parseInt(val[0]), val[1]);
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
        },

        _touchMove: function (event) {
            var eventTouch = event.touches;
            if (eventTouch.length > 1) {
                var ejViewer = $(event.target).parents('.e-pdfviewer.e-js');
                var ejViewerInstance = ejViewer.ejPdfViewer("instance");
                if (!ejViewerInstance._isRerenderCanvasCreated) {
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
        //-------------------- Toolbar Actions[Start] -------------------------//
        _wireEvents: function () {
            if (!this.model.toolbarSettings.templateId) {
                this._on($('#' + this._id + '_txtpageNo'), "keypress", this._allowOnlyNumbers);
                this._on($('#' + this._id + '_txtpageNo'), "keypress", this._onkeyPress);
                this._on($('#' + this._id + '_txtpageNo'), "click ", this._onToolbarItemClick);
                this._on($('#' + this._id + '_zoomSelection'), "change", this._zoomValChange);
                this._on($('#' + this._id + '_toolbar_zoomSelection_container'), "click ", this._onToolbarItemClick);
            }

            var viewer = document.getElementById(this._id + '_viewerContainer');
            $('#' + this._id + '_viewerContainer').css({ 'touch-action': 'pan-x pan-y' });
            $('#' + this._id + '_pdfviewerContainer').css({ 'touch-action': 'pan-x pan-y' });
            if (navigator.userAgent.match("Firefox") || navigator.userAgent.match("Chrome")) {
                viewer.addEventListener('touchstart', this._touchStart);
                viewer.addEventListener('touchmove', this._touchMove);
                viewer.addEventListener('touchleave', this._touchEnd);
                viewer.addEventListener('touchend', this._touchEnd);
                viewer.addEventListener('touchcancel', this._touchEnd);
            }
            this._on($('#' + this._id + '_viewerContainer'), 'pointerdown', this._pointerdown);
            this._on($('#' + this._id + '_viewerContainer'), 'pointermove', this._pointermove);
            this._on($('#' + this._id + '_viewerContainer'), 'pointerup', this._pointerup);
            this._on($('#' + this._id + '_viewerContainer'), 'pointerleave', this._pointerup);
            this._on($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-pdfviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-pdfviewer-tbpage'), "mouseover", this._showIconToolTip);
            this._on($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-pdfviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-pdfviewer-tbpage'), "mouseout", this._hideIconToolTip);
        },

        _unwireEvents: function () {
            if (!this.model.toolbarSettings.templateId) {
                this._on($('#' + this._id + '_txtpageNo'), "keypress", this._allowOnlyNumbers);
                this._off($('#' + this._id + '_txtpageNo'), "keypress", this._onkeyPress);
                this._off($('#' + this._id + '_txtpageNo'), "click ", this._onToolbarItemClick);
                this._off($('#' + this._id + '_zoomSelection'), "change", this._zoomValChange);
                this._off($('#' + this._id + '_toolbar_zoomSelection_container'), "click ", this._onToolbarItemClick);
            }

            var viewer = document.getElementById(this._id + '_viewerContainer');
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
            this._off($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-pdfviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-pdfviewer-tbpage'), "mouseover", this._showIconToolTip);
            this._off($('#' + this._id + '_toolbarContainer li,#' + this._id + '_toolbarContainer .e-pdfviewer-ejdropdownlist,#' + this._id + '_toolbarContainer .e-pdfviewer-tbpage'), "mouseout", this._hideIconToolTip);
        },


        _onToolbarItemClick: function (event) {
            if (event.target.id == this._id + "_txtpageNo") {
                $('#' + this._id + '_txtpageNo').select();
            }
            $('#' + this._id + '_rptTooltip').css('display', 'none');
        },

        _toolbarClick: function (event) {
            var targetItem = event.target
            var clickedItem = event.target;
            if (this._isToolbarClick) {
                $('#' + this._id + '_rptTooltip').css('display', 'none');
                if ($(clickedItem).hasClass('e-pdfviewer-toolbarli')) {
                    clickedItem = $(clickedItem).find('span');
                }
                if ($(clickedItem).hasClass("e-pdfviewer-print")) {
                    this._print();
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
            }
        },

        _showToolbar: function (showToolbar) {
            if (showToolbar) {
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
                }

                if (toolTipText && isShowTooltip) {
                    var maxZindex = this._viewerMaxZindex();
                    $('#' + this._id + '_rptTooltip_Header').html(toolTipText.header);
                    $('#' + this._id + '_rptTooltip_Content').html(toolTipText.content);
                    var windowWidth = this.element[0].clientWidth;
                    if (windowWidth < TagPos.left + 2 * TagPos.width) {
                        if (toolTipText.header == "Zoom") {
                            $('#' + this._id + '_rptTooltip').css({ 'zIndex': maxZindex + 1, 'top': (TagPos.top + TagPos.height) + 5, 'left': (TagPos.left - (2 * TagPos.width)), 'display': 'block', 'position': 'absolute' });
                        }
                        else
                            $('#' + this._id + '_rptTooltip').css({ 'zIndex': maxZindex + 1, 'top': (TagPos.top + TagPos.height) + 5, 'left': (TagPos.left - (3 * TagPos.width)), 'display': 'block', 'position': 'absolute' });
                    }
                    else
                        $('#' + this._id + '_rptTooltip').css({ 'zIndex': maxZindex + 1, 'top': (TagPos.top + TagPos.height) + 5, 'left': (TagPos.left + (TagPos.width / 2)), 'display': 'block', 'position': 'absolute' });
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
            }
            return { header: headerTxt, content: contentTxt };
        },
        //-------------------- Tooltip Localization Actions[End]------------------------//

        //-------------------- DrillThrough Actions[Start]----------------------//

        _setInitialization: function () {
            this._jsondata;
            this._canvascount = 0;
            this._fileName = '';
            this._isToolbarClick = false;
            this._pageModel = null;
            this._currentPage = 1;
            this._zoomLevel = 2;
            this._pageImageStream = null;
            this._pageimageList;
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
            $('#' + this._id + '_viewerContainer').ejWaitingPopup({ showOnInit: isShow });
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
            $('#' + this._id + '_loadingIndicator').ejWaitingPopup({ showOnInit: isShow });
            $('#' + this._id + '_loadingIndicator_WaitingPopup').addClass('e-pdfviewer-waitingpopup');
        },

        _showPrintLoadingIndicator: function (isShow) {
            $('#' + this._id).ejWaitingPopup({ showOnInit: isShow, text: "Preparing document for printing...", cssClass: 'e-pdfviewer-waitingpopup-print' });
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
                pageDiv.style.left = leftPosition + "px";
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
                if (this._pdfService == ej.PdfViewer.PdfService.Local)
                    this._doAjaxPost("POST", this._actionUrl, JSON.stringify(jsonResult), "_getPageModel");
                else
                    this._doAjaxPost("POST", this.model.serviceUrl, JSON.stringify({ 'jsonResult': jsonResult }), "_getPageModel");
            } else {
                var actionUrl = this.model.serviceUrl;
                jsonResult["uploadedFile"] = fileUrl;
                if (this._pdfService == ej.PdfViewer.PdfService.Local) {
                    actionUrl = this.model.serviceUrl + "/FileUploadPostAction";
                    this._doAjaxPost("POST", actionUrl, JSON.stringify(jsonResult), "_getPageModel");
                }
                else {
                    actionUrl = actionUrl.replace("PostViewerAction", "FileUploadPostAction");
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
        /**   Enables all the toolbar items. */
        All: 1 << 0 | 1 << 1 | 1 << 2
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
        },
    };
})(jQuery, Syncfusion);
;;

});