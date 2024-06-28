function doGet(e) {
  const template = HtmlService.createTemplateFromFile('index');
  
  const page = e.parameter.page;
  const fileName = getFileName(page);
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
function getFileName(page){
  const presetPageList = [
    'articleDetail',
    'editArticle'
  ];

  if(page === undefined){
    return 'articleList';
  }

  if(presetPageList.includes(page)){
    return page;
  }
  return 'notFound';
}

// let one html load another
function include(fileName) {
  const template = HtmlService.createTemplateFromFile(fileName);
  return template.evaluate().getContent();
}