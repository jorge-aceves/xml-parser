'use strict'

const xmlParser = require('./src/xml-parser');
const fs = require('fs');

const xmlToJson = (path) => {
	const fileContent = fs.readFileSync(path, 'utf-8');
	const cleanFileContent = fileContent.replace(/>\s+?</g,'><'); // we remove unneeded whitespace
	let root_node = '';
	root_node = xmlParser.parseString(cleanFileContent, null);
	return JSON.stringify(xmlParser.xmlNodeToObject(root_node));
}

module.exports = {
	xmlToJson
};
