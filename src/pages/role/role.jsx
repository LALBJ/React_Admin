import React, {Component} from 'react'
import { Card, Button, Table, Result, Modal, message } from 'antd'
import { reqAddRole, reqRoles, reqUpdateRole } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dateUtils'
import AddForm from './add-form'
import AuthForm from './auth-form'

export default class Role extends Component{
    addFormRef = React.createRef()
    authFormRef = React.createRef()
    state = {
        roles: [], //角色列表
        role: {}, //当前选中的角色
        isShowAdd: false,
        isShowAuth: false,
    }
    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
        ]
    }
    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({
                    role
                })
            }
        }
    }
    getRoles = async ()=>{
        const reuslt = await reqRoles();
        if(reuslt.status === 0){
            const roles = reuslt.data
            this.setState({
                roles
            })
        }
    }
    addRole = () => {
        
        this.addFormRef.current.formRef.current.validateFields().then(async (values, err) => {
            if(!err) {
               
                const {roleName} = values
                const result = await reqAddRole(roleName)
                console.log(result)
                if(result.status === 0){
                    message.success('添加成功')
                    const role = result.data
                    this.setState({
                        roles: [...this.state.roles, role]
                    })
                }
                this.addFormRef.current.formRef.current.resetFields()
                this.setState({isShowAdd: false})
            }
            
        })
    }
    updateRole = async () => {
        const role = this.state.role
        const menus = this.authFormRef.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username

        const result = await reqUpdateRole(role)
        if(result.status === 0) {
            message.success('设置角色权限成功')
            this.setState({
                roles: [...this.state.roles]
            })
        }
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getRoles()
    }
    render() {
        const { roles, role, isShowAdd, isShowAuth } = this.state
        const title = (
            <span>
                <Button type='primary' onClick={()=>{this.setState({isShowAdd: true})}}>创建角色</Button> &nbsp; &nbsp;
                <Button type='primary' onClick={()=>{this.setState({isShowAuth: true})}}  disabled={!role._id}>设置角色权限</Button>
            </span>
        )
        return (
            <Card
                title={title}
            >
                <Table 
                    rowKey='_id' 
                    bordered 
                    pagination={{defaultPageSize:5}}
                    dataSource={roles} 
                    rowSelection={{type:'radio', selectedRowKeys:[role._id]}}
                    columns={this.columns}
                    onRow={this.onRow} />
                <Modal title="创建角色" visible={isShowAdd} onOk={this.addRole} onCancel={()=>{
                    this.setState({isShowAdd:false})
                    this.addFormRef.current.formRef.current.resetFields()}
                }>
                    <AddForm ref = {this.addFormRef}/>
                </Modal>
                <Modal title="设置角色权限" visible={isShowAuth} onOk={this.updateRole} onCancel={()=>{
                    this.setState({isShowAuth:false})}
                }>
                    <AuthForm ref = {this.authFormRef} role={role}/>
                </Modal>
            </Card>
        )
    }
}