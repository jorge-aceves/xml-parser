class XMLNode {
	constructor(elementName){
		this.elementName = elementName;
		this.value = undefined;
		this.children = [];
	}
};

module.exports = { 
	XMLNode
};