'use strict'
const { XMLNode } = require('./xml-node')

const parseString = (xmlString) => {
	let node = new XMLNode('dummy');
	parse(xmlString, node, 0)
	if(node.children.length == 0) throw new XMLException('There is no XML to parse');
	if(node.children.length > 1) throw new XMLException('XML file has more than one root element');
	return node.children[0];
}

// Returns an XMLNode with the root of the XML 
const parse = (xmlString, parent, i) => {
	let stringEnd = 0;
	let stringStart = 0;
	let start = 0; 
	do {
		let chunk = xmlString.substring(stringStart, xmlString.length);
		let openTag = chunk.match(/<(.+?)>/);
		if(!openTag) return chunk;
		let elementName = openTag[1]
		let closingTag = chunk.match(`<\/${elementName}>`);
		if(!closingTag) throw new XMLException('Closing tag is missing');
		start = openTag.index + openTag[0].length;
		let end = closingTag.index;
		stringEnd = end + closingTag[0].length;
		let node = new XMLNode(elementName);
		let result = parse(chunk.substring(start, end), node, i+1);
		if(typeof(result) === 'string'){
			node.value = result;
		}
		parent.children.push(node);
		stringStart += stringEnd;
	} while(stringEnd != xmlString.length);
}

const XMLException = class{
	constructor(message){
		this.message = message;
		this.name = 'TagException';
	}
}

module.exports = {
	parseString
};
// <(.+?)>(.*?)<\/(.+?)>