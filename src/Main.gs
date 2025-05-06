function generateDOCSandHTML() {
  const sourceFolder = DriveApp.getFolderById("1A9H5Sbd3q0Amf4NMHUl_0bCOb5we7Kho")
  const destFolderPdfID = "11371PuGim6lEHq0hUW_qsLl68X1vSaXm"
  const destFolderWordID = "1Iau5ff_JBINQzx8qbEjiC94YhabIU2uJ"
  const files = sourceFolder.getFiles()
  while (files.hasNext()) {
    const file = files.next()
    DOCSConverter.convertDoc(file.getId(), destFolderPdfID, 'pdf')
    DOCSConverter.convertDoc(file.getId(), destFolderWordID, 'docx')
  }
  deleteGoogleDocsInFolder(destFolderWordID)
}
function deleteGoogleDocsInFolder(destFolderWordID) {
  var folder = DriveApp.getFolderById(destFolderWordID  );
  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    if (file.getMimeType() === 'application/vnd.google-apps.document') {
      DriveApp.getFileById(file.getId()).setTrashed(true);
    }
  }
}

function generateResumes() {
  try {
    console.time("Execution Time");
    //OPTIONS
    const fonts = ["Times New Roman", "Calibri", "Arial", "Courier New"]
    const margins = [1.0, 0.5, 0.25]
    const hr = [true, false]
    const bullets = ['o', 'x', '']
    const fileFormats = [""]
    const uids = ["1001","1002","1003","1004"]
    const scriptProperties = PropertiesService.getScriptProperties();
    const sheetID = scriptProperties.getProperty('SheetID');
    const ss = SpreadsheetApp.openById(sheetID)
    const folder = DriveApp.getFolderById("1A9H5Sbd3q0Amf4NMHUl_0bCOb5we7Kho")
    let i = 1
    //MAIN LOOP
    fonts.forEach( (font) => {
      margins.forEach( (margin) => {
        hr.forEach( (hr) => {
          bullets.forEach( (bullet) => {
            fileFormats.forEach( (fileFormat) => {
              uids.forEach( (uid) => {
                const options = new Options(font, margin, hr, bullet, fileFormat)
                const name = String(options.generateName(uid))
                const resume = new ResumeInfo(uid, ss, i)
                if (folder.getFilesByName(name).hasNext()) {
                  // const fileId = folder.getFilesByName(name).next().getId()
                  // resume.toDoc(fileId, options)
                  Logger.log(`File: ${name} exists.`)
                } else {
                  const doc = DocumentApp.create(name)
                  const fileId = doc.getId()
                  resume.toDoc(fileId, options)
                  DriveApp.getFileById(fileId).moveTo(folder)
                  Logger.log(`File: ${name} was added.`)
                }
                Logger.log(parseInt(i))
                i++
              })
            })
          })
        })
      })
    })
    console.timeEnd("Execution Time");
  } catch (e) {
    Logger.log("TEST ERROR | testResume() | " + e.message)
  } finally {
    generateDOCSandHTML()
  }
}

