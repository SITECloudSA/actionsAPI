const users = [
  { name: "ali", age: "22" },
  { name: "adam", age: "23" },
];

const sleep = (time = 1500) =>
  new Promise((res, rej) => {
    setTimeout(() => res(), time);
  });

const getAllUsers = async () => {
  await sleep();
  return users;
};
const addUser = ({ name, age }) => users.push({ name, age });

const getUser = ({ name }) => users.find((u) => u.name === name) || { message: "user not found" };

module.exports = { getUser, getAllUsers, addUser };
