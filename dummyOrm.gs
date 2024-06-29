function openSpreadSheet(){
  return SpreadsheetApp.openById('1OgisXD-tVJ7WInnts08o7m-al8XHAlV7KM0me7yq9jU');
}

function getModel(){
  const model = {
    'article': ['id', 'title', 'content', 'createdBy', 'updatedBy'],
    'user': ['id', 'email', 'name', 'createdAt'],
    'comment': ['id', 'userId', 'articleId', 'createdAt', 'updatedAt']
  };
  return model;
}

function selectData(sheetName, where={}){
  // get target data list
  const spreadSheet = openSpreadSheet();
  const sheet = spreadSheet.getSheetByName(sheetName);
  const range = sheet.getDataRange()
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

function testDataManage(){
  Logger.log(selectData('comment', {
    'id': 'a',
    'userId': 'c'
  }));
}