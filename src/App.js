import React from 'react';
import Posts from './components/Posts.js';
import PostContent from './components/PostContent.js';
import Categories from './components/Categories.js';
import Search from './components/Search.js';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/" exact={true} component={Posts} />
          <Route path="/post" component={PostContent} />
          <Route path="/categorias" component={Categories} />
          <Route path="/search" component={Search} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
