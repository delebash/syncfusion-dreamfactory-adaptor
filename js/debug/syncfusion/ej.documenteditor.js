/*!
*  filename: ej.documenteditor.js
*  version : 14.4.0.20
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.core","./../common/ej.data","./../common/ej.scroller"], fn) : fn();
})
(function () {
	
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isIELowerVersion = (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version) < 9);
var DocumentEditor = (function (_super) {
    __extends(DocumentEditor, _super);
    function DocumentEditor() {
        _super.apply(this, arguments);
        this.rootCSS = "e-documenteditor";
        this.PluginName = "ejDocumentEditor";
        this._id = "null";
        this.defaults = {
            importExportSettings: {
                importUrl: "",
            },
            documentChange: null,
            zoomFactorChange: null,
            requestNavigate: null,
            selectionChange: null
        };
        this._documentEditorHelper = null;
        this.model = this.defaults;
    }
    DocumentEditor.prototype._init = function () {
        if (isIELowerVersion)
            return;
        if (!ej.isNullOrUndefined(this.element)) {
            this._documentEditorHelper = new DocumentEditorFeatures.DocumentEditorHelper(this, ej);
            this._documentEditorHelper.Document = this.createEmptyDocument();
        }
    };
    DocumentEditor.prototype._destroy = function () {
        if (isIELowerVersion)
            return;
        window.removeEventListener('resize', this._documentEditorHelper.viewer.windowResizeHandler);
        window.removeEventListener('mousedown', this._documentEditorHelper.viewer.windowMouseDownHandler);
        window.removeEventListener('keyup', this._documentEditorHelper.viewer.windowKeyUpHandler);
    };
    DocumentEditor.prototype.createEmptyDocument = function () {
        var documentAdv = new DocumentEditorFeatures.DocumentAdv(null);
        var sectionAdv = new DocumentEditorFeatures.SectionAdv(null);
        var paragraphAdv = new DocumentEditorFeatures.ParagraphAdv(null);
        sectionAdv.Blocks.push(paragraphAdv);
        documentAdv.Sections.push(sectionAdv);
        return documentAdv;
    };
    DocumentEditor.prototype.loadDocument = function (data) {
        this._documentEditorHelper.ParseDocument(data);
    };
    DocumentEditor.prototype.raiseClientEvent = function (eventName, argument) {
        var val = null;
        if (argument === null) {
        }
        else {
            val = argument;
        }
        var args;
        if (eventName == "documentChange")
            args = "";
        else if (eventName == "selectionChange")
            args = "";
        else if (eventName == "zoomFactorChange")
            args = "";
        else if (eventName == "requestNavigate") {
            var linkType = "";
            switch (val.Hyperlink.LinkType) {
                case DocumentEditorFeatures.HyperlinkType.Bookmark:
                    linkType = "bookmark";
                    break;
                case DocumentEditorFeatures.HyperlinkType.Email:
                    linkType = "email";
                    break;
                case DocumentEditorFeatures.HyperlinkType.File:
                    linkType = "file";
                    break;
                default:
                    linkType = "webpage";
                    break;
            }
            var HyperLink = { "navigationLink": val.Hyperlink.navigationLink, "linkType": linkType };
            args = { "hyperlink": HyperLink };
        }
        this._trigger(eventName, args);
    };
    DocumentEditor.prototype.load = function (path) {
        if (isIELowerVersion)
            return;
        var _ejDocumentEditor = this;
        this._documentEditorHelper.InitDocumentLoad();
        var formData = null;
        if (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version) == 9) {
            formData = "";
        }
        else {
            formData = new FormData();
            formData.append("files", path);
        }
        $.ajax({
            type: "POST",
            async: true,
            processData: false,
            contentType: false,
            crossDomain: true,
            data: formData,
            url: this.model.importExportSettings.importUrl,
            dataType: "JSON",
            success: function (data) {
                _ejDocumentEditor.loadDocument(data);
            },
        });
    };
    DocumentEditor.prototype.getCurrentPageNumber = function () {
        if (isIELowerVersion)
            return;
        return this._documentEditorHelper.CurrentPageNumber;
    };
    DocumentEditor.prototype.getPageCount = function () {
        if (isIELowerVersion)
            return;
        return this._documentEditorHelper.PageCount;
    };
    DocumentEditor.prototype.getZoomFactor = function () {
        if (isIELowerVersion)
            return;
        return this._documentEditorHelper.ZoomFactor;
    };
    DocumentEditor.prototype.setZoomFactor = function (value) {
        if (isIELowerVersion)
            return;
        this._documentEditorHelper.ZoomFactor = value;
    };
    DocumentEditor.prototype.print = function () {
        if (isIELowerVersion)
            return;
        this._documentEditorHelper.Print();
    };
    DocumentEditor.prototype.find = function (text) {
        if (isIELowerVersion)
            return;
        if (text != undefined && text != null && text != "")
            this._documentEditorHelper.Find(text.toString(), 0);
    };
    DocumentEditor.prototype.getSelectedText = function () {
        if (isIELowerVersion)
            return;
        return this._documentEditorHelper.Selection.Text;
    };
    return DocumentEditor;
}(ej.WidgetBase));
ej.widget("ejDocumentEditor", "ej.DocumentEditor", new DocumentEditor());
;
    var isIELowerVersion = (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9);

    if (!isIELowerVersion) {
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DocumentEditorFeatures;
(function (DocumentEditorFeatures) {
    var DocumentEditorEvents = (function () {
        function DocumentEditorEvents() {
        }
        DocumentEditorEvents.DocumentChange = "documentChange";
        DocumentEditorEvents.SelectionChange = "selectionChange";
        DocumentEditorEvents.ZoomFactorChange = "zoomFactorChange";
        DocumentEditorEvents.RequestNavigate = "requestNavigate";
        return DocumentEditorEvents;
    }());
    DocumentEditorFeatures.DocumentEditorEvents = DocumentEditorEvents;
    var DocumentEditorThemeHelper = (function () {
        function DocumentEditorThemeHelper() {
        }
        DocumentEditorThemeHelper.ContextMenu = "ejDocumentEditor-ContextMenu";
        DocumentEditorThemeHelper.ContextMenuUlList = "ejDocumentEditor-ContextMenuList";
        DocumentEditorThemeHelper.ContextMenuItem = "ejDocumentEditor-ContextMenuItem";
        DocumentEditorThemeHelper.DisabledContextMenuItem = "ejDocumentEditor-DisbledContextMenuItem";
        DocumentEditorThemeHelper.HiddenContextMenuItem = "ejDocumentEditor-HiddenContextMenuIten";
        DocumentEditorThemeHelper.ContextMenuCopy = "ejDocumentEditor-ContextMenu-Copy";
        DocumentEditorThemeHelper.ContextMenuCopyHyperlink = "ejDocumentEditor-ContextMenu-CopyHyperlink";
        DocumentEditorThemeHelper.ContextMenuOpenHyperlink = "ejDocumentEditro-ContextMenu-OpenHyperlink";
        return DocumentEditorThemeHelper;
    }());
    DocumentEditorFeatures.DocumentEditorThemeHelper = DocumentEditorThemeHelper;
    var DocumentEditorHelper = (function () {
        function DocumentEditorHelper(owner, ej) {
            this.isDocumentLoaded = true;
            this.currentPageNumber = 1;
            this.pageCount = 1;
            this.ej = null;
            this.DocumentEditor = owner;
            this.ej = ej;
            this.viewer = new PageLayoutViewer(this);
            this.selection = new SelectionAdv(this);
        }
        Object.defineProperty(DocumentEditorHelper.prototype, "DocumentEditorElement", {
            get: function () {
                return this.DocumentEditor.element[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorHelper.prototype, "ContainerId", {
            get: function () {
                return this.DocumentEditor._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorHelper.prototype, "CurrentPageNumber", {
            get: function () {
                if (this.Viewer == null || this.Viewer.SelectionEndPage == null)
                    return 1;
                return this.Viewer.Pages.indexOf(this.Viewer.SelectionEndPage) + 1;
            },
            set: function (value) {
                this.currentPageNumber = value;
                this.RaiseClientEvent(DocumentEditorEvents.SelectionChange, null);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorHelper.prototype, "PageCount", {
            get: function () {
                return this.pageCount;
            },
            set: function (value) {
                this.pageCount = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorHelper.prototype, "ZoomFactor", {
            get: function () {
                return this.Viewer.ZoomFactor;
            },
            set: function (value) {
                this.Viewer.ZoomFactor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorHelper.prototype, "Document", {
            get: function () {
                return this.document;
            },
            set: function (document) {
                this._onDocumentChanged(document);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorHelper.prototype, "IsDocumentLoaded", {
            get: function () {
                return this.isDocumentLoaded;
            },
            set: function (value) {
                if (value) {
                    if (this.Document != null)
                        this.Document.ClearUnlinkedFields();
                }
                this.isDocumentLoaded = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorHelper.prototype, "Selection", {
            get: function () {
                return this.selection;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentEditorHelper.prototype, "Viewer", {
            get: function () {
                return this.viewer;
            },
            set: function (viewer) {
                this.viewer = viewer;
            },
            enumerable: true,
            configurable: true
        });
        DocumentEditorHelper.prototype.RaiseClientEvent = function (event, args) {
            this.DocumentEditor.raiseClientEvent(event, args);
        };
        DocumentEditorHelper.prototype.Print = function () {
            this.viewer.Print();
        };
        DocumentEditorHelper.prototype.FireRequestNavigate = function (hyperlinkField) {
            var hyperlink = new HyperLink(hyperlinkField);
            var args = new RequestNavigateEventArgs(hyperlink);
            this.RaiseClientEvent(DocumentEditorEvents.RequestNavigate, args);
        };
        DocumentEditorHelper.prototype._onDocumentChanged = function (document) {
            if (this.document != null)
                this.document.Dispose();
            this.document = document;
            this.IsDocumentLoaded = true;
            if (this.document != null) {
                this.document.OwnerControl = this;
                this.document.LayoutItems(this.viewer);
            }
            this.PageCount = this.Viewer.Pages.Count > 0 ? this.viewer.Pages.Count : 1;
            this.RaiseClientEvent(DocumentEditorEvents.DocumentChange, null);
        };
        DocumentEditorHelper.prototype.InitDocumentLoad = function () {
            this.IsDocumentLoaded = false;
            this.viewer.ClearContainer();
        };
        DocumentEditorHelper.prototype.ParseDocument = function (data) {
            var documentAdv = new DocumentAdv(null);
            if (data.BackgroundColor != null && data.BackgroundColor != undefined)
                documentAdv.BackgroundColor = data.BackgroundColor;
            this._parseSections(data.Sections, documentAdv);
            this._parseAbstractList(data, documentAdv);
            this._parseList(data, documentAdv);
            this.Document = documentAdv;
            this.Selection.SelectRange(documentAdv.DocumentStart, documentAdv.DocumentStart, true);
        };
        DocumentEditorHelper.prototype._parseSections = function (data, documentAdv) {
            for (var i = 0; i < data.length; i++) {
                var sectionAdv = new SectionAdv(null);
                this._parseSectionFormat(data[i].SectionFormat, sectionAdv.SectionFormat);
                this._parseHeaderFooter(data[i].HeaderFooters, sectionAdv.HeaderFooters);
                this._parseTextBody(data[i].Blocks, sectionAdv.Blocks);
                documentAdv.Sections.push(sectionAdv);
            }
        };
        DocumentEditorHelper.prototype._parseSectionFormat = function (data, sectionformat) {
            sectionformat.PageWidth = data.PageWidth;
            sectionformat.PageHeight = data.PageHeight;
            sectionformat.LeftMargin = data.LeftMargin;
            sectionformat.TopMargin = data.TopMargin;
            sectionformat.RightMargin = data.RightMargin;
            sectionformat.BottomMargin = data.BottomMargin;
            sectionformat.HeaderDistance = data.HeaderDistance;
            sectionformat.FooterDistance = data.FooterDistance;
            sectionformat.DifferentFirstPage = data.DifferentFirstPage;
            sectionformat.DifferentOddAndEvenPages = data.DifferentOddAndEvenPages;
        };
        DocumentEditorHelper.prototype._parseHeaderFooter = function (data, headerfooters) {
            this._parseTextBody(data.Header.Blocks, headerfooters.Header.Blocks);
            this._parseTextBody(data.Footer.Blocks, headerfooters.Footer.Blocks);
            this._parseTextBody(data.EvenHeader.Blocks, headerfooters.EvenHeader.Blocks);
            this._parseTextBody(data.EvenFooter.Blocks, headerfooters.EvenFooter.Blocks);
            this._parseTextBody(data.FirstPageHeader.Blocks, headerfooters.FirstPageHeader.Blocks);
            this._parseTextBody(data.FirstPageFooter.Blocks, headerfooters.FirstPageFooter.Blocks);
        };
        DocumentEditorHelper.prototype._parseTextBody = function (data, Blocks) {
            for (var i = 0; i < data.length; i++) {
                var blockAdv = data[i];
                if (blockAdv.hasOwnProperty("Inlines")) {
                    var paragraphAdv = new ParagraphAdv(null);
                    if (blockAdv.hasOwnProperty("ParagraphFormat"))
                        this._parseParagraphFormat(blockAdv.ParagraphFormat, paragraphAdv.ParagraphFormat);
                    if (blockAdv.hasOwnProperty("CharacterFormat"))
                        this._parseCharacterFormat(blockAdv.CharacterFormat, paragraphAdv.CharacterFormat);
                    if (blockAdv.Inlines.length > 0) {
                        this._parseParagraph(blockAdv.Inlines, paragraphAdv);
                    }
                    Blocks.push(paragraphAdv);
                }
                else if (blockAdv.hasOwnProperty("Rows"))
                    this._parseTable(blockAdv, Blocks);
            }
        };
        DocumentEditorHelper.prototype._parseTable = function (blockAdv, Blocks) {
            var tableAdv = new TableAdv(null);
            this._parseTableFormat(blockAdv.TableFormat, tableAdv.TableFormat);
            tableAdv.Title = blockAdv.Title;
            tableAdv.Description = blockAdv.Description;
            for (var i = 0; i < blockAdv.Rows.length; i++) {
                var rowAdv = new TableRowAdv(null);
                tableAdv.Rows.push(rowAdv);
                if (blockAdv.Rows[i].hasOwnProperty("RowFormat")) {
                    this._parseRowFormat(blockAdv.Rows[i].RowFormat, rowAdv.RowFormat);
                    rowAdv.GridBefore = blockAdv.Rows[i].GridBefore;
                    rowAdv.GridBeforeWidth = blockAdv.Rows[i].GridBeforeWidth;
                    rowAdv.GridAfter = blockAdv.Rows[i].GridAfter;
                    rowAdv.GridAfterWidth = blockAdv.Rows[i].GridAfterWidth;
                    for (var j = 0; j < blockAdv.Rows[i].Cells.length; j++) {
                        var cellAdv = new TableCellAdv(null);
                        rowAdv.Cells.push(cellAdv);
                        if (blockAdv.Rows[i].Cells[j].hasOwnProperty("CellFormat"))
                            this._parseCellFormat(blockAdv.Rows[i].Cells[j].CellFormat, cellAdv.CellFormat);
                        this._parseTextBody(blockAdv.Rows[i].Cells[j].Blocks, cellAdv.Blocks);
                    }
                }
            }
            if (tableAdv != null)
                Blocks.push(tableAdv);
        };
        DocumentEditorHelper.prototype._parseParagraph = function (data, paragraphAdv) {
            for (var i = 0; i < data.length; i++) {
                var inline = data[i];
                if (inline.hasOwnProperty("Text")) {
                    var spanAdv = new SpanAdv(null);
                    if (inline.hasOwnProperty("CharacterFormat"))
                        this._parseCharacterFormat(inline.CharacterFormat, spanAdv.CharacterFormat);
                    spanAdv.Text = data[i].Text;
                    paragraphAdv.Inlines.push(spanAdv);
                }
                else if (inline.hasOwnProperty("Imagestring")) {
                    var imageAdv = new ImageAdv(null, data[i].IsInlineImage, data[i].IsMetaFile);
                    paragraphAdv.Inlines.push(imageAdv);
                    imageAdv.ImageString = data[i].Imagestring;
                    imageAdv.Width = data[i].Width;
                    imageAdv.Height = data[i].Height;
                    if (inline.hasOwnProperty("CharacterFormat"))
                        this._parseCharacterFormat(inline.CharacterFormat, imageAdv.CharacterFormat);
                }
                else if (inline.hasOwnProperty("HasFieldEnd")) {
                    var fieldBegin = new FieldBeginAdv(null);
                    fieldBegin.HasFieldEnd = data[i].HasFieldEnd;
                    paragraphAdv.Inlines.push(fieldBegin);
                }
                else if (inline.hasOwnProperty("FieldCharacterType")) {
                    var inline_1 = null;
                    if (data[i].FieldCharacterType == 1) {
                        inline_1 = new FieldSeparatorAdv(null);
                    }
                    else if (data[i].FieldCharacterType == 2) {
                        inline_1 = new FieldEndAdv(null);
                    }
                    paragraphAdv.Inlines.push(inline_1);
                }
            }
        };
        DocumentEditorHelper.prototype._parseCharacterFormat = function (sourceFormat, characterFormat) {
            if (sourceFormat.BaselineAlignment != undefined && sourceFormat.BaselineAlignment != null)
                characterFormat.BaselineAlignment = sourceFormat.BaselineAlignment;
            if (sourceFormat.Underline != undefined && sourceFormat.Underline != null)
                characterFormat.Underline = sourceFormat.Underline;
            if (sourceFormat.StrikeThrough != undefined && sourceFormat.StrikeThrough != null)
                characterFormat.StrikeThrough = sourceFormat.StrikeThrough;
            if (sourceFormat.FontSize != undefined && sourceFormat.FontSize != null)
                characterFormat.FontSize = sourceFormat.FontSize;
            if (sourceFormat.FontFamily != undefined && sourceFormat.FontFamily != null)
                characterFormat.FontFamily = sourceFormat.FontFamily;
            if (sourceFormat.Bold != undefined && sourceFormat.Bold != null)
                characterFormat.Bold = sourceFormat.Bold;
            if (sourceFormat.Italic != undefined && sourceFormat.Italic != null)
                characterFormat.Italic = sourceFormat.Italic;
            if (sourceFormat.HighlightColor != undefined && sourceFormat.HighlightColor != null)
                characterFormat.HighlightColor = sourceFormat.HighlightColor;
            if (sourceFormat.FontColor != undefined && sourceFormat.FontColor != null)
                characterFormat.FontColor = sourceFormat.FontColor;
        };
        DocumentEditorHelper.prototype._parseListCharacterFormat = function (sourceFormat, characterFormat) {
            if (sourceFormat != null) {
                if (sourceFormat.BaselineAlignment != undefined && sourceFormat.BaselineAlignment != null)
                    characterFormat.BaselineAlignment = sourceFormat.BaselineAlignment;
                if (sourceFormat.Underline != undefined && sourceFormat.Underline != null)
                    characterFormat.Underline = sourceFormat.Underline;
                if (sourceFormat.StrikeThrough != undefined && sourceFormat.StrikeThrough != null)
                    characterFormat.StrikeThrough = sourceFormat.StrikeThrough;
                if (sourceFormat.FontSize != undefined && sourceFormat.FontSize != null)
                    characterFormat.FontSize = sourceFormat.FontSize;
                if (sourceFormat.FontFamily != undefined && sourceFormat.FontFamily != null)
                    characterFormat.FontFamily = sourceFormat.FontFamily;
                if (sourceFormat.Bold != undefined && sourceFormat.Bold != null)
                    characterFormat.Bold = sourceFormat.Bold;
                if (sourceFormat.Italic != undefined && sourceFormat.Italic != null)
                    characterFormat.Italic = sourceFormat.Italic;
                if (sourceFormat.HighlightColor != undefined && sourceFormat.HighlightColor != null)
                    characterFormat.HighlightColor = sourceFormat.HighlightColor;
                if (sourceFormat.FontColor != undefined && sourceFormat.FontColor != null)
                    characterFormat.FontColor = sourceFormat.FontColor;
            }
        };
        DocumentEditorHelper.prototype._parseParagraphFormat = function (sourceFormat, paragraphFormat) {
            if (sourceFormat.hasOwnProperty("ListFormat"))
                this._parseListFormat(sourceFormat, paragraphFormat.ListFormat);
            if (sourceFormat.LeftIndent != undefined && sourceFormat.LeftIndent != null)
                paragraphFormat.LeftIndent = sourceFormat.LeftIndent;
            if (sourceFormat.RightIndent != undefined && sourceFormat.RightIndent != null)
                paragraphFormat.RightIndent = sourceFormat.RightIndent;
            if (sourceFormat.FirstLineIndent != undefined && sourceFormat.FirstLineIndent != null)
                paragraphFormat.FirstLineIndent = sourceFormat.FirstLineIndent;
            if (sourceFormat.LineSpacing != undefined && sourceFormat.LineSpacing != null)
                paragraphFormat.LineSpacing = sourceFormat.LineSpacing;
            if (sourceFormat.LineSpacingType != undefined && sourceFormat.LineSpacingType != null)
                paragraphFormat.LineSpacingType = sourceFormat.LineSpacingType;
            if (sourceFormat.BeforeSpacing != undefined && sourceFormat.BeforeSpacing != null)
                paragraphFormat.BeforeSpacing = sourceFormat.BeforeSpacing;
            if (sourceFormat.AfterSpacing != undefined && sourceFormat.AfterSpacing != null)
                paragraphFormat.AfterSpacing = sourceFormat.AfterSpacing;
            if (sourceFormat.TextAlignment != undefined && sourceFormat.TextAlignment != null)
                paragraphFormat.TextAlignment = sourceFormat.TextAlignment;
        };
        DocumentEditorHelper.prototype._parseListFormat = function (blockAdv, ListFormat) {
            ListFormat.ListId = blockAdv.ListFormat.ListId;
            ListFormat.ListLevelNumber = blockAdv.ListFormat.ListLevelNumber;
        };
        DocumentEditorHelper.prototype._parseTableFormat = function (sourceFormat, tableFormat) {
            if (sourceFormat.Borders != undefined && sourceFormat.Borders != null)
                this._parseBorders(sourceFormat.Borders, tableFormat.Borders);
            if (sourceFormat.CellSpacing != undefined && sourceFormat.CellSpacing != null)
                tableFormat.CellSpacing = sourceFormat.CellSpacing;
            if (sourceFormat.LeftMargin != undefined && sourceFormat.LeftMargin != null)
                tableFormat.LeftMargin = sourceFormat.LeftMargin;
            if (sourceFormat.TopMargin != undefined && sourceFormat.TopMargin != null)
                tableFormat.TopMargin = sourceFormat.TopMargin;
            if (sourceFormat.RightMargin != undefined && sourceFormat.RightMargin != null)
                tableFormat.RightMargin = sourceFormat.RightMargin;
            if (sourceFormat.BottomMargin != undefined && sourceFormat.BottomMargin != null)
                tableFormat.BottomMargin = sourceFormat.BottomMargin;
            if (sourceFormat.LeftIndent != undefined && sourceFormat.LeftIndent != null)
                tableFormat.LeftIndent = sourceFormat.LeftIndent;
            if (sourceFormat.Shading != undefined && sourceFormat.Shading != null)
                this._parseShading(sourceFormat.Shading, tableFormat.Shading);
            if (sourceFormat.TableAlignment != undefined && sourceFormat.TableAlignment != null)
                tableFormat.TableAlignment = sourceFormat.TableAlignment;
            if (sourceFormat.PreferredWidth != undefined && sourceFormat.PreferredWidth != null)
                tableFormat.PreferredWidth = sourceFormat.PreferredWidth;
            if (sourceFormat.PreferredWidthType != undefined && sourceFormat.PreferredWidthType != null)
                tableFormat.PreferredWidthType = sourceFormat.PreferredWidthType;
        };
        DocumentEditorHelper.prototype._parseShading = function (sourceShading, destShading) {
            if (sourceShading.BackgroundColor != null && sourceShading.BackgroundColor != undefined)
                destShading.BackgroundColor = sourceShading.BackgroundColor;
            if (sourceShading.ForegroundColor != null && sourceShading.ForegroundColor != undefined)
                destShading.ForegroundColor = sourceShading.ForegroundColor;
            if (sourceShading.TextureStyle != null && sourceShading.TextureStyle != undefined)
                destShading.TextureStyle = sourceShading.TextureStyle;
        };
        DocumentEditorHelper.prototype._parseBorder = function (sourceBorder, destBorder) {
            if (sourceBorder.Color != null && sourceBorder.Color != undefined)
                destBorder.Color = sourceBorder.Color;
            if (sourceBorder.LineStyle != null && sourceBorder.LineStyle != undefined)
                destBorder.LineStyle = sourceBorder.LineStyle;
            if (sourceBorder.LineWidth != null && sourceBorder.LineWidth != undefined)
                destBorder.LineWidth = sourceBorder.LineWidth;
        };
        DocumentEditorHelper.prototype._parseBorders = function (sourceBorders, destBorders) {
            this._parseBorder(sourceBorders.Left, destBorders.Left);
            this._parseBorder(sourceBorders.Right, destBorders.Right);
            this._parseBorder(sourceBorders.Top, destBorders.Top);
            this._parseBorder(sourceBorders.Bottom, destBorders.Bottom);
            this._parseBorder(sourceBorders.Vertical, destBorders.Vertical);
            this._parseBorder(sourceBorders.Horizontal, destBorders.Horizontal);
            this._parseBorder(sourceBorders.DiagonalDown, destBorders.DiagonalDown);
            this._parseBorder(sourceBorders.DiagonalUp, destBorders.DiagonalUp);
        };
        DocumentEditorHelper.prototype._parseCellFormat = function (sourceFormat, cellFormat) {
            if (sourceFormat.Borders != undefined && sourceFormat.Borders != null)
                this._parseBorders(sourceFormat.Borders, cellFormat.Borders);
            if (sourceFormat.IsSamePaddingAsTable)
                cellFormat.ClearMargins();
            else
                this._parseCellMargin(sourceFormat, cellFormat);
            if (sourceFormat.CellWidth != undefined && sourceFormat.CellWidth != null)
                cellFormat.CellWidth = sourceFormat.CellWidth;
            if (sourceFormat.ColumnSpan != undefined && sourceFormat.ColumnSpan != null)
                cellFormat.ColumnSpan = sourceFormat.ColumnSpan;
            if (sourceFormat.RowSpan != undefined && sourceFormat.RowSpan != null)
                cellFormat.RowSpan = sourceFormat.RowSpan;
            if (sourceFormat.Shading != undefined && sourceFormat.Shading != null)
                this._parseShading(sourceFormat.Shading, cellFormat.Shading);
            if (sourceFormat.VerticalAlignment != undefined && sourceFormat.VerticalAlignment != null)
                cellFormat.VerticalAlignment = sourceFormat.VerticalAlignment;
            if (sourceFormat.PreferredWidthType != undefined && sourceFormat.PreferredWidthType != null)
                cellFormat.PrefferedWidthType = sourceFormat.PreferredWidthType;
            if (sourceFormat.PreferredWidth != undefined && sourceFormat.PreferredWidth != null)
                cellFormat.PrefferedWidth = sourceFormat.PreferredWidth;
        };
        DocumentEditorHelper.prototype._parseCellMargin = function (sourceFormat, cellFormat) {
            if (sourceFormat.LeftMargin != undefined && sourceFormat.LeftMargin != null)
                cellFormat.LeftMargin = sourceFormat.LeftMargin;
            if (sourceFormat.RightMargin != undefined && sourceFormat.RightMargin != null)
                cellFormat.RightMargin = sourceFormat.RightMargin;
            if (sourceFormat.TopMargin != undefined && sourceFormat.TopMargin != null)
                cellFormat.TopMargin = sourceFormat.TopMargin;
            if (sourceFormat.BottomMargin != undefined && sourceFormat.BottomMargin != null)
                cellFormat.BottomMargin = sourceFormat.BottomMargin;
        };
        DocumentEditorHelper.prototype._parseRowFormat = function (sourceFormat, rowFormat) {
            if (sourceFormat.AllowBreakAcrossPages != undefined && sourceFormat.AllowBreakAcrossPages != null)
                rowFormat.AllowBreakAcrossPages = sourceFormat.AllowBreakAcrossPages;
            if (sourceFormat.IsHeader != undefined && sourceFormat.IsHeader != null)
                rowFormat.IsHeader = sourceFormat.IsHeader;
            if (sourceFormat.Height != undefined && sourceFormat.Height != null)
                rowFormat.Height = sourceFormat.Height;
            if (sourceFormat.HeightType != undefined && sourceFormat.HeightType != null)
                rowFormat.HeightType = sourceFormat.HeightType;
            if (sourceFormat.Borders != undefined && sourceFormat.Borders != null)
                this._parseBorders(sourceFormat.Borders, rowFormat.Borders);
        };
        DocumentEditorHelper.prototype._parseAbstractList = function (data, documentAdv) {
            for (var i = 0; i < data.AbstractLists.length; i++) {
                var abstractListAdv = new AbstractListAdv(null);
                documentAdv.AbstractLists.push(abstractListAdv);
                abstractListAdv.AbstractListId = data.AbstractLists[i].AbstractListId;
                for (var j = 0; j < data.AbstractLists[i].Levels.length; j++) {
                    var listLevelAdv = this._parseListLevel(data.AbstractLists[i].Levels[j]);
                    abstractListAdv.Levels.push(listLevelAdv);
                }
            }
        };
        DocumentEditorHelper.prototype._parseList = function (data, documentAdv) {
            for (var i = 0; i < data.Lists.length; i++) {
                var listAdv = new ListAdv(null);
                listAdv.AbstractListId = data.Lists[i].AbstractListId;
                documentAdv.Lists.push(listAdv);
                listAdv.ListId = documentAdv.Lists.length - 1;
                if (data.Lists[i].hasOwnProperty("LevelOverrides") != null)
                    this._parseLevelOverride(data.Lists[i].LevelOverrides, listAdv);
            }
        };
        DocumentEditorHelper.prototype._parseLevelOverride = function (data, listAdv) {
            for (var i = 0; i < data.length; i++) {
                var levelOverrideAdv = new LevelOverrideAdv(null);
                var levelOverride = data[i];
                levelOverrideAdv.StartAt = levelOverride.StartAt;
                levelOverrideAdv.LevelNumber = levelOverride.LevelNumber;
                if (data[i].OverrideListLevel != null)
                    levelOverrideAdv.OverrideListLevel = this._parseListLevel(levelOverride.OverrideListLevel);
                listAdv.LevelOverrides.push(levelOverrideAdv);
            }
        };
        DocumentEditorHelper.prototype._parseListLevel = function (data) {
            var listLevelAdv = new ListLevelAdv(null);
            if (data.ListLevelPattern == ListLevelPattern.Bullet) {
                listLevelAdv.ListLevelPattern = ListLevelPattern.Bullet;
                listLevelAdv.NumberFormat = data.NumberFormat;
            }
            else {
                listLevelAdv.ListLevelPattern = data.ListLevelPattern;
                listLevelAdv.StartAt = data.StartAt;
                listLevelAdv.NumberFormat = data.NumberFormat;
                if (data.RestartLevel >= 0)
                    listLevelAdv.RestartLevel = data.RestartLevel;
                else
                    listLevelAdv.RestartLevel = data.LevelNumber;
            }
            listLevelAdv.FollowCharacter = data.FollowCharacter;
            this._parseListCharacterFormat(data.CharacterFormat, listLevelAdv.CharacterFormat);
            this._parseParagraphFormat(data.ParagraphFormat, listLevelAdv.ParagraphFormat);
            return listLevelAdv;
        };
        DocumentEditorHelper.prototype.Find = function (text, findoption) {
            var pattern = HelperMethods.StringToRegex(text, findoption);
            if (this.Document == null || !this.isDocumentLoaded)
                return false;
            return this.Document.Find(pattern, findoption, true, this);
        };
        return DocumentEditorHelper;
    }());
    DocumentEditorFeatures.DocumentEditorHelper = DocumentEditorHelper;
    var MathHelper = (function () {
        function MathHelper() {
        }
        MathHelper.Round = function (value, decimalDigits) {
            var temp = value;
            for (var i = 0; i < decimalDigits; i++) {
                temp = temp * 10;
            }
            temp = Math.round(temp);
            for (var i = 0; i < decimalDigits; i++) {
                temp = temp / 10;
            }
            return temp;
        };
        return MathHelper;
    }());
    DocumentEditorFeatures.MathHelper = MathHelper;
    var TextHelper = (function () {
        function TextHelper() {
        }
        Object.defineProperty(TextHelper, "ParagraphMark", {
            get: function () {
                return "¶";
            },
            enumerable: true,
            configurable: true
        });
        TextHelper.GetParagraphMarkSize = function (characterFormat) {
            var width = TextHelper.GetWidth(this.ParagraphMark, characterFormat);
            var height = 0;
            var baselineOffset = 0;
            var textHelper = TextHelper.GetHeight(characterFormat);
            return {
                "Width": width, "Height": textHelper.Height, "BaselineOffset": textHelper.BaselineOffset
            };
        };
        TextHelper.GetTextSize = function (elementBox, characterFormat) {
            elementBox.Width = TextHelper.GetWidth(elementBox.Text, characterFormat);
            var textHelper = TextHelper.GetHeight(characterFormat);
            elementBox.Height = textHelper.Height;
            elementBox.BaselineOffset = textHelper.BaselineOffset;
        };
        TextHelper.UpdateTextSize = function (elementBox) {
            var listCharacterFormat = elementBox.ListLevel.CharacterFormat;
            var breakCharacterFormat = elementBox.Paragraph.CharacterFormat;
            listCharacterFormat.FontSize = listCharacterFormat.FontSize == 11 ? breakCharacterFormat.FontSize : listCharacterFormat.FontSize;
            listCharacterFormat.FontFamily = listCharacterFormat.FontFamily == "verdana" ? breakCharacterFormat.FontFamily : listCharacterFormat.FontFamily;
            elementBox.Width = TextHelper.GetWidth(elementBox.Text, listCharacterFormat);
            var textHelper = TextHelper.GetHeight(listCharacterFormat);
            elementBox.Height = textHelper.Height;
            elementBox.BaselineOffset = textHelper.BaselineOffset;
        };
        TextHelper.MeasureText = function (text, characterFormat) {
            var width = TextHelper.GetWidth(text, characterFormat);
            var height = 0;
            var baselineOffset = 0;
            var textHelper = TextHelper.GetHeight(characterFormat);
            return {
                "Width": width, "Height": textHelper.Height, "BaselineOffset": textHelper.BaselineOffset
            };
        };
        TextHelper.MeasureTextExcludIngSpaceAtEnd = function (text, characterFormat) {
            var width = TextHelper.GetWidth(text.replace(/\s\s*$/, ''), characterFormat);
            var height = 0;
            var baselineOffset = 0;
            var textHelper = TextHelper.GetHeight(characterFormat);
            return {
                "Width": width, "Height": textHelper.Height, "BaselineOffset": textHelper.BaselineOffset
            };
        };
        TextHelper.GetHeight = function (characterFormat) {
            var textHeight = 0;
            var baselineOffset = 0;
            var spanElement = document.createElement("span");
            spanElement.id = "tempSpan";
            spanElement.style.whiteSpace = "nowrap";
            spanElement.innerText = "m";
            TextHelper.ApplyStyle(spanElement, characterFormat);
            var body = document.getElementsByTagName("body");
            if (body != null && body.length > 0) {
                var parentDiv = document.createElement("div");
                parentDiv.style.display = "inline-block";
                var tempDiv = document.createElement("div");
                tempDiv.setAttribute("style", "display:inline-block;width: 1px; height: 0px;vertical-align: baseline;");
                parentDiv.appendChild(spanElement);
                parentDiv.appendChild(tempDiv);
                document.body.appendChild(parentDiv);
                textHeight = spanElement.getBoundingClientRect().height;
                var textTopVal = spanElement.getBoundingClientRect().top;
                var tempDivTopVal = tempDiv.getBoundingClientRect().top;
                baselineOffset = tempDivTopVal - textTopVal;
                document.body.removeChild(parentDiv);
            }
            return { "Height": textHeight, "BaselineOffset": baselineOffset };
        };
        TextHelper.GetWidth = function (text, characterFormat) {
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            var bold = "";
            var italic = "";
            var fontFamily = "";
            var fontSize = 11;
            bold = characterFormat.Bold ? "bold" : "";
            italic = characterFormat.Italic ? "italic" : "";
            fontFamily = characterFormat.FontFamily;
            fontSize = characterFormat.FontSize == 0 ? 0.5 : characterFormat.FontSize / (characterFormat.BaselineAlignment == BaselineAlignment.Normal ? 1 : 1.5);
            context.font = bold + " " + italic + " " + fontSize + "px" + " " + fontFamily;
            return context.measureText(text).width;
        };
        TextHelper.ApplyStyle = function (spanElement, characterFormat) {
            if (spanElement != undefined && spanElement != null && characterFormat != undefined && characterFormat != null) {
                if (characterFormat.Bold)
                    spanElement.style.fontWeight = "bold";
                if (characterFormat.Italic)
                    spanElement.style.fontStyle = "italic";
                if (characterFormat.FontFamily != "")
                    spanElement.style.fontFamily = characterFormat.FontFamily;
                var fontSize = characterFormat.FontSize;
                if (fontSize <= 0.5)
                    fontSize = 0.5;
                spanElement.style.fontSize = fontSize.toString() + "px";
            }
        };
        return TextHelper;
    }());
    DocumentEditorFeatures.TextHelper = TextHelper;
    var HelperMethods = (function () {
        function HelperMethods() {
        }
        HelperMethods.StringToRegex = function (textToFind, option) {
            if (option == FindOptions.WholeWord || option == FindOptions.CaseSensitiveWholeWord) {
                textToFind = this.WORD_BEFORE + textToFind + this.WORD_AFTER;
            }
            return new RegExp(textToFind, (option == FindOptions.CaseSensitive || option == FindOptions.CaseSensitiveWholeWord) ? 'g' : 'ig');
        };
        HelperMethods.IsPatternEmpty = function (pattern) {
            var wordEmpty = this.WORD_BEFORE + this.WORD_AFTER;
            var patternRegExp = pattern.toString();
            return (patternRegExp.length == 0 || patternRegExp == wordEmpty);
        };
        HelperMethods.AddCssStyle = function (css) {
            var style = document.createElement('style');
            if (style.style.cssText) {
                style.style.cssText = css;
            }
            else {
                style.appendChild(document.createTextNode(css));
            }
            document.getElementsByTagName('head')[0].appendChild(style);
        };
        HelperMethods.IsVeryDark = function (backColor) {
            backColor = backColor.substring(1);
            var r = parseInt(backColor.substr(0, 2), 16);
            var g = parseInt(backColor.substr(2, 2), 16);
            var b = parseInt(backColor.substr(4, 2), 16);
            var contrast = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            return contrast <= 60;
        };
        HelperMethods.GetHighlightColorCode = function (highlightColor) {
            var color = "#ffffff";
            switch (highlightColor) {
                case HighlightColor.Yellow:
                    color = "#ffff00";
                    break;
                case HighlightColor.BrightGreen:
                    color = "#00ff00";
                    break;
                case HighlightColor.Turquoise:
                    color = "#00ffff";
                    break;
                case HighlightColor.Pink:
                    color = "#ff00ff";
                    break;
                case HighlightColor.Blue:
                    color = "#0000ff";
                    break;
                case HighlightColor.Red:
                    color = "#ff0000";
                    break;
                case HighlightColor.DarkBlue:
                    color = "#000080";
                    break;
                case HighlightColor.Teal:
                    color = "#008080";
                    break;
                case HighlightColor.Green:
                    color = "#008000";
                    break;
                case HighlightColor.Violet:
                    color = "#800080";
                    break;
                case HighlightColor.DarkRed:
                    color = "#800000";
                    break;
                case HighlightColor.DarkYellow:
                    color = "#808000";
                    break;
                case HighlightColor.Gray50:
                    color = "#808080";
                    break;
                case HighlightColor.Gray25:
                    color = "#c0c0c0";
                    break;
                case HighlightColor.Black:
                    color = "#000000";
                    break;
            }
            return color;
        };
        HelperMethods.IndexOfAny = function (txt, WordSplitCharacter) {
            for (var i = 0; i < txt.length; i++) {
                for (var j = 0; j < WordSplitCharacter.length - 1; j++) {
                    if (txt[i] == WordSplitCharacter[j])
                        return i;
                }
            }
            return -1;
        };
        HelperMethods.LastIndexOfAny = function (txt, WordSplitCharacter) {
            for (var i = txt.length - 1; i >= 0; i--) {
                for (var j = 0; j <= WordSplitCharacter.length - 1; j++) {
                    if (txt[i] == WordSplitCharacter[j])
                        return i;
                }
            }
            return -1;
        };
        HelperMethods.GetHtmlTextAlign = function (alignment) {
            switch (alignment) {
                case TextAlignment.Center:
                    return "center";
                case TextAlignment.Right:
                    return "right";
                case TextAlignment.Justify:
                    return "justify";
                default:
                    return "left";
            }
        };
        HelperMethods.WORD_BEFORE = "(?<=^|\W|\t)";
        HelperMethods.WORD_AFTER = "(?=$|\W|\t)";
        return HelperMethods;
    }());
    DocumentEditorFeatures.HelperMethods = HelperMethods;
    var CssConstants = (function () {
        function CssConstants() {
        }
        Object.defineProperty(CssConstants, "Maroon", {
            get: function () { return "maroon"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Red", {
            get: function () { return "red"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Orange", {
            get: function () { return "orange"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Yellow", {
            get: function () { return "yellow"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Olive", {
            get: function () { return "olive"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Fuchsia", {
            get: function () { return "fuchsia"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Lime", {
            get: function () { return "lime"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "White", {
            get: function () { return "white"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Green", {
            get: function () { return "green"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Navy", {
            get: function () { return "navy"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Blue", {
            get: function () { return "blue"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Aqua", {
            get: function () { return "aqua"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Teal", {
            get: function () { return "teal"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Black", {
            get: function () { return "black"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Silver", {
            get: function () { return "silver"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Gray", {
            get: function () { return "gray"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Purple", {
            get: function () { return "purple"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "XXSmall", {
            get: function () { return "xx-small"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "XSmall", {
            get: function () { return "x-small"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Medium", {
            get: function () { return "medium"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "XLarge", {
            get: function () { return "x-large"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "XXLarge", {
            get: function () { return "xx-large"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Small", {
            get: function () { return "small"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Smaller", {
            get: function () { return "smaller"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Larger", {
            get: function () { return "bigger"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Large", {
            get: function () { return "large"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Underline", {
            get: function () { return "underline"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "LineThrough", {
            get: function () { return "line-through"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "LineHeight", {
            get: function () { return "line-height"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "SubScript", {
            get: function () { return "sub"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "SuperScript", {
            get: function () { return "super"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Font", {
            get: function () { return "font"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "LeftIndent", {
            get: function () { return "left-indent"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "TextIndent", {
            get: function () { return "text-indent"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "FontFamily", {
            get: function () { return "font-family"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "FontSize", {
            get: function () { return "font-size"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "FontStyle", {
            get: function () { return "font-style"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "FontWeight", {
            get: function () { return "font-weight"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "TextDecoration", {
            get: function () { return "text-decoration"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "TextAlign", {
            get: function () { return "text-align"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "SubSuperScripts", {
            get: function () { return "vertical-align"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Background", {
            get: function () { return "background-color"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Color", {
            get: function () { return "color"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "HyperlinkColor", {
            get: function () { return "hyperlinkcolor"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Baseline", {
            get: function () { return "baseline"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "ListType", {
            get: function () { return "listType"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Margin", {
            get: function () { return "margin"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Border", {
            get: function () { return "border"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "BgColor", {
            get: function () { return "bgcolor"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Align", {
            get: function () { return "align"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Cm", {
            get: function () { return "cm"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Mm", {
            get: function () { return "mm"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Px", {
            get: function () { return "px"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "In", {
            get: function () { return "in"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Ex", {
            get: function () { return "ex"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Em", {
            get: function () { return "em"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Pt", {
            get: function () { return "pt"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Pc", {
            get: function () { return "pc"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CssConstants, "Percentage", {
            get: function () { return "%"; },
            enumerable: true,
            configurable: true
        });
        return CssConstants;
    }());
    DocumentEditorFeatures.CssConstants = CssConstants;
    var HTMLOperators = (function () {
        function HTMLOperators() {
        }
        Object.defineProperty(HTMLOperators, "Dot", {
            get: function () { return "."; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HTMLOperators, "OpenBrace", {
            get: function () { return "{"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HTMLOperators, "CloseBrace", {
            get: function () { return "}"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HTMLOperators, "Colon", {
            get: function () { return ":"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HTMLOperators, "SemiColon", {
            get: function () { return ";"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HTMLOperators, "Equal", {
            get: function () { return "="; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HTMLOperators, "Quotes", {
            get: function () { return "\""; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HTMLOperators, "LessthanSymbol", {
            get: function () { return "<"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HTMLOperators, "GreaterthanSymbol", {
            get: function () { return ">"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HTMLOperators, "Endslash", {
            get: function () { return "/"; },
            enumerable: true,
            configurable: true
        });
        return HTMLOperators;
    }());
    DocumentEditorFeatures.HTMLOperators = HTMLOperators;
    var HtmlAsciiCodesInfo = (function () {
        function HtmlAsciiCodesInfo() {
        }
        Object.defineProperty(HtmlAsciiCodesInfo, "HtmlAsciiCodeTable", {
            get: function () {
                if (HtmlAsciiCodesInfo.htmlAsciiCodeTable == null) {
                    HtmlAsciiCodesInfo.htmlAsciiCodeTable = new Dictionary();
                    HtmlAsciiCodesInfo.htmlNameTable = new Dictionary();
                    HtmlAsciiCodesInfo.AddHtmlAsciiSymbols();
                    HtmlAsciiCodesInfo.AddHtmlNames();
                }
                return HtmlAsciiCodesInfo.htmlAsciiCodeTable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HtmlAsciiCodesInfo, "HtmlNameTable", {
            get: function () {
                if (HtmlAsciiCodesInfo.htmlNameTable == null) {
                    HtmlAsciiCodesInfo.htmlAsciiCodeTable = new Dictionary();
                    HtmlAsciiCodesInfo.htmlNameTable = new Dictionary();
                    HtmlAsciiCodesInfo.AddHtmlAsciiSymbols();
                    HtmlAsciiCodesInfo.AddHtmlNames();
                }
                return HtmlAsciiCodesInfo.htmlNameTable;
            },
            enumerable: true,
            configurable: true
        });
        HtmlAsciiCodesInfo.AddHtmlAsciiSymbols = function () {
            var HtmlCodeSymbols = new Array();
            HtmlCodeSymbols = [" ", "\"\"", "!", "#", "$", "%", "&", "'", "(", ")", "*", " +", ", ", " - ", ".", "/ ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", " < ", "=", " > ", " ? ", "@",
                "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\"", "]", "^", "_", "`",
                "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", " ", "¡", "¢", "£", "¤",
                "¥", "¦", "§", "¨", "©", "ª", "«", "¬", "", "­®", "¯", "°", "±", "²", "³", "´", "µ", "¶", "•", "¸", "¹", "º", "»", "¼", "½", "¾", "¿", "À", "Á", "Â", "Ã", "Ä", "Å", "Æ",
                "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï", "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ß", "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è",
                "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "÷", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ", "Œ", "œ", "Š", "š", "Ÿ", "ƒ", "–", "—", "‘", "’", "‚",
                "“", "”", "„", "†", "‡", "•", "…", "‰", "€", "™"];
            var j = -1;
            for (var i = 32; i <= 8482; i++) {
                if ((i > 126 && i < 160) || (i > 255 && i < 338) || (i > 339 && i < 352) || (i > 353 && i < 376) || (i > 376 && i < 402) || (i > 402 && i < 8211) || (i > 8212 && i < 8216)
                    || i == 8219 || i == 8223 || (i > 8226 && i < 8230) || (i > 8230 && i < 8240) || (i > 8240 && i < 8364) || (i > 8364 && i < 8482))
                    continue;
                else {
                    j++;
                    if (j < HtmlCodeSymbols.length)
                        HtmlAsciiCodesInfo.HtmlAsciiCodeTable.Add("&#" + i + ";", HtmlCodeSymbols[j]);
                }
            }
        };
        HtmlAsciiCodesInfo.AddHtmlNames = function () {
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&nbsp;", " ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&emsp;", "\t");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&#160;", " ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&lt;", "<");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&gt;", ">");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&amp;", "&");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&quot;", "\"");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&iexcl;", "¡");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&cent;", "¢");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&pound;", "£");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&curren;", "¤");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&yen;", "¥");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&brvbar;", "¦");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&sect;", "§");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&uml;", "¨");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&copy;", "©");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&ordf;", "ª");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&laquo;", "«");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&not;", "¬");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&reg;", "­®");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&macr;", "¯");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&deg;", "°");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&plusmn;", "±");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&sup2;", "²");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&sup3;", "³");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&acute;", "´");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&micro;", "µ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&para;", "¶");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&middot;", "·");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&cedil;", "¸");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&sup1;", "¹");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&ordm;", "º");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&raquo;", "»");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&frac14;", "¼");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&frac12;", "½");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&frac34;", "¾");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&iquest;", "¿");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Agrave;", "À");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Aacute;", "Á");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Acirc;", "Â");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Atilde;", "Ã");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Auml;", "Ä");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Aring;", "Å");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&AElig;", "Æ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Ccedil;", "Ç");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Egrave;", "È");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Eacute;", "É");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Ecirc;", "Ê");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Euml;", "Ë");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Igrave;", "Ì");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Iacute;", "Í");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Icirc;", "Î");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Iuml;", "Ï");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&ETH;", "Ð");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Ntilde;", "Ñ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Ograve;", "Ò");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Oacute;", "Ó");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Ocirc;", "Ô");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Otilde;", "Õ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Ouml;", "Ö");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&times;", "×");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Oslash;", "Ø");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Ugrave;", "Ù");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Uacute;", "Ú");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Ucirc;", "Û");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Uuml;", "Ü");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Yacute;", "Ý");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&THORN;", "Þ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&szlig;", "ß");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&agrave;", "à");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&aacute;", "á");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&acirc;", "â");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&atilde;", "ã");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&auml;", "ä");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&aring;", "å");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&aelig;", "æ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&ccedil;", "ç");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&egrave;", "è");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&eacute;", "é");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&ecirc;", "ê");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&euml;", "ë");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&igrave;", "ì");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&iacute;", "í");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&icirc;", "î");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&iuml;", "ï");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&eth;", "ð");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&ntilde;", "ñ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&ograve;", "ò");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&oacute;", "ó");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&ocirc;", "ô");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&otilde;", "õ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&ouml;", "ö");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&divide;", "÷");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&oslash;", "ø");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&ugrave;", "ù");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&uacute;", "ú");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&ucirc;", "û");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&uuml;", "ü");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&yacute;", "ý");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&thorn;", "þ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&yuml;", "ÿ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&OElig;", "Œ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&oelig;", "œ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Scaron;", "Š");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&scaron;", "š");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&Yuml;", "Ÿ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&fnof;", "ƒ");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&ndash;", "–");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&mdash;", "—");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&lsquo;", "‘");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&rsquo;", "’");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&ldquo;", "“");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&rdquo;", "”");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&bdquo;", "„");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&dagger;", "†");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&ddagger;", "‡");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&bullet;", "•");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&hellip;", "…");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&permil;", "‰");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&trade;", "™");
            HtmlAsciiCodesInfo.HtmlNameTable.Add("&euro;", "€");
        };
        HtmlAsciiCodesInfo.htmlAsciiCodeTable = null;
        HtmlAsciiCodesInfo.htmlNameTable = null;
        return HtmlAsciiCodesInfo;
    }());
    DocumentEditorFeatures.HtmlAsciiCodesInfo = HtmlAsciiCodesInfo;
    var List = (function (_super) {
        __extends(List, _super);
        function List() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(List.prototype, "Count", {
            get: function () {
                if (this.length != undefined && this.length != null)
                    return this.length;
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        List.prototype.Add = function (item) {
            if (true) {
                _super.prototype.push.call(this, item);
                return 1;
            }
        };
        List.prototype.Insert = function (index, item) {
            if (index == this.length) {
                this.Add(item);
                return;
            }
            if (index > -1 && index < this.length) {
                this.shiftItems(index, true);
                this[index] = item;
                this.length = this.length + 1;
            }
        };
        List.prototype.Remove = function (item) {
            var index = this.indexOf(item);
            if (index > -1 && index < this.length) {
                this.shiftItems(index, false);
                _super.prototype.pop.call(this);
                return true;
            }
            return false;
        };
        List.prototype.RemoveAt = function (index) {
            if (index > -1 && index < this.length) {
                var node = this[index];
                this.shiftItems(index, false);
                _super.prototype.pop.call(this);
                return true;
            }
            return false;
        };
        List.prototype.Contains = function (item) {
            var index = this.indexOf(item);
            return index > -1 && index < this.length;
        };
        List.prototype.Clear = function () {
            for (var i = this.length; i > 0; i--) {
                this.RemoveAt(i - 1);
            }
        };
        List.prototype.ToList = function () {
            var list = new List();
            for (var i = 0; i < this.length; i++) {
                list.Add(this[i]);
            }
            return list;
        };
        List.prototype.IndexOf = function (item) {
            return this.indexOf(item);
        };
        List.prototype.First = function () {
            if (this.length > 0)
                return this[0];
            return null;
        };
        List.prototype.Last = function () {
            if (this.length > 0)
                return this[this.length - 1];
            return null;
        };
        List.prototype.shiftItems = function (index, forward) {
            if (forward) {
                for (var i = this.length; i > index; i--) {
                    this[i] = this[i - 1];
                }
            }
            else {
                for (var i = index; i < this.length - 1; i++) {
                    this[i] = this[i + 1];
                }
            }
        };
        List.prototype.Sort = function () {
            _super.prototype.sort.call(this, function (a, b) {
                return a - b;
            });
        };
        return List;
    }(Array));
    DocumentEditorFeatures.List = List;
    var Dictionary = (function () {
        function Dictionary() {
            this.keys = new List();
            this.values = new List();
        }
        Object.defineProperty(Dictionary.prototype, "Count", {
            get: function () {
                return this.keys.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dictionary.prototype, "Keys", {
            get: function () {
                return this.keys.ToList();
            },
            enumerable: true,
            configurable: true
        });
        Dictionary.prototype.Add = function (key, value) {
            if (key == undefined || key == null || value == undefined || value == null)
                throw new ReferenceError("Provided key or value is not valid.");
            var index = this.keys.indexOf(key);
            if (index < 0 || index > this.keys.length - 1) {
                this.keys.Add(key);
                this.values.Add(value);
                return 1;
            }
            else {
                throw new RangeError("An item with the same key has already been added.");
            }
        };
        Dictionary.prototype.Get = function (key) {
            if (key == undefined || key == null)
                throw new ReferenceError("Provided key is not valid.");
            var index = this.keys.indexOf(key);
            if (index < 0 || index > this.keys.length - 1) {
                throw new RangeError("No item with the specified key has been added.");
            }
            else {
                return this.values[index];
            }
        };
        Dictionary.prototype.Set = function (key, value) {
            if (key == undefined || key == null)
                throw new ReferenceError("Provided key is not valid.");
            var index = this.keys.indexOf(key);
            if (index < 0 || index > this.keys.length - 1) {
                throw new RangeError("No item with the specified key has been added.");
            }
            else {
                this.values[index] = value;
            }
        };
        Dictionary.prototype.Remove = function (key) {
            if (key == undefined || key == null)
                throw new ReferenceError("Provided key is not valid.");
            var index = this.keys.indexOf(key);
            if (index < 0 || index > this.keys.length - 1) {
                throw new RangeError("No item with the specified key has been added.");
            }
            else {
                this.keys.RemoveAt(index);
                this.values.RemoveAt(index);
                return true;
            }
        };
        Dictionary.prototype.ContainsKey = function (key) {
            if (key == undefined || key == null)
                throw new ReferenceError("Provided key is not valid.");
            var index = this.keys.indexOf(key);
            if (index < 0 || index > this.keys.length - 1) {
                return false;
            }
            return true;
        };
        Dictionary.prototype.Clear = function () {
            this.keys.Clear();
            this.values.Clear();
        };
        return Dictionary;
    }());
    DocumentEditorFeatures.Dictionary = Dictionary;
    var ElementCollection = (function (_super) {
        __extends(ElementCollection, _super);
        function ElementCollection() {
            _super.apply(this, arguments);
            this.maxBaseLineOffset = 0;
            this.maxTextElementHeight = Number.NaN;
            this.maxTextElementBaselineOffset = 0;
            this.SkipClipImage = false;
        }
        Object.defineProperty(ElementCollection.prototype, "MaxBaselineOffset", {
            get: function () {
                return this.maxBaseLineOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementCollection.prototype, "MaxTextElementHeight", {
            get: function () {
                return this.maxTextElementHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementCollection.prototype, "MaxTextElementBaselineOffset", {
            get: function () {
                return this.maxTextElementBaselineOffset;
            },
            enumerable: true,
            configurable: true
        });
        ElementCollection.prototype.push = function (item) {
            return this.Add(item);
        };
        ElementCollection.prototype.Add = function (item) {
            if (item != undefined && item != null) {
                _super.prototype.push.call(this, item);
                this.UpdateMaxElementHeight(item);
                return 1;
            }
        };
        ElementCollection.prototype.Insert = function (index, item) {
            if (index == this.length) {
                this.Add(item);
                return;
            }
            if (index > -1 && index < this.length) {
                this.shiftItems(index, true);
                this[index] = item;
                this.length = this.length + 1;
                this.UpdateMaxElementHeight(item);
            }
        };
        ElementCollection.prototype.Remove = function (item) {
            var index = this.indexOf(item);
            if (index > -1 && index < this.length) {
                this.shiftItems(index, false);
                _super.prototype.pop.call(this);
                return true;
            }
            return false;
        };
        ElementCollection.prototype.RemoveAt = function (index) {
            if (index > -1 && index < this.length) {
                var node = this[index];
                this.shiftItems(index, false);
                _super.prototype.pop.call(this);
                return true;
            }
            return false;
        };
        ElementCollection.prototype.Contains = function (item) {
            var index = this.indexOf(item);
            return index > -1 && index < this.length;
        };
        ElementCollection.prototype.ToList = function () {
            var list = new List();
            for (var i = 0; i < this.length; i++) {
                list.Add(this[i]);
            }
            return list;
        };
        ElementCollection.prototype.Clear = function () {
            _super.prototype.Clear.call(this);
            this.maxBaseLineOffset = 0;
            this.maxTextElementHeight = Number.NaN;
            this.maxTextElementBaselineOffset = 0;
            this.SkipClipImage = false;
        };
        ElementCollection.prototype.UpdateMaxElement = function () {
            this.maxBaseLineOffset = 0;
            this.maxTextElementHeight = Number.NaN;
            this.maxTextElementBaselineOffset = 0;
            for (var i = 0; i < this.Count; i++) {
                this.UpdateMaxElementHeight(this[i]);
            }
        };
        ElementCollection.prototype.UpdateMaxElementHeight = function (element) {
            if (element instanceof TextElementBox || element instanceof ListTextElementBox) {
                if (isNaN(this.maxTextElementHeight))
                    this.maxTextElementHeight = 0;
                if (this.maxTextElementHeight < element.Height) {
                    this.maxTextElementHeight = element.Height;
                    this.maxTextElementBaselineOffset = element instanceof TextElementBox ? element.BaselineOffset : element.BaselineOffset;
                }
                if (this.maxBaseLineOffset < this.maxTextElementBaselineOffset)
                    this.maxBaseLineOffset = this.maxTextElementBaselineOffset;
            }
            else if (this.maxBaseLineOffset < element.Height)
                this.maxBaseLineOffset = element.Height;
        };
        return ElementCollection;
    }(List));
    DocumentEditorFeatures.ElementCollection = ElementCollection;
    var BaseNode = (function () {
        function BaseNode(owner) {
            this.ownerBase = owner;
        }
        Object.defineProperty(BaseNode.prototype, "OwnerBase", {
            get: function () {
                return this.ownerBase;
            },
            enumerable: true,
            configurable: true
        });
        BaseNode.prototype.SetOwner = function (owner) {
            this.ownerBase = owner;
        };
        BaseNode.prototype.SetOwnerBase = function (owner) {
            this.ownerBase = owner;
        };
        return BaseNode;
    }());
    DocumentEditorFeatures.BaseNode = BaseNode;
    var Node = (function (_super) {
        __extends(Node, _super);
        function Node(owner) {
            _super.call(this, owner);
        }
        Object.defineProperty(Node.prototype, "Owner", {
            get: function () {
                return this.OwnerBase;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "NextNode", {
            get: function () {
                if (this.Owner instanceof CompositeNode)
                    return this.Owner.ChildNodes.GetNextNode(this);
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "PreviousNode", {
            get: function () {
                if (this.Owner instanceof CompositeNode)
                    return this.Owner.ChildNodes.GetPreviousNode(this);
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "IsComposite", {
            get: function () {
                return this instanceof CompositeNode;
            },
            enumerable: true,
            configurable: true
        });
        Node.prototype.SetOwner = function (owner) {
            if (this.OwnerBase != owner && this.OwnerBase instanceof CompositeNode) {
                if (this instanceof FieldCharacterAdv) {
                    var instance = this;
                    if (instance.IsLinkedFieldCharacter()) {
                        instance.UnlinkFieldCharacter("", false);
                    }
                    this.OwnerBase.RemoveFieldCharacter(instance);
                    instance.CheckUnlinkFieldCharacter("", false);
                }
                if (this.OwnerBase.ChildNodes.Contains(this)) {
                    this.OwnerBase.ChildNodes.Remove(this);
                }
            }
            this.SetOwnerBase(owner);
            if (owner instanceof CompositeNode) {
                if (this instanceof FieldCharacterAdv) {
                    owner.AttachFieldCharacter(this);
                }
            }
        };
        Node.prototype.GetIndexInOwnerCollection = function () {
            var compositeNode = this.Owner;
            return compositeNode != null ? compositeNode.ChildNodes.indexOf(this) : -1;
        };
        Node.prototype.GetTopLevelOwner = function () {
            var node = this;
            while (node.Owner instanceof Node) {
                node = node.Owner;
                if (node instanceof DocumentAdv)
                    break;
            }
            return node;
        };
        Node.prototype.GetOwnerDocument = function () {
            var node = this.GetTopLevelOwner();
            return node;
        };
        return Node;
    }(BaseNode));
    DocumentEditorFeatures.Node = Node;
    var CompositeNode = (function (_super) {
        __extends(CompositeNode, _super);
        function CompositeNode(owner) {
            _super.call(this, owner);
            this.Fields = new List();
            this.FieldCharacter = new List();
        }
        CompositeNode.prototype.SetOwner = function (owner) {
            if (this.OwnerBase != owner && this.OwnerBase instanceof CompositeNode) {
                if (this.Fields.Count > 0)
                    this.OwnerBase.RemoveFields(this);
                if (this.FieldCharacter.Count > 0)
                    this.OwnerBase.RemoveFieldCharacter(this);
                if (this.OwnerBase.ChildNodes.Contains(this))
                    this.OwnerBase.ChildNodes.Remove(this);
            }
            this.SetOwnerBase(owner);
            if (owner instanceof CompositeNode) {
                if (this.FieldCharacter.Count > 0)
                    this.Owner.AttachFieldCharacter(this);
                if (this.Fields.Count > 0)
                    owner.AddFields(this);
            }
        };
        CompositeNode.prototype.RemoveField = function (field) {
            this.Fields.Remove(field);
            if (this.Owner instanceof CompositeNode && !(this instanceof HeaderFooter))
                this.Owner.RemoveField(field);
        };
        CompositeNode.prototype.RemoveFields = function (compositeNode) {
            if (compositeNode instanceof HeaderFooter)
                return;
            var compositeNodeIndex = compositeNode.GetHierarchicalIndex("");
            for (var i = 0; i < compositeNode.Fields.Count; i++) {
                var field = compositeNode.Fields[i];
                var count = compositeNode.Fields.Count;
                if (field.IsUnlinkFieldCharacters(compositeNodeIndex))
                    field.UnlinkFieldCharacter(compositeNodeIndex, true);
                this.RemoveField(field);
                if (count > compositeNode.Fields.Count)
                    i -= count - compositeNode.Fields.Count;
                if (i < -1)
                    i = -1;
            }
        };
        CompositeNode.prototype.ClearUnlinkedFields = function () {
            var document = this.GetOwnerDocument();
            if (document != null) {
                for (var i = 0; i < this.FieldCharacter.Count; i++) {
                    var FieldChar = this.FieldCharacter[i];
                    FieldChar.OwnerParagraph.Inlines.Remove(FieldChar);
                    this.FieldCharacter.Remove(FieldChar);
                    i--;
                }
            }
        };
        CompositeNode.prototype.AttachFieldCharacter = function (fieldCharacter) {
            if (fieldCharacter instanceof FieldCharacterAdv) {
                if (this.LinkFieldCharacters(fieldCharacter, fieldCharacter)) {
                }
                else {
                    this.AddFieldCharacter(fieldCharacter);
                }
            }
            else if (fieldCharacter instanceof CompositeNode) {
                if (fieldCharacter instanceof HeaderFooter)
                    return;
                for (var i = 0; i < fieldCharacter.FieldCharacter.Count; i++) {
                    var count = fieldCharacter.FieldCharacter.Count;
                    var fieldChar = fieldCharacter.FieldCharacter[i];
                    if (this.LinkFieldCharacters(fieldChar, fieldCharacter)) {
                        if (count > fieldCharacter.FieldCharacter.Count)
                            i -= count - fieldCharacter.FieldCharacter.Count;
                        if (i < -1)
                            i = -1;
                    }
                    else {
                        this.AddFieldCharacter(fieldChar);
                    }
                }
            }
        };
        CompositeNode.prototype.LinkFieldCharacters = function (fieldCharacter, previousNode) {
            var field = { nestingLevel: 0 };
            if (fieldCharacter instanceof FieldBeginAdv) {
                var fieldBegin = fieldCharacter;
                if (fieldBegin.fieldEnd == null)
                    this.LinkFieldTraversingForward(fieldBegin, field, previousNode);
                if (fieldBegin.fieldEnd != null) {
                    fieldBegin.AddToLinkedFields();
                    return true;
                }
            }
            else if (fieldCharacter instanceof FieldSeparatorAdv) {
                var fieldSeparator = fieldCharacter;
                if (fieldSeparator.fieldBegin == null)
                    this.LinkFieldTraversingBackward(fieldSeparator, field, previousNode);
                if (fieldSeparator.fieldBegin != null) {
                    if (fieldSeparator.fieldEnd == null && this.LinkFieldTraversingForward(fieldSeparator.fieldBegin, field, previousNode))
                        fieldSeparator.fieldEnd = fieldSeparator.fieldBegin.fieldEnd;
                    if (fieldSeparator.fieldEnd != null) {
                        fieldSeparator.fieldBegin.AddToLinkedFields();
                        return true;
                    }
                }
            }
            else if (fieldCharacter instanceof FieldEndAdv) {
                var fieldEnd = fieldCharacter;
                if (fieldEnd.fieldBegin == null)
                    this.LinkFieldTraversingBackward(fieldEnd, field, previousNode);
                if (fieldEnd.fieldBegin != null) {
                    fieldEnd.fieldBegin.AddToLinkedFields();
                    return true;
                }
            }
            return false;
        };
        CompositeNode.prototype.LinkFieldTraversingForward = function (fieldBegin, fieldNestingLevel, previousNode) {
            var index = 0;
            if (this.ChildNodes.indexOf(previousNode) != -1)
                index = this.ChildNodes.indexOf(previousNode) + 1;
            for (var i = index; i < this.ChildNodes.length; i++) {
                var childNode = this.ChildNodes[i];
                if (childNode instanceof CompositeNode) {
                    var isEndReached = childNode.LinkFieldTraversingForward(fieldBegin, fieldNestingLevel, null);
                    if (fieldBegin.fieldEnd != null || isEndReached)
                        return true;
                }
                else {
                    if (childNode instanceof FieldCharacterAdv) {
                        if (childNode instanceof FieldBeginAdv && fieldBegin != childNode)
                            fieldNestingLevel.nestingLevel++;
                        if (childNode instanceof FieldEndAdv) {
                            if (fieldNestingLevel.nestingLevel == 0) {
                                if (childNode.fieldBegin == null)
                                    fieldBegin.fieldEnd = childNode;
                                return fieldBegin.fieldEnd != null;
                            }
                            else
                                fieldNestingLevel.nestingLevel--;
                        }
                        else if (fieldNestingLevel.nestingLevel == 0 && fieldBegin.fieldSeparator == null) {
                            if (childNode instanceof FieldSeparatorAdv) {
                                if (childNode.fieldBegin == null) {
                                    fieldBegin.fieldSeparator = childNode;
                                    if (childNode.fieldEnd != null) {
                                        fieldBegin.fieldEnd = childNode.fieldEnd;
                                        return true;
                                    }
                                }
                                else
                                    return false;
                            }
                        }
                    }
                }
            }
            if (this.Owner instanceof CompositeNode && !(this instanceof HeaderFooter))
                return this.Owner.LinkFieldTraversingForward(fieldBegin, fieldNestingLevel, this);
            else
                return true;
        };
        CompositeNode.prototype.LinkFieldTraversingBackward = function (fieldCharacter, fieldNestingLevel, previousNode) {
            if (fieldCharacter instanceof FieldEndAdv) {
                var fieldEnd = fieldCharacter;
                var index = this.ChildNodes.length - 1;
                if (this.ChildNodes.indexOf(previousNode) != -1) {
                    index = this.ChildNodes.indexOf(previousNode) - 1;
                }
                for (var i = index; i >= 0; i--) {
                    var childNode = this.ChildNodes[i];
                    if (childNode instanceof CompositeNode) {
                        var isDocumentStartReached = childNode.LinkFieldTraversingBackward(fieldEnd, fieldNestingLevel, null);
                        if (fieldEnd.fieldBegin != null || isDocumentStartReached)
                            return true;
                    }
                    else {
                        if (childNode instanceof FieldCharacterAdv) {
                            if (childNode instanceof FieldEndAdv && fieldEnd != childNode)
                                fieldNestingLevel.nestingLevel++;
                            if (childNode instanceof FieldBeginAdv) {
                                if (fieldNestingLevel.nestingLevel == 0) {
                                    if (childNode.fieldEnd == null)
                                        fieldEnd.fieldBegin = childNode;
                                    return fieldEnd.fieldBegin != null;
                                }
                                else
                                    fieldNestingLevel.nestingLevel--;
                            }
                            else if (fieldNestingLevel.nestingLevel == 0) {
                                if (childNode.fieldEnd == null) {
                                    fieldEnd.fieldSeparator = childNode;
                                    if (childNode.fieldBegin != null) {
                                        fieldEnd.fieldBegin = childNode.fieldBegin;
                                        return true;
                                    }
                                }
                                else
                                    return false;
                            }
                        }
                    }
                }
                if (this.Owner instanceof CompositeNode && !(this instanceof HeaderFooter))
                    return this.Owner.LinkFieldTraversingBackward(fieldEnd, fieldNestingLevel, this);
                else
                    return true;
            }
            else if (fieldCharacter instanceof FieldSeparatorAdv) {
                var fieldSeparator = fieldCharacter;
                var index = this.ChildNodes.length - 1;
                if (this.ChildNodes.indexOf(previousNode) != -1)
                    index = this.ChildNodes.indexOf(previousNode) - 1;
                for (var i = index; i >= 0; i--) {
                    var childNode = this.ChildNodes[i];
                    if (childNode instanceof CompositeNode) {
                        var isDocumentStartReached = childNode.LinkFieldTraversingBackward(fieldSeparator, fieldNestingLevel, null);
                        if (fieldSeparator.fieldBegin != null || isDocumentStartReached)
                            return true;
                    }
                    else {
                        if (childNode instanceof FieldCharacterAdv) {
                            if (childNode instanceof FieldEndAdv)
                                fieldNestingLevel.nestingLevel++;
                            if (childNode instanceof FieldBeginAdv) {
                                if (fieldNestingLevel.nestingLevel == 0) {
                                    if (childNode.fieldSeparator == null)
                                        fieldSeparator.fieldBegin = childNode;
                                    return fieldSeparator.fieldBegin != null;
                                }
                                else
                                    fieldNestingLevel.nestingLevel--;
                            }
                            else if (fieldNestingLevel.nestingLevel == 0)
                                return false;
                        }
                    }
                }
                if (this.Owner instanceof CompositeNode && !(this instanceof HeaderFooter))
                    return this.Owner.LinkFieldTraversingBackward(fieldSeparator, fieldNestingLevel, this);
                else
                    return true;
            }
        };
        CompositeNode.prototype.AddFields = function (fieldBegin) {
            if (fieldBegin instanceof FieldBeginAdv) {
                this.Fields.Add(fieldBegin);
                if (this.Owner instanceof CompositeNode && !(this instanceof HeaderFooter))
                    this.Owner.AddFields(fieldBegin);
            }
            else if (fieldBegin instanceof CompositeNode) {
                if (fieldBegin instanceof HeaderFooter)
                    return;
                for (var i = 0; i < fieldBegin.Fields.Count; i++) {
                    this.AddFields(fieldBegin.Fields[i]);
                }
            }
        };
        CompositeNode.prototype.AddFieldCharacter = function (fieldCharacter) {
            if (fieldCharacter instanceof FieldCharacterAdv) {
                this.FieldCharacter.Add(fieldCharacter);
                if (this.Owner instanceof CompositeNode && !(this instanceof HeaderFooter))
                    this.Owner.AttachFieldCharacter(fieldCharacter);
            }
            else if (fieldCharacter instanceof CompositeNode) {
                if (fieldCharacter instanceof HeaderFooter)
                    return;
                for (var i = 0; i < fieldCharacter.FieldCharacter.Count; i++) {
                    this.AddFieldCharacter(fieldCharacter.FieldCharacter[i]);
                }
            }
        };
        CompositeNode.prototype.RemoveFieldCharacter = function (fieldCharacter) {
            if (fieldCharacter instanceof FieldCharacterAdv) {
                if (this.FieldCharacter.Contains(fieldCharacter)) {
                    this.FieldCharacter.Remove(fieldCharacter);
                    if (this.Owner instanceof CompositeNode && !(this instanceof HeaderFooter))
                        this.Owner.RemoveFieldCharacter(fieldCharacter);
                }
            }
            else if (fieldCharacter instanceof CompositeNode) {
                if (fieldCharacter instanceof HeaderFooter)
                    return;
                var compositeNodeIndex = fieldCharacter.GetHierarchicalIndex("");
                for (var i = 0; i < fieldCharacter.FieldCharacter.Count; i++) {
                    var fieldChar = fieldCharacter.FieldCharacter[i];
                    var count = fieldCharacter.FieldCharacter.Count;
                    fieldChar.CheckUnlinkFieldCharacter(compositeNodeIndex, true);
                    this.RemoveFieldCharacter(fieldChar);
                    if (count > fieldCharacter.FieldCharacter.Count)
                        i -= count - fieldCharacter.FieldCharacter.Count;
                    if (i < -1)
                        i = -1;
                }
            }
        };
        CompositeNode.prototype.GetHierarchicalIndex = function (hierarchicalIndex) {
            if (this.Owner instanceof CompositeNode) {
                if (this instanceof HeaderFooters)
                    hierarchicalIndex = "HF;" + hierarchicalIndex;
                else
                    hierarchicalIndex = this.GetIndexInOwnerCollection() + ";" + hierarchicalIndex;
                if (!(this.Owner instanceof DocumentAdv))
                    return this.Owner.GetHierarchicalIndex(hierarchicalIndex);
            }
            return hierarchicalIndex;
        };
        CompositeNode.prototype.GetFieldCode = function (fieldBegin, isNestedFieldCode, isFieldCodeParsed, previousNode) {
            var fieldCode = "";
            var index = 0;
            if (this.ChildNodes.Contains(previousNode))
                index = this.ChildNodes.IndexOf(previousNode) + 1;
            for (var i = index; i < this.ChildNodes.Count; i++) {
                var childNode = this.ChildNodes[i];
                if (childNode instanceof CompositeNode) {
                    fieldCode += childNode.GetFieldCode(fieldBegin, isNestedFieldCode, isFieldCodeParsed, null);
                    if (isFieldCodeParsed)
                        return fieldCode;
                }
                else {
                    if (childNode instanceof FieldCharacterAdv) {
                        if (childNode instanceof FieldBeginAdv)
                            isNestedFieldCode = (fieldBegin.fieldEnd != null && fieldBegin != childNode);
                        if (childNode instanceof FieldEndAdv) {
                            if (fieldBegin.fieldEnd == childNode) {
                                isFieldCodeParsed = true;
                                return fieldCode;
                            }
                            else
                                isNestedFieldCode = false;
                        }
                        else if (childNode instanceof FieldSeparatorAdv) {
                            if (fieldBegin.fieldSeparator == childNode) {
                                isFieldCodeParsed = true;
                                return fieldCode;
                            }
                            else
                                isNestedFieldCode = false;
                        }
                    }
                    else if (childNode instanceof SpanAdv && !isNestedFieldCode)
                        fieldCode += childNode.Text;
                }
            }
            if (this.Owner instanceof CompositeNode && !(this instanceof HeaderFooter))
                fieldCode += this.Owner.GetFieldCode(fieldBegin, isNestedFieldCode, isFieldCodeParsed, this);
            return fieldCode;
        };
        CompositeNode.prototype.GetHyperlinkField = function (inline, CheckedFields) {
            for (var i = 0; i < this.Fields.length; i++) {
                if (CheckedFields.Contains(this.Fields[i]) || this.Fields[i].fieldSeparator == null)
                    continue;
                else
                    CheckedFields.Add(this.Fields[i]);
                var fieldCode = this.Fields[i].GetFieldCode();
                fieldCode = fieldCode.trim().toLowerCase();
                if (fieldCode.match("hyperlink ") && this.Fields[i].InlineIsInFieldResult(inline))
                    return this.Fields[i];
            }
            if (this.Owner instanceof CompositeNode && !(this instanceof HeaderFooter))
                return this.Owner.GetHyperlinkField(inline, CheckedFields);
            return null;
        };
        CompositeNode.prototype.GetHyperlinkFields = function (paragraph, CheckedFields) {
            for (var i = 0; i < this.Fields.length; i++) {
                if (CheckedFields.Contains(this.Fields[i]) || this.Fields[i].fieldSeparator == null)
                    continue;
                else
                    CheckedFields.Add(this.Fields[i]);
                var fieldCode = this.Fields[i].GetFieldCode();
                fieldCode = fieldCode.trim().toLowerCase();
                if (fieldCode.match("hyperlink ") && this.Fields[i].ParagraphIsInFieldResult(paragraph))
                    return this.Fields[i];
            }
            if (this.Owner instanceof CompositeNode && !(this instanceof HeaderFooter))
                return this.Owner.GetHyperlinkFields(paragraph, CheckedFields);
            return null;
        };
        CompositeNode.prototype.GetParagraph = function (position) {
            if (position.Index == null || position.Index == undefined)
                return null;
            var ins = this;
            var index = position.Index.indexOf(";");
            var value = "0";
            if (index >= 0) {
                value = position.Index.substring(0, index);
                position.Index = position.Index.substring(index).replace(";", "");
            }
            if (this instanceof SectionAdv && value == "HF")
                return ins.HeaderFooters.GetParagraph(position);
            index = parseInt(value);
            if (this instanceof TableRowAdv && index >= this.ChildNodes.Count) {
                position.Index = "0;0";
                index = this.ChildNodes.Count - 1;
            }
            if (index >= 0 && index < this.ChildNodes.Count) {
                var child = this.ChildNodes[index];
                if (child instanceof ParagraphAdv) {
                    if (position.Index.indexOf("C;") > 0) {
                        var paragraph = child;
                        index = position.Index.indexOf(";");
                        value = position.Index.substring(0, index);
                        position.Index = position.Index.substring(index + 2).replace(";", "");
                        var indexInInline = 0;
                        var inlineObj = paragraph.GetInline(parseFloat(value), indexInInline);
                        var inline = inlineObj.inline;
                        index = inlineObj.index;
                        if (indexInInline == inline.Length)
                            inline = inline.NextNode;
                    }
                    if (position.Index.indexOf(";") > 0)
                        position.Index = "0";
                    return child;
                }
                if (child instanceof CompositeNode) {
                    if (position.Index.indexOf(";") > 0)
                        return child.GetParagraph(position);
                    else {
                        if (child instanceof TableAdv)
                            return child.GetFirstParagraphInFirstCell();
                        return null;
                    }
                }
            }
            else if (this.NextNode instanceof CompositeNode) {
                position = "0";
                if (this.NextNode instanceof TableAdv)
                    return this.NextNode.GetFirstParagraphInFirstCell();
                return this.NextNode;
            }
            return null;
        };
        return CompositeNode;
    }(Node));
    DocumentEditorFeatures.CompositeNode = CompositeNode;
    var ObservableCollection = (function (_super) {
        __extends(ObservableCollection, _super);
        function ObservableCollection() {
            _super.apply(this, arguments);
            this.notifyCollectionChanged = false;
        }
        Object.defineProperty(ObservableCollection.prototype, "NotifyCollectionChanged", {
            get: function () {
                return this.notifyCollectionChanged;
            },
            set: function (value) {
                this.notifyCollectionChanged = value;
            },
            enumerable: true,
            configurable: true
        });
        ObservableCollection.prototype.push = function (item) {
            if (item != null && item != undefined) {
                _super.prototype.push.call(this, item);
                if (this.NotifyCollectionChanged)
                    this.CollectionChanged(item, true);
                return 1;
            }
            return 0;
        };
        ObservableCollection.prototype.Add = function (item) {
            if (item != null && item != undefined)
                _super.prototype.push.call(this, item);
            if (this.NotifyCollectionChanged)
                this.CollectionChanged(item, true);
            return 1;
        };
        ObservableCollection.prototype.Insert = function (index, item) {
            if (index == this.length) {
                this.Add(item);
                return;
            }
            if (index > -1 && index < this.length) {
                this.shiftItems(index, true);
                this[index] = item;
                this.length = this.length + 1;
                if (this.CollectionChanged)
                    this.CollectionChanged(item, true);
            }
        };
        ObservableCollection.prototype.Remove = function (item) {
            var index = this.indexOf(item);
            if (index > -1 && index < this.length) {
                this.shiftItems(index, false);
                _super.prototype.pop.call(this);
                if (this.CollectionChanged)
                    this.CollectionChanged(item, false);
                return true;
            }
            return false;
        };
        ObservableCollection.prototype.RemoveAt = function (index) {
            if (index > -1 && index < this.length) {
                var item = this[index];
                this.shiftItems(index, false);
                _super.prototype.pop.call(this);
                if (this.CollectionChanged)
                    this.CollectionChanged(item, false);
                return true;
            }
            return false;
        };
        return ObservableCollection;
    }(List));
    DocumentEditorFeatures.ObservableCollection = ObservableCollection;
    var BaseNodeCollection = (function (_super) {
        __extends(BaseNodeCollection, _super);
        function BaseNodeCollection(owner) {
            _super.call(this);
            this.ownerBase = owner;
            this.NotifyCollectionChanged = true;
        }
        Object.defineProperty(BaseNodeCollection.prototype, "OwnerBase", {
            get: function () {
                return this.ownerBase;
            },
            enumerable: true,
            configurable: true
        });
        BaseNodeCollection.prototype.push = function (node) {
            if ((this instanceof ListAdvCollection && node instanceof ListAdv)
                || (this instanceof AbstractListAdvCollection && node instanceof AbstractListAdv)
                || (this instanceof ListLevelAdvCollection && node instanceof ListLevelAdv)
                || (this instanceof LevelOverrideAdvCollection && node instanceof LevelOverrideAdv)) {
                _super.prototype.push.call(this, node);
                return 1;
            }
            return 0;
        };
        BaseNodeCollection.prototype.Add = function (node) {
            if ((this instanceof ListAdvCollection && node instanceof ListAdv)
                || (this instanceof AbstractListAdvCollection && node instanceof AbstractListAdv)
                || (this instanceof ListLevelAdvCollection && node instanceof ListLevelAdv)
                || (this instanceof LevelOverrideAdvCollection && node instanceof LevelOverrideAdv)) {
                _super.prototype.push.call(this, node);
                return 1;
            }
            return 0;
        };
        BaseNodeCollection.prototype.CollectionChanged = function (baseNode, added) {
            if (added) {
                baseNode.SetOwnerBase(this.ownerBase);
            }
            else {
                if (baseNode instanceof BaseNode)
                    baseNode.SetOwnerBase(null);
            }
        };
        BaseNodeCollection.prototype.Dispose = function () {
            this.ownerBase = null;
            this.NotifyCollectionChanged = false;
        };
        return BaseNodeCollection;
    }(ObservableCollection));
    DocumentEditorFeatures.BaseNodeCollection = BaseNodeCollection;
    var ListAdvCollection = (function (_super) {
        __extends(ListAdvCollection, _super);
        function ListAdvCollection() {
            _super.apply(this, arguments);
        }
        return ListAdvCollection;
    }(BaseNodeCollection));
    DocumentEditorFeatures.ListAdvCollection = ListAdvCollection;
    var AbstractListAdvCollection = (function (_super) {
        __extends(AbstractListAdvCollection, _super);
        function AbstractListAdvCollection() {
            _super.apply(this, arguments);
        }
        return AbstractListAdvCollection;
    }(BaseNodeCollection));
    DocumentEditorFeatures.AbstractListAdvCollection = AbstractListAdvCollection;
    var ListLevelAdvCollection = (function (_super) {
        __extends(ListLevelAdvCollection, _super);
        function ListLevelAdvCollection() {
            _super.apply(this, arguments);
        }
        return ListLevelAdvCollection;
    }(BaseNodeCollection));
    DocumentEditorFeatures.ListLevelAdvCollection = ListLevelAdvCollection;
    var LevelOverrideAdvCollection = (function (_super) {
        __extends(LevelOverrideAdvCollection, _super);
        function LevelOverrideAdvCollection() {
            _super.apply(this, arguments);
        }
        LevelOverrideAdvCollection.prototype.Get = function (levelNumber) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] instanceof LevelOverrideAdv) {
                    var levelOverride = this[i];
                    if (levelOverride.LevelNumber == levelNumber)
                        return levelOverride;
                }
            }
            return null;
        };
        return LevelOverrideAdvCollection;
    }(BaseNodeCollection));
    DocumentEditorFeatures.LevelOverrideAdvCollection = LevelOverrideAdvCollection;
    var NodeCollection = (function (_super) {
        __extends(NodeCollection, _super);
        function NodeCollection(owner) {
            _super.call(this);
            this.ownerNode = owner;
            this.NotifyCollectionChanged = true;
        }
        Object.defineProperty(NodeCollection.prototype, "OwnerNode", {
            get: function () {
                return this.ownerNode;
            },
            enumerable: true,
            configurable: true
        });
        NodeCollection.prototype.push = function (node) {
            if ((this instanceof HeaderFooterCollection && node instanceof HeaderFooter)
                || (this instanceof SectionAdvCollection && node instanceof SectionAdv)
                || (this instanceof BlockAdvCollection && node instanceof BlockAdv)
                || (this instanceof InlineCollection && node instanceof Inline)
                || (this instanceof TableRowAdvCollection && node instanceof TableRowAdv)
                || (this instanceof TableCellAdvCollection && node instanceof TableCellAdv)) {
                _super.prototype.push.call(this, node);
                return 1;
            }
        };
        NodeCollection.prototype.Add = function (node) {
            if ((this instanceof HeaderFooterCollection && node instanceof HeaderFooter)
                || (this instanceof SectionAdvCollection && node instanceof SectionAdv)
                || (this instanceof BlockAdvCollection && node instanceof BlockAdv)
                || (this instanceof InlineCollection && node instanceof Inline)
                || (this instanceof TableRowAdvCollection && node instanceof TableRowAdv)
                || (this instanceof TableCellAdvCollection && node instanceof TableCellAdv)) {
                _super.prototype.push.call(this, node);
                return 1;
            }
            return 0;
        };
        NodeCollection.prototype.SetOwnerToNode = function (node, index) {
            if (node.Owner instanceof CompositeNode) {
                var previousOwner = node.Owner;
                if (this.indexOf(node) > -1) {
                    this.NotifyCollectionChanged = false;
                    this.RemoveAt(index);
                    if (previousOwner == this.OwnerNode)
                        this.NotifyCollectionChanged = true;
                    previousOwner.ChildNodes.Remove(node);
                    if (previousOwner == this.OwnerNode)
                        this.NotifyCollectionChanged = false;
                    this.Insert(index, node);
                    this.NotifyCollectionChanged = true;
                }
                else
                    previousOwner.ChildNodes.Remove(node);
            }
            node.SetOwner(this.OwnerNode);
        };
        NodeCollection.prototype.GetNextNode = function (node) {
            var index = this.indexOf(node);
            if (index < 0 || index > this.length - 2)
                return null;
            return this[index + 1];
        };
        NodeCollection.prototype.GetPreviousNode = function (node) {
            var index = this.indexOf(node);
            if (index < 1 || index > this.length - 1)
                return null;
            return this[index - 1];
        };
        NodeCollection.prototype.Dispose = function () {
            this.ownerNode = null;
            this.NotifyCollectionChanged = false;
        };
        return NodeCollection;
    }(ObservableCollection));
    DocumentEditorFeatures.NodeCollection = NodeCollection;
    var HeaderFooterCollection = (function (_super) {
        __extends(HeaderFooterCollection, _super);
        function HeaderFooterCollection() {
            _super.apply(this, arguments);
        }
        HeaderFooterCollection.prototype.CollectionChanged = function (node, added) {
            if (added) {
                var index = this.indexOf(node);
                this.SetOwnerToNode(node, index);
            }
            else {
                if (node instanceof Node)
                    node.SetOwner(null);
            }
        };
        return HeaderFooterCollection;
    }(NodeCollection));
    DocumentEditorFeatures.HeaderFooterCollection = HeaderFooterCollection;
    var SectionAdvCollection = (function (_super) {
        __extends(SectionAdvCollection, _super);
        function SectionAdvCollection() {
            _super.apply(this, arguments);
        }
        SectionAdvCollection.prototype.CollectionChanged = function (node, added) {
            if (added) {
                var index = this.indexOf(node);
                this.SetOwnerToNode(node, index);
            }
            else {
                if (node instanceof Node)
                    node.SetOwner(null);
            }
        };
        return SectionAdvCollection;
    }(NodeCollection));
    DocumentEditorFeatures.SectionAdvCollection = SectionAdvCollection;
    var BlockAdvCollection = (function (_super) {
        __extends(BlockAdvCollection, _super);
        function BlockAdvCollection() {
            _super.apply(this, arguments);
        }
        BlockAdvCollection.prototype.CollectionChanged = function (node, added) {
            if (added) {
                var index = this.indexOf(node);
                this.SetOwnerToNode(node, index);
                if (node instanceof ParagraphAdv && node.Owner != null) {
                    var paragraph = node;
                    for (var i = 0; i < paragraph.Inlines.Count; i++) {
                        var span = paragraph.Inlines[i];
                        if (span instanceof SpanAdv && span.Text != "" && span != null && span != undefined) {
                            var text = span.Text;
                            text = text.replace("\r\n", "\r");
                            text = text.replace("\n", "\r");
                            var index_1 = text.indexOf("\r");
                            if (index_1 > 0) {
                                node.SplitByBreakCharacter(paragraph, span, i);
                            }
                        }
                    }
                }
                index++;
            }
            else {
                if (node instanceof Node)
                    node.SetOwner(null);
            }
        };
        return BlockAdvCollection;
    }(NodeCollection));
    DocumentEditorFeatures.BlockAdvCollection = BlockAdvCollection;
    var InlineCollection = (function (_super) {
        __extends(InlineCollection, _super);
        function InlineCollection() {
            _super.apply(this, arguments);
        }
        InlineCollection.prototype.CollectionChanged = function (node, added) {
            if (added) {
                var index = this.indexOf(node);
                this.SetOwnerToNode(node, index);
                if (node instanceof SpanAdv && node.OwnerParagraph != null && node.OwnerParagraph.Owner != null) {
                    var spanAdv = node;
                    if (spanAdv.Text != "\t" && spanAdv.Text != "\v" && spanAdv.Text.length >= 1) {
                        node.SplitByTabOrLineBreakCharacter(index);
                    }
                    if (spanAdv.Text != "" && spanAdv.Text != null) {
                        var text = spanAdv.Text;
                        text = text.replace("\r\n", "\r");
                        text = text.replace("\n", "\r");
                        var index_2 = text.indexOf("\r");
                        if (index_2 > 0) {
                            var para = null;
                            spanAdv.SplitByBreakCharacter(spanAdv, text, para, para);
                        }
                    }
                }
            }
            else {
                if (node instanceof Node)
                    node.SetOwner(null);
            }
        };
        return InlineCollection;
    }(NodeCollection));
    DocumentEditorFeatures.InlineCollection = InlineCollection;
    var TableColumnAdvCollection = (function (_super) {
        __extends(TableColumnAdvCollection, _super);
        function TableColumnAdvCollection() {
            _super.apply(this, arguments);
        }
        return TableColumnAdvCollection;
    }(List));
    DocumentEditorFeatures.TableColumnAdvCollection = TableColumnAdvCollection;
    var TableRowAdvCollection = (function (_super) {
        __extends(TableRowAdvCollection, _super);
        function TableRowAdvCollection() {
            _super.apply(this, arguments);
        }
        TableRowAdvCollection.prototype.CollectionChanged = function (node, added) {
            if (added) {
                var index = this.indexOf(node);
                this.SetOwnerToNode(node, index);
            }
            else {
                if (node instanceof Node)
                    node.SetOwner(null);
            }
        };
        return TableRowAdvCollection;
    }(NodeCollection));
    DocumentEditorFeatures.TableRowAdvCollection = TableRowAdvCollection;
    var TableCellAdvCollection = (function (_super) {
        __extends(TableCellAdvCollection, _super);
        function TableCellAdvCollection() {
            _super.apply(this, arguments);
        }
        TableCellAdvCollection.prototype.CollectionChanged = function (node, added) {
            if (added) {
                var index = this.indexOf(node);
                this.SetOwnerToNode(node, index);
            }
            else {
                if (node instanceof Node)
                    node.SetOwner(null);
            }
        };
        return TableCellAdvCollection;
    }(NodeCollection));
    DocumentEditorFeatures.TableCellAdvCollection = TableCellAdvCollection;
    var DocumentAdv = (function (_super) {
        __extends(DocumentAdv, _super);
        function DocumentAdv(node) {
            _super.call(this, node);
            this.defaultTabWidth = 48;
            this.backgroundColor = "#FFFFFF";
            this.ChildNodes = new SectionAdvCollection(this);
            this.lists = new ListAdvCollection(this);
            this.abstractLists = new AbstractListAdvCollection(this);
            this.renderedListLevels = new List();
            this.renderedLevelOverrides = new List();
            this.renderedLists = new Dictionary();
        }
        Object.defineProperty(DocumentAdv.prototype, "Sections", {
            get: function () {
                return this.ChildNodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentAdv.prototype, "Lists", {
            get: function () {
                return this.lists;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentAdv.prototype, "AbstractLists", {
            get: function () {
                return this.abstractLists;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentAdv.prototype, "OwnerControl", {
            get: function () {
                return this.ownerControl;
            },
            set: function (owner) {
                this.ownerControl = owner;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentAdv.prototype, "DefaultTabWidth", {
            get: function () {
                return this.defaultTabWidth;
            },
            set: function (defaultTabWidth) {
                this.defaultTabWidth = defaultTabWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentAdv.prototype, "DocumentStart", {
            get: function () {
                return this.GetDocumentStart();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentAdv.prototype, "DocumentEnd", {
            get: function () {
                return this.GetDocumentEnd();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentAdv.prototype, "BackgroundColor", {
            get: function () {
                return this.backgroundColor;
            },
            set: function (value) {
                this.backgroundColor = value;
            },
            enumerable: true,
            configurable: true
        });
        DocumentAdv.prototype.LayoutItems = function (viewer) {
            for (var i = 0; i < this.Sections.length; i++) {
                var section = this.Sections[i];
                section.LayoutItems(viewer);
            }
            viewer.UpdateScrollBars();
        };
        DocumentAdv.prototype.Dispose = function () {
            if (this.ownerControl != null) {
                this.ownerControl = null;
            }
            if (this.ChildNodes != null) {
                this.ChildNodes.Dispose();
                for (var i = 0; i < this.Sections.Count; i++) {
                    var section = this.Sections[i];
                    section.Dispose();
                    this.Sections.Remove(section);
                    i--;
                }
            }
            if (this.renderedListLevels != null) {
                this.renderedListLevels.Clear();
                this.renderedListLevels = null;
            }
            if (this.renderedLists != null) {
                this.renderedLists.Clear();
                this.renderedLists = null;
            }
            if (this.Lists != null) {
                for (var i = 0; i < this.Lists.Count; i++) {
                    var list = this.Lists[i];
                    list.Dispose();
                    this.lists.Remove(list);
                    i--;
                }
                this.lists.Dispose();
                this.lists = null;
            }
            if (this.AbstractLists != null) {
                for (var i = 0; i < this.AbstractLists.Count; i++) {
                    var abstractList = this.AbstractLists[i];
                    abstractList.Dispose();
                    this.abstractLists.Remove(abstractList);
                    i--;
                }
                this.abstractLists.Dispose();
                this.abstractLists = null;
            }
            this.Fields = null;
            this.FieldCharacter = null;
        };
        DocumentAdv.prototype.GetListByID = function (id) {
            if (this.Lists == null)
                return null;
            for (var i = 0; i < this.Lists.length; i++) {
                if (this.Lists[i] != null && this.Lists[i].ListId == id)
                    return this.Lists[i];
            }
            return null;
        };
        DocumentAdv.prototype.GetAbstractListAdvByID = function (id) {
            if (this.AbstractLists == null)
                return null;
            for (var i = 0; i < this.AbstractLists.length; i++) {
                if (this.AbstractLists[i] != null && this.AbstractLists[i].AbstractListId == id)
                    return this.AbstractLists[i];
            }
            return null;
        };
        DocumentAdv.prototype.AddListLevel = function (abstractList) {
            for (var i = abstractList.Levels.Count; i < 9; i++) {
                var listLevel = new ListLevelAdv(abstractList);
                var val = i % 3;
                if (abstractList.Levels[0].ListLevelPattern == ListLevelPattern.Bullet) {
                    listLevel.ListLevelPattern = ListLevelPattern.Bullet;
                    listLevel.NumberFormat = val == 0 ? ListLevelAdv.DOTBULLET : val == 1 ? ListLevelAdv.SQUAREBULLET : ListLevelAdv.ARROWBULLET;
                    listLevel.CharacterFormat.FontFamily = listLevel.NumberFormat == ListLevelAdv.SQUAREBULLET ? "Wingdings" : "Symbol";
                }
                else {
                    listLevel.ListLevelPattern = val;
                    listLevel.NumberFormat = "%" + (i + 1).toString() + ".";
                    listLevel.StartAt = 1;
                    listLevel.RestartLevel = i;
                }
                listLevel.ParagraphFormat = new ParagraphFormat(listLevel);
                listLevel.ParagraphFormat.LeftIndent = 48 * (i + 1);
                listLevel.ParagraphFormat.FirstLineIndent = -24;
                abstractList.Levels.Add(listLevel);
            }
        };
        DocumentAdv.prototype.GetListNumber = function (listFormat) {
            var listAdv = listFormat.List;
            var levelNumber = listFormat.ListLevelNumber;
            var listLevel = listFormat.ListLevel;
            var levelOverrideAdv = listAdv.LevelOverrides != null ? listAdv.LevelOverrides.Get(levelNumber) : null;
            if (levelOverrideAdv != null && !this.renderedLevelOverrides.Contains(levelOverrideAdv) && levelOverrideAdv.OverrideListLevel == null) {
                this.renderedLevelOverrides.Add(listAdv.LevelOverrides[levelNumber]);
                if (this.renderedListLevels.Contains(listLevel))
                    this.renderedListLevels.Remove(listLevel);
                if (this.renderedLists.ContainsKey(listAdv.AbstractList)) {
                    var levels = this.renderedLists.Get(listAdv.AbstractList);
                    if (levels.ContainsKey(levelNumber))
                        levels.Remove(levelNumber);
                }
            }
            this.UpdateListValues(listAdv, levelNumber);
            return this.GetListText(listAdv, levelNumber, listLevel);
        };
        DocumentAdv.prototype.UpdateListValues = function (listAdv, listLevelNumber) {
            if (!this.renderedLists.ContainsKey(listAdv.AbstractList)) {
                var startVal = new Dictionary();
                this.renderedLists.Add(listAdv.AbstractList, startVal);
                var listLevel = listAdv.GetListLevel(listLevelNumber);
                for (var i = 0; i <= listLevelNumber; i++) {
                    startVal.Add(i, listAdv.GetListStartValue(i));
                }
            }
            else {
                var levels = this.renderedLists.Get(listAdv.AbstractList);
                if (levels.ContainsKey(listLevelNumber)) {
                    var startAt = levels.Get(listLevelNumber);
                    levels.Set(listLevelNumber, startAt + 1);
                    var levelNumber = listLevelNumber + 1;
                    while (levelNumber < listAdv.AbstractList.Levels.Count) {
                        var listLevel = listAdv.GetListLevel(levelNumber);
                        if (listLevel != null) {
                            if (levels.ContainsKey(levelNumber) && listLevel.RestartLevel > listLevelNumber) {
                                levels.Remove(levelNumber);
                                if (this.renderedListLevels.Contains(listLevel))
                                    this.renderedListLevels.Remove(listLevel);
                            }
                        }
                        levelNumber++;
                    }
                }
                else {
                    var levelNumber = listLevelNumber;
                    while (!levels.ContainsKey(levelNumber - 1) && levelNumber > 0) {
                        var listLevel = listAdv.GetListLevel(levelNumber - 1);
                        if (listLevel != null) {
                            levels.Add(levelNumber - 1, listAdv.GetListStartValue(levelNumber - 1));
                            if (!this.renderedListLevels.Contains(listLevel))
                                this.renderedListLevels.Add(listLevel);
                        }
                        levelNumber--;
                    }
                    var startAt = listAdv.GetListStartValue(listLevelNumber);
                    levels.Add(listLevelNumber, startAt);
                }
            }
        };
        DocumentAdv.prototype.GetListText = function (listAdv, listLevelNumber, currentListLevel) {
            var listText = currentListLevel.NumberFormat;
            if (this.renderedLists.ContainsKey(listAdv.AbstractList)) {
                var levels = this.renderedLists.Get(listAdv.AbstractList);
                var keys = levels.Keys;
                for (var i = 0; i < keys.length; i++) {
                    var levelNumber = keys[i];
                    var levelKey = "%" + (levelNumber + 1).toString();
                    var listLevel = listAdv.GetListLevel(levelNumber);
                    if (listText.match(levelKey)) {
                        if (levelNumber > listLevelNumber)
                            return "";
                        else if (levels.ContainsKey(levelNumber) && listLevel != null)
                            listText = listText.replace(levelKey, listLevel.GetListText(levels.Get(levelNumber)));
                        else
                            listText = listText.replace(levelKey, "0");
                    }
                }
            }
            return listText;
        };
        DocumentAdv.prototype.GetDocumentStart = function () {
            if (this.Sections.length == 0 || this.Sections[0].Blocks.length == 0)
                return null;
            var textPosition = null;
            var block = this.Sections[0].Blocks[0];
            if (block instanceof TableAdv)
                block = block.GetFirstParagraphInFirstCell();
            else
                block = this.Sections[0].Blocks[0];
            if (block instanceof ParagraphAdv) {
                textPosition = new TextPosition(this.OwnerControl);
                textPosition.SetPosition(block, true);
            }
            return textPosition;
        };
        DocumentAdv.prototype.GetDocumentEnd = function () {
            var textPosition = null;
            var documentStart = this.DocumentStart;
            if (documentStart != null && this.Sections.Count > 0) {
                var block = this.Sections.Last().Blocks.Last();
                var prevBlock = block;
                if (!this.OwnerControl.IsDocumentLoaded) {
                    if (prevBlock != null)
                        prevBlock = block.PreviousBlock;
                    if (prevBlock == null && this.Sections.Count > 1)
                        prevBlock = this.Sections[this.Sections.Count - 2].Blocks.Last();
                }
                if (prevBlock != null)
                    block = prevBlock;
                if (block instanceof TableAdv)
                    block = block.GetLastParagraphInLastCell();
                if (block instanceof ParagraphAdv) {
                    var offset = prevBlock == null ? 0 : block.GetEndOffset();
                    textPosition = new TextPosition(this.OwnerControl);
                    textPosition.SetPositionParagraph(block, offset);
                }
                else {
                    textPosition = new TextPosition(this.OwnerControl);
                    textPosition.SetPositionParagraph(documentStart.Paragraph, documentStart.Paragraph.GetEndOffset());
                }
            }
            return textPosition;
        };
        DocumentAdv.prototype.Find = function (pattern, option, isFirstMatch, owner) {
            if (this.Sections.Count == 0 || HelperMethods.IsPatternEmpty(pattern))
                return;
            var inline = null;
            var commentIndex = 0;
            var selectionEnd = null;
            if (this.OwnerControl.Selection != null && this.OwnerControl.Selection.End != null)
                selectionEnd = this.OwnerControl.Selection.End;
            if (isFirstMatch && selectionEnd != null && selectionEnd.Paragraph != null) {
                var indexInInline = 0;
                var inlineObject = selectionEnd.Paragraph.GetInline(this.OwnerControl.Selection.End.Offset, indexInInline);
                inline = inlineObject.inline;
                indexInInline = inlineObject.index;
                if (inline != null) {
                    var result = inline.Find(pattern, option, indexInInline, isFirstMatch, selectionEnd, owner);
                    if (result)
                        return true;
                }
            }
            var section = this.Sections[0];
            while (section != null && section.Blocks.Count == 0)
                section = section.NextNode;
            if (section == null || section.Blocks.Count == 0)
                return;
            var block = section.Blocks[0];
            var paragraph = block.GetFirstParagraph();
            while (paragraph != null && paragraph.Inlines.Count == 0)
                paragraph = paragraph.GetNextParagraph();
            if (paragraph == null || paragraph.Inlines.Count == 0)
                return;
            var inlineCollection = paragraph.Inlines[0];
            return inlineCollection.Find(pattern, option, 0, isFirstMatch, selectionEnd, owner);
        };
        return DocumentAdv;
    }(CompositeNode));
    DocumentEditorFeatures.DocumentAdv = DocumentAdv;
    var SectionAdv = (function (_super) {
        __extends(SectionAdv, _super);
        function SectionAdv(node) {
            _super.call(this, node);
            this.BodyWidgets = new List();
            this.ChildNodes = new BlockAdvCollection(this);
            this.headerFooters = new HeaderFooters(this);
            this.sectionformat = new SectionFormat(this);
        }
        Object.defineProperty(SectionAdv.prototype, "Blocks", {
            get: function () {
                return this.ChildNodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SectionAdv.prototype, "HeaderFooters", {
            get: function () {
                return this.headerFooters;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SectionAdv.prototype, "SectionFormat", {
            get: function () {
                return this.sectionformat;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SectionAdv.prototype, "Document", {
            get: function () {
                return this.Owner;
            },
            enumerable: true,
            configurable: true
        });
        SectionAdv.prototype.AddBodyWidget = function (area) {
            var bodyWidget = new BodyWidget(this);
            bodyWidget.Width = area.Width;
            bodyWidget.X = area.X;
            bodyWidget.Y = area.Y;
            this.BodyWidgets.push(bodyWidget);
            return bodyWidget;
        };
        SectionAdv.prototype.LayoutItems = function (viewer) {
            viewer.CreateNewPage(this);
            for (var i = 0; i < this.Blocks.length; i++) {
                var block = this.Blocks[i];
                viewer.UpdateClientAreaForBlock(block, true);
                block.LayoutItems(viewer);
                viewer.UpdateClientAreaForBlock(block, false);
            }
        };
        SectionAdv.prototype.GetCurrentHeaderFooter = function (type) {
            if (this.HeaderFooters.ChildNodes[type].Blocks.length == 0 && this.PreviousNode != null) {
                return this.PreviousNode.GetCurrentHeaderFooter(type);
            }
            return this.HeaderFooters.ChildNodes[type];
        };
        SectionAdv.prototype.GetPreviousParagraph = function () {
            if (this.PreviousNode instanceof SectionAdv) {
                var block = this.PreviousNode.Blocks[this.PreviousNode.Blocks.Count - 1];
                if (block instanceof ParagraphAdv)
                    return block;
                else
                    return block.GetLastParagraphInLastCell();
            }
            return null;
        };
        SectionAdv.prototype.GetNextParagraph = function () {
            if (this.NextNode instanceof SectionAdv) {
                var block = this.NextNode.Blocks[0];
                if (block instanceof ParagraphAdv)
                    return block;
                else
                    return block.GetFirstParagraphInFirstCell();
            }
            return null;
        };
        SectionAdv.prototype.GetPreviousBlock = function () {
            if (this.PreviousNode instanceof SectionAdv)
                return this.PreviousNode.Blocks[this.PreviousNode.Blocks.Count - 1];
            return null;
        };
        SectionAdv.prototype.GetNextSelection = function (selection) {
            if (this.NextNode instanceof SectionAdv) {
                var block = this.NextNode.Blocks[0];
                if (block instanceof ParagraphAdv)
                    return block;
                else {
                    if (selection.IsEmpty || selection.IsForward)
                        return block.GetLastParagraphInFirstRow();
                    else
                        return block.Rows[0].GetNextParagraphSelection(selection);
                }
            }
            return null;
        };
        SectionAdv.prototype.GetPreviousSelection = function (selection) {
            if (this.PreviousNode instanceof SectionAdv) {
                var block = this.PreviousNode.Blocks[this.PreviousNode.Blocks.Count - 1];
                if (block instanceof ParagraphAdv)
                    return block;
                else {
                    if (!selection.IsForward)
                        return block.GetFirstParagraphInLastRow();
                    else
                        return block.Rows[block.Rows.Count - 1].GetPreviousParagraphSelection(selection);
                }
            }
            return null;
        };
        SectionAdv.prototype.Dispose = function () {
            this.SectionFormat.Dispose();
            this.HeaderFooters.Dispose();
            this.SetOwner(null);
            if (this.BodyWidgets != null) {
                for (var i = 0; i < this.BodyWidgets.Count; i++) {
                    var widget = this.BodyWidgets[i];
                    widget.Dispose();
                    this.BodyWidgets.Remove(widget);
                    i--;
                }
                this.BodyWidgets = null;
            }
            if (this.Blocks != null) {
                this.Blocks.Dispose();
                for (var i = 0; i < this.Blocks.Count; i++) {
                    var block = this.Blocks[i];
                    block.Dispose();
                    this.Blocks.Remove(block);
                    i--;
                }
                this.ChildNodes = null;
            }
            this.Fields = null;
            this.FieldCharacter = null;
        };
        return SectionAdv;
    }(CompositeNode));
    DocumentEditorFeatures.SectionAdv = SectionAdv;
    var HeaderFooter = (function (_super) {
        __extends(HeaderFooter, _super);
        function HeaderFooter(node) {
            _super.call(this, node);
            this.ChildNodes = new BlockAdvCollection(this);
            this.LayoutedWidgets = new List();
        }
        Object.defineProperty(HeaderFooter.prototype, "Blocks", {
            get: function () {
                return this.ChildNodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderFooter.prototype, "Type", {
            get: function () {
                return this.type;
            },
            set: function (type) {
                this.type = type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderFooter.prototype, "Document", {
            get: function () {
                if (this.Section == null)
                    return null;
                return this.Section.Document;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderFooter.prototype, "Section", {
            get: function () {
                if (this.Owner instanceof HeaderFooters)
                    return this.Owner.Section;
                return null;
            },
            enumerable: true,
            configurable: true
        });
        HeaderFooter.prototype.LayoutItems = function (viewer) {
            var widget = new HeaderFooterWidget(this);
            widget.Page = viewer.CurrentRenderingPage;
            this.LayoutedWidgets.push(widget);
            widget.UpdateClientAreaLocation(viewer.ClientActiveArea);
            for (var i = 0; i < this.Blocks.length; i++) {
                var block = this.Blocks[i];
                if (block instanceof TableAdv)
                    block.TableWidgets.Clear();
                viewer.UpdateClientAreaForBlock(block, true);
                block.LayoutItems(viewer);
                viewer.UpdateClientAreaForBlock(block, false);
            }
            widget.Height = viewer.ClientActiveArea.Top - viewer.ClientArea.Top;
            if (this.type == HeaderFooterType.OddFooter || this.type == HeaderFooterType.EvenFooter || this.type == HeaderFooterType.FirstPageFooter) {
                widget.ShiftChildLocation(viewer.ClientArea.Top - viewer.ClientActiveArea.Top);
            }
            return widget;
        };
        HeaderFooter.prototype.ClearWidgets = function () {
            for (var i = 0; i < this.LayoutedWidgets.Count; i++) {
                var widget = this.LayoutedWidgets[i];
                widget.Dispose();
                this.LayoutedWidgets.Remove(widget);
                i--;
            }
        };
        HeaderFooter.prototype.Dispose = function () {
            this.SetOwner(null);
            if (this.Blocks != null) {
                this.Blocks.Dispose();
                for (var i = 0; i < this.Blocks.Count; i++) {
                    var block = this.Blocks[i];
                    block.Dispose();
                    this.Blocks.Remove(block);
                    i--;
                }
                this.ChildNodes = null;
            }
            this.Fields = null;
            this.FieldCharacter = null;
            if (this.LayoutedWidgets != null) {
                this.ClearWidgets();
                this.LayoutedWidgets = null;
            }
        };
        return HeaderFooter;
    }(CompositeNode));
    DocumentEditorFeatures.HeaderFooter = HeaderFooter;
    var HeaderFooters = (function (_super) {
        __extends(HeaderFooters, _super);
        function HeaderFooters(node) {
            _super.call(this, node);
            this.ChildNodes = new HeaderFooterCollection(this);
            var evenheader = new HeaderFooter(null);
            evenheader.Type = HeaderFooterType.EvenHeader;
            this.ChildNodes.push(evenheader);
            var header = new HeaderFooter(null);
            header.Type = HeaderFooterType.OddHeader;
            this.ChildNodes.push(header);
            var evenfooter = new HeaderFooter(null);
            evenfooter.Type = HeaderFooterType.EvenFooter;
            this.ChildNodes.push(evenfooter);
            var footer = new HeaderFooter(null);
            footer.Type = HeaderFooterType.OddFooter;
            this.ChildNodes.push(footer);
            var firstpageheader = new HeaderFooter(null);
            firstpageheader.Type = HeaderFooterType.FirstPageHeader;
            this.ChildNodes.push(firstpageheader);
            var firstpagefooter = new HeaderFooter(null);
            firstpagefooter.Type = HeaderFooterType.FirstPageFooter;
            this.ChildNodes.push(firstpagefooter);
        }
        Object.defineProperty(HeaderFooters.prototype, "EvenHeader", {
            get: function () {
                return this.ChildNodes[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderFooters.prototype, "Header", {
            get: function () {
                return this.ChildNodes[1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderFooters.prototype, "EvenFooter", {
            get: function () {
                return this.ChildNodes[2];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderFooters.prototype, "Footer", {
            get: function () {
                return this.ChildNodes[3];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderFooters.prototype, "FirstPageHeader", {
            get: function () {
                return this.ChildNodes[4];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderFooters.prototype, "FirstPageFooter", {
            get: function () {
                return this.ChildNodes[5];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderFooters.prototype, "Document", {
            get: function () {
                if (this.Section == null)
                    return null;
                return this.Section.Document;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderFooters.prototype, "Section", {
            get: function () {
                return this.Owner;
            },
            enumerable: true,
            configurable: true
        });
        HeaderFooters.prototype.Dispose = function () {
            this.SetOwner(null);
            if (this.ChildNodes != null) {
                this.ChildNodes.Dispose();
                for (var i = 0; i < this.ChildNodes.Count; i++) {
                    var headerFooter = this.ChildNodes[i];
                    headerFooter.Dispose();
                    this.ChildNodes.Remove(headerFooter);
                    i--;
                }
                this.ChildNodes = null;
            }
            this.Fields = null;
            this.FieldCharacter = null;
        };
        return HeaderFooters;
    }(CompositeNode));
    DocumentEditorFeatures.HeaderFooters = HeaderFooters;
    var BlockAdv = (function (_super) {
        __extends(BlockAdv, _super);
        function BlockAdv() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(BlockAdv.prototype, "PreviousBlock", {
            get: function () {
                var block = this.PreviousNode;
                return block;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockAdv.prototype, "NextBlock", {
            get: function () {
                return this.NextNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockAdv.prototype, "Section", {
            get: function () {
                if (this.Owner instanceof TableCellAdv)
                    return this.Owner.Section;
                if (this.Owner instanceof HeaderFooter)
                    return this.Owner.Section;
                return this.Owner;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockAdv.prototype, "IsInsideTable", {
            get: function () {
                return this.Owner instanceof TableCellAdv;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockAdv.prototype, "AssociatedCell", {
            get: function () {
                return this.Owner;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockAdv.prototype, "Document", {
            get: function () {
                if (this.Section != null)
                    return this.Section.Document;
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockAdv.prototype, "LeftIndent", {
            get: function () {
                var blockAdv = this;
                if (blockAdv instanceof ParagraphAdv)
                    return blockAdv.ParagraphFormat.LeftIndent;
                if (blockAdv instanceof TableAdv)
                    return blockAdv.TableFormat.LeftIndent;
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockAdv.prototype, "RightIndent", {
            get: function () {
                var blockAdv = this;
                if (blockAdv instanceof ParagraphAdv)
                    return blockAdv.ParagraphFormat.RightIndent;
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        BlockAdv.prototype._UpdateWidgetsToBody = function (viewer, curWidget) {
            var block = this;
            if (viewer.CurrentHeaderFooter == null) {
                if (curWidget.ContainerWidget != null
                    && curWidget.ContainerWidget.ChildWidgets.Contains(curWidget)) {
                    curWidget.ContainerWidget.ChildWidgets.Remove(curWidget);
                    curWidget.ContainerWidget.Height -= curWidget.Height;
                }
                var bodyWidget = null;
                var bodyWidgets = null;
                bodyWidgets = this.Section.BodyWidgets;
                var widgets = void 0;
                if (block instanceof ParagraphAdv)
                    widgets = block.ParagraphWidgets;
                else
                    widgets = block.TableWidgets;
                if (widgets.Count > 1) {
                    var prevBodyWidget = widgets[widgets.Count - 2].ContainerWidget;
                    var prevIndex = bodyWidgets.IndexOf(prevBodyWidget);
                    if (prevIndex + 1 < bodyWidgets.Count)
                        bodyWidget = bodyWidgets[prevIndex + 1];
                    else
                        bodyWidget = bodyWidgets[bodyWidgets.Count - 1];
                    bodyWidget.ChildWidgets.Insert(0, curWidget);
                    curWidget.ContainerWidget = bodyWidget;
                    bodyWidget.Height += curWidget.Height;
                }
                else {
                    var prevBodyWidget = null;
                    var index = 0;
                    if (this.PreviousBlock instanceof ParagraphAdv) {
                        prevBodyWidget = this.PreviousBlock.ParagraphWidgets[this.PreviousBlock.ParagraphWidgets.Count - 1].ContainerWidget;
                        index = prevBodyWidget.ChildWidgets.IndexOf(this.PreviousBlock.ParagraphWidgets[this.PreviousBlock.ParagraphWidgets.Count - 1]);
                    }
                    else if (this.PreviousBlock instanceof TableAdv) {
                        prevBodyWidget = this.PreviousBlock.TableWidgets[this.PreviousBlock.TableWidgets.Count - 1].ContainerWidget;
                        index = prevBodyWidget.ChildWidgets.IndexOf(this.PreviousBlock.TableWidgets[this.PreviousBlock.TableWidgets.Count - 1]);
                    }
                    if (prevBodyWidget != null && MathHelper.Round(curWidget.Y, 2) ==
                        MathHelper.Round(prevBodyWidget.ChildWidgets[index].Y + prevBodyWidget.ChildWidgets[index].Height, 2)) {
                        prevBodyWidget.ChildWidgets.Insert(index + 1, curWidget);
                        curWidget.ContainerWidget = prevBodyWidget;
                        prevBodyWidget.Height += curWidget.Height;
                    }
                    else {
                        var prevIndex = 0;
                        var documentStart = this.Document.DocumentStart;
                        if ((documentStart == null)
                            || (documentStart.Paragraph.IsInsideTable && this instanceof TableAdv
                                && block.Contains(documentStart.Paragraph.AssociatedCell)))
                            prevIndex = -1;
                        if (prevBodyWidget != null)
                            prevIndex = bodyWidgets.IndexOf(prevBodyWidget);
                        if (prevIndex + 1 < bodyWidgets.Count)
                            bodyWidget = bodyWidgets[prevIndex + 1];
                        else
                            bodyWidget = bodyWidgets[bodyWidgets.Count - 1];
                        bodyWidget.ChildWidgets.Insert(0, curWidget);
                        curWidget.ContainerWidget = bodyWidget;
                        bodyWidget.Height += curWidget.Height;
                    }
                }
            }
            else {
                var hfWidget = viewer.CurrentHeaderFooter.LayoutedWidgets[viewer.CurrentHeaderFooter.LayoutedWidgets.Count - 1];
                hfWidget.ChildWidgets.Add(curWidget);
                curWidget.ContainerWidget = hfWidget;
            }
        };
        BlockAdv.prototype.GetContainerTable = function () {
            var container = this;
            if (this.IsInsideTable) {
                if (this.AssociatedCell.OwnerTable.IsInsideTable)
                    container = this.AssociatedCell.OwnerTable.GetContainerTable();
                else
                    container = this.AssociatedCell.OwnerTable;
            }
            return container;
        };
        BlockAdv.prototype.IsExistBefore = function (block) {
            if (this.IsInsideTable) {
                var cell1 = this.AssociatedCell;
                if (block.IsInsideTable) {
                    var cell2 = block.AssociatedCell;
                    if (cell1 == cell2)
                        return cell1.Blocks.IndexOf(this) < cell1.Blocks.IndexOf(block);
                    if (cell1.OwnerRow == cell2.OwnerRow)
                        return cell1.CellIndex < cell2.CellIndex;
                    if (cell1.OwnerTable == cell2.OwnerTable)
                        return cell1.OwnerRow.RowIndex < cell2.OwnerRow.RowIndex;
                    var containerCell = cell1.GetContainerCellOf(cell2);
                    if (containerCell.OwnerTable.Contains(cell2)) {
                        cell1 = cell1.GetSelectedCell(containerCell);
                        cell2 = cell2.GetSelectedCell(containerCell);
                        if (cell1 == containerCell)
                            return this.IsExistBefore(cell2.OwnerTable);
                        if (cell2 == containerCell)
                            return cell1.OwnerTable.IsExistBefore(block);
                        if (containerCell.OwnerRow == cell2.OwnerRow)
                            return containerCell.CellIndex < cell2.CellIndex;
                        if (containerCell.OwnerTable == cell2.OwnerTable)
                            return containerCell.OwnerRow.RowIndex < cell2.OwnerRow.RowIndex;
                        return cell1.OwnerTable.IsExistBefore(cell2.OwnerTable);
                    }
                    return containerCell.OwnerTable.IsExistBefore(cell2.OwnerTable.GetContainerTable());
                }
                else {
                    var ownerTable = this.GetContainerTable();
                    return ownerTable.IsExistBefore(block);
                }
            }
            else if (block.IsInsideTable) {
                var ownerTable = block.GetContainerTable();
                return this.IsExistBefore(ownerTable);
            }
            else {
                if (this.Owner instanceof HeaderFooter)
                    return this.Owner.Blocks.indexOf(this) < block.Owner.Blocks.indexOf(block);
                else if (this.Section == block.Section)
                    return this.Section.Blocks.indexOf(this) < this.Section.Blocks.indexOf(block);
                else
                    return this.Document.Sections.indexOf(this.Section) < this.Document.Sections.indexOf(block.Section);
            }
        };
        BlockAdv.prototype.IsExistAfter = function (block) {
            if (this.IsInsideTable) {
                var cell1 = this.AssociatedCell;
                if (block.IsInsideTable) {
                    var cell2 = block.AssociatedCell;
                    if (cell1 == cell2)
                        return cell1.Blocks.IndexOf(this) > cell1.Blocks.IndexOf(block);
                    if (cell1.OwnerRow == cell2.OwnerRow)
                        return cell1.CellIndex > cell2.CellIndex;
                    if (cell1.OwnerTable == cell2.OwnerTable)
                        return cell1.OwnerRow.RowIndex > cell2.OwnerRow.RowIndex;
                    var containerCell = cell1.GetContainerCellOf(cell2);
                    if (containerCell.OwnerTable.Contains(cell2)) {
                        cell1 = cell1.GetSelectedCell(containerCell);
                        cell2 = cell2.GetSelectedCell(containerCell);
                        if (cell1 == containerCell)
                            return this.IsExistAfter(cell2.OwnerTable);
                        if (cell2 == containerCell)
                            return cell1.OwnerTable.IsExistAfter(block);
                        if (containerCell.OwnerRow == cell2.OwnerRow)
                            return containerCell.CellIndex > cell2.CellIndex;
                        if (containerCell.OwnerTable == cell2.OwnerTable)
                            return containerCell.OwnerRow.RowIndex > cell2.OwnerRow.RowIndex;
                        return cell1.OwnerTable.IsExistAfter(cell2.OwnerTable);
                    }
                    return containerCell.OwnerTable.IsExistAfter(cell2.OwnerTable.GetContainerTable());
                }
                else {
                    var ownerTable = this.GetContainerTable();
                    return ownerTable.IsExistAfter(block);
                }
            }
            else if (block.IsInsideTable) {
                var ownerTable = block.GetContainerTable();
                return this.IsExistAfter(ownerTable);
            }
            else {
                if (this.Owner instanceof HeaderFooter)
                    return this.Owner.Blocks.IndexOf(this) > block.Owner.Blocks.IndexOf(block);
                else if (this.Section == block.Section)
                    return this.Section.Blocks.IndexOf(this) > this.Section.Blocks.IndexOf(block);
                else
                    return this.Document.Sections.IndexOf(this.Section) > this.Document.Sections.IndexOf(block.Section);
            }
        };
        BlockAdv.prototype.GetNextParagraph = function () {
            if (this.NextBlock instanceof ParagraphAdv)
                return this.NextBlock;
            else if (this.NextBlock instanceof TableAdv)
                return this.NextBlock.GetFirstParagraphInFirstCell();
            if (this.Owner instanceof TableCellAdv)
                return this.Owner.GetNextParagraph();
            else if (this.Owner instanceof SectionAdv)
                return this.Owner.GetNextParagraph();
            return null;
        };
        BlockAdv.prototype.GetFirstParagraph = function () {
            var block = this;
            if (block instanceof ParagraphAdv)
                return block;
            else if (block instanceof TableAdv)
                return block.GetFirstParagraphInFirstCell();
            return null;
        };
        BlockAdv.prototype.GetLastParagraph = function () {
            var block = this;
            if (block instanceof ParagraphAdv)
                return block;
            else if (block instanceof TableAdv)
                return block.GetLastParagraphInLastCell();
            return null;
        };
        BlockAdv.prototype.GetPreviousParagraph = function () {
            if (this.PreviousBlock instanceof ParagraphAdv)
                return this.PreviousBlock;
            else if (this.PreviousBlock instanceof TableAdv)
                return this.PreviousBlock.GetLastParagraphInLastCell();
            if (this.Owner instanceof TableCellAdv)
                return this.Owner.GetPreviousParagraph();
            else if (this.Owner instanceof SectionAdv)
                return this.Owner.GetPreviousParagraph();
            return null;
        };
        BlockAdv.prototype.GetPreviousBlock = function () {
            if (this.PreviousBlock == null) {
                if (this.Owner instanceof TableCellAdv)
                    return this.Owner.OwnerTable.GetPreviousBlock();
                else if (this.Owner instanceof SectionAdv)
                    return this.Owner.GetPreviousBlock();
            }
            return this.PreviousBlock;
        };
        BlockAdv.prototype.GetNextRenderedBlock = function () {
            if (this.NextBlock == null) {
                if (this.Owner instanceof SectionAdv
                    && this.Owner.NextNode != null)
                    return this.Owner.NextNode.Blocks[0];
            }
            return this.NextBlock;
        };
        BlockAdv.prototype.GetPreviousSelection = function (selection) {
            if (this.PreviousBlock instanceof ParagraphAdv)
                return this.PreviousBlock;
            else if (this.PreviousBlock instanceof TableAdv) {
                if (!selection.IsForward)
                    return this.PreviousBlock.GetFirstParagraphInLastRow();
                else
                    return this.PreviousBlock.Rows[this.PreviousBlock.Rows.Count - 1].GetPreviousParagraphSelection(selection);
            }
            if (this.Owner instanceof TableCellAdv)
                return this.Owner.GetPreviousSelection(selection);
            else if (this.Owner instanceof SectionAdv)
                return this.Owner.GetPreviousSelection(selection);
            return null;
        };
        BlockAdv.prototype.GetNextSelection = function (selection) {
            if (this.NextBlock instanceof ParagraphAdv)
                return this.NextBlock;
            else if (this.NextBlock instanceof TableAdv) {
                if (selection.IsEmpty || selection.IsForward)
                    return this.NextBlock.GetLastParagraphInFirstRow();
                else
                    return this.NextBlock.Rows[0].GetNextParagraphSelection(selection);
            }
            if (this.Owner instanceof TableCellAdv)
                return this.Owner.GetNextSelection(selection);
            else if (this.Owner instanceof SectionAdv)
                return this.Owner.GetNextSelection(selection);
            return null;
        };
        return BlockAdv;
    }(CompositeNode));
    DocumentEditorFeatures.BlockAdv = BlockAdv;
    var TableAdv = (function (_super) {
        __extends(TableAdv, _super);
        function TableAdv(node) {
            _super.call(this, node);
            this.flags = 0;
            this.headerHeight = 0;
            this.tableholder = null;
            this.ChildNodes = new TableRowAdvCollection(this);
            this.TableFormat = new TableFormat(this);
            this.TableHolder = new TableHolder();
            this.SpannedRowCollection = new Dictionary();
            this.TableWidgets = new List();
        }
        Object.defineProperty(TableAdv.prototype, "TableHolder", {
            get: function () { return this.tableholder; },
            set: function (value) { this.tableholder = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableAdv.prototype, "Rows", {
            get: function () {
                return this.ChildNodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableAdv.prototype, "Title", {
            get: function () { return this.title; },
            set: function (value) { this.title = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableAdv.prototype, "Description", {
            get: function () { return this.description; },
            set: function (value) { this.description = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableAdv.prototype, "TableWidth", {
            get: function () {
                if (this.Rows == null)
                    return 0;
                return this.GetTableWidth();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableAdv.prototype, "ContinueHeader", {
            get: function () {
                return ((this.flags & 0x2) >> 1) != 0;
            },
            set: function (value) {
                this.flags = ((this.flags & 0xFD) | ((value ? 1 : 0) << 1));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableAdv.prototype, "Header", {
            get: function () {
                return (this.flags & 0x1) != 0;
            },
            set: function (value) {
                this.flags = ((this.flags & 0xFE) | (value ? 1 : 0));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableAdv.prototype, "HeaderHeight", {
            get: function () {
                return this.headerHeight;
            },
            set: function (value) {
                this.headerHeight = value;
            },
            enumerable: true,
            configurable: true
        });
        TableAdv.prototype.LayoutItems = function (viewer) {
            if (this.TableWidgets != null && this.TableWidgets.length > 0) {
                this.TableWidgets.Clear();
            }
            this.AddColumns();
            this.AddTableWidget(viewer.ClientActiveArea);
            viewer.UpdateClientAreaTopOrLeft(this.TableWidgets[this.TableWidgets.Count - 1], true);
            if (this.Rows.Count > 0 && this.Rows[0].RowFormat.IsHeader) {
                this.Header = true;
                this.ContinueHeader = true;
                this.HeaderHeight = 0;
            }
            else {
                this.Header = false;
                this.ContinueHeader = false;
                this.HeaderHeight = 0;
            }
            for (var i = 0; i < this.Rows.length; i++) {
                var row = this.Rows[i];
                row.LayoutItems(viewer);
            }
            this.UpdateWidgetsToPage(viewer);
        };
        TableAdv.prototype.GetHeader = function () {
            var header = null;
            var flag = true;
            for (var i = 0; i < this.Rows.length; i++) {
                var row = this.Rows[i];
                if (row.RowFormat.IsHeader)
                    header = row;
                else
                    flag = false;
                if (!flag)
                    break;
            }
            return header;
        };
        TableAdv.prototype.GetTableWidth = function () {
            var width = 0;
            for (var i = 0; i < this.Rows.length; i++) {
                var row = this.Rows[i];
                var rowWidth = 0;
                for (var j = 0; j < row.Cells.length; j++) {
                    var cell = row.Cells[j];
                    rowWidth += cell.CellFormat.CellWidth;
                }
                if (width < rowWidth)
                    width = rowWidth;
            }
            return width;
        };
        TableAdv.prototype.AddTableWidget = function (area) {
            var tableWidget = new TableWidget(this);
            tableWidget.Width = area.Width;
            tableWidget.X = area.X;
            tableWidget.Y = area.Y;
            this.TableWidgets.Add(tableWidget);
            if (!this.IsInsideTable) {
                tableWidget.Width = this.GetTableWidth();
            }
            if (this.TableFormat.CellSpacing > 0) {
                tableWidget.Height = tableWidget.Height + this.TableFormat.CellSpacing;
                tableWidget.LeftBorderWidth = this.TableFormat.Borders.GetTableLeftBorder().GetLineWidth();
                tableWidget.RightBorderWidth = this.TableFormat.Borders.GetTableRightBorder().GetLineWidth();
                tableWidget.TopBorderWidth = this.TableFormat.Borders.GetTableTopBorder().GetLineWidth();
                tableWidget.BottomBorderWidth = this.TableFormat.Borders.GetTableBottomBorder().GetLineWidth();
                tableWidget.X += tableWidget.LeftBorderWidth;
                tableWidget.Y += tableWidget.TopBorderWidth;
                tableWidget.Width -= tableWidget.LeftBorderWidth;
                tableWidget.Width -= tableWidget.RightBorderWidth;
            }
        };
        TableAdv.prototype.AddColumns = function () {
            this.TableHolder.Columns.Clear();
            var tableGrid = new List();
            var toremovelast = 0;
            var rowSpannedCells = new List();
            for (var i = 0; i < this.Rows.length; i++) {
                var row = this.Rows[i];
                var columnSpan = row.GridBefore;
                var currOffset = 0;
                if (!(tableGrid.Contains(currOffset)))
                    tableGrid.Add(currOffset);
                currOffset += row.GridBeforeWidth * 15;
                var startOffset = Math.round(currOffset);
                if (!(tableGrid.Contains(startOffset)))
                    tableGrid.Add(startOffset);
                for (var j = 0; j < row.Cells.length; j++) {
                    var cell = row.Cells[j];
                    if (rowSpannedCells.length == 0)
                        cell.ColumnIndex = columnSpan;
                    for (var k = 0; k < rowSpannedCells.length; k++) {
                        if (rowSpannedCells[k].ColumnIndex < columnSpan) {
                            cell.ColumnIndex = columnSpan;
                            continue;
                        }
                        var rowSpan = 1;
                        var removeSpannedCell = true;
                        rowSpan = rowSpannedCells[k].CellFormat.RowSpan;
                        if (rowSpannedCells[k].ColumnIndex > columnSpan) {
                            cell.ColumnIndex = columnSpan;
                            removeSpannedCell = false;
                            if (j == row.Cells.length - 1 && row.GridAfter > 0)
                                currOffset += rowSpannedCells[k].CellFormat.CellWidth * 15;
                        }
                        else {
                            cell.ColumnIndex = columnSpan = this.TableHolder.Columns.indexOf(rowSpannedCells[k].OwnerColumn) + rowSpannedCells[k].CellFormat.ColumnSpan;
                            currOffset += rowSpannedCells[k].CellFormat.CellWidth * 15;
                        }
                        if (!removeSpannedCell && j == row.Cells.length - 1)
                            removeSpannedCell = true;
                        if (removeSpannedCell && i - rowSpannedCells[k].OwnerRow.RowIndex == rowSpan - 1) {
                            rowSpannedCells.RemoveAt(k);
                            k--;
                        }
                    }
                    if (cell.CellFormat.RowSpan > 1) {
                        if (rowSpannedCells.length == 0 || rowSpannedCells[rowSpannedCells.length - 1].ColumnIndex <= columnSpan)
                            rowSpannedCells.Add(cell);
                        else {
                            for (var m = rowSpannedCells.length; m > 0; m--) {
                                if (rowSpannedCells[m - 1].ColumnIndex > columnSpan)
                                    rowSpannedCells.Insert(m - 1, cell);
                            }
                        }
                    }
                    columnSpan += cell.CellFormat.ColumnSpan;
                    currOffset += cell.CellFormat.CellWidth * 15;
                    var offset = Math.round(currOffset);
                    if (!(tableGrid.Contains(offset)))
                        tableGrid.Add(offset);
                    if (j == row.Cells.length - 1 && row.GridAfterWidth > 0) {
                        currOffset += row.GridAfterWidth * 15;
                        if (!(tableGrid.Contains(Math.round(currOffset))))
                            tableGrid.Add(Math.round(currOffset));
                        columnSpan += row.GridAfter;
                    }
                    toremovelast = Math.max(toremovelast, columnSpan - 1);
                    if (this.TableHolder.Columns.length < columnSpan) {
                        var column = new TableColumnAdv();
                        this.TableHolder.Columns.Add(column);
                        while (this.TableHolder.Columns.length < columnSpan) {
                            column = new TableColumnAdv();
                            this.TableHolder.Columns.Add(column);
                        }
                    }
                }
            }
            tableGrid.Sort();
            for (var i = 0; i < tableGrid.length - 1; i++) {
                var column = this.TableHolder.Columns[i];
                column.PreferredWidth = (tableGrid[i + 1] - tableGrid[i]) / 15;
            }
            tableGrid.Clear();
            while ((toremovelast + 1) < this.TableHolder.Columns.length) {
                this.TableHolder.Columns.RemoveAt(this.TableHolder.Columns.length - 1);
            }
        };
        TableAdv.prototype.UpdateWidgetsToPage = function (viewer) {
            var tableWidget = this.TableWidgets[this.TableWidgets.length - 1];
            if (this.IsInsideTable) {
                this.AssociatedCell.TableCellWidgets[this.AssociatedCell.TableCellWidgets.length - 1].ChildWidgets.push(tableWidget);
                tableWidget.ContainerWidget = this.AssociatedCell.TableCellWidgets[this.AssociatedCell.TableCellWidgets.length - 1];
                this.AssociatedCell.TableCellWidgets[this.AssociatedCell.TableCellWidgets.Count - 1].Height = this.AssociatedCell.TableCellWidgets[this.AssociatedCell.TableCellWidgets.Count - 1].Height + tableWidget.Height;
            }
            else {
                this._UpdateWidgetsToBody(viewer, tableWidget);
                tableWidget.UpdateHeight(viewer);
                if (tableWidget.ChildWidgets.Count > 0 && tableWidget.Y != tableWidget.ChildWidgets[0].Y)
                    tableWidget.Y = tableWidget.ChildWidgets[0].Y;
            }
            if (this.TableFormat.CellSpacing > 0) {
                if (tableWidget.Y + tableWidget.Height + this.TableFormat.CellSpacing > viewer.ClientArea.Bottom && viewer instanceof PageLayoutViewer)
                    tableWidget.Height = tableWidget.Height - this.TableFormat.CellSpacing / 2;
                viewer.CutFromTop(tableWidget.Y + tableWidget.Height);
            }
        };
        TableAdv.prototype.GetLastBlockInLastCell = function () {
            var table = this;
            if (table.Rows.Count > 0) {
                var lastrow = table.Rows[table.Rows.Count - 1];
                var lastcell = lastrow.Cells[lastrow.Cells.Count - 1];
                return lastcell.Blocks[lastcell.Blocks.Count - 1];
            }
            return null;
        };
        TableAdv.prototype.GetLastParagraphInFirstRow = function () {
            var table = this;
            if (table.Rows.Count > 0) {
                var row = table.Rows[0];
                var lastcell = row.Cells[row.Cells.Count - 1];
                var lastBlock = lastcell.Blocks[lastcell.Blocks.Count - 1];
                if (lastBlock instanceof ParagraphAdv)
                    return lastBlock;
                else
                    return lastBlock.GetLastParagraphInLastCell();
            }
            return null;
        };
        TableAdv.prototype.GetLastParagraphInLastCell = function () {
            var table = this;
            if (table.Rows.Count > 0) {
                var lastrow = table.Rows[table.Rows.Count - 1];
                var lastcell = lastrow.Cells[lastrow.Cells.Count - 1];
                var lastBlock = lastcell.Blocks[lastcell.Blocks.Count - 1];
                if (lastBlock instanceof ParagraphAdv)
                    return lastBlock;
                else
                    return lastBlock.GetLastParagraphInLastCell();
            }
            return null;
        };
        TableAdv.prototype.GetFirstParagraphInFirstCell = function () {
            var table = this;
            if (table.Rows.length > 0) {
                var row = table.Rows[0];
                if (row.Cells.length > 0) {
                    var cell = row.Cells[0];
                    if (cell.Blocks.length > 0) {
                        var block = cell.Blocks[0];
                        if (block instanceof ParagraphAdv)
                            return block;
                        else
                            return block.GetFirstParagraphInFirstCell();
                    }
                }
            }
            return null;
        };
        TableAdv.prototype.GetFirstBlockInFirstCell = function () {
            var table = this;
            if (table.Rows.length > 0) {
                var firstrow = table.Rows[0];
                if (firstrow.Cells.Count > 0) {
                    var firstcell = firstrow.Cells[0];
                    if (firstcell.Blocks.Count == 0)
                        return null;
                    return firstcell.Blocks[0];
                }
            }
            return null;
        };
        TableAdv.prototype.Contains = function (tableCell) {
            if (this == tableCell.OwnerTable)
                return true;
            while (tableCell.OwnerTable.IsInsideTable) {
                if (this == tableCell.OwnerTable)
                    return true;
                tableCell = tableCell.OwnerTable.AssociatedCell;
            }
            return this == tableCell.OwnerTable;
        };
        TableAdv.prototype.HighlightCells = function (selection, selectionRange, startCell, endCell) {
            var start = startCell.OwnerRow.GetCellLeft(startCell);
            var end = start + startCell.CellFormat.CellWidth;
            var endCellLeft = endCell.OwnerRow.GetCellLeft(endCell);
            var endCellRight = endCellLeft + endCell.CellFormat.CellWidth;
            if (start > endCellLeft)
                start = endCellLeft;
            if (end < endCellRight)
                end = endCellRight;
            if (start > selection.UpDownSelectionLength)
                start = selection.UpDownSelectionLength;
            if (end < selection.UpDownSelectionLength)
                end = selection.UpDownSelectionLength;
            var count = this.Rows.IndexOf(endCell.OwnerRow);
            for (var i = this.Rows.IndexOf(startCell.OwnerRow); i <= count; i++) {
                this.Rows[i].Highlight(selection, selectionRange, start, end);
            }
        };
        TableAdv.prototype.Highlight = function (selection, selectionRange, start, end) {
            this.Rows[0].HighlightInternal(selection, selectionRange, start, end);
            if (!end.Paragraph.IsInsideTable
                || !this.Contains(end.Paragraph.AssociatedCell)) {
                var block = this.GetNextRenderedBlock();
                block.Highlight(selection, selectionRange, start, end);
            }
        };
        TableAdv.prototype.GetSelectedContentAsHtml = function (selection, start, end) {
            var html = "<table ";
            html += this.TableFormat.GetAsHtmlStyle();
            html += ">";
            html += this.Rows[0].GetSelectedContentAsHtml(selection, start, end);
            html += "</table>";
            if (!end.Paragraph.IsInsideTable
                || !this.Contains(end.Paragraph.AssociatedCell)) {
                var block = this.GetNextRenderedBlock();
                html += block.GetSelectedContentAsHtml(selection, start, end);
            }
            return html;
        };
        TableAdv.prototype.GetSelectedContentAsHtmlInternal = function (selection, startCell, endCell) {
            var start = startCell.OwnerRow.GetCellLeft(startCell);
            var end = start + startCell.CellFormat.CellWidth;
            var endCellLeft = endCell.OwnerRow.GetCellLeft(endCell);
            var endCellRight = endCellLeft + endCell.CellFormat.CellWidth;
            if (start > endCellLeft)
                start = endCellLeft;
            if (end < endCellRight)
                end = endCellRight;
            if (start > selection.UpDownSelectionLength)
                start = selection.UpDownSelectionLength;
            if (end < selection.UpDownSelectionLength)
                end = selection.UpDownSelectionLength;
            var count = this.Rows.IndexOf(endCell.OwnerRow);
            var html = "";
            for (var i = this.Rows.IndexOf(startCell.OwnerRow); i <= count; i++) {
                html += this.Rows[i].GetSelectedContentAsHtmlInternal(selection, start, end);
            }
            return html;
        };
        TableAdv.prototype.GetContentAsHtml = function () {
            var html = "<table ";
            html += this.TableFormat.GetAsHtmlStyle();
            html += ">";
            for (var i = 0; i < this.Rows.length; i++) {
                html += this.Rows[i].GetContentAsHtml();
            }
            html += "</table>";
            return html;
        };
        TableAdv.prototype.GetFirstParagraphInLastRow = function () {
            if (this.Rows.Count > 0) {
                var lastrow = this.Rows[this.Rows.Count - 1];
                var lastcell = lastrow.Cells[0];
                var lastBlock = lastcell.Blocks[0];
                if (lastBlock instanceof ParagraphAdv)
                    return lastBlock;
                else
                    return lastBlock.GetFirstParagraphInFirstCell();
            }
            return null;
        };
        TableAdv.prototype.GetCellInTable = function (tableCell) {
            while (tableCell.OwnerTable.IsInsideTable) {
                if (this == tableCell.OwnerTable)
                    return tableCell;
                tableCell = tableCell.OwnerTable.AssociatedCell;
            }
            return tableCell;
        };
        TableAdv.prototype.ClearWidgets = function () {
            if (this.TableWidgets != null
                && this.TableWidgets.Count > 0) {
                for (var i = 0; i < this.TableWidgets.Count; i++) {
                    var widget = this.TableWidgets[i];
                    widget.Dispose();
                    this.TableWidgets.Remove(widget);
                    i--;
                }
            }
        };
        TableAdv.prototype.Dispose = function () {
            if (this.SpannedRowCollection != null) {
                this.SpannedRowCollection.Clear();
                this.SpannedRowCollection = null;
            }
            this.SetOwner(null);
            this.TableFormat.Dispose();
            if (this.tableholder != null) {
                this.tableholder.Dispose();
                this.tableholder = null;
            }
            if (this.TableWidgets != null) {
                this.ClearWidgets();
                this.TableWidgets = null;
            }
            if (this.Rows != null) {
                this.Rows.Dispose();
                for (var i = 0; i < this.Rows.Count; i++) {
                    var row = this.Rows[i];
                    row.Dispose();
                    this.Rows.Remove(row);
                    i--;
                }
                this.ChildNodes = null;
            }
            this.Fields = null;
            this.FieldCharacter = null;
        };
        return TableAdv;
    }(BlockAdv));
    DocumentEditorFeatures.TableAdv = TableAdv;
    var TableRowAdv = (function (_super) {
        __extends(TableRowAdv, _super);
        function TableRowAdv(node) {
            _super.call(this, node);
            this.gridBefore = 0;
            this.gridBeforeWidth = 0;
            this.gridAfter = 0;
            this.gridAfterWidth = 0;
            this.ChildNodes = new TableCellAdvCollection(this);
            this.RowFormat = new RowFormat(this);
            this.TableRowWidgets = new List();
        }
        Object.defineProperty(TableRowAdv.prototype, "OwnerTable", {
            get: function () {
                return this.Owner;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableRowAdv.prototype, "RowIndex", {
            get: function () {
                if (this.OwnerTable != null)
                    return this.OwnerTable.Rows.indexOf(this);
                return -1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableRowAdv.prototype, "GridBefore", {
            get: function () { return this.gridBefore; },
            set: function (value) { this.gridBefore = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableRowAdv.prototype, "GridBeforeWidth", {
            get: function () { return this.gridBeforeWidth; },
            set: function (value) { this.gridBeforeWidth = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableRowAdv.prototype, "GridAfter", {
            get: function () { return this.gridAfter; },
            set: function (value) { this.gridAfter = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableRowAdv.prototype, "GridAfterWidth", {
            get: function () { return this.gridAfterWidth; },
            set: function (value) { this.gridAfterWidth = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableRowAdv.prototype, "Cells", {
            get: function () {
                return this.ChildNodes;
            },
            enumerable: true,
            configurable: true
        });
        TableRowAdv.prototype.LayoutItems = function (viewer) {
            if (this.TableRowWidgets != null
                && this.TableRowWidgets.length > 0) {
                this.TableRowWidgets.Clear();
            }
            this.AddTableRowWidget(viewer.ClientActiveArea);
            viewer.UpdateClientAreaForRow(this, true);
            for (var i = 0; i < this.Cells.length; i++) {
                var cell = this.Cells[i];
                cell.LayoutItems(viewer, this.GetMaxTopOrBottomCellMargin(0) + this.TableRowWidgets[this.TableRowWidgets.Count - 1].TopBorderWidth, this.GetMaxTopOrBottomCellMargin(1) + this.TableRowWidgets[this.TableRowWidgets.Count - 1].BottomBorderWidth);
            }
            viewer.UpdateClientAreaForRow(this, false);
            this.UpdateWidgetsToTable(viewer);
        };
        TableRowAdv.prototype.AddTableRowWidget = function (area) {
            var tableRowWidget = new TableRowWidget(this);
            tableRowWidget.X = area.X + this.GridBeforeWidth;
            tableRowWidget.Y = area.Y;
            tableRowWidget.Width = area.Width;
            this.TableRowWidgets.Add(tableRowWidget);
            var borderWidth = 0;
            if (this.OwnerTable.TableFormat.CellSpacing > 0) {
                tableRowWidget.Height = tableRowWidget.Height + this.OwnerTable.TableFormat.CellSpacing;
                for (var i = 0; i < this.Cells.Count; i++) {
                    if (this.Cells[i].CellFormat != null && this.Cells[i].CellFormat.Borders != null) {
                        var value = this.Cells[i].CellFormat.Borders.GetCellBottomBorder(this.Cells[i]).GetLineWidth();
                        if (value > borderWidth)
                            borderWidth = value;
                    }
                }
                tableRowWidget.BottomBorderWidth = borderWidth;
                if (this.RowIndex > 0 && this.PreviousNode != null) {
                    var prevRow = this.PreviousNode;
                    borderWidth = 0;
                    for (var i = 0; i < prevRow.Cells.Count; i++) {
                        if (prevRow.Cells[i].CellFormat != null && prevRow.Cells[i].CellFormat.Borders != null) {
                            var value = prevRow.Cells[i].CellFormat.Borders.GetCellBottomBorder(prevRow.Cells[i]).GetLineWidth();
                            if (value > borderWidth)
                                borderWidth = value;
                        }
                    }
                    tableRowWidget.TopBorderWidth = borderWidth;
                }
            }
            for (var i = 0; i < this.Cells.Count; i++) {
                if (this.Cells[i].CellFormat != null && this.Cells[i].CellFormat.Borders != null) {
                    var value = this.Cells[i].CellFormat.Borders.GetCellTopBorder(this.Cells[i]).GetLineWidth();
                    if (value > borderWidth)
                        borderWidth = value;
                }
            }
            tableRowWidget.TopBorderWidth = borderWidth;
            if (this.OwnerTable.TableFormat.CellSpacing <= 0 && this.RowIndex == this.OwnerTable.Rows.Count - 1) {
                for (var i = 0; i < this.Cells.Count; i++) {
                    if (this.Cells[i].CellFormat != null && this.Cells[i].CellFormat.Borders != null) {
                        var value = this.Cells[i].CellFormat.Borders.GetCellBottomBorder(this.Cells[i]).GetLineWidth();
                        if (value > borderWidth)
                            borderWidth = value;
                    }
                }
                tableRowWidget.BottomBorderWidth = borderWidth;
            }
        };
        TableRowAdv.prototype.GetHeaderHeight = function (OwnerTable) {
            var height = 0;
            if (this.OwnerTable.Rows.Count > 0 && OwnerTable.Rows[0].RowFormat.IsHeader) {
                for (var i = 0; i < OwnerTable.Rows.Count; i++) {
                    var row = OwnerTable.Rows[i];
                    if (row.RowFormat.IsHeader)
                        height = height + row.GetRowHeight();
                    else
                        break;
                }
            }
            return height;
        };
        TableRowAdv.prototype.GetRowHeight = function () {
            var height = 0;
            if (this.RowFormat.HeightType == HeightType.Exactly) {
                height = this.RowFormat.Height;
            }
            else if (this.TableRowWidgets.Count > 0) {
                for (var i = 0; i < this.TableRowWidgets.Count; i++) {
                    height = this.TableRowWidgets[i].Height + height;
                }
                height = Math.max(height, this.RowFormat.Height);
            }
            return height;
        };
        TableRowAdv.prototype.IsVerticalMergedCellContinue = function () {
            var colIndex = 0;
            for (var i = 0; i < this.Cells.Count; i++) {
                var cell = this.Cells[i];
                if (colIndex < cell.ColumnIndex)
                    return true;
                colIndex += cell.CellFormat.ColumnSpan;
            }
            return colIndex < this.OwnerTable.TableHolder.Columns.Count;
        };
        TableRowAdv.prototype.UpdateWidgetsToTable = function (viewer) {
            var rowHeight = this.GetRowHeight();
            var isHeader = false;
            var isAllowBreakAcrossPages = true;
            var heightType = HeightType.Auto;
            var cellspacing = 0;
            var count = this.TableRowWidgets.length - 1;
            var tableRowWidget = this.TableRowWidgets[count];
            isHeader = this.RowFormat.IsHeader;
            isAllowBreakAcrossPages = this.RowFormat.AllowBreakAcrossPages;
            heightType = this.RowFormat.HeightType;
            if (this.OwnerTable.ContinueHeader && !isHeader)
                this.OwnerTable.ContinueHeader = false;
            cellspacing = this.OwnerTable.TableFormat.CellSpacing;
            while (count < this.TableRowWidgets.length) {
                count = this.TableRowWidgets.length;
                if (this.OwnerTable.IsInsideTable || (viewer.SplittedCellWidgets.length == 0 && tableRowWidget.Y + tableRowWidget.Height + cellspacing <= viewer.ClientArea.Bottom)) {
                    this.AddWidgetToTable(viewer, tableRowWidget);
                }
                else {
                    if (viewer.SplittedCellWidgets.length > 0 && tableRowWidget.Y + tableRowWidget.Height <= viewer.ClientArea.Bottom) {
                        var isRowSpanEnd = this.IsRowSpanEnd(viewer);
                        if (!isRowSpanEnd) {
                            this.AddWidgetToTable(viewer, tableRowWidget);
                            continue;
                        }
                    }
                    var splittedWidget = tableRowWidget;
                    var tableWidget = this.OwnerTable.TableWidgets[this.OwnerTable.TableWidgets.Count - 1];
                    if (rowHeight + tableRowWidget.Y > viewer.ClientArea.Bottom) {
                        if (!isAllowBreakAcrossPages || (isHeader && this.OwnerTable.ContinueHeader) || (heightType == HeightType.Atleast && this.RowFormat.Height < viewer.ClientArea.Bottom)) {
                            if (rowHeight + tableRowWidget.Y > viewer.ClientArea.Bottom) {
                                if ((heightType == HeightType.Atleast && this.RowFormat.Height < viewer.ClientActiveArea.Height && isAllowBreakAcrossPages) || (heightType != HeightType.Exactly && tableRowWidget.Y == viewer.ClientArea.Y) || (heightType == HeightType.Auto && isAllowBreakAcrossPages)) {
                                    splittedWidget = this.SplitWidgets(tableRowWidget, viewer, splittedWidget);
                                }
                                if (heightType == HeightType.Exactly && tableRowWidget.Y == viewer.ClientArea.Y) {
                                    this.AddWidgetToTable(viewer, tableRowWidget);
                                    count++;
                                }
                                if (isHeader && this.OwnerTable.ContinueHeader) {
                                    this.OwnerTable.Header = false;
                                    this.OwnerTable.ContinueHeader = false;
                                    this.OwnerTable.HeaderHeight = 0;
                                    var pages = viewer.Pages;
                                    for (var i = 0; i < pages.Count; i++) {
                                        if (pages[i].RepeatHeaderRowTableWidget)
                                            pages[i].RepeatHeaderRowTableWidget = false;
                                    }
                                }
                            }
                            else if (isHeader && this.OwnerTable.ContinueHeader) {
                                this.AddWidgetToTable(viewer, tableRowWidget);
                                this.OwnerTable.Header = true;
                            }
                            else if (!isAllowBreakAcrossPages) {
                                this.AddWidgetToTable(viewer, tableRowWidget);
                                if (this.OwnerTable.Header && tableRowWidget.Height + this.OwnerTable.HeaderHeight < viewer.ClientArea.Bottom) {
                                    if (this.RowFormat.Height < viewer.ClientActiveArea.Bottom) {
                                        tableRowWidget.X = tableRowWidget.X;
                                        tableRowWidget.Y = tableWidget.Y + this.OwnerTable.HeaderHeight;
                                        tableRowWidget.UpdateChildLocation(tableRowWidget.Y + this.OwnerTable.HeaderHeight);
                                    }
                                }
                            }
                        }
                        else {
                            if ((heightType == HeightType.Auto || heightType == HeightType.Atleast) && isAllowBreakAcrossPages) {
                                if (!(this.RowFormat.Height > viewer.ClientArea.Bottom) || tableRowWidget.Y == viewer.ClientArea.Y) {
                                    splittedWidget = this.SplitWidgets(tableRowWidget, viewer, splittedWidget);
                                }
                            }
                            else if (heightType == HeightType.Exactly && tableRowWidget.Y == viewer.ClientArea.Y) {
                                this.AddWidgetToTable(viewer, tableRowWidget);
                                count++;
                            }
                        }
                    }
                    else {
                        if (this.IsVerticalMergedCellContinue() && isAllowBreakAcrossPages) {
                            splittedWidget = this.SplitWidgets(tableRowWidget, viewer, splittedWidget);
                        }
                    }
                    if (splittedWidget != null) {
                        if (splittedWidget != tableRowWidget) {
                            this.AddWidgetToTable(viewer, tableRowWidget);
                            this.OwnerTable.UpdateWidgetsToPage(viewer);
                            var index = this.OwnerTable.TableWidgets.IndexOf(tableRowWidget.ContainerWidget);
                            if (index + 1 >= this.OwnerTable.TableWidgets.length)
                                this.OwnerTable.AddTableWidget(viewer.ClientActiveArea);
                            tableRowWidget = splittedWidget;
                        }
                        else {
                            if (this.RowIndex > 0) {
                                this.OwnerTable.UpdateWidgetsToPage(viewer);
                                if (this.PreviousNode instanceof TableRowAdv
                                    && this.PreviousNode.TableRowWidgets.length > 0) {
                                    var prevWidget = this.PreviousNode.TableRowWidgets[this.PreviousNode.TableRowWidgets.length - 1];
                                    if (MathHelper.Round(tableRowWidget.Y, 2) == MathHelper.Round(prevWidget.Y + prevWidget.Height, 2)) {
                                        var prevIndex = this.OwnerTable.TableWidgets.IndexOf(prevWidget.ContainerWidget);
                                        if (prevIndex + 1 >= this.OwnerTable.TableWidgets.length)
                                            this.OwnerTable.AddTableWidget(viewer.ClientActiveArea);
                                    }
                                    else
                                        this.OwnerTable.AddTableWidget(viewer.ClientActiveArea);
                                }
                                else
                                    this.OwnerTable.AddTableWidget(viewer.ClientActiveArea);
                            }
                            count--;
                        }
                        tableWidget = this.OwnerTable.TableWidgets[this.OwnerTable.TableWidgets.Count - 1];
                        var prevBodyWidget = null;
                        if (this.OwnerTable.TableWidgets.length > 1)
                            prevBodyWidget = this.OwnerTable.TableWidgets[this.OwnerTable.TableWidgets.length - 2].ContainerWidget;
                        else {
                            var previousBlock = this.OwnerTable.PreviousBlock;
                            if (previousBlock instanceof ParagraphAdv)
                                prevBodyWidget = previousBlock.ParagraphWidgets[previousBlock.ParagraphWidgets.length - 1].ContainerWidget;
                            else if (previousBlock instanceof TableAdv)
                                prevBodyWidget = previousBlock.TableWidgets[previousBlock.TableWidgets.length - 1].ContainerWidget;
                        }
                        var pageIndex = 0;
                        if (prevBodyWidget != null)
                            pageIndex = viewer.Pages.indexOf(prevBodyWidget.Page);
                        if (pageIndex == viewer.Pages.length - 1
                            || viewer.Pages[pageIndex + 1].Section != this.OwnerTable.Section) {
                            var page = viewer.CreateNewPage(this.OwnerTable.Section);
                            if (viewer.Pages[pageIndex + 1].Section != this.OwnerTable.Section)
                                viewer.InsertPage(pageIndex + 1, page);
                        }
                        else {
                            viewer.Pages[pageIndex + 1].BoundingRectangle = new Rect(viewer.Pages[pageIndex + 1].BoundingRectangle.X, viewer.Pages[pageIndex].BoundingRectangle.Bottom + 20, viewer.Pages[pageIndex + 1].BoundingRectangle.Width, viewer.Pages[pageIndex + 1].BoundingRectangle.Height);
                            viewer.UpdateClientArea(this.OwnerTable.Section[0].SectionFormat);
                        }
                        if (this.OwnerTable.Header && tableRowWidget.Height < viewer.ClientArea.Bottom) {
                            if (viewer instanceof PageLayoutViewer)
                                viewer.CurrentRenderingPage.RepeatHeaderRowTableWidget = true;
                            viewer.UpdateClientAreaForBlock(this.OwnerTable, true);
                            splittedWidget.X = splittedWidget.X;
                            splittedWidget.Y = tableWidget.Y + this.OwnerTable.HeaderHeight;
                            var cellspace = viewer instanceof PageLayoutViewer ? cellspacing / 2 : cellspacing;
                            splittedWidget.UpdateChildLocation(tableWidget.Y + this.OwnerTable.HeaderHeight - cellspace);
                        }
                        else {
                            viewer.UpdateClientAreaForBlock(this.OwnerTable, true);
                            splittedWidget.X = splittedWidget.X;
                            splittedWidget.Y = tableWidget.Y;
                            var cellspace = viewer instanceof PageLayoutViewer ? cellspacing / 2 : cellspacing;
                            splittedWidget.UpdateChildLocation(tableWidget.Y - cellspace);
                        }
                    }
                }
                if (isHeader && this.OwnerTable.ContinueHeader) {
                    this.OwnerTable.Header = true;
                    this.OwnerTable.HeaderHeight = rowHeight + this.OwnerTable.HeaderHeight;
                }
                if (isHeader && this.OwnerTable.GetHeader() != null && this.RowIndex == this.OwnerTable.GetHeader().RowIndex) {
                    var headerHeight = this.GetHeaderHeight(this.OwnerTable);
                    if (headerHeight > this.OwnerTable.HeaderHeight || headerHeight > this.OwnerTable.HeaderHeight)
                        this.OwnerTable.HeaderHeight = headerHeight;
                    if (this.OwnerTable.HeaderHeight > viewer.ClientArea.Height) {
                        this.OwnerTable.Header = false;
                        this.OwnerTable.ContinueHeader = false;
                        this.OwnerTable.HeaderHeight = 0;
                        var pages = viewer.Pages;
                        for (var i = 0; i < pages.Count; i++) {
                            if (pages[i].RepeatHeaderRowTableWidget)
                                pages[i].RepeatHeaderRowTableWidget = false;
                        }
                    }
                }
                if (this.OwnerTable.TableWidgets.Count > 2 && this.OwnerTable.Header && tableRowWidget.Height < viewer.ClientActiveArea.Bottom && !viewer.CurrentRenderingPage.RepeatHeaderRowTableWidget) {
                    if (viewer instanceof PageLayoutViewer)
                        viewer.CurrentRenderingPage.RepeatHeaderRowTableWidget = true;
                }
            }
        };
        TableRowAdv.prototype.SplitWidgets = function (tableRowWidget, viewer, splittedWidget) {
            if (tableRowWidget.IsFirstLineFit(viewer.ClientArea.Bottom)) {
                splittedWidget = tableRowWidget.GetSplittedWidget(viewer.ClientArea.Bottom);
                if (viewer.SplittedCellWidgets.length > 0 || splittedWidget != tableRowWidget)
                    splittedWidget.InsertSplittedCellWidgets(viewer);
            }
            else
                splittedWidget.InsertSplittedCellWidgets(viewer);
            return splittedWidget;
        };
        TableRowAdv.prototype.AddWidgetToTable = function (viewer, tableRowWidget) {
            var tableWidget = this.OwnerTable.TableWidgets[0];
            var index = tableWidget.ChildWidgets.length;
            var prevWidget = null;
            var rowWidgetIndex = this.TableRowWidgets.indexOf(tableRowWidget);
            if (rowWidgetIndex > 0)
                prevWidget = this.TableRowWidgets[rowWidgetIndex - 1];
            else if (this.PreviousNode instanceof TableRowAdv && this.PreviousNode.TableRowWidgets.length > 0)
                prevWidget = this.PreviousNode.TableRowWidgets[this.PreviousNode.TableRowWidgets.length - 1];
            if (prevWidget == null) {
                if (index > 0) {
                    for (var i = tableWidget.ChildWidgets.length - 1; i >= 0; i--) {
                        var widget = tableWidget.ChildWidgets[i];
                        if (widget.TableRow.RowIndex < tableRowWidget.TableRow.RowIndex) {
                            index = i + 1;
                            break;
                        }
                        else
                            index = i;
                    }
                    if (index == 0)
                        tableWidget.UpdateWidgetLocation(tableRowWidget);
                }
            }
            else {
                tableWidget = prevWidget.ContainerWidget;
                index = tableWidget.ChildWidgets.length;
                if (tableWidget.ChildWidgets.IndexOf(prevWidget) >= 0)
                    index = tableWidget.ChildWidgets.IndexOf(prevWidget) + 1;
                if (Math.round(tableRowWidget.Y) != Math.round(prevWidget.Y + prevWidget.Height)) {
                    var prevIndex = this.OwnerTable.TableWidgets.IndexOf(tableWidget);
                    if (prevIndex + 1 >= this.OwnerTable.TableWidgets.length)
                        this.OwnerTable.AddTableWidget(viewer.ClientActiveArea);
                    tableWidget = this.OwnerTable.TableWidgets[prevIndex + 1];
                    index = tableWidget.ChildWidgets.length;
                }
                if (rowWidgetIndex > 0)
                    index = 0;
            }
            this.UpdateRowHeightBySpannedCell(tableWidget, tableRowWidget, index);
            this.UpdateRowHeightByCellSpacing(tableRowWidget, viewer);
            tableWidget.ChildWidgets.Insert(index, tableRowWidget);
            tableRowWidget.ContainerWidget = tableWidget;
            tableWidget.Height = tableWidget.Height + tableRowWidget.Height;
            if (tableWidget.ContainerWidget != null
                && tableWidget.ContainerWidget.ChildWidgets.IndexOf(tableWidget) >= 0)
                tableWidget.ContainerWidget.Height += tableRowWidget.Height;
            tableRowWidget.UpdateHeight(viewer, false);
            viewer.CutFromTop(tableRowWidget.Y + tableRowWidget.Height);
        };
        TableRowAdv.prototype.UpdateRowHeightBySpannedCell = function (tableWidget, rowWidget, insertIndex) {
            var rowSpan = 1;
            if (tableWidget.ChildWidgets.length == 0 || insertIndex == 0) {
                this.UpdateRowHeight(rowWidget, rowWidget);
                return;
            }
            for (var i = 0; i < rowWidget.ChildWidgets.length; i++) {
                var cellWidget = rowWidget.ChildWidgets[i];
                rowSpan = cellWidget.TableCell.CellFormat.RowSpan;
                if (rowSpan > 1 && this.OwnerTable != null) {
                    if (!this.OwnerTable.SpannedRowCollection.ContainsKey(this.RowIndex + rowSpan - 1))
                        this.OwnerTable.SpannedRowCollection.Add(this.RowIndex + rowSpan - 1, this.RowIndex);
                }
            }
            if (this.OwnerTable != null) {
                for (var i = 0; i < this.OwnerTable.SpannedRowCollection.Count; i++) {
                    if (this.OwnerTable.SpannedRowCollection.Keys[i] == this.RowIndex) {
                        for (var j = 0; j < insertIndex; j++) {
                            var prevRowWidget = tableWidget.ChildWidgets[j];
                            this.UpdateRowHeight(prevRowWidget, rowWidget);
                        }
                        this.OwnerTable.SpannedRowCollection.Remove(this.OwnerTable.SpannedRowCollection.Keys[i]);
                        break;
                    }
                }
            }
        };
        TableRowAdv.prototype.UpdateRowHeight = function (prevRowWidget, rowWidget) {
            var rowIndex = this.RowIndex;
            var rowSpan = 1;
            for (var i = 0; i < prevRowWidget.ChildWidgets.length; i++) {
                var cellWidget = prevRowWidget.ChildWidgets[i];
                rowSpan = cellWidget.TableCell.CellFormat.RowSpan;
                if (rowIndex - cellWidget.TableCell.OwnerRow.RowIndex == rowSpan - 1) {
                    var mergedCellHeight = cellWidget.Y + cellWidget.Height + cellWidget.Margin.Bottom - rowWidget.Y;
                    if (rowWidget.Height < mergedCellHeight)
                        rowWidget.Height = mergedCellHeight;
                }
            }
        };
        TableRowAdv.prototype.UpdateRowHeightByCellSpacing = function (rowWidget, viewer) {
            if (this.OwnerTable.TableFormat.CellSpacing > 0) {
                if (this.OwnerTable.TableWidgets.Count > 1 && rowWidget.Y == this.OwnerTable.Document.OwnerControl.Viewer.ClientArea.Top && viewer instanceof PageLayoutViewer)
                    rowWidget.Height = rowWidget.Height - this.OwnerTable.TableFormat.CellSpacing / 2;
            }
        };
        TableRowAdv.prototype.IsRowSpanEnd = function (viewer) {
            var rowIndex = this.RowIndex;
            var rowSpan = 1;
            for (var i = 0; i < viewer.SplittedCellWidgets.length; i++) {
                var splittedCell = viewer.SplittedCellWidgets[i];
                rowSpan = splittedCell.TableCell.CellFormat.RowSpan;
                if (rowIndex - splittedCell.TableCell.OwnerRow.RowIndex == rowSpan - 1)
                    return true;
            }
            return false;
        };
        TableRowAdv.prototype.GetMaxTopOrBottomCellMargin = function (topOrBottom) {
            var value = 0;
            for (var i = 0; i < this.Cells.Count; i++) {
                var cellFormat = this.Cells[i].CellFormat;
                if (cellFormat.ContainsMargins()) {
                    if (topOrBottom == 0 && cellFormat.TopMargin > value)
                        value = cellFormat.TopMargin;
                    else if (topOrBottom == 1 && cellFormat.BottomMargin > value)
                        value = cellFormat.BottomMargin;
                }
                else {
                    var tableFormat = this.Cells[i].OwnerTable.TableFormat;
                    if (topOrBottom == 0 && tableFormat.TopMargin > value)
                        value = tableFormat.TopMargin;
                    else if (topOrBottom == 1 && tableFormat.BottomMargin > value)
                        value = tableFormat.BottomMargin;
                }
            }
            return value;
        };
        TableRowAdv.prototype.GetNextParagraph = function () {
            var row = this;
            if (row.NextNode != null) {
                var cell = row.NextNode.Cells[0];
                var block = cell.Blocks[0];
                if (block instanceof ParagraphAdv)
                    return block;
                else
                    return block.GetFirstParagraphInFirstCell();
            }
            return this.OwnerTable.GetNextParagraph();
        };
        TableRowAdv.prototype.GetPreviousParagraph = function () {
            var row = this;
            if (row.PreviousNode != null) {
                var cell = row.PreviousNode.Cells[row.PreviousNode.Cells.Count - 1];
                var block = cell.Blocks[cell.Blocks.Count - 1];
                if (block instanceof ParagraphAdv)
                    return block;
                else
                    return block.GetLastParagraphInLastCell();
            }
            return this.OwnerTable.GetPreviousParagraph();
        };
        TableRowAdv.prototype.Contains = function (tableCell) {
            if (this.Cells.Contains(tableCell))
                return true;
            while (tableCell.OwnerTable.IsInsideTable) {
                if (this.Cells.Contains(tableCell))
                    return true;
                tableCell = tableCell.OwnerTable.AssociatedCell;
            }
            return this.Cells.Contains(tableCell);
        };
        TableRowAdv.prototype.Highlight = function (selection, selectionRange, start, end) {
            for (var i = 0; i < this.Cells.Count; i++) {
                var left = this.GetCellLeft(this.Cells[i]);
                if (MathHelper.Round(start, 2) <= MathHelper.Round(left, 2) && MathHelper.Round(left, 2) < MathHelper.Round(end, 2))
                    this.Cells[i].HighlightInternal(selection, selectionRange);
            }
        };
        TableRowAdv.prototype.HighlightInternal = function (selection, selectionRange, start, end) {
            for (var i = 0; i < this.Cells.Count; i++) {
                this.Cells[i].HighlightInternal(selection, selectionRange);
            }
            if (end.Paragraph.IsInsideTable
                && this.Contains(end.Paragraph.AssociatedCell))
                return;
            else if (this.NextNode instanceof TableRowAdv)
                this.NextNode.HighlightInternal(selection, selectionRange, start, end);
        };
        TableRowAdv.prototype.GetCellLeft = function (cell) {
            var left = 0;
            if (cell.TableCellWidgets.Count > 0)
                left += cell.TableCellWidgets[0].X - cell.TableCellWidgets[0].Margin.Left;
            return left;
        };
        TableRowAdv.prototype.GetSelectedContentAsHtmlInternal = function (selection, start, end) {
            var html = "<tr ";
            html += this.RowFormat.GetAsHtmlStyle();
            html += ">";
            for (var i = 0; i < this.Cells.Count; i++) {
                var left = this.GetCellLeft(this.Cells[i]);
                if (MathHelper.Round(start, 2) <= MathHelper.Round(left, 2) && MathHelper.Round(left, 2) < MathHelper.Round(end, 2))
                    html += this.Cells[i].GetContentAsHtml();
            }
            html += "</tr>";
            return html;
        };
        TableRowAdv.prototype.GetSelectedContentAsHtml = function (selection, start, end) {
            var html = "<tr ";
            html += this.RowFormat.GetAsHtmlStyle();
            html += ">";
            for (var i = 0; i < this.Cells.Count; i++) {
                html += this.Cells[i].GetContentAsHtml();
            }
            html += "</tr>";
            if (end.Paragraph.IsInsideTable
                && this.Contains(end.Paragraph.AssociatedCell))
                return html;
            else if (this.NextNode instanceof TableRowAdv)
                return html + this.NextNode.GetSelectedContentAsHtml(selection, start, end);
            return html;
        };
        TableRowAdv.prototype.GetContentAsHtml = function () {
            var html = "<tr ";
            html += this.RowFormat.GetAsHtmlStyle();
            html += ">";
            for (var i = 0; i < this.Cells.Count; i++) {
                html += this.Cells[i].GetContentAsHtml();
            }
            html += "</tr>";
            return html;
        };
        TableRowAdv.prototype.GetPreviousParagraphSelection = function (selection) {
            var cell = this.Cells[this.Cells.Count - 1];
            if (selection.Start.Paragraph.IsInsideTable
                && this.OwnerTable.Contains(selection.Start.Paragraph.AssociatedCell)) {
                var startCell = this.OwnerTable.GetCellInTable(selection.Start.Paragraph.AssociatedCell);
                cell = this.GetLastCellInRegion(startCell, selection.UpDownSelectionLength, true);
            }
            var block = cell.Blocks[cell.Blocks.Count - 1];
            if (block instanceof ParagraphAdv)
                return block;
            else
                return block.GetLastParagraphInLastCell();
        };
        TableRowAdv.prototype.GetNextParagraphSelection = function (selection) {
            var cell = this.Cells[0];
            if (selection.Start.Paragraph.IsInsideTable
                && this.OwnerTable.Contains(selection.Start.Paragraph.AssociatedCell)) {
                var startCell = this.OwnerTable.GetCellInTable(selection.Start.Paragraph.AssociatedCell);
                cell = this.GetFirstCellInRegion(startCell, selection.UpDownSelectionLength, false);
            }
            var block = cell.Blocks[0];
            if (block instanceof ParagraphAdv)
                return block;
            else
                return block.GetFirstParagraphInFirstCell();
        };
        TableRowAdv.prototype.GetFirstCellInRegion = function (startCell, selectionLength, isMovePrevious) {
            var start = startCell.OwnerRow.GetCellLeft(startCell);
            var end = start + startCell.CellFormat.CellWidth;
            var flag = true;
            if (start <= selectionLength && selectionLength < end) {
                for (var i = 0; i < this.Cells.Count; i++) {
                    var left = this.GetCellLeft(this.Cells[i]);
                    if (MathHelper.Round(start, 2) <= MathHelper.Round(left, 2) && MathHelper.Round(left, 2) < MathHelper.Round(end, 2)) {
                        flag = false;
                        return this.Cells[i];
                    }
                }
            }
            else {
                for (var i = 0; i < this.Cells.Count; i++) {
                    var left = this.GetCellLeft(this.Cells[i]);
                    if (left <= selectionLength && left + this.Cells[i].CellFormat.CellWidth > selectionLength) {
                        flag = false;
                        return this.Cells[i];
                    }
                }
            }
            if (flag) {
                if (this.PreviousNode != null && isMovePrevious)
                    return this.PreviousNode.GetFirstCellInRegion(startCell, selectionLength, isMovePrevious);
                else if (this.NextNode != null && !isMovePrevious)
                    return this.NextNode.GetFirstCellInRegion(startCell, selectionLength, isMovePrevious);
            }
            return this.Cells[0];
        };
        TableRowAdv.prototype.GetLastCellInRegion = function (startCell, selectionLength, isMovePrevious) {
            var start = startCell.OwnerRow.GetCellLeft(startCell);
            var end = start + startCell.CellFormat.CellWidth;
            var flag = true;
            if (start <= selectionLength && selectionLength < end) {
                for (var i = this.Cells.Count - 1; i >= 0; i--) {
                    var left = this.GetCellLeft(this.Cells[i]);
                    if (MathHelper.Round(start, 2) <= MathHelper.Round(left, 2) && MathHelper.Round(left, 2) < MathHelper.Round(end, 2)) {
                        flag = false;
                        return this.Cells[i];
                    }
                }
            }
            else {
                for (var i = this.Cells.Count - 1; i >= 0; i--) {
                    var left = this.GetCellLeft(this.Cells[i]);
                    if (left <= selectionLength && left + this.Cells[i].CellFormat.CellWidth > selectionLength) {
                        flag = false;
                        return this.Cells[i];
                    }
                }
            }
            if (flag) {
                if (this.PreviousNode != null && isMovePrevious)
                    return this.PreviousNode.GetLastCellInRegion(startCell, selectionLength, isMovePrevious);
                else if (this.NextNode != null && !isMovePrevious)
                    return this.NextNode.GetLastCellInRegion(startCell, selectionLength, isMovePrevious);
            }
            return this.Cells[this.Cells.Count - 1];
        };
        TableRowAdv.prototype.GetNextSelection = function (selection) {
            if (this.NextNode != null) {
                var isForwardSelection = selection.IsEmpty || selection.IsForward;
                if (isForwardSelection) {
                    var cell = this.NextNode.Cells[this.NextNode.Cells.Count - 1];
                    var block = cell.Blocks[cell.Blocks.Count - 1];
                    if (block instanceof ParagraphAdv)
                        return block;
                    else
                        return block.GetLastParagraphInLastCell();
                }
                else
                    return this.NextNode.GetNextParagraphSelection(selection);
            }
            return this.OwnerTable.GetNextSelection(selection);
        };
        TableRowAdv.prototype.GetPreviousSelection = function (selection) {
            if (this.PreviousNode != null) {
                if (!selection.IsForward) {
                    var cell = this.PreviousNode.Cells[0];
                    var block = cell.Blocks[0];
                    if (block instanceof ParagraphAdv)
                        return block;
                    else
                        return block.GetFirstParagraphInFirstCell();
                }
                else
                    return this.PreviousNode.GetPreviousParagraphSelection(selection);
            }
            return this.OwnerTable.GetPreviousSelection(selection);
        };
        TableRowAdv.prototype.ClearWidgets = function () {
            if (this.TableRowWidgets != null
                && this.TableRowWidgets.Count > 0) {
                for (var i = 0; i < this.TableRowWidgets.Count; i++) {
                    var widget = this.TableRowWidgets[i];
                    widget.Dispose();
                    this.TableRowWidgets.Remove(widget);
                    i--;
                }
            }
        };
        TableRowAdv.prototype.Dispose = function () {
            this.SetOwner(null);
            if (this.TableRowWidgets != null) {
                this.ClearWidgets();
                this.TableRowWidgets = null;
            }
            if (this.Cells != null) {
                this.Cells.Dispose();
                for (var i = 0; i < this.Cells.Count; i++) {
                    var cell = this.Cells[i];
                    cell.Dispose();
                    this.Cells.Remove(cell);
                    i--;
                }
                this.ChildNodes = null;
            }
            this.Fields = null;
            this.FieldCharacter = null;
        };
        return TableRowAdv;
    }(CompositeNode));
    DocumentEditorFeatures.TableRowAdv = TableRowAdv;
    var TableColumnAdv = (function () {
        function TableColumnAdv() {
            this.preferredwidth = 0;
            this.minwidth = 0;
            this.maxwidth = 0;
        }
        Object.defineProperty(TableColumnAdv.prototype, "PreferredWidth", {
            get: function () { return this.preferredwidth; },
            set: function (value) { this.preferredwidth = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableColumnAdv.prototype, "MinWidth", {
            get: function () { return this.minwidth; },
            set: function (value) { this.minwidth = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableColumnAdv.prototype, "MaxWidth", {
            get: function () { return this.maxwidth; },
            set: function (value) { this.maxwidth = value; },
            enumerable: true,
            configurable: true
        });
        return TableColumnAdv;
    }());
    DocumentEditorFeatures.TableColumnAdv = TableColumnAdv;
    var TableCellAdv = (function (_super) {
        __extends(TableCellAdv, _super);
        function TableCellAdv(node) {
            _super.call(this, node);
            this.colIndex = 0;
            this.ChildNodes = new BlockAdvCollection(this);
            this.CellFormat = new CellFormat(this);
            this.TableCellWidgets = new List();
        }
        Object.defineProperty(TableCellAdv.prototype, "Blocks", {
            get: function () {
                return this.ChildNodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableCellAdv.prototype, "LeftMargin", {
            get: function () {
                if (this.CellFormat.ContainsMargins())
                    return this.CellFormat.LeftMargin;
                else if (this.OwnerTable != null && this.OwnerTable.TableFormat != null)
                    return this.OwnerTable.TableFormat.LeftMargin;
                else
                    return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableCellAdv.prototype, "TopMargin", {
            get: function () {
                if (this.CellFormat.ContainsMargins())
                    return this.CellFormat.TopMargin;
                else if (this.OwnerTable != null && this.OwnerTable.TableFormat != null)
                    return this.OwnerTable.TableFormat.TopMargin;
                else
                    return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableCellAdv.prototype, "RightMargin", {
            get: function () {
                if (this.CellFormat.ContainsMargins())
                    return this.CellFormat.RightMargin;
                else if (this.OwnerTable != null && this.OwnerTable.TableFormat != null)
                    return this.OwnerTable.TableFormat.RightMargin;
                else
                    return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableCellAdv.prototype, "BottomMargin", {
            get: function () {
                if (this.CellFormat.ContainsMargins())
                    return this.CellFormat.BottomMargin;
                else if (this.OwnerTable != null && this.OwnerTable.TableFormat != null)
                    return this.OwnerTable.TableFormat.BottomMargin;
                else
                    return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableCellAdv.prototype, "OwnerRow", {
            get: function () {
                return this.Owner;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableCellAdv.prototype, "OwnerTable", {
            get: function () {
                if (this.OwnerRow != null)
                    return this.OwnerRow.OwnerTable;
                else
                    return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableCellAdv.prototype, "ColumnIndex", {
            get: function () { return this.colIndex; },
            set: function (value) { this.colIndex = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableCellAdv.prototype, "OwnerColumn", {
            get: function () {
                return this.OwnerTable.TableHolder.Columns[this.ColumnIndex];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableCellAdv.prototype, "Section", {
            get: function () {
                if (this.OwnerTable != null)
                    return this.OwnerTable.Section;
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableCellAdv.prototype, "CellIndex", {
            get: function () {
                if (this.OwnerRow != null)
                    return this.OwnerRow.Cells.IndexOf(this);
                return -1;
            },
            enumerable: true,
            configurable: true
        });
        TableCellAdv.prototype.LayoutItems = function (viewer, maxCellMarginTop, maxCellMarginBottom) {
            if (this.TableCellWidgets != null
                && this.TableCellWidgets.length > 0) {
                this.TableCellWidgets.Clear();
            }
            this.AddTableCellWidget(viewer.ClientActiveArea, maxCellMarginTop, maxCellMarginBottom);
            viewer.UpdateClientAreaForCell(this, true);
            if (this.Blocks.length == 0) {
                var paragraph = null;
                paragraph = new ParagraphAdv(this);
                this.Blocks.Add(paragraph);
            }
            for (var i = 0; i < this.Blocks.length; i++) {
                var block = this.Blocks[i];
                viewer.UpdateClientAreaForBlock(block, true);
                block.LayoutItems(viewer);
                viewer.UpdateClientAreaForBlock(block, false);
            }
            this.UpdateWidgetToRow(viewer);
            viewer.UpdateClientAreaForCell(this, false);
        };
        TableCellAdv.prototype.AddTableCellWidget = function (area, maxCellMarginTop, maxCellMarginBottom) {
            var tableCellWidget = new TableCellWidget(this);
            var prevColumnIndex = 0;
            var cellspace = 0;
            var left = 0;
            var top = maxCellMarginTop;
            var right = 0;
            var bottom = maxCellMarginBottom;
            if (this.CellFormat.ContainsMargins()) {
                left = this.CellFormat.LeftMargin;
                right = this.CellFormat.RightMargin;
            }
            else {
                left = this.OwnerTable.TableFormat.LeftMargin;
                right = this.OwnerTable.TableFormat.RightMargin;
            }
            tableCellWidget.Margin = new Margin(left, top, right, bottom);
            tableCellWidget.Width = this.CellFormat.CellWidth;
            if (this.PreviousNode != null)
                prevColumnIndex = this.PreviousNode.ColumnIndex + this.PreviousNode.CellFormat.ColumnSpan;
            cellspace = this.OwnerTable.TableFormat.CellSpacing;
            this.TableCellWidgets.Add(tableCellWidget);
            var prevSpannedCellWidth = 0;
            if (prevColumnIndex < this.ColumnIndex) {
                prevSpannedCellWidth = this.OwnerTable.TableHolder.GetPreviousSpannedCellWidth(prevColumnIndex, this.ColumnIndex);
                if (prevColumnIndex == 0)
                    prevSpannedCellWidth = prevSpannedCellWidth - cellspace / 2;
            }
            tableCellWidget.X = area.X + prevSpannedCellWidth + tableCellWidget.Margin.Left;
            tableCellWidget.Y = area.Y + tableCellWidget.Margin.Top + cellspace;
            tableCellWidget.Width = tableCellWidget.Width - tableCellWidget.Margin.Left - tableCellWidget.Margin.Right;
            if (cellspace > 0) {
                tableCellWidget.X += cellspace;
                if (this.OwnerTable.TableHolder.Columns.Count == 1)
                    tableCellWidget.Width -= cellspace * 2;
                else if (this.ColumnIndex == 0 || this.ColumnIndex == this.OwnerTable.TableHolder.Columns.Count - 1)
                    tableCellWidget.Width -= ((cellspace * 2) - cellspace / 2);
                else
                    tableCellWidget.Width -= cellspace;
                tableCellWidget.RightBorderWidth = this.CellFormat.Borders.GetCellRightBorder(this).GetLineWidth();
                tableCellWidget.Width -= tableCellWidget.RightBorderWidth;
            }
            tableCellWidget.LeftBorderWidth = this.CellFormat.Borders.GetCellLeftBorder(this).GetLineWidth();
            tableCellWidget.X += tableCellWidget.LeftBorderWidth;
            tableCellWidget.Width -= tableCellWidget.LeftBorderWidth;
            if (this.CellIndex == this.OwnerRow.Cells.Count - 1) {
                tableCellWidget.RightBorderWidth = this.CellFormat.Borders.GetCellRightBorder(this).GetLineWidth();
                tableCellWidget.Width -= tableCellWidget.RightBorderWidth;
            }
            tableCellWidget.Margin.Left = tableCellWidget.Margin.Left + tableCellWidget.LeftBorderWidth;
            tableCellWidget.Margin.Right = tableCellWidget.Margin.Right + tableCellWidget.RightBorderWidth;
        };
        TableCellAdv.prototype.UpdateWidgetToRow = function (viewer) {
            var tableCellWidget = this.TableCellWidgets[this.TableCellWidgets.length - 1];
            var rowWidget = this.OwnerRow.TableRowWidgets[this.OwnerRow.TableRowWidgets.length - 1];
            var cellLeft = rowWidget.X;
            if (rowWidget.ChildWidgets.length > 0) {
                var lastWidget = rowWidget.ChildWidgets[rowWidget.ChildWidgets.length - 1];
                cellLeft = lastWidget.X + lastWidget.Width + lastWidget.Margin.Right;
            }
            rowWidget.ChildWidgets.Add(tableCellWidget);
            tableCellWidget.ContainerWidget = rowWidget;
            if (this.OwnerRow.RowFormat.HeightType != HeightType.Exactly && this.OwnerRow.RowFormat.Height > 0 && this.CellIndex == 0)
                rowWidget.Height = rowWidget.Height + this.OwnerRow.RowFormat.Height;
            if (this.CellFormat.RowSpan == 1) {
                var cellHeight = tableCellWidget.Height + tableCellWidget.Margin.Top + tableCellWidget.Margin.Bottom;
                if (rowWidget.Height - this.OwnerTable.TableFormat.CellSpacing < cellHeight)
                    rowWidget.Height = cellHeight + this.OwnerTable.TableFormat.CellSpacing;
            }
        };
        TableCellAdv.prototype.GetNextParagraph = function () {
            if (this.NextNode != null) {
                var block = this.NextNode.Blocks[0];
                if (block instanceof ParagraphAdv)
                    return block;
                else
                    return block.GetFirstParagraphInFirstCell();
            }
            return this.OwnerRow.GetNextParagraph();
        };
        TableCellAdv.prototype.GetPreviousParagraph = function () {
            if (this.PreviousNode != null) {
                var block = this.PreviousNode.Blocks[this.PreviousNode.Blocks.Count - 1];
                if (block instanceof ParagraphAdv)
                    return block;
                else
                    return block.GetLastParagraphInLastCell();
            }
            return this.OwnerRow.GetPreviousParagraph();
        };
        TableCellAdv.prototype.GetFirstParagraph = function () {
            var firstBlock = this.Blocks[0];
            if (firstBlock instanceof ParagraphAdv)
                return firstBlock;
            else
                return firstBlock.GetFirstParagraphInFirstCell();
        };
        TableCellAdv.prototype.GetFirstBlock = function () {
            if (this.Blocks.Count > 0)
                return this.Blocks[0];
            return null;
        };
        TableCellAdv.prototype.GetLastParagraph = function () {
            var lastBlock = this.Blocks[this.Blocks.Count - 1];
            if (lastBlock instanceof ParagraphAdv)
                return lastBlock;
            else
                return lastBlock.GetLastParagraphInLastCell();
        };
        TableCellAdv.prototype.Contains = function (cell) {
            if (this == cell)
                return true;
            while (cell.OwnerTable.IsInsideTable) {
                if (this == cell.OwnerTable.AssociatedCell)
                    return true;
                cell = cell.OwnerTable.AssociatedCell;
            }
            return false;
        };
        TableCellAdv.prototype.GetContainerCell = function () {
            var cell = this;
            while (cell.OwnerTable != null && cell.OwnerTable.IsInsideTable) {
                cell = cell.OwnerTable.AssociatedCell;
            }
            return cell;
        };
        TableCellAdv.prototype.GetContainerCellOf = function (tableCell) {
            var cell = this;
            while (cell.OwnerTable.IsInsideTable) {
                if (cell.OwnerTable.Contains(tableCell))
                    return cell;
                cell = cell.OwnerTable.AssociatedCell;
            }
            return cell;
        };
        TableCellAdv.prototype.GetSelectedCell = function (containerCell) {
            var cell = this;
            if (cell.OwnerTable == containerCell.OwnerTable)
                return cell;
            while (cell.OwnerTable.IsInsideTable) {
                if (cell.OwnerTable.AssociatedCell == containerCell)
                    return cell;
                cell = cell.OwnerTable.AssociatedCell;
            }
            return cell;
        };
        TableCellAdv.prototype.IsCellSelected = function (startPosition, endPosition) {
            var lastParagraph = this.GetLastParagraph();
            var isAtCellEnd = lastParagraph == endPosition.Paragraph && endPosition.Offset == lastParagraph.GetLength() + 1;
            return isAtCellEnd || (!this.Contains(startPosition.Paragraph.AssociatedCell) || !this.Contains(endPosition.Paragraph.AssociatedCell));
        };
        TableCellAdv.prototype.Highlight = function (selection, selectionRange, start, end) {
            if (end.Paragraph.IsInsideTable) {
                var containerCell = this.GetContainerCellOf(end.Paragraph.AssociatedCell);
                if (containerCell.OwnerTable.Contains(end.Paragraph.AssociatedCell)) {
                    var startCell = this.GetSelectedCell(containerCell);
                    var endCell = end.Paragraph.AssociatedCell.GetSelectedCell(containerCell);
                    if (containerCell.Contains(end.Paragraph.AssociatedCell)) {
                        if (containerCell.IsCellSelected(start, end))
                            containerCell.HighlightInternal(selection, selectionRange);
                        else {
                            if (startCell == containerCell)
                                start.Paragraph.Highlight(selection, selectionRange, start, end);
                            else
                                startCell.HighlightContainer(selection, selectionRange, start, end);
                        }
                    }
                    else {
                        containerCell.HighlightInternal(selection, selectionRange);
                        if (containerCell.OwnerRow == endCell.OwnerRow) {
                            startCell = containerCell;
                            while (startCell.NextNode != null) {
                                startCell = startCell.NextNode;
                                startCell.HighlightInternal(selection, selectionRange);
                                if (startCell == endCell)
                                    break;
                            }
                        }
                        else
                            containerCell.OwnerTable.HighlightCells(selection, selectionRange, containerCell, endCell);
                    }
                }
                else
                    containerCell.HighlightContainer(selection, selectionRange, start, end);
            }
            else {
                var cell = this.GetContainerCell();
                cell.HighlightContainer(selection, selectionRange, start, end);
            }
        };
        TableCellAdv.prototype.HighlightInternal = function (selection, selectionRange) {
            for (var i = 0; i < this.TableCellWidgets.Count; i++) {
                this.TableCellWidgets[i].Highlight(selection, selectionRange);
            }
        };
        TableCellAdv.prototype.HighlightContainer = function (selection, selectionRange, start, end) {
            this.OwnerRow.HighlightInternal(selection, selectionRange, start, end);
            var block = this.OwnerTable.GetNextRenderedBlock();
            block.Highlight(selection, selectionRange, start, end);
        };
        TableCellAdv.prototype.GetCellLeft = function (cell) {
            var left = 0;
            if (cell.TableCellWidgets.Count > 0)
                left += cell.TableCellWidgets[0].X - cell.TableCellWidgets[0].Margin.Left;
            return left;
        };
        TableCellAdv.prototype.GetSelectedContentAsHtmlInternal = function (selection, start, end) {
            var html = "";
            if (end.Paragraph.IsInsideTable) {
                var containerCell = this.GetContainerCellOf(end.Paragraph.AssociatedCell);
                if (containerCell.OwnerTable.Contains(end.Paragraph.AssociatedCell)) {
                    html += "<table ";
                    html += containerCell.OwnerTable.TableFormat.GetAsHtmlStyle();
                    html += ">";
                    var startCell = this.GetSelectedCell(containerCell);
                    var endCell = end.Paragraph.AssociatedCell.GetSelectedCell(containerCell);
                    if (containerCell.Contains(end.Paragraph.AssociatedCell)) {
                        if (containerCell.IsCellSelected(start, end)) {
                            html += "<tr ";
                            html += containerCell.OwnerRow.RowFormat.GetAsHtmlStyle();
                            html += ">";
                            html += containerCell.GetContentAsHtml();
                            html += "</tr>";
                        }
                        else {
                            if (startCell == containerCell) {
                                html = start.Paragraph.GetSelectedContentAsHtml(selection, start, end);
                            }
                            else {
                                html = startCell.GetSelectedContentAsHtml(selection, start, end);
                            }
                        }
                    }
                    else {
                        if (containerCell.OwnerRow == endCell.OwnerRow) {
                            html += "<tr ";
                            html += containerCell.OwnerRow.RowFormat.GetAsHtmlStyle();
                            html += ">";
                            html += containerCell.GetContentAsHtml();
                            startCell = containerCell;
                            while (startCell.NextNode != null) {
                                startCell = startCell.NextNode;
                                html += startCell.GetContentAsHtml();
                                if (startCell == endCell)
                                    break;
                            }
                            html += "</tr>";
                        }
                        else
                            html += containerCell.OwnerTable.GetSelectedContentAsHtmlInternal(selection, containerCell, endCell);
                    }
                    html += "</table>";
                }
                else {
                    html += containerCell.GetSelectedContentAsHtml(selection, start, end);
                }
            }
            else {
                var cell = this.GetContainerCell();
                html += cell.GetSelectedContentAsHtml(selection, start, end);
            }
            return html;
        };
        TableCellAdv.prototype.GetSelectedContentAsHtml = function (selection, start, end) {
            var html = "";
            html += "<table ";
            html += this.OwnerTable.TableFormat.GetAsHtmlStyle();
            html += ">";
            html += this.OwnerRow.GetSelectedContentAsHtml(selection, start, end);
            html += "</table>";
            var block = this.OwnerTable.GetNextRenderedBlock();
            html += block.GetSelectedContentAsHtml(selection, start, end);
            return html;
        };
        TableCellAdv.prototype.GetContentAsHtml = function () {
            var html = "<td ";
            html += this.CellFormat.GetAsHtmlStyle();
            html += ">";
            for (var i = 0; i < this.Blocks.Count; i++) {
                html += this.Blocks[i].GetContentAsHtml();
            }
            html += "</td>";
            return html;
        };
        TableCellAdv.prototype.GetNextSelection = function (selection) {
            if (this.NextNode != null) {
                if (selection.IsEmpty || selection.IsForward) {
                    var block = this.NextNode.Blocks[this.NextNode.Blocks.Count - 1];
                    if (block instanceof ParagraphAdv)
                        return block;
                    else
                        return block.GetLastParagraphInLastCell();
                }
                else {
                    var block = this.NextNode.Blocks[0];
                    if (block instanceof ParagraphAdv)
                        return block;
                    else
                        return block.Rows[0].GetNextParagraphSelection(selection);
                }
            }
            return this.OwnerRow.GetNextSelection(selection);
        };
        TableCellAdv.prototype.GetPreviousSelection = function (selection) {
            if (this.PreviousNode != null) {
                if (!selection.IsForward) {
                    var block = this.PreviousNode.Blocks[0];
                    if (block instanceof ParagraphAdv)
                        return block;
                    else
                        return block.GetFirstParagraphInLastRow();
                }
                else {
                    var block = this.PreviousNode.Blocks[this.PreviousNode.Blocks.Count - 1];
                    if (block instanceof ParagraphAdv)
                        return block;
                    else
                        return block.Rows[block.Rows.Count - 1].GetPreviousParagraphSelection(selection);
                }
            }
            return this.OwnerRow.GetPreviousSelection(selection);
        };
        TableCellAdv.prototype.ClearWidgets = function () {
            if (this.TableCellWidgets != null
                && this.TableCellWidgets.Count > 0) {
                for (var i = 0; i < this.TableCellWidgets.Count; i++) {
                    var widget = this.TableCellWidgets[i];
                    widget.Dispose();
                    this.TableCellWidgets.Remove(widget);
                    i--;
                }
            }
        };
        TableCellAdv.prototype.Dispose = function () {
            this.SetOwner(null);
            this.CellFormat.Dispose();
            if (this.TableCellWidgets != null) {
                this.ClearWidgets();
                this.TableCellWidgets = null;
            }
            if (this.Blocks != null) {
                this.Blocks.Dispose();
                for (var i = 0; i < this.Blocks.Count; i++) {
                    var block = this.Blocks[i];
                    block.Dispose();
                    this.Blocks.Remove(block);
                    i--;
                }
                this.ChildNodes = null;
            }
            this.Fields = null;
            this.FieldCharacter = null;
        };
        return TableCellAdv;
    }(CompositeNode));
    DocumentEditorFeatures.TableCellAdv = TableCellAdv;
    var ParagraphAdv = (function (_super) {
        __extends(ParagraphAdv, _super);
        function ParagraphAdv(node) {
            _super.call(this, node);
            this.ChildNodes = new InlineCollection(this);
            this.CharacterFormat = new CharacterFormat(this);
            this.ParagraphFormat = new ParagraphFormat(this);
            this.paragraphWidgets = new List();
        }
        Object.defineProperty(ParagraphAdv.prototype, "Inlines", {
            get: function () {
                return this.ChildNodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ParagraphAdv.prototype, "ParagraphWidgets", {
            get: function () {
                return this.paragraphWidgets;
            },
            enumerable: true,
            configurable: true
        });
        ParagraphAdv.prototype.IsEmpty = function () {
            if (this.Inlines.length == 0)
                return true;
            return false;
        };
        ParagraphAdv.prototype.GetTabWidth = function (viewer) {
            if (viewer.ClientActiveArea.X < viewer.ClientArea.X)
                return viewer.ClientArea.X - viewer.ClientActiveArea.X;
            var position = viewer.ClientActiveArea.X - (viewer.ClientArea.X - this.LeftIndent);
            var defaultTabWidth = this.Document.DefaultTabWidth;
            if (position == 0 || defaultTabWidth == 0)
                return defaultTabWidth;
            else {
                var diff = ((Math.round(position) * 100) % (Math.round(defaultTabWidth) * 100)) / 100;
                var cnt = (Math.round(position) - diff) / Math.round(defaultTabWidth);
                var fposition = (cnt + 1) * defaultTabWidth;
                return (fposition - position) > 0 ? fposition - position : defaultTabWidth;
            }
        };
        ParagraphAdv.prototype.AddParagraphWidget = function (area) {
            var paragraphWidget = new ParagraphWidget(this);
            if (this.IsEmpty() && (this.ParagraphFormat.TextAlignment == TextAlignment.Center || this.ParagraphFormat.TextAlignment == TextAlignment.Right)) {
                var size = this.GetParagraphMarkSize(0, 0);
                var top_1 = size.TopMargin;
                var bottom = size.BottomMargin;
                var width = size.Width;
                var left = area.Left;
                if (this.ParagraphFormat.TextAlignment == TextAlignment.Center)
                    left += (area.Width - width) / 2;
                else
                    left += area.Width - width;
                paragraphWidget.Width = width;
                paragraphWidget.X = area.X;
                paragraphWidget.Y = area.Y;
            }
            else {
                paragraphWidget.Width = area.Width;
                paragraphWidget.X = area.X;
                paragraphWidget.Y = area.Y;
            }
            this.ParagraphWidgets.push(paragraphWidget);
        };
        ParagraphAdv.prototype.LayoutItems = function (viewer) {
            if (this.paragraphWidgets != null
                && this.paragraphWidgets.Count > 0) {
                this.paragraphWidgets.Clear();
            }
            this.AddParagraphWidget(viewer.ClientActiveArea);
            if (!viewer.IsFieldCode) {
                if (this.ParagraphFormat.ListFormat != null && this.ParagraphFormat.ListFormat.List != null &&
                    this.ParagraphFormat.ListFormat.ListLevelNumber >= 0 && this.ParagraphFormat.ListFormat.ListLevelNumber < 9)
                    this.LayoutList(viewer);
            }
            if (this.IsEmpty()) {
                this.LayoutEmptyLineWidget(viewer);
            }
            else {
                for (var i = 0; i < this.Inlines.length; i++) {
                    if (i == 0)
                        viewer.UpdateClientWidth(-this.ParagraphFormat.FirstLineIndent);
                    var inline = this.Inlines[i];
                    inline.LayoutItems(viewer);
                }
            }
            this.UpdateWidgetToPage(viewer);
        };
        ParagraphAdv.prototype.LayoutList = function (viewer) {
            viewer.UpdateClientWidth(-this.ParagraphFormat.FirstLineIndent);
            var document = this.Document;
            var currentListLevel = this.ParagraphFormat.ListFormat.ListLevel;
            if (currentListLevel == null)
                return;
            var element = new ListTextElementBox(this, currentListLevel, false);
            if (currentListLevel.ListLevelPattern == ListLevelPattern.Bullet)
                element.Text = currentListLevel.NumberFormat;
            else
                element.Text = document.GetListNumber(this.ParagraphFormat.ListFormat);
            TextHelper.UpdateTextSize(element);
            viewer.CutFromLeft(viewer.ClientActiveArea.X + element.Width);
            viewer.LineElements.Add(element);
            if (currentListLevel.FollowCharacter == FollowCharacterType.None)
                return;
            element = new ListTextElementBox(this, currentListLevel, true);
            if (currentListLevel.FollowCharacter == FollowCharacterType.Tab) {
                element.Text = "\t";
                element.Width = this.GetTabWidth(viewer);
            }
            else {
                element.Text = " ";
                TextHelper.UpdateTextSize(element);
            }
            viewer.CutFromLeft(viewer.ClientActiveArea.X + element.Width);
            viewer.LineElements.Add(element);
            viewer.UpdateClientWidth(this.ParagraphFormat.FirstLineIndent);
        };
        ParagraphAdv.prototype.LayoutEmptyLineWidget = function (viewer) {
            var paragraphMarkSize = TextHelper.GetParagraphMarkSize(this.CharacterFormat);
            var maxHeight = paragraphMarkSize.Height;
            var maxDescent = maxHeight - paragraphMarkSize.BaselineOffset;
            if (!isNaN(viewer.LineElements.MaxTextElementHeight)
                && maxHeight < viewer.LineElements.MaxTextElementHeight) {
                maxHeight = viewer.LineElements.MaxTextElementHeight;
                maxDescent = maxHeight - viewer.LineElements.MaxTextElementBaselineOffset;
            }
            var beforeSpacing = this.GetBeforeSpacing();
            if (viewer.CurrentHeaderFooter == null
                && viewer.ClientActiveArea.Height < beforeSpacing + maxHeight && viewer.ClientActiveArea.Y != viewer.ClientArea.Y)
                this.MoveToNextPage(viewer);
            var lineSpacing = this.GetLineSpacing(maxHeight);
            var lineWidget = this.AddLineWidget();
            var topMargin = 0, bottomMargin = 0, leftMargin = 0, height = maxHeight, listTopMargin = 0;
            var element = null;
            if (viewer.LineElements.Count > 0)
                element = viewer.LineElements[0];
            if (element != null) {
                var baselineOffset = element.BaselineOffset;
                topMargin = viewer.LineElements.MaxBaselineOffset - baselineOffset;
                if (element.Height < maxHeight)
                    listTopMargin = maxHeight - maxDescent - (element.Height - (element.Height - baselineOffset));
                else
                    height = element.Height;
            }
            var lineSpacingType = this.ParagraphFormat.LineSpacingType;
            if (lineSpacingType == LineSpacingType.Multiple) {
                if (lineSpacing > maxHeight)
                    bottomMargin += lineSpacing - maxHeight;
                else
                    topMargin += lineSpacing - maxHeight;
            }
            else if (lineSpacingType == LineSpacingType.Exactly)
                topMargin += lineSpacing - (topMargin + height + bottomMargin);
            else if (lineSpacing > topMargin + height + bottomMargin)
                topMargin += lineSpacing - (topMargin + height + bottomMargin);
            topMargin += beforeSpacing;
            bottomMargin += this.ParagraphFormat.AfterSpacing;
            if (element != null) {
                var textAlignment = this.ParagraphFormat.TextAlignment;
                if (textAlignment == TextAlignment.Right)
                    leftMargin = viewer.ClientArea.Width - element.Width;
                else if (textAlignment == TextAlignment.Center)
                    leftMargin = (viewer.ClientArea.Width - element.Width) / 2;
                element.Margin = new Margin(leftMargin, listTopMargin + topMargin, 0, bottomMargin);
                element.CurrentLineWidget = lineWidget;
                lineWidget.Height = topMargin + height + bottomMargin;
                lineWidget.Children.Add(element);
            }
            if (viewer.LineElements.Count > 1 && viewer.LineElements[1] instanceof ListTextElementBox) {
                element = viewer.LineElements[1];
                var textAlignment = this.ParagraphFormat.TextAlignment;
                if (textAlignment == TextAlignment.Right)
                    leftMargin = viewer.ClientArea.Width - element.Width;
                else if (textAlignment == TextAlignment.Center)
                    leftMargin = (viewer.ClientArea.Width - element.Width) / 2;
                element.Margin = new Margin(leftMargin, listTopMargin + topMargin, 0, bottomMargin);
                element.CurrentLineWidget = lineWidget;
                lineWidget.Height = topMargin + height + bottomMargin;
                lineWidget.Children.Add(element);
            }
            lineWidget.Height = topMargin + height + bottomMargin;
            viewer.CutFromTop(viewer.ClientActiveArea.Y + lineWidget.Height);
            viewer.LineElements.Clear();
        };
        ParagraphAdv.prototype.MoveToNextPage = function (viewer) {
            var paragraphWidget = this.ParagraphWidgets[this.ParagraphWidgets.length - 1];
            var elements = null;
            if (viewer.LineElements.length > 0) {
                elements = viewer.LineElements.ToList();
                viewer.LineElements.Clear();
            }
            var prevBodyWidget = null;
            if (paragraphWidget.ChildWidgets.Count > 0) {
                this.UpdateWidgetToPage(viewer);
                prevBodyWidget = paragraphWidget.ContainerWidget;
            }
            else {
                if (this.PreviousBlock instanceof ParagraphAdv)
                    prevBodyWidget = this.PreviousBlock.ParagraphWidgets[this.PreviousBlock.ParagraphWidgets.Count - 1].ContainerWidget;
                else if (this.PreviousBlock instanceof TableAdv)
                    prevBodyWidget = this.PreviousBlock.TableWidgets[this.PreviousBlock.TableWidgets.Count - 1].ContainerWidget;
            }
            var pageIndex = 0;
            if (prevBodyWidget != null)
                pageIndex = viewer.Pages.IndexOf(prevBodyWidget.Page);
            if (pageIndex == viewer.Pages.Count - 1
                || viewer.Pages[pageIndex + 1].Section != this.Section) {
                var page = viewer.CreateNewPage(this.Section);
                if (viewer.Pages[pageIndex + 1].Section != this.Section)
                    viewer.InsertPage(pageIndex + 1, page);
            }
            else {
                viewer.Pages[pageIndex + 1].BoundingRectangle = new Rect(viewer.Pages[pageIndex + 1].BoundingRectangle.X, viewer.Pages[pageIndex].BoundingRectangle.Bottom + 20, viewer.Pages[pageIndex + 1].BoundingRectangle.Width, viewer.Pages[pageIndex + 1].BoundingRectangle.Height);
                viewer.UpdateClientArea(this.Section.SectionFormat);
            }
            viewer.UpdateClientAreaForBlock(this, true);
            if (paragraphWidget.ChildWidgets.Count > 0)
                this.AddParagraphWidget(viewer.ClientActiveArea);
            else
                paragraphWidget.UpdateClientAreaLocation(viewer.ClientActiveArea);
            if (elements != null && viewer.LineElements.Count == 0) {
                var left = viewer.ClientActiveArea.X;
                for (var i = 0; i < elements.Count; i++) {
                    var element = elements[i];
                    left += element.Width;
                    viewer.LineElements.Add(element);
                }
                viewer.CutFromLeft(left);
            }
        };
        ParagraphAdv.prototype.UpdateWidgetToPage = function (viewer) {
            var paragraphWidget = this.ParagraphWidgets[this.ParagraphWidgets.length - 1];
            if (this.IsInsideTable) {
                var cellWidget = this.AssociatedCell.TableCellWidgets[this.AssociatedCell.TableCellWidgets.length - 1];
                paragraphWidget.Height = viewer.ClientActiveArea.Y - paragraphWidget.Y;
                if (viewer instanceof PageLayoutViewer) {
                    if (this.AssociatedCell.OwnerRow.RowFormat.HeightType == HeightType.Exactly)
                        cellWidget.Height = this.AssociatedCell.OwnerRow.RowFormat.Height;
                    else {
                        if (this.AssociatedCell.TableCellWidgets.Count <= 1 && this.AssociatedCell.OwnerRow.RowFormat.HeightType == HeightType.Atleast)
                            cellWidget.Height = Math.max(this.AssociatedCell.OwnerRow.RowFormat.Height, cellWidget.Height + paragraphWidget.Height);
                        else
                            cellWidget.Height = cellWidget.Height + paragraphWidget.Height;
                    }
                }
                else
                    cellWidget.Height = cellWidget.Height + paragraphWidget.Height;
                cellWidget.ChildWidgets.Add(paragraphWidget);
                paragraphWidget.ContainerWidget = cellWidget;
            }
            else {
                paragraphWidget.Height = viewer.ClientActiveArea.Y - paragraphWidget.Y;
                this._UpdateWidgetsToBody(viewer, paragraphWidget);
            }
        };
        ParagraphAdv.prototype.GetBeforeSpacing = function () {
            var beforeSpacing = 0;
            if (this.PreviousBlock instanceof ParagraphAdv) {
                if (this.PreviousBlock.ParagraphFormat.AfterSpacing < this.ParagraphFormat.BeforeSpacing)
                    beforeSpacing = this.ParagraphFormat.BeforeSpacing - this.PreviousBlock.ParagraphFormat.AfterSpacing;
            }
            else
                beforeSpacing = this.ParagraphFormat.BeforeSpacing;
            return beforeSpacing;
        };
        ParagraphAdv.prototype.GetLineSpacing = function (maxHeight) {
            var lineSpacing = 0;
            switch (this.ParagraphFormat.LineSpacingType) {
                case LineSpacingType.AtLeast:
                case LineSpacingType.Exactly:
                    lineSpacing = this.ParagraphFormat.LineSpacing;
                    break;
                default:
                    lineSpacing = this.ParagraphFormat.LineSpacing * maxHeight;
                    break;
            }
            return lineSpacing;
        };
        ParagraphAdv.prototype.GetParagraphMarkSize = function (topMargin, bottomMargin) {
            var size = TextHelper.GetParagraphMarkSize(this.CharacterFormat);
            var baselineOffset = size.BaselineOffset;
            var maxHeight = size.Height;
            var maxBaselineOffset = baselineOffset;
            if (this.paragraphWidgets.Count > 0 && this.paragraphWidgets[0].ChildWidgets.Count > 0) {
                var lineWidget = this.paragraphWidgets[0].ChildWidgets[0];
                if (lineWidget.Children.Count > 0 && lineWidget.Children[0] instanceof ListTextElementBox
                    && maxHeight < lineWidget.Children[0].Height) {
                    maxHeight = lineWidget.Children[0].Height;
                    maxBaselineOffset = lineWidget.Children[0].BaselineOffset;
                }
            }
            var lineSpacing = this.GetLineSpacing(maxHeight);
            var beforeSpacing = this.GetBeforeSpacing();
            topMargin = maxBaselineOffset - baselineOffset;
            bottomMargin = maxHeight - maxBaselineOffset - (size.Height - baselineOffset);
            var lineSpacingType = this.ParagraphFormat.LineSpacingType;
            if (lineSpacingType == LineSpacingType.Multiple) {
                if (lineSpacing > maxHeight)
                    bottomMargin += lineSpacing - maxHeight;
                else
                    topMargin += lineSpacing - maxHeight;
            }
            else if (lineSpacingType == LineSpacingType.Exactly)
                topMargin += lineSpacing - (topMargin + size.Height + bottomMargin);
            else if (lineSpacing > topMargin + size.Height + bottomMargin)
                topMargin += lineSpacing - (topMargin + size.Height + bottomMargin);
            topMargin += beforeSpacing;
            bottomMargin += this.ParagraphFormat.AfterSpacing;
            return { "Width": size.Width, "Height": size.Height, "TopMargin": topMargin, "BottomMargin": bottomMargin };
        };
        ParagraphAdv.prototype.AddLineWidget = function () {
            var line = null;
            var paragraphWidget;
            paragraphWidget = this.ParagraphWidgets[this.ParagraphWidgets.length - 1];
            line = new LineWidget(paragraphWidget);
            line.Width = paragraphWidget.Width;
            paragraphWidget.ChildWidgets.push(line);
            line.CurrentParagraphWidget = paragraphWidget;
            return line;
        };
        ParagraphAdv.prototype.GetStartOffset = function () {
            var startOffset = 0;
            for (var i = 0; i < this.Inlines.length; i++) {
                var inline = this.Inlines[i];
                if (inline.Length == 0)
                    continue;
                if (inline instanceof SpanAdv || inline instanceof ImageAdv
                    || (inline instanceof FieldCharacterAdv && inline.IsLinkedFieldCharacter()))
                    return startOffset;
                startOffset += inline.Length;
            }
            return startOffset;
        };
        ParagraphAdv.prototype.GetLength = function () {
            var index = 0;
            for (var i = 0; i < this.Inlines.length; i++) {
                index += this.Inlines[i].Length;
            }
            return index;
        };
        ParagraphAdv.prototype.GetOffset = function (inline, index) {
            if (inline == null)
                return index;
            var textIndex = index;
            for (var i = 0; i < this.Inlines.length; i++) {
                if (inline == this.Inlines[i])
                    break;
                textIndex += this.Inlines[i].Length;
            }
            return textIndex;
        };
        ParagraphAdv.prototype.GetLineWidget = function (offset) {
            var lineWidget = null;
            if (this.IsEmpty()) {
                if (this.paragraphWidgets.Count > 0 && this.paragraphWidgets[0].ChildWidgets.Count > 0)
                    lineWidget = this.paragraphWidgets[0].ChildWidgets[0];
            }
            else {
                var indexInInline = 0;
                var inlineInfo = this.GetInline(offset, indexInInline);
                var inline = inlineInfo.inline;
                indexInInline = inlineInfo.index;
                lineWidget = inline.GetLineWidget(indexInInline);
            }
            return lineWidget;
        };
        ParagraphAdv.prototype.GetLineWidgetInternal = function (offset, moveToNextLine) {
            var lineWidget = null;
            if (this.IsEmpty()) {
                if (this.paragraphWidgets.Count > 0 && this.paragraphWidgets[0].ChildWidgets.Count > 0)
                    lineWidget = this.paragraphWidgets[0].ChildWidgets[0];
            }
            else {
                var indexInInline = 0;
                var inlineInfo = this.GetInline(offset, indexInInline);
                var inline = inlineInfo.inline;
                indexInInline = inlineInfo.index;
                lineWidget = inline.GetLineWidgetInternal(indexInInline, moveToNextLine);
            }
            return lineWidget;
        };
        ParagraphAdv.prototype.GetPhysicalPosition = function (offset) {
            return this.GetPhysicalPositionInternal(offset, true);
        };
        ParagraphAdv.prototype.GetPhysicalPositionInternal = function (offset, moveNextLine) {
            if (this.IsEmpty()) {
                var left = this.paragraphWidgets[0].X;
                if (this.paragraphWidgets[0].ChildWidgets.length > 0) {
                    var lineWidget = this.paragraphWidgets[0].ChildWidgets[0];
                    left = lineWidget.GetLeft();
                }
                var topMargin = 0;
                var bottomMargin = 0;
                var size = this.GetParagraphMarkSize(topMargin, bottomMargin);
                if (offset > 0)
                    left += size.Width;
                return new Point(left, this.paragraphWidgets[0].Y + topMargin);
            }
            else {
                var indexInInline = 0;
                var inlineObj = this.GetInline(offset, indexInInline);
                var inline = inlineObj.inline;
                indexInInline = inlineObj.index;
                if (inline.Length == indexInInline && inline.NextNode != null && inline.Elements.Count > 0 && inline.NextNode.Elements.Count > 0
                    && inline.Elements[inline.Elements.Count - 1].CurrentLineWidget != inline.NextNode.Elements[0].CurrentLineWidget) {
                    inline = inline.NextNode;
                    indexInInline = 0;
                }
                return inline.GetPhysicalPosition(indexInInline, moveNextLine);
            }
        };
        ParagraphAdv.prototype.GetEndPosition = function () {
            var widget = this.paragraphWidgets[this.paragraphWidgets.Count - 1];
            var left = widget.X;
            var top = widget.Y;
            var lineWidget = null;
            if (widget.ChildWidgets.Count > 0) {
                lineWidget = widget.ChildWidgets[widget.ChildWidgets.Count - 1];
                left += lineWidget.GetWidth(false);
            }
            if (lineWidget != null)
                top = lineWidget.GetTop();
            var topMargin = 0, bottomMargin = 0;
            var size = this.GetParagraphMarkSize(topMargin, bottomMargin);
            return new Point(left, top + size.TopMargin);
        };
        ParagraphAdv.prototype.GetInline = function (offset, indexInInline) {
            var inline = null;
            var count = 0;
            var isStarted = false;
            for (var i = 0; i < this.Inlines.length; i++) {
                inline = this.Inlines[i];
                if (!isStarted && (inline instanceof SpanAdv || inline instanceof ImageAdv
                    || (inline instanceof FieldCharacterAdv && inline.IsLinkedFieldCharacter())))
                    isStarted = true;
                if (isStarted && offset <= count + inline.Length) {
                    indexInInline = (offset - count);
                    if (indexInInline < 0)
                        indexInInline = 0;
                    return { "inline": inline, "index": indexInInline };
                }
                count += inline.Length;
            }
            if (offset > count)
                indexInInline = inline == null ? offset : inline.Length;
            return { "inline": inline, "index": indexInInline };
        };
        ParagraphAdv.prototype.HighlightSelectedContent = function (selection, selectionRange, start, end) {
            if (start.Paragraph.IsInsideTable && (!end.Paragraph.IsInsideTable
                || start.Paragraph.AssociatedCell != end.Paragraph.AssociatedCell
                || start.Paragraph.AssociatedCell.IsCellSelected(start, end))) {
                start.Paragraph.AssociatedCell.Highlight(selection, selectionRange, start, end);
            }
            else {
                var inline = null;
                var index = 0;
                if (this == end.Paragraph) {
                    if (start.Offset + 1 == end.Offset) {
                        var inlineObj = this.GetInline(end.Offset, index);
                        inline = inlineObj.inline;
                        index = inlineObj.index;
                        if (inline instanceof ImageAdv) {
                            var startOffset = this.GetOffset(inline, 0);
                            if (startOffset != start.Offset)
                                inline = null;
                        }
                    }
                    else {
                        var indexInInline = 0;
                        var startInlineObj = start.Paragraph.GetInline(start.Offset, indexInInline);
                        var startInline = startInlineObj.inline;
                        indexInInline = startInlineObj.index;
                        if (indexInInline == startInline.Length)
                            startInline = startInline.GetNextRenderedInline(indexInInline);
                        var endInlineObj = end.Paragraph.GetInline(end.Offset, indexInInline);
                        var endInline = endInlineObj.inline;
                        indexInInline = endInlineObj.index;
                        if (startInline instanceof FieldBeginAdv && endInline instanceof FieldEndAdv && startInline.fieldSeparator != null) {
                            var fieldValue = startInline.fieldSeparator.NextNode;
                            if (fieldValue instanceof ImageAdv && fieldValue.NextNode == endInline)
                                inline = fieldValue;
                        }
                    }
                }
                if (inline instanceof ImageAdv && selection.OwnerControl.IsDocumentLoaded) {
                    var elementBoxObj = inline.GetElementBoxInternal(index);
                    var elementBox = elementBoxObj.element;
                    index = elementBoxObj.index;
                }
                else
                    this.Highlight(selection, selectionRange, start, end);
            }
        };
        ParagraphAdv.prototype.Highlight = function (selection, selectionRange, start, end) {
            var selectionStartIndex = 0;
            var selectionEndIndex = 0;
            var startElement = null;
            var endElement = null;
            var startLineObj = this.GetStartLineWidget(start, startElement, selectionStartIndex);
            var startLineWidget = startLineObj.lineWidget;
            startElement = startLineObj.startElement;
            selectionStartIndex = startLineObj.lineIndex;
            var endLineObj = this.GetEndLineWidget(end, endElement, selectionEndIndex);
            var endLineWidget = endLineObj.lineWidget;
            endElement = endLineObj.endElement;
            selectionEndIndex = endLineObj.lineIndex;
            var top = 0;
            var left = 0;
            if (startLineWidget != null) {
                top = startLineWidget.GetTop();
                left = startLineWidget.GetLeftInternal(startElement, selectionStartIndex);
            }
            if (startLineWidget != null && startLineWidget == endLineWidget) {
                var right = endLineWidget.GetLeftInternal(endElement, selectionEndIndex);
                selection.CreateHighlightBorder(selectionRange, startLineWidget, right - left, left, top);
            }
            else {
                var paragraph = this;
                if (startLineWidget != null) {
                    if (paragraph != startLineWidget.CurrentParagraphWidget.CurrentNode)
                        paragraph = startLineWidget.CurrentParagraphWidget.CurrentNode;
                    selection.CreateHighlightBorder(selectionRange, startLineWidget, startLineWidget.GetWidth(true) - (left - startLineWidget.CurrentParagraphWidget.X), left, top);
                    var lineIndex = startLineWidget.CurrentParagraphWidget.ChildWidgets.IndexOf(startLineWidget);
                    var startParagraphWidget = paragraph.ParagraphWidgets.IndexOf(startLineWidget.CurrentParagraphWidget);
                    for (var i = startParagraphWidget; i < paragraph.ParagraphWidgets.Count; i++) {
                        if (i == startParagraphWidget)
                            lineIndex += 1;
                        paragraph.ParagraphWidgets[i].Highlight(selection, selectionRange, lineIndex, endLineWidget, endElement, selectionEndIndex);
                        if (paragraph.ParagraphWidgets[i] == endLineWidget.CurrentParagraphWidget)
                            return;
                        else
                            lineIndex = 0;
                    }
                }
                var block = paragraph.GetNextRenderedBlock();
                if (block != null)
                    block.Highlight(selection, selectionRange, start, end);
            }
        };
        ParagraphAdv.prototype.GetStartLineWidget = function (start, startElement, selectionStartIndex) {
            var offset = (this == start.Paragraph ? start.Offset : this.GetStartOffset());
            var startInlineObj = this.GetInline(offset, selectionStartIndex);
            var startInline = startInlineObj.inline;
            selectionStartIndex = startInlineObj.index;
            if (startInline instanceof FieldCharacterAdv) {
                var inlineInfo = startInline.GetRenderedInline(selectionStartIndex);
                startInline = inlineInfo.Inline;
                selectionStartIndex = inlineInfo.InlineIndex;
            }
            if (offset == this.GetLength() + 1)
                selectionStartIndex++;
            if (startInline == null) {
                if (this.ParagraphWidgets.Count > 0) {
                    var widget = this.ParagraphWidgets[0];
                    return { "lineWidget": widget.ChildWidgets.Count > 0 ? widget.ChildWidgets[0] : null, "lineIndex": selectionStartIndex, "startElement": startElement };
                }
                else
                    return null;
            }
            else {
                var startElementObj = startInline.GetElementBoxInternal(selectionStartIndex);
                startElement = startElementObj.element;
                selectionStartIndex = startElementObj.index;
                var lineWidget = startElement.CurrentLineWidget;
                if (startElement == null)
                    lineWidget = startInline.GetLineWidget(selectionStartIndex);
                return { "lineWidget": lineWidget, "lineIndex": selectionStartIndex, "startElement": startElement };
            }
        };
        ParagraphAdv.prototype.GetEndLineWidget = function (end, endElement, selectionEndIndex) {
            var endInlineObj = end.Paragraph.GetInline(end.Offset, selectionEndIndex);
            var endInline = endInlineObj.inline;
            selectionEndIndex = endInlineObj.index;
            if (endInline instanceof FieldCharacterAdv) {
                var inlineInfo = endInline.GetRenderedInline(selectionEndIndex);
                endInline = inlineInfo.Inline;
                selectionEndIndex = inlineInfo.InlineIndex;
            }
            if (endInline == null) {
                if (end.Offset == end.Paragraph.GetLength() + 1)
                    selectionEndIndex = 1;
                if (end.Paragraph.ParagraphWidgets.Count > 0) {
                    var widget = end.Paragraph.ParagraphWidgets[end.Paragraph.ParagraphWidgets.Count - 1];
                    return { "lineWidget": widget.ChildWidgets.Count > 0 ? widget.ChildWidgets[widget.ChildWidgets.Count - 1] : null, "lineIndex": selectionEndIndex, "endElement": endElement };
                }
                else
                    return null;
            }
            else {
                if (end.Offset == end.Paragraph.GetLength() + 1)
                    selectionEndIndex = endInline.Length + 1;
                var endElementObj = endInline.GetElementBoxInternal(selectionEndIndex);
                endElement = endElementObj.element;
                selectionEndIndex = endElementObj.index;
                if (endElement == null)
                    return { "lineWidget": endInline.GetLineWidget(selectionEndIndex), "lineIndex": selectionEndIndex, "endElement": endElement };
                return { "lineWidget": endElement.CurrentLineWidget, "lineIndex": selectionEndIndex, "endElement": endElement };
            }
        };
        ParagraphAdv.prototype.HasValidInline = function (start, end) {
            for (var i = this.Inlines.IndexOf(start); i < this.Inlines.Count; i++) {
                var inline = this.Inlines[i];
                if (inline.Length == 0)
                    continue;
                if (inline == end)
                    return false;
                if (inline instanceof SpanAdv || inline instanceof ImageAdv
                    || (inline instanceof FieldCharacterAdv && inline.IsLinkedFieldCharacter()))
                    return true;
            }
            return false;
        };
        ParagraphAdv.prototype.GetPreviousValidOffset = function (offset) {
            if (offset == 0)
                return 0;
            var validOffset = 0;
            var count = 0;
            for (var i = 0; i < this.Inlines.Count; i++) {
                var inline = this.Inlines[i];
                if (inline.Length == 0)
                    continue;
                if (offset <= count + inline.Length)
                    return offset - 1 == count ? validOffset : offset - 1;
                if (inline instanceof SpanAdv || inline instanceof ImageAdv
                    || (inline instanceof FieldCharacterAdv && inline.IsLinkedFieldCharacter()))
                    validOffset = count + inline.Length;
                count += inline.Length;
            }
            return offset - 1 == count ? validOffset : offset - 1;
        };
        ParagraphAdv.prototype.GetEndOffset = function () {
            var startOffset = 0;
            var count = 0;
            for (var i = 0; i < this.Inlines.Count; i++) {
                var inline = this.Inlines[i];
                if (this.Inlines.length == 0)
                    continue;
                if (inline instanceof SpanAdv || inline instanceof ImageAdv
                    || (inline instanceof FieldCharacterAdv && inline.IsLinkedFieldCharacter()))
                    startOffset = count + inline.Length;
                count += inline.Length;
            }
            return startOffset;
        };
        ParagraphAdv.prototype.GetNextStartInline = function (offset) {
            var indexInInline = 0;
            var inlineObj = this.GetInline(offset, indexInInline);
            var inline = inlineObj.inline;
            indexInInline = inlineObj.index;
            if (inline != null && indexInInline == inline.Length && inline.NextNode instanceof FieldCharacterAdv) {
                var nextValidInline = inline.NextNode.GetNextValidInline();
                if (nextValidInline instanceof FieldBeginAdv)
                    inline = nextValidInline;
            }
            return inline;
        };
        ParagraphAdv.prototype.GetNextValidOffset = function (offset) {
            var count = 0;
            for (var i = 0; i < this.Inlines.Count; i++) {
                var inline = this.Inlines[i];
                if (inline.Length == 0)
                    continue;
                if (offset < count + inline.Length) {
                    if (inline instanceof SpanAdv || inline instanceof ImageAdv
                        || (inline instanceof FieldCharacterAdv && inline.IsLinkedFieldCharacter()))
                        return (offset > count ? offset : count) + 1;
                }
                count += inline.Length;
            }
            return offset;
        };
        ParagraphAdv.prototype.SplitByBreakCharacter = function (paragraph, span, index) {
            var oldParaCopy = new ParagraphAdv(this);
            for (var i = 0; i < paragraph.Inlines.Count; i++) {
                oldParaCopy.Inlines.Add(paragraph.Inlines[i]);
            }
            paragraph.Section.Blocks.Remove(paragraph);
            var beforePara = new ParagraphAdv(this);
            beforePara.ParagraphFormat.CopyFormat(paragraph.ParagraphFormat);
            beforePara.CharacterFormat.CopyFormat(paragraph.CharacterFormat);
            var afterPara = new ParagraphAdv(this);
            beforePara.ParagraphFormat.CopyFormat(paragraph.ParagraphFormat);
            beforePara.CharacterFormat.CopyFormat(paragraph.CharacterFormat);
            for (var i = 0; i < index; i++) {
                beforePara.Inlines.Add(oldParaCopy.Inlines[i]);
            }
            for (var i = index + 1; i < oldParaCopy.Inlines.Count; i++) {
                afterPara.Inlines.Add(oldParaCopy.Inlines[i]);
            }
            span.SplitByBreakCharacter(span, span.Text, beforePara, afterPara);
        };
        ParagraphAdv.prototype.GetSelectedContent = function (selection, start, end) {
            if (start.Paragraph.IsInsideTable && (!end.Paragraph.IsInsideTable
                || start.Paragraph.AssociatedCell != end.Paragraph.AssociatedCell
                || start.Paragraph.AssociatedCell.IsCellSelected(start, end))) {
                return start.Paragraph.AssociatedCell.GetSelectedContentAsHtmlInternal(selection, start, end);
            }
            else {
                return this.GetSelectedContentAsHtml(selection, start, end);
            }
        };
        ParagraphAdv.prototype.GetSelectedContentAsHtml = function (selection, start, end) {
            var html = "";
            var inline = null, startInline = null, endInline = null;
            var startInlineIndex = 0, endInlineIndex = 0;
            var listLevel = null;
            if (this.ParagraphFormat.ListFormat != null)
                listLevel = this.ParagraphFormat.ListFormat.ListLevel;
            if (end.Paragraph == this) {
                if (end.Paragraph.IsEmpty()) {
                    if (end.Offset = this.GetStartOffset())
                        return "";
                    if (listLevel != null) {
                        html += this.GetHtmlList(listLevel, start);
                        html += "<li ";
                    }
                    else
                        html += "<p ";
                    html += this.ParagraphFormat.GetAsHtmlStyle() + "/>";
                    if (html.indexOf("<ul") > -1)
                        html += "</ul>";
                    else if (html.indexOf("<ol") > -1)
                        html += "</ol>";
                    return html;
                }
                var inlineInfo = this.GetInline(end.Offset, 0);
                endInline = inlineInfo.inline;
                endInlineIndex = inlineInfo.index;
            }
            if (start.Paragraph == this) {
                if (start.Offset == this.GetLength() + 1) {
                }
                else {
                    if (listLevel != null) {
                        html += this.GetHtmlList(listLevel, start);
                        html += "<li ";
                    }
                    else
                        html += "<p ";
                    html += this.ParagraphFormat.GetAsHtmlStyle() + ">";
                    if (!this.IsEmpty()) {
                        var inlineInfo = this.GetInline(start.Offset, 0);
                        inline = startInline = inlineInfo.inline;
                        startInlineIndex = inlineInfo.index;
                    }
                }
            }
            else {
                if (listLevel != null) {
                    html += this.GetHtmlList(listLevel, start);
                    html += "<li ";
                }
                else
                    html += "<p ";
                html += this.ParagraphFormat.GetAsHtmlStyle() + ">";
                if (this.Inlines.Count > 0)
                    inline = this.Inlines[0];
            }
            var currentParagraph = this;
            if (inline == null && html != null)
                html += "&nbsp;";
            while (inline != null) {
                if (inline instanceof SpanAdv) {
                    html += "<span ";
                    html += inline.CharacterFormat.GetAsHtmlStyle();
                    html += ">";
                    if (endInline == inline) {
                        if (endInline == startInline)
                            html += this.DecodeHtmlNames(inline.Text.substring(startInlineIndex, endInlineIndex));
                        else
                            html += this.DecodeHtmlNames(inline.Text.substring(0, endInlineIndex));
                    }
                    else if (startInline == inline)
                        html += this.DecodeHtmlNames(inline.Text.substring(startInlineIndex, startInline.Length));
                    else
                        html += this.DecodeHtmlNames(inline.Text);
                    html += "</span>";
                }
                else if (inline instanceof ImageAdv) {
                    html += "<img ";
                    html += "width=\"" + inline.Width + "\" ";
                    html += "height=\"" + inline.Height + "\" ";
                    html += "src=\"" + inline.ImageString + "\" ";
                    html += inline.CharacterFormat.GetAsHtmlStyle();
                    html += "/>";
                }
                else if (inline instanceof FieldBeginAdv && inline.IsLinkedFieldCharacter()) {
                    var fieldCode = inline.GetFieldCode();
                    var fieldCodeLower = fieldCode.toLowerCase();
                    var index = fieldCodeLower.indexOf("hyperlink");
                    if (index > -1) {
                        fieldCode = fieldCode.substr(index + 9).trim();
                        html += "<a href=" + fieldCode + ">";
                    }
                    inline = inline.fieldSeparator;
                }
                else if (inline instanceof FieldEndAdv && inline.IsLinkedFieldCharacter()) {
                    var fieldCode = inline.FieldBegin.GetFieldCode();
                    var fieldCodeLower = fieldCode.toLowerCase();
                    var index = fieldCodeLower.indexOf("hyperlink");
                    if (index > -1) {
                        html += "</a>";
                    }
                }
                currentParagraph = inline.OwnerParagraph;
                if (inline == endInline)
                    break;
                inline = inline.NextNode;
            }
            if (html != "") {
                if (listLevel != null) {
                    html += "</li>";
                    if (html.indexOf("<ul") > -1)
                        html += "</ul>";
                    else if (html.indexOf("<ol") > -1)
                        html += "</ol>";
                }
                else
                    html += "</p>";
            }
            if (end.Paragraph != currentParagraph) {
                var block = this.GetNextRenderedBlock();
                if (block != null)
                    html += block.GetSelectedContentAsHtml(selection, start, end);
            }
            return html;
        };
        ParagraphAdv.prototype.GetContentAsHtml = function () {
            var listLevel = null;
            if (this.ParagraphFormat.ListFormat != null)
                listLevel = this.ParagraphFormat.ListFormat.ListLevel;
            var html = "";
            if (listLevel != null) {
                html += this.GetHtmlList(listLevel, null);
                html += "<li ";
            }
            else
                html += "<p ";
            html += this.ParagraphFormat.GetAsHtmlStyle();
            html += ">";
            if (this.Inlines.length == 0)
                html += "&nbsp;";
            for (var i = 0; i < this.Inlines.length; i++) {
                var inline = this.Inlines[i];
                if (inline instanceof SpanAdv) {
                    html += "<span ";
                    html += inline.CharacterFormat.GetAsHtmlStyle();
                    html += ">";
                    html += this.DecodeHtmlNames(inline.Text);
                    html += "</span>";
                }
                else if (inline instanceof ImageAdv) {
                    html += "<img ";
                    html += "width=\"" + inline.Width + "\" ";
                    html += "height=\"" + inline.Height + "\" ";
                    html += "src=\"" + inline.ImageString + "\" ";
                    html += inline.CharacterFormat.GetAsHtmlStyle();
                    html += "/>";
                }
            }
            if (listLevel != null) {
                html += "</li>";
                if (html.indexOf("<ul") > -1)
                    html += "</ul>";
                else if (html.indexOf("<ol") > -1)
                    html += "</ol>";
            }
            else
                html += "</p>";
            return html;
        };
        ParagraphAdv.prototype.GetHtmlList = function (listLevel, start) {
            var html = "";
            if (listLevel.ListLevelPattern == ListLevelPattern.Bullet) {
                html += "<ul type=\"";
                switch (listLevel.NumberFormat) {
                    case ListLevelAdv.SQUAREBULLET:
                        if (listLevel.CharacterFormat.FontFamily != null && listLevel.CharacterFormat.FontFamily == "Wingdings")
                            html += "square";
                        break;
                    case ListLevelAdv.DOTBULLET:
                        if (listLevel.CharacterFormat.FontFamily != null && listLevel.CharacterFormat.FontFamily == "Symbol")
                            html += "disc";
                        break;
                    case ListLevelAdv.CIRCLEBULLET:
                        if (listLevel.CharacterFormat.FontFamily != null && listLevel.CharacterFormat.FontFamily == "Symbol")
                            html += "circle";
                        break;
                }
                html += "\">";
            }
            else {
                html += "<ol type=\"";
                switch (listLevel.ListLevelPattern) {
                    case ListLevelPattern.Number:
                    case ListLevelPattern.Arabic:
                    case ListLevelPattern.Ordinal:
                        html += "1";
                        break;
                    case ListLevelPattern.LowLetter:
                        html += "a";
                        break;
                    case ListLevelPattern.UpLetter:
                        html += "A";
                        break;
                    case ListLevelPattern.LowRoman:
                        html += "i";
                        break;
                    case ListLevelPattern.UpRoman:
                        html += "I";
                        break;
                }
                html += "\" start=\"" + listLevel.StartAt.toString() + "\">";
            }
            return html;
        };
        ParagraphAdv.prototype.ClearWidgets = function () {
            if (this.paragraphWidgets != null
                && this.paragraphWidgets.Count > 0) {
                for (var i = 0; i < this.paragraphWidgets.Count; i++) {
                    var widget = this.paragraphWidgets[i];
                    widget.Dispose();
                    this.paragraphWidgets.Remove(widget);
                    i--;
                }
            }
        };
        ParagraphAdv.prototype.Dispose = function () {
            this.CharacterFormat.Dispose();
            this.ParagraphFormat.Dispose();
            this.SetOwner(null);
            if (this.paragraphWidgets != null) {
                this.ClearWidgets();
                this.paragraphWidgets = null;
            }
            if (this.Inlines != null) {
                this.Inlines.Dispose();
                for (var i = 0; i < this.Inlines.Count; i++) {
                    var inline = this.Inlines[i];
                    inline.Dispose();
                    this.Inlines.Remove(inline);
                    i--;
                }
                this.ChildNodes = null;
            }
            this.Fields = null;
            this.FieldCharacter = null;
        };
        ParagraphAdv.prototype.DecodeHtmlNames = function (text) {
            if (text == "\t")
                return "&emsp;";
            var splittedText = text.split(" ");
            var htmlText = "";
            if (splittedText.length > 0) {
                htmlText = splittedText[0];
                for (var i = 0; i < splittedText.length - 1; i++) {
                    htmlText += "&nbsp;" + splittedText[i + 1];
                }
            }
            return htmlText;
        };
        return ParagraphAdv;
    }(BlockAdv));
    DocumentEditorFeatures.ParagraphAdv = ParagraphAdv;
    var Inline = (function (_super) {
        __extends(Inline, _super);
        function Inline(owner) {
            _super.call(this, owner);
            this.WordSplitCharacters = [' ', ',', '.', ':', ';', '<', '>', '=', '+', '-', '_', '{', '}', '[', ']', '`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '"', '?', '/', '|', '\\', '”'];
            this.characterFormat = new CharacterFormat(this);
            this.Elements = new List();
        }
        Object.defineProperty(Inline.prototype, "CharacterFormat", {
            get: function () {
                return this.characterFormat;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Inline.prototype, "OwnerParagraph", {
            get: function () {
                return this.Owner;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Inline.prototype, "Length", {
            get: function () {
                return 1;
            },
            enumerable: true,
            configurable: true
        });
        Inline.prototype.LayoutFieldCharacter = function (viewer) {
            if (this instanceof FieldBeginAdv) {
                var field = this;
                if (!viewer.IsFieldCode && (field.fieldEnd != null || field.HasFieldEnd)) {
                    viewer.FieldStack.push(field);
                    viewer.IsFieldCode = true;
                }
            }
            else if (viewer.FieldStack.Count > 0) {
                if (this instanceof FieldSeparatorAdv) {
                    var field = viewer.FieldStack.Last();
                    var fieldLink = this;
                    if (field.fieldSeparator == fieldLink && (field.fieldEnd != null || field.HasFieldEnd))
                        viewer.IsFieldCode = false;
                }
                else {
                    var field = viewer.FieldStack.Last();
                    var instance = this;
                    if (field.fieldEnd == instance) {
                        viewer.FieldStack.RemoveAt(viewer.FieldStack.length - 1);
                        viewer.IsFieldCode = false;
                        if (field.HasFieldEnd)
                            field.HasFieldEnd = false;
                    }
                }
            }
        };
        Inline.prototype.LayoutItems = function (viewer) {
            if (this instanceof FieldCharacterAdv) {
                this.LayoutFieldCharacter(viewer);
                if (this.NextNode == null && !viewer.IsFieldCode) {
                    if (viewer.LineElements.length != 0)
                        this.MoveToNextLine(viewer);
                }
                return;
            }
            if (viewer.IsFieldCode)
                return;
            if (this.Elements != null && this.Elements.Count > 0)
                this.Elements.Clear();
            this.AddElementBox(viewer);
            var element = this.Elements[0];
            var text = "";
            var index = 0;
            var count = 0;
            if (this instanceof SpanAdv) {
                var inline = this;
                text = inline.Text;
            }
            while (count < this.Elements.Count) {
                element = this.Elements[count];
                if (element instanceof TextElementBox && element == this.Elements[0]) {
                    TextHelper.GetTextSize(element, this.CharacterFormat);
                    if (text == "\t")
                        element.Width = this.OwnerParagraph.GetTabWidth(viewer);
                }
                if (viewer.CurrentHeaderFooter == null
                    && viewer.ClientActiveArea.Height < element.Height && viewer.ClientActiveArea.Y != viewer.ClientArea.Y)
                    this.OwnerParagraph.MoveToNextPage(viewer);
                var previoueInline = this.PreviousNode instanceof Inline ? this.PreviousNode : null;
                if (previoueInline != null && previoueInline instanceof SpanAdv && previoueInline.Text == "\v") {
                    this.MoveToNextLine(viewer);
                    element.Width = element.Width;
                }
                if (element.Width < viewer.ClientActiveArea.Width)
                    this.AddElementToline(viewer, element);
                else if (element instanceof TextElementBox) {
                    if (element.Text == "\t") {
                        this.MoveToNextLine(viewer);
                        element.Width = this.OwnerParagraph.GetTabWidth(viewer);
                        this.AddElementToline(viewer, element);
                    }
                    else
                        this.SplitTextForClientArea(viewer, element, element.Text, element.Width, this.CharacterFormat);
                }
                else
                    this.SplitElementForClientArea(element, viewer);
                count = this.Elements.IndexOf(element) + 1;
                if (count >= this.Elements.Count && this.NextNode == null) {
                    this.MoveToNextLine(viewer);
                }
            }
        };
        Inline.prototype.GetSubWidth = function (viewer, justify, spaceCount, firstLineIndent) {
            var width = 0;
            var trimSpace = true;
            var lineText = "";
            for (var i = viewer.LineElements.length - 1; i >= 0; i--) {
                var element = viewer.LineElements[i];
                if (element instanceof TextElementBox) {
                    var elementText = element.Text;
                    lineText = elementText + lineText;
                    if (trimSpace && elementText.trim() != "") {
                        if (/ $/.test(elementText)) {
                            var trimSpaceAtEnd = elementText.replace(/\s\s*$/, '');
                            width += TextHelper.MeasureTextExcludIngSpaceAtEnd(trimSpaceAtEnd, this.CharacterFormat).Width;
                        }
                        else
                            width += element.Width;
                        trimSpace = false;
                    }
                    else if (!trimSpace)
                        width += element.Width;
                }
                else {
                    lineText = "a" + lineText;
                    trimSpace = false;
                    width += element.Width;
                }
                if (!justify)
                    width = Math.round(width);
            }
            lineText = lineText.trim();
            spaceCount = lineText.length - lineText.replace(/\s/g, "").length;
            var subWidth = (viewer.ClientArea.Width - firstLineIndent - width);
            if (subWidth <= 0 || (spaceCount == 0 && justify)) {
                spaceCount = 0;
                subWidth = 0;
            }
            else if (justify)
                subWidth = subWidth / spaceCount;
            return { "subWidth": subWidth, "spaceCount": spaceCount };
        };
        Inline.prototype.IsParagraphFirstLine = function (paragraph) {
            if (paragraph.ParagraphWidgets.length == 1) {
                var widget = paragraph.ParagraphWidgets[0];
                return widget.ChildWidgets == null || widget.ChildWidgets.length == 0;
            }
            return false;
        };
        Inline.prototype.IsParagraphLastLine = function (viewer, paragraph) {
            var lastInline = paragraph.Inlines[paragraph.Inlines.length - 1];
            if (this == lastInline)
                return lastInline.Elements.Count == 0 || viewer.LineElements.Contains(lastInline.Elements[lastInline.Elements.Count - 1]);
            return false;
        };
        Inline.prototype.AlignLineElements = function (viewer, element, topMargin, bottomMargin, maxDescent, addSubWidth, subWidth, textAlignment, whiteSpaceCount, isLastElement) {
            if (element instanceof TextElementBox || element instanceof ListTextElementBox) {
                var textElement = element;
                var baselineOffset = element instanceof TextElementBox ? textElement.BaselineOffset : element.BaselineOffset;
                topMargin += viewer.LineElements.MaxBaselineOffset - baselineOffset;
                bottomMargin += maxDescent - (element.Height - baselineOffset);
                if (textElement != null && textAlignment == TextAlignment.Justify && whiteSpaceCount > 0) {
                    var width = textElement.Width;
                    var text = textElement.Text;
                    if (!addSubWidth) {
                        text = text.replace(/^\s\s*/, '');
                        addSubWidth = (text.length > 0);
                    }
                    if (addSubWidth) {
                        var spaceCount = text.length - text.replace(/\s/g, "").length;
                        if (isLastElement)
                            spaceCount -= text.length - text.replace(/\s\s*$/, '').length;
                        if (whiteSpaceCount < spaceCount) {
                            width = TextHelper.MeasureTextExcludIngSpaceAtEnd(text, this.CharacterFormat).Width;
                            spaceCount = whiteSpaceCount;
                        }
                        if (spaceCount > 0) {
                            textElement.Width = width + subWidth * spaceCount;
                            whiteSpaceCount -= spaceCount;
                        }
                    }
                }
            }
            else {
                addSubWidth = true;
                topMargin += viewer.LineElements.MaxBaselineOffset - element.Height;
                bottomMargin += maxDescent;
            }
            return { "topMargin": topMargin, "bottomMargin": bottomMargin, "addSubWidth": addSubWidth, "whiteSpaceCount": whiteSpaceCount };
        };
        Inline.prototype.MoveToNextLine = function (viewer) {
            var ownerParagraph = this.Owner;
            var paraFormat = ownerParagraph.ParagraphFormat;
            var isParagraphStart = this.IsParagraphFirstLine(ownerParagraph);
            var isParagraphEnd = this.IsParagraphLastLine(viewer, ownerParagraph);
            var maxDescent = 0, afterSpacing = 0, beforeSpacing = 0, lineSpacing = 0, firstLineIndent = 0;
            if (isParagraphStart) {
                beforeSpacing = ownerParagraph.GetBeforeSpacing();
                firstLineIndent = paraFormat.FirstLineIndent;
            }
            if (isParagraphEnd)
                afterSpacing = paraFormat.AfterSpacing;
            var height = 0;
            if (isNaN(viewer.LineElements.MaxTextElementHeight)) {
                var measurement = TextHelper.MeasureText("a", ownerParagraph.CharacterFormat);
                height = measurement.Height;
                maxDescent = height - measurement.BaselineOffset;
            }
            else {
                height = viewer.LineElements.MaxTextElementHeight;
                maxDescent = height - viewer.LineElements.MaxTextElementBaselineOffset;
            }
            if (viewer.CurrentHeaderFooter == null && viewer.ClientActiveArea.Height < beforeSpacing + viewer.LineElements.MaxBaselineOffset + maxDescent && viewer.ClientActiveArea.Y != viewer.ClientArea.Y)
                ownerParagraph.MoveToNextPage(viewer);
            lineSpacing = ownerParagraph.GetLineSpacing(height);
            if (paraFormat.LineSpacingType == LineSpacingType.Exactly
                && lineSpacing < maxDescent + viewer.LineElements.MaxBaselineOffset)
                lineSpacing = maxDescent + viewer.LineElements.MaxBaselineOffset;
            var subWidth = 0;
            var whiteSpaceCount = 0;
            var textAlignment = paraFormat.TextAlignment;
            if (textAlignment != TextAlignment.Left && !(textAlignment == TextAlignment.Justify && isParagraphEnd)) {
                var getWidthAndSpace = this.GetSubWidth(viewer, textAlignment == TextAlignment.Justify, whiteSpaceCount, firstLineIndent);
                subWidth = getWidthAndSpace.subWidth;
                whiteSpaceCount = getWidthAndSpace.spaceCount;
            }
            var line = this.OwnerParagraph.AddLineWidget();
            var addSubWidth = false;
            var lineSpacingType = paraFormat.LineSpacingType;
            for (var i = 0; i < viewer.LineElements.length; i++) {
                var topMargin = 0, bottomMargin = 0, leftMargin = 0;
                var elementBox = viewer.LineElements[i];
                var alignElements = this.AlignLineElements(viewer, elementBox, topMargin, bottomMargin, maxDescent, addSubWidth, subWidth, textAlignment, whiteSpaceCount, i == viewer.LineElements.length - 1);
                topMargin = alignElements.topMargin;
                bottomMargin = alignElements.bottomMargin;
                addSubWidth = alignElements.addSubWidth;
                whiteSpaceCount = alignElements.whiteSpaceCount;
                if (lineSpacingType == LineSpacingType.Multiple) {
                    if (lineSpacing > height)
                        bottomMargin += lineSpacing - height;
                    else
                        topMargin += lineSpacing - height;
                }
                else if (lineSpacingType == LineSpacingType.Exactly)
                    topMargin += lineSpacing - (topMargin + elementBox.Height + bottomMargin);
                else if (lineSpacing > topMargin + elementBox.Height + bottomMargin)
                    topMargin += lineSpacing - (topMargin + elementBox.Height + bottomMargin);
                topMargin += beforeSpacing;
                bottomMargin += afterSpacing;
                if (i == 0) {
                    line.Height = topMargin + elementBox.Height + bottomMargin;
                    if (textAlignment == TextAlignment.Right)
                        leftMargin = subWidth;
                    else if (textAlignment == TextAlignment.Center)
                        leftMargin = subWidth / 2;
                }
                elementBox.Margin = new Margin(leftMargin, topMargin, 0, bottomMargin);
                elementBox.CurrentLineWidget = line;
                line.Children.Add(elementBox);
            }
            viewer.CutFromTop(viewer.ClientActiveArea.Y + line.Height);
            viewer.LineElements.Clear();
        };
        Inline.prototype.AddElementToline = function (viewer, element) {
            var inline = this;
            viewer.CutFromLeft(viewer.ClientActiveArea.X + element.Width);
            if (this.OwnerParagraph.ParagraphFormat.TextAlignment == TextAlignment.Justify && element instanceof TextElementBox)
                this.SplitTextElementWordByWord(element, viewer);
            if (this instanceof ImageAdv)
                viewer.LineElements.SkipClipImage = !inline.IsInlineImage;
            viewer.LineElements.push(element);
        };
        Inline.prototype.CheckPreviousElement = function (viewer, characterFormat) {
            var isSplitByWord = false;
            var lastTextElement = 0;
            for (var i = viewer.LineElements.length - 1; i >= 0; i--) {
                if (viewer.LineElements[i] instanceof TextElementBox) {
                    var textElement = viewer.LineElements[i];
                    var text = textElement.Text;
                    lastTextElement = i;
                    if (/ $/.test(text)) {
                        if (i == viewer.LineElements.length - 1) {
                            this.MoveToNextLine(viewer);
                            return true;
                        }
                        isSplitByWord = true;
                        break;
                    }
                    else if (text.indexOf(" ") >= 0) {
                        isSplitByWord = true;
                        var index = text.lastIndexOf(' ') + 1;
                        var splittedElement = new TextElementBox(textElement.Inline);
                        splittedElement.Index = textElement.Index + index;
                        splittedElement.Length = textElement.Length - index;
                        textElement.Length -= splittedElement.Length;
                        this.Elements.Add(splittedElement);
                        TextHelper.GetTextSize(splittedElement, characterFormat);
                        textElement.Width -= splittedElement.Width;
                        textElement.Height = splittedElement.Height;
                        viewer.LineElements.splice(i + 1, 0, splittedElement);
                        break;
                    }
                }
                else {
                    lastTextElement = i;
                    isSplitByWord = true;
                    break;
                }
            }
            if (isSplitByWord) {
                while (lastTextElement < viewer.LineElements.length - 1)
                    lastTextElement++;
                lastTextElement++;
                var elements = new List();
                if (lastTextElement < viewer.LineElements.Count) {
                    var splitWidth = 0;
                    for (var i = lastTextElement; i < viewer.LineElements.Count; i++) {
                        splitWidth += viewer.LineElements[i].Width;
                        elements.Add(viewer.LineElements[i]);
                        viewer.LineElements.splice(i, 1);
                        i--;
                    }
                    viewer.UpdateClientWidth(splitWidth);
                }
                this.MoveToNextLine(viewer);
                if (elements.length > 0 && elements[0] instanceof TextElementBox && elements[0].Text == "\t")
                    elements[0].Width = this.OwnerParagraph.GetTabWidth(viewer);
                for (var i = 0; i < elements.length; i++) {
                    this.AddElementToline(viewer, elements[i]);
                }
                elements.Clear();
            }
            return isSplitByWord;
        };
        Inline.prototype.SplitTextForClientArea = function (viewer, element, text, width, charaterFormat) {
            var isSplitByWord = true;
            var index = -1;
            if (!(text.substring(0, 1) == " ")) {
                var textWidth = width;
                if ((index = text.replace(/\s\s*$/, '').indexOf(' ') + 1) > 0)
                    textWidth = TextHelper.MeasureTextExcludIngSpaceAtEnd(text.slice(0, index), charaterFormat).Width;
                if (viewer.ClientActiveArea.Width < textWidth) {
                    isSplitByWord = this.CheckPreviousElement(viewer, charaterFormat);
                    if (isSplitByWord)
                        isSplitByWord = textWidth <= viewer.ClientActiveArea.Width;
                }
            }
            else
                index = 1;
            if (width <= viewer.ClientActiveArea.Width)
                this.AddElementToline(viewer, element);
            else if (isSplitByWord && (index > 0 || text.indexOf(" ") > 0))
                this.SplitByWord(viewer, element, text, width, charaterFormat);
            else
                this.SplitByCharacter(viewer, element, text, width, charaterFormat);
        };
        Inline.prototype.SplitByWord = function (viewer, element, text, width, characterFormat) {
            var index = this.GetSplitIndexByWord(viewer.ClientActiveArea.Width, text, width, characterFormat);
            if (index > 0 && index < element.Length) {
                var splittedElement = new TextElementBox(element.Inline);
                text = text.substring(index);
                if (text[0] == ' ') {
                    var prevLength = text.length;
                    text = text.replace(/^\s\s*/, '');
                    index += prevLength - text.Length;
                }
                splittedElement.Index = element.Index + index;
                splittedElement.Length = element.Length - index;
                element.Length -= splittedElement.Length;
                this.Elements.Add(splittedElement);
                TextHelper.GetTextSize(splittedElement, characterFormat);
                element.Width -= splittedElement.Width;
                element.Height = splittedElement.Height;
                this.AddElementToline(viewer, element);
                this.MoveToNextLine(viewer);
            }
        };
        Inline.prototype.GetSplitIndexByWord = function (clientActiveWidth, text, width, charaterFormat) {
            var index = 0;
            var length = text.length;
            while (index < length) {
                var nextIndex = this.GetTextIndexAfterSpace(text, index);
                if (nextIndex == 0 || nextIndex == length)
                    nextIndex = length - 1;
                var splitWidth = width;
                if ((nextIndex < length - 1 || (nextIndex == length - 1 && text[nextIndex - 1] == ' ')) && index != nextIndex)
                    splitWidth = TextHelper.MeasureTextExcludIngSpaceAtEnd(text.slice(0, nextIndex), charaterFormat).Width;
                if (splitWidth <= clientActiveWidth)
                    index = nextIndex;
                else {
                    if (index == 0 && text[0] == ' ')
                        index = this.GetTextIndexAfterSpace(text, 0);
                    break;
                }
            }
            return index;
        };
        Inline.prototype.GetTextIndexAfterSpace = function (text, startIndex) {
            var length = text.length;
            var nextIndex = text.indexOf(' ', startIndex) + 1;
            if (nextIndex == 0 || nextIndex == length)
                return nextIndex;
            while (text[nextIndex] == ' ') {
                nextIndex++;
                if (nextIndex == length)
                    break;
            }
            return nextIndex;
        };
        Inline.prototype.SplitByCharacter = function (viewer, textElement, text, width, characterFormat) {
            var index = this.GetTextSplitIndexByCharacter(viewer.ClientArea.Width, viewer.ClientActiveArea.Width, text, width, characterFormat);
            var splitWidth = 0;
            if (index < textElement.Length) {
                splitWidth = TextHelper.MeasureTextExcludIngSpaceAtEnd(text.substring(0, index), characterFormat).Width;
                text = text.substring(index);
            }
            if (splitWidth > viewer.ClientActiveArea.Width && viewer.LineElements.length > 0)
                this.MoveToNextLine(viewer);
            if (index < textElement.Length) {
                var splittedElement = new TextElementBox(textElement.Inline);
                splittedElement.Index = textElement.Index + index;
                splittedElement.Length = textElement.Length - index;
                textElement.Length -= splittedElement.Length;
                this.Elements.Add(splittedElement);
                TextHelper.GetTextSize(splittedElement, characterFormat);
                textElement.Width -= splittedElement.Width;
                textElement.Height = splittedElement.Height;
                this.AddElementToline(viewer, textElement);
                this.MoveToNextLine(viewer);
            }
            else
                this.AddElementToline(viewer, textElement);
        };
        Inline.prototype.GetTextSplitIndexByCharacter = function (totalClientWidth, clientActiveAreaWidth, text, width, charaterFormat) {
            var length = text.length;
            for (var i = 0; i < length; i++) {
                var splitWidth = width;
                if (i + 1 < length)
                    splitWidth = TextHelper.MeasureTextExcludIngSpaceAtEnd(text.substring(0, i + 1), charaterFormat).Width;
                if (splitWidth > clientActiveAreaWidth) {
                    if (i == 0 && splitWidth > totalClientWidth)
                        return (length > 1 && text[1] == ' ') ? this.GetTextIndexAfterSpace(text, 1) : 1;
                    return i;
                }
            }
            return 0;
        };
        Inline.prototype.SplitTextElementWordByWord = function (textElement, viewer) {
            var text = textElement.Text;
            var format;
            if (text.trim().indexOf(" ") >= 0) {
                format = this.CharacterFormat;
                var fontSize = format.FontSize;
                var baselineAlignment = format.BaselineAlignment;
                var isBold = format.Bold;
                var isItalic = format.Italic;
                var index = textElement.Length - text.replace(/^\s\s*/, '').length;
                while (index < textElement.Length) {
                    index = this.GetTextIndexAfterSpace(text, index);
                    if (index == 0 || index == textElement.Length)
                        break;
                    if (index < textElement.Length) {
                        var splittedElement = new TextElementBox(textElement.Inline);
                        var splittedText = text.substring(0, index);
                        text = text.substring(index);
                        if (text.substring(0, 1) == " ")
                            index += text.length - text.replace(/^\s\s*/, '').length;
                        splittedElement.Index = textElement.Index;
                        splittedElement.Length = index;
                        this.Elements.splice(this.Elements.indexOf(textElement), 0, splittedElement);
                        TextHelper.GetTextSize(splittedElement, format);
                        viewer.LineElements.push(splittedElement);
                        textElement.Index += index;
                        textElement.Length -= index;
                        textElement.Width -= splittedElement.Width;
                        index = 0;
                    }
                }
            }
        };
        Inline.prototype.SplitElementForClientArea = function (element, viewer) {
            if (viewer.LineElements.length > 0)
                this.MoveToNextLine(viewer);
            if (viewer.LineElements.length == 0) {
                this.AddElementToline(viewer, element);
            }
        };
        Inline.prototype.GetPhysicalPosition = function (index, moveNextLine) {
            var elementObj = this.GetElementBox(index, moveNextLine);
            var element = elementObj.element;
            index = elementObj.index;
            if (element == null || element.CurrentLineWidget == null) {
                if (this instanceof FieldCharacterAdv)
                    return this.GetFieldCharacterPosition();
                return new Point(0, 0);
            }
            var top = 0;
            var left = 0;
            top = element.CurrentLineWidget.GetTop();
            if (element instanceof ImageElementBox) {
                var format = this.OwnerParagraph.CharacterFormat;
                var previousInline = this.GetPreviousTextInline();
                if (previousInline != null)
                    format = previousInline.CharacterFormat;
                else {
                    var nextInline = this.GetNextTextInline();
                    if (nextInline != null)
                        format = nextInline.CharacterFormat;
                }
                var measureObj = TextHelper.MeasureText("a", format);
                var baselineOffset = measureObj.BaselineOffset;
                if (element.Margin.Top + element.Height - baselineOffset > 0)
                    top += element.Margin.Top + element.Height - baselineOffset;
            }
            else {
                top += element.Margin.Top > 0 ? element.Margin.Top : 0;
            }
            left = element.CurrentLineWidget.GetLeftInternal(element, index);
            return new Point(left, top);
        };
        Inline.prototype.GetFieldCharacterPosition = function () {
            var startInline = this;
            if (this instanceof FieldBeginAdv && startInline.IsLinkedFieldCharacter()) {
                if (startInline.fieldSeparator == null)
                    startInline = startInline.fieldEnd;
                else
                    startInline = startInline.fieldSeparator;
            }
            var nextValidInline = null;
            if (startInline.NextNode != null)
                nextValidInline = startInline.NextNode.GetNextValidInline();
            if (nextValidInline == null) {
                var nextParagraph = startInline.OwnerParagraph;
                return nextParagraph.GetEndPosition();
            }
            else
                return nextValidInline.GetPhysicalPosition(0, true);
        };
        Inline.prototype.GetText = function (endParagraph, endInline, endIndex, includeObject) {
            var text = "";
            var inline = this;
            do {
                if (inline == endInline) {
                    if (inline instanceof SpanAdv) {
                        var span = inline;
                        if (!(span.Text == null || span.Text == "")) {
                            if (span.Text.length < endIndex)
                                text = text + span.Text;
                            else
                                text = text + span.Text.substring(0, endIndex);
                        }
                    }
                    else if (inline instanceof ImageAdv && includeObject && endIndex == inline.Length)
                        text = text + Inline.OBJECT_CHARACTER;
                    return text;
                }
                if (inline instanceof SpanAdv)
                    text = text + inline.Text;
                else if (inline instanceof ImageAdv && includeObject)
                    text = text + Inline.OBJECT_CHARACTER;
                else if (inline instanceof FieldBeginAdv && inline.fieldEnd != null) {
                    if (inline.fieldSeparator != null)
                        inline = inline.fieldSeparator;
                    else
                        inline = inline.fieldEnd;
                }
                if (inline.NextNode == null)
                    break;
                inline = inline.NextNode;
            } while (true);
            if (endParagraph == this.OwnerParagraph)
                return text;
            var nextParagraph = this.OwnerParagraph.GetNextParagraph();
            while (nextParagraph != null && nextParagraph.IsEmpty()) {
                text = text + "\r";
                if (nextParagraph == endParagraph)
                    return text;
                nextParagraph = nextParagraph.GetNextParagraph();
            }
            if (nextParagraph != null && !nextParagraph.IsEmpty())
                text = text + "\r" + nextParagraph.Inlines[0].GetText(endParagraph, endInline, endIndex, includeObject);
            return text;
        };
        Inline.prototype.GetElementBox = function (index, moveToNextLine) {
            var element = null;
            if (this.Elements.Count > 0)
                element = this.Elements[this.Elements.Count - 1];
            if (element instanceof TextElementBox) {
                for (var i = 0; i < this.Elements.Count; i++) {
                    var length_1 = (this.Elements[i] instanceof TextElementBox) ? this.Elements[i].Length : 1;
                    if (length_1 >= index || (length_1 + 1 == index && i == this.Elements.Count - 1)) {
                        element = this.Elements[i];
                        if (moveToNextLine && index == length_1 && i < this.Elements.Count - 1 && element.CurrentLineWidget != this.Elements[i + 1].CurrentLineWidget) {
                            element = this.Elements[i + 1];
                            index = 0;
                        }
                        break;
                    }
                    index -= length_1;
                }
            }
            return { "index": index, "element": element };
        };
        Inline.prototype.GetElementBoxInternal = function (index) {
            var element = null;
            if (this.Elements.Count > 0)
                element = this.Elements[this.Elements.Count - 1];
            if (element instanceof TextElementBox) {
                for (var i = 0; i < this.Elements.Count; i++) {
                    var length_2 = (this.Elements[i] instanceof TextElementBox) ? this.Elements[i].Length : 1;
                    if (length_2 >= index || (length_2 + 1 == index && i == this.Elements.Count - 1)) {
                        element = this.Elements[i];
                        break;
                    }
                    index -= length_2;
                }
            }
            return {
                "element": element, "index": index
            };
        };
        Inline.prototype.GetPreviousTextInline = function () {
            if (this.PreviousNode instanceof SpanAdv)
                return this.PreviousNode;
            if (this.PreviousNode != null)
                return this.PreviousNode.GetPreviousTextInline();
            return null;
        };
        Inline.prototype.GetNextTextInline = function () {
            if (this.NextNode instanceof SpanAdv)
                return this.NextNode;
            if (this.NextNode != null)
                return this.NextNode.GetNextTextInline();
            return null;
        };
        Inline.prototype.GetLineWidget = function (index) {
            return this.GetLineWidgetInternal(index, true);
        };
        Inline.prototype.GetLineWidgetInternal = function (index, moveToNextLine) {
            var elementObj = this.GetElementBox(index, moveToNextLine);
            var element = elementObj.element;
            index = elementObj.index;
            if (element != null)
                return element.CurrentLineWidget;
            var startInline = this;
            if (this instanceof FieldBeginAdv && startInline.IsLinkedFieldCharacter()) {
                if (startInline.fieldSeparator == null)
                    startInline = startInline.fieldEnd;
                else
                    startInline = startInline.fieldSeparator;
            }
            var nextValidInline = null;
            if (startInline.NextNode != null)
                nextValidInline = startInline.NextNode.GetNextValidInline();
            if (nextValidInline == null) {
                var nextParagraph = startInline.OwnerParagraph;
                var lineWidget = null;
                if (nextParagraph.ParagraphWidgets.Count > 0) {
                    var widget = nextParagraph.ParagraphWidgets[nextParagraph.ParagraphWidgets.Count - 1];
                    if (widget.ChildWidgets.Count > 0)
                        lineWidget = widget.ChildWidgets[widget.ChildWidgets.Count - 1];
                }
                return lineWidget;
            }
            else
                return nextValidInline.GetLineWidget(0);
        };
        Inline.prototype.GetCaretHeight = function (index, format, isEmptySelection, topMargin, isItalic) {
            var elementBoxInfo = this.GetElementBox(index, false);
            index = elementBoxInfo.index;
            var element = elementBoxInfo.element;
            var currentInline = this;
            if (element == null) {
                if (currentInline instanceof FieldCharacterAdv) {
                    return currentInline.GetFieldCharacterHeight(format, isEmptySelection, topMargin, isItalic);
                }
                return { "Height": TextHelper.MeasureText("a", format).Height, "TopMargin": topMargin, "IsItalic": isItalic };
            }
            var maxLineHeight = 0;
            if (element instanceof ImageElementBox) {
                var previousInline = this.GetPreviousTextInline();
                var nextInline = this.GetNextTextInline();
                if (previousInline == null && nextInline == null) {
                    var top_2 = 0, bottom = 0;
                    var sizeInfo = this.OwnerParagraph.GetParagraphMarkSize(top_2, bottom);
                    top_2 = sizeInfo.TopMargin;
                    bottom = sizeInfo.BottomMargin;
                    maxLineHeight = sizeInfo.Height;
                    isItalic = this.OwnerParagraph.CharacterFormat.Italic;
                    if (!isEmptySelection)
                        maxLineHeight += this.OwnerParagraph.ParagraphFormat.AfterSpacing;
                }
                else if (previousInline == null) {
                    isItalic = nextInline.CharacterFormat.Italic;
                    return nextInline.GetCaretHeight(0, nextInline.CharacterFormat, isEmptySelection, topMargin, isItalic);
                }
                else {
                    if (nextInline != null && element instanceof ImageElementBox) {
                        var textSizeInfo = TextHelper.MeasureText("a", element.Inline.CharacterFormat);
                        var charHeight = textSizeInfo.Height;
                        var baselineOffset = textSizeInfo.BaselineOffset;
                        maxLineHeight = (element.Margin.Top < 0 && baselineOffset > element.Margin.Top + element.Height) ? element.Margin.Top + element.Height + charHeight - baselineOffset : charHeight;
                        if (!isEmptySelection)
                            maxLineHeight += element.Margin.Bottom;
                    }
                    else {
                        isItalic = previousInline.CharacterFormat.Italic;
                        return previousInline.GetCaretHeight(previousInline.Length, previousInline.CharacterFormat, isEmptySelection, topMargin, isItalic);
                    }
                }
            }
            else {
                var baselineAlignment = format.BaselineAlignment;
                var elementHeight = element.Height;
                if (baselineAlignment != BaselineAlignment.Normal && isEmptySelection) {
                    elementHeight = elementHeight / 1.5;
                    if (baselineAlignment == BaselineAlignment.Subscript)
                        topMargin = element.Height - elementHeight;
                }
                maxLineHeight = (element.Margin.Top < 0 ? element.Margin.Top : 0) + elementHeight;
                if (!isEmptySelection)
                    maxLineHeight += element.Margin.Bottom;
            }
            if (!isEmptySelection)
                return { "Height": maxLineHeight, "TopMargin": topMargin, "IsItalic": isItalic };
            var height = TextHelper.MeasureText("a", format).Height;
            if (height > maxLineHeight)
                height = maxLineHeight;
            return { "Height": height, "TopMargin": topMargin, "IsItalic": isItalic };
        };
        Inline.prototype.GetFieldCharacterHeight = function (format, isEmptySelection, topMargin, isItalic) {
            var startInline = this;
            if (startInline instanceof FieldBeginAdv && startInline.IsLinkedFieldCharacter()) {
                if (startInline.fieldSeparator == null)
                    startInline = startInline.fieldEnd;
                else
                    startInline = startInline.fieldSeparator;
            }
            var nextValidInline = null;
            if (startInline.NextNode != null)
                nextValidInline = startInline.NextNode.GetNextValidInline();
            if (nextValidInline == null) {
                var nextParagraph = startInline.OwnerParagraph;
                var height = TextHelper.GetParagraphMarkSize(format).Height;
                var top_3 = 0, bottom = 0;
                var sizeInfo = nextParagraph.GetParagraphMarkSize(top_3, bottom);
                var maxLineHeight = sizeInfo.Height;
                top_3 = sizeInfo.TopMargin;
                bottom = sizeInfo.BottomMargin;
                if (!isEmptySelection) {
                    maxLineHeight += bottom;
                    return { "Height": maxLineHeight, "TopMargin": topMargin, "IsItalic": isItalic };
                }
                if (height > maxLineHeight)
                    height = maxLineHeight;
                return { "Height": height, "TopMargin": topMargin, "IsItalic": isItalic };
            }
            else
                return nextValidInline.GetCaretHeight(0, format, isEmptySelection, topMargin, isItalic);
        };
        Inline.prototype.GetPreviousValidInline = function () {
            var inline = this;
            var previousValidInline = null;
            while (inline instanceof FieldCharacterAdv) {
                if (inline.IsLinkedFieldCharacter()) {
                    if (inline instanceof FieldBeginAdv)
                        previousValidInline = inline;
                    else if (inline instanceof FieldEndAdv) {
                        previousValidInline = inline;
                        if (inline.FieldSeparator == null) {
                            inline = inline.FieldBegin;
                            previousValidInline = inline;
                        }
                    }
                    else {
                        inline = inline.fieldBegin;
                        previousValidInline = inline;
                    }
                }
                inline = inline.PreviousNode;
            }
            return previousValidInline == null ? inline : previousValidInline;
        };
        Inline.prototype.ValidateTextPosition = function (index) {
            var inline = this;
            if (inline.Length == index && inline.NextNode instanceof FieldCharacterAdv) {
                var nextInline = inline.NextNode.GetNextValidInline();
                if (nextInline instanceof FieldEndAdv) {
                    inline = nextInline;
                    index = 1;
                }
            }
            else if (index == 0 && inline.PreviousNode instanceof FieldCharacterAdv) {
                var prevInline = inline.PreviousNode.GetPreviousValidInline();
                inline = prevInline;
                index = inline instanceof FieldCharacterAdv ? 0 : inline.Length;
                if (inline instanceof FieldEndAdv)
                    index++;
            }
            return {
                "inline": inline, "index": index
            };
        };
        Inline.prototype.GetNextValidInline = function () {
            var inline = this;
            var nextValidInline = null;
            while (inline instanceof FieldCharacterAdv) {
                if (inline instanceof FieldBeginAdv && inline.fieldEnd != null)
                    return nextValidInline == null ? inline : nextValidInline;
                else if (inline instanceof FieldEndAdv && inline.FieldBegin != null)
                    nextValidInline = inline;
                inline = inline.NextNode;
            }
            return nextValidInline == null ? inline : nextValidInline;
        };
        Inline.prototype.IsLastRenderedInline = function (index) {
            var inline = this;
            while (index == inline.Length && inline.NextNode instanceof FieldCharacterAdv) {
                var nextValidInline = inline.NextNode.GetNextValidInline();
                index = 0;
                if (nextValidInline instanceof FieldBeginAdv)
                    inline = nextValidInline;
                if (inline instanceof FieldBeginAdv && inline.fieldEnd != null) {
                    var fieldBegin = inline;
                    if (fieldBegin.fieldSeparator == null) {
                        inline = fieldBegin.fieldEnd;
                        index = 1;
                    }
                    else {
                        inline = fieldBegin.fieldSeparator;
                        var paragraph = inline.OwnerParagraph;
                        index = 1;
                        if (paragraph == fieldBegin.fieldEnd.OwnerParagraph
                            && !paragraph.HasValidInline(inline, fieldBegin.fieldEnd))
                            inline = fieldBegin.fieldEnd;
                        else
                            break;
                    }
                }
            }
            return index == inline.Length && inline.NextNode == null;
        };
        Inline.prototype.GetNextRenderedInline = function (indexInInline) {
            var inline = this;
            if (inline instanceof FieldBeginAdv) {
                var fieldBegin = inline;
                inline = fieldBegin.GetRenderedField();
                if (fieldBegin == inline)
                    return fieldBegin;
                indexInInline = 1;
            }
            while (indexInInline == inline.Length && inline.NextNode instanceof FieldCharacterAdv) {
                var nextValidInline = inline.NextNode.GetNextValidInline();
                if (nextValidInline instanceof FieldBeginAdv) {
                    var fieldBegin = nextValidInline;
                    inline = fieldBegin.GetRenderedField();
                    if (fieldBegin == inline)
                        return fieldBegin;
                    indexInInline = 1;
                }
                else
                    inline = nextValidInline;
            }
            return inline;
        };
        Inline.prototype.IsExistAfter = function (inline) {
            if (this.OwnerParagraph == inline.OwnerParagraph)
                return this.OwnerParagraph.Inlines.IndexOf(this) > this.OwnerParagraph.Inlines.IndexOf(inline);
            if (this.OwnerParagraph.Owner == inline.OwnerParagraph.Owner) {
                if (this.OwnerParagraph.IsInsideTable)
                    return this.OwnerParagraph.AssociatedCell.Blocks.IndexOf(this.OwnerParagraph) > inline.OwnerParagraph.AssociatedCell.Blocks.IndexOf(inline.OwnerParagraph);
                else if (this.OwnerParagraph.Owner instanceof HeaderFooter)
                    return this.OwnerParagraph.Owner.Blocks.IndexOf(this.OwnerParagraph) > inline.OwnerParagraph.Owner.Blocks.IndexOf(inline.OwnerParagraph);
                else
                    return this.OwnerParagraph.Section.Blocks.IndexOf(this.OwnerParagraph) > inline.OwnerParagraph.Section.Blocks.IndexOf(inline.OwnerParagraph);
            }
            return this.OwnerParagraph.IsExistAfter(inline.OwnerParagraph);
        };
        Inline.prototype.IsExistBefore = function (inline) {
            if (this.OwnerParagraph == inline.OwnerParagraph)
                return this.OwnerParagraph.Inlines.IndexOf(this) < this.OwnerParagraph.Inlines.IndexOf(inline);
            if (this.OwnerParagraph.Owner == inline.OwnerParagraph.Owner) {
                if (this.OwnerParagraph.IsInsideTable)
                    return this.OwnerParagraph.AssociatedCell.Blocks.IndexOf(this.OwnerParagraph) < inline.OwnerParagraph.AssociatedCell.Blocks.IndexOf(inline.OwnerParagraph);
                else if (this.OwnerParagraph.Owner instanceof HeaderFooter)
                    return this.OwnerParagraph.Owner.Blocks.IndexOf(this.OwnerParagraph) < inline.OwnerParagraph.Owner.Blocks.IndexOf(inline.OwnerParagraph);
                else
                    return this.OwnerParagraph.Section.Blocks.IndexOf(this.OwnerParagraph) < inline.OwnerParagraph.Section.Blocks.IndexOf(inline.OwnerParagraph);
            }
            return this.OwnerParagraph.IsExistBefore(inline.OwnerParagraph);
        };
        Inline.prototype.Find = function (pattern, option, indexInInline, isFirstMatch, selectionEnd, owner) {
            var inline = this;
            var stringBuilder = new String();
            var spans = new Dictionary();
            do {
                if (inline instanceof SpanAdv && (inline.Text != null && inline.Text != "")) {
                    spans.Add(inline, stringBuilder.length);
                    if (inline == this)
                        stringBuilder = stringBuilder + (inline.Text.substring(indexInInline));
                    else
                        stringBuilder = stringBuilder + (inline.Text);
                }
                else if (inline instanceof FieldBeginAdv) {
                    var fieldBegin = inline;
                    if (fieldBegin.fieldEnd != null)
                        inline = fieldBegin.fieldSeparator == null ? fieldBegin.fieldEnd : fieldBegin.fieldSeparator;
                }
                if (inline.NextNode == null)
                    break;
                inline = inline.NextNode;
            } while (true);
            var text = stringBuilder.toString();
            var matches = [];
            var matchObject;
            while ((matchObject = pattern.exec(text)) != null) {
                matches.push(matchObject);
            }
            for (var i = 0; i < matches.length; i++) {
                var match = matches[i];
                var spanKeys = spans.Keys;
                var startPosition = new TextPosition(owner);
                var endPosition = new TextPosition(owner);
                for (var i_1 = 0; i_1 < spanKeys.Count; i_1++) {
                    var span = spanKeys[i_1];
                    var startIndex = spans.Get(span);
                    var spanLength = span.Length;
                    if (span == this)
                        spanLength -= indexInInline;
                    if (startPosition.Paragraph == null && match.index <= startIndex + spanLength) {
                        var index = match.index - startIndex;
                        if (span == this)
                            index += indexInInline;
                        var offset = span.OwnerParagraph.GetOffset(span, index);
                        startPosition.SetPositionParagraph(span.OwnerParagraph, offset);
                    }
                    if (match.index + match[0].length <= startIndex + spanLength) {
                        var index = (match.index + match[0].length) - startIndex;
                        if (span == this)
                            index += indexInInline;
                        var offset = span.OwnerParagraph.GetOffset(span, index);
                        endPosition.SetPositionParagraph(span.OwnerParagraph, offset);
                        break;
                    }
                }
                endPosition.UpdateTextPositionOnFieldCharacter(startPosition);
                if (isFirstMatch) {
                    owner.Selection.SelectRange(startPosition, endPosition, true);
                    return true;
                }
            }
            var paragraph = inline.OwnerParagraph.GetNextParagraph();
            while (paragraph != null && paragraph.Inlines.Count == 0)
                paragraph = paragraph.GetNextParagraph();
            if (paragraph != null && paragraph.Inlines.Count > 0) {
                var inline_2 = paragraph.Inlines[0];
                return inline_2.Find(pattern, option, 0, isFirstMatch, selectionEnd, owner);
            }
            return false;
        };
        Inline.prototype.ClearElements = function (dispose) {
            if (this.Elements != null) {
                for (var i = 0; i < this.Elements.Count; i++) {
                    var element = this.Elements[i];
                    this.Elements.Remove(element);
                    i--;
                }
            }
            if (dispose)
                this.Elements.Clear();
        };
        Inline.OBJECT_CHARACTER = "￼";
        Inline.WordSplitCharacters = new Array();
        return Inline;
    }(Node));
    DocumentEditorFeatures.Inline = Inline;
    var SpanAdv = (function (_super) {
        __extends(SpanAdv, _super);
        function SpanAdv(node) {
            _super.call(this, node);
            this.text = "";
        }
        Object.defineProperty(SpanAdv.prototype, "Text", {
            get: function () {
                return this.text;
            },
            set: function (text) {
                this.text = text;
                this.OnTextChanged();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpanAdv.prototype, "Length", {
            get: function () {
                return this.text.length;
            },
            enumerable: true,
            configurable: true
        });
        SpanAdv.prototype.OnTextChanged = function () {
            if (this.OwnerParagraph instanceof ParagraphAdv) {
                var inlineIndex = this.OwnerParagraph.Inlines.indexOf(this);
                if (inlineIndex > -1) {
                    if (this.Text != "\t" && this.Text != "\v" && this.Text.length >= 1) {
                        this.SplitByTabOrLineBreakCharacter(inlineIndex);
                    }
                }
            }
        };
        SpanAdv.prototype.AddElementBox = function (viewer) {
            var textElement = new TextElementBox(this);
            textElement.Index = 0;
            textElement.Length = this.Text.length;
            this.Elements.Add(textElement);
        };
        SpanAdv.prototype.SplitByTabOrLineBreakCharacter = function (inlineIndex) {
            var value = this.Text;
            var tabIndex = value.indexOf("\t");
            var breakIndex = value.indexOf("\v");
            var index = -1;
            if (tabIndex > -1 && breakIndex > -1) {
                index = tabIndex < breakIndex ? tabIndex : breakIndex;
            }
            else if (tabIndex > -1)
                index = tabIndex;
            else
                index = breakIndex;
            if (index > -1) {
                var remainder = value.substring(index + 1);
                var newSpan = new SpanAdv(null);
                newSpan.CharacterFormat.CopyFormat(this.CharacterFormat);
                this.OwnerParagraph.Inlines.Insert(inlineIndex + 1, newSpan);
                if (index > 0) {
                    newSpan.Text = value.substring(index);
                    this.Text = value.substring(0, index);
                }
                else if (remainder != "") {
                    newSpan.Text = remainder;
                    this.Text = value.substring(index, index + 1);
                }
            }
        };
        SpanAdv.prototype.SplitByBreakCharacter = function (spanAdv, spanText, beforePara, afterPara) {
            var tempSpan = spanAdv;
            var index = spanText.indexOf("\r");
            var remainder = spanText.substring(index + 1);
            var newSpan = new SpanAdv(null);
            newSpan.CharacterFormat.CopyFormat(spanAdv.CharacterFormat);
            var oldPara = spanAdv.OwnerParagraph;
            if (beforePara == null) {
                beforePara.ParagraphFormat.CopyFormat(oldPara.ParagraphFormat);
                beforePara.CharacterFormat.CopyFormat(oldPara.CharacterFormat);
            }
            if (oldPara.Inlines.Contains(spanAdv))
                oldPara.Inlines.Remove(spanAdv);
            if (index > 0)
                newSpan.Text = spanText.substring(0, index);
            if (newSpan.Text != "")
                beforePara.Inlines.Add(newSpan);
            if (beforePara.Inlines.Count > 0) {
                if (oldPara.IsInsideTable)
                    oldPara.AssociatedCell.Blocks.Add(beforePara);
                else
                    oldPara.Section.Blocks.Add(beforePara);
            }
            var remainderindex = remainder.indexOf("\r");
            if (remainderindex > 0) {
                var para = null;
                this.SplitByBreakCharacter(tempSpan, remainder, para, para);
            }
            else {
                if (remainder != null && remainder != "") {
                    var innerSpan = new SpanAdv(null);
                    innerSpan.CharacterFormat.CopyFormat(spanAdv.CharacterFormat);
                    if (afterPara == null) {
                        afterPara = new ParagraphAdv(this);
                        afterPara.ParagraphFormat.CopyFormat(oldPara.ParagraphFormat);
                        afterPara.CharacterFormat.CopyFormat(oldPara.CharacterFormat);
                    }
                    innerSpan.Text = remainder;
                    afterPara.Inlines.Insert(0, innerSpan);
                    if (oldPara.IsInsideTable)
                        oldPara.AssociatedCell.Blocks.Add(afterPara);
                    else
                        oldPara.Section.Blocks.Add(afterPara);
                }
            }
        };
        SpanAdv.prototype.GetNextWordOffset = function (indexInInline, type, isInField, endSelection, endPosition, excludeSpace) {
            if (this.Text == "\t") {
                if (isInField) {
                    endPosition.SetPositionParagraph(this.OwnerParagraph, this.OwnerParagraph.GetOffset(this, indexInInline));
                    endSelection = false;
                    return;
                }
                if (indexInInline == 0) {
                    endSelection = true;
                    var startOffset = this.OwnerParagraph.GetOffset(this, 0);
                    if (endPosition.Offset == startOffset)
                        endPosition.SetPositionParagraph(this.OwnerParagraph, startOffset + this.Length);
                    else
                        endPosition.SetPositionParagraph(this.OwnerParagraph, startOffset);
                }
                else if (this.NextNode != null)
                    this.NextNode.GetNextWordOffset(0, type, isInField, endSelection, endPosition, excludeSpace);
            }
            else {
                var wordEndIndex = 0;
                if (indexInInline == 0 && endSelection && (this.WordSplitCharacters.indexOf(this.Text[0]) == -1)) {
                    endPosition.SetPositionParagraph(this.OwnerParagraph, this.OwnerParagraph.GetOffset(this, indexInInline));
                    if (isInField)
                        return;
                }
                else if (indexInInline < this.Length) {
                    var txt = indexInInline > 0 && this.Text.length - 1 >= indexInInline ? this.Text.slice(indexInInline, this.Length) : this.Text;
                    wordEndIndex = HelperMethods.IndexOfAny(txt, this.WordSplitCharacters);
                    if (wordEndIndex != -1) {
                        if (isInField) {
                            endSelection = false;
                            return;
                        }
                        var offset = this.OwnerParagraph.GetOffset(this, wordEndIndex + indexInInline);
                        if ((excludeSpace || txt[wordEndIndex] != ' ') && !endSelection && this.OwnerParagraph == endPosition.Paragraph && offset != endPosition.Offset) {
                            endSelection = true;
                            endPosition.SetPositionParagraph(this.OwnerParagraph, offset);
                            return;
                        }
                        wordEndIndex++;
                        while (wordEndIndex < txt.length && this.WordSplitCharacters.indexOf(txt[wordEndIndex]) != -1) {
                            if (txt[wordEndIndex] != ' ' && txt[wordEndIndex - 1] == ' ')
                                break;
                            wordEndIndex++;
                        }
                        endSelection = true;
                        if (wordEndIndex < txt.length)
                            endPosition.SetPositionParagraph(this.OwnerParagraph, this.OwnerParagraph.GetOffset(this, wordEndIndex + indexInInline));
                        else if (this.NextNode != null)
                            this.NextNode.GetNextWordOffset(0, type, isInField, endSelection, endPosition, excludeSpace);
                        else {
                            if (isInField) {
                                endSelection = false;
                                return;
                            }
                            endPosition.SetPositionParagraph(this.OwnerParagraph, this.OwnerParagraph.GetOffset(this, wordEndIndex + indexInInline));
                        }
                    }
                    else if (this.NextNode != null)
                        this.NextNode.GetNextWordOffset(0, type, isInField, endSelection, endPosition, excludeSpace);
                    else {
                        if (isInField) {
                            endSelection = false;
                            return;
                        }
                        endPosition.SetPositionParagraph(this.OwnerParagraph, this.OwnerParagraph.GetEndOffset());
                    }
                }
                else if (this.NextNode != null)
                    this.NextNode.GetNextWordOffset(0, type, isInField, endSelection, endPosition, excludeSpace);
            }
        };
        SpanAdv.prototype.GetPreviousWordOffset = function (indexInInline, type, isInField, isStarted, endSelection, endPosition) {
            if (this.Text == "\t") {
                if (isInField) {
                    endSelection = false;
                    return;
                }
                if (indexInInline == 0) {
                    endSelection = true;
                    var endOffset = this.OwnerParagraph.GetOffset(this, this.Length);
                    if (endOffset == endPosition.Offset)
                        endPosition.SetPositionParagraph(this.OwnerParagraph, endOffset - this.Length);
                    else
                        endPosition.SetPositionParagraph(this.OwnerParagraph, endOffset);
                }
                else if (this.PreviousNode != null)
                    this.PreviousNode.GetPreviousWordOffset(this.PreviousNode.Length, type, isInField, isStarted, endSelection, endPosition);
            }
            else {
                var wordStartIndex = 0;
                if (!isStarted) {
                    while (indexInInline > 0 && this.Text[indexInInline - 1] == ' ')
                        indexInInline--;
                    endPosition.SetPositionParagraph(this.OwnerParagraph, this.OwnerParagraph.GetOffset(this, indexInInline));
                }
                if (indexInInline > 0) {
                    isStarted = true;
                    if (indexInInline == 0 && endSelection && (this.WordSplitCharacters.indexOf(this.Text[0])) == -1) {
                        endPosition.SetPositionParagraph(this.OwnerParagraph, this.OwnerParagraph.GetOffset(this, indexInInline));
                        endSelection = true;
                        return;
                    }
                    var txt = this.Text.length > indexInInline ? this.Text.slice(0, indexInInline) : this.Text;
                    wordStartIndex = HelperMethods.LastIndexOfAny(txt, this.WordSplitCharacters);
                    if (wordStartIndex != -1) {
                        if (isInField) {
                            endSelection = false;
                            return;
                        }
                        while (wordStartIndex > 0 && endSelection && txt[wordStartIndex] != ' ' && (this.WordSplitCharacters.indexOf(txt[wordStartIndex - 1])) != -1)
                            wordStartIndex--;
                        if (txt[wordStartIndex] == ' ' || !endSelection)
                            wordStartIndex++;
                        endSelection = true;
                        if (wordStartIndex > 0) {
                            var offset = this.OwnerParagraph.GetOffset(this, wordStartIndex);
                            if (this.OwnerParagraph == endPosition.Paragraph && offset == endPosition.Offset)
                                this.GetPreviousWordOffset(indexInInline, type, isInField, isStarted, endSelection, endPosition);
                            else
                                endPosition.SetPositionParagraph(this.OwnerParagraph, offset);
                        }
                        else if (this.PreviousNode != null)
                            this.PreviousNode.GetPreviousWordOffset(this.PreviousNode.Length, type, isInField, isStarted, endSelection, endPosition);
                        else
                            endPosition.SetPositionParagraph(this.OwnerParagraph, this.OwnerParagraph.GetOffset(this, 0));
                    }
                    else if (this.PreviousNode != null)
                        this.PreviousNode.GetPreviousWordOffset(this.PreviousNode.Length, type, isInField, isStarted, endSelection, endPosition);
                    else
                        endPosition.SetPositionParagraph(this.OwnerParagraph, this.OwnerParagraph.GetStartOffset());
                }
                else if (this.PreviousNode != null)
                    this.PreviousNode.GetPreviousWordOffset(this.PreviousNode.Length, type, isInField, isStarted, endSelection, endPosition);
                else
                    endPosition.SetPositionParagraph(this.OwnerParagraph, this.OwnerParagraph.GetStartOffset());
            }
        };
        SpanAdv.prototype.Dispose = function () {
            this.CharacterFormat.Dispose();
            this.Text = "";
            this.SetOwner(null);
        };
        return SpanAdv;
    }(Inline));
    DocumentEditorFeatures.SpanAdv = SpanAdv;
    var ImageAdv = (function (_super) {
        __extends(ImageAdv, _super);
        function ImageAdv(node, isInline, isMetaImage) {
            _super.call(this, node);
            this.imageString = "";
            this.width = 0;
            this.height = 0;
            this.isInlineImage = true;
            this.isMetaFile = false;
            this.isInlineImage = isInline;
            this.isMetaFile = isMetaImage;
        }
        Object.defineProperty(ImageAdv.prototype, "ImageString", {
            get: function () {
                return this.imageString;
            },
            set: function (value) {
                this.imageString = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageAdv.prototype, "Width", {
            get: function () {
                return this.width;
            },
            set: function (value) {
                this.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageAdv.prototype, "Height", {
            get: function () {
                return this.height;
            },
            set: function (value) {
                this.height = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageAdv.prototype, "IsInlineImage", {
            get: function () {
                return this.isInlineImage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageAdv.prototype, "IsMetaFile", {
            get: function () {
                return this.isMetaFile;
            },
            enumerable: true,
            configurable: true
        });
        ImageAdv.prototype.AddElementBox = function (viewer) {
            var imageElement = new ImageElementBox(this);
            imageElement.Height = this.Height;
            imageElement.Width = this.Width;
            this.Elements.Add(imageElement);
        };
        ImageAdv.prototype.GetNextWordOffset = function (indexInInline, type, isInField, endSelection, endPosition, excludeSpace) {
            if (isInField) {
                endPosition.SetPositionParagraph(this.OwnerParagraph, this.OwnerParagraph.GetOffset(this, indexInInline));
                endSelection = false;
                return;
            }
            if (indexInInline == 0) {
                var startOffset = this.OwnerParagraph.GetOffset(this, 0);
                endSelection = true;
                if (endPosition.Offset == startOffset) {
                    if (this.NextNode == null)
                        endPosition.SetPositionParagraph(this.OwnerParagraph, startOffset + this.Length);
                    else
                        this.NextNode.GetNextWordOffset(0, type, isInField, endSelection, endPosition, excludeSpace);
                }
                else
                    endPosition.SetPositionParagraph(this.OwnerParagraph, startOffset);
            }
            else if (this.NextNode != null)
                this.NextNode.GetNextWordOffset(0, type, isInField, endSelection, endPosition, excludeSpace);
        };
        ImageAdv.prototype.GetPreviousWordOffset = function (indexInInline, type, isInField, isStarted, endSelection, endPosition) {
            if (isInField) {
                endPosition.SetPositionParagraph(this.OwnerParagraph, this.OwnerParagraph.GetOffset(this, indexInInline));
                endSelection = false;
                return;
            }
            if (indexInInline == this.Length) {
                var endOffset = this.OwnerParagraph.GetOffset(this, this.Length);
                if (endOffset == endPosition.Offset)
                    endPosition.SetPositionParagraph(this.OwnerParagraph, endOffset - this.Length);
                else
                    endPosition.SetPositionParagraph(this.OwnerParagraph, endOffset);
            }
            else if (this.PreviousNode != null)
                this.PreviousNode.GetPreviousWordOffset(this.PreviousNode.Length, type, isInField, isStarted, endSelection, endPosition);
        };
        ImageAdv.prototype.Dispose = function () {
            this.CharacterFormat.Dispose();
            this.ImageString = "";
            this.SetOwner(null);
            this.ClearElements(true);
        };
        return ImageAdv;
    }(Inline));
    DocumentEditorFeatures.ImageAdv = ImageAdv;
    var FieldCharacterAdv = (function (_super) {
        __extends(FieldCharacterAdv, _super);
        function FieldCharacterAdv() {
            _super.apply(this, arguments);
        }
        FieldCharacterAdv.prototype.AddElementBox = function (viewer) { };
        FieldCharacterAdv.prototype.GetRenderedInline = function (inlineIndex) {
            var prevInline = this.GetPreviousValidInline();
            while (prevInline instanceof FieldCharacterAdv) {
                prevInline = prevInline.GetPreviousTextInline();
                if (prevInline instanceof FieldCharacterAdv)
                    prevInline = prevInline.PreviousNode;
            }
            if (prevInline != null) {
                inlineIndex = prevInline.Length;
                return { "Inline": prevInline, "InlineIndex": inlineIndex };
            }
            inlineIndex = 0;
            var nextInline = this.GetNextRenderedInline(0);
            if (nextInline instanceof FieldBeginAdv) {
                nextInline = nextInline.fieldSeparator;
                nextInline = nextInline.NextNode;
                while (nextInline instanceof FieldCharacterAdv) {
                    if (nextInline instanceof FieldBeginAdv && nextInline.IsLinkedFieldCharacter()) {
                        if (nextInline.fieldSeparator == null)
                            nextInline = nextInline.fieldEnd;
                        else
                            nextInline = nextInline.fieldSeparator;
                    }
                    nextInline = nextInline.NextNode;
                }
            }
            return { "Inline": prevInline, "InlineIndex": inlineIndex };
        };
        FieldCharacterAdv.prototype.Dispose = function () {
            this.CharacterFormat.Dispose();
            this.SetOwner(null);
            this.ClearElements(true);
        };
        return FieldCharacterAdv;
    }(Inline));
    DocumentEditorFeatures.FieldCharacterAdv = FieldCharacterAdv;
    var FieldBeginAdv = (function (_super) {
        __extends(FieldBeginAdv, _super);
        function FieldBeginAdv(node) {
            _super.call(this, node);
            this.FieldSeparator = null;
            this.FieldEnd = null;
        }
        Object.defineProperty(FieldBeginAdv.prototype, "fieldSeparator", {
            get: function () {
                return this.FieldSeparator;
            },
            set: function (value) {
                if (this.FieldSeparator != value) {
                    var preFieldSeparator = this.fieldSeparator;
                    this.FieldSeparator = value;
                    if (preFieldSeparator != null) {
                        preFieldSeparator.fieldBegin = null;
                        preFieldSeparator = null;
                    }
                    if (this.fieldSeparator != null) {
                        this.fieldSeparator.fieldBegin = this;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FieldBeginAdv.prototype, "fieldEnd", {
            get: function () {
                return this.FieldEnd;
            },
            set: function (value) {
                if (this.FieldEnd != value) {
                    var prevFieldEnd = this.fieldEnd;
                    this.FieldEnd = value;
                    if (prevFieldEnd != null) {
                        prevFieldEnd.fieldBegin = null;
                        prevFieldEnd = null;
                    }
                    if (this.fieldEnd != null)
                        this.fieldEnd.fieldBegin = this;
                }
            },
            enumerable: true,
            configurable: true
        });
        FieldBeginAdv.prototype.IsLinkedFieldCharacter = function () { return true; };
        ;
        FieldBeginAdv.prototype.CheckUnlinkFieldCharacter = function (compositeNodeIndex, isCheckFieldCharacters) {
            if (this.fieldSeparator != null) {
                if (isCheckFieldCharacters) {
                    var fieldOwnerIndex = this.fieldSeparator.OwnerParagraph.GetHierarchicalIndex("");
                    if (fieldOwnerIndex.indexOf(compositeNodeIndex) >= 0)
                        return;
                }
                this.fieldSeparator.fieldBegin = null;
                this.fieldSeparator = null;
            }
        };
        ;
        FieldBeginAdv.prototype.AddToLinkedFields = function () {
            var fields = this;
            fields.RemoveAfterLinking(fields);
            if (fields.FieldSeparator != null)
                fields.RemoveAfterLinking(fields.FieldSeparator);
            fields.RemoveAfterLinking(fields.FieldEnd);
            this.Owner.AddFields(this);
        };
        ;
        FieldBeginAdv.prototype.IsUnlinkFieldCharacters = function (compositeNodeINdex) {
            if (this.fieldEnd == null)
                return false;
            var fieldEndOwnerIndex = this.fieldEnd.OwnerParagraph.GetHierarchicalIndex("");
            return !(fieldEndOwnerIndex.indexOf(fieldEndOwnerIndex) >= 0);
        };
        FieldBeginAdv.prototype.UnlinkFieldCharacter = function (compositeNodeIndex, isAddToFieldCharacters) {
            if (this.fieldSeparator != null) {
                var isUnlinkSeparator = true;
                if (isAddToFieldCharacters) {
                    var fieldOwnerIndex = this.fieldSeparator.OwnerParagraph.GetHierarchicalIndex("");
                    if (fieldOwnerIndex.indexOf(compositeNodeIndex) >= 0)
                        isUnlinkSeparator = false;
                }
                if (isUnlinkSeparator) {
                    this.fieldSeparator.Owner.AddFieldCharacter(this.fieldSeparator);
                    this.fieldSeparator.fieldBegin = null;
                    this.fieldSeparator = null;
                }
                else
                    this.fieldSeparator.Owner.AddFieldCharacter(this.fieldSeparator);
            }
            if (this.fieldEnd != null) {
                this.fieldEnd.Owner.AddFieldCharacter(this.fieldEnd);
                this.fieldEnd.fieldBegin = null;
                this.fieldEnd = null;
            }
            if (this.Owner.Fields.Contains(this))
                this.Owner.Fields.Remove(this);
            if (isAddToFieldCharacters)
                this.Owner.AddFieldCharacter(this);
        };
        ;
        FieldBeginAdv.prototype.RemoveAfterLinking = function (fieldCharacter) {
            this.Owner.RemoveFieldCharacter(fieldCharacter);
        };
        FieldBeginAdv.prototype.GetRenderedField = function () {
            var inline = this;
            if (this.FieldSeparator == null)
                inline = this.FieldEnd;
            else {
                inline = this.FieldSeparator;
                var paragraph = inline.OwnerParagraph;
                if (paragraph == this.FieldEnd.OwnerParagraph && !paragraph.HasValidInline(inline, this.FieldEnd))
                    inline = this.FieldEnd;
                else
                    return this;
            }
            return inline;
        };
        FieldBeginAdv.prototype.GetFieldCode = function () {
            if (this.fieldEnd == null || this.OwnerParagraph == null)
                return "";
            var isNestedFieldCode = false;
            var isFieldCodeParsed = false;
            return this.OwnerParagraph.GetFieldCode(this, isNestedFieldCode, isFieldCodeParsed, this);
        };
        FieldBeginAdv.prototype.InlineIsInFieldResult = function (inline) {
            if (this.fieldEnd != null && this.fieldSeparator != null) {
                if (this.fieldSeparator.IsExistBefore(inline))
                    return this.fieldEnd.IsExistAfter(inline);
            }
            return false;
        };
        FieldBeginAdv.prototype.ParagraphIsInFieldResult = function (paragraph) {
            if (this.fieldEnd != null && this.fieldSeparator != null) {
                if (this.fieldSeparator.Owner == paragraph || this.fieldSeparator.OwnerParagraph.IsExistBefore(paragraph))
                    return (this.fieldEnd.Owner != paragraph && this.fieldEnd.OwnerParagraph.IsExistAfter(paragraph));
            }
            return false;
        };
        FieldBeginAdv.prototype.GetNextWordOffset = function (indexInInline, type, isInField, endSelection, endPosition, excludeSpace) {
            var startOffset = this.OwnerParagraph.GetOffset(this, 0);
            var endOffset = startOffset + this.Length;
            if (this.FieldSeparator == null)
                this.fieldEnd.GetNextWordOffset(0, type, isInField, endSelection, endPosition, excludeSpace);
            else if (this.fieldEnd != null && type != 0) {
                var inline = this.FieldSeparator;
                if (inline.OwnerParagraph == this.FieldEnd.OwnerParagraph && !inline.OwnerParagraph.HasValidInline(inline, this.FieldEnd))
                    inline = this.FieldEnd;
                inline.GetNextWordOffset(0, type, !(endPosition.Paragraph == this.OwnerParagraph && endPosition.Offset == startOffset), endSelection, endPosition, excludeSpace);
                if (endSelection && this.fieldSeparator != null && endPosition.Paragraph == this.OwnerParagraph && endPosition.Offset == this.fieldSeparator.OwnerParagraph.GetOffset(this.fieldSeparator, this.fieldSeparator.Length)) {
                    endPosition.SetPositionParagraph(this.OwnerParagraph, startOffset);
                    return;
                }
                if (!endSelection)
                    endPosition.SetPositionParagraph(this.fieldEnd.OwnerParagraph, this.fieldEnd.OwnerParagraph.GetOffset(this.fieldEnd, this.fieldEnd.Length));
            }
        };
        FieldBeginAdv.prototype.GetPreviousWordOffset = function (indexInInline, type, isInField, isStarted, endSelection, endPosition) {
            var startOffset = this.OwnerParagraph.GetOffset(this, 0);
            var endOffset = startOffset + this.Length;
            if (endPosition.Offset == endOffset)
                endPosition.SetPositionParagraph(this.OwnerParagraph, startOffset);
            if (this.PreviousNode != null) {
                this.PreviousNode.GetPreviousWordOffset(this.PreviousNode.Length, type, false, isStarted, endSelection, endPosition);
                if (endPosition.Offset == startOffset)
                    endPosition.SetPositionParagraph(this.OwnerParagraph, endOffset);
            }
            else
                endPosition.SetPositionParagraph(this.OwnerParagraph, this.OwnerParagraph.GetStartOffset());
        };
        return FieldBeginAdv;
    }(FieldCharacterAdv));
    DocumentEditorFeatures.FieldBeginAdv = FieldBeginAdv;
    var FieldSeparatorAdv = (function (_super) {
        __extends(FieldSeparatorAdv, _super);
        function FieldSeparatorAdv(node) {
            _super.call(this, node);
            this.FieldBegin = null;
            this.FieldEnd = null;
        }
        Object.defineProperty(FieldSeparatorAdv.prototype, "fieldBegin", {
            get: function () {
                return this.FieldBegin;
            },
            set: function (value) {
                if (this.FieldBegin != value) {
                    var prevFieldBegin = this.FieldBegin;
                    this.FieldBegin = value;
                    if (prevFieldBegin != null) {
                        prevFieldBegin.fieldSeparator = null;
                        prevFieldBegin = null;
                    }
                    if (this.fieldBegin != null)
                        this.fieldBegin.fieldSeparator = this;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FieldSeparatorAdv.prototype, "fieldEnd", {
            get: function () {
                return this.FieldEnd;
            },
            set: function (value) {
                if (this.FieldEnd != value) {
                    var prevFieldEnd = this.FieldEnd;
                    this.FieldEnd = value;
                    if (prevFieldEnd != null) {
                        prevFieldEnd.fieldSeparator = null;
                        prevFieldEnd = null;
                    }
                    if (this.fieldEnd != null)
                        this.fieldEnd.fieldSeparator = this;
                }
            },
            enumerable: true,
            configurable: true
        });
        FieldSeparatorAdv.prototype.IsLinkedFieldCharacter = function () {
            return this.fieldBegin != null && this.fieldEnd != null;
        };
        ;
        FieldSeparatorAdv.prototype.GetNextWordOffset = function (indexInInline, type, isInField, endSelection, endPosition, excludeSpace) {
            if (this.NextNode != null)
                this.NextNode.GetNextWordOffset(0, type, isInField, endSelection, endPosition, excludeSpace);
        };
        FieldSeparatorAdv.prototype.GetPreviousWordOffset = function (indexInInline, type, isInField, isStarted, endSelection, endPosition) {
            this.FieldBegin.GetPreviousWordOffset(this.FieldBegin.Length, type, isInField, isStarted, endSelection, endPosition);
        };
        FieldSeparatorAdv.prototype.UnlinkFieldCharacter = function (compositeNodeIndex, isAddToFieldCharacters) {
            if (this.fieldBegin != null) {
                var isUnlinkSeparator = true;
                if (isAddToFieldCharacters) {
                    var fieldOwnerIndex = this.fieldBegin.OwnerParagraph.GetHierarchicalIndex("");
                    if (fieldOwnerIndex.indexOf(compositeNodeIndex) >= 0)
                        isUnlinkSeparator = false;
                }
                if (this.fieldEnd != null) {
                }
                if (isUnlinkSeparator) {
                    this.fieldBegin.Owner.AddFieldCharacter(this.fieldBegin);
                    this.fieldBegin.fieldSeparator = null;
                    this.fieldBegin = null;
                }
                else
                    this.fieldBegin.Owner.AddFieldCharacter(this.fieldBegin);
            }
            if (this.fieldEnd != null) {
                var isUnlinkSeparator = true;
                if (isAddToFieldCharacters) {
                    var fieldOwnerIndex = this.fieldEnd.OwnerParagraph.GetHierarchicalIndex("");
                    if (fieldOwnerIndex.indexOf(compositeNodeIndex) > 0)
                        isUnlinkSeparator = false;
                }
                if (isUnlinkSeparator) {
                    this.fieldEnd.Owner.AddFieldCharacter(this.fieldEnd);
                    this.fieldEnd.fieldSeparator = null;
                    this.fieldEnd = null;
                }
                else
                    this.fieldEnd.Owner.AddFieldCharacter(this.fieldEnd);
            }
            if (isAddToFieldCharacters)
                this.Owner.AddFieldCharacter(this);
        };
        ;
        FieldSeparatorAdv.prototype.CheckUnlinkFieldCharacter = function (compositeNodeIndex, isCheckFieldCharacters) {
            if (this.fieldBegin != null) {
                if (isCheckFieldCharacters) {
                    var fieldOwnerIndex = this.fieldBegin.OwnerParagraph.GetHierarchicalIndex("");
                    if (fieldOwnerIndex.indexOf(compositeNodeIndex) >= 0)
                        return;
                }
                this.fieldBegin.fieldSeparator = null;
                this.fieldBegin = null;
            }
            if (this.fieldEnd != null) {
                if (isCheckFieldCharacters) {
                    var fieldOwnerIndex = this.fieldEnd.OwnerParagraph.GetHierarchicalIndex("");
                    if (fieldOwnerIndex.indexOf(compositeNodeIndex) >= 0)
                        return;
                }
                this.fieldEnd.fieldSeparator = null;
                this.fieldEnd = null;
            }
        };
        ;
        return FieldSeparatorAdv;
    }(FieldCharacterAdv));
    DocumentEditorFeatures.FieldSeparatorAdv = FieldSeparatorAdv;
    var FieldEndAdv = (function (_super) {
        __extends(FieldEndAdv, _super);
        function FieldEndAdv(node) {
            _super.call(this, node);
            this.FieldBegin = null;
            this.FieldSeparator = null;
        }
        Object.defineProperty(FieldEndAdv.prototype, "fieldBegin", {
            get: function () {
                return this.FieldBegin;
            },
            set: function (value) {
                if (this.FieldBegin != value) {
                    var prevFieldBegin = this.FieldBegin;
                    this.FieldBegin = value;
                    if (prevFieldBegin != null) {
                        prevFieldBegin.fieldEnd = null;
                        prevFieldBegin = null;
                    }
                    if (this.fieldBegin != null)
                        this.fieldBegin.fieldEnd = this;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FieldEndAdv.prototype, "fieldSeparator", {
            get: function () {
                return this.FieldSeparator;
            },
            set: function (value) {
                if (this.FieldSeparator != value) {
                    var prevFieldSeparator = this.FieldSeparator;
                    this.FieldSeparator = value;
                    if (prevFieldSeparator != null) {
                        prevFieldSeparator.fieldEnd = null;
                        prevFieldSeparator = null;
                    }
                    if (this.fieldSeparator != null)
                        this.fieldSeparator.fieldEnd = this;
                }
            },
            enumerable: true,
            configurable: true
        });
        FieldEndAdv.prototype.IsLinkedFieldCharacter = function () {
            return this.fieldBegin != null;
        };
        ;
        FieldEndAdv.prototype.CheckUnlinkFieldCharacter = function (compositeNodeIndex, isCheckFieldCharacters) {
            if (this.fieldSeparator != null) {
                if (isCheckFieldCharacters) {
                    var fieldOwnerIndex = this.fieldSeparator.OwnerParagraph.GetHierarchicalIndex("");
                    if (fieldOwnerIndex.indexOf(compositeNodeIndex) >= 0)
                        return;
                }
                this.fieldSeparator.fieldEnd = null;
                this.fieldSeparator = null;
            }
        };
        ;
        FieldEndAdv.prototype.UnlinkFieldCharacter = function (compositeNodeIndex, isAddToFieldCharacters) {
            if (this.fieldBegin.Owner.Fields.Contains(this.fieldBegin))
                this.fieldBegin.Owner.Fields.Remove(this.fieldBegin);
            this.fieldBegin.Owner.AddFieldCharacter(this.fieldBegin);
            this.fieldBegin.fieldEnd = null;
            this.fieldBegin = null;
            if (this.fieldSeparator != null) {
                var isUnlinkSeparator = true;
                if (isAddToFieldCharacters) {
                    var fieldOwnerIndex = this.fieldSeparator.OwnerParagraph.GetHierarchicalIndex("");
                    if (fieldOwnerIndex.indexOf(compositeNodeIndex) > 0)
                        isUnlinkSeparator = false;
                }
                if (isUnlinkSeparator) {
                    this.fieldSeparator.Owner.AddFieldCharacter(this.fieldSeparator);
                    this.fieldSeparator.fieldEnd = null;
                    this.fieldSeparator = null;
                }
                else
                    this.fieldSeparator.Owner.AddFieldCharacter(this.fieldSeparator);
            }
            if (isAddToFieldCharacters)
                this.Owner.AddFieldCharacter(this);
        };
        FieldEndAdv.prototype.GetNextWordOffset = function (indexInInline, type, isInField, endSelection, endPosition, excludeSpace) {
            var startOffset = this.OwnerParagraph.GetOffset(this, 0);
            var endOffset = startOffset + this.Length;
            if (endPosition.Offset == startOffset) {
                endPosition.SetPositionParagraph(this.OwnerParagraph, endOffset);
                if (this.NextNode == null)
                    return;
            }
            if (this.NextNode != null) {
                this.NextNode.GetNextWordOffset(0, type, false, endSelection, endPosition, excludeSpace);
                if (endPosition.Offset == endOffset)
                    endPosition.SetPositionParagraph(this.OwnerParagraph, startOffset);
            }
            else
                endPosition.SetPositionParagraph(this.OwnerParagraph, startOffset);
            endSelection = true;
        };
        FieldEndAdv.prototype.GetPreviousWordOffset = function (indexInInline, type, isInField, isStarted, endSelection, endPosition) {
            var startOffset = this.OwnerParagraph.GetOffset(this, 0);
            var endOffset = startOffset + this.Length;
            if (this.FieldSeparator == null)
                this.fieldBegin.GetPreviousWordOffset(0, type, isInField, isStarted, endSelection, endPosition);
            else if (this.fieldBegin != null && type != 0) {
                var inline = this.PreviousNode;
                if (inline == null || (inline.OwnerParagraph == this.fieldBegin.OwnerParagraph && !inline.OwnerParagraph.HasValidInline(inline, this.fieldBegin)))
                    inline = this.fieldBegin;
                inline.GetPreviousWordOffset(inline.Length, type, !(endPosition.Paragraph == this.OwnerParagraph && endPosition.Offset == endOffset), isStarted, endSelection, endPosition);
                if (endSelection && endPosition.Paragraph == this.OwnerParagraph && endPosition.Offset == startOffset) {
                    endPosition.SetPositionParagraph(this.OwnerParagraph, endOffset);
                    return;
                }
                if (!endSelection)
                    endPosition.SetPositionParagraph(this.fieldBegin.OwnerParagraph, this.fieldBegin.OwnerParagraph.GetOffset(this.fieldBegin, 0));
            }
        };
        return FieldEndAdv;
    }(FieldCharacterAdv));
    DocumentEditorFeatures.FieldEndAdv = FieldEndAdv;
    var RequestNavigateEventArgs = (function () {
        function RequestNavigateEventArgs(hyperLink) {
            this.hyperLink = hyperLink;
        }
        Object.defineProperty(RequestNavigateEventArgs.prototype, "Hyperlink", {
            get: function () {
                return this.hyperLink;
            },
            enumerable: true,
            configurable: true
        });
        return RequestNavigateEventArgs;
    }());
    DocumentEditorFeatures.RequestNavigateEventArgs = RequestNavigateEventArgs;
    var HyperLink = (function () {
        function HyperLink(fieldBeginAdv) {
            var fieldCode = fieldBeginAdv.GetFieldCode();
            var lowercase = fieldCode.toLowerCase();
            fieldCode = fieldCode.substring(lowercase.indexOf("hyperlink") + 9);
            this.ParseFieldValues(fieldCode.trim());
        }
        Object.defineProperty(HyperLink.prototype, "NavigationLink", {
            get: function () {
                return this.navigationLink;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HyperLink.prototype, "LinkType", {
            get: function () {
                return this.linkType;
            },
            enumerable: true,
            configurable: true
        });
        HyperLink.prototype.ParseFieldValue = function (value, switchLevel, endChar) {
            value.string = value.string.substring(1);
            var endIndex = value.string.indexOf(endChar);
            if (endIndex == -1)
                endIndex = value.string.length;
            else {
                if (this.navigationLink == null)
                    this.navigationLink = value.string.substring(0, endIndex);
            }
            value.string = value.string.substring(endIndex + 1).trim();
        };
        HyperLink.prototype.ParseFieldValues = function (value) {
            var Value = {
                "string": value
            };
            var switchLevel = 0;
            while (Value.string.length > 0) {
                var currentChar = Value.string.substring(0, 1);
                switch (currentChar) {
                    case "\"":
                        this.ParseFieldValue(Value, switchLevel, "\"");
                        switchLevel = 0;
                        break;
                    case "\\l":
                    case "\\t":
                        value = value.substring(2);
                    default:
                        this.ParseFieldValue(Value, switchLevel, " ");
                        switchLevel = 0;
                        break;
                }
                Value.string = Value.string.trim();
            }
            this.navigationLink = this.navigationLink.trim();
            if (this.navigationLink.match("http://") || this.navigationLink.match("https://"))
                this.linkType = HyperlinkType.Webpage;
            else if (this.navigationLink.match("mailto:"))
                this.linkType = HyperlinkType.Email;
            else {
                if (this.navigationLink.match("www.")) {
                    this.navigationLink = "http://" + this.navigationLink;
                    this.linkType = HyperlinkType.Webpage;
                }
                else if (this.navigationLink.match("@")) {
                    this.navigationLink = "mailto:" + this.navigationLink;
                    this.linkType = HyperlinkType.Email;
                }
                else
                    this.linkType = HyperlinkType.File;
            }
        };
        return HyperLink;
    }());
    DocumentEditorFeatures.HyperLink = HyperLink;
    var Rect = (function () {
        function Rect(x, y, width, height) {
            this.X = this._left = x;
            this.Y = this._top = y;
            this._right = x + width;
            this._bottom = y + height;
            this.Width = width;
            this.Height = height;
        }
        Object.defineProperty(Rect.prototype, "Left", {
            get: function () {
                return this.X;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "Right", {
            get: function () {
                return this._right;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "Top", {
            get: function () {
                return this.Y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "Bottom", {
            get: function () {
                return this._bottom;
            },
            enumerable: true,
            configurable: true
        });
        return Rect;
    }());
    DocumentEditorFeatures.Rect = Rect;
    var Margin = (function () {
        function Margin(leftMargin, topMargin, rightMargin, bottomMargin) {
            this.left = leftMargin;
            this.top = topMargin;
            this.right = rightMargin;
            this.bottom = bottomMargin;
        }
        Object.defineProperty(Margin.prototype, "Left", {
            get: function () {
                return this.left;
            },
            set: function (value) {
                this.left = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Margin.prototype, "Top", {
            get: function () {
                return this.top;
            },
            set: function (value) {
                this.top = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Margin.prototype, "Right", {
            get: function () {
                return this.right;
            },
            set: function (value) {
                this.right = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Margin.prototype, "Bottom", {
            get: function () {
                return this.bottom;
            },
            set: function (value) {
                this.bottom = value;
            },
            enumerable: true,
            configurable: true
        });
        return Margin;
    }());
    DocumentEditorFeatures.Margin = Margin;
    var Point = (function () {
        function Point(xPosition, yPosition) {
            this.x = 0;
            this.y = 0;
            this.x = xPosition;
            this.y = yPosition;
        }
        Object.defineProperty(Point.prototype, "X", {
            get: function () {
                return this.x;
            },
            set: function (value) {
                this.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "Y", {
            get: function () {
                return this.y;
            },
            set: function (value) {
                this.y = value;
            },
            enumerable: true,
            configurable: true
        });
        return Point;
    }());
    DocumentEditorFeatures.Point = Point;
    var TextPosition = (function () {
        function TextPosition(value) {
            this.currentParagraph = null;
            this.offset = 0;
            this.location = new Point(0, 0);
            this.ownerControl = value;
        }
        Object.defineProperty(TextPosition.prototype, "OwnerControl", {
            get: function () {
                return this.ownerControl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextPosition.prototype, "Document", {
            get: function () {
                return this.OwnerControl.Document;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextPosition.prototype, "Paragraph", {
            get: function () {
                return this.currentParagraph;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextPosition.prototype, "Offset", {
            get: function () {
                return this.offset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextPosition.prototype, "Location", {
            get: function () {
                return this.location;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextPosition.prototype, "IsAtParagraphStart", {
            get: function () {
                return this.offset == this.Paragraph.GetStartOffset();
            },
            enumerable: true,
            configurable: true
        });
        TextPosition.prototype.SetPosition = function (paragraph, positionAtStart) {
            this.currentParagraph = paragraph;
            this.offset = positionAtStart ? paragraph.GetStartOffset() : paragraph.GetLength() + 1;
            this.UpdatePhysicalPosition();
        };
        TextPosition.prototype.SetPositionInternal = function (textPosition) {
            this.currentParagraph = textPosition.currentParagraph;
            this.offset = textPosition.offset;
            this.location = textPosition.location;
        };
        TextPosition.prototype.SetPositionForCurrentIndex = function (hierarchicalIndex) {
            var index = { Index: hierarchicalIndex };
            var paragraph = this.OwnerControl.Document.GetParagraph(index);
            this.offset = parseFloat(index.Index);
            this.SetPositionParagraph(paragraph, this.offset);
        };
        TextPosition.prototype.SetPositionParagraph = function (paragraph, offsetInParagraph) {
            this.currentParagraph = paragraph;
            this.offset = offsetInParagraph;
            this.UpdatePhysicalPosition();
        };
        TextPosition.prototype.UpdatePhysicalPosition = function () {
            if (this.currentParagraph.ParagraphWidgets.Count > 0)
                this.location = this.currentParagraph.GetPhysicalPosition(this.offset);
        };
        TextPosition.prototype.UpdatePhysicalPositionInternal = function (moveNextLine) {
            if (this.currentParagraph.ParagraphWidgets.Count > 0)
                this.location = this.currentParagraph.GetPhysicalPositionInternal(this.offset, moveNextLine);
        };
        TextPosition.prototype.SetPositionForSelection = function (paragraph, inline, index, physicalLocation) {
            var isParagraphEnd = false;
            if (inline == null)
                this.currentParagraph = paragraph;
            else {
                this.currentParagraph = inline.OwnerParagraph;
                if (inline.NextNode instanceof FieldCharacterAdv && index > inline.Length)
                    isParagraphEnd = inline.IsLastRenderedInline(inline.Length);
            }
            this.location = physicalLocation;
            if (isParagraphEnd)
                this.offset = this.currentParagraph.GetLength() + 1;
            else
                this.offset = this.currentParagraph.GetOffset(inline, index);
        };
        TextPosition.prototype.ValidateBackwardFieldSelection = function (currentIndex, selectionEndIndex) {
            var textPosition = new TextPosition(this.OwnerControl);
            textPosition.SetPositionForCurrentIndex(currentIndex);
            var selectionStartIndex = this.OwnerControl.Selection.Start.GetHierarchicalIndexInternal();
            while (currentIndex != selectionEndIndex && TextPosition.IsForwardSelection(selectionEndIndex, currentIndex)) {
                var indexInInline = 0;
                var inlineObj = textPosition.Paragraph.GetInline(textPosition.Offset, indexInInline);
                var inline = inlineObj.inline;
                indexInInline = inlineObj.index;
                if (inline != null) {
                    var nextInline = inline.GetNextRenderedInline(indexInInline);
                    if (nextInline instanceof FieldBeginAdv) {
                        var fieldEndOffset = nextInline.fieldEnd.OwnerParagraph.GetOffset(nextInline.fieldEnd, 1);
                        var fieldEndIndex = nextInline.fieldEnd.OwnerParagraph.GetHierarchicalIndex(fieldEndOffset.toString());
                        if (!TextPosition.IsForwardSelection(fieldEndIndex, selectionStartIndex)) {
                            this.OwnerControl.Selection.Start.SetPositionParagraph(nextInline.fieldEnd.OwnerParagraph, fieldEndOffset);
                            selectionStartIndex = fieldEndIndex;
                        }
                    }
                }
                if (inline instanceof FieldEndAdv && inline.FieldBegin != null) {
                    var fieldBeginOffset = inline.FieldBegin.OwnerParagraph.GetOffset(inline.FieldBegin, 0);
                    var fieldBeginIndex = inline.FieldBegin.OwnerParagraph.GetHierarchicalIndex(fieldBeginOffset.toString());
                    if (!TextPosition.IsForwardSelection(selectionEndIndex, fieldBeginIndex)) {
                        this.MoveToInline(inline.FieldBegin, 0);
                        return;
                    }
                    textPosition.MoveToInline(inline.FieldBegin, 0);
                }
                else
                    textPosition.MovePreviousPosition();
                currentIndex = textPosition.GetHierarchicalIndexInternal();
            }
        };
        TextPosition.prototype.ValidateForwardFieldSelection = function (currentIndex, selectionEndIndex) {
            var textPosition = new TextPosition(this.OwnerControl);
            textPosition.SetPositionForCurrentIndex(currentIndex);
            var isTextPositionMoved = false;
            while (currentIndex != selectionEndIndex && TextPosition.IsForwardSelection(currentIndex, selectionEndIndex)) {
                if (!isTextPositionMoved) {
                    textPosition.MoveNextPosition();
                    var nextIndex = textPosition.GetHierarchicalIndexInternal();
                    if (currentIndex == nextIndex)
                        break;
                }
                var indexInInline = 0;
                var inlineObj = textPosition.Paragraph.GetInline(textPosition.Offset, indexInInline);
                var inline = inlineObj.inline;
                indexInInline = inlineObj.index;
                if (inline != null) {
                    var selectionStartIndex = this.OwnerControl.Selection.Start.GetHierarchicalIndexInternal();
                    if (indexInInline == inline.Length && inline instanceof FieldEndAdv) {
                        if (inline.OwnerParagraph.GetOffset(inline, 0) == this.offset)
                            return;
                        var fieldBeginOffset = inline.FieldBegin.OwnerParagraph.GetOffset(inline.FieldBegin, 0);
                        var fieldBeginIndex = inline.FieldBegin.OwnerParagraph.GetHierarchicalIndex(fieldBeginOffset.toString());
                        if (!TextPosition.IsForwardSelection(selectionStartIndex, fieldBeginIndex))
                            this.OwnerControl.Selection.Start.SetPositionParagraph(inline.FieldBegin.OwnerParagraph, fieldBeginOffset);
                    }
                    inline = inline.GetNextRenderedInline(indexInInline);
                }
                if (isTextPositionMoved = (inline instanceof FieldBeginAdv && inline.fieldEnd != null)) {
                    if (inline.OwnerParagraph.GetOffset(inline, 0) == this.offset)
                        return;
                    var fieldEndOffset = inline.fieldEnd.OwnerParagraph.GetOffset(inline.fieldEnd, 1);
                    var fieldEndIndex = inline.fieldEnd.OwnerParagraph.GetHierarchicalIndex(fieldEndOffset.toString());
                    if (!TextPosition.IsForwardSelection(fieldEndIndex, selectionEndIndex)) {
                        this.MoveToInline(inline.fieldEnd, 1);
                        return;
                    }
                    textPosition.MoveToInline(inline.fieldEnd, 1);
                }
                currentIndex = textPosition.GetHierarchicalIndexInternal();
            }
        };
        TextPosition.prototype.MoveToInline = function (inline, index) {
            this.currentParagraph = inline.OwnerParagraph;
            this.offset = this.currentParagraph.GetOffset(inline, index);
            this.UpdatePhysicalPosition();
        };
        TextPosition.prototype.MovePreviousPosition = function () {
            var indexInInline = 0;
            var inlineObj = this.currentParagraph.GetInline(this.offset, indexInInline);
            var inline = inlineObj.inline;
            indexInInline = inlineObj.index;
            if (inline instanceof FieldEndAdv && inline.FieldBegin != null)
                this.MovePreviousPositionInternal(inline);
            var prevOffset = this.currentParagraph.GetPreviousValidOffset(this.offset);
            if (this.offset > prevOffset)
                this.offset = prevOffset;
            else {
                var previousParagraph = this.currentParagraph.GetPreviousParagraph();
                if (previousParagraph != null) {
                    this.currentParagraph = previousParagraph;
                    this.offset = previousParagraph.GetEndOffset();
                }
            }
            indexInInline = 0;
            inlineObj = this.currentParagraph.GetInline(this.offset, indexInInline);
            inline = inlineObj.inline;
            indexInInline = inlineObj.index;
            if (inline instanceof FieldCharacterAdv) {
                var prevInline = inline.GetPreviousValidInline();
                if (prevInline != null) {
                    inline = prevInline;
                    this.currentParagraph = inline.OwnerParagraph;
                    this.offset = this.currentParagraph.GetOffset(inline, inline.Length);
                    if (inline instanceof FieldBeginAdv)
                        this.offset--;
                }
            }
            this.UpdatePhysicalPosition();
        };
        TextPosition.prototype.MoveNextPosition = function () {
            var inline = this.currentParagraph.GetNextStartInline(this.offset);
            if (inline instanceof FieldBeginAdv && inline.fieldEnd != null) {
                this.MoveNextPositionInternal(inline);
                this.MoveNextPosition();
                return;
            }
            var nextOffset = this.currentParagraph.GetNextValidOffset(this.offset);
            var indexInInline = 0;
            if (nextOffset > this.offset) {
                this.offset = nextOffset;
                var inlineObj = this.currentParagraph.GetInline(this.offset, indexInInline);
                inline = inlineObj.inline;
                indexInInline = inlineObj.index;
                if (inline != null && indexInInline == inline.Length && inline.NextNode instanceof FieldCharacterAdv) {
                    var nextValidInline = inline.NextNode.GetNextValidInline();
                    if (nextValidInline instanceof FieldEndAdv) {
                        inline = nextValidInline;
                        this.offset = this.currentParagraph.GetOffset(inline, 1);
                    }
                }
            }
            else {
                var nextParagraph = this.currentParagraph.GetNextParagraph();
                if (nextParagraph != null) {
                    this.currentParagraph = nextParagraph;
                    this.offset = this.currentParagraph.GetStartOffset();
                }
                var inlineObj = this.currentParagraph.GetInline(this.offset, indexInInline);
                inline = inlineObj.inline;
                indexInInline = inlineObj.index;
                if (inline instanceof FieldEndAdv)
                    this.offset++;
            }
            this.UpdatePhysicalPosition();
        };
        TextPosition.prototype.MoveNextPositionInternal = function (fieldBegin) {
            var inline;
            if (fieldBegin.fieldSeparator == null)
                inline = fieldBegin.fieldEnd;
            else {
                inline = fieldBegin.fieldSeparator;
                this.currentParagraph = inline.OwnerParagraph;
                if (this.currentParagraph == fieldBegin.fieldEnd.OwnerParagraph && !this.currentParagraph.HasValidInline(inline, fieldBegin.fieldEnd))
                    inline = fieldBegin.fieldEnd;
            }
            this.currentParagraph = inline.OwnerParagraph;
            this.offset = this.currentParagraph.GetOffset(inline, 1);
        };
        TextPosition.prototype.MovePreviousPositionInternal = function (fieldEnd) {
            var inline;
            if (fieldEnd.FieldSeparator == null)
                inline = fieldEnd.FieldBegin.GetPreviousValidInline();
            else
                inline = fieldEnd.GetPreviousValidInline();
            this.currentParagraph = inline.OwnerParagraph;
            this.offset = this.currentParagraph.GetOffset(inline, inline instanceof FieldCharacterAdv ? 0 : inline.Length);
        };
        TextPosition.prototype.UpdateTextPositionOnFieldCharacter = function (startPosition) {
            var textPosition = new TextPosition(this.OwnerControl);
            textPosition.SetPositionInternal(startPosition);
            var currentIndex = startPosition.GetHierarchicalIndexInternal();
            var selectionEndIndex = this.GetHierarchicalIndexInternal();
            var isTextPositionMoved = false;
            while (currentIndex != selectionEndIndex && TextPosition.IsForwardSelection(currentIndex, selectionEndIndex)) {
                if (!isTextPositionMoved) {
                    textPosition.MoveNextPosition();
                    var nextIndex = textPosition.GetHierarchicalIndexInternal();
                    if (currentIndex == nextIndex)
                        break;
                }
                var indexInInline = 0;
                var inlineObj = textPosition.Paragraph.GetInline(textPosition.Offset, indexInInline);
                var inline = inlineObj.inline;
                indexInInline = inlineObj.index;
                if (inline != null) {
                    var selectionStartIndex = this.OwnerControl.Selection.Start.GetHierarchicalIndexInternal();
                    if (indexInInline == inline.Length && inline instanceof FieldEndAdv) {
                        if (inline.OwnerParagraph.GetOffset(inline, 0) == this.offset)
                            return;
                        var fieldBeginOffset = inline.FieldBegin.OwnerParagraph.GetOffset(inline.FieldBegin, 0);
                        var fieldBeginIndex = inline.FieldBegin.OwnerParagraph.GetHierarchicalIndex(fieldBeginOffset.toString());
                        if (!TextPosition.IsForwardSelection(selectionStartIndex, fieldBeginIndex))
                            startPosition.SetPositionParagraph(inline.FieldBegin.OwnerParagraph, fieldBeginOffset);
                    }
                    inline = inline.GetNextRenderedInline(indexInInline);
                }
                if (isTextPositionMoved = (inline instanceof FieldBeginAdv && inline.fieldEnd != null)) {
                    if (inline.OwnerParagraph.GetOffset(inline, 0) == this.offset)
                        return;
                    var fieldEndOffset = inline.fieldEnd.OwnerParagraph.GetOffset(inline.fieldEnd, 1);
                    var fieldEndIndex = inline.fieldEnd.OwnerParagraph.GetHierarchicalIndex(fieldEndOffset.toString());
                    if (!TextPosition.IsForwardSelection(fieldEndIndex, selectionEndIndex)) {
                        this.MoveToInline(inline.fieldEnd, 1);
                        return;
                    }
                    textPosition.MoveToInline(inline.fieldEnd, 1);
                }
                currentIndex = textPosition.GetHierarchicalIndexInternal();
            }
        };
        TextPosition.prototype.MoveForward = function () {
            var indexInInline = 0;
            var inlineObj = this.currentParagraph.GetInline(this.offset, indexInInline);
            var inline = inlineObj.inline;
            indexInInline = inlineObj.index;
            if (inline != null) {
                if (!this.OwnerControl.Selection.IsEmpty && indexInInline == inline.Length && inline instanceof FieldEndAdv) {
                    var hierarchicalIndex = this.OwnerControl.Selection.Start.GetHierarchicalIndexInternal();
                    var fieldBeginOffset = inline.FieldBegin.OwnerParagraph.GetOffset(inline.FieldBegin, 0);
                    var fieldBeginIndex = inline.FieldBegin.OwnerParagraph.GetHierarchicalIndex(fieldBeginOffset.toString());
                    if (!TextPosition.IsForwardSelection(hierarchicalIndex, fieldBeginIndex)) {
                        this.OwnerControl.Selection.Start.SetPositionParagraph(inline.FieldBegin.OwnerParagraph, fieldBeginOffset);
                        return;
                    }
                }
                inline = inline.GetNextRenderedInline(indexInInline);
            }
            if (inline instanceof FieldBeginAdv && inline.fieldEnd != null) {
                var selectionStartParagraph = this.OwnerControl.Selection.Start.Paragraph;
                var selectionStartIndex = 0;
                var selectionStartInlineObj = selectionStartParagraph.GetInline(this.OwnerControl.Selection.Start.Offset, selectionStartIndex);
                var selectionStartInline = selectionStartInlineObj.inline;
                selectionStartIndex = selectionStartInlineObj.index;
                var nextRenderInline = selectionStartInline.GetNextRenderedInline(selectionStartIndex);
                if (nextRenderInline == inline)
                    this.MoveNextPositionInternal(inline);
                else {
                    inline = inline.fieldEnd;
                    this.currentParagraph = inline.OwnerParagraph;
                    this.offset = this.currentParagraph.GetOffset(inline, 1);
                    this.UpdatePhysicalPosition();
                    return;
                }
            }
            else if (inline instanceof FieldBeginAdv || inline instanceof FieldEndAdv) {
                this.currentParagraph = inline.OwnerParagraph;
                this.offset = this.currentParagraph.GetOffset(inline, 1);
            }
            indexInInline = 0;
            var nextOffset = this.currentParagraph.GetNextValidOffset(this.offset);
            var length = this.currentParagraph.GetLength() - 1;
            if (this.offset <= nextOffset && this.offset < length + 1) {
                if (this.offset == nextOffset)
                    this.offset = length + 1;
                else {
                    this.offset = nextOffset;
                    var inlineObj_1 = this.currentParagraph.GetInline(this.offset, indexInInline);
                    inline = inlineObj_1.inline;
                    indexInInline = inlineObj_1.index;
                    if (inline != null && indexInInline == inline.Length && inline.NextNode instanceof FieldCharacterAdv) {
                        var nextValidInline = inline.NextNode.GetNextValidInline();
                        if (nextValidInline instanceof FieldEndAdv) {
                            inline = nextValidInline;
                            this.offset = this.currentParagraph.GetOffset(inline, 1);
                        }
                    }
                }
            }
            else {
                var lastParagraph = this.currentParagraph.GetNextSelection(this.OwnerControl.Selection);
                if (lastParagraph != null) {
                    var positionAtEnd = false;
                    if (lastParagraph.Owner instanceof TableCellAdv) {
                        if (this.OwnerControl.Selection.Start.Paragraph.IsInsideTable) {
                            var containerCell = this.OwnerControl.Selection.Start.Paragraph.AssociatedCell.GetContainerCellOf(lastParagraph.AssociatedCell);
                            positionAtEnd = !containerCell.Contains(lastParagraph.AssociatedCell);
                        }
                        else
                            positionAtEnd = true;
                    }
                    this.currentParagraph = lastParagraph;
                    this.offset = positionAtEnd ? this.currentParagraph.GetLength() + 1 : 1;
                }
                var inlineObj_2 = this.currentParagraph.GetInline(this.offset, indexInInline);
                inline = inlineObj_2.inline;
                indexInInline = inlineObj_2.index;
                if (inline instanceof FieldEndAdv)
                    this.offset++;
            }
            this.UpdatePhysicalPosition();
        };
        TextPosition.prototype.MoveBackward = function () {
            var indexInInline = 0;
            var inlineObj = this.currentParagraph.GetInline(this.offset, indexInInline);
            var inline = inlineObj.inline;
            indexInInline = inlineObj.index;
            if (!this.OwnerControl.Selection.IsEmpty && inline != null) {
                var nextInline = inline.GetNextRenderedInline(indexInInline);
                if (nextInline instanceof FieldBeginAdv) {
                    var hierarchicalIndex = this.OwnerControl.Selection.Start.GetHierarchicalIndexInternal();
                    var fieldEndOffset = nextInline.fieldEnd.OwnerParagraph.GetOffset(nextInline.fieldEnd, 1);
                    var fieldEndIndex = nextInline.fieldEnd.OwnerParagraph.GetHierarchicalIndex(fieldEndOffset.toString());
                    if (!TextPosition.IsForwardSelection(fieldEndIndex, hierarchicalIndex)) {
                        this.OwnerControl.Selection.Start.SetPositionParagraph(nextInline.fieldEnd.OwnerParagraph, fieldEndOffset);
                        return;
                    }
                }
            }
            if (inline instanceof FieldEndAdv && inline.FieldBegin != null) {
                var hierarchicalIndex = this.OwnerControl.Selection.Start.GetHierarchicalIndexInternal();
                var fieldEndOffset = inline.OwnerParagraph.GetOffset(inline, 1);
                var fieldEndIndex = inline.OwnerParagraph.GetHierarchicalIndex(fieldEndOffset.toString());
                if (!TextPosition.IsForwardSelection(hierarchicalIndex, fieldEndIndex)) {
                    var fieldBeginOffset = inline.FieldBegin.OwnerParagraph.GetOffset(inline.FieldBegin, 0);
                    this.currentParagraph = inline.FieldBegin.OwnerParagraph;
                    this.offset = fieldBeginOffset;
                    this.UpdatePhysicalPosition();
                    return;
                }
                this.MovePreviousPositionInternal(inline);
            }
            var prevOffset = this.currentParagraph.GetPreviousValidOffset(this.offset);
            if (this.offset > prevOffset)
                this.offset = prevOffset;
            else {
                var lastParagraph = this.currentParagraph.GetPreviousSelection(this.OwnerControl.Selection);
                if (lastParagraph != null) {
                    var positionAtStart = false;
                    if (lastParagraph.Owner instanceof TableCellAdv) {
                        if (this.OwnerControl.Selection.Start.Paragraph.IsInsideTable) {
                            var containerCell = this.OwnerControl.Selection.Start.Paragraph.AssociatedCell.GetContainerCellOf(lastParagraph.AssociatedCell);
                            positionAtStart = !containerCell.Contains(lastParagraph.AssociatedCell);
                        }
                        else
                            positionAtStart = true;
                    }
                    this.currentParagraph = lastParagraph;
                    this.offset = positionAtStart ? this.currentParagraph.GetStartOffset() : this.currentParagraph.GetEndOffset();
                }
            }
            indexInInline = 0;
            inlineObj = this.currentParagraph.GetInline(this.offset, indexInInline);
            inline = inlineObj.inline;
            indexInInline = inlineObj.index;
            if (inline instanceof FieldCharacterAdv) {
                var prevInline = inline.GetPreviousValidInline();
                if (prevInline != null) {
                    inline = prevInline;
                    this.currentParagraph = inline.OwnerParagraph;
                    this.offset = this.currentParagraph.GetOffset(inline, inline instanceof FieldBeginAdv ? 0 : inline.Length);
                }
            }
            this.UpdatePhysicalPosition();
        };
        TextPosition.prototype.MoveToWordEnd = function (type, excludeSpace) {
            var endOffset = this.currentParagraph.GetEndOffset();
            if (this.offset == endOffset || this.offset == endOffset + 1) {
                if (this.offset == endOffset && type != 0)
                    this.SetPositionParagraph(this.currentParagraph, endOffset + 1);
                else {
                    var nextParagraph = this.currentParagraph.GetNextParagraph();
                    if (nextParagraph == null)
                        return;
                    this.currentParagraph = nextParagraph;
                    this.offset = this.currentParagraph.GetStartOffset();
                    if (type == 1) {
                        if ((this.OwnerControl.Selection.Start.Paragraph.IsInsideTable || this.Paragraph.IsInsideTable)
                            && (this.OwnerControl.Selection.Start.Paragraph.AssociatedCell != this.Paragraph.AssociatedCell || this.OwnerControl.Selection.Start.Paragraph.AssociatedCell.IsCellSelected(this.OwnerControl.Selection.Start, this)))
                            this.MoveToNextParagraphInTable();
                        else
                            this.MoveToWordEnd(type, excludeSpace);
                    }
                }
            }
            else {
                var indexInInline = 0;
                var endSelection = false;
                var EndSelection = { endSelection: endSelection };
                var inlineObj = this.currentParagraph.GetInline(this.Offset, indexInInline);
                var inline = inlineObj.inline;
                indexInInline = inlineObj.index;
                inline.GetNextWordOffset(indexInInline, type, false, EndSelection.endSelection, this, excludeSpace);
            }
            if (type != 0) {
                var selectionStartIndex = this.OwnerControl.Selection.Start.GetHierarchicalIndexInternal();
                var selectionEndIndex = this.GetHierarchicalIndexInternal();
                if (selectionStartIndex != selectionEndIndex)
                    this.ValidateForwardFieldSelection(selectionStartIndex, selectionEndIndex);
            }
            this.UpdatePhysicalPosition();
        };
        TextPosition.prototype.MoveToWordStart = function (type) {
            var endOffset = this.currentParagraph.GetEndOffset();
            if (type == 2 && (this.offset == endOffset || this.offset == endOffset + 1))
                return;
            if (this.offset == endOffset + 1) {
                this.offset = endOffset;
            }
            else if (this.offset == this.currentParagraph.GetStartOffset()) {
                var previousParagraph = this.currentParagraph.GetPreviousParagraph();
                if (previousParagraph == null)
                    return;
                this.currentParagraph = previousParagraph;
                this.offset = this.currentParagraph.GetEndOffset();
            }
            else {
                var isStarted = false;
                var endSelection = false;
                var indexInInline = 0;
                var inlineObj = this.currentParagraph.GetInline(this.offset, indexInInline);
                var inline = inlineObj.inline;
                indexInInline = inlineObj.index;
                inline.GetPreviousWordOffset(indexInInline, type, inline instanceof FieldEndAdv, isStarted, endSelection, this);
            }
            if (type == 1) {
                var selectionStartIndex = this.OwnerControl.Selection.Start.GetHierarchicalIndexInternal();
                var selectionEndIndex = this.GetHierarchicalIndexInternal();
                if (selectionStartIndex != selectionEndIndex)
                    this.ValidateBackwardFieldSelection(selectionStartIndex, selectionEndIndex);
            }
            this.UpdatePhysicalPosition();
        };
        TextPosition.prototype.MoveToLineStart = function (movepreviousline) {
            var currentLine = this.currentParagraph.GetLineWidgetInternal(this.offset, movepreviousline);
            var firstElement = currentLine.GetFirstElementInternal();
            var startOffset = this.currentParagraph.GetStartOffset();
            if (firstElement == null && this.offset > startOffset)
                this.offset = startOffset;
            else if (firstElement != null) {
                var indexInInline = firstElement.GetIndexInInline();
                this.currentParagraph = firstElement.Inline.OwnerParagraph;
                this.offset = this.currentParagraph.GetOffset(firstElement.Inline, indexInInline);
                indexInInline = 0;
                var inlineObj = this.currentParagraph.GetInline(this.offset, indexInInline);
                var inline = inlineObj.inline;
                indexInInline = inlineObj.index;
                if (inline instanceof FieldCharacterAdv) {
                    var prevInline = inline.GetPreviousValidInline();
                    if (prevInline != null) {
                        inline = prevInline;
                        this.currentParagraph = inline.OwnerParagraph;
                        this.offset = this.currentParagraph.GetOffset(inline, inline.Length);
                        if (inline instanceof FieldBeginAdv)
                            this.offset--;
                    }
                }
            }
            this.UpdatePhysicalPosition();
        };
        TextPosition.prototype.MoveToLineEnd = function (movetonextline) {
            var currentLine = this.currentParagraph.GetLineWidget(this.offset);
            var firstElement = currentLine.GetFirstElementInternal();
            if (firstElement == null && this.offset == this.Paragraph.GetStartOffset()) {
                this.offset = this.Paragraph.GetLength() + 1;
                this.UpdatePhysicalPosition();
            }
            else if (firstElement != null) {
                var lastElement = currentLine.Children[currentLine.Children.Count - 1];
                var index = lastElement.GetIndexInInline();
                index += lastElement instanceof TextElementBox ? lastElement.Length : 1;
                this.currentParagraph = lastElement.Inline.OwnerParagraph;
                if (index == lastElement.Inline.Length
                    && lastElement.Inline.NextNode == null)
                    this.offset = this.currentParagraph.GetLength() + 1;
                else {
                    var inline = lastElement.Inline;
                    while (inline != null && inline.Length == index && inline.NextNode instanceof FieldCharacterAdv) {
                        var nextInline = inline.NextNode.GetNextValidInline();
                        if (inline != nextInline) {
                            inline = nextInline;
                            index = 0;
                        }
                        if (inline instanceof FieldBeginAdv && inline.fieldEnd != null) {
                            var fieldBegin = inline;
                            if (fieldBegin.fieldSeparator == null)
                                inline = fieldBegin.fieldEnd;
                            else {
                                inline = fieldBegin.fieldSeparator;
                                this.currentParagraph = inline.OwnerParagraph;
                                if (this.currentParagraph == fieldBegin.fieldEnd.OwnerParagraph && !this.currentParagraph.HasValidInline(inline, fieldBegin.fieldEnd))
                                    inline = fieldBegin.fieldEnd;
                            }
                            this.currentParagraph = inline.OwnerParagraph;
                        }
                        if (inline instanceof FieldCharacterAdv)
                            index = 1;
                    }
                    if (index == inline.Length && inline.NextNode == null)
                        index++;
                    this.offset = this.currentParagraph.GetOffset(inline, index);
                }
                this.UpdatePhysicalPositionInternal(movetonextline);
            }
        };
        TextPosition.prototype.MoveToNextLine = function (left) {
            var textPosition = new TextPosition(this.OwnerControl);
            textPosition.SetPositionInternal(this);
            var currentIndex = this.GetHierarchicalIndexInternal();
            var currentLine = this.currentParagraph.GetLineWidget(this.offset);
            this.MoveToLineEnd(true);
            var isMoveToLineEnd = !textPosition.IsAtSamePosition(this);
            textPosition.SetPositionInternal(this);
            if (this.currentParagraph.IsInsideTable)
                this.MoveDownInTable();
            else
                this.MoveForward();
            var nextLine = this.currentParagraph.GetLineWidget(this.offset);
            var lineStart = nextLine.GetLeft();
            var firstElement = nextLine.GetFirstElementInternal();
            var firstItemWidth = firstElement == null ? nextLine.GetWidth(true) : nextLine.GetLeftInternal(firstElement, 1) - lineStart;
            if (lineStart < left && (firstItemWidth / 2 < left - lineStart)) {
                var top_4 = nextLine.GetTop();
                var point = new Point(left, top_4);
                nextLine.UpdateTextPositionWidget(this.OwnerControl, point, this, true);
                var width = nextLine.GetWidth(true);
                if (width < left - lineStart)
                    this.MoveToLineEnd(true);
            }
            else if (isMoveToLineEnd && this.currentParagraph.IsInsideTable
                && this.currentParagraph.Owner == this.OwnerControl.Selection.Start.currentParagraph.Owner)
                this.SetPositionInternal(textPosition);
            else if (!isMoveToLineEnd)
                this.MoveToLineEnd(true);
            var selectionEndIndex = this.GetHierarchicalIndexInternal();
            this.ValidateForwardFieldSelection(currentIndex, selectionEndIndex);
        };
        TextPosition.prototype.MoveDownInTable = function () {
            var isPositionUpdated = false;
            var isForwardSelection = this.OwnerControl.Selection.IsEmpty || this.OwnerControl.Selection.IsForward;
            if (isPositionUpdated = this.OwnerControl.Selection.Start.Paragraph.IsInsideTable) {
                var startCell = this.OwnerControl.Selection.Start.Paragraph.AssociatedCell;
                var endCell = this.currentParagraph.AssociatedCell;
                var containerCell = startCell.GetContainerCellOf(endCell);
                if (isPositionUpdated = containerCell.OwnerTable.Contains(endCell)) {
                    startCell = startCell.GetSelectedCell(containerCell);
                    endCell = endCell.GetSelectedCell(containerCell);
                    var isInContainerCell = containerCell.Contains(this.currentParagraph.AssociatedCell);
                    var isContainerCellSelected = containerCell.IsCellSelected(this.OwnerControl.Selection.Start, this);
                    if ((isInContainerCell && isContainerCellSelected
                        || !isInContainerCell) && endCell.OwnerRow.NextNode != null) {
                        var row = endCell.OwnerRow.NextNode;
                        var cell = row.GetLastCellInRegion(containerCell, this.OwnerControl.Selection.UpDownSelectionLength, false);
                        this.SetPosition(cell.GetLastParagraph(), false);
                        return;
                    }
                    else if (isInContainerCell && isContainerCellSelected && endCell.OwnerRow.NextNode == null || !isInContainerCell) {
                        if (isForwardSelection) {
                            endCell = endCell.OwnerRow.Cells[endCell.OwnerRow.Cells.Count - 1];
                            this.SetPosition(endCell.GetLastParagraph(), false);
                        }
                        else {
                            endCell = endCell.OwnerRow.Cells[0];
                            this.SetPosition(endCell.GetFirstParagraph(), true);
                        }
                    }
                }
            }
            if (!isPositionUpdated) {
                var cell = this.currentParagraph.AssociatedCell.GetContainerCell();
                if (isForwardSelection) {
                    cell = cell.OwnerRow.Cells[cell.OwnerRow.Cells.Count - 1];
                    this.SetPosition(cell.GetLastParagraph(), false);
                }
                else {
                    cell = cell.OwnerRow.Cells[0];
                    this.SetPosition(cell.GetFirstParagraph(), true);
                }
            }
            this.MoveForward();
        };
        TextPosition.prototype.MoveToPreviousLine = function (left) {
            var currentIndex = this.GetHierarchicalIndexInternal();
            var currentLine = this.currentParagraph.GetLineWidget(this.offset);
            this.MoveToLineStart(true);
            if (this.currentParagraph.IsInsideTable)
                this.MoveUpInTable();
            else
                this.MoveBackward();
            var prevLine = this.currentParagraph.GetLineWidget(this.offset);
            var lineStart = prevLine.GetLeft();
            var lineWidth = prevLine.GetWidth(true);
            if (lineWidth + lineStart >= left && currentLine != prevLine) {
                var top_5 = prevLine.GetTop();
                var point = new Point(left, top_5);
                prevLine.UpdateTextPositionWidget(this.OwnerControl, point, this, true);
            }
            var selectionEndIndex = this.GetHierarchicalIndexInternal();
            this.ValidateBackwardFieldSelection(currentIndex, selectionEndIndex);
        };
        TextPosition.prototype.MoveUpInTable = function () {
            var isPositionUpdated = false;
            var end = this.OwnerControl.Selection.End;
            var isBackwardSelection = !this.OwnerControl.Selection.IsEmpty;
            if (isPositionUpdated = end.Paragraph.IsInsideTable) {
                var startCell = this.currentParagraph.AssociatedCell;
                var endCell = end.Paragraph.AssociatedCell;
                var containerCell = endCell.GetContainerCellOf(startCell);
                if (isPositionUpdated = containerCell.OwnerTable.Contains(startCell)) {
                    endCell = endCell.GetSelectedCell(containerCell);
                    startCell = startCell.GetSelectedCell(containerCell);
                    var isInContainerCell = containerCell.Contains(this.currentParagraph.AssociatedCell);
                    var isContainerCellSelected = containerCell.IsCellSelected(this, end);
                    if (!isContainerCellSelected)
                        isContainerCellSelected = this.currentParagraph == containerCell.GetFirstParagraph() && this.IsAtParagraphStart;
                    if ((isInContainerCell && isContainerCellSelected
                        || !isInContainerCell) && startCell.OwnerRow.PreviousNode != null) {
                        var row = startCell.OwnerRow.PreviousNode;
                        var cell = row.GetFirstCellInRegion(containerCell, this.OwnerControl.Selection.UpDownSelectionLength, true);
                        this.SetPosition(cell.GetFirstParagraph(), true);
                        return;
                    }
                    else if (isInContainerCell && isContainerCellSelected && startCell.OwnerRow.PreviousNode == null || !isInContainerCell) {
                        if (isBackwardSelection) {
                            startCell = startCell.OwnerRow.Cells[0];
                            this.SetPosition(startCell.GetFirstParagraph(), true);
                        }
                        else {
                            startCell = startCell.OwnerRow.Cells[startCell.OwnerRow.Cells.Count - 1];
                            this.SetPosition(startCell.GetLastParagraph(), false);
                        }
                    }
                }
            }
            if (!isPositionUpdated) {
                var cell = this.currentParagraph.AssociatedCell.GetContainerCell();
                if (isBackwardSelection) {
                    cell = cell.OwnerRow.Cells[0];
                    this.SetPosition(cell.GetFirstParagraph(), true);
                }
                else {
                    cell = cell.OwnerRow.Cells[cell.OwnerRow.Cells.Count - 1];
                    this.SetPosition(cell.GetLastParagraph(), false);
                }
            }
            this.MoveBackward();
        };
        TextPosition.prototype.MoveToParagraphStart = function (moveToPreviousParagraph) {
            var startOffset = this.currentParagraph.GetStartOffset();
            if (this.offset == startOffset && moveToPreviousParagraph) {
                if ((this.OwnerControl.Selection.Start.Paragraph.IsInsideTable || this.Paragraph.IsInsideTable)
                    && (this.OwnerControl.Selection.Start.Paragraph.AssociatedCell != this.Paragraph.AssociatedCell
                        || this.OwnerControl.Selection.Start.Paragraph.AssociatedCell.IsCellSelected(this.OwnerControl.Selection.Start, this)))
                    this.MoveToPreviousParagraphInTable();
                else if (this.currentParagraph.GetPreviousParagraph() != null) {
                    this.currentParagraph = this.currentParagraph.GetPreviousParagraph();
                    this.offset = this.currentParagraph.GetStartOffset();
                }
            }
            else
                this.offset = this.currentParagraph.GetStartOffset();
            var selectionStartIndex = this.OwnerControl.Selection.Start.GetHierarchicalIndexInternal();
            var selectionEndIndex = this.GetHierarchicalIndexInternal();
            if (selectionStartIndex != selectionEndIndex)
                this.ValidateBackwardFieldSelection(selectionStartIndex, selectionEndIndex);
            this.UpdatePhysicalPosition();
        };
        TextPosition.prototype.MoveToParagraphEnd = function (moveToNextParagraph) {
            var startParagraph = this.OwnerControl.Selection.Start.Paragraph;
            var endOffset = this.currentParagraph.GetEndOffset() + 1;
            if (this.offset == endOffset && moveToNextParagraph) {
                if ((this.OwnerControl.Selection.Start.Paragraph.IsInsideTable || this.Paragraph.IsInsideTable)
                    && (this.OwnerControl.Selection.Start.Paragraph.AssociatedCell != this.Paragraph.AssociatedCell
                        || this.OwnerControl.Selection.Start.Paragraph.AssociatedCell.IsCellSelected(this.OwnerControl.Selection.Start, this)))
                    this.MoveToNextParagraphInTable();
                else if (this.currentParagraph.GetNextParagraph() != null) {
                    this.currentParagraph = this.currentParagraph.GetNextParagraph();
                    this.offset = this.currentParagraph.GetEndOffset() + 1;
                }
            }
            else
                this.offset = this.currentParagraph.GetEndOffset() + 1;
            var selectionStartIndex = this.OwnerControl.Selection.Start.GetHierarchicalIndexInternal();
            var selectionEndIndex = this.GetHierarchicalIndexInternal();
            if (selectionStartIndex != selectionEndIndex)
                this.ValidateForwardFieldSelection(selectionStartIndex, selectionEndIndex);
            this.UpdatePhysicalPosition();
        };
        TextPosition.prototype.MoveToPreviousParagraphInTable = function () {
            var previousParagraph;
            if (this.currentParagraph.IsInsideTable)
                previousParagraph = this.currentParagraph.AssociatedCell.GetPreviousSelection(this.OwnerControl.Selection);
            else
                previousParagraph = this.currentParagraph.GetPreviousParagraph();
            if (previousParagraph == null)
                return;
            this.currentParagraph = previousParagraph;
            this.offset = this.currentParagraph.GetStartOffset();
        };
        TextPosition.prototype.MoveToNextParagraphInTable = function () {
            var nextParagraph;
            if (this.currentParagraph.IsInsideTable)
                nextParagraph = this.currentParagraph.AssociatedCell.GetNextSelection(this.OwnerControl.Selection);
            else
                nextParagraph = this.currentParagraph.GetNextParagraph();
            if (nextParagraph == null)
                return;
            this.currentParagraph = nextParagraph;
            this.offset = this.currentParagraph.GetEndOffset() + 1;
        };
        TextPosition.prototype.MoveToPreviousParagraph = function () {
            var startOffset = this.currentParagraph.GetStartOffset();
            if (this.offset == startOffset && this.currentParagraph.GetPreviousParagraph() != null) {
                this.currentParagraph = this.currentParagraph.GetPreviousParagraph();
                this.offset = this.currentParagraph.GetStartOffset();
            }
            else
                this.offset = this.currentParagraph.GetStartOffset();
            this.UpdatePhysicalPosition();
        };
        TextPosition.prototype.MoveToNextParagraph = function () {
            if (this.currentParagraph.GetNextParagraph() != null) {
                this.currentParagraph = this.currentParagraph.GetNextParagraph();
                this.offset = this.currentParagraph.GetStartOffset();
                this.UpdatePhysicalPosition();
            }
        };
        TextPosition.prototype.IsInSameDocument = function (textPosition) {
            if (textPosition == null)
                throw new RangeError("The textPosition cannot be null.");
            return this.Document == textPosition.Document;
        };
        TextPosition.prototype.IsAtSamePosition = function (textPosition) {
            return this.currentParagraph == textPosition.currentParagraph
                && this.offset == textPosition.offset;
        };
        TextPosition.prototype.IsExistBefore = function (textPosition) {
            if (textPosition == null)
                throw new Error("textPosition is null.");
            if (!this.IsInSameDocument(textPosition))
                throw new Error("textPosition is not in the same document.");
            if (this.currentParagraph == textPosition.currentParagraph)
                return this.offset < textPosition.offset;
            if (this.currentParagraph.Owner == textPosition.currentParagraph.Owner) {
                if (this.currentParagraph.IsInsideTable)
                    return this.currentParagraph.AssociatedCell.Blocks.IndexOf(this.currentParagraph) < textPosition.currentParagraph.AssociatedCell.Blocks.IndexOf(textPosition.currentParagraph);
                else if (this.currentParagraph.Owner instanceof HeaderFooter)
                    return this.currentParagraph.Owner.Blocks.indexOf(this.currentParagraph) < textPosition.currentParagraph.Owner.Blocks.indexOf(textPosition.currentParagraph);
                else
                    return this.currentParagraph.Section.Blocks.indexOf(this.currentParagraph) < textPosition.currentParagraph.Section.Blocks.indexOf(textPosition.currentParagraph);
            }
            return this.currentParagraph.IsExistBefore(textPosition.currentParagraph);
        };
        TextPosition.prototype.IsExistAfter = function (textPosition) {
            if (textPosition == null)
                throw new Error("textPosition is null.");
            if (!this.IsInSameDocument(textPosition))
                throw new Error("textPosition is not in the same document.");
            if (this.currentParagraph == textPosition.currentParagraph)
                return this.offset > textPosition.offset;
            if (this.currentParagraph.Owner == textPosition.currentParagraph.Owner) {
                if (this.currentParagraph.IsInsideTable)
                    return this.currentParagraph.AssociatedCell.Blocks.IndexOf(this.currentParagraph) > textPosition.currentParagraph.AssociatedCell.Blocks.IndexOf(textPosition.currentParagraph);
                else if (this.currentParagraph.Owner instanceof HeaderFooter)
                    return this.currentParagraph.Owner.Blocks.IndexOf(this.currentParagraph) > textPosition.currentParagraph.Owner.Blocks.IndexOf(textPosition.currentParagraph);
                else
                    return this.currentParagraph.Section.Blocks.IndexOf(this.currentParagraph) > textPosition.currentParagraph.Section.Blocks.IndexOf(textPosition.currentParagraph);
            }
            return this.currentParagraph.IsExistAfter(textPosition.currentParagraph);
        };
        TextPosition.prototype.Clone = function () {
            var textPosition = new TextPosition(this.OwnerControl);
            textPosition.currentParagraph = this.currentParagraph;
            textPosition.offset = this.offset;
            textPosition.location = this.location;
            return textPosition;
        };
        TextPosition.prototype.GetHierarchicalIndexInternal = function () {
            return this.Paragraph.GetHierarchicalIndex(this.Offset.toString());
        };
        TextPosition.prototype.Dispose = function () {
            this.currentParagraph = null;
            this.location = null;
        };
        TextPosition.IsForwardSelection = function (start, end) {
            if (start == end)
                return true;
            start = start.replace(/C;/g, "");
            end = end.replace(/C;/g, "");
            var selectionStart = start.split(";");
            var selectionEnd = end.split(";");
            var length = selectionStart.length;
            if (length > selectionEnd.length)
                length = selectionEnd.length - 1;
            for (var i = 0; i < length; i++) {
                var startOffset = parseFloat(selectionStart[i]);
                var endOffset = parseFloat(selectionEnd[i]);
                if (startOffset != endOffset)
                    return startOffset < endOffset;
            }
            return false;
        };
        return TextPosition;
    }());
    DocumentEditorFeatures.TextPosition = TextPosition;
    var SelectionRange = (function () {
        function SelectionRange(owner) {
            this.SelectedWidgets = null;
            this.ownerControl = owner;
            this.SelectedWidgets = new Dictionary();
        }
        Object.defineProperty(SelectionRange.prototype, "Start", {
            get: function () {
                if (this.start == null && this.ownerControl != null && this.ownerControl.Document != null)
                    this.start = this.ownerControl.Document.DocumentStart;
                return this.start;
            },
            set: function (value) {
                this.start = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionRange.prototype, "End", {
            get: function () {
                if (this.end == null && this.Start != null)
                    this.end = this.Start.Clone();
                return this.end;
            },
            set: function (value) {
                this.end = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionRange.prototype, "IsEmpty", {
            get: function () {
                if (this.Start == null)
                    return true;
                return this.Start.IsAtSamePosition(this.End);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionRange.prototype, "IsForward", {
            get: function () {
                return this.Start.IsExistBefore(this.End);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionRange.prototype, "OwnerControl", {
            get: function () {
                return this.ownerControl;
            },
            enumerable: true,
            configurable: true
        });
        SelectionRange.prototype.ClearSelectionHighlight = function () {
            var widgets = this.SelectedWidgets.Keys;
            for (var i = 0; i < widgets.Count; i++) {
                this.RemoveSelectionHighlight(widgets[i]);
            }
            this.SelectedWidgets.Clear();
        };
        SelectionRange.prototype.ClearSelectionHighlightInternal = function (widget) {
            this.RemoveSelectionHighlight(widget);
            this.SelectedWidgets.Remove(widget);
        };
        SelectionRange.prototype.RemoveSelectionHighlight = function (widget) {
            var left = 0, top = 0, width = 0, height = 0;
            var page = null;
            if (widget instanceof LineWidget) {
                var lineWidget = widget;
                page = lineWidget.CurrentParagraphWidget.GetPage();
                if (page == null)
                    return;
                var widgetInfo = this.SelectedWidgets.Get(widget);
                width = widgetInfo.Width;
                left = widgetInfo.Left;
                top = lineWidget.GetTop();
                height = lineWidget.Height;
            }
            if (widget instanceof TableCellWidget) {
                var tableCellWidget = widget;
                page = tableCellWidget.GetPage();
                if (page == null)
                    return;
                var widgetInfo = this.SelectedWidgets.Get(widget);
                width = widgetInfo.Width;
                left = widgetInfo.Left;
                top = widget.Y;
                height = widget.Height;
            }
            if (page == null)
                return;
            var selectionContainer = document.getElementById(page.Id + "_selection");
            if (selectionContainer == null)
                return;
            var context = selectionContainer.getContext("2d");
            context.clearRect(left, top, width, height);
        };
        SelectionRange.prototype.AddSelectionHighlight = function (CanvasContext, widget, top) {
            if (this.SelectedWidgets.ContainsKey(widget)) {
                var height = widget.Height;
                var widgetInfo = this.SelectedWidgets.Get(widget);
                var width = widgetInfo.Width;
                var left = widgetInfo.Left;
                CanvasContext.fillStyle = "gray";
                CanvasContext.globalAlpha = 0.4;
                CanvasContext.fillRect(left, top, width, height);
            }
        };
        SelectionRange.prototype.AddSelectionHighlightTable = function (CanvasContext, TableCellWidget) {
            if (this.SelectedWidgets.ContainsKey(TableCellWidget)) {
                var selectionWidget = this.SelectedWidgets.Get(TableCellWidget);
                var left = selectionWidget.Left;
                var top_6 = TableCellWidget.Y;
                var width = selectionWidget.Width;
                var height = TableCellWidget.Height;
                CanvasContext.fillStyle = "gray";
                CanvasContext.globalAlpha = 0.4;
                CanvasContext.fillRect(left, top_6, width, height);
            }
        };
        SelectionRange.prototype.GetSelectedContentAsHTML = function () {
            if (this.IsForward)
                return this.Start.Paragraph.GetSelectedContent(this.OwnerControl.Selection, this.Start, this.End);
            else
                return this.End.Paragraph.GetSelectedContent(this.OwnerControl.Selection, this.End, this.Start);
        };
        SelectionRange.prototype.Dispose = function () {
            if (this.start != null) {
                this.start.Dispose();
                this.start = null;
            }
            if (this.end != null) {
                this.end.Dispose();
                this.end = null;
            }
            this.ClearSelectionHighlight();
            this.ownerControl = null;
        };
        return SelectionRange;
    }());
    DocumentEditorFeatures.SelectionRange = SelectionRange;
    var SelectionRangeCollection = (function () {
        function SelectionRangeCollection(documentEditorHelper) {
            this.ranges = new List();
            this.ownerControl = documentEditorHelper;
        }
        Object.defineProperty(SelectionRangeCollection.prototype, "Count", {
            get: function () {
                if (this.ranges != null)
                    return this.ranges.length;
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionRangeCollection.prototype, "OwnerControl", {
            get: function () {
                return this.ownerControl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionRangeCollection.prototype, "First", {
            get: function () {
                if (this.ranges != null && this.ranges.Count > 0)
                    return this.ranges[0];
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionRangeCollection.prototype, "Last", {
            get: function () {
                if (this.ranges != null && this.ranges.Count > 0)
                    return this.ranges[this.ranges.length - 1];
                return null;
            },
            enumerable: true,
            configurable: true
        });
        SelectionRangeCollection.prototype.Get = function (index) {
            if (index > -1 && index < this.ranges.length)
                return this.ranges[index];
            return null;
        };
        SelectionRangeCollection.prototype.Clear = function () {
            if (this.ranges != null && this.ranges.Count > 0) {
                this.ownerControl.Viewer.ClearSelectionHighlight();
                this.ranges.Clear();
            }
        };
        SelectionRangeCollection.prototype.Contains = function (selectionRange) {
            if (selectionRange == null)
                throw new ReferenceError("SelectionRange cannot be null.");
            if (this.ranges == null)
                return false;
            return this.ranges.Contains(selectionRange);
        };
        SelectionRangeCollection.prototype.Remove = function (selectionRange) {
            if (selectionRange == null)
                throw new ReferenceError("SelectionRange cannot be null.");
            if (this.ranges != null && this.ranges.Contains(selectionRange)) {
                selectionRange.ClearSelectionHighlight();
                this.ranges.Remove(selectionRange);
                return true;
            }
            return false;
        };
        SelectionRangeCollection.prototype.AddSelection = function (startPosition, endPosition) {
            if (this.ranges == null)
                this.ranges = new List();
            var selectionRange = new SelectionRange(this.ownerControl);
            selectionRange.Start.SetPositionInternal(startPosition);
            selectionRange.End.SetPositionInternal(endPosition);
            if (!selectionRange.IsEmpty) {
                if (selectionRange.IsForward)
                    selectionRange.End.UpdateTextPositionOnFieldCharacter(selectionRange.Start);
                else
                    selectionRange.Start.UpdateTextPositionOnFieldCharacter(selectionRange.End);
                this.CheckSelectionRangesIsExist(selectionRange.Start, selectionRange.End);
            }
            this.ranges.Add(selectionRange);
        };
        SelectionRangeCollection.prototype.CheckSelectionRangesIsExist = function (startPosition, endPosition) {
            var newRangeStart = startPosition;
            var newRangeEnd = endPosition;
            if (newRangeStart.IsAtSamePosition(newRangeEnd))
                return;
            if (!startPosition.IsExistBefore(endPosition)) {
                newRangeStart = endPosition;
                newRangeEnd = startPosition;
            }
            for (var i = 0; i < this.ranges.Count - 1; i++) {
                var selectionRange = this.ranges[i];
                var existingRangeStart = selectionRange.Start;
                var existingRangeEnd = selectionRange.End;
                if (!selectionRange.Start.IsExistBefore(selectionRange.End)) {
                    existingRangeStart = selectionRange.End;
                    existingRangeEnd = selectionRange.Start;
                }
                if (newRangeStart.IsAtSamePosition(existingRangeStart) || newRangeEnd.IsAtSamePosition(existingRangeEnd)
                    || (newRangeStart.IsExistBefore(existingRangeStart) && newRangeEnd.IsExistAfter(existingRangeStart))
                    || (newRangeStart.IsExistBefore(existingRangeEnd) && newRangeEnd.IsExistAfter(existingRangeEnd))
                    || (newRangeStart.IsExistAfter(existingRangeStart) && newRangeEnd.IsExistBefore(existingRangeEnd))) {
                    this.Remove(selectionRange);
                    i--;
                }
            }
        };
        SelectionRangeCollection.prototype.UpdateSelectionRange = function () {
            var range = this.Last;
            var newRangeStart = range.Start;
            var newRangeEnd = range.End;
            if (!range.Start.IsExistBefore(range.End)) {
                newRangeStart = range.End;
                newRangeEnd = range.Start;
            }
            var newRangeIsNotEmpty = !newRangeStart.IsAtSamePosition(newRangeEnd);
            for (var i = 0; i < this.ranges.Count - 1; i++) {
                var selectionRange = this.ranges[i];
                var existingRangeStart = selectionRange.Start;
                var existingRangeEnd = selectionRange.End;
                if (existingRangeStart.IsAtSamePosition(existingRangeEnd)) {
                    this.ranges.RemoveAt(i);
                    i--;
                }
                else if (newRangeIsNotEmpty) {
                    if (!selectionRange.Start.IsExistBefore(selectionRange.End)) {
                        existingRangeStart = selectionRange.End;
                        existingRangeEnd = selectionRange.Start;
                    }
                    if (newRangeStart.IsAtSamePosition(existingRangeStart) || newRangeEnd.IsAtSamePosition(existingRangeEnd)
                        || (newRangeStart.IsExistBefore(existingRangeStart) && newRangeEnd.IsExistAfter(existingRangeStart))
                        || (newRangeStart.IsExistBefore(existingRangeEnd) && newRangeEnd.IsExistAfter(existingRangeEnd))
                        || (newRangeStart.IsExistAfter(existingRangeStart) && newRangeEnd.IsExistBefore(existingRangeEnd))) {
                        this.Remove(selectionRange);
                        i--;
                    }
                }
            }
            if (!newRangeIsNotEmpty)
                this.ranges.RemoveAt(this.ranges.Count - 1);
        };
        SelectionRangeCollection.prototype.ClearSelection = function () {
            if (this.ranges != null && this.ranges.Count > 0) {
                this.ownerControl.Viewer.ClearSelectionHighlight();
                for (var i = 0; i < this.ranges.Count - 1; i++) {
                    this.ranges[i].Dispose();
                    this.ranges.RemoveAt(i);
                    i--;
                }
            }
        };
        SelectionRangeCollection.prototype.ClearMultiSelection = function () {
            if (this.ranges != null && this.ranges.length > 1) {
                this.ownerControl.Viewer.ClearSelectionHighlight();
                for (var i = 0; i < this.ranges.Count - 1; i++) {
                    this.ranges[i].Dispose();
                    this.ranges.RemoveAt(i);
                    i--;
                }
            }
        };
        SelectionRangeCollection.prototype.Dispose = function () {
            if (this.ranges != null && this.ranges.Count > 0) {
                for (var i = 0; i < this.ranges.Count - 1; i++) {
                    this.ranges[i].Dispose();
                    i--;
                }
                this.ranges.Clear();
                this.ranges = null;
            }
            this.ownerControl = null;
        };
        SelectionRangeCollection.prototype.RemoveSelectionHighlight = function (widget) {
            if (this.ranges == null)
                return;
            for (var i = 0; i < this.ranges.Count; i++) {
                if (this.ranges[i].SelectedWidgets.ContainsKey(widget))
                    this.ranges[i].RemoveSelectionHighlight(widget);
            }
        };
        SelectionRangeCollection.prototype.ClearSelectionHighlightInternal = function (widget) {
            if (this.ranges == null)
                return;
            for (var i = 0; i < this.ranges.Count; i++) {
                if (this.ranges[i].SelectedWidgets.ContainsKey(widget))
                    this.ranges[i].ClearSelectionHighlightInternal(widget);
            }
        };
        SelectionRangeCollection.prototype.ClearSelectionHighlight = function () {
            if (this.ranges == null)
                return;
            for (var i = 0; i < this.ranges.Count; i++)
                this.ranges[i].ClearSelectionHighlight();
        };
        SelectionRangeCollection.prototype.AddSelectionHighlight = function (Context, widget, top) {
            if (this.ranges == null)
                return;
            for (var i = 0; i < this.ranges.Count; i++) {
                this.ranges[i].AddSelectionHighlight(Context, widget, top);
            }
        };
        SelectionRangeCollection.prototype.AddSelectionHighlightTable = function (Context, TableCellAdv) {
            if (this.ranges == null)
                return;
            for (var i = 0; i < this.ranges.Count; i++) {
                this.ranges[i].AddSelectionHighlightTable(Context, TableCellAdv);
            }
        };
        return SelectionRangeCollection;
    }());
    DocumentEditorFeatures.SelectionRangeCollection = SelectionRangeCollection;
    var SelectionAdv = (function () {
        function SelectionAdv(documentEditorHelper) {
            this.ownerControl = null;
            this.UpDownSelectionLength = 0;
            this.ownerControl = documentEditorHelper;
            this.selectionRanges = new SelectionRangeCollection(documentEditorHelper);
        }
        Object.defineProperty(SelectionAdv.prototype, "SelectionRanges", {
            get: function () {
                return this.selectionRanges;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionAdv.prototype, "OwnerControl", {
            get: function () {
                return this.ownerControl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionAdv.prototype, "Text", {
            get: function () {
                return this.GetText(false);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionAdv.prototype, "Start", {
            get: function () {
                if (this.OwnerControl != null && this.OwnerControl.Document != null) {
                    if (this.SelectionRanges == null)
                        this.SelectionRanges = new SelectionRangeCollection(this.OwnerControl);
                    if (this.OwnerControl.Selection.SelectionRanges.Count == 0) {
                        var start = this.ownerControl.Document.DocumentStart;
                        this.OwnerControl.Selection.SelectionRanges.AddSelection(start, start);
                    }
                    if (this.OwnerControl.Selection.SelectionRanges.Count > 0)
                        return this.OwnerControl.Selection.SelectionRanges.Get(this.OwnerControl.Selection.SelectionRanges.Count - 1).Start;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionAdv.prototype, "End", {
            get: function () {
                if (this.OwnerControl.Selection.SelectionRanges != null && this.OwnerControl.Selection.SelectionRanges.Count > 0)
                    return this.OwnerControl.Selection.SelectionRanges.Get(this.OwnerControl.Selection.SelectionRanges.Count - 1).End;
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionAdv.prototype, "IsEmpty", {
            get: function () {
                if (this.Start == null)
                    return true;
                return this.Start.IsAtSamePosition(this.End);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionAdv.prototype, "IsForward", {
            get: function () {
                return this.Start.IsExistBefore(this.End);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionAdv.prototype, "CurrentSelectionRange", {
            get: function () {
                if (this.OwnerControl.IsDocumentLoaded && this.OwnerControl.Selection.SelectionRanges != null && this.OwnerControl.Selection.SelectionRanges.Count > 0)
                    return this.OwnerControl.Selection.SelectionRanges.Get(this.OwnerControl.Selection.SelectionRanges.Count - 1);
                return null;
            },
            enumerable: true,
            configurable: true
        });
        SelectionAdv.prototype.ExtendBackward = function (clearMultiSelection) {
            if (this.Start == null)
                return;
            if (clearMultiSelection)
                this.SelectionRanges.ClearMultiSelection();
            this.End.MoveBackward();
            this.UpDownSelectionLength = this.End.Location.X;
            this.FireSelectionChanged(true);
        };
        SelectionAdv.prototype.ExtendForward = function (clearMultiSelection) {
            if (this.Start == null)
                return;
            if (clearMultiSelection)
                this.SelectionRanges.ClearMultiSelection();
            this.End.MoveForward();
            this.UpDownSelectionLength = this.End.Location.X;
            this.FireSelectionChanged(true);
        };
        SelectionAdv.prototype.SelectCurrentWord = function (clearMultiSelection) {
            var startPosition = this.Start.Clone();
            var endPosition = this.End.Clone();
            this.SelectCurrentWordRange(startPosition, endPosition, false);
            this.SelectRange(startPosition, endPosition, clearMultiSelection);
        };
        SelectionAdv.prototype.SelectCurrentWordRange = function (startPosition, endPosition, excludeSpace) {
            if (startPosition != null) {
                if (startPosition.Offset > 0) {
                    var wordStart = startPosition.Clone();
                    var indexInInline = 0;
                    var inlineObj = startPosition.Paragraph.GetInline(startPosition.Offset, indexInInline);
                    var inline = inlineObj.inline;
                    indexInInline = inlineObj.index;
                    if (inline != null && inline instanceof FieldEndAdv) {
                        if (startPosition.Offset > 2 && (inline.FieldSeparator != null || inline.FieldBegin == null)) {
                            wordStart.SetPositionParagraph(wordStart.Paragraph, startPosition.Offset - 2);
                            wordStart.MoveToWordEnd(0, false);
                            if (!(wordStart.Paragraph == startPosition.Paragraph && wordStart.Offset == startPosition.Offset - 1))
                                startPosition.MoveToWordStart(2);
                        }
                        else if (startPosition.Offset > 3 && inline.FieldSeparator == null) {
                            wordStart.SetPositionParagraph(wordStart.Paragraph, startPosition.Offset - 3);
                            wordStart.MoveToWordEnd(0, false);
                            if (!(wordStart.Paragraph == startPosition.Paragraph && wordStart.Offset == startPosition.Offset))
                                startPosition.MoveToWordStart(2);
                        }
                    }
                    else {
                        wordStart.SetPositionParagraph(wordStart.Paragraph, startPosition.Offset - 1);
                        wordStart.MoveToWordEnd(0, false);
                        if (!(wordStart.Paragraph == startPosition.Paragraph && wordStart.Offset == startPosition.Offset))
                            startPosition.MoveToWordStart(2);
                    }
                }
                endPosition.MoveToWordEnd(2, excludeSpace);
            }
        };
        SelectionAdv.prototype.SelectCurrentParagraph = function (clearMultiSelection) {
            if (this.Start != null) {
                if (clearMultiSelection)
                    this.SelectionRanges.ClearMultiSelection();
                this.Start.MoveToParagraphStart(false);
                this.End.MoveToParagraphEnd(false);
                this.UpDownSelectionLength = this.End.Location.X;
                this.FireSelectionChanged(true);
            }
        };
        SelectionAdv.prototype.Select = function (paragraph, inline, index, physicalLocation, clearMultiSelection) {
            if (clearMultiSelection)
                this.SelectionRanges.ClearMultiSelection();
            this.Start.SetPositionForSelection(paragraph, inline, index, physicalLocation);
            this.End.SetPositionInternal(this.Start);
            this.UpDownSelectionLength = physicalLocation.X;
            this.FireSelectionChanged(true);
        };
        SelectionAdv.prototype.SelectRange = function (startPosition, endPosition, clearMultiSelection) {
            if (clearMultiSelection)
                this.SelectionRanges.ClearMultiSelection();
            this.Start.SetPositionInternal(startPosition);
            this.End.SetPositionInternal(endPosition);
            this.UpDownSelectionLength = this.End.Location.X;
            this.FireSelectionChanged(true);
        };
        SelectionAdv.prototype.FireSelectionChanged = function (isSelectionChanged) {
            if (!this.IsEmpty) {
                if (this.IsForward) {
                    this.Start.UpdatePhysicalPositionInternal(true);
                    this.End.UpdatePhysicalPositionInternal(false);
                }
                else {
                    this.Start.UpdatePhysicalPositionInternal(false);
                    this.End.UpdatePhysicalPositionInternal(true);
                }
            }
            this.ownerControl.Viewer.ClearSelectionHighlight();
            this.HighlightSelection(isSelectionChanged);
            if (isSelectionChanged)
                this.OwnerControl.RaiseClientEvent(DocumentEditorEvents.SelectionChange, null);
        };
        SelectionAdv.prototype.HighlightSelection = function (isSelectionChanged) {
            if (this.IsEmpty) {
            }
            else {
                if (this.SelectionRanges.Count > 0) {
                    for (var i = 0; i < this.SelectionRanges.Count; i++) {
                        var selectionRange = this.SelectionRanges.Get(i);
                        if (selectionRange.IsForward)
                            selectionRange.Start.Paragraph.HighlightSelectedContent(this, selectionRange, selectionRange.Start, selectionRange.End);
                        else
                            selectionRange.End.Paragraph.HighlightSelectedContent(this, selectionRange, selectionRange.End, selectionRange.Start);
                    }
                }
                else {
                    if (this.IsForward)
                        this.Start.Paragraph.HighlightSelectedContent(this, this.CurrentSelectionRange, this.Start, this.End);
                    else
                        this.End.Paragraph.HighlightSelectedContent(this, this.CurrentSelectionRange, this.End, this.Start);
                }
            }
            if (isSelectionChanged)
                this.OwnerControl.Viewer.ScrollToPosition(this.Start, this.End);
        };
        SelectionAdv.prototype.CreateHighlightBorder = function (selectionRange, lineWidget, width, left, top) {
            var page = lineWidget.CurrentParagraphWidget.GetPage();
            var height = lineWidget.Height;
            var selectionWidget = new SelectionWidgetInfo(left, width);
            selectionRange.SelectedWidgets.Add(lineWidget, selectionWidget);
            var selectionContainer = document.getElementById(page.Id + "_selection");
            if (selectionContainer != null) {
                var context = selectionContainer.getContext("2d");
                context.fillStyle = "gray";
                context.globalAlpha = 0.4;
                context.fillRect(left, top, width, height);
            }
        };
        SelectionAdv.prototype.CreateHighlightBorderInsideTable = function (cellWidget, selection, selectionRange) {
            var page = cellWidget.GetPage();
            var selectionContainer = document.getElementById(page.Id + "_selection");
            var selectionWidget = null;
            var left = cellWidget.X - cellWidget.Margin.Left + cellWidget.LeftBorderWidth;
            var width = cellWidget.Width + cellWidget.Margin.Left + cellWidget.Margin.Right - cellWidget.LeftBorderWidth - cellWidget.RightBorderWidth;
            var top = cellWidget.Y;
            var height = cellWidget.Height;
            if (selectionRange.SelectedWidgets.ContainsKey(cellWidget)) {
                selectionWidget = selectionRange.SelectedWidgets.Get(cellWidget);
                if (selectionContainer != null) {
                    var context = selectionContainer.getContext("2d");
                    context.clearRect(selectionWidget.Left, top, selectionWidget.Width, height);
                }
            }
            else {
                selectionWidget = new SelectionWidgetInfo(left, width);
                selectionRange.SelectedWidgets.Add(cellWidget, selectionWidget);
            }
            if (selectionContainer != null) {
                var context = selectionContainer.getContext("2d");
                context.fillStyle = "gray";
                context.globalAlpha = 0.4;
                context.fillRect(left, top, width, height);
            }
        };
        SelectionAdv.prototype.MoveTextPosition = function (cursorPoint, clearMultiSelection, textPosition, viewer) {
            if (this.Start == null)
                return;
            if (clearMultiSelection)
                this.selectionRanges.ClearMultiSelection();
            var widget = this.OwnerControl.Viewer.GetLineWidgetInternal(cursorPoint, true);
            if (widget != null)
                widget.UpdateTextPositionWidget(this.OwnerControl, cursorPoint, textPosition, true);
            this.UpDownSelectionLength = textPosition.Location.X;
            var length = textPosition.Paragraph.GetLength();
            if (!this.IsEmpty && !this.IsForward && textPosition.Offset > length) {
                var indexInInline = 0;
                var inlineInfo = textPosition.Paragraph.GetInline(length, indexInInline);
                var inline = inlineInfo.inline;
                indexInInline = inlineInfo.index;
                var paragraph = textPosition.Paragraph;
                var endOffset = 0;
                if (inline != null) {
                    inline = inline.GetPreviousValidInline();
                    indexInInline = inline instanceof FieldCharacterAdv ? 0 : inline.Length;
                    if (inline instanceof FieldEndAdv)
                        indexInInline++;
                    endOffset = inline.OwnerParagraph.GetOffset(inline, indexInInline);
                    paragraph = inline.OwnerParagraph;
                }
                textPosition.SetPositionParagraph(paragraph, endOffset);
            }
            var selectionStartIndex = this.Start.GetHierarchicalIndexInternal();
            var selectionEndIndex = this.End.GetHierarchicalIndexInternal();
            if (selectionStartIndex != selectionEndIndex) {
                if (TextPosition.IsForwardSelection(selectionStartIndex, selectionEndIndex))
                    textPosition.ValidateForwardFieldSelection(selectionStartIndex, selectionEndIndex);
                else
                    textPosition.ValidateBackwardFieldSelection(selectionStartIndex, selectionEndIndex);
            }
            this.FireSelectionChanged(true);
        };
        SelectionAdv.prototype.ExtendToWordStart = function (isNavigation, clearMultiSelection) {
            if (this.Start == null)
                return;
            if (clearMultiSelection)
                this.SelectionRanges.ClearMultiSelection();
            if ((this.Start.Paragraph.IsInsideTable || this.End.Paragraph.IsInsideTable)
                && (this.Start.Paragraph.AssociatedCell != this.End.Paragraph.AssociatedCell
                    || this.Start.Paragraph.AssociatedCell.IsCellSelected(this.Start, this.End)))
                this.End.MoveToPreviousParagraphInTable();
            else {
                this.End.MoveToWordStart(isNavigation ? 0 : 1);
            }
            if (isNavigation)
                this.Start.SetPositionInternal(this.End);
            this.UpDownSelectionLength = this.End.Location.X;
            this.FireSelectionChanged(true);
        };
        SelectionAdv.prototype.ExtendToWordEnd = function (isNavigation, clearMultiSelection) {
            if (this.Start == null)
                return;
            if (clearMultiSelection)
                this.SelectionRanges.ClearMultiSelection();
            if ((this.Start.Paragraph.IsInsideTable || this.End.Paragraph.IsInsideTable)
                && (this.Start.Paragraph.AssociatedCell != this.End.Paragraph.AssociatedCell
                    || this.Start.Paragraph.AssociatedCell.IsCellSelected(this.Start, this.End)))
                this.End.MoveToNextParagraphInTable();
            else
                this.End.MoveToWordEnd(isNavigation ? 0 : 1, false);
            if (isNavigation)
                this.Start.SetPositionInternal(this.End);
            this.UpDownSelectionLength = this.End.Location.X;
            this.FireSelectionChanged(true);
        };
        SelectionAdv.prototype.ExtendToLineStart = function (clearMultiSelection) {
            if (this.Start == null)
                return;
            if (clearMultiSelection)
                this.SelectionRanges.ClearMultiSelection();
            this.End.MoveToLineStart(true);
            this.UpDownSelectionLength = this.End.Location.X;
            this.FireSelectionChanged(true);
        };
        SelectionAdv.prototype.ExtendToLineEnd = function (clearMultiSelection) {
            if (this.Start == null)
                return;
            if (clearMultiSelection)
                this.SelectionRanges.ClearMultiSelection();
            this.End.MoveToLineEnd(true);
            this.UpDownSelectionLength = this.End.Location.X;
            this.FireSelectionChanged(true);
        };
        SelectionAdv.prototype.ExtendToParagraphStart = function (clearMultiSelection) {
            if (this.Start == null)
                return;
            if (clearMultiSelection)
                this.SelectionRanges.ClearMultiSelection();
            this.End.MoveToParagraphStart(true);
            this.UpDownSelectionLength = this.End.Location.X;
            this.FireSelectionChanged(true);
        };
        SelectionAdv.prototype.ExtendToParagraphEnd = function (clearMultiSelection) {
            if (this.Start == null)
                return;
            if (clearMultiSelection)
                this.SelectionRanges.ClearMultiSelection();
            this.End.MoveToParagraphEnd(true);
            this.UpDownSelectionLength = this.End.Location.X;
            this.FireSelectionChanged(true);
        };
        SelectionAdv.prototype.ExtendToPreviousLine = function (clearMultiSelection) {
            if (this.Start == null)
                return;
            if (clearMultiSelection)
                this.SelectionRanges.ClearMultiSelection();
            this.End.MoveToPreviousLine(this.UpDownSelectionLength);
            this.FireSelectionChanged(true);
        };
        SelectionAdv.prototype.ExtendToNextLine = function (clearMultiSelection) {
            if (this.Start == null)
                return;
            if (clearMultiSelection)
                this.SelectionRanges.ClearMultiSelection();
            this.End.MoveToNextLine(this.UpDownSelectionLength);
            this.FireSelectionChanged(true);
        };
        SelectionAdv.prototype.MoveToPreviousParagraph = function (clearMultiSelection) {
            if (this.Start == null)
                return;
            if (clearMultiSelection)
                this.SelectionRanges.ClearMultiSelection();
            this.End.MoveToPreviousParagraph();
            this.Start.SetPositionInternal(this.End);
            this.UpDownSelectionLength = this.End.Location.X;
            this.FireSelectionChanged(true);
        };
        SelectionAdv.prototype.MoveToNextParagraph = function (clearMultiSelection) {
            if (this.Start == null)
                return;
            if (clearMultiSelection)
                this.SelectionRanges.ClearMultiSelection();
            this.End.MoveToNextParagraph();
            this.Start.SetPositionInternal(this.End);
            this.UpDownSelectionLength = this.End.Location.X;
            this.FireSelectionChanged(true);
        };
        SelectionAdv.prototype.Copy = function () {
            if (this.IsEmpty)
                return;
            this.CopySelectedContent(false);
        };
        SelectionAdv.prototype.CopySelectedContent = function (isCut) {
            var htmlContent = "";
            for (var i = 0; i < this.SelectionRanges.Count; i++) {
                htmlContent += this.SelectionRanges.Get(i).GetSelectedContentAsHTML();
            }
            this.CopyToClipboard(htmlContent);
        };
        SelectionAdv.prototype.CopyToClipboard = function (htmlContent) {
            var selection = window.getSelection();
            selection.removeAllRanges();
            var div = document.createElement("div");
            div.innerHTML = htmlContent;
            document.body.appendChild(div);
            var range = document.createRange();
            range.selectNodeContents(div);
            selection.addRange(range);
            var copysuccess = false;
            try {
                copysuccess = document.execCommand("copy");
            }
            catch (e) {
            }
            finally {
                selection.removeAllRanges();
                div.parentNode.removeChild(div);
            }
            return copysuccess;
        };
        SelectionAdv.prototype.GetHyperlinkField = function () {
            if (this.End == null)
                return null;
            var index = 0;
            var currentInline = this.End.Paragraph.GetInline(this.End.Offset, index);
            index = currentInline.index;
            var inline = currentInline.inline;
            var CheckedFields = new List();
            var field = null;
            if (inline == null)
                field = this.End.Paragraph.GetHyperlinkFields(this.End.Paragraph, CheckedFields);
            else
                field = inline.OwnerParagraph.GetHyperlinkField(inline, CheckedFields);
            CheckedFields.Clear();
            CheckedFields = null;
            return field;
        };
        SelectionAdv.prototype.GetText = function (includeObject) {
            if (this.Start == null || this.End == null || this.Start.Paragraph == null || this.End.Paragraph == null)
                return null;
            var text = "";
            if (this.IsEmpty)
                return text;
            var startPosition = this.Start;
            var endPosition = this.End;
            if (!this.IsForward) {
                startPosition = this.End;
                endPosition = this.Start;
            }
            var startIndex = 0, endIndex = 0;
            var getstartInline = startPosition.Paragraph.GetInline(startPosition.Offset, startIndex);
            var getendInline = endPosition.Paragraph.GetInline(endPosition.Offset, startIndex);
            var startInline = getstartInline.inline;
            startIndex = getstartInline.index;
            var endInline = getendInline.inline;
            endIndex = getendInline.index;
            if (startInline instanceof ImageAdv && includeObject && startIndex == 0)
                text = Inline.OBJECT_CHARACTER;
            else if (startInline instanceof SpanAdv)
                text = startInline.Text == "" || startInline.Text == null || startInline.Text.length < startIndex ? text : startInline.Text.substring(startIndex);
            if (startPosition.Paragraph == endPosition.Paragraph) {
                if (startInline instanceof Inline) {
                    if (startInline == endInline)
                        text = text.length < endIndex - startIndex ? text : text.substring(0, endIndex - startIndex);
                    else if (startInline.NextNode instanceof Inline)
                        text = text + startInline.NextNode.GetText(endPosition.Paragraph, endInline, endIndex, includeObject);
                }
            }
            else {
                if (startInline instanceof Inline && startInline.NextNode instanceof Inline)
                    text = text + startInline.NextNode.GetText(endPosition.Paragraph, null, 0, includeObject);
                else {
                    var nextParagraph = startPosition.Paragraph.GetNextParagraph();
                    text = text + "\r";
                    while (nextParagraph != null && nextParagraph.IsEmpty()) {
                        text = text + "\r";
                        if (nextParagraph == endPosition.Paragraph)
                            return text;
                        nextParagraph = nextParagraph.GetNextParagraph();
                    }
                    if (nextParagraph != null && !nextParagraph.IsEmpty())
                        text = text + nextParagraph.Inlines[0].GetText(endPosition.Paragraph, endInline, endIndex, includeObject);
                }
            }
            if (endPosition.Offset == endPosition.Paragraph.GetEndOffset() + 1)
                text = text + "\r";
            return text;
        };
        return SelectionAdv;
    }());
    DocumentEditorFeatures.SelectionAdv = SelectionAdv;
    var SelectionWidgetInfo = (function () {
        function SelectionWidgetInfo(left, width) {
            this.left = 0;
            this.width = 0;
            this.left = left;
            this.width = width;
        }
        Object.defineProperty(SelectionWidgetInfo.prototype, "Left", {
            get: function () {
                return this.left;
            },
            set: function (value) {
                this.left = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionWidgetInfo.prototype, "Width", {
            get: function () {
                return this.width;
            },
            set: function (value) {
                this.width = value;
            },
            enumerable: true,
            configurable: true
        });
        return SelectionWidgetInfo;
    }());
    DocumentEditorFeatures.SelectionWidgetInfo = SelectionWidgetInfo;
    var LayoutViewer = (function () {
        function LayoutViewer(owner) {
            this.CurrentPage = null;
            this.tableLeft = [];
            this.Pages = new List();
            this.selectionStartPage = null;
            this.selectionEndPage = null;
            this.zoomFactor = 1;
            this.touchStart = null;
            this.touchEnd = null;
            this.IsTouchInput = false;
            this.IsFieldCode = false;
            this.CurrentHeaderFooter = null;
            this.SplittedCellWidgets = null;
            this.isMousedown = false;
            this.isSelectionChangedOnMouseMoved = false;
            this.HorizontalScrollBar = null;
            this.VerticalScrollBar = null;
            this.preZoomFactor = 0;
            this.preDifference = -1;
            this.PointerCount = 0;
            this.Pointers = [];
            this.ScrollStartX = -1;
            this.ScrollStartY = -1;
            this.LineElements = new ElementCollection();
            this.FieldStack = new List();
            if (owner != null) {
                this.Pages = new List();
                this.SplittedCellWidgets = new List();
                this.OwnerControl = owner;
                var viewer_1 = this;
                if (this.OwnerControl.DocumentEditorElement == null)
                    return;
                this.ViewerContatiner = document.createElement("div");
                this.ViewerContatiner.style.touchAction = "pan-x pan-y";
                this.OwnerControl.DocumentEditorElement.appendChild(this.ViewerContatiner);
                this.Container = document.createElement("div");
                this.Container.setAttribute("id", this.OwnerControl.ContainerId + "_viewerContainer");
                this.Container.style.overflow = "hidden";
                this.Container.style.cssFloat = "left";
                this.Container.style.position = "relative";
                this.Container.style.pointerEvents = "none";
                this.Container.style.backgroundColor = "#EEEEEE";
                this.ViewerContatiner.appendChild(this.Container);
                this.ViewerContatiner.tabIndex = 0;
                this.ViewerContatiner.style.outline = "none";
                var verticalScrollBar = this.OwnerControl.ej.buildTag("div", "", { "display": "none", "float": "right" }, { "id": this.OwnerControl.ContainerId + "_verticalScrollBar" });
                verticalScrollBar.ejScrollBar({
                    orientation: "vertical",
                    minimum: 0,
                    width: 18,
                    height: 0,
                    infiniteScrolling: false,
                    scroll: $.proxy(this.VerticalScrollBar_ValueChanged, this)
                });
                this.VerticalScrollBar = verticalScrollBar.data("ejScrollBar");
                this.ViewerContatiner.appendChild(verticalScrollBar[0]);
                var horizontalScrollBar = this.OwnerControl.ej.buildTag("div", "", { "display": "none" }, { "id": this.OwnerControl.ContainerId + "_horizontalScrollBar" });
                horizontalScrollBar.ejScrollBar({
                    orientation: "horizontal",
                    minimum: 0,
                    width: 0,
                    height: 18,
                    infiniteScrolling: false,
                    scroll: $.proxy(this.HorizontalScrollBar_ValueChanged, this)
                });
                this.HorizontalScrollBar = horizontalScrollBar.data("ejScrollBar");
                this.ViewerContatiner.appendChild(horizontalScrollBar[0]);
                this.UpdateViewerSize();
                this.InitContextMenu();
                var resizeTimer_1 = 0;
                this.windowResizeHandler = function (event) {
                    if (resizeTimer_1) {
                        clearTimeout(resizeTimer_1);
                    }
                    resizeTimer_1 = setTimeout(function () {
                        viewer_1.UpdateViewerSizeOnWindowResize();
                    }, 100);
                };
                this.windowMouseDownHandler = function (e) {
                    viewer_1.HideContextMenu();
                };
                this.windowKeyUpHandler = function (e) {
                    if (e.keyCode == 27)
                        viewer_1.HideContextMenu();
                };
                window.addEventListener("resize", this.windowResizeHandler);
                this.ViewerContatiner.addEventListener("mousedown", function (event) {
                    viewer_1.OnMouseDownInternal(event);
                });
                this.ViewerContatiner.addEventListener("mousemove", function (event) {
                    viewer_1.OnMouseMoveInternal(event);
                });
                this.ViewerContatiner.addEventListener("mouseup", function (event) {
                    viewer_1.OnMouseUpInternal(event);
                });
                this.ViewerContatiner.addEventListener("mousewheel", function (event) {
                    viewer_1.OnMouseWheelInternal(event);
                });
                if (navigator.userAgent.match("Firefox"))
                    this.ViewerContatiner.addEventListener("DOMMouseScroll", function (event) {
                        viewer_1.OnMouseWheelInternal(event);
                    });
                this.ViewerContatiner.addEventListener("contextmenu", function (e) {
                    viewer_1.OnContextMenuInternal(e);
                });
                this.ViewerContatiner.addEventListener("keydown", function (event) {
                    viewer_1.OnkeyDownInternal(event);
                });
                window.addEventListener("mousedown", this.windowMouseDownHandler);
                window.addEventListener("keyup", this.windowKeyUpHandler);
                viewer_1.InitTouchEvents();
            }
        }
        Object.defineProperty(LayoutViewer.prototype, "VisibleBounds", {
            get: function () {
                return this.visibleBounds;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LayoutViewer.prototype, "CurrentRenderingPage", {
            get: function () {
                if (this.Pages.length == 0)
                    return null;
                return this.Pages[this.Pages.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LayoutViewer.prototype, "SelectionStartPage", {
            get: function () {
                return this.selectionStartPage;
            },
            set: function (value) {
                this.selectionStartPage = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LayoutViewer.prototype, "SelectionEndPage", {
            get: function () {
                return this.selectionEndPage;
            },
            set: function (value) {
                this.selectionEndPage = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LayoutViewer.prototype, "ZoomFactor", {
            get: function () {
                return this.zoomFactor;
            },
            set: function (value) {
                this.zoomFactor = value;
                this.OnZoomFactorChanged();
            },
            enumerable: true,
            configurable: true
        });
        LayoutViewer.prototype.InitContextMenu = function () {
            HelperMethods.AddCssStyle("." + DocumentEditorThemeHelper.ContextMenuItem + ":hover{ background-color: #86CBEA }");
            HelperMethods.AddCssStyle("." + DocumentEditorThemeHelper.ContextMenuItem + "{display:block}");
            HelperMethods.AddCssStyle("." + DocumentEditorThemeHelper.DisabledContextMenuItem + "{opacity:0.5;}");
            HelperMethods.AddCssStyle("." + DocumentEditorThemeHelper.HiddenContextMenuItem + "{display:none;}");
            this.ContextMenu = document.createElement("nav");
            this.ContextMenu.id = this.OwnerControl.ContainerId + "_" + DocumentEditorThemeHelper.ContextMenu;
            this.ContextMenu.style.zIndex = "10";
            this.ContextMenu.style.display = "none";
            this.ContextMenu.style.position = "absolute";
            this.ContextMenu.style.width = "260px";
            this.ContextMenu.style.background = "#FFFFFF";
            this.ContextMenu.style.border = "1px solid #D3D3D3";
            this.ContextMenu.style.padding = "4px 0px";
            this.ViewerContatiner.appendChild(this.ContextMenu);
            var ul = document.createElement("ul");
            ul.id = this.OwnerControl.ContainerId + "_" + DocumentEditorThemeHelper.ContextMenuUlList;
            ul.style.listStyle = "none";
            ul.style.margin = "0px";
            ul.style.padding = "0px";
            this.ContextMenu.appendChild(ul);
            var li = document.createElement("li");
            li.style.display = "block";
            ul.appendChild(li);
            var a = document.createElement("a");
            a.className = DocumentEditorThemeHelper.ContextMenuItem;
            a.id = DocumentEditorThemeHelper.ContextMenuCopy;
            this.SetStyleToContextMenuItem(a);
            li.appendChild(a);
            var span = document.createElement("span");
            span.innerText = "Copy";
            a.appendChild(span);
            var li1 = document.createElement("li");
            li1.style.display = "block";
            ul.appendChild(li1);
            var a1 = document.createElement("a");
            a1.className = DocumentEditorThemeHelper.ContextMenuItem;
            a1.id = DocumentEditorThemeHelper.ContextMenuOpenHyperlink;
            this.SetStyleToContextMenuItem(a1);
            li1.appendChild(a1);
            var span1 = document.createElement("span");
            span1.innerText = "Open link";
            a1.appendChild(span1);
            var li2 = document.createElement("li");
            li2.style.display = "block";
            ul.appendChild(li2);
            var a2 = document.createElement("a");
            a2.className = DocumentEditorThemeHelper.ContextMenuItem;
            a2.id = DocumentEditorThemeHelper.ContextMenuCopyHyperlink;
            this.SetStyleToContextMenuItem(a2);
            li2.appendChild(a2);
            var span2 = document.createElement("span");
            span2.innerText = "Copy link address";
            a2.appendChild(span2);
        };
        LayoutViewer.prototype.SetStyleToContextMenuItem = function (element) {
            element.style.color = "#333333";
            element.style.textDecoration = "none";
            element.style.fontSize = "12px";
            element.style.fontFamily = "Segoe UI";
            element.style.cursor = "default";
            element.style.position = "relative";
            element.style.lineHeight = "27px";
            element.style.padding = "4px 20px";
        };
        LayoutViewer.prototype.OnContextMenuInternal = function (e) {
            e.preventDefault();
            if (e.target != this.ViewerContatiner)
                return;
            if (this.OwnerControl.ej.browserInfo().name != "webkit") {
                this.AddContextMenuItems();
                this.ShowContextMenu();
                this.PositionContextMenu(e);
            }
        };
        LayoutViewer.prototype.AddContextMenuItems = function () {
            var copy = document.getElementById(DocumentEditorThemeHelper.ContextMenuCopy);
            var OpenHyperlink = document.getElementById(DocumentEditorThemeHelper.ContextMenuOpenHyperlink);
            var CopyHyperlink = document.getElementById(DocumentEditorThemeHelper.ContextMenuCopyHyperlink);
            if (this.OwnerControl.Selection.IsEmpty) {
                copy.className = DocumentEditorThemeHelper.DisabledContextMenuItem;
            }
            else {
                copy.className = DocumentEditorThemeHelper.ContextMenuItem;
            }
            var field = this.OwnerControl.Selection.GetHyperlinkField();
            if (field == null) {
                OpenHyperlink.className = DocumentEditorThemeHelper.HiddenContextMenuItem;
                CopyHyperlink.className = DocumentEditorThemeHelper.HiddenContextMenuItem;
            }
            else {
                OpenHyperlink.className = DocumentEditorThemeHelper.ContextMenuItem;
                CopyHyperlink.className = DocumentEditorThemeHelper.ContextMenuItem;
            }
        };
        LayoutViewer.prototype.ShowContextMenu = function () {
            if (this.ContextMenu.style.display == "none") {
                this.ContextMenu.style.display = "block";
            }
        };
        LayoutViewer.prototype.HideContextMenu = function () {
            if (this.ContextMenu.style.display != "none") {
                this.ContextMenu.style.display = "none";
            }
        };
        LayoutViewer.prototype.PositionContextMenu = function (e) {
            var clickPoint = this.GetContextMenuPosition(e);
            var clickCoordsX = clickPoint.X;
            var clickCoordsY = clickPoint.Y;
            var menuWidth = this.ContextMenu.offsetWidth + 4;
            var menuHeight = this.ContextMenu.offsetHeight + 4;
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            if ((windowWidth - clickCoordsX) < menuWidth) {
                this.ContextMenu.style.left = windowWidth - menuWidth + "px";
            }
            else {
                this.ContextMenu.style.left = clickCoordsX + "px";
            }
            if ((windowHeight - clickCoordsY) < menuHeight) {
                this.ContextMenu.style.top = windowHeight - menuHeight + "px";
            }
            else {
                this.ContextMenu.style.top = clickCoordsY + "px";
            }
        };
        LayoutViewer.prototype.GetContextMenuPosition = function (e) {
            var posx = 0;
            var posy = 0;
            if (!e)
                e = window.event;
            if (e.pageX || e.pageY) {
                posx = e.pageX;
                posy = e.pageY;
            }
            else if (e.clientX || e.clientY) {
                posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            return new Point(posx, posy);
        };
        LayoutViewer.prototype.GetContextMenuItem = function (e, contextMenuItemClassName) {
            var el = e.srcElement || e.target;
            if (el.classList.contains(contextMenuItemClassName)) {
                return el;
            }
            else {
                while ((el = el.parentNode) != null) {
                    if (el.classList && el.classList.contains(contextMenuItemClassName)) {
                        return el;
                    }
                }
            }
            return null;
        };
        LayoutViewer.prototype.HandleContextMenuItem = function (item) {
            switch (item) {
                case DocumentEditorThemeHelper.ContextMenuCopy:
                    this.OwnerControl.Selection.Copy();
                    break;
                case DocumentEditorThemeHelper.ContextMenuOpenHyperlink:
                    var hyperLinkFieldToOpen = this.OwnerControl.Selection.GetHyperlinkField();
                    this.OwnerControl.FireRequestNavigate(hyperLinkFieldToOpen);
                    break;
                case DocumentEditorThemeHelper.ContextMenuCopyHyperlink:
                    var hyperLinkField = this.OwnerControl.Selection.GetHyperlinkField();
                    var navigationLink = new HyperLink(hyperLinkField);
                    var selction = new SelectionAdv(null);
                    selction.CopyToClipboard(navigationLink.NavigationLink);
                    break;
            }
        };
        LayoutViewer.prototype.UpdateViewerSizeOnWindowResize = function () {
            var viewer = this;
            var element = this.OwnerControl.DocumentEditorElement;
            viewer.UpdateViewerSize();
            viewer.UpdateScrollBars();
        };
        LayoutViewer.prototype.UpdateViewerSize = function () {
            var element = this.OwnerControl.DocumentEditorElement;
            var rect = element.getBoundingClientRect();
            var width = 0, height = 0;
            height = rect.height > 0 ? rect.height : 200;
            width = rect.width > 0 ? rect.width : 200;
            this.ViewerContatiner.style.height = height.toString() + "px";
            this.ViewerContatiner.style.width = width.toString() + "px";
            this.Container.style.height = height.toString() + "px";
            this.Container.style.width = width.toString() + "px";
            this.visibleBounds = new Rect(0, 0, width, height);
        };
        LayoutViewer.prototype.ValidateFocus = function () {
            this.ViewerContatiner.focus();
        };
        LayoutViewer.prototype.InitTouchEvents = function () {
            var viewer = this;
            if (navigator.userAgent.match("MSIE") || navigator.userAgent.match(".NET")) {
                this.ViewerContatiner.addEventListener("pointerdown", function (event) {
                    viewer.OnPointerDownInternal(event);
                });
                this.ViewerContatiner.addEventListener("pointermove", function (event) {
                    viewer.OnPointerMoveInternal(event);
                });
                this.ViewerContatiner.addEventListener("pointerup", function (event) {
                    viewer.OnPointerUpInternal(event);
                });
                this.ViewerContatiner.addEventListener("pointerleave", function (event) {
                    viewer.OnPointerUpInternal(event);
                });
            }
            else if (navigator.userAgent.match("Edge") || navigator.userAgent.match("Chrome") || navigator.userAgent.match("FireFox") || navigator.userAgent.match("Safari")) {
                this.ViewerContatiner.addEventListener("touchstart", function (event) {
                    viewer.OnTouchStartInternal(event);
                });
                this.ViewerContatiner.addEventListener("touchmove", function (event) {
                    viewer.OnTouchMoveInternal(event);
                });
                this.ViewerContatiner.addEventListener("touchend", function (event) {
                    viewer.OnTouchEndInternal(event);
                });
                this.ViewerContatiner.addEventListener("touchcancel", function (event) {
                    viewer.OnTouchEndInternal(event);
                });
            }
        };
        LayoutViewer.prototype.InitTouchEllipse = function () {
            this.touchStart = document.createElement("div");
            this.touchStart.style.backgroundColor = "transparent";
            this.touchStart.style.borderStyle = "solid";
            this.touchStart.style.borderColor = "black";
            this.touchStart.style.borderWidth = "1px";
            this.touchStart.style.borderRadius = "50%";
            this.touchStart.style.width = "12px";
            this.touchStart.style.height = "13px";
            this.touchStart.style.position = "relative";
            this.touchStart.style.display = "none";
            this.Container.appendChild(this.touchStart);
            this.touchEnd = document.createElement("div");
            this.touchEnd.style.backgroundColor = "transparent";
            this.touchEnd.style.borderStyle = "solid";
            this.touchEnd.style.borderColor = "black";
            this.touchEnd.style.borderWidth = "1px";
            this.touchEnd.style.borderRadius = "50%";
            this.touchEnd.style.width = "12px";
            this.touchEnd.style.height = "13px";
            this.touchEnd.style.position = "relative";
            this.touchEnd.style.display = "none";
            this.Container.appendChild(this.touchEnd);
        };
        LayoutViewer.prototype.OnPointerDownInternal = function (event) {
            if (event.pointerType == 'touch') {
                this.PointerCount = this.PointerCount + 1;
                if (this.PointerCount <= 2) {
                    event.preventDefault();
                    this.Pointers.push(event);
                    if (this.PointerCount == 2)
                        this.PointerCount = 0;
                    if (this.ScrollStartX == -1 && this.ScrollStartY == -1) {
                        if (navigator.userAgent.match("MSIE") || navigator.userAgent.match(".NET")) {
                            this.ScrollStartY = event.pageY;
                            this.ScrollStartX = event.pageX;
                        }
                    }
                }
                this.IsTouchInput = false;
            }
        };
        LayoutViewer.prototype.OnPointerMoveInternal = function (event) {
            var PageX;
            var PageX1;
            if (event.pointerType == 'touch') {
                if (this.PointerCount == 1) {
                    PageX = event.pageX - this.ViewerContatiner.offsetLeft;
                    var PageY = event.pageY - this.ViewerContatiner.offsetTop;
                    if (PageX < this.Container.clientWidth && PageY < this.Container.clientHeight)
                        this.ScrollContainer(event);
                }
                if (this.Pointers.length == 2) {
                    PageX = this.Pointers[0].pageX - this.ViewerContatiner.offsetLeft;
                    PageX1 = this.Pointers[1].pageX - this.ViewerContatiner.offsetLeft;
                    if (PageX < this.Container.offsetWidth && PageX1 < this.Container.offsetWidth) {
                        for (var i = 0; i < this.Pointers.length; i++) {
                            if (event.pointerId == this.Pointers[i].pointerId) {
                                this.Pointers[i] = event;
                                break;
                            }
                        }
                        var currentDiff = Math.sqrt(Math.pow((this.Pointers[0].clientX - this.Pointers[1].clientX), 2) + Math.pow((this.Pointers[0].clientY - this.Pointers[1].clientY), 2));
                        if (this.preDifference > -1) {
                            if (currentDiff > this.preDifference) {
                                this.OnPinchOutInternal(event);
                            }
                            else if (currentDiff < this.preDifference) {
                                this.OnPinchInInternal(event);
                            }
                        }
                        var scroltop = this.VerticalScrollBar.value;
                        if (!(scroltop == 0)) {
                            if (currentDiff > this.preDifference) {
                                this.OnPinchOutInternal(event);
                            }
                            else if (currentDiff < this.preDifference) {
                                this.OnPinchInInternal(event);
                            }
                        }
                        this.preDifference = currentDiff;
                    }
                }
            }
        };
        LayoutViewer.prototype.OnPointerUpInternal = function (event) {
            if (event.pointerType == 'touch') {
                this.Pointers = new Array();
                this.PointerCount = 0;
                this.preDifference = -1;
                this.IsTouchInput = false;
                this.ScrollStartX = -1;
                this.ScrollStartY = -1;
            }
        };
        LayoutViewer.prototype.OnTouchStartInternal = function (event) {
            this.IsTouchInput = true;
            var touch = event.touches;
            if (touch.length == 1) {
            }
            if (this.ScrollStartX == -1 && this.ScrollStartY == -1) {
                this.ScrollStartY = touch[0].pageY;
                this.ScrollStartX = touch[0].pageX;
            }
            event.preventDefault();
        };
        LayoutViewer.prototype.OnTouchMoveInternal = function (event) {
            var touch = event.touches;
            if (touch.length == 1) {
                var PageX = touch[0].pageX - this.ViewerContatiner.offsetLeft;
                var PageY = touch[0].pageY - this.ViewerContatiner.offsetTop;
                if (PageX < this.Container.clientWidth && PageY < this.Container.clientHeight)
                    this.ScrollContainer(event);
            }
            if (touch.length > 1) {
                var currentDiff = Math.sqrt(Math.pow((touch[0].clientX - touch[1].clientX), 2) + Math.pow((touch[0].clientY - touch[1].clientY), 2));
                if (this.preDifference > -1) {
                    if (currentDiff > this.preDifference)
                        this.OnPinchOutInternal(event);
                    else if (currentDiff < this.preDifference)
                        this.OnPinchInInternal(event);
                }
                else if (this.ZoomFactor < 2) {
                    if (this.preDifference != -1) {
                        if (currentDiff > this.preDifference)
                            this.OnPinchInInternal(event);
                    }
                }
                else if (this.preDifference == -1) {
                    if (this.ZoomFactor > 2) {
                        if (currentDiff > this.preDifference)
                            this.OnPinchInInternal(event);
                    }
                }
                this.preDifference = currentDiff;
            }
            event.preventDefault();
        };
        LayoutViewer.prototype.OnTouchEndInternal = function (event) {
            if (event.touches.length == 1) {
            }
            this.ScrollStartX = -1;
            this.ScrollStartY = -1;
            this.preDifference = -1;
            this.IsTouchInput = false;
            event.preventDefault();
        };
        LayoutViewer.prototype.OnPinchInInternal = function (event) {
            this.preZoomFactor = this.ZoomFactor;
            this.ZoomFactor = this.ZoomFactor - 0.01;
            if (this.ZoomFactor < 5 && this.ZoomFactor > 2) {
                this.ZoomFactor = this.ZoomFactor - 0.01;
            }
            if (this.ZoomFactor < 0.1) {
                this.ZoomFactor = 0.1;
            }
            if (this.ZoomFactor >= 0.10) {
                var scrollY_1 = this.VerticalScrollBar.model.value / this.preZoomFactor * this.ZoomFactor;
                this.VerticalScrollBar.scroll(scrollY_1);
            }
        };
        LayoutViewer.prototype.OnPinchOutInternal = function (event) {
            this.preZoomFactor = this.ZoomFactor;
            this.ZoomFactor = this.ZoomFactor + 0.01;
            if (this.ZoomFactor > 2) {
                this.ZoomFactor = this.ZoomFactor + 0.01;
            }
            if (this.ZoomFactor > 5) {
                this.ZoomFactor = 5;
            }
            if (this.ZoomFactor <= 5) {
                var scrollY_2 = this.VerticalScrollBar.model.value / this.preZoomFactor * this.ZoomFactor;
                this.VerticalScrollBar.scroll(scrollY_2);
            }
        };
        LayoutViewer.prototype.ScrollContainer = function (event) {
            var xDiff, yDiff;
            if (navigator.userAgent.match("MSIE") || navigator.userAgent.match(".NET")) {
                xDiff = this.ScrollStartX - event.pageX;
                yDiff = this.ScrollStartY - event.pageY;
            }
            else {
                xDiff = this.ScrollStartX - event.touches[0].pageX;
                yDiff = this.ScrollStartY - event.touches[0].pageY;
            }
            if (xDiff < 0)
                xDiff = -(xDiff);
            if (yDiff < 0)
                yDiff = -(yDiff);
            if (xDiff > yDiff)
                this.ScrollHorizontal(event);
            else
                this.ScrollVertical(event);
        };
        LayoutViewer.prototype.ScrollHorizontal = function (event) {
            var scrollX = this.HorizontalScrollBar.model.value;
            var xpos;
            if (navigator.userAgent.match("MSIE") || navigator.userAgent.match(".NET")) {
                event.preventDefault();
                xpos = event.pageX;
                if (this.preDifference != -1) {
                    if (this.preDifference > xpos) {
                        scrollX = scrollX + 10;
                    }
                    else {
                        scrollX = scrollX - 10;
                    }
                }
                this.preDifference = xpos;
            }
            else if (event instanceof TouchEvent) {
                event.preventDefault();
                xpos = event.touches[0].pageX;
                if (this.preDifference != -1) {
                    if (this.preDifference > xpos) {
                        scrollX = scrollX + 10;
                    }
                    else {
                        scrollX = scrollX - 10;
                    }
                }
                this.preDifference = xpos;
            }
            if (scrollX < 0)
                scrollX = 0;
            if (scrollX > this.HorizontalScrollBar.model.maximum)
                scrollX = this.HorizontalScrollBar.model.maximum;
            this.HorizontalScrollBar.scroll(scrollX);
        };
        LayoutViewer.prototype.ScrollVertical = function (event) {
            var scrollY = this.VerticalScrollBar.model.value;
            var yPos;
            if (navigator.userAgent.match("MSIE") || navigator.userAgent.match(".NET")) {
                event.preventDefault();
                yPos = event.pageY;
                if (this.preDifference != -1) {
                    if (this.preDifference > yPos) {
                        scrollY = scrollY + 10;
                    }
                    else {
                        scrollY = scrollY - 10;
                    }
                }
                this.preDifference = yPos;
            }
            else if (event instanceof TouchEvent) {
                event.preventDefault();
                yPos = event.touches[0].pageY;
                if (this.preDifference != -1) {
                    if (this.preDifference > yPos) {
                        scrollY = scrollY + 10;
                    }
                    else {
                        scrollY = scrollY - 10;
                    }
                }
                this.preDifference = yPos;
            }
            if (scrollY < 0)
                scrollY = 0;
            if (scrollY > this.VerticalScrollBar.model.maximum)
                scrollY = this.VerticalScrollBar.model.maximum;
            this.VerticalScrollBar.scroll(scrollY);
        };
        LayoutViewer.prototype.OnMouseDownInternal = function (event) {
            if (this.IsTouchInput) {
                event.preventDefault();
                return;
            }
            var contextMenuItem = this.GetContextMenuItem(event, DocumentEditorThemeHelper.ContextMenuItem);
            if (contextMenuItem != null) {
                this.HandleContextMenuItem(contextMenuItem.id);
                return;
            }
            if (event.target != this.ViewerContatiner)
                return;
            this.ValidateFocus();
            var point = new Point(event.offsetX, event.offsetY);
            if (point.X > this.Container.clientWidth)
                return;
            if (point.Y > this.Container.clientHeight)
                return;
            var clickPoint = this.FindFocusedPage(point);
            if (event.which == 3 && !this.OwnerControl.Selection.IsEmpty && !this.UpdateCursorPosition(clickPoint)) {
                event.preventDefault();
                return;
            }
            this.isMousedown = true;
            this.isSelectionChangedOnMouseMoved = false;
            event.preventDefault();
        };
        LayoutViewer.prototype.OnMouseMoveInternal = function (event) {
            if (this.IsTouchInput) {
                event.preventDefault();
                return;
            }
            if (this.isMousedown) {
                var cursorPoint = new Point(event.offsetX, event.offsetY);
                var touchPoint = this.FindFocusedPage(cursorPoint);
                if (this.CurrentPage != null) {
                    var xPosition = touchPoint.X;
                    var yPosition = touchPoint.Y;
                    if (!this.isSelectionChangedOnMouseMoved) {
                        this.UpdateTextPositionforSelection(touchPoint, 1, true);
                    }
                    if (this.IsLeftButtonPressed(event)) {
                        event.preventDefault();
                        var touchY = yPosition;
                        var textposition = this.OwnerControl.Selection.End;
                        var touchPoint_1 = new Point(xPosition, touchY);
                        this.OwnerControl.Selection.MoveTextPosition(touchPoint_1, true, textposition, this);
                        this.isSelectionChangedOnMouseMoved = true;
                    }
                }
                this.CheckForCursorVisibility(false);
            }
            this.UpdateCursor(event);
        };
        LayoutViewer.prototype.OnMouseUpInternal = function (event) {
            if (this.IsTouchInput) {
                event.preventDefault();
                return;
            }
            var cursorPoint = new Point(event.offsetX, event.offsetY);
            var touchPoint = this.FindFocusedPage(cursorPoint);
            if (this.isMousedown && !this.isSelectionChangedOnMouseMoved && this.CurrentPage != null && this.OwnerControl.Selection.Start != null) {
                this.UpdateTextPositionforSelection(touchPoint, event.detail, true);
                this.CheckForCursorVisibility(false);
            }
            if (this.CurrentPage != null && this.OwnerControl.Selection.Start != null && (this.OwnerControl.Selection.IsEmpty)
                && (event.ctrlKey == true))
                this.NavigateHyperlink(touchPoint);
            this.isMousedown = false;
            this.isSelectionChangedOnMouseMoved = false;
            this.IsTouchInput = false;
            event.preventDefault();
        };
        LayoutViewer.prototype.OnMouseWheelInternal = function (event) {
            if (event.ctrlKey == true) {
                event.preventDefault();
                var PageX = event.pageX - this.ViewerContatiner.offsetLeft;
                if (PageX < this.Container.offsetWidth) {
                    this.preZoomFactor = this.ZoomFactor;
                    if (navigator.userAgent.match("Firefox")) {
                        if (event.detail < 0) {
                            if (this.ZoomFactor <= 4.90)
                                this.ZoomFactor = this.ZoomFactor + .10;
                        }
                        else if (this.ZoomFactor >= .20) {
                            this.ZoomFactor = this.ZoomFactor - .10;
                        }
                    }
                    else {
                        if (event.wheelDelta > 0) {
                            if (this.ZoomFactor <= 4.90)
                                this.ZoomFactor = this.ZoomFactor + .10;
                            else
                                this.ZoomFactor = 5.00;
                        }
                        else {
                            if (this.ZoomFactor >= .20)
                                this.ZoomFactor = this.ZoomFactor - .10;
                            else
                                this.ZoomFactor = 0.10;
                        }
                    }
                    var scrollY_3 = this.VerticalScrollBar.model.value / this.preZoomFactor * this.ZoomFactor;
                    this.VerticalScrollBar.scroll(scrollY_3);
                }
            }
            else {
                var scrollY_4;
                var wheelDelta = (navigator.userAgent.match("Edge") || navigator.userAgent.match("MSIE") || navigator.userAgent.match(".NET")) ? event.wheelDelta : event.wheelDeltaY;
                if (navigator.userAgent.match("Firefox")) {
                    scrollY_4 = this.VerticalScrollBar.model.value + (event.detail * 40);
                }
                else
                    scrollY_4 = this.VerticalScrollBar.model.value - wheelDelta;
                if (scrollY_4 >= 0 && scrollY_4 <= this.VerticalScrollBar.model.maximum) {
                    this.VerticalScrollBar.scroll(scrollY_4);
                    event.preventDefault();
                }
                else if (scrollY_4 > this.VerticalScrollBar.model.maximum) {
                    this.VerticalScrollBar.scroll(this.VerticalScrollBar.model.maximum);
                }
                else {
                    this.VerticalScrollBar.scroll(0);
                }
            }
        };
        LayoutViewer.prototype.IsLeftButtonPressed = function (event) {
            event = event || window.event;
            if ("buttons" in event) {
                return event.buttons == 1;
            }
            var button = event.which || event.button;
            return button == 1;
        };
        LayoutViewer.prototype.OnkeyDownInternal = function (event) {
            var key = event.which || event.keyCode;
            var ctrl = event.ctrlKey ? event.ctrlKey : ((key === 17) ? true : false);
            var shift = event.shiftKey ? event.shiftKey : ((key === 16) ? true : false);
            if (ctrl && !shift) {
                switch (key) {
                    case 65:
                        this.OwnerControl.Selection.SelectRange(this.OwnerControl.Document.DocumentStart, this.OwnerControl.Document.DocumentEnd, true);
                        break;
                    case 67:
                        this.OwnerControl.Selection.Copy();
                        break;
                }
            }
            else if (shift && !ctrl) {
                switch (key) {
                    case 35:
                        this.HandleShiftEndKey();
                        break;
                    case 36:
                        this.HandleShiftHomeKey();
                        break;
                    case 37:
                        this.HandleShiftLeftKey();
                        break;
                    case 38:
                        this.HandleShiftUpKey();
                        break;
                    case 39:
                        this.HandleShiftRightKey();
                        break;
                    case 40:
                        this.HandleShiftDownKey();
                        break;
                }
            }
            else if (shift && ctrl) {
                switch (key) {
                    case 35:
                        this.HandleControlShiftEndKey();
                        break;
                    case 36:
                        this.HandleControlShiftHomeKey();
                        break;
                    case 37:
                        this.HandleControlShiftLeftKey();
                        break;
                    case 38:
                        this.HandleControlShiftUpKey();
                        break;
                    case 39:
                        this.HandleControlShiftRightKey();
                        break;
                    case 40:
                        this.HandleControlShiftDownKey();
                        break;
                }
            }
            event.preventDefault();
        };
        LayoutViewer.prototype.GetCurrentPoint = function (x, y) {
            var point = new Point(0, 0);
            point.X = x - this.ViewerContatiner.offsetLeft;
            point.Y = y - this.ViewerContatiner.offsetTop;
            return point;
        };
        LayoutViewer.prototype.UpdateCursorPosition = function (clickPoint) {
            var lineWidget = this.GetLineWidget(clickPoint);
            var cellWidget = null;
            if (lineWidget != null && lineWidget.CurrentParagraphWidget != null
                && lineWidget.CurrentParagraphWidget.ContainerWidget instanceof TableCellWidget)
                cellWidget = lineWidget.CurrentParagraphWidget.ContainerWidget;
            var width = 0;
            var lastSelectionWidget = null;
            var lastSelectionWidgetInfo = null;
            if (this.OwnerControl.Selection.SelectionRanges.Count > 0) {
                for (var i = 0; i < this.OwnerControl.Selection.SelectionRanges.Count; i++) {
                    var selectionRange = this.OwnerControl.Selection.SelectionRanges.Get(i);
                    var startPosition = (selectionRange.IsForward) ? selectionRange.Start : selectionRange.End;
                    var endPosition = (selectionRange.IsForward) ? selectionRange.End : selectionRange.Start;
                    var start = startPosition.Location;
                    var end = endPosition.Location;
                    var keys = selectionRange.SelectedWidgets.Keys;
                    for (var j = 0; j < keys.Count; j++) {
                        var widget = keys[j];
                        var widgetInfo = selectionRange.SelectedWidgets.Get(widget);
                        if ((widget instanceof LineWidget) && widget == lineWidget) {
                            lastSelectionWidget = keys[keys.length - 1];
                            lastSelectionWidgetInfo = selectionRange.SelectedWidgets.Get(lastSelectionWidget);
                            if (clickPoint.X <= this.CurrentPage.Viewer.ClientArea.X) {
                                return keys[0] == lineWidget ? !startPosition.IsAtParagraphStart : false;
                            }
                            else {
                                if (keys[0] == lineWidget) {
                                    width = start.X + widgetInfo.Width;
                                    return startPosition.IsAtParagraphStart ? !(width > clickPoint.X) : !(width > clickPoint.X && start.X < clickPoint.X);
                                }
                                else if (lastSelectionWidget == lineWidget) {
                                    width = widgetInfo.Width;
                                    return !(end.X > clickPoint.X && this.CurrentPage.Viewer.ClientArea.X < clickPoint.X);
                                }
                                else
                                    return false;
                            }
                        }
                        else if (widget instanceof TableCellWidget) {
                            if (cellWidget != null && cellWidget == widget) {
                                var cellwidget = widget;
                                if (cellwidget.X + cellwidget.Width > clickPoint.X)
                                    return false;
                            }
                        }
                    }
                }
            }
            return true;
        };
        LayoutViewer.prototype.OnZoomFactorChanged = function () {
            if (this.zoomFactor > 5)
                this.zoomFactor = 5;
            else if (this.zoomFactor < 0.1)
                this.zoomFactor = 0.1;
            this.Zoom();
            this.OwnerControl.RaiseClientEvent(DocumentEditorEvents.ZoomFactorChange, null);
        };
        LayoutViewer.prototype.UpdateHFClientArea = function (section, isHeader) {
            var width = section.SectionFormat.PageWidth - section.SectionFormat.LeftMargin - section.SectionFormat.RightMargin;
            if (width < 0) {
                width = 0;
            }
            if (isHeader)
                this.ClientArea = new Rect(section.SectionFormat.LeftMargin, section.SectionFormat.HeaderDistance, width, section.SectionFormat.PageHeight - section.SectionFormat.HeaderDistance);
            else
                this.ClientArea = new Rect(section.SectionFormat.LeftMargin, section.SectionFormat.PageHeight - section.SectionFormat.FooterDistance, width, section.SectionFormat.PageHeight - section.SectionFormat.FooterDistance);
            this.ClientActiveArea = new Rect(this.ClientArea.X, this.ClientArea.Y, this.ClientArea.Width, this.ClientArea.Height);
        };
        LayoutViewer.prototype.UpdateClientArea = function (sectionFormat) {
            var top = sectionFormat.TopMargin;
            if (this.CurrentRenderingPage.HeaderWidget != null) {
                top = Math.max(sectionFormat.HeaderDistance + this.CurrentRenderingPage.HeaderWidget.Height, sectionFormat.TopMargin);
            }
            var bottom = 0.667 + sectionFormat.BottomMargin;
            if (this.CurrentRenderingPage.FooterWidget != null) {
                bottom = 0.667 + Math.max(sectionFormat.FooterDistance + this.CurrentRenderingPage.FooterWidget.Height, sectionFormat.BottomMargin);
            }
            var width = sectionFormat.PageWidth - sectionFormat.LeftMargin - sectionFormat.RightMargin;
            if (width < 0)
                width = 0;
            this.ClientArea = new Rect(sectionFormat.LeftMargin, top, width, sectionFormat.PageHeight - top - bottom);
            this.ClientActiveArea = new Rect(this.ClientArea.X, this.ClientArea.Y, this.ClientArea.Width, this.ClientArea.Height);
        };
        LayoutViewer.prototype.UpdateClientAreaForBlock = function (block, beforeLayout) {
            var leftIndent;
            var rightIndent;
            var X = 0;
            if (beforeLayout) {
                if (block instanceof TableAdv && block.TableWidgets.length > 0) {
                    var tableWidget = block.TableWidgets[0];
                    this.ClientActiveArea.X = this.ClientArea.X = tableWidget.X;
                    this.ClientActiveArea.Width = this.ClientArea.Width = tableWidget.Width;
                    tableWidget = block.TableWidgets[block.TableWidgets.length - 1];
                    tableWidget.X = this.ClientActiveArea.X;
                    tableWidget.Y = this.ClientActiveArea.Y;
                    this.ClientArea = new Rect(this.ClientArea.X, this.ClientArea.Y, this.ClientArea.Width, this.ClientArea.Height);
                    this.ClientActiveArea = new Rect(this.ClientActiveArea.X, this.ClientActiveArea.Y, this.ClientActiveArea.Width, this.ClientActiveArea.Height);
                }
                else {
                    if (block instanceof TableAdv && block.TableFormat.TableAlignment != TableAlignment.Left) {
                        var tableWidth = block.GetTableWidth();
                        if (block.TableFormat.TableAlignment == TableAlignment.Center)
                            leftIndent = (this.ClientArea.Width - tableWidth) / 2;
                        else
                            leftIndent = this.ClientArea.Width - tableWidth;
                        this.tableLeft.push(leftIndent);
                    }
                    else
                        leftIndent = block.LeftIndent;
                    this.ClientActiveArea.X = this.ClientArea.X = this.ClientArea.X + leftIndent;
                    var width = this.ClientArea.Width - (leftIndent + block.RightIndent);
                    this.ClientActiveArea.Width = this.ClientArea.Width = width > 0 ? width : 0;
                    this.ClientArea = new Rect(this.ClientArea.X, this.ClientArea.Y, this.ClientArea.Width, this.ClientArea.Height);
                    this.ClientActiveArea = new Rect(this.ClientActiveArea.X, this.ClientActiveArea.Y, this.ClientActiveArea.Width, this.ClientActiveArea.Height);
                }
            }
            else {
                if (block instanceof TableAdv && block.TableFormat.TableAlignment != TableAlignment.Left && this.tableLeft.length > 0)
                    leftIndent = this.tableLeft.pop();
                else
                    leftIndent = block.LeftIndent;
                this.ClientActiveArea.X = this.ClientArea.X = this.ClientArea.X - leftIndent;
                var width = this.ClientArea.Width + leftIndent + block.RightIndent;
                this.ClientActiveArea.Width = this.ClientArea.Width = width > 0 ? width : 0;
                this.ClientArea = new Rect(this.ClientArea.X, this.ClientArea.Y, this.ClientArea.Width, this.ClientArea.Height);
                this.ClientActiveArea = new Rect(this.ClientActiveArea.X, this.ClientActiveArea.Y, this.ClientActiveArea.Width, this.ClientActiveArea.Height);
            }
        };
        LayoutViewer.prototype.UpdateClientAreaForRow = function (row, beforeLayout) {
            var tableWidget = row.OwnerTable.TableWidgets[row.OwnerTable.TableWidgets.length - 1];
            if (beforeLayout) {
            }
            else {
                this.ClientActiveArea.X = this.ClientArea.X = tableWidget.X;
                this.ClientActiveArea.Width = this.ClientArea.Width = tableWidget.Width;
                this.ClientArea = new Rect(this.ClientArea.X, this.ClientArea.Y, this.ClientArea.Width, this.ClientArea.Height);
                this.ClientActiveArea = new Rect(this.ClientActiveArea.X, this.ClientActiveArea.Y, this.ClientActiveArea.Width, this.ClientActiveArea.Height);
            }
        };
        LayoutViewer.prototype.UpdateClientAreaForCell = function (cell, beforeLayout) {
            var rowWidget = cell.OwnerRow.TableRowWidgets[cell.OwnerRow.TableRowWidgets.length - 1];
            var cellWidget = cell.TableCellWidgets[cell.TableCellWidgets.length - 1];
            if (beforeLayout) {
                this.ClientActiveArea.X = this.ClientArea.X = cellWidget.X;
                this.ClientActiveArea.Y = cellWidget.Y;
                this.ClientActiveArea.Width = this.ClientArea.Width = cellWidget.Width > 0 ? cellWidget.Width : 0;
                if (this instanceof PageLayoutViewer)
                    this.ClientActiveArea.Height = Number.POSITIVE_INFINITY;
                this.ClientArea = new Rect(this.ClientArea.X, this.ClientArea.Y, this.ClientArea.Width, this.ClientArea.Height);
                this.ClientActiveArea = new Rect(this.ClientActiveArea.X, this.ClientActiveArea.Y, this.ClientActiveArea.Width, this.ClientActiveArea.Height);
            }
            else {
                this.ClientActiveArea.X = this.ClientArea.X = cellWidget.X + cellWidget.Width + cellWidget.Margin.Right;
                if (rowWidget.X + rowWidget.Width - this.ClientArea.X < 0)
                    this.ClientActiveArea.Width = this.ClientArea.Width = 0;
                else
                    this.ClientActiveArea.Width = this.ClientArea.Width = rowWidget.X + rowWidget.Width - this.ClientArea.X;
                this.ClientActiveArea.Y = cellWidget.Y - cellWidget.Margin.Top - cell.OwnerTable.TableFormat.CellSpacing;
                if (!cell.OwnerTable.IsInsideTable)
                    this.ClientActiveArea.Height = this.ClientArea.Bottom - rowWidget.Y > 0 ? this.ClientArea.Bottom - rowWidget.Y : 0;
                this.ClientArea = new Rect(this.ClientArea.X, this.ClientArea.Y, this.ClientArea.Width, this.ClientArea.Height);
                this.ClientActiveArea = new Rect(this.ClientActiveArea.X, this.ClientActiveArea.Y, this.ClientActiveArea.Width, this.ClientActiveArea.Height);
            }
        };
        LayoutViewer.prototype.UpdateClientWidth = function (width) {
            this.ClientActiveArea.X -= width;
            if (this.ClientActiveArea.Width + width > 0)
                this.ClientActiveArea.Width += width;
            else
                this.ClientActiveArea.Width = 0;
        };
        LayoutViewer.prototype.CutFromLeft = function (x) {
            if (x < this.ClientActiveArea.Left)
                x = this.ClientActiveArea.Left;
            if (x > this.ClientActiveArea.Right)
                x = this.ClientActiveArea.Right;
            this.ClientActiveArea.Width = this.ClientActiveArea.Right > x ? this.ClientActiveArea.Right - x : 0;
            this.ClientActiveArea.X = x;
        };
        LayoutViewer.prototype.CutFromTop = function (y) {
            if (y < this.ClientActiveArea.Top)
                y = this.ClientActiveArea.Top;
            if (y > this.ClientActiveArea.Bottom)
                y = this.ClientActiveArea.Bottom;
            this.ClientActiveArea.Height = this.ClientActiveArea.Bottom - y;
            this.ClientActiveArea.X = this.ClientArea.X;
            this.ClientActiveArea.Width = this.ClientArea.Width;
            this.ClientActiveArea.Y = y;
        };
        LayoutViewer.prototype.ClearContainer = function () {
            this.RemoveRenderedPages();
            this.Pages.Clear();
            this.VerticalScrollBar.scroll(0);
            this.HorizontalScrollBar.scroll(0);
        };
        LayoutViewer.prototype.InsertPage = function (index, page) {
            this.Pages.Remove(page);
            this.Pages.Insert(index, page);
            var top = 20;
            if (index > 0)
                top += this.Pages[index - 1].BoundingRectangle.Bottom;
            for (var i = index; i < this.Pages.Count; i++) {
                page = this.Pages[i];
                page.BoundingRectangle = new Rect(page.BoundingRectangle.X, top, page.BoundingRectangle.Width, page.BoundingRectangle.Height);
                top = page.BoundingRectangle.Bottom + 20;
            }
        };
        LayoutViewer.prototype.UpdateClientAreaTopOrLeft = function (tableWidget, beforeLayout) {
            if (beforeLayout) {
                this.ClientActiveArea.Y = this.ClientActiveArea.Y + tableWidget.TopBorderWidth;
                this.ClientActiveArea.X = this.ClientActiveArea.X + tableWidget.LeftBorderWidth;
            }
        };
        LayoutViewer.prototype.UpdateTextPosition = function (cursorPoint, clearMultiSelection) {
            var widget = this.GetLineWidget(cursorPoint);
            if (widget != null) {
                widget.UpdateTextPosition(this.OwnerControl, cursorPoint, clearMultiSelection);
            }
        };
        LayoutViewer.prototype.UpdateTextPositionforSelection = function (cursorPoint, tapCount, clearMultiSelection) {
            var widget = this.GetLineWidget(cursorPoint);
            if (widget != null) {
                widget.UpdateTextPosition(this.OwnerControl, cursorPoint, clearMultiSelection);
            }
            if (tapCount > 1) {
                if (this.Pages.Count == 0)
                    return;
                if (this.CurrentPage != null && this.OwnerControl.Selection.Start != null) {
                    if (tapCount % 2 == 0)
                        this.OwnerControl.Selection.SelectCurrentWord(clearMultiSelection);
                    else
                        this.OwnerControl.Selection.SelectCurrentParagraph(clearMultiSelection);
                }
            }
        };
        LayoutViewer.prototype.GetLineWidget = function (cursorPoint) {
            return this.GetLineWidgetInternal(cursorPoint, false);
        };
        LayoutViewer.prototype.GetLineWidgetInternal = function (cursorPoint, isMouseDragged) {
            var widget = null;
            if (this.CurrentPage != null) {
                for (var i = 0; i < this.CurrentPage.BodyWidgets.length; i++) {
                    var bodyWidget = this.CurrentPage.BodyWidgets[i];
                    widget = bodyWidget.GetLineWidget(cursorPoint);
                    if (widget != null)
                        break;
                }
            }
            return widget;
        };
        LayoutViewer.prototype.ClearSelectionHighlight = function () {
            var viewer = this;
            if (viewer instanceof PageLayoutViewer) {
                for (var i = 0; i < viewer.VisiblePages.Count; i++) {
                    var page = viewer.VisiblePages[i];
                    var selectionContainer = document.getElementById(page.Id + "_selection");
                    if (selectionContainer != null) {
                        var context = selectionContainer.getContext("2d");
                        context.clearRect(0, 0, selectionContainer.width, selectionContainer.height);
                    }
                }
            }
            if (this.OwnerControl.Selection.SelectionRanges.Count > 0)
                this.OwnerControl.Selection.SelectionRanges.ClearSelectionHighlight();
        };
        LayoutViewer.prototype.NavigateHyperlink = function (cursorPoint) {
            var widget = this.GetLineWidget(cursorPoint);
            if (widget != null) {
                var hyperlinkField = widget.GetHyperlinkField(this.OwnerControl, cursorPoint);
                if (hyperlinkField != null) {
                    this.UpdateTextPosition(cursorPoint, true);
                    this.OwnerControl.FireRequestNavigate(hyperlinkField);
                }
            }
        };
        LayoutViewer.prototype.ScrollToPosition = function (startPosition, endPosition) {
            var lineWidget = endPosition.Paragraph.GetLineWidgetInternal(endPosition.Offset, true);
            var top = lineWidget.GetTop();
            if (this.isMousedown) {
                var prevLineWidget = endPosition.Paragraph.GetLineWidgetInternal(endPosition.Offset, false);
                var prevTop = prevLineWidget.GetTop();
                if (prevLineWidget != lineWidget && endPosition.Location.Y >= prevTop)
                    lineWidget = prevLineWidget;
            }
            var height = lineWidget.Height;
            var endPage = lineWidget.CurrentParagraphWidget.GetPage();
            var x = 0, y = 0;
            var viewer = this;
            var horizontalWidth = 0;
            if (viewer instanceof PageLayoutViewer) {
                horizontalWidth = parseFloat(viewer.PageContainer.style.width.replace("px", ""));
                var pageWidth = endPage.BoundingRectangle.Width;
                x = (this.VisibleBounds.Width - pageWidth * this.ZoomFactor) / 2;
                if (x < 30)
                    x = 30;
                y = endPage.BoundingRectangle.Top * this.ZoomFactor + (this.Pages.IndexOf(endPage) + 1) * viewer.PageGap * (1 - this.ZoomFactor);
            }
            x += endPosition.Location.X * this.ZoomFactor;
            y += endPosition.Location.Y * this.ZoomFactor;
            var scrollTop = 0;
            var scrollLeft = 0;
            var pageHeight = parseFloat(this.Container.style.height.replace("px", ""));
            if (viewer instanceof PageLayoutViewer) {
                if (viewer.PageContainer.style.left.indexOf("px") > -1)
                    scrollLeft = -parseFloat(viewer.PageContainer.style.left.replace("px", ""));
                if (viewer.PageContainer.style.top.indexOf("px") > -1)
                    scrollTop = -parseFloat(viewer.PageContainer.style.top.replace("px", ""));
            }
            if (scrollTop > y)
                this.VerticalScrollBar.scroll(y - 10);
            else if (scrollTop + pageHeight < y + height)
                this.VerticalScrollBar.scroll(y + height - pageHeight + 10);
            this.UpdateCaretToPage(startPosition, endPage);
            if (scrollLeft > x)
                this.HorizontalScrollBar.scroll(x - 10);
            else if (scrollLeft + this.VisibleBounds.Width < x) {
                if (x >= horizontalWidth - this.VisibleBounds.Width)
                    this.HorizontalScrollBar.scroll(horizontalWidth - this.VisibleBounds.Width);
                else
                    this.HorizontalScrollBar.scroll(x);
            }
        };
        LayoutViewer.prototype.RemovePage = function (page) {
            if (this.CurrentPage == page)
                this.CurrentPage = null;
            if (this.SelectionStartPage == page)
                this.SelectionStartPage = null;
            if (this.SelectionEndPage == page)
                this.SelectionEndPage = null;
            var index = this.Pages.IndexOf(page);
            this.Pages.Remove(page);
            this.RemoveRenderedPages();
            this.UpdateScrollBars();
        };
        LayoutViewer.prototype.UpdateCaretToPage = function (startPosition, endPage) {
            if (endPage != null) {
                this.SelectionEndPage = endPage;
                if (this.OwnerControl.Selection.IsEmpty)
                    this.SelectionStartPage = endPage;
                else {
                    var startLineWidget = startPosition.Paragraph.GetLineWidget(startPosition.Offset);
                    var startPage = startLineWidget.CurrentParagraphWidget.GetPage();
                    if (startPage != null)
                        this.SelectionStartPage = startPage;
                }
            }
        };
        LayoutViewer.prototype.CheckForCursorVisibility = function (isTouch) {
        };
        LayoutViewer.prototype.ShowCaret = function (isTouch) {
            if (isTouch) {
                this.touchStart.style.display = "block";
                this.touchEnd.style.display = "block";
            }
            else {
                this.touchStart.style.display = "none";
                this.touchEnd.style.display = "none";
            }
        };
        LayoutViewer.prototype.HideCaret = function (isTouch) {
            this.touchStart.style.display = "none";
            this.touchEnd.style.display = "none";
        };
        LayoutViewer.prototype.UpdateCaretPosition = function () {
        };
        LayoutViewer.prototype.UpdateTouchMarkPosition = function () {
            var y = this.GetCaretBottom(this.OwnerControl.Selection.Start, false);
            this.touchStart.style.left = Math.round(this.OwnerControl.Selection.Start.Location.X - 12 / 2) + "px";
            this.touchStart.style.top = y + "px";
            y = this.GetCaretBottom(this.OwnerControl.Selection.End, false);
            this.touchEnd.style.left = Math.round(this.OwnerControl.Selection.End.Location.X - 12 / 2) + "px";
            this.touchEnd.style.top = y + "px";
        };
        LayoutViewer.prototype.GetCaretBottom = function (textPosition, isEmptySelection) {
            var bottom = textPosition.Location.Y;
            if (textPosition.Paragraph.IsEmpty()) {
                var paragraph = textPosition.Paragraph;
                var topMargin = 0, bottomMargin = 0;
                var sizeInfo = paragraph.GetParagraphMarkSize(topMargin, bottomMargin);
                topMargin = sizeInfo.TopMargin;
                bottomMargin = sizeInfo.BottomMargin;
                bottom += sizeInfo.Height;
                bottom += topMargin;
                if (!isEmptySelection)
                    bottom += bottomMargin;
            }
            else {
                var index = 0;
                var inlineInfo = textPosition.Paragraph.GetInline(textPosition.Offset, index);
                var inline = inlineInfo.inline;
                index = inlineInfo.index;
                var topMargin = 0;
                var isItalic = false;
                var caretHeightInfo = inline.GetCaretHeight(index, inline.CharacterFormat, false, topMargin, isItalic);
                topMargin = caretHeightInfo.TopMargin;
                isItalic = caretHeightInfo.IsItalic;
                bottom += caretHeightInfo.Height;
                if (isEmptySelection)
                    bottom -= textPosition.Paragraph.ParagraphFormat.AfterSpacing;
            }
            return bottom;
        };
        LayoutViewer.prototype.HandleShiftLeftKey = function () {
            this.OwnerControl.Selection.ExtendBackward(true);
            this.CheckForCursorVisibility(false);
        };
        LayoutViewer.prototype.HandleShiftRightKey = function () {
            this.OwnerControl.Selection.ExtendForward(true);
            this.CheckForCursorVisibility(false);
        };
        LayoutViewer.prototype.HandleShiftUpKey = function () {
            this.OwnerControl.Selection.ExtendToPreviousLine(true);
            this.CheckForCursorVisibility(false);
        };
        LayoutViewer.prototype.HandleShiftDownKey = function () {
            this.OwnerControl.Selection.ExtendToNextLine(true);
            this.CheckForCursorVisibility(false);
        };
        LayoutViewer.prototype.HandleShiftHomeKey = function () {
            this.OwnerControl.Selection.ExtendToLineStart(true);
            this.CheckForCursorVisibility(false);
        };
        LayoutViewer.prototype.HandleShiftEndKey = function () {
            this.OwnerControl.Selection.ExtendToLineEnd(true);
            this.CheckForCursorVisibility(false);
        };
        LayoutViewer.prototype.HandleControlShiftHomeKey = function () {
            var documentStart = null;
            if (this.OwnerControl.Document != null)
                documentStart = this.OwnerControl.Document.DocumentStart;
            if (documentStart != null) {
                this.OwnerControl.Selection.End.SetPositionInternal(documentStart);
                this.OwnerControl.Selection.FireSelectionChanged(true);
            }
            this.CheckForCursorVisibility(false);
        };
        LayoutViewer.prototype.HandleControlShiftEndKey = function () {
            var documentEnd = null;
            if (this.OwnerControl.Document != null)
                documentEnd = this.OwnerControl.Document.DocumentEnd;
            if (documentEnd != null) {
                this.OwnerControl.Selection.End.SetPosition(documentEnd.Paragraph, false);
                this.OwnerControl.Selection.FireSelectionChanged(true);
            }
            this.CheckForCursorVisibility(false);
        };
        LayoutViewer.prototype.HandleControlShiftDownKey = function () {
            this.OwnerControl.Selection.ExtendToParagraphEnd(true);
            this.CheckForCursorVisibility(false);
        };
        LayoutViewer.prototype.HandleControlShiftLeftKey = function () {
            this.OwnerControl.Selection.ExtendToWordStart(false, true);
            this.CheckForCursorVisibility(false);
        };
        LayoutViewer.prototype.HandleControlShiftUpKey = function () {
            this.OwnerControl.Selection.ExtendToParagraphStart(true);
            this.CheckForCursorVisibility(false);
        };
        LayoutViewer.prototype.HandleControlShiftRightKey = function () {
            this.OwnerControl.Selection.ExtendToWordEnd(false, true);
            this.CheckForCursorVisibility(false);
        };
        return LayoutViewer;
    }());
    DocumentEditorFeatures.LayoutViewer = LayoutViewer;
    var PageLayoutViewer = (function (_super) {
        __extends(PageLayoutViewer, _super);
        function PageLayoutViewer(owner) {
            _super.call(this, owner);
            this.PageGap = 20;
            this.PageLeft = 30;
            this.GetCurrentPageHeaderFooter = function (section, isHeader) {
                var type;
                type = isHeader ? HeaderFooterType.OddHeader : HeaderFooterType.OddFooter;
                if (section.SectionFormat.DifferentFirstPage && (this.Pages.length == 1 || this.Pages[this.Pages.length - 1].Section != section)) {
                    type = isHeader ? HeaderFooterType.FirstPageHeader : HeaderFooterType.FirstPageFooter;
                }
                else if (section.SectionFormat.DifferentOddAndEvenPages && this.Pages.length % 2 == 0) {
                    type = isHeader ? HeaderFooterType.EvenHeader : HeaderFooterType.EvenFooter;
                }
                return section.GetCurrentHeaderFooter(type);
            };
            this.PageContainer = document.createElement("div");
            this.PageContainer.setAttribute("id", this.OwnerControl.ContainerId + "_pageContainer");
            this.PageContainer.style.position = "relative";
            this.Container.appendChild(this.PageContainer);
            this.VisiblePages = new List();
        }
        PageLayoutViewer.prototype.FindFocusedPage = function (currentPoint) {
            var point = new Point(currentPoint.X, currentPoint.Y);
            if (this.PageContainer.style.left.indexOf("px") > -1)
                point.X -= parseFloat(this.PageContainer.style.left.replace("px", ""));
            if (this.PageContainer.style.top.indexOf("px") > -1)
                point.Y -= parseFloat(this.PageContainer.style.top.replace("px", ""));
            for (var i = 0; i < this.Pages.length; i++) {
                var page = this.Pages[i];
                var pageTop = (page.BoundingRectangle.Top - this.PageGap * (i + 1)) * this.ZoomFactor + this.PageGap * (i + 1);
                var pageHeight = page.BoundingRectangle.Height * this.ZoomFactor;
                var pageLeft = page.BoundingRectangle.Left;
                var pageRight = page.BoundingRectangle.Right;
                if (pageTop <= point.Y && pageTop + pageHeight >= point.Y) {
                    this.CurrentPage = page;
                    point.Y = (point.Y - pageTop) / this.ZoomFactor;
                    if (point.X > pageRight)
                        point.X = page.BoundingRectangle.Right;
                    else if (point.X < pageLeft)
                        point.X = page.BoundingRectangle.Left;
                    else
                        point.X = (point.X - pageLeft) / this.ZoomFactor;
                    return point;
                }
            }
            return point;
        };
        PageLayoutViewer.prototype.UpdateCursor = function (event) {
            var hyperlinkField = null;
            var point = new Point(event.offsetX, event.offsetY);
            var touchPoint = this.FindFocusedPage(point);
            var widget = this.GetLineWidget(touchPoint);
            if (widget != null)
                hyperlinkField = widget.GetHyperlinkField(this.OwnerControl, touchPoint);
            var div = this.ViewerContatiner;
            if (hyperlinkField != null && event.ctrlKey == true)
                div.style.cursor = "pointer";
            else
                div.style.cursor = "default";
        };
        PageLayoutViewer.prototype.CreateNewPage = function (section) {
            var yPos = this.PageGap;
            if (this.Pages.length > 0)
                yPos = this.Pages[this.Pages.length - 1].BoundingRectangle.Bottom + this.PageGap;
            var page = new Page();
            page.Viewer = this;
            page.Section = section;
            var pageWidth = section.SectionFormat.PageWidth;
            var pageHeight = section.SectionFormat.PageHeight;
            var xPos = (this.VisibleBounds.Width - pageWidth * this.ZoomFactor) / 2;
            if (xPos < this.PageLeft)
                xPos = this.PageLeft;
            page.BoundingRectangle = new Rect(xPos, yPos, pageWidth, pageHeight);
            this.Pages.push(page);
            this.LayoutHeaderFooter(section);
            this.UpdateClientArea(section.SectionFormat);
            page.BodyWidgets.push(section.AddBodyWidget(this.ClientActiveArea));
            page.BodyWidgets[page.BodyWidgets.length - 1].Page = page;
            return page;
        };
        PageLayoutViewer.prototype.LayoutHeaderFooter = function (section) {
            this.CurrentHeaderFooter = this.GetCurrentPageHeaderFooter(section, true);
            if (this.CurrentHeaderFooter.Blocks.length > 0) {
                this.UpdateHFClientArea(section, true);
                this.CurrentRenderingPage.HeaderWidget = this.CurrentHeaderFooter.LayoutItems(this);
            }
            this.CurrentHeaderFooter = this.GetCurrentPageHeaderFooter(section, false);
            if (this.CurrentHeaderFooter.Blocks.length > 0) {
                this.UpdateHFClientArea(section, false);
                this.CurrentRenderingPage.FooterWidget = this.CurrentHeaderFooter.LayoutItems(this);
            }
            this.CurrentHeaderFooter = null;
        };
        PageLayoutViewer.prototype.Zoom = function () {
            this.UpdateScrollBars();
        };
        PageLayoutViewer.prototype.UpdateScrollBars = function () {
            var height = 0;
            for (var i = 0; i < this.Pages.length; i++) {
                height = height + this.Pages[i].BoundingRectangle.Height;
            }
            var width = 0;
            for (var i = 0; i < this.Pages.length; i++) {
                if (width < this.Pages[i].BoundingRectangle.Width) {
                    width = this.Pages[i].BoundingRectangle.Width;
                }
            }
            var containerWidth = width * this.ZoomFactor + this.PageLeft * 2;
            var containerHeight = height * this.ZoomFactor + (this.Pages.length + 1) * this.PageGap;
            var viewerWidth = this.VisibleBounds.Width;
            var viewerHeight = this.VisibleBounds.Height;
            if (containerHeight > viewerHeight) {
                viewerWidth -= this.VerticalScrollBar.model.width;
            }
            if (containerWidth > viewerWidth) {
                viewerHeight -= this.HorizontalScrollBar.model.height;
            }
            width = containerWidth > viewerWidth ? containerWidth : viewerWidth;
            height = containerHeight > viewerHeight ? containerHeight : viewerHeight;
            this.Container.style.width = viewerWidth.toString() + "px";
            this.Container.style.height = viewerHeight.toString() + "px";
            this.PageContainer.style.width = width.toString() + "px";
            this.PageContainer.style.height = height.toString() + "px";
            for (var i = 0; i < this.Pages.length; i++) {
                var left = (width - this.Pages[i].BoundingRectangle.Width * this.ZoomFactor) / 2;
                if (left > this.PageLeft)
                    this.Pages[i].BoundingRectangle = new Rect(left, this.Pages[i].BoundingRectangle.Top, this.Pages[i].BoundingRectangle.Width, this.Pages[i].BoundingRectangle.Height);
                else
                    this.Pages[i].BoundingRectangle = new Rect(this.PageLeft, this.Pages[i].BoundingRectangle.Top, this.Pages[i].BoundingRectangle.Width, this.Pages[i].BoundingRectangle.Height);
            }
            var hScrollBar = this.HorizontalScrollBar.element[0];
            if (containerWidth > viewerWidth) {
                var scrollValue = this.HorizontalScrollBar.model.value;
                hScrollBar.style.display = "block";
                this.HorizontalScrollBar.option("maximum", width - viewerWidth);
                this.HorizontalScrollBar.option("viewportsize", viewerWidth);
                this.HorizontalScrollBar.option("width", viewerWidth);
                this.HorizontalScrollBar._scrollData.handleSpace = viewerWidth - (2 * this.HorizontalScrollBar.model.buttonSize);
                this.HorizontalScrollBar._scrollData.handle = Math.floor((viewerWidth - 18) / width * this.HorizontalScrollBar._scrollData.handleSpace);
                if (this.HorizontalScrollBar._scrollData.handle < 15)
                    this.HorizontalScrollBar._scrollData.handle = 15;
                this.HorizontalScrollBar._scrollData.scrollable = this.HorizontalScrollBar.model.maximum;
                this.HorizontalScrollBar._scrollData.onePx = this.HorizontalScrollBar._scrollData.scrollable / (this.HorizontalScrollBar._scrollData.handleSpace - this.HorizontalScrollBar._scrollData.handle);
                this.HorizontalScrollBar["e-hhandle"].width(this.HorizontalScrollBar._scrollData.handle);
                this.HorizontalScrollBar.scroll(scrollValue);
            }
            else {
                hScrollBar.style.display = "none";
                this.HorizontalScrollBar.scroll(0);
            }
            var vScrollBar = this.VerticalScrollBar.element[0];
            if (containerHeight > viewerHeight) {
                var scrollValue = this.VerticalScrollBar.model.value;
                vScrollBar.style.display = "block";
                this.VerticalScrollBar.option("maximum", height - viewerHeight);
                this.VerticalScrollBar.option("viewportsize", viewerHeight);
                this.VerticalScrollBar.option("height", viewerHeight);
                this.VerticalScrollBar._scrollData.handleSpace = viewerHeight - (2 * this.VerticalScrollBar.model.buttonSize);
                this.VerticalScrollBar._scrollData.handle = Math.floor((viewerHeight - 18) / height * this.VerticalScrollBar._scrollData.handleSpace);
                if (this.VerticalScrollBar._scrollData.handle < 15)
                    this.VerticalScrollBar._scrollData.handle = 15;
                this.VerticalScrollBar._scrollData.scrollable = this.VerticalScrollBar.model.maximum;
                this.VerticalScrollBar._scrollData.onePx = this.VerticalScrollBar._scrollData.scrollable / (this.VerticalScrollBar._scrollData.handleSpace - this.VerticalScrollBar._scrollData.handle);
                this.VerticalScrollBar["e-vhandle"].height(this.VerticalScrollBar._scrollData.handle);
                this.VerticalScrollBar.scroll(scrollValue);
            }
            else {
                vScrollBar.style.display = "none";
                this.VerticalScrollBar.scroll(0);
            }
        };
        PageLayoutViewer.prototype.VerticalScrollBar_ValueChanged = function (eventArgs) {
            var top = eventArgs.scrollTop;
            var viewerHeight = parseFloat(this.Container.style.height);
            var containerHeight = parseFloat(this.PageContainer.style.height);
            if (top > containerHeight - viewerHeight)
                top = containerHeight - viewerHeight;
            this.PageContainer.style.top = (-top).toString() + "px";
            this.UpdateVisiblePages(true);
        };
        PageLayoutViewer.prototype.HorizontalScrollBar_ValueChanged = function (eventArgs) {
            var left = eventArgs.scrollLeft;
            var viewerWidth = parseFloat(this.Container.style.width);
            var containerWidth = parseFloat(this.PageContainer.style.width);
            if (left > containerWidth - viewerWidth)
                left = containerWidth - viewerWidth;
            this.PageContainer.style.left = (-left).toString() + "px";
        };
        PageLayoutViewer.prototype.UpdateVisiblePages = function (addToTop) {
            for (var i = 0; i < this.PageContainer.childNodes.length; i++) {
                this.PageContainer.removeChild(this.PageContainer.childNodes[i]);
                i--;
            }
            this.ClearVisiblePages();
            var top = this.PageGap;
            var height = this.VisibleBounds.Height;
            var vertical = -parseFloat(this.PageContainer.style.top);
            var isFirstVisiblePage = true;
            for (var i = 0; i < this.Pages.length; i++) {
                var page = this.Pages[i];
                var y = (page.BoundingRectangle.Top - this.PageGap * (i + 1)) * this.ZoomFactor + this.PageGap * (i + 1);
                var pageH = page.BoundingRectangle.Height * this.ZoomFactor;
                var left = page.BoundingRectangle.Left;
                if ((y >= vertical && y <= vertical + height)
                    || (y <= vertical && y + pageH >= vertical + height)
                    || (y + pageH >= vertical && y + pageH <= vertical + height)) {
                    this.AddVisiblePage(page, left, top, false);
                    isFirstVisiblePage = false;
                }
                top += this.PageGap + page.BoundingRectangle.Height * this.ZoomFactor;
            }
        };
        PageLayoutViewer.prototype.AddVisiblePage = function (page, x, y, addAsInitial) {
            var height = page.BoundingRectangle.Height * this.ZoomFactor;
            var width = page.BoundingRectangle.Width * this.ZoomFactor;
            page.Id = this.OwnerControl.ContainerId + "_page_" + Math.random().toString();
            ;
            var backgroundContainer = document.createElement("canvas");
            backgroundContainer.style.position = "absolute";
            backgroundContainer.style.top = y.toString() + "px";
            backgroundContainer.style.left = x.toString() + "px";
            backgroundContainer.style.borderWidth = "1px";
            backgroundContainer.style.borderColor = "#D9DCDD";
            backgroundContainer.style.borderStyle = "solid";
            backgroundContainer.style.backgroundColor = this.OwnerControl.Document.BackgroundColor;
            backgroundContainer.height = height;
            backgroundContainer.width = width;
            backgroundContainer.style.zIndex = "0";
            backgroundContainer.id = page.Id + "_background";
            this.PageContainer.appendChild(backgroundContainer);
            var foregroundContainer = document.createElement("canvas");
            foregroundContainer.style.position = "absolute";
            foregroundContainer.style.top = y.toString() + "px";
            foregroundContainer.style.left = x.toString() + "px";
            foregroundContainer.style.borderWidth = "0px";
            foregroundContainer.height = height;
            foregroundContainer.width = width;
            foregroundContainer.style.zIndex = "1";
            foregroundContainer.id = page.Id + "_foreground";
            this.PageContainer.appendChild(foregroundContainer);
            var selectionContainer = document.createElement("canvas");
            selectionContainer.style.position = "absolute";
            selectionContainer.style.top = y.toString() + "px";
            selectionContainer.style.left = x.toString() + "px";
            selectionContainer.style.borderWidth = "0px";
            selectionContainer.height = height;
            selectionContainer.width = width;
            selectionContainer.style.zIndex = "2";
            selectionContainer.id = page.Id + "_selection";
            this.PageContainer.appendChild(selectionContainer);
            this.VisiblePages.Add(page);
            page.RenderWidgets();
        };
        PageLayoutViewer.prototype.ClearVisiblePages = function () {
            for (var i = 0; i < this.VisiblePages.length; i++) {
                var page = this.VisiblePages[i];
                var element = document.getElementById(page.Id);
                if (element != null)
                    element.parentElement.removeChild(element);
                this.VisiblePages.RemoveAt(i);
                page.RemoveWidgets(this);
            }
        };
        PageLayoutViewer.prototype.Print = function () {
            var height = 0;
            for (var i = 0; i < this.Pages.length; i++) {
                height = height + this.Pages[i].BoundingRectangle.Height;
            }
            var width = 0;
            for (var i = 0; i < this.Pages.length; i++) {
                if (width < this.Pages[i].BoundingRectangle.Width) {
                    width = this.Pages[i].BoundingRectangle.Width;
                }
            }
            var browserUserAgent = navigator.userAgent;
            var iframe = document.createElement("iframe");
            iframe.style.position = "absolute";
            iframe.style.left = "-150em";
            document.body.appendChild(iframe);
            iframe.contentDocument.open();
            if ((browserUserAgent.indexOf('Chrome') != -1) || (browserUserAgent.indexOf('Safari') != -1) || (browserUserAgent.indexOf("Firefox")) != -1) {
                var orientation_1 = width < height ? "portrait" : "landscape";
                iframe.contentDocument.write('<!DOCTYPE html>');
                iframe.contentDocument.write('<html moznomarginboxes mozdisallowselectionprint><head><style>html, body { height: 100%; } img { height: 100%; width: 100%; display: block;}@media print{ body { margin: 0cm;}img { box-sizing: border-box; }br, button { display: none; }} @page{margin:0cm; size:' + orientation_1 + ';} </style></head><body><center>');
            }
            else {
                iframe.contentDocument.write('<html><head><style>@page{margin:0;size:' + width.toString() + 'px ' + height.toString() + 'px;}</style></head><body><center>');
            }
            for (var i = 0; i < this.Pages.length; i++) {
                var page = this.Pages[i];
                var pageHeight = page.BoundingRectangle.Height;
                var pageWidth = page.BoundingRectangle.Width;
                var canvasURL = page.RenderCanvas().toDataURL();
                if ((browserUserAgent.indexOf('Chrome') != -1) || (browserUserAgent.indexOf('Safari') != -1) || (browserUserAgent.indexOf("Firefox")) != -1) {
                    iframe.contentDocument.write('<div><img src="' + canvasURL + '" style="margin:0px;display:block;width:' + pageWidth.toString() + 'px;height:' + pageHeight.toString() + 'px; "/></div><br/>');
                }
                else {
                    iframe.contentDocument.write('<img src="' + canvasURL + '" style="width:' + pageWidth.toString() + 'px;height:' + pageHeight.toString() + ';margin:0px;"/><br />');
                }
            }
            iframe.contentDocument.write('</center></body></html>');
            iframe.contentDocument.write('</body></html>');
            if (navigator.userAgent.match("Firefox")) {
                iframe.contentWindow.close();
            }
            else {
                iframe.contentDocument.close();
            }
            if ((browserUserAgent.indexOf('Chrome') != -1) || (browserUserAgent.indexOf('Safari') != -1) || (browserUserAgent.indexOf("Firefox")) != -1) {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                setTimeout(function () {
                    document.body.removeChild(iframe);
                }, 500);
            }
            else {
                iframe.contentWindow.document.execCommand('print', false, null);
            }
        };
        PageLayoutViewer.prototype.RenderVisiblePages = function () {
            for (var i = 0; i < this.Pages.length; i++) {
                var page = this.Pages[i];
                page.RemoveWidgets(this);
                page.RenderWidgets();
            }
        };
        PageLayoutViewer.prototype.RemoveRenderedPages = function () {
            for (var i = 0; i < this.Pages.length; i++) {
                var page = this.Pages[i];
                var element = document.getElementById(page.Id);
                if (element != null)
                    element.remove();
                page.RemoveWidgets(this);
            }
        };
        PageLayoutViewer.prototype.SetPageCount = function () {
            this.OwnerControl.PageCount = this.Pages.Count > 0 ? this.Pages.Count : 1;
        };
        return PageLayoutViewer;
    }(LayoutViewer));
    DocumentEditorFeatures.PageLayoutViewer = PageLayoutViewer;
    var Page = (function () {
        function Page() {
            this.RepeatHeaderRowTableWidget = false;
            this.HeaderWidget = null;
            this.FooterWidget = null;
            this.BodyWidgets = new List();
        }
        Page.prototype.RenderWidgets = function () {
            var backgroundContext = document.getElementById(this.Id + "_background").getContext("2d");
            var selectionContext = document.getElementById(this.Id + "_selection").getContext("2d");
            var foregroundContext = document.getElementById(this.Id + "_foreground").getContext("2d");
            this.SetZoomTransform(backgroundContext, foregroundContext, selectionContext, this);
            if (this.HeaderWidget != null) {
                this.HeaderWidget._render(this);
            }
            if (this.FooterWidget != null) {
                this.FooterWidget._render(this);
            }
            for (var i = 0; i < this.BodyWidgets.length; i++) {
                this.BodyWidgets[i]._render(this);
            }
        };
        Page.prototype.RemoveWidgets = function (viewer) {
            if (this.HeaderWidget != null)
                this.HeaderWidget.RemoveWidget(viewer);
            if (this.FooterWidget != null)
                this.FooterWidget.RemoveWidget(viewer);
            if (this.BodyWidgets != null) {
                for (var i = 0; i < this.BodyWidgets.Count; i++) {
                    this.BodyWidgets[i].RemoveWidget(viewer);
                }
            }
        };
        Page.prototype.RenderCanvas = function () {
            var canvas = document.createElement("canvas");
            canvas.style.position = "absolute";
            canvas.style.borderStyle = "solid";
            canvas.style.borderWidth = "1px";
            canvas.setAttribute("width", this.BoundingRectangle.Width.toString());
            canvas.setAttribute("height", this.BoundingRectangle.Height.toString());
            if (this.HeaderWidget != null) {
                this.HeaderWidget._renderCanvas(canvas);
            }
            if (this.FooterWidget != null) {
                this.FooterWidget._renderCanvas(canvas);
            }
            for (var i = 0; i < this.BodyWidgets.length; i++) {
                this.BodyWidgets[i]._renderCanvas(canvas);
            }
            return canvas;
        };
        Page.prototype.SetZoomTransform = function (backgroundContext, selectionContext, foregroundContext, page) {
            backgroundContext.setTransform(page.Viewer.ZoomFactor, 0, 0, page.Viewer.ZoomFactor, 1, 1);
            selectionContext.setTransform(page.Viewer.ZoomFactor, 0, 0, page.Viewer.ZoomFactor, 1, 1);
            foregroundContext.setTransform(page.Viewer.ZoomFactor, 0, 0, page.Viewer.ZoomFactor, 1, 1);
        };
        Page.prototype.ClearTransform = function (backgroundContext, selectionContext, foregroundContext) {
            backgroundContext.setTransform(1, 0, 0, 1, 0, 0);
            selectionContext.setTransform(1, 0, 0, 1, 0, 0);
            foregroundContext.setTransform(1, 0, 0, 1, 0, 0);
        };
        Page.prototype.Dispose = function () {
            this.HeaderWidget = null;
            this.FooterWidget = null;
            this.Section = null;
            this.RemoveWidgets(this.Viewer);
            if (this.BodyWidgets != null) {
                this.BodyWidgets.Clear();
                this.BodyWidgets = null;
            }
            if (this.Viewer != null) {
                if (this.Viewer.Pages != null)
                    this.Viewer.RemovePage(this);
                this.Viewer = null;
            }
        };
        return Page;
    }());
    DocumentEditorFeatures.Page = Page;
    var Widget = (function () {
        function Widget() {
            this.X = 0;
            this.Y = 0;
            this.Width = 0;
            this.Height = 0;
            this.ChildWidgets = new List();
        }
        Widget.prototype.UpdateClientAreaLocation = function (area) {
            this.X = area.X;
            this.Y = area.Y;
            this.Width = area.Width;
        };
        Widget.prototype.UpdateWidgetLocation = function (widget) {
            this.X = widget.X;
            this.Y = widget.Y;
            this.Width = widget.Width;
        };
        Widget.prototype.GetPage = function () {
            var page = null;
            if (this.ContainerWidget instanceof BodyWidget) {
                var bodyWidget = this.ContainerWidget;
                page = this.ContainerWidget.Page;
            }
            else if (this.ContainerWidget != null)
                page = this.ContainerWidget.GetPage();
            return page;
        };
        Widget.prototype.RenderSingleBorder = function (context, border, startX, startY, endX, endY, lineWidth) {
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.lineWidth = lineWidth;
            context.strokeStyle = border.Color ? border.Color : "#000000";
            if (lineWidth > 0)
                context.stroke();
            context.closePath();
        };
        Widget.prototype.ClearChildSelectionHighlight = function (viewer) {
            for (var i = 0; i < this.ChildWidgets.Count; i++) {
                if (this.ChildWidgets[i] instanceof LineWidget)
                    this.ChildWidgets[i].ClearSelectionHighlight(viewer);
                else if (this.ChildWidgets[i] instanceof TableCellWidget)
                    this.ChildWidgets[i].ClearSelectionHighlight(viewer);
                else if (this.ChildWidgets[i] instanceof Widget)
                    this.ChildWidgets[i].ClearChildSelectionHighlight(viewer);
            }
        };
        return Widget;
    }());
    DocumentEditorFeatures.Widget = Widget;
    var BodyWidget = (function (_super) {
        __extends(BodyWidget, _super);
        function BodyWidget(node) {
            _super.call(this);
            this.CurrentNode = node;
        }
        BodyWidget.prototype._getHTML = function () {
            var innerHtml = "";
            for (var _i = 0, _a = this.ChildWidgets; _i < _a.length; _i++) {
                var child = _a[_i];
                innerHtml += child._getHTML();
            }
            return innerHtml;
        };
        BodyWidget.prototype._render = function (page) {
            var canvas = document.getElementById(page.Id + "_foreground");
            var inline, paraFormat;
            if (canvas == null) {
                return;
            }
            var context = canvas.getContext("2d");
            context.globalAlpha = 1;
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var widget = this.ChildWidgets[i];
                widget._render(page);
            }
        };
        BodyWidget.prototype._renderCanvas = function (canvas) {
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var widget = this.ChildWidgets[i];
                widget._renderCanvas(canvas);
            }
        };
        BodyWidget.prototype.ShiftChildLocation = function (shiftTop) {
            this.Y += shiftTop;
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                if (this.ChildWidgets[i] instanceof ParagraphWidget) {
                    this.ChildWidgets[i].X = this.ChildWidgets[i].X;
                    this.ChildWidgets[i].Y = this.ChildWidgets[i].Y + shiftTop;
                }
                else
                    this.ChildWidgets[i].ShiftChildLocation(shiftTop);
            }
        };
        BodyWidget.prototype.GetLineWidget = function (point) {
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                if (this.ChildWidgets[i].Y <= point.Y
                    && (this.ChildWidgets[i].Y + this.ChildWidgets[i].Height) >= point.Y)
                    return this.ChildWidgets[i].GetLineWidget(point);
            }
            var lineWidget = null;
            if (this.ChildWidgets.length > 0) {
                if (this.ChildWidgets[0].Y <= point.Y)
                    lineWidget = this.ChildWidgets[this.ChildWidgets.length - 1].GetLineWidget(point);
                else
                    lineWidget = this.ChildWidgets[0].GetLineWidget(point);
            }
            return lineWidget;
        };
        BodyWidget.prototype.RemoveWidget = function (viewer) {
            if (viewer == null)
                return;
            for (var i = 0; i < this.ChildWidgets.Count; i++) {
                this.ChildWidgets[i].RemoveWidget(viewer);
            }
        };
        BodyWidget.prototype.Dispose = function () {
            var height = this.Height;
            if (this.ChildWidgets != null) {
                for (var i = 0; i < this.ChildWidgets.Count; i++) {
                    var widget = this.ChildWidgets[i];
                    if (widget instanceof ParagraphWidget)
                        widget.Dispose();
                    else if (widget instanceof TableRowWidget)
                        widget.Dispose();
                    else
                        widget.Dispose();
                    if (this.ChildWidgets == null)
                        break;
                    this.ChildWidgets.Remove(widget);
                    i--;
                }
                this.ChildWidgets = null;
            }
            if (this.ContainerWidget != null) {
                if (this.ContainerWidget.ChildWidgets != null) {
                    this.ContainerWidget.ChildWidgets.Remove(this);
                    this.ContainerWidget.Height -= height;
                }
                this.ContainerWidget = null;
            }
            if (this instanceof HeaderFooterWidget && (this.CurrentNode != null)) {
                if (this.CurrentNode.LayoutedWidgets != null)
                    (this.CurrentNode.LayoutedWidgets.Remove(this));
                this.CurrentNode = null;
            }
            else if (Node instanceof SectionAdv) {
                if (this.CurrentNode.BodyWidgets != null)
                    this.CurrentNode.BodyWidgets.Remove(this);
                this.CurrentNode = null;
            }
            if (this.Page != null) {
                if (this.Page.BodyWidgets != null && this.Page.BodyWidgets.Contains(this)) {
                    this.Page.BodyWidgets.Remove(this);
                    if (this.Page.BodyWidgets.Count == 0)
                        this.Page.Dispose();
                }
                else if (this.Page.HeaderWidget == this)
                    this.Page.HeaderWidget = null;
                else if (this.Page.FooterWidget == this)
                    this.Page.FooterWidget = null;
                this.Page = null;
            }
        };
        return BodyWidget;
    }(Widget));
    DocumentEditorFeatures.BodyWidget = BodyWidget;
    var HeaderFooterWidget = (function (_super) {
        __extends(HeaderFooterWidget, _super);
        function HeaderFooterWidget(node) {
            _super.call(this, node);
        }
        HeaderFooterWidget.prototype._getHTML = function () {
            var innerHtml = "";
            for (var _i = 0, _a = this.ChildWidgets; _i < _a.length; _i++) {
                var child = _a[_i];
                innerHtml += child._getHTML();
            }
            return innerHtml;
        };
        HeaderFooterWidget.prototype._render = function (page) {
            var canvas = document.getElementById(page.Id + "_foreground");
            var inline, paraFormat;
            if (canvas == null) {
                return;
            }
            var context = canvas.getContext("2d");
            context.globalAlpha = 0.75;
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var widget = this.ChildWidgets[i];
                widget._render(page);
            }
        };
        HeaderFooterWidget.prototype._renderCanvas = function (canvas) {
            if (canvas == null) {
                return;
            }
            var context = canvas.getContext("2d");
            context.globalAlpha = 0.75;
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var widget = this.ChildWidgets[i];
                widget._renderCanvas(canvas);
            }
        };
        HeaderFooterWidget.prototype.GetLineWidget = function (point) {
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                if (this.ChildWidgets[i].Y <= point.Y
                    && (this.ChildWidgets[i].Y + this.ChildWidgets[i].Height) >= point.Y)
                    return this.ChildWidgets[i].GetLineWidget(point);
            }
            var lineWidget = null;
            if (this.ChildWidgets.length > 0) {
                if (this.ChildWidgets[0].Y <= point.Y)
                    lineWidget = this.ChildWidgets[this.ChildWidgets.length - 1].GetLineWidget(point);
                else
                    lineWidget = this.ChildWidgets[0].GetLineWidget(point);
            }
            return lineWidget;
        };
        return HeaderFooterWidget;
    }(BodyWidget));
    DocumentEditorFeatures.HeaderFooterWidget = HeaderFooterWidget;
    var TableWidget = (function (_super) {
        __extends(TableWidget, _super);
        function TableWidget(node) {
            _super.call(this);
            this.leftMargin = 0;
            this.topMargin = 0;
            this.rightMargin = 0;
            this.bottomMargin = 0;
            this.CurrentNode = node;
            this.Table = node;
            this.Margin = new Margin(this.leftMargin, this.topMargin, this.rightMargin, this.bottomMargin);
            this.LeftBorderWidth = 0;
            this.RightBorderWidth = 0;
            this.TopBorderWidth = 0;
            this.BottomBorderWidth = 0;
        }
        TableWidget.prototype._getHTML = function () {
            var innerHtml = "";
            for (var _i = 0, _a = this.ChildWidgets; _i < _a.length; _i++) {
                var child = _a[_i];
                innerHtml += child._getHTML();
            }
            return innerHtml;
        };
        TableWidget.prototype._render = function (page) {
            var backgroundContainer = document.getElementById(page.Id + "_background");
            if (this.CurrentNode.TableFormat.CellSpacing > 0) {
                var context = backgroundContainer.getContext("2d");
                this.RenderTableOutline(context);
            }
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var widget = this.ChildWidgets[i];
                widget._render(page);
            }
        };
        TableWidget.prototype._renderCanvas = function (canvas) {
            if (this.CurrentNode.TableFormat.CellSpacing > 0) {
                var context = canvas.getContext("2d");
                this.RenderTableOutline(context);
            }
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var widget = this.ChildWidgets[i];
                widget._renderCanvas(canvas);
            }
        };
        TableWidget.prototype.UpdateHeight = function (viewer) {
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var rowWidget = this.ChildWidgets[i];
                rowWidget.UpdateHeight(viewer, true);
            }
        };
        TableWidget.prototype.ShiftChildLocation = function (shiftTop) {
            this.Y = this.Y + shiftTop;
            for (var i = 0; i < this.ChildWidgets.Count; i++) {
                this.ChildWidgets[i].ShiftChildLocation(shiftTop);
            }
        };
        TableWidget.prototype.GetSplittedWidget = function (bottom) {
            var rowBottom = this.Y;
            var splittedWidget = null;
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var rowWidget = this.ChildWidgets[i];
                var rowHeight = rowWidget.Height;
                if (bottom < rowBottom + rowHeight || splittedWidget != null) {
                    var splittedRow = (splittedWidget == null && rowWidget.IsFirstLineFit(bottom)) ? rowWidget.GetSplittedWidget(bottom) : rowWidget;
                    if (splittedRow != null) {
                        if (i == 0 && splittedRow == rowWidget)
                            return this;
                        if (this.ChildWidgets.Contains(splittedRow)) {
                            this.ChildWidgets.RemoveAt(this.ChildWidgets.indexOf(splittedRow));
                            i--;
                            this.Height -= splittedRow.Height;
                        }
                        else
                            this.Height -= rowHeight - rowWidget.Height;
                        if (splittedWidget == null) {
                            splittedWidget = new TableWidget(this.Table);
                            splittedWidget.UpdateWidgetLocation(this);
                            this.Table.TableWidgets.push(splittedWidget);
                            splittedWidget.Height = splittedRow.Height;
                        }
                        else
                            splittedWidget.Height += splittedRow.Height;
                        splittedWidget.ChildWidgets.push(splittedRow);
                        splittedRow.ContainerWidget = splittedWidget;
                    }
                }
                rowBottom += rowWidget.Height;
            }
            return splittedWidget;
        };
        TableWidget.prototype.IsFirstLineFit = function (bottom) {
            return this.ChildWidgets[0].IsFirstLineFit(bottom);
        };
        TableWidget.prototype.UpdateChildLocation = function (top) {
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var rowWidget = this.ChildWidgets[i];
                rowWidget.X = rowWidget.X;
                rowWidget.Y = top;
                rowWidget.UpdateChildLocation(top);
                top += rowWidget.Height;
            }
        };
        TableWidget.prototype.GetLineWidget = function (point) {
            var lineWidget = null;
            for (var i = 0; i < this.ChildWidgets.Count; i++) {
                if (this.ChildWidgets[i].Y <= point.Y) {
                    lineWidget = this.ChildWidgets[i].GetLineWidget(point);
                    var cellWidget = null;
                    if (lineWidget != null)
                        cellWidget = lineWidget.CurrentParagraphWidget.ContainerWidget;
                    var cellSpacing = 0;
                    var rowSpan = 0;
                    if (cellWidget != null) {
                        cellSpacing = cellWidget.TableCell.OwnerTable.TableFormat.CellSpacing;
                        rowSpan = cellWidget.TableCell.CellFormat.RowSpan;
                    }
                    var leftCellSpacing = 0;
                    var rightCellSpacing = 0;
                    var topCellSpacing = 0;
                    var bottomCellSpacing = 0;
                    if (cellSpacing > 0) {
                        leftCellSpacing = cellWidget.TableCell.CellIndex == 0 ? cellSpacing : cellSpacing / 2;
                        rightCellSpacing = cellWidget.TableCell.CellIndex == cellWidget.TableCell.OwnerRow.Cells.Count - 1 ? cellSpacing : cellSpacing / 2;
                        var rowWidget = cellWidget.ContainerWidget;
                        var tableWidget = cellWidget.ContainerWidget.ContainerWidget;
                        if (rowWidget != null && tableWidget != null && tableWidget.Table.TableWidgets.Count > 0) {
                            topCellSpacing = cellWidget.TableCell.OwnerRow.RowIndex == 0 ? cellSpacing : cellSpacing / 2;
                            if (cellWidget.TableCell.OwnerRow.RowIndex + rowSpan == cellWidget.TableCell.OwnerTable.Rows.Count)
                                bottomCellSpacing = cellSpacing;
                            else
                                bottomCellSpacing = cellSpacing / 2;
                        }
                    }
                    if ((lineWidget != null && lineWidget.CurrentParagraphWidget.X <= point.X && lineWidget.CurrentParagraphWidget.X + lineWidget.Width >= point.X
                        && lineWidget.CurrentParagraphWidget.Y <= point.Y && lineWidget.GetTop() + lineWidget.Height >= point.Y)
                        || (cellWidget != null && cellWidget.X - cellWidget.Margin.Left - leftCellSpacing <= point.X && cellWidget.X + cellWidget.Width + cellWidget.Margin.Right + rightCellSpacing >= point.X
                            && cellWidget.Y - cellWidget.Margin.Top - topCellSpacing <= point.Y && cellWidget.Y + cellWidget.Height + cellWidget.Margin.Bottom + bottomCellSpacing >= point.Y))
                        break;
                }
            }
            return lineWidget;
        };
        TableWidget.prototype.RenderTableOutline = function (context) {
            var table = this.CurrentNode;
            var border = table.TableFormat.Borders.GetTableTopBorder();
            var lineWidth = 0;
            if (border != null) {
                lineWidth = border.GetLineWidth();
                this.RenderSingleBorder(context, border, this.X - this.Margin.Left - lineWidth / 2, this.Y, this.X - this.Margin.Left - lineWidth / 2, this.Y + this.Height, lineWidth);
            }
            border = table.TableFormat.Borders.GetTableTopBorder();
            lineWidth = 0;
            if (border != null) {
                lineWidth = border.GetLineWidth();
                this.RenderSingleBorder(context, border, this.X - this.Margin.Left - lineWidth, this.Y - lineWidth / 2, this.X + this.Width + lineWidth + this.Margin.Right, this.Y - lineWidth / 2, lineWidth);
            }
            border = table.TableFormat.Borders.GetTableRightBorder();
            lineWidth = 0;
            if (border != null) {
                lineWidth = border.GetLineWidth();
                this.RenderSingleBorder(context, border, this.X + this.Width + this.Margin.Right + lineWidth / 2, this.Y, this.X + this.Width + this.Margin.Right + lineWidth / 2, this.Y + this.Height, lineWidth);
            }
            border = table.TableFormat.Borders.GetTableBottomBorder();
            lineWidth = 0;
            if (border != null) {
                lineWidth = border.GetLineWidth();
                this.RenderSingleBorder(context, border, this.X - this.Margin.Left - lineWidth, this.Y + this.Height - lineWidth / 2, this.X + this.Width + lineWidth + this.Margin.Right, this.Y + this.Height - lineWidth / 2, lineWidth);
            }
        };
        TableWidget.prototype.RemoveWidget = function (viewer) {
            for (var i = 0; i < this.ChildWidgets.Count; i++) {
                this.ChildWidgets[i].RemoveWidget(viewer);
            }
        };
        TableWidget.prototype.Dispose = function () {
            var height = this.Height;
            if (this.ChildWidgets != null) {
                for (var i = 0; i < this.ChildWidgets.Count; i++) {
                    var widget = this.ChildWidgets[i];
                    widget.Dispose();
                    if (this.ChildWidgets == null)
                        break;
                    this.ChildWidgets.Remove(widget);
                    i--;
                }
                this.ChildWidgets = null;
            }
            if (this.Table != null) {
                if (this.Table.TableWidgets != null) {
                    this.Table.TableWidgets.Remove(this);
                }
                this.Table = null;
            }
            if (this.ContainerWidget != null) {
                if (this.ContainerWidget.ChildWidgets != null) {
                    this.ContainerWidget.ChildWidgets.Remove(this);
                    this.ContainerWidget.Height -= height;
                    if ((this.ContainerWidget.ChildWidgets == null || this.ContainerWidget.ChildWidgets.Count == 0)
                        && this.ContainerWidget instanceof BodyWidget)
                        this.ContainerWidget.Dispose();
                }
                this.ContainerWidget = null;
            }
        };
        return TableWidget;
    }(Widget));
    DocumentEditorFeatures.TableWidget = TableWidget;
    var TableRowWidget = (function (_super) {
        __extends(TableRowWidget, _super);
        function TableRowWidget(node) {
            _super.call(this);
            this.CurrentNode = node;
            this.TableRow = node;
            this.TopBorderWidth = 0;
            this.BottomBorderWidth = 0;
        }
        TableRowWidget.prototype._getHTML = function () {
            var innerHtml = "";
            for (var _i = 0, _a = this.ChildWidgets; _i < _a.length; _i++) {
                var child = _a[_i];
                innerHtml += child._getHTML();
            }
            return innerHtml;
        };
        TableRowWidget.prototype._render = function (page) {
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var widget = this.ChildWidgets[i];
                widget._render(page);
            }
        };
        TableRowWidget.prototype._renderCanvas = function (canvas) {
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var widget = this.ChildWidgets[i];
                widget._renderCanvas(canvas);
            }
        };
        TableRowWidget.prototype.splitSpannedCellWidget = function (cellWidget, viewer) {
            var splittedCell = cellWidget.GetSplittedWidget(viewer.ClientArea.Bottom, false);
            if (splittedCell != null)
                viewer.SplittedCellWidgets.push(splittedCell);
        };
        TableRowWidget.prototype.UpdateHeight = function (viewer, isUpdateVerticalPosition) {
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var cellspacing = 0;
                var cellWidget = this.ChildWidgets[i];
                var rowSpan = 1;
                rowSpan = cellWidget.TableCell.CellFormat.RowSpan;
                cellspacing = cellWidget.TableCell.OwnerTable.TableFormat.CellSpacing;
                if (rowSpan > 1) {
                    var currentRowWidgetIndex = this.ContainerWidget.ChildWidgets.indexOf(this);
                    var rowSpanWidgetEndIndex = currentRowWidgetIndex + rowSpan - 1 - (this.TableRow.RowIndex - cellWidget.TableCell.OwnerRow.RowIndex);
                    if (viewer.ClientArea.Bottom < cellWidget.Y + cellWidget.Height + cellWidget.Margin.Bottom
                        || rowSpanWidgetEndIndex >= currentRowWidgetIndex + 1)
                        this.splitSpannedCellWidget(cellWidget, viewer);
                    var spanEndRowWidget = this;
                    if (rowSpanWidgetEndIndex > 0) {
                        if (rowSpanWidgetEndIndex < this.ContainerWidget.ChildWidgets.length)
                            spanEndRowWidget = this.ContainerWidget.ChildWidgets[rowSpanWidgetEndIndex];
                        else
                            spanEndRowWidget = this.ContainerWidget.ChildWidgets[this.ContainerWidget.ChildWidgets.length - 1];
                    }
                    if (cellWidget.Y + cellWidget.Height + cellWidget.Margin.Bottom < spanEndRowWidget.Y + spanEndRowWidget.Height)
                        cellWidget.Height = spanEndRowWidget.Y + spanEndRowWidget.Height - cellWidget.Y - cellWidget.Margin.Bottom;
                    else if (this.ContainerWidget.ContainerWidget != null && cellWidget.Y + cellWidget.Height + cellWidget.Margin.Bottom > spanEndRowWidget.Y + spanEndRowWidget.Height) {
                        spanEndRowWidget.Height = cellWidget.Y + cellWidget.Height + cellWidget.Margin.Bottom - spanEndRowWidget.Y;
                        if (this == spanEndRowWidget && this.TableRow.NextNode instanceof TableRowAdv) {
                            var nextrow = this.TableRow.NextNode;
                            if (nextrow.TableRowWidgets.length > 0) {
                                nextrow.TableRowWidgets[0].X = nextrow.TableRowWidgets[0].X;
                                nextrow.TableRowWidgets[0].Y = this.Y + this.Height;
                            }
                        }
                    }
                }
                else {
                    if (cellspacing > 0) {
                        if (this.TableRow.OwnerTable.TableWidgets.Count > 1 && this.Y == this.TableRow.OwnerTable.Document.OwnerControl.Viewer.ClientArea.Y && viewer instanceof PageLayoutViewer)
                            cellspacing = cellspacing / 2;
                    }
                    cellWidget.Height = this.Height - cellWidget.Margin.Top - cellWidget.Margin.Bottom - cellspacing;
                }
                cellWidget.UpdateHeight(viewer);
                var widget = this.ContainerWidget;
                while (widget.ContainerWidget instanceof Widget) {
                    widget = widget.ContainerWidget;
                }
                var page = null;
                if (widget instanceof BodyWidget)
                    page = widget.Page;
                if (((viewer instanceof PageLayoutViewer) && viewer.VisiblePages.Contains(page)) || isUpdateVerticalPosition) {
                    cellWidget.UpdateCellVerticalPosition(false, false);
                }
            }
        };
        TableRowWidget.prototype.GetSplittedWidget = function (bottom) {
            var splittedWidget = null;
            var rowIndex = this.TableRow.RowIndex;
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var cellWidget = this.ChildWidgets[i];
                var splittedCell = cellWidget.GetSplittedWidget(bottom, true);
                if (splittedCell != null) {
                    if (splittedCell == cellWidget)
                        return this;
                    if (this.ChildWidgets.Contains(splittedCell))
                        this.ChildWidgets.Remove(splittedCell);
                    if (i == 0 || this.Height < cellWidget.Height + cellWidget.Margin.Top + cellWidget.Margin.Bottom)
                        this.Height = cellWidget.Height + cellWidget.Margin.Top + cellWidget.Margin.Bottom;
                    if (splittedWidget == null) {
                        splittedWidget = new TableRowWidget(this.TableRow);
                        splittedWidget.UpdateWidgetLocation(this);
                        this.TableRow.TableRowWidgets.push(splittedWidget);
                        splittedWidget.Height = 0;
                    }
                    var rowSpan = 1;
                    rowSpan = splittedCell.TableCell.CellFormat.RowSpan;
                    if (rowIndex - splittedCell.TableCell.OwnerRow.RowIndex == rowSpan - 1
                        && splittedWidget.Height < splittedCell.Height + splittedCell.Margin.Top + splittedCell.Margin.Bottom)
                        splittedWidget.Height = splittedCell.Height + splittedCell.Margin.Top + splittedCell.Margin.Bottom;
                    splittedWidget.ChildWidgets.Add(splittedCell);
                    splittedCell.ContainerWidget = splittedWidget;
                }
            }
            return splittedWidget;
        };
        TableRowWidget.prototype.IsFirstLineFit = function (bottom) {
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var cellWidget = this.ChildWidgets[i];
                if (!cellWidget.IsFirstLineFit(bottom))
                    return false;
            }
            return true;
        };
        TableRowWidget.prototype.InsertSplittedCellWidgets = function (viewer) {
            var left = this.X;
            var tableWidth = 0;
            tableWidth = this.TableRow.OwnerTable.TableWidth;
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var cellWidget = this.ChildWidgets[i];
                if (Math.round(left) < Math.round(cellWidget.X - cellWidget.Margin.Left)) {
                    if (this.InsertRowSpannedWidget(viewer, left, i)) {
                        i--;
                        continue;
                    }
                    var count = this.ChildWidgets.length;
                    this.InsertEmptySplittedCellWidget(left, i);
                    if (count < this.ChildWidgets.length) {
                        i--;
                        continue;
                    }
                }
                left += cellWidget.Margin.Left + cellWidget.Width + cellWidget.Margin.Right;
                if (i == this.ChildWidgets.length - 1 && Math.round(left) < Math.round(this.X + tableWidth)) {
                    if (this.InsertRowSpannedWidget(viewer, left, i + 1))
                        continue;
                    this.InsertEmptySplittedCellWidget(left, i + 1);
                    continue;
                }
                if ((this.ChildWidgets == null || this.ChildWidgets.Count == 0) && viewer.SplittedCellWidgets.Count > 0) {
                    for (var i_2 = 0; i_2 < viewer.SplittedCellWidgets.Count; i_2++) {
                        var cellWidget_1 = viewer.SplittedCellWidgets[i_2];
                        if (Math.round(left) <= Math.round(cellWidget_1.X - cellWidget_1.Margin.Left)) {
                            if (this.InsertRowSpannedWidget(viewer, left, i_2)) {
                                i_2--;
                                continue;
                            }
                            var count = this.ChildWidgets.Count;
                            this.InsertEmptySplittedCellWidget(left, i_2);
                            if (count < this.ChildWidgets.Count) {
                                i_2--;
                                continue;
                            }
                        }
                        left += cellWidget_1.Margin.Left + cellWidget_1.Width + cellWidget_1.Margin.Right;
                        if (i_2 == this.ChildWidgets.Count - 1 && Math.round(left) < Math.round(this.X + tableWidth)) {
                            if (this.InsertRowSpannedWidget(viewer, left, i_2 + 1))
                                continue;
                            this.InsertEmptySplittedCellWidget(left, i_2 + 1);
                            continue;
                        }
                    }
                }
                if (viewer.SplittedCellWidgets.Count > 0)
                    viewer.SplittedCellWidgets.Clear();
            }
        };
        TableRowWidget.prototype.InsertRowSpannedWidget = function (viewer, left, index) {
            for (var i = 0; i < viewer.SplittedCellWidgets.length; i++) {
                var splittedCell = viewer.SplittedCellWidgets[i];
                if (Math.round(left) == Math.round(splittedCell.X - splittedCell.Margin.Left)) {
                    this.ChildWidgets.Insert(index, splittedCell);
                    splittedCell.ContainerWidget = this;
                    viewer.SplittedCellWidgets.Remove(splittedCell);
                    return true;
                }
            }
            return false;
        };
        TableRowWidget.prototype.InsertEmptySplittedCellWidget = function (left, index) {
            var tableWidget = this.TableRow.OwnerTable.TableWidgets[this.TableRow.OwnerTable.TableWidgets.length - 1];
            for (var i = tableWidget.ChildWidgets.length - 1; i >= 0; i--) {
                var rowWidget = tableWidget.ChildWidgets[i];
                var previousLeft = rowWidget.X;
                for (var j = 0; j < rowWidget.ChildWidgets.length; j++) {
                    var rowSpan = 1;
                    var cellWidget = rowWidget.ChildWidgets[j];
                    if (Math.round(left) == Math.round(previousLeft)) {
                        rowSpan = cellWidget.TableCell.CellFormat.RowSpan;
                        if (rowSpan > 1) {
                            var emptyCellWidget = cellWidget.CreateCellWidget();
                            this.ChildWidgets.Insert(index, emptyCellWidget);
                            emptyCellWidget.ContainerWidget = this;
                        }
                        return;
                    }
                    previousLeft += cellWidget.Margin.Left + cellWidget.Width + cellWidget.Margin.Right;
                }
            }
        };
        TableRowWidget.prototype.UpdateChildLocation = function (top) {
            var spacing = 0;
            if (this.TableRow.OwnerTable.TableFormat.CellSpacing > 0)
                spacing = this.TableRow.OwnerTable.TableFormat.CellSpacing;
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var cellWidget = this.ChildWidgets[i];
                cellWidget.X = cellWidget.X;
                cellWidget.Y = top + cellWidget.Margin.Top + spacing;
                cellWidget.UpdateChildLocation(cellWidget.Y);
            }
        };
        TableRowWidget.prototype.ShiftChildLocation = function (shiftTop) {
            this.Y = this.Y + shiftTop;
            for (var i = 0; i < this.ChildWidgets.Count; i++) {
                this.ChildWidgets[i].ShiftChildLocation(shiftTop);
            }
        };
        TableRowWidget.prototype.GetLineWidget = function (point) {
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var cellSpacing = 0;
                cellSpacing = this.TableRow.OwnerTable.TableFormat.CellSpacing;
                var leftCellSpacing = 0;
                var rightCellSpacing = 0;
                if (cellSpacing > 0) {
                    leftCellSpacing = this.ChildWidgets[i].TableCell.ColumnIndex == 0 ? cellSpacing : cellSpacing / 2;
                    rightCellSpacing = this.ChildWidgets[i].TableCell.CellIndex == this.ChildWidgets[i].TableCell.OwnerRow.Cells.Count - 1 ? cellSpacing : cellSpacing / 2;
                }
                if (this.ChildWidgets[i].X - this.ChildWidgets[i].Margin.Left - leftCellSpacing <= point.X
                    && (this.ChildWidgets[i].X + this.ChildWidgets[i].Width) + this.ChildWidgets[i].Margin.Right + rightCellSpacing >= point.X)
                    return this.ChildWidgets[i].GetLineWidget(point);
            }
            var lineWidget = null;
            if (this.ChildWidgets.length > 0) {
                if (this.ChildWidgets[0].X <= point.X)
                    lineWidget = this.ChildWidgets[this.ChildWidgets.length - 1].GetLineWidget(point);
                else
                    lineWidget = this.ChildWidgets[0].GetLineWidget(point);
            }
            return lineWidget;
        };
        TableRowWidget.prototype.RemoveWidget = function (viewer) {
            for (var i = 0; i < this.ChildWidgets.Count; i++) {
                this.ChildWidgets[i].RemoveWidget(viewer);
            }
        };
        TableRowWidget.prototype.Dispose = function () {
            var height = this.Height;
            if (this.ChildWidgets != null) {
                for (var i = 0; i < this.ChildWidgets.Count; i++) {
                    var widget = this.ChildWidgets[i];
                    widget.Dispose();
                    if (this.ChildWidgets == null)
                        break;
                    this.ChildWidgets.Remove(widget);
                    i--;
                }
                this.ChildWidgets = null;
            }
            if (this.TableRow != null) {
                if (this.TableRow.TableRowWidgets != null)
                    this.TableRow.TableRowWidgets.Remove(this);
                this.TableRow = null;
            }
            if (this.ContainerWidget != null) {
                if (this.ContainerWidget.ChildWidgets != null) {
                    this.ContainerWidget.ChildWidgets.Remove(this);
                    if ((this.ContainerWidget.ChildWidgets == null || this.ContainerWidget.ChildWidgets.Count == 0)
                        && this.ContainerWidget instanceof TableWidget)
                        this.ContainerWidget.Dispose();
                    else if (this.ContainerWidget.ContainerWidget instanceof BodyWidget)
                        this.ContainerWidget.ContainerWidget.Height -= height;
                    this.ContainerWidget.Height -= height;
                }
                this.ContainerWidget = null;
            }
        };
        return TableRowWidget;
    }(Widget));
    DocumentEditorFeatures.TableRowWidget = TableRowWidget;
    var TableCellWidget = (function (_super) {
        __extends(TableCellWidget, _super);
        function TableCellWidget(node) {
            _super.call(this);
            this.leftMargin = 0;
            this.topMargin = 0;
            this.rightMargin = 0;
            this.bottomMargin = 0;
            this.TableCell = node;
            this.CurrentNode = node;
            this.Margin = new Margin(this.leftMargin, this.topMargin, this.rightMargin, this.bottomMargin);
            this.LeftBorderWidth = 0;
            this.RightBorderWidth = 0;
        }
        TableCellWidget.prototype._getHTML = function () {
            var innerHtml = "";
            for (var _i = 0, _a = this.ChildWidgets; _i < _a.length; _i++) {
                var child = _a[_i];
                innerHtml += child._getHTML();
            }
            return innerHtml;
        };
        TableCellWidget.prototype._render = function (page) {
            var widgetHeight = 0;
            var backgroundCanvas = document.getElementById(page.Id + "_background");
            var backgroundContext = backgroundCanvas.getContext("2d");
            this.RenderTableCellOutline(backgroundContext);
            var selectionCanvas = document.getElementById(page.Id + "_selection");
            var selectionContext = selectionCanvas.getContext("2d");
            if (page.Viewer.OwnerControl.Selection.SelectionRanges.Count > 0)
                page.Viewer.OwnerControl.Selection.SelectionRanges.AddSelectionHighlightTable(selectionContext, this);
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var widget = this.ChildWidgets[i];
                widget._render(page);
            }
        };
        TableCellWidget.prototype._renderCanvas = function (canvas) {
            var context = canvas.getContext("2d");
            this.RenderTableCellOutline(context);
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var widget = this.ChildWidgets[i];
                widget._renderCanvas(canvas);
            }
        };
        TableCellWidget.prototype.ShiftChildLocation = function (shiftTop) {
            this.Y = this.Y + shiftTop;
            for (var i = 0; i < this.ChildWidgets.Count; i++) {
                if (this.ChildWidgets[i] instanceof ParagraphWidget) {
                    this.ChildWidgets[i].X = this.ChildWidgets[i].X;
                    this.ChildWidgets[i].Y = this.ChildWidgets[i].Y + shiftTop;
                }
                else {
                    this.ChildWidgets[i].ShiftChildLocation(shiftTop);
                }
            }
        };
        TableCellWidget.prototype.GetSplittedWidget = function (bottom, splitMinimalWidget) {
            var splittedWidget = null;
            if (this.Y + this.Height > bottom - this.Margin.Bottom) {
                for (var i = 0; i < this.ChildWidgets.length; i++) {
                    if (this.ChildWidgets[i] instanceof ParagraphWidget) {
                        var paragraphWidget = this.ChildWidgets[i];
                        var splittedPara = paragraphWidget.GetSplittedWidget(bottom - this.Margin.Bottom);
                        if (splittedPara != null) {
                            if (i == 0 && splittedPara == paragraphWidget)
                                return this;
                            if (this.ChildWidgets.Contains(splittedPara)) {
                                this.ChildWidgets.Remove(splittedPara);
                                i--;
                            }
                            this.Height -= splittedPara.Height;
                            if (splittedWidget == null) {
                                splittedWidget = this.CreateCellWidget();
                            }
                            splittedWidget.Height += splittedPara.Height;
                            splittedWidget.ChildWidgets.Add(splittedPara);
                            splittedPara.ContainerWidget = splittedWidget;
                        }
                    }
                    else {
                        var tableWidget = this.ChildWidgets[i];
                        if (bottom - this.Margin.Bottom < tableWidget.Y + tableWidget.Height) {
                            var tableHeight = tableWidget.Height;
                            var splittedTable = tableWidget.GetSplittedWidget(bottom - this.Margin.Bottom);
                            if (splittedTable != null) {
                                if (i == 0 && splittedTable == tableWidget)
                                    return this;
                                if (this.ChildWidgets.Contains(splittedTable)) {
                                    this.ChildWidgets.Remove(splittedTable);
                                    i--;
                                    this.Height -= splittedTable.Height;
                                }
                                else
                                    this.Height -= tableHeight - tableWidget.Height;
                                if (splittedWidget == null) {
                                    splittedWidget = this.CreateCellWidget();
                                }
                                splittedWidget.Height += splittedTable.Height;
                                splittedWidget.ChildWidgets.push(splittedTable);
                                splittedTable.ContainerWidget = splittedWidget;
                            }
                        }
                    }
                }
            }
            if (splittedWidget == null && splitMinimalWidget) {
                if (this.ChildWidgets.length == 0)
                    this.Height = 0;
                splittedWidget = this.CreateCellWidget();
            }
            return splittedWidget;
        };
        TableCellWidget.prototype.CreateCellWidget = function () {
            var cellWidget = new TableCellWidget(this.TableCell);
            cellWidget.UpdateWidgetLocation(this);
            this.TableCell.TableCellWidgets.push(cellWidget);
            cellWidget.Margin = this.Margin;
            cellWidget.LeftBorderWidth = this.LeftBorderWidth;
            cellWidget.RightBorderWidth = this.RightBorderWidth;
            return cellWidget;
        };
        TableCellWidget.prototype.IsFirstLineFit = function (bottom) {
            if (this.ChildWidgets.length == 0)
                return true;
            if (this.ChildWidgets[0] instanceof ParagraphWidget) {
                var paraWidget = this.ChildWidgets[0];
                return paraWidget.IsFirstLineFit(bottom - this.Margin.Bottom);
            }
            else {
                var tableWidget = this.ChildWidgets[0];
                return tableWidget.IsFirstLineFit(bottom - this.Margin.Bottom);
            }
        };
        TableCellWidget.prototype.UpdateHeight = function (viewer) {
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                if (this.ChildWidgets[i] instanceof TableWidget)
                    this.ChildWidgets[i].UpdateHeight(viewer);
            }
        };
        TableCellWidget.prototype.UpdateChildLocation = function (top) {
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                this.ChildWidgets[i].X = this.ChildWidgets[i].X;
                this.ChildWidgets[i].Y = top;
                if (this.ChildWidgets[i] instanceof TableWidget)
                    this.ChildWidgets[i].UpdateChildLocation(top);
                top += this.ChildWidgets[i].Height;
            }
        };
        TableCellWidget.prototype.GetLineWidget = function (point) {
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                if (this.ChildWidgets[i].Y <= point.Y
                    && (this.ChildWidgets[i].Y + this.ChildWidgets[i].Height) >= point.Y)
                    return this.ChildWidgets[i].GetLineWidget(point);
            }
            var lineWidget = null;
            if (this.ChildWidgets.length > 0) {
                if (this.ChildWidgets[0].Y <= point.Y)
                    lineWidget = this.ChildWidgets[this.ChildWidgets.length - 1].GetLineWidget(point);
                else
                    lineWidget = this.ChildWidgets[0].GetLineWidget(point);
            }
            return lineWidget;
        };
        TableCellWidget.prototype.UpdateCellVerticalPosition = function (isUpdateToTop, isInsideTable) {
            if (this.TableCell.OwnerTable.Owner instanceof SectionAdv || isInsideTable) {
                var displacement = this.GetDisplacement(isUpdateToTop);
                this.UpdateCellContentVerticalPosition(displacement, isUpdateToTop);
            }
        };
        TableCellWidget.prototype.GetDisplacement = function (isUpdateToTop) {
            var rowHeight = 0;
            var rowWidget = this.ContainerWidget;
            var padding = this.Margin.Top + this.Margin.Bottom;
            if (this.TableCell.CellFormat.RowSpan > 1)
                rowHeight = this.Height;
            else
                rowHeight = (rowWidget.Height - padding);
            var cellContentHeight = this.GetCellContentHeight();
            var displacement = 0;
            if (rowHeight > cellContentHeight) {
                displacement = rowHeight - cellContentHeight;
                if (this.TableCell.CellFormat.VerticalAlignment == CellVerticalAlignment.Center)
                    displacement = displacement / 2;
                else if ((this.TableCell.CellFormat.VerticalAlignment == CellVerticalAlignment.Top || isUpdateToTop))
                    displacement = 0;
            }
            return displacement;
        };
        TableCellWidget.prototype.GetCellContentHeight = function () {
            var contentHeight = 0;
            for (var i = 0; i < this.ChildWidgets.Count; i++) {
                if (this.ChildWidgets[i] instanceof ParagraphWidget)
                    contentHeight += this.ChildWidgets[i].Height;
                else if (this.ChildWidgets[i] instanceof TableWidget)
                    contentHeight += this.ChildWidgets[i].Height;
            }
            return contentHeight;
        };
        TableCellWidget.prototype.UpdateCellContentVerticalPosition = function (displacement, isUpdateToTop) {
            if (displacement == 0)
                return;
            var location = this.Y + displacement;
            for (var i = 0; i < this.ChildWidgets.Count; i++) {
                if (this.ChildWidgets[i] instanceof ParagraphWidget)
                    this.ChildWidgets[i].Y = location;
                else if (this.ChildWidgets[i] instanceof TableWidget)
                    location = this.UpdateTableWidgetLocation(this.ChildWidgets[i], location, isUpdateToTop);
                location = location + this.ChildWidgets[i].Height;
            }
        };
        TableCellWidget.prototype.UpdateTableWidgetLocation = function (tableWidget, location, isUpdateToTop) {
            tableWidget.Y = location = location + tableWidget.TopBorderWidth;
            var cellSpacing = 0;
            for (var i = 0; i < tableWidget.ChildWidgets.Count; i++) {
                var rowWidget = tableWidget.ChildWidgets[i];
                rowWidget.Y = location;
                for (var j = 0; j < rowWidget.ChildWidgets.Count; j++) {
                    var cellWidget = rowWidget.ChildWidgets[j];
                    cellWidget.Y = location;
                    cellWidget.UpdateCellVerticalPosition(isUpdateToTop, true);
                }
                location = location + rowWidget.Height;
            }
            return location;
        };
        TableCellWidget.prototype.RenderTableCellOutline = function (context) {
            var borders = null;
            var TableCell = this.TableCell;
            var cellTopMargin = 0;
            var cellBottomMargin = 0;
            var cellLeftMargin = 0, cellRightMargin = 0, height = 0;
            borders = TableCell.CellFormat.Borders;
            cellBottomMargin = TableCell.BottomMargin;
            cellTopMargin = TableCell.TopMargin;
            cellLeftMargin = TableCell.LeftMargin;
            cellRightMargin = TableCell.RightMargin;
            if (TableCell.OwnerRow != null && TableCell.OwnerRow.RowFormat.HeightType == HeightType.Exactly)
                height = TableCell.OwnerRow.RowFormat.Height + cellTopMargin + cellBottomMargin;
            else {
                if (TableCell.OwnerRow != null && TableCell.OwnerRow.TableRowWidgets.Count <= 1) {
                    height = Math.max(TableCell.OwnerRow.RowFormat.Height, this.Height) + cellTopMargin + cellBottomMargin;
                }
                else
                    height = this.Height + cellTopMargin + cellBottomMargin;
            }
            var border = borders.GetCellLeftBorder(TableCell);
            var lineWidth = 0;
            if (border != null) {
                lineWidth = border.GetLineWidth();
                this.RenderSingleBorder(context, border, this.X - cellLeftMargin - lineWidth / 2, this.Y - cellTopMargin, this.X - cellLeftMargin - lineWidth / 2, this.Y + this.Height + cellBottomMargin, lineWidth);
            }
            border = borders.GetCellTopBorder(TableCell);
            if (border != null) {
                lineWidth = border.GetLineWidth();
                this.RenderSingleBorder(context, border, this.X - this.Margin.Left, this.Y - this.Margin.Top + lineWidth / 2, this.X + this.Width + this.Margin.Right, this.Y - this.Margin.Top + lineWidth / 2, lineWidth);
            }
            if (TableCell.OwnerTable.TableFormat.CellSpacing > 0 || TableCell.CellIndex == TableCell.OwnerRow.Cells.Count - 1) {
                border = borders.GetCellRightBorder(TableCell);
                if (border != null) {
                    lineWidth = border.GetLineWidth();
                    this.RenderSingleBorder(context, border, this.X + this.Width + this.Margin.Right - lineWidth / 2, this.Y - cellTopMargin, this.X + this.Width + this.Margin.Right - lineWidth / 2, this.Y + this.Height + cellBottomMargin, lineWidth);
                }
            }
            var nextRow = TableCell.OwnerRow.NextNode;
            var nextRowIsInCurrentTableWidget = false;
            if (nextRow != null) {
                var nextRowWidget = null;
                if (nextRow.TableRowWidgets != null && nextRow.TableRowWidgets.Count > 0)
                    nextRowWidget = nextRow.TableRowWidgets[0];
                if (nextRowWidget instanceof TableRowWidget) {
                    if (this.ContainerWidget instanceof TableRowWidget && this.ContainerWidget instanceof TableWidget)
                        nextRowIsInCurrentTableWidget = this.ContainerWidget.ChildWidgets.Contains(nextRowWidget);
                }
            }
            if (TableCell.OwnerTable.TableFormat.CellSpacing > 0 || TableCell.OwnerRow.RowIndex == TableCell.OwnerTable.Rows.Count - 1 ||
                (TableCell.CellFormat.RowSpan > 1 && TableCell.OwnerRow.RowIndex + TableCell.CellFormat.RowSpan == TableCell.OwnerTable.Rows.Count) ||
                !nextRowIsInCurrentTableWidget) {
                border = (TableCell.CellFormat.RowSpan > 1 && TableCell.OwnerRow.RowIndex + TableCell.CellFormat.RowSpan == TableCell.OwnerTable.Rows.Count) ?
                    borders.GetBorderBasedOnPriority(TableCell.CellFormat.Borders.Bottom, TableCell.OwnerTable.TableFormat.Borders.GetCellBottomBorder(TableCell))
                    : borders.GetCellBottomBorder(TableCell);
                if (border != null) {
                    lineWidth = border.GetLineWidth();
                    this.RenderSingleBorder(context, border, this.X - this.Margin.Left, this.Y + this.Height + cellBottomMargin + lineWidth / 2, this.X + this.Width + this.Margin.Right, this.Y + this.Height + cellBottomMargin + lineWidth / 2, lineWidth);
                }
            }
            border = borders.GetCellDiagonalUpBorder(TableCell);
            if (border != null) {
                lineWidth = border.GetLineWidth();
                if (lineWidth > 0)
                    this.RenderSingleBorder(context, border, this.X - cellLeftMargin, this.Y + this.Height + cellBottomMargin, this.X + this.Width + cellRightMargin, this.Y - cellTopMargin, lineWidth);
            }
            border = borders.GetCellDiagonalDownBorder(TableCell);
            if (border != null) {
                lineWidth = border.GetLineWidth();
                if (lineWidth > 0)
                    this.RenderSingleBorder(context, border, this.X - cellLeftMargin, this.Y - cellTopMargin, this.X + this.Width + cellRightMargin, this.Y + this.Height + cellBottomMargin, lineWidth);
            }
            this.RenderCellBackground(context, height);
        };
        TableCellWidget.prototype.RenderCellBackground = function (context, height) {
            var cellFormat = this.CurrentNode.CellFormat;
            var bgColor = cellFormat.Shading.BackgroundColor;
            if (bgColor) {
                context.fillStyle = bgColor;
                context.fillRect(this.X - this.Margin.Left + this.LeftBorderWidth, this.Y - this.TableCell.TopMargin, this.Width + this.Margin.Left + this.Margin.Right - this.LeftBorderWidth - this.RightBorderWidth, height);
                context.fill();
            }
        };
        TableCellWidget.prototype.Highlight = function (selection, selectionRange) {
            this.ClearChildSelectionHighlight(selection.OwnerControl.Viewer);
            selection.CreateHighlightBorderInsideTable(this, selection, selectionRange);
        };
        TableCellWidget.prototype.ClearSelectionHighlight = function (viewer) {
            if (viewer == null)
                return;
            if (viewer.OwnerControl != null && viewer.OwnerControl.Selection.SelectionRanges.Count > 0) {
                viewer.OwnerControl.Selection.SelectionRanges.ClearSelectionHighlightInternal(this);
            }
        };
        TableCellWidget.prototype.RemoveWidget = function (viewer) {
            if (viewer.OwnerControl != null && viewer.OwnerControl.Selection.SelectionRanges.Count > 0)
                viewer.OwnerControl.Selection.SelectionRanges.RemoveSelectionHighlight(this);
            for (var i = 0; i < this.ChildWidgets.Count; i++) {
                this.ChildWidgets[i].RemoveWidget(viewer);
            }
        };
        TableCellWidget.prototype.Dispose = function () {
            var viewer = null;
            var page = this.GetPage();
            if (page != null)
                viewer = page.Viewer;
            if (this.ChildWidgets != null) {
                for (var i = 0; i < this.ChildWidgets.Count; i++) {
                    var widget = this.ChildWidgets[i];
                    if (widget instanceof ParagraphWidget)
                        widget.Dispose();
                    else
                        widget.Dispose();
                    if (this.ChildWidgets == null)
                        break;
                    this.ChildWidgets.Remove(widget);
                    i--;
                }
                this.ChildWidgets = null;
            }
            this.ClearSelectionHighlight(viewer);
            if (this.ContainerWidget != null) {
                if (this.ContainerWidget.ChildWidgets != null)
                    this.ContainerWidget.ChildWidgets.Remove(this);
                this.ContainerWidget = null;
            }
            if (this.TableCell != null) {
                if (this.TableCell.TableCellWidgets != null)
                    this.TableCell.TableCellWidgets.Remove(this);
                this.TableCell = null;
            }
        };
        return TableCellWidget;
    }(Widget));
    DocumentEditorFeatures.TableCellWidget = TableCellWidget;
    var ParagraphWidget = (function (_super) {
        __extends(ParagraphWidget, _super);
        function ParagraphWidget(node) {
            _super.call(this);
            this.CurrentNode = node;
        }
        ParagraphWidget.prototype._getHTML = function () {
            var innerHtml = "<p ";
            innerHtml += "style=\"";
            innerHtml += "white-space:pre-wrap;line-height:100%;";
            innerHtml += "margin:0px;";
            innerHtml += "\"";
            innerHtml += ">";
            for (var _i = 0, _a = this.ChildWidgets; _i < _a.length; _i++) {
                var child = _a[_i];
                innerHtml += child._getHTML();
            }
            innerHtml += "</p>";
            return innerHtml;
        };
        ParagraphWidget.prototype._render = function (page) {
            var top = this.Y;
            var left = this.X;
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var widget = this.ChildWidgets[i];
                widget._render(page, left, top);
                top += widget.Height;
            }
        };
        ParagraphWidget.prototype._renderCanvas = function (canvas) {
            var top = this.Y;
            var left = this.X;
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var widget = this.ChildWidgets[i];
                widget._renderCanvas(canvas, left, top);
                top += widget.Height;
            }
        };
        ParagraphWidget.prototype.IsFirstLineFit = function (bottom) {
            var lineWidget = this.ChildWidgets[0];
            if (lineWidget.CurrentParagraphWidget.ContainerWidget instanceof TableCellWidget) {
                var cellwidget = lineWidget.CurrentParagraphWidget.ContainerWidget;
                var document_1 = null;
                if (lineWidget.CurrentParagraphWidget.CurrentNode != null && cellwidget.ContainerWidget != null)
                    document_1 = lineWidget.CurrentParagraphWidget.CurrentNode.GetOwnerDocument();
                if (document_1 != null && document_1.OwnerControl != null && cellwidget.ContainerWidget.Y == document_1.OwnerControl.Viewer.ClientArea.Y && this.Y + lineWidget.Height >= bottom)
                    return true;
            }
            return (this.Y + lineWidget.Height <= bottom);
        };
        ParagraphWidget.prototype.GetSplittedWidget = function (bottom) {
            var lineBottom = this.Y;
            var splittedWidget = null;
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                var lineWidget = this.ChildWidgets[i];
                if (bottom < lineBottom + lineWidget.Height) {
                    if (i == 0) {
                        if (lineWidget.CurrentParagraphWidget.ContainerWidget instanceof TableCellWidget) {
                            if (lineWidget.CurrentParagraphWidget.ContainerWidget.Y == this.Y) {
                                lineBottom += lineWidget.Height;
                                continue;
                            }
                        }
                        splittedWidget = this;
                        break;
                    }
                    if (this.ChildWidgets.Contains(lineWidget)) {
                        this.ChildWidgets.Remove(lineWidget);
                        i--;
                    }
                    this.Height -= lineWidget.Height;
                    if (splittedWidget == null) {
                        splittedWidget = new ParagraphWidget(this.CurrentNode);
                        splittedWidget.UpdateWidgetLocation(this);
                        var paragraph = this.CurrentNode;
                        paragraph.ParagraphWidgets.push(splittedWidget);
                        splittedWidget.Height = lineWidget.Height;
                    }
                    else
                        splittedWidget.Height += lineWidget.Height;
                    splittedWidget.ChildWidgets.push(lineWidget);
                    lineWidget.CurrentParagraphWidget = splittedWidget;
                }
                lineBottom += lineWidget.Height;
            }
            return splittedWidget;
        };
        ParagraphWidget.prototype.GetLineWidget = function (point) {
            var top = this.Y;
            for (var i = 0; i < this.ChildWidgets.length; i++) {
                if (top <= point.Y
                    && (top + this.ChildWidgets[i].Height) >= point.Y) {
                    return this.ChildWidgets[i];
                }
                top += this.ChildWidgets[i].Height;
            }
            var lineWidget = null;
            if (this.ChildWidgets.length > 0) {
                if (this.Y <= point.Y)
                    lineWidget = this.ChildWidgets[this.ChildWidgets.length - 1];
                else
                    lineWidget = this.ChildWidgets[0];
            }
            return lineWidget;
        };
        ParagraphWidget.prototype.Highlight = function (selection, selectionRange, startIndex, endLine, endElement, endIndex) {
            var top = 0;
            for (var i = startIndex; i < this.ChildWidgets.length; i++) {
                var line = this.ChildWidgets[i];
                if (i == startIndex)
                    top = line.GetTop();
                var left = line.GetLeft();
                if (line == endLine) {
                    var right = endLine.GetLeftInternal(endElement, endIndex);
                    selection.CreateHighlightBorder(selectionRange, line, right - left, left, top);
                    return;
                }
                selection.CreateHighlightBorder(selectionRange, line, line.GetWidth(true) - (left - this.X), left, top);
                top += line.Height;
            }
        };
        ParagraphWidget.prototype.RemoveWidget = function (viewer) {
            for (var i = 0; i < this.ChildWidgets.Count; i++) {
                this.ChildWidgets[i].RemoveWidget(viewer);
            }
        };
        ParagraphWidget.prototype.Dispose = function () {
            var height = this.Height;
            if (this.ChildWidgets != null) {
                for (var i = 0; i < this.ChildWidgets.Count; i++) {
                    var widget = this.ChildWidgets[i];
                    widget.Dispose();
                    if (this.ChildWidgets == null)
                        break;
                    this.ChildWidgets.Remove(widget);
                    i--;
                }
                this.ChildWidgets = null;
            }
            if (this.CurrentNode != null) {
                if (this.CurrentNode.ParagraphWidgets != null)
                    this.CurrentNode.ParagraphWidgets.Remove(this);
                this.CurrentNode = null;
            }
            if (this.ContainerWidget != null) {
                this.ContainerWidget.ChildWidgets.Remove(this);
                this.ContainerWidget.Height -= height;
                if ((this.ContainerWidget.ChildWidgets == null || this.ContainerWidget.ChildWidgets.Count == 0)
                    && this.ContainerWidget instanceof BodyWidget)
                    this.ContainerWidget.Dispose();
                this.ContainerWidget = null;
            }
        };
        return ParagraphWidget;
    }(Widget));
    DocumentEditorFeatures.ParagraphWidget = ParagraphWidget;
    var LineWidget = (function () {
        function LineWidget(paragraphWidget) {
            this.X = 0;
            this.Y = 0;
            this.Width = 0;
            this.Height = 0;
            this.Children = null;
            this.CurrentParagraphWidget = paragraphWidget;
            this.Children = new List();
        }
        LineWidget.prototype._getHTML = function () {
            var innerHtml = "";
            for (var _i = 0, _a = this.Children; _i < _a.length; _i++) {
                var child = _a[_i];
                innerHtml += child._getHTML();
            }
            return innerHtml;
        };
        LineWidget.prototype._IsParagraphFirstLine = function () {
            if (this == this.CurrentParagraphWidget.ChildWidgets[0])
                return true;
            return false;
        };
        LineWidget.prototype._render = function (page, left, top) {
            var backgroundContainer = document.getElementById(page.Id + "_background");
            var foregroundContainer = document.getElementById(page.Id + "_foreground");
            var selectionContainer = document.getElementById(page.Id + "_selection");
            var inline, paraFormat;
            if (backgroundContainer == null) {
                return;
            }
            var backgroundContext = backgroundContainer.getContext("2d");
            var foregroundContext = foregroundContainer.getContext("2d");
            var selectionContext = selectionContainer.getContext("2d");
            if (page.Viewer.OwnerControl.Selection.SelectionRanges.Count > 0)
                page.Viewer.OwnerControl.Selection.SelectionRanges.AddSelectionHighlight(selectionContext, this, top);
            if (this._IsParagraphFirstLine())
                left += this.CurrentParagraphWidget.CurrentNode.ParagraphFormat.FirstLineIndent;
            for (var i = 0; i < this.Children.Count; i++) {
                var elementBox = this.Children[i];
                var underlineY = this.getUnderlineYposition();
                elementBox._render(foregroundContext, backgroundContext, left, top, underlineY);
                left += elementBox.Width + elementBox.Margin.Left;
            }
        };
        LineWidget.prototype._renderCanvas = function (canvas, left, top) {
            if (canvas == null) {
                return;
            }
            if (this._IsParagraphFirstLine())
                left += this.CurrentParagraphWidget.CurrentNode.ParagraphFormat.FirstLineIndent;
            var context = canvas.getContext("2d");
            for (var i = 0; i < this.Children.Count; i++) {
                var elementBox = this.Children[i];
                var underlineY = this.getUnderlineYposition();
                elementBox._render(context, context, left, top, underlineY);
                left += elementBox.Width + elementBox.Margin.Left;
            }
        };
        LineWidget.prototype.getUnderlineYposition = function () {
            var height = 0;
            var lineHeight = 0;
            if (this.Children.Count == 0 || ((this.Children.Count == 1 && this.Children[0] instanceof ListTextElementBox) || (this.Children.Count == 2 && this.Children[0] instanceof ListTextElementBox && this.Children[1] instanceof ListTextElementBox)))
                return 0;
            else {
                for (var i = 0; i < this.Children.Count; i++) {
                    if (height < this.Children[i].Height) {
                        height = this.Children[0].Margin.Top + this.Children[0].Height;
                        lineHeight = this.Children[0].Height / 20;
                    }
                }
            }
            return height - 2 * lineHeight;
        };
        LineWidget.prototype.GetLeft = function () {
            var left = this.CurrentParagraphWidget.X;
            if (this._IsParagraphFirstLine())
                left += this.CurrentParagraphWidget.CurrentNode.ParagraphFormat.FirstLineIndent;
            for (var i = 0; i < this.Children.Count; i++) {
                var element = this.Children[i];
                if (element instanceof ListTextElementBox) {
                    if (i == 0)
                        left += element.Margin.Left + element.Width;
                    else
                        left += element.Width;
                }
                else {
                    left += element.Margin.Left;
                    break;
                }
            }
            return left;
        };
        LineWidget.prototype.GetLeftInternal = function (elementBox, index) {
            var left = this.CurrentParagraphWidget.X;
            if (this._IsParagraphFirstLine())
                left += this.CurrentParagraphWidget.CurrentNode.ParagraphFormat.FirstLineIndent;
            var count = this.Children.IndexOf(elementBox);
            for (var i = 0; i < count; i++) {
                left += this.Children[i].Margin.Left + this.Children[i].Width;
            }
            if (elementBox != null)
                left += elementBox.Margin.Left;
            if (elementBox instanceof TextElementBox) {
                if (index == elementBox.Length)
                    left += elementBox.Width;
                else if (index > elementBox.Length)
                    left += elementBox.Width + TextHelper.GetParagraphMarkSize(elementBox.Inline.OwnerParagraph.CharacterFormat).Width;
                else
                    left += TextHelper.MeasureText(elementBox.Text.substr(0, index), elementBox.Inline.CharacterFormat).Width;
            }
            else if (index > 0) {
                if (elementBox != null) {
                    left += elementBox.Width;
                    if (index == 2)
                        left += TextHelper.GetParagraphMarkSize(elementBox.Inline.OwnerParagraph.CharacterFormat).Width;
                }
                else
                    left += TextHelper.GetParagraphMarkSize(this.CurrentParagraphWidget.CurrentNode.CharacterFormat).Width;
            }
            return left;
        };
        LineWidget.prototype.GetLineStartLeft = function () {
            var left = this.CurrentParagraphWidget.X;
            if (this._IsParagraphFirstLine())
                left += this.CurrentParagraphWidget.CurrentNode.ParagraphFormat.FirstLineIndent;
            if (this.Children.Count > 0)
                left += this.Children[0].Margin.Left;
            return left;
        };
        LineWidget.prototype.GetTop = function () {
            var top = this.CurrentParagraphWidget.Y;
            var count = this.CurrentParagraphWidget.ChildWidgets.IndexOf(this);
            for (var i = 0; i < count; i++) {
                top += this.CurrentParagraphWidget.ChildWidgets[i].Height;
            }
            return top;
        };
        LineWidget.prototype.UpdateTextPosition = function (rte, point, clearMultiSelection) {
            var caretPosition = point;
            var inline = null;
            var index = 0;
            var isImageSelected = false;
            var isImageSelectedObj = this.UpdateTextPositionInternal(rte, inline, index, caretPosition, false);
            if (isImageSelectedObj != null) {
                inline = isImageSelectedObj.inline;
                index = isImageSelectedObj.index;
                caretPosition = isImageSelectedObj.caretPosition;
                isImageSelected = isImageSelectedObj.isImageSelected;
            }
            if (isImageSelected) {
                rte.Selection.Select(this.CurrentParagraphWidget.CurrentNode, inline, index, caretPosition, true);
                if (index == 0)
                    rte.Selection.ExtendForward(false);
                else
                    rte.Selection.ExtendBackward(false);
            }
            else
                rte.Selection.Select(this.CurrentParagraphWidget.CurrentNode, inline, index, caretPosition, clearMultiSelection);
        };
        LineWidget.prototype.UpdateTextPositionInternal = function (rte, inline, index, caretPosition, includeParagraphMark) {
            var isImageSelected = false;
            var top = this.GetTop();
            var left = this.CurrentParagraphWidget.X;
            var elementValues = this.GetFirstElement(left);
            var element = elementValues.element;
            left = elementValues.left;
            if (element == null) {
                var topMargin = 0;
                var bottomMargin = 0;
                var size = this.CurrentParagraphWidget.CurrentNode.GetParagraphMarkSize(topMargin, bottomMargin);
                topMargin = size.TopMargin;
                bottomMargin = size.BottomMargin;
                if (includeParagraphMark && caretPosition.X > left + size.Width / 2) {
                    left += size.Width;
                    if (this.CurrentParagraphWidget.CurrentNode.Inlines.Count > 0) {
                        inline = this.CurrentParagraphWidget.CurrentNode.Inlines[this.CurrentParagraphWidget.CurrentNode.Inlines.Count - 1];
                        index = inline.Length;
                    }
                    index++;
                }
                caretPosition = new Point(left, topMargin > 0 ? top + topMargin : top);
            }
            else {
                if (element != null) {
                    if (caretPosition.X > left + element.Margin.Left) {
                        for (var i = this.Children.IndexOf(element); i < this.Children.Count; i++) {
                            element = this.Children[i];
                            if (caretPosition.X < left + element.Margin.Left + element.Width || i == this.Children.Count - 1)
                                break;
                            left += element.Margin.Left + element.Width;
                        }
                        if (caretPosition.X > left + element.Margin.Left + element.Width) {
                            index = element instanceof TextElementBox ? this.GetTextLength(element) + element.Length : 1;
                            left += element.Margin.Left + element.Width;
                        }
                        else if (element instanceof TextElementBox) {
                            var x = caretPosition.X - left - element.Margin.Left;
                            left += element.Margin.Left;
                            var prevWidth = 0;
                            var charIndex = 0;
                            for (var i = 1; i <= element.Length; i++) {
                                var width = 0;
                                if (i == element.Length)
                                    width = element.Width;
                                else
                                    width = TextHelper.MeasureText(element.Text.substr(0, i), element.Inline.CharacterFormat).Width;
                                if (x < width || i == element.Length) {
                                    var charWidth = width - prevWidth;
                                    if (x - prevWidth > charWidth / 2) {
                                        left += width;
                                        charIndex = i;
                                    }
                                    else {
                                        left += prevWidth;
                                        charIndex = i - 1;
                                        if (i == 1 && element != this.Children[0]) {
                                            var curIndex = this.Children.IndexOf(element);
                                            if (!(this.Children[curIndex - 1] instanceof ListTextElementBox)) {
                                                element = this.Children[curIndex - 1];
                                                charIndex = element instanceof TextElementBox ? element.Length : 1;
                                            }
                                        }
                                    }
                                    break;
                                }
                                prevWidth = width;
                            }
                            index = this.GetTextLength(element) + charIndex;
                        }
                        else {
                            isImageSelected = element instanceof ImageElementBox;
                            if (caretPosition.X - left - element.Margin.Left > element.Width / 2) {
                                index = 1;
                                left += element.Margin.Left + element.Width;
                            }
                            else if (element != this.Children[0] && !isImageSelected) {
                                var curIndex = this.Children.IndexOf(element);
                                if (!(this.Children[curIndex - 1] instanceof ListTextElementBox)) {
                                    element = this.Children[curIndex - 1];
                                    index = element instanceof TextElementBox ? this.GetTextLength(element) + element.Length : 1;
                                }
                            }
                        }
                    }
                    else {
                        left += element.Margin.Left;
                        index = this.GetTextLength(element);
                    }
                    if (element instanceof TextElementBox)
                        top += element.Margin.Top > 0 ? element.Margin.Top : 0;
                    else {
                        var textMetrics = TextHelper.MeasureText("a", element.Inline.CharacterFormat);
                        var height = textMetrics.Height;
                        var baselineOffset = textMetrics.BaselineOffset;
                        top += element.Margin.Top + element.Height - baselineOffset;
                    }
                    inline = element.Inline;
                    var inlineObj = inline.ValidateTextPosition(index);
                    inline = inlineObj.inline;
                    index = inlineObj.index;
                    var isParagraphEnd = inline.NextNode == null && index == inline.Length;
                    if (includeParagraphMark && inline.NextNode instanceof FieldCharacterAdv && index == inline.Length)
                        isParagraphEnd = inline.IsLastRenderedInline(index);
                    if (includeParagraphMark && isParagraphEnd) {
                        var width = TextHelper.GetParagraphMarkSize(inline.OwnerParagraph.CharacterFormat).Width;
                        if (caretPosition.X > left + width / 2) {
                            left += width;
                            index = inline.Length + 1;
                        }
                    }
                    caretPosition = new Point(left, top);
                }
            }
            return {
                "inline": inline,
                "index": index,
                "caretPosition": caretPosition,
                "isImageSelected": isImageSelected
            };
        };
        LineWidget.prototype.GetTextLength = function (element) {
            var length = 0;
            var count = element.Inline.Elements.IndexOf(element);
            for (var i = 0; i < count; i++) {
                length += element.Inline.Elements[i].Length;
            }
            return length;
        };
        LineWidget.prototype.GetFirstElementInternal = function () {
            var element = null;
            for (var i = 0; i < this.Children.Count; i++) {
                element = this.Children[i];
                if (element instanceof ListTextElementBox)
                    element = null;
                else
                    break;
            }
            return element;
        };
        LineWidget.prototype.GetFirstElement = function (left) {
            var firstLineIndent = 0;
            if (this._IsParagraphFirstLine())
                firstLineIndent = this.CurrentParagraphWidget.CurrentNode.ParagraphFormat.FirstLineIndent;
            left += firstLineIndent;
            var element = null;
            for (var i = 0; i < this.Children.Count; i++) {
                element = this.Children[i];
                if (element instanceof ListTextElementBox) {
                    left += element.Margin.Left + element.Width;
                    element = null;
                }
                else
                    break;
            }
            return {
                "element": element, "left": left
            };
        };
        LineWidget.prototype.GetWidth = function (includeParagraphMark) {
            var width = 0;
            if (this._IsParagraphFirstLine())
                width += this.CurrentParagraphWidget.CurrentNode.ParagraphFormat.FirstLineIndent;
            for (var i = 0; i < this.Children.Count; i++) {
                width += this.Children[i].Margin.Left + this.Children[i].Width;
            }
            if (includeParagraphMark && this.CurrentParagraphWidget.CurrentNode.ParagraphWidgets.indexOf(this.CurrentParagraphWidget) == this.CurrentParagraphWidget.CurrentNode.ParagraphWidgets.Count - 1
                && this.CurrentParagraphWidget.ChildWidgets.IndexOf(this) == this.CurrentParagraphWidget.ChildWidgets.Count - 1)
                width += TextHelper.GetParagraphMarkSize(this.CurrentParagraphWidget.CurrentNode.CharacterFormat).Width;
            return width;
        };
        LineWidget.prototype.UpdateTextPositionWidget = function (rte, point, textPosition, includeParagraphMark) {
            var caretPosition = point;
            var inline = null;
            var index = 0;
            var updatePositionObj = this.UpdateTextPositionInternal(rte, inline, index, caretPosition, includeParagraphMark);
            if (updatePositionObj != null) {
                inline = updatePositionObj.inline;
                index = updatePositionObj.index;
                caretPosition = updatePositionObj.caretPosition;
            }
            textPosition.SetPositionForSelection(this.CurrentParagraphWidget.CurrentNode, inline, index, caretPosition);
        };
        LineWidget.prototype.GetHyperlinkField = function (rte, cursorPosition) {
            var inline = null;
            var top = this.GetTop();
            var lineStartLeft = this.GetLineStartLeft();
            if (cursorPosition.Y < top || cursorPosition.Y > top + this.Height
                || cursorPosition.X < lineStartLeft || cursorPosition.X > lineStartLeft + this.Width)
                return null;
            var left = this.CurrentParagraphWidget.X;
            var elementValues = this.GetFirstElement(left);
            left = elementValues.left;
            var element = elementValues.element;
            if (element == null) {
                var width = TextHelper.GetParagraphMarkSize(this.CurrentParagraphWidget.CurrentNode.CharacterFormat).Width;
                if (cursorPosition.X <= lineStartLeft + width || cursorPosition.X >= lineStartLeft + width) {
                    var CheckedFields = new List();
                    var field = this.CurrentParagraphWidget.CurrentNode.GetHyperlinkFields(this.CurrentParagraphWidget.CurrentNode, CheckedFields);
                    CheckedFields.Clear();
                    CheckedFields = null;
                    return field;
                }
            }
            else {
                if (cursorPosition.X > left + element.Margin.Left) {
                    for (var i = this.Children.IndexOf(element); i < this.Children.Count; i++) {
                        element = this.Children[i];
                        if (cursorPosition.X < left + element.Margin.Left + element.Width || i == this.Children.Count - 1)
                            break;
                        left += element.Margin.Left + element.Width;
                    }
                }
                inline = element.Inline;
                var width = element.Margin.Left + element.Width;
                if (inline.NextNode == null && element == inline.Elements[inline.Elements.Count - 1])
                    width += TextHelper.GetParagraphMarkSize(inline.OwnerParagraph.CharacterFormat).Width;
                if (cursorPosition.X <= left + width) {
                    var CheckedFields = new List();
                    var field = inline.OwnerParagraph.GetHyperlinkField(inline, CheckedFields);
                    CheckedFields.Clear();
                    CheckedFields = null;
                    return field;
                }
            }
            return null;
        };
        LineWidget.prototype.ClearSelectionHighlight = function (viewer) {
            if (viewer == null)
                return;
            if (viewer.OwnerControl != null && viewer.OwnerControl.Selection.SelectionRanges.Count > 0) {
                viewer.OwnerControl.Selection.SelectionRanges.ClearSelectionHighlightInternal(this);
            }
        };
        LineWidget.prototype.RemoveWidget = function (viewer) {
            if (viewer.OwnerControl != null && viewer.OwnerControl.Selection.SelectionRanges.Count > 0)
                viewer.OwnerControl.Selection.SelectionRanges.RemoveSelectionHighlight(this);
        };
        LineWidget.prototype.Dispose = function () {
            var viewer = null;
            if (this.CurrentParagraphWidget != null && this.CurrentParagraphWidget.GetPage() != null)
                viewer = this.CurrentParagraphWidget.GetPage().Viewer;
            this.DisposeInternal(viewer);
        };
        LineWidget.prototype.DisposeInternal = function (viewer) {
            this.ClearSelectionHighlight(viewer);
            if (this.Children != null) {
                for (var i = 0; i < this.Children.Count; i++) {
                    var element = this.Children[i];
                    element.Dispose(viewer);
                    this.Children.Remove(element);
                    i--;
                }
                this.Children = null;
            }
            if (this.CurrentParagraphWidget != null) {
                if (this.CurrentParagraphWidget.ChildWidgets != null) {
                    this.CurrentParagraphWidget.ChildWidgets.Remove(this);
                    this.CurrentParagraphWidget.Height -= this.Height;
                }
                this.CurrentParagraphWidget = null;
            }
        };
        return LineWidget;
    }());
    DocumentEditorFeatures.LineWidget = LineWidget;
    var ElementBox = (function () {
        function ElementBox(baseNode) {
            this.X = 0;
            this.Y = 0;
            this.Width = 0;
            this.Height = 0;
            this.BaseNode = baseNode;
        }
        Object.defineProperty(ElementBox.prototype, "Inline", {
            get: function () {
                return this.BaseNode;
            },
            enumerable: true,
            configurable: true
        });
        ElementBox.prototype.GetIndexInInline = function () {
            var indexInInline = 0;
            if (Inline != null && this instanceof TextElementBox) {
                var count = this.Inline.Elements.IndexOf(this);
                for (var i = 0; i < count; i++) {
                    indexInInline += this.Inline.Elements[i].Length;
                }
            }
            return indexInInline;
        };
        ElementBox.prototype._renderUnderline = function (context, left, top, underlineY, color, underline, baselineAlignment) {
            var renderedHeight = this.Height / (baselineAlignment == BaselineAlignment.Normal ? 1 : 1.5);
            var topMargin = this.Margin.Top;
            var underlineHeight = renderedHeight / 20;
            var y = 0;
            if (baselineAlignment == BaselineAlignment.Subscript || this instanceof ListTextElementBox) {
                y = (renderedHeight - 2 * underlineHeight) + top;
                topMargin += this.Height - renderedHeight;
                y += topMargin > 0 ? topMargin : 0;
            }
            else
                y = underlineY + top;
            context.fillRect(left, y, this.Width, underlineHeight);
        };
        ElementBox.prototype._renderStrikeThrough = function (context, left, top, strikethrough, color, baselineAlignment) {
            var renderedHeight = this.Height / (baselineAlignment == BaselineAlignment.Normal ? 1 : 1.5);
            var topMargin = this.Margin.Top;
            if (baselineAlignment == BaselineAlignment.Subscript)
                topMargin += this.Height - renderedHeight;
            top += topMargin > 0 ? topMargin : 0;
            var lineHeight = renderedHeight / 20;
            var y = (renderedHeight / 2) + (0.5 * lineHeight);
            var linecount = 0;
            if (strikethrough == StrikeThrough.DoubleStrike)
                y -= lineHeight;
            while (linecount < (strikethrough == StrikeThrough.DoubleStrike ? 2 : 1)) {
                linecount++;
                context.fillRect(left + this.Margin.Left, y + top, this.Width, lineHeight);
                y += 2 * lineHeight;
            }
        };
        ElementBox.prototype.ClipRect = function (context, xPos, yPos, width, height) {
            context.beginPath();
            context.save();
            context.rect(xPos, yPos, width, height);
            context.clip();
        };
        return ElementBox;
    }());
    DocumentEditorFeatures.ElementBox = ElementBox;
    var TextElementBox = (function (_super) {
        __extends(TextElementBox, _super);
        function TextElementBox(inline) {
            _super.call(this, inline);
            this.BaselineOffset = 0;
            this.Index = 0;
            this.Length = 0;
        }
        Object.defineProperty(TextElementBox.prototype, "Text", {
            get: function () {
                if (this.Inline instanceof SpanAdv)
                    return this.Inline.Text.substr(this.Index, this.Length);
                return "";
            },
            enumerable: true,
            configurable: true
        });
        TextElementBox.prototype._getHTML = function () {
            var innerHtml = "<span ";
            innerHtml += ">";
            innerHtml += this.Inline.Text.substr(this.Index, this.Length);
            innerHtml += "</span>";
            return innerHtml;
        };
        TextElementBox.prototype._render = function (foregroundContext, backgroundContext, left, top, underlineY) {
            var isHeightType = false;
            var containerWidget = this.CurrentLineWidget.CurrentParagraphWidget.ContainerWidget;
            if (containerWidget instanceof TableCellWidget)
                isHeightType = (containerWidget.CurrentNode.OwnerRow.RowFormat.HeightType == HeightType.Exactly);
            var topMargin = this.Margin.Top;
            var leftMargin = this.Margin.Left;
            if (isHeightType) {
                this.ClipRect(foregroundContext, containerWidget.X, containerWidget.Y, containerWidget.Width, containerWidget.Height);
            }
            var format = this.Inline.CharacterFormat;
            var color = format.FontColor;
            foregroundContext.textBaseline = "top";
            var bold = "";
            var italic = "";
            var fontSize = 11;
            bold = format.Bold ? "bold" : "";
            italic = format.Italic ? "italic" : "";
            fontSize = format.FontSize == 0 ? 0.5 : format.FontSize / (format.BaselineAlignment == BaselineAlignment.Normal ? 1 : 1.5);
            foregroundContext.font = bold + " " + italic + " " + fontSize + "px" + " " + format.FontFamily;
            if (format.BaselineAlignment == BaselineAlignment.Subscript)
                topMargin += this.Height - this.Height / 1.5;
            if (format.HighlightColor != HighlightColor.NoColor) {
                backgroundContext.fillStyle = HelperMethods.GetHighlightColorCode(format.HighlightColor);
                backgroundContext.fillRect(left + leftMargin, top + topMargin, this.Width, this.Height);
            }
            if (color == "empty") {
                var document_2 = this.Inline.OwnerParagraph.Document;
                color = this.Inline.CharacterFormat.GetDefaultFontColor(document_2);
            }
            foregroundContext.fillStyle = color;
            foregroundContext.fillText(this.Text, left + leftMargin, top + topMargin, this.Width);
            foregroundContext.restore();
            if (format.Underline != Underline.None)
                this._renderUnderline(foregroundContext, left, top, underlineY, color, format.Underline, format.BaselineAlignment);
            if (format.StrikeThrough != StrikeThrough.None)
                this._renderStrikeThrough(foregroundContext, left, top, format.StrikeThrough, color, format.BaselineAlignment);
        };
        TextElementBox.prototype.Dispose = function () {
            var viewer = null;
            if (this.CurrentLineWidget != null && this.CurrentLineWidget.CurrentParagraphWidget != null && this.CurrentLineWidget.CurrentParagraphWidget.GetPage() != null)
                viewer = this.CurrentLineWidget.CurrentParagraphWidget.GetPage().Viewer;
            this.DisposeInternal(viewer);
        };
        TextElementBox.prototype.DisposeInternal = function (viewer) {
            var StartIndex = 0;
            var Length = 0;
            if (this.CurrentLineWidget != null) {
                if (this.CurrentLineWidget.Children.Contains(this))
                    this.CurrentLineWidget.Children.Remove(this);
                this.CurrentLineWidget = null;
            }
            if (this.Inline != null) {
                if (this.Inline.Elements != null && this.Inline.Elements.Contains(this))
                    this.Inline.Elements.Remove(this);
                this.BaseNode = null;
            }
        };
        return TextElementBox;
    }(ElementBox));
    DocumentEditorFeatures.TextElementBox = TextElementBox;
    var ListTextElementBox = (function (_super) {
        __extends(ListTextElementBox, _super);
        function ListTextElementBox(paragraphAdv, listLevel, isListFollowCharacter) {
            _super.call(this, paragraphAdv);
            this.BaselineOffset = 0;
            this.index = 0;
            this.isFollowCharacter = false;
            this.ListLevel = listLevel;
            this.isFollowCharacter = isListFollowCharacter;
        }
        Object.defineProperty(ListTextElementBox.prototype, "Paragraph", {
            get: function () {
                return this.BaseNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListTextElementBox.prototype, "Text", {
            get: function () {
                return this.text;
            },
            set: function (value) {
                this.text = value;
            },
            enumerable: true,
            configurable: true
        });
        ListTextElementBox.prototype._getHTML = function () { return; };
        ListTextElementBox.prototype._render = function (foregroundContext, backgroundContext, left, top, underlineY) {
            var topMargin = this.Margin.Top;
            var leftMargin = this.Margin.Left;
            var format = this.ListLevel.CharacterFormat;
            var breakCharacterFormat = this.Paragraph.CharacterFormat;
            var color = format.FontColor;
            foregroundContext.textBaseline = "top";
            var bold = "";
            var italic = "";
            var fontFamily = format.FontFamily == "verdana" ? breakCharacterFormat.FontFamily : format.FontFamily;
            var fontSize = format.FontSize == 11 ? breakCharacterFormat.FontSize : format.FontSize;
            var baselineAlignment = format.BaselineAlignment == 0 ? breakCharacterFormat.BaselineAlignment : format.BaselineAlignment;
            bold = format.Bold ? "bold" : "";
            italic = format.Italic ? "italic" : "";
            fontSize = fontSize == 0 ? 0.5 : fontSize / (baselineAlignment == BaselineAlignment.Normal ? 1 : 1.5);
            foregroundContext.font = bold + " " + italic + " " + fontSize + "px" + " " + fontFamily;
            if (baselineAlignment == BaselineAlignment.Subscript)
                topMargin += this.Height - this.Height / 1.5;
            if (format.HighlightColor != HighlightColor.NoColor) {
                backgroundContext.fillStyle = HelperMethods.GetHighlightColorCode(format.HighlightColor);
                backgroundContext.fillRect(left + leftMargin, top + topMargin, this.Width, this.Height);
            }
            if (color == "empty") {
                var document_3 = this.Paragraph.Document;
                color = this.ListLevel.CharacterFormat.GetDefaultFontColor(document_3);
            }
            foregroundContext.fillStyle = color;
            foregroundContext.fillText(this.Text, left + leftMargin, top + topMargin);
            if (format.Underline != Underline.None)
                this._renderUnderline(foregroundContext, left, top, underlineY, color, format.Underline, baselineAlignment);
            if (format.StrikeThrough != StrikeThrough.None)
                this._renderStrikeThrough(foregroundContext, left, top, format.StrikeThrough, color, baselineAlignment);
        };
        ListTextElementBox.prototype.Dispose = function () {
            var viewer = null;
            if (this.CurrentLineWidget != null && this.CurrentLineWidget.CurrentParagraphWidget != null && this.CurrentLineWidget.CurrentParagraphWidget.GetPage() != null)
                viewer = this.CurrentLineWidget.CurrentParagraphWidget.GetPage().Viewer;
            this.DisposeInternal(viewer);
        };
        ListTextElementBox.prototype.DisposeInternal = function (viewer) {
            if (this.CurrentLineWidget != null) {
                if (this.CurrentLineWidget.Children.Contains(this))
                    this.CurrentLineWidget.Children.Remove(this);
                this.CurrentLineWidget = null;
            }
            this.BaseNode = null;
            this.ListLevel = null;
        };
        return ListTextElementBox;
    }(ElementBox));
    DocumentEditorFeatures.ListTextElementBox = ListTextElementBox;
    var ImageElementBox = (function (_super) {
        __extends(ImageElementBox, _super);
        function ImageElementBox(inline) {
            _super.call(this, inline);
        }
        ImageElementBox.prototype._getHTML = function () {
            var innerHtml = "<img ";
            innerHtml += "width=\"" + this.Inline.Width + "\" ";
            innerHtml += "height=\"" + this.Inline.Height + "\" ";
            innerHtml += "src=\"" + this.Inline.ImageString + "\" ";
            innerHtml += ">";
            return innerHtml;
        };
        ImageElementBox.prototype._render = function (foregroundContext, backgroundContext, left, top, underlineY) {
            var topMargin = this.Margin.Top;
            var leftMargin = this.Margin.Left;
            var widgetWidth = 0;
            var format = this.Inline.CharacterFormat;
            var color = "black";
            foregroundContext.textBaseline = "top";
            var image = document.createElement("img");
            image.src = this.Inline.ImageString;
            foregroundContext.save();
            if (topMargin < 0 || this.CurrentLineWidget.Width < this.Width) {
                var containerWid = this.CurrentLineWidget.CurrentParagraphWidget.ContainerWidget;
                if (containerWid instanceof BodyWidget)
                    widgetWidth = containerWid.Width + containerWid.X;
                else if (containerWid instanceof TableCellWidget) {
                    var leftIndent = 0;
                    if (containerWid.ChildWidgets[0] instanceof ParagraphWidget) {
                        var paraAdv = containerWid.ChildWidgets[0].CurrentNode;
                        leftIndent = paraAdv.ParagraphFormat.LeftIndent;
                    }
                    widgetWidth = containerWid.Width + containerWid.Margin.Left - containerWid.LeftBorderWidth - leftIndent;
                }
                this.ClipRect(foregroundContext, left + leftMargin, top + topMargin, widgetWidth, containerWid.Height);
            }
            if (this.Inline.IsMetaFile) {
            }
            else
                foregroundContext.drawImage(image, left + leftMargin, top + topMargin, this.Width, this.Height);
            foregroundContext.restore();
            if (format.Underline != Underline.None)
                this._renderUnderline(foregroundContext, left, top, underlineY, color, format.Underline, format.BaselineAlignment);
            if (format.StrikeThrough != StrikeThrough.None)
                this._renderStrikeThrough(foregroundContext, left, top, format.StrikeThrough, color, format.BaselineAlignment);
        };
        ImageElementBox.prototype.Dispose = function () {
            var viewer = null;
            if (this.CurrentLineWidget != null && this.CurrentLineWidget.CurrentParagraphWidget != null && this.CurrentLineWidget.CurrentParagraphWidget.GetPage() != null)
                viewer = this.CurrentLineWidget.CurrentParagraphWidget.GetPage().Viewer;
            this.DisposeInternal(viewer);
        };
        ImageElementBox.prototype.DisposeInternal = function (viewer) {
            if (this.CurrentLineWidget != null) {
                if (this.CurrentLineWidget.Children.Contains(this))
                    this.CurrentLineWidget.Children.Remove(this);
                this.CurrentLineWidget = null;
            }
            if (this.Inline != null) {
                if (this.Inline.Elements != null && this.Inline.Elements.Contains(this))
                    this.Inline.Elements.Remove(this);
                this.BaseNode = null;
            }
        };
        return ImageElementBox;
    }(ElementBox));
    DocumentEditorFeatures.ImageElementBox = ImageElementBox;
    var ListAdv = (function (_super) {
        __extends(ListAdv, _super);
        function ListAdv(node) {
            _super.call(this, node);
            this.listId = -1;
            this.abstractListId = -1;
            this.levelOverrides = new LevelOverrideAdvCollection(this);
        }
        Object.defineProperty(ListAdv.prototype, "OwnerDocument", {
            get: function () {
                return this.OwnerBase;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListAdv.prototype, "AbstractList", {
            get: function () {
                var abstractList = null;
                if (this.OwnerDocument != null)
                    abstractList = this.OwnerDocument.GetAbstractListAdvByID(this.AbstractListId);
                return abstractList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListAdv.prototype, "ListId", {
            get: function () {
                return this.listId;
            },
            set: function (listId) {
                this.listId = listId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListAdv.prototype, "AbstractListId", {
            get: function () {
                return this.abstractListId;
            },
            set: function (abstractListId) {
                this.abstractListId = abstractListId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListAdv.prototype, "LevelOverrides", {
            get: function () {
                return this.levelOverrides;
            },
            set: function (levelOverrides) {
                this.levelOverrides = levelOverrides;
            },
            enumerable: true,
            configurable: true
        });
        ListAdv.prototype.GetListLevel = function (listLevelNumber) {
            if (this.AbstractList != null && this.AbstractList.Levels.Count <= listLevelNumber && listLevelNumber >= 0 && listLevelNumber < 9)
                this.OwnerDocument.AddListLevel(this.AbstractList);
            var levelOverrideAdv = null;
            if (this.LevelOverrides != null && (levelOverrideAdv = this.LevelOverrides.Get(listLevelNumber)) != null && levelOverrideAdv.OverrideListLevel != null)
                return levelOverrideAdv.OverrideListLevel;
            else if (this.AbstractList != null && listLevelNumber >= 0 && listLevelNumber < this.AbstractList.Levels.Count)
                return this.AbstractList.Levels[listLevelNumber];
            return null;
        };
        ListAdv.prototype.GetListStartValue = function (listLevelNumber) {
            var levelOverride = this.LevelOverrides != null ? this.LevelOverrides.Get(listLevelNumber) : null;
            if (levelOverride != null && levelOverride.OverrideListLevel == null)
                return levelOverride.StartAt;
            var listLevel = this.GetListLevel(listLevelNumber);
            if (listLevel == null)
                return 0;
            else
                return listLevel.StartAt;
        };
        ListAdv.prototype.Dispose = function () {
            this.SetOwner(null);
            if (this.LevelOverrides != null)
                this.LevelOverrides.Dispose();
            this.levelOverrides = null;
        };
        return ListAdv;
    }(BaseNode));
    DocumentEditorFeatures.ListAdv = ListAdv;
    var AbstractListAdv = (function (_super) {
        __extends(AbstractListAdv, _super);
        function AbstractListAdv(node) {
            _super.call(this, node);
            this.abstractListId = -1;
            this.levels = new ListLevelAdvCollection(this);
        }
        Object.defineProperty(AbstractListAdv.prototype, "OwnerDocument", {
            get: function () {
                return this.OwnerBase;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractListAdv.prototype, "AbstractListId", {
            get: function () {
                return this.abstractListId;
            },
            set: function (abstractListId) {
                this.abstractListId = abstractListId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractListAdv.prototype, "Levels", {
            get: function () {
                return this.levels;
            },
            set: function (levels) {
                this.levels = levels;
            },
            enumerable: true,
            configurable: true
        });
        AbstractListAdv.prototype.Dispose = function () {
            this.SetOwner(null);
            if (this.levels != null) {
                for (var i = 0; i < this.levels.length; i++) {
                    var listlevel = this.levels[i];
                    this.levels.Dispose;
                    this.levels.Remove(listlevel);
                    i--;
                }
            }
        };
        return AbstractListAdv;
    }(BaseNode));
    DocumentEditorFeatures.AbstractListAdv = AbstractListAdv;
    var ListLevelAdv = (function (_super) {
        __extends(ListLevelAdv, _super);
        function ListLevelAdv(node) {
            _super.call(this, node);
            this.listLevelPattern = ListLevelPattern.Arabic;
            this.startAt = 0;
            this.numberFormat = "";
            this.followCharacter = FollowCharacterType.Tab;
            this.levelNumber = 0;
            this.paragraphFormat = null;
            this.characterFormat = null;
            this.restartLevel = 0;
            this.CharacterFormat = new CharacterFormat(this);
            this.ParagraphFormat = new ParagraphFormat(this);
        }
        Object.defineProperty(ListLevelAdv.prototype, "OwnerDocument", {
            get: function () {
                if (this.OwnerBase instanceof AbstractListAdv != null)
                    return this.OwnerBase.OwnerDocument;
                else if (this.OwnerBase instanceof LevelOverrideAdv != null)
                    return this.OwnerBase.OwnerList.OwnerDocument;
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListLevelAdv.prototype, "ListLevelPattern", {
            get: function () {
                return this.listLevelPattern;
            },
            set: function (listLevelPattern) {
                this.listLevelPattern = listLevelPattern;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListLevelAdv.prototype, "FollowCharacter", {
            get: function () {
                return this.followCharacter;
            },
            set: function (followCharacter) {
                this.followCharacter = followCharacter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListLevelAdv.prototype, "StartAt", {
            get: function () {
                return this.startAt;
            },
            set: function (startAt) {
                this.startAt = startAt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListLevelAdv.prototype, "NumberFormat", {
            get: function () {
                return this.numberFormat;
            },
            set: function (numberFormat) {
                this.numberFormat = numberFormat;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListLevelAdv.prototype, "RestartLevel", {
            get: function () {
                return this.restartLevel;
            },
            set: function (restartLevel) {
                this.restartLevel = restartLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListLevelAdv.prototype, "LevelNumber", {
            get: function () {
                if (this.OwnerBase instanceof LevelOverrideAdv)
                    return this.OwnerBase.LevelNumber;
                else if (this.OwnerBase instanceof AbstractListAdv && this.OwnerBase.Levels != null)
                    return this.OwnerBase.Levels.IndexOf(this);
                else
                    return -1;
            },
            set: function (levelNumber) {
                this.levelNumber = levelNumber;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListLevelAdv.prototype, "CharacterFormat", {
            get: function () {
                return this.characterFormat;
            },
            set: function (characterFormat) {
                this.characterFormat = characterFormat;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListLevelAdv.prototype, "ParagraphFormat", {
            get: function () {
                return this.paragraphFormat;
            },
            set: function (paragraphFormat) {
                this.paragraphFormat = paragraphFormat;
            },
            enumerable: true,
            configurable: true
        });
        ListLevelAdv.prototype.GetListText = function (listValue) {
            switch (this.ListLevelPattern) {
                case ListLevelPattern.UpRoman:
                    return this.GetAsRoman(listValue).toUpperCase();
                case ListLevelPattern.LowRoman:
                    return this.GetAsRoman(listValue).toLowerCase();
                case ListLevelPattern.UpLetter:
                    return this.GetAsLetter(listValue).toUpperCase();
                case ListLevelPattern.LowLetter:
                    return this.GetAsLetter(listValue).toLowerCase();
                case ListLevelPattern.Arabic:
                    return (listValue).toString();
                case ListLevelPattern.LeadingZero:
                    if (listValue < 10)
                        return "0" + listValue.toString();
                    else
                        return listValue.toString();
                case ListLevelPattern.Number:
                    return (listValue).toString();
                case ListLevelPattern.OrdinalText:
                    return (listValue).toString();
                case ListLevelPattern.Ordinal:
                    return (listValue).toString();
                case ListLevelPattern.FarEast:
                    return (listValue).toString();
                case ListLevelPattern.Special:
                    return (listValue).toString();
                default:
                    return "";
            }
        };
        ListLevelAdv.prototype.GetAsRoman = function (number) {
            var retval = "";
            var Number = {
                "number": number
            };
            retval += this.GenerateNumber(Number, 1000, "M");
            retval += this.GenerateNumber(Number, 900, "CM");
            retval += this.GenerateNumber(Number, 500, "D");
            retval += this.GenerateNumber(Number, 400, "CD");
            retval += this.GenerateNumber(Number, 100, "C");
            retval += this.GenerateNumber(Number, 90, "XC");
            retval += this.GenerateNumber(Number, 50, "L");
            retval += this.GenerateNumber(Number, 40, "XL");
            retval += this.GenerateNumber(Number, 10, "X");
            retval += this.GenerateNumber(Number, 9, "IX");
            retval += this.GenerateNumber(Number, 5, "V");
            retval += this.GenerateNumber(Number, 4, "IV");
            retval += this.GenerateNumber(Number, 1, "I");
            return retval.toString();
        };
        ListLevelAdv.prototype.GenerateNumber = function (value, magnitude, letter) {
            var numberstring = "";
            while (value.number >= magnitude) {
                value.number -= magnitude;
                numberstring += letter;
            }
            return numberstring.toString();
        };
        ListLevelAdv.prototype.GetAsLetter = function (number) {
            if (number <= 0)
                return "";
            var quotient = number / 26;
            var remainder = number % 26;
            if (remainder == 0) {
                remainder = 26;
                quotient--;
            }
            var letter = String.fromCharCode(65 - 1 + remainder);
            var listValue = letter.toString();
            while (quotient > 0) {
                listValue = letter.toString();
                quotient--;
            }
            return listValue;
        };
        ListLevelAdv.DOTBULLET = "\uf0b7";
        ListLevelAdv.SQUAREBULLET = "\uf0a7";
        ListLevelAdv.ARROWBULLET = "\u27a4";
        ListLevelAdv.CIRCLEBULLET = "\uf06f" + "\u0020";
        return ListLevelAdv;
    }(BaseNode));
    DocumentEditorFeatures.ListLevelAdv = ListLevelAdv;
    var LevelOverrideAdv = (function (_super) {
        __extends(LevelOverrideAdv, _super);
        function LevelOverrideAdv(node) {
            _super.call(this, node);
        }
        Object.defineProperty(LevelOverrideAdv.prototype, "OwnerList", {
            get: function () {
                return this.OwnerBase;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LevelOverrideAdv.prototype, "StartAt", {
            get: function () {
                return this.startAt;
            },
            set: function (value) {
                this.startAt = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LevelOverrideAdv.prototype, "LevelNumber", {
            get: function () {
                return this.levelNumber;
            },
            set: function (value) {
                this.levelNumber = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LevelOverrideAdv.prototype, "OverrideListLevel", {
            get: function () {
                return this.overrideListLevel;
            },
            set: function (value) {
                this.overrideListLevel = value;
            },
            enumerable: true,
            configurable: true
        });
        return LevelOverrideAdv;
    }(BaseNode));
    DocumentEditorFeatures.LevelOverrideAdv = LevelOverrideAdv;
    var SectionFormat = (function (_super) {
        __extends(SectionFormat, _super);
        function SectionFormat(node) {
            _super.call(this, node);
            this.headerdistance = 48;
            this.footerdistance = 48;
            this.differentfirstpage = false;
            this.differentoddandevenpages = false;
            this.pagewidth = 816;
            this.pageheight = 1056;
            this.leftmargin = 96;
            this.topmargin = 96;
            this.rightmargin = 96;
            this.bottommargin = 96;
        }
        Object.defineProperty(SectionFormat.prototype, "HeaderDistance", {
            get: function () {
                return this.headerdistance;
            },
            set: function (headerdistance) {
                this.headerdistance = headerdistance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SectionFormat.prototype, "FooterDistance", {
            get: function () {
                return this.footerdistance;
            },
            set: function (footerdistance) {
                this.footerdistance = footerdistance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SectionFormat.prototype, "DifferentFirstPage", {
            get: function () {
                return this.differentfirstpage;
            },
            set: function (differentfirstpage) {
                this.differentfirstpage = differentfirstpage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SectionFormat.prototype, "DifferentOddAndEvenPages", {
            get: function () {
                return this.differentoddandevenpages;
            },
            set: function (differentoddandevenpages) {
                this.differentoddandevenpages = differentoddandevenpages;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SectionFormat.prototype, "PageWidth", {
            get: function () {
                return this.pagewidth;
            },
            set: function (pagewidth) {
                this.pagewidth = pagewidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SectionFormat.prototype, "PageHeight", {
            get: function () {
                return this.pageheight;
            },
            set: function (pageheight) {
                this.pageheight = pageheight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SectionFormat.prototype, "LeftMargin", {
            get: function () {
                return this.leftmargin;
            },
            set: function (leftmargin) {
                this.leftmargin = leftmargin;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SectionFormat.prototype, "TopMargin", {
            get: function () {
                return this.topmargin;
            },
            set: function (topmargin) {
                this.topmargin = topmargin;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SectionFormat.prototype, "RightMargin", {
            get: function () {
                return this.rightmargin;
            },
            set: function (rightmargin) {
                this.rightmargin = rightmargin;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SectionFormat.prototype, "BottomMargin", {
            get: function () {
                return this.bottommargin;
            },
            set: function (bottommargin) {
                this.bottommargin = bottommargin;
            },
            enumerable: true,
            configurable: true
        });
        SectionFormat.prototype.Dispose = function () {
            this.SetOwner(null);
        };
        return SectionFormat;
    }(CompositeNode));
    DocumentEditorFeatures.SectionFormat = SectionFormat;
    var CharacterFormat = (function (_super) {
        __extends(CharacterFormat, _super);
        function CharacterFormat(node) {
            _super.call(this, node);
            this.bold = false;
            this.italic = false;
            this.fontSize = 11;
            this.underline = Underline.None;
            this.strikeThrough = StrikeThrough.None;
            this.baselineAlignment = BaselineAlignment.Normal;
            this.highlightColor = HighlightColor.NoColor;
            this.fontColor = "empty";
            this.fontFamily = "verdana";
        }
        Object.defineProperty(CharacterFormat.prototype, "Bold", {
            get: function () {
                return this.bold;
            },
            set: function (value) {
                this.bold = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CharacterFormat.prototype, "Italic", {
            get: function () {
                return this.italic;
            },
            set: function (value) {
                this.italic = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CharacterFormat.prototype, "FontSize", {
            get: function () {
                return this.fontSize;
            },
            set: function (value) {
                this.fontSize = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CharacterFormat.prototype, "FontFamily", {
            get: function () {
                return this.fontFamily;
            },
            set: function (value) {
                this.fontFamily = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CharacterFormat.prototype, "Underline", {
            get: function () {
                return this.underline;
            },
            set: function (value) {
                this.underline = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CharacterFormat.prototype, "StrikeThrough", {
            get: function () {
                return this.strikeThrough;
            },
            set: function (value) {
                this.strikeThrough = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CharacterFormat.prototype, "BaselineAlignment", {
            get: function () {
                return this.baselineAlignment;
            },
            set: function (value) {
                this.baselineAlignment = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CharacterFormat.prototype, "HighlightColor", {
            get: function () {
                return this.highlightColor;
            },
            set: function (value) {
                this.highlightColor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CharacterFormat.prototype, "FontColor", {
            get: function () {
                return this.fontColor;
            },
            set: function (value) {
                this.fontColor = value;
            },
            enumerable: true,
            configurable: true
        });
        CharacterFormat.prototype.CopyFormat = function (sourceFormat) {
            if (sourceFormat.BaselineAlignment != undefined && sourceFormat.BaselineAlignment != null)
                this.Bold = sourceFormat.Bold;
            if (sourceFormat.Underline != undefined && sourceFormat.Underline != null)
                this.Underline = sourceFormat.Underline;
            if (sourceFormat.StrikeThrough != undefined && sourceFormat.StrikeThrough != null)
                this.StrikeThrough = sourceFormat.StrikeThrough;
            if (sourceFormat.FontSize != undefined && sourceFormat.FontSize != null)
                this.FontSize = sourceFormat.FontSize;
            if (sourceFormat.FontFamily != undefined && sourceFormat.FontFamily != null)
                this.FontFamily = sourceFormat.FontFamily;
            if (sourceFormat.Bold != undefined && sourceFormat.Bold != null)
                this.Bold = sourceFormat.Bold;
            if (sourceFormat.Italic != undefined && sourceFormat.Italic != null)
                this.Italic = sourceFormat.Italic;
            if (sourceFormat.HighlightColor != undefined && sourceFormat.HighlightColor != null)
                this.HighlightColor = sourceFormat.HighlightColor;
            if (sourceFormat.FontColor != undefined && sourceFormat.FontColor != null)
                this.FontColor = sourceFormat.FontColor;
        };
        CharacterFormat.prototype.GetAsHtmlStyle = function () {
            var style = "style=\"";
            if (this.Bold)
                style += "font-weight:bold; ";
            if (this.Italic)
                style += "font-style:italic; ";
            if (this.Underline != Underline.None)
                style += "text-decoration:underline; ";
            if (this.StrikeThrough != StrikeThrough.None)
                style += "text-decoration:line-through; ";
            if (this.BaselineAlignment == BaselineAlignment.Subscript)
                style += "vertical-align:sub;";
            else if (this.BaselineAlignment == BaselineAlignment.Superscript)
                style += "vertical-align:super;";
            style += "color:" + this.FontColor + "; "
                + "font-family:" + this.FontFamily + "; "
                + "font-size:" + this.FontSize + "px; ";
            if (this.HighlightColor != HighlightColor.NoColor)
                style += "background:" + HelperMethods.GetHighlightColorCode(this.HighlightColor);
            style += "\" ";
            return style;
        };
        CharacterFormat.prototype.GetDefaultFontColor = function (document) {
            var backColor = document.BackgroundColor;
            if (HelperMethods.IsVeryDark(backColor))
                return "#FFFFFF";
            else
                return "#000000";
        };
        CharacterFormat.prototype.Dispose = function () {
            this.SetOwner(null);
        };
        return CharacterFormat;
    }(BaseNode));
    DocumentEditorFeatures.CharacterFormat = CharacterFormat;
    var ParagraphFormat = (function (_super) {
        __extends(ParagraphFormat, _super);
        function ParagraphFormat(node) {
            _super.call(this, node);
            this.leftIndent = 0;
            this.rightIndent = 0;
            this.firstLineIndent = 0;
            this.afterSpacing = 0;
            this.beforeSpacing = 0;
            this.lineSpacing = 1;
            this.lineSpacingType = LineSpacingType.Multiple;
            this.ListFormat = new ListFormat(this);
        }
        Object.defineProperty(ParagraphFormat.prototype, "Document", {
            get: function () {
                if (this.OwnerBase instanceof ParagraphAdv
                    && this.OwnerBase.Document != null)
                    return this.OwnerBase.Document;
                else if (this.OwnerBase instanceof ListLevelAdv)
                    return this.OwnerBase.OwnerDocument;
                else if (this.OwnerBase instanceof DocumentAdv)
                    return this.OwnerBase;
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ParagraphFormat.prototype, "LeftIndent", {
            get: function () {
                return this.leftIndent;
            },
            set: function (value) {
                this.leftIndent = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ParagraphFormat.prototype, "RightIndent", {
            get: function () {
                return this.rightIndent;
            },
            set: function (value) {
                this.rightIndent = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ParagraphFormat.prototype, "FirstLineIndent", {
            get: function () {
                return this.firstLineIndent;
            },
            set: function (value) {
                this.firstLineIndent = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ParagraphFormat.prototype, "BeforeSpacing", {
            get: function () {
                return this.beforeSpacing;
            },
            set: function (value) {
                this.beforeSpacing = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ParagraphFormat.prototype, "AfterSpacing", {
            get: function () {
                return this.afterSpacing;
            },
            set: function (value) {
                this.afterSpacing = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ParagraphFormat.prototype, "LineSpacing", {
            get: function () {
                return this.lineSpacing;
            },
            set: function (value) {
                this.lineSpacing = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ParagraphFormat.prototype, "LineSpacingType", {
            get: function () {
                return this.lineSpacingType;
            },
            set: function (value) {
                this.lineSpacingType = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ParagraphFormat.prototype, "TextAlignment", {
            get: function () {
                return this.textalignment;
            },
            set: function (value) {
                this.textalignment = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ParagraphFormat.prototype, "ListFormat", {
            get: function () {
                return this.listFormat;
            },
            set: function (value) {
                this.listFormat = value;
            },
            enumerable: true,
            configurable: true
        });
        ParagraphFormat.prototype.CopyFormat = function (sourceFormat) {
            if (sourceFormat.AfterSpacing != undefined && sourceFormat.AfterSpacing != null)
                this.AfterSpacing = sourceFormat.AfterSpacing;
            if (sourceFormat.BeforeSpacing != undefined && sourceFormat.BeforeSpacing != null)
                this.BeforeSpacing = sourceFormat.BeforeSpacing;
            if (sourceFormat.LeftIndent != undefined && sourceFormat.LeftIndent != null)
                this.LeftIndent = sourceFormat.LeftIndent;
            if (sourceFormat.RightIndent != undefined && sourceFormat.RightIndent != null)
                this.RightIndent = sourceFormat.RightIndent;
            if (sourceFormat.FirstLineIndent != undefined && sourceFormat.FirstLineIndent != null)
                this.FirstLineIndent = sourceFormat.FirstLineIndent;
            if (sourceFormat.LineSpacing != undefined && sourceFormat.LineSpacing != null)
                this.LineSpacing = sourceFormat.LineSpacing;
            if (sourceFormat.LineSpacingType != undefined && sourceFormat.LineSpacingType != null)
                this.LineSpacingType = sourceFormat.LineSpacingType;
            if (sourceFormat.TextAlignment != undefined && sourceFormat.TextAlignment != null)
                this.TextAlignment = sourceFormat.TextAlignment;
            if (sourceFormat.ListFormat != undefined && sourceFormat.ListFormat != null)
                this.ListFormat = sourceFormat.ListFormat;
        };
        ParagraphFormat.prototype.GetAsHtmlStyle = function () {
            var style = "style=\"";
            style += CssConstants.TextAlign + HTMLOperators.Colon + HelperMethods.GetHtmlTextAlign(this.TextAlignment) + HTMLOperators.SemiColon;
            var leftIndent = this.LeftIndent;
            var firstLine = this.FirstLineIndent;
            if (this.ListFormat.ListLevel != null) {
                leftIndent -= 48;
                firstLine += 24;
            }
            style += CssConstants.Margin + HTMLOperators.Colon
                + this.BeforeSpacing.toString() + "px "
                + this.RightIndent.toString() + "px "
                + this.AfterSpacing.toString() + "px "
                + leftIndent.toString() + "px;";
            if (firstLine != 0) {
                style += CssConstants.TextIndent + HTMLOperators.Colon + firstLine.toString() + CssConstants.Px + HTMLOperators.SemiColon;
            }
            if (this.LineSpacingType == LineSpacingType.Multiple) {
                style += CssConstants.LineHeight + HTMLOperators.Colon + (this.LineSpacing * 100).toString() + CssConstants.Percentage + HTMLOperators.SemiColon;
            }
            else {
                style += CssConstants.LineHeight + HTMLOperators.Colon + this.LineSpacing.toString() + CssConstants.Px + HTMLOperators.SemiColon;
            }
            style += "\" ";
            return style;
        };
        ParagraphFormat.prototype.Dispose = function () {
            this.SetOwner(null);
        };
        return ParagraphFormat;
    }(BaseNode));
    DocumentEditorFeatures.ParagraphFormat = ParagraphFormat;
    var ListFormat = (function (_super) {
        __extends(ListFormat, _super);
        function ListFormat(node) {
            _super.call(this, node);
            this.listId = -1;
            this.listLevelNumber = 0;
        }
        ;
        Object.defineProperty(ListFormat.prototype, "Document", {
            get: function () {
                if (this.OwnerBase instanceof ParagraphFormat)
                    return this.OwnerBase.Document;
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListFormat.prototype, "ListId", {
            get: function () { return this.listId; },
            set: function (listId) { this.listId = listId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListFormat.prototype, "ListLevelNumber", {
            get: function () { return this.listLevelNumber; },
            set: function (value) { this.listLevelNumber = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListFormat.prototype, "ListLevel", {
            get: function () {
                if (this.List != null)
                    return this.List.GetListLevel(this.ListLevelNumber);
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListFormat.prototype, "List", {
            get: function () {
                if (this.Document != null)
                    return this.Document.GetListByID(this.ListId);
            },
            enumerable: true,
            configurable: true
        });
        return ListFormat;
    }(BaseNode));
    DocumentEditorFeatures.ListFormat = ListFormat;
    var TableHolder = (function () {
        function TableHolder() {
            this.tableColumns = new TableColumnAdvCollection();
        }
        Object.defineProperty(TableHolder.prototype, "Columns", {
            get: function () {
                return this.tableColumns;
            },
            enumerable: true,
            configurable: true
        });
        TableHolder.prototype.GetPreviousSpannedCellWidth = function (prevColumnIndex, curColumnIndex) {
            var width = 0;
            for (var i = prevColumnIndex; i < curColumnIndex; i++) {
                width += this.tableColumns[i].PreferredWidth;
            }
            return width;
        };
        TableHolder.prototype.Dispose = function () {
            if (this.tableColumns != null) {
                this.tableColumns.Clear();
                this.tableColumns = null;
            }
        };
        return TableHolder;
    }());
    DocumentEditorFeatures.TableHolder = TableHolder;
    var Shading = (function (_super) {
        __extends(Shading, _super);
        function Shading(node) {
            _super.call(this, node);
        }
        Object.defineProperty(Shading.prototype, "BackgroundColor", {
            get: function () {
                return this.backgroundColor;
            },
            set: function (value) {
                this.backgroundColor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shading.prototype, "ForegroundColor", {
            get: function () { return this.foregroundColor; },
            set: function (value) { this.foregroundColor = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shading.prototype, "TextureStyle", {
            get: function () { return this.textureStyle; },
            set: function (value) { this.textureStyle = value; },
            enumerable: true,
            configurable: true
        });
        Shading.prototype.Dispose = function () {
            this.SetOwner(null);
        };
        return Shading;
    }(BaseNode));
    DocumentEditorFeatures.Shading = Shading;
    var Borders = (function (_super) {
        __extends(Borders, _super);
        function Borders(node) {
            _super.call(this, node);
            this.Left = new Border(this);
            this.Right = new Border(this);
            this.Top = new Border(this);
            this.Bottom = new Border(this);
            this.DiagonalUp = new Border(this);
            this.DiagonalDown = new Border(this);
            this.Horizontal = new Border(this);
            this.Vertical = new Border(this);
        }
        Object.defineProperty(Borders.prototype, "Left", {
            get: function () { return this.left; },
            set: function (value) { this.left = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Borders.prototype, "Right", {
            get: function () { return this.right; },
            set: function (value) { this.right = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Borders.prototype, "Top", {
            get: function () { return this.top; },
            set: function (value) { this.top = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Borders.prototype, "Bottom", {
            get: function () { return this.bottom; },
            set: function (value) { this.bottom = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Borders.prototype, "Horizontal", {
            get: function () { return this.horizontal; },
            set: function (value) { this.horizontal = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Borders.prototype, "Vertical", {
            get: function () { return this.vertical; },
            set: function (value) { this.vertical = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Borders.prototype, "DiagonalUp", {
            get: function () { return this.diagonalUp; },
            set: function (value) { this.diagonalUp = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Borders.prototype, "DiagonalDown", {
            get: function () { return this.diagonalDown; },
            set: function (value) { this.diagonalDown = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Borders.prototype, "LineStyle", {
            set: function (value) {
                if (this.Left != null)
                    this.Left.LineStyle = value;
                if (this.Right != null)
                    this.Right.LineStyle = value;
                if (this.Top != null)
                    this.Top.LineStyle = value;
                if (this.Bottom != null)
                    this.Bottom.LineStyle = value;
                if (this.Horizontal != null)
                    this.Horizontal.LineStyle = value;
                if (this.Vertical != null)
                    this.Vertical.LineStyle = value;
                if (this.DiagonalUp != null)
                    this.DiagonalUp.LineStyle = value;
                if (this.DiagonalDown != null)
                    this.DiagonalDown.LineStyle = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Borders.prototype, "LineWidth", {
            set: function (value) {
                if (this.Left != null)
                    this.Left.LineWidth = value;
                if (this.Right != null)
                    this.Right.LineWidth = value;
                if (this.Top != null)
                    this.Top.LineWidth = value;
                if (this.Bottom != null)
                    this.Bottom.LineWidth = value;
                if (this.Horizontal != null)
                    this.Horizontal.LineWidth = value;
                if (this.Vertical != null)
                    this.Vertical.LineWidth = value;
                if (this.DiagonalUp != null)
                    this.DiagonalUp.LineWidth = value;
                if (this.DiagonalDown != null)
                    this.DiagonalDown.LineWidth = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Borders.prototype, "Color", {
            set: function (value) {
                if (this.Left != null)
                    this.Left.Color = value;
                if (this.Right != null)
                    this.Right.Color = value;
                if (this.Top != null)
                    this.Top.Color = value;
                if (this.Bottom != null)
                    this.Bottom.Color = value;
                if (this.Horizontal != null)
                    this.Horizontal.Color = value;
                if (this.Vertical != null)
                    this.Vertical.Color = value;
                if (this.DiagonalUp != null)
                    this.DiagonalUp.Color = value;
                if (this.DiagonalDown != null)
                    this.DiagonalDown.Color = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Borders.prototype, "OwnerCell", {
            get: function () {
                if (this.OwnerBase instanceof CellFormat && this.OwnerBase.OwnerBase instanceof TableCellAdv)
                    return this.OwnerBase.OwnerBase;
                else
                    return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Borders.prototype, "OwnerRow", {
            get: function () {
                if (this.OwnerCell != null)
                    return this.OwnerCell.OwnerRow;
                else if (this.OwnerBase instanceof RowFormat && this.OwnerBase.OwnerBase instanceof TableRowAdv)
                    return this.OwnerBase.OwnerBase;
                else
                    return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Borders.prototype, "OwnerTable", {
            get: function () {
                if (this.OwnerRow != null)
                    return this.OwnerRow.OwnerTable;
                else if (this.OwnerBase instanceof TableFormat && this.OwnerBase.OwnerBase instanceof TableAdv)
                    return this.OwnerBase.OwnerBase;
                else
                    return null;
            },
            enumerable: true,
            configurable: true
        });
        Borders.prototype.GetTableLeftBorder = function () {
            if (this.Left != null)
                return this.Left;
            else {
                var border = new Border(this);
                border.LineStyle = LineStyle.Single;
                border.LineWidth = 0.66;
                return border;
            }
        };
        Borders.prototype.GetTableRightBorder = function () {
            if (this.Right != null)
                return this.Right;
            else {
                var border = new Border(this);
                border.LineStyle = LineStyle.Single;
                border.LineWidth = 0.66;
                return border;
            }
        };
        Borders.prototype.GetTableTopBorder = function () {
            if (this.Top != null)
                return this.Top;
            else {
                var border = new Border(this);
                border.LineStyle = LineStyle.Single;
                border.LineWidth = 0.66;
                return border;
            }
        };
        Borders.prototype.GetTableBottomBorder = function () {
            if (this.Bottom != null)
                return this.Bottom;
            else {
                var border = new Border(this);
                border.LineStyle = LineStyle.Single;
                border.LineWidth = 0.66;
                return border;
            }
        };
        Borders.prototype.GetCellLeftBorder = function (TableCell) {
            var leftBorder = null;
            var cellBorder = TableCell.CellFormat.Borders;
            var rowBorders = TableCell.OwnerRow != null ? TableCell.OwnerRow.RowFormat.Borders : null;
            var tableBorders = TableCell.OwnerTable != null ? TableCell.OwnerTable.TableFormat.Borders : null;
            if (cellBorder.Left != null)
                leftBorder = cellBorder.Left;
            if (leftBorder == null)
                leftBorder = this.GetLeftBorderToRenderByHierarchy(leftBorder, rowBorders, tableBorders);
            if (TableCell.OwnerTable.TableFormat.CellSpacing > 0) {
                leftBorder = this.GetLeftBorderToRenderByHierarchy(leftBorder, rowBorders, tableBorders);
            }
            else {
                var prevCell = null;
                if (TableCell.PreviousNode != null)
                    prevCell = TableCell.PreviousNode;
                leftBorder = this.GetPrevCellLeftBorder(leftBorder, prevCell);
            }
            if (leftBorder == null)
                leftBorder = new Border(this);
            return leftBorder;
        };
        Borders.prototype.GetPrevCellLeftBorder = function (leftBorder, prevCell) {
            if ((prevCell == null || (leftBorder != null && (leftBorder.LineStyle == LineStyle.None && !leftBorder.HasNoneStyle)))) {
                if (leftBorder != null && !(leftBorder.OwnerBase.OwnerBase instanceof TableFormat))
                    return this.GetLeftBorderToRenderByHierarchy(leftBorder, leftBorder.OwnerBase.OwnerRow.RowFormat.Borders, leftBorder.OwnerBase.OwnerTable.TableFormat.Borders);
            }
            else {
                var borderToRender = void 0;
                var prevCellRightBorder = null;
                if (prevCell.CellFormat.Borders != null && prevCell.CellFormat.Borders.Right != null && prevCell.CellFormat.Borders.Right.LineStyle != LineStyle.None)
                    prevCellRightBorder = prevCell.CellFormat.Borders.Right;
                if (prevCellRightBorder != null && prevCellRightBorder.LineStyle != LineStyle.None)
                    borderToRender = this.GetBorderBasedOnPriority(prevCellRightBorder, leftBorder);
                else if (leftBorder != null && !(leftBorder.OwnerBase.OwnerBase instanceof TableFormat))
                    return this.GetLeftBorderToRenderByHierarchy(leftBorder, leftBorder.OwnerBase.OwnerRow.RowFormat.Borders, leftBorder.OwnerBase.OwnerTable.TableFormat.Borders);
            }
            return leftBorder;
        };
        Borders.prototype.GetLeftBorderToRenderByHierarchy = function (leftBorder, rowBorders, tableBorders) {
            if (leftBorder != null && (leftBorder.LineStyle != LineStyle.None || leftBorder.HasNoneStyle))
                return leftBorder;
            else if (leftBorder != null && (leftBorder.OwnerBase instanceof Borders) && leftBorder.OwnerBase.OwnerCell.ColumnIndex == 0) {
                if (tableBorders != null && tableBorders.Left != null)
                    leftBorder = tableBorders.Left;
                return leftBorder;
            }
            else if (rowBorders != null && rowBorders.Vertical != null && rowBorders.Vertical.LineStyle != LineStyle.None)
                return leftBorder = rowBorders.Vertical;
            else if (tableBorders != null && tableBorders.Vertical != null && tableBorders.Vertical.LineStyle != LineStyle.None)
                return leftBorder = tableBorders.Vertical;
            else {
                return leftBorder;
            }
        };
        Borders.prototype.GetCellDiagonalUpBorder = function (TableCell) {
            var diagonalUpBorder = null;
            var cellBorder = null;
            cellBorder = TableCell.CellFormat.Borders;
            if (cellBorder.DiagonalUp != null)
                diagonalUpBorder = cellBorder.DiagonalUp;
            return diagonalUpBorder;
        };
        Borders.prototype.GetCellDiagonalDownBorder = function (TableCell) {
            var diagonalDownBorder = null;
            var cellBorder = null;
            cellBorder = TableCell.CellFormat.Borders;
            if (cellBorder.DiagonalDown != null)
                diagonalDownBorder = cellBorder.DiagonalDown;
            return diagonalDownBorder;
        };
        Borders.prototype.GetCellRightBorder = function (TableCell) {
            var rightBorder = null;
            var cellBorder = TableCell.CellFormat.Borders;
            var rowBorders = TableCell.OwnerRow != null ? TableCell.OwnerRow.RowFormat.Borders : null;
            var tableBorders = TableCell.OwnerTable != null ? TableCell.OwnerTable.TableFormat.Borders : null;
            if (cellBorder.Right != null)
                rightBorder = cellBorder.Right;
            if (rightBorder == null)
                rightBorder = this.GetRightBorderToRenderByHierarchy(rightBorder, rowBorders, tableBorders);
            if (TableCell.OwnerTable.TableFormat.CellSpacing > 0) {
                rightBorder = this.GetRightBorderToRenderByHierarchy(rightBorder, rowBorders, tableBorders);
            }
            else {
                var nextCell = null;
                if (TableCell.NextNode != null)
                    nextCell = TableCell.NextNode;
                rightBorder = this.GetAdjacentCellRightBorder(rightBorder, nextCell);
            }
            if (rightBorder == null)
                rightBorder = new Border(this);
            return rightBorder;
        };
        Borders.prototype.GetAdjacentCellRightBorder = function (rightBorder, nextCell) {
            if (nextCell == null || (rightBorder != null && (rightBorder.LineStyle == LineStyle.None && !rightBorder.HasNoneStyle))) {
                if (rightBorder != null && !(rightBorder.OwnerBase.OwnerBase instanceof TableFormat))
                    return this.GetRightBorderToRenderByHierarchy(rightBorder, rightBorder.OwnerBase.OwnerRow.RowFormat.Borders, rightBorder.OwnerBase.OwnerTable.TableFormat.Borders);
            }
            else {
                var nextCellLeftBorder = null;
                if (nextCell.CellFormat.Borders != null && nextCell.CellFormat.Borders.Left != null && nextCell.CellFormat.Borders.Left.LineStyle != LineStyle.None)
                    nextCellLeftBorder = nextCell.CellFormat.Borders.Left;
                if (nextCellLeftBorder != null && nextCellLeftBorder.LineStyle != LineStyle.None)
                    return this.GetBorderBasedOnPriority(rightBorder, nextCellLeftBorder);
                else if (rightBorder != null && !(rightBorder.OwnerBase.OwnerBase instanceof TableFormat))
                    return this.GetRightBorderToRenderByHierarchy(rightBorder, rightBorder.OwnerBase.OwnerRow.RowFormat.Borders, rightBorder.OwnerBase.OwnerTable.TableFormat.Borders);
            }
            return rightBorder;
        };
        Borders.prototype.GetRightBorderToRenderByHierarchy = function (rightBorder, rowBorders, tableBorders) {
            if (rightBorder != null && (rightBorder.LineStyle != LineStyle.None || rightBorder.HasNoneStyle))
                return rightBorder;
            else if (rightBorder != null && (rightBorder.OwnerBase instanceof Borders) && rightBorder.OwnerBase.OwnerCell.ColumnIndex == rightBorder.OwnerBase.OwnerCell.OwnerRow.Cells.Count - 1) {
                if (tableBorders != null && tableBorders.Right != null)
                    rightBorder = tableBorders.Right;
                return rightBorder;
            }
            else if (rowBorders != null && rowBorders.Vertical != null && rowBorders.Vertical.LineStyle != LineStyle.None)
                return rightBorder = rowBorders.Vertical;
            else if (tableBorders != null && tableBorders.Vertical != null && tableBorders.Vertical.LineStyle != LineStyle.None)
                return rightBorder = tableBorders.Vertical;
            else {
                return rightBorder;
            }
        };
        Borders.prototype.GetCellTopBorder = function (TableCell) {
            var topBorder = null;
            var cellBorder = TableCell.CellFormat.Borders;
            var rowBorders = TableCell.OwnerRow != null ? TableCell.OwnerRow.RowFormat.Borders : null;
            var tableBorders = TableCell.OwnerTable != null ? TableCell.OwnerTable.TableFormat.Borders : null;
            if (cellBorder.Top != null)
                topBorder = cellBorder.Top;
            if (topBorder == null)
                topBorder = this.GetTopBorderToRenderByHierarchy(topBorder, rowBorders, tableBorders);
            if (TableCell.OwnerTable.TableFormat.CellSpacing > 0) {
                topBorder = this.GetTopBorderToRenderByHierarchy(topBorder, rowBorders, tableBorders);
            }
            else {
                var prevTopCell = null;
                var prevRow = TableCell.OwnerRow.PreviousNode;
                if (prevRow != null && TableCell.ColumnIndex < prevRow.Cells.Count)
                    prevTopCell = prevRow.Cells[TableCell.ColumnIndex];
                topBorder = this.GetPrevCellTopBorder(topBorder, prevTopCell);
            }
            if (topBorder == null)
                topBorder = new Border(this);
            return topBorder;
        };
        Borders.prototype.GetPrevCellTopBorder = function (topBorder, prevTopCell) {
            if (prevTopCell == null || (topBorder != null && (topBorder.LineStyle == LineStyle.None && !topBorder.HasNoneStyle))) {
                if (topBorder != null && !(topBorder.OwnerBase.OwnerBase instanceof TableFormat))
                    return this.GetTopBorderToRenderByHierarchy(topBorder, topBorder.OwnerBase.OwnerRow.RowFormat.Borders, topBorder.OwnerBase.OwnerTable.TableFormat.Borders);
            }
            else {
                var prevTopCellBottomBorder = null;
                if (prevTopCell.CellFormat.Borders != null && prevTopCell.CellFormat.Borders.Bottom != null && prevTopCell.CellFormat.Borders.Bottom.LineStyle != LineStyle.None)
                    prevTopCellBottomBorder = prevTopCell.CellFormat.Borders.Left;
                if (prevTopCellBottomBorder != null && prevTopCellBottomBorder.LineStyle != LineStyle.None)
                    return this.GetBorderBasedOnPriority(topBorder, prevTopCellBottomBorder);
                else if (topBorder != null && !(topBorder.OwnerBase.OwnerBase instanceof TableFormat))
                    return this.GetTopBorderToRenderByHierarchy(topBorder, topBorder.OwnerBase.OwnerRow.RowFormat.Borders, topBorder.OwnerBase.OwnerTable.TableFormat.Borders);
            }
            return topBorder;
        };
        Borders.prototype.GetTopBorderToRenderByHierarchy = function (topBorder, rowBorders, tableBorders) {
            if (topBorder != null && (topBorder.LineStyle != LineStyle.None || topBorder.HasNoneStyle))
                return topBorder;
            else if (topBorder != null && (topBorder.OwnerBase instanceof Borders) && topBorder.OwnerBase.OwnerCell.OwnerRow.RowIndex == 0) {
                if (tableBorders != null && tableBorders.Top != null)
                    topBorder = tableBorders.Top;
                return topBorder;
            }
            else if (rowBorders != null && rowBorders.Horizontal != null && rowBorders.Horizontal.LineStyle != LineStyle.None)
                return topBorder = rowBorders.Horizontal;
            else if (tableBorders != null && tableBorders.Horizontal != null && tableBorders.Horizontal.LineStyle != LineStyle.None)
                return topBorder = tableBorders.Horizontal;
            else {
                return topBorder;
            }
        };
        Borders.prototype.GetCellBottomBorder = function (TableCell) {
            var bottomBorder = null;
            var cellBorder = TableCell.CellFormat.Borders;
            var rowBorders = TableCell.OwnerRow != null ? TableCell.OwnerRow.RowFormat.Borders : null;
            var tableBorders = TableCell.OwnerTable != null ? TableCell.OwnerTable.TableFormat.Borders : null;
            if (cellBorder.Bottom != null)
                bottomBorder = cellBorder.Bottom;
            if (bottomBorder == null)
                bottomBorder = this.GetBottomBorderToRenderByHierarchy(bottomBorder, rowBorders, tableBorders);
            if (TableCell.OwnerTable.TableFormat.CellSpacing > 0) {
                bottomBorder = this.GetBottomBorderToRenderByHierarchy(bottomBorder, rowBorders, tableBorders);
            }
            else {
                var nextBottomCell = null;
                var nextRow = TableCell.OwnerRow.NextNode;
                if (nextRow != null && TableCell.ColumnIndex < nextRow.Cells.Count)
                    nextBottomCell = nextRow.Cells[TableCell.ColumnIndex];
                bottomBorder = this.GetAdjacentCellBottomBorder(bottomBorder, nextBottomCell);
            }
            if (bottomBorder == null)
                bottomBorder = new Border(this);
            return bottomBorder;
        };
        Borders.prototype.GetAdjacentCellBottomBorder = function (bottomBorder, nextBottomCell) {
            if (nextBottomCell == null || (bottomBorder != null && (bottomBorder.LineStyle == LineStyle.None && !bottomBorder.HasNoneStyle))) {
                if (bottomBorder != null && !(bottomBorder.OwnerBase.OwnerBase instanceof TableFormat))
                    return this.GetBottomBorderToRenderByHierarchy(bottomBorder, bottomBorder.OwnerBase.OwnerRow.RowFormat.Borders, bottomBorder.OwnerBase.OwnerTable.TableFormat.Borders);
            }
            else {
                var prevBottomCellTopBorder = null;
                if (nextBottomCell.CellFormat.Borders != null && nextBottomCell.CellFormat.Borders.Top != null && nextBottomCell.CellFormat.Borders.Top.LineStyle != LineStyle.None)
                    prevBottomCellTopBorder = nextBottomCell.CellFormat.Borders.Top;
                if (prevBottomCellTopBorder != null && prevBottomCellTopBorder.LineStyle != LineStyle.None)
                    return this.GetBorderBasedOnPriority(bottomBorder, prevBottomCellTopBorder);
                else if (bottomBorder != null && !(bottomBorder.OwnerBase.OwnerBase instanceof TableFormat))
                    return this.GetBottomBorderToRenderByHierarchy(bottomBorder, bottomBorder.OwnerBase.OwnerRow.RowFormat.Borders, bottomBorder.OwnerBase.OwnerTable.TableFormat.Borders);
            }
            return bottomBorder;
        };
        Borders.prototype.GetBottomBorderToRenderByHierarchy = function (bottomBorder, rowBorders, tableBorders) {
            if (bottomBorder != null && (bottomBorder.LineStyle != LineStyle.None || bottomBorder.HasNoneStyle))
                return bottomBorder;
            else if (bottomBorder != null && (bottomBorder.OwnerBase instanceof Borders) && bottomBorder.OwnerBase.OwnerCell.OwnerRow.RowIndex + bottomBorder.OwnerBase.OwnerCell.CellFormat.RowSpan == bottomBorder.OwnerBase.OwnerCell.OwnerTable.Rows.Count) {
                if (tableBorders != null && tableBorders.Bottom != null)
                    bottomBorder = tableBorders.Bottom;
                return bottomBorder;
            }
            else if (rowBorders != null && rowBorders.Horizontal != null && rowBorders.Horizontal.LineStyle != LineStyle.None)
                return bottomBorder = rowBorders.Horizontal;
            else if (tableBorders != null && tableBorders.Horizontal != null && tableBorders.Horizontal.LineStyle != LineStyle.None)
                return bottomBorder = tableBorders.Horizontal;
            else {
                return bottomBorder;
            }
        };
        Borders.prototype.GetBorderBasedOnPriority = function (border, adjacentBorder) {
            if (border == null)
                return adjacentBorder;
            else if (adjacentBorder == null)
                return border;
            var borderWeight = border.GetBorderWeight();
            var adjacentBorderWeight = adjacentBorder.GetBorderWeight();
            if (borderWeight == adjacentBorderWeight) {
                var borderPriority = border.GetPrecedence();
                var adjacentBorderPriority = adjacentBorder.GetPrecedence();
                if (borderPriority == adjacentBorderPriority) {
                    var borderColInRGB = this.ConvertHexToRGB(border.Color);
                    var R1 = borderColInRGB.R;
                    var G1 = borderColInRGB.G;
                    var B1 = borderColInRGB.B;
                    var adjacentBorderColInRGB = this.ConvertHexToRGB(adjacentBorder.Color);
                    var R2 = adjacentBorderColInRGB.R;
                    var G2 = adjacentBorderColInRGB.G;
                    var B2 = adjacentBorderColInRGB.B;
                    var borderBrightness = (R1 + B1 + (2 * G1));
                    var adjacentBorderBrightness = (R2 + B2 + (2 * G2));
                    if (borderBrightness == adjacentBorderBrightness) {
                        borderBrightness = (B1 + (2 * G1));
                        adjacentBorderBrightness = (B2 + (2 * G2));
                        if (borderBrightness == adjacentBorderBrightness) {
                            if (G1 == G2)
                                return border;
                            else if (G1 > G2)
                                return adjacentBorder;
                            else
                                return border;
                        }
                        else if (borderBrightness > adjacentBorderBrightness)
                            return adjacentBorder;
                        else
                            return border;
                    }
                    else if (borderBrightness > adjacentBorderBrightness)
                        return adjacentBorder;
                    else
                        return border;
                }
                else if (borderPriority > adjacentBorderPriority)
                    return border;
                else
                    return adjacentBorder;
            }
            else if (borderWeight > adjacentBorderWeight)
                return border;
            else
                return adjacentBorder;
        };
        Borders.prototype.ConvertHexToRGB = function (colorCode) {
            if (colorCode) {
                colorCode = colorCode.replace(/[^0-9A-â€Œâ€‹F]/gi, '');
                var colCodeNo = parseInt(colorCode, 16);
                var r = (colCodeNo >> 16) & 255;
                var g = (colCodeNo >> 8) & 255;
                var b = colCodeNo & 255;
                return { "R": r, "G": g, "B": b };
            }
        };
        Borders.prototype.GetAsHtmlStyle = function () {
            var style = "";
            var border = null;
            border = this.OwnerCell != null ? this.GetCellLeftBorder(this.OwnerCell) : this.GetTableLeftBorder();
            if (border != null && border.LineStyle != LineStyle.None)
                style += border.GetAsHtmlStyle("left");
            else if (border != null && border.HasNoneStyle)
                style += "border-left-style:none;";
            border = this.OwnerCell != null ? this.GetCellRightBorder(this.OwnerCell) : this.GetTableRightBorder();
            if (border != null && border.LineStyle != LineStyle.None)
                style += border.GetAsHtmlStyle("right");
            else if (border != null && border.HasNoneStyle)
                style += "border-right-style:none;";
            border = this.OwnerCell != null ? this.GetCellTopBorder(this.OwnerCell) : this.GetTableTopBorder();
            if (border != null && border.LineStyle != LineStyle.None)
                style += border.GetAsHtmlStyle("top");
            else if (border != null && border.HasNoneStyle)
                style += "border-top-style:none;";
            border = this.OwnerCell != null ? this.GetCellBottomBorder(this.OwnerCell) : this.GetTableBottomBorder();
            if (border != null && border.LineStyle != LineStyle.None)
                style += border.GetAsHtmlStyle("bottom");
            else if (border != null && border.HasNoneStyle)
                style += "border-bottom-style:none;";
            return style;
        };
        Borders.prototype.Dispose = function () {
            this.SetOwner(null);
        };
        return Borders;
    }(BaseNode));
    DocumentEditorFeatures.Borders = Borders;
    var Border = (function (_super) {
        __extends(Border, _super);
        function Border(node) {
            _super.call(this, node);
            this.color = "#000000";
            this.lineStyle = LineStyle.Single;
            this.lineWidth = 0;
        }
        Object.defineProperty(Border.prototype, "Color", {
            get: function () { return this.color; },
            set: function (value) { this.color = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "LineStyle", {
            get: function () { return this.lineStyle; },
            set: function (value) { this.lineStyle = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "LineWidth", {
            get: function () { return this.lineWidth; },
            set: function (value) { this.lineWidth = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "Shadow", {
            get: function () { return this.shadow; },
            set: function (value) { this.shadow = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "Space", {
            get: function () { return this.space; },
            set: function (value) { this.space = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Border.prototype, "HasNoneStyle", {
            get: function () { return this.hasNoneStyle; },
            set: function (value) { this.hasNoneStyle = value; },
            enumerable: true,
            configurable: true
        });
        Border.prototype.GetPrecedence = function () {
            var value = 0;
            switch (this.LineStyle) {
                case LineStyle.Single:
                    value = 1;
                    break;
                case LineStyle.Thick:
                    value = 2;
                    break;
                case LineStyle.Double:
                    value = 3;
                    break;
                case LineStyle.Dot:
                    value = 4;
                    break;
                case LineStyle.DashLargeGap:
                    value = 5;
                    break;
                case LineStyle.DashDot:
                    value = 6;
                    break;
                case LineStyle.DashDotDot:
                    value = 7;
                    break;
                case LineStyle.Triple:
                    value = 8;
                    break;
                case LineStyle.ThinThickSmallGap:
                    value = 9;
                    break;
                case LineStyle.ThickThinSmallGap:
                    value = 10;
                    break;
                case LineStyle.ThinThickThinSmallGap:
                    value = 11;
                    break;
                case LineStyle.ThinThickMediumGap:
                    value = 12;
                    break;
                case LineStyle.ThickThinMediumGap:
                    value = 13;
                    break;
                case LineStyle.ThinThickThinMediumGap:
                    value = 14;
                    break;
                case LineStyle.ThinThickLargeGap:
                    value = 15;
                    break;
                case LineStyle.ThickThinLargeGap:
                    value = 16;
                    break;
                case LineStyle.ThinThickThinLargeGap:
                    value = 17;
                    break;
                case LineStyle.SingleWavy:
                    value = 18;
                    break;
                case LineStyle.DoubleWavy:
                    value = 19;
                    break;
                case LineStyle.DashSmallGap:
                    value = 20;
                    break;
                case LineStyle.DashDotStroked:
                    value = 21;
                    break;
                case LineStyle.Emboss3D:
                    value = 22;
                    break;
                case LineStyle.Engrave3D:
                    value = 23;
                    break;
                case LineStyle.Outset:
                    value = 24;
                    break;
                case LineStyle.Inset:
                    value = 25;
                    break;
            }
            return value;
        };
        Border.prototype.GetBorderWeight = function () {
            var weight = 0;
            var numberOfLines = this.GetNumberOfLines();
            var borderNumber = this.GetBorderNumber();
            switch (this.LineStyle) {
                case LineStyle.Single:
                case LineStyle.DashSmallGap:
                case LineStyle.DashDot:
                case LineStyle.DashDotDot:
                case LineStyle.Double:
                case LineStyle.Triple:
                case LineStyle.ThinThickSmallGap:
                case LineStyle.ThickThinSmallGap:
                case LineStyle.ThinThickThinSmallGap:
                case LineStyle.ThinThickMediumGap:
                case LineStyle.ThickThinMediumGap:
                case LineStyle.ThinThickThinMediumGap:
                case LineStyle.ThinThickLargeGap:
                case LineStyle.ThickThinLargeGap:
                case LineStyle.ThinThickThinLargeGap:
                case LineStyle.SingleWavy:
                case LineStyle.DoubleWavy:
                case LineStyle.DashDotStroked:
                case LineStyle.Emboss3D:
                case LineStyle.Engrave3D:
                case LineStyle.Outset:
                case LineStyle.Inset:
                case LineStyle.Thick:
                    weight = numberOfLines * borderNumber;
                    break;
                case LineStyle.Dot:
                case LineStyle.DashLargeGap:
                    weight = 1;
                    break;
            }
            return weight;
        };
        Border.prototype.GetBorderNumber = function () {
            var borderNumber = 0;
            switch (this.LineStyle) {
                case LineStyle.Single:
                    borderNumber = 1;
                    break;
                case LineStyle.Thick:
                    borderNumber = 2;
                    break;
                case LineStyle.Double:
                    borderNumber = 3;
                    break;
                case LineStyle.Dot:
                    borderNumber = 4;
                    break;
                case LineStyle.DashLargeGap:
                    borderNumber = 5;
                    break;
                case LineStyle.DashDot:
                    borderNumber = 6;
                    break;
                case LineStyle.DashDotDot:
                    borderNumber = 7;
                    break;
                case LineStyle.Triple:
                    borderNumber = 8;
                    break;
                case LineStyle.ThinThickSmallGap:
                    borderNumber = 9;
                    break;
                case LineStyle.ThickThinSmallGap:
                    borderNumber = 10;
                    break;
                case LineStyle.ThinThickThinSmallGap:
                    borderNumber = 11;
                    break;
                case LineStyle.ThinThickMediumGap:
                    borderNumber = 12;
                    break;
                case LineStyle.ThickThinMediumGap:
                    borderNumber = 13;
                    break;
                case LineStyle.ThinThickThinMediumGap:
                    borderNumber = 14;
                    break;
                case LineStyle.ThinThickLargeGap:
                    borderNumber = 15;
                    break;
                case LineStyle.ThickThinLargeGap:
                    borderNumber = 16;
                    break;
                case LineStyle.ThinThickThinLargeGap:
                    borderNumber = 17;
                    break;
                case LineStyle.SingleWavy:
                    borderNumber = 18;
                    break;
                case LineStyle.DoubleWavy:
                    borderNumber = 19;
                    break;
                case LineStyle.DashSmallGap:
                    borderNumber = 20;
                    break;
                case LineStyle.DashDotStroked:
                    borderNumber = 21;
                    break;
                case LineStyle.Emboss3D:
                    borderNumber = 22;
                    break;
                case LineStyle.Engrave3D:
                    borderNumber = 23;
                    break;
                case LineStyle.Outset:
                    borderNumber = 24;
                    break;
                case LineStyle.Inset:
                    borderNumber = 25;
                    break;
            }
            return borderNumber;
        };
        Border.prototype.GetNumberOfLines = function () {
            var value = 0;
            switch (this.LineStyle) {
                case LineStyle.Single:
                case LineStyle.Dot:
                case LineStyle.DashSmallGap:
                case LineStyle.DashLargeGap:
                case LineStyle.DashDot:
                case LineStyle.DashDotDot:
                    value = 1;
                    break;
                case LineStyle.Double:
                    value = 3;
                    break;
                case LineStyle.Triple:
                    value = 5;
                    break;
                case LineStyle.ThinThickSmallGap:
                    value = 3;
                    break;
                case LineStyle.ThickThinSmallGap:
                    value = 3;
                    break;
                case LineStyle.ThinThickThinSmallGap:
                    value = 5;
                    break;
                case LineStyle.ThinThickMediumGap:
                    value = 3;
                    break;
                case LineStyle.ThickThinMediumGap:
                    value = 3;
                    break;
                case LineStyle.ThinThickThinMediumGap:
                    value = 5;
                    break;
                case LineStyle.ThinThickLargeGap:
                    value = 3;
                    break;
                case LineStyle.ThickThinLargeGap:
                    value = 3;
                    break;
                case LineStyle.ThinThickThinLargeGap:
                    value = 5;
                    break;
                case LineStyle.SingleWavy:
                    value = 1;
                    break;
                case LineStyle.DoubleWavy:
                    value = 2;
                    break;
                case LineStyle.DashDotStroked:
                    value = 1;
                    break;
                case LineStyle.Emboss3D:
                case LineStyle.Engrave3D:
                    value = 3;
                    break;
                case LineStyle.Outset:
                case LineStyle.Inset:
                case LineStyle.Thick:
                    value = 1;
                    break;
            }
            return value;
        };
        Border.prototype.GetLineWidth = function () {
            switch (this.LineStyle) {
                case LineStyle.None:
                    return 0;
                case LineStyle.Triple:
                case LineStyle.Double:
                case LineStyle.ThinThickSmallGap:
                case LineStyle.ThickThinSmallGap:
                case LineStyle.ThinThickThinSmallGap:
                case LineStyle.ThinThickMediumGap:
                case LineStyle.ThickThinMediumGap:
                case LineStyle.ThinThickThinMediumGap:
                case LineStyle.ThinThickLargeGap:
                case LineStyle.ThickThinLargeGap:
                case LineStyle.ThinThickThinLargeGap:
                case LineStyle.Emboss3D:
                case LineStyle.Engrave3D:
                    {
                        var lineArray = this.GetBorderLineWidthArray(LineStyle, this.LineWidth);
                        var width = 0;
                        for (var i = 0; i < lineArray.length; i++) {
                            width += lineArray[i];
                        }
                        return width;
                    }
                case LineStyle.Single:
                case LineStyle.DashLargeGap:
                case LineStyle.DashSmallGap:
                case LineStyle.Dot:
                case LineStyle.DashDot:
                case LineStyle.DashDotDot:
                case LineStyle.Thick:
                    return this.LineWidth;
                case LineStyle.SingleWavy:
                    return (this.LineWidth == 1.5 ? 3 : 2.5);
                case LineStyle.DoubleWavy:
                    return (6.75);
                case LineStyle.DashDotStroked:
                case LineStyle.Outset:
                    return this.LineWidth;
            }
            return this.LineWidth;
        };
        Border.prototype.GetBorderLineWidthArray = function (LineStyle, lineWidth) {
            var borderLineArray = [lineWidth];
            switch (this.LineStyle) {
                case LineStyle.Double:
                    borderLineArray = [1, 1, 1];
                    break;
                case LineStyle.ThinThickSmallGap:
                    borderLineArray = [1, -0.75, -0.75];
                    break;
                case LineStyle.ThickThinSmallGap:
                    borderLineArray = [-0.75, -0.75, 1];
                    break;
                case LineStyle.ThinThickMediumGap:
                    borderLineArray = [1, 0.5, 0.5];
                    break;
                case LineStyle.ThickThinMediumGap:
                    borderLineArray = [0.5, 0.5, 1];
                    break;
                case LineStyle.ThinThickLargeGap:
                    borderLineArray = [-1.5, 1, -0.75];
                    break;
                case LineStyle.ThickThinLargeGap:
                    borderLineArray = [-0.75, 1, -1.5];
                    break;
                case LineStyle.Triple:
                    borderLineArray = [1, 1, 1, 1, 1];
                    break;
                case LineStyle.ThinThickThinSmallGap:
                    borderLineArray = [-0.75, -0.75, 1, -0.75, -0.75];
                    break;
                case LineStyle.ThinThickThinMediumGap:
                    borderLineArray = [0.5, 0.5, 1, 0.5, 0.5];
                    break;
                case LineStyle.ThinThickThinLargeGap:
                    borderLineArray = [-0.75, 1, -1.5, 1, -0.75];
                    break;
                case LineStyle.Emboss3D:
                case LineStyle.Engrave3D:
                    borderLineArray = [0.25, 0, 1, 0, 0.25];
                    break;
            }
            if (borderLineArray.length == 1) {
                return [lineWidth];
            }
            for (var i = 0; i < borderLineArray.length; i++) {
                if (borderLineArray[i] >= 0) {
                    borderLineArray[i] = borderLineArray[i] * lineWidth;
                }
                else {
                    borderLineArray[i] = Math.abs(borderLineArray[i]);
                }
            }
            return borderLineArray;
        };
        Border.prototype.GetAsHtmlStyle = function (borderPosition) {
            var html = "";
            html += "border-" + borderPosition + "-style:" + this.GetHtmlLineStyle();
            html += HTMLOperators.SemiColon;
            if (this.LineWidth > 0)
                html += "border-" + borderPosition + "-width:" + this.LineWidth.toString() + "px;";
            if (this.Color != "#000000")
                html += "border-" + borderPosition + "-color:" + this.Color + HTMLOperators.SemiColon;
            return html;
        };
        Border.prototype.GetHtmlLineStyle = function () {
            switch (this.LineStyle) {
                case LineStyle.None:
                    return "none";
                case LineStyle.Single:
                    return "solid";
                case LineStyle.Dot:
                    return "dotted";
                case LineStyle.DashSmallGap:
                case LineStyle.DashLargeGap:
                case LineStyle.DashDot:
                case LineStyle.DashDotDot:
                    return "dashed";
                case LineStyle.Double:
                case LineStyle.Triple:
                case LineStyle.ThinThickSmallGap:
                case LineStyle.ThickThinSmallGap:
                case LineStyle.ThinThickThinSmallGap:
                case LineStyle.ThinThickMediumGap:
                case LineStyle.ThickThinMediumGap:
                case LineStyle.ThinThickThinMediumGap:
                case LineStyle.ThinThickLargeGap:
                case LineStyle.ThickThinLargeGap:
                case LineStyle.ThinThickThinLargeGap:
                    return "double";
                case LineStyle.SingleWavy:
                    return "solid";
                case LineStyle.DoubleWavy:
                    return "double";
                case LineStyle.DashDotStroked:
                    return "solid";
                case LineStyle.Emboss3D:
                    return "ridge";
                case LineStyle.Engrave3D:
                    return "groove";
                case LineStyle.Outset:
                    return "outset";
                case LineStyle.Inset:
                    return "inset";
                default:
                    return "solid";
            }
        };
        return Border;
    }(BaseNode));
    DocumentEditorFeatures.Border = Border;
    var TableFormat = (function (_super) {
        __extends(TableFormat, _super);
        function TableFormat(node) {
            _super.call(this, node);
            this.leftMargin = 7.2;
            this.topMargin = 0;
            this.bottomMargin = 0;
            this.rightMargin = 7.2;
            this.Borders = new Borders(this);
            this.Shading = new Shading(this);
        }
        Object.defineProperty(TableFormat.prototype, "Borders", {
            get: function () {
                return this.borders;
            },
            set: function (value) {
                this.borders = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableFormat.prototype, "CellSpacing", {
            get: function () { return this.cellSpacing; },
            set: function (value) { this.cellSpacing = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableFormat.prototype, "LeftMargin", {
            get: function () { return this.leftMargin; },
            set: function (value) { this.leftMargin = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableFormat.prototype, "TopMargin", {
            get: function () { return this.topMargin; },
            set: function (value) { this.topMargin = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableFormat.prototype, "RightMargin", {
            get: function () { return this.rightMargin; },
            set: function (value) { this.rightMargin = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableFormat.prototype, "BottomMargin", {
            get: function () { return this.bottomMargin; },
            set: function (value) { this.bottomMargin = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableFormat.prototype, "LeftIndent", {
            get: function () { return this.leftIndent; },
            set: function (value) { this.leftIndent = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableFormat.prototype, "Shading", {
            get: function () { return this.shading; },
            set: function (value) { this.shading = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableFormat.prototype, "TableAlignment", {
            get: function () { return this.tableAlignment; },
            set: function (value) { this.tableAlignment = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TableFormat.prototype, "PreferredWidth", {
            get: function () { return this.prefferedWidth; },
            set: function (value) { this.prefferedWidth = value; },
            enumerable: true,
            configurable: true
        });
        TableFormat.prototype.GetAsHtmlStyle = function () {
            var attributes = "";
            if (this.Shading != undefined && this.Shading != null && this.Shading.BackgroundColor != undefined && this.Shading.BackgroundColor != null)
                attributes += " " + CssConstants.BgColor + HTMLOperators.Equal + "\"" + this.Shading.BackgroundColor + "\"";
            attributes += " border=\"1\"";
            attributes += " cellpadding=\"0\"";
            var style = " style=\"";
            if (this.LeftIndent != undefined && this.LeftIndent != 0)
                style += CssConstants.LeftIndent + HTMLOperators.Colon + this.LeftIndent.toString() + "px;";
            if (this.CellSpacing != undefined && this.CellSpacing > 0)
                style += "cellspacing:" + (((this.CellSpacing * 72) / 96) * 2).toString() + HTMLOperators.SemiColon;
            else
                style += "border-collapse:collapse;";
            if (this.Borders != undefined && this.Borders != null) {
                style += this.Borders.GetAsHtmlStyle();
            }
            style += "\" ";
            return attributes + style;
        };
        TableFormat.prototype.Dispose = function () {
            this.SetOwner(null);
            this.Borders.Dispose();
            this.Shading.Dispose();
        };
        return TableFormat;
    }(BaseNode));
    DocumentEditorFeatures.TableFormat = TableFormat;
    var RowFormat = (function (_super) {
        __extends(RowFormat, _super);
        function RowFormat(node) {
            _super.call(this, node);
            this.Borders = new Borders(this);
        }
        Object.defineProperty(RowFormat.prototype, "AllowBreakAcrossPages", {
            get: function () { return this.allowBreakAcrossPages; },
            set: function (value) { this.allowBreakAcrossPages = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RowFormat.prototype, "IsHeader", {
            get: function () { return this.isHeader; },
            set: function (value) { this.isHeader = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RowFormat.prototype, "Height", {
            get: function () { return this.height; },
            set: function (value) { this.height = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RowFormat.prototype, "HeightType", {
            get: function () { return this.heightType; },
            set: function (value) { this.heightType = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RowFormat.prototype, "Borders", {
            get: function () { return this.borders; },
            set: function (value) { this.borders = value; },
            enumerable: true,
            configurable: true
        });
        RowFormat.prototype.GetAsHtmlStyle = function () {
            var style = "";
            if (this.Height != undefined && this.Height > 0)
                style = "style =\"" + "height:" + this.Height.toString() + "px;\"";
            return style;
        };
        return RowFormat;
    }(BaseNode));
    DocumentEditorFeatures.RowFormat = RowFormat;
    var CellFormat = (function (_super) {
        __extends(CellFormat, _super);
        function CellFormat(node) {
            _super.call(this, node);
            this.leftMargin = 0;
            this.topMargin = 0;
            this.rightMargin = 0;
            this.bottomMargin = 0;
            this.Borders = new Borders(this);
            this.Shading = new Shading(this);
        }
        Object.defineProperty(CellFormat.prototype, "Borders", {
            get: function () { return this.borders; },
            set: function (value) { this.borders = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CellFormat.prototype, "LeftMargin", {
            get: function () { return this.leftMargin; },
            set: function (value) { this.leftMargin = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CellFormat.prototype, "TopMargin", {
            get: function () { return this.topMargin; },
            set: function (value) { this.topMargin = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CellFormat.prototype, "BottomMargin", {
            get: function () { return this.bottomMargin; },
            set: function (value) { this.bottomMargin = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CellFormat.prototype, "RightMargin", {
            get: function () { return this.rightMargin; },
            set: function (value) { this.rightMargin = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CellFormat.prototype, "CellWidth", {
            get: function () { return this.cellWidth; },
            set: function (value) { this.cellWidth = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CellFormat.prototype, "ColumnSpan", {
            get: function () { return this.colSpan; },
            set: function (value) { this.colSpan = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CellFormat.prototype, "RowSpan", {
            get: function () { return this.rowSpan; },
            set: function (value) { this.rowSpan = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CellFormat.prototype, "PrefferedWidth", {
            get: function () { return this.prefferedWidth; },
            set: function (value) { this.prefferedWidth = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CellFormat.prototype, "PrefferedWidthType", {
            get: function () { return this.prefferedWidthtype; },
            set: function (value) { this.prefferedWidthtype = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CellFormat.prototype, "Shading", {
            get: function () { return this.shading; },
            set: function (value) { this.shading = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CellFormat.prototype, "VerticalAlignment", {
            get: function () { return this.verticalAlignment; },
            set: function (value) { this.verticalAlignment = value; },
            enumerable: true,
            configurable: true
        });
        CellFormat.prototype.ContainsMargins = function () {
            return (this.LeftMargin != null && this.LeftMargin != undefined)
                || (this.RightMargin != null && this.RightMargin != undefined)
                || (this.TopMargin != null && this.TopMargin != undefined)
                || (this.BottomMargin != null && this.BottomMargin != undefined);
        };
        CellFormat.prototype.ClearMargins = function () {
            this.LeftMargin = this.RightMargin = this.TopMargin = this.BottomMargin = undefined;
        };
        CellFormat.prototype.GetAsHtmlStyle = function () {
            var attributes = "";
            attributes += " rowspan=" + this.RowSpan.toString();
            attributes += " colspan=" + this.ColumnSpan.toString();
            if (this.Shading != undefined && this.Shading != null && this.Shading.BackgroundColor != undefined && this.Shading.BackgroundColor != null)
                attributes += " " + CssConstants.BgColor + HTMLOperators.Equal + "\"" + this.Shading.BackgroundColor + "\"";
            if (this.CellWidth != undefined && this.CellWidth > 0)
                attributes += " width=" + this.CellWidth.toString();
            var style = " style=\"";
            if (this.VerticalAlignment != CellVerticalAlignment.Top)
                style += "valign:" + this.VerticalAlignment.toString().toLowerCase();
            if (this.ContainsMargins()) {
                if (this.LeftMargin != undefined && this.LeftMargin != 0)
                    style += "padding-left:" + this.LeftMargin.toString() + "px;";
                if (this.RightMargin != undefined && this.RightMargin != 0)
                    style += "padding-right:" + this.RightMargin.toString() + "px;";
                if (this.TopMargin != undefined && this.TopMargin != 0)
                    style += "padding-top:" + this.TopMargin.toString() + "px;";
                if (this.BottomMargin != undefined && this.BottomMargin != 0)
                    style += "padding-bottom:" + this.BottomMargin.toString() + "px;";
            }
            if (this.Borders != undefined && this.Borders != null)
                style += this.Borders.GetAsHtmlStyle();
            style += "\" ";
            return attributes + style;
        };
        CellFormat.prototype.Dispose = function () {
            this.SetOwner(null);
        };
        return CellFormat;
    }(BaseNode));
    DocumentEditorFeatures.CellFormat = CellFormat;
    (function (StrikeThrough) {
        StrikeThrough[StrikeThrough["None"] = 0] = "None";
        StrikeThrough[StrikeThrough["SingleStrike"] = 1] = "SingleStrike";
        StrikeThrough[StrikeThrough["DoubleStrike"] = 2] = "DoubleStrike";
    })(DocumentEditorFeatures.StrikeThrough || (DocumentEditorFeatures.StrikeThrough = {}));
    var StrikeThrough = DocumentEditorFeatures.StrikeThrough;
    (function (BaselineAlignment) {
        BaselineAlignment[BaselineAlignment["Normal"] = 0] = "Normal";
        BaselineAlignment[BaselineAlignment["Superscript"] = 1] = "Superscript";
        BaselineAlignment[BaselineAlignment["Subscript"] = 2] = "Subscript";
    })(DocumentEditorFeatures.BaselineAlignment || (DocumentEditorFeatures.BaselineAlignment = {}));
    var BaselineAlignment = DocumentEditorFeatures.BaselineAlignment;
    (function (Underline) {
        Underline[Underline["None"] = 0] = "None";
        Underline[Underline["Single"] = 1] = "Single";
        Underline[Underline["Words"] = 2] = "Words";
        Underline[Underline["Double"] = 3] = "Double";
        Underline[Underline["Dotted"] = 4] = "Dotted";
        Underline[Underline["Thick"] = 6] = "Thick";
        Underline[Underline["Dash"] = 7] = "Dash";
        Underline[Underline["DashLong"] = 39] = "DashLong";
        Underline[Underline["DotDash"] = 9] = "DotDash";
        Underline[Underline["DotDotDash"] = 10] = "DotDotDash";
        Underline[Underline["Wavy"] = 11] = "Wavy";
        Underline[Underline["DottedHeavy"] = 20] = "DottedHeavy";
        Underline[Underline["DashHeavy"] = 23] = "DashHeavy";
        Underline[Underline["DashLongHeavy"] = 55] = "DashLongHeavy";
        Underline[Underline["DotDashHeavy"] = 25] = "DotDashHeavy";
        Underline[Underline["DotDotDashHeavy"] = 26] = "DotDotDashHeavy";
        Underline[Underline["WavyHeavy"] = 27] = "WavyHeavy";
        Underline[Underline["WavyDouble"] = 43] = "WavyDouble";
    })(DocumentEditorFeatures.Underline || (DocumentEditorFeatures.Underline = {}));
    var Underline = DocumentEditorFeatures.Underline;
    (function (HighlightColor) {
        HighlightColor[HighlightColor["NoColor"] = 0] = "NoColor";
        HighlightColor[HighlightColor["Yellow"] = 1] = "Yellow";
        HighlightColor[HighlightColor["BrightGreen"] = 2] = "BrightGreen";
        HighlightColor[HighlightColor["Turquoise"] = 3] = "Turquoise";
        HighlightColor[HighlightColor["Pink"] = 4] = "Pink";
        HighlightColor[HighlightColor["Blue"] = 5] = "Blue";
        HighlightColor[HighlightColor["Red"] = 6] = "Red";
        HighlightColor[HighlightColor["DarkBlue"] = 7] = "DarkBlue";
        HighlightColor[HighlightColor["Teal"] = 8] = "Teal";
        HighlightColor[HighlightColor["Green"] = 9] = "Green";
        HighlightColor[HighlightColor["Violet"] = 10] = "Violet";
        HighlightColor[HighlightColor["DarkRed"] = 11] = "DarkRed";
        HighlightColor[HighlightColor["DarkYellow"] = 12] = "DarkYellow";
        HighlightColor[HighlightColor["Gray50"] = 13] = "Gray50";
        HighlightColor[HighlightColor["Gray25"] = 14] = "Gray25";
        HighlightColor[HighlightColor["Black"] = 15] = "Black";
    })(DocumentEditorFeatures.HighlightColor || (DocumentEditorFeatures.HighlightColor = {}));
    var HighlightColor = DocumentEditorFeatures.HighlightColor;
    (function (LineSpacingType) {
        LineSpacingType[LineSpacingType["AtLeast"] = 0] = "AtLeast";
        LineSpacingType[LineSpacingType["Exactly"] = 1] = "Exactly";
        LineSpacingType[LineSpacingType["Multiple"] = 2] = "Multiple";
    })(DocumentEditorFeatures.LineSpacingType || (DocumentEditorFeatures.LineSpacingType = {}));
    var LineSpacingType = DocumentEditorFeatures.LineSpacingType;
    (function (TextAlignment) {
        TextAlignment[TextAlignment["Center"] = 0] = "Center";
        TextAlignment[TextAlignment["Left"] = 1] = "Left";
        TextAlignment[TextAlignment["Right"] = 2] = "Right";
        TextAlignment[TextAlignment["Justify"] = 3] = "Justify";
    })(DocumentEditorFeatures.TextAlignment || (DocumentEditorFeatures.TextAlignment = {}));
    var TextAlignment = DocumentEditorFeatures.TextAlignment;
    (function (WidthType) {
        WidthType[WidthType["Auto"] = 0] = "Auto";
        WidthType[WidthType["Percent"] = 1] = "Percent";
        WidthType[WidthType["Pixel"] = 2] = "Pixel";
    })(DocumentEditorFeatures.WidthType || (DocumentEditorFeatures.WidthType = {}));
    var WidthType = DocumentEditorFeatures.WidthType;
    (function (TableAlignment) {
        TableAlignment[TableAlignment["Left"] = 0] = "Left";
        TableAlignment[TableAlignment["Center"] = 1] = "Center";
        TableAlignment[TableAlignment["Right"] = 2] = "Right";
    })(DocumentEditorFeatures.TableAlignment || (DocumentEditorFeatures.TableAlignment = {}));
    var TableAlignment = DocumentEditorFeatures.TableAlignment;
    (function (LineStyle) {
        LineStyle[LineStyle["None"] = 0] = "None";
        LineStyle[LineStyle["Single"] = 1] = "Single";
        LineStyle[LineStyle["Dot"] = 2] = "Dot";
        LineStyle[LineStyle["DashSmallGap"] = 3] = "DashSmallGap";
        LineStyle[LineStyle["DashLargeGap"] = 4] = "DashLargeGap";
        LineStyle[LineStyle["DashDot"] = 5] = "DashDot";
        LineStyle[LineStyle["DashDotDot"] = 6] = "DashDotDot";
        LineStyle[LineStyle["Double"] = 7] = "Double";
        LineStyle[LineStyle["Triple"] = 8] = "Triple";
        LineStyle[LineStyle["ThinThickSmallGap"] = 9] = "ThinThickSmallGap";
        LineStyle[LineStyle["ThickThinSmallGap"] = 10] = "ThickThinSmallGap";
        LineStyle[LineStyle["ThinThickThinSmallGap"] = 11] = "ThinThickThinSmallGap";
        LineStyle[LineStyle["ThinThickMediumGap"] = 12] = "ThinThickMediumGap";
        LineStyle[LineStyle["ThickThinMediumGap"] = 13] = "ThickThinMediumGap";
        LineStyle[LineStyle["ThinThickThinMediumGap"] = 14] = "ThinThickThinMediumGap";
        LineStyle[LineStyle["ThinThickLargeGap"] = 15] = "ThinThickLargeGap";
        LineStyle[LineStyle["ThickThinLargeGap"] = 16] = "ThickThinLargeGap";
        LineStyle[LineStyle["ThinThickThinLargeGap"] = 17] = "ThinThickThinLargeGap";
        LineStyle[LineStyle["SingleWavy"] = 18] = "SingleWavy";
        LineStyle[LineStyle["DoubleWavy"] = 19] = "DoubleWavy";
        LineStyle[LineStyle["DashDotStroked"] = 20] = "DashDotStroked";
        LineStyle[LineStyle["Emboss3D"] = 21] = "Emboss3D";
        LineStyle[LineStyle["Engrave3D"] = 22] = "Engrave3D";
        LineStyle[LineStyle["Outset"] = 23] = "Outset";
        LineStyle[LineStyle["Inset"] = 24] = "Inset";
        LineStyle[LineStyle["Thick"] = 25] = "Thick";
    })(DocumentEditorFeatures.LineStyle || (DocumentEditorFeatures.LineStyle = {}));
    var LineStyle = DocumentEditorFeatures.LineStyle;
    (function (TextureStyle) {
        TextureStyle[TextureStyle["TextureNone"] = 0] = "TextureNone";
        TextureStyle[TextureStyle["Texture2Pt5Percent"] = 35] = "Texture2Pt5Percent";
        TextureStyle[TextureStyle["Texture5Percent"] = 2] = "Texture5Percent";
        TextureStyle[TextureStyle["Texture7Pt5Percent"] = 36] = "Texture7Pt5Percent";
        TextureStyle[TextureStyle["Texture10Percent"] = 3] = "Texture10Percent";
        TextureStyle[TextureStyle["Texture12Pt5Percent"] = 37] = "Texture12Pt5Percent";
        TextureStyle[TextureStyle["Texture15Percent"] = 26] = "Texture15Percent";
        TextureStyle[TextureStyle["Texture17Pt5Percent"] = 39] = "Texture17Pt5Percent";
        TextureStyle[TextureStyle["Texture20Percent"] = 4] = "Texture20Percent";
        TextureStyle[TextureStyle["Texture22Pt5Percent"] = 40] = "Texture22Pt5Percent";
        TextureStyle[TextureStyle["Texture25Percent"] = 5] = "Texture25Percent";
        TextureStyle[TextureStyle["Texture27Pt5Percent"] = 41] = "Texture27Pt5Percent";
        TextureStyle[TextureStyle["Texture30Percent"] = 6] = "Texture30Percent";
        TextureStyle[TextureStyle["Texture32Pt5Percent"] = 42] = "Texture32Pt5Percent";
        TextureStyle[TextureStyle["Texture35Percent"] = 43] = "Texture35Percent";
        TextureStyle[TextureStyle["Texture37Pt5Percent"] = 44] = "Texture37Pt5Percent";
        TextureStyle[TextureStyle["Texture40Percent"] = 7] = "Texture40Percent";
        TextureStyle[TextureStyle["Texture42Pt5Percent"] = 45] = "Texture42Pt5Percent";
        TextureStyle[TextureStyle["Texture45Percent"] = 46] = "Texture45Percent";
        TextureStyle[TextureStyle["Texture47Pt5Percent"] = 47] = "Texture47Pt5Percent";
        TextureStyle[TextureStyle["Texture50Percent"] = 8] = "Texture50Percent";
        TextureStyle[TextureStyle["Texture52Pt5Percent"] = 48] = "Texture52Pt5Percent";
        TextureStyle[TextureStyle["Texture55Percent"] = 49] = "Texture55Percent";
        TextureStyle[TextureStyle["Texture57Pt5Percent"] = 50] = "Texture57Pt5Percent";
        TextureStyle[TextureStyle["Texture60Percent"] = 9] = "Texture60Percent";
        TextureStyle[TextureStyle["Texture62Pt5Percent"] = 51] = "Texture62Pt5Percent";
        TextureStyle[TextureStyle["Texture65Percent"] = 52] = "Texture65Percent";
        TextureStyle[TextureStyle["Texture67Pt5Percent"] = 53] = "Texture67Pt5Percent";
        TextureStyle[TextureStyle["Texture70Percent"] = 10] = "Texture70Percent";
        TextureStyle[TextureStyle["Texture72Pt5Percent"] = 54] = "Texture72Pt5Percent";
        TextureStyle[TextureStyle["Texture75Percent"] = 11] = "Texture75Percent";
        TextureStyle[TextureStyle["Texture77Pt5Percent"] = 55] = "Texture77Pt5Percent";
        TextureStyle[TextureStyle["Texture80Percent"] = 12] = "Texture80Percent";
        TextureStyle[TextureStyle["Texture82Pt5Percent"] = 56] = "Texture82Pt5Percent";
        TextureStyle[TextureStyle["Texture85Percent"] = 57] = "Texture85Percent";
        TextureStyle[TextureStyle["Texture87Pt5Percent"] = 58] = "Texture87Pt5Percent";
        TextureStyle[TextureStyle["Texture90Percent"] = 13] = "Texture90Percent";
        TextureStyle[TextureStyle["Texture92Pt5Percent"] = 59] = "Texture92Pt5Percent";
        TextureStyle[TextureStyle["Texture95Percent"] = 60] = "Texture95Percent";
        TextureStyle[TextureStyle["Texture97Pt5Percent"] = 61] = "Texture97Pt5Percent";
        TextureStyle[TextureStyle["TextureSolid"] = 1] = "TextureSolid";
        TextureStyle[TextureStyle["TextureDarkHorizontal"] = 14] = "TextureDarkHorizontal";
        TextureStyle[TextureStyle["TextureDarkVertical"] = 15] = "TextureDarkVertical";
        TextureStyle[TextureStyle["TextureDarkDiagonalDown"] = 16] = "TextureDarkDiagonalDown";
        TextureStyle[TextureStyle["TextureDarkDiagonalUp"] = 17] = "TextureDarkDiagonalUp";
        TextureStyle[TextureStyle["TextureDarkCross"] = 18] = "TextureDarkCross";
        TextureStyle[TextureStyle["TextureDarkDiagonalCross"] = 19] = "TextureDarkDiagonalCross";
        TextureStyle[TextureStyle["TextureHorizontal"] = 20] = "TextureHorizontal";
        TextureStyle[TextureStyle["TextureVertical"] = 21] = "TextureVertical";
        TextureStyle[TextureStyle["TextureDiagonalDown"] = 22] = "TextureDiagonalDown";
        TextureStyle[TextureStyle["TextureDiagonalUp"] = 23] = "TextureDiagonalUp";
        TextureStyle[TextureStyle["TextureCross"] = 24] = "TextureCross";
        TextureStyle[TextureStyle["TextureDiagonalCross"] = 25] = "TextureDiagonalCross";
    })(DocumentEditorFeatures.TextureStyle || (DocumentEditorFeatures.TextureStyle = {}));
    var TextureStyle = DocumentEditorFeatures.TextureStyle;
    (function (HeightType) {
        HeightType[HeightType["Auto"] = 0] = "Auto";
        HeightType[HeightType["Atleast"] = 1] = "Atleast";
        HeightType[HeightType["Exactly"] = 2] = "Exactly";
    })(DocumentEditorFeatures.HeightType || (DocumentEditorFeatures.HeightType = {}));
    var HeightType = DocumentEditorFeatures.HeightType;
    (function (CellVerticalAlignment) {
        CellVerticalAlignment[CellVerticalAlignment["Top"] = 0] = "Top";
        CellVerticalAlignment[CellVerticalAlignment["Center"] = 1] = "Center";
        CellVerticalAlignment[CellVerticalAlignment["Bottom"] = 2] = "Bottom";
    })(DocumentEditorFeatures.CellVerticalAlignment || (DocumentEditorFeatures.CellVerticalAlignment = {}));
    var CellVerticalAlignment = DocumentEditorFeatures.CellVerticalAlignment;
    (function (HeaderFooterType) {
        HeaderFooterType[HeaderFooterType["EvenHeader"] = 0] = "EvenHeader";
        HeaderFooterType[HeaderFooterType["OddHeader"] = 1] = "OddHeader";
        HeaderFooterType[HeaderFooterType["EvenFooter"] = 2] = "EvenFooter";
        HeaderFooterType[HeaderFooterType["OddFooter"] = 3] = "OddFooter";
        HeaderFooterType[HeaderFooterType["FirstPageHeader"] = 4] = "FirstPageHeader";
        HeaderFooterType[HeaderFooterType["FirstPageFooter"] = 5] = "FirstPageFooter";
    })(DocumentEditorFeatures.HeaderFooterType || (DocumentEditorFeatures.HeaderFooterType = {}));
    var HeaderFooterType = DocumentEditorFeatures.HeaderFooterType;
    (function (ListLevelPattern) {
        ListLevelPattern[ListLevelPattern["Arabic"] = 0] = "Arabic";
        ListLevelPattern[ListLevelPattern["UpRoman"] = 1] = "UpRoman";
        ListLevelPattern[ListLevelPattern["LowRoman"] = 2] = "LowRoman";
        ListLevelPattern[ListLevelPattern["UpLetter"] = 3] = "UpLetter";
        ListLevelPattern[ListLevelPattern["LowLetter"] = 4] = "LowLetter";
        ListLevelPattern[ListLevelPattern["Ordinal"] = 5] = "Ordinal";
        ListLevelPattern[ListLevelPattern["Number"] = 6] = "Number";
        ListLevelPattern[ListLevelPattern["OrdinalText"] = 7] = "OrdinalText";
        ListLevelPattern[ListLevelPattern["LeadingZero"] = 22] = "LeadingZero";
        ListLevelPattern[ListLevelPattern["Bullet"] = 23] = "Bullet";
        ListLevelPattern[ListLevelPattern["FarEast"] = 20] = "FarEast";
        ListLevelPattern[ListLevelPattern["Special"] = 58] = "Special";
        ListLevelPattern[ListLevelPattern["None"] = 255] = "None";
    })(DocumentEditorFeatures.ListLevelPattern || (DocumentEditorFeatures.ListLevelPattern = {}));
    var ListLevelPattern = DocumentEditorFeatures.ListLevelPattern;
    (function (FollowCharacterType) {
        FollowCharacterType[FollowCharacterType["Tab"] = 0] = "Tab";
        FollowCharacterType[FollowCharacterType["Space"] = 1] = "Space";
        FollowCharacterType[FollowCharacterType["None"] = 2] = "None";
    })(DocumentEditorFeatures.FollowCharacterType || (DocumentEditorFeatures.FollowCharacterType = {}));
    var FollowCharacterType = DocumentEditorFeatures.FollowCharacterType;
    (function (HyperlinkType) {
        HyperlinkType[HyperlinkType["File"] = 0] = "File";
        HyperlinkType[HyperlinkType["Webpage"] = 1] = "Webpage";
        HyperlinkType[HyperlinkType["Email"] = 2] = "Email";
        HyperlinkType[HyperlinkType["Bookmark"] = 3] = "Bookmark";
    })(DocumentEditorFeatures.HyperlinkType || (DocumentEditorFeatures.HyperlinkType = {}));
    var HyperlinkType = DocumentEditorFeatures.HyperlinkType;
    (function (FindOptions) {
        FindOptions[FindOptions["None"] = 0] = "None";
        FindOptions[FindOptions["WholeWord"] = 1] = "WholeWord";
        FindOptions[FindOptions["CaseSensitive"] = 2] = "CaseSensitive";
        FindOptions[FindOptions["CaseSensitiveWholeWord"] = 3] = "CaseSensitiveWholeWord";
    })(DocumentEditorFeatures.FindOptions || (DocumentEditorFeatures.FindOptions = {}));
    var FindOptions = DocumentEditorFeatures.FindOptions;
})(DocumentEditorFeatures || (DocumentEditorFeatures = {}));
;
};

});