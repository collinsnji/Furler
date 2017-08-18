'use strict';

/**
 * Furler v0.0.1
 * 
 * @author Collin Grimm <collin.grimm@protonmail.ch>
 * @copyright (c) 2017 Collin Grimm
 * @license MIT License https://collingrimm.me/LICENSE.txt
 */

const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const { exec } = require('child_process');

var Spacer = function (str) { return str.toLowerCase().match(/[^_\s\W]+/g).join(''); }
var lyricsDir = path.join(path.resolve('.'), 'lyrics');

/**
 * 
 * @param {String} song Name of song. Default => 'Elastic Heart'
 * @param {String} artist Name of artist. Default => 'Sia'
 */
var Furler = function (song, artist) {
    this.artist = artist || 'Sia';
    this.song = song || 'Elastic Heart';
    return this;
}
Furler.prototype.Lyrics = function () {
    var Sia = this;
    var LyricURL = `https://www.azlyrics.com/lyrics/${Spacer(Sia.artist)}/${Spacer(Sia.song)}.html`;
    return request(LyricURL, function (error, response, songData) {
        var $ = cheerio.load(songData);
        if ($('html').children('body').toString().includes('Welcome to AZLyrics!')) { throw new Error('Song not found'); }

        var lyrics = $('.text-center').children('div').text().toString().replace(/^(\n){2,}/gm, "\r\n");
        fs.writeFileSync(`${lyricsDir}/${Spacer(Sia.song)}.txt`, lyrics);
        exec(`./siafy ${lyricsDir}/${Spacer(Sia.song)}.txt`);
    });
}

module.exports = Furler;
//var Sia = new Furler('Big Girls cry').Lyrics();
