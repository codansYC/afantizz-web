/**
 * Created by lekuai on 2017/6/30.
 */
$(function () {

    $(".reason ul li").click(function () {
        var i = $(this).children('i')
        if (i.hasClass('checked')) {
            i.removeClass('checked')
        } else {
            $(".reason ul li i").removeClass('checked')
            i.addClass('checked')
        }
    })

    if (isLogin()) {
        getUserInfo()
    }

})

//获取用户信息
function getUserInfo() {
    request(basicUrl+'user/info',{
        token: getToken()
    },function (user) {
        $('.phone-input').val(user.phone)
    })
}

//提交举报
function accusate() {
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
        showModel('请选择举报理由或简要描述举报理由')
        return
    }
    var params = {
        house_id: houseId,
        reason: reason,
        token: getToken(),
        phone: phone,
        desc: desc
    }
    request(basicUrl + 'house/accusation', params, function (resp) {
        showModel('举报成功',function () {
            history.back()
        },1000)
    })
}