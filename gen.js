const fs = require("fs").promises;
const readline = require("readline");
const path = require("path");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const inputTemplateFilename = "dphshv_2023.template.xml";
const inputTemplatePath = path.join(__dirname, inputTemplateFilename);

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;
const currentDay = currentDate.getDate();

const previousMonthDate = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() - 1,
  currentDate.getDate()
);
const previousDateMonth = String(previousMonthDate.getMonth() + 1).padStart(
  2,
  "0"
);
const previousDateYear = previousMonthDate.getFullYear();

const askUser = (question, defaultValue, formatter) => {
  return new Promise((resolve) => {
    rl.question(`${question} (default: ${defaultValue}): `, (answer) => {
      answer = answer || defaultValue;
      resolve(formatter ? formatter(answer) : answer);
    });
  });
};

function cleanNumericString(inputString) {
  return inputString.replace(/[^0-9.,]+/g, "");
}

function formatTwoDigits(value) {
  return String(value).padStart(2, "0");
}

const main = async () => {
  console.log(
    `Please enter the date of the reported month (usually last month).`
  );
  const day = await askUser("Enter day", "01", formatTwoDigits);
  const month = await askUser(
    "Enter month",
    previousDateMonth,
    formatTwoDigits
  );
  const year = await askUser("Enter year", previousDateYear);
  const czkAmountStr = await askUser("Enter CZK amount", "0");
  const czkAmount = cleanNumericString(czkAmountStr);
  rl.close();

  const inputFileContent = await fs.readFile(inputTemplatePath, "utf-8");
  const outputFileContent = inputFileContent
    .replace(/\$NOW_DD/g, formatTwoDigits(currentDay))
    .replace(/\$NOW_MM/g, formatTwoDigits(currentMonth))
    .replace(/\$NOW_YYYY/g, `${currentYear}`)
    .replace(/\$DD/g, day)
    .replace(/\$MM/g, month)
    .replace(/\$YYYY/g, year)
    .replace(/\$CZK_AMOUNT/g, czkAmount);

  const outputDir = path.join(__dirname, "..", "DPH", `${year} ${month}`);
  await fs.mkdir(outputDir, { recursive: true });

  const outputFileName = `dphshv_${year}_${month}.xml`;
  const outputPath = path.join(outputDir, outputFileName);

  try {
    await fs.access(outputPath);
    const overwrite = await askUser(
      `File ${outputPath} already exists. Overwrite? (y/n)`,
      "n"
    );
    if (overwrite.toLowerCase() !== "y") {
      console.log("Exiting without overwriting the file.");
      process.exit(0);
    }
  } catch (error) {
    // File does not exist, continue with writing
  }

  await fs.writeFile(outputPath, outputFileContent);

  console.log(
    `File ${outputPath} has been created for ${year}/${month} (with signature date ${currentYear}/${formatTwoDigits(
      currentMonth
    )}/${formatTwoDigits(
      currentDay
    )}). Now log in at https://adisspr.mfcr.cz/pmd/dis/BUVLBU4CYQXL/podani and open the form from the generated xml.`
  );
};

main();
