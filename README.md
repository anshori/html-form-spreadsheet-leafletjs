# HTML Form - Spreadsheet - LeafletJS

HTML form untuk input data lokasi objek memanfaatkan Google Apps Script dan Spreadsheet sebagai back end. Visualisasi peta dan penentuan koordinat menggunakan LeafletJS.

___

**Front end** : Bootstrap, Fontawesome, LeafletJS   
**Back end** : Google Apps Script, Google Spreadsheet   

___

HTML form input:   
[https://anshori.github.io/html-form-spreadsheet-leafletjs/](https://anshori.github.io/html-form-spreadsheet-leafletjs/)   

Spreadsheet:   
[https://docs.google.com/spreadsheets/d/1L5h8g84pbLW-hK6EF_eTACK5oH-t-KuW002nPTWOakk/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1L5h8g84pbLW-hK6EF_eTACK5oH-t-KuW002nPTWOakk/edit?usp=sharing)   

GeoJSON Data API:    
[https://script.google.com/macros/s/AKfycbx4P_IkP_X3Ama9MxwIGfLWI0pmEjsWl6Pf3hH1v0ROHmZcXBGyryTLu1-mmFXXUfE/exec](https://script.google.com/macros/s/AKfycbx4P_IkP_X3Ama9MxwIGfLWI0pmEjsWl6Pf3hH1v0ROHmZcXBGyryTLu1-mmFXXUfE/exec)   

Peta Lokasi Objek:   
[https://anshori.github.io/html-form-spreadsheet-leafletjs/map/](https://anshori.github.io/html-form-spreadsheet-leafletjs/map/)   

**Apps Script**   
1. Create **toGeoJSON.gs**
2. Copy and paste this code
```
function doGet(e) {
  // Spreadsheet url
  var SpreadsheetID = "[CHANGE_THIS_WITH_YOUR_SPREADSHEET_URL]";
  // example https://docs.google.com/spreadsheets/d/1L5h8g84pbLW-hK6EF_eTACK5oH-t-KuW002nPTWOakk/edit#gid=0

  // change sheet name, example Sheet1
  var SheetName = "Sheet1";
  var ss = SpreadsheetApp.openByUrl(SpreadsheetID);
  var sheet = ss.getSheetByName(SheetName);
  return getSheet1(sheet);
}

function getSheet1(sheet) {
  var jo = {"type":"FeatureCollection", };
  var dataArray = [];
  var rows = sheet.getRange(1000, 1, sheet.getLastRow()-1, sheet.getLastColumn()).getDataRange().getValues();
  // var rows = sheet.getDataRange().getValues();
  for(var i = 0, l= rows.length; i<l ; i++){
    if (i >= 1) { //Tidak mengampilkan baris 0 yaitu judul kolom
      var dataRow = rows[i];
      var record = {};
      record['type'] = 'Feature';
      record['geometry'] = {'type': 'Point', 'coordinates': [dataRow[4], dataRow[3]]};
      record['properties'] ={'timestamp':dataRow[0], 'namaobjek':dataRow[1], 'deskripsi':dataRow[2]};
      dataArray.push(record);
    }
  }

  jo.features = dataArray;
  var result = JSON.stringify(jo);
  return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
}
```   

3. Create **Code.gs**
4. Copy and paste this code
```
var sheetName = 'Sheet1'
var scriptProp = PropertiesService.getScriptProperties()

function intialSetup () {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost (e) {
  var lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    var sheet = doc.getSheetByName(sheetName)

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    var nextRow = sheet.getLastRow() + 1

    var newRow = headers.map(function(header) {
      return header === 'timestamp' ? new Date() : e.parameter[header]
    })

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}
```

5. Run script

___

**Source :**   
1. [https://github.com/jamiewilson/form-to-google-sheets](https://github.com/jamiewilson/form-to-google-sheets)
2. [https://youtu.be/2XosKncBoQ4](https://youtu.be/2XosKncBoQ4)
3. [https://github.com/anshori/leaflet-search-coordinates](https://github.com/anshori/leaflet-search-coordinates)
___
> unsorry@2021