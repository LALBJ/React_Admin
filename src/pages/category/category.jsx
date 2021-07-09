import React, {Component} from 'react'
import { Card, Table, Button, message, Modal } from 'antd'
import { PlusOutlined, RightOutlined  } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { reqAddCategory, reqCategorys, reqUpdateCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component{
    formRef = React.createRef()
    addFormRef = React.createRef()

    state = {
        loading: false, //是否正在获取数据中
        categorys: [], //一级分类列表
        subCategorys: [], //二级分类列表
        parentId: '0', //当前需要显示的分类列表的parentId
        parentName: '', //当前需要显示的分类列表的父类名称
        showStatus: 0, //标识模态框是否显示，0都不显示 1显示添加 2显示更新

    }

    /**
     * 初始化Table所有列的数组
     */
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (Category) => (
                    <span>
                        <LinkButton onClick={() => this.openUpdateModal(Category)}>修改分类</LinkButton>
                        {this.state.parentId === '0' ? <LinkButton onClick={()=>this.showSubCategorys(Category)}>查看子分类</LinkButton> : null}
                    </span>
                )
            },
        ];
    }

    /**
     * 处理打开模态框
     */
    openAddModal = () => {
        this.setState({
            showStatus: 1
        })
    }
    openUpdateModal = (category) => {
        this.category = category
        this.setState({
            showStatus: 2
        })
    }

    /**
     * 异步获取一级/二级分类列表显示
     */
    getCategorys = async () => {
        // 在发请求前， 显示loading
        this.setState({loading:true})
        const {parentId} = this.state
        // 发异步Ajax请求，获取数据
        const result = await reqCategorys(parentId)
        // 请求结束后，隐藏loading
        this.setState({loading:false})
        if(result.status === 0) {
            const categoryList = result.data;
            if(parentId === '0'){
                // 更新状态
                this.setState({
                    categorys: categoryList
                })
            } else {
                this.setState({
                    subCategorys: categoryList
                })
            }
        }else{
            message.error('获取分类分类失败')
        }
    }

    /**
     * 添加分类
     */
    addCategory = () => {
        console.log('添加')
        this.addFormRef.current.formRef.current.validateFields().then(async (values, err) => {
            if(!err) {
                const {categoryName,parentId} = values
                const result = await reqAddCategory(categoryName, parentId)
                if(result.status === 0){
                    if(parentId === this.state.parentId || parentId === '0'){
                        this.getCategorys()
                    }
                }
                this.addFormRef.current.formRef.current.resetFields()
                this.handleCancel()
            }
            
        })
        
    }
    /**
     * 更新分类
     */
    updateCategory =  () => {
        console.log('更新')
        console.log(this.formRef.current.formRef.current)
        this.formRef.current.formRef.current.validateFields().then(async (value, err) => {
            console.log(err, value)
            if(!err) {
                const categoryId = this.category._id
                const {categoryName} = value
                console.log(categoryId, categoryName)
                const result = await reqUpdateCategory({categoryId, categoryName})
                console.log(result)
                if(result.status === 0) {
                    this.getCategorys()
                }
                this.formRef.current.formRef.current.resetFields()
                this.handleCancel()
            }
        })
    }
    /**
     * 关闭模态框
     */
    handleCancel = () => {
        this.setState({
            showStatus: 0
        })
    }

    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            // 回调函数在状态更新前且重新render后执行
            this.getCategorys()
        })
    }

    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }

    componentWillMount() {
        this.initColumns()

    }
    componentDidMount() {
        this.getCategorys()
    }

    render() {
        // 读取状态数据
        const {categorys, subCategorys, parentName, parentId, loading, showStatus} = this.state
        const category = this.category || {name:''}
        // card的左侧
        const title = parentId === '0' ? '一级分类列表':(
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <RightOutlined style={{marginRight: 5}} />
                <span>{parentName}</span>
            </span>
        )
        // card的右侧
        const extra = (
            <Button onClick={this.openAddModal} type='primary'>
                <PlusOutlined />
                添加
            </Button>
        )

        return (
            <div className="header">
                <Card title={title} extra={extra} >
                    <Table 
                        rowKey='_id' 
                        loading={loading}
                        bordered 
                        pagination={{defaultPageSize:5, showQuickJumper:true}}
                        dataSource={parentId==='0' ? categorys:subCategorys} 
                        columns={this.columns} />;
                </Card>
                <Modal title="添加分类" visible={showStatus === 1} onOk={this.addCategory} onCancel={this.handleCancel}>
                    <AddForm ref = {this.addFormRef} categorys={categorys} parentId={parentId} />
                </Modal>
                <Modal title="更新分类" visible={showStatus === 2} onOk={this.updateCategory} onCancel={this.handleCancel}>
                    <UpdateForm ref = {this.formRef} categoryName = {category.name} />
                </Modal>
            </div>
        )
    }
}