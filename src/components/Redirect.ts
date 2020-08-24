import { FunctionalComponent } from 'preact';
import { useLayoutEffect } from 'preact/hooks';
import { route } from 'preact-router';

interface Props {
  to: string;
  [key:string]: any,
}

const Redirect: FunctionalComponent<Props> = (props: Props) => {
  useLayoutEffect(() => {
    route(props.to, true);
  }, []);

  return null;
};

export default Redirect;
