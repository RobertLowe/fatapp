#! /usr/bin/env node

fs = require('fs');
path = require('path');
deepmerge = require('deepmerge');
_ = require('underscore');
http = require('http');
Fiber = require('fibers');
Future = require('fibers/future');
leftPad = require('left-pad');
rightPad = require('right-pad');
let Gauge = require("gauge");
let options = require('minimist')(process.argv.slice(2), {boolean: ['a', 'all']});

if(options.h || options.help){
  console.log(`  fatapp - a dirty NPM dependency analysis tool
  ====================================================================

  fatapp [-s | --sort] [-n  | --loads] [<filepath>]

  Options:

  [<path>]        - 'package-lock.json' or directory an NPM project (defaults: './package-lock.json')
  [-s | --sort]   - sort by 'size', 'time', 'name' (defaults: 'size')
  [-n | --loads]  - number of times to require a NPM package for average times (defaults: 1)
  [-a | --all]    - include development dependencies in scanning (defaults: off)

  ====================================================================
  File size will be the compress TGZ NPM package.
  Load times are captured from a blank preload: 'node -r "express" -e ""'

  WARN: This package make lazy use of 'execSync', do not use in production environments`)
   return;
}

// how many times to load a library for averaging
let loadn = options.n || options['loads'] || 1;
let sort = options.s || options.sort || 'size';
let all = _.has(options, 'a') || _.has(options, 'all') || false;

child_process = require('child_process');

let bytesToSize = (bytes) => {
   let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

let lockFile = '.'
if(options._.length == 1){
  lockFile = options._[0];
}

console.log(`fatapp - scanning: '${lockFile}'`);
console.log("====================================================================");


if (!fs.existsSync(lockFile))
  return console.log(`Failed, '${lockFile}' is not a valid directory or file`)


let projectDir = path.resolve(path.normalize(lockFile));


if(fs.lstatSync(lockFile).isDirectory()){
  lockFile = projectDir + '/package-lock.json';
}


let packageLock = fs.readFileSync(lockFile);
let packageLockRaw = packageLock;
packageLock = JSON.parse(packageLock);

let gauge = new Gauge()
gauge.show("Profiling", 0.0)

let flattenDeps = {};

function withSize(url, config) {
    var future = new Future;

    http.get(url, (res) => {
      config.size = parseInt(res.headers['content-length'])
      res.destroy();
      
      setTimeout(()=>{
        future.return(config);
      }, 50)

    });

    return future.wait();
}

var walkForCount = function(deps){

  _.keys(deps).forEach((key, index)=>{
    let config = deps[key];

    if(_.isString(config)){ // leaf node
      config = packageLock.dependencies[key];
    }

    // not interested in
    if(packageLock.dependencies[key] && (config.dev !== true || all)){

      config.name = `${key}@${config.version}`;

      // scene in tree already...
      if(flattenDeps[`${key}@${config.version}`])
        return;
      flattenDeps[`${key}@${config.version}`] = true


      if(config.requires)
        walkForCount(config.requires);

    }
  });
}



walkForCount(packageLock.dependencies)
let depsCount = _.keys(flattenDeps).length;
let depsProcessed = 1;

flattenDeps = {};

var walkDeps = function(deps){

  _.keys(deps).forEach((key, index)=>{
    let config = deps[key];

    if(_.isString(config)){ // leaf node
      config = packageLock.dependencies[key];
    }

    // not interested in
    if(packageLock.dependencies[key] && (config.dev !== true || all)){

      // if(config.version){
      config.name = `${key}@${config.version}`;

      // scene in tree already...
      if(flattenDeps[`${key}@${config.version}`])
        return;
      flattenDeps[`${key}@${config.version}`] = config


      gauge.pulse(config.name);

      if(!config.resolved)
        config.resolved = `http://registry.npmjs.org/${key}/-/${key}-${config.version}.tgz`;

      config.resolved = config.resolved.replace(/^https/, "http");

      withSize(config.resolved, config);

      flattenDeps[`${key}@${config.version}`] = config

      config.profiles = [];
      for (var i = 0; i < loadn; i++) {
        var time = new Date;
        try {
          child_process.execSync(`cd ${projectDir} && node -r '${key}' -e '' 2>&1 /dev/null`);
          if(loadn == 1){
            config.time = (new Date - time);
          } else {
            config.profiles.push((new Date - time));
          }
        } catch (error){
          config.time = -1
          break;
        }
      }
      
      if(loadn == 1){
        config.time = config.time;
      } else {
        config.time = (_.reduce(config.profiles, function(memo, num){ return memo + num; }, 0) / (config.profiles.length || 1));
        config.time = (config.time == 0) ? -1 : config.time; // failing to require
      }

      depsProcessed = depsProcessed + 1;
      gauge.show(`Profiling ${depsProcessed} of ${depsCount}`, depsProcessed / depsCount);


      if(config.requires)
        walkDeps(config.requires);

    }

  });

}.future()


var start = new Date;
let keys = _.keys(packageLock.dependencies);
walkDeps(packageLock.dependencies).resolve(function(err, val) {

  gauge.show(`Profiled ${depsProcessed} of ${depsCount}`, 1);

  try {
    flattenDeps = _.sortBy(flattenDeps, sort);
  } catch (error){
    console.log("Please use a valid sort of either: `size` or `time`")
  }

  _.keys(flattenDeps).forEach((key)=>{
    let config = flattenDeps[key];

    console.log(rightPad(config.name, 40, ' '), "size:", leftPad(bytesToSize(config.size), 10), "in:", ((config.time == -1) ? "require failed." :  (  config.time.toFixed(0) + ((loadn == 1) ? " ms" : " ms avg"))   ) );
  });

  console.log('--------------------------------------------------------------------');

  console.log('Finished in: '+ (new Date - start)+ 'ms');

  console.log('--------------------------------------------------------------------');
  console.log("These are TGZ compressed sizes of the whole NPM module, but \nshould give a relativistic idea of package weight")

});


