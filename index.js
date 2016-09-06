var bayes = require('bayes')
var fs = require('fs');
var rl = require('readline');

var classifier = bayes();


var cnnDone = false;
var bzDone  = false;

var bzRs = fs.createReadStream('bzheadlines.txt');
var bzReader = rl.createInterface({
  input: bzRs
});

bzReader.on('line', function (line) {
  classifier.learn(line, 'positive');
//  console.log('Line from file:', line);
});

var cnnRs = fs.createReadStream('cnn.txt');
var cnnReader = rl.createInterface({
  input: cnnRs
});

cnnReader.on('line', function (line) {
  classifier.learn(line, 'negative');
//  console.log('Line from file:', line);
});


bzRs.on('end', function() {
  bzDone = true;
  doneLearning();
});

cnnRs.on('end', function() {
  cnnDone = true;
  doneLearning();
});


function doneLearning() {
  if (!cnnDone || !bzDone) {
    return;
  }

  console.log("testing: ", process.argv[2]);
  var res = classifier.categorize(process.argv[2]);
  console.log(res);
}
