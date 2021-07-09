import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import './index.less'
import logo from '../../assets/images/logo.png'
import { Menu } from 'antd';
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons';
import menuList from '../../config/menuConfig'
import Item from 'antd/lib/list/Item';

const { SubMenu } = Menu;

class leftNav extends Component{
    /**
     * 根据menu的数据数组生成相应的标签数组
     */
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.map(item => {
            if(!item.children){
                return (
                    <Menu.Item key={item.key} icon={<PieChartOutlined />}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            }else {
                // 查找一个与当前请求分类路径匹配的子item
                const cItem = item.children.find(cItem=> path.indexOf(cItem.key)===0)
                if (cItem) this.openKey = item.key
                return (
                    <SubMenu key={item.key} icon={<MailOutlined />} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }
    render() {
        let path = this.props.location.pathname
        if(path.indexOf('/product') === 0){
            path = '/product'
        }
        const openKey = this.openKey
        return (
            <div className='left-nav'>
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    >
                    {
                        this.menuNodes
                    }
                    {/* <Menu.Item key="/home" icon={<PieChartOutlined />}>
                        <Link to='/home'>首页</Link>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                        <Menu.Item key="/category" icon={<MailOutlined />}><Link to='/category'>品类管理</Link></Menu.Item>
                        <Menu.Item key="/product" icon={<MailOutlined />}><Link to='/product'>商品管理</Link></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/user" icon={<AppstoreOutlined />}>
                        <Link to='/user'>用户管理</Link>
                    </Menu.Item>
                    <Menu.Item key="/role" icon={<DesktopOutlined />}>
                        <Link to='/role'>角色管理</Link>
                    </Menu.Item> */}
                    </Menu>
            </div>
        )
    }
}
/**
 * withRouter高阶组件：
 * 包装非路由组件，返回一个新的组件
 * 新的组件向非路由组件传递三个属性：history、location、mathch
 */
export default withRouter(leftNav)