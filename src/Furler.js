'use strict';

/**
 * Furler v0.0.1
 * 
 * @author Collin Grimm <collin.grimm@protonmail.ch>
 * @copyright (c) 2017 Collin Grimm
 * @license MIT License https://collingrimm.me/LICENSE.txt
 */

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var { exec } = require('child_process');

var Spacer = function (str) { return str.toString().toLowerCase().match(/[^_\s\W]+/g).join(''); }
var lyricsDir = path.join(path.resolve('.'), 'lyrics');

/**
 * Main Furler Class. Can take an optional "artist name" as parameter.
 * @param {String} artist Name of artist. Default => 'Sia'
 */
class Furler {
    constructor(artist) {
        this.artist = artist || 'Sia';
    }
    /**
     * Get the lyrics of a song and save it as a text file in the lyrics directory
     * TODO: Make the lyrics display on the CLI
     * 
     * @param {String} song Name of song. Defaults to 'Elastic Heart'
     */
    Lyrics(song) {
        var LyricURL = `https://www.azlyrics.com/lyrics/${Spacer(this.artist)}/${Spacer(song)}.html`;
        var finalLyrics = [];
        request(LyricURL, function (error, response, songData) {
            if (response.statusCode == 404) {
                return console.log('Lyrics not found :(');
            }
            var $ = cheerio.load(songData);

            var lyrics = $('.text-center').children('div').text().toString().replace(/^(\n){2,}/gm, "\r\n").split('\n');
            for (var i = 0; i < lyrics.length; i++) {
                if (lyrics[i].includes('Submit Corrections')) { break; }
                finalLyrics.push(lyrics[i]);
            }
            console.log(finalLyrics.join('\n'));
        });
    }
}
module.exports = Furler;
