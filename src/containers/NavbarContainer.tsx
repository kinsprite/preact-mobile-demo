import { FunctionalComponent, h } from 'preact'; /** @jsx h */
import Navbar from '../components/Navbar';

const routes = [{
  href: '/home',
  text: 'Home',
}, {
  href: '/example',
  text: 'Example',
}, {
  href: '/user',
  text: 'User',
}, {
  href: '/books',
  text: 'Books',
}];

const NavbarContainer: FunctionalComponent = () => (
  <Navbar routes={routes} />
);

export default NavbarContainer;
