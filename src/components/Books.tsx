import {
  h, FunctionalComponent, Fragment,
} from 'preact'; /** @jsx h */

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
        <tr>
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
      <button type="button" onClick={reload}>Reload</button>
      <button type="button" onClick={clear}>Clear</button>
    </div>
  </Fragment>
);

export default Books;
