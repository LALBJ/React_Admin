import React, {Component} from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

export default class AddForm extends Component{
    formRef = React.createRef()
    handleSubmit = (values) => {
        console.log('handleSubmit',values)
    }

    render() {
        return (
            <Form
                ref = {this.formRef}
                onFinish={this.handleSubmit}>
                <Item 
                    name='roleName'
                    label='角色名称'
                    rules={[{required: true, message:'角色名称必须输入'}]}>
                    <Input placeholder='请输入' />
                </Item>
            </Form>
        )
    }
}