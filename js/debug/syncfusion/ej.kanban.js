/*!
*  filename: ej.kanban.js
*  version : 14.4.0.20
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.globalize","jquery-validation","jsrender","./../common/ej.core","./../common/ej.data","./../common/ej.touch","./../common/ej.draggable","./../common/ej.scroller","./ej.button","./ej.waitingpopup","./ej.datepicker","./ej.datetimepicker","./ej.dropdownlist","./ej.dialog","./ej.editor","./ej.toolbar","./ej.rte","./ej.menu"], fn) : fn();
})
(function () {
	
var InternalAdaptive = (function () {
    function InternalAdaptive(element) {
        this.kanbanObj = null;
        this.kanbanObj = element;
    }
    ;
    InternalAdaptive.prototype._kbnTimeoutSearch = function ($kanbanEle, sender) {
        var kanbanObj = $kanbanEle.data("ejKanban"), target;
        target = sender.currentTarget;
        if (kanbanObj._searchTout)
            kanbanObj._searchTout = window.clearInterval(kanbanObj._searchTout);
        kanbanObj._searchTout = window.setInterval(function () {
            $('.e-kanbanwaitingpopup').removeClass('e-kanbanwaitingpopup').addClass('e-kbnsearchwaitingpopup');
            $kanbanEle.data("ejWaitingPopup").show();
            $('.e-kbnsearchwaitingpopup').css({ 'top': '1px', 'left': '1px' });
            var timeot = setTimeout(function () {
                var val = $(target).find("input").val();
                if (ej.isNullOrUndefined(val))
                    val = $(target).val();
                var args = {
                    itemName: target.title, itemId: target.id, target: target, currentTarget: target,
                    itemIndex: $(target).index(), toolbarData: sender, itemText: val
                };
                kanbanObj._trigger("toolbarClick", args);
                kanbanObj.KanbanFilter.searchCards(val);
                $('.e-kbnsearchwaitingpopup').addClass('e-kanbanwaitingpopup').removeClass('e-kbnsearchwaitingpopup').css({ 'top': '0px', 'left': '0px' });
                if (!ej.isNullOrUndefined(kanbanObj.model.fields.swimlaneKey)) {
                    var query = new ej.Query().where(ej.Predicate["or"](kanbanObj.keyPredicates)).select(kanbanObj.model.fields.swimlaneKey);
                    kanbanObj._kbnAdaptDdlData = new ej.DataManager(kanbanObj._currentJsonData).executeLocal(query);
                    kanbanObj._kbnAdaptDdlData = ej.dataUtil.mergeSort(ej.dataUtil.distinct(kanbanObj._kbnAdaptDdlData));
                    if (kanbanObj.KanbanAdaptive && kanbanObj.element.hasClass('e-responsive') && !ej.isNullOrUndefined(kanbanObj.model.fields.swimlaneKey))
                        kanbanObj.KanbanAdaptive._addSwimlaneName();
                }
                $kanbanEle.data("ejWaitingPopup").hide();
                clearTimeout(timeot);
            }, 300);
            kanbanObj._searchTout = window.clearInterval(kanbanObj._searchTout);
        }, 1000);
    };
    InternalAdaptive.prototype._kbnRightSwipe = function () {
        var kObj = this.kanbanObj, eleWidth = kObj.element.width(), rowCell = kObj.element.find('.e-rowcell:visible'), eqWidth, sHeader = kObj.element.find('.e-stackedHeaderCell'), tCount = 0, prevCount, count, curEle, proxy = kObj;
        if (kObj._kbnSwipeCount > 0) {
            if (kObj._kbnSwipeCount == 1)
                kObj._kbnSwipeWidth = 0;
            else {
                curEle = rowCell.eq(kObj._kbnSwipeCount - 1);
                if (curEle.length == 0)
                    curEle = kObj.element.find(".e-headercell:visible").not(".e-stackedHeaderCell").eq(kObj._kbnSwipeCount - 1);
                kObj._kbnSwipeWidth = kObj._kbnSwipeWidth - curEle.offset().left;
                eqWidth = (eleWidth - curEle.width()) / 2;
                kObj._kbnSwipeWidth = kObj._kbnSwipeWidth + eqWidth;
            }
            for (var i = 0; i < sHeader.length; i++) {
                var leftVal = kObj.headerContent.find('col:eq(0)').width();
                prevCount = tCount, count = kObj._kbnSwipeCount - 1;
                tCount = tCount + (parseInt($(sHeader).eq(i).attr('colspan')));
                if (count >= prevCount && count < tCount) {
                    if (prevCount == kObj._kbnSwipeCount - 1) {
                        kObj.element.find('.e-adapt-stheader').removeClass('e-adapt-stheader');
                        $(sHeader).eq(i).find('div').css({ 'position': '', 'left': '' });
                        var prevHeader = $(sHeader).eq(i).prev('.e-stackedHeaderCell');
                        if (prevHeader.length > 0)
                            prevHeader.addClass('e-adapt-stheader');
                        break;
                    }
                    else if (prevCount < kObj._kbnSwipeCount - 1) {
                        $(sHeader).eq(i).find('div').css({ 'position': 'relative', 'left': (leftVal * ((kObj._kbnSwipeCount - 1) - prevCount)) + (8 * (count - 1)) });
                        break;
                    }
                }
            }
            kObj._kbnTransitionEnd = false;
            if (kObj._kbnSwipeCount > 1)
                kObj._kbnSwipeWidth = kObj._kbnSwipeWidth + kObj.element.offset().left;
            kObj.headerContent.find('table').css({ 'transform': 'translate3d(' + kObj._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '' }).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function (event) {
                proxy._kbnTransitionEnd = true;
            });
            kObj.kanbanContent.find('table').eq(0).css({ 'transform': 'translate3d(' + kObj._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '' });
            --kObj._kbnSwipeCount;
        }
    };
    InternalAdaptive.prototype._kbnLeftSwipe = function () {
        var kObj = this.kanbanObj, eleWidth = kObj.element.width(), rowCell = kObj.element.find('.e-rowcell:visible'), eqWidth, sHeader = kObj.element.find('.e-stackedHeaderCell'), tCount = 0, prevCount, count, curEle, proxy = kObj;
        if (kObj._kbnSwipeCount < kObj.model.columns.length - 1) {
            curEle = rowCell.eq(kObj._kbnSwipeCount + 1);
            if (curEle.length == 0)
                curEle = kObj.element.find(".e-headercell:visible").not(".e-stackedHeaderCell").eq(kObj._kbnSwipeCount + 1);
            kObj._kbnSwipeWidth = kObj._kbnSwipeWidth - (curEle.offset().left);
            if (kObj._kbnSwipeCount == kObj.model.columns.length - 2)
                eqWidth = eleWidth - curEle.width();
            else
                eqWidth = (eleWidth - curEle.width()) / 2;
            kObj._kbnSwipeWidth = kObj._kbnSwipeWidth + eqWidth;
            for (var i = 0; i < sHeader.length; i++) {
                var leftVal = kObj.headerContent.find('col:eq(0)').width();
                prevCount = tCount, count = kObj._kbnSwipeCount + 1;
                tCount = tCount + (parseInt($(sHeader).eq(i).attr('colspan')));
                if (count > prevCount && count < tCount) {
                    if (i == 0) {
                        $(sHeader).eq(i).addClass('e-adapt-stheader');
                        $(sHeader).eq(i).find('div').css({ 'position': 'relative', 'left': (leftVal * count) + (8 * (count - 1)) });
                        break;
                    }
                    else if (prevCount == kObj._kbnSwipeCount + 1) {
                        kObj.element.find('.e-adapt-stheader').removeClass('e-adapt-stheader');
                        $(sHeader).eq(i - 1).find('div').css({ 'position': '', 'left': '' });
                        $(sHeader).eq(i).addClass('e-adapt-stheader');
                        break;
                    }
                    else if (prevCount < kObj._kbnSwipeCount + 1) {
                        $(sHeader).eq(i).find('div').css({ 'position': 'relative', 'left': (leftVal * ((kObj._kbnSwipeCount + 1) - prevCount)) + (8 * (count - 1)) });
                        break;
                    }
                }
            }
            kObj._kbnTransitionEnd = false;
            kObj._kbnSwipeWidth = kObj._kbnSwipeWidth + kObj.element.offset().left;
            kObj.headerContent.find('table').css({ 'transform': 'translate3d(' + kObj._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '' }).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function (event) {
                proxy._kbnTransitionEnd = true;
            });
            kObj.kanbanContent.find('table').eq(0).css({ 'transform': 'translate3d(' + kObj._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '' });
            ++kObj._kbnSwipeCount;
        }
    };
    InternalAdaptive.prototype._clearAdaptSearch = function (e) {
        var kObj = this.kanbanObj, $target, $kanbanEle = kObj.element, $kanbanObj = $kanbanEle.data('ejKanban');
        if (!ej.isNullOrUndefined(e))
            $target = $(e.target);
        if (!ej.isNullOrUndefined($target))
            $target.hide();
        $kanbanEle.data("ejWaitingPopup").show();
        setTimeout(function () {
            var args, input;
            if (!ej.isNullOrUndefined($target))
                input = $target.prev('.e-input');
            if (ej.isNullOrUndefined(input) || input.length == 0) {
                if (!ej.isNullOrUndefined($target))
                    input = $target.next('.e-search').find('input');
                else
                    input = $kanbanEle.find('.e-kanbantoolbar .e-searchdiv > .e-input');
            }
            if (ej.isNullOrUndefined($target))
                args = { itemText: input.val() };
            else
                args = {
                    target: $target, currentTarget: $target,
                    itemIndex: $target.index(), toolbarData: e, itemText: input.val()
                };
            $kanbanObj._trigger("toolbarClick", args);
            kObj.KanbanFilter.searchCards("");
            if (!ej.isNullOrUndefined($kanbanObj.model.fields.swimlaneKey)) {
                var query = new ej.Query().where(ej.Predicate["or"]($kanbanObj.keyPredicates)).select($kanbanObj.model.fields.swimlaneKey);
                $kanbanObj._kbnAdaptDdlData = new ej.DataManager($kanbanObj._currentJsonData).executeLocal(query);
                $kanbanObj._kbnAdaptDdlData = ej.dataUtil.mergeSort(ej.dataUtil.distinct($kanbanObj._kbnAdaptDdlData));
                $kanbanObj.KanbanAdaptive._addSwimlaneName();
            }
            $kanbanEle.data("ejWaitingPopup").hide();
        }, 300);
    };
    InternalAdaptive.prototype._adaptiveKbnClick = function (e) {
        var kObj = this.kanbanObj, $target = $(e.target), filterWin, filterIcon, slWindow = kObj.element.find('.e-swimlane-window');
        if (kObj.element.hasClass('e-responsive')) {
            filterWin = $('.e-kanbanfilter-window');
            filterIcon = kObj.element.find('.e-kanbanfilter-icon');
            if ($target.hasClass('e-searchitem')) {
                var searchBar = $target.parents('.e-searchbar');
                $target.prev().show();
                searchBar.siblings().hide();
                if (searchBar.find('.e-adapt-search').length == 0) {
                    var searchDiv = ej.buildTag('div.e-icon e-adapt-search e-searchfind', "", {}), cancelDiv;
                    cancelDiv = ej.buildTag('div.e-icon e-adapt-cancel e-cancel', "", {});
                    $target.siblings('.e-searchdiv').append(cancelDiv).prepend(searchDiv);
                }
                $target.parents('.e-search').css({ 'border': '' });
                $target.parents('body').addClass('e-kbnwindow-modal');
                $target.parents('.e-kanbantoolbar').addClass('e-adaptive-search');
                searchBar.find('.e-adapt-cancel').show();
                $target.hide();
            }
            if ($target.hasClass('e-adapt-cancel')) {
                this._clearAdaptSearch(e);
                $target.parents('.e-searchbar').siblings(":not('.e-ul.e-horizontal')").show();
                var search = $target.parents(".e-search");
                search.find('.e-searchdiv').hide();
                search.find('.e-searchitem').show();
                search.css({ 'border': 'none' });
                $target.parents('body').removeClass('e-kbnwindow-modal');
                $target.parents('.e-kanbantoolbar').removeClass('e-adaptive-search');
            }
            if ($target.hasClass('e-filter-done') || $target.hasClass('e-clearfilter')) {
                var text = $target.text(), args;
                filterWin.parents('body').removeClass('e-kbnwindow-modal');
                if ($target.hasClass('e-clearfilter'))
                    text = $target.val();
                args = {
                    target: $target, currentTarget: $target,
                    itemIndex: $target.index(), toolbarData: e, itemText: text
                };
                kObj._trigger("toolbarClick", args);
                if ($target.hasClass('e-clearfilter')) {
                    kObj._kbnFilterCollection = [];
                    kObj._kbnFilterObject = [];
                    kObj._filterCollection = [];
                    kObj._kbnAdaptFilterObject = [];
                    $target.hide();
                    filterIcon.removeClass('e-kbnclearfl-icon');
                    filterWin.find('.e-kbnfilter-check').parents('[aria-checked~="true"]').click();
                }
                else {
                    if (!filterIcon.hasClass('e-kbnclearfl-icon'))
                        filterIcon.addClass('e-kbnclearfl-icon');
                    if (kObj._kbnFilterObject.length == 0 && filterIcon.hasClass('e-kbnclearfl-icon'))
                        filterIcon.removeClass('e-kbnclearfl-icon');
                }
                args = {};
                args.requestType = ej.Kanban.Actions.Filtering;
                args.currentFilterObject = [];
                args.filterCollection = kObj._kbnFilterCollection;
                args.currentFilterObject = kObj._kbnFilterObject;
                var kbnCurrentData;
                if (!(kObj._dataSource() instanceof ej.DataManager))
                    kbnCurrentData = kObj._dataSource();
                else
                    kbnCurrentData = kObj._dataSource().dataSource.json;
                if (kbnCurrentData.length == 0 && kObj._currentJsonData.length > 0)
                    kbnCurrentData = kObj._currentJsonData;
                kObj._initialData = kbnCurrentData;
                kObj.KanbanCommon._processBindings(args);
                if (!ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
                    if (kObj._currentJsonData.length == 0) {
                        kObj.element.find('.e-swimlane-ddl,.e-swimlane-window').remove();
                        kObj.kanbanContent.data('ejScroller').destroy();
                    }
                    else {
                        var query = new ej.Query().where(ej.Predicate["or"](kObj.keyPredicates)).select(kObj.model.fields.swimlaneKey);
                        kObj._kbnAdaptDdlData = new ej.DataManager(kObj._currentJsonData).executeLocal(query);
                        kObj._kbnAdaptDdlData = ej.dataUtil.mergeSort(ej.dataUtil.distinct(kObj._kbnAdaptDdlData));
                        kObj.element.find('.e-swimlane-ddl,.e-swimlane-window').remove();
                        this._kbnAdaptSwimlaneDdl();
                    }
                }
                filterWin.hide();
                kObj.kanbanWindowResize();
            }
            if ($target.hasClass('e-filterback-icon')) {
                var filters = [], chk;
                for (var i = 0; i < kObj.model.filterSettings.length; i++)
                    filters.push(kObj.model.filterSettings[i].text);
                for (var i = 0; i < kObj._kbnAdaptFilterObject.length; i++) {
                    var text = kObj._kbnAdaptFilterObject[i].text, index;
                    index = $.inArray(text, filters);
                    filters.splice(index, 1);
                    chk = filterWin.find("label.e-filterlabel:contains(" + text + ")").prev();
                    if (chk.attr('aria-checked') == "false")
                        chk.click();
                }
                for (var i = 0; i < filters.length; i++) {
                    chk = filterWin.find("label.e-filterlabel:contains(" + filters[i] + ")").prev();
                    if (chk.attr('aria-checked') == "true")
                        chk.click();
                }
                filterWin.hide();
            }
            if ($target.hasClass('e-kanbanfilter-icon')) {
                var clear = filterWin.find('.e-clearfilter'), headHeight, cFilter, cFilterHght = 0, scrollContent;
                scrollContent = filterWin.find('.e-filter-scrollcontent');
                if (slWindow.is(':visible'))
                    slWindow.hide();
                filterWin.show();
                if ($target.hasClass('e-kbnclearfl-icon'))
                    clear.show();
                else
                    clear.hide();
                headHeight = filterWin.find('.e-kbnfilterwindow-head').height();
                cFilter = filterWin.find('.e-clearfilter');
                if (cFilter.is(":visible")) {
                    scrollContent.ejScroller({ height: 0, buttonSize: 0, scrollerSize: 9, enableTouchScroll: true, autoHide: true });
                    cFilterHght = cFilter.outerHeight() + parseInt(cFilter.css('bottom'));
                }
                if ($(window).height() - cFilterHght < (filterWin.find('.e-filter-content').height() + headHeight)) {
                    scrollContent.ejScroller({ height: $(window).height() - (headHeight + cFilterHght + 10), buttonSize: 0, scrollerSize: 9, enableTouchScroll: true, autoHide: true });
                }
                filterWin.parents('body').addClass('e-kbnwindow-modal');
            }
            if ($target.attr('id') == this._id + "_Cancel" || $target.parent().attr("id") == this._id + "_closebutton")
                kObj.KanbanEdit.cancelEdit();
            if ($target.attr('id') == kObj._id + "_Save")
                kObj.KanbanEdit.endEdit();
        }
        var slScroller = kObj.element.find('.e-slwindow-scrollcontent');
        if ($target.hasClass('e-swimlane-item') || $target.parents('.e-swimlane-item').length > 0) {
            var trgt = $target, rows, toolBar;
            if ($target.parents('.e-swimlane-item').length > 0)
                trgt = $target.parents('.e-swimlane-item');
            slWindow = $('#' + kObj._id + '_slWindow');
            kObj._kbnAdaptDdlIndex = kObj._freezeSlOrder = slWindow.find('.e-swimlane-item').index(trgt);
            toolBar = $('#' + kObj._id + "_toolbarItems");
            toolBar.find('.e-kbnhide').removeClass('e-kbnhide');
            toolBar.removeClass('e-kbntoolbar-body').prependTo(kObj.element);
            slWindow.removeClass('e-kbnslwindow-body').appendTo(kObj.element).hide();
            kObj.element.find('.e-swimlane-text').text(kObj._kbnAdaptDdlData[kObj._kbnAdaptDdlIndex]);
            rows = kObj.element[0].getElementsByClassName('e-columnrow');
            kObj.kanbanWindowResize();
            var scroller = kObj.kanbanContent.data('ejScroller');
            scroller.scrollY(0, true);
            scroller.scrollY(($(rows[kObj._kbnAdaptDdlIndex]).offset().top - kObj.kanbanContent.offset().top), true);
            if (slScroller.hasClass('e-scroller'))
                slScroller.data('ejScroller').refresh();
        }
        if ($target.hasClass('e-swimlane-ddl') || $target.parents('.e-swimlane-ddl').length > 0) {
            var top = 36, toolBar;
            if (slWindow.is(':hidden')) {
                kObj.element.parents('body').addClass('e-kbnwindow-modal');
                toolBar = kObj.element.find('.e-kanbantoolbar');
                toolBar.children().not('.e-swimlane-ddl').addClass('e-kbnhide');
                toolBar.addClass('e-kbntoolbar-body').appendTo('body');
                kObj.element.find('.e-swimlane-window').addClass('e-kbnslwindow-body').appendTo('body');
                slWindow.show();
                if ($(window).height() < top + slScroller.height())
                    slScroller.ejScroller({ height: $(window).height() - top, buttonSize: 0, scrollerSize: 9, enableTouchScroll: true, autoHide: true });
            }
            else {
                slWindow.hide();
                toolBar = $('#' + kObj._id + "_toolbarItems");
                toolBar.find('.e-kbnhide').removeClass('e-kbnhide');
                toolBar.removeClass('e-kbntoolbar-body').prependTo(kObj.element);
                $('#' + kObj._id + '_slWindow').removeClass('e-kbnslwindow-body').appendTo(kObj.element).hide();
                kObj.element.parents('body').removeClass('e-kbnwindow-modal');
            }
        }
    };
    InternalAdaptive.prototype._kbnFilterChange = function (args) {
        var kObj = this, $kanbanEle = $(args.event.target).closest(".e-kanban"), kanbanObj = $kanbanEle.data("ejKanban");
        var filterName = $(args.event.target).parents('.e-chkbox-wrap').next().text(), kbnFilter, done, filterValue;
        if (!kObj["_kbnAutoFilterCheck"]) {
            if (filterName == "")
                filterName = $(args.event.target).next().text();
            kbnFilter = $kanbanEle.find('.e-kanbanfilter-icon');
            done = $('.e-kanbanfilter-window .e-filter-done');
            if (done.is(':hidden'))
                done.show();
            for (var count = 0; count < kObj["model"].filterSettings.length; count++) {
                if (kObj["model"].filterSettings[count]["text"] == filterName)
                    break;
            }
            filterValue = (count == kObj["model"].filterSettings.length ? null : kObj["model"].filterSettings[count]);
            if (!args.isChecked) {
                var index = $.inArray(filterValue, kObj["_kbnFilterObject"]);
                if (index >= 0) {
                    kObj["_kbnFilterObject"].splice(index, 1);
                    kObj["_kbnFilterCollection"].splice(index, 1);
                }
            }
            else {
                kObj["_kbnFilterObject"].push(filterValue);
                for (var i = 0; i < kObj["model"].filterSettings.length; i++) {
                    if (kObj["model"].filterSettings[i].text == filterValue.text) {
                        var query = kObj["model"].filterSettings[i].query["queries"][0].e;
                        kObj["_kbnFilterCollection"].push(query);
                    }
                }
            }
        }
    };
    InternalAdaptive.prototype._kbnAdaptSwimlaneData = function () {
        var kObj = this.kanbanObj, proxy = kObj;
        if (kObj.model.isResponsive && (ej.isNullOrUndefined(kObj.model.minWidth) || kObj.model.minWidth == 0) && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
            var query = new ej.Query();
            if (!ej.isNullOrUndefined(kObj.model.keyField))
                kObj._addColumnFilters();
            kObj.model.query["_fromTable"] != "" && query.from(kObj.model.query["_fromTable"]);
            if (kObj._dataSource() instanceof ej.DataManager && query["queries"].length && !kObj._dataManager.dataSource.offline) {
                var queryPromise = kObj._dataSource().executeQuery(query);
                queryPromise.done(ej.proxy(function (e) {
                    this._kbnAdaptDdlData = new ej.DataManager(e.result);
                    query = new ej.Query().where(ej.Predicate["or"](kObj.keyPredicates)).select(kObj.model.fields.swimlaneKey);
                    kObj._kbnAdaptDdlData = kObj._kbnAdaptDdlData.executeLocal(query);
                    kObj._kbnAdaptDdlData = ej.dataUtil.mergeSort(ej.dataUtil.distinct(kObj._kbnAdaptDdlData));
                }));
            }
            else {
                query = new ej.Query().where(ej.Predicate["or"](kObj.keyPredicates)).select(kObj.model.fields.swimlaneKey);
                if (kObj._dataManager.dataSource.offline && kObj._dataManager.dataSource.json.length)
                    kObj._kbnAdaptDdlData = kObj._dataManager.executeLocal(query);
                kObj._kbnAdaptDdlData = ej.dataUtil.mergeSort(ej.dataUtil.distinct(kObj._kbnAdaptDdlData));
            }
        }
    };
    InternalAdaptive.prototype._setResponsiveHeightWidth = function () {
        var kObj = this.kanbanObj;
        if (typeof (kObj.model.scrollSettings.width) == "string")
            kObj._originalScrollWidth = kObj.element.width();
        else if (kObj.model.scrollSettings.width > 0)
            kObj._originalScrollWidth = kObj.model.scrollSettings.width;
        if (typeof (kObj.model.scrollSettings.height) == "string")
            kObj._originalScrollHeight = kObj.getContent().height();
        else if (kObj.model.scrollSettings.height > 0)
            kObj._originalScrollHeight = kObj.model.scrollSettings.height;
        if (kObj.model.isResponsive) {
            $(window).on("resize", $.proxy(kObj.kanbanWindowResize, kObj));
            kObj.kanbanWindowResize();
        }
    };
    InternalAdaptive.prototype._renderResponsiveKanban = function (isScroller, elemHeight, width, winHeight, winWidth) {
        var kObj = this.kanbanObj;
        if (isScroller) {
            kObj.model.scrollSettings.width = ej.isNullOrUndefined(kObj._originalScrollWidth) ? Math.min(width, winWidth) : Math.min(kObj._originalScrollWidth, Math.min(width, winWidth));
            var height = Math.min(winHeight, elemHeight);
            height = ej.isNullOrUndefined(kObj._originalScrollHeight) ? height : Math.min(kObj._originalScrollHeight, winHeight);
            kObj.model.scrollSettings.height = height;
            if (kObj._originalScrollWidth < winWidth)
                kObj.model.scrollSettings.width = Math.min(width, winWidth);
            if (kObj.KanbanScroll)
                kObj.KanbanScroll._renderScroller();
        }
        else {
            kObj.model.scrollSettings.width = '100%';
            if (!ej.isNullOrUndefined(kObj._originalScrollWidth))
                kObj.model.scrollSettings.width = Math.min(kObj._originalScrollWidth, width);
            var height = kObj.element.outerHeight();
            if (!ej.isNullOrUndefined(kObj._originalScrollHeight))
                height = Math.min(kObj._originalScrollHeight, winHeight);
            kObj.model.scrollSettings.height = height;
            if (kObj.KanbanScroll)
                kObj.KanbanScroll._renderScroller();
        }
    };
    InternalAdaptive.prototype._columnTimeoutAdapt = function () {
        var kObj = this.kanbanObj;
        if (kObj.element.width() > $(window).width()) {
            kObj.element.width(($(window).width() - kObj.element.offset().left) - 5);
            kObj.headerContent.removeClass('e-scrollcss');
            kObj.headerContent.find('.e-hscrollcss').removeClass('e-hscrollcss');
        }
        var eqwidth = (kObj.element.width() * (80 / 100)), hCell, rCell, sHeader, proxy = kObj, timeot, curEle;
        hCell = kObj.element.find('.e-headercell');
        rCell = kObj.element.find('.e-columnrow .e-rowcell');
        kObj.kanbanContent.find('table:eq(0) > colgroup col').width(eqwidth);
        rCell.width(eqwidth);
        kObj.headerContent.find('table > colgroup col').width(eqwidth);
        hCell.not('.e-stackedHeaderCell').width(eqwidth);
        sHeader = kObj.element.find('.e-stackedHeaderCell');
        for (var i = 0; i < sHeader.length; i++)
            $(sHeader).eq(i).width(parseInt($(sHeader).eq(i).attr('colspan')) * eqwidth);
        timeot = setTimeout(function () {
            if (proxy._kbnSwipeCount > 0) {
                curEle = rCell.eq(proxy._kbnSwipeCount);
                if (curEle.length == 0)
                    curEle = hCell.not('.e-stackedHeaderCell').eq(kObj._kbnSwipeCount);
                proxy._kbnSwipeWidth = proxy._kbnSwipeWidth - curEle.offset().left;
                var eleWidth = proxy.element.width(), colWidth = curEle.width();
                if (proxy._kbnSwipeCount == proxy.model.columns.length - 1) {
                    if (proxy.element.hasClass('e-swimlane-responsive'))
                        eqwidth = eleWidth - (colWidth + 18);
                    else
                        eqwidth = eleWidth - colWidth;
                }
                else
                    eqwidth = (eleWidth - colWidth) / 2;
                proxy._kbnSwipeWidth = proxy._kbnSwipeWidth + eqwidth + kObj.element.offset().left;
                proxy.headerContent.find('table').css({ 'transform': 'translate3d(' + proxy._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '0ms' });
                proxy.kanbanContent.find('table').eq(0).css({ 'transform': 'translate3d(' + proxy._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '0ms' });
                clearTimeout(timeot);
            }
        }, 2500);
    };
    InternalAdaptive.prototype._addSwimlaneName = function () {
        var rows = this.kanbanObj.element.find('.e-columnrow');
        for (var i = 0; i < rows.length; i++) {
            var cells = rows.eq(i).find('.e-rowcell');
            for (var j = 0; j < cells.length; j++) {
                var $limit = cells.eq(j).find('.e-limits');
                if ($limit.length == 0)
                    $limit = ej.buildTag('div.e-limits', "", {}, {});
                if ($limit.find('.e-swimlane-name').length == 0) {
                    $limit.append(ej.buildTag('div.e-swimlane-name', this.kanbanObj._kbnAdaptDdlData[i], {}, {}));
                    cells.eq(j).prepend($limit);
                }
                else {
                    var name = $limit.find('.e-swimlane-name');
                    name.show();
                    name.parents('.e-limits').show();
                }
            }
        }
    };
    InternalAdaptive.prototype._kbnAdaptSwimlaneDdl = function () {
        var kObj = this.kanbanObj, $ddl = ej.buildTag('div.e-swimlane-ddl', "", {}), curItem = kObj.model.fields.swimlaneKey, textDiv, slWindow, slItem, slScrollContent;
        var ddlItems = [], ddlTempl, $select, $option, data, uniqueData, toolbar = kObj.element.find('.e-kanbantoolbar');
        kObj.element.addClass('e-swimlane-responsive');
        ej.buildTag('div.e-swimlane-text', kObj._kbnAdaptDdlData[0]).appendTo($ddl);
        ej.buildTag('div.e-swimlane-arrow').appendTo($ddl);
        slWindow = ej.buildTag('div#' + kObj._id + '_slWindow.e-swimlane-window', "", {});
        slItem = ej.buildTag('ul.e-swimlane-ul ', "", {});
        for (var index = 0; index < kObj._kbnAdaptDdlData.length; index++)
            ej.buildTag('li.e-swimlane-item ', '<div>' + kObj._kbnAdaptDdlData[index] + '</div>', {}).appendTo(slItem);
        this._addSwimlaneName();
        slScrollContent = ej.buildTag("div#" + kObj._id + "_slScrollContent", "<div></div>").addClass("e-slwindow-scrollcontent");
        slScrollContent.children().append(slItem);
        slScrollContent.appendTo(slWindow);
        slWindow.appendTo(kObj.element).hide();
        if (toolbar.length == 0) {
            kObj._renderToolBar().insertBefore(kObj.element.find(".e-kanbanheader").first());
            toolbar = kObj.element.find('.e-kanbantoolbar').css("padding", "0px").addClass('e-sladapt-bar');
        }
        toolbar.prepend($ddl);
        kObj.element.find('.e-swimlanerow').hide();
    };
    InternalAdaptive.prototype._kbnAdaptFilterWindow = function () {
        var kObj = this.kanbanObj, toolbar = kObj.element.find('.e-kanbantoolbar'), headDiv, bodyDiv, clearbtn, $div, filterIcon, $filterWin, filterScrollContent;
        toolbar.find('.e-quickfilter').parent().hide();
        $filterWin = ej.buildTag('div.e-kanbanfilter-window', "", {});
        headDiv = ej.buildTag('div.e-kbnfilterwindow-head', "", {});
        ej.buildTag('div.e-filterback-icon', "", {}).appendTo(headDiv);
        ej.buildTag('div.e-text', "FILTER", {}).appendTo(headDiv);
        ej.buildTag('div.e-text e-filter-done', "DONE", {}).appendTo(headDiv).hide();
        headDiv.appendTo($filterWin);
        $('body').append($filterWin.hide());
        bodyDiv = ej.buildTag('div.e-kbnfilterwindow-body', "", {});
        $div = ej.buildTag("div.e-filter-content");
        for (var i = 0; i < kObj.model.filterSettings.length; i++) {
            var $item = ej.buildTag("div", "", {});
            $item.append("<input type='checkbox' class='e-kbnfilter-check' id='check" + i + "' /><label for='check" + i + "' class='e-filterlabel'>" + kObj.model.filterSettings[i].text + "</label></td>");
            $div.append($item);
            $item.find('input').ejCheckBox({ change: $.proxy(this._kbnFilterChange, kObj) });
        }
        bodyDiv.append($div);
        filterScrollContent = ej.buildTag("div#" + kObj._id + "_filterScrollContent", "<div></div>").addClass("e-filter-scrollcontent");
        filterScrollContent.children().append(bodyDiv);
        filterScrollContent.appendTo($filterWin);
        clearbtn = ej.buildTag('input.e-clearfilter', "", {}, { type: "button", id: kObj._id + "_ClearFilter" });
        clearbtn.ejButton({ text: "ClearFilter" });
        $filterWin.append(clearbtn);
        clearbtn.hide();
        filterIcon = ej.buildTag('div.e-kanbanfilter-icon', "", { 'float': 'right' });
        toolbar.append(filterIcon);
    };
    InternalAdaptive.prototype._removeKbnAdaptItems = function () {
        var kObj = this.kanbanObj;
        if (kObj.element.hasClass('e-responsive')) {
            var toolbar = kObj.element.find('.e-kanbantoolbar'), sHeader = kObj.element.find('.e-stackedHeaderCell'), scrollEle, swimDdl = kObj.element.find('.e-swimlane-ddl'), $filterWin = $('.e-kanbanfilter-window'), scrollCell;
            if (swimDdl.length > 0) {
                swimDdl.remove();
                kObj.element.find('.e-swimlane-window').remove();
            }
            if (toolbar.hasClass('e-sladapt-bar'))
                toolbar.remove();
            if ($filterWin.length > 0) {
                var filters = $filterWin.find('.e-filter-content').children();
                for (var i = 0; i < filters.length; i++) {
                    if (filters.eq(i).find('span.e-chkbox-wrap').attr('aria-checked') == "true") {
                        var index = filters.index(filters.eq(i));
                        kObj.element.find('.e-quickfilter').nextAll('li.e-tooltxt').eq(index).addClass('e-select');
                    }
                }
                $filterWin.remove();
            }
            if (sHeader.length > 0)
                sHeader.width('');
            kObj.element.find('.e-rowcell,.e-headercell').width('');
            kObj.kanbanContent.find('table:eq(0) > colgroup col').width('');
            kObj.headerContent.find('table > colgroup col').width('');
            if (!kObj.element.hasClass('e-swimlane-responsive')) {
                scrollEle = kObj.element.find('.e-rowcell .e-cell-scrollcontent:visible');
                for (var i = 0; i < scrollEle.length; i++) {
                    var scrollObj = $(scrollEle[i]).data('ejScroller');
                    if (!ej.isNullOrUndefined(scrollObj))
                        scrollObj.destroy();
                }
            }
            if (toolbar.length > 0 && toolbar.is(':visible')) {
                toolbar.css('display', 'block');
                var qFilter = toolbar.find('.e-quickfilter'), sBar = toolbar.find('.e-searchbar'), sDiv;
                if (toolbar.find('.e-adapt-cancel').is(':visible'))
                    sBar.find('.e-searchitem').addClass('e-cancel').removeClass('e-searchfind');
                toolbar.find('.e-adapt-cancel,.e-adapt-search').hide();
                if (qFilter.length > 0) {
                    toolbar.find('.e-kanbanfilter-icon').remove();
                    qFilter.parent('.e-ul.e-horizontal').show();
                }
                sDiv = sBar.find('.e-searchdiv');
                if (sDiv.length > 0) {
                    sDiv.show();
                    sBar.find('.e-search').css('border', '');
                    sBar.find('.e-searchitem').show();
                    toolbar.parents('body').removeClass('e-kbnwindow-modal');
                    toolbar.removeClass('e-adaptive-search');
                }
            }
            kObj.headerContent.find('table').css({ 'transform': '', 'transition-duration': '' });
            kObj.kanbanContent.find('table').eq(0).css({ 'transform': '', 'transition-duration': '' });
            scrollCell = kObj.element.find('.e-cell-scrollcontent');
            for (var i = 0; i < scrollCell.length; i++) {
                var scrollDiv = scrollCell.eq(i).children();
                scrollDiv.children().appendTo(scrollCell.eq(i).parents('.e-rowcell'));
                scrollCell.eq(i).remove();
            }
            var kbnDialog = kObj.element.find('.e-kanbandialog');
            if (kbnDialog.is(':visible')) {
                var scroller = kbnDialog.parents('.e-dialog-scroller'), wrapper = kbnDialog.parents('.e-dialog');
                wrapper.css({ 'top': '', 'left': '' }).removeClass('e-kbnadapt-editdlg');
                scroller.css('height', 'auto');
                scroller.ejScroller({ height: 0, buttonSize: 0, scrollerSize: 9, enableTouchScroll: true, autoHide: true });
                kbnDialog.parents('body').removeClass('e-kbnwindow-modal');
                wrapper.hide();
                kObj.KanbanEdit._onKbnDialogOpen();
            }
            if (!ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
                if (kObj.kanbanContent.hasClass('e-scroller'))
                    kObj.kanbanContent.data('ejScroller').destroy();
                kObj.element.parents('body').removeClass('e-kbnwindow-modal');
                kObj.element.find('.e-swimlanerow').show();
                var rows = kObj.element.find('.e-columnrow');
                for (var i = 0; i < rows.length; i++) {
                    var cells = rows.eq(i).find('.e-rowcell');
                    for (var j = 0; j < cells.length; j++) {
                        var name = cells.eq(j).find('.e-swimlane-name');
                        if (name.length > 0) {
                            if (name.siblings().length == 0)
                                name.parents('.e-limits').hide();
                            else
                                name.hide();
                        }
                    }
                }
            }
            var stHeader = kObj.element.find('.e-adapt-stheader');
            if (stHeader.length > 0)
                stHeader.find('div').css({ 'position': '', 'left': '' });
            kObj.element.removeClass('e-responsive');
            kObj.element.removeClass('e-swimlane-responsive');
        }
    };
    InternalAdaptive.prototype._setAdaptEditWindowHeight = function () {
        var kObj = this.kanbanObj, kbnDialog, scroller, title;
        kbnDialog = $('#' + kObj._id + "_dialogEdit"), scroller = kbnDialog.parents('.e-dialog-scroller'), title;
        kbnDialog.parents('.e-dialog').css({ 'top': '0', 'left': '0' }).addClass('e-kbnadapt-editdlg');
        kbnDialog.parents('body').addClass('e-kbnwindow-modal');
        title = scroller.prev('.e-titlebar');
        scroller.ejScroller({ height: $(window).height() - title.outerHeight(), buttonSize: 0, scrollerSize: 9, enableTouchScroll: true, autoHide: true });
        scroller.data('ejScroller').refresh();
        kbnDialog.css('height', scroller.height());
    };
    return InternalAdaptive;
}());
window.ej.createObject("ej.KanbanFeatures.Adaptive", InternalAdaptive, window);
;
var InternalScroller = (function () {
    function InternalScroller(element) {
        this.kanbanObj = null;
        this.kanbanObj = element;
    }
    ;
    InternalScroller.prototype._initScrolling = function () {
        var kObj = this.kanbanObj;
        if (kObj.model.width || kObj.model.height) {
            kObj.model.allowScrolling = true;
            if (kObj.model.width)
                kObj.model.scrollSettings.width = kObj.model.width;
            if (kObj.model.height)
                kObj.model.scrollSettings.height = kObj.model.height;
        }
        kObj._originalScrollWidth = kObj.model.scrollSettings.width;
    };
    InternalScroller.prototype._renderScroller = function () {
        var kObj = this.kanbanObj;
        if (!kObj.model.scrollSettings)
            kObj.model.scrollSettings = {};
        if (typeof (kObj._originalScrollWidth) == "string") {
            kObj.element.css("width", "auto");
            var width = kObj.element.width();
            if (kObj.model.scrollSettings.width == "auto" || kObj._originalScrollWidth == "auto")
                kObj._originalScrollWidth = "100%";
            kObj.model.scrollSettings.width = width * (parseFloat(kObj._originalScrollWidth) / 100);
        }
        if (typeof (kObj.model.scrollSettings.height) == "string") {
            var height = kObj.element.height();
            if (kObj.model.scrollSettings.height == "auto")
                kObj.model.scrollSettings.height = "100%";
            kObj.model.scrollSettings.height = height * (parseFloat(kObj.model.scrollSettings.height) / 100);
        }
        if ((kObj.model.scrollSettings.width || kObj.model.width))
            kObj.element.width(kObj.model.scrollSettings.width || kObj.model.width);
        var contentHeight = kObj.model.scrollSettings.height != 0 ? (kObj.model.scrollSettings.height - kObj.getHeaderTable().height() - (!ej.isNullOrUndefined(kObj._filterToolBar) && kObj._filterToolBar.height())) : kObj.model.scrollSettings.height;
        var $content = kObj.getContent().attr("tabindex", "0");
        kObj.element.addClass("e-kanbanscroll");
        $content.ejScroller({
            enableRTL: kObj.model.enableRTL,
            height: contentHeight,
            width: kObj.model.scrollSettings.width,
            thumbStart: $.proxy(kObj._kbnThumbStart, kObj),
            scroll: $.proxy(kObj._freezeSwimlane, kObj)
        });
        if (kObj.getContent().ejScroller("isVScroll")) {
            kObj.element.find(".e-kanbanheader").addClass("e-scrollcss");
            kObj.getHeaderContent().find("div").first().addClass("e-headercontent");
        }
        else
            kObj.element.find(".e-kanbanheader").removeClass("e-scrollcss");
        if (kObj.model.scrollSettings.width || kObj.model.width)
            kObj.element.width(kObj.model.scrollSettings.width || kObj.model.width);
        var scroller = kObj.getContent().data("ejScroller"), css = scroller && (scroller.isVScroll()) ? "addClass" : "removeClass";
        kObj.getHeaderContent().find(".e-headercontent")[css]("e-hscrollcss");
        this._refreshHeaderScroller();
    };
    InternalScroller.prototype._refreshHeaderScroller = function () {
        var proxy = this.kanbanObj;
        this.kanbanObj.getContent().find(".e-content").scroll(ej.proxy(function (e) {
            proxy.getHeaderContent().find("div").first().scrollLeft($(e.currentTarget).scrollLeft());
        }));
        this.kanbanObj.element.find(".e-kanbanheader").find(".e-headercontent").scroll(ej.proxy(function (e) {
            var $currentTarget = $(e.currentTarget);
            proxy.getContent().find(".e-content").first().scrollLeft($currentTarget.scrollLeft());
        }));
    };
    InternalScroller.prototype._refreshScroller = function (args) {
        var kObj = this.kanbanObj;
        var kanbanContent = kObj.getContent().first();
        if (ej.isNullOrUndefined(kanbanContent.data("ejScroller")))
            return;
        if (args.requestType == "beginedit")
            kObj.getScrollObject().scrollY(0, true);
        kanbanContent.ejScroller("refresh");
        kanbanContent.ejScroller({ enableRTL: kObj.model.enableRTL });
        if (kanbanContent.ejScroller("isVScroll") && !kObj.getScrollObject().model.autoHide) {
            kObj.getHeaderContent().addClass("e-scrollcss");
            !kObj.getHeaderContent().find(".e-headercontent").hasClass("e-hscrollcss") && kObj.getHeaderContent().find(".e-headercontent").addClass("e-hscrollcss");
        }
        else
            kObj.element.find(".e-kanbanheader").removeClass("e-scrollcss");
    };
    return InternalScroller;
}());
window.ej.createObject("ej.KanbanFeatures.Scroller", InternalScroller, window);
;
var InternalSelection = (function () {
    function InternalSelection(element) {
        this.kanbanObj = null;
        this.kanbanObj = element;
    }
    ;
    InternalSelection.prototype._cardSelection = function (rowCellIndexes, target, e) {
        var kObj = this.kanbanObj, $cell, args, previousCard = null, data = null, queryManager;
        $cell = target.parent("td.e-rowcell");
        if (kObj._currentRowCellIndex.length > 0)
            kObj._previousRowCellIndex = [[kObj._currentRowCellIndex[0][0], [kObj._currentRowCellIndex[0][1][0]], [kObj._currentRowCellIndex[0][2][0]]]];
        if (!ej.isNullOrUndefined(target.attr("id"))) {
            queryManager = new ej.DataManager(kObj._currentJsonData);
            data = queryManager.executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, target.attr('id')));
        }
        if (!ej.isNullOrUndefined(kObj._previousRowCellIndex) && kObj._previousRowCellIndex.length != 0)
            previousCard = kObj.KanbanCommon._getCardbyIndexes(kObj._previousRowCellIndex);
        args = { currentCell: $cell, target: target, cellIndex: rowCellIndexes[0][1][0], cardIndex: rowCellIndexes[0][2][0], data: data, previousRowCellIndex: kObj._previousRowCellIndex, previousCard: previousCard, selectedCardsData: kObj._selectedCardData };
        if (kObj._trigger("beforeCardSelect", args))
            return;
        if (!$(target).hasClass("e-cardselection")) {
            if (kObj.model.selectionType == "multiple" && !kObj._kTouchBar.find(".e-cardtouch").hasClass("e-spanclicked"))
                kObj._kTouchBar.hide();
            if (e["pointerType"] == "touch" && !kObj._kTouchBar.find(".e-cardtouch").hasClass("e-spanclicked") && kObj.model.selectionType == "multiple") {
                var trgtOffset = $(target).offset();
                kObj._kTouchBar.show();
                kObj._kTouchBar.offset({ top: trgtOffset.top, left: trgtOffset.left });
            }
        }
        if (e["pointerType"] == "touch" && $(target).hasClass("e-cardselection") && kObj._kTouchBar.is(':hidden')) {
            var trgtOffset = $(target).offset();
            kObj._kTouchBar.show();
            kObj._kTouchBar.offset({ top: trgtOffset.top, left: trgtOffset.left });
        }
        if (kObj.model.selectionType == "multiple" && e.shiftKey) {
            var parentRow, cards, i = 0, l = 0, endCard = target, selectedCards = [];
            if (!ej.isNullOrUndefined(previousCard)) {
                parentRow = previousCard.parents('.e-columnrow');
                parentRow.find('.e-cardselection').not(previousCard).removeClass('e-cardselection');
                cards = parentRow.find('.e-kanbancard');
                i = cards.index(previousCard);
            }
            else
                cards = target.parents('.e-columnrow').find('.e-kanbancard');
            kObj._selectedCards = [];
            kObj._selectedCardData = [];
            kObj.selectedRowCellIndexes = [];
            while (l <= 0) {
                var row, column, curRowCellIndexes = [];
                row = $(cards[i]).parents('.e-columnrow');
                column = $(cards[i]).parents('.e-rowcell');
                $(cards[i]).addClass('e-cardselection');
                selectedCards.push(cards[i]);
                kObj._selectedCardData.push(kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, cards[i].id)[0]);
                curRowCellIndexes = [[kObj.element.find('.e-columnrow').index(row), [column.index()], [column.find($(cards[i])).index()]]];
                if (cards[i].id == endCard.attr("id"))
                    l = 1;
                this._pushIntoSelectedArray(curRowCellIndexes);
                if (!ej.isNullOrUndefined(previousCard)) {
                    if (rowCellIndexes[0][1][0] < kObj._previousRowCellIndex[0][1][0])
                        --i;
                    else if (rowCellIndexes[0][1][0] == kObj._previousRowCellIndex[0][1][0]) {
                        if (rowCellIndexes[0][2][0] < kObj._previousRowCellIndex[0][2][0])
                            --i;
                        else
                            ++i;
                    }
                    else
                        ++i;
                }
                else {
                    ++i;
                }
            }
            if (ej.isNullOrUndefined(previousCard)) {
                kObj._previousRowCellIndex = kObj._currentRowCellIndex = [[0, [0], [0]]];
                previousCard = kObj.KanbanCommon._getCardbyIndexes(kObj._previousRowCellIndex);
            }
            kObj._selectedCards = [];
            kObj._selectedCards[kObj._selectedCards.length] = selectedCards;
            if (ej.isNullOrUndefined(previousCard) && (!e.ctrlKey && !e.shiftKey && !kObj._enableMultiTouch)) {
                {
                    $(target).addClass('e-cardselection');
                    kObj._selectedCards.push(target[0]);
                    kObj._selectedCardData.push(kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, target.id)[0]);
                    this._pushIntoSelectedArray(rowCellIndexes);
                }
            }
        }
        if (kObj.model.selectionType == "multiple" && (e.ctrlKey || kObj._enableMultiTouch)) {
            if ($(target).hasClass("e-cardselection")) {
                $(target).removeClass("e-cardselection");
                this._popFromSelectedArray(rowCellIndexes[0][0], rowCellIndexes[0][1], rowCellIndexes[0][2], e);
                for (var k = 0; k < kObj._selectedCardData.length; k++) {
                    if (data[0][kObj.model.fields.primaryKey] == kObj._selectedCardData[0][kObj.model.fields.primaryKey])
                        break;
                }
                kObj._selectedCardData.splice(k, 1);
                kObj._selectedCards.splice(k, 1);
                kObj._currentRowCellIndex = rowCellIndexes;
            }
            else {
                $(target).addClass("e-cardselection");
                kObj._selectedCards.push(target[0]);
                this._pushIntoSelectedArray(rowCellIndexes);
                kObj._selectedCardData.push(data[0]);
            }
        }
        else {
            if (!(kObj.model.selectionType == "multiple" && e.shiftKey)) {
                var cardIndex = rowCellIndexes[0][2];
                kObj.element.find(".e-cardselection").removeClass("e-cardselection");
                kObj._selectedCards = [];
                kObj.selectedRowCellIndexes = [];
                $(target).addClass("e-cardselection");
                kObj._selectedCardData = [];
                kObj._selectedCardData.push(data[0]);
                kObj._selectedCards.push(target[0]);
                if (kObj.model.selectionType == "multiple")
                    cardIndex = [rowCellIndexes[0][2]];
                kObj.selectedRowCellIndexes.push({ rowIndex: rowCellIndexes[0][0], cellIndex: rowCellIndexes[0][1], cardIndex: cardIndex });
            }
        }
        args = { currentCell: $cell, target: target, cellIndex: rowCellIndexes[0][1][0], cardIndex: rowCellIndexes[0][2][0], data: data, selectedRowCellIndex: kObj.selectedRowCellIndexes, previousRowCellIndex: kObj._previousRowCellIndex, previousCard: previousCard, selectedCardsData: kObj._selectedCardData };
        if (kObj.model.selectionType == "multiple" && e.shiftKey && $(target).hasClass("e-cardselection")) {
            if (kObj._previousRowCellIndex.length == 0)
                kObj._currentRowCellIndex = [[target.parents('.e-columnrow').index(), [0], [0]]];
            if (kObj._currentRowCellIndex.length == 0)
                kObj._currentRowCellIndex = rowCellIndexes;
        }
        else if ($(target).hasClass("e-cardselection"))
            kObj._currentRowCellIndex = rowCellIndexes;
        if (kObj._trigger("cardSelect", args))
            return;
        kObj.element.focus();
    };
    InternalSelection.prototype.clear = function () {
        var kObj = this.kanbanObj;
        if (kObj.model.allowSelection) {
            var $kanbanRows = $(kObj._kanbanRows).not(".e-swimlanerow");
            $($kanbanRows).find(".e-rowcell .e-kanbancard").removeClass("e-cardselection");
            kObj.selectedRowCellIndexes = [];
            kObj._selectedCardData = [];
            kObj._selectedCards = [];
            kObj._previousRowCellIndex = [];
            kObj._currentRowCellIndex = [];
        }
    };
    InternalSelection.prototype._pushIntoSelectedArray = function (rowCellIndexes) {
        var kObj = this.kanbanObj, i, l = 0, newRow = true, newCell = true;
        for (i = 0; i < kObj.selectedRowCellIndexes.length; i++) {
            var row = kObj.selectedRowCellIndexes[i];
            if (row.rowIndex == rowCellIndexes[0][0]) {
                newRow = false;
                for (l = 0; l < row.cellIndex.length; l++) {
                    var cell = row.cellIndex[l];
                    if (cell == rowCellIndexes[0][1][0]) {
                        newCell = false;
                        break;
                    }
                }
                break;
            }
        }
        if (newRow)
            kObj.selectedRowCellIndexes.push({ rowIndex: rowCellIndexes[0][0], cellIndex: rowCellIndexes[0][1], cardIndex: [rowCellIndexes[0][2]] });
        if (!newCell)
            kObj.selectedRowCellIndexes[i].cardIndex[l].push(rowCellIndexes[0][2][0]);
        else if (!newRow) {
            kObj.selectedRowCellIndexes[i].cellIndex.push(rowCellIndexes[0][1][0]);
            kObj.selectedRowCellIndexes[i].cardIndex.push([rowCellIndexes[0][2][0]]);
        }
    };
    InternalSelection.prototype._popFromSelectedArray = function (val1, val2, val3, e) {
        var kObj = this.kanbanObj;
        if (kObj.model.selectionType == "multiple" && (e.ctrlKey || e.shiftKey || kObj._enableMultiTouch)) {
            var i, l, j;
            for (i = 0; i < kObj.selectedRowCellIndexes.length; i++) {
                var row = kObj.selectedRowCellIndexes[i];
                if (row.rowIndex == val1) {
                    for (l = 0; l < row.cellIndex.length; l++) {
                        var cell = row.cellIndex[l];
                        if (cell == val2[0]) {
                            if (e.shiftKey) {
                                row.cardIndex = [];
                                break;
                            }
                            else {
                                for (j = 0; j < row.cardIndex[l].length; j++) {
                                    var card = row.cardIndex[l][j];
                                    if (card == val3[0]) {
                                        row.cardIndex[l].splice(j, 1);
                                        if (row.cardIndex[l].length == 0) {
                                            row.cardIndex.splice(l, 1);
                                            row.cellIndex.splice(l, 1);
                                        }
                                        if (row.cellIndex.length == 0)
                                            kObj.selectedRowCellIndexes.splice(i, 1);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    InternalSelection.prototype._selectionOnRerender = function () {
        var rowIndex, row, column, cardsSelected = true, kObj = this.kanbanObj;
        if (!kObj.model.allowSelection)
            return;
        if (kObj.model.selectionType == "single") {
            if (kObj._selectedCards.length > 0) {
                var el = $(kObj._selectedCards[0]), curEl, index;
                curEl = kObj.element.find("#" + el[0].id);
                if (curEl.hasClass('e-kanbancard')) {
                    row = $(curEl).parents('.e-columnrow');
                    column = $(curEl).parents('.e-rowcell');
                    kObj._selectedCards = [];
                    kObj._selectedCards = curEl.addClass('e-cardselection');
                    kObj._currentRowCellIndex = kObj._previousRowCellIndex = [];
                    kObj._currentRowCellIndex.push([row.index(), [column.index()], [column.find('.e-kanbancard').index(column.find("#" + el[0].id))]]);
                    kObj._currentRowCellIndex = kObj._previousRowCellIndex;
                    kObj.selectedRowCellIndexes = [];
                    kObj.selectedRowCellIndexes.push({ rowIndex: kObj._currentRowCellIndex[0][0], cellIndex: kObj._currentRowCellIndex[0][1][0], cardIndex: kObj._currentRowCellIndex[0][2][0] });
                }
                else {
                    kObj._selectedCards = [];
                    kObj._selectedCardData = [];
                    kObj.selectedRowCellIndexes = [];
                    kObj._currentRowCellIndex = kObj._previousRowCellIndex = [];
                }
            }
        }
        else {
            for (var i = 0; i < kObj._selectedCards.length; i++) {
                var el, curEl;
                if ($(kObj._selectedCards[i]).length > 1) {
                    for (var l = 0; l < kObj._selectedCards[i].length; l++) {
                        var rowCellIndex;
                        el = $(kObj._selectedCards[i][l]);
                        curEl = kObj.element.find("#" + el[0].id);
                        row = $(curEl).parents('.e-columnrow');
                        column = $(curEl).parents('.e-rowcell');
                        if (curEl.hasClass('e-kanbancard')) {
                            cardsSelected = true;
                            kObj._selectedCards[i].splice(l, 0, curEl[0]);
                            curEl.addClass('e-cardselection');
                            kObj._selectedCards[i].splice(l + 1, 1);
                            if (i == 0 && l == 0) {
                                kObj._currentRowCellIndex = kObj._previousRowCellIndex = [];
                                kObj._currentRowCellIndex.push([row.index(), [column.index()], [column.find('.e-kanbancard').index(column.find("#" + el[0].id))]]);
                                kObj._currentRowCellIndex = kObj._previousRowCellIndex;
                                kObj.selectedRowCellIndexes = [];
                            }
                            rowCellIndex = [row.index(), [column.index()], [column.find('.e-kanbancard').index(column.find("#" + el[0].id))]];
                            this._pushIntoSelectedArray([rowCellIndex]);
                        }
                        else {
                            cardsSelected = false;
                            kObj._selectedCards[i].splice(l, 1);
                            var index = kObj._selectedCardData.indexOf(kObj.KanbanCommon._getKanbanCardData(kObj._selectedCardData, el[0].id)[0]);
                            kObj._selectedCardData.splice(index, 1);
                            --l;
                        }
                    }
                }
                else {
                    var rowCellIndex;
                    el = $(kObj._selectedCards[i]);
                    curEl = kObj.element.find("#" + el[0].id);
                    row = $(curEl).parents('.e-columnrow');
                    column = $(curEl).parents('.e-rowcell');
                    if (curEl.hasClass('e-kanbancard')) {
                        cardsSelected = true;
                        curEl.addClass('e-cardselection');
                        kObj._selectedCards[i] = curEl[0];
                        if (i == 0) {
                            kObj._currentRowCellIndex = kObj._previousRowCellIndex = [];
                            kObj._currentRowCellIndex.push([row.index(), [column.index()], [column.find('.e-kanbancard').index(column.find("#" + el[0].id))]]);
                            kObj._currentRowCellIndex = kObj._previousRowCellIndex;
                            kObj.selectedRowCellIndexes = [];
                        }
                        rowCellIndex = [row.index(), [column.index()], [column.find('.e-kanbancard').index(column.find("#" + el[0].id))]];
                        this._pushIntoSelectedArray([rowCellIndex]);
                    }
                    else {
                        cardsSelected = false;
                        kObj._selectedCards.splice(i, 1);
                        var index = kObj._selectedCardData.indexOf(kObj.KanbanCommon._getKanbanCardData(kObj._selectedCardData, el[0].id)[0]);
                        kObj._selectedCardData.splice(index, 1);
                        --i;
                    }
                }
            }
            if (!cardsSelected && kObj._selectedCards.length <= 0)
                kObj._currentRowCellIndex = kObj._previousRowCellIndex = kObj.selectedRowCellIndexes = [];
        }
        rowIndex = kObj.element.find('.e-columnrow').index(kObj.element.find('.e-cardselection').eq(0).parents('.e-columnrow'));
        if (rowIndex >= 0) {
            kObj.selectedRowCellIndexes[0].rowIndex = kObj._currentRowCellIndex[0][0] = rowIndex;
            if (kObj._previousRowCellIndex.length > 0)
                kObj._previousRowCellIndex[0][0] = rowIndex;
        }
    };
    InternalSelection.prototype._renderKanbanTouchBar = function () {
        var kObj = this.kanbanObj;
        kObj._kTouchBar = ej.buildTag("div.e-kanbantouchbar", "", { display: "none" }, {});
        var content = ej.buildTag("div.e-content", "", {}, {}), downTail = ej.buildTag("div.e-downtail e-tail", "", {}, {});
        var touchElement = ej.buildTag("span.e-cardtouch e-icon", "", {}, {});
        content.append(touchElement);
        kObj._kTouchBar.append(content);
        kObj._kTouchBar.append(downTail);
        kObj.element.append(kObj._kTouchBar);
    };
    InternalSelection.prototype._updateSelectedCardIndexes = function (target) {
        var targetRow, targetCellIndex, kObj = this.kanbanObj;
        if (kObj.selectedRowCellIndexes.length > 0) {
            if ($(target).hasClass('e-rowcell'))
                targetCellIndex = $(target).index();
            else {
                target = kObj.element.find("#" + $(target).attr('id'));
                targetCellIndex = $(target).parents('.e-rowcell').index();
            }
            targetRow = $(target).parents('.e-columnrow');
            if ($.inArray(targetCellIndex, kObj.selectedRowCellIndexes[0].cellIndex) == -1)
                kObj.selectedRowCellIndexes[0].cellIndex.push(targetCellIndex);
            for (var k = 0; k < kObj.selectedRowCellIndexes[0].cellIndex.length; k++) {
                var selectedCards;
                selectedCards = targetRow.find('.e-rowcell').eq(kObj.selectedRowCellIndexes[0].cellIndex[k]).find('.e-cardselection');
                if (selectedCards.length > 0) {
                    kObj.selectedRowCellIndexes[0].cardIndex.splice(k, 1);
                    kObj.element.find('.e-targetclone').remove();
                    for (var m = 0; m < selectedCards.length; m++) {
                        if (m > 0)
                            kObj.selectedRowCellIndexes[0].cardIndex[k].push($(selectedCards[m]).index());
                        else
                            kObj.selectedRowCellIndexes[0].cardIndex.splice(k, 0, [$(selectedCards[0]).index()]);
                    }
                }
                else {
                    kObj.selectedRowCellIndexes[0].cellIndex.splice(k, 1);
                    kObj.selectedRowCellIndexes[0].cardIndex.splice(k, 1);
                    --k;
                }
            }
        }
    };
    return InternalSelection;
}());
window.ej.createObject("ej.KanbanFeatures.Selection", InternalSelection, window);
;
var InternalFilter = (function () {
    function InternalFilter(element) {
        this.kanbanObj = null;
        this.kanbanObj = element;
    }
    ;
    InternalFilter.prototype._filterHandler = function (filterValue, currentTarget) {
        var kObj = this.kanbanObj, args = { requestType: "filtering", currentFilterObject: [], filterCollection: kObj._filterCollection };
        args.currentFilterObject.push(filterValue);
        if (kObj.model.isResponsive) {
            var filter = [];
            kObj._kbnFilterObject = kObj._kbnFilterObject.concat(args.currentFilterObject);
            for (var i = 0; i < kObj._kbnFilterObject.length; i++) {
                var index = $.inArray(kObj._kbnFilterObject[i], filter);
                if (index < 0)
                    filter.push(kObj._kbnFilterObject[i]);
            }
            kObj._kbnFilterObject = filter;
        }
        var kbnCurrentData;
        if (!(kObj._dataSource() instanceof ej.DataManager))
            kbnCurrentData = kObj._dataSource();
        else
            kbnCurrentData = kObj._dataSource().dataSource.json;
        if (kbnCurrentData.length == 0 && kObj._currentJsonData.length > 0)
            kbnCurrentData = kObj._currentJsonData;
        kObj._initialData = kbnCurrentData;
        for (var i = 0; i < kObj.model.filterSettings.length; i++) {
            if (kObj.model.filterSettings[i].text == args.currentFilterObject[0].text) {
                var query = kObj.model.filterSettings[i].query["queries"][0].e;
                if (ej.isNullOrUndefined(args.filterCollection[0])) {
                    args.filterCollection.push(query);
                    $(currentTarget).addClass("e-select");
                }
                else if ($(currentTarget).hasClass("e-select")) {
                    $(currentTarget).removeClass("e-select");
                    var index = $.inArray(query, args.filterCollection);
                    args.filterCollection.splice(index, 1);
                }
                else {
                    $(currentTarget).addClass("e-select");
                    args.filterCollection.push(query);
                }
                break;
            }
        }
        kObj.KanbanCommon._processBindings(args);
    };
    InternalFilter.prototype.filterCards = function (query) {
        var args = { requestType: "filtering", filterCollection: this.kanbanObj._filterCollection };
        var query = query.queries[0].e;
        args.filterCollection.push(query);
        this.kanbanObj.KanbanCommon._processBindings(args);
    };
    InternalFilter.prototype.clearFilter = function () {
        var kObj = this.kanbanObj;
        if (kObj._filterCollection.length != 0) {
            var args = { requestType: "filtering" };
            kObj._filterCollection = [];
            kObj.element.find(".e-kanbantoolbar .e-tooltxt").removeClass("e-select");
            kObj.KanbanCommon._processBindings(args);
        }
    };
    InternalFilter.prototype._filterLimitCard = function (args) {
        var kObj = this.kanbanObj;
        for (var i = 0; i < kObj.model.columns.length; i++) {
            var column = kObj.model.columns[i];
            var card = kObj.getHeaderContent().find("span.e-totalcount");
            if (kObj.model.enableTotalCount) {
                card = $(card[i]);
                var index = $(card).text().indexOf(kObj.localizedLabels.FilterOfText);
                if (!ej.isNullOrUndefined(args) && (args.requestType == "drop" || args.requestType == "beginedit" || args.requestType == "save" || args.requestType == "cancel" || args.requestType == "refresh" || args.requestType == "add" || (args.requestType == "filtering" ? (args.filterCollection.length > 0 ? true : kObj.model.searchSettings.key == "" ? false : true) : args.requestType == "search" ? (kObj.model.searchSettings.key != "" ? true : (kObj.model.filterSettings.length > 0 ? kObj.element.find(".e-kanbantoolbar .e-tooltxt").hasClass("e-select") : false)) : false))) {
                    if (index != -1) {
                        var cardCount = new ej.DataManager(kObj.model.dataSource).executeLocal(new ej.Query().where(kObj.model.keyField, ej.FilterOperators.equal, column.key)).length;
                        $(card).text(cardCount);
                    }
                    var columnKey = kObj.KanbanCommon._multikeySeparation(column.key);
                    $(card).text($($(kObj.element.find(".e-columnrow")).find('td[ej-mappingkey="' + columnKey + '"] > div.e-kanbancard')).length + " " + kObj.localizedLabels.FilterOfText + " " + $(card).text());
                }
                else if (!ej.isNullOrUndefined(column.constraints))
                    kObj.KanbanCommon._renderLimit();
                else
                    $(card).text($(card).text().slice(index + 3));
            }
        }
    };
    InternalFilter.prototype.searchCards = function (searchString) {
        var args, kObj = this.kanbanObj, searchBar = $("#" + kObj._id + "_toolbarItems_search");
        if (searchBar.find("input").val() != searchString)
            searchBar.find("input").val(searchString);
        args = { requestType: "search", keyValue: searchString };
        if (searchString != "" || kObj.model.searchSettings.key != "") {
            kObj.model.searchSettings.key = searchString;
            if (kObj.model.searchSettings.key.length > 0) {
                var kbnCurrentData;
                if (!(kObj._dataSource() instanceof ej.DataManager))
                    kbnCurrentData = kObj._dataSource();
                else
                    kbnCurrentData = kObj._dataSource().dataSource.json;
                if (kbnCurrentData.length == 0 && kObj._currentJsonData.length > 0)
                    kbnCurrentData = kObj._currentJsonData;
                kObj._initialData = kbnCurrentData;
            }
            kObj.KanbanCommon._processBindings(args);
        }
    };
    InternalFilter.prototype.clearSearch = function () {
        var kObj = this.kanbanObj;
        kObj.element.find(".e-kanbantoolbar #" + kObj._id + "_toolbarItems_search").val("");
        this.searchCards("");
        $.extend(kObj.model.searchSettings, kObj.defaults.searchSettings);
    };
    InternalFilter.prototype._onToolbarKeypress = function (sender) {
        var kObj = this["KanbanFilter"]["kanbanObj"];
        var $kanbanEle = kObj.element, kanbanObj = $kanbanEle.data("ejKanban");
        if (kObj.model.isResponsive && $kanbanEle.hasClass('e-responsive')) {
            $(kObj.itemsContainer).parent().children().not('.e-searchbar').hide();
            kObj.KanbanAdaptive._kbnTimeoutSearch($kanbanEle, sender);
        }
    };
    return InternalFilter;
}());
window.ej.createObject("ej.KanbanFeatures.Filter", InternalFilter, window);
;
var InternalDragAndDrop = (function () {
    function InternalDragAndDrop(element) {
        this.kanbanObj = null;
        this._dragEle = null;
        this._dropEle = null;
        this._dropTarget = null;
        this.kanbanObj = element;
    }
    ;
    InternalDragAndDrop.prototype._addDragableClass = function () {
        var kObj = this.kanbanObj;
        kObj._dropped = false;
        this._dragEle = kObj.getContent().find(".e-columnrow td.e-drag .e-kanbancard");
        this._dropEle = kObj.getContent().find(".e-columnrow .e-rowcell.e-drop");
        this._dropEle.addClass("e-droppable");
        this._dragEle.addClass("e-draggable e-droppable");
        this._enableDragDrop();
        kObj._on(kObj.element, "mouseup touchstart pointerdown MSPointerDown", "", $.proxy(kObj.element.focus(), this));
    };
    InternalDragAndDrop.prototype._enableDragDrop = function () {
        var kObj = this.kanbanObj;
        this._drag();
        $(kObj.getContent()).ejDroppable({
            accept: $(kObj.getContent()).find("div.e-kanbancard"),
            drop: function (event, ui) {
                $(ui.helper).hide();
            }
        });
    };
    InternalDragAndDrop.prototype._selectedPrevCurrentCards = function () {
        var prevCard, curCard, kObj = this.kanbanObj;
        if (kObj._previousRowCellIndex.length > 0) {
            prevCard = kObj.KanbanCommon._getCardbyIndexes(kObj._previousRowCellIndex);
            kObj._pCardId = prevCard.attr('id');
        }
        kObj._previousRowCellIndex = kObj._currentRowCellIndex;
        kObj._pCardId = kObj._cCardId;
        if (kObj._currentRowCellIndex.length > 0) {
            curCard = kObj.KanbanCommon._getCardbyIndexes(kObj._currentRowCellIndex);
            kObj._cCardId = curCard.attr('id');
        }
    };
    InternalDragAndDrop.prototype._getPriorityIndex = function (element) {
        var dropData = null, index, kObj = this.kanbanObj;
        ;
        for (var i = 0; i < kObj._priorityCollection.length; i++) {
            if (kObj._priorityCollection[i].primaryKey == element.attr('id')) {
                dropData = kObj._priorityCollection[i];
                break;
            }
        }
        if (!ej.isNullOrUndefined(dropData))
            index = parseInt(dropData["dropKey"]);
        else
            index = this._getPriorityKey(element.attr('id'));
        return index;
    };
    InternalDragAndDrop.prototype._removeFromPriorirtyCollec = function (cardId) {
        var dRemoveIndex = null, kObj = this.kanbanObj;
        for (var i = 0; i < kObj._priorityCollection.length; i++) {
            if (kObj._priorityCollection[i].primaryKey == cardId) {
                dRemoveIndex = i;
                break;
            }
        }
        if (!ej.isNullOrUndefined(dRemoveIndex))
            kObj._priorityCollection.splice(dRemoveIndex, 1);
    };
    InternalDragAndDrop.prototype._columnDataOndrop = function (target, prKey) {
        var kObj = this.kanbanObj, editingManager = new ej.DataManager(kObj._initialData), data, key, swimlane, cText, sText, queryManager = new ej.Query();
        key = kObj.model.keyField, swimlane = kObj.model.fields.swimlaneKey;
        if ($(target).hasClass('e-rowcell'))
            cText = $(target).attr('ej-mappingkey');
        else
            cText = $(target).parents('.e-rowcell').attr('ej-mappingkey');
        sText = $(target).parents('.e-columnrow').prev('.e-swimlanerow').find('.e-slkey').text();
        if (!ej.isNullOrUndefined(swimlane))
            queryManager = queryManager.where(key, ej.FilterOperators.equal, cText).where(swimlane, ej.FilterOperators.equal, sText);
        else
            queryManager = queryManager.where(key, ej.FilterOperators.equal, cText);
        data = editingManager.executeLocal(queryManager);
        data.sort(function (val1, val2) {
            return val1[prKey] - val2[prKey];
        });
        return data;
    };
    InternalDragAndDrop.prototype._dropToColumn = function (target, element) {
        var kObj = this.kanbanObj, lastDrpIndex, eleDrpIndex, trgtColData = [], pCheck = false, prKey = kObj.model.fields.priority, filter, selEle;
        var sibling = target.parent().has(element).length;
        if (!ej.isNullOrUndefined(kObj._filterToolBar))
            filter = kObj._filterToolBar.find('.e-select');
        if (target.hasClass('e-targetclone'))
            target = target.parent();
        if (target.hasClass('e-columnkey'))
            target = target.parent().parent();
        this._selectedPrevCurrentCards();
        if (prKey && ((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))) {
            trgtColData = this._columnDataOndrop(target, prKey);
            pCheck = trgtColData.length > 0;
        }
        else
            pCheck = $(target).children('.e-kanbancard').length > 1;
        selEle = this._getSelectedCards(element);
        if (kObj.model.selectionType == "multiple" && selEle.length > 0 && $(element).hasClass('e-cardselection'))
            element = selEle;
        for (var i = 0; i < element.length; i++) {
            var ele = element[i];
            for (var l = 0; l < $(ele).length; l++) {
                var card = $(ele)[l];
                if ($(card).is(':visible')) {
                    if (prKey && pCheck) {
                        if ((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))
                            lastDrpIndex = trgtColData[trgtColData.length - 1][prKey];
                        else
                            lastDrpIndex = this._getPriorityIndex(target.find('.e-kanbancard').last());
                        eleDrpIndex = this._getPriorityIndex($(card));
                        if (lastDrpIndex >= eleDrpIndex)
                            eleDrpIndex = ++lastDrpIndex;
                        this._removeFromPriorirtyCollec($(card).attr('id'));
                        kObj._priorityCollection.push({ primaryKey: $(card).attr('id'), dropKey: eleDrpIndex });
                        var data = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, $(card)[0].id)[0];
                        if (!ej.isNullOrUndefined(eleDrpIndex)) {
                            data[prKey] = eleDrpIndex;
                            trgtColData.push(data);
                        }
                    }
                    if ($(target).find(".e-customaddbutton").length > 0) {
                        $(card).insertBefore($(target).find(".e-customaddbutton"));
                    }
                    else {
                        if (kObj.element.hasClass('e-responsive')) {
                            var scroller = target.find('.e-cell-scrollcontent');
                            if (scroller.length > 0)
                                scroller.children().append(card);
                            else
                                $(target).append(card);
                        }
                        else
                            $(target).append(card);
                    }
                }
            }
        }
        this._updateDropAction(target, element);
        if (sibling == 0 && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey) && kObj.model.swimlaneSettings.allowDragAndDrop)
            kObj.refresh(true);
    };
    InternalDragAndDrop.prototype._updateDropAction = function (trgt, ele) {
        var trgtTd, kObj = this.kanbanObj, rowCell;
        trgtTd = $(trgt).hasClass('e-rowcell') ? trgt : $(trgt).closest("td.e-rowcell");
        kObj._selectedCardData = [];
        for (var c = 0; c < ele.length; c++) {
            var cardId, card;
            if (ej.isNullOrUndefined(ele[c].length)) {
                if ($(ele[c]).is(':visible') || ($(trgt).hasClass("e-hide") && kObj.model.contextMenuSettings.enable)) {
                    cardId = $(ele[c]).attr('id');
                    this._updateDropData(trgt, ele[c], cardId);
                    card = kObj.element.find("#" + cardId);
                    rowCell = card.parents('.e-rowcell');
                    if (card.parents('.e-rowcell').hasClass('e-shrink'))
                        card.addClass('e-hide');
                    var count = parseInt(rowCell.find(".e-shrinkcount").html());
                    rowCell.find(".e-shrinkcount").html(++count);
                }
            }
            else {
                for (var k = 0; k < ele[c].length; k++) {
                    if ($(ele[c][k]).is(':visible') || ($(trgt).hasClass("e-hide") && kObj.model.contextMenuSettings.enable)) {
                        cardId = ele[c][k].id;
                        this._updateDropData(trgt, ele[c][k], cardId);
                        card = kObj.element.find("#" + cardId);
                        rowCell = card.parents('.e-rowcell');
                        if (card.parents('.e-rowcell').hasClass('e-shrink'))
                            card.addClass('e-hide');
                        var count = parseInt(rowCell.find(".e-shrinkcount").html());
                        rowCell.find(".e-shrinkcount").html(++count);
                    }
                }
            }
        }
        if (kObj.model.fields.priority && kObj._priorityCollection.length > 0) {
            while (kObj._priorityCollection.length > 0) {
                var key = kObj._priorityCollection[0].primaryKey, card = kObj.element.find("#" + key);
                this._updateDropData(trgt, card, key);
            }
        }
        var args, prKeyValue = kObj._bulkUpdateData[0][kObj.model.fields.primaryKey];
        if (kObj._bulkUpdateData.length > 1)
            prKeyValue = "bulk";
        args = { data: kObj._bulkUpdateData, requestType: "drop", primaryKeyValue: prKeyValue };
        kObj._saveArgs = args;
        kObj.updateCard(prKeyValue, kObj._bulkUpdateData);
        if (kObj.model.allowSelection && !ej.isNullOrUndefined(ele[0].length) && ele[0].length > 1 || ele.length > 1 || (ele.length == 1 && $(ele).hasClass('e-cardselection'))) {
            kObj._previousRowCellIndex = (!ej.isNullOrUndefined(kObj._pCardId)) ? this._updateRowCellIndexes(kObj._pCardId, kObj._previousRowCellIndex) : [];
            kObj._currentRowCellIndex = (!ej.isNullOrUndefined(kObj._cCardId)) ? this._updateRowCellIndexes(kObj._cCardId, kObj._currentRowCellIndex) : [];
            kObj.KanbanSelection._selectionOnRerender();
            if (ej.isNullOrUndefined(kObj._pCardId))
                kObj._previousRowCellIndex = kObj._currentRowCellIndex;
            if (kObj.model.selectionType == "single")
                kObj.selectedRowCellIndexes = kObj._currentRowCellIndex;
            else
                kObj.KanbanSelection._updateSelectedCardIndexes(trgt);
        }
        kObj._priorityCollection = [];
    };
    InternalDragAndDrop.prototype._getPriorityKey = function (key) {
        var kObj = this.kanbanObj;
        var kCard = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, key);
        return kCard[0][kObj.model.fields.priority];
    };
    InternalDragAndDrop.prototype._dropAsSibling = function (target, element, pre) {
        var kObj = this.kanbanObj, targetKey = 0, prevKey = 0, nextKey = 0, nextAll, prevAll, dropIndex, cards, initTarget, prevCard, nextCard, trgtColData = [], prCardId, prKey = kObj.model.fields.priority, filter, primeKey, selEle;
        var sibling = target.parent().has(element).length;
        if (!ej.isNullOrUndefined(kObj._filterToolBar))
            filter = kObj._filterToolBar.find('.e-select');
        primeKey = kObj.model.fields.primaryKey;
        this._selectedPrevCurrentCards();
        if (prKey && ((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0)))
            trgtColData = this._columnDataOndrop(target, prKey);
        if ($(target).hasClass("e-targetclone")) {
            if (target.next().length == 0)
                $(target).addClass("e-targetappend");
            prevCard = $(target).prevAll('.e-kanbancard')[0];
            nextCard = $(target).nextAll('.e-kanbancard')[0];
            if ($(target).hasClass("e-targetappend")) {
                pre = true;
                target = prevCard;
                if (ej.isNullOrUndefined(target))
                    target = nextCard;
            }
            else {
                pre = false;
                target = nextCard;
                if (ej.isNullOrUndefined(target))
                    target = prevCard;
            }
        }
        initTarget = target;
        selEle = this._getSelectedCards(element);
        if (kObj.model.selectionType == "multiple" && selEle.length > 0 && $(element).hasClass('e-cardselection'))
            element = selEle;
        for (var i = 0; i < element.length; i++) {
            var ele = element[i];
            for (var l = 0; l < $(ele).length; l++) {
                var card = $(ele)[l];
                if ($(card).is(':visible')) {
                    if (pre) {
                        if (l > 0 && element[i][l - 1] != initTarget)
                            target = element[i][l - 1];
                        else if (l == 0 && i > 0 && element[i - 1] != initTarget)
                            target = element[i - 1];
                    }
                    if (card != initTarget) {
                        pre ? $(card).insertAfter(target) : $(card).insertBefore(target);
                        if (prKey && ((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))) {
                            var data, index, curIndex, addData;
                            data = kObj.KanbanCommon._getKanbanCardData(trgtColData, $(target).attr('id'));
                            index = trgtColData.indexOf(data[0]);
                            addData = kObj.KanbanCommon._getKanbanCardData(kObj.KanbanCommon._currentJsonData, $(card)[0].id);
                            if (data[0][kObj.model.keyField] == addData[0][kObj.model.keyField])
                                trgtColData.splice(trgtColData.indexOf(addData[0]), 1);
                            if (pre)
                                trgtColData.splice(index + 1, 0, addData[0]);
                            else
                                trgtColData.splice(index, 0, addData[0]);
                            prCardId = $(card)[0].id;
                        }
                    }
                    if (prKey) {
                        if (((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))) {
                            var tData = kObj.KanbanCommon._getKanbanCardData(trgtColData, $(target).attr('id'));
                            targetKey = tData[0][prKey];
                            tData = kObj.KanbanCommon._getKanbanCardData(trgtColData, prCardId);
                            cards = [];
                            for (var k = trgtColData.indexOf(tData[0]); k < trgtColData.length; k++) {
                                cards.push(trgtColData[k]);
                            }
                        }
                        else {
                            targetKey = this._getPriorityIndex($(target));
                            var nextCards = $(card).nextAll('.e-kanbancard');
                            cards = ej.isNullOrUndefined(nextCards["addBack"]) ? nextCards["andSelf"]() : nextCards["addBack"]();
                        }
                        for (var k = 0; k < cards.length; k++) {
                            var thisEle = cards[k];
                            if (((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))) {
                                var tData = null, index;
                                dropIndex = thisEle[prKey];
                                if (!pre && ($(card)[0].id == thisEle[primeKey]) && targetKey < dropIndex)
                                    dropIndex = targetKey;
                                tData = kObj.KanbanCommon._getKanbanCardData(trgtColData, thisEle[primeKey]);
                                index = curIndex = trgtColData.indexOf(tData[0]);
                                if (index - 1 >= 0)
                                    prevKey = trgtColData[index - 1][prKey];
                                tData = kObj.KanbanCommon._getKanbanCardData(trgtColData, thisEle[primeKey]);
                                index = curIndex = trgtColData.indexOf(tData[0]);
                                if (index + 1 < trgtColData.length) {
                                    nextKey = trgtColData[index + 1][prKey];
                                    nextAll = trgtColData[index + 1];
                                }
                                else
                                    nextAll = [];
                            }
                            else {
                                dropIndex = this._getPriorityKey($(thisEle).attr('id'));
                                if (!pre && ($(card)[0] == thisEle) && targetKey < dropIndex)
                                    dropIndex = targetKey;
                                prevAll = $(thisEle).prevAll('.e-kanbancard');
                                if (prevAll.length > 0)
                                    prevKey = this._getPriorityIndex(prevAll.eq(0));
                                nextAll = $(thisEle).nextAll('.e-kanbancard');
                                if (nextAll.length > 0)
                                    nextKey = this._getPriorityIndex(nextAll.eq(0));
                            }
                            if (!isNaN(prevKey) && prevKey < dropIndex && (dropIndex < nextKey || nextAll.length == 0))
                                break;
                            var c_Id;
                            if (((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))) {
                                if (!(!pre && $(card)[0].id == thisEle[primeKey]))
                                    dropIndex = ++targetKey;
                                else if (!(!pre && $(card)[0].id == thisEle[primeKey] && targetKey < dropIndex))
                                    dropIndex = targetKey;
                                trgtColData[curIndex][prKey] = dropIndex;
                                c_Id = thisEle[primeKey];
                            }
                            else {
                                if (!(!pre && $(card)[0] == thisEle))
                                    dropIndex = ++targetKey;
                                else if (!(!pre && $(card)[0] == thisEle && targetKey < dropIndex))
                                    dropIndex = targetKey;
                                c_Id = $(thisEle).attr('id');
                            }
                            this._removeFromPriorirtyCollec(c_Id);
                            kObj._priorityCollection.push({ primaryKey: c_Id, dropKey: dropIndex });
                            targetKey = dropIndex;
                        }
                    }
                }
            }
        }
        this._updateDropAction(target, element);
        this._dropTarget = null;
        if (sibling == 0 && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey) && kObj.model.swimlaneSettings.allowDragAndDrop)
            kObj.refresh(true);
    };
    InternalDragAndDrop.prototype._updateDropData = function (target, element, cardId) {
        var kObj = this.kanbanObj;
        if (!ej.isNullOrUndefined(kObj.model.fields.primaryKey)) {
            var targetTd, prKey, primeKey, tempCard = [], columnKey;
            prKey = kObj.model.fields.priority;
            primeKey = kObj.model.fields.primaryKey;
            if (ej.isNullOrUndefined(cardId))
                cardId = $(target).attr('id');
            if ($(target).hasClass('e-rowcell'))
                targetTd = $(target);
            else
                targetTd = $(target).parents(".e-rowcell");
            if (targetTd.index() < 0)
                targetTd = kObj.element.find("#" + $(target).attr('id')).parents(".e-rowcell");
            tempCard = $.extend(true, [], kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, cardId));
            var cKey = kObj.model.columns[targetTd.index()].key;
            columnKey = typeof (cKey) == "object" ? cKey : cKey.split(",");
            if (tempCard.length > 0) {
                if ($(targetTd).find(".e-targetclonemulti").length > 0)
                    tempCard[0][kObj.model.keyField] = $(targetTd).find(".e-columnkey.e-active .e-text").eq(0).text();
                else if (columnKey.length == 1)
                    tempCard[0][kObj.model.keyField] = columnKey[0];
                if (kObj.model.fields.swimlaneKey) {
                    var sKey = $(target).parents("tr.e-columnrow").prev().find("div.e-slkey").html();
                    if (!ej.isNullOrUndefined(sKey))
                        tempCard[0][kObj.model.fields.swimlaneKey] = sKey;
                    else
                        tempCard[0][kObj.model.fields.swimlaneKey] = kObj.element.find("#" + target.id).parents("tr.e-columnrow").prev().find("div.e-slkey").html();
                }
            }
            kObj._dropped = true;
            if (prKey && kObj._priorityCollection.length > 0) {
                var dropData, curData;
                for (var i = 0; i < kObj._priorityCollection.length; i++) {
                    if (kObj._priorityCollection[i].primaryKey == cardId) {
                        dropData = kObj._priorityCollection[i];
                        kObj._priorityCollection.splice(i, 1);
                        break;
                    }
                }
                if (!ej.isNullOrUndefined(dropData) && tempCard.length > 0)
                    tempCard[0][prKey] = dropData["dropKey"];
                if (!ej.isNullOrUndefined(kObj._filterToolBar) && kObj._filterToolBar.find('.e-select').length > 0 && !ej.isNullOrUndefined(dropData) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0)) {
                    for (var k = 0; k < kObj._initialData.length; k++) {
                        if (dropData["primaryKey"] == kObj._initialData[k][primeKey]) {
                            if (tempCard.length > 0)
                                kObj._initialData[k] = tempCard[0];
                            else
                                kObj._initialData[k][prKey] = dropData["dropKey"];
                            curData = kObj._initialData[k];
                            break;
                        }
                    }
                }
            }
            if (tempCard.length > 0) {
                if ($(element).hasClass('e-cardselection')) {
                    for (var k = 0; k < kObj._selectedCardData.length; k++) {
                        if (tempCard[0][primeKey] == kObj._selectedCardData[k][primeKey])
                            break;
                    }
                    kObj._selectedCardData.splice(k, 1);
                    kObj._selectedCardData.push(tempCard[0]);
                }
                kObj._bulkUpdateData.push(tempCard[0]);
            }
            else if (prKey) {
                if (kObj.KanbanCommon._getKanbanCardData(kObj._bulkUpdateData, curData[primeKey])["length"] <= 0)
                    kObj._bulkUpdateData.push(curData);
            }
        }
    };
    InternalDragAndDrop.prototype._updateRowCellIndexes = function (id, indexes) {
        var row, column, ele = [];
        if (!ej.isNullOrUndefined(id)) {
            var card = this.kanbanObj.element.find('#' + id);
            row = $(card).parents('.e-columnrow');
            column = $(card).parents('.e-rowcell');
            ele.push([row.index(), [column.index()], [column.find('.e-kanbancard').index(column.find("#" + id))]]);
        }
        else
            ele = indexes;
        return ele;
    };
    InternalDragAndDrop.prototype._dragStop = function (args, clone, pre) {
        var proxy = this, eventArgs, selectedCards, parentRow, columns, clonedElement, kObj = this.kanbanObj, dragParent, dragParentIndex;
        if (!args.element.dropped)
            clone && clone.remove();
        args.target = this._getCursorElement(args);
        var target = $(args.target).closest(".e-kanbancard").length > 0 ? $(args.target).closest(".e-kanbancard")[0] : args.target;
        if (kObj.element.hasClass('e-responsive') && !$(target).hasClass('e-targetclone')) {
            var parent = $(target).parents(".e-rowcell");
            if (!$(target).hasClass("e-kanbancard") && $(target).parents(".e-kanbancard").length == 0 && parent.length > 0 && ($(target).parents(".e-kanbancard").is(":visible"))) {
                args.target = target = parent[0];
            }
        }
        kObj.element.find('.e-kanban-draggedcard').removeClass('e-kanban-draggedcard');
        kObj.element.find('.e-targetdragclone').remove();
        proxy._dropEle.removeClass("e-dropping e-dragged e-dragpossible");
        kObj.element.find(".e-droppableremove").removeClass("e-droppableremove e-droppable");
        kObj.element.find(".e-dragpossible").removeClass("e-dragpossible e-drop");
        eventArgs = { data: args.dragData, draggedElement: args.dragEle, dropTarget: $(target), event: args.event };
        if (kObj._trigger('cardDragStop', eventArgs))
            return false;
        parentRow = $(args.element).parents('.e-columnrow');
        selectedCards = parentRow.find('.e-cardselection');
        columns = parentRow.find('.e-rowcell');
        if ($(args.target).parents(".e-targetclonemulti").length > 0)
            clonedElement = kObj.element.find('.e-targetclonemulti');
        else
            clonedElement = kObj.element.find('.e-targetclone');
        dragParent = $(args.element).parents('.e-rowcell');
        dragParentIndex = kObj.element.find('.e-rowcell.e-drag').index(dragParent);
        var isAdd = $(target).parent().children().hasClass("e-customaddbutton"), isLimit = $(target).parent().children().hasClass("e-limits"), isToggle = $(target).parent().children().hasClass("e-shrinkheader"), child = $(target).parent().children();
        var toggle = isToggle ? (isAdd ? (isLimit ? child.length == 4 : child.length == 3) : isLimit ? child.length == 3 : child.length == 2) : isAdd ? (isLimit ? child.length == 3 : child.length == 2) : (isLimit ? child.length == 2 : child.length == 1);
        if (clonedElement.is(':visible') && document.body.style.cursor == '' && target.style.cursor == '') {
            if ($(target).parents(".e-targetclonemulti").length > 0)
                proxy._dropToColumn($(target).parents(".e-rowcell"), $(args.element));
            else if ((target.nodeName == "TD" && $(target).parent().hasClass("e-columnrow") && clonedElement.is(':visible')) || clonedElement.siblings().length <= 0 || toggle) {
                var lastEle, cEleSiblings, scroll = $(target).find('.e-cell-scrollcontent');
                if (scroll.length > 0)
                    lastEle = scroll.children().eq(0).children().last();
                else
                    lastEle = $(target).children().last();
                if (lastEle.hasClass('e-targetclone'))
                    lastEle = lastEle.prev();
                cEleSiblings = clonedElement.siblings().not('.e-shrinkheader').not('.e-customaddbutton').not('.e-limits');
                if ($(target).children().length == 0 || cEleSiblings.length <= 0 || ($(lastEle).offset().top + $(lastEle).height() < $(clonedElement).offset().top)) {
                    if (lastEle.next().hasClass('e-targetclone') || cEleSiblings.length <= 0)
                        proxy._dropToColumn($(target), $(args.element));
                    else {
                        pre = false;
                        proxy._dropAsSibling($(clonedElement.next()), $(args.element), pre);
                    }
                }
            }
            else if (target.nodeName == "DIV" && ($(target).hasClass("e-kanbancard") || $(target).hasClass("e-targetclone"))) {
                if ($(target).hasClass("e-targetclone")) {
                    var parent = $(target).parents('.e-rowcell');
                    if ($(target).next().length == 0 && $(parent).find('.e-kanbancard').length == 0)
                        proxy._dropToColumn($(parent), $(args.element));
                    else
                        proxy._dropAsSibling($(target), $(args.element), pre);
                }
                else if (clonedElement.is(':visible') || selectedCards.length > 1)
                    proxy._dropAsSibling($(target), $(args.element), pre);
            }
            kObj._kbnBrowserContext = "contextmenu";
        }
        proxy._removeKanbanCursor();
        if (kObj.element.hasClass('e-responsive'))
            kObj.element.parents('body').removeClass('e-kbnwindow-modal');
        kObj._autoKbnSwipeLeft = false;
        kObj._autoKbnSwipeRight = false;
        kObj.element.find(".e-targetclone").remove();
        var tarketMultiClne = kObj.element.find(".e-targetclonemulti");
        if (tarketMultiClne.length > 0) {
            tarketMultiClne.parent().find(".e-kanbancard").show();
            $(args.target).parents(".e-rowcell").css("border-style", "");
            if (kObj.element.find(".e-responsive"))
                tarketMultiClne.parent().find(".e-limits").show();
            tarketMultiClne.remove();
        }
        if ($(args.element)[0] != target)
            columns.height(parentRow.find(target).parents('.e-rowcell').height() - kObj._tdHeightDiff);
        kObj._on(kObj.element, "mouseenter mouseleave", ".e-columnrow .e-kanbancard", kObj._cardHover);
        $(clone).length > 0 && $(clone).remove();
        kObj._eventBindings();
        if (kObj.model.isResponsive)
            kObj.kanbanWindowResize();
        var draggedEle = kObj.element.find("#" + args.element.attr('id'));
        if ($(draggedEle).hasClass('e-cardselection'))
            draggedEle = $(draggedEle).parents('.e-columnrow').find('.e-cardselection:visible');
        if (kObj.KanbanAdaptive && kObj.element.hasClass('e-responsive') && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
            kObj.KanbanAdaptive._addSwimlaneName();
        dragParent = kObj.element.find('.e-rowcell.e-drag').eq(dragParentIndex);
        eventArgs.draggedElement = draggedEle;
        eventArgs.draggedParent = dragParent;
        eventArgs.data = kObj._bulkUpdateData;
        if (kObj.model.allowScrolling)
            kObj.kanbanContent.data('ejScroller').refresh();
        if (kObj._trigger('cardDrop', eventArgs))
            return false;
        kObj._bulkUpdateData = [];
        var cells = dragParent.parent().find('.e-rowcell'), curDragParent = draggedEle.parents('.e-rowcell');
        if (kObj.model.isResponsive && kObj.element.hasClass('e-responsive') && curDragParent[0] != dragParent[0] && cells.index(curDragParent) != kObj._kbnSwipeCount) {
            if (cells.index(curDragParent) > cells.index(dragParent))
                kObj.KanbanAdaptive._kbnLeftSwipe();
            else
                kObj.KanbanAdaptive._kbnRightSwipe();
        }
        if (kObj.KanbanEdit && kObj.element.find(".e-form-container .e-disable").attr("value") == args.dragEle[0].id && kObj.element.find(".e-form-container").css("display") == "block" && (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate"))
            kObj.KanbanEdit.startEdit(args.dragEle);
        kObj.element.find('.e-togglevisible').removeClass('e-togglevisible');
        return true;
    };
    InternalDragAndDrop.prototype._getCursorElement = function (e) {
        var tgtCl = $(e.target).closest(".dragClone"), evt = e.event;
        if (tgtCl.length > 0) {
            tgtCl.hide();
            if (evt.type == "touchmove" || evt.type == "touchstart" || evt.type == "touchend")
                e.target = document.elementFromPoint(evt.originalEvent.changedTouches[0].pageX, evt.originalEvent.changedTouches[0].pageY);
            else
                e.target = document.elementFromPoint(evt.clientX, evt.clientY);
            tgtCl.show();
        }
        return e.target;
    };
    InternalDragAndDrop.prototype._getSelectedCards = function (ele) {
        var kObj = this.kanbanObj;
        for (var i = 0; i < kObj._selectedCards.length; i++) {
            if ($(kObj._selectedCards[i]).length > 1) {
                for (var l = 0; l < kObj._selectedCards[i].length; l++) {
                    if ($(kObj._selectedCards[i][l])[0] == ele[0]) {
                        kObj._selectedCards[i].splice(l, 1);
                        kObj._selectedCards[i].splice(0, 0, ele[0]);
                        kObj._selectedCards.splice(0, 0, kObj._selectedCards[i]);
                        kObj._selectedCards.splice(i + 1, 1);
                    }
                }
            }
            else {
                if ($(kObj._selectedCards[i])[0] == ele[0]) {
                    kObj._selectedCards.splice(0, 0, kObj._selectedCards[i]);
                    kObj._selectedCards.splice(i + 1, 1);
                }
            }
        }
        ele = kObj._selectedCards;
        return ele;
    };
    InternalDragAndDrop.prototype._kanbanAutoScroll = function (args) {
        var proxy = this, kObj = this.kanbanObj;
        var scroller, scrollObj, _tDragLeft = null, _tDragRight = null, _tDragUp = null, _tDragDown = null, dCard = kObj.element.find('.e-draggedcard'), rowCell = kObj.element.find('.e-columnrow .e-rowcell');
        var kWidth, kLeft, kTop, cursorX, cursorY, hHandle, hDown, hUp, vHandle, vDown, vUp;
        if (!ej.isNullOrUndefined(args["event"].clientX))
            cursorX = args["event"].clientX;
        else
            cursorX = args["event"].originalEvent.changedTouches[0].clientX;
        if (!ej.isNullOrUndefined(args["event"].clientY))
            cursorY = args["event"].clientY;
        else
            cursorY = args["event"].originalEvent.changedTouches[0].clientY;
        kWidth = kObj.element.width();
        if (kObj.element.hasClass('e-responsive') && !kObj.element.hasClass('e-swimlane-responsive'))
            scroller = $(rowCell).eq(kObj._kbnSwipeCount).find('.e-cell-scrollcontent');
        else
            scroller = kObj.getContent();
        scrollObj = scroller.data("ejScroller");
        kLeft = kObj.element.offset().left, kTop = kObj.element.offset().top;
        hUp = scroller.find('.e-hup'), hDown = scroller.find('.e-hdown');
        vUp = scroller.find('.e-vup'), vDown = scroller.find('.e-vdown');
        hHandle = scroller.find('.e-hhandle.e-box'), vHandle = scroller.find('.e-vhandle.e-box');
        if (!kObj.element.hasClass('e-responsive') && kObj.model.allowScrolling) {
            if (cursorX > kLeft + kWidth - 10) {
                kObj.element.removeClass('e-view-horizontal');
                _tDragRight = window.setInterval(function () {
                    if ((hHandle.width() + hHandle.offset().left) <= hDown.offset().left && !kObj.element.hasClass('e-view-horizontal'))
                        scrollObj.scrollX(scrollObj.scrollLeft() + 5, true);
                    else
                        _tDragRight && (_tDragRight = window.clearInterval(_tDragRight));
                    if (dCard.length <= 0)
                        _tDragRight && (_tDragRight = window.clearInterval(_tDragRight));
                }, 100);
            }
            else if (cursorX - 10 < kLeft) {
                kObj.element.removeClass('e-view-horizontal');
                if (scrollObj.scrollLeft() > 0) {
                    _tDragLeft = window.setInterval(function () {
                        if (hHandle.offset().left >= (hUp.offset().left + hUp.width()) && !kObj.element.hasClass('e-view-horizontal')) {
                            scrollObj.scrollX(scrollObj.scrollLeft() - 5, true);
                        }
                        else
                            _tDragLeft && (_tDragLeft = window.clearInterval(_tDragLeft));
                        if (dCard.length <= 0)
                            _tDragLeft && (_tDragLeft = window.clearInterval(_tDragLeft));
                    }, 100);
                }
            }
            else {
                kObj.element.addClass('e-view-horizontal');
                _tDragRight && (_tDragRight = window.clearInterval(_tDragRight));
                _tDragLeft && (_tDragLeft = window.clearInterval(_tDragLeft));
            }
        }
        if (!ej.isNullOrUndefined(scroller) && scroller.length > 0 && scroller.hasClass('e-scroller')) {
            if (cursorY > ((kTop + kObj.getHeaderContent().height()) + (scroller.height() - 60)) && vHandle.length > 0 && vDown.length > 0) {
                kObj.element.removeClass('e-view-vertical');
                _tDragDown = window.setInterval(function () {
                    if (vHandle.height() + vHandle.offset().top <= vDown.offset().top && !kObj.element.hasClass('e-view-vertical'))
                        scrollObj.scrollY(scrollObj.scrollTop() + 5, true);
                    else
                        _tDragDown && (_tDragDown = window.clearInterval(_tDragDown));
                    if (dCard.length <= 0)
                        _tDragDown && (_tDragDown = window.clearInterval(_tDragDown));
                }, 100);
            }
            else if (cursorY - 30 < kObj.element.find('.e-kanbancontent').offset().top && vHandle.length > 0 && vUp.length > 0) {
                if (scrollObj.scrollTop() > 0) {
                    kObj.element.removeClass('e-view-vertical');
                    _tDragUp = window.setInterval(function () {
                        _tDragDown && (_tDragDown = window.clearInterval(_tDragDown));
                        if (vHandle.offset().top >= vUp.offset().top + vUp.height() && !kObj.element.hasClass('e-view-vertical')) {
                            scrollObj.scrollY(scrollObj.scrollTop() - 5, true);
                        }
                        else
                            _tDragUp && (_tDragUp = window.clearInterval(_tDragUp));
                        if (dCard.length <= 0)
                            _tDragUp && (_tDragDown = window.clearInterval(_tDragUp));
                    }, 100);
                }
            }
            else {
                kObj.element.addClass('e-view-vertical');
                _tDragDown && (_tDragDown = window.clearInterval(_tDragDown));
                _tDragUp && (_tDragUp = window.clearInterval(_tDragUp));
            }
        }
    };
    InternalDragAndDrop.prototype._changeKanbanCursor = function (target, clonedElement, args) {
        var tParent = $(target).parents('.e-kanbancard'), isCard = $(target).hasClass('e-kanbancard'), clonedCard;
        if (tParent.length > 0 || isCard) {
            var trgt = isCard ? $(target) : tParent;
            trgt[0].style.cursor = 'not-allowed';
        }
        else if ($(target).hasClass('e-shrinkheader') || $(target).parents('.e-shrinkheader').length > 0 || $(target).hasClass('e-slexpandcollapse') || $(target).parents('.e-slexpandcollapse').length > 0) {
            var trgt = $(target);
            if ($(target).parents('.e-shrinkheader').length > 0)
                trgt = $(target).parents('.e-shrinkheader');
            else if ($(target).parents('.e-slexpandcollapse').length > 0)
                trgt = $(target).parents('.e-slexpandcollapse');
            trgt[0].style.cursor = 'not-allowed';
        }
        else if ($(target).hasClass('e-shrink'))
            $(target)[0].style.cursor = 'not-allowed';
        else if ($(target).parents('.e-columnrow').has(args.element).length == 0 || $(target).parents('.e-swimlanerow').length > 0 || $(target).hasClass('e-columnkey e-disable') || $(target).parents(".e-columnkey.e-disable").length > 0)
            document.body.style.cursor = 'not-allowed';
        else if ($(target).hasClass('e-rowcell'))
            $(target)[0].style.cursor = 'not-allowed';
        clonedCard = $(clonedElement).find('.e-kanbancard');
        if (clonedCard.length > 0)
            clonedCard[0].style.cursor = 'not-allowed';
    };
    InternalDragAndDrop.prototype._removeKanbanCursor = function () {
        document.body.style.cursor = '';
        this.kanbanObj.element.find('.e-kanbancard,.e-shrink,.e-shrinkheader,.e-slexpandcollapse,.e-rowcell').css('cursor', '');
    };
    InternalDragAndDrop.prototype._multicloneremove = function (dropTd) {
        if (dropTd.hasClass("e-rowcell")) {
            var kObj = this.kanbanObj;
            $(trgtCloneMulti).parents(".e-rowcell").css("border-style", "");
            $(trgtCloneMulti).siblings(".e-kanbancard").show();
            $(trgtCloneMulti).siblings(".e-targetdragclone").show();
            if (kObj.element.find(".e-responsive"))
                $(trgtCloneMulti).siblings(".e-limits").show();
            $(trgtCloneMulti).remove();
            trgtCloneMulti.children().remove();
        }
    };
    InternalDragAndDrop.prototype._multiKeyCardDrop = function (dropTd, keylength, trgtCloneMulti, targetKey, draggedEle) {
        var kObj = this.kanbanObj;
        $(trgtCloneMulti).height(dropTd.height());
        dropTd.css("border-style", "none");
        dropTd.children().hide();
        if (kObj.element.find(".e-responsive"))
            dropTd.find(".e-limits").hide();
        dropTd.append(trgtCloneMulti);
        targetKey = typeof (targetKey) == "object" ? targetKey : targetKey.split(",");
        var draggedData = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, draggedEle.attr("id"));
        for (var i = 0; i < keylength; i++) {
            var targetcolumn = dropTd.find(".e-targetclonemulti");
            targetcolumn.append(ej.buildTag("div.e-columnkey"));
            var trgetClmn = targetcolumn.find(".e-columnkey").eq(i).addClass(kObj.KanbanCommon._preventCardMove(draggedData[0][kObj.model.keyField], targetKey[i]) ? "" : "e-disable");
            trgetClmn.append(ej.buildTag("div.e-text").text(targetKey[i]));
            trgetClmn.css({ "height": (dropTd.height() / keylength) - (1 + (1 / keylength)) });
            trgetClmn.find(".e-text").css("top", trgetClmn.height() / 2 - trgetClmn.find(".e-text").height() / 2);
        }
    };
    InternalDragAndDrop.prototype._createCardClone = function (clonedElement, ele) {
        var kObj = this.kanbanObj, draggedEle;
        clonedElement = kObj.element.find('.e-draggedcard');
        if (clonedElement.length > 0)
            clonedElement.remove();
        if (!ej.isNullOrUndefined(ele) && $(ele).hasClass('e-draggable')) {
            clonedElement = ej.buildTag('div.e-draggedcard');
            clonedElement.addClass(kObj.model.cssClass);
            draggedEle = $(ele).clone().addClass("dragClone");
            $(clonedElement).css({ "width": ele.width() });
            clonedElement.append(draggedEle);
            $(clonedElement).find("div:first").removeClass("e-hover");
            clonedElement.appendTo(kObj.element);
        }
        return clonedElement;
    };
    InternalDragAndDrop.prototype._drag = function () {
        var proxy = this, clonedElement = null, draggedEle = null, dragContainment = null, prevTd = null, timeot = null, queryManager, pre, eventArgs, data = [], trgtClone, draggedCard, allowDrop, kObj = this.kanbanObj;
        if (kObj.element != null)
            dragContainment = kObj.getContent().find("div:first");
        $(kObj.getContent()).find(".e-rowcell.e-drag div.e-kanbancard").not(".e-js").ejDraggable({
            dragArea: dragContainment,
            clone: true,
            cursorAt: { left: -20, top: -20 },
            dragStart: function (args) {
                if (kObj.model.enableTouch && !ej.isNullOrUndefined(kObj._cardSelect) && kObj._cardSelect == 'touch')
                    return false;
                if (kObj.element.hasClass('e-responsive'))
                    kObj.element.parents('body').addClass('e-kbnwindow-modal');
                kObj._off(kObj.element, "mouseenter mouseleave", ".e-columnrow .e-kanbancard");
                draggedCard = kObj.element.find('.e-draggedcard');
                if ($(args.element).hasClass('e-cardselection'))
                    draggedEle = $(args.element).parents('.e-columnrow').find('.e-cardselection:visible');
                else
                    draggedEle = $(args.element);
                if (draggedEle.length > 1) {
                    var multiCloneDiv = ej.buildTag('div.e-dragmultiple');
                    multiCloneDiv.append(draggedEle.length + kObj.localizedLabels.Cards);
                    draggedCard.children().remove();
                    draggedCard.append(multiCloneDiv).css("width", "90px");
                }
                for (var i = 0; i < draggedEle.length; i++) {
                    var trgtDragClone = ej.buildTag('div.e-targetdragclone');
                    $(draggedEle).eq(i).after(trgtDragClone);
                    $(trgtDragClone).css({ "width": $(draggedEle).eq(i).width(), "height": $(draggedEle).eq(i).height() });
                    $(draggedEle).eq(i).addClass('e-kanban-draggedcard');
                }
                if (data.length != 0)
                    data = [];
                for (var i = 0; i < draggedEle.length; i++) {
                    if (draggedEle[i].id != "") {
                        queryManager = new ej.DataManager(kObj._currentJsonData);
                        data.push(queryManager.executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, draggedEle[i].id)));
                    }
                }
                if (proxy && !ej.isNullOrUndefined(args.target)) {
                    eventArgs = { draggedElement: draggedEle, dragTarget: args.target, data: data, event: args["event"] };
                    if (kObj._trigger("cardDragStart", eventArgs)) {
                        args.cancel = true;
                        clonedElement && clonedElement.remove();
                        return false;
                    }
                }
                else
                    return false;
                kObj._dropinside = typeof (eventArgs.allowInternalDrop) == "boolean" ? eventArgs.allowInternalDrop : false;
                return true;
            },
            drag: function (args) {
                var _tDragRight = null, _tDragLeft = null, dCard = kObj.element.find('.e-draggedcard');
                pre = false;
                kObj._cardSelect = null;
                kObj.element.find('.e-kanbantooltip').hide();
                dCard.addClass('e-left-rotatecard');
                if (!ej.isNullOrUndefined(args["event"].clientX))
                    kObj._kbnMouseX = args["event"].clientX;
                else
                    kObj._kbnMouseX = args["event"].originalEvent.changedTouches[0].clientX;
                $(".e-kanban-context").length > 0 && $(".e-kanban-context").css("visibility", "hidden");
                !ej.isNullOrUndefined(kObj._kTouchBar) && kObj._kTouchBar.hide();
                if (!kObj._autoKbnSwipeRight && kObj.element.hasClass('e-responsive')) {
                    if ((kObj.element.offset().left + kObj.element.width()) - 50 < kObj._kbnMouseX) {
                        _tDragRight = window.setInterval(function () {
                            if (dCard.is(':hidden'))
                                _tDragRight && (_tDragRight = window.clearInterval(_tDragRight));
                            else {
                                if (kObj.element.offset().left + kObj.element.width() < kObj._kbnMouseX)
                                    _tDragRight = window.clearInterval(_tDragRight);
                                else if (kObj.element.offset().left + kObj.element.width() - 50 < kObj._kbnMouseX)
                                    kObj.KanbanAdaptive._kbnLeftSwipe();
                                else
                                    _tDragRight && (_tDragRight = window.clearInterval(_tDragRight));
                            }
                        }, 1500);
                        kObj._autoKbnSwipeRight = true;
                        kObj._autoKbnSwipeLeft = false;
                    }
                }
                if (!kObj._autoKbnSwipeLeft && kObj.element.hasClass('e-responsive')) {
                    if (kObj.element.offset().left + 20 > kObj._kbnMouseX) {
                        _tDragLeft = window.setInterval(function () {
                            if (dCard.is(':hidden'))
                                _tDragLeft && (_tDragLeft = window.clearInterval(_tDragLeft));
                            else {
                                if (kObj.element.offset().left + 20 > kObj._kbnMouseX)
                                    kObj.KanbanAdaptive._kbnRightSwipe();
                                else
                                    _tDragLeft && (_tDragLeft = window.clearInterval(_tDragLeft));
                            }
                        }, 1500);
                        kObj._autoKbnSwipeLeft = true;
                        kObj._autoKbnSwipeRight = false;
                    }
                }
                if (kObj.model.allowScrolling || kObj.model.isResponsive)
                    proxy._kanbanAutoScroll(args);
                if ($(args.target).closest(".dragClone").length > 0) {
                    args.target = prevTd;
                    clearTimeout(timeot);
                    timeot = setTimeout(function () {
                        args.target = proxy._getCursorElement(args);
                    }, 10);
                }
                if (!$(args.target).hasClass("e-targetclone") && !$(args.target).hasClass("e-rowcell")) {
                    $(trgtClone).remove();
                }
                var target = $(args.target).closest(".e-kanbancard").length > 0 ? $(args.target).closest(".e-kanbancard")[0] : args.target, dropTd, dragTd, selectedCards;
                var isSwimDragAndDrop = !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey) && kObj.model.swimlaneSettings.allowDragAndDrop;
                dragTd = $(args.element).closest("td.e-rowcell").addClass("e-dragged");
                var dragTdSiblen = dragTd.siblings().length;
                if (dragTd.parent().find(".e-dragpossible").length == 0 && dragTdSiblen > 0) {
                    var cardData = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, $(args.element).attr('id'))[0];
                    for (var i = 0; i < dragTdSiblen; i++)
                        if (kObj.KanbanCommon._preventCardMove(cardData[kObj.model.keyField], kObj.model.columns[dragTd.parent().children().index(dragTd.siblings()[i])].key)) {
                            dragTd.siblings().eq(i).addClass("e-dragpossible");
                            if (isSwimDragAndDrop) {
                                var kbnColumn = kObj.element.find(".e-columnrow");
                                for (var j = 0; j < kbnColumn.length; j++) {
                                    var kbnrowcell = kbnColumn.eq(j).find(".e-rowcell");
                                    var kbnColumncell = dragTd.parent().children();
                                    kbnrowcell.eq(kbnColumncell.index(dragTd.siblings().eq(i))).addClass("e-dragpossible");
                                    kbnrowcell.eq(kbnColumncell.index(dragTd)).addClass("e-dragpossible");
                                }
                            }
                        }
                }
                dragTd.siblings(".e-drop.e-dragpossible").addClass("e-dropping");
                if (!kObj._dropinside)
                    dragTd.addClass("e-dragpossible e-drop");
                else
                    dragTd.addClass("e-dragpossible e-drop e-droppable e-droppableremove");
                eventArgs = { draggedElement: draggedEle, data: data, dragTarget: target, event: args["event"] };
                prevTd = dropTd = $(target).closest("td.e-rowcell");
                selectedCards = dropTd.parents('.e-columnrow').find('.e-cardselection');
                if (dropTd && dropTd.hasClass("e-droppable") && (isSwimDragAndDrop ? true : $(dropTd).parent().has(args.element[0]).length > 0) && (target != args.element[0] || selectedCards.length > 1)) {
                    document.body.style.cursor = '';
                    if ($(trgtClone).parents('.e-rowcell').index() != dropTd.index())
                        $(trgtClone).remove();
                    dropTd.find(".e-kanbancard").removeClass("e-hover");
                    var lastEle, prevHgt;
                    if (kObj.element.hasClass('e-responsive')) {
                        var parent = $(target).parents(".e-rowcell");
                        if (!$(target).hasClass("e-kanbancard") && $(target).parents(".e-kanbancard").length == 0 && parent.length > 0) {
                            target = parent;
                            dropTd = $(target).find('.e-cell-scrollcontent').children().eq(0);
                        }
                    }
                    lastEle = dropTd.children().last();
                    if (lastEle.hasClass('e-shrinkheader'))
                        lastEle = lastEle.prev();
                    if ($(target).hasClass("e-columnkey") || $(target).parents(".e-columnkey").length > 0 || $(target).find(".e-columnkey").length > 0) {
                        var parentRow = $(target).hasClass("e-rowcell") ? $(target) : $(target).parents(".e-rowcell");
                        var curtrgt = args.target;
                        if (($(curtrgt).hasClass("e-columnkey") && !$(curtrgt).hasClass("e-disable")) || ($(curtrgt).parents(".e-columnkey").length > 0 && !$(curtrgt).parents(".e-disable").length > 0)) {
                            proxy._removeKanbanCursor();
                            parentRow.find(".e-columnkey.e-active").removeClass("e-active");
                            parentRow.find(".e-columnkey.e-multiclonestyle").removeClass("e-multiclonestyle");
                            $(curtrgt).closest(".e-columnkey").not(".e-disable").addClass("e-active");
                            $(dropTd).find(".e-active").prev().addClass("e-multiclonestyle");
                        }
                        else {
                            proxy._changeKanbanCursor(target, clonedElement, args);
                        }
                    }
                    if (($(target).hasClass("e-rowcell") || $(target).hasClass("e-kanbancard") || $(target).hasClass("e-targetdragclone") || ($(target).hasClass("e-swimlane-name") || ($(target).hasClass("e-limits"))) || $(target).parents(".e-rowcell").not(".e-drop").length > 0) && $(trgtCloneMulti).is(":visible") && ($(target).index() != trgtCloneMulti.parents(".e-rowcell").index())) {
                        $(trgtCloneMulti).siblings(".e-kanbancard").not(".e-kanban-draggedcard").show();
                        $(trgtCloneMulti).parents(".e-rowcell").css("border-style", "");
                        $(trgtCloneMulti).siblings(".e-targetdragclone,.e-customaddbutton,.e-limits").show();
                        $(trgtCloneMulti).remove();
                        trgtCloneMulti.children().remove();
                    }
                    else if ($(target).hasClass("e-rowcell") && (args.element[0] != lastEle[0] || selectedCards.length > 1) && !$(target).hasClass("e-shrink") && !$(lastEle[0]).hasClass("e-targetclonemulti")) {
                        var dragPossible = $(target).hasClass("e-dragpossible");
                        var targetIndex = $(target).parent().children().index(target);
                        var targetKey = kObj.model.columns[targetIndex].key;
                        var keylength = (typeof (targetKey) == "object" ? targetKey : targetKey.split(",")).length;
                        if (lastEle.length == 0 || dropTd.children().length == 0 || ((lastEle.offset().top + lastEle.height() < $(clonedElement).offset().top) || keylength > 1)) {
                            if (dragPossible && (keylength == 1 || ((targetIndex == $(dragTd).parent().children().index(dragTd) && (draggedEle.length == 1 || (draggedEle.length > 1 && kObj.selectedRowCellIndexes[0].cellIndex.length == 1))) || (draggedEle.length > 1 && (!kObj.selectedRowCellIndexes[0].cellIndex.length > 1 && ($.inArray(dropTd.index(), kObj.selectedRowCellIndexes[0].cellIndex) != -1)))))) {
                                prevHgt = $(target).height();
                                var clHght = $(args.element[0]).height(), clWidth = $(target).width();
                                if (kObj.element.hasClass('e-responsive')) {
                                    var scroller = dropTd.find('.e-cell-scrollcontent');
                                    if (scroller.length > 0)
                                        scroller.children().append($(trgtClone).height(clHght).width(clWidth - 28));
                                    else
                                        dropTd.append($(trgtClone).height(clHght).width(clWidth - 28));
                                }
                                else
                                    dropTd.append($(trgtClone).height(clHght).width(clWidth - 28));
                                if (prevHgt < $(target).height()) {
                                    dropTd.height(dropTd.height());
                                    kObj._tdHeightDiff = $(target).height() - prevHgt;
                                }
                            }
                            else if (dragPossible && keylength > 1) {
                                if (!dropTd.find(".e-columnkey").length > 0)
                                    proxy._multicloneremove(dropTd);
                                proxy._multiKeyCardDrop(dropTd, keylength, trgtCloneMulti, targetKey, draggedEle);
                            }
                            else
                                proxy._changeKanbanCursor(target, clonedElement, args);
                        }
                    }
                    else if ($(target).hasClass("e-rowcell") && $(target).hasClass("e-shrink") && $(target).hasClass("e-dragpossible")) {
                        var column = new ej.DataManager(kObj.model.columns).executeLocal(new ej.Query().where('key', ej.FilterOperators.equal, $(target).attr('ej-mappingkey')));
                        kObj.toggleColumn(column[0].headerText);
                        kObj.element.find('.e-draggedcard').width(kObj.element.find('.e-targetdragclone').width());
                        trgtClone.width(kObj.element.find('.e-targetdragclone').width());
                        $(target).addClass('e-togglevisible');
                    }
                    else if ($(target).hasClass("e-shrink") && !$(target).hasClass("e-dragpossible")) {
                        proxy._changeKanbanCursor(target, clonedElement, args);
                    }
                    else if ($(target).hasClass("e-kanbancard") || $(target).hasClass("e-targetclone")) {
                        var parentTd = $(target).parents('.e-rowcell'), pageY;
                        var targetKey = kObj.model.columns[parentTd.parent().children().index(parentTd)].key;
                        var keylength = (typeof (targetKey) == "object" ? targetKey : targetKey.split(",")).length;
                        prevHgt = parentTd.height();
                        var dragPossible = $(target).parents(".e-rowcell").hasClass("e-dragpossible");
                        if (!ej.isNullOrUndefined(args["event"].pageY))
                            pageY = args["event"].pageY;
                        else
                            pageY = args["event"].originalEvent.changedTouches[0].pageY;
                        if ((($(target).offset().top + ($(target).height()) / 2) >= pageY) && dragPossible && ((draggedEle.length > 1 && (!kObj.selectedRowCellIndexes[0].cellIndex.length > 1 && ($.inArray(dropTd.index(), kObj.selectedRowCellIndexes[0].cellIndex)) != -1)) || keylength == 1 || (($(dropTd).parent().children().index(dropTd) == $(dragTd).parent().children().index(dragTd)) && dragTd.parents("tr").index() == dropTd.parents("tr").index()))) {
                            if ($(target).prev()[0] != args.element[0] || selectedCards.length > 1) {
                                if (!$(target).hasClass("e-targetclone") && ($(target).prev().length == 0 || ($(target).prev().length > 0 && !$(target).prev().hasClass("e-targetdragclone")))) {
                                    proxy._removeKanbanCursor();
                                    $(trgtClone).insertBefore($(target)).height($(args.element[0]).height()).width($(target).width()).removeClass('e-targetappend');
                                }
                            }
                            else
                                proxy._changeKanbanCursor(target, clonedElement, args);
                        }
                        else {
                            if (($(target).next()[0] != args.element[0] || selectedCards.length > 1) && dragPossible && ((draggedEle.length > 1 && (!kObj.selectedRowCellIndexes[0].cellIndex.length > 1 && ($.inArray(dropTd.index(), kObj.selectedRowCellIndexes[0].cellIndex)) != -1)) || keylength == 1 || (($(dropTd).parent().children().index(dropTd) == $(dragTd).parent().children().index(dragTd)) && (dragTd.parents("tr").index() == dropTd.parents("tr").index() || isSwimDragAndDrop)))) {
                                prevHgt = $(target).parents('.e-rowcell').height();
                                if (!$(target).hasClass("e-targetclone") && ($(target).next().length == 0 || ($(target).next().length > 0 && !$(target).next().hasClass("e-targetdragclone")))) {
                                    pre = true;
                                    proxy._removeKanbanCursor();
                                    $(trgtClone).insertAfter($(target)).height($(args.element[0]).height()).width($(target).width()).addClass('e-targetappend');
                                }
                            }
                            else if (dragPossible && keylength > 1 && !parentTd.find(".e-columnkey").length > 0 && !($(dropTd).parent().children().index(dropTd) == $(dragTd).parent().children().index(dragTd))) {
                                proxy._multicloneremove(dropTd);
                                proxy._multiKeyCardDrop(parentTd, keylength, trgtCloneMulti, targetKey, draggedEle);
                            }
                            else
                                proxy._changeKanbanCursor(target, clonedElement, args);
                        }
                        if (prevHgt < parentTd.height()) {
                            parentTd.height(parentTd.height());
                            kObj._tdHeightDiff = parentTd.height() - prevHgt;
                        }
                    }
                    if ($(trgtClone).parent().hasClass("e-rowcell") && dragTd.parent().has($(trgtClone).parent()).length == 0 && isSwimDragAndDrop) {
                        kObj.element.find(".e-columnrow .e-rowcell.e-drop").addClass("e-dropping");
                        dragTd.removeClass("e-dropping").addClass("e-dragged");
                    }
                    else {
                        kObj.element.find(".e-columnrow .e-rowcell").removeClass("e-dropping");
                        dragTd.addClass("e-dragged");
                        dragTd.siblings(".e-drop.e-dragpossible ").addClass("e-dropping");
                    }
                }
                else {
                    if ($(target).parents(".e-rowcell").not(".e-droppable").length > 0 || $(target).hasClass("e-swimlane-name") || $(target).hasClass("e-limits") || ($(target).hasClass("e-swimlanerow") || $(target).parents(".e-swimlanerow").length > 0)) {
                        if ($(trgtCloneMulti).is(":visible")) {
                            $(trgtCloneMulti).siblings(".e-kanbancard").not(".e-kanban-draggedcard").show();
                            $(trgtCloneMulti).parents(".e-rowcell").css("border-style", "");
                            $(trgtCloneMulti).siblings(".e-targetdragclone,.e-customaddbutton,.e-limits").show();
                            $(trgtCloneMulti).remove();
                            trgtCloneMulti.children().remove();
                        }
                    }
                    if ($(target).hasClass("e-swimlanerow") || $(target).parents(".e-swimlanerow").length > 0) {
                        if ($(trgtClone).is(':visible'))
                            $(trgtClone).remove();
                    }
                    proxy._changeKanbanCursor(target, clonedElement, args);
                }
                var tColumn = kObj.element.find('.e-togglevisible');
                if (tColumn.length > 0 && !$(target).hasClass('e-togglevisible') && $(target).parents('.e-togglevisible').length == 0) {
                    var column = new ej.DataManager(kObj.model.columns).executeLocal(new ej.Query().where('key', ej.FilterOperators.equal, tColumn.attr('ej-mappingkey')));
                    kObj.toggleColumn(column[0].headerText);
                    kObj.element.find('.e-draggedcard').width(kObj.element.find('.e-targetdragclone').width());
                    trgtClone.width(kObj.element.find('.e-targetdragclone').width());
                    tColumn.removeClass('e-togglevisible');
                }
                if (kObj._trigger("cardDrag", eventArgs))
                    return false;
                return true;
            },
            dragStop: function (args) {
                kObj._cardSelect = null;
                args["dragData"] = data, args["dragEle"] = draggedEle;
                proxy._dragStop(args, clonedElement, pre);
            },
            helper: function (event) {
                if (kObj.model.enableTouch && !ej.isNullOrUndefined(kObj._cardSelect) && kObj._cardSelect == 'touch')
                    return false;
                trgtClone = ej.buildTag('div.e-targetclone');
                trgtCloneMulti = ej.buildTag('div.e-targetclonemulti');
                $(trgtClone).css({ "width": event.element.width(), "height": event.element.height() });
                clonedElement = proxy._createCardClone(clonedElement, event.element);
                return clonedElement;
            }
        });
    };
    return InternalDragAndDrop;
}());
window.ej.createObject("ej.KanbanFeatures.DragAndDrop", InternalDragAndDrop, window);
;
var InternalEdit = (function () {
    function InternalEdit(element) {
        this.kanbanObj = null;
        this._dropDownManager = null;
        this._editForm = null;
        this.kanbanObj = element;
    }
    ;
    InternalEdit.prototype._processEditing = function () {
        var kObj = this.kanbanObj, query = this._columnToSelect(), proxy = this;
        kObj.model.query._fromTable != "" && query.from(kObj.model.query._fromTable);
        if (kObj._dataSource() instanceof ej.DataManager && query["queries"].length && !kObj._dataManager.dataSource.offline) {
            var queryPromise = kObj._dataSource().executeQuery(query);
            queryPromise.done(ej.proxy(function (e) {
                proxy._dropDownManager = new ej.DataManager(e.result);
                proxy._addDialogEditingTemplate();
            }));
        }
        else {
            proxy._addDialogEditingTemplate();
        }
    };
    InternalEdit.prototype._renderDialog = function () {
        var $dialog = ej.buildTag("div.e-dialog e-kanbandialog e-dialog-content e-shadow e-widget-content", "", { display: "none" }, { id: this.kanbanObj._id + "_dialogEdit" });
        return $dialog;
    };
    InternalEdit.prototype._columnToSelect = function () {
        var item = [], kObj = this.kanbanObj;
        for (var i = 0; i < kObj.model.editSettings.editItems.length; i++) {
            if (kObj.model.editSettings.editItems[i].editType == "dropdownedit" && ej.isNullOrUndefined(kObj.model.editSettings.editItems[i].dataSource))
                item.push(kObj.model.editSettings.editItems[i].field);
        }
        if (item.length)
            return new ej.Query().select(item);
        return new ej.Query();
    };
    InternalEdit.prototype.cancelEdit = function () {
        var kObj = this.kanbanObj;
        if (kObj.model.editSettings.allowEditing || kObj.model.editSettings.allowAdding) {
            if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate")
                $("#" + kObj._id + "_dialogEdit").ejDialog("close");
            else if (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate") {
                if (kObj.model.editSettings.formPosition == "right")
                    $(kObj.element).children().css("width", "100%");
                $("#" + kObj._id + "_externalEdit").css("display", "none");
            }
            kObj.refreshTemplate();
            var args = { requestType: "cancel" };
            kObj.KanbanCommon._processBindings(args);
        }
        kObj.element.parents('body').removeClass('e-kbnwindow-modal');
        if (kObj.element.hasClass('e-responsive'))
            kObj.kanbanWindowResize();
    };
    InternalEdit.prototype._renderExternalForm = function () {
        var kObj = this.kanbanObj;
        var $externalform = ej.buildTag("div", "", { display: "none" }, { id: kObj._id + "_externalEdit", 'class': "e-form-container" });
        var $eformHeader = ej.buildTag("div", "", "", { id: kObj._id + "_eFormHeader", 'class': "e-form-titlebar" });
        var $eformTitle = ej.buildTag("span", "", "", { 'class': "e-form-title" });
        var $eformCloseBtn = ej.buildTag("div", "", "", { id: kObj._id + "_closebutton", 'class': "e-externalform-icon" });
        var $eformCloseIcon = ej.buildTag("span", "", "", { 'class': "e-icon e-externaledit e-cancel" });
        $eformCloseBtn.append($eformCloseIcon);
        $eformHeader.append($eformTitle).append($eformCloseBtn);
        var $eformContent = ej.buildTag("div", "", "", { id: kObj._id + "_eFormContent", 'class': "e-form-content" });
        var $eform = ej.buildTag("div", "", "", { id: kObj._id + "_externalForm", 'class': "e-externalform" });
        var $contentOuterDiv = ej.buildTag("div", "", "", { 'class': "e-externalformedit" });
        $eform.append($contentOuterDiv);
        $eformContent.append($eform);
        return $externalform.append($eformHeader).append($eformContent);
        ;
    };
    InternalEdit.prototype._maxZindex = function () {
        var maxZ = 1;
        maxZ = Math.max.apply(null, $.map($('body *'), function (e, n) {
            if ($(e).css('position') == 'absolute')
                return parseInt($(e).css('z-index')) || 1;
        }));
        if (maxZ == undefined || maxZ == null)
            maxZ = 1;
        return maxZ;
    };
    InternalEdit.prototype.addCard = function (primaryKey, data) {
        var kObj = this.kanbanObj;
        if (kObj.model.editSettings.allowAdding) {
            var args, pKey = kObj.model.fields.primaryKey;
            if (primaryKey != "bulk" && $.type(kObj._currentJsonData[0][pKey]) == "number")
                primaryKey = parseInt(primaryKey);
            args = { data: data, requestType: "save", action: "add", primaryKeyValue: primaryKey };
            kObj._cAddedRecord = data;
            kObj._saveArgs = args;
            if (primaryKey && data)
                kObj.updateCard(primaryKey, data);
            else {
                var editItems = kObj.model.editSettings.editItems;
                args = { requestType: "add" }, kObj._currentData = {};
                if (kObj._isAddNewClick) {
                    if (kObj.model.fields.swimlaneKey)
                        kObj._currentData[kObj.model.fields.swimlaneKey] = $(kObj._newCard).parent().prev('.e-swimlanerow').find('.e-slkey').text();
                    if (kObj.model.keyField)
                        kObj._currentData[kObj.model.keyField] = kObj.model.columns[$(kObj._newCard).index()].key;
                }
                for (var i = 0; i < editItems.length; i++)
                    kObj._currentData[editItems[i].field] = !ej.isNullOrUndefined(editItems[i].defaultValue) ? editItems[i].defaultValue : !ej.isNullOrUndefined(kObj._currentData[editItems[i].field]) ? kObj._currentData[editItems[i].field] : "";
                kObj._currentData[pKey] = kObj._currentJsonData[kObj._currentJsonData.length - 1][pKey];
                if ($.type(kObj._currentJsonData[0][pKey]) == "string")
                    kObj._currentData[pKey] = parseInt(kObj._currentData[pKey]);
                kObj._currentData[pKey] = kObj._currentData[pKey] + 1;
                if ($.type(kObj._currentJsonData[0][pKey]) == "string")
                    kObj._currentData[pKey] = kObj._currentData[pKey].toString();
                args.data = kObj._currentData;
                kObj.element.find('.e-kanbandialog').removeAttr('data-id');
                kObj.KanbanCommon._processBindings(args);
            }
        }
    };
    InternalEdit.prototype.deleteCard = function (primaryKey) {
        var args, kObj = this.kanbanObj, cardDiv, currentData, deleteManager, query, promise, pKey = kObj.model.fields.primaryKey, kObj = this.kanbanObj;
        cardDiv = kObj.element.find("#" + primaryKey);
        deleteManager = new ej.DataManager(kObj._currentJsonData);
        query = new ej.Query();
        query = query.where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, primaryKey);
        currentData = deleteManager.executeLocal(query);
        if ($.type(kObj._currentJsonData[0][pKey]) == "number")
            primaryKey = parseInt(primaryKey);
        args = { div: cardDiv, data: currentData[0], requestType: "delete", primaryKeyValue: primaryKey };
        kObj._saveArgs = args;
        if (kObj._trigger("actionBegin", args))
            return true;
        kObj._cDeleteData = currentData;
        kObj.updateCard(primaryKey, currentData[0]);
    };
    InternalEdit.prototype.startEdit = function ($div) {
        var kObj = this.kanbanObj;
        if ($.type($div) != "object")
            $div = kObj.element.find("#" + $div);
        if (kObj.model.editSettings.allowEditing && $div.hasClass('e-kanbancard')) {
            var parentDiv, args, pKey = kObj.model.fields.primaryKey, primaryKey = $div.attr('id');
            var columnIndex = $div.hasClass("e-rowcell") ? $div.index() : $div.closest(".e-rowcell").index();
            var rowIndex = kObj.getIndexByRow($div.closest("tr")), editingManager, queryManager = new ej.Query();
            parentDiv = $div.closest('.e-kanbancard');
            editingManager = new ej.DataManager(kObj._currentJsonData);
            queryManager = queryManager.where(pKey, ej.FilterOperators.equal, $div.attr('id'));
            kObj._currentData = editingManager.executeLocal(queryManager);
            if (!ej.isNullOrUndefined(kObj._cardEditClick) && kObj._cardEditClick) {
                kObj._dblArgs.data = kObj._currentData[0];
                kObj._trigger("cardDoubleClick", kObj._dblArgs);
            }
            if ($.type(kObj._currentJsonData[0][pKey]) == "number")
                primaryKey = parseInt(primaryKey);
            args = { target: $div, rowIndex: rowIndex, data: kObj._currentData[0], columnIndex: columnIndex, cardIndex: parentDiv.index(), primaryKeyValue: primaryKey };
            kObj._trigger("beginEdit", args);
            args.requestType = "beginedit";
            kObj.KanbanCommon._processBindings(args);
        }
    };
    InternalEdit.prototype._refreshEditForm = function (args) {
        var kObj = this.kanbanObj;
        var tds, inputWidth;
        if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate") {
            var $dialogWrapper = kObj.element.find("#" + kObj._id + "_dialogEdit_wrapper"), percent = 95;
            $dialogWrapper.show();
            var dialogEditForm = $("#" + kObj._id + "_dialogEdit");
            tds = dialogEditForm.find("tr").find(".e-rowcell");
        }
        else if (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate") {
            var $external = kObj.element.find("#" + kObj._id + "_externalEdit"), percent = 133;
            $external.show();
            var dialogEditForm = $("#" + kObj._id + "_externalForm");
            tds = dialogEditForm.find("div").find(".e-rowcell");
        }
        for (var i = 0; i < tds.length; i++)
            kObj._tdsOffsetWidth[i] = tds.get(i).offsetWidth;
        if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate")
            inputWidth = ej.max(kObj._tdsOffsetWidth) * (percent / 100);
        for (var count = 0; count < kObj.model.editSettings.editItems.length; count++) {
            var curItem = kObj.model.editSettings.editItems[count], curControl = dialogEditForm.find('#' + kObj._id + "_" + curItem['field']);
            if (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate") {
                inputWidth = ej.max(kObj._tdsOffsetWidth) * (percent / 100);
                $(curControl).parent().css("width", inputWidth + "px");
            }
            var params;
            var customParams;
            if (curItem['editType'] == "stringedit")
                curControl.width(inputWidth - 4);
            var isText = (curItem['editType'] == "textarea"), isExternal = (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate");
            customParams = curItem['editParams'];
            if (!ej.isNullOrUndefined(customParams) && isText) {
                if (!ej.isNullOrUndefined(customParams.width)) {
                    curControl.width(customParams.width);
                    if (isText && isExternal)
                        curControl.parent().width(customParams.width + 8);
                }
                if (!ej.isNullOrUndefined(customParams.height)) {
                    curControl.height(customParams.height);
                    if (isText && isExternal)
                        curControl.parent().height(customParams.height + 8);
                }
            }
            else if (isText && (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate"))
                curControl.width(250).height(95);
            else if (isText && (isExternal && kObj.model.editSettings.formPosition == "bottom")) {
                curControl.height(95);
                $(curControl).css({ "width": "400px" });
                $(curControl).parent().css({ "width": "500px" });
            }
            else if (isText && (isExternal && kObj.model.editSettings.formPosition == "right")) {
                curControl.css({ "width": inputWidth - 8 });
                curControl.height(150);
                $(curControl).parent().css("width", inputWidth + 8);
            }
            if (curItem['editType'] == "rteedit") {
                params = { width: "450px", height: "260px", minHeight: "240px", locale: kObj.model.locale, enableRTL: kObj.model.enableRTL };
                customParams = curItem['editParams'];
                params.toolsList = ["style", "links"];
                params.tools = {
                    style: ["bold", "italic", "underline"],
                    casing: ["upperCase", "lowerCase"],
                    links: ["createLink"]
                };
                if (!ej.isNullOrUndefined(customParams))
                    $.extend(params, customParams);
                dialogEditForm.find('#' + kObj._id + "_" + curItem['field']).ejRTE(params);
            }
            else {
                var value;
                if (curItem['editType'] == "dropdownedit") {
                    params = { width: inputWidth, enableIncrementalSearch: true, enableRTL: kObj.model.enableRTL };
                    value = curControl.val();
                    customParams = curItem['editParams'];
                    var disable = [];
                    if (((curItem.field == kObj.model.keyField) && !ej.isNullOrUndefined(kObj.model.workflows)) && args.requestType === "beginedit") {
                        for (var i = 0; i < curControl.children().length; i++) {
                            kObj.KanbanCommon._preventCardMove(value, curControl.children().eq(i).val()) ? true : disable.push(i);
                        }
                    }
                    if (disable.length > 0)
                        for (var j = disable.length - 1; j >= 0; j--)
                            $(curControl.children()).eq(disable[j]).remove();
                    if (curControl.hasClass("e-disable"))
                        params.enabled = false;
                    if (!ej.isNullOrUndefined(customParams))
                        $.extend(params, customParams);
                    kObj._kbnDdlWindowResize = true;
                    curControl.ejDropDownList(params);
                    curControl.ejDropDownList("setSelectedValue", curControl.val());
                    kObj._kbnDdlWindowResize = false;
                }
                else if (curItem['editType'] == "numericedit") {
                    params = { width: inputWidth };
                    value = curControl.val();
                    customParams = curItem['editParams'];
                    params.cssClass = kObj.model.cssClass;
                    params.showSpinButton = true;
                    params.enableRTL = kObj.model.enableRTL;
                    params.locale = kObj.model.locale;
                    if (value.length)
                        params.value = parseFloat(value);
                    if (curControl.hasClass("e-disable"))
                        params.enabled = false;
                    if (!ej.isNullOrUndefined(customParams))
                        $.extend(params, customParams);
                    curControl.ejNumericTextbox(params);
                }
                else if (curItem['editType'] == "datepicker") {
                    params = { width: inputWidth };
                    value = curControl.val();
                    customParams = curItem['editParams'];
                    params.cssClass = kObj.model.cssClass;
                    params.displayDefaultDate = true;
                    params.enableRTL = kObj.model.enableRTL;
                    params.locale = kObj.model.locale;
                    if (value.length)
                        params.value = new Date(value);
                    if (curControl.hasClass("e-disable"))
                        params.enabled = false;
                    if (!ej.isNullOrUndefined(customParams))
                        $.extend(params, customParams);
                    curControl.ejDatePicker(params);
                }
                else if (curItem['editType'] == "datetimepicker") {
                    params = { width: inputWidth, cssClass: kObj.model.cssClass, locale: kObj.model.locale, showPopupButton: false, enableRTL: kObj.model.enableRTL };
                    value = curControl.val();
                    customParams = curItem['editParams'];
                    if (value.length)
                        params.value = new Date(value);
                    if (curControl.hasClass("e-disable"))
                        params.enabled = false;
                    if (!ej.isNullOrUndefined(customParams))
                        $.extend(params, customParams);
                    curControl.ejDateTimePicker(params);
                }
            }
            if (curItem['editType'] != "textarea")
                $(curControl.outerWidth(inputWidth)).height(28);
            if (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version, 10) == 8)
                curControl.css("line-height", "26px");
        }
        if (isExternal)
            kObj._editForm = kObj.element.find(".e-externalform");
        if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate") {
            kObj._editForm = kObj.element.find(".kanbanform");
            $dialogWrapper.hide();
        }
        this._formFocus();
    };
    InternalEdit.prototype._setKanbanDdlValue = function ($editRow) {
        var $selectDdl = $editRow.find("select.e-field"), x, inputDdl = $editRow.find("input.e-field.e-dropdownlist");
        for (var i = 0; i < $selectDdl.length; i++) {
            var ddlTempl = {};
            ddlTempl[this.kanbanObj._id + "drpDownTempl"] = "{{:" + $selectDdl[i].name.replace(/[^a-z0-9\s]/gi, '') + "}}";
            $.templates(ddlTempl);
            x = $.render[this.kanbanObj._id + "drpDownTempl"](this.kanbanObj._currentData);
            $editRow.find("select").eq(i).val(x).attr("selected", "selected");
            $selectDdl.eq(i).val(x);
        }
        for (var j = 0; j < inputDdl.length; j++)
            inputDdl.eq(j).val(ej.getObject(inputDdl.eq(j).attr("name"), this.kanbanObj._currentData[0]));
    };
    InternalEdit.prototype._editAdd = function (args) {
        var dialogEditForm, kObj = this.kanbanObj, $dialog = kObj.element.find(".e-kanbandialog"), target = $(args.target), editingManager, queryManager = new ej.Query(), pKey = kObj.model.fields.primaryKey;
        var editRow = document.createElement('div'), $editRow = $(editRow), cardId;
        if (args.requestType == "add")
            $editRow.addClass("e-addedrow");
        else {
            kObj._currentData = {};
            if (target.hasClass('e-kanbancard'))
                cardId = target.attr('id');
            else if (target.parents('.e-kanbancard').length > 0)
                cardId = target.parents('.e-kanbancard').attr('id');
            if ($.type(kObj._currentJsonData[0][pKey]) == "number")
                cardId = parseInt(cardId);
            editingManager = new ej.DataManager(kObj._currentJsonData);
            queryManager = queryManager.where(pKey, ej.FilterOperators.equal, cardId);
            kObj._currentData = editingManager.executeLocal(queryManager);
            $editRow.addClass("e-editedrow");
        }
        editRow.innerHTML = $.render[kObj._id + "_dialogEditingTemplate"](kObj._currentData);
        this._setKanbanDdlValue($editRow);
        var titleLbl, title;
        if (args.requestType == "add") {
            if (!ej.isNullOrUndefined(kObj.model.fields.title) && !$.isEmptyObject(kObj._newData)) {
                titleLbl = kObj.model.fields.title;
                title = kObj.localizedLabels.EditFormTitle + kObj._newData[titleLbl];
            }
            else
                title = kObj.localizedLabels.AddFormTitle;
        }
        else {
            titleLbl = pKey;
            if (!ej.isNullOrUndefined(kObj.model.fields.title))
                titleLbl = kObj.model.fields.title;
            title = kObj.localizedLabels.EditFormTitle + kObj._currentData[0][titleLbl];
        }
        if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate") {
            dialogEditForm = $("#" + kObj._id + "_dialogEdit");
            dialogEditForm.html($(editRow));
            var model = { cssClass: kObj.model.cssClass, enableRTL: kObj.model.enableRTL, width: "auto", content: "#" + kObj._id, close: $.proxy(this.cancelEdit, this), open: $.proxy(this._onKbnDialogOpen, this), enableModal: true, enableResize: false, title: title };
            dialogEditForm.ejDialog(model);
            dialogEditForm.ejDialog("open");
            $dialog.attr('data-id', cardId);
            var $dialogWrapper = kObj.element.find("#" + kObj._id + "_dialogEdit_wrapper");
            $dialogWrapper.css("left", "0");
            var wTop;
            if (self != parent) {
                if (ej.browserInfo().name == "chrome")
                    wTop = $(window).scrollTop();
                else
                    wTop = -$(window.frameElement).offset().top;
            }
            else
                wTop = $(window).scrollTop();
            $dialogWrapper.css("top", wTop);
            $dialogWrapper.hide();
        }
        else if (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate") {
            $("#" + kObj._id + "_externalEdit").css("display", "block").css('z-index', this._maxZindex() + 1);
            $("#" + kObj._id + "_externalForm").find(".e-externalformedit").html($(editRow));
            $("#" + kObj._id + "_eFormHeader").find(".e-form-title").text(title);
            $("#" + kObj._id + "_externalForm").attr('data-id', cardId);
            this._externalFormPosition();
        }
        if ($.isFunction($["validator"])) {
            this.initValidator();
            this.setValidation();
        }
    };
    InternalEdit.prototype._onKbnDialogOpen = function () {
        var kObj = this.kanbanObj, $dialogWrapper = kObj.element.find("#" + kObj._id + "_dialogEdit_wrapper");
        $dialogWrapper.css("position", "absolute");
        var top, left;
        var element = $(kObj.element)[0], elementTop, elementLeft, elementWidth, elementHeight;
        elementTop = element.offsetTop;
        elementLeft = element.offsetLeft;
        elementWidth = $(element).find('.e-kanbancontent')[0].offsetWidth;
        elementHeight = $(element).find('.e-kanbancontent')[0].offsetHeight + $(kObj.element).find('.e-kanbanheader')[0].offsetHeight;
        if (window.pageYOffset > elementTop) {
            if ((elementTop + elementHeight) > (window.pageYOffset + window.innerHeight))
                top = Math.max(0, ((window.innerHeight - $dialogWrapper.outerHeight()) / 2));
            else
                top = Math.max(0, (((elementTop + elementHeight - window.pageYOffset) - $dialogWrapper.outerHeight()) / 2));
            top = window.pageYOffset + top;
        }
        else {
            if ((elementTop + elementHeight) > (window.pageYOffset + window.innerHeight))
                top = Math.max(0, (((window.innerHeight - (elementTop - window.pageYOffset)) - $dialogWrapper.outerHeight()) / 2));
            else
                top = Math.max(0, ((elementHeight - $dialogWrapper.outerHeight()) / 2));
            top = elementTop + top;
        }
        if (window.pageXOffset > elementLeft) {
            if ((elementLeft + elementWidth) > (window.pageXOffset + window.innerWidth))
                left = Math.max(0, ((window.innerWidth - $dialogWrapper.outerWidth()) / 2));
            else
                left = Math.max(0, ((((elementLeft + elementWidth) - window.pageXOffset) - $dialogWrapper.outerWidth()) / 2));
            left = window.pageXOffset + left;
        }
        else {
            if ((elementLeft + elementWidth) > (window.pageXOffset + window.innerWidth))
                left = Math.max(0, (((window.innerWidth - (elementLeft - window.pageXOffset)) - $dialogWrapper.outerWidth()) / 2));
            else
                left = Math.max(0, ((elementWidth - $dialogWrapper.outerWidth()) / 2));
            left = elementLeft + left;
        }
        $dialogWrapper.css("top", top + "px");
        $dialogWrapper.css("left", left + "px");
        $dialogWrapper.show();
        this._formFocus();
        if (kObj._editForm.find('.e-rte').length > 0)
            kObj.element.find("#" + kObj._id + "_dialogEdit").data("ejDialog")._resetScroller();
        if (kObj.model.isResponsive && kObj.element.hasClass('e-responsive')) {
            kObj._on($('.e-kanban-editdiv'), ($.isFunction($.fn.tap) && kObj.model.enableTouch) ? "tap" : "click", "", kObj._kbnAdaptEditClickHandler);
            kObj.KanbanAdaptive._setAdaptEditWindowHeight();
            if ($dialogWrapper.parents('.e-kanban').length > 0) {
                $dialogWrapper.appendTo("body");
            }
        }
    };
    InternalEdit.prototype._externalFormPosition = function () {
        var kObj = this.kanbanObj;
        var pos = $(kObj.element).offset();
        var width = $(kObj.element).width();
        var height = $(kObj.element).height();
        var DivElement = $("#" + kObj._id + "_externalEdit");
        switch (kObj.model.editSettings.formPosition) {
            case "right":
                $(DivElement).find('.e-close').removeClass('e-bottomleft').addClass('e-topright');
                $("#" + kObj._id + "_eFormContent").height('auto');
                if (!kObj.model.allowScrolling && !kObj.model.isResponsive) {
                    $(kObj.element).css({ "width": "100%" });
                    $(kObj.element).children().not(".e-form-container").css("width", "73%");
                    $(DivElement).css({ "left": (pos.left + $(kObj.element).children().width() + 2) + "px", "top": pos.top + "px", "position": "absolute", "width": "25%" });
                }
                else {
                    $(DivElement).css({ "left": (pos.left + (width) + 2) + "px", "top": pos.top + "px", "position": "absolute", "width": "25%" });
                    $(".e-externalrow").css("padding-right", "0px");
                }
                break;
            case "bottom":
                $(DivElement).find('.e-close').removeClass('e-topright').addClass('e-bottomleft');
                $(DivElement).css({ "left": (pos.left) + "px", "top": (pos.top + height + 1) + "px" });
                $("#" + kObj._id + "_eFormContent").width("100%");
                if (kObj.element.find(".e-scrollbar").hasClass("e-hscrollbar") || kObj.model.isResponsive)
                    $("#" + kObj._id + "_externalEdit").css({ "border": "none", "border-top": "1px solid" });
                break;
        }
    };
    InternalEdit.prototype._formFocus = function () {
        var formElement = $(this.kanbanObj._editForm).find("input,select,div.e-field,textarea.e-field"), elementFocused = false;
        for (var i = 0; i < formElement.length; i++) {
            var ele = formElement.eq(i);
            if (!ele.is(":disabled") && !elementFocused && (!ele.is(":hidden") || typeof (ele.data("ejDropDownList") || ele.data("ejNumericTextbox")) == "object") || ele.hasClass('e-rte')) {
                this._focusKbnDialogEle(ele);
                elementFocused = true;
            }
        }
    };
    InternalEdit.prototype._focusKbnDialogEle = function (ele) {
        if (ele.length) {
            if ((ele[0].tagName.toLowerCase() == "select" && !ele.hasClass("e-field e-dropdownlist")) || (ele[0].tagName.toLowerCase() == "input") || (ele[0].tagName.toLowerCase() == "textarea") && !ele.hasClass("e-numerictextbox")) {
                if (ele.hasClass('e-rte')) {
                    var rte = ele.data('ejRTE');
                    $(rte).focus();
                    rte.selectAll();
                }
                else {
                    ele.focus().select();
                    ele[0].focus();
                }
            }
            else if (ele.hasClass("e-field e-dropdownlist"))
                ele.closest(".e-ddl").focus();
            else if (ele.hasClass('e-numerictextbox'))
                ele.siblings('input:visible').first().select().focus();
            else
                ele.find('input:visible,select').first().select().focus();
        }
    };
    InternalEdit.prototype.endEdit = function () {
        var kObj = this.kanbanObj;
        if (kObj.model.editSettings.allowEditing || kObj.model.editSettings.allowAdding) {
            var pKey = kObj.model.fields.primaryKey;
            if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate")
                var $edit = $('#' + kObj._id + "_dialogEdit");
            else
                $edit = kObj.element.find('.e-externalform');
            var formElement, $formElement, editedRowWrap, cardId, obj = {};
            if (!this.editFormValidate())
                return true;
            formElement = document.getElementById(kObj._id + "EditForm");
            $formElement = $(formElement);
            editedRowWrap = $formElement.closest('div');
            if (!ej.isNullOrUndefined($edit.attr('data-id'))) {
                cardId = $edit.attr('data-id');
                if ($.type(kObj._currentJsonData[0][pKey]) == "number")
                    cardId = parseInt(cardId);
            }
            else {
                cardId = kObj._currentJsonData[kObj._currentJsonData.length - 1][pKey];
                if ($.type(kObj._currentJsonData[0][pKey]) == "string")
                    cardId = parseInt(cardId);
                cardId = cardId + 1;
                if ($.type(kObj._currentJsonData[0][pKey]) == "string")
                    cardId = cardId.toString();
                obj[pKey] = cardId;
            }
            for (var index = 0; index < formElement.length; index++) {
                if (editedRowWrap.hasClass("e-addedrow") && $(formElement[index]).hasClass("e-identity"))
                    continue;
                var columnName = formElement[index].name, $element = $(formElement[index]);
                if ((($element.hasClass("e-dropdownlist") || $element.hasClass("e-input")) && (ej.isNullOrUndefined($element.attr("id")) || $element.attr("id").indexOf("_input") != -1 || $element.attr("id").indexOf("_hidden") != -1))) {
                    if (!ej.isNullOrUndefined($formElement[1]) && ej.isNullOrUndefined(formElement[index + 1])) {
                        formElement = $formElement[1];
                        index = -1;
                    }
                    continue;
                }
                if (columnName != undefined) {
                    if (columnName == "") {
                        if (formElement[index].id.indexOf("Save") != -1 || formElement[index].id.indexOf("Cancel") != -1)
                            columnName = "";
                        else {
                            columnName = formElement[index].id.replace(kObj._id + "_", "");
                            columnName = columnName.replace("_hidden", "");
                        }
                    }
                    if (columnName != "" && obj[columnName] == null) {
                        var value = formElement[index].value;
                        if ($(formElement[index]).hasClass("e-datepicker")) {
                            value = $element.ejDatePicker("model.value");
                        }
                        else if ($(formElement[index]).hasClass("e-datetimepicker")) {
                            value = $element.ejDateTimePicker("model.value");
                        }
                        else if ($element.is(".e-numerictextbox")) {
                            value = $element.ejNumericTextbox("getValue");
                            value = value || "";
                        }
                        else if ($element.data("ejDropDownList")) {
                            value = $element.ejDropDownList("getSelectedValue");
                        }
                        var originalvalue;
                        if (formElement[index].type != "checkbox")
                            originalvalue = value;
                        else
                            originalvalue = $(formElement[index]).is(':checked');
                        obj[columnName] = originalvalue;
                    }
                    else if (columnName == pKey) {
                        obj[pKey] = formElement[index].value;
                    }
                }
            }
            kObj._editForm = $('#' + kObj._id + "EditForm");
            if (isNaN(obj[pKey]))
                obj[pKey] = cardId;
            else {
                if ($.type(kObj._currentJsonData[0][pKey]) == "number")
                    obj[pKey] = cardId = parseInt(obj[pKey]);
                else
                    obj[pKey] = cardId = obj[pKey];
            }
            var args = { data: obj, requestType: "save" };
            if (kObj._trigger("actionBegin", args))
                return true;
            if ($(kObj._editForm).hasClass('e-formdestroy'))
                kObj.refresh(true);
            else {
                if (!ej.isNullOrUndefined($edit.attr('data-id'))) {
                    args["action"] = "edit";
                    args["primaryKeyValue"] = cardId;
                    kObj._cModifiedData = obj;
                }
                else {
                    args["action"] = "add";
                    args["primaryKeyValue"] = cardId;
                    kObj._cAddedRecord = obj;
                }
            }
            args["primaryKey"] = pKey;
            kObj._saveArgs = args;
            kObj.updateCard(cardId, obj);
            if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate") {
                $edit.removeAttr('data-id');
                $("#" + kObj._id + "_dialogEdit").ejDialog("close");
            }
            else if (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate") {
                if (kObj.model.editSettings.formPosition == "right")
                    $(kObj.element).children().css("width", "100%");
                $edit.removeAttr('data-id');
                $("#" + kObj._id + "_externalEdit").css("display", "none");
            }
        }
        if (kObj.element.find('.e-kbnadapt-editdlg').length == 0)
            $(".e-kbnadapt-editdlg").appendTo(kObj.element);
        if (kObj.element.hasClass('e-responsive'))
            kObj.kanbanWindowResize();
    };
    InternalEdit.prototype.initValidator = function () {
        var kanbanObject = this.kanbanObj, elements = kanbanObject.element.find(".kanbanform");
        for (var i = 0; i < elements.length; i++) {
            elements.eq(i).validate({
                ignore: ".e-hide,:hidden",
                errorClass: 'e-field-validation-error',
                errorElement: 'div',
                wrapper: "div",
                errorPlacement: function (error, element) {
                    if (element.is(":hidden"))
                        element = element.siblings("input:visible");
                    var $td = element.closest("td"), $container = $(error).addClass("e-error"), $tail = ej.buildTag("div.e-errortail e-toparrow");
                    if (kanbanObject.model.editSettings.editMode != "dialog")
                        $td.find(".e-error").remove();
                    if (element.parent().hasClass("e-in-wrap"))
                        $container.insertAfter(element.closest(".e-widget"));
                    else
                        $container.insertAfter(element);
                    $container.prepend($tail);
                    if (kanbanObject.model.enableRTL)
                        kanbanObject.model.editSettings.editMode != "dialog" && $container.offset({ left: element.offset().left, top: element.offset().top + element.height() });
                    else
                        kanbanObject.model.editSettings.editMode != "dialog" && $container.offset({ left: element.offset().left, top: element.offset().top + element.height() });
                    $container.fadeIn("slow");
                },
            });
        }
    };
    InternalEdit.prototype.setValidation = function () {
        var kObj = this.kanbanObj;
        for (var i = 0; i < kObj.model.editSettings.editItems.length; i++) {
            if (!ej.isNullOrUndefined(kObj.model.editSettings.editItems[i].validationRules)) {
                this.setValidationToField(kObj.model.editSettings.editItems[i].field, kObj.model.editSettings.editItems[i].validationRules);
            }
        }
    };
    InternalEdit.prototype.setValidationToField = function (name, rules) {
        var fName = name, ele, message, kObj = this.kanbanObj;
        if (!ej.isNullOrUndefined(name))
            fName = fName.replace(/[^a-z0-9\s_]/gi, '');
        var form = $('#' + kObj._id + "EditForm");
        ele = form.find("#" + kObj._id + "_" + fName).length > 0 ? form.find("#" + kObj._id + "_" + fName) : form.find("#" + fName);
        !ele.attr("name") && ele.attr("name", name);
        ele.rules("add", rules);
        var validator = $('#' + kObj._id + "EditForm").validate();
        validator.settings.messages[name] = validator.settings.messages[name] || {};
        if (!ej.isNullOrUndefined(rules.required)) {
            if (!ej.isNullOrUndefined(rules.messages && rules.messages.required)) {
                message = rules.messages.required;
            }
            else {
                message = $["validator"].messages.required;
            }
            if (message.indexOf("This field") == 0)
                message = message.replace("This field", name);
            validator.settings.messages[name].required = message;
        }
    };
    InternalEdit.prototype.editFormValidate = function () {
        if ($.isFunction($["validator"])) {
            return $('#' + this.kanbanObj._id + "EditForm").validate().form();
        }
        return true;
    };
    InternalEdit.prototype._addDialogEditingTemplate = function () {
        var kObj = this.kanbanObj, $editDiv = ej.buildTag('div'), $form, $table, $tr, $labelTd, $valueTd, savebtn, cancelbtn, btnDiv, trElement, tdElement;
        if (kObj.model.columns.length == 0)
            return;
        $form = ej.buildTag('form.kanbanform', "", {}, { id: kObj._id + "EditForm" });
        $table = ej.buildTag('table', "", {}, { cellspacing: "14px" });
        if (ej.isNullOrUndefined(kObj.model.editSettings.editMode))
            kObj.model.editSettings.editMode = "dialog";
        if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "externalform") {
            for (var dataCount = 0; dataCount < kObj.model.editSettings.editItems.length; dataCount++) {
                var curItem = kObj.model.editSettings.editItems[dataCount], name = curItem.field;
                if (kObj.model.editSettings.editMode == "dialog") {
                    trElement = 'tr';
                    tdElement = 'td';
                }
                else {
                    trElement = 'div.e-externalrow';
                    tdElement = 'div';
                }
                $tr = ej.buildTag(trElement);
                $labelTd = ej.buildTag(tdElement, "", {}).addClass("e-label");
                $valueTd = ej.buildTag(tdElement, "", { "text-align": "left" }).addClass("e-rowcell");
                $tr.append($labelTd.get(0)).append($valueTd.get(0));
                $labelTd.append("<label style='text-transform:capitalize' for='" + name + "'>" + name + "</label>");
                if (kObj.model.editSettings.editMode == "externalform" && kObj.model.editSettings.formPosition == "right")
                    $tr.css({ "width": "300px", "padding-right": "0px" });
                if (ej.isNullOrUndefined(curItem.editType))
                    curItem["editType"] = "stringedit";
                if (!ej.isNullOrUndefined(name))
                    name = name.replace(/[^a-z0-9\s_]/gi, '');
                switch (curItem.editType) {
                    case "stringedit":
                        if (kObj.model.fields.primaryKey == name)
                            $valueTd.html(ej.buildTag('input.e-field e-ejinputtext e-disable', "", {}, { value: "{{html:#data['" + name + "']}}", id: kObj._id + "_" + name, name: name, disabled: "disabled" }));
                        else
                            $valueTd.html(ej.buildTag('input.e-field e-ejinputtext', "", {}, { value: "{{html:#data['" + name + "']}}", id: kObj._id + "_" + name, name: name }));
                        break;
                    case "numericedit":
                        $valueTd.html(ej.buildTag('input.e-numerictextbox e-field', "", {}, { type: "text", value: "{{:#data['" + name + "']}}", id: kObj._id + "_" + name, name: name }));
                        break;
                    case "dropdownedit":
                        var ddlItems = [], ddlTempl, $select, $option, data, uniqueData;
                        if (ej.isNullOrUndefined(curItem.dataSource)) {
                            var query = new ej.Query().where(ej.Predicate["or"](kObj.keyPredicates)).select(curItem.field);
                            if (ej.isNullOrUndefined(this._dropDownManager) || (!kObj._dataManager.dataSource.offline && kObj._dataManager.dataSource.json.length))
                                data = kObj._dataManager.executeLocal(query);
                            else {
                                if (kObj._dataManager.adaptor instanceof ej.JsonAdaptor && curItem.field.indexOf('.') != -1) {
                                    var field = curItem.field.replace(/\./g, ej["pvt"].consts.complexPropertyMerge);
                                    query = new ej.Query().select(field);
                                }
                                data = this._dropDownManager.executeLocal(query);
                            }
                            uniqueData = ej.dataUtil.mergeSort(ej.dataUtil.distinct(data));
                            for (var index = 0; index < uniqueData.length; index++)
                                ddlItems.push({ text: uniqueData[index], value: uniqueData[index] });
                        }
                        else
                            ddlItems = curItem.dataSource;
                        $select = ej.buildTag('select');
                        $option = ej.buildTag("option", "{{:text}}", {}, { value: "{{html:#data['value']}}" });
                        $select.append($option);
                        ddlTempl = $.templates($select.html());
                        if (!ej.isNullOrUndefined(curItem.editParams) && !ej.isNullOrUndefined(curItem.dataSource))
                            $valueTd.get(0).innerHTML = "<input>";
                        else
                            $valueTd.get(0).innerHTML = ["<select>", ddlTempl.render(ddlItems), "</select>"].join("");
                        $valueTd.find("select,input").prop({ id: kObj._id + "_" + name, name: name }).addClass("e-field e-dropdownlist");
                        break;
                    case "rteedit":
                        $valueTd.html(ej.buildTag('textarea.e-field e-rte', "{{html:#data['" + name + "']}}", {}, { id: kObj._id + "_" + name, name: name }));
                        break;
                    case "textarea":
                        $valueTd.html(ej.buildTag('textarea.e-field e-kanbantextarea e-ejinputtext', "{{html:#data['" + name + "']}}", {}, { id: kObj._id + "_" + name, name: name }));
                        break;
                    case "datepicker":
                    case "datetimepicker":
                        $valueTd.html(ej.buildTag('input.e-' + curItem.editType + ' e-field', "", {}, { type: "text", value: "{{:#data['" + name + "']}}", id: kObj._id + "_" + name, name: name }));
                        break;
                }
                if (kObj.model.editSettings.editMode == "dialog") {
                    $form.append($table);
                    $table.append($tr);
                }
                else
                    $form.append($tr);
                $form.appendTo($editDiv);
            }
        }
        else {
            var cloneElement;
            if (kObj.model.editSettings.editMode == "dialogtemplate" && kObj.model.editSettings.dialogTemplate != null)
                cloneElement = kObj.model.editSettings.dialogTemplate;
            if (kObj.model.editSettings.editMode == "externalformtemplate" && kObj.model.editSettings.externalFormTemplate != null)
                cloneElement = kObj.model.editSettings.externalFormTemplate;
            $form.html($(cloneElement).html());
            $form.appendTo($editDiv);
        }
        savebtn = ej.buildTag('input.e-save', "", {}, { type: "button", id: kObj._id + "_Save" });
        savebtn.ejButton({ text: kObj.localizedLabels.SaveButton });
        if (kObj.model.editSettings.formPosition != "right")
            cancelbtn = ej.buildTag('input.e-cancel', "", {}, { type: "button", id: kObj._id + "_Cancel" });
        else
            cancelbtn = ej.buildTag('input.e-cancel', "", {}, { type: "button", id: kObj._id + "_Cancel" });
        cancelbtn.ejButton({ text: kObj.localizedLabels.CancelButton });
        btnDiv = (kObj.model.editSettings.editMode != "dialog" && kObj.model.editSettings.editMode != "dialogtemplate") ? ej.buildTag('div', "", "", { 'class': "e-editform-btn" }) : ej.buildTag('div#' + kObj._id + "_EditBtnDiv", "", {}, { "class": "e-kanban-editdiv" });
        btnDiv.append(savebtn);
        btnDiv.append(cancelbtn);
        if (kObj.model.editSettings.editMode != "dialog" && kObj.model.editSettings.editMode != "dialogtemplate")
            btnDiv.appendTo($editDiv);
        else
            $form.append(btnDiv);
        $.templates(kObj._id + "_dialogEditingTemplate", $editDiv.html());
    };
    return InternalEdit;
}());
;
window.ej.createObject("ej.KanbanFeatures.Edit", InternalEdit, window);
;
var InternalContext = (function () {
    function InternalContext(element) {
        this.kanbanObj = null;
        this.kanbanObj = element;
    }
    ;
    InternalContext.prototype._renderContext = function () {
        var kObj = this.kanbanObj, menuitems, submenu, submenuitem, data, menuItem1, item, menu, i, j, k, l, custom, custom2, ul, disableitem, customitems, subMenuItems, subul;
        menuitems = kObj.model.contextMenuSettings.menuItems;
        ul = ej.buildTag('ul', "", {}, { id: kObj._id + '_Context' });
        disableitem = kObj.model.contextMenuSettings.disableDefaultItems;
        for (var m = 0; m < menuitems.length; m++) {
            if (menuitems[m] == "" || menuitems[m] == " ")
                menuitems.splice(m, 1);
        }
        for (i = 0; i < menuitems.length; i++) {
            item = menuitems[i];
            if ($.inArray(item, disableitem) == -1)
                menu = this._items(item, "menuItem");
            ul.append(menu);
        }
        customitems = kObj.model.contextMenuSettings.customMenuItems;
        for (j = 0; j < customitems.length; j++) {
            custom = customitems[j].text;
            custom2 = this._items(custom, "custom");
            if (customitems[j].template)
                custom2.append($(customitems[j].template));
            ul.append(custom2);
        }
        subul = ej.buildTag('ul', "", {}, { id: kObj._id + '_SubContext' });
        for (i = 0; i < kObj.model.columns.length; i++) {
            item = kObj.model.columns[i].headerText;
            submenuitem = ej.buildTag('input', "", {}, { type: "checkbox", name: item });
            menu = this._items(item, "subMenuItem");
            menu.find("span").append(submenuitem);
            menu.find("span").addClass("e-checkbox e-visiblecolumns");
            subul.append(menu);
            submenuitem.ejCheckBox({
                checked: kObj.model.columns[i].visible,
            });
        }
        $(ul).find("li.e-column.e-visiblecolumn").append(subul);
        if (kObj.model.fields.swimlaneKey) {
            subul = ej.buildTag('ul', "", {}, { id: kObj._id + '_SubContext' });
            var query = new ej.Query().select([kObj.model.fields.swimlaneKey]);
            if (kObj._dataManager.dataSource.offline)
                data = kObj._dataManager.executeLocal(query);
            else
                data = kObj._contextSwimlane.executeLocal(query);
            data = ej.dataUtil.mergeSort(ej.dataUtil.distinct(data));
            for (i = 0; i < data.length; i++) {
                item = data[i];
                menu = this._items(item, "subMenuItem");
                subul.append(menu);
            }
            $(ul).find("li.e-move.e-swimlane").append(subul);
        }
        $(ul).ejMenu({
            menuType: ej.MenuType.ContextMenu,
            openOnClick: false,
            contextMenuTarget: "#" + kObj._id,
            click: $.proxy(kObj._clickevent, kObj),
            width: "auto",
            cssClass: "e-kanban-context",
            beforeOpen: $.proxy(kObj._menu, kObj),
            open: $.proxy(this._contextopen, kObj)
        });
        kObj._conmenu = ul.data("ejMenu");
    };
    InternalContext.prototype._contextopen = function () {
        var context = this["_conmenu"].element;
        if (context.length > 0) {
            if (!context.find("li").is(":visible")) {
                context.css("visibility", "hidden");
            }
        }
    };
    InternalContext.prototype._kanbanContextClick = function (sender, kObj) {
        var args, c, card, cardlen;
        if (sender.parentText != null)
            args = sender.parentText;
        else
            args = sender.events.text;
        c = $(kObj._contexttarget);
        sender.targetelement = kObj._contexttarget;
        card = c.closest(".e-kanbancard");
        cardlen = card.length;
        if (card.length > 0) {
            sender.card = card;
            sender.index = card.parent('.e-rowcell').find('.e-kanbancard').index(card);
            sender.cellIndex = card.parent('.e-rowcell').index();
            sender.rowIndex = kObj.getIndexByRow(card.parents('.e-columnrow'));
            sender.cardData = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, card.attr('id'))[0];
        }
        if (kObj._trigger("contextClick", sender))
            return;
        switch (args) {
            case "Add Card":
                kObj._isAddNewClick = true;
                kObj._newCard = $(kObj._contexttarget);
                if (kObj.KanbanEdit)
                    kObj.KanbanEdit.addCard();
                break;
            case "Edit Card":
                if (cardlen > 0 && !ej.isNullOrUndefined(kObj.model.fields.primaryKey) && kObj.KanbanEdit)
                    kObj.KanbanEdit.startEdit(card);
                break;
            case "Hide Column":
                if (c.closest(".e-headercell").find(".e-headercelldiv").length > 0)
                    kObj.hideColumns($.trim(c.closest(".e-headercell").find(".e-headercelldiv .e-headerdiv").text()).split("[")[0]);
                break;
            case "Delete Card":
                if (!ej.isNullOrUndefined(kObj.model.fields.primaryKey) && card.length > 0 && kObj.KanbanEdit) {
                    kObj.KanbanEdit.deleteCard(card.attr("id"));
                    kObj.KanbanCommon._showhide(kObj._hiddenColumns, "hide");
                    if (kObj.model.enableTotalCount)
                        kObj.KanbanCommon._totalCount();
                }
                break;
            case "Move Right":
                if (cardlen > 0 && kObj.KanbanDragAndDrop) {
                    kObj._bulkUpdateData = [];
                    kObj.KanbanDragAndDrop._dropToColumn($(kObj._contexttarget).closest("td.e-rowcell").next(), card);
                    if (kObj.model.enableTotalCount)
                        kObj.KanbanCommon._totalCount();
                }
                break;
            case "Move Left":
                if (cardlen > 0 && kObj.KanbanDragAndDrop) {
                    kObj._bulkUpdateData = [];
                    kObj.KanbanDragAndDrop._dropToColumn($(kObj._contexttarget).closest("td.e-rowcell").prev(), card);
                    if (kObj.model.enableTotalCount)
                        kObj.KanbanCommon._totalCount();
                }
                break;
            case "Move Up":
                if (cardlen > 0 && kObj.KanbanDragAndDrop) {
                    kObj._bulkUpdateData = [];
                    kObj.KanbanDragAndDrop._dropAsSibling(card.prev(), card, false);
                }
                break;
            case "Move Down":
                if (cardlen > 0 && kObj.KanbanDragAndDrop) {
                    kObj._bulkUpdateData = [];
                    kObj.KanbanDragAndDrop._dropAsSibling(card.next(), card, true);
                }
                break;
            case "Top of Row":
                if (cardlen > 0 && kObj.KanbanDragAndDrop) {
                    kObj._bulkUpdateData = [];
                    kObj.KanbanDragAndDrop._dropAsSibling(c.closest("td.e-rowcell").find(".e-kanbancard").first(), card, false);
                }
                break;
            case "Bottom of Row":
                if (cardlen > 0 && kObj.KanbanDragAndDrop) {
                    kObj._bulkUpdateData = [];
                    kObj.KanbanDragAndDrop._dropAsSibling(c.closest("td.e-rowcell").find(".e-kanbancard").last(), card, true);
                }
                break;
            case "Move to Swimlane":
                if (args != sender.text && cardlen > 0) {
                    var id = c.closest(".e-kanbancard").attr("id");
                    var data = new ej.DataManager(kObj._currentJsonData).executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, id))[0];
                    data[kObj.model.fields.swimlaneKey] = sender.text;
                    var args = { data: data, requestType: "save", primaryKeyValue: data[kObj.model.fields.primaryKey] };
                    kObj._saveArgs = args;
                    kObj.updateCard(id, data);
                    kObj.KanbanCommon._showhide(kObj._hiddenColumns, "hide");
                    kObj._saveArgs = null;
                }
                break;
            case "Print Card":
                if (cardlen > 0)
                    kObj.print(card);
                break;
            case "Visible Columns":
                if (args != sender.text) {
                    var index = $(sender.element.parentElement).find("li").index(sender.element);
                    if (kObj.model.columns[index].visible) {
                        kObj.hideColumns(sender.text);
                        $($(sender.element).find("input.e-checkbox")).ejCheckBox({ "checked": false });
                    }
                    else {
                        kObj.showColumns(sender.text);
                        $($(sender.element).find("input.e-checkbox")).ejCheckBox({ "checked": true });
                    }
                }
                break;
        }
        if (kObj.model.isResponsive)
            kObj.kanbanWindowResize();
        if (kObj.model.allowScrolling)
            kObj.kanbanContent.data('ejScroller').refresh();
    };
    InternalContext.prototype._kanbanMenu = function (sender, kObj) {
        var context, targetelement, td, tr, rowCell, card, contextmenu, custommenuitems, customitems, i, j, count, index, menuItems;
        context = kObj._conmenu.element;
        kObj._contexttarget = sender.target;
        targetelement = $(sender.target);
        td = $(kObj._contexttarget).closest("td.e-rowcell");
        tr = $(kObj._contexttarget).closest("tr.e-columnrow");
        rowCell = targetelement.closest(".e-rowcell");
        card = $(targetelement).closest(".e-kanbancard");
        var cardData = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, card.attr('id'))[0];
        contextmenu = kObj.model.contextMenuSettings.menuItems;
        context.css("visibility", "visible");
        context.find("li").hide();
        if (targetelement.closest(".e-kanban").attr("id") !== kObj._id) {
            context.css("visibility", "hidden");
            return;
        }
        if (context.find(".e-customitem").length > 0) {
            custommenuitems = kObj.model.contextMenuSettings.customMenuItems;
            customitems = context.find(".e-customitem");
            for (j = 0; j < customitems.length; j++) {
                if (!custommenuitems[j].target)
                    custommenuitems[j].target = "all";
                if (custommenuitems[j].target && custommenuitems[j].text == context.find(".e-customitem").children("a").eq(j).text())
                    switch (custommenuitems[j].target) {
                        case "content":
                            if (kObj.getContentTable().find(targetelement).length > 0) {
                                $(customitems[j]).show();
                                if ($(customitems[j]).find("li").length > 0)
                                    $(customitems[j]).find("li").show();
                            }
                            else
                                $(customitems[j]).hide();
                            break;
                        case "header":
                            if (kObj.getHeaderContent().find(targetelement).length > 0) {
                                $(customitems[j]).show();
                                if ($(customitems[j]).find("li").length > 0)
                                    $(customitems[j]).find("li").show();
                            }
                            else
                                $(customitems[j]).hide();
                            break;
                        case "card":
                            if (kObj.element.find(".e-kanbancard").find(targetelement).length > 0) {
                                $(customitems[j]).show();
                                if ($(customitems[j]).find("li").length > 0)
                                    $(customitems[j]).find("li").show();
                            }
                            else
                                $(customitems[j]).hide();
                            break;
                        case "all":
                            $(customitems[j]).show();
                            if ($(customitems[j]).find("li").length > 0)
                                $(customitems[j]).find("li").show();
                            break;
                    }
            }
        }
        if (kObj.getContentTable().find(targetelement).length > 0) {
            if (rowCell.length == 0 || targetelement.filter(".e-targetclone,.e-targetdragclone").length > 0) {
                context.css("visibility", "hidden");
                return;
            }
            else if ($(targetelement).closest(".e-swimlanerow").length > 0) {
                context.css("visibility", "hidden");
                return;
            }
            else if (card.length > 0) {
                var closecard = $(targetelement).closest("td.e-rowcell").find(".e-kanbancard");
                index = closecard.index(card);
                count = closecard.length;
                $(context.find("li").not(".e-customitem")).hide();
                $(context.find(".e-customitem li")).show();
                if (!ej.isNullOrUndefined(kObj.model.fields.primaryKey) && kObj.model.editSettings.allowEditing)
                    context.find(".e-content.e-cardedit").show();
                if (td.hasClass("e-drag")) {
                    if (index > 1)
                        context.find(".e-move.e-up").show();
                    if (index != count - 1 && td.hasClass("e-drop"))
                        context.find(".e-row.e-bottom").show();
                    if (index != 0 && td.hasClass("e-drop"))
                        context.find(".e-row.e-top").show();
                    if (((count - 1) - index) > 1)
                        context.find(".e-move.e-down").show();
                    if (td.next().length > 0 && td.next().hasClass("e-drop") && !kObj._checkMultikey(td.next()) && kObj.KanbanCommon._preventCardMove(cardData[kObj.model.keyField], kObj.model.columns[td.next().index()]["key"]))
                        context.find(".e-move.e-right").show();
                    if (td.prev().length > 0 && td.prev().hasClass("e-drop") && !kObj._checkMultikey(td.prev()) && kObj.KanbanCommon._preventCardMove(cardData[kObj.model.keyField], kObj.model.columns[td.prev().index()]["key"]))
                        context.find(".e-move.e-left").show();
                    if (kObj.model.fields.swimlaneKey && kObj.model.fields.primaryKey && context.find(".e-move.e-swimlane").length > 0) {
                        context.find(".e-move.e-swimlane").show();
                        context.find(".e-move.e-swimlane").find("li").show();
                        context.find(".e-move.e-swimlane").find("li").eq(kObj._columnRows.index(tr)).hide();
                    }
                }
                if (!ej.isNullOrUndefined(kObj.model.fields.primaryKey))
                    context.find(".e-content.delete").show();
                if (kObj.model.allowPrinting)
                    context.find(".e-print").show();
            }
            else if (rowCell.length > 0) {
                $(context.find("li").not(".e-customitem")).hide();
                $(context.find(".e-customitem li")).show();
                if (kObj.model.editSettings.allowAdding)
                    context.find(".e-add").show();
            }
        }
        else if (kObj.getHeaderContent().find(targetelement).length > 0) {
            var concolumnmenu = context.find(".e-column");
            if ($(targetelement).closest(".e-headercell").not(".e-stackedHeaderCell").length > 0) {
                $(context.find("li").not(".e-customitem")).hide();
                $(context.find(".e-customitem li")).show();
                $(context.find("li.e-haschild").find("li")).show();
                concolumnmenu.show();
                for (i = 0; i < context.find(".e-column.e-visiblecolumn").find("li").length; i++) {
                    if (kObj.element.find(".e-headercell").not(".e-stackedHeaderCell").eq(i).hasClass("e-hide"))
                        concolumnmenu.find("li input.e-checkbox").eq(i).ejCheckBox({ checked: false });
                    else
                        concolumnmenu.find("li input.e-checkbox").eq(i).ejCheckBox({ checked: true });
                }
                concolumnmenu.find("li").show();
            }
            else {
                context.css("visibility", "hidden");
                return;
            }
        }
        else {
            context.css("visibility", "hidden");
            return;
        }
        if (kObj.model.contextOpen) {
            sender.card = card;
            sender.index = card.parent('.e-rowcell').find('.e-kanbancard').index(card);
            sender.cellIndex = card.parent('.e-rowcell').index();
            sender.rowIndex = kObj.getIndexByRow(card.parents('.e-columnrow'));
            sender.cardData = kObj.KanbanCommon._getKanbanCardData(kObj._currentJsonData, card.attr('id'))[0];
            kObj._trigger("contextOpen", sender);
        }
    };
    InternalContext.prototype._items = function (item, type) {
        if (item == "" || ej.isNullOrUndefined(item))
            return false;
        var li;
        if (type == "menuItem") {
            if (item.indexOf("Card") != -1) {
                li = ej.buildTag('li', "", {}, { "class": "e-content" });
                li.css("display", "none");
                if (item.indexOf("Add") != -1)
                    li.addClass("e-add");
                if (item.indexOf("Edit") != -1)
                    li.addClass("e-cardedit");
                if (item.indexOf("Delete") != -1)
                    li.addClass("delete");
                if (item.indexOf("Print") != -1)
                    li.addClass("e-print");
                li.css("display", "none");
            }
            else if (item.indexOf("Column") != -1 || item.indexOf("Columns") != -1) {
                li = ej.buildTag('li', "", {}, { "class": "e-column" });
                if (item.indexOf("Hide") != -1)
                    li.addClass("e-hidecolumn");
                if (item.indexOf("Visible") != -1)
                    li.addClass("e-visiblecolumn");
                li.css("display", "none");
            }
            else if (item.indexOf("Row") != -1) {
                li = ej.buildTag('li', "", {}, { "class": "e-row" });
                if (item.indexOf("Top") != -1)
                    li.addClass("e-top");
                else
                    li.addClass("e-bottom");
                li.css("display", "none");
            }
            else if (item.indexOf("Move") != -1) {
                li = ej.buildTag('li', "", {}, { "class": "e-move" });
                if (item.indexOf("Left") != -1)
                    li.addClass("e-left");
                else if (item.indexOf("Right") != -1)
                    li.addClass("e-right");
                else if (item.indexOf("Up") != -1)
                    li.addClass("e-up");
                else if (item.indexOf("Down") != -1)
                    li.addClass("e-down");
                else if (item.indexOf("Swimlane") != -1)
                    li.addClass("e-swimlane");
                li.css("display", "none");
            }
        }
        else if (type == "subMenuItem") {
            li = ej.buildTag('li', "", {}, {});
        }
        else if (type == "custom") {
            li = ej.buildTag('li', "", {}, { "class": "e-customitem" });
            li.css("display", "block");
        }
        var a = document.createElement("a"), classElement = "";
        if (typeof item == "string") {
            if (item.indexOf("Move to") != -1)
                classElement = item.split(" ")[2].toLowerCase();
            else if (item.indexOf("Move") != -1)
                classElement = item.split(" ")[1].toLowerCase();
            else
                classElement = item.split(" ")[0].toLowerCase();
        }
        else
            classElement = item;
        a.innerHTML = item;
        $(a).append(ej.buildTag('span', "", {}, { "class": "e-kanbancontext e-icon e-context" + classElement }));
        li.append(a);
        return li;
    };
    InternalContext.prototype._kbnBrowserContextMenu = function (e) {
        if (this["_kbnBrowserContext"] == "contextmenu" && this["model"].enableTouch)
            e.preventDefault();
        this["_kbnBrowserContext"] = "null";
    };
    return InternalContext;
}());
window.ej.createObject("ej.KanbanFeatures.Context", InternalContext, window);
;
var InternalSwimlane = (function () {
    function InternalSwimlane(element) {
        this.kanbanObj = null;
        this.kanbanObj = element;
    }
    ;
    InternalSwimlane.prototype.expandAll = function () {
        var slDivs = this.kanbanObj.element.find(".e-swimlanerow .e-slcollapse");
        if (slDivs.length != 0) {
            for (var i = 0; i < slDivs.length; i++)
                this.toggle($(slDivs[i]));
        }
    };
    InternalSwimlane.prototype.collapseAll = function () {
        var slDivs = this.kanbanObj.element.find(".e-swimlanerow .e-slexpand");
        if (slDivs.length != 0) {
            for (var i = 0; i < slDivs.length; i++)
                this.toggle($(slDivs[i]));
        }
    };
    InternalSwimlane.prototype.toggle = function ($target) {
        var name, $curRow, kObj = this.kanbanObj;
        if (typeof $target == "string" || typeof $target == "number") {
            name = kObj.KanbanCommon._removeIdSymbols($target);
            $curRow = kObj.element.find('tr[id=' + name + ']');
            this._toggleSwimlaneRow($($curRow).find(".e-rowcell .e-slexpandcollapse"));
        }
        else if (typeof $target == "object" && $target[0].nodeName != "DIV") {
            for (var i = 0; i < $target.length; i++) {
                name = kObj.KanbanCommon._removeIdSymbols($target[i]);
                $curRow = kObj.element.find('tr[id=' + name + ']');
                this._toggleSwimlaneRow($($curRow).find(".e-rowcell .e-slexpandcollapse"));
            }
        }
        else
            this._toggleSwimlaneRow($target);
    };
    InternalSwimlane.prototype._toggleSwimlaneRow = function ($target) {
        var kObj = this.kanbanObj;
        $target = $target.hasClass("e-slexpandcollapse") ? $target.find("div:first") : $target;
        if (!($target.hasClass("e-slexpand") || $target.hasClass("e-slcollapse")))
            return;
        var cRow = $target.closest('tr');
        cRow.next(".e-collapsedrow").remove();
        var $row = cRow.next();
        var swim = kObj.KanbanCommon._removeIdSymbols($target.parent().next(".e-slkey").html());
        if ($target.hasClass("e-slexpand")) {
            $row.hide();
            var dRow = ej.buildTag('tr', "", {}, { "class": "e-collapsedrow" }), cols = kObj.model.columns, td;
            for (var i = 0; i < cols.length; i++) {
                td = ej.buildTag('td', "", {}, { "class": "e-rowcell", "role": "kanbancell" });
                if (!cols[i].visible)
                    td.addClass("e-hide");
                if (cols[i].isCollapsed)
                    td.addClass("e-shrink");
                dRow.append(td);
            }
            $row.before(dRow);
            $target.removeClass("e-slexpand").addClass("e-slcollapse");
            if ($.inArray(swim, kObj._collapsedSwimlane) == -1)
                kObj._collapsedSwimlane.push(swim);
        }
        else {
            $row.show();
            $target.removeClass("e-collapsedrow").removeClass("e-slcollapse").addClass("e-slexpand");
            var index = $.inArray(swim, kObj._collapsedSwimlane);
            if (index != -1)
                kObj._collapsedSwimlane.splice(index, 1);
        }
        if (kObj.model.allowScrolling) {
            var vScrollArea = kObj.headerContent.find('.e-hscrollcss');
            kObj.KanbanScroll._refreshScroller({ requestType: "refresh" });
            if (kObj.getContent().find('.e-vscrollbar').length > 0)
                vScrollArea.removeClass('e-vscroll-area');
            else
                vScrollArea.addClass('e-vscroll-area');
        }
    };
    InternalSwimlane.prototype._freezeRow = function (e, kObj) {
        var slKey = kObj.model.fields.swimlaneKey, toolbar = kObj.element.find('.e-kanbantoolbar');
        kObj._freezeSwimlaneRow = kObj.element.find('.e-freezeswimlanerow');
        if (!kObj.model.scrollSettings.allowFreezeSwimlane && !$.isEmptyObject(kObj._freezeSwimlaneRow)) {
            kObj._freezeSwimlaneRow.remove();
            kObj.headerContent.css({ 'position': '', 'top': '' });
            kObj.kanbanContent.css({ 'position': '', 'top': '' });
            if (toolbar.length > 0)
                toolbar.css({ 'position': '', 'top': '' });
        }
        if (kObj.element.hasClass('e-responsive') || (!kObj.element.hasClass('e-responsive') && (!kObj.model.scrollSettings.allowFreezeSwimlane || ej.isNullOrUndefined(slKey) || (!ej.isNullOrUndefined(e.scrollLeft) && kObj._freezeSwimlaneRow.length == 0))))
            return;
        var top, firstSl, table, tbody, tds;
        if (kObj._freezeSwimlaneRow.length <= 0 && kObj.model.scrollSettings.allowFreezeSwimlane) {
            kObj._freezeSwimlaneRow = ej.buildTag('div.e-freezeswimlanerow e-swimlanerow', "<div></div>", {}, {});
            top = (kObj.headerContent.offset().top + kObj.headerContent.height()) - (kObj.element.offset().top + 1);
            var height = kObj.element.height();
            kObj._freezeSwimlaneRow.prependTo(kObj.element).css({ 'top': top });
            top = kObj._freezeSwimlaneRow.height();
            kObj.headerContent.css({ 'position': 'relative', 'top': -top });
            kObj.kanbanContent.css({ 'position': 'relative', 'top': -top });
            if (toolbar.length > 0)
                toolbar.css({ 'position': 'relative', 'top': -top });
            kObj.element.height(height);
            firstSl = kObj._swimlaneRows.eq(0);
            kObj._freezeSwimlaneRow.children().append(firstSl.find('.e-slkey,.e-slcount').clone());
            kObj._freezeSwimlaneRow.width(kObj.headerContent.width() - 1).height(firstSl.height());
            kObj._freezeSlOrder = 0;
            table = ej.buildTag('table.e-table e-freeze-table', "", {}, { cellspacing: "0.25px" });
            table.append(kObj.getContentTable().find('colgroup').clone());
            tbody = ej.buildTag("tbody", "", {}, {});
            table.append(tbody);
            tbody.append(kObj.getContentTable().find('.e-columnrow').eq(0).clone().removeClass('e-columnrow').addClass('e-collapsedrow'));
            tds = tbody.find('td');
            tds.removeClass('e-droppable').removeAttr('ej-mappingkey').height(0);
            tds.children().remove();
            kObj._freezeSwimlaneRow.append(table);
        }
        else if (kObj._freezeSwimlaneRow.length > 0 || (!ej.isNullOrUndefined(slKey) && kObj.element.hasClass('e-responsive'))) {
            var freezeSlHeight, curHeight, nextSlHeight = 0, curSlHeight = 0, prevSlHeight = 0, rows, slText = kObj.element.find('.e-swimlane-text');
            var nextSl, curSl, prevSl, freezeSlDiv;
            if (!ej.isNullOrUndefined(slKey) && kObj.element.hasClass('e-responsive')) {
                rows = kObj.element.find('.e-columnrow');
                freezeSlHeight = kObj.getContent().offset().top;
                curSl = rows.eq(kObj._freezeSlOrder);
                nextSl = rows.eq(kObj._freezeSlOrder + 1);
                prevSl = rows.eq(kObj._freezeSlOrder - 1);
                if (nextSl.length > 0)
                    nextSlHeight = nextSl.offset().top;
                if (curSl.length > 0)
                    curSlHeight = curSl.offset().top;
                if (prevSl.length > 0)
                    prevSlHeight = prevSl.offset().top;
            }
            else if (kObj._freezeSwimlaneRow.length > 0) {
                freezeSlHeight = kObj.getContent().offset().top + kObj._freezeSwimlaneRow.height();
                curSl = kObj._swimlaneRows.eq(kObj._freezeSlOrder);
                nextSl = kObj._swimlaneRows.eq(kObj._freezeSlOrder + 1);
                prevSl = kObj._swimlaneRows.eq(kObj._freezeSlOrder - 1);
                if (nextSl.length > 0)
                    nextSlHeight = nextSl.offset().top + nextSl.height();
                curSlHeight = curSl.offset().top + curSl.height();
                prevSlHeight = prevSl.offset().top + prevSl.height();
            }
            freezeSlDiv = kObj.element.find('.e-freezeswimlanerow >div');
            if (kObj._freezeScrollTop > e.scrollTop) {
                curSlHeight = curSlHeight;
                if (freezeSlHeight >= nextSlHeight)
                    nextSlHeight = freezeSlHeight + 1;
            }
            if (kObj._freezeScrollTop < e.scrollTop)
                nextSlHeight = nextSlHeight;
            if (e.source == "wheel" || e.source == "button") {
                if (kObj._freezeScrollTop < e.scrollTop)
                    nextSlHeight = nextSlHeight - e.model.scrollOneStepBy;
                else if (kObj._freezeScrollTop > e.scrollTop)
                    freezeSlHeight = freezeSlHeight - e.model.scrollOneStepBy;
            }
            if (freezeSlHeight >= nextSlHeight && kObj._freezeSlOrder < kObj._swimlaneRows.length - 1) {
                if (freezeSlDiv.length > 0) {
                    freezeSlDiv.children().remove();
                    freezeSlDiv.append(nextSl.find('.e-slkey,.e-slcount').clone());
                }
                if (slText.length > 0) {
                    slText.text(kObj._kbnAdaptDdlData[kObj._kbnAdaptDdlIndex + 1]);
                    ++kObj._kbnAdaptDdlIndex;
                }
                ++kObj._freezeSlOrder;
            }
            else if (freezeSlHeight < curSlHeight && freezeSlHeight > prevSlHeight && kObj._freezeSlOrder > 0) {
                if (freezeSlDiv.length > 0) {
                    freezeSlDiv.children().remove();
                    freezeSlDiv.append(prevSl.find('.e-slkey,.e-slcount').clone());
                }
                if (slText.length > 0) {
                    slText.text(kObj._kbnAdaptDdlData[kObj._kbnAdaptDdlIndex - 1]);
                    --kObj._kbnAdaptDdlIndex;
                }
                --kObj._freezeSlOrder;
            }
            if (e.scrollTop == 0) {
                kObj._freezeSwimlaneRow.remove();
                kObj.headerContent.css({ 'position': '', 'top': '' });
                kObj.kanbanContent.css({ 'position': '', 'top': '' });
                if (toolbar.length > 0)
                    toolbar.css({ 'position': '', 'top': '' });
            }
            if (!ej.isNullOrUndefined(e.scrollLeft)) {
                freezeSlDiv.css({ 'left': -e.scrollLeft });
                kObj._freezeSwimlaneRow.find('table').css({ 'left': -e.scrollLeft });
            }
        }
        kObj._freezeScrollTop = e.scrollTop;
    };
    InternalSwimlane.prototype._swimlaneLimit = function (args) {
        var kObj = this.kanbanObj;
        for (var i = 0; i < kObj.model.columns.length; i++) {
            var constraints = kObj.model.columns[i].constraints, key = kObj.KanbanCommon._multikeySeparation(kObj.model.columns[i].key), $min, $minLimit, $max, $maxLimit;
            if (!ej.isNullOrUndefined(constraints)) {
                var isMin = !ej.isNullOrUndefined(constraints.min), isMax = !ej.isNullOrUndefined(constraints.max), $cell = $($(kObj.getContent().find(".e-columnrow")).find('td[ej-mappingkey="' + key + '"]'));
                if (constraints.type == "swimlane" && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
                    for (var j = 0; j < $cell.length; j++) {
                        if ($($cell).eq(j).find(".e-limits").length == 0) {
                            var limit = ej.buildTag("div.e-limits");
                            $($cell).eq(j).prepend(limit);
                        }
                        var $limit = $($cell).eq(j).find(".e-limits");
                        if (isMin) {
                            $min = ej.buildTag("div.e-min", kObj.localizedLabels.Min, "", {});
                            $minLimit = ej.buildTag("span.e-minlimit", " " + constraints.min.toString(), "", {});
                            $min.append($minLimit);
                            if ($limit.find(".e-min").length > 0)
                                $limit.find(".e-min").remove();
                            $limit.append($min);
                        }
                        if (isMax) {
                            $max = ej.buildTag("div.e-max", kObj.localizedLabels.Max, "", {});
                            $maxLimit = ej.buildTag("span.e-maxlimit", " " + constraints.max.toString(), "", {});
                            $max.append($maxLimit);
                            if ($limit.find(".e-max").length > 0)
                                $limit.find(".e-max").remove();
                            if (isMin)
                                $limit.append("/");
                            $limit.append($max);
                        }
                        if (kObj.getHeaderContent().find(".e-headercell").eq(i).hasClass("e-shrinkcol"))
                            $($cell).eq(j).find(".e-limits").addClass("e-hide");
                    }
                }
            }
        }
    };
    return InternalSwimlane;
}());
window.ej.createObject("ej.KanbanFeatures.Swimlane", InternalSwimlane, window);
;
var InternalCommon = (function () {
    function InternalCommon(element) {
        this.kanbanObj = null;
        this.kanbanObj = element;
    }
    ;
    InternalCommon.prototype._updateGroup = function (cardId, data) {
        var kObj = this.kanbanObj;
        if (ej.isNullOrUndefined(kObj._saveArgs))
            new ej.DataManager(kObj._currentJsonData).update(kObj.model.fields.primaryKey, data, "");
        if ($.type(data) && !data.count)
            this._renderSingleCard(cardId, data);
    };
    InternalCommon.prototype._removeIdSymbols = function (id) {
        if (typeof id == "string")
            id = id.replace(/[-\s']/g, '_');
        return id;
    };
    InternalCommon.prototype._enableKanbanRTL = function () {
        if (this.kanbanObj.model.enableRTL)
            this.kanbanObj.element.addClass("e-rtl");
        else
            this.kanbanObj.element.removeClass("e-rtl");
    };
    InternalCommon.prototype._getEmptyTbody = function () {
        var $emptyTd = ej.buildTag('td.e-emptycard', this.kanbanObj.localizedLabels.EmptyCard, {}, { colSpan: this.kanbanObj.model.columns.length });
        return $(document.createElement("tr")).append($emptyTd);
    };
    InternalCommon.prototype._renderSingleCard = function (primaryKey, card) {
        var kObj = this.kanbanObj, curEle = kObj.element.find("div[id='" + primaryKey + "']"), proxy = kObj, curTr, curTd;
        if (!kObj._dropped) {
            var swimlaneKey = proxy.model.fields.swimlaneKey;
            if (!ej.isNullOrUndefined(swimlaneKey)) {
                var unassignedGroup = kObj.model.swimlaneSettings.unassignedGroup;
                if (unassignedGroup.enable && unassignedGroup.keys.length > 0)
                    card = kObj._checkKbnUnassigned(card);
                var slKey = this._removeIdSymbols(card[swimlaneKey]);
                var slTr = kObj.element.find("tr[id='" + slKey + "']");
                if (slTr.length > 0)
                    curTr = slTr.next();
            }
            else
                curTr = kObj.element.find(".e-columnrow:first");
            curTd = $(curTr).find("td.e-rowcell").eq(kObj._getColumnKeyIndex(card[kObj.model.keyField]));
            $(curEle).remove();
            if (curTd.length > 0)
                $(curTd).children().hasClass("e-customaddbutton") ? $($.render[kObj._id + "_cardTemplate"](card)).insertBefore($(curTd).find(".e-customaddbutton")) : $(curTd).append($.render[kObj._id + "_cardTemplate"](card));
        }
        else {
            var cTemp = $.render[kObj._id + "_cardTemplate"](card);
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version == "8.0")
                $(curEle).after(cTemp);
            else {
                $(curEle).replaceWith(cTemp);
                var index = $.inArray(primaryKey, kObj._collapsedCards);
                if (index != -1)
                    kObj.toggleCard(primaryKey);
            }
        }
        if (kObj.KanbanDragAndDrop)
            kObj.KanbanDragAndDrop._addDragableClass();
        if (kObj.KanbanSelection)
            kObj.KanbanSelection._selectionOnRerender();
    };
    InternalCommon.prototype._getKanbanCardData = function (data, key) {
        return (new ej.DataManager(data).executeLocal(new ej.Query().where(this.kanbanObj.model.fields.primaryKey, ej.FilterOperators.equal, key)));
    };
    InternalCommon.prototype._kbnHeaderAndCellEvents = function ($target) {
        var kObj = this.kanbanObj, args = {}, cards = $target.find('.e-kanbancard'), hTrgt = $target, key, selCards = $target.find('.e-cardselection'), headerIndex, proxy = this, cellIndex = $target.index(), row = $target.parents('.e-columnrow'), cells;
        cells = kObj.element.find('.e-rowcell.e-droppable');
        key = $target.attr('ej-mappingkey');
        if (hTrgt.parents('.e-headercell').length > 0)
            hTrgt = $target.parents('.e-headercell');
        if (hTrgt.hasClass('e-headercell')) {
            var curCell;
            headerIndex = cellIndex = hTrgt.index();
            curCell = cells.eq(headerIndex);
            key = curCell.attr('ej-mappingkey');
            if (kObj.model.fields.swimlaneKey)
                curCell = $("td[ej-mappingkey~='" + key + "']");
            cards = curCell.find('.e-kanbancard');
            selCards = curCell.find('.e-cardselection');
            row = curCell.parents('.e-columnrow');
        }
        if ($target.hasClass('e-rowcell') || !hTrgt.hasClass('e-stackedHeaderCell')) {
            var skey = row.prev('.e-swimlanerow').find('.e-slkey').text(), selIndexes = [], predicates = [];
            if (!ej.isNullOrUndefined(key)) {
                var key = typeof (key) == "object" ? key : key.split(",");
                for (var j = 0; j < key.length; j++)
                    predicates.push(new ej.Predicate(kObj.model.keyField, ej.FilterOperators.equal, key[j], true));
            }
            else
                predicates.push(new ej.Predicate(kObj.model.keyField, ej.FilterOperators.equal, key, true));
            args["cardsInfo"] = function () {
                var cardsInfo = {}, index;
                cardsInfo["cards"] = cards;
                if (kObj.model.fields.swimlaneKey && $target.hasClass('e-rowcell'))
                    cardsInfo["cardsData"] = new ej.DataManager(kObj._currentJsonData).executeLocal(new ej.Query().where(ej.Predicate["or"](predicates)).where(kObj.model.fields.swimlaneKey, ej.FilterOperators.equal, skey));
                else
                    cardsInfo["cardsData"] = new ej.DataManager(kObj._currentJsonData).executeLocal(new ej.Query().where(ej.Predicate["or"](predicates)));
                cardsInfo["cardsCount"] = cards.length;
                if (kObj._selectedCardData.length > 0) {
                    index = $.inArray(cellIndex, kObj.selectedRowCellIndexes[0].cellIndex);
                    if (!ej.isNullOrUndefined(index) && index >= 0)
                        selIndexes.push(kObj.selectedRowCellIndexes[0].cardIndex[index]);
                }
                cardsInfo["selectedCardsIndexes"] = selIndexes;
                cardsInfo["selectedCardsData"] = new ej.DataManager(proxy._selectedCardData).executeLocal(new ej.Query().where(ej.Predicate["or"](predicates)));
                cardsInfo["selectedCards"] = selCards;
                return cardsInfo;
            };
        }
        if ($target.hasClass('e-rowcell')) {
            args["rowIndex"] = kObj.getIndexByRow(row);
            args["cellIndex"] = cellIndex;
            kObj._trigger('cellClick', args);
        }
        if (hTrgt.hasClass('e-stackedHeaderCell')) {
            args["text"] = $target.text();
            var sCards = [], selCards, colIndexes = [], selColIndexes = [], cardIndexes = [], stRows, data = [], selData = [];
            stRows = kObj.element.find('.e-stackedHeaderRow');
            args["data"] = function () {
                var columns, count = 0, index;
                var stackedColumns = kObj.model.stackedHeaderRows[stRows.index(hTrgt.parents('.e-stackedHeaderRow'))].stackedHeaderColumns;
                columns = stackedColumns[hTrgt.index()].column;
                columns = columns.split(',');
                for (var i = 0; i < columns.length; i++) {
                    var key = new ej.DataManager(kObj.model.columns).executeLocal(new ej.Query().where('headerText', ej.FilterOperators.equal, columns[i])), cell, cards, selectedCards;
                    cell = $("td[ej-mappingkey~='" + key[0].key + "']");
                    cards = cell.find('.e-kanbancard');
                    sCards.push(cards);
                    data.push(new ej.DataManager(kObj._currentJsonData).executeLocal(new ej.Query().where(kObj.model.keyField, ej.FilterOperators.equal, key[0].key)));
                    cellIndex = cells.index($("td[ej-mappingkey~='" + key[0].key + "']")[0]);
                    if (kObj._selectedCardData.length > 0) {
                        index = $.inArray(cellIndex, kObj.selectedRowCellIndexes[0].cellIndex);
                        if (!ej.isNullOrUndefined(index) && index >= 0) {
                            selectedCards = cell.find('.e-cardselection');
                            selCards.push(selectedCards);
                            selData.push(new ej.DataManager(kObj._selectedCardData).executeLocal(new ej.Query().where(kObj.model.keyField, ej.FilterOperators.equal, key[0].key)));
                            if (selectedCards.length > 0) {
                                selColIndexes.push(cellIndex);
                                cardIndexes.push(kObj.selectedRowCellIndexes[0].cardIndex[index]);
                            }
                        }
                    }
                    count = count + cards.length;
                    colIndexes.push(cellIndex);
                }
                var detials = {};
                detials["count"] = count;
                detials["cards"] = sCards;
                detials["cardsData"] = data;
                detials["cellIndexes"] = colIndexes;
                detials["selectedCellCardIndexes"] = { cellIndex: selColIndexes, cardIndex: cardIndexes };
                detials["selectedCards"] = selCards;
                detials["selectedCardsData"] = selData;
                return detials;
            };
            kObj._trigger('headerClick', args);
        }
        else if (hTrgt.hasClass('e-headercell')) {
            args["text "] = hTrgt.text();
            args["cellIndex"] = headerIndex;
            args["columnData"] = kObj.model.columns[headerIndex];
            kObj._trigger('headerClick', args);
        }
    };
    InternalCommon.prototype._toggleCardByTarget = function ($target) {
        var kObj = this.kanbanObj;
        $target = $target.hasClass("e-expandcollapse") ? $target.find("div:first") : $target;
        if (!($target.hasClass("e-cardexpand") || $target.hasClass("e-cardcollapse")))
            return;
        var $header = $target.closest('div.e-cardheader'), $cardContent = $header.next(), primarykey = $header.find(".e-primarykey").text(), card = $($target).closest(".e-kanbancard"), cardId = card.attr('id');
        if ($target.hasClass("e-cardexpand")) {
            $target.removeClass("e-cardexpand").addClass("e-cardcollapse");
            card.addClass("e-collapsedcard");
            $header.append($cardContent.find(".e-text").clone());
            $cardContent.hide();
            if ($.inArray(cardId, kObj._collapsedCards) == -1)
                kObj._collapsedCards.push(cardId);
            var bottomTriangle = $cardContent.find('.e-bottom-triangle').clone();
            $header.append(bottomTriangle);
        }
        else {
            $target.removeClass("e-cardcollapse").addClass("e-cardexpand");
            card.removeClass("e-collapsedcard");
            $header.find(".e-text,.e-bottom-triangle").remove();
            $cardContent.show();
            var index = $.inArray(cardId, kObj._collapsedCards);
            if (index != -1)
                kObj._collapsedCards.splice(index, 1);
        }
        if (kObj.model.allowScrolling) {
            if (kObj.getScrollObject().isVScroll() || kObj.getScrollObject().isHScroll())
                kObj.getScrollObject().refresh();
            if (!kObj.getScrollObject().isVScroll())
                kObj.element.find(".e-kanbanheader").removeClass("e-scrollcss").children().removeClass("e-hscrollcss");
            else
                kObj.element.find(".e-kanbanheader").addClass("e-scrollcss").children().addClass("e-hscrollcss");
        }
        if (kObj.element.hasClass('e-responsive')) {
            var scroller = $target.parents('.e-cell-scrollcontent');
            if (scroller.length > 0)
                scroller.data('ejScroller').refresh();
        }
    };
    InternalCommon.prototype._priorityColData = function (colData, cData) {
        var cardIndex, pKey = this.kanbanObj.model.fields.primaryKey, prkey = this.kanbanObj.model.fields.priority;
        cardIndex = $.map(colData, function (obj, index) {
            if (obj[pKey] == cData[pKey])
                return index;
        });
        if (!ej.isNullOrUndefined(cardIndex[0]))
            colData.splice(cardIndex, 1);
        var index = cData[prkey] - 1;
        if (!ej.isNullOrUndefined(colData[index - 1])) {
            if (colData[index - 1][prkey] == cData[prkey])
                --index;
        }
        colData.splice(index, 0, cData);
        colData.sort(function (val1, val2) {
            return val1[prkey] - val2[prkey];
        });
        return colData;
    };
    InternalCommon.prototype._getPriorityData = function (priorityData, data) {
        var index, pKey = this.kanbanObj.model.fields.primaryKey;
        index = $.map(priorityData, function (obj, index) {
            if (obj[pKey] == data[pKey])
                return index;
        });
        if (!ej.isNullOrUndefined(index[0]))
            priorityData[index][this.kanbanObj.model.fields.priority] = data[this.kanbanObj.model.fields.priority];
        else
            priorityData.push(data);
        return priorityData;
    };
    InternalCommon.prototype._preventCardMove = function (currentcardkey, targetcardkey) {
        var kObj = this.kanbanObj, targetkey = typeof (targetcardkey) == "object" ? targetcardkey : targetcardkey.split(",");
        for (var k = 0; k < targetkey.length; k++) {
            if (currentcardkey == targetkey[k])
                return true;
            var AllowedTransitionsdrag = true, flow = kObj.model.workflows;
            if (!ej.isNullOrUndefined(flow) && flow.length > 0) {
                for (var i = 0; i < flow.length; i++) {
                    if (flow[i].key == currentcardkey && !ej.isNullOrUndefined(flow[i].allowedTransitions)) {
                        var array = typeof (flow[i].allowedTransitions) == "object" ? flow[i].allowedTransitions : flow[i].allowedTransitions.split(",");
                        if (array.length == 1 && array[0].length == 0)
                            return true;
                        for (var j = 0; j < array.length; j++) {
                            if (targetkey[k] == array[j]) {
                                return true;
                            }
                            else {
                                AllowedTransitionsdrag = false;
                            }
                        }
                    }
                }
            }
        }
        if (AllowedTransitionsdrag)
            return true;
        else
            return false;
    };
    InternalCommon.prototype._updateKbnPriority = function (priorityData, cData) {
        var kObj = this.kanbanObj, currData = kObj._currentJsonData, colData, oldData, primary = kObj.model.fields.primaryKey, prkey = kObj.model.fields.priority, slKey = kObj.model.fields.swimlaneKey;
        if ((!ej.isNullOrUndefined(kObj._filterToolBar) && kObj._filterToolBar.find('.e-select').length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))
            currData = kObj._initialData;
        oldData = this._getKanbanCardData(currData, cData[primary])[0];
        cData[prkey] = parseInt(cData[prkey]);
        if (ej.isNullOrUndefined(slKey))
            colData = new ej.DataManager(currData).executeLocal(new ej.Query().where(kObj.model.keyField, ej.FilterOperators.equal, cData[kObj.model.keyField]));
        else
            colData = new ej.DataManager(currData).executeLocal(new ej.Query().where(kObj.model.keyField, ej.FilterOperators.equal, cData[kObj.model.keyField]).where(slKey, ej.FilterOperators.equal, cData[slKey]));
        colData = colData.slice();
        var proxy = kObj, pkey = cData[primary];
        colData.sort(function (val1, val2) {
            return val1[prkey] - val2[prkey];
        });
        if (kObj._bulkPriorityData.length > 0) {
            for (var i = 0; i < colData.length; i++) {
                var index = $.map(kObj._bulkPriorityData, function (obj, index) {
                    if (obj[primary] == colData[i][primary])
                        return index;
                });
                if (!ej.isNullOrUndefined(index[0]))
                    colData[i][kObj.model.fields.priority] = kObj._bulkPriorityData[index][kObj.model.fields.priority];
            }
            colData.sort(function (val1, val2) {
                return val1[prkey] - val2[prkey];
            });
        }
        if (!ej.isNullOrUndefined(slKey)) {
            colData = this._priorityColData(colData, cData);
        }
        else
            colData = this._priorityColData(colData, cData);
        var init = cData[prkey] - 1;
        if (init != $.inArray(cData, colData))
            init = $.inArray(cData, colData);
        if (cData[prkey] - 1 > colData.length)
            init = colData.length - 1;
        if (init < 0)
            init = 0;
        for (var i = init; i < colData.length; i++) {
            if (!ej.isNullOrUndefined(colData[i])) {
                if (i < colData.length - 1 && !ej.isNullOrUndefined(colData[i + 1]) && colData[i][prkey] >= colData[i + 1][prkey]) {
                    colData[i + 1][prkey] = colData[i][prkey] + 1;
                    priorityData = this._getPriorityData(priorityData, colData[i + 1]);
                }
                else if (i == colData.length - 1 && !ej.isNullOrUndefined(colData[i - 1])) {
                    if (colData[i][prkey] < colData[i - 1][prkey]) {
                        colData[i][prkey] = colData[i - 1][prkey] + 1;
                        priorityData = this._getPriorityData(priorityData, colData[i]);
                    }
                }
            }
        }
        for (var i = init; i >= 0; i--) {
            if (!ej.isNullOrUndefined(colData[i])) {
                if (!ej.isNullOrUndefined(colData[i - 1])) {
                    if (i > 0 && colData[i - 1][prkey] >= colData[i][prkey]) {
                        colData[i - 1][prkey] = colData[i][prkey] - 1;
                        priorityData = this._getPriorityData(priorityData, colData[i - 1]);
                    }
                }
                else if (i == 0 && !ej.isNullOrUndefined(colData[i + 1])) {
                    if (colData[i][prkey] > colData[i + 1][prkey]) {
                        colData[i][prkey] = colData[i + 1][prkey] - 1;
                        priorityData = this._getPriorityData(priorityData, colData[i]);
                    }
                }
            }
        }
        return priorityData;
    };
    InternalCommon.prototype._kbnBulkUpdate = function (addData, deleteData, editdata) {
        var kObj = this.kanbanObj, bulkUpdate;
        if (kObj._dataManager instanceof ej.DataManager && !kObj._dataManager.dataSource.offline || (kObj._dataSource().adaptor instanceof ej.remoteSaveAdaptor)) {
            var bulkChanges;
            bulkChanges = {
                added: addData,
                deleted: deleteData,
                changed: editdata
            };
            $("#" + kObj._id).data("ejWaitingPopup").show();
            (bulkUpdate = kObj._dataManager.saveChanges(bulkChanges, kObj.model.fields.primaryKey, kObj.model.query._fromTable));
            if ($.isFunction(bulkUpdate.promise)) {
                bulkUpdate.done(function (e) {
                    kObj.KanbanCommon._processBindings(kObj._saveArgs);
                    kObj._cModifiedData = null;
                    kObj._cAddedRecord = null;
                    kObj._isAddNewClick = false;
                    kObj._currentData = null;
                    kObj._newCard = null;
                    kObj._saveArgs = null;
                    kObj._cardEditClick = null;
                    kObj._dblArgs = null;
                    kObj._cDeleteData = null;
                    $("#" + kObj._id).data("ejWaitingPopup").hide();
                });
                bulkUpdate.fail(function (e) {
                    var argsKanban;
                    if (ej.isNullOrUndefined(kObj._saveArgs))
                        argsKanban = e;
                    else {
                        kObj._saveArgs.error = (e && e.error) ? e.error : e;
                        argsKanban = kObj._saveArgs;
                    }
                    kObj._renderAllCard();
                    kObj._enableDragandScroll();
                    kObj._cModifiedData = null;
                    kObj._cAddedRecord = null;
                    kObj._isAddNewClick = false;
                    kObj._currentData = null;
                    kObj._newCard = null;
                    kObj._saveArgs = null;
                    kObj._cardEditClick = null;
                    kObj._dblArgs = null;
                    kObj._cDeleteData = null;
                    kObj._trigger("actionFailure", argsKanban);
                    $("#" + kObj._id).data("ejWaitingPopup").hide();
                });
            }
        }
        else
            kObj.KanbanCommon._processBindings(kObj._saveArgs);
        if (bulkUpdate == undefined || !$.isFunction(bulkUpdate.promise)) {
            kObj._cModifiedData = null;
            kObj._cAddedRecord = null;
            kObj._isAddNewClick = false;
            kObj._currentData = null;
            kObj._newCard = null;
            kObj._saveArgs = null;
            kObj._cardEditClick = null;
            kObj._dblArgs = null;
            kObj._cDeleteData = null;
        }
    };
    InternalCommon.prototype._checkSkipAction = function (args) {
        switch (args.requestType) {
            case "save":
            case "delete":
                return true;
        }
        return false;
    };
    InternalCommon.prototype._processBindings = function (args) {
        var kObj = this.kanbanObj;
        args.primaryKey = kObj.model.fields.primaryKey;
        if (!this._checkSkipAction(args) && kObj._trigger("actionBegin", args))
            return true;
        kObj._ensureDataSource(args);
        kObj._editForm = kObj.element.find(".kanbanform");
        if (!(args.requestType == "beginedit") && !(args.requestType == "drop") && kObj._editForm.length != 0) {
            if (kObj._editForm.length > 1 && args.requestType == "save" && args.action == "edit")
                kObj._editForm = $(kObj._editForm[0]);
            $(kObj._editForm).find("select.e-dropdownlist").ejDropDownList("destroy");
            $(kObj._editForm).find("textarea.e-rte").ejRTE("destroy");
            $(kObj._editForm).find(".e-datepicker").ejDatePicker("destroy");
            $(kObj._editForm).find(".e-datetimepicker").ejDateTimePicker("destroy");
            $(kObj._editForm).find(".e-numerictextbox").ejNumericTextbox("destroy");
            $(kObj._editForm).addClass('e-formdestroy');
        }
        if (args && args.requestType == "delete")
            args.div.remove();
        if (args.requestType == "drop")
            kObj._templateRefresh = true;
        if (kObj._dataSource() instanceof ej.DataManager && args.requestType != "beginedit" && args.requestType != "cancel" && args.requestType != "add") {
            kObj.element.ejWaitingPopup("show");
            var queryPromise = kObj._queryPromise = kObj._dataSource().executeQuery(kObj.model.query);
            var proxy = kObj;
            if (proxy._dataSource().ready) {
                proxy._dataSource().ready.done(function () {
                    proxy.KanbanCommon._processDataRequest(proxy, args, queryPromise);
                });
            }
            else {
                proxy.KanbanCommon._processDataRequest(proxy, args, queryPromise);
            }
        }
        else
            kObj.sendDataRenderingRequest(args);
    };
    InternalCommon.prototype._processDataRequest = function (proxy, args, queryPromise) {
        queryPromise.done(ej.proxy(function (e) {
            proxy.element.ejWaitingPopup("hide");
            proxy._currentJsonData = proxy.currentViewData = e.result == null ? [] : e.result;
            proxy.KanbanCommon._processData(e, args);
        }));
        queryPromise.fail(ej.proxy(function (e) {
            proxy.element.ejWaitingPopup("hide");
            args.error = e.error;
            e = [];
            proxy.currentViewData = [];
            proxy.KanbanCommon._processData(e, args);
            proxy._trigger("actionFailure", args);
        }));
    };
    InternalCommon.prototype._processData = function (e, args) {
        var kObj = this.kanbanObj;
        if (!ej.isNullOrUndefined(kObj.model.filterSettings))
            if ((args.requestType == "filtering" || (kObj.model.filterSettings.length > 0 && args.requestType == "refresh")))
                kObj._filteredRecordsCount = e.count;
        kObj.sendDataRenderingRequest(args);
    };
    InternalCommon.prototype._moveCurrentCard = function (index, key, e) {
        var cellindex, rowCellIndex, cards, cardIndex, cellcards, tdCard, column, cellcardsCount, tdCellIncr, tdCellDecr, colCellSel, kObj = this.kanbanObj;
        rowCellIndex = kObj.selectedRowCellIndexes[0];
        var rowcardIndex = rowCellIndex.cardIndex;
        cellindex = rowCellIndex.cellIndex[rowCellIndex.cellIndex.length - 1];
        if (key == "down" || key == "up") {
            colCellSel = $(kObj._columnRows[index]).find("td.e-rowcell").eq(cellindex);
            cellcards = colCellSel.find(".e-kanbancard");
            cardIndex = $(cellcards).index(colCellSel.find(".e-cardselection"));
            cellcardsCount = cellcards.length;
            if (key == "down") {
                if (ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
                    if (kObj.model.selectionType == "multiple")
                        cardIndex = rowcardIndex[rowCellIndex.cellIndex.length - 1][rowcardIndex[rowCellIndex.cellIndex.length - 1].length - 1];
                    else
                        cardIndex = rowcardIndex[rowCellIndex.cellIndex.length - 1];
                else if ((e.shiftKey || e.ctrlKey) && kObj.model.selectionType == "multiple")
                    cardIndex = rowcardIndex[rowCellIndex.cellIndex.length - 1][rowcardIndex[rowCellIndex.cellIndex.length - 1].length - 1];
                if (cardIndex == (cellcardsCount - 1) || cellcardsCount == 0)
                    if (index == kObj._columnRows.length - 1)
                        return;
                    else if ((!e.shiftKey && !e.ctrlKey) || (kObj.model.selectionType == "single"))
                        this._moveCurrentCard(index + 1, key, e);
                    else
                        return;
                else if (cellcards.eq(cardIndex + 1).hasClass("e-cardselection"))
                    kObj.KanbanSelection._cardSelection([[index, [cellindex], [cardIndex]]], $(cellcards[cardIndex]), e);
                else
                    kObj.KanbanSelection._cardSelection([[index, [cellindex], [cardIndex + 1]]], $(cellcards[cardIndex + 1]), e);
            }
            else if (key == "up") {
                if (ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
                    if (kObj.model.selectionType == "multiple")
                        cardIndex = rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1][rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1].length - 1];
                    else
                        cardIndex = rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1];
                else if ((e.shiftKey || e.ctrlKey) && kObj.model.selectionType == "multiple")
                    cardIndex = rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1][rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1].length - 1];
                if (cellcardsCount == 0 || cardIndex == 0)
                    if (index == 0)
                        return;
                    else if ((!e.shiftKey && !e.ctrlKey) || (kObj.model.selectionType == "single"))
                        this._moveCurrentCard(index - 1, key, e);
                    else
                        return;
                else if (cellcards.eq(cardIndex - 1).hasClass("e-cardselection"))
                    kObj.KanbanSelection._cardSelection([[index, [cellindex], [cardIndex]]], $(cellcards[cardIndex]), e);
                else {
                    if (cardIndex != -1)
                        kObj.KanbanSelection._cardSelection([[index, [cellindex], [cardIndex - 1]]], $(cellcards[cardIndex - 1]), e);
                    else
                        kObj.KanbanSelection._cardSelection([[index, [cellindex], [cellcardsCount - 1]]], $(cellcards[cellcardsCount - 1]), e);
                }
            }
            if ((!e.shiftKey && !e.ctrlKey) || ("single"))
                if (kObj.element.find(".e-cardselection").closest("tr.e-columnrow:visible").length == 0)
                    kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slcollapse"));
        }
        else {
            var card, cardselec, switchcard;
            column = $(kObj._columnRows[rowCellIndex.rowIndex]);
            tdCard = column.find("td.e-rowcell");
            cellcards = tdCard.eq(index).find(".e-kanbancard");
            cards = tdCard.eq(index).find(".e-kanbancard");
            tdCellIncr = tdCard.eq(index + 1);
            tdCellDecr = tdCard.eq(index - 1);
            card = kObj.element.find(".e-kanbancard");
            cardselec = kObj.element.find(".e-cardselection");
            if ((!tdCellDecr.is(":visible") || !tdCellIncr.is(":visible")) && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
                if (kObj.element.find(".e-cardselection").closest("tr.e-columnrow:visible").length == 0)
                    kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slcollapse"));
            if ((e.shiftKey || e.ctrlKey) && kObj.model.selectionType == "multiple")
                cardIndex = rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1][rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1].length - 1];
            else if (kObj.model.selectionType == "single")
                cardIndex = rowCellIndex.cardIndex[0];
            else
                cardIndex = rowCellIndex.cardIndex[0][0];
            if (key == "right") {
                switchcard = card.eq(card.index(cardselec) + 1);
                if (index == tdCard.length - 1) {
                    if (switchcard.length > 0 && ((!e.shiftKey && !e.ctrlKey) || (kObj.model.selectionType == "single")) && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
                        kObj.KanbanSelection._cardSelection([[kObj._columnRows.index(switchcard.closest("tr.e-columnrow")), [switchcard.closest("tr.e-columnrow").find("td.e-rowcell").index(switchcard.closest("td.e-rowcell"))], [0]]], switchcard, e);
                        if (kObj.element.find(".e-cardselection").closest("tr:visible").length == 0)
                            kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slcollapse"));
                    }
                    return;
                }
                if (tdCellIncr.find(".e-kanbancard:visible").length > 0) {
                    cards = tdCellIncr.find(".e-kanbancard");
                    if (cards.eq(cardIndex).length > 0)
                        kObj.KanbanSelection._cardSelection([[rowCellIndex.rowIndex, [index + 1], [cardIndex]]], $(cards[cardIndex]), e);
                    else
                        kObj.KanbanSelection._cardSelection([[rowCellIndex.rowIndex, [index + 1], [cards.length - 1]]], $(cards[cards.length - 1]), e);
                    if (((!e.shiftKey && !e.ctrlKey) || (kObj.model.selectionType == "single")) && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
                        if (kObj.element.find(".e-cardselection").closest("tr.e-columnrow:visible").length == 0)
                            kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slcollapse"));
                }
                else
                    this._moveCurrentCard(index + 1, key, e);
            }
            else if (key == "left") {
                if (card.index(cardselec) != 0)
                    switchcard = card.eq(card.index(cardselec) - 1);
                if (index == 0) {
                    if ((!e.shiftKey && !e.ctrlKey) && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
                        kObj.KanbanSwimlane.toggle($(column).prev().find(".e-slexpand"));
                        if (ej.isNullOrUndefined(switchcard))
                            return;
                        if (switchcard.length > 0 && (!e.shiftKey && !e.ctrlKey) || (kObj.model.selectionType == "single")) {
                            kObj.KanbanSelection._cardSelection([[kObj._columnRows.index(switchcard.closest("tr.e-columnrow")), [switchcard.closest("tr.e-columnrow").find("td.e-rowcell").index(switchcard.closest("td.e-rowcell"))], [0]]], switchcard, e);
                            if (kObj.element.find(".e-cardselection").closest("tr.e-columnrow:visible").length == 0)
                                kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slcollapse"));
                        }
                    }
                    return;
                }
                if (tdCellDecr.find(".e-kanbancard:visible").length > 0) {
                    cards = tdCellDecr.find(".e-kanbancard");
                    if (cards.eq(cardIndex).length > 0)
                        kObj.KanbanSelection._cardSelection([[rowCellIndex.rowIndex, [index - 1], [cardIndex]]], $(cards[cardIndex]), e);
                    else
                        kObj.KanbanSelection._cardSelection([[rowCellIndex.rowIndex, [index - 1], [cards.length - 1]]], $(cards[cards.length - 1]), e);
                    if (((!e.shiftKey && !e.ctrlKey) || (kObj.model.selectionType == "single")) && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
                        if (kObj.element.find(".e-cardselection").closest("tr.e-columnrow:visible").length == 0)
                            kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slexpand"));
                }
                else
                    this._moveCurrentCard(index - 1, key, e);
            }
        }
    };
    InternalCommon.prototype._kanbanKeyPressed = function (action, target, e, event) {
        var selectedcard, kanbancard, rowCellIndex, cellIndex, $target = $(target), returnValue = false, kObj = this.kanbanObj;
        selectedcard = kObj.element.find(".e-cardselection");
        kanbancard = kObj.element.find(".e-kanbancard:visible");
        if (e.code == 13 && target.tagName == 'INPUT' && $target.closest("#" + kObj._id + "_toolbarItems_search").length)
            action = "searchRequest";
        rowCellIndex = kObj.selectedRowCellIndexes[0];
        var swimlane = !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey);
        switch (action) {
            case "editCard":
                if (selectedcard.length > 0 && kObj.model.editSettings.allowEditing) {
                    cellIndex = rowCellIndex.cellIndex;
                    selectedcard = kObj._columnRows.eq(rowCellIndex.rowIndex).find("td.e-rowcell").eq(cellIndex[cellIndex.length - 1]).find(".e-kanbancard").eq(rowCellIndex.cardIndex[cellIndex.length - 1]);
                    kObj.KanbanEdit.startEdit(selectedcard);
                }
                break;
            case "insertCard":
                if (kObj.model.editSettings.allowAdding)
                    kObj.KanbanEdit.addCard();
                break;
            case "swimlaneExpandAll":
                if (kObj.KanbanSwimlane)
                    kObj.KanbanSwimlane.expandAll();
                break;
            case "swimlaneCollapseAll":
                if (kObj.KanbanSwimlane)
                    kObj.KanbanSwimlane.collapseAll();
                break;
            case "downArrow":
                if (selectedcard.length > 0 && (document.activeElement["id"] == kObj._id))
                    this._moveCurrentCard(rowCellIndex.rowIndex, "down", e);
                break;
            case "upArrow":
                if (selectedcard.length > 0 && (document.activeElement["id"] == kObj._id)) {
                    this._moveCurrentCard(rowCellIndex.rowIndex, "up", e);
                }
                break;
            case "leftArrow":
                if (selectedcard.length > 0 && (document.activeElement["id"] == kObj._id))
                    this._moveCurrentCard(rowCellIndex.cellIndex[rowCellIndex.cellIndex.length - 1], "left", e);
                if (kObj.model.isResponsive && kObj.element.hasClass('e-responsive') && kObj._kbnTransitionEnd)
                    kObj.KanbanAdaptive._kbnRightSwipe();
                break;
            case "rightArrow":
                if (selectedcard.length > 0 && (document.activeElement["id"] == kObj._id))
                    this._moveCurrentCard(rowCellIndex.cellIndex[rowCellIndex.cellIndex.length - 1], "right", e);
                if (kObj.model.isResponsive && kObj.element.hasClass('e-responsive') && kObj._kbnTransitionEnd)
                    kObj.KanbanAdaptive._kbnLeftSwipe();
                break;
            case "multiSelectionByDownArrow":
                e.ctrlKey = true;
                if (selectedcard.length > 0)
                    this._moveCurrentCard(rowCellIndex.rowIndex, "down", e);
                break;
            case "multiSelectionByUpArrow":
                e.ctrlKey = true;
                if (selectedcard.length > 0)
                    this._moveCurrentCard(rowCellIndex.rowIndex, "up", e);
                break;
            case "multiSelectionByRightArrow":
                e.shiftKey = true;
                if (selectedcard.length > 0)
                    this._moveCurrentCard(rowCellIndex.cellIndex[rowCellIndex.cellIndex.length - 1], "right", e);
                break;
            case "multiSelectionByLeftArrow":
                e.shiftKey = true;
                if (selectedcard.length > 0)
                    this._moveCurrentCard(rowCellIndex.cellIndex[rowCellIndex.cellIndex.length - 1], "left", e);
                break;
            case "firstCardSelection":
                if (kObj.model.allowSelection) {
                    kObj.KanbanSelection.clear();
                    kanbancard.eq(0).addClass("e-cardselection");
                    selectedcard = kObj.element.find(".e-cardselection");
                    var cardIndex = $(kObj._columnRows).find(".e-cardselection").index();
                    var selectionIndex = $(kObj._columnRows).find(".e-cardselection").parent().children().eq(0).hasClass("e-limits") ? cardIndex - 1 : cardIndex;
                    if (kObj.model.selectionType == "multiple")
                        kObj.selectedRowCellIndexes.push({ cardIndex: [[selectionIndex]], cellIndex: [selectedcard.parent().index()], rowIndex: $(kObj._columnRows).index(selectedcard.parents(".e-columnrow")) });
                    else
                        kObj.selectedRowCellIndexes.push({ cardIndex: [selectionIndex], cellIndex: [selectedcard.parent().index()], rowIndex: $(kObj._columnRows).index(selectedcard.parents(".e-columnrow")) });
                }
                break;
            case "lastCardSelection":
                if (kObj.model.allowSelection) {
                    kObj.KanbanSelection.clear();
                    kanbancard.eq(kanbancard.length - 1).addClass("e-cardselection");
                    selectedcard = kObj.element.find(".e-cardselection");
                    selectedcard = kObj.element.find(".e-cardselection");
                    var cardIndex = $(kObj._columnRows).find(".e-cardselection").index();
                    var selectionIndex = $(kObj._columnRows).find(".e-cardselection").parent().children().eq(0).hasClass("e-limits") ? cardIndex - 1 : cardIndex;
                    if (kObj.model.selectionType == "multiple")
                        kObj.selectedRowCellIndexes.push({ cardIndex: [[selectionIndex]], cellIndex: [selectedcard.parent().index()], rowIndex: $(kObj._columnRows).index(selectedcard.parents(".e-columnrow")) });
                    else
                        kObj.selectedRowCellIndexes.push({ cardIndex: [selectionIndex], cellIndex: [selectedcard.parent().index()], rowIndex: $(kObj._columnRows).index(selectedcard.parents(".e-columnrow")) });
                }
                break;
            case "cancelRequest":
                if ($("#" + kObj._id + "_dialogEdit:visible").length > 0)
                    kObj.KanbanEdit.cancelEdit();
                else if (selectedcard.length > 0)
                    kObj.KanbanSelection.clear();
                break;
            case "searchRequest":
                kObj.KanbanFilter.searchCards($target.val());
                break;
            case "saveRequest":
                if ($("#" + kObj._id + "_dialogEdit:visible").length > 0)
                    kObj.KanbanEdit.endEdit();
                break;
            case "deleteCard":
                if (selectedcard.length > 0 && $("#" + kObj._id + "_dialogEdit:visible").length <= 0 && !ej.isNullOrUndefined(kObj.model.fields.primaryKey))
                    kObj.KanbanEdit.deleteCard(selectedcard.attr("id"));
                break;
            case "selectedSwimlaneExpand":
                if (selectedcard.length > 0 && swimlane)
                    if (!selectedcard.is(":visible"))
                        kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slexpandcollapse"));
                break;
            case "selectedSwimlaneCollapse":
                if (selectedcard.length > 0 && swimlane)
                    if (selectedcard.is(":visible"))
                        kObj.KanbanSwimlane.toggle($(kObj._columnRows[kObj.selectedRowCellIndexes[0].rowIndex]).prev().find(".e-slexpandcollapse"));
                break;
            case "selectedColumnCollapse":
                if (selectedcard.length > 0)
                    this._toggleField(kObj.model.columns[kObj.selectedRowCellIndexes[0].cellIndex[0]].headerText);
                break;
            case "selectedColumnExpand":
                if (kObj._collapsedColumns.length != 0)
                    this._toggleField(kObj._collapsedColumns[kObj._collapsedColumns.length - 1]);
                break;
            case "focus":
                kObj.element.find(".e-cardselection").focus();
                break;
            default:
                returnValue = true;
        }
        return returnValue;
    };
    InternalCommon.prototype._createStackedRow = function (stackedHeaderRow) {
        var $tr = ej.buildTag('tr.e-columnheader e-stackedHeaderRow', "", {}, {}), sHeader = [], kObj = this.kanbanObj;
        for (var s = 0; s < kObj.model.columns.length; s++) {
            var column = kObj.model.columns[s];
            if (column.visible != false) {
                var headerText = '';
                var sColumn = stackedHeaderRow.stackedHeaderColumns;
                for (var cl = 0; cl < sColumn.length; cl++) {
                    if (sColumn[cl].column.indexOf(column.headerText) != -1) {
                        headerText = sColumn[cl].headerText;
                    }
                }
                sHeader.push(headerText);
            }
        }
        var colsPanList = [], css = "";
        for (var h = 0; h < sHeader.length; h++) {
            var colSpan = 1;
            for (var j = h + 1; j < sHeader.length; j++) {
                if ((sHeader[h] != "") && (sHeader[j] != "") && sHeader[h] == sHeader[j]) {
                    colSpan++;
                }
                else
                    break;
            }
            colsPanList.push({
                sapnCount: colSpan,
                headerText: sHeader[h],
                css: (sHeader[h] != "") ? css : "e-sheader"
            });
            h += colSpan - 1;
            css = "";
        }
        for (var c = 0; c < colsPanList.length; c++) {
            var $div = ej.buildTag('div' + '', colsPanList[c].headerText, {}, {});
            var $th = ej.buildTag('th.e-headercell e-stackedHeaderCell ' + colsPanList[c].css + '', "", {}, { 'colspan': colsPanList[c].sapnCount }).append($div);
            $tr.append($th);
        }
        return $tr;
    };
    InternalCommon.prototype._refreshStackedHeader = function () {
        var kObj = this.kanbanObj, stackedRows = kObj.model.stackedHeaderRows, stackHeaderRow = kObj.element.find(".e-stackedHeaderRow");
        for (var i = 0; i < stackedRows.length; i++) {
            var stackedTr = this._createStackedRow(stackedRows[i]);
            if (stackHeaderRow.length > 0)
                stackHeaderRow.remove();
            $(kObj.getHeaderTable().find(".e-columnheader").before(stackedTr));
        }
        kObj.model.allowScrolling && kObj.KanbanScroll._refreshScroller({ requestType: "refresh" });
    };
    InternalCommon.prototype._stackedHeadervisible = function () {
        var stackHeadercell = this.kanbanObj.element.find(".e-columnheader .e-stackedHeaderCell ");
        for (var i = 0; i < stackHeadercell.length; i++)
            if (stackHeadercell[i].offsetWidth < stackHeadercell[i].scrollWidth)
                stackHeadercell.eq(i).find("div").addClass("e-hide");
    };
    InternalCommon.prototype._kanbanUpdateCard = function (primaryKey, data) {
        var kbnCurrentData, kObj = this.kanbanObj, args = kObj._saveArgs;
        var swimlaneKey = kObj.model.fields.swimlaneKey, unassignedGroup = kObj.model.swimlaneSettings.unassignedGroup;
        if (!ej.isNullOrUndefined(swimlaneKey) && unassignedGroup.enable && unassignedGroup.keys.length > 0) {
            if (ej.isNullOrUndefined(data.length))
                data = kObj._checkKbnUnassigned(data);
            else {
                for (var i = 0; i < data.length; i++)
                    data[i] = kObj._checkKbnUnassigned(data[i]);
            }
        }
        if (ej.isNullOrUndefined(data.length) && $.inArray(data[kObj.model.keyField], kObj._keyValue) == -1)
            return;
        if (ej.isNullOrUndefined(args)) {
            kObj._saveArgs = args = { data: data, requestType: "save", action: "edit", primaryKeyValue: primaryKey };
            kObj._cModifiedData = data;
        }
        if (ej.isNullOrUndefined(args) || (!ej.isNullOrUndefined(args) && args.requestType != "drop")) {
            if (!(kObj._dataSource() instanceof ej.DataManager))
                kbnCurrentData = kObj._dataSource();
            else
                kbnCurrentData = kObj._dataSource().dataSource.json;
            if (kbnCurrentData.length == 0 && kObj._currentJsonData.length > 0)
                kbnCurrentData = kObj._currentJsonData;
            if (kObj.model.fields.priority) {
                var priorityData = [], currentData;
                if ($.isPlainObject(data)) {
                    priorityData.push(data);
                    if (ej.isNullOrUndefined(data[kObj.model.fields.priority])) {
                        currentData = new ej.DataManager(kbnCurrentData).executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, data[kObj.model.fields.primaryKey]));
                        if (currentData.length > 0)
                            data[kObj.model.fields.priority] = currentData[0][kObj.model.fields.priority];
                        else {
                            var colData = new ej.DataManager(kbnCurrentData).executeLocal(new ej.Query().where(kObj.model.keyField, ej.FilterOperators.equal, data[kObj.model.keyField]));
                            data[kObj.model.fields.priority] = colData[colData.length - 1][kObj.model.fields.priority] + 1;
                        }
                    }
                    data = kObj.KanbanCommon._updateKbnPriority(priorityData, data);
                }
                else {
                    var cData, fData, primary = kObj.model.fields.primaryKey;
                    for (var i = 0; i < data.length; i++) {
                        priorityData = $.extend(true, [], data);
                        if (ej.isNullOrUndefined(data[i][kObj.model.fields.priority])) {
                            currentData = new ej.DataManager(kbnCurrentData).executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, data[i][kObj.model.fields.primaryKey]));
                            if (currentData.length > 0)
                                data[i][kObj.model.fields.priority] = currentData[0][kObj.model.fields.priority];
                            else {
                                var colData = new ej.DataManager(kbnCurrentData).executeLocal(new ej.Query().where(kObj.model.keyField, ej.FilterOperators.equal, data[i][kObj.model.keyField]));
                                data[i][kObj.model.fields.priority] = colData[colData.length - 1][kObj.model.fields.priority] + 1;
                            }
                        }
                        cData = data[i];
                        fData = kObj.KanbanCommon._updateKbnPriority(priorityData, cData);
                        for (var j = 0; j < fData.length; j++) {
                            if (kObj._bulkPriorityData.length > 0) {
                                var cardIndex = $.map(kObj._bulkPriorityData, function (obj, index) {
                                    if (obj[primary] == fData[j][primary])
                                        return index;
                                });
                                if (!ej.isNullOrUndefined(cardIndex[0])) {
                                    kObj._bulkPriorityData.splice(cardIndex, 1);
                                    kObj._bulkPriorityData.splice(cardIndex, 0, fData[j]);
                                }
                                else
                                    kObj._bulkPriorityData.push(fData[j]);
                            }
                            else
                                kObj._bulkPriorityData.push(fData[j]);
                        }
                    }
                    data = kObj._bulkPriorityData;
                    kObj._bulkPriorityData = [];
                }
            }
        }
        var cData = [], addData = [], deleteData = [], editData = [];
        if (ej.isNullOrUndefined(data) && primaryKey)
            data = new ej.DataManager(kObj._currentJsonData).executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, primaryKey))[0];
        data = ej.isNullOrUndefined(data) ? null : data;
        if ($.isPlainObject(data))
            cData.push(data);
        else
            cData = data;
        if (kObj._isLocalData) {
            var queryManagar = kObj.model.query, cloned = queryManagar.clone();
            for (var i = 0; i < cData.length; i++) {
                var currentData, index;
                queryManagar = queryManagar.where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, cData[i][kObj.model.fields.primaryKey]);
                currentData = kObj._dataManager.executeLocal(queryManagar);
                if (!(kObj._dataSource() instanceof ej.DataManager))
                    index = $.inArray(currentData.result[0], kObj._dataSource());
                else
                    index = $.inArray(currentData.result[0], kObj._dataSource().dataSource.json);
                if (index >= 0) {
                    if (!(kObj._dataSource() instanceof ej.DataManager))
                        $.extend(kObj._dataSource()[index], cData[i]);
                    else
                        $.extend(kObj._dataSource().dataSource.json[index], cData[i]);
                }
                else {
                    var tmpRcrd = cData[i];
                    kObj._cAddedRecord = null;
                    (kObj._dataSource() instanceof ej.DataManager) ? kObj._dataSource().dataSource.json.push(tmpRcrd) : kObj._dataSource(undefined, true).splice(kObj._dataSource().length, 0, tmpRcrd);
                }
                queryManagar["queries"] = queryManagar["queries"].slice(queryManagar["queries"].length);
            }
            queryManagar["queries"] = cloned["queries"];
        }
        if (args.requestType != "drop")
            args.data = cData;
        kObj._saveArgs = args;
        if (kObj._dataManager instanceof ej.DataManager && !kObj._dataManager.dataSource.offline || (kObj._dataSource().adaptor instanceof ej.remoteSaveAdaptor)) {
            if (args.requestType == "delete")
                deleteData.push(args.data[0]);
            else {
                for (var i = 0; i < cData.length; i++) {
                    var tempCard = this._getKanbanCardData(kObj._currentJsonData, cData[i][kObj.model.fields.primaryKey]);
                    if (tempCard.length > 0)
                        editData.push(cData[i]);
                    else
                        addData.push(cData[i]);
                }
            }
            kObj.KanbanCommon._kbnBulkUpdate(addData, deleteData, editData);
        }
        else {
            kObj.KanbanCommon._processBindings(kObj._saveArgs);
            kObj._cModifiedData = null;
            kObj._cAddedRecord = null;
            kObj._isAddNewClick = false;
            kObj._currentData = null;
            kObj._newCard = null;
            kObj._saveArgs = null;
            kObj._cardEditClick = null;
            kObj._dblArgs = null;
        }
    };
    InternalCommon.prototype._getMetaColGroup = function () {
        var $colgroup = ej.buildTag("colgroup", "", {}, {}), kObj = this.kanbanObj;
        for (var i = 0; i < kObj.model.columns.length; i++) {
            var $col = $(document.createElement("col"));
            if (kObj.model.allowToggleColumn)
                kObj.model.columns[i]["isCollapsed"] === true && $col.addClass("e-shrinkcol");
            kObj.model.columns[i]["visible"] === false && $col.addClass("e-hide");
            $colgroup.append($col);
        }
        return $colgroup;
    };
    InternalCommon.prototype._kanbanToolbarClick = function (sender, kObj) {
        var $searchIcon;
        var currentTarget = sender.currentTarget;
        var target = sender.target;
        if ($(currentTarget).hasClass("e-quickfilter"))
            return false;
        if (kObj.KanbanFilter && target.tagName == 'INPUT' && $(target).parent().next().hasClass("e-cancel") && $(target).val().length == 0)
            kObj.KanbanFilter.searchCards("");
        if (kObj.model.isResponsive && kObj.element.hasClass('e-responsive')) {
            $(kObj["itemsContainer"]).parent().children().not('.e-searchbar').hide();
            if (sender.keyCode == 8) {
                kObj.KanbanAdaptive._kbnTimeoutSearch(kObj.element, sender);
            }
        }
        if (sender.event == undefined)
            return false;
        var filterName = $(currentTarget).text();
        for (var count = 0; count < kObj.model.filterSettings.length; count++) {
            if (kObj.model.filterSettings[count]["text"] == filterName)
                break;
        }
        var filterValue = (count == kObj.model.filterSettings.length ? null : kObj.model.filterSettings[count]);
        var args = { itemName: $(currentTarget).attr("data-content"), itemId: currentTarget.id, target: target, currentTarget: currentTarget, itemIndex: $(currentTarget).index(), toolbarData: sender, itemText: filterName, model: kObj.model, cancel: false, type: "toolbarClick" };
        if (kObj._trigger("toolbarClick", args))
            return false;
        if (args.itemId == kObj._id + "_toolbarItems" + "_search") {
            if (args.target.nodeName == "A") {
                if (kObj.model.allowSearching && kObj._searchBar != null && $(args.currentTarget).find("input").val().length != 0) {
                    if ($(target).is(kObj._searchBar.find(".e-searchfind"))) {
                        kObj.KanbanFilter.searchCards($(args.currentTarget).find("input").val());
                    }
                    else if ($(target).is(kObj._searchBar.find(".e-cancel"))) {
                        kObj.KanbanFilter.searchCards("");
                    }
                }
            }
            if (!kObj._isWatermark) {
                kObj._searchInput.blur(function () {
                    !kObj._searchInput.val() && kObj._hiddenSpan.css("display", "block");
                });
                kObj._hiddenSpan.css("display", "none");
            }
        }
        else if ($(args.currentTarget).hasClass("e-printlist"))
            kObj.print();
        else if (kObj.KanbanFilter && !$(currentTarget).parent().hasClass("e-customtoolbar"))
            kObj.KanbanFilter._filterHandler(filterValue, currentTarget);
        return false;
    };
    InternalCommon.prototype._kanbanSetModel = function (options, kObj) {
        for (var prop in options) {
            var $content;
            switch (prop) {
                case "columns":
                    var columns = options.columns;
                    kObj.model.columns = [];
                    kObj.columns(columns, "add");
                    break;
                case "cssClass":
                    kObj.element.removeClass(kObj.model.cssClass).addClass(options[prop]);
                    break;
                case "allowFiltering":
                case "filterSettings":
                    if (prop == "allowFiltering") {
                        kObj.model.allowFiltering = options[prop];
                        if (kObj.model.allowFiltering)
                            kObj.KanbanFilter = new ej.KanbanFeatures.Filter(kObj);
                        if (!kObj.model.allowSearching && kObj.model.filterSettings.length == 0 && !kObj.model.allowPrinting && kObj.model.customToolbarItems.length == 0)
                            kObj.KanbanFilter = null;
                    }
                    else {
                        if (prop == "filterSettings")
                            kObj.model.filterSettings = options[prop];
                        if (kObj.model.filterSettings.length > 0) {
                            kObj.element.find(".e-kanbantoolbar").remove();
                            kObj._filterCollection = [];
                            kObj._renderToolBar().insertBefore(kObj.element.find(".e-kanbanheader").first());
                            if (kObj.model.filterSettings.length > 0)
                                kObj.KanbanFilter = new ej.KanbanFeatures.Filter(kObj);
                        }
                        else {
                            kObj.element.find(".e-kanbantoolbar").remove();
                            kObj.model.filterSettings = [];
                            kObj._filterCollection = [];
                            kObj._renderToolBar().insertBefore(kObj.element.find(".e-kanbanheader").first());
                            if (!kObj.model.allowSearching && kObj.model.filterSettings.length == 0 && !kObj.model.allowPrinting && kObj.model.customToolbarItems.length == 0)
                                kObj.element.find(".e-kanbantoolbar").remove();
                            $(kObj.element.find(".e-kanbanheader")).replaceWith(kObj._renderHeader());
                            kObj.refresh();
                        }
                        if (kObj.model.enableTotalCount)
                            this._totalCount();
                        this._renderLimit();
                    }
                    break;
                case "allowSearching":
                    kObj.model.allowSearching = options[prop];
                    if (kObj.model.allowSearching) {
                        kObj.element.find(".e-kanbantoolbar").remove();
                        kObj.model.searchSettings.key = "";
                        kObj._renderToolBar().insertBefore(kObj.element.find(".e-kanbanheader").first());
                        if (kObj.model.allowSearching)
                            kObj.KanbanFilter = new ej.KanbanFeatures.Filter(kObj);
                    }
                    else {
                        kObj.element.find(".e-kanbantoolbar").remove();
                        kObj.model.searchSettings.key = "";
                        kObj._renderToolBar().insertBefore(kObj.element.find(".e-kanbanheader").first());
                        if (kObj.model.filterSettings.length == 0 && !kObj.model.allowPrinting && kObj.model.customToolbarItems.length == 0)
                            kObj.element.find(".e-kanbantoolbar").remove();
                        $(kObj.element.find(".e-kanbanheader")).replaceWith(kObj._renderHeader());
                        kObj.refresh();
                    }
                    kObj._on($("#" + kObj._id + "_searchbar"), "keyup", "", kObj._onToolbarClick);
                    if (kObj.model.enableTotalCount)
                        this._totalCount();
                    this._renderLimit();
                    break;
                case "enableTotalCount":
                    kObj.model.enableTotalCount = options[prop];
                    $(kObj.element.find(".e-kanbanheader")).replaceWith(kObj._renderHeader());
                    kObj.refresh();
                    if (kObj.model.enableTotalCount)
                        this._totalCount();
                    this._renderLimit();
                    break;
                case "fields":
                    if (prop == "fields") {
                        $(kObj.element.find(".e-kanbanheader")).replaceWith(kObj._renderHeader());
                        if (kObj.model.allowSearching)
                            kObj.KanbanFilter.searchCards("");
                        if (!ej.isNullOrUndefined(kObj.model.fields.swimlaneKey) && kObj.model.contextMenuSettings.enable)
                            kObj.KanbanContext._renderContext();
                        if (kObj.model.filterSettings.length > 0)
                            kObj.KanbanFilter.clearFilter();
                        if (kObj.model.filterSettings.length != 0)
                            $("#Kanban").find(".e-kanbantoolbar .e-tooltxt").removeClass("e-select");
                        kObj.getHeaderContent().replaceWith(kObj._renderHeader());
                        this._refreshDataSource(kObj._dataSource());
                        this._renderLimit();
                        if (kObj.model.enableTotalCount)
                            this._totalCount();
                        kObj.element.find(".e-kanbantoolbar").remove();
                        kObj._renderToolBar().insertBefore(kObj.element.find(".e-kanbanheader").first());
                        if (!kObj.model.allowSearching && kObj.model.filterSettings.length == 0 && !kObj.model.allowPrinting && kObj.model.customToolbarItems.length == 0)
                            kObj.element.find(".e-kanbantoolbar").remove();
                        if (kObj.model.fields && !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
                            kObj.KanbanSwimlane = new ej.KanbanFeatures.Swimlane(kObj);
                        kObj._on($("#" + kObj._id + "_searchbar"), "keyup", "", kObj._onToolbarClick);
                    }
                    break;
                case "enableTouch":
                    kObj.model.enableTouch = options[prop];
                    if (!kObj.model.enableTouch) {
                        kObj._off(kObj.element, "doubletap", ".e-kanbancard");
                        if (kObj.model.editSettings.allowEditing)
                            kObj._on(kObj.element, ($.isFunction($.fn.doubletap) && kObj.model.enableTouch) ? "doubletap" : "dblclick", ".e-kanbancard", kObj._cardDblClickHandler);
                        if (kObj.KanbanAdaptive) {
                            kObj._off(kObj.element, "taphold", "", kObj.KanbanAdaptive._kbnHoldHandler);
                            kObj._off(kObj.element, "touchend", "", kObj.KanbanAdaptive._kbnTouchEndHandler);
                            kObj._off(kObj.element, "swipeleft swiperight", ".e-kanbancontent", $.proxy(kObj._swipeKanban, kObj));
                        }
                        kObj._on(kObj.element, ($.isFunction($.fn.tap) && kObj.model.enableTouch) ? "tap" : "click", "", kObj._clickHandler);
                        kObj._on($('.e-swimlane-window,.e-kanbanfilter-window,.e-kanbantoolbar'), ($.isFunction($.fn.tap) && kObj.model.enableTouch) ? "tap" : "click", "", kObj._kbnAdaptClickHandler);
                        kObj._on($('.e-kanban-editdiv'), ($.isFunction($.fn.tap) && kObj.model.enableTouch) ? "tap" : "click", "", kObj._kbnAdaptEditClickHandler);
                    }
                    else {
                        kObj._off(kObj.element, "dblclick", ".e-kanbancard");
                        if (kObj.model.editSettings.allowEditing)
                            kObj._on(kObj.element, ($.isFunction($.fn.doubletap) && kObj.model.enableTouch) ? "doubletap" : "dblclick", ".e-kanbancard", kObj._cardDblClickHandler);
                        kObj._on(kObj.element, ($.isFunction($.fn.tap) && kObj.model.enableTouch) ? "tap" : "click", "", kObj._clickHandler);
                        kObj._on($('.e-swimlane-window,.e-kanbanfilter-window,.e-kanbantoolbar'), ($.isFunction($.fn.tap) && kObj.model.enableTouch) ? "tap" : "click", "", kObj._kbnAdaptClickHandler);
                        kObj._on($('.e-kanban-editdiv'), ($.isFunction($.fn.tap) && kObj.model.enableTouch) ? "tap" : "click", "", kObj._kbnAdaptEditClickHandler);
                        if (kObj.KanbanAdaptive) {
                            kObj._on(kObj.element, "taphold", "", kObj.KanbanAdaptive._kbnHoldHandler);
                            kObj._on(kObj.element, "touchend", "", kObj.KanbanAdaptive._kbnTouchEndHandler);
                            kObj._on(kObj.element, "swipeleft swiperight", ".e-kanbancontent", $.proxy(kObj._swipeKanban, kObj));
                        }
                    }
                    break;
                case "allowHover":
                    kObj.model.allowHover = options[prop];
                    kObj._enableCardHover();
                    break;
                case "enableRTL":
                    kObj.model.enableRTL = options[prop];
                    this._enableKanbanRTL();
                    kObj.refresh(true);
                    kObj.KanbanScroll._refreshScroller({ requestType: "refresh" });
                    this._renderLimit();
                    break;
                case "tooltipSettings":
                    $.extend(kObj.model.tooltipSettings, options[prop]);
                    if (!ej.isNullOrUndefined(kObj.model.tooltipSettings) && kObj.model.tooltipSettings.enable) {
                        kObj.element.find(".e-kanbantooltip").remove();
                        kObj.element.append($("<div class='e-kanbantooltip'></div>"));
                        kObj.element.find('.e-kanbantooltip').hide();
                        kObj._on(kObj.element, "mouseover", ".e-kanbancard", $.proxy(kObj._showToolTip, kObj));
                        kObj._on(kObj.element, "mouseout", ".e-kanbancard", $.proxy(kObj._hideToolTip, kObj));
                    }
                    else {
                        kObj._off(kObj.element, "mouseover", ".e-kanbancard");
                        kObj._off(kObj.element, "mouseout", ".e-kanbancard");
                    }
                    break;
                case "allowScrolling":
                case "scrollSettings":
                    $content = kObj.getContent();
                    kObj.model.allowScrolling = options[prop];
                    if (prop != "allowScrolling") {
                        if (!ej.isNullOrUndefined(options["scrollSettings"])) {
                            if ($.isEmptyObject(options["scrollSettings"]))
                                break;
                            $.extend(kObj.model.scrollSettings, options["scrollSettings"]);
                        }
                        if (!ej.isNullOrUndefined(options["allowScrolling"]))
                            kObj.model.allowScrolling = options["allowScrolling"];
                        !ej.isNullOrUndefined($content.data("ejScroller")) && $content.ejScroller("destroy");
                        if (kObj.model.allowScrolling) {
                            kObj.KanbanScroll = new ej.KanbanFeatures.Scroller(kObj);
                            kObj.getHeaderContent().find("div").first().addClass("e-headercontent");
                            kObj._originalScrollWidth = kObj.model.scrollSettings.width;
                            kObj.KanbanScroll._renderScroller();
                        }
                        else {
                            kObj.element.children(".e-kanbanheader").removeClass("e-scrollcss");
                            kObj.element.css("width", "auto");
                            kObj.element.removeClass("e-kanbanscroll");
                            kObj.element.find(".e-headercontent").removeClass("e-hscrollcss");
                        }
                        if (!$.isEmptyObject(kObj._freezeSwimlaneRow)) {
                            kObj._freezeSwimlaneRow.remove();
                            kObj.headerContent.css({ 'position': '', 'top': '' });
                            kObj.kanbanContent.css({ 'position': '', 'top': '' });
                            var toolbar = kObj.element.find('.e-kanbantoolbar');
                            if (toolbar.length > 0)
                                toolbar.css({ 'position': '', 'top': '' });
                        }
                    }
                    break;
                case "dataSource":
                    $content = kObj.element.find(".e-kanbancontent").first();
                    this._refreshDataSource(kObj._dataSource());
                    this._addLastRow();
                    break;
                case "swimlaneSettings":
                    if (!ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
                        $.extend(kObj.model.swimlaneSettings, options[prop]);
                        if (!ej.isNullOrUndefined(options[prop].showCount))
                            kObj.refresh(true);
                    }
                    break;
                case "editSettings":
                    $.extend(kObj.model.editSettings, options[prop]);
                    kObj.KanbanEdit._processEditing();
                    kObj._tdsOffsetWidth = [];
                    if (kObj.model.editSettings.allowEditing || kObj.model.editSettings.allowAdding) {
                        if (kObj.model.editSettings.editMode == "dialog" || kObj.model.editSettings.editMode == "dialogtemplate") {
                            $("#" + kObj._id + "_dialogEdit").data("ejDialog") && $("#" + kObj._id + "_dialogEdit").ejDialog("destroy");
                            $("#" + kObj._id + "_dialogEdit_wrapper,#" + kObj._id + "_dialogEdit").remove();
                            if (!ej.isNullOrUndefined($("#" + kObj._id + "_externalEdit")))
                                $("#" + kObj._id + "_externalEdit").remove();
                            kObj.element.append(kObj.KanbanEdit._renderDialog());
                        }
                        else if (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate") {
                            if (!ej.isNullOrUndefined(kObj.element.find(".e-kanbandialog")))
                                kObj.element.find(".e-kanbandialog").remove();
                            $("#" + kObj._id + "_externalEdit").remove();
                            kObj.element.append(kObj.KanbanEdit._renderExternalForm());
                        }
                        kObj._isEdit = false;
                    }
                    kObj._enableEditingEvents();
                    break;
                case "allowSelection":
                    if (options[prop]) {
                        kObj._off(kObj.element, "click");
                        kObj._on(kObj.element, "click", "", kObj._clickHandler);
                    }
                    break;
                case "query":
                    kObj.model.query = $.extend(true, {}, options[prop]);
                    break;
                case "stackedHeaderRows":
                    if (prop == "stackedHeaderRows")
                        kObj.model.stackedHeaderRows = options[prop];
                    if (kObj.model.stackedHeaderRows.length > 0) {
                        this._refreshStackedHeader();
                    }
                    else {
                        kObj.element.find(".e-stackedHeaderRow").remove();
                        kObj.model.stackedHeaderRows = [];
                    }
                    break;
                case "cardSettings":
                    if (!ej.isNullOrUndefined(options["cardSettings"])) {
                        $.extend(kObj.model.cardSettings, options["cardSettings"]);
                    }
                    kObj.element.find(".e-kanbancard").remove();
                    kObj.refreshTemplate();
                    kObj._renderAllCard();
                    kObj._enableDragandScroll();
                    break;
                case "allowToggleColumn":
                    kObj.model.allowToggleColumn = options[prop];
                    kObj.refreshTemplate();
                    kObj.getHeaderContent().replaceWith(kObj._renderHeader());
                    kObj.sendDataRenderingRequest({ requestType: "refresh" });
                    if (!kObj.model.allowToggleColumn)
                        kObj.element.find(".e-shrinkheader").not(".e-hide").addClass("e-hide");
                    if (kObj.model.enableTotalCount)
                        this._totalCount();
                    this._renderLimit();
                    break;
                case "locale":
                    kObj.model.locale = options[prop];
                    var model = kObj.model, element = kObj.element;
                    model.query["queries"] = model.query["queries"].slice(0, model.query["queries"].length - 1);
                    kObj.element.ejKanban("destroy").ejKanban(model);
                    kObj.element = element;
                    kObj.model = model;
                    if (kObj._collapsedCards.length != 0)
                        kObj.toggleCard(kObj._collapsedCards);
                    break;
            }
        }
    };
    InternalCommon.prototype._setWidthToColumns = function () {
        var kObj = this.kanbanObj, $cols1 = kObj.getContentTable().children("colgroup").find("col"), $cols2 = kObj.getHeaderTable().children("colgroup").find("col");
        var width = kObj._originalWidth - (kObj._collapsedColumns.length * 50);
        for (var i = 0; i < $cols2.length; i++) {
            if (!ej.isNullOrUndefined(kObj._columnsWidthCollection[i]) && !kObj.model.allowToggleColumn) {
                $cols1.eq(i).width(kObj._columnsWidthCollection[i]);
                $cols2.eq(i).width(kObj._columnsWidthCollection[i]);
            }
            else if (kObj.model.allowScrolling) {
                var colWidth = parseInt((width / kObj._expandedColumns.length).toFixed(2)), bSize = parseInt((width / (kObj.model.scrollSettings["buttonSize"] || 18) / 100).toFixed(2)), cWidth = colWidth - bSize;
                if (!kObj.model.columns[i].isCollapsed) {
                    $cols1.eq(i).css("width", cWidth + "px");
                    $cols2.eq(i).css("width", cWidth + "px");
                    kObj.model.columns[i].width = cWidth;
                }
                kObj._columnsWidthCollection[i] = parseInt((width / kObj.model.columns.length).toFixed(2)) - bSize;
            }
        }
    };
    InternalCommon.prototype._getCardbyIndexes = function (indexes) {
        return $(this.kanbanObj.getRowByIndex(indexes[0][0]).find(".e-rowcell:eq(" + indexes[0][1][0] + ")").find("div.e-kanbancard:eq(" + indexes[0][2][0] + ")"));
    };
    InternalCommon.prototype._addLastRow = function () {
        var kObj = this.kanbanObj, lastRowtd = kObj.getContentTable().find("tr:last").find("td"), rowHeight = 0;
        if (kObj.model.allowScrolling && !ej.isNullOrUndefined(kObj.model.dataSource) && !ej.isNullOrUndefined(kObj._kanbanRows)) {
            for (var i = 0; i < kObj._kanbanRows.length; i++)
                rowHeight += $(kObj._kanbanRows[i]).height();
            if (rowHeight < kObj.getContent().height() - 1)
                lastRowtd.addClass("e-lastrowcell");
        }
    };
    InternalCommon.prototype._refreshDataSource = function (dataSource) {
        var kObj = this.kanbanObj;
        if (dataSource instanceof ej.DataManager)
            kObj._dataManager = dataSource;
        else
            kObj._dataManager = new ej.DataManager(dataSource);
        kObj._isLocalData = (!(kObj._dataSource() instanceof ej.DataManager) || (kObj._dataManager.dataSource.offline || kObj._isRemoteSaveAdaptor));
        kObj.refresh(true);
    };
    InternalCommon.prototype._cardClick = function (target, parentDiv) {
        var args, data = null, queryManager;
        if (!ej.isNullOrUndefined(parentDiv.attr("id"))) {
            queryManager = new ej.DataManager(this.kanbanObj._currentJsonData);
            data = queryManager.executeLocal(new ej.Query().where(this.kanbanObj.model.fields.primaryKey, ej.FilterOperators.equal, parentDiv.attr('id')));
        }
        args = { target: target, currentCard: parentDiv, data: data };
        if (this.kanbanObj._trigger("cardClick", args))
            return;
    };
    InternalCommon.prototype._validateLimit = function (curColumn, $curHeaderCell, count) {
        var kObj = this.kanbanObj, key = this._multikeySeparation(curColumn.key), $cell = $($(kObj.element.find(".e-columnrow")).find('td[ej-mappingkey="' + key + '"]')), totalcard;
        var isMin = !ej.isNullOrUndefined(curColumn.constraints.min), isMax = !ej.isNullOrUndefined(curColumn.constraints.max), isSwimlane = !ej.isNullOrUndefined(kObj.model.fields.swimlaneKey) && count == 0;
        if (curColumn.constraints.type == "column") {
            totalcard = $cell.find(".e-kanbancard").length;
        }
        else {
            totalcard = $($cell[count]).find(".e-kanbancard").length;
            $cell = $($cell[count]);
        }
        if (isMin)
            if (curColumn.constraints.min > totalcard) {
                $cell.addClass("e-deceed");
                if (isSwimlane)
                    $($curHeaderCell).addClass("e-deceed");
            }
            else {
                $cell.removeClass("e-deceed");
                if (isSwimlane)
                    $($curHeaderCell).removeClass("e-deceed");
            }
        if (isMax)
            if (curColumn.constraints.max < totalcard) {
                $cell.addClass("e-exceed");
                if (isSwimlane)
                    $($curHeaderCell).addClass("e-exceed");
            }
            else {
                $cell.removeClass("e-exceed");
                if (isSwimlane)
                    $($curHeaderCell).removeClass("e-exceed");
            }
        $cell.find(".e-limits").addClass("e-hide");
        if (!curColumn.isCollapsed)
            $($curHeaderCell).find(".e-limits").removeClass("e-hide");
    };
    InternalCommon.prototype._totalCount = function () {
        var kObj = this.kanbanObj;
        for (var i = 0; i < kObj.model.columns.length; i++) {
            var column = kObj.model.columns[i];
            if (kObj.model.enableTotalCount) {
                var total = kObj.getHeaderContent().find("span.e-totalcount")[i];
                var key = this._multikeySeparation(column.key);
                var $columnrow = $($(kObj.element.find(".e-columnrow")).find('td[ej-mappingkey="' + key + '"]'));
                var totalcard = $columnrow.find(".e-kanbancard").length;
                $(total).text(totalcard);
            }
        }
    };
    InternalCommon.prototype._multikeySeparation = function (key) {
        var columnKey = typeof (key) == "object" ? key : key.split(","), key = "", length = columnKey.length;
        if (length == 1)
            key = columnKey[0];
        else
            for (var j = 0; j < length; j++) {
                key = key + columnKey[j];
                if (j != length - 1)
                    key += ",";
            }
        return key;
    };
    InternalCommon.prototype._renderLimit = function () {
        var kObj = this.kanbanObj, $headerCell = {};
        for (var i = 0; i < kObj.model.columns.length; i++) {
            var column = kObj.model.columns[i];
            if (!ej.isNullOrUndefined(column.constraints)) {
                var isMin = !ej.isNullOrUndefined(column.constraints['min']), isMax = !ej.isNullOrUndefined(column.constraints['max']);
                if (isMin || isMax)
                    $headerCell = kObj.getHeaderContent().find(".e-columnheader").not(".e-stackedHeaderRow").find(".e-headercell")[i];
                var columnKey = typeof (column.key) == "object" ? column.key : column.key.split(","), key = kObj.KanbanCommon._multikeySeparation(columnKey);
                var $cell = $($(kObj.element.find(".e-columnrow")).find('td[ej-mappingkey="' + key + '"]')), k = 0;
                if (ej.isNullOrUndefined(column.constraints.type))
                    column.constraints.type = "column";
                switch (column.constraints.type) {
                    case "column":
                        this._validateLimit(column, $headerCell, k);
                        break;
                    case "swimlane":
                        for (k = 0; k < $cell.length; k++) {
                            this._validateLimit(column, $headerCell, k);
                            if (!kObj.getHeaderContent().find(".e-headercell").eq(i).hasClass("e-shrinkcol"))
                                $cell.eq(k).find(".e-limits").removeClass("e-hide");
                        }
                        if (!ej.isNullOrUndefined(kObj.model.fields.swimlaneKey))
                            $($headerCell).find(".e-limits").addClass("e-hide");
                        break;
                }
            }
        }
    };
    InternalCommon.prototype._showhide = function (shcolumns, val) {
        var kObj = this.kanbanObj, i, count = 0, hideshowCols, columns = kObj.model.columns;
        hideshowCols = (val === "show") ? "_visibleColumns" : "_hiddenColumns";
        var $head = kObj.getHeaderTable().find("thead");
        var $headerCell = $head.find("tr").not(".e-stackedHeaderRow").find(".e-headercell");
        var $col = kObj.getHeaderTable().find("colgroup").find("col"), column;
        var $content_col = kObj.getContentTable().find("colgroup").find("col");
        var columnrow = kObj._columnRows;
        for (i = 0; i < columns.length; i++) {
            if ($.inArray(columns[i]["headerText"], kObj[hideshowCols]) != -1) {
                if (val === "show")
                    columns[i].visible = true;
                else
                    columns[i].visible = false;
                count++;
            }
            column = kObj.getColumnByHeaderText(shcolumns[i]);
            var index = $.inArray(column, kObj.model.columns);
            if (index != -1) {
                if (val == "show") {
                    $headerCell.eq(index).removeClass("e-hide");
                    $col.eq(index).css("display", "");
                }
                else {
                    $headerCell.eq(index).addClass("e-hide");
                    $col.eq(index).css("display", "none");
                }
            }
        }
        for (i = 0; i < columns.length; i++) {
            for (var j = 0; j < columnrow.length; j++) {
                if (!ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
                    if ($(columnrow[j]).is(":visible"))
                        columnrow.eq(j).prev().find(".e-rowcell").attr("colspan", kObj.getVisibleColumnNames().length);
                    else {
                        columnrow.eq(j).prev().prev(".e-swimlanerow").find(".e-rowcell").attr("colspan", kObj.getVisibleColumnNames().length);
                        if (!columns[i].visible)
                            columnrow.eq(j).prev(".e-collapsedrow").find("td.e-rowcell").eq(i).addClass("e-hide");
                        else
                            columnrow.eq(j).prev(".e-collapsedrow").find("td.e-rowcell").eq(i).removeClass("e-hide");
                    }
                }
                var colval = columnrow.eq(j).find("td.e-rowcell[ej-mappingkey='" + kObj.model.columns[i].key + "']");
                if (!columns[i].visible) {
                    colval.addClass("e-hide");
                    $content_col.eq(i).addClass("e-hide");
                }
                else {
                    colval.removeClass("e-hide");
                    $content_col.eq(i).removeClass("e-hide");
                }
            }
        }
        var $header = kObj.element.find(".e-kanbanheader");
        kObj._columnsWidthCollection = [];
        for (var columnCount = 0; columnCount < kObj.model.columns.length; columnCount++)
            if (!ej.isNullOrUndefined(kObj.model.columns[columnCount]["width"])) {
                kObj._columnsWidthCollection.push(kObj.model.columns[columnCount]["width"]);
            }
        kObj.element[0].replaceChild(kObj._renderHeader()[0], $header[0]);
        kObj.getContentTable().find("colgroup").first().replaceWith(this._getMetaColGroup());
        this._setWidthToColumns();
        kObj.KanbanScroll && kObj.KanbanScroll._refreshScroller({ requestType: "refresh" });
    };
    InternalCommon.prototype._showExpandColumns = function (key, c, hidden, visible) {
        var kObj = this.kanbanObj;
        if (ej.isNullOrUndefined(key))
            return;
        if (key != null) {
            if ($.isArray(c)) {
                for (var i = 0; i < c.length; i++) {
                    var ckey = kObj.getColumnByHeaderText(c[i]);
                    c[i] = ckey != null ? ckey.headerText : c[i];
                }
            }
            else
                c = key.headerText;
        }
        if ($.isArray(c)) {
            for (i = 0; i < c.length; i++) {
                var index = $.inArray(c[i], kObj[hidden]);
                if (index != -1) {
                    kObj[hidden].splice(index, 1);
                    kObj[visible].push(c[i]);
                }
                else if (index == -1 && $.inArray(c[i], kObj[visible]) == -1 && !ej.isNullOrUndefined(kObj.getColumnByHeaderText(c[i]))) {
                    kObj[visible].push(kObj.getColumnByHeaderText(c[i]).key) && kObj[visible].push(c[i]);
                    kObj[hidden].splice($.inArray(kObj.getColumnByHeaderText(c[i]).key, kObj[hidden]), 1) && kObj[hidden].splice($.inArray(c[i], kObj[hidden]), 1);
                }
            }
        }
        else {
            index = $.inArray(c, kObj[hidden]);
            if (index != -1) {
                kObj[hidden].splice(index, 1);
                kObj[visible].push(c);
            }
            else if (index == -1 && $.inArray(c, kObj[visible]) == -1 && !ej.isNullOrUndefined(kObj.getColumnByHeaderText(c))) {
                kObj[visible].push(kObj.getColumnByHeaderText(c).key) && kObj[visible].push(c);
                kObj[hidden].splice($.inArray(kObj.getColumnByHeaderText(c).key, kObj[hidden]), 1) && kObj[hidden].splice($.inArray(c, kObj[hidden]), 1);
            }
        }
    };
    InternalCommon.prototype._expandColumns = function (c) {
        var key, hidden = "_collapsedColumns", visible = "_expandedColumns", kObj = this.kanbanObj;
        key = typeof (c) == "string" ? kObj.getColumnByHeaderText(c) : kObj.getColumnByHeaderText(c[0]);
        this._showExpandColumns(key, c, hidden, visible);
        this._expandCollapse(kObj[visible], "expand");
        if (kObj.model.allowScrolling)
            this._setWidthToColumns();
        if (kObj.model.stackedHeaderRows.length > 0) {
            this._refreshStackedHeader();
        }
    };
    InternalCommon.prototype._toggleField = function (c) {
        var index, i, kObj = this.kanbanObj;
        if (kObj.model.allowToggleColumn) {
            if ($.isArray(c)) {
                for (i = 0; i < c.length; i++) {
                    index = $.inArray(c[i], kObj._collapsedColumns);
                    if (index != -1)
                        this._expandColumns(c[i]);
                    else
                        this._collapseColumns(c[i]);
                }
            }
            else if ($.inArray(c, kObj._collapsedColumns) != -1)
                this._expandColumns(c);
            else
                this._collapseColumns(c);
            if (kObj.model.allowScrolling) {
                var $cols1 = kObj.getContentTable().children("colgroup").find("col"), $cols2 = kObj.getHeaderTable().children("colgroup").find("col");
                var width = kObj._originalWidth - (kObj._collapsedColumns.length * 50);
                for (i = 0; i < $cols2.length; i++) {
                    var colWidth = parseInt((width / kObj._expandedColumns.length).toFixed(2)), bSize = parseInt((width / (kObj.model.scrollSettings["buttonSize"] || 18) / 100).toFixed(2)), cWidth = colWidth - bSize;
                    if (!kObj.model.columns[i].isCollapsed) {
                        $cols1.eq(i).css("width", cWidth + "px");
                        $cols2.eq(i).css("width", cWidth + "px");
                        kObj.model.columns[i].width = cWidth;
                    }
                }
            }
            kObj.KanbanScroll && kObj.KanbanScroll._refreshScroller({ requestType: "refresh" });
        }
    };
    InternalCommon.prototype._hideCollapseColumns = function (key, c, hidden, visible) {
        var i, index, kObj = this.kanbanObj;
        if (ej.isNullOrUndefined(key))
            return;
        if ($.isArray(c)) {
            for (i = 0; i < c.length; i++) {
                index = $.inArray(c[i], kObj[visible]);
                if (index != -1) {
                    kObj[hidden].push(c[i]);
                    kObj[visible].splice(index, 1);
                }
                else if (index == -1 && $.inArray(c[i], kObj[hidden]) == -1 && !ej.isNullOrUndefined(kObj.getColumnByHeaderText(c[i]))) {
                    kObj[hidden].push(kObj.getColumnByHeaderText(c[i]).key) && kObj[hidden].push(kObj.getColumnByHeaderText(c[i]).key);
                    kObj[visible].splice($.inArray(kObj.getColumnByHeaderText(c[i]).key, kObj[visible]), 1) && kObj[visible].splice($.inArray(c[i], kObj[visible]), 1);
                }
            }
        }
        else {
            index = $.inArray(c, kObj[visible]);
            if (index != -1) {
                kObj[hidden].push(c);
                kObj[visible].splice(index, 1);
            }
            else if (index == -1 && visible == visible && $.inArray(c, kObj[hidden]) == -1 && !ej.isNullOrUndefined(kObj.getColumnByHeaderText(c))) {
                kObj[hidden].push(kObj.getColumnByHeaderText(c).key) && kObj[hidden].push(kObj.getColumnByHeaderText(c).key);
                kObj[visible].splice($.inArray(kObj.getColumnByHeaderText(c).key, kObj[visible]), 1) && kObj[visible].splice($.inArray(c, kObj[visible]), 1);
            }
        }
    };
    InternalCommon.prototype._expandCollapse = function (shcolumns, val) {
        var kObj = this.kanbanObj, i, count = 0, hideshowCols, columns = kObj.model.columns;
        hideshowCols = (val === "expand") ? "_expandedColumns" : "_collapsedColumns";
        var $head = kObj.getHeaderTable().find("thead");
        var $headerCell = $head.find("tr").not(".e-stackedHeaderRow").find(".e-headercell");
        var $col = kObj.getHeaderTable().find("colgroup").find("col"), column, colval;
        var $col1 = kObj.getContentTable().find("colgroup").find("col");
        for (i = 0; i < columns.length; i++) {
            if ($.inArray(columns[i]["headerText"], kObj[hideshowCols]) != -1) {
                if (val === "expand") {
                    columns[i].isCollapsed = false;
                }
                else {
                    columns[i].isCollapsed = true;
                }
                count++;
            }
            column = kObj.getColumnByHeaderText(shcolumns[i]);
            var index = $.inArray(column, kObj.model.columns);
            var isExp = val == "expand" ? true : false;
            if (index != -1) {
                if (isExp) {
                    if ($col.eq(index).hasClass("e-shrinkcol")) {
                        $headerCell.eq(index).find(".e-headercelldiv,.e-totalcard,.e-limits").removeClass("e-hide");
                        $headerCell.eq(index).removeClass("e-shrinkcol");
                        $col.eq(index).removeClass("e-shrinkcol");
                        $col1.eq(index).removeClass("e-shrinkcol");
                        $headerCell.eq(index).find(".e-clcollapse").addClass("e-clexpand").removeClass("e-clcollapse");
                    }
                }
                else {
                    if (!$col.eq(index).hasClass("e-shrinkcol")) {
                        $headerCell.eq(index).find(".e-headercelldiv,.e-totalcard,.e-limits").addClass("e-hide");
                        $headerCell.eq(index).addClass("e-shrinkcol");
                        $col.eq(index).addClass("e-shrinkcol");
                        $col1.eq(index).addClass("e-shrinkcol");
                        $headerCell.eq(index).find(".e-clexpand").addClass("e-clcollapse").removeClass("e-clexpand");
                    }
                }
            }
            var cshrink = kObj.model.columns[i].isCollapsed;
            var j;
            if (isExp) {
                if (!cshrink)
                    for (j = 0; j < kObj._columnRows.length; j++) {
                        colval = kObj._columnRows.eq(j).find("td.e-rowcell").eq(i);
                        if (colval.hasClass("e-shrink")) {
                            colval.removeClass("e-shrink").find(".e-shrinkheader").addClass("e-hide").parent().find(".e-kanbancard").removeClass("e-hide");
                            if (kObj.element.hasClass('e-responsive') && colval.find('.e-cell-scrollcontent').length > 0)
                                colval.find('.e-cell-scrollcontent').removeClass("e-hide");
                            if (kObj.model.enableRTL)
                                colval.find(".e-shrinkheader").css({ 'position': '', 'top': '' });
                            colval.find(".e-customaddbutton").removeClass("e-hide");
                            colval.find(".e-limits").removeClass("e-hide");
                            colval.find(".e-shrinkcount").text(kObj._columnCardcount(kObj.currentViewData, kObj.model.columns[i].key, kObj.model.fields.swimlaneKey ? j : null, kObj));
                        }
                        else
                            break;
                    }
            }
            else {
                if (cshrink)
                    for (j = 0; j < kObj._columnRows.length; j++) {
                        colval = kObj._columnRows.eq(j).find("td.e-rowcell").eq(i);
                        if (!colval.hasClass("e-shrink")) {
                            colval.addClass("e-shrink").find(".e-shrinkheader").removeClass("e-hide").parent().find(".e-kanbancard").addClass("e-hide");
                            if (kObj._checkMultikey(colval))
                                colval.addClass("e-shrink").find(".e-shrinkheader").show();
                            if (kObj.element.hasClass('e-responsive') && colval.find('.e-cell-scrollcontent').length > 0)
                                colval.find('.e-cell-scrollcontent').addClass("e-hide");
                            var contentTop = colval.offset().top, sCountTop = colval.find('.e-shrinkcount').offset().top;
                            if (kObj.model.enableRTL && contentTop > sCountTop) {
                                var topVal = contentTop - sCountTop, sHeader = colval.find(".e-shrinkheader");
                                topVal = (sHeader.offset().top - (contentTop + kObj.element.offset().top)) + topVal;
                                sHeader.css({ 'position': 'relative', 'top': topVal - 6 });
                            }
                            colval.find(".e-customaddbutton").addClass("e-hide");
                            colval.find(".e-limits").addClass("e-hide");
                            colval.find(".e-shrinkcount").text(kObj._columnCardcount(kObj.currentViewData, kObj.model.columns[i].key, kObj.model.fields.swimlaneKey ? j : null, kObj));
                        }
                        else
                            break;
                    }
            }
        }
    };
    InternalCommon.prototype._collapseColumns = function (c) {
        var kObj = this.kanbanObj, i, index, key, hidden = "_collapsedColumns", visible = "_expandedColumns", count = 0;
        for (i = 0; i < c.length; i++) {
            index = $.inArray(c[i], kObj._expandedColumns);
            if (index != -1)
                count++;
        }
        if (!(kObj._expandedColumns.length == count) && !(kObj.getVisibleColumnNames().length - kObj._collapsedColumns.length == 1) && !(kObj.model.columns.length - kObj._collapsedColumns.length == 1)) {
            key = typeof (c) == "string" ? kObj.getColumnByHeaderText(c) : kObj.getColumnByHeaderText(c[0]);
            this._hideCollapseColumns(key, c, hidden, visible);
            this._expandCollapse(kObj[hidden], "collapse");
            if (kObj.model.allowScrolling)
                this._setWidthToColumns();
            if (kObj.model.stackedHeaderRows.length > 0)
                this._refreshStackedHeader();
        }
        else if (kObj._collapsedColumns.length > 0) {
            this._expandColumns(kObj._collapsedColumns[0]);
            this._collapseColumns(c);
        }
    };
    return InternalCommon;
}());
window.ej.createObject("ej.KanbanFeatures.Common", InternalCommon, window);
;
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Kanban = (function (_super) {
    __extends(Kanban, _super);
    function Kanban(element, options) {
        _super.call(this);
        this.element = null;
        this.PluginName = "ejKanban";
        this.id = "null";
        this.validTags = ["div"];
        this.observables = ["dataSource"];
        this._tags = [
            {
                tag: "columns",
                attr: ["headerTemplate", "headerText", "key", "isCollapsed", "showAddButton", "visible", "constraints.type", "constraints.min", "constraints.max", "allowDrag", "allowDrop", "totalCount.text"]
            },
            {
                tag: "workflows",
                attr: ["key", "allowedTransitions"]
            },
            {
                tag: "stackedHeaderRows",
                attr: [
                    [
                        {
                            tag: "stackedHeaderColumns",
                            attr: ["headerText", "column"]
                        }
                    ]
                ]
            }, {
                tag: "contextMenuSettings",
                attr: [
                    "customMenuItems", "menuItems", "disableDefaultItems"
                ]
            },
            {
                tag: "filterSettings",
                attr: ["text", "query", "description"]
            },
            { tag: "editSettings.editItems", attr: ["field", "editType", "validationRules", "editParams", "defaultValue"] }
        ];
        this.localizedLabels = null;
        this.currentViewData = null;
        this.keyConfigs = {
            focus: "e",
            insertCard: "45",
            deleteCard: "46",
            editCard: "113",
            saveRequest: "13",
            cancelRequest: "27",
            firstCardSelection: "36",
            lastCardSelection: "35",
            upArrow: "38",
            downArrow: "40",
            rightArrow: "39",
            leftArrow: "37",
            swimlaneExpandAll: "ctrl+40",
            swimlaneCollapseAll: "ctrl+38",
            selectedSwimlaneExpand: "alt+40",
            selectedSwimlaneCollapse: "alt+38",
            selectedColumnCollapse: "ctrl+37",
            selectedColumnExpand: "ctrl+39",
            multiSelectionByUpArrow: "shift+38",
            multiSelectionByDownArrow: "shift+40",
            multiSelectionByLeftArrow: "shift+37",
            multiSelectionByRightArrow: "shift+39",
        };
        this.dataTypes = {
            dataSource: "data",
            query: "data",
            columns: "array",
            stackedHeaderRows: "array",
            contextMenuSettings: {
                disableDefaultItems: "array",
                menuItems: "array",
                customMenuItems: "array"
            },
            filterSettings: "array",
            editSettings: {
                editMode: "enum",
                editItems: "array"
            },
            searchSettings: {
                fields: "array"
            }
        };
        this.defaults = {
            dataSource: null,
            keyField: null,
            keySettings: null,
            allowTitle: false,
            cssClass: "",
            allowSelection: true,
            allowSearching: false,
            allowToggleColumn: false,
            enableTotalCount: false,
            enableTouch: true,
            selectionType: "single",
            allowKeyboardNavigation: false,
            allowDragAndDrop: true,
            allowHover: true,
            allowScrolling: false,
            allowPrinting: false,
            enableRTL: false,
            stackedHeaderRows: [],
            filterSettings: [],
            scrollSettings: {
                width: "auto",
                height: 0,
                allowFreezeSwimlane: false
            },
            swimlaneSettings: {
                showCount: true,
                allowDragAndDrop: false,
                unassignedGroup: {
                    enable: true,
                    keys: ["null", "undefined", ""]
                }
            },
            fields: {
                content: null,
                tag: null,
                color: null,
                imageUrl: null,
                swimlaneKey: null,
                primaryKey: null,
                priority: null
            },
            cardSettings: {
                colorMapping: {},
                template: null
            },
            columns: [],
            contextMenuSettings: {
                enable: false,
                menuItems: [
                    "Add Card", "Edit Card", "Delete Card", "Top of Row", "Bottom of Row", "Move Up", "Move Down", "Move Left", "Move Right", "Move to Swimlane", "Hide Column", "Visible Columns", "Print Card"], customMenuItems: []
            },
            customToolbarItems: [],
            editSettings: {
                editItems: [],
                allowEditing: false,
                allowAdding: false,
                dialogTemplate: null,
                externalFormTemplate: null,
                formPosition: "bottom"
            },
            searchSettings: {
                fields: [],
                key: "",
                operator: "contains",
                ignoreCase: true
            },
            tooltipSettings: {
                enable: false,
                template: null
            },
            minWidth: 0,
            isResponsive: false,
            locale: "en-US",
            query: null,
            create: null,
            actionBegin: null,
            actionComplete: null,
            actionFailure: null,
            load: null,
            destroy: null,
            beginEdit: null,
            endEdit: null,
            endAdd: null,
            endDelete: null,
            beforeCardSelect: null,
            cardSelect: null,
            toolbarClick: null,
            cardDoubleClick: null,
            cardDragStart: null,
            cardDrag: null,
            cardDragStop: null,
            cardDrop: null,
            contextClick: null,
            contextOpen: null,
            cardClick: null,
            beforePrint: null,
            cellClick: null,
            headerClick: null,
            dataBound: null,
            queryCellInfo: null,
        };
        this._dataSource = ej.util.valueFunction("dataSource");
        this._rootCSS = "e-kanban";
        this._requiresID = true;
        this._id = null;
        this.KanbanDragAndDrop = null;
        this.KanbanEdit = null;
        this.KanbanCommon = null;
        this.KanbanAdaptive = null;
        this.KanbanScroll = null;
        this.KanbanContext = null;
        this.KanbanSwimlane = null;
        this.KanbanSelection = null;
        this.KanbanFilter = null;
        this._currentJsonData = null;
        this._kanbanRows = null;
        this._columnRows = null;
        this._swimlaneRows = null;
        this._filterToolBar = null;
        this._filteredRecordsCount = 0;
        this._filteredRecords = null;
        this._contexttarget = null;
        this._editForm = null;
        this._newData = null;
        this._isAddNew = false;
        this._isRemoteSaveAdaptor = false;
        this._queryPromise = null;
        this._kanbanWidth = null;
        this.keyPredicates = null;
        this._cloneQuery = null;
        this._isLocalData = true;
        this._previousRowCellIndex = [];
        this.selectedRowCellIndexes = [];
        this._bulkUpdateData = [];
        this._bulkPriorityData = [];
        this._kbnFilterObject = [];
        this._kbnAdaptFilterObject = [];
        this._kbnFilterCollection = [];
        this._kbnAdaptDdlData = [];
        this._kbnAdaptDdlIndex = 0;
        this._kbnSwipeWidth = 0;
        this._kbnSwipeCount = 0;
        this._searchTout = null;
        this._cardSelect = null;
        this._kbnBrowserContext = null;
        this._kbnMouseX = null;
        this._kbnAutoFilterCheck = false;
        this._autoKbnSwipeLeft = false;
        this._autoKbnSwipeRight = false;
        this._kbnTransitionEnd = true;
        this._kbnDdlWindowResize = false;
        this._conmenu = null;
        this._rowIndexesColl = [];
        this.templates = {};
        this.initialRender = false;
        this._columnsWidthCollection = [];
        this._slTemplate = "";
        this._cardTemplate = "";
        this._tdsOffsetWidth = [];
        this._scrollObject = null;
        this._templateRefresh = false;
        this._action = "";
        this._hiddenColumns = [];
        this._visibleColumns = [];
        this._filterCollection = [];
        this.collapsedColumns = null;
        this._expandedColumns = null;
        this._headerColumnNames = null;
        this._isWatermark = null;
        this._searchInput = null;
        this._hiddenSpan = null;
        this._currentRowCellIndex = [];
        this._recordsCount = 0;
        this._dropinside = false;
        this._selectedCards = [];
        this._selectedCardData = [];
        this._tableBEle = null;
        this._saveArgs = null;
        this._cModifiedData = null;
        this._dropped = null;
        this._cAddedRecord = null;
        this._cDeleteData = null;
        this._isAddNewClick = false;
        this._isEdit = false;
        this._currentData = null;
        this._newCard = null;
        this._cardEditClick = null;
        this._collapsedCards = [];
        this._collapsedSwimlane = [];
        this._keyValue = [];
        this._dblArgs = null;
        this._freezeSwimlaneRow = {};
        this._freezeScrollTop = 0;
        this._freezeSlOrder = 0;
        this._originalWidth = null;
        this._originalScrollWidth = 0;
        this._collapsedColumns = [];
        this._enableMultiTouch = false;
        this._enableSwimlaneCount = true;
        this._kTouchBar = null;
        this._contextSwimlane = null;
        this._initialData = null;
        this._searchBar = null;
        this._originalScrollHeight = null;
        this._dataManager = null;
        this._priorityCollection = [];
        this._kbnAdaptEditClickHandler = function (e) {
            if (this.element.hasClass('e-responsive')) {
                var $target = $(e.target);
                if ($target.attr('id') == this._id + "_Cancel" || $target.parent().attr("id") == this._id + "_closebutton")
                    this.KanbanEdit.cancelEdit();
                if ($target.attr('id') == this._id + "_Save")
                    this.KanbanEdit.endEdit();
            }
        };
        this._keyPressed = function (action, target, e, event) {
            var value = this.KanbanCommon._kanbanKeyPressed(action, target, e, event);
            return value;
        };
        this._freezeSwimlane = function (e) {
            this.KanbanSwimlane && this.KanbanSwimlane._freezeRow(e, this);
        };
        this.getCurrentJsonData = function () {
            return this._currentJsonData;
        };
        if (element) {
            this._id = element[0].id;
            if (!element["jquery"])
                element = $('#' + element);
            if (element.length) {
                return $(element).ejKanban(options).data(this.PluginName);
            }
        }
    }
    Kanban.prototype.getHeaderTable = function () {
        return this.headerTable;
    };
    Kanban.prototype.setHeaderTable = function (value) {
        this.headerTable = value;
    };
    Kanban.prototype.getColumnByHeaderText = function (headerText) {
        if (ej.isNullOrUndefined(headerText))
            return;
        var columns = this.model.columns;
        for (var i = 0; i < columns.length; i++) {
            if (columns[i]["headerText"] == headerText)
                break;
        }
        return i == columns.length ? null : columns[i];
    };
    Kanban.prototype._getColumnKeyIndex = function (key) {
        var columns = this.model.columns, columnKey;
        for (var i = 0; i < columns.length; i++) {
            columnKey = typeof (columns[i]["key"]) == "object" ? columns[i]["key"] : columns[i]["key"].split(",");
            for (var j = 0; j < columnKey.length; j++)
                if (columnKey[j] == key)
                    return i;
        }
        return i == columns.length ? null : columns[i];
    };
    Kanban.prototype._checkMultikey = function (columnTd) {
        var index = columnTd.index(), key;
        key = this.model.columns[index]["key"];
        key = typeof (key) == "object" ? key : key.split(",");
        if (key.length > 1)
            return true;
        else
            return false;
    };
    Kanban.prototype._destroy = function () {
        this.element.off();
        this.element.find(".e-kanbanheader").find(".e-headercontent")
            .add(this.getContent().find(".e-content")).off('scroll');
        if (!ej.isNullOrUndefined(this._filterToolBar))
            this._filterToolBar.ejToolbar("destroy");
        if (!ej.isNullOrUndefined(this._editForm)) {
            var formElement = this._editForm.find('.e-field'), $editElement, rteElement;
            for (var i = 0; i < formElement.length; i++) {
                $editElement = $(formElement[i]);
                if ($editElement.hasClass('e-ejinputtext'))
                    this.element.find('.e-ejinputtext').remove();
                if ($editElement.hasClass('e-kanbantextarea'))
                    this.element.find('.e-kanbantextarea').remove();
                if ($editElement.hasClass('e-dropdownlist'))
                    $editElement.ejDropDownList("destroy");
                if ($editElement.hasClass("e-numerictextbox"))
                    $editElement.ejNumericTextbox("destroy");
                rteElement = $editElement.parent('div').find("textarea.e-rte");
                if (rteElement.length) {
                    rteElement.ejRTE("destroy");
                    $editElement.parent().find('textarea').remove();
                }
            }
            $("#" + this._id + "_dialogEdit").ejDialog("destroy");
        }
        this.element.ejWaitingPopup("destroy");
        if (this.model.contextMenuSettings.enable) {
            $("#" + this._id + "_Context").ejMenu('destroy');
            $("#" + this._id + "_Context").remove();
        }
        this.element.children().remove();
        if (this.model.isResponsive)
            $(window).off("resize", $.proxy(this.kanbanWindowResize, this));
    };
    Kanban.prototype._menu = function (sender) {
        this.KanbanContext && this.KanbanContext._kanbanMenu(sender, this);
    };
    Kanban.prototype._setModel = function (options) {
        this.KanbanCommon._kanbanSetModel(options, this);
    };
    Kanban.prototype._onToolbarClick = function (sender) {
        var $kanbanEle = $(this["itemsContainer"]).closest(".e-kanban"), kObj = sender.type == "keyup" ? this : $kanbanEle.data("ejKanban");
        kObj["KanbanCommon"]._kanbanToolbarClick(sender, kObj);
    };
    Kanban.prototype._showToolTip = function (event) {
        var kObj = this;
        if (kObj.model.tooltipSettings.enable) {
            if ($(event.target).hasClass('e-kanbantooltip'))
                return;
            var data, queryManager, kTooltip = kObj.element.find('.e-kanbantooltip'), template = ej.isNullOrUndefined(kObj.model.tooltipSettings.template);
            if (template && !($(event.target).hasClass('e-tag') || $(event.target).hasClass('e-text') || $(event.target).closest('.e-primarykey').length > 0))
                return;
            if (template)
                kTooltip.html($(event.target).text()).removeClass("e-tooltiptemplate");
            else {
                kTooltip.addClass("e-tooltiptemplate");
                queryManager = new ej.DataManager(kObj._currentJsonData);
                data = queryManager.executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, $(event.currentTarget).attr("id")));
                kTooltip.html($(kObj.model.tooltipSettings.template).render(data[0]));
            }
            var xPos = !ej.isNullOrUndefined(event.originalEvent) ? event.pageX : event.originalEvent.clientX;
            var yPos = !ej.isNullOrUndefined(event.originalEvent) ? event.pageY : event.originalEvent.clientY;
            var tooltipdivelmt = $(kObj.element).find('.e-kanbantooltip');
            xPos = ((xPos + tooltipdivelmt.width()) < $(kObj.element).width()) ? (xPos) : (xPos - tooltipdivelmt.width());
            yPos = ((yPos + tooltipdivelmt.height()) < $(kObj.element).height()) ? (yPos) : (yPos - tooltipdivelmt.height());
            tooltipdivelmt.css("left", xPos);
            tooltipdivelmt.css("top", yPos);
            if (kObj.model.enableRTL == true)
                tooltipdivelmt.addClass("e-rtl");
            $(kObj.element).find('.e-kanbantooltip').show();
        }
    };
    Kanban.prototype._hideToolTip = function () {
        if (this.model.tooltipSettings.enable)
            this.element.find('.e-kanbantooltip').hide();
    };
    Kanban.prototype.showColumns = function (c) {
        var args = {}, key, hidden = "_hiddenColumns", visible = "_visibleColumns";
        key = typeof (c) == "string" ? this.getColumnByHeaderText(c) : this.getColumnByHeaderText(c[0]);
        this.KanbanCommon._showExpandColumns(key, c, hidden, visible);
        this.KanbanCommon._showhide(this[visible], "show");
        this.KanbanCommon._renderLimit();
        this.KanbanCommon._totalCount();
        if (this.model.stackedHeaderRows.length > 0) {
            this.KanbanCommon._refreshStackedHeader();
        }
    };
    Kanban.prototype.print = function (singleCard) {
        var args = {}, elementClone;
        args["requestType"] = "print";
        this._trigger("actionBegin", args);
        if (!ej.isNullOrUndefined(this.element.find("#" + this._id + "_externalEdit")))
            this.element.find("#" + this._id + "_externalEdit").css("display", "none");
        var elementClone = this.element.clone();
        elementClone.find(".e-kanbantouchbar").remove();
        if (this.model.allowScrolling) {
            var scrollWidth = this.model.scrollSettings.width, scrollHeight = this.model.scrollSettings.height;
            if (this.getScrollObject().isVScroll() || this.getScrollObject().isHScroll()) {
                var scrollContent = this.getContent().find('.e-content')[0];
                elementClone.find('.e-kanbancontent').height(scrollContent.scrollHeight);
                elementClone.find('.e-kanbancontent').ejScroller({ width: scrollContent.scrollWidth, height: scrollContent.scrollHeight });
                elementClone.width(scrollContent.scrollWidth);
            }
        }
        if (!ej.isNullOrUndefined(this.model.filterSettings) || this.model.allowSearching || this.model.allowPrinting || !ej.isNullOrUndefined(this.model.customToolbarItems))
            elementClone.find(".e-kanbantoolbar").remove();
        elementClone.find(".e-kanbancontent div:first").nextAll().remove();
        if (singleCard) {
            var singleCard, column, card;
            if (typeof singleCard == "string" || typeof singleCard == "number")
                singleCard = this.element.find('div.e-kanbancard[id=' + singleCard + ']');
            elementClone.find(".e-kanbanheader").remove();
            column = singleCard.parent().clone(), card = singleCard.clone();
            column.children().remove();
            elementClone.find('table[role="kanban"]').remove();
            elementClone.find(".e-kanbancontent").children().append(column.append(card));
            elementClone.css("border-style", "none");
            if (this.model.allowScrolling) {
                elementClone.css({ "width": "auto", "height": "auto" });
                elementClone.find(".e-kanbancontent").css({ "width": "auto", "height": "auto" });
            }
            else
                elementClone.find(".e-kanbancard").css("width", "30%");
        }
        var printWin = window.open('', 'print', "height=452,width=1024,tabbar=no");
        args = { requestType: "print", element: elementClone };
        this._trigger("beforePrint", args);
        if (!ej.isNullOrUndefined(args["element"]))
            elementClone = args["element"];
        ej.print(elementClone, printWin);
        this._trigger("actionComplete", args);
    };
    Kanban.prototype._kbnAdaptClickHandler = function (e) {
        if (this.KanbanAdaptive)
            this.KanbanAdaptive._adaptiveKbnClick(e);
    };
    Kanban.prototype._kbnTouchEndHandler = function (e) {
        var clone = this.element.find('.e-draggedcard');
        if (clone.length > 0)
            clone.remove();
        this._cardSelect = 'null';
    };
    ;
    Kanban.prototype._kbnTouchClick = function (e) {
        if (this.model.selectionType == "multiple") {
            if (this._kTouchBar.is(':visible') && (!$(e.target).hasClass('e-cardselection') && $(e.target).parents('.e-cardselection').length <= 0 && !$(e.target).hasClass('e-cardtouch') && $(e.target).parents('.e-cardtouch').length <= 0) && !this._kTouchBar.find(".e-cardtouch").hasClass("e-spanclicked"))
                this._kTouchBar.hide();
        }
        if (e.type == 'touchstart')
            this._cardSelect = 'touch';
    };
    Kanban.prototype._kbnHoldHandler = function (e) {
        if (this.model.enableTouch && ($(e.target).hasClass('e-kanbancard') || $(e.target).parents('.e-kanbancard').length > 0) && (e.type == "taphold" && e.pointerType == "touch")) {
            this._cardSelect = 'hold';
            var target = $(e.target), clonedElement = null;
            if ($(e.target).parents('.e-kanbancard').length > 0)
                target = $(e.target).parents('.e-kanbancard');
            if (this.KanbanDragAndDrop) {
                clonedElement = this.KanbanDragAndDrop._createCardClone(clonedElement, target);
                clonedElement.css({ 'position': 'absolute', 'top': e.originalEvent.changedTouches[0].pageY, 'left': e.originalEvent.changedTouches[0].pageX });
                clonedElement.addClass('e-left-rotatecard');
            }
        }
    };
    Kanban.prototype._swipeKanban = function (e) {
        if (this.element.hasClass('e-responsive') && this._kbnTransitionEnd && this.element.find('.e-targetclone').length == 0) {
            switch (e.type) {
                case "swipeleft":
                    this.KanbanAdaptive._kbnLeftSwipe();
                    break;
                case "swiperight":
                    this.KanbanAdaptive._kbnRightSwipe();
                    break;
            }
        }
    };
    Kanban.prototype._wireEvents = function () {
        this._on(this.element, ($.isFunction($.fn.tap) && this.model.enableTouch) ? "tap" : "click", "", this._clickHandler);
        this._on($("#" + this._id + "_searchbar"), "keyup", "", this._onToolbarClick);
        this._on($(document), 'click touchstart', "", this._kbnTouchClick);
        this._on(this.element, "taphold", "", this._kbnHoldHandler);
        this._on(this.element, "touchend", "", this._kbnTouchEndHandler);
        if (this.KanbanAdaptive) {
            this._on(this.element, "swipeleft swiperight", ".e-kanbancontent", $.proxy(this._swipeKanban, this));
        }
        if (this.KanbanContext)
            this._on(this.element, "contextmenu", "", this.KanbanContext._kbnBrowserContextMenu);
        if (this.KanbanFilter)
            this._on($("#" + this._id + "_searchbar"), "keypress", "", this.KanbanFilter._onToolbarKeypress);
        if (this.KanbanEdit) {
            if (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version, 10) == 8)
                $(window).on("resize", $.proxy(this.kanbanWindowResize, this));
            this._enableEditingEvents();
        }
        this._enableCardHover();
        if (this.model.tooltipSettings.enable) {
            this._on(this.element, "mouseover", ".e-kanbancard", this._showToolTip);
            this._on(this.element, "mouseout", ".e-kanbancard", this._hideToolTip);
        }
        if (this.model.allowKeyboardNavigation) {
            this.element[0].tabIndex = this.element[0].tabIndex == -1 ? 0 : this.element[0].tabIndex;
            this.element[0].accessKey = (!ej.isNullOrUndefined(this.element[0].accessKey) && this.element[0].accessKey != "") ? this.element[0].accessKey : "e";
            this._on(this.element, "keyup", "", undefined);
        }
    };
    Kanban.prototype._enableEditingEvents = function () {
        if (this.model.editSettings.allowEditing)
            this._on(this.element, ($.isFunction($.fn.doubletap) && this.model.enableTouch) ? "doubletap" : "dblclick", ".e-kanbancard", this._cardDblClickHandler);
        else
            this._off(this.element, "dblclick doubletap", ".e-kanbancard");
        if (this.model.editSettings.allowAdding)
            this._on(this.element, "dblclick doubletap", ".e-kanbancontent .e-columnrow .e-rowcell", this._cellDblClickHandler);
        else
            this._off(this.element, "dblclick doubletap", ".e-kanbancontent .e-columnrow .e-rowcell");
        if (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding)
            this._on($("#" + this._id + "_dialogEdit"), "click keypress", "#EditDialog_" + this._id + "_Save ,#EditDialog_" + this._id + "_Cancel", this._clickHandler);
        else
            this._off($("#" + this._id + "_dialogEdit"), "click", "#EditDialog_" + this._id + "_Save ,#EditDialog_" + this._id + "_Cancel");
    };
    Kanban.prototype._cardDblClickHandler = function (args) {
        this._cardEditClick = true;
        this._dblArgs = args;
        if (!this._isEdit)
            this.KanbanEdit.startEdit($(args.target).closest('.e-kanbancard'));
    };
    Kanban.prototype._cellDblClickHandler = function (args) {
        if ($(args.target).hasClass('e-rowcell')) {
            this._isAddNewClick = true;
            this._newCard = $(args.target);
            this.KanbanEdit.addCard();
        }
    };
    Kanban.prototype._enableCardHover = function () {
        if (this.model.allowHover)
            this._on(this.element, "mouseenter mouseleave", ".e-columnrow .e-kanbancard", this._cardHover);
        else
            this._off(this.element, "mouseenter mouseleave", ".e-columnrow .e-kanbancard");
    };
    Kanban.prototype.refreshColumnConstraints = function () {
        this.KanbanCommon._renderLimit();
        if (this.KanbanSwimlane && this._enableSwimlaneCount)
            this.KanbanSwimlane._swimlaneLimit(args);
        this._enableSwimlaneCount = false;
    };
    Kanban.prototype.hideColumns = function (c) {
        var i, index, count = 0, args = {}, key, hidden = "_hiddenColumns", visible = "_visibleColumns";
        for (i = 0; i < this._visibleColumns.length; i++) {
            index = $.inArray(this._collapsedColumns[i], this._visibleColumns);
            if (index != -1)
                count++;
        }
        if (this._visibleColumns.length - 1 > count) {
            key = typeof (c) == "string" ? this.getColumnByHeaderText(c) : this.getColumnByHeaderText(c[0]);
            this.KanbanCommon._hideCollapseColumns(key, c, hidden, visible);
            this.KanbanCommon._showhide(this[hidden], "hide");
            if (this.model.stackedHeaderRows.length > 0)
                this.KanbanCommon._refreshStackedHeader();
        }
        else {
            if (this._visibleColumns.length == 1)
                return;
            else if (this._visibleColumns[0] == c)
                this.KanbanCommon._expandColumns(this._visibleColumns[1]);
            else
                this.KanbanCommon._expandColumns(this._visibleColumns[0]);
            this.hideColumns(c);
        }
        this.KanbanCommon._renderLimit();
        this.KanbanCommon._totalCount();
        this.KanbanCommon._stackedHeadervisible();
    };
    Kanban.prototype._cardHover = function (e) {
        var $target = $(e.target), $kanbanRows = $(this._kanbanRows), parentDiv = $($target).closest(".e-kanbancard");
        if (parentDiv.length <= 0)
            return false;
        if (this.model.allowHover) {
            if (e.type == "mouseenter") {
                if (!ej.isNullOrUndefined($kanbanRows))
                    parentDiv.index() != -1 && parentDiv.addClass("e-hover");
            }
            else
                $kanbanRows.find(".e-kanbancard").removeClass("e-hover");
        }
        return false;
    };
    Kanban.prototype.toggleCard = function ($target) {
        var $curCard;
        if (typeof $target == "string" || typeof $target == "number") {
            $curCard = this.element.find('div.e-kanbancard[id=' + $target + ']');
            this.KanbanCommon._toggleCardByTarget($($curCard).find(".e-cardheader .e-icon"));
        }
        else if (typeof $target == "object" && $target[0].nodeName != "DIV") {
            for (var i = 0; i < $target.length; i++) {
                $curCard = this.element.find('div.e-kanbancard[id=' + $target[i] + ']');
                this.KanbanCommon._toggleCardByTarget($($curCard).find(".e-cardheader .e-icon"));
            }
        }
        else
            this.KanbanCommon._toggleCardByTarget($target);
    };
    Kanban.prototype.toggleColumn = function ($target) {
        if (typeof $target === "string" || "object" && ($target[0].nodeName != "DIV" && $target[0].nodeName != "TD"))
            this.KanbanCommon._toggleField($target);
        else if ($target[0].nodeName == "TD")
            this.KanbanCommon._toggleField($target.closest(".e-shrink").find(".e-shrinkheader").text().split("[")[0]);
        else {
            var stackedHeaderCel, colHeader, headerCell, i, stackedHeaderColumns, cols = this.model.columns, cText;
            if (this.model.stackedHeaderRows.length)
                stackedHeaderColumns = this.model.stackedHeaderRows[0].stackedHeaderColumns;
            headerCell = $target.closest(".e-headercell").not(".e-stackedHeaderCell");
            colHeader = this.element.find(".e-columnheader").not(".e-stackedHeaderRow").find(".e-hide");
            if (headerCell.length > 0)
                this.KanbanCommon._toggleField(cols[headerCell.index()].headerText);
            else if ($target.closest(".e-shrink").find(".e-shrinkheader").length > 0) {
                for (i = 0; i < colHeader.length; i++) {
                    cText = $(colHeader[i]).find(".e-headerdiv").text().split('[')[0];
                    if (cText == $target.closest(".e-shrink").find(".e-shrinkheader").text().split("[")[0]) {
                        $(colHeader[i]).next().find(".e-clcollapse").addClass("e-clexpand");
                        $(colHeader[i]).next().find(".e-clexpand").removeClass("e-clcollapse");
                        this.KanbanCommon._toggleField(cText);
                    }
                }
            }
            else if ($target.closest(".e-stackedHeaderRow").length > 0) {
                stackedHeaderCel = $target.closest(".e-stackedHeaderCell");
                for (i = 0; i < stackedHeaderColumns.length; i++)
                    if (stackedHeaderColumns[i].headerText == $(stackedHeaderCel).text()) {
                        if (stackedHeaderCel.hasClass("e-collapse"))
                            this.element.find(".e-stackedHeaderCell").eq(i).removeClass("e-collapse");
                        else
                            this.element.find(".e-stackedHeaderCell").eq(i).addClass("e-collapse");
                        this.KanbanCommon._toggleField(stackedHeaderColumns[i].column.split(","));
                    }
            }
        }
        if (this.element.find(".e-targetdragclone").is(":visible")) {
            var nextEle = this.element.find(".e-targetdragclone").next(".e-kanbancard").eq(0);
            if (nextEle.length > 0)
                this.element.find(".e-targetdragclone").width(nextEle.width());
            else
                this.element.find(".e-targetdragclone").width("");
        }
    };
    Kanban.prototype._clickevent = function (sender) {
        this.KanbanContext && this.KanbanContext._kanbanContextClick(sender, this);
    };
    Kanban.prototype._clickHandler = function (e) {
        var $target = $(e.target), parentDiv;
        var columnIndex = $target.hasClass("e-rowcell") ? $target.index() : $target.closest(".e-rowcell").index();
        var rowIndex = this.getIndexByRow($target.closest("tr.e-columnrow"));
        parentDiv = $target.closest('.e-kanbancard');
        if ($(e.target).hasClass("e-customaddbutton") || $(e.target).parents(".e-customaddbutton").length > 0) {
            this._isAddNewClick = true;
            this._newCard = $(e.target).parents('.e-rowcell');
            if (this.KanbanEdit)
                this.KanbanEdit.addCard();
        }
        if ($target.hasClass("e-cardexpand") || $target.hasClass("e-cardcollapse") || $target.hasClass("e-expandcollapse"))
            this.toggleCard($target);
        if (($target.closest(".e-clexpand").length || $target.closest(".e-clcollapse").length || $target.closest(".e-shrink").length || $target.closest(".e-stackedHeaderRow").length) && this.model.allowToggleColumn)
            this.toggleColumn($target);
        if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey) && ($target.hasClass("e-slexpandcollapse") || $target.hasClass("e-slexpand") || $target.hasClass("e-slcollapse")))
            this.KanbanSwimlane.toggle($target);
        if (this.model.allowSelection && this.KanbanSelection && parentDiv.length > 0 && $target.closest(".e-expandcollapse").length <= 0) {
            var parentIndex = $(parentDiv.parent()).children().eq(0).hasClass("e-limits") ? parentDiv.index() - 1 : parentDiv.index();
            if (this.model.selectionType == "single")
                this.KanbanSelection._cardSelection([[rowIndex, [columnIndex], [parentIndex]]], parentDiv, e);
            else if (this.model.selectionType == "multiple") {
                if (e.shiftKey || e.ctrlKey || this._enableMultiTouch) {
                    if (this._currentRowCellIndex.length == 0 || rowIndex == this._currentRowCellIndex[0][0])
                        this.KanbanSelection._cardSelection([[rowIndex, [columnIndex], [parentIndex]]], parentDiv, e);
                }
                else
                    this.KanbanSelection._cardSelection([[rowIndex, [columnIndex], [parentIndex]]], parentDiv, e);
            }
        }
        if (parentDiv.length > 0)
            this.KanbanCommon._cardClick($target, parentDiv);
        if ($target.attr('id') == this._id + "_Cancel" || $target.parent().attr("id") == this._id + "_closebutton")
            this.KanbanEdit.cancelEdit();
        if ($target.attr('id') == this._id + "_Save")
            this.KanbanEdit.endEdit();
        if ($target.hasClass("e-cardtouch")) {
            if (!$target.hasClass("e-spanclicked")) {
                $target.addClass("e-spanclicked");
                this._enableMultiTouch = true;
            }
            else {
                $target.removeClass("e-spanclicked");
                this._enableMultiTouch = false;
                this._kTouchBar.hide();
            }
        }
        this.KanbanCommon._kbnHeaderAndCellEvents($target);
    };
    Kanban.prototype.getRowByIndex = function (index) {
        if (!ej.isNullOrUndefined(index))
            return $((this._columnRows)[index]);
        return;
    };
    Kanban.prototype.getScrollObject = function () {
        if (this._scrollObject == null || ej.isNullOrUndefined(this._scrollObject.model))
            this._scrollObject = this.getContent().ejScroller("instance");
        return this._scrollObject;
    };
    Kanban.prototype.getIndexByRow = function ($tr) {
        return $(this._columnRows).index($tr);
    };
    Kanban.prototype._initialize = function () {
    };
    Kanban.prototype._initPrivateProperties = function () {
        this.currentViewData = null;
        this._filterCollection = [];
        this._collapsedColumns = [];
        this._expandedColumns = [];
        this._dataManager = this._dataSource() instanceof ej.DataManager ? this._dataSource() : this._dataSource() != null ? new ej.DataManager(this._dataSource()) : null;
        this._originalWidth = this.element.width();
        this._recordsCount = this._dataSource() !== null ? this._dataSource().length : 0;
        ej.Kanban.Locale["default"] = ej.Kanban.Locale["en-US"] = {
            EmptyCard: "No cards to display",
            SaveButton: "Save",
            CancelButton: "Cancel",
            EditFormTitle: "Details of ",
            AddFormTitle: "Add New Card",
            SwimlaneCaptionFormat: "- {{:count}}{{if count == 1 }} item {{else}} items {{/if}}",
            FilterSettings: "Filters:",
            FilterOfText: "of",
            Max: "Max",
            Min: "Min",
            Cards: "  Cards",
            ItemsCount: "Items Count :",
            Unassigned: "Unassigned"
        };
        this.localizedLabels = this._getLocalizedLabels();
    };
    Kanban.prototype._init = function () {
        this._initPrivateProperties();
        this._trigger("load");
        if (ej.isNullOrUndefined(this.model.query) || !(this.model.query instanceof ej.Query))
            this.model.query = new ej.Query();
        this._initSubModules();
        this._initialize();
        if (this.model.columns.length == 0)
            return false;
        if (this.KanbanAdaptive)
            this.KanbanAdaptive._kbnAdaptSwimlaneData();
        this.element.removeClass("e-kanbanscroll");
        if (this.KanbanScroll)
            this.KanbanScroll._initScrolling();
        this._checkDataBinding();
    };
    Kanban.prototype._initSubModules = function () {
        var model = this.model;
        this.KanbanCommon = new ej.KanbanFeatures.Common(this);
        if (model.allowDragAndDrop)
            this.KanbanDragAndDrop = new ej.KanbanFeatures.DragAndDrop(this);
        if (model.editSettings.allowEditing || model.editSettings.allowAdding)
            this.KanbanEdit = new ej.KanbanFeatures.Edit(this);
        if (model.isResponsive)
            this.KanbanAdaptive = new ej.KanbanFeatures.Adaptive(this);
        if (model.isResponsive && model.minWidth > 0)
            model.allowScrolling = true;
        if (model.allowScrolling)
            this.KanbanScroll = new ej.KanbanFeatures.Scroller(this);
        if (model.contextMenuSettings.enable)
            this.KanbanContext = new ej.KanbanFeatures.Context(this);
        if (model.fields && !ej.isNullOrUndefined(model.fields.swimlaneKey))
            this.KanbanSwimlane = new ej.KanbanFeatures.Swimlane(this);
        if (model.allowSelection)
            this.KanbanSelection = new ej.KanbanFeatures.Selection(this);
        if (model.filterSettings.length > 0 || model.allowFiltering || model.customToolbarItems.length > 0 || model.allowPrinting || model.allowSearching)
            this.KanbanFilter = new ej.KanbanFeatures.Filter(this);
    };
    Kanban.prototype.kanbanWindowResize = function (e) {
        if (!this.KanbanAdaptive)
            return;
        if (this._kbnDdlWindowResize && ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version, 10) == 8)
            e.stopImmediatePropagation();
        var toolbar = this.element.find('.e-kanbantoolbar'), curItem = this.model.fields.swimlaneKey, searchBar;
        if (this.model.isResponsive && (ej.isNullOrUndefined(this.model.minWidth) || this.model.minWidth == 0)) {
            var $filterWin = $('.e-kanbanfilter-window'), browResponsive = true;
            if (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version, 10) <= 9)
                browResponsive = false;
            if (browResponsive) {
                if (window.matchMedia("(max-width: 480px)").matches) {
                    if (this.model.isResponsive && this.kanbanContent.hasClass('e-scroller'))
                        this.kanbanContent.data('ejScroller').destroy();
                    if (!this.element.hasClass('e-responsive')) {
                        this.element.addClass('e-responsive');
                        toolbar.css('display', 'table');
                        toolbar.find('.e-searchdiv').hide();
                        toolbar.find('.e-search').css({ 'border': 'none' });
                        if (!ej.isNullOrUndefined(curItem))
                            this.KanbanAdaptive._kbnAdaptSwimlaneDdl();
                        if (this.model.filterSettings.length > 0) {
                            this.KanbanAdaptive._kbnAdaptFilterWindow();
                            this._kbnFilterCollection = this._filterCollection.slice();
                        }
                        this._on($('.e-swimlane-window,.e-kanbanfilter-window,.e-kanbantoolbar'), ($.isFunction($.fn.tap) && this.model.enableTouch) ? "tap" : "click", "", this._kbnAdaptClickHandler);
                    }
                    this.KanbanAdaptive._columnTimeoutAdapt();
                    if (!this.element.hasClass('e-swimlane-responsive')) {
                        var rowCell = this.element.find('.e-rowcell:visible');
                        for (var i = 0; i < rowCell.length; i++) {
                            if (rowCell.eq(i).height() + rowCell.eq(i).offset().top > $(window).height()) {
                                var cellScrollContent = rowCell.eq(i).find('.e-cell-scrollcontent');
                                if (cellScrollContent.length > 0) {
                                    cellScrollContent.ejScroller({ height: $(window).height() - (this.kanbanContent.offset().top + 2), buttonSize: 0, scrollerSize: 9, enableTouchScroll: true, autoHide: true });
                                    rowCell.eq(i).find('.e-shrinkheader').prependTo(rowCell.eq(i));
                                }
                                else {
                                    cellScrollContent = ej.buildTag("div.e-cell-scrollcontent", "<div></div>");
                                    rowCell.eq(i).append(cellScrollContent);
                                    cellScrollContent.children().append(rowCell.eq(i).children(":not('.e-cell-scrollcontent')"));
                                    cellScrollContent.ejScroller({
                                        height: $(window).height() - (this.kanbanContent.offset().top + 2),
                                        thumbStart: $.proxy(this._kbnThumbStart, this),
                                        buttonSize: 0,
                                        scrollerSize: 9,
                                        enableTouchScroll: true,
                                        autoHide: true
                                    });
                                    rowCell.eq(i).find('.e-shrinkheader').prependTo(rowCell.eq(i));
                                }
                            }
                        }
                    }
                    searchBar = this.element.find('.e-searchbar');
                    if (searchBar.length > 0) {
                        if (searchBar.find('.e-ejinputtext').val().length > 0) {
                            var $target = searchBar.find('.e-searchitem');
                            $target.addClass('e-searchfind');
                            $target.prev().show();
                            searchBar.siblings().hide();
                            if (searchBar.find('.e-adapt-search').length == 0) {
                                var searchDiv = ej.buildTag('div.e-icon e-adapt-search e-searchfind', "", {}), cancelDiv;
                                cancelDiv = ej.buildTag('div.e-icon e-adapt-cancel e-cancel', "", {});
                                $target.siblings('.e-searchdiv').append(cancelDiv).prepend(searchDiv);
                            }
                            $target.parents('.e-search').css({ 'border': '' });
                            $target.parents('body').removeClass('e-kbnwindow-modal');
                            $target.parents('.e-kanbantoolbar').addClass('e-adaptive-search');
                            searchBar.find('.e-adapt-cancel').show();
                            $target.hide();
                        }
                    }
                    if (this.model.filterSettings.length > 0) {
                        var filters = this.element.find('.e-quickfilter').nextAll('.e-tooltxt');
                        for (var i = 0; i < filters.length; i++) {
                            if (filters.eq(i).hasClass('e-select')) {
                                var index = filters.index(filters.eq(i)), flIcon = this.element.find('.e-kanbanfilter-icon');
                                this._kbnAutoFilterCheck = true;
                                $filterWin.find('.e-filter-content span.e-chkbox-wrap').eq(index).click();
                                this._kbnAutoFilterCheck = false;
                                if (!flIcon.hasClass('e-kbnclearfl-icon'))
                                    flIcon.addClass('e-kbnclearfl-icon');
                                filters.eq(i).removeClass('e-select');
                            }
                        }
                    }
                    if (!ej.isNullOrUndefined(curItem))
                        this.kanbanContent.ejScroller({
                            height: $(window).height() - (this.headerContent.offset().top + this.headerContent.height() + 5),
                            scroll: $.proxy(this._freezeSwimlane, this),
                            thumbStart: $.proxy(this._kbnThumbStart, this),
                            buttonSize: 0,
                            scrollerSize: 9,
                            enableTouchScroll: true,
                            autoHide: true
                        });
                    if (!this.element.hasClass('e-swimlane-responsive')) {
                        var scrollEle = this.element.find('.e-rowcell .e-cell-scrollcontent:visible');
                        for (var i = 0; i < scrollEle.length; i++) {
                            var scrollObj = $(scrollEle[i]).data('ejScroller');
                            if (!ej.isNullOrUndefined(scrollObj))
                                scrollObj.refresh();
                        }
                    }
                    var kbnDialog = this.element.find('.e-kanbandialog'), slWindow = this.element.find('.e-swimlane-window');
                    if (kbnDialog.is(':visible') && this.KanbanAdaptive)
                        this.KanbanAdaptive._setAdaptEditWindowHeight();
                    if (!ej.isNullOrUndefined(curItem) && slWindow.is(':visible')) {
                        var slScroller = this.element.find('.e-slwindow-scrollcontent'), top = this.headerContent.offset().top;
                        slScroller.ejScroller({ height: $(window).height() - slScroller.offset().top, buttonSize: 0, scrollerSize: 9, enableTouchScroll: true, autoHide: true });
                        slScroller.data('ejScroller').refresh();
                        slWindow.css({ height: $(window).height() - top });
                    }
                    if (this.model.allowSearching && ej.browserInfo().name == "webkit")
                        this.element.find('.e-searchitem').addClass('e-webkitadapt-search');
                }
                else {
                    if (this.KanbanAdaptive) {
                        var toolBar = $('#' + this._id + "_toolbarItems");
                        if (toolBar.parents('.e-kanban').length == 0) {
                            toolBar.removeClass('e-kbntoolbar-body').prependTo(this.element);
                            $('#' + this._id + "_slWindow").removeClass('e-kbnslwindow-body').appendTo(this.element);
                        }
                        this.KanbanAdaptive._removeKbnAdaptItems();
                        this.element.find('.e-webkitadapt-search').removeClass('e-webkitadapt-search');
                        if (this.model.allowScrolling) {
                            this.KanbanCommon._setWidthToColumns();
                            this.KanbanScroll._renderScroller();
                        }
                    }
                }
            }
        }
        else {
            var width, height, winWidth, winHeight, elemHeight;
            this.model.scrollSettings.width = this._originalScrollWidth;
            this.element.outerWidth('100%');
            this.getContentTable().width('100%');
            this.getHeaderTable().width('100%');
            width = this.element.outerWidth();
            winWidth = $(window).width() - this.element.offset()['left'];
            winHeight = $(window).height() - this.element.offset()['top'];
            if (toolbar.length > 0)
                winHeight = winHeight - (toolbar.outerHeight() + 25);
            elemHeight = this.headerContent.outerHeight() + this.getContentTable().height();
            var isScroller = this.model.minWidth > width || winWidth <= width || winHeight <= elemHeight;
            if (this.KanbanAdaptive)
                this.KanbanAdaptive._renderResponsiveKanban(isScroller, elemHeight, width, winHeight, winWidth);
        }
    };
    Kanban.prototype._initKanbanRender = function () {
        var proxy = this;
        this._addInitTemplate();
        if (this.model.keySettings)
            $.extend(this.model.keyConfigs, this.model.keySettings);
        this._render();
        this._trigger("dataBound", {});
        if (this.model.contextMenuSettings.enable) {
            if (!this._dataManager.dataSource.offline) {
                var queryPromise = proxy._dataSource().executeQuery(!ej.isNullOrUndefined(proxy.model.fields.swimlaneKey) ? new ej.Query().select([proxy.model.fields.swimlaneKey]) : new ej.Query());
                queryPromise.done(ej.proxy(function (e) {
                    proxy._contextSwimlane = new ej.DataManager(e.result);
                    proxy.KanbanContext._renderContext();
                }));
            }
            else
                this.KanbanContext._renderContext();
        }
        if (this.KanbanEdit) {
            this.KanbanEdit._processEditing();
            if (this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "dialogtemplate")
                this.element.append(this.KanbanEdit._renderDialog());
            else if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate")
                this.element.append(this.KanbanEdit._renderExternalForm());
        }
        if (this.KanbanAdaptive)
            this.KanbanAdaptive._setResponsiveHeightWidth();
        if (this.KanbanSelection)
            this.KanbanSelection._renderKanbanTouchBar();
        this._wireEvents();
        if (this.model.tooltipSettings.enable) {
            this.element.append($("<div class='e-kanbantooltip'></div>"));
            this.element.find('.e-kanbantooltip').hide();
        }
        this.initialRender = false;
    };
    Kanban.prototype._render = function () {
        this.element.addClass(this.model.cssClass + "e-widget");
        this._renderContent().insertAfter(this.element.children(".e-kanbanheader"));
        if (this.model.enableTotalCount)
            this.KanbanCommon._totalCount();
        this.KanbanCommon._renderLimit();
        this._enableDragandScroll();
        if (this.initialRender)
            this.KanbanCommon._addLastRow();
    };
    Kanban.prototype._renderHeader = function () {
        var $div = ej.buildTag('div.e-kanbanheader', "", {}, {}), $innerDiv = ej.buildTag('div', "", {}, {}), $colGroup = $(document.createElement('colgroup'));
        if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey))
            $div.addClass("e-slheader");
        if (this.model.allowScrolling)
            $innerDiv.addClass("e-headercontent");
        $div.append($innerDiv);
        var $table = ej.buildTag("table.e-table", "", {}, { cellspacing: "0.25px", role: "kanban" });
        var $thead = ej.buildTag("thead", "", {}, {}), $tbody = ej.buildTag("tbody.e-hide", "", {}, {});
        for (var index = 0; index < this.model.stackedHeaderRows.length; index++) {
            var $tr = this.KanbanCommon._createStackedRow(this.model.stackedHeaderRows[index]);
            $thead.append($tr);
        }
        var $columnHeader = ej.buildTag('tr.e-columnheader', "", {}, {}), $rowBody = $(document.createElement('tr'));
        var columns = this.model.columns;
        this._visibleColumns = [];
        this._expandedColumns = [];
        this._headerColumnNames = {};
        for (var columnCount = 0; columnCount < columns.length; columnCount++) {
            var column = columns[columnCount];
            var $headerCell = ej.buildTag('th.e-headercell', "", {}, { role: "columnheader" });
            var col = document.createElement('col'), bodyCell = document.createElement('td');
            var $headerCellDiv = ej.buildTag('div.e-headercelldiv', "", {}, {});
            var $headerDiv = ej.buildTag('div.e-headerdiv', column["headerText"] != null ? column["headerText"] : column["key"], {}, {});
            if (!ej.isNullOrUndefined(column["headerTemplate"]))
                $headerDiv.html($(column["headerTemplate"]).hide().html());
            var $totalCard, $totalCount, $limit = null;
            if (this.model.enableTotalCount) {
                $totalCard = ej.buildTag("div.e-totalcard", "", {}, {});
                $totalCount = ej.buildTag("span.e-totalcount", "", {}, {});
                if (!ej.isNullOrUndefined(column.totalCount) && !ej.isNullOrUndefined(column.totalCount.text))
                    $totalCard.append(column.totalCount.text + " : ").append($totalCount);
                else
                    $totalCard.append(this.localizedLabels.ItemsCount).append($totalCount);
                $headerCell.append($totalCard);
            }
            if (!ej.isNullOrUndefined(column.constraints)) {
                var isMin = !ej.isNullOrUndefined(column.constraints['min']), isMax = !ej.isNullOrUndefined(column.constraints['max']);
                $limit = ej.buildTag('div.e-limits', "", {}, {});
                if (isMin) {
                    var $min = ej.buildTag("div.e-min", this.localizedLabels.Min, "", {});
                    var $minLimit = ej.buildTag("span.e-minlimit", " " + column.constraints['min'].toString(), "", {});
                    $min.append($minLimit);
                    $limit.append($min);
                }
                if (isMax) {
                    var $max = ej.buildTag("div.e-max", this.localizedLabels.Max, "", {});
                    var $maxLimit = ej.buildTag("span.e-maxlimit", " " + column.constraints['max'].toString(), "", {});
                    $max.append($maxLimit);
                    if (isMin)
                        $limit.append("/");
                    $limit.append($max);
                }
                if (this.model.enableTotalCount && $limit.children().length > 0)
                    $limit.prepend("|");
            }
            $headerCellDiv.append($headerDiv);
            $headerCell.prepend($headerCellDiv);
            $headerCell.append($limit);
            if (this.model.allowToggleColumn) {
                if (columns[columnCount]["isCollapsed"] === true)
                    $headerCell.append(ej.buildTag('div.e-icon e-clcollapse', "", {}, {})).addClass("e-shrinkcol");
                else
                    $headerCell.append(ej.buildTag('div.e-icon e-clexpand', "", {}, {}));
            }
            if (columns[columnCount]["isCollapsed"] === true && this.model.allowToggleColumn) {
                $headerCell.find(".e-headercelldiv,.e-totalcard,.e-limits").addClass("e-hide") && $(col).addClass("e-shrinkcol");
                if ($.inArray(columns[columnCount].headerText, this._collapsedColumns) == -1)
                    this._collapsedColumns.push(columns[columnCount].headerText);
            }
            else {
                $headerCell.find(".e-headercelldiv,.e-totalcard").removeClass("e-hide") && $(col).removeClass("e-shrinkcol");
                if (!ej.isNullOrUndefined(columns[columnCount].constraints) && columns[columnCount].constraints.type == "column")
                    $headerCell.find(".e-limits").removeClass("e-hide");
                else
                    $headerCell.find(".e-limits").addClass("e-hide");
                this._expandedColumns.push(columns[columnCount].headerText);
                columns[columnCount]["isCollapsed"] = false;
            }
            $colGroup.append(col);
            $columnHeader.append($headerCell);
            $rowBody.append(bodyCell);
            if (column["visible"] === false) {
                $headerCell.addClass("e-hide") && $(col).css("display", "none");
                if ($.inArray(column.headerText, this._hiddenColumns) == -1)
                    this._hiddenColumns.push(column.headerText);
            }
            else {
                this._visibleColumns.push(column.headerText);
                column["visible"] = true;
            }
            var curLimits = $headerCell.find('.e-limits'), curTotal = $headerCell.find('.e-totalcard');
            if ($headerCell.find('.e-clexpand').length > 0 || columns[columnCount]["isCollapsed"]) {
                if (curTotal.length == 0 && curLimits.length == 0)
                    $headerCell.addClass('e-toggleonly');
                else if (curTotal.length == 0 && curLimits.children().length == 0)
                    $headerCell.addClass('e-toggleonly');
            }
            var curColumn;
            if ($headerCell.hasClass('e-toggleonly')) {
                for (var l = 0; l < this.model.columns.length; l++) {
                    curColumn = this.model.columns[l];
                    if (!ej.isNullOrUndefined(curColumn.constraints) && (!ej.isNullOrUndefined(curColumn.constraints['min']) || !ej.isNullOrUndefined(curColumn.constraints['max'])))
                        $headerCell.addClass('e-toggle-withoutcount');
                }
            }
            curColumn = this.model.columns[columnCount];
            if (this.model.enableTotalCount || (!ej.isNullOrUndefined(curColumn.constraints) && (!ej.isNullOrUndefined(curColumn.constraints['min']) || !ej.isNullOrUndefined(curColumn.constraints['max'])))) {
                $headerCell.addClass('e-toggle-withcount');
                $columnHeader.addClass('e-header-withcount');
            }
            if (ej.isNullOrUndefined(column["allowDrag"]) || column["allowDrag"] != false)
                column["allowDrag"] = true;
            if (ej.isNullOrUndefined(column["allowDrop"]) || column["allowDrop"] != false)
                column["allowDrop"] = true;
            if (!ej.isNullOrUndefined(column["headerTemplate"]))
                $headerCellDiv.parent().addClass("e-headertemplate");
            if (this.initialRender) {
                if (typeof (column.width) == "string" && column.width.indexOf("%") != -1)
                    this._columnsWidthCollection.push(parseInt(column["width"]) / 100 * this.element.width());
                else {
                    this._columnsWidthCollection.push(column["width"]);
                }
            }
        }
        $thead.append($columnHeader);
        $table.append($colGroup).append($thead);
        $tbody.append($rowBody);
        $table.append($tbody);
        $innerDiv.append($table);
        this.setHeaderContent($div);
        this.setHeaderTable($table);
        return $div;
    };
    Kanban.prototype._renderContent = function () {
        var $div = ej.buildTag('div.e-kanbancontent', "", {}, {}), $innderDiv = ej.buildTag('div', "", {}, {}), $tbody = ej.buildTag("tbody", "", {}, {});
        var $table = ej.buildTag('table.e-table', "", {}, { cellspacing: "0.25px", role: "kanban" });
        $table.append(this.getHeaderTable().find('colgroup').clone()).append($tbody);
        $innderDiv.append($table);
        $div.append($innderDiv);
        this.setContent($div);
        this.setContentTable($table);
        $table.attr("role", "kanban");
        var args = { requestType: "refresh" };
        this.sendDataRenderingRequest(args);
        return $div;
    };
    Kanban.prototype.refreshTemplate = function () {
        this._addInitTemplate();
        if (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding)
            this.KanbanEdit._addDialogEditingTemplate();
    };
    Kanban.prototype.getContentTable = function () {
        return this.contentTable;
    };
    Kanban.prototype.setContentTable = function (value) {
        this.contentTable = value;
    };
    Kanban.prototype.getVisibleColumnNames = function () {
        return this._visibleColumns;
    };
    Kanban.prototype.getHeaderContent = function () {
        return this.headerContent;
    };
    Kanban.prototype.setHeaderContent = function (value) {
        this.headerContent = value;
    };
    Kanban.prototype.getContent = function () {
        return this.kanbanContent;
    };
    Kanban.prototype.setContent = function (value) {
        this.kanbanContent = value;
    };
    Kanban.prototype._initDataSource = function () {
        var proxy = this;
        this._isLocalData = (!(this._dataSource() instanceof ej.DataManager) || (this._dataSource().dataSource.offline));
        this._ensureDataSource();
        this._trigger("actionBegin");
        var queryPromise = this._dataSource().executeQuery(this.model.query);
        if (!this.element.is(":visible"))
            this.element.ejWaitingPopup("hide");
        queryPromise.done(ej.proxy(function (e) {
            proxy.element.ejWaitingPopup("hide");
            proxy._currentJsonData = proxy.currentViewData = e.result;
            if (e.count == 0 && e.result.length)
                proxy._recordsCount = e.result.length;
            else
                proxy._recordsCount = e.count;
            proxy._initKanbanRender();
        }));
    };
    Kanban.prototype.columns = function (details, keyValue, action) {
        if (ej.isNullOrUndefined(details))
            return;
        var isString = false;
        if (typeof details === "string") {
            details = [details];
            isString = true;
        }
        else if (details instanceof Array && details.length && typeof details[0] === "string")
            isString = true;
        for (var i = 0; i < details.length; i++) {
            var index = $.inArray(this.getColumnByHeaderText(isString ? details[i] : details[i]["headerText"]), this.model.columns);
            if (action == "add" || ej.isNullOrUndefined(action)) {
                if (index == -1)
                    this.model.columns.push(isString ? { headerText: details[i], key: keyValue } : details[i]);
                else
                    this.model.columns[index] = isString ? { headerText: details[i], key: keyValue } : details[i];
            }
            else {
                if (index != -1)
                    this.model.columns.splice(index, 1);
            }
        }
        var $header = this.element.find(".e-kanbanheader");
        this._columnsWidthCollection = [];
        for (var columnCount = 0; columnCount < this.model.columns.length; columnCount++)
            if (!ej.isNullOrUndefined(this.model.columns[columnCount]["width"])) {
                this._columnsWidthCollection.push(this.model.columns[columnCount]["width"]);
            }
        this.element[0].replaceChild(this._renderHeader()[0], $header[0]);
        var args = { requestType: 'addcolumn' };
        this.refresh(true);
        this.KanbanScroll && this.KanbanScroll._refreshHeaderScroller();
        this.KanbanCommon._totalCount();
    };
    Kanban.prototype._checkDataBinding = function () {
        if (!this.model.columns.length && (((this._dataSource() == null || !this._dataSource().length) && !(this._dataSource() instanceof ej.DataManager)) || ((this._dataSource() instanceof ej.DataManager) && this._dataManager.dataSource.url == undefined && !this._dataSource().dataSource.json.length))) {
            return;
        }
        if (!ej.isNullOrUndefined(this.model.keyField))
            this._addColumnFilters();
        this.initialRender = true;
        if (this.model.cssClass != null)
            this.element.addClass(this.model.cssClass);
        if (this.model.filterSettings.length > 0 || this.model.allowSearching || this.model.customToolbarItems.length > 0 || this.model.allowPrinting)
            this.element.append(this._renderToolBar());
        var columns = this.model.columns;
        if (columns && columns.length) {
            this.element.append(this._renderHeader());
            this.KanbanCommon._stackedHeadervisible();
        }
        if ($.isFunction($.fn.ejWaitingPopup)) {
            this.element.ejWaitingPopup({ showOnInit: false });
            $("#" + this._id + "_WaitingPopup").addClass("e-kanbanwaitingpopup");
        }
        if (this._dataSource() instanceof ej.DataManager) {
            this.element.ejWaitingPopup("show");
            if (this._dataSource().ready != undefined) {
                var proxy = this;
                this._dataSource().ready.done(function (args) {
                    proxy._initDataSource();
                    proxy.model.dataSource = new ej.DataManager(args.result);
                });
            }
            else {
                this.element.ejWaitingPopup("show");
                this._initDataSource();
            }
        }
        else {
            this._trigger("actionBegin");
            this._ensureDataSource();
            this._initKanbanRender();
            this.KanbanCommon._enableKanbanRTL();
        }
    };
    Kanban.prototype._renderToolBar = function () {
        var $div = ej.buildTag('div.e-kanbantoolbar', "", {}, { id: this._id + "_toolbarItems" });
        if (this.model.allowSearching) {
            this._isWatermark = 'placeholder' in document.createElement('input');
            var $searchUl = ej.buildTag("ul.e-searchbar", "", {}, {});
            var $li = ej.buildTag("li.e-search", "", {}, { id: this._id + "_toolbarItems_search" });
            var $a = ej.buildTag("a.e-searchitem e-toolbaricons e-disabletool e-icon e-searchfind", "", { 'float': 'right' }, {});
            if (ej.browserInfo().name == "msie")
                $a.css("position", "absolute");
            var $input = ej.buildTag("input.e-ejinputtext e-input", "", {}, { type: "text", id: this._id + "_searchbar", placeholder: "Search", 'height': '33px' });
            var $searchDiv = ej.buildTag('div.e-searchdiv', "", { 'display': 'inline-table', 'width': '83%' }, {});
            $searchDiv.append($input);
            $li.append($searchDiv);
            $li.append($a);
            $searchUl.append($li);
            this._searchInput = $input;
            if (!ej.isNullOrUndefined(this.model.searchSettings.key))
                this._searchInput.val(this.model.searchSettings.key);
            this._searchBar = $li;
            if (!this._isWatermark)
                this._hiddenSpan = ej.buildTag("span.e-input e-placeholder", "Search", { display: "block" }, {}).insertAfter(this._searchInput);
        }
        if (!ej.isNullOrUndefined(this.model.customToolbarItems)) {
            var $customUl = ej.buildTag("ul.e-customtoolbar");
            if (this.model.filterSettings.length > 0) {
                $customUl.addClass("e-customtoolbarseparator");
            }
            (!ej.isNullOrUndefined(this.model.customToolbarItems) && this.model.customToolbarItems.length) && this._renderCustomLi($customUl);
            $div.append($customUl);
        }
        if (this.model.filterSettings.length > 0) {
            var $filterUl = ej.buildTag("ul", "", {}, {});
            var li = ej.buildTag("li", "", {}, { "class": "e-quickfilter", "tabindex": "0" });
            li.append("<label class='e-toolbartext e-text'>" + this.localizedLabels.FilterSettings + "</label>");
            $filterUl.append(li);
        }
        for (var i = 0; i < this.model.filterSettings.length; i++) {
            var desc = this.model.filterSettings[i].description;
            var $li = ej.buildTag("li", "", {}, { id: this._id + "_" + this.model.filterSettings[i].text, title: ej.isNullOrUndefined(desc) ? this.model.filterSettings[i].text : desc, "tabindex": "0" });
            var $item = ej.buildTag("a.e-toolbartext e-text", this.model.filterSettings[i].text, {}, {});
            $li.append($item);
            $filterUl.append($li);
        }
        if (this.model.allowPrinting) {
            var $printUl = ej.buildTag("ul.e-print", "", {}, {});
            var li = ej.buildTag("li", "", {}, { "class": "e-printlist", title: "Print", "tabindex": "0" });
            var $item = ej.buildTag("a.e-printicon e-icon", "", {});
            li.append($item);
            $printUl.append(li);
        }
        if (!ej.isNullOrUndefined($filterUl))
            $div.append($filterUl);
        if (!ej.isNullOrUndefined($printUl))
            $div.append($printUl);
        if (!ej.isNullOrUndefined($searchUl))
            $div.append($searchUl);
        var model = { click: this._onToolbarClick };
        $div.ejToolbar(model);
        this._filterToolBar = $div;
        return $div;
    };
    Kanban.prototype._renderCustomLi = function ($ul) {
        var $li, cusTb, $item;
        for (var i = 0; i < this.model.customToolbarItems.length; i++) {
            cusTb = this.model.customToolbarItems[i]["template"] ? this.model.customToolbarItems[i].template.replace("#", "") : this.model.customToolbarItems[i];
            $li = ej.buildTag("li", "", {}, { id: this._id + "_" + cusTb, title: cusTb });
            switch (typeof this.model.customToolbarItems[i]) {
                case "string":
                    $item = ej.buildTag("a.e-toolbaricons e-icon", "", {}).addClass(this.model.customToolbarItems[i].text);
                    break;
                case "object":
                    $li.attr("title", this.model.customToolbarItems[i].template.replace("#", ""));
                    $item = $(this.model.customToolbarItems[i].template).hide().html();
                    break;
            }
            $li.html($item);
            $ul.append($li);
        }
    };
    Kanban.prototype.dataSource = function (dataSource, templateRefresh) {
        if (templateRefresh)
            this._templateRefresh = true;
        this._dataSource(dataSource);
        this.KanbanCommon._refreshDataSource(dataSource);
        if (this.model.enableTotalCount)
            this.KanbanCommon._totalCount();
        this.KanbanCommon._addLastRow();
    };
    Kanban.prototype._ensureDataSource = function (args) {
        if (this._dataSource() == null && !(this._dataSource() instanceof ej.DataManager)) {
            if (!ej.isNullOrUndefined(args) && args.requestType == "add")
                this.dataSource([], false);
            else
                return;
        }
        this.model.query.requiresCount();
        var queryManagar = this.model.query, cloned = queryManagar.clone(), predicate;
        if (!(this._dataSource() instanceof ej.DataManager))
            this._currentJsonData = this.currentViewData = this._dataSource();
        if (((this.model.filterSettings.length || this.model.allowFiltering) && !ej.isNullOrUndefined(args) && args.requestType == "filtering") || (!ej.isNullOrUndefined(args) && args.requestType == "search" || this.model.searchSettings.key.length)) {
            queryManagar["queries"] = queryManagar["queries"].slice(queryManagar["queries"].length);
            if (this.model.allowSearching) {
                var $searchIcon = this._searchBar.find(".e-toolbaricons");
                if (this.model.searchSettings.key.length != 0) {
                    var searchDetails = this.model.searchSettings;
                    $searchIcon.removeClass("e-searchfind").addClass("e-cancel");
                    if (searchDetails.fields.length == 0) {
                        if (!ej.isNullOrUndefined(this.model.fields.content))
                            searchDetails.fields.push(this.model.fields.content);
                        if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                            searchDetails.fields.push(this.model.fields.swimlaneKey);
                        if (!ej.isNullOrUndefined(this.model.fields.primaryKey))
                            searchDetails.fields.push(this.model.fields.primaryKey);
                        if (!ej.isNullOrUndefined(this.model.fields.title))
                            searchDetails.fields.push(this.model.fields.title);
                        if (!ej.isNullOrUndefined(this.model.fields.tag))
                            searchDetails.fields.push(this.model.fields.tag);
                        if (!ej.isNullOrUndefined(this.model.fields.imageUrl))
                            searchDetails.fields.push(this.model.fields.imageUrl);
                        if (!ej.isNullOrUndefined(this.model.fields.priority))
                            searchDetails.fields.push(this.model.fields.priority);
                        if (!ej.isNullOrUndefined(this.model.fields.color))
                            searchDetails.fields.push(this.model.fields.color);
                    }
                    queryManagar.search(searchDetails.key, searchDetails.fields, searchDetails.operator || "contains", searchDetails.ignoreCase);
                }
                else
                    $searchIcon.removeClass("e-cancel").addClass("e-searchfind");
            }
            if (this.element.hasClass('e-responsive'))
                this._filterCollection = this._kbnFilterCollection.slice();
            for (var i = 0; i < this._filterCollection.length; i++)
                predicate = predicate != undefined ? predicate["and"](this._filterCollection[i]) : this._filterCollection[i];
            queryManagar.where(ej.Predicate["or"](this.keyPredicates));
            for (var i = 0; i < queryManagar["queries"].length; i++) {
                if (queryManagar["queries"][i].fn == "onWhere") {
                    predicate && (queryManagar["queries"][i].e = queryManagar["queries"][i].e.and(predicate));
                }
            }
            if (this._isLocalData) {
                this._filteredRecords = this._dataManager.executeLocal(queryManagar).result;
                this._filteredRecordsCount = this._filteredRecords.length;
            }
            if (this._isLocalData && this.model.filterSettings.length == 0) {
                if (!ej.isNullOrUndefined(this._filteredRecordsCount) || this._filteredRecordsCount > 0) {
                    this._filteredRecordsCount = null;
                    this._filteredRecords = [];
                }
            }
        }
        if (this._isLocalData && (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding) && (!ej.isNullOrUndefined(this._cModifiedData) || !ej.isNullOrUndefined(this._cAddedRecord)))
            queryManagar["queries"] = cloned["queries"];
        if (args && args.requestType == "delete" && !ej.isNullOrUndefined(this._cDeleteData) && this._isLocalData) {
            var index;
            if (!(this._dataSource() instanceof ej.DataManager)) {
                index = $.inArray(this._cDeleteData[0], this._dataSource());
                this._dataSource(undefined, true).splice(index, 1);
            }
            else {
                index = $.inArray(this._cDeleteData[0], this._dataSource().dataSource.json);
                this._dataSource().dataSource.json.splice(index, 1);
            }
        }
        this._cloneQuery = queryManagar.clone();
        if (this._isLocalData) {
            var qManagar;
            if (!ej.isNullOrUndefined(args) && (args.requestType == "addcolumn" || args.requestType == "refresh") && this._filterCollection.length <= 0 && (ej.isNullOrUndefined(this._searchInput) || this._searchInput.val().length <= 0)) {
                var cloned = queryManagar.clone();
                cloned["queries"] = [];
                cloned.where(ej.Predicate["or"](this.keyPredicates));
                qManagar = cloned;
            }
            else
                qManagar = queryManagar;
            var dataMgrJson = this._dataManager.dataSource.json;
            var dataSource = this._dataSource().dataSource;
            if (!ej.isNullOrUndefined(dataSource) && this._dataSource() instanceof ej.DataManager)
                this._dataManager.dataSource.json = dataMgrJson != dataSource.json ? dataSource.json : dataMgrJson;
            var result = this._dataManager.executeLocal(qManagar);
            this.currentViewData = this._currentJsonData = result.result;
            this._recordsCount = result.count;
        }
    };
    Kanban.prototype._addColumnFilters = function () {
        var colms = this.model.columns, predicates = [], fPred;
        var qManager = this.model.query;
        for (var i = 0; i < colms.length; i++) {
            var key = colms[i].key;
            if (!ej.isNullOrUndefined(key))
                key = typeof (key) == "object" ? key : key.split(",");
            for (var j = 0; j < key.length; j++) {
                predicates.push(new ej.Predicate(this.model.keyField, ej.FilterOperators.equal, key[j], true));
                this._keyValue.push(key[j]);
            }
        }
        predicates.length > 0 && (qManager.where(ej.Predicate["or"](predicates)));
        this.keyPredicates = predicates;
    };
    Kanban.prototype.refresh = function (refreshTemplate) {
        refreshTemplate && this.refreshTemplate();
        var args = { requestType: "refresh" };
        this.KanbanCommon._processBindings(args);
    };
    Kanban.prototype.sendDataRenderingRequest = function (args) {
        if (this._templateRefresh) {
            this.refreshTemplate();
            this._templateRefresh = false;
        }
        var queryManagar = this.model.query, cloned = queryManagar.clone();
        if (this.currentViewData != null && this.currentViewData.length) {
            switch (args.requestType) {
                case "save":
                case "drop":
                case "delete":
                case "refresh":
                case "search":
                case "filtering":
                    if (this.element.hasClass('e-responsive') && !ej.isNullOrUndefined(args.currentFilterObject))
                        this._kbnAdaptFilterObject = args.currentFilterObject.slice();
                case "cancel":
                    this.getContentTable().find("colgroup").first().replaceWith(this.KanbanCommon._getMetaColGroup());
                    if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey)) {
                        var proxy = this, swimlaneKey = this.model.fields.swimlaneKey, unassignedGroup = this.model.swimlaneSettings.unassignedGroup;
                        queryManagar = queryManagar.group(swimlaneKey);
                        if (!this.currentViewData.GROUPGUID) {
                            if (unassignedGroup.enable && unassignedGroup.keys.length > 0) {
                                $.map(proxy.currentViewData, function (obj, index) {
                                    proxy.currentViewData[index] = proxy._checkKbnUnassigned(obj);
                                });
                            }
                            if (!this.currentViewData.GROUPGUID)
                                this.currentViewData = new ej.DataManager(this.currentViewData).executeLocal(queryManagar)["result"];
                        }
                    }
                    this._renderAllCard();
                    if (this.element.hasClass('e-responsive')) {
                        if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey)) {
                            this.element.find('.e-swimlanerow').hide();
                            if (this.KanbanAdaptive)
                                this.KanbanAdaptive._addSwimlaneName();
                        }
                    }
                    this._enableSwimlaneCount = true;
                    this._eventBindings();
                    this._enableDragandScroll();
                    break;
                case "beginedit":
                case "add":
                    if (this.KanbanEdit) {
                        this.KanbanEdit._editAdd(args);
                        this._enableSwimlaneCount = false;
                    }
                    break;
            }
            queryManagar["queries"] = cloned["queries"];
        }
        else {
            this.getContentTable().find('tbody').empty().first().append(this.KanbanCommon._getEmptyTbody());
        }
        if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate") {
            this._editForm = this.element.find(".e-externalform");
            this.KanbanEdit._formFocus();
        }
        if ("beginedit" == args.requestType || "add" == args.requestType)
            (this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "externalform") && this.KanbanEdit._refreshEditForm(args);
        this._renderComplete(args);
        if (this.KanbanSwimlane && this._enableSwimlaneCount) {
            this.KanbanSwimlane._swimlaneLimit(args);
            this._swimlaneRows = this.element.find('.e-swimlanerow');
        }
        this.KanbanCommon._renderLimit();
        if (this._filterCollection.length == 0 && this.model.searchSettings.key.length == 0)
            this.KanbanCommon._totalCount();
        if (this._filterCollection.length > 0 || this.model.searchSettings.key.length > 0)
            this.KanbanFilter._filterLimitCard(args);
        this._newData = null;
        if (this.element.hasClass('e-responsive'))
            this.kanbanWindowResize();
    };
    Kanban.prototype._checkKbnUnassigned = function (obj) {
        var unassignedGroup = this.model.swimlaneSettings.unassignedGroup, type = obj[this.model.fields.swimlaneKey], swimlaneKey = this.model.fields.swimlaneKey;
        for (var i = 0; i < unassignedGroup.keys.length; i++) {
            if (typeof unassignedGroup.keys[i] == "string") {
                if (unassignedGroup.keys[i].replace(/^\s+|\s+$/g, '') == "" && $.inArray("", unassignedGroup.keys) >= 0 && i < $.inArray("", unassignedGroup.keys))
                    unassignedGroup.keys.splice(i, 1);
                else if (unassignedGroup.keys[i].replace(/^\s+|\s+$/g, '') == "")
                    unassignedGroup.keys[i] = unassignedGroup.keys[i].replace(/^\s+|\s+$/g, '');
            }
        }
        if (type != undefined && type != null && typeof type == "string")
            type = type.replace(/^\s+|\s+$/g, '');
        if (type == null || type == undefined) {
            for (var i = 0; i < unassignedGroup.keys.length; i++) {
                if ((typeof unassignedGroup.keys[i] == "string") && (unassignedGroup.keys[i].toLowerCase() == "null" || unassignedGroup.keys[i].toLowerCase() == "undefined"))
                    obj[swimlaneKey] = this.localizedLabels.Unassigned;
                else if (unassignedGroup.keys[i] == null || unassignedGroup.keys[i] == undefined)
                    obj[swimlaneKey] = this.localizedLabels.Unassigned;
            }
        }
        else {
            for (var i = 0; i < unassignedGroup.keys.length; i++) {
                var key = unassignedGroup.keys[i];
                if (typeof type == "number" && key.startsWith("'") && key.endsWith("'"))
                    key = key.split("'")[1];
                if (key == type)
                    obj[swimlaneKey] = this.localizedLabels.Unassigned;
            }
        }
        return obj;
    };
    Kanban.prototype._renderAllCard = function () {
        var temp = document.createElement('div');
        temp.innerHTML = ['<table>', $.render[this._id + "_JSONTemplate"]({ columns: this.model.columns, dataSource: this.currentViewData }), '</table>'].join("");
        if (!ej.isNullOrUndefined(temp.firstChild) && !ej.isNullOrUndefined(temp.firstChild.lastChild))
            this.getContentTable().get(0).replaceChild(temp.firstChild.lastChild, this.getContentTable().get(0).lastChild);
        this._cardCollapse();
        this._swimlaneCollapse();
        if (this.KanbanSelection)
            this.KanbanSelection._selectionOnRerender();
    };
    Kanban.prototype._editEventTrigger = function (args) {
        if (args.requestType == "save" || args.requestType == "delete") {
            var params = {
                data: args.data,
                action: args.action !== undefined ? args.action : args.requestType,
            };
            this._trigger("end" + params.action.charAt(0).toUpperCase() + params.action.slice(1), params);
        }
    };
    Kanban.prototype._renderComplete = function (args) {
        if (args.requestType != 'beginedit')
            this.KanbanCommon._setWidthToColumns();
        if (args.requestType == "save" || args.requestType == "cancel") {
            this._isAddNew = false;
            this._isEdit = false;
        }
        if (args.requestType == 'beginedit')
            this._isEdit = true;
        if ("delete" == args.requestType || "save" == args.requestType)
            this._editEventTrigger(args);
        this._tableBEle = this.getContentTable().get(0);
        this._kanbanRows = this._tableBEle.rows;
        this._columnRows = $(this._kanbanRows).not(".e-swimlanerow");
        if (this.model.allowScrolling && !this.initialRender)
            this.getContentTable().find("tr:last").find("td").addClass("e-lastrowcell");
        this._trigger("actionComplete", args);
        if (!this.initialRender && this.model.allowScrolling && (args.requestType == "add" || args.requestType == "cancel" || args.requestType == "save" || args.requestType == "delete" || args.requestType == "filtering" || args.requestType == "refresh" || args.requestType == "drop"))
            this.KanbanScroll._refreshScroller(args);
        if (this.model.allowDragAndDrop && this.KanbanDragAndDrop)
            this.KanbanDragAndDrop._addDragableClass();
    };
    Kanban.prototype._createTemplate = function (elt, templateId) {
        var scriptElt = document.createElement("script");
        scriptElt.id = (this._id + templateId + "_Template");
        var $script = this.element.parents("body").find("#" + scriptElt.id);
        scriptElt.type = "text/x-jsrender";
        scriptElt.text = elt;
        if ($script)
            $script.remove();
        $("body").append(scriptElt);
        return scriptElt;
    };
    Kanban.prototype._addInitTemplate = function () {
        var proxy = this, helpers = {}, isKey = !ej.isNullOrUndefined(proxy.model.keyField), isIe8 = ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version, 10) == 8, toggle = this.model.allowToggleColumn, isSwimlane = !ej.isNullOrUndefined(proxy.model.fields.swimlaneKey);
        this._slTemplate = "";
        helpers[proxy._id + "Object"] = this;
        helpers["_" + proxy._id + "columnKeys"] = this._getColumnKeyItems;
        helpers["_" + proxy._id + "tagItems"] = this._gettagItems;
        helpers["_" + proxy._id + "colorMaps"] = this._getColorMaps;
        helpers["_" + proxy._id + "getId"] = this.KanbanCommon._removeIdSymbols;
        helpers["_" + proxy._id + "getData"] = this._columnData;
        helpers["_" + proxy._id + "getCardCount"] = this._columnCardcount;
        helpers["_" + proxy._id + "getStatus"] = this._columnStatus;
        $.views.helpers(helpers);
        if (isSwimlane) {
            this._slTemplate += "{{for dataSource ~columns=columns ~ds=dataSource}}";
            this._slTemplate += "<tr id='{{: ~_" + proxy._id + "getId(key)}}' class='e-swimlanerow' role='kanbanrow'>" +
                "<td class='e-rowcell' role='kanbancell'  colspan='" + (proxy.getVisibleColumnNames().length) + "'>" +
                "<div class='e-slexpandcollapse'><div class='e-icon e-slexpand'></div></div>" +
                "<div class='e-slkey'>{{:key}}</div>" +
                "{{if " + this.model.swimlaneSettings.showCount + "}}" +
                "<div class='e-slcount'>" + proxy.localizedLabels.SwimlaneCaptionFormat + "</div>" +
                "{{/if}}" +
                "</td>" +
                "</tr>";
        }
        this._slTemplate += "<tr class='e-columnrow' role='kanbanrow'>";
        if (isSwimlane)
            this._slTemplate += "{{for ~columns ~items=#data.items}}";
        else
            this._slTemplate += "{{for columns}}";
        this._slTemplate += "<td ej-mappingkey='{{:key}}' class='e-rowcell " + "{{if !#data.visible}}  e-hide {{/if}}" + "{{if #data.allowDrag}}  e-drag {{/if}}" + "{{if #data.allowDrop}}  e-drop {{/if}}" + "{{if (#data.isCollapsed && " + toggle + ")}}e-shrink{{/if}}" + "'role='kanbancell'>" +
            "{{if " + isKey + "}}" +
            "{{for ~_" + proxy._id + "columnKeys('" + proxy._id + "Object')}}";
        this._slTemplate += this._cardCustomization() +
            "{{/for}}" +
            "{{/if}}" +
            "{{if " + this.model.allowToggleColumn + "}}" +
            "<div class='e-shrinkheader" +
            "{{if " + isIe8 + "}} IE{{/if}}" +
            "{{if !#data.isCollapsed}}  e-hide {{/if}}" + "'>" +
            "{{:headerText}}<div class='e-shrinklabel'>[<div class='e-shrinkcount'>" +
            "{{:~_" + proxy._id + "getCardCount(" + "~root.dataSource" + ",key,#parent.parent.getIndex(),'" + proxy._id + "Object') }}" +
            "</div>]</div></div>" +
            "{{/if}}" +
            "{{if " + this.model.editSettings.allowAdding + "}}" +
            "{{if #data.showAddButton}} " +
            "<div class='e-customaddbutton" +
            "{{if #data.isCollapsed}}  e-hide {{/if}}" + "'>" +
            "<div class='e-columnadd e-icon'>" +
            "</div>" +
            "</div>" +
            "{{/if}}" +
            "{{/if}}" +
            "</td>{{/for}}</tr>";
        if (isSwimlane)
            this._slTemplate += "{{/for}}";
        this.templates[this._id + "_JSONTemplate"] = $.templates(this._createTemplate(this._slTemplate, "_swinlaneContent"));
        this.templates[this._id + "_cardTemplate"] = $.templates(this._createTemplate(this._cardTemplate, "_cardTemplate"));
        $.templates(this.templates);
    };
    Kanban.prototype._cardCustomization = function () {
        var proxy = this, toggle = this.model.allowToggleColumn, userAppTemplId = (this.model.cardSettings.template) ? true : false, userImage = (this.model.fields.imageUrl) ? true : false, cardSets = this.model.fields, isTitle = !ej.isNullOrUndefined(cardSets.title), titleFld = cardSets.title ? cardSets.title : (cardSets.primaryKey ? cardSets.primaryKey : null), innerDiv = (!ej.isNullOrUndefined(cardSets.tag) || !ej.isNullOrUndefined(cardSets.content));
        if (!userImage)
            this.element.addClass('e-onlycontent');
        this._cardTemplate =
            "<div id='{{:" + proxy.model.fields.primaryKey + "}}' class='e-kanbancard " + "{{if ~_" + proxy._id + "getData(" + "#parent" + ")  && " + toggle + " }}e-hide{{/if}} " + "{{if " + userAppTemplId + "}}e-templatecell{{/if}}'>" +
                "{{if " + userAppTemplId + "}}" +
                $(proxy.model.cardSettings.template).html() +
                "{{else}}" +
                "{{if " + proxy.model.allowTitle + "}}" +
                "<div class='e-cardheader'>" +
                "<div class='e-primarykey'>" +
                "{{:" + titleFld + "}}" +
                "</div>" +
                "<div class='e-expandcollapse'><div class='e-icon e-cardexpand'></div></div>" +
                "</div>" +
                "{{/if}}" +
                "<div class='e-cardcontent'>" +
                "<table class='e-cardtable'><tbody><tr>" +
                "<td class='e-contentcell'>" +
                "{{if " + innerDiv + "}}" +
                "<div class='e-text'>{{:" + cardSets.content + "}}</div>" +
                "</td>" +
                "{{if " + userImage + " }} " +
                "<td class='e-imagecell'>" +
                "<div class='e-card_image'>" +
                "{{if " + cardSets.imageUrl + "}}" +
                "<img class='e-image' src='{{:" + cardSets.imageUrl + "}}'></img>" +
                "{{else}}" +
                "<div class='e-image e-no-user'></div>" +
                "{{/if}}</div></td>" +
                "{{/if}}" +
                "</tr>" +
                "<tr>" +
                "<td>" +
                "{{if " + cardSets.tag + "}}" +
                "{{for ~_" + proxy._id + "tagItems(" + cardSets.tag + ")}}" +
                "{{:#data}}" +
                "{{/for}}" +
                "{{/if}}" +
                "</div>" +
                "{{/if}}" +
                "</td>" +
                "<td class='e-trainglecell'>" +
                "<div class='e-bottom-triangle'" +
                "{{if " + cardSets.color + " }} " +
                "style='border-bottom-color" +
                ":{{for  ~_" + proxy._id + "colorMaps('" + proxy._id + "Object'," + cardSets.color + ")}}" +
                "{{:#data}}{{/for}}'" +
                "{{/if}}></div>" +
                "</td>" +
                "</tr>" +
                "</tbody></table>" +
                "</div>" +
                "{{/if}}" +
                "</div>" +
                "</div>";
        return this._cardTemplate;
    };
    Kanban.prototype._columnStatus = function (objectId) {
        var kanbanObject = this["getRsc"]("helpers", objectId);
        var browserDetails = kanbanObject.getBrowserDetails();
        if (browserDetails.browser == "msie")
            return true;
        else
            return false;
    };
    Kanban.prototype._columnCardcount = function (id, key, index, proxy) {
        var kanbanObject = proxy;
        if (typeof proxy === "string")
            kanbanObject = this["getRsc"]("helpers", proxy);
        var co = 0;
        var j, k;
        key = typeof (key) == "object" ? key : key.split(",");
        if (ej.isNullOrUndefined(index)) {
            for (j = 0; j < id.length; j++)
                for (k = 0; k < key.length; k++)
                    if (id[j][kanbanObject.model.keyField] === key[k])
                        co++;
            return co;
        }
        else
            for (j = 0; j < id[index].items.length; j++)
                for (k = 0; k < key.length; k++)
                    if (id[index].items[j][kanbanObject.model.keyField] === key[k])
                        co++;
        return co;
    };
    Kanban.prototype._columnData = function (id) {
        if (ej.isNullOrUndefined(id))
            return false;
        else
            return id.parent.data.isCollapsed;
    };
    Kanban.prototype._getColorMaps = function (objectId, items) {
        var kanbanObject = this["getRsc"]("helpers", objectId), colors, colorMaps = kanbanObject.model.cardSettings.colorMapping;
        for (var val in colorMaps) {
            if (colorMaps[val].indexOf(',') == -1 && colorMaps[val] == items)
                return val;
            else {
                colors = colorMaps[val].split(",");
                for (var i = 0; i < colors.length; i++) {
                    if (colors[i] == items)
                        return val;
                }
            }
        }
    };
    Kanban.prototype._gettagItems = function (tag) {
        var tags = "<div class='e-tags'>", i;
        tag = tag.split(",");
        for (i = 0; i < tag.length; i++)
            tags = tags.concat("<div class='e-tag'>" + tag[i] + "</div>");
        return tags.concat("</div>");
    };
    Kanban.prototype._getColumnKeyItems = function (objectId) {
        var kanbanObject = this["getRsc"]("helpers", objectId), keys, ds = this["ctx"].root.dataSource, dropKey;
        var queryManagar = kanbanObject.model.query;
        var cloned = queryManagar.clone();
        if (kanbanObject._filterCollection.length <= 0 && kanbanObject.model.allowSearching && kanbanObject._searchInput.val().length <= 0) {
            cloned.queries = [];
            cloned.where(ej.Predicate["or"](kanbanObject.keyPredicates));
        }
        else
            cloned.queries = cloned.queries.slice(0, cloned.queries.length - 1);
        var key = typeof (this["data"].key) == "object" ? this["data"].key : this["data"].key.split(",");
        var predicate = [];
        for (var i = 0; i < key.length; i++)
            predicate.push(new ej.Predicate(kanbanObject.model.keyField, ej.FilterOperators.equal, key[i], true));
        cloned = cloned.where(ej.Predicate["or"](predicate));
        if (ds.GROUPGUID)
            keys = new ej.DataManager(this["ctx"].items).executeLocal(cloned)["result"];
        else
            keys = new ej.DataManager(ds).executeLocal(cloned)["result"];
        dropKey = kanbanObject.model.fields.priority;
        if (dropKey)
            keys.sort(function (val1, val2) {
                return val1[dropKey] - val2[dropKey];
            });
        return keys;
    };
    Kanban.prototype._kbnThumbStart = function (e) {
        var target = $(e.originalEvent.target);
        if (target.hasClass("e-kanbancard") || target.parents(".e-kanbancard").hasClass("e-kanbancard"))
            return false;
        return false;
    };
    Kanban.prototype._enableDragandScroll = function () {
        if (this.model.allowDragAndDrop && this.KanbanDragAndDrop)
            this.KanbanDragAndDrop._addDragableClass();
        if (this.model.allowScrolling) {
            if (this.initialRender && this.element.find('.e-kanbancontent').length > 0) {
                if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                    this._swimlaneRows = this.element.find('.e-swimlanerow');
                this.KanbanScroll._renderScroller();
            }
            else
                this.KanbanScroll._refreshScroller({ requestType: "refresh" });
        }
    };
    Kanban.prototype._cardCollapse = function () {
        if (this._collapsedCards.length > 0)
            this.toggleCard(this._collapsedCards);
    };
    Kanban.prototype._swimlaneCollapse = function () {
        if (this._collapsedSwimlane.length > 0) {
            var $swimRow = this.element.find(".e-swimlanerow");
            for (var i = 0; i < $swimRow.length; i++) {
                if ($.inArray($swimRow.eq(i).attr("id"), this._collapsedSwimlane) != -1)
                    this.KanbanSwimlane._toggleSwimlaneRow($($swimRow.eq(i)).find(".e-rowcell .e-slexpandcollapse"));
            }
        }
    };
    Kanban.prototype.updateCard = function (primaryKey, data) {
        this.KanbanCommon._kanbanUpdateCard(primaryKey, data);
    };
    Kanban.prototype._eventBindings = function () {
        this._kanbanRows = this.getContentTable().get(0)["rows"];
        var columnRows = $(this._kanbanRows).not(".e-swimlanerow");
        if (this._currentJsonData.length != 0 && this.model.queryCellInfo != null) {
            for (var row = 0; row < columnRows.length; row++) {
                var trRows = columnRows[row];
                var columns = this.model.columns;
                for (var i = 0; i < columns.length; i++) {
                    var cell = $(trRows).find(".e-rowcell")[i];
                    this._cellEventTrigger(cell, columns[i]);
                }
            }
        }
    };
    Kanban.prototype._cellEventTrigger = function (rowCell, curColumn) {
        var $kanbanCard = $(rowCell).find(".e-kanbancard");
        for (var i = 0; i < $kanbanCard.length; i++) {
            var cardId = $kanbanCard[i].id;
            var data = this.KanbanCommon._getKanbanCardData(this._currentJsonData, cardId);
            var args = { card: $kanbanCard[i], cell: rowCell, column: curColumn, data: data[0] };
            this._trigger("queryCellInfo", args);
        }
    };
    Kanban.prototype._getLocalizedLabels = function () {
        return ej.getLocalizedConstants(this["sfType"], this.model.locale);
    };
    return Kanban;
}(ej.WidgetBase));
window.ej.widget("ejKanban", "ej.Kanban", new Kanban());
ej.Kanban.Actions = {
    Filtering: "filtering",
    BeginEdit: "beginedit",
    Edit: "edit",
    Save: "save",
    Add: "add",
    Delete: "delete",
    Cancel: "cancel",
    Refresh: "refresh",
    Search: "searching",
    Print: "print"
};
ej.Kanban.EditingType = {
    String: "stringedit",
    Numeric: "numericedit",
    Dropdown: "dropdownedit",
    DatePicker: "datepicker",
    DateTimePicker: "datetimepicker",
    TextArea: "textarea",
    RTE: "rteedit",
};
ej.Kanban.EditMode = {
    Dialog: "dialog",
    DialogTemplate: "dialogtemplate",
    ExternalForm: "externalform",
    ExternalFormTemplate: "externalformtemplate",
};
ej.Kanban.FormPosition = {
    Bottom: "bottom",
    Right: "right"
};
ej.Kanban.Type = {
    Column: "column",
    Swimlane: "swimlane",
};
ej.Kanban.SelectionType = {
    Multiple: "multiple",
    Single: "single",
};
ej.Kanban.MenuItem = {
    AddCard: "Add Card",
    EditCard: "Edit Card",
    DeleteCard: "Delete Card",
    TopofRow: "Top of Row",
    BottomofRow: "Bottom of Row",
    MoveUp: "Move Up",
    MoveDown: "Move Down",
    MoveLeft: "Move Left",
    MoveRight: "Move Right",
    MovetoSwimlane: "Move to Swimlane",
    HideColumn: "Hide Column",
    VisibleColumns: "Visible Columns",
    PrintCard: "Print Card",
};
ej.Kanban.Target = {
    Header: "header",
    Content: "content",
    Card: "card",
    All: "all",
};
ej.Kanban.Locale = {};
;

});