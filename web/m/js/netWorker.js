/**
 * Created by lekuai on 17/4/7.
 */
//处理网络请求
var basicUrl = "../../"
function request(url,params,respBlock) {
    alert(2222)
    $.post(basicUrl + url, params, function (response, status) {
        if (status == 'success') {
            var resp = $.parseJSON(response);
            respBlock(resp)
        } else {
            showModel('操作失败')
        }
    });
}
