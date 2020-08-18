import {
  h, FunctionalComponent, Fragment,
} from 'preact'; /** @jsx h */

type Props = {
  name: string;
  age: number;
  increaseAge: () => {type: string},
  decreaseAge: () => {type: string},
  resetAge: () => {type: string},
}

const User: FunctionalComponent<Props> = ({
  name, age, increaseAge, decreaseAge, resetAge,
}: Props) => (
  <Fragment>
    <h1>
      Hello,
      {' '}
      { name }
      !
    </h1>
    <p>
      Your age is
      {' '}
      { age }
      .
      <button type="button" onClick={decreaseAge}>-1</button>
      <button type="button" onClick={increaseAge}>+1</button>
      <button type="button" onClick={resetAge}>Reset</button>
    </p>
  </Fragment>
);

export default User;
