/**
 * Created by lekuai on 17/2/25.
 */

var houses = new Array()
var page = 1
$(function () {

    //记录用户访问
    record()
    //监测屏幕滚动
    var headerH = $(".header").outerHeight();  //导航区域高度
    var searchH = $(".search").outerHeight();  //搜索区域高度
    var filterH = $(".filterCondition").outerHeight(); //筛选区域高度
    $(window).scroll(function(event){
        adjustFilterConditionPostion()
    })
    adjustFilterConditionPostion()
    setSlideConfigure()

    //处于筛选按钮组的点击事件

    //筛选条件选中下标
    function filterCurrentIndex() {
        var i = -1
        $('.filterBox').each(function () {
            if ($(this).css('display')=='block') {
                i = $(this).index()
            }
        })
        return i
    }
    //是否显示筛选页面
    function isShowFilterView() {
        if (filterCurrentIndex() >= 0) {
            return true
        } else {
            return false
        }
    }

    $(".filterCondition>div").click(function () {

        var index = $(this).index()
        if (filterCurrentIndex() == index) {
            hideFilterView()
            return
        }
        showFilterView(index)
        var offsetY = $(document).scrollTop()
        if (offsetY < headerH + searchH) {
            $(document).scrollTop(headerH + searchH)
        }

    })

    //显示筛选视图
    function showFilterView(i) {
        $(".filterBox").each(function () {
            if ($(this).index() == i) {
                $(this).css("display", "block");
            } else {
                $(this).css("display", "none");
            }
        })
        enableScroll(false)
        $('#mask').css('display','block')

        var rentMode = $(".styleGroupList li span:first-child.selected").text()

        switch (i) {
            case 0:
                highlightDistrict(getParams('district'))
                break
            case 1:
                highlightPrice(getParams('price'))
                break
            case 2:
                if (rentMode == '合租' || rentMode == '整租') {
                    $(".styleEntiretyList").css('display', 'block')
                    highlightStyle(getParams('style'))
                } else {
                    $(".styleEntiretyList").css('display', 'none')
                }
                highlightRentMode(getParams('rent_mode'))
                break
            case 3:
                highlightSubway(getParams('subway'))
                break
            default:
                break
        }
        $('.caret').removeClass('caretUp')
        $('.caret').eq(i).addClass('caretUp')
    }
    //隐藏筛选视图
    function hideFilterView() {
        $(".filterBox").css("display", "none");
        enableScroll(true)
        $('#mask').css('display','none')
        adjustFilterConditionPostion()
        $('.caret').removeClass('caretUp')
    }
    //控制滚动
    function enableScroll(enable) {
        if (enable) {
            $("body").css({overflow: "scroll"});
        } else {
            $("body").css({overflow: "hidden"});
        }
    }
    //
    function adjustFilterConditionPostion() {

        if ($(document).scrollTop() >= headerH + searchH) {
            if (!$(".filterBg").hasClass('navbar-fixed-top')) {
                $(".filterBg").addClass("navbar-fixed-top");
                $(".houseBox").css('margin-top','41px')
            }
        } else {
            if (isShowFilterView() == true) {
                $(document).scrollTop(headerH + searchH + 'px')
                return
            }
            $(".filterBg").removeClass("navbar-fixed-top");
            $(".houseBox").css('margin-top','0px')
        }
    }
    //遮盖层事件
    $("#mask").click(function (event) {
        hideFilterView()
    });
    $('#mask').bind("touchmove",function(event) {
        event.preventDefault();
    })

    //筛选
    $('.filterCommon').bind("touchmove",function(event) {
        event.stopPropagation();
    })
    $('.areaBg,.styleBg').bind("touchmove",function(event) {
        event.preventDefault();
    })
    //处理区域选择
    $(".areaBg .areaList li").click(function (event) {
        //禁止事件冒泡
        event.stopPropagation();
        $(".areaBg .areaList li").removeClass("selected");
        $(this).addClass("selected");
        $('.show-area').text($(this).text())
        reload()
    });
    //处理租金选择
    $(".priceBg .priceList li").click(function (event) {
        //禁止事件冒泡
        event.stopPropagation();
        $(".priceBg .priceList li").removeClass("selected");
        $(this).addClass("selected");
        $('.show-price').text($(this).text())
        reload()
    });
    //处理户型选择
    $(".styleBg .styleList .styleGroupList li").click(function (event) {
        //禁止事件冒泡
        event.stopPropagation();
        $(".styleBg .styleList li").children().removeClass("selected");
        $(this).children().addClass('selected')
        $(".styleBg .styleList .styleEntiretyList li").removeClass('selected')
        var select = $(this).children("span:first-child").text()
        switch (select) {
            case '不限':
                $(".styleBg .styleList .styleEntiretyList").css('display', 'none')
                $('.show-style').text(select)
                reload()
                break
            case '公寓':
                $(".styleBg .styleList .styleEntiretyList").css('display', 'none')
                $('.show-style').text(select)
                reload()
                break
            case '合租':
                $(".styleBg .styleList .styleEntiretyList").css('display', 'block')
                break
            case '整租':
                $(".styleBg .styleList .styleEntiretyList").css('display', 'block')
                break
            default:
                break
        }


    });
    $(".styleBg .styleList .styleEntiretyList li").click(function (event) {
        //禁止事件冒泡
        event.stopPropagation();
        $(".styleBg .styleList li").removeClass("selected");
        $(this).addClass("selected");
        var rentMode = $(".styleGroupList li span:first-child.selected").text()
        $('.show-style').text(rentMode + $(this).text())
        reload()
    });
    //处理地铁选择
    $(".subwayBg .subwayList li").click(function (event) {
        //禁止事件冒泡
        event.stopPropagation();
        $(".subwayBg .subwayList li").removeClass("selected");
        $(this).addClass("selected");
        $('.show-subway').text($(this).text())
        reload()
    });

    //高亮选中区域
    function highlightDistrict(district) {
        var district = district
        if (district == null || district == '') {
           district = '不限'
        }
        $(".areaBg .areaList li").each(function () {
            var that = $(this)
            if (that.text() == district) {
                that.addClass('selected')
            } else {
                that.removeClass('selected')
            }
        })
    }
    //高亮选中租金
    function highlightPrice(price) {
        var price = price
        if (price == null || price == '') {
            price = '不限'
        }
        $(".priceBg .priceList li").each(function () {
            var that = $(this)
            if (that.text() == price) {
                that.addClass('selected')
            } else {
                that.removeClass('selected')
            }
        })
    }
    //高亮选中地铁
    function highlightSubway(subway) {
        var subway = subway
        if (subway == null || subway == '') {
            subway = '不限'
        }
        $(".subwayBg .subwayList li").each(function () {
            var that = $(this)
            if (that.text() == subway) {
                that.addClass('selected')
            } else {
                that.removeClass('selected')
            }
        })
    }
    //高亮选中出租方式
    function highlightRentMode(mode) {
        var mode = mode
        if (mode == null || mode == '') {
            mode = '不限'
        }
        $(".styleBg .styleList .styleGroupList li").each(function () {
            var that = $(this)
            if (that.children("span:first-child").text() == mode) {
                that.children().addClass('selected')
            } else {
                that.children().removeClass('selected')
            }
        })
    }
    //高亮选中户型
    function highlightStyle(style) {
        var style = style
        if (style == null || style == '') {
            style = '不限'
        }
        $(".styleBg .styleList .styleEntiretyList li span").each(function () {
            var that = $(this)
            if (that.text() == style) {
                that.addClass('selected')
            } else {
                that.removeClass('selected')
            }
        })
    }

    //搜索事件的处理
    $('.search>input').click(function () {
        window.location.href = 'm/search.html'
    })


    //============================================
    var district = getParams('district')
    var subway = getParams('subway')
    var price = getParams('price')
    var style = getParams('style')
    var rentMode = getParams('rent_mode')
    var sort = getParams('sort')
    var pageStr = getParams('page')
    if (district == '' || district == null) {
        $('.show-area').text('区域')
    } else {
        $('.show-area').text(district)
    }
    highlightDistrict(district)

    if (subway == '' || subway == null) {
        $('.show-subway').text('地铁')
    } else {
        $('.show-subway').text(subway)
    }
    highlightSubway(subway)

    if (price == '' || price == null) {
        $('.show-price').text('租金')
    } else {
        $('.show-price').text(price)
    }
    highlightPrice(price)

    if (rentMode == '' || rentMode == null) {
        $('.show-style').text('户型')
    } else {
        if (style == null) {
            style = ''
        }
        $('.show-style').text(rentMode+style)
    }
    highlightRentMode(rentMode)
    highlightStyle(style)

    if (pageStr == null) {
        page = 1
    } else {
        page = parseInt(pageStr)
    }

    //处理网络请求
    var params = {
        token: getToken(),
        district: district,
        subway: subway,
        price: price,
        style: style,
        rent_mode: rentMode,
        sort: sort,
        page: page
    }
    request(basicUrl+'house/list', params, function (resp) {
        houses = resp
        var lastPageBtn = $('.btn-group button:first-child')
        var nextPageBtn = $('.btn-group button:last-child')
        var pageStr = getParams('page')
        if (pageStr == null) {
            page = 1
        } else {
            page = parseInt(pageStr)
        }
        if (page == 1) {
            lastPageBtn.addClass('disabled')
        } else if (lastPageBtn.hasClass('disabled')){
            lastPageBtn.removeClass('disabled')
        }
        if (houses.length == 0) {
            showModel('没有更多房源了')
            nextPageBtn.addClass('disabled')
            return
        }
        if (houses.length<21) {
            nextPageBtn.addClass('disabled')
        } else if (nextPageBtn.hasClass('disabled')) {
            nextPageBtn.removeClass('disabled')
        }
        showHouseList(houses)
        var paddingLeft = ($('.btnBg').width() - $('.btn-group').width())/2

        $('.btnBg').css({
            'padding-left':paddingLeft+'px',
            'visibility': 'visible'
        })
    })

    function showHouseList(houses) {
        var ul = $('ul.houseList')
        ul.children().remove()
        for (var i = 0; i < houses.length; i++) {
            var house = houses[i]
            var li = $("<li class='clearfix'></li>")
            ul.append(li)
            var mainInfo = $("<div class='mainInfo clearfix'></div>")
            li.append(mainInfo)
            var img = $("<img class='pull-left'/>")
            img.attr("src", imageUrl + house.images[0])
            var desc = $("<div class='pull-left desc'></div>")
            mainInfo.append(img, desc)
            /*标题*/
            //180px 大约12个字  每15px写1个字
            var title = house.title
            var titleDescW = getDescWidth()
            var charCount = Math.floor(titleDescW/15)
            if (title.length > charCount) {
                title = title.slice(0,charCount) + '...'
            }
            var oTitle = $("<div class='house-title'></div>")
            oTitle.text(title)
            desc.append(oTitle)
            /*地址与出租方式*/
            var addressAndRentMode = $("<div class='addressAndRentMode clearfix'></div>")
            desc.append(addressAndRentMode)
            var address = $("<div class='address'></div>")
            addressAndRentMode.append(address)
            var addressDesc = house.district + "-" + house.address
            var addressCharCount = Math.floor((titleDescW-28)/12.7)
            if (addressDesc.length > addressCharCount) {
                addressDesc = addressDesc.slice(0,addressCharCount) + '...'
            }
            address.text(addressDesc)
            var rentMode = $("<div class='rent-mode'></div>")
            var rentModeDesc = $("<span class='rent-mode-span'></span>")
            rentModeDesc.text(house.rent_mode)
            rentMode.append(rentModeDesc)
            addressAndRentMode.append(rentMode)
            var tags = $("<div class='tags'></div>")
            desc.append(tags)
            //房间结构(几室几厅)
            if (house.style != null || house.style != '') {
                var mainStyle = house.style.split('厅')[0] + '厅'
                var oStyle = $("<span class='mainStyle'></span>");
                oStyle.text(mainStyle)
                tags.append(oStyle)
            }
            //主卧或次卧
            if (house.rent_mode == '合租') {
                var secondStyle = house.style.slice(-2)
                var oStyle = $("<span class='secondStyle'></span>");
                oStyle.text(secondStyle)
                tags.append(oStyle)
            }
            //独立卫生间
            if (house.facilities.indexOf('独立卫生间') > -1) {
                var oToilet = $("<span class='toilet'></span>");
                oToilet.text('独卫')
                tags.append(oToilet)
            }
            //转租优惠
            if (house.benefit != "" && house.benefit != null) {
                var benefit = $("<span class='benefit'></span>")
                benefit.text('转租优惠')
                tags.append(benefit)
            }
            var priceAndDate = $("<div class='priceAndDate'></div>")
            desc.append(priceAndDate)
            //发布时间
            var releaseTime = $("<span class='releaseTime pull-right'></span>")
            releaseTime.text(house.release_date)
            priceAndDate.append(releaseTime)
            //价格
            var price = $("<div class='price'></div>")
            price.text('¥'+house.price)
            priceAndDate.append(price)
            /*交通*/
            //345px 28个字
            var charNum = Math.floor((ul.width()-30)/(345.0/28))
            var traffic = house.traffic
            if (traffic != null && traffic != '') {
                var numbers = traffic.match(/[0-9]/g)
                var numberCount
                if (numbers != null) {
                    numberCount = numbers.length
                } else {
                    numberCount = 0
                }
                var signs = traffic.match(/[();]/g)
                var signCount
                if (signs != null) {
                    signCount = signs.length
                } else {
                    signCount = 0
                }
                if (traffic.length-numberCount/2-signCount/2 > charNum-1) {
                    var numberCount = traffic.slice(0,charNum-1).match(/[0-9]/g).length
                    var signCount = traffic.slice(0,charNum-1).match(/[();]/g).length
                    traffic = traffic.slice(0,charNum-1+numberCount/2+signCount/2) + '...'
                }
                var oTraffic = $("<div class='traffic'></div>");
                var icon = $("<span class='glyphicon glyphicon-map-marker'></span>")
                oTraffic.append(icon)
                li.append(oTraffic)
                var txt = $("<span></span>")
                txt.text(' '+traffic)
                oTraffic.append(txt)
            }

        }
        updateLayout()

        //点击cell查看房源详情
        $('.houseList>li').click(function () {
            var houseId = houses[$(this).index()].house_id
            location.href = 'm/detail.html?house_id=' + houseId
        })
    }



})

function reload() {

    location.href = getBasicSplitUrl();

}
function lookLastPage() {
    if (page == 1) {
        return
    }
    page--
    reloadWithPage()
}
function lookNextPage() {
    if ($('.btn-group button:last-child').hasClass('disabled')) {
        return
    }
    page++
    reloadWithPage()
}
function reloadWithPage() {

    var url = getBasicSplitUrl()
    if (url.length == basicUrl.length) {
        url = url + '?page='+page
    } else {
        url = url + '&page'+page
    }
    location.href = url
}

function getBasicSplitUrl() {
    var url = basicUrl
    //地址不为空
    if (getDistrict() != '') {
        url = url + '?district=' + getDistrict()
    }
    //地铁线不为空
    if (getSubway() != '') {
        if (url.length == basicUrl.length) {
            url = url + '?subway='+getSubway()
        } else {
            url = url + '&subway='+getSubway()
        }
    }
    //价格不为空
    if (getPrice() != '') {
        if (url.length == basicUrl.length) {
            url = url + '?price='+getPrice()
        } else {
            url = url + '&price='+getPrice()
        }
    }
    //出租方式不为空
    if (getRentMode() != '') {
        if (url.length == basicUrl.length) {
            url = url + '?rent_mode='+getRentMode()
        } else {
            url = url + '&rent_mode='+getRentMode()
        }
    }
    //房型不为空
    if (getStyle() != '') {
        if (url.length == basicUrl.length) {
            url = url + '?style='+getStyle()
        } else {
            url = url + '&style='+getStyle()
        }
    }
    //排序方式不为空且不为最新
    if (getSort() != '' && getSort() != "最新") {
        if (url.length == basicUrl.length) {
            url = url + '?sort='+getSort()
        } else {
            url = url + '&sort='+getSort()
        }
    }
    return url;
}

function getDistrict() {
    var txt = $('.show-area').text()
    if (txt == '区域' || txt == '不限') {
        return ''
    }
    return txt
}
function getSubway() {
    var txt = $('.show-subway').text()
    if (txt == '地铁' || txt == '不限') {
        return ''
    }
    return txt
}
function getPrice() {
    var txt = $('.show-price').text()
    if (txt == '租金' || txt == '不限') {
        return ''
    }
    return txt
}
function getRentMode() {
    var txt = $(".styleGroupList li span:first-child.selected").text()
    if (txt == '不限') {
        return ''
    }
    return txt
}
function getStyle() {
    var txt = $(".styleBg .styleList .styleEntiretyList li.selected span").text()
    if (txt == '不限') {
        return ''
    }
    return txt
}
function getSort() {
    var txt = $('.sortList li.selected').text()
    if (txt == null) {
        txt = ''
    }
    return txt
}

//排序的侧滑视图
var slideIsAnimating = false
function setSlideConfigure() {
    var sortBtn = $('#sortBtn')
    var slideMask = $('#slideMask')
    var slide = $('#slide')
    slideMask.height($(document).height()-44-49)
    slide.height($(document).height()-44-49)
    sortBtn.click(function () {
        if (slideIsAnimating) {return}
        var show = slideMask.css('display') == 'block'
        if (show) {
            hideSlide()
        } else {
            showSlide()
        }
    })
    slideMask.click(function () {
        hideSlide()
    })

    var sort = getParams('sort')
    if (sort == '' || sort == null) {
        sort = '最新'
    }

    $('.sortList li').each(function () {
        var that = $(this)
        if (that.text() == sort) {
            that.addClass('selected')
        }
    })

    $('.sortList li').click(function () {
        $('.sortList li').removeClass('selected')
        $(this).addClass('selected')
        hideSlide()
        reload()
    })
}

function showSlide() {
    slideIsAnimating = true
    var slideMask = $('#slideMask')
    var slide = $('#slide')
    slideMask.css('display','block')
    slide.css('display','block')
    slide.animate({width:'60%'},200);
    slideMask.animate({
        'opacity': .3,
        'filter': 'alpha(opacity=30)'
    },200,function () {
        slideIsAnimating = false
    })
    $(document).bind('touchmove',function (event) {
        event.preventDefault()
    })
}
function hideSlide() {
    slideIsAnimating = true
    var slideMask = $('#slideMask')
    var slide = $('#slide')
    slide.animate({width:'0'},200);
    slideMask.animate({
        'opacity': .0,
        'filter': 'alpha(opacity=60)'
    },200,function () {
        slideMask.css('display','none')
        slide.css('display','none')
        slideIsAnimating = false
    })
    $(document).unbind('touchmove')
}

