export const redirectsList = [
  // Structure for future 301 redirects
  // { from: '/old-path', to: '/new-path' }
  { from: '/old-about', to: '/sobre' },
  { from: '/contatos', to: '/contato' }
];

/**
 * Checks if a path matches any defined redirect rule.
 * @param {string} path The current path to check.
 * @returns {string|null} The destination path if a redirect is found, otherwise null.
 */
export const checkRedirects = (path) => {
  if (!path) return null;
  const cleanPath = path.toLowerCase().replace(/\/$/, ""); // standard lowercase, remove trailing slash
  const redirect = redirectsList.find(r => r.from.toLowerCase() === cleanPath);
  return redirect ? redirect.to : null;
};
