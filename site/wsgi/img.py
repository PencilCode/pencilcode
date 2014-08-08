#!/usr/bin/env python
# load.py

import sys, os, cgi, re, json, stat, time, urllib, urllib2
sys.path.append(os.path.dirname(__file__))
import config

rootcachename = os.path.join(config.cachedir, 'rootcache')

def uri_without_query(uri):
  return uri.split('?', 1)[0]

def uri_ext(url):
  url = uri_without_query(url)
  dot = url.rfind('.')
  if dot < 0:
    return ''
  return url[dot + 1:]

def uri_without_query(uri):
  return uri.split('?', 1)[0]

def splituri(uri):
  return [p for p in uri_without_query(uri).split('/') if p]

def filename_from_uri(uri):
  return '/'.join(splituri(uri)[1:])

def application(env, start_response):
  redirect_url = 'http://pencilcode.net/pencil_32.png'
  try:
    form = cgi.FieldStorage(fp=env['wsgi.input'], environ=env)
    request_uri = env['REQUEST_URI']
    host_name = env['HTTP_HOST']
    referer = env.get('HTTP_REFERER',
      env['UWSGI_SCHEME'] + '://' + env['HTTP_HOST'] + '/')
    userip = env['REMOTE_ADDR']
    filename = filename_from_uri(request_uri)
    scrapeurl = 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0'
    scrapeurl += '&safe=active'
    if userip:
      scrapeurl += '&userip=' + userip
    scrapeurl += '&q=' + filename
    request = urllib2.Request(scrapeurl, None, {'Referer': referer})
    response = urllib2.urlopen(request)
    resulttext = response.read();
    results = json.loads(resulttext)
    redirect_url = results['responseData']['results'][0]['unescapedUrl']
  except:
    pass
  finally:
    start_response('302 Redirect', [('Location', redirect_url.encode('utf-8'))])
  return []
