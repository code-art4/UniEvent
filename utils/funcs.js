export function reduceCharacters(string, maxLength = 50) {
  if (string?.length <= maxLength) {
    return string;
  }

  const reducedString = string?.slice(0, maxLength - 3) + '...';
  return reducedString;
}

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};