import React from 'react'
import { Upload, Modal, message } from 'antd';
import PropTypes from 'prop-types'
import { PlusOutlined } from '@ant-design/icons';
import { reqDeleteImg } from '../../api';
import { BASE_IMG_URL } from '../../utils/constants';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs: PropTypes.array
  }

  constructor(props){
    super(props)
    let fileList = []
    const {imgs} = this.props
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        url: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_URL + img
      }))
    }
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList,
    };

  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = async ({ file, fileList }) => {
    console.log(file.status)
      if(file.status === 'done') {
          const result = file.response
          if(result.status === 0) {
              message.success('上传图片成功！')
              const { name, url } = result.data
              file = fileList[fileList.length - 1]
              file.name = name
              file.url = url
          }else{
              message.error('上传图片失败')
          }
      } else if(file.status === 'removed') {
        const result = await reqDeleteImg(file.name)
        if(result.status === 0) {
          message.success('删除图片成功！')
        } else {
          message.error('删除图片失败！')
        }
      }
      this.setState({ fileList })
    };
  
  /**
   * 获取所有已上传图片文件名的数组
   */
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action="/manage/img/upload"
          accept='image/*' /** 只接收图片格式 */
          listType="picture-card" /** 卡片样式 */
          name='image' /** 请求参数名 */
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
