const sql = require('mssql');
var soap = require('soap');
const utils = require('../utils/config');
const config = utils.config;
const serviceUrl = utils.url;

exports.getDepartments = function getDepartments(myobj, callback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`select * from Department where OrganizationID = ${myobj.OrganizationID}`)
    }).then(result => {
        sql.close()
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close();
        return callback(null, err);
    });
    // sql.connect(config).then(() => {
    //     return sql.query`select * from Department where OrganizationID = ${myobj.OrganizationID}`;
    // }).then(result => {
    //     sql.close();
    //     return callback(null, result.recordset);
    // }).catch(err => {
    //     sql.close();
    //     return callback(null, err);
    // })

}

exports.getMasterData = function getMasterData(myobj, callback) {
    var obj = {}
    var key = '';
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`select Max(DepartmentId) AS DepartmentId from Department;`)
    }).then(result => {
        sql.close()
        key = 'LastDepartmentId'
        obj[key] = result.recordset
        return callback(null, obj);
    }).catch(err => {
        sql.close();
        return callback(null, err);
    });
    // sql.connect(config).then(() => {
    //     return sql.query`select Max(DepartmentId) AS DepartmentId from Department;`
    // }).then(result => {
    //     sql.close()
    //     key = 'LastDepartmentId'
    //     obj[key] = result.recordset
    //     return callback(null, obj);
    // }).catch(err => {
    //     sql.close()
    //     return callback(null, obj);
    // })

}

exports.getDepartmentDetails = function getDepartmentDetails(myobj, callback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`select * from Department where DepartmentId = ${myobj.DepartmentId}`)
    }).then(result => {
        sql.close()
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close();
        return callback(null, err);
    });
    // sql.connect(config).then(() => {
    //     return sql.query`select * from Department where DepartmentId = ${myobj.DepartmentId}`;
    // }).then(result => {
    //     sql.close();
    //     return callback(null, result.recordset);
    // }).catch(err => {
    //     sql.close();
    //     return callback(null, err);
    // })

}

exports.addDepartment = function addDepartment(myobj, callback) {
    if (myobj.action == "add") {
        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request().query(`INSERT INTO [Department] ([DepartmentId]
                         ,[Name]
                         ,[OrganizationID])  
                     VALUES (${myobj.DepartmentId},
                         '${myobj.Name}',
                         ${myobj.OrganizationID});`)
        }).then(result => {
            sql.close()
            return callback(null, result);
        }).catch(err => {
            sql.close();
            return callback(null, err);
        });
        // sql.connect(config).then(() => {
        //     return sql.query`INSERT INTO [Department] ([DepartmentId]
        //         ,[Name]
        //         ,[OrganizationID])  
        //     VALUES (${myobj.DepartmentId},
        //         ${myobj.Name},
        //         ${myobj.OrganizationID});`
        // }).then(result => {
        //     sql.close()
        //     return callback(null, result);
        // }).catch(err => {
        //     sql.close()
        //     return callback(null, err);
        // })
    } else {
        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request().query(`UPDATE [Department] SET
                     [Name] =  '${myobj.Name}'
                 WHERE Departmentid = ${myobj.DepartmentId}`)
        }).then(result => {
            sql.close()
            return callback(null, result);
        }).catch(err => {
            sql.close();
            return callback(null, err);
        });
        // sql.connect(config).then(() => {
        //     return sql.query`UPDATE [Department] SET
        //         [Name] =  ${myobj.Name}
        //     WHERE Departmentid = ${myobj.DepartmentId}`
        // }).then(result => {
        //     sql.close()
        //     return callback(null, result);
        // }).catch(err => {
        //     sql.close()
        //     return callback(null, err);
        // })

    }
}