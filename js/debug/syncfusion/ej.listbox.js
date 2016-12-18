/*!
*  filename: ej.listbox.js
*  version : 14.2.0.26
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.core","./../common/ej.data","./../common/ej.scroller","./../common/ej.draggable","./ej.checkbox"], fn) : fn();
})
(function () {
	
/**
* @fileOverview Plugin to style the Html UL elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejListBox", "ej.ListBox", {

        element: null,
        ignoreOnPersist: ["dataSource", "query", "itemRequestCount", "fields", "create", "change", "select", "unselect", "itemDragStart", "itemDrag", "itemDragStop", "itemDrop", "checkChange", "destroy", "actionComplete", "actionFailure", "actionSuccess", "actionBegin", "itemDropped", "selected"],
        model: null,
        validTags: ["ul"],
        _setFirst: false,
        _rootCSS: "e-listbox",
        defaults: {
            itemsCount: null,
            totalItemsCount: null,
            dataSource: null,
            query: ej.Query(),
            itemRequestCount: 5,
            fields: {
                id: null,
                text: null,
                imageUrl: null,
                imageAttributes: null,
                spriteCssClass: null,
                htmlAttributes: null,
                tooltipText: null,
                selectBy: null,
                checkBy: null,
                groupBy: null,
                tableName: null,

                //deprecated field properties
                selected: null,
                category: null,
                toolTipText: null
            },
            height: "auto",
            width: "200",
            template: null,
            text: "",
            selectedIndex: null,
            checkedIndices: [],
            selectedIndices: [],
            cascadeTo: null,
            value: "",
            cssClass: "",
            targetID: null,
            htmlAttributes: {},
            showRoundedCorner: false,
            enableRTL: false,
            enabled: true,
            showCheckbox: false,
            allowVirtualScrolling: false,
            virtualScrollMode: "normal",
            enablePersistence: false,
            allowMultiSelection: false,
            allowDrag: false,
            allowDrop: false,
            enableIncrementalSearch: false,
            caseSensitiveSearch: false,
            loadDataOnInit: true,
            create: null,
            change: null,
            select: null,
            unselect: null,
            itemDragStart: null,
            itemDrag: null,
            itemDragStop: null,
            itemDrop: null,
            checkChange: null,
            destroy: null,
            actionComplete: null,
            actionSuccess: null,
            actionBeforeSuccess:null,
            focusIn:null,
            focusOut:null,
            actionFailure: null,
            actionBegin: null,
            //Deprecated Members
            enableVirtualScrolling: false,
            checkAll: false,
            uncheckAll: false,
            enableLoadOnDemand: false,
            itemRequest: null,
            allowDragAndDrop: undefined,
            selectedItemIndex: null,
            enableItemsByIndex: null,
            checkItemsByIndex: null,
            disableItemsByIndex: null,
            uncheckItemsByIndex: null,
            itemDropped: null,
            selected: null,
            selectIndexChanged: null,
            selectedItems: [],
            checkedItems: [],
            checkedItemlist: [],
            selectedItemlist: [],
        },
        dataTypes: {
            cssClass: "string",
            itemsCount: "number",
            itemRequestCount: "number",
            allowDrag: "boolean",
            allowDrop: "boolean",
            enableIncrementalSearch: "boolean",
            caseSensitiveSearch: "boolean",
            template: "string",
            targetID: "string",
            selectedIndex: "number",
            cascadeTo: "string",
            showRoundedCorner: "boolean",
            enableRTL: "boolean",
            enablePersistence: "boolean",
            enabled: "boolean",
            allowMultiSelection: "boolean",
            dataSource: "data",
            query: "data",
            checkedIndices: "data",
            selectedIndices: "data",
            htmlAttributes: "data",
            loadDataOnInit: "boolean",
            showCheckbox: "boolean"
        },
        observables: ["value"],
        value: ej.util.valueFunction("value"),
        enable: function () {
            if (this.listContainer.hasClass("e-disable")) {
                this.target.disabled = false;
                this.model.enabled = this.model.enabled = true;
                this.element.removeAttr("disabled");
                this.listContainer.removeClass('e-disable');
                if (this.model.allowMultiSelection) this.listContainer.removeClass("e-disable");
                var scroller = this.listContainer.find(".e-vscrollbar,.e-hscrollbar");
                if (this.model.showCheckbox) this.element.find(".listcheckbox").ejCheckBox("enable");
                if (scroller.length > 0)
                    this.scrollerObj.enable();
            }
        },
        disable: function () {
            if (!this.listContainer.hasClass("e-disable")) {
                this.target.disabled = true;
                this.model.enabled = this.model.enabled = false;
                this.element.attr("disabled", "disabled");
                this.listContainer.addClass('e-disable');
                if (this.model.allowMultiSelection) this.listContainer.addClass("e-disable");
                var scroller = this.listContainer.find(".e-vscrollbar,.e-hscrollbar");
                if (this.model.showCheckbox) this.element.find(".listcheckbox").ejCheckBox("disable");
                if (scroller.length > 0)
                    this.scrollerObj.disable();
            }
        },
        selectItemByIndex: function (index) {            
            index = parseInt(index);            
            if (index != null && !this.model.showCheckbox) {
                this._activeItem = index;                
                if (this._activeItem == this._listSize - 1) {
                    this._activeItem = this._listSize - 1;
                }
                var activeitem = $(this.element.children("li")[this._activeItem]);
                if (!activeitem.hasClass("e-select") && !activeitem.hasClass("e-disable")) {
                    this.element.children("li").removeClass("e-select");
                    this._selectedItems = [];
                    this.model.selectedIndices = [];
                    activeitem.addClass("e-select");
                    this._selectedItems.push(activeitem);
                    this.model.selectedIndices.push(index);
                    var selectData = this._getItemObject(activeitem, null);
                    selectData["isInteraction"] = false;
                    if (this.model.select)
                        this._trigger('select', selectData);
                }
            }
            if (this.model.cascadeTo) {
                this._activeItem = index;
                this._cascadeAction();
            }
            this._setSelectionValues();
        },
        checkItemByIndex: function (index) {
            if (typeof (index) == "number")
                this.checkItemsByIndices(index.toString());
        },
        uncheckItemByIndex: function (index) {
            if (typeof (index) == "number")
                this.uncheckItemsByIndices(index.toString());
        },
        checkItemsByIndices: function (index) {
            if ((ej.isNullOrUndefined(index))) return false;
            var checkitems = index.toString().split(',');
            if (checkitems.length > 0) {
                for (var i = 0; i < checkitems.length; i++) {
                    if (checkitems[i] != null) {
                        this._activeItem = parseInt(checkitems[i]);
                        if (this._activeItem < 0) this._activeItem = 0;
                        var activeitem = $(this.element.children("li")[this._activeItem]);
                        if (this.model.showCheckbox) {
                            if (!($(activeitem).find('.listcheckbox').ejCheckBox('isChecked'))) {
                                $(activeitem).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                                this.checkedStatus = true;
                                if (!($.inArray(this._activeItem, this._checkedItems) > -1)) this._checkedItems.push(this._activeItem);
                                if (!($.inArray(activeitem[0], this.model.checkedIndices) > -1)) this.model.checkedIndices.push(activeitem[0]);
                                var checkData = this._getItemObject(activeitem, null);
                                checkData["isInteraction"] = false;
                                if (this.model.change)
                                    this._trigger('change', checkData);
                            }
                        }
                    }
                }
            }
            this._setSelectionValues();
        },
        uncheckItemsByIndices: function (value) {
            if ((ej.isNullOrUndefined(value))) return false;
            var checkitems = value.toString().split(',');
            if (checkitems.length > 0) {
                for (var i = 0; i < checkitems.length; i++) {
                    if (checkitems[i] != null) {
                        var index = parseInt(checkitems[i]);
                        var unselectitem = $(this.element.children("li")[parseInt(index)]);
                        if (this.model.showCheckbox) {
                            if (($(unselectitem).find('.listcheckbox').ejCheckBox('isChecked')) && (!($(unselectitem).hasClass('e-disable')))) {
                                $(unselectitem).find('.listcheckbox').ejCheckBox('option', 'checked', false);
                                this.checkedStatus = false;
                                var itemIndex = $.inArray(index, this.model.checkedIndices);
                                if ($.inArray(index, this._checkedItems) > -1) this._checkedItems.splice(itemIndex, 1);
                                if (itemIndex > -1) this.model.checkedIndices.splice(itemIndex, 1);
                                var unselectData = this._getItemObject(unselectitem, null);
                                unselectData["isInteraction"] = false;
                                if (this.model.checkChange)
                                    this._trigger('checkChange', unselectData);
                            }
                        }
                    }
                }
            }
            this._setSelectionValues();
        },
        selectAll: function () {
            if (!this.model.showCheckbox && this.model.allowMultiSelection) {
                var activeItem = this.element.children("li");
                for (var i = 0; i < activeItem.length; i++) {
                    if (!$(activeItem[i]).hasClass("e-select") && !$(activeItem[i]).hasClass("e-disable")) {
                        $(activeItem[i]).addClass("e-select");
                        this._selectedItems.push($(activeItem[i]));
                        this.model.selectedIndices.push(i);
                        var selectData = this._getItemObject(activeItem, null);
                        selectData["isInteraction"] = false;
                        if (this.model.select)
                            this._trigger('select', selectData);
                    }
                }
            }
            this._setSelectionValues();
        },
        //Deprecated Method
        unSelectAll: function () { this.unselectAll(); },
        unselectAll: function () {
            if (!this.model.showCheckbox)
                this._removeListHover();
            this._setSelectionValues();
            return this;
        },
        //deprecated function
        selectItemsByIndex: function (value) {
            this.selectItemsByIndices(value);
        },
        selectItemsByIndices: function (value) {
            var selectitems = value.toString().split(',');
            if (!this.model.showCheckbox && this.model.allowMultiSelection) {
                for (var i = 0; i < selectitems.length; i++) {
                    if (selectitems[i] != null) {
                        var index = parseInt(selectitems[i]);
                        this._activeItem = index;
                        if (this._activeItem < 0) {
                            this._activeItem = 0;
                        } else if (this._activeItem == this._listSize - 1) {
                            this._activeItem = this._listSize - 1;
                        }
                        var activeitem = $(this.element.children("li")[this._activeItem]);
                        if (!activeitem.hasClass("e-select")) {
                            activeitem.addClass("e-select");
                            this._selectedItems.push(activeitem);
                            this.model.selectedIndices.push(index);
                            var selectData = this._getItemObject(activeitem, null);
                            selectData["isInteraction"] = false;
                            if (this.model.select)
                                this._trigger('select', selectData);
                        }
                    }
                }
            }
            this._setSelectionValues();
        },
        //deprecated property
        unselectItemsByIndex: function (value) {
            this.unselectItemsByIndices(value);
        },
        unselectItemsByIndices: function (value) {
            if (this.model.showCheckbox) return false;
            var selectitems = value.toString().split(',');
            for (var i = 0; i < selectitems.length; i++) {
                if (selectitems[i] != null) {
                    var index = parseInt(selectitems[i]);
                    var activeitem = $(this.element.children("li")[index]);
                    this._activeItem = index;
                    activeitem.removeClass('e-active e-select');
                    var itemIndex = this._selectedItems.indexOf(activeitem[0]);
                    this._selectedItems.splice(this.model.selectedIndices.indexOf(itemIndex), 1);
                    this.model.selectedIndices.splice(this.model.selectedIndices.indexOf(itemIndex), 1);
                    var unselectData = this._getItemObject(activeitem, null);
                    unselectData["isInteraction"] = false;
                    if (this.model.unselect)
                        this._trigger('unselect', unselectData);
                }
            }
            this._setSelectionValues();
        },
        unselectItemByIndex: function (index) {
            if (this.model.showCheckbox) return false;
            index = parseInt(index);
            var unselectitem = $(this.element.children("li")[index]);
            if (unselectitem.hasClass('e-select')) {
                unselectitem.removeClass('e-active e-select');
                var itemIndex = this._selectedItems.indexOf(unselectitem[0]);
                this._selectedItems.splice(this.model.selectedIndices.indexOf(itemIndex), 1);
                this.model.selectedIndices.splice(this.model.selectedIndices.indexOf(itemIndex), 1);
                var unselectData = this._getItemObject(unselectitem, null);
                unselectData["isInteraction"] = false;
                if (this.model.unselect)
                    this._trigger('unselect', unselectData);
            }
            this._setSelectionValues();
        },
        selectItemByText: function (text) {
            if (!ej.isNullOrUndefined(text))
            this[(this.model.allowMultiSelection ? "selectItemsByIndices" : "selectItemByIndex")](this.getIndexByText(text));
        },
        selectItemByValue: function (value) {
            this[(this.model.allowMultiSelection ? "selectItemsByIndices" : "selectItemByIndex")](this.getIndexByValue(value));
        },
        unselectItemByText: function (text) {
            this[(this.model.allowMultiSelection ? "unselectItemsByIndices" : "unselectItemByIndex")](this.getIndexByText(text));
        },
        unselectItemByValue: function (value) {
            this[(this.model.allowMultiSelection ? "unselectItemsByIndices" : "unselectItemByIndex")](this.getIndexByValue(value));
        },
        getSelectedItems: function () {
            var items = [], proxy = this;
            $(proxy.model.selectedIndices).each(function (index, elementIndex) {
                items.push(proxy.getItemByIndex(elementIndex));
            });
            return items;
        },
        getCheckedItems: function () {
            var items = [], proxy = this;
            $(proxy.model.checkedIndices).each(function (index, elementIndex) {
                items.push(proxy.getItemByIndex(elementIndex));
            });
            return items;
        },
        removeItem: function () {
            return this.removeSelectedItems();
        },
        removeItemByText: function (text) {
            return this.removeItemByIndex(this.getItemByText(text).index);
        },
        hideSelectedItems: function () {
            var items = this.getSelectedItems();
            this._hideOrShowItemsByIndex(items, "hide");
        },
        hideCheckedItems: function () {
            var items = this.getCheckedItems();
            this._hideOrShowItemsByIndex(items, "hide");
        },
        _hideOrShowItemsByIndex: function (items, hideOrShow) {
            if ($.type(items) == "number") {
                if (hideOrShow == "hide")
                    $(this.element.find("li")[items]).hide();
                else
                    $(this.element.find("li")[items]).show();
            }
            else {
                for (var litem = 0; litem < items.length; litem++) {
                    if (hideOrShow == "hide")
                        items[litem].item ? items[litem].item.hide() : $(this.element.find("li")[items[litem]]).hide();
                    else
                        items[litem].item ? items[litem].item.show() : $(this.element.find("li")[items[litem]]).show();
                }
            }
            this._refreshScroller();
        },
        showItemsByIndices: function (items) {
            this._hideOrShowItemsByIndex(items, "show");
        },
        hideItemsByIndices: function (items) {
            this._hideOrShowItemsByIndex(items, "hide");
        },
        _hideOrShowItemsByValue: function (values, hideOrShow) {
            if ($.type(values) == "array") {
                this.element.find("li").each(function () {
                    for (var length = 0; length <= values.length; length++) {
                        if ($(this).text() == values[length])
                            (hideOrShow == "hide") ? $(this).hide() : $(this).show();
                    }
                });
            }
            else {
                this.element.find("li").each(function () {
                    if ($(this).text() == values)
                        (hideOrShow == "hide") ? $(this).hide() : $(this).show();
                });
            }
            this._refreshScroller();
        },
        showItemsByValues: function (value) {
            this._hideOrShowItemsByValue(value, "show");
        },
        hideItemsByValues: function (value) {
            this._hideOrShowItemsByValue(value, "hide");
        },
        showItemByValue: function (value) {
            this._hideOrShowItemsByValue(value, "show");
        },
        hideItemByValue: function (value) {
            this._hideOrShowItemsByValue(value, "hide");
        },
        showItemByIndex: function (item) {
            this._hideOrShowItemsByIndex(item, "show");
        },
        hideItemByIndex: function (item) {
            this._hideOrShowItemsByIndex(item, "hide");
        },
        hide: function () {
            this.listContainer.hide();
        },
        show: function () {
            this.listContainer.show()
        },
        hideAllItems: function () {
            this.element.find("li:visible").hide()
            this._refreshScroller();
        },
        showAllItems: function () {
            this.element.find("li:hidden").show()
            this._refreshScroller();
        },
        _stateMaintained: function (index) {
            var lenth, len, value, j;
            this.model.disableItemsByIndex = [];
            this.model.selectedIndices = [];
            this.model.checkedIndices = [];
            if (this.model.selectedIndex >= index && this.model.selectedIndex != null) {
                if (this.model.selectedIndex == index || $(this.element.children()[index - 1]).hasClass('e-disable'))
                    this.model.selectedIndex = null;
                else if (this.model.selectedIndex != index)
                    this.model.selectedIndex -= 1;
            }
            len = $(index).length;
            if (len > 1) {
                for (i = len; i >= 0; i--)
                    $(this.element.children()[index[i]]).remove();
                lenth = this.element.children().length;
                for (j = 0; j < lenth; j++)
                    if ($(this.element.children()[j]).hasClass('e-disable'))
                        this.model.disableItemsByIndex.push(j);
            }
            else {
                value = index - 1;
                for (value; value >= 0; value--) {
                    if ($(this.element.children()[value]).hasClass('e-disable'))
                        this.model.disableItemsByIndex.push(value);
                    if ($(this.element.children()[value]).hasClass('e-select'))
                        this.model.selectedIndices.push(value);
                    if ($(this.element.children()[value]).find('.listcheckbox').ejCheckBox('isChecked'))
                        this.model.checkedIndices.push(value);
                }
                index = parseInt(index) + 1;
                for (index; index < this._listSize; index++) {
                    if ($(this.element.children()[index]).hasClass('e-disable'))
                        this.model.disableItemsByIndex.push(index - 1);
                    if ($(this.element.children()[index]).hasClass('e-select'))
                        this.model.selectedIndices.push(index - 1);
                    if ($(this.element.children()[index]).find('.listcheckbox').ejCheckBox('isChecked'))
                        this.model.checkedIndices.push(index - 1);
                }
            }
        },
        removeAll: function () {
            if (ej.isNullOrUndefined(this.model.dataSource)) {
                var text = [];
                $(this.element.find("li")).each(function (i, e) {
                    text.push($(this).text());
                    e.remove();
                });
                this._refreshItems();
                return text;
            }
            else if (!(this.model.dataSource instanceof ej.DataManager)) {
                var elements = [], count = $(this.element.find("li")).length;
                for (var i = 0; i < count; i++) {
                    elements.push(this._getRemovedItems([parseInt(0)]));
                }
                return elements;
            }
        },
        removeItemByIndex: function (index) {
            if (ej.isNullOrUndefined(this.model.dataSource)) {
                var text = $(this.element.find("li")[index]).remove().text();
                this._refreshItems();
                return text;
            }
            else if (!(this.model.dataSource instanceof ej.DataManager))
                return this._getRemovedItems([parseInt(index)]);
        },
        removeSelectedItems: function () {
            if (this.model.showCheckbox) return false;
            if (ej.isNullOrUndefined(this.model.dataSource)) {
                var text = this.value();
                $(this.getSelectedItems()).each(function (i, e) {
                    e.item.remove()
                });
                this._refreshItems();
                return text;
            }
            else if (!(this.model.dataSource instanceof ej.DataManager))
                return this._getRemovedItems(this.model.selectedIndices);
        },
        _getRemovedItems: function (index) {
            var removedItems = [];
            this._stateMaintained(index);
            this.value(null);
            this.model.selectedIndices = [];
            this.model.dataSource = this.model.dataSource.filter(function (e, i) {
                if (index.indexOf(i) != -1)
                    removedItems.push(e);
                else
                    return true;
            });
            this.refresh(true);
            return removedItems;
        },
        getIndexByValue: function (value) {
            var index;
            this.element.find("li").each(function () {
                if ($(this).attr("value") == value) {
                    index = $(this).index();
                    return false;
                }
            });
            return index;
        },
        getIndexByText: function (text) {
            var index;
            if (this.model.allowMultiSelection) {
                var text = text.split(",");
                index = [];
            }
            this.element.find("li").each(function () {
                if (typeof text == "object") {
                    for (var j = 0; j < text.length; j++) {
                        if ($(this).text() == text[j]) {
                            index.push($(this).index());
                            if (index.length == text.length) return false;
                        }
                    }
                }
                else if ($(this).text() == text) {
                    index = $(this).index();
                    return false;
                }
            });
            return index;
        },
        getTextByIndex: function (index) {
            return $(this.element.find("li")[index]).text();
        },
        getItemByText: function (text) {
            var proxy = this, obj;
            this.element.find("li").each(function () {
                if ($(this).text() == text) {
                    obj = proxy._getItemObject($(this));
                    return false;
                }
            });
            return obj;
        },
        getItemByIndex: function (index) {
            return this._getItemObject($(this.element.find("li")[index]));
        },
        getListData: function () {
            if (ej.DataManager && this.model.dataSource instanceof ej.DataManager)
                return this.listitems;
            else if (this.model.dataSource)
                return this.model.dataSource;
            else
                return;
        },
        enableItem: function (text) {
            var proxy = this;
            this.element.find("li").each(function () {
                if ($(this).text() == text) {
                    $(this).removeClass("e-disable");
                    if (this.model.showCheckbox) $(this).find(".listcheckbox").ejCheckBox("enable");
                    proxy._disabledItems.splice($(this).index().toString());
                    return false;
                }
            });
        },
        disableItem: function (text) {
            var proxy = this;
            this.element.find("li").each(function () {
                if ($(this).text() == text) {
                    $(this).addClass("e-disable");
                    if (this.model.showCheckbox) $(this).find(".listcheckbox").ejCheckBox("disable");
                    proxy._disabledItems.push($(this).index().toString());
                    return false;
                }
            });
        },
        moveUp: function () {
            var previousItem = this._getItem(this.model.selectedIndex).prev();
            this._moveItem(previousItem, "up");
        },
        moveDown: function () {
            var nextItem = this._getItem(this.model.selectedIndex).next();
            this._moveItem(nextItem, "down");
        },
        _moveItem: function (item, direction) {
            var selectedItem = this._getItem(this.model.selectedIndex), length = this.element.children().length, moveup = (direction == "up") && 0 < this.model.selectedIndex, movedown = (direction == "down") && length - 1 > this.model.selectedIndex;
            this._addListHover();
            this._getItem(this._selectedItem).removeClass("e-hover");
            if (moveup) {
                item.insertAfter(selectedItem);
                this.model.selectedIndex -= 1;
                this._selectedItem -= 1;
            } else if (movedown) {
                item.insertBefore(selectedItem);
                this.model.selectedIndex += 1;
                this._selectedItem += 1;
            } if (moveup || movedown) {
                this.model.selectedIndices = [];
                for (var i = 0; i < length; i++) {
                    if ($(this.element.children()[i]).hasClass('e-select')) this.model.selectedIndices.push(i);
                }
            }
        },

        checkAll: function () {
            if (!this.model.showCheckbox) return false;
            var items = this.element.find("li");
            for (i = 0; i < items.length; i++) {
                if (!($(items[i].firstChild).find('.listcheckbox').ejCheckBox('isChecked')) && !($(items[i].firstChild).hasClass("e-disable"))) {
                    $(items[i].firstChild).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                    this._checkedItems.push(items[i]);
                    this.model.checkedIndices.push(i);
                }
            }
            this.model.uncheckAll = false;
        },
        //Deprecated Method
        unCheckAll: function () { this.uncheckAll(); },
        uncheckAll: function () {
            if (!this.model.showCheckbox) return false;
            var items = this.element.find("li");
            for (i = 0; i < items.length; i++)
                if ($(items[i].firstChild).find('.listcheckbox').ejCheckBox('isChecked'))
                    $(items[i].firstChild).find('.listcheckbox').ejCheckBox('option', 'checked', false);
            this._checkedItems = [];
            this.model.checkedIndices = [];
            this.model.checkAll = false;
        },
        addItem: function (val, index) {
            var index = (!ej.isNullOrUndefined(index) && index <= this.element.find('li').length) ? index : this.element.find('li').length;
            var proxy = this, num = index;
            if (ej.isNullOrUndefined(this.model.dataSource)) {
                if (!(val instanceof Array)) {
                    this.listitem = (this.element.find('li').length ?
                                        ((index - 1 < 0) ? $(this.element.find('li')[0]).before('<li role="option">' + val + '</li>') : $(this.element.find('li')[index - 1]).after('<li role="option">' + val + '</li>'))
                                         : $(this.element).html('<li role="option">' + val + '</li>'));
                    this.listitems = this.element.find('li');
                    this._addItemIndex = index;
                    if (this.model.showCheckbox) {
                        $checkbox = ej.buildTag("input.listcheckbox e-align#popuplist" + (this.listitems.length - 1) + "_" + this._id, "", {}, {
                            type: "checkbox",
                            name: "list" + (this.listitems.length - 1)
                        });
                        $(this.listitems[index]).prepend($checkbox);
                        $($(this.listitems[index]).find(".listcheckbox")).ejCheckBox({
                            change: $.proxy(this._onClickCheckList, this)
                        });
                    }
                    if (this.model.allowDrag || this.model.allowDrop) this._enableDragDrop();
                    this._addItemIndex = null;
                    this._refreshItems();
                }
                else {
                    $(val).each(function (i, e) {
                        proxy.addItem(e, index);
                        index = index + 1;
                    })
                }
            }
            else if (!(this.model.dataSource instanceof ej.DataManager)) {
                if (!(val instanceof Array)) val = [val];
                $(val).each(function (i, e) {
                    proxy.model.dataSource.splice(index, 0, e);
                    index = index + 1;
                })
                this.model.disableItemsByIndex = [];
                this.model.selectedIndices = [];
                this.model.checkedIndices = [];
                if (this.model.selectedIndex >= num)
                    this.model.selectedIndex += 1;
                var value = num - 1;
                for (value; value >= 0; value--) {
                    if ($(this.element.children()[value]).hasClass('e-disable'))
                        this.model.disableItemsByIndex.push(value);
                    if ($(this.element.children()[value]).hasClass('e-select'))
                        this.model.selectedIndices.push(value);
                    if ($(this.element.children()[value]).find('.listcheckbox').ejCheckBox('isChecked'))
                        this.model.checkedIndices.push(value);
                }
                for (num; num < this._listSize; num++) {
                    if ($(this.element.children()[num]).hasClass('e-disable'))
                        this.model.disableItemsByIndex.push(num + 1);
                    if ($(this.element.children()[num]).hasClass('e-select'))
                        this.model.selectedIndices.push(num + 1);
                    if ($(this.element.children()[num]).find('.listcheckbox').ejCheckBox('isChecked'))
                        this.model.checkedIndices.push(num + 1);
                }
                this.refresh(true);
            }
        },
        enableItemByIndex: function (index) {
            if (typeof (index) == "number")
                this.enableItemsByIndices(index.toString());
        },
        disableItemByIndex: function (index) {
            if (typeof (index) == "number")
                this.disableItemsByIndices(index.toString());
        },
        disableItemsByIndices: function (value) {
            if (ej.isNullOrUndefined(value)) return false;
            var selectitems = value.toString().split(',');
            for (var i = 0; i < selectitems.length; i++) {
                if (selectitems.length > 0 && !($.inArray(selectitems[i], this._disabledItems) > -1)) {
                    var disable = $(this.element.children("li")[parseInt(selectitems[i])]).addClass('e-disable');
                    disable.find(".listcheckbox").ejCheckBox("disable");
                    this._disabledItems.push(selectitems[i]);
                }
            }
        },
        enableItemsByIndices: function (value) {
            var selectitems = value.toString().split(','), index;
            for (var i = 0; i < selectitems.length; i++) {
                if (selectitems.length > 0 && ($.inArray(selectitems[i], this._disabledItems) > -1)) {
                    index = $.inArray(selectitems[i], this._disabledItems);
                    var enable = $(this.element.children("li")[parseInt(selectitems[i])]).removeClass('e-disable');
                    enable.find(".listcheckbox").ejCheckBox("enable");
                    this._disabledItems.splice(index, 1);
                }
            }
        },
        _init: function () {
            this._id = this.element[0].id;
            this._isMozilla = ej.browserInfo().name == "mozilla" ? true : false;
            this._cloneElement = this.element.clone();
            this._deprecatedValue()._initialize()._render()._wireEvents();
            this._initValue = this.focused = false;
            this._typeInterval = null;
            this._typingThreshold = 2000;
            //deprecatedFunction
            if (this.model.checkAll)
                this.checkAll();
            if (this.model.uncheckAll)
                this.uncheckAll();
            if (this.model.disableItemsByIndex)
                this.disableItemsByIndices(this.model.disableItemsByIndex.toString());
            if (this.model.enableItemsByIndex)
                this.enableItemsByIndices(this.model.enableItemsByIndex.toString());
            if (this.model.uncheckItemsByIndex)
                this.uncheckItemsByIndices(this.model.uncheckItemsByIndex.toString());
            this._deprecatedValue()._enabled(this.model.enabled);

        },
        _deprecatedValue: function () {
            this.model.itemDrop = (this.model.itemDrop || this.model.itemDropped);
            this.model.change = (this.model.change || this.model.selectIndexChanged);
            this.model.fields.checkBy = this.model.fields.selected || this.model.fields.checkBy;
            this.model.fields.tooltipText = this.model.fields.toolTipText || this.model.fields.tooltipText;
            this.model.fields.groupBy = this.model.fields.category || this.model.fields.groupBy;
            this.model.select = (this.model.select || this.model.selected);
            if (this.model.allowDragAndDrop != undefined)
                this.model.allowDrag = this.model.allowDrop = true;
            this.model.selectedIndex = this.model.selectedIndex != null ? this.model.selectedIndex : this.model.selectedItemIndex;
            this.model.checkedIndices = ((this.model.checkedIndices.length ? this.model.checkedIndices : null) || (this.model.checkItemsByIndex ? this.model.checkItemsByIndex : null) || (this.model.checkedItems.length ? this.model.checkedItems : null) || (this.model.checkedItemlist.length ? this.model.checkedItemlist : []));
            this.model.selectedIndices = ((this.model.selectedIndices.length ? this.model.selectedIndices : null) || (this.model.selectedItems.length ? this.model.selectedItems : null) || (this.model.selectedItemlist.length ? this.model.selectedItemlist : []));
            return this;
        },
        _setModel: function (options) {
            var option, refresh = false;
            for (option in options) {
                switch (option) {
                    case "value":
                        this._setText(ej.util.getVal(options[option]));
                        break;
                    case "dataSource":
                        this.model.selectedIndex = null;
                        this._checkModelDataBinding(options[option]);
                        break;
                    case "query":
                        this._queryCheck(options[option]);
                        break;
                    case "fields":
                        this.model.fields = options[option];
                        this._checkModelDataBinding(this.model.dataSource);
                        break;
                    case "template":
                        this.model.template = options[option];
                        this.refresh(true);
                        break;
                    case "loadDataOnInit":
                        this._loadContent = options[option];
                        this._checkModelDataBinding(this.model.dataSource);
                        break;
                    case "enableRTL":
                        this.model.enableRTL = options[option];
                        (this.model.enableRTL) ? this.listContainer.addClass("e-rtl") : this.listContainer.removeClass("e-rtl");
                        break;
                    case "enabled":
                        this.model.enabled = options[option];
                        this._enabled(options[option]);
                        break;
                    case "height":
                    case "width":
                        this.model[option] = options[option];
                        this._setDimensions();
                        break;
                    case "cssClass":
                        this.model.cssClass = options[option];
                        this.listContainer.addClass(this.model.cssClass);
                        break;
                    case "showCheckbox":
                        this._checkboxHideShow(options[option]); if (options[option]) this._removeListHover();
                        break;
                    case "showRoundedCorner":
                        this._roundedCorner(options[option]);
                        break;
                    case "selectedItemIndex":
                    case "selectedIndex":
                        if (!$(this.listitem[this.model.selectedIndex]).hasClass('e-disable')) {
                            this.selectItemByIndex(options[option]);
                            this.model.selectedIndex = this.model.selectedItemIndex = options[option];
                        }
                        break;
                    case "checkItemsByIndex":
                    case "checkedItemlist":
                    case "checkedItems":
                    case "checkedIndices":
                        this.uncheckAll();
                        this.checkItemsByIndices(options[option].toString());
                        options[option] = this.model[option] = this.model.checkedIndices;
                        break;
                    case "uncheckItemsByIndex":
                        this.uncheckItemsByIndices(options[option].toString());
                        this.model[option] = options[option];
                        break;
                    case "selectedItemlist":
                    case "selectedItems":
                    case "selectedIndices":
                        this.unselectAll();
                        this.selectItemsByIndices(options[option].toString());
                        options[option] = this.model.selectedIndices;
                        break;
                    case "enableItemsByIndex":
                        this.model[option] = options[option];
                        this.enableItemsByIndices(options[option].toString());
                        break;
                    case "disableItemsByIndex":
                        this.model[option] = options[option];
                        this.disableItemsByIndices(options[option].toString());
                        break;
                    case "enableVirtualScrolling":
                        this.model.allowVirtualScrolling = options[option]; refresh = true;
                        break;
                    case "allowDrag":
                    case "allowDrop":
                    case "allowDragAndDrop":
                    case "allowVirtualScrolling":
                    case "virtualScrollMode":
                        this.model[option] = options[option]; refresh = true;
                        break;
                    case "checkAll":
                        this.model[option] = options[option]; if (options[option]) this.checkAll(); else this.uncheckAll();
                        break;
                    case "uncheckAll":
                        this.model[option] = options[option]; if (options[option]) this.uncheckAll(); else this.checkAll();
                        break;
                    case "htmlAttributes":
                        this._addAttr(options[option]);
                        break;
                    case "itemsCount":
                        this.model.itemsCount = options[option];
                        this._setItemsCount()._setDimensions();
                        break;
                    case "allowMultiSelection":
                        this.model.allowMultiSelection = options[option];
                        if (!options[option]) {
                            var index = this.model.selectedIndex;
                            this._removeListHover();
                            ej.isNullOrUndefined(index) ? "" : this.selectItemByIndex(index);
                        };
                        break;
                    case "totalItemsCount":
                        if (!ej.isNullOrUndefined(this.model.dataSource)) {
                            this.model.totalItemsCount = options[option];
                            if (this.model.query)
                                this._queryCheck(this.model.query);
                        }
                        break;
                }
            }
            if (refresh) this._refresh();
        },
        _destroy: function () {
            if (!ej.isNullOrUndefined(this._lilist)) $(this._lilist).ejDraggable("destroy");
            this.element.insertAfter(this.listContainer);
            this.element.find(".e-chkbox-wrap").remove();
            this.listContainer.remove();
            if (!this._isList) this.element.empty();
            $(window).unbind("resize", $.proxy(this._OnWindowResize, this));
			this._ListEventUnbind(this.element.children("li"));
            return this;
        },
		_ListEventUnbind: function (_ListItemsContainer) {
			_ListItemsContainer.unbind("contextmenu", $.proxy(this._OnMouseContext, this));
            _ListItemsContainer.unbind("click", $.proxy(this._OnMouseClick, this));
            _ListItemsContainer.unbind("touchstart mouseenter", $.proxy(this._OnMouseEnter, this));
            _ListItemsContainer.unbind("touchend mouseleave", $.proxy(this._OnMouseLeave, this));
		},
        _refresh: function () {
            this._destroy()._init();
        },
        _finalize: function () {
            if (this.model.selectedIndex != null)
                this.selectItemByIndex(this.model.selectedIndex);
            else if ((this.model.showCheckbox == true) && (this._selectedItems.length > 0))
                this._selectCheckedItem(this._selectedItems);
            if (this.model.checkedIndices != null) this.checkItemsByIndices(this.model.checkedIndices.toString());
            return this;
        },
        _initialize: function () {
            this._isList = this.element.children().length ? true : false;
            this.target = this.element[0];
            this._queryString = null;
            this._disabledItems = [];
            this._itemId = null;
            this._up = this._down = this._ctrlClick = false;
            this.checkedStatus = this._isScrollComplete = false;
            this._incqueryString = "";
            this._activeItem = null;
            this._initValue = true;
            this.model.allowVirtualScrolling = (this.model.allowVirtualScrolling) ? this.model.allowVirtualScrolling : this.model.enableLoadOnDemand;
            this.model.virtualScrollMode = (this.model.enableVirtualScrolling) ? "continuous" : this.model.virtualScrollMode;
            this._selectedItems = [];
            this._checkedItems = [];
            this._loadContent = this.model.loadDataOnInit;
            this._loadInitialRemoteData = true;
            this._skipInitialRemoteData = false;
            if (this.model.enableVirtualScrolling) this.model.allowVirtualScrolling = true;
            this._setItemsCount();
            return this;
        },
        _render: function () {
            this._savedQueries = this.model.query.clone();
            if (this.model.totalItemsCount)
                this._savedQueries.take(this.model.totalItemsCount);
            this._renderContainer()._addAttr(this.model.htmlAttributes);
            if (ej.DataManager && this.model.dataSource instanceof ej.DataManager) {
                if (this.model.actionBegin)
                    this._trigger("actionBegin", {});
                if (this._loadInitialRemoteData)
                    this._initDataSource(this.model.dataSource);
            }
            else
                this._showFullList();
            if (!this.model.dataSource) this._finalize();
            if (this.model.showRoundedCorner)
                this._roundedCorner(true);
            return this;
        },
        _queryCheck: function (value) {
            this._savedQueries = value.clone();
            this.element.empty();
            if (this.model.dataSource)
                this._checkModelDataBinding(this.model.dataSource);
        },
        _checkModelDataBinding: function (source) {
            this.mergeValue = null;
            this.model.dataSource = source;
            if (source != null) {
                if (source.length != 0) {
                    if (ej.DataManager && source instanceof ej.DataManager) this._initDataSource(source);
                    else this._showFullList();
                } else this.element.empty();
            } else this.element.empty();
        },
        _initDataSource: function (source) {
            var proxy = this;
            proxy.listitems = proxy.model.dataSource;
            proxy._updateLoadingClass(true);
            var queryPromise = source.executeQuery(this._getQuery());
            queryPromise.done(function (e) {
                proxy.listitems = e.result;
                proxy._updateLoadingClass()._showFullList()._trigger("actionSuccess", e);
                proxy._finalize();
            }).fail(function (e) {
                proxy.model.dataSource = null;
                proxy._updateLoadingClass(true)._trigger("actionFailure", e);
            }).always(function (e) {
                if (proxy.model.checkAll)
                    proxy.checkAll();
                if (proxy.model.uncheckAll)
                    proxy.uncheckAll();
                proxy._trigger("actionComplete", e);
            });
        },
        _getQuery: function () {
            var queryManager;
            if (ej.isNullOrUndefined(this.model.query)) {
                var column = [],
                    mapper = this.model.fields;
                queryManager = ej.Query();
                for (var col in mapper)
                    if (col !== "tableName") column.push(mapper[col]);
                if (column.length > 0) queryManager.select(column);
                if (!this.model.dataSource.dataSource.url.match(mapper.tableName + "$")) !ej.isNullOrUndefined(mapper.tableName) && queryManager.from(mapper.tableName);
            } else queryManager = this._savedQueries;
            return queryManager;
        },
        _addDragableClass: function () {
            if (this.model.allowDrag || this.model.allowDrop) {
                this.element.css("cursor", "pointer");
                if (this.model.allowDrop) {
                    this.listContainer.addClass("e-droppable");
                    this.listBoxScroller.addClass("e-droppable");
                }
                var proxy = this;
                this.element.children("li").each(function (index) {
                    if (proxy.model.allowDrag) ($(this).addClass("e-draggable"));
                    if (proxy.model.allowDrop) ($(this).addClass("e-droppable"));
                });
            }
            return this;
        },
        _enableDragDrop: function () {
            if (this.model.allowDrag || this.model.allowDrop) this._drag();
        },
        _updateLoadingClass: function (value) {
            this.listContainer[(value ? "addClass" : "removeClass")]("e-load"); return this;
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.listContainer.addClass(value);
                else if (key == "required") proxy.element.attr(key, value);
                else if (key == "disabled" && value == "disabled") proxy._enabled(false);
                else proxy.listContainer.attr(key, value);
            });
        },
        _renderContainer: function () {
            this.listContainer = ej.buildTag("div.e-ddl-popup e-box e-popup e-widget " + this.model.cssClass, "", {
                "visibility": "hidden"
            }, {
                "tabIndex": 0,
                "id": this._id + "_container"
            });
            this.listBoxScroller = ej.buildTag("div");
            this.ultag = ej.buildTag("ul.e-ul", "", {}, {
                "role": "listbox"
            });
            this.element = this.element.addClass("e-ul");
            this.listContainer.append(this.listBoxScroller).insertAfter(this.element);
            this.listBoxScroller.append(this.element);
            this.element.attr('unselectable', 'on').css('user-select', 'none');
            this._hiddenInput = ej.buildTag("input#" + this._id + "_hidden", "", {}, {
                type: "hidden"
            }).insertBefore(this.element);
            this._hiddenInput.attr('name', this._id);
            return this;
        },
        _setMapFields: function () {
            mapper = this.model.fields,
            this.mapFld = {
                _id: null,
                _imageUrl: null,
                _imageAttributes: null,
                _tooltipText: null,
                _spriteCSS: null,
                _text: null,
                _value: null,
                _htmlAttributes: null,
                _selectBy: null,
                _checkBy: null
            };
            this.mapFld._id = (mapper && mapper.id) ? mapper["id"] : "id";
            this.mapFld._imageUrl = (mapper && mapper.imageUrl) ? mapper["imageUrl"] : "imageUrl";
            this.mapFld._tooltipText = (mapper && mapper.tooltipText) ? mapper["tooltipText"] : "tooltipText";
            this.mapFld._imageAttributes = (mapper && mapper.imageAttributes) ? mapper["imageAttributes"] : "imageAttributes";
            this.mapFld._spriteCSS = (mapper && mapper.spriteCssClass) ? mapper["spriteCssClass"] : "spriteCssClass";
            this.mapFld._text = (mapper && mapper.text) ? mapper["text"] : this.listitems[0].text ? "text" : Object.keys(this.listitems[0])[0];
            this.mapFld._value = (mapper && mapper.value) ? mapper["value"] : "value";
            this.mapFld._htmlAttributes = (mapper && mapper.htmlAttributes) ? mapper["htmlAttributes"] : "htmlAttributes";
            this.mapFld._checkBy = (mapper && mapper.checkBy) ? mapper["checkBy"] : "checkBy";
            this.mapFld._selectBy = (mapper && mapper.selectBy) ? mapper["selectBy"] : "selectBy";
            this.mapCateg = (mapper && mapper.groupBy) ? mapper["groupBy"] : ""
        },
        _renderlistContainer: function () {
            this.hold = this.touchhold = false;
            this.item = "";
            this.startime = 0;
            this.listitemheight = 24;
            var list = this.listitems,
                i, ulempty, ulno, litag, _id, _txt, mapper = this.model.fields,
                predecessor;
            this.lastScrollTop = -1;
            this.dummyUl = $();
            if (this.model.enableRTL) this.listContainer.addClass("e-rtl");
            if (this.model.dataSource == null || this.model.dataSource.length < 1) {
                predecessor = this.element.parents().last();
                if (this.model.targetID) this.docbdy = predecessor.find("#" + this.model.targetID);
                else this.docbdy = predecessor.find("#" + this._id);
                this.itemsContainer = this.docbdy;
                this.itemsContainer.children("ol,ul").remove();
                this.items = this.itemsContainer.children('li');
                this.items.children("img").addClass("e-align");
                this.items.children("div").addClass("e-align");
                this.itemsContainer.children("span").addClass("e-ghead");
                this.element.append(this.itemsContainer.children());
            }
            else if (this.model.dataSource != null && typeof list[0] != "object") {
                if (this._loadInitialRemoteData && this.mergeValue && this.model.virtualScrollMode == "continuous" && this.model.totalItemsCount)
                    this._loadlist(this.mergeValue);
                else if (this._loadInitialRemoteData && this.mergeValue && this.model.virtualScrollMode == "normal" && this.model.totalItemsCount) {
                    this.realUllength = 0;
                    this.mergeUl = [];
                    for (i = 0; i < this.mergeValue.length; i++)
                        this.mergeUl.push(ej.buildTag('li', this.mergeValue[i][this.model.fields.text], null, { style: "min-height:20px;" })[0]);
                    this.element.append(this.mergeUl);
                    for (i = 0; i < this.model.totalItemsCount - this.mergeValue.length; i++)
                        this.dummyUl.push(ej.buildTag('li', null, null, { style: "min-height:20px;" })[0]);
                    this.element.append(this.dummyUl);
                    this._refreshScroller();
                }
                else if (this._loadInitialRemoteData && this.mergeValue && !this.model.totalItemsCount)
                    this._initDataSource(this.model.dataSource);
            }
            else {
                this._setMapFields();
                var groupedList, _query;
                _query = this._savedQueries;
                this.listContainer.height(this.model.height);
                this.listitemheight = 24;
                if (this.model.allowVirtualScrolling) {
                    if (this.model.virtualScrollMode == "normal") {
                        this.realUllength = 0;
                        if (this.model.dataSource.length < 0) {
                            query = this._savedQueries.take(parseInt(this.listContainer.height() / this.listitemheight));
                            var proxy = this;
                            if (ej.DataManager && this.model.dataSource instanceof ej.DataManager) {
                                proxy.listitems = proxy.model.dataSource;
                                var queryPromise = this.model.dataSource.executeQuery(query);
                                queryPromise.done(function (e) {
								    proxy._trigger("actionBeforeSuccess", e);
                                    proxy.listitems = e.result;
                                    proxy._trigger("actionSuccess", e);
                                }).fail(function (e) { proxy._trigger("actionFailure", e); })
                                  .always(function (e) { proxy._trigger("actionComplete", e); });
                            }
                        }
                        if (this.mergeValue && this.mergeValue != groupedList && this.mergeValue != undefined) {
                            this.mergeUl = [];
                            for (i = 0; i < this.mergeValue.length; i++)
                                this.mergeUl.push(ej.buildTag('li', this.mergeValue[i][this.model.fields.text], null, { style: "min-height:20px;" })[0]);
                            this.element.append(this.mergeUl);
                        }
                        if (!this.model.totalItemsCount)
                            var originalliLength = this.listitems.length;
                        else
                            var originalliLength = (this.mergeValue) ? this.model.totalItemsCount - this.mergeValue.length : this.model.totalItemsCount;
                        for (i = 0; i < originalliLength; i++)
                            this.dummyUl.push(ej.buildTag('li', null, null, { style: "min-height:20px;" })[0]);
                        this.element.append(this.dummyUl);
                    }
                    this._loadInitialData(_query, list);
                } else {
                    if (this.mapCateg && this.mapCateg != "") {
                        _query = ej.Query().group(this.mapCateg);
                        groupedList = ej.DataManager(list).executeLocal(_query);
                        this.model.dataSource = [];
                        for (i = 0; i < groupedList.length; i++) {
                            this.dummyUl.push(ej.buildTag('span.e-ghead', groupedList[i].key)[0]);
                            this._loadlist(groupedList[i].items);
                            this.model.dataSource = this.model.dataSource.concat(groupedList[i].items);
                        }
                    }
                    else {
                        groupedList = ej.DataManager(list).executeLocal(_query);
                        if (groupedList.length > 0) {
                            if (this.mergeValue && this.mergeValue != groupedList && this.mergeValue != undefined) {
                                this.mergeUl = [];
                                for (i = 0; i < this.mergeValue.length; i++) {
                                    this.mergeUl.push(ej.buildTag('li', this.mergeValue[i][this.model.fields.text], null, { style: "min-height:20px;" })[0]);
                                    groupedList.push(this.mergeValue[i]);
                                }
                            }
                            if (this.model.template != null) {
                                for (i = 0; i < list.length; i++) {
                                    var _dhtmlAttributes = this._getField(list[i], this.mapFld._htmlAttributes);
                                    var _did = this._getField(list[i], this.mapFld._id);
                                    litag = ej.buildTag('li');
                                    if ((_dhtmlAttributes) && (_dhtmlAttributes != "")) litag.attr(_dhtmlAttributes);
                                    if (_did) litag.attr('id', _did);
                                    if (this.model.template) litag.append(this._getTemplatedString(list[i]));
                                    this.dummyUl.push(litag[0]);
                                }
                                this.element.append(this.dummyUl);
                            }
                            else {
                                this.realUllength = 0;
                                this._loadlist(groupedList);
                            }
                        }
                    }
                }
            }
            var proxy = this;
            this._setDimensions();
            this.listContainer.css({ "position": "relative", "height": "" });
            this.listBoxScroller.css({ "height": "", "width": "" });
            this.listContainer.ejScroller({
                height: this.listContainer.height(),
                width: 0,
                scrollerSize: 20,
                scroll: function (e) {
                    if ((e.source == "key" || e.source == "wheel" || (e.source != "button" && e.source != "thumb" && e.source != "custom")) && proxy.model != null) proxy._onScroll(e);
                },
                thumbEnd: function (e) {
                    //Please use the first code for debugging purpose
                    //if (proxy.model != null && e.originalEvent.target.tagName.toUpperCase() != "LI" && e.originalEvent.target.tagName.toUpperCase() != "HTML")
                    if (proxy.model != null)
                        proxy._onScroll(e);
                },
				scrollEnd: function (e) {
					if( e.scrollData.source == "button" && proxy.model != null) proxy._onScroll(e);
				}
            });
            this.scrollerObj = this.listContainer.ejScroller("instance");
            this._setDimensions();
            this.listContainer.css({ 'display': 'none', 'visibility': 'visible' });
            this._checkboxHideShow(this.model.showCheckbox)._checkitems()._showResult();
            if (this.model.totalItemsCount)
                this._setTotalItemsCount();
        },
        _loadInitialData: function (query, list) {
            var _query = query.clone();
            this.realUllength = 0;
            if ((ej.DataManager && this.model.dataSource instanceof ej.DataManager))
                _query = _query.range(0, parseInt(this.listContainer.height() / this.listitemheight));
            else
                _query = _query.range(0, this.listitems.length);
            groupedList = ej.DataManager(list).executeLocal(_query);
            if (this.mergeValue && this.mergeValue != groupedList && this.mergeValue != undefined && this.model.virtualScrollMode == "continuous") {
                this.mergeUl = [];
                for (i = 0; i < this.mergeValue.length; i++)
                    this.mergeUl.push(ej.buildTag('li', this.mergeValue[i][this.model.fields.text], null, { style: "min-height:20px;" })[0]);
                this.element.append(this.mergeUl);
            }
            if (!this.mergeValue || (this.mergeValue && this._loadInitialRemoteData))
                this._loadlist(groupedList);
        },
        _loadlist: function (sublist) {
            if (this.element != null) {
                var selectionArray = [];
                for (var j = 0; j < sublist.length; j++) {
                    var _did = this._getField(sublist[j], this.mapFld._id);
                    var _dimageUrl = this._getField(sublist[j], this.mapFld._imageUrl);
                    var _dimageAttributes = this._getField(sublist[j], this.mapFld._imageAttributes);
                    var _dspriteCss = this._getField(sublist[j], this.mapFld._spriteCSS);
                    var _dtext = this._getField(sublist[j], this.mapFld._text);
                    var _dvalue = this._getField(sublist[j], this.mapFld._value);
                    var _dhtmlAttributes = this._getField(sublist[j], this.mapFld._htmlAttributes);
                    var _dselectBy = this._getField(sublist[j], this.mapFld._selectBy);
                    var _dcheckBy = this._getField(sublist[j], this.mapFld._checkBy);
                    var _dtooltipText = this._getField(sublist[j], this.mapFld._tooltipText);
                    var k = (this.model.virtualScrollMode == "continuous" && this.mergeValue) ? this.realUllength + this.mergeValue.length : this.realUllength;
                    if ((_dvalue) && (_dvalue != "")) litag = ej.buildTag('li', "", "", {
                        value: _dvalue, style: "min-height:20px;"
                    });
                    else litag = ej.buildTag('li', null, null, { style: "min-height:20px;" }); if (_did) litag.attr('id', _did);
                    if ((_dimageUrl) && (_dimageUrl != "")) {
                        imgtag = ej.buildTag('img.e-align', '', {}, {
                            'src': _dimageUrl,
                            'alt': _dtext
                        });
                        if ((_dimageAttributes) && (_dimageAttributes != "")) imgtag.attr(_dimageAttributes);
                        litag.append(imgtag);
                    }
                    if ((_dspriteCss) && (_dspriteCss != "")) {
                        divtag = ej.buildTag('div.e-align ' + _dspriteCss + ' sprite-image');
                        litag.append(divtag);
                    }
                    if ((_dtext) && (_dtext != "")) litag.append(_dtext);
                    if ((_dhtmlAttributes) && (_dhtmlAttributes != "")) litag.attr(_dhtmlAttributes);
                    if ((_dtooltipText) && (_dtooltipText != "")) litag.attr('title', _dtooltipText);
                    if (_dcheckBy || this.model.checkAll) litag.addClass("checkItem");
                    if (_dselectBy || this.model.selectAll) litag.addClass("selectItem");
                    if (this.element.children()[k] != null && this.model.allowVirtualScrolling && $(this.element.children()[k]).text() == "") {
                        $(this.element.children()[k]).replaceWith(litag[0]);
                    } else if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "normal")
                        ($(this.dummyUl[k])).text($(litag[0]).text());
                    else
                        this.dummyUl.push(litag[0]);
                    this.realUllength += 1;
                }
                if (!this.model.allowVirtualScrolling) this.element.children().remove();
                if (this.element.children()[k] == null && (!this.model.allowVirtualScrolling || this.model.virtualScrollMode == ej.VirtualScrollMode.Continuous) && this._loadContent)
                    this.element.append(this.dummyUl);
                var listItems = this.element.find("li");
                if (this.model.showCheckbox && this.model.checkedIndices) {
                    for (var i = 0; i < listItems.length; i++)
                        if (this.model.checkedIndices.indexOf(i) != -1)
                            $(listItems[i]).addClass("checkItem");
                }
                else if (!this.model.showCheckbox) {
					if(this.value()!="") this.selectItemByText(this.value());
                    for (var i = 0; i < listItems.length; i++)
                        if (this.model.selectedIndices.indexOf(i) != -1 || this.model.selectedIndex == i)
                            $(listItems[i]).addClass("selectItem");
                }
                this.element.find('.selectItem').each(function (i, e) {
                    selectionArray.push($(e).index());
                });
                var proxy = this;
                if (!proxy.model.showCheckbox)
                    proxy._selectListItems();
                this.element.find('.checkItem').each(function (i, e) {
                    proxy.model.checkedIndices.push($(e).index());
                });
                if (selectionArray.length)
                    this.model.allowMultiSelection ? this.model.selectedIndices = selectionArray : this.model.selectedIndex = selectionArray[0];
                if (this.model.checkedIndices)
                    this.model.checkedIndices = $.grep(proxy.model.checkedIndices, function (el, index) { return index == $.inArray(el, proxy.model.checkedIndices); });
                else if (this.model.selectedIndices)
                    this.model.selectedIndices = $.grep(proxy.model.selectedIndices, function (el, index) { return index == $.inArray(el, proxy.model.selectedIndices); });
                this._loadContent = true;
            }
            return this;
        },
        _applySelection: function () {
            if (!(this.model.fields.checkBy || this.model.fields.selectBy)) return false;
            if (this.model.showCheckbox) {
                this.uncheckAll();
                this.checkItemsByIndices(this.model.checkedIndices);
            }
            else {
                if (this.model.allowMultiSelection)
                    this.selectItemsByIndices(this.model.selectedIndices);
                else {
                    this.unselectAll();
                    this.selectItemByIndex(this.model.selectedIndex);
                }
            }
        },
        _getField: function (obj, fieldName) {
            return ej.pvt.getObject(fieldName, obj);
        },
        _getTemplatedString: function (list) {
            var str = this.model.template,
                start = str.indexOf("${"),
                end = str.indexOf("}");
            while (start != -1 && end != -1) {
                var content = str.substring(start, end + 1);
                var field = content.replace("${", "").replace("}", "");
                str = str.replace(content, this._getField(list, field));
                start = str.indexOf("${"), end = str.indexOf("}");
            }
            return str;
        },
        _checkboxHideShow: function (value) {
            this.model.showCheckbox = value;
            (value) ? this._createCheckbox() : this._removeCheckbox();
            return this;
        },
        _createCheckbox: function () {
            var i, _extchk, chklist, me = this;
            this._listitems = this.listContainer.find("ol,ul").children("li");
            chklist = this._listitems.find('input[type=checkbox]');
            for (i = 0; i < this._listitems.length; i++) {
                if ($(this._listitems[i]).text() != "") {
                    $checkbox = ej.buildTag("input.listcheckbox e-align#popuplist" + i + "_" + this._id, "", {}, {
                        type: "checkbox",
                        name: "list" + i
                    });
                    if (!$(this._listitems[i]).find('input[type=checkbox]').length)
                        $(this._listitems[i]).prepend($checkbox);
                }
            }
            this.listContainer.find(".listcheckbox").ejCheckBox({
                cssClass: this.model.cssClass,
                change: $.proxy(this._onClickCheckList, this)
            });
            for (i = 0; i < this._listitems.length; i++) {
                var checkbox = $(this._listitems[i]).find(".listcheckbox");
                if ($(this._listitems[i]).hasClass('e-disable')) checkbox.ejCheckBox('disable');
                else if ( $(this._listitems[i]).hasClass('checkItem') && !checkbox.ejCheckBox('isChecked')) {                    
                    checkbox.ejCheckBox({
                        "checked": true
                    });
                    this._activeItem = i;
                    this.checkedStatus = true;
                    var checkData = this._getItemObject($(this._listitems[i]), null);
                    checkData["isInteraction"] = true;
                    if (!this._initValue) this._trigger('checkChange', checkData);
                    $(this._listitems[i]).removeClass('checkItem');
                }
            }
            for (i = 0; i < this.model.selectedIndices.length; i++) {
                this.checkItemsByIndices(this.model.selectedIndices);
            }
        },
        _removeCheckbox: function () {
            var i, checkbox;
            this.listitem = this.listContainer.find("ol,ul").children("li");
            checkbox = this.listitem.find('.listcheckbox');
            if (checkbox.length > 0) {
                this.listitem.find('.listcheckbox').ejCheckBox('destroy');
                this.listitem.find('input[type=checkbox]').remove();
                if (this.model.allowMultiSelection) {
                    for (i = 0; i < this.model.checkedIndices.length; i++) {
                        this.selectItemsByIndices(this.model.checkedIndices);
                    }
                } else this.selectItemByIndex(this.model.checkedIndices[0]);
                this._checkedItems = this.model.checkedIndices = [];
            }
        },
        _selectCheckedItem: function (chkitems) {
            if (chkitems.length > 0)
                for (i = 0; i < chkitems.length; i++)
                    this._selectedItems.push(chkitems[i]);
        },
        _refreshScroller: function () {
            if (this.model.virtualScrollMode == "continuous") {
                this.listContainer.find(".e-content, .e-vhandle,.e-vhandle div").removeAttr("style");
                this.listContainer.css({ "display": "block" });
                if (this.scrollerObj) {
                    this.scrollerObj.model.height = this.listContainer.height();
                    this.scrollerObj.refresh();
                    this.scrollerObj.option("scrollTop", 0);
                }
            } else {
                this.listContainer.find(".e-vhandle div").removeAttr("style");
                var listboxcontent = this.listBoxScroller.height();
                this.listContainer.css({ "display": "block" });
                if (this.scrollerObj) {
                    this.scrollerObj.model.height = this.listContainer.css("height");
                    this.scrollerObj.refresh();
                }
                this.listBoxScroller.css("height", "100%");
            }
            if (!this.model.enabled) {
                if (this.scrollerObj) this.scrollerObj.disable();
            }
            this.listContainer.css("height", this.model.height);
        },
        _setDimensions: function () {
            this.listContainer.css({ "width": this.model.width, "height": this.model.height });
            this._refreshScroller();
            return this;
        },
        _setItemsCount: function () {
            if (this.model.itemsCount && this.model.itemsCount != 0 && this.model.height == "auto")
                this.model.height = this.model.itemsCount * 30;
            else
                this.model.height = (this.model.height == "auto") ? "220" : this.model.height;
            return this;
        },
        _setTotalItemsCount: function () {
            if (this.model.virtualScrollMode != "continuous") {
                this.element.height(this.element.find("li").outerHeight() * this.model.totalItemsCount);
                this.scrollerObj.refresh();
            }
        },

        _refreshContainer: function () {
            this.listContainer.css({ "position": "relative" });
            this._setDimensions()._roundedCorner()._refreshScroller();
        },
        _drag: function () {
            var proxy = this,
                pre = false,
                _clonedElement = null,
                dragContainment = null;
            this._listitem = this.element.parent();
            this._lilist = this._addItemIndex ? $($(this._listitem).find("li")[this._addItemIndex]) : $(this._listitem).find("li");
            this._lilist.not(".e-js").ejDraggable({
                dragArea: dragContainment,
                clone: true,
                dragStart: function (args) {
                    if (!$(args.element.closest('.e-ddl-popup.e-js')).hasClass('e-disable') && !args.element.hasClass('e-disable')) {
                        var draggedobj = $("#" + this.element.parent()[0].id).data("ejListBox");
                        draggedobj._refreshItems();
                        var dragEle = proxy.getSelectedItems();
                        if (dragEle.length > 1 ? proxy._onDragStarts(dragEle, args.target) : proxy._onDragStarts([proxy._getItemObject(args.element, args)], args.target)) {
                            args.cancel = true;
                            _clonedElement && _clonedElement.remove();
                            return false;
                        }
                    } else {
                        _clonedElement && _clonedElement.remove();
                        return false;
                    }
                },
                drag: function (args) {
                    var target = args.target;
                    var dragEle = proxy.getSelectedItems();
                    if (dragEle.length > 1 ? proxy._onDrag(dragEle, target) : proxy._onDrag([proxy._getItemObject(args.element, args)], target)) return false;
                    if ($(target).hasClass('e-droppable') || $(target).parent().hasClass('e-droppable'))
                        $(target).addClass("allowDrop");
                },
                dragStop: function (args) {
                    if (!args.element.dropped)
                        _clonedElement && _clonedElement.remove();
                    var target = args.target, targetObj = proxy;
                    var position = pre ? "Before" : "After";
                    var dragEle = proxy.getSelectedItems();
                    if (dragEle.length > 1 ? proxy._onDragStop(dragEle, target) : proxy._onDragStop([proxy._getItemObject(args.element, args)], target)) return false;
                    $(args.element).removeClass("e-active");
                    if (target.nodeName == 'UL') target = $(target).children()[0];
                    if ($(target).closest('li').length) target = $(args.target).closest('li')[0];
                    else if (target.nodeName != 'LI') target = $(target).closest('.e-ddl-popup.e-droppable')[0];
                    if (target && target.nodeName == 'LI' && $(target).hasClass('e-droppable') && $(target).closest('.e-ddl-popup.e-droppable').length) proxy._dropItem(target, args.element, pre, args.event);
                    else if ($(target).hasClass('e-droppable') && $(target).closest('.e-ddl-popup.e-droppable').length) proxy._dropItemContainer(target, args.element, args.event);
                    $(".allowDrop").removeClass("allowDrop");
                    if (args.target != proxy.element[0] && (args.element.parent().length && $(args.element.parent()[0]).data().ejWidgets[0] == "ejListBox")) {
                        proxy = $("#" + args.element.parent()[0].id).data($(args.element.parent()[0]).data().ejWidgets[0]);
                        if (dragEle.length > 1 ? proxy._onDropped(dragEle, target) : proxy._onDropped([proxy._getItemObject(args.element), args], args.target)) return false;
                    }
                },
                helper: function (event, ui) {
                    if (!ej.isNullOrUndefined(event.element) && !$(event.element.closest('.e-ddl-popup.e-js')).hasClass('e-disable') && $(event.element).hasClass('e-draggable')) {
                        proxy = $(event.element).closest('.e-listbox.e-js').data('ejListBox');
                        proxy._tempTarget = $(event.element).text();
                        if (proxy) {
                            _clonedElement = $(event.sender.target).clone().addClass("dragClone dragClonelist");
                            _clonedElement.css({ "width": proxy.element.width(), "padding": "5px 5px 5px 0.857em", "list-style": "none", "text-align": "left", "opacity": "1" });
                            return _clonedElement.appendTo($("body"));
                        }
                    }
                }
            });
        },
        _dropItem: function (target, element, pre, event) {
            element.addClass("e-droppable");
            var targetid = $(target).closest('.e-ddl-popup.e-droppable')[0].id.replace('_container', '');
            var dataIndex = [], dataObj = [];
            var droppedobj = $("#" + targetid).data("ejListBox");
            var preventDrop = (droppedobj.model.showCheckbox ? !this.model.showCheckbox : this.model.showCheckbox);
            if (preventDrop) return;
            var data = this._getDropObject(target, element, event);
            dataIndex = data.dataIndex;
            dataObj = data.dataObj;
            pre ? $(li).insertBefore(target) : $(li).insertAfter(target);
            this._refreshItems();
            if (dataObj && this.model.dataSource)
                this._dropDataSource(droppedobj, dataIndex, dataObj, li.index());
            droppedobj._refreshItems();
        },
        _dropItemContainer: function (target, element, event) {
            element.addClass("e-droppable");
            var targetid = $(target)[0].id.replace('_container', '');
            var droppedobj = $("#" + targetid).data("ejListBox");
            var preventDrop = (droppedobj.model.showCheckbox ? !this.model.showCheckbox : this.model.showCheckbox);
            if (preventDrop) return;
            var dataIndex = [], dataObj = [];
            var data = this._getDropObject(target, element, event);
            dataIndex = data.dataIndex;
            dataObj = data.dataObj;
            li.insertAfter($($(target).find('li')).last());
            $(target).find('ul').append(li);
            this._refreshItems();
            if (dataObj && this.model.dataSource)
                this._dropDataSource(droppedobj, dataIndex, dataObj, droppedobj.model.dataSource ? droppedobj.model.dataSource.length : 0);
            if (!droppedobj.model.allowDrag)
                $(li).ejDraggable("instance")._destroy();
            droppedobj._refreshItems();
        },
        _dropDataSource: function (droppedobj, dataIndex, dataObj, droppedIndex) {
            var preventDropData = ej.DataManager && this.model.dataSource instanceof ej.DataManager;
            if (preventDropData) return;
            if (dataIndex instanceof Array) {
                var proxy = this;
                $.each(dataObj, function (index) {
                    indx = proxy.model.dataSource.indexOf(dataObj[index]);
                    proxy.model.dataSource.splice(indx, 1);
                });
            }
            else
                this.model.dataSource.splice(dataIndex, 1);
            if (droppedobj.model.dataSource instanceof Array) {
                droppedobj.model.dataSource.splice.apply(droppedobj.model.dataSource, [droppedIndex, 0].concat(dataObj));
            }
            else {
                droppedobj.model.dataSource = dataObj;
            }
        },
        _getDropObject: function (target, element, event) {
            var dataIndex = [], dataObj = [];
            if (this.model.allowMultiSelection) {
                li = $(element).parent().find(".e-select").removeClass("e-select e-hover");
                if (!li.length)
                    li = element.removeClass("e-select e-hover");
            }
            else
                li = element.removeClass("e-select e-hover");

            if (li.length) {
                proxy = this;
                $.each(li, function (ele) {
                    dataIndex.push($(this).index());
                    dataObj.push((proxy.model.dataSource) ? proxy.model.dataSource[$(this).index()] : null);
                });
            }
            else {
                dataIndex = li.index();
                dataObj = (this.model.dataSource) ? this.model.dataSource[dataIndex] : null;
            }
            return { "dataIndex": dataIndex, "dataObj": dataObj };
        },
        _showResult: function () {
            var proxy = this;
            this._refreshContainer();
            this.element.attr({
                "aria-expanded": true
            });
            var _ListItemsContainer = this.element.children("li");
            this._listSize = _ListItemsContainer.size();
			this._ListEventUnbind(_ListItemsContainer);
            _ListItemsContainer.bind("touchstart mouseenter", $.proxy(this._OnMouseEnter, this));
            _ListItemsContainer.bind("touchend mouseleave", $.proxy(this._OnMouseLeave, this));
            _ListItemsContainer.bind("click", $.proxy(this._OnMouseClick, this));
            _ListItemsContainer.bind("contextmenu", $.proxy(this._OnMouseContext, this));            
            if (proxy.model.showCheckbox) proxy.element.find(".listcheckbox").ejCheckBox({ enabled: proxy.model.enabled });
            return this;
        },
        _OnWindowResize: function (e) {
            this._refreshContainer();
            this.listContainer.css("display", "block");
        },
        refresh: function (value) {
		    if (!ej.isNullOrUndefined(this.model.query)) this._savedQueries = this.model.query; 
            if (value || ej.isNullOrUndefined(value)) {
                if (this.model.template)
                    this.element.empty();
                this._checkModelDataBinding(this.model.dataSource);
            }
            else {
                this.listContainer.css({ "height": this.model.height, "width": this.model.width });
                this._refreshScroller();
            }
        },
        _removeListHover: function () {
            this._selectedItems = [];
            this.model.selectedIndices = [];
            this.model.selectedIndex = null;
            this.element.children("li").removeClass("e-hover e-select selectItem");
            return this;
        },
        _addListHover: function () {
            this._activeItem = this._selectedItem;
            var activeItem = this._getItem(this._selectedItem);
            activeItem.addClass("e-select e-hover");
            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop() });
            activeItem.focus();
            this._OnListSelect(this.prevselectedItem, this._selectedItem);
        },
        _calcScrollTop: function (value) {
            var ulH = this.element.outerHeight(),
                li = this.element.find("li"),
                liH = 0,
                index, top, i;
            index = value ? value : this.element.find("li.e-select").index();
            for (i = 0; i < index; i++)
                liH += li.eq(i).outerHeight();
            top = liH - ((this.listContainer.outerHeight() - li.eq(index).outerHeight()) / 2);
            return top;
        },
        _refreshItems: function () {
            this.listBoxScroller.append(this.element);
            this.listContainer.append(this.listBoxScroller);
            this._refreshContainer();
            this._showResult();
            this._setSelectionValues();
            this._setDisableValues();
        },
        _selectedIndices: function () {
            var selectItem;
            this.element.children("li").each(function (index) {
                if ($(this).hasClass("e-select")) {
                    selectItem = index;
                    return false
                }
            });
            this._selectedItem = selectItem;
            return selectItem;
        },
        _addSelectedItem: function (e) {
            if ((!$.isArray(this.model.disableItemsByIndex) && this.model.disableItemsByIndex != null) || ($.isArray(this.model.disableItemsByIndex) && this.model.disableItemsByIndex.length > 0)) {
                if (e.keyCode == 40 || e.keyCode == 39) this._disableItemSelectDown();
                else this._disableItemSelectUp();
                this._selectedItem = this._activeItem
            }
            var activeItem = this._getItem(this._selectedItem);
            this._selectedItems.push(activeItem)
        },
        _getItem: function (val) {
            return $(this.element.children("li")[val])
        },
        _getItemObject: function (item, evt) {
            return {
                item: item,
                index: item.index(),
                text: item.text(),
                value: item.attr("value") ? item.attr("value") : item.text(),
                isEnabled: !item.hasClass("e-disable"),
                isSelected: item.hasClass("e-select"),
                isChecked: item.find('.e-chk-image').hasClass('e-checkmark'),
                data: this.model.dataSource ? this.getListData()[item.index()] : null,
                event: evt ? evt : null
            };
        },
        _roundedCorner: function (val) {
            this.listContainer[(val ? "addClass" : "removeClass")]("e-corner-all");
            return this;
        },
        _enabled: function (boolean) {
            boolean ? this.enable() : this.disable();
            return this;
        },
        _showFullList: function () {
            if (this.model.dataSource != null) {
                if (!(ej.DataManager && this.model.dataSource instanceof ej.DataManager))
                    this.listitems = this.model.dataSource;
                if (this._savedQueries.queries.length && !(ej.DataManager && this.model.dataSource instanceof ej.DataManager))
                    this.listitems = ej.DataManager(this.model.dataSource).executeLocal(this._savedQueries);
            }
            this._renderlistContainer();
            if (!(this.model.dataSource instanceof ej.DataManager)) this._trigger("actionComplete");
            this._addDragableClass()._enableDragDrop();
            this._disabledItems = [];
            this.disableItemsByIndices(this.model.disableItemsByIndex);
            this.model.selectedIndex && this.selectItemByIndex(this.model.selectedIndex);
            this.selectItemsByIndices(this.model.selectedIndices);
            this.checkItemsByIndices(this.model.checkedIndices);
            return this;
        },
        _cascadeAction: function () {
            if (this.model.cascadeTo) {
                this._currentValue = this._getField(this.listitems[this._activeItem], this.mapFld._value);
                this.selectDropObj = $('#' + this.model.cascadeTo).ejListBox('instance');
                if (ej.isNullOrUndefined(this._dSource))
                    this._dSource = this.selectDropObj.model.dataSource;
                this._performJsonDataInit();
            }
        },
        _performJsonDataInit: function () {
            this._changedSource = ej.DataManager(this._dSource).executeLocal(ej.Query().where(this.mapFld._value, "==", this._currentValue));
            this.selectDropObj.setModel({
                dataSource: this._changedSource,
                enable: true,
                value: "",
                selectedIndex: -1                
            })
        },
        _OnMouseContext: function (e) {
            e.preventDefault();
            return false
        },
        _OnMouseEnter: function (e) {
            this.startime = 0;
            this.item = "";
            if (e.type == "touchstart") {
                this.item = $(e.target).text();
                this.startime = new Date().getTime()
            }
            if (this.model.enabled) {
                var targetEle;
                this.element.children("li").removeClass("e-hover");
                if ($(e.target).is("li")) $(e.target).addClass("e-hover");
                if ($(e.target).hasClass("e-disable")) $(e.target).removeClass('e-hover');
                else if (e.target.tagName != "li") {
                    targetEle = $(e.target).parents("li");
                    $(targetEle).addClass("e-hover")
                }
                var activeItem, selectItem = 0;
                this.element.children("li").each(function (index) {
                    if ($(this).hasClass("e-hover")) {
                        activeItem = index;
                        return false
                    }
                });
                this._activeItem = activeItem
            }
        },
        _OnMouseLeave: function (e) {
            this.element.children("li").removeClass("e-hover");
            this.endtime = new Date().getTime();
            if ((((this.endtime - this.startime) / 200) > 2))
                if ((this.item == $(e.target).text())) this.hold = (((this.endtime - this.startime) / 200) > 2) ? !this.hold : false;
        },
        _OnMouseClick: function (e) {
            if (e.which == 3)
                this.hold = true;
            this.endtime = new Date().getTime();
            if ((((this.endtime - this.startime) / 200) > 2))
                if ((!this.model.template && this.item == $(e.target).text()) && (!this.hold))
                    this.hold = (((this.endtime - this.startime) / 200) > 2);
            if (this.model.enabled && this._activeItem != undefined) {
				if(this.model.allowMultiSelection && (!e.shiftKey || isNaN(this.prevselectedItem))) this.prevselectedItem = this._activeItem;
                if (!this.model.showCheckbox) {
                    var activeitem = $(this.element.children("li")[this._activeItem]);
                    if (!this.model.allowMultiSelection || (!(e.ctrlKey || this.touchhold || this.hold) && !e.shiftKey))
                        this._removeListHover();
                    this.element.children("li").removeClass('e-hover');
                    if (!activeitem.hasClass('e-select') ||(e.shiftKey && this.model.allowMultiSelection)) {
                        activeitem.addClass('e-select');
                        this._selectedItems.push(activeitem);
                        this.model.selectedIndices.push(this._activeItem);
                        if (e.shiftKey && (this.model.allowMultiSelection)) {
                            if (!e.ctrlKey) this._removeListHover();
                            var initial, last;
                            if (this.prevselectedItem < this._activeItem)
                                initial = this.prevselectedItem, last = this._activeItem;
                            else
                                initial = this._activeItem, last = this.prevselectedItem;
                            this._activeItemLoop(initial,last);
                        }
                    } else {
                        activeitem.removeClass('e-select');
                        this._selectedItems.splice(this.model.selectedIndices.indexOf(this._activeItem), 1);
                        this.model.selectedIndices.splice(this.model.selectedIndices.indexOf(this._activeItem), 1);
                    }
                    this._selectedItem = this._selectedIndices();
                    this.model.selectedIndex = this._activeItem;
                    this._cascadeAction();
                    var selecteditem = $(this.element.children("li")[this._selectedItem]);
                    if ($(selecteditem).text() != "") {
                        this.element.val($(selecteditem).text());
                        this.element.attr({
                            "value": this.element.val()
                        });
                    }
                    this.model.selectedText = activeitem.text();
                    this._selectedData = this._getItemObject($(selecteditem), e);
                    this._selectedData["isInteraction"] = true;
                    if (this._prevSelectedData && (this._selectedData.text != this._prevSelectedData.text))
                        this._trigger("unselect", this._prevSelectedData)
                    this._trigger("select", this._selectedData);
                    this._prevSelectedData = this._selectedData;
                    this._lastEleSelect = this._activeItem;
                    if (this._selectedItems && this._selectedItems.length != 1)
                        this._ctrlClick = true;
                } else {
                    if (($(e.currentTarget).is("li")) && ($(e.target).is("li"))) {
                        if ($(e.currentTarget.firstChild).find('.listcheckbox').ejCheckBox('isChecked')) {
                            $(e.currentTarget.firstChild).find('.listcheckbox').ejCheckBox('option', 'checked', false);
                            var index = this.model.checkedIndices.indexOf($(e.currentTarget).index());
                            this._checkedItems.splice(index, 1);
                            this.model.checkedIndices.splice(index, 1);
                            this.checkedStatus = false;
                        } else {
                            $(e.currentTarget.firstChild).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                            this._checkedItems.push(this._activeItem);
                            this.model.checkedIndices.push($(e.currentTarget).index());
                            this.checkedStatus = true;
                        }
                    }
                    else if (($(e.currentTarget).is("li")) && ($(e.target).is("span"))) {
                        if ($(e.currentTarget.firstChild).find('.listcheckbox').ejCheckBox('isChecked')) {
                            this._checkedItems.push(this._activeItem);
                            this.model.checkedIndices.push($(e.currentTarget).index());
                            this.checkedStatus = true;
                        }
                        else {
                            var index = this.model.checkedIndices.indexOf($(e.currentTarget).index());
                            this._checkedItems.splice(index, 1);
                            this.model.checkedIndices.splice(index, 1);
                            this.checkedStatus = false;
                        }
                    }
                    else
                        return false;
                    this.selectedTextValue = $(e.currentTarget).text();
                    if (!this.element.hasClass("e-disable") && $(e.target).is("li")) {
                        var args = {
                            status: this.model.enabled,
                            isChecked: this.checkedStatus,
                            selectedTextValue: this.selectedTextValue
                        };
                        var checkData = this._getItemObject($(e.target), e);
                        checkData["isInteraction"] = true;
                        this._trigger("checkChange", checkData);
                    }
                    this._lastEleSelect = $(e.currentTarget).index();
                }
                this._setSelectionValues()._OnListSelect(this.prevselectedItem, this._activeItem);
            }
            if (e.target.nodeName != "INPUT")
                this.listContainer.focus();
        },
		_activeItemLoop: function (initial , last) {
			if(this.model.showCheckbox){
				this.element.find('.listcheckbox').ejCheckBox('option', 'checked', false);
				this._checkedItems = [];
                this.model.checkedIndices = [];
			}
			for (var i = initial; i <= last; i++) {
				if(this.model.showCheckbox) {
					this.element.find('.listcheckbox').eq(i).ejCheckBox('option', 'checked', true);
                    this._checkedItems.push(this._activeItem);
                    this.model.checkedIndices.push(i);
                    this.checkedStatus = true;
                }
				else {
					activeitem = $(this.element.children("li")[i]);
                if (!activeitem.hasClass('e-disable')) {
                if (!activeitem.hasClass('e-select'))
                    activeitem.addClass('e-select');
                this._selectedItems.push(activeitem);
                this.model.selectedIndices.push(this._activeItem);
				}
				}
            }
		},
        _setSelectionValues: function () {
            var selectionArray = [];
            var oldSelectedIndices = this.model.selectedIndices;
            var oldCheckedIndices = this.model.checkedIndices;
            this.model.selectedIndices = [];
            this.model.checkedIndices = [];
            var proxy = this;
            if (!this.model.showCheckbox) {
                if (this._activeItem) this.model.selectedIndex = this._activeItem;
                var liItem = this.element.children("li");
                this.element.children("li.e-select").each(function (index, ele) {
                    selectionArray.push($(ele).attr("value") ? $(ele).attr("value") : $(ele).text());
                    proxy.model.selectedIndices.push(liItem.index(ele));
                });
            }
            else {
                this.element.find("li .listcheckbox:checked").closest('li').each(function (index, ele) {
                    selectionArray.push($(ele).attr("value") ? $(ele).attr("value") : $(ele).text());
                    proxy.model.checkedIndices.push($(ele).index());
                });
            }
            if (ej.DataManager && ej.DataManager && this.model.dataSource instanceof ej.DataManager && this.model.allowVirtualScrolling) {
                if (this.model.showCheckbox) {
                    for (var i = 0; i < oldCheckedIndices.length; i++) {
                        if (this.model.checkedIndices.indexOf(oldCheckedIndices[i]) == -1)
                            this.model.checkedIndices.push(oldCheckedIndices[i]);
                    }
                }
                else {
                    for (var i = 0; i < oldSelectedIndices.length; i++) {
                        if (this.model.selectedIndices.indexOf(oldSelectedIndices[i]) == -1)
                            this.model.selectedIndices.push(oldSelectedIndices[i]);
                    }
                }
            }
            this.model.selectedItemIndex = this.model.selectedIndex;
            this.model.selectedItems = this.model.selectedItemlist = this.model.selectedIndices;
            this.model.checkedItems = this.model.checkedItemlist = this.model.checkItemsByIndex = this.model.checkedIndices;
            this.value(selectionArray.toString());
            this._hiddenInput.val(this.value());
            return this;
        },
        _setDisableValues: function () {
            this._disabledItems = [];
            this.model.disableItemsByIndex = [];
            var lenth = this.element.children().length, indx;
            for (indx = 0; indx < lenth; indx++)
                if ($(this.element.children()[indx]).hasClass('e-disable'))
                    this.model.disableItemsByIndex.push(indx);
            this.disableItemsByIndices(this.model.disableItemsByIndex);
        },
        _onClickCheckList: function (e) {
			if(!e.isChecked) $("#"+ e.model.id).closest('li').removeClass("checkItem");
            if (e.isInteraction) {
                this.checkedStatus = e.isChecked ? true : false;
                if (!this._initValue) {
                    this.checkedStatus ? this.model.checkedIndices.push($(e.event.target).closest('li').index()) : this.model.checkedIndices.splice($.inArray($(e.event.target).closest('li').index(), this.model.checkedIndices), 1);
                    var checkData = this._getItemObject($(e.event.target).closest('li'), e);
                    checkData["isInteraction"] = true;
                    this._trigger('checkChange', checkData);
                }
            }
        },
        _disableItemSelectCommon: function () {
            this.listitems = this.element.find('li');
            this._activeItem = this.listitems.index(this.element.find(".e-select"));
        },

        _disableItemSelectUp: function () {
            this._disableItemSelectCommon();
            var disableList = (typeof (this.model.disableItemsByIndex) != "object") ? this.model.disableItemsByIndex.split(",").sort().reverse() : this.model.disableItemsByIndex;
            if (this._activeItem == 0) this._activeItem = this.listitems.length - 1;
            else this._activeItem--;
            for (var lists = 0;
                ($.inArray(this._activeItem.toString(), disableList.toString())) > -1; lists++) {
                this._activeItem--;
                if (this._activeItem < 0) this._activeItem = this.listitems.length - 1
            }
            $(this.element.children("li")[this._activeItem]).addClass('e-select')
        },
        _disableItemSelectDown: function () {
            this._disableItemSelectCommon();
            var disableList = (typeof (this.model.disableItemsByIndex) != "object") ? this.model.disableItemsByIndex.split(",").sort() : this.model.disableItemsByIndex;
            ((this.listitems.length - 1) == this._activeItem) ? this._activeItem = 0 : this._activeItem++;
            for (var lists = 0;
                ($.inArray(this._activeItem.toString(), disableList.toString())) > -1; lists++) {
                this._activeItem++;
                if ((this.listitems.length) == this._activeItem) this._activeItem = 0
            }
            $(this.element.children("li")[this._activeItem]).addClass('e-select')
        },
        _checkitems: function () {
            if (this.model.showCheckbox) {
                var listitems = this.element.find('li');
                for (i = 0; i < this.model.checkedIndices.length; i++) {
                    var item = this.model.checkedIndices[i];
                    $(listitems[item]).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                    this._checkedItems.push(listitems[item])
                }
            } else {
                if (this.model.allowMultiSelection) {
                    for (i = 0; i < this.model.selectedIndices.length; i++) {
                        var item = this.model.selectedIndices[i];
                        if (!($(this.listitem[item]).hasClass("e-select"))) {
                            $(this.listitem[item]).addClass("e-select");
                            this._selectedItems.push($(this.listitem[item]));
                        }
                    }
                } else {
                    if (!($(this.listitem[this.model.selectedIndex]).hasClass("e-select")))
                        $(this.listitem[this.model.selectedIndex]).addClass("e-select");
                    this._selectedItems.push($(this.listitem[this.model.selectedIndex]))
                }
            }
            this._setSelectionValues();
            return this;
        },
        _OnListSelect: function (previtem, selecteditem, e) {
            if (!ej.isNullOrUndefined(previtem) && previtem != selecteditem && !this.model.showCheckbox) {
                var selectData = this._getItemObject($(this.element.find("li")[selecteditem]), e);
                selectData["isInteraction"] = true;
                this._trigger('change', selectData);
            }
        },
        _OnKeyDown: function (e) {
            if (this.model.enabled) {
                if (this._selectedItems && this._selectedItems.length == 1 && !this.model.showCheckbox)
                    this._lastEleSelect = $(this.element.children("li.e-select")).index();
                this._itemId = null;
                var _ListItemsContainer = this.element.children("li"), proxy = this,liH, popupH, activeitem;
                popupH = this.listContainer.height();
                liH = _ListItemsContainer.outerHeight();
                activeitem = Math.round(popupH / liH) != 0 ? Math.round(popupH / liH) : 5;
                this._listSize = this.element.children("li").size();
                if (!e.shiftKey) this._up = this._down;
                switch (e.keyCode) {
                    case 37:
                    case 38:
                        var liItems = this.element.find("li");
                        var selectedIndex = (this.model.showCheckbox) ? (this._lastEleSelect || 0) : liItems.index(this.element.find("li.e-select"));
                        if (e.shiftKey && this.model.allowMultiSelection && !this.model.showCheckbox) {
                            if (this._lastEleSelect == 0) return false;
                            this._lastEleSelect = (this._ctrlClick) ? this._lastEleSelect - 1 : this._lastEleSelect;
                            selectedIndex = this._lastEleSelect;
                            this._selectedItem = (selectedIndex || selectedIndex == 0) ? (selectedIndex == 0 ? this._listSize - 1 : (this._down ? selectedIndex : selectedIndex - 1)) : 0;
                            for (var i = this._selectedItem; $(_ListItemsContainer[i]).hasClass("e-disable") ; i--)
                                this._selectedItem -= 1;
                            if($(_ListItemsContainer[this._selectedItem]).hasClass("e-select") && this.element.find("li.e-select").length == 1) this._selectedItem -= 1;
                            var activeItem = $(_ListItemsContainer[this._selectedItem]);
                            if (activeItem.hasClass("e-select")) {
                                if (this._selectedItem == 0) return;
                                activeItem.removeClass("e-select");
                                this._selectedItems.pop();
                            }
                            else {
                                activeItem.addClass("e-select");
                                this._selectedItems.push(activeItem);
                            }
                            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(this._selectedItem) });
                            this._up = true;
                            this._down = false;
                            this._ctrlClick = false;
                        }
                        else {
                            this._selectedItem = (selectedIndex || selectedIndex == 0) ? (selectedIndex == 0 ? this._listSize - 1 : selectedIndex - 1) : 0;
                            for (var i = this._selectedItem; $(_ListItemsContainer[i]).hasClass("e-disable") ; i--)
                                this._selectedItem -= 1;
                            if (this._selectedItem == -1) this._selectedItem = this._listSize - 1;
                            this._addSelectedItem(e);
                            $(_ListItemsContainer).removeClass("e-hover e-select");
                            var addClass = (this.model.showCheckbox) ? "e-hover" : "e-select";
                            $(_ListItemsContainer[this._selectedItem]).addClass(addClass);
                            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(this._selectedItem) });
                        }
                        this._OnListSelect(this._selectedItem + 1, this._selectedItem, e);
                        this._lastEleSelect = this._selectedItem;
                        this._keyCascade(_ListItemsContainer[this._selectedItem]);
                        this._setSelectionValues();
                        e.preventDefault();
                        return false;
                        break;
                    case 39:
                    case 40:
                        var liItems = this.element.find("li");
                        var selectedIndex = (this.model.showCheckbox) ? (this._lastEleSelect || 0) : liItems.index(this.element.find("li.e-select"));
                        if (e.shiftKey && this.model.allowMultiSelection && !this.model.showCheckbox) {
                            if (this._lastEleSelect == this._listSize - 1) return false;
                            this._lastEleSelect = (this._ctrlClick) ? this._lastEleSelect + 1 : this._lastEleSelect;
                            selectedIndex = this._lastEleSelect;
                            this._selectedItem = (selectedIndex || selectedIndex == 0) ? (selectedIndex == this._listSize - 1 ? 0 : ((this._up || this._ctrlClick) ? selectedIndex : selectedIndex + 1)) : 0;
                            for (var i = this._selectedItem; $(_ListItemsContainer[i]).hasClass("e-disable") ; i++)
                                this._selectedItem += 1;
							if($(_ListItemsContainer[this._selectedItem]).hasClass("e-select") && this.element.find("li.e-select").length == 1) this._selectedItem += 1;		
                            var activeItem = $(_ListItemsContainer[this._selectedItem]);
                            if (activeItem.hasClass("e-select")) {
                                activeItem.removeClass("e-select");
                                this._selectedItems.pop();
                            }
                            else {
                                activeItem.addClass("e-select");
                                this._selectedItems.push(activeItem);
                            }
                            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(this._selectedItem) });
                            this._up = false;
                            this._down = true;
                            this._ctrlClick = false;
                        }
                        else {
                            this._selectedItem = (selectedIndex || selectedIndex == 0) ? (selectedIndex == this._listSize - 1 ? 0 : selectedIndex + 1) : 0;
                            for (var i = this._selectedItem; $(_ListItemsContainer[i]).hasClass("e-disable") ; i++)
                                this._selectedItem += 1;
                            if (this._selectedItem == this._listSize) this._selectedItem = 0;
                            this._addSelectedItem(e);
                            $(_ListItemsContainer).removeClass("e-hover e-select");
                            var addClass = (this.model.showCheckbox) ? "e-hover" : "e-select";
                            $(_ListItemsContainer[this._selectedItem]).addClass(addClass);
                            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(this._selectedItem) });
							this.element.find("li").removeClass("selectItem");
							this.model.selectedIndices.length = 0;
							this.model.selectedIndices.push(this._selectedItem);
                        }
                        this._OnListSelect(this._selectedItem - 1, this._selectedItem);
                        this._lastEleSelect = this._selectedItem;
                        this._keyCascade(_ListItemsContainer[this._selectedItem]);
                        this._setSelectionValues();
                        return false;
                        break;
                    case 8:
                    case 9:
                    case 13:
                        if (this.model.showCheckbox) {
                            if (this.model.checkedIndices.indexOf(this._selectedItem) < 0)
                                this.checkItemByIndex(this._selectedItem);
                            else
                                this.uncheckItemByIndex(this._selectedItem);
                        }
                        break;
                    case 18:
                    case 33: /* page up */
                        var step = e.keyCode == 33 ? activeitem : 1;
                        this._moveUp(this._activeItem, step);
                        this._preventDefaultAction(e);
                        break;
                    case 34: /* page down */
                        var step = e.keyCode == 34 ? activeitem : 1;
                        this._moveDown(this._activeItem, step);
                        this._preventDefaultAction(e);
                        break;
                    case 35:
				    if (e.shiftKey && this.model.allowMultiSelection) this._shiftHomeAndEndKeyProcess(this.prevselectedItem,(this._listSize - 1));
					else this._homeAndEndKeyProcess(e, _ListItemsContainer, (this._listSize - 1));
					this._preventDefaultAction(e);
                    break;
                case 36:
				    if (e.shiftKey && this.model.allowMultiSelection)this._shiftHomeAndEndKeyProcess(0,this.prevselectedItem);
                    this._homeAndEndKeyProcess(e, _ListItemsContainer, 0);
					this._preventDefaultAction(e);
                    break;
                }
            }
        },
        _moveUp: function (current, step) {
            if (current == null || current <= 0)  this._checkDisableStep(0, step, false);
            else if (current > this._listSize - 1) this._checkDisableStep(this._listSize - 1, step, false);
            else if (current > 0 && current <= this._listSize - 1) this._checkDisableStep(current, step, false);
        },
        _moveDown: function (current, step) {
            if (current == null || current < 0) this._checkDisableStep(-1, step, true);
            else if (current == 0)  this._checkDisableStep(0, step, true);
            else if (current >= this._listSize - 1) this._checkDisableStep(this._listSize - 1, step, true);
            else if (current < this._listSize - 1)  this._checkDisableStep(current, step, true);
        },
        _checkDisableStep: function (current, step, isdown, shift) {
            var command = isdown ? "_disableItemSelectDown" : "_disableItemSelectUp";
            var index = isdown ? current + step : current - step;
            var select = this[command](index);
            if (select == null) {
                for (var i = step; i >= 0; i--) {
                    index = isdown ? current + i : current - i;
                    select = this[command](index);
                    if (select != null) break;
                }
            }
            if (select != null)
                this.selectItemByIndex(select);
        },
        _disableItemSelectDown: function (current) {
            if (current == null || current < 0) current = 0;
            if (current < this._listSize) {
                if ($.inArray(current, this._disabledItems) < 0) 
                    return current;
                else
                    return this._disableItemSelectDown(current + 1);
            }
            else return this._listSize - 1;
        },

        _disableItemSelectUp: function (current) {
            if (current == null || current < 0) current = 0;
            if (current < this._listSize) {
                if ($.inArray(current, this._disabledItems) < 0) 
                    return current;
                else {
                    if (current > 0) 
                        return this._disableItemSelectUp(current - 1);
                }
            }
        },

        _preventDefaultAction: function (e, stopBubble) {
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            if (stopBubble) 
                e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
        },
        _homeAndEndKeyProcess: function (e, _ListItemsContainer, index) {
            if ($(':focus').length && $(':focus')[0].nodeName != "INPUT") {
                this._OnListSelect(this._selectedItem, index);
                this.selectItemByIndex(index);
                this._selectedItem = index;
                this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(index) });
                if (this.model.showCheckbox) {
                    this._removeListHover();
                    $(_ListItemsContainer[index]).addClass("e-hover");
                    this._lastEleSelect = this._selectedItem = index;
                }
                this._keyCascade(_ListItemsContainer[index],e);
                e.preventDefault();
                return false;
            }
        },
        _shiftHomeAndEndKeyProcess: function(initial , last) {
			this._removeListHover();
			this._activeItemLoop(initial ,last);
			this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(last) });
            return false;
		},
        _keyCascade: function (obj, evt) {
            var selectData = this._getItemObject($(obj), evt);
            selectData["isInteraction"] = true;
            this._trigger("select", selectData);
            if (this.model.cascadeTo) {
                this._activeItem = this._selectedItem;
                this._cascadeAction();
            }
        },

        mergeData: function (data,skipInitial) {
            this.mergeUl = $();
            this._setMapFields();
            var proxy = this;
            this._skipInitialRemoteData = skipInitial ? skipInitial : false;
            if (ej.DataManager && data instanceof ej.DataManager) {
                var queryPromise = data.executeQuery(this._getQuery());
                queryPromise.done(function (e) {
                    proxy.mergeValue = e.result;
                    proxy._renderlistContainer();
                });
            }
            else {
                this.mergeValue = data;
                this.listitems = this.listitems ? this.listitems : this.model.dataSource;
                this._renderlistContainer();
            }
            this._loadInitialRemoteData = false;
        },

        _onScroll: function (e) {
            this._temp = this.model.dataSource;
            if (this.model.actionBegin)
                this._trigger("actionBegin", {});
            if (this._temp != this.model.dataSource)
                (ej.DataManager && this.model.dataSource instanceof ej.DataManager) ? this._initDataSource(this.model.dataSource) : this._showFullList();
            var proxy = this, liEle = this.element.find('li')[0];
            if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "normal") {
                this.itemIndex = parseInt(this.scrollerObj.scrollTop() / $(liEle).outerHeight());
                this.realUllength = this.itemIndex;
                var start = this.itemIndex, end;
                if (this.itemIndex > this.listContainer.outerHeight() / $(liEle).outerHeight()) {
                    start = (this.mergeValue && start >= this.mergeValue.length) ? start - this.mergeValue.length : start;
                    end = this.itemIndex + this._getLiCount();
                }
                if (this.mergeValue && this.itemIndex <= this.mergeValue.length || start <= 0)
                    start = 0;
                if (this.model.dataSource.length == undefined && (this._temp == this.model.dataSource)) {
                    if (ej.DataManager && this.model.dataSource instanceof ej.DataManager)
                        this._queryPromise(start, proxy, start + Math.round(this.model.height / this.listitemheight), e);
                }
                else if (this._temp != this.model.dataSource) {
                    this._queryPromise(start, proxy, this._listitems.length, e);
                }
                else if (this.model.dataSource.length > 0)
                    this._loadQueryData(start, end, proxy);
            } else if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "continuous") {
                if (this.element.find("li").length - 2 <= (this.scrollerObj.scrollTop() + this.listContainer.height()) / this.element.find('li').outerHeight()) {
                    this.lastScrollPosition = this.scrollerObj.scrollTop();
                    var start = this.mergeValue && !this._skipInitialRemoteData ? this.element.children().length - this.mergeValue.length : this.element.children().length;
                    if (start <= 0)
                        start = 0;
					if(this._oldStartValue)
						start = this._oldStartValue;
                    var totalLength = this.model.totalItemsCount ? this.model.totalItemsCount : this.listitems.length
                    if (this.element.find("li").length < totalLength) {
                        if (this.model.dataSource.length == undefined) {
                            if (this.mergeValue && !this._skipInitialRemoteData)
                                var end = (this.model.totalItemsCount && start + this.model.itemRequestCount + this.mergeValue.length > this.model.totalItemsCount) ? this.model.totalItemsCount - this.mergeValue.length : start + this.model.itemRequestCount;
                            else
                                var end = (this.model.totalItemsCount && start + this.model.itemRequestCount > this.model.totalItemsCount) ? this.model.totalItemsCount : start + this.model.itemRequestCount;
                            if (ej.DataManager && this.model.dataSource instanceof ej.DataManager) {
								if(start<=end)
                                	this._queryPromise(start, proxy, end, e);
								else
									return false;
							}
							this._oldStartValue = start + this.model.itemRequestCount;
                        }
                        else if (this.model.dataSource.length > 0) {
                            if (this._isScrollComplete) return;
                            this._loadQueryData(proxy.realUllength, proxy.realUllength + this.model.itemRequestCount, proxy);
                        }
                    }
                }
            }
        },
        _queryPromise: function (start, proxy, end, e) {
            this._trigger('itemRequest', { event: e, isInteraction: true });
            this._setMapFields();
            var mQuery = this._savedQueries.clone();
            var queryPromise = this.model.dataSource.executeQuery(mQuery.range(start, end));
            this._updateLoadingClass(true);
            queryPromise.done(function (d) {
			    proxy._trigger("actionBeforeSuccess", d);
                proxy.realUllength = (e.source != "wheel") ? proxy.mergeValue ? proxy.mergeValue.length + start : start : start;
                proxy._loadlist(d.result)._checkboxHideShow(proxy.model.showCheckbox)._showResult()._updateLoadingClass();
                proxy._applySelection();
                if (proxy.model.virtualScrollMode == "continuous") {
                    proxy.scrollerObj.refresh();
                    proxy.scrollerObj.option("scrollTop", proxy.lastScrollPosition);
                }
                proxy._trigger("actionSuccess", d);
            }).fail(function (e) {
                proxy._trigger("actionFailure", e);
            }).always(function (e) {
                proxy._trigger("actionComplete", e);
            });
        },
        _selectListItems: function () {
            var listItems = this.element.find("li");
            for (i = 0; i < listItems.length; i++) {
                if ($(listItems[i]).hasClass('selectItem') && !$(listItems[i]).hasClass('e-select'))
                    $(listItems[i]).addClass("e-select").removeClass('selectItem');
            }
        },
        _loadQueryData: function (start, end, proxy) {
            this._isScrollComplete = (end >= this.listitems.length) ? true : false;
            this._updateLoadingClass(true);
            var tempSrc = this.model.dataSource;
            this._loadlist(tempSrc.slice(start, end))._showResult()._updateLoadingClass();
            proxy._applySelection();
            if (proxy.model.virtualScrollMode == "continuous") {
                proxy.scrollerObj.option("scrollTop", proxy.lastScrollPosition);
                proxy.scrollerObj.refresh();
            }
        },
        _setText: function (text) {
            for (i = 0; i < this.listitems.length; i++)
                if ($(this.element.children("li")[i]).text() == text) this.unselectAll().selectItemByIndex(i);
        },
        _getLiCount: function () {
            return parseInt(this.listContainer.height() / this.element.find("li").height());
        },
        _onDragStarts: function (data, target) {
            return this._trigger("itemDragStart", { items: data, target: target });
        },
        _onDrag: function (data, target) {
            return this._trigger("itemDrag", { items: data, target: target });
        },
        _onDragStop: function (data, target) {
            return this._trigger("itemDragStop", { items: data, target: target });
        },
        _onDropped: function (data, target) {
            return this._trigger("itemDrop", { items: data, target: target });
        },
        _OnKeyPress: function (e) {
            if (this.model.enableIncrementalSearch && this.model.enabled) {
                this._incrementalSearch(this._isMozilla ? e.charCode : e.keyCode)
            }
        },
        _incrementalSearch: function (from) {
            _proxy = this;
            var typedCharacter = String.fromCharCode(from);
            if (this._incqueryString != typedCharacter) this._incqueryString += typedCharacter;
            else this._incqueryString = typedCharacter; if ((this._incqueryString.length > 0) && (this._typeInterval == null)) {
                this._typeInterval = setTimeout(function () {
                    _proxy._incqueryString = "";
                    _proxy._typeInterval = null
                }, _proxy._typingThreshold)
            }
            var list = this.listContainer.find("ol,ul").children("li:not('.e-category')"),
                i, strlen;
            var caseSence = this.model.caseSensitiveSearch,
                str, queryStr = this._incqueryString;
            var querylength = this._incqueryString.length,
                searchflag = false;
            if (!caseSence) queryStr = queryStr.toLowerCase();
            var initialSelection = this._activeItem;
            --initialSelection;
            var startIndex = this._activeItem != list.length - 1 ? (this._activeItem + 1) : 0;
            if (this._incqueryString.length > 1) startIndex = this._activeItem;
            for (var i = startIndex;
                (i < list.length && initialSelection != i) ; i++) {
                str = $.trim($(list[i]).text());
                str = caseSence ? str : str.toLowerCase();
                if (str.substr(0, querylength) === queryStr) {
                    this._removeListHover();
                    this.element.children("li").removeClass('e-active');
                    this._selectedItem = i;
                    this._addListHover();
                    searchflag = true;
                } else if ((i == list.length - 1) && (searchflag == false)) {
                    if (startIndex != 0) {
                        i = -1;
                        ++initialSelection;
                    } else searchflag = true;
                }
                if (searchflag) break;
            }
        },
        _wireEvents: function () {
            this._on(this.listContainer, "focus", this._OnFocusIn);
            this._on(this.listContainer, "blur", this._OnFocusOut);
            $(window).bind("resize", $.proxy(this._OnWindowResize, this));
        },
        _OnFocusIn: function () {
            if (!this._focused) {
                this._trigger("focusIn");
                this._on(this.listContainer, "keydown", this._OnKeyDown);
                this._on(this.listContainer, "keypress", this._OnKeyPress);
                this._focused = true;
            }
        },
        _OnFocusOut: function () {
            if (this._focused) {
                this._trigger("focusOut");
                this._off(this.listContainer, "keydown", this._OnKeyDown);
                this._off(this.listContainer, "keypress", this._OnKeyPress);
                this._focused = false;
            }
        }
    });
    ej.VirtualScrollMode = {
        /** Supports to Virtual Scrolling mode with normal only */
        Normal: "normal",
        /** Supports to Virtual Scrolling mode with continuous only */
        Continuous: "continuous"
    }
})(jQuery, Syncfusion);
;

});