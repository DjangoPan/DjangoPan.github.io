---
title: 浮生记
date: 2020-08-23 17:10:05
type: "photos"
categories: photos
---



<!-- 主体部分 -->
<div id="box" class="box"></div>

<script type="text/javascript">

function loadXMLDoc(xmlUrl) 
{
	try //Internet Explorer
	{
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	}
	catch(e)
	{
	  try //Firefox, Mozilla, Opera, etc.
	    {
		  xmlDoc=document.implementation.createDocument("","",null);
	    }
	  catch(e) {alert(e.message)}
	}
	
	try 
	{
		  xmlDoc.async=false;
		  xmlDoc.load(xmlUrl);
	}
	catch(e) {
		try //Google Chrome  
		  {  
			var chromeXml = new XMLHttpRequest();
			chromeXml.open("GET", xmlUrl, false);
			chromeXml.send(null);
			xmlDoc = chromeXml.responseXML.documentElement; 				
			//alert(xmlDoc.childNodes[0].nodeName);
			//return xmlDoc;    
		  }  
		  catch(e)  
		  {  
			  alert(e.message)  
		  }  		  	
	}
	return xmlDoc; 
}

xmlDoc=loadXMLDoc("https://7h4mid4photos-1258055330.cos.ap-nanjing.myqcloud.com");

var urls = xmlDoc.getElementsByTagName('Key');
var date = xmlDoc.getElementsByTagName('LastModified');
var wid = 350;
var showNum = 21; //每个相册一次展示多少照片
if ((window.innerWidth) > 1200) { wid = (window.innerWidth * 3) / 18;}
var box = document.getElementById('box');
var i = 0;

var content = new Array();
var tmp=0;
var kkk=-1;
for (var t = 0; t < urls.length ; t++) {
	var bucket=urls[t].innerHTML;
	var length=bucket.indexOf('/');
	if(length===bucket.length-1){
		kkk++;
		content[kkk]=new Array();
		content[kkk][0]={'url':bucket,'date':date[t].innerHTML.substring(0,10)};
		tmp=1;
	}
	else {
		content[kkk][tmp++]={'url':bucket.substring(length+1),'date':date[t].innerHTML.substring(0,10)};
	}
}

for (var i = 0; i < content.length; i++) {
	var conBox=document.createElement("div");
	conBox.id='conBox'+i;
	box.appendChild(conBox);
	var item=document.createElement("div");
	var title=content[i][0].url;
	item.innerHTML="<button class=title style=background:url(https://7h4mid4photos-1258055330.cos.ap-nanjing.myqcloud.com/" + title + "封面.jpg"+");background-repeat:no-repeat;><span style=display:inline;><strong style=color:#f0f3f6; >" + title.substring(0,title.length - 1) + "</strong></span></button>";
	conBox.appendChild(item);

        for (var j = 1; j < content[i].length && j < showNum+1; j++) {
	        var con=content[i][j].url;
		var item=document.createElement("li");
		if(con.substring(0,con.length-4) != "封面"){
			item.innerHTML="<div class=imgbox id=imgbox style=height:"+wid+"px;><img class=imgitem src=https://7h4mid4photos-1258055330.cos.ap-nanjing.myqcloud.com/" + title + con +" alt=" + con + "></div><span>" + con.substring(0,con.length-4);
			conBox.appendChild(item);
		}
	}
	if(content[i].length > showNum){
		var moreItem=document.createElement("button");
		moreItem.className = "btn-more-posts";
		moreItem.id = "more" + i;
		moreItem.value = showNum + 1;
		let cur = i;
		moreItem.onclick = function (){
			moreClick(this,cur,content[cur],content[cur][0].url);
		}
		moreItem.innerHTML="<span style=display:inline;><strong style=color:#f0f3f6;>加载更多</strong></span>";
		conBox.appendChild(moreItem);
	}
}

function moreClick(obj,cur,cont,title){
	var parent = obj.parentNode;
	parent.removeChild(obj);
	var j=obj.value;
	var begin=j;
	for ( ; j < cont.length && j < Number(showNum) + Number(begin); j++) {
		var con=cont[j].url;
		var item=document.createElement("li");
		item.innerHTML="<div class=imgbox id=imgbox style=height:"+wid+"px;><img class=imgitem src=https://7h4mid4photos-1258055330.cos.ap-nanjing.myqcloud.com/"+title+con+" alt="+con+"></div><span>"+con.substring(0,con.length-4);
		parent.appendChild(item);
		var v=item.getElementsByTagName('img');
		v[0].id=imgid;
		imgid++;
	}
	if(cont.length > j){
		obj.value=j;
		parent.appendChild(obj);
	}
}
</script>