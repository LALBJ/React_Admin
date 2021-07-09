import React, {Component} from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
// import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import htmlToDraft from 'html-to-draftjs'
import PropTypes from 'prop-types'

export default class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }

    constructor(props) {
        super(props)
        const html = this.props.detail
        if(html) {
            const contentBlock = htmlToDraft(html)
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            const editorState = EditorState.createWithContent(contentState)
            this.state = {
                editorState,
            }
        } else {
            this.state = {
                editorState: EditorState.createEmpty(),
            }
        }
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        })
    }

    uploadImgCallback = (file) => {
        return new Promise(
            (resolve, reject) => {
                
                const xhr = new XMLHttpRequest()
                console.log('callback', xhr)
                xhr.open('POST', '/manage/img/upload')
                const data = new FormData()
                data.open('image', file)
                xhr.send(data)
                xhr.addEventListener('load', () => {
                    console.log('load')
                    const response = JSON.parse(xhr.response)
                    const url = response.data.url
                    resolve({data: {link:url}})
                })
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText)
                    reject(error)
                })
            }
        )
    }

    getDetail = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    render () {
        const { editorState } = this.state
        return (
            <div>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    editorStyle={{border:'1px solid black', minHeight: 200, paddingLeft: 10}}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        image: {uploadCallback: this.uploadImgCallback, alt: {present:true, mandatory:true}}
                    }}
                />
            </div>
        )
    }
}