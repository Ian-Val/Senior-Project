function _formatDate (dateString) {
  const date = new Date(dateString)
  return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
}

function _addLine (body, options) {
  if (options.hasLines) {
    body.appendHorizontalRule();
  }
}

function _addGlyph (options) {
  if (options.bulletType === "o") {
    return DocumentApp.GlyphType.BULLET
  } else if (options.bulletType === "x") {
    return DocumentApp.GlyphType.HOLLOW_BULLET
  } 
  else {
    return null;
  }
}

class ResumeInfo {
  
  constructor(UID, ss, i) {
    
    //SET PERSONAL INFO
    const personalInfoSheet = ss.getSheetByName("Personal Info")
    let [personalInfoHeader, ...personalInfoData] = personalInfoSheet.getDataRange().getValues().filter((info) => {
      return info[0] === UID || info.indexOf("UID") !== -1
    })
    personalInfoData = personalInfoData[0]
    const emailData = personalInfoData[personalInfoHeader.indexOf("Email")].split('@')
    personalInfoData[personalInfoHeader.indexOf("Email")] = `${emailData[0]}${i}@${emailData[1]}`
    this.personalInfo = personalInfoHeader.reduce((obj, key, index) => {
      obj[key] = personalInfoData[index];
      return obj
    }, {});
    //SET EXPERIENCE
    const experienceSheet = ss.getSheetByName("Experience")
    const [experienceHeader, ...experienceData] = experienceSheet.getDataRange().getValues().filter((info) => {
      return info[0] === "UID" || parseInt(info[0]) === parseInt(UID)
    })
    this.experience = []
    experienceData.forEach((row, i) => {
      const obj = {
        uid: row[experienceHeader.indexOf("UID")],
        jobTitle: row[experienceHeader.indexOf("Job Title")],
        companyName: row[experienceHeader.indexOf("Company Name")],
        startDate: _formatDate(row[experienceHeader.indexOf("Start Date")]),
        endDate: _formatDate(row[experienceHeader.indexOf("End Date")]),
        location: row[experienceHeader.indexOf("Location")],
        bullets: [
          row[experienceHeader.indexOf("Bullet 1")],
          row[experienceHeader.indexOf("Bullet 2")],
          row[experienceHeader.indexOf("Bullet 3")]
        ]
      }
      this.experience.push(obj)
    })
    //SET EDUCATION
    const educationSheet = ss.getSheetByName("Education")
    const [educationHeader, ...educationData] = educationSheet.getDataRange().getValues().filter((info) => {
      return info[0] === "UID" || parseInt(info[0]) === parseInt(UID)
    })
    this.education = []
    educationData.forEach((row, i) => {
      const obj = {
        uid: row[educationHeader.indexOf("UID")],
        institutionName: row[educationHeader.indexOf("Institution Name")],
        location: row[educationHeader.indexOf("Location")],
        degreeType: row[educationHeader.indexOf("Degree Type")],
        major: row[educationHeader.indexOf("Major")],
        minors: row[educationHeader.indexOf("Minor(s)")],
        gpa: row[educationHeader.indexOf("GPA")],
        startDate: _formatDate(row[educationHeader.indexOf("Start Date")]),
        endDate: _formatDate(row[educationHeader.indexOf("End Date")]),
        bullets: [
          row[educationHeader.indexOf("Awards/Involvement 1")],
          row[educationHeader.indexOf("Awards/Involvement 2")],
          row[educationHeader.indexOf("Awards/Involvement 3")]
        ]
      }
      this.education.push(obj)
    })
    //SET SKILLS
    const skillsSheet = ss.getSheetByName("Skills")
    const [skillsHeader, ...skillsData] = skillsSheet.getDataRange().getValues().filter((info) => {
      return info[0] === "UID" || parseInt(info[0]) === parseInt(UID)
    })
    this.skills = []
    skillsData.forEach(skill => this.skills.push(skill[1]))
  }

  
  toDoc(docID, options) {
    const doc = DocumentApp.openById(docID)
    //SET UP DOCUMENT
    const body = doc.getBody()
    body.clear()
    const margin = parseInt(72 * options.marginSize)
    const header = doc.getHeader()
    const footer = doc.getFooter()
    header ? header.removeFromParent(): null
    footer ? footer.removeFromParent(): null
    body.setMarginTop(margin)
    body.setMarginBottom(margin)
    body.setMarginLeft(margin)
    body.setMarginRight(margin)
    const pg1 = body.getParagraphs()[0]
    pg1.setText(this.personalInfo.Name)
    pg1.setAlignment(DocumentApp.HorizontalAlignment.CENTER)
    pg1.setFontFamily(options.font)
    body.appendParagraph("")
    const pg2 = body.appendParagraph(
      Object.keys(this.personalInfo)
        .filter((key) => key !== "UID" && key !== "Name" && key !== "Objective")
        .map((key) => this.personalInfo[key]) // Map keys to their corresponding values
        .join(" | ") // Join the values with " | "
    );
    // return 
    pg2.setAlignment(DocumentApp.HorizontalAlignment.CENTER)
    pg2.setFontFamily(options.font)
    body.appendParagraph("")
    const pg3 = body.appendParagraph("Objective")
    _addLine(body, options)
    const pg4 = body.appendParagraph(this.personalInfo.Objective)
    body.appendParagraph("")
    const pg5 = body.appendParagraph("Experience")
    _addLine(body, options)
    this.experience.forEach((item, i) => {
      body.appendParagraph(`${item.jobTitle} | ${item.startDate} - ${item.endDate}`)
      body.appendParagraph(`${item.companyName}`)
      item.bullets.forEach(b => {
        if (_addGlyph(options)) {
          return body.appendListItem(`${b}`).setGlyphType(_addGlyph(options))
        }
          return body.appendParagraph(`\t${b}`)
        
      })
      body.appendParagraph("")
    })
    const pg6 = body.appendParagraph("Education")
    _addLine(body, options)
    this.education.forEach((item, i) => {
      body.appendParagraph(`${item.institutionName} | ${item.startDate} - ${item.endDate}`)
      body.appendParagraph(`${item.degreeType}, ${item.major}, GPA: ${item.gpa}`)
      item.bullets.forEach(b => {
        if (_addGlyph(options)) {
          return body.appendListItem(`${b}`).setGlyphType(_addGlyph(options))
        }
          return body.appendParagraph(`\t${b}`)
      })
      body.appendParagraph("")
    })
    const pg7 = body.appendParagraph("Skills")
    _addLine(body, options)
    body.appendParagraph(`${this.skills.reduce((a,b) => (a + ", " + b))}`)
    }
  //OVERRIDE 
  toString() {
    return JSON.stringify(this, null, 4)
  }
}