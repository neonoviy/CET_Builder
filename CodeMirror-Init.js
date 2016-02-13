var ceditor = [];
function initCode() {
$('#cet_bcontainer .cetcode, #cet_bcontainer .comment, #cet_bcontainer .cetnorte').each(function(ci, ce) {
    if ($(this).data('CodeMirrorInstance')) {
            ceditor[ci].toTextArea();
        }
    ceditor[ci] = CodeMirror.fromTextArea(ce, {
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        mode: "htmlmixed",
        lineWrapping: true,
					theme: "ambiance",
    }); $(this).data('CodeMirrorInstance', ceditor);
        ceditor[ci].on("change", function(codeMirror) {
            codeMirror.save();
							content2ta();
        });
    });
} //end initCode