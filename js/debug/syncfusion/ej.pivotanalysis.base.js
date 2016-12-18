/*!
*  filename: ej.pivotanalysis.base.js
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
	
(function ($, ej, undefined) {
    var colKeysCalcValues = [], rowKeysCalcValues = [], tableKeysCalcValues = [], gridMatrix = null, columnHeaders = null, valueArea = null, rowTotCalc = [], colTotCalc = [],
    transposeEngine = [], tRowCnt = 0, tColCnt = 0, cellType = "", sortedElements, filteredMembers, fieldMembers = {}, summaryTypes = [], locale = "en-US";
    ej.PivotAnalysis = {
        pivotEnginePopulate: function (model) {
            var dataSource = model.dataSource, transposeEngine = [];
            locale = model.locale;
            var colAxis = dataSource.columns, rowAxis = dataSource.rows, filters = dataSource.filters, calcValues = dataSource.values, colLen, jsonObj = [], pivotFieldList = [], rowLen;
            summaryTypes = [];
            for (var i = 0; i < calcValues.length; i++) summaryTypes.push(calcValues[i].summaryType != null && calcValues[i].summaryType != undefined ? calcValues[i].summaryType : ej.PivotAnalysis.SummaryType.Sum);
            if (dataSource.data != null) {
                for (var cnt = 0; cnt < dataSource.data.length; cnt++) {
                    list = dataSource.data[cnt];
                    var table = { keys: [], uniqueName: "", value: null }, row = { keys: [], uniqueName: "", value: null }, col = { keys: [], uniqueName: "", value: null }, values = { keys: [], uniqueName: "", value: null };
                    var isExcluded = false;

                    for (var i = 0; i < filters.length; i++) {
                        var val = this._getReflectedValue(list, filters[i].fieldName, null, null);
                        if (fieldMembers[filters[i].fieldName] == undefined || fieldMembers[filters[i].fieldName] == null)
                            fieldMembers[filters[i].fieldName] = [val];
                        else if ($.inArray(val, fieldMembers[filters[i].fieldName]) == -1)
                            fieldMembers[filters[i].fieldName].push(val);
                        if (filters[i].filterItems != null && filters[i].filterItems != undefined) {
                            if (((filters[i].filterItems.filterType == ej.PivotAnalysis.FilterType.Exclude || filters[i].filterItems.filterType == null) && $.inArray(val != null ? val.toString() : val, filters[i].filterItems.values) >= 0) || (filters[i].filterItems.filterType == ej.PivotAnalysis.FilterType.Include && $.inArray(val != null ? val.toString() : val, rowAxis[rC].filterItems.values) < 0)) {
                                isExcluded = true;
                                break;
                            }
                        }
                    }

                    for (var nC = 0; nC < calcValues.length; nC++) {
                        var val = "";
                        if (calcValues[nC] != undefined && calcValues[nC] != null) {
                            val = this._getReflectedValue(list, calcValues[nC].fieldName, calcValues[nC].format, calcValues[nC].formatString);
                            if (fieldMembers[calcValues[nC].fieldName] == undefined || fieldMembers[calcValues[nC].fieldName] == null)
                                fieldMembers[calcValues[nC].fieldName] = [val];
                            else if ($.inArray(val, fieldMembers[calcValues[nC].fieldName]) == -1)
                                fieldMembers[calcValues[nC].fieldName].push(val);
                        }
                        var outputString = val != null ? val.toString().replace(/([AMPME~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,-.\/? ])+/g, '') : "0";
                        outputString = outputString.replace(ej.globalize.preferredCulture(locale).numberFormat.currency.symbol, "");
                        if ($.isNumeric(outputString) || calcValues[nC].format == "date")
                            values.keys.push(val);
                        else
                            values.keys.push(1);
                    }

                    for (var rC = 0; rC < rowAxis.length; rC++) {
                        var val = "";
                        if (rowAxis[rC] != undefined && rowAxis[rC] != null) {
                            val = this._getReflectedValue(list, rowAxis[rC].fieldName, null, null);
                            if (fieldMembers[rowAxis[rC].fieldName] == undefined || fieldMembers[rowAxis[rC].fieldName] == null)
                                fieldMembers[rowAxis[rC].fieldName] = [val];
                            else if ($.inArray(val, fieldMembers[rowAxis[rC].fieldName]) == -1)
                                fieldMembers[rowAxis[rC].fieldName].push(val);
                            if (rowAxis[rC].filterItems != null && rowAxis[rC].filterItems != undefined) {
                                if (((rowAxis[rC].filterItems.filterType == ej.PivotAnalysis.FilterType.Exclude || rowAxis[rC].filterItems.filterType == null) && $.inArray(val != null ? val.toString() : val, rowAxis[rC].filterItems.values) >= 0) || (rowAxis[rC].filterItems.filterType == ej.PivotAnalysis.FilterType.Include && $.inArray(val != null ? val.toString() : val, rowAxis[rC].filterItems.values) < 0)) {
                                    isExcluded = true;
                                    break;
                                }
                            }
                        }
                        if (val==null || !val.toString().replace(/^\s+|\s+$/gm,''))
                            val = "(blank)";
                        row.keys.push(val)
                        row.uniqueName += (row.uniqueName == "" ? val : ("." + val));
                        table.keys.push(val);
                        table.uniqueName += (table.uniqueName == "" ? val : ("." + val));
                    }

                    for (var cC = 0; cC < colAxis.length; cC++) {
                        var val = "";
                        if (colAxis[cC] != undefined && colAxis[cC] != null) {
                            val = this._getReflectedValue(list, colAxis[cC].fieldName, null, null);
                            if (fieldMembers[colAxis[cC].fieldName] == undefined || fieldMembers[colAxis[cC].fieldName] == null)
                                fieldMembers[colAxis[cC].fieldName] = [val];
                            else if ($.inArray(val, fieldMembers[colAxis[cC].fieldName]) == -1)
                                fieldMembers[colAxis[cC].fieldName].push(val);
                            if (colAxis[cC].filterItems != null && colAxis[cC].filterItems != undefined) {
                                if (((colAxis[cC].filterItems.filterType == ej.PivotAnalysis.FilterType.Exclude || colAxis[cC].filterItems.filterType == null) && $.inArray(val != null ? val.toString() : val, colAxis[cC].filterItems.values) >= 0) || (colAxis[cC].filterItems.filterType == ej.PivotAnalysis.FilterType.Include && $.inArray(val != null ? val.toString() : val, colAxis[cC].filterItems.values) < 0)) {
                                    isExcluded = true;
                                    break;
                                }
                            }
                        }
                        if (val==null || !val.toString().replace(/^\s+|\s+$/gm, ''))
                            val = "(blank)";
                        col.keys.push(val);
                        col.uniqueName += (col.uniqueName == "" ? val : ("." + val));
                        table.keys.push(val);
                        table.uniqueName += (table.uniqueName == "" ? val : ("." + val));
                    }

                    if (!isExcluded) {
                        this._isMemberExist("row", row, $.extend(true, {}, values), dataSource);
                        this._isMemberExist("column", col, $.extend(true, {}, values), dataSource);
                        this._isMemberExist("calc", table, $.extend(true, {}, values), dataSource);
                    }

                    jQuery.each(list, function (fieldName, value) {
                        if ((jQuery.inArray(fieldName, pivotFieldList)) == -1)
                            pivotFieldList.push(fieldName);
                    });

                    var treeviewData = [];
                    jQuery.each(calcValues, function (item, value) {
                        if (value.isCalculatedField==true && (jQuery.inArray(value.fieldName, pivotFieldList)) == -1)
                            pivotFieldList.push(value.fieldName);
                    });
                    for (var t = 0; t < pivotFieldList.length; t++) {
                        var checkedState = $.grep(dataSource.rows, function (item) { return item.fieldName == pivotFieldList[t]; }).length > 0 || $.grep(dataSource.columns, function (item) { return item.fieldName == pivotFieldList[t]; }).length > 0 || $.grep(dataSource.values, function (item) { return item.fieldName == pivotFieldList[t]; }).length > 0 || $.grep(dataSource.filters, function (item) { return item.fieldName == pivotFieldList[t]; }).length > 0;
                        treeviewData.push({ id: pivotFieldList[t], name: pivotFieldList[t], isSelected: checkedState, spriteCssClass: "" });
                    }
                }
            }

            for (var i = 0; i < calcValues.length; i++) {
                var temp = $.grep(calcValues, function (value) { return (value.isCalculatedField == true) });
                if (calcValues[i].isCalculatedField && temp.length !=calcValues.length) {
                    for (var j = 0; j < tableKeysCalcValues.length; j++) {
                        var formula = calcValues[i].formula.replace(/\s/g,"");
                        for (var k = 0; k < calcValues.length; k++) {
                            if (calcValues[k].isCalculatedField != true)
                                formula = formula.replace(new RegExp(calcValues[k].fieldName, 'g'), ej.globalize.parseFloat(tableKeysCalcValues[j].value.keys[k] == null ? "0" : calcValues[k].format == "date" ? this._dateToInt(tableKeysCalcValues[j].value.keys[k].toString()).toString() : calcValues[k].format == "time" ? this._dateToInt(new Date("1900", tableKeysCalcValues[j].value.keys[k].toString().split(":")[0], tableKeysCalcValues[j].value.keys[k].toString().split(":")[1], tableKeysCalcValues[j].value.keys[k].toString().split(":")[2].split(" ")[0]).toString()).toString() : tableKeysCalcValues[j].value.keys[k].toString()));
                        }
                        if (formula.indexOf("^") > -1)
                            formula = this._powerFunction(formula);
                        var oldValue=dataSource.values[i].format == null ? eval(formula) : eval(formula).toString();
                        var newValue = dataSource.values[i].format == null ? 0 : "0";
                        tableKeysCalcValues[j].value.keys[i] = this._getSummaryValue(oldValue, newValue, 1, summaryTypes[i], dataSource.values[i].format, dataSource.values[i].formatString);
                    }
                }
                else if(calcValues[i].isCalculatedField)
                {
                    var val = { keys: [], uniqueName: "", value: null };
                    for (var j = 0; j < tableKeysCalcValues.length; j++) {
                        for (var k = 0; k < calcValues.length && calcValues[k].isCalculatedField; k++) {
                            var formula = calcValues[k].formula.replace(/\s/g, "");
                            if (formula.indexOf("^") > -1)
                                formula = this._powerFunction(formula);
                            var oldValue = dataSource.values[k].format == null ? eval(formula) : eval(formula).toString();
                            var newValue = dataSource.values[k].format == null ? 0 : "0";
                            val.keys.push(this._getSummaryValue(oldValue, newValue, 1, "sum", dataSource.values[k].format, dataSource.values[k].formatString));
                        }
                        tableKeysCalcValues[j].value = val;
                        val = { keys: [], uniqueName: "", value: null };
                    }
                }
            }
            if (rowAxis.length > 0)
                rowKeysCalcValues = this._sortHeaders(rowKeysCalcValues, rowAxis, 0);
            if (colAxis.length > 0)
                colKeysCalcValues = this._sortHeaders(colKeysCalcValues, colAxis, 0);

            if (colAxis.length > 0)
                this._insertTotalHeader(colAxis, colKeysCalcValues);
            if (rowAxis.length > 0)
                this._insertTotalHeader(rowAxis, rowKeysCalcValues);
            else if (calcValues.length > 0)
                rowKeysCalcValues[0].keys[0] = "Grand Total";

            tRowCnt = 0, tColCnt = 0;
            this._calculateValues(dataSource);
            var isColumnEmpty = (colKeysCalcValues.length == 1 && colKeysCalcValues[0].cellType == "RGTot");
            colTotCalc = [], rowTotCalc = [], colKeysCalcValues = []; rowKeysCalcValues = []; tableKeysCalcValues = [];
            for (var rCnt = 0; rCnt < (tRowCnt - 1) ; rCnt++) {
                for (var cCnt = 0; cCnt < (tColCnt - 1) ; cCnt++) {
                    if (transposeEngine[cCnt] == undefined)
                        transposeEngine[cCnt] = [];
                    if (gridMatrix[rCnt] != undefined && gridMatrix[rCnt][cCnt] != undefined)
                        transposeEngine[cCnt][rCnt] = {
                            Index: cCnt + ',' + rCnt, CSS: gridMatrix[rCnt][cCnt].CSS, Value: ((typeof (gridMatrix[rCnt][cCnt]) === 'string' || typeof (gridMatrix[rCnt][cCnt]) === 'number' || typeof (gridMatrix[rCnt][cCnt]) === 'object') ? gridMatrix[rCnt][cCnt].Value == 0 ? "" : gridMatrix[rCnt][cCnt].Value == undefined ? "" : gridMatrix[rCnt][cCnt].Value : ""), State: gridMatrix[rCnt][cCnt].State,
                            RowSpan: (gridMatrix[rCnt][cCnt].RowSpan != undefined ? gridMatrix[rCnt][cCnt].RowSpan : 1),
                            ColSpan: (gridMatrix[rCnt][cCnt].ColSpan != undefined ? gridMatrix[rCnt][cCnt].ColSpan : 1), Info: "", Span: "None", Expander: gridMatrix[rCnt][cCnt].Expander
                        };
                    else if (gridMatrix[rCnt] != undefined)
                        transposeEngine[cCnt][rCnt] = {
                            Index: cCnt + ',' + rCnt, CSS: "none", Value: "", State: 0,
                            RowSpan: 1,
                            ColSpan: 1, Info: "", Span: "None", Expander: 0
                        };
                }
            }

            for (var rCnt = 0; rCnt < (tColCnt - 1) ; rCnt++) {
                rowAxis.length = rowAxis.length == 0 ? 1 : rowAxis.length;
                if (rCnt < rowAxis.length) {
                    var emptyCellColSpan = (isColumnEmpty ? 1 : colAxis.length) + (dataSource.values.length > 0 ? 1 : 0);
                    if (emptyCellColSpan == 0 && rowAxis.length > 0) emptyCellColSpan = 1;
                    for (var tcnt = 0; tcnt < emptyCellColSpan ; tcnt++) {
                        if (gridMatrix.length > 0)
                            jsonObj.push({
                                Index: rCnt + ',' + tcnt, CSS: "none", Value: "", State: 0,
                                ColSpan: ((rCnt == 0 && tcnt == 0) ? rowAxis.length : 1),
                                RowSpan: ((rCnt == 0 && tcnt == 0) ? (isColumnEmpty ? 1 : colAxis.length) + (dataSource.values.length > 0 ? 1 : 0) : 1), Info: "", Span: "None", Expander: 0
                            });
                    }
                }
                for (var cCnt = 0; cCnt < (tRowCnt - 1) ; cCnt++) {
                    if (transposeEngine[rCnt] != undefined && transposeEngine[rCnt][cCnt] != undefined && !(cCnt < (isColumnEmpty ? 1 : colAxis.length) + (dataSource.values.length > 0 ? 1 : 0) && rCnt < rowAxis.length))
                        jsonObj.push(transposeEngine[rCnt][cCnt]);
                }
            }
            gridMatrix = [];
            if (dataSource.rows[0] == undefined)
                dataSource.rows.length = 0;
            return ({ json: jsonObj, pivotEngine: transposeEngine, report: dataSource, treeviewData: treeviewData });
        },

        getMembers: function (field) {
            return fieldMembers[field];
        },

        _powerFunction: function (formula) {
            if (formula.indexOf("^") > -1) {
                var items = [];
                while (formula.indexOf("(") > -1) {
                    formula = formula.replace(/(\([^\(\)]*\))/g, function (text, item) {
                        items.push(item);
                        return ("~" + (items.length - 1));
                    });
                }

                items.push(formula);
                formula = "~" + (items.length - 1);
                while (formula.indexOf("~") > -1) {
                    formula = formula.replace(new RegExp("~" + "(\\d+)", "g"), function (text, index) {
                        return items[index].replace(/(\w*)\^(\w*)/g, "Math.pow" + "($1,$2)");
                    });
                }
            }
            return formula;
        },
        _calculatedFieldSummaryValue: function (index,calValue,dataSource) {
            if (dataSource.values[index].isCalculatedField == true) {
                var formula = dataSource.values[index].formula.replace(/\s/g,"");
                for (var i = 0; i < dataSource.values.length; i++) {
                    if (dataSource.values[i].isCalculatedField != true)
                        formula = formula.replace(new RegExp(dataSource.values[i].fieldName, 'g'), ej.globalize.parseFloat(calValue[i] == null ? "0" : dataSource.values[i].format == "date" ? this._dateToInt(calValue[i].toString()).toString() : dataSource.values[i].format == "time" ? this._dateToInt(new Date("1900", calValue[i].toString().split(":")[0], calValue[i].toString().split(":")[1], calValue[i].toString().split(":")[2].split(" ")[0]).toString()).toString() : calValue[i].toString()));
                }
                if (formula.indexOf("^") > -1)
                    formula = this._powerFunction(formula);
                var oldValue = dataSource.values[index].format == null ? eval(formula) : eval(formula).toString();
                var newValue = dataSource.values[index].format == null ? 0 : "0";
                return this._getSummaryValue(oldValue, newValue, 1, summaryTypes[index] == "count" ? "sum" : summaryTypes[index], dataSource.values[index].format, dataSource.values[index].formatString);
            }
        },

        _sortHeaders: function (memberArray, axisElements, level) {
            var subArray = [], resultantArray = [], membersCount = 0;
            var sortedArray = ej.DataManager(memberArray).executeLocal(ej.Query().sortBy("keys." + level, axisElements[level].sortOrder != null && axisElements[level].sortOrder == ej.PivotAnalysis.SortOrder.Descending ? ej.sortOrder.Descending : ej.sortOrder.Ascending, false));
            while (membersCount < sortedArray.length) {
                var memberName = sortedArray[membersCount].keys[level];
                subArray = $.grep(sortedArray, function (item) { return item.keys[level] == memberName; });
                if (subArray.length > 1 && level + 1 < sortedArray[membersCount].keys.length)
                    subArray = this._sortHeaders(subArray, axisElements, level + 1);
                resultantArray = resultantArray.concat(subArray);
                membersCount += subArray.length;
            }
            return resultantArray;
        },

        _getReflectedValue: function (recSet, fieldName, format, formatString) {
            var val = $(recSet).prop(fieldName);
            if (val == null)
                return val;
            switch (format) {
                case "percentage":
                    val = ej.widgetBase.formatting("{0:P}", val, locale);
                    break;
                case "decimal":
                case "number":
                    val = ej.widgetBase.formatting("{0:N}", val, locale);
                    break;
                case "currency":
                    val = ej.widgetBase.formatting("{0:C2}", val, locale);
                    break;
                case "date":
                    val = new Date(((Number(val) - 2) * (1000 * 3600 * 24)) + new Date("01/01/1900").getTime());
                    if (this._isDateTime(val))
                        val = ej.widgetBase.formatting("{0:" + (formatString == undefined ? "MM/dd/yyyy" : formatString) + "}", val, locale)
                    break;
                case "scientific":
                    val = val.toExponential(2).replace("e", "E");
                    break;
                case "accounting":
                    val = this._toAccounting(val, "{0:C2}", locale);
                    break;
                case "time":
                    val = new Date(((Number(val) - 2) * (1000 * 3600 * 24)) + new Date("01/01/1900").getTime());
                    if (this._isDateTime(val))
                        val = ej.widgetBase.formatting("{0:h:mm:ss tt}", val, locale);
                    break;
                case "fraction":
                    val = this._toFraction(val);
                    val = "numerator" in val ? val.integer + " " + val.numerator + "/" + val.denominator : val.integer
                    break;
                default: val;
            }
            return val;
        },
        _isDateTime: function(date){
            return Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.valueOf());
        },
        _toAccounting: function (value, formatStr, locale) {
            var numFormat = ej.preferredCulture(locale).numberFormat, prefix, suffix, symbol = numFormat.currency.symbol;
            val = ej.widgetBase.formatting(formatStr, value);
            var trunVal = val.replace(symbol, ""), idx = val.indexOf(symbol);
            if (!idx || (value < 0 && idx === 1)) {
                prefix = symbol;
                suffix = !Number(value) ? "-" : trunVal;
            }
            else {
                prefix = !Number(value) ? "-" : trunVal;
                suffix = symbol;
            }
            value = prefix + "   " + suffix;
            return value;
        },
        _toFraction: function(value){
            if (this._isNumber(value)) {
                var input = value.toString(), integerVal = input.split(".")[0], decimalVal = input.split(".")[1];
                if (!decimalVal)
                    return { integer: value };
                var wholeVal = (+decimalVal).toString(), placeVal = this._getPlaceValue(decimalVal, wholeVal), gcd = this._getGCD(wholeVal, placeVal);
                return { integer: integerVal, numerator: Number(wholeVal) / gcd, denominator: Number(placeVal) / gcd };
            }
            return null;
        },
        _isNumber: function (val) {
            return val - parseFloat(val) >= 0;
        },
        _getGCD: function (a, b) {  //make generic gcd of multiple no
            a = Number(a);
            b = Number(b);
            if (!b)
                return a;
            return this._getGCD(b, a % b);
        },
        _getPlaceValue: function (val, digit) {
            var index = val.indexOf(digit) + digit.length;
            return "1" + Array(index + 1).join("0");
        },
        _isMemberExist: function (axis, axisData, value, dataSource) {
            switch (axis) {
                case "row":
                    var pos, flag = false;
                    if (rowKeysCalcValues.length == 0)
                        rowKeysCalcValues.push(axisData);
                    for (var cnt = 0; cnt < rowKeysCalcValues.length; cnt++)
                        if (axisData.uniqueName == rowKeysCalcValues[cnt].uniqueName) {
                            flag = true; pos = cnt;
                            break;
                        }
                    if (flag) {
                        for (var vC = 0; vC < value.keys.length; vC++)
                            if (rowKeysCalcValues[pos].value == null) {
                                rowKeysCalcValues[pos].value = value;
                                break;
                            }
                            else
                                rowKeysCalcValues[pos].value.keys[vC] += value.keys[vC];
                    }
                    else
                        rowKeysCalcValues.push(axisData);

                    break;
                case "column":
                    var pos, flag = false;
                    if (colKeysCalcValues.length == 0 && (dataSource.columns.length > 0 || dataSource.values.length>0))
                        colKeysCalcValues.push(axisData);
                    for (var cnt = 0; cnt < colKeysCalcValues.length; cnt++)
                        if (axisData.uniqueName == colKeysCalcValues[cnt].uniqueName) {
                            flag = true; pos = cnt;
                            break;
                        }
                    if (flag) {
                        for (var vC = 0; vC < value.keys.length; vC++)
                            if (colKeysCalcValues[pos].value == null) {
                                colKeysCalcValues[pos].value = value;
                                break;
                            }
                            else
                                colKeysCalcValues[pos].value.keys[vC] += value.keys[vC];
                    }
                    else if (dataSource.columns.length > 0 || dataSource.values.length>0)
                        colKeysCalcValues.push(axisData);
                    break;
                case "calc":
                    var pos, flag = false;
                    if (tableKeysCalcValues.length == 0)
                        tableKeysCalcValues.push(axisData);
                    for (var cnt = 0; cnt < tableKeysCalcValues.length; cnt++)
                        if (axisData.uniqueName == tableKeysCalcValues[cnt].uniqueName) {
                            flag = true; pos = cnt;
                            break;
                        }
                    if (flag) {
                        for (var vC = 0; vC < value.keys.length; vC++) {
                            if (tableKeysCalcValues[pos].value == null) {
                                tableKeysCalcValues[pos].value = value;
                                tableKeysCalcValues[pos].value["count"] = 1;
                                for (var i = 0; i < value.keys.length; i++) {
                                    if (summaryTypes[i] == ej.PivotAnalysis.SummaryType.Count)
                                        tableKeysCalcValues[pos].value.keys[i] = tableKeysCalcValues[pos].value.count;
                                }
                                break;
                            }
                            else {
                                tableKeysCalcValues[pos].value.count++;
                                if (dataSource.values[vC].isCalculatedField != true)
                                    tableKeysCalcValues[pos].value.keys[vC] = this._getSummaryValue(tableKeysCalcValues[pos].value.keys[vC], value.keys[vC], tableKeysCalcValues[pos].value.count, summaryTypes[vC], dataSource.values[vC].format, dataSource.values[vC].formatString);
                            }
                        }
                    }
                    else {
                        tableKeysCalcValues.push(axisData);
                        tableKeysCalcValues[tableKeysCalcValues.length - 1].value = value;
                        for (var i = 0; i < value.keys.length; i++) {
                            if (summaryTypes[i] == ej.PivotAnalysis.SummaryType.Count)
                                tableKeysCalcValues[tableKeysCalcValues.length - 1].value.keys[i] = 1;
                            tableKeysCalcValues[tableKeysCalcValues.length - 1].value["count"] = 1;
                        }
                    }
                    break;
            }
        },

        _getSummaryValue: function (oldValue, newValue, count, type, format, formatString) {
            switch (format) {
                case "date":
                    oldValue = ej.parseDate(oldValue, (formatString == undefined ? "MM/dd/yyyy" : formatString), locale) != null ? this._dateToInt(ej.parseDate(oldValue, (formatString == undefined ? "MM/dd/yyyy" : formatString), locale)) : oldValue;
                    newValue = ej.parseDate(newValue, (formatString == undefined ? "MM/dd/yyyy" : formatString), locale) != null ? this._dateToInt(ej.parseDate(newValue, (formatString == undefined ? "MM/dd/yyyy" : formatString), locale)) : newValue;
                    break;
                case "percentage":
                    oldValue = oldValue != 0 ? ej.globalize.parseFloat(oldValue, locale) / 100 : oldValue;
                    newValue = ej.globalize.parseFloat(newValue, locale) / 100;
                    break;
                case "currency":
                case "accounting":
                    oldValue = oldValue != 0 ? ej.globalize.parseFloat(ej.globalize.format(oldValue, "c", locale), locale) : oldValue;
                    newValue = ej.globalize.parseFloat(ej.globalize.format(newValue, "c", locale), locale);
                    break;
                case "decimal":
                case "number":
                    oldValue = oldValue != 0 ? ej.globalize.parseFloat(oldValue, locale) : oldValue;
                    newValue = ej.globalize.parseFloat(newValue, locale);
                    break;
                case "scientific":
                    oldValue = oldValue != 0 ? parseFloat(oldValue) : oldValue;
                    newValue = parseFloat(newValue);
                    break;
                case "time":
                    if (!this._isNumber(oldValue)) {
                        var time = oldValue.toString().split(":");
                        time = new Date("1900", time[0], time[1], time[2].split(" ")[0]).toString();
                        oldValue = this._dateToInt(time);
                    }
                    if (!this._isNumber(newValue)) {
                        var time = newValue.toString().split(":");
                        time = new Date("1900", time[0], time[1], time[2].split(" ")[0]).toString();
                        newValue = this._dateToInt(time);
                    }
                    break;
                case "fraction":
                    var temp1 = parseFloat(oldValue.toString().split(" ")[0]), temp2 = eval(oldValue.toString().split(" ")[1]) != undefined ? parseFloat(eval(oldValue.toString().split(" ")[1])) : parseFloat(0), temp3 = parseFloat(newValue.toString().split(" ")[0]), temp4 = eval(newValue.toString().split(" ")[1]) != undefined ? parseFloat(eval(newValue.toString().split(" ")[1])) : parseFloat(0);
                    oldValue = oldValue != 0 ? temp1 + temp2 : oldValue;
                    newValue = temp3 + temp4;
                    break;
            }
            switch (type) {
                case ej.PivotAnalysis.SummaryType.Sum:
                    oldValue += newValue;
                    break;
                case ej.PivotAnalysis.SummaryType.Average:
                    oldValue = (oldValue * (count - 1) + newValue) / count;
                    if (Math.floor(oldValue) != oldValue) oldValue = Number(oldValue.toFixed(2));
                    break;
                case ej.PivotAnalysis.SummaryType.Min:
                    oldValue = count == 1 ? newValue : Math.min(oldValue, newValue);
                    break;
                case ej.PivotAnalysis.SummaryType.Max:
                    oldValue = count == 1 ? newValue : Math.max(oldValue, newValue);
                    break;
                case ej.PivotAnalysis.SummaryType.Count:
                    oldValue = count;
                    break;
            }
            switch (format) {
                case "percentage":
                    oldValue = ej.widgetBase.formatting("{0:P}", oldValue, locale);
                    break;
                case "decimal":
                case "number":
                    oldValue = ej.widgetBase.formatting("{0:N}", oldValue, locale);
                    break;
                case "date":
                    oldValue = new Date(((Number(oldValue) - 2) * (1000 * 3600 * 24)) + new Date("01/01/1900").getTime());
                    if (this._isDateTime(oldValue))
                        oldValue = ej.widgetBase.formatting("{0:" + (formatString == undefined ? "MM/dd/yyyy" : formatString) + "}", oldValue, locale);
                    break;
                case "currency":
                    oldValue = ej.widgetBase.formatting("{0:C2}", oldValue, locale);
                    break;
                case "scientific":
                    oldValue = oldValue.toExponential(2).replace("e", "E");
                    break;
                case "accounting":
                    oldValue = this._toAccounting(oldValue, "{0:C2}", locale);
                    break;
                case "time":
                    oldValue = new Date(((Number(oldValue) - 2) * (1000 * 3600 * 24)) + new Date("01/01/1900").getTime());
                    if (this._isDateTime(oldValue))
                        oldValue = ej.widgetBase.formatting("{0:h:mm:ss tt}", oldValue, locale);
                    break;
                case "fraction":
                    oldValue = this._toFraction(oldValue);
                    oldValue = "numerator" in oldValue ? oldValue.integer + " " + oldValue.numerator + "/" + oldValue.denominator : oldValue.integer
                    break;
                default: oldValue;
            }
            return oldValue;
        },
        _dateToInt: function (date) {
            var date1 = new Date("01/01/1900"), date2 = this._isDateTime(date) ? date : new Date(date),
            timeDiff = (date2.getTime() - date1.getTime()),
            diffDays = (timeDiff / (1000 * 3600 * 24)) + 2;
            return diffDays;
        },
        _insertTotalHeader: function (axisItems, headerList) {
            if (axisItems.length <= 1) {
                headerList.push({ cellType: "RGTot", keys: ["Grand Total"], tot: "sub" });
                return;
            }
            var level = -1;
            for (var lC = axisItems.length - 2; lC >= 0; lC--) {
                level++;
                var pivotCount = headerList.length;
                if (pivotCount > 0) {
                    var prevVal = headerList[0].uniqueName.split('.'), prevTxt = headerList[0].keys[level];
                    prevVal = prevVal.slice(0, lC + 1).join('.');
                    var newVal = "", prevCnt = 0, newTxt = "";
                    for (var hCnt = 1; hCnt <= pivotCount; hCnt++) {
                        if (headerList[hCnt] != undefined) {

                            newVal = headerList[hCnt].uniqueName.split('.');
                            newVal = newVal.slice(0, lC + 1).join('.');
                            newTxt = headerList[hCnt].keys[lC + 1];
                        }
                        else {
                            newVal = undefined;
                        }
                        if (newVal != undefined && newVal.indexOf("Total") == -1) {
                            if (prevVal != undefined && ((newVal != prevVal))) {
                                headerList.splice(hCnt, 0, { keys: [prevVal.split('.')[lC] + " Total"], cellType: "SubTot", uniqueName: prevVal, level: lC });
                                if (headerList[prevCnt]['span'] == undefined)

                                    headerList[prevCnt]['span'] = [];
                                headerList[prevCnt]['span'][lC] = hCnt - prevCnt;

                                hCnt++; pivotCount++; prevVal = newVal; prevCnt = hCnt; prevTxt = newTxt;
                            }

                        }
                        else if (prevVal != undefined) {
                            headerList.splice(hCnt, 0, { keys: [prevVal.split('.')[lC] + " Total"], cellType: "SubTot:", uniqueName: prevVal, level: lC });
                            if (headerList[prevCnt]['span'] == undefined)

                                headerList[prevCnt]['span'] = [];
                            headerList[prevCnt]['span'][lC] = hCnt - prevCnt;
                            hCnt++; pivotCount++; prevVal = newVal; prevCnt = hCnt; prevTxt = newTxt;
                        }
                    }
                }
            }
            headerList.push({ cellType: "RGTot", keys: ["Grand Total"] });
        },

        _isPreviousLevelEqual: function (headerList, hCnt, prevCnt, level) {
            for (var prev = level - 1; prev >= 0; prev--) {
                if (headerList[hCnt].keys[prev] != headerList[prevCnt].keys[prev])
                    return true;
                else
                    return false;
            }
        },

        _calculateValues: function (dataSource) {
            var rowCount = rowKeysCalcValues.length + (dataSource.values.length > 0 ? 1 : 0);
            var colCount = colKeysCalcValues.length == 0 ? 1 : (colKeysCalcValues.length * (dataSource.values.length == 0 ? 1 : dataSource.values.length)) + 1;
            gridMatrix = new Array(rowCount + dataSource.rows.length + 1);
            this._populateRowHeaders(dataSource, rowCount + dataSource.rows.length + 1, (dataSource.rows.length == 0 ? 1 : dataSource.rows.length));
            var colHdRowCnt = dataSource.columns.length + 1, colHdColCnt = colCount + (dataSource.rows.length == 0 ? 1 : dataSource.rows.length);
            this._populateColumnHeaders(dataSource, colHdRowCnt, colHdColCnt);
            if (dataSource.values.length > 0)
                this._populateCalcTable(dataSource);
            tRowCnt = rowCount + colHdRowCnt, tColCnt = colHdColCnt;
        },

        _populateRowHeaders: function (dataSource, rowCnt, columnCount) {
            if (rowKeysCalcValues.length == 0)
                return;
            var rowIndex;
            if (colKeysCalcValues.length == 1 && colKeysCalcValues[0].cellType == "RGTot")
                rowIndex = 1 + (dataSource.values.length > 0 ? 1 : 0);
            else
                rowIndex = dataSource.columns.length + (dataSource.values.length > 0 ? 1 : 0);
            gridMatrix = [];
            var previousValue = "";
            for (var cnt = 0; cnt < rowKeysCalcValues.length; cnt++) {
                previousValue = rowKeysCalcValues[cnt];
                {
                    var colIndex = 0, tempCIndx = 0, tempCSpan = 0, rowKLen = 0;
                    if (rowKeysCalcValues[cnt].keys != undefined && rowKeysCalcValues[cnt].keys.length != 0) {
                        gridMatrix[rowIndex] = new Array(columnCount);
                        rowKLen = rowKeysCalcValues[cnt].keys.length;
                        for (kCnt = 0; kCnt < rowKLen; kCnt++) {
                            if (rowKeysCalcValues[cnt].cellType != undefined) {
                                if (rowKeysCalcValues[cnt].cellType.indexOf("SubTot") > -1) {
                                    tempCIndx = rowKeysCalcValues[cnt].level + colIndex;
                                    tempCSpan = columnCount - rowKeysCalcValues[cnt].level;
                                    cellType = "summary rstot";
                                }
                                else {
                                    cellType = "summary rgtot";
                                    tempCIndx = colIndex; tempCSpan = dataSource.rows.length;
                                }
                            }
                            else {
                                cellType = "rowheader";
                                tempCIndx = colIndex;
                                tempCSpan = 1;
                            }
                            var expand = rowKLen > 1 ? rowKLen - kCnt > 1 ? 1 : 0 : 0;
                            gridMatrix[rowIndex][tempCIndx] = {
                                Index: tempCIndx + ',' + rowIndex, CSS: cellType, Value: rowKeysCalcValues[cnt].keys[kCnt], State: expand,
                                RowSpan: (rowKeysCalcValues[cnt].span != undefined ? rowKeysCalcValues[cnt].span[kCnt] : 1),
                                ColSpan: tempCSpan, Info: "", Span: "None", Expander: expand
                            };
                            colIndex++;
                        }
                    }
                    rowIndex++;
                }
            }
            cellType = "";
        },

        _populateColumnHeaders: function (dataSource, colHdRowCnt, colHdColCnt) {
            if (colKeysCalcValues.length == 0)
                return;
            var colIndex = tempCnt = (dataSource.rows.length == 0 ? 1 : dataSource.rows.length), loopCnt = dataSource.values.length == 0 ? 1 : dataSource.values.length, prevVal = "", rowIndex = colKLen = 0;
            var lastRow = (colKeysCalcValues.length == 1 && colKeysCalcValues[0].cellType == "RGTot") ? 1 : dataSource.columns.length;
            for (var cnt = 0; cnt < colKeysCalcValues.length; cnt++) {
                rowIndex = 0, tempRIndx = 0, tempRSpan = 0, tempCSpan = 0;
                prevVal = colKeysCalcValues[cnt].keys;
                if (gridMatrix[rowIndex] == undefined)
                    gridMatrix[rowIndex] = new Array();
                colKLen = colKeysCalcValues[cnt].keys.length;
                for (kCnt = 0; kCnt < colKLen; kCnt++) {
                    if (gridMatrix[rowIndex] == undefined)
                        gridMatrix[rowIndex] = new Array();

                    if (colKeysCalcValues[cnt].cellType != undefined) {
                        if (colKeysCalcValues[cnt].cellType.indexOf("SubTot") > -1) {
                            tempRIndx = colKeysCalcValues[cnt].level + rowIndex;
                            tempRSpan = colHdRowCnt - colKeysCalcValues[cnt].level - 1;
                            cellType = "summary cstot";
                        }
                        else {
                            tempRIndx = rowIndex;
                            tempRSpan = (colKeysCalcValues.length == 1 && colKeysCalcValues[0].cellType == "RGTot") ? 1 : dataSource.columns.length;
                            cellType = "summary cgtot";
                        }
                    }
                    else {
                        tempRIndx = rowIndex;
                        tempRSpan = 1;
                        cellType = "colheader";
                    }
                    var expand = colKLen > 1 ? colKLen - kCnt > 1 ? 1 : 0 : 0;
                    for (var cCnt = 0; cCnt < loopCnt; cCnt++) {
                        gridMatrix[tempRIndx][(loopCnt * cnt) + cCnt + tempCnt] = {
                            Index: colIndex + ',' + tempRIndx, CSS: cellType, Value: colKeysCalcValues[cnt].keys[kCnt], State: expand,
                            ColSpan: (colKeysCalcValues[cnt].span != undefined ? colKeysCalcValues[cnt].span[kCnt] == undefined ? 1 : colKeysCalcValues[cnt].span[kCnt] : 1) * loopCnt,
                            RowSpan: tempRSpan, Info: "", Span: "None", Expander: expand
                        };
                    }

                    rowIndex++;

                }
                if (dataSource.values.length > 0) {
                    for (var cCnt = 0; cCnt < loopCnt; cCnt++) {
                        if (gridMatrix[rowIndex] == undefined)
                            gridMatrix[rowIndex] = new Array();

                        gridMatrix[lastRow][(loopCnt * cnt) + cCnt + tempCnt] = {
                            Index: ((loopCnt * cnt) + cCnt + tempCnt) + ',' + rowIndex, CSS: cellType + " calc", Value: dataSource.values[cCnt].fieldName, State: 0,
                            ColSpan: 1,
                            RowSpan: 1, Info: "", Span: "None", Expander: 0
                        };
                    }
                }
                colIndex++;
            }
            cellType = "";
        },

        _populateCalcTable: function (dataSource) {
            var calValue = [], calCnt = dataSource.values.length;
            var colIndex = (dataSource.rows.length == 0 ? 1 : dataSource.rows.length), sTot = 0, isUniqe = false, totRIndx = 0;
            var rowIndex = (colKeysCalcValues.length == 1 && colKeysCalcValues[0].cellType == "RGTot") ? 2 : (dataSource.columns.length + 1);
            var rwIndx = rowIndex, clIndx, totFlagR = false, totCIndx = 0, totFlagC = false;
            for (var rCnt = 0; rCnt < rowKeysCalcValues.length; rCnt++) {
                colTotCalc = []; clIndx = colIndex;
                isUniqe = true;
                if (gridMatrix[rCnt + rowIndex] == undefined)
                    gridMatrix[rCnt + rowIndex] = new Array();
                rowTotCalc[totRIndx] = new Array();

                for (cCnt = 0; cCnt < colKeysCalcValues.length; cCnt++) {
                    calValue = [];
                    cellType = "value";
                    if (dataSource.columns.length > 0 && dataSource.rows.length > 0)
                        $.grep(tableKeysCalcValues, function (item) {
                            if (item.uniqueName == rowKeysCalcValues[rCnt].uniqueName + "." + colKeysCalcValues[cCnt].uniqueName)
                                for (ky = 0 ; ky < item.value.keys.length; ky++)
                                    calValue.push(item.value.keys[ky]);
                            return;
                        });
                    else if (dataSource.rows.length == 0)
                        $.grep(tableKeysCalcValues, function (item) {
                            if (item.uniqueName == colKeysCalcValues[cCnt].uniqueName)
                                for (ky = 0 ; ky < item.value.keys.length; ky++)
                                    calValue.push(item.value.keys[ky]);
                            return;
                        });
                    else
                        $.grep(tableKeysCalcValues, function (item) {
                            if (item.uniqueName == rowKeysCalcValues[rCnt].uniqueName)
                                for (ky = 0 ; ky < item.value.keys.length; ky++)
                                    calValue.push(item.value.keys[ky]);
                            return;
                        });
                    if (colKeysCalcValues[cCnt].cellType != undefined && (colKeysCalcValues[cCnt].cellType.indexOf("SubTot") > -1 || colKeysCalcValues[cCnt].cellType.indexOf("RGTot") > -1)) {
                        calValue = [];
                        for (var ky = 0; ky < calCnt; ky++) {
                            var count = 0, cCount = 0;
                            for (var tCnt = clIndx ; tCnt <= ((cCnt * calCnt) + colIndex) ; tCnt++) {
                                if (gridMatrix[rCnt + rowIndex] != undefined && gridMatrix[rCnt + rowIndex][clIndx + (count * calCnt) + ky] != undefined && gridMatrix[rCnt + rowIndex][clIndx + (count * calCnt) + ky].Value != undefined) {
                                    if (calValue[ky] == undefined)
                                        calValue[ky] = 0;
                                    cCount++;

                                    if (dataSource.values[ky].isCalculatedField)
                                        calValue[ky] = this._calculatedFieldSummaryValue(ky, calValue, dataSource);
                                    else
                                        calValue[ky] = this._getSummaryValue(calValue[ky], gridMatrix[rCnt + rowIndex][clIndx + (count * calCnt) + ky].Value, cCount, summaryTypes[ky] == "count" ? "sum" : summaryTypes[ky], dataSource.values[ky].format, dataSource.values[ky].formatString);
                                }
                                count++;
                            }

                        }
                        sTot = 0;
                        clIndx = ((cCnt + 1) * calCnt) + colIndex;
                        if (calValue != 0) {
                            colTotCalc.push({ uniqueName: colKeysCalcValues[cCnt].uniqueName, level: colKeysCalcValues[cCnt].level, value: calValue });
                        }
                        if (colKeysCalcValues[cCnt - 1] != undefined && colKeysCalcValues[cCnt - 1].cellType != undefined && colKeysCalcValues[cCnt - 1].cellType.indexOf("SubTot") > -1 && colKeysCalcValues[cCnt - 1].cellType.indexOf("RGTot") == -1) {
                            var tempVal = $(colTotCalc).filter(function (index, x) {
                                return x != undefined && x.uniqueName != undefined && colKeysCalcValues[cCnt].uniqueName != undefined && x.level != undefined && colKeysCalcValues[cCnt].level != undefined && x.uniqueName.indexOf(colKeysCalcValues[cCnt].uniqueName) === 0 && colKeysCalcValues[cCnt].level + 1 == x.level;

                            }).map(function (ind,val) {
                                for (var ky = 0; ky < val.value.length; ky++) {
                                    if (calValue[ky] == undefined)
                                        calValue[ky] = 0;
                                    if (dataSource.values[ky].isCalculatedField)
                                        calValue[ky] = ej.PivotAnalysis._calculatedFieldSummaryValue(ky, calValue, dataSource);
                                    else
                                    	calValue[ky] += val.value[ky];
                                }
                                return calValue;
                            });

                            if (calValue != 0) {
                                colTotCalc.push({ uniqueName: colKeysCalcValues[cCnt].uniqueName, level: colKeysCalcValues[cCnt].level, value: calValue });

                            }
                        }
                        cellType = "summary value";
                    }
                    if (colKeysCalcValues[cCnt].cellType != undefined && colKeysCalcValues[cCnt].cellType.indexOf("RGTot") > -1 && calValue == 0) {
                        calValue = [];
                        var cCount = 0;
                        var tempVal = $(colTotCalc).filter(function (index, x) {
                            return x != undefined && x != undefined && x.level != undefined && x.level == 0;
                        }).map(function (ind, val) {

                            for (var ky = 0; ky < val.value.length; ky++) {
                                if (calValue[ky] == undefined)
                                    calValue[ky] = 0;
                                cCount++;
                                if (dataSource.values[ky].isCalculatedField)
                                    calValue[ky] = ej.PivotAnalysis._calculatedFieldSummaryValue(ky, calValue, dataSource);
                                else
                                    calValue[ky] = ej.PivotAnalysis._getSummaryValue(calValue[ky], val.value[ky], cCount, summaryTypes[ky] == "count" ? "sum" : summaryTypes[ky], dataSource.values[ky].format, dataSource.values[ky].formatString);
                            }
                            return calValue;
                        });
                        cellType = "summary value";
                    }
                    if (rowKeysCalcValues[rCnt].cellType != undefined && (rowKeysCalcValues[rCnt].cellType.indexOf("SubTot") > -1 || rowKeysCalcValues[rCnt].cellType.indexOf("RGTot") > -1)) {
                        calValue = [];
                        var memberName = rowKeysCalcValues[rCnt].uniqueName;
                        if (rowKeysCalcValues[rCnt - 1] != undefined && rowKeysCalcValues[rCnt - 1].cellType != undefined && rowKeysCalcValues[rCnt - 1].cellType.indexOf("SubTot") > -1 && rowKeysCalcValues[rCnt].cellType.indexOf("RGTot") == -1) {
                            var cCount = 0;
                            var tempVal = $(rowTotCalc).filter(function (index, x) {
                                return x[0] != undefined && x[0].uniqueName != undefined && rowKeysCalcValues[rCnt].uniqueName != undefined && x[0].level != undefined && rowKeysCalcValues[rCnt].level != undefined && x[0].uniqueName.indexOf(rowKeysCalcValues[rCnt].uniqueName) === 0 && rowKeysCalcValues[rCnt].level + 1 == x[0].level;
                            }).map(function (ind, val) {
                                if (val[colIndex + cCnt].length > 0) {
                                    cCount++;
                                    for (var ky = 0; ky < val[colIndex + cCnt].length; ky++) {
                                        if (calValue[ky] == undefined)
                                            calValue[ky] = 0;
                                        if (dataSource.values[ky].isCalculatedField)
                                            calValue[ky] = ej.PivotAnalysis._calculatedFieldSummaryValue(ky, calValue, dataSource);
                                        else
                                            calValue[ky] = ej.PivotAnalysis._getSummaryValue(calValue[ky], val[colIndex + cCnt][ky], cCount, summaryTypes[ky] == "count" ? "sum" : summaryTypes[ky], dataSource.values[ky].format);
                                    }
                                }
                                return calValue;
                            });
                        }
                        if (rowKeysCalcValues[rCnt].cellType != undefined && rowKeysCalcValues[rCnt].cellType.indexOf("RGTot") > -1) {
                            var cCount = 0;
                            var tempVal = $(rowTotCalc).filter(function (index, x) {
                                return x != undefined && x[0] != undefined && x[0].level != undefined && x[0].level == 0;
                            }).map(function (ind, val) {
                                if (val[colIndex + cCnt].length > 0) {
                                    cCount++;
                                    for (var ky = 0; ky < val[colIndex + cCnt].length; ky++) {
                                        if (calValue[ky] == undefined)
                                            calValue[ky] = 0;
                                        if (dataSource.values[ky].isCalculatedField)
                                            calValue[ky] = ej.PivotAnalysis._calculatedFieldSummaryValue(ky, calValue, dataSource);
                                        else
                                            calValue[ky] = ej.PivotAnalysis._getSummaryValue(calValue[ky], val[colIndex + cCnt][ky], cCount, summaryTypes[ky] == "count" ? "sum" : summaryTypes[ky], dataSource.values[ky].format, dataSource.values[ky].formatString);
                                    }
                                }
                                return calValue;
                            });
                        }
                        var cCount = 1;
                        for (var tCnt = rwIndx ; tCnt <= (rCnt + rowIndex) ; tCnt++) {
                            var isAvailable = false;
                            for (var ky = 0; ky < calCnt; ky++) {
                                var count = 0;
                                if (gridMatrix[tCnt] != undefined && gridMatrix[tCnt][colIndex + (cCnt * calCnt) + ky] != undefined && gridMatrix[tCnt][colIndex + (cCnt * calCnt) + ky].Value != undefined) {
                                    if (calValue[ky] == undefined)
                                        calValue[ky] = 0;
                                    isAvailable = true;
                                    if (dataSource.values[ky].isCalculatedField)
                                        calValue[ky] = this._calculatedFieldSummaryValue(ky, calValue, dataSource);
                                    else
                                        calValue[ky] = this._getSummaryValue(calValue[ky], gridMatrix[tCnt][colIndex + (cCnt * calCnt) + ky].Value, cCount, summaryTypes[ky] == "count" ? "sum" : summaryTypes[ky], dataSource.values[ky].format, dataSource.values[ky].formatString);
                                }
                                count++;
                            }
                            if (isAvailable) cCount++;
                        }

                        sTot = 0;
                        totFlagR = true;
                        if (isUniqe) {
                            rowTotCalc[totRIndx][0] = { uniqueName: rowKeysCalcValues[rCnt].uniqueName, level: rowKeysCalcValues[rCnt].level };
                            isUniqe = false;
                        }
                        rowTotCalc[totRIndx][colIndex + cCnt] = calValue;

                        cellType = "summary value";
                    }

                    for (var val = 0; val < calCnt; val++) {
                        if (calValue != undefined && calValue.length != undefined) {
                            gridMatrix[rowIndex + rCnt][(calCnt * cCnt) + val + colIndex] = {
                                Index: ((calCnt * cCnt) + val + colIndex) + ',' + rowIndex + rCnt, CSS: cellType, Value: calValue[val], State: 0,
                                ColSpan: 1,
                                RowSpan: 1, Info: "", Span: "None", Expander: 0
                            };
                        }
                        else
                            gridMatrix[rowIndex + rCnt][(calCnt * cCnt) + val + colIndex] = 0;
                    }
                }
                if (totFlagR) {
                    totRIndx++;
                    rwIndx = rCnt + rowIndex + 1; totFlagR = false;
                }
            }
            for (var rCnt = 0; rCnt < rowKeysCalcValues.length; rCnt++) {
                for (cCnt = 0; cCnt < colKeysCalcValues.length; cCnt++) {
                    for (var val = 0; val < calCnt; val++) {
                        if (dataSource.values[val].isCalculatedField && gridMatrix[rowIndex + rCnt][(calCnt * cCnt) + val + colIndex].Value == null) {
                            gridMatrix[rowIndex + rCnt][(calCnt * cCnt) + val + colIndex].Value= this._calculatedFieldSummaryValue(val, [], dataSource);
                        }
                    }
                }
            }


            return gridMatrix;
        }
    }

    ej.PivotAnalysis.SortOrder = {
        Ascending: "ascending",
        Descending: "descending",
    };

    ej.PivotAnalysis.FilterType = {
        Exclude: "exclude",
        Include: "include"
    };

    ej.PivotAnalysis.SummaryType = {
        Sum: "sum",
        Average: "average",
        Count: "count",
        Min: "min",
        Max: "max"
    };

})(jQuery, Syncfusion);;

});