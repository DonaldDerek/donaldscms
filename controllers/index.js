'use strict';
var Project = require("../models/index");
var auth = require('../lib/auth');
var fs = require('fs');
var path = require('path');

module.exports = function (app) {

    app.get('/', function (req, res) {
        Project.find(function(err, projs){

            res.json(projs)
        })
    });

    app.get('/rootaccess', auth.isAuthenticated('admin'), function (req, res) {
        
        Project.find(function(err, projs){
        	if(err) console.log(err);
        	else {
        		var model = {
        			projects: projs,
                    host: 'http://'+req.headers.host
        		}
                
        		//console.log(model)
        		res.render('root', model);
        	}
        });        
        
    });
    app.post('/add', auth.isAuthenticated('admin'), function (req, res) {
        //console.log(req.files)
        var file = req.files.Thumbnail;
        var form_data = req.body;
            if(file.type == 'image/png'){
        
            fs.readFile(file.path, function (err, data) {
                
                //console.log(data)
                var newPath = path.join(__dirname,"../public/images/",file.name);
                var imagePath = path.join("/images/",file.name);
                fs.writeFile(newPath, data, function (err) {
                    if(err) console.log(err)
                    form_data.image=imagePath;
                    var project = new Project(form_data);    
                    project.save(function(){
                        console.log("New Project added.");
                        res.redirect('/rootaccess')
                    });
                });
            });
        }
        else{
            res.redirect('/rootaccess')   
        }
    
    });
    app.get('/edit/projects/:id',auth.isAuthenticated('admin'), function (req, res) {
        return Project.findById(req.params.id, function (err, project) {
            var model = {
                    project: project,
                    host: 'http://'+req.headers.host
            }
            return res.render('edit',model);

        })    
    });
    app.post('/edit/projects/:id',auth.isAuthenticated('admin'), function (req, res) {
        var file = req.files.Thumbnail;
        var form_data = req.body;
        
        
        return Project.findById(req.params.id, function (err, project) {
            

            project.name=form_data.name;
            project.description=form_data.description;
            project.link=form_data.link;
            project.github=form_data.github;

            if(file.type == 'image/png'){
        
                fs.readFile(file.path, function (err, data) {
                
                    var newPath = path.join(__dirname,"../public/images/",file.name);
                    var imagePath = path.join("/images/",file.name);
                    fs.writeFile(newPath, data, function (err) {
                        if(err) console.log(err)
                        project.image=imagePath;
                        project.save(function(){
                            console.log("Project edited.");
                            res.redirect('/rootaccess')
                        });
                    });
            });
        }
        else{
            project.save(function(){
                            console.log("Project edited.");
                            res.redirect('/rootaccess')
            }); 
        }
    

        })    
    })
    app.post('/remove/projects/:id',auth.isAuthenticated('admin'), function (req, res) {
        console.log(req.params)
        return Project.findById(req.params.id, function (err, project) {
            return project.remove(function (err) {
                if (!err) {
                    console.log("removed");
                    return res.redirect('/rootaccess');
                } else {
                    console.log(err);
                }
            });
        });
    });

};
