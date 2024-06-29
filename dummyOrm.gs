function openSpreadSheet(){
  return SpreadsheetApp.openById('1OgisXD-tVJ7WInnts08o7m-al8XHAlV7KM0me7yq9jU');
}

function findData(sheetName, where={}){
  // get target data list
  const range = openSpreadSheet().getSheetByName(sheetName).getDataRange();
  const dataListList = range.getValues();

  if(!dataListList){
    Logger.log('Fatal Error: No values found!');
    return [];
  }

  // split keys and data
  const keys = dataListList[0]; // [id, title, content, ...]
  dataListList.splice(0, 1);    // [ [1, 'hello', 'yeah hello days', ...], [], [], [], ... [] ]

  const dataObjectList = [];

  // convert
  for(dataList of dataListList){    
    const dataObject = {};

    for(let i=0; i<keys.length; i++){
      const key = keys[i];
      const datum = dataList[i];
      dataObject[key] = datum;
    }

    if(!objectMatchesCondition(dataObject, where)){
      continue;
    }

    dataObjectList.push(dataObject);
  }

  return dataObjectList;
}

function createDatum(sheetName, datum){
  const sheet = openSpreadSheet().getSheetByName(sheetName);
  const dataRange = sheet.getDataRange();
  const colLength = dataRange.getNumColumns();
  const colToInsert = dataRange.getColumn();
  const rowToInsert = dataRange.getLastRow() + 1;

  const keys = sheet.getRange(1, 1, 1, colLength).getValues()[0];
  const dataList = objectToList(datum, keys);
  
  sheet.getRange(rowToInsert, colToInsert, 1, colLength).setValues([dataList]);
  Logger.log(`Create new data ${JSON.stringify(dataList)}`);
}

function objectMatchesCondition(object, condition){
  const keys = Object.keys(condition);
  if(keys == null){
    return true; // no conditions
  }

  for(key of keys){
    if(object[key] != condition[key]){
      return false;
    }
  }

  return true;
}

/**
 * @param {Object} object - {id: 1020, name: 'moe'}
 * @param {[]} keys - [name, id]
 * @return {[]} - ['moe', 1020]
 */
function objectToList(object, keys){
  const outputList = [];

  for(key of keys){
    outputList.push(object[key]);
  }

  return outputList;
}

function testCreateData(){
  createDatum('comment',{
    id: 'test',
    userId: 'testUser',
    articleId: 'testArticle',
    createdAt: new Date(),
    updatedAt: new Date()
  });
}