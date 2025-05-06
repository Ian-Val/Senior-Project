class Options {
  constructor(font, marginSize, hasLines, bulletType, fileFormat) {
    this.font = font
    this.marginSize = marginSize
    this.hasLines = hasLines
    this.bulletType = bulletType
    this.fileFormat = fileFormat
  }
  generateName(uid) {
    const fontAbrv = `${this.font.substring(0,5).toUpperCase()}`
    return ("U-"+uid + "-" + "F-"+fontAbrv + "-M-" + parseInt(this.marginSize*100) + "-B-"+ this.bulletType + `${this.hasLines ? "HR" : "NO-HR"}`)
  }
  toString() {
    return JSON.stringify(this, null, 4)
  }
}