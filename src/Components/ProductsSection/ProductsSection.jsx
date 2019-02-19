import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find'
/* Material import */
import LockIcon from '@material-ui/icons/Lock';
import ExitToApp from '@material-ui/icons/ExitToApp';
/* Redux Imports */
import { commonActionCreater } from '../../Redux/commonAction'
/* Component Imports */
import SideDrawer from '../SideDrawer'
import Products from './Products';
import SearchBar from './SearchBar'


class ProductsSection extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    logout = () => {
        localStorage.clear();
        this.props.history.push('/login')
    }

    render() {
        let { windowHeight, productListHeight, headerHeight, categoriesHeight } = this.props
        return (
            <div className='pos-products-collection' style={{ height: windowHeight }}>

                {/* 
                // * Header Component
                */}
                <div className='pos-header' style={{ height: headerHeight }}>
                    <div className="header-top flex-row align-center justify-space-between pl-10 pr-10" >
                        <SideDrawer />
                        <SearchBar />
                        <div>
                            <LockIcon style={{color: 'white', padding:'0 10px', fontSize: 30}}/>
                            <ExitToApp style={{color: 'white', padding:'0 10px', fontSize: 30}} onClick={this.logout}/>
                        </div>
                    </div>
                    <div className='header-bottom'>

                    </div>
                </div>


                {/* 
                // * Product Categories Component
                */}
                <div className='product-catogories' style={{ height: categoriesHeight }}>
                    <div className='each-tile blue-background'>
                        <span className='category-text'>
                            Hello
                            </span>
                    </div>
                    <div className='each-tile blue-background'>
                        <span className='category-text'>
                            Hello
                            </span>
                    </div>
                    <div className='each-tile blue-background'>
                        <span className='category-text'>
                            Hello
                            </span>
                    </div>
                    <div className='each-tile blue-background'>
                        <span className='category-text'>
                            Hello
                            </span>
                    </div>
                </div>

                {/* 
                // * Products List Component
                */}


                <Products
                    {...this.props}
                />

            </div>
        );
    }
}

export default ProductsSection;