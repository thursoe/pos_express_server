const XLSX = require("xlsx");

const excelToJson = (fileBuffer, useHeaders = false) => {
  // Read the Excel file
  const workbook = XLSX.read(fileBuffer);

  // Assume the first sheet in the workbook
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert the sheet to JSON
  const aoaData = XLSX.utils.sheet_to_json(sheet, {
    header: useHeaders ? 1 : 0,
  });

  return aoaData;
};

const downloadExcel = async (jsonData, filename, response) => {
  const ws = XLSX.utils.json_to_sheet(jsonData);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

  // Set content type and disposition headers for the response
  response.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  response.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  // Send the Excel file as a response
  XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
  response.end(XLSX.write(wb, { bookType: "xlsx", type: "buffer" }), "binary");
};

module.exports = { excelToJson, downloadExcel };
