/**
 * 能发送异步Ajax请求的模块
 * 封装axios库
 * 函数的返回值是promise对象
 * 1. 优化：统一处理请求异常
 *      在外层抱一个自己创建的promise对象
 *      在请求出错时，不reject，而是直接进行提示
 * 2. 优化：异步得到的不是response，而是response.data
 *      在请求成功resolve时：resolve(response.data)
 */
import axios from 'axios'
import {message} from 'antd'
export default function cusAjax(url, data={}, type='GET'){
    return new Promise((resolve, reject)=>{
        let promise
        // 1. 执行异步Ajax请求
        if(type === 'GET'){
            //console.log(data)
            promise = axios.get(url, {
                params: data
            })
        } else {
            promise = axios.post(url, data)
        }
        // 2. 如果成功了，调用resolve(value)
        promise.then(response =>{
            resolve(response.data)
        }).catch(error=>{
            message.error('请求出错了:' + error.message)
        })
    })
}
