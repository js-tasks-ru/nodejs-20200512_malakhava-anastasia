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

module.exports.productsByQuery = async function productsByQuery(ctx) {
  const productsFromDb = await Product.find({
    $text: {
      $search: ctx.query.query,
    },
  });

  ctx.body = {
    products: productsFromDb.map(mapProducts),
  };
};
