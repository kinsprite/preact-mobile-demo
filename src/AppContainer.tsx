import { h, FunctionalComponent } from 'preact'; /** @jsx h */
import { Route, Router, RouterOnChangeArgs } from 'preact-router';
import { Provider } from 'react-redux';

import AppExample from './AppExample';
import Home from './home';
import Counter from './Counter';
import UserContainer from './contianers/UserContainer';
import Redirect from './Redirect';

import { createStore } from './store';
import reducers from './redux/reducers';

type Props = { CLI_DATA?: any, preloadedState?: any };

const AppContainer : FunctionalComponent<Props> = ({ preloadedState }: Props) => {
  let currentUrl: string;

  const handleRoute = (e: RouterOnChangeArgs) => {
    currentUrl = e.url;
    console.log('Current URL: ', currentUrl);  // eslint-disable-line
  };

  const store = createStore(reducers, preloadedState);

  return (
    <div id="root">
      <Provider store={store}>
        <Router onChange={handleRoute}>
          <Route path="/home" component={Home} />
          <Route path="/app-example" component={AppExample} />
          <Route path="/counter" component={Counter} />
          <Route path="/user" component={UserContainer} />
          <Redirect default to="/home" />
        </Router>
      </Provider>
    </div>
  );
};

export default AppContainer;
