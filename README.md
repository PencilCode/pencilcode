How To Build and Test PencilCode
================================

First install the prerequisites: git, nodejs, and grunt.  Then:

<pre>
git clone https://github.com/PencilCode/pencilcode-site.git
cd pencilcode-site
npm install
grunt
</pre>

Development can be done on Linux, Mac, or Windows.
The prerequisites are a standard node.js development environment,
which is very widely used.

Prerequisites
-------------

First, you need git, which is easy.  On Linux,
just `sudo apt-get install git` or `sudo yum install git-core`
if you don't have it.

Second, you need node.js (which is the `node` and `npm` binaries)
and `grunt` (which is the build tool popular in the node.js community).
The Ubuntu and Debian packages for node.js are pretty old, so don't
just apt-get install the packages.  Get and build the latest `node` and
`npm` and `grunt` binaries as follows:

<pre>
mkdir -p /tmp/nodejs && cd /tmp/nodejs
wget -N http://nodejs.org/dist/node-latest.tar.gz
tar xzvf node-latest.tar.gz && cd `ls -rd node-v*`
./configure --prefix=$HOME/local
make install
echo 'export PATH=$HOME/local/bin:$PATH' &gt;&gt; ~/.bashrc
source ~/.bashrc
npm install -g grunt-cli
</pre>

The above drops all the built binaries into `~/local/bin` so you
don't need root.

On the Mac, git comes from Apple (just agree to their license),
and node.js can be installed from http://nodejs.org/download/.
You will need to `sudo npm install -g grunt-cli`.

On Windows, git can be installed from here:
http://git-scm.com/download/win and node.js can be installed
from here: http://nodejs.org/download/.  Windows development
is untested, but if you try it, let me know.

Because node.js does not work on cygwin, when I work with node.js
on a Windows box, I just run it with debian under a vbox instance
https://www.virtualbox.org/.


How To Experiment with PencilCode
=================================

To experiment with PencilCode, you will want to run a local
copy of the site's frontend.  The development server actually
runs as a proxy server, which allows the server to intercept
full hostnames without actually owning the DNS names.

To start the dev server (by default it runs on localhost:8008):

<pre>
grunt devserver
</pre>

To use the devserver, launch your web browser pointing to the
devserver's `http://localhost:8008/proxy.pac`.  For example, with chrome
on OSX, add the following to your .bashrc:

<pre>
alias chrome="/Applications/Google\\ \\Chrome.app/Contents/MacOS/Google\\ \\Chrome"
alias devchrome="chrome --proxy-pac-url=http://127.0.0.1:8008/proxy.pac --user-data-dir=$HOME/devchrome"
</pre>

On Linux:

<pre>
alias devchrome="google-chrome --proxy-pac-url=http://127.0.0.1:8008/proxy.pac --user-data-dir=$HOME/devchrome"
</pre>

When running devchrome, any URL with a hostname that ends with ".dev"
will be routed to the development server.  Visit http://pencilcode.net.dev/
to browse your local copy of the website.


PencilCode Internals
====================

The structure of pencilcode is really simple.
* It is a single HTML file `site/top/editor.html` that does all the work
  All `pencilcode.net/edit/...` URLs resolve to this static file.
* The javascript behind editor.html is in the `src/` directory (symlink
  to `site/top/src`).  These javascript files are combined and minified
  into site/top/editor.js by the build.
* The editor javascript does JSON requests to `pencilcode.net/load/...`
  and `pencilcode.net/save/...` to read and write actual data.
* There are a bunch of other static files that can be found in
  `site/top`.

JSON save and load
------------------

To get a sense for the protocol used by `/load/` and `/save/`, just
try hitting the URLs directly in your browser.  For example, visit
http://guide.pencilcode.net/load/ to see the JSON response for
a directory listing.  To see the details of how /load/ and /save/
work, see the code in site/wsgi.

The production site is an nginx server, configured in `site/nginx_site.conf`.

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
  It knows how ot show directory listings, source code editors,
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

1. Better Debugging.  That means highlighting lines as they run,
   ultimately giving kids the ability to stop and step programs,
   and visualize their program state (their variables).
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

