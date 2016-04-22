
var _IS_SUP_HTML5 = true;
var _IS_IOS = true;
var API_URL='http://115.28.18.116:8089';
//var API_URL='http://live.27bf.com/data/d_3.js';

//var $ = mui; 

$(function(){
	
	//liveUI.init();
	
	//if (window.applicationCache){ _IS_SUP_HTML5 = true;} //是否支持html5 
	 
	//ios 兼容 判断是否ios
	//if (/i(Phone|P(o|a)d)/.test(navigator.userAgent)) {
	 //       _IS_IOS = true; 
	//} 
	//声音初始化
    if(_IS_SUP_HTML5){
		$(document).one('touchstart',function(e) { changeUI.Sound_Init(); });
	} 
	
	liveUI.init();
	
});


var Timegap = 0;
var liveUI ={
	
	cur_lan:'CN',//--当前选择语言版
	Fulldata:null,//--全盘数据
	cur_oddstype:3,//--当前odds公司
	cur_oddsTypeName:'SB',
	is_Sound:true,
	live_warp:null, 
	match_hide_num:0,
	Mstate:'live',
	init:function(){
		var that = liveUI;
		 
		that.init_load();
	},
	
	init_load:function(){
		var that = liveUI;   
//		var _loadurl='http://115.28.18.116:8089/?key=Instant&cid='+that.cur_oddstype; 
		var _loadurl='http://live.27bf.com/data/d_3.js'; 
		//获取全盘数据
		mui.ajax({ 
    		type:"get",
    		async: true,
    		dataType:"json",
    		cache:true, 
    		url:_loadurl,
    		success:function(data){  
    			var vData=JSON.stringify(data);
    			alert(vData);
    			console.log(vData);
    			//alert(data);
    			//return;
    			 that.Fulldata =  data; 
    			 //生成html
    			 that.init_html_app(); 
    		},
    		error: function(xhr, type, errorThrown) {
				 console.log('error')
			}
    	});
	},
	
	//app 生成方式
	init_html_app:function(){
		var that = liveUI;
		var _html ='<ul class="mui-table-view match-list">'; 
		//-------- 
		if(that.Fulldata==null || that.Fulldata.length==0){
			
			_html+='<div class="">暂无数据</div>'; 
			
		}else{ 
			 
			for(var d in that.Fulldata){
				_html+= that.bulid_tr_app(d,that.Fulldata[d]); 
				
			} 
		}
		//---------
		_html+='</div>';
		that.live_warp.innerHTML= _html; 
		changeUI.init(); 
	},
	
	//生成行
	bulid_tr_app:function(i,d){
		var that = liveUI;
		//else if(that.Mstate='fav'){
					//查询关注的 
				//}
		//--------
		var _state = d.Process; 
		
		var _choose_s ='1|2|3|4';
		if(that.Mstate=='live'){
			_choose_s = '1|2|3|4';
		}else if(that.Mstate =='ulive'){
			_choose_s = '0';
		}else if(that.Mstate=='ending'){
			_choose_s ='-1|-13|-14';
		} 
		var _choos_array = new Array();
		_choos_array = _choose_s.split('|'); 
		var _ishas = false;
		for(var k in _choos_array){
			if(_choos_array[k]==_state){ _ishas=true; continue;}
		}
		if(!_ishas)return '';
		//----start
		var trclass = i%2==0?'t2':'t1';
		var _typename = d.TypeName_CN;
		var _hteam = d.HomeTeam_CN;
		var _cteam = d.GuestTeam_CN;  
		var _starttime = new Date(d.StartTime.replace(/-/g,'/'));
		
		
		var islive = false;
		if(('1234').indexOf(_state)>-1){
			islive = true;
		}
		//进程判断---？？？？
		var r = d.RealStartTime; 
		var _realstarttime = r[0]+'/'+(parseInt(r[1])+1)+'/'+r[2]+' '+r[3]+':'+r[4]+':'+r[5];
		var _statetxt = that.check_mstatetxt(_state,_realstarttime);
		//比分
		var _hbf ='';
		var _cbf ='';
		var _half_hbf='';
		var _half_cbf='';
		//只显示比赛中比分
		if(_state=='-1'|| _state=='1'||_state=='2'||_state=='3'||_state=='4'){
			_hbf = d.HomeMark; _cbf = d.GuestMark;
			_half_hbf = d.HalfHomeMark; _half_cbf = d.HalfGuestMark;
		}
		switch(that.cur_lan){
			case 'CN':
				_typename = d.TypeName_CN;
				_hteam =d.HomeTeam_CN;
				_cteam = d.GuestTeam_CN;
				break;
			case 'TW':
				_typename = d.TypeName_TW;
				_hteam =d.HomeTeam_TW;
				_cteam = d.GuestTeam_TW;
				break;
			case 'EN':
				_typename = d.TypeName_EN;
				_hteam =d.HomeTeam_EN;
				_cteam = d.GuestTeam_EN;
				break;
			default: break;
		} 
		//odds  压大欧 
		var _isrun = false;//是否滚球
		var _odds = d.odds;
		if(d.odds!=null){ 
			_isrun = true;
		}
		var _html='';
		_html+='<li class="mui-table-view-cell item-list" id="'+d.ID+'" class="dr '+trclass+'" data-type="'+d.TypeID+'" data-rt="'+_realstarttime+'" data-cs="'+_state+'" data-hn="'+_hteam+'" data-cn="'+_cteam+'">';
		_html+='<div class="item-r1">';
		_html+='<div class="item-l">';
		_html+='<span class="td-mtype" style="background-color:'+d.TypeColor+';">'+_typename+'</span>';
		_html+='<span class="td-status">'+_statetxt+'</span>';
		_html+='</div>';
		_html+='<div class="item-r">';
		_html+='<div class="td-odd">亚</div>';
		_html+='<div class="td-odd">大</div>';
		_html+='<span class="td-time">'+_starttime.pattern('HH:mm')+'</span>';
		_html+='</div>';
		_html+='</div>';
		_html+='<div class="item-d">';
		 
		_html+='<div class="item-l">';
		//---
		_html+='<div class="item-r2"> ';
		_html+='<div class="td-team td-hteam">';
		if(parseInt(d.HomeYellow)>0){
			_html+='<span class="yc">'+d.HomeYellow+'</span>';
		}
		if(parseInt(d.HomeRed)>0){
			_html+='<span class="rc">'+d.HomeRed+'</span>';
		}
		_html+=_hteam;
		_html+='</div>';
		
		_html+='<div class="td-bf h-bf">'+_hbf+'</div>';
		_html+='</div>';
		//--
		_html+='<div class="item-r2 ">'; 
		_html+='<div class="td-team td-cteam">';
		if(parseInt(d.GuestYellow)>0){
			_html+='<span class="yc">'+d.GuestYellow+'</span>';
		}
		if(parseInt(d.GuestRed)>0){
			_html+='<span class="rc">'+d.GuestRed+'</span>';
		}
		_html+=_cteam;
		_html+='</div>'; 
		_html+='<div class="td-bf c-bf">'+_cbf+'</div>';
		_html+='</div>';
		
		_html+='</div>';
		
		_html+='<div class="item-r">';
		_html+='<div class="odds-ya td-odd">';
		if(_isrun){ 
			_html+='<div class="odds1"><span>'+_odds.Home_YA+'</span></div>';
			_html+='<div class="odds2"><span>'+Goal2GoalCn(_odds.SB_YA)+'</span></div>';
			_html+='<div class="odds3"><span>'+_odds.Guest_YA+'</span></div>';
		}
		_html+='</div>';
		_html+='<div class="odds-da td-odd">';
		if(_isrun){ 
			_html+='<div class="odds1"><span>'+_odds.Home_DA+'</span></div>';
			_html+='<div class="odds2"><span>'+Goal2GoalCn2(_odds.SB_DA)+'</span></div>';
			_html+='<div class="odds3"><span>'+_odds.Guest_DA+'</span></div>';
		}
		_html+='</div>'; 
		_html+='</div>';
		//-----
		
		_html+='</div>';
		_html+='</div>';
		_html+='<div class="w-icon icon-star1 btn-fav"></div>';
		_html+='<div class="w-icon icon-a btn-more"></div>';
		_html+='</div>';
		_html+='</li>'; 
		return _html;
	},
	 
	//判断进程 显示
	check_mstatetxt:function(_s,_starttime){
		var that = liveUI;
		var _result =''; 
		// -1 完场 1 上半场  2 下半场  3中场  4 加时   -14推迟  -13中断 -12腰斩  -11待定 -10 取消 
		if(_s=='-1'){
			_result = '完';
		}
		else if(_s=='2'){
			_result = '中';
		}
		else if(_s=='-14'){
			_result = '推';
		}
		else if(_s=='-13'){
			_result = '断';
		}
		else if(_s=='-11'){
			_result = '待';
		}
		else if(_s=='-10'){
			_result = '取';
		}
		else if(('134').indexOf(_s)>-1){
			//计时
			_result = changeUI.TimeFunction(_s,_starttime);
		} 
		return _result;
		//修改语言版 
	}, 
	//声音
	tool_sound:function(obj){
		obj = $(obj);
		var _s = obj.prop('checked');
		if(_s){
			liveUI.is_Sound = true;
		}else{
			liveUI.is_Sound = false;
		}
	}
};
 
var bfColorTime = 40000; 

var changeUI={
	ProcessTimeflag:null,
	ProcessTspan:30000,//------30000
	playsound:false,
	playAudio:null,//声音对象 支持html5 
	Histime:null, //记录时间
	init:function(){
		var that = changeUI; 
		that.initclear();
		that.Sound_Init(); 
		that.ProcessTime();
		that.ProcessTimeflag = setInterval("changeUI.ProcessTime()",that.ProcessTspan);
		 
		that.change_process(); 
	},
	initclear:function(){
		var that = changeUI;
        clearInterval(that.ProcessTimeflag); 
        clearTimeout(that.ft_dataflag);// 
	},
	//异步刷新全盘
	ft_reload:function(){
		//=== 
		changeUI.initclear();
		setTimeout("changeUI.ft_reload_process()",Math.round(Math.random() * 10) * 1000);
	}, 
	ft_reload_process:function(){
		var that = changeUI;  
		that.initclear();//--
		liveUI.init_load(); 
	},
	//=====计时变化
	ProcessTime:function(){ 
		 //var rows = liveUI.live_warp.getElementsByTagName('li'); 
		 var rows = document.getElementById('idforgroup').getElementsByTagName('li'); 
		 for(var i=0;i<rows.length;i++){ 
		 	var o = rows[i];  
		 	var cstate = o.getAttribute('data-cs');
		 	var _starttime  = o.getAttribute('data-rt');
		 	if((cstate=='1'||cstate=='3') && _starttime && cstate){  
		 		var _statetxt = changeUI.TimeFunction(cstate,_starttime); 
		 		o.querySelector('.td-status').innerHTML = _statetxt;
		 	} 
		 } 
	},
	//即时计算
	TimeFunction:function(cstate,StartTime){
		//var _s_gif ='<img src="img/in.gif" border="0">';
		var _s_gif ="'";
		var AmountTime = 0;
		var currentTime = new Date(); 
		var _result ='';
		var haflm = 45;  
		if(cstate=='1' || cstate=='3'){ 
			if(cstate=='1'){
				AmountTime = parseInt((currentTime - Date.parse(StartTime)) / 60000) + Timegap;
			 	if(AmountTime > haflm) AmountTime = haflm+'+';
			 	else if(AmountTime < 0) AmountTime = "0";
			 	else AmountTime = AmountTime+_s_gif;
			}else{
				AmountTime = parseInt((currentTime - Date.parse(StartTime)) / 60000) + Timegap + haflm;
		 		if(AmountTime > (haflm*2)) AmountTime = (haflm*2)+'+';
		 		else if(AmountTime < (haflm+1)) AmountTime = haflm+_s_gif;
		 		else AmountTime = AmountTime+_s_gif; 
			} 
			_result = AmountTime;
		} 
		return _result;
	},
	//赔率变化
	odds_process:function(){
		var that = changeUI;  
		$.ajax({
           url: API_URL+"/index.ashx?key=Odds&cid="+liveUI.cur_oddstype+"&timenow="+new Date().getTime(),
           type: "get",
           dataType: "json",
           cache:false,  
           success: function (data) {
              if(data!= null){ 
              	 var _warp = document;
              	 
              	 for(var k in data){ 
              	 	var d = data[k];  
              	 	if(d.MatchID==null){continue;}
              	 	var _tr = _warp.getElementById(d.MatchID);   
              	 	if(_tr == undefined || _tr==null){ 
              	 		continue;
              	 	}
              	 	var odds_ya = _tr.querySelector('.odds-ya');
              	    var odds_da = _tr.querySelector('.odds-da');
              	   
              	 	var odds_h_ya = odds_ya.querySelector('.odds1');
              	 	var odds_h_da = odds_da.querySelector('.odds1'); 
              	 	
              	 	that.change_odds_values(odds_h_ya,d.Home_YA);
              	 	that.change_odds_values(odds_h_da,d.Home_DA); 
              	 	
              	 	var odds_sb_ya = odds_ya.querySelector('.odds2');
              	 	var odds_sb_da = odds_da.querySelector('.odds2'); 
              	 	
              	 	that.change_odds_values(odds_sb_ya,Goal2GoalCn(d.SB_YA));
              	 	that.change_odds_values(odds_sb_da,Goal2GoalCn2(d.SB_DA)); 
              	 	
              	 	var odds_c_ya = odds_ya.querySelector('.odds3');
              	 	var odds_c_da = odds_da.querySelector('.odds3'); 
              	 	
              	 	that.change_odds_values(odds_c_ya,d.Guest_YA);
              	 	that.change_odds_values(odds_c_da,d.Guest_DA); 
              	 	 
				} 
              }  
         },
         error:function(){  
         }
      });
		
	},
	change_odds_values:function(_w,v){ 
		 _w =_w.querySelector('span');
		if(_w!=undefined && parseFloat(_w.innerHTML) > parseFloat(v)){
            _w.innerHTML=v;
            //console.log(_w);
           _w.style.backgroundColor = "#FFb0c8";
            setTimeout(function(){
            	_w.style.backgroundColor = "";
            },10000);
        }
		else if(_w!=undefined && parseFloat(_w.innerHTML) < parseFloat(v)){
			_w.innerHTML=v;
			//console.log(_w);
           _w.style.backgroundColor = "#DCFFB9";
            setTimeout(function(){ 
            	_w.style.backgroundColor = "";
            },10000);
		}
	},
	change_process:function(){  
		var that = changeUI; 
		//if(!that.check_now_time()){return;} //判断是否超时
		$.ajax({
           url:API_URL+"/index.ashx?key=Change&timenow="+new Date().getTime(),
           type: "get",
           dataType: "json",
           cache:false,
           success: function (data) {
           	  
              if(data!= null){ 
              	 
              	 var _warp = document;
              	 for(var k in data){
              	 	
              	 	var d = data[k]; 
              	 	if(d.ID==null){continue;} 
              	 	var _tr = _warp.getElementById(d.ID); 
              	 	if(_tr == undefined || _tr==null){ 
              	 		that.ft_reload(); return;
              	 	} 
              	 	//实际开赛时间
              	 	var r = d.RealStartTime; 
					var _realstarttime = r[0]+'/'+(parseInt(r[1])+1)+'/'+r[2]+' '+r[3]+':'+r[4]+':'+r[5];
					_tr.setAttribute('data-rt',_realstarttime);
					
              	 	//进程
              	 	var _state = d.Process;
              	 	_tr.setAttribute('data-cs',_state);
              	 	
              	 	var _statetxt = liveUI.check_mstatetxt(_state,_realstarttime);
              	 	_tr.querySelector('.td-status').innerHTML=_statetxt;
              	 	 
					var islive = false;
					if(('134').indexOf(_state)>-1){
						islive = true;
					} 
					var _h_w = _tr.querySelector('.td-hteam');
					var _c_w = _tr.querySelector('.td-cteam'); 
					 
					//红牌 
					if(parseInt(d.HomeRed)>0){
						
						var _r_w = _h_w.querySelector('.rc');  
						if(_r_w!= undefined){    
							_r_w.innerHTML=d.HomeRed;
						}else{
							var newNode = document.createElement("span");
							newNode.setAttribute('class','rc');
							newNode.innerHTML = d.HomeRed;
							_h_w.insertBefore(newNode,null);
							//_h_w.prepend('<span class="rc">'+d.HomeRed+'</span>');
						}
					}
					if(parseInt(d.GuestRed)>0){
						
						var _r_w = _c_w.querySelector('.rc');  
						if(_r_w !=undefined){
							_r_w.innerHTML=d.GuestRed;
						}else{
							var cnewNode = document.createElement("span");
							cnewNode.setAttribute('class','rc');
							cnewNode.innerHTML = d.GuestRed;
							_c_w.insertBefore(cnewNode,null);
							//_c_w.prepend('<span class="rc">'+d.GuestRed+'</span>');
						}
					}
					//黄牌
					if(parseInt(d.HomeYellow)>0){
						
						var _y_w = _h_w.querySelector('.yc');  
						if(_y_w!=undefined){  
							_y_w.innerHTML = d.HomeYellow;
						}else{
							var ynewNode = document.createElement("span");
							ynewNode.setAttribute('class','yc');
							ynewNode.innerHTML = d.HomeYellow;
							_h_w.insertBefore(ynewNode,null);
							//_h_w.prepend('<span class="yc">'+d.HomeYellow+'</span>');
						}
					}
					if(parseInt(d.GuestYellow)>0){ 
						var _y_w = _c_w.querySelector('.yc'); 
						if(_y_w !=undefined){  
							_y_w.innerHTML = d.GuestYellow;
						}else{
							
							var cynewNode = document.createElement("span");
							cynewNode.setAttribute('class','yc');
							cynewNode.innerHTML = d.GuestYellow;
							_h_w.insertBefore(cynewNode,null);
							//_c_w.prepend('<span class="yc">'+d.GuestYellow+'</span>');
						}
					}
					 /*
					//半场比分
					if(islive){
						_tr.find('.td-half .h-bf').html(d.HalfHomeMark);
						_tr.find('.td-half .c-bf').html(d.HalfGuestMark); 
					}else{
						_tr.find('.td-half .h-bf').html('');
						_tr.find('.td-half .c-bf').html('');
					}*/
					//比分 
					var _h_bf_warp = _tr.querySelector('.h-bf');
					var _c_bf_warp = _tr.querySelector('.c-bf');
					var _old_hbf = _h_bf_warp.innerHTML;
					var _old_cbf = _c_bf_warp.innerHTML;
					var h_c ='f_b';
					var c_c ='f_b';
					var ischange = false;
					if(islive){ 
						if(_old_hbf!=d.HomeMark){ 
							_h_bf_warp.innerHTML = d.HomeMark;
							if(parseInt(d.HomeMark)>0){ 
								//_h_w.addClass('f_g');
								addClass(_h_w,'f_g');
								setTimeout(function(){ 
									//_h_w.removeClass('f_g');
									removeClass(_h_w,'f_g');
								},bfColorTime);
							}
							h_c ='f_r';
							ischange = true;
						} 
						
						if(_old_cbf!=d.GuestMark){ 
							_c_bf_warp.innerHTML = d.GuestMark;
							if(parseInt(d.GuestMark)>0){ 
								//_c_w.addClass('f_g');
								addClass(_c_w,'f_g');
								setTimeout(function(){ 
									//_c_w.removeClass('f_g');
									removeClass(_c_w,'f_g');
								},bfColorTime);
							}
							c_c ='f_r';
							ischange = true;
						} 
						//tips
						if(ischange){
							if(liveUI.is_Sound){
								that.DOSound();
							} 
							//
							//$('.jq-tips').html('<img src="img/zd.gif">&nbsp;'+_tr.attr('data-hn')+'&nbsp;<span class="'+h_c+'">'+d.HomeMark+'</span>-<span class="'+c_c+'">'+d.GuestMark+'</span>&nbsp;'+_tr.attr('data-cn')+'');
						}
						
					}else{
						_h_bf_warp.innerHTML = '';
						_c_bf_warp.innerHTML = '';
					}
					
					
				} 
            } 
             //赔率 
            setTimeout(function(){ that.odds_process() },1000); 
              
             clearTimeout(that.ft_dataflag);
             that.ft_dataflag = setTimeout("changeUI.change_process()",3000); 
         },
         error:function(){ 
         	 clearTimeout(that.ft_dataflag);
         	 that.ft_dataflag = setTimeout("changeUI.change_process()",3000); 
         }
      });
		
	}, 
	Sound_Init:function(){
		//声音初始化
		if(_IS_SUP_HTML5 && changeUI.playAudio ==null ){
	        changeUI.playAudio = new Audio();
	        changeUI.playAudio = document.createElement("audio")
			changeUI.playAudio.src ='../sound/s.mp3';
			changeUI.playAudio.load(); 
	    }  
	},
	DOSound:function(){
		if(!liveUI.is_Sound){ return;}  
		if(_IS_SUP_HTML5){  
			changeUI.Sound_Init();
			changeUI.playAudio.play(); 
		}else{  
			try{ 
				document.innerHTML= jqsy;
				
			}catch(e){
				
			   	document.innerHTML= jqsy; 
			}
		}
		 
	} 
}



//公司
var CompanyArray ={ 
	3:'SB',
	1:'澳门',
	4:'立博',
	8:'bet365',
	12:'易胜博',
	17:'明陞',
	24:'沙巴',
	12:'利记'
};

//中文转换方法
var GoalCn="平手,平/半,半球,半/一,一球,一/球半,球半,球半/两,两球,两/两球半,两球半,两球半/三,三球,三/三球半,三球半,三球半/四球,四球,四/四球半,四球半,四球半/五,五球,五/五球半,五球半,五球半/六,六球,六/六球半,六球半,六球半/七,七球,七/七球半,七球半,七球半/八,八球,八/八球半,八球半,八球半/九,九球,九/九球半,九球半,九球半/十,十球".split(",");
var GoalCn2 = ["0", "0/0.5", "0.5", "0.5/1", "1", "1/1.5", "1.5", "1.5/2", "2", "2/2.5", "2.5", "2.5/3", "3", "3/3.5", "3.5", "3.5/4", "4", "4/4.5", "4.5", "4.5/5", "5", "5/5.5", "5.5", "5.5/6", "6", "6/6.5", "6.5", "6.5/7", "7", "7/7.5", "7.5", "7.5/8", "8", "8/8.5", "8.5", "8.5/9", "9", "9/9.5", "9.5", "9.5/10", "10", "10/10.5", "10.5", "10.5/11", "11", "11/11.5", "11.5", "11.5/12", "12", "12/12.5", "12.5", "12.5/13", "13", "13/13.5", "13.5", "13.5/14", "14" ];
function Goal2GoalCn(goal){ //数字盘口转汉汉字	
	if (goal==null || goal +""=="")
		return "";
	else{
	    if(goal>10 || goal<-10) return goal+"球";
		if(goal>=0)  return GoalCn[parseInt(goal*4)];
		else return '<font color="red">*</font>'+ GoalCn[Math.abs(parseInt(goal*4))];
	}
}
function Goal2GoalCn2(goal){
	if (goal=="")
		return "";
	else{
	    if(goal>14) return goal+"球";
		return GoalCn2[parseInt(goal*4)];
	}
}


Date.prototype.pattern=function(fmt) {         
    var o = {         
    "M+" : this.getMonth()+1, //月份         
    "d+" : this.getDate(), //日         
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    "H+" : this.getHours(), //小时         
    "m+" : this.getMinutes(), //分         
    "s+" : this.getSeconds(), //秒         
    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
    "S" : this.getMilliseconds() //毫秒         
    };         
    var week = {         
    "0" : "/u65e5",         
    "1" : "/u4e00",         
    "2" : "/u4e8c",         
    "3" : "/u4e09",         
    "4" : "/u56db",         
    "5" : "/u4e94",         
    "6" : "/u516d"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
    }         
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
}


function addClass(obj, cls) {  
    if (!hasClass(obj, cls)) obj.className += " " + cls;  
}  
function hasClass(obj, cls) {  
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
}    
function removeClass(obj, cls) {  
    if (hasClass(obj, cls)) {  
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
        obj.className = obj.className.replace(reg, ' ');  
    }  
}  