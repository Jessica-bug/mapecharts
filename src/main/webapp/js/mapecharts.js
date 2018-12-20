/**
 * Created by Administrator on 2018/11/13 0013.
 */
// ECharts: A Declarative Framework for Rapid Construction of Web-based Visualization
// Deqing Li, Honghui Mei, Yi Shen, Shuang Su, Wenli Zhang, Junting Wang, Ming Zu, Wei Chen.

//这是设置全屏的宽高随屏幕的不同宽度而变化
$("#mask-body").width($(document.body).width() - 100);
$("#mask-body").height($(document.body).height() - 20);
$("#mask").css('display', "none");
$("#mask-header>button").click(function () {
    $("#mask").css('display', "none");
    $("#mapdiv").css('display', 'block');
});

// Step:3 为模块加载器配置echarts的路径，从当前页面链接到echarts.js，定义所需图表路径
// require.config({
//     paths: {
//         echarts: '../html/www/js'
//     }
// });

//图一
function createmap1(id, data) {
    $.get(_ctx + '/map/json/china.json', function (geoJson) {
        var map1 = echarts.init(document.getElementById(id))
        echarts.registerMap('china', geoJson)
        var option = {
            backgroundColor: '#D7E7FF',
            // title : {
            //     text: 'iphone销量',
            //     subtext: '纯属虚构',
            //     x:'center'
            // },
            tooltip: {
                trigger: 'item'
            },
            // legend: {
            //     orient: 'vertical',
            //     x:'left',
            //     data:['iphone3','iphone4','iphone5']
            // },
            dataRange: {
                min: 0,
                max: 2500,
                color: ["#E5672C", "#E0E52C", "#2D65BE"],
                x: 'left',
                y: 'bottom',
                text: ['高', '低'],           // 文本，默认为数值文本
                calculable: true
            },
            toolbox: {
                show: true,
                // orient : 'vertical',
                x: 'right',
                y: 'bottom',
                feature: {
                    mark: {show: true},
                    // dataView : {show: true, readOnly: false},
                    restore: {show: true},
                    // saveAsImage : {show: true}
                    myTool2: {
                        show: true,
                        title: '全屏显示',
                        icon: 'image://../img/fullscreen.png',
                        onclick: function () {
                            $("#mapdiv").css('display', 'none');
                            $("#mask").css("display", "block");
                            $("body").css("overflow-y", "hidden");
                            $('#mask-body').remove();
                            $('#mask').append('<div id="mask-body"></div>');
                            $("#mask-body").width($(document.body).width() - 100);
                            // $("#mask-body").height($(document.body).height()-20);
                            $("#mask-body").height($(window).height() - 20);
                            createmap1("mask-body", map1data);
                        }
                    }
                }
            },
            roamController: {
                show: true,
                x: 'right',
                mapTypeControl: {
                    'china': true
                }
            },
            series: [
                {
                    name: 'iphone3',
                    type: 'map',
                    mapType: 'china',
                    roam: false,
                    itemStyle: {
                        normal: {label: {show: true}},
                        emphasis: {label: {show: true}}
                    },
                    data: data
                }
            ]
        };
        map1.setOption(option, true)
    });
}

//图二
function createmap2(id, data, geoCoordMap) {
    $.get(_ctx + '/map/json/china.json', function (geoJson) {

        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            return res;
        };

        var option = {
            // backgroundColor: '#ffffff',
            backgroundColor: '#404a59',
            /*title: {
             text: '全国主要城市空气质量',
             subtext: 'data from PM25.in',
             sublink: 'http://www.pm25.in',
             left: 'center',
             textStyle: {
             color: '#fff'
             }
             },*/
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return params.name + '<br/>' +
                        params.seriesName + ": " + params.value[2]
                }
            },
            legend: {
                orient: 'vertical',
                y: 'bottom',
                x: 'left',
                data: ['pm2.5'],
                textStyle: {
                    color: '#fff'
                }
            },
            toolbox: {
                show: true,
                // orient : 'vertical',
                x: 'right',
                y: 'bottom',
                feature: {
                    mark: {show: true},
                    // dataView : {show: true, readOnly: false},
                    restore: {show: true},
                    // saveAsImage : {show: true}
                    myTool2: {
                        show: true,
                        title: '全屏显示',
                        icon: 'image://../img/fullscreen.png',
                        onclick: function () {
                            $("#mapdiv").css('display', 'none');
                            $("#mask").css("display", "block");
                            $("body").css("overflow-y", "hidden");
                            $('#mask-body').remove();
                            $('#mask').append('<div id="mask-body"></div>');
                            $("#mask-body").width($(document.body).width() - 100);
                            // $("#mask-body").height($(document.body).height()-20);
                            $("#mask-body").height($(window).height() - 20);
                            createmap2("mask-body", map2data, geoCoordMap);
                        }
                    }
                }
            },
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#111'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            },
            series: [
                {
                    name: 'pm2.5',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: convertData(data),
                    symbolSize: function (val) {
                        return val[2] / 10;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#ddb926'
                        }
                    }
                },
                {
                    name: 'Top 5',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: convertData(data.sort(function (a, b) {
                        return b.value - a.value;
                    }).slice(0, 3)),
                    symbolSize: function (val) {
                        return val[2] / 10;
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'fill'
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#f4e925',
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    zlevel: 1
                }
            ]
        };
        var map2 = echarts.init(document.getElementById(id));
        echarts.registerMap('china', geoJson);
        map2.setOption(option);
    })
};

//图三
function createmap3(id, geoCoordMap,BJData) {
    $.get(_ctx + '/map/json/china.json', function (geoJson) {

        var myChart=echarts.init(document.getElementById(id))
        echarts.registerMap('china',geoJson)
        var myHosName = ['张三','李四'];
        var option = null;

        var planePath = "path://M917.965523 917.331585c0 22.469758-17.891486 40.699957-39.913035 40.699957-22.058388 0-39.913035-18.2302-39.913035-40.699957l-0.075725-0.490164-1.087774 0c-18.945491-157.665903-148.177807-280.296871-306.821991-285.4748-3.412726 0.151449-6.751774 0.562818-10.240225 0.562818-3.450589 0-6.789637-0.410346-10.202363-0.524956-158.606321 5.139044-287.839661 127.806851-306.784128 285.436938l-1.014096 0 0.075725 0.490164c0 22.469758-17.854647 40.699957-39.913035 40.699957s-39.915082-18.2302-39.915082-40.699957l-0.373507-3.789303c0-6.751774 2.026146-12.903891 4.91494-18.531052 21.082154-140.712789 111.075795-258.241552 235.432057-312.784796C288.420387 530.831904 239.989351 444.515003 239.989351 346.604042c0-157.591201 125.33352-285.361213 279.924387-285.361213 154.62873 0 279.960203 127.770012 279.960203 285.361213 0 97.873098-48.391127 184.15316-122.103966 235.545644 124.843356 54.732555 215.099986 172.863023 235.808634 314.211285 2.437515 5.290493 4.01443 10.992355 4.01443 17.181311L917.965523 917.331585zM719.822744 346.679767c0-112.576985-89.544409-203.808826-199.983707-203.808826-110.402459 0-199.944821 91.232864-199.944821 203.808826s89.542362 203.808826 199.944821 203.808826C630.278335 550.488593 719.822744 459.256752 719.822744 346.679767z";
        //    简笔人2
        //    var  planePath="path://M621.855287 587.643358C708.573965 540.110571 768 442.883654 768 330.666667 768 171.608659 648.609267 42.666667 501.333333 42.666667 354.057399 42.666667 234.666667 171.608659 234.666667 330.666667 234.666667 443.22333 294.453005 540.699038 381.59961 588.07363 125.9882 652.794383 21.333333 855.35859 21.333333 1002.666667L486.175439 1002.666667 1002.666667 1002.666667C1002.666667 815.459407 839.953126 634.458526 621.855287 587.643358Z";

        var convertData = function(data) {
            var res = [];
            for (var i = 0; i < data.coords.length; i++) {
                var dataItem = data.coords[i];
                var fromCoord = geoCoordMap[dataItem.fromcity];
                var toCoord = geoCoordMap[dataItem.tocity];
                if (fromCoord && toCoord) {
                    res.push({
                        fromName: dataItem.fromcity,
                        toName: dataItem.tocity,
                        coords: [fromCoord, toCoord]
                    });
                }
            }
            console.info(res)
            return res;
        };
        var convertData1 = function(data) {
            var res = [];
            var temparr=[];
            for (var i = 0; i < data.coords.length; i++) {
                var dataItem = data.coords[i];
                var fromCoord = geoCoordMap[dataItem.fromcity];
                var toCoord = geoCoordMap[dataItem.tocity];
                if (fromCoord && toCoord) {
                    //对相同地点的轨迹值做叠加处理
                    var hasname1=false,hasname2=false;
                    var value1=0,value2=0;
                    for(var j in temparr){
                        var temip=temparr[j];
                        if(temip.name==dataItem.fromcity){
                            temip.value=temip.value+dataItem.value;
                            value1=temip.value;
                            hasname1=true;
                        }
                        if(temip.name==dataItem.tocity){
                            temip.value=temip.value+dataItem.value;
                            value2=temip.value;
                            hasname2=true;
                        }
                    }
                    if(!hasname1){
                        value1=dataItem.value;
                        temparr.push({name:dataItem.fromcity,value:dataItem.value});
                    }
                    if(!hasname2){
                        value2=dataItem.value;
                        temparr.push({name:dataItem.tocity,value:dataItem.value})
                    }

                    res.push({
                        name:dataItem.fromcity,
                        coord:fromCoord,
                        value:value1    //dataItem.value
                    });
                    res.push({
                        name:dataItem.tocity,
                        coord:toCoord,
                        value:value2    //dataItem.value
                    });
                }
            }
            console.info(res)
            return res;
        };

        var color = ['#a6c84c', '#ffa022', '#46bee9','#793BE3','#D6DB1C'];
        var mySeries = [];

        BJData.forEach(function(item, i) {console.info(item)
            mySeries.push(
                { //移动 点
                    name: item.name,
                    type: 'lines',
                    zlevel: 2,
                    //需要动画效果可放开下方注释
                    /*effect: {
                     show: true,
                     period: 6,
                     trailLength: 0,
                     symbol: planePath,
                     symbolSize: 10
                     },*/
                    lineStyle: {
                        normal: {
                            color: color[i],
                            width: 1,
                            opacity: 0.4/*,
                             curveness: 0.1*///线的弧度
                        }
                    },
                    data: convertData(item),
                    markPoint:{
                        symbol:'emptyPin',
                        symbolSize:20,
                        itemStyle:{
                            normal:{
                                label: {
                                    show:true,
                                    position: 'inside',
                                    formatter: function (param) {
                                        return param.value+'\n\n'+param.name;
                                    }
                                }
                            }
                        },
                        data:convertData1(item)
                    }
                }
            );
        });

        option = {
            backgroundColor: '#404a59',
            toolbox: {
                show: true,
                // orient : 'vertical',
                x: 'right',
                y: 'bottom',
                feature: {
                    mark: {show: true},
                    // dataView : {show: true, readOnly: false},
                    restore: {show: true},
                    // saveAsImage : {show: true}
                    myTool2: {
                        show: true,
                        title: '全屏显示',
                        icon: 'image://../img/fullscreen.png',
                        onclick: function () {
                            $("#mapdiv").css('display', 'none');
                            $("#mask").css("display", "block");
                            $("body").css("overflow-y", "hidden");
                            $('#mask-body').remove();
                            $('#mask').append('<div id="mask-body"></div>');
                            $("#mask-body").width($(document.body).width() - 100);
                            // $("#mask-body").height($(document.body).height()-20);
                            $("#mask-body").height($(window).height() - 20);
                            createmap3("mask-body", geoCoordMap, BJData);
                        }
                    }
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if(params.data.hasOwnProperty('fromName'))
                        return params.data.fromName + '--' + params.data.toName;
                    else
                        return params.data.name+':'+params.data.value;
                    /*if (params.seriesIndex==1||params.seriesIndex == 2 || params.seriesIndex == 5 || params.seriesIndex == 8) {
                        return params.name + '<br>' + '物理大师区域代理';
                    } else if (params.seriesIndex == 0 || params.seriesIndex == 4 || params.seriesIndex == 7) {
                        if(params.data.hasOwnProperty('fromName'))
                            return params.data.fromName + '→' + params.data.toName;
                        else
                            return params.data.name+':'+params.data.value;
                    }*/
                }
            },
            legend: {
                orient: 'vertical',
                top: 'bottom',
                left: 'left',
                data: [myHosName[0],myHosName[1]],
                textStyle: {
                    color: '#fff'
                }/*,
                selectedMode: 'single'*/
            },
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: true
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#404a59'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            },
            series: mySeries
        };

        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
        window.onresize = function() {
            myChart.resize();
        }

    });

    /*$.get(_ctx + '/map/json/china.json', function (geoJson) {

        var myChart=echarts.init(document.getElementById(id))
        echarts.registerMap('china',geoJson)
        var myMounth = '全年';
        var myHosName = '杭州市';
        var option = null;

        var planePath = "path://M917.965523 917.331585c0 22.469758-17.891486 40.699957-39.913035 40.699957-22.058388 0-39.913035-18.2302-39.913035-40.699957l-0.075725-0.490164-1.087774 0c-18.945491-157.665903-148.177807-280.296871-306.821991-285.4748-3.412726 0.151449-6.751774 0.562818-10.240225 0.562818-3.450589 0-6.789637-0.410346-10.202363-0.524956-158.606321 5.139044-287.839661 127.806851-306.784128 285.436938l-1.014096 0 0.075725 0.490164c0 22.469758-17.854647 40.699957-39.913035 40.699957s-39.915082-18.2302-39.915082-40.699957l-0.373507-3.789303c0-6.751774 2.026146-12.903891 4.91494-18.531052 21.082154-140.712789 111.075795-258.241552 235.432057-312.784796C288.420387 530.831904 239.989351 444.515003 239.989351 346.604042c0-157.591201 125.33352-285.361213 279.924387-285.361213 154.62873 0 279.960203 127.770012 279.960203 285.361213 0 97.873098-48.391127 184.15316-122.103966 235.545644 124.843356 54.732555 215.099986 172.863023 235.808634 314.211285 2.437515 5.290493 4.01443 10.992355 4.01443 17.181311L917.965523 917.331585zM719.822744 346.679767c0-112.576985-89.544409-203.808826-199.983707-203.808826-110.402459 0-199.944821 91.232864-199.944821 203.808826s89.542362 203.808826 199.944821 203.808826C630.278335 550.488593 719.822744 459.256752 719.822744 346.679767z";
        //    简笔人2
        //    var  planePath="path://M621.855287 587.643358C708.573965 540.110571 768 442.883654 768 330.666667 768 171.608659 648.609267 42.666667 501.333333 42.666667 354.057399 42.666667 234.666667 171.608659 234.666667 330.666667 234.666667 443.22333 294.453005 540.699038 381.59961 588.07363 125.9882 652.794383 21.333333 855.35859 21.333333 1002.666667L486.175439 1002.666667 1002.666667 1002.666667C1002.666667 815.459407 839.953126 634.458526 621.855287 587.643358Z";

        var convertData = function(data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var fromCoord = geoCoordMap[dataItem[0].name];
                var toCoord = geoCoordMap[dataItem[1].name];
                if (fromCoord && toCoord) {
                    res.push({
                        fromName: dataItem[0].name,
                        toName: dataItem[1].name,
                        coords: [fromCoord, toCoord]
                    });
                }
            }
            console.info(res)
            return res;
        };
        var convertData1 = function(data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var fromCoord = geoCoordMap[dataItem[0].name];
                var toCoord = geoCoordMap[dataItem[1].name];
                if (fromCoord && toCoord) {
                    res.push({
                        name:dataItem[0].name,
                        coord:fromCoord,
                        value:dataItem[1].value
                    });
                    res.push({
                        name:dataItem[1].name,
                        coord:toCoord,
                        value:dataItem[1].value
                    })

                }
            }
            console.info(res)
            return res;
        };

        var color = ['#a6c84c', '#ffa022', '#46bee9','#793BE3','#D6DB1C'];
        var mySeries = [];
        [
            [myHosName, BJData]
        ].forEach(function(item, i) {console.info(item)
            mySeries.push(
                /!*{ //线
                name: item[0],
                //                      name: item[0] + ' Top10',
                type: 'lines',
                zlevel: 1,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    color: '#fff',
                    symbolSize: 1
                },
                lineStyle: {
                    normal: {
                        color: color[0],
                        width: 0,
                        curveness: 0.1
                    }
                },
                data: convertData(item[1])
            },*!/
                { //移动 点
                    name: item[0],
                    //                      name: item[0] + ' Top10',
                    type: 'lines',
                    zlevel: 2,
                    /!*effect: {
                        show: true,
                        period: 6,
                        trailLength: 0,
                        symbol: planePath,
                        symbolSize: 10
                    },*!/
                    lineStyle: {
                        normal: {
                            color: color[1],
                            width: 1,
                            opacity: 0.4/!*,
                            curveness: 0.2*!///线的弧度
                        }
                    },
                    data: convertData(item[1]),
                    markPoint:{
                        symbol:'emptyPin',
                        symbolSize:20,
                        itemStyle:{
                            normal:{
                                label: {
                                    show:true,
                                    position: 'inside',
                                    formatter: function (param) {
                                        console.info(11)
                                        console.info(param)
                                        return param.value;
                                    }
                                }
                            }
                        },

                        data:convertData1(item[1])

                    }
                }/!*,
                { //省份圆点
                    name: item[0],
                    //                      name: item[0] + ' Top10',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 5,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    symbolSize: function(val) {
                        return val[2] / 20;
                    },
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                var tmp = params.data.value[2]
                                if (tmp < 100) {
                                    return 'red';
                                } else if (tmp > 150) {
                                    return 'yellow'
                                } else
                                    return 'yellow';
                            }
                        }
                    },
                    data: item[1].map(function(dataItem) {
                        return {
                            name: dataItem[1].name,
                            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                        };
                    })
                }*!/
            );
        });

        option = {
            backgroundColor: '#404a59',
            toolbox: {
                show: true,
                // orient : 'vertical',
                x: 'right',
                y: 'bottom',
                feature: {
                    mark: {show: true},
                    // dataView : {show: true, readOnly: false},
                    restore: {show: true},
                    // saveAsImage : {show: true}
                    myTool2: {
                        show: true,
                        title: '全屏显示',
                        icon: 'image://../img/fullscreen.png',
                        onclick: function () {
                            $("#mapdiv").css('display', 'none');
                            $("#mask").css("display", "block");
                            $("body").css("overflow-y", "hidden");
                            $('#mask-body').remove();
                            $('#mask').append('<div id="mask-body"></div>');
                            $("#mask-body").width($(document.body).width() - 100);
                            // $("#mask-body").height($(document.body).height()-20);
                            $("#mask-body").height($(window).height() - 20);
                            createmap3("mask-body", geoCoordMap, BJData);
                        }
                    }
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (params.seriesIndex==1||params.seriesIndex == 2 || params.seriesIndex == 5 || params.seriesIndex == 8) {
                        return params.name + '<br>' + '物理大师区域代理';
                    } else if (params.seriesIndex == 0 || params.seriesIndex == 4 || params.seriesIndex == 7) {
                        if(params.data.hasOwnProperty('fromName'))
                            return params.data.fromName + '→' + params.data.toName;
                        else
                            return params.data.name+':'+params.data.value;
                    }
                }
            },
            legend: {
                orient: 'vertical',
                top: '6%',
                left: 'center',
                data: [myHosName],
                textStyle: {
                    color: '#fff'
                },
                selectedMode: 'single'
            },
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#404a59'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            },
            series: mySeries
        };


        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }

        window.onresize = function() {
            myChart.resize();
        }

    });*/

};

var map1data = [
    {name: '北京', value: Math.round(Math.random() * 2500)},
    {name: '天津', value: Math.round(Math.random() * 1000)},
    {name: '上海', value: Math.round(Math.random() * 1000)},
    {name: '重庆', value: Math.round(Math.random() * 2000)},
    {name: '河北', value: Math.round(Math.random() * 1000)},
    {name: '河南', value: Math.round(Math.random() * 1000)},
    {name: '云南', value: Math.round(Math.random() * 1000)},
    {name: '辽宁', value: Math.round(Math.random() * 1000)},
    {name: '黑龙江', value: Math.round(Math.random() * 1000)},
    {name: '湖南', value: Math.round(Math.random() * 1000)},
    {name: '安徽', value: Math.round(Math.random() * 1500)},
    {name: '山东', value: Math.round(Math.random() * 1000)},
    {name: '新疆', value: Math.round(Math.random() * 1000)},
    {name: '江苏', value: Math.round(Math.random() * 800)},
    {name: '浙江', value: Math.round(Math.random() * 1000)},
    {name: '江西', value: Math.round(Math.random() * 1000)},
    {name: '湖北', value: Math.round(Math.random() * 1000)},
    {name: '广西', value: Math.round(Math.random() * 1000)},
    {name: '甘肃', value: Math.round(Math.random() * 1000)},
    {name: '山西', value: Math.round(Math.random() * 500)},
    {name: '内蒙古', value: Math.round(Math.random() * 1000)},
    {name: '陕西', value: Math.round(Math.random() * 1800)},
    {name: '吉林', value: Math.round(Math.random() * 1000)},
    {name: '福建', value: Math.round(Math.random() * 2100)},
    {name: '贵州', value: Math.round(Math.random() * 1000)},
    {name: '广东', value: Math.round(Math.random() * 1000)},
    {name: '青海', value: Math.round(Math.random() * 1000)},
    {name: '西藏', value: Math.round(Math.random() * 1000)},
    {name: '四川', value: Math.round(Math.random() * 1000)},
    {name: '宁夏', value: Math.round(Math.random() * 1000)},
    {name: '海南', value: Math.round(Math.random() * 1000)},
    {name: '台湾', value: Math.round(Math.random() * 1000)},
    {name: '香港', value: Math.round(Math.random() * 1000)},
    {name: '澳门', value: Math.round(Math.random() * 1000)}
];
createmap1('map1', map1data);

var map2data = [
    {name: '海门', value: 9},
    {name: '鄂尔多斯', value: 12},
    {name: '招远', value: 12},
    {name: '舟山', value: 12},
    {name: '齐齐哈尔', value: 14},
    {name: '盐城', value: 15},
    {name: '赤峰', value: 16},
    {name: '青岛', value: 18},
    {name: '乳山', value: 18},
    {name: '金昌', value: 19},
    {name: '泉州', value: 21},
    {name: '莱西', value: 21},
    {name: '日照', value: 21},
    {name: '胶南', value: 22},
    {name: '南通', value: 23},
    {name: '拉萨', value: 24},
    {name: '云浮', value: 24},
    {name: '梅州', value: 25},
    {name: '文登', value: 25},
    {name: '上海', value: 25},
    {name: '攀枝花', value: 25},
    {name: '威海', value: 25},
    {name: '承德', value: 25},
    {name: '厦门', value: 26},
    {name: '汕尾', value: 26},
    {name: '潮州', value: 26},
    {name: '丹东', value: 27},
    {name: '太仓', value: 27},
    {name: '曲靖', value: 27},
    {name: '烟台', value: 28},
    {name: '福州', value: 29},
    {name: '瓦房店', value: 30},
    {name: '即墨', value: 30},
    {name: '抚顺', value: 31},
    {name: '玉溪', value: 31},
    {name: '张家口', value: 31},
    {name: '阳泉', value: 31},
    {name: '莱州', value: 32},
    {name: '湖州', value: 32},
    {name: '汕头', value: 32},
    {name: '昆山', value: 33},
    {name: '宁波', value: 33},
    {name: '湛江', value: 33},
    {name: '揭阳', value: 34},
    {name: '荣成', value: 34},
    {name: '连云港', value: 35},
    {name: '葫芦岛', value: 35},
    {name: '常熟', value: 36},
    {name: '东莞', value: 36},
    {name: '河源', value: 36},
    {name: '淮安', value: 36},
    {name: '泰州', value: 36},
    {name: '南宁', value: 37},
    {name: '营口', value: 37},
    {name: '惠州', value: 37},
    {name: '江阴', value: 37},
    {name: '蓬莱', value: 37},
    {name: '韶关', value: 38},
    {name: '嘉峪关', value: 38},
    {name: '广州', value: 38},
    {name: '延安', value: 38},
    {name: '太原', value: 39},
    {name: '清远', value: 39},
    {name: '中山', value: 39},
    {name: '昆明', value: 39},
    {name: '寿光', value: 40},
    {name: '盘锦', value: 40},
    {name: '长治', value: 41},
    {name: '深圳', value: 41},
    {name: '珠海', value: 42},
    {name: '宿迁', value: 43},
    {name: '咸阳', value: 43},
    {name: '铜川', value: 44},
    {name: '平度', value: 44},
    {name: '佛山', value: 44},
    {name: '海口', value: 44},
    {name: '江门', value: 45},
    {name: '章丘', value: 45},
    {name: '肇庆', value: 46},
    {name: '大连', value: 47},
    {name: '临汾', value: 47},
    {name: '吴江', value: 47},
    {name: '石嘴山', value: 49},
    {name: '沈阳', value: 50},
    {name: '苏州', value: 50},
    {name: '茂名', value: 50},
    {name: '嘉兴', value: 51},
    {name: '长春', value: 51},
    {name: '胶州', value: 52},
    {name: '银川', value: 52},
    {name: '张家港', value: 52},
    {name: '三门峡', value: 53},
    {name: '锦州', value: 54},
    {name: '南昌', value: 54},
    {name: '柳州', value: 54},
    {name: '三亚', value: 54},
    {name: '自贡', value: 56},
    {name: '吉林', value: 56},
    {name: '阳江', value: 57},
    {name: '泸州', value: 57},
    {name: '西宁', value: 57},
    {name: '宜宾', value: 58},
    {name: '呼和浩特', value: 58},
    {name: '成都', value: 58},
    {name: '大同', value: 58},
    {name: '镇江', value: 59},
    {name: '桂林', value: 59},
    {name: '张家界', value: 59},
    {name: '宜兴', value: 59},
    {name: '北海', value: 60},
    {name: '西安', value: 61},
    {name: '金坛', value: 62},
    {name: '东营', value: 62},
    {name: '牡丹江', value: 63},
    {name: '遵义', value: 63},
    {name: '绍兴', value: 63},
    {name: '扬州', value: 64},
    {name: '常州', value: 64},
    {name: '潍坊', value: 65},
    {name: '重庆', value: 66},
    {name: '台州', value: 67},
    {name: '南京', value: 67},
    {name: '滨州', value: 70},
    {name: '贵阳', value: 71},
    {name: '无锡', value: 71},
    {name: '本溪', value: 71},
    {name: '克拉玛依', value: 72},
    {name: '渭南', value: 72},
    {name: '马鞍山', value: 72},
    {name: '宝鸡', value: 72},
    {name: '焦作', value: 75},
    {name: '句容', value: 75},
    {name: '北京', value: 79},
    {name: '徐州', value: 79},
    {name: '衡水', value: 80},
    {name: '包头', value: 80},
    {name: '绵阳', value: 80},
    {name: '乌鲁木齐', value: 84},
    {name: '枣庄', value: 84},
    {name: '杭州', value: 84},
    {name: '淄博', value: 85},
    {name: '鞍山', value: 86},
    {name: '溧阳', value: 86},
    {name: '库尔勒', value: 86},
    {name: '安阳', value: 90},
    {name: '开封', value: 90},
    {name: '济南', value: 92},
    {name: '德阳', value: 93},
    {name: '温州', value: 95},
    {name: '九江', value: 96},
    {name: '邯郸', value: 98},
    {name: '临安', value: 99},
    {name: '兰州', value: 99},
    {name: '沧州', value: 100},
    {name: '临沂', value: 103},
    {name: '南充', value: 104},
    {name: '天津', value: 105},
    {name: '富阳', value: 106},
    {name: '泰安', value: 112},
    {name: '诸暨', value: 112},
    {name: '郑州', value: 113},
    {name: '哈尔滨', value: 114},
    {name: '聊城', value: 116},
    {name: '芜湖', value: 117},
    {name: '唐山', value: 119},
    {name: '平顶山', value: 119},
    {name: '邢台', value: 119},
    {name: '德州', value: 120},
    {name: '济宁', value: 120},
    {name: '荆州', value: 127},
    {name: '宜昌', value: 130},
    {name: '义乌', value: 132},
    {name: '丽水', value: 133},
    {name: '洛阳', value: 134},
    {name: '秦皇岛', value: 136},
    {name: '株洲', value: 143},
    {name: '石家庄', value: 147},
    {name: '莱芜', value: 148},
    {name: '常德', value: 152},
    {name: '保定', value: 153},
    {name: '湘潭', value: 154},
    {name: '金华', value: 157},
    {name: '岳阳', value: 169},
    {name: '长沙', value: 175},
    {name: '衢州', value: 177},
    {name: '廊坊', value: 193},
    {name: '菏泽', value: 194},
    {name: '合肥', value: 229},
    {name: '武汉', value: 273},
    {name: '大庆', value: 279},
    {name: "阿坝", value: 360},
];
//所有地市的坐标点
var geoCoordMap = {
    "阿巴嘎旗": [114.97, 44.03],
    "阿巴哈纳尔旗": [116.08, 43.95],
    "阿坝": [101.72, 31.93],
    "阿城": [126.95, 45.52],
    "阿合奇": [78.42, 41.91],
    "阿克塞": [94.25, 38.46],
    "阿克苏": [80.29, 41.15],
    "阿克陶": [75.94, 39.14],
    "阿拉善右旗": [101.68, 39.2],
    "阿拉善左旗": [105.68, 38.85],
    "阿勒泰": [88.14, 47.86],
    "阿鲁科尔沁旗": [120.05, 43.97],
    "阿荣旗": [123.5, 48.13],
    "阿图什": [76.12, 39.73],
    "阿瓦提": [80.34, 40.64],
    "爱辉": [127.53, 50.22],
    "安次": [116.69, 39.52],
    "安达": [125.33, 46.42],
    "安多": [91.68, 32.29],
    "安福": [114.62, 27.39],
    "安国": [115.3, 38.41],
    "安化": [111.2, 28.38],
    "安吉": [119.68, 30.68],
    "安康": [109.02, 32.7],
    "安龙": [105.49, 25.11],
    "安陆": [113.69, 31.25],
    "安宁": [102.44, 24.95],
    "安平": [115.5, 38.22],
    "安庆": [117.03, 30.52],
    "安丘": [119.2, 36.42],
    "安仁": [113.27, 26.71],
    "安顺": [105.92, 26.25],
    "安图": [128.3, 42.58],
    "安西": [95.77, 40.51],
    "安溪": [118.18, 25.07],
    "安县": [104.41, 31.64],
    "安乡": [112.16, 29.41],
    "安新": [115.92, 38.92],
    "安阳": [114.35, 36.1],
    "安义": [115.55, 28.86],
    "安远": [115.41, 25.15],
    "安岳": [105.3, 30.12],
    "安泽": [112.2, 36.15],
    "安寨": [109.34, 36.88],
    "鞍山": [122.85, 41.12],
    "昂仁": [87.22, 29.3],
    "敖汉旗": [119.87, 42.3],
    "澳门": [113.33, 22.13],
    "八宿": [96.95, 30.04],
    "巴楚": [78.59, 39.78],
    "巴里坤": [93, 43.6],
    "巴林右旗": [118.65, 43.52],
    "巴林左旗": [119.35, 43.98],
    "巴马": [107.25, 24.15],
    "巴青": [94.1, 31.96],
    "巴塘": [99, 30],
    "巴彦": [127.38, 46.08],
    "巴中": [106.73, 31.86],
    "霸县": [116.38, 39.12],
    "白城": [122.82, 45.63],
    "白河": [110.06, 32.83],
    "白朗": [89.16, 29.11],
    "白沙": [109.44, 19.23],
    "白水": [109.6, 35.18],
    "白玉": [98.83, 32.23],
    "百色": [106.62, 23.91],
    "百沙": [108.18, 32],
    "柏乡": [114.68, 37.49],
    "拜城": [81.84, 41.82],
    "拜泉": [126.07, 47.62],
    "班戈": [90.05, 31.35],
    "班玛": [100.73, 32.92],
    "蚌埠": [117.34, 32.93],
    "包头": [110, 40.58],
    "宝安": [113.85, 22.58],
    "宝坻": [117.3, 39.75],
    "宝丰": [113.04, 33.86],
    "宝鸡": [107.15, 34.38],
    "宝清": [132.17, 46.33],
    "宝山": [121.48, 31.41],
    "宝兴": [102.84, 30.36],
    "宝应": [119.32, 33.23],
    "保德": [111.09, 38.01],
    "保定": [115.48, 38.85],
    "保靖": [109.64, 28.7],
    "保亭": [109.7, 18.64],
    "保由": [99.18, 25.12],
    "北安": [126.5, 48.22],
    "北川": [104.44, 31.89],
    "北海": [109.12, 21.49],
    "北京": [116.46, 39.92],
    "北流": [110.33, 22.71],
    "北票": [120.75, 41.82],
    "北镇": [121.8, 41.6],
    "本溪": [123.73, 41.3],
    "比如": [93.68, 31.53],
    "毕节": [105.29, 27.32],
    "碧江": [98.95, 26.55],
    "壁山": [106.03, 29.86],
    "边坝": [94.69, 30.94],
    "宾川": [100.55, 25.82],
    "宾县": [127.48, 45.75],
    "宾阳": [108.8, 23.22],
    "彬县": [108.09, 35.04],
    "滨海": [119.84, 34.01],
    "滨县": [117.97, 37.47],
    "滨州": [118.03, 37.36],
    "波密": [95.75, 29.92],
    "波阳": [116.68, 29],
    "泊头": [116.56, 38.08],
    "勃利": [130.53, 45.75],
    "博爱": [113.05, 35.16],
    "博白": [109.98, 22.27],
    "博湖": [86.53, 41.95],
    "博乐": [82.1, 44.93],
    "博罗": [114.28, 23.18],
    "博兴": [118.12, 37.12],
    "博野": [115.46, 38.46],
    "布尔津": [86.92, 47.7],
    "布特哈旗": [122.78, 47.98],
    "布拖": [102.8, 27.7],
    "仓山": [118.03, 34.84],
    "苍南": [120.36, 27.53],
    "苍悟": [111.22, 23.51],
    "苍溪": [105.96, 31.75],
    "沧源": [99.24, 23.15],
    "沧州": [116.83, 38.33],
    "曹县": [115.53, 34.83],
    "册亭": [105.79, 25],
    "策勒": [80.78, 37.04],
    "岑巩": [108.72, 27.21],
    "岑溪": [111, 22.95],
    "茶陵": [113.54, 26.79],
    "察布察尔": [81.12, 43.82],
    "察哈尔右翼后旗": [113.15, 41.85],
    "察哈尔右翼前旗": [113.18, 40.78],
    "察哈尔右翼中旗": [112.62, 41.28],
    "察雅": [97.56, 30.69],
    "察隅": [97.49, 28.62],
    "昌吉": [87.31, 44.05],
    "昌江": [109.03, 19.25],
    "昌乐": [118.83, 36.69],
    "昌黎": [119.15, 39.72],
    "昌宁": [99.61, 24.82],
    "昌平": [116.2, 40.22],
    "昌图": [124.13, 42.8],
    "昌邑": [119.41, 36.86],
    "常德": [111.69, 29.05],
    "常宁": [112.39, 26.38],
    "常山": [118.5, 28.9],
    "常熟": [120.74, 31.64],
    "常州": [119.95, 31.79],
    "巢湖": [117.87, 31.62],
    "巢县": [117.87, 31.62],
    "朝阳": [120.42, 41.58],
    "潮安": [116.63, 23.68],
    "潮阳": [116.61, 23.27],
    "潮州": [116.63, 23.68],
    "郴县": [113, 25.79],
    "郴州": [113, 25.79],
    "辰溪": [110.18, 28.02],
    "陈巴尔虎旗": [119.45, 49.33],
    "称多": [97.12, 33.35],
    "成安": [114.68, 36.43],
    "成城": [109.93, 35.2],
    "成都": [104.06, 30.67],
    "成武": [115.88, 34.97],
    "成县": [105.7, 33.75],
    "呈贡": [102.79, 24.9],
    "承德": [117.93, 40.97],
    "城步": [110.3, 26.37],
    "城固": [107.32, 33.16],
    "城口": [108.67, 31.98],
    "澄海": [116.8, 23.48],
    "澄江": [102.91, 24.68],
    "澄迈": [110, 19.75],
    "茌平": [116.27, 36.58],
    "赤城": [115.82, 40.92],
    "赤峰": [118.87, 42.28],
    "赤水": [105.69, 28.57],
    "崇安": [118.02, 27.76],
    "崇礼": [115.25, 40.98],
    "崇明": [121.4, 31.73],
    "崇庆": [103.69, 30.63],
    "崇仁": [116.05, 27.75],
    "崇信": [107.05, 35.27],
    "崇阳": [114.04, 29.54],
    "崇义": [114.31, 25.69],
    "崇左": [107.37, 22.42],
    "滁州": [118.31, 32.33],
    "楚雄": [101.54, 25.01],
    "川沙": [121.7, 31.19],
    "淳安": [119.05, 29.61],
    "淳化": [108.57, 34.81],
    "慈利": [111.09, 29.41],
    "慈溪": [121.23, 30.18],
    "磁县": [114.37, 36.37],
    "从化": [113.55, 23.57],
    "从江": [108.9, 25.76],
    "措美": [91.4, 28.49],
    "措勤": [85.16, 31.06],
    "错那": [91.91, 27.98],
    "达尔罕茂明安联合旗": [110.42, 41.72],
    "达拉特旗": [110.02, 40.42],
    "达日": [99.68, 33.74],
    "达县": [107.49, 31.23],
    "达孜": [91.39, 29.63],
    "大安": [124.18, 45.5],
    "大厂": [116.98, 39.98],
    "大城": [116.63, 38.7],
    "大方": [105.61, 27.16],
    "大丰": [120.45, 33.19],
    "大关": [103.91, 27.74],
    "大理": [100.19, 25.69],
    "大连": [121.62, 38.92],
    "大名": [115.14, 36.28],
    "大宁": [110.72, 36.47],
    "大埔": [116.7, 24.34],
    "大庆": [125.03, 46.58],
    "大田": [117.83, 25.69],
    "大通": [101.67, 36.92],
    "大同": [113.3, 40.12],
    "大洼": [122.06, 41],
    "大悟": [114.09, 31.56],
    "大新": [107.21, 22.85],
    "大兴": [116.33, 39.73],
    "大姚": [101.34, 25.73],
    "大邑": [103.53, 30.58],
    "大庸": [110.48, 29.13],
    "大余": [114.36, 25.39],
    "大竹": [107.21, 30.75],
    "大足": [105.59, 29.4],
    "代县": [112.97, 39.07],
    "岱山": [122.2, 30.26],
    "丹巴": [101.87, 30.85],
    "丹东": [124.37, 40.13],
    "丹凤": [110.35, 33.71],
    "丹棱": [103.53, 30.04],
    "丹徒": [119.44, 32.2],
    "丹阳": [119.55, 32],
    "丹寨": [107.79, 26.21],
    "单县": [116.07, 34.82],
    "郸城": [115.17, 33.63],
    "儋县": [109.57, 19.52],
    "当涂": [118.49, 31.55],
    "当雄": [91.05, 30.51],
    "砀山": [116.34, 34.42],
    "宕昌": [104.38, 34.06],
    "道孚": [101.14, 30.99],
    "道县": [111.57, 25.52],
    "道真": [107.6, 28.89],
    "稻城": [100.31, 29.04],
    "得荣": [99.25, 28.71],
    "德安": [115.75, 29.33],
    "德保": [106.6, 23.34],
    "德昌": [102.15, 27.4],
    "德都": [126.17, 48.5],
    "德格": [98.57, 31.81],
    "德化": [118.24, 25.5],
    "德惠": [125.68, 44.52],
    "德江": [108.13, 28.27],
    "德钦": [98.93, 28.49],
    "德清": [120.08, 30.54],
    "德庆": [111.75, 23.15],
    "德兴": [117.58, 28.96],
    "德阳": [104.37, 31.13],
    "德州": [116.29, 37.45],
    "灯塔": [123.34, 41.43],
    "登封": [113.02, 34.46],
    "邓县": [112.08, 32.68],
    "磴口": [106.98, 40.33],
    "电白": [110.99, 21.52],
    "垫江": [107.34, 30.36],
    "迭部": [103.23, 34.08],
    "丁青": [95.63, 31.42],
    "定安": [110.31, 19.68],
    "定边": [107.59, 37.6],
    "定海": [122.11, 30.03],
    "定结": [87.77, 28.38],
    "定南": [115.02, 24.7],
    "定日": [87.11, 28.57],
    "定陶": [115.57, 35.07],
    "定西": [104.57, 35.57],
    "定县": [114.02, 38.52],
    "定襄": [112.95, 38.5],
    "定兴": [115.78, 39.28],
    "定远": [117.68, 32.52],
    "东阿": [116.23, 36.32],
    "东安": [111.28, 26.41],
    "东方": [108.64, 19.09],
    "东丰": [125.5, 42.68],
    "东沟": [124.13, 39.97],
    "东莞": [113.75, 23.04],
    "东光": [116.52, 37.89],
    "东海": [118.75, 34.54],
    "东兰": [107.36, 24.53],
    "东明": [115.08, 35.31],
    "东宁": [131.12, 44.07],
    "东平": [116.3, 35.91],
    "东山": [117.4, 23.72],
    "东胜县": [110, 39.83],
    "东台": [120.31, 32.84],
    "东乌珠穆沁旗": [116.97, 45.53],
    "东乡": [103.39, 35.68],
    "东阳": [120.23, 29.27],
    "东营": [118.49, 37.46],
    "东至": [116.99, 30.08],
    "洞口": [110.57, 27.06],
    "洞头": [121.12, 27.84],
    "都安": [108.09, 23.94],
    "都昌": [116.19, 29.29],
    "都兰": [98.13, 36.3],
    "都匀": [107.53, 26.72],
    "斗门": [113.25, 22.2],
    "独山": [107.54, 25.84],
    "杜尔伯特": [124.44, 46.86],
    "堆龙德庆": [90.96, 29.67],
    "敦化": [128.18, 43.35],
    "敦煌": [94.71, 40.13],
    "多伦": [116.48, 42.18],
    "峨边": [103.25, 29.23],
    "峨山": [102.38, 24.16],
    "娥眉": [103.5, 29.62],
    "额尔古纳右旗": [120.08, 50.45],
    "额尔古纳左旗": [121.52, 50.8],
    "额济纳旗": [100.88, 41.9],
    "额敏": [83.62, 46.52],
    "鄂城": [114.87, 30.38],
    "鄂伦春自治旗": [123.7, 50.58],
    "鄂托克旗": [107.97, 39.12],
    "鄂托克前旗": [107.43, 38.18],
    "鄂温克族自治旗": [119.75, 49.13],
    "恩平": [112.29, 22.21],
    "洱源": [99.94, 26.1],
    "二连浩特": [111.96, 43.65],
    "法库": [123.37, 42.52],
    "番禺": [113.36, 22.95],
    "繁昌": [118.21, 31.07],
    "繁峙": [113.28, 39.2],
    "范县": [115.46, 35.9],
    "方城": [112.98, 33.25],
    "方由": [111.24, 37.86],
    "方正": [128.8, 45.83],
    "防城": [108.35, 21.78],
    "房山": [115.98, 39.72],
    "肥城": [116.76, 36.24],
    "肥东": [117.47, 31.89],
    "肥西": [117.15, 31.7],
    "肥乡": [114.8, 36.56],
    "费县": [117.97, 35.26],
    "分宜": [114.68, 27.82],
    "汾西": [111.53, 36.63],
    "汾阳": [111.75, 37.27],
    "丰城": [115.7, 28.19],
    "丰都": [107.7, 29.89],
    "丰南": [118.1, 39.58],
    "丰宁": [116.63, 41.2],
    "丰润": [118.13, 39.82],
    "丰顺": [116.18, 23.78],
    "丰县": [116.57, 34.79],
    "丰镇": [113.15, 40.45],
    "封开": [111.48, 23.45],
    "封丘": [114.04, 35.03],
    "凤城": [124.05, 40.47],
    "凤冈": [107.72, 27.97],
    "凤凰": [109.43, 27.92],
    "凤庆": [99.92, 24.58],
    "凤山": [107.05, 24.55],
    "凤台": [116.71, 32.68],
    "凤县": [106.51, 33.93],
    "凤翔": [107.39, 34.53],
    "凤阳": [117.4, 32.86],
    "奉化": [121.41, 29.66],
    "奉节": [109.52, 31.06],
    "奉贤": [121.46, 30.92],
    "奉新": [115.38, 28.71],
    "佛岗": [113.52, 23.86],
    "佛坪": [108, 33.55],
    "佛山": [113.11, 23.05],
    "扶沟": [114.38, 34.05],
    "扶绥": [107.92, 22.65],
    "扶余": [124.82, 45.2],
    "浮风": [107.87, 34.38],
    "浮山": [111.83, 35.97],
    "涪陵": [107.36, 29.7],
    "福安": [119.65, 27.09],
    "福鼎": [120.2, 27.34],
    "福贡": [98.92, 26.89],
    "福海": [87.51, 47.15],
    "福清": [119.39, 25.73],
    "福泉": [107.51, 26.7],
    "福山": [121.27, 37.49],
    "福州": [119.3, 26.08],
    "抚宁": [119.22, 39.88],
    "抚顺": [123.97, 41.97],
    "抚松": [127.27, 42.33],
    "抚远": [134.15, 48.33],
    "抚州": [116.34, 28],
    "府谷": [111.07, 39.05],
    "阜城": [116.14, 37.87],
    "阜康": [87.94, 44.14],
    "阜南": [115.6, 32.63],
    "阜宁": [119.79, 33.78],
    "阜平": [114.18, 38.85],
    "阜新": [121.65, 42],
    "阜阳": [115.81, 32.89],
    "复县": [121.97, 39.63],
    "富川": [110.26, 24.83],
    "富锦": [132.02, 47.23],
    "富民": [102.48, 25.21],
    "富宁": [105.6, 23.62],
    "富平": [109.17, 34.76],
    "富顺": [104.97, 29.24],
    "富县": [109.37, 36],
    "富阳": [119.95, 30.07],
    "富裕": [124.4, 47.8],
    "富源": [104.24, 25.67],
    "富蕴": [89.44, 47.05],
    "噶尔": [80, 32.08],
    "改则": [84.1, 32.33],
    "盖县": [122.37, 40.42],
    "甘德": [99.89, 33.95],
    "甘谷": [105.35, 34.7],
    "甘洛": [102.74, 28.96],
    "甘南": [123.48, 47.9],
    "甘泉": [109.37, 36.29],
    "甘孜": [99.96, 31.64],
    "赣县": [114.02, 25.85],
    "赣榆": [119.11, 34.83],
    "赣州": [114.92, 25.85],
    "刚察": [100.17, 37.32],
    "岗巴": [88.5, 28.29],
    "皋兰": [103.97, 36.32],
    "高安": [115.38, 28.42],
    "高淳": [118.87, 31.32],
    "高都": [118.47, 36.69],
    "高陵": [109.1, 34.55],
    "高密": [119.75, 36.38],
    "高明": [112.76, 21.71],
    "高平": [112.88, 35.48],
    "高青": [117.66, 37.18],
    "高台": [99.84, 39.14],
    "高唐": [116.23, 36.86],
    "高县": [104.52, 28.4],
    "高阳": [115.78, 38.68],
    "高要": [112.44, 23.05],
    "高邑": [114.58, 37.62],
    "高邮": [119.45, 32.78],
    "高州": [110.83, 21.95],
    "藁城": [114.84, 38.03],
    "咯什": [75.94, 39.52],
    "革吉": [81.13, 32.45],
    "格尔木": [94.9, 36.41],
    "个旧": [102.43, 23.35],
    "耿马": [99.41, 23.56],
    "工布江达": [93.25, 29.92],
    "恭城": [110.81, 24.85],
    "巩留": [82.23, 43.35],
    "巩县": [112.96, 34.76],
    "共和": [100.61, 36.27],
    "贡嘎": [90.96, 29.25],
    "贡觉": [98.29, 30.86],
    "贡山": [98.65, 27.73],
    "沽益": [103.82, 25.62],
    "沽源": [115.68, 41.68],
    "古浪": [102.86, 37.43],
    "古蔺": [105.79, 28.03],
    "古县": [111.9, 36.29],
    "古丈": [109.91, 28.62],
    "固安": [116.29, 39.44],
    "固始": [115.68, 32.17],
    "固阳": [110.03, 41.03],
    "固原": [106.28, 36.01],
    "固镇": [117.32, 33.33],
    "故城": [115.96, 37.36],
    "关岭": [105.62, 25.94],
    "馆陶": [115.4, 36.47],
    "冠县": [115.45, 35.47],
    "灌南": [119.36, 34.09],
    "灌县": [103.61, 31.04],
    "灌阳": [111.14, 25.49],
    "灌云": [119.23, 34.3],
    "光山": [114.91, 32.02],
    "光元": [105.86, 32.44],
    "光泽": [117.34, 27.54],
    "广安": [106.61, 30.48],
    "广昌": [116.32, 26.84],
    "广德": [119.41, 30.89],
    "广丰": [118.2, 28.45],
    "广汉": [104.25, 30.99],
    "广河": [103.54, 35.46],
    "广济": [115.56, 29.85],
    "广灵": [113.27, 39.75],
    "广南": [105.09, 24.05],
    "广宁": [112.43, 23.14],
    "广平": [114.94, 36.49],
    "广饶": [118.41, 37.04],
    "广州": [113.23, 23.16],
    "广宗": [115.14, 37.06],
    "贵池": [117.48, 30.66],
    "贵德": [101.47, 36.02],
    "贵定": [107.22, 26.58],
    "贵南": [100.75, 35.57],
    "贵溪": [117.2, 28.3],
    "贵县": [109.6, 23.11],
    "贵阳": [106.71, 26.57],
    "桂东": [113.91, 25.08],
    "桂林": [110.28, 25.29],
    "桂平": [110.07, 23.38],
    "桂阳": [112.72, 25.73],
    "哈巴河": [86.41, 48.05],
    "哈尔滨": [126.63, 45.75],
    "哈密": [93.44, 42.78],
    "海安": [120.45, 32.57],
    "海城": [122.75, 40.85],
    "海丰": [117.33, 22.98],
    "海康": [110.07, 20.91],
    "海口": [110.35, 20.02],
    "海拉尔": [119.73, 29.22],
    "海林": [129.35, 44.57],
    "海龙": [125.65, 42.53],
    "海伦": [126.97, 47.47],
    "海门": [121.15, 31.89],
    "海宁": [120.69, 30.53],
    "海兴": [117.85, 38.17],
    "海盐": [120.92, 30.53],
    "海晏": [100.99, 36.89],
    "海阳": [121.17, 36.76],
    "海原": [105.64, 36.56],
    "邗江": [119.42, 32.39],
    "邯郸": [114.47, 36.6],
    "含山": [118.11, 31.7],
    "韩城": [110.45, 35.47],
    "汉川": [113.59, 30.63],
    "汉寿": [111.97, 28.9],
    "汉阳": [114.02, 30.57],
    "汉阴": [108.53, 32.9],
    "汉源": [102.66, 29.4],
    "汉中": [108.04, 33.07],
    "行唐": [114.54, 38.42],
    "杭锦后旗": [107.12, 40.88],
    "杭锦旗": [108.7, 39.83],
    "杭州": [120.19, 30.26],
    "毫县": [116.76, 33.86],
    "合川": [106.28, 29.26],
    "合肥": [117.27, 31.86],
    "合江": [105.78, 28.79],
    "合浦": [109.2, 21.33],
    "合山": [108.89, 23.82],
    "合水": [108.02, 35.81],
    "合阳": [110.15, 35.24],
    "和布克赛尔": [85.13, 46.78],
    "和静": [86.35, 42.31],
    "和林格尔": [111.8, 40.4],
    "和龙": [129, 42.52],
    "和平": [114.89, 24.45],
    "和顺": [113.55, 37.33],
    "和硕": [86.84, 42.23],
    "和田": [79.94, 37.12],
    "和县": [118.37, 31.7],
    "和政": [103.31, 35.43],
    "河池": [108.06, 24.7],
    "河间": [116.07, 38.45],
    "河津": [110.7, 35.58],
    "河口": [103.98, 22.52],
    "河南": [101.62, 34.75],
    "河曲": [111.17, 39.38],
    "河源": [114.68, 23.73],
    "荷泽": [115.43, 35.24],
    "贺兰": [106.35, 38.55],
    "贺县": [111.54, 24.44],
    "赫章": [104.71, 27.13],
    "鹤壁": [114.17, 35.9],
    "鹤岗": [130.3, 47.33],
    "鹤庆": [100.18, 26.55],
    "鹤山": [112.94, 22.76],
    "黑河": [127.53, 50.22],
    "黑江": [101.71, 23.4],
    "黑山": [122.12, 41.7],
    "黑水": [102.95, 32.06],
    "横峰": [117.62, 28.42],
    "横山": [109.32, 37.97],
    "横县": [109.2, 22.69],
    "衡东": [112.95, 27.1],
    "衡南": [112.61, 26.89],
    "衡山": [112.86, 27.25],
    "衡水": [115.72, 37.72],
    "衡阳": [112.39, 26.98],
    "红安": [114.61, 31.29],
    "红河": [102.42, 23.35],
    "红原": [102.55, 31.79],
    "洪洞": [111.68, 36.25],
    "洪江": [109.96, 27.1],
    "洪雅": [103.38, 29.95],
    "洪泽": [118.85, 33.28],
    "侯马": [111.45, 35.03],
    "呼和浩特": [111.65, 40.82],
    "呼兰": [126.58, 46],
    "呼玛": [126.6, 51.72],
    "呼图壁": [86.92, 44.18],
    "壶关": [113.23, 35.11],
    "湖口": [116.23, 29.75],
    "湖州": [120.1, 30.86],
    "虎林": [133.97, 45.75],
    "互助": [101.95, 36.84],
    "户县": [108.61, 34.12],
    "花县": [113.19, 23.4],
    "花垣": [109.46, 28.59],
    "华安": [117.53, 25],
    "华池": [108, 36.44],
    "华宁": [102.93, 24.26],
    "华坪": [101.24, 26.63],
    "华容": [112.55, 29.52],
    "华亭": [106.65, 35.21],
    "华县": [109.77, 34.53],
    "华阴": [110.09, 34.58],
    "华云": [106.74, 30.41],
    "滑县": [114.52, 35.57],
    "化德": [114, 41.9],
    "化隆": [102.3, 36.11],
    "化州": [110.59, 21.64],
    "桦川": [130.68, 47.02],
    "桦甸": [126.72, 42.97],
    "桦南": [130.53, 46.25],
    "怀安": [114.38, 40.67],
    "怀德": [124.82, 43.5],
    "怀化": [109.95, 27.52],
    "怀集": [112.18, 23.93],
    "怀来": [115.54, 40.4],
    "怀宁": [116.63, 30.41],
    "怀仁": [113.1, 39.82],
    "怀柔": [116.62, 40.32],
    "怀远": [117.19, 32.95],
    "淮安": [119.15, 33.5],
    "淮北": [116.77, 33.97],
    "淮滨": [115.41, 32.44],
    "淮南": [116.98, 32.62],
    "淮阳": [114.88, 33.74],
    "淮阴": [119.02, 33.62],
    "环江": [108.26, 24.83],
    "环县": [107.33, 36.57],
    "桓台": [118.12, 36.95],
    "黄陂": [114.36, 30.88],
    "黄冈": [114.87, 30.44],
    "黄骅": [117.33, 38.4],
    "黄陵": [109.27, 35.6],
    "黄龙": [109.86, 35.6],
    "黄梅": [115.93, 30.09],
    "黄平": [107.89, 26.89],
    "黄石": [115.09, 30.2],
    "黄县": [120.51, 37.64],
    "黄岩": [121.27, 28.64],
    "湟源": [101.28, 36.72],
    "湟中": [101.57, 36.49],
    "潢川": [115.04, 32.13],
    "珲春": [130.35, 42.85],
    "辉南": [126.03, 42.68],
    "辉县": [113.77, 35.46],
    "徽县": [106.11, 33.78],
    "会昌": [115.79, 25.58],
    "会东": [102.55, 26.74],
    "会理": [102.21, 26.67],
    "会宁": [105.08, 35.72],
    "会同": [109.71, 26.86],
    "会泽": [103.27, 26.41],
    "惠安": [118.78, 25.04],
    "惠东": [114.7, 22.97],
    "惠来": [116.29, 23.07],
    "惠民": [117.51, 17.49],
    "惠水": [106.66, 26.14],
    "惠阳": [114.4, 23.09],
    "惠州": [114.4, 23.09],
    "浑江": [126.4, 41.97],
    "浑源": [113.68, 39.7],
    "获嘉": [113.63, 35.27],
    "获鹿": [114.03, 38.08],
    "霍城": [80.87, 44.07],
    "霍丘": [116.27, 32.32],
    "霍山": [116.32, 31.38],
    "霍县": [111.72, 36.57],
    "鸡东": [131.04, 45.27],
    "鸡四": [130.97, 45.3],
    "鸡泽": [113.85, 36.95],
    "积石山": [102.85, 35.74],
    "吉安": [114.97, 27.12],
    "吉林": [126.57, 43.87],
    "吉隆": [85.29, 28.94],
    "吉木乃": [85.84, 47.42],
    "吉木萨尔": [89.14, 44],
    "吉首": [109.71, 28.3],
    "吉水": [115.14, 27.22],
    "吉田": [118.74, 26.59],
    "吉县": [110.65, 36.12],
    "汲县": [114.05, 35.44],
    "即墨": [120.45, 36.38],
    "集安": [126.17, 41.15],
    "集宁": [113.08, 41.03],
    "集贤": [131.13, 46.7],
    "济南": [117, 36.65],
    "济宁": [116.59, 35.38],
    "济阳": [117.2, 36.97],
    "济源": [112.57, 35.08],
    "绩溪": [118.57, 30.07],
    "蓟县": [117.4, 40.05],
    "稷山": [110.97, 35.6],
    "冀县": [115.56, 37.59],
    "加查": [92.6, 29.09],
    "加格达奇": [124.07, 50.42],
    "佳木斯": [130.35, 46.83],
    "佳县": [110.48, 38.04],
    "枷师": [76.78, 39.46],
    "嘉定": [121.24, 31.4],
    "嘉禾": [112.35, 25.56],
    "嘉黎": [93.46, 30.63],
    "嘉山": [117.98, 32.78],
    "嘉善": [120.92, 30.84],
    "嘉祥": [116.34, 35.41],
    "嘉兴": [120.76, 30.77],
    "嘉荫": [130, 48.93],
    "嘉鱼": [113.91, 29.97],
    "夹江": [103.59, 29.75],
    "郏县": [113.19, 33.98],
    "尖扎": [102, 35.92],
    "监利": [112.9, 29.83],
    "犍为": [103.93, 29.21],
    "简阳": [104.53, 30.38],
    "建昌": [119.78, 40.82],
    "建德": [119.27, 29.49],
    "建湖": [119.77, 33.46],
    "建宁": [116.82, 26.85],
    "建瓯": [118.32, 27.05],
    "建平": [119.63, 41.38],
    "建水": [102.79, 23.64],
    "剑川": [99.88, 26.53],
    "剑阁": [105.45, 32.03],
    "剑河": [108.58, 26.64],
    "江安": [105.06, 28.71],
    "江城": [101.88, 22.58],
    "江川": [102.73, 24.27],
    "江达": [89.19, 31.53],
    "江都": [119.55, 32.43],
    "江华": [111.79, 24.97],
    "江口": [108.82, 27.68],
    "江陵": [112.18, 30.35],
    "江门": [113.06, 22.61],
    "江宁": [118.83, 31.95],
    "江浦": [118.62, 32.07],
    "江山": [118.61, 28.74],
    "江阴": [120.26, 31.91],
    "江永": [111.33, 25.41],
    "江油": [104.7, 31.8],
    "江孜": [89.63, 28.94],
    "将乐": [117.45, 26.73],
    "绛县": [111.58, 35.48],
    "交城": [112.14, 37.55],
    "交河": [116.27, 38.02],
    "交口": [111.2, 36.97],
    "胶南": [119.97, 35.88],
    "胶县": [120, 36.28],
    "椒江": [121.44, 28.67],
    "蛟河": [127.33, 43.75],
    "焦作": [113.21, 35.24],
    "蕉岭": [116.18, 24.66],
    "揭西": [115.82, 23.45],
    "揭阳": [116.35, 23.55],
    "介休": [111.88, 37.03],
    "界首": [115.34, 33.24],
    "金川": [102.03, 31.48],
    "金湖": [119.02, 33.01],
    "金华": [119.64, 29.12],
    "金口": [103.13, 29.24],
    "金门": [118.34, 24.43],
    "金平": [103.24, 22.77],
    "金沙": [106.22, 27.46],
    "金山": [121.16, 30.89],
    "金塔": [98.92, 39.97],
    "金坛": [119.56, 31.74],
    "金堂": [104.32, 30.88],
    "金溪": [116.77, 27.92],
    "金县": [121.7, 39.13],
    "金乡": [116.32, 35.07],
    "金秀": [110.18, 24.14],
    "金阳": [103.22, 27.73],
    "金寨": [115.87, 31.67],
    "津市": [111.87, 29.64],
    "锦屏": [109.18, 26.7],
    "锦西": [120.83, 40.77],
    "锦县": [121.35, 41.17],
    "锦州": [121.15, 41.13],
    "进贤": [116.26, 28.37],
    "晋城": [112.83, 35.52],
    "晋江": [118.57, 24.82],
    "晋宁": [102.58, 24.68],
    "晋县": [115.03, 38.03],
    "缙云": [120.6, 28.66],
    "京山": [113.11, 31.03],
    "泾川": [107.38, 35.31],
    "泾县": [118.41, 30.68],
    "泾阳": [108.84, 34.53],
    "泾源": [106.33, 35.5],
    "荆门": [112.19, 31.02],
    "旌得": [118.53, 30.28],
    "精河": [82.92, 44.67],
    "井冈山": [114.17, 26.57],
    "井陉": [114.13, 38.03],
    "井研": [104.06, 29.67],
    "景德镇": [117.22, 29.3],
    "景东": [100.82, 24.42],
    "景谷": [100.71, 23.5],
    "景淇": [100.79, 22],
    "景泰": [104.05, 37.14],
    "景县": [116.26, 37.69],
    "靖安": [115.37, 28.88],
    "靖边": [108.79, 37.61],
    "靖江": [120.26, 32.03],
    "靖西": [106.41, 23.15],
    "靖县": [109.68, 26.57],
    "靖宇": [126.8, 42.38],
    "靖远": [104.71, 36.54],
    "静海": [116.92, 38.93],
    "静乐": [111.9, 38.37],
    "静宁": [105.73, 35.51],
    "九江": [115.97, 29.71],
    "九龙": [101.53, 29.01],
    "九台": [126.83, 44.15],
    "久治": [101.47, 33.46],
    "酒泉": [98.5, 39.71],
    "莒南": [118.83, 35.17],
    "巨鹿": [115.03, 37.22],
    "巨野": [116.08, 35.38],
    "句容": [119.16, 31.95],
    "鄄城": [115.5, 35.57],
    "筠连": [104.53, 28.16],
    "浚县": [114.54, 35.67],
    "喀喇沁旗": [118.67, 41.95],
    "开封": [114.35, 34.79],
    "开化": [118.39, 29.15],
    "开江": [107.87, 31.1],
    "开鲁": [121.32, 43.62],
    "开平": [112.68, 22.36],
    "开县": [108.39, 31.23],
    "开阳": [106.95, 27.06],
    "开原": [124.03, 42.53],
    "开远": [103.23, 23.7],
    "凯里": [107.97, 26.59],
    "康保": [114.6, 41.87],
    "康定": [101.95, 30.04],
    "康乐": [103.68, 35.39],
    "康马": [89.67, 28.57],
    "康平": [123.33, 42.75],
    "康县": [105.58, 33.33],
    "柯平": [79.06, 40.55],
    "科尔沁右翼前旗": [122.03, 46.12],
    "科尔沁右翼中旗": [121.47, 45.05],
    "科尔沁左翼后旗": [122.35, 42.97],
    "科尔沁左翼中旗": [123.28, 44.13],
    "岢岚": [111.58, 38.7],
    "克东": [126.22, 48.03],
    "克拉玛依": [84.77, 45.59],
    "克山": [125.87, 48.03],
    "克什克腾旗": [117.48, 43.28],
    "垦利": [118.54, 37.59],
    "库车": [82.97, 41.68],
    "库尔勒": [86.06, 41.68],
    "库伦旗": [121.75, 42.72],
    "宽城": [118.47, 40.62],
    "宽甸": [124.77, 40.75],
    "奎屯": [84.89, 44.45],
    "昆明": [102.73, 25.04],
    "昆山": [120.95, 31.39],
    "拉萨": [91.11, 29.97],
    "拉孜": [87.62, 29.1],
    "来安": [118.44, 32.44],
    "来宾": [109.24, 23.76],
    "来阳": [112.84, 26.41],
    "来易": [102.15, 26.9],
    "莱芜": [117.67, 36.19],
    "莱西": [120.53, 36.86],
    "莱阳": [120.71, 36.97],
    "涞水": [115.71, 39.39],
    "涞源": [114.67, 39.37],
    "兰考": [114.81, 34.69],
    "兰坪": [99.29, 26.49],
    "兰西": [126.3, 46.28],
    "兰溪": [119.48, 29.19],
    "兰州": [103.73, 36.03],
    "岚皋": [108.89, 32.3],
    "岚县": [111.62, 38.28],
    "蓝山": [112.16, 25.37],
    "蓝田": [109.32, 34.17],
    "澜沦": [99.97, 22.55],
    "郎溪": [119.17, 31.14],
    "阆中": [105.97, 31.75],
    "廊坊": [116.7, 39.53],
    "朗县": [93.11, 29.06],
    "浪卡子": [90.33, 29.96],
    "崂山": [120.42, 36.15],
    "乐安": [115.82, 27.44],
    "乐昌": [113.35, 25.14],
    "乐东": [109.17, 18.73],
    "乐都": [102.38, 36.49],
    "乐陵": [117.22, 37.74],
    "乐平": [117.12, 28.97],
    "乐普湖": [76.67, 39.23],
    "乐清": [120.94, 28.14],
    "乐亭": [118.9, 39.43],
    "乐业": [106.56, 24.78],
    "乐由": [103.73, 29.59],
    "乐至": [105.02, 30.3],
    "雷波": [103.62, 28.21],
    "雷山": [108.07, 26.38],
    "泪罗": [113.05, 28.8],
    "类乌齐": [96.57, 31.2],
    "冷水江": [111.41, 27.68],
    "离石": [111.13, 37.53],
    "梨树": [124.33, 43.32],
    "黎城": [113.4, 36.56],
    "黎川": [116.91, 27.3],
    "黎平": [109.14, 26.24],
    "蠡县": [115.58, 38.49],
    "礼泉": [108.43, 34.5],
    "礼县": [105.15, 34.22],
    "理塘": [100.28, 30.03],
    "理县": [103.16, 31.42],
    "澧县": [111.75, 29.65],
    "醴陵": [113.5, 27.67],
    "历城": [117.07, 36.69],
    "丽江": [100.25, 26.86],
    "丽水": [119.92, 28.45],
    "利津": [118.25, 37.49],
    "利辛": [116.19, 33.12],
    "荔波": [107.88, 25.42],
    "荔浦": [110.38, 24.51],
    "溧水": [119.02, 31.65],
    "溧阳": [119.48, 31.43],
    "连城": [116.75, 25.72],
    "连江": [119.53, 26.2],
    "连南": [112.28, 24.77],
    "连平": [114.48, 24.39],
    "连山": [112.07, 24.59],
    "连县": [112.4, 24.77],
    "连云港": [119.16, 34.59],
    "莲花": [113.94, 27.14],
    "涟水": [119.26, 33.77],
    "涟源": [111.66, 27.68],
    "廉江": [110.27, 21.63],
    "凉城": [112.48, 40.52],
    "梁河": [98.3, 24.78],
    "梁平": [107.78, 30.66],
    "梁山": [116.1, 35.8],
    "两当": [106.28, 33.9],
    "辽阳": [123.17, 41.28],
    "辽源": [125.15, 42.97],
    "辽中": [122.7, 41.52],
    "聊城": [115.97, 36.45],
    "邻水": [106.91, 30.36],
    "林甸": [124.87, 47.18],
    "林口": [130.23, 45.3],
    "林西": [118.02, 43.62],
    "林县": [113.81, 36.06],
    "林芝": [94.25, 29.59],
    "林周": [91.24, 30.2],
    "临安": [119.72, 30.23],
    "临城": [114.5, 37.43],
    "临川": [116.29, 27.95],
    "临汾": [111.5, 36.08],
    "临高": [109.69, 19.91],
    "临桂": [110.22, 25.22],
    "临海": [121.13, 28.8],
    "临河": [107.37, 40.78],
    "临澧": [111.64, 29.44],
    "临沦": [100.09, 23.88],
    "临清": [115.72, 36.68],
    "临朐": [118.53, 36.5],
    "临泉": [115.24, 33.06],
    "临汝": [112.83, 34.17],
    "临沭": [118.73, 34.89],
    "临潭": [103.35, 34.69],
    "临洮": [103.88, 35.39],
    "临潼": [109.22, 34.38],
    "临武": [112.55, 25.27],
    "临西": [115.5, 36.87],
    "临夏": [103.22, 35.62],
    "临县": [110.95, 37.95],
    "临湘": [113.42, 29.48],
    "临猗": [110.78, 35.15],
    "临沂": [118.35, 35.05],
    "临邑": [116.86, 37.2],
    "临颖": [113.94, 33.81],
    "临泽": [100.17, 39.14],
    "临漳": [114.62, 36.35],
    "麟游": [107.8, 34.69],
    "灵宝": [110.85, 34.52],
    "灵川": [110.33, 25.42],
    "灵丘": [114.2, 39.47],
    "灵山": [109.29, 22.44],
    "灵石": [111.77, 36.83],
    "灵寿": [114.38, 38.31],
    "灵台": [107.61, 35.1],
    "灵武": [106.34, 38.1],
    "凌源": [119.37, 41.27],
    "凌云": [106.55, 24.35],
    "陵川": [113.27, 35.78],
    "陵水": [110.02, 18.48],
    "陵县": [116.58, 37.34],
    "零陵": [111.63, 26.22],
    "酃县": [113.77, 26.49],
    "浏阳": [113.63, 28.16],
    "留坝": [106.95, 33.65],
    "柳城": [109.24, 24.67],
    "柳河": [125.7, 40.88],
    "柳江": [109.34, 24.27],
    "柳林": [110.85, 37.45],
    "柳州": [109.4, 24.33],
    "六安": [116.49, 31.73],
    "六合": [118.83, 32.36],
    "六盘水": [104.82, 26.58],
    "六枝": [105.47, 26.21],
    "龙川": [115.25, 24.09],
    "龙海": [117.79, 24.44],
    "龙江": [123.18, 47.35],
    "龙里": [106.98, 26.46],
    "龙陵": [98.7, 24.58],
    "龙门": [114.25, 23.75],
    "龙南": [114.79, 24.91],
    "龙泉": [119.13, 28.08],
    "龙山": [109.42, 29.64],
    "龙胜": [110.02, 25.78],
    "龙溪": [118.17, 26.18],
    "龙岩": [117.01, 25.12],
    "龙州": [106.84, 22.36],
    "隆安": [107.68, 23.18],
    "隆昌": [105.25, 29.64],
    "隆德": [106.11, 35.63],
    "隆化": [117.7, 41.32],
    "隆回": [111.04, 27.13],
    "隆林": [105.34, 24.8],
    "隆尧": [114.75, 37.35],
    "隆子": [92.42, 28.46],
    "陇川": [97.96, 24.33],
    "陇西": [104.61, 34.98],
    "陇县": [106.86, 34.91],
    "娄底": [111.96, 27.71],
    "娄烦": [111.78, 38.05],
    "卢江": [117.29, 31.23],
    "卢龙": [118.85, 39.89],
    "卢氏": [111.03, 34.06],
    "芦山": [102.91, 30.17],
    "炉霍": [100.65, 31.38],
    "泸定": [102.25, 29.92],
    "泸水": [98.82, 25.97],
    "泸西": [103.76, 24.52],
    "泸溪": [110.73, 28.29],
    "泸县": [105.46, 28.96],
    "泸州": [105.39, 28.91],
    "鲁甸": [103.54, 27.21],
    "鲁山": [112.88, 33.74],
    "陆川": [110.25, 22.33],
    "陆丰": [117.64, 22.95],
    "陆良": [104.64, 25.04],
    "鹿邑": [115.48, 33.86],
    "鹿寨": [109.74, 24.49],
    "禄丰": [102.08, 25.15],
    "禄劝": [102.45, 25.58],
    "碌曲": [102.5, 34.6],
    "路南": [103.24, 24.77],
    "潞城": [113.22, 36.33],
    "潞西": [98.6, 24.41],
    "栾城": [114.64, 38.87],
    "栾川": [111.6, 33.81],
    "滦南": [118.67, 39.49],
    "滦平": [117.53, 40.95],
    "滦县": [118.73, 39.74],
    "轮台": [84.25, 41.77],
    "罗城": [108.9, 24.79],
    "罗川": [115.37, 30.79],
    "罗甸": [106.74, 25.43],
    "罗定": [111.56, 22.77],
    "罗平": [104.3, 24.88],
    "罗山": [114.53, 32.21],
    "罗源": [119.55, 26.49],
    "萝北": [130.83, 47.58],
    "洛川": [109.42, 35.76],
    "洛隆": [95.76, 30.81],
    "洛南": [110.15, 34.11],
    "洛宁": [111.65, 34.39],
    "洛浦": [80.17, 37.12],
    "洛阳": [112.44, 34.7],
    "洛扎": [90.83, 28.42],
    "漯河": [114.02, 33.56],
    "吕都": [97.14, 31.18],
    "绿春": [102.42, 23.01],
    "略阳": [106.16, 33.34],
    "麻城": [115, 31.17],
    "麻江": [107.58, 26.49],
    "麻栗坡": [104.71, 23.12],
    "麻阳": [109.79, 27.87],
    "马鞍山": [118.48, 31.56],
    "马边": [103.53, 28.87],
    "马尔康": [102.22, 31.92],
    "马关": [104.4, 23.01],
    "马龙": [103.61, 25.41],
    "马山": [108.2, 23.73],
    "玛多": [98.26, 34.92],
    "玛纳斯": [86.22, 44.28],
    "玛沁": [100.26, 34.49],
    "玛曲": [102.04, 33.97],
    "麦盖提": [77.62, 38.95],
    "满城": [115.45, 38.95],
    "满洲里": [117.47, 49.58],
    "芒康": [98.68, 29.64],
    "茂名": [110.88, 21.68],
    "茂汶": [103.89, 31.67],
    "眉县": [107.76, 34.29],
    "眉由": [103.81, 30.05],
    "梅县": [116.1, 24.55],
    "梅州": [116.1, 24.55],
    "湄潭": [107.5, 27.76],
    "美姑": [103.14, 28.33],
    "门源": [101.62, 37.37],
    "蒙城": [116.55, 33.25],
    "蒙山": [110.54, 24.22],
    "蒙阴": [117.95, 35.7],
    "蒙自": [103.41, 23.36],
    "勐海": [100.5, 21.95],
    "勐腊": [101.56, 21.48],
    "孟村": [117.1, 38.06],
    "孟津": [112.42, 34.84],
    "孟连": [99.55, 22.32],
    "孟县": [112.77, 34.92],
    "孟县": [113.37, 38.01],
    "弥渡": [100.52, 25.34],
    "弥勒": [103.43, 24.41],
    "米林": [94.13, 29.18],
    "米泉": [87.68, 43.97],
    "米脂": [110.23, 37.78],
    "泌阳": [113.31, 32.72],
    "密山": [131.85, 45.53],
    "密县": [113.35, 34.51],
    "密云": [116.85, 40.37],
    "绵阳": [104.73, 31.48],
    "绵竹": [104.19, 31.32],
    "勉县": [106.68, 33.16],
    "冕宁": [102.15, 28.58],
    "渑池": [111.75, 34.76],
    "民丰": [82.63, 37.07],
    "民和": [102.8, 36.3],
    "民乐": [100.85, 38.43],
    "民勤": [103.08, 38.62],
    "民权": [115.13, 34.65],
    "岷县": [104.04, 34.41],
    "闽侯": [119.14, 26.16],
    "闽清": [118.86, 26.21],
    "名山": [103.06, 30.09],
    "明水": [125.88, 47.18],
    "明溪": [117.18, 26.36],
    "莫力达瓦达斡尔族自治旗": [124.5, 48.47],
    "漠河": [122.37, 53.48],
    "墨脱": [95.26, 29.22],
    "墨玉": [79.74, 37.31],
    "墨竹工卡": [91.77, 29.77],
    "牟定": [101.58, 25.32],
    "牟平": [121.59, 37.38],
    "牡丹江": [129.58, 44.6],
    "木兰": [128.03, 45.95],
    "木垒": [90.34, 43.8],
    "木里": [101.25, 27.9],
    "沐川": [103.98, 28.96],
    "穆棱": [130.5, 44.9],
    "那坡": [105.85, 23.42],
    "那曲": [92.1, 31.47],
    "纳溪": [105.38, 28.77],
    "钠雍": [105.38, 26.77],
    "乃东": [91.76, 29.18],
    "奈曼旗": [120.65, 42.85],
    "南安": [118.39, 24.96],
    "南澳": [117.03, 23.44],
    "南部": [106.03, 31.34],
    "南昌": [115.89, 28.68],
    "南城": [116.62, 27.56],
    "南川": [107.13, 29.15],
    "南丹": [107.54, 24.98],
    "南丰": [116.52, 27.22],
    "南官": [115.37, 37.37],
    "南海": [113.11, 23.05],
    "南和": [114.71, 37],
    "南华": [101.26, 25.21],
    "南汇": [121.76, 31.05],
    "南涧": [100.51, 25.04],
    "南江": [106.83, 32.36],
    "南京": [118.78, 32.04],
    "南靖": [117.35, 24.51],
    "南康": [114.75, 25.66],
    "南乐": [115.21, 36.08],
    "南陵": [118.32, 30.91],
    "南木林": [89.02, 29.71],
    "南宁": [108.33, 22.84],
    "南皮": [116.7, 38.05],
    "南平": [118.11, 27.34],
    "南平": [118.16, 26.65],
    "南坪": [104.19, 33.23],
    "南通": [120.86, 32.01],
    "南通": [121.05, 32.08],
    "南桐": [107.04, 29.86],
    "南溪": [104.96, 28.87],
    "南县": [112.39, 29.37],
    "南雄": [114.33, 25.14],
    "南阳": [112.53, 33.01],
    "南允": [106.06, 30.8],
    "南召": [112.4, 33.49],
    "南郑": [106.93, 33],
    "囊谦": [96.47, 32.23],
    "讷河": [124.85, 48.48],
    "内黄": [114.88, 35.95],
    "内江": [105.04, 29.59],
    "内丘": [114.5, 37.28],
    "内乡": [111.83, 33.05],
    "嫩江": [125.2, 49.17],
    "尼勒克": [82.53, 43.82],
    "尼木": [90.14, 29.44],
    "聂拉木": [85.94, 28.19],
    "聂荣": [92.3, 31.08],
    "宁安": [129.47, 44.35],
    "宁波": [121.56, 29.86],
    "宁城": [119.32, 41.62],
    "宁德": [119.52, 26.65],
    "宁都": [116, 26.46],
    "宁冈": [113.97, 26.71],
    "宁国": [118.95, 30.62],
    "宁海": [121.42, 29.3],
    "宁河": [117.83, 39.33],
    "宁化": [116.64, 26.26],
    "宁津": [116.8, 37.64],
    "宁蒗": [100.82, 27.29],
    "宁陵": [115.31, 34.44],
    "宁明": [107.08, 22.12],
    "宁南": [102.76, 27.07],
    "宁普": [114.9, 37.62],
    "宁强": [106.25, 32.82],
    "宁陕": [108.33, 33.34],
    "宁武": [112.28, 39],
    "宁县": [107.94, 35.17],
    "宁乡": [112.55, 28.27],
    "宁阳": [116.8, 35.76],
    "宁远": [111.95, 25.6],
    "农安": [125.15, 44.45],
    "瓯海": [120.65, 28.01],
    "盘山": [122.03, 41.02],
    "盘县": [104.64, 25.81],
    "磐石": [126.03, 42.93],
    "沛县": [116.93, 34.73],
    "彭水": [108.19, 29.29],
    "彭县": [103.94, 30.99],
    "彭由": [103.83, 30.22],
    "彭泽": [116.56, 29.9],
    "蓬安": [106.44, 31.04],
    "蓬莱": [120.75, 37.8],
    "蓬溪": [105.74, 30.78],
    "邳县": [117.97, 34.3],
    "皮山": [78.29, 37.06],
    "郫县": [103.86, 30.8],
    "偏关": [111.47, 39.45],
    "平安": [102.09, 36.47],
    "平坝": [106.26, 26.42],
    "平昌": [107.11, 31.59],
    "平顶山": [113.29, 33.75],
    "平定": [113.62, 37.79],
    "平度": [119.97, 36.77],
    "平谷": [117.1, 40.13],
    "平果": [107.59, 23.33],
    "平和": [117.3, 24.38],
    "平湖": [121.02, 30.7],
    "平江": [113.56, 29.71],
    "平乐": [110.66, 24.64],
    "平利": [109.37, 32.41],
    "平凉": [106.68, 35.51],
    "平鲁": [112.12, 39.53],
    "平陆": [111.2, 34.12],
    "平罗": [106.54, 38.91],
    "平南": [110.4, 23.55],
    "平泉": [118.68, 41.02],
    "平山": [114.24, 38.2],
    "平顺": [113.43, 36.19],
    "平潭": [119.78, 25.51],
    "平塘": [107.55, 25.83],
    "平武": [104.52, 32.42],
    "平乡": [115.02, 37.06],
    "平阳": [120.55, 27.68],
    "平遥": [112.18, 37.2],
    "平邑": [117.63, 35.49],
    "平阴": [116.46, 36.29],
    "平舆": [114.62, 32.97],
    "平原": [116.44, 37.16],
    "平远": [117.9, 24.59],
    "凭祥": [106.75, 22.11],
    "屏边": [103.67, 22.68],
    "屏南": [118.98, 26.92],
    "屏由": [104.15, 28.68],
    "萍乡": [113.85, 27.6],
    "莆田": [119, 25.44],
    "蒲城": [109.59, 34.97],
    "蒲江": [103.29, 30.2],
    "蒲圻": [113.85, 29.71],
    "蒲县": [111.07, 36.42],
    "濮阳": [114.98, 35.71],
    "浦北": [109.56, 22.27],
    "浦城": [118.55, 27.92],
    "浦江": [119.88, 29.46],
    "普安": [104.96, 25.79],
    "普定": [105.75, 26.32],
    "普洱": [101.03, 23.07],
    "普格": [102.52, 27.38],
    "普兰": [81.18, 30.37],
    "普宁": [116.17, 23.29],
    "普陀": [122.3, 29.97],
    "七台河": [130.83, 45.82],
    "栖霞": [120.83, 37.28],
    "齐河": [116.76, 36.79],
    "齐齐哈尔": [123.97, 47.33],
    "祁东": [112.14, 26.8],
    "祁连": [100.22, 38.2],
    "祁门": [117.7, 29.86],
    "祁县": [112.33, 37.36],
    "祁阳": [111.85, 26.59],
    "岐山": [107.63, 34.46],
    "奇台": [89.52, 44.02],
    "淇县": [114.17, 35.6],
    "琪县": [104.81, 28.38],
    "綦江": [106.56, 29.41],
    "蕲春": [115.3, 30.24],
    "杞县": [114.77, 34.56],
    "启东": [121.66, 31.8],
    "千阳": [107.13, 34.65],
    "迁安": [118.69, 40.02],
    "迁西": [118.3, 40.15],
    "铅山": [117.71, 28.32],
    "乾安": [124.02, 45],
    "乾县": [108.25, 34.54],
    "潜山": [116.53, 30.62],
    "黔江": [108.81, 29.53],
    "黔西": [106.04, 27.03],
    "黔阳": [110.14, 27.33],
    "巧家": [102.92, 26.9],
    "钦州": [108.61, 21.96],
    "秦安": [105.69, 34.89],
    "秦皇岛": [119.57, 39.95],
    "沁水": [112.15, 35.67],
    "沁县": [112.68, 36.75],
    "沁阳": [112.92, 35.08],
    "沁源": [112.32, 36.5],
    "青川": [105.21, 32.59],
    "青岛": [120.33, 36.07],
    "青岗": [126.13, 46.68],
    "青河": [90.37, 46.71],
    "青龙": [118.93, 40.43],
    "青浦": [121.1, 31.15],
    "青神": [103.81, 29.86],
    "青田": [120.28, 28.45],
    "青铜峡": [106.07, 38.02],
    "青县": [116.8, 38.58],
    "青阳": [117.84, 30.64],
    "清丰": [115.1, 35.89],
    "清河": [115.67, 37.07],
    "清涧": [110.15, 37.11],
    "清江": [115.54, 28.07],
    "清江": [119.02, 33.59],
    "清流": [116.81, 26.12],
    "清水": [106.12, 34.73],
    "清水河": [111.65, 39.92],
    "清徐": [112.33, 37.62],
    "清原": [124.9, 42.13],
    "清远": [113.01, 23.7],
    "清苑": [115.47, 38.76],
    "清镇": [106.46, 26.56],
    "晴龙": [105.21, 25.83],
    "庆安": [127.5, 46.87],
    "庆无": [119.06, 27.61],
    "庆阳": [107.88, 36.03],
    "庆云": [117.37, 37.37],
    "邛崃": [103.47, 30.42],
    "穷结": [91.65, 29.04],
    "琼海": [110.46, 19.25],
    "琼山": [110.33, 19.98],
    "琼中": [109.83, 19.05],
    "丘北": [104.19, 24.03],
    "丘县": [115.18, 36.84],
    "渠县": [106.94, 30.85],
    "衢州": [118.88, 28.97],
    "曲阜": [116.98, 35.59],
    "曲江": [113.58, 24.68],
    "曲靖": [103.79, 25.51],
    "曲麻菜": [95.5, 34.52],
    "曲水": [90.7, 29.39],
    "曲松": [92.11, 29.08],
    "曲沃": [111.33, 35.63],
    "曲阳": [114.68, 38.62],
    "曲周": [114.92, 36.78],
    "全椒": [118.27, 32.1],
    "全南": [114.53, 24.76],
    "全州": [111.06, 25.96],
    "泉州": [118.58, 24.93],
    "确山": [114.02, 32.83],
    "壤塘": [100.97, 32.3],
    "饶河": [134, 46.78],
    "饶平": [117.01, 23.7],
    "饶阳": [115.74, 38.24],
    "人荔": [109.96, 34.82],
    "仁布": [89.77, 29.21],
    "仁化": [113.73, 25.11],
    "仁怀": [106.41, 27.81],
    "仁寿": [104.09, 30],
    "任丘": [116.08, 38.72],
    "任县": [114.68, 37.11],
    "日喀则": [88.82, 29.28],
    "日上": [79.61, 33.44],
    "日照": [119.46, 35.42],
    "荣昌": [106.21, 29.62],
    "荣成": [122.41, 37.16],
    "荣经": [102.81, 29.79],
    "容城": [115.86, 39.06],
    "容县": [110.53, 22.87],
    "榕江": [108.5, 25.94],
    "融安": [109.37, 24.24],
    "融水": [109.24, 25.07],
    "如东": [121.18, 32.33],
    "如皋": [120.56, 32.39],
    "汝城": [113.68, 25.54],
    "汝南": [114.35, 33],
    "汝阳": [112.46, 34.16],
    "乳山": [121.52, 36.89],
    "芮城": [110.68, 34.71],
    "瑞安": [120.62, 27.8],
    "瑞昌": [115.65, 29.68],
    "瑞金": [116.02, 25.89],
    "瑞丽": [97.83, 24],
    "若尔盖": [102.94, 33.62],
    "萨嘎": [85.3, 29.38],
    "萨迦": [88, 28.87],
    "三都": [107.86, 26],
    "三河": [117.06, 39.97],
    "三江": [109.58, 25.8],
    "三门": [121.38, 29.11],
    "三门峡": [111.19, 34.76],
    "三明": [117.61, 26.23],
    "三水": [112.89, 23.18],
    "三穗": [108.68, 26.98],
    "三台": [105.06, 31.1],
    "三原": [108.94, 34.62],
    "桑日": [92, 29.26],
    "桑植": [110.16, 29.38],
    "色达": [100.35, 32.3],
    "沙河": [114.52, 36.94],
    "沙市": [112.24, 30.32],
    "沙湾": [85.56, 44.29],
    "沙县": [117.77, 26.41],
    "沙雅": [82.9, 41.25],
    "沙洲": [120.55, 31.86],
    "莎车": [77.25, 38.45],
    "厦门": [118.1, 24.46],
    "山丹": [101.19, 38.79],
    "山阳": [109.91, 33.55],
    "山阴": [112.82, 39.52],
    "陕县": [111.19, 34.76],
    "汕头": [116.69, 23.39],
    "鄯善": [90.25, 42.82],
    "商城": [115.42, 31.81],
    "商都": [113.53, 41.58],
    "商河": [117.15, 37.31],
    "商南": [110.88, 33.54],
    "商丘": [115.65, 34.44],
    "商水": [114.59, 33.54],
    "商县": [109.96, 33.88],
    "上蔡": [114.26, 33.25],
    "上高": [114.91, 28.25],
    "上海": [121.48, 31.22],
    "上杭": [116.41, 25.43],
    "上林": [108.59, 23.44],
    "上默特右旗": [110.52, 40.55],
    "上默特左旗": [111.13, 40.72],
    "上饶": [117.97, 28.47],
    "上思": [107.98, 22.16],
    "上犹": [114.55, 25.8],
    "上虞": [120.87, 30.03],
    "尚义": [113.95, 41.05],
    "尚志": [127.95, 45.22],
    "韶关": [113.62, 24.84],
    "邵东": [111.73, 27.25],
    "邵武": [117.48, 27.34],
    "邵阳": [111.5, 27.22],
    "绍兴": [120.58, 30.01],
    "社旗": [112.92, 33.05],
    "射洪": [105.31, 30.9],
    "射阳": [120.26, 33.77],
    "涉县": [113.67, 36.57],
    "申扎": [88.7, 30.94],
    "莘县": [115.67, 36.24],
    "深县": [115.56, 38.02],
    "深泽": [115.2, 38.2],
    "深圳": [114.07, 22.62],
    "什邡": [104.16, 31.13],
    "神池": [112.17, 39.1],
    "神木": [110.51, 38.83],
    "沈丘": [115.06, 33.41],
    "沈阳": [123.38, 41.8],
    "嵊四": [122.45, 30.72],
    "嵊县": [120.81, 29.6],
    "师阡": [108.24, 27.52],
    "师宗": [103.97, 24.85],
    "施秉": [108.11, 27.03],
    "施甸": [99.15, 24.69],
    "十堰": [110.79, 32.65],
    "石城": [116.32, 26.34],
    "石河子": [85.94, 44.27],
    "石家庄": [114.48, 38.03],
    "石楼": [110.83, 37],
    "石门": [111.35, 29.59],
    "石棉": [102.38, 29.21],
    "石屏": [102.48, 23.73],
    "石渠": [98.06, 33.01],
    "石泉": [108.26, 33.05],
    "石首": [112.41, 29.73],
    "石台": [117.48, 30.19],
    "石柱": [108.13, 29.98],
    "石嘴山": [106.39, 39.04],
    "始兴": [114.08, 24.78],
    "寿光": [118.73, 36.86],
    "寿宁": [119.5, 27.47],
    "寿县": [116.78, 32.57],
    "寿阳": [113.17, 37.88],
    "舒城": [116.94, 31.45],
    "舒兰": [126.97, 44.4],
    "疏附": [75.83, 39.42],
    "疏勒": [76.05, 39.41],
    "束鹿": [115.18, 37.94],
    "沭阳": [118.79, 34.12],
    "双柏": [101.67, 24.68],
    "双城": [126.32, 45.53],
    "双峰": [112.18, 27.44],
    "双江": [99.85, 23.45],
    "双辽": [123.5, 43.52],
    "双流": [104.94, 30.57],
    "双牌": [111.64, 25.96],
    "双鸭山": [131.17, 46.65],
    "双阳": [125.68, 43.53],
    "水城": [104.82, 26.58],
    "顺昌": [117.8, 26.8],
    "顺德": [113.24, 22.84],
    "顺义": [116.65, 40.13],
    "朔县": [112.42, 39.32],
    "思茅": [101, 22.79],
    "思南": [108.23, 27.94],
    "四会": [112.68, 23.36],
    "四平": [124.37, 43.17],
    "四子王旗": [111.68, 41.37],
    "泗洪": [118.23, 33.46],
    "泗水": [117.27, 35.65],
    "泗县": [117.89, 33.49],
    "泗阳": [118.68, 33.73],
    "松江": [121.24, 31],
    "松潘": [103.61, 32.64],
    "松桃": [109.18, 28.17],
    "松溪": [118.77, 27.53],
    "松阳": [119.48, 28.46],
    "嵩明": [103.03, 25.35],
    "嵩县": [112.07, 34.14],
    "苏尼特右旗": [112.95, 42.47],
    "苏尼特左旗": [113.7, 43.85],
    "苏州": [120.62, 31.32],
    "肃北": [94.89, 39.49],
    "肃南": [99.57, 38.86],
    "肃宁": [115.82, 38.43],
    "睢宁": [117.94, 33.89],
    "睢县": [115.04, 34.46],
    "濉溪": [116.76, 33.92],
    "绥滨": [131.83, 47.3],
    "绥德": [110.24, 37.49],
    "绥芬河": [131.17, 44.38],
    "绥化": [127, 46.63],
    "绥江": [103.97, 28.58],
    "绥棱": [127.12, 47.22],
    "绥宁": [110.14, 25.59],
    "绥阳": [107.19, 27.95],
    "绥中": [120.32, 40.35],
    "遂昌": [119.25, 28.59],
    "遂川": [114.5, 26.33],
    "遂宁": [105.58, 30.52],
    "遂平": [113.98, 33.15],
    "遂溪": [110.24, 21.39],
    "孙吴": [127.5, 49.22],
    "索县": [93.71, 31.92],
    "塔城": [82.96, 46.74],
    "塔河": [124.7, 52.32],
    "塔什库尔干": [75.22, 75.22],
    "台安": [122.4, 41.4],
    "台江": [108.32, 26.68],
    "台前": [115.83, 36],
    "台山": [112.78, 22.27],
    "台湾": [121.5, 25.14],
    "太白": [107.3, 34.09],
    "太仓": [121.1, 31.45],
    "太谷": [112.53, 37.42],
    "太和": [115.61, 33.16],
    "太湖": [116.27, 30.42],
    "太康": [114.85, 34.06],
    "太平": [118.13, 30.28],
    "太仆寺旗": [115.3, 41.9],
    "太原": [112.53, 37.87],
    "泰安": [117.13, 36.18],
    "泰和": [114.88, 26.81],
    "泰来": [123.45, 46.4],
    "泰宁": [117.15, 26.92],
    "泰顺": [119.7, 27.57],
    "泰县": [120.15, 32.51],
    "泰兴": [120.02, 32.16],
    "泰州": [119.9, 32.49],
    "郯城": [118.35, 34.61],
    "汤阴": [114.35, 35.92],
    "汤源": [129.92, 46.73],
    "唐海": [118.54, 39.31],
    "唐河": [112.83, 32.7],
    "唐山": [118.02, 39.63],
    "唐县": [114.97, 38.75],
    "洮安": [122.75, 45.35],
    "桃江": [112.11, 28.51],
    "桃源": [111.47, 28.9],
    "陶乐": [106.69, 38.82],
    "特克斯": [81.81, 43.23],
    "腾冲": [98.51, 25.01],
    "滕县": [117.17, 35.09],
    "藤县": [110.9, 23.36],
    "天等": [107.12, 23.08],
    "天峨": [107.16, 25.01],
    "天津": [117.2, 39.13],
    "天峻": [99.03, 37.28],
    "天全": [102.78, 30.09],
    "天水": [105.69, 34.6],
    "天台": [121.03, 29.15],
    "天长": [119, 32.68],
    "天镇": [114.08, 40.42],
    "天柱": [109.2, 26.89],
    "天祝": [102.84, 37.24],
    "田东": [107.12, 23.62],
    "田林": [106.24, 24.31],
    "田阳": [106.9, 23.75],
    "铁法": [123.5, 42.48],
    "铁力": [128.08, 47.98],
    "铁岭": [123.85, 42.32],
    "通北": [126.8, 49.76],
    "通城": [113.8, 29.23],
    "通道": [109.77, 26.16],
    "通海": [102.75, 24.09],
    "通河": [128.7, 45.98],
    "通化": [125.92, 41.49],
    "通江": [108.24, 31.95],
    "通辽": [122.28, 43.63],
    "通山": [114.52, 29.6],
    "通渭": [105.27, 35.24],
    "通县": [116.67, 39.92],
    "通许": [114.46, 34.48],
    "通榆": [123.13, 44.82],
    "同安": [118.15, 24.74],
    "同德": [100.63, 35.24],
    "同江": [132.5, 47.67],
    "同仁": [102, 35.54],
    "同心": [105.94, 36.97],
    "桐柏": [113.4, 32.37],
    "桐城": [116.94, 31.04],
    "桐庐": [119.64, 29.8],
    "桐乡": [120.54, 30.64],
    "桐梓": [106.8, 28.16],
    "铜川": [109.11, 35.09],
    "铜鼓": [114.37, 28.53],
    "铜梁": [105.8, 30.16],
    "铜陵": [117.82, 30.93],
    "铜仁": [109.21, 27.73],
    "铜山": [117.2, 34.26],
    "潼关": [110.25, 34.56],
    "潼南": [106.22, 30.03],
    "突泉": [121.5, 45.4],
    "图们": [129.83, 42.98],
    "吐鲁番": [89.19, 42.91],
    "屯昌": [110.1, 19.36],
    "屯留": [112.87, 36.32],
    "屯溪": [118.31, 29.72],
    "托克托": [111.15, 40.28],
    "托克逊": [88.63, 42.77],
    "托里": [83.59, 45.92],
    "完县": [115.12, 38.84],
    "畹町": [98.08, 24.08],
    "万安": [114.77, 26.47],
    "万年": [117.08, 28.7],
    "万宁": [110.39, 18.8],
    "万全": [114.73, 40.84],
    "万荣": [110.83, 110.83],
    "万山": [109.2, 27.52],
    "万盛": [105.91, 29.38],
    "万县": [108.35, 30.83],
    "万源": [108.06, 32.07],
    "万载": [114.44, 28.11],
    "汪清": [129.75, 43.32],
    "旺苍": [106.33, 32.25],
    "望城": [112.8, 28.37],
    "望都": [115.14, 38.71],
    "望江": [116.69, 30.12],
    "望奎": [126.5, 46.83],
    "望谟": [106.09, 25.17],
    "威海": [122.1, 37.5],
    "威宁": [104.28, 26.87],
    "威县": [115.08, 36.97],
    "威信": [105.05, 27.85],
    "威远": [104.7, 29.57],
    "微山": [117.12, 34.8],
    "巍山": [100.33, 25.23],
    "围场": [117.72, 41.95],
    "维西": [99.27, 27.15],
    "潍坊": [119.1, 36.62],
    "潍县": [119.22, 36.77],
    "尉梨": [86.24, 41.36],
    "尉氏": [114.17, 34.41],
    "渭南": [109.5, 34.52],
    "渭源": [104.19, 35.17],
    "蔚县": [114.53, 39.83],
    "魏县": [114.94, 36.37],
    "温贺": [113.06, 34.94],
    "温江": [103.81, 30.97],
    "温岭": [121.36, 28.36],
    "温泉": [81.08, 44.95],
    "温宿": [80.24, 41.29],
    "温州": [120.65, 28.01],
    "文安": [116.45, 38.87],
    "文昌": [110.72, 19.61],
    "文成": [120.08, 27.08],
    "文登": [122.05, 37.2],
    "文山": [104.24, 23.37],
    "文水": [112.02, 37.42],
    "文县": [104.7, 32.95],
    "闻喜": [111.2, 35.37],
    "汶川": [103.61, 31.46],
    "汶上": [116.49, 35.71],
    "翁牛特旗": [119, 42.97],
    "翁源": [114.13, 24.36],
    "瓮安": [107.48, 27.08],
    "涡阳": [116.21, 33.49],
    "乌海": [106.82, 39.67],
    "乌拉特后旗": [108.52, 40.88],
    "乌拉特前旗": [108.65, 40.75],
    "乌拉特中旗": [108.52, 41.55],
    "乌兰": [98.46, 36.9],
    "乌兰浩特": [122.08, 46.07],
    "乌鲁木齐": [87.68, 43.77],
    "乌恰": [75.18, 39.7],
    "乌什": [79.25, 41.22],
    "乌审旗": [109.03, 38.38],
    "乌苏": [84.62, 44.45],
    "巫山": [109.86, 31.1],
    "巫溪": [109.6, 31.42],
    "无棣": [117.58, 37.73],
    "无极": [114.96, 38.16],
    "无为": [117.75, 31.3],
    "无锡": [120.29, 31.59],
    "芜湖": [118.38, 31.33],
    "吴堡": [110.73, 37.49],
    "吴壁": [117.55, 33.55],
    "吴川": [110.78, 21.43],
    "吴江": [120.63, 31.16],
    "吴旗": [108.22, 36.93],
    "吴桥": [116.37, 37.65],
    "吴县": [120.62, 31.32],
    "吴忠": [106.21, 37.99],
    "梧州": [111.34, 23.51],
    "五常": [127.17, 44.93],
    "五河": [117.87, 33.14],
    "五华": [115.75, 23.93],
    "五莲": [119.2, 35.74],
    "五台": [113.32, 38.72],
    "五原": [108.28, 41.12],
    "五寨": [111.82, 38.93],
    "武安": [114.2, 36.7],
    "武昌": [114.33, 30.35],
    "武城": [116.08, 37.2],
    "武川": [111.42, 41.12],
    "武定": [102.36, 25.55],
    "武都": [104.94, 33.43],
    "武冈": [110.61, 26.73],
    "武功": [108.22, 34.28],
    "武汉": [114.31, 30.52],
    "武进": [119.95, 31.78],
    "武隆": [108.72, 29.29],
    "武鸣": [108.27, 23.17],
    "武宁": [115.09, 29.26],
    "武平": [116.1, 25.11],
    "武强": [115.96, 38.03],
    "武清": [117.05, 39.4],
    "武山": [104.88, 34.69],
    "武胜": [106.3, 30.38],
    "武威": [102.61, 37.94],
    "武乡": [112.83, 36.83],
    "武宜": [109.66, 23.6],
    "武义": [119.81, 28.9],
    "武邑": [115.9, 37.81],
    "武陟": [113.38, 35.1],
    "舞阳": [113.58, 33.44],
    "务川": [107.87, 28.54],
    "婺源": [117.83, 29.25],
    "西安": [108.95, 34.27],
    "西昌": [102.29, 27.92],
    "西畴": [104.68, 23.42],
    "西丰": [124.7, 42.77],
    "西和": [105.28, 34.02],
    "西华": [114.5, 33.79],
    "西吉": [105.7, 35.97],
    "西林": [105.08, 24.51],
    "西盟": [99.47, 22.73],
    "西宁": [101.74, 36.56],
    "西平": [114, 33.38],
    "西乌珠穆沁旗": [117.58, 44.6],
    "西峡": [111.5, 33.31],
    "西乡": [107.77, 33],
    "西阳": [108.75, 28.85],
    "西允": [105.84, 31.01],
    "昔阳": [113.68, 37.62],
    "息烽": [106.73, 27.1],
    "息县": [114.72, 32.35],
    "浠水": [115.22, 30.46],
    "淅川": [111.47, 33.14],
    "歙县": [118.44, 29.88],
    "习水": [106.2, 28.33],
    "喜德": [102.42, 28.33],
    "喜桂图旗": [120.73, 49.3],
    "峡江": [115.15, 27.56],
    "霞浦": [120, 26.89],
    "下关": [100.24, 25.45],
    "下河": [102.46, 35.21],
    "夏津": [116, 36.95],
    "夏县": [111.22, 35.12],
    "夏邑": [116.13, 34.22],
    "仙居": [120.73, 28.85],
    "仙游": [118.7, 25.37],
    "咸宁": [114.28, 29.87],
    "咸阳": [108.72, 34.36],
    "献县": [116.12, 38.2],
    "乡城": [99.78, 28.93],
    "乡宁": [110.8, 35.97],
    "香港": [114.1, 22.2],
    "香河": [117, 39.76],
    "湘潭": [112.91, 27.87],
    "湘乡": [112.5, 27.75],
    "湘阴": [112.87, 28.68],
    "襄城": [113.46, 33.86],
    "襄樊": [112.14, 30.02],
    "襄汾": [111.43, 35.86],
    "襄垣": [113.02, 36.55],
    "镶黄旗": [113.83, 42.25],
    "祥云": [100.56, 25.48],
    "响水": [119.56, 34.2],
    "项城": [114.9, 33.44],
    "象山": [121.8, 29.48],
    "象州": [109.7, 23.98],
    "萧山": [120.25, 30.16],
    "萧县": [116.93, 34.19],
    "小金": [102.34, 30.97],
    "孝感": [113.91, 31.92],
    "孝义": [111.8, 37.12],
    "谢通门": [88.25, 29.43],
    "忻城": [108.66, 24.07],
    "忻县": [112.7, 38.38],
    "新安": [112.14, 34.75],
    "新巴尔虎右旗": [118.23, 48.22],
    "新巴尔虎左旗": [116.82, 48.67],
    "新宾": [125.02, 41.72],
    "新蔡": [114.97, 32.75],
    "新昌": [120.89, 29.49],
    "新城": [115.84, 39.34],
    "新都": [104.13, 30.82],
    "新干": [115.4, 27.77],
    "新和": [82.63, 41.55],
    "新河": [115.22, 37.53],
    "新化": [111.29, 27.73],
    "新晃": [109.16, 27.37],
    "新会": [113.02, 22.52],
    "新建": [115.8, 28.69],
    "新绛": [111.22, 35.62],
    "新金": [121.95, 39.55],
    "新津": [103.78, 30.42],
    "新乐": [114.67, 38.33],
    "新龙": [100.28, 30.96],
    "新民": [122.83, 42],
    "新宁": [110.84, 26.44],
    "新平": [101.98, 24.06],
    "新邵": [111.46, 27.33],
    "新十": [114.2, 24.09],
    "新泰": [117.76, 35.91],
    "新田": [112.21, 25.91],
    "新汶": [117.67, 35.86],
    "新县": [114.83, 31.62],
    "新乡": [113.85, 35.31],
    "新兴": [112.2, 22.68],
    "新野": [112.36, 32.51],
    "新沂": [118.33, 34.38],
    "新余": [114.92, 27.81],
    "新源": [83.27, 43.41],
    "新郑": [113.71, 34.4],
    "新洲": [114.8, 31.84],
    "信丰": [114.94, 25.39],
    "信阳": [114.08, 32.13],
    "信宜": [110.9, 22.36],
    "星子": [116.03, 29.47],
    "邢台": [114.48, 37.05],
    "兴安": [110.66, 25.6],
    "兴城": [120.68, 40.63],
    "兴国": [115.33, 26.32],
    "兴海": [99.99, 35.6],
    "兴和": [113.97, 40.88],
    "兴化": [119.82, 32.93],
    "兴隆": [117.48, 40.42],
    "兴宁": [115.75, 24.15],
    "兴平": [108.49, 34.32],
    "兴仁": [105.18, 25.44],
    "兴文": [105.06, 28.36],
    "兴县": [111.22, 38.47],
    "兴义": [104.91, 25.1],
    "雄县": [116.1, 38.98],
    "休宁": [118.19, 29.81],
    "修文": [106.59, 26.84],
    "修武": [113.42, 35.24],
    "修永": [114.55, 29.04],
    "宿迁": [118.3, 33.96],
    "宿松": [116.13, 30.15],
    "宿县": [116.97, 33.63],
    "宿州": [116.97, 33.63],
    "秀山": [108.97, 28.47],
    "岫岩": [123.25, 40.3],
    "盱眙": [118.05, 33],
    "徐水": [115.65, 39.02],
    "徐闻": [110.17, 20.34],
    "徐州": [117.2, 34.26],
    "许昌": [113.81, 34.02],
    "叙水": [105.44, 28.19],
    "溆浦": [110.57, 27.92],
    "宣城": [118.73, 31.95],
    "宣化": [115.03, 40.63],
    "宣威": [104.09, 26.24],
    "旬阳": [109.35, 32.83],
    "旬邑": [108.33, 35.13],
    "寻甸": [103.25, 25.56],
    "寻乌": [115.64, 24.96],
    "循化": [102.46, 35.84],
    "逊克": [128.42, 49.57],
    "崖县": [109.5, 18.25],
    "雅安": [102.97, 29.97],
    "雅江": [101, 30.03],
    "亚东": [88.93, 27.55],
    "烟台": [121.39, 37.52],
    "焉耆": [86.55, 42.05],
    "鄢县": [114.17, 34.11],
    "延安": [109.47, 36.6],
    "延川": [110.18, 36.87],
    "延吉": [129.52, 42.93],
    "延津": [114.19, 35.14],
    "延庆": [115.97, 40.47],
    "延寿": [128.35, 45.47],
    "延长": [110.02, 36.59],
    "沿河": [108.48, 28.57],
    "盐边": [101.56, 26.9],
    "盐城": [120.13, 33.38],
    "盐池": [107.41, 37.78],
    "盐津": [104.28, 28.08],
    "盐山": [117.22, 38.07],
    "盐亭": [105.35, 31.23],
    "盐源": [101.51, 27.42],
    "兖州": [116.83, 35.54],
    "郾城": [113.98, 33.6],
    "偃师": [112.77, 34.73],
    "砚山": [104.35, 23.62],
    "扬中": [119.81, 32.24],
    "扬州": [119.42, 32.39],
    "阳城": [112.38, 35.84],
    "阳春": [111.78, 22.16],
    "阳高": [113.72, 40.38],
    "阳谷": [115.78, 36.11],
    "阳江": [111.95, 21.85],
    "阳曲": [112.65, 38.05],
    "阳泉": [113.57, 37.85],
    "阳山": [112.65, 24.48],
    "阳新": [115.22, 29.83],
    "阳信": [117.58, 37.65],
    "阳原": [114.15, 40.12],
    "洋县": [107.56, 33.23],
    "漾濞": [99.98, 25.68],
    "姚安": [101.24, 25.4],
    "耀县": [108.98, 34.91],
    "掖县": [119.93, 37.18],
    "叶城": [77.42, 37.89],
    "叶县": [113.35, 33.62],
    "伊川": [112.42, 34.43],
    "伊春": [128.92, 47.73],
    "伊金霍洛旗": [109.77, 39.25],
    "伊克昭盟": [110, 39.83],
    "伊宁": [81.33, 43.91],
    "伊通": [125.32, 43.33],
    "伊吾": [94.65, 43.28],
    "依安": [125.3, 47.92],
    "依兰": [129.55, 46.33],
    "黟县": [117.92, 29.93],
    "仪陇": [106.38, 31.52],
    "仪征": [119.16, 32.27],
    "沂南": [118.47, 35.54],
    "沂水": [118.64, 35.78],
    "沂源": [118.17, 36.18],
    "宜宾": [104.56, 29.77],
    "宜昌": [111.3, 30.7],
    "宜川": [110.15, 36.04],
    "宜春": [114.38, 27.81],
    "宜丰": [114.78, 28.4],
    "宜汉": [107.71, 31.39],
    "宜黄": [116.2, 27.55],
    "宜君": [109.11, 35.43],
    "宜良": [103.12, 24.9],
    "宜山": [108.64, 24.47],
    "宜兴": [119.82, 31.36],
    "宜阳": [112.15, 34.51],
    "宜章": [113.96, 25.41],
    "彝良": [104.06, 27.61],
    "弋阳": [117.43, 28.42],
    "义马": [111.92, 34.73],
    "义乌": [120.06, 29.32],
    "义县": [121.22, 41.55],
    "易门": [102.15, 24.67],
    "易县": [115.49, 39.35],
    "益阳": [112.33, 28.6],
    "翼城": [111.68, 35.73],
    "银川": [106.27, 38.47],
    "鄞县": [121.56, 29.86],
    "印江": [108.41, 28.02],
    "英德": [113.38, 24.17],
    "英吉沙": [76.17, 38.91],
    "英山": [115.57, 30.75],
    "鹰潭": [117.02, 28.23],
    "荥阳": [113.35, 34.79],
    "盈江": [97.93, 24.69],
    "营口": [122.18, 40.65],
    "营山": [106.57, 31.07],
    "营县": [118.83, 35.57],
    "颖上": [116.26, 32.62],
    "应城": [113.6, 30.94],
    "应山": [113.81, 31.62],
    "应县": [113.18, 39.58],
    "邕宁": [108.49, 22.74],
    "永安": [117.37, 25.97],
    "永昌": [101.94, 38.23],
    "永城": [116.37, 33.94],
    "永川": [105.71, 29.75],
    "永春": [118.3, 25.34],
    "永德": [99.25, 24.03],
    "永登": [103.25, 36.73],
    "永定": [116.81, 24.76],
    "永丰": [115.42, 27.33],
    "永福": [109.98, 24.99],
    "永富": [104.38, 28.62],
    "永和": [110.64, 36.62],
    "永吉": [126.57, 43.87],
    "永济": [110.42, 34.88],
    "永靖": [103.34, 35.97],
    "永康": [120.02, 28.92],
    "永年": [114.5, 36.77],
    "永宁": [106.24, 38.28],
    "永平": [99.52, 25.45],
    "永清": [116.48, 39.32],
    "永仁": [101.7, 26.07],
    "永善": [103.63, 28.22],
    "永胜": [100.76, 26.71],
    "永寿": [108.14, 34.71],
    "永顺": [109.84, 29],
    "永泰": [118.95, 25.88],
    "永喜": [120.68, 28.16],
    "永新": [114.23, 26.96],
    "永兴": [113.11, 26.13],
    "永修": [115.82, 29.04],
    "永州": [111.63, 26.22],
    "攸县": [113.32, 27.01],
    "右玉": [112.33, 40.18],
    "于都": [115.39, 25.96],
    "于干": [116.69, 28.7],
    "于田": [81.63, 36.86],
    "余杭": [120.3, 30.43],
    "余江": [116.82, 28.22],
    "余庆": [107.88, 27.22],
    "余姚": [121.16, 30.04],
    "鱼台": [116.65, 35],
    "榆次": [112.72, 37.68],
    "榆林": [109.77, 38.3],
    "榆社": [112.97, 37.08],
    "榆树": [126.55, 44.83],
    "榆中": [104.09, 35.87],
    "虞城": [115.87, 34.4],
    "禹城": [116.66, 36.95],
    "禹县": [113.47, 34.16],
    "玉环": [121.23, 28.14],
    "玉林": [110.14, 22.64],
    "玉门": [97.58, 39.81],
    "玉屏": [108.91, 27.24],
    "玉山": [118.25, 28.68],
    "玉树": [96.97, 33.03],
    "玉田": [117.9, 39.9],
    "玉溪": [102.52, 24.35],
    "郁南": [111.51, 23.23],
    "裕民": [82.94, 46.21],
    "元江": [102, 23.59],
    "元谋": [101.85, 25.7],
    "元氏": [114.5, 37.74],
    "元阳": [102.81, 23.17],
    "沅江": [112.36, 28.83],
    "沅陵": [110.39, 28.46],
    "垣曲": [111.63, 35.3],
    "垣仁": [125.33, 41.28],
    "原平": [112.7, 38.73],
    "原阳": [113.96, 35.05],
    "岳池": [106.43, 30.55],
    "岳西": [116.36, 30.84],
    "岳阳": [113.09, 29.37],
    "越西": [102.49, 28.66],
    "云浮": [112.02, 22.93],
    "云和": [119.56, 28.12],
    "云龙": [99.39, 25.9],
    "云梦": [113.73, 31.02],
    "云县": [100.12, 24.44],
    "云霄": [117.34, 23.99],
    "云阳": [108.89, 30.99],
    "运城": [110.97, 35.03],
    "郓城": [115.94, 35.59],
    "杂多": [95.3, 32.92],
    "赞皇": [114.35, 37.65],
    "枣强": [115.72, 37.52],
    "枣庄": [117.57, 34.86],
    "泽库": [101.5, 35.03],
    "泽普": [77.26, 38.2],
    "增城": [113.81, 23.13],
    "扎达": [79.76, 31.47],
    "扎鲁特旗": [120.87, 44.55],
    "扎囊": [91.26, 29.22],
    "柞水": [109.14, 33.69],
    "沾化": [118.14, 37.7],
    "张北": [114.7, 41.15],
    "张家川": [106.23, 35],
    "张家口": [114.87, 40.82],
    "张掖": [100.46, 38.93],
    "章丘": [117.53, 36.72],
    "彰武": [122.52, 42.42],
    "漳平": [117.4, 25.3],
    "漳浦": [117.61, 24.12],
    "漳县": [104.48, 34.87],
    "漳州": [117.35, 24.52],
    "长安": [108.97, 34.18],
    "长白": [128.17, 41.43],
    "长春": [125.35, 43.88],
    "长岛": [120.73, 37.91],
    "长丰": [117.16, 32.47],
    "长葛": [113.77, 34.22],
    "长海": [122.58, 39.28],
    "长乐": [119.52, 25.96],
    "长岭": [123.97, 44.3],
    "长宁": [104.91, 28.6],
    "长清": [116.73, 36.55],
    "长沙": [113, 28.21],
    "长寿": [106.64, 29.01],
    "长顺": [106.45, 26.03],
    "长泰": [117.75, 24.62],
    "长汀": [116.37, 25.85],
    "长武": [107.8, 35.22],
    "长兴": [119.91, 30.01],
    "长垣": [114.67, 35.19],
    "长治": [113.08, 36.18],
    "长子": [112.87, 36.13],
    "招远": [120.38, 37.35],
    "昭觉": [102.83, 28.03],
    "昭平": [110.8, 24.18],
    "昭苏": [81.08, 43.15],
    "昭通": [103.7, 29.32],
    "诏安": [117.16, 23.73],
    "赵县": [114.78, 37.76],
    "肇东": [125.98, 46.07],
    "肇庆": [112.44, 23.05],
    "肇源": [125.07, 45.53],
    "肇州": [125.25, 45.72],
    "柘城": [115.29, 34.08],
    "柘荣": [119.89, 27.25],
    "贞丰": [105.63, 25.39],
    "镇安": [109.16, 33.45],
    "镇巴": [107.91, 32.56],
    "镇海": [121.72, 29.96],
    "镇江": [119.44, 32.2],
    "镇康": [99.02, 23.92],
    "镇宁": [105.75, 26.08],
    "镇平": [112.23, 33.03],
    "镇坪": [109.51, 31.91],
    "镇雄": [104.86, 27.42],
    "镇沅": [100.88, 23.9],
    "镇源": [107.22, 35.7],
    "镇远": [108.41, 27.06],
    "正安": [107.43, 28.56],
    "正定": [114.56, 38.13],
    "正蓝旗": [116.02, 42.25],
    "正镶白旗": [115, 42.32],
    "正阳": [114.38, 32.62],
    "郑州": [113.65, 34.76],
    "政和": [118.85, 27.38],
    "织金": [105.76, 26.66],
    "芷江": [109.78, 27.44],
    "志丹": [108.78, 36.84],
    "治多": [95.6, 33.86],
    "中甸": [99.72, 27.78],
    "中江": [104.68, 31.06],
    "中牟": [114, 34.73],
    "中宁": [105.66, 37.48],
    "中山": [113.38, 22.52],
    "中卫": [105.18, 37.51],
    "中阳": [111.17, 37.37],
    "忠县": [108.03, 30.33],
    "钟山": [111.3, 24.53],
    "钟祥": [112.58, 31.17],
    "仲巴": [84.15, 29.66],
    "重庆": [106.54, 29.59],
    "舟曲": [104.38, 33.81],
    "周口": [114.63, 33.63],
    "周宁": [119.36, 27.12],
    "周至": [108.22, 34.18],
    "珠海": [113.52, 22.3],
    "株洲": [113.16, 27.83],
    "诸城": [119.42, 35.99],
    "诸暨": [120.23, 29.71],
    "驻马店": [114.02, 32.98],
    "庄河": [22.97, 39.7],
    "庄浪": [106.06, 35.2],
    "庄宁": [108.43, 35.5],
    "准格尔旗": [111.13, 39.68],
    "涿鹿": [115.2, 40.37],
    "涿县": [115.98, 39.48],
    "卓尼": [103.54, 34.61],
    "卓资": [112.52, 40.93],
    "资溪": [117.06, 27.7],
    "资兴": [113.39, 25.95],
    "资阳": [104.6, 30.19],
    "资源": [110.66, 26.03],
    "资中": [104.85, 29.81],
    "淄博": [118.05, 36.78],
    "子长": [109.65, 37.16],
    "子洲": [110.05, 37.45],
    "梓潼": [105.16, 31.64],
    "紫金": [115.18, 23.64],
    "紫阳": [108.55, 32.56],
    "紫云": [106.06, 25.75],
    "纵阳": [117.21, 30.69],
    "邹平": [117.75, 36.89],
    "邹县": [116.97, 35.39],
    "遵化": [117.97, 40.2],
    "遵义": [106.9, 27.7],
    "左贡": [97.9, 29.68],
    "左权": [113.35, 37.07],
    "左云": [112.67, 40.02],
};
createmap2('map2', map2data, geoCoordMap);

var geoCoordMap3 = {
    '安徽省': [117.17, 31.52],
    '北京市': [116.24, 39.55],
    '杭州市': [120.2, 30.3],
    '重庆市': [106.54, 29.59],
    '福建省': [119.18, 26.05],
    '甘肃省': [103.51, 36.04],
    '广东省': [113.14, 23.08],
    '广西壮族自治区': [108.19, 22.48],
    '贵州省': [106.42, 26.35],
    '海南省': [110.20, 20.02],
    '河北省': [114.30, 38.02],
    '河南省': [113.40, 34.46],
    '黑龙江省': [128.36, 45.44],
    '湖北省': [112.27, 30.15],
    '湖南省': [112.59, 28.12],
    '吉林省': [125.19, 43.54],
    '江苏省': [118.46, 32.03],
    '江西省': [115.55, 28.40],
    '辽宁省': [123.25, 41.48],
    '内蒙古': [108.41, 40.48],
    '宁夏回族自治区': [106.16, 38.27],
    '青海省': [101.48, 36.38],
    '山东省': [118.00, 36.40],
    '山西省': [112.33, 37.54],
    '陕西省': [108.57, 34.17],
    '上海市': [121.29, 31.14],
    '海南': [108.77, 19.10],
    '四川省': [104.04, 30.40],
    '天津市': [117.12, 39.02],
    '西藏自治区': [91.08, 29.39],
    '新疆维吾尔自治区': [87.36, 43.45],
    '云南省': [102.42, 25.04],
    '浙江省': [120.10, 30.16],
    '澳门': [115.07, 21.33],
    '台湾省': [121.21, 23.53],
    '北海市': [109.12, 21.48],
    '丹东市振兴区': [124.35, 39.99],
    '兰州市': [103.83, 36.06],
    '鸡西市虎林县': [132.98, 45.77],
    '佛山市': [113.12, 23.02],
    '赣州市章贡区': [114.92, 25.81],
    '赣州市赣县': [115.01, 25.86],
    '秦皇岛市海港区': [119.577617, 39.98878],
    '湖北省武汉市武昌区': [114.353622, 30.56486],
    '湖北省枝江市': [111.728567, 30.451767],
    '河南省濮阳市华龙区': [115.048097, 35.771934],
    '江西省贵溪市': [117.19787, 28.190604],
    '山西省长治市潞州区': [113.120292, 36.201664],
    '湖南省湘潭县': [112.788805, 27.669223],
    '天水市': [105.736932, 34.584319],
    '包头市昆都仑区': [109.806834, 40.658057],
    '淮安市盱眙县': [118.538232, 32.971613],
    '重庆市垫江县': [107.444445, 30.259498],
    '新乡市获嘉县': [113.651969, 35.203481],
    '广东省佛山市(除禅城)': [113.134026, 23.035095],
    '北京市平谷区': [117.150433, 40.215925],
    '新疆喀什市': [76.014343, 39.513111],
    '湖南省娄底市': [111.996396, 27.741073],
    '新疆塔城市': [83.190128, 46.811367],
    '山东省青岛市平度市': [119.951062, 36.78855],
    '贵州省毕节市': [106.734996, 26.902826],
    '湖北省恩施市': [109.517433, 30.308979],
    '沈阳市铁西区': [123.35863, 41.805724],
    '四川省攀枝花市东区': [101.722423, 26.587571],
    '四川省凉山州': [102.259591, 27.892393],
    '河南省焦作市修武县': [113.363528, 35.309678],
    '湖北襄阳': [112.410562, 31.209316],
    '临夏': [103.200576, 35.585835],
    '南宁青秀区': [108.54168, 22.829218],
    '渭南市临渭区': [109.564746, 34.55352],
    '广东省河源市紫金县': [115.064471, 23.525442],
    '福建省厦门市': [118.029412, 24.640973],
    '湖北省恩施州': [110.20022, 29.918894],
    '广西贵港市': [109.689558, 23.244655],
    '南京市': [118.778074, 32.057236],
    '广东省肇庆市': [112.479653, 23.078663],
    '昆明市': [102.714601, 25.049153],
    '赣州市兴国县': [115.446507, 26.425201],
    '张掖市': [101.231647, 38.530221],
    '内蒙古科尔沁右翼': [122.048167, 46.083757],
    '鄱阳县': [116.787693, 29.243056],
    '天津市蓟县': [117.441159, 40.009614],
    '阜阳': [115.727727, 32.867689],
    '德州齐河': [116.678254, 36.723454],
    '合肥市': [ 117.2290100000,31.8205700000],
    '太原': [112.5506700000,37.8705900000],
    '伊犁': [81.3241600000,43.9168900000],
    '石家庄': [ 114.5143000000,38.0427600000],
    '汕头': [116.6822100000,23.3535000000],
    '海东市': [102.4017300000,36.4820900000],
    '西宁': [101.7778200000,36.6172900000],
    '白云区': [106.6302400000,26.6470200000],
    '秀英区': [110.1998900000,20.0442200000],
    '大庆': [125.1030700000,46.5875800000],
    '江门市': [113.0816100000,22.5786500000],
    '金湾区': [113.3642000000,22.1458900000],
    '玉树': [97.0065000000,33.0052800000],
    '海北': [100.9009600000,36.9545400000],
    '汉中': [107.0237700000,33.0676100000],
    '咸阳': [108.7092900000,34.3293200000],
    '武威': [102.6379700000,37.9282000000],
    '酒泉': [98.4939400000,39.7325500000],
    '宝鸡': [107.2373200000,34.3619400000],
    '成都': [104.0647600000,30.5702000000],
    '巴中': [104.0647600000,30.5702000000],
    '红河': [103.3756000000,23.3642200000],
    '丽江': [100.2271000000,26.8564800000],
    '保山': [99.1618100000,25.1120500000],
    '日照': [119.5271900000,35.4164600000],
    '潍坊': [119.1617600000,36.7068600000],
    '文昌': [110.7553900000,19.6168400000],

};
var testData = [
    {
        name: '张三',
        idcard:'123456',
        coords: [
            {fromcity: '杭州', tocity: '北海', value: 4},
            {fromcity: '杭州', tocity: '合肥', value: 7},
            {fromcity: '合肥', tocity: '杭州', value: 8}
        ]
    },
    {
        name: '李四',
        idcard:'78901',
        coords: [
            {fromcity: '石家庄', tocity: '伊犁', value: 10},
            {fromcity: '石家庄', tocity: '汕头', value: 5},
            {fromcity: '石家庄', tocity: '合肥', value: 8},
            {fromcity: '合肥', tocity: '杭州', value: 8}
        ]
    }
];
var BJData = [
    [{
        name: '杭州市'
    }, {
        name: '北海市',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '合肥市',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '太原',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '伊犁',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '石家庄',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '汕头',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '海东市',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '西宁',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '白云区',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '秀英区',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '大庆',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '江门市',
        value: 195
    }],[{
        name: '杭州市'
    }, {
        name: '金湾区',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '玉树',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '海北',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '汉中',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '咸阳',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '武威',
        value: 195
    }],[{
        name: '杭州市'
    }, {
        name: '酒泉',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '宝鸡',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '成都',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '巴中',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '红河',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '丽江',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '保山',
        value: 195
    }],[{
        name: '杭州市'
    }, {
        name: '日照',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '潍坊',
        value: 195
    }],[{
        name: '杭州市'
    }, {
        name: '文昌',
        value: 195
    }],
    [{
        name: '杭州市'
    }, {
        name: '丹东市振兴区',
        value: 90
    }],
    [{
        name: '杭州市'
    }, {
        name: '兰州市',
        value: 200
    }],
    [{
        name: '杭州市'
    }, {
        name: '鸡西市虎林县',
        value: 70
    }],
    [{
        name: '杭州市'
    }, {
        name: '佛山市',
        value: 200
    }],
    [{
        name: '杭州市'
    }, {
        name: '赣州市章贡区',
        value: 60
    }],
    [{
        name: '杭州市'
    }, {
        name: '赣州市赣县',
        value: 70
    }],
    [{
        name: '杭州市'
    }, {
        name: '秦皇岛市海港区',
        value: 40
    }],
    [{
        name: '杭州市'
    }, {
        name: '湖北省武汉市武昌区',
        value: 50
    }],
    [{
        name: '杭州市'
    }, {
        name: '湖北省枝江市',
        value: 55
    }],
    [{
        name: '杭州市'
    }, {
        name: '河南省濮阳市华龙区',
        value: 55
    }],
    [{
        name: '杭州市'
    }, {
        name: '江西省贵溪市',
        value: 55
    }],
    [{
        name: '杭州市'
    }, {
        name: '山西省长治市潞州区',
        value: 55
    }],
    [{
        name: '杭州市'
    }, {
        name: '湖南省湘潭县',
        value: 200
    }],
    [{
        name: '杭州市'
    }, {
        name: '天水市',
        value: 200
    }],
    [{
        name: '杭州市'
    }, {
        name: '包头市昆都仑区',
        value: 55
    }],
    [{
        name: '杭州市'
    }, {
        name: '淮安市盱眙县',
        value: 55
    }],
    [{
        name: '杭州市'
    }, {
        name: '重庆市垫江县',
        value: 55
    }],
    [{
        name: '杭州市'
    }, {
        name: '新乡市获嘉县',
        value: 55
    }],
    [{
        name: '杭州市'
    }, {
        name: '北京市平谷区',
        value: 150
    }],
    [{
        name: '杭州市'
    }, {
        name: '新疆喀什市',
        value: 55
    }],
    [{
        name: '杭州市'
    }, {
        name: '湖南省娄底市',
        value: 200
    }]
];
createmap3('map3', geoCoordMap,testData);


