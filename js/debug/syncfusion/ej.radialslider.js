/*!
*  filename: ej.radialslider.js
*  version : 14.4.0.20
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["./../common/ej.core","./../common/ej.touch"], fn) : fn();
})
(function () {
	
// JavaScript source code
/**
* @fileOverview Plugin to style the Html RadialSlider elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    ej.widget("ejRadialSliderBase", "ej.RadialSliderBase", {
        defaults: {
            radius: 200,
            ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            enableRoundOff: true,
            value: 10,
            autoOpen: true,
            enableAnimation: true,
            cssClass: null,
            labelSpace: 30,
            stop: null,
            slide: null,
            start: null,
            change: null,
            create: null,
            destroy: null
        },
        dataTypes: {
            radius: "number",
            enableRoundOff: "boolean",
            enableAnimation: "boolean",
            cssClass: "string"
        },
        observables: ["value"],
        observableArray: ["ticks"],
        value: ej.util.valueFunction("value"),
        ticks: ej.util.valueFunction("ticks"),
        _outerTextCalculation: function (length, startAngle, endAngle) {
            var radius = this._isMobile() ? (this.model.radius - this.model.labelSpace) : (this.model.radius + this.model.labelSpace);
            this._point = ((endAngle - startAngle) / (length - 1));
            endAngle = startAngle + ((endAngle - startAngle) / (length - 1));
            var endValueCal = endAngle,
                startValueCal = endValueCal;
            this._textPoints = [];
            for (var j = 0; j < length; j++) {
                var line = {};
                var angleCondition = startAngle;
                startAngle = startAngle * Math.PI / 180.0;
                endAngle = endAngle * Math.PI / 180.0;
                line.X2 = (this._startXY) + (radius) * Math.cos(startAngle);
                line.Y2 = (this._startXY) + (radius) * Math.sin(startAngle);
                if (angleCondition <= 270 && 90 <= angleCondition)
                    line.textAlignment = "middle";
                else
                    line.textAlignment = "start";
                startAngle = endValueCal;
                endAngle = endValueCal + this._point;
                endValueCal += this._point;
                this._textPoints.push(line);
            }
            var line = {};
            var angleCondition = this._startValueAngle;
            this._startValueAngle = this._startValueAngle * Math.PI / 180.0;
            line.X2 = (this._startXY) + (radius) * Math.cos(this._startValueAngle);
            line.Y2 = (this._startXY) + (radius) * Math.sin(this._startValueAngle);
            if (angleCondition <= 270 && 90 <= angleCondition)
                line.textAlignment = "middle";
            else
                line.textAlignment = "start";
            this._textPoints.push(line);
            return this._textPoints;
        },

        _polarToCartesian: function (cX, cY, radius, angle, isDynamic) {
            var angleRadians = (angle) * Math.PI / 180.0;
            return {
                x: cX + (radius * Math.cos(angleRadians)),
                y: cY + (radius * Math.sin(isDynamic ? -angleRadians : angleRadians))
            };
        },
        _tapHandlerEvent: function (e) {
            var baseRect = $("#" + this._prefix + this._elementID + "-radial-slider-svg").offset();
            var y2 = e.clientY, x2 = e.clientX, y1 =( baseRect.top + (this._radialWidth / 2)) - $(window).scrollTop(), x1 = baseRect.left + (this._radialWidth / 2);
            this._dynamicAngleCalculation(x1, x2, y1, y2);
            var space = this._isMobile() && this.model.renderMode == "ios7" ? 6.5 : this._isMobile() && this.model.renderMode == "windows" ? 2.5 : 5;
            if ((!this._isMobile() && (this._angle >= (360 - this._endAngle) && this._angle <= (360 - this._startAngle))) || (this._isMobile() && (this._angle >= (360 - (this._endAngle - space)) && this._angle <= (360 - (this._startAngle + space)))) || (this._isMobile() && this.model.position.charAt(0).toLowerCase() == "l" && (this._angle > (270 + space) || this._angle < (90 - space)))) {
                this._lineAngleCalculation(true);
                this._previousAngle = this._angle;
                if (!this._isMobile()) {
                    $(this._overLine).remove();
                    this._pathBeforeAddlength = this._tickCount + 1;
                    this._pathAfterAddLength = this._directionLine.toString().replace(/[^M]/g, "").length;
                    if (this._pathBeforeAddlength < this._pathAfterAddLength) {
                        var deleteCount = this._isTapSelected ? 2 : 1;
                        this._directionLine.remove(this._tickCount, deleteCount, deleteCount);
                    }
                    else
                        this._directionLine.remove(this._tickCount, 1);
                    this._dynamicLineCalculation(this._angle, false, true, true, this._tickCount, this._tickCount + 1, true);
                    $(this._pathLineElement).attr("d", this._directionLine.toString());
                }
                if ($(this._textGroupElement).find('[id=' + this._prefix + this._elementID + "-dynamic-text" + ']').length > 0)
                    this._textGroupElement.find('[id=' + this._prefix + this._elementID + "-dynamic-text" + ']').remove();
                var selectPart = this._selectPart();
                var select = selectPart.select;
                var selectValue;
                if (this._isTicksControl()) {
                    selectValue = this._ticksCalculation();
                    if (this._isMobile() && this.model.position.charAt(0).toLowerCase() == "l")
                        this.line.textAlignment = "end";
                    else if (this._isMobile() && this.model.position.charAt(0).toLowerCase() == "r")
                        this.line.textAlignment = "start";
                    else if (this._isMobile() && (this.model.position.charAt(0).toLowerCase() == "b" || this.model.position.charAt(0).toLowerCase() == "t"))
                        this.line.textAlignment = "middle";
                    if (this._isMobile() && (this.ticks().indexOf(selectValue) == 0) || (this.ticks().indexOf(selectValue) == this._tickCount - 1))
                        this.line.textAlignment = "middle";
                    if (this.ticks().indexOf(selectValue) < 0) {
                        this._outerTextElement = this._createSVGElements("text", { "stroke-width": 0.5, "x": this.line.X2, "y": this.line.Y2, "class": this._prefix + "dynamic-text", "id": this._prefix + this._elementID + "-dynamic-text", "textContent": selectValue, "text-anchor": this.line.textAlignment });
                        this._textGroupElement.append(this._outerTextElement);
                        var dynamicText = document.getElementById(this._prefix + this._elementID + "-dynamic-text").getBoundingClientRect();
                        var x1 = this._textPoints[select.toFixed()].X2,
                            y1 = this._textPoints[select.toFixed()].Y2,
                            x2 = this.line.X2,
                            y2 = this.line.Y2;
                        var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
                        if (distance < (dynamicText.width * 72 / 96)) {
                            this.line = {};
                            var value = (selectValue.toString().length)
                            var pixToDegree = (dynamicText.width * 72 / 96) - (this._isMobile() ? (value * 2) : (value * 4));
                            var degPoint = (parseFloat(select.toFixed(3).substr(0, 1)) == select.toFixed()) ? this._degPoint[select.toFixed()] + pixToDegree : this._degPoint[select.toFixed()] - pixToDegree;
                            var angle = (360 - degPoint) * (Math.PI / 180.0)
                            var radius = this._isMobile() ? (this.model.radius - (this.model.labelSpace)) : (this.model.radius + (this.model.labelSpace));
                            this.line.X2 = (this._startXY) + radius * Math.cos(angle);
                            this.line.Y2 = (this._startXY) + radius * Math.sin(-angle);
                            $("#" + this._prefix + this._elementID + "-dynamic-text").attr({ "x": this.line.X2, "y": this.line.Y2 });
                        }
                    }
                }
                else
                    selectValue = this.ticks()[select.toFixed()];
                this._trigger("change", { value: selectValue, oldValue: this.value() });
                if (this._needleStop && this.model.stop)
                    this._trigger("stop", { value: selectValue });
                this.value(selectValue);
                this._needleStop = true;
                this._needleMove = false;
                if (this._isMobile())
                    ((this.model.renderMode == "windows" || this.model.renderMode == "flat") ? this._dynamicWindowsRadial() : this._dynamicIOSandAndroidRadial());
            }
        },
        _selectPart: function () {
            var dynamicAngle = this._dynamicAngle, startAngle = this._startAngle, endAngle = this._endAngle;
            if (this._isMobile()) {
                var space = this.model.renderMode == "ios7" ? 5 : this.model.renderMode == "windows" ? 2.5 : 5;
                startAngle = this._startAngle + space, endAngle = this._endAngle - space;
                if (this.model.position.charAt(0).toLowerCase() == "l") {
                    if (this._dynamicAngle < 180)
                        dynamicAngle = this._dynamicAngle + 360;
                }
            }
            var select = (dynamicAngle - startAngle) / ((endAngle - startAngle) / (this.ticks().length - 1));
            var firstValue = this.ticks()[parseInt(select)];
            var secondValue = this.ticks()[parseInt(select) + 1];
            var difference = (secondValue - firstValue);
            return { select: select, firstValue: firstValue, space: space, difference: difference, dynamicAngle: dynamicAngle, };
        },
        _lineAngleCalculation: function (isMove) {
            var selectPart = this._selectPart();
            this._degPoint.splice(this.ticks().length, this.ticks().length + 1);
            this._degPoint.push(this._degPoint[this._degPoint.length - 1] + this._point);
            var innerValue = (((this._degPoint[parseInt(selectPart.select) + 1] - this._degPoint[parseInt(selectPart.select)]) - (this._degPoint[parseInt(selectPart.select) + 1] - (selectPart.dynamicAngle))) / (this._point / selectPart.difference));
            var startDegree = parseInt(selectPart.select) != 0 ? this._degPoint[parseInt(selectPart.select)] : this._degPoint[parseInt(selectPart.select)];
            var range;
            if (this.model.enableRoundOff && isMove) {
                var smallValue = parseFloat(innerValue.toFixed(2));
                innerValue = parseInt(innerValue.toFixed());
                range = (selectPart.difference == 0.5 && smallValue >= 0.25) ? this._point * 1 : (this._point / selectPart.difference) * innerValue;
            }
            else
                range = (this._point / selectPart.difference) * parseFloat(innerValue.toFixed(2));
            this._angle = (360 - this._degPoint[parseInt(selectPart.select)]) - Math.abs(range);
        },

        _isTicksControl: function () {
            var selectPart = this._selectPart();
            this._degPoint.splice(this.ticks().length, this.ticks().length + 1);
            this._degPoint.push(this._degPoint[this._degPoint.length - 1] + this._point);
            var innerValue = (((this._degPoint[parseInt(selectPart.select) + 1] - this._degPoint[parseInt(selectPart.select)]) - (this._degPoint[parseInt(selectPart.select) + 1] - (this._dynamicAngle))) / (this._point / selectPart.difference));
            var isSecSame = this.model.enableRoundOff ? parseInt(innerValue.toFixed()) == 0 || parseInt(innerValue.toFixed()) == (selectPart.difference) ? false : true : $.inArray(this._angle, this._degPoint) > -1 ? false : true;
            return isSecSame;
        },

        _ticksCalculation: function () {
            var selectPart = this._selectPart();
            var select = selectPart.select, dynamicAngle = selectPart.dynamicAngle, difference = selectPart.difference, firstValue = selectPart.firstValue, space = selectPart.space;
            var firstValue = this.ticks()[parseInt(select)];
            this.line = {};
            var angle = (this._angle) * (Math.PI / 180.0)
            var radius = this._isMobile() ? (this.model.radius - this.model.labelSpace) : (this.model.radius + this.model.labelSpace);
            this.line.X2 = (this._startXY) + radius * Math.cos(angle);
            this.line.Y2 = (this._startXY) + radius * Math.sin(-angle);
            if (this._angle <= 270 && 90 <= this._angle)
                this.line.textAlignment = "middle";
            else
                this.line.textAlignment = "start";
            var startDegree = parseInt(select) != 0 ? this._degPoint[parseInt(select)] : this._degPoint[parseInt(select)];
            var range = (dynamicAngle - startDegree) / (this._point / difference);
            var setValue;
            if (this.model.enableRoundOff) {
                var controlValue = parseFloat(range.toFixed(1).substr(1, 3));
                range = parseInt(range.toFixed());
                setValue = firstValue + Math.abs(range);
            }
            else {
                setValue = firstValue + Math.abs(parseFloat(range.toFixed(2)));
                setValue = parseFloat(setValue.toFixed(2));
            }
            return setValue;
        },
        _dynamicAngleCalculation: function (x1, x2, y1, y2) {
            var theta = Math.atan2((y2 - y1), (x2 - x1));
            this._angle = (360 - ((theta * 180) / Math.PI)) % 360;
            this._dynamicAngle = (360 + ((theta * 180) / Math.PI)) % 360;
        },
        _createSVGElements: function (element, attr) {
            var svgObj = document.createElementNS(this._svgLink, element);
            $.each(attr, function (attr, value) {
                if (attr == 'xlink:href')
                    svgObj.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', value);
                if (attr != "textContent")
                    svgObj.setAttribute(attr, value);
                else
                    svgObj.textContent = value;
            })
            return svgObj;
        },
        show: function () {
            if (this.model.enableAnimation) {
                this.element.removeClass(this._prefix + "slider-hide").addClass(this._prefix + "slider-show");
                this._radialSVG.attr("class", "").attr("class", (this._prefix + "radialslider-svg-show " + this._prefix + "rs-svg"));
            }
            this.element.css("display", "block");
            this.model.autoOpen = true;
        },
        hide: function () {
            var proxy = this;
            if (this.model.enableAnimation) {
                this.element.removeClass(this._prefix + "slider-show").addClass(this._prefix + "slider-hide");
                this._radialSVG.attr("class", "").attr("class", this._prefix + "radialslider-svg-hide " + this._prefix + "rs-svg");
               (this.model.autoOpen) ?
                setTimeout(function () {
                    proxy.element.css("display", "none");
                }, this._isMobile ? 150 : 400)
                : proxy.element.css("display", "none");
            }
            else
                proxy.element.css("display", "none");
            this.model.autoOpen = false;
        },
        _setModel: function (options) {
            if (!ej.isNullOrUndefined(options["inline"]) && !options["inline"]) this.model.radius += 50;
            if (options.ticks) this.model.ticks = options.ticks;
            this._refresh();
        },
        _clearElement: function () {
            this.element.removeAttr("class");
            this.element.html(this._orgEle.html());
        },
        _destroy: function () {
            this._wireEvents(true);
            this._clearElement();
        },
        _isMobile: function () {
            return (this._prefix == "e-m-" ? true : false);
        },
    });
})(jQuery, Syncfusion);;
// JavaScript source code
/**
* @fileOverview Plugin to style the Html Radial Slider elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejRadialSlider", "ej.RadialSlider", {
        _setFirst: true,
        validTags: ["div"],
        _rootCSS: "e-radialslider",
        defaults: {
            mouseover: null,
            strokeWidth: 2,
            inline: false,
            endAngle: 360,
            startAngle: 0,
            innerCircleImageClass: null,
            innerCircleImageUrl: null,
            showInnerCircle: true,
            inline: false

        },
        dataTypes: {
            innerCircleImageClass: "string",
            innerCircleImageUrl: "string",
            showInnerCircle: "boolean",
            inline: "boolean",
            strokeWidth: "number",
            endAngle: "number",
            startAngle: "number"
        },
        _init: function () {
            this._orgEle = this.element.clone();
            this._renderEJControl();
        },
        _renderEJControl: function () {
            this._prefix = "e-";
            this._directionLine = this._getStringBuilder();
            this._initialization();
            this._renderControl();
            this._wireEvents(false);
        },
        _initialization: function () {
            this.element.addClass(this.model.cssClass);
            this._svgLink = "http://www.w3.org/2000/svg";
            this._startXY = this.model.radius - (this.model.inline ? 50 : 0);
            this._startAngle = this.model.startAngle;
            this._endAngle = this.model.endAngle;
            this._diameter = 2 * this.model.radius;
            this._elementID = this.element.attr("id");
            this.model.radius = this._startXY;
            this._tickCount = this.ticks().length;
            this._labelSpacing = this.model.inline ? 0 : 200;
            this._radialWidth = this._diameter + this._labelSpacing;
            this.element.css({ "width": this._diameter + this._labelSpacing, "height": this._diameter + this._labelSpacing });
            this._radialSliderWrapper = ej.buildTag("div", {}, {}, { "class": this._prefix + "radail-slider-wrapper" }).css({ "width": this._radialWidth, "height": this._radialWidth });
            if (this.model.showInnerCircle) {
                this._innerCircle = ej.buildTag("div", {}, {}, { "class": this._prefix + "inner-circle" }).css({ "left": ((this._radialWidth / 2) - (20 + this.model.strokeWidth + 1)), "top": ((this._radialWidth / 2) - (20 + this.model.strokeWidth + 1)), "border-width": this.model.strokeWidth + 1 });
                if (this.model.innerCircleImageClass)
                    this._innerCircle.addClass(this.model.innerCircleImageClass);
                else
                    this._innerCircle.css({ "background-image": "url('" + this.model.innerCircleImageUrl + "')" });
                this._radialSliderWrapper.append(this._innerCircle);
            }
            this.element.append(this._radialSliderWrapper);
        },
        _renderControl: function () {
            //svg element creaton
            this._radialSVG = $(this._createSVGElements("svg", { "id": this._prefix +this._elementID+ "-radial-slider-svg", "class": this._prefix + "rs-svg", "width": this._diameter + this._labelSpacing, "height": this._diameter + this._labelSpacing }));
            //Outer line circle group
            var pathTranslate = this.model.inline ? 50 : 100, textTranslateX = this.model.inline ? 45 : 95, textTranslateY = this.model.inline ? 55 : 105;
            this._pathLineGroupElement = $(this._createSVGElements("g", { "id": "outerLineCircle", "transform": "translate(" + pathTranslate + "," + pathTranslate + ")" }));
            this._lineDirection = this._outerLineCalculation(50, 40, this._tickCount, true, true, "path");
            //Outer test  circle group
            this._textGroupElement = $(this._createSVGElements("g", { "id": "outerTextCircle", "transform": "translate(" + textTranslateX + "," + textTranslateY + ")" }));
            //Circle group
            this._circleGroupElement = $(this._createSVGElements("g", { "id": "circlegroup", "transform": "translate(" + pathTranslate + "," + pathTranslate + ")" }));
            this._circlePath = this._createSVGElements("path", { "id": "circlepath", "d": this._circleArcDirection(this._startAngle, this._endAngle), "class": this._prefix + "radialarcdefault", "fill": "none", "stroke-width": this.model.strokeWidth });
            this._circleGroupElement.append(this._circlePath);
            this._circleGroupElement.append(this._radialCircle);
            this._outerTextDirection = this._outerTextCalculation(this._tickCount, this._startAngle, this._endAngle);
            // Text value set in corresponding point
            for (var i = 0; i < this._tickCount + 1; i++) {
                var k = (i == 0) && (this._startAngle == 0) && (this._endAngle == 360) ? (this._tickCount - 1) : i;
                this._outerTextElement;
                if (i == this._tickCount) {
                    if ((this.ticks()[0] == this.value()))
                        continue;
                    else
                        this._outerTextElement = this._createSVGElements("text", { "stroke-width": 0.5, "x": this._outerTextDirection[i].X2, "y": this._outerTextDirection[i].Y2, "id": this._prefix + this._elementID + "-dynamic-text", "class": this._prefix + "dynamic-text", "textContent": this.value(), "text-anchor": this._outerTextDirection[i].textAlignment });
                }
                else
                    this._outerTextElement = this._createSVGElements("text", { "stroke-width": 0.5, "x": this._outerTextDirection[i].X2, "y": this._outerTextDirection[i].Y2, "class": this._prefix + "ticks-text", "textContent": this.ticks()[k], "text-anchor": this._outerTextDirection[i].textAlignment });
                this._textGroupElement.append(this._outerTextElement);
            }
            this._pathLineElement = this._createSVGElements("path", { "class": this._prefix + "radial-needle", "d": this._lineDirection, "fill": "none", "stroke-width": this.model.strokeWidth });
            this._pathLineGroupElement.append(this._pathLineElement);
            this._radialSliderWrapper.append(this._radialSVG.append(this._pathLineGroupElement).append(this._textGroupElement).append(this._circleGroupElement));
            if (this.model.autoOpen)
                this.show();
            else
                this.hide();
        },
        //Circel direction calculation
        _circleArcDirection: function (startAngle, endAngle) {
            var radius = (0.5 * Math.min(this._diameter - (this.model.inline ? 100 : 0), this._diameter - (this.model.inline ? 100 : 0)));
            var startPoint = this._polarToCartesian(this._startXY, this._startXY, radius, startAngle),
            endPoint = this._polarToCartesian(this._startXY, this._startXY, radius, endAngle);
            ArcSweep = endAngle - startAngle <= 180 ? "0" : "1";
            var direction = [
            "M", startPoint.x, startPoint.y,
            "A", radius, radius, 0, ArcSweep, 1, endPoint.x, endPoint.y - 1
            ].join(" ");
            return direction;
        },
        _overNeedleMoveHandler: function (e) {
            e.preventDefault();
            var baseRect = $("#" + this._prefix + this._elementID + "-radial-slider-svg").offset();
            var y2 = e.clientY, x2 = e.clientX, y1 = (baseRect.top + (this._radialWidth / 2)) - $(window).scrollTop(), x1 = baseRect.left + (this._radialWidth / 2);
            this._dynamicAngleCalculation(x1, x2, y1, y2);
            if ((this._angle > (360 - this._endAngle) && this._angle < (360 - this._startAngle))) {
                //Over element
                this.line = {};
                var radius = this.model.radius;
                this.line.X1 = this._startXY;
                this.line.Y1 = this._startXY;
                var cosAngle = Math.cos(this._angle * Math.PI / 180.0);
                var sinAngle = -(Math.sin(this._angle * Math.PI / 180.0));
                this.line.X2 = this._startXY + (radius - 5) * cosAngle;
                this.line.Y2 = this._startXY + (radius - 5) * sinAngle;
                if (this._overLine != undefined)
                    $(this._overLine).attr({ "d": [" M", this.line.X1, this.line.Y1, "L", this.line.X2, this.line.Y2].join(" "), "stroke-width": (this.model.strokeWidth == 1 ? this.model.strokeWidth - 0.5 : this.model.strokeWidth - 1) });
                else
                    this._overLine = this._createSVGElements("path", { "class": this._prefix + "needle-over", "d": [" M", this.line.X1, this.line.Y1, "L", this.line.X2, this.line.Y2].join(" "), "stroke-width": this.model.strokeWidth == 1 ? this.model.strokeWidth - 0.5 : this.model.strokeWidth - 1 });
                this._pathLineGroupElement.append(this._overLine);
                this._isNeedleOver = true;
                var selectValue = this._ticksCalculation();
                if (this.model.mouseover) {
                    this._trigger("mouseover", { value: selectValue, selectedValue: this.value() });
                }
            }
        },
        _needleMoveHandler: function (e) {
             ej.blockDefaultActions(e);
            if (ej.isTouchDevice())
                e = e.touches ? e.touches[0] : e;
            var baseRect = $("#" + this._prefix + this._elementID + "-radial-slider-svg").offset();
            var y2 = e.clientY, x2 = e.clientX, y1 = (baseRect.top + (this._radialWidth / 2)) - $(window).scrollTop(), x1 = baseRect.left + (this._radialWidth / 2);
            this._dynamicAngleCalculation(x1, x2, y1, y2);
            if ((this._angle > (360 - this._endAngle) && this._angle < (360 - this._startAngle))) {
                $(this._overLine).remove();
                this._lineAngleCalculation();
                var index = this._isTapSelected ? this._tickCount + 1 : this._tickCount;
                this._directionLine.remove(index, 1, 1);
                this._dynamicLineCalculation(this._angle, false, true, true, this._tickCount, this._tickCount + 1, false);
                $(this._pathLineElement).attr("d", this._directionLine.toString());
                if (this.model.slide) {
                    var selectValue = this._ticksCalculation();
                    this._trigger("slide", { value: selectValue, selectedValue: this.value() });
                }
                this._needleMove = true;
            }
        },
        _dynamicLineDirection: function (angle, lastValue, isDynamic) {
            var outerLine = {};
            var firstPoint = this._polarToCartesian(this._startXY, this._startXY, (this.model.radius), angle, isDynamic);
            var secondPoint = this._polarToCartesian(this._startXY, this._startXY, (this.model.radius + 10), angle, isDynamic);
            outerLine.X1 = firstPoint.x;
            outerLine.Y1 = firstPoint.y;
            outerLine.X2 = secondPoint.x;
            outerLine.Y2 = secondPoint.y;
            this._isTapSelected = true;
            this._directionLine.insert(lastValue + 2, [" M", outerLine.X1, outerLine.Y1, "L", outerLine.X2, outerLine.Y2].join(" "));
            return this._directionLine.toString();
        },
        _inLineCalculation: function (angle, isDynamic) {
            var line = {};
            var secondPoint = this._polarToCartesian(this._startXY, this._startXY, (this.model.radius - 5), angle, isDynamic);
            line.X1 = this._startXY, line.Y1 = this._startXY, line.X2 = secondPoint.x, line.Y2 = secondPoint.y;
            this._directionLine.append([" M", line.X1, line.Y1, "L", line.X2, line.Y2].join(" "));
            return this._directionLine.toString();
        },

        _dynamicLineCalculation: function (angle, isAppend, isRemove, isInsert, lastValue, insertValue, isOuter) {
            this.line = {};
            var radius = this.model.radius;
            this.line.X1 = this._startXY;
            this.line.Y1 = this._startXY;
            var cosAngle = Math.cos(angle * Math.PI / 180.0);
            var sinAngle = -(Math.sin(angle * Math.PI / 180.0));
            this.line.X2 = this._startXY + (radius - 5) * cosAngle;
            this.line.Y2 = this._startXY + (radius - 5) * sinAngle;
            if (isOuter) {
                this._dynamicLineDirection(angle, lastValue, true);
            }
            if (isAppend) {
                this._directionLine.append([" M", this.line.X1, this.line.Y1, "L", this.line.X2, this.line.Y2].join(" "));
            }
            if (isInsert) {
                this._directionLine.insert(lastValue + 3, [" M", this.line.X1, this.line.Y1, "L", this.line.X2, this.line.Y2].join(" "));
            }
            return this._directionLine.toString();
        },

        _getStringBuilder: function () {
            var data = [];
            var counter = 0;
            return {
                append: function (s) {
                    data[counter++] = s;
                    return this;
                },
                remove: function (i, j, k) {
                    counter = counter - (k || 1);
                    data.splice(i, j || 1);
                    return this;
                },
                insert: function (i, s) {
                    data.splice(i, 0, s);
                    counter++;
                    return this;
                },
                toString: function (s) { return data.join(s || ""); }
            }
        },
        _outerLineCalculation: function (dis1, dis2, length, isOuterLine, isinLine, element) {
            var radius = this.model.radius;
            var startAngle = this._startAngle,
                 endAngle = startAngle + ((this._endAngle - this._startAngle) / (length - 1));
            this._point = ((this._endAngle - this._startAngle) / (length - 1));
            var endValueCal = endAngle,
                startValueCal = endValueCal;
            var textPoints = [];
            this._degPoint = [];
            this._degPoint.push(startAngle);
            if (isOuterLine) {
                for (var j = 0; j < length; j++) {
                    var line = {};
                    startAngle = startAngle * Math.PI / 180.0;
                    endAngle = endAngle * Math.PI / 180.0;
                    this._degPoint.push(endValueCal);
                    if (element != "text") {
                        line.X1 = this._startXY + (radius) * Math.cos(startAngle);
                        line.Y1 = this._startXY + (radius) * Math.sin(startAngle);
                    }
                    line.X2 = this._startXY + (radius + 10) * Math.cos(startAngle);
                    line.Y2 = this._startXY + (radius + 10) * Math.sin(startAngle);
                    startAngle = endValueCal;
                    endAngle = endValueCal + this._point;
                    endValueCal += this._point;
                    element == "path" ? this._directionLine.append([" M", line.X1, line.Y1, "L", line.X2, line.Y2].join(" ")) : textPoints.push(line);
                }
            }
            if (isinLine) {
                for (var i = 0; i < this.ticks().length; i++) {
                    var k = i + 1;
                    var lastValue = i == (this.ticks().length - 1) ? this.ticks()[this.ticks().length - 1] + 0.5 : this.ticks()[k];
                    var firstValue = i == 0 ? this.ticks()[i] - 0.5 : this.ticks()[i];
                    var ticksSecond = firstValue <= 0 && firstValue >= this.value() ? true : false;
                    var ticksFirst = lastValue <= 0 && lastValue <= this.value() ? true : false;
                    var condition = ticksSecond && ticksFirst ? true : (firstValue <= this.value() && this.value() < lastValue);
                    if (condition) {
                        if (this.ticks()[i] != this.value()) {
                            var difference = this._point / (this.ticks()[k] - this.ticks()[i]);
                            var angleDifference = this.ticks()[k] - this.value();
                            this._startValueAngle = this._degPoint[k] - (difference * angleDifference);
                            this._dynamicLineDirection(this._startValueAngle, this._tickCount - 2, false);
                            this._inLineCalculation(this._startValueAngle, false);
                        }
                        else {
                            this._startValueAngle = this._degPoint[i];
                            this._inLineCalculation(this._startValueAngle, false);
                        }
                    }
                }
            }
            this._path = element == "path" ? this._directionLine.toString() : textPoints;
            return this._path;
        },
        _refresh: function () {
            this._destroy();
            this.element.addClass("e-radialslider e-js");			
            this._renderEJControl();
        },
        //events part
        _createDelegates: function () {
            this._touchStartDelegate = $.proxy(this._touchStartHandler, this);
            this._needleMoveDelegate = $.proxy(this._needleMoveHandler, this);
            this._touchEndDelegate = $.proxy(this._touchEndHandler, this);
            this._overNeedleMoveDelegate = $.proxy(this._overNeedleMoveHandler, this);
            this._mouseOutDelegate = $.proxy(this._mouseOutHandler, this);
            this._enterMouseDelegates = $.proxy(this._entermouse, this);
        },
        _wireEvents: function (remove) {
            var eventType = remove ? "off" : "on";
            this._createDelegates();
            ej.listenEvents([this._radialSVG, this._radialSVG, this._radialSVG, this._radialSVG], [ej.endEvent(), ej.startEvent(), "mouseenter", "mouseleave"], [this._touchEndDelegate, this._touchStartDelegate, this._enterMouseDelegates, this._mouseOutDelegate], false);
        },
        _entermouse: function (e) {
            ej.listenEvents([this._radialSVG], [ej.moveEvent()], [this._overNeedleMoveDelegate], false);
        },
        _mouseOutHandler: function (e) {
            e.preventDefault();
            if (this._radialSVG.has(e.target).length == 0 && this._needleMove) {
                ej.listenEvents([this._radialSVG], [ej.moveEvent()], [this._needleMoveDelegate], true);
                var lastAngle = this._previousAngle != undefined ? this._previousAngle : this._startValueAngle;
                this._pathAfterAddLength = this._directionLine.toString().replace(/[^M]/g, "").length;
                this._directionLine.remove(this._pathAfterAddLength - 1, 1);
                this._inLineCalculation(lastAngle, true);
                $(this._pathLineElement).attr("d", this._directionLine.toString());
                this._needleMove = false;
            }
            $(this._overLine).remove();
        },
        _touchEndHandler: function (e) {
            e = e.touches ? e.changedTouches[0] : e;
            ej.listenEvents([this._radialSVG], [ej.moveEvent()], [this._needleMoveDelegate], true);
            this._tapHandlerEvent(e);
        },
        _touchStartHandler: function (e) {
            ej.blockDefaultActions(e);
            if (ej.isTouchDevice())
                e = e.touches ? e.touches[0] : e;
            this._needleStop = false;
            if (this.model.start)
                this._trigger("start", { value: this.value() });
            ej.listenEvents([this._radialSVG], [ej.moveEvent()], [this._needleMoveDelegate], false);
        }

    })
    $.extend(true, ej.RadialSlider.prototype, ej.RadialSliderBase.prototype);
})(jQuery, Syncfusion);;

});