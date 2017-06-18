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
            var topInfo = $('<div></div>')
            topInfo.addClass('top-info')
            li.append(topInfo)
            var releaseDate = $('<div></div>')
            releaseDate.text("发布日期:"+house.release_date);
            releaseDate.addClass('release-date')
            topInfo.append(releaseDate)
            var state
            var houseState = house.sell_state
            if (houseState == "在架") {
                state = $('<div class="release-state sell">在架</div>')
            } else {
                state  = $('<div class="release-state unsell">已下架</div>')
            }
            topInfo.append(state)

            var optionsUl = $('<ul></ul>')
            optionsUl.addClass('btn-container')
            topInfo.append(optionsUl)
            var moreLi = $('<li></li>')
            optionsUl.append(moreLi)
            var moreA = $('<a></a>')
            moreA.addClass('more')
            moreLi.append(moreA)
            var moreImg = $('<img/>')
            moreImg.attr('src','/images/more-normal.png')
            moreA.append(moreImg)
            var editLi = $('<li></li>')
            optionsUl.append(editLi)
            var editA = $('<a></a>')
            editA.addClass('edit')
            editA.attr('href','/pc/release.html?house_id='+house.house_id)
            editLi.append(editA)
            var editImg = $('<img/>')
            editImg.attr({
                'src':'/images/edit-normal.png'
            })
            editA.append(editImg)
            var moreBtns
            if (houseState == "在架") {
                moreBtns = generateMoreOptionsWithSelling(house.house_id);
            } else {
                moreBtns  = generateMoreOptionsWithNotSell(house.house_id);
            }
            li.append(moreBtns)
            var houseDesc = $('<div></div>')
            houseDesc.addClass('house-desc')
            li.append(houseDesc)
            var imgInfo = $('<div></div>')
            imgInfo.addClass('img-info')
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
            var textInfo = $('<div></div>')
            textInfo.addClass('text-info')
            houseDesc.append(textInfo)
            var price = $('<div></div>')
            price.text(house.price+'元/月')
            textInfo.append(price)
            var general = $('<div>合租|三室一厅主卧|25m²|朝南|29层|共33层</div>')
            var fullStyle = house.rent_mode+"|"+house.style+"|"+house.area+"m²"+"|"+house.orientation+"|"+house.floor+"|"+house.max_floor
            general.text(fullStyle)
            textInfo.append(general)
            var address = $('<div></div>')
            address.text(house.address)
            textInfo.append(address)
            var deadline = $('<div>2017-09-13到期</div>')
            deadline.text(house.deadline_date+"到期")
            textInfo.append(deadline)
            var history = $('<div class="look-history"></div>')
            li.append(history)
            var collectionNum = $('<p></p>')
            var numDesc = $("<span style='display: inline-block; width: 6em; text-align: center;'>关注量</span>")
            var numSpan = $("<span style='text-align: center;'></span>")
            numSpan.text(house.collection_count)
            collectionNum.append(numDesc,numSpan);
            var todayHistory = $('<p></p>')
            var numDesc = $("<span style='display: inline-block; width: 6em; text-align: center;'>今日浏览量</span>")
            var numSpan = $("<span style='text-align: center;'></span>")
            numSpan.text(house.today_browse_count+"")
            todayHistory.append(numDesc,numSpan)
            var totalHistory = $('<p></p>')
            var numDesc = $("<span style='display: inline-block; width: 6em; text-align: center;'>总浏览量</span>")
            var numSpan = $("<span style='text-align: center;'></span>")
            numSpan.text(house.browse_count+"")
            totalHistory.append(numDesc,numSpan)
            history.append(collectionNum,todayHistory,totalHistory);
        }

        handleSmallAAction();
    }

    //已下架的更多按钮展示
    function generateMoreOptionsWithNotSell(houseId) {
        var moreBtns = $('<ul></ul>')
        moreBtns.addClass('more-btns')
        var moreBtns_li1 = $('<li></li>')
        var moreBtns_li2 = $('<li></li>')
        moreBtns.append(moreBtns_li1)
        moreBtns.append(moreBtns_li2)
        var stickTopA = $('<a></a>')
        stickTopA.addClass('stickTop')
        moreBtns_li1.append(stickTopA)
        var stickImg = $('<img src="/images/sticktop-normal.png"/>')
        var stickDes = $('<div>上架</div>')
        stickTopA.append(stickImg)
        stickTopA.append(stickDes)
        var deleteA = $('<a></a>')
        deleteA.addClass('deleteHistory')
        moreBtns_li2.append(deleteA)
        var deleteImg = $('<img src="/images/delete-normal.png"/>')
        var deleteDes = $('<div>删除</div>')
        deleteA.append(deleteImg)
        deleteA.append(deleteDes)

        stickTopA.click(function () {
            changeSellState(houseId,1)
        })
        deleteA.click(function () {
            deleteHouse(houseId)
        })

        return moreBtns
    }

    //在架中的更多按钮展示
    function generateMoreOptionsWithSelling(houseId) {
        var moreBtns = $('<ul></ul>')
        moreBtns.addClass('more-btns')
        var moreBtns_li1 = $('<li></li>')
        var moreBtns_li2 = $('<li></li>')
        var moreBtns_li3 = $('<li></li>')
        moreBtns.append(moreBtns_li1)
        moreBtns.append(moreBtns_li2)
        moreBtns.append(moreBtns_li3)
        var stickTopA = $('<a></a>')
        stickTopA.addClass('stickTop')
        moreBtns_li1.append(stickTopA)
        var stickImg = $('<img src="/images/sticktop-normal.png"/>')
        var stickDes = $('<div>置顶</div>')
        stickTopA.append(stickImg)
        stickTopA.append(stickDes)
        var deleteA = $('<a></a>')
        deleteA.addClass('deleteHistory')
        moreBtns_li2.append(deleteA)
        var deleteImg = $('<img src="/images/delete-normal.png"/>')
        var deleteDes = $('<div>删除</div>')
        deleteA.append(deleteImg)
        deleteA.append(deleteDes)
        var unsellA = $('<a></a>')
        unsellA.addClass('unsell')
        moreBtns_li3.append(unsellA)
        var unsellImg = $('<img src="/images/nosell-normal.png"/>')
        var unsellDes = $('<div>下架</div>')
        unsellA.append(unsellImg)
        unsellA.append(unsellDes)

        stickTopA.click(function () {
            stickie(houseId)
        })
        unsellA.click(function () {
            changeSellState(houseId,0)
        })
        deleteA.click(function () {
            deleteHouse(houseId)
        })

        return moreBtns
    }

    //置顶房源
    function stickie(houseId) {
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


    function handleSmallAAction() {
        $('.edit').hover(function () {
            var img = $(this).children('img')
            img.attr('src','/images/edit-hover.png')
        },function () {
            var img = $('.edit').children('img')
            img.attr('src','/images/edit-normal.png')
        })

        $('.more').hover(function () {
            clearTimeout(moreBtnHoverTimer)
            var img = $(this).children('img')
            img.attr('src','/images/more-hover.png')
            var moreBtns = $(this).parents('.top-info').parents('li').children('.more-btns')
            moreBtns.css('visibility','visible')
        },function () {
            var img = $(this).children('img')
            var moreBtns = $(this).parents('.top-info').parents('li').children('.more-btns')
            moreBtnHoverTimer = setTimeout(function () {
                img.attr('src','/images/more-normal.png')
                moreBtns.css('visibility','hidden')
            },10)
        })

        $('.more-btns').hover(function () {
            clearTimeout(moreBtnHoverTimer)
        },function () {
            var moreBtns = $(this)
            var img = $(this).parents('li').children('.top-info').children('.btn-container').children('li').children('.more').children('img')
            moreBtnHoverTimer = setTimeout(function () {
                moreBtns.css('visibility','hidden')
                img.attr('src','/images/more-normal.png')
            },10)
        })
    }

    function showMyCollection(houses) {
        var ul = $('<ul></ul>')
        ul.addClass('info-lst')
        ul.attr('id','collection-lst')
        $('#info-box').append(ul)
        for (var i=0; i<houses.length; i++) {
            var house = houses[i]
            var li = $('<li></li>')
            ul.append(li)
            var topInfo = $('<div></div>')
            topInfo.addClass('top-info')
            li.append(topInfo)
            var releaseDate = $('<div></div>')
            releaseDate.text("发布日期:"+house.release_date);
            releaseDate.addClass('release-date')
            topInfo.append(releaseDate)
            var optionsUl = $('<ul></ul>')
            optionsUl.addClass('btn-container')
            topInfo.append(optionsUl)
            var deleteLi = $('<li></li>')
            optionsUl.append(deleteLi)
            var cancelCollectionA = $('<a href="javascript:">取消收藏</a>')
            cancelCollectionA.addClass('cancel-collection')
            deleteLi.append(cancelCollectionA)
            var accusationLi = $('<li></li>');
            optionsUl.append(accusationLi);
            var accusationA = $('<a href="javascript:">举报</a>');
            accusationA.addClass('accusation');
            accusationLi.append(accusationA);
            var houseDesc = $('<div></div>')
            houseDesc.addClass('house-desc')
            li.append(houseDesc)
            var imgInfo = $('<div></div>')
            imgInfo.addClass('img-info')
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
            var textInfo = $('<div></div>')
            textInfo.addClass('text-info')
            houseDesc.append(textInfo)
            var price = $('<div>2000元/月</div>')
            price.text(house.price+'元/月')
            textInfo.append(price)
            var general = $('<div>合租|三室一厅主卧|25m²|朝南|29层|共33层</div>')
            general.text(house.rent_mode+"|"+house.style+"|"+house.area+"m²"+"|"+house.orientation+"|"+house.floor+"|"+house.max_floor)
            textInfo.append(general)
            var address = $('<div>浦东新区三舒路181弄</div>')
            address.text(house.address)
            textInfo.append(address)
            var deadline = $('<div>2017-09-13到期</div>')
            deadline.text(house.deadline_date+"到期");
            textInfo.append(deadline)

            var accusationUl = $("<ul class='accusationList'></ul>");
            accusationUl.css({
                "list-style": "none",
                "position": "absolute",
                "top": "35px",
                "right": "44px",
                "padding": "6px 0",
                "border-radius": "4px",
                "visibility": "hidden",
                "background-color": "black",
                "box-sizing": "border-box",
                'opacity': '.7',
                'filter': 'alpha(opacity=70)',
            });
            var falseLi = $("<li style='line-height: 25px; font-size: 13px; padding: 0 6px; width: 106px;'></li>");
            var falseA = $("<a href='javascript:' style='color: #cdcdcd;text-align: center; width: 100%; display: block;'>虚假房源</a>");
            falseLi.append(falseA);
            var agencyLi = $("<li style='line-height: 25px; font-size: 13px; padding: 0 6px;'></li>");
            var agencyA = $("<a href='javascript:' style='color: #cdcdcd;text-align: center; width: 100%; display: block;'>中介房源</a>");
            agencyLi.append(agencyA);
            var infoErrorLi = $("<li style='line-height: 25px; font-size: 13px; padding: 0 6px;'></li>");
            var infoErrorA = $("<a href='javascript:' style='color: #cdcdcd;text-align: center; width: 100%; display: block;'>房源信息不符实</a>");
            infoErrorLi.append(infoErrorA);
            ul.append(falseLi,agencyLi,infoErrorLi);
            accusationUl.append(falseLi,agencyLi,infoErrorLi);
            li.append(accusationUl);

            //取消收藏
            cancelCollectionA.click(function () {
                cancelCollection(house.house_id);
            })

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



        handleAccusation();
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
    function handleAccusation() {

        $(".accusation").hover(function () {
            clearTimeout(accusationHoverTimer);
            var accusationList = $(this).parents('.top-info').parents('li').children('.accusationList');
            accusationList.css("visibility","visible");
        }, function () {
            var accusationList = $(this).parents('.top-info').parents('li').children('.accusationList');
            accusationHoverTimer = setTimeout(function () {
                accusationList.css("visibility","hidden");
            },30)
        });

        $(".accusationList").hover(function () {
            clearTimeout(accusationHoverTimer);
        },function () {
            var accusationList = $(this);
            accusationHoverTimer = setTimeout(function () {
                accusationList.css("visibility","hidden");
            },30)
        });

        $(".accusationList a").hover(function () {
            $(this).css({
                "color": "white"
            })
        },function () {
            $(this).css({
                "color": "#cdcdcd"
            })
        });
    }


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




