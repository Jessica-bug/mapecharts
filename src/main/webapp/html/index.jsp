<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2018/11/13 0013
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

        .mapdiv{
            height: 300px;
            padding:10px;
        }
    </style>

    <script type="text/javascript">
        var _ctx='${ctx}';
    </script>
</head>
<body class="container">
<div id="mapdiv">
    <div class="row">
        <div id="map1" class="col-sm-6 mapdiv" style="background-color: #0a6aa1"></div>
        <div id="map2" class="col-sm-6 mapdiv" style="background-color: #1e9765"></div>
    </div>

    <div class="row">
        <div id="map3" class="col-sm-6 mapdiv" style="background-color: #6a5a8c"></div>
        <div id="map4" class="col-sm-6 mapdiv" style="background-color: #3A87AD"></div>
    </div>
</div>

<div id="mask" style="height: 100%;width: 100%;">
    <div id="mask-header">
        <button>退出</button>
    </div>
    <%--<div id="mask-body"></div>--%>
    <%-- style="height: 600px;width: 100%;"--%>
</div>

<script type="text/javascript" src="${ctx}/js/jquery.min.js"></script>
<script type="text/javascript" src="${ctx}/js/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctx}/js/bootstrap.min.js"></script>
<script src="${ctx}/metronic/global/plugins/bootstrap-toastr/toastr.min.js" type="text/javascript"></script>
<%--<script type="text/javascript" src="${ctx}/js/echarts.min.js"></script>--%>
<script type="text/javascript" src="${ctx}/js/echarts.js"></script>
<%--<script type="text/javascript" src="${ctx}/html/www/js/echarts.js"></script>--%>
<script type="text/javascript" src="${ctx}/js/mapecharts.js"></script>
<script type="text/javascript">

</script>
</body>
</html>
