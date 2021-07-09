import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from "../../config/menuConfig"
import {reqWeather} from '../../api'
import {Modal} from 'antd'
import './index.less'
import LinkButton from '../link-button'

class header extends Component{
    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '',//天气图片url
        weather: '',//天气的文本
    }
    getTime = () => {
        this.intervalId = setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }
    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if(item.key == path){
                title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }
    getWeather =async () => {
        const {weather} = await reqWeather('北京')
        this.setState({weather})
    }
    /**
     * 退出登录
     */
    logout = ()=> {
        // 显示推出框
        Modal.confirm({
            content:"确定退出吗？",
            onOk: () => {
                //console.log('OK')
                // 删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                //跳转到login
                this.props.history.replace('/login')
            },
        })
    }
    /**
     * 一般在此执行异步操作：发Ajax请求/启动定时器
     */
    componentDidMount() {
        //获取当前时间
        this.getTime()
        //获取当前天气
        this.getWeather()
        
    }
    /**
     * 在当前组件销毁之前调用
     */
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalId)
    }
    render() {
        const {currentTime, dayPictureUrl, weather} = this.state
        const username = memoryUtils.user.username
        let title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎,{username}</span>
                    <LinkButton onClick={this.logout}>登出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(header)