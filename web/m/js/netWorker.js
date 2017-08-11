/**
 * Created by lekuai on 17/4/7.
 */
//处理网络请求
var basicUrl = "../../"
function request(url,params,respBlock) {
    $.post(basicUrl + url, params, function (response, status) {
        if (status == 'success') {
            var resp = $.parseJSON(response);
            respBlock(resp)
        } else {
            showModel('操作失败')
        }
    });
}
