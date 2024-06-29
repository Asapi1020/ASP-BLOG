/**
 * Function to generate a UUID
 * @return {String} UUID
 */
function generateUUID() {
  // Initialize variables for the UUID components
  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  
  // Generate the UUID
  const uuid = template.replace(/[xy]/g, function (c) {
    // Generate a random number
    const r = Math.random() * 16 | 0;
    
    // Set the value of v based on c
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    
    // Return the hexadecimal value
    return v.toString(16);
  });
  
  // Return the generated UUID
  return uuid;
}

// 2023-06-18T15:45:00 -> 2023/06/18 15:45
function formatTimeByMin(date){
  const formattedTime = date.toLocaleTimeString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  return formattedTime;
}

function testGeneratingUUID(){
  Logger.log(generateUUID());
}