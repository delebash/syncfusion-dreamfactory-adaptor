function makeCall(url, serviceObject, overrideMethod, APP_API_KEY) {
  var token = getToken('token');

  //requestType = "get" -- request uses query string params via get, "json" -- request uses post to send an object
  var adaptorOptions = {requestType: "get"}; //defaults to "get" if not specified or not passed in

  var dataManager = ej.DataManager({
    url: url,
    adaptor: new syncfusionDreamFactoryAdaptor(adaptorOptions),
    headers: [{"X-DreamFactory-API-Key": APP_API_KEY, "X-DreamFactory-Session-Token": token}]
  });
  var query = ej.Query()
    .from(serviceObject)
    .select("last_name", "first_name")
    //.where("last_name","=","Bedecs")
   // .sortBy("last_name", "DESC")
  //.where("last_name", "notin" , "Huang,Yang");
  //.where("last_name", "in" , "Yuan,Huang");
  // .where("last_name", "startswith", "Y");
  //.where(ej.Predicate("last_name", "in", "'Yuan','Yan'").and("first_name","equal","Christine"));

  var execute = dataManager.executeQuery(query) // executing query
    .done(function (e) {
      //  console.log(e)
      $("#table1 tbody").html($("#tableTemplate").render(e.result));
    })
    .fail(function (e) {
      alert("Handling errors")
    });
}
