import React, {Component} from 'react'
import { Button, Card, Form, Input, message, Cascader } from 'antd'
import {LeftOutlined} from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { options } from 'less'
import { reqAddOrUpdateProduct, reqCategorys } from '../../api'
import { Option } from 'antd/lib/mentions'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
/**
 * Product的添加和更新的子路由组件
 */
const {Item} = Form
const {TextArea} = Input
export default class ProductAddUpdate extends Component{
    formRef = React.createRef()
    pwRef = React.createRef()
    rteRef = React.createRef()
    state = {
        options : [],
    }
    validatePrice = (rules, value, callback) => {
        if(value*1 >0 ){
            callback()
        }else{
            callback("输入数值必须大于0")
        }
    }
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
    
        // load options lazily
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false;
        if(subCategorys && subCategorys.length > 0){
            // 生成一个二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            targetOption.children = childOptions
        } else {
            targetOption.isLeaf = true
        }
        this.setState({
            options:  [...this.state.options]
        })
      };
    submit =  () => {
        this.formRef.current.validateFields().then(async (values, err) => {
            if(!err) {
                console.log(values)
                const {name, desc, price, categoryIds} = values
                let pCategoryId, categoryId
                if(categoryIds.length === 1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                }else{
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pwRef.current.getImgs()
                const detail = this.rteRef.current.getDetail()
                const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}
                if(this.isUpdate){
                    product._id = this.product._id
                }
                console.log(product)
                const result = await reqAddOrUpdateProduct(product)
                if(result.status === 0){
                    message.success(`${this.isUpdate?'更新':'添加'}成功`)
                    this.props.history.goBack()
                }else{
                    message.error(`${this.isUpdate?'更新':'添加'}失败`)
                }
            }
        })
    }
    // 初始化级联表单的Options
    initOptions = async (categorys) => {
        console.log(categorys)
        const options = categorys.map(item => ({
            value: item._id,
            label: item.name,
            isLeaf: false
        }))

        // 如果是一个二级分类商品的更新
        const { isUpdate, product } = this
        const { pCategoryId, categoryId } = product
        if(isUpdate && pCategoryId !== '0'){
            const subCategorys = await this.getCategorys(pCategoryId)
            //生成二级列表的二级下拉列表
            const childOptions = subCategorys.map(item => ({
                value: item._id,
                label: item.name,
                isLeaf: true
            }))
            //找到商品对应的一级Option对象
            const targetOption = options.find(option => option.value === pCategoryId)
            //关联到对应的一级Option上
            targetOption.children = childOptions
        }

        this.setState({
            options
        })
    }
    // 获取一级/二级分类
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if(result.status === 0) {
            const categorys = result.data
            
            // 如果是一级列表
            if (parentId === "0") {
                this.initOptions(categorys)
            } else {
                return categorys
            }
            
        }
    }
    componentDidMount() {
        this.getCategorys('0')
    }
    componentWillMount() {
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {}
    }
    render() {
        const { isUpdate, product } = this
        const {pCategoryId, categoryId, imgs, detail} = product
        const categoryIds = []
        if(isUpdate) {
            // 如果是一个一级分类商品
            if(pCategoryId === '0'){
                categoryIds.push(pCategoryId)
            }else{
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        console.log(categoryIds)
        const title = (
            <LinkButton onClick={() => this.props.history.goBack()}>
                <LeftOutlined />
                <span>{ isUpdate? '修改商品' : '添加商品' }</span>
            </LinkButton>
        )
        const formItemLayout = {
            labelCol: {span:2},
            wrapperCol: {span:6}
        }
        const { options } = this.state
        return (
            <Card title = {title}>
                <Form ref={this.formRef} {...formItemLayout}>
                    <Item initialValue={product.name} name="name" label='商品名称:' rules={[{require:true, message:"请输入商品名称"}]}>
                        <Input placeholder='请输入商品名称' />
                    </Item>
                    <Item initialValue={product.desc} name="desc" label='商品描述:' rules={[{required:true, message:"请输入商品描述"}]}>
                        <TextArea placeholder='请输入商品描述' autoSize={{minRows:2, maxRows:6}}/>
                    </Item>
                    <Item initialValue={product.price} name="price" label='商品价格:' rules={[{required:true, message:"请输入商品描述"}, {validator:this.validatePrice}]}>
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元'/>
                    </Item>
                    <Item initialValue={categoryIds} name="categoryIds" label="商品分类:">
                        <Cascader placeholder="请指定商品分类" options={options} loadData={this.loadData} />
                    </Item>
                    <Item name='imgs' label='商品图片:'>
                        <PicturesWall ref={this.pwRef} imgs={imgs}/>
                    </Item>
                    <Item name='detail' labelCol={{span:2}} wrapperCol={{span:20}} label='商品详情:'>
                        <RichTextEditor ref={this.rteRef} detail={detail} />
                    </Item>
                    <Item>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Item>
                    
                </Form>
            </Card>
        )
    }
}