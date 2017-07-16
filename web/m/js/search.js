/**
 * Created by lekuai on 2017/5/2.
 */

$(function () {
    // $("#cancelBtn").click(function () {
    //     history.go('index.html')
    // })
    $('form').submit(function () {
        var kw = $('input[type=search]').val()
        requestByKeyword(kw)
    })

    function requestByKeyword(kw) {
        request(basicUrl+'house/search',{
            search_keyword: kw
        },function (resp) {
            showHouseList(resp)
        })
    }

    function showHouseList(houses) {
        var ul = $('ul.houseList')
        ul.children().remove()
        for (var i = 0; i < houses.length; i++) {
            var house = houses[i]
            var li = $("<li class='clearfix'></li>")
            ul.append(li)
            var img = $("<img class='pull-left'/>")
            img.attr("src", basicUrl + house.images[0])
            var desc = $("<div class='pull-left desc'></div>")
            li.append(img, desc)
            var style = $("<div class='style'></div>")
            style.text(house.rent_mode + "|" + house.style.substr(0, 4) + house.style.substr(6, 2))
            var address = $("<div class='address'></div>")
            address.text(house.district + "-" + house.address)
            var tags = $("<div class='tags'></div>")
            desc.append(style, address, tags)
            var subways = house.subways.split(';')
            for (var j = 0; j < subways.length; j++) {
                var subwayLine = $("<span class='subwayLine'></span>")
                subwayLine.text(subways[j])
                tags.append(subwayLine)
            }
            if (house.benefit != "" && house.benefit != null) {
                var benefit = $("<span class='benefit'></span>")
                benefit.text('转租优惠')
                tags.append(benefit)
            }
            var date = $("<div class='date'></div>")
            desc.append(date)
            var deadline = $("<span class='deadline pull-left'></span>")
            deadline.text(house.deadline_date + '到期')
            var releaseTime = $("<span class='releaseTime pull-right'></span>")
            releaseTime.text(house.release_date)
            date.append(deadline, releaseTime)
            var price = $("<div class='price'></div>")
            price.text(house.price + '元/月')
            desc.append(price)
        }
        updateLayout()

        //点击cell查看房源详情
        $('.houseList>li').click(function () {
            var houseId = houses[$(this).index()].house_id
            location.href = 'detail.html?house_id=' + houseId
        })
    }
})