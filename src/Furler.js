'use strict';

/**
 * Versionizr v0.0.1
 * 
 * @author Collin Grimm <collin.grimm@protonmail.ch>
 * @copyright (c) 2017 Collin Grimm
 * @license MIT License https://collingrimm.me/LICENSE.txt
 */

const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const { exec } = require('child_process');

var Spacer = function (str) { return str.toLowerCase().match(/[^_\s\W]+/g).join(''); }

var Furler = function (song, artist) {
    this.artist = artist || 'Sia';
    this.song = song || 'Elastic Heart';
    return this;
}
Furler.prototype.Lyrics = function () {
    var sia = this;
    var LyricURL = `https://www.azlyrics.com/lyrics/${Spacer(sia.artist)}/${Spacer(sia.song)}.html`;
    request(LyricURL, function (error, response, songData) {
        var $ = cheerio.load(songData);
        var lyrics = $('.text-center').children('div').text().toString().replace(/^(\n){2,}/gm, "\r\n");

        fs.writeFileSync(`${Spacer(sia.song)}.txt`, lyrics);
        const child = exec(`./siafy ${Spacer(sia.song)}.txt`);
    });
}

module.exports = Furler;
//var Sia = new Furler('Big Girls cry').Lyrics();
