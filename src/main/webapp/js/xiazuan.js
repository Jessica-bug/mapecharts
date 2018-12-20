/**
 * Created by guanyiting on 2018/12/18 0018.
 */

$('#main').width($(window).width()-30);
$('#main').height($(window).height()-30);
$('#china_map').width($(window).width()-100);
$('#china_map').height($(window).height()-40);
$('#proe_map').width($(window).width()-100);
$('#proe_map').height($(window).height()-40);
$('#city_map').width($(window).width()-100);
$('#city_map').height($(window).height()-40);

//存放上级地图信息
var firstMap={},    //全国
    secondMap={};   //省市
var chart,          //地图对象
    timeFn=null,
    currentLevel=1; //当前地图所在级别：1：全国，2：省市，3：地县

var _xiazuanObj={
    /**
     * 创建地图
     * @param mapJsonFile 地图json文件位置
     * @param mapName 地图名称
     * @param _id 地图展示div的id
     * @param _title 地图title
     * @param _data 地图展示数据
     */
    createMap:function (mapJsonFile,mapName,_id,_title,_data) {
        $.get(ctx +mapJsonFile, function (mapJson) {
        // $.get(ctx +'/json/china.json', function (mapJson) {
            if(mapJson) {
                if(mapName=='china'){
                    //记录1级数据
                    firstMap={mapJsonFile:mapJsonFile,mapName:mapName,id:_id,title:_title,data:_data,level:1};
                };

                //清空地图所在div，重新加载
                $('#mapdiv').remove();
                $('#'+_id).append('<div id="mapdiv"></div>');
                $('#mapdiv').width($(window).width()-100);
                $('#mapdiv').height($(window).height()-40);

                echarts.registerMap(mapName, mapJson);
                chart = echarts.init(document.getElementById('mapdiv'));
                // chart = echarts.init(document.getElementById(_id));
                chart.setOption({
                    title: {
                        text: _title,
                        //subtext:'',
                        x: 'center',
                        y: 'top',
                        textAlign: 'left'
                    },
                    tooltip: {
                        trigger: 'item'
                        ,
                        formatter: function (result) {//回调函数，参数params具体格式参加官方API
                            return result.name + '<br />数据:' + (isNaN(result.value) ? 0 : result.value);
                        }
                    },
                    dataRange: {
                        min: 0,
                        max: 50,
                        splitNumber: 0,
                        text: ['高', '低'],
                        realtime: false,
                        calculable: false,
                        selectedMode: false,
                        // show:false,
                        // itemWidth:10,
                        // itemHeight:60,
                        color: ['lightskyblue', '#f2f2f2']
                    },
                    series: [{
                        type: 'map',
                        map: mapName,//要和echarts.registerMap（）中第一个参数一致
                        roam: true,
                        scaleLimit: {min: 0.5, max: 20},//缩放
                        // mapLocation:{
                        //     y:60
                        // },
                        itemSytle: {
                            emphasis: {label: {show: false}}
                        },
                        label: {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        data: _data
                        //dataParam//人口数据：例如[{name:'济南',value:'100万'},{name:'菏泽'，value:'100万'}......]
                    }]
                });

                //单击地图下钻
                chart.off('click');
                chart.on('click', function (result) {//回调函数，点击时触发，参数params格式参加官方API
                    if(timeFn)
                        clearTimeout(timeFn);

                    //由于单击事件和双击事件冲突，故单击的响应事件延迟250毫秒执行
                    timeFn = setTimeout(function() {
                        var name = result.name; //地区name
                        var mapCode =null;
                        var thisData=[
                            {name: '大方县', value: '5'},
                            {name: '金沙县', value: '0'},
                            {name: '织金县', value: '10'},
                            {name: '七星关区', value: '30'},
                            {name: '纳雍县', value: '50'},
                            {name: '赫章县', value: '15'}
                        ];
                        var thisId='proe_map';

                        console.info(currentLevel)
                        function contains(arr, obj) {
                            var i = arr.length;
                            while (i--) {
                                if (arr[i] === obj) {
                                    return true;
                                }
                            }
                            return false;
                        }

                        if(currentLevel==1){
                            var arr = new Array('南海诸岛');
                            if (contains(arr, name) == false) {
                                mapCode='/json/' + name + '/' + name + '.json'; //地区的json数据
                            }else{
                                return;
                            }
                        }
                        else if(currentLevel==2){
                            var arr = new Array('北京', '上海', '天津', '台湾', '重庆','香港','澳门');
                            if (contains(arr, secondMap.mapName) == false) {
                                mapCode = '/json/' + secondMap.mapName + '/' + name + '.json'; //地区的json数据
                            }else{
                                return;
                            }
                        }
                        else
                            return;
                        if (!mapCode) {
                            toastr.warning('无此区域地图显示');
                            return;
                        }
                        console.info(mapCode)

                        if(currentLevel==1) {
                            currentLevel = 2;
                            //记录2级地图数据
                            secondMap={mapJsonFile:mapCode,mapName:name,id:_id,title:name+'数据总览',data:_data,level:2};
                        }
                        else if(currentLevel==2) currentLevel=3;

                        _xiazuanObj.createMap(mapCode, name,_id,name+'数据总览',_xiazuanObj.getData(name));
                    }, 250);


                });

                //双击地图返回上级
                chart.off('dblclick');
                chart.on('dblclick',function (params) {
                    //当双击事件发生时，清除单击事件，仅响应双击事件
                    clearTimeout(timeFn);

                    var name = params.name; //地区name
                    var mapCode =null;
                    var title='';
                    var thisData=null;
                    console.info(currentLevel)

                    if(currentLevel==1) return;
                    else if(currentLevel==2){
                        currentLevel=1;
                        mapCode=firstMap.mapJsonFile;
                        name=firstMap.mapName;
                        title=firstMap.title;
                        thisData=_xiazuanObj.getData(firstMap.mapName);
                    }else if(currentLevel==3){
                        currentLevel=2;
                        mapCode=secondMap.mapJsonFile;
                        name=secondMap.mapName;
                        title=secondMap.title;
                        thisData=_xiazuanObj.getData(secondMap.mapName);
                    }

                    //返回全国地图
                    _xiazuanObj.createMap(mapCode,name,_id,title,thisData );
                });

            }else{
                // toastr.warning('该地区不能下钻')
            }
        });
    },
    getData:function (mapname) {
        if(currentLevel==1){
            var data=[
                {name:'湖南',value:'5'},
                {name:'北京',value:'20'},
                {name:'内蒙古',value:'10'},
                {name:'贵州',value:'30'},
                {name:'福建',value:'50'},
                {name:'甘肃',value:'15'},
                {name:'云南',value:'33'},
                {name: '南海诸岛',
                    value: 0
                    // , itemStyle:{ normal:{opacity:0,label:{show:false}}}
                }
            ];
            return data;
        }else if(currentLevel==2){
            var thisData=[
                {name: '淮北市', value: '5'},
                {name: '宿州市', value: '0'},
                {name: '黄山市', value: '10'},
                {name: '合肥市', value: '30'},
                {name: '蚌埠市', value: '50'},
                {name: '滁州市', value: '15'}
            ];
            return thisData;
        }else if(currentLevel==3){
            var thisData=[
                {name: '濉溪县', value: '5'},
                {name: '杜集区', value: '0'},
                {name: '烈山区', value: '10'},
                {name: '相山区', value: '30'}
            ];
            return thisData;
        }
    }

}

window.onload=function () {
    _xiazuanObj.createMap('/json/china.json','china','china_map','全国数据总览',_xiazuanObj.getData('china'));
}