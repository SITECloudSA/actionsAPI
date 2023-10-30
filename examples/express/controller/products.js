const products = [
  { name: "apple", price: 22 },
  { name: "orange", price: 23 },
];

const getAllProducts = () => products;

const getProduct = ({ name }) => products.find((p) => p.name === name) || { message: "Product not found" };

module.exports = { getAllProducts, getProduct };
