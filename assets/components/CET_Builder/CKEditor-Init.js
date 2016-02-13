var editor = [];
var leditor = [];
var feditor = [];
function initRTE() {
	$.each(CKEDITOR.instances, function(_, instance) {
		instance.destroy();
	});
	$('[[light_rte_fields]]').each(function(i, e) {
		leditor[i] = CKEDITOR.[[rtemode]]($(this).attr("id"), {
			customConfig: "[[LightCKEditorConfig]]",
			[[LightCKEditorProps]]
		});
	});
	
	$('[[full_rte_fields]]').each(function(i, e) {
			feditor[i] = CKEDITOR.[[rtemode]]($(this).attr("id"), {
				customConfig: "[[FullCKEditorConfig]]",
				[[FullCKEditorProps]]
				[[addbootstrapcss]]
			});
	});
	var $set = $("#cet_bcontainer .rte");
	var len = $set.length;
	$set.each(function(i, e) {
			editor[i] = CKEDITOR.[[rtemode]]($(this).attr("id"), {
				customConfig: "[[FullCKEditorConfig]]",
				[[FullCKEditorProps]]
				[[sticky_toolbar]]
				[[addbootstrapcss]]
			});
			editor[i].on("change", function() {
				content2ta();
			}); 
			editor[i].on("focus", function() {
				$("#cet_selector").removeClass();
				$("#cet_selector").addClass("cet_rte");
				$("#cet_selector").val($(this).attr("name"));
				});
			if (i == len - 1) {
			editor[i].on("dataReady", function() {
				$("#cet_codetab").removeAttr("disabled");
				console.log("ready");
				}); 
     	}
	});
	
		CKEDITOR.on('instanceReady', function (ev) {
		        ev.editor.setKeystroke(CKEDITOR.CTRL + 83, 'save');
		    });
		CKEDITOR.plugins.registered['save'] = {
		      init: function (editor) {
		         var command = editor.addCommand('save',
		         {
		              modes: { wysiwyg: 1, source: 1 },
		              exec: function (editor) {
		          	    $("#modx-abtn-save").click();
		              }
		         });
	//	         editor.ui.addButton('Save', { label: 'Save', command: 'save' });
		      }
		  }
	
} //end initRTE
		
//modx browser call
CKEDITOR.on("dialogDefinition", function(event) {
	var editor = event.editor;
	var dialogDefinition = event.data.definition;
	var dialogName = event.data.name;

	var cleanUpFuncRef = CKEDITOR.tools.addFunction(function() {
		// Do the clean-up of filemanager here (called when an image was selected or cancel was clicked)
		$("#fm-iframe").remove();
		$("body").css("overflow-y", "scroll");
	});

	var tabCount = dialogDefinition.contents.length;
	for (var i = 0; i < tabCount; i++) {
		var browseButton = dialogDefinition.contents[i].get("browse");

		if (browseButton !== null) {
			browseButton.hidden = false;
			browseButton.onClick = function(dialog, i) {
				obj = this;
				//console.log(obj);
				var tab = obj.filebrowser.target;
				tab = tab.split(":");
				var path = obj.getDialog().getContentElement(tab[0], tab[1]).getValue();
				//console.log(path);
				browser2(obj, tab, path, function(obj, tab, results) {
					//where to place the link
					obj.getDialog().getContentElement(tab[0], tab[1]).setValue(results);
				});
			}
		}
	}
}); // dialogDefinition
			
function browser2(obj, tab, path, callback) {
    var path = path.substring(0, path.lastIndexOf("/") + 1);
    //Its a kind of magic
    var w = MODx.load({
        xtype: "modx-browser",
        multiple: true
            //If there is no path, use default
            ,
        openTo: path || "[[default_path]]",
        listeners: {
            "select": {
                fn: function(data) {
                    console.log(obj, data.relativeUrl);
                    // return data.relativeUrl;
                    callback(obj, tab, "/" + data.relativeUrl);
                    MODx.fireEvent("select", data);
                },
                scope: this
            }
        }
    });
    w.show();
}

function StickyToolbar() {
	$("#modx-content .x-panel-body").on("scroll", function(e) {
	  if ($("#modx-resource-content").offset().top < 55) {
			$("#cet_modepanel").addClass("fix-modepanel");
	  } else {
			$("#cet_modepanel").removeClass("fix-modepanel");
	  }
	});
}