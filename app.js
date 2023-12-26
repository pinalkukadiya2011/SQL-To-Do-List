var mysql = require('mysql');
const express = require('express')
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todo_list'
});
 
connection.connect();
var id=0;
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))

// user side
// ======================= user login ================
app.get('/', function (req, res) {
   res.render("login")
  })
 app.post('/', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var login_query = "select * from user where email='" + email + "' and password='" + password + "'";
    connection.query(login_query, function (error, results, fields) {
      if (error) throw error;
      if (results.length==1) {
       id=results[0].u_id;
        res.redirect("/dashboard");
       }
      else {
        res.redirect("/");
      }
    });
  })
  // ===================user dashboard ========================
  // app.get('/dashboard', function (req, res) {

  //   res.render("dashboard");
  // })
 app.get('/dashboard', function (req, res) {
    var select = "select * from  task_manage where u_id='"+id+"'  ";
connection.query(select, function (error, results, fields) {
      if (error) throw error;
        // console.log(results);
        res.render("dashboard",{results})
      });
  })
// =======================  user logout ========================
app.post('/',function(req,res){
  res.redirect("/");
})




 //   admin side
//=================== admin login ==================================
app.get('/admin', function (req, res) {
     res.render("adminlogin");
  })
app.post('/admin', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var login_query = "select * from admin where email='" + email + "' and password='" + password + "'";
    connection.query(login_query, function (error, results, fields) {
      if (error) throw error;
      if (results.length == 1) {
        res.redirect("/admindashboard");
      }
      else {
       res.redirect("/admin");
       }
    });
  })
// =====================admin dashboard==========================
  app.get('/admindashboard', function (req, res) {
 res.render("admindashboard");
  })
// =============================user register ========================
  app.get('/adduser', function (req, res) {
    var select = "select * from user";
    connection.query(select, function (error, results, fields) {
    if (error) throw error;
    res.render("register", { results })
  });
  })
  app.post('/adduser', function (req, res) {
     var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var insert_query = "insert into user(name,email,password) values('"+name+"','"+email+"','"+password+"')";
   connection.query(insert_query, function (error, results, fields) {
      if (error) throw error;
      res.redirect("/adduser");
       });
  })

  // ==================add the task ==========================
  app.get('/addtask', function (req, res) {
     var select_data;
     var view_user_query="select * from user";
     var select_query = "select * from task_manage";
     connection.query(select_query,function(error,results,fields){
      if(error) throw error;
      select_data = results;
     })
     connection.query(view_user_query,function(error,results,fields){
      if(error) throw error;
      res.render('addtask',{results,select_data});
     })
 })
  app.post('/addtask',function(req,res){
    var task_name = req.body.task_name;
    var user_id = req.body.user_id;
    var view_user_query = "insert into task_manage(task_name,u_id)values('"+task_name+"','"+user_id+"')";
    connection.query(view_user_query,function(error,results,fields){
      if(error) throw error;
      res.redirect('/addtask');
     })
  })
  // ======================== delete the user =====================
  app.get('/delete_user/:u_id',function(req,res){
    var u_id = req.params.u_id;
    var delete1 = "delete from user where u_id="+u_id;
    connection.query(delete1, function (error, results, fields) {
        if (error) throw error;
        res.redirect("/adduser");
      });
  })

  // =============================update the user ====================
  app.get('/update_user/:u_id',function(req,res){
    var u_id = req.params.u_id;
    console.log(u_id);
    var update = "select * from user where u_id="+u_id;
    connection.query(update, function (error, results, fields) {
        if (error) throw error;
        res.render("update_user",{results});
      });
  })
app.post('/update_user/:u_id',function(req,res){
    var u_id = req.params.u_id;
    var name= req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var update = "update user SET name='"+name+"',email='"+email+"',password='"+password+"'  WHERE u_id="+u_id;
    connection.query(update, function (error, results, fields) {
        if (error) throw error;
         res.redirect("/adduser");
      });
  })
  

// =============update the status (both side) ===========================
 app.get('/update/:t_id',function(req,res){
    var t_id = req.params.t_id;
    var update = "select * from task_manage where t_id="+t_id;
    connection.query(update, function (error, results, fields) {
        if (error) throw error;
        res.render("update",{results});
       });
  })
  app.post('/update/:t_id',function(req,res){
   var t_id =req.params.t_id;
   var status = req.body.status;
   var update = "update task_manage SET status='"+status+"'  WHERE t_id="+t_id;
    connection.query(update, function (error, results, fields) {
        if (error) throw error;
           res.redirect('/addtask');
      });
  })


  // logout the admin
  app.post('/admin',function(req,res){
       res.redirect("/admin");
  })

  


 app.listen(3000);