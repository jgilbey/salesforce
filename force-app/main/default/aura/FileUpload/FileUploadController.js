({
    handleUploadFinished: function (cmp, event) {
        
        //files uploaded
        var uploadedFiles = event.getParam("files");
        uploadedFiles.forEach(file => console.log(file.name));
        
        //success toast
        var title = $A.get("$Label.c.Success");
        var msg = $A.get("$Label.c.FileUploadComplete");
        
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type": "success",
            "title": title,
            "message": msg
        });
        toastEvent.fire();

        
    },
    
    
})