import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import Information from 'components/Information';

import {
    makePopupInformation,
} from './selectors';
import {
    toggleInformation
} from './actions';

export function mapDispatchToProps(dispatch) {
    return {
        toggleInformation: (status) => dispatch(toggleInformation(status)),
    };
}

const mapStateToProps = createStructuredSelector({
    isPopupInformation : makePopupInformation(),
});

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(
    //
    withConnect,
)(Information);
