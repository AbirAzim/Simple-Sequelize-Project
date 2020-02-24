// const http = require('http');
// const rt = require('./routes');
const express = require('express');
const bodyParser = require('body-parser'); //for rendering req.body
const path = require('path');

const router = require('./routes/admin'); //importing admin.js file
const homePage = require('./routes/shop'); //importing shop.js file
const errorPage = require('./controllers/error');
const sequelize = require('./util/db');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


const app = express();


app.set('view engine', 'ejs'); // to set ejs as view engine
app.set('views', 'views'); //to set ejs as view engine


app.use(bodyParser.urlencoded({ // for rendering req.body
    extended: false
}));



app.use(express.static(path.join(__dirname, 'public'))); //for stylesheet 

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

app.use('/admin', router);
app.use(homePage);


app.use(errorPage.errorController);


Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {
    through: CartItem
});
Product.belongsToMany(Cart, {
    through: CartItem
});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {
    through: OrderItem
});
Product.belongsToMany(Order, {
    through: OrderItem
});




sequelize.sync(

        // {
        //     force: true
        // }

    )
    .then(result => {
        // console.log(result);
        //app.listen(3000);
        return User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return User.create({
                name: 'bk',
                email: 'badhonkhanbk007@gmail.com'
            });
        }
        return user;
    })
    .then(user => {
        return user.createCart();
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => console.log(err));