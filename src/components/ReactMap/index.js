import {connect} from 'react-redux'
import ReactMap from './ReactMap';
import mapActions from '../../utils/mapActions'
import { status_bar_show, status_bar_hide, status_bar_refresh } from '../../actions'


const mapStateToProps = ({ map }) => {
    return {
        action: map.action,
    }
};

const mapDispatchToProps = mapActions({ status_bar_show, status_bar_hide, status_bar_refresh })


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReactMap);
