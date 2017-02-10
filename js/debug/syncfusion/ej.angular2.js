System.register("ej/core", ['@angular/core', '@angular/forms'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, forms_1;
    var firstVal, Utils, EJComponents, ComplexTagElement, ArrayTagElement, TemplateElement;
    function CreateComplexDirective(args, ejArgs) {
        return core_1.Directive(args).Class({
            extends: ComplexTagElement,
            constructor: [ejArgs.type, function (widget) {
                    this.tags = ejArgs.tags;
                    this.complexProperties = ejArgs.complexes;
                    ComplexTagElement.call(this);
                    this.__parent = widget;
                }]
        });
    }
    exports_1("CreateComplexDirective", CreateComplexDirective);
    function CreateTemplateDirective(args, ejArgs) {
        return core_1.Directive(args).Class({
            extends: TemplateElement,
            constructor: [core_1.ElementRef, core_1.ViewContainerRef, core_1.TemplateRef, ejArgs.type, function (el, viewContainerRef, templateRef, widget) {
                    this.tags = ejArgs.tags;
                    this.complexProperties = ejArgs.complexes;
                    this.__element = widget;
                    this.context = {};
                    TemplateElement.call(this, el, viewContainerRef, templateRef);
                }]
        });
    }
    exports_1("CreateTemplateDirective", CreateTemplateDirective);
    function CreateArrayTagDirective(property, selector, type) {
        return core_1.Directive({
            selector: selector,
            queries: {
                children: new core_1.ContentChildren(type)
            }
        }).Class({
            extends: ArrayTagElement,
            constructor: function () {
                ArrayTagElement.call(this, property);
            }
        });
    }
    exports_1("CreateArrayTagDirective", CreateArrayTagDirective);
    function CreateComponent(name, componentArgs, ejArgs) {
        componentArgs.changeDetection = core_1.ChangeDetectionStrategy.OnPush;
        var comp = core_1.Component(componentArgs);
        return comp.Class({
            extends: EJComponents,
            constructor: [core_1.ElementRef, core_1.ChangeDetectorRef, function (el, cdRef) {
                    this.tags = ejArgs.tags;
                    this.outputs = componentArgs.outputs;
                    this.twoways = ejArgs.twoways;
                    this.isEditor = ejArgs.isEditor;
                    this.complexProperties = ejArgs.complexes;
                    EJComponents.call(this, name, el, cdRef);
                }]
        });
    }
    exports_1("CreateComponent", CreateComponent);
    function CreateControlValueAccessor(selector, component) {
        var EJDefaultValueAccessor;
        var constAccessor = { provide: forms_1.NG_VALUE_ACCESSOR,
            useExisting: core_1.forwardRef(function () { return EJDefaultValueAccessor; }), multi: true
        };
        var valDirective = core_1.Directive({ selector: selector,
            host: { '(change)': 'onChange($event.value)', '(focusOut)': 'onTouched()' },
            providers: [constAccessor]
        });
        EJDefaultValueAccessor = valDirective.Class({
            constructor: [component, function (host) {
                    this.host = host;
                }],
            onChange: function (_) { },
            onTouched: function () { },
            writeValue: function (value) {
                if (this.host.widget)
                    this.host.widget.option("model.value", value);
                else
                    this.host.model.value = value;
            },
            registerOnChange: function (fn) {
                this.onChange = fn;
            },
            registerOnTouched: function (fn) {
                this.onTouched = fn;
            }
        });
        return EJDefaultValueAccessor;
    }
    exports_1("CreateControlValueAccessor", CreateControlValueAccessor);
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                exports_1({
                    "ContentChild": core_1_1["ContentChild"],
                    "Type": core_1_1["Type"],
                    "forwardRef": core_1_1["forwardRef"]
                });
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            }],
        execute: function() {
            firstVal = {};
            /** Internal Helpers */
            Utils = (function () {
                function Utils() {
                }
                Utils.IterateAndGetChanges = function (obj) {
                    if (ej.isNullOrUndefined(obj.tags) || obj.tags.length === 0)
                        return null;
                    var changes, res = {};
                    for (var i = 0, tags = obj.tags; i < tags.length; i++) {
                        var tag = tags[i], tagElement = obj["_" + tag.replace(/\./g, '_')];
                        if (!ej.isNullOrUndefined(tagElement) && tagElement.hasChanges) {
                            res[tag] = tagElement.getChangesAndReset();
                        }
                    }
                    return res;
                };
                Utils.AngularizeInputs = function (inputs, twoways) {
                    for (var i = 0, len = inputs.length; i < len; i++) {
                        var element = inputs[i];
                        inputs[i] = "model." + element + ": " + element;
                    }
                    for (var i = 0; i < twoways.length; i++) {
                        var element = twoways[i];
                        element = "model." + element + "_two:" + element;
                        inputs.push(element);
                    }
                    return inputs;
                };
                return Utils;
            }());
            exports_1("Utils", Utils);
            EJComponents = (function () {
                function EJComponents(name, el, cdRef) {
                    this.name = name;
                    this.el = el;
                    this.cdRef = cdRef;
                    this.model = {};
                    this._firstCheck = true;
                    //        this.__shadow = this.dom.getShadowRoot(this.el.nativeElement);
                    this.createEvents(this.outputs);
                    this.createTwoways(this.twoways);
                }
                EJComponents.prototype.createEvents = function (events) {
                    var model = this.model, self = this;
                    if (events && events.length) {
                        for (var i = 0; i < events.length; i++) {
                            var event = events[i];
                            if (event.startsWith("model."))
                                continue;
                            self[event] = new core_1.EventEmitter(false);
                        }
                    }
                    var complex = this.complexProperties;
                    if (complex && complex.length) {
                        for (var i = 0; i < complex.length; i++) {
                            var element = complex[i];
                            ej.createObject(element, {}, model);
                        }
                    }
                };
                EJComponents.prototype.createTwoways = function (twoways) {
                    if (!twoways)
                        return;
                    var model = this.model;
                    for (var i = 0; i < twoways.length; i++) {
                        var element = twoways[i];
                        if (element.indexOf(":") !== -1) {
                            element = element.replace(/:.+/g, "");
                        }
                        ej.createObject(element + "Change", new core_1.EventEmitter(), model);
                        ej.createObject(element, this.addTwoways(element), model);
                    }
                };
                EJComponents.prototype.addTwoways = function (prop) {
                    var self = this, model = this.model, value = firstVal; //, originalProp = prop.replace(/-/g, ".");
                    return function (newVal, isApp) {
                        if (value === firstVal) {
                            value = ej.getObject(prop + "_two", model);
                            if (value === undefined)
                                value = ej.getObject(prop, this === undefined || this.defaults === undefined ? {} : this.defaults);
                        }
                        if (newVal === undefined) {
                            return value;
                        }
                        if (value === newVal)
                            return;
                        value = newVal;
                        if (!isApp) {
                            ej.createObject(prop + "_two", newVal, model);
                            ej.getObject(prop + "Change", model).emit(newVal);
                        }
                    };
                };
                EJComponents.prototype.ngAfterContentInit = function () {
                    this._firstCheck = false;
                    for (var i = 0; i < this.tags.length; i++) {
                        var element = this.tags[i], item = this["_" + element.replace(/\./g, '_')];
                        if (!ej.isNullOrUndefined(item))
                            ej.createObject(element, item.getList(), this.model);
                    }
                    var model = this.model, self = this, events = this.outputs;
                    if (events) {
                        for (var i = 0; i < events.length; i++) {
                            var event = events[i];
                            EJComponents.bindAndRaiseEvent(this, model, event);
                        }
                    }
                    var nativeElement = this.isEditor ? $(this.el.nativeElement.children) : $(this.el.nativeElement);
                    this.widget = $(nativeElement)["ej" + this.name](this.model)["ej" + this.name]("instance");
                };
                EJComponents.bindAndRaiseEvent = function (instance, model, event) {
                    if (!event.startsWith("model.")) {
                        model[event] = function (params) {
                            instance[event]["emit"](params);
                        };
                    }
                };
                EJComponents.prototype.ngOnChanges = function (changes) {
                    if (this._firstCheck)
                        return;
                    var ngChanges = {};
                    for (var key in changes) {
                        var element = changes[key];
                        if (element.previousValue === element.currentValue)
                            break;
                        key = key.replace("model.", "");
                        if (key.endsWith("_two")) {
                            var oKey = key.replace("_two", ""), valFn = ej.getObject(oKey, this.widget["model"]);
                            valFn(element.currentValue, true);
                            ej.createObject(oKey, valFn, ngChanges);
                        }
                        ej.createObject(key, element.currentValue, ngChanges);
                    }
                    this.widget["setModel"](ngChanges, $.isPlainObject(ngChanges));
                };
                EJComponents.prototype.ngAfterContentChecked = function () {
                    /// TODO: ChangeDetection Third/Multi level
                    var changes = Utils.IterateAndGetChanges(this);
                    for (var key in changes) {
                        if (changes.hasOwnProperty(key)) {
                            var element = changes[key];
                            this.widget["_" + key](element);
                        }
                    }
                };
                EJComponents.prototype.ngOnDestroy = function () {
                    this.widget['destroy']();
                };
                return EJComponents;
            }());
            exports_1("EJComponents", EJComponents);
            ComplexTagElement = (function () {
                function ComplexTagElement() {
                    this.hasChanges = false;
                    this.__firstChange = true;
                    this.__valueChange = new core_1.EventEmitter();
                    var complexes = this.complexProperties;
                    for (var i = 0; complexes !== undefined && i < complexes.length; i++) {
                        var element = complexes[i];
                        ej.createObject(element, {}, this);
                    }
                    Object.defineProperty(this, "__parent", {
                        enumerable: false,
                        writable: true,
                        value: null
                    });
                }
                ComplexTagElement.prototype.ngOnInit = function () {
                    this.__firstChange = false;
                };
                ComplexTagElement.prototype.ensureCleanObject = function () {
                    var tags = this.tags;
                    for (var i = 0; i < tags.length; i++) {
                        var element = tags[i], tagElement = this["_" + element.replace(/\./g, '_')];
                        if (i === 0 && this[element])
                            return;
                        if (ej.isNullOrUndefined(tagElement))
                            continue;
                        ej.createObject(element, tagElement.getList(), this);
                    }
                };
                ComplexTagElement.prototype.ngOnChanges = function (changes) {
                    if (this.__firstChange)
                        return;
                    this.recentChanges = changes;
                    this.hasChanges = true;
                };
                ComplexTagElement.prototype.getChangesAndReset = function () {
                    if (this.hasChanges === false)
                        return;
                    var changes = this.recentChanges || {};
                    for (var key in changes) {
                        if (changes.hasOwnProperty(key)) {
                            changes[key] = changes[key].currentValue;
                        }
                    }
                    var contentChanges = Utils.IterateAndGetChanges(this);
                    if (!$.isEmptyObject(contentChanges)) {
                        for (var key in contentChanges) {
                            if (contentChanges.hasOwnProperty(key)) {
                                var element = contentChanges[key];
                                //this.el.nativeElement.
                                this.__parent.widget["_" + this.property.replace(/\./g, '_') + "_" + key](element);
                            }
                        }
                    }
                    this.hasChanges = false;
                    return changes;
                };
                ComplexTagElement.prototype.ngAfterContentChecked = function () {
                    var tags = this.tags;
                    for (var i = 0, len = tags.length; i < len; i++) {
                        var element = tags[i], tagElement = this["_" + element.replace(/\./g, '_')];
                        if (tagElement && tagElement.hasChanges)
                            this.hasChanges = true;
                    }
                };
                return ComplexTagElement;
            }());
            exports_1("ComplexTagElement", ComplexTagElement);
            ArrayTagElement = (function () {
                function ArrayTagElement(propertyName) {
                    this.propertyName = propertyName;
                    this.hasChanges = false;
                }
                // TODO: Need to consider dynamic child change
                ArrayTagElement.prototype.ngAfterContentInit = function () {
                    var _this = this;
                    var index = 0;
                    this.list = this.children.map(function (child) {
                        child.__index = index++;
                        child.property = _this.propertyName;
                        return child;
                    });
                };
                ArrayTagElement.prototype.ngOnChanges = function (changes) {
                };
                ArrayTagElement.prototype.getList = function () {
                    var list = this.list;
                    for (var i = 0; i < list.length; i++) {
                        list[i].ensureCleanObject();
                    }
                    return list;
                };
                ArrayTagElement.prototype.getChangesAndReset = function () {
                    this.hasChanges = false;
                    return this.recentChanges;
                };
                ArrayTagElement.prototype.ngAfterContentChecked = function () {
                    var changes = {}, res = changes[this.propertyName] = [], childChange;
                    for (var i = 0, list = this.list; i < list.length; i++) {
                        var child = list[i];
                        if (child.hasChanges) {
                            childChange = child.getChangesAndReset();
                            if (!ej.isNullOrUndefined(childChange)) {
                                res.push({
                                    index: child.__index,
                                    change: childChange
                                });
                            }
                        }
                    }
                    if (res.length > 0) {
                        this.recentChanges = res;
                        this.hasChanges = true;
                    }
                };
                return ArrayTagElement;
            }());
            exports_1("ArrayTagElement", ArrayTagElement);
            TemplateElement = (function () {
                function TemplateElement(el, viewContainerRef, templateRef) {
                    this.el = el;
                    this.viewContainerRef = viewContainerRef;
                    this.templateRef = templateRef;
                    this.childViews = [];
                }
                TemplateElement.prototype.ngOnInit = function () {
                    var template = this.viewContainerRef.createEmbeddedView(this.templateRef, { '$implicit': [] });
                    var templID = ej.getGuid('angulartmplstr');
                    var tempEle = ej.buildTag("div#" + templID);
                    $(tempEle).append(template.rootNodes);
                    ej.createObject('template', $($(tempEle).append(template.rootNodes)).html(), this.__element);
                    this.__element.template = $($(tempEle).append(template.rootNodes)).html();
                    ej.createObject("_templateRef", this.templateRef, this.__element);
                    ej.createObject("_viewRef", this.viewContainerRef, this.__element);
                    $(tempEle).remove();
                };
                TemplateElement.prototype.ngAfterViewInit = function () {
                    var _this = this;
                    window.setTimeout(function () {
                        _this.compileTempalte();
                    });
                    var parentWidget = this.__element.__parent.widget || this.__element.widget;
                    parentWidget.element.on(parentWidget.pluginName + 'refresh', function () {
                        if (parentWidget.angularTemplate) {
                            _this.compileTempalte();
                        }
                    });
                };
                TemplateElement.prototype.compileTempalte = function () {
                    var widget = this.__element.__parent.widget || this.__element.widget;
                    var element = widget.element;
                    var childView;
                    var templates = $(element).find('.ej-angular-template');
                    var templateObject = widget.angularTemplate;
                    for (var template in templateObject) {
                        var tmplElement = templates.filter('.' + templateObject[template].key);
                        if (tmplElement.length) {
                            for (var i = 0; i < tmplElement.length; i++) {
                                childView = templateObject[template].viewRef[i].createEmbeddedView(templateObject[template].templateRef[i], { '$implicit': templateObject[template].itemData[parseInt($(tmplElement[i]).attr("ej-prop"))] });
                                $(tmplElement[i]).empty().append(childView.rootNodes);
                            }
                        }
                        else {
                            delete templateObject[template];
                        }
                    }
                };
                TemplateElement.prototype.clearTempalte = function () {
                    var templateObject = this.__element.__parent.widget.angularTemplate || this.__element.widget.angularTemplate;
                    if (templateObject && Object.keys(templateObject).length) {
                        for (var tmpl in templateObject) {
                            delete templateObject[tmpl];
                        }
                    }
                    for (var childView in this.childViews)
                        delete this.childViews[childView];
                    this.viewContainerRef.remove();
                };
                TemplateElement.prototype.ngOnDestroy = function () {
                    this.clearTempalte();
                };
                return TemplateElement;
            }());
            exports_1("TemplateElement", TemplateElement);
            ej.template['text/x-template'] = function (self, selector, data, index, prop) {
                var templateObject = self.angularTemplate;
                if (!templateObject || !templateObject[selector]) {
                    templateObject = templateObject || {};
                    templateObject[selector] = { key: ej.getGuid('angulartmpl'), itemData: [], viewRef: [], templateRef: [] };
                    self.angularTemplate = templateObject;
                }
                var scope = templateObject[selector];
                if (!ej.isNullOrUndefined(index)) {
                    if (!scope.itemData)
                        scope.itemData = [];
                    scope.itemData[index] = data;
                    scope.viewRef[index] = prop._viewRef;
                    scope.templateRef[index] = prop._templateRef;
                }
                else {
                    scope.itemData = [data];
                    scope.viewRef = [prop._viewRef];
                    scope.templateRef = [prop._templateRef];
                }
                var actElement = $(selector).html() || '';
                var tempElement = "<div ej-prop='" + index + "' class='" + templateObject[selector].key + " ej-angular-template'>" + actElement + '</div>';
                return tempElement;
            };
            ej.template.render = ej.template['text/x-template'];
        }
    }
});
System.register("ej/accordion.component", ["ej/core"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var core_3;
    var Outputs, ComplexProperties, Inputs, AccordionComponent, EJ_ACCORDION_COMPONENTS;
    return {
        setters:[
            function (core_3_1) {
                core_3 = core_3_1;
            }],
        execute: function() {
            Outputs = ['activate', 'ajaxBeforeLoad', 'ajaxError', 'ajaxLoad', 'ajaxSuccess',
                'beforeActivate', 'beforeInactivate', 'create', 'destroy', 'inActivate'
            ];
            ComplexProperties = ['ajaxSettings', 'customIcon'];
            Inputs = core_3.Utils.AngularizeInputs(['ajaxSettings', 'allowKeyboardNavigation', 'collapseSpeed', 'collapsible', 'cssClass',
                'customIcon', 'disabledItems', 'enableAnimation', 'enabled', 'enabledItems',
                'enableMultipleOpen', 'enablePersistence', 'enableRTL', 'events', 'expandSpeed',
                'headerSize', 'height', 'heightAdjustMode', 'htmlAttributes', 'selectedItemIndex',
                'selectedItems', 'showCloseButton', 'showRoundedCorner', 'width', 'ajaxSettings.async',
                'ajaxSettings.cache', 'ajaxSettings.contentType', 'ajaxSettings.data', 'ajaxSettings.dataType', 'ajaxSettings.type',
                'customIcon.header', 'customIcon.selectedHeader'], []);
            exports_2("AccordionComponent", AccordionComponent = core_3.CreateComponent('Accordion', {
                selector: 'ej-accordion',
                inputs: Inputs,
                outputs: Outputs,
                template: '<ng-content></ng-content>',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_2("EJ_ACCORDION_COMPONENTS", EJ_ACCORDION_COMPONENTS = [AccordionComponent]);
        }
    }
});
System.register("ej/autocomplete.component", ["ej/core"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var core_4;
    var Outputs, ComplexProperties, Inputs, AutocompleteComponent, AutocompleteValueAccessor, EJ_AUTOCOMPLETE_COMPONENTS;
    return {
        setters:[
            function (core_4_1) {
                core_4 = core_4_1;
            }],
        execute: function() {
            Outputs = ['actionBegin', 'actionSuccess', 'actionComplete', 'actionFailure', 'change',
                'close', 'create', 'destroy', 'focusIn', 'focusOut',
                'open', 'select'
            ];
            ComplexProperties = ['fields', 'multiColumnSettings'];
            Inputs = core_4.Utils.AngularizeInputs(['addNewText', 'allowAddNew', 'allowSorting', 'animateType', 'autoFocus',
                'caseSensitiveSearch', 'cssClass', 'dataSource', 'delaySuggestionTimeout', 'delimiterChar',
                'emptyResultText', 'enableAutoFill', 'enabled', 'enableDistinct', 'enablePersistence',
                'enableRTL', 'fields', 'filterType', 'height', 'highlightSearch',
                'itemsCount', 'locale', 'minCharacter', 'multiColumnSettings', 'multiSelectMode',
                'popupHeight', 'popupWidth', 'query', 'readOnly', 'selectValueByKey',
                'showEmptyResultText', 'showLoadingIcon', 'showPopupButton', 'showRoundedCorner', 'showResetIcon',
                'sortOrder', 'template', 'validationMessage', 'validationRules', 'value',
                'visible', 'watermarkText', 'width', 'fields.groupBy', 'fields.htmlAttributes',
                'fields.key', 'fields.text', 'multiColumnSettings.enable', 'multiColumnSettings.showHeader', 'multiColumnSettings.stringFormat',
                'multiColumnSettings.columns'], []);
            exports_3("AutocompleteComponent", AutocompleteComponent = core_4.CreateComponent('Autocomplete', {
                selector: '[ej-autocomplete]',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_3("AutocompleteValueAccessor", AutocompleteValueAccessor = core_4.CreateControlValueAccessor('[ej-autocomplete]', AutocompleteComponent));
            exports_3("EJ_AUTOCOMPLETE_COMPONENTS", EJ_AUTOCOMPLETE_COMPONENTS = [AutocompleteComponent, AutocompleteValueAccessor]);
        }
    }
});
System.register("ej/barcode.component", ["ej/core"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var core_5;
    var Outputs, ComplexProperties, Inputs, BarcodeComponent, EJ_BARCODE_COMPONENTS;
    return {
        setters:[
            function (core_5_1) {
                core_5 = core_5_1;
            }],
        execute: function() {
            Outputs = ['load'
            ];
            ComplexProperties = ['quietZone'];
            Inputs = core_5.Utils.AngularizeInputs(['barcodeToTextGapHeight', 'barHeight', 'darkBarColor', 'displayText', 'enabled',
                'encodeStartStopSymbol', 'lightBarColor', 'narrowBarWidth', 'quietZone', 'symbologyType',
                'text', 'textColor', 'wideBarWidth', 'xDimension', 'quietZone.all',
                'quietZone.bottom', 'quietZone.left', 'quietZone.right', 'quietZone.top'], []);
            exports_4("BarcodeComponent", BarcodeComponent = core_5.CreateComponent('Barcode', {
                selector: 'ej-barcode',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_4("EJ_BARCODE_COMPONENTS", EJ_BARCODE_COMPONENTS = [BarcodeComponent]);
        }
    }
});
System.register("ej/bulletgraph.component", ["ej/core"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var core_6;
    var QualitativeRangeDirective, QualitativeRangesDirective, QuantitativeScaleSettingsFeatureMeasureDirective, QuantitativeScaleSettingsFeatureMeasuresDirective, Outputs, ComplexProperties, Inputs, BulletGraphComponent, EJ_BULLETGRAPH_COMPONENTS;
    return {
        setters:[
            function (core_6_1) {
                core_6 = core_6_1;
            }],
        execute: function() {
            exports_5("QualitativeRangeDirective", QualitativeRangeDirective = core_6.CreateComplexDirective({
                selector: 'e-qualitativeranges>e-qualitativerange',
                inputs: ['rangeEnd', 'rangeOpacity', 'rangeStroke'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_6.forwardRef(function () { return BulletGraphComponent; })
            }));
            exports_5("QualitativeRangesDirective", QualitativeRangesDirective = core_6.CreateArrayTagDirective('qualitativeRanges', 'ej-bulletgraph>e-qualitativeranges', QualitativeRangeDirective));
            exports_5("QuantitativeScaleSettingsFeatureMeasureDirective", QuantitativeScaleSettingsFeatureMeasureDirective = core_6.CreateComplexDirective({
                selector: 'e-quantitativescalesettings-featuremeasures>e-quantitativescalesettings-featuremeasure',
                inputs: ['category', 'comparativeMeasureValue', 'value'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_6.forwardRef(function () { return BulletGraphComponent; })
            }));
            exports_5("QuantitativeScaleSettingsFeatureMeasuresDirective", QuantitativeScaleSettingsFeatureMeasuresDirective = core_6.CreateArrayTagDirective('quantitativeScaleSettings.featureMeasures', 'ej-bulletgraph>e-quantitativescalesettings-featuremeasures', QuantitativeScaleSettingsFeatureMeasureDirective));
            Outputs = ['drawCaption', 'drawCategory', 'drawComparativeMeasureSymbol', 'drawFeatureMeasureBar', 'drawIndicator',
                'drawLabels', 'drawQualitativeRanges', 'load'
            ];
            ComplexProperties = ['captionSettings', 'quantitativeScaleSettings', 'tooltipSettings', 'captionSettings.font', 'captionSettings.indicator',
                'captionSettings.indicator.font', 'captionSettings.indicator.location', 'captionSettings.indicator.symbol', 'captionSettings.indicator.symbol.border', 'captionSettings.indicator.symbol.size',
                'captionSettings.location', 'captionSettings.subTitle', 'captionSettings.subTitle.font', 'captionSettings.subTitle.location', 'quantitativeScaleSettings.comparativeMeasureSettings',
                'quantitativeScaleSettings.featuredMeasureSettings', 'quantitativeScaleSettings.fields', 'quantitativeScaleSettings.labelSettings', 'quantitativeScaleSettings.labelSettings.font', 'quantitativeScaleSettings.location',
                'quantitativeScaleSettings.majorTickSettings', 'quantitativeScaleSettings.minorTickSettings'];
            Inputs = core_6.Utils.AngularizeInputs(['applyRangeStrokeToLabels', 'applyRangeStrokeToTicks', 'captionSettings', 'comparativeMeasureValue', 'enableAnimation',
                'flowDirection', 'height', 'isResponsive', 'orientation', 'qualitativeRangeSize',
                'quantitativeScaleLength', 'quantitativeScaleSettings', 'theme', 'tooltipSettings', 'value',
                'width', 'captionSettings.enableTrim', 'captionSettings.font', 'captionSettings.font.color', 'captionSettings.font.fontFamily',
                'captionSettings.font.fontStyle', 'captionSettings.font.fontWeight', 'captionSettings.font.opacity', 'captionSettings.font.size', 'captionSettings.indicator',
                'captionSettings.indicator.font', 'captionSettings.indicator.location', 'captionSettings.indicator.padding', 'captionSettings.indicator.symbol', 'captionSettings.indicator.text',
                'captionSettings.indicator.textAlignment', 'captionSettings.indicator.textAnchor', 'captionSettings.indicator.textAngle', 'captionSettings.indicator.textPosition', 'captionSettings.indicator.textSpacing',
                'captionSettings.indicator.visible', 'captionSettings.location', 'captionSettings.location.x', 'captionSettings.location.y', 'captionSettings.padding',
                'captionSettings.subTitle', 'captionSettings.subTitle.font', 'captionSettings.subTitle.location', 'captionSettings.subTitle.padding', 'captionSettings.subTitle.text',
                'captionSettings.subTitle.textAlignment', 'captionSettings.subTitle.textAnchor', 'captionSettings.subTitle.textAngle', 'captionSettings.subTitle.textPosition', 'captionSettings.text',
                'captionSettings.textAlignment', 'captionSettings.textAnchor', 'captionSettings.textAngle', 'captionSettings.textPosition', 'quantitativeScaleSettings.comparativeMeasureSettings',
                'quantitativeScaleSettings.comparativeMeasureSettings.stroke', 'quantitativeScaleSettings.comparativeMeasureSettings.width', 'quantitativeScaleSettings.featuredMeasureSettings', 'quantitativeScaleSettings.featuredMeasureSettings.stroke', 'quantitativeScaleSettings.featuredMeasureSettings.width',
                'quantitativeScaleSettings.fields', 'quantitativeScaleSettings.fields.category', 'quantitativeScaleSettings.fields.comparativeMeasure', 'quantitativeScaleSettings.fields.dataSource', 'quantitativeScaleSettings.fields.featureMeasures',
                'quantitativeScaleSettings.fields.query', 'quantitativeScaleSettings.fields.tableName', 'quantitativeScaleSettings.interval', 'quantitativeScaleSettings.labelSettings', 'quantitativeScaleSettings.labelSettings.font',
                'quantitativeScaleSettings.labelSettings.labelPlacement', 'quantitativeScaleSettings.labelSettings.labelPrefix', 'quantitativeScaleSettings.labelSettings.labelSuffix', 'quantitativeScaleSettings.labelSettings.offset', 'quantitativeScaleSettings.labelSettings.position',
                'quantitativeScaleSettings.labelSettings.size', 'quantitativeScaleSettings.labelSettings.stroke', 'quantitativeScaleSettings.location', 'quantitativeScaleSettings.location.x', 'quantitativeScaleSettings.location.y',
                'quantitativeScaleSettings.majorTickSettings', 'quantitativeScaleSettings.majorTickSettings.size', 'quantitativeScaleSettings.majorTickSettings.stroke', 'quantitativeScaleSettings.majorTickSettings.width', 'quantitativeScaleSettings.maximum',
                'quantitativeScaleSettings.minimum', 'quantitativeScaleSettings.minorTickSettings', 'quantitativeScaleSettings.minorTickSettings.size', 'quantitativeScaleSettings.minorTickSettings.stroke', 'quantitativeScaleSettings.minorTickSettings.width',
                'quantitativeScaleSettings.minorTicksPerInterval', 'quantitativeScaleSettings.tickPlacement', 'quantitativeScaleSettings.tickPosition', 'tooltipSettings.captionTemplate', 'tooltipSettings.enableCaptionTooltip',
                'tooltipSettings.template', 'tooltipSettings.visible', 'qualitativeRanges', 'quantitativeScaleSettings.featureMeasures'], []);
            exports_5("BulletGraphComponent", BulletGraphComponent = core_6.CreateComponent('BulletGraph', {
                selector: 'ej-bulletgraph',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _qualitativeRanges: new core_6.ContentChild(QualitativeRangesDirective),
                    _quantitativeScaleSettings_featureMeasures: new core_6.ContentChild(QuantitativeScaleSettingsFeatureMeasuresDirective),
                }
            }, {
                tags: ['qualitativeRanges', 'quantitativeScaleSettings.featureMeasures'],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_5("EJ_BULLETGRAPH_COMPONENTS", EJ_BULLETGRAPH_COMPONENTS = [BulletGraphComponent, QualitativeRangesDirective, QuantitativeScaleSettingsFeatureMeasuresDirective, QualitativeRangeDirective, QuantitativeScaleSettingsFeatureMeasureDirective]);
        }
    }
});
System.register("ej/button.component", ["ej/core"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var core_7;
    var Outputs, ComplexProperties, Inputs, ButtonComponent, ButtonValueAccessor, EJ_BUTTON_COMPONENTS;
    return {
        setters:[
            function (core_7_1) {
                core_7 = core_7_1;
            }],
        execute: function() {
            Outputs = ['click', 'create', 'destroy'
            ];
            ComplexProperties = [];
            Inputs = core_7.Utils.AngularizeInputs(['contentType', 'cssClass', 'enabled', 'enableRTL', 'height',
                'htmlAttributes', 'imagePosition', 'prefixIcon', 'repeatButton', 'showRoundedCorner',
                'size', 'suffixIcon', 'text', 'timeInterval', 'type',
                'width'], []);
            exports_6("ButtonComponent", ButtonComponent = core_7.CreateComponent('Button', {
                selector: '[ej-button]',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_6("ButtonValueAccessor", ButtonValueAccessor = core_7.CreateControlValueAccessor('[ej-button]', ButtonComponent));
            exports_6("EJ_BUTTON_COMPONENTS", EJ_BUTTON_COMPONENTS = [ButtonComponent, ButtonValueAccessor]);
        }
    }
});
System.register("ej/chart.component", ["ej/core"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var core_8;
    var TrendlineDirective, TrendlinesDirective, PointDirective, PointsDirective, SeriesDirective, SeriesCollectionDirective, IndicatorDirective, IndicatorsDirective, AnnotationDirective, AnnotationsDirective, PrimaryXAxisStripLineDirective, PrimaryXAxisStripLineCollectionDirective, PrimaryYAxisStripLineDirective, PrimaryYAxisStripLineCollectionDirective, RowDefinitionDirective, RowDefinitionsDirective, ColumnDefinitionDirective, ColumnDefinitionsDirective, Outputs, ComplexProperties, Inputs, ChartComponent, EJ_CHART_COMPONENTS;
    return {
        setters:[
            function (core_8_1) {
                core_8 = core_8_1;
            }],
        execute: function() {
            exports_7("TrendlineDirective", TrendlineDirective = core_8.CreateComplexDirective({
                selector: 'e-trendlines>e-trendline',
                inputs: ['visibility', 'type', 'name', 'fill', 'width',
                    'opacity', 'dashArray', 'forwardForecast', 'backwardForecast', 'polynomialOrder',
                    'period'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_8.forwardRef(function () { return ChartComponent; })
            }));
            exports_7("TrendlinesDirective", TrendlinesDirective = core_8.CreateArrayTagDirective('trendlines', 'e-series>e-trendlines', TrendlineDirective));
            exports_7("PointDirective", PointDirective = core_8.CreateComplexDirective({
                selector: 'e-points>e-point',
                inputs: ['border', 'border.color', 'border.width', 'visibleOnLegend', 'showIntermediateSum',
                    'showTotalSum', 'close', 'size', 'fill', 'high',
                    'low', 'marker', 'marker.border', 'marker.border.color', 'marker.border.width',
                    'marker.dataLabel', 'marker.dataLabel.angle', 'marker.dataLabel.border', 'marker.dataLabel.border.color', 'marker.dataLabel.border.width',
                    'marker.dataLabel.connectorLine', 'marker.dataLabel.connectorLine.type', 'marker.dataLabel.connectorLine.width', 'marker.dataLabel.fill', 'marker.dataLabel.font',
                    'marker.dataLabel.font.fontFamily', 'marker.dataLabel.font.fontStyle', 'marker.dataLabel.font.fontWeight', 'marker.dataLabel.font.opacity', 'marker.dataLabel.font.size',
                    'marker.dataLabel.horizontalTextAlignment', 'marker.dataLabel.margin', 'marker.dataLabel.margin.bottom', 'marker.dataLabel.margin.left', 'marker.dataLabel.margin.right',
                    'marker.dataLabel.margin.top', 'marker.dataLabel.opacity', 'marker.dataLabel.shape', 'marker.dataLabel.textPosition', 'marker.dataLabel.verticalTextAlignment',
                    'marker.dataLabel.visible', 'marker.dataLabel.template', 'marker.dataLabel.offset', 'marker.fill', 'marker.imageUrl',
                    'marker.opacity', 'marker.shape', 'marker.size', 'marker.size.height', 'marker.size.width',
                    'marker.visible', 'open', 'text', 'x', 'y'],
                queries: {}
            }, {
                tags: [],
                complexes: ['border', 'marker', 'marker.border', 'marker.dataLabel', 'marker.dataLabel.border', 'marker.dataLabel.connectorLine', 'marker.dataLabel.font', 'marker.dataLabel.margin', 'marker.size'],
                type: core_8.forwardRef(function () { return ChartComponent; })
            }));
            exports_7("PointsDirective", PointsDirective = core_8.CreateArrayTagDirective('points', 'e-series>e-points', PointDirective));
            exports_7("SeriesDirective", SeriesDirective = core_8.CreateComplexDirective({
                selector: 'e-seriescollection>e-series',
                inputs: ['bearFillColor', 'border', 'border.color', 'border.width', 'border.dashArray',
                    'bullFillColor', 'columnFacet', 'columnWidth', 'columnSpacing', 'dashArray',
                    'dataSource', 'doughnutCoefficient', 'doughnutSize', 'drawType', 'enableAnimation',
                    'enableSmartLabels', 'endAngle', 'explode', 'explodeAll', 'explodeIndex',
                    'explodeOffset', 'fill', 'font', 'font.color', 'font.fontFamily',
                    'font.fontStyle', 'font.fontWeight', 'font.opacity', 'font.size', 'funnelHeight',
                    'funnelWidth', 'gapRatio', 'isClosed', 'isStacking', 'isTransposed',
                    'labelPosition', 'lineCap', 'lineJoin', 'marker', 'marker.border',
                    'marker.border.color', 'marker.border.width', 'marker.dataLabel', 'marker.dataLabel.angle', 'marker.dataLabel.maximumLabelWidth',
                    'marker.dataLabel.enableWrap', 'marker.dataLabel.border', 'marker.dataLabel.border.color', 'marker.dataLabel.border.width', 'marker.dataLabel.connectorLine',
                    'marker.dataLabel.connectorLine.type', 'marker.dataLabel.connectorLine.width', 'marker.dataLabel.connectorLine.color', 'marker.dataLabel.connectorLine.height', 'marker.dataLabel.fill',
                    'marker.dataLabel.font', 'marker.dataLabel.font.fontFamily', 'marker.dataLabel.font.color', 'marker.dataLabel.font.fontStyle', 'marker.dataLabel.font.fontWeight',
                    'marker.dataLabel.font.opacity', 'marker.dataLabel.font.size', 'marker.dataLabel.horizontalTextAlignment', 'marker.dataLabel.margin', 'marker.dataLabel.margin.bottom',
                    'marker.dataLabel.margin.left', 'marker.dataLabel.margin.right', 'marker.dataLabel.margin.top', 'marker.dataLabel.opacity', 'marker.dataLabel.shape',
                    'marker.dataLabel.textMappingName', 'marker.dataLabel.textPosition', 'marker.dataLabel.verticalTextAlignment', 'marker.dataLabel.visible', 'marker.dataLabel.template',
                    'marker.dataLabel.offset', 'marker.fill', 'marker.imageUrl', 'marker.opacity', 'marker.shape',
                    'marker.size', 'marker.size.height', 'marker.size.width', 'marker.visible', 'name',
                    'opacity', 'palette', 'pieCoefficient', 'emptyPointSettings', 'emptyPointSettings.visible',
                    'emptyPointSettings.displayMode', 'emptyPointSettings.style', 'emptyPointSettings.style.color', 'emptyPointSettings.style.border', 'emptyPointSettings.style.border.color',
                    'emptyPointSettings.style.border.width', 'positiveFill', 'connectorLine', 'connectorLine.width', 'connectorLine.color',
                    'connectorLine.dashArray', 'connectorLine.opacity', 'errorBar', 'errorBar.visibility', 'errorBar.type',
                    'errorBar.mode', 'errorBar.direction', 'errorBar.verticalErrorValue', 'errorBar.horizontalErrorValue', 'errorBar.horizontalPositiveErrorValue',
                    'errorBar.horizontalNegativeErrorValue', 'errorBar.verticalPositiveErrorValue', 'errorBar.verticalNegativeErrorValue', 'errorBar.fill', 'errorBar.width',
                    'errorBar.cap', 'errorBar.cap.visible', 'errorBar.cap.width', 'errorBar.cap.length', 'errorBar.cap.fill',
                    'points', 'pyramidMode', 'query', 'startAngle', 'cornerRadius',
                    'cornerRadius.topLeft', 'cornerRadius.topRight', 'cornerRadius.bottomLeft', 'cornerRadius.bottomRight', 'tooltip',
                    'tooltip.border', 'tooltip.border.color', 'tooltip.border.width', 'tooltip.rx', 'tooltip.ry',
                    'tooltip.duration', 'tooltip.enableAnimation', 'tooltip.fill', 'tooltip.format', 'tooltip.opacity',
                    'tooltip.template', 'tooltip.visible', 'type', 'visibility', 'visibleOnLegend',
                    'xAxisName', 'xName', 'yAxisName', 'yName', 'high',
                    'low', 'open', 'close', 'pointColorMappingName', 'zOrder',
                    'size', 'trendlines', 'highlightSettings', 'highlightSettings.enable', 'highlightSettings.mode',
                    'highlightSettings.color', 'highlightSettings.opacity', 'highlightSettings.border', 'highlightSettings.border.color', 'highlightSettings.border.width',
                    'highlightSettings.pattern', 'highlightSettings.customPattern', 'selectionSettings', 'selectionSettings.enable', 'selectionSettings.mode',
                    'selectionSettings.type', 'selectionSettings.rangeType', 'selectionSettings.color', 'selectionSettings.opacity', 'selectionSettings.border',
                    'selectionSettings.border.color', 'selectionSettings.border.width', 'selectionSettings.pattern', 'selectionSettings.customPattern'],
                queries: {
                    _Trendlines: new core_8.ContentChild(TrendlinesDirective),
                    _points: new core_8.ContentChild(PointsDirective),
                }
            }, {
                tags: ['Trendlines', 'points'],
                complexes: ['border', 'font', 'marker', 'marker.border', 'marker.dataLabel', 'marker.dataLabel.border', 'marker.dataLabel.connectorLine', 'marker.dataLabel.font', 'marker.dataLabel.margin', 'marker.size', 'emptyPointSettings', 'emptyPointSettings.style', 'emptyPointSettings.style.border', 'connectorLine', 'errorBar', 'errorBar.cap', 'cornerRadius', 'tooltip', 'tooltip.border', 'highlightSettings', 'highlightSettings.border', 'selectionSettings', 'selectionSettings.border'],
                type: core_8.forwardRef(function () { return ChartComponent; })
            }));
            exports_7("SeriesCollectionDirective", SeriesCollectionDirective = core_8.CreateArrayTagDirective('series', 'ej-chart>e-seriescollection', SeriesDirective));
            exports_7("IndicatorDirective", IndicatorDirective = core_8.CreateComplexDirective({
                selector: 'e-indicators>e-indicator',
                inputs: ['dPeriod', 'enableAnimation', 'fill', 'histogram', 'histogram.border',
                    'histogram.border.color', 'histogram.border.width', 'histogram.fill', 'histogram.opacity', 'kPeriod',
                    'longPeriod', 'lowerLine', 'lowerLine.fill', 'lowerLine.width', 'macdLine',
                    'macdLine.fill', 'macdLine.width', 'macdType', 'period', 'periodLine',
                    'periodLine.fill', 'periodLine.width', 'seriesName', 'shortPeriod', 'standardDeviations',
                    'tooltip', 'tooltip.border', 'tooltip.border.color', 'tooltip.border.width', 'tooltip.duration',
                    'tooltip.enableAnimation', 'tooltip.format', 'tooltip.fill', 'tooltip.opacity', 'tooltip.visible',
                    'trigger', 'visibility', 'type', 'upperLine', 'upperLine.fill',
                    'upperLine.width', 'width', 'xAxisName', 'yAxisName'],
                queries: {}
            }, {
                tags: [],
                complexes: ['histogram', 'histogram.border', 'lowerLine', 'macdLine', 'periodLine', 'tooltip', 'tooltip.border', 'upperLine'],
                type: core_8.forwardRef(function () { return ChartComponent; })
            }));
            exports_7("IndicatorsDirective", IndicatorsDirective = core_8.CreateArrayTagDirective('indicators', 'ej-chart>e-indicators', IndicatorDirective));
            exports_7("AnnotationDirective", AnnotationDirective = core_8.CreateComplexDirective({
                selector: 'e-annotations>e-annotation',
                inputs: ['angle', 'content', 'coordinateUnit', 'horizontalAlignment', 'margin',
                    'margin.bottom', 'margin.left', 'margin.right', 'margin.top', 'opacity',
                    'region', 'verticalAlignment', 'visible', 'x', 'xAxisName',
                    'y', 'yAxisName'],
                queries: {}
            }, {
                tags: [],
                complexes: ['margin'],
                type: core_8.forwardRef(function () { return ChartComponent; })
            }));
            exports_7("AnnotationsDirective", AnnotationsDirective = core_8.CreateArrayTagDirective('annotations', 'ej-chart>e-annotations', AnnotationDirective));
            exports_7("PrimaryXAxisStripLineDirective", PrimaryXAxisStripLineDirective = core_8.CreateComplexDirective({
                selector: 'e-primaryxaxis-striplinecollection>e-primaryxaxis-stripline',
                inputs: ['borderColor', 'color', 'end', 'font', 'font.color',
                    'font.fontFamily', 'font.fontStyle', 'font.fontWeight', 'font.opacity', 'font.size',
                    'start', 'startFromAxis', 'text', 'textAlignment', 'visible',
                    'width', 'zIndex'],
                queries: {}
            }, {
                tags: [],
                complexes: ['font'],
                type: core_8.forwardRef(function () { return ChartComponent; })
            }));
            exports_7("PrimaryXAxisStripLineCollectionDirective", PrimaryXAxisStripLineCollectionDirective = core_8.CreateArrayTagDirective('primaryXAxis.stripLine', 'ej-chart>e-primaryxaxis-striplinecollection', PrimaryXAxisStripLineDirective));
            exports_7("PrimaryYAxisStripLineDirective", PrimaryYAxisStripLineDirective = core_8.CreateComplexDirective({
                selector: 'e-primaryyaxis-striplinecollection>e-primaryyaxis-stripline',
                inputs: ['borderColor', 'color', 'end', 'font', 'font.color',
                    'font.fontFamily', 'font.fontStyle', 'font.fontWeight', 'font.opacity', 'font.size',
                    'start', 'startFromAxis', 'text', 'textAlignment', 'visible',
                    'width', 'zIndex'],
                queries: {}
            }, {
                tags: [],
                complexes: ['font'],
                type: core_8.forwardRef(function () { return ChartComponent; })
            }));
            exports_7("PrimaryYAxisStripLineCollectionDirective", PrimaryYAxisStripLineCollectionDirective = core_8.CreateArrayTagDirective('primaryYAxis.stripLine', 'ej-chart>e-primaryyaxis-striplinecollection', PrimaryYAxisStripLineDirective));
            exports_7("RowDefinitionDirective", RowDefinitionDirective = core_8.CreateComplexDirective({
                selector: 'e-rowdefinitions>e-rowdefinition',
                inputs: ['unit', 'rowHeight', 'lineColor', 'lineWidth'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_8.forwardRef(function () { return ChartComponent; })
            }));
            exports_7("RowDefinitionsDirective", RowDefinitionsDirective = core_8.CreateArrayTagDirective('rowDefinitions', 'ej-chart>e-rowdefinitions', RowDefinitionDirective));
            exports_7("ColumnDefinitionDirective", ColumnDefinitionDirective = core_8.CreateComplexDirective({
                selector: 'e-columndefinitions>e-columndefinition',
                inputs: ['unit', 'columnWidth', 'lineColor', 'lineWidth'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_8.forwardRef(function () { return ChartComponent; })
            }));
            exports_7("ColumnDefinitionsDirective", ColumnDefinitionsDirective = core_8.CreateArrayTagDirective('columnDefinitions', 'ej-chart>e-columndefinitions', ColumnDefinitionDirective));
            Outputs = ['animationComplete', 'axesLabelRendering', 'axesLabelsInitialize', 'axesRangeCalculate', 'axesTitleRendering',
                'chartAreaBoundsCalculate', 'create', 'destroy', 'displayTextRendering', 'legendBoundsCalculate',
                'legendItemClick', 'legendItemMouseMove', 'legendItemRendering', 'load', 'pointRegionClick',
                'pointRegionMouseMove', 'preRender', 'seriesRegionClick', 'seriesRendering', 'symbolRendering',
                'titleRendering', 'toolTipInitialize', 'trackAxisToolTip', 'trackToolTip', 'axisLabelClick',
                'axisLabelMouseMove', 'chartClick', 'chartMouseMove', 'chartDoubleClick', 'annotationClick',
                'afterResize', 'beforeResize', 'errorBarRendering', 'scrollChanged', 'scrollStart',
                'scrollEnd'
            ];
            ComplexProperties = ['border', 'exportSettings', 'chartArea', 'commonSeriesOptions', 'crosshair',
                'legend', 'primaryXAxis', 'primaryYAxis', 'size', 'title',
                'zooming', 'chartArea.border', 'commonSeriesOptions.border', 'commonSeriesOptions.font', 'commonSeriesOptions.marker',
                'commonSeriesOptions.marker.border', 'commonSeriesOptions.marker.dataLabel', 'commonSeriesOptions.marker.dataLabel.border', 'commonSeriesOptions.marker.dataLabel.connectorLine', 'commonSeriesOptions.marker.dataLabel.font',
                'commonSeriesOptions.marker.dataLabel.margin', 'commonSeriesOptions.marker.size', 'commonSeriesOptions.cornerRadius', 'commonSeriesOptions.tooltip', 'commonSeriesOptions.tooltip.border',
                'commonSeriesOptions.emptyPointSettings', 'commonSeriesOptions.emptyPointSettings.style', 'commonSeriesOptions.emptyPointSettings.style.border', 'commonSeriesOptions.connectorLine', 'commonSeriesOptions.errorBar',
                'commonSeriesOptions.errorBar.cap', 'commonSeriesOptions.highlightSettings', 'commonSeriesOptions.highlightSettings.border', 'commonSeriesOptions.selectionSettings', 'commonSeriesOptions.selectionSettings.border',
                'crosshair.trackballTooltipSettings', 'crosshair.trackballTooltipSettings.border', 'crosshair.marker', 'crosshair.marker.border', 'crosshair.marker.size',
                'crosshair.line', 'legend.border', 'legend.font', 'legend.itemStyle', 'legend.itemStyle.border',
                'legend.location', 'legend.size', 'legend.title', 'legend.title.font', 'primaryXAxis.alternateGridBand',
                'primaryXAxis.alternateGridBand.even', 'primaryXAxis.alternateGridBand.odd', 'primaryXAxis.axisLine', 'primaryXAxis.crosshairLabel', 'primaryXAxis.font',
                'primaryXAxis.majorGridLines', 'primaryXAxis.majorTickLines', 'primaryXAxis.minorGridLines', 'primaryXAxis.minorTickLines', 'primaryXAxis.range',
                'primaryXAxis.labelBorder', 'primaryXAxis.title', 'primaryXAxis.title.font', 'primaryYAxis.alternateGridBand', 'primaryYAxis.alternateGridBand.even',
                'primaryYAxis.alternateGridBand.odd', 'primaryYAxis.axisLine', 'primaryYAxis.crosshairLabel', 'primaryYAxis.font', 'primaryYAxis.majorGridLines',
                'primaryYAxis.majorTickLines', 'primaryYAxis.minorGridLines', 'primaryYAxis.minorTickLines', 'primaryYAxis.range', 'primaryYAxis.labelBorder',
                'primaryYAxis.title', 'primaryYAxis.title.font', 'title.border', 'title.font', 'title.subTitle',
                'title.subTitle.font', 'title.subTitle.border'];
            Inputs = core_8.Utils.AngularizeInputs(['backGroundImageUrl', 'border', 'exportSettings', 'chartArea', 'commonSeriesOptions',
                'crosshair', 'depth', 'enable3D', 'enableCanvasRendering', 'enableRotation',
                'isResponsive', 'legend', 'locale', 'palette', 'Margin',
                'perspectiveAngle', 'primaryXAxis', 'primaryYAxis', 'rotation', 'sideBySideSeriesPlacement',
                'size', 'theme', 'tilt', 'title', 'wallSize',
                'zooming', 'border.color', 'border.opacity', 'border.width', 'exportSettings.filename',
                'exportSettings.action', 'exportSettings.angle', 'exportSettings.type', 'exportSettings.orientation', 'exportSettings.mode',
                'exportSettings.multipleExport', 'chartArea.background', 'chartArea.border', 'chartArea.border.color', 'chartArea.border.opacity',
                'chartArea.border.width', 'commonSeriesOptions.border', 'commonSeriesOptions.border.color', 'commonSeriesOptions.border.dashArray', 'commonSeriesOptions.border.width',
                'commonSeriesOptions.columnFacet', 'commonSeriesOptions.columnWidth', 'commonSeriesOptions.columnSpacing', 'commonSeriesOptions.visibleOnLegend', 'commonSeriesOptions.dashArray',
                'commonSeriesOptions.dataSource', 'commonSeriesOptions.doughnutCoefficient', 'commonSeriesOptions.doughnutSize', 'commonSeriesOptions.drawType', 'commonSeriesOptions.enableAnimation',
                'commonSeriesOptions.enableSmartLabels', 'commonSeriesOptions.endAngle', 'commonSeriesOptions.explode', 'commonSeriesOptions.explodeAll', 'commonSeriesOptions.explodeIndex',
                'commonSeriesOptions.explodeOffset', 'commonSeriesOptions.fill', 'commonSeriesOptions.font', 'commonSeriesOptions.font.color', 'commonSeriesOptions.font.fontFamily',
                'commonSeriesOptions.font.fontStyle', 'commonSeriesOptions.font.fontWeight', 'commonSeriesOptions.font.opacity', 'commonSeriesOptions.font.size', 'commonSeriesOptions.funnelHeight',
                'commonSeriesOptions.funnelWidth', 'commonSeriesOptions.gapRatio', 'commonSeriesOptions.isClosed', 'commonSeriesOptions.isStacking', 'commonSeriesOptions.isTransposed',
                'commonSeriesOptions.labelPosition', 'commonSeriesOptions.lineCap', 'commonSeriesOptions.lineJoin', 'commonSeriesOptions.marker', 'commonSeriesOptions.marker.border',
                'commonSeriesOptions.marker.dataLabel', 'commonSeriesOptions.marker.fill', 'commonSeriesOptions.marker.imageUrl', 'commonSeriesOptions.marker.opacity', 'commonSeriesOptions.marker.shape',
                'commonSeriesOptions.marker.size', 'commonSeriesOptions.marker.visible', 'commonSeriesOptions.opacity', 'commonSeriesOptions.palette', 'commonSeriesOptions.pieCoefficient',
                'commonSeriesOptions.pointColorMappingName', 'commonSeriesOptions.pyramidMode', 'commonSeriesOptions.startAngle', 'commonSeriesOptions.cornerRadius', 'commonSeriesOptions.cornerRadius.topLeft',
                'commonSeriesOptions.cornerRadius.topRight', 'commonSeriesOptions.cornerRadius.bottomLeft', 'commonSeriesOptions.cornerRadius.bottomRight', 'commonSeriesOptions.tooltip', 'commonSeriesOptions.tooltip.border',
                'commonSeriesOptions.tooltip.rx', 'commonSeriesOptions.tooltip.ry', 'commonSeriesOptions.tooltip.duration', 'commonSeriesOptions.tooltip.enableAnimation', 'commonSeriesOptions.tooltip.fill',
                'commonSeriesOptions.tooltip.format', 'commonSeriesOptions.tooltip.opacity', 'commonSeriesOptions.tooltip.template', 'commonSeriesOptions.tooltip.visible', 'commonSeriesOptions.type',
                'commonSeriesOptions.xAxisName', 'commonSeriesOptions.xName', 'commonSeriesOptions.yAxisName', 'commonSeriesOptions.yName', 'commonSeriesOptions.high',
                'commonSeriesOptions.low', 'commonSeriesOptions.open', 'commonSeriesOptions.close', 'commonSeriesOptions.zOrder', 'commonSeriesOptions.size',
                'commonSeriesOptions.emptyPointSettings', 'commonSeriesOptions.emptyPointSettings.visible', 'commonSeriesOptions.emptyPointSettings.displayMode', 'commonSeriesOptions.emptyPointSettings.style', 'commonSeriesOptions.positiveFill',
                'commonSeriesOptions.connectorLine', 'commonSeriesOptions.connectorLine.width', 'commonSeriesOptions.connectorLine.color', 'commonSeriesOptions.connectorLine.dashArray', 'commonSeriesOptions.connectorLine.opacity',
                'commonSeriesOptions.errorBar', 'commonSeriesOptions.errorBar.visibility', 'commonSeriesOptions.errorBar.type', 'commonSeriesOptions.errorBar.mode', 'commonSeriesOptions.errorBar.direction',
                'commonSeriesOptions.errorBar.verticalErrorValue', 'commonSeriesOptions.errorBar.horizontalErrorValue', 'commonSeriesOptions.errorBar.horizontalPositiveErrorValue', 'commonSeriesOptions.errorBar.horizontalNegativeErrorValue', 'commonSeriesOptions.errorBar.verticalPositiveErrorValue',
                'commonSeriesOptions.errorBar.verticalNegativeErrorValue', 'commonSeriesOptions.errorBar.fill', 'commonSeriesOptions.errorBar.width', 'commonSeriesOptions.errorBar.cap', 'commonSeriesOptions.highlightSettings',
                'commonSeriesOptions.highlightSettings.enable', 'commonSeriesOptions.highlightSettings.mode', 'commonSeriesOptions.highlightSettings.color', 'commonSeriesOptions.highlightSettings.opacity', 'commonSeriesOptions.highlightSettings.border',
                'commonSeriesOptions.highlightSettings.pattern', 'commonSeriesOptions.highlightSettings.customPattern', 'commonSeriesOptions.selectionSettings', 'commonSeriesOptions.selectionSettings.enable', 'commonSeriesOptions.selectionSettings.type',
                'commonSeriesOptions.selectionSettings.mode', 'commonSeriesOptions.selectionSettings.rangeType', 'commonSeriesOptions.selectionSettings.color', 'commonSeriesOptions.selectionSettings.opacity', 'commonSeriesOptions.selectionSettings.border',
                'commonSeriesOptions.selectionSettings.pattern', 'commonSeriesOptions.selectionSettings.customPattern', 'crosshair.trackballTooltipSettings', 'crosshair.trackballTooltipSettings.border', 'crosshair.trackballTooltipSettings.fill',
                'crosshair.trackballTooltipSettings.rx', 'crosshair.trackballTooltipSettings.ry', 'crosshair.trackballTooltipSettings.opacity', 'crosshair.trackballTooltipSettings.mode', 'crosshair.marker',
                'crosshair.marker.border', 'crosshair.marker.opacity', 'crosshair.marker.size', 'crosshair.marker.visible', 'crosshair.line',
                'crosshair.line.color', 'crosshair.line.width', 'crosshair.type', 'crosshair.visible', 'legend.alignment',
                'legend.background', 'legend.border', 'legend.border.color', 'legend.border.width', 'legend.columnCount',
                'legend.enableScrollbar', 'legend.fill', 'legend.font', 'legend.font.fontFamily', 'legend.font.fontStyle',
                'legend.font.fontWeight', 'legend.font.size', 'legend.itemPadding', 'legend.itemStyle', 'legend.itemStyle.border',
                'legend.itemStyle.height', 'legend.itemStyle.width', 'legend.location', 'legend.location.x', 'legend.location.y',
                'legend.opacity', 'legend.position', 'legend.rowCount', 'legend.shape', 'legend.size',
                'legend.size.height', 'legend.size.width', 'legend.title', 'legend.title.font', 'legend.title.text',
                'legend.title.textAlignment', 'legend.textOverflow', 'legend.textWidth', 'legend.visible', 'primaryXAxis.alternateGridBand',
                'primaryXAxis.alternateGridBand.even', 'primaryXAxis.alternateGridBand.odd', 'primaryXAxis.crossesAt', 'primaryXAxis.crossesInAxis', 'primaryXAxis.isIndexed',
                'primaryXAxis.axisLine', 'primaryXAxis.axisLine.dashArray', 'primaryXAxis.axisLine.offset', 'primaryXAxis.axisLine.visible', 'primaryXAxis.axisLine.width',
                'primaryXAxis.columnIndex', 'primaryXAxis.columnSpan', 'primaryXAxis.crosshairLabel', 'primaryXAxis.crosshairLabel.visible', 'primaryXAxis.desiredIntervals',
                'primaryXAxis.labelPlacement', 'primaryXAxis.edgeLabelPlacement', 'primaryXAxis.enableTrim', 'primaryXAxis.font', 'primaryXAxis.font.fontFamily',
                'primaryXAxis.font.fontStyle', 'primaryXAxis.font.fontWeight', 'primaryXAxis.font.opacity', 'primaryXAxis.font.size', 'primaryXAxis.intervalType',
                'primaryXAxis.isInversed', 'primaryXAxis.labelFormat', 'primaryXAxis.labelIntersectAction', 'primaryXAxis.labelPosition', 'primaryXAxis.alignment',
                'primaryXAxis.labelRotation', 'primaryXAxis.logBase', 'primaryXAxis.majorGridLines', 'primaryXAxis.majorGridLines.dashArray', 'primaryXAxis.majorGridLines.color',
                'primaryXAxis.majorGridLines.opacity', 'primaryXAxis.majorGridLines.visible', 'primaryXAxis.majorGridLines.width', 'primaryXAxis.majorTickLines', 'primaryXAxis.majorTickLines.size',
                'primaryXAxis.majorTickLines.visible', 'primaryXAxis.majorTickLines.width', 'primaryXAxis.maximumLabels', 'primaryXAxis.maximumLabelWidth', 'primaryXAxis.minorGridLines',
                'primaryXAxis.minorGridLines.dashArray', 'primaryXAxis.minorGridLines.visible', 'primaryXAxis.minorGridLines.width', 'primaryXAxis.minorTickLines', 'primaryXAxis.minorTickLines.size',
                'primaryXAxis.minorTickLines.visible', 'primaryXAxis.minorTickLines.width', 'primaryXAxis.minorTicksPerInterval', 'primaryXAxis.name', 'primaryXAxis.opposedPosition',
                'primaryXAxis.plotOffset', 'primaryXAxis.range', 'primaryXAxis.range.min', 'primaryXAxis.range.max', 'primaryXAxis.range.interval',
                'primaryXAxis.rangePadding', 'primaryXAxis.roundingPlaces', 'primaryXAxis.tickLinesPosition', 'primaryXAxis.labelBorder', 'primaryXAxis.labelBorder.color',
                'primaryXAxis.labelBorder.width', 'primaryXAxis.title', 'primaryXAxis.title.enableTrim', 'primaryXAxis.title.font', 'primaryXAxis.title.maximumTitleWidth',
                'primaryXAxis.title.text', 'primaryXAxis.title.visible', 'primaryXAxis.title.offset', 'primaryXAxis.title.position', 'primaryXAxis.title.alignment',
                'primaryXAxis.valueType', 'primaryXAxis.visible', 'primaryXAxis.zoomFactor', 'primaryXAxis.zoomPosition', 'primaryYAxis.alternateGridBand',
                'primaryYAxis.alternateGridBand.even', 'primaryYAxis.alternateGridBand.odd', 'primaryYAxis.axisLine', 'primaryYAxis.axisLine.dashArray', 'primaryYAxis.axisLine.offset',
                'primaryYAxis.axisLine.visible', 'primaryYAxis.axisLine.width', 'primaryYAxis.crossesAt', 'primaryYAxis.crossesInAxis', 'primaryYAxis.crosshairLabel',
                'primaryYAxis.crosshairLabel.visible', 'primaryYAxis.desiredIntervals', 'primaryYAxis.labelPlacement', 'primaryYAxis.edgeLabelPlacement', 'primaryYAxis.enableTrim',
                'primaryYAxis.font', 'primaryYAxis.font.fontFamily', 'primaryYAxis.font.fontStyle', 'primaryYAxis.font.fontWeight', 'primaryYAxis.font.opacity',
                'primaryYAxis.font.size', 'primaryYAxis.intervalType', 'primaryYAxis.isInversed', 'primaryYAxis.labelFormat', 'primaryYAxis.labelIntersectAction',
                'primaryYAxis.labelPosition', 'primaryYAxis.alignment', 'primaryYAxis.logBase', 'primaryYAxis.majorGridLines', 'primaryYAxis.majorGridLines.dashArray',
                'primaryYAxis.majorGridLines.color', 'primaryYAxis.majorGridLines.opacity', 'primaryYAxis.majorGridLines.visible', 'primaryYAxis.majorGridLines.width', 'primaryYAxis.majorTickLines',
                'primaryYAxis.majorTickLines.size', 'primaryYAxis.majorTickLines.visible', 'primaryYAxis.majorTickLines.width', 'primaryYAxis.maximumLabels', 'primaryYAxis.maximumLabelWidth',
                'primaryYAxis.minorGridLines', 'primaryYAxis.minorGridLines.dashArray', 'primaryYAxis.minorGridLines.visible', 'primaryYAxis.minorGridLines.width', 'primaryYAxis.minorTickLines',
                'primaryYAxis.minorTickLines.size', 'primaryYAxis.minorTickLines.visible', 'primaryYAxis.minorTickLines.width', 'primaryYAxis.minorTicksPerInterval', 'primaryYAxis.name',
                'primaryYAxis.opposedPosition', 'primaryYAxis.plotOffset', 'primaryYAxis.range', 'primaryYAxis.range.min', 'primaryYAxis.range.max',
                'primaryYAxis.range.interval', 'primaryYAxis.rangePadding', 'primaryYAxis.roundingPlaces', 'primaryYAxis.rowIndex', 'primaryYAxis.rowSpan',
                'primaryYAxis.tickLinesPosition', 'primaryYAxis.labelBorder', 'primaryYAxis.labelBorder.color', 'primaryYAxis.labelBorder.width', 'primaryYAxis.title',
                'primaryYAxis.title.enableTrim', 'primaryYAxis.title.font', 'primaryYAxis.title.maximumTitleWidth', 'primaryYAxis.title.text', 'primaryYAxis.title.visible',
                'primaryYAxis.title.offset', 'primaryYAxis.title.position', 'primaryYAxis.title.alignment', 'primaryYAxis.valueType', 'primaryYAxis.visible',
                'primaryYAxis.zoomFactor', 'primaryYAxis.zoomPosition', 'size.height', 'size.width', 'title.background',
                'title.border', 'title.border.width', 'title.border.color', 'title.border.opacity', 'title.border.cornerRadius',
                'title.font', 'title.font.fontFamily', 'title.font.fontStyle', 'title.font.fontWeight', 'title.font.opacity',
                'title.font.size', 'title.subTitle', 'title.subTitle.font', 'title.subTitle.background', 'title.subTitle.border',
                'title.subTitle.text', 'title.subTitle.textAlignment', 'title.text', 'title.textAlignment', 'zooming.enable',
                'zooming.enablePinching', 'zooming.enableDeferredZoom', 'zooming.enableMouseWheel', 'zooming.type', 'zooming.toolbarItems',
                'annotations', 'columnDefinitions', 'indicators', 'axes', 'rowDefinitions',
                'series', 'commonSeriesOptions.trendlines', 'primaryXAxis.multiLevelLabels', 'primaryXAxis.stripLine', 'primaryYAxis.multiLevelLabels',
                'primaryYAxis.stripLine'], []);
            exports_7("ChartComponent", ChartComponent = core_8.CreateComponent('Chart', {
                selector: 'ej-chart',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _series: new core_8.ContentChild(SeriesCollectionDirective),
                    _indicators: new core_8.ContentChild(IndicatorsDirective),
                    _annotations: new core_8.ContentChild(AnnotationsDirective),
                    _primaryXAxis_stripLine: new core_8.ContentChild(PrimaryXAxisStripLineCollectionDirective),
                    _primaryYAxis_stripLine: new core_8.ContentChild(PrimaryYAxisStripLineCollectionDirective),
                    _rowDefinitions: new core_8.ContentChild(RowDefinitionsDirective),
                    _columnDefinitions: new core_8.ContentChild(ColumnDefinitionsDirective),
                }
            }, {
                tags: ['series', 'indicators', 'annotations', 'primaryXAxis.stripLine', 'primaryYAxis.stripLine', 'rowDefinitions', 'columnDefinitions'],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_7("EJ_CHART_COMPONENTS", EJ_CHART_COMPONENTS = [ChartComponent, TrendlinesDirective, PointsDirective, SeriesCollectionDirective, IndicatorsDirective, AnnotationsDirective, PrimaryXAxisStripLineCollectionDirective, PrimaryYAxisStripLineCollectionDirective, RowDefinitionsDirective, ColumnDefinitionsDirective, TrendlineDirective, PointDirective, SeriesDirective, IndicatorDirective, AnnotationDirective, PrimaryXAxisStripLineDirective, PrimaryYAxisStripLineDirective, RowDefinitionDirective, ColumnDefinitionDirective]);
        }
    }
});
System.register("ej/checkbox.component", ["ej/core"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var core_9;
    var Outputs, ComplexProperties, Inputs, CheckBoxComponent, EJ_CHECKBOX_COMPONENTS;
    return {
        setters:[
            function (core_9_1) {
                core_9 = core_9_1;
            }],
        execute: function() {
            Outputs = ['beforeChange', 'change', 'create', 'destroy',
                'model.checkedChange: checkedChange'];
            ComplexProperties = [];
            Inputs = core_9.Utils.AngularizeInputs(['checkState', 'cssClass', 'enabled', 'enablePersistence', 'enableRTL',
                'enableTriState', 'htmlAttributes', 'id', 'idPrefix', 'name',
                'showRoundedCorner', 'size', 'text', 'validationMessage', 'validationRules',
                'value'], ['checked']);
            exports_8("CheckBoxComponent", CheckBoxComponent = core_9.CreateComponent('CheckBox', {
                selector: 'ej-checkbox',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: ['checked'],
                complexes: ComplexProperties,
            }));
            exports_8("EJ_CHECKBOX_COMPONENTS", EJ_CHECKBOX_COMPONENTS = [CheckBoxComponent]);
        }
    }
});
System.register("ej/circulargauge.component", ["ej/core"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var core_10;
    var PointerDirective, PointersDirective, LabelDirective, LabelsDirective, TickDirective, TicksDirective, RangeDirective, RangesDirective, StateRangeDirective, StateRangesDirective, IndicatorDirective, IndicatorsDirective, SubGaugeDirective, SubGaugesDirective, ScaleDirective, ScalesDirective, Outputs, ComplexProperties, Inputs, CircularGaugeComponent, EJ_CIRCULARGAUGE_COMPONENTS;
    return {
        setters:[
            function (core_10_1) {
                core_10 = core_10_1;
            }],
        execute: function() {
            exports_9("PointerDirective", PointerDirective = core_10.CreateComplexDirective({
                selector: 'e-pointers>e-pointer',
                inputs: ['backgroundColor', 'backNeedleLength', 'border', 'border.color', 'border.width',
                    'distanceFromScale', 'gradients', 'imageUrl', 'length', 'markerType',
                    'needleType', 'opacity', 'placement', 'pointerValueText', 'pointerValueText.angle',
                    'pointerValueText.autoAngle', 'pointerValueText.color', 'pointerValueText.distance', 'pointerValueText.font', 'pointerValueText.font.fontFamily',
                    'pointerValueText.font.fontStyle', 'pointerValueText.font.size', 'pointerValueText.opacity', 'pointerValueText.showValue', 'showBackNeedle',
                    'type', 'value', 'width'],
                queries: {}
            }, {
                tags: [],
                complexes: ['border', 'pointerValueText', 'pointerValueText.font'],
                type: core_10.forwardRef(function () { return CircularGaugeComponent; })
            }));
            exports_9("PointersDirective", PointersDirective = core_10.CreateArrayTagDirective('pointers', 'e-scales>e-pointers', PointerDirective));
            exports_9("LabelDirective", LabelDirective = core_10.CreateComplexDirective({
                selector: 'e-labels>e-label',
                inputs: ['angle', 'autoAngle', 'color', 'distanceFromScale', 'font',
                    'font.fontFamily', 'font.fontStyle', 'font.size', 'includeFirstValue', 'opacity',
                    'placement', 'type', 'unitText', 'unitTextPosition'],
                queries: {}
            }, {
                tags: [],
                complexes: ['font'],
                type: core_10.forwardRef(function () { return CircularGaugeComponent; })
            }));
            exports_9("LabelsDirective", LabelsDirective = core_10.CreateArrayTagDirective('labels', 'e-scales>e-labels', LabelDirective));
            exports_9("TickDirective", TickDirective = core_10.CreateComplexDirective({
                selector: 'e-ticks>e-tick',
                inputs: ['angle', 'color', 'distanceFromScale', 'height', 'placement',
                    'type', 'width'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_10.forwardRef(function () { return CircularGaugeComponent; })
            }));
            exports_9("TicksDirective", TicksDirective = core_10.CreateArrayTagDirective('ticks', 'e-scales>e-ticks', TickDirective));
            exports_9("RangeDirective", RangeDirective = core_10.CreateComplexDirective({
                selector: 'e-ranges>e-range',
                inputs: ['backgroundColor', 'border', 'border.color', 'border.width', 'distanceFromScale',
                    'endValue', 'endWidth', 'gradients', 'opacity', 'placement',
                    'size', 'startValue', 'startWidth'],
                queries: {}
            }, {
                tags: [],
                complexes: ['border'],
                type: core_10.forwardRef(function () { return CircularGaugeComponent; })
            }));
            exports_9("RangesDirective", RangesDirective = core_10.CreateArrayTagDirective('ranges', 'e-scales>e-ranges', RangeDirective));
            exports_9("StateRangeDirective", StateRangeDirective = core_10.CreateComplexDirective({
                selector: 'e-stateranges>e-staterange',
                inputs: ['backgroundColor', 'borderColor', 'endValue', 'font', 'startValue',
                    'text', 'textColor'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_10.forwardRef(function () { return CircularGaugeComponent; })
            }));
            exports_9("StateRangesDirective", StateRangesDirective = core_10.CreateArrayTagDirective('stateRanges', 'e-indicators>e-stateranges', StateRangeDirective));
            exports_9("IndicatorDirective", IndicatorDirective = core_10.CreateComplexDirective({
                selector: 'e-indicators>e-indicator',
                inputs: ['height', 'imageUrl', 'position', 'position.x', 'position.y',
                    'stateRanges', 'type', 'width'],
                queries: {
                    _stateRanges: new core_10.ContentChild(StateRangesDirective),
                }
            }, {
                tags: ['stateRanges'],
                complexes: ['position'],
                type: core_10.forwardRef(function () { return CircularGaugeComponent; })
            }));
            exports_9("IndicatorsDirective", IndicatorsDirective = core_10.CreateArrayTagDirective('indicators', 'e-scales>e-indicators', IndicatorDirective));
            exports_9("SubGaugeDirective", SubGaugeDirective = core_10.CreateComplexDirective({
                selector: 'e-subgauges>e-subgauge',
                inputs: ['height', 'position', 'position.x', 'position.y', 'width'],
                queries: {}
            }, {
                tags: [],
                complexes: ['position'],
                type: core_10.forwardRef(function () { return CircularGaugeComponent; })
            }));
            exports_9("SubGaugesDirective", SubGaugesDirective = core_10.CreateArrayTagDirective('subGauges', 'e-scales>e-subgauges', SubGaugeDirective));
            exports_9("ScaleDirective", ScaleDirective = core_10.CreateComplexDirective({
                selector: 'e-scales>e-scale',
                inputs: ['backgroundColor', 'border', 'border.color', 'border.width', 'direction',
                    'customLabels', 'indicators', 'labels', 'majorIntervalValue', 'maximum',
                    'minimum', 'minorIntervalValue', 'opacity', 'pointerCap', 'pointerCap.backgroundColor',
                    'pointerCap.borderColor', 'pointerCap.borderWidth', 'pointerCap.interiorGradient', 'pointerCap.radius', 'pointers',
                    'radius', 'ranges', 'shadowOffset', 'showIndicators', 'showLabels',
                    'showPointers', 'showRanges', 'showScaleBar', 'showTicks', 'size',
                    'startAngle', 'subGauges', 'sweepAngle', 'ticks'],
                queries: {
                    _pointers: new core_10.ContentChild(PointersDirective),
                    _labels: new core_10.ContentChild(LabelsDirective),
                    _ticks: new core_10.ContentChild(TicksDirective),
                    _ranges: new core_10.ContentChild(RangesDirective),
                    _indicators: new core_10.ContentChild(IndicatorsDirective),
                    _subGauges: new core_10.ContentChild(SubGaugesDirective),
                }
            }, {
                tags: ['pointers', 'labels', 'ticks', 'ranges', 'indicators', 'subGauges'],
                complexes: ['border', 'pointerCap'],
                type: core_10.forwardRef(function () { return CircularGaugeComponent; })
            }));
            exports_9("ScalesDirective", ScalesDirective = core_10.CreateArrayTagDirective('scales', 'ej-circulargauge>e-scales', ScaleDirective));
            Outputs = ['drawCustomLabel', 'drawIndicators', 'drawLabels', 'drawPointerCap', 'drawPointers',
                'drawRange', 'drawTicks', 'load', 'mouseClick', 'mouseClickMove',
                'mouseClickUp', 'renderComplete',
                'model.valueChange: valueChange', 'model.minimumChange: minimumChange', 'model.maximumChange: maximumChange'];
            ComplexProperties = ['frame', 'tooltip'];
            Inputs = core_10.Utils.AngularizeInputs(['animationSpeed', 'backgroundColor', 'distanceFromCorner', 'enableAnimation', 'frame',
                'gaugePosition', 'height', 'interiorGradient', 'isRadialGradient', 'isResponsive',
                'outerCustomLabelPosition', 'radius', 'readOnly', 'theme', 'tooltip',
                'width', 'frame.backgroundImageUrl', 'frame.frameType', 'frame.halfCircleFrameEndAngle', 'frame.halfCircleFrameStartAngle',
                'tooltip.showCustomLabelTooltip', 'tooltip.showLabelTooltip', 'tooltip.templateID', 'scales', 'scales.indicators.stateRanges'], ['value', 'minimum', 'maximum']);
            exports_9("CircularGaugeComponent", CircularGaugeComponent = core_10.CreateComponent('CircularGauge', {
                selector: 'ej-circulargauge',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _scales: new core_10.ContentChild(ScalesDirective),
                }
            }, {
                tags: ['scales'],
                twoways: ['value', 'minimum', 'maximum'],
                complexes: ComplexProperties,
            }));
            exports_9("EJ_CIRCULARGAUGE_COMPONENTS", EJ_CIRCULARGAUGE_COMPONENTS = [CircularGaugeComponent, PointersDirective, LabelsDirective, TicksDirective, RangesDirective, StateRangesDirective, IndicatorsDirective, SubGaugesDirective, ScalesDirective, PointerDirective, LabelDirective, TickDirective, RangeDirective, StateRangeDirective, IndicatorDirective, SubGaugeDirective, ScaleDirective]);
        }
    }
});
System.register("ej/colorpicker.component", ["ej/core"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var core_11;
    var Outputs, ComplexProperties, Inputs, ColorPickerComponent, ColorPickerValueAccessor, EJ_COLORPICKER_COMPONENTS;
    return {
        setters:[
            function (core_11_1) {
                core_11 = core_11_1;
            }],
        execute: function() {
            Outputs = ['change', 'close', 'create', 'destroy', 'open',
                'select',
                'model.valueChange: valueChange', 'model.opacityValueChange: opacityValueChange'];
            ComplexProperties = ['buttonText', 'tooltipText'];
            Inputs = core_11.Utils.AngularizeInputs(['buttonText', 'buttonMode', 'columns', 'cssClass', 'custom',
                'displayInline', 'enabled', 'enableOpacity', 'htmlAttributes', 'locale',
                'modelType', 'palette', 'presetType', 'showApplyCancel', 'showClearButton',
                'showPreview', 'showRecentColors', 'showSwitcher', 'showTooltip', 'toolIcon',
                'tooltipText', 'buttonText.apply', 'buttonText.cancel', 'buttonText.swatches', 'tooltipText.switcher',
                'tooltipText.addbutton', 'tooltipText.basic', 'tooltipText.monochrome', 'tooltipText.flatcolors', 'tooltipText.seawolf',
                'tooltipText.webcolors', 'tooltipText.sandy', 'tooltipText.pinkshades', 'tooltipText.misty', 'tooltipText.citrus',
                'tooltipText.vintage', 'tooltipText.moonlight', 'tooltipText.candycrush', 'tooltipText.currentcolor', 'tooltipText.selectedcolor'], ['value', 'opacityValue']);
            exports_10("ColorPickerComponent", ColorPickerComponent = core_11.CreateComponent('ColorPicker', {
                selector: '[ej-colorpicker]',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: ['value', 'opacityValue'],
                complexes: ComplexProperties,
            }));
            exports_10("ColorPickerValueAccessor", ColorPickerValueAccessor = core_11.CreateControlValueAccessor('[ej-colorpicker]', ColorPickerComponent));
            exports_10("EJ_COLORPICKER_COMPONENTS", EJ_COLORPICKER_COMPONENTS = [ColorPickerComponent, ColorPickerValueAccessor]);
        }
    }
});
System.register("ej/currencytextbox.component", ["ej/core"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var core_12;
    var Outputs, ComplexProperties, Inputs, CurrencyTextboxComponent, CurrencyTextboxValueAccessor, EJ_CURRENCYTEXTBOX_COMPONENTS;
    return {
        setters:[
            function (core_12_1) {
                core_12 = core_12_1;
            }],
        execute: function() {
            Outputs = ['change', 'create', 'destroy', 'focusIn', 'focusOut'
            ];
            ComplexProperties = [];
            Inputs = core_12.Utils.AngularizeInputs(['cssClass', 'decimalPlaces', 'enabled', 'enablePersistence', 'enableRTL',
                'enableStrictMode', 'groupSize', 'groupSeparator', 'height', 'htmlAttributes',
                'incrementStep', 'locale', 'maxValue', 'minValue', 'name',
                'negativePattern', 'positivePattern', 'readOnly', 'showRoundedCorner', 'showSpinButton',
                'validateOnType', 'validationMessage', 'validationRules', 'value', 'watermarkText',
                'width'], []);
            exports_11("CurrencyTextboxComponent", CurrencyTextboxComponent = core_12.CreateComponent('CurrencyTextbox', {
                selector: '[ej-currencytextbox]',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_11("CurrencyTextboxValueAccessor", CurrencyTextboxValueAccessor = core_12.CreateControlValueAccessor('[ej-currencytextbox]', CurrencyTextboxComponent));
            exports_11("EJ_CURRENCYTEXTBOX_COMPONENTS", EJ_CURRENCYTEXTBOX_COMPONENTS = [CurrencyTextboxComponent, CurrencyTextboxValueAccessor]);
        }
    }
});
System.register("ej/datepicker.component", ["ej/core"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var core_13;
    var Outputs, ComplexProperties, Inputs, DatePickerComponent, DatePickerValueAccessor, EJ_DATEPICKER_COMPONENTS;
    return {
        setters:[
            function (core_13_1) {
                core_13 = core_13_1;
            }],
        execute: function() {
            Outputs = ['beforeClose', 'beforeDateCreate', 'beforeOpen', 'change', 'close',
                'create', 'destroy', 'focusIn', 'focusOut', 'navigate',
                'open', 'select'
            ];
            ComplexProperties = ['fields'];
            Inputs = core_13.Utils.AngularizeInputs(['allowEdit', 'allowDrillDown', 'blackoutDates', 'buttonText', 'cssClass',
                'dateFormat', 'dayHeaderFormat', 'depthLevel', 'displayInline', 'enableAnimation',
                'enabled', 'enablePersistence', 'enableRTL', 'enableStrictMode', 'fields',
                'headerFormat', 'height', 'highlightSection', 'highlightWeekend', 'htmlAttributes',
                'locale', 'maxDate', 'minDate', 'readOnly', 'showDisabledRange',
                'showFooter', 'showOtherMonths', 'showPopupButton', 'showRoundedCorner', 'showTooltip',
                'specialDates', 'startDay', 'startLevel', 'stepMonths', 'tooltipFormat',
                'validationMessage', 'validationRules', 'value', 'watermarkText', 'width',
                'fields.date', 'fields.iconClass', 'fields.tooltip', 'fields.cssClass'], []);
            exports_12("DatePickerComponent", DatePickerComponent = core_13.CreateComponent('DatePicker', {
                selector: '[ej-datepicker]',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_12("DatePickerValueAccessor", DatePickerValueAccessor = core_13.CreateControlValueAccessor('[ej-datepicker]', DatePickerComponent));
            exports_12("EJ_DATEPICKER_COMPONENTS", EJ_DATEPICKER_COMPONENTS = [DatePickerComponent, DatePickerValueAccessor]);
        }
    }
});
System.register("ej/datetimepicker.component", ["ej/core"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var core_14;
    var Outputs, ComplexProperties, Inputs, DateTimePickerComponent, DateTimePickerValueAccessor, EJ_DATETIMEPICKER_COMPONENTS;
    return {
        setters:[
            function (core_14_1) {
                core_14 = core_14_1;
            }],
        execute: function() {
            Outputs = ['beforeClose', 'beforeOpen', 'change', 'close', 'create',
                'destroy', 'focusIn', 'focusOut', 'open'
            ];
            ComplexProperties = ['buttonText', 'timeDrillDown'];
            Inputs = core_14.Utils.AngularizeInputs(['buttonText', 'cssClass', 'dateTimeFormat', 'dayHeaderFormat', 'depthLevel',
                'enableAnimation', 'enabled', 'enablePersistence', 'enableRTL', 'enableStrictMode',
                'headerFormat', 'height', 'htmlAttributes', 'interval', 'locale',
                'maxDateTime', 'minDateTime', 'popupPosition', 'readOnly', 'showOtherMonths',
                'showPopupButton', 'showRoundedCorner', 'startDay', 'startLevel', 'stepMonths',
                'timeDisplayFormat', 'timeDrillDown', 'timePopupWidth', 'validationMessage', 'validationRules',
                'value', 'watermarkText', 'width', 'buttonText.done', 'buttonText.timeNow',
                'buttonText.timeTitle', 'buttonText.today', 'timeDrillDown.enabled', 'timeDrillDown.interval', 'timeDrillDown.showMeridian',
                'timeDrillDown.autoClose'], []);
            exports_13("DateTimePickerComponent", DateTimePickerComponent = core_14.CreateComponent('DateTimePicker', {
                selector: '[ej-datetimepicker]',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_13("DateTimePickerValueAccessor", DateTimePickerValueAccessor = core_14.CreateControlValueAccessor('[ej-datetimepicker]', DateTimePickerComponent));
            exports_13("EJ_DATETIMEPICKER_COMPONENTS", EJ_DATETIMEPICKER_COMPONENTS = [DateTimePickerComponent, DateTimePickerValueAccessor]);
        }
    }
});
System.register("ej/diagram.component", ["ej/core"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var core_15;
    var CommandManagerCommandDirective, CommandManagerCommandsDirective, SegmentDirective, SegmentsDirective, ConnectorLabelDirective, ConnectorLabelsDirective, ConnectorDirective, ConnectorsDirective, NodeLabelDirective, NodeLabelsDirective, PhaseDirective, PhasesDirective, PortDirective, PortsDirective, NodeDirective, NodesDirective, Outputs, ComplexProperties, Inputs, DiagramComponent, EJ_DIAGRAM_COMPONENTS;
    return {
        setters:[
            function (core_15_1) {
                core_15 = core_15_1;
            }],
        execute: function() {
            exports_14("CommandManagerCommandDirective", CommandManagerCommandDirective = core_15.CreateComplexDirective({
                selector: 'e-commandmanager-commands>e-commandmanager-command',
                inputs: ['canExecute', 'execute', 'gesture', 'gesture.key', 'gesture.keyModifiers',
                    'parameter'],
                queries: {}
            }, {
                tags: [],
                complexes: ['gesture'],
                type: core_15.forwardRef(function () { return DiagramComponent; })
            }));
            exports_14("CommandManagerCommandsDirective", CommandManagerCommandsDirective = core_15.CreateArrayTagDirective('commandManager.commands', 'ej-diagram>e-commandmanager-commands', CommandManagerCommandDirective));
            exports_14("SegmentDirective", SegmentDirective = core_15.CreateComplexDirective({
                selector: 'e-segments>e-segment',
                inputs: ['direction', 'length', 'point', 'point1', 'point2',
                    'type', 'vector1', 'vector2'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_15.forwardRef(function () { return DiagramComponent; })
            }));
            exports_14("SegmentsDirective", SegmentsDirective = core_15.CreateArrayTagDirective('segments', 'e-connectors>e-segments', SegmentDirective));
            exports_14("ConnectorLabelDirective", ConnectorLabelDirective = core_15.CreateComplexDirective({
                selector: 'e-connectorlabels>e-connectorlabel',
                inputs: ['alignment', 'bold', 'borderColor', 'borderWidth', 'boundaryConstraints',
                    'fillColor', 'fontColor', 'fontFamily', 'fontSize', 'horizontalAlignment',
                    'italic', 'mode', 'name', 'offset', 'margin',
                    'margin.right', 'margin.left', 'margin.top', 'margin.bottom', 'opacity',
                    'readOnly', 'relativeMode', 'rotateAngle', 'segmentOffset', 'text',
                    'textAlign', 'textDecoration', 'verticalAlignment', 'visible', 'width',
                    'wrapping'],
                queries: {}
            }, {
                tags: [],
                complexes: ['margin'],
                type: core_15.forwardRef(function () { return DiagramComponent; })
            }));
            exports_14("ConnectorLabelsDirective", ConnectorLabelsDirective = core_15.CreateArrayTagDirective('labels', 'e-connectors>e-connectorlabels', ConnectorLabelDirective));
            exports_14("ConnectorDirective", ConnectorDirective = core_15.CreateComplexDirective({
                selector: 'e-connectors>e-connector',
                inputs: ['addInfo', 'bridgeSpace', 'constraints', 'cornerRadius', 'cssClass',
                    'horizontalAlign', 'labels', 'lineColor', 'lineDashArray', 'lineHitPadding',
                    'lineWidth', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop',
                    'name', 'opacity', 'paletteItem', 'parent', 'segments',
                    'shape', 'shape.type', 'shape.flow', 'shape.association', 'shape.message',
                    'shape.sequence', 'shape.relationship', 'shape.multiplicity', 'shape.multiplicity.type', 'shape.multiplicity.source',
                    'shape.multiplicity.source.optional', 'shape.multiplicity.source.lowerBounds', 'shape.multiplicity.source.upperBounds', 'shape.multiplicity.target', 'sourceDecorator',
                    'sourceDecorator.borderColor', 'sourceDecorator.borderWidth', 'sourceDecorator.fillColor', 'sourceDecorator.height', 'sourceDecorator.pathData',
                    'sourceDecorator.shape', 'sourceDecorator.width', 'sourceNode', 'sourcePadding', 'sourcePoint',
                    'sourcePoint.x', 'sourcePoint.y', 'sourcePort', 'targetDecorator', 'targetDecorator.borderColor',
                    'targetDecorator.fillColor', 'targetDecorator.height', 'targetDecorator.pathData', 'targetDecorator.shape', 'targetDecorator.width',
                    'targetNode', 'targetPadding', 'targetPoint', 'targetPort', 'tooltip',
                    'verticalAlign', 'visible', 'zOrder'],
                queries: {
                    _segments: new core_15.ContentChild(SegmentsDirective),
                    _labels: new core_15.ContentChild(ConnectorLabelsDirective),
                }
            }, {
                tags: ['segments', 'labels'],
                complexes: ['shape', 'shape.multiplicity', 'shape.multiplicity.source', 'sourceDecorator', 'sourcePoint', 'targetDecorator'],
                type: core_15.forwardRef(function () { return DiagramComponent; })
            }));
            exports_14("ConnectorsDirective", ConnectorsDirective = core_15.CreateArrayTagDirective('connectors', 'ej-diagram>e-connectors', ConnectorDirective));
            exports_14("NodeLabelDirective", NodeLabelDirective = core_15.CreateComplexDirective({
                selector: 'e-nodelabels>e-nodelabel',
                inputs: ['bold', 'borderColor', 'borderWidth', 'fillColor', 'fontColor',
                    'fontFamily', 'fontSize', 'horizontalAlignment', 'italic', 'margin',
                    'mode', 'name', 'offset', 'opacity', 'readOnly',
                    'rotateAngle', 'text', 'textAlign', 'textDecoration', 'verticalAlignment',
                    'visible', 'width', 'wrapping'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_15.forwardRef(function () { return DiagramComponent; })
            }));
            exports_14("NodeLabelsDirective", NodeLabelsDirective = core_15.CreateArrayTagDirective('labels', 'e-nodes>e-nodelabels', NodeLabelDirective));
            exports_14("PhaseDirective", PhaseDirective = core_15.CreateComplexDirective({
                selector: 'e-phases>e-phase',
                inputs: ['label', 'lineColor', 'lineDashArray', 'lineWidth', 'name',
                    'offset', 'orientation', 'type'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_15.forwardRef(function () { return DiagramComponent; })
            }));
            exports_14("PhasesDirective", PhasesDirective = core_15.CreateArrayTagDirective('phases', 'e-nodes>e-phases', PhaseDirective));
            exports_14("PortDirective", PortDirective = core_15.CreateComplexDirective({
                selector: 'e-ports>e-port',
                inputs: ['borderColor', 'borderWidth', 'connectorPadding', 'constraints', 'fillColor',
                    'name', 'offset', 'pathData', 'shape', 'size',
                    'visibility'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_15.forwardRef(function () { return DiagramComponent; })
            }));
            exports_14("PortsDirective", PortsDirective = core_15.CreateArrayTagDirective('ports', 'e-nodes>e-ports', PortDirective));
            exports_14("NodeDirective", NodeDirective = core_15.CreateComplexDirective({
                selector: 'e-nodes>e-node',
                inputs: ['activity', 'addInfo', 'annotation', 'annotation.angle', 'annotation.direction',
                    'annotation.height', 'annotation.length', 'annotation.text', 'annotation.width', 'borderColor',
                    'borderDashArray', 'borderWidth', 'canUngroup', 'children', 'classifier',
                    'class', 'class.name', 'class.attributes', 'class.methods', 'collapseIcon',
                    'collapseIcon.borderColor', 'collapseIcon.borderWidth', 'collapseIcon.fillColor', 'collapseIcon.height', 'collapseIcon.horizontalAlignment',
                    'collapseIcon.margin', 'collapseIcon.offset', 'collapseIcon.shape', 'collapseIcon.verticalAlignment', 'connectorPadding',
                    'constraints', 'container', 'container.orientation', 'container.type', 'cornerRadius',
                    'cssClass', 'data', 'data.type', 'data.collection', 'enumeration',
                    'enumeration.name', 'enumeration.members', 'event', 'excludeFromLayout', 'expandIcon',
                    'expandIcon.borderColor', 'expandIcon.borderWidth', 'expandIcon.fillColor', 'expandIcon.height', 'expandIcon.horizontalAlignment',
                    'expandIcon.margin', 'expandIcon.offset', 'expandIcon.shape', 'expandIcon.verticalAlignment', 'fillColor',
                    'gateway', 'gradient', 'gradient.LinearGradient', 'gradient.LinearGradient.stops', 'gradient.LinearGradient.x1',
                    'gradient.LinearGradient.x2', 'gradient.LinearGradient.y1', 'gradient.LinearGradient.y2', 'gradient.RadialGradient', 'gradient.RadialGradient.cx',
                    'gradient.RadialGradient.cy', 'gradient.RadialGradient.fx', 'gradient.RadialGradient.fy', 'gradient.RadialGradient.stops', 'gradient.Stop',
                    'gradient.Stop.color', 'gradient.Stop.offset', 'gradient.Stop.opacity', 'group', 'header',
                    'height', 'horizontalAlign', 'inEdges', 'interface', 'interface.name',
                    'interface.attributes', 'interface.methods', 'isExpanded', 'isSwimlane', 'labels',
                    'lanes', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop',
                    'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'name',
                    'offsetX', 'offsetY', 'opacity', 'orientation', 'outEdges',
                    'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'paletteItem',
                    'paletteItem.enableScale', 'paletteItem.height', 'paletteItem.margin', 'paletteItem.previewHeight', 'paletteItem.previewWidth',
                    'paletteItem.width', 'parent', 'pathData', 'phases', 'phaseSize',
                    'pivot', 'points', 'ports', 'rotateAngle', 'shadow',
                    'shadow.angle', 'shadow.distance', 'shadow.opacity', 'shape', 'source',
                    'subProcess', 'subProcess.adhoc', 'subProcess.boundary', 'subProcess.compensation', 'subProcess.collapsed',
                    'subProcess.event', 'subProcess.events', 'subProcess.loop', 'subProcess.Processes', 'subProcess.trigger',
                    'subProcess.type', 'task', 'task.call', 'task.compensation', 'task.loop',
                    'task.type', 'templateId', 'textBlock', 'tooltip', 'trigger',
                    'type', 'verticalAlign', 'visible', 'width', 'zOrder'],
                queries: {
                    _labels: new core_15.ContentChild(NodeLabelsDirective),
                    _phases: new core_15.ContentChild(PhasesDirective),
                    _ports: new core_15.ContentChild(PortsDirective),
                }
            }, {
                tags: ['labels', 'phases', 'ports'],
                complexes: ['annotation', 'class', 'collapseIcon', 'container', 'data', 'enumeration', 'expandIcon', 'gradient', 'gradient.LinearGradient', 'gradient.RadialGradient', 'gradient.Stop', 'interface', 'paletteItem', 'shadow', 'subProcess', 'task'],
                type: core_15.forwardRef(function () { return DiagramComponent; })
            }));
            exports_14("NodesDirective", NodesDirective = core_15.CreateArrayTagDirective('nodes', 'ej-diagram>e-nodes', NodeDirective));
            Outputs = ['autoScrollChange', 'click', 'connectionChange', 'connectorCollectionChange', 'connectorSourceChange',
                'connectorTargetChange', 'contextMenuBeforeOpen', 'contextMenuClick', 'doubleClick', 'drag',
                'dragEnter', 'dragLeave', 'dragOver', 'drop', 'editorFocusChange',
                'groupChange', 'historyChange', 'itemClick', 'mouseEnter', 'mouseLeave',
                'mouseOver', 'nodeCollectionChange', 'propertyChange', 'rotationChange', 'scrollChange',
                'segmentChange', 'selectionChange', 'sizeChange', 'textChange', 'create'
            ];
            ComplexProperties = ['commandManager', 'contextMenu', 'dataSourceSettings', 'defaultSettings', 'historyManager',
                'layout', 'pageSettings', 'scrollSettings', 'selectedItems', 'snapSettings',
                'tooltip', 'commandManager.commands', 'commandManager.commands.gesture', 'snapSettings.horizontalGridLines', 'snapSettings.verticalGridLines',
                'tooltip.alignment'];
            Inputs = core_15.Utils.AngularizeInputs(['backgroundColor', 'backgroundImage', 'bridgeDirection', 'commandManager', 'connectorTemplate',
                'constraints', 'contextMenu', 'dataSourceSettings', 'defaultSettings', 'drawType',
                'enableAutoScroll', 'enableContextMenu', 'height', 'historyManager', 'layout',
                'locale', 'nodeTemplate', 'pageSettings', 'scrollSettings', 'selectedItems',
                'showTooltip', 'snapSettings', 'tool', 'tooltip', 'width',
                'zoomFactor', 'backgroundImage.alignment', 'commandManager.commands', 'commandManager.commands.canExecute', 'commandManager.commands.execute',
                'commandManager.commands.gesture', 'commandManager.commands.parameter', 'contextMenu.items', 'contextMenu.showCustomMenuItemsOnly', 'dataSourceSettings.dataSource',
                'dataSourceSettings.id', 'dataSourceSettings.parent', 'dataSourceSettings.query', 'dataSourceSettings.root', 'dataSourceSettings.tableName',
                'defaultSettings.connector', 'defaultSettings.group', 'defaultSettings.node', 'historyManager.canPop', 'historyManager.closeGroupAction',
                'historyManager.pop', 'historyManager.push', 'historyManager.redo', 'historyManager.redoStack', 'historyManager.stackLimit',
                'historyManager.startGroupAction', 'historyManager.undo', 'historyManager.undoStack', 'layout.bounds', 'layout.fixedNode',
                'layout.getLayoutInfo', 'layout.horizontalSpacing', 'layout.margin', 'layout.horizontalAlignment', 'layout.verticalAlignment',
                'layout.orientation', 'layout.type', 'layout.verticalSpacing', 'pageSettings.autoScrollBorder', 'pageSettings.multiplePage',
                'pageSettings.pageBackgroundColor', 'pageSettings.pageBorderColor', 'pageSettings.pageBorderWidth', 'pageSettings.pageHeight', 'pageSettings.pageMargin',
                'pageSettings.pageOrientation', 'pageSettings.pageWidth', 'pageSettings.scrollableArea', 'pageSettings.scrollLimit', 'pageSettings.boundaryConstraints',
                'pageSettings.showPageBreak', 'scrollSettings.currentZoom', 'scrollSettings.horizontalOffset', 'scrollSettings.padding', 'scrollSettings.verticalOffset',
                'scrollSettings.viewPortHeight', 'scrollSettings.viewPortWidth', 'selectedItems.children', 'selectedItems.constraints', 'selectedItems.getConstraints',
                'selectedItems.height', 'selectedItems.offsetX', 'selectedItems.offsetY', 'selectedItems.rotateAngle', 'selectedItems.tooltip',
                'selectedItems.width', 'snapSettings.enableSnapToObject', 'snapSettings.horizontalGridLines', 'snapSettings.horizontalGridLines.lineColor', 'snapSettings.horizontalGridLines.lineDashArray',
                'snapSettings.horizontalGridLines.linesInterval', 'snapSettings.horizontalGridLines.snapInterval', 'snapSettings.snapAngle', 'snapSettings.snapConstraints', 'snapSettings.snapObjectDistance',
                'snapSettings.verticalGridLines', 'snapSettings.verticalGridLines.lineColor', 'snapSettings.verticalGridLines.lineDashArray', 'snapSettings.verticalGridLines.linesInterval', 'snapSettings.verticalGridLines.snapInterval',
                'tooltip.alignment', 'tooltip.alignment.horizontal', 'tooltip.alignment.vertical', 'tooltip.margin', 'tooltip.relativeMode',
                'tooltip.templateId', 'connectors', 'nodes', 'nodes.class.attributes', 'nodes.class.methods',
                'nodes.enumeration.members', 'nodes.interface.attributes', 'nodes.interface.methods', 'selectedItems.userHandles'], []);
            exports_14("DiagramComponent", DiagramComponent = core_15.CreateComponent('Diagram', {
                selector: 'ej-diagram',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _commandManager_commands: new core_15.ContentChild(CommandManagerCommandsDirective),
                    _connectors: new core_15.ContentChild(ConnectorsDirective),
                    _nodes: new core_15.ContentChild(NodesDirective),
                }
            }, {
                tags: ['commandManager.commands', 'connectors', 'nodes'],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_14("EJ_DIAGRAM_COMPONENTS", EJ_DIAGRAM_COMPONENTS = [DiagramComponent, CommandManagerCommandsDirective, SegmentsDirective, ConnectorLabelsDirective, ConnectorsDirective, NodeLabelsDirective, PhasesDirective, PortsDirective, NodesDirective, CommandManagerCommandDirective, SegmentDirective, ConnectorLabelDirective, ConnectorDirective, NodeLabelDirective, PhaseDirective, PortDirective, NodeDirective]);
        }
    }
});
System.register("ej/dialog.component", ["ej/core"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var core_16;
    var Outputs, ComplexProperties, Inputs, DialogComponent, EJ_DIALOG_COMPONENTS;
    return {
        setters:[
            function (core_16_1) {
                core_16 = core_16_1;
            }],
        execute: function() {
            Outputs = ['beforeOpen', 'ajaxError', 'ajaxSuccess', 'beforeClose', 'close',
                'contentLoad', 'create', 'destroy', 'drag', 'dragStart',
                'dragStop', 'open', 'resize', 'resizeStart', 'resizeStop',
                'expand', 'collapse', 'actionButtonClick'
            ];
            ComplexProperties = ['ajaxSettings'];
            Inputs = core_16.Utils.AngularizeInputs(['actionButtons', 'ajaxSettings', 'allowDraggable', 'allowKeyboardNavigation', 'animation',
                'closeOnEscape', 'containment', 'contentType', 'contentUrl', 'cssClass',
                'enableAnimation', 'enabled', 'enableModal', 'enablePersistence', 'enableResize',
                'enableRTL', 'faviconCSS', 'height', 'htmlAttributes', 'isResponsive',
                'locale', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth',
                'position', 'showHeader', 'showOnInit', 'showRoundedCorner', 'target',
                'title', 'tooltip', 'width', 'zIndex', 'showFooter',
                'footerTemplateId', 'ajaxSettings.async', 'ajaxSettings.cache', 'ajaxSettings.contentType', 'ajaxSettings.data',
                'ajaxSettings.dataType', 'ajaxSettings.type'], []);
            exports_15("DialogComponent", DialogComponent = core_16.CreateComponent('Dialog', {
                selector: 'ej-dialog',
                inputs: Inputs,
                outputs: Outputs,
                template: '<ng-content></ng-content>',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_15("EJ_DIALOG_COMPONENTS", EJ_DIALOG_COMPONENTS = [DialogComponent]);
        }
    }
});
System.register("ej/digitalgauge.component", ["ej/core"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var core_17;
    var ItemDirective, ItemsDirective, Outputs, ComplexProperties, Inputs, DigitalGaugeComponent, EJ_DIGITALGAUGE_COMPONENTS;
    return {
        setters:[
            function (core_17_1) {
                core_17 = core_17_1;
            }],
        execute: function() {
            exports_16("ItemDirective", ItemDirective = core_17.CreateComplexDirective({
                selector: 'e-digitalgauge-items>e-digitalgauge-item',
                inputs: ['characterSettings', 'characterSettings.count', 'characterSettings.opacity', 'characterSettings.spacing', 'characterSettings.type',
                    'enableCustomFont', 'font', 'font.fontFamily', 'font.fontStyle', 'font.size',
                    'position', 'position.x', 'position.y', 'segmentSettings', 'segmentSettings.color',
                    'segmentSettings.gradient', 'segmentSettings.length', 'segmentSettings.opacity', 'segmentSettings.spacing', 'segmentSettings.width',
                    'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'textAlign',
                    'textColor', 'value'],
                queries: {}
            }, {
                tags: [],
                complexes: ['characterSettings', 'font', 'position', 'segmentSettings'],
                type: core_17.forwardRef(function () { return DigitalGaugeComponent; })
            }));
            exports_16("ItemsDirective", ItemsDirective = core_17.CreateArrayTagDirective('items', 'ej-digitalgauge>e-digitalgauge-items', ItemDirective));
            Outputs = ['init', 'itemRendering', 'load', 'renderComplete',
                'model.valueChange: valueChange'];
            ComplexProperties = ['frame'];
            Inputs = core_17.Utils.AngularizeInputs(['frame', 'height', 'isResponsive', 'matrixSegmentData', 'segmentData',
                'themes', 'width', 'frame.backgroundImageUrl', 'frame.innerWidth', 'frame.outerWidth',
                'items'], ['value']);
            exports_16("DigitalGaugeComponent", DigitalGaugeComponent = core_17.CreateComponent('DigitalGauge', {
                selector: 'ej-digitalgauge',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _items: new core_17.ContentChild(ItemsDirective),
                }
            }, {
                tags: ['items'],
                twoways: ['value'],
                complexes: ComplexProperties,
            }));
            exports_16("EJ_DIGITALGAUGE_COMPONENTS", EJ_DIGITALGAUGE_COMPONENTS = [DigitalGaugeComponent, ItemsDirective, ItemDirective]);
        }
    }
});
System.register("ej/dropdownlist.component", ["ej/core"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var core_18;
    var Outputs, ComplexProperties, Inputs, DropDownListComponent, DropDownListValueAccessor, EJ_DROPDOWNLIST_COMPONENTS;
    return {
        setters:[
            function (core_18_1) {
                core_18 = core_18_1;
            }],
        execute: function() {
            Outputs = ['actionBegin', 'actionComplete', 'actionFailure', 'actionSuccess', 'beforePopupHide',
                'beforePopupShown', 'cascade', 'change', 'checkChange', 'create',
                'dataBound', 'destroy', 'focusIn', 'focusOut', 'popupHide',
                'popupResize', 'popupShown', 'popupResizeStart', 'popupResizeStop', 'search',
                'select',
                'model.valueChange: valueChange'];
            ComplexProperties = ['fields'];
            Inputs = core_18.Utils.AngularizeInputs(['allowVirtualScrolling', 'cascadeTo', 'caseSensitiveSearch', 'cssClass', 'dataSource',
                'delimiterChar', 'enableAnimation', 'enabled', 'enableIncrementalSearch', 'enableFilterSearch',
                'enablePersistence', 'enablePopupResize', 'enableRTL', 'enableSorting', 'fields',
                'filterType', 'headerTemplate', 'height', 'htmlAttributes', 'itemsCount',
                'locale', 'maxPopupHeight', 'minPopupHeight', 'maxPopupWidth', 'minPopupWidth',
                'multiSelectMode', 'popupHeight', 'popupWidth', 'query', 'readOnly',
                'selectedIndex', 'selectedIndices', 'showCheckbox', 'showPopupOnLoad', 'showRoundedCorner',
                'sortOrder', 'targetID', 'template', 'text', 'validationMessage',
                'validationRules', 'watermarkText', 'width', 'virtualScrollMode', 'fields.groupBy',
                'fields.htmlAttributes', 'fields.id', 'fields.imageAttributes', 'fields.imageUrl', 'fields.selected',
                'fields.spriteCssClass', 'fields.tableName', 'fields.text', 'fields.value'], ['value']);
            exports_17("DropDownListComponent", DropDownListComponent = core_18.CreateComponent('DropDownList', {
                selector: '[ej-dropdownlist]',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: ['value'],
                complexes: ComplexProperties,
            }));
            exports_17("DropDownListValueAccessor", DropDownListValueAccessor = core_18.CreateControlValueAccessor('[ej-dropdownlist]', DropDownListComponent));
            exports_17("EJ_DROPDOWNLIST_COMPONENTS", EJ_DROPDOWNLIST_COMPONENTS = [DropDownListComponent, DropDownListValueAccessor]);
        }
    }
});
System.register("ej/fileexplorer.component", ["ej/core"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var core_19;
    var Outputs, ComplexProperties, Inputs, FileExplorerComponent, EJ_FILEEXPLORER_COMPONENTS;
    return {
        setters:[
            function (core_19_1) {
                core_19 = core_19_1;
            }],
        execute: function() {
            Outputs = ['beforeAjaxRequest', 'beforeDownload', 'beforeGetImage', 'beforeOpen', 'beforeUpload',
                'create', 'copy', 'createFolder', 'cut', 'destroy',
                'dragStart', 'drag', 'dragStop', 'drop', 'getImage',
                'keydown', 'layoutChange'
            ];
            ComplexProperties = ['contextMenuSettings', 'filterSettings', 'gridSettings', 'uploadSettings'];
            Inputs = core_19.Utils.AngularizeInputs(['ajaxAction', 'ajaxDataType', 'ajaxSettings', 'allowDragAndDrop', 'allowKeyboardNavigation',
                'allowMultiSelection', 'contextMenuSettings', 'cssClass', 'enablePersistence', 'enableResize',
                'enableRTL', 'enableThumbnailCompress', 'fileTypes', 'filterSettings', 'gridSettings',
                'height', 'isResponsive', 'layout', 'locale', 'maxHeight',
                'maxWidth', 'minHeight', 'minWidth', 'path', 'selectedFolder',
                'selectedItems', 'showCheckbox', 'showContextMenu', 'showFooter', 'showRoundedCorner',
                'showThumbnail', 'showToolbar', 'showNavigationPane', 'tools', 'toolsList',
                'uploadSettings', 'width', 'contextMenuSettings.items', 'contextMenuSettings.customMenuFields', 'filterSettings.allowSearchOnTyping',
                'filterSettings.caseSensitiveSearch', 'filterSettings.filterType', 'gridSettings.allowResizing', 'gridSettings.allowSorting', 'gridSettings.columns',
                'uploadSettings.maxFileSize', 'uploadSettings.allowMultipleFile', 'uploadSettings.autoUpload'], []);
            exports_18("FileExplorerComponent", FileExplorerComponent = core_19.CreateComponent('FileExplorer', {
                selector: 'ej-fileexplorer',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_18("EJ_FILEEXPLORER_COMPONENTS", EJ_FILEEXPLORER_COMPONENTS = [FileExplorerComponent]);
        }
    }
});
System.register("ej/gantt.component", ["ej/core"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var core_20;
    var Outputs, ComplexProperties, Inputs, GanttComponent, EJ_GANTT_COMPONENTS;
    return {
        setters:[
            function (core_20_1) {
                core_20 = core_20_1;
            }],
        execute: function() {
            Outputs = ['actionBegin', 'actionComplete', 'beginEdit', 'cellSelecting', 'cellSelected',
                'rowDrag', 'rowDragStart', 'rowDragStop', 'collapsed', 'collapsing',
                'contextMenuOpen', 'create', 'endEdit', 'expanded', 'expanding',
                'load', 'queryCellInfo', 'queryTaskbarInfo', 'rowDataBound', 'rowSelected',
                'rowSelecting', 'taskbarEdited', 'taskbarEditing', 'taskbarClick', 'toolbarClick',
                'model.dataSourceChange: dataSourceChange', 'model.selectedRowIndexChange: selectedRowIndexChange', 'model.splitterSettings.positionChange: splitterSettings.positionChange'];
            ComplexProperties = ['dragTooltip', 'splitterSettings', 'editSettings', 'scheduleHeaderSettings', 'sizeSettings',
                'sortSettings', 'toolbarSettings'];
            Inputs = core_20.Utils.AngularizeInputs(['addDialogFields', 'allowColumnResize', 'allowGanttChartEditing', 'allowKeyboardNavigation', 'allowMultiSorting',
                'allowMultipleExporting', 'allowSelection', 'allowSorting', 'allowDragAndDrop', 'enablePredecessorValidation',
                'baselineColor', 'baselineEndDateMapping', 'baselineStartDateMapping', 'childMapping', 'columnDialogFields',
                'connectorLineBackground', 'connectorlineWidth', 'cssClass', 'cellTooltipTemplate', 'dragTooltip',
                'dateFormat', 'durationMapping', 'durationUnit', 'editDialogFields', 'isResponsive',
                'splitterSettings', 'editSettings', 'enableAltRow', 'enableWBS', 'enableWBSPredecessor',
                'enableCollapseAll', 'leftTaskLabelMapping', 'rightTaskLabelMapping', 'leftTaskLabelTemplate', 'rightTaskLabelTemplate',
                'enableContextMenu', 'enableProgressBarResizing', 'enableResize', 'enableTaskbarDragTooltip', 'enableTaskbarTooltip',
                'enableVirtualization', 'endDateMapping', 'highlightWeekends', 'holidays', 'includeWeekend',
                'locale', 'milestoneMapping', 'showColumnOptions', 'parentTaskbarTemplate', 'taskType',
                'workUnit', 'taskSchedulingMode', 'selectionType', 'parentProgressbarBackground', 'resourceUnitMapping',
                'notesMapping', 'taskSchedulingModeMapping', 'durationUnitMapping', 'parentTaskbarBackground', 'parentTaskIdMapping',
                'predecessorMapping', 'progressbarBackground', 'progressbarHeight', 'progressbarTooltipTemplate', 'progressbarTooltipTemplateId',
                'progressMapping', 'query', 'renderBaseline', 'validateManualTasksOnLinking', 'resourceIdMapping',
                'resourceInfoMapping', 'resourceNameMapping', 'resources', 'roundOffDayworkingTime', 'rowHeight',
                'scheduleEndDate', 'scheduleHeaderSettings', 'scheduleStartDate', 'showColumnChooser', 'showGridCellTooltip',
                'showGridExpandCellTooltip', 'showProgressStatus', 'showResourceNames', 'showTaskNames', 'sizeSettings',
                'sortSettings', 'splitterPosition', 'startDateMapping', 'stripLines', 'taskbarBackground',
                'taskbarEditingTooltipTemplate', 'taskbarEditingTooltipTemplateId', 'taskbarTooltipTemplate', 'taskbarTemplate', 'milestoneTemplate',
                'readOnly', 'taskbarTooltipTemplateId', 'taskIdMapping', 'taskNameMapping', 'toolbarSettings',
                'treeColumnIndex', 'selectionMode', 'weekendBackground', 'workingTimeScale', 'dragTooltip.showTooltip',
                'dragTooltip.tooltipItems', 'dragTooltip.tooltipTemplate', 'splitterSettings.index', 'editSettings.allowAdding', 'editSettings.allowDeleting',
                'editSettings.allowEditing', 'editSettings.allowIndent', 'editSettings.allowOutdent', 'editSettings.beginEditAction', 'editSettings.editMode',
                'scheduleHeaderSettings.dayHeaderFormat', 'scheduleHeaderSettings.hourHeaderFormat', 'scheduleHeaderSettings.minutesPerInterval', 'scheduleHeaderSettings.monthHeaderFormat', 'scheduleHeaderSettings.scheduleHeaderType',
                'scheduleHeaderSettings.timescaleStartDateMode', 'scheduleHeaderSettings.weekendBackground', 'scheduleHeaderSettings.weekHeaderFormat', 'scheduleHeaderSettings.yearHeaderFormat', 'sizeSettings.height',
                'sizeSettings.width', 'sortSettings.sortedColumns', 'toolbarSettings.showToolbar', 'toolbarSettings.toolbarItems', 'selectedCellIndexes'], ['dataSource', 'selectedRowIndex', 'splitterSettings.position']);
            exports_19("GanttComponent", GanttComponent = core_20.CreateComponent('Gantt', {
                selector: 'ej-gantt',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: ['dataSource', 'selectedRowIndex', 'splitterSettings.position'],
                complexes: ComplexProperties,
            }));
            exports_19("EJ_GANTT_COMPONENTS", EJ_GANTT_COMPONENTS = [GanttComponent]);
        }
    }
});
System.register("ej/grid.component", ["ej/core"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var core_21;
    var CommandDirective, CommandsDirective, GridTemplateDirective, ColumnDirective, ColumnsDirective, SummaryColumnDirective, SummaryColumnsDirective, SummaryRowDirective, SummaryRowsDirective, StackedHeaderColumnDirective, StackedHeaderColumnsDirective, StackedHeaderRowDirective, StackedHeaderRowsDirective, Outputs, ComplexProperties, Inputs, GridComponent, EJ_GRID_COMPONENTS;
    return {
        setters:[
            function (core_21_1) {
                core_21 = core_21_1;
            }],
        execute: function() {
            exports_20("CommandDirective", CommandDirective = core_21.CreateComplexDirective({
                selector: 'e-commands>e-command',
                inputs: ['buttonOptions', 'type'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_21.forwardRef(function () { return GridComponent; })
            }));
            exports_20("CommandsDirective", CommandsDirective = core_21.CreateArrayTagDirective('commands', 'e-columns>e-commands', CommandDirective));
            exports_20("GridTemplateDirective", GridTemplateDirective = core_21.CreateTemplateDirective({
                selector: "[e-template]"
            }, {
                type: core_21.forwardRef(function () { return ColumnDirective; })
            }));
            exports_20("ColumnDirective", ColumnDirective = core_21.CreateComplexDirective({
                selector: 'e-columns>e-column',
                inputs: ['clipMode', 'allowEditing', 'allowFiltering', 'allowGrouping', 'allowSorting',
                    'allowResizing', 'commands', 'cssClass', 'customAttributes', 'dataSource',
                    'defaultValue', 'disableHtmlEncode', 'displayAsCheckBox', 'editParams', 'editTemplate',
                    'editType', 'enableGroupByFormat', 'field', 'filterBarTemplate', 'foreignKeyField',
                    'foreignKeyValue', 'format', 'headerTemplateID', 'headerText', 'headerTextAlign',
                    'isFrozen', 'isIdentity', 'isPrimaryKey', 'priority', 'showInColumnChooser',
                    'template', 'textAlign', 'tooltip', 'type', 'validationRules',
                    'visible', 'width'],
                queries: {
                    _commands: new core_21.ContentChild(CommandsDirective),
                    _template: new core_21.ContentChild(GridTemplateDirective)
                }
            }, {
                tags: ['commands'],
                complexes: [],
                type: core_21.forwardRef(function () { return GridComponent; })
            }));
            exports_20("ColumnsDirective", ColumnsDirective = core_21.CreateArrayTagDirective('columns', 'ej-grid>e-columns', ColumnDirective));
            exports_20("SummaryColumnDirective", SummaryColumnDirective = core_21.CreateComplexDirective({
                selector: 'e-summarycolumns>e-summarycolumn',
                inputs: ['customSummaryValue', 'dataMember', 'displayColumn', 'format', 'prefix',
                    'suffix', 'summaryType', 'template'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_21.forwardRef(function () { return GridComponent; })
            }));
            exports_20("SummaryColumnsDirective", SummaryColumnsDirective = core_21.CreateArrayTagDirective('summaryColumns', 'e-summaryrows>e-summarycolumns', SummaryColumnDirective));
            exports_20("SummaryRowDirective", SummaryRowDirective = core_21.CreateComplexDirective({
                selector: 'e-summaryrows>e-summaryrow',
                inputs: ['showCaptionSummary', 'showGroupSummary', 'showTotalSummary', 'summaryColumns', 'title',
                    'titleColumn'],
                queries: {
                    _summaryColumns: new core_21.ContentChild(SummaryColumnsDirective),
                }
            }, {
                tags: ['summaryColumns'],
                complexes: [],
                type: core_21.forwardRef(function () { return GridComponent; })
            }));
            exports_20("SummaryRowsDirective", SummaryRowsDirective = core_21.CreateArrayTagDirective('summaryRows', 'ej-grid>e-summaryrows', SummaryRowDirective));
            exports_20("StackedHeaderColumnDirective", StackedHeaderColumnDirective = core_21.CreateComplexDirective({
                selector: 'e-stackedheadercolumns>e-stackedheadercolumn',
                inputs: ['column', 'cssClass', 'headerText', 'textAlign'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_21.forwardRef(function () { return GridComponent; })
            }));
            exports_20("StackedHeaderColumnsDirective", StackedHeaderColumnsDirective = core_21.CreateArrayTagDirective('stackedHeaderColumns', 'e-stackedheaderrows>e-stackedheadercolumns', StackedHeaderColumnDirective));
            exports_20("StackedHeaderRowDirective", StackedHeaderRowDirective = core_21.CreateComplexDirective({
                selector: 'e-stackedheaderrows>e-stackedheaderrow',
                inputs: ['stackedHeaderColumns'],
                queries: {
                    _stackedHeaderColumns: new core_21.ContentChild(StackedHeaderColumnsDirective),
                }
            }, {
                tags: ['stackedHeaderColumns'],
                complexes: [],
                type: core_21.forwardRef(function () { return GridComponent; })
            }));
            exports_20("StackedHeaderRowsDirective", StackedHeaderRowsDirective = core_21.CreateArrayTagDirective('stackedHeaderRows', 'ej-grid>e-stackedheaderrows', StackedHeaderRowDirective));
            Outputs = ['actionBegin', 'actionComplete', 'actionFailure', 'batchAdd', 'batchDelete',
                'beforeBatchAdd', 'beforeBatchDelete', 'beforeBatchSave', 'beginEdit', 'cellEdit',
                'cellSave', 'cellSelected', 'cellSelecting', 'columnDrag', 'columnDragStart',
                'columnDrop', 'rowDrag', 'rowDragStart', 'rowDrop', 'columnSelected',
                'columnSelecting', 'contextClick', 'contextOpen', 'create', 'dataBound',
                'destroy', 'detailsCollapse', 'detailsDataBound', 'detailsExpand', 'endAdd',
                'endDelete', 'endEdit', 'load', 'mergeCellInfo', 'queryCellInfo',
                'recordClick', 'recordDoubleClick', 'resized', 'resizeEnd', 'resizeStart',
                'rightClick', 'rowDataBound', 'rowSelected', 'rowSelecting', 'templateRefresh',
                'toolbarClick',
                'model.dataSourceChange: dataSourceChange', 'model.pageSettings.currentPageChange: pageSettings.currentPageChange'];
            ComplexProperties = ['contextMenuSettings', 'editSettings', 'filterSettings', 'groupSettings', 'pageSettings',
                'resizeSettings', 'rowDropSettings', 'searchSettings', 'selectionSettings', 'scrollSettings',
                'sortSettings', 'textWrapSettings', 'toolbarSettings'];
            Inputs = core_21.Utils.AngularizeInputs(['allowCellMerging', 'allowGrouping', 'allowKeyboardNavigation', 'allowFiltering', 'allowSorting',
                'allowMultiSorting', 'allowPaging', 'allowReordering', 'allowResizeToFit', 'allowResizing',
                'allowRowDragAndDrop', 'allowScrolling', 'allowSearching', 'allowSelection', 'allowTextWrap',
                'allowMultipleExporting', 'commonWidth', 'gridLines', 'childGrid', 'columnLayout',
                'contextMenuSettings', 'cssClass', 'detailsTemplate', 'editSettings', 'enableAltRow',
                'enableAutoSaveOnSelectionChange', 'enableHeaderHover', 'enablePersistence', 'enableResponsiveRow', 'enableRowHover',
                'enableRTL', 'enableTouch', 'filterSettings', 'groupSettings', 'isResponsive',
                'keySettings', 'locale', 'minWidth', 'pageSettings', 'query',
                'resizeSettings', 'rowTemplate', 'rowDropSettings', 'searchSettings', 'selectedRecords',
                'selectedRowIndex', 'selectedRowIndices', 'selectionSettings', 'selectionType', 'scrollSettings',
                'showColumnChooser', 'showStackedHeader', 'showSummary', 'sortSettings', 'textWrapSettings',
                'toolbarSettings', 'contextMenuSettings.contextMenuItems', 'contextMenuSettings.customContextMenuItems', 'contextMenuSettings.enableContextMenu', 'contextMenuSettings.disableDefaultItems',
                'editSettings.allowAdding', 'editSettings.allowDeleting', 'editSettings.allowEditing', 'editSettings.allowEditOnDblClick', 'editSettings.dialogEditorTemplateID',
                'editSettings.editMode', 'editSettings.externalFormTemplateID', 'editSettings.formPosition', 'editSettings.inlineFormTemplateID', 'editSettings.rowPosition',
                'editSettings.showConfirmDialog', 'editSettings.showDeleteConfirmDialog', 'editSettings.titleColumn', 'editSettings.showAddNewRow', 'filterSettings.enableCaseSensitivity',
                'filterSettings.filterBarMode', 'filterSettings.filterType', 'filterSettings.maxFilterChoices', 'filterSettings.showFilterBarMessage', 'filterSettings.showPredicate',
                'groupSettings.captionFormat', 'groupSettings.enableDropAreaAutoSizing', 'groupSettings.groupedColumns', 'groupSettings.showDropArea', 'groupSettings.showGroupedColumn',
                'groupSettings.showToggleButton', 'groupSettings.showUngroupButton', 'pageSettings.enableQueryString', 'pageSettings.enableTemplates', 'pageSettings.pageCount',
                'pageSettings.pageSize', 'pageSettings.showDefaults', 'pageSettings.template', 'pageSettings.totalPages', 'pageSettings.totalRecordsCount',
                'pageSettings.printMode', 'resizeSettings.resizeMode', 'rowDropSettings.dropTargetID', 'rowDropSettings.dragMapper', 'rowDropSettings.dropMapper',
                'searchSettings.fields', 'searchSettings.key', 'searchSettings.operator', 'searchSettings.ignoreCase', 'selectionSettings.enableToggle',
                'selectionSettings.selectionMode', 'scrollSettings.allowVirtualScrolling', 'scrollSettings.enableTouchScroll', 'scrollSettings.frozenColumns', 'scrollSettings.frozenRows',
                'scrollSettings.height', 'scrollSettings.virtualScrollMode', 'scrollSettings.enableVirtualization', 'scrollSettings.width', 'scrollSettings.scrollOneStepBy',
                'textWrapSettings.wrapMode', 'toolbarSettings.customToolbarItems', 'toolbarSettings.showToolbar', 'toolbarSettings.toolbarItems', 'columns',
                'stackedHeaderRows', 'summaryRows', 'contextMenuSettings.subContextMenu', 'filterSettings.filteredColumns', 'sortSettings.sortedColumns'], ['dataSource', 'pageSettings.currentPage']);
            exports_20("GridComponent", GridComponent = core_21.CreateComponent('Grid', {
                selector: 'ej-grid',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _columns: new core_21.ContentChild(ColumnsDirective),
                    _summaryRows: new core_21.ContentChild(SummaryRowsDirective),
                    _stackedHeaderRows: new core_21.ContentChild(StackedHeaderRowsDirective),
                }
            }, {
                tags: ['columns', 'summaryRows', 'stackedHeaderRows'],
                twoways: ['dataSource', 'pageSettings.currentPage'],
                complexes: ComplexProperties,
            }));
            exports_20("EJ_GRID_COMPONENTS", EJ_GRID_COMPONENTS = [GridComponent, CommandsDirective, ColumnsDirective, SummaryColumnsDirective, SummaryRowsDirective, StackedHeaderColumnsDirective, StackedHeaderRowsDirective, CommandDirective, ColumnDirective, SummaryColumnDirective, SummaryRowDirective, StackedHeaderColumnDirective, StackedHeaderRowDirective, GridTemplateDirective]);
        }
    }
});
System.register("ej/heatmap.component", ["ej/core"], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var core_22;
    var ColorMappingDirective, ColorMappingCollectionDirective, Outputs, ComplexProperties, Inputs, HeatMapComponent, EJ_HEATMAP_COMPONENTS;
    return {
        setters:[
            function (core_22_1) {
                core_22 = core_22_1;
            }],
        execute: function() {
            exports_21("ColorMappingDirective", ColorMappingDirective = core_22.CreateComplexDirective({
                selector: 'e-colormappingcollection>e-colormapping',
                inputs: ['color', 'value', 'label', 'label.bold', 'label.italic',
                    'label.text', 'label.textDecoration', 'label.fontSize', 'label.fontFamily', 'label.fontColor'],
                queries: {}
            }, {
                tags: [],
                complexes: ['label'],
                type: core_22.forwardRef(function () { return HeatMapComponent; })
            }));
            exports_21("ColorMappingCollectionDirective", ColorMappingCollectionDirective = core_22.CreateArrayTagDirective('colorMappingCollection', 'ej-heatmap>e-colormappingcollection', ColorMappingDirective));
            Outputs = ['cellMouseOver', 'cellMouseEnter', 'cellMouseLeave', 'cellSelected'
            ];
            ComplexProperties = ['heatMapCell', 'defaultColumnStyle', 'itemsMapping', 'itemsMapping.columnStyle', 'itemsMapping.column',
                'itemsMapping.row', 'itemsMapping.value', 'itemsMapping.headerMapping'];
            Inputs = core_22.Utils.AngularizeInputs(['width', 'height', 'id', 'itemsSource', 'heatMapCell',
                'isResponsive', 'enableVirtualization', 'defaultColumnStyle', 'legendCollection', 'itemsMapping',
                'heatMapCell.showContent', 'heatMapCell.showColor', 'defaultColumnStyle.textAlign', 'defaultColumnStyle.headerTemplateID', 'defaultColumnStyle.templateID',
                'itemsMapping.columnStyle', 'itemsMapping.columnStyle.width', 'itemsMapping.columnStyle.textAlign', 'itemsMapping.columnStyle.headerTemplateID', 'itemsMapping.columnStyle.templateID',
                'itemsMapping.column', 'itemsMapping.column.propertyName', 'itemsMapping.column.displayName', 'itemsMapping.row', 'itemsMapping.row.propertyName',
                'itemsMapping.row.displayName', 'itemsMapping.value', 'itemsMapping.value.propertyName', 'itemsMapping.value.displayName', 'itemsMapping.headerMapping',
                'itemsMapping.headerMapping.propertyName', 'itemsMapping.headerMapping.displayName', 'itemsMapping.headerMapping.columnStyle', 'itemsMapping.columnMapping', 'colorMappingCollection'], []);
            exports_21("HeatMapComponent", HeatMapComponent = core_22.CreateComponent('HeatMap', {
                selector: 'ej-heatmap',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _colorMappingCollection: new core_22.ContentChild(ColorMappingCollectionDirective),
                }
            }, {
                tags: ['colorMappingCollection'],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_21("EJ_HEATMAP_COMPONENTS", EJ_HEATMAP_COMPONENTS = [HeatMapComponent, ColorMappingCollectionDirective, ColorMappingDirective]);
        }
    }
});
System.register("ej/heatmaplegend.component", ["ej/core"], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var core_23;
    var LegendcolorMappingDirective, LegendcolorMappingsDirective, Outputs, ComplexProperties, Inputs, HeatMapLegendComponent, EJ_HEATMAPLEGEND_COMPONENTS;
    return {
        setters:[
            function (core_23_1) {
                core_23 = core_23_1;
            }],
        execute: function() {
            exports_22("LegendcolorMappingDirective", LegendcolorMappingDirective = core_23.CreateComplexDirective({
                selector: 'e-legendcolormappings>e-legendcolormapping',
                inputs: ['color', 'value', 'label', 'label.bold', 'label.italic',
                    'label.text', 'label.textDecoration', 'label.fontSize', 'label.fontFamily', 'label.fontColor'],
                queries: {}
            }, {
                tags: [],
                complexes: ['label'],
                type: core_23.forwardRef(function () { return HeatMapLegendComponent; })
            }));
            exports_22("LegendcolorMappingsDirective", LegendcolorMappingsDirective = core_23.CreateArrayTagDirective('colorMappingCollection', 'ej-heatmaplegend>e-legendcolormappings', LegendcolorMappingDirective));
            Outputs = [];
            ComplexProperties = [];
            Inputs = core_23.Utils.AngularizeInputs(['width', 'height', 'isResponsive', 'showLabel', 'orientation',
                'legendMode', 'colorMappingCollection'], []);
            exports_22("HeatMapLegendComponent", HeatMapLegendComponent = core_23.CreateComponent('HeatMapLegend', {
                selector: 'ej-heatmaplegend',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _colorMappingCollection: new core_23.ContentChild(LegendcolorMappingsDirective),
                }
            }, {
                tags: ['colorMappingCollection'],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_22("EJ_HEATMAPLEGEND_COMPONENTS", EJ_HEATMAPLEGEND_COMPONENTS = [HeatMapLegendComponent, LegendcolorMappingsDirective, LegendcolorMappingDirective]);
        }
    }
});
System.register("ej/kanban.component", ["ej/core"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var core_24;
    var ColumnDirective, ColumnsDirective, Outputs, ComplexProperties, Inputs, KanbanComponent, EJ_KANBAN_COMPONENTS;
    return {
        setters:[
            function (core_24_1) {
                core_24 = core_24_1;
            }],
        execute: function() {
            exports_23("ColumnDirective", ColumnDirective = core_24.CreateComplexDirective({
                selector: 'e-kanban-columns>e-kanban-column',
                inputs: ['headerText', 'totalCount', 'key', 'allowDrop', 'allowDrag',
                    'isCollapsed', 'constraints', 'constraints.type', 'constraints.min', 'constraints.max',
                    'headerTemplate', 'width', 'visible', 'showAddButton'],
                queries: {}
            }, {
                tags: [],
                complexes: ['constraints'],
                type: core_24.forwardRef(function () { return KanbanComponent; })
            }));
            exports_23("ColumnsDirective", ColumnsDirective = core_24.CreateArrayTagDirective('columns', 'ej-kanban>e-kanban-columns', ColumnDirective));
            Outputs = ['actionBegin', 'actionComplete', 'actionFailure', 'beginEdit', 'beginAdd',
                'beforeCardSelect', 'cardClick', 'cardDrag', 'cardDragStart', 'cardDragStop',
                'cardDrop', 'cardSelect', 'cardDoubleClick', 'cardSelecting', 'create',
                'cellClick', 'dataBound', 'destroy', 'endDelete', 'endEdit',
                'headerClick', 'load', 'toolbarClick', 'queryCellInfo', 'contextOpen',
                'model.dataSourceChange: dataSourceChange'];
            ComplexProperties = ['swimlaneSettings', 'contextMenuSettings', 'cardSettings', 'editSettings', 'fields',
                'scrollSettings', 'searchSettings', 'tooltipSettings'];
            Inputs = core_24.Utils.AngularizeInputs(['allowDragAndDrop', 'allowTitle', 'swimlaneSettings', 'allowToggleColumn', 'allowSearching',
                'allowFiltering', 'allowSelection', 'allowHover', 'allowKeyboardNavigation', 'allowScrolling',
                'allowPrinting', 'contextMenuSettings', 'cardSettings', 'cssClass', 'enableTouch',
                'enableRTL', 'enableTotalCount', 'editSettings', 'fields', 'keyField',
                'isResponsive', 'minWidth', 'query', 'keySettings', 'scrollSettings',
                'searchSettings', 'selectionType', 'tooltipSettings', 'locale', 'swimlaneSettings.showCount',
                'swimlaneSettings.allowDragAndDrop', 'swimlaneSettings.unassignedGroup', 'swimlaneSettings.unassignedGroup.enable', 'swimlaneSettings.unassignedGroup.keys', 'contextMenuSettings.enable',
                'contextMenuSettings.disableDefaultItems', 'contextMenuSettings.menuItems', 'cardSettings.template', 'cardSettings.colorMapping', 'editSettings.allowEditing',
                'editSettings.allowAdding', 'editSettings.dialogTemplate', 'editSettings.editMode', 'editSettings.externalFormTemplate', 'editSettings.formPosition',
                'fields.primaryKey', 'fields.swimlaneKey', 'fields.priority', 'fields.content', 'fields.tag',
                'fields.title', 'fields.color', 'fields.imageUrl', 'scrollSettings.height', 'scrollSettings.width',
                'scrollSettings.allowFreezeSwimlane', 'searchSettings.fields', 'searchSettings.key', 'searchSettings.operator', 'searchSettings.ignoreCase',
                'tooltipSettings.enable', 'tooltipSettings.template', 'columns', 'customToolbarItems', 'filterSettings',
                'stackedHeaderRows', 'workflows', 'contextMenuSettings.customMenuItems', 'editSettings.editItems'], ['dataSource']);
            exports_23("KanbanComponent", KanbanComponent = core_24.CreateComponent('Kanban', {
                selector: 'ej-kanban',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _columns: new core_24.ContentChild(ColumnsDirective),
                }
            }, {
                tags: ['columns'],
                twoways: ['dataSource'],
                complexes: ComplexProperties,
            }));
            exports_23("EJ_KANBAN_COMPONENTS", EJ_KANBAN_COMPONENTS = [KanbanComponent, ColumnsDirective, ColumnDirective]);
        }
    }
});
System.register("ej/lineargauge.component", ["ej/core"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var core_25;
    var MarkerPointerDirective, MarkerPointersDirective, BarPointerDirective, BarPointersDirective, RangeDirective, RangesDirective, TickDirective, TicksDirective, StateRangeDirective, StateRangesDirective, IndicatorDirective, IndicatorsDirective, LabelDirective, LabelsDirective, ScaleDirective, ScalesDirective, Outputs, ComplexProperties, Inputs, LinearGaugeComponent, EJ_LINEARGAUGE_COMPONENTS;
    return {
        setters:[
            function (core_25_1) {
                core_25 = core_25_1;
            }],
        execute: function() {
            exports_24("MarkerPointerDirective", MarkerPointerDirective = core_25.CreateComplexDirective({
                selector: 'e-markerpointers>e-markerpointer',
                inputs: ['backgroundColor', 'border', 'border.color', 'border.width', 'distanceFromScale',
                    'gradients', 'length', 'opacity', 'placement', 'type',
                    'value', 'width'],
                queries: {}
            }, {
                tags: [],
                complexes: ['border'],
                type: core_25.forwardRef(function () { return LinearGaugeComponent; })
            }));
            exports_24("MarkerPointersDirective", MarkerPointersDirective = core_25.CreateArrayTagDirective('markerPointers', 'e-scales>e-markerpointers', MarkerPointerDirective));
            exports_24("BarPointerDirective", BarPointerDirective = core_25.CreateComplexDirective({
                selector: 'e-barpointers>e-barpointer',
                inputs: ['backgroundColor', 'border', 'border.color', 'border.width', 'distanceFromScale',
                    'gradients', 'opacity', 'value', 'width'],
                queries: {}
            }, {
                tags: [],
                complexes: ['border'],
                type: core_25.forwardRef(function () { return LinearGaugeComponent; })
            }));
            exports_24("BarPointersDirective", BarPointersDirective = core_25.CreateArrayTagDirective('barPointers', 'e-scales>e-barpointers', BarPointerDirective));
            exports_24("RangeDirective", RangeDirective = core_25.CreateComplexDirective({
                selector: 'e-ranges>e-range',
                inputs: ['backgroundColor', 'border', 'border.color', 'border.width', 'distanceFromScale',
                    'endValue', 'endWidth', 'gradients', 'opacity', 'placement',
                    'startValue', 'startWidth'],
                queries: {}
            }, {
                tags: [],
                complexes: ['border'],
                type: core_25.forwardRef(function () { return LinearGaugeComponent; })
            }));
            exports_24("RangesDirective", RangesDirective = core_25.CreateArrayTagDirective('ranges', 'e-scales>e-ranges', RangeDirective));
            exports_24("TickDirective", TickDirective = core_25.CreateComplexDirective({
                selector: 'e-ticks>e-tick',
                inputs: ['angle', 'color', 'distanceFromScale', 'distanceFromScale.x', 'distanceFromScale.y',
                    'height', 'opacity', 'placement', 'type', 'width'],
                queries: {}
            }, {
                tags: [],
                complexes: ['distanceFromScale'],
                type: core_25.forwardRef(function () { return LinearGaugeComponent; })
            }));
            exports_24("TicksDirective", TicksDirective = core_25.CreateArrayTagDirective('ticks', 'e-scales>e-ticks', TickDirective));
            exports_24("StateRangeDirective", StateRangeDirective = core_25.CreateComplexDirective({
                selector: 'e-stateranges>e-staterange',
                inputs: ['backgroundColor', 'borderColor', 'endValue', 'startValue', 'text',
                    'textColor'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_25.forwardRef(function () { return LinearGaugeComponent; })
            }));
            exports_24("StateRangesDirective", StateRangesDirective = core_25.CreateArrayTagDirective('stateRanges', 'e-indicators>e-stateranges', StateRangeDirective));
            exports_24("IndicatorDirective", IndicatorDirective = core_25.CreateComplexDirective({
                selector: 'e-indicators>e-indicator',
                inputs: ['backgroundColor', 'border', 'border.color', 'border.width', 'font',
                    'font.fontFamily', 'font.fontStyle', 'font.size', 'height', 'opacity',
                    'position', 'position.x', 'position.y', 'stateRanges', 'textLocation',
                    'textLocation.x', 'textLocation.y', 'type', 'width'],
                queries: {
                    _stateRanges: new core_25.ContentChild(StateRangesDirective),
                }
            }, {
                tags: ['stateRanges'],
                complexes: ['border', 'font', 'position', 'textLocation'],
                type: core_25.forwardRef(function () { return LinearGaugeComponent; })
            }));
            exports_24("IndicatorsDirective", IndicatorsDirective = core_25.CreateArrayTagDirective('indicators', 'e-scales>e-indicators', IndicatorDirective));
            exports_24("LabelDirective", LabelDirective = core_25.CreateComplexDirective({
                selector: 'e-labels>e-label',
                inputs: ['angle', 'distanceFromScale', 'distanceFromScale.x', 'distanceFromScale.y', 'font',
                    'font.fontFamily', 'font.fontStyle', 'font.size', 'includeFirstValue', 'opacity',
                    'placement', 'textColor', 'type', 'unitText', 'unitTextPlacement'],
                queries: {}
            }, {
                tags: [],
                complexes: ['distanceFromScale', 'font'],
                type: core_25.forwardRef(function () { return LinearGaugeComponent; })
            }));
            exports_24("LabelsDirective", LabelsDirective = core_25.CreateArrayTagDirective('labels', 'e-scales>e-labels', LabelDirective));
            exports_24("ScaleDirective", ScaleDirective = core_25.CreateComplexDirective({
                selector: 'e-scales>e-scale',
                inputs: ['backgroundColor', 'barPointers', 'border', 'border.color', 'border.width',
                    'customLabels', 'direction', 'indicators', 'labels', 'length',
                    'majorIntervalValue', 'markerPointers', 'maximum', 'minimum', 'minorIntervalValue',
                    'opacity', 'position', 'position.x', 'position.y', 'ranges',
                    'shadowOffset', 'showBarPointers', 'showCustomLabels', 'showIndicators', 'showLabels',
                    'showMarkerPointers', 'showRanges', 'showTicks', 'ticks', 'type',
                    'width'],
                queries: {
                    _markerPointers: new core_25.ContentChild(MarkerPointersDirective),
                    _barPointers: new core_25.ContentChild(BarPointersDirective),
                    _ranges: new core_25.ContentChild(RangesDirective),
                    _ticks: new core_25.ContentChild(TicksDirective),
                    _indicators: new core_25.ContentChild(IndicatorsDirective),
                    _labels: new core_25.ContentChild(LabelsDirective),
                }
            }, {
                tags: ['markerPointers', 'barPointers', 'ranges', 'ticks', 'indicators', 'labels'],
                complexes: ['border', 'position'],
                type: core_25.forwardRef(function () { return LinearGaugeComponent; })
            }));
            exports_24("ScalesDirective", ScalesDirective = core_25.CreateArrayTagDirective('scales', 'ej-lineargauge>e-scales', ScaleDirective));
            Outputs = ['drawBarPointers', 'drawCustomLabel', 'drawIndicators', 'drawLabels', 'drawMarkerPointers',
                'drawRange', 'drawTicks', 'init', 'load', 'mouseClick',
                'mouseClickMove', 'mouseClickUp', 'renderComplete',
                'model.valueChange: valueChange', 'model.minimumChange: minimumChange', 'model.maximumChange: maximumChange'];
            ComplexProperties = ['frame', 'tooltip'];
            Inputs = core_25.Utils.AngularizeInputs(['animationSpeed', 'backgroundColor', 'borderColor', 'enableAnimation', 'enableMarkerPointerAnimation',
                'isResponsive', 'frame', 'height', 'labelColor', 'orientation',
                'outerCustomLabelPosition', 'pointerGradient1', 'pointerGradient2', 'readOnly', 'theme',
                'tickColor', 'tooltip', 'width', 'frame.backgroundImageUrl', 'frame.innerWidth',
                'frame.outerWidth', 'tooltip.showCustomLabelTooltip', 'tooltip.showLabelTooltip', 'tooltip.templateID', 'scales',
                'scales.indicators.stateRanges'], ['value', 'minimum', 'maximum']);
            exports_24("LinearGaugeComponent", LinearGaugeComponent = core_25.CreateComponent('LinearGauge', {
                selector: 'ej-lineargauge',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _scales: new core_25.ContentChild(ScalesDirective),
                }
            }, {
                tags: ['scales'],
                twoways: ['value', 'minimum', 'maximum'],
                complexes: ComplexProperties,
            }));
            exports_24("EJ_LINEARGAUGE_COMPONENTS", EJ_LINEARGAUGE_COMPONENTS = [LinearGaugeComponent, MarkerPointersDirective, BarPointersDirective, RangesDirective, TicksDirective, StateRangesDirective, IndicatorsDirective, LabelsDirective, ScalesDirective, MarkerPointerDirective, BarPointerDirective, RangeDirective, TickDirective, StateRangeDirective, IndicatorDirective, LabelDirective, ScaleDirective]);
        }
    }
});
System.register("ej/listbox.component", ["ej/core"], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var core_26;
    var Outputs, ComplexProperties, Inputs, ListBoxComponent, EJ_LISTBOX_COMPONENTS;
    return {
        setters:[
            function (core_26_1) {
                core_26 = core_26_1;
            }],
        execute: function() {
            Outputs = ['actionBegin', 'actionSuccess', 'actionComplete', 'actionFailure', 'actionBeforeSuccess',
                'change', 'checkChange', 'create', 'destroy', 'focusIn',
                'focusOut', 'itemDrag', 'itemDragStart', 'itemDragStop', 'itemDrop',
                'select', 'unselect',
                'model.valueChange: valueChange'];
            ComplexProperties = ['fields'];
            Inputs = core_26.Utils.AngularizeInputs(['allowDrag', 'allowDrop', 'allowMultiSelection', 'allowVirtualScrolling', 'caseSensitiveSearch',
                'cascadeTo', 'checkedIndices', 'cssClass', 'dataSource', 'enabled',
                'enableIncrementalSearch', 'enablePersistence', 'enableRTL', 'enableWordWrap', 'fields',
                'height', 'itemHeight', 'itemsCount', 'totalItemsCount', 'itemRequestCount',
                'loadDataOnInit', 'query', 'selectedIndex', 'selectedIndices', 'showCheckbox',
                'showRoundedCorner', 'template', 'virtualScrollMode', 'width', 'targetID',
                'fields.checkBy', 'fields.groupBy', 'fields.htmlAttributes', 'fields.id', 'fields.imageUrl',
                'fields.imageAttributes', 'fields.selectBy', 'fields.spriteCssClass', 'fields.tableName', 'fields.text',
                'fields.value'], ['value']);
            exports_25("ListBoxComponent", ListBoxComponent = core_26.CreateComponent('ListBox', {
                selector: 'ej-listbox',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: ['value'],
                complexes: ComplexProperties,
            }));
            exports_25("EJ_LISTBOX_COMPONENTS", EJ_LISTBOX_COMPONENTS = [ListBoxComponent]);
        }
    }
});
System.register("ej/listview.component", ["ej/core"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var core_27;
    var Outputs, ComplexProperties, Inputs, ListViewComponent, EJ_LISTVIEW_COMPONENTS;
    return {
        setters:[
            function (core_27_1) {
                core_27 = core_27_1;
            }],
        execute: function() {
            Outputs = ['ajaxBeforeLoad', 'ajaxComplete', 'ajaxError', 'ajaxSuccess', 'load',
                'loadComplete', 'mouseDown', 'mouseUp',
                'model.dataSourceChange: dataSourceChange'];
            ComplexProperties = ['ajaxSettings'];
            Inputs = core_27.Utils.AngularizeInputs(['ajaxSettings', 'checkedIndices', 'cssClass', 'enableAjax', 'enableCache',
                'enableCheckMark', 'enableFiltering', 'enableGroupList', 'enablePersistence', 'fieldSettings',
                'items', 'headerBackButtonText', 'headerTitle', 'height', 'locale',
                'persistSelection', 'preventSelection', 'query', 'renderTemplate', 'selectedItemIndex',
                'showHeader', 'showHeaderBackButton', 'templateId', 'width', 'ajaxSettings.async',
                'ajaxSettings.cache', 'ajaxSettings.contentType', 'ajaxSettings.data', 'ajaxSettings.dataType', 'ajaxSettings.type'], ['dataSource']);
            exports_26("ListViewComponent", ListViewComponent = core_27.CreateComponent('ListView', {
                selector: 'ej-listview',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: ['dataSource'],
                complexes: ComplexProperties,
            }));
            exports_26("EJ_LISTVIEW_COMPONENTS", EJ_LISTVIEW_COMPONENTS = [ListViewComponent]);
        }
    }
});
System.register("ej/map.component", ["ej/core"], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    var core_28;
    var LayerDirective, LayersDirective, Outputs, ComplexProperties, Inputs, MapComponent, EJ_MAP_COMPONENTS;
    return {
        setters:[
            function (core_28_1) {
                core_28 = core_28_1;
            }],
        execute: function() {
            exports_27("LayerDirective", LayerDirective = core_28.CreateComplexDirective({
                selector: 'e-layers>e-layer',
                inputs: ['bingMapType', 'bubbleSettings', 'bubbleSettings.bubbleOpacity', 'bubbleSettings.color', 'bubbleSettings.colorMappings',
                    'bubbleSettings.colorMappings.rangeColorMapping', 'bubbleSettings.colorValuePath', 'bubbleSettings.maxValue', 'bubbleSettings.minValue', 'bubbleSettings.showBubble',
                    'bubbleSettings.showTooltip', 'bubbleSettings.tooltipTemplate', 'bubbleSettings.valuePath', 'dataSource', 'shapeDataPath',
                    'shapePropertyPath', 'enableMouseHover', 'enableSelection', 'key', 'labelSettings',
                    'labelSettings.enableSmartLabel', 'labelSettings.labelLength', 'labelSettings.labelPath', 'labelSettings.showLabels', 'labelSettings.smartLabelSize',
                    'layerType', 'legendSettings', 'legendSettings.dockOnMap', 'legendSettings.dockPosition', 'legendSettings.height',
                    'legendSettings.icon', 'legendSettings.iconHeight', 'legendSettings.iconWidth', 'legendSettings.labelOrientation', 'legendSettings.leftLabel',
                    'legendSettings.mode', 'legendSettings.position', 'legendSettings.positionX', 'legendSettings.positionY', 'legendSettings.rightLabel',
                    'legendSettings.showLabels', 'legendSettings.showLegend', 'legendSettings.title', 'legendSettings.type', 'legendSettings.width',
                    'mapItemsTemplate', 'markers', 'markerTemplate', 'selectedMapShapes', 'selectionMode',
                    'shapeData', 'shapeSettings', 'shapeSettings.autoFill', 'shapeSettings.colorMappings', 'shapeSettings.colorMappings.rangeColorMapping',
                    'shapeSettings.colorMappings.equalColorMapping', 'shapeSettings.colorPalette', 'shapeSettings.colorValuePath', 'shapeSettings.enableGradient', 'shapeSettings.fill',
                    'shapeSettings.highlightBorderWidth', 'shapeSettings.highlightColor', 'shapeSettings.highlightStroke', 'shapeSettings.selectionColor', 'shapeSettings.selectionStroke',
                    'shapeSettings.selectionStrokeWidth', 'shapeSettings.stroke', 'shapeSettings.strokeThickness', 'shapeSettings.valuePath', 'showMapItems',
                    'showTooltip', 'tooltipTemplate', 'urlTemplate'],
                queries: {}
            }, {
                tags: [],
                complexes: ['bubbleSettings', 'bubbleSettings.colorMappings', 'labelSettings', 'legendSettings', 'shapeSettings', 'shapeSettings.colorMappings'],
                type: core_28.forwardRef(function () { return MapComponent; })
            }));
            exports_27("LayersDirective", LayersDirective = core_28.CreateArrayTagDirective('layers', 'ej-map>e-layers', LayerDirective));
            Outputs = ['markerSelected', 'mouseleave', 'mouseover', 'onRenderComplete', 'panned',
                'shapeSelected', 'zoomedIn', 'zoomedOut',
                'model.baseMapIndexChange: baseMapIndexChange', 'model.enablePanChange: enablePanChange', 'model.enableResizeChange: enableResizeChange', 'model.enableAnimationChange: enableAnimationChange', 'model.zoomSettings.levelChange: zoomSettings.levelChange',
                'model.zoomSettings.minValueChange: zoomSettings.minValueChange', 'model.zoomSettings.maxValueChange: zoomSettings.maxValueChange', 'model.zoomSettings.factorChange: zoomSettings.factorChange', 'model.zoomSettings.enableZoomChange: zoomSettings.enableZoomChange', 'model.zoomSettings.enableZoomOnSelectionChange: zoomSettings.enableZoomOnSelectionChange',
                'model.navigationControl.enableNavigationChange: navigationControl.enableNavigationChange', 'model.navigationControl.orientationChange: navigationControl.orientationChange', 'model.navigationControl.absolutePositionChange: navigationControl.absolutePositionChange', 'model.navigationControl.dockPositionChange: navigationControl.dockPositionChange'];
            ComplexProperties = ['zoomSettings', 'navigationControl'];
            Inputs = core_28.Utils.AngularizeInputs(['background', 'centerPosition', 'enableLayerChangeAnimation', 'zoomSettings', 'navigationControl',
                'navigationControl.content', 'layers', 'layers.bubbleSettings.colorMappings.rangeColorMapping', 'layers.shapeSettings.colorMappings.rangeColorMapping', 'layers.shapeSettings.colorMappings.equalColorMapping'], ['baseMapIndex', 'enablePan', 'enableResize', 'enableAnimation', 'zoomSettings.level',
                'zoomSettings.minValue', 'zoomSettings.maxValue', 'zoomSettings.factor', 'zoomSettings.enableZoom', 'zoomSettings.enableZoomOnSelection',
                'navigationControl.enableNavigation', 'navigationControl.orientation', 'navigationControl.absolutePosition', 'navigationControl.dockPosition']);
            exports_27("MapComponent", MapComponent = core_28.CreateComponent('Map', {
                selector: 'ej-map',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _layers: new core_28.ContentChild(LayersDirective),
                }
            }, {
                tags: ['layers'],
                twoways: ['baseMapIndex', 'enablePan', 'enableResize', 'enableAnimation', 'zoomSettings.level', 'zoomSettings.minValue', 'zoomSettings.maxValue', 'zoomSettings.factor', 'zoomSettings.enableZoom', 'zoomSettings.enableZoomOnSelection', 'navigationControl.enableNavigation', 'navigationControl.orientation', 'navigationControl.absolutePosition', 'navigationControl.dockPosition'],
                complexes: ComplexProperties,
            }));
            exports_27("EJ_MAP_COMPONENTS", EJ_MAP_COMPONENTS = [MapComponent, LayersDirective, LayerDirective]);
        }
    }
});
System.register("ej/maskedit.component", ["ej/core"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var core_29;
    var Outputs, ComplexProperties, Inputs, MaskEditComponent, MaskEditValueAccessor, EJ_MASKEDIT_COMPONENTS;
    return {
        setters:[
            function (core_29_1) {
                core_29 = core_29_1;
            }],
        execute: function() {
            Outputs = ['change', 'create', 'destroy', 'focusIn', 'focusOut',
                'keydown', 'keyPress', 'keyup', 'mouseOut', 'mouseOver'
            ];
            ComplexProperties = [];
            Inputs = core_29.Utils.AngularizeInputs(['cssClass', 'customCharacter', 'enabled', 'enablePersistence', 'height',
                'hidePromptOnLeave', 'htmlAttributes', 'inputMode', 'maskFormat', 'name',
                'readOnly', 'showError', 'showPromptChar', 'showRoundedCorner', 'textAlign',
                'validationMessage', 'validationRules', 'value', 'watermarkText', 'width'], []);
            exports_28("MaskEditComponent", MaskEditComponent = core_29.CreateComponent('MaskEdit', {
                selector: '[ej-maskedit]',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_28("MaskEditValueAccessor", MaskEditValueAccessor = core_29.CreateControlValueAccessor('[ej-maskedit]', MaskEditComponent));
            exports_28("EJ_MASKEDIT_COMPONENTS", EJ_MASKEDIT_COMPONENTS = [MaskEditComponent, MaskEditValueAccessor]);
        }
    }
});
System.register("ej/menu.component", ["ej/core"], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    var core_30;
    var Outputs, ComplexProperties, Inputs, MenuComponent, EJ_MENU_COMPONENTS;
    return {
        setters:[
            function (core_30_1) {
                core_30 = core_30_1;
            }],
        execute: function() {
            Outputs = ['beforeOpen', 'click', 'close', 'open', 'create',
                'destroy', 'keydown', 'mouseout', 'mouseover'
            ];
            ComplexProperties = ['fields'];
            Inputs = core_30.Utils.AngularizeInputs(['animationType', 'contextMenuTarget', 'cssClass', 'enableAnimation', 'enableCenterAlign',
                'enabled', 'enableRTL', 'enableSeparator', 'excludeTarget', 'fields',
                'height', 'htmlAttributes', 'isResponsive', 'menuType', 'openOnClick',
                'orientation', 'showRootLevelArrows', 'showSubLevelArrows', 'subMenuDirection', 'titleText',
                'width', 'fields.child', 'fields.dataSource', 'fields.htmlAttribute', 'fields.id',
                'fields.imageAttribute', 'fields.imageUrl', 'fields.linkAttribute', 'fields.parentId', 'fields.query',
                'fields.spriteCssClass', 'fields.tableName', 'fields.text', 'fields.url'], []);
            exports_29("MenuComponent", MenuComponent = core_30.CreateComponent('Menu', {
                selector: 'ej-menu',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_29("EJ_MENU_COMPONENTS", EJ_MENU_COMPONENTS = [MenuComponent]);
        }
    }
});
System.register("ej/navigationdrawer.component", ["ej/core"], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    var core_31;
    var Outputs, ComplexProperties, Inputs, NavigationDrawerComponent, EJ_NAVIGATIONDRAWER_COMPONENTS;
    return {
        setters:[
            function (core_31_1) {
                core_31 = core_31_1;
            }],
        execute: function() {
            Outputs = ['ajaxComplete', 'ajaxError', 'ajaxSuccess', 'beforeClose', 'open',
                'swipe'
            ];
            ComplexProperties = ['ajaxSettings'];
            Inputs = core_31.Utils.AngularizeInputs(['ajaxSettings', 'contentId', 'cssClass', 'direction', 'enableListView',
                'items', 'listViewSettings', 'position', 'targetId', 'type',
                'width', 'isPaneOpen', 'ajaxSettings.async', 'ajaxSettings.cache', 'ajaxSettings.contentType',
                'ajaxSettings.data', 'ajaxSettings.dataType', 'ajaxSettings.type'], []);
            exports_30("NavigationDrawerComponent", NavigationDrawerComponent = core_31.CreateComponent('NavigationDrawer', {
                selector: '[ej-navigationdrawer]',
                inputs: Inputs,
                outputs: Outputs,
                template: '<ng-content></ng-content>',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_30("EJ_NAVIGATIONDRAWER_COMPONENTS", EJ_NAVIGATIONDRAWER_COMPONENTS = [NavigationDrawerComponent]);
        }
    }
});
System.register("ej/numerictextbox.component", ["ej/core"], function(exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    var core_32;
    var Outputs, ComplexProperties, Inputs, NumericTextboxComponent, NumericTextboxValueAccessor, EJ_NUMERICTEXTBOX_COMPONENTS;
    return {
        setters:[
            function (core_32_1) {
                core_32 = core_32_1;
            }],
        execute: function() {
            Outputs = ['change', 'create', 'destroy', 'focusIn', 'focusOut'
            ];
            ComplexProperties = [];
            Inputs = core_32.Utils.AngularizeInputs(['cssClass', 'decimalPlaces', 'enabled', 'enablePersistence', 'enableRTL',
                'enableStrictMode', 'groupSize', 'groupSeparator', 'height', 'htmlAttributes',
                'incrementStep', 'locale', 'maxValue', 'minValue', 'name',
                'negativePattern', 'positivePattern', 'readOnly', 'showRoundedCorner', 'showSpinButton',
                'validateOnType', 'validationMessage', 'validationRules', 'value', 'watermarkText',
                'width'], []);
            exports_31("NumericTextboxComponent", NumericTextboxComponent = core_32.CreateComponent('NumericTextbox', {
                selector: '[ej-numerictextbox]',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_31("NumericTextboxValueAccessor", NumericTextboxValueAccessor = core_32.CreateControlValueAccessor('[ej-numerictextbox]', NumericTextboxComponent));
            exports_31("EJ_NUMERICTEXTBOX_COMPONENTS", EJ_NUMERICTEXTBOX_COMPONENTS = [NumericTextboxComponent, NumericTextboxValueAccessor]);
        }
    }
});
System.register("ej/overview.component", ["ej/core"], function(exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    var core_33;
    var Outputs, ComplexProperties, Inputs, OverviewComponent, EJ_OVERVIEW_COMPONENTS;
    return {
        setters:[
            function (core_33_1) {
                core_33 = core_33_1;
            }],
        execute: function() {
            Outputs = [];
            ComplexProperties = [];
            Inputs = core_33.Utils.AngularizeInputs(['sourceID', 'height', 'width'], []);
            exports_32("OverviewComponent", OverviewComponent = core_33.CreateComponent('Overview', {
                selector: 'ej-overview',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_32("EJ_OVERVIEW_COMPONENTS", EJ_OVERVIEW_COMPONENTS = [OverviewComponent]);
        }
    }
});
System.register("ej/pdfviewer.component", ["ej/core"], function(exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    var core_34;
    var Outputs, ComplexProperties, Inputs, PdfViewerComponent, EJ_PDFVIEWER_COMPONENTS;
    return {
        setters:[
            function (core_34_1) {
                core_34 = core_34_1;
            }],
        execute: function() {
            Outputs = ['documentLoad', 'pageChange', 'zoomChange', 'hyperlinkClick', 'beforePrint',
                'afterPrint', 'pageClick', 'destroy'
            ];
            ComplexProperties = ['toolbarSettings'];
            Inputs = core_34.Utils.AngularizeInputs(['locale', 'toolbarSettings', 'toolbarItems', 'serviceUrl', 'pageCount',
                'currentPageNumber', 'zoomPercentage', 'pdfService', 'hyperlinkOpenState', 'isResponsive',
                'fileName', 'toolbarSettings.showToolTip'], []);
            exports_33("PdfViewerComponent", PdfViewerComponent = core_34.CreateComponent('PdfViewer', {
                selector: 'ej-pdfviewer',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_33("EJ_PDFVIEWER_COMPONENTS", EJ_PDFVIEWER_COMPONENTS = [PdfViewerComponent]);
        }
    }
});
System.register("ej/percentagetextbox.component", ["ej/core"], function(exports_34, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
    var core_35;
    var Outputs, ComplexProperties, Inputs, PercentageTextboxComponent, PercentageTextboxValueAccessor, EJ_PERCENTAGETEXTBOX_COMPONENTS;
    return {
        setters:[
            function (core_35_1) {
                core_35 = core_35_1;
            }],
        execute: function() {
            Outputs = ['change', 'create', 'destroy', 'focusIn', 'focusOut'
            ];
            ComplexProperties = [];
            Inputs = core_35.Utils.AngularizeInputs(['cssClass', 'decimalPlaces', 'enabled', 'enablePersistence', 'enableRTL',
                'enableStrictMode', 'groupSize', 'groupSeparator', 'height', 'htmlAttributes',
                'incrementStep', 'locale', 'maxValue', 'minValue', 'name',
                'negativePattern', 'positivePattern', 'readOnly', 'showRoundedCorner', 'showSpinButton',
                'validateOnType', 'validationMessage', 'validationRules', 'value', 'watermarkText',
                'width'], []);
            exports_34("PercentageTextboxComponent", PercentageTextboxComponent = core_35.CreateComponent('PercentageTextbox', {
                selector: '[ej-percentagetextbox]',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_34("PercentageTextboxValueAccessor", PercentageTextboxValueAccessor = core_35.CreateControlValueAccessor('[ej-percentagetextbox]', PercentageTextboxComponent));
            exports_34("EJ_PERCENTAGETEXTBOX_COMPONENTS", EJ_PERCENTAGETEXTBOX_COMPONENTS = [PercentageTextboxComponent, PercentageTextboxValueAccessor]);
        }
    }
});
System.register("ej/pivotchart.component", ["ej/core"], function(exports_35, context_35) {
    "use strict";
    var __moduleName = context_35 && context_35.id;
    var core_36;
    var Outputs, ComplexProperties, Inputs, PivotChartComponent, EJ_PIVOTCHART_COMPONENTS;
    return {
        setters:[
            function (core_36_1) {
                core_36 = core_36_1;
            }],
        execute: function() {
            Outputs = ['load', 'afterServiceInvoke', 'beforeServiceInvoke', 'drillSuccess', 'renderComplete',
                'renderFailure', 'renderSuccess'
            ];
            ComplexProperties = ['commonSeriesOptions', 'dataSource', 'serviceMethodSettings'];
            Inputs = core_36.Utils.AngularizeInputs(['analysisMode', 'cssClass', 'commonSeriesOptions', 'dataSource', 'customObject',
                'enable3D', 'enableRTL', 'isResponsive', 'legend', 'locale',
                'operationalMode', 'primaryXAxis', 'primaryYAxis', 'rotation', 'serviceMethodSettings',
                'size', 'url', 'commonSeriesOptions.type', 'dataSource.cube', 'dataSource.data',
                'dataSource.catalog', 'serviceMethodSettings.drillDown', 'serviceMethodSettings.exportPivotChart', 'serviceMethodSettings.initialize', 'serviceMethodSettings.paging',
                'dataSource.columns', 'dataSource.rows', 'dataSource.values', 'dataSource.filters'], []);
            exports_35("PivotChartComponent", PivotChartComponent = core_36.CreateComponent('PivotChart', {
                selector: 'ej-pivotchart',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_35("EJ_PIVOTCHART_COMPONENTS", EJ_PIVOTCHART_COMPONENTS = [PivotChartComponent]);
        }
    }
});
System.register("ej/pivotgauge.component", ["ej/core"], function(exports_36, context_36) {
    "use strict";
    var __moduleName = context_36 && context_36.id;
    var core_37;
    var Outputs, ComplexProperties, Inputs, PivotGaugeComponent, EJ_PIVOTGAUGE_COMPONENTS;
    return {
        setters:[
            function (core_37_1) {
                core_37 = core_37_1;
            }],
        execute: function() {
            Outputs = ['afterServiceInvoke', 'beforeServiceInvoke', 'beforePivotEnginePopulate', 'load', 'renderComplete',
                'renderFailure', 'renderSuccess'
            ];
            ComplexProperties = ['dataSource', 'labelFormatSettings', 'serviceMethodSettings'];
            Inputs = core_37.Utils.AngularizeInputs(['columnsCount', 'cssClass', 'customObject', 'dataSource', 'enableAnimation',
                'enableTooltip', 'enableRTL', 'isResponsive', 'labelFormatSettings', 'locale',
                'rowsCount', 'scales', 'serviceMethodSettings', 'showHeaderLabel', 'url',
                'analysisMode', 'operationalMode', 'dataSource.cube', 'dataSource.data', 'dataSource.catalog',
                'labelFormatSettings.numberFormat', 'labelFormatSettings.decimalPlaces', 'labelFormatSettings.prefixText', 'labelFormatSettings.suffixText', 'serviceMethodSettings.initialize',
                'dataSource.columns', 'dataSource.rows', 'dataSource.values', 'dataSource.filters'], []);
            exports_36("PivotGaugeComponent", PivotGaugeComponent = core_37.CreateComponent('PivotGauge', {
                selector: 'ej-pivotgauge',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_36("EJ_PIVOTGAUGE_COMPONENTS", EJ_PIVOTGAUGE_COMPONENTS = [PivotGaugeComponent]);
        }
    }
});
System.register("ej/pivotgrid.component", ["ej/core"], function(exports_37, context_37) {
    "use strict";
    var __moduleName = context_37 && context_37.id;
    var core_38;
    var Outputs, ComplexProperties, Inputs, PivotGridComponent, EJ_PIVOTGRID_COMPONENTS;
    return {
        setters:[
            function (core_38_1) {
                core_38 = core_38_1;
            }],
        execute: function() {
            Outputs = ['afterServiceInvoke', 'beforeServiceInvoke', 'beforePivotEnginePopulate', 'cellDoubleClick', 'cellContext',
                'cellSelection', 'columnHeaderHyperlinkClick', 'drillSuccess', 'drillThrough', 'load',
                'renderComplete', 'renderFailure', 'renderSuccess', 'rowHeaderHyperlinkClick', 'summaryCellHyperlinkClick',
                'valueCellHyperlinkClick', 'saveReport', 'loadReport', 'beforeExport', 'cellEdit'
            ];
            ComplexProperties = ['dataSource', 'frozenHeaderSettings', 'hyperlinkSettings', 'serviceMethodSettings', 'dataSource.pagerOptions'];
            Inputs = core_38.Utils.AngularizeInputs(['analysisMode', 'cssClass', 'pivotTableFieldListID', 'dataSource', 'frozenHeaderSettings',
                'customObject', 'collapsedMembers', 'enableCellContext', 'enableCellSelection', 'enableDrillThrough',
                'enableCellDoubleClick', 'enableCellEditing', 'enableCollapseByDefault', 'enableColumnGrandTotal', 'enableConditionalFormatting',
                'enableDeferUpdate', 'enableGroupingBar', 'enableGrandTotal', 'enableJSONRendering', 'enablePivotFieldList',
                'enableRowGrandTotal', 'enableRTL', 'enableToolTip', 'enableToolTipAnimation', 'enableColumnResizing',
                'enableVirtualScrolling', 'enablePaging', 'hyperlinkSettings', 'isResponsive', 'jsonRecords',
                'layout', 'locale', 'operationalMode', 'serviceMethodSettings', 'url',
                'dataSource.cube', 'dataSource.data', 'dataSource.catalog', 'dataSource.enableAdvancedFilter', 'dataSource.reportName',
                'dataSource.pagerOptions', 'dataSource.pagerOptions.categoricalPageSize', 'dataSource.pagerOptions.seriesPageSize', 'dataSource.pagerOptions.categoricalCurrentPage', 'dataSource.pagerOptions.seriesCurrentPage',
                'frozenHeaderSettings.enableFrozenRowHeaders', 'frozenHeaderSettings.enableFrozenColumnHeaders', 'frozenHeaderSettings.enableFrozenHeaders', 'hyperlinkSettings.enableColumnHeaderHyperlink', 'hyperlinkSettings.enableRowHeaderHyperlink',
                'hyperlinkSettings.enableSummaryCellHyperlink', 'hyperlinkSettings.enableValueCellHyperlink', 'serviceMethodSettings.drillDown', 'serviceMethodSettings.exportPivotGrid', 'serviceMethodSettings.deferUpdate',
                'serviceMethodSettings.fetchMembers', 'serviceMethodSettings.filtering', 'serviceMethodSettings.initialize', 'serviceMethodSettings.nodeDropped', 'serviceMethodSettings.nodeStateModified',
                'serviceMethodSettings.paging', 'serviceMethodSettings.sorting', 'serviceMethodSettings.memberExpand', 'serviceMethodSettings.cellEditing', 'serviceMethodSettings.saveReport',
                'serviceMethodSettings.loadReport', 'serviceMethodSettings.calculatedField', 'serviceMethodSettings.drillThroughHierarchies', 'serviceMethodSettings.drillThroughDataTable', 'serviceMethodSettings.writeBack',
                'dataSource.columns', 'dataSource.rows', 'dataSource.values', 'dataSource.filters'], []);
            exports_37("PivotGridComponent", PivotGridComponent = core_38.CreateComponent('PivotGrid', {
                selector: 'ej-pivotgrid',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_37("EJ_PIVOTGRID_COMPONENTS", EJ_PIVOTGRID_COMPONENTS = [PivotGridComponent]);
        }
    }
});
System.register("ej/pivotschemadesigner.component", ["ej/core"], function(exports_38, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    var core_39;
    var Outputs, ComplexProperties, Inputs, PivotSchemaDesignerComponent, EJ_PIVOTSCHEMADESIGNER_COMPONENTS;
    return {
        setters:[
            function (core_39_1) {
                core_39 = core_39_1;
            }],
        execute: function() {
            Outputs = ['afterServiceInvoke', 'beforeServiceInvoke', 'dragMove'
            ];
            ComplexProperties = ['olap', 'serviceMethod'];
            Inputs = core_39.Utils.AngularizeInputs(['cssClass', 'customObject', 'enableWrapper', 'enableRTL', 'olap',
                'enableDragDrop', 'height', 'locale', 'pivotControl', 'serviceMethod',
                'url', 'width', 'layout', 'olap.showKPI', 'olap.showNamedSets',
                'serviceMethod.fetchMembers', 'serviceMethod.filtering', 'serviceMethod.memberExpand', 'serviceMethod.nodeDropped', 'serviceMethod.nodeStateModified',
                'serviceMethod.removeButton'], []);
            exports_38("PivotSchemaDesignerComponent", PivotSchemaDesignerComponent = core_39.CreateComponent('PivotSchemaDesigner', {
                selector: 'ej-pivotschemadesigner',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_38("EJ_PIVOTSCHEMADESIGNER_COMPONENTS", EJ_PIVOTSCHEMADESIGNER_COMPONENTS = [PivotSchemaDesignerComponent]);
        }
    }
});
System.register("ej/pivottreemap.component", ["ej/core"], function(exports_39, context_39) {
    "use strict";
    var __moduleName = context_39 && context_39.id;
    var core_40;
    var Outputs, ComplexProperties, Inputs, PivotTreeMapComponent, EJ_PIVOTTREEMAP_COMPONENTS;
    return {
        setters:[
            function (core_40_1) {
                core_40 = core_40_1;
            }],
        execute: function() {
            Outputs = ['afterServiceInvoke', 'beforeServiceInvoke', 'load', 'beforePivotEnginePopulate', 'drillSuccess',
                'renderComplete', 'renderFailure', 'renderSuccess'
            ];
            ComplexProperties = ['dataSource', 'serviceMethodSettings'];
            Inputs = core_40.Utils.AngularizeInputs(['cssClass', 'dataSource', 'customObject', 'isResponsive', 'locale',
                'operationalMode', 'serviceMethodSettings', 'url', 'dataSource.data', 'dataSource.cube',
                'dataSource.catalog', 'serviceMethodSettings.initialize', 'serviceMethodSettings.drillDown', 'dataSource.columns', 'dataSource.rows',
                'dataSource.values', 'dataSource.filters'], []);
            exports_39("PivotTreeMapComponent", PivotTreeMapComponent = core_40.CreateComponent('PivotTreeMap', {
                selector: 'ej-pivottreemap',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_39("EJ_PIVOTTREEMAP_COMPONENTS", EJ_PIVOTTREEMAP_COMPONENTS = [PivotTreeMapComponent]);
        }
    }
});
System.register("ej/progressbar.component", ["ej/core"], function(exports_40, context_40) {
    "use strict";
    var __moduleName = context_40 && context_40.id;
    var core_41;
    var Outputs, ComplexProperties, Inputs, ProgressBarComponent, EJ_PROGRESSBAR_COMPONENTS;
    return {
        setters:[
            function (core_41_1) {
                core_41 = core_41_1;
            }],
        execute: function() {
            Outputs = ['change', 'complete', 'create', 'destroy', 'start'
            ];
            ComplexProperties = [];
            Inputs = core_41.Utils.AngularizeInputs(['cssClass', 'enabled', 'enablePersistence', 'enableRTL', 'height',
                'htmlAttributes', 'maxValue', 'minValue', 'percentage', 'showRoundedCorner',
                'text', 'value', 'width'], []);
            exports_40("ProgressBarComponent", ProgressBarComponent = core_41.CreateComponent('ProgressBar', {
                selector: 'ej-progressbar',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_40("EJ_PROGRESSBAR_COMPONENTS", EJ_PROGRESSBAR_COMPONENTS = [ProgressBarComponent]);
        }
    }
});
System.register("ej/radialmenu.component", ["ej/core"], function(exports_41, context_41) {
    "use strict";
    var __moduleName = context_41 && context_41.id;
    var core_42;
    var RadialMenuTemplateDirective, ItemDirective, ItemsDirective, Outputs, ComplexProperties, Inputs, RadialMenuComponent, EJ_RADIALMENU_COMPONENTS;
    return {
        setters:[
            function (core_42_1) {
                core_42 = core_42_1;
            }],
        execute: function() {
            exports_41("RadialMenuTemplateDirective", RadialMenuTemplateDirective = core_42.CreateTemplateDirective({
                selector: "[e-template]"
            }, {
                type: core_42.forwardRef(function () { return ItemDirective; })
            }));
            exports_41("ItemDirective", ItemDirective = core_42.CreateComplexDirective({
                selector: 'e-items>e-item',
                inputs: ['imageUrl', 'text', 'enabled', 'click', 'badge',
                    'badge.enabled', 'badge.value', 'type', 'sliderSettings', 'sliderSettings.ticks',
                    'sliderSettings.strokeWidth', 'sliderSettings.labelSpace', 'items'],
                queries: {}
            }, {
                tags: [],
                complexes: ['badge', 'sliderSettings'],
                type: core_42.forwardRef(function () { return RadialMenuComponent; })
            }));
            exports_41("ItemsDirective", ItemsDirective = core_42.CreateArrayTagDirective('items', 'ej-radialmenu>e-items', ItemDirective));
            Outputs = ['click', 'open', 'close'
            ];
            ComplexProperties = [];
            Inputs = core_42.Utils.AngularizeInputs(['autoOpen', 'backImageClass', 'cssClass', 'enableAnimation', 'imageClass',
                'radius', 'targetElementId', 'position', 'items'], []);
            exports_41("RadialMenuComponent", RadialMenuComponent = core_42.CreateComponent('RadialMenu', {
                selector: 'ej-radialmenu',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _items: new core_42.ContentChild(ItemsDirective),
                }
            }, {
                tags: ['items'],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_41("EJ_RADIALMENU_COMPONENTS", EJ_RADIALMENU_COMPONENTS = [RadialMenuComponent, ItemsDirective, ItemDirective, RadialMenuTemplateDirective]);
        }
    }
});
System.register("ej/radialslider.component", ["ej/core"], function(exports_42, context_42) {
    "use strict";
    var __moduleName = context_42 && context_42.id;
    var core_43;
    var Outputs, ComplexProperties, Inputs, RadialSliderComponent, EJ_RADIALSLIDER_COMPONENTS;
    return {
        setters:[
            function (core_43_1) {
                core_43 = core_43_1;
            }],
        execute: function() {
            Outputs = ['change', 'create', 'mouseover', 'slide', 'start',
                'stop',
                'model.valueChange: valueChange'];
            ComplexProperties = [];
            Inputs = core_43.Utils.AngularizeInputs(['autoOpen', 'cssClass', 'enableAnimation', 'enableRoundOff', 'endAngle',
                'inline', 'innerCircleImageClass', 'innerCircleImageUrl', 'labelSpace', 'radius',
                'showInnerCircle', 'startAngle', 'strokeWidth', 'ticks'], ['value']);
            exports_42("RadialSliderComponent", RadialSliderComponent = core_43.CreateComponent('RadialSlider', {
                selector: 'ej-radialslider',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: ['value'],
                complexes: ComplexProperties,
            }));
            exports_42("EJ_RADIALSLIDER_COMPONENTS", EJ_RADIALSLIDER_COMPONENTS = [RadialSliderComponent]);
        }
    }
});
System.register("ej/radiobutton.component", ["ej/core"], function(exports_43, context_43) {
    "use strict";
    var __moduleName = context_43 && context_43.id;
    var core_44;
    var Outputs, ComplexProperties, Inputs, RadioButtonComponent, RadioButtonValueAccessor, EJ_RADIOBUTTON_COMPONENTS;
    return {
        setters:[
            function (core_44_1) {
                core_44 = core_44_1;
            }],
        execute: function() {
            Outputs = ['beforeChange', 'change', 'create', 'destroy'
            ];
            ComplexProperties = [];
            Inputs = core_44.Utils.AngularizeInputs(['checked', 'cssClass', 'enabled', 'enablePersistence', 'enableRTL',
                'htmlAttributes', 'id', 'idPrefix', 'name', 'size',
                'text', 'validationMessage', 'validationRules', 'value'], []);
            exports_43("RadioButtonComponent", RadioButtonComponent = core_44.CreateComponent('RadioButton', {
                selector: '[ej-radiobutton]',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_43("RadioButtonValueAccessor", RadioButtonValueAccessor = core_44.CreateControlValueAccessor('[ej-radiobutton]', RadioButtonComponent));
            exports_43("EJ_RADIOBUTTON_COMPONENTS", EJ_RADIOBUTTON_COMPONENTS = [RadioButtonComponent, RadioButtonValueAccessor]);
        }
    }
});
System.register("ej/rangenavigator.component", ["ej/core"], function(exports_44, context_44) {
    "use strict";
    var __moduleName = context_44 && context_44.id;
    var core_45;
    var Outputs, ComplexProperties, Inputs, RangeNavigatorComponent, EJ_RANGENAVIGATOR_COMPONENTS;
    return {
        setters:[
            function (core_45_1) {
                core_45 = core_45_1;
            }],
        execute: function() {
            Outputs = ['load', 'loaded', 'rangeChanged', 'scrollChanged', 'scrollStart',
                'scrollEnd'
            ];
            ComplexProperties = ['border', 'labelSettings', 'navigatorStyleSettings', 'rangeSettings', 'selectedRangeSettings',
                'scrollRangeSettings', 'sizeSettings', 'tooltipSettings', 'valueAxisSettings', 'labelSettings.higherLevel',
                'labelSettings.higherLevel.border', 'labelSettings.higherLevel.gridLineStyle', 'labelSettings.higherLevel.style', 'labelSettings.higherLevel.style.font', 'labelSettings.lowerLevel',
                'labelSettings.lowerLevel.border', 'labelSettings.lowerLevel.gridLineStyle', 'labelSettings.lowerLevel.style', 'labelSettings.lowerLevel.style.font', 'labelSettings.style',
                'labelSettings.style.font', 'navigatorStyleSettings.border', 'navigatorStyleSettings.majorGridLineStyle', 'navigatorStyleSettings.minorGridLineStyle', 'navigatorStyleSettings.highlightSettings',
                'navigatorStyleSettings.highlightSettings.border', 'navigatorStyleSettings.selectionSettings', 'navigatorStyleSettings.selectionSettings.border', 'tooltipSettings.font', 'valueAxisSettings.axisLine',
                'valueAxisSettings.font', 'valueAxisSettings.majorGridLines', 'valueAxisSettings.majorTickLines'];
            Inputs = core_45.Utils.AngularizeInputs(['allowSnapping', 'border', 'dataSource', 'enableDeferredUpdate', 'enableScrollbar',
                'enableRTL', 'isResponsive', 'labelSettings', 'locale', 'navigatorStyleSettings',
                'padding', 'rangePadding', 'rangeSettings', 'selectedData', 'selectedRangeSettings',
                'scrollRangeSettings', 'sizeSettings', 'theme', 'tooltipSettings', 'valueAxisSettings',
                'valueType', 'xName', 'yName', 'border.color', 'border.opacity',
                'border.width', 'labelSettings.higherLevel', 'labelSettings.higherLevel.border', 'labelSettings.higherLevel.fill', 'labelSettings.higherLevel.gridLineStyle',
                'labelSettings.higherLevel.intervalType', 'labelSettings.higherLevel.labelPlacement', 'labelSettings.higherLevel.position', 'labelSettings.higherLevel.style', 'labelSettings.higherLevel.visible',
                'labelSettings.lowerLevel', 'labelSettings.lowerLevel.border', 'labelSettings.lowerLevel.fill', 'labelSettings.lowerLevel.gridLineStyle', 'labelSettings.lowerLevel.intervalType',
                'labelSettings.lowerLevel.labelPlacement', 'labelSettings.lowerLevel.position', 'labelSettings.lowerLevel.style', 'labelSettings.lowerLevel.visible', 'labelSettings.style',
                'labelSettings.style.font', 'labelSettings.style.horizontalAlignment', 'navigatorStyleSettings.background', 'navigatorStyleSettings.border', 'navigatorStyleSettings.border.color',
                'navigatorStyleSettings.border.dashArray', 'navigatorStyleSettings.border.width', 'navigatorStyleSettings.leftThumbTemplate', 'navigatorStyleSettings.majorGridLineStyle', 'navigatorStyleSettings.majorGridLineStyle.color',
                'navigatorStyleSettings.majorGridLineStyle.visible', 'navigatorStyleSettings.minorGridLineStyle', 'navigatorStyleSettings.minorGridLineStyle.color', 'navigatorStyleSettings.minorGridLineStyle.visible', 'navigatorStyleSettings.opacity',
                'navigatorStyleSettings.rightThumbTemplate', 'navigatorStyleSettings.selectedRegionColor', 'navigatorStyleSettings.selectedRegionOpacity', 'navigatorStyleSettings.thumbColor', 'navigatorStyleSettings.thumbRadius',
                'navigatorStyleSettings.thumbStroke', 'navigatorStyleSettings.unselectedRegionColor', 'navigatorStyleSettings.unselectedRegionOpacity', 'navigatorStyleSettings.highlightSettings', 'navigatorStyleSettings.highlightSettings.enable',
                'navigatorStyleSettings.highlightSettings.color', 'navigatorStyleSettings.highlightSettings.opacity', 'navigatorStyleSettings.highlightSettings.border', 'navigatorStyleSettings.selectionSettings', 'navigatorStyleSettings.selectionSettings.enable',
                'navigatorStyleSettings.selectionSettings.color', 'navigatorStyleSettings.selectionSettings.opacity', 'navigatorStyleSettings.selectionSettings.border', 'rangeSettings.end', 'rangeSettings.start',
                'selectedRangeSettings.end', 'selectedRangeSettings.start', 'scrollRangeSettings.end', 'scrollRangeSettings.start', 'sizeSettings.height',
                'sizeSettings.width', 'tooltipSettings.backgroundColor', 'tooltipSettings.font', 'tooltipSettings.font.color', 'tooltipSettings.font.family',
                'tooltipSettings.font.fontStyle', 'tooltipSettings.font.opacity', 'tooltipSettings.font.size', 'tooltipSettings.font.weight', 'tooltipSettings.labelFormat',
                'tooltipSettings.tooltipDisplayMode', 'tooltipSettings.visible', 'valueAxisSettings.axisLine', 'valueAxisSettings.axisLine.visible', 'valueAxisSettings.font',
                'valueAxisSettings.font.size', 'valueAxisSettings.majorGridLines', 'valueAxisSettings.majorGridLines.visible', 'valueAxisSettings.majorTickLines', 'valueAxisSettings.majorTickLines.size',
                'valueAxisSettings.majorTickLines.visible', 'valueAxisSettings.majorTickLines.width', 'valueAxisSettings.rangePadding', 'valueAxisSettings.visible', 'series'], []);
            exports_44("RangeNavigatorComponent", RangeNavigatorComponent = core_45.CreateComponent('RangeNavigator', {
                selector: 'ej-rangenavigator',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_44("EJ_RANGENAVIGATOR_COMPONENTS", EJ_RANGENAVIGATOR_COMPONENTS = [RangeNavigatorComponent]);
        }
    }
});
System.register("ej/rating.component", ["ej/core"], function(exports_45, context_45) {
    "use strict";
    var __moduleName = context_45 && context_45.id;
    var core_46;
    var Outputs, ComplexProperties, Inputs, RatingComponent, EJ_RATING_COMPONENTS;
    return {
        setters:[
            function (core_46_1) {
                core_46 = core_46_1;
            }],
        execute: function() {
            Outputs = ['change', 'click', 'create', 'destroy', 'mouseout',
                'mouseover',
                'model.valueChange: valueChange'];
            ComplexProperties = [];
            Inputs = core_46.Utils.AngularizeInputs(['allowReset', 'cssClass', 'enabled', 'enablePersistence', 'height',
                'htmlAttributes', 'incrementStep', 'maxValue', 'minValue', 'orientation',
                'precision', 'readOnly', 'shapeHeight', 'shapeWidth', 'showTooltip',
                'width'], ['value']);
            exports_45("RatingComponent", RatingComponent = core_46.CreateComponent('Rating', {
                selector: 'ej-rating',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: ['value'],
                complexes: ComplexProperties,
            }));
            exports_45("EJ_RATING_COMPONENTS", EJ_RATING_COMPONENTS = [RatingComponent]);
        }
    }
});
System.register("ej/reportviewer.component", ["ej/core"], function(exports_46, context_46) {
    "use strict";
    var __moduleName = context_46 && context_46.id;
    var core_47;
    var Outputs, ComplexProperties, Inputs, ReportViewerComponent, EJ_REPORTVIEWER_COMPONENTS;
    return {
        setters:[
            function (core_47_1) {
                core_47 = core_47_1;
            }],
        execute: function() {
            Outputs = ['destroy', 'drillThrough', 'renderingBegin', 'renderingComplete', 'reportError',
                'reportExport', 'reportLoaded', 'viewReportClick'
            ];
            ComplexProperties = ['exportSettings', 'pageSettings', 'toolbarSettings'];
            Inputs = core_47.Utils.AngularizeInputs(['enablePageCache', 'exportSettings', 'isResponsive', 'locale', 'pageSettings',
                'printMode', 'printOptions', 'processingMode', 'renderMode', 'reportPath',
                'reportServerUrl', 'reportServiceUrl', 'toolbarSettings', 'zoomFactor', 'exportSettings.exportOptions',
                'exportSettings.excelFormat', 'exportSettings.wordFormat', 'pageSettings.orientation', 'pageSettings.paperSize', 'toolbarSettings.click',
                'toolbarSettings.items', 'toolbarSettings.showToolbar', 'toolbarSettings.showTooltip', 'toolbarSettings.templateId', 'dataSources',
                'parameters'], []);
            exports_46("ReportViewerComponent", ReportViewerComponent = core_47.CreateComponent('ReportViewer', {
                selector: 'ej-reportviewer',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_46("EJ_REPORTVIEWER_COMPONENTS", EJ_REPORTVIEWER_COMPONENTS = [ReportViewerComponent]);
        }
    }
});
System.register("ej/ribbon.component", ["ej/core"], function(exports_47, context_47) {
    "use strict";
    var __moduleName = context_47 && context_47.id;
    var core_48;
    var PageDirective, ApplicationTabBackstageSettingsPagesDirective, ContentGroupDirective, ContentGroupsDirective, ContentDirective, ContentsDirective, GroupDirective, GroupsDirective, TabDirective, TabsDirective, Outputs, ComplexProperties, Inputs, RibbonComponent, EJ_RIBBON_COMPONENTS;
    return {
        setters:[
            function (core_48_1) {
                core_48 = core_48_1;
            }],
        execute: function() {
            exports_47("PageDirective", PageDirective = core_48.CreateComplexDirective({
                selector: 'e-applicationtab-backstagesettings-pages>e-page',
                inputs: ['id', 'text', 'itemType', 'contentID', 'enableSeparator'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_48.forwardRef(function () { return RibbonComponent; })
            }));
            exports_47("ApplicationTabBackstageSettingsPagesDirective", ApplicationTabBackstageSettingsPagesDirective = core_48.CreateArrayTagDirective('applicationTab.backstageSettings.pages', 'ej-ribbon>e-applicationtab-backstagesettings-pages', PageDirective));
            exports_47("ContentGroupDirective", ContentGroupDirective = core_48.CreateComplexDirective({
                selector: 'e-contentgroups>e-contentgroup',
                inputs: ['isMobileOnly', 'buttonSettings', 'columns', 'contentID', 'cssClass',
                    'customGalleryItems', 'customToolTip', 'customToolTip.content', 'customToolTip.prefixIcon', 'customToolTip.title',
                    'dropdownSettings', 'enableSeparator', 'expandedColumns', 'galleryItems', 'id',
                    'isBig', 'itemHeight', 'itemWidth', 'splitButtonSettings', 'text',
                    'toggleButtonSettings', 'toolTip', 'quickAccessMode', 'type'],
                queries: {}
            }, {
                tags: [],
                complexes: ['customToolTip'],
                type: core_48.forwardRef(function () { return RibbonComponent; })
            }));
            exports_47("ContentGroupsDirective", ContentGroupsDirective = core_48.CreateArrayTagDirective('groups', 'e-content>e-contentgroups', ContentGroupDirective));
            exports_47("ContentDirective", ContentDirective = core_48.CreateComplexDirective({
                selector: 'e-contents>e-content',
                inputs: ['defaults', 'defaults.height', 'defaults.width', 'defaults.type', 'defaults.isBig',
                    'groups'],
                queries: {
                    _groups: new core_48.ContentChild(ContentGroupsDirective),
                }
            }, {
                tags: ['groups'],
                complexes: ['defaults'],
                type: core_48.forwardRef(function () { return RibbonComponent; })
            }));
            exports_47("ContentsDirective", ContentsDirective = core_48.CreateArrayTagDirective('content', 'e-groups>e-contents', ContentDirective));
            exports_47("GroupDirective", GroupDirective = core_48.CreateComplexDirective({
                selector: 'e-groups>e-group',
                inputs: ['alignType', 'content', 'contentID', 'customContent', 'enableGroupExpander',
                    'groupExpanderSettings', 'groupExpanderSettings.toolTip', 'groupExpanderSettings.customToolTip', 'text', 'type'],
                queries: {
                    _content: new core_48.ContentChild(ContentsDirective),
                }
            }, {
                tags: ['content'],
                complexes: ['groupExpanderSettings'],
                type: core_48.forwardRef(function () { return RibbonComponent; })
            }));
            exports_47("GroupsDirective", GroupsDirective = core_48.CreateArrayTagDirective('groups', 'e-tabs>e-groups', GroupDirective));
            exports_47("TabDirective", TabDirective = core_48.CreateComplexDirective({
                selector: 'e-tabs>e-tab',
                inputs: ['groups', 'id', 'text'],
                queries: {
                    _groups: new core_48.ContentChild(GroupsDirective),
                }
            }, {
                tags: ['groups'],
                complexes: [],
                type: core_48.forwardRef(function () { return RibbonComponent; })
            }));
            exports_47("TabsDirective", TabsDirective = core_48.CreateArrayTagDirective('tabs', 'ej-ribbon>e-tabs', TabDirective));
            Outputs = ['beforeTabRemove', 'create', 'destroy', 'groupClick', 'groupExpand',
                'galleryItemClick', 'backstageItemClick', 'collapse', 'expand', 'load',
                'tabAdd', 'tabClick', 'tabCreate', 'tabRemove', 'tabSelect',
                'toggleButtonClick', 'qatMenuItemClick'
            ];
            ComplexProperties = ['collapsePinSettings', 'expandPinSettings', 'applicationTab', 'applicationTab.backstageSettings'];
            Inputs = core_48.Utils.AngularizeInputs(['allowResizing', 'isResponsive', 'buttonDefaults', 'showQAT', 'collapsePinSettings',
                'enableOnDemand', 'collapsible', 'enableRTL', 'expandPinSettings', 'applicationTab',
                'disabledItemIndex', 'enabledItemIndex', 'selectedItemIndex', 'locale', 'width',
                'collapsePinSettings.toolTip', 'collapsePinSettings.customToolTip', 'expandPinSettings.toolTip', 'expandPinSettings.customToolTip', 'applicationTab.backstageSettings',
                'applicationTab.backstageSettings.text', 'applicationTab.backstageSettings.height', 'applicationTab.backstageSettings.width', 'applicationTab.backstageSettings.headerWidth', 'applicationTab.menuItemID',
                'applicationTab.menuSettings', 'applicationTab.type', 'contextualTabs', 'tabs', 'applicationTab.backstageSettings.pages',
                'tabs.groups.content', 'tabs.groups.content.groups.customGalleryItems', 'tabs.groups.content.groups.galleryItems'], []);
            exports_47("RibbonComponent", RibbonComponent = core_48.CreateComponent('Ribbon', {
                selector: 'ej-ribbon',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _applicationTab_backstageSettings_pages: new core_48.ContentChild(ApplicationTabBackstageSettingsPagesDirective),
                    _tabs: new core_48.ContentChild(TabsDirective),
                }
            }, {
                tags: ['applicationTab.backstageSettings.pages', 'tabs'],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_47("EJ_RIBBON_COMPONENTS", EJ_RIBBON_COMPONENTS = [RibbonComponent, ApplicationTabBackstageSettingsPagesDirective, ContentGroupsDirective, ContentsDirective, GroupsDirective, TabsDirective, PageDirective, ContentGroupDirective, ContentDirective, GroupDirective, TabDirective]);
        }
    }
});
System.register("ej/rotator.component", ["ej/core"], function(exports_48, context_48) {
    "use strict";
    var __moduleName = context_48 && context_48.id;
    var core_49;
    var Outputs, ComplexProperties, Inputs, RotatorComponent, EJ_ROTATOR_COMPONENTS;
    return {
        setters:[
            function (core_49_1) {
                core_49 = core_49_1;
            }],
        execute: function() {
            Outputs = ['change', 'create', 'destroy', 'pagerClick', 'start',
                'stop', 'thumbItemClick'
            ];
            ComplexProperties = ['fields'];
            Inputs = core_49.Utils.AngularizeInputs(['allowKeyboardNavigation', 'animationSpeed', 'animationType', 'circularMode', 'cssClass',
                'dataSource', 'delay', 'displayItemsCount', 'enableAutoPlay', 'enabled',
                'enableRTL', 'fields', 'frameSpace', 'isResponsive', 'navigateSteps',
                'orientation', 'pagerPosition', 'query', 'showCaption', 'showNavigateButton',
                'showPager', 'showPlayButton', 'showThumbnail', 'slideHeight', 'slideWidth',
                'startIndex', 'stopOnHover', 'template', 'templateId', 'thumbnailSourceID',
                'fields.linkAttribute', 'fields.targetAttribute', 'fields.text', 'fields.thumbnailText', 'fields.thumbnailUrl',
                'fields.url'], []);
            exports_48("RotatorComponent", RotatorComponent = core_49.CreateComponent('Rotator', {
                selector: '[ej-rotator]',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_48("EJ_ROTATOR_COMPONENTS", EJ_ROTATOR_COMPONENTS = [RotatorComponent]);
        }
    }
});
System.register("ej/rte.component", ["ej/core"], function(exports_49, context_49) {
    "use strict";
    var __moduleName = context_49 && context_49.id;
    var core_50;
    var Outputs, ComplexProperties, Inputs, RTEComponent, RTEValueAccessor, EJ_RTE_COMPONENTS;
    return {
        setters:[
            function (core_50_1) {
                core_50 = core_50_1;
            }],
        execute: function() {
            Outputs = ['change', 'create', 'contextMenuClick', 'destroy', 'execute',
                'keydown', 'keyup', 'preRender', 'select',
                'model.valueChange: valueChange'];
            ComplexProperties = ['fileBrowser', 'imageBrowser', 'tools'];
            Inputs = core_50.Utils.AngularizeInputs(['allowEditing', 'allowKeyboardNavigation', 'autoFocus', 'autoHeight', 'colorCode',
                'colorPaletteColumns', 'colorPaletteRows', 'cssClass', 'enabled', 'enableHtmlEncode',
                'enablePersistence', 'enableResize', 'enableRTL', 'enableXHTML', 'enableTabKeyNavigation',
                'externalCSS', 'fileBrowser', 'fontName', 'fontSize', 'format',
                'height', 'htmlAttributes', 'iframeAttributes', 'imageBrowser', 'isResponsive',
                'locale', 'maxHeight', 'maxLength', 'maxWidth', 'minHeight',
                'minWidth', 'name', 'showClearAll', 'showClearFormat', 'showCustomTable',
                'showContextMenu', 'showDimensions', 'showFontOption', 'showFooter', 'showHtmlSource',
                'showHtmlTagInfo', 'showToolbar', 'showCharCount', 'showRoundedCorner', 'showWordCount',
                'tableColumns', 'tableRows', 'tools', 'toolsList', 'tooltipSettings',
                'undoStackLimit', 'validationRules', 'validationMessage', 'width', 'zoomStep',
                'fileBrowser.ajaxAction', 'fileBrowser.extensionAllow', 'fileBrowser.filePath', 'imageBrowser.ajaxAction', 'imageBrowser.extensionAllow',
                'imageBrowser.filePath', 'tools.alignment', 'tools.casing', 'tools.clear', 'tools.clipboard',
                'tools.edit', 'tools.doAction', 'tools.effects', 'tools.font', 'tools.formatStyle',
                'tools.images', 'tools.indenting', 'tools.links', 'tools.lists', 'tools.media',
                'tools.style', 'tools.tables', 'tools.view', 'tools.print', 'tools.customOrderedList',
                'tools.customUnorderedList'], ['value']);
            exports_49("RTEComponent", RTEComponent = core_50.CreateComponent('RTE', {
                selector: '[ej-rte]',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: ['value'],
                complexes: ComplexProperties,
            }));
            exports_49("RTEValueAccessor", RTEValueAccessor = core_50.CreateControlValueAccessor('[ej-rte]', RTEComponent));
            exports_49("EJ_RTE_COMPONENTS", EJ_RTE_COMPONENTS = [RTEComponent, RTEValueAccessor]);
        }
    }
});
System.register("ej/schedule.component", ["ej/core"], function(exports_50, context_50) {
    "use strict";
    var __moduleName = context_50 && context_50.id;
    var core_51;
    var ResourceDirective, ResourcesDirective, Outputs, ComplexProperties, Inputs, ScheduleComponent, EJ_SCHEDULE_COMPONENTS;
    return {
        setters:[
            function (core_51_1) {
                core_51 = core_51_1;
            }],
        execute: function() {
            exports_50("ResourceDirective", ResourceDirective = core_51.CreateComplexDirective({
                selector: 'e-resources>e-resource',
                inputs: ['field', 'title', 'name', 'allowMultiple', 'resourceSettings',
                    'resourceSettings.dataSource', 'resourceSettings.text', 'resourceSettings.id', 'resourceSettings.groupId', 'resourceSettings.color',
                    'resourceSettings.start', 'resourceSettings.end', 'resourceSettings.workWeek', 'resourceSettings.appointmentClass'],
                queries: {}
            }, {
                tags: [],
                complexes: ['resourceSettings'],
                type: core_51.forwardRef(function () { return ScheduleComponent; })
            }));
            exports_50("ResourcesDirective", ResourcesDirective = core_51.CreateArrayTagDirective('resources', 'ej-schedule>e-resources', ResourceDirective));
            Outputs = ['actionBegin', 'actionComplete', 'appointmentClick', 'beforeAppointmentRemove', 'beforeAppointmentChange',
                'appointmentHover', 'beforeAppointmentCreate', 'appointmentWindowOpen', 'beforeContextMenuOpen', 'cellClick',
                'cellDoubleClick', 'cellHover', 'create', 'destroy', 'drag',
                'dragStart', 'dragStop', 'menuItemClick', 'navigation', 'queryCellInfo',
                'reminder', 'resize', 'resizeStart', 'resizeStop', 'overflowButtonClick',
                'overflowButtonHover', 'keyDown', 'appointmentCreated', 'appointmentChanged', 'appointmentRemoved',
                'model.appointmentSettings.dataSourceChange: appointmentSettings.dataSourceChange', 'model.currentViewChange: currentViewChange', 'model.currentDateChange: currentDateChange'];
            ComplexProperties = ['appointmentSettings', 'categorizeSettings', 'contextMenuSettings', 'group', 'workHours',
                'prioritySettings', 'reminderSettings', 'renderDates', 'timeZoneCollection', 'agendaViewSettings',
                'tooltipSettings', 'timeScale', 'blockoutSettings', 'contextMenuSettings.menuItems'];
            Inputs = core_51.Utils.AngularizeInputs(['allowDragAndDrop', 'allowKeyboardNavigation', 'appointmentSettings', 'appointmentTemplateId', 'cssClass',
                'categorizeSettings', 'cellHeight', 'cellWidth', 'contextMenuSettings', 'dateFormat',
                'showAppointmentNavigator', 'enableAppointmentResize', 'enableLoadOnDemand', 'enablePersistence', 'enableRTL',
                'endHour', 'group', 'height', 'workHours', 'isDST',
                'isResponsive', 'locale', 'maxDate', 'minDate', 'orientation',
                'prioritySettings', 'readOnly', 'reminderSettings', 'renderDates', 'resourceHeaderTemplateId',
                'showAllDayRow', 'showCurrentTimeIndicator', 'showHeaderBar', 'showLocationField', 'showTimeZoneFields',
                'showQuickWindow', 'startHour', 'timeMode', 'timeZone', 'timeZoneCollection',
                'views', 'width', 'enableRecurrenceValidation', 'agendaViewSettings', 'firstDayOfWeek',
                'workWeek', 'tooltipSettings', 'timeScale', 'showDeleteConfirmationDialog', 'allDayCellsTemplateId',
                'workCellsTemplateId', 'dateHeaderTemplateId', 'showOverflowButton', 'appointmentDragArea', 'showNextPrevMonth',
                'blockoutSettings', 'appointmentSettings.query', 'appointmentSettings.tableName', 'appointmentSettings.applyTimeOffset', 'appointmentSettings.id',
                'appointmentSettings.startTime', 'appointmentSettings.endTime', 'appointmentSettings.subject', 'appointmentSettings.description', 'appointmentSettings.recurrence',
                'appointmentSettings.recurrenceRule', 'appointmentSettings.allDay', 'appointmentSettings.resourceFields', 'appointmentSettings.categorize', 'appointmentSettings.location',
                'appointmentSettings.priority', 'appointmentSettings.startTimeZone', 'appointmentSettings.endTimeZone', 'categorizeSettings.allowMultiple', 'categorizeSettings.enable',
                'categorizeSettings.dataSource', 'categorizeSettings.id', 'categorizeSettings.text', 'categorizeSettings.color', 'categorizeSettings.fontColor',
                'contextMenuSettings.enable', 'contextMenuSettings.menuItems', 'contextMenuSettings.menuItems.appointment', 'contextMenuSettings.menuItems.cells', 'group.resources',
                'workHours.highlight', 'workHours.start', 'workHours.end', 'prioritySettings.enable', 'prioritySettings.dataSource',
                'prioritySettings.text', 'prioritySettings.value', 'prioritySettings.template', 'reminderSettings.enable', 'reminderSettings.alertBefore',
                'renderDates.start', 'renderDates.end', 'timeZoneCollection.dataSource', 'timeZoneCollection.text', 'timeZoneCollection.id',
                'timeZoneCollection.value', 'agendaViewSettings.daysInAgenda', 'agendaViewSettings.dateColumnTemplateId', 'agendaViewSettings.timeColumnTemplateId', 'tooltipSettings.enable',
                'tooltipSettings.templateId', 'timeScale.enable', 'timeScale.minorSlotCount', 'timeScale.majorSlot', 'timeScale.minorSlotTemplateId',
                'timeScale.majorSlotTemplateId', 'blockoutSettings.enable', 'blockoutSettings.templateId', 'blockoutSettings.dataSource', 'blockoutSettings.query',
                'blockoutSettings.tableName', 'blockoutSettings.id', 'blockoutSettings.startTime', 'blockoutSettings.endTime', 'blockoutSettings.subject',
                'blockoutSettings.isBlockAppointment', 'blockoutSettings.isAllDay', 'blockoutSettings.resourceId', 'blockoutSettings.customStyle', 'resources'], ['appointmentSettings.dataSource', 'currentView', 'currentDate']);
            exports_50("ScheduleComponent", ScheduleComponent = core_51.CreateComponent('Schedule', {
                selector: 'ej-schedule',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _resources: new core_51.ContentChild(ResourcesDirective),
                }
            }, {
                tags: ['resources'],
                twoways: ['appointmentSettings.dataSource', 'currentView', 'currentDate'],
                complexes: ComplexProperties,
            }));
            exports_50("EJ_SCHEDULE_COMPONENTS", EJ_SCHEDULE_COMPONENTS = [ScheduleComponent, ResourcesDirective, ResourceDirective]);
        }
    }
});
System.register("ej/scroller.component", ["ej/core"], function(exports_51, context_51) {
    "use strict";
    var __moduleName = context_51 && context_51.id;
    var core_52;
    var Outputs, ComplexProperties, Inputs, ScrollerComponent, EJ_SCROLLER_COMPONENTS;
    return {
        setters:[
            function (core_52_1) {
                core_52 = core_52_1;
            }],
        execute: function() {
            Outputs = ['create', 'destroy', 'thumbMove', 'thumbStart', 'thumbEnd',
                'wheelMove', 'wheelStart', 'wheelStop'
            ];
            ComplexProperties = [];
            Inputs = core_52.Utils.AngularizeInputs(['animationSpeed', 'autoHide', 'buttonSize', 'enabled', 'enablePersistence',
                'enableRTL', 'enableTouchScroll', 'height', 'scrollerSize', 'scrollLeft',
                'scrollOneStepBy', 'scrollTop', 'targetPane', 'width'], []);
            exports_51("ScrollerComponent", ScrollerComponent = core_52.CreateComponent('Scroller', {
                selector: 'ej-scroller',
                inputs: Inputs,
                outputs: Outputs,
                template: '<ng-content></ng-content>',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_51("EJ_SCROLLER_COMPONENTS", EJ_SCROLLER_COMPONENTS = [ScrollerComponent]);
        }
    }
});
System.register("ej/signature.component", ["ej/core"], function(exports_52, context_52) {
    "use strict";
    var __moduleName = context_52 && context_52.id;
    var core_53;
    var Outputs, ComplexProperties, Inputs, SignatureComponent, EJ_SIGNATURE_COMPONENTS;
    return {
        setters:[
            function (core_53_1) {
                core_53 = core_53_1;
            }],
        execute: function() {
            Outputs = ['change', 'mouseDown', 'mouseMove', 'mouseUp'
            ];
            ComplexProperties = [];
            Inputs = core_53.Utils.AngularizeInputs(['backgroundColor', 'backgroundImage', 'enabled', 'height', 'isResponsive',
                'saveImageFormat', 'saveWithBackground', 'showRoundedCorner', 'strokeColor', 'strokeWidth',
                'width'], []);
            exports_52("SignatureComponent", SignatureComponent = core_53.CreateComponent('Signature', {
                selector: 'ej-signature',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_52("EJ_SIGNATURE_COMPONENTS", EJ_SIGNATURE_COMPONENTS = [SignatureComponent]);
        }
    }
});
System.register("ej/slider.component", ["ej/core"], function(exports_53, context_53) {
    "use strict";
    var __moduleName = context_53 && context_53.id;
    var core_54;
    var Outputs, ComplexProperties, Inputs, SliderComponent, EJ_SLIDER_COMPONENTS;
    return {
        setters:[
            function (core_54_1) {
                core_54 = core_54_1;
            }],
        execute: function() {
            Outputs = ['change', 'create', 'destroy', 'slide', 'start',
                'stop', 'tooltipChange',
                'model.valueChange: valueChange'];
            ComplexProperties = [];
            Inputs = core_54.Utils.AngularizeInputs(['allowMouseWheel', 'animationSpeed', 'cssClass', 'enableAnimation', 'enabled',
                'enablePersistence', 'enableRTL', 'height', 'htmlAttributes', 'incrementStep',
                'largeStep', 'maxValue', 'minValue', 'orientation', 'readOnly',
                'showRoundedCorner', 'showScale', 'showSmallTicks', 'showTooltip', 'sliderType',
                'smallStep', 'values', 'width'], ['value']);
            exports_53("SliderComponent", SliderComponent = core_54.CreateComponent('Slider', {
                selector: 'ej-slider',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: ['value'],
                complexes: ComplexProperties,
            }));
            exports_53("EJ_SLIDER_COMPONENTS", EJ_SLIDER_COMPONENTS = [SliderComponent]);
        }
    }
});
System.register("ej/sparkline.component", ["ej/core"], function(exports_54, context_54) {
    "use strict";
    var __moduleName = context_54 && context_54.id;
    var core_55;
    var Outputs, ComplexProperties, Inputs, SparklineComponent, EJ_SPARKLINE_COMPONENTS;
    return {
        setters:[
            function (core_55_1) {
                core_55 = core_55_1;
            }],
        execute: function() {
            Outputs = ['load', 'loaded', 'tooltipInitialize', 'seriesRendering', 'pointRegionMouseMove',
                'pointRegionMouseClick', 'sparklineMouseMove', 'sparklineMouseLeave'
            ];
            ComplexProperties = ['border', 'rangeBandSettings', 'tooltip', 'markerSettings', 'size',
                'axisLineSettings', 'tooltip.border', 'tooltip.font', 'markerSettings.border'];
            Inputs = core_55.Utils.AngularizeInputs(['background', 'fill', 'stroke', 'border', 'width',
                'opacity', 'highPointColor', 'lowPointColor', 'startPointColor', 'endPointColor',
                'negativePointColor', 'rangeBandSettings', 'palette', 'isResponsive', 'enableCanvasRendering',
                'dataSource', 'xName', 'yName', 'padding', 'type',
                'theme', 'tooltip', 'markerSettings', 'size', 'axisLineSettings',
                'border.color', 'border.width', 'rangeBandSettings.startRange', 'rangeBandSettings.endRange', 'rangeBandSettings.opacity',
                'rangeBandSettings.color', 'tooltip.visible', 'tooltip.fill', 'tooltip.template', 'tooltip.border',
                'tooltip.border.color', 'tooltip.border.width', 'tooltip.font', 'tooltip.font.color', 'tooltip.font.fontFamily',
                'tooltip.font.fontStyle', 'tooltip.font.fontWeight', 'tooltip.font.opacity', 'tooltip.font.size', 'markerSettings.opacity',
                'markerSettings.visible', 'markerSettings.width', 'markerSettings.fill', 'markerSettings.border', 'markerSettings.border.color',
                'markerSettings.border.opacity', 'markerSettings.border.width', 'size.height', 'size.width', 'axisLineSettings.visible',
                'axisLineSettings.color', 'axisLineSettings.width', 'axisLineSettings.dashArray'], []);
            exports_54("SparklineComponent", SparklineComponent = core_55.CreateComponent('Sparkline', {
                selector: 'ej-sparkline',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_54("EJ_SPARKLINE_COMPONENTS", EJ_SPARKLINE_COMPONENTS = [SparklineComponent]);
        }
    }
});
System.register("ej/splitter.component", ["ej/core"], function(exports_55, context_55) {
    "use strict";
    var __moduleName = context_55 && context_55.id;
    var core_56;
    var Outputs, ComplexProperties, Inputs, SplitterComponent, EJ_SPLITTER_COMPONENTS;
    return {
        setters:[
            function (core_56_1) {
                core_56 = core_56_1;
            }],
        execute: function() {
            Outputs = ['beforeExpandCollapse', 'create', 'destroy', 'expandCollapse', 'resize'
            ];
            ComplexProperties = [];
            Inputs = core_56.Utils.AngularizeInputs(['allowKeyboardNavigation', 'animationSpeed', 'cssClass', 'enableAnimation', 'enableRTL',
                'height', 'htmlAttributes', 'isResponsive', 'orientation', 'properties',
                'width'], []);
            exports_55("SplitterComponent", SplitterComponent = core_56.CreateComponent('Splitter', {
                selector: 'ej-splitter',
                inputs: Inputs,
                outputs: Outputs,
                template: '<ng-content></ng-content>',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_55("EJ_SPLITTER_COMPONENTS", EJ_SPLITTER_COMPONENTS = [SplitterComponent]);
        }
    }
});
System.register("ej/spreadsheet.component", ["ej/core"], function(exports_56, context_56) {
    "use strict";
    var __moduleName = context_56 && context_56.id;
    var core_57;
    var RangeSettingDirective, RangeSettingsDirective, SheetDirective, SheetsDirective, Outputs, ComplexProperties, Inputs, SpreadsheetComponent, EJ_SPREADSHEET_COMPONENTS;
    return {
        setters:[
            function (core_57_1) {
                core_57 = core_57_1;
            }],
        execute: function() {
            exports_56("RangeSettingDirective", RangeSettingDirective = core_57.CreateComplexDirective({
                selector: 'e-rangesettings>e-rangesetting',
                inputs: ['dataSource', 'headerStyles', 'primaryKey', 'query', 'showHeader',
                    'startCell'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_57.forwardRef(function () { return SpreadsheetComponent; })
            }));
            exports_56("RangeSettingsDirective", RangeSettingsDirective = core_57.CreateArrayTagDirective('rangeSettings', 'e-sheets>e-rangesettings', RangeSettingDirective));
            exports_56("SheetDirective", SheetDirective = core_57.CreateComplexDirective({
                selector: 'e-sheets>e-sheet',
                inputs: ['border', 'cFormatRule', 'colCount', 'columnWidth', 'dataSource',
                    'fieldAsColumnHeader', 'headerStyles', 'hideColumns', 'hideRows', 'mergeCells',
                    'primaryKey', 'query', 'rangeSettings', 'rowCount', 'rows',
                    'showGridlines', 'showHeader', 'showHeadings', 'startCell'],
                queries: {
                    _rangeSettings: new core_57.ContentChild(RangeSettingsDirective),
                }
            }, {
                tags: ['rangeSettings'],
                complexes: [],
                type: core_57.forwardRef(function () { return SpreadsheetComponent; })
            }));
            exports_56("SheetsDirective", SheetsDirective = core_57.CreateArrayTagDirective('sheets', 'ej-spreadsheet>e-sheets', SheetDirective));
            Outputs = ['actionBegin', 'actionComplete', 'autoFillBegin', 'autoFillComplete', 'beforeBatchSave',
                'beforeCellFormat', 'beforeCellSelect', 'beforeDrop', 'beforeEditComment', 'beforeOpen',
                'beforePanelOpen', 'cellClick', 'cellEdit', 'cellFormatting', 'cellHover',
                'cellSave', 'cellSelected', 'contextMenuClick', 'drag', 'dragShape',
                'dragStart', 'drop', 'editRangeBegin', 'editRangeComplete', 'load',
                'loadComplete', 'menuClick', 'onImport', 'openFailure', 'pagerClick',
                'resizeStart', 'resizeEnd', 'ribbonClick', 'seriesRendering', 'tabClick',
                'tabSelect'
            ];
            ComplexProperties = ['autoFillSettings', 'chartSettings', 'exportSettings', 'formatSettings', 'importSettings',
                'pictureSettings', 'printSettings', 'ribbonSettings', 'scrollSettings', 'selectionSettings',
                'ribbonSettings.applicationTab', 'ribbonSettings.applicationTab.menuSettings'];
            Inputs = core_57.Utils.AngularizeInputs(['activeSheetIndex', 'allowAutoCellType', 'allowAutoFill', 'allowAutoSum', 'allowCellFormatting',
                'allowCellType', 'allowCharts', 'allowClear', 'allowClipboard', 'allowComments',
                'allowConditionalFormats', 'allowDataValidation', 'allowDelete', 'allowDragAndDrop', 'allowEditing',
                'allowFiltering', 'allowFormatAsTable', 'allowFormatPainter', 'allowFormulaBar', 'allowFreezing',
                'allowHyperlink', 'allowImport', 'allowInsert', 'allowKeyboardNavigation', 'allowLockCell',
                'allowMerging', 'allowOverflow', 'allowResizing', 'allowSearching', 'allowSelection',
                'allowSorting', 'allowUndoRedo', 'allowWrap', 'apWidth', 'autoFillSettings',
                'chartSettings', 'columnCount', 'columnWidth', 'cssClass', 'customFormulas',
                'enableContextMenu', 'enablePivotTable', 'enableTouch', 'exportSettings', 'formatSettings',
                'importSettings', 'isReadOnly', 'locale', 'pictureSettings', 'printSettings',
                'ribbonSettings', 'rowCount', 'rowHeight', 'scrollSettings', 'selectionSettings',
                'sheetCount', 'showPager', 'showRibbon', 'undoRedoStep', 'userName',
                'autoFillSettings.fillType', 'autoFillSettings.showFillOptions', 'chartSettings.height', 'chartSettings.width', 'exportSettings.allowExporting',
                'exportSettings.csvUrl', 'exportSettings.excelUrl', 'exportSettings.password', 'exportSettings.pdfUrl', 'formatSettings.allowCellBorder',
                'formatSettings.allowDecimalPlaces', 'formatSettings.allowFontFamily', 'importSettings.importMapper', 'importSettings.importOnLoad', 'importSettings.importUrl',
                'importSettings.password', 'pictureSettings.allowPictures', 'pictureSettings.height', 'pictureSettings.width', 'printSettings.allowPageSetup',
                'printSettings.allowPageSize', 'printSettings.allowPrinting', 'ribbonSettings.applicationTab', 'ribbonSettings.applicationTab.type', 'ribbonSettings.applicationTab.menuSettings',
                'scrollSettings.allowScrolling', 'scrollSettings.allowSheetOnDemand', 'scrollSettings.allowVirtualScrolling', 'scrollSettings.height', 'scrollSettings.isResponsive',
                'scrollSettings.scrollMode', 'scrollSettings.width', 'selectionSettings.activeCell', 'selectionSettings.animationTime', 'selectionSettings.enableAnimation',
                'selectionSettings.selectionType', 'selectionSettings.selectionUnit', 'sheets', 'sheets.rows.cells'], []);
            exports_56("SpreadsheetComponent", SpreadsheetComponent = core_57.CreateComponent('Spreadsheet', {
                selector: 'ej-spreadsheet',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _sheets: new core_57.ContentChild(SheetsDirective),
                }
            }, {
                tags: ['sheets'],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_56("EJ_SPREADSHEET_COMPONENTS", EJ_SPREADSHEET_COMPONENTS = [SpreadsheetComponent, RangeSettingsDirective, SheetsDirective, RangeSettingDirective, SheetDirective]);
        }
    }
});
System.register("ej/tab.component", ["ej/core"], function(exports_57, context_57) {
    "use strict";
    var __moduleName = context_57 && context_57.id;
    var core_58;
    var Outputs, ComplexProperties, Inputs, TabComponent, EJ_TAB_COMPONENTS;
    return {
        setters:[
            function (core_58_1) {
                core_58 = core_58_1;
            }],
        execute: function() {
            Outputs = ['itemActive', 'ajaxBeforeLoad', 'ajaxError', 'ajaxLoad', 'ajaxSuccess',
                'beforeActive', 'beforeItemRemove', 'create', 'destroy', 'itemAdd',
                'itemRemove',
                'model.selectedItemIndexChange: selectedItemIndexChange'];
            ComplexProperties = ['ajaxSettings'];
            Inputs = core_58.Utils.AngularizeInputs(['ajaxSettings', 'allowKeyboardNavigation', 'collapsible', 'cssClass', 'disabledItemIndex',
                'enableAnimation', 'enabled', 'enabledItemIndex', 'enablePersistence', 'enableRTL',
                'enableTabScroll', 'events', 'headerPosition', 'headerSize', 'height',
                'heightAdjustMode', 'hiddenItemIndex', 'htmlAttributes', 'idPrefix', 'showCloseButton',
                'showReloadIcon', 'showRoundedCorner', 'width', 'ajaxSettings.async', 'ajaxSettings.cache',
                'ajaxSettings.contentType', 'ajaxSettings.data', 'ajaxSettings.dataType', 'ajaxSettings.type'], ['selectedItemIndex']);
            exports_57("TabComponent", TabComponent = core_58.CreateComponent('Tab', {
                selector: 'ej-tab',
                inputs: Inputs,
                outputs: Outputs,
                template: '<ng-content></ng-content>',
                queries: {}
            }, {
                tags: [],
                twoways: ['selectedItemIndex'],
                complexes: ComplexProperties,
            }));
            exports_57("EJ_TAB_COMPONENTS", EJ_TAB_COMPONENTS = [TabComponent]);
        }
    }
});
System.register("ej/tagcloud.component", ["ej/core"], function(exports_58, context_58) {
    "use strict";
    var __moduleName = context_58 && context_58.id;
    var core_59;
    var Outputs, ComplexProperties, Inputs, TagCloudComponent, EJ_TAGCLOUD_COMPONENTS;
    return {
        setters:[
            function (core_59_1) {
                core_59 = core_59_1;
            }],
        execute: function() {
            Outputs = ['click', 'create', 'destroy', 'mouseout', 'mouseover'
            ];
            ComplexProperties = ['fields'];
            Inputs = core_59.Utils.AngularizeInputs(['cssClass', 'dataSource', 'enableRTL', 'fields', 'htmlAttributes',
                'format', 'maxFontSize', 'minFontSize', 'query', 'showTitle',
                'titleImage', 'titleText', 'fields.frequency', 'fields.htmlAttributes', 'fields.text',
                'fields.url'], []);
            exports_58("TagCloudComponent", TagCloudComponent = core_59.CreateComponent('TagCloud', {
                selector: 'ej-tagcloud',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_58("EJ_TAGCLOUD_COMPONENTS", EJ_TAGCLOUD_COMPONENTS = [TagCloudComponent]);
        }
    }
});
System.register("ej/tile.component", ["ej/core"], function(exports_59, context_59) {
    "use strict";
    var __moduleName = context_59 && context_59.id;
    var core_60;
    var Outputs, ComplexProperties, Inputs, TileComponent, EJ_TILE_COMPONENTS;
    return {
        setters:[
            function (core_60_1) {
                core_60 = core_60_1;
            }],
        execute: function() {
            Outputs = ['mouseDown', 'mouseUp',
                'model.badge.valueChange: badge.valueChange', 'model.badge.enabledChange: badge.enabledChange', 'model.badge.textChange: badge.textChange', 'model.badge.positionChange: badge.positionChange', 'model.caption.textChange: caption.textChange'];
            ComplexProperties = ['badge', 'caption', 'liveTile'];
            Inputs = core_60.Utils.AngularizeInputs(['badge', 'caption', 'cssClass', 'enablePersistence', 'height',
                'imageClass', 'imagePosition', 'imageTemplateId', 'imageUrl', 'locale',
                'liveTile', 'tileSize', 'width', 'showRoundedCorner', 'allowSelection',
                'backgroundColor', 'badge.maxValue', 'badge.minValue', 'caption.enabled', 'caption.alignment',
                'caption.position', 'caption.icon', 'liveTile.enabled', 'liveTile.imageClass', 'liveTile.imageTemplateId',
                'liveTile.imageUrl', 'liveTile.type', 'liveTile.updateInterval', 'liveTile.text'], ['badge.value', 'badge.enabled', 'badge.text', 'badge.position', 'caption.text']);
            exports_59("TileComponent", TileComponent = core_60.CreateComponent('Tile', {
                selector: 'ej-tile',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: ['badge.value', 'badge.enabled', 'badge.text', 'badge.position', 'caption.text'],
                complexes: ComplexProperties,
            }));
            exports_59("EJ_TILE_COMPONENTS", EJ_TILE_COMPONENTS = [TileComponent]);
        }
    }
});
System.register("ej/timepicker.component", ["ej/core"], function(exports_60, context_60) {
    "use strict";
    var __moduleName = context_60 && context_60.id;
    var core_61;
    var Outputs, ComplexProperties, Inputs, TimePickerComponent, TimePickerValueAccessor, EJ_TIMEPICKER_COMPONENTS;
    return {
        setters:[
            function (core_61_1) {
                core_61 = core_61_1;
            }],
        execute: function() {
            Outputs = ['beforeChange', 'beforeOpen', 'change', 'close', 'create',
                'destroy', 'focusIn', 'focusOut', 'open', 'select'
            ];
            ComplexProperties = [];
            Inputs = core_61.Utils.AngularizeInputs(['cssClass', 'disableTimeRanges', 'enableAnimation', 'enabled', 'enablePersistence',
                'enableRTL', 'enableStrictMode', 'height', 'hourInterval', 'htmlAttributes',
                'interval', 'locale', 'maxTime', 'minTime', 'minutesInterval',
                'popupHeight', 'popupWidth', 'readOnly', 'secondsInterval', 'showPopupButton',
                'showRoundedCorner', 'timeFormat', 'value', 'width'], []);
            exports_60("TimePickerComponent", TimePickerComponent = core_61.CreateComponent('TimePicker', {
                selector: '[ej-timepicker]',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_60("TimePickerValueAccessor", TimePickerValueAccessor = core_61.CreateControlValueAccessor('[ej-timepicker]', TimePickerComponent));
            exports_60("EJ_TIMEPICKER_COMPONENTS", EJ_TIMEPICKER_COMPONENTS = [TimePickerComponent, TimePickerValueAccessor]);
        }
    }
});
System.register("ej/togglebutton.component", ["ej/core"], function(exports_61, context_61) {
    "use strict";
    var __moduleName = context_61 && context_61.id;
    var core_62;
    var Outputs, ComplexProperties, Inputs, ToggleButtonComponent, EJ_TOGGLEBUTTON_COMPONENTS;
    return {
        setters:[
            function (core_62_1) {
                core_62 = core_62_1;
            }],
        execute: function() {
            Outputs = ['change', 'click', 'create', 'destroy'
            ];
            ComplexProperties = [];
            Inputs = core_62.Utils.AngularizeInputs(['activePrefixIcon', 'activeSuffixIcon', 'activeText', 'contentType', 'cssClass',
                'defaultPrefixIcon', 'defaultSuffixIcon', 'defaultText', 'enabled', 'enablePersistence',
                'enableRTL', 'height', 'htmlAttributes', 'imagePosition', 'preventToggle',
                'showRoundedCorner', 'size', 'toggleState', 'type', 'width'], []);
            exports_61("ToggleButtonComponent", ToggleButtonComponent = core_62.CreateComponent('ToggleButton', {
                selector: 'ej-togglebutton',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_61("EJ_TOGGLEBUTTON_COMPONENTS", EJ_TOGGLEBUTTON_COMPONENTS = [ToggleButtonComponent]);
        }
    }
});
System.register("ej/toolbar.component", ["ej/core"], function(exports_62, context_62) {
    "use strict";
    var __moduleName = context_62 && context_62.id;
    var core_63;
    var Outputs, ComplexProperties, Inputs, ToolbarComponent, EJ_TOOLBAR_COMPONENTS;
    return {
        setters:[
            function (core_63_1) {
                core_63 = core_63_1;
            }],
        execute: function() {
            Outputs = ['click', 'create', 'focusOut', 'destroy', 'itemHover',
                'itemLeave'
            ];
            ComplexProperties = [];
            Inputs = core_63.Utils.AngularizeInputs(['cssClass', 'dataSource', 'disabledItemIndices', 'enabled', 'enabledItemIndices',
                'enableRTL', 'enableSeparator', 'fields', 'height', 'htmlAttributes',
                'hide', 'isResponsive', 'orientation', 'query', 'showRoundedCorner',
                'width', 'fields.group', 'fields.htmlAttributes', 'fields.id', 'fields.imageAttributes',
                'fields.imageUrl', 'fields.spriteCssClass', 'fields.text', 'fields.tooltipText'], []);
            exports_62("ToolbarComponent", ToolbarComponent = core_63.CreateComponent('Toolbar', {
                selector: 'ej-toolbar',
                inputs: Inputs,
                outputs: Outputs,
                template: '<ng-content></ng-content>',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_62("EJ_TOOLBAR_COMPONENTS", EJ_TOOLBAR_COMPONENTS = [ToolbarComponent]);
        }
    }
});
System.register("ej/tooltip.component", ["ej/core"], function(exports_63, context_63) {
    "use strict";
    var __moduleName = context_63 && context_63.id;
    var core_64;
    var Outputs, ComplexProperties, Inputs, TooltipComponent, EJ_TOOLTIP_COMPONENTS;
    return {
        setters:[
            function (core_64_1) {
                core_64 = core_64_1;
            }],
        execute: function() {
            Outputs = ['beforeClose', 'beforeOpen', 'click', 'close', 'create',
                'destroy', 'hover', 'open', 'tracking'
            ];
            ComplexProperties = ['animation', 'position', 'position.target', 'position.stem'];
            Inputs = core_64.Utils.AngularizeInputs(['allowKeyboardNavigation', 'animation', 'associate', 'autoCloseTimeout', 'closeMode',
                'collision', 'containment', 'content', 'cssClass', 'enabled',
                'enableRTL', 'height', 'isBalloon', 'position', 'showRoundedCorner',
                'showShadow', 'target', 'title', 'trigger', 'width',
                'animation.effect', 'animation.speed', 'position.target', 'position.target.horizontal', 'position.target.vertical',
                'position.stem', 'position.stem.horizontal', 'position.stem.vertical'], []);
            exports_63("TooltipComponent", TooltipComponent = core_64.CreateComponent('Tooltip', {
                selector: 'ej-tooltip',
                inputs: Inputs,
                outputs: Outputs,
                template: '<ng-content></ng-content>',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_63("EJ_TOOLTIP_COMPONENTS", EJ_TOOLTIP_COMPONENTS = [TooltipComponent]);
        }
    }
});
System.register("ej/treegrid.component", ["ej/core"], function(exports_64, context_64) {
    "use strict";
    var __moduleName = context_64 && context_64.id;
    var core_65;
    var TreeGridTemplateDirective, ColumnDirective, ColumnsDirective, Outputs, ComplexProperties, Inputs, TreeGridComponent, EJ_TREEGRID_COMPONENTS;
    return {
        setters:[
            function (core_65_1) {
                core_65 = core_65_1;
            }],
        execute: function() {
            exports_64("TreeGridTemplateDirective", TreeGridTemplateDirective = core_65.CreateTemplateDirective({
                selector: "[e-template]"
            }, {
                type: core_65.forwardRef(function () { return ColumnDirective; })
            }));
            exports_64("ColumnDirective", ColumnDirective = core_65.CreateComplexDirective({
                selector: 'e-treegrid-columns>e-treegrid-column',
                inputs: ['allowFiltering', 'allowSorting', 'allowCellSelection', 'editType', 'field',
                    'filterEditType', 'headerText', 'showCheckbox', 'visible', 'headerTemplateID',
                    'format', 'isTemplateColumn', 'headerTextAlign', 'isFrozen', 'textAlign',
                    'templateID', 'allowEditing', 'allowFreezing'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_65.forwardRef(function () { return TreeGridComponent; })
            }));
            exports_64("ColumnsDirective", ColumnsDirective = core_65.CreateArrayTagDirective('columns', 'ej-treegrid>e-treegrid-columns', ColumnDirective));
            Outputs = ['actionBegin', 'actionComplete', 'beginEdit', 'collapsed', 'collapsing',
                'columnDragStart', 'columnDrag', 'columnDrop', 'columnResized', 'columnResizeStart',
                'columnResizeEnd', 'contextMenuOpen', 'create', 'endEdit', 'expanded',
                'expanding', 'load', 'queryCellInfo', 'rowDataBound', 'rowDrag',
                'rowDragStart', 'rowDragStop', 'cellSelecting', 'cellSelected', 'rowSelected',
                'rowSelecting', 'toolbarClick',
                'model.dataSourceChange: dataSourceChange', 'model.selectedRowIndexChange: selectedRowIndexChange'];
            ComplexProperties = ['contextMenuSettings', 'dragTooltip', 'editSettings', 'columnResizeSettings', 'filterSettings',
                'pageSettings', 'selectionSettings', 'sizeSettings', 'sortSettings', 'toolbarSettings'];
            Inputs = core_65.Utils.AngularizeInputs(['allowColumnResize', 'allowColumnReordering', 'allowDragAndDrop', 'allowFiltering', 'allowKeyboardNavigation',
                'allowMultiSorting', 'allowSelection', 'allowSorting', 'allowPaging', 'altRowTemplateID',
                'childMapping', 'columnDialogFields', 'contextMenuSettings', 'cssClass', 'headerTextOverflow',
                'dragTooltip', 'editSettings', 'enableAltRow', 'enableCollapseAll', 'enableResize',
                'enableVirtualization', 'columnResizeSettings', 'filterSettings', 'locale', 'idMapping',
                'isResponsive', 'parentIdMapping', 'pageSettings', 'cellTooltipTemplate', 'query',
                'rowHeight', 'rowTemplateID', 'selectionSettings', 'showColumnOptions', 'showColumnChooser',
                'showDetailsRow', 'showDetailsRowInfoColumn', 'detailsTemplate', 'detailsRowHeight', 'showSummaryRow',
                'showTotalSummary', 'summaryRows', 'showGridCellTooltip', 'showGridExpandCellTooltip', 'sizeSettings',
                'sortSettings', 'toolbarSettings', 'treeColumnIndex', 'contextMenuSettings.contextMenuItems', 'contextMenuSettings.showContextMenu',
                'dragTooltip.showTooltip', 'dragTooltip.tooltipItems', 'dragTooltip.tooltipTemplate', 'editSettings.allowAdding', 'editSettings.allowDeleting',
                'editSettings.allowEditing', 'editSettings.beginEditAction', 'editSettings.editMode', 'editSettings.rowPosition', 'columnResizeSettings.columnResizeMode',
                'filterSettings.filterBarMode', 'filterSettings.filterType', 'filterSettings.filteredColumns', 'pageSettings.pageCount', 'pageSettings.pageSize',
                'pageSettings.totalRecordsCount', 'pageSettings.currentPage', 'pageSettings.pageSizeMode', 'pageSettings.template', 'selectionSettings.selectionMode',
                'selectionSettings.selectionType', 'selectionSettings.enableHierarchySelection', 'selectionSettings.enableSelectAll', 'sizeSettings.height', 'sizeSettings.width',
                'sortSettings.sortedColumns', 'toolbarSettings.showToolbar', 'toolbarSettings.toolbarItems', 'columns'], ['dataSource', 'selectedRowIndex']);
            exports_64("TreeGridComponent", TreeGridComponent = core_65.CreateComponent('TreeGrid', {
                selector: 'ej-treegrid',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _columns: new core_65.ContentChild(ColumnsDirective),
                }
            }, {
                tags: ['columns'],
                twoways: ['dataSource', 'selectedRowIndex'],
                complexes: ComplexProperties,
            }));
            exports_64("EJ_TREEGRID_COMPONENTS", EJ_TREEGRID_COMPONENTS = [TreeGridComponent, ColumnsDirective, ColumnDirective, TreeGridTemplateDirective]);
        }
    }
});
System.register("ej/treemap.component", ["ej/core"], function(exports_65, context_65) {
    "use strict";
    var __moduleName = context_65 && context_65.id;
    var core_66;
    var LevelDirective, LevelsDirective, RangeColorDirective, RangeColorMappingDirective, Outputs, ComplexProperties, Inputs, TreeMapComponent, EJ_TREEMAP_COMPONENTS;
    return {
        setters:[
            function (core_66_1) {
                core_66 = core_66_1;
            }],
        execute: function() {
            exports_65("LevelDirective", LevelDirective = core_66.CreateComplexDirective({
                selector: 'e-levels>e-level',
                inputs: ['groupBackground', 'groupBorderColor', 'groupBorderThickness', 'groupGap', 'groupPadding',
                    'groupPath', 'headerHeight', 'headerTemplate', 'headerVisibilityMode', 'labelPosition',
                    'labelTemplate', 'labelVisibilityMode', 'showHeader', 'showLabels'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_66.forwardRef(function () { return TreeMapComponent; })
            }));
            exports_65("LevelsDirective", LevelsDirective = core_66.CreateArrayTagDirective('levels', 'ej-treemap>e-levels', LevelDirective));
            exports_65("RangeColorDirective", RangeColorDirective = core_66.CreateComplexDirective({
                selector: 'e-rangecolormapping>e-rangecolor',
                inputs: ['color', 'gradientColors', 'from', 'legendLabel', 'to'],
                queries: {}
            }, {
                tags: [],
                complexes: [],
                type: core_66.forwardRef(function () { return TreeMapComponent; })
            }));
            exports_65("RangeColorMappingDirective", RangeColorMappingDirective = core_66.CreateArrayTagDirective('rangeColorMapping', 'ej-treemap>e-rangecolormapping', RangeColorDirective));
            Outputs = ['treeMapItemSelected',
                'model.dataSourceChange: dataSourceChange', 'model.weightValuePathChange: weightValuePathChange'];
            ComplexProperties = ['uniColorMapping', 'desaturationColorMapping', 'paletteColorMapping', 'legendSettings', 'leafItemSettings'];
            Inputs = core_66.Utils.AngularizeInputs(['borderBrush', 'borderThickness', 'uniColorMapping', 'desaturationColorMapping', 'paletteColorMapping',
                'colorValuePath', 'dockPosition', 'drillDownHeaderColor', 'drillDownSelectionColor', 'enableDrillDown',
                'isResponsive', 'enableResize', 'draggingOnSelection', 'draggingGroupOnSelection', 'legendSettings',
                'highlightBorderBrush', 'highlightBorderThickness', 'highlightGroupBorderBrush', 'highlightGroupBorderThickness', 'highlightGroupOnSelection',
                'highlightOnSelection', 'itemsLayoutMode', 'leafItemSettings', 'selectionMode', 'groupSelectionMode',
                'showLegend', 'enableGradient', 'showTooltip', 'tooltipTemplate', 'treeMapItems',
                'uniColorMapping.color', 'desaturationColorMapping.to', 'desaturationColorMapping.color', 'desaturationColorMapping.from', 'desaturationColorMapping.rangeMaximum',
                'desaturationColorMapping.rangeMinimum', 'paletteColorMapping.colors', 'legendSettings.height', 'legendSettings.width', 'legendSettings.iconHeight',
                'legendSettings.iconWidth', 'legendSettings.template', 'legendSettings.mode', 'legendSettings.title', 'legendSettings.leftLabel',
                'legendSettings.rightLabel', 'legendSettings.dockPosition', 'legendSettings.alignment', 'legendSettings.columnCount', 'leafItemSettings.borderBrush',
                'leafItemSettings.borderThickness', 'leafItemSettings.itemTemplate', 'leafItemSettings.labelPath', 'leafItemSettings.labelPosition', 'leafItemSettings.labelVisibilityMode',
                'leafItemSettings.showLabels', 'groupColorMapping', 'rangeColorMapping', 'levels'], ['dataSource', 'weightValuePath']);
            exports_65("TreeMapComponent", TreeMapComponent = core_66.CreateComponent('TreeMap', {
                selector: 'ej-treemap',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {
                    _levels: new core_66.ContentChild(LevelsDirective),
                    _rangeColorMapping: new core_66.ContentChild(RangeColorMappingDirective),
                }
            }, {
                tags: ['levels', 'rangeColorMapping'],
                twoways: ['dataSource', 'weightValuePath'],
                complexes: ComplexProperties,
            }));
            exports_65("EJ_TREEMAP_COMPONENTS", EJ_TREEMAP_COMPONENTS = [TreeMapComponent, LevelsDirective, RangeColorMappingDirective, LevelDirective, RangeColorDirective]);
        }
    }
});
System.register("ej/treeview.component", ["ej/core"], function(exports_66, context_66) {
    "use strict";
    var __moduleName = context_66 && context_66.id;
    var core_67;
    var Outputs, ComplexProperties, Inputs, TreeViewComponent, EJ_TREEVIEW_COMPONENTS;
    return {
        setters:[
            function (core_67_1) {
                core_67 = core_67_1;
            }],
        execute: function() {
            Outputs = ['beforeAdd', 'beforeCollapse', 'beforeCut', 'beforeDelete', 'beforeEdit',
                'beforeExpand', 'beforeLoad', 'beforePaste', 'beforeSelect', 'create',
                'destroy', 'inlineEditValidation', 'keyPress', 'loadError', 'loadSuccess',
                'nodeAdd', 'nodeCheck', 'nodeClick', 'nodeCollapse', 'nodeCut',
                'nodeDelete', 'nodeDrag', 'nodeDragStart', 'nodeDragStop', 'nodeDropped',
                'nodeEdit', 'nodeExpand', 'nodePaste', 'nodeSelect', 'nodeUncheck',
                'nodeUnselect', 'ready'
            ];
            ComplexProperties = ['fields', 'sortSettings'];
            Inputs = core_67.Utils.AngularizeInputs(['allowDragAndDrop', 'allowDragAndDropAcrossControl', 'allowDropSibling', 'allowDropChild', 'allowEditing',
                'allowKeyboardNavigation', 'allowMultiSelection', 'autoCheck', 'autoCheckParentNode', 'checkedNodes',
                'cssClass', 'enableAnimation', 'enabled', 'enableMultipleExpand', 'enablePersistence',
                'enableRTL', 'expandedNodes', 'expandOn', 'fields', 'fullRowSelect',
                'height', 'htmlAttributes', 'loadOnDemand', 'selectedNode', 'selectedNodes',
                'showCheckbox', 'sortSettings', 'template', 'width', 'fields.child',
                'fields.dataSource', 'fields.expanded', 'fields.hasChild', 'fields.htmlAttribute', 'fields.id',
                'fields.imageAttribute', 'fields.imageUrl', 'fields.isChecked', 'fields.linkAttribute', 'fields.parentId',
                'fields.query', 'fields.selected', 'fields.spriteCssClass', 'fields.tableName', 'fields.text',
                'sortSettings.allowSorting', 'sortSettings.sortOrder'], []);
            exports_66("TreeViewComponent", TreeViewComponent = core_67.CreateComponent('TreeView', {
                selector: 'ej-treeview',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_66("EJ_TREEVIEW_COMPONENTS", EJ_TREEVIEW_COMPONENTS = [TreeViewComponent]);
        }
    }
});
System.register("ej/uploadbox.component", ["ej/core"], function(exports_67, context_67) {
    "use strict";
    var __moduleName = context_67 && context_67.id;
    var core_68;
    var Outputs, ComplexProperties, Inputs, UploadboxComponent, EJ_UPLOADBOX_COMPONENTS;
    return {
        setters:[
            function (core_68_1) {
                core_68 = core_68_1;
            }],
        execute: function() {
            Outputs = ['beforeSend', 'begin', 'cancel', 'complete', 'success',
                'create', 'destroy', 'error', 'fileSelect', 'inProgress',
                'remove'
            ];
            ComplexProperties = ['buttonText', 'customFileDetails', 'dialogAction', 'dialogText'];
            Inputs = core_68.Utils.AngularizeInputs(['allowDragAndDrop', 'asyncUpload', 'autoUpload', 'buttonText', 'cssClass',
                'customFileDetails', 'dialogAction', 'dialogPosition', 'dialogText', 'dropAreaText',
                'dropAreaHeight', 'dropAreaWidth', 'enabled', 'enableRTL', 'extensionsAllow',
                'extensionsDeny', 'fileSize', 'height', 'htmlAttributes', 'locale',
                'multipleFilesSelection', 'pushFile', 'removeUrl', 'saveUrl', 'showBrowseButton',
                'showFileDetails', 'showRoundedCorner', 'uploadName', 'width', 'buttonText.browse',
                'buttonText.cancel', 'buttonText.Close', 'buttonText.upload', 'customFileDetails.action', 'customFileDetails.name',
                'customFileDetails.size', 'customFileDetails.status', 'customFileDetails.title', 'dialogAction.closeOnComplete', 'dialogAction.content',
                'dialogAction.drag', 'dialogAction.modal', 'dialogText.name', 'dialogText.size', 'dialogText.status',
                'dialogText.title'], []);
            exports_67("UploadboxComponent", UploadboxComponent = core_68.CreateComponent('Uploadbox', {
                selector: 'ej-uploadbox',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_67("EJ_UPLOADBOX_COMPONENTS", EJ_UPLOADBOX_COMPONENTS = [UploadboxComponent]);
        }
    }
});
System.register("ej/waitingpopup.component", ["ej/core"], function(exports_68, context_68) {
    "use strict";
    var __moduleName = context_68 && context_68.id;
    var core_69;
    var Outputs, ComplexProperties, Inputs, WaitingPopupComponent, EJ_WAITINGPOPUP_COMPONENTS;
    return {
        setters:[
            function (core_69_1) {
                core_69 = core_69_1;
            }],
        execute: function() {
            Outputs = ['create', 'destroy'
            ];
            ComplexProperties = [];
            Inputs = core_69.Utils.AngularizeInputs(['cssClass', 'htmlAttributes', 'showImage', 'showOnInit', 'target',
                'appendTo', 'template', 'text'], []);
            exports_68("WaitingPopupComponent", WaitingPopupComponent = core_69.CreateComponent('WaitingPopup', {
                selector: 'ej-waitingpopup',
                inputs: Inputs,
                outputs: Outputs,
                template: '',
                queries: {}
            }, {
                tags: [],
                twoways: [],
                complexes: ComplexProperties,
            }));
            exports_68("EJ_WAITINGPOPUP_COMPONENTS", EJ_WAITINGPOPUP_COMPONENTS = [WaitingPopupComponent]);
        }
    }
});
System.register("ej/web.all", ["ej/grid.component", "ej/chart.component", "ej/diagram.component", "ej/overview.component", "ej/heatmap.component", "ej/heatmaplegend.component", "ej/rangenavigator.component", "ej/sparkline.component", "ej/bulletgraph.component", "ej/circulargauge.component", "ej/lineargauge.component", "ej/map.component", "ej/treemap.component", "ej/digitalgauge.component", "ej/spreadsheet.component", "ej/datepicker.component", "ej/gantt.component", "ej/treegrid.component", "ej/colorpicker.component", "ej/dialog.component", "ej/scroller.component", "ej/barcode.component", "ej/pdfviewer.component", "ej/numerictextbox.component", "ej/currencytextbox.component", "ej/percentagetextbox.component", "ej/timepicker.component", "ej/toolbar.component", "ej/menu.component", "ej/autocomplete.component", "ej/maskedit.component", "ej/treeview.component", "ej/schedule.component", "ej/kanban.component", "ej/ribbon.component", "ej/pivotgrid.component", "ej/pivotchart.component", "ej/pivotschemadesigner.component", "ej/pivottreemap.component", "ej/pivotgauge.component", "ej/rating.component", "ej/listbox.component", "ej/listview.component", "ej/rotator.component", "ej/rte.component", "ej/dropdownlist.component", "ej/radialmenu.component", "ej/signature.component", "ej/radialslider.component", "ej/tile.component", "ej/navigationdrawer.component", "ej/accordion.component", "ej/tab.component", "ej/checkbox.component", "ej/radiobutton.component", "ej/togglebutton.component", "ej/datetimepicker.component", "ej/progressbar.component", "ej/tagcloud.component", "ej/button.component", "ej/tooltip.component", "ej/slider.component", "ej/fileexplorer.component", "ej/reportviewer.component", "ej/splitter.component", "ej/uploadbox.component", "ej/waitingpopup.component"], function(exports_69, context_69) {
    "use strict";
    var __moduleName = context_69 && context_69.id;
    var GridAll, ChartAll, DiagramAll, OverviewAll, HeatmapAll, HeatmaplegendAll, RangenavigatorAll, SparklineAll, BulletgraphAll, CirculargaugeAll, LineargaugeAll, MapAll, TreemapAll, DigitalgaugeAll, SpreadsheetAll, DatepickerAll, GanttAll, TreegridAll, ColorpickerAll, DialogAll, ScrollerAll, BarcodeAll, PdfviewerAll, NumerictextboxAll, CurrencytextboxAll, PercentagetextboxAll, TimepickerAll, ToolbarAll, MenuAll, AutocompleteAll, MaskeditAll, TreeviewAll, ScheduleAll, KanbanAll, RibbonAll, PivotgridAll, PivotchartAll, PivotschemadesignerAll, PivottreemapAll, PivotgaugeAll, RatingAll, ListboxAll, ListviewAll, RotatorAll, RteAll, DropdownlistAll, RadialmenuAll, SignatureAll, RadialsliderAll, TileAll, NavigationdrawerAll, AccordionAll, TabAll, CheckboxAll, RadiobuttonAll, TogglebuttonAll, DatetimepickerAll, ProgressbarAll, TagcloudAll, ButtonAll, TooltipAll, SliderAll, FileexplorerAll, ReportviewerAll, SplitterAll, UploadboxAll, WaitingpopupAll;
    var Grid, EJ_GRID_COMPONENTS, Chart, EJ_CHART_COMPONENTS, Diagram, EJ_DIAGRAM_COMPONENTS, Overview, EJ_OVERVIEW_COMPONENTS, Heatmap, EJ_HEATMAP_COMPONENTS, Heatmaplegend, EJ_HEATMAPLEGEND_COMPONENTS, Rangenavigator, EJ_RANGENAVIGATOR_COMPONENTS, Sparkline, EJ_SPARKLINE_COMPONENTS, Bulletgraph, EJ_BULLETGRAPH_COMPONENTS, Circulargauge, EJ_CIRCULARGAUGE_COMPONENTS, Lineargauge, EJ_LINEARGAUGE_COMPONENTS, Map, EJ_MAP_COMPONENTS, Treemap, EJ_TREEMAP_COMPONENTS, Digitalgauge, EJ_DIGITALGAUGE_COMPONENTS, Spreadsheet, EJ_SPREADSHEET_COMPONENTS, Datepicker, EJ_DATEPICKER_COMPONENTS, Gantt, EJ_GANTT_COMPONENTS, Treegrid, EJ_TREEGRID_COMPONENTS, Colorpicker, EJ_COLORPICKER_COMPONENTS, Dialog, EJ_DIALOG_COMPONENTS, Scroller, EJ_SCROLLER_COMPONENTS, Barcode, EJ_BARCODE_COMPONENTS, Pdfviewer, EJ_PDFVIEWER_COMPONENTS, Numerictextbox, EJ_NUMERICTEXTBOX_COMPONENTS, Currencytextbox, EJ_CURRENCYTEXTBOX_COMPONENTS, Percentagetextbox, EJ_PERCENTAGETEXTBOX_COMPONENTS, Timepicker, EJ_TIMEPICKER_COMPONENTS, Toolbar, EJ_TOOLBAR_COMPONENTS, Menu, EJ_MENU_COMPONENTS, Autocomplete, EJ_AUTOCOMPLETE_COMPONENTS, Maskedit, EJ_MASKEDIT_COMPONENTS, Treeview, EJ_TREEVIEW_COMPONENTS, Schedule, EJ_SCHEDULE_COMPONENTS, Kanban, EJ_KANBAN_COMPONENTS, Ribbon, EJ_RIBBON_COMPONENTS, Pivotgrid, EJ_PIVOTGRID_COMPONENTS, Pivotchart, EJ_PIVOTCHART_COMPONENTS, Pivotschemadesigner, EJ_PIVOTSCHEMADESIGNER_COMPONENTS, Pivottreemap, EJ_PIVOTTREEMAP_COMPONENTS, Pivotgauge, EJ_PIVOTGAUGE_COMPONENTS, Rating, EJ_RATING_COMPONENTS, Listbox, EJ_LISTBOX_COMPONENTS, Listview, EJ_LISTVIEW_COMPONENTS, Rotator, EJ_ROTATOR_COMPONENTS, Rte, EJ_RTE_COMPONENTS, Dropdownlist, EJ_DROPDOWNLIST_COMPONENTS, Radialmenu, EJ_RADIALMENU_COMPONENTS, Signature, EJ_SIGNATURE_COMPONENTS, Radialslider, EJ_RADIALSLIDER_COMPONENTS, Tile, EJ_TILE_COMPONENTS, Navigationdrawer, EJ_NAVIGATIONDRAWER_COMPONENTS, Accordion, EJ_ACCORDION_COMPONENTS, Tab, EJ_TAB_COMPONENTS, Checkbox, EJ_CHECKBOX_COMPONENTS, Radiobutton, EJ_RADIOBUTTON_COMPONENTS, Togglebutton, EJ_TOGGLEBUTTON_COMPONENTS, Datetimepicker, EJ_DATETIMEPICKER_COMPONENTS, Progressbar, EJ_PROGRESSBAR_COMPONENTS, Tagcloud, EJ_TAGCLOUD_COMPONENTS, Button, EJ_BUTTON_COMPONENTS, Tooltip, EJ_TOOLTIP_COMPONENTS, Slider, EJ_SLIDER_COMPONENTS, Fileexplorer, EJ_FILEEXPLORER_COMPONENTS, Reportviewer, EJ_REPORTVIEWER_COMPONENTS, Splitter, EJ_SPLITTER_COMPONENTS, Uploadbox, EJ_UPLOADBOX_COMPONENTS, Waitingpopup, EJ_WAITINGPOPUP_COMPONENTS;
    return {
        setters:[
            function (GridAll_1) {
                GridAll = GridAll_1;
            },
            function (ChartAll_1) {
                ChartAll = ChartAll_1;
            },
            function (DiagramAll_1) {
                DiagramAll = DiagramAll_1;
            },
            function (OverviewAll_1) {
                OverviewAll = OverviewAll_1;
            },
            function (HeatmapAll_1) {
                HeatmapAll = HeatmapAll_1;
            },
            function (HeatmaplegendAll_1) {
                HeatmaplegendAll = HeatmaplegendAll_1;
            },
            function (RangenavigatorAll_1) {
                RangenavigatorAll = RangenavigatorAll_1;
            },
            function (SparklineAll_1) {
                SparklineAll = SparklineAll_1;
            },
            function (BulletgraphAll_1) {
                BulletgraphAll = BulletgraphAll_1;
            },
            function (CirculargaugeAll_1) {
                CirculargaugeAll = CirculargaugeAll_1;
            },
            function (LineargaugeAll_1) {
                LineargaugeAll = LineargaugeAll_1;
            },
            function (MapAll_1) {
                MapAll = MapAll_1;
            },
            function (TreemapAll_1) {
                TreemapAll = TreemapAll_1;
            },
            function (DigitalgaugeAll_1) {
                DigitalgaugeAll = DigitalgaugeAll_1;
            },
            function (SpreadsheetAll_1) {
                SpreadsheetAll = SpreadsheetAll_1;
            },
            function (DatepickerAll_1) {
                DatepickerAll = DatepickerAll_1;
            },
            function (GanttAll_1) {
                GanttAll = GanttAll_1;
            },
            function (TreegridAll_1) {
                TreegridAll = TreegridAll_1;
            },
            function (ColorpickerAll_1) {
                ColorpickerAll = ColorpickerAll_1;
            },
            function (DialogAll_1) {
                DialogAll = DialogAll_1;
            },
            function (ScrollerAll_1) {
                ScrollerAll = ScrollerAll_1;
            },
            function (BarcodeAll_1) {
                BarcodeAll = BarcodeAll_1;
            },
            function (PdfviewerAll_1) {
                PdfviewerAll = PdfviewerAll_1;
            },
            function (NumerictextboxAll_1) {
                NumerictextboxAll = NumerictextboxAll_1;
            },
            function (CurrencytextboxAll_1) {
                CurrencytextboxAll = CurrencytextboxAll_1;
            },
            function (PercentagetextboxAll_1) {
                PercentagetextboxAll = PercentagetextboxAll_1;
            },
            function (TimepickerAll_1) {
                TimepickerAll = TimepickerAll_1;
            },
            function (ToolbarAll_1) {
                ToolbarAll = ToolbarAll_1;
            },
            function (MenuAll_1) {
                MenuAll = MenuAll_1;
            },
            function (AutocompleteAll_1) {
                AutocompleteAll = AutocompleteAll_1;
            },
            function (MaskeditAll_1) {
                MaskeditAll = MaskeditAll_1;
            },
            function (TreeviewAll_1) {
                TreeviewAll = TreeviewAll_1;
            },
            function (ScheduleAll_1) {
                ScheduleAll = ScheduleAll_1;
            },
            function (KanbanAll_1) {
                KanbanAll = KanbanAll_1;
            },
            function (RibbonAll_1) {
                RibbonAll = RibbonAll_1;
            },
            function (PivotgridAll_1) {
                PivotgridAll = PivotgridAll_1;
            },
            function (PivotchartAll_1) {
                PivotchartAll = PivotchartAll_1;
            },
            function (PivotschemadesignerAll_1) {
                PivotschemadesignerAll = PivotschemadesignerAll_1;
            },
            function (PivottreemapAll_1) {
                PivottreemapAll = PivottreemapAll_1;
            },
            function (PivotgaugeAll_1) {
                PivotgaugeAll = PivotgaugeAll_1;
            },
            function (RatingAll_1) {
                RatingAll = RatingAll_1;
            },
            function (ListboxAll_1) {
                ListboxAll = ListboxAll_1;
            },
            function (ListviewAll_1) {
                ListviewAll = ListviewAll_1;
            },
            function (RotatorAll_1) {
                RotatorAll = RotatorAll_1;
            },
            function (RteAll_1) {
                RteAll = RteAll_1;
            },
            function (DropdownlistAll_1) {
                DropdownlistAll = DropdownlistAll_1;
            },
            function (RadialmenuAll_1) {
                RadialmenuAll = RadialmenuAll_1;
            },
            function (SignatureAll_1) {
                SignatureAll = SignatureAll_1;
            },
            function (RadialsliderAll_1) {
                RadialsliderAll = RadialsliderAll_1;
            },
            function (TileAll_1) {
                TileAll = TileAll_1;
            },
            function (NavigationdrawerAll_1) {
                NavigationdrawerAll = NavigationdrawerAll_1;
            },
            function (AccordionAll_1) {
                AccordionAll = AccordionAll_1;
            },
            function (TabAll_1) {
                TabAll = TabAll_1;
            },
            function (CheckboxAll_1) {
                CheckboxAll = CheckboxAll_1;
            },
            function (RadiobuttonAll_1) {
                RadiobuttonAll = RadiobuttonAll_1;
            },
            function (TogglebuttonAll_1) {
                TogglebuttonAll = TogglebuttonAll_1;
            },
            function (DatetimepickerAll_1) {
                DatetimepickerAll = DatetimepickerAll_1;
            },
            function (ProgressbarAll_1) {
                ProgressbarAll = ProgressbarAll_1;
            },
            function (TagcloudAll_1) {
                TagcloudAll = TagcloudAll_1;
            },
            function (ButtonAll_1) {
                ButtonAll = ButtonAll_1;
            },
            function (TooltipAll_1) {
                TooltipAll = TooltipAll_1;
            },
            function (SliderAll_1) {
                SliderAll = SliderAll_1;
            },
            function (FileexplorerAll_1) {
                FileexplorerAll = FileexplorerAll_1;
            },
            function (ReportviewerAll_1) {
                ReportviewerAll = ReportviewerAll_1;
            },
            function (SplitterAll_1) {
                SplitterAll = SplitterAll_1;
            },
            function (UploadboxAll_1) {
                UploadboxAll = UploadboxAll_1;
            },
            function (WaitingpopupAll_1) {
                WaitingpopupAll = WaitingpopupAll_1;
            }],
        execute: function() {
            exports_69("Grid", Grid = GridAll);
            exports_69("EJ_GRID_COMPONENTS", EJ_GRID_COMPONENTS = GridAll.EJ_GRID_COMPONENTS);
            exports_69("Chart", Chart = ChartAll);
            exports_69("EJ_CHART_COMPONENTS", EJ_CHART_COMPONENTS = ChartAll.EJ_CHART_COMPONENTS);
            exports_69("Diagram", Diagram = DiagramAll);
            exports_69("EJ_DIAGRAM_COMPONENTS", EJ_DIAGRAM_COMPONENTS = DiagramAll.EJ_DIAGRAM_COMPONENTS);
            exports_69("Overview", Overview = OverviewAll);
            exports_69("EJ_OVERVIEW_COMPONENTS", EJ_OVERVIEW_COMPONENTS = OverviewAll.EJ_OVERVIEW_COMPONENTS);
            exports_69("Heatmap", Heatmap = HeatmapAll);
            exports_69("EJ_HEATMAP_COMPONENTS", EJ_HEATMAP_COMPONENTS = HeatmapAll.EJ_HEATMAP_COMPONENTS);
            exports_69("Heatmaplegend", Heatmaplegend = HeatmaplegendAll);
            exports_69("EJ_HEATMAPLEGEND_COMPONENTS", EJ_HEATMAPLEGEND_COMPONENTS = HeatmaplegendAll.EJ_HEATMAPLEGEND_COMPONENTS);
            exports_69("Rangenavigator", Rangenavigator = RangenavigatorAll);
            exports_69("EJ_RANGENAVIGATOR_COMPONENTS", EJ_RANGENAVIGATOR_COMPONENTS = RangenavigatorAll.EJ_RANGENAVIGATOR_COMPONENTS);
            exports_69("Sparkline", Sparkline = SparklineAll);
            exports_69("EJ_SPARKLINE_COMPONENTS", EJ_SPARKLINE_COMPONENTS = SparklineAll.EJ_SPARKLINE_COMPONENTS);
            exports_69("Bulletgraph", Bulletgraph = BulletgraphAll);
            exports_69("EJ_BULLETGRAPH_COMPONENTS", EJ_BULLETGRAPH_COMPONENTS = BulletgraphAll.EJ_BULLETGRAPH_COMPONENTS);
            exports_69("Circulargauge", Circulargauge = CirculargaugeAll);
            exports_69("EJ_CIRCULARGAUGE_COMPONENTS", EJ_CIRCULARGAUGE_COMPONENTS = CirculargaugeAll.EJ_CIRCULARGAUGE_COMPONENTS);
            exports_69("Lineargauge", Lineargauge = LineargaugeAll);
            exports_69("EJ_LINEARGAUGE_COMPONENTS", EJ_LINEARGAUGE_COMPONENTS = LineargaugeAll.EJ_LINEARGAUGE_COMPONENTS);
            exports_69("Map", Map = MapAll);
            exports_69("EJ_MAP_COMPONENTS", EJ_MAP_COMPONENTS = MapAll.EJ_MAP_COMPONENTS);
            exports_69("Treemap", Treemap = TreemapAll);
            exports_69("EJ_TREEMAP_COMPONENTS", EJ_TREEMAP_COMPONENTS = TreemapAll.EJ_TREEMAP_COMPONENTS);
            exports_69("Digitalgauge", Digitalgauge = DigitalgaugeAll);
            exports_69("EJ_DIGITALGAUGE_COMPONENTS", EJ_DIGITALGAUGE_COMPONENTS = DigitalgaugeAll.EJ_DIGITALGAUGE_COMPONENTS);
            exports_69("Spreadsheet", Spreadsheet = SpreadsheetAll);
            exports_69("EJ_SPREADSHEET_COMPONENTS", EJ_SPREADSHEET_COMPONENTS = SpreadsheetAll.EJ_SPREADSHEET_COMPONENTS);
            exports_69("Datepicker", Datepicker = DatepickerAll);
            exports_69("EJ_DATEPICKER_COMPONENTS", EJ_DATEPICKER_COMPONENTS = DatepickerAll.EJ_DATEPICKER_COMPONENTS);
            exports_69("Gantt", Gantt = GanttAll);
            exports_69("EJ_GANTT_COMPONENTS", EJ_GANTT_COMPONENTS = GanttAll.EJ_GANTT_COMPONENTS);
            exports_69("Treegrid", Treegrid = TreegridAll);
            exports_69("EJ_TREEGRID_COMPONENTS", EJ_TREEGRID_COMPONENTS = TreegridAll.EJ_TREEGRID_COMPONENTS);
            exports_69("Colorpicker", Colorpicker = ColorpickerAll);
            exports_69("EJ_COLORPICKER_COMPONENTS", EJ_COLORPICKER_COMPONENTS = ColorpickerAll.EJ_COLORPICKER_COMPONENTS);
            exports_69("Dialog", Dialog = DialogAll);
            exports_69("EJ_DIALOG_COMPONENTS", EJ_DIALOG_COMPONENTS = DialogAll.EJ_DIALOG_COMPONENTS);
            exports_69("Scroller", Scroller = ScrollerAll);
            exports_69("EJ_SCROLLER_COMPONENTS", EJ_SCROLLER_COMPONENTS = ScrollerAll.EJ_SCROLLER_COMPONENTS);
            exports_69("Barcode", Barcode = BarcodeAll);
            exports_69("EJ_BARCODE_COMPONENTS", EJ_BARCODE_COMPONENTS = BarcodeAll.EJ_BARCODE_COMPONENTS);
            exports_69("Pdfviewer", Pdfviewer = PdfviewerAll);
            exports_69("EJ_PDFVIEWER_COMPONENTS", EJ_PDFVIEWER_COMPONENTS = PdfviewerAll.EJ_PDFVIEWER_COMPONENTS);
            exports_69("Numerictextbox", Numerictextbox = NumerictextboxAll);
            exports_69("EJ_NUMERICTEXTBOX_COMPONENTS", EJ_NUMERICTEXTBOX_COMPONENTS = NumerictextboxAll.EJ_NUMERICTEXTBOX_COMPONENTS);
            exports_69("Currencytextbox", Currencytextbox = CurrencytextboxAll);
            exports_69("EJ_CURRENCYTEXTBOX_COMPONENTS", EJ_CURRENCYTEXTBOX_COMPONENTS = CurrencytextboxAll.EJ_CURRENCYTEXTBOX_COMPONENTS);
            exports_69("Percentagetextbox", Percentagetextbox = PercentagetextboxAll);
            exports_69("EJ_PERCENTAGETEXTBOX_COMPONENTS", EJ_PERCENTAGETEXTBOX_COMPONENTS = PercentagetextboxAll.EJ_PERCENTAGETEXTBOX_COMPONENTS);
            exports_69("Timepicker", Timepicker = TimepickerAll);
            exports_69("EJ_TIMEPICKER_COMPONENTS", EJ_TIMEPICKER_COMPONENTS = TimepickerAll.EJ_TIMEPICKER_COMPONENTS);
            exports_69("Toolbar", Toolbar = ToolbarAll);
            exports_69("EJ_TOOLBAR_COMPONENTS", EJ_TOOLBAR_COMPONENTS = ToolbarAll.EJ_TOOLBAR_COMPONENTS);
            exports_69("Menu", Menu = MenuAll);
            exports_69("EJ_MENU_COMPONENTS", EJ_MENU_COMPONENTS = MenuAll.EJ_MENU_COMPONENTS);
            exports_69("Autocomplete", Autocomplete = AutocompleteAll);
            exports_69("EJ_AUTOCOMPLETE_COMPONENTS", EJ_AUTOCOMPLETE_COMPONENTS = AutocompleteAll.EJ_AUTOCOMPLETE_COMPONENTS);
            exports_69("Maskedit", Maskedit = MaskeditAll);
            exports_69("EJ_MASKEDIT_COMPONENTS", EJ_MASKEDIT_COMPONENTS = MaskeditAll.EJ_MASKEDIT_COMPONENTS);
            exports_69("Treeview", Treeview = TreeviewAll);
            exports_69("EJ_TREEVIEW_COMPONENTS", EJ_TREEVIEW_COMPONENTS = TreeviewAll.EJ_TREEVIEW_COMPONENTS);
            exports_69("Schedule", Schedule = ScheduleAll);
            exports_69("EJ_SCHEDULE_COMPONENTS", EJ_SCHEDULE_COMPONENTS = ScheduleAll.EJ_SCHEDULE_COMPONENTS);
            exports_69("Kanban", Kanban = KanbanAll);
            exports_69("EJ_KANBAN_COMPONENTS", EJ_KANBAN_COMPONENTS = KanbanAll.EJ_KANBAN_COMPONENTS);
            exports_69("Ribbon", Ribbon = RibbonAll);
            exports_69("EJ_RIBBON_COMPONENTS", EJ_RIBBON_COMPONENTS = RibbonAll.EJ_RIBBON_COMPONENTS);
            exports_69("Pivotgrid", Pivotgrid = PivotgridAll);
            exports_69("EJ_PIVOTGRID_COMPONENTS", EJ_PIVOTGRID_COMPONENTS = PivotgridAll.EJ_PIVOTGRID_COMPONENTS);
            exports_69("Pivotchart", Pivotchart = PivotchartAll);
            exports_69("EJ_PIVOTCHART_COMPONENTS", EJ_PIVOTCHART_COMPONENTS = PivotchartAll.EJ_PIVOTCHART_COMPONENTS);
            exports_69("Pivotschemadesigner", Pivotschemadesigner = PivotschemadesignerAll);
            exports_69("EJ_PIVOTSCHEMADESIGNER_COMPONENTS", EJ_PIVOTSCHEMADESIGNER_COMPONENTS = PivotschemadesignerAll.EJ_PIVOTSCHEMADESIGNER_COMPONENTS);
            exports_69("Pivottreemap", Pivottreemap = PivottreemapAll);
            exports_69("EJ_PIVOTTREEMAP_COMPONENTS", EJ_PIVOTTREEMAP_COMPONENTS = PivottreemapAll.EJ_PIVOTTREEMAP_COMPONENTS);
            exports_69("Pivotgauge", Pivotgauge = PivotgaugeAll);
            exports_69("EJ_PIVOTGAUGE_COMPONENTS", EJ_PIVOTGAUGE_COMPONENTS = PivotgaugeAll.EJ_PIVOTGAUGE_COMPONENTS);
            exports_69("Rating", Rating = RatingAll);
            exports_69("EJ_RATING_COMPONENTS", EJ_RATING_COMPONENTS = RatingAll.EJ_RATING_COMPONENTS);
            exports_69("Listbox", Listbox = ListboxAll);
            exports_69("EJ_LISTBOX_COMPONENTS", EJ_LISTBOX_COMPONENTS = ListboxAll.EJ_LISTBOX_COMPONENTS);
            exports_69("Listview", Listview = ListviewAll);
            exports_69("EJ_LISTVIEW_COMPONENTS", EJ_LISTVIEW_COMPONENTS = ListviewAll.EJ_LISTVIEW_COMPONENTS);
            exports_69("Rotator", Rotator = RotatorAll);
            exports_69("EJ_ROTATOR_COMPONENTS", EJ_ROTATOR_COMPONENTS = RotatorAll.EJ_ROTATOR_COMPONENTS);
            exports_69("Rte", Rte = RteAll);
            exports_69("EJ_RTE_COMPONENTS", EJ_RTE_COMPONENTS = RteAll.EJ_RTE_COMPONENTS);
            exports_69("Dropdownlist", Dropdownlist = DropdownlistAll);
            exports_69("EJ_DROPDOWNLIST_COMPONENTS", EJ_DROPDOWNLIST_COMPONENTS = DropdownlistAll.EJ_DROPDOWNLIST_COMPONENTS);
            exports_69("Radialmenu", Radialmenu = RadialmenuAll);
            exports_69("EJ_RADIALMENU_COMPONENTS", EJ_RADIALMENU_COMPONENTS = RadialmenuAll.EJ_RADIALMENU_COMPONENTS);
            exports_69("Signature", Signature = SignatureAll);
            exports_69("EJ_SIGNATURE_COMPONENTS", EJ_SIGNATURE_COMPONENTS = SignatureAll.EJ_SIGNATURE_COMPONENTS);
            exports_69("Radialslider", Radialslider = RadialsliderAll);
            exports_69("EJ_RADIALSLIDER_COMPONENTS", EJ_RADIALSLIDER_COMPONENTS = RadialsliderAll.EJ_RADIALSLIDER_COMPONENTS);
            exports_69("Tile", Tile = TileAll);
            exports_69("EJ_TILE_COMPONENTS", EJ_TILE_COMPONENTS = TileAll.EJ_TILE_COMPONENTS);
            exports_69("Navigationdrawer", Navigationdrawer = NavigationdrawerAll);
            exports_69("EJ_NAVIGATIONDRAWER_COMPONENTS", EJ_NAVIGATIONDRAWER_COMPONENTS = NavigationdrawerAll.EJ_NAVIGATIONDRAWER_COMPONENTS);
            exports_69("Accordion", Accordion = AccordionAll);
            exports_69("EJ_ACCORDION_COMPONENTS", EJ_ACCORDION_COMPONENTS = AccordionAll.EJ_ACCORDION_COMPONENTS);
            exports_69("Tab", Tab = TabAll);
            exports_69("EJ_TAB_COMPONENTS", EJ_TAB_COMPONENTS = TabAll.EJ_TAB_COMPONENTS);
            exports_69("Checkbox", Checkbox = CheckboxAll);
            exports_69("EJ_CHECKBOX_COMPONENTS", EJ_CHECKBOX_COMPONENTS = CheckboxAll.EJ_CHECKBOX_COMPONENTS);
            exports_69("Radiobutton", Radiobutton = RadiobuttonAll);
            exports_69("EJ_RADIOBUTTON_COMPONENTS", EJ_RADIOBUTTON_COMPONENTS = RadiobuttonAll.EJ_RADIOBUTTON_COMPONENTS);
            exports_69("Togglebutton", Togglebutton = TogglebuttonAll);
            exports_69("EJ_TOGGLEBUTTON_COMPONENTS", EJ_TOGGLEBUTTON_COMPONENTS = TogglebuttonAll.EJ_TOGGLEBUTTON_COMPONENTS);
            exports_69("Datetimepicker", Datetimepicker = DatetimepickerAll);
            exports_69("EJ_DATETIMEPICKER_COMPONENTS", EJ_DATETIMEPICKER_COMPONENTS = DatetimepickerAll.EJ_DATETIMEPICKER_COMPONENTS);
            exports_69("Progressbar", Progressbar = ProgressbarAll);
            exports_69("EJ_PROGRESSBAR_COMPONENTS", EJ_PROGRESSBAR_COMPONENTS = ProgressbarAll.EJ_PROGRESSBAR_COMPONENTS);
            exports_69("Tagcloud", Tagcloud = TagcloudAll);
            exports_69("EJ_TAGCLOUD_COMPONENTS", EJ_TAGCLOUD_COMPONENTS = TagcloudAll.EJ_TAGCLOUD_COMPONENTS);
            exports_69("Button", Button = ButtonAll);
            exports_69("EJ_BUTTON_COMPONENTS", EJ_BUTTON_COMPONENTS = ButtonAll.EJ_BUTTON_COMPONENTS);
            exports_69("Tooltip", Tooltip = TooltipAll);
            exports_69("EJ_TOOLTIP_COMPONENTS", EJ_TOOLTIP_COMPONENTS = TooltipAll.EJ_TOOLTIP_COMPONENTS);
            exports_69("Slider", Slider = SliderAll);
            exports_69("EJ_SLIDER_COMPONENTS", EJ_SLIDER_COMPONENTS = SliderAll.EJ_SLIDER_COMPONENTS);
            exports_69("Fileexplorer", Fileexplorer = FileexplorerAll);
            exports_69("EJ_FILEEXPLORER_COMPONENTS", EJ_FILEEXPLORER_COMPONENTS = FileexplorerAll.EJ_FILEEXPLORER_COMPONENTS);
            exports_69("Reportviewer", Reportviewer = ReportviewerAll);
            exports_69("EJ_REPORTVIEWER_COMPONENTS", EJ_REPORTVIEWER_COMPONENTS = ReportviewerAll.EJ_REPORTVIEWER_COMPONENTS);
            exports_69("Splitter", Splitter = SplitterAll);
            exports_69("EJ_SPLITTER_COMPONENTS", EJ_SPLITTER_COMPONENTS = SplitterAll.EJ_SPLITTER_COMPONENTS);
            exports_69("Uploadbox", Uploadbox = UploadboxAll);
            exports_69("EJ_UPLOADBOX_COMPONENTS", EJ_UPLOADBOX_COMPONENTS = UploadboxAll.EJ_UPLOADBOX_COMPONENTS);
            exports_69("Waitingpopup", Waitingpopup = WaitingpopupAll);
            exports_69("EJ_WAITINGPOPUP_COMPONENTS", EJ_WAITINGPOPUP_COMPONENTS = WaitingpopupAll.EJ_WAITINGPOPUP_COMPONENTS);
        }
    }
});
