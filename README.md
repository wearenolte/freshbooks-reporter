# Freshbooks Reporter

## Prerequisites

Make sure you have installed all these prerequisites on your development machine.
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager, if you encounter any problems, you can also use this [Github Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages, in order to install it make sure you've installed Node.js and npm, then install bower globally using npm:

```
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process, in order to install it make sure you've installed Node.js and npm, then install grunt globally using npm:

```
$ sudo npm install -g grunt-cli
```

* Sails: Now that Node.js is installed on your system, we can move on to [Sails.js](http://sailsjs.org/), you can find detailed instructions [here](https://github.com/balderdashy/sails-docs/blob/master/getting-started/getting-started.md)

## Quick Install

The first thing you should do is install the Node.js dependencies. The boilerplate comes pre-bundled with a package.json file that contains the list of modules you need to start your application.

To install Node.js dependencies, in the application folder run this in the command-line:

```
$ npm install
```

For local testing create the file config/local.js with the following configuration:

```json
module.exports = {
  connections: {
    localDiskDb: {
      adapter  : 'sails-mongo',
      host     : '<mongodb-host>',
      port     : <mongodb-port>,
      user     : '<mongodb-user>',
      password : '<mongodb-password>',
      database : 'freshbooks-reporter'
    }
  },

  freshbooks: {
    login   : '<freshbooks-user>',
    apiKey  : '<freshbooks-api-key>',
    appName : '<app-name-for-freshbooks-requests>'
  }
}
```

## Running Your Application
After the install process is over, you'll be able to run your application with:

```
$ ./node_modules/forever/bin/forever -w start app.js
```

If you want to see the application logs:

```
$./node_modules/forever/bin/forever logs app.js -f
```

Your application should run on the 1337 port so in your browser just go to [http://localhost:1337](http://localhost:1337)

That's it!

## Contributing

- Fork it
- Create your feature branch (git checkout -b my-new-feature)
- Commit your changes (git commit -am 'Add some feature')
- Push to the branch (git push origin my-new-feature)
- Create new Pull Request

## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
