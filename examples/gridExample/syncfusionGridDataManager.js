function makeCall(url, serviceObject, overrideMethod, APP_API_KEY) {
  var token = getToken('token');
  url += serviceObject
  var dataManager = ej.DataManager({
    url: url,
    adaptor: new syncfusionDreamFactoryAdapter(),
    headers: [{"X-DreamFactory-API-Key": APP_API_KEY, "X-DreamFactory-Session-Token": token}]
  });


  $("#Grid").ejGrid({
    dataSource: dataManager,
    allowPaging: true,
    allowSorting: true,
    allowFiltering: true,
    filterSettings: {showPredicate: true, filterType: "menu", enableCaseSensitivity: true},
    searchSettings: {ignoreCase: false},
    // filterSettings: { filterType: "menu" },

    columns: [{field: "id", headerText: "ID"},
      {field: "first_name", headerText: "First Nmae"},
      {field: "last_name", headerText: "Last Name"}
    ]
    // allowFiltering: true,
    //searchSettings: {ignoreCase:false}
    // filterSettings: {showPredicate:true ,filterType : "menu",enableCaseSensitivity:false},
    // columns: [{field:"id"},{field:"last_name"},{field:"first_name"}
    // ]
  })
}


//**************************
//Server side paging all page requests hit server

//     var dataManager = ej.DataManager({url: INSTANCE_URL + '/api/v2/db/_table/',
//     adaptor: new syncfusionGridAdapter(),
//     headers: [{"X-DreamFactory-API-Key": APP_API_KEY,"X-DreamFactory-Session-Token": token}]});
//
//     $("#Grid").ejGrid({
//     dataSource: dataManager,
//     allowPaging: true,
//     allowSorting: true,
//     allowFiltering: true,
//     filterSettings: { filterType: "menu" },
//     columns: ["id","last_name","first_name"
//     ]
//   })
//**************************


//*************************
//Client side paging
//To do client side paging and then update server side use remoteSaveAdapter in combination with
//original Adapter
//https://www.syncfusion.com/forums/118995/client-side-paging-tied-to-a-restful-api
//*************************

//Getting all the data from the server
//
// promise is connected to my orginal adapter then reusults are run through remoteSaveAdapter
//
// var promise = ej.DataManager({url: INSTANCE_URL + '/api/v2/db/_table/', offline: true,
//    adaptor: new syncfusionGridAdapter(),
//     headers: [{"X-DreamFactory-API-Key": APP_API_KEY,"X-DreamFactory-Session-Token": token}]});
//
//
// promise.ready.done(function (e) {
//
//
//
//     $("#Grid").ejGrid({
//
//
//
//         /* Provided the e.result to `json` property
//
//          * Specified the adaptor as ej.remoteSaveAdaptor()
//
//          * Now except CRUD, all actions will be performed at client side.
//
//          */
//
//         dataSource: ej.DataManager({ json: e.result, updateUrl: '/update', adaptor: ej.remoteSaveAdaptor() }),
//
//         columns: [
//
//             .........
//
//     ]
//
// })

//EXAMPLE

//Getting all the data from the server
// var promise = ej.DataManager({url: INSTANCE_URL + '/api/v2/db/_table/', offline: true,
//     adaptor: new syncfusionGridAdapter(),
//     headers: [{"X-DreamFactory-API-Key": APP_API_KEY,"X-DreamFactory-Session-Token": token}]});
//
// promise.ready.done(function (e) {
//     $("#Grid").ejGrid({
//         dataSource:  ej.DataManager({ json: e.result, adaptor: ej.remoteSaveAdaptor() }),
//         columns: ["id","last_name","first_name"
//         ]
//     })
// });


//Using Query attached to grid
//   var query = ej.Query()
//       .from("contact")
//       //   .requiresCount(false)
//       //  .select("is""last_name","first_name")
//       //.sortBy("first_name","ascending",false)
//       .sortBy("first_name","descending",false)
//       // .limit(2);
//       .where("last_name","equal","Yuan")
//       //.where(ej.Predicate("last_name", "equal", "Yuan").and("first_name","equal","Christine"));

//Grid

// $("#Grid").ejGrid({
//     dataSource: dataManager,
//     allowPaging: true,
//     allowSorting: true,
//     allowFiltering: true,
//     filterSettings: { filterType: "menu" },
//     query: query,
//     columns: ["id","last_name","first_name"
//     ]
// });