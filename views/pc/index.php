<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>【阿凡提转租】- 让转租更简单</title>
    <script src="js/jquery-3.1.1.min.js"></script>
    <link rel="stylesheet" href="css/pc/common.css" type="text/css">
    <link rel="stylesheet" href="css/pc/headerFooter.css" type="text/css">
    <link rel="stylesheet" href="css/pc/index.css" type="text/css">
    <link rel="stylesheet" href="css/pc/login.css" type="text/css">
    <script src="js/pc/common.js"></script>
    <script src="js/pc/login.js" type="text/javascript"></script>
    <script src="js/pc/index.js" type="text/javascript"></script>
</head>
<body>

<!--头部-->
<div class="header">
    <div class="header_wrap">
        <div class="logo">这是logo</div>
        <div class="search">
            <a href="javascript:" id="search" class="green_bg_white_txt bcTransition">搜 索</a>
            <input value="" class="" name="keyword" placeholder="请输入区域、地址或地铁线路" id="keyword-box" maxlength="20">
        </div>
        <div class="header_menu">
            <ul id="header_menu_ul" class="header_menu_ul">
                <li>
                    <div id="" class="header_menu_item">
                        <a href="javascript:$().showLoginPage()" id="resource-page-login">登录</a>
                    </div>
                </li>
                <li>
                    <div class="header_menu_item">
                        <a href="javascript:" id="release-house" target="_self">发布房源</a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>
<!--筛选框-->
<div class="filter">
    <div class="filter-box global_box">
        <!--<div class="filter-options">-->
        <dl class="dl-lst gio_district">
            <dt>区域：</dt>
            <dd>
                <div class="option-list">
                    <a href="#" class="">不限</a>
                    <a href="#" class="">浦东</a>
                    <a href="#" class="">闵行</a>
                    <a href="#" class="">宝山</a>
                    <a href="#" class="">徐汇</a>
                    <a href="#" class="">普陀</a>
                    <a href="#" class="">杨浦</a>
                    <a href="#" class="">长宁</a>
                    <a href="#" class="">松江</a>
                    <a href="#" class="">嘉定</a>
                    <a href="#" class="">黄浦</a>
                    <a href="#" class="">静安</a>
                    <a href="#" class="">闸北</a>
                    <a href="#" class="">虹口</a>
                    <a href="#" class="">青浦</a>
                    <a href="#" class="">奉贤</a>
                    <a href="#" class="">金山</a>
                    <a href="#" class="">崇明</a>
                    <a href="#" class="">上海周边</a>
                </div>
            </dd>
        </dl>
        <dl class="dl-lst gio_subway">
            <dt>地铁：</dt>
            <dd>
                <div class="option-list">
                    <a href="#" class="">不限</a>
                    <a href="#" class="">1号线</a>
                    <a href="#" class="">2号线</a>
                    <a href="#" class="">3号线</a>
                    <a href="#" class="">4号线</a>
                    <a href="#" class="">5号线</a>
                    <a href="#" class="">6号线</a>
                    <a href="#" class="">7号线</a>
                    <a href="#" class="">8号线</a>
                    <a href="#" class="">9号线</a>
                    <a href="#" class="">10号线</a>
                    <a href="#" class="">11号线</a>
                    <a href="#" class="">12号线</a>
                    <a href="#" class="">13号线</a>
                    <a href="#" class="">14号线</a>
                    <a href="#" class="">15号线</a>
                    <a href="#" class="">16号线</a>
                    <a href="#" class="">17号线</a>
                    <a href="#" class="">18号线(在建)</a>
                </div>
            </dd>
        </dl>
        <dl class="dl-lst gio_price">
            <dt>价格：</dt>
            <dd>
                <div class="option-list">
                    <a href="#" class="">不限</a>
                    <a href="#" class="">1000以下</a>
                    <a href="#" class="">1000-1500</a>
                    <a href="#" class="">1500-2000</a>
                    <a href="#" class="">2000-2500</a>
                    <a href="#" class="">2500-3000</a>
                    <a href="#" class="">3000-4000</a>
                    <a href="#" class="">4000-5000</a>
                    <a href="#" class="">5000以上</a>
                </div>
            </dd>
        </dl>
        <dl class="dl-lst gio_houselayout">
            <dt>房型：</dt>
            <dd>
                <div class="option-list">
                    <a href="#" class="">不限</a>
                    <a href="#" class="">一居</a>
                    <a href="#" class="">二居</a>
                    <a href="#" class="">三居</a>
                    <a href="#" class="">四居以上</a>
                </div>
            </dd>
        </dl>
        <dl class="dl-lst gio_mode">
            <dt>方式：</dt>
            <dd>
                <div class="option-list">
                    <a href="#" class="">不限</a>
                    <a href="#" class="">整租</a>
                    <a href="#" class="">合租</a>
                    <a href="#" class="">公寓</a>
                </div>
            </dd>
        </dl>
        <!--</div>-->
    </div>
</div>
<!--中部-->
<div class="content">
    <div class="content-box global_box">
        <div class="sort">
            <ul id="sort-menu">
                <li>
                    <a href="javascript:" class="">最新</a>
                </li>
                <li>
                    <a href="javascript:">面积</a>
                </li>
                <li>
                    <a href="javascript:">价格</a>
                </li>
                <li>
                    <a href="javascript:">入住时间</a>
                </li>
            </ul>
        </div>
        <div class="house_wrap">
            <ul id="house_list" class="house_list"></ul>
            <div class="look-more">
                <a href="javascript:" id="loadHouse" class="green_bg_white_txt bcTransition">点击查看更多房源</a>
            </div>
        </div>
    </div>

</div>
<!--尾部-->
<script>showFooter()</script>

<!--登录页
  点击登录按钮显示出来
-->
</body>
</html>