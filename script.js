
export function myFunction(file,feedbackBox,csv_data) {
  console.log("Button Clicked");
  if (check_file(file.type,feedbackBox)) {
    console.log("test");

    var reader = new FileReader();

    reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);

      var workbook = XLSX.read(data, { type: 'array' });
      

      let excel_data = excel_to_aoa(workbook);

      const new_workbook = process_data(csv_data,excel_data,workbook);
      saveExcelFile(new_workbook);
    };

    reader.readAsArrayBuffer(file);
  } 
};

function process_data(csvData,excelData,workbook){
  console.log("process_data");
  excelData.splice(0, 5);

  for(let i=0; i<=excelData.length-2; i++){
    let x=excelData[i][5];
    if(x && csvData[x]){
        excelData[i][14] = csvData[x].toString();
    }
    //console.log(i+1,"   ",excelData[i][5],"   ",excelData[i][14]);
  }

  const new_workbook = aoa_to_excel(excelData,workbook);
  return new_workbook;
}

function aoa_to_excel(aoa,workbook){
  console.log("aoa_to_excel");
  //const sheetName = 'Oferte';
  const worksheet = workbook.Sheets[workbook.SheetNames[2]];
  const startRow = 6; 
  XLSX.utils.sheet_add_aoa(worksheet, aoa, { origin: { r: startRow - 1, c: 0 } });
  console.log("aoa_to_excel finished");
  return workbook;
}

function excel_to_aoa(workbook){
  console.log("excel_to_aoa");
  const worksheet = workbook.Sheets[workbook.SheetNames[2]];
  const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  return excelData;
}

function check_file(type,feedbackBox){
  console.log("check_file");
  if(type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
    feedbackBox.textContent = "Correct Format";
    return 1;
  }
  else{
    feedbackBox.textContent = "Wrong Format";
    return 0;
  }
}

function saveExcelFile(workbook) {
  console.log("saveExcelFile");
  var excelData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  var blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  var downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'new_file.xlsx';
  downloadLink.click();
}

export function csv_to_object(csvText, delimiter = ',') {
  console.log("csv_to_object");
  // Split the CSV text into an array of rows
  csvText = csvText.replace(/"| |\r/g, '');
  const rows = csvText.split('\n');
  
  const aoa = rows.map(row => row.split(delimiter));

  const csv_object = {};
  aoa.forEach(element => {
    csv_object[`$${element[0]}`] = element[1];
  });

  return csv_object;
}

