function ajax(cfg, callback){
    var req = new XMLHttpRequest();
    if( typeof cfg == "undefined") {
        throw new Error("Не указаны параметры");
    }
    if(cfg.type == undefined){
        cfg.type = "GET";
    }
    if(cfg.url == undefined){
        throw new Error("Не указан url");
    }
    req.open(cfg.type, cfg.url, true);
    req.onreadystatechange = function (aEvt) {
        if(req.readyState == 4){
            if(typeof callback == 'function'){
                callback(req);
            }
        }
    }

    if(cfg.type=="POST" && cfg.data!=undefined){
        req.send(cfg.data);
    } else
        req.send(null);

}
