// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import babelPloyfill from "babel-polyfill"
import Vue from 'vue'
import store from "./store/index"
import App from './App'
import router from './router'
Vue.filter("reviseTime",function(value){
	let localTime = new Date(value),
	 	year = localTime.getFullYear(),
	 	month = localTime.getMonth()+1,
	 	day = localTime.getDate(),
	 	hours = localTime.getHours(),
	 	minutes = localTime.getMinutes(),
		// seconds = localTime.getSeconds(),
		finTime;
		for(let i = 0;i < 10;i++){
			if(i === minutes){
				minutes = "0" + minutes
			}
		}
	finTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes 
			// + ":" +seconds
	return finTime
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  	el: '#app',
  	router,
  	store,
  	template: '<App/>',
  	components: { 
  		App 
  	}
})
