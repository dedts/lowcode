/* eslint-disable */

// JSONData[必填]：传入需要转换的数据（json或者object）
// FileName：导出Excel文件名
// title[数组]：可以自定义标题（与json标题名称顺序一致，若需要过滤不填则可）
// filter[数组]：过滤json中的相关行

export const currentDate = {
  date: null,
  getDate(flag) {
    const curDate = new Date()
    const year = curDate.getFullYear()
    let month = curDate.getMonth() + 1
    let day = curDate.getDate()
    month = month < 10 ? `0${month}` : month
    day = day < 10 ? `0${day}` : day
    if(flag) {
      return `${year}${month}${day}`
    }
    return `${year}-${month}-${day}`
  }
}

export function jsonToExcel(JSONData, FileName,title,filter) {
  if (!currentDate.date){
    currentDate.date = currentDate.getDate()
  }
  //转化json为object
  var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
  // console.log(JSON.stringify(arrData, undefined, 2))
  var excel = "<table>";

  //设置表头
  var row = "";
  if(title) {
    row += '<tr>'
    //使用标题项
    for (var i in title) {
      row += "<th align='center'>" + i + '</th>';
      row += "<th align='center'>" + title[i] + '</th>';
    }
    row += "</tr>";
  }
  row += "<tr>";
  for (var i in arrData[0]) {
    row += "<th align='center'>" + i + '</th>';
  }
  excel += row + "</tr>";

  //设置数据
  for (var i = 0; i < arrData.length; i++) {
    var row = "<tr>";

    for (var index in arrData[i]) {
      //判断是否有过滤行
      if(filter)
      {
        if(filter.indexOf(index)==-1)
        {
          var value = arrData[i][index] == null ? "" : arrData[i][index];
          row += '<td>' + value + '</td>';
        }
      }
      else
      {
        var value = arrData[i][index] == null ? "" : arrData[i][index];
        row += "<td align='center'>" + value + "</td>";
      }
    }

    excel += row + "</tr>";
  }

  excel += "</table>";

  var excelFile = '<html xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns="http://www.w3.org/TR/REC-html40">';
  excelFile += '<meta http-equiv="content-type" content="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8">';
  excelFile += '<meta http-equiv="content-type" content="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"';
  excelFile += '; charset=UTF-8">';
  excelFile += "<head>";
  excelFile += "<!--[if gte mso 9]>";
  excelFile += "<xml>";
  excelFile += "<x:ExcelWorkbook>";
  excelFile += "<x:ExcelWorksheets>";
  excelFile += "<x:ExcelWorksheet>";
  excelFile += "<x:Name>";
  excelFile += `${title}`;
  excelFile += "</x:Name>";
  excelFile += "<x:WorksheetOptions>";
  excelFile += "<x:DisplayGridlines/>";
  excelFile += "</x:WorksheetOptions>";
  excelFile += "</x:ExcelWorksheet>";
  excelFile += "</x:ExcelWorksheets>";
  excelFile += "</x:ExcelWorkbook>";
  excelFile += "</xml>";
  excelFile += "<![endif]-->";
  excelFile += "</head>";
  excelFile += "<body>";
  excelFile += excel;
  excelFile += "</body>";
  excelFile += "</html>";
  var uri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8,' + encodeURIComponent(excelFile);

  var link = document.createElement("a");
  link.href = uri;

  link.style = "visibility:hidden";
  link.download = FileName + '-'+ currentDate.date+ ".xls";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
