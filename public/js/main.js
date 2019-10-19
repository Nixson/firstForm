"use strict";

function Ajax(){
    const self = this;
    const url = '/user';
    self.post = (data,callback)=>{
        $.ajax(url,{
            'data': JSON.stringify(data), //{action:'x',params:['a','b','c']}
            'type': 'POST',
            'processData': false,
            'contentType': 'application/json',
            'success': (data)=>{
                if(typeof callback == 'function')
                    callback(resp);
            },
            'error': (data)=>{
                console.log(resp.error);
            }
        });
    };
    self.get = function (uid, callback) {
        let data = '';
        if(uid!='')
            data = '/'+uid;
        $.get(url+data,function(resp){
            if(resp.error!=undefined) {
                console.log(resp.error);
                return;
            }
            callback(resp);
        },'json');
    }
    return self;
}

function Data() {
    const aj = new Ajax();
    const _mapStudents = {};
    let iter = 0;
    this.add = (student)=>{
        aj.post({add: student});
    };
    this.rm = (uid)=>{
        aj.post({rm: uid});
    };
    this.update = (uid,student)=>{
        student.uid = uid;
        aj.post({update: student});
    };
    this.get = (uid,callback)=> {
        aj.get(uid,callback);
    };
    this.getAll = (callback)=>{
        aj.get('',callback);
    }
    return this;
}

let pr = new Promise((resolve, reject)=>{
    aj.get(34534,(resp)=>{
        if(resp.error!=undefined)
            reject(resp.error);
        else
            resolve(resp);
    });
});

pr  .then((resp)=>{
        console.log(resp);
        return pr;
    })
    .then((resp)=>{
        console.log(resp);
        return pr;
    })
    .then((resp)=>{
        console.log(resp);
        return pr;
    })
    .then((resp)=>{
        console.log(resp);
        return pr;
    })
    .catch((err)=>{
        console.error(err);
        return pr;
    })
    .then((resp)=>{
        console.log(resp);
        return pr;
    })
    .catch((err)=>{
        console.error(err);
    });

function Form(){
    const self = this;
    self.data = new Data();
    self.init = function(){
        self.on('actionForm','click',function(){self.actionForm();});
        self.view();
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
        setTimeout(()=>{
            self.viewTime();
        },100);
    };
    self.viewTime = ()=>{
        const stList = self.id('stList');
        stList.innerHTML = '';
        self.data.getAll((students)=>{
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
        });
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
form.init();
