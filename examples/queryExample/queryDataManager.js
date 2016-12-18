function makeCall(url, serviceObject, overrideMethod, APP_API_KEY) {
  var token = getToken('token');
  var dataManager = ej.DataManager({
    url: url,
    adaptor: new syncfusionDreamFactoryAdapter(),
    headers: [{"X-DreamFactory-API-Key": APP_API_KEY, "X-DreamFactory-Session-Token": token}]
  });
  var query = ej.Query()
    .from(serviceObject)
  //  .select("last_name", "first_name")
  //  .where("last_name", "=", "Yang");
  //.where("last_name", "notin" , "Huang,Yang");
  //.where("last_name", "in" , "Yuan,Huang");
  // .where("last_name", "startswith", "Y");
  //.where(ej.Predicate("last_name", "in", "'Yuan','Yan'").and("first_name","equal","Christine"));

  var execute = dataManager.executeQuery(query) // executing query
    .done(function (e) {
      //  console.log(e)
      $("#table1 tbody").html($("#tableTemplate").render(e.result));
    })
}
