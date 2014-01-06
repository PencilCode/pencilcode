The structure of pencilcode is really simple.
* It is a single HTML file site/top/editor.html that does all the work
  (to be split up into multiple files someday soon).  All
  pencilcode.net/edit/... URLs resolve to this static file.
* That file does JSON requests to pencilcode.net/load/... and
  pencilcode.net/save/... to read and write actual data.
* There are a couple other static files: welcome.html for the root index file;
  dir.html for /home/ directory listing.

Here is how to get your own little local copy of pencilcode, running
your own frontend HTML and Javascript:

1. prerequisites: be a javascript hispter and install git and node.js
   on your system, then "npm install -g grunt-cli" to install grunt.
2. get the source: git clone https://github.com/PencilCode/pencilcode-site.git
3. pull in source deps: "cd pencilcode-site" and then "npm install"
4. build the dev server: "grunt devserver" - this will keep a server
   running until you ctrl-C.

<pre>
sudo apt-get install git
sudo apt-get install nodejs
sudo npm install -g grunt-cli
git clone https://github.com/PencilCode/pencilcode-site.git
cd pencilcode-site
npm install
grunt devserver
</pre>

Then, to use it with clean HTTP "Host" headers:
5. Take the proxy.pac it prints out (like http://127.0.0.1:8008/proxy.pac)
   and put this into your browser's proxy autoconfig.
6. Then visit http://newbie.pencilcode.net.dev/edit/ - notice you just add
   that ".dev" at the end of the domain name to forward to 127.0.0.1:8008.

There are a couple weird issues that are solved by this config: e.g., how
do you develop locally on a website that depends on subdomains without
running your own DNS server or something?  This solution is based on the
one described by Dave South (google [subdomain development proxy.pac]).

The proxy autoconfig will direct the requests to your local dev server,
and the dev server will produce editor.html for /edit/ urls.  The devserver
does not do any storage - it forwards /load/ and /save/ to pencilcode.net.
It just serves static files, which should be enough to do pretty major
experimentation with alternate editors, debuggers, tutorial UI, etc.
