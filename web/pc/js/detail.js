/**
 * Created by lekuai on 17/1/9.
 */

var house

$(function () {

    handleLoginState();

    //房源id
    var houseId = parseInt(getParams("house_id"));
    //根据houseId获取房源详情
    requestHouseDetail(houseId);

    //获取房源详情
    function requestHouseDetail(houseId) {
        $('.footer').css('display','none')
        var params = {
            house_id: houseId,
            token: getToken()
        }
        request("/house/info",params,function (resp) {
            $('.detail-content').css('display','block')
            $('.footer').css('display','block')
            house = resp
            loadHouseDetailInfo(house);

        })
    }

    var originImages = new Array()
    var thumbImages = new Array()
    //展示房源详情
    function loadHouseDetailInfo(house) {
        //标题
        var title = house.title
        // '转租芦恒路三室一厅主卧,精装修,近地铁站'
        $('.title').text(title);
        //地址
        $('.address').text(house.district + '-' + house.address)
        //小区
        if (house.village != null && house.village != '' && house.village != '未知') {
            $('.village').text(house.village)
        }
        $('.date').text('最后更新 '+house.date);
        //图片
        var bigImgUl = $('#big-img-ul');
        var smallImgUl = $('#small-img-ul');
        var originImgBg = $('#zz-images .images-content');
        for (var i = 0; i < house.images.length; i++) {
            var image = house.images[i];
            originImages[i] = image.origin_url
            thumbImages[i] = image.thumb_url;
        }
        for (var i=0; i<thumbImages.length; i++) {
            var bigImg = $('<img/>');
            bigImg.attr('src',imageUrl+thumbImages[i]);
            var bigLi = $('<li></li>').append(bigImg);
            bigImgUl.append(bigLi);
            var smallImg = $('<img/>');
            smallImg.attr('src',imageUrl+thumbImages[i]);
            var smallLi = $('<li></li>').append(smallImg);
            smallImgUl.append(smallLi);
            var originImg = $('<img/>');
            originImg.attr('src',imageUrl+originImages[i]);
            originImgBg.append(originImg);
        }
        //租金
        if (house.price > 0) {
            $('.price').text(house.price);
        } else {
            $('.price').text("面议");
        }
        //付款方式
        var payMode = house.pay_mode
        if (payMode.indexOf('押') < 0) {
            payMode = '付款方式'+ payMode
        }
        $('.pay-mode').text(payMode)
        //出租方式
        $('.rent-mode-desc').text(house.rent_mode)
        if (house.rent_mode == '合租') {
            var roomType = house.style.slice(-2)
            $('.room-type').text(roomType)
        }
        //房间户型
        var mainStyle = '房间户型未知'
        if (house.style.indexOf('厅') > -1) {
            mainStyle = house.style.split('厅')[0] + '厅'
        }
        $('.mainStyle').text(mainStyle)
        //面积
        if (house.area > 0) {
            $('.area').text(house.area+'m²')
        } else {
            $('.area').css('display','none')
        }
        //卫生间情况
        if (house.facilities.indexOf('独立卫生间') > -1){
            $('.toilet').text('独立卫生间')
        } else {
            $('.toilet').css('display','none')
        }
        //厨房情况
        if (house.facilities.indexOf('可做饭') > -1) {
            $('.kitchen').text('可做饭')
        } else {
            $('.kitchen').css('display','none')
        }
        //楼层
        if (house.floor == null || house.floor == '') {
            $('.floor').text('未知楼层')
        } else {
            if (house.max_floor == null || house.max_floor == '') {
                $('.floor').text('第' + house.floor + '层')
            } else {
                $('.floor').text('第' + house.floor + '层' + '/' + '共' + house.max_floor + '层')
            }
        }
        //朝向
        $('.orientation').text(house.orientation)
        //入住
        $('.usable-date-desc').text(house.usable_date)
        //到期
        var deadlineDate = house.deadline_date
        if (deadlineDate == null || deadlineDate == '') {
            deadlineDate = '请咨询联系人'
        }
        $('.deadline-date-desc').text(deadlineDate)
        //交通
        $('.traffic').text(house.traffic)
        var lookMapA = $("<a href='javascript:lookMap()' class='look-map'>查看地图</a>")
        $('.traffic').append(lookMapA)
        if (house.traffic != null && house.traffic != '') {
            lookMapA.css('margin-left','20px')
        }
        //电话
        if (house.phone == null || house.phone == '') {
            $('.contact-phone').css('display','none')
        } else {
            $('.contact-phone .numberBg').text(house.phone)
        }
        //微信
        if (house.wx == null || house.wx == '') {
            $('.contact-wx').css('display','none')
        } else {
            $('.contact-wx .numberBg').text(house.wx)
        }
        //QQ
        if (house.qq == null || house.qq == '') {
            $('.contact-qq').css('display','none')
        } else {
            $('.contact-qq .numberBg').text(house.qq)
        }
        //联系人
        if (house.contact == null || house.contact == '') {
            $('.contact-owner').css('display','none')
        } else {
            $('.contact-owner .numberBg').text(house.contact)
        }

        var otherInfoMenu = $('#other-info-menu');
        var menuItemsUl = $('#menu-items-container .menu-items');
        if (house.benefit != "" && house.benefit != 'undefined') {
            var benefitLi = $("<li id='menu-benefit'><a href='javascript:' class='selected'>转租优惠</a></li>");
            otherInfoMenu.append(benefitLi);
        }
        if (house.house_desc != "" && house.house_desc != 'undefined') {
            var houseDescLi = $("<li id='menu-desc'><a href='javascript:'>房源描述</a></li>");
            otherInfoMenu.append(houseDescLi);
        }
        var facilityLi = $("<li id='menu-facility'><a href='javascript:'>房间配置</a></li>");
        otherInfoMenu.append(facilityLi);
        if (house.images.length > 0) {
            var imagesLi = $("<li id='menu-images'><a href='javascript:'>房间图片</a></li>");
            otherInfoMenu.append(imagesLi);
        }
        var mapLi = $("<li id='menu-map'><a href='javascript:'>附近设施</a></li>");
        otherInfoMenu.append(mapLi);

        if (house.house_desc != "" && house.house_desc != 'undefined') {
            var houseDescLi = $("<li id='zz-desc'><div class='desc-title'>房源描述</div><div class='zz-line'></div>");
            var houseDescDiv = $("<div class='desc-content'></div>");
            houseDescLi.append(houseDescDiv);
            houseDescDiv.text(house.house_desc);
            menuItemsUl.prepend(houseDescLi);
        }

        if (house.benefit != "" && house.benefit != 'undefined') {
            var benefitDescLi = $("<li id='zz-benefit'><div class='benefit-title'>转租优惠</div><div class='zz-line'></div>");
            var benefitDescDiv = $("<div class='benefit-content'></div>");
            benefitDescLi.append(benefitDescDiv);
            benefitDescDiv.text(house.benefit);
            menuItemsUl.prepend(benefitDescLi);
        }

        // 房间设施
        var facilities = house.facilities
        for (var i=0; i<facilities.length; i++) {
            $('#zz-facility ul li p').each(function () {
                if ($(this).text() == facilities[i]) {
                    $(this).parent().css('display','block');
                }
            })
        }

        //图片
        if (house.images.length == 0) {
            $("#zz-images").remove()
        }


        var collection = $("#collection");
        //是否关注
        if (house.isCollection) {
            collection.text("取消关注");
            collection.css({
                "background-color":"#E0E0E0",
                "color":"#A8A8A8",
                "visibility":"visible"
            })
        } else {
            collection.text("关注");
            collection.css({
                "background-color":"#34c86c",
                "color":"white",
                "visibility":"visible"
            })
        }

        handleEvents();

    }
    /*
    function loadHouseDetailInfo(house) {
        var title = '转租芦恒路三室一厅主卧,精装修,近地铁站'
        $('.title').text(title);
        $('.date').text('发布时间 '+house.release_date);
        var bigImgUl = $('#big-img-ul');
        var smallImgUl = $('#small-img-ul');
        var originImgBg = $('#zz-images .images-content');
        for (var i = 0; i < house.images.length; i++) {
            var image = house.images[i];
            originImages[i] = image.origin_url
            thumbImages[i] = image.thumb_url;
        }
        for (var i=0; i<thumbImages.length; i++) {
            var bigImg = $('<img/>');
            bigImg.attr('src',imageUrl+originImages[i]);
            var bigLi = $('<li></li>').append(bigImg);
            bigImgUl.append(bigLi);
            var smallImg = $('<img/>');
            smallImg.attr('src',imageUrl+thumbImages[i]);
            var smallLi = $('<li></li>').append(smallImg);
            smallImgUl.append(smallLi);
            var originImg = $('<img/>');
            originImg.attr('src',imageUrl+originImages[i]);
            originImgBg.append(originImg);
        }
        if (house.price > 0) {
            $('.price').text(house.price+'元/月');
        } else {
            $('.price').text("面议");
        }
        $('.style').text(house.rent_mode+'|'+house.style);
        $('#house-address-desc').text(house.address);
        var village = house.village
        if (village == '' || village == null) {
            village = '未知'
        }
        $('.village').text(village);
        $('.usable-date-desc').text(house.usable_date);
        var deadlineDate = house.deadline_date
        if (deadlineDate == '' || deadlineDate == null) {
            deadlineDate = '未知'
        }
        $('.deadline-date-desc').text(deadlineDate);

        var otherInfoMenu = $('#other-info-menu');
        var menuItemsUl = $('#menu-items-container .menu-items');
        if (house.benefit != "" && house.benefit != 'undefined') {
            var benefitLi = $("<li id='menu-benefit'><a href='javascript:' class='selected'>转租优惠</a></li>");
            otherInfoMenu.append(benefitLi);
        }
        if (house.house_desc != "" && house.house_desc != 'undefined') {
            var houseDescLi = $("<li id='menu-desc'><a href='javascript:'>房源描述</a></li>");
            otherInfoMenu.append(houseDescLi);
        }
        var facilityLi = $("<li id='menu-facility'><a href='javascript:'>房间配置</a></li>");
        otherInfoMenu.append(facilityLi);
        if (house.images.length > 0) {
            var imagesLi = $("<li id='menu-images'><a href='javascript:'>房间图片</a></li>");
            otherInfoMenu.append(imagesLi);
        }
        var mapLi = $("<li id='menu-map'><a href='javascript:'>附近设施</a></li>");
        otherInfoMenu.append(mapLi);

        if (house.house_desc != "" && house.house_desc != 'undefined') {
            var houseDescLi = $("<li id='zz-desc'><div class='desc-title'>房源描述</div><div class='zz-line'></div>");
            var houseDescDiv = $("<div class='desc-content'></div>");
            houseDescLi.append(houseDescDiv);
            houseDescDiv.text(house.house_desc);
            menuItemsUl.prepend(houseDescLi);
        }

        if (house.benefit != "" && house.benefit != 'undefined') {
            var benefitDescLi = $("<li id='zz-benefit'><div class='benefit-title'>转租优惠</div><div class='zz-line'></div>");
            var benefitDescDiv = $("<div class='benefit-content'></div>");
            benefitDescLi.append(benefitDescDiv);
            benefitDescDiv.text(house.benefit);
            menuItemsUl.prepend(benefitDescLi);
        }

        $('.phone-no a').text(house.phone);
        $('.phone-owner span').text(house.contact);
        $('.wx-no span').text(house.wx);
        $('.qq-no span').text(house.qq)
        if (house.phone == null || house.phone == '') {
            $(".phone-icon,.phone-no").css('display','none')
        }
        if (house.contact == null || house.contact == '') {
            $(".phone-owner").css('display','none')
        }
        if ((house.phone == null || house.phone == '') && (house.contact == null || house.contact == '')) {
            $(".contact-phone").css('display','none')
        }
        if (house.wx == null || house.wx == '') {
            $(".contact-wx").css('display','none')
        }
        if (house.qq == null || house.qq == '') {
            $(".contact-qq").css('display','none')
        }
        // 房间设施

        var facilities = house.facilities.split(";");
        for (var i=0; i<facilities.length; i++) {
            $('#zz-facility ul li p').each(function () {
                if ($(this).text() == facilities[i]) {
                    $(this).parent().css('display','block');
                }
            })
        }

        //图片
        if (house.images.length == 0) {
            $("#zz-images").remove()
        }


        var collection = $("#collection");
        //是否关注
        if (house.isCollection) {
            collection.text("取消关注");
            collection.css({
                "background-color":"#E0E0E0",
                "color":"#A8A8A8",
                "visibility":"visible"
            })
        } else {
            collection.text("关注");
            collection.css({
                "background-color":"#34c86c",
                "color":"white",
                "visibility":"visible"
            })
        }

        handleEvents();

    }
    */
    //处理交互事件
    function handleEvents() {
        handleImagesChange();
        handleOtherInfoMenuEvent();
        handleNavEvent();
        handleMapEvent();
        startLocating(house.address);
    }

    //处理图片切换的逻辑
    function handleImagesChange() {
        //大图片指示按钮的hover
        $("#big-img-left-slide").hover(function () {
            if ($(this).is(":animated")) {
                $(this).stop(true, false).fadeTo("fast", "0.5");
            } else {
                $(this).fadeTo("fast", "0.5");
            }
        },function () {
            $(this).fadeTo("fast", "0");
        })
        $("#big-img-right-slide").hover(function () {
            if ($(this).is(":animated")) {
                $(this).stop(true, false).fadeTo("fast", "0.5");
            } else {
                $(this).fadeTo("fast", "0.5");
            }
        },function () {
            $(this).fadeTo("fast", "0");
        })

        $("#big-img-left-slide").click(function () {
            slideLeftLookBigImg();
        });
        $("#big-img-right-slide").click(function () {
            slideRightLookBigImg();
        })

        showBigImageWithIndex();

        //点击小图向左的指示器
        $('#small-img-left-slide').click(function () {
            if (!clickEnable) {
                return
            }
            avoidContinuousClick()
            slideLeftLookBigImg()
        })

        //点击小图向右的指示器
        $('#small-img-right-slide').click(function () {
            if (!clickEnable) {
                return
            }
            avoidContinuousClick()
            slideRightLookBigImg()
        })
        //点击小图片
        $("#small-img-ul").find('li').click(function () {
            if (!clickEnable) {
                return
            }
            avoidContinuousClick()
            imageIndex = $(this).index()
            changeCurrentImg();
        })
    }

    //处理优惠条件、房间描述的事件
    function handleOtherInfoMenuEvent() {
        //处理优惠条件、房间描述等分类hover事件
        $("#other-info-menu li a").hover(function () {
            if (!$(this).hasClass("selected")) {
                $(this).addClass("hover")
            }
        },function () {
            $(this).removeClass("hover")
        })

    }

    //处理地图相关的逻辑
    function handleMapEvent() {
        var showSearchBox = function () {
            var searchBox = $("#zz-map .search-poi .poi-search-box");
            var cancelBtn = $("#cancel-search");
            var kwInput = $("#poi-kw-input");

            searchBox.animate({
                width: '320px'
            },200);
            cancelBtn.css('visibility','visible');
            kwInput.css('padding','0px 10px');

            $("#poi-search-show").css({
                "color": "transparent",
                "background":"#34c86c url('/images/search.png') no-repeat",
                "background-position": "center"
            })

        };

        var hidSearchBox = function () {
            var searchBox = $("#zz-map .search-poi .poi-search-box");
            var cancelBtn = $("#cancel-search");
            var kwInput = $("#poi-kw-input");
            searchBox.animate({
                width: '0px'
            },200);
            cancelBtn.css('visibility','hidden');
            kwInput.css('padding','0px 0px');
            $("#poi-search-show").css({
                "color": "white",
                "background":"#34c86c",
                "background-position": "center"

            })
        };

        $("#poi-search-show").click(function () {
            if (searchEnable) {
                search();
            } else {
                searchEnable = true;
                showSearchBox();
            }
        });

        $("#poi-search-show").click(function () {
            if ($("#zz-map .search-poi .poi-search-box").hasClass("show")) {

            }

        })

        //处理键盘事件
        $(document).keydown(function(event){
            if (!searchEnable) { return }
            if ($("#poi-kw-input").is(":focus")) {
                //处理按下enter键
                if (event.keyCode == "13") {
                    search()
                }
            }
        });

        $("#cancel-search").click(function () {
            searchEnable = false
            $("#poi-kw-input").val("")
            hidSearchBox();
        });

        function search() {
            var kw = $("#poi-kw-input").val()
            if (kw == "") {return}
            $().keywordSearch(kw)
        }

        $("#poi-cate").children("li").click(function () {
            $("#poi-cate").children("li").removeClass("poi-cate-select")
            $(this).addClass("poi-cate-select")
            switch ($(this).index()) {
                case 0:
                    $().searchNearByType('交通设施服务');
                    break;
                case 1:
                    $().searchNearByType('餐饮服务');
                    break;
                case 2:
                    $().searchNearByType('购物服务');
                    break;
                case 3:
                    $().searchNearByType('医疗保健服务');
                    break;
                default:
                    break
            }
        });
    }

    //根据登录态显示header
    function handleLoginState() {
        var isLogin = getToken() != "";
        if (isLogin) {
            var memberLi = $("<li><div class='header_menu_item'><a href='/pc/member.html' id='to-memberCenter'>个人中心</a></div></li>");
            $("#header_menu_ul").prepend(memberLi);
            getUserInfo();
        }
    }


    //看图控制
    var imageIndex = 1  //当前显示图片的下标
    var imagesCount = function () {
        return $("#big-img-ul").find("img").length
    }
    // 根据下标展示当前大图
    function showBigImageWithIndex() {
        var big_oUl = $("#big-img-ul")
        var bigImgW = big_oUl.find("img").first().width()
        //给大图的背景设置宽度
        var big_oUlW = bigImgW * imagesCount() + "px"
        big_oUl.css('width',big_oUlW)
        var small_oUl = $("#small-img-ul")
        var smallImgW = small_oUl.find("img").first().width()
        //给小图背景设置宽度
        var small_oUlW = (smallImgW+5) * imagesCount() + "px"
        small_oUl.css('width',small_oUlW)
        var originLeft = big_oUl.position().left;
        if (imagesCount()==1) {
            imageIndex = 0;
        }
        var currentLeft = originLeft - bigImgW*imageIndex + "px";
        big_oUl.css('left',currentLeft)
        renderBorderWithCurrentSmallImg()
    }
    //给当前小图加上边框
    function renderBorderWithCurrentSmallImg() {
        $("#small-img-ul").children('li').children('img').removeClass('current')
        var currentSmallImg = $("#small-img-ul").children('li:nth-child(' + (imageIndex+1) + ')').children('img')
        currentSmallImg.addClass('current')
    }

    //向左滑动看大图片
    function slideLeftLookBigImg() {
        imageIndex++
        if (imageIndex == imagesCount()) {
            imageIndex = 0
        }
        changeCurrentImg()

    }

    //向右滑动看大图片
    function slideRightLookBigImg() {
        imageIndex--
        if (imageIndex == -1) {
            imageIndex = imagesCount()-1
        }
        changeCurrentImg()

    }
    //切换当前图片
    function changeCurrentImg() {
        changeCurrentBigImg()
        renderBorderWithCurrentSmallImg()
        changeCurrentSmallImg()
    }
    //切换当前大图
    function changeCurrentBigImg() {
        var oUl = $("#big-img-ul");
        var imgW = oUl.find("img").first().width();
        var currentLeft = -imageIndex*imgW
        oUl.animate({left: currentLeft},300)

    }
    //切换当前小图
    function changeCurrentSmallImg() {

        if (imagesCount() < 5) {return}  //图片不能铺满直接return

        var oUl = $("#small-img-ul")
        var imgW = oUl.find("img").width()
        var offsetImgCount = -oUl.position().left / (imgW + 5)
        if (imagesCount()-offsetImgCount > 4) {
            if (imageIndex == 0 || imageIndex == 1) {return}
            var currentLeft = oUl.position().left-(imgW+5)
            oUl.animate({left: currentLeft},300)
        } else {
            if (offsetImgCount > 0 && imageIndex<offsetImgCount+1) {
                var currentLeft = oUl.position().left + (imgW + 5)
                oUl.animate({left: currentLeft}, 300)
            }
        }
        
    }

    //防止图片或图片切换指示器的的连续点击
    var clickEnable = true
    function avoidContinuousClick() {
        clickEnable = false
        setTimeout(function () {
            clickEnable = true
        },305)
    }

    //附近设施部分
    $("#zz-map .map-content .info-content ul.poi-cate>li").click(function () {
        $("#zz-map .map-content .info-content ul.poi-cate>li").removeClass("poi-cate-select");
        $(this).addClass("poi-cate-select");
    });

    //是否可以点击搜索
    var searchEnable = false

    //处理收藏与取消收藏
    $("#collection").click(function () {
        var that = $(this);
        var isLogin = getToken() != ""
        if (!isLogin) {
            showLoginPage();
            return
        }

        if (that.text() == "关注") {
            reportCollectionState(1,function (flag) {
                that.text("取消关注");
                that.css({
                    "background-color":"#E0E0E0",
                    "color":"#A8A8A8"
                })
            });

        } else {
            reportCollectionState(0,function (flag) {
                that.text("关注");
                that.css({
                    "background-color":"#34c86c",
                    "color":"white"
                })
            });
        }
    });


    //处理举报
    var accusationHoverTimer
    $("#accusation").hover(function () {
        clearTimeout(accusationHoverTimer)
        showAccusationList($(this));
        var accusationList = $(".accusationList")
        accusationList.hover(function () {
            clearTimeout(accusationHoverTimer);
        },function () {
            accusationHoverTimer = setTimeout(function () {
                removeAccusationList();
            },30)
        });
        //举报
        $(".accusationList li a").click(function () {
            accusate(getParams('house_id'),$(this).text())
        })
    }, function () {
        accusationHoverTimer = setTimeout(function () {
            removeAccusationList();
        },30)
    });




});

function handleNavEvent() {
    /************************
     内容导航
     *************************/
    var menuContiner = $("#other-info-menu-container");

    var navTop = menuContiner.position().top;
    var navLeft = menuContiner.offset().left;
    var navWidth = menuContiner.width();
    var navHeight = menuContiner.outerHeight();
    console.log(navHeight)
    var menuUl = $("#other-info-menu");
    var moduleList = [];
    $("#menu-items-container>ul>li").each(function(){
        moduleList.push($(this).attr("id"));
    });

    adjustNavPosition();
    //监测页面滚动
    $(window).scroll(function(event){
        adjustNavPosition();
    });

    //调整导航栏的位置
    function adjustNavPosition() {
        if ($(document).scrollTop() >= navTop) {
            menuContiner.css({
                "position": "fixed",
                "top": "0px",
                "left": navLeft + "px",
                "width": navWidth + "px"
            })
        } else {
            menuContiner.css({
                "position": "static",
                "top": "0px",
                "left": navLeft + "px"
            })
        }

        $.each(moduleList, function(index, node){
            if($(document).scrollTop() >= ($("#"+node).position().top - navHeight - 5)){
                $("#other-info-menu li a.selected").removeClass("selected");
                $("#other-info-menu li a").eq(index).addClass("selected");
            }
        });
    }

    menuUl.find("a").click(function () {
        menuUl.find("a.selected").removeClass("selected");
        $(this).addClass("selected");
        var index = menuUl.find("a").index($(this));
        var extra = menuContiner.css("position") == "static" ? 45 : 0
        $(window).scrollTop($("#"+moduleList[index]).position().top - navHeight - extra);
    });

    menuUl.find("a").eq(0).addClass("selected");
}

//关注或者取消关注
//if collction == 1 关注 else 取消关注
function reportCollectionState(collection,success) {
    var url = collection == 1 ? "/house/collection" : "/house/cancel-collection"
    request(url,{
        token: getToken(),
        house_id: parseInt(getParams("house_id")),
    },function (resp) {
        success(true);
    })
}

//查看地图
function lookMap() {
    var menuContiner = $("#other-info-menu-container");
    var navHeight = menuContiner.outerHeight();
    var extra = menuContiner.css("position") == "static" ? 45 : 0
    $(window).scrollTop($('#zz-map').position().top - navHeight - extra);
}


