/*!
*  filename: ej.pager.js
*  version : 14.4.0.20
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.core"], fn) : fn();
})
(function () {
	
(function ($, ej, undefined) {

    ej.widget("ejPager", "ej.Pager", {
        _rootCSS: "e-pager",
        validTags: ["div"],
        // default model
        defaults: {
            pageSize: 12,
            pageCount: 10,
            currentPage: 1,
            enableExternalMessage: false,
            externalMessage:"",
            enableQueryString:false,
            locale: "en-US",
            masterObject: null,
            click: null,
            enableRTL: false,
            totalRecordsCount: null,
            totalPages: null,
            customText: "",
            showPageInfo: true
        },

        // constructor function
        _init: function () {
            this._initPrivateProperties();
            this.model.enableQueryString && this._queryStringValue();
            this.renderPager();
            this._wireEvents();
        },
        _initPrivateProperties: function () {
            this._links = [];
            this._$prev = null;
            this._$first = null;
            this._$PP = null;
            this._$NP = null;
            this._lastNP = false;
            this._lastpageCount = null;
            this._$last = null;
            this._$next = null;
            this._prevPageNo = null;
            this.localizedLabels = this._getLocalizedLabels();
        },
        _wireEvents: function () {
            if (this.model.click != undefined)
                this._on(this.element, "click", this._pagerClickHandler);

        },
        renderPager: function () {
            var $pagerContainer = ej.buildTag('div.e-pagercontainer', "", {}, { unselectable: "on" });
            this._renderPagerContainer($pagerContainer);
            this.element[0].appendChild($pagerContainer[0]);
            this._pageInfo();
            this.model.enableExternalMessage && this._renderPagerMessage();
        },
        _queryStringValue: function () {
            var results = new RegExp('[\\?&]page=([^&#]*)').exec(window.location.href);
            !results ? this.model.currentPage = 1 : this.model.currentPage = parseInt(results[1] || 1);
        },
        _renderPagerMessage: function () {
            var $messageDiv = ej.buildTag('div.e-pagermessage');
            if (this.model.externalMessage.toString().length)
                $messageDiv.html(this.model.externalMessage);
            else
                $messageDiv.hide();
            this.element.append($messageDiv);
        },
        _renderPagerContainer: function ($pagerContainer) {
            //Update pager styles here for next versions
            this._renderBackwardButton($pagerContainer);
            this._renderpreviousPager($pagerContainer);
            this._renderNumericItem($pagerContainer);
            this._renderForwardPager($pagerContainer);
            this._renderForwardButton($pagerContainer);
        },
        _renderMsgBar: function () {
            var $msgBar = ej.buildTag('span.e-pagermsg', String.format(this.localizedLabels.pagerInfo, this.model.currentPage, this.model.totalPages || 0, this.model.totalRecordsCount || 0));
            this._parentMsgBar.appendChild($msgBar[0]);
            this._parentMsgBar.style.textAlign = ej.TextAlign.Right;
        },
        _renderpreviousPager: function ($pagerContainer) {
            this._$PP = ej.buildTag('a.e-link e-nextprevitemdisabled e-disable e-spacing e-PP', "...", {}, { title: this.localizedLabels.previousPagerTooltip, role: "link" });
            $pagerContainer.append(this._$PP);
        },
        _renderForwardPager: function ($pagerContainer) {
            this._$NP = ej.buildTag('a.e-link e-NP e-numericitem e-spacing e-default', "...", {}, { title: this.localizedLabels.nextPagerTooltip, role: "link" });
            $pagerContainer.append(this._$NP);
        },
        _renderBackwardButton: function ($pagerContainer) {
            this._$first = ej.buildTag('div.e-firstpage e-icon e-mediaback  e-firstpagedisabled e-disable', "", {}, { unselectable: "on", title: this.localizedLabels.firstPageTooltip });
            this._$prev = ej.buildTag('div.e-prevpage e-icon e-arrowheadleft-2x  e-prevpagedisabled e-disable', "", {}, { unselectable: "on", title: this.localizedLabels.previousPageTooltip });
            $pagerContainer.append(this._$first);
            $pagerContainer.append(this._$prev);
        },
        _renderNumericItem: function ($pagerContainer) {
            var $numericContainer = ej.buildTag('div.e-numericcontainer e-default', "", {}, { unselectable: "on" });
            this._renderNumericLinks($numericContainer,this.model.pageCount);
            $pagerContainer.append($numericContainer);
        },
        _renderNumericLinks: function ($numericContainer) {
            $numericContainer.empty();
            for (var page = 1; page <= this.model.pageCount; page++) {
                var $link = ej.buildTag('a.e-link', this.model.customText + page, {}, { role: "link" }).addClass("e-numericitem e-spacing e-default").data("index",page);
                if (page == this.model.currentPage)
                    $link.removeClass("e-default").addClass("e-currentitem e-active");
                $numericContainer.append($link);
            }
            this._links = $numericContainer.children();
        },
        _renderForwardButton: function ($pagerContainer) {
            this._$next = ej.buildTag('div.e-nextpage e-icon e-arrowheadright-2x  e-default', "", {}, { unselectable: "on", title: this.localizedLabels.nextPageTooltip });
            this._$last = ej.buildTag('div.e-lastpage e-icon e-mediaforward  e-default', "", {}, { unselectable: "on", title: this.localizedLabels.lastPageTooltip });
            $pagerContainer.append(this._$next);
            $pagerContainer.append(this._$last);

        },
        _applyCss: function () {
            if (this.model.currentPage > 1) {
                this._$prev.removeClass("e-prevpagedisabled").removeClass("e-disable").addClass("e-prevpage e-default");
                this._$first.removeClass("e-firstpagedisabled").removeClass("e-disable").addClass("e-firstpage e-default");
            } else {
                this._$prev.addClass("e-prevpagedisabled e-disable").removeClass("e-prevpage").removeClass("e-default");
                this._$first.addClass("e-firstpagedisabled e-disable").removeClass("e-firstpage").removeClass("e-default");
            }
            (this.model.currentPage > this.model.pageCount) ?
                 (this._$PP.removeClass("e-nextprevitemdisabled").removeClass("e-disable").addClass("e-numericitem e-default")) : (this._$PP.addClass("e-nextprevitemdisabled e-disable").removeClass("e-numericitem").removeClass("e-default"));

            if (this._links.length && parseInt(this._links[0].innerHTML.replace(this.model.customText,""), 10) + this.model.pageCount > this.model.totalPages)
                this._lastNP = true;
            else
                this._lastNP = false;

            if (this._lastNP == false)
                this._$NP.removeClass("e-nextprevitemdisabled").removeClass("e-disable").addClass("e-numericitem e-default");
            else
                this._$NP.addClass("e-nextprevitemdisabled e-disable").removeClass("e-numericitem").removeClass("e-default");

            this._lastpageCount = this.model.totalPages % this.model.pageCount;
            if (this._lastpageCount == 0)
                this._lastpageCount = this.model.pageCount;
            if (this.model.currentPage > (this.model.totalPages - this._LastpageCount)) {
                this._$PP.removeClass("e-nextprevitemdisabled").removeClass("e-disable").addClass("e-numericitem e-default");
                this._$NP.addClass("e-nextprevitemdisabled e-disable").removeClass("e-numericitem").removeClass("e-default");
            }
            if (this.model.currentPage == this.model.totalPages || this.model.totalRecordsCount == 0) {
                this._$last.addClass("e-lastpagedisabled e-disable").removeClass("e-lastpage").removeClass("e-default");
                this._$next.addClass("e-nextpagedisabled e-disable").removeClass("e-nextpage").removeClass("e-default");
                this._$NP.addClass("e-nextprevitemdisabled e-disable").removeClass("e-numericitem").removeClass("e-default");
            } else {
                this._$last.addClass("e-lastpage e-default").removeClass("e-lastpagedisabled").removeClass("e-disable");
                this._$next.addClass("e-nextpage e-default").removeClass("e-nextpagedisabled").removeClass("e-disable");
            }
            if (this._links.length) {
                this._links.removeClass("e-currentitem").removeClass("e-active").addClass("e-default");
                $(this._links[(this.model.currentPage - 1) % this.model.pageCount]).removeClass("e-default").addClass("e-currentitem e-active");
                $(this._links[(this._prevPageNo - 1) % this.model.pageCount]).removeClass("e-default").addClass("e-numericitem");
            }
            if (this.model.pageSize >= (this.model.totalRecordsCount / this.model.pageCount) && this._$PP != null && this._$PP.length != 0) {
                this._$PP.addClass("e-nextprevitemdisabled e-disable").removeClass("e-numericitem").removeClass("e-default");
                this._$NP.addClass("e-nextprevitemdisabled e-disable").removeClass("e-numericitem").removeClass("e-default");
            }
        },
        _SetTotalPages: function () {
            this.model.totalPages = (this.model.totalRecordsCount % this.model.pageSize == 0) ? (this.model.totalRecordsCount / this.model.pageSize) : (parseInt(this.model.totalRecordsCount / this.model.pageSize, 10) + 1);
        },
        _refreshNumericItem: function () {
            if (this._links.length != 0 && this._links != null) {
                this.model.currentPage = this.model.totalPages == 1 ? 1 : this.model.currentPage;
                if (this.model.currentPage > this.model.totalPages && this.model.totalPages != 0)
                    this.model.currentPage = this.model.totalPages;
                var _pagerTarget = parseInt(this.model.currentPage / this.model.pageCount, 10);
                if (this.model.currentPage % this.model.pageCount == 0)
                    if (_pagerTarget > 0)
                        _pagerTarget = _pagerTarget - 1;
                this._links.css("display", "none");
                for (var i = 0; i < this.model.pageCount; i++) {
                    var start = (_pagerTarget * this.model.pageCount) + 1 + i;
                    if (start <= this.model.totalPages) {
                        this._links[i].style.display = '';
						$(this._links[i]).data('index', start);
                        $(this._links[i]).html(this.model.customText + start);
                    }
                }
            }
        },
        _refreshPagerInfo: function () {
            if (this.model.totalRecordsCount == 0)
                this.model.currentPage = 0;
            this.element.find(".e-pagermsg").text(String.format(this.localizedLabels.pagerInfo, this.model.currentPage, this.model.totalPages || 0, this.model.totalRecordsCount || 0));
        },
        _refreshExternalMessage: function () {
            if (this.model.externalMessage.toString().length)
                this.element.find(".e-pagermessage").empty().html(this.model.externalMessage).show();
            else
                this.element.find(".e-pagermessage").hide();
        },
        refreshPager: function () {
            this._SetTotalPages();
            this._refreshNumericItem();
            this._refreshPagerInfo();
            this._applyCss();
            this.model.enableExternalMessage && this._refreshExternalMessage();
            if (this.model.enableRTL)
                this.element.addClass("e-rtl");
            else
                this.element.removeClass("e-rtl");
        },

        _kDownHandler: function (e) {
            var code;
            if (e.keyCode) code = e.keyCode; // ie and mozilla/gecko
            else if (e.which) code = e.which; // ns4 and opera
            else code = e.charCode;
            e.target = null;
            if (this.model.masterObject.checkKey("firstPage", code, e))
                e.target = this._$first;
            else if (this.model.masterObject.checkKey("previousPager", code, e))
                e.target = this._$PP;
            else if (this.model.masterObject.checkKey("previousPage", code, e))
                e.target = this._$prev;
            else if (this.model.masterObject.checkKey("lastPage", code, e))
                e.target = this._$last;
            else if (this.model.masterObject.checkKey("nextPager", code, e))
                e.target = this._$NP;
            else if (this.model.masterObject.checkKey("nextPage", code, e))
                e.target = this._$next;
            else
                return false;
            this._pagerClickHandler(e);
        },
        _pageInfo: function ($pagerContainer) {
            if (this.model.showPageInfo && !this._parentMsgBar) {
                this._parentMsgBar = document.createElement("div");
                this._parentMsgBar.className += "e-parentmsgbar";
                this._renderMsgBar();
                this.element[0].appendChild(this._parentMsgBar);
                this.element[0].className += this.model.enableRTL ? " e-pager e-rtl" : " e-pager";
            } else {
                this._parentMsgBar && this._parentMsgBar.remove();
                this._parentMsgbar = null;
            }
        },
        _pagerClickHandler: function (e) {
            this._prevPageNo = this.model.currentPage;
            var $target = $(e.target);
            if ($.inArray(e.target, this._links) != -1) {
				this.model.currentPage = parseInt($(e.target).data("index"), 10);
            }
            else if ($target.hasClass("e-nextpage") && $target.hasClass("e-nextpagedisabled") != true) {
                if (this.model.currentPage % this.model.pageCount == 0) {
                    this.model.currentPage++;
                    if (this._links != undefined && this._links.length != 0)
                        this.model.currentPage = parseInt($(this._links[0]).data("index"), 10) + this.model.pageCount;
                    if (parseInt(this._links[this.model.pageCount - 1].innerHTML, 10) + this.model.pageCount >= this.model.totalPages)
                        this._lastNP = true;
                }
                else
                    this.model.currentPage++;
            }
            else if ($target.hasClass("e-prevpage") && $target.hasClass("e-prevpagedisabled") != true) {
                if (this.model.currentPage % this.model.pageCount == 1)
                    this._lastNP = false;
                this.model.currentPage--;
                if (this.model.currentPage < 0) { this.model.currentPage = 0; }
            }
            else if ($target.hasClass("e-lastpage") && $target.hasClass("e-lastpagedisabled") != true) {
                this._LastpageCount = this.model.totalPages % this.model.pageCount;
                (this._LastpageCount == 0) ? (this._LastpageCount = this.model.pageCount) : null;
                this.model.currentPage = this.model.totalPages;
                this._lastNP = true;
            }
            else if ($target.hasClass("e-firstpage") && $target.hasClass("e-firstpagedisabled") != true) {
                this.model.currentPage = 1;
                this._lastNP = false;
            }
            else if ($target.hasClass("e-NP") && $target.hasClass("e-nextprevitemdisabled") != true) {
                if (this._links != undefined)
                    this.model.currentPage = parseInt($(this._links[0]).data("index"), 10) + this.model.pageCount;
                if (parseInt(this._links[this.model.pageCount - 1].innerHTML.replace(this.model.customText,""), 10) + this.model.pageCount >= this.model.totalPages) {
                    this._lastNP = true;
                    if ((this.model.totalRecordsCount - this.model.pageSize) < this.model.pageSize)
                        this._LastpageCount = this.model.totalRecordsCount - this.model.pageSize;
                    else
                        this._LastpageCount = ((this.model.totalRecordsCount / this.model.pageSize) % this.model.pageCount);
                    (this._LastpageCount == 0) ? (this._LastpageCount = this.model.pageCount) : null;
                    if (this._links != undefined)
                        this.model.currentPage = parseInt($(this._links[this.model.pageCount - 1]).data("index"), 10) + 1;
                }
            }
            else if ($target.hasClass("e-PP") && $target.hasClass("e-nextprevitemdisabled") != true) {
                if (this._links != undefined)
                    this.model.currentPage = parseInt($(this._links[0]).data("index"), 10) - this.model.pageCount;
                this._lastNP = false;
            }
            this.goToPage(this.model.currentPage,e);
            return false;
        },
        goToPage: function (pageIndex,event) {
            if (pageIndex != this.model.currentPage)
                this._prevPageNo = this.model.currentPage;
            if (this._prevPageNo !== pageIndex && (pageIndex >= 1 && pageIndex <= this.model.totalPages)) {
                this.model.currentPage = pageIndex;
                this.model.enableQueryString && this._updateQueryString(this.model.currentPage);
                this._trigger("click", { "currentPage": pageIndex, "event": event });
            }
            else
                this._trigger("click", { "currentPage": pageIndex, "event": event });

        },
        _updateQueryString: function (value) {
            var _newUrl = this._getUpdatedURL(window.location.href, "page", value);
            if (history.pushState) {
                window.history.pushState({ path: _newUrl }, '', _newUrl);
            }
            else
                window.location.href = _newUrl;
        },

        _getUpdatedURL: function (uri, key, value) {
            var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)", "i");
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            } else {
                var hash = '';
                var separator = uri.indexOf('?') !== -1 ? "&" : "?";
                if (uri.indexOf('#') !== -1) {
                    hash = uri.replace(/.*#/, '#');
                    uri = uri.replace(/#.*/, '');
                }
                return uri + separator + key + "=" + value + hash;
            }
        },
        _getLocalizedLabels: function (property) {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        },
        _setFirst: true,
        _setModel: function (options) {
            for (var prop in options) {
                switch (prop) {
                    case "pageCount":
                        this._renderNumericLinks(this.element.find(".e-numericcontainer"));
                        break;
                    case "enableExternalMessage":
                        this._renderPagerMessage();
                        break;
                    case "showPageInfo":
                        this._pageInfo();
                        break;
                }
            }
            this.refreshPager();
        },

        // all events bound using this._on will be unbind automatically
        _destroy: function () {
            this.element.empty().removeClass("e-pager");
        }
    });
    ej.Pager.Locale = ej.Pager.Locale || {};

    ej.Pager.Locale["default"] = ej.Pager.Locale["en-US"] = {
        pagerInfo: "{0} of {1} pages ({2} items)",
        firstPageTooltip: "Go to first page",
        lastPageTooltip: "Go to last page",
        nextPageTooltip: "Go to next page",
        previousPageTooltip: "Go to previous page",
        nextPagerTooltip: "Go to next pager",
        previousPagerTooltip: "Go to previous pager"
    };

})(jQuery, Syncfusion);;

});