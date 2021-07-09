import React, {Component} from 'react'
import { Card, Select, Input, Button, Table, message} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

/**
 * Product的默认子路由组件
 */
const Option = Select.Option
export default class ProductHome extends Component{
    state = {
        products: [],
        total: 0,
        loading: false,
        searchName: '', //搜索内容
        searchType: 'productName', //搜索类型
    }
    // 初始化表格的列数组
    initColumns() {
        this.columns = [
            {
                title: '商品名称' ,
                dataIndex: 'name' ,
            },
            {
                title: '商品描述',
                dataIndex: 'desc' ,
            },
            {
                width: 100,
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price
            },
            {
                width: 100,
                title: '状态',
                render: (product) => {
                    const { status, _id } = product
                    const newStatus = status===1 ? 2:1
                    return (
                        <span>
                            <Button type='primary' onClick={()=>this.changeStatus(_id, newStatus)}>{status===1?'下架':'上架'}</Button>
                            <span>{status===1?'在售':'已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            <LinkButton onClick={()=>this.props.history.push('/product/detail', product)}>详情</LinkButton>
                            <LinkButton onClick={()=>this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ]
    }
    async changeStatus(id, status) {
        const result = await reqUpdateStatus(id, status);
        if(result.status === 0) {
            message.info('更新状态成功')
        }
        this.getProducts(this.pageNum)
    }
    getProducts = async (pageNum = 1) => {
        this.pageNum = pageNum
        const {searchName, searchType} = this.state
        this.setState({loading:true})
        let result
        
        if( searchName!='' ){
            result = await reqSearchProducts({pageNum, pageSize:PAGE_SIZE, searchName, searchType})
        } else{
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        console.log(result)
        this.setState({loading:false})
        if(result.status === 0) {
            const {total, list} = result.data;
            this.setState({
                total,
                products: list
            })
        }
    }
    componentWillMount() {
        this.initColumns();
    }
    componentDidMount() {
        this.getProducts()
    }
    render() {
        const {products, total, loading, searchName, searchType} = this.state
        const title = (
            <span>
                <Select 
                    value={searchType} 
                    style={{width: 150}}
                    onChange = {value=>this.setState({searchType:value})}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input 
                    style={{width:150, margin:'0 15px'}} 
                    placeholder='关键字' 
                    value={searchName}
                    onChange={event => this.setState({searchName:event.target.value})}
                />
                <Button type='primary' onClick={() => this.getProducts(1)} >搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addUpdate')}><PlusOutlined />添加商品</Button>
        )
        return (
            <Card title={title} extra = {extra}>
                <Table 
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                    loading={loading}
                    pagination={{
                        defaultPageSize:PAGE_SIZE, 
                        showQuickJumper:true,
                        total,
                        onChange: this.getProducts
                    }}
                />

            </Card>
        )
    }
}