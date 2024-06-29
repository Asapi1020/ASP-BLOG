function processForm(form) {
  switch(form.action){
    case 'newArticle':
      const article = makeArticleFromForm(form);
      createDatum('article', article);
      break;
    case 'editArticle':
      break;
    case 'postComment':
      const comment = makeCommentFromForm(form);
      createDatum('comment', comment);
      return loadComments(comment.articleId);
  }

  return 'Form submitted successfully!';
}

function makeArticleFromForm(form){
  const datum = {
    id: generateUUID(),
    title: form.articleName,
    content: form.articleContent,
    createdBy: 'tmpSample',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  return datum;
}

function makeCommentFromForm(form){
  const user = ensureUserData(form.email);

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