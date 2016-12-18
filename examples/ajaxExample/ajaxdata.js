function makeCall(url, serviceObject, requestParams, overrideMethod, APP_API_KEY) {
  var token = getToken('token');
  url += serviceObject + overrideMethod;

  // Did we pass a table name;
  // Did we pass in params - if not set to empty object
  var params = requestParams || {};
  // Make ajax call
  return $.ajax({
    dataType: 'json',
    url: url,
    type: 'POST',
    data: JSON.stringify(params),
    contentType: "application/json; charset=utf-8",
    headers: {
      "X-DreamFactory-API-Key": APP_API_KEY,
      "X-DreamFactory-Session-Token": token
    }
  })
}
