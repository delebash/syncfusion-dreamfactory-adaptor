export class DreamFactoryAdapter {

    static syncfusionDreamFactoryAdapter = new ej.ODataAdaptor().extend({
        options: {
            accept: "application/json; charset=utf-8",
            from: "table",
            requestType: "json",
            sortBy: "order",
            select: "fields",
            skip: "skip",
            group: "group",
            take: "limit",
            search: "search",
            count: "count",
            where: "filter",
            aggregates: "aggregates"
        },
        dreamFactoryodBiOperator: {
            "<": " < ",
            ">": " > ",
            "<=": " <= ",
            ">=": " >= ",
            "==": " = ",
            "=": " = ",
            "!=": " != ",
            "lessthan": " < ",
            "lessthanorequal": " <= ",
            "greaterthan": " > ",
            "greaterthanorequal": " >= ",
            "equal": " = ",
            "notequal": " != ",
            "like": " LIKE ",
            "notnull": " IS NOT NULL ",
            "isnull": " IS NULL",
            "IS NOT NULL": " IS NOT NULL ",
            "IS NULL": " IS NULL ",
            "contains": " CONTAINS ",
            "endswith": " ENDS WITH ",
            "startswith": " STARTS WITH "
        },
        dreamFactoryUniOperator: {
            "in": " IN ",
            "notin": " NOT IN ",
            "IS NOT IN": " IS NOT IN ",
            "IS IN": " IS IN "
        },
        // convertToQueryString: function (req, query, dm) {
        //   if (dm.dataSource.url && dm.dataSource.url.indexOf("?") !== -1)
        //     return $.param(req);
        //   return "?" + $.param(req);
        // },
        convertToQueryString: function (req, query, dm) {
            var res = [], tableName = req.table || "";
            delete req.table;

            if (dm.dataSource.requiresFormat)
                req["$format"] = "json";

            for (var prop in req)
                res.push(prop + "=" + req[prop]);

            res = res.join("&");

            if (dm.dataSource.url && dm.dataSource.url.indexOf("?") !== -1 && !tableName)
                return res;

            return res.length ? tableName + "?" + res : tableName || "";
        },
        onPredicate: function (pred, query, requiresCast) {
            //   query._fromTable ="contact"
            let returnValue = "",
                operator, guid,
                val = pred.value,
                type = typeof val,
                field = this._p(pred.field);
            //field = field.replace(/^(|\)$/g, '');
            if (val instanceof Date) {
                val = "datetime'" + p.replacer(val).toJSON() + "'";
            }

            operator = this.dreamFactoryodBiOperator[pred.operator];
            if (operator) {
                returnValue += field;
                returnValue += operator;
                if (guid)
                    returnValue += guid;
                return returnValue + val;
            }

            operator = this.dreamFactoryUniOperator[pred.operator];

            if (!operator || type !== "string") return "";

            returnValue += field;
            returnValue += operator + "(";

            if (guid) returnValue += guid;
            returnValue += val + ")";

            return returnValue
        },
        processResponse: function (data, ds, query, xhr, request, changes) {

            let count = null, aggregateResult = {};

            if (query && query._requiresCount) {
                if (data.meta) count = data.meta.count;
            }

            data = data.resource;
            return count === undefined || count === null ? data : {result: data, count: count};

        },
        insert: function (dm, data, tableName) {
            let records = [];
            records.push(data);
            let expectedData = {resource: records};
            return {
                action: "insert",
                url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : ''),
                data: JSON.stringify(expectedData)
            }
        },
        remove: function (dm, keyField, value, tableName) {
            return {
                action: "remove",
                type: "DELETE",
                url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : '') + '/' + value
            };
        },
        update: function (dm, keyField, value, tableName) {
            return {
                action: "update",
                type: "PUT",
                url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : '') + '/' + value[keyField],
                data: JSON.stringify(value),
                accept: this.options.accept
            };
        },
        onCount: function (e) {
            return e === true ? true : "";
        },
        beforeSend: function (dm, request, settings) {

            let table = "", count = "", data = ej.parseJSON(settings.data);

            if (data.table)
                table = data.table;

            //Which action CRUD?
            if (settings.action) {
                settings.url = settings.url + table;
            } else {
                //read request
                if (data.count === true) {
                    delete data.count;
                    count = 'include_count=true';
                }
                settings.url = settings.url + table + '?method=GET&' + count + '';
            }

            //settings.requestType = this.options.requestType
            settings.data = JSON.stringify(data)
        }

    });

    constructor() {
        this.syncfusiondmSymbols = {};
        this.syncfusiondmSymbols.operatorSymbols = {
            "=": "equal",
            "is not null": "notnull",
            "is null": "isnull",
            "is not in": "notin",
            "is in": "in"
        };

        ej.data.fnOperators.in = function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return (actual) && "IN" && (expected);

            return actual > expected;
        };

        ej.data.fnOperators.like = function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return (actual) && "LIKE" && (expected);

            return actual > expected;
        };
        ej.data.fnOperators.notin = function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return (actual) && "NOT IN " && (expected);

            return actual > expected;
        };

        $.extend(ej.data.operatorSymbols, this.syncfusiondmSymbols.operatorSymbols);

    }

    static isNull(val) {
        return val === undefined || val === null;
    }

}
