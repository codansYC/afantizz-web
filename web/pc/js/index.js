/**
 * Created by lekuai on 16/12/18.
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

var cellW = 300
const rentModes = ['合租','整租','公寓']
const roomTypes = ['主卧','次卧','隔断','床位']
$(function () {

    var isLogin = getToken() != "" && getToken() != null;

    initData()
    initViews()
    initEvents()

    function initViews() {
        //根据登录态显示header
        if (isLogin) {
            var logoutLi = $("<li><div id='' class='header_menu_item'><a href='javascript:' id='resource-page-logout'>退出登录</a></div></li>");
            var memberLi = $("<li><div id='' class='header_menu_item'><a href='javascript:' id='to-memberCenter'>个人中心</a></div></li>");
            $("#header_menu_ul").prepend(logoutLi,memberLi);
            var loginLi = $("#resource-page-login");
            loginLi.remove();
            //获取用户信息
            getUserInfo();

            logoutLi.click(function () {
                logout(function (flag) {
                    location.reload();
                })
            })

            memberLi.click(function () {
                if (getToken() == "") {
                    location.reload();
                    return
                }
                location.href = "/pc/member.html";
            })
        }

        showHighlightFliter()
        showHighlightSort()
    }

    function initEvents() {
        //搜索
        handleSearchEvent()
        //筛选
        handleFilterEvent()
        //排序
        handleSortEvent()
    }

    function initData() {
        var search = getParams('search')
        if (search != null) {
            showSearchStateUI()
            $('#keyword-box').val(search)
            requestByKeyword(search)
            return
        }

        districtCode = getParams('district')
        subway = getParams('subway')
        minPrice = getParams('min_price')
        maxPrice = getParams('max_price')
        rentType = getParams('rent_type')
        sortType = getParams('sort_type')

        requestHouse();

    }

    //高亮筛选
    function showHighlightFliter() {

        if (districtCode != null) {
            $(".gio_district a").each(function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected')
                }
                if ($(this).data('code') == districtCode) {
                    $(this).addClass('selected')
                }
            })
        }

        if (subway != null) {
            $(".gio_subway a").each(function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected')
                }
                if ($(this).text() == subway) {
                    $(this).addClass('selected')
                }
            })
        }

        if (minPrice != null || maxPrice != null) {
            $(".gio_price a").each(function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected')
                }
                if ($(this).data('min_price') == minPrice || $(this).data('max_price') == maxPrice) {
                    $(this).addClass('selected')
                }
            })
        }

        if (rentType != null) {
            $(".gio_mode a").each(function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected')
                }
                if ($(this).data('type') == rentType) {
                    $(this).addClass('selected')
                }
            })
        }

    }

    //高亮排序
    function showHighlightSort() {
        if (sortType != null) {
            $('#sort-menu li a').each(function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected')
                }
                if ($(this).data('type') == sortType) {
                    $(this).addClass('selected')
                }
            })
        }
    }

    function handleSearchEvent() {
        $('#search').click(function () {
            var kw = $('#keyword-box').val()
            if (kw == null || kw == '') {
                location.href = getMainPath()
                return
            }
            location.href = getMainPath() + '?search=' + kw
        })
    }

    function handleFilterEvent() {
        $(".gio_district a").click(function () {
            $(".gio_district a.selected").removeClass("selected");
            $(this).addClass("selected");

            districtCode = $(this).data('code')
            if (districtCode === '') {
                districtCode = null
            }
            reloadWithNewItems()
        });

        $(".gio_subway a").click(function () {
            $(".gio_subway a.selected").removeClass("selected");
            $(this).addClass("selected");
            subway = $(this).text()
            if (subway === '') {
                subway = null
            }
            reloadWithNewItems()
        });

        $(".gio_price a").click(function () {
            $(".gio_price a.selected").removeClass("selected");
            $(this).addClass("selected");
            minPrice = $(this).data('min_price')
            maxPrice = $(this).data('max_price')
            if (minPrice === '') {
                minPrice = null
            }
            if (maxPrice === '') {
                maxPrice = null
            }
            reloadWithNewItems()
        });

        $(".gio_mode a").click(function () {
            $(".gio_mode a.selected").removeClass("selected");
            $(this).addClass("selected");
            rentType = $(this).data('type')
            if (rentType === '') {
                rentType = null
            }
            reloadWithNewItems()
        });

        //鼠标移入移出
        $(".filter a").hover(function () {
            if (!$(this).hasClass("selected")) {
                $(this).addClass("text_highlight");
            }
        },function () {
            $(this).removeClass("text_highlight");
        });
    }

    function handleSortEvent() {
        //排序 事件处理
        $('#sort-menu li a').hover(function () {
            if (!$(this).hasClass('selected')) {
                $(this).addClass('text_highlight')
            }
        },function () {
            $(this).removeClass('text_highlight')
        })

        $('#sort-menu li a').click(function () {
            $('#sort-menu li a.selected').removeClass('selected')
            $(this).addClass('selected')
            //排序
            sortType = $(this).data('type')
            reloadWithNewItems()
        });
    }

    //处于搜索状态时的页面
    function showSearchStateUI() {
        $('.filter,.sort').css('display','none')
        $('.look-more').css('visibility','hidden')
        $('.search-notice').css('display','block')
    }

    //处于列表状态时的页面
    function showListStateUI() {
        $('.filter,.sort').css('display','block')
        $('.look-more').css('visibility','visible')
        $('#keyword-box').val('')
        $('.search-notice').css('display','none')
    }

    //每个房源,鼠标移入时添加阴影效果,鼠标移除时去掉阴影效果
     function addShadowEffect() {
        $("#house_list li .house-info").hover(function () {
            $(this).addClass("shadow");
        },function () {
            $(this).removeClass("shadow");
        })
    }

    //查看转租优惠
    function controlLookBenefit() {
        $(".benefit").hover(function () {
            var benefitDesc = $(this).parents(".house-info").children(".benefit-desc");
            if (benefitDesc.is(":animated")) {
                benefitDesc.stop(true, false);
            }
            $(this).parents("li").children(".house-info").addClass("show-benefit");
            benefitDesc.slideDown(200)
        },function () {
            var benefitDesc = $(this).parents(".house-info").children(".benefit-desc");

            if (benefitDesc.is(":animated")) {
                benefitDesc.stop(true, false);
            }
            benefitDesc.slideUp(200,function () {
                $(this).parents("li").children(".house-info").removeClass("show-benefit");
            });

        })

    }

    //动态添加房源列表中的li标签
    function insertOneHouse(house) {

        var img = house.image
        var houseId = house.house_id + "";

        var oHouseUl = $("#house_list")
        var oLi = $("<li></li>");
        oHouseUl.append(oLi);

        var oHouseInfoDiv = $("<div></div>");
        oHouseInfoDiv.addClass("house-info");
        oLi.append(oHouseInfoDiv);
        var oPicPanelDiv = $("<div></div>");
        oPicPanelDiv.addClass("pic-panel");
        oHouseInfoDiv.append(oPicPanelDiv);
        var url = '/pc/detail.html?house_id='+houseId
        var oA = $("<a href='"+url+"' target='_blank'></a>");
        oPicPanelDiv.append(oA);
        var oImg =  $("<img alt=''>");
        oImg.attr('src',img);
        oA.append(oImg);
        var oIntro = $("<div></div>");
        oHouseInfoDiv.append(oIntro);
        oIntro.addClass("house-intro");
        /*标题*/
        var title = house.title
        var oTitleDiv = $("<div class='house-title'></div>");
        oTitleDiv.text(handleStr(title,16));
        oIntro.append(oTitleDiv)

        /*地址*/
        var oPlaceDiv = $("<div class='house-address'></div>");
        var fullAddress = house.district+"-"+house.address
        oPlaceDiv.text(handleStr(fullAddress,19));
        oIntro.append(oPlaceDiv)

        /*标签*/
        var oTags = $("<div class='tags'></div>");
        oIntro.append(oTags)
        //出租方式
        var oRentMode = $("<div class='house-rentMode'></div>");
        oRentMode.text(rentModes[house.rent_type-1])
        oTags.append(oRentMode)
        //房间结构(几室几厅)
        var oStyle = $("<div class='mainStyle'></div>");
        oStyle.text(house.room_num+'室'+house.hall_num+'厅')
        oTags.append(oStyle)
        //主卧或次卧
        if (house.rent_type == 1 && house.room_type != 0) {
            var oStyle = $("<div class='secondStyle'></div>");
            oStyle.text(roomTypes[house.room_type-1])
            oTags.append(oStyle)
        }
        //独立卫生间
        if (house.is_toilet_single != 0) {
            var oToilet = $("<div class='toilet'></div>");
            oToilet.text('独卫')
            oTags.append(oToilet)
        }

        /*价格*/
        var oPriceDiv = $("<div class='price'><span style='width: 15px;display: inline-block;'>¥</span></div>");
        var pSpan = $("<span></span>")
        oPriceDiv.append(pSpan)
        pSpan.text(house.price)
        oIntro.append(oPriceDiv);

        /*发布时间*/
        var oTimeDiv = $("<div class='release-time'></div>");
        oTimeDiv.text(house.date);
        oIntro.append(oTimeDiv);

        /*转租优惠*/
        if (house.is_benefit != 0) {
            var oBenefitA = $("<a>转租优惠</a>");
            oBenefitA.addClass("benefit");
            oBenefitA.attr("href","javascript:");
            oIntro.append(oBenefitA);
            var oBenefitDesc = $("<div class='benefit-desc'></div>");
            var p = $("<p></p>");
            p.text("");
            oBenefitDesc.append(p);
            oHouseInfoDiv.append(oBenefitDesc);
        }

        /*交通*/
        var oTraffic = $("<div class='traffic'></div>");
        oIntro.append(oTraffic)
        var traffic = house.traffic
        if (traffic != null && traffic != '') {
            oTraffic.text(' '+handleStr(traffic,23))
            var icon = $("<img src='/images/icon-gprs.png' style='display: inline-block;height: 10px;'/>")
            oTraffic.prepend(icon)
        }
    }

    var allHouse = new Array();
    //获取到数据后展示
    function loadHouse(houses) {
        for (var i=0; i<houses.length; i++) {
            var house = houses[i];

            insertOneHouse(house);
        }
        controlLookBenefit();
        addShadowEffect();
    }

    //点击查看更多房源
    $("#loadHouse").click(function () {
        reloadWithNewPage()

    })

    addShadowEffect();

    //处理发布房源的跳转
    $("#release-house").click(function () {
        location.href = "/pc/release.html";
    });

    function reloadWithNewItems() {
        page = 1
        location.href = getBasicSplitUrl()
    }
    function reloadWithNewPage() {
        page++
        requestHouse()
    }

    function getBasicSplitUrl() {
        var url = basicUrl
        //地址不为空
        if (districtCode != null) {
            url = url + '?district=' + districtCode
        }
        //地铁线不为空
        if (subway != null) {
            if (url.indexOf('?')<0) {
                url = url + '?subway='+subway
            } else {
                url = url + '&subway='+subway
            }
        }
        //价格不为空
        if (minPrice != null) {
            if (url.indexOf('?')<0) {
                url = url + '?min_price='+minPrice
            } else {
                url = url + '&min_price='+minPrice
            }
        }
        if (maxPrice != null) {
            if (url.indexOf('?')<0) {
                url = url + '?max_price='+maxPrice
            } else {
                url = url + '&max_price='+maxPrice
            }
        }
        //出租方式不为空
        if (rentType != null) {
            if (url.indexOf('?')<0) {
                url = url + '?rent_type='+rentType
            } else {
                url = url + '&rent_type='+rentType
            }
        }

        //排序方式不为空且不为最新
        if (sortType != null) {
            if (url.indexOf('?')<0) {
                url = url + '?sort_type='+sortType
            } else {
                url = url + '&sort_type'+sortType
            }
        }
        return url;
    }


    /*----------------------------------------------------------------*/

    //请求房源
    function requestHouse() {

        //处理网络请求
        var params = {
            page: page
        }
        if (districtCode != null) {
            params['district_code'] = districtCode
        }
        if (minPrice != null) {
            params['min_price'] = minPrice
        }
        if (maxPrice != null) {
            params['max_price'] = maxPrice
        }
        if (rentType != null ) {
            params['rent_type'] = rentType
        }
        if (subway != null) {
            params['subway'] = subway
        }
        if (sortType != null) {
            params['sort_type'] = sortType
        }

        request(basicUrl + "house/list", params, function (resp) {
            showListStateUI()
            if (jQuery.isEmptyObject(resp) && page > 1) {
                showModel('亲,没有更多房源了~')
                return
            }
            loadHouse(resp);

        })
    }


    //关键字搜索
    function requestByKeyword(keyword) {
        var params = {
            keyword: keyword
        }
        request(basicUrl + "house/search",params,function (houses) {
            var allHouse = houses;

            var desc
            if (houses.length>0) {
                desc = "搜索"+"“"+keyword+"”"+"找到以下房源或者相关房源"
            } else {
                desc = "搜索"+"“"+keyword+"”"+"没有找到结果"
            }
            $(".search-notice").text(desc)
            //调整视图
            showSearchStateUI()
            loadHouse(allHouse);
        })
    }


});





