/*
 * @version 0.0.1
 * @author hellangel
 * @date 2013.08.20
 * */
function ha_timeline(m_oParentObj, m_sUIInfo, m_oLanguageInfo) {
	var oTL = {
		/**
		 * 日志模块
		 * @lends oTL.prototype
		 * @private
		 */
		_log : {
			/**
			 * 打印信息(非开发模式不打印)
			 * @method _console
			 * @param{String} msg
			 */
			_console : function(msg) {
				if( !oTL._oVariableObj._bDebugMode )
					return false;

				if( ( typeof (console)=="undefined") ) {
					alert(msg);
				}
				else {
					console.log(msg);
				}
			},

			/**
			 * 打印常规信息(非开发模式不打印)
			 * @method _console
			 * @param{String} msg
			 */
			_info : function(msg) {
				if( !oTL._oVariableObj._bDebugMode )
					return false;

				if( ( typeof (console)=="undefined") ) {
					alert(msg);
				}
				else {
					console.info(msg);
				}
			},

			/**
			 * 打印错误信息
			 * @method _err
			 * @param{String} msg
			 */
			_err : function(msg) {
				// if( !CtrlPanel._oVariableObj._bDebugMode )
				// return false;

				if( ( typeof (console)=="undefined") ) {
					alert(msg);
				}
				else {
					console.error(msg);
				}
			}
		},

		/**
		 * 内部使用的检测工具
		 * @private
		 * @lends oTL.prototype
		 * */
		_toolkit : {
			/**
			 * 检测当前浏览器是否是ie
			 * @method  _isIE
			 * @return {Boolean} true-是ie
			 */
			_isIE : function() {
				if( navigator.userAgent.toLowerCase().indexOf('msie')!=-1 ) {
					return true;
				}
				else {
					return false;
				}
			},

			/**
			 * 动态加载js文件和css文件
			 * @method  _loadFile
			 * @param filename 文件路径+文件名 如 js/test.js
			 * @param filetype 文件类型, js和css
			 * @return {Boolean} true-成功
			 */
			_loadFile : function(filename, filetype) {
				if( filetype=="js" ) {
					//判定文件类型
					var fileref = document.createElement('script');
					//创建标签
					fileref.setAttribute("type", "text/javascript");
					//定义属性type的值为text/javascript
					fileref.setAttribute("src", filename);
					//文件的地址
				}
				else
				if( filetype=="css" ) {
					//判定文件类型
					var fileref = document.createElement("link");
					fileref.setAttribute("rel", "stylesheet");
					fileref.setAttribute("type", "text/css");
					fileref.setAttribute("href", filename);
				}
				if( typeof fileref!="undefined" ) {
					document.getElementsByTagName("head")[0].appendChild(fileref);
					return true;
				}
				return false;
			},

			/**
			 * json对象转字符串形式
			 */
			_json2str : function(obj) {
				var THIS = this;
				switch(typeof(obj))
				{
					case 'string':
						return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
					case 'array':
						return '[' + obj.map(THIS._json2str).join(',') + ']';
					case 'object':
						if( obj instanceof Array ) {
							var strArr = [];
							var len = obj.length;
							for( var i = 0; i<len; i++ ) {
								strArr.push(THIS._json2str(obj[i]));
							}
							return '[' + strArr.join(',') + ']';
						}
						else
						if( obj==null ) {
							return 'null';
						}
						else {
							var string = [];
							for( var property in obj )
							string.push(THIS._json2str(property) + ':' + THIS._json2str(obj[property]));
							return '{' + string.join(',') + '}';
						}
					case 'number':
						return obj;
					case false:
						return obj;
				}
			}
		},

		/**
		 * @description
		 * @lends oTL.prototype
		 * @private
		 */
		_oVariableObj : {
			/**
			 * svg 区域的上下左右边距
			 * @default ''
			 * @type {Object} _oMargin
			 */
			_oSvgMargin : {
				_iTop : 0,
				_iRight : 0,
				_iBottom : 14,
				_iLeft : 60
			},
			
			/**
			 * x轴相关参数
			 * @type {Object} _oXaxis
			 */
			_oXaxis : {
				_iTicks : 5,	//刻度数
				_iTickSubdivide : 8,	//每个刻度之间间隔多少个小刻度
				_iTickSize : 8		//刻度的长度
			},

			/**
			 * @description 模块的宽 默认400px
			 * @static
			 * @default 200
			 * @type Number
			 */
			_iCanvasW : 350,

			/**
			 * @description 模块高 
			 * @static
			 * @default 45
			 * @type Number
			 */
			_iCanvasH : 45,
			
			/**
			 * @description 块高 默认20px
			 * @field
			 * @default 20
			 * @type Number
			 */
			_iRectH : 16,
			
			/**
			 * @description svg的区域大小
			 * @field
			 * @type Number
			 */
			_oSvgSize : {
				_iWidth : 0,
				_iHeight : 0
			},
			
			/**
			 * @description 搜索开始时间
			 * @type String
			 */
			_sStartTimeSearch : "2013-06-13 00:00:00",
			
			/**
			 * @description 搜索结束时间
			 * @type String
			 */
			_sEndTimeSearch : "2013-06-13 23:00:00",
			
			/**
			 * @description 当前的偏移位置和缩放比例
			 * @type Object
			 */
			_oCurrentTransform : {translate:[0,0], scale:1},
			
			/**
			 * @description 显示数据
			 * @type String
			 */
			_sShowData : '[{"chanid":"rms/234/1","filename":"test0.h264","filesize":20971520,"begintime":"2013-06-13 12:00:00","endtime":"2013-06-13 12:50:00"},{"chanid":"rms/234/1","filename":"test1.h264","filesize":20971521,"begintime":"2013-06-13 13:00:00","endtime":"2013-06-13 13:30:00"},{"chanid":"rms/234/1","filename":"test2.h264","filesize":20971522,"begintime":"2013-06-13 14:00:00","endtime":"2013-06-13 14:30:00"},{"chanid":"rms/234/1","filename":"test3.h264","filesize":20971523,"begintime":"2013-06-13 15:00:00","endtime":"2013-06-13 15:30:00"},{"chanid":"rms/234/1","filename":"test4.h264","filesize":20971524,"begintime":"2013-06-13 16:00:00","endtime":"2013-06-13 16:55:00"},{"chanid":"rms/234/1","filename":"test5.h264","filesize":20971525,"begintime":"2013-06-13 17:00:00","endtime":"2013-06-13 17:30:00"},{"chanid":"rms/234/1","filename":"test6.h264","filesize":20971520,"begintime":"2013-06-13 5:00:00","endtime":"2013-06-13 8:50:00"}]',

			/**
			 * 控件最低层的div的Id
			 * @field
			 * @default JSVideoPluginDiv
			 * @property _sBasicDivId
			 */
			_sBasicDivId : "",
			
			/**
			 * svg画布的id
			 * @field
			 * @default p_svgCanva
			 * @property _sBasicSvgId
			 */
			_sBasicSvgId : "p_svgCanva",
			
			/**
			 * 消息窗口的id
			 * @field
			 * @default p_tooltip
			 * @property _sInfoWindowId
			 */
			_sInfoWindowId : "p_tooltip",
			
			/**
			 * 播放控制按钮的id
			 * @field
			 * @default p_tooltip
			 * @property _sInfoWindowId
			 */
			_sPlayCtrlDiv : "p_playCtrlDiv",
			
			/**
			 * 播放控制按钮对象
			 * @field
			 * @property _oPlayCtrl
			 */
			_oPlayCtrl : null,
			
			/**
			 * 播放进度对象
			 * @field
			 * @property _oPlayProgress
			 */
			_oPlayProgress : null,
			
			/**
			 * 播放进度对象的id
			 * @field
			 * @default p_playProgressDiv
			 * @property _sPlayProgressDiv
			 */
			_sPlayProgressDiv : "p_playProgressDiv",
			
			
			/**
			 * 数据矩形对象
			 * @property _oDataRect
			 */
			_oDataRect : null,
			
			/**
			 * x轴对象
			 * @property _oXAxis
			 */
			_oXAxis : null,
			
			/**
			 * x轴比例尺对象
			 * @property _oXScale
			 */
			_oXScale : null,

			/**
			 * top控制部分div的id
			 * @field
			 * @default _videoCtrl_northDiv
			 * @property _sTopCtrlId
			 */
			_sTopCtrlId : '_Ctrl_northDiv',

			/**
			 * @description 调试信息开关量 true-开启调试信息 false-关闭调试信息
			 * @field
			 * @type Boolean
			 */
			_bDebugMode : false,

			/**
			 * 语言包 默认为英文
			 * */
			_oLanguagePackage : {
			},

			/**
			 * 默认的外部样式配置文件路径
			 * @static _sCssFilePath
			 */
			_sCssFilePath : "css/ha_timeline.css"
		},

		/**
		 * @description 初始化接口
		 * @private
		 */
		_init : {
			/**
			 * @description 初始化控件
			 * @method _initPlugin
			 * @param sClassid 控件的classid Ps: 4EF69BF4-0B48-4EC8-AD65-C5B59483592B
			 * @return {String} 如果是程序内部创建的父对象则返回创建对象的id, 否则返回空
			 */
			_initPlugin : function() {
				//new时传进来的y依附对象
				var pluginDiv = m_oParentObj;

				oTL._oVariableObj._sBasicDivId = pluginDiv.attr("id");

				//生成控件
				this._initUI();
				//调整控件大小
				//this._resize();
				//事件绑定
				this._eventBind();
				//更新界面语言
				//this._initLanguage();

				return pluginDiv;
			},

			/* *
			 *  @description 初始化语言包接口
			 * @ method _initLanguage
			 * @param {Object} oFile _languagePackage对象实例
			 */
			_initLanguage : function(oFile) {
				// if( typeof oFile=="undefined" ) {
				// oTL._oVariableObj._oLangPkg = oTL._oVariableObj._oLanguagePackage;
				// }
				// else {
				// oTL._oVariableObj._oLangPkg = oFile;
				// }
			},

			/**
			 *TODO 
			 * @description 初始化UI接口
			 * @method _initUI
			 * @param sClassid 控件的classid Ps: 4EF69BF4-0B48-4EC8-AD65-C5B59483592B
			 */
			_initUI : function() {
				//初始化画布大小
				oTL._oVariableObj._iCanvasW = m_oParentObj.width()>oTL._oVariableObj._iCanvasW ? m_oParentObj.width() : oTL._oVariableObj._iCanvasW;
				oTL._oVariableObj._iCanvasH = m_oParentObj.height()>oTL._oVariableObj._iCanvasH ? m_oParentObj.height() : oTL._oVariableObj._iCanvasH;
				
				oTL._oVariableObj._oSvgMargin._iBottom = oTL._oVariableObj._iCanvasH/2-oTL._oVariableObj._oXaxis._iTickSize+2;
				
				oTL._oVariableObj._oSvgSize._iHeight = oTL._oVariableObj._iCanvasH - oTL._oVariableObj._oSvgMargin._iTop - oTL._oVariableObj._oSvgMargin._iBottom;
				oTL._oVariableObj._oSvgSize._iWidth = oTL._oVariableObj._iCanvasW - oTL._oVariableObj._oSvgMargin._iRight - oTL._oVariableObj._oSvgMargin._iLeft;
				
				//动态改变改变矩形区域的高
				oTL._oVariableObj._iRectH = oTL._oVariableObj._oXaxis._iTickSize + 8;
				
				//统一外部div和svg画布的高度 >= 45px 和宽度>=350px
				m_oParentObj.height(oTL._oVariableObj._iCanvasH);
				m_oParentObj.width(oTL._oVariableObj._iCanvasW);
				
				var sDate = new Date();
				oTL._oVariableObj._sBasicSvgId += sDate.getTime();
				oTL._oVariableObj._sInfoWindowId += sDate.getTime();
				oTL._oVariableObj._sPlayCtrlDiv += sDate.getTime();
				oTL._oVariableObj._sPlayProgressDiv += sDate.getTime();
				delete sDate; 
				
				m_oParentObj.addClass("p_parentDiv");
				
				var pluginDiv = $("#" + oTL._oVariableObj._sBasicDivId);
				var sd = eval(oTL._oVariableObj._sShowData),
				i=0;
				for(i in sd){
					sd[i].starttime = HATools.date.str2second(sd[i].begintime);
					sd[i].stoptime = HATools.date.str2second(sd[i].endtime);
				}
				
				//创建比例尺
				oTL._oVariableObj._oXScale = d3.scale.linear()
					.domain([HATools.date.str2second(oTL._oVariableObj._sStartTimeSearch), 
							HATools.date.str2second(oTL._oVariableObj._sEndTimeSearch)])
					.range([0, oTL._oVariableObj._oSvgSize._iWidth-12]);
								
				//创建x轴
				var xAxis = d3.svg.axis()
					.scale(oTL._oVariableObj._oXScale)
					.orient("buttom")	//定向 bottom-靠下
					.ticks(oTL._oVariableObj._oXaxis._iTicks) //刻度数
					.tickSubdivide(oTL._oVariableObj._oXaxis._iTickSubdivide) //每个刻度之间间隔多少个小刻度
					.tickFormat(function(d){return HATools.date.second2str(d).split(" ")[1];})	//刻度显示的内容
					.tickSize(-oTL._oVariableObj._oXaxis._iTickSize)	//刻度的长度
				
				//创建svg画布
				var svgCanva = d3.select("#"+oTL._oVariableObj._sBasicDivId).append("svg")
					//.attr("width", oTL._oVariableObj._iCanvasW)
					//.attr("height", oTL._oVariableObj._iCanvasH)
					.attr("xlink:href", "http://www.w3.org/1999/xlink")
					.attr("xmlns", "http://www.w3.org/2000/svg")
					.attr("id", oTL._oVariableObj._sBasicSvgId);
									
				function zoomChange() {
					gZoom.select(".x.axis").call(xAxis);
					//svg.select(".y.axis").call(yAxis);
					gZoom.selectAll("rect")
						.attr("transform", "translate("+ d3.event.translate[0] +") scale("+ d3.event.scale +")")
						.attr("height", oTL._oVariableObj._iRectH/d3.event.scale)
						.attr("y", (oTL._oVariableObj._oSvgSize._iHeight-oTL._oVariableObj._iRectH)/d3.event.scale);
						// gZoom.selectAll(".classtext")
						// .attr("transform", "translate("+ d3.event.translate[0] +")")
					oTL._oVariableObj._oCurrentTransform.translate = d3.event.translate;
					oTL._oVariableObj._oCurrentTransform.scale = d3.event.scale;	
					//console.log(d3.event.scale);
				}
				
				//创建缩放比例
				var oZoom = d3.behavior.zoom()
					.x(oTL._oVariableObj._oXScale)
					.scaleExtent([1,200])
					.on("zoom", zoomChange);
						
				//创建底层g
				var gZoom = svgCanva.append("g")
					.attr("class", "zoomObj")
					.attr("transform", "translate(" + oTL._oVariableObj._oSvgMargin._iLeft + "," + oTL._oVariableObj._oSvgMargin._iTop + ")")
					//.call(oZoom);
									
				//添加x轴
				oTL._oVariableObj._oXAxis = gZoom.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + oTL._oVariableObj._oSvgSize._iHeight + ")")
					.call(xAxis);
				
				//添加数据块
				 oTL._oVariableObj._oDataRect = gZoom.append("g") 
					.selectAll("rect")
					.data(sd)
					.enter()
					.append("rect");
				
				//初始化数据块	
				oTL._oVariableObj._oDataRect.attr("class", "rect_default")
					.attr("x", function(d){return oTL._oVariableObj._oXScale(d.starttime)})
					.attr("y", oTL._oVariableObj._oSvgSize._iHeight-oTL._oVariableObj._iRectH)
					.attr("width", function(d){return oTL._oVariableObj._oXScale(d.stoptime)-oTL._oVariableObj._oXScale(d.starttime)})
					.attr("height", oTL._oVariableObj._iRectH)
					.attr("transform", "translate(0)");
					
				//创建tooltip div
				var tooltipDiv = d3.select("body").append("div")
					.attr("id", oTL._oVariableObj._sInfoWindowId)
					.attr("class", "p_tooltip")
					.html("<p style='text-align:center; line-height:20px;'><strong>Information</strong></p><p><span id='tooltipInfo'></span></p>")
					.classed("hidden", true);
					
				//创建播放控制按钮
				oTL._oVariableObj._oPlayCtrl = d3.select("body").append("div")
					.attr("id", oTL._oVariableObj._sPlayCtrlDiv)
					.attr("class", "p_playctrldiv play")
					.style("top", m_oParentObj.offset().top+(oTL._oVariableObj._iCanvasH-$("#"+oTL._oVariableObj._sPlayCtrlDiv).height())/2+"px")
					.style("left", m_oParentObj.offset().left+5+"px");
					
				//创建播放进度指针
				oTL._oVariableObj._oPlayProgress = gZoom.append("g");
					oTL._oVariableObj._oPlayProgress.append("image")
					.attr("id", oTL._oVariableObj._sPlayProgressDiv)
					.attr("class", "p_playprogressdiv")
					.attr("xlink:href", "images/timeline_scrool.png")
					.attr("height", m_oParentObj.height())
					.attr("width", 24)
					.attr("x", -12)
					.attr("y", 0)
					.attr("transform", "translate(0,0)");
			},

			/**
			 * @method _eventBind 绑定界面事件
			 * */
			_eventBind : function() {
				//绑定数据块事件
				if( oTL._oVariableObj._oDataRect != null ){
					oTL._oVariableObj._oDataRect
						.on("mouseover",function(d){
							var str = "<span class='title'>Name</span>:"+d.filename;
					    	str += "<br /><span class='title'>Begintime</span>:"+d.begintime
					    	str += "<br /><span class='title'>Endtime</span>:"+d.endtime;
					    	d3.select("#"+oTL._oVariableObj._sInfoWindowId)
					    		.classed("hidden", false)
					    		.select("#tooltipInfo")
					    			.html(str);
					    	d3.select(this).attr("class", "rect_action");
						})
						.on("mousemove", function(d){
							var move = d3.select(this).attr("transform");
					    	var xPosition = $(this).offset().left+($(this).attr("width")-$("#"+oTL._oVariableObj._sInfoWindowId).width())/2;
					    	var yPosition = $("#"+oTL._oVariableObj._sBasicSvgId).offset().top -$("#"+oTL._oVariableObj._sInfoWindowId).height()-oTL._oVariableObj._iRectH;
					    	d3.select("#"+oTL._oVariableObj._sInfoWindowId)
					    		.style("left", xPosition+"px")
					    		.style("top", yPosition+"px");
						})
						.on("mouseout", function(){
							d3.select(this).attr("class", "rect_default");
					    	d3.select("#"+oTL._oVariableObj._sInfoWindowId).classed("hidden", true);
					    });
				}
				
				//绑定播放控按钮事件
				if( oTL._oVariableObj._oPlayCtrl != null ){
					$("#"+oTL._oVariableObj._sPlayCtrlDiv).on("click", function(){
						$(this).toggleClass("pause");
						var d = 1371069519.2307692;
						oTL._init._setCurrentPoint(d);
					});
				}
				
				// if( oTL._oVariableObj._oXAxis != null ){
					// oTL._oVariableObj._oXAxis
						// .on("click", function(){
							// console.log(d3.mouse(this)[0], oTL._oVariableObj._o_XScale(d3.mouse(this)[0]-12));
							// d3.select("#"+oTL._oVariableObj._sPlayProgressDiv).attr("x",d3.mouse(this)[0]-12);
						// })
				// }
				d3.select(".zoomObj").on("click", function(){
					console.log(d3.mouse(this)[0], oTL._oVariableObj._oXScale.invert(d3.mouse(this)[0]-12));
					d3.select("#"+oTL._oVariableObj._sPlayProgressDiv).attr("x",d3.mouse(this)[0]-12);
				});
			},
			
			/**
			 *设置当前播放的位置
			 * @param {String} currenttime eg: "2013-06-13 12:00:00"
			 *  */
			_setCurrentPoint : function(currenttime){
				if( currenttime != "" ){
					if( typeof currenttime == "string" ){
						d3.select("#"+oTL._oVariableObj._sPlayProgressDiv).attr("x",oTL._oVariableObj._oXScale(HATools.date.str2second(currenttime))-12);
					}else if( typeof currenttime == "number" ){
						d3.select("#"+oTL._oVariableObj._sPlayProgressDiv).attr("x",oTL._oVariableObj._oXScale(currenttime)-12);
						console.log(oTL._oVariableObj._oXScale(currenttime));
					}
				}
			},

			/**
			 * @method _resize 移动视频控件的位置
			 * @return {String}  插件的字符串表示
			 * */
			_resize : function(iWidth, iHeight) {
				var w, h;
				if( typeof iWidth!="undefined" && typeof iHeight!="undefined" ) {
					w = iWidth>=330 ? iWidth : 670;
					h = iHeight>=120 ? iHeight : 460;

					oTL._oVariableObj._iCanvasX = w;
					oTL._oVariableObj._iCanvasY = h;
				}

				if( typeof iWidth=="undefined" || typeof iHeight=="undefined" ) {
					w = $("#" + oTL._oVariableObj._sBasicDivId).width();
					h = $("#" + oTL._oVariableObj._sBasicDivId).height();

					oTL._oVariableObj._iCanvasX = w;
					oTL._oVariableObj._iCanvasY = h;
				}

				//改变父容器大小
				oTL._init._moveDiv();
			},
			
			/**
			 * @description 更新数据
			 * @param {Object} [data] 需要更新的数据
			 * @return {Boolean} 成功-true
			 */
			_refreshData : function(data) {
				
				
			},

			/**
			 * @method _moveDiv 移动视频控件的位置
			 * @return {String}  插件的字符串表示
			 * */
			_moveDiv : function() {
				
			}
		},

		/**
		 * @description 外部接口
		 * @lends oTL.prototype
		 */
		externalInterface : {
			/**
			 * @description 重设控件的宽高
			 * @param {number} canvasX=840 模块的宽 可以为空 为空则获取依附对象的宽
			 * @param {number} canvasY=460 模块的高 可以为空 为空则获取依附对象的高
			 */
			resize : function(iWidht, iHeight) {
				oTL._init._resize(iWidht, iHeight);
			},

			/**
			 * @description 窗口大小改变事件回调
			 */
			resizeCallback : function() {
				var w = $("#" + oTL._oVariableObj._sBasicDivId).width();
				var h = $("#" + oTL._oVariableObj._sBasicDivId).height();
				oTL._init._resize(w, h);
			},

			/**
			 * @description 设置控制的模式  默认为false
			 * @param {Boolean} bFlag true-debug  false-relase
			 */
			setDebugMode : function(bFlag) {
				oTL._oVariableObj._bDebugMode = bFlag;
			},

			/**
			 * @description 绘制控件
			 * @param {Object} [oPlayerInitParam] 控件的外观样式定义,为空的话,就用默认样式
			 * @return {String} 如果是内部创建的父对象  则返回父对象id 否则返回""
			 */
			draw : function() {
				//oTL._init._initLanguage(m_oLanguageInfo);

				var cssfilepath = m_sUIInfo;
				if( typeof cssfilepath!="string" ) {
					cssfilepath = oTL._oVariableObj._sCssFilePath;
				}
				//如果外部没有传入样式配置文件路径  则使用默认路径
				if( !oTL._toolkit._loadFile(cssfilepath, "css") ) {
					oTL._log._console("load css fail, the file path:" + sFilePath);
					return false;
				}
				//绘制对象
				var sParent = oTL._init._initPlugin();

				return sParent;
			},
			
			/**
			 * @description 更新数据
			 * @param {Object} [data] 需要更新的数据
			 * @return {Boolean} 成功-true
			 */
			refreshData : function(data) {
				
				return false;
			}
		}
	};

	return oTL.externalInterface;
}
