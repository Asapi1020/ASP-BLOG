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

function updateDatum(sheetName, datum, key){
  const sheet = openSpreadSheet().getSheetByName(sheetName);
  const dataRange = sheet.getDataRange();
  const colLength = dataRange.getNumColumns();

  const keys = sheet.getRange(1, 1, 1, colLength).getValues()[0];
  const keyIndex = keys.indexOf(key);

  if(keyIndex === -1){
    Logger.log(`Failed to find key: ${key}`);
    return;
  }

  // Key is Found
  const rowLength = dataRange.getNumRows();
  const keyProperties = sheet.getRange(1, keyIndex+1, rowLength, 1).getValues(); // [ [id], [1], [2] ]
  Logger.log(keyProperties);
  Logger.log(datum[key]);

  let i = 0;
  for(i=1; i<keyProperties.length; i++){
    if(keyProperties[i].length > 0 && keyProperties[i][0] === datum[key]){
      break;
    }
  }

  if(i === keyProperties.length){
    createDatum(sheetName, datum);
    Logger.log(`Failed to find existing data. Created new one`);
    return;
  }

  // Data to update is found
  const colToInsert = dataRange.getColumn();
  const rowToInsert = i+1;

  const dataList = objectToList(datum, keys);

  sheet.getRange(rowToInsert, colToInsert, 1, colLength).setValues([dataList]);
  Logger.log(`Update existing data ${JSON.stringify(dataList)}`);
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

function deleteDatum(sheetName, where){
  // get target data list
  let sheet = openSpreadSheet().getSheetByName(sheetName);
  if(!sheet){
    Logger.log(`Sheet is not defined for: ${sheetName}`);
    return;
  }

  const dataListList = sheet.getDataRange().getValues();

  if(!dataListList){
    Logger.log('Fatal Error: No values found!');
    return;
  }

  // split keys and data
  const keys = dataListList[0]; // [id, title, content, ...]
  dataListList.splice(0, 1);    // [ [1, 'hello', 'yeah hello days', ...], [], [], [], ... [] ]

  // convert
  for(let i=0; i<dataListList.length; i++){
    const dataList = dataListList[i];
    const dataObject = {};

    for(let j=0; j<keys.length; j++){
      const key = keys[j];
      const datum = dataList[j];
      dataObject[key] = datum;
    }

    if(!objectMatchesCondition(dataObject, where)){
      continue;
    }else{
      try{
        sheet.deleteRow(i+2);
        Logger.log(`Deleted column: ${i+2}`);
      }catch(err){
        Logger.log(`Failed to delete: ${i+2}: ${err.message}`);
      }      
      return;
    }
  }
  Logger.log('Not found match');
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