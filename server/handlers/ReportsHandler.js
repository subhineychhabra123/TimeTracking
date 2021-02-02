const sql = require('mssql')
const utils = require('../utils/config')
const config = utils.config;

exports.getEmployeeReport = function getEmployeeReport(myobj, callback) {

    //Condition To not include Logoff Time Intervals In Between 
    if (myobj.IncludeLogofToIdle == undefined || myobj.IncludeLogofToIdle == false) {
        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request().query("exec spGetReportData  @EmpCode= '" + myobj.EmployeeId + "', @OrganizationID= '" + myobj.OrganizationID + "', @StartDate= '" + myobj.StartDate + "', @EndDate= '" + myobj.EndDate + "';")
        }).then(result => {
            sql.close()
            return callback(null, result.recordset);
        }).catch(err => {
            sql.close();
            return callback(null, err);
        });
    }
    //Condition To  include Logoff Time Intervals In Between 
    else if (myobj.IncludeLogofToIdle != undefined && myobj.IncludeLogofToIdle == true) {
        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request().query("exec spGetReportDataIncludeLogofToIdle  @EmpCode= '" + myobj.EmployeeId + "', @OrganizationID= '" + myobj.OrganizationID + "', @StartDate= '" + myobj.StartDate + "', @EndDate= '" + myobj.EndDate + "';")
        }).then(result => {
            sql.close()
            var timeInterval = 10;//min
            var maxTimeRange = 12;//min
            var stopCountingAfter =  180 //min
            var minTimeRange = 8;//min
            var records = result.recordset;
            var response = [];
            records.map(function (item) {
                var record = response.filter((i) => i.Name == item.Name && i.ScreenDate == item.ScreenDate).length > 0 ?
                    response.filter((i) => i.Name == item.Name && i.ScreenDate == item.ScreenDate)[0] : undefined;
                if (record) {
                    var TotalWorkTime = (item.DateOfScreenshot - record.LastScreenshotTime) / (1000 * 60);
                    if (TotalWorkTime > maxTimeRange && TotalWorkTime < stopCountingAfter) {
                        record.IdleTime += Math.floor(TotalWorkTime / 12) * 10;
                        record.TotalWorkTime += Math.floor(TotalWorkTime / 12) * 10;
                    }
                    if (TotalWorkTime > minTimeRange && TotalWorkTime < stopCountingAfter) {
                        if (item.KeyStrokes + item.Mousestrokes == 0) {
                            record.IdleTime += timeInterval;
                        }
                        else {
                            record.ActualWork += timeInterval;
                        }
                        record.TotalWorkTime += timeInterval;
                        record.LastScreenshotTime = item.DateOfScreenshot;
                    }
                    if(TotalWorkTime > stopCountingAfter){
                        if (item.KeyStrokes + item.Mousestrokes == 0) {
                            record.IdleTime += timeInterval;
                        }
                        else {
                            record.ActualWork += timeInterval;
                        }
                        record.TotalWorkTime += timeInterval;
                        record.LastScreenshotTime = item.DateOfScreenshot;
                    }
                } else if (item.KeyStrokes != null && item.Mousestrokes != null) {
                    response.push({
                        'Name': item.Name,
                        'Designation': item.Designation,
                        'EmpCode': item.EmpCode,
                        'IdleTime': item.KeyStrokes + item.Mousestrokes == 0 ? timeInterval : 0,
                        'ActualWork_Old': 0,
                        'TotalWorkTime_Old': 0,
                        'ActualWork': item.KeyStrokes + item.Mousestrokes == 0 ? 0 : timeInterval,
                        'TotalWorkTime': timeInterval,
                        'ScreenDate': item.ScreenDate,
                        'WeekStartDate': item.WeekStartDate,
                        'WeekEnd': item.WeekEnd,
                        'ID': item.ID,
                        'LastScreenshotTime': item.DateOfScreenshot
                    })
                }
                else if (item.KeyStrokes == null && item.Mousestrokes == null) {
                    response.push({
                        'Name': item.Name,
                        'Designation': item.Designation,
                        'EmpCode': item.EmpCode,
                        'IdleTime': 0,
                        'ActualWork_Old': 0,
                        'TotalWorkTime_Old': 0,
                        'ActualWork': 0,
                        'TotalWorkTime': 0,
                        'ScreenDate': item.ScreenDate,
                        'WeekStartDate': item.WeekStartDate,
                        'WeekEnd': item.WeekEnd,
                        'ID': item.ID,
                        'LastScreenshotTime': item.DateOfScreenshot
                    })
                }
            })
           //response.reverse();
            return callback(null, response.reverse());
        }).catch(err => {
            sql.close();
            return callback(null, err);
        });
    }

    // sql.connect(config, function (err) {
    //     if (err) console.log(err);
    //     // create Request object
    //     var request = new sql.Request();
    //     // query to the database and execute procedure 
    //     let query = "exec spGetReportData  @EmpCode= '"+myobj.EmployeeId+"', @OrganizationID= '"+myobj.OrganizationID+"', @StartDate= '"+myobj.StartDate+"', @EndDate= '"+myobj.EndDate+"';";
    //     request.query(query, function (err, result) {
    //         if (err) {
    //             console.log(err);
    //             sql.close();
    //         }
    //         sql.close();
    //         return callback(null, result.recordsets);
    //     });
    //   });

}