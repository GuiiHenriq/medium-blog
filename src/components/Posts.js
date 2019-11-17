import React, { Component } from 'react';
import '../Posts.css';
import convert from 'xml-js';
import { Link } from 'react-router-dom';

export default class Posts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataXml: [],
      postContent: [],
      categorieFilter: [],
      valueInput: '',
      menuCategories: [],
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

    this.posts = React.createRef();
    this.categories = React.createRef();
    this.postLoading = React.createRef();
    this.inputSearch = React.createRef();
    this.linkSearch = React.createRef();
  }

  componentDidMount() {
    document.title = 'Blog'
  }

  componentWillMount() {
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
  }

  componentDidUpdate(prevState) {
    if (prevState !== this.state) {
      this.postLoading.current.innerText = ' ';
      const postNodeList = Array.from(this.posts.current.childNodes);

      for (let i = 0; i < postNodeList.length; i++) {
        //const filterStart = this.state.dataXml[i].elements[10].elements[0].cdata.split('img alt="" src=').pop();

        let postList = this.state.dataXml[i];
        const filterImgPost = postList.elements[10].elements[0].cdata.split('"')[3];
        const titlePost = postList.elements[0].elements[0].cdata;
        const datePost = postList.elements[8].elements[0].text.split(" ");
        const categoryPost = postList.elements[3].elements[0].cdata;
        const urlPost = postList.elements[1].elements[0].text;

        postNodeList[i].childNodes[0].setAttribute('src', filterImgPost);
        postNodeList[i].childNodes[1].innerHTML = titlePost;

        for (let y = 0; y < this.state.monthsList.length; y++) {
          if (datePost[2] === this.state.monthsList[y].mesENG) {
            postNodeList[i].childNodes[2].innerHTML = datePost[1] + ' de ' + this.state.monthsList[y].mesPT + ' de ' + datePost[3];
          }
        }

        postNodeList[i].childNodes[3].innerHTML = `Categoria: ${categoryPost}`;
        //postNodeList[i].childNodes[4].setAttribute('href', urlPost);
      }
    }
  }

  convertToJson(apiXML) {
    let array = [];
    let resultJson = convert.xml2js(apiXML, { compact: false, spaces: 4, nativeType: true });
    this.setState({ dataXml: resultJson.elements[0].elements[0].elements.splice(9) }, () => {
      this.state.dataXml.map(dataXml => {
        if (!array.includes(dataXml.elements[3].elements[0].cdata)) {
          array.push(dataXml.elements[3].elements[0].cdata);
        }
      });
      this.setState({ menuCategories: array });
      this.state.dataXml.map(post => ('Rodando...'))
      const guidID = this.state.dataXml[0].elements[2].elements[0].text;
    });
  }

  handleKeyDown(e) {
    const link = document.querySelector('.link-search');
    if (e.key === 'Enter') {
      link.click();
    }
  }

  render() {
    const categoriesJson = this.state.menuCategories.map((post, index) => {
      return (
        <div className="categorie" key={index}>
          <Link to={'/categorias?id=' + post} className="category_post">{post}</Link>
        </div>
      );
    });

    const postsJson = this.state.dataXml.map((post, index) => {
      return (
        <div className="post" key={post.elements[2].elements[0].text}>
          <img src="" alt="" className="img_post" />
          <div className="title_post"></div>
          <div className="date_post"></div>
          <Link to={'/categorias?id=' + post.elements[3].elements[0].cdata} className="category_post"></Link>
          <Link to={'/post?id=' + post.elements[2].elements[0].text.split("/p/")[1]} className="url_post">LEIA MAIS</Link>
        </div>
      );
    });

    return (
      <div>
        <Link className="btn-back" to="/">VOLTAR</Link>

        <div className="search">
          <input type="text" onChange={() => this.setState({ valueInput: this.inputSearch.current.value })} onKeyDown={this.handleKeyDown} ref={this.inputSearch}></input>
          <Link ref={this.linkSearch} className="link-search" to={'/search?id=' + this.state.valueInput}>Pesquisar</Link>
        </div>

        <div className="loading" ref={this.postLoading}>
          <div className="loader">
            <p>Carregando...</p>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="posts-categorie" ref={this.categories}>
          <h3>Categorias:</h3>{categoriesJson}
        </div>

        <div className="posts" ref={this.posts}>
          {postsJson}
        </div>
      </div>
    )
  }
}
