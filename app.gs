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

function loadArticleList(){
  const articles = findData('article');
  let htmlOutput = '';

  for(let article of articles){
    htmlOutput += `
      <a href='${ScriptApp.getService().getUrl()}?page=articleDetail&id=${article.id}' class='card my-3 articleCard'>
        <div class='card-body'>
          <div class='d-flex justify-content-between'>
            <h5 class='card-title'>${article.title}</h5>
            <small class='card-text float-end'>${ formatTimeByMin(article.createdAt) }</small>
          </div>
          <p class='card-text lead'>${ article.content.slice(0,140) }</p>
        </div>
      </a>`;
  }
  return htmlOutput;
}