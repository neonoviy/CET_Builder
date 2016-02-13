function buildblock(type, insert, id, el) {
    var blockstart = "<div class=\"cetpanel\"><span class=\"cetbutton cetremove\">×</span><span class=\"cetbutton cethandle\">↕︎</span>\n";
    var blockend = "</div>\n";
    block = "";
    if (!el) {
    	//its new
    		var last = $("#cet_bcontainer textarea.cetta:last").attr("id");
    		if (last == undefined) {
    			var last = 0
    		}
    		var id = last
    		id++
    		insert = "";
    		switch (type) {
    			case "code":
    				block = blockstart + "<textarea id=\"" + id + "\" class=\"cetta cetcode\">" + insert + "</textarea>" + blockend;
    			break;
    			case "rte":
    				block = blockstart + "<textarea id=\"" + id + "\" class=\"cetta rte\">" + insert + "</textarea>" + blockend;
    			break;
    		}//end switch
    		$("#cet_bcontainer").append(block);
    		initRTE();
    		initCode();
    		content2ta();
    		$('#modx-content .x-panel-body').animate({
    		            scrollTop: $("#modx-resource-content").height()
    		        }, 100);
    }else {
    	//it exist
    	if (el.nodeName == "#text") {
    	    if (!el.data.replace(/[\t\n]+/g, '')) {
    	    		return "\n";
    	    }
    	  }
    	var starttag = "";
    	var endtag = "";
    	prev = element(el.previousSibling, "prev");
    	next = element(el.nextSibling, "next");
    	
    	switch (type) {
    		case "code":
    		case "script":
    		case "comment":
    		case "norte":
    			if (prev  == "element" || prev  == "nothing" && prev != "nl") {
//    			console.log(prev);
    			    starttag = blockstart + "<textarea id=\"" + id + "\" class=\"cetta cetcode\">";
    			}
//    			console.log(next);
    			if (next  == "element" || next  == "nothing" && next != "nl" ) {
    			    endtag = "</textarea>" + blockend;
    			}
    		break;
    		case "rte":
    		
//    			console.log(prev);
    			if (prev != "element" || prev  == "nothing" && prev != "nl") {
    			    starttag = blockstart + "<textarea id=\"" + id + "\" class=\"cetta rte\">";
    			}
//    			console.log(next);
    			if (next != "element" || next  == "nothing" && next != "nl") {
    			    endtag = "</textarea>" + blockend;
    			}
    		break;
    		
    	}
    	block = starttag + insert + endtag;
//    	console.log(block);
    	return block;
    }//end switch

} //end buildblick

function element(el, dir) {
    //check if el is element
    if (el) {
        //it may be element
        if (el.nodeName == "#text") {
            if (!el.data.replace(/[\t\n]+/g, '')) {
                //it is new line, lets check sibling
                if (dir == "next") {
                    return element(el.nextSibling);
                } else {
                    return element(el.previousSibling);
                }
            } else {
                //it is code
                return "code";
            }
        } else if (el.nodeName == "#comment" || el.nodeName == "SCRIPT" || $(el).hasClass('cetnorte')) {
            //can't touch this
            return "comment or norte";
        } else {
            //its element
            return "element";
        }
    } else {
        //its nothing
        return "nothing";
    }
} //end element
    
    
function ta2container(callback) {
    //        parse textarea value to bcontainer
    if ($("#cet_bcontainer").length) {
        $("#cet_bcontainer").empty();
    }
    var $tacontent = $("#ta").val();
    var i = 0;
    html = $.parseHTML($tacontent, document, true)
//		    console.log(html);
    var output = '';
    //if no val?
    if (html) {
    $.each(html, function(i, el) {
        switch (el.nodeName) {
            case "#text":
                output = output + buildblock("code", el.data, i, el);
                break;
            case "SCRIPT":
            		output = output + buildblock("script", el.outerHTML, i, el);
            		break;
            case "#comment":
                output = output + buildblock("comment", el.data, i, el);
                break;
            default:
                if ($(el).hasClass('cetnorte')) {
                    output = output + buildblock("norte", el.outerHTML, i, el);
                } else {
                    output = output + buildblock("rte", el.outerHTML, i, el);
                }
                break;
        } //end switch
    }); //end each
    }
    $("#cet_bcontainer").append(output);
    callback();
}

function content2ta() {
    //        parse bcontainer html to textarea reverse to ta2container
    var $input = "";
    $("#cet_bcontainer").children().children().each(function() {
            if (!$(this).hasClass("cetbutton")) {
                if ($(this).hasClass("rte")) {
                    //this is rte
//                    if(typeof tinyMCE != 'undefined'){
//                    	data = tinyMCE.get($(this).attr('id')).getContent();
//                    }else {
//                    	data = CKEDITOR.instances[$(this).attr('id')].getData();
//                    }
										data = CKEDITOR.instances[$(this).attr('id')].getData();
                    $input = $input + data + "\n";
                } else {
                    if ($(this).hasClass("comment")) {
                        //this is comment
                        $input = $input + $(this).val() + "\n";
                    } else {
                        //this is code
                        $input = $input + $(this).val();
                    }
                } //end this != rte
            }
        }) //end each
        //console.log($input);
    $("#ta").val($input);
} //end content2ta

function showTa() {
//		if(typeof(tinyMCE) !== 'undefined') {
//		  var length = tinyMCE.editors.length;
//		  for (var i=length; i>0; i--) {
//		    tinyMCE.editors[i-1].remove();
//		  };
//		}else{
//		$.each(CKEDITOR.instances, function(_, instance) {
//		    instance.destroy();
//		});
//		}
		$.each(CKEDITOR.instances, function(_, instance) {
		    instance.destroy();
		});
    $("#cet_bcontainer").sortable("destroy"); //call widget-function destroy
    $("#cet_bcontainer *").removeClass('ui-state-default');
    $("#cet_bcontainer *").remove();
    $("#cet_bcontainer").remove();
    var ta = CodeMirror.fromTextArea(document.getElementById("ta"), {
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        mode: "htmlmixed",
        lineWrapping: true,
        theme: "ambiance",
    });
    $("#ta").data('CodeMirrorInstance', ta);
    ta.on("change", function(codeMirror) {
        codeMirror.save()
    });
}//end showTa

function showBuilder() {
		$('#cet_codetab').click(false);
    if ($("#ta").data('CodeMirrorInstance')) {
        $("#ta").data('CodeMirrorInstance').toTextArea();
    }
    if (!bcontainer) {
    	var bcontainer = $("<div id=\"cet_bcontainer\">");
    }
    
    $("#cet_builder").prepend(bcontainer);

    ta2container(function(callback) {
        initRTE();
        initCode();
    });

    $("#cet_bcontainer").on('click', '.cetremove', function() {
        if (confirm("Delete?")) {
            $(this).parent().remove();
            content2ta();
        }
    });
		$('#cet_bcontainer').sortable({
		    items: ".cetpanel",
		    stop: function(event, ui) {
		        content2ta();
		        initRTE();
		    },
		    handle: '.cethandle',
		    delay: 150,
		    distance: 5,
		});
}//end showBuilder

function init() {
    var builder = $("<div id=\"cet_builder\" ></div>");
    var builderaddpanel = $("<div id=\"cet_addpanel\" >");
    var toolbar = $("<div id=\"cet_stikytoolbar\" >");
    
    var buildermodepanel = $("<div id=\"cet_modepanel\">");
    var bcontainer = $("<div id=\"cet_bcontainer\">");
    var cetaddrtebtn = $("<span id=\"cet_addrte\" class=\"cet_add\">+ RTE</span> ");
    var cetaddcodebtn = $("<span id=\"cet_addcode\" class=\"cet_add\">+ Code</span> ");
    
    var atvselector = $("<textarea id=\"cet_selector\" class=\"cet_rte\">0</textarea> ");
		
		var cettabs = $("<div id=\"cet_tabs\" ></div>");
    var cetbuildertab = $("<button id=\"cet_buildertab\" class=\"cet_tab cet_active\" disabled>Builder</button>");
    var cetcodetab = $("<button id=\"cet_codetab\" class=\"cet_tab\" disabled>Code</button>");

    var cetshowta = $("<button onclick=\"javascript: $('#ta').toggle(); \" class=\"cet_tab\" >ta</button>");
    var cetrefresh = $("<span onclick=\"javascript: ta2container(function (callback){ initRTE();	initCode();	}); \" class=\"cet_tab\">refresh</span>");

    $("#modx-resource-content").append(builder);
    $("#cet_builder").append(builderaddpanel);
    $("#cet_addpanel").append(cetaddrtebtn);
    $("#cet_addpanel").append(cetaddcodebtn);
    $("#cet_addpanel").append(atvselector);

    $("#modx-resource-content").prepend(buildermodepanel);

    $("#cet_modepanel").append(cettabs);
    cetbuildertab.appendTo($("#cet_tabs"));
    cetcodetab.appendTo($("#cet_tabs"));

    toolbar.appendTo($("#cet_modepanel"));
    //$("#cet_modepanel").append(cetrefresh);
//    $("#cet_modepanel").append(cetshowta);
    
    $("#cet_codetab:not(disabled)").click(function() {
        showTa();
        $("#cet_modepanel button").removeClass("cet_active");
        $("#cet_buildertab").removeAttr("disabled");
        $(this).addClass("cet_active");
        $("#cet_codetab").prop('disabled', true);
        $('#modx-content .x-panel-body').animate({
                    scrollTop: $("#modx-resource-content").offset().top-55
                }, 200);
    });

    $("#cet_buildertab:not(disabled)").click(function() {
        showBuilder();
        $("#cet_modepanel button").removeClass("cet_active");
        $(this).addClass("cet_active");
        $(this).prop('disabled', true);
        $("#cet_codetab").prop('disabled', true);
    });

    $("#cet_addrte").click(function() {
        buildblock('rte');
    });

    $("#cet_addcode").click(function() {
        buildblock('code');
    });
    showBuilder();



}