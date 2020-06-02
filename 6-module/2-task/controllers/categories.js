const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categoriesFromDb = await Category.find();
  const categories = categoriesFromDb.map((category) => {
    return {
      id: category._id,
      title: category.title,
      subcategories: category.subcategories.map((subcat) => {
        return {
          id: subcat._id,
          title: subcat.title,
        };
      }),
    };
  });
  ctx.body = {categories};
};
