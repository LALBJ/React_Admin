import React, {Component} from 'react'
import {Card, List} from 'antd'
import {LeftOutlined} from '@ant-design/icons'
import Item from 'antd/lib/list/Item'
import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'
/**
 * Product的详情子路由组件
 */
// const Item = List.Item
export default class ProductDetail extends Component{
    // const {}
    state = {
        cName1: '',
        cName2: '',
    }
    async componentDidMount() {
        const {pCategoryId, categoryId} = this.props.history.location.state
        if(pCategoryId === '0'){
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({
                cName1
            })
        }else{
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)]) 
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }
    render() {
        console.log()
        const {name, desc, detail, imgs, price} = this.props.history.location.state
        const {cName1, cName2} = this.state
        const title = (
            <span>
                <LinkButton>
                    <LeftOutlined 
                        style={{marginRight: 15}} 
                        onClick = {()=>this.props.history.goBack()}
                    />商品详情
                </LinkButton>   
            </span>
        )
        return (
            <Card 
                className='product-detail'
                title={title}>
                <List>
                    <Item>
                        <span className='left'>商品名称：</span>
                        <span>{name}</span>
                    </Item>
                    <Item className='detail-list'>
                        <span className='left'>商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item className='detail-list'>
                        <span className='left'>商品价格：</span>
                        <span>{price}元</span>
                    </Item>
                    <Item className='detail-list'>
                        <span className='left'>所属分类：</span>
                        <span>{cName1} {cName2?' -》'+cName2:''}</span>
                    </Item>
                    <Item className='detail-list'>
                        <span className='left'>商品图片：</span>
                        <span>
                            {
                                imgs.map(item=>{
                                    return (
                                        <img 
                                            src={BASE_IMG_URL + item} 
                                            alt="img" 
                                            className='product-img'
                                        />
                                    )
                                })
                            }
                        </span>
                    </Item>
                    <Item className='detail-list'>
                        <span className='left'>商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}