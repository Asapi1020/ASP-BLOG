function doGet(e) {
  const page = e.parameter.page;
  const fileName = getFileName(page);
  const template = HtmlService.createTemplateFromFile(fileName);
  template.page = page;

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