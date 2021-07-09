import React, {Component} from 'react'
import { Form, Select, Input, Tree } from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const Item = Form.Item
const {TreeNode} = Tree

export default class AuthForm extends Component{
    formRef = React.createRef()
    constructor(props) {
        super(props)
        const menus = this.props.role.menus
        this.state = {
            checkedKeys: menus
        }
    }
    handleSubmit = (values) => {
        console.log('handleSubmit',values)
    }
    onCheck = checkedKeys => {
        this.setState({checkedKeys})
    }

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item)=>{
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        },[])
    }

    getMenus = () => this.state.checkedKeys

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    componentWillReceiveProps(nextProps) {
        const menus =  nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })
        /**
         * react声明周期特性
         * this.state.checkedKeys = menus
         * 因为这个声明周期钩子下一步才是render所以不用害怕不会更新
         */
    }

    render() {
        const {role} = this.props
        console.log(role.name)
        const {checkedKeys} = this.state
        return (
            <div>
                <Item 
                    label='角色名称'>
                    <Input value={role.name} disabled/>
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    {this.treeNodes}
                </Tree>
            </div>
        )
    }
}