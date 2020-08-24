import {
  h, FunctionalComponent, Fragment,
} from 'preact'; /** @jsx h */

import controls from '../styles/controls.module.scss';

type BookItem = {
  id: number,
  name: string,
  isbn: string,
};

type Props = {
  items: BookItem[],
  reload: () => any,
  clear: () => any,
};

const Books: FunctionalComponent<Props> = ({
  items, reload, clear,
}: Props) => (
  <Fragment>
    <table>
      <thead>
        <tr class={controls.theadRow}>
          <th>ID</th>
          <th>Name</th>
          <th>ISBN</th>
        </tr>
      </thead>
      <tbody>
        {(items || []).map((item) => (
          <tr>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.isbn}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div>
      <button type="button" class={controls.btn} onClick={reload}>Reload</button>
      <button type="button" class={controls.btn} onClick={clear}>Clear</button>
    </div>
  </Fragment>
);

export default Books;
