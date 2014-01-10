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
The prerequisites are a standard node.js development environment:
git, nodejs, and grunt, and they are pretty easy to install.

For example, on Ubuntu, to get the prereqs, just:

<pre>
sudo apt-get install git
sudo apt-get install nodejs
sudo npm install -g grunt-cli
</pre>

On the Mac, git comes from Apple (just agree to their license),
and node.js can be installed from http://nodejs.org/download/.

On Windows, git can be installed from here:
http://git-scm.com/download/win and node.js can be installed
from here: http://nodejs.org/download/.

Because node.js does not work on cygwin, when I work with node.js
on a Windows box, I just run debian under https://www.virtualbox.org/.


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
devserver's localhost:8008/proxy.pac.  For example, with chrome
on OSX, add the following to your .bashrc:

<pre>
alias chrome="/Applications/Google\\ \\Chrome.app/Contents/MacOS/Google\\ \\Chrome"
alias devchrome="chrome --proxy-pac-url=http://127.0.0.1:8008/proxy.pac"
</pre>

When running devchrome, any URL with a hostname that ends with ".dev"
will be routed to the development server.  Visit http://pencilcode.net.dev/
to browse your local copy of the website.


PencilCode Internals
====================

The structure of pencilcode is really simple.
* It is a single HTML file site/top/editor.html that does all the work
  All pencilcode.net/edit/... URLs resolve to this static file.
* The javascript behind editor.html is in the src/ directory (symlink
  to site/top/src).  These javascript files are combined and minified
  into site/top/editor.js by the build.
* The editor javascript does JSON requests to pencilcode.net/load/...
  and pencilcode.net/save/... to read and write actual data.
* There are a bunch of other static files that can be found in
  site/top.

JSON save and load
------------------

To get a sense for the protocol used by /load/ and /save/, just
try hitting the URLs directly in your browser.  For example, visit
http://guide.pencilcode.net/load/ to see the JSON response for
a directory listing.  To see the details of how /load/ and /save/
work, see the code in site/wsgi.

The production site is an nginx server, configured in site/nginx_site.conf.

The devserver is simpler: it is a node.js proxy server.  When using
the devserver, the proxy.pac will direct the requests to your local
dev server, and the dev server will produce editor.html (and its
related javascript) for /edit/ urls.  The devserver does not do any
storage - it forwards /load/ and /save/ to the live website on
pencilcode.net.

Editor view and storage and controller
--------------------------------------

The PencilCode editor is broken into three main pieces:

* editor-storage.js is the storage layer.  It deals with the
  protocol for talking to /load/ and /save/ URLs, and it also
  does local caching, offline storage, and backup.  Someday
  when we build a fully offline version of PencilCode, or when
  we adapt it to use Google Drive for storage, the major work
  will be in this file.
* editor-view.js is the UI for the development environement.
  It knows how ot show directory listings, source code editors,
  and framed run sandboxes.  Other UI affordances: login dialog
  box UI, a butter bar notification, and whizzy horizontal
  animated transitions.  The idea is that the view doesn't
  do any thinking for itself: it just does rendering and
  surfaces events.
* editor-main.js is the controller logic.  This is the main
  "business logic" for the editor and sets out what happens
  whenever something happens.  It loads and saves things
  from the storage and pours the data into the view; and
  it responds to events that come from the view.

The view and the main logic are a bit large and probably should
be refactored into further smaller pieces.
