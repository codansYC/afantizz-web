<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" >
    <title>阿凡提转租</title>
    <link rel="stylesheet" href="bootstrap/bootstrap.min.css">
    <script src="jquery-3.1.1.min.js"></script>
    <script src="bootstrap/bootstrap.min.js"></script>
    <link rel="stylesheet" href="common.css">
    <link rel="stylesheet" href="header.css">
    <link rel="stylesheet" href="footer.css">
    <link rel="stylesheet" href="houseList.css">
    <link rel="stylesheet" href="index.css">
    <script src="common.js"></script>
    <script src="houseList.js"></script>
    <script src="index.js"></script>
    <script src="footer.js"></script>
</head>
<body>
<div class=".container-fluid">
    <div class="header bg-primary">
        <div class="serviceCity pull-left">上海</div>
        <div class="text-center title">所有房源</div>
        <div class="sort pull-right">
            <button id="sortBtn" class="pull-right">
                <span class="glyphicon glyphicon-sort"></span>
            </button>
        </div>
    </div>
    <div id="slideMask"></div>
    <div id="slide">
        <ul class="list-unstyled sortList">
            <li>最新</li>
            <li>面积</li>
            <li>价格</li>
            <li>入住时间</li>
        </ul>
    </div>
    <div class="contentBg">
        <div class="search defaultBgColor">
            <input type="button" class="text-center defaultBorder" value="请输入关键字">
        </div>
        <div id="mask"></div>
        <div class="filterBg clearfix">
            <div class="filterCondition clearfix">
                <div class="area-zone pull-left text-center text-muted">
                    <span class="show-area">区域</span>
                    <span class="caret"></span>
                </div>
                <div class="rent-price pull-left text-center text-muted">
                    <span class="show-price text-center">租金</span>
                    <span class="caret"></span>
                </div>
                <div class="room-type pull-left text-center text-muted">
                    <span class="show-style">户型</span>
                    <span class="caret"></span>
                </div>
                <div class="subway pull-left text-center text-muted">
                    <span class="show-subway">地铁</span>
                    <span class="caret"></span>
                </div>
            </div>
            <div class="filterCommon">
                <!--区域选择视图-->
                <div class="areaBg filterBox">
                    <ul class="areaList list-unstyled text-center">
                        <li>不限</li>
                        <li>浦东</li>
                        <li>闵行</li>
                        <li>宝山</li>
                        <li>徐汇</li>
                        <li>普陀</li>
                        <li>杨浦</li>
                        <li>长宁</li>
                        <li>松江</li>
                        <li>嘉定</li>
                        <li>黄埔</li>
                        <li>静安</li>
                        <li>闸北</li>
                        <li>虹口</li>
                        <li>青浦</li>
                        <li>奉贤</li>
                        <li>金山</li>
                        <li>崇明</li>
                        <li>上海周边</li>
                    </ul>
                </div>
                <!--价格选择视图-->
                <div class="priceBg filterBox">
                    <ul class="priceList list-unstyled text-center">
                        <li>不限</li>
                        <li>1000以下</li>
                        <li>1000~1500</li>
                        <li>1500~2000</li>
                        <li>2000~2500</li>
                        <li>2500~3000</li>
                        <li>3000~4000</li>
                        <li>4000~5000</li>
                        <li>5000以上</li>
                    </ul>
                </div>
                <!--户型选择视图-->
                <div class="styleBg filterBox">
                    <div class="styleList clearfix">
                        <ul class="styleGroupList">
                            <li>
                                <span>不限</span>
                            </li>
                            <li>
                                <span>整租</span>
                                <span class="glyphicon glyphicon-menu-right"></span>
                            </li>
                            <li>
                                <span>合租</span>
                                <span class="glyphicon glyphicon-menu-right"></span>
                            </li>
                            <li>
                                <span>公寓</span>
                            </li>
                        </ul>
                        <ul class="styleEntiretyList">
                            <li>
                                <span>不限</span>
                            </li>
                            <li>
                                <span>一居</span>
                            </li>
                            <li>
                                <span>二居</span>
                            </li>
                            <li>
                                <span>三居</span>
                            </li>
                            <li>
                                <span>四居及以上</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--地铁选择视图-->
                <div class="subwayBg text-center filterBox">
                    <ul class="subwayList list-unstyled">
                        <li>不限</li>
                        <li>1号线</li>
                        <li>2号线</li>
                        <li>3号线</li>
                        <li>4号线</li>
                        <li>5号线</li>
                        <li>6号线</li>
                        <li>7号线</li>
                        <li>8号线</li>
                        <li>9号线</li>
                        <li>10号线</li>
                        <li>11号线</li>
                        <li>12号线</li>
                        <li>13号线</li>
                        <li>14号线</li>
                        <li>15号线</li>
                        <li>16号线</li>
                        <li>17号线</li>
                        <li>18号线(在建)</li>
                    </ul>
                </div>
            </div>
        </div>
        </div>
        <div class="houseBox clearfix" style="margin-bottom: 48px">
            <ul class="houseList list-unstyled" style="margin-bottom: 0px">
                <!--<li class="clearfix">-->
                <!--<img src='http://cdn1.dooioo.com/fetch/vp/fy/gi/20151016/a52a8367-a136-40de-ad34-94480bcdccd4.jpg_600x450.jpg' alt="" class="pull-left">-->
                <!--<div class="pull-left desc">-->
                    <!--<div class="style">整租｜2室1厅1卫</div>-->
                    <!--<div class="address">浦东－交大嘉园</div>-->
                    <!--<div class="tags">-->
                        <!--<span class="subwayLine">12号线</span>-->
                        <!--<span class="subwayLine">7号线</span>-->
                        <!--<span class="bebefit">转租优惠</span>-->
                    <!--</div>-->
                    <!--<div class="date">-->
                        <!--<span class="deadline pull-left">2017-05-01到期</span>-->
                        <!--<span class="releaseTime pull-right">3天前</span>-->
                    <!--</div>-->
                    <!--<div class="price">2200元/月</div>-->
                <!--</div>-->
            <!--</li>-->
            </ul>
            <div class="btnBg" style="padding: 20px 0 30px;visibility: hidden;">
                <div class="btn-group" role="group" aria-label="...">
                    <button type="button" class="btn btn-default" onclick="lookLastPage()">上一页</button>
                    <button type="button" class="btn btn-default" onclick="lookNextPage()">下一页</button>
                </div>
            </div>
        </div>
    </div>
    <!--footer-->
    <div class="footer navbar-fixed-bottom clearfix">
        <div class="row">
            <div class="text-center col-xs-4">
                <a id="main" href="index.html" class="active">
                    <span class="glyphicon glyphicon-home" aria-readonly="true"></span>
                    <span class="center-block title">首页</span>
                </a>
            </div>
            <div class="text-center col-xs-4">
                <a id="release" href="release.html" class="text-muted">
                    <span class="glyphicon glyphicon-edit" aria-readonly="true"></span>
                    <span class="center-block title">发布</span>
                </a>
            </div>
            <div class="text-center col-xs-4">
                <a id="mine" href="mine.html" class="text-muted">
                    <span class="glyphicon glyphicon-user" aria-readonly="true"></span>
                    <span class="center-block title">我的</span>
                </a>
            </div>
        </div>
    </div>
</div>
</body>
</html>