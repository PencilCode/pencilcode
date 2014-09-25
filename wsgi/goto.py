#!/usr/bin/env python
# img.py

import cgi, re, urllib, urllib2, collections


scrapeagent = 'Mozilla/5.0'
scrapeurl = 'https://www.google.com/search?safe=on&btnI='
scraper = re.compile(r'HREF="([^"])*"')
def uri_without_query(uri):
  return uri.split('?', 1)[0]

def splituri(uri):
  return [p for p in uri_without_query(uri).split('/') if p]

def filename_from_uri(uri):
  return '/'.join(splituri(uri)[1:])

def application(env, start_response):
  redirect_url = 'http://pencilcode.net/'
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
    cache_control = env.get('HTTP_CACHE_CONTROL', '')
    pragma = env.get('HTTP_PRAGMA', '')
    userip = env['REMOTE_ADDR']
    filename = filename_from_uri(request_uri)
    m = []

    if m.append(re.match(r'(?i)(https?:)//?(.+)$', filename)) or any(m):
      # http://...  is a redirect.  (Note server reduces repeated slashes.)
      p = m.pop()
      redirect_url = p.group(1) + '//' + p.group(2)

    elif filename in cache and not 'no-cache' in cache_control + pragma:
      # Use a cache to a avoid hitting imagesearch repeatedly.
      redirect_url = cache[filename]

    else:
      # Do a google IFL search redirect.
      query = re.sub(r'[-\s\.\+%&=]+', '+', filename)
      url = scrapeurl + '&q=' + query

      headers = { 'User-Agent': agent, 'Referer': referer }
      if userip:
        # url += '&userip=' + userip
        headers['X-Forwarded-For'] = userip

      opener = urllib2.build_opener(RedirectHandler())
      opener.addheaders = headers.items()
      response = opener.open(url)
      location = response.info().getheader('Location', None)
      if location:
        redirect_url = location
        cache[filename] = redirect_url
      else:
        text = response.read()
        result = scraper.search(text)
        if result:
          redirect_url = urllib.unquote(result.group(1))
          cache[filename] = redirect_url

  except Exception as e:
    print e
    pass
  finally:
    start_response('302 Redirect', [('Location', redirect_url.encode('utf-8'))])
  return []


class RedirectHandler(urllib2.HTTPRedirectHandler):
  def http_error_302(self, req, fp, code, msg, headers):
    result = urllib2.HTTPError(req.get_full_url(), code, msg, headers, fp)
    result.status = code
    return result
  http_error_301 = http_error_303 = http_error_307 = http_error_302

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
