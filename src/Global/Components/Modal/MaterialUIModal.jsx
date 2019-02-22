import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import RemoveCircleIcons from '@material-ui/icons/RemoveCircleOutline';
import AddIcons from '@material-ui/icons/AddCircleOutline';
import _get from 'lodash/get';

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 35;
    const left = 35;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    },
});

class SimpleModal extends React.Component {
    state = {
        open: false,
        qty: 0
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    incrementer = () => {
        this.setState({ qty: this.state.qty + 1 })
    }

    decrementer = () => {
        this.setState({ qty: this.state.qty - 1 })
    }

    addToCart = (index, qty) => {
        this.props.addToCart(index, qty);
        this.setState({ qty: 0 })
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.props.open}
                    onClose={this.props.onClose}
                >
                    <div style={getModalStyle()} className={classes.paper}>
                        <Typography variant="h6" id="modal-title">
                            {this.props.title}
                        </Typography>
                        <Typography variant="subtitle1" id="simple-modal-description">
                            <div className="col-sm-12">
                                <div className="col-sm-6 pop-img">
                                    <img src={_get(this.props.productDetails, 'image', '')} alt={_get(this.props.productDetails, 'image', '')} />
                                </div>

                                <div className="col-sm-6">
                                    <div className='flex-column fwidth'>
                                        <div className='truncate'>
                                            <span className="each-card-name">{_get(this.props.productDetails, 'name', '')}</span>
                                        </div>
                                        <div className='truncate'>
                                            <span className="each-card-code-head">Code : </span>
                                            <span className='each-card-code'>{_get(this.props.productDetails, 'id', '')}</span>
                                        </div>
                                        <div className="each-card-price flex-row">
                                            {_get(this.props.productDetails, 'salePrice.currencyCode', '')} {_get(this.props.productDetails, 'salePrice.price', 'NaN')}
                                            <div className='indicator'></div>
                                        </div>
                                        <div className='expanded-options'>
                                            <span className='option-title'>Quantity</span>
                                            <div className='flex-row justify-center align-center'>
                                                <RemoveCircleIcons onClick={() => this.decrementer()} style={{ fontSize: '1.7em' }} />
                                                <span className='quantity'>{this.state.qty}</span>
                                                <AddIcons onClick={() => this.incrementer()} style={{ fontSize: '1.7em' }} />
                                            </div>
                                        </div>
                                        <div className='button-section flex-row '>
                                            <Button className='mr-20' variant="outlined" onClick={() => this.addToCart(this.props.index, this.state.qty)}>Add To Cart</Button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Typography>
                    </div>
                </Modal>
            </div>
        );
    }
}

SimpleModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleModal);