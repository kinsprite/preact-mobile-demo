import { connect } from 'react-redux';
import Books from '../components/Books';

import { reloadBooks } from '../redux/actionCreators';

// const Counter = ...

const mapStateToProps = (state /* , ownProps */) => ({
  items: state.books,
});

const mapDispatchToProps = { reload: reloadBooks };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Books);
