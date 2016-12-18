var syncfusiondmSymbols = {};
syncfusiondmSymbols.operatorSymbols = {
  "=": "equal",
  "is not null": "notnull",
  "is null": "isnull",
  "is not in": "notin",
  "is in": "in"
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

ej.data.fnOperators.in = function (actual, expected, ignoreCase) {
  if (ignoreCase)
    return (actual) && "IN" && (expected);

  return actual > expected;
};

$.extend(ej.data.operatorSymbols, syncfusiondmSymbols.operatorSymbols);

var syncfusionDreamFactoryAdapter = new ej.ODataAdaptor().extend({
  options: {
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
  onPredicate: function (pred, query, requiresCast) {
    //   query._fromTable ="contact"
    var returnValue = "",
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

    var count = null, aggregateResult = {};

    if (query && query._requiresCount) {
      if (data.meta) count = data.meta.count;
    }

    data = data.resource;
    return isNull(count) ? data : {result: data, count: count};

  },
  onCount: function (e) {
    return e === true ? true : "";
  },
  beforeSend: function (dm, request, settings) {

    var table = "", count = "", data = ej.parseJSON(settings.data);

    if (data.table)
      table = data.table;
    if (data.count === true) {
      delete data.count;
      count = 'include_count=true';
    }
    settings.contentType = "application/json; charset=utf-8";
    settings.url = settings.url + table + '?method=GET&' + count + '';

    delete data.params;
    delete data.requiresCounts;
    settings.data = JSON.stringify(data)
  }

});

var isNull = function (val) {
  return val === undefined || val === null;
};
