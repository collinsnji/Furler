'use strict';

const chai = require('chai');
const [should, expect] = [chai.should(), chai.expect];

const Furler = require('../src/Furler');

describe('Furler Tests Running...', () => {
	const ly = new Furler('Sia');

	it('Should create a new instance', () => {
		((typeof Furler).should.equal('function'));
		expect(ly instanceof Furler).to.equal(true);
	});
	it('Should show error message if lyrics is not found', () => {
		expect(ly.Lyrics('Eye of a needle')).to.be.undefined;
	});
	it('RemoveWhiteSpace method should work properly', ()=>{
		expect(ly.RemoveWhiteSpace('     test string   ')).to.equal('test string');
		expect(ly.RemoveWhiteSpace(123)).to.equal('123');
	});
	it('Spacer method should work properly', ()=>{
		expect(ly.Spacer(' #Test String...(),   ')).to.equal('teststring');
		expect(ly.Spacer(234)).to.equal('234');
	});
});
