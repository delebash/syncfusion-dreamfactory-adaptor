# Syncfusion-DreamFactory-Adaptor
branchtest
A custom Syncfusion data adapter for use with [Dreamfactory](https://www.dreamfactory.com/)

**This is an initial commit use at your own risk**.

To use:
clone project and run `npm install`

# Examples: #

Ajax -- Just a quick tester without a data adapter to verify you can connect to dreamfactory and retrieve data

Grid -- Uses the data-adapter to load a syncfusion grid. Sorting, Filtering, and Paging are working

Query -- Uses the data-adapter combined with a syncfusion query

For these examples to work you need to change to your values

**Values you need to change:**

INSTANCE_URL, APP_API_KEY, username, password, serviceObject, field names in code and html.

**serviceObject** -- for now is your tablename.  The reason I am using serviceObject is that in the future we might be able to call a different dreamfactory service such as a stored procedure.

# Features: #

**Parameters: mapped left to right Dremfactory/Syncfusion**

    from: "table",
    sortBy: "order",
    select: "fields",
    skip: "skip",
    group: "group",
    take: "limit",
    search: "search",
    count: "count",
    where: "filter",
    aggregates: "aggregates

**Operators: mapped from left to right Syncfusion/ Dremfactory**

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
    "in": " IN ",
    "notin": " NOT IN ",
    "IS NOT IN": " IS NOT IN ",
    "IS IN": " IS IN "
    
**Note:**  I have not tested aggregates yet.

**TODO:**

Error handling, Unit Testing, Refactoring



