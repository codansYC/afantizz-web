/**
 * Created by lekuai on 2017/5/2.
 */

const rentModes = ['合租','整租','公寓']
const roomTypes = ['主卧','次卧','隔断','床位']
$(function () {
    // $("#cancelBtn").click(function () {
    //     history.go('index.html')
    // })
    $('form').submit(function () {
        var kw = $('input[type=search]').val()
        requestByKeyword(kw)
    })

    function requestByKeyword(kw) {
        request('/house/search',{
            keyword: kw
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
            location.href = 'detail.html?house_id=' + houseId
        })
    }

    // function showHouseList(houses) {
    //     var ul = $('ul.houseList')
    //     ul.children().remove()
    //     for (var i = 0; i < houses.length; i++) {
    //         var house = houses[i]
    //         var li = $("<li class='clearfix'></li>")
    //         ul.append(li)
    //         var img = $("<img class='pull-left'/>")
    //         img.attr("src", basicUrl + house.images[0])
    //         var desc = $("<div class='pull-left desc'></div>")
    //         li.append(img, desc)
    //         var style = $("<div class='style'></div>")
    //         style.text(house.rent_mode + "|" + house.style.substr(0, 4) + house.style.substr(6, 2))
    //         var address = $("<div class='address'></div>")
    //         address.text(house.district + "-" + house.address)
    //         var tags = $("<div class='tags'></div>")
    //         desc.append(style, address, tags)
    //         var subways = house.subways.split(';')
    //         for (var j = 0; j < subways.length; j++) {
    //             var subwayLine = $("<span class='subwayLine'></span>")
    //             subwayLine.text(subways[j])
    //             tags.append(subwayLine)
    //         }
    //         if (house.benefit != "" && house.benefit != null) {
    //             var benefit = $("<span class='benefit'></span>")
    //             benefit.text('转租优惠')
    //             tags.append(benefit)
    //         }
    //         var date = $("<div class='date'></div>")
    //         desc.append(date)
    //         var deadline = $("<span class='deadline pull-left'></span>")
    //         deadline.text(house.deadline_date + '到期')
    //         var releaseTime = $("<span class='releaseTime pull-right'></span>")
    //         releaseTime.text(house.release_date)
    //         date.append(deadline, releaseTime)
    //         var price = $("<div class='price'></div>")
    //         price.text(house.price + '元/月')
    //         desc.append(price)
    //     }
    //     updateLayout()
    //
    //     //点击cell查看房源详情
    //     $('.houseList>li').click(function () {
    //         var houseId = houses[$(this).index()].house_id
    //         location.href = 'detail.html?house_id=' + houseId
    //     })
    // }
})