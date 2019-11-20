import React, { Component } from 'react';
import convert from 'xml-js';
import { Link } from 'react-router-dom';
import '../PostContent.css';

export default class PostContent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      postAberto: '',
      dataXml: [],
      postContent: [],
      paramUrl: '',
      conteudoPost: '',
      titlePost: ''
    }

    this.postContent = React.createRef();
    this.postLoading = React.createRef();
  }

  componentDidMount() {
    const url = window.location.href;
    const urlPath = new URL(url);
    const variavel = urlPath.searchParams.get('id')
    this.setState({ paramUrl: variavel });

    const POSTS_XML = 'https://cors-anywhere.herokuapp.com/https://medium.com/feed/@guiihenriq';
    fetch(POSTS_XML, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(r => r.text())
      .then(dados => {
        this.convertToJson(dados);
      })
      .then(() => {
      });
  }

  convertToJson(apiXML) {
    let resultJson = convert.xml2js(apiXML, { compact: false, spaces: 4, nativeType: true });
    this.setState({ dataXml: resultJson.elements[0].elements[0].elements.splice(9) }, () => {
      this.state.dataXml.map(post => ('Rodando...'))
      const guidID = this.state.dataXml[0].elements[2].elements[0].text;
      this.state.dataXml.map(post => {
        if (post.elements[2].elements[0].text.split("/p/")[1] == guidID) {
          console.log(post);
        }
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state && this.state.conteudoPost !== '') {
      //console.log(this.state.conteudoPost)
      this.postLoading.current.innerText = ' ';
      this.postContent.current.childNodes[0].innerHTML = this.state.conteudoPost;
    }
    document.title = this.state.titlePost;
  }

  render() {
    const postsJson = this.state.dataXml.map((post, index) => {
      if (this.state.paramUrl == post.elements[2].elements[0].text.split("/p/")[1]) {
        if (this.state.conteudoPost == '') {
          this.setState({ conteudoPost: post.elements[10].elements[0].cdata });
          this.setState({ titlePost: post.elements[0].elements[0].cdata });
        }
        return (
          <div className="post_aberto" key={post.elements[2].elements[0].text.split("/p/")[1]}>
            <div className="content_post">{post.elements[10].elements[0].cdata}</div>
          </div>
        );
      }
    });

    return (
      <div>
        <section className="header">
          <Link className="btn-back" to="/">🡄</Link>
        </section>

        <div className="loading" ref={this.postLoading}>
          <div className="loader">
            <h3>Carregando...</h3>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div ref={this.postContent}>
          {postsJson}
        </div>
      </div>
    )
  }
}
