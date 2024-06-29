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

function ensureUserData(email){
  const userRow = findData('user', {email});
  const user = (userRow.length > 0)
    ? userRow[0]
    : {email};

  if(!user.id){
    user.id = generateUUID();
    updateDatum('user', user, 'id');
  }

  return user;
}

function registerAdminUser(email){
  const user = ensureUserData(email);
  const adminIds = getAdminIdList();
  adminIds.push(user.id);
  PropertiesService.getScriptProperties().setProperty('adminIdList', JSON.stringify(adminIds));
}

function getAdminIdList(){
  const adminIdList = PropertiesService.getScriptProperties().getProperty('adminIdList');
  if(adminIdList){
    return JSON.parse(adminIdList);
  }
  return [];
}

function testGeneratingUUID(){
  Logger.log(generateUUID());
}