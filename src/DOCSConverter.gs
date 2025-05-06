function testDoc() {
  const sourceDocID = "1LjneNsIeY9mPqqxRWM8ZbjByJjaWPUrLSprys3XW-cw"
  const destFolderID = "11371PuGim6lEHq0hUW_qsLl68X1vSaXm"
  const filetype = 'docx'
  convertDoc(sourceDocID, destFolderID, filetype)
}


function convertDoc(docID, folderID,filetype) {
  if (filetype !== 'pdf' && filetype !== 'docx') {
    throw new Error(`Invalid filetype: ${filetype}`)
  }
  try {
    const doc = DocumentApp.openById(docID)
    const folder = DriveApp.getFolderById(folderID)
    const fileName = doc.getName() + `.${filetype}`

    const files = folder.getFilesByName(fileName);
    if (files.hasNext()) {
      Logger.log(`"${fileName}" already exists`);
    } else {
      const url = `https://docs.google.com/feeds/download/documents/export/Export?id=${docID}&exportFormat=${filetype}`;
      const response = UrlFetchApp.fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()
        }
      });
      const blob = response.getBlob().setName(fileName);
      folder.createFile(blob);
      Logger.log(`"${fileName}" created`)
    }
  } catch (e) {
    throw new Error(`convertDoc() internal error: ${e}`)
  }  
}
