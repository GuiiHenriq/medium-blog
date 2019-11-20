import React, { Component } from 'react';
import convert from 'xml-js';
import { Link } from 'react-router-dom';

export default class Search extends Component {
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

  removerAcentos(newStringComAcento) {
    let string = newStringComAcento;
    let mapaAcentosHex = {
      a: /[\xE0-\xE6]/g,
      A: /[\xC0-\xC6]/g,
      e: /[\xE8-\xEB]/g,
      E: /[\xC8-\xCB]/g,
      i: /[\xEC-\xEF]/g,
      I: /[\xCC-\xCF]/g,
      o: /[\xF2-\xF6]/g,
      O: /[\xD2-\xD6]/g,
      u: /[\xF9-\xFC]/g,
      U: /[\xD9-\xDC]/g,
      c: /\xE7/g,
      C: /\xC7/g,
      n: /\xF1/g,
      N: /\xD1/g,
      '-': /\s/g
    };

    for (let letra in mapaAcentosHex) {
      const expressaoRegular = mapaAcentosHex[letra];
      string = string.replace(expressaoRegular, letra);
    }

    return string.toLowerCase();
  }

  componentDidMount() {
    const url = window.location.href;
    const urlPath = new URL(url);
    const urlID = urlPath.searchParams.get('id');
    const filterURL = this.removerAcentos(urlID);
    this.setState({ paramNormalUrl: urlID });
    this.setState({ paramFilterURL: filterURL });

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
      if (
        post.elements[3].elements[0].cdata.includes(this.state.paramFilterURL) || this.removerAcentos(post.elements[0].elements[0].cdata).includes(this.state.paramFilterURL) ||
        this.state.paramFilterURL.includes(post.elements[3].elements[0].cdata) ||
        this.state.paramFilterURL.includes(post.elements[0].elements[0].cdata)
      ) {
        if (this.state.titlePost == '') {
          this.setState({ imagePost: this.attrImage });
          this.setState({ titlePost: this.attrTitle });
          this.setState({ datePost: this.attrDate });
        }
        let postDate;
        const datePost = post.elements[8].elements[0].text.split(" ");
        for (let i = 0; i < this.state.monthsList.length; i++) {
          if (datePost[2] === this.state.monthsList[i].mesENG) {
            postDate = datePost[1] + ' de ' + this.state.monthsList[i].mesPT + ' de ' + datePost[3];
          }
        }

        return (
          <div className="post_cat" key={post.elements[2].elements[0].text}>
            <img src={post.elements[10].elements[0].cdata.split('"')[3]} alt="" className="img_post" />
            <div className="title_post">{post.elements[0].elements[0].cdata}</div>
            <div className="date_post">{postDate}</div>
            <Link to={'/post?id=' + post.elements[2].elements[0].text.split("/p/")[1]} className="url_post">LEIA MAIS</Link>
          </div>
        );
      } else {
        this.postLoading.current.innerText = 'Não foi possível achar!';
      }
    });

    return (
      <div>
        <section className="header">
          <Link className="btn-back" to="/">🡄</Link>
        </section>

        <div className="title_page_category"><h1>Resultado:&nbsp;<b>{this.state.paramNormalUrl}</b></h1></div>

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

