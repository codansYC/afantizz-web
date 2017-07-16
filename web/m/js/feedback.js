/**
 * Created by lekuai on 2017/5/8.
 */
$(function () {
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
    var params = {
        token    : getToken(),
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