"use strict";

const cart = require("../models/cart.model");

/*
  Feature :Cart Service
  1 add product to cart [User]
  2 reduce product quantity by one [User]
  3 increase product quantity by one [User]
  4 get cart [User]
  5 delete cart [User]
  6 delete cart item [User]
*/

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_user_id: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }
  static async addToCart({ userId, product = {} }) {
    //check cart exists
    const userCart = await cart.findOne({ cart_user_id: userId }).lean();
    if (!userCart) return await this.createUserCart({ userId, product });
    //if has cart but not product
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }
    
  }
}
