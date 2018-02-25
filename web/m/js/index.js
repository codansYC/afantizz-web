/**
 * Created by lekuai on 17/2/25.
 */

var houses = new Array()
var page = 1
// 请求参数
var districtCode = null
var minPrice = null
var maxPrice = null
var rentType = null
var subway = null
var sortType = null
const rentModes = ['合租','整租','公寓']
const roomTypes = ['主卧','次卧','隔断','床位']

$(function () {

    //监测屏幕滚动
    var headerH = $(".header").outerHeight();  //导航区域高度
    var searchH = $(".search").outerHeight();  //搜索区域高度
    var filterH = $(".filterCondition").outerHeight(); //筛选区域高度

    initViews()
    initData()
    initEvents()

    function initViews() {
        adjustFilterConditionPosition()
        setSlideConfigure()

        districtCode = getParams('district')
        subway = getParams('subway')
        minPrice = getParams('min_price')
        maxPrice = getParams('max_price')
        rentType = getParams('rent_type')
        var pageStr = getParams('page')
        if (districtCode == '' || districtCode == null) {
            $('.show-area').text('区域')
        } else {
            $('.areaList li').each(function () {
                if ($(this).data('code') == districtCode) {
                    console.log($(this).text())
                    $('.show-area').text($(this).text())
                }
            })
        }
        highlightDistrict(districtCode)

        if (subway == '' || subway == null || subway == '不限') {
            $('.show-subway').text('地铁')
        } else {
            $('.show-subway').text(subway)
        }
        highlightSubway(subway)

        if ((minPrice == '' || minPrice == null) && (maxPrice == '' || maxPrice == null)) {
            $('.show-price').text('租金')
        } else {
            if (minPrice == '' || minPrice == null) {
                $('.show-price').text(maxPrice+'以下')
            } else if (maxPrice == '' || maxPrice == null) {
                $('.show-price').text(minPrice+'以上')
            } else {
                $('.show-price').text(minPrice+'~'+maxPrice)
            }
        }
        highlightPrice(minPrice,maxPrice)

        switch (rentType) {
            case '1':
                $('.show-style').text('合租')
                break
            case '2':
                $('.show-style').text('整租')
                break
            case '3':
                $('.show-style').text('公寓')
                break
            default:
                $('.show-style').text('户型')
                break
        }
        highlightRentMode(rentType)

        if (pageStr == null) {
            page = 1
        } else {
            page = parseInt(pageStr)
        }


    }

    function initData() {
        requestData()
    }

    function initEvents() {
        $(window).scroll(function(event){
            adjustFilterConditionPosition()
        })

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
            districtCode = $(this).data('code')
            reload()
        });
        //处理租金选择
        $(".priceBg .priceList li").click(function (event) {
            //禁止事件冒泡
            event.stopPropagation();
            $(".priceBg .priceList li").removeClass("selected");
            $(this).addClass("selected");
            $('.show-price').text($(this).text())
            minPrice = $(this).data('min-price')
            maxPrice = $(this).data('max-price')
            reload()
        });
        //处理户型选择
        $(".styleBg .styleList li").click(function (event) {
            //禁止事件冒泡
            event.stopPropagation();
            $(".styleBg .styleList li").removeClass("selected");
            $(this).addClass('selected')
            $('.show-style').text($(this).text())
            rentType = $(this).data('type')
            reload()
        });
        //处理地铁选择
        $(".subwayBg .subwayList li").click(function (event) {
            //禁止事件冒泡
            event.stopPropagation();
            $(".subwayBg .subwayList li").removeClass("selected");
            $(this).addClass("selected");
            $('.show-subway').text($(this).text())
            subway = $(this).text()
            reload()
        });
    }

    //记录用户访问
    // record()

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

        switch (i) {
            case 0:
                highlightDistrict(getParams('district'))
                break
            case 1:
                highlightPrice(getParams('min_price'),getParams('max_price'))
                break
            case 2:
                highlightRentMode(getParams('rent_type'))
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
        adjustFilterConditionPosition()
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
    function adjustFilterConditionPosition() {

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


    //高亮选中区域
    function highlightDistrict(districtCode) {
        if (districtCode == null) {
            districtCode = ''
        }
        $(".areaBg .areaList li").each(function () {
            if ($(this).data('code') == districtCode) {
                $(this).addClass('selected')
            } else {
                $(this).removeClass('selected')
            }
        })
    }
    //高亮选中租金
    function highlightPrice(minPrice, maxPrice) {
        if (minPrice == null || minPrice == '') {
            minPrice = 0
        }
        if (maxPrice == null) {
            maxPrice = ''
        }
        $(".priceBg .priceList li").each(function () {
            console.log($(this).data('min-price'))
            if ($(this).data('min-price') == minPrice && $(this).data('max-price') == maxPrice) {
                $(this).addClass('selected')
            } else {
                $(this).removeClass('selected')
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
        if (mode == null) {
            mode = ''
        }
        $(".styleBg .styleList li").each(function () {
            if ($(this).data('type') == mode) {
                $(this).addClass('selected')
            } else {
                $(this).removeClass('selected')
            }
        })
    }

    //搜索事件的处理
    $('.search>input').click(function () {
        window.location.href = 'm/search.html'
    })


    //============================================
    function requestData() {
        //处理网络请求
        var params = {
            page: page
        }
        if (districtCode != null && districtCode != '') {
            params['district_code'] = districtCode
        }
        if (minPrice != null && minPrice != '') {
            params['min_price'] = minPrice
        }
        if (maxPrice != null && maxPrice != '') {
            params['max_price'] = maxPrice
        }
        if (rentType != null && rentType != '') {
            params['rent_type'] = rentType
        }
        if (subway != null && subway != '' && subway != '不限') {
            params['subway'] = subway
        }
        if (sortType != null && sortType != '') {
            params['sort_type'] = sortType
        }

        request('/house/list', params, function (resp) {
            houses = resp
            console.log(houses.length)
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
    }



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
            img.attr("src", house.image)
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
            rentModeDesc.text(rentModes[house.rent_type-1])
            rentMode.append(rentModeDesc)
            addressAndRentMode.append(rentMode)
            var tags = $("<div class='tags'></div>")
            desc.append(tags)
            //房间结构(几室几厅)
            var oStyle1 = $("<span class='mainStyle'></span>");
            oStyle1.text(house.room_num+'室'+house.hall_num+'厅')
            tags.append(oStyle1)
            //主卧或次卧
            if (house.rent_type == 1 && house.room_type != 0) {
                var oStyle2 = $("<span class='secondStyle'></span>");
                oStyle2.text(roomTypes[house.room_type-1])
                tags.append(oStyle2)
            }
            //独立卫生间
            if (house.is_toilet_single != 0) {
                var oToilet = $("<span class='toilet'></span>");
                oToilet.text('独卫')
                tags.append(oToilet)
            }
            //转租优惠
            if (house.is_benefit != 0) {
                var benefit = $("<span class='benefit'></span>")
                benefit.text('转租优惠')
                tags.append(benefit)
            }
            var priceAndDate = $("<div class='priceAndDate'></div>")
            desc.append(priceAndDate)
            //发布时间
            var releaseTime = $("<span class='releaseTime pull-right'></span>")
            releaseTime.text(house.date)
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
    if (districtCode != '' && districtCode != null) {
        url = url + '?district=' + districtCode
    }
    //地铁线不为空
    if (subway != '' && subway != null && subway != '不限') {
        if (url.indexOf('?')<0) {
            url = url + '?subway='+subway
        } else {
            url = url + '&subway='+subway
        }
    }
    //价格不为空
    if (minPrice != '' && minPrice != null) {
        if (url.indexOf('?')<0) {
            url = url + '?min_price='+minPrice
        } else {
            url = url + '&min_price='+minPrice
        }
    }
    if (maxPrice != '' && maxPrice != null) {
        if (url.indexOf('?')<0) {
            url = url + '?max_price='+maxPrice
        } else {
            url = url + '&max_price='+maxPrice
        }
    }
    //出租方式不为空
    if (rentType != '' && rentType != null) {
        if (url.indexOf('?')<0) {
            url = url + '?rent_type='+rentType
        } else {
            url = url + '&rent_type='+rentType
        }
    }

    //排序方式不为空且不为最新
    if (sortType != '' && sortType != null) {
        if (url.indexOf('?')<0) {
            url = url + '?sort_type='+sortType
        } else {
            url = url + '&sort_type'+sortType
        }
    }
    return url;
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

