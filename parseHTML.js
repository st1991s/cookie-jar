function parseHTML(data, context, keepScripts) {
    if(!data || typeof data !== "string"){
        return null;
    }
    if(typeof context === "boolean"){
        keepScripts = context;
        context = false;
    }
    context = context || document;
}