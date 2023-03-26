const products = [
  { name: "apple", price: 22 },
  { name: "orange", price: 23 },
];

const getAllProducts = () => products;

<<<<<<< HEAD
const getProduct = ({ name }) => products.find((p) => p.name === name) || { message: "Product not found" };
=======
const getProduct = ({ name }) => products.find((p) => p.name === name);
>>>>>>> 5f636922230ca29378c0001b0035768c0df2059c

module.exports = { getAllProducts, getProduct };
