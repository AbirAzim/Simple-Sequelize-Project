const Product = require('../models/product');

const cartDatas = [];

exports.getHomePage = (req, res, next) => {
    //console.log(adminData.data);
    res.render('homePage/shop.ejs', {
        pageTitle: 'Home',
        path: 'homePage/shop.ejs'
    });
}

exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;

    Product.findByPk(productId)
        .then(product => {
            res.render('shop/product-details', {
                data: product,
                pageTitle: 'Details',
                path: 'users/products'
            })
        })
        .catch(err => console.log(err));
}

exports.getProductsPage = (req, res, next) => {

    req.user.getProducts()
        .then(products =>
            res.render('shop/product-list', {
                datas: products,
                pageTitle: 'Product-List',
                path: 'users/products'
            })
        )
        .catch(err => console.log(err));
}


exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({
                where: {
                    id: productId
                }
            });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(productId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: {
                    quantity: newQuantity
                }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}


exports.getCart = (req, res, next) => {

    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        path: 'user/cart',
                        pageTitle: 'Cart',
                        cart: products
                    })
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}


exports.deleteFromCart = (req, res, next) => {
    const id = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({
                where: {
                    id: id
                }
            });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts()
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = {
                            quantity: product.cartItem.quantity
                        };
                        return product;
                    }))
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);

        })
        .then(result => {
            res.redirect('/order');
        })
        .catch(err => console.log(err));
}

exports.getOrder = (req, res, next) => {
    req.user.getOrders({
            include: ['products']
        })
        .then(orders => {
            res.render('shop/order', {
                path: 'user/order',
                pageTitle: 'Your Orders',
                orders: orders
            })
        })
        .catch(err => console.log(err));
}


exports.getCheckout = (req, res, next) => {
    res.render('shop/checkOut')
}