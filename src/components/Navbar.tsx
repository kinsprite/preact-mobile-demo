import { FunctionalComponent, h } from 'preact'; /** @jsx h */
import { Link } from 'preact-router/match';

import styles from './Navbar.module.scss';

type Props = {
  routes: {
    href: string,
    text: string,
  }[],
}

const Navbar: FunctionalComponent<Props> = ({ routes }: Props) => (
  <nav class={styles.navbar}>
    <ul>
      {routes.map((route) => (
        <li>
          <Link href={route.href} class={styles.link} activeClassName={styles.active}>{route.text}</Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default Navbar;
