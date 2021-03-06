import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import * as Actions from './../actions'
import PostList from './postlist'
import Loader from './loader'

@connect((state, ownProps)=>{
    return {
        content: state.contentReducer.content.flyfishingArticles,
        globals: state.appReducer.globals
    }
})

export default class Articles extends Component {

    constructor(props) {
        super(props)
        this.state = {
            paged: 1,
            posts_per_page: 16
        }
    }

    componentWillMount(){
        document.title = '0031flyfishing.com | Flyfishing articles'
        if (!this.props.content) {
            let content = axios.get('/wp-json/wp/v2/posts?categories=4&_embed&per_page=16')
            content.then(response => {
                this.props.dispatch(Actions.getContent(response.data, 'flyfishingArticles', response.headers['x-wp-totalpages']))
            })
        }
    }

    loadMorePosts(){
        this.setState({
            paged: this.state.paged + 1
        }, ()=>{
            let moreContent = axios.get('/wp-json/wp/v2/posts?categories=4&_embed&per_page='+this.state.posts_per_page+'&page='+this.state.paged)
            moreContent.then(response => {
                this.props.dispatch(Actions.loadMoreContent(response.data, 'flyfishingArticles'))
            })
        })
    }

    render(){
        if (!this.props.content) {
            return <Loader />
        } else {
            return(
                <PostList page="flyfishingArticles" paged={this.state.paged} loadMorePosts={this.loadMorePosts.bind(this)}/>
            )
        }
    }
}
