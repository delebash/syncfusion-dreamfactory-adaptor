/*!
*  filename: ej.listview.js
*  version : 14.2.0.26
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/
(function (fn) {
    typeof define === 'function' && define.amd ? define(["jsrender","./../common/ej.core","./../common/ej.data","./../common/ej.scroller","./../common/ej.touch","./ej.checkbox"], fn) : fn();
})
(function () {
	
/**
* @fileOverview Plugin to style the Html ListView elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejListViewBase", "ej.ListViewBase", {
        _addToPersist: ["selectedItemIndex", "checkedIndices"],
        defaults: {
            
            height: null,

            width: null,

            selectedItemIndex: -1,

            enableGroupList: false,
            
            enableAjax: false,
            
            enableCache: false,
            
            enablePersistence: false,
            
            load: null,
            
            loadComplete: null,
            
            ajaxBeforeLoad: null,

            ajaxSuccess: null,

            ajaxError: null,

            ajaxComplete: null,

            ajaxSettings: {
                type: 'GET',
                cache: false,
                async: true,
                dataType: "html",
                contentType: "html",
                url: "",
                data: {}
            },
                                    
            renderTemplate: false,

            templateId: null,

            persistSelection: false,

            preventSelection: false,

            dataSource: [],

            query: null,

            showHeader: false,
			
			showHeaderBackButton: false,

            cssClass: "",

            headerTitle: "Title",

            headerBackButtonText: null,

            enableFiltering: false,

            enableCheckMark: false,

            checkedIndices :[]

        },

        observables: ["selectedItemIndex", "dataSource"],
        selectedItemIndex: ej.util.valueFunction("selectedItemIndex"),
        dataSource: ej.util.valueFunction("dataSource"),
        checkedIndices: ej.util.valueFunction("checkedIndices"),

        _updateModelItems: function () {
            this.model.items = eval(this.model.items);
            var ang_attr = this.model.items;
            if (ang_attr.length) {
                var ul = ej.buildTag("ul.e-m-clearall");
                for (i = 0; i < ang_attr.length; i++) {
                    ang_attr[i].items = [];
                    var ang_li = ej.buildTag("li");
                    if (this.model.items[i].template)
                        ang_li.html(this.model.items[i].template);
                    if (!this.model.items[i].childId && this.model.items[i].href)
                        this.model.items[i].childId = ("page_" + parseInt(Math.random().toFixed(3) * 1000));
                    if (this.model.items[i].renderTemplate) {
                        if (!this._storedTemplate[i]) {
                            if (this.model.items[i].templateId) {
                                var ele = this._tempContent.find('#' + this.model.items[i].templateId).remove();
                                this._storedTemplate[i] = ele[0].nodeName && ele[0].nodeName.toLowerCase() == "script" ? ej.getClearString(ele[0].innerHTML) : ele[0].outerHTML;
                            }
                            else
                                this._storedTemplate[i] = this.model.items[i].template;
                            this.model.items[i].templateId = this._storedTemplate[i];
                        }
                    }
                    if (this.model.fieldSettings)
                        this.model.fieldSettings = $.extend(this.defaults.fieldSettings, this.model.fieldSettings);
                    ul.append(ang_li);
                }
                this.element.append(ul)
            }
            else {
                var ul = this.element.find(">ul");
                var groupid = 1;
                for (ulindex = 0; ulindex < ul.length; ulindex++) {
                    this._listitems = $(ul[ulindex]).find(">li");
                    for (index = 0; index < this._listitems.length; index++) {
                        var element = this._listitems[index];
                        if ((ej.getAttrVal(element, "data-ej-primarykey") == null) && ($(element).find("ul").length)) {
                            var primaryKey = Math.round(Math.random() * 100);
                            $(element).attr("data-ej-primarykey", primaryKey);
                        }
                        else
                            primaryKey = "";
                        var groupTitle = ej.getAttrVal($(ul[ulindex]), "data-ej-grouplistitle") ? ej.getAttrVal($(ul[ulindex]), "data-ej-grouplistitle") : "GroupList" + groupid;
                        this.model.items.push(this._itemsObjectCollection($(this._listitems[index]), primaryKey, null, groupTitle));
                        this._nestedListitems = $(this._listitems[index]).find("ul >li");
                        for (index1 = 0; index1 < this._nestedListitems.length; index1++) {
                            var element1 = this._nestedListitems[index1];
                            if ((ej.getAttrVal(element1, "data-ej-primarykey") == null) && ($(element1).find("ul").length)) {
                                var primaryKey = Math.round(Math.random() * 100);
                                $(element1).attr("data-ej-primarykey", primaryKey);
                            }
                            else
                                primaryKey = "";
                            var parentPrimaryKey = ej.getAttrVal($($(element1).parent()).closest("li"), "data-ej-primarykey");
                            this.model.items.push(this._itemsObjectCollection($(this._nestedListitems[index1]), primaryKey, parentPrimaryKey, groupTitle));
                        }
                    }
                    groupid++;
                }
            }
        },

        _load: function () {
            this._orgEle = this.element.clone();
            this._index = 0;
            this._items = [];
            this._checkedValues = [];
            this._checkedValues = this.model.checkedIndices;
            this.model.id = this.element[0].id;
            if (this.model.load)
                this._trigger("load");
            this.model.fieldSettings = eval(this.model.fieldSettings);
            if (this.model.fieldSettings && this.model.query != null) {
                this._dataUrl = this.model.dataSource;
                var proxy = this;
                if (proxy._prefixClass == "e-m-")
                    App.waitingPopUp.show();
                this.dataSource().executeQuery(eval(this.model.query)).done(function (e) {
                    proxy.model.dataSource = e.result;
                    proxy._renderControl();
                    if (proxy._prefixClass == "e-m-")
                        App.waitingPopUp.hide();
                });
            }
            else
                this._renderControl();
        },
        
        
        _renderControl: function () {
            this.element.addClass(this._prefixClass + "parentlv " + this.model.cssClass);
            this._lbEle = ej.buildTag("div." + this._rootCSS);
            this._lbEle.addClass("subpage");
            if (this._prefixClass == "e-m-") {
                this._lbEle.addClass("e-m-" + this.model.renderMode + " e-m-" + this.model.theme);
                if (this.model.ios7.inline)
                    this._lbEle.addClass("e-m-inline")
            }
            this._lContainer = ej.buildTag("div." + this._prefixClass + "list-container#" + this.model.id + "_container");
            if (this._prefixClass == "e-m-" && this.model.enablePullToRefresh) {
                this._refreshContainer = ej.buildTag("div." + this._prefixClass + "ptr-container");
                this._ptrImgContainer = ej.buildTag("span." + this._prefixClass + "image-container " + this._prefixClass + "pull");
                this._textContainer = ej.buildTag("span." + this._prefixClass + "text-container");
                this._refreshContainer.append(this._ptrImgContainer).append(this._textContainer);
                this._lContainer.find("div:first").append(this._refreshContainer);
                this._textContainer.html(this.model.pullToRefreshSettings.pullText)
            }
            if (this._hasDataSource()) 
                var ul = this.element.find(">ul");
            else
                var ul = this.element.find("ul:first");
            if (this.model.showHeader) {
                var hdr = this._renderHeader(this.model.id, this.model.showHeaderBackButton, this.model.headerTitle, this.model.headerBackButtonText);
                this._lbEle.prepend(hdr);
            }
            if (this._prefixClass == "e-m-")
                if (this.model.allowScrolling)
                    this._renderScrollPanel(this._lbEle, this.model.id + "_scroll", this.model.id + "_container");
            if (this._hasDataSource() && !this.model.renderTemplate)
                this.element.empty();
            if (this.model.renderTemplate) {
                if (this.model.templateId) {
                    if (this._tempContent.find('#' + this.model.templateId).length) {
                        this._template = this._tempContent.find('#' + this.model.templateId);
                        ej.destroyWidgets(this._template);
                        if (this._template[0].nodeName.toLowerCase() != "script")
                            this._template.remove();
                        this._template = this._template[0].nodeName && this._template[0].nodeName.toLowerCase() == "script" ? ej.getClearString(this._template[0].innerHTML) : this._template[0].outerHTML;
                    }
                }
                else {
                    ej.destroyWidgets(this.element);
                    this._template = this.element.html();
                    this.element.empty();
                }
            }
            if (this.model.renderTemplate && !this._hasDataSource() && !this.model.enableGroupList) {
                this.element.append(this._lbEle.append(this._lContainer));
                if (this._template) {
                    this._lContainer.append(this._template);
                    if (ej.widget.init)
                        ej.widget.init(this._lContainer);
                }
            }
            else if (!this.model.renderTemplate || this.model.renderTemplate && this._hasDataSource() || this.model.renderTemplate && this.model.enableGroupList) {
                this._model_index = 0;
                if (this.model.enableGroupList) {
                    this._lContainer.addClass(this._prefixClass + "grouped");
                    var innerDiv = ej.buildTag("div." + this._prefixClass + "grouplist");
                    ul = this.element.children();
                    if (ul.length || this.dataSource().length) {
                        if (this.dataSource().length)
                            var group = ej.DataManager(this.dataSource()).executeLocal(ej.Query().from(this.dataSource()).group(this.model.fieldSettings['groupID']));
                        else
                            var group = ej.DataManager(this.model.items).executeLocal(ej.Query().from(this.model.items).group(this.model.fieldSettings['groupID']));
                        var length = group.length;
                        var title;
                        for (var i = 0; i < length; i++) {
                            this._items = group[i].items;
                            if (this._hasDataSource()) {
                                ulItem = ej.buildTag('ul', "", {}, { "data-ej-grouplisttitle": group[i].key });
                                this._lbEle.append(ulItem);
                            }
                            else
                                ulItem = ul[i];
                            title = this._hasDataSource() ? group[i].key : ej.getAttrVal($(ulItem), 'data-ej-grouplisttitle', "GroupList" + (i + 1));
                            $(ulItem).attr("data-ej-grouplisttitle", title);
                            var groupdiv = ej.buildTag("div." + this._prefixClass + "groupdiv", ej.buildTag("div." + this._prefixClass + "grouptitle", title));
                            innerDiv.append(groupdiv.append(this._renderListItems($(ulItem).addClass(this._prefixClass + "grouped"))));
                        }
                    }
                    else if (this._template) {
                        ej.destroyWidgets(this._template);
                        innerDiv[0].innerHTML = this._template;
                    }
                    this._prefixClass == "e-m-" ? this._lContainer.find("div:first").append(innerDiv) : this._lContainer.append(innerDiv);
                    if (ej.widget.init)
                        ej.widget.init(innerDiv);
                }
                else {
                    if (this._hasDataSource()) {
                        var ul = ej.buildTag('ul');
                        this._items = this.dataSource();
                        this._items = eval(this._items);
                        for (j = 0; j < this._items.length; j++) {
                            if (this._items[j].href && !this._items[j].childId) {
                                this._items[j].childId = ("page_" + parseInt(Math.random().toFixed(3) * 1000));
                            }
                        }
                    }
                    if (ul.length) {
                        ej.destroyWidgets(ul);
                        this._prefixClass == "e-m-" ? this._lContainer.find("div:first").append(this._renderListItems(ul)) : this._lContainer.append(this._renderListItems(ul));
                    }
                    else if (this._template) {
                        ej.destroyWidgets(this._template);
                        this._lContainer[0].innerHTML = this._template;
                    }
                }
                this.element.prepend(this._lbEle);
                if (this.model.enableFiltering)
                    this._createFilterWrapper(this._lbEle);
				this._setHeightWidth();
				this._lContainer.ejScroller({
                       height: this._lContainer.outerHeight(),
                       width: 0,
                       scrollerSize: 20
                });
			    this.scrollerObj = this._lContainer.ejScroller("instance");
                this._lbEle.append(this._lContainer);
                if (ej.widget.init)
                    ej.widget.init(this._lContainer);
                if (this._prefixClass == "e-m-" && (App.angularAppName || ej.angular.defaultAppName))
                    ej.angular.compile(this._lContainer)
                var eLi = this.element.find('li.' + this._prefixClass + 'list');
                eLi.removeEleEmptyAttrs();
                eLi.find('.' + this._prefixClass + 'chevron-right_01').removeEleEmptyAttrs();
                if (ej.widget.init)
                    ej.widget.init(this._lbEle);
                var ulItems = this.element.find('ul');
                ulItems.find('li:first').addClass(this._prefixClass + "firstitem");
                ulItems.find('li:last').addClass(this._prefixClass + "lastitem");
                this._liEl = this.element.find("li");
                if (this.selectedItemIndex() >= 0 && !this.model.preventSelection && this.model.persistSelection) {
                    if (!ej.getBooleanVal(ulItems[this.selectedItemIndex()], 'data-preventselection', this.model.preventSelection) && ej.getBooleanVal(ulItems[this.selectedItemIndex()], 'data-persistselection', this.model.persistSelection)) {
                        this._currentItem = $(this._liEl[this.selectedItemIndex()]);
                        this._prevItem = this._currentItem;
                        this._currentItem.removeClass(this._prefixClass + "state-default").addClass(this._prefixClass + "state-active");
                    }
                }

                $(this.element.find('.' + this._prefixClass + 'lv-check').parent()).addClass(this._prefixClass + 'lv-checkdiv');
                $(this.element.find('.' + this._prefixClass + 'lv-check').closest('li.' + this._prefixClass + 'list')).addClass(this._prefixClass + 'list-check');
                $(this.element.find('.' + this._prefixClass + 'lv-input').closest('.' + this._prefixClass + 'lv-filter')).addClass(this._prefixClass + 'lv-inputdiv');
                this._wireEvents();
            }
            if (this._prefixClass == "e-m-" && (App.angularAppName || ej.angular.defaultAppName))
                ej.angular.compile(this._lbEle);
            this._setHeightWidth();
			if (this.model.height !== null) 
				if (this._lContainer.height() > this.model.height)
					this._refreshScroller(this._lContainer,false);
			if (this.scrollerObj) {
				this.scrollerObj.refresh();
				$(this.scrollerObj.element).find(".e-vhandlespace").css("height",($(this.scrollerObj.element).find(".e-vhandlespace").height() -1));
			}
            if (this._prefixClass == "e-m-")
                this.element.find("li[data-href]").addClass("e-m-arrow").find("a.e-m-list-anchor").addClass("e-m-fontimage");
            if (this.model.loadComplete)
                this._trigger("loadComplete");
        },

        
        
        _createFilterWrapper: function (element) {
            var fDiv = this._createFilterDiv();
            var fAnchor = ej.buildTag("a." + this._prefixClass + "lv-anchor", ej.buildTag('span.' + this._prefixClass + 'input-btn'), {}, { "Title": "Clear text", "data-role": "none" });
            $(fDiv).append(fAnchor);
            element.append(fDiv);
        },
        
		_refreshScroller: function (container,isChild) {
			container.find(".e-vhandle div").removeAttr("style");
			if(isChild)
				hgt = this.model.showHeader && this.model.enableFiltering ? this.model.height - ((ej.getDimension(this._lbEle.find('.' + this._prefixClass + 'header'), 'outerHeight')) + (ej.getDimension($(id).find('.' + this._prefixClass + 'lv-filter'), 'outerHeight'))) - 2 : this.model.showHeader ? this.model.height - ej.getDimension(this._lbEle.find('.' + this._prefixClass + 'header'), 'outerHeight') - 2 : this.model.enableFiltering ? this.model.height - (ej.getDimension($(id).find('.' + this._prefixClass + 'lv-filter'), 'outerHeight')) - 2 : this.model.height - 2;
			else
				hgt = this.model.showHeader && this.model.enableFiltering ? this.model.height - ((ej.getDimension(this._lbEle.find('.' + this._prefixClass + 'header'), 'outerHeight')) + ($('.' + this._prefixClass + 'lv-filter').height())) - 2 : this.model.showHeader ? this.model.height - ej.getDimension(this._lbEle.find('.' + this._prefixClass + 'header'), 'outerHeight') - 2 : this.model.enableFiltering ? this.model.height - $('.' + this._prefixClass + 'lv-filter').height() - 2 : this.model.height - 2;
			if (this.scrollerObj) {
                    this.scrollerObj.model.height = hgt;
			}
			
        },
        
        _renderListItems: function (ul) {
            ul.addClass(this._prefixClass + "list-hdr " + this._prefixClass + "clearall");
            this._liItems = ul.find("li");
            if (this._liItems.length && !this._hasDataSource() || this._hasDataSource()) {
                this._renderParentChildTemplate();
                if (!this._hasDataSource() && !this.model.enableGroupList) {
                    this._items = this.model.items;
                }
                var items = this._items;
                var result = this._filterParentChild(items);
                if (result.child.length)
                    this._childRendering(result.child);
                if (result.parent) {
                    ul.empty().html($(this.jsRender).render(result.parent));
                    var ulItems = ul.find('>li'), temp = "";
                    for (var j = 0; j < ulItems.length; j++) {
                        if (result.parent[j] && result.parent[j].attributes) {
                            $.each(result.parent[j].attributes, function (i, attr) {
                                if (attr && attr.name.toLowerCase() == "class") temp = $(ulItems[j]).attr('class');
                            });
							$(ulItems[j]).addEleAttrs(result.parent[j].attributes);
							$(ulItems[j]).addClass(temp);
						}
                    }
                }
            }
            if (this._initEJCheckBox)
                this._initEJCheckBox(ul);
            return ul;
        },

        _filterParentChild: function (items) {
            var dataMgr = ej.DataManager(items);
            var childItem = dataMgr.executeLocal(ej.Query().from(items).where(ej.Predicate(this.model.fieldSettings['parentPrimaryKey'], ej.FilterOperators.notEqual, null)).group(this.model.fieldSettings['parentPrimaryKey']));
            var parentItem = dataMgr.executeLocal(ej.Query().from(items).where(ej.Predicate(this.model.fieldSettings['parentPrimaryKey'], ej.FilterOperators.equal, null)));
            return { parent: parentItem, child: childItem };
        },

        _childRendering: function (grouped) {
            var proxy = this;
            if (grouped.length) {
                proxy.element.append($(proxy.jsChildRender).render(grouped));
                $.each(grouped, function (index, element) {
                    if (ej.widget.init)
                        ej.widget.init(proxy.element.find('#child' + element.key));
                    var ul = proxy.element.find('#child' + element.key).find('ul');
                    var li = ul.find('li');
                    k = 0;
                    for (var j = 0; j < li.length; j++) {
                        if (grouped[k].items[j] && grouped[k].items[j].attributes)
                            $(li[j]).addEleAttrs(grouped[k].items[j].attributes);
                    }
                    k++;
                });
            }
        },

        
        
        _renderParentChildTemplate: function () {
            var list = this._renderLists();
            $.views.helpers({ _checkAjaxUrls: this._checkAjaxUrl, _checkImgUrls: this._checkImgUrl, _checkIsChecked: this._checkIsCheck, Object: this, ej: ej });
            //Template for parent item
            this.jsRender = ej.buildTag("script#" + this.model.id + "_Template", "", {}, { "type": "text/x-jsrender" });
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 10)
                this.jsRender[0].text = list[0].outerHTML.replace(/&gt;/g, '>');
            else
                this.jsRender[0].text = list[0].outerHTML.replace(/&gt;/g, '>');
            //Template for child item
            this.jsChildRender = ej.buildTag("script#" + this.model.id + "_ChildTemplate", "", {}, { "type": "text/x-jsrender" });
            var ul = ej.buildTag("ul." + this._prefixClass + "childcontainer " + this._prefixClass + "list-hdr " + this._prefixClass + "clearall");
            list.addClass(this._prefixClass + "childli");
            ul[0].innerHTML = "{{for items}}" + list[0].outerHTML + "{{/for}}";
            var div = ej.buildTag("div." + this._rootCSS + " subpage " + this._prefixClass + "childitem", "", {}, { "id": "{{if key}}child{{>key}}{{else " + this.model.fieldSettings['childId'] + "}}{{>" + this.model.fieldSettings['childId'] + "}}{{else}}{{/if}}", "style": "display:none" });
            if (this._prefixClass == "e-m-")
                div.addClass("e-m-" + this.model.renderMode + " e-m-" + this.model.theme);
            var innerdiv = ej.buildTag("div." + this._prefixClass + "list-container", "", {}, { "id": "{{if key}}child{{>key}}{{else " + this.model.fieldSettings['childId'] + "}}{{>" + this.model.fieldSettings['childId'] + "}}{{else}}{{/if}}_container" });
            if (this.model.showHeader)
                div.append(this._renderHeader("{{if key}}child{{>key}}{{else " + this.model.fieldSettings['childId'] + "}}{{>" + this.model.fieldSettings['childId'] + "}}{{else}}{{/if}}", true, "Title"));
            if (this.model.enableFiltering)
                this._createFilterWrapper(div);
            div.append(innerdiv.append(ul));
            if (this._prefixClass == "e-m-")
                if (this.model.allowScrolling)
                    this._renderScrollPanel(div, "{{if key}}child{{>key}}{{else " + this.model.fieldSettings['childId'] + "}}{{>" + this.model.fieldSettings['childId'] + "}}{{else}}{{/if}}_scroll", "{{if key}}child{{>key}}{{else " + this.model.fieldSettings['childId'] + "}}{{>" + this.model.fieldSettings['childId'] + "}}{{else}}{{/if}}_container");
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 10)
                this.jsChildRender[0].text = div[0].outerHTML.replace(/&gt;/g, '>');
            else
                this.jsChildRender[0].innerHTML = div[0].outerHTML.replace(/&gt;/g, '>');
        },
        
        
        _renderChild: function (childId, ignoreWidth) {
            this._currentItem.attr('data-childid', childId);
            if (!this._currentItem.attr('data-childtitle'))
                this._currentItem.attr('data-childtitle', this._currentItem.text());
            this._createListDiv(childId);
            this._div.hide();
            this._container = ej.buildTag("div." + this._prefixClass + "list-container#" + childId + "_container");
            this.element.append(this._div);
            if (this.model.allowScrolling)
                this._renderScrollPanel(this._div, childId + "_scroll", childId + "_container", true);
        },

        _getText: function (element) {
            return $(element).clone()
           .children()
           .remove()
           .end()
           .text();
        },

        
        _checkImgUrl: function (item) {
            var obj = this.getRsc("helpers", "Object");
            var img = this.data[obj.model.fieldSettings.imageUrl];
            if (!$.support.pushstate)
                img = typeof App == "object" ? App.route.makeUrlAbsolute(img, true) : img;
            return "<img src = " + img + " class='" + obj._prefixClass + "list-img " + obj._prefixClass + "rel " + obj._prefixClass + "user-select'/>";
        },

        
        
        _checkAjaxUrl: function () {
            var href = this.data.href;
            var childid = this.data.childId;
            var rendertemp = this.data.renderTemplate;
            var tempid = this.data.templateId;
            var listObj = this.getRsc("helpers", "Object");
            var ej = this.getRsc("helpers", "ej");
            var content = listObj._currentPage(listObj);
            if (href && href.indexOf("#") != -1 && href != "#") {
                if (!listObj._storedContent[childid]) {
                    content.find(href).show();
                    var ele = content.find(href).clone();
                    content.find(href).hide();
                    listObj._storedContent[childid] = ele[0].nodeName && ele[0].nodeName.toLowerCase() == "script" ? ej.getClearString(ele[0].innerHTML) : ele[0].outerHTML;
                }
            }
            else {
                if (listObj._storedContent[this.index])
                    listObj._storedContent = ej._pushValue(listObj._storedContent, "", this.index);
            }

        },

        _currentPage: function (obj) {
            return obj._prefixClass == "e-m-" ? ej.getCurrentPage() : $("body");
        },
        
        _checkIsCheck: function (item) {
            return this.data[this.getRsc("helpers", "Object").model.fieldSettings.checked] ? true : false;
        },

        _onTouchStartHandler: function (evt) {
			if(($(evt.target.parentElement).hasClass(this._prefixClass + 'disable')) || ($(evt.currentTarget).hasClass(this._prefixClass + 'disable'))) 
				return false;
            if (!ej.isDevice() && !ej._preventDefaultException(evt.target, this._preventDefaultException))
                evt.preventDefault && evt.preventDefault();
            if (ej.isWindows && ej.isWindows())
                ej._touchStartPoints(evt, this);
            this._currentItem = $(evt.currentTarget);
            this._scroll = false;
            if (!ej.getBooleanVal(this._currentItem, 'data-preventSelection', this.model.preventSelection))
                this._addSelection();
            if (this.model.renderMode == "windows" && !this.model.windows.preventSkew)
                this._currentItem.addClass(ej.isMobile() ? ej._getSkewClass($(this._currentItem), evt.pageX, evt.pageY) : this._prefixClass + "m-skew-center");
            this._triggerStartEvent(this._returnData());
            ej.listenEvents([this._liEl, (this._prefixClass == "e-m-" && this.model.enablePullToRefresh) ? this.element : this._liEl, this._liEl],
                           [ej.endEvent(), ej.moveEvent(), ej.cancelEvent()],
                           [this._touchEndDelegate, this._touchMoveDelegate, this._touchMoveDelegate], false, this);
            $(window).bind(ej.endEvent() + " MSPointerUp pointerup", this._docClickDelegate);
        },
        
        
        _onTouchMoveHandler: function (evt) {
            this._isMoved = true;
            if (this._prefixClass == "e-m-" && this.model.enablePullToRefresh && !this._isRefreshing) {
                this._listScroll = this.element.find(".e-m-scroll");
                var scrollPos = this._listScroll.ejmScrollPanel("getScrollPosition").y;
                var moved = evt.changedTouches ? evt.changedTouches[0].pageY : evt.pageY;
                if (scrollPos > 0) {
                    if (this.model.refreshThreshold < moved) {
                        this._textContainer.empty().html(this.model.pullToRefreshSettings.releaseText);
                        this._ptrImgContainer.removeClass("rotatereverse").addClass("rotateimage");
                        this._isCrossed = true;
                    }
                    else {
                        if (this._ptrImgContainer.hasClass("rotateimage"))
                            this._ptrImgContainer.removeClass("rotateimage").addClass("rotatereverse");
                        this._textContainer.html(this.model.pullToRefreshSettings.pullText);
                        this._isCrossed = false;
                    }
                }
            }
            else if (!ej.isWindows || (ej.isWindows && !ej.isWindows()) || (ej.isWindows && ej.isWindows() && ej._isTouchMoved(evt, this))) {
                this._scroll = true;
                if (!ej.getBooleanVal(this._currentItem, 'data-persistSelection', this.model.persistSelection))
                    this._removeSelection();
                else if (this._prevItem && this._prevItem[0] != this._currentItem[0])
                    this._removeSelection();
                if (this.model.renderMode == "windows" && !this.model.windows.preventSkew)
                    ej._removeSkewClass(this._currentItem);
                else if (this.model.renderMode != "windows" && !ej.getBooleanVal(this._currentItem, 'data-preventselection', this.model.preventSelection) && this._prevItem && ej.getBooleanVal(this._currentItem, 'data-persistSelection', this.model.persistSelection))
                    this._prevItem.removeClass(this._prefixClass + "state-default").addClass(this._prefixClass + "state-active");
            }
        },
        
        

        _onTouchEndHandler: function (evt) {
            this._isFromAjax = false;
            if (!ej.getBooleanVal(this._currentItem, 'data-persistSelection', this.model.persistSelection))
                this._removeSelection();
            if (this.model.renderMode == "windows" && !this.model.windows.preventSkew)
                ej._removeSkewClass(this._currentItem);
            if (this._scroll) {
                this._setCurrent();
                this._unbindEvents(evt);
                return false;
            }
            else if (!this._scroll) {
                if (this._currentItem.find('.' + this._prefixClass + 'lv-check').length) {
                    var lbCheck = this._currentItem.find('.' + this._prefixClass + 'lv-check');
                    if (this._prefixClass == "e-m-" || (this._prefixClass == "e-" && !ej.isNullOrUndefined(evt) && !$(evt.target).closest('.e-lv-checkdiv').length))
                        this._toggleCheckboxValue(lbCheck);
                }
                if (this._prefixClass == "e-m-")
                    var backButton = this._currentItem.attr('data-childheaderbackbuttontext') == undefined ? this._currentItem.closest('.' + this._rootCSS + '').find('.' + this._prefixClass + 'header').length ? this._currentItem.closest('.' + this._rootCSS + '').find('.' + this._prefixClass + 'header').ejmHeader('getTitle') : "Back" : ej.getAttrVal(this._currentItem, 'data-childheaderbackbuttontext');
                else
                    var backButton = this._currentItem.attr('data-childheaderbackbuttontext') == undefined ? this._currentItem.closest('.' + this._rootCSS + '').find('.' + this._prefixClass + 'header').length ? this._currentItem.closest('.' + this._rootCSS + '').find('.' + this._prefixClass + 'header .' + this._prefixClass + 'htitle').text() : "Back" : ej.getAttrVal(this._currentItem, 'data-childheaderbackbuttontext');
                var urlVal = this._currentItem.attr('data-href');
                if (!this._currentItem.attr('data-navigateUrl')) {
                    var page = this._isInsideNavigation ? this._tempContent.find("[data-ajaxurl='" + this._convertToRelativeUrl(urlVal) + "']") : this.element.find("[data-ajaxurl='" + this._convertToRelativeUrl(urlVal) + "']");
                    if (ej.getBooleanVal(this._currentItem, 'data-loadajax', (this.model.enableAjax && typeof (urlVal) != "undefined" || !typeof (urlVal))) && (!this.model.enableCache || page.length == 0)) {
                        if (page.length)
                            page.remove();
                        if ((this._prefixClass == "e-m-" && this._currentItem.hasClass("e-m-arrow"))|| this._prefixClass != "e-m-")
                                this.loadAjaxContent(urlVal, backButton);
                        this._unbindEvents(evt);
                        if (this._isInsideNavigation && this._nearestND.model.contentId)
                            this._closeNavigation();
                        return;
                    }
                    else if (urlVal && urlVal.indexOf("#") != -1) {
                        if (this._currentPage(this).find('#' + urlVal.replace('#', '')).length) {
                            this._renderChild(ej.getAttrVal(this._currentItem, 'data-childid', "page_" + parseInt(Math.random().toFixed(3) * 1000)));
                            var content = ej.buildTag("div." + this._prefixClass + "content", this._storedContent[this._currentItem.attr('data-childid')]);
                            this._div.append(this._container.append(content));
                            if (ej.widget.init)
                                ej.widget.init(this._div);
                        }
                    }
                    this._updateContent(this._currentItem, backButton);
                    if (this._isInsideNavigation)
                        var close = this._nearestND.model.contentId ? (!this._currentItem.attr("data-childid") || this._currentItem.attr("data-href")) : !(this._currentItem.attr("data-childid") || this._currentItem.attr("data-href"));
                    if (this._isInsideNavigation && close)
                        this._closeNavigation();
                    this._touchEndEventHandler(evt);
                }
                else
                    this._touchEndEventHandler();
                this._prevItem = this._currentItem;
            }
            else if (this.model.renderMode == "windows" && !ej.isMobile())
                this._touchEndEventHandler(evt);
            this._unbindEvents(evt);
        },

        _hasValue: function (data, index) {
            for (var i = 0; i < data.length; i++) {
                if (data[i] == index) return true;
            }
        },

        _generateData: function (items, elementId) {
            var collection = ej.DataManager(items).executeLocal(ej.Query().from(this.model.dataSource).where(ej.Predicate(typeof ej.getAttrVal(this._currentItem, "data-id") == "undefined" ? this.model.fieldSettings['text'] : this.model.fieldSettings['id'], ej.FilterOperators.equal, elementId)).group(elementId))[0];
            return collection ? collection.items[0] : [];
        },


        
        _closeNavigation: function () {
            if (this._prefixClass == "e-m-")
                this.element.closest('.' + this._prefixClass + 'nb').ejmNavigationDrawer('close');
            else
                this.element.closest('.' + this._prefixClass + 'nb').ejNavigationDrawer('close');
        },

        
        _setCurrent: function (e) {
            if (this._prevItem && ej.getBooleanVal(this._currentItem, 'data-persistSelection', this.model.persistSelection)) {
                this._currentItem = this._prevItem;
                this._currentItem.removeClass(this._prefixClass + "state-default").addClass(this._prefixClass + "state-active");
            }
        },
        
        _unbindEvents: function (e) {
            if (e && e.target.nodeName && e.target.nodeName.toLowerCase() != "a") {
                
                this._scroll = false;
            }
            ej.listenEvents([this._liEl, this._liEl],
                           [ej.endEvent(), ej.moveEvent(), ej.cancelEvent()],
                           [this._touchEndDelegate, this._touchMoveDelegate, this._touchMoveDelegate], true, this);
        },
        
        
        _addSelection: function () {
            if (!this._scroll) {
                this._currentItem.closest('.' + this._prefixClass + 'list-container').find('.' + this._prefixClass + 'state-active').removeClass(this._prefixClass + "state-active").addClass(this._prefixClass + "state-default");
                this._currentItem.removeClass(this._prefixClass + "state-default").addClass(this._prefixClass + "state-active");
            }
        },
        
        
        _removeSelection: function () {
            var proxy = this;
            proxy._currentItem.removeClass(this._prefixClass + "state-active").addClass(this._prefixClass + "state-default");
        },

        
        _setHeightWidth: function () {
            if (this.model.autoAdjustHeight)
                this.element.height(window.innerHeight);
            else if (this.model.height)
                this.element.height(this.model.height);
            else {
                var hgt = this.element[0].scrollHeight ? this.element[0].scrollHeight : ej.getDimension(this._lbEle.find('.' + this._prefixClass + 'list-container'), 'outerHeight');
                this.element.height(hgt);
            }
            if (this.model.width)
                this.element.width(this.model.width);
        },
        
        
        _touchEndEventHandler: function (evt) {
            this._triggerEndEvent(this._returnData(),evt);
        },
                
        _docClick: function (evt) {
            if (this._isMoved && this._prefixClass == "e-m-" && this.model.enablePullToRefresh && this._isCrossed && !this._isRefreshing) {
                ej.listenEvents([this.element],
                         [ej.moveEvent()],
                         [this._touchMoveDelegate], true, this);
                this._refreshContainer.addClass("refreshing");
                this._ptrImgContainer.removeClass(this._prefixClass + "pull").addClass(this._prefixClass + "loading");
                this._textContainer.html(this.model.pullToRefreshSettings.refreshText);
                this._updateDataSource();
                this._ptrImgContainer.removeClass("rotateimage");
                this._isCrossed = false;
            }
            if (this._scroll) {
                this._setCurrent();
                $(document).unbind(ej.endEvent() + " MSPointerUp pointerup", this._docClickDelegate);
                ej.listenEvents([this._liEl, this._liEl],
                               [ej.endEvent(), ej.moveEvent()],
                               [this._touchEndDelegate, this._touchMoveDelegate], true, this);
                $(window).unbind(ej.endEvent() + " MSPointerUp pointerup", this._docClickDelegate);
            }
        },
        
        
        _popStateNavigation: function (evt, data) {
            if (data.pageUrl && this.model.enableFiltering)
                this._initializeFiltering($("div[data-url='" + data.pageUrl.replace('#', '') + "']"));
        },
        
        
        _anchorClickHandler: function (e) {
            if (this._scroll) {
                ej.blockDefaultActions(e);
                return false;
            }
        },
        
        _onResize: function () {
            var proxy = this;
            setTimeout(function () {
                proxy._setHeightWidth();
            }, ej.isAndroid() ? 200 : 0);
        },
        _onScrollStop: function (e) {
            ej.blockDefaultActions(e);
        },
        
        
        _createDelegates: function () {
            this._anchorClickDelegate = $.proxy(this._anchorClickHandler, this);
            this._keyup = $.proxy(this._onKeyUp, this);
            this._touchStartDelegate = $.proxy(this._onTouchStartHandler, this);
            this._touchEndDelegate = $.proxy(this._onTouchEndHandler, this);
            this._touchMoveDelegate = $.proxy(this._onTouchMoveHandler, this);
            this._resizeDelegate = $.proxy(this._onResize, this);
            this._popStateDelegate = $.proxy(this._popStateNavigation, this);
            this._docClickDelegate = $.proxy(this._docClick, this);
        },
        
        
        _wireEvents: function (remove, items) {
            var listItems = this._liEl || items;
            if (listItems) {
                this._createDelegates();
                var eventType = remove ? "unbind" : "bind";
                if (this.model.autoAdjustHeight) {
                    var evt = !ej.isDevice() && "onorientationchange" in window ? "orientationchange" : "resize";
                    ej.listenEvents([window], [evt], [this._resizeDelegate], remove, this);
                }
                ej.listenEvents([listItems.find('a'), this.element.find('.' + this._prefixClass + 'lv-input'), listItems, listItems],
                ["click", "keyup", ej.startEvent(), ej.cancelEvent()],
                [this._anchorClickDelegate, this._keyup, this._touchStartDelegate, this._touchMoveDelegate], remove, this);
                this._lContainer.on("scrollstop", $.proxy(this._onScrollStop, this));
                $('body')[eventType]('viewpopstate', this._popStateDelegate);
                if (this.model.enableFiltering)
                    this._initializeFiltering(this._lbEle);
            }
        },
        
        
        _initializeFiltering: function (element) {
            this._searchItems = $(element).find("." + this._prefixClass + "list");
            this._emptyFilterTextValue(element);
            element.find('.' + this._prefixClass + 'list[style*="display: none"]').show();
            var selector = "a";
            this._elementText = [];
            for (var i = 0; i < this._searchItems.length; i++) {
                if ($(this._searchItems[i]).find(selector))
                    this._elementText.push($.trim($(this._searchItems[i]).find(selector).html().replace(new RegExp('<[^<]+\>', 'g'), "").toLowerCase()));
                else
                    this._elementText.push("");
            }
        },
        
        
        _onKeyUp: function (evt) {
            for (var i = 0; i < this._searchItems.length; i++) {
                if (this._elementText[i].indexOf(evt.target.value.toLowerCase()) == -1)
                    $(this._searchItems[i]).css("display", "none");
                else
                    $(this._searchItems[i]).css("display", "");
            }
        },
        
        
        _setModel: function (options) {
            var refresh = false;
            for (var prop in options) {
                var setModel = "_set" + prop.charAt(0).toUpperCase() + prop.slice(1);
                if (this[setModel])
                    this[setModel](options[prop]);
                else
                    refresh = true;
            }
            if (refresh)
                this._refresh();
        },
        
        
        _setTheme: function (value) {
            if (value) {
                this.model.theme = value;
                this._lbEle.removeClass("e-m-dark e-m-light e-default").addClass("e-m-" + this.model.theme);
                if (this.model.enableFiltering)
                    this.element.find('.' + this._prefixClass + 'text-input').ejmTextBox('model.theme', this.model.theme);
                if (this.model.showHeader)
                    this._lbEle.find('#' + this.model.id + "_header").ejmHeader('model.theme', this.model.theme);
                if (this.element.find('.' + this._prefixClass + 'childitem').length) {
                    $(this.element.find('.' + this._prefixClass + 'childitem')).removeClass("e-m-dark e-m-light e-default").addClass("e-m-" + this.model.theme);
                    var header = this.element.find('.' + this._prefixClass + 'childitem .' + this._prefixClass + 'header');
                    var proxy = this;
                    header.each(function (index, element) {
                        $(element).ejmHeader('model.theme', proxy.model.theme);
                    });
                }
            }
        },
        
        
        _setDataSource: function (dataSource, fieldSettings) {
            if (this._hasDataSource() && dataSource) {
                if (fieldSettings)
                    this.model.fieldSettings = fieldSettings;
                this._refresh();
            }
        },
        
        
        _hasDataSource: function () {
            return this.dataSource() && this.dataSource().length;
        },
        
        
        _getElement: function (childId) {
            return childId ? this.element.find('#' + childId) : this._lbEle;
        },
        
        
        _isEnable: function (item) {
            return item.hasClass(this._prefixClass + 'state-disabled') ? false : true;
        },
        //To refresh the control
        _refresh: function () {
            this._destroy();
            this.element.addClass(this._rootCSS);
            this._load();
        },
        //To clear the element
        _clearElement: function () {
            this.element.removeAttr("class").removeAttr("style");
            this.element.empty().html(this._orgEle.html());
        },
        // all events bound using this._on will be unbind automatically
        _destroy: function () {
            if (this._prefixClass == "e-")
                $(window).unbind("resize");
            this._wireEvents(true);
            this._clearElement();
        },

        loadAjaxContent: function (urlVal, backButton) {
            var proxy = this;
            this._isFromAjax = true;
            this._renderChild(ej.getAttrVal(this._currentItem, 'data-childid', "page_" + parseInt(Math.random().toFixed(3) * 1000)));
            if (!$.support.pushstate || ej.isWindowsWebView())
                if (proxy._prefixClass == "e-m-")
                    urlVal = App.route.makeUrlAbsolute(urlVal);
            var loadData = { content: proxy._div, item: proxy._currentItem, index: $(proxy._currentItem).index(), text: $(proxy._currentItem).text(), url: proxy.model.ajaxSettings.url ? proxy.model.ajaxSettings.url : urlVal };
            if (this.model.ajaxBeforeLoad)
                this._trigger("ajaxBeforeLoad", loadData);
            var ajaxSettings = {
                cache: proxy.model.ajaxSettings.cache,
                async: proxy.model.ajaxSettings.async,
                type: proxy.model.ajaxSettings.type,
                contentType: proxy.model.ajaxSettings.contentType,
                url: ej.isWindowsWebView() ? urlVal : proxy.model.ajaxSettings.url ? proxy.model.ajaxSettings.url : urlVal,
                dataType: proxy.model.ajaxSettings.dataType,
                data: proxy.model.ajaxSettings.data,
                "successHandler": function (data) { //Ajax post success event handler
                    var content = ej.buildTag("div." + this._prefixClass + "content", (/<\/?body[^>]*>/gmi).test(data) ? data.split(/<\/?body[^>]*>/gmi)[1] : data || "");
                    proxy._div.append(proxy._container.append(content));
                    if (proxy._prefixClass == "e-m-")
                        proxy._div.attr("data-ajaxurl", App.route.convertToRelativeUrl(urlVal));
                    proxy._updateContent(proxy._currentItem, backButton);
                    if (proxy._prefixClass == "e-m-" && (App.angularAppName || ej.angular.defaultAppName))
                        ej.angular.compile(content);
                    var successData = { content: proxy._div, item: proxy._currentItem, index: $(proxy._currentItem).index(), text: $(proxy._currentItem).text(), url: proxy.model.ajaxSettings.url ? proxy.model.ajaxSettings.url : urlVal };
                    if (proxy.model.ajaxSuccess)
                        proxy._trigger("ajaxSuccess", successData);
                },
                "errorHandler": function (xhr, textStatus, errorThrown) {
                    var errorData = { "xhr": xhr, "textStatus": textStatus, "errorThrown": errorThrown, item: proxy._currentItem, index: $(proxy._currentItem).index(), text: $(proxy._currentItem).text(), url: proxy.model.ajaxSettings.url ? proxy.model.ajaxSettings.url : urlVal };
                    if (proxy.model.ajaxError)
                        proxy._trigger("ajaxError", errorData);
                },
                "completeHandler": function (data) {
                    var completeData = { content: proxy._div, item: proxy._currentItem, index: $(proxy._currentItem).index(), text: $(proxy._currentItem).text(), url: proxy.model.ajaxSettings.url ? proxy.model.ajaxSettings.url : urlVal };
                    if (proxy.model.ajaxComplete)
                        proxy._trigger("ajaxComplete", completeData);
                }
            };
            ej.sendAjaxRequest(ajaxSettings);
        },

        selectItem: function (index, childId) {
            if (index >= 0 && this._isEnable($(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]))) {
                this.setActive(index, childId);
                this._currentItem = $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]);
                this._prevItem = this._currentItem;
                this._onTouchEndHandler();
            }
        },

        setActive: function (index, childId) {
            if (index >= 0) {
                element = this._getElement(childId);
                if (this._isEnable($(element.find('li.' + this._prefixClass + 'list')[index])) && ej.getBooleanVal($(element.find('li.' + this._prefixClass + 'list')[index]), 'data-persistSelection', this.model.persistSelection)) {
                    element.find('li.' + this._prefixClass + 'list.' + this._prefixClass + 'state-active').removeClass(this._prefixClass + 'state-active').addClass(this._prefixClass + 'state-default');
                    this._currentItem = $(element.find('li.' + this._prefixClass + 'list')[index]);
                    this._prevItem = this._currentItem;
                    this._currentItem.removeClass(this._prefixClass + 'state-default').addClass(this._prefixClass + 'state-active');
                }
            }
        },

        deActive: function (index, childId) {
            if (index >= 0 && this._isEnable($(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index])))
                $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).removeClass(this._prefixClass + 'state-active').addClass(this._prefixClass + 'state-default');
        },

        enableItem: function (index, childId) {
            if (index >= 0)
                $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).removeClass(this._prefixClass + 'disable').addClass(this._prefixClass + 'state-default').find('a').removeClass(this._prefixClass + 'disable').find('.' + this._prefixClass + 'lv-check').ejCheckBox("enable");
        },

        disableItem: function (index, childId) {
            if (index >= 0)
                $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).addClass(this._prefixClass + 'disable').removeClass(this._prefixClass + 'state-default').find('a').addClass(this._prefixClass + 'disable').find('.' + this._prefixClass + 'lv-check').ejCheckBox("disable");
        },

        removeCheckMark: function (index, childId) {
            element = this._getElement(childId);
            if (index >= 0 && this._isEnable($(element.find('li.' + this._prefixClass + 'list')[index])))
                $(element.find('li.' + this._prefixClass + 'list')[index]).find('.' + this._prefixClass + 'lv-checkdiv').remove();
            else
                element.find('.' + this._prefixClass + 'lv-checkdiv').remove();
        },

        checkItem: function (index, childId) {
            if (index >= 0 && this._isEnable($(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index])))
                this._setCheckboxValue($(this._getElement(childId).find('.' + this._prefixClass + 'lv-check')[index]), true);
        },

        unCheckItem: function (index, childId) {
            if (index >= 0 && this._isEnable($(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index])))
                this._setCheckboxValue($(this._getElement(childId).find('.' + this._prefixClass + 'lv-check')[index]), false);
        },

        checkAllItem: function (childId) {
            var proxy = this;
            this._getElement(childId).find('.' + this._prefixClass + 'lv-check').each(function (index, check) {
                if (proxy._isEnable($(proxy._getElement(childId).find('li.' + proxy._prefixClass + 'list')[index])))
                    proxy._setCheckboxValue($(check), true);
            });
        },

        unCheckAllItem: function (childId) {
            var proxy = this;
            this._getElement(childId).find('.' + this._prefixClass + 'lv-check').each(function (index, check) {
                if (proxy._isEnable($(proxy._getElement(childId).find('li.' + proxy._prefixClass + 'list')[index])))
                    proxy._setCheckboxValue($(check), false);
            });
        },

        getActiveItem: function (childId) {
            return this._getElement(childId).find('li.' + this._prefixClass + 'list.' + this._prefixClass + 'state-active');
        },

        getActiveItemText: function (childId) {
            return this._getElement(childId).find('li.' + this._prefixClass + 'list.' + this._prefixClass + 'state-active').text();
        },

        getItemText: function (index, childId) {
            if (index >= 0)
                return $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).text();
        },

        getCheckedItems: function (childId) {
            if (childId != undefined)
                return this._getElement(childId).find('input.' + this._prefixClass + 'lv-check:checked').closest('li.' + this._prefixClass + 'list');
            else
                return this.element.find('input.' + this._prefixClass + 'lv-check:checked').closest('li.' + this._prefixClass + 'list');
        },

        getCheckedItemsText: function (childId) {
            return $(this.getCheckedItems(childId)).map(function () { return $(this).text(); }).get();
        },

        hasChild: function (index, childId) {
            if (index >= 0)
                return this.element.find('#' + $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).attr('data-childid')).length ? true : false;
        },
        
        isChecked: function (index, childId) {
            if (index >= 0)
                return $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).find('input.' + this._prefixClass + 'lv-check').prop('checked');
        },

        showItem: function (index, childId) {
            if (index >= 0)
                $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).css('visibility', '');
        },

        hideItem: function (index, childId) {
            if (index >= 0)
                $(this._getElement(childId).find('li.' + this._prefixClass + 'list')[index]).css('visibility', 'hidden');
        },

        show: function (childId) {
            this._getElement(childId).css('visibility', '');
        },

        hide: function (childId) {
            this._getElement(childId).css('visibility', 'hidden');
        },

		objectSplice:function(list,index){
		    for (var i = 0; i < list.length; i++) {
		        this.model.items.splice(index, 0, list[i]);
		    }
		},
		
        addItem: function (list, index, groupid) {
            if (index >= 0) {
                if (!this._hasDataSource()) {
					if($('.e-list-container').find('ul').length == 0){
                    var ul = ej.buildTag('ul'), li = ej.buildTag('li');
                    $('.e-list-container').find('div:first').append(ul);
                    $('.e-list-container > div > ul').append(li);
                }
                    if (typeof (list) == 'object')
                        this.objectSplice(list, index);
                    else
                        this.model.items.splice(index, 0, this._getLiAttributes(list, null, null, groupid));
                    var items = this.model.items;
                }
                else {
                    if (typeof (list) == 'object') {
                        for (var i = 0; i < list.length; i++) 
                            this.dataSource().splice(index, 0, list[i]);
                    }
                    else 
                    this.dataSource().splice(index, 0, this._itemsObjectCollection($(list), null, null, groupid));
                    var items = this.dataSource();
                }
            }
            else
                this._orgEle.children().append(list);
            if (!this.model.enableGroupList)
                var $ul = $(this.element.find("ul:visible"));
            else
                var $ul = $(this.element.find('ul[data-ej-grouplisttitle= ' + groupid + ']'));
            if (!ej.isNullOrUndefined(this.jsRender)) {
				 var ele;
				if (typeof (list) == 'object') {
                    for (var i = 0; i < list.length; i++) 
	                    ele = $($(this.jsRender).render(items[index+i])).insertBefore($ul.children()[index]);
                }
                else 
                      ele = $($(this.jsRender).render(items[index])).insertBefore($ul.children()[index]);    
                ej.widget.init && ej.widget.init(ele);
            }
            else {
                this._renderControl();
                if ($(this.element).find('.subpage').length > 1) {
                    $(this.element).find('.subpage:nth-child(2)').remove();
                }
            }
            this._processing($ul);
            this._liEl = this.element.find('li.' + this._prefixClass + 'list');
            if (this._initEJCheckBox)
                this._initEJCheckBox($ul);
            this._setHeightWidth();
            this._wireEvents();
        },

            _processing: function ($ul) {
            $ul.find("li." + this._prefixClass + "firstitem").removeClass(this._prefixClass + "firstitem");
            $ul.find('li:first').addClass(this._prefixClass + "firstitem");
            $ul.find("li." + this._prefixClass + "lastitem").removeClass(this._prefixClass + "lastitem");
            $ul.find('li:last').addClass(this._prefixClass + "lastitem");
            eLi = $ul.find('li.' + this._prefixClass + 'list');
            eLi.removeEleEmptyAttrs();
            eLi.find('.' + this._prefixClass + 'chevron-right_01').removeEleEmptyAttrs();
            $ul.find('.' + this._prefixClass + 'lv-check').parent().addClass(this._prefixClass + 'lv-checkdiv');
            $ul.find('.' + this._prefixClass + 'lv-check').closest('li.' + this._prefixClass + 'list').addClass(this._prefixClass + 'list-check');
            $ul.find('.' + this._prefixClass + 'lv-input').closest('.' + this._prefixClass + 'lv-filter').addClass(this._prefixClass + 'lv-inputdiv');
        },

        removeItem: function (index, childId) {
            if (index >= 0) {
                element = this._getElement(childId);
                var child = $(element.find('li.' + this._prefixClass + 'list')[index]).attr('data-childid');
                if (this.element.find($('#' + child).length))
                    this.element.find($('#' + child)).remove();
                $(element.find('li.' + this._prefixClass + 'list')[index]).remove();
            }
        },

        clear: function () {
            this.element.empty().html();
            this._liEl = this.element.find('li.' + this._prefixClass + 'list');
        },

        getItemsCount: function (childId) {
            return this._getElement(childId).find('li.' + this._prefixClass + 'list').length;
        },

        append: function (dynamicdatasource) {
            var $ul, newListItems;
            if (dynamicdatasource.length) {
                this.model.dataSource = this.model.dataSource.concat(dynamicdatasource);
                if (!this.model.enableGroupList) {
                    $ul = $(this.element.find("ul:visible"));
                    newListItems = this._rendering(dynamicdatasource, $ul);
                    this._processing($ul);
                }
                else {
                    var group = ej.DataManager(dynamicdatasource).executeLocal(ej.Query().from(dynamicdatasource).group('groupID'));
                    for (var i in group) {
                        $ul = this.element.find('ul[data-ej-grouplisttitle= ' + group[i].key + ']');
                        newListItems = this._rendering(group[i].items, $ul);
                        this._processing($ul);
                    }
                }
                this._liEl = this.element.find('li.' + this._prefixClass + 'list');
                this._wireEvents(false, newListItems);
                if (this._prefixClass == "e-m-" && this.element.find(".e-m-scroll").length) {
                    var scroll = this.element.find(".e-m-scroll");
                    this._scrollInst = scroll.ejmScrollPanel("instance");
                    this._scrollInst.refresh();
                }
            }
            this._setHeightWidth();
        },
        getActiveItemData: function () {
            if (this.getActiveItem().attr("data-id"))
                return (this._generateData(this.dataSource().length ? typeof this.dataSource() == "string" ? eval(this.dataSource()) : this.dataSource() : this.model.items, this.getActiveItem().attr("data-id")));
        }
    });
})(jQuery, Syncfusion);;;
/**
* @fileOverview Plugin to style the Html ListView elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejListView", "ej.ListView", {
        _rootCSS: "e-lv",

        _prefixClass: "e-",
        defaults: {

            fieldSettings: {
                "navigateUrl": "navigateUrl",
                "href": "href",
                "enableAjax": "enableAjax",
                "preventSelection": "preventSelection",
                "persistSelection": "persistSelection",
                "text": "text",
                "enableCheckMark": "enableCheckMark",
                "checked": "checked",
                "primaryKey": "primaryKey",
                "parentPrimaryKey": "parentPrimaryKey",
                "imageClass": "imageClass",
                "imageUrl": "imageUrl",
                "childHeaderTitle": "childHeaderTitle",
                "childId": "childId",
                "childHeaderBackButtonText": "childHeaderBackButtonText",
                "renderTemplate": "renderTemplate",
                "templateId": "templateId",
                "attributes": "attributes",
                "mouseUp": "mouseUp",
                "mouseDown": "mouseDown",
                "groupID": "groupID",
                "id": "id"
            },

            mouseDown: null,

            mouseUp: null,

            items: []
        },



        dataTypes: {
            dataSource: "data",
            fieldSettings: "data",
            renderMode: "enum",
            theme: "enum",
            enablePersistence: "boolean"
        },
        observables: ["selectedItemIndex", "dataSource"],
        selectedItemIndex: ej.util.valueFunction("selectedItemIndex"),
        dataSource: ej.util.valueFunction("dataSource"),
		checkedIndices: ej.util.valueFunction("checkedIndices"),

        _tags: [{
            tag: "items",
            attr:
                ["navigateUrl",
                "href",
                "text",
                "checked",
                "primaryKey",
                "parentPrimaryKey",
                "imageClass",
                "imageUrl",
                "childHeaderTitle",
                "childId",
                "childHeaderBackButtonText",
                "mouseUP",
                "mouseDown",
                "attributes",
                "renderTemplate",
                "templateId",
                "enableAjax",
                "preventSelection",
                "persistSelection",
                "enableCheckMark",
                "attributes"
                ],
            content: "template"
        }
        ],


        _init: function () {
            this._preventDefaultException = { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ };
            this._storedContent = [];
            this._storedTemplate = [];
            this._tempContent = $("body");
            this._touchStart = this.model.mouseDown;
            this._touchEnd = this.model.mouseUp;
            this._oldEle = this.element.clone();
            if (this._oldEle.find("ul").length)
                this.model.items = [];
            this._indexVal = 0;
            this._updateModelItems();
            this._load();
            var navObj = this.element.closest(".e-nb.e-js");
            this._isInsideNavigation = navObj.length;
            if (this._isInsideNavigation)
                this._nearestND = navObj.ejNavigationDrawer("instance");
            this._responsive();
        },

        _responsive: function () {
			$(window).bind("resize", $.proxy(this._resizeHandler, this));
        },

        _resizeHandler: function () {
			if($(this.element).parent().width()<=this.model.width) {
				this.width = $(this.element).parent().width();
				$(this.element).width(this.width);
			}
			else
				$(this.element).width(this.model.width);
        },

        _itemsObjectCollection: function (element, primaryKey, parentPrimaryKey, groupid) {
            if (ej.getAttrVal(element, "data-ej-rendertemplate")) {
                var tempid = this._tempContent.find('#' + ej.getAttrVal(element, "data-ej-templateid"));
                if (tempid.length) {
                    var ele = tempid.remove();
                    this._storedTemplate[this._indexVal] = ele[0].nodeName && ele[0].nodeName.toLowerCase() == "script" ? ej.getClearString(ele[0].innerHTML) : ele[0].outerHTML;
                }
                else if (!this._storedTemplate[this._indexVal])
                    if ($(element)[0].innerHTML)
                        this._storedTemplate[this._indexVal] = $(element)[0].innerHTML;
                    else if (this._storedTemplate[this._indexVal] && this._tempContent.find('#' + template).length) {
                        var ele = this._tempContent.find('#' + template).remove();
                        ele = ele[0].nodeName && ele[0].nodeName.toLowerCase() == "script" ? ej.getClearString(ele[0].innerHTML) : ele[0].outerHTML;
                        this._storedTemplate = ej._pushValue(this._storedTemplate, ele, this._indexVal);
                    }
                this._indexVal++;
            }
          return  this._getLiAttributes(element, primaryKey, parentPrimaryKey, groupid);
        },

        _getLiAttributes: function (element, primaryKey, parentPrimaryKey, groupid) {
            var item = {};
            item.groupID = groupid ? groupid : "",
            item.text = ej.getAttrVal(element, "data-ej-text") ? ej.getAttrVal(element, "data-ej-text") : this._getText(element);
            item.preventSelection = ej.getAttrVal(element, "data-ej-preventselection");
            item.persistSelection = ej.getAttrVal(element, "data-ej-persistselection");
            item.navigateUrl = ej.getAttrVal(element, "data-ej-navigateurl");
            item.href = ej.getAttrVal(element, "data-ej-href");
            item.checked = ej.getAttrVal(element, "data-ej-checked");
            item.primaryKey = ej.getAttrVal(element, "data-ej-primarykey", primaryKey);
            item.parentPrimaryKey = ej.getAttrVal(element, "data-ej-parentprimarykey", parentPrimaryKey);
            item.imageClass = ej.getAttrVal(element, "data-ej-imageclass");
            item.imageUrl = ej.getAttrVal(element, "data-ej-imageurl");
            item.childHeaderTitle = ej.getAttrVal(element, "data-ej-childheadertitle");
            item.childId = item.href ? ej.getAttrVal(element, "data-ej-childid") ? ej.getAttrVal(element, "data-ej-childid") : ("page_" + parseInt(Math.random().toFixed(3) * 1000)) : "";
            item.childHeaderBackButtonText = ej.getAttrVal(element, "data-ej-childheaderbackbuttontext");
            item.mouseUp = ej.getAttrVal(element, "data-ej-mouseUp");
            item.mouseDown = ej.getAttrVal(element, "data-ej-mouseDown");
            if (this.element.find('li').length < 0) item.attributes = element.attrNotStartsWith(/^data-ej-/);
            item.renderTemplate = ej.getAttrVal(element, "data-ej-rendertemplate");
            item.templateId = this._storedTemplate[this._indexVal - 1],
            item.enableAjax = ej.getAttrVal(element, "data-ej-enableajax");
            item.enableCheckMark = ej.getAttrVal(element, "data-ej-enablecheckmark");
            return item;
        },



        _renderLists: function () {
            var list = ej.buildTag("li", "", {}, {
                "class": this._prefixClass + "user-select " + this._prefixClass + "list " + this._prefixClass + "state-default{{if " + this.model.fieldSettings['primaryKey'] + " || " + this.model.fieldSettings['enableAjax'] + " || " + this.model.enableAjax + "}} " + this._prefixClass + "arrow{{/if}}{{if " + this.model.fieldSettings['imageClass'] + "}} " + this._prefixClass + "margin{{else}}{{if " + this.model.fieldSettings['imageUrl'] + "}} " + this._prefixClass + "margin{{/if}}{{/if}}",
                "data-childid": "{{if " + this.model.fieldSettings['primaryKey'] + "}}child{{>" + this.model.fieldSettings['primaryKey'] + "}}{{else " + this.model.fieldSettings['childId'] + "}}{{>" + this.model.fieldSettings['childId'] + "}}{{else}}{{/if}}",
                "data-childheadertitle": "{{>" + this.model.fieldSettings['childHeaderTitle'] + "}}",
                "data-childheaderbackbuttontext": "{{>" + this.model.fieldSettings['childHeaderBackButtonText'] + "}}",
                "data-preventSelection": "{{>" + this.model.fieldSettings['preventSelection'] + "}}",
                "data-persistSelection": "{{>" + this.model.fieldSettings['persistSelection'] + "}}",
                "data-navigateUrl": "{{>" + this.model.fieldSettings['navigateUrl'] + "}}",
                "data-loadajax": "{{>" + this.model.fieldSettings['enableAjax'] + "}}",
                "data-href": '{{>' + this.model.fieldSettings['href'] + '}}{{:~_checkAjaxUrls()}}',
                "data-checked": '{{>' + this.model.fieldSettings['checked'] + '}}',
                "data-templateid": "{{>" + this.model.fieldSettings['renderTemplate'] + "}}",
                "data-mouseup": "{{>" + this.model.fieldSettings['mouseUp'] + "}}",
                "data-mousedown": "{{>" + this.model.fieldSettings['mouseDown'] + "}}",
                "data-id": "{{>" + this.model.fieldSettings['id'] + "}}"
            });
            if (this.model.renderTemplate) {
                if (this._hasDataSource() && this._template)
                    list[0].innerHTML = this._template;
            }
            else {
                var linkTag = ej.buildTag("a", "", {}, { "class": this._prefixClass + "chevron-right_01 " + this._prefixClass + "remove-shadow{{if " + this.model.fieldSettings['imageClass'] + "}} " + this._prefixClass + "margin{{else}}{{if " + this.model.fieldSettings['imageUrl'] + "}} " + this._prefixClass + "margin{{/if}}{{/if}}{{if " + this.model.fieldSettings['primaryKey'] + " || " + this.model.fieldSettings['enableAjax'] + " || " + this.model.enableAjax + "}} " + this._prefixClass + "fontimage e-icon{{/if}}", "href": (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9 ? "" : "{{if " + this.model.fieldSettings['navigateUrl'] + " == '' || " + this.model.fieldSettings['navigateUrl'] + " == undefined }}{{else}}{{:" + this.model.fieldSettings['navigateUrl'] + "}}{{/if}}") }); 
                (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9) && linkTag.removeAttr('href');
				var span = ej.buildTag("span", "{{>" + this.model.fieldSettings['text'] + "}}", {}, { "class": this._prefixClass + "list-text " + this._prefixClass + "rel " + this._prefixClass + "user-select{{if " + this.model.fieldSettings['imageClass'] + "}} " + this._prefixClass + "text{{else}}{{if " + this.model.fieldSettings['imageUrl'] + "}} " + this._prefixClass + "text{{/if}}{{/if}}" });
                var imgClass = ej.buildTag("div", "", {}, { 'class': this._prefixClass + "list-img " + this._prefixClass + "rel " + this._prefixClass + "user-select {{>" + this.model.fieldSettings['imageClass'] + "}}" });
                var check = this._createCheckBox();
                if (this.model.renderMode == "windows" && ej.isMobile())
                    linkTag[0].innerHTML = "{{if !" + this.model.fieldSettings['primaryKey'] + "}}{{if " + this.model.fieldSettings['enableAjax'] + " == undefined || " + this.model.fieldSettings['enableAjax'] + ".toString() == 'false'}}{{if !" + this.model.fieldSettings['navigateUrl'] + "}}{{if " + this.model.fieldSettings['enableCheckMark'] + " !== undefined}}{{if " + this.model.fieldSettings['enableCheckMark'] + ".toString() == 'false' ? " + this.model.fieldSettings['enableCheckMark'] + " : " + this.model.enableCheckMark + "}}" + check[0].outerHTML + "{{/if}}{{else}}{{if " + this.model.enableCheckMark + "}}" + check[0].outerHTML + "{{/if}}{{/if}}{{/if}}{{/if}}{{/if}}" + "{{if " + this.model.fieldSettings['imageClass'] + "}}" + imgClass[0].outerHTML + "{{else}}{{if " + this.model.fieldSettings['imageUrl'] + "}}{{:~_checkImgUrls()}}{{/if}}{{/if}}" + span[0].outerHTML;
                else
                    linkTag[0].innerHTML = "{{if " + this.model.fieldSettings['imageClass'] + "}}" + imgClass[0].outerHTML + "{{else}}{{if " + this.model.fieldSettings['imageUrl'] + "}}{{:~_checkImgUrls()}}{{/if}}{{/if}}" + span[0].outerHTML + "{{if !" + this.model.fieldSettings['primaryKey'] + "}}{{if " + this.model.fieldSettings['enableAjax'] + " == undefined || " + this.model.fieldSettings['enableAjax'] + ".toString() == 'false'}}{{if !" + this.model.fieldSettings['navigateUrl'] + "}}{{if " + this.model.fieldSettings['enableCheckMark'] + " !== undefined}}{{if " + this.model.fieldSettings['enableCheckMark'] + ".toString() == 'false' ? " + this.model.fieldSettings['enableCheckMark'] + " : " + this.model.enableCheckMark + "}}" + check[0].outerHTML + "{{/if}}{{else}}{{if " + this.model.enableCheckMark + "}}" + check[0].outerHTML + "{{/if}}{{/if}}{{/if}}{{/if}}{{/if}}";

                list[0].innerHTML = "{{if " + this.model.fieldSettings['renderTemplate'] + " == undefined || " + this.model.fieldSettings['renderTemplate'] + ".toString() == 'false'}}" + linkTag[0].outerHTML + "{{else}}{{:templateId}}{{/if}}";
            }
            if (this.model.renderMode == "ios7") {
                var innerDiv = ej.buildTag("div." + this._prefixClass + "list-div");
                innerDiv[0].innerHTML = list[0].innerHTML;
                list.empty().append(innerDiv);
            }
            return list;
        },


        _updateContent: function (currentItem, backButton) {
            var proxy = this;
            var $curIte = $(currentItem), childid = $curIte.attr('data-childid');
            id = this._isInsideNavigation && currentItem.attr('data-href') ? $('body').find($("#" + childid)) : this.element.find($("#" + childid));
            if (id.length) {
                var hdr = this.element.find('#' + childid + '_header');
                if (this.model.enableFiltering)
                    this._initializeFiltering($(id));
                var title = $curIte.attr('data-childheadertitle') == undefined ? currentItem.text() : $curIte.attr('data-childheadertitle');
                if (hdr.hasClass('e-header')) {
                    this._setHeaderVal(childid, title, backButton);
                }
                id.attr("data-hdr-title", title).attr("data-hdr-bckbtn", backButton);
                this._initEJCheckBox(id);
                if (this._isInsideNavigation && currentItem.attr('data-href') && this._nearestND.model.contentId) {
                    if ($('body').find('.e-lv.subpage.e-childitem')) {
                        $("#" + this._nearestND.model.contentId).empty().append(id.show());
                    }
                }
                else {
                    $curIte.closest('.subpage').hide();
                    id.show();
					this._childContainer = id.find('.' + this._prefixClass + 'list-container');
					this._childContainer.ejScroller({
                        height: this._childContainer.height(),
                        width: 0,
                        scrollerSize: 20
                    });
			        this.scrollerObj = this._childContainer.ejScroller("instance");
					this._containerHeight = this.element.height() - ej.getDimension(this._lbEle.find('.' + this._prefixClass + 'lv-inputdiv'), 'outerHeight')-ej.getDimension(this._lbEle.find('.' + this._prefixClass + 'header'), 'outerHeight');
					if (this.model.height !== null) {
				        if (this._childContainer.height() > this._containerHeight) {
			                this._refreshScroller(this._childContainer,true);
					    }
				    }
				    if (this.scrollerObj) {
						this.scrollerObj.refresh();
						$(this.scrollerObj.element).find(".e-vhandlespace").css("height",($(this.scrollerObj.element).find(".e-vhandlespace").height() - 1));
					}
                    $(this.element.children()[0]).removeClass("e-slideright");
                    id.addClass("e-slideleft");
                }
            }
        },



        _renderHeader: function (id, showbutton, title, backtext) {
            var header = ej.buildTag("div", "", {}, { "id": id + "_header", "class": "e-header e-box" });
            if (showbutton) {
                header.append("<span class='e-hicon e-icon e-chevron-left_01'></span>");
                header.append("<div class='e-btn-text'>" + (backtext ? backtext : "Back") + "</div>");
            }
            else
                header.append("<div class='e-htitle'>" + title + "</div>");
            return header;
        },
        _setHeaderVal: function (id, title, backtext) {
            this._onBackButtonDelegate = $.proxy(this._onBackButtonClick, this);
            ej.listenTouchEvent($("#" + id + "_header"), ej.endEvent(), this._onBackButtonDelegate, false, this);
            $("#" + id + "_header").find(".e-btn-text").text(backtext ? backtext : "Back");
            $("#" + id + "_header").find(".e-htitle").text(title);
        },
        _onBackButtonClick: function (e) {
            this.element.find(".e-slideleft").removeClass("e-slideleft");
            this.element.children(":visible").hide();
            $(this.element.children()[0]).show();
            $(this.element.children()[0]).addClass("e-slideright");
        },


        _returnData: function () {
            var checkedItem = this._currentItem.closest('ul.e-list-hdr').find('.e-chkbox-wrap[aria-checked="true"]').closest("li");
            var elementId = ej.getAttrVal(this._currentItem, "data-id", this._currentItem.text());
            var items = this.dataSource().length ? typeof this.dataSource() == "string" ? eval(this.dataSource()) : this.dataSource() : this.model.items;
            return {
                hasChild: this._currentItem.attr("data-childid") && this._currentItem.attr('data-childid').length > 0 ? (this.element.find('#' + this._currentItem.attr('data-childid')).length ? true : false) : false,
                item: this._currentItem,
                text: this._currentItem.text(),
                index: this._currentItem.index(),
                isChecked: this._currentItem.find("input.e-lv-check").closest('.e-chkbox-wrap').attr('aria-checked') == "true" ? true : false,
                checkedItems: checkedItem.length ? checkedItem : null,
                checkedItemsText: $(checkedItem).map(function () { return $(this).text(); }).get(),
                itemData: this._generateData(items, elementId),
                checkedValues: this.checkedIndices()  
            };
        },
        _initEJCheckBox: function (ul) {
            var liItems = ul.find("li");
            var count = liItems.length;
            for (i = 0; i < count; i++) {
                var localItems = this.model.checkedIndices;
                    var checked = this._hasValue(localItems, i);
                    $($(liItems[i]).find(".e-lv-check")).ejCheckBox({ checked: checked });
                }
            ul.find('.e-lv-checkdiv').removeClass("e-lv-checkdiv")
            ul.find('.e-lv-check').parent().addClass("e-lv-checkdiv")
        },
        _triggerStartEvent: function (data) {
            this.model.mouseDown = ej.getAttrVal(this._currentItem, 'data-mousedown', this._touchStart);
            if (this.model.mouseDown)
                this._trigger("mouseDown", data);
        },

        _triggerEndEvent: function (data, evt) {
            this.model.mouseUp = ej.getAttrVal(this._currentItem, 'data-mouseup', this._touchEnd);
            this.selectedItemIndex(this._currentItem.index());
            if (this.model.enablePersistence && this.model.enableCheckMark) {
                var state = this._currentItem.find('.e-chkbox-wrap'), index = this._currentItem.index();
                if (state.attr('aria-checked') == 'true' || $(evt.target).parent().hasClass('e-chk-inact')) {
                    if (!this._hasValue(this._checkedValues, index))
                        this._checkedValues.push(index);
                    else
                        this._checkedValues.splice(this._checkedValues.indexOf(index), 1);
                }
                else
                    this._checkedValues.splice(this._checkedValues.indexOf(index), 1);
            }
            this.checkedIndices(this._checkedValues);
            if (this.model.mouseUp)
                this._trigger("mouseUp", data);
        },
        _createFilterDiv: function () {
            return ej.buildTag('div.e-lv-filter', ej.buildTag('input.e-lv-input', "", {}, { 'type': 'text', 'placeholder': 'search' }));
        },
        _emptyFilterTextValue: function (element) {
            element.find('.e-lv-input').val("");
        },
        _createListDiv: function (childId) {
            this._div = ej.buildTag("div#" + childId + "." + this._rootCSS + " subpage e-childitem e-ajaxchild", (this.model.showHeader && this._isInsideNavigation && !this._nearestND.model.contentId) ? this._renderHeader(childId, true, this._currentItem.text()) : "");
        },
        _createCheckBox: function () {
            return ej.buildTag("input.e-lv-check", "", {}, { "type": "checkbox", });
        },
        _toggleCheckboxValue: function (lbCheck) {
            lbCheck.ejCheckBox({ checked: $(lbCheck.closest('.e-chkbox-wrap')).attr('aria-checked') == "true" ? false : true });
        },
        _setCheckboxValue: function (element, val) {
            element.ejCheckBox({ checked: val });
        },
        _convertToRelativeUrl: function (url) {
            return url;
        }
    });
    $.extend(true, ej.ListView.prototype, ej.ListViewBase.prototype);
})(jQuery, Syncfusion);;

});