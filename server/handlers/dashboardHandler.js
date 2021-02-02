const sql = require('mssql')
const utils = require('../utils/config')
const config = utils.config;

exports.getAttendance = function getAttendance(myobj, callback) {
    
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query("exec spAttendance   @startDate= '"+myobj.DateForAttendance+"', @organizationId= '"+myobj.OrganizationID+"';")
    }).then(result => {
        sql.close()
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close();
        return callback(null, err);
    });
    // sql.connect(config, function (err) { 
    //     if (err) console.log(err);
    //     // create Request object
    //     var request = new sql.Request();
    //     // query to the database and execute procedure 
    //     let query = "exec spAttendance   @startDate= '"+myobj.DateForAttendance+"', @organizationId= '"+myobj.OrganizationID+"';";
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