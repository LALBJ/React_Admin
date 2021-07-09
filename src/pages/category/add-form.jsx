import React, {Component} from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

export default class AddForm extends Component{
    formRef = React.createRef()
    static propTypes = {
        categorys: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired
    }
    handleSubmit = (values) => {
        console.log('handleSubmit',values)
    }
    componentDidUpdate() {
        this.formRef.current.setFieldsValue({
            parentId: this.props.parentId,
        });
    }
    render() {
        const { parentId, categorys } = this.props
        //categorys.splice(0, 0, {_id:0, name:'一级分类'})
        console.log(parentId, categorys)
        return (
            <Form
                ref = {this.formRef}
                onFinish={this.handleSubmit}>
                <Item name='parentId' initialValue={parentId}>
                    <Select>
                        {
                            categorys.map(c=><Option key={c._id} value={c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Item>
                <Item 
                    name='categoryName'
                    rules={[{required: true, message:'分类名称必须输入'}]}>
                    <Input placeholder='请输入' />
                </Item>
            </Form>
        )
    }
}