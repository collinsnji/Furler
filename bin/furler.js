#!/usr/bin/env node

'use strict';
/**
 * Furler v1.0.0
 * 
 * @author Collin Grimm <collin.grimm@protonmail.ch>
 * @copyright 2017 Collin Grimm (and other contributors)
 * @license MIT License https://collingrimm.me/LICENSE.txt
 */

var furler = require('../src/Furler.js');
var figlet = require('figlet');
var chalk = require('chalk');
var argv = require('minimist')(process.argv.slice(2));

var parseArgument = function (arg) {
    var argument = arg.toString().split('-');
    return argument;
}

var usage = function () {
    console.log(
        chalk.yellow(
            figlet.textSync('Furler', { horizontalLayout: 'full' })
        )
    );
    console.log(`
    ${chalk.bold('Show lyrics of your favourite Sia song (or other songs) right in your CLI')}

    ${chalk.bold('Usage')}: furler [options] Song Name - Artist
    ${chalk.bold('Options')}:
        -v          print version number and exit
        -h          show this help message

    ${chalk.bold('Examples')}: 
        furler The Greatest
        furler Blank Space - Taylor Swift

    If no artist specified, the artist defaults to Sia
    ${chalk.gray('(c) 2017 Collin Grimm <collin.grimm@protonmail.ch> | MIT License')}
    `)
    process.exit();
}

var songMeta = parseArgument(argv._);
if (argv.h) usage();
if (argv.v) { console.log('1.0.4'); process.exit(); }

if (songMeta.toString().length === 0) { usage(); }
else {
    var lyArg = [];
    for(var i = 0; i <songMeta.length; i++){
        lyArg.push(songMeta[i].match(/[^_\s\W]+/g, ''));
    }
    lyArg[1] = ((lyArg.length < 2 && lyArg[1] === undefined) ? '' : lyArg[1]);
    var Sia = new furler(lyArg[1]).Lyrics(lyArg[0].toString());
}
