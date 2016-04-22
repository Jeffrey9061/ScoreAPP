 
//请求接口
var DATA_API ={
	_URL:'http://115.28.18.116:8089/index.ashx',
	_GET:function(_param,success_callback,error_callback){
		var that = DATA_API; 
		mui.ajax({
    		type:"get",
    		dataType:"json",
    		cache:false,
    		data: _param,
    		url:that._URL,
    		success:function(data){  
    			success_callback(data);
    		},
    		error:function(e){ 
    			error_callback(e);
    		}
    	});
	}
}

var dal ={
	
	//根据id获取赛事
	match_get:function(_id,success_callback,error_callback){
		var _param = {
			key:'Instant',
			data:_id
		}
		return DATA_API._GET(_param,success_callback,error_callback);
	},
	//根据id获取赛事数据
	match_event_get:function(_id,success_callback,error_callback){
		var _param = {
			key:'Detail',
			data:_id
		}
		return DATA_API._GET(_param,success_callback,error_callback);
	},
	//根据id获取赛事赔率
	match_odds_get:function(_id,_cid,success_callback,error_callback){
		var _param = {
			key:'Plate',
			id:_id,
			cid:_cid
		}
		return DATA_API._GET(_param,success_callback,error_callback);
	}
}

function del_html(str){
	
	return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
}

