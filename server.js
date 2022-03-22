//Creating a web serve using http , url 
  // and fs : file system module  to manage file in/output
  //detects errors and completion

  const http = require('http'),
  fs = require('fs'),
  url = require('url');


http.createServer((request, response) => {
  let addr = request.url, 
  q = url.parse(addr, true),
    filePath = '';
        // written such as instead of = require('url') to renders the requested URL not just static page
        // only available in the htpp !!


  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });

        // appendFile () read the new file log, which was also created subito thanks to Node
        //the new requested URL 
        //Timestamp and new date 
        // All info => log.txt

  if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }

        // to verify that the word documentation is linked or else

  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }
// readFile () has file path as an attribute therefore can grab the right file from the server
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();

  });

}).listen(8080); // listen on the port 8080
console.log('My test server is running on Port 8080.');
