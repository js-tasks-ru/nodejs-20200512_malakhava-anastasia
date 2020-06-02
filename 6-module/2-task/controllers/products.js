const Product = require('../models/Product');

const mapProducts = (prod) => ({
  id: prod.id,
  category: prod.category,
  description: prod.description,
  images: prod.images,
  price: prod.price,
  subcategory: prod.subcategory,
  title: prod.title,
});

module.exports.productsBySubcategory = async function productsBySubcategory(
    ctx,
    next,
) {
  const {subcategory} = ctx.request.query || {};

  if (!subcategory) return next();

  const productsFromDb = await Product.find({
    subcategory: {_id: subcategory},
  });

  const products = productsFromDb.map(mapProducts);

  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  const productsFromDb = await Product.find();
  const products = productsFromDb.map(mapProducts);

  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const urlParams = ctx.request.url.split('/');
  const productId = urlParams[urlParams.length - 1];

  try {
    const productFromDb = await Product.findById(productId);
    if (!productFromDb) {
      ctx.status = 404;
      ctx.body = {};
      return;
    }
    ctx.body = {product: mapProducts(productFromDb)};
  } catch (err) {
    ctx.status = 400;
    ctx.body = err.message;
    return;
  }
};
