'use strict'

const fs = require('fs');
const expect = require('chai').expect;
const parser = require('../index');
const { XMLNode } = require('../src/xml-node')
const { XMLException } = require('../src/xml-parser')

const inputFileNames = ['super_simple_input.xml', 'basic_input.xml', 'nested_input.xml']
const jsonOutputFileNames = ['super_simple_input.json', 'basic_input.json', 'nested_input.json']

let xmlPath = '', jsonPath = '', outputJson = '';
const subject = function() { parser.xmlToJson(xmlPath) };

describe('Working cases', () => {
	inputFileNames.forEach((fileName, i) => {
		xmlPath = `./test/fixtures/${fileName}`;
		jsonPath = `./test/fixtures/${jsonOutputFileNames[i]}`;
		outputJson = JSON.parse(fs.readFileSync(jsonPath));
		it('should be able to parse', (done) => {
			const expectedResult = JSON.stringify(outputJson);
			expect(parser.xmlToJson(xmlPath)).to.equal(expectedResult);
			done();
		});
	});
});

describe('When something is wrong', () => {
	it('should throw a duplicate error if same element is twice in the list', (done) => {
		xmlPath = './test/fixtures/duplicate_input.xml';
		expect(subject).to.throw(XMLException).with.property('message', 'Element is repeated');
		done();
	});

	it('should throw a missing tag error when xml is malformed', (done) => {
		xmlPath = './test/fixtures/open_tag_input.xml';
		expect(subject).to.throw(XMLException).with.property('message', 'Closing tag is missing');
		done();
	});

	it('should throw a MalformedXML error if there is nothing to parse', (done) => {
		xmlPath = './test/fixtures/string_input.xml';
		expect(subject).to.throw(XMLException).with.property('message', 'There is no XML to parse');
		done();
	});

	it('should throw a MalformedXML error if there is more than one root element', (done) => {
		xmlPath = './test/fixtures/two_root_input.xml';
		expect(subject).to.throw(XMLException).with.property('message', 'XML file has more than one root element');
		done();
	});
})
