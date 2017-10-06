'use strict';

const chai = require('chai');
const [should, expect] = [chai.should(), chai.expect];

const Furler = require('../src/Furler');

describe('Furler Tests Running...', () => {
	const ly = new Furler();

	it('Should create a new instance', () => {
		((typeof Furler).should.equal('function'));
		expect(ly instanceof Furler).to.equal(true);
	});
	it('Should show error message if lyrics is not found', () => {
		const lrx = new Furler('Sia').Lyrics('Eye of a needle');
		expect(lrx).to.be.undefined;
	});
});
