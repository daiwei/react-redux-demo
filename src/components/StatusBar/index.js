import { connect } from 'react-redux'
import StatusBar from './StatusBar';

const mapStateToProps = ({ view, modal }) => {
    return {
        visible: view.statusBarVisible,
        location: modal.location
    }
};

export default connect(
    mapStateToProps,
    null
)(StatusBar);
