export class DreamFactoryAdapter {

  syncfusionDreamFactoryAdapter(adapterOptions) {
    let adapter = new ej.ODataAdaptor().extend({

      init: function () {
        let adapterOptions = this.dataSource;

        if (adapterOptions) {
          if (adapterOptions.requestType) {
            this.options.requestType = adapterOptions.requestType
          }
        }
      },
      options: {
        requestType: "get",
        accept: "application/json; charset=utf-8",
        from: "table",
        sortBy: "order",
        select: "fields",
        skip: "skip",
        group: "group",
        take: "limit",
        search: "search",
        count: "include_count",
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

      convertToQueryString: function (req, query, dm) {
        let res, tableName = req.table || "";

        if (tableName != "") {
          tableName = tableName + "/";
        }

        delete req.table;

        res = $.param(req);

        if (dm.dataSource.url && dm.dataSource.url.indexOf("?") !== -1 && !tableName)
          return $.param(req);

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
      insert: function (dm, data, tableName, query) {
        tableName = tableName || query._fromTable
        let records = [];
        records.push(data);
        let expectedData = {resource: records};
        return {
          action: "insert",
          url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : ''),
          data: JSON.stringify(expectedData)
        }
      },
      remove: function (dm, keyField, value, tableName, query) {
        tableName = tableName || query._fromTable
        return {
          action: "remove",
          type: "DELETE",
          url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : '') + '/' + value
        };
      },
      update: function (dm, keyField, value, tableName, query) {
        tableName = tableName || query._fromTable
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

        if (data) {
          if (data.table) {
            table = data.table;
            delete data.table;
          }
        }

        //action if not defined is a get request else it is a CUD request
        if (!settings.action) {
          //get request
          if (this.options.requestType === "get") {
            // requesting data using url string parameters
            settings.url = settings.url + table;
          } else {
            // requesting data using post with http tunneling via method=GET
            if (data.include_count === true) {
              delete data.include_count;
              count = 'include_count=true';
            }
            settings.url = settings.url + table + '/?method=GET&' + count + '';
          }
        }
      }
    });
    return new adapter(adapterOptions)
  }

  constructor() {
    this.syncfusiondmSymbols = {};
    this.fnOperators = {}
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
