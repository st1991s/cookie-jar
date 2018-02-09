// 多层的promise写法
// 最近业务中有用到多层嵌套的promise，每一层的失败处理逻辑都不一样，总结了下这样的promise写法
validation.query('url1').then( result => {
    if(result){
        return validation.query('url2');
    }else{
        throw ('url1 request err');
    }
}).then( result => {
    if(result){
        return validation.query('url3');
    }else{
        throw ('url2 request err');
    }
}).then( result => {
    if(result){
        //   业务逻辑
    }else{
        throw ('url3 request err');
    }
}).catch( err => {
    if(err === 'url1 request err'){
        // xxx
    } else if(err === 'url2 request err'){
        // xxx
    } else if(err === 'url3 request err'){
        // xxx
    }

})