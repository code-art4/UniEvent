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

export const ampmDate = (timeString) => {  
// Parse the time string into a Date object
const time = new Date(`2023-09-06T${timeString}:00`);

// Convert to AM/PM format
const ampmTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

return ampmTime;

}