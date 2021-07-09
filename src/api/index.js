/**
 * 包含应用中所有接口请求函数的模块
 * 每个函数返回promise
 */

 import ajax from './ajax'
 import jsonp from 'jsonp'
import { message } from 'antd'

 //登录 
 export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

 //添加用户
 export const reqAddUser = (user) => ajax('/manage/user/add', {user}, 'POST')

 //获取一级/二级分类的列表
 export const reqCategorys = (parentId) => ajax('/manage/category/list', {parentId}, 'GET')
 //添加分类
 export const reqAddCategory = (categoryName, parentId) => ajax('/manage/category/add', {categoryName,parentId}, 'POST')
 //更新分类
 export const reqUpdateCategory = ({categoryId, categoryName}) => ajax('/manage/category/update', {categoryId,categoryName}, 'POST')
 //获取分类名称
 export const reqCategory = (categoryId) => ajax('/manage/category/info', {categoryId})
 //获取商品分页列表
 export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize}, 'GET')
 //更新商品状态
 export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')
 //更新或添加商品信息
 export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id?'update':'add'), product, 'POST')
 //搜索商品
 export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax('manage/product/search', {
     pageNum,
     pageSize,
     [searchType]:searchName
 }, 'GET')
 //删除图片
 export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'POST')
 //请求角色列表
 export const reqRoles = () => ajax('/manage/role/list')
 //创建角色
 export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')
 //更新角色
 export const reqUpdateRole = ({_id, menus, auth_time, auth_name}) => ajax('/manage/role/update', {_id, menus, auth_time, auth_name}, 'POST')
 //reqAddRole('5fe500cecc325b333')
/**
 * jsonp请求的函数
 */
 export const reqWeather = (city) => {
     return new Promise((resolve, reject)=> {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=5d2d3e6c0d5188bec134fc4fc1b139e0&city=${city}&extensions=base`
        console.log(url)
        // 发送jsonp请求
        jsonp(url, {}, (err, data) => {
            console.log(err, data)
            // 如果成功了
            if(!err && data.status === '1'){
                let weather = data.lives[0].weather
                //console.log(weather)
                resolve({weather})
            }else {
                //如果失败了
                message.error('获取天气失败！')
            }
        })
     })
     
 } 
 /**
  * jsonp解决ajax跨域的原理
  * 1) jsonp只能解决GET类型的Ajax请求跨域问题
  * 2) jsonp请求不是Ajax请求，而是一般的get请求
  * 3) 基本原理
  *     浏览器端：
  *         动态生成<script>来请求后台接口（src就是接口的url）
  *         定义好用于接收响应数据的函数，并将函数名通过请求函数传给后台(如：callback=fn)
  *     服务器端：
  *         接收到请求处理产生结果数据后，返回一个函数调用js代码，并将结果数据作为实参传入函数调用
  *     浏览器端：
  *         收到响应自动执行函数调用的js代码，也就是执行了提前定义好的回调函数，并得到了结果数据
  */
 