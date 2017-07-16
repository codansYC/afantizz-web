/**
 * Created by lekuai on 17/4/5.
 */
$(function () {

    //监听横竖屏
    window.addEventListener("resize", function(event) {
        updateLayout()
    }, false);

    requestCollectionHouses()

})

/*===================================*/
//请求收藏的房源
var collectionHouses
function requestCollectionHouses() {

    request(basicUrl + 'user/collection',{
        token: getToken()
    }, function (resp) {
        collectionHouses = resp
        showCollectionHouses()

        updateLayout()
        addEvents()
    })
}
function showCollectionHouses() {
    var collectionList = $('.collectionList')
    for (var i=0; i<collectionHouses.length; i++) {
        var house = collectionHouses[i]
        var li = getCollectionHouseLi(house)
        collectionList.append(li)
    }
}
function getCollectionHouseLi(house) {
    var li = $("<li class='clearfix'></li>")
    var img = $("<img alt='' class='pull-left'/>")
    img.attr('src',basicUrl + house.images[0])
    li.append(img)
    var desc = $("<div class='pull-left desc'></div>")
    li.append(desc)
    var title = "转租芦恒路三室一厅主卧"
    var oTitle = $("<div class='house-title'></div>")
    oTitle.text(title)
    desc.append(oTitle)
    var address = $("<div class='address'></div>")
    address.text(house.district+"-"+house.address)
    desc.append(address)
    var price = $("<div class='price'></div>")
    price.text(house.price+'元/月')
    desc.append(price)
    var date = $("<div class='date'></div>")
    desc.append(date)
    var releaseTime = $("<span class='releaseTime'></span>")
    releaseTime.text(house.release_date)
    date.append(releaseTime)

    var collection = $("<div class='collection'><a href='javascript:'>" +
        "<span class='center-block text-danger'>删除</span></a></div>")
    desc.append(collection)

    return li
}

/*===================================*/
//调整布局的函数
function updateLayout() {

    var totalW = $('.collectionList>li').outerWidth()
    var imgW = $('.collectionList>li>img').outerWidth()
    var title = $('.house-title').text()
    var descW = totalW-imgW-10
    //标题调整
    var titleW = descW-48
    var charCount = Math.floor(titleW/15)
    $('.house-title').each(function () {
        var title = $(this).text()
        if(title.length>charCount) {
            title = title.slice(0,charCount) + '...'
            $(this).text(title)
        }
    })

    //地址调整
    var addressW = descW-6
    var addressCharCount = Math.floor(addressW/12)
    $('.address').each(function () {
        var address = $(this).text()
        if(address.length>addressCharCount) {
            address = address.slice(0,addressCharCount) + '...'
            $(this).text(address)
        }
    })
}

/*===================================*/
//添加事件
function addEvents() {
    $('.collectionList>li>img').click(function () {
        var i = $(this).parents('li').index();
        var houseId = collectionHouses[i].house_id
        location.href = 'detail.html?house_id=' + houseId
    })

    $('.collection>a').click(function () {
        var i = $(this).parents('li').index()
        var houseId = collectionHouses[i].house_id
        cancelCollection(houseId)
    })

}
//取消收藏
function cancelCollection(houseId) {

    var params = {
        token: getToken(),
        house_id: houseId
    }
    request(basicUrl+'house/cancel-collection',params,function (resp) {
        showModel('取消收藏成功',function () {
            location.reload()
        },500)

    })
}

