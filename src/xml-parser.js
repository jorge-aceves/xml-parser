'use strict'
const { XMLNode } = require('./xml-node')

const parseString = (xmlString) => {
	let node = new XMLNode('dummy');
	parse(xmlString, node)
	if(node.children.length == 0) throw new XMLException('MalformedXML', 'There is no XML to parse');
	if(node.children.length > 1) throw new XMLException('MalformedXML', 'XML file has more than one root element');
	return node.children[0];
}

// Returns an XMLNode with the root of the XML 
const parse = (xmlString, parent) => {
	let stringEnd = 0;
	let stringStart = 0;
	let start = 0; 
	do {
		let chunk = xmlString.substring(stringStart, xmlString.length);
		let openTag = chunk.match(/<(.+?)>/);
		if(!openTag) return chunk;
		let elementName = openTag[1]
		let closingTag = chunk.match(`<\/${elementName}>`);
		if(!closingTag) throw new XMLException('TagException', 'Closing tag is missing');
		start = openTag.index + openTag[0].length;
		let end = closingTag.index;
		stringEnd = end + closingTag[0].length;
		let node = new XMLNode(elementName);
		let result = parse(chunk.substring(start, end), node);
		if(typeof(result) === 'string'){
			node.value = result;
		}
		parent.children.push(node);
		stringStart += stringEnd;
	} while(stringEnd != xmlString.length);
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
		let child = xmlNodeToObject(node);
		let childKeys = Object.keys(child);
		if(childKeys.some((ck) => obj[key][ck])){
			throw new XMLException('DuplicateException', 'Element is repeated')
		}
		Object.assign(obj[key], child);
	})
	return obj;
}

class XMLException {
	constructor(name, message){
		this.name = message;
		this.message = message;
	}
}

module.exports = {
	parseString,
	xmlNodeToObject
};
// <(.+?)>(.*?)<\/(.+?)>