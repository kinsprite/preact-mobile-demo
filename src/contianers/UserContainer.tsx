import { connect } from 'react-redux';
import User from '../components/User';

import { increaseAge, decreaseAge, resetAge } from '../redux/actionCreators';

// const Counter = ...

const mapStateToProps = (state /* , ownProps */) => ({
  name: state.name,
  age: state.age,
});

const mapDispatchToProps = { increaseAge, decreaseAge, resetAge };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(User);
