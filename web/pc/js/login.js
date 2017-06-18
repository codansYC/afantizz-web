/**
 * Created by lekuai on 17/1/29.
 */

$(function () {

    //展示登录页
    $.fn.showLoginPage=function() {
        var loginContainer = $("<div></div>")
        loginContainer.addClass("login-container")
        loginContainer.attr("id", "login-container")
        var overlayBg = $("<div></div>")
        overlayBg.addClass("overlay_bg")
        overlayBg.attr("id", "loginOverlay")
        var dialog = $("<div></div>")
        dialog.addClass("panel_login")
        dialog.attr("id", "dialog")
        loginContainer.append(overlayBg)
        loginContainer.append(dialog)
        var close = $("<i></i>")
        close.addClass("close")
        dialog.append(close)
        var closeImg = $("<img/>")
        closeImg.attr({
            "src": "/images/close.png"
        })
        close.append(closeImg)
        var panelInfo = $("<div></div>")
        panelInfo.addClass("panel_info")
        dialog.append(panelInfo)
        var ul = $("<ul></ul>")
        panelInfo.append(ul)
        var li1 = $("<li></li>")
        li1.addClass("panel_phone")
        ul.append(li1)
        var phoneTf = $("<input/>")
        phoneTf.addClass("login_info")
        phoneTf.attr({
            "id": "login_phone_tf",
            "type": "text",
            "required": "required",
            "placeholder": "输入手机号",
            "name": "phoneTf"
        })
        li1.append(phoneTf)
        var getCodeBtn = $("<input/>")
        getCodeBtn.attr({
            "id": "login_getCode_btn",
            "type": "button",
            "value": "获取验证码",
            "disabled": "disabled"
        })
        li1.append(getCodeBtn)
        var li2 = $("<li></li>")
        li2.addClass("panel_code")
        ul.append(li2)
        var codeTf = $("<input/>")
        codeTf.addClass("login_info")
        codeTf.attr({
            "id": "login_code_tf",
            "type": "text",
            "placeholder": "输入验证码",
        })
        li2.append(codeTf)
        var li3 = $("<li></li>")
        li3.addClass("panel_action")
        ul.append(li3)
        var loginBtn = $("<input class='login'/>")
        loginBtn.attr({
            "id": "login_btn",
            "type": "button",
            "value": "登录"
        })

        li3.append(loginBtn)
        var li4 = $("<li></li>")
        li4.addClass("panel_otherLogin")
        ul.append(li4)
        var otherLoginTitle = $("<div>------- 第三方登录 -------</div>")
        otherLoginTitle.addClass("otherLoginTitle")
        li4.append(otherLoginTitle)
        var wxLogin = $("<div></div>")
        wxLogin.addClass("wxLogin")
        li4.append(wxLogin)
        var wxLoginA = $("<a href='/pc/weixinLogin.html'><i><img src='/images/weixin.png' alt=''></i></a>")
        wxLogin.append(wxLoginA)
        $("body").append(loginContainer)

        phoneTf.bind('input valueChange', function () {
            if (isCounting) {
                return
            }
            if (phoneIsValid()) {
                getCodeBtn.addClass("phoneValid")
                getCodeBtn.removeAttr("disabled")
            } else {
                getCodeBtn.removeClass("phoneValid")
                getCodeBtn.attr("disabled", "disabled")
            }
        })


        getCodeBtn.click(function () {
            isCounting = true
            count = 60
            getCodeBtn.val(count + "s后重新发送")
            getCodeBtn.css("font-size", "12px")
            getCodeBtn.attr("disabled", "disabled")
            /*测试代码*/
            // codeTf.val("0000")
            captchaRequest()
            timer = setInterval(function () {
                count--
                if (count == 0) {
                    clearInterval(timer)
                    isCounting = false
                    getCodeBtn.css("font-size", "15px")
                    getCodeBtn.val("获取验证码")
                    if (phoneIsValid()) {
                        getCodeBtn.removeAttr("disabled")
                    } else {
                        getCodeBtn.removeClass("phoneValid")
                    }
                    return
                }
                getCodeBtn.val(count + "s后重新发送")
            }, 1000)
        })

        loginBtn.click(function () {
            if (phoneIsValid() && codeIsValid()) {
                loginRequest();
            } else {
                alert("手机号或者验证码不正确")
            }
        })

        //渐变展示
        loginContainer.css("display", "none");
        loginContainer.fadeIn(200);

        //点击关闭按钮渐变消失
        close.click(function () {
            loginContainer.fadeTo(200, 0, function () {
                loginContainer.remove()
            })
        })
    }
    
    //倒计时60s
    var count = 60
    var timer
    var isCounting = false
    //验证手机号是否输入正确
    var phoneIsValid = function () {
        var text = $("#login_phone_tf").val()
        return $().phoneIsValid(text)
    }
    //验证验证码格式是否正确
    var codeIsValid = function () {
        var text = $("#login_code_tf").val()
        return $().codeIsValid(text)
    }

})

function captchaRequest() {
    request(basicUrl+'login/captcha',{
        phone: $("#login_phone_tf").val()
    },function (resp) {
        showModel("获取验证码成功")
    })
}

function loginRequest() {

    request(basicUrl+'/login/login',{
        phone: $("#login_phone_tf").val(),
        captcha: $("#login_code_tf").val()
    },function (resp) {
        var token = resp.token
        document.cookie = "token=" + token;
        refreshPageWhenLogin();
    })
}

function refreshPageWhenLogin() {
    location.reload();
}
