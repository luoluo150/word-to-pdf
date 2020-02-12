
function signatureCanvas(p) {
    var defaults = {
        wrapperEl: document.getElementById("signature_wrapper"),
        clearBtnEl: document.getElementById("btn_clear"),
        saveBtnEl: document.getElementById("downloadPdf"),
        strokeStyle: "#676464",
        linewidth: 1,
        background: "#fff",
        border: '0 none'
    };
    for (var property in p) {
        defaults[property] = p[property]
    }
		
    var params = defaults; 
    var wrapperEl = params.wrapperEl;// console.log(params.wrapperEl);  // 画布容器
    var clearBtnEl=params.clearBtnEl;// console.log(clearBtnEl);  清除
    var saveBtnel =params.saveBtnEl; // console.log(saveBtnel);   保存
    var canvas = document.createElement('canvas');
    var cs1,cs15;
    var imgBase64;
    wrapperEl.appendChild(canvas);
	$('#signature_wrapper > canvas').attr("id","ccanvas");
    canvas.style.display = 'block';
    canvas.width = (params.width) ? (params.width) : (wrapperEl.offsetWidth/1.1);   //控制画布大小    1.5
    canvas.height = (params.height) ? (params.height) : (wrapperEl.offsetWidth/1.2);  //控制画布大小  高度 
	ctxOffsetTop=canvas.offsetTop;
    ctxOffsetLeft=canvas.offsetLeft;	
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = params.strokeStyle; //线条颜色
    ctx.lineWidth = params.linewidth;
    ctx.fillStyle = params.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height); //填充画布坐标
    canvas.addEventListener('touchstart',function (e) {
        ctx.beginPath();
        ctx.moveTo(e.changedTouches[0].pageX-ctxOffsetLeft, e.changedTouches[0].pageY-ctxOffsetTop);
        return false;
    });
    canvas.addEventListener('touchmove',function (e) {
        e.preventDefault()
        ctx.lineTo(e.changedTouches[0].pageX-ctxOffsetLeft, e.changedTouches[0].pageY-ctxOffsetTop);
        ctx.stroke();
        return false;
    });
    canvas.addEventListener('touchend',function (e) {
        ctx.closePath();
        return false;
    });
    clearBtnEl.addEventListener('click',function (e) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    });
    if(document.all) {
		document.getElementById("btn_clear").click();
	}else {
		var e = document.createEvent("MouseEvents");
		e.initEvent("click", true, true);
		document.getElementById("btn_clear").dispatchEvent(e);
	}
	function isCanvasBlank(cc) {
		var blank = document.createElement('canvas');//系统获取一个空canvas对象
		blank.width = cc.width;
		blank.height = cc.height;
		//console.log(cc.toDataURL());
		//console.log(blank.toDataURL());

		return cc.toDataURL() == blank.toDataURL();//比较值相等则为空
	}
	function checkEmpty() {
		var c=document.getElementById("ccanvas"); // 获取html的canvas对象，我这个id="canvas"
		
		var f=isCanvasBlank(c);
		//console.log(f);
		if(f){
			alert("请确认您的签名");
			return true;
		}
		else{ return false;}
	}
	saveBtnel.addEventListener('click', function (e) { //结束之后  data:{name:_name,xh:_xh,bh:_number,date:_date,person:_person,phone:_phone},//参数
  		  console.log(addlist);

		 cs15=$(".getname").val();//日期
        if (checkEmpty()) return;
         //addlist.userid=uid;
		 //addlist.signdate=cs15;
      var i=0;
	  for(var p=0;p< addlist.length;p++){ //循环所有的数据
            ++i;

			if(!addlist[p].paramvalue&&addlist[p].paramname!='sign'){
			alert("请将第"+i+"项表单填写完整");
			return;
		 }  			
	  }

		
	  if(cs15){
		//imgBase64 = canvas.toDataURL();//图片

		var dataurl = canvas.toDataURL('image/png'); //base64图片数据
		var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while(n--){
			u8arr[n] = bstr.charCodeAt(n);
		}
		var obj = new Blob([u8arr], {type:mime});
		var fd = new FormData();
		fd.append("file", obj,"image.png");
		$.ajax({
            url:puburl+"/user/contract/uploadPic",//图片上传
			data:fd,
			contentType:false,
			processData:false,
			type: "post",
			beforeSend: function () {
			  $("#saveBtn").attr({ disabled: "disabled" });
              $("#loadding").show();
           },
            success: function (data) {
               console.log(data);
			   var picurl=data.fileName;
				console.log(addlist);
			    $.ajax({
			   					url: puburl+"/user/contract/docConvertToPdf2?userid="+uid+"&signdate="+cs15+"&sign="+picurl+"&companyid="+comid,
								type: "post",
								contentType: "application/json",
								data:JSON.stringify(addlist),
			   					success: function (data) {
			   					   console.log(data);
			   					    if(data!=""){
			   						    $("#copytext3").css("visibility","hidden");
			   							$("#loadding").hide();
			   							$("#copytext").css("display","block");
			   							$('#information2').attr('href',data.msg);
			   					   }else{
			   						  alert("生成失败");
			   					   }
			   					},
			   					error: function (XMLHttpRequest, textStatus, errorThrown) {}
			   }); 
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {}
        });
		$(".allbtn").hide();
		//$("#signature_wrapper").hide();

	  }
		else {alert("请确保输入全部选项");}
    })
		
}
