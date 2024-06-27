function doGet(e) {
  const page = e.parameter.page;
  const fileName = getFileName(page);
  const htmlOutput = HtmlService.createHtmlOutputFromFile(fileName);
  htmlOutput.setTitle('ASP BLOG');
  htmlOutput.setFaviconUrl('https://i.imgur.com/J56lAbf.png');
  return htmlOutput;
}

/**
 * @param {String} page - page parameter in URL
 * @return {String} - HTML file name to open
 */
function getFileName(page){
  switch(page){
    default:
      return 'index';
  }
}