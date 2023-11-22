const users = [
  { name: "ali", age: "22" },
  { name: "adam", age: "23" },
];

const getAllUsers = () => users;
const addUser = ({ name, age }) => users.push({ name, age });

const getUser = ({ name }) => users.find((u) => u.name === name) || { message: "user not found" };

module.exports = { getUser, getAllUsers, addUser };
