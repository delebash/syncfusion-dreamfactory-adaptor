/*!
*  filename: ej.spellcheck.js
*  version : 14.4.0.20
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.core","./../common/ej.data","./../common/ej.globalize","./../common/ej.scroller","./../common/ej.draggable","./ej.dialog","./ej.button","./ej.listbox","./ej.menu"], fn) : fn();
})
(function () {
	
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SpellCheck = (function (_super) {
    __extends(SpellCheck, _super);
    function SpellCheck() {
        _super.apply(this, arguments);
        this.rootCSS = "e-spellcheck";
        this.PluginName = "ejSpellCheck";
        this._id = "null";
        this.defaults = {
            locale: "en-US",
            misspellWordCss: "e-errorword",
            ignoreSettings: {
                ignoreAlphaNumericWords: true,
                ignoreHtmlTags: true,
                ignoreEmailAddress: true,
                ignoreMixedCaseWords: true,
                ignoreUpperCase: true,
                ignoreUrl: true,
                ignoreFileNames: true
            },
            dictionarySettings: { dictionaryUrl: "", customDictionaryUrl: "" },
            maxSuggestionCount: 6,
            enableAsynchronous: true,
            ajaxDataType: "jsonp",
            ignoreWords: [],
            contextMenuSettings: {
                enable: true,
                menuItems: [{ id: "IgnoreAll", text: "Ignore All" },
                    { id: "AddToDictionary", text: "Add To Dictionary" }]
            },
            actionSuccess: null,
            actionBegin: null,
            actionFailure: null,
            start: null,
            complete: null,
            contextOpen: null,
            contextClick: null,
            dialogBeforeOpen: null,
            dialogOpen: null,
            dialogClose: null,
            validating: null
        };
        this.dataTypes = {
            locale: "string",
            misspellWordCss: "string",
            ignoreSettings: {
                ignoreAlphaNumericWords: "boolean",
                ignoreHtmlTags: "boolean",
                ignoreEmailAddress: "boolean",
                ignoreMixedCaseWords: "boolean",
                ignoreUpperCase: "boolean",
                ignoreUrl: "boolean",
                ignoreFileNames: "boolean"
            },
            dictionarySettings: {
                dictionaryUrl: "string",
                customDictionaryUrl: "string",
                customDictionaryPath: "string"
            },
            maxSuggestionCount: "number",
            enableAsynchronous: "boolean",
            ajaxDataType: "string",
            ignoreWords: "array",
            contextMenuSettings: {
                enable: "boolean",
                menuItems: "array"
            }
        };
        this._localizedLabels = null;
        this._statusFlag = true;
        this._words = [];
        this.model = this.defaults;
    }
    SpellCheck.prototype._init = function () {
        if (!ej.isNullOrUndefined(this.element)) {
            this._renderSpellCheck();
        }
    };
    SpellCheck.prototype._renderSpellCheck = function () {
        this._initLocalize();
        this._renderControls();
    };
    SpellCheck.prototype._initLocalize = function () {
        this._localizedLabels = this._getLocalizedLabels();
    };
    SpellCheck.prototype._renderControls = function () {
        var _this = this;
        this.element.addClass("e-spellcheck");
        this.element[0].spellcheck = false;
        this.element[0].addEventListener("input", function () { _this._statusFlag = true; }, false);
    };
    SpellCheck.prototype.showInDialog = function () {
        if (this._statusFlag) {
            var element = ej.buildTag("div.e-spellcheckparent e-spellcheck");
            this.element.after(element);
            this._renderDialogWindow();
        }
        else {
            this._alertWindowRender("show");
        }
    };
    SpellCheck.prototype.validate = function () {
        if (this.model.contextMenuSettings.enable && !ej.isNullOrUndefined(this.model.dictionarySettings.dictionaryUrl) && this._statusFlag) {
            var inputText = ej.isNullOrUndefined($(this.element)[0].value) ? ($(this.element)[0].innerText || $(this.element)[0].textContent).trim() : $(this.element)[0].value.trim();
            var targetText = $(this.element)[0].innerHTML;
            this._splitWords(inputText, this);
            this._ajaxRequest(this, inputText, "validateOnType");
        }
    };
    SpellCheck.prototype._splitWords = function (inputText, proxy) {
        var splitWords = inputText.split(/[^0-9a-zA-Z\'_]/);
        splitWords = splitWords.filter(function (str) { return /\S/.test(str); });
        proxy._words = splitWords;
    };
    SpellCheck.prototype.spellCheck = function (targetSentence, misspelledWordCss) {
        var event = { targetSentence: targetSentence, misspelledWordCss: misspelledWordCss, requestType: "spellCheck" };
        if (this._trigger("actionBegin", event)) {
            return false;
        }
        this._misspelledWordCss = misspelledWordCss;
        this._ajaxRequest(this, targetSentence, "spellCheck");
    };
    SpellCheck.prototype.ignoreAll = function (word, targetContent) {
        if (!ej.isNullOrUndefined(word) && word !== "" && (!ej.isNullOrUndefined(targetContent) && targetContent !== "")) {
            var event = { ignoreWord: word, targetContent: targetContent, requestType: "ignoreAll" };
            if (this._trigger("validating", event)) {
                return false;
            }
            this.model.ignoreWords.push(word);
            var ignoreResult = this._updateErrorContent(word, targetContent, null, "ignoreAll", null);
            return ignoreResult;
        }
        else {
            return false;
        }
    };
    SpellCheck.prototype.ignore = function (word, targetContent, index) {
        if (!ej.isNullOrUndefined(word) && word !== "" && (!ej.isNullOrUndefined(targetContent) && targetContent !== "")) {
            var event = { ignoreWord: word, targetContent: targetContent, index: index, requestType: "ignore" };
            if (this._trigger("validating", event)) {
                return false;
            }
            var ignoreResult = this._updateErrorContent(word, targetContent, null, "ignore", index);
            return ignoreResult;
        }
        else {
            return false;
        }
    };
    SpellCheck.prototype.change = function (word, targetContent, changeWord, index) {
        if (!ej.isNullOrUndefined(word) && word !== "" && (!ej.isNullOrUndefined(targetContent) && targetContent !== "") && (!ej.isNullOrUndefined(changeWord) && changeWord !== "")) {
            var event = { changableWord: word, targetContent: targetContent, changeWord: changeWord, index: index, requestType: "changeWord" };
            if (this._trigger("validating", event)) {
                return false;
            }
            var changeResult = this._updateErrorContent(word, targetContent, changeWord, "changeWord", index);
            return changeResult;
        }
        else {
            return false;
        }
    };
    SpellCheck.prototype.changeAll = function (word, targetContent, changeWord) {
        if (!ej.isNullOrUndefined(word) && word !== "" && (!ej.isNullOrUndefined(targetContent) && targetContent !== "") && (!ej.isNullOrUndefined(changeWord) && changeWord !== "")) {
            var event = { changableWord: word, targetContent: targetContent, changeWord: changeWord, requestType: "changeAll" };
            if (this._trigger("validating", event)) {
                return false;
            }
            var ignoreResult = this._updateErrorContent(word, targetContent, changeWord, "changeAll", null);
            return ignoreResult;
        }
        else {
            return false;
        }
    };
    SpellCheck.prototype.addToDictionary = function (customWord) {
        if (!ej.isNullOrUndefined(customWord) && customWord !== "") {
            var event = { customWord: customWord, requestType: "addToDictionary" };
            if (this._trigger("validating", event)) {
                return false;
            }
            this._customWord = JSON.stringify({ customWord: customWord });
            this._ajaxRequest(this, null, "addToDictionary");
        }
        else {
            return false;
        }
    };
    SpellCheck.prototype._updateErrorContent = function (word, targetContent, changeWord, requestType, index) {
        var updatedResult;
        if (targetContent.indexOf(word) !== -1) {
            var replaceString;
            if (ej.browserInfo().name === "msie" && !(!ej.isNullOrUndefined(this._spellCheckWindow) && this._spellCheckWindow.ejDialog("isOpen")))
                replaceString = "<span class=\"errorspan " + this.model.misspellWordCss + "\" style=\"-ms-touch-action: pinch-zoom; touch-action: pinch-zoom;\">" + word + "</span>";
            else
                replaceString = "<span class=\"errorspan " + this.model.misspellWordCss + "\">" + word + "</span>";
            var replaceWord = requestType === "ignoreAll" || requestType === "addToDictionary" || requestType === "ignore" ? word : changeWord;
            if (requestType === "ignoreAll" || requestType === "addToDictionary" || requestType === "changeAll") {
                targetContent = targetContent.replace(new RegExp(replaceString, "g"), replaceWord);
            }
            else if (requestType === "ignore" || requestType === "changeWord") {
                if (ej.isNullOrUndefined(index)) {
                    targetContent = targetContent.replace(replaceString, replaceWord);
                }
                else {
                    var indexArray = new Array();
                    var startIndex = targetContent.indexOf(replaceString);
                    while (startIndex !== -1) {
                        indexArray.push(startIndex);
                        startIndex = targetContent.indexOf(replaceString, ++startIndex);
                    }
                    var replaceWordIndex = indexArray[index];
                    targetContent = targetContent.substr(0, replaceWordIndex) + replaceWord + targetContent.substr(replaceWordIndex + replaceString.length);
                }
            }
            updatedResult = { resultHTML: targetContent };
        }
        else {
            updatedResult = false;
        }
        return updatedResult;
    };
    SpellCheck.prototype._renderDialogWindow = function () {
        this._dialogWindowRendering();
        this._showDialog();
    };
    SpellCheck.prototype._dialogWindowRendering = function () {
        var proxy = this;
        this._spellCheckWindow = ej.buildTag("div.e-spellcheckdialog#" + this._id + "ErrorCorrectionWindow");
        var _contentArea = ej.buildTag("div.e-dialogdiv");
        var _contentLabel = ej.buildTag("div.e-row")
            .append(ej.buildTag("div.e-labelcell")
            .append(ej.buildTag("label.e-dictionarylabel", this._localizedLabels.NotInDictionary + ":")));
        var _misspelledContentAreaRow = ej.buildTag("div.e-row", "", { height: "90px" });
        var _misspelledContentCell = ej.buildTag("div.e-cell e-sentencecell")
            .append(ej.buildTag("div.e-sentence", "", {}, {
            id: this._id + "_Sentences",
            name: "sentences",
            contenteditable: "false"
        }));
        _misspelledContentAreaRow.append(_misspelledContentCell);
        var _spellCheckButtons = ej.buildTag("div.e-buttoncell");
        var _ignoreOnceButton = ej.buildTag("button.e-btnignoreonce", this._localizedLabels.IgnoreOnceButtonText, {}, { id: this._id + "_IgnoreOnce" }).attr("type", "button");
        var _ignoreAllButton = ej.buildTag("button.e-btnignoreall", this._localizedLabels.IgnoreAllButtonText, {}, { id: this._id + "_IgnoreAll" }).attr("type", "button");
        var _addToDictionaryButton = ej.buildTag("button.e-btnaddtodictionary", this._localizedLabels.AddToDictionary, {}, { id: this._id + "_AddToDictionary" }).attr("type", "button");
        _misspelledContentAreaRow.append(_spellCheckButtons.append(_ignoreOnceButton).append(_ignoreAllButton).append(_addToDictionaryButton));
        var _suggestionsLabel = ej.buildTag("div.e-row").append(ej.buildTag("div.e-labelcell")
            .append(ej.buildTag("label.e-lablesuggestions", this._localizedLabels.SuggestionLabel + ":")));
        var _suggestionsAreaRow = ej.buildTag("div.e-row", "", { height: "90px" });
        var _suggestionContentCell = ej.buildTag("div.e-cell e-suggestioncell").append(ej.buildTag("ul.e-suggesteditems", "", {}, { id: this._id + "_Suggestions" }));
        _suggestionsAreaRow.append(_suggestionContentCell);
        var _spellCheckKeys = ej.buildTag("div.e-buttoncell");
        var _changeButton = ej.buildTag("button.e-btnchange", this._localizedLabels.ChangeButtonText, {}, { id: this._id + "_Change" }).attr("type", "button");
        var _changeAllButton = ej.buildTag("button.e-btnchangeall", this._localizedLabels.ChangeAllButtonText, {}, { id: this._id + "_ChangeAll" }).attr("type", "button");
        var _closeButton = ej.buildTag("button.e-btnclose", this._localizedLabels.CloseButtonText, {}, { id: this._id + "_Close" }).attr("type", "button");
        _suggestionsAreaRow.append(_spellCheckKeys.append(_changeButton).append(_changeAllButton).append(_closeButton));
        _contentArea.append(_contentLabel).append(_misspelledContentAreaRow).append(_suggestionsLabel).append(_suggestionsAreaRow);
        this._spellCheckWindow.append(_contentArea);
        this._spellCheckWindow.find(".e-suggesteditems").ejListBox({ width: "295px", height: "90px", dataSource: null, selectedIndex: 0, cssClass: "e-suggestionlist" });
        var buttonClasses = [".e-btnignoreonce", ".e-btnignoreall", ".e-btnaddtodictionary", ".e-btnchange", ".e-btnchangeall", ".e-btnclose"];
        for (var i = 0; i < buttonClasses.length; i++) {
            this._spellCheckWindow.find(buttonClasses[i])
                .ejButton({
                width: "140px",
                height: "25px",
                click: function (e) {
                    e.model.text === proxy._localizedLabels.CloseButtonText ? proxy._close() : proxy._changeErrorWord(e);
                }
            });
        }
        this._spellCheckWindow.ejDialog({
            width: "462px",
            enableModal: true,
            enableResize: false,
            showOnInit: false,
            allowKeyboardNavigation: false,
            target: ".e-spellcheckparent",
            title: this._localizedLabels.SpellCheckButtonText,
            close: function () {
                proxy._close();
            }
        });
        this._spellCheckWindow.find(".e-sentence").append(ej.buildTag("div.e-sentencescroller").append(ej.buildTag("div").append(ej.buildTag("div.e-sentencecontent"))));
        this._spellCheckWindow.find(".e-sentence .e-sentencescroller").ejScroller({ height: "84px", width: "293px", scrollerSize: 20 });
    };
    SpellCheck.prototype._alertWindowRender = function (requestType) {
        this._renderAlertWindow(requestType);
        this._alertWindow.ejDialog("open");
    };
    SpellCheck.prototype._renderAlertWindow = function (requestType) {
        var proxy = this;
        this._alertWindow = ej.buildTag("div.e-alertdialog#" + this._id + "alertWindow");
        var _alertOkButton = ej.buildTag("div.e-alertbtn", "", { "text-align": "center" })
            .append(ej.buildTag("button.e-alertbutton e-alertspellok", this._localizedLabels.OK, {}, { id: this._id + "alertok" }).attr("type", "button"));
        var _alertText = ej.buildTag("div.e-alerttext", this._localizedLabels.CompletionPopupMessage, { "text-align": "center", "padding": "5px" });
        this._alertWindow.append(_alertText).append(_alertOkButton);
        this.element.append(this._alertWindow);
        this._alertWindow.find(".e-alertbutton")
            .ejButton({
            showRoundedCorner: true,
            width: "100px",
            click: function () {
                proxy._alertClose();
            }
        });
        this._alertWindow.ejDialog({
            width: "350px",
            showOnInit: false,
            enableModal: true,
            title: this._localizedLabels.CompletionPopupTitle,
            enableResize: false,
            allowKeyboardNavigation: false,
            target: requestType === "validating" ? ".e-spellcheckdialog" : $("body"),
            cssClass: "e-alertdialog",
            close: function () {
                proxy._alertClose();
            }
        });
    };
    SpellCheck.prototype._renderContextMenu = function () {
        var proxy = this;
        this._contextMenu = ej.buildTag("ul#" + this._id + "contextMenu");
        this._contextMenu.ejMenu({
            fields: { id: "id", text: "text", parentId: "parentId" },
            menuType: ej.MenuType.ContextMenu,
            openOnClick: false,
            contextMenuTarget: "." + this.model.misspellWordCss,
            width: "auto",
            click: function (e) {
                proxy._onMenuSelect(e);
            },
            beforeOpen: function (e) {
                proxy._beforeOpen(e);
            }
        });
    };
    SpellCheck.prototype._showDialog = function () {
        this._removeSpan(this);
        var event = { spellCheckDialog: this._spellCheckWindow, requestType: "dialogBeforeOpen" };
        if (this._trigger("dialogBeforeOpen", event)) {
            return false;
        }
        this._spellCheckWindow.ejDialog("open");
        var inputText = ej.isNullOrUndefined($(this.element)[0].value) ? ($(this.element)[0].innerText || $(this.element)[0].textContent).trim() : $(this.element)[0].value.trim();
        var targetText = document.getElementById(this.element.attr("id")).tagName === "TEXTAREA" ? $(this.element)[0].value : $(this.element)[0].innerHTML;
        this._splitWords(inputText, this);
        this._spellCheckWindow.find(".e-sentence .e-sentencecontent")[0].innerHTML = targetText;
        var dialogEvent = { targetText: inputText, requestType: "dialogOpen" };
        if (this._trigger("dialogOpen", dialogEvent)) {
            return false;
        }
        this._ajaxRequest(this, inputText, "spellCheckDialog");
    };
    SpellCheck.prototype._ajaxRequest = function (proxy, text, requestType) {
        var value = requestType === "addToDictionary" ? proxy._customWord : this._getModelValues(this, text);
        $.ajax({
            async: this.model.enableAsynchronous,
            url: requestType === "addToDictionary" ? this.model.dictionarySettings.customDictionaryUrl : this.model.dictionarySettings.dictionaryUrl,
            data: { data: value },
            contentType: "application/json; charset=utf-8",
            dataType: this.model.ajaxDataType,
            crossDomain: true,
            success: function (result) {
                var data;
                if (requestType === "addToDictionary")
                    data = proxy._errorWordDetails;
                else
                    data = proxy._errorWordDetails = ej.isNullOrUndefined(proxy.model) ? result : (proxy.model.ajaxDataType === "json" ? result.Data : result);
                var word, elementText = text, event;
                if (data.length > 0) {
                    var errorWordData;
                    if (requestType === "spellCheckDialog" ||
                        requestType === "validateOnType" ||
                        requestType === "validateOnRender") {
                        var element = $(proxy.element)[0];
                        var filteredData = proxy._getFilterData(data, proxy);
                        errorWordData = ej.dataUtil.distinct(filteredData);
                        if (requestType === "spellCheckDialog") {
                            proxy._dialogModeOperations(proxy, errorWordData, elementText, requestType);
                        }
                        else if (requestType === "validateOnType" || requestType === "validateOnRender") {
                            proxy._validateOnTypeOperations(proxy, errorWordData, elementText, requestType, element);
                        }
                    }
                    else if (requestType === "spellCheck") {
                        if (data.length > 0) {
                            var filterData = proxy._getFilterData(data, proxy);
                            errorWordData = ej.dataUtil.distinct(filterData);
                            for (var i = 0; i < errorWordData.length; i++) {
                                var query = new ej.Query()
                                    .where("ErrorWord", ej.FilterOperators.equal, errorWordData[i]);
                                var filterValue = new ej.DataManager(data).executeLocal(query);
                                if (filterValue[0]["SuggestedWords"].length > 0) {
                                    word = "<span class=\"errorspan " +
                                        ((!ej.isNullOrUndefined(proxy._misspelledWordCss) &&
                                            proxy._misspelledWordCss !== "")
                                            ? proxy._misspelledWordCss
                                            : proxy.model.misspellWordCss) +
                                        "\">" +
                                        errorWordData[i] +
                                        "</span>";
                                    var replaceExpression = new RegExp(errorWordData[i], "gi");
                                    elementText = elementText.replace(replaceExpression, word);
                                }
                            }
                            event = { resultHTML: elementText, errorWordDetails: data, requestType: "spellCheck" };
                            proxy._misspelledWordCss = null;
                        }
                        else {
                            event = { resultHTML: elementText, errorWordDetails: data, requestType: "spellCheck" };
                        }
                        proxy._trigger("actionSuccess", event);
                    }
                    else if (requestType === "addToDictionary") {
                        var updatedResult = proxy
                            ._updateErrorContent(result, proxy._errorHTML, null, "addToDictionary", null);
                        if (!ej.isNullOrUndefined(proxy._errorHTML)) {
                            if (!ej.isNullOrUndefined(proxy._spellCheckWindow) &&
                                proxy._spellCheckWindow.find(".e-btnaddtodictionary").hasClass("e-select")) {
                                var listBoxElement = proxy._spellCheckWindow.find(".e-suggesteditems");
                                var contentElement = proxy._spellCheckWindow.find(".e-sentence .e-sentencecontent");
                                if (proxy._errorWordsData.length > 0) {
                                    proxy._errorHTML = contentElement[0].innerHTML = updatedResult["resultHTML"];
                                    var spanElement = $(contentElement).find(".errorspan");
                                    for (var i_1 = 0; i_1 < spanElement.length; i_1++) {
                                        var spanText = spanElement[i_1].innerText || spanElement[i_1].textContent;
                                        if (spanText === result) {
                                            $(spanElement[i_1]).replaceWith(spanText);
                                        }
                                    }
                                    proxy._listBoxDataUpdate(proxy);
                                }
                                else {
                                    listBoxElement.ejListBox({ dataSource: null });
                                    proxy._statusFlag = false;
                                    proxy._alertWindowRender("validating");
                                }
                            }
                            else if (!ej.isNullOrUndefined(proxy._contextMenu)) {
                                $(proxy.element)[0].innerHTML = updatedResult["resultHTML"];
                            }
                            event = {
                                resultHTML: updatedResult["resultHTML"],
                                errorWordDetails: result,
                                requestType: "addToDictionary"
                            };
                            proxy._trigger("actionSuccess", event);
                        }
                        proxy._renderContextMenu();
                    }
                }
                else {
                    if (requestType === "spellCheckDialog") {
                        proxy._spellCheckWindow.ejDialog("isOpen") && proxy._spellCheckWindow.ejDialog("close");
                    }
                    if (requestType !== "spellCheck" && requestType !== "validateOnType")
                        proxy._alertWindowRender("load");
                    if (requestType === "spellCheck") {
                        event = { resultHTML: text, errorWordDetails: data, requestType: "spellCheck" };
                        proxy._trigger("actionSuccess", event);
                    }
                    if (requestType === "validateOnType") {
                        proxy._removeSpan(proxy);
                    }
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                var errorEvent = { errorMessage: errorThrown, requestType: requestType };
                proxy._trigger("actionFailure", errorEvent);
            }
        });
    };
    SpellCheck.prototype._dialogModeOperations = function (proxy, errorWordData, elementText, requestType) {
        var event = { errorWords: errorWordData, targetText: elementText, requestType: requestType };
        if (this._trigger("start", event)) {
            return false;
        }
        var contentElement = proxy._spellCheckWindow.find(".e-sentence .e-sentencecontent");
        if (errorWordData.length > 0) {
            proxy._removeSpan(proxy);
            proxy._processNode(proxy, contentElement[0], errorWordData, requestType);
            proxy._errorHTML = contentElement[0].innerHTML;
            proxy._errorContent = contentElement[0].innerText || contentElement[0].textContent;
            var scrollObj = proxy._spellCheckWindow.find(".e-sentence .e-sentencescroller").data("ejScroller");
            scrollObj.refresh();
            proxy._listBoxDataUpdate(proxy);
        }
        else {
            var listBoxElement = proxy._spellCheckWindow.find(".e-suggesteditems");
            requestType === "spellCheckDialog" && (contentElement[0].innerHTML = elementText);
            listBoxElement.ejListBox({ dataSource: null });
            proxy._statusFlag = false;
            this._alertWindowRender("load");
        }
    };
    SpellCheck.prototype._validateOnTypeOperations = function (proxy, errorWordData, elementText, requestType, element) {
        if (errorWordData.length > 0) {
            proxy._removeSpan(proxy);
            proxy._processNode(proxy, element, errorWordData, requestType);
            proxy._errorHTML = proxy.element[0].innerHTML;
            proxy._errorContent = proxy.element[0].innerText || proxy.element[0].textContent;
            proxy._statusFlag = true;
            var event = { errorWords: proxy._errorWordDetails, targetText: elementText, targetHtml: proxy._errorHTML, requestType: requestType };
            if (this._trigger("start", event)) {
                return false;
            }
            proxy._renderContextMenu();
        }
        else {
            proxy._removeSpan(proxy);
            proxy._statusFlag = false;
        }
    };
    SpellCheck.prototype._processNode = function (proxy, element, errorWordData, requestType) {
        var elementTextNodes = proxy._filterTextNodes(proxy, element);
        for (var i = 0; i < elementTextNodes.length; i++) {
            var presentNode = elementTextNodes[i];
            var elementNodes = [elementTextNodes[i]];
            var nodeData = elementTextNodes[i].data;
            var isUrl = false, isEmail = false, flag = false;
            if (proxy.model.ignoreSettings.ignoreUrl) {
                var urlRegEx = /^((http|ftp|https)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
                isUrl = urlRegEx.test(presentNode.wholeText);
                isUrl && (flag = isUrl);
            }
            if (proxy.model.ignoreSettings.ignoreEmailAddress) {
                var mailAddressValidation = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
                isEmail = mailAddressValidation.test(presentNode.wholeText);
                isEmail && (flag = isEmail);
            }
            if (!flag) {
                for (var j = 0; j < proxy._words.length; j++) {
                    for (var k = 0; k < errorWordData.length; k++) {
                        if (proxy._words[j] === errorWordData[k] &&
                            !ej.isNullOrUndefined(nodeData.match(new RegExp("\\b" + errorWordData[k] + "\\b", "gi"))) &&
                            nodeData.indexOf(errorWordData[k]) !== -1) {
                            var wordIndex = nodeData.indexOf(errorWordData[k]);
                            var wordLength = errorWordData[k].length;
                            var newNode = presentNode.splitText(wordIndex);
                            var span = document.createElement("span");
                            if (requestType === "validateOnType")
                                span.className = "errorspan " + this.model.misspellWordCss;
                            else
                                span.className = "errorspan";
                            var errorTextNode = document.createTextNode(errorWordData[k]);
                            span.appendChild(errorTextNode);
                            presentNode.parentNode.insertBefore(span, newNode);
                            newNode.data = newNode.data.substr(wordLength);
                            presentNode = newNode;
                            elementNodes.push(errorTextNode);
                            elementNodes.push(newNode);
                            nodeData = newNode.data;
                        }
                    }
                }
            }
        }
    };
    SpellCheck.prototype._filterTextNodes = function (proxy, elem) {
        var filteredTextNodes = [];
        getTextNodes(elem);
        function getTextNodes(element) {
            for (var i = 0; i < element.childNodes.length; i++) {
                var child = element.childNodes[i];
                if (child.nodeType === 3) {
                    filteredTextNodes.push(child);
                }
                else if (child.childNodes) {
                    getTextNodes(child);
                }
            }
        }
        return filteredTextNodes;
    };
    SpellCheck.prototype._removeSpan = function (proxy) {
        var spanElement = $(proxy.element[0]).find("span.errorspan");
        for (var i = 0; i < spanElement.length; i++) {
            var spanText = spanElement[i].innerText || spanElement[i].textContent;
            $(spanElement[i]).replaceWith(spanText);
        }
    };
    SpellCheck.prototype._getFilterData = function (result, proxy) {
        var errorWordData = [];
        proxy._errorWordsData = proxy._errorWordDetails = result;
        for (var k = 0; k < proxy.model.ignoreWords.length; k++) {
            var query = new ej.Query().where("ErrorWord", ej.FilterOperators.notEqual, proxy.model.ignoreWords[k]);
            proxy._errorWordsData = new ej.DataManager(proxy._errorWordsData).executeLocal(query);
        }
        for (var j = 0; j < proxy._errorWordsData.length; j++) {
            errorWordData.push(proxy._errorWordsData[j].ErrorWord);
        }
        return errorWordData;
    };
    SpellCheck.prototype._formHtml = function (errorWordData, elementText) {
        var word, replaceExpression;
        for (var j = 0; j < errorWordData.length; j++) {
            word = "<span class=\"errorspan\">" + errorWordData[j] + "</span>";
            replaceExpression = new RegExp("\\b" + errorWordData[j] + "\\b", "gi");
            elementText = elementText.replace(replaceExpression, word);
        }
        return elementText;
    };
    SpellCheck.prototype._listBoxDataUpdate = function (proxy) {
        var listBoxElement = proxy._spellCheckWindow.find(".e-suggesteditems");
        var errorWordElement = proxy._spellCheckWindow.find(".e-sentence .e-sentencecontent").find(".errorspan");
        $(errorWordElement[0]).addClass(this.model.misspellWordCss);
        if (errorWordElement.length > 0) {
            var query = new ej.Query().where("ErrorWord", ej.FilterOperators.equal, (errorWordElement[0].innerText || errorWordElement[0].textContent));
            var filterValue = new ej.DataManager(proxy._errorWordDetails).executeLocal(query);
            var filterData = ej.dataUtil.distinct(filterValue);
            var listObj = $("#" + proxy._id + "_Suggestions").data("ejListBox");
            if (filterData[0]["SuggestedWords"].length > 0) {
                if (proxy._spellCheckWindow.find(".e-btnchange").hasClass("e-disable") &&
                    proxy._spellCheckWindow.find(".e-btnchangeall").hasClass("e-disable")) {
                    proxy._spellCheckWindow.find(".e-btnchange").removeClass("e-disable");
                    proxy._spellCheckWindow.find(".e-btnchangeall").removeClass("e-disable");
                }
                var count = proxy.model.maxSuggestionCount < filterData[0]["SuggestedWords"].length
                    ? proxy.model.maxSuggestionCount
                    : filterData[0]["SuggestedWords"].length;
                listBoxElement.ejListBox({ selectedIndex: null });
                listBoxElement.ejListBox({
                    dataSource: proxy._convertData(filterData[0]["SuggestedWords"].slice(0, count), "dictionaryData"),
                    selectedIndex: 0
                });
                listObj.refresh();
            }
            else {
                proxy._spellCheckWindow.find(".e-btnchange").addClass("e-disable");
                proxy._spellCheckWindow.find(".e-btnchangeall").addClass("e-disable");
                var noSuggestion = [this._localizedLabels.NoSuggestionMessage];
                listBoxElement.ejListBox({ selectedIndex: null });
                listBoxElement.ejListBox({
                    dataSource: this._convertData(noSuggestion, "dictionaryData"),
                    selectedIndex: 0
                });
                listObj.refresh();
            }
            $(proxy._spellCheckWindow.find("." + proxy.model.misspellWordCss)).get(0).scrollIntoView(false);
        }
        else {
            var result = proxy._spellCheckWindow.find(".e-sentence .e-sentencecontent")[0].innerHTML;
            var updateevent = { targetText: result, requestType: "changeErrorWord" };
            if (this._trigger("complete", updateevent)) {
                return false;
            }
            proxy._statusFlag = false;
            proxy._alertWindowRender("validating");
        }
    };
    SpellCheck.prototype._beforeOpen = function (args) {
        this._selectedTarget = args.events.target;
        var selectedWord = this._selectedValue = (this._selectedTarget.textContent || this._selectedTarget.innerText);
        var query = new ej.Query().where("ErrorWord", ej.FilterOperators.equal, selectedWord.trim());
        var details = new ej.DataManager(this.model.ajaxDataType === "json" ? this._errorWordDetails.Data : this._errorWordDetails).executeLocal(query);
        this._errorWordsData = details;
        var event = { selectedErrorWord: selectedWord, requestType: "contextOpen" };
        if (this._trigger("contextOpen", event)) {
            return false;
        }
        if (this._errorWordsData.length > 0) {
            var menuObj = this._contextMenu.data("ejMenu");
            var options = this.model.contextMenuSettings.menuItems;
            if (details[0]["SuggestedWords"].length > 0) {
                var suggestedWords = [];
                var count = this.model.maxSuggestionCount < details[0]["SuggestedWords"].length ? this.model.maxSuggestionCount : details[0]["SuggestedWords"].length;
                suggestedWords = this._convertData(details[0]["SuggestedWords"].slice(0, count), "menuData");
                for (var i = 0; i < options.length; i++) {
                    suggestedWords.push(options[i]);
                }
                menuObj.option("fields.dataSource", suggestedWords);
            }
            else {
                menuObj.option("fields.dataSource", options);
            }
        }
        else {
            args.cancel = true;
        }
    };
    SpellCheck.prototype._onMenuSelect = function (args) {
        var id = args.events.ID.split("_"), length;
        this._errorContent = $("#" + this._id).text().trim();
        this._errorHTML = $("#" + this._id).html().trim();
        var event = { selectedOption: id[0], requestType: "menuSelect", targetContent: this._errorHTML, selectedValue: this._selectedValue };
        if (this._trigger("contextClick", event)) {
            return false;
        }
        switch (id[0]) {
            case "AddToDictionary":
                var addWord = (this._selectedTarget.innerText || this._selectedTarget.textContent).trim();
                this.addToDictionary(addWord);
                break;
            case "IgnoreAll":
                var errorWord = (this._selectedTarget.innerText || this._selectedTarget.textContent).trim();
                this.model.ignoreWords.push(errorWord);
                var result = this.ignoreAll(errorWord, this._errorHTML);
                this._errorHTML = result["resultHTML"];
                $("#" + this._id).html(result["resultHTML"]);
                this._renderMenu(this);
                break;
            default:
                var selectedValue = id[0];
                this._selectedTarget.innerHTML = selectedValue;
                var replaceItem = document.createTextNode(this._selectedTarget.innerText || this._selectedTarget.textContent);
                this._selectedTarget.parentNode.insertBefore(replaceItem, this._selectedTarget);
                $(this._selectedTarget).remove();
                this._renderMenu(this);
                break;
        }
    };
    SpellCheck.prototype._renderMenu = function (proxy) {
        var length = $($(proxy.element)[0]).children("span").length;
        length > 0 ? proxy._statusFlag = true : proxy._statusFlag = false;
        this._renderContextMenu();
    };
    SpellCheck.prototype._getElement = function () {
        var spanTags = document.getElementsByTagName("span");
        var searchText = this._selectedValue;
        var found = [];
        for (var i = 0; i < spanTags.length; i++) {
            if (spanTags[i].textContent === searchText) {
                found.push(spanTags[i]);
            }
        }
        return found;
    };
    SpellCheck.prototype._alertClose = function () {
        if (!ej.isNullOrUndefined(this._alertWindow) && this._alertWindow.parents().find(".e-alertdialog").length > 0) {
            this._alertWindow.ejDialog("close");
            this._alertWindow.parents().find(".e-alertdialog").remove();
            this._close();
        }
    };
    SpellCheck.prototype._close = function () {
        if (!ej.isNullOrUndefined(this._spellCheckWindow) && this._spellCheckWindow.parents().find(".e-spellcheckparent").length > 0) {
            var contentAreaElement = this._spellCheckWindow.find(".e-sentence .e-sentencecontent");
            var updatedString = contentAreaElement.html();
            var event = { updatedText: contentAreaElement.text(), updatedHtml: updatedString, requestType: "dialogClose" };
            if (this._trigger("dialogClose", event)) {
                return false;
            }
            this._spellCheckWindow.ejDialog("close");
            if (contentAreaElement.html() === "undefined" || contentAreaElement.html() === "") {
                $("#" + this._id).html(ej.isNullOrUndefined($(this.element)[0].value) ? ($(this.element)[0].innerText || $(this.element)[0].textContent).trim() : $(this.element)[0].value.trim());
            }
            else {
                document.getElementById(this.element.attr("id")).tagName === "TEXTAREA" ? $("#" + this._id).val(updatedString) : $("#" + this._id).html(updatedString);
            }
            if (document.getElementById(this.element.attr("id")).tagName === "TEXTAREA") {
                var targetText = updatedString;
                var replaceString;
                for (var i = 0; i < this._errorWordsData.length; i++) {
                    replaceString = "<span class=\"errorspan " + this.model.misspellWordCss + "\">" + this._errorWordsData[i]["ErrorWord"] + "</span>";
                    replaceString = targetText.indexOf(replaceString) !== -1
                        ? replaceString
                        : "<span class=\"errorspan\">" + this._errorWordsData[i]["ErrorWord"] + "</span>";
                    targetText = targetText.replace(new RegExp(replaceString, "g"), this._errorWordsData[i]["ErrorWord"]);
                }
                $("#" + this._id).val(targetText);
            }
            else {
                this._removeSpan(this);
            }
            this._errorContent = contentAreaElement.text();
            this._spellCheckWindow.parents().find(".e-spellcheckparent").remove();
        }
    };
    SpellCheck.prototype._changeErrorWord = function (args) {
        var selectedValue = $("#" + this._id + "_Suggestions").ejListBox("option", "value");
        var targetText = this._spellCheckWindow.find(".e-sentence .e-sentencecontent")[0].innerHTML;
        var errorWord = $(this._spellCheckWindow.find(".e-sentence .e-sentencecontent").find("." + this.model.misspellWordCss)[0]).text().trim();
        var result;
        selectedValue = selectedValue === this._localizedLabels.NoSuggestionMessage ? errorWord : selectedValue;
        if (args.model.text === this._localizedLabels.AddToDictionary) {
            this._errorHTML = targetText;
            this._errorContent = this._spellCheckWindow.find(".e-sentence .e-sentencecontent")[0].innerText || this._spellCheckWindow.find(".e-sentence .e-sentencecontent")[0].textContent;
            this.addToDictionary(errorWord);
        }
        else {
            if (args.model.text === this._localizedLabels.IgnoreOnceButtonText) {
                result = this.ignore(errorWord, targetText, null);
                if (result !== false)
                    this._updateErrorWord(this, result, args, errorWord, null, "ignore");
            }
            else if (args.model.text === this._localizedLabels.IgnoreAllButtonText) {
                result = this.ignoreAll(errorWord, targetText);
                if (result !== false)
                    this._updateErrorWord(this, result, args, errorWord, null, "ignoreAll");
            }
            else if (args.model.text === this._localizedLabels.ChangeButtonText) {
                result = this.change(errorWord, targetText, selectedValue, null);
                if (result !== false)
                    this._updateErrorWord(this, result, args, errorWord, selectedValue, "change");
            }
            else if (args.model.text === this._localizedLabels.ChangeAllButtonText) {
                result = this.changeAll(errorWord, targetText, selectedValue);
                if (result !== false)
                    this._updateErrorWord(this, result, args, errorWord, selectedValue, "changeAll");
            }
        }
    };
    SpellCheck.prototype._convertData = function (result, type) {
        var data = [];
        for (var i = 0; i < result.length; i++) {
            if (type === "dictionaryData") {
                data.push({ field: result[i] });
            }
            else if (type === "menuData") {
                data.push({ id: result[i], text: result[i] });
            }
        }
        return data;
    };
    SpellCheck.prototype._updateErrorWord = function (proxy, result, event, errorWord, selectedValue, requestType) {
        var listBoxElement = this._spellCheckWindow.find(".e-suggesteditems");
        proxy._spellCheckWindow.find(".e-sentence .e-sentencecontent")[0].innerHTML = result["resultHTML"];
        var errorWordElement = this._spellCheckWindow.find(".e-sentence .e-sentencecontent").find(".errorspan");
        var listObj;
        if (errorWordElement.length > 0) {
            if (requestType === "changeAll") {
                for (var i = 0; i < errorWordElement.length; i++) {
                    var spanText = errorWordElement[i].innerText || errorWordElement[i].textContent;
                    if (spanText === errorWord) {
                        $(errorWordElement[i]).replaceWith(selectedValue);
                    }
                }
            }
            for (var j = 0; j < this.model.ignoreWords.length; j++) {
                for (var k = 0; k < errorWordElement.length; k++) {
                    var elementText = errorWordElement[k].innerText || errorWordElement[k].textContent;
                    if (elementText === this.model.ignoreWords[j]) {
                        $(errorWordElement[k]).replaceWith(elementText);
                    }
                }
            }
            this._listBoxDataUpdate(this);
        }
        else {
            var noSuggestion = [this._localizedLabels.NoSuggestionMessage];
            listBoxElement.ejListBox({ selectedItemIndex: null });
            listBoxElement.ejListBox({
                dataSource: this._convertData(noSuggestion, "dictionaryData"),
                selectedItemIndex: 0
            });
            listObj = $("#" + this._id + "_Suggestions").data("ejListBox");
            listObj.refresh();
            var updateevent = { targetText: result["resultHTML"], requestType: "changeErrorWord" };
            if (this._trigger("complete", updateevent)) {
                return false;
            }
            this._statusFlag = false;
            this._alertWindowRender("validating");
        }
    };
    SpellCheck.prototype._setModel = function (options) {
        for (var prop in options) {
            if (options.hasOwnProperty(prop)) {
                switch (prop) {
                    case "locale":
                        this.model.locale = options[prop];
                        this._localizedLabels = ej.getLocalizedConstants("ej.SpellCheck", this.model.locale);
                        break;
                    case "misspellWordCss":
                        this.model.misspellWordCss = options[prop];
                        if (this.model.contextMenuSettings.enable) {
                            var oldMisspellWordCssClass = $(this.element[0]).find("span.errorspan").attr("class").toString().split(" ")[1];
                            $(this.element[0]).find("span.errorspan").removeClass(oldMisspellWordCssClass).addClass(this.model.misspellWordCss);
                        }
                        break;
                    case "contextMenuSettings":
                        $.extend(this.model.contextMenuSettings, options[prop]);
                        if (this.model.contextMenuSettings.enable) {
                            this.validate();
                        }
                        else {
                            !ej.isNullOrUndefined(this._contextMenu) && this._contextMenu.parent().remove();
                            this._removeSpan(this);
                        }
                        break;
                    case "ignoreSettings":
                        $.extend(this.model.ignoreSettings, options[prop]);
                        if (this.model.contextMenuSettings.enable) {
                            this.validate();
                        }
                        break;
                    case "dictionarySettings":
                        $.extend(this.model.dictionarySettings, options[prop]);
                        if (this.model.contextMenuSettings.enable) {
                            this.validate();
                        }
                        break;
                    case "maxSuggestionCount":
                        this.model.maxSuggestionCount = options[prop];
                        break;
                    case "ignoreWords":
                        this.model.ignoreWords = options[prop];
                        if (this.model.contextMenuSettings.enable) {
                            this.validate();
                        }
                        break;
                }
            }
        }
    };
    SpellCheck.prototype._getModelValues = function (proxy, targetText) {
        var spellModel = {
            ignoreAlphaNumericWords: proxy.model.ignoreSettings.ignoreAlphaNumericWords,
            ignoreEmailAddress: proxy.model.ignoreSettings.ignoreEmailAddress,
            ignoreHtmlTags: proxy.model.ignoreSettings.ignoreHtmlTags,
            ignoreMixedCaseWords: proxy.model.ignoreSettings.ignoreMixedCaseWords,
            ignoreUpperCase: proxy.model.ignoreSettings.ignoreUpperCase,
            ignoreUrl: proxy.model.ignoreSettings.ignoreUrl,
            ignoreFileNames: proxy.model.ignoreSettings.ignoreFileNames
        };
        var value = JSON.stringify({ model: spellModel, text: targetText });
        return value;
    };
    SpellCheck.prototype._getLocalizedLabels = function () {
        return ej.getLocalizedConstants(this["sfType"], this.model.locale);
    };
    return SpellCheck;
}(ej.WidgetBase));
ej.widget("ejSpellCheck", "ej.SpellCheck", new SpellCheck());
ej.SpellCheck.Locale = ej.SpellCheck.Locale || {};
ej.SpellCheck.Locale["default"] = ej.SpellCheck.Locale["en-US"] = {
    SpellCheckButtonText: "SpellCheck",
    NotInDictionary: "Not In Dictionary",
    SuggestionLabel: "Suggestions",
    IgnoreOnceButtonText: "Ignore Once",
    IgnoreAllButtonText: "Ignore All",
    AddToDictionary: "Add to Dictionary",
    ChangeButtonText: "Change",
    ChangeAllButtonText: "Change All",
    CloseButtonText: "Close",
    CompletionPopupMessage: "Spell check is complete",
    ErrorPopupMessage: "Spell check is not completed",
    CompletionPopupTitle: "Spell check alert",
    OK: "OK",
    NoSuggestionMessage: "No suggestions available"
};
;

});