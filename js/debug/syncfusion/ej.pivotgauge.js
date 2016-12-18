/*!
*  filename: ej.pivotgauge.js
*  version : 14.2.0.26
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.core","./../common/ej.data","./ej.waitingpopup","./ej.pivotgauge.common","./ej.pivotgauge","./../datavisualization/ej.circulargauge"], fn) : fn();
})
(function () {
	
/**
* @fileOverview Plugin to style the Html OLAP Gauge elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {

    ej.widget("ejPivotGauge", "ej.PivotGauge", {

        _rootCSS: "e-pivotgauge",
        element: null,
        model: null,
        validTags: ["div", "span"],
        defaults: $.extend({}, ej.datavisualization.CircularGauge.prototype.defaults, {
            url: "",
            cssClass: "",
            rowsCount: 0,
            columnsCount: 0,
            enableTooltip: false,
            enableAnimation: false,
            isResponsive: false,
            enableRTL:false,
            labelFormatSettings: {
                numberFormat: "default",
                decimalPlaces: 5,
                prefixText: "",
                suffixText: ""
            },
            showHeaderLabel: true,
            scales: ej.datavisualization.CircularGauge.prototype._defaultScaleValues(),
            customObject: {},
            dataSource: {
                data: null,
                columns: [],
                cube: "",
                catalog: "",
                rows: [],
                values: [],
                filters: []
            },
            locale: "en-US",
            serviceMethodSettings: {
                initialize: "InitializeGauge"
            },
            renderSuccess: null,
            renderComplete: null,
            renderFailure: null,
            beforeServiceInvoke: null,
            afterServiceInvoke: null,
            load: null
        }),

        dataTypes: {
            serviceMethodSettings: "data",
            customObject: "data",
            scales: "data"
        },

        observables: ["rowsCount", "columnsCount", "showHeaderLabel", "locale", "radius", "frameType"],
        rowsCount: ej.util.valueFunction("rowsCount"),
        columnsCount: ej.util.valueFunction("columnsCount"),
        showHeaderLabel: ej.util.valueFunction("showHeaderLabel"),
        locale: ej.util.valueFunction("locale"),
        radius: ej.util.valueFunction("radius"),
        frameType: ej.util.valueFunction("frameType"),

        getOlapReport: function () {
            return this._olapReport;
        },

        setOlapReport: function (value) {
            this._olapReport = value;
        },

        getJSONRecords: function () {
            return this._JSONRecords;
        },

        setJSONRecords: function (value) {
            this._JSONRecords = $.parseJSON(value);
        },

        _init: function () {
            this.model = $.extend(ej.datavisualization.CircularGauge.prototype.defaults, this.model);
            this._scalesInitialize();
            this._initPrivateProperties();
            this._load();
        },

        _scalesInitialize: function () {
            if (this.model.scales != null) {
                $.each(this.model.scales, ej.proxy(function (index, element) {
                    var obj = ej.datavisualization.CircularGauge.prototype._defaultScaleValues();
                    $.extend(obj, element);
                    $.extend(element, obj);
                }, this));
            }
            else {
                this.model.scales = [ej.datavisualization.CircularGauge.prototype._defaultScaleValues()];
            }
            if (this.model.enableRTL) {
                $.each(this.model.scales, function (index, element) {
                    element.direction = "counterClockwise";
                })
            }
        },

        _destroy: function () {
            this._unWireEvents();
            this.element.empty().removeClass("e-pivotgauge" + this.model.cssClass);
            if (this._ogaugeWaitingPopup != undefined)
                this._ogaugeWaitingPopup._destroy();
        },

        _initPrivateProperties: function () {
            this._id = this.element.attr("id");
            this._olapReport = "";
            this._JSONRecords = null;
            this._maximum = new Array();
            this._maxValue = 0;
            this._pointerValue_0 = 0;
            this._pointerValue_1 = 0;
            this._currentLayout = "";
            this._defaultArea = 0;
            this._defaultWidth = 0;
            this._gaugeObj = {};
            this._ogaugeWaitingPopup = null;
            this._ogaugeProgressBar = null;
            this._ogaugeProgressText = null;
            this._notationStr = null;
            this._ogaugeTimer = null;
        },

        _load: function () {
            this.element.addClass(this.model.cssClass);
            $("#" + this._id).ejWaitingPopup({ showOnInit: true });
            this._ogaugeWaitingPopup = $("#" + this._id).data("ejWaitingPopup");

            if (this.model.beforeServiceInvoke != null)
                this._trigger("beforeServiceInvoke", { element: this.element, customObject: this.model.customObject });
			if (this.model.load != null)						
                this._trigger("load", { action: "initialize", model: this.model, element: this.element, customObject: this.model.customObject });				
            var serializedCustomObject = JSON.stringify(this.model.customObject);
            if (this.model.dataSource && typeof (this.model.dataSource.data) == "string") {
                ej.olap.base.getJSONData({ action: "initialLoad" }, this.model.dataSource, this);
            }
            else if (this.model.dataSource && typeof (this.model.dataSource.data) == "object" && this.model.dataSource.data != null) {
                var pivot = ej.PivotAnalysis.pivotEnginePopulate(this.model);
                this._dataModel = "Pivot";
                this.generateJSON({ baseObj: this }, pivot.pivotEngine);
            }
            else {
                if (this.model.customObject != null && this.model.customObject != undefined && this.model.customObject != {})
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": "initializeGauge", "customObject": serializedCustomObject }), this._renderControlSuccess);
                else
                    this.doAjaxPost("POST", this.model.url + "/" + this.model.serviceMethodSettings.initialize, JSON.stringify({ "action": "initializeGauge" }), this._renderControlSuccess);
            }
        },

        _setFirst: true,

        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
                    case "OlapReport": this.setOlapReport(options[key]); break;
                    case "JsonData": this.setOlapReport(options[key]); break;
                    case "RefreshPivotGauge": this.element.renderControlFromJSON(options[key]); break;
                    case "customObject": this.model.customObject = options[key]; break;
                    case "locale": this.locale(); break;
                    case "rowsCount": this.rowsCount(); break;
                    case "columnsCount": this.columnsCount(); break;
                    case "showHeaderLabel": this.showHeaderLabel(); break;
                    case "locale": this.locale(); break;
                    case "radius": this.radius(); break;
                    case "frameType": this.frameType(); break;
                    case "scales": break;
                }
            }
            if (this._gaugeObj["obj0"]) {
                this._renderControlSuccess({ "PivotRecords": JSON.stringify(this.getJSONRecords()), "OlapReport": this.getOlapReport() });
            }
        },

        _wireEvents: function () {
                this.element.find(".e-circulargauge").mouseenter(ej.proxy(function (evt) {
                    if (this.model.enableTooltip)
                    this._showTooltip(evt);
                }, this)).mouseout(ej.proxy(function () {
                    $(this._tooltip).fadeOut("slow");
                }, this)).mousemove(ej.proxy(function (evt) {
                    if (this.model.enableTooltip) {
                        this._showTooltip(evt);
                        this._hideTooltip();
                    }
                }, this));
        },

        _getLocalizedLabels: function (property) {
            return ej.PivotGauge.Locale[this.locale()][property] === undefined ? ej.PivotGauge.Locale["en-US"][property] : ej.PivotGauge.Locale[this.locale()][property];
        },

        _unWireEvents: function () {
        },

        _showTooltip: function (event) {
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version <= 8)
                return;
            $(this._tooltip).remove();
            var gaugeIndexValues = event.target.id.split("_") == "" ? event.target.parentNode.id.split("_") : event.target.id.split("_");
            var gaugeIndex = gaugeIndexValues[gaugeIndexValues.length - 1];
            var goal = this._numberFormatConversion(this._JSONRecords[gaugeIndex].GoalValue || 0, this.model.labelFormatSettings.numberFormat, this.model.labelFormatSettings.decimalPlaces);
            var value = this._numberFormatConversion(this._JSONRecords[gaugeIndex].MeasureValue || this._JSONRecords[gaugeIndex].Value, this.model.labelFormatSettings.numberFormat, this.model.labelFormatSettings.decimalPlaces);
            var _factor = this._setMaxScaleValue(this._JSONRecords[gaugeIndex].GoalValue || 0, this._JSONRecords[gaugeIndex].MeasureValue || this._JSONRecords[gaugeIndex].Value, gaugeIndex);
            if (this.model.labelFormatSettings.numberFormat == ej.PivotGauge.NumberFormat.Notation) {
                var goalNValue = (this._JSONRecords[gaugeIndex].GoalValue || 0), measureNValue = (this._JSONRecords[gaugeIndex].MeasureValue || this._JSONRecords[gaugeIndex].Value);
                while (goalNValue >= 10) {
                    goalNValue = parseInt(goalNValue) / 10;
                }
                while (measureNValue >= 10) {
                    measureNValue = parseInt(measureNValue) / 10;
                }
                goal = (goalNValue).toFixed(1) + goal;
                value = (measureNValue).toFixed(1) + value;
            }
            var member = this._JSONRecords[gaugeIndex].MemberName || this._JSONRecords[gaugeIndex].Measure;
            if (member == undefined || member == "undefined")
                member = this._JSONRecords[gaugeIndex].MeasureCaption;
            var tooltipText;
            if (this.model.enableRTL || this._gaugeObj["obj" + gaugeIndex].model.scales[0].direction == "counterClockwise")
                tooltipText = member.split(" - ").reverse().join(" - ") + "<br/>" + goal + " :" + this._getLocalizedLabels("RevenueGoal") + "<br/>" + value + " :" + this._getLocalizedLabels("RevenueValue");
            else
                tooltipText = member + "<br/>" + this._getLocalizedLabels("RevenueGoal") + ": " + goal + "<br/>" + this._getLocalizedLabels("RevenueValue") + ": " + value;
            this._tooltip = ej.buildTag("div.e-pivotgauge-tooltip", tooltipText);
            $(this._tooltip).appendTo('body');
            $(this._tooltip).addClass(".e-pivotgauge-active");
            this._changeTooltipPos(event);
            if (this.model.enableRTL || this._gaugeObj["obj" + gaugeIndex].model.scales[0].direction == "counterClockwise")
                $(this._tooltip).css("text-align", "right");
            else
                $(this._tooltip).css("text-align", "left");
        },

        _changeTooltipPos: function (event) {
            var tooltipX = event.pageX - 8;
            var tooltipY = event.pageY + 8;
            $(this._tooltip).css({ top: tooltipY, left: tooltipX });
        },

        _hideTooltip: function () {
            window.setTimeout(ej.proxy(function () { $(this._tooltip).fadeOut(1500, "linear"); }, this), 3000);
        },

        _renderControlSuccess: function (msg) {
            try {
                var htmlTag = "", statusImage = "", trendImage = "", liTag = "", gaugeId = 0;
                if (msg[0] != undefined && msg.length > 0) {
                    this.setJSONRecords(msg[0].Value);
                    this.setOlapReport(msg[1].Value);
                    if (msg[2] != null && msg[2] != undefined)
                        this.model.customObject = msg[2].Value;
                }
                else if (msg.d != undefined && msg.d.length > 0) {
                    this.setJSONRecords(msg.d[0].Value);
                    this.setOlapReport(msg.d[1].Value);
                    if (msg.d[2] != null && msg.d[2] != undefined)
                        this.model.customObject = msg.d[2].Value;
                }
                else if (msg.PivotRecords && msg.OlapReport) {
                    this.setJSONRecords(msg.PivotRecords);
                    this.setOlapReport(msg.OlapReport);
                    if (msg.customObject != null && msg.customObject != undefined)
                        this.model.customObject = msg.customObject;
                }

                if (this.model.afterServiceInvoke != null)
                    this._trigger("afterServiceInvoke", { element: this.element, customObject: this.model.customObject });
                var ogaugeInfo = this.getJSONRecords();

                if (ogaugeInfo != null && ogaugeInfo.length > 0) {
                    if (this.rowsCount() < 1 && this.columnsCount() < 1) {
                        this._currentLayout = "WrapPanel";
                        for (var k = 0; k < ogaugeInfo.length; k++) {
                            statusImage = ej.buildTag("img#statusIndicator_" + k + ".kpiiconvalue")[0].outerHTML;
                            trendImage = ej.buildTag("img#trendIndicator_" + k + ".kpiiconvalue")[0].outerHTML;
                            liTag += ej.buildTag("li", ej.buildTag("div#" + this._id + "_" + k, statusImage + trendImage)[0].outerHTML)[0].outerHTML;
                        }
                        htmlTag = ej.buildTag("ul.wrapLayout", liTag)[0].outerHTML;
                    }
                    else {
                        this._currentLayout = "Table";
                        if (this.columnsCount() == undefined || this.columnsCount() < 1)
                            this.columnsCount((ogaugeInfo.length / this.rowsCount()).toFixed());
                        if (this.rowsCount() == undefined || this.rowsCount() < 1)
                            this.rowsCount((ogaugeInfo.length / this.columnsCount()).toFixed());
                        htmlTag = "<table><tbody>";
                        for (var i = 0; i < this.rowsCount() ; i++) {
                            htmlTag += "<tr>";
                            for (var j = 0; j < this.columnsCount() ; j++) {
                                statusImage = ej.buildTag("img#statusIndicator_" + gaugeId + ".kpiiconvalue")[0].outerHTML;
                                trendImage = ej.buildTag("img#trendIndicator_" + gaugeId + ".kpiiconvalue")[0].outerHTML;
                                htmlTag += "<td>" + ej.buildTag("div#" + this._id + "_" + gaugeId, statusImage + trendImage)[0].outerHTML + "</td>";
                                gaugeId++;
                            }
                            htmlTag += "</tr>";
                        }
                        htmlTag += "</tbody></table>";
                    }
                    this.element.html(htmlTag);
                    this.renderControlFromJSON(ogaugeInfo);
                    this._defaultWidth = this.element.find("canvas").width();
                    this._defaultArea = this.element.find("table").height() * this.element.find("table").width();
                }
                this._ogaugeWaitingPopup.hide();
                var eventArgs = { element: this.element, customObject: this.model.customObject };
                this._trigger("renderSuccess", eventArgs);
            }
            catch (err) {
            }
        },

        doAjaxPost: function (type, url, data, onSuccess, onComplete, customArgs) {
            var contentType, dataType, successEvt, isAsync = true;
            if ((data["XMLA"] == undefined))
                contentType = 'application/json; charset=utf-8', dataType = 'json', successEvt = $.proxy(onSuccess, this);
            else
                contentType = 'text/xml', dataType = 'xml', data = data["XMLA"], successEvt = $.proxy(onSuccess, ej.olap.base, customArgs), isAsync = (!ej.isNullOrUndefined(customArgs) && customArgs["action"] != "loadFieldElements") ? true : false;
            $.ajax({
                type: type,
                url: url,
                contentType: contentType,
                async: false,
                dataType: dataType,
                data: data,
                success: successEvt,
                complete: ej.proxy(function () {
                    var eventArgs = { element: this.element, customObject: this.model.customObject };
                    this._trigger("renderComplete", eventArgs);
                }, this),
                error: ej.proxy(function (msg, textStatus, errorThrown) {
                    this._ogaugeWaitingPopup.hide();
                    var eventArgs = { element: this.element, customObject: this.model.customObject, Message: msg };
                    this._trigger("renderFailure", eventArgs);
                }, this)
            });
        },


        _getCalculatedValue: function (value) {
            var stringValue = value.toString();
            var factor = 1; var len; var dividend;
            if (stringValue.indexOf('.') > -1)
                len = stringValue.split('.')[0].length;
            else
                len = stringValue.length;
            dividend = parseInt(stringValue);
            for (var i = 0; i < len; i++) {
                if (dividend > this._maxValue) {
                    dividend = dividend / 10;
                    factor = factor * 10;
                }
            }
            return factor;
        },

        _findNearestUpperLimit: function (number, factor) {
            var convertedNumber = number.toString();
            var j = parseInt(convertedNumber);
            var k = j % factor;
            return j + (factor - k);
        },

        _setMaxScaleValue: function (goal, value, i) {
            var factor;
            if (value > goal) {
                factor = this._getCalculatedValue(value);
                this._maximum[i] = this._findNearestUpperLimit((value / factor), 10);
            }
            else {
                factor = this._getCalculatedValue(goal);
                this._maximum[i] = this._findNearestUpperLimit((((goal / factor) * 4) / 3), 10);
            }
            return factor;
        },

        _numberFormatConversion: function (num, type, decimal) {
            switch (type) {
                case ej.PivotGauge.NumberFormat.Default:
                    return parseFloat(num).toFixed(decimal);
                    break;
                case ej.PivotGauge.NumberFormat.Text:
                    return num.toString();
                    break;
                case ej.PivotGauge.NumberFormat.Currency:
                    return ej.format(parseInt(num), "c", this.model.locale);
                    break;

                case ej.PivotGauge.NumberFormat.Percentage:
                    {
                        num *= 100;
                        return parseFloat(num).toFixed(2) + "%";
                    }
                    break;
                case ej.PivotGauge.NumberFormat.Fraction:
                    {
                        if (!num) {
                            num = this;
                        }
                        var whole = String(num).split('.')[0];
                        var num = parseFloat("." + String(num).split('.')[1]);
                        num = num.toFixed(4);
                        var decimal = "1";
                        for (z = 0; z < String(num).length - 2; z++) {
                            decimal += "0";
                        }
                        num = num * decimal;
                        decimal = parseInt(decimal);
                        for (z = 2; z < num + 1; z++) {
                            if (num % z == 0 && decimal % z == 0) {
                                num = num / z;
                                decimal = decimal/z;
                                z = 2;
                            }
                        }
                        if (num.toString().length == 2 &&
                                decimal.toString().length == 3) {
                            num = Math.round(Math.round(num) / 10);
                            decimal = Math.round(Math.round(decimal) / 10);
                        }
                        else if (num.toString().length == 2 &&
                                decimal.toString().length == 2) {
                            num = Math.round(num / 10);
                            decimal = Math.round(decimal/10);
                        }
                        var t = _HCF(num, decimal);
                        return ((whole == 0) ? "" : whole + " ") + num / t + "/" + decimal/t;


                    }
                    break;
                case ej.PivotGauge.NumberFormat.Scientific:
                    {
                        return parseFloat(num).toExponential();
                    }
                    break;
                case ej.PivotGauge.NumberFormat.Notation:
                    {
                        var count = 0;
                        var mod = parseInt(num);
                        while (mod >= 1) {
                            var mod = parseInt(mod) / 10;
                            count++;
                        }
                        return (this._notationStr = count == 1 ? "da" : count == 2 ? "h" : count == 3 ? "k" : count == 4 ? "k*da" : count == 5 ? "k*h" : count == 6 ? "M" : count == 7 ? "M*da" : count == 8 ? "M*h" : count == 9 ? "G" : count == 10 ? "G*da" : count == 11 ? "G*h" : count == 12 ? "T" : "");
                    }
                    break;
            }
            function _HCF(u, v) {
                var U = u, V = v
                while (true) {
                    if (!(U %= V)) return V
                    if (!(V %= U)) return U
                }
            }
        },

        removeImg: function () {
            this.element.find("img").remove();
        },

        renderControlFromJSON: function (jsonObj) {
            //Calculating pointer value, danger and safer regions
            this._maxValue = 99, maxGaugeCount = 0;
            var pointerCapRadius = (this.radius() / 22);
            if (this._currentLayout == "Table" && (this.rowsCount() * this.columnsCount()) <= jsonObj.length)
                maxGaugeCount = this.rowsCount() * this.columnsCount();
            else if (this._currentLayout == "WrapPanel" || (this.rowsCount() * this.columnsCount()) > jsonObj.length)
                maxGaugeCount = jsonObj.length;
            for (var i = 0; i < maxGaugeCount; i++) {
                var goal = 0.0, value = 0.0, startValue = 0.0, endValue = 0.0, dValue = 0.0, factor = 0, mark = 0.0,
                percentageValue = 0.0, customLabel = "", imgDiv, extendRanges = new Array(), extendPointers = new Array(),
                extendLabels = new Array(), extendCustomLabels = new Array(), extendTicks = new Array(), extendIndicators = new Array(),
                extendScales = new Array(), statusClass = "", trendClass = "";

                if (jsonObj[i].MeasureValue != null && jsonObj[i].MeasureValue != undefined) {
                    value = parseFloat(jsonObj[i].MeasureValue) || 0;
                    goal = parseFloat(jsonObj[i].GoalValue) || 0;
                    customLabel = this.model.labelFormatSettings.prefixText + " " + jsonObj[i].MeasureCaption + (!($.trim(jsonObj[i].MemberName)) ? "" : " - ") + jsonObj[i].MemberName + " " + this.model.labelFormatSettings.suffixText;
                }
                else {
                    value = parseFloat(jsonObj[i].Value);
                    goal = 0.0;
                    customLabel = jsonObj[i].Measure;
                    this.model.scales[0].showIndicators = false;
                }
                customLabel = (this.model.enableRTL || this.model.scales[0].direction == "counterClockwise") ? customLabel.split(" - ").reverse().join(" - ") : customLabel;
                factor = this._setMaxScaleValue(goal, value, i);
                dValue = value;
                mark = goal / factor;
                percentageValue = (dValue / factor);
                this._pointerValue_0 = endValue + percentageValue;
                this._pointerValue_1 = mark + endValue;
                startValue = endValue;
                endValue = endValue + percentageValue;

                //Edting Model values
                if (jsonObj[i].StatusGraphic == "Traffic Signals") {
                    if (jsonObj[i].StatusValue == -1)
                        statusClass = "kpiredroad";
                    else if (jsonObj[i].StatusValue == 0)
                        statusClass = "kpiallcolor";
                    else if (jsonObj[i].StatusValue == 1)
                        statusClass = "kpigreenroad";
                }
                else {
                    if (jsonObj[i].StatusValue == -1)
                        statusClass = "kpidiamond";
                    else if (jsonObj[i].StatusValue == 0)
                        statusClass = "kpitriangle";
                    else if (jsonObj[i].StatusValue == 1)
                        statusClass = "kpicircle";
                }
                imgDiv = this.element.find("#statusIndicator_" + [i]).addClass(statusClass);
                if (imgDiv != null && imgDiv != undefined) {
                    var statusImage = $(imgDiv).css('background-image');
                    var statusIndicator = {
                        height: 15,
                        width: 15,
                        type: "image",
                        imageUrl: (!ej.isNullOrUndefined(statusImage) && statusImage != "none") ? statusImage.split("(")[1].split(")")[0].replace('"', "").replace('"', "") : "",
                        position: { x: this.radius() - 20, y: 260 }, location: { x: this.radius() - 20, y: 260 }
                    };
                }

                if (jsonObj[i].TrendGraphic != null && jsonObj[i].TrendGraphic != undefined && jsonObj[i].TrendGraphic != "" && jsonObj[i].TrendGraphic.toLowerCase() == "standard arrow") {
                    if (jsonObj[i].TrendValue == -1)
                        trendClass = "kpidownarrow";
                    else if (jsonObj[i].TrendValue == 0)
                        trendClass = "kpirightarrow";
                    else if (jsonObj[i].TrendValue == 1)
                        trendClass = "kpiuparrow";
                    imgDiv = this.element.find("#trendIndicator_" + [i]).toggleClass(trendClass);
                }
                if (!ej.isNullOrUndefined(imgDiv)) {
                    var trendImage = $(imgDiv).css('background-image');
                    var trendIndicator = {
                        height: 15,
                        width: 15,
                        type: "image",
                        imageUrl: (!ej.isNullOrUndefined(trendImage) && trendImage != "none") ? trendImage.split("(")[1].split(")")[0].replace('"', "").replace('"', "") : "",
                        position: { x: this.radius(), y: 260 }, location: { x: this.radius(), y: 260 }
                    };
                }
                if (!ej.isNullOrUndefined(this.model.scales[0])) {
                    if (this.frameType() == "fullcircle") {
                        this.model.scales[0].startAngle = 122;
                        this.model.scales[0].sweepAngle = 296;
                    }
                    else if (this.frameType() == "halfcircle") {
                        this.model.scales[0].startAngle = 180;
                        this.model.scales[0].sweepAngle = 180;
                    }
                    this.model.scales[0].indicators = this.model.scales[0].showIndicators ? [statusIndicator, trendIndicator] : this.model.scales[0].indicators;
                    if (!ej.isNullOrUndefined(this.model.scales[0].pointers[0])) {
                        var newPointerCap = ej.datavisualization.CircularGauge.prototype._defaultScaleValues().pointerCap;
                        //this.model.scales[0].pointers[0] = $.extend({}, newPointer, this.model.scales[0].pointers[0]);
                        this.model.scales[0].pointers[0].value = this._pointerValue_0;
                        this.model.scales[0].pointers[0].pointerCap = newPointerCap;
                        this.model.scales[0].pointers[0].pointerCap.radius = pointerCapRadius;
                    }
                    if (!ej.isNullOrUndefined(this.model.scales[0].pointers[1])) {
                        this.model.scales[0].pointers[1].value = this._pointerValue_1;
                        this.model.scales[0].pointers[1].type = this.model.scales[0].pointers[1].type || "marker";
                        this.model.scales[0].pointers[1].markerType = this.model.scales[0].pointers[1].markerType || "diamond";
                        this.model.scales[0].pointers[1].placement = this.model.scales[0].pointers[1].placement || "center";
                    }
                    if (!ej.isNullOrUndefined(this.model.scales[0].ranges[0])) {
                        this.model.scales[0].ranges[0].startValue = startValue;
                        this.model.scales[0].ranges[0].endValue = mark;
                    }
                    if (!ej.isNullOrUndefined(this.model.scales[0].ranges[1])) {
                        this.model.scales[0].ranges[1].startValue = mark;
                        this.model.scales[0].ranges[1].endValue = this._maximum[i];
                    }
                    if (!ej.isNullOrUndefined(this.model.scales[0].customLabels[0]))
                        this.model.scales[0].customLabels[0].value = this.showHeaderLabel() ? "X " + factor : "";
                    if (!ej.isNullOrUndefined(this.model.scales[0].customLabels[1]))
                        this.model.scales[0].customLabels[1].value = this.showHeaderLabel() ? customLabel : "";
                    if (!ej.isNullOrUndefined(this.model.scales[0].customLabels[2]))
                        this.model.scales[0].customLabels[2].value = this.showHeaderLabel() ? customLabel : "";

                    for (var j = 0; j < this.model.scales[0].ranges.length; j++)
                        extendRanges.push($.extend({}, ej.datavisualization.CircularGauge.prototype._defaultScaleValues().ranges[0], this.model.scales[0].ranges[j]));
                    for (var j = 0; j < this.model.scales[0].pointers.length; j++)
                        extendPointers.push($.extend({}, ej.datavisualization.CircularGauge.prototype._defaultScaleValues().pointers[0], this.model.scales[0].pointers[j]));
                    for (var j = 0; j < this.model.scales[0].labels.length; j++) {
                        if (this.model.labelFormatSettings.numberFormat == ej.PivotGauge.NumberFormat.Notation && !ej.isNullOrUndefined(ej.datavisualization.CircularGauge.prototype._defaultScaleValues().labels[0])) {
                            this._numberFormatConversion(this._JSONRecords[i].MeasureValue || this._JSONRecords[i].Value, this.model.labelFormatSettings.numberFormat, this.model.labelFormatSettings.decimalPlaces);
                            this.model.scales[0].labels[j].unitText = this._notationStr;
                        }
                        extendLabels.push($.extend({}, ej.datavisualization.CircularGauge.prototype._defaultScaleValues().labels[0], this.model.scales[0].labels[j]));
                    }
                    for (var j = 0; j < this.model.scales[0].labels.length; j++)
                        extendLabels.push($.extend({}, ej.datavisualization.CircularGauge.prototype._defaultScaleValues().labels[0], this.model.scales[0].labels[j]));
                    for (var j = 0; j < this.model.scales[0].customLabels.length; j++)
                        extendCustomLabels.push($.extend({}, ej.datavisualization.CircularGauge.prototype._defaultScaleValues().customLabels[0], this.model.scales[0].customLabels[j]));
                    for (var j = 0; j < this.model.scales[0].ticks.length; j++)
                        extendTicks.push($.extend({}, ej.datavisualization.CircularGauge.prototype._defaultScaleValues().ticks[0], this.model.scales[0].ticks[j]));
                    if (this.model.scales[0].indicators) {
                        for (var j = 0; j < this.model.scales[0].indicators.length; j++)
                            extendIndicators.push($.extend({}, ej.datavisualization.CircularGauge.prototype._defaultScaleValues().indicators[0], this.model.scales[0].indicators[j]));
                    }
                    newScale = {
                        pointerCap: {
                            radius: pointerCapRadius || this.model.scales[0].pointerCap.radius,
                            borderWidth: this.model.scales[0].pointerCap.borderWidth,
                            interiorGradient: this.model.scales[0].pointerCap.interiorGradient,
                            borderColor: this.model.scales[0].pointerCap.borderColor,
                            backgroundColor: this.model.scales[0].pointerCap.backgroundColor
                        },
                        border: {
                            color: this.model.scales[0].border.color,
                            width: this.model.scales[0].border.width
                        },
                        majorIntervalValue: this.model.scales[0].majorIntervalValue,
                        minorIntervalValue: this.model.scales[0].minorIntervalValue,
                        minimum: this.model.scales[0].minimum,
                        backgroundColor: this.model.scales[0].backgroundColor,
                        direction: this.model.scales[0].direction,
                        showPointers: this.model.scales[0].showPointers,
                        showTicks: this.model.scales[0].showTicks,
                        showLabels: this.model.scales[0].showLabels,
                        showIndicators: this.model.scales[0].showIndicators,
                        showRanges: this.model.scales[0].showRanges,
                        showScaleBar: this.model.scales[0].showScaleBar,
                        startAngle: this.model.scales[0].startAngle,
                        sweepAngle: this.model.scales[0].sweepAngle,
                        radius: this.model.scales[0].radius,
                        size: this.model.scales[0].size,
                        maximum: this.model.scales[0].maximum || this._maximum[i],
                        pointers: extendPointers,
                        ticks: extendTicks,
                        labels: extendLabels,
                        ranges: extendRanges,
                        customLabels: extendCustomLabels,
                        indicators: extendIndicators
                    };
                    for (var j = 0; j < this.model.scales.length; j++) {
                        if (j == 0)
                            extendScales.push($.extend({}, ej.datavisualization.CircularGauge.prototype._defaultScaleValues(), newScale));
                        else
                            extendScales.push($.extend({}, ej.datavisualization.CircularGauge.prototype._defaultScaleValues(), this.model.scales[j]));
                    }
                }

                //Creating Gauges
                $("#" + this._id + "_" + i).ejCircularGauge({
                    backgroundColor: this.model.backgroundColor,
                    frame: {
                        frameType: this.model.frame.frameType,
                        halfCircleFrameStartAngle: this.model.halfCircleFrameStartAngle,
                        halfCircleFrameEndAngle: this.model.halfCircleFrameEndAngle
                    },

                    radius: this.radius(),
                    width: this.model.width, // Width should be 2 * radius 
                    height: this.model.height,
                    interiorGradient: this.model.interiorGradient,
                    readOnly: this.model.readOnly,
                    enableResize: this.model.isResponsive,

                    enableAnimation: ej.isMobile() ? false : this.model.enableAnimation,
                    animationSpeed: this.model.animationSpeed,
                    theme: this.model.theme,
                    isRadialGradient: this.model.isRadialGradient,

                    load: this.model.load,
                    drawTicks: this.model.drawTicks,
                    drawLabels: this.model.drawLabels,
                    drawPointers: this.model.drawPointers,
                    drawRange: this.model.drawRange,
                    drawCustomLabel: this.model.drawCustomLabel,
                    drawIndicators: this.model.drawIndicators,
                    drawPointerCap: this.model.drawPointerCap,
                    renderComplete: this.model.renderComplete,
                    mouseClick: this.model.mouseClick,
                    mouseClickMove: this.model.mouseClickMove,
                    mouseClickUp: this.model.mouseClickUp,
                    scales: extendScales
                });
                this._gaugeObj["obj" + i] = $("#" + this._id + "_" + i).data("ejCircularGauge");
            }
            this.removeImg();
            this._wireEvents();
        },

        refresh: function () {
            if (this._gaugeObj == null || this._gaugeObj == undefined) {
                for (var i = 0; i < this._JSONRecords.length; i++) {
                    this._gaugeObj["obj" + i] = $("#" + this._id + "_" + i).data("ejCircularGauge");
                    this._gaugeObj["obj" + i].refresh();
                }
            }
            else {
                for (key in this._gaugeObj) {
                    this._gaugeObj[key].refresh();
                }
            }
        }
    });

    ej.PivotGauge.Locale = {};

    ej.PivotGauge.Locale["en-US"] = {
        RevenueGoal: "Revenue Goal",
        RevenueValue: "Revenue Value"
    };

    ej.PivotGauge.NumberFormat = {
        Default: "default",
        Currency: "currency",
        Percentage: "percentage",
        Fraction: "fraction",
        Scientific: "scientific",
        Text: "text",
        Notation: "notation"
    };
    ej.PivotGauge.AxisName = {
        Rows: "rows",
        Columns: "columns"
    };
    if (ej.pivotgauge.common)
        $.extend(ej.PivotGauge.prototype, ej.pivotgauge.common);

})(jQuery, Syncfusion);;

});