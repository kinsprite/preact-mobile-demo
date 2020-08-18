import { h, FunctionalComponent } from 'preact'; /** @jsx h */
import { Route, Router, RouterOnChangeArgs } from 'preact-router';

import AppExample from './AppExample';
import Home from './home';
import Counter from './Counter';
import Redirect from './Redirect';

type Props = { CLI_DATA?: any };

const RouterBase : FunctionalComponent<Props> = () => {
  let currentUrl: string;

  const handleRoute = (e: RouterOnChangeArgs) => {
    currentUrl = e.url;
    console.log('Current URL: ', currentUrl);
  };

  return (
    <div id="root">
      <Router onChange={handleRoute}>
        <Route path="/home" component={Home} />
        <Route path="/app-example" component={AppExample} />
        <Route path="/counter" component={Counter} />
        <Redirect default to="/home" />
      </Router>
    </div>
  );
};

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
