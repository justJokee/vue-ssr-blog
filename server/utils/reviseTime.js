//time为Date.now()
const reviseTime = function(time){
	//new Data(str)会把时间转换为本地时间，虽然传入的time参数为UTC标准时间，但是在调用方法时，new Data
	//应该在内部转换为了本地时间，一开始在time中加上了1000*60*60*8，小时数会比本地时间多了8小时。
	//服务器若设置在国外，则应当换算时区
	let localStamp = time
	let localTime = new Date(localStamp),
	 	year = localTime.getFullYear(),
	 	month = localTime.getMonth()+1,
	 	day = localTime.getDate(),
	 	hours = localTime.getHours(),
	 	minutes = localTime.getMinutes(),
	 	finTime
 	for(let i = 0;i < 9;i++){
		if(i === minutes){
			minutes = "0" + minutes
		}
	}
	finTime =  year + "年" + month + "月" + day + "日" + hours + "时" + minutes + "分" 
	return finTime
}

module.exports = reviseTime