chrome.webNavigation.onDOMContentLoaded.addListener(function(dom) {
    // injeta script no conteudo da tab
    //createDownloadedFiles(JSON.parse(localStorage["downloadedFiles"]));

});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
       if ( request.from == "background") {
       }
    }
);

/*
* Cria o formulário
*/
document.addEventListener("DOMContentLoaded", function(evt){

    //document.getElementById('sandbox').addEventListener("click", showSandbox);
    chrome.runtime.getBackgroundPage(function (bg) {
        settings = bg.Settings;
        var button = document.getElementById("submit");
        button.addEventListener("click", function (e) {      
            var username = $("#Username").val();
            var passwd = $("#Passwd").val();
            AppService.login(username, passwd);
        });
    });
});

var App = {
    view : {
        render : function() {
            if(App.view.isRememberMe()) {
                var user = App.presenter.getUser();
                $("#Username").val(user.email);
                $("#Passwd").val(user.password);
                $("#RememberMe").check();
            }
        },
        isRememberMe : function() {
            return $("#RememberMe").is(":checked");
        }
    },
    presenter : {
        getUser : function() {
            return localStorage.getItem("user");
        },
        setUser : function(data) {
            localStorage.setItem("user", data);
        }
    },
    model : {

    }
}

var AppService = {
    url : "https://api.pontomaisweb.com.br/api/",
    method : {
        login : {
            path : "auth/sign_in",
            method : "POST",
            headers : {
                'Accept' : 'application/json, text/plain, */*',
                "Content-Type" : "application/x-www-form-urlencoded"
            }
        },
        logout : {
            path : "auth/sign_out",
            method : "DELETE"
        }
    },
    authentication : undefined,
    login : function(username, passwd) {
        if (!AppService.authentication || !AppService.authentication.isConnected) {
            AppService.authentication = new Authentication(username, passwd);
        }
        else {
            AppService.authentication.logOut();
        }
        $.when(AppService.authentication.loginAsync()).then(
            function(status) {
                // success message
            },
            function(status) {
                // failure message
            }
        )
    }
}
var Authentication = (function() {
    var that = this;
    var password;
    function Authentication(username, passwd) {
        this.username = username;
        this.failed = false;
        that.passwd = passwd;        
    }
    Authentication.prototype.setToken = function(token) {
        that.token = token;
    }
    Authentication.prototype.isConnected = function() {
        return that.token !== undefined;
    }
    Authentication.prototype.setResponse = function(response) { 
        that.response = response;
    }
    Authentication.prototype.loginAsync = function() {
        var deferredObject = jQuery.Deferred(); 
        var that = this;
        var options = {
            url : AppService.url + AppService.method.login.path,
            data : {"email": this.username,"password": passwd},
            success : function(data) {
                that.setToken(data.token);
                that.setResponse(data);   
                that.failed = false;   
                deferredObject.resolve(data);
                App.presenter.setUser(data);
            },
            error : function(xhr) {
                if (xhr.responseText !== "") {
                    var response = JSON.parse(xhr.responseText);
                    that.setResponse(response);
                }
                that.failed = true;
                deferredObject.reject(xhr);          
            }
        }
        options.headers = AppService.method.login.headers;
        options.method = AppService.method.login.method;
        $.ajax(options); 
    }
    Authentication.prototype.logOut = function(token) {
        token = token || this.token;
        var that = this;
        var options = {
            url : AppService.url + AppService.method.logout.path,
            method : AppService.method.logout.method,
            headers : {
                'Accept' : 'application/json, text/plain, */*',
                "access-token" : this.token
            },
            success : function(data) {
                that.setToken(undefined);
            }
        };
        $.ajax(options);        
    };       
    return Authentication;
}());
