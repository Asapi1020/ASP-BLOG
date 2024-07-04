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
    user.createdAt = new Date();
    updateDatum('user', user, 'id');
  }

  return user;
}

function registerAdminUser(userId){
  const adminIds = getAdminIdList();
  adminIds.push(userId);
  PropertiesService.getScriptProperties().setProperty('adminIdList', JSON.stringify(adminIds));
}

function getAdminIdList(){
  const adminIdList = PropertiesService.getScriptProperties().getProperty('adminIdList');
  if(adminIdList){
    return JSON.parse(adminIdList);
  }
  return [];
}

function sortObjectArray(array, property, bDescent){
  return array.sort((a, b) => {
    const diff = a[property] - b[property];
    
    if(bDescent){
      return diff*(-1);
    }
    return diff;
  })
}

function sanitizeInput(input) {
  // replace HTML entity from unique characters
  const entityMap = {
    '<': '&lt;',
    '>': '&gt;',
    '=': '&#61;',
  };
  
  return input.replace(/[<>=]/g, (match) => {
    return entityMap[match];
  });
}

function getUserId(){
  return PropertiesService.getUserProperties().getProperty('userId') || '';
}

function removeMarkdownSyntax(text){
  return text
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // 太字
    .replace(/(\*|_)(.*?)\1/g, '$2')   // 斜体
    .replace(/`([^`]+)`/g, '$1')       // コードブロック
    .replace(/^\s*#*\s*(.*?)$/gm, '$1')  // 見出し
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1')// 画像
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')// リンク
    .replace(/>\s?(.*)/g, '$1')        // 引用
    .replace(/^\s*\-\s+/gm, '')        // リスト
    .replace(/^\s*\d+\.\s+/gm, '')     // 番号付きリスト
    .replace(/^\s*---+/gm, '')         // 水平線
    .replace(/\n{2,}/g, '\n\n');       // 余分な改行を1つに
}

function testGeneratingUUID(){
  Logger.log(generateUUID());
}