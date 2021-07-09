import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const Option = Select.Option

export default class updateForm extends Component{
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
    }
    formRef = React.createRef()
    componentDidUpdate() {
        this.formRef.current.setFieldsValue({
            categoryName: this.props.categoryName,
        });
    }
    render() {
        const { categoryName } = this.props
        return (
            <Form
                ref = {this.formRef}
                onFinish={this.handleSubmit}>
                <Item 
                    name='categoryName' 
                    initialValue={categoryName}
                    rules={[{required: true, message:'分类名称必须输入'}]}>
                    <Input placeholder={this.props.categoryName} />
                </Item>
            </Form>
        )
    }
}
