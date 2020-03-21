
export default function urlencoded(fields) {
  if (!fields)
    return '';

  const result = [];
  Object.keys(fields).forEach(key => {
    const value = fields[key];
    if (typeof value === 'undefined' || (typeof value === 'object' && !value)) // undefined or null
      return;
    if (Array.isArray(value))
      return value.forEach(v => result.push(`${key}=${encodeURIComponent(v)}`));
    return result.push(`${key}=${encodeURIComponent(value)}`);
  });
  return result.join('&');
}
