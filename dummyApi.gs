function processForm(form) {
  switch(form.action){
    case 'newArticle':
      form.id = generateUUID();
      const newArticle = makeArticleFromForm(form);
      createDatum('article', newArticle);
      const redirectToNew = ScriptApp.getService().getUrl() + '?page=articleDetail&id=' + newArticle.id;
      return redirectToNew;
    case 'editArticle':
      const editedArticle = makeArticleFromForm(form);
      updateDatum('article', editedArticle, 'id');
      const redirectToEdited = ScriptApp.getService().getUrl() + '?page=articleDetail&id=' + editedArticle.id;
      return redirectToEdited;
    case 'postComment':
      const comment = makeCommentFromForm(form);
      createDatum('comment', comment);
      return loadComments(comment.articleId);
    case 'editUserName':
      updateUserName(form.userId, form.name);
      return loadMyPage(form.userId);
    case 'signIn':
    case 'signUp':
      return `Success! ${form.action}`;
  }

  return '500 Error! Something wrong';
}

function updateUserName(id, name){
  const users = findData('user', {id});
  if(users.length === 0){
    Logger.log(`Failed to find user`);
    return;
  }

  const user = users[0];
  user.name = name;

  updateDatum('user', user, 'id');
}

function makeArticleFromForm(form){
  Logger.log(form.id);
  const datum = {
    id: form.id,
    title: form.articleName,
    content: form.articleContent,
    createdBy: form.author,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  return datum;
}

function makeCommentFromForm(form){
  const user = findData('user', {id: form.userId})[0];

  const datum = {
    id: generateUUID(),
    userId: user.id,
    articleId: form.articleId,
    content: form.content,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return datum;
}

function deleteArticle(paramStr){
  const param = JSON.parse(paramStr);
  deleteDatum('article', {id: param.id});
  return include('deletedArticle', param);
}