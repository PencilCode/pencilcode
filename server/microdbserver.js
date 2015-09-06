module.exports = function (dbPath) {
  var app = require('express')();
  var dbService = require('PencilcodeMicroDatabase')(dbPath);

  function processRequest(method, req, res) {
    var user = res.locals.owner;
    var db = req.params.db;
    var transaction = req.query.transaction;
    var args = req.query.args;
    
    db = db ? db : '';

    var parameters = [
      function (data) {
        res.status(200).json(data);
      },
      function (err) {
        res.status(400).json(err);
      },
      "./" + user + "/" + db
    ];


    try {
      if (transaction) {
        parameters.push(transaction);

        args = args ? JSON.parse(req.query.args) : '';
        
        if(args.length){
          for(var x=0;x<args.length;x++){
            parameters.push(args[x]);
          }
        }else{
          parameters.push(args);
        }
      }
    } catch (err) {
      args = '';
    }

    dbService[method].apply(this, parameters);
  }

  app.get('/:db/get', function (req, res) {
    processRequest('get', req, res)
  });
  app.get('/:db/set', function (req, res) {
    processRequest('set', req, res)
  });
  app.get('/:db/delete', function (req, res) {
    processRequest('delete', req, res)
  });

  var server = app.listen(4000, function () {
    console.log('Pencilcode Micro Database is listening at http://%s:%s', "localhost", 4000);
  });

  return app;

}