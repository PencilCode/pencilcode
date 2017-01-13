
How To Build and Test PencilCode
================================
[![Build Status](https://travis-ci.org/PencilCode/pencilcode.png?branch=master)](https://travis-ci.org/PencilCode/pencilcode)
First install the prerequisites: git, nodejs, and grunt. Next, be sure you're in your home directory. Then:

Prerequisites
-------------
There are three prerequisites: git, node.js, and grunt. Instructions are noted by operating system.

(For Linux:)

1. Git -
`sudo apt-get install git` on Debian/Ubuntu
`sudo yum install git-core` on CentOS / Redhat / Fedora

2. Node.js -
Some modern systems have recent enough tools to install node.js via the package manager. Here is how you'd do so on Ubuntu (native or under WSL):
<pre>
sudo apt-get install npm git
sudo update-alternatives --install /usr/bin/node node /usr/bin/nodejs 10
sudo npm install -g grunt-cli
</pre>
If you are not sure, it is recommended you get and build the latest `node`, `npm`, and `grunt` binaries as follows:
<pre>
mkdir -p /tmp/nodejs && cd /tmp/nodejs
wget -N http://nodejs.org/dist/v7.4.0/node-v7.4.0.tar.gz # http://nodejs.org/dist/node-latest.tar.gz
tar xzvf node-*.tar.gz && cd `ls -d node-v*`
./configure --prefix=$HOME/local
make install
echo 'export PATH=$HOME/local/bin:$PATH' &gt;&gt; ~/.bashrc
source ~/.bashrc
npm install -g grunt-cli
</pre>
Zsh users should change `bashrc` to `zshrc` in the above code.

(For Mac:)

1. On the Mac, git comes from Apple (you can get it as part of the
[Command line tools for XCode](https://developer.apple.com/downloads/index.action?q=xcode#)),
and if you'd rather not build it, node.js can be installed from
http://nodejs.org/download/.
You will still need to `sudo npm install -g grunt-cli`.

2. You'll need to install node.js as well:
<pre>
mkdir -p /tmp/nodejs && cd /tmp/nodejs
curl http://nodejs.org/dist/v7.4.0/node-v7.4.0.tar.gz > node-latest.tar.gz
tar xzvf node-*.tar.gz && cd `ls -d node-v*`
./configure --prefix=$HOME/local
make install
echo 'export PATH=$HOME/local/bin:$PATH' &gt;&gt; ~/.profile
source ~/.profile
npm install -g grunt-cli
</pre>

The above drops all the built binaries into `~/local/bin` so you don't need root.

(For Windows:)

1. Git can be installed from here: http://git-scm.com/download/win

2. Node.js v7.x can be installed from here: http://nodejs.org/download/


Building and Running
---------------------
To clone the repository, build, and run, execute these commands:
<pre>
git clone https://github.com/PencilCode/pencilcode.git
cd pencilcode
npm install
grunt
grunt devserver
</pre>


How To Experiment with PencilCode
=================================

To experiment with PencilCode, you will want to run a local
copy of the site's frontend. Your webpage may appear in plain (rather ugly) text unless you run devchrome with your grunt devserver.

To build and start the dev server (by default it runs on localhost:8008):

<pre>
devchrome
bg %1
grunt
grunt devserver
</pre>

(Use grunt sdevserver to run https instead of http.)

To use the devserver, modify DNS resolution so *.pencilcode.net.dev points to
localhost.  For example, with chrome on OSX, add a couple aliases to
your .profile by running the following:

<pre>
cat &gt;&gt; ~/.profile &lt;&lt;EOF
alias chrome="/Applications/Google\\ \\Chrome.app/Contents/MacOS/Google\\ \\Chrome"
alias devchrome='chrome --host-resolver-rules="MAP *pencilcode.net.dev localhost:8008" --user-data-dir=$HOME/devchrome --ignore-certificate-errors http://pencilcode.net.dev/'
EOF
source ~/.profile
</pre>

And then "devchrome" will launch an instance of Chrome with the right proxy.

On Linux, add something like this to your .bashrc:

<pre>
alias devchrome='google-chrome --host-resolver-rules="MAP *pencilcode.net.dev localhost:8008" --user-data-dir=$HOME/devchrome http://pencilcode.net.dev/'
</pre>

On Windows:

You can set up command line options for the Canary Chrome shortcut, with the following options.

<pre>
--host-resolver-rules="MAP *pencilcode.net.dev localhost:8008" --ignore-certificate-errors https://pencilcode.net.dev/"
</pre>

When running devchrome, any URL with a hostname that ends with ".dev"
will be routed to the development server.  Visit https://pencilcode.net.dev/
to browse your local copy of the website.


PencilCode Internals
====================

The structure of pencilcode is really simple.
* It is a single HTML file `content/src/editor.html` that does all the work.
  All `pencilcode.net/edit/...` URLs resolve to this static file.
* The javascript behind editor.html is in the `src/` directory (symlink
  to `content/src`).  These javascript files are combined and minified
  into content/src/editor.js by the build.
* The editor javascript does JSON requests to `pencilcode.net/load/...`
  and `pencilcode.net/save/...` to read and write actual data.
* There are a bunch of other static files that can be found in
  `content`.

JSON save and load
------------------

To get a sense for the protocol used by `/load/` and `/save/`, just
try hitting the URLs directly in your browser.  For example, visit
http://guide.pencilcode.net/load/ to see the JSON response for
a directory listing.  To see the details of how /load/ and /save/
work, see the code in site/wsgi.

The production site is an nginx server, configured in `nginx/nginx_site.conf`.

The devserver is simpler: it is a node.js proxy server.  When using
the devserver, the proxy.pac will direct the requests to your local
dev server, and the dev server will produce editor.html (and its
related javascript) for `/edit/` urls.  The devserver does not do any
storage - it forwards `/load/` and `/save/` to the live website on
pencilcode.net.

Editor view and storage and controller
--------------------------------------

The PencilCode editor is broken into three main pieces:

* `editor-storage.js` is the storage layer.  It deals with the
  protocol for talking to `/load/` and `/save/` URLs, and it also
  does local caching, offline storage, and backup.  Someday
  when we build a fully offline version of PencilCode, or when
  we adapt it to use Google Drive for storage, the major work
  will be in this file.
* `editor-view.js` is the UI for the development environement.
  It knows how to show directory listings, source code editors,
  and framed run sandboxes.  Other UI affordances: login dialog
  box UI, a butter bar notification, and whizzy horizontal
  animated transitions.  The idea is that the view doesn't
  do any thinking for itself: it just does rendering and
  surfaces events.
* `editor-main.js` is the controller logic.  This is the main
  "business logic" for the editor and sets out what happens
  whenever something happens.  It loads and saves things
  from the storage and pours the data into the view; and
  it responds to events that come from the view.

The view and the main logic are a bit large and probably should
be refactored into further smaller pieces.

Roadmap
=======

Improvements we'd like to make in PencilCode are in several basic
directions:

1. Better Debugging.  That ultimately means giving kids the ability to stop
   and step programs, and visualize their program state (their variables).
2. A Block Language.  That means something like blockly, or maybe
   something new.  The goal is to make it easy to use on the tablet
   while also making it easy for beginners to quickly build
   programs by multiple-choice.
3. Richer Libraries.  The turtle is fun, but we want to point the
   way for students to do many other things: 3d, math, games,
   presentations, music, and so on.
4. A Learning Framework.  Students should be given more guidance
   on which concepts to learn next.  This could be in the form of
   automatic tips, better editor warning messages, exercises, or
   just better (e.g., more visual) navigation throught he site.
5. Community Tools.  The site has grown to more than 1000 users
   pretty quickly.  There should be ways to leave comments on
   on other peoples' sites.  The UI for creating URLs to share
   your work should be easier.  And it should be easier to do basic
   things like change your website name, or find your site once
   you have forgotten its name.
6. Better UI.  Lots of little examples.  Here is one: instead of
   navigating projects by name only, it should be possible to
   navigate them visually.  After you run a project, we should
   capture a bitmap of the drawing and serve thumbnails.

We are always looking for more ideas too.

david.bau@gmail.com

