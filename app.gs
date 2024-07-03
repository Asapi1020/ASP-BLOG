function doGet(e) {
  const userEmail = Session.getActiveUser().getEmail();
  const template = HtmlService.createTemplateFromFile('index');

  const param = e.parameter;
  param.page = getFileName(param.page, userEmail);
  param.url = ScriptApp.getService().getUrl();
  param.userId = ensureUserData(userEmail).id;
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
    'editArticle',
    'mypage'
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

function loadArticleList(bDescent){
  const articles = findData('article');
  const sortedArticles = sortObjectArray(articles, 'updatedAt', bDescent);
  
  const users = findData('user');
  const findUserName = (id) => {
    for(let i=0; i<users.length; i++){
      if(users[i].id === id){
        return users[i].name;
      }
    }
  };

  let htmlOutput = '';

  for(let article of sortedArticles){
    const userName = findUserName(article.createdBy);

    htmlOutput += `
      <a href='${ScriptApp.getService().getUrl()}?page=articleDetail&id=${article.id}' class='card my-3 articleCard'>
        <div class='card-body'>
          <div class='d-flex justify-content-between'>
            <h5 class='card-title'>${article.title}</h5>
            <div>
              <div>
                <small class='card-text float-end'>${ formatTimeByMin(article.createdAt) }</small>
              </div>
              <div>
                <small class='card-text float-end'>${ userName }</small>
              </div>
            </div>
          </div>
          <p class='card-text lead'>${ article.content.slice(0,140) }</p>
        </div>
      </a>`;
  }
  return htmlOutput;
}

function reloadArticleList(bDescent){
  return {
    htmlOutput: loadArticleList(bDescent),
    bDescent
  };
}

function loadAnArticle(param){
  const article = findData('article', {id: param.id})[0];
  const authors = findData('user', {id: article.createdBy});
  let authorName = 'undefined';
  if(authors.length > 0){
    authorName = authors[0].name;
  }

  let htmlOutput = `
    <div class="d-flex">
      <div>
        <a href="${param.url}" class='btn btn-outline-secondary mb-5'>
          <i class='bi-arrow-left-circle-fill me-1'></i>
          一覧へ戻る
        </a>
      </div>`;

  if( (article.createdBy) === param.userId ){
    htmlOutput += include('articleConfig', param);
  }

  htmlOutput += `
    </div>`;
  
  htmlOutput += `
    <div>
      <div class="d-flex justify-content-between">
        <h1>${article.title}</h1>
        <p class="float-end">投稿者：${authorName || 'Unnamed User'}</p>
      </div>
      <div id="articleContent">${article.content}</div>
    </div>`;

  return htmlOutput;
}

function loadCommentForm(param){
  let htmlOutput = (param.userId)
    ? `
      <form id='postComment' onsubmit="handleFormSubmit(event, 'postComment', onPostComment, afterSubmission)">
        <input id='commentContent' class='form-control mb-3' type="text" name='content'/>
        <input name="userId" type="hidden" value=${param.userId}>
        <input name="articleId" type="hidden" value=${param.id}>
        <input name="action" type="hidden" value='postComment'>
        <div id="postButtonDiv">
          <button type='submit' class='btn btn-outline-secondary mb-3'>コメントを投稿する</button>
        </div>
      </form>
      `
    : `<a href='${param.url}?page=login' class="btn btn-sm btn-warning mb-3">コメントを投稿するためにはログインが必要です。</a>`;

  return htmlOutput;
}

function loadComments(articleId){  
  const comments = findData('comment', {articleId});
  const sortedComments = sortObjectArray(comments, 'updatedAt', true);

  const users = findData('user');
  const findUserName = (id) => {
    for(let user of users){
      if(user.id === id){
        return user.name;
      }
    }
  };

  let htmlOutput = '';

  for(let comment of sortedComments){
    const userName = findUserName(comment.userId) || 'Unnamed User';
    htmlOutput += `
      <div>
        <div class='mb-1'>
          <i class='bi-person-fill-check me-1 avatar'></i>
          <small class='commentUser'>${userName}</small>
        </div>
        <p>${comment.content}</p>
      </div>`;
  }

  return htmlOutput;
}

function loadMyPage(userId){
  const users = findData('user', {id: userId});

  if(users.length === 0){
    Logger.log(`Failed to load user: ${userId}`);
    return 'Error: 500 Failed to load user info!';
  }

  const user = users[0];
  let htmlOutput = `
    <div id="userNameDiv" class="mb-3 display-4">
      <b id="userName">${user.name || 'Unnamed User'}</b>
    </div>
    <div class="mb-3">
      <button id="editButton" class='btn btn-sm btn-secondary ms-1' onclick='editUserName("${userId}")'>名前を編集する</button>
      <small class="ms-1">ID: ${user.id}</small>
    </div>
    `;

  return htmlOutput;
}

function renderFormContent(param){
  let defaultTitle = '';
  let defaultContent = '';

  if(param.bNewArticle === '0'){
    const article = findData('article', {id: param.id})[0];
    defaultTitle = article.title;
    defaultContent = article.content;
  }  

  const htmlOutput = `
    <div>
      <h5>もちょもちょタイトル</h5>
      <input class='form-control mb-3' type="text" name="articleName" value="${defaultTitle}">
    </div>
    <div>
      <h5>内容</h5>
      <textarea id="articleContent" class='form-control mb-3' rows=16 name="articleContent">${defaultContent}</textarea>
    </div>
    <input name="id" type="hidden" value="${param.id}">`;
  return htmlOutput;
}

function renderNewArticleButton(param){
  if(!param.userId){
    return '';
  }

  return include('newArticleButton', param);
}