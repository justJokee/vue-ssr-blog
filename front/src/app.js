// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from "./store"
import { sync } from 'vuex-router-sync'
Vue.filter("reviseTime",function(value){
	let localTime = new Date(value),
	 	year = localTime.getFullYear(),
	 	month = localTime.getMonth()+1,
	 	day = localTime.getDate(),
	 	hours = localTime.getHours(),
	 	minutes = localTime.getMinutes(),
		// seconds = localTime.getSeconds(),
		finTime
		for(let i = 0;i < 10;i++){
			if(i === minutes){
				minutes = "0" + minutes
			}
		}
	finTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes 
			// + ":" +seconds
	return finTime
})
// Vue.config.productionTip = false

/* eslint-disable no-new */
export function createApp(){
	const router = createRouter()
	const store = createStore()
	sync(store,router)
	const app = new Vue({
	  	router,
	  	store,
	  	render: h => h(App)
	})
	return { app,router, store}
}

