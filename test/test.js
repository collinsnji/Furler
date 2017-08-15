'use strict'

var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var Furler = require('../src/Furler');

describe('Furler Tests Running...', () => {
    let ly = new Furler();

    it('Should create a new instance', () => {
        expect(ly instanceof Furler).to.equal(true);
        ((typeof ly).should.equal('object'));
    });
    it('Should get lyrics', () => {
       expect(ly.Lyrics().length).to.not.equal(0);
    });
});
