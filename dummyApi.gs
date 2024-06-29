function processForm(form) {
  switch(form.action){
    case 'newArticle':
      const datum = makeDatumFromForm(form);
      createDatum('article', datum);
      break;
    case 'editArticle':
      break;
  }

  return 'Form submitted successfully!';
}

function makeDatumFromForm(form){
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