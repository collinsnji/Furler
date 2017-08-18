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
    it('Should get and parse default lyrics', () => {
        expect(ly.Lyrics()).not.to.throw();
    });
    it('Should throw if lyrics is not found', () => {
        var lrx = new Furler('Bad Blood');
        expect(function () { return lrx.Lyrics(); }).to.throw('Song not found');
    });
});
