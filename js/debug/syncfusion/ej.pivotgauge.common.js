/*!
*  filename: ej.pivotgauge.common.js
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
	


ej.pivotgauge = ej.pivotgauge || {};
(function ($, ej, undefined) {
    ej.pivotgauge.common = {
        getJSONData: function (args, dataSource) {
            ej.olap.base.getJSONData({action:args.action}, dataSource, args.activeObject);
        },
        generateJSON: function (args, pivotEngine) {
            var rCnt, cCnt;
            
            this.baseObj = args.baseObj, this.pivotEngine = pivotEngine, this.kpiInfo = [], pivotRecords = "";

            if (this.baseObj._measureDt && this.baseObj._measureDt.isKpiExist) {
                var kpiAxis = this.baseObj._measureDt.axis;
                if (pivotEngine) {
                    if (kpiAxis == "colheader") {
                        rCnt = pivotEngine.length;
                        cCnt = rCnt ? pivotEngine[0].length : 0;
                    }
                    else {
                        cCnt = pivotEngine.length;
                        rCnt = cCnt ? pivotEngine[0].length : 0;
                    }
                }
                this._getKpiHeadersCollection(rCnt, cCnt, kpiAxis);
            }
            else {
                this._getSummaryInfo();
            }
            pivotRecords = JSON.stringify(this.kpiInfo);

            this._renderControlSuccess({ PivotRecords: pivotRecords, OlapReport: "null" });
            return this.kpiInfo;
        },
        _getKpiHeadersCollection: function (rCnt, cCnt, kpiAxis) {
            var engine = this.pivotEngine, tempKpi = new Object(), rlen1, clen1, rlen2, clen2, css1, css2;
            if (kpiAxis == "rowheader") {
                rlen1 = rCnt; clen1 = cCnt;
                rlen2 = cCnt; clen2 = rCnt;
                css1 = "rowheader", css2 = "colheader";
            }
            else if (kpiAxis == "colheader") {
                rlen1 = cCnt; clen1 = rCnt;
                css2 = "rowheader", css1 = "colheader";
                rlen2 = rCnt; clen2 = cCnt;
            }
            for (var rw = 0; rw < clen1; rw++) {
                for (var cl = 0; cl < rlen1; cl++) {
                    var cellDesc = null;
                    if (kpiAxis == "rowheader")
                        cellDesc = this.pivotEngine[cl][rw];
                    else
                        cellDesc = this.pivotEngine[rw][cl];
                        if (cellDesc.CSS == css1)
                            tempKpi = this._fillKpiInfo_kpiAxis(cellDesc, css1, rw, tempKpi)
                        else
                            break;
                   
                }
                var index = 0;
                if (index = this._isKpiExist(tempKpi))
                    this._copyKpi(parseInt(index), tempKpi);
                else if (!$.isEmptyObject(tempKpi))
                    this.kpiInfo.push(tempKpi);
                tempKpi = {};
            }
            var adjTempKpi = {}, kpiAxisHds = this.kpiInfo, preCell;
            this.kpiInfo = [];
            for (var rw = 0; rw < clen2; rw++) {
                for (var cl = 0; cl < rlen2; cl++) {
                    var cellDesc = null;
                    if (kpiAxis == "rowheader") {
                        cellDesc = this.pivotEngine[rw][cl];
                        if (this.pivotEngine[cl][rw - 1])
                            preCell = this.pivotEngine[cl][rw - 1];
                    }
                    else {
                        cellDesc = this.pivotEngine[cl][rw];
                        if (this.pivotEngine[cl - 1])
                            preCell = this.pivotEngine[cl - 1][rw];
                    }
                    if (cellDesc && cellDesc.CSS == css2 && cellDesc.Value != "") {
                        adjTempKpi = this._fillKpiInfo_kpiAxis(cellDesc, css2, rw, tempKpi)
                    }
                    else {
                        break;
                    }
                }
                var index = 0;
                if (preCell && preCell.CSS == css2 && cellDesc.CSS.indexOf("summary") == -1)
                    this._mergeValues(adjTempKpi,kpiAxisHds, kpiAxis, rw, cl);
                adjTempKpi = {};
            }

            //var tempKpi = this._fillKpiInfo_kpiAxis(cellDesc, "rowheader", rw, tempKpi)
            
        },
        _mergeValues: function (adjTempKpi,kpiAxisHds, kpiAxis, col, row) {
            var rCalc, cCalc,
            kpiEl = {
            };
            var kpiLen = kpiAxisHds.length, kpiInfo = {};
            for(var klt = 0 ; klt < kpiLen; klt++)
            {
                kpiInfo = kpiAxisHds[klt];
                if (adjTempKpi.MemberRowIndex)
                    kpiInfo.MemberRowIndex = adjTempKpi.MemberRowIndex;
                else if (adjTempKpi.MemberColIndex)
                    kpiInfo.MemberColIndex = adjTempKpi.MemberColIndex;
                if (!kpiInfo.MemberName)
                    kpiInfo.MemberName = adjTempKpi.MemberName;
                else if (adjTempKpi.MemberName)
                    kpiInfo.MemberName += "-" + adjTempKpi.MemberName;
                if (kpiAxis == "rowheader")
                {
                    if (kpiInfo.ValueIndex > 0) {
                        kpiInfo.MeasureValue = this.pivotEngine[row][kpiInfo.ValueIndex].ActualValue;
                        kpiInfo.ActualMeasureValue = this.pivotEngine[row][kpiInfo.ValueIndex].Value;
                    }
                    if (kpiInfo.TrendIndex > 0) {
                        kpiInfo.TrendValue = this.pivotEngine[row][kpiInfo.TrendIndex].Value;
                     //   kpiInfo.TrendGraphic = this.pivotEngine[row][kpiInfo.TrendIndex].kpiInfo.Graphic;
                    }
                    if (kpiInfo.StatusIndex > 0) {
                        kpiInfo.StatusValue = this.pivotEngine[row][kpiInfo.StatusIndex].Value;
                     //   kpiInfo.StatusGraphic = this.pivotEngine[row][kpiInfo.StatusIndex].kpiInfo.Graphic;
                    }
                    if (kpiInfo.GoalIndex > 0) {
                      //  kpiInfo.GoalValue = this.pivotEngine[row][kpiInfo.GoalIndex].Value;
                    }
                }
                else if (kpiAxis == "colheader")
                {
                    if(kpiInfo.ValueIndex > 0)
                    {
                        kpiInfo.MeasureValue = this.pivotEngine[kpiInfo.ValueIndex][col].ActualValue;
                        kpiInfo.ActualMeasureValue = this.pivotEngine[kpiInfo.ValueIndex][col].Value;
                    }
                    if(kpiInfo.TrendIndex > 0){
                        kpiInfo.TrendValue = this.pivotEngine[kpiInfo.TrendIndex][col].Value;
                     //   kpiInfo.TrendGraphic = this.pivotEngine[kpiInfo.TrendIndex][col].kpiInfo.Graphic;
                    }
                    if(kpiInfo.StatusIndex > 0)
                    {
                        kpiInfo.StatusValue = this.pivotEngine[kpiInfo.StatusIndex][col].Value;
                      //  kpiInfo.StatusGraphic = this.pivotEngine[kpiInfo.StatusIndex][col].kpiInfo.Graphic;
                    }
                    if(kpiInfo.GoalIndex > 0)
                    {
                        kpiInfo.GoalValue = this.pivotEngine[kpiInfo.GoalIndex][col].Value;
                        kpiInfo.ActualGoalValue = this.pivotEngine[kpiInfo.GoalIndex][col].ActualValue;
                    }
                }
                kpiInfo.IsValidKpi = true;
                kpiEl = {
                    ActualMeasureValue: 0,
                    GoalCaption: "",
                    Kpi_Name: "",
                    MeasureCaption: "",
                    GoalValue: "",
                    ActualGoalValue: 0,
                    MeasureValue: "",
                    MemberName: "",
                    StatusValue: -2,
                    TrendValue: -2,
                    TrendGraphic: null,
                    StatusGraphic: null,
                    ValueIndex: "",
                    TrendIndex: -1,
                    GoalIndex: "",
                    StatusIndex: -1,
                    MemberRowIndex: null,
                    MemberColIndex: null,
                    IsValidKpi: true
                };
                this.kpiInfo.push($.extend(kpiEl,kpiInfo));
            }
        },
        _isKpiExist: function (tempKpi) {
            for(var len =0; len < this.kpiInfo.length; len++)
            {
                if (this.kpiInfo[len].MemberName == tempKpi.MemberName && this.kpiInfo[len].Kpi_Name == tempKpi.Kpi_Name) {
                    return len + "";
                }
            }
            return false;
        },
        _copyKpi: function (index, tempKpi) {
            this.kpiInfo[index] = $.extend(this.kpiInfo[index], tempKpi);
        },

        _fillKpiInfo_kpiAxis: function (cellDesc, axis, index, kpiInfo) {
            //var kpiInfo = new Object();
            
            var uNam = cellDesc.Info.split("::")[0];
            if (!cellDesc.kpiInfo && cellDesc.CSS == axis && uNam.indexOf("[Measures]") > -1 && !cellDesc.kpiInfo) {
                kpiInfo.Kpi_Name = this._getKpiName(uNam);
                kpiInfo.MeasureCaption = cellDesc.Value;
                kpiInfo.ValueIndex = index;
            }
            else if(cellDesc.CSS == axis)
            {
                if(cellDesc.kpiInfo)
                {
                    kpiInfo.Kpi_Name = cellDesc.kpiInfo.Value;
                }
                else
                {
                    if (!kpiInfo.MemberName && cellDesc.Value)
                        kpiInfo.MemberName = cellDesc.Value;
                    else if (cellDesc.Value)
                        kpiInfo.MemberName += " - " + cellDesc.Value;
                    if (axis == "colheader")
                        kpiInfo.MemberColIndex = index;
                    else
                        kpiInfo.MemberRowIndex = index;
                    
                }
                var kpiType = cellDesc.kpi? cellDesc.kpi : "none";
                switch(kpiType)
                {
                    case "status":
                        {
                            kpiInfo.StatusGraphic = cellDesc.kpiInfo.Graphic;
                            kpiInfo.StatusIndex = index;
                            break;
                        }
                    case "goal":
                        {
                            kpiInfo.GoalCaption = cellDesc.Value;
                            kpiInfo.GoalIndex = index;
                            break;
                        }
                    case "trend":
                        {
                            kpiInfo.TrendGraphic = cellDesc.kpiInfo.Graphic;
                            kpiInfo.TrendIndex = index;
                            break;
                        }

                }
            }
            return kpiInfo;
        },
        _getSummaryInfo: function () {

            var elInfo ={},baseObj = this, summaryCol = $.map(this.pivotEngine, function (colEl, index) {
                var getMesure = false;
                elInfo.Measure = "";
                elInfo.Value = "";
                elInfo.DoubleValue = 0;
                if (!(ej.browserInfo().name == "msie" && ej.browserInfo().version <= 8)) {
                    for (var el in colEl) {
                        if (colEl[parseInt(el)].CSS.indexOf("summary col") > -1 || colEl[parseInt(el)].CSS.indexOf("summary cgtot calc") > -1)
                            getMesure = true;
                        if (getMesure && colEl[parseInt(el)].Info.indexOf("[Measures]") > -1 || colEl[parseInt(el)].CSS.indexOf("summary cgtot calc") > -1)
                            elInfo.Measure = colEl[parseInt(el)].Value;
                    }
                    if (getMesure && !(baseObj._dataModel == "Pivot")) {
                        elInfo.Value = colEl[parseInt(el)].ActualValue;
                        elInfo.DoubleValue = parseFloat(colEl[parseInt(el)].ActualValue);
                        return $.extend({}, elInfo);
                    }
                    else if (getMesure && baseObj._dataModel == "Pivot") {
                        elInfo.Value = colEl[parseInt(el)].Value.toString();
                        elInfo.DoubleValue = colEl[parseInt(el)].Value;
                        return $.extend({}, elInfo);
                    }
                }
                else {
                    for (var len = 0; len < colEl.length; len++) {
                        if ((colEl[len].CSS.indexOf("summary col") > -1 || colEl[len].CSS.indexOf("summary cgtot calc") > -1))
                            getMesure = true;
                        //len++;
                        if (getMesure && colEl[len].Info.indexOf("[Measures]") > -1 || colEl[len].CSS.indexOf("summary cgtot calc") > -1)
                            elInfo.Measure = colEl[len].Value;
                    }
                    if (getMesure && !(baseObj._dataModel == "Pivot")) {
                        elInfo.Value = colEl[len - 1].ActualValue;
                        elInfo.DoubleValue = parseFloat(colEl[len - 1].ActualValue);
                        return $.extend({}, elInfo);
                    }
                    else if (getMesure && baseObj._dataModel == "Pivot") {
                        elInfo.Value = colEl[len - 1].Value.toString();
                        elInfo.DoubleValue = colEl[len - 1].Value;
                        return $.extend({}, elInfo);
                    }
                }

            });
            for (var len = 0; len < summaryCol.length; len++) {
                var kpiEl = {
                    Caption: null,
                    Object: null,
                    CellIndex: -1,
                    Type: -1,
                    Measure: "",
                    ClassName: "",
                    DoubleValue: 0,
                    ExpandState: 0,
                    HasChildren: false,
                    Level: -1,
                    RowIndex: 3,
                    Range: null,
                    Span: null,
                    Tag: null,
                    UniqueName: "",
                    Value: ""
                };
                this.kpiInfo.push($.extend(kpiEl, summaryCol[len]));
            }
        },
        _getKpiName: function (uName) {
            var kpiColl = this.baseObj._kpi, matchedEl = "";
            matchedEl = $(kpiColl).find("row:contains('" + uName + "')");
            if(matchedEl)
            {
                return $(matchedEl).find("KPI_NAME").text();
            }
            return "";
        }

    }
})(jQuery, Syncfusion);;

});