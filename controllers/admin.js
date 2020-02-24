const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product.ejs', {
        pageTitle: 'Add Product',
        path: 'admin/add-product.ejs',
        activeAddProduct: true,
        productCSS: true,
        editig: false
    });
}

exports.postAddProduct = (req, res, next) => {
    req.user.createProduct({
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            imageUrl: req.body.imageUrl,
            desc: req.body.description
        })
        .then(result => {
            Product.findAll()
                .then(products => {
                    res.render('admin/products.ejs', {
                        datas: products,
                        pageTitle: 'Product-List',
                        path: 'admin/product-list.ejs'
                    })
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

exports.getProductList = (req, res, next) => {

    Product.findAll()
        .then(products => {
            res.render('admin/products.ejs', {
                datas: products,
                pageTitle: 'Product-List',
                path: 'admin/product-list.ejs'
            })
        }).catch(err => console.log(err));
}

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product => {
            res.render('admin/edit-product.ejs', {
                pageTitle: 'Edit Product',
                path: 'admin/edit-product',
                productForEdit: product
            });
        })
        .catch(err => console.log(err));
}


exports.postEditData = (req, res, next) => {
    const updatedProductName = req.body.productName;
    const updatedProductPrice = req.body.productPrice;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    Product.findByPk(req.body.productId)
        .then(product => {
            product.productName = updatedProductName;
            product.productPrice = updatedProductPrice;
            product.imageUrl = updatedImageUrl;
            product.desc = updatedDesc;

            return product.save();
        })
        .then(result => {
            Product.findAll()
                .then(products => {
                    res.render('admin/products.ejs', {
                        datas: products,
                        pageTitle: 'Product-List',
                        path: 'admin/product-list.ejs'
                    })
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));

}


exports.deleteData = (req, res, next) => {
    Product.findByPk(req.params.productId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            Product.findAll()
                .then(products => {
                    res.render('admin/products.ejs', {
                        datas: products,
                        pageTitle: 'Product-List',
                        path: 'admin/product-list.ejs'
                    })
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}