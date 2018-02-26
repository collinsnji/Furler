'use strict';

/**
 * Furler v0.0.1
 * 
 * @author Collin Grimm <collin.grimm@protonmail.ch>
 * @copyright (c) 2017 Collin Grimm
 * @license MIT License https://collingrimm.me/LICENSE.txt
 */

const request = require('request');
const cheerio = require('cheerio');
const chalk = require('chalk');
const { exec } = require('child_process');

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
        let capitalise = str.toString().split(' ').map(word => word.toLowerCase().charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        return capitalise.match(/[^_\s\W]+/g).join('-');
    }
    /**
     * Get the lyrics of a song and display it on the terminal
     * 
     * @param {String} song Name of song. Defaults to 'Elastic Heart'
     */
    Lyrics(song) {
        let self = this;
        let LyricURL = `https://www.musixmatch.com/lyrics/${self.Spacer(self.artist)}/${self.Spacer(song)}`;
        let suggestionURL = `https://www.google.com/search?q=site%3Ahttps%3A%2F%2Fwww.musixmatch.com%2F+${song}+${self.artist}`
        return request(LyricURL, (error, response, songData) => {
            if (response.statusCode == 404) {
                self.LyricSuggestion(suggestionURL);
                return console.log(chalk.red('Lyrics not found :('));
            }
            let $ = cheerio.load(songData);
            let lyrics = $('.mxm-lyrics__content').text().toString().replace(/^(\n){2,}/gm, "\r\n");
            console.log(`'${song}' by ${self.artist}\n\n${lyrics}`);
        });
    }
    LyricSuggestion(url) {
        let self = this;
        return request(url, (error, response, body) => {
            let $ = cheerio.load(body);
            let res = $('.r > a').text();
            let suggestion = [];
            if (res) {
                let googleResponse = res.replace(/musixmatch|lyrics|\.\.\.|http|video|audio/ig, '').split('|');
                for (let i = 0; i < googleResponse.length; suggestion.push(googleResponse[i++].split('-')));
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
    }
}
module.exports = Furler;
