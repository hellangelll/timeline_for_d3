var HATools = {
	date : {
		/**
		 *把sTime转换为秒
		 * @method
		 * @param {String} sTime "2013-7-22 10:20:10"
		 * @return {Number} 156356
		 * */
		str2second : function(sTime) {
			if( sTime && typeof sTime==="string" ) {
				return new Date(sTime.replace(/\-/g, '/')).getTime()/1000;
			}
			else {
				return false;
			}
		},

		/**
		 * 把iTime转换为时间字符串
		 *@method
		 * @param {Number} iTime 156356
		 * @return {String} "2013-7-22 10:20:10"
		 *  */
		second2str : function(iTime) {
			var dt = "", fmt = "yyyy-MM-dd hh:mm:ss";
			if( iTime ) {
				dt = new Date(iTime*1000);
			}
			else {
				return false;
			}
			var z = {
				M : dt.getMonth() + 1,
				d : dt.getDate(),
				h : dt.getHours(),
				m : dt.getMinutes(),
				s : dt.getSeconds()
			};
			fmt = fmt.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
				return ((v.length>1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2);
			});
			return fmt.replace(/(y+)/g, function(v) {
				return dt.getFullYear().toString().slice(-v.length);
			});
		}
	},

	cloneData : function(Obj) {
		var buf;
		if( Obj instanceof Array ) {
			buf = [];
			//创建一个空的数组
			var i = Obj.length;
			while( i-- ) {
				buf[i] = this.cloneData(Obj[i]);
			}
			return buf;
		}
		else
		if( Obj instanceof Object ) {
			buf = {};
			//创建一个空对象
			for( var k in Obj ) {//为这个对象添加新的属性
				buf[k] = this.cloneData(Obj[k]);
			}
			return buf;
		}
		else {
			return Obj;
		}
	}
}
