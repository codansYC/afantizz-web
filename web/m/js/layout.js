/**
 * Created by lekuai on 17/4/2.
 */

$(function () {
    $('.layout').each(function (e) {
        layout($(this))
    })
})

function layout(element) {
    if (!element.hasClass('layout')) {
        return
    }
    var layoutW = element.outerWidth()
    layoutW = layoutW - parseFloat(element.css('padding-left')) - parseFloat(element.css('padding-right'))
    var staticW = element.children('.layout-static').outerWidth(true)
    var dynamic = element.children('.layout-dynamic')
    var borderW = parseInt(dynamic.css('border-left-width')) + parseInt(dynamic.css('border-right-width'))||0
    var paddingLeft = parseFloat(dynamic.css('padding-left'))
    var paddingRight = parseFloat(dynamic.css('padding-right'))
    var marginLeft = parseFloat(dynamic.css('margin-left'))
    var marginRight = parseFloat(dynamic.css('margin-right'))
    var tempW = layoutW - staticW - paddingLeft - paddingRight - marginLeft - marginRight - borderW
    dynamic.width(tempW)

}