import React from 'react';

import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import AppExample from './AppExample';
import Home from './home';
import Counter from './Counter';

function RouterBase() : JSX.Element {
  return (
    <Router>
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/app-example">
          <AppExample />
        </Route>
        <Route path="/counter">
          <Counter />
        </Route>
        <Route path="*">
          <Redirect to="/home" />
        </Route>
        )
      </Switch>
    </Router>
  );
}

interface MetaObj {
  description: string;
  keywords: string;
  title: string;
}

const metaMap: {[url: string]: MetaObj} = {
  '/home': {
    description: 'Home description',
    keywords: 'Home',
    title: 'Home',
  },
  '/app-example': {
    description: 'App example description',
    keywords: 'App, Example',
    title: 'App Example',
  },
};

function getMetaObj(url: string) : MetaObj {
  return metaMap[url];
}

export default RouterBase;

export {
  getMetaObj,
};
