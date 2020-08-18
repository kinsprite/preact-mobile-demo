function getInitData(id) {
  return {
    // id,
    name: 'Hans',
    age: Math.round(Math.random() * 50),
  };
}

module.exports = {
  getInitData,
};
