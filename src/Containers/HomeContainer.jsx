import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty'
/* Material import */

/* Redux Imports */
import { connect } from 'react-redux';
import genericPostData from '../Global/dataFetch/genericPostData'
/* React Pose */
import posed from 'react-pose';
/* Component Imports */
import ProductsSection from '../Components/ProductsSection/ProductsSection'
import CheckoutSection from '../Components/CheckoutSection/CheckoutSection'
import PaymentSection from '../Components/PaymentSection/PaymentSection'
import PouchDb from 'pouchdb';
import { commonActionCreater } from '../Redux/commonAction';


/* Pose Animation Configs */
const Config = {
    open: { width: '60%', opacity: 1 },
    closed: { width: '0px', opacity: 0 }
}

const Products = posed.div(Config)
const Payment = posed.div(Config);




class HomeContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            productListHeight: 0,
            isOpenProduct: true,
            isOpenPayment: false,
        }
    }

    componentDidMount() {
        let token = localStorage.getItem('Token')
        if (_isEmpty(token)){
            this.props.history.push('/login')
        }
        this.calcHeight();
        this.getProductData();
              
    }

    calcHeight() {
        let windowHeight = document.documentElement.scrollHeight
        // * Product Section Calculations
        let headerHeight = 80;
        let categoriesHeight = 90;
        let productListHeight = windowHeight - (headerHeight + categoriesHeight + 50)
        // * Checkout Section Calculations
        let checkoutHeader = headerHeight * 0.65;
        let checkoutMainPart = windowHeight - (checkoutHeader + 80);
        let checkoutcalcArea = 150
        let checkoutactionArea = 60
        let checkoutcartArea = checkoutMainPart - (checkoutcalcArea + checkoutactionArea)
        // * Checkout Customer Section Calculations
        let checkoutCustomerArea = checkoutMainPart - checkoutactionArea

        debugger

        this.setState({
            windowHeight: windowHeight,
            headerHeight,
            categoriesHeight,
            productListHeight,
            checkoutHeader,
            checkoutMainPart,
            checkoutcalcArea,
            checkoutactionArea,
            checkoutcartArea,
            checkoutCustomerArea
        })
    }

    toggleViewPayment = () => {
        this.setState({
            isOpenProduct: false,
            isOpenPayment: true,
        })
    }

    toggleViewProduct = () => {
        this.setState({
            isOpenProduct: true,
            isOpenPayment: false,
        })
    }

    getCategoryData = () => {
        let categoryDb =  new PouchDb('categoryDb');
        categoryDb.allDocs({
            include_docs: true
        }).then((results) => {
            this.props.dispatch(commonActionCreater(results,'GET_CATEGORY_DATA_SUCCESS'))
        }).catch((err) => {
            console.log(err);
        })
    }

    getProductData = () => {
       let productsdb =  new PouchDb('productsdb');
       productsdb.allDocs({
        include_docs: true,
        attachments: true,
        limit: 20,
        skip: 0
      }).then((result)=> {
          debugger;
        this.props.dispatch(commonActionCreater(result,'GET_PRODUCT_DATA_SUCCESS'));
       
      }).catch((err)=> {
       debugger;
      });
        // genericPostData({
        //     dispatch: this.props.dispatch,
        //     reqObj: {id : storeId},
        //     url: 'Product/ByStoreId',
        //     constants: {
        //         init: 'GET_PRODUCT_DATA_INIT',
        //         success: 'GET_PRODUCT_DATA_SUCCESS',
        //         error: 'GET_PRODUCT_DATA_ERROR'
        //     },
        //     // successCb:()=> this.deleteSuccess(),
        //     // errorCb:()=> this.deleteSuccess(),
        //     successText: 'Product Fetched Successfully',
        // })
    }

    componentWillReceiveProps(props){
        
    }


    render() {
        let windowHeight = document.documentElement.scrollHeight

        let { productListHeight, isOpenProduct, isOpenPayment, headerHeight, categoriesHeight, checkoutHeader, checkoutMainPart, checkoutcalcArea, checkoutactionArea, checkoutcartArea, checkoutCustomerArea } = this.state

        let { productList, dispatch, cart , categoryList } = this.props
        return (
            <div className='main pos-body'>
                <Products pose={isOpenProduct ? 'open' : 'closed'}>
                    <ProductsSection
                        // * Css Specific props
                        windowHeight={windowHeight}
                        productListHeight={productListHeight}
                        headerHeight={headerHeight}
                        categoriesHeight={categoriesHeight}
                        productList = {productList}
                        categoryList = {categoryList}
                        cart={cart}
                        dispatch={dispatch}
                        history={this.props.history}
                    // ! Actions

                    />
                </Products>

                <CheckoutSection
                    // * Css Specific props
                    windowHeight={windowHeight}
                    checkoutHeader={checkoutHeader}
                    checkoutMainPart={checkoutMainPart}
                    checkoutcalcArea={checkoutcalcArea}
                    checkoutactionArea={checkoutactionArea}
                    checkoutcartArea={checkoutcartArea}
                    checkoutCustomerArea={checkoutCustomerArea}
                    // ! Actions
                    toggleViewPayment={this.toggleViewPayment}
                    toggleViewProduct={this.toggleViewProduct}

                />

                <Payment pose={isOpenPayment ? 'open' : 'closed'}>
                    <PaymentSection />
                </Payment>

            </div>
        );
    }
}

function mapStateToProps(state) {
    let { productList, cart , categoryList} = state;
    categoryList = _get(categoryList, 'lookUpData.rows',[])
   productList =  _get(productList,'lookUpData.rows',[]);
   let totalCount = _get(productList,'lookUpData.total_rows',0);

    return {
        categoryList,
        productList,
        totalCount,
        cart
    }
}
export default connect(mapStateToProps)(HomeContainer)
