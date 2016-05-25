var fs = require('fs');

var express = require('express');
var app = express();

app.use(function(req, res, next) {
  req.rawBody = '';
  req.setEncoding('utf8');

  req.on('data', function(chunk) { 
    req.rawBody += chunk;
  });

  req.on('end', function() {
    next();
  });

    //req.jsonBody = JSON.parse(req.rawBody);
});

var blacklist = ['app/templates/components/component-prototype-list.hbs', 'app/templates/components/component-prototype.hbs'];

// var bodyParser = require('body-parser');
// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

app.get('/components', function (req, res) {
    var componentFiles = getFiles("app/templates/components");
    var output= "{\"data\":\n[\n";
    var arrayLength = componentFiles.length;
    for(var i=0;i<arrayLength;++i)
    {
	if(componentFiles[i].endsWith(".hbs") && blacklist.indexOf(componentFiles[i])==-1)
	{
	    console.log(componentFiles[i]);
	    var filename = componentFiles[i];
	    var name = componentFiles[i].substring(25, componentFiles[i].length - 4);
	    var codeFile = "app/components/" + name + ".js";
	    output += "{\"file\":\"" + componentFiles[i] + "\",\n" +
		"\"name\":\"" + name + "\",\n" +
		"\"code\":\"" + encodeURIComponent(fs.readFileSync(codeFile), 'utf-8') + "\",\n" +
		"\"template\":\"" + encodeURIComponent(fs.readFileSync(filename), 'utf-8') + "\"\n" + "}";
	    if((i+1)<arrayLength)output += ","
	    output += "\n"
	}
    }
    output += "]\n}";
    res.send(output);
});

app.post('/components', function(req, res) {
    var componentFiles = getFiles("app/components");

    var jsonBody = JSON.parse(req.rawBody);
    
    fs.writeFile("app/components/" + jsonBody.name + ".js", decodeURIComponent(jsonBody.code), (err) => {
	if (err) throw err;
	console.log('component saved!');
    });

    fs.writeFile("app/templates/components/" + jsonBody.name + ".hbs", decodeURIComponent(jsonBody.template), (err) => {
	if(err) throw err;
	console.log('template saved!');
    });
    
    res.send("HTTP/1.0 200 OK");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
