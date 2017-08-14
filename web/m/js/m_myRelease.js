/**
 * Created by lekuai on 17/4/5.
 */
var token = getParams('token')
$(function () {

    //监听横竖屏
    window.addEventListener("resize", function(event) {
        updateLayout()
    }, false);

    requestReleaseHouses()
})

var releaseHouses
function requestReleaseHouses() {

    request(basicUrl + 'user/release',{
        token: token
    }, function (resp) {
        releaseHouses = resp
        showReleaseHouses()

        updateLayout()
        addEvents()
    })
}
function showReleaseHouses() {
    var releaseList = $('.releaseList')
    for (var i=0; i<releaseHouses.length; i++) {
        var house = releaseHouses[i]
        var li = getReleaseHouseLi(house)
        releaseList.append(li)
    }
}
function getReleaseHouseLi(house) {
    var li = $("<li class='clearfix'></li>")
    var basicInfo = $("<div class='basicInfo clearfix'></div>")
    li.append(basicInfo)
    var img = $("<img alt='' class='pull-left'/>")
    img.attr('src',basicUrl + house.images[0])
    basicInfo.append(img)
    var desc = $("<div class='basicInfo clearfix pull-left desc'></div>")
    basicInfo.append(desc)
    var title = house.title
    var oTitle = $("<div class='house-title'></div>")
    oTitle.text(title)
    desc.append(oTitle)
    var address = $("<div class='address'></div>")
    address.text(house.district+"-"+house.address)
    desc.append(address)
    var price = $("<div class='price'></div>")
    price.text('¥'+house.price)
    desc.append(price)
    var date = $("<div class='date'></div>")
    desc.append(date)
    var releaseTime = $("<span class='releaseTime'></span>")
    releaseTime.text(house.release_date)
    date.append(releaseTime)
    var tag = $("<div class='tag'></div>")
    desc.append(tag)
    if (house.sell_state == '在架') {
        tag.text('转租中')
        tag.addClass('sell')
    } else {
        tag.text('已下架')
        tag.addClass('unsell')
    }

    var count = $("<div class='count row'></div>")
    li.append(count)
    var collectionNum = $("<div class='col-xs-4 collectionNum text-center'></div>")
    count.append(collectionNum)
    var collectionNumSpan1 = $("<span class='text-muted'>收藏</span>")
    collectionNum.append(collectionNumSpan1)
    var collectionNumSpan2 = $("<span class='center-block'></span>")
    collectionNumSpan2.text(house.collection_count)
    collectionNum.append(collectionNumSpan2)
    var totalBrowseNum = $("<div class='col-xs-4 totalBrowseNum text-center'></div>")
    count.append(totalBrowseNum)
    var totalBrowseNumSpan1 = $("<span class='text-muted'>浏览</span>")
    totalBrowseNum.append(totalBrowseNumSpan1)
    var totalBrowseNumSpan2 = $("<span class='center-block'></span>")
    totalBrowseNumSpan2.text(house.browse_count)
    totalBrowseNum.append(totalBrowseNumSpan2)
    var todayBrowseNum = $("<div class='col-xs-4 todayBrowseNum text-center'></div>")
    count.append(todayBrowseNum)
    var todayBrowseNumSpan1 = $("<span class='text-muted'>今日浏览</span>")
    todayBrowseNum.append(todayBrowseNumSpan1)
    var todayBrowseNumSpan2 = $("<span class='center-block'></span>")
    todayBrowseNumSpan2.text(house.today_browse_count)
    todayBrowseNum.append(todayBrowseNumSpan2)

    var actionBtns = $("<div class='clearfix actionBtns' style='margin-top: 5px'></div>")
    li.append(actionBtns)
    var ul = $("<ul class='list-unstyled'></ul>")
    actionBtns.append(ul)
    var stickLi = $("<li><button class='btn btn-default' type='button'>置顶</button></li>")
    ul.append(stickLi)
    var deleteLi = $("<li><button class='btn btn-default' type='button'>删除</button></li>")
    ul.append(deleteLi)
    var editLi = $("<li><button class='btn btn-default' type='button'>编辑</button></li>")
    ul.append(editLi)
    var sellLi = $("<li><button class='btn btn-default' type='button'></button></li>")
    if (house.sell_state == "在架") {
        sellLi.children('button').text('下架')
    } else {
        sellLi.children('button').text('上架')
    }
    ul.append(sellLi)

    stickLi.children('button').click(function () {
        stickTop(house.house_id)
    })
    deleteLi.children('button').click(function () {
        remove(house.house_id)
    })
    editLi.children('button').click(function () {
        location.href = 'release.html?house_id='+house.house_id
    })
    sellLi.children('button').click(function () {
        var sell = house.sell_state == "在架" ? 0 : 1
        toggleSell(house.house_id,sell)
    })

    return li
}

/*===================================*/
//调整布局的函数
function updateLayout() {

    var totalW = $('.releaseList>li').outerWidth(true)
    var imgW = $('.releaseList>li>.basicInfo>img').outerWidth(true)
    var descW = totalW-imgW-40
    $('.releaseList>li .desc').width(descW)
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
    $('.releaseList>li>.basicInfo>img').click(function () {
        var i = $(this).parents('li').index();
        var houseId = releaseHouses[i].house_id
        JSInteraction.toDetailPage(houseId)
    })
}

//置顶
function stickTop(houseId) {
    var params = {
        token: token,
        house_id: houseId
    }
    request(basicUrl+'house/stick',params,function (resp) {
        showModel('置顶成功')
        setTimeout(function () {
            location.reload()
        },500)
    })
}
//删除
function remove(houseId) {
    var params = {
        token: token,
        house_id: houseId
    }
    request(basicUrl+'house/delete',params,function (resp) {
        showModel('删除成功')
        setTimeout(function () {
            location.reload()
        },500)

    })
}
//上架或下架
function toggleSell(houseId,sell) {
    var params = {
        token: token,
        house_id: houseId,
        sell: sell
    }
    request(basicUrl+'house/change-sell-state',params,function (resp) {
        if (sell==0) {
            showModel('下架成功')
        } else {
            showModel('上架成功')
        }

        setTimeout(function () {
            location.reload()
        },500)

    })
}

