import { FunctionalComponent } from 'preact';
import { route } from 'preact-router';

interface Props {
  to: string;
  routeContent: any;
  [key:string]: any;
}

const Redirect: FunctionalComponent<Props> = ({ to, routeContent }: Props) => {
  if (routeContent) {
    routeContent.url = to; // eslint-disable-line no-param-reassign
  }

  route(to, true);
  return null;
};

export default Redirect;
