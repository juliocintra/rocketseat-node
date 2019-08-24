const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    fs
        .readdirSync(__dirname)
        .filter(file => ((file.indexOf('.')) !== 0 && (file !== 'index.js')))   // lista os diretorios que não começam com '.' ou 'index.js'
        .forEach(file => require(path.resolve(__dirname, file))(app))           // depois de filtrador é passado o app
};