'use strict';

/**
 * Furler v0.0.1
 * 
 * @author Collin Grimm <collin.grimm@protonmail.ch>
 * @copyright (c) 2017 Collin Grimm
 * @license MIT License https://collingrimm.me/LICENSE.txt
 */

var request = require('request');
var cheerio = require('cheerio');
var chalk = require('chalk');
var { exec } = require('child_process');

var Spacer = function (str) {
    if (!str) return;
    return str.toString().toLowerCase().match(/[^_\s\W]+/g).join('');
}
var whiteSpace = function (str) { return str.toString().trim(); }

/**
 * Main Furler Class. Can take an optional "artist name" as parameter.
 * @param {String} artist Name of artist. Default => 'Sia'
 */
class Furler {
    constructor(artist) { this.artist = artist; }
    /**
     * Remove trailing white-space from string passed as argument. The two functions:
     * RemoveWhiteSpace and Spacer are similar, but the regex for spacer removes 
     * every white-space character (not just the trailing ones) and returns the string in lowercase
     * 
     * @param {String} str String with white-spaces
     * @returns {String} Returns string with no white-space / space padding
     */
    RemoveWhiteSpace(str) { return str.toString().trim(); }
    Spacer(str) {
        if (!str) return;
        return str.toString().toLowerCase().match(/[^_\s\W]+/g).join('');
    }
    /**
     * Get the lyrics of a song and display it on the terminal
     * 
     * @param {String} song Name of song. Defaults to 'Elastic Heart'
     */
    Lyrics(song) {
        var self = this;
        var LyricURL = `https://www.azlyrics.com/lyrics/${self.Spacer(self.artist)}/${self.Spacer(song)}.html`;
        var googleURL = `https://www.google.com/search?q=site%3Ahttps%3A%2F%2Fwww.metrolyrics.com%2F+${song}+${self.artist}`
        /**
         * Make request to pull the lyrics
         */
        request(LyricURL, function (error, response, songData) {
            var finalLyrics = [];
            var suggestion = [];
            if (response.statusCode == 404) {
                /**
                 * If the lyric is not found, do a Google Search and return the parsed results
                 */
                request(googleURL, function (error, response, body) {
                    var $ = cheerio.load(body);
                    var googleResponse = $('.r > a').text();
                    if (googleResponse) {
                        /**
                         *  Parse song title, and artist and return an array
                         */
                        var googleResponse = googleResponse.replace(/metroLyrics|lyrics|\.\.\.|video|audio/ig, '').split('|')

                        for (let i = 0; i < googleResponse.length; suggestion.push(googleResponse[i++].split('-')));

                        /**
                         * Show the results of the parsing and the suggestions
                         */
                        console.log(`${chalk.blue('Did you mean:')} ${chalk.green.bold(`"${self.RemoveWhiteSpace(suggestion[0][1])} - ${self.RemoveWhiteSpace(suggestion[0][0])}"`)}`);
                        console.log(`\n${chalk.yellow('Here are some suggestions')}`)

                        for (let i = 1; i < 10; i++) {
                            if (suggestion[i] === undefined ||
                                suggestion[i].length <= 1 ||
                                suggestion[i].length > 2) {
                                i++;
                            }
                            else {
                                console.log(`${suggestion[i][1].toString().trim()} -  ${suggestion[i][0].toString().trim()}`);
                            }
                        }
                    }
                });
                return console.log(chalk.red('Lyrics not found :('));
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
