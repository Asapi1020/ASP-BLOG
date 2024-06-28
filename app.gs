function doGet(e) {
  const userEmail = Session.getActiveUser().getEmail();
  const template = HtmlService.createTemplateFromFile('index');

  const page = e.parameter.page;
  const fileName = getFileName(page, userEmail);
  template.page = fileName;

  const htmlOutput = template.evaluate();
  htmlOutput.setTitle('ASP BLOG');
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

  if(userEmail && privatePageList.includes(page)){
    return 'login';
  }

  return 'notFound';
}

// let one html load another
function include(fileName) {
  const template = HtmlService.createTemplateFromFile(fileName);
  return template.evaluate().getContent();
}