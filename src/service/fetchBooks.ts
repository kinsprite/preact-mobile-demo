const fetchBooks = async () => {
  const resp = await fetch('/api/books', { credentials: 'same-origin' });
  return resp.ok ? resp.json() : [];
};

export default fetchBooks;
