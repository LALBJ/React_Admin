import React, {Component} from 'react'
import { Form, Input, Button, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom';
/*
登陆的路由组件
*/ 
// const Item = Form.Item // 不能写在import之前
export default class Login extends Component{
    handleSubmit =async (values) => {
        console.log(values)
        const {username, password} = values
        try{
            const result = await reqLogin(username, password)
            if(result.status === 0){
                //登录成功
                message.success('登录成功')
                const user = result.data
                memoryUtils.user = user
                //console.log(user)
                storageUtils.saveUser(user) // 保存到local中
                //跳转到后台管理界面(不需要回退，不使用push)
                this.props.history.replace('/')
            }else{
                //登录失败
                message.error(result.msg)
            }
        }catch(error){
            console.log("请求出错了")
        }
        
        // 请求登录

        // 阻止事件默认行为
        //event.preventDefault()
    }
    validatePwd = (rule, value, callback) => {
        if(!value) {
            callback('密码必须输入！')
        }else if(value.length < 4){
            callback('密码长度不能小于4位')
        }else if(value.length > 12){
            callback('密码长度不能大于12位')
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('密码必须是英文、数字或下划线组成')
        }else {
            callback()
        }
    }
    render() {
        const user = memoryUtils.user
        //console.log(user)
        if(user && user._id){
            return <Redirect to='/' />
        }
        // 具有强大功能的Form对象
        // const form = this.props.form
        // const {getFieldDecorator} = form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={this.handleSubmit}
                        >
                        <Form.Item
                            name="username"
                            rules={[
                                //声明式验证：直接使用别人定义好的规则进行验证
                                { required: true, whitespace:true, message: '用户名必须输入!' },
                                { min: 4, message: '用户名至少4位!' },
                                { max: 12, message: '用户名最多12位'},
                                { pattern: /^[a-zA-Z0-9_]+$/,message: '用户名必须是英文、数字、下划线组成'}
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ validator: this.validatePwd }]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
/**
 * 1. 前台表单验证
 * 2. 收集表单输入数据
 * 3. 
 */
/**
 * 1.高阶函数
 *  一类特别的函数：
 *      a. 接受函数类型的参数
 *      b. 返回值是函数
 *  常见的高阶函数：
 *      a. setTimeOut()/setInterval()
 *      b. Promise then
 *      c. 数组遍历相关的方法： forEach/filter/map/reduce/find/findIndex
 *      d. 函数bind方法
 *  高阶函数更新动态，更加具有扩展性
 * 2.高阶组件
 *  本质是一个函数
 *  接收一个组件，返回一个新的组件，新组件内部渲染被包装
 *  作用：扩展组件的功能
 *  高阶组件也是高阶函数：接收一个组件函数，返回一个新的组件函数
 */
/**
 * 包装Form组件生成一个新的组件
 * 新组件会向Form组件传递一个强大的对象
 */
// const WrapLogin = Form.create()(Login)

// export default WrapLogin

/**
 * async和await
 * 1. 作用
 *      简化promise对象的使用：不用再使用then来指定成功/失败的回调函数
 *      以同步编码方式（没有回调函数了）实现异步流程
 * 2. 哪里写await
 *      在返回promise的表达式的左侧写await：不想要promise，想要promise异步执行成功的value数据
 * 3. 哪里写async
 *      await所在函数（最近的）定义的左侧
 */