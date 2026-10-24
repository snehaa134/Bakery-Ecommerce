const Cart = require("../models/Cart");
const Product = require("../models/Product");
const STATUS_CODE = require("../helpers/enum");

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Product not found"
            })
        }

        if (!product.isAvailable || product.stock < 1) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "Product not available"
            })
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "Invalid quantity"
            })
        }


        const cartFilter = req.user ? { user: req.user.id } : { guest: req.cartGuestId }
        let cart = await Cart.findOne(cartFilter)

        if (!cart) {
            cart = new Cart({
                ...cartFilter,
                items: []
            })
        }


        if (cart) {
            const existingItem = cart.items.find((item) => item.product.toString() === productId);

            

            if (existingItem) {
                if (existingItem.quantity + quantity > product.stock) {
                    return res.status(STATUS_CODE.BAD_REQUEST).json({
                        message: "Stock limit reached"
                    })
                }
                existingItem.quantity += quantity;

            } else {
                cart.items.push({
                    product: productId,
                    quantity
                })
            }


            await cart.save();

            return res.status(STATUS_CODE.OK).json({
                message: "Product added to cart successfully",
                cart
            })
        }


    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })

    }
}

const getCart = async (req, res) => {
    try {

        const cartFilter = req.user ? { user: req.user.id } : { guest: req.cartGuestId };

        const cart = await Cart.findOne(
            cartFilter
        ).populate("items.product");

        if (!cart) {
            return res.status(STATUS_CODE.OK).json({
                message: "Cart is Empty",
                data: {
                    items: []
                }
            })
        }

        return res.status(STATUS_CODE.OK).json({
            message: "Cart fetched successfully",
            data: cart
        })
    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}

const updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cartFilter = req.user ? { user: req.user.id } : { guest: req.cartGuestId };

        const cart = await Cart.findOne(cartFilter);

        if (!cart) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Cart not found",
            })
        }


        const item = cart.items.find((item) => item.product.toString() === productId);

        if (!item) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Product not found in cart"
            });
        }

        const product = await Product.findById(productId);

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "Invalid quantity"
            });
        }

        if (!product || quantity > product.stock) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "Stock limit reached"
            });
        }

        item.quantity = quantity;
        await cart.save();

        return res.status(STATUS_CODE.OK).json({
            message: "Quantity updated successfully"
        });

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
}

const removeProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const cartFilter = req.user ? { user: req.user.id } : { guest: req.cartGuestId };
        const cart = await Cart.findOne(cartFilter);

        if (!cart) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Cart not found",
            })
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();
        return res.status(STATUS_CODE.OK).json({
            message: "Product removed successfully"
        });

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
}
module.exports = { addToCart, getCart, updateCartQuantity, removeProduct };



