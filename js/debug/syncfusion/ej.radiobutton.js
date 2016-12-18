/*!
*  filename: ej.radiobutton.js
*  version : 14.2.0.26
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
* @fileOverview Plugin to style the Html Radiobutton elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejRadioButton", "ej.RadioButton", {
        _rootCSS: "e-radiobtn",

        element: null,

        model: null,
        validTags: ["input"],
        _addToPersist: ["checked"],
        _setFirst: false,
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions']
        },

        defaults: {

            id: null,

            name: null,

            value: null,

            checked: false,

            cssClass: "",

            text: "",

            enableRTL: false,

            htmlAttributes: {},

            enablePersistence: false,

            idPrefix: "ej",

            size: "small",

            enabled: true,

            validationRules: null,

            validationMessage: null,

            beforeChange: null,

            change: null,

            create: null,

            destroy: null
        },


        dataTypes: {
            id: "string",
            name: "string",
            checked: "boolean",
            enablePersistence: "boolean",
            size: "enum",
            enabled: "boolean",
            idPrefix: "string",
            validationRules: "data",
            validationMessage: "data",
            htmlAttributes: "data"
        },

        observables: ["value"],
        value: ej.util.valueFunction("value"),

        _init: function () {
            var browserInfo = ej.browserInfo();
            this._isIE8 = (browserInfo.name == 'msie' && browserInfo.version == '8.0') ? true : false;
            this._setValue();
            this._renderControl();
            if (this.isChecked)
                this._checkedHandler();
            this._setEnabled(this.model.enabled);
            this._addAttr(this.model.htmlAttributes);
            if (this.model.validationRules != null) {
                this._initValidator();
                this._setValidation();
            }
            this._wireEvents();
            this.initialRender = false;
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.div.addClass(value);
                else if(key == "name") proxy.radbtn.attr(key, value);
                else if (key == "required") proxy.radbtn.attr(key, value);
                else if (key == "disabled" && value == "disabled") proxy.disable();
                else if (key == "checked" && value == "checked") proxy._checkedChange(true, true);
                else proxy.div.attr(key, value);
            });
        },

        _initValidator: function () {
            (!this.element.closest("form").data("validator")) && this.element.closest("form").validate();
        },
        _setValidation: function () {
            this.element.find("input").rules("add", this.model.validationRules);
            var validator = this.element.closest("form").data("validator");
            validator = validator? validator : this.element.closest("form").validate();
            name = this.element.find('input').attr("name");
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


        _setModel: function (options) {
            for (var prop in options) {
                switch (prop) {
                    case "cssClass": this._changeSkin(options[prop]); break;
                    case "enableRTL":
                        if (this.model.text)
                            (options[prop]) ? this.textWrapDiv.addClass("e-rtl") : this.textWrapDiv.removeClass("e-rtl");
                        else 
	                    	(options[prop]) ? this.element.closest('.e-radiobtn-wrap').addClass('e-rtl') : this.element.closest('.e-radiobtn-wrap').removeClass('e-rtl');
                        break;
                    case "text": this._setText(options[prop]); break;
                    case "size": this._setSize(options[prop]); break;
                    case "validationRules":
                        if (this.model.validationRules != null) {
                            this.element.find('input').rules('remove');
                            this.model.validationMessage = null;
                        }
                        this.model.validationRules = options[prop];
                        if (this.model.validationRules != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "validationMessage":
                        this.model.validationMessage = options[prop];
                        if (this.model.validationRules != null && this.model.validationMessage != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "checked": this.model.checked = options[prop]; this._checkedChange(this.model.checked); break;
                    case "enabled": this._setEnabled(options[prop]); break;
                    case "id": this._setIdAttr(options[prop]); break;
                    case "name": this.radbtn.attr('name', options[prop]); break;
                    case "value": 
						if (typeof options[prop] == "function") { 
							if (ej.util.getVal(options[prop]) == this._hiddenValue && this.model.checked == false) {
								this.model.checked = true; this._isAngularbind = true;
								this._checkedChange(true,false); 
							}
						}
						else this.element.attr("value",options[prop]);
					break;
                    case "htmlAttributes": this._addAttr(options[prop]); break;
                }
            }
        },

        _destroy: function () {
            this.radbtn.removeClass("e-radiobtn e-input");
            this.radbtn.insertBefore(this.element);
            this.element.remove();
            this.element = this.radbtn;
        },

        _changeSkin: function (skin) {
            if (this.model.cssClass != skin) {
                this.element.removeClass(this.model.cssClass).addClass(skin);
                this.textWrapDiv.removeClass(this.model.cssClass).addClass(skin);
            }
        },

        _setValue: function () {
            if (!ej.isNullOrUndefined(this.element.attr("id")))
                this.model.id = this.element.attr("id");
            if (!ej.isNullOrUndefined(this.element.attr("name")))
                this.model.name = this.element.attr("name");
			if (this.value() == null) 
				this.value(this.element.attr("value"));
			if (!ej.isNullOrUndefined(this.element.attr("value")) && this.value() == null )
                this.value(this.element.attr("value"));
            this.element.attr({ "id": this.model.id, "name": this.model.name});
            if (!this.model.checked && !ej.isNullOrUndefined(this.element.attr('checked')))
                this.model.checked = this.isChecked = true;
            else
                this.isChecked = this.model.checked;
			this._hiddenValue = this.element.attr("value");
			this._isAngularbind = false;
        },

        _setIdAttr: function (val) {
            $("#" + this.model.idPrefix + this.model.id + "_wrapper").attr('id', this.model.idPrefix + val + "_wrapper");
            $("#" + this.model.idPrefix + this.model.id).attr('id', this.model.idPrefix + val);
            this.radbtn.attr('id', val);
        },

        _setSize: function (val) {
            if (val == ej.RadioButtonSize.Medium)
                this.span.removeClass('e-radsmaller').addClass('e-radmedium');
            else
                this.span.removeClass('e-radmedium').addClass('e-radsmaller');
        },

        _setEnabled: function (val) {
            if (val) {
                this.enable();
            } else {
                this.disable();
            }
        },

        _renderControl: function () {
            this.initialRender = true;
            var browserInfo = ej.browserInfo();
            if (browserInfo.name == 'msie' && browserInfo.version == '8.0')
                this.div = $('<div class="e-radiobtn-wrap e-widget e-rad-outer" ></div>');
            else
                this.div = $('<div class="e-radiobtn-wrap e-widget" ></div>');
            this.div.attr({ 'id': this.model.idPrefix + this.model.id, "role": "radio", "tabindex": 0, "aria-checked": false });
            this.span = $('<span></span>');
            this.span.addClass("e-spanicon");
            this._setSize(this.model.size);
            this.spanImg = $('<span class="e-rad-icon e-icon e-rad-select"></span>', "", {}, { "role": "presentation" });
            this.element.addClass("e-input");
            this.model.name = ej.isNullOrUndefined(this.model.name) ? this.model.id : this.model.name;
            this.element.attr({ "id": this.model.id, "name": this.model.name, "value": this.value() });
            this.div.addClass(this.model.cssClass);
            this.span.append(this.spanImg);
            this.div.insertBefore(this.element);
            this.div.append(this.element);
            this.div.append(this.span);
            this._setTextWrapper(this.model.text);
            this.radbtn = this.element;
            this.element = this.div;
            if (this.isChecked) {
                this.element.find(".e-input").attr('checked', true);
            }
        },

        _setTextWrapper: function (val) {
            if (val != "") {
                this.textWrapDiv = ej.buildTag("div.e-radiobtn-wrap " + this.model.cssClass + "#" + this.model.idPrefix + this.model.id + "_wrapper");
                this.div.wrapAll(this.textWrapDiv);
                this.txtSpan = ej.buildTag("div.e-text", val);
                this.textWrapDiv = $("#" + this.model.idPrefix + this.model.id + "_wrapper");
                this.textWrapDiv.append(this.txtSpan);
                if (this.model.enableRTL)
                    this.textWrapDiv.addClass("e-rtl");
            } else if (this.model.enableRTL)
                this.element.closest('.e-radiobtn-wrap').addClass('e-rtl');
        },

        _setText: function (val) {
            if ((this.model.text == "") && (val != "")) {
                this._setTextWrapper(val);
            } else {
                this.txtSpan.html(val);
            }
        },

        _wireEvents: function () {
            this._on(this.element, "click", this._checkedHandler);
            this._on(this.element, "focus", this._focusIn);
            this._on(this.element, "focusout", this._focusOut);
        },
        _focusIn: function (evt) {
            $(this.element).addClass("e-focus");
            $(this.element).bind("keydown", $.proxy(this._checkUnCheck, this));
        },
        _focusOut: function (evt) {
            $(this.element).removeClass("e-focus");
            $(this.element).unbind("keydown", $.proxy(this._checkUnCheck, this));
        },

        _checkUnCheck: function (evt) {
            //Space bar,and arrow keys to check and uncheck
            if (evt.keyCode == 32 || evt.keyCode == 37 || evt.keyCode == 38 || evt.keyCode == 39 || evt.keyCode == 40) {
                evt.preventDefault();
                this._checkedHandler();
            }
        },
        _checkedHandler: function (evt) {
            if (!this.element.hasClass('e-disable')) {
                this.isChecked = this.element.find('input.e-radiobtn:radio').attr('checked') == 'checked' ? true : false;
                if (!$(this.element).find(".e-rad-icon").hasClass("e-circle_01")) this._changeEvent(true);
            }
        },

        _checkedChange: function (val, interaction) {
            this.isChecked = val;
            if (this.isChecked)
                this._changeEvent(interaction);
        },

        _changeEvent: function (interaction) {
            var data = { isChecked: this.isChecked, isInteraction: !!interaction };
            if (!this.initialRender) {
                if (true == this._trigger("beforeChange", data))
                    return false;
            }
            if (!$(this.element).find(".e-rad-icon").hasClass("e-circle_01")) {
                var curname = this.element.find(".e-input").attr('name'),
                input = $('input.e-radiobtn[name="' + curname + '"]:radio'),
                proxy = this,
                currElement = this.element.find('.e-input'),
                currObj = $(currElement).data("ejRadioButton");
                if (data.isChecked) {
                    this.spanImg.addClass("e-circle_01").removeClass('e-rad-select');
                    this.div.attr({ "tabindex": 0, "aria-checked": true });
                }
                $.each(input, function (i, obj) {
                    $(obj).closest(".e-radiobtn-wrap").find(".e-rad-icon").removeClass("e-circle_01").addClass("e-rad-select");
                    $(obj).closest(".e-radiobtn-wrap").attr({ "tabindex": 0, "aria-checked": false });
                    var prevObj = $(obj).data("ejRadioButton");
                    if (prevObj != null) {
                        prevObj.model.checked = false;
                    }
                });
                if (currObj != null)
                    currObj.model.checked = true;
                this.element.find(".e-rad-icon").addClass("e-circle_01").removeClass("e-rad-select");
                this.div.attr({ "tabindex": 0, "aria-checked": true });
                if (!this._isAngularbind) this.element.find(".e-input").click();
                this.isChecked = true;
            }
			
            var data = { isChecked: this.isChecked, isInteraction: !!interaction };
            if (!this.initialRender)
                this._trigger("change", data);
				if (interaction) this._trigger("_change", { value: this._hiddenValue});
        },

        disable: function () {
            if (!this.element.hasClass("e-disable")) {
                this.element.addClass("e-disable");
			this.radbtn.attr("disabled","disabled");
			}
            if (this._isIE8) this.span.addClass("e-disable");
            this.div.attr("aria-disabled", true);
            this.model.enabled = false;
        },

        enable: function () {
            if (this.element.hasClass("e-disable")) {
                this.element.removeClass("e-disable");
				this.radbtn.removeAttr("disabled");
			}
            if (this._isIE8) this.span.removeClass("e-disable");
            this.div.attr("aria-disabled", false);
            this.model.enabled = true;
        }
    });

    ej.RadioButtonSize = {
        /**  Creates radio button with inbuilt small size height, width specified */
        Small: "small",
        /**  Creates radio button with inbuilt medium size height, width specified */
        Medium: "medium"
    };
})(jQuery, Syncfusion);
;

});