import React from 'react';
import _get from 'lodash/get';
import Product from './Product';
import _isEmpty from 'lodash/isEmpty';



const Products = (props) => {
    
    let productList = _get(props, 'productList', [])
    let products 
    if(productList.length == 0) {
        products = <div className="no-product-found">
            <h1>No Product Found!</h1>
        </div>
    } else {
        products = productList.map((data, index) => {
            return <Product
                data={data}
                key={index}
                index={index}
                productList={props.productList}
                //cart={_get(props, 'cart', [])}
                dispatch={props.dispatch}
            />
        })
    }

    

    return (
        <React.Fragment>
            {products}
        </React.Fragment>
    )
}

export default Products;