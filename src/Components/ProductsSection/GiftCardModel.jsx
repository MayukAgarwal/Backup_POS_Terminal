import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isArray from 'lodash/isArray';
import _find from 'lodash/find';
/* Redux Imports */
import { commonActionCreater } from '../../Redux/commonAction';
import genericPostData from '../../Global/dataFetch/genericPostData';
import { connect } from 'react-redux';
/* Material Imports */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import _findIndex from 'lodash/findIndex';
import CircularProgress from '@material-ui/core/CircularProgress';
import addToCart from '../../Global/PosFunctions/addToCart';
import splitDotWithInt from '../../Global/PosFunctions/splitDotWithInt';
let regex = /^\d*[\.\d]{1,3}$/;

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

class GiftCardModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            giftCard: {
                giftCode: '',
                value: {
                    amount: '',
                    currency: 'USD'
                }
            },
            isGiftCodeError: true,
            isGiftValueError: true,
            giftCodeMsg: '',
            giftValueMsg: ''
        }
    }

    getExistingGiftCard = (url, data, successMethod, errorMethod) => {
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: data,
            url: url,
            constants: {
                init: 'GET_GIFT_CARD_DATA_INIT',
                success: 'GET_GIFT_CARD__DATA_SUCCESS',
                error: 'GET_GIFT_CARD__DATA_ERROR'
            },
            identifier: 'GET_GIFT_CARD__DATA',
            successCb: successMethod,
            errorCb: errorMethod,
            dontShowMessage: true
        })
    }

    handleGetGiftcardDataSuccess = () => {
        let { giftCard } = this.props;
        if (giftCard) {
            let status = _get(giftCard, 'status', 0);
            if (giftCard.giftCode && status !== 0) {
                giftCard.giftCode = '';
                _set(giftCard, 'value.amount', 0);
                this.setState({
                    giftCard,
                    giftCodeMsg: 'This giftcode already exist.',
                    isGiftCodeError: true
                })
            }
            //  else {
            //     _set(giftCard, 'value.amount', 0);
            //     _set(giftCard, 'value.currencyCode', '$');
            //     this.setState({
            //         giftCard
            //     })
            // }
        } else if (giftCard == null) {
            this.setState({ isGiftCodeError: false, giftCodeMsg: '' })
        }
    }

    handleGetGiftCardDataError = () => {
        this.setState({ isGiftCodeError: false })
    }

    handleSaveGiftDataSuccess = (data) => {
        let { giftCard } = this.props;
        if (giftCard) {
            this.setState({ isLoading: false })
            this.handleAddToCart();
        }
    }
    handleSaveGiftDataError = (err) => {
        this.setState({ giftCodeMsg: 'Something went wrong', giftValueMsg: 'Something went wrong', isLoading: false });
    }

    getModalStyle() {
        const top = 10;
        const left = 3;

        return {
            top: `${top}%`,
            left: `${left}%`,
            // transform: `translate(-${top}%, -${left}%)`,
        };
    }

    addGiftCard = (e, index) => {
        let val = _get(this.state.giftCard, 'giftCode', '');
        let url1 = 'GiftCard/GetByCodeAndStore';
        let reqBody = {
            storeId: localStorage.getItem('storeId'),
            code: val
        }
        this.getExistingGiftCard(url1, reqBody, this.handleGetGiftcardDataSuccess, this.handleGetGiftCardDataError);

        this.setState({ isLoading: true })
        let data = { ...this.state.giftCard };
        if (!data.id) {
            data.retailerId = localStorage.getItem('retailerId');
            data.storeId = localStorage.getItem('storeId');
            _set(data, 'createdOn.seconds', parseInt((new Date().getTime()) / 1000));
            _set(data, 'value.amount', splitDotWithInt(data.value.amount))
        }
        let url = 'GiftCard/Create';
        this.getExistingGiftCard(url, data, this.handleSaveGiftDataSuccess, this.handleSaveGiftDataError);
    }

    handleAddToCart = () => {
        if (this.state.isGiftCodeError) {

        } else {
            let cartItems = _get(this, 'props.cart.cartItems', []);
            let cart = _get(this, 'props.cart', {});
            let doc = {};
            _set(doc, 'product.id', _get(this.props, 'giftCard.id', ''));
            _set(doc, 'product.isGiftCard', true);
            _set(doc, 'product.name', _get(this.state, 'giftCard.giftCode', ''));
            _set(doc, 'product.salePrice.currency', _get(this.state, 'giftCard.value.currency', 'USD'));
            _set(doc, 'product.salePrice.amount', _get(this.state, 'giftCard.value.amount', 0));
            let data = {
                id: _get(this.props, 'giftCard.id', ''),
                value: _get(this.state, 'giftCard.value', {}),
                doc: doc,
            }
            addToCart(data, cartItems, cart, 1, this.props.dispatch)
            this.props.handleClose();

            // let reqObj
            // if (isExist) {
            //     let index = _findIndex(cartItems, ['id', this.props.giftCard.id]);
            //     reqObj = [
            //         ...cartItems
            //     ]
            //     reqObj[index].doc.product.salePrice.price = this.state.giftCard.value.amount;
            // } else {
            //     reqObj = [
            //         ...cartItems,
            //         {
            //             ...data,
            //             qty: 1,
            //             saleType: 1,
            //         }
            //     ];
            // }
        }
    }

    handleBlur = (e) => {
        this.props.cart.cartItems.map(item => {
            if (item.doc.product.name == Number(this.state.giftCard.giftCode)) {
                this.setState({ isGiftCodeError: true, giftCodeMsg: 'Gift Code already added in cart.' })
            } else {
                this.setState({ isGiftCodeError: false, giftCodeMsg: '' })
            }
        })

        let val = _get(e, 'target.value', '');
        let url = 'GiftCard/GetByCodeAndStore';
        let data = {
            storeId: localStorage.getItem('storeId'),
            code: val,
        }
        this.getExistingGiftCard(url, data, this.handleGetGiftcardDataSuccess, this.handleGetGiftCardDataError);
    }

    handleGiftCodeChange = (e, name) => {
        let val = _get(e, 'target.value', '');
        if (val !== '') {
            this.setState({ isGiftCodeError: false, giftCodeMsg: '' })
            this.props.cart.cartItems.map(item => {
                if (item.doc.product.name == Number(val)) {
                    this.setState({ isGiftCodeError: true, giftCodeMsg: 'Gift Code already added in cart.' })
                } else {
                    this.setState({ isGiftCodeError: false, giftCodeMsg: '' })
                }
            })
        } else {
            this.setState({ isGiftCodeError: true, giftCodeMsg: 'Please enter a gift code.' })
        }
        let giftCard = _get(this.state, 'giftCard', {});
        _set(giftCard, 'giftCode', val);
        this.setState({ giftCard })
    }
    handleGiftValueChange = (val) => {
        let giftCard = _get(this.state, 'giftCard', {});
        if (splitDotWithInt(val) < 500 || splitDotWithInt(val) > 10000 || val == '') {
            this.setState({ isGiftValueError: true, giftValueMsg: 'Value must be between 5 and 100' })
            _set(giftCard, 'value.amount', val);
            this.setState({ giftCard });

        } else {
            if (regex.test(val)) {
                _set(giftCard, 'value.amount', val);
                this.setState({ giftCard })
            }
            else if (regex.test(val.substring(0, val.length - 1))) {
                _set(giftCard, 'value.amount', val.substring(0, val.length - 1));
                this.setState({ giftCard })
            }
            else {
                _set(giftCard, 'value.amount', '');
                this.setState({ giftCard });
            }
            this.setState({ isGiftValueError: false, giftValueMsg: '' });

        }

    }
    handleInputChange = num => event => {
        let focusItemValue = _get(this.state, 'giftCard.value.amount');
        if (num != '<') {
            focusItemValue = (focusItemValue || '') + num;
            let regex = /^\d*[\.\d]{1,3}$/;
            if (!regex.test(focusItemValue))
                return false;

        }
        else {
            focusItemValue = '';
        }
        this.handleGiftValueChange(focusItemValue)
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth
                    onClose={this.props.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id='customized-dialog-title' onClose={this.props.handleClose}>
                        Create Gift Card
                    </DialogTitle>
                    <DialogContent>
                        <div className="d-flex justify-space-evenly" >
                            <div style={this.getModalStyle()}>
                                <div className="">
                                    <TextField
                                        id="giftCode"
                                        label="Gift Code"
                                        value={_get(this.state, 'giftCard.giftCode', '')}
                                        onChange={(e) => this.handleGiftCodeChange(e, 'giftCode')}
                                        onBlur={(e) => this.handleBlur(e)}
                                        margin="outline"
                                        fullWidth
                                        type='text'
                                        variant="outlined"
                                        className='mt-10'
                                    />
                                </div>
                                <div style={{ color: 'red' }}>
                                    {this.state.giftCodeMsg}
                                </div>
                                <div className="">
                                    <TextField
                                        id="value"
                                        label="Value"
                                        value={_get(this.state, 'giftCard.value.amount', '')}
                                        onChange={(e) => this.handleGiftValueChange(e.target.value)}
                                        margin="outline"
                                        fullWidth
                                        helperText='Between 5$-100$'
                                        variant="outlined"
                                        className='mt-10'
                                    />
                                </div>
                                <div style={{ color: 'red' }}>
                                    {this.state.giftValueMsg}
                                </div>
                            </div>
                            <div className="numpad-global ml-20 mt-10">
                                <div className='card numpad-card' style={{}}>
                                    <span className='card-title'>Numpad</span>
                                    <div className='flex-row flex-wrap justify-center pt-15'>
                                        <div className='key small-key' onClick={this.handleInputChange('1')}>1</div>
                                        <div className='key small-key' onClick={this.handleInputChange('2')}>2</div>
                                        <div className='key small-key' onClick={this.handleInputChange('3')}>3</div>
                                        <div className='key small-key' onClick={this.handleInputChange('4')}>4</div>
                                        <div className='key small-key' onClick={this.handleInputChange('5')}>5</div>
                                        <div className='key small-key' onClick={this.handleInputChange('6')}>6</div>
                                        <div className='key small-key' onClick={this.handleInputChange('7')}>7</div>
                                        <div className='key small-key' onClick={this.handleInputChange('8')}>8</div>
                                        <div className='key small-key' onClick={this.handleInputChange('9')}>9</div>
                                        <div className='key small-key' onClick={this.handleInputChange('.')}>.</div>
                                        <div className='key small-key' onClick={this.handleInputChange('0')}>0</div>
                                        <div className='key small-key' onClick={this.handleInputChange('<')}>clr</div>
                                        <div className='small-key'></div>
                                        <div className='key big-key'>Enter</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div>
                            <Button onClick={() => this.props.handleClose()} className='btnmodalsecondary' variant="outlined">Cancel</Button>
                        </div>
                        <div>
                            {this.state.isLoading ?
                                <CircularProgress color="secondary" /> :
                                <Button disabled={this.state.isGiftCodeError || this.state.isGiftValueError} onClick={() => this.addGiftCard()} className='btnmodalprimary' variant="outlined">Add To Cart
                                </Button>
                            }
                        </div>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let { cart, giftCardData } = state;
    let giftCard = _get(giftCardData, 'lookUpData', {});
    return {
        cart,
        giftCard,
    }
}


export default connect(mapStateToProps)(GiftCardModal);