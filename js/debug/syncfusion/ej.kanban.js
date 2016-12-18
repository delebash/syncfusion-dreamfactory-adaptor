/*!
*  filename: ej.kanban.js
*  version : 14.2.0.26
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["jquery-easing","./../common/ej.globalize","jquery-validation","jsrender","./../common/ej.core","./../common/ej.data","./../common/ej.touch","./../common/ej.draggable","./../common/ej.scroller","./ej.button","./ej.waitingpopup","./ej.datepicker","./ej.datetimepicker","./ej.dropdownlist","./ej.dialog","./ej.editor","./ej.toolbar","./ej.rte","./ej.menu"], fn) : fn();
})
(function () {
	
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
        this._dragEle = kObj.getContent().find(".e-columnrow .e-kanbancard");
        this._dropEle = kObj.getContent().find(".e-columnrow .e-rowcell");
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
            prevCard = kObj._getCardbyIndexes(kObj._previousRowCellIndex);
            kObj._pCardId = prevCard.attr('id');
        }
        kObj._previousRowCellIndex = kObj._currentRowCellIndex;
        kObj._pCardId = kObj._cCardId;
        if (kObj._currentRowCellIndex.length > 0) {
            curCard = kObj._getCardbyIndexes(kObj._currentRowCellIndex);
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
            index = this._getPriorityKey(parseInt(element.attr('id')));
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
        var kObj = this.kanbanObj, lastDrpIndex, eleDrpIndex, trgtColData = [], pCheck = false, prKey = kObj.model.fields.priority, filter;
        if (!ej.isNullOrUndefined(kObj._filterToolBar))
            filter = kObj._filterToolBar.find('.e-select');
        if (target.hasClass('e-targetclone'))
            target = target.parent();
        this._selectedPrevCurrentCards();
        if (prKey && ((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))) {
            trgtColData = this._columnDataOndrop(target, prKey);
            pCheck = trgtColData.length > 0;
        }
        else
            pCheck = $(target).children('.e-kanbancard').length > 1;
        if (kObj.model.selectionType == "multiple" && this._getSelectedCards(element).length > 0 && $(element).hasClass('e-cardselection'))
            element = this._getSelectedCards(element);
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
                        var data = kObj._getKanbanCardData(kObj._currentJsonData, $(card)[0].id)[0];
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
    };
    InternalDragAndDrop.prototype._updateDropAction = function (trgt, ele) {
        var trgtTd, kObj = this.kanbanObj;
        trgtTd = $(trgt).hasClass('e-rowcell') ? trgt : $(trgt).closest("td.e-rowcell");
        kObj._selectedCardData = [];
        for (var c = 0; c < ele.length; c++) {
            var cardId, card;
            if (ej.isNullOrUndefined(ele[c].length)) {
                if ($(ele[c]).is(':visible')) {
                    cardId = $(ele[c]).attr('id');
                    this._updateDropData(trgt, ele[c], cardId);
                    card = kObj.element.find("#" + cardId);
                    if (card.parents('.e-rowcell').hasClass('e-shrink'))
                        card.addClass('e-hide');
                }
            }
            else {
                for (var k = 0; k < ele[c].length; k++) {
                    if ($(ele[c][k]).is(':visible')) {
                        cardId = ele[c][k].id;
                        this._updateDropData(trgt, ele[c][k], cardId);
                        card = kObj.element.find("#" + cardId);
                        if (card.parents('.e-rowcell').hasClass('e-shrink'))
                            card.addClass('e-hide');
                    }
                }
            }
        }
        if (kObj.model.fields.priority && kObj._priorityCollection.length > 0) {
            for (var i = 0; i < kObj._priorityCollection.length; i++) {
                var key = kObj._priorityCollection[i].primaryKey, card = kObj.element.find("#" + key);
                this._updateDropData(trgt, card, key);
            }
        }
        if (kObj._bulkUpdateData.length > 0) {
            if (kObj._dataManager instanceof ej.DataManager && !kObj._dataManager.dataSource.offline || (kObj._dataSource().adaptor instanceof ej.remoteSaveAdaptor)) {
                var bulkUpdate, bulkChanges, proxy = this;
                bulkChanges = {
                    added: [],
                    deleted: [],
                    changed: []
                };
                bulkChanges.changed = kObj._bulkUpdateData;
                $("#" + kObj._id).data("ejWaitingPopup").show();
                (bulkUpdate = kObj._dataManager.saveChanges(bulkChanges, kObj.model.fields.primaryKey, kObj.model.query._fromTable));
                if ($.isFunction(bulkUpdate.promise)) {
                    bulkUpdate.done(function (e) {
                        proxy._updateDataOndrop(kObj._bulkUpdateData);
                    });
                    bulkUpdate.fail(function (e) {
                        var args = { error: e.error };
                        proxy._updateDataOndrop(kObj._failBulkData);
                        kObj._trigger("actionFailure", args);
                    });
                }
            }
        }
        if (!ej.isNullOrUndefined(ele[0].length) && ele[0].length > 1 || ele.length > 1 || (ele.length == 1 && $(ele).hasClass('e-cardselection'))) {
            kObj._previousRowCellIndex = (!ej.isNullOrUndefined(kObj._pCardId)) ? this._updateRowCellIndexes(kObj._pCardId, kObj._previousRowCellIndex) : [];
            kObj._currentRowCellIndex = (!ej.isNullOrUndefined(kObj._cCardId)) ? this._updateRowCellIndexes(kObj._cCardId, kObj._currentRowCellIndex) : [];
            kObj._selectionOnRerender();
            if (ej.isNullOrUndefined(kObj._pCardId))
                kObj._previousRowCellIndex = kObj._currentRowCellIndex;
            if (kObj.model.selectionType == "single")
                kObj.selectedRowCellIndexes = kObj._currentRowCellIndex;
            else
                this._updateSelectedCardIndexes(trgt);
        }
        kObj._priorityCollection = [];
    };
    InternalDragAndDrop.prototype._updateDataOndrop = function (data) {
        var kObj = this.kanbanObj;
        for (var i = 0; i < data.length; i++) {
            var key = data[i][kObj.model.fields.primaryKey];
            if (kObj.element.find('#' + key).length > 0)
                kObj._renderSingleCard(key, data[i]);
        }
        kObj._failBulkData = [];
        kObj._bulkUpdateData = [];
        kObj.refresh(true);
        $("#" + kObj._id).data("ejWaitingPopup").hide();
    };
    InternalDragAndDrop.prototype._getPriorityKey = function (key) {
        var kObj = this.kanbanObj;
        var kCard = kObj._getKanbanCardData(kObj._currentJsonData, key);
        return kCard[0][kObj.model.fields.priority];
    };
    InternalDragAndDrop.prototype._dropAsSibling = function (target, element, pre) {
        var kObj = this.kanbanObj;
        var targetKey = 0, prevKey = 0, nextKey = 0, nextAll, prevAll, dropIndex, cards, initTarget, prevCard, nextCard, trgtColData = [], prCardId, prKey = kObj.model.fields.priority, filter, primeKey;
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
            if ($(target).hasClass("e-targetclone")) {
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
        }
        initTarget = target;
        if (kObj.model.selectionType == "multiple" && this._getSelectedCards(element).length > 0 && $(element).hasClass('e-cardselection'))
            element = this._getSelectedCards(element);
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
                            var data, index, curIndex;
                            data = kObj._getKanbanCardData(trgtColData, $(target).attr('id'));
                            index = trgtColData.indexOf(data[0]);
                            if (pre)
                                trgtColData.splice(index + 1, 0, kObj._getKanbanCardData(kObj._currentJsonData, $(card)[0].id)[0]);
                            else
                                trgtColData.splice(index, 0, kObj._getKanbanCardData(kObj._currentJsonData, $(card)[0].id)[0]);
                            prCardId = $(card)[0].id;
                        }
                    }
                    if (prKey) {
                        if (((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))) {
                            var tData = kObj._getKanbanCardData(trgtColData, $(target).attr('id'));
                            targetKey = tData[0][prKey];
                            tData = kObj._getKanbanCardData(trgtColData, prCardId);
                            cards = [];
                            for (var k = trgtColData.indexOf(tData[0]); k < trgtColData.length; k++) {
                                cards.push(trgtColData[k]);
                            }
                        }
                        else {
                            targetKey = this._getPriorityIndex($(target));
                            cards = $(card).nextAll('.e-kanbancard')["andSelf"]();
                        }
                        for (var k = 0; k < cards.length; k++) {
                            var thisEle = cards[k];
                            if (((!ej.isNullOrUndefined(kObj._filterToolBar) && filter.length > 0) || (kObj._searchBar != null && kObj._searchBar.find(".e-cancel").length > 0))) {
                                var tData = null, index;
                                dropIndex = thisEle[prKey];
                                if (!pre && (parseInt($(card)[0].id) == thisEle[prKey]) && targetKey < dropIndex)
                                    dropIndex = targetKey;
                                tData = kObj._getKanbanCardData(trgtColData, thisEle[primeKey]);
                                index = curIndex = trgtColData.indexOf(tData[0]);
                                if (index - 1 >= 0)
                                    prevKey = trgtColData[index - 1][prKey];
                                tData = kObj._getKanbanCardData(trgtColData, thisEle[primeKey]);
                                index = curIndex = trgtColData.indexOf(tData[0]);
                                if (index + 1 < trgtColData.length) {
                                    nextKey = trgtColData[index + 1][prKey];
                                    nextAll = trgtColData[index + 1];
                                }
                                else
                                    nextAll = [];
                            }
                            else {
                                dropIndex = this._getPriorityKey(parseInt($(thisEle).attr('id')));
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
                                if (!(!pre && parseInt($(card)[0].id) == thisEle[primeKey]))
                                    dropIndex = ++targetKey;
                                else if (!(!pre && parseInt($(card)[0].id) == thisEle[primeKey] && targetKey < dropIndex))
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
    };
    InternalDragAndDrop.prototype._updateSelectedCardIndexes = function (target) {
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
    InternalDragAndDrop.prototype._updateDropData = function (target, element, cardId) {
        var kObj = this.kanbanObj;
        if (!ej.isNullOrUndefined(kObj.model.fields.primaryKey)) {
            var targetTd, prKey, primeKey, tempCard = [];
            ;
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
            tempCard = kObj._getKanbanCardData(kObj._currentJsonData, cardId);
            if (kObj._dataManager instanceof ej.DataManager && !kObj._dataManager.dataSource.offline || (kObj._dataSource().adaptor instanceof ej.remoteSaveAdaptor))
                kObj._failBulkData.push($.extend(true, {}, tempCard[0]));
            if (tempCard.length > 0) {
                tempCard[0][kObj.model.keyField] = kObj.model.columns[targetTd.index()].key;
                if (kObj.model.fields.swimlaneKey)
                    tempCard[0][kObj.model.fields.swimlaneKey] = $(target).parents("tr.e-columnrow").prev().find("div.e-slkey").html();
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
                if (kObj._dataManager instanceof ej.DataManager && !kObj._dataManager.dataSource.offline || (kObj._dataSource().adaptor instanceof ej.remoteSaveAdaptor))
                    kObj._bulkUpdateData.push(tempCard[0]);
                else {
                    kObj._renderSingleCard(cardId, tempCard[0]);
                }
            }
            else if (prKey) {
                if (kObj._dataManager instanceof ej.DataManager && !kObj._dataManager.dataSource.offline || (kObj._dataSource().adaptor instanceof ej.remoteSaveAdaptor)) {
                    if (kObj._getKanbanCardData(kObj._bulkUpdateData, curData[primeKey])["length"] <= 0)
                        kObj._bulkUpdateData.push(curData);
                }
                else if (!(kObj._dataSource() instanceof ej.DataManager)) {
                    var tCard = kObj._getKanbanCardData(kObj._dataSource(), cardId);
                    tCard[0][prKey] = curData[prKey];
                }
                else {
                    var tCard = kObj._getKanbanCardData(kObj._dataSource().dataSource.json, cardId);
                    tCard[0][prKey] = curData[prKey];
                }
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
        var proxy = this, eventArgs, selectedCards, parentRow, columns, clonedElement, kObj = this.kanbanObj, dragParent;
        if (!args.element.dropped)
            clone && clone.remove();
        args.target = this._getCursorElement(args);
        var target = $(args.target).closest(".e-kanbancard").length > 0 ? $(args.target).closest(".e-kanbancard")[0] : args.target;
        if (kObj.element.hasClass('e-responsive') && !$(target).hasClass('e-targetclone')) {
            var parent = $(target).parents(".e-rowcell");
            if (!$(target).hasClass("e-kanbancard") && $(target).parents(".e-kanbancard").length == 0 && parent.length > 0) {
                args.target = target = parent[0];
            }
        }
        proxy._dropEle.removeClass("e-dropping e-dragged");
        eventArgs = { data: args.dragData, draggedElement: args.dragEle, dropTarget: $(target), event: args.event };
        if (kObj._trigger('cardDragStop', eventArgs))
            return false;
        parentRow = $(args.element).parents('.e-columnrow');
        selectedCards = parentRow.find('.e-cardselection');
        columns = parentRow.find('.e-rowcell');
        clonedElement = kObj.element.find('.e-targetclone');
        dragParent = $(args.element).parents('.e-rowcell');
        var isAdd = $(target).parent().children().hasClass("e-customaddbutton"), isLimit = $(target).parent().children().hasClass("e-limits"), isToggle = $(target).parent().children().hasClass("e-shrinkheader"), child = $(target).parent().children();
        var toggle = isToggle ? (isAdd ? (isLimit ? child.length == 4 : child.length == 3) : isLimit ? child.length == 3 : child.length == 2) : isAdd ? (isLimit ? child.length == 3 : child.length == 2) : (isLimit ? child.length == 2 : child.length == 1);
        if (clonedElement.is(':visible') && document.body.style.cursor == '' && target.style.cursor == '') {
            if ((target.nodeName == "TD" && $(target).parent().hasClass("e-columnrow") && clonedElement.is(':visible')) || clonedElement.siblings().length <= 0 || toggle) {
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
                if (clonedElement.is(':visible') || selectedCards.length > 1)
                    proxy._dropAsSibling($(target), $(args.element), pre);
            }
        }
        else
            proxy._removeKanbanCursor();
        if (kObj.element.hasClass('e-responsive'))
            kObj.element.parents('body').removeClass('e-kbnwindow-modal');
        kObj._autoKbnSwipeLeft = false;
        kObj._autoKbnSwipeRight = false;
        kObj.element.find(".e-targetclone").remove();
        columns.height(parentRow.find(target).parents('.e-rowcell').height() - kObj._tdHeightDiff);
        kObj._on(kObj.element, "mouseenter mouseleave", ".e-columnrow .e-kanbancard", kObj._cardHover);
        $(clone).length > 0 && $(clone).remove();
        kObj._renderLimit();
        kObj._totalCount();
        kObj._eventBindings();
        if (kObj.model.isResponsive)
            kObj._kanbanWindowResize();
        var draggedEle = kObj.element.find("#" + args.element.attr('id'));
        if ($(draggedEle).hasClass('e-cardselection'))
            draggedEle = $(draggedEle).parents('.e-columnrow').find('.e-cardselection:visible');
        eventArgs.draggedElement = draggedEle;
        eventArgs.draggedParent = dragParent;
        if (kObj._trigger('cardDrop', eventArgs))
            return false;
        var cells = dragParent.parent().find('.e-rowcell'), curDragParent = draggedEle.parents('.e-rowcell');
        if (kObj.element.hasClass('e-responsive') && curDragParent[0] != dragParent[0] && cells.index(curDragParent) != kObj._kbnSwipeCount) {
            if (cells.index(curDragParent) > cells.index(dragParent))
                kObj._kbnLeftSwipe();
            else
                kObj._kbnRightSwipe();
        }
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
        if (!kObj.element.hasClass('e-responsive')) {
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
        else if ($(target).parents('.e-columnrow').has(args.element).length == 0 || $(target).parents('.e-swimlanerow').length > 0)
            document.body.style.cursor = 'not-allowed';
        clonedCard = $(clonedElement).find('.e-kanbancard');
        if (clonedCard.length > 0)
            clonedCard[0].style.cursor = 'not-allowed';
    };
    InternalDragAndDrop.prototype._removeKanbanCursor = function () {
        document.body.style.cursor = '';
        this.kanbanObj.element.find('.e-kanbancard,.e-shrink,.e-shrinkheader,.e-slexpandcollapse').css('cursor', '');
    };
    InternalDragAndDrop.prototype._drag = function () {
        var proxy = this, clonedElement = null, draggedEle = null, dragContainment = null, prevTd = null, timeot = null, queryManager, pre, eventArgs, data = [], trgtClone, draggedCard, allowDrop, kObj = this.kanbanObj;
        if (kObj.element != null)
            dragContainment = kObj.getContent().find("div:first");
        $(kObj.getContent()).find("div.e-kanbancard").not(".e-js").ejDraggable({
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
                if (data.length != 0)
                    data = [];
                for (var i = 0; i < draggedEle.length; i++) {
                    if (draggedEle[i].id != "") {
                        queryManager = new ej.DataManager(kObj._currentJsonData);
                        data.push(queryManager.executeLocal(new ej.Query().where(kObj.model.fields.primaryKey, ej.FilterOperators.equal, parseInt(draggedEle[i].id))));
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
                kObj._kTouchBar.hide();
                if (!kObj._autoKbnSwipeRight && kObj.element.hasClass('e-responsive')) {
                    if ((kObj.element.offset().left + kObj.element.width()) - 50 < kObj._kbnMouseX) {
                        _tDragRight = window.setInterval(function () {
                            if (dCard.is(':hidden'))
                                _tDragRight && (_tDragRight = window.clearInterval(_tDragRight));
                            else {
                                if (kObj.element.offset().left + kObj.element.width() < kObj._kbnMouseX)
                                    _tDragRight = window.clearInterval(_tDragRight);
                                else if (kObj.element.offset().left + kObj.element.width() - 50 < kObj._kbnMouseX)
                                    kObj._kbnLeftSwipe();
                                else
                                    _tDragRight && (_tDragRight = window.clearInterval(_tDragRight));
                            }
                        }, 1500);
                        kObj._autoKbnSwipeRight = true;
                    }
                }
                if (!kObj._autoKbnSwipeLeft && kObj.element.hasClass('e-responsive')) {
                    if (kObj.element.offset().left + 20 > kObj._kbnMouseX) {
                        _tDragLeft = window.setInterval(function () {
                            if (dCard.is(':hidden'))
                                _tDragLeft && (_tDragLeft = window.clearInterval(_tDragLeft));
                            else {
                                if (kObj.element.offset().left + 20 > kObj._kbnMouseX)
                                    kObj._kbnRightSwipe();
                                else
                                    _tDragLeft && (_tDragLeft = window.clearInterval(_tDragLeft));
                            }
                        }, 1500);
                        kObj._autoKbnSwipeLeft = true;
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
                dragTd = $(args.element).closest("td.e-rowcell").addClass("e-dragged");
                dragTd.siblings().addClass("e-dropping");
                eventArgs = { draggedElement: draggedEle, data: data, dragTarget: target, event: args["event"] };
                prevTd = dropTd = $(target).closest("td.e-rowcell");
                selectedCards = dropTd.parents('.e-columnrow').find('.e-cardselection');
                if (dropTd && dropTd.hasClass("e-droppable") && $(dropTd).parent().has(args.element[0]).length > 0 && (target != args.element[0] || selectedCards.length > 1)) {
                    document.body.style.cursor = '';
                    if ($(trgtClone).parents('.e-rowcell').index() != dropTd.index())
                        $(trgtClone).remove();
                    dropTd.find(".e-kanbancard").removeClass("e-hover");
                    var lastEle, prevHgt;
                    if (kObj.element.hasClass('e-responsive')) {
                        var parent = $(target).parents(".e-rowcell");
                        if (!$(target).hasClass("e-kanbancard") && $(target).parents(".e-kanbancard").length == 0 && parent.length > 0) {
                            target = parent;
                            dropTd = target.find('.e-cell-scrollcontent').children().eq(0);
                        }
                    }
                    lastEle = dropTd.children().last();
                    if (lastEle.hasClass('e-shrinkheader'))
                        lastEle = lastEle.prev();
                    if ($(target).hasClass("e-rowcell") && (args.element[0] != lastEle[0] || selectedCards.length > 1) && !$(target).hasClass("e-shrink")) {
                        if (lastEle.length == 0 || dropTd.children().length == 0 || (lastEle.offset().top + lastEle.height() < $(clonedElement).offset().top)) {
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
                    }
                    else if ($(target).hasClass("e-rowcell") && $(target).hasClass("e-shrink")) {
                        var column = new ej.DataManager(kObj.model.columns).executeLocal(new ej.Query().where('key', ej.FilterOperators.equal, $(target).attr('ej-mappingkey')));
                        kObj.toggleColumn(column[0].headerText);
                        $(target).addClass('e-togglevisible');
                    }
                    else if ($(target).hasClass("e-kanbancard") || $(target).hasClass("e-targetclone")) {
                        var parentTd = $(target).parents('.e-rowcell');
                        prevHgt = parentTd.height();
                        if (($(target).offset().top + ($(target).height()) / 2) >= args["event"].pageY) {
                            if ($(target).prev()[0] != args.element[0] || selectedCards.length > 1) {
                                if (!$(target).hasClass("e-targetclone")) {
                                    proxy._removeKanbanCursor();
                                    $(trgtClone).insertBefore($(target)).height($(args.element[0]).height()).width($(target).width()).removeClass('e-targetappend');
                                }
                            }
                            else
                                proxy._changeKanbanCursor(target, clonedElement, args);
                        }
                        else {
                            if ($(target).next()[0] != args.element[0] || selectedCards.length > 1) {
                                prevHgt = $(target).parents('.e-rowcell').height();
                                if (!$(target).hasClass("e-targetclone")) {
                                    pre = true;
                                    proxy._removeKanbanCursor();
                                    $(trgtClone).insertAfter($(target)).height($(args.element[0]).height()).width($(target).width()).addClass('e-targetappend');
                                }
                            }
                            else
                                proxy._changeKanbanCursor(target, clonedElement, args);
                        }
                        if (prevHgt < parentTd.height()) {
                            parentTd.height(parentTd.height());
                            kObj._tdHeightDiff = parentTd.height() - prevHgt;
                        }
                    }
                }
                else {
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
                if (!ej.isNullOrUndefined(event.element) && $(event.element).hasClass('e-draggable')) {
                    clonedElement = ej.buildTag('div.e-draggedcard');
                    clonedElement.addClass(kObj.model.cssClass);
                    draggedEle = $(event.element).clone().addClass("dragClone");
                    $(clonedElement).css({ "width": event.element.width() });
                    clonedElement.append(draggedEle);
                    $(clonedElement).find("div:first").removeClass("e-hover");
                    clonedElement.appendTo(kObj.element);
                    trgtClone = ej.buildTag('div.e-targetclone');
                    $(trgtClone).css({ "width": event.element.width(), "height": event.element.height() });
                }
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
            kObj._processBindings(args);
        }
        kObj.element.parents('body').removeClass('e-kbnwindow-modal');
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
            if (primaryKey && data) {
                var queryManagar = kObj.model.query, cloned = queryManagar.clone();
                if ($.type(kObj._currentJsonData[0][pKey]) == "number")
                    primaryKey = parseInt(primaryKey);
                args = { data: data, requestType: "save", action: "add", primaryKeyValue: primaryKey };
                kObj._cAddedRecord = data;
                new ej.DataManager(kObj._currentJsonData).insert(data);
                kObj._saveArgs = args;
                kObj._updateGroup(args.primaryKeyValue, args.data);
                kObj.getContentTable().find("colgroup").first().replaceWith(kObj._getMetaColGroup());
                if (!ej.isNullOrUndefined(kObj.model.fields.swimlaneKey)) {
                    queryManagar = queryManagar.group(kObj.model.fields.swimlaneKey);
                    kObj.currentViewData = new ej.DataManager(kObj._currentJsonData).executeLocal(queryManagar)["result"];
                }
                kObj._renderAllCard();
                kObj._enableDragandScroll();
                (kObj._dataSource() instanceof ej.DataManager) ? kObj._dataSource().dataSource.json.push(data) : kObj._dataSource(undefined, true).splice(kObj._dataSource().length, 0, data);
                kObj._cAddedRecord = null;
                kObj._renderLimit();
                kObj._totalCount();
                kObj._eventBindings();
                queryManagar.queries = cloned.queries;
            }
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
                kObj._processBindings(args);
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
        if (kObj._trigger("actionBegin", args))
            return true;
        kObj._cDeleteData = currentData;
        if (kObj._dataSource() instanceof ej.DataManager && (!kObj._dataManager.dataSource.offline && kObj._dataManager.dataSource.json !== undefined) || (kObj._dataSource().adaptor instanceof ej.remoteSaveAdaptor)) {
            promise = kObj._dataManager.remove(kObj.model.fields.primaryKey, primaryKey);
            var proxy = this;
            if ($.isFunction(promise.promise)) {
                promise.done(function () {
                    kObj._processBindings(args);
                    kObj._cDeleteData = null;
                });
                promise.fail(function (e) {
                    args.error = e;
                    kObj._trigger("actionFailure", args);
                });
            }
            else
                kObj._processBindings(args);
        }
        else
            kObj._processBindings(args);
        if (promise == undefined || !$.isFunction(promise.promise))
            kObj._cDeleteData = null;
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
            kObj._processBindings(args);
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
                    if (curControl.hasClass("e-disable"))
                        params.enabled = false;
                    if (!ej.isNullOrUndefined(customParams))
                        $.extend(params, customParams);
                    curControl.ejDropDownList(params);
                    curControl.ejDropDownList("setSelectedValue", curControl.val());
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
        elementWidth = element.offsetWidth;
        elementHeight = element.offsetHeight;
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
        if (kObj.element.hasClass('e-responsive'))
            this._setAdaptEditWindowHeight();
    };
    InternalEdit.prototype._setAdaptEditWindowHeight = function () {
        var kObj = this.kanbanObj, kbnDialog, scroller, title;
        kbnDialog = kObj.element.find('.e-kanbandialog'), scroller = kbnDialog.parents('.e-dialog-scroller'), title;
        kbnDialog.parents('.e-dialog').css({ 'top': '0', 'left': '0' }).addClass('e-kbnadapt-editdlg');
        kbnDialog.parents('body').addClass('e-kbnwindow-modal');
        title = scroller.prev('.e-titlebar');
        scroller.ejScroller({ height: $(window).height() - title.outerHeight() });
        scroller.data('ejScroller').refresh();
        kbnDialog.css('height', scroller.height());
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
                var $edit = kObj.element.find('.e-kanbandialog');
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
                if (($element.hasClass("e-dropdownlist e-input") && $element.attr("id").indexOf("_input") != -1) || ($element.hasClass("e-dropdownlist") && $element.is(':hidden'))) {
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
            kObj._editForm = kObj.element.find(".kanbanform");
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
                kObj.element.find('.e-kanbandialog').removeAttr('data-id');
                $("#" + kObj._id + "_dialogEdit").ejDialog("close");
            }
            else if (kObj.model.editSettings.editMode == "externalform" || kObj.model.editSettings.editMode == "externalformtemplate") {
                if (kObj.model.editSettings.formPosition == "right")
                    $(kObj.element).children().css("width", "100%");
                $edit.removeAttr('data-id');
                $("#" + kObj._id + "_externalEdit").css("display", "none");
            }
        }
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
        var form = kObj.element.find(".kanbanform");
        ele = form.find("#" + kObj._id + "_" + fName).length > 0 ? form.find("#" + kObj._id + "_" + fName) : form.find("#" + fName);
        !ele.attr("name") && ele.attr("name", name);
        ele.rules("add", rules);
        var validator = kObj.element.find(".kanbanform").validate();
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
            return this.kanbanObj.element.find(".kanbanform").validate().form();
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
                attr: ["headerTemplate", "headerText", "key", "isCollapsed", "showAddButton", "visible", "constraints.type", "constraints.min", "constraints.max"]
            }, {
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
                showCount: true
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
                    { menuItem: "Add Card" }, { menuItem: "Edit Card" }, { menuItem: "Delete Card" }, { menuItem: "Top of Row" }, { menuItem: "Bottom of Row" }, { menuItem: "Move Up" }, { menuItem: "Move Down" }, { menuItem: "Move Left" }, { menuItem: "Move Right" }, { menuItem: "Move to Swimlane" }, { menuItem: "Hide Column" }, { menuItem: "Visible Columns" }], customMenuItems: []
            },
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
        this._kbnFilterObject = [];
        this._kbnAdaptFilterObject = [];
        this._kbnFilterCollection = [];
        this._kbnAdaptDdlData = [];
        this._kbnAdaptDdlIndex = 0;
        this._kbnSwipeWidth = 0;
        this._kbnSwipeCount = 0;
        this._searchTout = null;
        this._cardSelect = null;
        this._kbnMouseX = null;
        this._kbnAutoFilterCheck = false;
        this._autoKbnSwipeLeft = false;
        this._autoKbnSwipeRight = false;
        this._kbnTransitionEnd = true;
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
        this._selectedCards = [];
        this._selectedCardData = [];
        this._tableBEle = null;
        this._saveArgs = null;
        this._cModifiedData = null;
        this._dropped = null;
        this._cAddedRecord = null;
        this._cDeleteData = null;
        this._isAddNewClick = false;
        this._currentData = null;
        this._newCard = null;
        this._cardEditClick = null;
        this._collapsedCards = [];
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
        this._failBulkData = [];
        this._priorityCollection = [];
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
        var columns = this.model.columns;
        for (var i = 0; i < columns.length; i++) {
            if (columns[i]["headerText"] == headerText)
                break;
        }
        return i == columns.length ? null : columns[i];
    };
    Kanban.prototype._destroy = function () {
        this.element.off();
        this.element.find(".e-kanbanheader").find(".e-headercontent")
            .add(this.getContent().find(".e-content")).unbind('scroll');
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
    };
    Kanban.prototype._kbnTouchClick = function (e) {
        if (this.model.selectionType == "multiple") {
            if (this._kTouchBar.is(':visible') && (!$(e.target).hasClass('e-cardselection') && $(e.target).parents('.e-cardselection').length <= 0 && !$(e.target).hasClass('e-cardtouch') && $(e.target).parents('.e-cardtouch').length <= 0) && !this._kTouchBar.find(".e-cardtouch").hasClass("e-spanclicked"))
                this._kTouchBar.hide();
        }
        if (e.type == 'touchstart')
            this._cardSelect = 'touch';
    };
    Kanban.prototype._kbnHoldHandler = function (e) {
        if (this.model.enableTouch)
            this._cardSelect = 'hold';
    };
    Kanban.prototype.showColumns = function (c) {
        var args = {}, key, hidden = "_hiddenColumns", visible = "_visibleColumns";
        key = typeof (c) == "string" ? this.getColumnByHeaderText(c) : this.getColumnByHeaderText(c[0]);
        this._showExpandColumns(key, c, hidden, visible);
        this._showhide(this[visible], "show");
        this._renderLimit();
        this._totalCount();
        if (this.model.stackedHeaderRows.length > 0) {
            this._refreshStackedHeader();
        }
    };
    Kanban.prototype._showhide = function (shcolumns, val) {
        var i, count = 0, hideshowCols, columns = this.model.columns;
        hideshowCols = (val === "show") ? "_visibleColumns" : "_hiddenColumns";
        var $head = this.getHeaderTable().find("thead");
        var $headerCell = $head.find("tr").not(".e-stackedHeaderRow").find(".e-headercell");
        var $col = this.getHeaderTable().find("colgroup").find("col"), column;
        var $content_col = this.getContentTable().find("colgroup").find("col");
        var columnrow = this._columnRows;
        for (i = 0; i < columns.length; i++) {
            if ($.inArray(columns[i]["headerText"], this[hideshowCols]) != -1) {
                if (val === "show")
                    columns[i].visible = true;
                else
                    columns[i].visible = false;
                count++;
            }
            column = this.getColumnByHeaderText(shcolumns[i]);
            var index = $.inArray(column, this.model.columns);
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
                if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey)) {
                    if ($(columnrow[j]).is(":visible"))
                        columnrow.eq(j).prev().find(".e-rowcell").attr("colspan", this.getVisibleColumnNames().length);
                    else {
                        columnrow.eq(j).prev().prev(".e-swimlanerow").find(".e-rowcell").attr("colspan", this.getVisibleColumnNames().length);
                        if (!columns[i].visible)
                            columnrow.eq(j).prev(".e-collapsedrow").find("td.e-rowcell").eq(i).addClass("e-hide");
                        else
                            columnrow.eq(j).prev(".e-collapsedrow").find("td.e-rowcell").eq(i).removeClass("e-hide");
                    }
                }
                var colval = columnrow.eq(j).find("td.e-rowcell[ej-mappingkey='" + this.model.columns[i].key + "']");
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
        var $header = this.element.find(".e-kanbanheader");
        this._columnsWidthCollection = [];
        for (var columnCount = 0; columnCount < this.model.columns.length; columnCount++)
            if (!ej.isNullOrUndefined(this.model.columns[columnCount]["width"])) {
                this._columnsWidthCollection.push(this.model.columns[columnCount]["width"]);
            }
        this.element[0].replaceChild(this._renderHeader()[0], $header[0]);
        this.getContentTable().find("colgroup").first().replaceWith(this._getMetaColGroup());
        this._setWidthToColumns();
        this._refreshScroller({ requestType: "refresh" });
    };
    Kanban.prototype.searchCards = function (searchString) {
        var args, searchBar = $("#" + this._id + "_toolbarItems_search");
        if (searchBar.find("input").val() != searchString)
            searchBar.find("input").val(searchString);
        args = { requestType: "search", keyValue: searchString };
        if (searchString != "" || this.model.searchSettings.key != "") {
            this.model.searchSettings.key = searchString;
            if (searchBar.find('.e-searchfind').length > 0)
                this._initialData = this._currentJsonData;
            this._processBindings(args);
        }
    };
    Kanban.prototype.clearSearch = function () {
        this.element.find(".e-kanbantoolbar #" + this._id + "_toolbarItems_search").val("");
        this.searchCards("");
        $.extend(this.model.searchSettings, this.defaults.searchSettings);
    };
    Kanban.prototype._onToolbarKeypress = function (sender) {
        var $kanbanEle = this.element, kanbanObj = $kanbanEle.ejKanban("instance");
        if ($kanbanEle.hasClass('e-responsive')) {
            $(this["itemsContainer"]).parent().children().not('.e-searchbar').hide();
            this._kbnTimeoutSearch($kanbanEle, sender);
        }
    };
    Kanban.prototype._kbnTimeoutSearch = function ($kanbanEle, sender) {
        var kanbanObj = $kanbanEle.ejKanban("instance"), target;
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
                kanbanObj.searchCards(val);
                $('.e-kbnsearchwaitingpopup').addClass('e-kanbanwaitingpopup').removeClass('e-kbnsearchwaitingpopup').css({ 'top': '0px', 'left': '0px' });
                if (!ej.isNullOrUndefined(kanbanObj.model.fields.swimlaneKey)) {
                    var query = new ej.Query().where(ej.Predicate["or"](kanbanObj.keyPredicates)).select(kanbanObj.model.fields.swimlaneKey);
                    kanbanObj._kbnAdaptDdlData = new ej.DataManager(kanbanObj._currentJsonData).executeLocal(query);
                    kanbanObj._kbnAdaptDdlData = ej.dataUtil.mergeSort(ej.dataUtil.distinct(kanbanObj._kbnAdaptDdlData));
                    kanbanObj._addSwimlaneName();
                }
                $kanbanEle.data("ejWaitingPopup").hide();
                clearTimeout(timeot);
            }, 300);
            kanbanObj._searchTout = window.clearInterval(kanbanObj._searchTout);
        }, 1000);
    };
    Kanban.prototype._onToolbarClick = function (sender) {
        var $kanbanEle = $(this["itemsContainer"]).closest(".e-kanban"), kanbanObj = $kanbanEle.data("ejKanban"), $searchIcon;
        var currentTarget = sender.currentTarget;
        var target = sender.target;
        if (target.tagName == 'INPUT' && $(target).parent().next().hasClass("e-cancel") && $(target).val().length == 0) {
            this.clearSearch();
            $searchIcon = this._searchBar.find(".e-toolbaricons");
            $searchIcon.removeClass("e-cancel").addClass("e-searchfind");
        }
        if (this.element.hasClass('e-responsive')) {
            $(this["itemsContainer"]).parent().children().not('.e-searchbar').hide();
            if (sender.keyCode == 8) {
                this._kbnTimeoutSearch(this.element, sender);
            }
        }
        if (sender.event == undefined)
            return false;
        if ($(currentTarget).hasClass("e-quickfilter"))
            return false;
        var filterName = $(currentTarget).text();
        for (var count = 0; count < kanbanObj.model.filterSettings.length; count++) {
            if (kanbanObj.model.filterSettings[count]["text"] == filterName)
                break;
        }
        var filterValue = (count == kanbanObj.model.filterSettings.length ? null : kanbanObj.model.filterSettings[count]);
        var args = { itemName: currentTarget.title, itemId: currentTarget.id, target: target, currentTarget: currentTarget, itemIndex: $(currentTarget).index(), toolbarData: sender, itemText: filterName, model: kanbanObj.model, cancel: false, type: "toolbarClick" };
        if (kanbanObj._trigger("toolbarClick", args))
            return false;
        if (args.itemId == this._id + "_search") {
            if (args.target.nodeName == "A") {
                kanbanObj.searchCards($(args.currentTarget).find("input").val());
                if (kanbanObj.model.allowSearching && kanbanObj._searchBar != null && kanbanObj.model.searchSettings.key.length != 0) {
                    var $searchIcon = kanbanObj["_searchBar"].find(".e-toolbaricons");
                    if ($(target).is(kanbanObj["_searchBar"].find(".e-searchfind")))
                        $searchIcon.removeClass("e-searchfind").addClass("e-cancel");
                    else if ($(target).is(kanbanObj["_searchBar"].find(".e-cancel"))) {
                        $searchIcon.removeClass("e-cancel").addClass("e-searchfind");
                        kanbanObj.clearSearch();
                    }
                }
            }
            if (!kanbanObj._isWatermark) {
                kanbanObj._searchInput.blur(function () {
                    !kanbanObj._searchInput.val() && kanbanObj._hiddenSpan.css("display", "block");
                });
                kanbanObj._hiddenSpan.css("display", "none");
            }
        }
        else if ($(args.currentTarget).hasClass("e-printlist"))
            kanbanObj.print();
        else if (!$(currentTarget).parent().hasClass("e-customtoolbar"))
            kanbanObj._filterHandler(filterValue, currentTarget);
        return false;
    };
    Kanban.prototype.print = function () {
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
        var printWin = window.open('', 'print', "height=452,width=1024,tabbar=no");
        args = { requestType: "print", element: elementClone };
        this._trigger("beforePrint", args);
        if (!ej.isNullOrUndefined(args["element"]))
            elementClone = args["element"];
        ej.print(elementClone, printWin);
        this._trigger("actionComplete", args);
    };
    Kanban.prototype._filterHandler = function (filterValue, currentTarget) {
        var args = { requestType: "filtering", currentFilterObject: [], filterCollection: this._filterCollection };
        args.currentFilterObject.push(filterValue);
        if (this.model.isResponsive) {
            var filter = [];
            this._kbnFilterObject = this._kbnFilterObject.concat(args.currentFilterObject);
            for (var i = 0; i < this._kbnFilterObject.length; i++) {
                var index = $.inArray(this._kbnFilterObject[i], filter);
                if (index < 0)
                    filter.push(this._kbnFilterObject[i]);
            }
            this._kbnFilterObject = filter;
        }
        this._initialData = this._currentJsonData;
        for (var i = 0; i < this.model.filterSettings.length; i++) {
            if (this.model.filterSettings[i].text == args.currentFilterObject[0].text) {
                var query = this.model.filterSettings[i].query["queries"][0].e;
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
        this._processBindings(args);
    };
    Kanban.prototype.filterCards = function (query) {
        var args = { requestType: "filtering", filterCollection: this._filterCollection };
        var query = query.queries[0].e;
        args.filterCollection.push(query);
        this._processBindings(args);
    };
    Kanban.prototype.clearFilter = function () {
        if (this._filterCollection.length != 0) {
            var args = { requestType: "filtering" };
            this._filterCollection = [];
            this.element.find(".e-kanbantoolbar .e-tooltxt").removeClass("e-select");
            this._processBindings(args);
        }
    };
    Kanban.prototype._wireEvents = function () {
        this._on(this.element, ($.isFunction($.fn.tap) && this.model.enableTouch) ? "tap" : "click", "", this._clickHandler);
        this._on($("#" + this._id + "_searchbar"), "keyup", "", this._onToolbarClick);
        this._on(this.element.find('.e-kanbancard'), "taphold", "", this._kbnHoldHandler);
        this._on($(document), 'click touchstart', "", this._kbnTouchClick);
        this._on(this.element, "swipeleft swiperight", ".e-kanbancontent", $.proxy(this._swipeKanban, this));
        this._on($("#" + this._id + "_searchbar"), "keypress", "", this._onToolbarKeypress);
        if (this.KanbanEdit)
            this._enableEditingEvents();
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
        this._enableCardHover();
    };
    Kanban.prototype._enableEditingEvents = function () {
        if (this.model.editSettings.allowEditing)
            this._on(this.element, "dblclick doubletap", ".e-kanbancard", this._cardDblClickHandler);
        else
            this._off(this.element, "dblclick doubletap", ".e-kanbancard");
        if (this.model.editSettings.allowAdding)
            this._on(this.element, "dblclick", ".e-kanbancontent .e-columnrow .e-rowcell", this._cellDblClickHandler);
        else
            this._off(this.element, "dblclick", ".e-kanbancontent .e-columnrow .e-rowcell");
        if (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding)
            this._on($("#" + this._id + "_dialogEdit"), "click keypress", "#EditDialog_" + this._id + "_Save ,#EditDialog_" + this._id + "_Cancel", this._clickHandler);
        else
            this._off($("#" + this._id + "_dialogEdit"), "click", "#EditDialog_" + this._id + "_Save ,#EditDialog_" + this._id + "_Cancel");
    };
    Kanban.prototype._cardDblClickHandler = function (args) {
        this._cardEditClick = true;
        this._dblArgs = args;
        if (this.KanbanEdit)
            this.KanbanEdit.startEdit($(args.target).closest('.e-kanbancard'));
    };
    Kanban.prototype._cellDblClickHandler = function (args) {
        if ($(args.target).hasClass('e-rowcell')) {
            this._isAddNewClick = true;
            this._newCard = $(args.target);
            if (this.KanbanEdit)
                this.KanbanEdit.addCard();
        }
    };
    Kanban.prototype._enableCardHover = function () {
        if (this.model.allowHover)
            this._on(this.element, "mouseenter mouseleave", ".e-columnrow .e-kanbancard", this._cardHover);
        else
            this._off(this.element, "mouseenter mouseleave", ".e-columnrow .e-kanbancard");
    };
    Kanban.prototype._showToolTip = function (event) {
        if (this.model.tooltipSettings.enable) {
            if ($(event.target).hasClass('e-kanbantooltip'))
                return;
            var data, queryManager, kTooltip = this.element.find('.e-kanbantooltip'), template = ej.isNullOrUndefined(this.model.tooltipSettings.template);
            if (template && !($(event.target).hasClass('e-tag') || $(event.target).hasClass('e-text') || $(event.target).closest('.e-primarykey').length > 0))
                return;
            if (template)
                kTooltip.html($(event.target).text()).removeClass("e-tooltiptemplate");
            else {
                kTooltip.addClass("e-tooltiptemplate");
                queryManager = new ej.DataManager(this._currentJsonData);
                data = queryManager.executeLocal(new ej.Query().where(this.model.fields.primaryKey, ej.FilterOperators.equal, $(event.currentTarget).attr("id")));
                kTooltip.html($(this.model.tooltipSettings.template).render(data[0]));
            }
            var xPos = event.pageX;
            var yPos = event.pageY;
            var tooltipdivelmt = $(this.element).find('.e-kanbantooltip');
            xPos = ((xPos + tooltipdivelmt.width()) < $(this.element).width()) ? (xPos) : (xPos - tooltipdivelmt.width());
            yPos = ((yPos + tooltipdivelmt.height()) < $(this.element).height()) ? (yPos) : (yPos - tooltipdivelmt.height());
            tooltipdivelmt.css("left", xPos);
            tooltipdivelmt.css("top", yPos);
            if (this.model.enableRTL == true)
                tooltipdivelmt.addClass("e-rtl");
            $(this.element).find('.e-kanbantooltip').show();
        }
    };
    Kanban.prototype._hideToolTip = function () {
        if (this.model.tooltipSettings.enable)
            this.element.find('.e-kanbantooltip').hide();
    };
    Kanban.prototype.expandAll = function () {
        var slDivs = this.element.find(".e-swimlanerow .e-slcollapse");
        if (slDivs.length != 0) {
            for (var i = 0; i < slDivs.length; i++)
                this.toggleSwimlane($(slDivs[i]));
        }
    };
    Kanban.prototype.collapseAll = function () {
        var slDivs = this.element.find(".e-swimlanerow .e-slexpand");
        if (slDivs.length != 0) {
            for (var i = 0; i < slDivs.length; i++)
                this.toggleSwimlane($(slDivs[i]));
        }
    };
    Kanban.prototype._moveCurrentCard = function (index, key, e) {
        var cellindex, rowCellIndex, cards, cardIndex, cellcards, tdCard, column, cellcardsCount, tdCellIncr, tdCellDecr, colCellSel;
        rowCellIndex = this.selectedRowCellIndexes[0];
        var rowcardIndex = rowCellIndex.cardIndex;
        cellindex = rowCellIndex.cellIndex[rowCellIndex.cellIndex.length - 1];
        if (key == "down" || key == "up") {
            colCellSel = $(this._columnRows[index]).find("td.e-rowcell").eq(cellindex);
            cellcards = colCellSel.find(".e-kanbancard");
            cardIndex = $(cellcards).index(colCellSel.find(".e-cardselection"));
            cellcardsCount = cellcards.length;
            if (key == "down") {
                if (ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                    if (this.model.selectionType == "multiple")
                        cardIndex = rowcardIndex[rowCellIndex.cellIndex.length - 1][rowcardIndex[rowCellIndex.cellIndex.length - 1].length - 1];
                    else
                        cardIndex = rowcardIndex[rowCellIndex.cellIndex.length - 1];
                else if ((e.shiftKey || e.ctrlKey) && this.model.selectionType == "multiple")
                    cardIndex = rowcardIndex[rowCellIndex.cellIndex.length - 1][rowcardIndex[rowCellIndex.cellIndex.length - 1].length - 1];
                if (cardIndex == (cellcardsCount - 1) || cellcardsCount == 0)
                    if (index == this._columnRows.length - 1)
                        return;
                    else if ((!e.shiftKey && !e.ctrlKey) || (this.model.selectionType == "single"))
                        this._moveCurrentCard(index + 1, key, e);
                    else
                        return;
                else if (cellcards.eq(cardIndex + 1).hasClass("e-cardselection"))
                    this._cardSelection([[index, [cellindex], [cardIndex]]], $(cellcards[cardIndex]), e);
                else
                    this._cardSelection([[index, [cellindex], [cardIndex + 1]]], $(cellcards[cardIndex + 1]), e);
            }
            else if (key == "up") {
                if (ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                    if (this.model.selectionType == "multiple")
                        cardIndex = rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1][rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1].length - 1];
                    else
                        cardIndex = rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1];
                else if ((e.shiftKey || e.ctrlKey) && this.model.selectionType == "multiple")
                    cardIndex = rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1][rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1].length - 1];
                if (cellcardsCount == 0 || cardIndex == 0)
                    if (index == 0)
                        return;
                    else if ((!e.shiftKey && !e.ctrlKey) || (this.model.selectionType == "single"))
                        this._moveCurrentCard(index - 1, key, e);
                    else
                        return;
                else if (cellcards.eq(cardIndex - 1).hasClass("e-cardselection"))
                    this._cardSelection([[index, [cellindex], [cardIndex]]], $(cellcards[cardIndex]), e);
                else {
                    if (cardIndex != -1)
                        this._cardSelection([[index, [cellindex], [cardIndex - 1]]], $(cellcards[cardIndex - 1]), e);
                    else
                        this._cardSelection([[index, [cellindex], [cellcardsCount - 1]]], $(cellcards[cellcardsCount - 1]), e);
                }
            }
            if ((!e.shiftKey && !e.ctrlKey) || ("single"))
                if (this.element.find(".e-cardselection").closest("tr.e-columnrow:visible").length == 0)
                    this.toggleSwimlane($(this._columnRows[this.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slcollapse"));
        }
        else {
            var card, cardselec, switchcard;
            column = $(this._columnRows[rowCellIndex.rowIndex]);
            tdCard = column.find("td.e-rowcell");
            cellcards = tdCard.eq(index).find(".e-kanbancard");
            cards = tdCard.eq(index).find(".e-kanbancard");
            tdCellIncr = tdCard.eq(index + 1);
            tdCellDecr = tdCard.eq(index - 1);
            card = this.element.find(".e-kanbancard");
            cardselec = this.element.find(".e-cardselection");
            if ((!tdCellDecr.is(":visible") || !tdCellIncr.is(":visible")) && !ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                if (this.element.find(".e-cardselection").closest("tr.e-columnrow:visible").length == 0)
                    this.toggleSwimlane($(this._columnRows[this.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slcollapse"));
            if ((e.shiftKey || e.ctrlKey) && this.model.selectionType == "multiple")
                cardIndex = rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1][rowCellIndex.cardIndex[rowCellIndex.cellIndex.length - 1].length - 1];
            else if (this.model.selectionType == "single")
                cardIndex = rowCellIndex.cardIndex[0];
            else
                cardIndex = rowCellIndex.cardIndex[0][0];
            if (key == "right") {
                switchcard = card.eq(card.index(cardselec) + 1);
                if (index == tdCard.length - 1) {
                    if (switchcard.length > 0 && ((!e.shiftKey && !e.ctrlKey) || (this.model.selectionType == "single")) && !ej.isNullOrUndefined(this.model.fields.swimlaneKey)) {
                        this._cardSelection([[this._columnRows.index(switchcard.closest("tr.e-columnrow")), [switchcard.closest("tr.e-columnrow").find("td.e-rowcell").index(switchcard.closest("td.e-rowcell"))], [0]]], switchcard, e);
                        if (this.element.find(".e-cardselection").closest("tr:visible").length == 0)
                            this.toggleSwimlane($(this._columnRows[this.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slcollapse"));
                    }
                    return;
                }
                if (tdCellIncr.find(".e-kanbancard:visible").length > 0) {
                    cards = tdCellIncr.find(".e-kanbancard");
                    if (cards.eq(cardIndex).length > 0)
                        this._cardSelection([[rowCellIndex.rowIndex, [index + 1], [cardIndex]]], $(cards[cardIndex]), e);
                    else
                        this._cardSelection([[rowCellIndex.rowIndex, [index + 1], [cards.length - 1]]], $(cards[cards.length - 1]), e);
                    if (((!e.shiftKey && !e.ctrlKey) || (this.model.selectionType == "single")) && !ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                        if (this.element.find(".e-cardselection").closest("tr.e-columnrow:visible").length == 0)
                            this.toggleSwimlane($(this._columnRows[this.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slcollapse"));
                }
                else
                    this._moveCurrentCard(index + 1, key, e);
            }
            else if (key == "left") {
                if (card.index(cardselec) != 0)
                    switchcard = card.eq(card.index(cardselec) - 1);
                if (index == 0) {
                    if ((!e.shiftKey && !e.ctrlKey) && !ej.isNullOrUndefined(this.model.fields.swimlaneKey)) {
                        this.toggleSwimlane($(column).prev().find(".e-slexpand"));
                        if (ej.isNullOrUndefined(switchcard))
                            return;
                        if (switchcard.length > 0 && (!e.shiftKey && !e.ctrlKey) || (this.model.selectionType == "single")) {
                            this._cardSelection([[this._columnRows.index(switchcard.closest("tr.e-columnrow")), [switchcard.closest("tr.e-columnrow").find("td.e-rowcell").index(switchcard.closest("td.e-rowcell"))], [0]]], switchcard, e);
                            if (this.element.find(".e-cardselection").closest("tr.e-columnrow:visible").length == 0)
                                this.toggleSwimlane($(this._columnRows[this.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slcollapse"));
                        }
                    }
                    return;
                }
                if (tdCellDecr.find(".e-kanbancard:visible").length > 0) {
                    cards = tdCellDecr.find(".e-kanbancard");
                    if (cards.eq(cardIndex).length > 0)
                        this._cardSelection([[rowCellIndex.rowIndex, [index - 1], [cardIndex]]], $(cards[cardIndex]), e);
                    else
                        this._cardSelection([[rowCellIndex.rowIndex, [index - 1], [cards.length - 1]]], $(cards[cards.length - 1]), e);
                    if (((!e.shiftKey && !e.ctrlKey) || (this.model.selectionType == "single")) && !ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                        if (this.element.find(".e-cardselection").closest("tr.e-columnrow:visible").length == 0)
                            this.toggleSwimlane($(this._columnRows[this.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slexpand"));
                }
                else
                    this._moveCurrentCard(index - 1, key, e);
            }
        }
    };
    Kanban.prototype.clearSelection = function () {
        if (this.model.allowSelection) {
            var $kanbanRows = $(this._kanbanRows).not(".e-swimlanerow");
            $($kanbanRows).find(".e-rowcell .e-kanbancard").removeClass("e-cardselection");
            this.selectedRowCellIndexes = [];
            this._selectedCardData = [];
            this._selectedCards = [];
            this._previousRowCellIndex = [];
            this._currentRowCellIndex = [];
        }
    };
    Kanban.prototype._keyPressed = function (action, target, e, event) {
        var selectedcard, kanbancard, rowCellIndex, cellIndex, $target = $(target), returnValue = false;
        selectedcard = this.element.find(".e-cardselection");
        kanbancard = this.element.find(".e-kanbancard:visible");
        if (e.code == 13 && target.tagName == 'INPUT' && $target.closest("#" + this._id + "_toolbarItems_search").length)
            action = "searchRequest";
        rowCellIndex = this.selectedRowCellIndexes[0];
        var swimlane = !ej.isNullOrUndefined(this.model.fields.swimlaneKey);
        switch (action) {
            case "editCard":
                if (selectedcard.length > 0 && this.model.editSettings.allowEditing) {
                    cellIndex = rowCellIndex.cellIndex;
                    selectedcard = this._columnRows.eq(rowCellIndex.rowIndex).find("td.e-rowcell").eq(cellIndex[cellIndex.length - 1]).find(".e-kanbancard").eq(rowCellIndex.cardIndex[cellIndex.length - 1]);
                    this.KanbanEdit.startEdit(selectedcard);
                }
                break;
            case "insertCard":
                if (this.model.editSettings.allowAdding)
                    this.KanbanEdit.addCard();
                break;
            case "swimlaneExpandAll":
                this.expandAll();
                break;
            case "swimlaneCollapseAll":
                this.collapseAll();
                break;
            case "downArrow":
                if (selectedcard.length > 0 && (document.activeElement["id"] == this._id))
                    this._moveCurrentCard(rowCellIndex.rowIndex, "down", e);
                break;
            case "upArrow":
                if (selectedcard.length > 0 && (document.activeElement["id"] == this._id)) {
                    this._moveCurrentCard(rowCellIndex.rowIndex, "up", e);
                }
                break;
            case "leftArrow":
                if (selectedcard.length > 0 && (document.activeElement["id"] == this._id))
                    this._moveCurrentCard(rowCellIndex.cellIndex[rowCellIndex.cellIndex.length - 1], "left", e);
                if (this.element.hasClass('e-responsive') && this._kbnTransitionEnd)
                    this._kbnRightSwipe();
                break;
            case "rightArrow":
                if (selectedcard.length > 0 && (document.activeElement["id"] == this._id))
                    this._moveCurrentCard(rowCellIndex.cellIndex[rowCellIndex.cellIndex.length - 1], "right", e);
                if (this.element.hasClass('e-responsive') && this._kbnTransitionEnd)
                    this._kbnLeftSwipe();
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
                if (this.model.allowSelection) {
                    this.clearSelection();
                    kanbancard.eq(0).addClass("e-cardselection");
                    selectedcard = this.element.find(".e-cardselection");
                    var cardIndex = $(this._columnRows).find(".e-cardselection").index();
                    var selectionIndex = $(this._columnRows).find(".e-cardselection").parent().children().eq(0).hasClass("e-limits") ? cardIndex - 1 : cardIndex;
                    if (this.model.selectionType == "multiple")
                        this.selectedRowCellIndexes.push({ cardIndex: [[selectionIndex]], cellIndex: [selectedcard.parent().index()], rowIndex: $(this._columnRows).index(selectedcard.parents(".e-columnrow")) });
                    else
                        this.selectedRowCellIndexes.push({ cardIndex: [selectionIndex], cellIndex: [selectedcard.parent().index()], rowIndex: $(this._columnRows).index(selectedcard.parents(".e-columnrow")) });
                }
                break;
            case "lastCardSelection":
                if (this.model.allowSelection) {
                    this.clearSelection();
                    kanbancard.eq(kanbancard.length - 1).addClass("e-cardselection");
                    selectedcard = this.element.find(".e-cardselection");
                    selectedcard = this.element.find(".e-cardselection");
                    var cardIndex = $(this._columnRows).find(".e-cardselection").index();
                    var selectionIndex = $(this._columnRows).find(".e-cardselection").parent().children().eq(0).hasClass("e-limits") ? cardIndex - 1 : cardIndex;
                    if (this.model.selectionType == "multiple")
                        this.selectedRowCellIndexes.push({ cardIndex: [[selectionIndex]], cellIndex: [selectedcard.parent().index()], rowIndex: $(this._columnRows).index(selectedcard.parents(".e-columnrow")) });
                    else
                        this.selectedRowCellIndexes.push({ cardIndex: [selectionIndex], cellIndex: [selectedcard.parent().index()], rowIndex: $(this._columnRows).index(selectedcard.parents(".e-columnrow")) });
                }
                break;
            case "cancelRequest":
                if ($("#" + this._id + "_dialogEdit:visible").length > 0)
                    this.KanbanEdit.cancelEdit();
                else if (selectedcard.length > 0)
                    this.clearSelection();
                break;
            case "searchRequest":
                this.searchCards($target.val());
                this._searchBar.find(".e-toolbaricons").removeClass("e-searchfind").addClass("e-cancel");
                break;
            case "saveRequest":
                if ($("#" + this._id + "_dialogEdit:visible").length > 0)
                    this.KanbanEdit.endEdit();
                break;
            case "deleteCard":
                if (selectedcard.length > 0 && $("#" + this._id + "_dialogEdit:visible").length <= 0 && !ej.isNullOrUndefined(this.model.fields.primaryKey))
                    this.KanbanEdit.deleteCard(selectedcard.attr("id"));
                break;
            case "selectedSwimlaneExpand":
                if (selectedcard.length > 0 && swimlane)
                    if (!selectedcard.is(":visible"))
                        this.toggleSwimlane($(this._columnRows[this.selectedRowCellIndexes[0].rowIndex]).prev().prev(".e-swimlanerow").find(".e-slexpandcollapse"));
                break;
            case "selectedSwimlaneCollapse":
                if (selectedcard.length > 0 && swimlane)
                    if (selectedcard.is(":visible"))
                        this.toggleSwimlane($(this._columnRows[this.selectedRowCellIndexes[0].rowIndex]).prev().find(".e-slexpandcollapse"));
                break;
            case "selectedColumnCollapse":
                if (selectedcard.length > 0)
                    this._toggleField(this.model.columns[this.selectedRowCellIndexes[0].cellIndex[0]].headerText);
                break;
            case "selectedColumnExpand":
                if (this._collapsedColumns.length != 0)
                    this._toggleField(this._collapsedColumns[this._collapsedColumns.length - 1]);
                break;
            case "focus":
                this.element.find(".e-cardselection").focus();
                break;
            default:
                returnValue = true;
        }
        return returnValue;
    };
    Kanban.prototype._showExpandColumns = function (key, c, hidden, visible) {
        if (ej.isNullOrUndefined(key))
            return;
        if (key != null) {
            if ($.isArray(c)) {
                for (var i = 0; i < c.length; i++) {
                    var ckey = this.getColumnByHeaderText(c[i]);
                    c[i] = ckey != null ? ckey.headerText : c[i];
                }
            }
            else
                c = key.headerText;
        }
        if ($.isArray(c)) {
            for (i = 0; i < c.length; i++) {
                var index = $.inArray(c[i], this[hidden]);
                if (index != -1) {
                    this[hidden].splice(index, 1);
                    this[visible].push(c[i]);
                }
                else if (index == -1 && $.inArray(c[i], this[visible]) == -1 && !ej.isNullOrUndefined(this.getColumnByHeaderText(c[i]))) {
                    this[visible].push(this.getColumnByHeaderText(c[i]).key) && this[visible].push(c[i]);
                    this[hidden].splice($.inArray(this.getColumnByHeaderText(c[i]).key, this[hidden]), 1) && this[hidden].splice($.inArray(c[i], this[hidden]), 1);
                }
            }
        }
        else {
            index = $.inArray(c, this[hidden]);
            if (index != -1) {
                this[hidden].splice(index, 1);
                this[visible].push(c);
            }
            else if (index == -1 && $.inArray(c, this[visible]) == -1 && !ej.isNullOrUndefined(this.getColumnByHeaderText(c))) {
                this[visible].push(this.getColumnByHeaderText(c).key) && this[visible].push(c);
                this[hidden].splice($.inArray(this.getColumnByHeaderText(c).key, this[hidden]), 1) && this[hidden].splice($.inArray(c, this[hidden]), 1);
            }
        }
    };
    Kanban.prototype._createStackedRow = function (stackedHeaderRow) {
        var $tr = ej.buildTag('tr.e-columnheader e-stackedHeaderRow', "", {}, {}), sHeader = [];
        for (var s = 0; s < this.model.columns.length; s++) {
            var column = this.model.columns[s];
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
    Kanban.prototype._refreshStackedHeader = function () {
        var stackedRows = this.model.stackedHeaderRows, stackHeaderRow = this.element.find(".e-stackedHeaderRow");
        for (var i = 0; i < stackedRows.length; i++) {
            var stackedTr = this._createStackedRow(stackedRows[i]);
            if (stackHeaderRow.length > 0)
                stackHeaderRow.remove();
            $(this.getHeaderTable().find(".e-columnheader").before(stackedTr));
        }
        this.model.allowScrolling && this._refreshScroller({ requestType: "refresh" });
    };
    Kanban.prototype._expandColumns = function (c) {
        var key, hidden = "_collapsedColumns", visible = "_expandedColumns";
        key = typeof (c) == "string" ? this.getColumnByHeaderText(c) : this.getColumnByHeaderText(c[0]);
        this._showExpandColumns(key, c, hidden, visible);
        this._expandCollapse(this[visible], "expand");
        if (this.model.allowScrolling)
            this._setWidthToColumns();
        if (this.model.stackedHeaderRows.length > 0) {
            this._refreshStackedHeader();
        }
    };
    Kanban.prototype._setWidthToColumns = function () {
        var $cols1 = this.getContentTable().children("colgroup").find("col"), $cols2 = this.getHeaderTable().children("colgroup").find("col");
        var width = this._originalWidth - (this._collapsedColumns.length * 50);
        for (var i = 0; i < $cols2.length; i++) {
            if (!ej.isNullOrUndefined(this._columnsWidthCollection[i]) && !this.model.allowToggleColumn) {
                $cols1.eq(i).width(this._columnsWidthCollection[i]);
                $cols2.eq(i).width(this._columnsWidthCollection[i]);
            }
            else if (this.model.allowScrolling) {
                var colWidth = parseInt((width / this._expandedColumns.length).toFixed(2)), bSize = parseInt((width / (this.model.scrollSettings["buttonSize"] || 18) / 100).toFixed(2)), cWidth = colWidth - bSize;
                if (!this.model.columns[i].isCollapsed) {
                    $cols1.eq(i).css("width", cWidth + "px");
                    $cols2.eq(i).css("width", cWidth + "px");
                    this.model.columns[i].width = cWidth;
                }
                this._columnsWidthCollection[i] = parseInt((width / this.model.columns.length).toFixed(2)) - bSize;
            }
        }
    };
    Kanban.prototype._filterLimitCard = function (args) {
        for (var i = 0; i < this.model.columns.length; i++) {
            var column = this.model.columns[i];
            var card = this.getHeaderContent().find("span.e-totalcount");
            if (this.model.enableTotalCount) {
                card = $(card[i]);
                var index = $(card).text().indexOf(this.localizedLabels.FilterOfText);
                if (((!ej.isNullOrUndefined(args) && args.requestType == "filtering") || this.model.enableTotalCount) && args.filterCollection.length > 0) {
                    var $headerCell = this.getHeaderContent().find(".e-columnheader").not(".e-stackedHeaderRow").find(".e-headercell")[i];
                    if ($($headerCell).hasClass("e-exceed"))
                        $($headerCell).removeClass("e-exceed");
                    else if ($($headerCell).hasClass("e-deceed"))
                        $($headerCell).removeClass("e-deceed");
                    if (index != -1)
                        $(card).text($(card).text().slice(index + 3));
                    $(card).text($($(this.element.find(".e-columnrow")).find('td[ej-mappingkey=' + column.key + '] > div.e-kanbancard')).length + " " + this.localizedLabels.FilterOfText + " " + $(card).text());
                }
                else if (!ej.isNullOrUndefined(column.constraints))
                    this._renderLimit();
                else
                    $(card).text($(card).text().slice(index + 3));
            }
        }
    };
    Kanban.prototype._toggleField = function (c) {
        var index, i;
        if ($.isArray(c)) {
            for (i = 0; i < c.length; i++) {
                index = $.inArray(c[i], this._collapsedColumns);
                if (index != -1)
                    this._expandColumns(c[i]);
                else
                    this._collapseColumns(c[i]);
            }
        }
        else if ($.inArray(c, this._collapsedColumns) != -1)
            this._expandColumns(c);
        else
            this._collapseColumns(c);
        if (this.model.allowScrolling) {
            var $cols1 = this.getContentTable().children("colgroup").find("col"), $cols2 = this.getHeaderTable().children("colgroup").find("col");
            var width = this._originalWidth - (this._collapsedColumns.length * 50);
            for (i = 0; i < $cols2.length; i++) {
                var colWidth = parseInt((width / this._expandedColumns.length).toFixed(2)), bSize = parseInt((width / (this.model.scrollSettings["buttonSize"] || 18) / 100).toFixed(2)), cWidth = colWidth - bSize;
                if (!this.model.columns[i].isCollapsed) {
                    $cols1.eq(i).css("width", cWidth + "px");
                    $cols2.eq(i).css("width", cWidth + "px");
                    this.model.columns[i].width = cWidth;
                }
            }
        }
        this._refreshScroller({ requestType: "refresh" });
    };
    Kanban.prototype.refreshColumnConstraints = function () {
        this._renderLimit();
        var args = { requestType: "refresh" };
        if (this._filterCollection.length > 0) {
            args["filterCollection"] = this._filterCollection;
            this._filterLimitCard(args);
        }
        this._swimlaneLimit(args);
        this._enableSwimlaneCount = false;
    };
    Kanban.prototype._validateLimit = function (curColumn, $curHeaderCell, count) {
        var key = curColumn.key, $cell = $($(this.element.find(".e-columnrow")).find('td[ej-mappingkey=' + key + ']')), totalcard;
        var isMin = !ej.isNullOrUndefined(curColumn.constraints.min), isMax = !ej.isNullOrUndefined(curColumn.constraints.max), isSwimlane = !ej.isNullOrUndefined(this.model.fields.swimlaneKey) && count == 0;
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
        $($curHeaderCell).find(".e-limits").removeClass("e-hide");
    };
    Kanban.prototype._swimlaneLimit = function (args) {
        for (var i = 0; i < this.model.columns.length; i++) {
            var constraints = this.model.columns[i].constraints, key = this.model.columns[i].key, $min, $minLimit, $max, $maxLimit;
            if (!ej.isNullOrUndefined(constraints)) {
                var isMin = !ej.isNullOrUndefined(constraints.min), isMax = !ej.isNullOrUndefined(constraints.max), $cell = $($(this.getContent().find(".e-columnrow")).find('td[ej-mappingkey=' + key + ']'));
                if ((constraints.type == "swimlane" && !ej.isNullOrUndefined(this.model.fields.swimlaneKey)) && ((this._enableSwimlaneCount && (args.requestType == "filtering" || args.requestType == "refresh")) || (this._filterCollection.length > 0 && this._enableSwimlaneCount))) {
                    for (var j = 0; j < $cell.length; j++) {
                        var limit = ej.buildTag("div.e-limits");
                        $($cell).eq(j).prepend(limit);
                        var $limit = $($cell).eq(j).find(".e-limits");
                        if (isMin) {
                            $min = ej.buildTag("div.e-min", this.localizedLabels.Min + " [", "", {});
                            $minLimit = ej.buildTag("span.e-minlimit", constraints.min.toString(), "", {});
                            $min.append($minLimit).append("]");
                            $limit.append($min);
                        }
                        if (isMax) {
                            $max = ej.buildTag("div.e-max", this.localizedLabels.Max + " [", "", {});
                            $maxLimit = ej.buildTag("span.e-maxlimit", constraints.max.toString(), "", {});
                            $max.append($maxLimit).append("]");
                            $limit.append($max);
                        }
                        if (this.getHeaderContent().find(".e-headercell").eq(i).hasClass("e-shrinkcol"))
                            $($cell).eq(j).find(".e-limits").addClass("e-hide");
                    }
                }
            }
        }
    };
    Kanban.prototype._hideCollapseColumns = function (key, c, hidden, visible) {
        var i, index;
        if (ej.isNullOrUndefined(key))
            return;
        if ($.isArray(c)) {
            for (i = 0; i < c.length; i++) {
                index = $.inArray(c[i], this[visible]);
                if (index != -1) {
                    this[hidden].push(c[i]);
                    this[visible].splice(index, 1);
                }
                else if (index == -1 && $.inArray(c[i], this[hidden]) == -1 && !ej.isNullOrUndefined(this.getColumnByHeaderText(c[i]))) {
                    this[hidden].push(this.getColumnByHeaderText(c[i]).key) && this[hidden].push(this.getColumnByHeaderText(c[i]).key);
                    this[visible].splice($.inArray(this.getColumnByHeaderText(c[i]).key, this[visible]), 1) && this[visible].splice($.inArray(c[i], this[visible]), 1);
                }
            }
        }
        else {
            index = $.inArray(c, this[visible]);
            if (index != -1) {
                this[hidden].push(c);
                this[visible].splice(index, 1);
            }
            else if (index == -1 && visible == visible && $.inArray(c, this[hidden]) == -1 && !ej.isNullOrUndefined(this.getColumnByHeaderText(c))) {
                this[hidden].push(this.getColumnByHeaderText(c).key) && this[hidden].push(this.getColumnByHeaderText(c).key);
                this[visible].splice($.inArray(this.getColumnByHeaderText(c).key, this[visible]), 1) && this[visible].splice($.inArray(c, this[visible]), 1);
            }
        }
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
            this._hideCollapseColumns(key, c, hidden, visible);
            this._showhide(this[hidden], "hide");
            if (this.model.stackedHeaderRows.length > 0)
                this._refreshStackedHeader();
        }
        else {
            if (this._visibleColumns.length == 1)
                return;
            else if (this._visibleColumns[0] == c)
                this._expandColumns(this._visibleColumns[1]);
            else
                this._expandColumns(this._visibleColumns[0]);
            this.hideColumns(c);
        }
        this._renderLimit();
        this._totalCount();
        this._stackedHeadervisible();
    };
    Kanban.prototype._expandCollapse = function (shcolumns, val) {
        var i, count = 0, hideshowCols, columns = this.model.columns;
        hideshowCols = (val === "expand") ? "_expandedColumns" : "_collapsedColumns";
        var $head = this.getHeaderTable().find("thead");
        var $headerCell = $head.find("tr").not(".e-stackedHeaderRow").find(".e-headercell");
        var $col = this.getHeaderTable().find("colgroup").find("col"), column, colval;
        var $col1 = this.getContentTable().find("colgroup").find("col");
        for (i = 0; i < columns.length; i++) {
            if ($.inArray(columns[i]["headerText"], this[hideshowCols]) != -1) {
                if (val === "expand") {
                    columns[i].isCollapsed = false;
                }
                else {
                    columns[i].isCollapsed = true;
                }
                count++;
            }
            column = this.getColumnByHeaderText(shcolumns[i]);
            var index = $.inArray(column, this.model.columns);
            var isExp = val == "expand" ? true : false;
            if (index != -1) {
                if (isExp) {
                    if ($col.eq(index).hasClass("e-shrinkcol")) {
                        $headerCell.eq(index).find(".e-headercelldiv").removeClass("e-hide");
                        $headerCell.eq(index).removeClass("e-shrinkcol");
                        $col.eq(index).removeClass("e-shrinkcol");
                        $col1.eq(index).removeClass("e-shrinkcol");
                        $headerCell.eq(index).find(".e-clcollapse").addClass("e-clexpand").removeClass("e-clcollapse");
                    }
                }
                else {
                    if (!$col.eq(index).hasClass("e-shrinkcol")) {
                        $headerCell.eq(index).find(".e-headercelldiv").addClass("e-hide");
                        $headerCell.eq(index).addClass("e-shrinkcol");
                        $col.eq(index).addClass("e-shrinkcol");
                        $col1.eq(index).addClass("e-shrinkcol");
                        $headerCell.eq(index).find(".e-clexpand").addClass("e-clcollapse").removeClass("e-clexpand");
                    }
                }
            }
            var cshrink = this.model.columns[i].isCollapsed;
            var j;
            if (isExp) {
                if (!cshrink)
                    for (j = 0; j < this._columnRows.length; j++) {
                        colval = this._columnRows.eq(j).find("td.e-rowcell[ej-mappingkey='" + this.model.columns[i].key + "']");
                        if (colval.hasClass("e-shrink")) {
                            colval.removeClass("e-shrink").find(".e-shrinkheader").addClass("e-hide").parent().find(".e-kanbancard").removeClass("e-hide");
                            colval.find(".e-customaddbutton").removeClass("e-hide");
                            colval.find(".e-limits").removeClass("e-hide");
                            colval.find(".e-shrinkcount").text(this._columnCardcount(this.currentViewData, this.model.columns[i].key, this.model.fields.swimlaneKey ? j : null));
                        }
                        else
                            break;
                    }
            }
            else {
                if (cshrink)
                    for (j = 0; j < this._columnRows.length; j++) {
                        colval = this._columnRows.eq(j).find("td.e-rowcell[ej-mappingkey='" + this.model.columns[i].key + "']");
                        if (!colval.hasClass("e-shrink")) {
                            colval.addClass("e-shrink").find(".e-shrinkheader").removeClass("e-hide").parent().find(".e-kanbancard").addClass("e-hide");
                            colval.find(".e-customaddbutton").addClass("e-hide");
                            colval.find(".e-limits").addClass("e-hide");
                            colval.find(".e-shrinkcount").text(this._columnCardcount(this.currentViewData, this.model.columns[i].key, this.model.fields.swimlaneKey ? j : null));
                        }
                        else
                            break;
                    }
            }
        }
    };
    Kanban.prototype._collapseColumns = function (c) {
        var i, index, key, hidden = "_collapsedColumns", visible = "_expandedColumns", count = 0;
        for (i = 0; i < c.length; i++) {
            index = $.inArray(c[i], this._expandedColumns);
            if (index != -1)
                count++;
        }
        if (!(this._expandedColumns.length == count) && !(this.getVisibleColumnNames().length - this._collapsedColumns.length == 1) && !(this.model.columns.length - this._collapsedColumns.length == 1)) {
            key = typeof (c) == "string" ? this.getColumnByHeaderText(c) : this.getColumnByHeaderText(c[0]);
            this._hideCollapseColumns(key, c, hidden, visible);
            this._expandCollapse(this[hidden], "collapse");
            if (this.model.allowScrolling)
                this._setWidthToColumns();
            if (this.model.stackedHeaderRows.length > 0)
                this._refreshStackedHeader();
        }
        else {
            this._expandColumns(this._collapsedColumns[0]);
            this._collapseColumns(c);
        }
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
            this._toggleCardByTarget($($curCard).find(".e-cardheader .e-icon"));
        }
        else if (typeof $target == "object" && $target[0].nodeName != "DIV") {
            for (var i = 0; i < $target.length; i++) {
                $curCard = this.element.find('div.e-kanbancard[id=' + $target[i] + ']');
                this._toggleCardByTarget($($curCard).find(".e-cardheader .e-icon"));
            }
        }
        else
            this._toggleCardByTarget($target);
    };
    Kanban.prototype._toggleCardByTarget = function ($target) {
        $target = $target.hasClass("e-expandcollapse") ? $target.find("div:first") : $target;
        if (!($target.hasClass("e-cardexpand") || $target.hasClass("e-cardcollapse")))
            return;
        var $header = $target.closest('div.e-cardheader'), $cardContent = $header.next(), primarykey = $header.find(".e-primarykey").text(), card = $($target).closest(".e-kanbancard");
        if ($target.hasClass("e-cardexpand")) {
            $target.removeClass("e-cardexpand").addClass("e-cardcollapse");
            card.addClass("e-collapsedcard");
            $header.append($cardContent.find(".e-text").clone());
            $cardContent.hide();
            if ($.inArray(primarykey, this._collapsedCards) == -1)
                this._collapsedCards.push(primarykey);
        }
        else {
            $target.removeClass("e-cardcollapse").addClass("e-cardexpand");
            card.removeClass("e-collapsedcard");
            $header.find(".e-text").remove();
            $cardContent.show();
            var index = $.inArray(primarykey, this._collapsedCards);
            if (index != -1)
                this._collapsedCards.splice(index);
        }
        if (this.model.allowScrolling) {
            if (this.getScrollObject().isVScroll() || this.getScrollObject().isHScroll())
                this.getScrollObject().refresh();
            if (!this.getScrollObject().isVScroll())
                this.element.find(".e-kanbanheader").removeClass("e-scrollcss").children().removeClass("e-hscrollcss");
            else
                this.element.find(".e-kanbanheader").addClass("e-scrollcss").children().addClass("e-hscrollcss");
        }
        if (this.element.hasClass('e-responsive')) {
            var scroller = $target.parents('.e-cell-scrollcontent');
            if (scroller.length > 0)
                scroller.data('ejScroller').refresh();
        }
    };
    Kanban.prototype.toggleColumn = function ($target) {
        if (typeof $target === "string" || "object" && ($target[0].nodeName != "DIV" && $target[0].nodeName != "TD"))
            this._toggleField($target);
        else if ($target[0].nodeName == "TD")
            this._toggleField($target.closest(".e-shrink").find(".e-shrinkheader").text().split("[")[0]);
        else {
            var stackedHeaderCel, colHeader, headerCell, i, stackedHeaderColumns, cols = this.model.columns, cText;
            if (this.model.stackedHeaderRows.length)
                stackedHeaderColumns = this.model.stackedHeaderRows[0].stackedHeaderColumns;
            headerCell = $target.closest(".e-headercell").not(".e-stackedHeaderCell");
            colHeader = this.element.find(".e-columnheader").not(".e-stackedHeaderRow").find(".e-hide");
            if (headerCell.length > 0)
                this._toggleField(cols[headerCell.index()].headerText);
            else if ($target.closest(".e-shrink").find(".e-shrinkheader").length > 0) {
                for (i = 0; i < colHeader.length; i++) {
                    cText = $(colHeader[i]).find(".e-headerdiv").text().split('[')[0];
                    if (cText == $target.closest(".e-shrink").find(".e-shrinkheader").text().split("[")[0]) {
                        $(colHeader[i]).next().find(".e-clcollapse").addClass("e-clexpand");
                        $(colHeader[i]).next().find(".e-clexpand").removeClass("e-clcollapse");
                        this._toggleField(cText);
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
                        this._toggleField(stackedHeaderColumns[i].column.split(","));
                    }
            }
        }
    };
    Kanban.prototype._kbnRightSwipe = function () {
        var eleWidth = this.element.width(), rowCell = this.element.find('.e-rowcell:visible'), eqWidth, sHeader = this.element.find('.e-stackedHeaderCell'), tCount = 0, prevCount, count, curEle, proxy = this;
        if (this._kbnSwipeCount > 0) {
            if (this._kbnSwipeCount == 1)
                this._kbnSwipeWidth = 0;
            else {
                curEle = rowCell.eq(this._kbnSwipeCount - 1);
                if (curEle.length == 0)
                    curEle = this.element.find(".e-headercell:visible").not(".e-stackedHeaderCell").eq(this._kbnSwipeCount - 1);
                this._kbnSwipeWidth = this._kbnSwipeWidth - curEle.offset().left;
                eqWidth = (eleWidth - curEle.width()) / 2;
                this._kbnSwipeWidth = this._kbnSwipeWidth + eqWidth;
            }
            for (var i = 0; i < sHeader.length; i++) {
                var leftVal = this.headerContent.find('col:eq(0)').width();
                prevCount = tCount, count = this._kbnSwipeCount - 1;
                tCount = tCount + (parseInt($(sHeader).eq(i).attr('colspan')));
                if (count >= prevCount && count < tCount) {
                    if (prevCount == this._kbnSwipeCount - 1) {
                        this.element.find('.e-adapt-stheader').removeClass('e-adapt-stheader');
                        $(sHeader).eq(i).find('div').css({ 'position': '', 'left': '' });
                        var prevHeader = $(sHeader).eq(i).prev('.e-stackedHeaderCell');
                        if (prevHeader.length > 0)
                            prevHeader.addClass('e-adapt-stheader');
                        break;
                    }
                    else if (prevCount < this._kbnSwipeCount - 1) {
                        $(sHeader).eq(i).find('div').css({ 'position': 'relative', 'left': leftVal * ((this._kbnSwipeCount - 1) - prevCount) });
                        break;
                    }
                }
            }
            this._kbnTransitionEnd = false;
            this.headerContent.find('table').css({ 'transform': 'translate3d(' + this._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '' }).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function (event) {
                proxy._kbnTransitionEnd = true;
            });
            this.kanbanContent.find('table').eq(0).css({ 'transform': 'translate3d(' + this._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '' });
            --this._kbnSwipeCount;
        }
    };
    Kanban.prototype._kbnLeftSwipe = function () {
        var eleWidth = this.element.width(), rowCell = this.element.find('.e-rowcell:visible'), eqWidth, sHeader = this.element.find('.e-stackedHeaderCell'), tCount = 0, prevCount, count, curEle, proxy = this;
        if (this._kbnSwipeCount < this.model.columns.length - 1) {
            curEle = rowCell.eq(this._kbnSwipeCount + 1);
            if (curEle.length == 0)
                curEle = this.element.find(".e-headercell:visible").not(".e-stackedHeaderCell").eq(this._kbnSwipeCount + 1);
            this._kbnSwipeWidth = this._kbnSwipeWidth - (curEle.offset().left);
            if (this._kbnSwipeCount == this.model.columns.length - 2)
                eqWidth = eleWidth - curEle.width();
            else
                eqWidth = (eleWidth - curEle.width()) / 2;
            this._kbnSwipeWidth = this._kbnSwipeWidth + eqWidth;
            for (var i = 0; i < sHeader.length; i++) {
                var leftVal = this.headerContent.find('col:eq(0)').width();
                prevCount = tCount, count = this._kbnSwipeCount + 1;
                tCount = tCount + (parseInt($(sHeader).eq(i).attr('colspan')));
                if (count > prevCount && count < tCount) {
                    if (i == 0) {
                        $(sHeader).eq(i).addClass('e-adapt-stheader');
                        $(sHeader).eq(i).find('div').css({ 'position': 'relative', 'left': leftVal * count });
                        break;
                    }
                    else if (prevCount == this._kbnSwipeCount + 1) {
                        this.element.find('.e-adapt-stheader').removeClass('e-adapt-stheader');
                        $(sHeader).eq(i - 1).find('div').css({ 'position': '', 'left': '' });
                        $(sHeader).eq(i).addClass('e-adapt-stheader');
                        break;
                    }
                    else if (prevCount < this._kbnSwipeCount + 1) {
                        $(sHeader).eq(i).find('div').css({ 'position': 'relative', 'left': leftVal * ((this._kbnSwipeCount + 1) - prevCount) });
                        break;
                    }
                }
            }
            this._kbnTransitionEnd = false;
            this.headerContent.find('table').css({ 'transform': 'translate3d(' + this._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '' }).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function (event) {
                proxy._kbnTransitionEnd = true;
            });
            this.kanbanContent.find('table').eq(0).css({ 'transform': 'translate3d(' + this._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '' });
            ++this._kbnSwipeCount;
        }
    };
    Kanban.prototype._swipeKanban = function (e) {
        if (this.element.hasClass('e-responsive') && this._kbnTransitionEnd && this.element.find('.e-targetclone').length == 0) {
            switch (e.type) {
                case "swipeleft":
                    this._kbnLeftSwipe();
                    break;
                case "swiperight":
                    this._kbnRightSwipe();
                    break;
            }
        }
    };
    Kanban.prototype._clearAdaptSearch = function (e) {
        var $target, $kanbanEle = this.element, $kanbanObj = $kanbanEle.data('ejKanban');
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
            $kanbanObj.clearSearch();
            if (!ej.isNullOrUndefined($kanbanObj.model.fields.swimlaneKey)) {
                var query = new ej.Query().where(ej.Predicate["or"]($kanbanObj.keyPredicates)).select($kanbanObj.model.fields.swimlaneKey);
                $kanbanObj._kbnAdaptDdlData = new ej.DataManager($kanbanObj._currentJsonData).executeLocal(query);
                $kanbanObj._kbnAdaptDdlData = ej.dataUtil.mergeSort(ej.dataUtil.distinct($kanbanObj._kbnAdaptDdlData));
                $kanbanObj._addSwimlaneName();
            }
            $kanbanEle.data("ejWaitingPopup").hide();
        }, 300);
    };
    Kanban.prototype._adaptiveKbnClick = function (e) {
        var $target = $(e.target), filterWin, filterIcon, slWindow = this.element.find('.e-swimlane-window');
        if (this.element.hasClass('e-responsive')) {
            filterWin = this.element.find('.e-kanbanfilter-window');
            filterIcon = this.element.find('.e-kanbanfilter-icon');
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
                this._trigger("toolbarClick", args);
                if ($target.hasClass('e-clearfilter')) {
                    this._kbnFilterCollection = [];
                    this._kbnFilterObject = [];
                    this._filterCollection = [];
                    this._kbnAdaptFilterObject = [];
                    $target.hide();
                    filterIcon.removeClass('e-kbnclearfl-icon');
                    this.element.find('.e-kbnfilter-check').parents('[aria-checked~="true"]').click();
                }
                else {
                    if (!filterIcon.hasClass('e-kbnclearfl-icon'))
                        filterIcon.addClass('e-kbnclearfl-icon');
                    if (this._kbnFilterObject.length == 0 && filterIcon.hasClass('e-kbnclearfl-icon'))
                        filterIcon.removeClass('e-kbnclearfl-icon');
                }
                args = {};
                args.requestType = ej.Kanban.Actions.Filtering;
                args.currentFilterObject = [];
                args.filterCollection = this._kbnFilterCollection;
                args.currentFilterObject = this._kbnFilterObject;
                this._initialData = this._currentJsonData;
                this._processBindings(args);
                if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey)) {
                    if (this._currentJsonData.length == 0) {
                        this.element.find('.e-swimlane-ddl,.e-swimlane-window').remove();
                        this.kanbanContent.data('ejScroller').destroy();
                    }
                    else {
                        var query = new ej.Query().where(ej.Predicate["or"](this.keyPredicates)).select(this.model.fields.swimlaneKey);
                        this._kbnAdaptDdlData = new ej.DataManager(this._currentJsonData).executeLocal(query);
                        this._kbnAdaptDdlData = ej.dataUtil.mergeSort(ej.dataUtil.distinct(this._kbnAdaptDdlData));
                        this.element.find('.e-swimlane-ddl,.e-swimlane-window').remove();
                        this._kbnAdaptSwimlaneDdl();
                    }
                }
                filterWin.hide();
                this._kanbanWindowResize();
            }
            if ($target.hasClass('e-filterback-icon')) {
                var filters = [], chk;
                for (var i = 0; i < this.model.filterSettings.length; i++)
                    filters.push(this.model.filterSettings[i].text);
                for (var i = 0; i < this._kbnAdaptFilterObject.length; i++) {
                    var text = this._kbnAdaptFilterObject[i].text, index;
                    index = $.inArray(text, filters);
                    filters.splice(index, 1);
                    chk = this.element.find("label.e-filterlabel:contains(" + text + ")").prev();
                    if (chk.attr('aria-checked') == "false")
                        chk.click();
                }
                for (var i = 0; i < filters.length; i++) {
                    chk = this.element.find("label.e-filterlabel:contains(" + filters[i] + ")").prev();
                    if (chk.attr('aria-checked') == "true")
                        chk.click();
                }
                filterWin.hide();
            }
            if ($target.hasClass('e-kanbanfilter-icon')) {
                var clear = filterWin.find('.e-clearfilter'), headHeight, cFilter, cFilterHght = 0, scrollContent;
                scrollContent = this.element.find('.e-filter-scrollcontent');
                if (slWindow.is(':visible'))
                    slWindow.hide();
                filterWin.show();
                if ($target.hasClass('e-kbnclearfl-icon'))
                    clear.show();
                else
                    clear.hide();
                headHeight = this.element.find('.e-kbnfilterwindow-head').height();
                cFilter = this.element.find('.e-clearfilter');
                if (cFilter.is(":visible")) {
                    scrollContent.ejScroller({ height: 0 });
                    cFilterHght = cFilter.outerHeight() + parseInt(cFilter.css('bottom'));
                }
                if ($(window).height() - cFilterHght < (this.element.find('.e-filter-content').height() + headHeight)) {
                    scrollContent.ejScroller({ height: $(window).height() - (headHeight + cFilterHght + 10) });
                }
                filterWin.parents('body').addClass('e-kbnwindow-modal');
            }
        }
        var slScroller = this.element.find('.e-slwindow-scrollcontent');
        if ($target.hasClass('e-swimlane-item') || $target.parents('.e-swimlane-item').length > 0) {
            var trgt = $target, rows;
            if ($target.parents('.e-swimlane-item').length > 0)
                trgt = $target.parents('.e-swimlane-item');
            this._kbnAdaptDdlIndex = this._freezeSlOrder = this.element.find('.e-swimlane-item').index(trgt);
            slWindow.hide();
            this.element.find('.e-swimlane-text').text(this._kbnAdaptDdlData[this._kbnAdaptDdlIndex]);
            rows = document.getElementsByClassName('e-columnrow');
            rows[this._kbnAdaptDdlIndex].scrollIntoView();
            if (slScroller.hasClass('e-scroller'))
                slScroller.data('ejScroller').refresh();
        }
        if ($target.hasClass('e-swimlane-ddl') || $target.parents('.e-swimlane-ddl').length > 0) {
            var top = this.headerContent.offset().top;
            if (slWindow.is(':hidden')) {
                this.element.parents('body').addClass('e-kbnwindow-modal');
                slWindow.show().css({ top: top, height: $(window).height() - top });
                if ($(window).height() < top + slScroller.height())
                    slScroller.ejScroller({ height: $(window).height() - top });
            }
            else {
                slWindow.hide();
                this.element.parents('body').removeClass('e-kbnwindow-modal');
            }
        }
    };
    Kanban.prototype._kbnFilterChange = function (args) {
        var $kanbanEle = $(args.event.target).closest(".e-kanban"), kanbanObj = $kanbanEle.ejKanban("instance");
        var filterName = $(args.event.target).parents('.e-chkbox-wrap').next().text(), kbnFilter, done, filterValue;
        if (!kanbanObj._kbnAutoFilterCheck) {
            if (filterName == "")
                filterName = $(args.event.target).next().text();
            kbnFilter = $kanbanEle.find('.e-kanbanfilter-icon');
            done = $kanbanEle.find('.e-filter-done');
            if (done.is(':hidden'))
                done.show();
            for (var count = 0; count < this.model.filterSettings.length; count++) {
                if (this.model.filterSettings[count]["text"] == filterName)
                    break;
            }
            filterValue = (count == this.model.filterSettings.length ? null : this.model.filterSettings[count]);
            if (!args.isChecked) {
                var index = $.inArray(filterValue, this._kbnFilterObject);
                if (index >= 0) {
                    this._kbnFilterObject.splice(index, 1);
                    this._kbnFilterCollection.splice(index, 1);
                }
            }
            else {
                this._kbnFilterObject.push(filterValue);
                for (var i = 0; i < this.model.filterSettings.length; i++) {
                    if (this.model.filterSettings[i].text == filterValue.text) {
                        var query = this.model.filterSettings[i].query["queries"][0].e;
                        this._kbnFilterCollection.push(query);
                    }
                }
            }
        }
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
            this.toggleSwimlane($target);
        if (this.model.allowSelection && parentDiv.length > 0 && $target.closest(".e-expandcollapse").length <= 0) {
            var parentIndex = $(parentDiv.parent()).children().eq(0).hasClass("e-limits") ? parentDiv.index() - 1 : parentDiv.index();
            if (this.model.selectionType == "single")
                this._cardSelection([[rowIndex, [columnIndex], [parentIndex]]], parentDiv, e);
            else if (this.model.selectionType == "multiple") {
                if (e.shiftKey || e.ctrlKey || this._enableMultiTouch) {
                    if (this._currentRowCellIndex.length == 0 || rowIndex == this._currentRowCellIndex[0][0])
                        this._cardSelection([[rowIndex, [columnIndex], [parentIndex]]], parentDiv, e);
                }
                else
                    this._cardSelection([[rowIndex, [columnIndex], [parentIndex]]], parentDiv, e);
            }
        }
        if (parentDiv.length > 0)
            this._cardClick($target, parentDiv);
        if ($target.attr('id') == this._id + "_Cancel" || $target.parent().attr("id") == this._id + "_closebutton")
            this.KanbanEdit.cancelEdit();
        if ($target.attr('id') == this._id + "_Save")
            this.KanbanEdit.endEdit();
        this._adaptiveKbnClick(e);
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
        this._kbnHeaderAndCellEvents($target);
    };
    Kanban.prototype._kbnHeaderAndCellEvents = function ($target) {
        var args = {}, cards = $target.find('.e-kanbancard'), hTrgt = $target, key, selCards = $target.find('.e-cardselection'), headerIndex, proxy = this, cellIndex = $target.index(), row = $target.parents('.e-columnrow'), cells;
        cells = this.element.find('.e-rowcell.e-droppable');
        key = $target.attr('ej-mappingkey');
        if (hTrgt.parents('.e-headercell').length > 0)
            hTrgt = $target.parents('.e-headercell');
        if (hTrgt.hasClass('e-headercell')) {
            var curCell;
            headerIndex = cellIndex = hTrgt.index();
            curCell = cells.eq(headerIndex);
            key = curCell.attr('ej-mappingkey');
            if (proxy.model.fields.swimlaneKey)
                curCell = $("td[ej-mappingkey~='" + key + "']");
            cards = curCell.find('.e-kanbancard');
            selCards = curCell.find('.e-cardselection');
            row = curCell.parents('.e-columnrow');
        }
        if ($target.hasClass('e-rowcell') || !hTrgt.hasClass('e-stackedHeaderCell')) {
            var skey = row.prev('.e-swimlanerow').find('.e-slkey').text(), selIndexes = [];
            args["cardsInfo"] = function () {
                var cardsInfo = {}, index;
                cardsInfo["cards"] = cards;
                if (proxy.model.fields.swimlaneKey && $target.hasClass('e-rowcell'))
                    cardsInfo["cardsData"] = new ej.DataManager(proxy._currentJsonData).executeLocal(new ej.Query().where(proxy.model.keyField, ej.FilterOperators.equal, key).where(proxy.model.fields.swimlaneKey, ej.FilterOperators.equal, skey));
                else
                    cardsInfo["cardsData"] = new ej.DataManager(proxy._currentJsonData).executeLocal(new ej.Query().where(proxy.model.keyField, ej.FilterOperators.equal, key));
                cardsInfo["cardsCount"] = cards.length;
                if (proxy._selectedCardData.length > 0) {
                    index = $.inArray(cellIndex, proxy.selectedRowCellIndexes[0].cellIndex);
                    if (!ej.isNullOrUndefined(index) && index >= 0)
                        selIndexes.push(proxy.selectedRowCellIndexes[0].cardIndex[index]);
                }
                cardsInfo["selectedCardsIndexes"] = selIndexes;
                cardsInfo["selectedCardsData"] = new ej.DataManager(proxy._selectedCardData).executeLocal(new ej.Query().where(proxy.model.keyField, ej.FilterOperators.equal, key));
                cardsInfo["selectedCards"] = selCards;
                return cardsInfo;
            };
        }
        if ($target.hasClass('e-rowcell')) {
            args["rowIndex"] = this.getIndexByRow(row);
            args["cellIndex"] = cellIndex;
            this._trigger('cellClick', args);
        }
        if (hTrgt.hasClass('e-stackedHeaderCell')) {
            args["text"] = $target.text();
            var sCards = [], selCards, colIndexes = [], selColIndexes = [], cardIndexes = [], stRows, data = [], selData = [];
            stRows = this.element.find('.e-stackedHeaderRow');
            args["data"] = function () {
                var columns, count = 0, index;
                var stackedColumns = proxy.model.stackedHeaderRows[stRows.index(hTrgt.parents('.e-stackedHeaderRow'))].stackedHeaderColumns;
                columns = stackedColumns[hTrgt.index()].column;
                columns = columns.split(',');
                for (var i = 0; i < columns.length; i++) {
                    var key = new ej.DataManager(proxy.model.columns).executeLocal(new ej.Query().where('headerText', ej.FilterOperators.equal, columns[i])), cell, cards, selectedCards;
                    cell = $("td[ej-mappingkey~='" + key[0].key + "']");
                    cards = cell.find('.e-kanbancard');
                    sCards.push(cards);
                    data.push(new ej.DataManager(proxy._currentJsonData).executeLocal(new ej.Query().where(proxy.model.keyField, ej.FilterOperators.equal, key[0].key)));
                    cellIndex = cells.index($("td[ej-mappingkey~='" + key[0].key + "']")[0]);
                    if (proxy._selectedCardData.length > 0) {
                        index = $.inArray(cellIndex, proxy.selectedRowCellIndexes[0].cellIndex);
                        if (!ej.isNullOrUndefined(index) && index >= 0) {
                            selectedCards = cell.find('.e-cardselection');
                            selCards.push(selectedCards);
                            selData.push(new ej.DataManager(proxy._selectedCardData).executeLocal(new ej.Query().where(proxy.model.keyField, ej.FilterOperators.equal, key[0].key)));
                            if (selectedCards.length > 0) {
                                selColIndexes.push(cellIndex);
                                cardIndexes.push(proxy.selectedRowCellIndexes[0].cardIndex[index]);
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
            this._trigger('headerClick', args);
        }
        else if (hTrgt.hasClass('e-headercell')) {
            args["text "] = hTrgt.text();
            args["cellIndex"] = headerIndex;
            args["columnData"] = this.model.columns[headerIndex];
            this._trigger('headerClick', args);
        }
    };
    Kanban.prototype._cardClick = function (target, parentDiv) {
        var args, data = null, queryManager;
        if (!ej.isNullOrUndefined(parentDiv.attr("id"))) {
            queryManager = new ej.DataManager(this._currentJsonData);
            data = queryManager.executeLocal(new ej.Query().where(this.model.fields.primaryKey, ej.FilterOperators.equal, parentDiv.attr('id')));
        }
        args = { target: target, currentCard: parentDiv, data: data };
        if (this._trigger("cardClick", args))
            return;
    };
    Kanban.prototype._getCardData = function (key) {
        return (new ej.DataManager(this._currentJsonData).executeLocal(new ej.Query().where(this.model.fields.primaryKey, ej.FilterOperators.equal, key)));
    };
    Kanban.prototype._getCardbyIndexes = function (indexes) {
        return $(this.getRowByIndex(indexes[0][0]).find(".e-rowcell:eq(" + indexes[0][1][0] + ")").find("div.e-kanbancard:eq(" + indexes[0][2][0] + ")"));
    };
    Kanban.prototype.getRowByIndex = function (index) {
        if (!ej.isNullOrUndefined(index))
            return $((this._columnRows)[index]);
        return;
    };
    Kanban.prototype._cardSelection = function (rowCellIndexes, target, e) {
        var $cell, args, previousCard = null, data = null, queryManager;
        $cell = target.parent("td.e-rowcell");
        if (this._currentRowCellIndex.length > 0 && !$(target).hasClass("e-cardselection"))
            this._previousRowCellIndex = [[this._currentRowCellIndex[0][0], [this._currentRowCellIndex[0][1][0]], [this._currentRowCellIndex[0][2][0]]]];
        if (!ej.isNullOrUndefined(target.attr("id"))) {
            queryManager = new ej.DataManager(this._currentJsonData);
            data = queryManager.executeLocal(new ej.Query().where(this.model.fields.primaryKey, ej.FilterOperators.equal, target.attr('id')));
        }
        if (!ej.isNullOrUndefined(this._previousRowCellIndex) && this._previousRowCellIndex.length != 0)
            previousCard = this._getCardbyIndexes(this._previousRowCellIndex);
        args = { currentCell: $cell, target: target, cellIndex: rowCellIndexes[0][1][0], cardIndex: rowCellIndexes[0][2][0], data: data, previousRowCellIndex: this._previousRowCellIndex, previousCard: previousCard, selectedCardsData: this._selectedCardData };
        if (this._trigger("beforeCardSelect", args))
            return;
        if (!$(target).hasClass("e-cardselection")) {
            if (this.model.selectionType == "multiple" && !this._kTouchBar.find(".e-cardtouch").hasClass("e-spanclicked"))
                this._kTouchBar.hide();
            if (e["pointerType"] == "touch" && !this._kTouchBar.find(".e-cardtouch").hasClass("e-spanclicked") && this.model.selectionType == "multiple") {
                var trgtOffset = $(target).offset();
                this._kTouchBar.show();
                this._kTouchBar.offset({ top: trgtOffset.top, left: trgtOffset.left });
            }
        }
        if (this.model.selectionType == "multiple" && e.shiftKey) {
            var parentRow, cards, i = 0, l = 0, endCard = target, selectedCards = [];
            if (!ej.isNullOrUndefined(previousCard)) {
                parentRow = previousCard.parents('.e-columnrow');
                parentRow.find('.e-cardselection').not(previousCard).removeClass('e-cardselection');
                cards = parentRow.find('.e-kanbancard');
                i = cards.index(previousCard);
            }
            else
                cards = target.parents('.e-columnrow').find('.e-kanbancard');
            this._selectedCards = [];
            this._selectedCardData = [];
            this.selectedRowCellIndexes = [];
            while (l <= 0) {
                var row, column, curRowCellIndexes = [];
                row = $(cards[i]).parents('.e-columnrow');
                column = $(cards[i]).parents('.e-rowcell');
                $(cards[i]).addClass('e-cardselection');
                selectedCards.push(cards[i]);
                this._selectedCardData.push(this._getKanbanCardData(this._currentJsonData, cards[i].id)[0]);
                curRowCellIndexes = [[this.element.find('.e-columnrow').index(row), [column.index()], [column.find($(cards[i])).index()]]];
                if (cards[i].id == endCard.attr("id"))
                    l = 1;
                this._pushIntoSelectedArray(curRowCellIndexes);
                if (!ej.isNullOrUndefined(previousCard)) {
                    if (rowCellIndexes[0][1][0] < this._previousRowCellIndex[0][1][0])
                        --i;
                    else if (rowCellIndexes[0][1][0] == this._previousRowCellIndex[0][1][0]) {
                        if (rowCellIndexes[0][2][0] < this._previousRowCellIndex[0][2][0])
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
                this._previousRowCellIndex = this._currentRowCellIndex = [[0, [0], [0]]];
                previousCard = this._getCardbyIndexes(this._previousRowCellIndex);
            }
            this._selectedCards = [];
            this._selectedCards[this._selectedCards.length] = selectedCards;
            if (ej.isNullOrUndefined(previousCard) && (!e.ctrlKey && !e.shiftKey && !this._enableMultiTouch)) {
                {
                    $(target).addClass('e-cardselection');
                    this._selectedCards.push(target[0]);
                    this._selectedCardData.push(this._getKanbanCardData(this._currentJsonData, target.id)[0]);
                    this._pushIntoSelectedArray(rowCellIndexes);
                }
            }
        }
        if (this.model.selectionType == "multiple" && (e.ctrlKey || this._enableMultiTouch)) {
            if ($(target).hasClass("e-cardselection")) {
                $(target).removeClass("e-cardselection");
                this._popFromSelectedArray(rowCellIndexes[0][0], rowCellIndexes[0][1], rowCellIndexes[0][2], e);
                for (var k = 0; k < this._selectedCardData.length; k++) {
                    if (data[0][this.model.fields.primaryKey] == this._selectedCardData[0][this.model.fields.primaryKey])
                        break;
                }
                this._selectedCardData.splice(k, 1);
                this._selectedCards.splice(k, 1);
                this._currentRowCellIndex = rowCellIndexes;
            }
            else {
                $(target).addClass("e-cardselection");
                this._selectedCards.push(target[0]);
                this._pushIntoSelectedArray(rowCellIndexes);
                this._selectedCardData.push(data[0]);
            }
        }
        else {
            if (!(this.model.selectionType == "multiple" && e.shiftKey)) {
                var cardIndex = rowCellIndexes[0][2];
                this.element.find(".e-cardselection").removeClass("e-cardselection");
                this._selectedCards = [];
                this.selectedRowCellIndexes = [];
                $(target).addClass("e-cardselection");
                this._selectedCardData = [];
                this._selectedCardData.push(data[0]);
                this._selectedCards.push(target[0]);
                if (this.model.selectionType == "multiple")
                    cardIndex = [rowCellIndexes[0][2]];
                this.selectedRowCellIndexes.push({ rowIndex: rowCellIndexes[0][0], cellIndex: rowCellIndexes[0][1], cardIndex: cardIndex });
            }
        }
        args = { currentCell: $cell, target: target, cellIndex: rowCellIndexes[0][1][0], cardIndex: rowCellIndexes[0][2][0], data: data, selectedRowCellIndex: this.selectedRowCellIndexes, previousRowCellIndex: this._previousRowCellIndex, previousCard: previousCard, selectedCardsData: this._selectedCardData };
        if (this.model.selectionType == "multiple" && e.shiftKey && $(target).hasClass("e-cardselection")) {
            if (this._previousRowCellIndex.length == 0)
                this._currentRowCellIndex = [[target.parents('.e-columnrow').index(), [0], [0]]];
            if (this._currentRowCellIndex.length == 0)
                this._currentRowCellIndex = rowCellIndexes;
        }
        else if ($(target).hasClass("e-cardselection"))
            this._currentRowCellIndex = rowCellIndexes;
        if (this._trigger("cardSelect", args))
            return;
        this.element.focus();
    };
    Kanban.prototype._pushIntoSelectedArray = function (rowCellIndexes) {
        var i, l = 0, newRow = true, newCell = true;
        for (i = 0; i < this.selectedRowCellIndexes.length; i++) {
            var row = this.selectedRowCellIndexes[i];
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
            this.selectedRowCellIndexes.push({ rowIndex: rowCellIndexes[0][0], cellIndex: rowCellIndexes[0][1], cardIndex: [rowCellIndexes[0][2]] });
        if (!newCell)
            this.selectedRowCellIndexes[i].cardIndex[l].push(rowCellIndexes[0][2][0]);
        else if (!newRow) {
            this.selectedRowCellIndexes[i].cellIndex.push(rowCellIndexes[0][1][0]);
            this.selectedRowCellIndexes[i].cardIndex.push([rowCellIndexes[0][2][0]]);
        }
    };
    Kanban.prototype._popFromSelectedArray = function (val1, val2, val3, e) {
        if (this.model.selectionType == "multiple" && (e.ctrlKey || e.shiftKey || this._enableMultiTouch)) {
            var i, l, j;
            for (i = 0; i < this.selectedRowCellIndexes.length; i++) {
                var row = this.selectedRowCellIndexes[i];
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
                                            this.selectedRowCellIndexes.splice(i, 1);
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
    Kanban.prototype.toggleSwimlane = function ($target) {
        var name, $curRow;
        if (typeof $target == "string" || typeof $target == "number") {
            name = this._removeIdSymbols($target);
            $curRow = this.element.find('tr[id=' + name + ']');
            this._toggleSwimlaneRow($($curRow).find(".e-rowcell .e-slexpandcollapse"));
        }
        else if (typeof $target == "object" && $target[0].nodeName != "DIV") {
            for (var i = 0; i < $target.length; i++) {
                name = this._removeIdSymbols($target[i]);
                $curRow = this.element.find('tr[id=' + name + ']');
                this._toggleSwimlaneRow($($curRow).find(".e-rowcell .e-slexpandcollapse"));
            }
        }
        else
            this._toggleSwimlaneRow($target);
    };
    Kanban.prototype._toggleSwimlaneRow = function ($target) {
        $target = $target.hasClass("e-slexpandcollapse") ? $target.find("div:first") : $target;
        if (!($target.hasClass("e-slexpand") || $target.hasClass("e-slcollapse")))
            return;
        var cRow = $target.closest('tr');
        cRow.next(".e-collapsedrow").remove();
        var $row = cRow.next();
        if ($target.hasClass("e-slexpand")) {
            $row.hide();
            var dRow = ej.buildTag('tr', "", {}, { "class": "e-collapsedrow" }), cols = this.model.columns, td;
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
        }
        else {
            $row.show();
            $target.removeClass("e-collapsedrow").removeClass("e-slcollapse").addClass("e-slexpand");
        }
        if (this.model.allowScrolling) {
            var vScrollArea = this.headerContent.find('.e-hscrollcss');
            this._refreshScroller({ requestType: "refresh" });
            if (this.getContent().find('.e-vscrollbar').length > 0)
                vScrollArea.removeClass('e-vscroll-area');
            else
                vScrollArea.addClass('e-vscroll-area');
        }
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
            Cards: "  Cards"
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
        this._kbnAdaptSwimlaneData();
        this.element.removeClass("e-kanbanscroll");
        this._initScrolling();
        this._checkDataBinding();
    };
    Kanban.prototype._kbnAdaptSwimlaneData = function () {
        var proxy = this;
        if (this.model.isResponsive && (ej.isNullOrUndefined(this.model.minWidth) || this.model.minWidth == 0) && !ej.isNullOrUndefined(this.model.fields.swimlaneKey)) {
            var query = new ej.Query();
            if (!ej.isNullOrUndefined(this.model.keyField))
                this._addColumnFilters();
            this.model.query["_fromTable"] != "" && query.from(this.model.query["_fromTable"]);
            if (this._dataSource() instanceof ej.DataManager && query["queries"].length && !this._dataManager.dataSource.offline) {
                var queryPromise = this._dataSource().executeQuery(query);
                queryPromise.done(ej.proxy(function (e) {
                    this._kbnAdaptDdlData = new ej.DataManager(e.result);
                    query = new ej.Query().where(ej.Predicate["or"](this.keyPredicates)).select(this.model.fields.swimlaneKey);
                    this._kbnAdaptDdlData = this._kbnAdaptDdlData.executeLocal(query);
                    this._kbnAdaptDdlData = ej.dataUtil.mergeSort(ej.dataUtil.distinct(this._kbnAdaptDdlData));
                }));
            }
            else {
                query = new ej.Query().where(ej.Predicate["or"](this.keyPredicates)).select(this.model.fields.swimlaneKey);
                if (this._dataManager.dataSource.offline && this._dataManager.dataSource.json.length)
                    this._kbnAdaptDdlData = this._dataManager.executeLocal(query);
                this._kbnAdaptDdlData = ej.dataUtil.mergeSort(ej.dataUtil.distinct(this._kbnAdaptDdlData));
            }
        }
    };
    Kanban.prototype._initSubModules = function () {
        var model = this.model;
        if (model.allowDragAndDrop)
            this.KanbanDragAndDrop = new ej.KanbanFeatures.DragAndDrop(this);
        if (model.editSettings.allowEditing || model.editSettings.allowAdding)
            this.KanbanEdit = new ej.KanbanFeatures.Edit(this);
    };
    Kanban.prototype._initScrolling = function () {
        if (this.model.width || this.model.height) {
            this.model.allowScrolling = true;
            if (this.model.width)
                this.model.scrollSettings.width = this.model.width;
            if (this.model.height)
                this.model.scrollSettings.height = this.model.height;
        }
        this._originalScrollWidth = this.model.scrollSettings.width;
    };
    Kanban.prototype._setResponsiveHeightWidth = function () {
        if (typeof (this.model.scrollSettings.width) == "string")
            this._originalScrollWidth = this.element.width();
        else if (this.model.scrollSettings.width > 0)
            this._originalScrollWidth = this.model.scrollSettings.width;
        if (typeof (this.model.scrollSettings.height) == "string")
            this._originalScrollHeight = this.getContent().height();
        else if (this.model.scrollSettings.height > 0)
            this._originalScrollHeight = this.model.scrollSettings.height;
        if (this.model.isResponsive) {
            $(window).bind("resize", $.proxy(this._kanbanWindowResize, this));
            this._kanbanWindowResize();
        }
    };
    Kanban.prototype._renderResponsiveKanban = function (isScroller, elemHeight, width, winHeight, winWidth) {
        if (isScroller) {
            this.model.scrollSettings.width = ej.isNullOrUndefined(this._originalScrollWidth) ? Math.min(width, winWidth) : Math.min(this._originalScrollWidth, Math.min(width, winWidth));
            var height = Math.min(winHeight, elemHeight);
            height = ej.isNullOrUndefined(this._originalScrollHeight) ? height : Math.min(this._originalScrollHeight, winHeight);
            this.model.scrollSettings.height = height;
            if (this._originalScrollWidth < winWidth)
                this.model.scrollSettings.width = Math.min(width, winWidth);
            this._renderScroller();
        }
        else {
            this.model.scrollSettings.width = '100%';
            if (!ej.isNullOrUndefined(this._originalScrollWidth))
                this.model.scrollSettings.width = Math.min(this._originalScrollWidth, width);
            var height = this.element.outerHeight();
            if (!ej.isNullOrUndefined(this._originalScrollHeight))
                height = Math.min(this._originalScrollHeight, winHeight);
            this.model.scrollSettings.height = height;
            this._renderScroller();
        }
    };
    Kanban.prototype._kanbanWindowResize = function () {
        var toolbar = this.element.find('.e-kanbantoolbar'), curItem = this.model.fields.swimlaneKey, searchBar;
        if (this.model.isResponsive && (ej.isNullOrUndefined(this.model.minWidth) || this.model.minWidth == 0)) {
            var $filterWin = this.element.find('.e-kanbanfilter-window');
            if (window.matchMedia("(max-width: 480px)").matches) {
                if (!this.element.hasClass('e-responsive')) {
                    this.element.addClass('e-responsive');
                    toolbar.css('display', 'table');
                    toolbar.find('.e-searchdiv').hide();
                    toolbar.find('.e-search').css({ 'border': 'none' });
                    if (!ej.isNullOrUndefined(curItem))
                        this._kbnAdaptSwimlaneDdl();
                    if (this.model.filterSettings.length > 0) {
                        this._kbnAdaptFilterWindow();
                        this._kbnFilterCollection = this._filterCollection.slice();
                    }
                }
                if (!this.element.hasClass('e-swimlane-responsive')) {
                    var rowCell = this.element.find('.e-rowcell:visible');
                    for (var i = 0; i < rowCell.length; i++) {
                        if (rowCell.eq(i).height() > $(window).height()) {
                            var cellScrollContent = rowCell.eq(i).find('.e-cell-scrollcontent');
                            if (cellScrollContent.length > 0)
                                cellScrollContent.ejScroller({ height: $(window).height() - (this.kanbanContent.offset().top + 2) });
                            else {
                                cellScrollContent = ej.buildTag("div.e-cell-scrollcontent", "<div></div>");
                                rowCell.eq(i).append(cellScrollContent);
                                cellScrollContent.children().append(rowCell.eq(i).children(":not('.e-cell-scrollcontent')"));
                                cellScrollContent.ejScroller({
                                    height: $(window).height() - (this.kanbanContent.offset().top + 2),
                                    thumbStart: $.proxy(this._kbnThumbStart, this)
                                });
                            }
                        }
                    }
                }
                this._columnTimeoutAdapt();
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
                            this.element.find('.e-filter-content span.e-chkbox-wrap').eq(index).click();
                            this._kbnAutoFilterCheck = false;
                            if (!flIcon.hasClass('e-kbnclearfl-icon'))
                                flIcon.addClass('e-kbnclearfl-icon');
                            filters.eq(i).removeClass('e-select');
                        }
                    }
                }
                if (!ej.isNullOrUndefined(curItem))
                    this.kanbanContent.ejScroller({
                        height: $(window).height() - this.kanbanContent.offset().top,
                        scroll: $.proxy(this._freezeSwimlane, this),
                        thumbStart: $.proxy(this._kbnThumbStart, this)
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
                if (kbnDialog.is(':visible'))
                    this.KanbanEdit._setAdaptEditWindowHeight();
                if (!ej.isNullOrUndefined(curItem) && slWindow.is(':visible')) {
                    var slScroller = this.element.find('.e-slwindow-scrollcontent'), top = this.headerContent.offset().top;
                    slScroller.ejScroller({ height: $(window).height() - slScroller.offset().top });
                    slScroller.data('ejScroller').refresh();
                    slWindow.css({ height: $(window).height() - top });
                }
            }
            else
                this._removeKbnAdaptItems();
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
            this._renderResponsiveKanban(isScroller, elemHeight, width, winHeight, winWidth);
        }
    };
    Kanban.prototype._columnTimeoutAdapt = function () {
        var eqwidth = (this.element.width() * (80 / 100)), hCell, rCell, sHeader, proxy = this, timeot, curEle;
        hCell = this.element.find('.e-headercell');
        rCell = this.element.find('.e-columnrow .e-rowcell');
        this.kanbanContent.find('table:eq(0) > colgroup col').width(eqwidth);
        rCell.width(eqwidth);
        this.headerContent.find('table > colgroup col').width(eqwidth);
        hCell.not('.e-stackedHeaderCell').width(eqwidth);
        sHeader = this.element.find('.e-stackedHeaderCell');
        for (var i = 0; i < sHeader.length; i++)
            $(sHeader).eq(i).width(parseInt($(sHeader).eq(i).attr('colspan')) * eqwidth);
        timeot = setTimeout(function () {
            if (proxy._kbnSwipeCount > 0) {
                curEle = rCell.eq(proxy._kbnSwipeCount);
                if (curEle.length == 0)
                    curEle = hCell.not('.e-stackedHeaderCell').eq(this._kbnSwipeCount);
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
                proxy._kbnSwipeWidth = proxy._kbnSwipeWidth + eqwidth;
                proxy.headerContent.find('table').css({ 'transform': 'translate3d(' + proxy._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '0ms' });
                proxy.kanbanContent.find('table').eq(0).css({ 'transform': 'translate3d(' + proxy._kbnSwipeWidth + 'px, 0px, 0px)', 'transition-duration': '0ms' });
                clearTimeout(timeot);
            }
        }, 2500);
    };
    Kanban.prototype._addSwimlaneName = function () {
        var rows = this.element.find('.e-columnrow');
        for (var i = 0; i < rows.length; i++) {
            var cells = rows.eq(i).find('.e-rowcell');
            for (var j = 0; j < cells.length; j++) {
                var $limit = cells.eq(j).find('.e-limits');
                if ($limit.length == 0)
                    $limit = ej.buildTag('div.e-limits', "", {}, {});
                if ($limit.find('.e-swimlane-name').length == 0) {
                    $limit.append(ej.buildTag('div.e-swimlane-name', this._kbnAdaptDdlData[i], {}, {}));
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
    Kanban.prototype._kbnAdaptSwimlaneDdl = function () {
        var $ddl = ej.buildTag('div.e-swimlane-ddl', "", {}), curItem = this.model.fields.swimlaneKey, textDiv, slWindow, slItem, slScrollContent;
        var ddlItems = [], ddlTempl, $select, $option, data, uniqueData, toolbar = this.element.find('.e-kanbantoolbar');
        this.element.addClass('e-swimlane-responsive');
        ej.buildTag('div.e-swimlane-text', this._kbnAdaptDdlData[0]).appendTo($ddl);
        ej.buildTag('div.e-swimlane-arrow').appendTo($ddl);
        slWindow = ej.buildTag('div.e-swimlane-window', "", {});
        slItem = ej.buildTag('ul.e-swimlane-ul ', "", {});
        for (var index = 0; index < this._kbnAdaptDdlData.length; index++)
            ej.buildTag('li.e-swimlane-item ', '<div>' + this._kbnAdaptDdlData[index] + '</div>', {}).appendTo(slItem);
        this._addSwimlaneName();
        slScrollContent = ej.buildTag("div#" + this._id + "_slScrollContent", "<div></div>").addClass("e-slwindow-scrollcontent");
        slScrollContent.children().append(slItem);
        slScrollContent.appendTo(slWindow);
        slWindow.appendTo(this.element).hide();
        if (toolbar.length == 0) {
            this._renderToolBar().insertBefore(this.element.find(".e-kanbanheader").first());
            toolbar = this.element.find('.e-kanbantoolbar').css("padding-top", "0px");
        }
        toolbar.prepend($ddl);
        this.element.find('.e-swimlanerow').hide();
    };
    Kanban.prototype._kbnAdaptFilterWindow = function () {
        var toolbar = this.element.find('.e-kanbantoolbar'), headDiv, bodyDiv, clearbtn, $div, filterIcon, $filterWin, filterScrollContent;
        toolbar.find('.e-quickfilter').parent().hide();
        $filterWin = ej.buildTag('div.e-kanbanfilter-window', "", {});
        headDiv = ej.buildTag('div.e-kbnfilterwindow-head', "", {});
        ej.buildTag('div.e-filterback-icon', "", {}).appendTo(headDiv);
        ej.buildTag('div.e-text', "FILTER", {}).appendTo(headDiv);
        ej.buildTag('div.e-text e-filter-done', "DONE", {}).appendTo(headDiv).hide();
        headDiv.appendTo($filterWin);
        this.element.append($filterWin.hide());
        bodyDiv = ej.buildTag('div.e-kbnfilterwindow-body', "", {});
        $div = ej.buildTag("div.e-filter-content");
        for (var i = 0; i < this.model.filterSettings.length; i++) {
            var $item = ej.buildTag("div", "", {});
            $item.append("<input type='checkbox' class='e-kbnfilter-check' id='check" + i + "' /><label for='check" + i + "' class='e-filterlabel'>" + this.model.filterSettings[i].text + "</label></td>");
            $div.append($item);
            $item.find('input').ejCheckBox({ change: $.proxy(this._kbnFilterChange, this) });
        }
        bodyDiv.append($div);
        filterScrollContent = ej.buildTag("div#" + this._id + "_filterScrollContent", "<div></div>").addClass("e-filter-scrollcontent");
        filterScrollContent.children().append(bodyDiv);
        filterScrollContent.appendTo($filterWin);
        clearbtn = ej.buildTag('input.e-clearfilter', "", {}, { type: "button", id: this._id + "_ClearFilter" });
        clearbtn.ejButton({ text: "ClearFilter" });
        $filterWin.append(clearbtn);
        clearbtn.hide();
        filterIcon = ej.buildTag('div.e-kanbanfilter-icon', "", { 'float': 'right' });
        toolbar.append(filterIcon);
    };
    Kanban.prototype._removeKbnAdaptItems = function () {
        if (this.element.hasClass('e-responsive')) {
            var toolbar = this.element.find('.e-kanbantoolbar'), sHeader = this.element.find('.e-stackedHeaderCell'), scrollEle, swimDdl = this.element.find('.e-swimlane-ddl'), $filterWin = this.element.find('.e-kanbanfilter-window'), scrollCell;
            if (swimDdl.length > 0) {
                swimDdl.remove();
                this.element.find('.e-swimlane-window').remove();
            }
            if ($filterWin.length > 0) {
                var filters = this.element.find('.e-filter-content').children();
                for (var i = 0; i < filters.length; i++) {
                    if (filters.eq(i).find('span.e-chkbox-wrap').attr('aria-checked') == "true") {
                        var index = filters.index(filters.eq(i));
                        this.element.find('.e-quickfilter').nextAll('li.e-tooltxt').eq(index).addClass('e-select');
                    }
                }
                $filterWin.remove();
            }
            if (sHeader.length > 0)
                sHeader.width('');
            this.element.find('.e-rowcell,.e-headercell').width('');
            this.kanbanContent.find('table:eq(0) > colgroup col').width('');
            this.headerContent.find('table > colgroup col').width('');
            if (!this.element.hasClass('e-swimlane-responsive')) {
                scrollEle = this.element.find('.e-rowcell .e-cell-scrollcontent:visible');
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
            this.headerContent.find('table').css({ 'transform': '', 'transition-duration': '' });
            this.kanbanContent.find('table').eq(0).css({ 'transform': '', 'transition-duration': '' });
            scrollCell = this.element.find('.e-cell-scrollcontent');
            for (var i = 0; i < scrollCell.length; i++) {
                var scrollDiv = scrollCell.eq(i).children();
                scrollDiv.children().appendTo(scrollCell.eq(i).parents('.e-rowcell'));
                scrollCell.eq(i).remove();
            }
            var kbnDialog = this.element.find('.e-kanbandialog');
            if (kbnDialog.is(':visible')) {
                var scroller = kbnDialog.parents('.e-dialog-scroller'), wrapper = kbnDialog.parents('.e-dialog');
                wrapper.css({ 'top': '', 'left': '' }).removeClass('e-kbnadapt-editdlg');
                scroller.css('height', 'auto');
                scroller.ejScroller({ height: 0 });
                kbnDialog.parents('body').removeClass('e-kbnwindow-modal');
                wrapper.hide();
                this.KanbanEdit._onKbnDialogOpen();
            }
            if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey)) {
                if (this.kanbanContent.hasClass('e-scroller'))
                    this.kanbanContent.data('ejScroller').destroy();
                this.element.parents('body').removeClass('e-kbnwindow-modal');
                this.element.find('.e-swimlanerow').show();
                var rows = this.element.find('.e-columnrow');
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
            var stHeader = this.element.find('.e-adapt-stheader');
            if (stHeader.length > 0)
                stHeader.find('div').css({ 'position': '', 'left': '' });
            this.element.removeClass('e-responsive');
            this.element.removeClass('e-swimlane-responsive');
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
                    proxy._renderContext();
                }));
            }
            else
                this._renderContext();
        }
        if (this.KanbanEdit) {
            this.KanbanEdit._processEditing();
            if (this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "dialogtemplate")
                this.element.append(this.KanbanEdit._renderDialog());
            else if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate")
                this.element.append(this.KanbanEdit._renderExternalForm());
        }
        this._setResponsiveHeightWidth();
        this._renderKanbanTouchBar();
        this._wireEvents();
        if (this.model.tooltipSettings.enable) {
            this.element.append($("<div class='e-kanbantooltip'></div>"));
            this.element.find('.e-kanbantooltip').hide();
        }
        this.initialRender = false;
    };
    Kanban.prototype._renderKanbanTouchBar = function () {
        this._kTouchBar = ej.buildTag("div.e-kanbantouchbar", "", { display: "none" }, {});
        var content = ej.buildTag("div.e-content", "", {}, {}), downTail = ej.buildTag("div.e-downtail e-tail", "", {}, {});
        var touchElement = ej.buildTag("span.e-cardtouch e-icon", "", {}, {});
        content.append(touchElement);
        this._kTouchBar.append(content);
        this._kTouchBar.append(downTail);
        this.element.append(this._kTouchBar);
    };
    Kanban.prototype._addLastRow = function () {
        var lastRowtd = this.getContentTable().find("tr:last").find("td"), rowHeight = 0;
        if (this.model.allowScrolling && !ej.isNullOrUndefined(this.model.dataSource) && !ej.isNullOrUndefined(this._kanbanRows)) {
            for (var i = 0; i < this._kanbanRows.length; i++)
                rowHeight += $(this._kanbanRows[i]).height();
            if (rowHeight < this.getContent().height() - 1)
                lastRowtd.addClass("e-lastrowcell");
        }
    };
    Kanban.prototype._render = function () {
        this.element.addClass(this.model.cssClass + "e-widget");
        this._renderContent().insertAfter(this.element.children(".e-kanbanheader"));
        this._renderLimit();
        this._enableDragandScroll();
        if (this.initialRender)
            this._addLastRow();
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
            var $tr = this._createStackedRow(this.model.stackedHeaderRows[index]);
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
                $totalCard.append("[").append($totalCount).append("]");
                $headerDiv.append($totalCard);
            }
            if (!ej.isNullOrUndefined(column.constraints)) {
                var isMin = !ej.isNullOrUndefined(column.constraints['min']), isMax = !ej.isNullOrUndefined(column.constraints['max']);
                $limit = ej.buildTag('div.e-limits', "", {}, {});
                if (isMin) {
                    var $min = ej.buildTag("div.e-min", this.localizedLabels.Min + " [", "", {});
                    var $minLimit = ej.buildTag("span.e-minlimit", column.constraints['min'].toString(), "", {});
                    $min.append($minLimit).append("]");
                    $limit.append($min);
                }
                if (isMax) {
                    var $max = ej.buildTag("div.e-max", this.localizedLabels.Max + " [", "", {});
                    var $maxLimit = ej.buildTag("span.e-maxlimit", column.constraints['max'].toString(), "", {});
                    $max.append($maxLimit).append("]");
                    $limit.append($max);
                }
            }
            $headerCellDiv.append($headerDiv).append($limit);
            $headerCell.append($headerCellDiv);
            if (this.model.allowToggleColumn) {
                if (columns[columnCount]["isCollapsed"] === true)
                    $headerCell.append(ej.buildTag('div.e-icon e-clcollapse', "", {}, {})).addClass("e-shrinkcol");
                else
                    $headerCell.append(ej.buildTag('div.e-icon e-clexpand', "", {}, {}));
            }
            if (columns[columnCount]["isCollapsed"] === true && this.model.allowToggleColumn) {
                $headerCell.find(".e-headercelldiv").addClass("e-hide") && $(col).addClass("e-shrinkcol");
                if ($.inArray(columns[columnCount].headerText, this._collapsedColumns) == -1)
                    this._collapsedColumns.push(columns[columnCount].headerText);
            }
            else {
                $headerCell.find(".e-headercelldiv").removeClass("e-hide") && $(col).removeClass("e-shrinkcol");
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
    Kanban.prototype._stackedHeadervisible = function () {
        var stackHeadercell = this.element.find(".e-columnheader .e-stackedHeaderCell ");
        for (var i = 0; i < stackHeadercell.length; i++)
            if (stackHeadercell[i].offsetWidth < stackHeadercell[i].scrollWidth)
                stackHeadercell.eq(i).find("div").addClass("e-hide");
    };
    Kanban.prototype._renderContext = function () {
        var menuitems, submenu, submenuitem, data, menuItem1, item, menu, i, j, k, l, custom, custom2, ul, disableitem, customitems, subMenuItems, subul;
        menuitems = this.model.contextMenuSettings.menuItems;
        ul = ej.buildTag('ul', "", {}, { id: this._id + '_Context' });
        disableitem = this.model.contextMenuSettings.disableDefaultItems;
        for (i = 0; i < menuitems.length; i++) {
            item = menuitems[i].menuItem;
            if ($.inArray(item, disableitem) == -1)
                menu = this._items(item, "menuItem");
            ul.append(menu);
        }
        customitems = this.model.contextMenuSettings.customMenuItems;
        for (j = 0; j < customitems.length; j++) {
            custom = customitems[j].text;
            custom2 = this._items(custom, "custom");
            if (customitems[j].template)
                custom2.append($(customitems[j].template));
            ul.append(custom2);
        }
        subul = ej.buildTag('ul', "", {}, { id: this._id + '_SubContext' });
        for (i = 0; i < this.model.columns.length; i++) {
            item = this.model.columns[i].headerText;
            submenu = ej.buildTag('div', "", {}, { "class": "e-visiblecolumns" });
            submenuitem = ej.buildTag('input', "", {}, { type: "checkbox", name: item });
            menu = this._items(item, "subMenuItem");
            submenu.append(submenuitem);
            menu.prepend(submenu);
            subul.append(menu);
            submenuitem.ejCheckBox({
                checked: this.model.columns[i].visible,
            });
        }
        $(ul).find("li.e-column.e-visiblecolumn").append(subul);
        if (this.model.fields.swimlaneKey) {
            subul = ej.buildTag('ul', "", {}, { id: this._id + '_SubContext' });
            var query = new ej.Query().select([this.model.fields.swimlaneKey]);
            if (this._dataManager.dataSource.offline)
                data = this._dataManager.executeLocal(query);
            else
                data = this._contextSwimlane.executeLocal(query);
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
            contextMenuTarget: "#" + this._id,
            click: $.proxy(this._clickevent, this),
            width: "auto",
            cssClass: "e-kanban-context",
            beforeOpen: $.proxy(this._menu, this),
            open: $.proxy(this._contextopen, this)
        });
        this._conmenu = ul.data("ejMenu");
    };
    Kanban.prototype._contextopen = function () {
        var context = this._conmenu.element;
        if (context.length > 0) {
            if (!context.find("li").is(":visible")) {
                context.css("visibility", "hidden");
            }
        }
    };
    Kanban.prototype._clickevent = function (sender) {
        var args, c, card, cardlen;
        if (sender.parentText != null)
            args = sender.parentText;
        else
            args = sender.events.text;
        c = $(this._contexttarget);
        sender.targetelement = this._contexttarget;
        card = c.closest(".e-kanbancard");
        cardlen = card.length;
        if (this._trigger("contextClick", sender))
            return;
        switch (args) {
            case "Add Card":
                this._isAddNewClick = true;
                this._newCard = $(this._contexttarget);
                if (this.KanbanEdit)
                    this.KanbanEdit.addCard();
                break;
            case "Edit Card":
                if (cardlen > 0 && !ej.isNullOrUndefined(this.model.fields.primaryKey) && this.KanbanEdit)
                    this.KanbanEdit.startEdit(card);
                break;
            case "Hide Column":
                if (c.closest(".e-headercell").find(".e-headercelldiv").length > 0)
                    this.hideColumns($.trim(c.closest(".e-headercell").find(".e-headercelldiv .e-headerdiv").text()).split("[")[0]);
                break;
            case "Delete Card":
                if (!ej.isNullOrUndefined(this.model.fields.primaryKey) && card.length > 0 && this.KanbanEdit)
                    this.KanbanEdit.deleteCard(card.attr("id"));
                break;
            case "Move Right":
                if (cardlen > 0 && this.KanbanDragAndDrop)
                    this.KanbanDragAndDrop._dropToColumn($(this._contexttarget).closest("td.e-rowcell").next(), card);
                break;
            case "Move Left":
                if (cardlen > 0 && this.KanbanDragAndDrop)
                    this.KanbanDragAndDrop._dropToColumn($(this._contexttarget).closest("td.e-rowcell").prev(), card);
                break;
            case "Move Up":
                if (cardlen > 0 && this.KanbanDragAndDrop)
                    this.KanbanDragAndDrop._dropAsSibling(card.prev(), card, false);
                break;
            case "Move Down":
                if (cardlen > 0 && this.KanbanDragAndDrop)
                    this.KanbanDragAndDrop._dropAsSibling(card.next(), card, true);
                break;
            case "Top of Row":
                if (cardlen > 0 && this.KanbanDragAndDrop)
                    this.KanbanDragAndDrop._dropAsSibling(c.closest("td.e-rowcell").find(".e-kanbancard").first(), card, false);
                break;
            case "Bottom of Row":
                if (cardlen > 0 && this.KanbanDragAndDrop)
                    this.KanbanDragAndDrop._dropAsSibling(c.closest("td.e-rowcell").find(".e-kanbancard").last(), card, true);
                break;
            case "Move to Swimlane":
                if (args != sender.text && cardlen > 0) {
                    var id = c.closest(".e-kanbancard").attr("id");
                    var data = new ej.DataManager(this._currentJsonData).executeLocal(new ej.Query().where(this.model.fields.primaryKey, ej.FilterOperators.equal, id))[0];
                    data[this.model.fields.swimlaneKey] = sender.text;
                    var args = { data: data, requestType: "save", primaryKeyValue: data[this.model.fields.primaryKey] };
                    this._saveArgs = args;
                    this.updateCard(id, data);
                    this._saveArgs = null;
                }
                break;
            case "Visible Columns":
                if (args != sender.text) {
                    var index = $(sender.element.parentElement).find("li").index(sender.element);
                    if (this.model.columns[index].visible) {
                        this.hideColumns(sender.text);
                        $($(sender.element).find("input.e-checkbox")).ejCheckBox({ "checked": false });
                    }
                    else {
                        this.showColumns(sender.text);
                        $($(sender.element).find("input.e-checkbox")).ejCheckBox({ "checked": true });
                    }
                }
                break;
        }
    };
    Kanban.prototype._menu = function (sender) {
        var context, targetelement, td, tr, rowCell, card, contextmenu, custommenuitems, customitems, i, j, count, index, menuItems;
        context = this._conmenu.element;
        this._contexttarget = sender.target;
        targetelement = $(sender.target);
        td = $(this._contexttarget).closest("td.e-rowcell");
        tr = $(this._contexttarget).closest("tr.e-columnrow");
        rowCell = targetelement.closest(".e-rowcell");
        card = $(targetelement).closest(".e-kanbancard");
        contextmenu = this.model.contextMenuSettings.menuItems;
        context.css("visibility", "visible");
        context.find("li").hide();
        if (targetelement.closest(".e-kanban").attr("id") !== this._id) {
            context.css("visibility", "hidden");
            return;
        }
        if (context.find(".e-customitem").length > 0) {
            custommenuitems = this.model.contextMenuSettings.customMenuItems;
            customitems = context.find(".e-customitem");
            for (j = 0; j < customitems.length; j++) {
                if (!custommenuitems[j].target)
                    custommenuitems[j].target = "all";
                if (custommenuitems[j].target && custommenuitems[j].text == context.find(".e-customitem").children("a").eq(j).text())
                    switch (custommenuitems[j].target) {
                        case "content":
                            if (this.getContentTable().find(targetelement).length > 0) {
                                $(customitems[j]).show();
                                if ($(customitems[j]).find("li").length > 0)
                                    $(customitems[j]).find("li").show();
                            }
                            else
                                $(customitems[j]).hide();
                            break;
                        case "header":
                            if (this.getHeaderContent().find(targetelement).length > 0) {
                                $(customitems[j]).show();
                                if ($(customitems[j]).find("li").length > 0)
                                    $(customitems[j]).find("li").show();
                            }
                            else
                                $(customitems[j]).hide();
                            break;
                        case "card":
                            if (this.element.find(".e-kanbancard").find(targetelement).length > 0) {
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
        if (this.getContentTable().find(targetelement).length > 0) {
            if (rowCell.length == 0) {
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
                if (!ej.isNullOrUndefined(this.model.fields.primaryKey) && this.model.editSettings.allowEditing)
                    context.find(".e-content.e-cardedit").show();
                if (index > 1)
                    context.find(".e-move.e-up").show();
                if (index != count - 1)
                    context.find(".e-row.e-bottom").show();
                if (index != 0)
                    context.find(".e-row.e-top").show();
                if (((count - 1) - index) > 1)
                    context.find(".e-move.e-down").show();
                if (td.next().length > 0)
                    context.find(".e-move.e-right").show();
                if (td.prev().length > 0)
                    context.find(".e-move.e-left").show();
                if (!ej.isNullOrUndefined(this.model.fields.primaryKey))
                    context.find(".e-content.delete").show();
                if (this.model.fields.swimlaneKey && this.model.fields.primaryKey && context.find(".e-move.e-swimlane").length > 0) {
                    context.find(".e-move.e-swimlane").show();
                    context.find(".e-move.e-swimlane").find("li").show();
                    context.find(".e-move.e-swimlane").find("li").eq(this._columnRows.index(tr)).hide();
                }
            }
            else if (rowCell.length > 0) {
                $(context.find("li").not(".e-customitem")).hide();
                $(context.find(".e-customitem li")).show();
                if (this.model.editSettings.allowAdding)
                    context.find(".e-add").show();
            }
        }
        else if (this.getHeaderContent().find(targetelement).length > 0) {
            var concolumnmenu = context.find(".e-column");
            if ($(targetelement).closest(".e-headercell").not(".e-stackedHeaderCell").length > 0) {
                $(context.find("li").not(".e-customitem")).hide();
                $(context.find(".e-customitem li")).show();
                $(context.find("li.e-haschild").find("li")).show();
                concolumnmenu.show();
                for (i = 0; i < context.find(".e-column.e-visiblecolumn").find("li").length; i++) {
                    if (this.element.find(".e-headercell").not(".e-stackedHeaderCell").eq(i).hasClass("e-hide"))
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
        if (this.model.contextOpen) {
            sender.card = card;
            sender.index = card.parent('.e-rowcell').find('.e-kanbancard').index(card);
            sender.cellIndex = card.parent('.e-rowcell').index();
            sender.rowIndex = this.getIndexByRow(card.parents('.e-columnrow'));
            sender.cardData = this._getKanbanCardData(this._currentJsonData, card.attr('id'))[0];
            this._trigger("contextOpen", sender);
        }
    };
    Kanban.prototype._items = function (item, type) {
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
        if (item.indexOf("Move to") != -1)
            classElement = item.split(" ")[2].toLowerCase();
        else if (item.indexOf("Move") != -1)
            classElement = item.split(" ")[1].toLowerCase();
        else
            classElement = item.split(" ")[0].toLowerCase();
        a.innerHTML = item;
        $(a).append(ej.buildTag('span', "", {}, { "class": "e-kanbancontext e-icon e-context" + classElement }));
        li.append(a);
        return li;
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
        this._addColumnFilters();
        var args = { requestType: 'addcolumn' };
        this._ensureDataSource(args);
        this._renderAllCard();
        this.refresh(true);
        this._refreshHeaderScroller();
        this._totalCount();
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
        if (this.model.filterSettings.length > 0 || this.model.allowSearching || this.model.customToolbarItems || this.model.allowPrinting)
            this.element.append(this._renderToolBar());
        var columns = this.model.columns;
        if (columns && columns.length) {
            this.element.append(this._renderHeader());
            this._stackedHeadervisible();
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
            this._enableKanbanRTL();
        }
    };
    Kanban.prototype._renderToolBar = function () {
        var $div = ej.buildTag('div.e-kanbantoolbar', "", {}, { id: this._id + "_toolbarItems" });
        if (this.model.allowSearching) {
            this._isWatermark = 'placeholder' in document.createElement('input');
            var $searchUl = ej.buildTag("ul.e-searchbar", "", {}, {});
            var $li = ej.buildTag("li.e-search", "", {}, { id: this._id + "_toolbarItems_search" });
            var $a = ej.buildTag("a.e-searchitem e-toolbaricons e-disabletool e-icon e-searchfind", "", { 'position': 'absolute' }, {});
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
        this._refreshDataSource(dataSource);
        this._addLastRow();
    };
    Kanban.prototype._refreshDataSource = function (dataSource) {
        if (dataSource instanceof ej.DataManager)
            this._dataManager = dataSource;
        else
            this._dataManager = new ej.DataManager(dataSource);
        this._isLocalData = (!(this._dataSource() instanceof ej.DataManager) || (this._dataManager.dataSource.offline || this._isRemoteSaveAdaptor));
        this.refresh(true);
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
        if ((this.model.filterSettings.length && !ej.isNullOrUndefined(args) && args.requestType == "filtering") || (!ej.isNullOrUndefined(args) && args.requestType == "search" || this.model.searchSettings.key.length)) {
            queryManagar["queries"] = queryManagar["queries"].slice(queryManagar["queries"].length);
            if (this.model.searchSettings.key.length != 0) {
                var searchDetails = this.model.searchSettings;
                if (searchDetails.fields.length == 0) {
                    if (!ej.isNullOrUndefined(this.model.fields.content))
                        searchDetails.fields.push(this.model.fields.content);
                    if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                        searchDetails.fields.push(this.model.fields.swimlaneKey);
                    if (!ej.isNullOrUndefined(this.model.fields.primaryKey))
                        searchDetails.fields.push(this.model.fields.primaryKey);
                    if (!ej.isNullOrUndefined(this.model.fields.title))
                        searchDetails.fields.push(this.model.fields.title);
                }
                queryManagar.search(searchDetails.key, searchDetails.fields, searchDetails.operator || "contains", searchDetails.ignoreCase);
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
        if (this._isLocalData && (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding) && (!ej.isNullOrUndefined(this._cModifiedData) || !ej.isNullOrUndefined(this._cAddedRecord))) {
            if (ej.isNullOrUndefined(this._cAddedRecord)) {
                queryManagar = queryManagar.where(this.model.fields.primaryKey, ej.FilterOperators.equal, args.primaryKeyValue);
                var currentData = this._dataManager.executeLocal(queryManagar);
                var data;
                if (!(this._dataSource() instanceof ej.DataManager)) {
                    data = $.extend(this._dataSource()[$.inArray(currentData.result[0], this._dataSource())], this._cModifiedData);
                }
                else {
                    data = $.extend(this._dataSource().dataSource.json[$.inArray(currentData.result[0], this._dataSource().dataSource.json)], this._cModifiedData);
                }
                args.data = data;
            }
            else {
                var tmpRcrd = this._cAddedRecord;
                this._cAddedRecord = null;
                (this._dataSource() instanceof ej.DataManager) ? this._dataSource().dataSource.json.push(tmpRcrd) : this._dataSource(undefined, true).splice(this._dataSource().length, 0, tmpRcrd);
            }
            queryManagar["queries"] = cloned["queries"];
        }
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
        for (var i = 0; i < colms.length; i++)
            if (!ej.isNullOrUndefined(colms[i].key))
                predicates.push(new ej.Predicate(this.model.keyField, ej.FilterOperators.equal, colms[i].key, true));
        predicates.length > 0 && (qManager.where(ej.Predicate["or"](predicates)));
        this.keyPredicates = predicates;
    };
    Kanban.prototype._getMetaColGroup = function () {
        var $colgroup = ej.buildTag("colgroup", "", {}, {});
        for (var i = 0; i < this.model.columns.length; i++) {
            var $col = $(document.createElement("col"));
            if (this.model.allowToggleColumn)
                this.model.columns[i]["isCollapsed"] === true && $col.addClass("e-shrinkcol");
            this.model.columns[i]["visible"] === false && $col.addClass("e-hide");
            $colgroup.append($col);
        }
        return $colgroup;
    };
    Kanban.prototype.refresh = function (refreshTemplate) {
        refreshTemplate && this.refreshTemplate();
        var args = { requestType: "refresh" };
        this._processBindings(args);
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
                    this._updateGroup(args.primaryKeyValue, args.data);
                case "delete":
                case "refresh":
                case "search":
                case "filtering":
                    if (this.element.hasClass('e-responsive') && !ej.isNullOrUndefined(args.currentFilterObject))
                        this._kbnAdaptFilterObject = args.currentFilterObject.slice();
                case "cancel":
                    this.getContentTable().find("colgroup").first().replaceWith(this._getMetaColGroup());
                    if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey)) {
                        queryManagar = queryManagar.group(this.model.fields.swimlaneKey);
                        if (!this.currentViewData.GROUPGUID)
                            this.currentViewData = new ej.DataManager(this.currentViewData).executeLocal(queryManagar)["result"];
                    }
                    this._renderAllCard();
                    this._enableSwimlaneCount = true;
                    this._swimlaneLimit(args);
                    if (this.element.hasClass('e-responsive')) {
                        if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                            this.element.find('.e-swimlanerow').hide();
                        this._kanbanWindowResize();
                    }
                    this._eventBindings();
                    break;
                case "beginedit":
                case "add":
                    this.KanbanEdit._editAdd(args);
                    break;
            }
            queryManagar["queries"] = cloned["queries"];
        }
        else {
            this.getContentTable().find('tbody').empty().first().append(this._getEmptyTbody());
        }
        if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate") {
            this._editForm = this.element.find(".e-externalform");
            this.KanbanEdit._formFocus();
        }
        if ("beginedit" == args.requestType || "add" == args.requestType)
            (this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "externalform") && this.KanbanEdit._refreshEditForm(args);
        this._renderComplete(args);
        this._newData = null;
    };
    Kanban.prototype._renderAllCard = function () {
        var temp = document.createElement('div');
        temp.innerHTML = ['<table>', $.render[this._id + "_JSONTemplate"]({ columns: this.model.columns, dataSource: this.currentViewData }), '</table>'].join("");
        if (!ej.isNullOrUndefined(temp.firstChild) && !ej.isNullOrUndefined(temp.firstChild.lastChild))
            this.getContentTable().get(0).replaceChild(temp.firstChild.lastChild, this.getContentTable().get(0).lastChild);
        this._cardCollapse();
        this._selectionOnRerender();
    };
    Kanban.prototype._processBindings = function (args) {
        args.primaryKey = this.model.fields.primaryKey;
        if (!this._checkSkipAction(args) && this._trigger("actionBegin", args))
            return true;
        this._ensureDataSource(args);
        this._editForm = this.element.find(".kanbanform");
        if (!(args.requestType == "beginedit") && this._editForm.length != 0) {
            if (this._editForm.length > 1 && args.requestType == "save" && args.action == "edit")
                this._editForm = $(this._editForm[0]);
            $(this._editForm).find("select.e-dropdownlist").ejDropDownList("destroy");
            $(this._editForm).find("textarea.e-rte").ejRTE("destroy");
            $(this._editForm).find(".e-datepicker").ejDatePicker("destroy");
            $(this._editForm).find(".e-datetimepicker").ejDateTimePicker("destroy");
            $(this._editForm).find(".e-numerictextbox").ejNumericTextbox("destroy");
            $(this._editForm).addClass('e-formdestroy');
        }
        if (args && args.requestType == "delete")
            args.div.remove();
        if (this._dataSource() instanceof ej.DataManager && args.requestType != "beginedit" && args.requestType != "cancel" && args.requestType != "add") {
            this.element.ejWaitingPopup("show");
            var queryPromise = this._queryPromise = this._dataSource().executeQuery(this.model.query);
            var proxy = this;
            if (proxy._dataSource().ready) {
                proxy._dataSource().ready.done(function () {
                    proxy._processDataRequest(proxy, args, queryPromise);
                });
            }
            else {
                proxy._processDataRequest(proxy, args, queryPromise);
            }
        }
        else
            this.sendDataRenderingRequest(args);
    };
    Kanban.prototype._processDataRequest = function (proxy, args, queryPromise) {
        queryPromise.done(ej.proxy(function (e) {
            proxy.element.ejWaitingPopup("hide");
            proxy._currentJsonData = proxy.currentViewData = e.result == null ? [] : e.result;
            proxy._processData(e, args);
        }));
        queryPromise.fail(ej.proxy(function (e) {
            proxy.element.ejWaitingPopup("hide");
            args.error = e.error;
            e = [];
            proxy.currentViewData = [];
            proxy._processData(e, args);
            proxy._trigger("actionFailure", args);
        }));
    };
    Kanban.prototype._processData = function (e, args) {
        if (!ej.isNullOrUndefined(this.model.filterSettings))
            if ((args.requestType == "filtering" || (this.model.filterSettings.length > 0 && args.requestType == "refresh")))
                this._filteredRecordsCount = e.count;
        this.sendDataRenderingRequest(args);
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
            this._setWidthToColumns();
        if (args.requestType == "save" || args.requestType == "cancel")
            this._isAddNew = false;
        if ("delete" == args.requestType || "save" == args.requestType)
            this._editEventTrigger(args);
        this._tableBEle = this.getContentTable().get(0);
        this._kanbanRows = this._tableBEle.rows;
        this._columnRows = $(this._kanbanRows).not(".e-swimlanerow");
        if (this.model.allowScrolling && !this.initialRender)
            this.getContentTable().find("tr:last").find("td").addClass("e-lastrowcell");
        this._trigger("actionComplete", args);
        if (!this.initialRender && this.model.allowScrolling && (args.requestType == "add" || args.requestType == "cancel" || args.requestType == "save" || args.requestType == "delete" || args.requestType == "filtering" || args.requestType == "refresh"))
            this._refreshScroller(args);
        if (args.requestType == "cancel" || args.requestType == "delete") {
            this._renderLimit();
            this._totalCount();
        }
        if (args.requestType == "filtering")
            this._filterLimitCard(args);
        if (this.model.allowDragAndDrop && this.KanbanDragAndDrop)
            this.KanbanDragAndDrop._addDragableClass();
    };
    Kanban.prototype._enableKanbanRTL = function () {
        if (this.model.enableRTL)
            this.element.addClass("e-rtl");
        else
            this.element.removeClass("e-rtl");
    };
    Kanban.prototype._createTemplate = function (elt, templateId) {
        var scriptElt = document.createElement("script");
        scriptElt.id = (this._id + templateId + "_Template");
        scriptElt.type = "text/x-jsrender";
        scriptElt.text = elt;
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
        helpers["_" + proxy._id + "getId"] = this._removeIdSymbols;
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
        this._slTemplate += "<td ej-mappingkey='{{:key}}' class='e-rowcell " + "{{if !#data.visible}}  e-hide {{/if}}" + "{{if (#data.isCollapsed && " + toggle + ")}}e-shrink{{/if}}" + "'role='kanbancell'>" +
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
            "{{:~_" + proxy._id + "getCardCount(" + "~root.dataSource" + ",key,#parent.parent.getIndex()) }}" +
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
        this._cardTemplate =
            "<div id='{{:" + proxy.model.fields.primaryKey + "}}' class='e-kanbancard " + "{{if ~_" + proxy._id + "getData(" + "#parent" + ")  && " + toggle + " }}e-hide{{/if}} " + "{{if " + userAppTemplId + "}}e-templatecell{{/if}}'" +
                "{{if " + cardSets.color + " }} " +
                "style='{{if " + proxy.model.enableRTL + "}}border-right-color{{else}}border-left-color{{/if}}" +
                ":{{for  ~_" + proxy._id + "colorMaps('" + proxy._id + "Object'," + cardSets.color + ")}}" +
                "{{:#data}}{{/for}}'" +
                "{{/if}}>" +
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
                "<div class='e-innercontent'>" +
                "<div class='e-text'>{{:" + cardSets.content + "}}</div>" +
                "{{if " + cardSets.tag + "}}" +
                "{{for ~_" + proxy._id + "tagItems(" + cardSets.tag + ")}}" +
                "{{:#data}}" +
                "{{/for}}" +
                "{{/if}}" +
                "</div>" +
                "{{/if}}" +
                "</td>" +
                "<td class='e-imagecell'>" +
                "{{if " + userImage + " }} " +
                "<div class='e-card_image'>" +
                "{{if " + cardSets.imageUrl + "}}" +
                "<img class='e-image' src='{{:" + cardSets.imageUrl + "}}'></img>" +
                "{{else}}" +
                "<div class='e-image e-no-user'></div>" +
                "{{/if}}" +
                "{{/if}}" +
                "</td>" +
                "</tr></tbody></table>" +
                "</div>" +
                "{{/if}}" +
                "</div>" +
                "</div>";
        return this._cardTemplate;
    };
    Kanban.prototype._removeIdSymbols = function (id) {
        return id.replace(/[-\s']/g, '_');
    };
    Kanban.prototype._columnStatus = function (objectId) {
        var kanbanObject = this["getRsc"]("helpers", objectId);
        var browserDetails = kanbanObject.getBrowserDetails();
        if (browserDetails.browser == "msie")
            return true;
        else
            return false;
    };
    Kanban.prototype._setModel = function (options) {
        for (var prop in options) {
            var $content;
            switch (prop) {
                case "columns":
                    var columns = options.columns;
                    this.model.columns = [];
                    this.columns(columns, "add");
                    break;
                case "cssClass":
                    this.element.removeClass(this.model.cssClass).addClass(options[prop]);
                    break;
                case "filterSettings":
                    if (prop == "filterSettings")
                        this.model.filterSettings = options[prop];
                    if (this.model.filterSettings.length > 0) {
                        this.element.find(".e-kanbantoolbar").remove();
                        this._filterCollection = [];
                        this._renderToolBar().insertBefore(this.element.find(".e-kanbanheader").first());
                    }
                    else {
                        this.element.find(".e-kanbantoolbar").remove();
                        this.model.filterSettings = [];
                        this._filterCollection = [];
                        this.refresh();
                    }
                    break;
                case "allowHover":
                    this.model.allowHover = options[prop];
                    this._enableCardHover();
                    break;
                case "enableRTL":
                    this.model.enableRTL = options[prop];
                    this._enableKanbanRTL();
                    this.refresh(true);
                    this._refreshScroller({ requestType: "refresh" });
                    break;
                case "tooltipSettings":
                    $.extend(this.model.tooltipSettings, options[prop]);
                    if (!ej.isNullOrUndefined(this.model.tooltipSettings) && this.model.tooltipSettings.enable) {
                        this._on(this.element, "mouseover", ".e-kanbancard", $.proxy(this._showToolTip, this));
                        this._on(this.element, "mouseout", ".e-kanbancard", $.proxy(this._hideToolTip, this));
                    }
                    else {
                        this._off(this.element, "mouseover", ".e-kanbancard");
                        this._off(this.element, "mouseout", ".e-kanbancard");
                    }
                    break;
                case "allowScrolling":
                case "scrollSettings":
                    $content = this.getContent();
                    if (prop != "allowScrolling") {
                        if (!ej.isNullOrUndefined(options["scrollSettings"])) {
                            if ($.isEmptyObject(options["scrollSettings"]))
                                break;
                            $.extend(this.model.scrollSettings, options["scrollSettings"]);
                        }
                        if (!ej.isNullOrUndefined(options["allowScrolling"]))
                            this.model.allowScrolling = options["allowScrolling"];
                        !ej.isNullOrUndefined($content.data("ejScroller")) && $content.ejScroller("destroy");
                        if (this.model.allowScrolling) {
                            this.getHeaderContent().find("div").first().addClass("e-headercontent");
                            this._originalScrollWidth = this.model.scrollSettings.width;
                            this._renderScroller();
                        }
                        else {
                            this.element.children(".e-kanbanheader").removeClass("e-scrollcss");
                            this.element.get(0).style.width.length == 0 && this.element.css("width", "auto");
                        }
                        if (!this.model.scrollSettings.allowFreezeSwimlane) {
                            this._freezeSwimlaneRow.remove();
                            this.headerContent.css({ 'position': '', 'top': '' });
                            this.kanbanContent.css({ 'position': '', 'top': '' });
                            var toolbar = this.element.find('.e-kanbantoolbar');
                            if (toolbar.length > 0)
                                toolbar.css({ 'position': '', 'top': '' });
                        }
                    }
                    break;
                case "dataSource":
                    $content = this.element.find(".e-kanbancontent").first();
                    this._refreshDataSource(this._dataSource());
                    this._addLastRow();
                    break;
                case "editSettings":
                    $.extend(this.model.editSettings, options[prop]);
                    this.KanbanEdit._processEditing();
                    this._tdsOffsetWidth = [];
                    if (this.model.editSettings.allowEditing || this.model.editSettings.allowAdding) {
                        if (this.model.editSettings.editMode == "dialog" || this.model.editSettings.editMode == "dialogtemplate") {
                            $("#" + this._id + "_dialogEdit").data("ejDialog") && $("#" + this._id + "_dialogEdit").ejDialog("destroy");
                            $("#" + this._id + "_dialogEdit_wrapper,#" + this._id + "_dialogEdit").remove();
                            this.element.append(this.KanbanEdit._renderDialog());
                        }
                        else if (this.model.editSettings.editMode == "externalform" || this.model.editSettings.editMode == "externalformtemplate") {
                            $("#" + this._id + "_externalEdit").css("display", "none");
                            this.element.append(this.KanbanEdit._renderExternalForm());
                        }
                    }
                    this._enableEditingEvents();
                    break;
                case "allowSelection":
                    if (options[prop]) {
                        this._off(this.element, "click");
                        this._on(this.element, "click", "", this._clickHandler);
                    }
                    break;
                case "query":
                    this.model.query = $.extend(true, {}, options[prop]);
                    break;
                case "stackedHeaderRows":
                    if (prop == "stackedHeaderRows")
                        this.model.stackedHeaderRows = options[prop];
                    if (this.model.stackedHeaderRows.length > 0) {
                        this._refreshStackedHeader();
                    }
                    else {
                        this.element.find(".e-stackedHeaderRow").remove();
                        this.model.stackedHeaderRows = [];
                    }
                    break;
                case "cardSettings":
                    if (!ej.isNullOrUndefined(options["cardSettings"])) {
                        $.extend(this.model.cardSettings, options["cardSettings"]);
                    }
                    this.element.find(".e-kanbancard").remove();
                    this.refreshTemplate();
                    this._renderAllCard();
                    this._enableDragandScroll();
                    break;
                case "allowToggleColumn":
                    this.model.allowToggleColumn = options[prop];
                    this.refreshTemplate();
                    this.getHeaderContent().replaceWith(this._renderHeader());
                    this.sendDataRenderingRequest({ requestType: "refresh" });
                    if (!this.model.allowToggleColumn)
                        this.element.find(".e-shrinkheader").not(".e-hide").addClass("e-hide");
                    break;
                case "locale":
                    this.model.locale = options[prop];
                    var model = this.model, element = this.element;
                    model.query["queries"] = model.query["queries"].slice(0, model.query["queries"].length - 1);
                    this.element.ejKanban("destroy").ejKanban(model);
                    this.element = element;
                    this.model = model;
                    if (this._collapsedCards.length != 0)
                        this.toggleCard(this._collapsedCards);
                    break;
            }
        }
    };
    Kanban.prototype._columnCardcount = function (id, key, index) {
        var co = 0;
        var j;
        if (ej.isNullOrUndefined(index)) {
            for (j = 0; j < id.length; j++)
                if (id[j].Status === key)
                    co++;
            return co;
        }
        else
            for (j = 0; j < id[index].items.length; j++)
                if (id[index].items[j].Status === key)
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
        cloned = cloned.where(kanbanObject.model.keyField, "equal", this["data"].key);
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
    Kanban.prototype._renderSingleCard = function (primaryKey, card) {
        var curEle = this.element.find("div[id='" + primaryKey + "']"), proxy = this, curTr, curTd;
        if (!this._dropped) {
            if (!ej.isNullOrUndefined(proxy.model.fields.swimlaneKey)) {
                var slKey = this._removeIdSymbols(card[proxy.model.fields.swimlaneKey]);
                var slTr = this.element.find("tr[id='" + slKey + "']");
                if (slTr.length > 0)
                    curTr = slTr.next();
            }
            else
                curTr = this.element.find(".e-columnrow:first");
            curTd = $(curTr).find("td.e-rowcell[ej-mappingkey='" + card[proxy.model.keyField] + "']");
            $(curEle).remove();
            if (curTd.length > 0)
                $(curTd).append($.render[this._id + "_cardTemplate"](card));
        }
        else {
            var cTemp = $.render[this._id + "_cardTemplate"](card);
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version == "8.0")
                $(curEle).after(cTemp);
            else
                $(curEle).replaceWith(cTemp);
        }
        var index = $.inArray(primaryKey, this._collapsedCards);
        if (index != -1)
            this.toggleCard(primaryKey);
        if (this.KanbanDragAndDrop) {
            this.KanbanDragAndDrop._addDragableClass();
        }
        this._selectionOnRerender();
    };
    Kanban.prototype._selectionOnRerender = function () {
        var rowIndex, row, column, cardsSelected = true, kObj = this;
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
                            kObj._pushIntoSelectedArray([rowCellIndex]);
                        }
                        else {
                            cardsSelected = false;
                            kObj._selectedCards[i].splice(l, 1);
                            var index = kObj._selectedCardData.indexOf(kObj._getKanbanCardData(kObj._selectedCardData, el[0].id)[0]);
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
                        kObj._pushIntoSelectedArray([rowCellIndex]);
                    }
                    else {
                        cardsSelected = false;
                        kObj._selectedCards.splice(i, 1);
                        var index = kObj._selectedCardData.indexOf(this._getKanbanCardData(kObj._selectedCardData, el[0].id)[0]);
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
    Kanban.prototype._getKanbanCardData = function (data, key) {
        return (new ej.DataManager(data).executeLocal(new ej.Query().where(this.model.fields.primaryKey, ej.FilterOperators.equal, key)));
    };
    Kanban.prototype._renderScroller = function () {
        if (!this.model.scrollSettings)
            this.model.scrollSettings = {};
        if (typeof (this._originalScrollWidth) == "string") {
            this.element.css("width", "auto");
            var width = this.element.width();
            if (this.model.scrollSettings.width == "auto" || this._originalScrollWidth == "auto")
                this._originalScrollWidth = "100%";
            this.model.scrollSettings.width = width * (parseFloat(this._originalScrollWidth) / 100);
        }
        if (typeof (this.model.scrollSettings.height) == "string") {
            var height = this.element.height();
            if (this.model.scrollSettings.height == "auto")
                this.model.scrollSettings.height = "100%";
            this.model.scrollSettings.height = height * (parseFloat(this.model.scrollSettings.height) / 100);
        }
        if ((this.model.scrollSettings.width || this.model.width))
            this.element.width(this.model.scrollSettings.width || this.model.width);
        var contentHeight = this.model.scrollSettings.height != 0 ? (this.model.scrollSettings.height - this.getHeaderTable().height() - (!ej.isNullOrUndefined(this._filterToolBar) && this._filterToolBar.height())) : this.model.scrollSettings.height;
        var $content = this.getContent().attr("tabindex", "0");
        this.element.addClass("e-kanbanscroll");
        $content.ejScroller({
            enableRTL: this.model.enableRTL,
            height: contentHeight,
            width: this.model.scrollSettings.width,
            thumbStart: $.proxy(this._kbnThumbStart, this),
            scroll: $.proxy(this._freezeSwimlane, this)
        });
        if (this.getContent().ejScroller("isVScroll")) {
            this.element.find(".e-kanbanheader").addClass("e-scrollcss");
            this.getHeaderContent().find("div").first().addClass("e-headercontent");
        }
        else
            this.element.find(".e-kanbanheader").removeClass("e-scrollcss");
        if (this.model.scrollSettings.width || this.model.width)
            this.element.width(this.model.scrollSettings.width || this.model.width);
        var scroller = this.getContent().data("ejScroller"), css = scroller && (scroller.isVScroll()) ? "addClass" : "removeClass";
        this.getHeaderContent().find(".e-headercontent")[css]("e-hscrollcss");
        this._refreshHeaderScroller();
    };
    Kanban.prototype._refreshHeaderScroller = function () {
        var proxy = this;
        this.getContent().find(".e-content").scroll(ej.proxy(function (e) {
            proxy.getHeaderContent().find("div").first().scrollLeft($(e.currentTarget).scrollLeft());
        }));
        this.element.find(".e-kanbanheader").find(".e-headercontent").scroll(ej.proxy(function (e) {
            var $currentTarget = $(e.currentTarget);
            proxy.getContent().find(".e-content").first().scrollLeft($currentTarget.scrollLeft());
        }));
    };
    Kanban.prototype._kbnThumbStart = function (e) {
        var target = $(e.originalEvent.target);
        if (target.hasClass("e-kanbancard") || target.parents(".e-kanbancard").hasClass("e-kanbancard"))
            return false;
        return false;
    };
    Kanban.prototype._freezeSwimlane = function (e) {
        var slKey = this.model.fields.swimlaneKey, toolbar = this.element.find('.e-kanbantoolbar');
        this._freezeSwimlaneRow = this.element.find('.e-freezeswimlanerow');
        if (!this.model.scrollSettings.allowFreezeSwimlane) {
            this._freezeSwimlaneRow.remove();
            this.headerContent.css({ 'position': '', 'top': '' });
            this.kanbanContent.css({ 'position': '', 'top': '' });
            if (toolbar.length > 0)
                toolbar.css({ 'position': '', 'top': '' });
        }
        if (this.element.hasClass('e-responsive') && ej.isNullOrUndefined(slKey) || (!this.element.hasClass('e-responsive') && (!this.model.scrollSettings.allowFreezeSwimlane || ej.isNullOrUndefined(slKey) || (!ej.isNullOrUndefined(e.scrollLeft) && this._freezeSwimlaneRow.length == 0))))
            return;
        var top, firstSl, table, tbody, tds;
        if (this._freezeSwimlaneRow.length <= 0 && this.model.scrollSettings.allowFreezeSwimlane) {
            this._freezeSwimlaneRow = ej.buildTag('div.e-freezeswimlanerow e-swimlanerow', "<div></div>", {}, {});
            top = (this.headerContent.offset().top + this.headerContent.height()) - (this.element.offset().top + 1);
            var height = this.element.height();
            this._freezeSwimlaneRow.prependTo(this.element).css({ 'top': top });
            top = this._freezeSwimlaneRow.height();
            this.headerContent.css({ 'position': 'relative', 'top': -top });
            this.kanbanContent.css({ 'position': 'relative', 'top': -top });
            if (toolbar.length > 0)
                toolbar.css({ 'position': 'relative', 'top': -top });
            this.element.height(height);
            firstSl = this._swimlaneRows.eq(0);
            this._freezeSwimlaneRow.children().append(firstSl.find('.e-slkey,.e-slcount').clone());
            this._freezeSwimlaneRow.width(this.headerContent.width() - 1).height(firstSl.height());
            this._freezeSlOrder = 0;
            table = ej.buildTag('table.e-table e-freeze-table', "", {}, { cellspacing: "0.25px" });
            table.append(this.getContentTable().find('colgroup').clone());
            tbody = ej.buildTag("tbody", "", {}, {});
            table.append(tbody);
            tbody.append(this.getContentTable().find('.e-columnrow').eq(0).clone().removeClass('e-columnrow').addClass('e-collapsedrow'));
            tds = tbody.find('td');
            tds.removeClass('e-droppable').removeAttr('ej-mappingkey').height(0);
            tds.children().remove();
            this._freezeSwimlaneRow.append(table);
        }
        else if (this._freezeSwimlaneRow.length > 0 || (!ej.isNullOrUndefined(slKey) && this.element.hasClass('e-responsive'))) {
            var freezeSlHeight, curHeight, nextSlHeight = 0, curSlHeight = 0, prevSlHeight = 0, rows, slText = this.element.find('.e-swimlane-text');
            var nextSl, curSl, prevSl, freezeSlDiv;
            if (!ej.isNullOrUndefined(slKey) && this.element.hasClass('e-responsive')) {
                rows = this.element.find('.e-columnrow');
                freezeSlHeight = this.getContent().offset().top;
                curSl = rows.eq(this._freezeSlOrder);
                nextSl = rows.eq(this._freezeSlOrder + 1);
                prevSl = rows.eq(this._freezeSlOrder - 1);
                if (nextSl.length > 0)
                    nextSlHeight = nextSl.offset().top;
                if (curSl.length > 0)
                    curSlHeight = curSl.offset().top;
                if (prevSl.length > 0)
                    prevSlHeight = prevSl.offset().top;
            }
            else if (this._freezeSwimlaneRow.length > 0) {
                freezeSlHeight = this.getContent().offset().top + this._freezeSwimlaneRow.height();
                curSl = this._swimlaneRows.eq(this._freezeSlOrder);
                nextSl = this._swimlaneRows.eq(this._freezeSlOrder + 1);
                prevSl = this._swimlaneRows.eq(this._freezeSlOrder - 1);
                nextSlHeight = nextSl.offset().top + nextSl.height();
                curSlHeight = curSl.offset().top + curSl.height();
                prevSlHeight = prevSl.offset().top + prevSl.height();
            }
            freezeSlDiv = this.element.find('.e-freezeswimlanerow >div');
            if (this._freezeScrollTop > e.scrollTop) {
                curSlHeight = curSlHeight;
                if (freezeSlHeight >= nextSlHeight)
                    nextSlHeight = freezeSlHeight + 1;
            }
            if (this._freezeScrollTop < e.scrollTop)
                nextSlHeight = nextSlHeight;
            if (e.source == "wheel" || e.source == "button") {
                if (this._freezeScrollTop < e.scrollTop)
                    nextSlHeight = nextSlHeight - e.model.scrollOneStepBy;
                else if (this._freezeScrollTop > e.scrollTop)
                    freezeSlHeight = freezeSlHeight - e.model.scrollOneStepBy;
            }
            if (freezeSlHeight >= nextSlHeight) {
                if (freezeSlDiv.length > 0) {
                    freezeSlDiv.children().remove();
                    freezeSlDiv.append(nextSl.find('.e-slkey,.e-slcount').clone());
                }
                if (slText.length > 0) {
                    slText.text(this._kbnAdaptDdlData[this._kbnAdaptDdlIndex + 1]);
                    ++this._kbnAdaptDdlIndex;
                }
                ++this._freezeSlOrder;
            }
            else if (freezeSlHeight < curSlHeight && freezeSlHeight > prevSlHeight && this._freezeSlOrder > 0) {
                if (freezeSlDiv.length > 0) {
                    freezeSlDiv.children().remove();
                    freezeSlDiv.append(prevSl.find('.e-slkey,.e-slcount').clone());
                }
                if (slText.length > 0) {
                    slText.text(this._kbnAdaptDdlData[this._kbnAdaptDdlIndex - 1]);
                    --this._kbnAdaptDdlIndex;
                }
                --this._freezeSlOrder;
            }
            if (e.scrollTop == 0) {
                this._freezeSwimlaneRow.remove();
                this.headerContent.css({ 'position': '', 'top': '' });
                this.kanbanContent.css({ 'position': '', 'top': '' });
                if (toolbar.length > 0)
                    toolbar.css({ 'position': '', 'top': '' });
            }
            if (!ej.isNullOrUndefined(e.scrollLeft)) {
                freezeSlDiv.css({ 'left': -e.scrollLeft });
                this._freezeSwimlaneRow.find('table').css({ 'left': -e.scrollLeft });
            }
        }
        this._freezeScrollTop = e.scrollTop;
    };
    Kanban.prototype._enableDragandScroll = function () {
        if (this.model.allowDragAndDrop && this.KanbanDragAndDrop)
            this.KanbanDragAndDrop._addDragableClass();
        if (this.model.allowScrolling) {
            if (this.initialRender) {
                if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                    this._swimlaneRows = this.element.find('.e-swimlanerow');
                this._renderScroller();
            }
            else
                this._refreshScroller({ requestType: "refresh" });
        }
        if (this.model.enableTotalCount)
            this._totalCount();
    };
    Kanban.prototype._refreshScroller = function (args) {
        var kanbanContent = this.getContent().first();
        if (ej.isNullOrUndefined(kanbanContent.data("ejScroller")))
            return;
        if (args.requestType == "beginedit")
            this.getScrollObject().scrollY(0, true);
        kanbanContent.ejScroller("refresh");
        kanbanContent.ejScroller({ enableRTL: this.model.enableRTL });
        if (kanbanContent.ejScroller("isVScroll") && !this.getScrollObject().model.autoHide) {
            this.getHeaderContent().addClass("e-scrollcss");
            !this.getHeaderContent().find(".e-headercontent").hasClass("e-hscrollcss") && this.getHeaderContent().find(".e-headercontent").addClass("e-hscrollcss");
        }
        else
            this.element.find(".e-kanbanheader").removeClass("e-scrollcss");
    };
    Kanban.prototype._cardCollapse = function () {
        if (this._collapsedCards.length > 0) {
            var $card = this.element.find(".e-kanbancard");
            for (var i = 0; i < $card.length; i++) {
                var cardId = $($card[i]).find(".e-primarykey").text();
                if ($.inArray(cardId, this._collapsedCards) != -1)
                    this.toggleCard(cardId);
            }
        }
    };
    Kanban.prototype._updateGroup = function (cardId, data) {
        var proxy = this;
        if (ej.isNullOrUndefined(this._saveArgs))
            new ej.DataManager(proxy._currentJsonData).update(proxy.model.fields.primaryKey, data, "");
        if ($.type(data) && !data.count)
            proxy._renderSingleCard(cardId, data);
    };
    Kanban.prototype.updateCard = function (primaryKey, data) {
        if (ej.isNullOrUndefined(data) && primaryKey)
            data = new ej.DataManager(this._currentJsonData).executeLocal(new ej.Query().where(this.model.fields.primaryKey, ej.FilterOperators.equal, primaryKey))[0];
        data = ej.isNullOrUndefined(data) ? null : data;
        var promise, tempCard = data, proxy = this;
        var args = this._saveArgs;
        if (this._dataSource() instanceof ej.DataManager && !this._dataManager.dataSource.offline || (this._dataSource().adaptor instanceof ej.remoteSaveAdaptor)) {
            if (ej.isNullOrUndefined(this._saveArgs) || this._saveArgs.action == "edit")
                (promise = this._dataManager.update(this.model.fields.primaryKey, tempCard));
            else
                (promise = this._dataManager.insert(tempCard));
            if (!ej.isNullOrUndefined(promise) && $.isFunction(promise.promise) && this._dataSource() instanceof ej.DataManager) {
                promise.done(function (e) {
                    if (!ej.isNullOrUndefined(e) && $.isPlainObject(e.record)) {
                        if (!ej.isNullOrUndefined(args)) {
                            args.data = e.record;
                            if (args.action == "add")
                                proxy._cAddedRecord = e.record;
                            if (args.action == "edit")
                                proxy._cModifiedData = e.record;
                        }
                        else
                            data = e.record;
                    }
                    if (ej.isNullOrUndefined(args))
                        proxy._updateGroup(primaryKey, data);
                    else
                        proxy._processBindings(args);
                    proxy._cModifiedData = null;
                    proxy._cAddedRecord = null;
                    proxy._isAddNewClick = false;
                    proxy._currentData = null;
                    proxy._newCard = null;
                    proxy._saveArgs = null;
                    proxy._cardEditClick = null;
                    proxy._dblArgs = null;
                });
                promise.fail(function (e) {
                    var argsKanban;
                    if (ej.isNullOrUndefined(args))
                        argsKanban = e;
                    else {
                        args.error = (e && e.error) ? e.error : e;
                        argsKanban = args;
                    }
                    proxy._trigger("actionFailure", argsKanban);
                });
            }
        }
        else {
            if (ej.isNullOrUndefined(this._saveArgs))
                proxy._updateGroup(primaryKey, data);
            else
                proxy._processBindings(this._saveArgs);
        }
        if (promise == undefined || !$.isFunction(promise.promise)) {
            proxy._cModifiedData = null;
            proxy._cAddedRecord = null;
            proxy._isAddNewClick = false;
            proxy._currentData = null;
            proxy._newCard = null;
            proxy._saveArgs = null;
            proxy._cardEditClick = null;
            proxy._dblArgs = null;
        }
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
            var data = this._getKanbanCardData(this._currentJsonData, cardId);
            var args = { card: $kanbanCard[i], cell: rowCell, column: curColumn, data: data[0] };
            this._trigger("queryCellInfo", args);
        }
    };
    Kanban.prototype._checkSkipAction = function (args) {
        switch (args.requestType) {
            case "save":
            case "delete":
                return true;
        }
        return false;
    };
    Kanban.prototype._totalCount = function () {
        for (var i = 0; i < this.model.columns.length; i++) {
            var column = this.model.columns[i];
            if (ej.isNullOrUndefined(column.constraints) && this.model.enableTotalCount) {
                var total = this.getHeaderContent().find("span.e-totalcount")[i];
                var key = column.key;
                var $columnrow = $($(this.element.find(".e-columnrow")).find('td[ej-mappingkey=' + key + ']'));
                var totalcard = $columnrow.find(".e-kanbancard").length;
                $(total).text(totalcard);
            }
        }
    };
    Kanban.prototype._renderLimit = function () {
        var total, totalcard, $headerCell = {};
        for (var i = 0; i < this.model.columns.length; i++) {
            var column = this.model.columns[i];
            if (!ej.isNullOrUndefined(column.constraints)) {
                var isMin = !ej.isNullOrUndefined(column.constraints['min']), isMax = !ej.isNullOrUndefined(column.constraints['max']);
                if (isMin || isMax)
                    $headerCell = this.getHeaderContent().find(".e-columnheader").not(".e-stackedHeaderRow").find(".e-headercell")[i];
                total = this.getHeaderContent().find("span.e-totalcount");
                var key = column.key, $cell = $($(this.element.find(".e-columnrow")).find('td[ej-mappingkey=' + key + ']')), k = 0;
                totalcard = $cell.find(".e-kanbancard").length;
                $(total[i]).text(totalcard);
                if (ej.isNullOrUndefined(column.constraints.type))
                    column.constraints.type = "column";
                switch (column.constraints.type) {
                    case "column":
                        this._validateLimit(column, $headerCell, k);
                        break;
                    case "swimlane":
                        for (k = 0; k < $cell.length; k++) {
                            this._validateLimit(column, $headerCell, k);
                            if (!this.getHeaderContent().find(".e-headercell").eq(i).hasClass("e-shrinkcol"))
                                $cell.eq(k).find(".e-limits").removeClass("e-hide");
                        }
                        if (!ej.isNullOrUndefined(this.model.fields.swimlaneKey))
                            $($headerCell).find(".e-limits").addClass("e-hide");
                        break;
                }
            }
        }
    };
    Kanban.prototype._getEmptyTbody = function () {
        var $emptyTd = ej.buildTag('td.e-emptycard', this.localizedLabels.EmptyCard, {}, { colSpan: this.model.columns.length });
        return $(document.createElement("tr")).append($emptyTd);
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
ej.Kanban.Locale = {};
;

});