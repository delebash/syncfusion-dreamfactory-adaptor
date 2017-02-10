/*!
*  filename: ej.maskedit.js
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
	
/**
* @fileOverview Plugin to style the Html input elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejMaskEdit", "ej.MaskEdit", {

        element: null,

        model: null,
        validTags: ["input"],
        _addToPersist: ["value"],
        _setFirst: false,
        type: "editor",
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions'],
            requireFormatters: true
        },

        defaults: {

            maskFormat: "",

            value: null,

            watermarkText: "",

            height: "",

            width: "",

            showError: false,

            htmlAttributes: {},

            cssClass: "",

            customCharacter: null,

            inputMode: "text",

            readOnly: false,

            textAlign: ej.TextAlign.Left,

            hidePromptOnLeave: false,

            showRoundedCorner: false,

            enablePersistence: false,

            enabled: true,

            showPromptChar: true,

            validationRules: null,

            validationMessage: null,

            keydown: null,

            keyup: null,

            keyPress: null,

            change: null,

            mouseover: null,

            mouseout: null,

            focusIn: null,

            focusOut: null,

            create: null,

            destroy: null

        },

        dataTypes: {
            maskFormat: "string",
            showError: "boolean",
            enabled: "boolean",
            customCharacter: "string",
            cssClass: "string",
            watermarkText: "string",
            showRoundedCorner: "boolean",
            showPromptChar: "boolean",
            inputMode: "enum",
            textAlign: "enum",
            hidePromptOnLeave: "boolean",
            readOnly: "boolean",
            validationRules: "data",
            validationMessage: "data",
            htmlAttributes: "data"
        },

        _setModel: function (jsondata) {
            for (var key in jsondata) {
                switch (key) {
                    case "value":
                        if (ej.isPlainObject(jsondata[key])) jsondata[key] = null;
                        this._setValue(jsondata[key]); jsondata[key] = this.get_UnstrippedValue(); this._raiseEvents("change", true); break;
                    case "width": this._setWidth(jsondata[key]); break;
                    case "height": this._setHeight(jsondata[key]); break;
                    case "watermarkText": this.model.watermarkText = jsondata[key]; this._changeWatermark(jsondata[key]); break;
                    case "showRoundedCorner": this._roundedCorner(jsondata[key]); break;
                    case "showPromptChar": this._setShowPrompt(jsondata[key]); break;
                    case "validationRules":
                        if (this.model.validationRules != null) {
                            this._hiddenInput.rules('remove');
                            this.model.validationMessage = null;
                        }
                        this.model.validationRules = jsondata[key];
                        if (this.model.validationRules != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "validationMessage":
                        this.model.validationMessage = jsondata[key];
                        if (this.model.validationRules != null && this.model.validationMessage != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "textAlign": this._setTextAlign(jsondata[key]); break;
                    case "inputMode": this._setInputMode(jsondata[key]); break;
                    case "maskFormat":
                        this.model.maskFormat = jsondata[key];
                        this._valueMapper();
                        this._setMask(jsondata[key]);
                        jsondata[key] = this.model.maskFormat;
                        break;
                    case "cssClass": this._setSkin(jsondata[key]); break;
                    case "readOnly": this._setReadOnly(jsondata[key]); break;
                    case "enabled": this.model.enabled = jsondata[key]; this._controlStatus(jsondata[key]); break;
                    case "htmlAttributes": this._addAttr(jsondata[key]); break;
                    case "hidePromptOnLeave": this.model.hidePromptOnLeave = jsondata[key];
                        if (this._textbox.value != "") {
                            if(this.model.hidePromptOnLeave) {
                                this._unStrippedMask = this._textbox.value;
                                this._textbox.value = this.get_UnstrippedValue();
                            }
                            else this._textbox.value = this._textbox.value.replace(/[ ]/g, '_');
                            this.model.value = this._textbox.value;
                        }
                }
            }
        },
        observables: ["value"],


        _destroy: function () {
            this.element.attr("name", this._hiddenInput.attr("name"));
            if (this._isWatermark) this.element.removeAttr("placeholder");
            this.element.insertAfter(this.wrapper);
            this.wrapper.remove();
            if (this.model.textAlign) this.element.css("text-align", "");
            this.element.val("").removeClass(' e-mask e-input e-disable').empty();
        },


        _init: function (options) {
            this._options = options;
            this._tempMask = this.model.maskFormat;
            if (this.element.is("input") && (this.element.is("input[type=text]") || this.element.is("input[type=password]") || !this.element.attr('type'))) {
                this._isWatermark = 'placeholder' in document.createElement('input');
                this._setValues();
                this._valueMapper();
                this._renderControl();
                this._initObjects();
                this._wireEvents();
				this._addAttr(this.model.htmlAttributes);
                if (this.model.validationRules != null) {
                    this._initValidator();
                    this._setValidation();
                }
            } else {
                this._destroy();
                return false;
            }
            if (options && options.value != undefined && this.model.value !== options.value)
                this._trigger("_change", { value: this.get_UnstrippedValue(), unmaskedValue: this.get_StrippedValue()});            
        },

        _initValidator: function () {
			(!this.element.closest("form").data("validator")) && this.element.closest("form").validate();
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                var keyName = key.toLowerCase();
                if (keyName == "class") proxy.wrapper.addClass(value);
                else if (keyName == "disabled" && value == "disabled") proxy.disable();
                else if (keyName == "readonly" && value == "readOnly") proxy._setReadOnly(true);
                else if (keyName == "style" || keyName == "id") proxy.wrapper.attr(key, value);
                else if (ej.isValidAttr(proxy.element[0], key)) proxy.element.attr(key, value);
                else proxy.wrapper.attr(key, value);
            });
        },
        _setValidation: function () {
            this._hiddenInput.rules("add", this.model.validationRules);
            var validator = this.element.closest("form").data("validator");
            validator = validator ? validator : this.element.closest("form").validate();
            name = this._hiddenInput.attr("name");
            validator.settings.messages[name] = {};
            for (var ruleName in this.model.validationRules) {
                var message = null;
                if (!ej.isNullOrUndefined(this.model.validationRules[ruleName])) {
                    if (!ej.isNullOrUndefined(this.model.validationRules["messages"] && this.model.validationRules["messages"][ruleName]))
                        message = this.model.validationRules["messages"][ruleName];
                    else {
                        validator.settings.messages[name][ruleName] = $.validator.messages[ruleName];
                        for (var msgName in this.model.validationMessage)
                            ruleName == msgName ? (message = this.model.validationMessage[ruleName]) : "";
                    }
                    validator.settings.messages[name][ruleName] = message != null ? message : $.validator.messages[ruleName];
                }
            }
        },

        _setShowPrompt:function(value){
            this.model.showPromptChar = value;
            this._textbox.value = this.model.showPromptChar ? this._unStrippedMask : this.get_UnstrippedValue();
        },

        _controlStatus: function (value) {
            value != true ? this.disable() : this.enable();
        },

        _setValues: function () {
            this._unStrippedMask = null;
            //Predefined character definitions
            this._charMap = {
                '9': "[0-9 ]",
                'a': "[A-Za-z0-9 ]",
                'A': "[A-Za-z0-9]",
                'N': "[0-9]",
                '#': "[0-9]",
                '&': '[^\x7f]+',
                '<': "",
                '>': "",
                'C': this.model.customCharacter != null ? "[" + this.model.customCharacter + "]" : "[A-Za-z ]",
                '?': "[A-Za-z]",
            };
        },

        _renderControl: function () {
            this.model.name = this.element.attr("name") != null ? this.element.attr("name") : (this.model.name != null ? this.model.name : this.element[0].id);
            if (this.element.attr("name") != null)
                this.element.removeAttr('name');
            this.wrapper = ej.buildTag("span.e-mask e-widget " + this.model.cssClass);
            this.innerWrapper = ej.buildTag("span.e-in-wrap e-box");
            this.wrapper.append(this.innerWrapper).insertBefore(this.element);
            this.innerWrapper.append(this.element);
            this._hiddenInput = ej.buildTag("input#" + this._id + "_hidden", "", {}, { type: "hidden" }).insertBefore(this.element);
            if (!this._isWatermark && this.model.inputMode != "password") {
                this._hiddenSpan = ej.buildTag("span.e-input e-placeholder ").insertAfter(this.element);
                this._hiddenSpan.text(this.model.watermarkText);
                this._hiddenSpan.css("display", "none");
                this._hiddenSpan.bind("mousedown", $.proxy(this._OnFocusHandler, this));
            }
            if(ej.isNullOrUndefined(this.model.value) && this.element[0].value != "") this.model.value =  this.element[0].value;
            this._hiddenInput.attr({ "name": this.model.name, "value": this.model.value });
            this.element.attr({ 'aria-invalid': false, 'value': this.model.value }).addClass('e-input');
            if (ej.isNullOrUndefined(this._options.inputMode) && !ej.isNullOrUndefined(this.element.attr("type")))
                this.model.inputMode = this.element.attr("type");
            else
                this._setInputMode(this.model.inputMode);
            this._setWidth(this.model.width);
            this._setHeight(this.model.height);
            this._roundedCorner(this.model.showRoundedCorner);
            this._setTextAlign(this.model.textAlign);
            this._setReadOnly(this.model.readOnly);
            this._controlStatus(this.model.enabled);
            this.previousValue = this.model.value;
        },

        _initObjects: function () {
            this._textbox = this.element[0];
            this._keypressFlag = 0;
            this._selectedTextKeyDown = 0;
            // KeyDown trace [ 0 - None, 1 - BackSpace, 2 - Delete]
            this._keydownFlag = 0;
            // Length of the Mask
            if (!(this.model.maskFormat.indexOf("\\") >= 0))
                this._maskLength = this.model.maskFormat.length;
            else {
                var _position = 0;
                for (var temp = 0; temp < this.model.maskFormat.length; temp++) {
                    if ((this.model.maskFormat[temp] == "\\"))
                        _position += 1;
                }
                this._maskLength = this.model.maskFormat.length - _position;
            }
            //Replacing all [9?$CANa*] to '_'           
            if (!(this.model.maskFormat.indexOf("\\") >= 0))
                this._maskModel = this.model.maskFormat.replace(/[9?CANa#&]/g, '_');
            else
                this._maskModel = this.model.maskFormat;

            if (this._maskModel.indexOf("<") >= 0 || this._maskModel.indexOf(">") >= 0) {
                this._maskModel = this._maskModel.replace(/[<>]/g, '');
                this.model.maskFormat = this.model.maskFormat.replace(/[<>]/g, '');
                this._valueMapper();
            }

            this._validatedValue = this._maskModel;
            if (this.model.inputMode != "password") {
                this._setValue(this.model.value);
                this._setWaterMark();
            }
            if (this.model.showError) {
                this.element.addClass("e-error").attr('aria-invalid', "true");
            }
        },


        _setWidth: function (value) {
            this.wrapper.width(value);
        },

        _setHeight: function (value) {
            this.wrapper.height(value);
        },

        _roundedCorner: function (value) {
            if (value && !this.innerWrapper.hasClass('e-corner')) {
                this.innerWrapper.addClass('e-corner');
            }
            else if (this.innerWrapper.hasClass('e-corner')) {
                this.innerWrapper.removeClass('e-corner');
            }
        },

        _setTextAlign: function (align) {
            if (align == "right") {
                this.wrapper.addClass('e-rtl');
            }
            else {
                this.wrapper.removeClass('e-rtl');
            }
        },

        _setInputMode: function (type) {
            this.element.attr('type', type);
        },

        _setReadOnly: function (bool) {
            this.model.readOnly = bool;
            if (bool) this.element.attr("readonly", true);
            else this.element.removeAttr("readonly");
        },

        _setSkin: function (skin) {
            this.wrapper.removeClass(this.model.cssClass);
            this.wrapper.addClass(skin);
        },

        _setWaterMark: function () {
            var formatValue = this.model.showPromptChar ? this._maskModel : (this._maskModel != "" && this._maskModel != null) ? this._maskModel.replace(/[_]/g, " ") : this._maskModel;
            if (!(this.model.maskFormat.indexOf("\\") >= 0))
                this._maskModel = $.trim(this.model.maskFormat.replace(/[9?CANa#&]/g, '_')) === "" ? null : this.model.maskFormat.replace(/[9?CANa#&]/g, '_');
            else
                this._maskModel = this.model.maskFormat === "" ? null : this.model.maskFormat;
            if ((this._maskModel != '' && this._textbox.value == formatValue) || (formatValue == '' && this._textbox.value == "") && this.model.inputMode != "password") this._textbox.value = "";
            if (this.model.watermarkText) {
                if (this._isWatermark)
                    this.element.attr("placeholder", this.model.watermarkText);
                else {
                    if (this._textbox.value) this._hiddenSpan.css("display", "none").text(this.model.watermarkText);
                    else this._hiddenSpan.css("display", "block").text(this.model.watermarkText);
                }
            }
            if (!this.model.watermarkText && !this._textbox.value && this.model.maskFormat) {
                if (!this.model.hidePromptOnLeave) this._textbox.value = formatValue;
            else { this._unStrippedMask = this._maskModel; this._textbox.value = this.get_UnstrippedValue(); }
            }
        },

        _changeWatermark: function (text) {
            if (!this.model.enabled) return false;
            var formatValue = this.model.showPromptChar ? this._maskModel : (this._maskModel != "" && this._maskModel != null) ? this._maskModel.replace(/[_]/g, " ") : this._maskModel;
            if ((this._textbox.value == formatValue || this._textbox.value == '' || $.trim(this.get_StrippedValue()) == "") && this.model.inputMode != "password") this._textbox.value = "";
            (this._isWatermark ? this.element.attr("placeholder", text) : this._hiddenSpan.text(text))
            if (!this.model.watermarkText && $.trim(this.get_StrippedValue()) == "" && this.model.maskFormat) {
                if (!this.model.hidePromptOnLeave) this._textbox.value = formatValue;
                else { this._unStrippedMask = this._maskModel; this._textbox.value = this.get_UnstrippedValue(); }
            }
        },

        _showAlert: function () {
            var ptr = this;
            this.element.addClass("e-error").attr('aria-invalid', "true").animate({ Opacity: 1 }, 700, null, function () {
                $(ptr._textbox).removeClass("e-error").attr('aria-invalid', "false");
            });
        },

        _unMask: function () {
            var tempValue = this.model.value;
            var tempModel = "";
            var valueIndex = -1, maskIndex = i = 0, chr, prompt = "_", rule;
            while (maskIndex < this._rules.length) {
                chr = tempValue[i];
                rule = this._rules[maskIndex];
                if (chr == undefined) break;
                if (chr === rule || chr === prompt) {
                    tempModel += chr === prompt ? prompt : "";
                    i += 1;
                    maskIndex += 1;
                }
                else if (this._rules[maskIndex].rule != undefined && chr.match(this._rules[maskIndex].rule)) {
                    var charCode = tempValue.charCodeAt(i);
                    if (this._validateChars(charCode, maskIndex)) {
                        tempModel += tempValue.charAt(i);
                        maskIndex++;
                        i++;
                    } else maskIndex++;
                } 
                else if (typeof rule !== "string") {
                    if (chr.match(this._rules[maskIndex].rule)) {
                        var charCode = tempValue.charCodeAt(i);
                        if (this._validateChars(charCode, maskIndex)) {
                            tempModel += tempValue.charAt(i);
                            maskIndex++;
                            i++;
                        }
                    } else i++;
                } else maskIndex++;
                if (i > tempValue.length) break;
            }
            return tempModel;
        },

        _validateValue: function () {
            if (ej.isNullOrUndefined(this.model.value)) return;
            var tempValue = this.model.value;
            var tempModel = this._maskModel;
            var valueIndex = -1, maskIndex = i = 0, chr, prompt = "_", rule;
            var oldvalue = this._unMask();
            if (!this._isWatermark && this.model.inputMode != "password")
                this._hiddenSpan.css("display", "none");
            // Check if Mask is Empty display the text
            if (this._maskLength == 0) {
                this._textbox.value = tempValue;
                this._setWaterMark();
                return true;
            }
            else {
                var replacestring = this.model.value.toString();
                if (!((this.model.maskFormat.indexOf("\\") >= 0)) && this.model.customCharacter == null)
                    tempValue = this.model.value = replacestring.replace(/[\(\)-]/g, "");
                else
                    tempValue = this.model.value;
            }

            while (maskIndex < this._rules.length) {
                chr = oldvalue[i];
                rule = this._rules[maskIndex];
                if (chr == undefined) break;
                if (chr === rule || chr === prompt) {
                    chr === prompt ? prompt : "";
                    var strBefore = tempModel.substring(0, maskIndex);
                    var strAfter = tempModel.substring(maskIndex);
                    tempModel = strBefore + chr + strAfter.substr(1, strAfter.length);
                    i += 1;
                    maskIndex += 1;
                }
                else if (this._rules[maskIndex].rule != undefined && chr.match(this._rules[maskIndex].rule)) {
                    var charCode = oldvalue.charCodeAt(i);
                    if (this._validateChars(charCode, maskIndex)) {
                        var strBefore = tempModel.substring(0, maskIndex);
                        var strAfter = tempModel.substring(maskIndex);
                        tempModel = strBefore + oldvalue.charAt(i) + strAfter.substr(1, strAfter.length);
                        maskIndex++;
                        i++;
                    } else maskIndex++;
                } 
                else if (typeof rule !== "string") {
                    if (chr.match(this._rules[maskIndex].rule)) {
                        var charCode = oldvalue.charCodeAt(i);
                        if (this._validateChars(charCode, maskIndex)) {
                            var strBefore = tempModel.substring(0, maskIndex);
                            var strAfter = tempModel.substring(maskIndex);
                            tempModel = strBefore + oldvalue.charAt(i) + strAfter.substr(1, strAfter.length);
                            maskIndex++;
                            i++;
                        } else maskIndex++;
                    } else {
                        var strBefore = tempModel.substring(0, maskIndex);
                        var strAfter = tempModel.substring(maskIndex);
                        tempModel = strBefore + prompt + strAfter.substr(1, strAfter.length);
                        i++;
                        maskIndex++;
                    }
                } else maskIndex++;
                if (i > tempValue.length) break;
            }
            if (this.model.value) {
                this._textbox.value = tempModel;
                this.model.value = this.get_UnstrippedValue();
                if (!((this.model.maskFormat.indexOf("\\") >= 0) || (this.model.maskFormat.indexOf("&") >= 0))) {
                    if (!this.model.hidePromptOnLeave) this._textbox.value = tempModel;
                    else { this._unStrippedMask = tempModel.replace(/[ ]/g, '_'); this._textbox.value = tempModel; }
                }         
                else {
                    this._textbox.value = "";
                    var _tPos = 0;
                    for (_pos = 0; _pos < this.model.maskFormat.length; _pos++) {
                        if (this.model.maskFormat[_pos] == "\\")
                            _tPos += 1;
                    }
                    var _position = 0;
                    if (this.model.value.length == tempModel.length - _tPos) {
                        for (var pos = 0; pos < this.model.maskFormat.length; ++pos) {
                            if (this.model.maskFormat[pos] == "\\")
                                _position = _position + 1;
                            else if (this.model.maskFormat[pos - 1] == "\\")
                                this._textbox.value += tempValue[pos - _position];
                            else if (!(this.model.maskFormat[pos] == "\\")) {
                                if (tempValue.length <= pos - _position)
                                    this._textbox.value += tempModel[pos].replace(/[9?CANa#&]/g, '_');
                                else
                                    this._textbox.value += tempValue[pos - _position].replace(/[9?CANa#&]/g, '_');
                            }

                        }
                    }
                    else {
                        this._textbox.value = "";
                        for (var pos = 0; pos < this.model.maskFormat.length; ++pos) {
                            if (this.model.maskFormat[pos - 1] == "\\")
                                this._textbox.value += tempModel[pos];
                            else if (!(this.model.maskFormat[pos] == "\\"))
                                this._textbox.value += tempModel[pos].replace(/[9?CANa#&]/g, '_');
                        }
                    }

                }
            }
            else {
                if (!(this.model.maskFormat.indexOf("\\") >= 0))
                    this._textbox.value = this.model.maskFormat.replace(/[9?CANa#&]/g, '_');
                else {
                    for (var pos = 0; pos < this.model.maskFormat.length; ++pos) {
                        var val;
                        if (this.model.maskFormat[pos - 1] == "\\")
                            this._textbox.value += this.model.maskFormat[pos];

                        else if (!(this.model.maskFormat[pos] == "\\"))
                            this._textbox.value += this.model.maskFormat[pos].replace(/[9?CANa#&]/g, '_');

                    }
                }
            }
            if (this._textbox.value != undefined && this.model.hidePromptOnLeave) {
                this._unStrippedMask = this._textbox.value.replace(/[ ]/g, '_');
                this._textbox.value = this.get_UnstrippedValue();
            }
            if (this._textbox.value.indexOf(">") >= 0 || this._textbox.value.indexOf("<") >= 0) {
                this._textbox.value = this._textbox.value.replace(/[<>]/g, '');
                this._tempMask = this.model.maskFormat;
                this.model.maskFormat = this.model.maskFormat.replace(/[<>]/g, '');                
            }
            if (!this.model.showPromptChar)
                this._textbox.value = this.get_UnstrippedValue();
            // Update the character to upper and lower case.
            if (this._tempMask != null) {
                for (var i = 0; i < this._textbox.value.length; i++) {
                    var tempkey = this._updateCasing(this._textbox.value[i], i);
                    if (!ej.isNullOrUndefined(tempkey))
                        this._textbox.value = this._textbox.value.substring(0, i) + tempkey + this._textbox.value.substring(i + tempkey.length);
                }
            }
            
            this._setWaterMark();
        },


        _selectionText: function (begin, end) {
            var replaceValue = !ej.isNullOrUndefined(this._maskModel)?this._maskModel.substring(begin, end):"";
            this._textbox.value = this._textbox.value.substring(0, begin) + replaceValue + this._textbox.value.substring(end);
            if (this._keydownFlag == 1) {
                this._setCaretPosition(begin);
                return begin;
            }
            else if (this._keydownFlag == 2) {
                this._setCaretPosition(end);
                return end;
            }
            return begin;
        },


        _caretPosition: function (textbox) {
            var caretPos = 0;
            // Microsoft supports only IE for using document.selection
            if (document.selection) {
                // Create a Range of selected position
                var selectedRange = document.selection.createRange();
                var selectionLength = selectedRange.text.length;
                // Move selection start to 0 position
                selectedRange.moveStart('character', -textbox.value.length);
                // Get caret position by selection length, becoz now range is from Zero to current focus
                caretPos = selectedRange.text.length - selectionLength;
                if (selectionLength != 0) {
                    caretPos = this._selectionText(caretPos, selectedRange.text.length);
                    this._selectedTextKeyDown = 1;
                }
            }
            // For Firefox
            else if (textbox.selectionStart || textbox.selectionStart == '0') {
                caretPos = textbox.selectionStart;
                if (textbox.selectionStart != textbox.selectionEnd) {
                    if (this._keydownFlag)
                        caretPos = this._selectionText(textbox.selectionStart, textbox.selectionEnd);
                    this._selectedTextKeyDown = 1;
                }
            }
            return (caretPos);
        },


        _setCaretPosition: function (caretPos) {
            var element = this._textbox;
            //For IE
            if (window.navigator.appName == "Microsoft Internet Explorer") {
                if (element.createTextRange) {
                    var range = element.createTextRange();
                    range.move('character', caretPos);
                    range.select();
                }
            }
            else
            /* For FireFox and Chrome */
                if (element.selectionStart || element.selectionStart == '0') {
                    element.focus();
                    element.setSelectionRange(caretPos, caretPos);
                }
                else
                    element.focus();
        },


        _validateChars: function (keyChar, caretPos) {
            var charmap = this._charMap, match = false;
            if (this.model.maskFormat.indexOf("\\") >= 0) {
                _position = this._getCunrrentPos(caretPos);
                var maskChar = this.model.maskFormat.substr(caretPos + _position, 1);
            }
            else
                var maskChar = this.model.maskFormat.substr(caretPos, 1);
            var customChar = this.model.customCharacter;
            var actualkey = String.fromCharCode(keyChar);
            $.each(charmap, function (key, value) {
                if (maskChar == key) {
                    if (customChar != null) {
                        if (key == "C")
                            value = "[" + customChar + "]";
                        else if (key == "A" || key == "N" || key == "#")
                            value = value.replace(("]"), "") + customChar + "]";
                    }
                    if (actualkey.match(new RegExp(value))) match = true;
                    else match = false;
                }
            });
            return match;
        },


        _seekNext: function () {
            var currentPos = this._caretPosition(this._textbox);
            var tempPos = currentPos;
            var seekFlag = true;
            //seeking the focus to next valid position on right of MaskEdit TextBox
            while (seekFlag) {
                if (currentPos >= 0 && currentPos < this._maskLength) {
                    var _position = 0;
                    for (var temp = 0; temp <= currentPos; temp++) {
                        if ((this.model.maskFormat[temp] == "\\"))
                            _position += 1;
                    }
                    if (this.model.maskFormat.charAt(currentPos) != "C") {
                        if (this.model.maskFormat.indexOf("\\") >= 0) {
                            if (this.model.maskFormat.charAt(currentPos + _position) != "\\" && this.model.maskFormat.charAt(currentPos + _position - 1) != "\\") {
                                if (!this._charMap[this.model.maskFormat.charAt(currentPos + _position)]) {
                                    this._setCaretPosition(currentPos);
                                    currentPos++;
                                }
                            }
                        }
                        else {
                            if (!this._charMap[this.model.maskFormat.charAt(currentPos)]) {
                                this._setCaretPosition(currentPos);
                                currentPos++;
                            }
                        }
                        if (currentPos != tempPos) {
                            tempPos = currentPos;
                            continue;
                        }
                    }
                }
                seekFlag = false;
            }
            return currentPos;
        },


        _seekBefore: function (caretPos) {
            var currentPos = this._caretPosition(this._textbox);
            var tempPos = --currentPos;
            var seekFlag = true;
            // Stop Seek when backspace of select more than a char
            if (this._selectedTextKeyDown == 1)
                seekFlag = false;
            //seeking the focus to next valid position on left of MaskEdit TextBox
            while (seekFlag) {
                if (currentPos >= 0 && currentPos < this._maskLength) {
                    if (this.model.maskFormat.charAt(currentPos) != "C") {
                        if (!this._charMap[this.model.maskFormat.charAt(currentPos)]) {
                            this._setCaretPosition(--currentPos);
                        }
                    }
                    if (currentPos != tempPos) {
                        tempPos = currentPos;
                        continue;
                    }
                }
                seekFlag = false;
            }
            return currentPos;
        },


        _writeBuffer: function (key, cursorPos) {
            if (cursorPos <= this._maskLength) {
                var input = this._textbox.value;
                if (this._tempMask != null)
                    var tempkey = this._updateCasing(key, cursorPos);
                key = (tempkey == undefined) ? key : tempkey;
                var strBeforeCursor = input.substring(0, cursorPos);
                var strAfterCursor = input.substring(cursorPos);
                if (this.model.maskFormat.indexOf("\\") >= 0) {
                    var _position = 0;
                    for (var temp = 0; temp <= cursorPos; temp++) {
                        if ((this.model.maskFormat[temp].indexOf("\\") >= 0) && (cursorPos != 0))
                            _position += 1;
                    }
                    if (this.model.maskFormat[cursorPos + _position].indexOf("\\") >= 0)
                        this._textbox.value = strBeforeCursor + input[cursorPos] + strAfterCursor.substr(1, strAfterCursor.length);
                    else
                        this._textbox.value = strBeforeCursor + key + strAfterCursor.substr(1, strAfterCursor.length);
                }
                else
                    this._textbox.value = strBeforeCursor + key + strAfterCursor.substr(1, strAfterCursor.length);
                this._setCaretPosition(cursorPos + 1);
            }
        },

        _updateCasing: function (key, pos) {
            for (var i = 0; i < pos + 1; i++) {
                if (this._tempMask.substr(i, 1) == '<' || this._tempMask.substr(i, 1) == '>')
                    pos++;
            }

            for (var j = pos; j > -1; j--) {
                if (this._tempMask.substr(j, 1) == '<') {
                    return key.toLowerCase();
                }
                else if (this._tempMask.substr(j, 1) == '>') {
                    return key.toUpperCase();
                }
            }
        },


        get_StrippedValue: function () {
            var i, value, mask = this.model.maskFormat, stripVal = null;
            value = (this._textbox.value == "" && this.model.inputMode != "password") ? this._maskModel : this._textbox.value;
            if (mask.length == 0) return value;
            var _position = 0;
            for (var i = 0; i < mask.length; i++) {
                stripVal = $.trim(stripVal);
                if ((this.model.maskFormat.indexOf("\\") >= 0)) {
                    if ((this.model.maskFormat[i] == "\\"))
                        _position += 1;
                    else if (this.model.maskFormat[i - 1] == "\\")
                        stripVal += this._textbox.value[i - _position];
                    else {
                        var char = mask[i], exp = null;

                        if ("9?$a*".indexOf(char) != -1)
                            exp = this._charMap[char];
                        else if (char == "A" || char == "N" || char == "#")
                            exp = this._charMap[char].replace(("]"), "") + this.model.customCharacter + "]";
                        else if (char == "C")
                            exp = "[" + this.model.customCharacter + "]";
                        else if (char == "&")
                            stripVal += value[i - _position];
                        if (exp && value[i - _position] && value[i - _position].match(new RegExp(exp)))
                            stripVal += value[i - _position];
                    }

                }
                else {
                    var char = mask[i], exp = null;

                    if ("9?$a*".indexOf(char) != -1)
                        exp = this._charMap[char];
                    else if (char == "A" || char == "N" || char == "#")
                        exp = this._charMap[char].replace(("]"), "") + this.model.customCharacter + "]";
                    else if (char == "C")
                        exp = "[" + this.model.customCharacter + "]";
                    else if (char == "&")
                        stripVal += value[i - _position];
                    if (exp && value[i] && value[i].match(new RegExp(exp)))
                        stripVal += value[i];
                }
            }
            return stripVal;
        },


        get_UnstrippedValue: function () {
            var value = (this._textbox.value == "" && this.model.inputMode != "password") ? this._maskModel : this._textbox.value, unstripVal = null;
            if (this.model.maskFormat.length == 0) return value;

            if (value != undefined)
                unstripVal = $.trim(value.replace(/[_]/g, " ")) == "" ? null : value.replace(/[_]/g, " ");
            return unstripVal;
        },

        _setValue: function (value) {
            if (ej.isNullOrUndefined(value) || $.trim(value) == "") value = null;
            this.model.value = value;
            if (!this._isWatermark && this.model.inputMode != "password")
                this._hiddenSpan.css("display", "none");
            if (!ej.isNullOrUndefined(this.model.maskFormat) && this.model.maskFormat != "") {
                this._validateValue();
                if (ej.isNullOrUndefined(this.model.value)) { 
                    this._textbox.value = ej.isNullOrUndefined(value) ? "" : value; 
                    this._unStrippedMask = this._maskModel; 
                }
            }
            else { this._textbox.value = ej.isNullOrUndefined(value) ? "" : value;  this._unStrippedMask = this._textbox.value; }
            this._setWaterMark();
        },


        _valueMapper: function () {
            var mapper = [], mapperIdx = 0, mask = this.model.maskFormat || "", maskChars = mask.split(""), i = 0, chr;
            var emptyMask = "", rule, rules = this._charMap, promptChar = "_";

            for (; i < mask.length; i++) {
                chr = maskChars[i];
                rule = rules[chr];
                if (rule) {
                    mapper[mapperIdx] = { rule: rule };
                    emptyMask += promptChar;
                    mapperIdx += 1;
                } else {
                    if (chr === "\\") {
                        idx += 1;
                        chr = maskChars[idx];
                    }
                    chr = chr.split("");
                    for (var j = 0; j < chr.length; j++) {
                        mapper[mapperIdx] = chr[j];
                        emptyMask += chr[j];
                        mapperIdx += 1;
                    }
                }
            }
            this._rules = mapper;
            this._emptyMask = emptyMask;
            this._maskLength = emptyMask.length;
        },

        _setMask: function (maskValue) {
            this._maskLength = maskValue.length;
            this.model.maskFormat = maskValue;
            this._tempMask = this.model.maskFormat;
            this._maskModel = maskValue.replace(/[9?CANa]/g, '_');
            if (this._maskModel.indexOf("<") >= 0 || this._maskModel.indexOf(">") >= 0) {
                this._maskModel = this._maskModel.replace(/[<>]/g, '');
                this.model.maskFormat = this.model.maskFormat.replace(/[<>]/g, '');
            }            
            if (!ej.isNullOrUndefined(this.model.maskFormat) && this.model.maskFormat != "") 
                this._validateValue();
            else if (!this.model.watermarkText && this._textbox.value != this._maskModel) {
                if (!this.model.maskFormat) {
                    unstripVal = this._unStrippedMask.replace(/[_]/g, " ");
                    this._textbox.value = (this.model.customCharacter == null) ? $.trim(unstripVal.replace(/[\(\)-]/g, "")) : $.trim(unstripVal);
                    this._unStrippedMask = this._textbox.value;
                }
                else if (this.model.hidePromptOnLeave) {
                    this._textbox.value = this._maskModel;
                    this._unStrippedMask = this._textbox.value;
                    this._textbox.value = this.get_UnstrippedValue();
                }
                else this._textbox.value = this._maskModel;
            }
        },

        enable: function () {
            this.element.disabled = false;			
            this.element.removeAttr("disabled").removeClass('e-disable').attr({ "aria-disabled": false });
			this.wrapper.removeClass('e-disable-wrap');
            this.model.enabled = true;
        },

        disable: function () {
            this.element.disabled = true;
            this.element.attr("disabled", "disabled").addClass('e-disable').attr({ "aria-disabled": true });
			this.wrapper.addClass('e-disable-wrap');
            this.model.enabled = false;
        },

        clear: function () {
            this._textbox.value = this.model.maskFormat.replace(/[9?aCAN]/g, '_');
        },

        _wireEvents: function () {
            this._on(this.element, 'focus', this._OnFocusHandler);
            this._on(this.element, 'blur', this._OnBlurHandler);
            this._on(this.element, 'keydown', this._OnKeyDownHandler);
            this._on(this.element, 'keypress', this._OnKeyPressHandler);
            this._on(this.element, 'keyup', this._OnKeyUpHandler);
            this._on(this.element, 'mouseover', this._OnMouseOverHandler);
            this._on(this.element, 'mouseout', this._OnMouseOutHandler);
            this._on(this.element, 'paste', this._OnPasteHandler);
            this._on(this.element, 'cut', this._OnCutHandler);
        },

        _OnCutHandler: function (e) {
            var selectedValue = !ej.isNullOrUndefined(this._maskModel)?this._maskModel.substring(this._textbox.selectionStart, this._textbox.selectionEnd):"";
            var beforeSelection = this._textbox.value.substring(0, this._textbox.selectionStart);
            var afterSelection = this._textbox.value.substring(this._textbox.selectionEnd);
            var cursorPosition = this._textbox.selectionStart;
            var context = this;
            setTimeout(function () {
                context._textbox.value = beforeSelection + selectedValue + afterSelection;
                context._setCaretPosition(cursorPosition);
                context._raiseEvents("change");
            }, 0);
        },


        _OnPasteHandler: function (e) {
            var context = this;
            setTimeout(function () {
                var text = $(context._textbox).val();
                context._setValue(text);
                context._raiseEvents("change");
            }, 0);
            return true;
        },


        _OnFocusHandler: function (e) {
            this.wrapper.addClass("e-focus");
            var formatValue = this.model.showPromptChar ? this._maskModel : (this._maskModel != "" && this._maskModel != null) ? this._maskModel.replace(/[_]/g, " ") : this._maskModel;
            if (this.model.readOnly)
                return;
            if (!this._isWatermark && this.model.inputMode != "password")
                this._hiddenSpan.css("display", "none");
            if (this._textbox.value == "" && this._maskModel != "" && this.model.inputMode != "password")
                if (this.model.maskFormat.indexOf("\\") >= 0) {
                    this._textbox.value = this.model.watermarkText;
                }
                else
                    this._textbox.value = ej.isNullOrUndefined(this._maskModel) ? "" : formatValue;
            if (this._textbox.value.indexOf("<") >= 0 || this._textbox.value.indexOf(">") >= 0) {
                this._textbox.value = this._textbox.value.replace(/[<>]/g, '');
                this._maskModel = this._textbox.value;
                this._tempMask = this.model.maskFormat;
                this.model.maskFormat = this.model.maskFormat.replace(/[<>]/g, '');
            }

            if (this._textbox.value != formatValue && this._unStrippedMask != null && this.model.hidePromptOnLeave)
                this._textbox.value = this._unStrippedMask;

            if (!this.model.showPromptChar) this._textbox.value = this.get_UnstrippedValue();

            $.fn.selectRange = function (start, end) {
                return this.each(function () {
                    if (this.setSelectionRange) {
                        this.focus();
                        this.setSelectionRange(start, end);
                    } else if (this.createTextRange) {
                        var range = this.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', end);
                        range.moveStart('character', start);
                        range.select();
                    }
                });
            };
            if (this.model.maskFormat) {
                $(this.element).selectRange(0, 0);
            }

            this._raiseEvents("focusIn");
        },

        _OnBlurHandler: function (e) {
            this.wrapper.removeClass("e-focus");            
            this.model.value = this.get_StrippedValue();
            var dup = new Array();
            var option = new Array();
            if ((this._textbox.value.indexOf('_') != -1 || this._textbox.value.indexOf(' ') != -1)&& !ej.isNullOrUndefined(this.model.value)) {
                for (var i = 0; i < this.model.maskFormat.length; i++) {
                    if ((this.model.maskFormat[i] == "A") || (this.model.maskFormat[i] == "?")) dup.push(i);
                    else if ((this.model.maskFormat[i] == "9") || (this.model.maskFormat[i] == "a") || (this.model.maskFormat[i] == "C")) {
                        option.push(i);
                    }
                }
                for (var i = 0; i < dup.length; i++) {
                    if (this._textbox.value[dup[i]] === "_") {
                        this._showAlert();
                        this.model.value = this._textbox.value;
                    }
                }
                for (var i = 0; i < option.length; i++) {
                    if ((this.model.value[option[i]] == "_") || (this.model.value[option[i]] == " ")) {
                        this.model.value = this.model.value.substr(0, option[i]) + this.model.value.substr(option[i] + 1, this.model.value.length)
                        for (var j = i; j < option.length; j++) {
                            option[j] = option[j] - 1;
                        }
                    }
                }
            }
            this.model.value = (this.model.value != null) ? this.model.value.replace(/\s+/g, "") : this.model.value;
            if (this._textbox.value != undefined && (this.model.watermarkText == "" || (this.model.watermarkText != "" && this.model.value != ""))) {
                if (this.model.hidePromptOnLeave) {
                    this._unStrippedMask = this._textbox.value;
                    this._textbox.value = this.get_UnstrippedValue();
                }
                else this._unStrippedMask = this._textbox.value;
            }
            if (this.model.inputMode != "password")
                this._setWaterMark();
            this._raiseEvents("change");
            this._raiseEvents("focusOut");
        },


        _OnKeyDownHandler: function (e) {
            if (this.model.readOnly) return;
            this._keypressFlag = 0;
            this._raiseEvents("onKeyDown", null, { keyCode: e.keyCode, altKey: e.altKey, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, originalArgs: e });

            this.element.removeClass("error");

            if (this._maskLength == 0)
                return true;

            var unicode = e.keyCode ? e.keyCode : e.charCode;
            var actualkey = String.fromCharCode(unicode);
            var currentPos = this._seekNext();
            var promptChar = this.model.showPromptChar ? "_" : " ";
            var val = ej.browserInfo().name;
            if ((val == "msie") && (this._textbox.value == "")) {
                if (!(this.model.maskFormat.indexOf("\\") >= 0))
                    this._textbox.value = this.model.maskFormat.replace(/[9?CANa#&]/g, '_');
                else {
                    for (var pos = 0; pos < this.model.maskFormat.length; ++pos) {
                        var val;
                        if (this.model.maskFormat[pos - 1] == "\\")
                            this._textbox.value += this.model.maskFormat[pos];
                        else

                            if (!(this.model.maskFormat[pos] == "\\"))
                                this._textbox.value += this.model.maskFormat[pos].replace(/[9?CANa#&]/g, '_');
                    }
                }
                this._setCaretPosition(currentPos);
            }

            if (unicode >= 35 && unicode <= 41) {
                if (window.navigator.appCodeName == "Mozilla" || window.navigator.appCodeName == "opera") {
                    this._keypressFlag = 1;
                }
            }
            if (e.shiftKey && (e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 46 || e.keyCode == 127) || (e.ctrlKey && (e.keyCode == 86 || e.keyCode == 65 || e.keyCode == 67 || e.keyCode == 88))) {
                this._keypressFlag = 1;
                return;
            }
            else if (unicode == 8) {

                if (this.model.inputMode != "password") {
                    this._keydownFlag = 1;
                    // Seek to next valid position
                    var currentPos = this._seekBefore();
                    if (!this._selectedTextKeyDown) {
                        if (currentPos >= 0 && currentPos < this._maskLength)
                            this._writeBuffer(promptChar, currentPos);                       
                        this._setCaretPosition(currentPos);
                    }
                    else if (!this.model.showPromptChar && this._selectedTextKeyDown)
                    {                        
                        this._textbox.value = this.get_UnstrippedValue();
                        this._setCaretPosition(currentPos+1);
                    }
                    this._keydownFlag = 0;
                    this._selectedTextKeyDown = 0;
                    e.preventDefault();
                    return false;
                }
                this._keypressFlag = 1;
                return true;
            }
            else if (e.keyCode == 46 || e.keyCode == 127) {
                if (this.model.inputMode != "password") {
                    this._keydownFlag = 2;
                    // Seek to next valid position
                    currentPos = this._seekNext();
                    if (!this._selectedTextKeyDown) {
                    if (currentPos >= 0 && currentPos < this._maskLength) {                        
                        _position=this. _getCunrrentPos(currentPos);
                            if (!((this.model.maskFormat[currentPos + _position] == "&")))
                                this._writeBuffer(promptChar, currentPos);
                        }
                    }
                    else if (!this.model.showPromptChar && this._selectedTextKeyDown) {
                        this._textbox.value = this.get_UnstrippedValue();
                        this._setCaretPosition(currentPos);
                    }
                    this._keydownFlag = 0;
                    this._selectedTextKeyDown = 0;
                    e.preventDefault();
                    return false;
                }
                this._keypressFlag = 1;
                return true;
            }
        },


        _ErrorHandler: function (currentPos) {
            var promptChar = this.model.showPromptChar ? "_" : " ";
            if (this._textbox.value == "") this._textbox.value = this.model.maskFormat.replace(/[9?$CANa*]/g, promptChar);
            this._setCaretPosition(currentPos);
            this._showAlert();
        },
        _getCunrrentPos: function (currentPos) {
            var _position = 0;
            for (var temp = 0; temp <= currentPos + _position; temp++) {
                if ((this.model.maskFormat[temp] == "\\"))
                    _position += 1;
            }
            return _position;
        },


        _OnKeyPressHandler: function (e) {
            if (this.model.readOnly) return;
            this._raiseEvents("keyPress", null, { keyCode: e.keyCode, altKey: e.altKey, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, originalArgs: e });
            if (this._maskLength == 0)
                return true;

            var unicode = e.keyCode ? e.keyCode : e.charCode;
            var actualkey = String.fromCharCode(unicode);
            var promptChar = this.model.showPromptChar ? "_" : " ";
            var currentPos = this._seekNext();
            var val = ej.browserInfo().name;
            if (this._validateChars(unicode, currentPos)) {
                if (((val == "mozilla") || (val == "opera")) && (e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37 || e.keyCode == 39)) {
                }
                else if (((val == "mozilla") || (val == "opera")) && (e.ctrlKey && (unicode == 97 || unicode == 99 || unicode == 118 || unicode == 120))) {
                }
                else {
                    if (this._textbox.value == "") this._textbox.value = this.model.maskFormat.replace(/[9?$CANa*]/g, promptChar);
                    if (this.model.maskFormat.indexOf("\\") >= 0) {
                        if (currentPos < this._maskLength)
                            this._writeBuffer(actualkey, currentPos);
                }
                    else
                        this._writeBuffer(actualkey, currentPos);
            }
            }
            else
                if (((val == "mozilla") || (val == "opera")) && (e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37 || e.keyCode == 39)) {
                }
                else if (((val == "mozilla") || (val == "opera")) && (e.ctrlKey && (unicode == 97 || unicode == 99 || unicode == 118 || unicode == 120))) {
                }
                else if (this.model.maskFormat.indexOf("&") >= 0 || this.model.maskFormat.indexOf("\\") >= 0) {
                    _position = this._getCunrrentPos(currentPos);
                    if (!((this.model.maskFormat[currentPos + _position] == "&") && (unicode == 127))) {
                        if (this.model.maskFormat.indexOf("\\") >= 0) {
                            if (currentPos < this._maskLength) {
                                if (this._validateChars(unicode, currentPos + _position) || (this.model.maskFormat[currentPos + _position - 1] == "\\"))
                                    this._writeBuffer(actualkey, currentPos);
                                else
                                    this._ErrorHandler(currentPos);
                            }
                        }
                        else {
                            if (this._validateChars(unicode, currentPos + _position))
                                this._writeBuffer(actualkey, currentPos);
                            else
                                this._ErrorHandler(currentPos);
                        }
                    }
                }
                else
                    this._ErrorHandler(currentPos);

            if (!this._keypressFlag && unicode != 9) {
                this._keypressFlag = 0;
                e.preventDefault();
                return false;
            }
            this._keypressFlag = 0;
        },

        _OnKeyUpHandler: function (e) {
            if (this._maskLength == 0) this._raiseEvents("change");
            this._raiseEvents("keyUp", null, { keyCode: e.keyCode, altKey: e.altKey, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, originalArgs: e });
            if (!ej.isNullOrUndefined(this.model.validationRules)) this._hiddenInput.valid();
        },


        _OnMouseOverHandler: function (e) {
            this._raiseEvents("mouseOver");
        },


        _OnMouseOutHandler: function (e) {
            this._raiseEvents("mouseOut");
        },


        _raiseEvents: function (eventName, isCode, additionalArgs) {
            var eventArgs, strippedVal = this.get_StrippedValue(), unstrippedVal = this.get_UnstrippedValue();
            this.model.value = unstrippedVal !== null ? (this.model.customCharacter == null && $.trim(unstrippedVal.replace(/[\(\)-]/g, "")) == "") ? null : unstrippedVal : null;
            if (eventName == "change") {
                if (this.previousValue != this.model.value) {
                    this.previousValue = this.model.value;
                }
                else
                    return false;
            }
            eventArgs = { value: unstrippedVal, unmaskedValue: strippedVal };
            if (eventName == "change") eventArgs["isInteraction"] = !isCode ;
            if (eventName == "change") this._trigger("_change", eventArgs);
            if (additionalArgs) $.extend(true, eventArgs, additionalArgs);
			this._trigger(eventName, eventArgs);
            this._hiddenInput.val(strippedVal);
        },

        _OnValueChange: function () {
            if (this._textbox.value == "" && this._maskModel != "")
                this._textbox.value = this._maskModel;
            this._setValue(this._textbox.value);
        }

    });

    ej.InputMode = {
		/**  support for user enter character in password format. */
		Password: "password", 
		/**  support for user enter character in normal format. */
        Text: "text"
    };
})(jQuery, Syncfusion);;

});