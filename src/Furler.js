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
var chalk = require('chalk');
var { exec } = require('child_process');

var Spacer = function (str) { return str.toString().toLowerCase().match(/[^_\s\W]+/g).join(''); }
var whiteSpace = function(str){ return str.toString().trim(); }
var lyricsDir = path.join(path.resolve('.'), 'lyrics');

/**
 * Main Furler Class. Can take an optional "artist name" as parameter.
 * @param {String} artist Name of artist. Default => 'Sia'
 */
class Furler {
    constructor(artist) {
        this.artist = artist;
    }
    /**
     * Get the lyrics of a song and save it as a text file in the lyrics directory
     * TODO: Make the lyrics display on the CLI
     * 
     * @param {String} song Name of song. Defaults to 'Elastic Heart'
     */
    Lyrics(song) {
        var LyricURL = `https://www.azlyrics.com/lyrics/${this.artist}/${Spacer(song)}.html`;
        var googleURL = `https://www.google.com/search?q=site%3Ahttps%3A%2F%2Fwww.metrolyrics.com%2F+${song}+${this.artist}`
        var finalLyrics = [];
        //console.log(Spacer(this.artist), Spacer(song));
        request(LyricURL, function (error, response, songData) {
            if (response.statusCode == 404) {
                // Request the google search
                request(googleURL, function (error, response, body) {                     
                    var $ = cheerio.load(body);
                    // Get the name of the first result, usually the correct song name
                    var googleResponse = $('.r > a').text();
                    if (googleResponse) {
                        // Clean title, for artist and song
                        var googleResponse = googleResponse.replace(/metroLyrics|lyrics|audio/ig, '').split('|')
                        var suggestion = [];
                        for(let i = 0; i < googleResponse.length; suggestion.push(googleResponse[i++].split('-')));
                        console.log(suggestion);
                        console.log(`${chalk.blue('Did you mean:')} ${chalk.green.bold(`"${whiteSpace(suggestion[0][1])} - ${whiteSpace(suggestion[0][0])}"`)}`);
                        console.log(`\n${chalk.yellow('Other Suggestions')}`)
                        
                        for (let i = 1; i < 3; i++){
                            console.log(`${suggestion[i][1].trim()} -  ${suggestion[i][0].trim()}`);
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
