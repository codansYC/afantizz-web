/**
 * Created by lekuai on 2017/6/30.
 */
var app_token = null
$(function () {

    initViews()
    initData()

    function initViews() {

        $(".reason ul li").click(function () {
            var i = $(this).children('i')
            if (i.hasClass('checked')) {
                i.removeClass('checked')
            } else {
                $(".reason ul li i").removeClass('checked')
                i.addClass('checked')
            }
        })

        var urlStr = basicUrl + '/images/icons.png' 
        $('.alert i').css('background-image', 'url('+urlStr+')') 
        $('.reason ul li i').css('background-image', 'url('+urlStr+')')
    }

    function initEvents() {

    }

    function initData() {
        app_token = getParams('token')
        if (app_token != null) {
            getUserInfo()
        } else {
            app_token = ''
        }
    }

})

//获取用户信息
function getUserInfo() {
    request(basicUrl+'user/info',{
        token: app_token
    },function (user) {
        $('.phone-input').val(user.phone)
    })
}

//提交举报
function accusate() {
    if (typeof(JSInteraction) != "undefined" && JSInteraction != null) {
        JSInteraction.showLoadingWhileComplain()
    }
    var houseId = parseInt(getParams("house_id"));
    var reason = ''
    $(".reason ul li").each(function () {
        if ($(this).children('i').hasClass('checked')) {
            reason = $(this).children('span').text()
        }
    })
    var desc = $('#complain-desc').val()
    var phone = $('.phone-input').val()
    if (reason == '' && (desc == '' || desc == null)) {
        if (typeof(JSInteraction) != "undefined" && JSInteraction != null) {
            JSInteraction.removeLoadingComplainDone()
        }
        showModel('请选择举报理由或简要描述举报理由')
        return
    }
    var params = {
        house_id: houseId,
        reason: reason,
        token: app_token,
        phone: phone,
        desc: desc,
        platform: 'js'
    }
    $.post(basicUrl + '/house/complain', params, function (response, status) {
        if (typeof(JSInteraction) != "undefined" && JSInteraction != null) {
            JSInteraction.removeLoadingComplainDone()
        }
        if (status != 'success') {
            showModel('操作失败,请稍后重试')
            return
        }
        var resp = $.parseJSON(response);
        if (resp.err_code != 0) {
            showModel(resp.err_msg)
            return
        }
        showModel('举报成功', function () {
            if (typeof(JSInteraction) != "undefined" && JSInteraction != null) {
                JSInteraction.back()
            } else {
                history.back()
            }
        }, 1000)

    });
}

