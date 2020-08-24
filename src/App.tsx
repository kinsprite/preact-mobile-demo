import { h, FunctionalComponent } from 'preact'; /** @jsx h */
import { Route, Router, RouterOnChangeArgs } from 'preact-router';
import { Provider } from 'react-redux';
import loadable from '@loadable/component';

import Counter from './components/Counter';
import Redirect from './components/Redirect';

import Example from './containers/example';
import Home from './containers/home';

import UserContainer from './containers/UserContainer';

import { createStore } from './redux/store';
import reducers from './redux/reducers';
import { flushPreloadMessages } from './nativeMessage';
import './chan';

const BooksContainer = loadable(() => import('./containers/BooksContainer'), {
  fallback: <div>Loading...</div>,
});

type Props = { CLI_DATA?: any, preloadedState?: any };

const App : FunctionalComponent<Props> = ({ preloadedState }: Props) => {
  let currentUrl: string;

  const handleRoute = (e: RouterOnChangeArgs) => {
    currentUrl = e.url;
    console.log('Current URL: ', currentUrl);  // eslint-disable-line
  };

  const store = createStore(reducers, preloadedState);
  flushPreloadMessages(store.dispatch);

  return (
    <div id="root">
      <Provider store={store}>
        <Router onChange={handleRoute}>
          <Route path="/home" component={Home} />
          <Route path="/example" component={Example} />
          <Route path="/counter" component={Counter} />
          <Route path="/user" component={UserContainer} />
          <Route path="/books" component={BooksContainer} />
          <Redirect default to="/home" />
        </Router>
      </Provider>
    </div>
  );
};

export default App;
