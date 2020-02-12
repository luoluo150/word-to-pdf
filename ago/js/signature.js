/**
 * Created by jk on 2018/9/11.
 */

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

	saveBtnel.addEventListener('click', function (e) { //结束之后  data:{name:_name,xh:_xh,bh:_number,date:_date,person:_person,phone:_phone},//参数
  		  console.log(addlist);
		 cs15=$(".getname").val();//日期
         addlist.userid=uid;
		 addlist.signdate=cs15;
      var i=0;
	  for(var key in addlist){ //循环所有的数据
            ++i;
			if(!addlist[key]&&key!='sign'){
			alert("请将表单填写完整");
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
			    addlist.sign=picurl;
				console.log(addlist);
			    $.ajax({
			   					url: puburl+"/user/contract/docConvertToPdf2",
								data:JSON.stringify(addlist),
								contentType: 'application/json',
							    //JSON.stringify(addlist),
			   					/*data:{
			   					  "userid":uid,
			   					  "name":alltitle[0],
			   					  "idcard":alltitle[1],
			   					  "number":alltitle[2],
			   					  "address":alltitle[3],
			   					  "ename":alltitle[4],
			   					  "sex":alltitle[5],
			   					  "idcardnum":alltitle[6],
			   					  "heightandweight":alltitle[7],
			   					  "num":alltitle[8],
			   					  "content":alltitle[9],
			   					  "date":alltitle[10],
			   					  "money":alltitle[11],
			   					  "signdate":alltitle[12],
			   					  "n":alltitle[13],
			   					  "nk":alltitle[14],
			   					  "y":alltitle[15],
			   					  "yc":alltitle[16],
			   					  "hy":alltitle[17],
			   					  "jd":alltitle[18],
			   					  "e":alltitle[19],
			   					  "sign":picurl
			   					},*/
			   					type: "post",
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
		$("#signature_wrapper").hide();

	  }
		else {alert("请输入全部必填项");}
    })
		
}
