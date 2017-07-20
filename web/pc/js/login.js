/**
 * Created by lekuai on 17/1/29.
 */

function showLoginPage() {
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
    var li5 = $("<li class='imageCodeLi' style='display: none'></li>")
    var imageCode = $("<div id='codeBg' class='codeBg'>" +
        "<div style='float:left;'><input type='text' placeholder='输入图形码' class='singleRowHeight imageCode' id='login_imageCode_tf'></div>" +
        "<div class='imageCodeBg'>" +
        "<canvas id='codeCanvas' width='95' height='34'></canvas>" +
        "<a href='javascript:' id='changeImg''>换一张</a></div>")
    li5.addClass('panel_imageCode')
    li5.append(imageCode)
    ul.append(li5)
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
    var wxLoginA = $("<a href='javascript:'><i><img src='/images/weixin.png' alt=''></i></a>")
    wxLogin.append(wxLoginA)
    $("body").append(loginContainer)

    wxLoginA.click(function () {
        showModel('暂未开放')
    })

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
        sendCodeTimes++
        if (sendCodeTimes>3 && !imageCodeIsShow) {
            showImageCode()
            showModel('请输入图形验证码')
            return
        }
        if (imageCodeIsShow) {
            if (!validImageCode()) {
                showModel('图形验证码不正确')
                resetImageCode()
                return
            }
            sendCodeTimes = 0
            hideImageCode()
        }

        isCounting = true
        count = 60
        getCodeBtn.val(count + "s后重新发送")
        getCodeBtn.css("font-size", "12px")
        getCodeBtn.attr("disabled", "disabled")
        /*测试代码*/
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
            showModel("手机号或者验证码不正确")
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

    $("#changeImg").click(function (e) {
        e.preventDefault();
        drawPic();
    })

    drawPic();
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


/**手机验证码请求**/
function captchaRequest() {
    var params = {
        phone: $("#login_phone_tf").val()
    }
    $.post(basicUrl + 'login/captcha', params, function (response, status) {
        resetImageCode()
        if (status != 'success') {
            showModel('操作失败,请稍后重试')
            return
        }
        var resp = $.parseJSON(response);
        if (resp.err_code != 0) {
            showModel(resp.err_msg)
            return
        }
        showModel("获取验证码成功")
    });
}

/**登录请求**/
function loginRequest() {
    var params = {
        phone: $("#login_phone_tf").val(),
        captcha: $("#login_code_tf").val()
    }
    $.post(basicUrl + 'login/login', params, function (response, status) {
        resetImageCode()
        if (status != 'success') {
            showModel('操作失败,请稍后重试')
            return
        }
        var resp = $.parseJSON(response);
        if (resp.err_code != 0) {
            showModel(resp.err_msg)
            return
        }
        var token = resp.data.token
        document.cookie = "token=" + token+ ";path=/";
        refreshPageWhenLogin();
        sendCodeTimes = 0
    });
}

function refreshPageWhenLogin() {
    location.reload();
}

/**=============图形验证码部分==========================**/
var imageCodeDesc = ''
/**验证图形码**/
function validImageCode() {
    if ($('#login_imageCode_tf').val().toLowerCase() == imageCodeDesc.toLowerCase()) {
        return true;
    }
    return false;
}
/**重置图形码**/
function resetImageCode() {
    $('#login_imageCode_tf').val('')
    drawPic()
}
/**绘制验证码图片**/
function drawPic(){
    imageCodeDesc = ''
    var canvas= document.getElementById("codeCanvas");
    var width=canvas.width;
    var height=canvas.height;
    var ctx = canvas.getContext('2d')
    /**绘制背景色**/
    console.log(ctx)
    ctx.fillStyle = randomColor(180,240); //颜色若太深可能导致看不清
    ctx.fillRect(0,0,width,height);
    /**绘制文字**/
    var str = 'ABCEFGHJKMNPSTWXY123456789';
    for(var i=0; i<4; i++){
        var txt = str[randomNum(0,str.length)];
        ctx.fillStyle = randomColor(50,160);  //随机生成字体颜色
        ctx.font = randomNum(25,40)+'px SimHei'; //随机生成字体大小
        var x = 10+i*20;
        var y = randomNum(25,26);
        var deg = randomNum(-45, 45);
        //修改坐标原点和旋转角度
        ctx.translate(x,y);
        ctx.rotate(deg*Math.PI/180);
        ctx.fillText(txt, 0,0);
        //恢复坐标原点和旋转角度
        ctx.rotate(-deg*Math.PI/180);
        ctx.translate(-x,-y);
        imageCodeDesc += txt
    }
    /**绘制干扰线**/
    for(var i=0; i<1; i++){
        ctx.strokeStyle = randomColor(40,180);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo( randomNum(0,10), randomNum(0,height) );
        ctx.lineTo( randomNum(width-10,width), randomNum(0,height) );
        ctx.stroke();
    }
    /**绘制干扰点**/
    for(var i=0; i<80; i++){
        ctx.fillStyle = randomColor(0,255);
        ctx.beginPath();
        ctx.arc(randomNum(0,width),randomNum(0,height), 1, 0, 2*Math.PI);
        ctx.fill();
    }
}

/**生成一个随机数**/
function randomNum(min,max){
    return Math.floor( Math.random()*(max-min)+min);
}
/**生成一个随机色**/
function randomColor(min,max){
    var r = randomNum(min,max);
    var g = randomNum(min,max);
    var b = randomNum(min,max);
    return "rgb("+r+","+g+","+b+")";
}

/*****图形验证码的显隐控制*****/
var imageCodeIsShow = false   //图形验证码部分是否展示给用户
var sendCodeTimes = 0         //发送手机验证码的次数

function showImageCode() {
    $('.imageCodeLi').css('display','block')
    imageCodeIsShow = true
}
function hideImageCode() {
    $('.imageCodeLi').css('display','none')
    imageCodeIsShow = false
}

