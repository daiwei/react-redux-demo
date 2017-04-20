import { connect } from 'react-redux'
import NavBar from './NavBar';
import mapActions from '../../utils/mapActions'
import { select_user } from '../../actions';

const mapStateToProps = ({ view }) => {
    return {
        visible: view.visible,
    }
};

const mapDispatchToProps = mapActions({ select_user })

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBar);
