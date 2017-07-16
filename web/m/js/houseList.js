/**
 * Created by lekuai on 17/4/6.
 */
$(function () {
    updateLayout()
    /*===================================*/

    //监听横竖屏
    window.addEventListener("resize", function(event) {
        updateLayout()
    }, false);
})

//调整布局的函数
function updateLayout() {
    var totalW = $('.houseList>li').outerWidth()
    var imgW = $('.houseList>li>.mainInfo>img').outerWidth()
    $('.houseList>li .desc').width(totalW-imgW-40)
}

function getDescWidth() {
    var totalW = $('.houseList>li').outerWidth()
    var imgW = $('.houseList>li>.mainInfo>img').outerWidth()
    return totalW-imgW-40
}