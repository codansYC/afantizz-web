/**
 * Created by lekuai on 2017/5/8.
 */

$(function () {

    $('.content').css('margin-top','0px')

    $('.publish').click(function () {
        var desc = $('#feedback').val();
        if (!desc || desc == '') {
            showModel('请输入反馈意见')
            return;
        }
        feedback(desc)

    })
})

function feedback(content) {
    var token = getParams('token') != null ? getParams('token') : ''
    var params = {
        token    : token,
        content  : content,
        platform : 'mobile'
    }
    request(basicUrl+'feedback/feedback',params,function (resp) {
        showModel('发表成功');
        setTimeout(function () {
            location.reload()
        },500)
    })
}