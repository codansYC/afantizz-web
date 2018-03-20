/**
 * Created by lekuai on 16/12/18.
 */

var page = 1
var cellW = 300
$(function () {

    //记录用户访问
    // record()

    var isLogin = getToken() != "" && getToken() != null;

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

    //搜索
    $('#search').click(function () {
        var kw = $('#keyword-box').val()
        if (kw == null || kw == '') {
            location.href = getMainPath()
            return
        }
        location.href = getMainPath() + '?search_keyword=' + kw
    })

    if (getParams('search_keyword') == null) {

        requestHouse();
    } else {
        showSearchStateUI()
        $('#keyword-box').val(getParams('search_keyword'))
        showSelectedTypes('','','','','')
        requestByKeyword(getParams('search_keyword'))
    }

    //筛选
    //鼠标点击
    $(".gio_district a").click(function () {
        $(".gio_district a.selected").removeClass("selected");
        $(this).addClass("selected");
        reloadWithNewItems('district')
    });

    $(".gio_subway a").click(function () {
        $(".gio_subway a.selected").removeClass("selected");
        $(this).addClass("selected");
        reloadWithNewItems('subway')
    });

    $(".gio_price a").click(function () {
        $(".gio_price a.selected").removeClass("selected");
        $(this).addClass("selected");
        reloadWithNewItems('price')
    });

    $(".gio_houselayout a").click(function () {
        $(".gio_houselayout a.selected").removeClass("selected");
        $(this).addClass("selected");
        reloadWithNewItems('style')
    });

    $(".gio_mode a").click(function () {
        $(".gio_mode a.selected").removeClass("selected");
        $(this).addClass("selected");
        reloadWithNewItems('rent_mode')
    });

    //鼠标移入移出
    $(".filter a").hover(function () {
        if (!$(this).hasClass("selected")) {
            $(this).addClass("text_highlight");
        }
    },function () {
        $(this).removeClass("text_highlight");
    });

    //每个房源,鼠标移入时添加阴影效果,鼠标移除时去掉阴影效果
     function addShadowEffect() {
        $("#house_list li .house-info").hover(function () {
            $(this).addClass("shadow");
        },function () {
            $(this).removeClass("shadow");
        })
    }

    //高亮当前排序方式
    if (getParams('sort') == null) {
        $('#sort-menu li:first-child a').addClass('selected')
    } else {
        $('#sort-menu li a').each(function () {
            if ($(this).text() == getParams('sort')) {
                $(this).addClass('selected')
            }
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

        var img = imageUrl + house.images[0]
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
        oRentMode.text(house.rent_mode)
        oTags.append(oRentMode)
        //房间结构(几室几厅)
        if (house.style != null || house.style != '') {
            var mainStyle = house.style.split('厅')[0] + '厅'
            var oStyle = $("<div class='mainStyle'></div>");
            oStyle.text(mainStyle)
            oTags.append(oStyle)
        }
        //主卧或次卧
        if (house.rent_mode == '合租') {
            var secondStyle = house.style.slice(-2)
            var oStyle = $("<div class='secondStyle'></div>");
            oStyle.text(secondStyle)
            oTags.append(oStyle)
        }
        //独立卫生间
        if (house.facilities.indexOf('独立卫生间') > -1) {
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
        oTimeDiv.text(house.release_date);
        oIntro.append(oTimeDiv);

        /*转租优惠*/
        if (house.benefit != "" && house.benefit != null) {
            var oBenefitA = $("<a>转租优惠</a>");
            oBenefitA.addClass("benefit");
            oBenefitA.attr("href","javascript:");
            oIntro.append(oBenefitA);
            var oBenefitDesc = $("<div class='benefit-desc'></div>");
            var p = $("<p></p>");
            p.text(house.benefit);
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
        // addShadowEffect()

    })

    addShadowEffect();

    //排序 事件处理
    $('#sort-menu li a').hover(function () {
        if (!$(this).hasClass('selected')) {
            $(this).addClass('text_highlight')
        }
    },function () {
        $(this).removeClass('text_highlight')
    })

    $('#sort-menu li a').click(function () {
        $('#sort-menu li a').removeClass('selected')
        $(this).addClass('selected')
        //排序
        sortByType($(this).text())
    });

    //处理发布房源的跳转
    $("#release-house").click(function () {
        location.href = "/pc/release.html";
    });

    function reloadWithNewItems(key) {
        page = 1
        reload(key)
    }
    function reloadWithNewPage() {
        page++
        requestHouse()
    }
    //根据筛选类型获取房源
    /*
     区域      key district
     地铁      key subway
     价格      key price
     房型      key style
     出租方式  key rent_mode
     * */
    function reload(key) {

        var all = '不限';
        var district = $(".gio_district a.selected").text()
        var subway = $(".gio_subway a.selected").text()
        var price = $(".gio_price a.selected").text()
        var style = $(".gio_houselayout a.selected").text()
        var rent_mode = $(".gio_mode a.selected").text()
        var url = getMainPath()
        var subUrl = ''
        if (district != all && (key == 'district' || getParams('district') != null)) {
            subUrl += ('district='+district)
        }
        if (subway != all && (key == 'subway' || getParams('subway') != null)) {
            if (subUrl != '') {
                subUrl += '&'
            }
            subUrl += ('subway='+subway)
        }

        if (price != all && (key == 'price' || getParams('price') != null)) {
            if (subUrl != '') {
                subUrl += '&'
            }
            subUrl += ('price='+price)
        }
        if (style != all && (key == 'style' || getParams('style') != null)) {
            if (subUrl != '') {
                subUrl += '&'
            }
            subUrl += ('style='+style)
        }
        if (rent_mode != all && (key == 'rent_mode' || getParams('rent_mode') != null)) {
            if (subUrl != '') {
                subUrl += '&'
            }
            subUrl += ('rent_mode='+rent_mode)
        }

        if (subUrl != '') {
            url += ("?"+subUrl)
        } else {
            // url += "?"
        }

        location.href = url;

    }
    /*----------------------------------------------------------------*/

//请求房源
    function requestHouse() {
        var district = getParams('district')
        var subway = getParams('subway')
        var price = getParams('price')
        var style = getParams('style')
        var rent_mode = getParams('rent_mode')
        var sort = getParams('sort')
        var params = {
            token: getToken(),
            district: district,
            subway: subway,
            price: price,
            style: style,
            rent_mode: rent_mode,
            sort: sort,
            page: page
        }
        request(basicUrl + "house/list", params, function (resp) {
            showSelectedTypes(district, subway, price, style, rent_mode);
            showListStateUI()
            if (jQuery.isEmptyObject(resp) && page > 1) {
                showModel('亲,没有更多房源了~')
                return
            }
            loadHouse(resp);

        })
    }

    //显示选中类型
    function showSelectedTypes(district,subway,price,style,rent_mode) {
        var all = '不限'
        var allDistrict
        $(".gio_district a").each(function () {
            if ($(this).text() == district) {
                $(this).addClass('selected')
            }
            if ($(this).text() == all) {
                allDistrict = $(this)
            }
        })
        if ($(".gio_district a.selected").length == 0) {
            allDistrict.addClass('selected')
        }

        var allSubway
        $(".gio_subway a").each(function () {
            if ($(this).text() == subway) {
                $(this).addClass('selected')
            }
            if ($(this).text() == all) {
                allSubway = $(this)
            }
        })
        if ($(".gio_subway a.selected").length == 0) {
            allSubway.addClass('selected')
        }

        var allPrice
        $(".gio_price a").each(function () {
            if ($(this).text() == price) {
                $(this).addClass('selected')
            }
            if ($(this).text() == all) {
                allPrice = $(this)
            }
        })
        if ($(".gio_price a.selected").length == 0) {
            allPrice.addClass('selected')
        }

        var allStyle
        $(".gio_houselayout a").each(function () {
            if ($(this).text() == style) {
                $(this).addClass('selected')
            }
            if ($(this).text() == all) {
                allStyle = $(this)
            }
        })
        if ($(".gio_houselayout a.selected").length == 0) {
            allStyle.addClass('selected')
        }

        var allMode
        $(".gio_mode a").each(function () {
            if ($(this).text() == rent_mode) {
                $(this).addClass('selected')

            }
            if ($(this).text() == all) {
                allMode = $(this)
            }
        })
        if ($(".gio_mode a.selected").length == 0) {
            allMode.addClass('selected')
        }
    }

    //关键字搜索
    function requestByKeyword(keyword) {
        var params = {
            search_keyword: keyword
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

     //排序
     function sortByType(type) {
         var href = location.href
         var url
         if (getParams('sort') == null) {
             if (href.indexOf("?") > -1 && href.indexOf("?_") <= -1) {
                 url = href + '&sort=' + type
             } else  {
                 url = getMainPath() + '?sort=' + type
             }
         } else {
             var hrefStr = decodeURIComponent(href);
             url = (hrefStr.replace(/最新|价格|面积|入住时间/,type))
         }

         location.href = url

     }


});


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





