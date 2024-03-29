const fs = require('fs').promises
const readline = require('readline')
const path = require('path')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const inputTemplate = 'dphshv_2023.xml'

const currentDate = new Date()
const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
const currentYear = currentDate.getFullYear()

const askUser = (question, defaultValue, formatter) => {
  return new Promise((resolve) => {
    rl.question(`${question} (default: ${defaultValue}): `, (answer) => {
      answer = answer || defaultValue
      resolve(formatter ? formatter(answer) : answer)
    })
  })
}

const formatTwoDigits = (value) => {
  return String(value).padStart(2, '0')
}

const main = async () => {
  const day = await askUser('Enter day', '01', formatTwoDigits)
  const month = await askUser('Enter month', currentMonth, formatTwoDigits)
  const year = await askUser('Enter year', currentYear)
  const czkAmount = await askUser('Enter CZK amount', '0')
  rl.close()

  const inputFileContent = await fs.readFile(inputTemplate, 'utf-8')
  const outputFileContent = inputFileContent
    .replace(/\$DD/g, day)
    .replace(/\$MM/g, month)
    .replace(/\$YYYY/g, year)
    .replace(/\$CZK_AMOUNT/g, czkAmount)

  const outputDir = path.join("..", "DPH", `${year} ${month}`);
  await fs.mkdir(outputDir, { recursive: true });

  const outputFileName = `dphshv_${year}_${month}.xml`
  const outputPath = path.join(outputDir, outputFileName)

  try {
    await fs.access(outputPath)
    const overwrite = await askUser(
      `File ${outputPath} already exists. Overwrite? (y/n)`,
      'n'
    )
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Exiting without overwriting the file.')
      process.exit(0)
    }
  } catch (error) {
    // File does not exist, continue with writing
  }

  await fs.writeFile(outputPath, outputFileContent)

  console.log(`File ${outputPath} has been created. Now log in at https://adisspr.mfcr.cz/pmd/dis/BUVLBU4CYQXL/podani and open the form from the generated xml.`)
}

main()
