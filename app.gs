function doGet(e) {
  const userEmail = Session.getActiveUser().getEmail();
  const template = HtmlService.createTemplateFromFile('index');

  const param = e.parameter;
  param.page = getFileName(param.page, userEmail);
  param.url = ScriptApp.getService().getUrl();
  param.email = Session.getActiveUser().getEmail();
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

function loadAnArticle(id){
  const article = findData('article', {id})[0];
  const htmlOutput = `
    <h1>${article.title}</h1>
    <p>${article.content}</p>`;

  return htmlOutput;
}

function loadCommentForm(param){
  let htmlOutput = (param.email)
    ? `
      <form id='postComment' onsubmit="handleFormSubmit(event, 'postComment', onPostComment, afterSubmission)">
        <input id='commentContent' class='form-control mb-3' type="text" name='content'/>
        <input name="email" type="hidden" value=${param.email}>
        <input name="articleId" type="hidden" value=${param.id}>
        <input name="action" type="hidden" value='postComment'>
        <button type='submit' class='btn btn-outline-secondary mb-3'>コメントを投稿する</button>
      </form>
      `
    : `<a href='${param.url}?page=login' class="btn btn-sm btn-warning mb-3">コメントを投稿するためにはログインが必要です。</a>`;

  return htmlOutput;
}

function loadComments(articleId){  
  const comments = findData('comment', {articleId});
  let htmlOutput = '';

  for(let comment of comments){
    const user = findData('user', {id: comment.userId})[0];
    htmlOutput += `
      <div>
        <div class='mb-1'>
          <i class='bi-person-fill-check me-1 avatar'></i>
          <small class='commentUser'>${user.name || 'Unnamed User'}</small>
        </div>
        <p>${comment.content}</p>
      </div>`;
  }

  return htmlOutput;
}

function renderNewArticleButton(param){
  if(!param.email){
    return '';
  }

  return include('newArticleButton', param);
}