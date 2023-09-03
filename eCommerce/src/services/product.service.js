"use strict";

const { BadRequestError } = require("../core/error.response");
const { findByIdAndUpdate } = require("../models/keyToken.model");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  unPublishProductByShop,
  searchProductByUSer,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");

//define Factory Pattern class to create product
class ProductFactory {
  /*
  type: 'Clothing',
  */
  static productRegistry = {};
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product type ${type}`);
    return new productClass(payload).createProduct();
  }
  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product type ${type}`);
    return new productClass(payload).updateProduct(productId);
  }
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishedForShop({ query, limit, skip });
  }
  static async searchProducts({ keySearch }) {
    return await searchProductByUSer({ keySearch });
  }
  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
    select = ["product_name", "product_price", "product_thumb"],
  }) {
    return await findAllProducts({ limit, sort, page, filter, select });
  }
  static async findProduct({ productId }) {
    return await findProduct({ productId, unSelect: ["__v"] });
  }
}
/*
product_name: {
        type: String,
        required: true,
    },
    product_thumb:{
        type: String,
        required: true,
    },
    product_description: String,
    product_price:{
        type:Number,
        required: true,
    },
    product_quantity:{
        type: Number,
        required: true,
    },
    product_type:{
        type: String,
        required: true,
        enum:['Electronics','Clothing','Furniture']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    },
    product_attributes:{
        type: Schema.Types.Mixed,
        required: true,
    }
*/
//define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  async createProduct(productId) {
    const newProduct = await product.create({ ...this, _id: productId });
    if (newProduct) {
      //add product stock in inventories collection
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }
  //why???
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({
      productId,
      bodyUpdate,
      model: product,
    });
  }
}
//define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw BadRequestError("Create new Clothing error");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw BadRequestError("Create new Product error");
    /**
     * test
     */
    return newProduct;
  }
  async updateProduct(productId) {
    /*
     {
        a: undefined,
        b: null,
     }
     */
    /** 1. remove attr has null undefined
     * 2. check update where?
     *
     */
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      //update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams),
        model: clothing,
      });
    }
    const updatedProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updatedProduct;
  }
}
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw BadRequestError("Create new Clothing error");
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw BadRequestError("Create new Product error");
    return newProduct;
  }
}
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw BadRequestError("Create new Clothing error");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw BadRequestError("Create new Product error");
    return newProduct;
  }
}
//Register
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);
module.exports = ProductFactory;
