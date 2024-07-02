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
  }

  return 'Form submitted successfully!';
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