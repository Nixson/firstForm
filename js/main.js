"use strict";

function Data() {
    const _mapStudents = {};
    let iter = 0;
    this.add = (student)=>{
        student.uid = iter;
        _mapStudents[iter] = student;
        iter++;
    };
    this.rm = (uid)=>{
        delete _mapStudents[uid];
    };
    this.update = (uid,student)=>{
        student.uid = uid;
        _mapStudents[uid] = student;
    };
    this.get = (uid)=> _mapStudents[uid];
    this.getAll = ()=> _mapStudents;
    return this;
}

function Form(){
    const self = this;
    self.data = new Data();
    self.init = function(){
        self.on('actionForm','click',function(){self.actionForm();});
    };
    self.template = '<tr><td>{NAME}</td>' +
        '<td>{PHONE}</td>' +
        '<td class="control">' +
        '<button type="button" id="btnEdit{UID}">&#9998;</button>' +
        '<button type="button" id="btnRm{UID}">&#10006;</button>' +
        '</td></tr>';
    self.actionForm = ()=>{
        const student = {
             name: self.id('iName').value
            ,surname: self.id('iSurname').value
            ,middlename: self.id('iMiddlename').value
            ,phone: self.id('iPhone').value
            ,js: self.id('havJS').checked
        }
        if(localUID >= 0){
            self.data.update(localUID,student);
        } else {
            self.data.add(student);
        }
        localUID = -1;
        self.clear();
        self.view();
    };
    self.clear = ()=>{
        self.id('stForm').reset();
    };
    self.view = ()=>{
        const stList = self.id('stList');
        stList.innerHTML = '';
        const students = self.data.getAll();
        const list = [];
        for(let el in students){
            let student = students[el];
            let name = student.surname + " " + student.name.substr(0,1) + ". " + student.middlename.substr(0,1)+".";
            let tpl = self.replaceAll(self.template,'{NAME}',name);
            tpl = self.replaceAll(tpl,'{PHONE}',student.phone);
            tpl = self.replaceAll(tpl,'{UID}',student.uid);
            list.push(tpl);
        }
        stList.innerHTML = list.join('');
        for(let el in students) {
            self.onStudent(students[el]);
        }
    };
    var localUID = -1;
    self.onStudent = (student)=>{
        self.on("btnEdit"+student.uid,'click',function(){
            localUID = student.uid;
            self.id('iName').value = student.name;
            self.id('iSurname').value = student.surname;
            self.id('iMiddlename').value = student.middlename;
            self.id('iPhone').value = student.phone;
            self.id('havJS').checked = student.js;
        });
        self.on("btnRm"+student.uid,'click',function(){
            self.data.rm(student.uid);
            self.view();
        });
    };
    self.replaceAll = (tpl,find,replace)=> tpl.split(find).join(replace);
    self.id = (id) => document.getElementById(id);
    self.on = function(id,type,callback){
        let element = self.id(id);
        if(element && typeof  callback == 'function') {
            element.addEventListener(type,callback);
        }
    }
    return self;
}
var form = new Form();
form.init()