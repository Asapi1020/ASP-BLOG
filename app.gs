function doGet(e) {
  const userEmail = Session.getActiveUser().getEmail();
  const template = HtmlService.createTemplateFromFile('index');

  const param = e.parameter;
  param.page = getFileName(param.page, userEmail);
  template.param = param;

  const htmlOutput = template.evaluate();
  htmlOutput.setTitle('もちょもちょドキュメンツ');
  htmlOutput.setFaviconUrl('https://i.imgur.com/J56lAbf.png');
  return htmlOutput;
}

/**
 * @param {String} page - page parameter in URL
 * @return {String} - HTML file name to open
 */
function getFileName(page, userEmail){
  // top page
  if(page === undefined){
    return 'articleList';
  }

  const publicPageList = [
    'articleList',
    'articleDetail',
    'login'
  ];

  if(publicPageList.includes(page)){
    return page;
  }

  const privatePageList = [
    'editArticle'
  ];

  if(privatePageList.includes(page)){
    if(userEmail){
      return page;
    }
    return 'login';
  }

  return 'notFound';
}

// let one html load another
function include(fileName, param={}) {
  const template = HtmlService.createTemplateFromFile(fileName);
  template.param = param;
  return template.evaluate().getContent();
}