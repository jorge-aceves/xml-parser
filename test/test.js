'use strict'

const fs = require('fs');
const expect = require('chai').expect;
const parser = require('../index');

const inputFileNames = ['super_simple_input.xml', 'basic_input.xml', 'nested_input.xml']
const jsonOutputFileNames = ['super_simple_input.json', 'basic_input.json', 'nested_input.json']

inputFileNames.forEach((fileName, i) => {
	const xmlPath = `./test/fixtures/${fileName}`;
	const jsonPath = `./test/fixtures/${jsonOutputFileNames[i]}`;
	const outputJson = JSON.parse(fs.readFileSync(jsonPath));
	it('should be able to parse', (done) => {
		const expectedResult = JSON.stringify(outputJson);
		expect(parser.xmlToJson(xmlPath)).to.equal(expectedResult);
		done();
	});
});
