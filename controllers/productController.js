const { v4: uuidv4 } = require('uuid');
const { NotFoundError } = require('../utils/errors');

let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 1200,
    category: 'electronics',
    inStock: true
  }
];


exports.getAllProducts = (req, res) => {
  let result = [...products];
  if (req.query.category) {
    result = result.filter(p => p.category === req.query.category);
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || result.length;
  const start = (page - 1) * limit;
  result = result.slice(start, start + limit);
  res.json(result);
};

exports.getProductById = (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  res.json(product);
};

exports.createProduct = (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const product = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };
  products.push(product);
  res.status(201).json(product);
};

exports.updateProduct = (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));
  products[index] = { id: req.params.id, ...req.body };
  res.json(products[index]);
};

exports.deleteProduct = (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));
  const deleted = products.splice(index, 1);
  res.json(deleted[0]);
};

exports.searchProducts = (req, res) => {
  const { name } = req.query;
  const result = products.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
  res.json(result);
};

exports.getProductStats = (req, res) => {
  const stats = {};
  products.forEach(p => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });
  res.json(stats);
};
