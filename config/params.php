<?php

return [
    'districts' => [
        310101 => '黄浦区',
        310104 => '徐汇区',
        310105 => '长宁区',
        310106 => '静安区',
        310107 => '普陀区',
        310108 => '闸北区',
        310109 => '虹口区',
        310110 => '杨浦区',
        310112 => '闵行区',
        310113 => '宝山区',
        310114 => '嘉定区',
        310115 => '浦东新区',
        310116 => '金山区',
        310117 => '松江区',
        310118 => '青浦区',
        310120 => '奉贤区',
        310130 => '崇明区'
    ],
    'subways' => ["1号线","2号线","3号线","4号线","5号线","6号线","7号线","8号线","9号线",
        "10号线","11号线","12号线","13号线","14号线","15号线","16号线","17号线","18号线"],
    'priceRanges' => [
        [
            "min_price" => null,
            "max_price" => 1000
        ],
        [
            "min_price" => 1000,
            "max_price" => 1500
        ],
        [
            "min_price" => 1500,
            "max_price" => 2000
        ],
        [
            "min_price" => 2000,
            "max_price" => 2500
        ],
        [
            "min_price" => 2500,
            "max_price" => 3000
        ],
        [
            "min_price" => 3000,
            "max_price" => 4000
        ],
        [
            "min_price" => 4000,
            "max_price" => 5000
        ],
        [
            "min_price" => 5000,
            "max_price" => null
        ]

    ],
    'orientation' => ['未知', '东', '南', '西', '北', '东南', '东北', '西南', '西北'],
    'facilities' => [
        'bed' => [
            'title' => '床',
            'image' => 'http://img.afantizz.com/facility/bed.png'
        ],
        'wardrobe' => [
            'title' => '衣柜',
            'image' => 'http://img.afantizz.com/facility/wardrobe.png'
        ],
        'sofa' => [
            'title' => '沙发',
            'image' => 'http://img.afantizz.com/facility/sofa.png'
        ],
        'tv' => [
            'title' => '电视',
            'image' => 'http://img.afantizz.com/facility/tv.png'
        ],
        'fridge' => [
            'title' => '冰箱',
            'image' => 'http://img.afantizz.com/facility/fridge.png'
        ],
        'washer' => [
            'title' => '洗衣机',
            'image' => 'http://img.afantizz.com/facility/washer.png'
        ],
        'air-conditioning' => [
            'title' => '空调',
            'image' => 'http://img.afantizz.com/facility/airconditioning.png'
        ],
        'water-heater' => [
            'title' => '热水器',
            'image' => 'http://img.afantizz.com/facility/shower.png'
        ],
        'wifi' => [
            'title' => '宽带',
            'image' => 'http://img.afantizz.com/facility/wifi.png'
        ],
        'heating-installation' => [
            'title' => '暖气',
            'image' => 'http://img.afantizz.com/facility/heating.png'
        ],
        'kitchen' => [
            'title' => '可做饭',
            'image' => 'http://img.afantizz.com/facility/kitchen.png'
        ],
        'balcony' => [
            'title' => '阳台',
            'image' => 'http://img.afantizz.com/facility/balcony.png'
        ],
        'toilet' => [
            'title' => '独立卫生间',
            'image' => 'http://img.afantizz.com/facility/toilet.png'
        ]
    ]
];

