const querystring = require("querystring");
const control = function(){
    const self = this;
    let uuid = 0;
    const users = {};
    self.parse = (req, callback)=>{
        const data = {
            headers: req.headers,
            method: req.method,
            url: req.url
        };
        const url = data.url.substr(1).split('/');
        //GET
        if(data.method == "GET"){
            if(url.length > 1){
                self.get(url[1],callback);
            } else {
                self.getAll(callback);
            }
        } else {
            self.getPostData(req,post=>{
                for(let type in post){
                    switch (type) {
                        case 'add': self.add(post[type]); break;
                        case 'update': self.update(post[type]); break;
                        case 'rm': self.rm(post[type]); break;
                    }
                }
                console.log('post data: ',post);
                callback(200,"{}");
            });
//            callback(200,"{}");
        }
    };
    self.add = (st)=>{
        st.uid = uuid;
        users[uuid] = st;
        uuid++;
    };
    self.update = (st)=>{
        users[st.uid] = st;
    };
    self.rm = (uid)=>{
        delete users[uid];
    };
    self.getPostData = function(req,callback){
        console.log("getPostData");
        if(req.method == "POST"){
            var body = '';
            req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                console.log("body",body);
                var post = JSON.parse(body);
                callback(post);
            });
        } else {
            callback({});
        }

    },
    self.getAll = callback=>{
        callback(200,users);
    };
    self.get = (uid,callback)=>{
        if(users[uid] == undefined){
            callback(404,{"error":"not found"});
            return;
        }
        callback(200,users[uid]);
    };
    return this;
}
module.exports = new control;
/*
CRUD:
create
method: POST
path: /user
remove
method: POST
path: /user/rm/1
update:
    method: POST
path: /user/upd/1
*/