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

var username = 'test@test.com';
var password = 'test12345';

// Sample of passing a request param
var requestParams = {
  order: 'last_name DSC'
};

//var requestParams = {};

//--------------------------------------------------------------------------
//  Login
//--------------------------------------------------------------------------
var loginHandle = function (response, logintype) {
  if (response.hasOwnProperty('session_token')) {
    setToken('token', response.session_token);

    if (logintype == 'ajax') {
      makeCall(url, serviceObject, requestParams, overrideMethod, APP_API_KEY)
        .done(function (data) {
          $("#table1 tbody").html($("#tableTemplate").render(data.resource));
        })
        .fail(function (e) {
          alert("Handling errors")
        });
    } else {
      makeCall(url, serviceObject, overrideMethod, APP_API_KEY)
    }
  }
  else {
    var msgObj = {};
    msgObj = parseResponse(response);
    if (msgObj) {
      messageBox(msgObj);
    }
  }
};


function login(logintype) {
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
      loginHandle(response, logintype);
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
      alert(response.code, response.message, response.error);
    }
  });
}


function messageBox(msgObj) {
  alert("Error Code: " + msgObj.code + "\n\nError Message:\n" + msgObj.message + "\n\nError Details:\n" + msgObj.error);
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
