<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2018/12/18 0013
  Time: 10:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<%--<%--%>
    <%--String path=request.getContextPath();--%>
<%--%>--%>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width,initial-scale=1"><%--页面自适应相关--%>
    <title>map-echarts</title>
    <meta charset="UTF-8">
    <%--设置页面不缓存--%>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">

    <link rel="stylesheet" type="text/css" href="${ctx}/css/jquery-ui.min.css">
    <link rel="stylesheet" type="text/css" href="${ctx}/css/bootstrap.min.css">
    <link href="${ctx}/metronic/global/plugins/bootstrap-toastr/toastr.min.css" rel="stylesheet"
          type="text/css"/>

    <style>
        .nav,.content{padding: 0;margin: 0}
        .glyphicon{margin-left: 20px;margin-top:10px; }

        .container{
            margin:0;
            width: 100%;
        }
    </style>

    <script type="text/javascript">
        var ctx='${ctx}';
    </script>
</head>
<body class="container">
    <div id="main"
         style="margin:10px auto;border:1px solid #ccc;
         background: #f2f2f2;"><%--position: relative;height:650px;width:1300px;--%>
        <div id="china_map"
             style="margin:0 auto;
             display: block;"></div><%--width:960px;height:550px;position: absolute;top:10px;left:80px;--%>
        <div id="proe_map"
             style="margin:0 auto;
             display: none;"></div><%--width:960px;height:550px;position: absolute;top:10px;left:80px;--%>
        <div id="city_map"
             style="margin:0 auto;
             display: none;"></div><%--width:960px;height:550px;position: absolute;top:10px;left:80px;--%>
        <%--<div class="retPro" style="z-index:999;position: absolute;top:50px;left:10px;display: block;">
            <a href="javascript:void(0);" onclick="goBackChinaMap()"
               style="height:30px;background:#fff;line-height: 30px;border:1px solid #ccc;padding:5px 10px;
               margin-left:20px;border-radius:5px;cursor: pointer;color:#393939;text-decoration:none;">
                返回全国
            </a>
        </div>
        <div class="retPro" style="z-index:999;position: absolute;top:50px;left:110px;display: block;">
            <a href="javascript:void(0);" onclick="goBackProeMap()"
               style="height:30px;background:#fff;line-height: 30px;border:1px solid #ccc;padding:5px 10px;
               margin-left:20px;border-radius:5px;cursor: pointer;color:#393939;text-decoration:none;">
                返回本省
            </a>
        </div>--%>
    </div>

<script type="text/javascript" src="${ctx}/js/jquery.min.js"></script>
<script type="text/javascript" src="${ctx}/js/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctx}/js/bootstrap.min.js"></script>
<script src="${ctx}/metronic/global/plugins/bootstrap-toastr/toastr.min.js" type="text/javascript"></script>
<%--<script type="text/javascript" src="${ctx}/js/echarts.min.js"></script>--%>
<script type="text/javascript" src="${ctx}/js/echarts.js"></script>
<%--<script type="text/javascript" src="${ctx}/html/www/js/echarts.js"></script>--%>
<script type="text/javascript" src="${ctx}/js/xiazuan.js"></script>
<script type="text/javascript">
    function goBackChinaMap(){
        $('#china_map').css('display','block');
        $('#city_map').css('display','none');
        $('#proe_map').css('display','none');
    }
    function goBackProeMap(){
        $('#china_map').css('display','none');
        $('#city_map').css('display','none');
        $('#proe_map').css('display','block');
    }
</script>
</body>
</html>
