//settings
cards=new Array();
name="User";
avatar="defaultavatar.png";
small=false;
effect="slide";
effectSpeed=800;
isMouseDown=false;

//code - don't edit something

function start() {
	load();
	buildPage();
}

function buildPage() {
	$("#avatar").attr("src",avatar);
	$("#name").text(name);
	
	//build add		
	$("#add").draggable();
	$("#add").resizable();
	$("#add").data("editId","");
	
	//build settings	
	$("#settings").draggable();
	$("#settings").resizable();
	
	//build slider
	$(".sliderMarker").each(function() {$(this).draggable({ axis: "x", containment: "parent"});});
	$(document).mouseup(function() {$(".slider").each(function () {$(this).parent().children(".sliderText").text(Math.round(getSliderValue($(this))*2*800).toString());});});
	
	//bin and edit
	$(document).mousedown(function() {isMouseDown=true;});
	$(document).mouseup(function() {isMouseDown=false; $("#cards>.card.bin>img").hide("slide",{},effectSpeed/4,function() {$(this).parent().hide("scale",{},effectSpeed/4);});	$("#cards>.card.edit>img").hide("slide",{},effectSpeed/4,function() {$(this).parent().hide("scale",{},effectSpeed/4);});});
	//matching show is at appendCard()
	
	//contextmenu
	$(".background").mousedown(function() {hideContextMenu();});
}

function setSettings() {
	effect=$("#effectDropDownMenuList").val().toLowerCase();
	name=$("#nameInput").val();
	$("#name").text(name);
	avatar=$("#avatarInput").val();
	$("#avatar").attr("src",avatar);
	effectSpeed=Math.round(getSliderValue($("#effectSpeedSlider"))*2*800);
	var _oldsmall = small;
	small=($("#smallCheckbox").prop("checked"));
	if(small != _oldsmall) {
		if(small) {
			$("#cards>.card").each(function() {$(this).addClass("cardSmall",effectSpeed,function() {});});
			$("#cards>.card").each(function() {$(this).children("img").addClass("cardImageSmall",effectSpeed,function() {});});
			$("#cards>.card").each(function() {$(this).children(".cardImageDark").addClass("cardImageDarkSmall",effectSpeed,function() {});});
			$("#cards>.card").each(function() {$(this).children(".cardText").addClass("cardTextSmall",effectSpeed,function() {});});
			$("#cards>.card").each(function() {$(this).children("form").addClass("cardFormSmall",effectSpeed,function() {});});
		} else {
			$("#cards>.card").each(function() {$(this).removeClass("cardSmall",effectSpeed,function() {});});
			$("#cards>.card").each(function() {$(this).children("img").removeClass("cardImageSmall",effectSpeed,function() {});});
			$("#cards>.card").each(function() {$(this).children(".cardImageDark").removeClass("cardImageDarkSmall",effectSpeed,function() {});});
			$("#cards>.card").each(function() {$(this).children(".cardText").removeClass("cardTextSmall",effectSpeed,function() {});});
			$("#cards>.card").each(function() {$(this).children("form").removeClass("cardFormSmall",effectSpeed,function() {});});
		}
	}
	save();
	/*
		_class="card cardSmall";
		_imgClass="cardImage cardImageSmall";
		_imgDarkClass="cardImageDark cardImageDarkSmall";
		_textClass="cardText cardTextSmall";
		_search="<form class=\"cardForm cardFormSmall\"><input type=\"text\" class=\"textInput cardSearch\" style=\"display:none;\"/></form>";*/
}

function handleDropEvent( event, ui ) {
	$(this).children(".cardImageDark").removeClass("dragHover");
	if($("#dark").css("display")=="none") {
		var dropIn = ui.draggable;
		var drag=new Array(5);
		var drop=new Array(5);
		var dragIndex=-1;
		var dropIndex=-1;
		
		dragIndex=parseInt(dropIn.attr("id").substr(1),10);
		drag[0]=cards[dragIndex][0];
		drag[1]=cards[dragIndex][1];
		drag[2]=cards[dragIndex][2];
		drag[3]=cards[dragIndex][3];
		drag[4]=cards[dragIndex][4];
		
		dropIndex=parseInt($(this).attr("id").substr(1),10);
		drop[0]=cards[dropIndex][0];
		drop[1]=cards[dropIndex][1];
		drop[2]=cards[dropIndex][2];
		drop[3]=cards[dropIndex][3];
		drop[4]=cards[dropIndex][4];
		
		if(drop[2]!="widget:bin" && drop[2]!="widget:edit") {
			//Switch Array
			cards[dragIndex][0]=drop[0];
			cards[dragIndex][1]=drop[1];
			cards[dragIndex][2]=drop[2];
			cards[dragIndex][3]=drop[3];
			cards[dragIndex][4]=drop[4];
		
			cards[dropIndex][0]=drag[0];
			cards[dropIndex][1]=drag[1];
			cards[dropIndex][2]=drag[2];
			cards[dropIndex][3]=drag[3];
			cards[dropIndex][4]=drag[4];
			
			setCard(dragIndex);
			setCard(dropIndex);
		} else if(drop[2]=="widget:bin") {
			removeCard(dragIndex);
		} else if(drop[2]=="widget:edit") {
			toggleAdd(dragIndex);
		}
		save();
	}
}

function setCard(index) {
	$("#c"+index+">.cardText").text(cards[index][0]);
	$("#c"+index+">img").attr("src",cards[index][1]);	
	$("#c"+index).children(".cardImageDark").attr("onclick","launchCard("+index.toString()+",false);");
	$("#c"+index).children(".cardForm").submit(function(e) {e.preventDefault(); launchSearch(index);});
}

function removeCard(index) {
	$("#c"+index.toString()).remove();
	cards.splice(index,1);
	for(var _i=index+1;_i<cards.length;_i++) {
		$("#c"+_i.toString()).attr("id","c"+(_i-1).toString());
		setCard(_i-1);
	}
}

function getSliderValue(element) {
	return (parseInt(element.children(".sliderMarker").css("left"),10) / (parseInt(element.parent().css("width"),10)-32));
}

function calcSliderPosition(element,value) {
	return ((parseInt(element.css("width"),10)-32) * value); 
}

function launchCard(i, newTab) {
	if((Math.abs(parseInt($("#c"+i).css("left"),10))<8 && Math.abs(parseInt($("#c"+i).css("top"),10))<8)  || (($("#c"+i).css("left") == "NaN" || $("#c"+i).css("left")=="auto" || typeof($("#c"+i).css("left")) === "undefined") && ($("#c"+i).css("top") == "NaN" || $("#c"+i).css("top")=="auto" || typeof($("#c"+i).css("top")) === "undefined"))) {
		var id="l"+i.toString();
		var append = "<span id=\""+id+"\" class=\"launch\" style=\"display:none;\"><img class=\"launchImage\" src=\""+cards[i][1]+"\"/><br>"+cards[i][0]+"</span>";
		$("body").append(append);
		if(newTab) {
			$("#"+id).show(effect,{},effectSpeed,function() {window.open(cards[i][2]); $("#"+id).remove();});	
		} else {
			$("#"+id).show(effect,{},effectSpeed,function() {window.location.replace(cards[i][2]); $("#"+id).remove();});
		}
	}
}

function launchSearch(i) {
	var id=("l"+cards[i][0].replace(/ /g,"")).toLowerCase();		
	
	var url = cards[i][3];
	var s = new RegExp(" ", 'g');
	var search = $("#c"+i.toString()).children(".cardForm").children(".cardSearch").val();
	search=search.replace(s, cards[i][4]);
	
	var append = "<span id=\""+id+"\" class=\"launch\" style=\"display:none;\"><img class=\"launchImage\" src=\""+cards[i][1]+"\"/><br>"+cards[i][0]+"</span>";
	$("#cards").append(append);
	$("#"+id).show(effect,{},effectSpeed,function() {window.location.replace(cards[i][3]+search)});
}

function addCard(title, img, url, search, seperator) {
	if(img.indexOf("http://")==-1 && img.indexOf("cards/") & title != "Bin") {
		img="cards/"+img;
	}
	
	//Remove Bin
	if(cards.length>1) {
		removeCard(cards.length-1);
		removeCard(cards.length-1);
	}
	
	var card=new Array(5)
	card[0]=title;
	card[1]=img;
	card[2]=url;
	card[3]=search;
	card[4]=seperator;	
	cards.push(card);
	appendCard(cards.length-1);
	
	var edit=new Array(5);
	edit[0]="Edit";
	edit[1]="edit.png";
	edit[2]="widget:edit";
	edit[3]="";
	edit[4]="";
	cards.push(edit);
	appendCard(cards.length-1);
	
	var bin=new Array(5);
	bin[0]="Bin";
	bin[1]="bin.png";
	bin[2]="widget:bin";
	bin[3]="";
	bin[4]="";
	cards.push(bin);
	appendCard(cards.length-1);
}

function appendCard(index) {
	var append="";
	
	var _class="";
	var _onclick="";
	var _imgClass="";
	var _imgDarkClass="";
	var _textClass="";
	var _id="";
	var _search="";
	if(small) {		
		_class="card cardSmall";
		_imgClass="cardImage cardImageSmall";
		_imgDarkClass="cardImageDark cardImageDarkSmall";
		_textClass="cardText cardTextSmall";
		_search="<form class=\"cardForm cardFormSmall\"><input type=\"text\" class=\"textInput cardSearch\" style=\"display:none;\"/></form>";
	}
	else {		
		_class="card";
		_imgClass="cardImage";
		_imgDarkClass="cardImageDark";
		_textClass="cardText";
		_search="<form class=\"cardForm\"><input type=\"text\" class=\"textInput cardSearch\" style=\"display:none;\"/></form>";
	}
	if(cards[index][2]!="widget:bin" && cards[index][2]!="widget:edit") {
		_onclick="launchCard("+index.toString()+",false);";
	} else {
		_class += " bin";
	}
	
	if((cards[index][4] === undefined || cards[index][4] === null || cards[index][4] == "undefined" || cards[index][4] == "" || cards[index][4] == "NaN"|| cards[index][4] == " ") || (cards[index][3] === undefined || cards[index][3] === null || cards[index][3] == "undefined" || cards[index][3] == "" || cards[index][3] == "NaN" || cards[index][3] == " ")) {
		_search="";
	}
	
	_id="c"+index;
	append="<span class=\""+_class+"\" id=\""+_id+"\" style=\"display:none;\" ><img class=\""+_imgClass+"\" src=\""+cards[index][1]+"\" style=\"display:none;\"/><span onclick=\""+_onclick+"\" class=\""+_imgDarkClass+"\"></span><span class=\""+_textClass+"\">"+cards[index][0]+"</span>"+_search+"</span>";
	$("#cards").append(append);
	
	if(cards[index][2]!="widget:bin" && cards[index][2]!="widget:edit") {
		$("#"+_id).draggable({revert: true});
		$("#"+_id).show("scale",{},effectSpeed,function() { $("#c"+index.toString()+">img").show("slide",{},effectSpeed);});
		$("#"+_id).children(".cardForm").hover(function() {$(this).data("hovered", true); $(this).children(".cardSearch").show("slide",{direction:"down"},effectSpeed/4, function() { if(!$(this).parent().data("hovered")) {$(this).hide("slide",{direction:"down"},effectSpeed/4);}});}, function () {$(this).data("hovered", false); $(this).children(".cardSearch").hide("slide",{direction:"down"},effectSpeed/4);});
		
		var _func = function() {
			$("#cards>.card.bin").show("scale",{},effectSpeed/4,function() {$(this).children("img").show("slide",{},effectSpeed/4, function() {if(!isMouseDown) {$(this).hide("slide",{},effectSpeed/4,function() {$(this).parent().hide("scale",{},effectSpeed/4);});} });});
			$("#cards>.card.edit").show("scale",{},effectSpeed/4,function() {$(this).children("img").show("slide",{},effectSpeed/4, function() {if(!isMouseDown) {$(this).hide("slide",{},effectSpeed/4,function() {$(this).parent().hide("scale",{},effectSpeed/4);});} });});
			};
		$("#"+_id).mousedown(_func);
		//matching hide is at buildPage()
		$("#"+_id).children(".cardForm").submit(function(e) {e.preventDefault(); launchSearch(index);});
		
		$("#"+_id).contextmenu(function(e) {e.preventDefault(); showContextMenu($(this),e);});
	}
	$("#"+_id).droppable({drop: handleDropEvent, over: function() {$(this).children(".cardImageDark").addClass("dragHover");}, out: function() {$(this).children(".cardImageDark").removeClass("dragHover");}});
}

function buildWidgets() {
	
}

function reBuildCards() {
	$("#cards").html("");
	/*for(var i=0;i<cards.length;i++) {		
		appendCard(i);		
	}*/
}

function toggleSettings() {
	$("#effectSpeedSlider").parent().children(".sliderText").text(Math.round(getSliderValue($("#effectSpeedSlider"))*2*800).toString());
	
	$("#dark").toggle("fade",{},effectSpeed);
	$("#settings").toggle(effect,{},effectSpeed);	
	
	$("#effectSpeedSlider").parent().children(".sliderText").text(Math.round(getSliderValue($("#effectSpeedSlider"))*2*800).toString());
}

function prepareSettings() {
	$("#nameInput").val(name);
	$("#avatarInput").val(avatar);
	$("#smallCheckbox").attr("checked",small);
	$("#effectSpeedSlider").children(".sliderMarker").css("left",calcSliderPosition($("#effectSpeedSlider"),effectSpeed/1600));	
	$("#effectDropDownMenuList>option:contains("+effect.substr(1)+")").prop('selected',"selected");
}

function prepareAdd() {
	var _name="";
	var _icon="";
	var _link="";
	var _search="";
	var _searchSeperator="";
	var _addButton="Add";
	if(/^\d+$/.test($("#add").data("editId"))) {
		var _id=parseInt($("#add").data("editId"),10);
		_name=cards[_id][0];
		_icon=cards[_id][1];
		_link=cards[_id][2];
		_search=cards[_id][3];
		_searchSeperator=cards[_id][4];
		_addButton="Set";		
	}
	$("#addNameInput").val(_name);
	$("#addIconInput").val(_icon);
	$("#addLinkInput").val(_link);
	$("#addSearchInput").val(_search);
	$("#addSearchSeperatorInput").val(_searchSeperator);
	$("#addButton").val(_addButton);
}

function toggleAdd(editId) {
	$("#add").data("editId",editId);
	prepareAdd();
	$("#dark").toggle("fade",{},effectSpeed);
	$("#add").toggle(effect,{},effectSpeed);
}

function add() {
	if(!/^\d+$/.test($("#add").data("editId"))) {
		addCard($('#addNameInput').val(), $('#addIconInput').val(), $('#addLinkInput').val(), $('#addSearchInput').val(), $('#addSearchSeperatorInput').val());
	} else {
		var _id=parseInt($("#add").data("editId"),10);
		cards[_id][0]=$('#addNameInput').val();
		cards[_id][1]=$('#addIconInput').val();
		cards[_id][2]=$('#addLinkInput').val();
		cards[_id][3]=$('#addSearchInput').val();
		cards[_id][4]=$('#addSearchSeperatorInput').val();
		setCard(_id);
	}
	save();
	toggleAdd('');
}

function save() {
	localStorage.clear();
	localStorage.setItem("effect",effect);
	localStorage.setItem("effectSpeed",effectSpeed.toString());
	localStorage.setItem("small",small.toString());
	localStorage.setItem("name",name.toString());
	localStorage.setItem("avatar",avatar.toString());
	
	for(var _i =0;_i<cards.length-2;_i++) {
		localStorage.setItem("cards_"+_i+"_0",cards[_i][0]);
		localStorage.setItem("cards_"+_i+"_1",cards[_i][1]);
		localStorage.setItem("cards_"+_i+"_2",cards[_i][2]);
		localStorage.setItem("cards_"+_i+"_3",cards[_i][3]);
		localStorage.setItem("cards_"+_i+"_4",cards[_i][4]);
	}
}

function load() {
	if(localStorage.getItem("name")!==null) {
		effect=localStorage.getItem("effect");
		effectSpeed=parseInt(localStorage.getItem("effectSpeed"),10);
		small = localStorage.getItem("small") == 'true';
		name=localStorage.getItem("name");
		avatar=localStorage.getItem("avatar");
		
		var _i=0;
		while (localStorage.getItem("cards_"+_i+"_0") !== null) {
			var title="";
			var url="";
			var img="";
			var search="";
			var seperator="";
			
			title = localStorage.getItem("cards_"+_i+"_0");
			url = localStorage.getItem("cards_"+_i+"_1");
			img = localStorage.getItem("cards_"+_i+"_2");
			search = localStorage.getItem("cards_"+_i+"_3");
			seperator = localStorage.getItem("cards_"+_i+"_4");
			
			addCard(title,url,img,search,seperator);
			_i++;			
		}
		prepareSettings();
		
	} else {
		rebuild();
	}
}

function rebuild() {
	cards=new Array();
	name="User";
	avatar="defaultavatar.png";
	small=false;
	effect="slide";
	effectSpeed=800;
	
	$("#cards").html("");
	addCard("Google","google.png","http://www.google.com","https://www.google.com/search?q=","+");
	addCard("Chrome Web Store","chromewebstore.png","https://chrome.google.com/webstore","https://chrome.google.com/webstore/search/","%20");
	addCard("YouTube","youtube.png","http://www.youtube.com","http://www.youtube.com/results?search_query=","+");
	addCard("Facebook","facebook.png","http://www.facebook.com","https://www.facebook.com/search/results.php?q=","%20");
	addCard("Twitter","twitter.png","http://www.twitter.com","https://twitter.com/search?q=","%20");
		
	prepareSettings();
}

function showContextMenu(element, e) {
	hideContextMenu();
	
	var _id=element.attr("id").substr(1);
	var _ctxId="cm"+_id.toString();
	var _append="<ul style=\"display:none;\" class=\"card contextMenuList\" id=\""+_ctxId+"\" ><li class=\"contextMenuListEntry\" onclick=\"launchCard("+_id.toString()+",true);hideContextMenu();\">Open in new tab</li><li class=\"contextMenuListEntry\" onclick=\"toggleAdd("+_id.toString()+");hideContextMenu();\">Edit</li><li class=\"contextMenuListEntry\" onclick=\"removeCard("+_id.toString()+");hideContextMenu();\">Delete</li></ul>";
	
	$("body").append(_append);
	$("#"+_ctxId).css("left",e.pageX);
	$("#"+_ctxId).css("top",e.pageY);
	$("#"+_ctxId).show("slide",{direction:"up"},effectSpeed/4);
}

function hideContextMenu() {
	$(".contextMenuList").each(function () {$(this).hide("slide",{direction:"up"},effectSpeed/4,function() {$(this).remove();})});
}