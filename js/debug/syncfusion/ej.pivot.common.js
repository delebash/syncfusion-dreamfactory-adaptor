/*!
*  filename: ej.pivot.common.js
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
	
ej.Pivot = ej.Pivot || {};

(function ($, ej, undefined) {

    ej.Pivot = {

        //Report Manipulations
        addReportItem: function (dataSource, args) {
            if (!args.isMeasuresDropped) {
                var reportItem = this.removeReportItem(dataSource, args.droppedFieldName, args.isMeasuresDropped);
                if (ej.isNullOrUndefined(reportItem)) reportItem = { fieldName: args.droppedFieldName, fieldCaption: args.droppedFieldCaption };
                switch (args.droppedClass) {
                    case "row":
                        args.droppedPosition.toString() != "" ? dataSource.rows.splice(args.droppedPosition, 0, reportItem) : dataSource.rows.push(reportItem);
                        break;
                    case "column":
                        args.droppedPosition.toString() != "" ? dataSource.columns.splice(args.droppedPosition, 0, reportItem) : dataSource.columns.push(reportItem);
                        break;
                    case "value":
                        if (dataSource.cube == "")
                            args.droppedPosition.toString() != "" ? dataSource.values.splice(args.droppedPosition, 0, reportItem) : dataSource.values.push(reportItem);
                        else
                            args.droppedPosition.toString() != "" ? dataSource.values[0].measures.splice(args.droppedPosition, 0, reportItem) : dataSource.values[0].measures.push(reportItem);
                        break;
                    case "filter":
                        args.droppedPosition.toString() != "" ? dataSource.filters.splice(args.droppedPosition, 0, reportItem) : dataSource.filters.push(reportItem);
                        break;
                }
            }
            else {
                if (args.droppedClass != "")
                    dataSource.values[0].axis = args.droppedClass == "row" ? "rows" : args.droppedClass == "column" ? "columns" : dataSource.values[0].axis;
                else
                    dataSource.values[0].measures = [];
            }
        },

        removeReportItem: function (dataSource, droppedFieldName, isMeasuresDropped) {
            var analysisMode = dataSource.cube == "" ? ej.Pivot.AnalysisMode.Pivot : ej.Pivot.AnalysisMode.Olap;
            var reportItem = $.grep(dataSource.columns, function (value) { return value.fieldName == droppedFieldName; });
            if (!isMeasuresDropped) {
                if (reportItem.length > 0) dataSource.columns = $.grep(dataSource.columns, function (value) { return value.fieldName != droppedFieldName; });
                else {
                    reportItem = $.grep(dataSource.rows, function (value) { return value.fieldName == droppedFieldName; });
                    if (reportItem.length > 0) dataSource.rows = $.grep(dataSource.rows, function (value) { return value.fieldName != droppedFieldName; });
                    else {
                        var valueItems = (analysisMode == ej.Pivot.AnalysisMode.Olap ? dataSource.values[0]["measures"] : dataSource.values);
                        reportItem = $.grep(valueItems, function (value) { return value.fieldName == droppedFieldName; });
                        if (reportItem.length > 0)
                            dataSource.values = analysisMode == ej.Pivot.AnalysisMode.Olap ? [{ measures: $.grep(valueItems, function (value) { return value.fieldName != droppedFieldName; }), axis: dataSource.values[0].axis }] : $.grep(valueItems, function (value) { return value.fieldName != droppedFieldName; });
                        else {
                            reportItem = $.grep(dataSource.filters, function (value) { return value.fieldName == droppedFieldName; });
                            if (reportItem.length > 0) dataSource.filters = $.grep(dataSource.filters, function (value) { return value.fieldName != droppedFieldName; });
                        }
                    }
                }
            }
            else
                dataSource.values[0].measures = [];
            return reportItem[0];
        },

        getReportItemByFieldName: function (fieldName, dataSource) {
            var axis = "columns";
            var reportItem = $.grep(dataSource.columns, function (value) { return value.fieldName.toLowerCase() == fieldName.toLowerCase(); });
            if (reportItem.length == 0) {
                reportItem = $.grep(dataSource.rows, function (value) { return value.fieldName.toLowerCase() == fieldName.toLowerCase() });
                axis = "rows";
            }
            if (reportItem.length == 0) {
                var valuesItems = dataSource.cube == "" ? dataSource.values : (dataSource.values.length > 0 && !ej.isNullOrUndefined(dataSource.values[0].measures)) ? dataSource.values[0].measures : [];
                reportItem = $.grep(valuesItems, function (value) { return value.fieldName.toLowerCase() == fieldName.toLowerCase(); });
                axis = "values"
            }
            if (reportItem.length == 0) {
                reportItem = $.grep(dataSource.filters, function (value) { return (value.fieldName.toLowerCase() == fieldName.toLowerCase()); });
                axis = "filters"
            }
            return { item: reportItem[0], axis: axis };
        },

        getReportItemByFieldCaption: function (fieldCaption, dataSource) {
            var axis = "columns";
            var reportItem = $.grep(dataSource.columns, function (value) { return value.fieldCaption.toLowerCase() == fieldCaption.toLowerCase(); });
            if (reportItem.length == 0) {
                reportItem = $.grep(dataSource.rows, function (value) { return value.fieldCaption.toLowerCase() == fieldCaption.toLowerCase() });
                axis = "rows";
            }
            if (reportItem.length == 0) {
                var valuesItems = dataSource.cube == "" ? dataSource.values : (dataSource.values.length > 0 && !ej.isNullOrUndefined(dataSource.values[0].measures)) ? dataSource.values[0].measures : [];
                reportItem = $.grep(valuesItems, function (value) { return value.fieldCaption.toLowerCase() == fieldCaption.toLowerCase(); });
                axis = "values"
            }
            if (reportItem.length == 0) {
                reportItem = $.grep(dataSource.filters, function (value) { return (value.fieldCaption.toLowerCase() == fieldCaption.toLowerCase()); });
                axis = "filters"
            }
            return { item: reportItem[0], axis: axis };
        },

        //Common functionalities

        closePreventPanel: function (args) {
            var ctrlObj = args.type != 'close' ? args : this;
            ctrlObj.element.find("#preventDiv").remove();
			if((!ej.isNullOrUndefined(ctrlObj._rowHeader) && ctrlObj._rowHeader.length > 0) || (!ej.isNullOrUndefined(ctrlObj._colHeader) && ctrlObj._colHeader.length > 0)){
                ctrlObj._colHeader = []; ctrlObj._rowHeader = []; 
			}
            if (!ej.isNullOrUndefined(ctrlObj.model.pivotControl)) ctrlObj.model.pivotControl.element.find("#preventDiv").remove();
            if (!ej.isNullOrUndefined(ctrlObj._waitingPopup))
                ctrlObj._waitingPopup.hide();
            if (!ej.isNullOrUndefined(ctrlObj.model.pivotControl) && !ej.isNullOrUndefined(ctrlObj.model.pivotControl._waitingPopup))
                ctrlObj.model.pivotControl._waitingPopup.hide();
        },

        openPreventPanel: function(controlObj){
            var backgroundDiv = ej.buildTag("div#preventDiv.errorDlg").css({ "width": $('body').width() + "px", "height": $('body').height() + "px", "position": "absolute", "top": $('body').offset().top + "px", "left": $('body').offset().left + "px", "z-index": 10 })[0].outerHTML;
            $('#' + controlObj._id).append(backgroundDiv);
        },

        _createErrorDialog: function (args, action, obj) {
            ej.Pivot.closePreventPanel(obj);
            obj._errorDialog = action;
            ej.Pivot.openPreventPanel(obj);
            if (obj.element.find(".errorDialog:visible").length == 0) {
                if (!ej.isNullOrUndefined(args.Exception))
                    var dialogElem = ej.buildTag("div.errorDialog#ErrorDialog", ej.buildTag("div.warningImg")[0].outerHTML + ej.buildTag("div.warningContent action:", obj.model.enableRTL ? (args.Exception.Message + "--" + action) : (action + "--" + args.Exception.Message))[0].outerHTML + ej.buildTag("br")[0].outerHTML + ej.buildTag("div." + obj._id + "stackTraceContent", "Stack Trace :" + args.Exception.StackTraceString)[0].outerHTML + ej.buildTag("div", ej.buildTag("button#ErrOKBtn.errOKBtn", "OK", { "margin": "20px 0 10px 165px" })[0].outerHTML)[0].outerHTML).attr("title", "Warning")[0].outerHTML;
                else
                    var dialogElem = ej.buildTag("div.errorDialog#ErrorDialog", ej.buildTag("div.warningImg")[0].outerHTML + ej.buildTag("div.warningContent action:", obj.model.enableRTL ? (args + "--" + action) : (action + "--" + args))[0].outerHTML + ej.buildTag("div", ej.buildTag("button#ErrOKBtn.errOKBtn", "OK", { "margin": "20px 0 10px 165px" })[0].outerHTML)[0].outerHTML).attr("title", "Warning")[0].outerHTML;
                obj.element.append(dialogElem);
                obj.element.find(".errorDialog").ejDialog({ target: "#" + obj._id, enableResize: false, enableRTL: obj.model.enableRTL, width: "400px", close: ej.proxy(ej.Pivot.closePreventPanel, obj) });
                var _errorDialog = obj.element.find(".errorDialog").data("ejDialog");
                $("#" + _errorDialog._id + "_wrapper").css({ left: "50%", top: "50%" });
                obj.element.find(".errOKBtn").ejButton({ type: ej.ButtonType.Button, width: "50px" }).on(ej.eventType.click, function (e) {
                    if (obj._errorDialog == "nodeCheck" && !ej.isNullOrUndefined(obj._schemaData) && !ej.isNullOrUndefined(obj._schemaData._selectedTreeNode))
                        obj._schemaData._tableTreeObj.uncheckNode(obj._schemaData._selectedTreeNode);
                    obj.element.find("#preventDiv").remove();
                    if (obj._errorDialog == "Warning" || obj._errorDialog == "Exception" || obj._errorDialog == "Error")
                        obj.element.children("#ErrorDialog_wrapper").remove();
                });
                obj.element.find(".e-dialog .e-close").attr("title", "Close");
                if (!ej.isNullOrUndefined($("#" + obj._id).data("ejWaitingPopup"))) {
                    $("#" + obj._id).data("ejWaitingPopup").hide();
                }
                if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                    oclientWaitingPopup.hide();

                if (!ej.isNullOrUndefined(args.Exception)) {
                    var showChar = 50;
                    var ellipsestext = "...";
                    var moretext = "Show more";
                    var lesstext = "Show less";
                    $('.' + obj._id + 'stackTraceContent').each(function () {
                        var content = $(this).html();
                        if (content.length > showChar) {
                            obj._id
                            var c = content.substr(0, showChar);
                            var h = content.substr(showChar, content.length - showChar);
                            var html = c + ej.buildTag("span." + obj._id + "moreellipses", ellipsestext)[0].outerHTML + ej.buildTag("span." + obj._id + "morecontent", ej.buildTag("span", h).css("display", "none")[0].outerHTML + ej.buildTag("a." + obj._id + "morelink", moretext).css("display", "block")[0].outerHTML)[0].outerHTML;
                            $(this).html(html);
                        }
                    });
                    $("." + obj._id + "morelink").click(function () {
                        if ($(this).hasClass("less")) {
                            $(this).removeClass("less");
                            $(this).html(moretext);
                        } else {
                            $(this).addClass("less");
                            $(this).html(lesstext);
                        }
                        $(this).parent().prev().toggle("slow", function () { });
                        $(this).prev().toggle("slow", function () { });
                        return false;
                    });
                }
            }
        },  
        
        _contextMenuOpen: function (args, ctrlObj) {
            ej.Pivot.openPreventPanel(ctrlObj);
            ctrlObj._selectedMember = $(args.target);
            var mode;
            var menuObj;
            if(ctrlObj.pluginName == "ejPivotGrid"){
                mode = ctrlObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? "olap" : "pivot";
                menuObj = $("#pivotTree").data('ejMenu');
            }
            else {
                if (!ej.isNullOrUndefined(ctrlObj.model.pivotControl))
                mode = ctrlObj.model.pivotControl.model.analysisMode == ej.Pivot.AnalysisMode.Olap ? "olap" : "pivot";
                menuObj = $("#pivotTreeContextMenu").data('ejMenu');
            }
            if (mode == ej.Pivot.AnalysisMode.Olap) {
                if (ej.isNullOrUndefined($(args.target).parent().attr("tag"))) {
                    if ($(args.target).hasClass("pivotButton") && $(args.target).children(".pvtBtn:eq(0)").length>0) {
                        ctrlObj._selectedMember = $(args.target).children(".pvtBtn:eq(0)");
                        return false;
                    }
                }
                if ($(args.target).parent().attr("tag").split(":")[1].toLowerCase().startsWith("[measures]")) {          
                    menuObj.disable();
                }
                else if (ctrlObj._selectedMember.parent().attr("tag").split(":")[1].toLowerCase() == "measures") {        
                    menuObj.disableItem(ctrlObj._getLocalizedLabels("AddToValues"));
                    menuObj.disableItem(ctrlObj._getLocalizedLabels("AddToFilter"));
                    menuObj.enableItem(ctrlObj._getLocalizedLabels("AddToRow"));
                    menuObj.enableItem(ctrlObj._getLocalizedLabels("AddToColumn"));
                }
                else {
                    menuObj.disableItem(ctrlObj._getLocalizedLabels("AddToValues"));
                    $(args.target.parentElement).find(".namedSetCDB").length > 0 ? menuObj.disableItem(ctrlObj._getLocalizedLabels("AddToFilter")) : menuObj.enableItem(ctrlObj._getLocalizedLabels("AddToFilter"));
                    menuObj.enableItem(ctrlObj._getLocalizedLabels("AddToRow"));
                    menuObj.enableItem(ctrlObj._getLocalizedLabels("AddToColumn"));
                }
            }
            else if (mode == ej.Pivot.AnalysisMode.Pivot) {
                var targetText = args.target.textContent;
                if ($(args.target).hasClass("e-btn")) {
                    menuObj.enable();
                    if (ctrlObj.pluginName == "ejPivotGrid") {
                        menuObj.disableItem(ctrlObj._getLocalizedLabels("CalculatedField"));
                        if (($(args.target).parents(".pivotButton").attr("tag").split(":")[0]).toLowerCase() == "values")
                        {
                            if (ctrlObj.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode && $.grep(ctrlObj.model.dataSource.values, function (value) { return value.fieldCaption == targetText && value.isCalculatedField == true; }).length > 0)
                                menuObj.disable();
                            else if (ctrlObj.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode && $.grep(JSON.parse(ctrlObj.getOlapReport()).PivotCalculations, function (value) { return value.FieldHeader == targetText && value.CalculationType == 8; }).length > 0)
                                menuObj.disable();
                            menuObj.enableItem(ctrlObj._getLocalizedLabels("CalculatedField"));
                        }
    			    }
                }
                else {
                    var menuObj = $("#pivotTree").data('ejMenu');
                    menuObj.disable();
                }
            }
        },		

        _searchTreeNodes: function (args) {
            var inputObj = this.element.find(".searchEditorTreeView").data("ejMaskEdit");
            var treeobj = this.element.find(".editorTreeView").data("ejTreeView");;
            var treeElement = treeobj.element;
            var searchVal = !ej.isNullOrUndefined(inputObj.get_StrippedValue()) ? inputObj.get_StrippedValue().toLowerCase() : "";

            if (searchVal.length > 0) {
                var matchedNode = [], otherNodes = [];
                var linkNodes = treeElement.find('ul>li>div>a');
                for (var p = 0; p < linkNodes.length; p++) {
                    if ($(linkNodes[p]).text().toLowerCase().indexOf(searchVal) != -1)
                        matchedNode.push(linkNodes[p]);
                    else
                        otherNodes.push(linkNodes[p]);
                }
                var resultNodes = treeElement.find(matchedNode).closest("li").css("display", "block");
                treeElement.find(otherNodes).closest("li").css("display", "none");
                for (var i = 0; i < resultNodes.length; i++) {
                    var currentNode = $(resultNodes[i]);
                    var parentNode = currentNode.parents('ul').closest('li').css("display", "block");
                    if (parentNode.length > 0) {
                        treeobj.expandNode(parentNode);
                        if (treeobj.model.expandedNodes.indexOf($(treeobj._liList).index(parentNode)) == -1)
                            window._temp.push(parentNode);
                    }
                    var childrenUl = currentNode.children('ul');
                    if (childrenUl.length > 0 && childrenUl.children('li:visible').length == 0) {
                        currentNode.children('ul').children('li').css("display", "block");
                        treeobj.expandNode(resultNodes[i]);
                        if (treeobj.model.expandedNodes.indexOf($(treeobj._liList).index(resultNodes[i])) == -1)
                            window._temp.push(resultNodes[i]);
                    }
                }
            }
            else {
                treeElement.find('ul>li').css("display", "block");
                if (!ej.isNullOrUndefined(window._temp))
                    for (var i = 0; i < window._temp.length; i++) {
                        treeobj._collpaseNode(window._temp[i]);
                    }
                window._temp = [];
            }
        },

        editorTreeNavigatee: function (args, me) {
            var currentPage = me._memberPageSettings.currentMemeberPage;
            if (!$(args.target).hasClass("disabled")) {
                if ($(args.target).hasClass("nextPage")) {
                    me._memberPageSettings.startPage += me.model.memberEditorPageSize;
                    me._memberPageSettings.currentMemeberPage += 1;
                    me._memberPageSettings.endPage += me.model.memberEditorPageSize;
                }
                else if ($(args.target).hasClass("prevPage")) {
                    me._memberPageSettings.currentMemeberPage -= 1;
                    me._memberPageSettings.startPage = Math.abs(me._memberPageSettings.startPage - (me._memberPageSettings.currentMemeberPage == 1 ? me.model.memberEditorPageSize : me.model.memberEditorPageSize));
                    me._memberPageSettings.endPage -= me.model.memberEditorPageSize;
                }
                else if ($(args.target).hasClass("firstPage"))
                    me._memberPageSettings = { currentMemeberPage: 1, startPage: 0, endPage: me.model.memberEditorPageSize };
                else if ($(args.target).hasClass("lastPage")) {
                    me._memberPageSettings.currentMemeberPage = parseInt(me.element.find(".memberPageCount").text().split("/")[1].trim());
                    me._memberPageSettings.endPage = (me._memberPageSettings.currentMemeberPage * me.model.memberEditorPageSize);
                    me._memberPageSettings.startPage = (me._memberPageSettings.endPage - me.model.memberEditorPageSize);
                }
                else {
                    if (parseInt($(args.target).val()) > parseInt(me.element.find(".memberPageCount").text().split("/")[1].trim()) || parseInt($(args.target).val()) == 0)
                        return false
                    else {
                        me._memberPageSettings.currentMemeberPage = parseInt($(args.target).val());
                        me._memberPageSettings.endPage = me._memberPageSettings.currentMemeberPage * me.model.memberEditorPageSize;
                        me._memberPageSettings.startPage = me._memberPageSettings.currentMemeberPage == 1 || me._memberPageSettings.currentMemeberPage == 0 ? 0 : (me._memberPageSettings.endPage - me.model.memberEditorPageSize);
                    }
                }
                me._waitingPopup.show();
                if (me.model.operationalMode == ej.Pivot.OperationalMode.ClientMode) {
                    me._isMemberPageFilter = true;
                    var memberTreeObj = ej.Pivot.updateTreeView(me._pivotSchemaDesigner), selectedNodes = $.map($.grep(ej.Pivot.getNodesState(memberTreeObj)["selectedNodes"].split("::"), function(value){return (value.split("||")[0] != "All" && value != "")}), function (element, index) { { return { Id: element.split("||")[0], tag: element.split("||")[1], parentId: element.split("||")[2] } } }),
                    unSelectedNodes = $.map($.grep(ej.Pivot.getNodesState(memberTreeObj)["unSelectedNodes"].split("::"), function(value){return (value.split("||")[0] != "All" && value != "")}), function (element, index) { { return { Id: element.split("||")[0], tag: element.split("||")[1], parentId: element.split("||")[2] } } }), selNode = [], unSelNode = [];
                    if(me._selectedNodes){
                        $.each(selectedNodes, function(index, node){
                            if($.grep(me._selectedNodes, function(value, index){ return value.Id==node.Id; }).length == 0)
                                selNode[selNode.length] = node;
                        });
                    }
                    if(me._unSelectedNodes){
                        $.each(unSelectedNodes, function(index, node){
                            if($.grep(me._unSelectedNodes, function(value, index){ return value.Id==node.Id; }).length == 0)
                                unSelNode[unSelNode.length] = node;
                        });
                    }
                    me._selectedNodes = ej.isNullOrUndefined(me._selectedNodes) ? selectedNodes : $.merge(me._selectedNodes, selNode);
                    me._unSelectedNodes = ej.isNullOrUndefined(me._unSelectedNodes) ? unSelectedNodes : ej.isNullOrUndefined(unSelNode) ? $.merge(me._unSelectedNodes, unSelectedNodes) : $.merge(me._unSelectedNodes, unSelNode);
                    $.map(me._selectedNodes, function(element, index){
                        for(i=me._unSelectedNodes.length-1; i >= 0; i--) {
                            if(element.Id == me._unSelectedNodes[i].Id) {
                                me._unSelectedNodes[i].remove(); break;	}
                        }
                    });
                    ej.olap._mdxParser.getMembers(me.model.dataSource, me._pivotSchemaDesigner._selectedFieldName, me._pivotSchemaDesigner);
                }
                else {
                    if (ej.isNullOrUndefined(me._memberPageSettings.filterReportCollection))
                        me._memberPageSettings.filterReportCollection={};
                    me._updateTreeView();
                    me._memberPageSettings.filterReportCollection[currentPage] =  (me._getUnSelectedNodes() + "CHECKED" + me._getSelectedNodes(me._currentAxis == "Slicers" ? true : false));
                    if (me.model.beforeServiceInvoke != null)
                        me._trigger("beforeServiceInvoke", { action: "fetchMemberTreeNodes", element: me.element, customObject: me.model.customObject });
                    var serializedCustomObject = JSON.stringify(me.model.customObject);
                    me.doAjaxPost("POST", me.model.url + "/" + me.model.serviceMethodSettings.fetchMemberTreeNodes, JSON.stringify({ "action": "fetchMemberTreeNodes", "dimensionName": me._dimensionName + ":" + me._memberPageSettings.startPage + "-" + me.model.memberEditorPageSize + "-" + me.model.enableMemberEditorPaging , "olapReport": me.currentReport, "customObject": serializedCustomObject }), me._editorTreePageInfoSuccess);
                }
            }
        },

        editorTreePageInfoSuccess: function (editorTree, me) {
            me._memberPageSettings.currentMemeberPage > 1 ? me.element.find(".prevPage, .firstPage").removeClass("disabled").addClass("enabled") : me.element.find(".prevPage, .firstPage").removeClass("enabled").addClass("disabled");
            me._memberPageSettings.currentMemeberPage == parseInt(me.element.find(".memberPageCount").text().split("/")[1].trim()) ? me.element.find(".nextPage, .lastPage").removeClass("enabled").addClass("disabled") : me.element.find(".nextPage, .lastPage").removeClass("disabled").addClass("enabled");
            var editorTreeInfo, treeViewData;
            if (editorTree[0] != undefined)
                editorTreeInfo = editorTree[0].Value;
            else if (editorTree.d != undefined)
                editorTreeInfo = editorTree.d[0].Value;
            else
                editorTreeInfo = editorTree.EditorTreeInfo;
            treeViewData = $.parseJSON(editorTreeInfo);
            me.element.find(".memberCurrentPage").val(me._memberPageSettings.currentMemeberPage);
            treeViewData.splice(-1, 1);
            me._appendTreeViewData(treeViewData, false);
            me._unWireEvents();
            me._wireEvents();
            me._waitingPopup.hide();
        },

        createErrorDialog: function (controlObj) {
            ej.Pivot.openPreventPanel(controlObj);
            var dialogObj;
            if (controlObj.element.find(".errorDialog").length == 0) {
                var dialogElem = ej.buildTag("div.errorDialog#ErrorDialog", ej.buildTag("div.warningImg")[0].outerHTML + ej.buildTag("div.warningContent", controlObj._getLocalizedLabels("AlertMsg"))[0].outerHTML + ej.buildTag("div", ej.buildTag("button#ErrOKBtn.errOKBtn", "OK")[0].outerHTML)[0].outerHTML).attr("title", controlObj._getLocalizedLabels("Warning"))[0].outerHTML;
                controlObj.element.append(dialogElem);
                controlObj.element.find(".errorDialog").ejDialog({ target: "#" + controlObj._id, enableResize: false, enableRTL: controlObj.model.enableRTL, width: "400px" });
                dialogObj = controlObj.element.find(".errorDialog").data("ejDialog");
                $("#" + dialogObj._id + "_wrapper").css({ left: "50%", top: "50%" });
                controlObj.element.find(".errOKBtn").ejButton({ type: ej.ButtonType.Button, click: ej.proxy(ej.Pivot.errOKBtnClick, controlObj) });
                controlObj.element.find(".e-dialog .e-close").attr("title", controlObj._getLocalizedLabels("Close"));
            }
            else {
                dialogObj = controlObj.element.find(".errorDialog").data("ejDialog");
                dialogObj.open();
            }
        },

        errOKBtnClick: function (args) {
            this.element.find("#preventDiv").remove();
            var dialogObj = this.element.find(".errorDialog").data("ejDialog");
            dialogObj._ejDialog.find("div.e-dialog-icon").trigger("click");
        },

        //OLAP functionalities
        doAjaxPost: function (type, url, data, onSuccess, onComplete, customArgs) {
            var contentType, dataType, successEvt, isAsync = true;
            if ((data["XMLA"] == undefined))
                contentType = 'application/json; charset=utf-8', dataType = 'json', successEvt = $.proxy(onSuccess, this);
            else
                contentType = 'text/xml', dataType = 'xml', data = data["XMLA"], successEvt = $.proxy(onSuccess, ej.olap.base, customArgs), isAsync = ((ej.browserInfo().name == "msie" && ej.browserInfo().version <= 9) ? false : (!ej.isNullOrUndefined(customArgs) && customArgs["action"] != "loadFieldElements") ? true : false);
            $.ajax({
                type: type,
                url: url,
                contentType: contentType,
                async: isAsync,
                dataType: dataType,
                data: data,
                success: successEvt,
                complete: ej.proxy(function (onComplete) {
                    $.proxy(onComplete, this);
                    var eventArgs = { "action": this._currentAction, "customObject": "", element: this.element };
                }, this),
                error: ej.proxy(function (msg, textStatus, errorThrown) {
                    if (typeof this._ogridWaitingPopup != 'undefined' && this._ogridWaitingPopup != null)
                        this._ogridWaitingPopup.hide();
                    if (typeof oclientWaitingPopup != 'undefined' && oclientWaitingPopup != null)
                        oclientWaitingPopup.hide();
                    var eventArgs = { "action": this._drillAction != "" ? this._drillAction : "initialize", "customObject": "", "element": this.element, "Message": msg };
                    this._trigger("renderFailure", eventArgs);
                    this.renderControlFromJSON("");
                    if (this._dataModel == "XMLA")
                        this._createErrorDialog(msg.statusText, this._getLocalizedLabels("Error")); msg.statusText
                }, this)
            });
        },        

        getCubeList: function (customArgs, e) {
            var cubeList = [];
            for (var i = 0; i < $(e).find("row").length; i++) {
                var element = $($(e).find("row")[i]);
                cubeList.push({ name: $(element).children("CUBE_NAME").text() });
            }
            customArgs.pvtCtrldObj.setCubeList(cubeList);
        },

        generateTreeViewData: function (schemaObj) {
            var args = { catalog: schemaObj.model.pivotControl.model.dataSource.catalog, cube: schemaObj.model.pivotControl.model.dataSource.cube, url: schemaObj.model.pivotControl.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" }
            this._getTreeData(args, this.loadDimensionElements, { schemaData: schemaObj, action: "loadFieldElements" });
        },

        loadDimensionElements: function (customArgs, data) {
            var dimensionName, measures = {}, conStr = ej.olap.base._getConnectionInfo(customArgs.schemaData.model.pivotControl.model.dataSource.data), args = {};
            args = { catalog: customArgs.schemaData.model.pivotControl.model.dataSource.catalog, cube: customArgs.schemaData.model.pivotControl.model.dataSource.cube, url: customArgs.schemaData.model.pivotControl.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" };
            customArgs.schemaData.model.pivotControl["schemaTreeView"] = []; customArgs.schemaData.model.pivotControl["reportItemNames"] = [];

            for (var i = 0; i < $(data).find("row").length; i++) {
                var element = $($(data).find("row")[i]), dimensionUniqueName = element.find("DIMENSION_UNIQUE_NAME").text(), dimensionName = element.find("DIMENSION_CAPTION").text();
                if (dimensionUniqueName.toLowerCase().indexOf("[measure") >= 0)
                    measures = { hasChildren: true, isSelected: false, id: dimensionUniqueName, name: dimensionName, spriteCssClass: dimensionUniqueName.toLowerCase() == "[measures]" ? "folderCDB e-icon" : "dimensionCDB e-icon", tag: dimensionUniqueName }
                else if (!$($(data).find("row")[0]).find("HIERARCHY_CAPTION").length > 0) {
                    customArgs.schemaData.model.pivotControl.schemaTreeView.push({ hasChildren: true, isSelected: false, id: dimensionUniqueName, name: dimensionName, spriteCssClass: "dimensionCDB e-icon", tag: dimensionUniqueName, defaultHierarchy: $($(data).find("row")[i]).children("DEFAULT_HIERARCHY").text() });
                }
            }
            customArgs.schemaData.model.pivotControl.schemaTreeView.splice(0, 0, measures);
            if (!customArgs.schemaData.model.pivotControl.model.enableDrillThrough || (customArgs.schemaData != undefined && customArgs.schemaData.model.olap.showNamedSets)) {
                args.request = "MDSCHEMA_SETS";
                ej.Pivot._getTreeData(args, ej.Pivot.loadNamedSetElements, customArgs);
            }
            else {
                args.request = "MDSCHEMA_HIERARCHIES";
                if (ej.isNullOrUndefined(customArgs.schemaData.model.pivotControl._fieldData) || (!ej.isNullOrUndefined(customArgs.schemaData.model.pivotControl._fieldData) && ej.isNullOrUndefined(customArgs.schemaData.model.pivotControl._fieldData.hierarchy)))
                    ej.olap.base._getFieldItemsInfo(customArgs.schemaData.model.pivotControl);
                if (customArgs.schemaData.model.pivotControl._fieldData.hierarchySuccess == undefined)
                    ej.Pivot._getTreeData(args, customArgs.schemaData.model.pivotControl.loadHierarchyElements, customArgs);
                else
                    ej.Pivot.loadHierarchyElements(customArgs, customArgs.schemaData.model.pivotControl._fieldData.hierarchySuccess);
            }
        },

        loadNamedSetElements: function (customArgs, data) {
            var args = { catalog: customArgs.schemaData.model.pivotControl.model.dataSource.catalog, cube: customArgs.schemaData.model.pivotControl.model.dataSource.cube, url: customArgs.schemaData.model.pivotControl.model.dataSource.data, request: "MDSCHEMA_HIERARCHIES" }
            var data = customArgs.schemaData.model.pivotControl.model.dataSource, treeNodeElement = {}, measureGroupItems = [], reportElement;

            reportElement = $.map(data.rows, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName });
            $.merge(reportElement, ($.map(data.columns, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));
            $.merge(reportElement, ($.map(data.filters, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));

            for (var i = 0; i < $(data).find("row").length; i++) {
                var element = $($(data).find("row")[i]);
                if ((!($.inArray(element.find("DIMENSIONS").text().split(".")[0], measureGroupItems) >= 0))) {
                    customArgs.schemaData.model.pivotControl.schemaTreeView.push({ hasChildren: true, isSelected: false, pid: element.find("DIMENSIONS").text().split(".")[0], id: element.find("SET_DISPLAY_FOLDER").text() + "_" + element.find("DIMENSIONS").text().split(".")[0], name: element.find("SET_DISPLAY_FOLDER").text(), spriteCssClass: "folderCDB e-icon namedSets" });
                    measureGroupItems.push(element.find("DIMENSIONS").text().split(".")[0]);
                }
                customArgs.schemaData.model.pivotControl.schemaTreeView.push({
                    hasChildren: true, isSelected: ($.inArray("[" + $.trim(element.children("SET_NAME").text()) + "]", reportElement) >= 0),
                    pid: element.find("SET_DISPLAY_FOLDER").text() + "_" + element.find("DIMENSIONS").text().split(".")[0],
                    id: "[" + $.trim(element.children("SET_NAME").text()).replace(/\&/g, "&amp;") + "]",
                    name: element.children("SET_CAPTION").text(), spriteCssClass: "namedSetCDB e-icon", tag: element.find("EXPRESSION").text()
                });
            }

            if (ej.isNullOrUndefined(customArgs.schemaData.model.pivotControl._fieldData) || customArgs.schemaData.model.pivotControl._fieldData.hierarchySuccess == undefined)
                ej.Pivot._getTreeData(args, ej.Pivot.loadHierarchyElements, customArgs);
            else
                ej.Pivot.loadHierarchyElements(customArgs, customArgs.schemaData.model.pivotControl._fieldData.hierarchySuccess);
        },

        loadHierarchyElements: function (customArgs, data) {
            var args = { catalog: customArgs.schemaData.model.pivotControl.model.dataSource.catalog, cube: customArgs.schemaData.model.pivotControl.model.dataSource.cube, url: customArgs.schemaData.model.pivotControl.model.dataSource.data, request: "MDSCHEMA_LEVELS" };
            var reportInfo = customArgs.schemaData.model.pivotControl.model.dataSource, displayFolder = "", reportElement;

            reportElement = $.map(reportInfo.rows, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName });
            $.merge(reportElement, ($.map(reportInfo.columns, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));
            $.merge(reportElement, ($.map(reportInfo.filters, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName })));

            for (var i = 0; i < $(data).find("row").length; i++) {
                var element = $($(data).find("row")[i]), dimensionUniqueName = element.find("DIMENSION_UNIQUE_NAME").text(), hierarchyUniqueName = element.find("HIERARCHY_UNIQUE_NAME").text();
                var currElement = $(customArgs.schemaData.model.pivotControl.schemaTreeView).filter(function (i, x) { return x.tag == dimensionUniqueName; }).map(function (i, x) { return x });
                if (currElement.length > 0 && dimensionUniqueName != hierarchyUniqueName)
                    customArgs.schemaData.model.pivotControl.schemaTreeView.push({ hasChildren: true, isSelected: ($.inArray(hierarchyUniqueName, reportElement) >= 0), pid: dimensionUniqueName, id: hierarchyUniqueName, name: element.find("HIERARCHY_CAPTION").text(), spriteCssClass: ((element.find("HIERARCHY_ORIGIN").text() != "2") && element.find("HIERARCHY_ORIGIN").text() != "6") ? "hierarchyCDB e-icon" : "attributeCDB e-icon", tag: hierarchyUniqueName, });
            }
            ej.Pivot._getTreeData(args, ej.Pivot.loadLevelElements, customArgs);
        },

        loadLevelElements: function (customArgs, data) {
            var newDataSource = $.map($(data).find("row"), function (obj, index) {
                if (parseInt($(obj).children("LEVEL_TYPE").text()) != "1" && $(obj).children("HIERARCHY_UNIQUE_NAME").text().toLowerCase() != "[measures]")
                    return { hasChildren: false, isChecked: false, id: $(obj).find("LEVEL_UNIQUE_NAME").text(), pid: $(obj).find("HIERARCHY_UNIQUE_NAME").text(), name: $(obj).find("LEVEL_CAPTION").text(), tag: $(obj).find("LEVEL_UNIQUE_NAME").text(), spriteCssClass: "level" + parseInt($(obj).children("LEVEL_NUMBER").text()) + " e-icon" };
            });
            $.merge(customArgs.schemaData.model.pivotControl.schemaTreeView, newDataSource);
            if (!customArgs.schemaData.model.pivotControl.model.enableDrillThrough || customArgs.schemaData.model.pivotControl._fieldData.measureSuccess) {
                if (ej.isNullOrUndefined(customArgs.schemaData.model.pivotControl._fieldData) || !customArgs.schemaData.model.pivotControl._fieldData.measureSuccess) {
                    var args = { catalog: customArgs.schemaData.model.pivotControl.model.dataSource.catalog, cube: customArgs.schemaData.model.pivotControl.model.dataSource.cube, url: customArgs.schemaData.model.pivotControl.model.dataSource.data, request: "MDSCHEMA_MEASURES" }
                    ej.Pivot._getTreeData(args, ej.Pivot.loadMeasureElements, customArgs);
                }
                else
                    ej.Pivot.loadMeasureElements(customArgs, customArgs.schemaData.model.pivotControl._fieldData.measureSuccess);
            }
        },

        loadMeasureGroups: function (customArgs, data) {
            if (ej.isNullOrUndefined(customArgs.pivotControl._fieldData))
                customArgs.pivotControl._fieldData = {};
            customArgs.pivotControl._fieldData["measuresGroups"] = $(data).find("row");
        },

        loadMeasureElements: function (customArgs, data) {
            var args = { catalog: customArgs.schemaData.model.pivotControl.model.dataSource.catalog, cube: customArgs.schemaData.model.pivotControl.model.dataSource.cube, url: customArgs.schemaData.model.pivotControl.model.dataSource.data, request: "MDSCHEMA_DIMENSIONS" }
            var elements = [], measureGroupItems = [], measureGroup = "", caption;

            elements = $.map(customArgs.schemaData.model.pivotControl.model.dataSource.values, function (obj, index) { if (obj["measures"] != undefined) return obj["measures"] });
            customArgs.schemaData.model.pivotControl.reportItemNames = $.map(elements, function (obj, index) { if (obj.fieldName != undefined) return obj.fieldName });

            if (customArgs.schemaData.model.pivotControl.model.locale != "en-US") {
                var args = { catalog: customArgs.schemaData.model.pivotControl.model.dataSource.catalog, cube: customArgs.schemaData.model.pivotControl.model.dataSource.cube, url: customArgs.schemaData.model.pivotControl.model.dataSource.data, request: "MDSCHEMA_MEASUREGROUPS" }
                ej.Pivot._getTreeData(args, ej.Pivot.loadMeasureGroups, { pivotControl: customArgs.schemaData.model.pivotControl, action: "loadFieldElements" });
            }

            for (var i = 0; i < $(data).find("row").length; i++) {
                var element = $($(data).find("row")[i]), measureGRPName = element.children("MEASUREGROUP_NAME").text(), measureUQName = element.find("MEASURE_UNIQUE_NAME").text();
                if ((!($.inArray(measureGRPName, measureGroupItems) >= 0))) {
                    if (customArgs.schemaData.model.pivotControl.model.locale != "en-US") {
                        var measureInfo = $.map(customArgs.schemaData.model.pivotControl._fieldData["measuresGroups"], function (item) { if ($(item).children("MEASUREGROUP_NAME").text() == measureGRPName) return $(item).children("MEASUREGROUP_CAPTION").text() });
                        caption = measureInfo.length > 0 ? measureInfo[0] : measureGRPName
                    }
                    else
                        caption = measureGRPName;
                    customArgs.schemaData.model.pivotControl.schemaTreeView.push({ hasChildren: true, isChecked: false, pid: "[Measures]", id: measureGRPName, name: caption, spriteCssClass: "measureGroupCDB e-icon", tag: measureGRPName });
                    measureGroupItems.push(measureGRPName);
                }
                customArgs.schemaData.model.pivotControl.schemaTreeView.push({ hasChildren: true, isSelected: ($.inArray(measureUQName, customArgs.schemaData.model.pivotControl.reportItemNames) >= 0), id: measureUQName, pid: measureGRPName, name: element.children("MEASURE_CAPTION").text(), spriteCssClass: "measure", tag: measureUQName });
                if (($.inArray(measureUQName, customArgs.schemaData.model.pivotControl.reportItemNames) >= 0))
                    customArgs.schemaData.model.pivotControl.reportItemNames.splice(customArgs.schemaData.model.pivotControl.reportItemNames.indexOf(measureUQName), 1);
            }

            if (!ej.isNullOrUndefined(customArgs.schemaData) && customArgs.schemaData.model.olap.showKpi) {
                treeNodeElement = { hasChildren: true, isChecked: false, id: "folderStruct", name: "KPI", spriteCssClass: "KPICDB folderCDB e-icon", tag: "" }
                customArgs.schemaData.model.pivotControl.schemaTreeView.splice(1, 0, treeNodeElement);
                args.request = "MDSCHEMA_KPIS";
                customArgs.schemaData.model.pivotControl._getTreeData(args, customArgs.schemaData.model.pivotControl.loadKPIElements, customArgs);
            }
            else if (!ej.isNullOrUndefined(customArgs.schemaData))
                customArgs.schemaData._createTreeView(this, customArgs.schemaData.model.pivotControl.schemaTreeView);
        },

        loadKPIElements: function (customArgs, data) {
            var data = customArgs.schemaData.model.pivotControl.model.dataSource, reportElement = this.reportItemNames, measureGroupItems = [], measureGroup = "";

            for (var i = 0; i < $(data).find("row").length; i++) {
                var element = $($(data).find("row")[i]), kpiName = element.children("KPI_CAPTION").text(),
                    kpiGoal = element.children("KPI_goal").text(), kpiStatus = element.children("KPI_STATUS").text(),
                    kpiTrend = element.children("KPI_TREND").text(), kpiValue = element.find("KPI_VALUE").text();
                if ((!($.inArray(element.children("KPI_NAME").text(), measureGroupItems) >= 0))) {
                    treeNodeElement = { hasChildren: true, isChecked: false, pid: "folderStruct", id: kpiName, name: kpiName, spriteCssClass: "measureGroupCDB e-icon", tag: kpiName }
                    customArgs.schemaData.model.pivotControl.schemaTreeView.push(treeNodeElement);
                    measureGroupItems.push(kpiName);
                }
                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiGoal, reportElement) >= 0), id: kpiGoal, pid: kpiName, name: customArgs.schemaData.model.pivotControl._getLocalizedLabels("Goal"), spriteCssClass: "kpiGoal e-icon", tag: kpiGoal };
                customArgs.schemaData.model.pivotControl.schemaTreeView.push(treeNodeElement);
                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiStatus, reportElement) >= 0), id: kpiStatus, pid: kpiName, name: customArgs.schemaData.model.pivotControl._getLocalizedLabels("Status"), spriteCssClass: "kpiStatus e-icon", tag: kpiStatus };
                customArgs.schemaData.model.pivotControl.schemaTreeView.push(treeNodeElement);
                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiTrend, reportElement) >= 0), id: kpiTrend, pid: kpiName, name: customArgs.schemaData.model.pivotControl._getLocalizedLabels("Trend"), spriteCssClass: "kpiTrend e-icon", tag: kpiTrend };
                customArgs.schemaData.model.pivotControl.schemaTreeView.push(treeNodeElement);
                treeNodeElement = { hasChildren: true, isSelected: ($.inArray(kpiValue, reportElement) >= 0), id: kpiValue, pid: kpiName, name: customArgs.schemaData.model.pivotControl._getLocalizedLabels("Value"), spriteCssClass: "kpiValue e-icon", tag: kpiValue };
                customArgs.schemaData.model.pivotControl.schemaTreeView.push(treeNodeElement);
            }
            customArgs.schemaData._createTreeView(this, customArgs.schemaData.model.pivotControl.schemaTreeView);
            delete customArgs.schemaData.model.pivotControl.reportItemNames;
            delete customArgs.schemaData.model.pivotControl.schemaTreeView;
        },



        _drillThroughCellClick: function (args, gridObj) {
            gridObj._waitingPopup.show();
            var measures, measureGrp;
            var cellPos = $(args.currentTarget.parentElement).attr('p');
            if (gridObj.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode) {
                gridObj.doAjaxPost("POST", gridObj.model.url + "/" + gridObj.model.serviceMethodSettings.drillThroughDataTable, JSON.stringify({ "currentReport": JSON.parse(gridObj.getOlapReport()).Report, "layout": gridObj.model.layout, "cellPos": cellPos, "customObject": JSON.stringify(gridObj.model.customObject) }), function (args) {
                    if ($(gridObj.element).parents(".e-pivotclient").length > 0) {
                        $(gridObj.element).parents(".e-pivotclient").data("ejPivotClient")._trigger("drillThrough", { element: gridObj.element, data: args });
                    }
                    else
                        gridObj._trigger("drillThrough", { element: gridObj.element, data: args });
                });
            }
            else {
                var rowSpan = $("#" + gridObj._id).find("tbody").find('tr:first').find('th').length;
                for (i = 0; i < rowSpan; i++) {
                    var rowInfo = (gridObj.getJSONRecords()[parseInt((i * gridObj._rowCount) + parseInt(cellPos.split(",")[1]))].Info.indexOf("Measures") != -1 || gridObj.getJSONRecords()[parseInt((i * gridObj._rowCount) + parseInt(cellPos.split(",")[1]))].RowSpan <= 1) ? gridObj.getJSONRecords()[parseInt((i * gridObj._rowCount) + parseInt(cellPos.split(",")[1]))].Info.split("::")[0] : "";
                    if (rowInfo.indexOf("Measures") != -1)
                        measures = rowInfo;
                    if (rowInfo != "")
                        gridObj._rowHeader[i] = rowInfo;
                }
                var columnHeaderCount = $("#" + gridObj._id).find("tbody").find('[p="' + parseInt(cellPos.split(",")[0]) + "," + parseInt(cellPos.split(",")[1]) + '"]').closest('tbody').prev().children('tr').length;
                for (i = 0; i < columnHeaderCount; i++) {
                    var colInfo = (gridObj.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * gridObj._rowCount) + i)].Info.indexOf("Measures") != -1 || gridObj.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * gridObj._rowCount) + i)].ColSpan <= 1) ? gridObj.getJSONRecords()[parseInt((parseInt(cellPos.split(",")[0]) * gridObj._rowCount) + i)].Info.split("::")[0] : "";
                    if (colInfo.indexOf("Measures") != -1)
                        measures = colInfo;
                    if (colInfo != "")
                        gridObj._colHeader[i] = colInfo;
                }
                if (ej.isNullOrUndefined(gridObj._fieldData) || (!ej.isNullOrUndefined(gridObj._fieldData) && ej.isNullOrUndefined(gridObj._fieldData.hierarchy)))
                    gridObj._getFieldItemsInfo(gridObj);
                for (j = 0; j < gridObj._fieldData.measures.length; j++) {
                    if (measures == gridObj._fieldData.measures[j].id)
                        gridObj.measureGrp = gridObj._fieldData.measures[j].pid
                }
                gridObj._rowHeader = $.grep(gridObj._rowHeader, function (n) { return n == 0 || n });
                gridObj._colHeader = $.grep(gridObj._colHeader, function (n) { return n == 0 || n });
                gridObj._createDrillThroughQuery("", gridObj);
            }
        },
        openHierarchySelector: function (e, data) {
            if (e.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)
                this._createDrillThroughDialog(e, data);
            else {
                var controlObj;
                e._waitingPopup.show();
                if (e.target.className.indexOf("e-pivotclient") >= 0)
                    controlObj = e._pivotGrid;
                else controlObj = e;
                var conStr = controlObj._getConnectionInfo(e.model.dataSource.data);
                var pData = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>MDSCHEMA_MEASUREGROUP_DIMENSIONS</RequestType><Restrictions><RestrictionList><CATALOG_NAME>" + e.model.dataSource.catalog + "</CATALOG_NAME><CUBE_NAME>" + e.model.dataSource.cube + "</CUBE_NAME><MEASUREGROUP_NAME>" + controlObj.measureGrp + "</MEASUREGROUP_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>" + e.model.dataSource.catalog + "</Catalog> <LocaleIdentifier>" + conStr.LCID + "</LocaleIdentifier></PropertyList></Properties></Discover></Body></Envelope>";
                this.doAjaxPost("POST", conStr.url, { XMLA: pData }, controlObj._loadDimensionElements, null, { pvtGridObj: controlObj, action: "loadMeasureElements" });
            }
        },
        
        _createDrillThroughDialog: function (args, dataSourceInfo) {
            if (args.model.operationalMode != ej.PivotGrid.OperationalMode.ServerMode)
                dataSourceInfo.shift();
            args.element.find(".e-dialog, .clientDialog").remove();
            var textTitle = ej.buildTag("label#", args._getLocalizedLabels("SelectHierarchy"))[0].outerHTML;
            var textArea = "<br><textarea id='hrSel' style='width:270px; height:300px; resize:none; margin:0px 5px 0 5px'></textarea></br><br>",
            browserPanel = "<div class=cubeTable style='width:200px; overflow:auto'><div valign=\"bottom\">" + this._createHierarchyBrowser() + "</div></div>";
            var dialogContent = ej.buildTag("div#dropDlg.dropDlg", "<table class=\"outerTable\"><tr><td>" + browserPanel + "</td><td>" + textTitle + textArea + "</td></tr></table>")[0].outerHTML + "</br>",
            dialogFooter = ej.buildTag("div", ej.buildTag("button#btnOK.dialogBtnOK", args._getLocalizedLabels("OK"))[0].outerHTML + ej.buildTag("button#btnCancel.dialogBtnCancel", args._getLocalizedLabels("Cancel"))[0].outerHTML, { "float": "right", "margin": "-5px 0 6px" })[0].outerHTML,
            ejDialog = ej.buildTag("div#clientDialog.clientDialog", dialogContent + dialogFooter, { "opacity": "1" }).attr("title", "Hierarchy Selector")[0].outerHTML;
            $(ejDialog).appendTo("#" + args._id);
            $("#btnOK, #btnCancel").ejButton();
            $("#btnOK, #btnCancel").css({ margin: "0 20px 20px 0", width: "50px" });
            args.element.find(".clientDialog").ejDialog({ width: 550, target: "#" + args._id, enableResize: false, enableRTL: args.model.enableRTL, close: ej.proxy(ej.Pivot.closePreventPanel, args) });
            args.element.find(".cubeTreeViewHierarchy").ejTreeView({
                showCheckbox: true,
                fields: { id: "id", parentId: "pid", text: "name", isChecked: "isSelected", spriteCssClass: "spriteCssClass", dataSource: args.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? $.parseJSON(dataSourceInfo.d) : dataSourceInfo },
                allowDragAndDrop: true,
                allowDropChild: false,
                allowDropSibling: false,
                enableRTL: args.model.enableRTL ? true : false,
                beforeDelete: function () {
                    return false;
                },
                dragAndDropAcrossControl: true,
                nodeDropped: ej.proxy(this._hierarchyNodeDropped, args),
            });
            args._tableTreeObj = args.element.find(".cubeTreeViewHierarchy").data("ejTreeView");
            args._tableTreeObj.element.find(".e-ul").css({ "width": "100%", "height": "100%" });
            args._tableTreeObj.element.find(".e-chkbox-wrap").remove();
            var treeViewElements = args._tableTreeObj.element.find("li");
            for (var i = 0; i < treeViewElements.length; i++) {
                var tagValue = args.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? $.parseJSON(dataSourceInfo.d)[i].tag : dataSourceInfo[i].tag
                treeViewElements[i].setAttribute("tag", tagValue);
            }
            if (args._tableTreeObj) {
                args._tableTreeObj.element.find("li").mouseover(ej.proxy(function (evt) {
                    if ($(evt.target).parent().find(".measureGroupCDB, .dimensionCDB, .folderCDB").length > 0)
                        $(evt.target).css("cursor", "default");
                }, args));
            }
            var grid = args;
            $("#btnOK").click(function () {
                var text = $("#hrSel").val();
                $(".e-dialog, .clientDialog, .drilltableDialog").remove();
                grid._waitingPopup.show();
                ej.olap._mdxParser._createDrillThroughQuery(text, grid);
                grid._waitingPopup.hide();
            });
            $("#btnCancel").click(function () {
                $(".e-dialog, .clientDialog").remove();
                grid._waitingPopup.hide()
            });
            if (args.model.enableRTL) {
                $('.e-dialog').addClass("e-rtl");
                $('.dialogBtnCancel').css("margin", "0 -70px 0 0");
            }
        },

        _createHierarchyBrowser: function (cubeTreeInfo) {
            return ej.buildTag("div.cubeBrowserHierarchy", ej.buildTag("div.cubeTreeViewHierarchy")[0].outerHTML, { width: "200px", height: "300px", overflow: "auto" })[0].outerHTML;
        },

        _hierarchyNodeDropped: function (sender) {
            if (sender.dropTarget[0].id == "hrSel") {
                var target;
                if ($($(sender.droppedElement).children()[0]).find(".dimensionCDB").length > 0)
                    target = this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? $(sender.droppedElement).find("li:first").attr("tag") : $(sender.droppedElement).find("li:first")[0].id;
                else if ($(sender.droppedElement).find("li:first").length == 0)
                    target = this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? $(sender.droppedElement.parent().parent()).attr("tag") : $(sender.droppedElement.parent().parent())[0].id;
                else
                    target = this.model.operationalMode == ej.PivotGrid.OperationalMode.ServerMode ? $(sender.droppedElement).attr("tag") : sender.droppedElementData.id;
                target = target.replace("[", "[$");
                for (var i = 0; i < $("#hrSel").val().split(",").length; i++) {
                    if (target == $("#hrSel").val().split(",")[i])
                        return false;
                }
                var tex = this.element.find('#hrSel').val();
                if (tex.length != 0) {
                    tex = tex + ',' + target;
                    this.element.find('#hrSel').val(tex);
                }
                else
                    this.element.find('#hrSel').val(target);
            }
        },

        _generateDrillData: function (customArgs, args) {
            var tag = $(args).find("row").children();
            var json = $.map(tag, function (a) {
                var num = parseFloat(a.textContent);
                var text = a.tagName.replace(/_x005B_/g, "[").replace(/_x0020_/g, " ").replace(/_x005D_/g, "]").replace(/_x0024_/g, "$").replace("].[", "]-[");
                return '"' + text + '"' + ":" + num;
            })
            var value = json[0], gridJSON = "";
            for (var i = 0; i < json.length; i++) {
                if (json[i] == value) {
                    gridJSON += gridJSON == "" ? "[{" + json[i] : "}, {" + json[i];
                    continue;
                }
                gridJSON += "," + json[i];
            }
            gridJSON += "}]";
            if ($(customArgs.pvtGridObj.element).parents(".e-pivotclient").length > 0){
                $(customArgs.pvtGridObj.element).parents(".e-pivotclient").data("ejPivotClient")._trigger("drillThrough", { element: customArgs.pvtGridObj.element, data: gridJSON });
            }
            else
                customArgs.pvtGridObj._trigger("drillThrough", { element: customArgs.pvtGridObj.element, data: gridJSON });
        },

        _getEditorMember: function (data, controlObj) {
            if (controlObj.model.operationalMode == ej.PivotGrid.OperationalMode.ClientMode) {
                var tmpItems = controlObj._getTreeViewItems();
                var ds = $.extend(true, [], ej.isNullOrUndefined(controlObj._memberTreeObj) ? controlObj._schemaData._memberTreeObj.dataSource() : controlObj._memberTreeObj.dataSource());
                var treeItems = $.map(tmpItems, function (item1) {
                    if (item1.Id != "All") {
                        $.map(ds, function (item2) {
                            if (item1.Id == item2.id) {
                                item1 = item2;
                                item1.name = ej.isNullOrUndefined(item1.parentId) ? item1.name + "_" + 1 : item1.name;
                            }
                        });
                        return item1;
                    }
                });
                var nodes = [];
                var items = $.map(treeItems, function (item1) {
                    $.map(treeItems, function (item2) {
                        if (item1.parentId == item2.id) {
                            item1.name = item1.name + "_" + (Number(item2.name.split('_')[item2.name.split('_').length - 1]) + 1);
                        }
                    });
                    return item1;
                });
                $.map(items, function (item) {
                    var val = item.name.split('_')[item.name.split('_').length - 2];
                    var lvl = Number(item.name.split('_')[item.name.split('_').length - 1]);
                    var chkState = item.checkedStatus;
                    nodes.push({ name: val, checked: chkState, level: Number(lvl) });
                });
               
                return this._updateEditorMembers(data, nodes, controlObj);
            }
            else {
                if (controlObj.model.analysisMode == ej.Pivot.AnalysisMode.Olap) {
                    var treeElement = controlObj.element.find(".editorTreeView").length == 0 ? controlObj._schemaData.element.find('.editorTreeView') : controlObj.element.find(".editorTreeView");
                    var nodes = [];
                    var items = $(treeElement).find(':input.nodecheckbox');
                    $.map(items, function (item) {
                        if ($(item).parents('li:eq(0)').attr("id") != "All") {
                            var val = $(item).parent().siblings('a').text();
                            var lvl = item.value.split('_')[item.value.split('_').length - 1];
                            var chkState = item.checked || $(item.parentElement).attr('aria-checked') == 'mixed' ? true : false;
                            nodes.push({ name: val, checked: chkState, level: Number(lvl) });
                        }
                    });
                    return this._updateEditorMembers(data, nodes, controlObj);
                }
                else {
                    textArr = [];
                    for (var i = 1; i < data.length; i++)
                        textArr.push($(data[i].parentElement).siblings("a").text());
                    return textArr;
                }
            }
        },

        _updateEditorMembers: function(data, nodes, controlObj){
            if (!ej.isNullOrUndefined(controlObj._fieldMembers[data])) {
                var tmpArray = [], buffer = 0, member = "";
                var savedFields = controlObj._fieldMembers[data];
                for (var i = 0; i < nodes.length; i++) {
                    if (ej.isNullOrUndefined(savedFields[i + buffer]) || nodes[i].level == savedFields[i + buffer].level) {
                        tmpArray.push(nodes[i]);
                    }
                    else if (nodes[i].level < savedFields[i + buffer].level) {
                        var count = i;
                        do {
                            if (nodes[i - 1].checked)
                                tmpArray.push(savedFields[count]);
                            buffer++;
                            count++;
                        } while (nodes[i].level < savedFields[count].level);
                        i--;
                    }
                    else if (nodes[i].level > savedFields[i + buffer].level) {
                        var svdlvl = savedFields[i + buffer].level;
                        var count = i;
                        do {
                            tmpArray.push(nodes[count]);
                            buffer--;
                            count++;
                            i = count - 1;
                        } while (nodes[count].level > svdlvl);
                    }
                }
            }
            controlObj._fieldMembers[data] = ej.isNullOrUndefined(controlObj._fieldMembers[data]) ? nodes : tmpArray;


            var lvl = 1, parent = "", state = "", checkedMembers = [];
            do {
                var lvlMembers = $.map(controlObj._fieldMembers[data], function (item) {
                  if (item.level == lvl)
                        return item;
                });
                checkedMembers = $.map(lvlMembers, function (item) {
                    if (item.checked)
                        return item;
                });
                if (lvlMembers.length == checkedMembers.length) {
                    member = lvl == 1 ? "All" : parent;
                    if (lvlMembers.length > 1)
                    state = "All";
                    lvl++;
                }
                else if (checkedMembers.length == 1) {
                    parent = member = state == "All" ? "multiple" : checkedMembers[0].name;
                    lvl++;
                }
                else if (checkedMembers.length > 1 && lvlMembers.length > checkedMembers.length) {
                    member = "multiple";
                    break;
                }
            } while (checkedMembers.length > 0 && member != "All" && member != "multiple" && $.map(controlObj._fieldMembers[data], function (item) { if (item.level == lvl) return item; }).length > 0);

            return member;
        },

        _getTreeData: function (args, successMethod, customArgs) {
            var conStr = ej.olap.base._getConnectionInfo(args.url);
            var xmlMsg = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>" + args.request + "</RequestType><Restrictions><RestrictionList><CATALOG_NAME>" + args.catalog + "</CATALOG_NAME>" +
           (customArgs.action == "loadcubelist" ? "" : "<CUBE_NAME>" + args.cube + "</CUBE_NAME>") + "</RestrictionList></Restrictions><Properties><PropertyList><Catalog>" + args.catalog + "</Catalog><LocaleIdentifier>" + conStr.LCID + "</LocaleIdentifier> </PropertyList></Properties></Discover></Body></Envelope>";
            customArgs.action = "loadFieldElements";
            this.doAjaxPost("POST", conStr.url, { XMLA: xmlMsg }, successMethod, null, customArgs);
        },        

        updateTreeView: function (treeViewObj) {
            for (var i = 0; i < treeViewObj.element.find(".editorTreeView").find("li").length; i++) {
                for (var j = 0; j < treeViewObj._memberTreeObj.dataSource().length; j++) {
                    if (treeViewObj.element.find(".editorTreeView").find("li")[i].id == treeViewObj._memberTreeObj.dataSource()[j].id && ($(treeViewObj.element.find(".editorTreeView").find("li")[i]).find("span:first").attr('aria-checked') == "mixed" || $(treeViewObj.element.find(".editorTreeView").find("li")[i]).find("span:first").attr('aria-checked') == "true")) {
                        treeViewObj._memberTreeObj.dataSource()[j].checkedStatus = true;
                        break;
                    }
                    else if (treeViewObj.element.find(".editorTreeView").find("li")[i].id == treeViewObj._memberTreeObj.dataSource()[j].id && $(treeViewObj.element.find(".editorTreeView").find("li")[i]).find("span:first").attr('aria-checked') == "false") {
                        treeViewObj._memberTreeObj.dataSource()[j].checkedStatus = false;
                        break;
                    }
                }
            }
            for (var i = 0; i < treeViewObj._memberTreeObj.dataSource().length; i++) {
                var memberStatus = false;
                if (treeViewObj._memberTreeObj.dataSource()[i].checkedStatus == true) {
                    for (var j = 0; j < treeViewObj._memberTreeObj.dataSource().length; j++) {
                        if (treeViewObj._memberTreeObj.dataSource()[j].hasOwnProperty("parentId") && treeViewObj._memberTreeObj.dataSource()[j].parentId == treeViewObj._memberTreeObj.dataSource()[i].id && treeViewObj._memberTreeObj.dataSource()[j].checkedStatus == true) {
                            memberStatus = true;
                            break;
                        }
                    }
                    if (!memberStatus) {
                        for (var m = 0; m < treeViewObj._memberTreeObj.dataSource().length; m++) {
                            if (treeViewObj._memberTreeObj.dataSource()[m].hasOwnProperty("parentId") && treeViewObj._memberTreeObj.dataSource()[m].parentId == treeViewObj._memberTreeObj.dataSource()[i].id)
                                treeViewObj._memberTreeObj.dataSource()[m].checkedStatus = true;
                        }
                    }
                }
                else if (treeViewObj._memberTreeObj.dataSource()[i].checkedStatus == false) {
                    for (var k = 0; k < treeViewObj._memberTreeObj.dataSource().length; k++) {
                        if (treeViewObj._memberTreeObj.dataSource()[k].hasOwnProperty("parentId") && treeViewObj._memberTreeObj.dataSource()[k].parentId == treeViewObj._memberTreeObj.dataSource()[i].id)
                            treeViewObj._memberTreeObj.dataSource()[k].checkedStatus = false;
                    }
                }
            }
            for (var i = 0; i < treeViewObj.element.find(".editorTreeView").find("li").length; i++) {
                if ($(treeViewObj.element.find(".editorTreeView").find("li")[i]).attr("tag") == null || undefined) {
                    for (var j = 0; j < treeViewObj._memberTreeObj.dataSource().length; j++) {
                        if ($(treeViewObj.element.find(".editorTreeView").find("li")[i])[0].id == treeViewObj._memberTreeObj.dataSource()[j].id) {
                            $(treeViewObj.element.find(".editorTreeView").find("li")[i]).attr("tag", treeViewObj._memberTreeObj.dataSource()[j].tag);
                            break;
                        }
                    }
                }
            }
            return treeViewObj._memberTreeObj;
        },

        getNodesState: function (treeViewObj) {
            var selectedNodes = "", unSelectedNodes = "";
            for (var i = 0; i < treeViewObj.dataSource().length; i++) {
                if (treeViewObj.dataSource()[i].checkedStatus == true)
                    selectedNodes += "::" + treeViewObj.dataSource()[i].id + "||" + treeViewObj.dataSource()[i].tag + "||" + treeViewObj.dataSource()[i].parentId + "||" + treeViewObj.dataSource()[i].name;
                else
                    unSelectedNodes += "::" + treeViewObj.dataSource()[i].parentId + "||" + treeViewObj.dataSource()[i].tag + "||" + treeViewObj.dataSource()[i].name;
            }
            return { selectedNodes: selectedNodes, unSelectedNodes: unSelectedNodes };
        },

        removeParentSelectedNodes: function (selectedNodes) {
            var selectedElements = $.extend([], selectedNodes);
            for (var i = 0; i < selectedNodes.length; i++) {
                for (var j = 0; j < selectedElements.length; j++) {
                    if (selectedElements[j].Id == selectedNodes[i].parentId)
                        selectedElements.splice(j, 1);
                }
            }
            return $.map(selectedElements, function (element, index) { if (element.tag != "" && element.tag != undefined) return element.tag.replace(/\&/g, "&amp;") });
        },

        getChildNodes: function (args, currentHierarchy, treeViewCollection, dataSource, ctrlObj) {
            var selectedItem = args.targetElement, tagInfo, cubeName = dataSource.cube, catloagName = dataSource.catalog, url = dataSource.data, successMethod = ctrlObj._generateChildMembers, childCount = $(args.currentElement).find("li").length, isLoadOnDemand = false;
            if (childCount == 0) {
                var currMember = $(selectedItem).parents("li:eq(0)").attr("id");
                var reportItem = $.map(treeViewCollection, function (obj, index) {
                    if (obj["fieldName"] == currentHierarchy && !ej.isNullOrUndefined(obj["filterItems"])) {
                        $.map(obj["filterItems"], function (obj, index) {
                            if (obj["parentId"] != undefined && obj["parentId"] == currMember.replace(/\]*\]/g, '-').replace(/\[*\[/g, '-'))
                                isLoadOnDemand = true;
                        });
                    }
                });
                isLoadOnDemand ? args.isChildLoaded = true : args.isChildLoaded = false
                if (!isLoadOnDemand) {
                    if ($(selectedItem).parents("li:eq(0)").attr("tag") == undefined) {
                        var filterItem = $.map(treeViewCollection, function (obj, index) { if (obj["fieldName"] == currentHierarchy) return obj; })[0]
                        if (filterItem)
                            $.map(filterItem["filterItems"], function (obj, index) { if (obj["id"] == $(selectedItem).parents("li:eq(0)").attr("id")) $(selectedItem).parents("li:eq(0)").attr("tag", obj["tag"]); });
                    }
                    var uniqueName = $(selectedItem).parents("li:eq(0)").attr("tag").replace(/\&/g, "&amp;");
                    ej.olap._mdxParser.getChildren(dataSource, uniqueName, ctrlObj);
                }
            }
        },
        _getFilterParams: function (droppedClass, tempFilterData, headerText) {
            var filterParams = "";
            if (droppedClass != "schemaValue") {
                var filterData = "";
                if (!ej.isNullOrUndefined(tempFilterData)) {
                    for (var i = 0; i < tempFilterData.length; i++) {
                        if (!ej.isNullOrUndefined(tempFilterData[i][headerText])) {
                            for (var j = 0; j < tempFilterData[i][headerText].length; j++) {
                                filterData += "##" + tempFilterData[i][headerText][j];
                            }
                        }
                    }
                }
                if (filterData != "")
                    filterParams = droppedClass + "::" + headerText + "::FILTERED" + filterData;
            }
            return filterParams;
        },
        generateChildMembers: function (customArgs, args) {
            var data = $(args).find("Axis:eq(0) Tuple"), treeViewData = [];
            var pNode = $("[tag='" + customArgs.currentNode.replace(/&amp;/g, "&") + "']");
            for (var i = 0; i < data.length; i++) {
                var memberUqName = $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children().children()[0]).text();
                var memberName = $($(args).find("Axis:eq(0) Tuple:eq(" + i + ")").children()).find("Caption").text();
                var treeNodeInfo = { hasChildren: $(data[i]).find("CHILDREN_CARDINALITY").text() != "0", checkedStatus: false, id: memberUqName.replace(/\]*\]/g, '-').replace(/\[*\[/g, '-'), name: memberName, tag: memberUqName }
                treeViewData.push(treeNodeInfo);
            }
            if ($(pNode).parents("li").length > 1)
                parentNode = $(pNode).parents("li").first();
            else
                parentNode = $(pNode).parents("li");
            pNode.find(".e-load").removeClass("e-load");
            $($(parentNode).find('input.nodecheckbox')[0]).ejCheckBox({ checked: false })
            this._memberTreeObj = $(".editorTreeView").data("ejTreeView");
            this._memberTreeObj.addNode(treeViewData, $(pNode));
            $.each(pNode.find("li"), function (index, value) { value.setAttribute("tag", treeViewData[index].tag); });
        },

        createAdvanceFilterTag: function (args, ctrlObj) {
            var filterTag = "", seperator = ej.buildTag("li.e-separator").css("margin-left", "29px")[0].outerHTML;
            if (args.action == "valueFiltering") {
                filterTag = ej.buildTag("ul.filterElementTag#valueFilterBtn",
                        ej.buildTag("li", ej.buildTag("a", ctrlObj._getLocalizedLabels("ValueFilters"))[0].outerHTML +
                        ej.buildTag("ul.elements",
                        ej.buildTag("li.clearFilter", ej.buildTag("a", ej.buildTag("span.e-clrFilter").addClass("e-icon").attr("aria-label", "clear filter")[0].outerHTML + ctrlObj._getLocalizedLabels("ClearFilter"))[0].outerHTML)[0].outerHTML + seperator +
                        ej.buildTag("li.equals", ej.buildTag("a", ctrlObj._getLocalizedLabels("Equals"))[0].outerHTML)[0].outerHTML +
                        ej.buildTag("li.notequals", ej.buildTag("a", ctrlObj._getLocalizedLabels("NotEquals"))[0].outerHTML)[0].outerHTML + seperator +
                        ej.buildTag("li.greaterthan", ej.buildTag("a", ctrlObj._getLocalizedLabels("GreaterThan"))[0].outerHTML)[0].outerHTML +
                        ej.buildTag("li.greaterthanorequalto", ej.buildTag("a", ctrlObj._getLocalizedLabels("GreaterThanOrEqualTo"))[0].outerHTML)[0].outerHTML +
                        ej.buildTag("li.lessthan", ej.buildTag("a", ctrlObj._getLocalizedLabels("LessThan"))[0].outerHTML)[0].outerHTML +
                        ej.buildTag("li.lessthanorequalto", ej.buildTag("a", ctrlObj._getLocalizedLabels("LessThanOrEqualTo"))[0].outerHTML)[0].outerHTML + seperator +
                        ej.buildTag("li.between", ej.buildTag("a", ctrlObj._getLocalizedLabels("Between"))[0].outerHTML)[0].outerHTML +
                        ej.buildTag("li.notbetween", ej.buildTag("a", ctrlObj._getLocalizedLabels("NotBetween"))[0].outerHTML)[0].outerHTML +
                        (((!ej.isNullOrUndefined(ctrlObj.model.pivotControl) && ctrlObj.model.pivotControl.model.operationalMode == ej.Pivot.OperationalMode.ServerMode) || (ctrlObj.model.operationalMode && ctrlObj.model.operationalMode == ej.Pivot.OperationalMode.ServerMode)) ?
                        (seperator + ej.buildTag("li.topCount", ej.buildTag("a", ctrlObj._getLocalizedLabels("Top10"))[0].outerHTML)[0].outerHTML) : "")
                        )[0].outerHTML)[0].outerHTML)[0].outerHTML;
            }
            else if (args.action == "labelFiltering") {
                filterTag = ej.buildTag("ul.filterElementTag#labelFilterBtn",
                         ej.buildTag("li", ej.buildTag("a", ctrlObj._getLocalizedLabels("LabelFilters"))[0].outerHTML +
                         ej.buildTag("ul.elements",
                         ej.buildTag("li.clearFilter", ej.buildTag("a", ej.buildTag("span.e-clrFilter").addClass("e-icon").attr("aria-label", "clear filter")[0].outerHTML + ctrlObj._getLocalizedLabels("ClearFilter"))[0].outerHTML)[0].outerHTML + seperator +
                         ej.buildTag("li.equals", ej.buildTag("a", ctrlObj._getLocalizedLabels("Equals"))[0].outerHTML)[0].outerHTML +
                         ej.buildTag("li.notequals", ej.buildTag("a", ctrlObj._getLocalizedLabels("NotEquals"))[0].outerHTML)[0].outerHTML + seperator +
                         ej.buildTag("li.beginswith", ej.buildTag("a", ctrlObj._getLocalizedLabels("BeginsWith"))[0].outerHTML)[0].outerHTML +
                         ej.buildTag("li.notbeginswith", ej.buildTag("a", ctrlObj._getLocalizedLabels("NotBeginsWith"))[0].outerHTML)[0].outerHTML +
                         ej.buildTag("li.endswith", ej.buildTag("a", ctrlObj._getLocalizedLabels("EndsWith"))[0].outerHTML)[0].outerHTML +
                         ej.buildTag("li.notendswith", ej.buildTag("a", ctrlObj._getLocalizedLabels("NotEndsWith"))[0].outerHTML)[0].outerHTML + seperator +
                         ej.buildTag("li.contains", ej.buildTag("a", ctrlObj._getLocalizedLabels("Contains"))[0].outerHTML)[0].outerHTML +
                         ej.buildTag("li.notcontains", ej.buildTag("a", ctrlObj._getLocalizedLabels("NotContains"))[0].outerHTML)[0].outerHTML + seperator +
                         ej.buildTag("li.greaterthan", ej.buildTag("a", ctrlObj._getLocalizedLabels("GreaterThan"))[0].outerHTML)[0].outerHTML +
                         ej.buildTag("li.greaterthanorequalto", ej.buildTag("a", ctrlObj._getLocalizedLabels("GreaterThanOrEqualTo"))[0].outerHTML)[0].outerHTML +
                         ej.buildTag("li.lessthan", ej.buildTag("a", ctrlObj._getLocalizedLabels("LessThan"))[0].outerHTML)[0].outerHTML +
                         ej.buildTag("li.lessthanorequalto", ej.buildTag("a", ctrlObj._getLocalizedLabels("LessThanOrEqualTo"))[0].outerHTML)[0].outerHTML
                         )[0].outerHTML)[0].outerHTML)[0].outerHTML;
            }
            else if (args.action == "clearFilter") {
                filterTag = ej.buildTag("div.clearSorting", ej.buildTag("span.e-clrSort", "", { "padding": "0px 10px 0px 4px" }).addClass("e-icon").attr("aria-label", "clear sort")[0].outerHTML + ej.buildTag("span.clearSortText", "Clear Sorting", { "padding": "5px 0px" })[0].outerHTML)[0].outerHTML + ej.buildTag("div.separator", { "padding": "5px 0px" })[0].outerHTML +
                           ej.buildTag("div.clearAllFilters", ej.buildTag("span.e-clrFilter", "", { "padding": "0px 10px 0px 4px" }).addClass("e-icon").attr("aria-label", " clear filter")[0].outerHTML + ej.buildTag("span.clearFltrText", "Clear Filter From \"" + args.selectedLevel.text + "\"", { "padding": "5px 0px" })[0].outerHTML)[0].outerHTML;
            }
            else if (args.action == "sort") {
                filterTag = ej.buildTag("div#sortDiv.sortDiv",
                            ej.buildTag("li#ascOrder.ascOrder", ej.buildTag("span.ascImage").addClass("e-icon").attr("aria-label", "ascending")[0].outerHTML + ctrlObj._getLocalizedLabels("Sort") + " A to Z")[0].outerHTML +
                            ej.buildTag("li#descOrder.descOrder", ej.buildTag("span.descImage").addClass("e-icon").attr("aria-label", "descending")[0].outerHTML + ctrlObj._getLocalizedLabels("Sort") + " Z to A")[0].outerHTML)[0].outerHTML;
            }
            else if (args.action == "labelFilterDlg" || args.action == "valueFilterDlg") {

                var dialogContent = "", dropdownValues = [];
                if (args.action == "labelFilterDlg") {
                    dialogContent = ej.buildTag("table.labelfilter",
                                            ej.buildTag("tr", ej.buildTag("td", ctrlObj._getLocalizedLabels("LabelFilterLabel")).attr("colspan", "2")[0].outerHTML)[0].outerHTML +
                                            ej.buildTag("tr", ej.buildTag("td", "<input type='text' id='filterOptions' class='filterOptions'  style='width:220px'/>")[0].outerHTML +
                                            ej.buildTag("td.filterValuesTd", "<input type='text' id='filterValue1'  value='" + (args.filterInfo.length > 0 ? args.filterInfo[0].value1 : "") + "' style='display:inline; width:160px; height:19px; margin-left:7px;' class='filterValues'/></br>")[0].outerHTML)[0].outerHTML)[0].outerHTML;

                    dropdownValues = [{ value: "equals", option: ctrlObj._getLocalizedLabels("Equals") },
                                          { value: "not equals", option: ctrlObj._getLocalizedLabels("NotEquals") },
                                          { value: "begins with", option: ctrlObj._getLocalizedLabels("BeginsWith") },
                                          { value: "not begins with", option: ctrlObj._getLocalizedLabels("NotBeginsWith") },
                                          { value: "ends with", option: ctrlObj._getLocalizedLabels("EndsWith") },
                                          { value: "not ends with", option: ctrlObj._getLocalizedLabels("NotEndsWith") },
                                          { value: "contains", option: ctrlObj._getLocalizedLabels("Contains") },
                                          { value: "not contains", option: ctrlObj._getLocalizedLabels("NotContains") },
                                          { value: "greater than", option: ctrlObj._getLocalizedLabels("GreaterThan") },
                                          { value: "greater than or equal to", option: ctrlObj._getLocalizedLabels("GreaterThanOrEqualTo") },
                                          { value: "less than", option: ctrlObj._getLocalizedLabels("LessThan") },
                                          { value: "less than or equal to", option: ctrlObj._getLocalizedLabels("LessThanOrEqualTo") },
                    ];
                }
                else {
                    var measureNames = new Array(), innerContent, colSpan = ($(args["selectedArgs"].element).hasClass("between") || $(args["selectedArgs"].element).hasClass("notbetween") || (args["selectedArgs"].value == "between" || args["selectedArgs"].value == "not between")) ? "4" : "3";
                    if (ctrlObj.element.find(".cubeTreeView ").length > 0) {
                        measureNames = $.map(ctrlObj.element.find(".cubeTreeView [tag*='[Measures]'] "), function (currentElement, index) { return { option: $(currentElement).text(), value: $(currentElement).attr("tag") } });
                    }
                    else {
                        var pvtBtns = ctrlObj.element.find(".groupingBarPivot .values .pivotButton");
                        pvtBtns = (ctrlObj._schemaData && pvtBtns.length == 0) ? $(ctrlObj._schemaData.element.find(".schemaValue .pivotButton")) : pvtBtns;
                        for (i = 0; i < pvtBtns.length; i++) {
                            measureNames.push({ "option": $(pvtBtns[i]).text(), "value": $(pvtBtns).attr("tag").split(":")[1] });
                        }
                    }
                    innerContent = !($(args["selectedArgs"].element).hasClass("topCount")) ?
                                     (ej.buildTag("td", "<input type='text' id='filterMeasures' class='filterMeasures' />").attr("width", "180px")[0].outerHTML +
                                     ej.buildTag("td", "<input type='text' id='filterOptions' class='filterOptions'/>").attr("width", "180px")[0].outerHTML +
                                     ej.buildTag("td.filterValuesTd", "<input type='text' id='filterValue1' value='" + (args.filterInfo.length > 0 ? args.filterInfo[0].value1 : "") + "' style='display:inline; width:190px; height:19px;' class='filterValues'/>" + (colSpan == "4" ? "<span> and </span><input type='text' id='filterValue2' value='" + (args.filterInfo.length > 0 ? args.filterInfo[0].value2 : "") + "' style='display:inline; width:190px; height:19px;' class='filterValues'/> </br>" : "</br>"))[0].outerHTML) :

                                     ej.buildTag("td", "<input type='text' id='filterOptions' class='filterOptions' />").attr("width", "80px")[0].outerHTML +
                                     ej.buildTag("td", "<input type='text' id='filterValue1' class='filterValues' />").attr("width", "50px")[0].outerHTML +
                                     ej.buildTag("td", "<input type='text' id='filterMeasures' class='filterMeasures' />").attr("width", "180px")[0].outerHTML;

                    dialogContent = ej.buildTag("table.valuefilter",
                                     ej.buildTag("tr", ej.buildTag("td", (ctrlObj._getLocalizedLabels("ValueFilterLabel"))).attr("colspan", (args.text == "Between" ? "4" : "3"))[0].outerHTML)[0].outerHTML +
                                     ej.buildTag("tr", innerContent)[0].outerHTML)[0].outerHTML;

                    dropdownValues = [{ value: "equals", option: ctrlObj._getLocalizedLabels("Equals") },
                                      { value: "not equals", option: ctrlObj._getLocalizedLabels("NotEquals") },
                                      { value: "greater than", option: ctrlObj._getLocalizedLabels("GreaterThan") },
                                      { value: "greater than or equal to", option: ctrlObj._getLocalizedLabels("GreaterThanOrEqualTo") },
                                      { value: "less than", option: ctrlObj._getLocalizedLabels("LessThan") },
                                      { value: "less than or equal to", option: ctrlObj._getLocalizedLabels("LessThanOrEqualTo") },
                                      { value: "between", option: ctrlObj._getLocalizedLabels("Between") },
                                      { value: "not between", option: ctrlObj._getLocalizedLabels("NotBetween") }];
                }
                var dialogFooter = ej.buildTag("div", ej.buildTag("button#filterDlgOKBtn.dialogOKBtn", "OK")[0].outerHTML + ej.buildTag("button#filterDlgCancelBtn.dialogCancelBtn", "Cancel")[0].outerHTML, { "float": "right", "margin": "8px 0 6px" })[0].outerHTML;
                ctrlObj.element.find(".e-dialog").remove();
                $(ej.buildTag("div#filterDialog.filterDialog", dialogContent + dialogFooter, { "opacity": "1" })).appendTo("#" + ctrlObj._id);
                ctrlObj.element.find(".filterDialog").ejDialog({ enableResize: false, width: "auto", content: "#" + ctrlObj._id, close: ej.proxy(ej.Pivot.closePreventPanel, ctrlObj) });
                if (args.action == "valueFilterDlg") {
                    ctrlObj.element.find(".filterMeasures").ejDropDownList({ dataSource: measureNames, width: "180px", height: "25px", fields: { text: "option", value: "value" } });
                    var ddlTarget1 = ctrlObj.element.find('.filterMeasures').data("ejDropDownList");

                    var selectedMeasure = measureNames.length > 0 ? measureNames[0].value : (args.filterInfo.length > 0) ? args.filterInfo[0].measure : ""
                    if (selectedMeasure != "")
                        ddlTarget1.selectItemByValue(selectedMeasure);
                }

                if ($(args["selectedArgs"].element).hasClass("topCount")) {
                    ctrlObj.element.find("#filterOptions").ejDropDownList({
                        dataSource: [{ option: "Top", value: "topCount" }, { option: "Bottom", value: "BottomCount" }],
                        fields: { text: "option", value: "value" },
                        value: (args.filterInfo.length > 0) ? args.filterInfo[0]["operator"] : "topCount"
                    });
                    ctrlObj.element.find("#filterValue1").ejNumericTextbox({ value: (args.filterInfo.length > 0) ? parseInt(args.filterInfo[0].value1) : 5, minValue: 1 });
                }
                else {
                    ctrlObj.element.find(".filterOptions").ejDropDownList({
                        dataSource: dropdownValues, width: "180px",
                        height: "25px", fields: { value: "value", text: "option", },
                        text: args.selectedArgs.text,
                        change: ej.proxy(ctrlObj._filterOptionChanged, ctrlObj)
                    });
                }
                ctrlObj.element.find("#filterDlgOKBtn").ejButton({ click: ej.proxy(ctrlObj._filterElementOkBtnClick, ctrlObj) });
                ctrlObj.element.find("#filterDlgCancelBtn").ejButton({
                    type: ej.ButtonType.Button, click: function () {
                        $(".e-dialog").hide();
                        //var pGridObj = $(ctrlObj.element).parents(".e-pivotgrid").data("ejPivotGrid");
                        //pGridObj = (ej.isNullOrUndefined(pGridObj) && !ej.isNullOrUndefined(ctrlObj._onPreventPanelClose)) ? ctrlObj : pGridObj;
                        //pGridObj._onPreventPanelClose();
                    }
                });
                ctrlObj.element.find(".e-titlebar").prepend(ej.buildTag("div", (args.action == "valueFilterDlg" ? "Value Filter (" : "Label Filter (") + ctrlObj._selectedLevelUniqueName.split('.')[2].replace(/\[/g, '').replace(/\]/g, '') + ")", { "display": "inline" }));
            }
            return filterTag;
        }
    }
    ej.Pivot.SortOrder = {
        None: "none",
        Ascending: "ascending",
        Descending: "descending"
    }

    ej.Pivot.AdvancedFilterType = {
        LabelFilter: "label",
        ValueFilter: "value"
    }

    ej.Pivot.ValueFilterOptions = {
        None: "none",
        Equals: "equals",
        NotEquals: "notequals",
        GreaterThan: "greaterthan",
        GreaterThanOrEqualTo: "greaterthanorequalto",
        LessThan: "lessthan",
        LessThanOrEqualTo: "lessthanorequalto",
        Between: "between",
        NotBetween: "notbetween"
    }

    ej.Pivot.LabelFilterOptions = {
        None: "none",
        BeginsWith: "beginswith",
        NotBeginsWith: "notbeginswith",
        EndsWith: "endswith",
        NotEndsWith: "notendswith",
        Contains: "contains",
        NotContains: "notcontains",
        Equals: "equals",
        NotEquals: "notequals",
        GreaterThan: "greaterthan",
        GreaterThanOrEqualTo: "greaterthanorequalto",
        LessThan: "lessthan",
        LessThanOrEqualTo: "lessthanorequalto",
        Between: "between",
        NotBetween: "notbetween"

    }
    ej.Pivot.AnalysisMode = {
        Olap: "olap",
        Pivot: "pivot"
    };
    ej.Pivot.OperationalMode = {
        ClientMode: "clientmode",
        ServerMode: "servermode"
    };
})(jQuery, Syncfusion);;

});