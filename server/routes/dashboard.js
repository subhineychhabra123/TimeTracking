var express = require('express');
var router = express.Router();
var dashboard = require('../handlers/dashboardHandler');

router.post('/GetAttendance', function(req, res, next) {
  var myobj = req.body;
  dashboard.getAttendance(myobj,(error,obj) =>{
    if(error){
      res.json(error)
    }
    else{
      res.json(obj);
    }
  })
});
 

module.exports = router;
