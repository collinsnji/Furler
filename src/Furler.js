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
        var googleURL = `https://www.google.com/search?q=site%3Ahttps%3A%2F%2Fwww.azlyrics.com%2F+${this.artist}+${song}`
        var finalLyrics = [];
        request(LyricURL, function (error, response, songData) {
            if (response.statusCode == 404) {
                // Request the google search
                request(googleURL, function (error, response, body) {                     
                    var $ = cheerio.load(body);
                    // Get the name of the first result, usually the correct song name
                    var googleResponse = $('#ires > ol > div:nth-child(1) > h3 > a').text();
                    if (googleResponse) {
                        // Clean title, for artist and song
                        googleResponse = googleResponse.split("-");
                        var suggestionArtist = googleResponse[0].replace("Lyrics", "").trim();
                        var suggestionSong = googleResponse[1].trim();
                        // Give the suggestion
                        console.log(`Did you mean '${suggestionSong} - ${suggestionArtist}'`);
                    }
                });
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
