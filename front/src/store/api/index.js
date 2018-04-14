const axios = require("axios") 
const qs = require("qs")
const LRU = require('lru-cache')
require("es6-promise").polyfill()
import md5 from 'md5'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
//缓存api数据
const cached = LRU({
        max: 1000,
        maxAge: 1000 * 60 *15
    })
function ajax(type,url,options){
	return new Promise((resolve,reject) => {
		axios({
			method: type,
			url: url,
			// baseURL: "https://www.mapblog.cn",
			baseURL: "http://localhost:6180",
			params: options,
			data: qs.stringify(options)
		}).then((res) => {
			if(res.status === 200){
				resolve(res.data)
			}else{
				reject("request error in " + url)
			}
		}).catch((err) => {
			console.log(err,url)
		})
	})
}
const config = {
	get(url,options){
		let key = md5(url + JSON.stringify(options))
        if (cached && cached.has(key)) {
            return Promise.resolve(cached.get(key))
        }
        return new Promise((resolve,reject) =>{
			ajax("get",url,options).then((data) =>{
				if(cached && options.cache){
					cached.set(key,data)
				}
				resolve(data)
			})
		})
	},
	post(url,options){
		return new Promise((resolve,reject) =>{
			ajax("post",url,options).then((data) =>{
				resolve(data)
			})
		})
	},
	patch(url,options){
		return new Promise((resolve,reject) =>{
			ajax("patch",url,options).then((data) =>{
				resolve(data)
			})
		})
	},
	put(url,options){
		return new Promise((resolve,reject) =>{
			ajax("put",url,options).then((data) =>{
				resolve(data)
			})
		})
	},
	delete(url,options){
		return new Promise((resolve,reject) =>{
			ajax("delete",url,options).then((data) =>{
				resolve(data)
			})
		})
	}
}

export default config

