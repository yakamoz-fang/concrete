!function(a,b){"use strict";function c(a,c){var e=this;c=b.extend({mode:"menu",uploadElement:"body",bulkParameterName:"fID"},c),e.options=c,e._templateFileProgress=_.template('<div id="ccm-file-upload-progress" class="ccm-ui"><div id="ccm-file-upload-progress-bar"><div class="progress progress-striped active"><div class="progress-bar" style="width: <%=progress%>%;"></div></div></div></div>'),e._templateSearchResultsMenu=_.template(d.get()),ConcreteAjaxSearch.call(e,a,c),e.setupFileDownloads(),e.setupFileUploads(),e.setupEvents(),"menu"===c.mode&&b('.ccm-search-bulk-action option[value="choose"]').remove()}c.prototype=Object.create(ConcreteAjaxSearch.prototype),c.prototype.setupFileDownloads=function(){var a=this;b("#ccm-file-manager-download-target").length?a.$downloadTarget=b("#ccm-file-manager-download-target"):a.$downloadTarget=b("<iframe />",{name:"ccm-file-manager-download-target",id:"ccm-file-manager-download-target"}).appendTo(document.body)},c.prototype.setupFileUploads=function(){var a=this,c=b(".ccm-file-manager-upload"),d=c.filter("#ccm-file-manager-upload-prompt"),e=[],f=[],g=_.template("<ul><% _(errors).each(function(error) { %><li><strong><%- error.name %></strong><p><%- error.error %></p></li><% }) %></ul>"),h={url:CCM_DISPATCHER_FILENAME+"/ccm/system/file/upload",dataType:"json",formData:{ccm_token:CCM_SECURITY_TOKEN},error:function(a){var b=a.responseText;try{b=jQuery.parseJSON(b).errors;var c=this.files[0].name;_(b).each(function(a){e.push({name:c,error:a})})}catch(d){}},progressall:function(c,d){var e=parseInt(d.loaded/d.total*100,10);b("#ccm-file-upload-progress-wrapper").html(a._templateFileProgress({progress:e}))},start:function(){e=[],b("<div />",{id:"ccm-file-upload-progress-wrapper"}).html(a._templateFileProgress({progress:100})).appendTo(document.body),b.fn.dialog.open({title:ccmi18n_filemanager.uploadProgress,width:400,height:50,onClose:function(a){a.jqdialog("destroy").remove()},element:b("#ccm-file-upload-progress-wrapper"),modal:!0})},done:function(a,b){f.push(b.result[0])},stop:function(){jQuery.fn.dialog.closeTop(),e.length?ConcreteAlert.dialog(ccmi18n_filemanager.uploadFailed,g({errors:e})):(a._launchUploadCompleteDialog(f),f=[])}};d=d.length?d:c.first(),d.fileupload(h)},c.prototype._launchUploadCompleteDialog=function(a){var b=this;c.launchUploadCompleteDialog(a,b)},c.prototype.setupEvents=function(){var a=this;ConcreteEvent.unsubscribe("FileManagerAddFilesComplete"),ConcreteEvent.subscribe("FileManagerAddFilesComplete",function(b,c){a._launchUploadCompleteDialog(c.files)}),ConcreteEvent.unsubscribe("FileManagerDeleteFilesComplete"),ConcreteEvent.subscribe("FileManagerDeleteFilesComplete",function(b,c){a.refreshResults()})},c.prototype.setupStarredResults=function(){var a=this;a.$element.unbind(".concreteFileManagerStar").on("click.concreteFileManagerStar","a[data-search-toggle=star]",function(){var c=b(this),d={fID:b(this).attr("data-search-toggle-file-id")};return a.ajaxUpdate(c.attr("data-search-toggle-url"),d,function(a){a.star?c.parent().addClass("ccm-file-manager-search-results-star-active"):c.parent().removeClass("ccm-file-manager-search-results-star-active")}),!1})},c.prototype.updateResults=function(a){var c=this;ConcreteAjaxSearch.prototype.updateResults.call(c,a),c.setupStarredResults(),"choose"==c.options.mode&&(c.$element.unbind(".concreteFileManagerHoverFile"),c.$element.on("mouseover.concreteFileManagerHoverFile","tr[data-file-manager-file]",function(){b(this).addClass("ccm-search-select-hover")}),c.$element.on("mouseout.concreteFileManagerHoverFile","tr[data-file-manager-file]",function(){b(this).removeClass("ccm-search-select-hover")}),c.$element.unbind(".concreteFileManagerChooseFile").on("click.concreteFileManagerChooseFile","tr[data-file-manager-file]",function(a){return"checkbox"!==b(a.target).prop("type")?(ConcreteEvent.publish("FileManagerBeforeSelectFile",{fID:b(this).attr("data-file-manager-file")}),ConcreteEvent.publish("FileManagerSelectFile",{fID:b(this).attr("data-file-manager-file")}),c.$downloadTarget.remove(),!1):void 0}))},c.prototype.handleSelectedBulkAction=function(a,c,d,e){var f=this,g=[];if(b.each(e,function(a,c){g.push({name:"item[]",value:b(c).val()})}),"choose"==a){var h=g.map(function(a){return a.value});ConcreteEvent.publish("FileManagerBeforeSelectFile",{fID:h}),ConcreteEvent.publish("FileManagerSelectFile",{fID:h})}else"download"==a?f.$downloadTarget.get(0).src=CCM_TOOLS_PATH+"/files/download?"+jQuery.param(g):ConcreteAjaxSearch.prototype.handleSelectedBulkAction.call(this,a,c,d,e)},ConcreteAjaxSearch.prototype.createMenu=function(a){var c=this;a.concreteFileMenu({container:c,menu:b("[data-search-menu="+a.attr("data-launch-search-menu")+"]")})},c.launchDialog=function(a,c){var d,e=b(window).width()-53,f={},g={filters:[],multipleSelection:!1};if(b.extend(g,c),g.filters.length>0)for(f["field[]"]=[],d=0;d<g.filters.length;d++){var h=b.extend(!0,{},g.filters[d]);f["field[]"].push(h.field),delete h.field,b.extend(f,h)}b.fn.dialog.open({width:e,height:"100%",href:CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/file/search",modal:!0,data:f,title:ccmi18n_filemanager.title,onOpen:function(c){ConcreteEvent.unsubscribe("FileManagerSelectFile"),ConcreteEvent.subscribe("FileManagerSelectFile",function(c,d){var e="[object Array]"===Object.prototype.toString.call(d.fID);if(g.multipleSelection&&!e)d.fID=[d.fID];else if(!g.multipleSelection&&e){if(d.fID.length>1)return b(".ccm-search-bulk-action option:first-child").prop("selected","selected"),void alert(ccmi18n_filemanager.chosenTooMany);d.fID=d.fID[0]}jQuery.fn.dialog.closeTop(),a(d)})}})},c.launchUploadCompleteDialog=function(a,c){if(a&&a.length&&a.length>0){var d="";_.each(a,function(a){d+="fID[]="+a.fID+"&"}),d=d.substring(0,d.length-1),b.fn.dialog.open({width:"660",height:"500",href:CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/file/upload_complete",modal:!0,data:d,onClose:function(){var a={filemanager:c};ConcreteEvent.publish("FileManagerUploadCompleteDialogClose",a)},onOpen:function(){var a={filemanager:c};ConcreteEvent.publish("FileManagerUploadCompleteDialogOpen",a)},title:ccmi18n_filemanager.uploadComplete})}},c.getFileDetails=function(a,c){b.ajax({type:"post",dataType:"json",url:CCM_DISPATCHER_FILENAME+"/ccm/system/file/get_json",data:{fID:a},error:function(a){ConcreteAlert.dialog("Error",a.responseText)},success:function(a){c(a)}})};var d={get:function(){return'<div class="ccm-ui"><div class="ccm-popover-file-menu popover fade" data-search-file-menu="<%=item.fID%>" data-search-menu="<%=item.fID%>"><div class="arrow"></div><div class="popover-inner"><ul class="dropdown-menu"><% if (typeof(displayClear) != \'undefined\' && displayClear) { %><li><a href="#" data-file-manager-action="clear">'+ccmi18n_filemanager.clear+'</a></li><li class="divider"></li><% } %><% if (item.canViewFile && item.canRead) { %><li><a class="dialog-launch" dialog-modal="false" dialog-append-buttons="true" dialog-width="90%" dialog-height="75%" dialog-title="'+ccmi18n_filemanager.view+'" href="'+CCM_TOOLS_PATH+'/files/view?fID=<%=item.fID%>">'+ccmi18n_filemanager.view+"</a></li><% } %><% if (item.canRead) { %><li><a href=\"#\" onclick=\"window.frames['ccm-file-manager-download-target'].location='"+CCM_TOOLS_PATH+"/files/download?fID=<%=item.fID%>'; return false\">"+ccmi18n_filemanager.download+'</a></li><% } %><% if (item.canEditFile && item.canEditFileContents) { %><li><a class="dialog-launch" dialog-modal="true" dialog-width="90%" dialog-height="70%" dialog-title="'+ccmi18n_filemanager.edit+'" href="'+CCM_TOOLS_PATH+'/files/edit?fID=<%=item.fID%>">'+ccmi18n_filemanager.edit+'</a></li><% } %><li><a class="dialog-launch" dialog-modal="true" dialog-width="850" dialog-height="450" dialog-title="'+ccmi18n_filemanager.properties+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/file/properties?fID=<%=item.fID%>">'+ccmi18n_filemanager.properties+'</a></li><% if (item.canReplaceFile) { %><li><a class="dialog-launch" dialog-modal="true" dialog-width="500" dialog-height="200" dialog-title="'+ccmi18n_filemanager.replace+'" href="'+CCM_TOOLS_PATH+'/files/replace?fID=<%=item.fID%>">'+ccmi18n_filemanager.replace+'</a></li><% } %><% if (item.canCopyFile) { %><li><a href="#" data-file-manager-action="duplicate">'+ccmi18n_filemanager.duplicate+'</a></li><% } %><li><a class="dialog-launch" dialog-modal="true" dialog-width="500" dialog-height="400" dialog-title="'+ccmi18n_filemanager.sets+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/file/sets?fID=<%=item.fID%>">'+ccmi18n_filemanager.sets+'</a></li><% if (item.canDeleteFile || item.canEditFilePermissions) { %><li class="divider"></li><% } %><% if (item.canEditFilePermissions) { %><li><a class="dialog-launch" dialog-modal="true" dialog-width="520" dialog-height="450" dialog-title="'+ccmi18n_filemanager.permissions+'" href="'+CCM_TOOLS_PATH+'/files/permissions?fID=<%=item.fID%>">'+ccmi18n_filemanager.permissions+'</a></li><% } %><% if (item.canDeleteFile) { %><li><a class="dialog-launch" dialog-modal="true" dialog-width="500" dialog-height="200" dialog-title="'+ccmi18n_filemanager.deleteFile+'" href="'+CCM_TOOLS_PATH+'/files/delete?fID=<%=item.fID%>">'+ccmi18n_filemanager.deleteFile+"</a></li><% } %></ul></div></div>"}};b.fn.concreteFileManager=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcreteFileManager=c,a.ConcreteFileManagerMenu=d}(window,$),!function(a,b){"use strict";function c(a,c){var d=this,c=b.extend({chooseText:ccmi18n_filemanager.chooseNew,inputName:"concreteFile",fID:!1,filters:[]},c),e={};e.filters=c.filters,d.$element=a,d.options=c,d._chooseTemplate=_.template(d.chooseTemplate,{options:d.options}),d._loadingTemplate=_.template(d.loadingTemplate),d._fileLoadedTemplate=_.template(d.fileLoadedTemplate),d._fileMenuTemplate=_.template(ConcreteFileManagerMenu.get()),d.$element.append(d._chooseTemplate),d.$element.on("click","div.ccm-file-selector-choose-new",function(){return ConcreteFileManager.launchDialog(function(a){d.loadFile(a.fID)},e),!1}),d.options.fID&&d.loadFile(d.options.fID)}c.prototype={chooseTemplate:'<div class="ccm-file-selector-choose-new"><input type="hidden" name="<%=options.inputName%>" value="0" /><%=options.chooseText%></div>',loadingTemplate:'<div class="ccm-file-selector-loading"><img src="'+CCM_IMAGE_PATH+'/throbber_white_16.gif" /></div>',fileLoadedTemplate:'<div class="ccm-file-selector-file-selected"><input type="hidden" name="<%=inputName%>" value="<%=file.fID%>" /><div class="ccm-file-selector-file-selected-thumbnail"><%=file.resultsThumbnailImg%></div><div class="ccm-file-selector-file-selected-title"><div><%=file.title%></div></div><div class="clearfix"></div></div>',loadFile:function(a){var c=this;c.$element.html(c._loadingTemplate),ConcreteFileManager.getFileDetails(a,function(a){var d=a.files[0];c.$element.html(c._fileLoadedTemplate({inputName:c.options.inputName,file:d})),c.$element.append(c._fileMenuTemplate({displayClear:!0,item:d})),c.$element.find(".ccm-file-selector-file-selected").concreteFileMenu({container:c,menu:b("[data-search-file-menu="+d.fID+"]"),menuLauncherHoverClass:"ccm-file-manager-menu-item-hover"})})}},b.fn.concreteFileSelector=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcreteFileSelector=c}(this,$),!function(a,b,c){"use strict";function d(a,c){var d=this,c=c||{};c=b.extend({container:!1},c),ConcreteMenu.call(d,a,c)}d.prototype=Object.create(ConcreteMenu.prototype),d.prototype.setupMenuOptions=function(a){var d=this,e=ConcreteMenu.prototype,f=a.attr("data-search-file-menu"),g=d.options.container;e.setupMenuOptions(a),a.find("a[data-file-manager-action=clear]").on("click",function(){var a=ConcreteMenuManager.getActiveMenu();return a&&a.hide(),c.defer(function(){g.$element.html(g._chooseTemplate)}),!1}),a.find("a[data-file-manager-action=duplicate]").on("click",function(){return b.concreteAjax({url:CCM_DISPATCHER_FILENAME+"/ccm/system/file/duplicate",data:{fID:f},success:function(a){"undefined"!=typeof g.refreshResults&&g.refreshResults()}}),!1})},b.fn.concreteFileMenu=function(a){return b.each(b(this),function(c,e){new d(b(this),a)})},a.ConcreteFileMenu=d}(this,$,_);