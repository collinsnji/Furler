'use strict'

var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var Furler = require('../src/Furler');

describe('Furler Tests Running...', () => {
    let ly = new Furler();

    it('Should create a new instance', () => {
        ((typeof Furler).should.equal('function'));
        expect(ly instanceof Furler).to.equal(true);
    });
    it('Should show error message if lyrics is not found', () => {
        var lrx = new Furler('Sia').Lyrics('Eye of a needle');
        expect(lrx).to.be.undefined;
    });
});
