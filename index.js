'use strict'

const xmlParser = require('./src/xml-parser');
const fs = require('fs');

const xmlToJson = (path) => {
	const fileContent = fs.readFileSync(path, 'utf-8');
	const cleanFileContent = fileContent.replace(/>\s+?</g,'><'); // we remove unneeded whitespace
	let root_node = '';
	try {
		root_node = xmlParser.parseString(cleanFileContent, null);
		return JSON.stringify(xmlNodeToObject(root_node));
	} catch(err) {
		return err.message;
	}
}

const xmlNodeToObject = (xmlNode) => {
	let obj = {};
	const key = xmlNode.elementName;
	if(xmlNode.children.length === 0) {
		obj[key] = xmlNode.value;
		return obj;
	}
	obj[key] = {};
	xmlNode.children.forEach((node) => {
		Object.assign(obj[key], xmlNodeToObject(node))
	})
	return obj;
}

module.exports = {
	xmlToJson
};
