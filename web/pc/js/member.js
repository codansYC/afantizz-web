/**
 * Created by lekuai on 17/1/28.
 */

var releaseHouse
var collectionHouse

$(function () {

    getUserInfo();

    //退出登录处理
    $('#logout').click(function () {
        logout(function (flag) {
            history.back();
        })
    })

    //初入页面显示我的发布
    requestReleaseHouse();
    $("#menu-lst a").eq(0).addClass("selected");

    var moreBtnHoverTimer

    //处理个人中心的菜单
    $("#menu-lst a").click(function () {
        $("#menu-lst a").removeClass("selected");
        $(this).addClass("selected");
        var index = $(this).parent().index();
        $('#info-box').children().remove();
        switch (index) {
            case 0:
                requestReleaseHouse();
                break;
            case 1:
                requestCollectionHouse();
                break;
            case 2:
                showBindPhone();
                break;
            default:
                break;
        }

    })

    //请求发布房源数据
    function requestReleaseHouse() {
        request(basicUrl + "user/release",{
            token: getToken()
        },function (resp) {
            showMyRelease(resp);
        })
    }

    //请求收藏房源数据
    function requestCollectionHouse() {
        request(basicUrl + "user/collection",{
            token: getToken()
        },function (resp) {
            showMyCollection(resp);
        })
    }

    function showMyRelease(houses) {
        var ul = $('<ul></ul>')
        ul.addClass('info-lst')
        ul.attr('id','release-lst')
        $('#info-box').append(ul)
        for (var i=0; i<houses.length; i++) {
            var house = houses[i];
            var li = $('<li></li>')
            ul.append(li)
            /*topInfo*/
            var topInfo = $("<div class='top-info'></div>")
            li.append(topInfo)
            //发布时间
            var releaseDate = $("<span class='release-date'></span>")
            releaseDate.text("最近更新 "+house.release_date);
            topInfo.append(releaseDate)
            //出租状态
            var state
            var houseState = house.sell_state
            if (houseState == "在架") {
                state = $('<div class="release-state sell">转租中</div>')
            } else {
                state  = $('<div class="release-state unsell">已下架</div>')
            }
            topInfo.append(state)

            /*房源介绍*/
            var houseDesc = $("<div class='house-desc'></div>")
            li.append(houseDesc)
            //图片
            var imgInfo = $("<div class='img-info'></div>")
            houseDesc.append(imgInfo)
            var houseImgA = $('<a></a>')
            houseImgA.attr({
                "href": "/pc/detail.html?house_id="+house.house_id,
                "target": "_blank"
            })
            imgInfo.append(houseImgA)
            var houseImg = $('<img/>')
            houseImg.attr('src',basicUrl+house.images[0])
            houseImgA.append(houseImg)

            /*文本信息*/
            var textInfo = $("<div class='text-info'></div>")
            houseDesc.append(textInfo)
            //标题
            var title = house.title
            if (title.length > 25) {
                title = title.substr(0,25) + '...'
            }
            var oTitle = $("<div class='house-title'></div>")
            oTitle.text(title)
            textInfo.append(oTitle)
            //地址
            var address = house.district + '-' + house.address
            var oAddress = $("<div class='house-address'></div>")
            oAddress.text(address)
            textInfo.append(oAddress)
            //价格和到期日期
            var oPriceAndDeadlineBg = $("<div class='priceAndDeadlineBg'></div>")
            textInfo.append(oPriceAndDeadlineBg)
            //价格
            var oPrice = $("<span class='house-price'></span>")
            oPrice.text('¥' + house.price)
            oPriceAndDeadlineBg.append(oPrice)
            //到期
            if (house.deadline_date != null && house.deadline_date != '') {
                var oDeadline = $("<span class='house-deadline'></span>")
                oDeadline.text(house.deadline_date+'到期')
                oPriceAndDeadlineBg.append(oDeadline)
            }

            //浏览/收藏量
            var oNumberInfo = $("<div class='number-info'></div>")
            textInfo.append(oNumberInfo)
            //收藏量
            var oCollectionNum = $("<span class='num collection-num'></span>")
            oCollectionNum.text('收藏 '+house.collection_count)
            oNumberInfo.append(oCollectionNum)
            var oTotalBrowseNum = $("<span class='num total-browse-num'></span>")
            oTotalBrowseNum.text('浏览 '+house.browse_count)
            oNumberInfo.append(oTotalBrowseNum)
            var oTodayBrowseNum = $("<span class='num today-browse-num'></span>")
            oTodayBrowseNum.text('今日浏览 '+house.today_browse_count)
            oNumberInfo.append(oTodayBrowseNum)


            /*各个操作按钮*/
            var oActions = $("<ul class='action-list'></ul>")
            houseDesc.append(oActions)
            //修改
            var oEdit = $("<a href='javascript:' class='edit'>修改</a>")
            oEdit.attr('href','/pc/release.html?house_id='+house.house_id)
            var oEditLi = $("<li></li>")
            oEditLi.append(oEdit)
            oActions.append(oEditLi)
            //置顶
            if (house.sell_state == '在架') {
                var oStick = $("<a href='javascript:' class='stick'>置顶</a>")
                oStick.click(function () {
                    stick(house.house_id)
                })
                var oStickLi = $("<li></li>")
                oStickLi.append(oStick)
                oActions.append(oStickLi)
            }
            //下架
            if (house.sell_state == '在架') {
                var oUnsell = $("<a href='javascript:' class='unsell'>下架</a>")
                oUnsell.click(function () {
                    changeSellState(house.house_id,0)
                })
                var oUnsellLi = $("<li></li>")
                oUnsellLi.append(oUnsell)
                oActions.append(oUnsellLi)
            } else {
                var oSell = $("<a href='javascript:' class='sell'>上架</a>")
                oSell.click(function () {
                    changeSellState(house.house_id,1)
                })
                var oSellLi = $("<li></li>")
                oSellLi.append(oSell)
                oActions.append(oSellLi)
            }

            //删除
            var oDelete = $("<a href='javascript:' class='delete'>删除</a>")
            oDelete.click(function () {
                deleteHouse(house.house_id)
            })
            var oDeleteLi = $("<li></li>")
            oDeleteLi.append(oDelete)
            oActions.append(oDeleteLi)
        }
    }

    //置顶房源
    function stick(houseId) {
        request(basicUrl + "house/stick",{
            token: getToken(),
            house_id: houseId
        },function (resp) {
            showModel("置顶成功")
            setTimeout(function () {
                $('#info-box').children().remove();
                requestReleaseHouse();
            },800)

        })
    }

    //更改在架状态
    function changeSellState(houseId,sell) {
        request(basicUrl + "house/change-sell-state",{
            token: getToken(),
            house_id: houseId,
            sell: sell
        },function (resp) {
            if (sell==0) {
                showModel('下架成功')
            } else {
                showModel('上架成功')
            }
            setTimeout(function () {
                $('#info-box').children().remove();
                requestReleaseHouse();
            },800)
        })
    }

    //删除房源
    function deleteHouse(houseId) {

        request(basicUrl + "house/delete",{
            token: getToken(),
            house_id: houseId
        },function (resp) {
            showModel('删除成功')
            setTimeout(function () {
                $('#info-box').children().remove();
                requestReleaseHouse();
            },800)
        })
    }

    function showMyCollection(houses) {
        var ul = $('<ul></ul>')
        ul.addClass('info-lst')
        ul.attr('id','collection-lst')
        $('#info-box').append(ul)
        for (var i=0; i<houses.length; i++) {
            var house = houses[i];
            var li = $('<li></li>')
            ul.append(li)

            /*房源介绍*/
            var houseDesc = $("<div class='house-desc'></div>")
            li.append(houseDesc)
            //图片
            var imgInfo = $("<div class='img-info'></div>")
            houseDesc.append(imgInfo)
            var houseImgA = $('<a></a>')
            houseImgA.attr({
                "href": "/pc/detail.html?house_id="+house.house_id,
                "target": "_blank"
            })
            imgInfo.append(houseImgA)
            var houseImg = $('<img/>')
            houseImg.attr('src',basicUrl+house.images[0])
            houseImgA.append(houseImg)

            /*文本信息*/
            var textInfo = $("<div class='text-info'></div>")
            houseDesc.append(textInfo)
            //标题
            var title = house.title
            if (title.length > 25) {
                title = title.substr(0,25) + '...'
            }
            var oTitle = $("<div class='house-title'></div>")
            oTitle.text(title)
            textInfo.append(oTitle)
            //地址
            var address = house.district + '-' + house.address
            var oAddress = $("<div class='house-address'></div>")
            oAddress.text(address)
            textInfo.append(oAddress)
            /*标签*/
            var oTags = $("<div class='tags'></div>");
            textInfo.append(oTags)
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
                oToilet.text('独立卫生间')
                oTags.append(oToilet)
            }
            //是否有转租优惠
            if (house.benefit != null && house.benefit != '') {
                var oBenefit = $("<div class='benefit'></div>");
                oBenefit.text('转租优惠')
                oTags.append(oBenefit)
            }
            //价格和到期日期、更新日期
            var oPriceAndDeadlineBg = $("<div class='priceAndDeadlineBg'></div>")
            textInfo.append(oPriceAndDeadlineBg)
            //价格
            var oPrice = $("<span class='house-price'></span>")
            oPrice.text('¥' + house.price)
            oPriceAndDeadlineBg.append(oPrice)
            //到期
            if (house.deadline_date != null && house.deadline_date != '') {
                var oDeadline = $("<span class='house-deadline'></span>")
                oDeadline.text(house.deadline_date+'到期')
                oPriceAndDeadlineBg.append(oDeadline)
            }
            //发布时间
            var releaseDate = $("<span class='release-date'></span>")
            releaseDate.text("最近更新 "+house.release_date);
            houseDesc.append(releaseDate)

            /*各个操作按钮*/
            var oActions = $("<ul class='action-list'></ul>")
            houseDesc.append(oActions)
            //取消收藏
            var oCancelCollection = $("<a href='javascript:' class='cancel-collection'>删除</a>")
            oCancelCollection.click(function () {
                cancelCollection(house.house_id)
            })
            var oCancelCollectionLi = $("<li></li>")
            oCancelCollectionLi.append(oCancelCollection)
            oActions.append(oCancelCollectionLi)
            //举报
            var oComplain = $("<a href='javascript:' class='accusation'>举报</a>")
            oComplain.click(function () {

            })
            var oComplainLi = $("<li></li>")
            oComplainLi.append(oComplain)
            oActions.append(oComplainLi)

            /*举报理由列表*/
            var accusationUl = $("<ul class='accusationList'></ul>");
            houseDesc.append(accusationUl)
            var falseLi = $("<li></li>");
            var falseA = $("<a href='javascript:'>虚假房源</a>");
            falseLi.append(falseA);
            var agencyLi = $("<li></li>");
            var agencyA = $("<a href='javascript:'>中介房源</a>");
            agencyLi.append(agencyA);
            var infoErrorLi = $("<li></li>");
            var infoErrorA = $("<a href='javascript:'>房源信息不符实</a>");
            infoErrorLi.append(infoErrorA);
            ul.append(falseLi,agencyLi,infoErrorLi);
            accusationUl.append(falseLi,agencyLi,infoErrorLi);

            oComplain.hover(function () {
                clearTimeout(accusationHoverTimer);
                accusationUl.css("visibility","visible");
            }, function () {
                accusationHoverTimer = setTimeout(function () {
                    accusationUl.css("visibility","hidden");
                },30)
            });

            accusationUl.hover(function () {
                clearTimeout(accusationHoverTimer);
            },function () {
                accusationHoverTimer = setTimeout(function () {
                    accusationUl.css("visibility","hidden");
                },30)
            });

            falseA.click(function () {
                accusate(house.house_id,$(this).text())
            })
            agencyA.click(function () {
                accusate(house.house_id,$(this).text())
            })
            infoErrorA.click(function () {
                accusate(house.house_id,$(this).text())
            })
        }
    }


    //取消收藏
    function cancelCollection(houseId) {
        request(basicUrl + "house/cancel-collection",{
            token: getToken(),
            house_id: houseId
        },function (resp) {
            showModel('取消收藏成功')
            setTimeout(function () {
                $('#info-box').children().remove();
                requestCollectionHouse()
            },800)
        })
    }

    //处理举报
    var accusationHoverTimer

    function showBindPhone() {
        var outerDiv = $('<div id="bind-phone"></div>');
        $('#info-box').append(outerDiv);
        var form = $('<form action="javascript:" method="post"></form>');
        outerDiv.append(form);
        var phoneContainer = $('<div class="phone-container"></div>');
        form.append(phoneContainer);
        var phoneInput = $('<input type="text" placeholder="请输入手机号" required="required">');
        phoneContainer.append(phoneInput);
        var codeContainer = $('<div class="code-container"></div>');
        form.append(codeContainer);
        var codeInput = $('<input type="text" placeholder="请输入验证码" required="required">');
        codeContainer.append(codeInput);
        var codeAc = $('<a href="javascript:">获取验证码</a>');
        codeContainer.append(codeAc);
        var bindBg = $('<div class="bind-bg"></div>');
        var bind = $('<input type="submit" value="绑定">');
        bindBg.append(bind);
        form.append(bindBg);

        //处理事件
        phoneInput.bind('input valueChange', function () {
            if (isCounting) {
                return
            }
            if (phoneIsValid()) {
                codeAc.css("color","#34c86c");
            } else {
                codeAc.css("color","#a0a0a0");
            }
        });


        codeAc.click(function () {
            if (isCounting || !phoneIsValid()) {return}
            isCounting = true;
            $(this).text(count + " s");
            $(this).css("color","#a0a0a0");
            /*测试代码*/
            codeInput.val("0000")
            timer = setInterval(function () {
                count--;
                if (count == 0) {
                    clearInterval(timer)
                    isCounting = false;
                    $(this).text("获取验证码");
                    if (phoneIsValid()) {
                        $(this).css("color","#34c86c");
                    } else {
                        $(this).removeClass("phoneValid");
                        $(this).css("color","#a0a0a0");
                    }
                    return
                }
                codeAc.text(count + " s");
            }, 1000)
        })

    }

    //倒计时60s
    var count = 60
    var timer
    var isCounting = false
    //验证手机号是否输入正确
    var phoneIsValid = function () {
        var text = $(".phone-container input").val()
        return $().phoneIsValid(text)
    }
    //验证验证码格式是否正确
    var codeIsValid = function () {
        var text = $(".code-container input").val()
        return $().codeIsValid(text)
    }

})

///////////




