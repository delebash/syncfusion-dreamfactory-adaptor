//--------------------------------------------------------------------------
//  DreamFactory 2.0 instance specific constants
//--------------------------------------------------------------------------
var INSTANCE_URL = 'https://api.test.com';
var APP_API_KEY = 'key';

var api = "/api/v2/",
  db = "northwind/",
  service = "_table/",
  serviceObject = "customers",
  overrideMethod = '?method=GET',
  url = INSTANCE_URL + api + db + service;

var username = 'support@ageektech.com';
var password = 'test12345';

//--------------------------------------------------------------------------
//  Login
//--------------------------------------------------------------------------
var loginHandle = function (response) {
  if (response.hasOwnProperty('session_token')) {
    setToken('token', response.session_token);
    // $.route('groups');
    makeCall(url, serviceObject, overrideMethod, APP_API_KEY)
  }
  else {
    var msgObj = {};
    msgObj = parseResponse(response);
    if (msgObj) {
      messageBox(msgObj.code, msgObj.message, msgObj.error);
    }
  }
};


function login() {
  $.ajax({
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    url: INSTANCE_URL + '/api/v2/user/session',
    data: JSON.stringify({
      "email": username,
      "password": password
    }),
    cache: false,
    method: 'POST',
    success: function (response) {
      loginHandle(response);
    },
    error: function (response) {
      loginHandle(response);
      return false;
    }
  });
}

//--------------------------------------------------------------------------
//  Misc functions
//--------------------------------------------------------------------------

function setToken(key, value) {
  sessionStorage.setItem(key, value);
}

function getToken(key) {
  return sessionStorage.getItem(key);
}

function removeToken(key) {

  $.api.logout(function (data) {
    if (data.success) {
      sessionStorage.removeItem(key);
      // $.route('index');
    }
    else {
      var response = parseResponse(data);
      messageBox(response.code, response.message, response.error);
    }
  });
}


function messageBox(title, body, error) {
  $('#modal_title').html(title);
  $('#modal_body').html(body);
  $('#errorMsg').html(error);
  $('#messageBox').modal('show');
}

function parseResponse(response) {
  var responseObj = jQuery.parseJSON(response.responseText);

  if (responseObj.hasOwnProperty('error')) {
    if (responseObj.error.context !== null) {
      var errMsg = '';

      $.each(responseObj.error.context, function (data) {
        errMsg += '<br> - ' + responseObj.error.context[data][0].replace(/&quot;/g, '\"');
      });

      var message = responseObj.error.message + '<br>' + errMsg;
      return {code: responseObj.error.code, message: message, error: JSON.stringify(response)};
    }
    else {
      return {
        code: responseObj.error.code,
        message: responseObj.error.message.replace(/&quot;/g, '\"'),
        error: JSON.stringify(response)
      };
    }
  }
  else {
    return false;
  }
}
