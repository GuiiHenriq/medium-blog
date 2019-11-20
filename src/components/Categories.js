import React, { Component } from 'react';
import convert from 'xml-js';
import { Link } from 'react-router-dom';

export default class Categories extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataXml: [],
      postContent: [],
      imagePost: '',
      titlePost: '',
      datePost: '',
      monthsList: [
        {
          mesENG: 'Jan',
          mesPT: 'Janeiro'
        },

        {
          mesENG: 'Feb',
          mesPT: 'Fevereiro'
        },

        {
          mesENG: 'Mar',
          mesPT: 'Março'
        },

        {
          mesENG: 'Apr',
          mesPT: 'Abril'
        },

        {
          mesENG: 'May',
          mesPT: 'Maio'
        },

        {
          mesENG: 'Jun',
          mesPT: 'Junho'
        },

        {
          mesENG: 'Jul',
          mesPT: 'Julho'
        },

        {
          mesENG: 'Aug',
          mesPT: 'Agosto'
        },

        {
          mesENG: 'Oct',
          mesPT: 'Outubro'
        },

        {
          mesENG: 'Nov',
          mesPT: 'Novembro'
        },

        {
          mesENG: 'Dec',
          mesPT: 'Dezembro'
        },
      ]
    }

    this.postContent = React.createRef();
    this.postLoading = React.createRef();
  }

  componentDidMount() {
    const url = window.location.href;
    const urlPath = new URL(url);
    const urlID = urlPath.searchParams.get('id');
    this.setState({ paramUrl: urlID });

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
    if (prevState !== this.state && this.state.titlePost !== '') {
      this.postLoading.current.innerText = ' ';
    }
  }

  render() {
    const postsJson = this.state.dataXml.map((post, index) => {
      if (this.state.paramUrl == post.elements[3].elements[0].cdata) {
        if (this.state.titlePost == '') {
          this.setState({ imagePost: this.attrImage });
          this.setState({ titlePost: this.attrTitle });
          this.setState({ datePost: this.attrDate });
        }
        let attrDate;
        const datePost = post.elements[8].elements[0].text.split(" ");
        for (let i = 0; i < this.state.monthsList.length; i++) {
          if (datePost[2] === this.state.monthsList[i].mesENG) {
            attrDate = datePost[1] + ' de ' + this.state.monthsList[i].mesPT + ' de ' + datePost[3];
          }
        }

        return (
          <div className="post_cat" key={post.elements[2].elements[0].text}>
            <img src={post.elements[10].elements[0].cdata.split('"')[3]} alt="" className="img_post" />
            <div className="title_post">{post.elements[0].elements[0].cdata}</div>
            <div className="date_post">{attrDate}</div>
            <Link to={'/post?id=' + post.elements[2].elements[0].text.split("/p/")[1]} className="url_post">LEIA MAIS</Link>
          </div>
        );
      }
    });

    return (
      <div>
        <section className="header">
          <Link className="btn-back" to="/">🡄</Link>
        </section>

        <div className="title_page_category"><h1>Categoria:&nbsp;<b>{this.state.paramUrl}</b></h1></div>

        <div className="loading" ref={this.postLoading}>
          <div className="loader">
            <h3>Carregando...</h3>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="posts" ref={this.postContent}>
          {postsJson}
        </div>
      </div>
    )
  }

}
