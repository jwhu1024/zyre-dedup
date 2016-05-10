var fs 		= require('fs'),
	bignum 	= require("bignum"),
	crypto 	= require("crypto");

function do_oprf_h1(_fileHash) {
	var fileHash = _fileHash;
	var h1 = bignum(fileHash, 16);
	var n = bignum('145859173040309229955833252345654325463844070602921285056139874043635346668941428484651128442619349098391282012811366461830349732301204981399638512025284782925269077642090448376311362217230794213004405021482693447818117628194854565751827513600850925224038365314953038266614774662696559105571178095070057414419');
	var e = bignum('145541104443282401337263334694430609685272191469109395400046938841302282524472213451350769169199645023166171627311623994301147075358816138844622052257035428877536139126216095440016716954562067780818693963010822953550472939676056328067269578360303097678843287231860472090676878850754043234016752484432912172227');
	var r = bignum.rand(n);

	fs.writeFile("/tmp/n", n, function(err) {
		fs.writeFile("/tmp/r", r, function(err) {
			var mask = bignum.powm(r, e, n);
			h1 = bignum.mul(h1, mask);
			h1 = bignum.mod(h1, n);
			h1 = h1.toString(10);
			console.log(h1);
		});
	});
}

function do_oprf_k1(_h1) {
	var h1 = _h1;
	h1 = bignum(h1, 10);
	var d = bignum('46974444686643577370446451555895158034133785096671391920710184738970388529850992246627044250360252759305747200010932100483158316395879678093630140028035046850592061197465499801262041195081179883211674708946698000906752821355598091979039569428178885256882446606517007558007204808103601510805361488717110318363');
	var n = bignum('145859173040309229955833252345654325463844070602921285056139874043635346668941428484651128442619349098391282012811366461830349732301204981399638512025284782925269077642090448376311362217230794213004405021482693447818117628194854565751827513600850925224038365314953038266614774662696559105571178095070057414419');
	var k1 = bignum.powm(h1, d, n);
	var k1 = k1.toString(10);
	console.log(k1);
}

function do_oprf(_k1) {
	fs.readFile("/tmp/n", "utf-8", function (err, data_n) {
		var n1 = bignum(data_n);
		fs.readFile("/tmp/r", "utf-8", function (err, data_r) {
			var r1 = bignum(data_r);
			var k1 = bignum(_k1, 10);
			var x1 = bignum.invertm(r1, n1);
			koprf = bignum.mul(k1, x1);
			koprf = bignum.mod(koprf, n1);
			koprf = koprf.toString(10);
			console.log(koprf);
		});
	});
}

function do_gen_CF_key (_f1) {
	var fileCipher = crypto.createCipher(CIPHER_ALGO, fileKey);
	console.log (fileCipher);
}  

var args = process.argv.slice(2);
var cmd = args[0];

switch (args[0]) {
	case "1": // cmd - filehash
		do_oprf_h1(args[1]);
		break;
	case "2":
		do_oprf_k1(args[1]);
		break;
	case "3":
		do_oprf(args[1]);
		break;
	case "4":
		do_gen_CF_key(args[1]);
		break;
	default:
		console.log('default');
		break;
}