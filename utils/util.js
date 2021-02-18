function templateStr(template, attributes) {
    for(var prop in attributes) {
        if(attributes.hasOwnProperty(prop)) {
            template = template.replace('{{' + prop + '}}', attributes[prop]); 
        }
    }

    return template;
}