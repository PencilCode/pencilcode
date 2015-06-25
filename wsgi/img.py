#!/usr/bin/env python
# img.py

import sys, cgi, re, urllib, urllib2, urlparse, collections, os
sys.path.append(os.path.dirname(__file__))
import config
imgdirname = os.path.join(config.cachedir, 'img')

scrapeagent = 'Mozilla/5.0 (Linux x86_64) Gecko/20100101 Firefox/31.0'
scrapeurl = 'https://www.google.com/search?tbm=isch&sa=X&biw=1440&bih=828'
scraper = re.compile(r'href="(?:[^"/]*//[^"/]*)?/imgres?[^"]*imgurl=([^&"]*)')

class HeadRequest(urllib2.Request):
  def get_method(self):
    return "HEAD"

# Some sites redirect image urls to http urls, or don't like hotlinking.
# Blacklist these as we find them.
blacklist = set([
   'atom.smasher.org',
   'pixabay.com',
   'www.public-domain-image.com'
])
cross_origin_ok = set([
#   Wikimedia no longer allows cross-origin!
#   'upload.wikimedia.org'
])

def uri_without_query(uri):
  return uri.split('?', 1)[0]

def splituri(uri):
  return [p for p in uri_without_query(uri).split('/') if p]

def filename_from_uri(uri):
  return '/'.join(splituri(uri)[1:])

keepcharacters = ('-','.',' ','/','_',',',';')
def normname(name):
  safe = re.sub('[- /_,;]+', '-',
     "".join(c for c in name if c.isalnum() or c in keepcharacters)
     ).strip('-')
  safe = re.sub('^s-', '', safe)
  safe = re.sub('^((?:[^-]+-)?)t(?:ransparent)?-', '\\1trans-', safe)
  safe = re.sub('\.jpg$', '.jpeg', safe)
  return safe.lower()

def application(env, start_response):
  redirect_url = None
  try:
    form = cgi.FieldStorage(fp=env['wsgi.input'], environ=env)
    request_uri = env['REQUEST_URI']
    host_name = env['HTTP_HOST']
    if env.has_key('UWSGI_SCHEME'):
      scheme = env['UWSGI_SCHEME']
    elif env.has_key('HTTPS'):
      scheme = 'https'
    else:
      scheme = 'http'
    referer = env.get('HTTP_REFERER', scheme + '://' + host_name + '/')
    agent = env.get('HTTP_USER_AGENT', scrapeagent)
    origin = env.get('HTTP_ORIGIN', None)
    cache_control = env.get('HTTP_CACHE_CONTROL', '')
    pragma = env.get('HTTP_PRAGMA', '')
    userip = env['REMOTE_ADDR']
    filename = normname(urllib.unquote(filename_from_uri(request_uri)))
    m = []

    if m.append(re.match(r'(?i)(https?:)//?([^/]+/.*)$', filename)) or any(m):
      # http://...  is a redirect.  (Note server reduces repeated slashes.)
      p = m.pop()
      redirect_url = p.group(1) + '//' + p.group(2)

    elif filename in cache and not 'no-cache' in cache_control + pragma:
      # Use a cache to a avoid hitting imagesearch repeatedly.
      redirect_url = cache[filename]

    else:
      # TODO: look up a matching filename in the cache.
      fullname = os.path.join(imgdirname, filename)
      if os.path.isfile(fullname):
        redirect_url = file(fullname, 'rb').read()

    if redirect_url is None:
      redirect_url = 'http://pencilcode.net/image/vpencil-20-64.png'

      # Anything else is an imagesearch.
      # Labelled for noncommercial reuse with modification.
      tbs = 'sur:fm'
      terms = filename

      # path with /a/, /i/, /s/, /m/, /l/, or /1024x768/ sizes image
      isz = 's'
      if m.append(re.match(r'([aisml])[-/](.*)$', terms)) or any(m):
        p = m.pop()
        if p.group(1) == 'a':
          isz = None
        else:
          isz = p.group(1)
        terms = p.group(2)
      elif m.append(re.match(r'(\d+)x(\d+)[-/](.*)$', terms)) or any(m):
        p = m.pop()
        isz = 'ex,iszw:' + p.group(1) + ',iszh:' + p.group(2)
        terms = p.group(3)
      if isz is not None:
        tbs += ',isz:' + isz

      # path with /color/, /gray/, /red/, /orange/, etc, selects color
      if m.append(re.match(r'(color|gray|trans)[-/](.*)$', terms)) or any(m):
        p = m.pop()
        tbs += ',ic:' + p.group(1)
        terms = p.group(2)
      elif m.append(re.match(r'(red|orange|yellow|green|teal|blue|purple|' +
          r'pink|white|gray|black|brown)[-/](.*)$', terms)) or any(m):
        p = m.pop()
        tbs += ',ic:specific,isc:' + p.group(1)
        terms = p.group(2)

      # path with /face/, /photo/, /clipart/, /lineart/
      if m.append(re.match(r'(face|photo|clipart|lineart|animated)' +
          r'[-/](.*)$', terms)) or any(m):
        p = m.pop()
        tbs += ',itp:' + p.group(1)
        terms = p.group(2)

      # ends with .gif, .jpeg, etc.
      if m.append(re.match(r'(.*)\.(gif|jpeg|png|bmp|svg|ico|webp)$',
           terms)) or any(m):
        p = m.pop()
        tbs += ',ift:' + p.group(2)
        terms = p.group(1)

      url = scrapeurl + '&safe=active&tbs=' + tbs

      headers = { 'User-Agent': agent, 'Referer': referer }
      if userip:
        # url += '&userip=' + userip
        headers['X-Forwarded-For'] = userip

      query = re.sub(r'[-\s\.\+%&=]+', '+', terms)
      url += '&q=' + query
      request = urllib2.Request(url, None, headers)
      response = urllib2.urlopen(request)
      text = response.read()
      for link in scraper.findall(text):
        candidate = urllib.unquote(link)
        u = urlparse.urlparse(candidate)
        if u.hostname in blacklist:
          continue
        try:
          probe = urllib2.urlopen(HeadRequest(candidate))
        except urllib2.HTTPError, e:
          print 'for', filename, 'probe of', candidate, 'returned', e.code
          continue
        redirect_url = candidate
        cache[filename] = redirect_url
        file(fullname, 'wb').write(redirect_url)
        break

  except Exception as e:
    print e
    pass
  finally:
    if (origin is None or
        urlparse.urlparse(redirect_url).hostname in cross_origin_ok or
        redirect_url.startswith('/proxy/')):
      pass
    else:
      redirect_url = '/proxy/' +  redirect_url

    start_response('302 Redirect', [('Location', redirect_url.encode('utf-8'))])
  return []


class Cache(collections.OrderedDict):
  '''A quick implementation of an LRU cache based on OrderedDict'''

  def __init__(self, nslots=3):
    super(Cache, self).__init__()
    self.nslots = nslots

  if not hasattr(collections.OrderedDict, 'move_to_end'):
    def move_to_end(self, key, last=True):
      if not last:
        raise NotImplementedError(
          'valuers different from True of the "last" parameter are '
          'not supported in this implementation')

      # do not use super().pop because the implemetation uses self[key]
      value = super(Cache, self).__getitem__(key)
      del self[key]
      super(Cache, self).__setitem__(key, value)

  def __getitem__(self, key):
    value = super(Cache, self).__getitem__(key)
    self.move_to_end(key)
    return value

  def __setitem__(self, key, value):
    if self.nslots < 1:
      return

    if len(self) >= self.nslots:
      super(Cache, self).popitem(last=False)

    super(Cache, self).__setitem__(key, value)

  def get(self, k, d=None):
    if k in self:
      self.move_to_end(k)

    return super(Cache, self).get(k, d)

  def __contains__(self, key):
    try:
      super(Cache, self).__getitem__(key)
    except KeyError:
      return False
    else:
      return True

  _internal_getitem = collections.OrderedDict.__getitem__

  class _ValuesView(collections.ValuesView):
    def __contains__(self, value):
      for key in self._mapping:
        if value == self._mapping._internal_getitem(key):
          return True
      return False

    def __iter__(self):
      for key in self._mapping:
        yield self._mapping._internal_getitem(key)

  class _ItemsView(collections.ItemsView):
    def __contains__(self, item):
      key, value = item
      try:
        v = self._mapping._internal_getitem(key)
      except KeyError:
        return False
      else:
        return v == value

    def __iter__(self):
      for key in self._mapping:
        yield (key, self._mapping._internal_getitem(key))

  def values(self):
    return self._ValuesView(self)

  def items(self):
    return self._ItemsView(self)

cache = Cache(nslots=100)
