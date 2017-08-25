/**
 * Created by lekuai on 17/4/4.
 */

$(function () {

    $('#myRelease').click(function () {
        if (isLogin()) {
            location.href = 'myRelease.html'
        } else {
            location.href = 'login.html'
        }
    })
    $('#myCollection').click(function () {
        if (isLogin()) {
            location.href = 'myCollection.html'
        } else {
            location.href = 'login.html'
        }
    })

    if (isLogin()) {
        getUserInfo()
    }

    $('.loginOrLogout').click(function () {
        if (isLogin()) {
            if (confirm('确定要退出登录?')) {
                logout()
            }
        } else {
            toLoginPageWhenUnLogin()
        }
    })


})

//获取用户信息
function getUserInfo() {
    request(basicUrl+'user/info',{
        token: getToken()
    },function (user) {
        $('.number').text(user.phone)
        var loginOrLogout = $('.loginOrLogout')
        loginOrLogout.removeClass('btn-success')
        loginOrLogout.addClass('btn-danger')
        loginOrLogout.text('退出登录')
    })
}

//退出登录
function logout() {
    var token = getToken();
    document.cookie = "token="+token+"; expires=Thu, 26 Feb 1971 11:50:25 GMT";
    location.reload()
}