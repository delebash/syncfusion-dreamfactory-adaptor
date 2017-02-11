function makeCall(url, serviceObject, overrideMethod, APP_API_KEY) {
    var token = getToken('token');

    //requestType = "get" -- request uses query string params via get, "json" -- request uses post to send an object
    var adapterOptions = {requestType: "get"}; //defaults to "get" if not specified

    var dataManager = ej.DataManager({
        url: url,
        adaptor: new syncfusionDreamFactoryAdapter(adapterOptions),
        headers: [{"X-DreamFactory-API-Key": APP_API_KEY, "X-DreamFactory-Session-Token": token}]
    });

    var queryCustomers = ej.Query()
        .from('customers')
        // .select("id, last_name", "first_name")
        //.where("last_name","equal","axen")
        //  .where("id",ej.FilterOperators.lessThan,5)
        // .sortBy("last_name","DESC")
        .where("last_name", "contains", "axen");
    // .where("last_name", "like","a");
    // .where("last_name", "in" , "Yuan,Huang");
    // .where(ej.Predicate("last_name", "in", "'Yuan','Yan'").and("first_name","equal","Christine"));
    // .where(ej.Predicate("last_name", "startswith", "a").and("first_name","startswith","t"));


    //OR you can use query without specifying .from but you need to have table in url l
    // url += serviceObject;

    $("#Grid").ejGrid({
        dataSource: dataManager,
        query: queryCustomers,
        toolbarSettings: {
            showToolbar: true,
            toolbarItems: ["add", "edit", "delete"]
        },
        editSettings: {
            allowEditing: true,
            allowAdding: true,
            allowDeleting: true,
            editMode: "dialog"
        },
        allowPaging: true,
        allowSorting: true,
        allowFiltering: true,
        // filterSettings: { filterType: "excel" },
        filterSettings: {showPredicate: true, filterType: "menu", enableCaseSensitivity: true},
        searchSettings: {ignoreCase: false},
        isResponsive: true,
        columns: [
            {field: "id", isPrimaryKey: true, isIdentity: true, width: 10},
            {field: "first_name", headerText: "First Name", width: 110},
            {field: "last_name", headerText: "Last Name", width: 110}
        ]
    });
}
