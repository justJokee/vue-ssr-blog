const axios = require("axios") 
const qs = require("qs")
require("es6-promise").polyfill()
import router from "../../router/"
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
//拦截器，为后端每一个请求加上authorization
axios.interceptors.request.use(config => {
    const token = localStorage.getItem("validate-info-tk")
    if (token) {
        config.headers.Authorization = token
    }
    return config
}, error => {
    return Promise.reject(error)
})
//拦截器，后端验证token失败后跳转到登录界面
axios.interceptors.response.use(data => {
	if(data.data.code&&data.data.code === 401){
		router.push({name: "login"})
	}
	return data	
},error => {
	return Promise.reject(error)
})
function ajax(type,url,options){
	return new Promise((resolve,reject) => {
		axios({
			method: type,
			url: url,
			// baseURL: "http://localhost:8080",//开发模式下vue-cli已经配置了请求转发，所以不用基础路径即可
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
		return new Promise((resolve,reject) =>{
			ajax("get",url,options).then((data) =>{
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
	put(url,options){
		return new Promise((resolve,reject) =>{
			ajax("put",url,options).then((data) =>{
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
	delete(url,options){
		return new Promise((resolve,reject) =>{
			ajax("delete",url,options).then((data) =>{
				resolve(data)
			})
		})
	}
}
export default config