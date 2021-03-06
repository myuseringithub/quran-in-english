import { promises as filesystem, existsSync, mkdirSync } from 'fs'
import path from 'path'

// Bulk json madification
export async function modify({
  api, // @deployment/scriptManager instance, allowing access to project's configs.
  jsonPath, // relative path to json file.
  exportPath,
}) {
  const rootPath = api.project.configuration.rootPath

  if (!path.isAbsolute(jsonPath)) jsonPath = path.join(rootPath, jsonPath) // convert to absolute path
  exportPath ||= jsonPath // override json file.
  if (!path.isAbsolute(exportPath)) exportPath = path.join(rootPath, exportPath) // convert to absolute path
  if (!existsSync(exportPath)) mkdirSync(path.dirname(exportPath), { recursive: true }) // create base directory if it doesn't exist

  let jsonArray = require(jsonPath)
  // modify content
  let data = jsonArray.map(m2)
  // .sort((former, latter) => former.order - latter.order)

  await filesystem.writeFile(exportPath, data |> JSON.stringify, { encoding: 'utf8', flag: 'w' /*tructace file if exists and create a new one*/ })

  console.log(`• Created json file - ${exportPath}`)
}

function m1(item) {
  item.transliteration = ''
  // item.transliteration = item.nameTrans
  delete item.nameTrans
  item.name = ''
  // item.name = item.nameEnglish
  delete item.nameEnglish
  // item.name = item.nameArabic
  delete item.nameArabic
  return item
}

function m2(item) {
  item.chapterNumber = 0
  delete item.nameTrans
  delete item.nameEnglish
  delete item.nameArabic
  return item
}
