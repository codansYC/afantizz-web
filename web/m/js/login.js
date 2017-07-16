/**
 * Created by lekuai on 17/4/5.
 */
$(function () {

    var isCounting = false

    var sendCodeBtn = $('.sendCode')
    var phoneField = $('.phoneField')
    var codeField = $('.codeField')
    var loginBtn = $('.login')
    //电话输入框
    phoneField.bind('input valueChange', function () {
        if (isCounting) {
            return
        }
        if (phoneIsValid()) {
            sendCodeBtn.removeClass('disabled')
        } else {
            if (!sendCodeBtn.hasClass('disabled')) {
                sendCodeBtn.addClass('disabled')
            }
        }

        controlLoginBtnState()
    })

    //发送验证码按钮
    sendCodeBtn.click(function () {
        if (isCounting || !phoneIsValid()) {
            return
        }
        //判断
        var inputImageCode = $("#imageCodeInput").val()

        if (inputImageCode.toLowerCase() != imageCodeText.toLowerCase()) {
            showModel('图形验证码不正确');
            resetImageCode()
            return;
        }
        isCounting = true

        //发送验证码的请求
        getCaptcha()
        //重置图片验证码
        resetImageCode()
        //开启倒计时
        timerControl()

    })

    //验证码输入框
    codeField.bind('input valueChange', function () {
        controlLoginBtnState()
    })

    //登录按钮
    loginBtn.click(function () {
        if (!codeIsValid() || !phoneIsValid()) {
            return
        }
        //发送登录请求
        loginRequest(phoneField.val(),codeField.val())
    })

    //登录请求
    function loginRequest(phone, code) {
        var params = {
            phone: phone,
            captcha: code
        }
        $.post(basicUrl + 'login/login', params, function (response, status) {
            if (status != 'success') {
                showModel('操作失败,请稍后重试')
                return
            }
            var resp = $.parseJSON(response);
            if (resp.err_code != 0) {
                showModel(resp.err_msg)
                return
            }
            document.cookie = "token=" + resp.data.token;
            showModel('登录成功', function () {
                codeField.val('')
                location = document.referrer
            })
            resetImageCode()
        });
    }

    function resetImageCode() {
        $("#imageCodeInput").val('')
        drawPic()
    }

    //验证手机号是否输入正确
    var phoneIsValid = function () {
        var text = phoneField.val()
        return $().phoneIsValid(text)
    }
    //验证验证码格式是否正确
    var codeIsValid = function () {
        var text = codeField.val()
        return $().codeIsValid(text)
    }

    //倒计时
    var timer
    var count = 60
    function timerControl() {
        count = 60
        sendCodeBtn.addClass("disabled")
        timer = setInterval(function () {
            count--
            console.log(count)
            if (count == 0) {
                clearInterval(timer)
                isCounting = false
                sendCodeBtn.text("发送验证码")
                if (phoneIsValid()) {
                    sendCodeBtn.removeClass("disabled")
                } else {
                    sendCodeBtn.addClass("phoneValid")
                }
                return
            }
            sendCodeBtn.text(count + "s后重发")
        }, 1000)
    }

    //控制登录按钮状态
    function controlLoginBtnState() {
        if (codeIsValid() && phoneIsValid()) {
            loginBtn.removeClass('disabled')
        } else {
            if (!loginBtn.hasClass('disabled')) {
                loginBtn.addClass('disabled')
            }
        }
    }

    /**获取验证码**/
    function getCaptcha() {
        var params = {
            phone: phoneField.val()
        }
        request(basicUrl+'login/captcha',params,function (resp) {

        })
    }
})



