exports.paginate = (arr, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  return arr.slice(start, start + limit);
};