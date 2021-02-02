const sql = require('mssql')
var soap = require('soap');
const utils = require('../utils/config')
const config = utils.config;
const serviceUrl = utils.url;
const masterData = require('../utils/masterData');

exports.validateUser = function validateUser(myobj, callback) {
    const OfficialEmailId = myobj.OfficialEmailId;
    const password = myobj.password;
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`SELECT a.EmployeeId, a.Name,a.EmpCode, a.JoiningDate,a.RelievingDate,a.BankAccountNumber,a.DateOfBirth,a.ContactNumber1,a.ContactNumber2,
        a.FatherName,a.CorrespondenceAddress,a.PermanentAddress,a.PersonalEmailId,a.OfficialEmailId,a.PanNumber,a.SkypeId,a.Status,a.Password,a.RoleId,a.CompanyId,a.IFSCCode,a.AdharCardNumber,a.OfficialEmailPassword,a.BloodGroup,a.OrganizationID
      FROM Employee a  inner join Organization c 
      on a.OrganizationID=c.Id where a.OfficialEmailId = '${OfficialEmailId}' AND a.password = '${password}' AND c.IsActive = 1`)
    }).then(result => {
        sql.close()
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close();
        return callback(null, err);
    });
    // sql.connect(config).then(() => {
    //     return sql.query`SELECT a.EmployeeId, a.Name,a.EmpCode, a.JoiningDate,a.RelievingDate,a.BankAccountNumber,a.DateOfBirth,a.ContactNumber1,a.ContactNumber2,
    //     a.FatherName,a.CorrespondenceAddress,a.PermanentAddress,a.PersonalEmailId,a.OfficialEmailId,a.PanNumber,a.SkypeId,a.Status,a.Password,a.RoleId,a.CompanyId,a.IFSCCode,a.AdharCardNumber,a.OfficialEmailPassword,a.BloodGroup,a.OrganizationID
    //   FROM Employee a  inner join Organization c 
    //   on a.OrganizationID=c.Id where a.OfficialEmailId = ${OfficialEmailId} AND a.password = ${password} AND c.IsActive = 1`
    // }).then(result => {
    //     sql.close()
    //     return callback(null, result.recordset);
    // }).catch(err => {
    //     sql.close()
    //     return callback(null, err);
    // })

}
exports.getEmployeesStatus = function getEmployeesStatus(myobj, callback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`select Status, count(*) as StatusCount
             from Employee where OrganizationID = ${myobj.OrganizationID}
             group by Status`)
    }).then(result => {
        sql.close()
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close();
        return callback(null, err);
    });
    // sql.connect(config).then(() => {
    //     return sql.query`select Status, count(*) as StatusCount
    //     from Employee where OrganizationID = ${myobj.OrganizationID}
    //     group by Status`
    // }).then(result => {
    //     sql.close()
    //     return callback(null, result.recordset);
    // }).catch(err => {
    //     sql.close()
    //     return callback(null, err);
    // })

}
exports.getEmployees = function getEmployees(myobj, callback) {
    var obj = {}
    var key = '';
    var defaultColumns = masterData.employeeDisplayColumnsDefault;
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`select em.EmployeeId,em.Name,em.EmpCode,em.DesignationId,em.DepartmentId ,em.JoiningDate,em.RelievingDate,
        em.BankAccountNumber, em.BankId, em.DateOfBirth, em.ContactNumber1, em.ContactNumber2,em.FatherName,em.CorrespondenceAddress,
        em.PermanentAddress,em.PersonalEmailId, em.PanNumber, em.OfficialEmailId, em.SkypeId, em.Id, em.Status, em.Password, 
        em.RoleId, em.CompanyId, em.IFSCCode,em.AdharCardNumber,em.OfficialEmailPassword,em.BloodGroup,em.OrganizationID
        ,s.Name as Shift,dp.Name As Department,
        CASE WHEN YEAR(em.JoiningDate) != YEAR(getdate()) AND  MONTH(em.JoiningDate) = MONTH(getdate()) THEN 1 ELSE 0 END  AS currentMonthAppraisal,
        de.Name As Designation from Employee em 
        left join Designation de on em.DesignationId = de.DesignationId 
        left join Department dp on em.DepartmentId = dp.DepartmentId 
        left join Shift s on em.ShiftId = s.ShiftId where em.OrganizationID = ${myobj.OrganizationID} ORDER BY em.EmployeeId DESC;`)
    }).then(result => {
        sql.close()
        key = 'employees';
        obj[key] = result.recordset;
        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request().query(`select * from DefaultColumns where orgId = ${myobj.OrganizationID}`)
        }).then(result => {
            sql.close()
            key = 'defaultColumns';
            var columns = []
            if (result.recordset.length > 0) {
                columns = defaultColumns.filter((col) => col.IsEditable == false);
                for (var i = 0, l = result.recordset.length; i < l; i++) {
                    columns.push(result.recordset[i]);
                }
            }
            else {
                columns = defaultColumns;
            }
            obj[key] = columns;
            return callback(null, obj);
        }).catch(err => {
            sql.close();
            return callback(null, err);
        });
    }).catch(err => {
        sql.close();
        return callback(null, err);
    });
    // sql.connect(config).then(() => {
    //     return sql.query`select em.EmployeeId,em.Name,em.EmpCode,em.DesignationId,em.DepartmentId ,em.JoiningDate,em.RelievingDate,em.BankAccountNumber,em.BankId,em.DateOfBirth,em.ContactNumber1
    //     ,em.ContactNumber2,em.FatherName,em.CorrespondenceAddress,em.PermanentAddress,em.PersonalEmailId
    //     ,em.PanNumber
    //     ,em.OfficialEmailId
    //     ,em.SkypeId
    //     ,em.Id
    //     ,em.Status
    //     ,em.Password
    //     ,em.RoleId
    //     ,em.CompanyId
    //     ,em.IFSCCode
    //     ,em.AdharCardNumber
    //     ,em.OfficialEmailPassword
    //     ,em.BloodGroup
    //     ,em.OrganizationID
    //     ,s.Name as Shift
    //     ,dp.Name As Department,
    //     CASE WHEN YEAR(em.JoiningDate) != YEAR(getdate()) AND  MONTH(em.JoiningDate) = MONTH(getdate()) THEN 1 ELSE 0 END  AS currentMonthAppraisal,
    //     de.Name As Designation from Employee em 
    //     left join Designation de on em.DesignationId = de.DesignationId 
    //     left join Department dp on em.DepartmentId = dp.DepartmentId 
    //     left join Shift s on em.ShiftId = s.ShiftId where em.OrganizationID = ${myobj.OrganizationID} ORDER BY em.EmployeeId DESC;`
    // }).then(result => {
    //     sql.close();
    //     key = 'employees';
    //     obj[key] = result.recordset;
    //     sql.connect(config).then(() => {
    //         return sql.query`select * from DefaultColumns where orgId = ${myobj.OrganizationID}`
    //     }).then(result => {
    //         sql.close();
    //         key = 'defaultColumns';
    //         var columns = []
    //         if (result.recordset.length > 0) {
    //             columns = defaultColumns.filter((col) => col.IsEditable == false);
    //             for (var i = 0, l = result.recordset.length; i < l; i++) {
    //                 columns.push(result.recordset[i]);
    //             }
    //         }
    //         else {
    //             columns = defaultColumns;
    //         }
    //         obj[key] = columns;
    //         return callback(null, obj);
    //     }).catch(err => {
    //         sql.close()
    //         return callback(null, err);
    //     })
    // }).catch(err => {
    //     sql.close()
    //     return callback(null, err);
    // })
}
exports.getEmployeeDetails = function getEmployeeDetails(myobj, callback) {
    const EmployeeId = myobj.EmployeeId;
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`SELECT a.EmployeeId, a.Name,a.EmpCode,a.BankId,c.DesignationId,d.DepartmentId, a.JoiningDate,
            a.RelievingDate,a.BankAccountNumber,b.Name As BankName,a.DateOfBirth,a.ContactNumber1,a.ContactNumber2,
            a.FatherName,a.CorrespondenceAddress,a.PermanentAddress,a.PersonalEmailId,a.Id,a.OfficialEmailId, a.PanNumber,a.SkypeId,
            a.Status,a.Password,a.RoleId,a.CompanyId,a.IFSCCode,a.AdharCardNumber,a.OfficialEmailPassword,a.BloodGroup, a.ShiftId
            FROM Employee a  
            inner join Designation c on a.DesignationId=c.DesignationId 
            inner join Department d on a.DepartmentId = d.DepartmentId       
            inner join Bank b on a.BankId = b.BankID where a.EmployeeId =  '${EmployeeId}'`)
    }).then(result => {
        sql.close()
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close();
        return callback(null, err);
    });
    // sql.connect(config).then(() => {
    //     return sql.query`SELECT a.EmployeeId, a.Name,a.EmpCode,a.BankId,c.DesignationId,d.DepartmentId, a.JoiningDate,
    //         a.RelievingDate,a.BankAccountNumber,b.Name As BankName,a.DateOfBirth,a.ContactNumber1,a.ContactNumber2,
    //         a.FatherName,a.CorrespondenceAddress,a.PermanentAddress,a.PersonalEmailId,a.Id,a.OfficialEmailId,
    //         a.PanNumber,a.SkypeId,a.Status,a.Password,a.RoleId,a.CompanyId,a.IFSCCode,a.AdharCardNumber,a.OfficialEmailPassword,a.BloodGroup, a.ShiftId
    //         FROM Employee a  
    //         inner join Designation c on a.DesignationId=c.DesignationId 
    //         inner join Department d on a.DepartmentId = d.DepartmentId       
    //         inner join Bank b on a.BankId = b.BankID where a.EmployeeId =  ${EmployeeId}`
    // }).then(result => {
    //     sql.close()
    //     return callback(null, result.recordset);
    // }).catch(err => {
    //     sql.close()
    //     return callback(null, err);
    // })

}

exports.getTimingData = function getTimingData(myobj, callback) {
    var dateFrom = myobj.DateForTimeSheet + ' ';
    var date = new Date(myobj.DateForTimeSheet);
    date.setDate(date.getDate() + 1);
    var dateTo = '' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ';

    var query = ''
    if (!myobj.IncludeLogofToIdle) {
        if (myobj.SelectedEmployeeId) {
            query = ` SELECT  e.Name,e.EmpCode,Max(d.Name) as Designation,COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 AS IdleTime, 
                    DATEDIFF(mi,MIN(DateOfScreenshot),CASE WHEN MIN(DateOfScreenshot) = MAX(DateOfScreenshot)  				
                    THEN dateAdd(mi,10,MIN(DateOfScreenshot)) else Max(DateOfScreenshot) END) AS TimeDiff_Old, DATEDIFF(mi,MIN(DateOfScreenshot),CASE WHEN MIN(DateOfScreenshot) = MAX(DateOfScreenshot) THEN dateAdd(mi,10,MIN(DateOfScreenshot)) else Max(DateOfScreenshot) END) - COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 As ActualWork_Old,
                    (Count(s.ID) * 10) - COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 As ActualWork,
                    (Count(s.ID) * 10) as TimeDiff
                    from Employee e inner join Designation d on e.DesignationId = d.DesignationId 
                    left join Organization org on org.ID=e.OrganizationID
                    left join shift sh on sh.shiftid =e.shiftid
                    left join ScreenShots s on e.EmpCode = s.EmpCode and  
                            ((org.Shifts = 0 and dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,org.TimeZone)),s.DateOfScreenshot)                         
                                 BETWEEN CONCAT('${dateFrom} ', '00:00:00')
                                AND Concat('${dateFrom} ', '23:59:59'))
                            or 
                                (org.Shifts = 1 and e.shiftid is null and dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,org.TimeZone)),s.DateOfScreenshot)                         
                                BETWEEN CONCAT('${dateFrom} ', '00:00:00')
                                 AND Concat('${dateFrom} ', '23:59:59'))
                            or(org.Shifts = 1 and e.shiftid is not null and dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,org.TimeZone)),s.DateOfScreenshot)                         
                                BETWEEN CONCAT('${dateFrom} ', case when datepart(HOUR,SWITCHOFFSET(sh.starttime, org.TimeZone)) is null then 0 else datepart(HOUR,SWITCHOFFSET(sh.starttime, org.TimeZone)) end  , ':', 
                                case when datepart(MINUTE,SWITCHOFFSET(sh.starttime, org.TimeZone)) is null then 0 else datepart(MINUTE,SWITCHOFFSET(sh.starttime, org.TimeZone)) end  , ':00')              
                                AND Concat('${dateTo} ', case when datepart(HOUR,SWITCHOFFSET(sh.endtime, org.TimeZone)) is null then 0 else datepart(HOUR,SWITCHOFFSET(sh.endtime, org.TimeZone)) end , ':', 
                                case when datepart(MINUTE,SWITCHOFFSET(sh.endtime, org.TimeZone)) is null then 0 else datepart(MINUTE,SWITCHOFFSET(sh.endtime, org.TimeZone)) end , ':59')))          
                    where  e.EmpCode =  '${myobj.SelectedEmployeeId}' AND e.Status = 1 AND e.OrganizationID =   ${myobj.OrganizationID}
                    GROUP BY e.EmpCode,e.Name`;
        } else {
            if (myobj.active) {
                query = ` SELECT  e.Name,e.EmpCode,Max(d.Name) as Designation,COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 AS IdleTime,                          
                    DATEDIFF(mi,MIN(DateOfScreenshot), CASE WHEN MIN(DateOfScreenshot) = MAX(DateOfScreenshot)  				                         
                    THEN dateAdd(mi,10,MIN(DateOfScreenshot)) 
                    else Max(DateOfScreenshot) END) AS TimeDiff_Old, DATEDIFF(mi,MIN(DateOfScreenshot),
                    CASE WHEN MIN(DateOfScreenshot) = MAX(DateOfScreenshot) THEN dateAdd(mi,10,MIN(DateOfScreenshot)) 
                    else Max(DateOfScreenshot) END) - COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 As ActualWork_Old,                         
                    (Count(s.ID) * 10) - COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 As ActualWork,                         
                    (Count(s.ID) * 10) as TimeDiff            
                    from Employee e inner join Designation d on e.DesignationId = d.DesignationId                          
                    left join Organization org on org.ID=e.OrganizationID                         
                    left join shift sh on sh.shiftid =e.shiftid
                    left join ScreenShots s on e.EmpCode = s.EmpCode and  
                            ((org.Shifts = 0 and dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,org.TimeZone)),s.DateOfScreenshot)                         
                                 BETWEEN CONCAT('${dateFrom} ', '00:00:00')
                                AND Concat('${dateFrom} ', '23:59:59'))
                            or 
                                (org.Shifts = 1 and e.shiftid is null and dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,org.TimeZone)),s.DateOfScreenshot)                         
                                BETWEEN CONCAT('${dateFrom} ' , '00:00:00')
                                 AND Concat('${dateFrom} ', '23:59:59'))
                            or(org.Shifts = 1 and e.shiftid is not null and dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,org.TimeZone)),s.DateOfScreenshot)                         
                                BETWEEN CONCAT('${dateFrom} ', case when datepart(HOUR,SWITCHOFFSET(sh.starttime, org.TimeZone)) is null then 0 else datepart(HOUR,SWITCHOFFSET(sh.starttime, org.TimeZone)) end  , ':', 
                                case when datepart(MINUTE,SWITCHOFFSET(sh.starttime, org.TimeZone)) is null then 0 else datepart(MINUTE,SWITCHOFFSET(sh.starttime, org.TimeZone)) end  , ':00')              
                                AND Concat('${dateTo} ', case when datepart(HOUR,SWITCHOFFSET(sh.endtime, org.TimeZone)) is null then 0 else datepart(HOUR,SWITCHOFFSET(sh.endtime, org.TimeZone)) end , ':', 
                                case when datepart(MINUTE,SWITCHOFFSET(sh.endtime, org.TimeZone)) is null then 0 else datepart(MINUTE,SWITCHOFFSET(sh.endtime, org.TimeZone)) end , ':59')))          
                    where  e.Status = 1 AND e.OrganizationID =${myobj.OrganizationID}                          
                    GROUP BY e.EmpCode,e.Name`
            } else {
                query = ` SELECT  e.Name,e.EmpCode,Max(d.Name) as Designation,COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 AS IdleTime,                          
                    DATEDIFF(mi,MIN(DateOfScreenshot), CASE WHEN MIN(DateOfScreenshot) = MAX(DateOfScreenshot)  				                         
                    THEN dateAdd(mi,10,MIN(DateOfScreenshot)) 
                    else Max(DateOfScreenshot) END) AS TimeDiff_Old, DATEDIFF(mi,MIN(DateOfScreenshot),
                    CASE WHEN MIN(DateOfScreenshot) = MAX(DateOfScreenshot) THEN dateAdd(mi,10,MIN(DateOfScreenshot)) 
                    else Max(DateOfScreenshot) END) - COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 As ActualWork_Old,                         
                    (Count(s.ID) * 10) - COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 As ActualWork,                         
                    (Count(s.ID) * 10) as TimeDiff            
                    from Employee e inner join Designation d on e.DesignationId = d.DesignationId                          
                    left join Organization org on org.ID=e.OrganizationID                         
                    left join shift sh on sh.shiftid =e.shiftid
                    left join ScreenShots s on e.EmpCode = s.EmpCode and  
                        ((org.Shifts = 0 and dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,org.TimeZone)),s.DateOfScreenshot)                         
                            BETWEEN CONCAT('${dateFrom} ', '00:00:00')
                            AND Concat('${dateFrom} ', '23:59:59'))
                            or 
                            (org.Shifts = 1 and e.shiftid is null and dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,org.TimeZone)),s.DateOfScreenshot)                         
                            BETWEEN CONCAT('${dateFrom} ', '00:00:00')
                            AND Concat('${dateFrom} ', '23:59:59'))
                        or(org.Shifts = 1 and e.shiftid is not null and dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,org.TimeZone)),s.DateOfScreenshot)                         
                        BETWEEN CONCAT('${dateFrom} ', case when datepart(HOUR,SWITCHOFFSET(sh.starttime, org.TimeZone)) is null then 0 else datepart(HOUR,SWITCHOFFSET(sh.starttime, org.TimeZone)) end  , ':', 
                        case when datepart(MINUTE,SWITCHOFFSET(sh.starttime, org.TimeZone)) is null then 0 else datepart(MINUTE,SWITCHOFFSET(sh.starttime, org.TimeZone)) end  , ':00')              
                        AND Concat('${dateTo} ', case when datepart(HOUR,SWITCHOFFSET(sh.endtime, org.TimeZone)) is null then 0 else datepart(HOUR,SWITCHOFFSET(sh.endtime, org.TimeZone)) end , ':', 
                        case when datepart(MINUTE,SWITCHOFFSET(sh.endtime, org.TimeZone)) is null then 0 else datepart(MINUTE,SWITCHOFFSET(sh.endtime, org.TimeZone)) end , ':59')))     
                    where  e.Status = 0 AND e.OrganizationID =${myobj.OrganizationID}                          
                    GROUP BY e.EmpCode,e.Name`;
            }
        }

        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request().query(query)
        }).then(result => {
            sql.close();
            return callback(null, result.recordset);
        }).catch(err => {
            sql.close();
            return callback(null, err);
        });
    }
    else {
        query = ` SELECT   e.Name,e.EmpCode,d.Name as Designation, s.KeyStrokes , s.Mousestrokes, s.DateOfScreenshot       
                    from Employee e 
                    inner join Designation d on e.DesignationId = d.DesignationId                          
                    left join Organization org on org.ID=e.OrganizationID                         
                    left join shift sh on sh.shiftid =e.shiftid
                    left join ScreenShots s on e.EmpCode = s.EmpCode and  
                    ((org.Shifts = 0 and dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,org.TimeZone)),s.DateOfScreenshot)                         
                        BETWEEN CONCAT('${dateFrom} ', '00:00:00')
                        AND Concat('${dateFrom} ', '23:59:59'))
                    or 
                    (org.Shifts = 1 and e.shiftid is null and dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,org.TimeZone)),s.DateOfScreenshot)                         
                        BETWEEN CONCAT('${dateFrom} ', '00:00:00')
                        AND Concat('${dateFrom} ', '23:59:59'))
                    or(org.Shifts = 1 and e.shiftid is not null and dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,org.TimeZone)),s.DateOfScreenshot)                         
                        BETWEEN CONCAT('${dateFrom} ', case when datepart(HOUR,SWITCHOFFSET(sh.starttime, org.TimeZone)) is null then 0 else datepart(HOUR,SWITCHOFFSET(sh.starttime, org.TimeZone)) end  , ':', 
                        case when datepart(MINUTE,SWITCHOFFSET(sh.starttime, org.TimeZone)) is null then 0 else datepart(MINUTE,SWITCHOFFSET(sh.starttime, org.TimeZone)) end  , ':00')              
                        AND Concat('${dateTo} ', case when datepart(HOUR,SWITCHOFFSET(sh.endtime, org.TimeZone)) is null then 0 else datepart(HOUR,SWITCHOFFSET(sh.endtime, org.TimeZone)) end , ':', 
                        case when datepart(MINUTE,SWITCHOFFSET(sh.endtime, org.TimeZone)) is null then 0 else datepart(MINUTE,SWITCHOFFSET(sh.endtime, org.TimeZone)) end , ':59')))     
                    where  e.OrganizationID =${myobj.OrganizationID} `;

        if (myobj.SelectedEmployeeId) {
            query += ` and e.EmpCode =  '${myobj.SelectedEmployeeId}' `;
        } else {
            if (myobj.active) {
                query += ` and e.Status = 1 `
            } else {
                query += ` and e.Status = 0 `;
            }
        }
        query += ` order by e.name, s.dateofscreenshot `;


        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request().query(query)
        }).then(result => {
            sql.close();
            var timeInterval = 10; //min
            var maxTimeRange = 12; //min 
            var stopCountingAfter =  180 //min
            var minTimeRange = 8; //min
            var records = result.recordset;

            var response = [];
            records.map(function (item) {
                var record = response.filter((i) => i.Name == item.Name).length > 0 ? response.filter((i) => i.Name == item.Name)[0] : undefined;
                if (record) {
                    var timeDiff = (item.DateOfScreenshot - record.LastScreenshotTime) / (1000 * 60);
                    if (timeDiff > maxTimeRange && timeDiff < stopCountingAfter) {
                        record.IdleTime += Math.floor(timeDiff / 12) * 10;
                        record.TimeDiff += Math.floor(timeDiff / 12) * 10;
                    }
                    if (timeDiff > minTimeRange && timeDiff < stopCountingAfter) {
                        if (item.KeyStrokes + item.Mousestrokes == 0) {
                            record.IdleTime += timeInterval;
                        }
                        else {
                            record.ActualWork += timeInterval;
                        }
                        record.TimeDiff += timeInterval;
                        record.LastScreenshotTime = item.DateOfScreenshot;
                    }
                    if(timeDiff > stopCountingAfter){
                        if (item.KeyStrokes + item.Mousestrokes == 0) {
                            record.IdleTime += timeInterval;
                        }
                        else {
                            record.ActualWork += timeInterval;
                        }
                        record.TimeDiff += timeInterval;
                        record.LastScreenshotTime = item.DateOfScreenshot;
                    }
                } else if (item.KeyStrokes != null && item.Mousestrokes != null) {
                    response.push({
                        'Name': item.Name,
                        'Designation': item.Designation,
                        'EmpCode': item.EmpCode,
                        'IdleTime': item.KeyStrokes + item.Mousestrokes == 0 ? timeInterval : 0,
                        'ActualWork_Old': 0,
                        'TimeDiff_Old': 0,
                        'ActualWork': item.KeyStrokes + item.Mousestrokes == 0 ? 0 : timeInterval,
                        'TimeDiff': timeInterval,
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
                        'TimeDiff_Old': 0,
                        'ActualWork': 0,
                        'TimeDiff': 0,
                        'LastScreenshotTime': item.DateOfScreenshot
                    })
                }
            })
            return callback(null, response);
        }).catch(err => {
            sql.close();
            return callback(null, err);
        });
    }
}

exports.getAllListData = function getAllListData(myobj, callback) {
    var obj = {}
    var key = '';
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`select Max(EmployeeId) AS EmployeeId,(select Max(Id) from Employee where 
        OrganizationID=${myobj.OrganizationID}) AS Id from Employee;`)
    }).then(result => {
        sql.close()
        key = 'LastEmployeeId'
        obj[key] = result.recordset
        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request().query(`select * from Designation where OrganizationID = ${myobj.OrganizationID}`)
        }).then(result => {
            sql.close()
            key = 'Designation'
            obj[key] = result.recordset
            new sql.ConnectionPool(config).connect().then(pool => {
                return pool.request().query(`select * from Department where OrganizationID = ${myobj.OrganizationID}`)
            }).then(result => {
                sql.close()
                key = 'Department'
                obj[key] = result.recordset
                new sql.ConnectionPool(config).connect().then(pool => {
                    return pool.request().query(`select * from Bank where OrganizationID = ${myobj.OrganizationID}`)
                }).then(result => {
                    sql.close()
                    key = 'Bank'
                    obj[key] = result.recordset
                    new sql.ConnectionPool(config).connect().then(pool => {
                        return pool.request().query(`select * from Organization where ID = ${myobj.OrganizationID}`)
                    }).then(result => {
                        sql.close()
                        key = 'Organization'
                        obj[key] = result.recordset
                        new sql.ConnectionPool(config).connect().then(pool => {
                            return pool.request().query(`select * from EmployeeRoles`)
                        }).then(result => {
                            sql.close()
                            key = 'EmployeeRoles'
                            obj[key] = result.recordset
                            new sql.ConnectionPool(config).connect().then(pool => {
                                return pool.request().query(`select * from Shift where OrganizationID = ${myobj.OrganizationID}`)
                            }).then(result => {
                                sql.close()
                                key = 'Shift'
                                obj[key] = result.recordset
                                return callback(null, obj);
                            }).catch(err => {
                                sql.close();
                                return callback(null, err);
                            });
                        }).catch(err => {
                            sql.close();
                            return callback(null, err);
                        });
                    }).catch(err => {
                        sql.close();
                        return callback(null, err);
                    });
                }).catch(err => {
                    sql.close();
                    return callback(null, err);
                });
            }).catch(err => {
                sql.close();
                return callback(null, err);
            });
        }).catch(err => {
            sql.close();
            return callback(null, err);
        });
    }).catch(err => {
        sql.close();
        return callback(null, err);
    });


    // sql.connect(config).then(() => {
    //     return sql.query`select Max(EmployeeId) AS EmployeeId,(select Max(Id) from Employee where OrganizationID=${myobj.OrganizationID}) AS Id from Employee;`
    // }).then(result => {
    //     sql.close()
    //     key = 'LastEmployeeId'
    //     obj[key] = result.recordset
    //     sql.connect(config).then(() => {
    //         return sql.query`select * from Designation where OrganizationID = ${myobj.OrganizationID}`
    //     }).then(result => {
    //         key = 'Designation'
    //         sql.close()
    //         obj[key] = result.recordset
    //         sql.connect(config).then(() => {
    //             return sql.query`select * from Department where OrganizationID = ${myobj.OrganizationID}`
    //         }).then(result => {
    //             sql.close()
    //             key = 'Department'
    //             obj[key] = result.recordset
    //             sql.connect(config).then(() => {
    //                 return sql.query`select * from Bank where OrganizationID = ${myobj.OrganizationID}`
    //             }).then(result => {
    //                 sql.close()
    //                 key = 'Bank'
    //                 obj[key] = result.recordset
    //                 sql.connect(config).then(() => {
    //                     return sql.query`select * from Organization where ID = ${myobj.OrganizationID}`
    //                 }).then(result => {
    //                     sql.close()
    //                     key = 'Organization'
    //                     obj[key] = result.recordset
    //                     sql.connect(config).then(() => {
    //                         return sql.query`select * from EmployeeRoles`
    //                     }).then(result => {
    //                         sql.close()
    //                         key = 'EmployeeRoles'
    //                         obj[key] = result.recordset
    //                         //return callback(null, obj);
    //                         sql.connect(config).then(() => {
    //                             return sql.query`select * from Shift where OrganizationID = ${myobj.OrganizationID}`
    //                         }).then(result => {
    //                             sql.close()
    //                             key = 'Shift'
    //                             obj[key] = result.recordset
    //                             return callback(null, obj);
    //                         }).catch(err => {
    //                             sql.close()
    //                             return callback(null, obj);
    //                         })
    //                     }).catch(err => {
    //                         sql.close()
    //                         return callback(null, obj);
    //                     })
    //                 }).catch(err => {
    //                     sql.close()
    //                     return callback(null, obj);
    //                 })
    //             }).catch(err => {
    //                 sql.close()
    //                 return callback(null, obj);
    //             })
    //         }).catch(err => {
    //             sql.close()
    //             return callback(null, obj);
    //         })
    //     }).catch(err => {
    //         sql.close()
    //         return callback(null, err);
    //     })
    // }).catch(err => {
    //     sql.close()
    //     return callback(null, obj);
    // })


}
exports.checkEmailExist = function checkEmailExist(myobj, callback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`select EmployeeId from employee where OfficialEmailId = '${myobj.OfficialEmailId}'`)
    }).then(result => {
        sql.close()
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close();
        return callback(null, err);
    });
    // sql.connect(config).then(() => {
    //     return sql.query` select EmployeeId from employee where OfficialEmailId = ${myobj.OfficialEmailId}`
    // }).then(result => {
    //     sql.close()
    //     return callback(null, result.recordset);
    // }).catch(err => {
    //     sql.close()
    //     return callback(null, err);
    // })
}
exports.addEmployee = function addEmployee(myobj, callback) {
    if (myobj.action == "add") {

        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request().query(`INSERT INTO [Employee] ([EmployeeId]
                ,[Id]
                ,[Name]
                ,[EmpCode]
                ,[DesignationId]
                ,[DepartmentId]
                ,[JoiningDate]
                ,[BankAccountNumber]
                ,[BankId]
                ,[DateOfBirth]
                ,[ContactNumber1]
                ,[ContactNumber2]
                ,[FatherName]
                ,[CorrespondenceAddress]
                ,[PermanentAddress]
                ,[PersonalEmailId]
                ,[PanNumber]
                ,[OfficialEmailId]
                ,[SkypeId]
                ,[Status]
                ,[Password]
                ,[RoleId]
                ,[CompanyId]
                ,[IFSCCode]
                ,[AdharCardNumber]
                ,[OfficialEmailPassword]
                ,[BloodGroup]
                ,[OrganizationID]
                ,[ShiftId])  
            VALUES ('${myobj.EmployeeIdForSave}',
                '${myobj.EmployeeId}',
                '${myobj.Name}',
                '${myobj.EmpCode}',
                ${myobj.DesignationId},
                ${myobj.DepartmentId},
                '${myobj.JoiningDate}',
                '${myobj.BankAccountNumber}',
                ${myobj.BankId},
                '${myobj.DateOfBirth}',
                '${myobj.ContactNumber1}',
                '${myobj.ContactNumber2}',
                '${myobj.FatherName}',
                '${myobj.CorrespondenceAddress}',
                '${myobj.PermanentAddress}',
                '${myobj.PersonalEmailId}',
                '${myobj.PanNumber}',
                '${myobj.OfficialEmailId}',
                '${myobj.SkypeId}',
                ${myobj.Status},
                '${myobj.Password}',
                ${myobj.RoleId},
                ${myobj.CompanyId},
                '${myobj.IFSCCode}',
                '${myobj.AdharCardNumber}',
                '${myobj.OfficialEmailPassword}',
                '${myobj.BloodGroup}',
                ${myobj.OrganizationID},
                ${myobj.ShiftId});`)
        }).then(result => {
            sql.close()
            return callback(null, result);
        }).catch(err => {
            sql.close();
            return callback(null, err);
        });
        // sql.connect(config).then(() => {
        //     return sql.query`INSERT INTO [Employee] ([EmployeeId]
        //         ,[Id]
        //         ,[Name]
        //         ,[EmpCode]
        //         ,[DesignationId]
        //         ,[DepartmentId]
        //         ,[JoiningDate]
        //         ,[BankAccountNumber]
        //         ,[BankId]
        //         ,[DateOfBirth]
        //         ,[ContactNumber1]
        //         ,[ContactNumber2]
        //         ,[FatherName]
        //         ,[CorrespondenceAddress]
        //         ,[PermanentAddress]
        //         ,[PersonalEmailId]
        //         ,[PanNumber]
        //         ,[OfficialEmailId]
        //         ,[SkypeId]
        //         ,[Status]
        //         ,[Password]
        //         ,[RoleId]
        //         ,[CompanyId]
        //         ,[IFSCCode]
        //         ,[AdharCardNumber]
        //         ,[OfficialEmailPassword]
        //         ,[BloodGroup]
        //         ,[OrganizationID]
        //         ,[ShiftId])  
        //     VALUES (${myobj.EmployeeIdForSave},
        //         ${myobj.EmployeeId},
        //         ${myobj.Name},
        //         ${myobj.EmpCode},
        //         ${myobj.DesignationId},
        //         ${myobj.DepartmentId},
        //         ${myobj.JoiningDate},
        //         ${myobj.BankAccountNumber},
        //         ${myobj.BankId},
        //         ${myobj.DateOfBirth},
        //         ${myobj.ContactNumber1},
        //         ${myobj.ContactNumber2},
        //         ${myobj.FatherName},
        //         ${myobj.CorrespondenceAddress},
        //         ${myobj.PermanentAddress},
        //         ${myobj.PersonalEmailId},
        //         ${myobj.PanNumber},
        //         ${myobj.OfficialEmailId},
        //         ${myobj.SkypeId},
        //         ${myobj.Status},
        //         ${myobj.Password},
        //         ${myobj.RoleId},
        //         ${myobj.CompanyId},
        //         ${myobj.IFSCCode},
        //         ${myobj.AdharCardNumber},
        //         ${myobj.OfficialEmailPassword},
        //         ${myobj.BloodGroup},
        //         ${myobj.OrganizationID},
        //         ${myobj.ShiftId});`
        // }).then(result => {
        //     sql.close()
        //     return callback(null, result);
        // }).catch(err => {
        //     sql.close()
        //     return callback(null, err);
        // })
    } else {
        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request().query(`UPDATE [Employee] SET
            [Name] =  '${myobj.Name}'
                ,[EmpCode] =  '${myobj.EmpCode}'
                ,[DesignationId] =  ${myobj.DesignationId}
                ,[DepartmentId] =  ${myobj.DepartmentId}
                ,[JoiningDate] =  '${myobj.JoiningDate}'
                ,[BankAccountNumber] =  '${myobj.BankAccountNumber}'
                ,[BankId] =  ${myobj.BankId}
                ,[DateOfBirth] =  '${myobj.DateOfBirth}'
                ,[ContactNumber1] =  '${myobj.ContactNumber1}'
                ,[ContactNumber2] =  '${myobj.ContactNumber2}'
                ,[FatherName] =  '${myobj.FatherName}'
                ,[CorrespondenceAddress] =  '${myobj.CorrespondenceAddress}'
                ,[PermanentAddress] =  '${myobj.PermanentAddress}'
                ,[PersonalEmailId] =  '${myobj.PersonalEmailId}'
                ,[PanNumber] =  '${myobj.PanNumber}'
                ,[OfficialEmailId] =  '${myobj.OfficialEmailId}'
                ,[SkypeId] =  '${myobj.SkypeId}'
                ,[Status] =  ${myobj.Status}
                ,[Password] =  '${myobj.Password}'
                ,[RoleId] =  ${myobj.RoleId}
                ,[CompanyId] =  ${myobj.CompanyId}
                ,[IFSCCode] =  '${myobj.IFSCCode}'
                ,[AdharCardNumber] =  '${myobj.AdharCardNumber}'
                ,[OfficialEmailPassword] =  '${myobj.OfficialEmailPassword}'
                ,[BloodGroup] =  '${myobj.BloodGroup}'
                ,[ShiftId] =  ${myobj.ShiftId}
            WHERE EmployeeId = '${myobj.EmployeeIdForSave}'`)
        }).then(result => {
            sql.close()
            return callback(null, result);
        }).catch(err => {
            sql.close();
            return callback(null, err);
        });
        // sql.connect(config).then(() => {
        //     return sql.query`UPDATE [Employee] SET
        //     [Name] =  ${myobj.Name}
        //     ,[EmpCode] =  ${myobj.EmpCode}
        //         ,[DesignationId] =  ${myobj.DesignationId}
        //         ,[DepartmentId] =  ${myobj.DepartmentId}
        //         ,[JoiningDate] =  ${myobj.JoiningDate}
        //         ,[BankAccountNumber] =  ${myobj.BankAccountNumber}
        //         ,[BankId] =  ${myobj.BankId}
        //         ,[DateOfBirth] =  ${myobj.DateOfBirth}
        //         ,[ContactNumber1] =  ${myobj.ContactNumber1}
        //         ,[ContactNumber2] =  ${myobj.ContactNumber2}
        //         ,[FatherName] =  ${myobj.FatherName}
        //         ,[CorrespondenceAddress] =  ${myobj.CorrespondenceAddress}
        //         ,[PermanentAddress] =  ${myobj.PermanentAddress}
        //         ,[PersonalEmailId] =  ${myobj.PersonalEmailId}
        //         ,[PanNumber] =  ${myobj.PanNumber}
        //         ,[OfficialEmailId] =  ${myobj.OfficialEmailId}
        //         ,[SkypeId] =  ${myobj.SkypeId}
        //         ,[Status] =  ${myobj.Status}
        //         ,[Password] =  ${myobj.Password}
        //         ,[RoleId] =  ${myobj.RoleId}
        //         ,[CompanyId] =  ${myobj.CompanyId}
        //         ,[IFSCCode] =  ${myobj.IFSCCode}
        //         ,[AdharCardNumber] =  ${myobj.AdharCardNumber}
        //         ,[OfficialEmailPassword] =  ${myobj.OfficialEmailPassword}
        //         ,[BloodGroup] =  ${myobj.BloodGroup}
        //         ,[ShiftId] =  ${myobj.ShiftId}
        //     WHERE EmployeeId = ${myobj.EmployeeIdForSave}`
        // }).then(result => {
        //     sql.close()
        //     return callback(null, result);
        // }).catch(err => {
        //     sql.close()
        //     return callback(null, err);
        // })
    }

}
exports.deleteEmployee = function deleteEmployee(myobj, callback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`delete from Employee where EmployeeId = '${myobj.EmployeeId}' AND OrganizationID = ${myobj.OrganizationID}`)
    }).then(result => {
        sql.close()
        return callback(null, result);
    }).catch(err => {
        sql.close();
        return callback(null, err);
    });
    // sql.connect(config).then(() => {
    //     return sql.query`delete from Employee where EmployeeId = ${myobj.EmployeeId} AND OrganizationID = ${myobj.OrganizationID}`
    // }).then(result => {
    //     sql.close()
    //     return callback(null, result);
    // }).catch(err => {
    //     sql.close()
    //     return callback(null, err);
    // })
}
exports.getEmployeeScreens = function getEmployeeScreens(myobj, callback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`select s.ShiftId, s.Name,  datepart(HOUR,SWITCHOFFSET(s.starttime, o.
            TimeZone)) as StartHour,   datepart(MINUTE,SWITCHOFFSET(s.starttime, o.
            TimeZone)) as StartMinute , datepart(HOUR,SWITCHOFFSET(s.endtime, o.
            TimeZone)) as EndHour,   datepart(MINUTE,SWITCHOFFSET(s.endtime, o.
            TimeZone)) as EndMinute  from shift s left join Organization o on o.ID = s.OrganizationID 
            left join employee e on e.ShiftId = s.shiftId
            where e.EmpCode= '${myobj.EmpCode}' and o.Shifts = 1 and e.status = 1`)
    }).then(result => {
        sql.close();
        var shift = result.recordset[0];
        var dateFrom = '';
        var dateTo = '';
        if (shift) {
            var date = new Date(myobj.DateForTimeSheet);
            date.setDate(date.getDate() + 1)

            dateFrom = '' + myobj.DateForTimeSheet + ' ' + shift.StartHour + ':' + shift.StartMinute + ':00'
            dateTo = '' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
                shift.EndHour + ':' + shift.EndMinute + ':59';
        }
        else {
            dateFrom = '' + myobj.DateForTimeSheet + ' 00:00:00'
            dateTo = '' + myobj.DateForTimeSheet + ' 23:59:59';
        }
        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request().query(`SELECT ss.EmpCode, dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot, o.TimeZone)),ss.DateOfScreenshot)
                        AS DateOfScreenshot,ss.DateOfScreenshot AS ActualUTC, cast(datepart(day,ss.DateOfScreenshot) as varchar(10)) + cast(datepart(month,ss.DateOfScreenshot) as varchar(10)) + cast(datepart(year,ss.DateOfScreenshot) as varchar(10))  AS ImgFolder,
                        DATEPART(HOUR,dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,o.TimeZone)),ss.DateOfScreenshot))
                        AS Hour,ss.ImageName,ss.IsIdleTime,ss.KeyStrokes,ss.MouseStrokes,ss.WindowTitles FROM dbo.ScreenShots ss
                        left join  dbo.Organization o on ss.OrganizationID = o.ID WHERE ss.EmpCode= '${myobj.EmpCode}'
                        AND  dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot, o.TimeZone)),ss.DateOfScreenshot)
                        BETWEEN '${dateFrom}' AND '${dateTo}'
                        AND ss.ImageName IS NOT NULL AND ss.OrganizationID =   ${myobj.OrganizationID}`)
        }).then(result => {
            sql.close()
            return callback(null, result.recordset);
        }).catch(err => {
            sql.close();
            return callback(null, err);
        });
        //return callback(null, result.recordset);
    }).catch(err => {
        sql.close();
        return callback(null, err);
    });

    // sql.connect(config).then(() => {
    //     return sql.query`select s.ShiftId, s.Name,  datepart(HOUR,SWITCHOFFSET(s.starttime, o.
    //         TimeZone)) as StartHour,   datepart(MINUTE,SWITCHOFFSET(s.starttime, o.
    //         TimeZone)) as StartMinute , datepart(HOUR,SWITCHOFFSET(s.endtime, o.
    //         TimeZone)) as EndHour,   datepart(MINUTE,SWITCHOFFSET(s.endtime, o.
    //         TimeZone)) as EndMinute  from shift s left join Organization o on o.ID = s.OrganizationID 
    //         left join employee e on e.ShiftId = s.shiftId
    //         where e.EmpCode= ${myobj.EmpCode} and o.Shifts = 1 and e.status = 1`
    // }).then(result => {
    //     sql.close()
    //     var shift = result.recordset[0];
    //     var dateFrom = '';
    //     var dateTo = '';
    //     if (shift) {
    //         var date = new Date(myobj.DateForTimeSheet);
    //         date.setDate(date.getDate() + 1)

    //         dateFrom = '' + myobj.DateForTimeSheet + ' ' + shift.StartHour + ':' + shift.StartMinute + ':00'
    //         dateTo = '' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
    //             shift.EndHour + ':' + shift.EndMinute + ':59';
    //     }
    //     else {
    //         dateFrom = '' + myobj.DateForTimeSheet + ' 00:00:00'
    //         dateTo = '' + myobj.DateForTimeSheet + ' 23:59:59';
    //     }
    //     sql.connect(config).then(() => {
    //         return sql.query`SELECT ss.EmpCode, dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot, o.TimeZone)),ss.DateOfScreenshot)
    //             AS DateOfScreenshot,ss.DateOfScreenshot AS ActualUTC, cast(datepart(day,ss.DateOfScreenshot) as varchar(10)) + cast(datepart(month,ss.DateOfScreenshot) as varchar(10)) + cast(datepart(year,ss.DateOfScreenshot) as varchar(10))  AS ImgFolder,
    //             DATEPART(HOUR,dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,o.TimeZone)),ss.DateOfScreenshot))
    //             AS Hour,ss.ImageName,ss.IsIdleTime,ss.KeyStrokes,ss.MouseStrokes FROM dbo.ScreenShots ss
    //             left join  dbo.Organization o on ss.OrganizationID = o.ID WHERE ss.EmpCode= ${myobj.EmpCode}
    //             AND  dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot, o.TimeZone)),ss.DateOfScreenshot)
    //             BETWEEN ${dateFrom} AND ${dateTo}
    //             AND ss.ImageName IS NOT NULL AND ss.OrganizationID =   ${myobj.OrganizationID}`
    //     }).then(result => {
    //         sql.close()
    //         return callback(null, result.recordset);
    //     }).catch(err => {
    //         sql.close()
    //         return callback(null, err);
    //     })
    // }).catch(err => {
    //     sql.close()
    //     return callback(null, err);
    // })
}

exports.getEmployeeImageBase64 = function getEmployeeImageBase64(myobj, callback) {
    soap.createClient(serviceUrl, function (err, client) {
        client.GetEmployeeImageBase64(myobj, function (err, result) {
            if (err) {
                return callback(null, err);;
            }
            return callback(null, result);
        });
    });
}

exports.getOrganizationSettings = function getOrganizationSettings(myobj, callback) {
    var obj = {}
    var key = '';
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`select shifts, IncludeLogofToIdle from organization where id = ${myobj.OrganizationID}`)
    }).then(result => {
        sql.close()
        key = 'OrganizationSettings'
        obj[key] = result.recordset
        return callback(null, obj);
    }).catch(err => {
        sql.close();
        return callback(null, err);
    });
}
