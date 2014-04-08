#!/usr/bin/env python
# load.py

import sys, os, cgi, re, json, stat, time
sys.path.append(os.path.dirname(__file__))
import config

rootcachename = os.path.join(config.cachedir, 'rootcache')

def uri_without_query(uri):
  return uri.split('?', 1)[0]

def splituri(uri):
  return [p for p in uri_without_query(uri).split('/') if p]

def filename_from_uri(uri):
  return '/'.join(splituri(uri)[1:])

def format_from_uri(uri):
  if 'load' == splituri(uri)[0]:
    return 'json'
  elif 'download' == splituri(uri)[0]:
    return 'download'
  return ''
  

def application(env, start_response):
  form = cgi.FieldStorage(fp=env['wsgi.input'], environ=env)
  request_uri = env['REQUEST_URI']
  host_name = env['HTTP_HOST']
  filename = form.getfirst("file", filename_from_uri(request_uri))
  format = form.getfirst("format", format_from_uri(request_uri))
  callback = form.getfirst("callback", None)
  tail = form.getfirst("tail", None)
  user = '.'.join(host_name.split('.')[:-2])
  domain = '.'.join(host_name.split('.')[-2:])
  origfilename = filename
  if len(user) is 0:
    user = None
  
  try:
    tail = int(tail)
  except:
    tail = None
  
  isrootlisting = (user is None and filename == "" and format == "json")
  if isrootlisting:
    try:
      data = file(rootcachename, 'rb').read()
      start_response('200 OK', [
         ('Cache-Control', 'no-cache, must-revalidate'),
         ('Content-Type', 'text/javascript')
      ])
      if callback is not None:
        return [callback, '(', data, ')']
      else:
        return [data]
    except:
     pass
  
  def jsonout(dict):
    dumps = json.dumps(dict)
    if isrootlisting:
      cache = file(rootcachename, 'wb')
      cache.write(dumps)
      cache.close()
    if callback is not None:
      return [callback, '(', dumps, ')']
    else:
      return [dumps]
  
  def errorexit(s):
    if format == 'json':
      start_response('200 OK', [
         ('Cache-Control', 'no-cache, must-revalidate'),
         ('Content-Type', 'text/javascript')
      ])
      return jsonout({'error': s})
    else:
      start_response('200 OK', [
         ('Content-Type', 'text/html')
      ])
      return ['<plaintext>', s]
  
  def mimetype(ext, filename, data=None):
    result = {
      'jpg'  : 'image/jpeg',
      'jpeg' : 'image/jpeg',
      'gif'  : 'image/gif',
      'png'  : 'image/png',
      'bmp'  : 'image/x-ms-bmp',
      'ico'  : 'image/x-icon',
      'htm'  : 'text/html',
      'html' : 'text/html',
      'txt'  : 'text/plain',
      'text' : 'text/plain',
      'css'  : 'text/css',
      'coffee' : 'text/coffeescript',
      'js'   : 'text/javascript',
      'xml'  : 'text/xml'
    }.get(ext, None)
    if result is None:
      result = 'text/x-turtlebits'
    if result.startswith('text'):
      result += ';charset=utf-8'
    return result
  
  # Validate a good username
  if user is not None:
    if not re.match(r'^[A-Za-z]\w{2,}$', user):
      return errorexit('bad username "%s"' % user)
    filename = os.path.join(user, filename)
  # Validate a good filename
  if (len(filename) and
      not re.match(r'^(?:[\w][\w\.\-]*)(?:/[\w][\w\.\-]*)*/?$', filename)):
    return errorexit('bad filename "%s"' % filename)
  if (len(filename) and
      not re.match(r'^(?:[\w][\w\.\-]*)(?:/[\w][\w\.\-]*)*/?$', filename)):
    return errorexit('bad filename "%s"' % filename)
  absfile = os.path.join(config.datadir, filename)
  if not absfile.startswith(config.datadir):
    return errorexit('illegal filename "%s"' % filename)
  
  def validnewfile(abs):
    while True:
      if os.path.isfile(abs):
        return False
      abs = os.path.dirname(abs)
      if not absfile.startswith(config.datadir):
        return False
      if os.path.isdir(abs):
        return True
  
  def direntry(absdir, filename):
    fn = os.path.join(absdir, filename)
    fs = os.stat(fn)
    (mode, ino, dev, nlink, uid, gid, size, atime, mtime, ctime) = fs
    modestr = ''
    if stat.S_ISDIR(mode): modestr += 'd'
    if mode & stat.S_IRUSR: modestr += 'r'
    if mode & stat.S_IWUSR: modestr += 'w'
    if mode & stat.S_IXUSR: modestr += 'x'
    mtime = fs.st_mtime
    if 'd' not in modestr and size == 0:
      mtime = 0
    return { 'name': filename, 'mode': modestr,
      'size': fs.st_size, 'mtime': mtime }
  
  def readtail(f, lines):
    if lines <= 0:
      return ''
    f.seek(0, 2)
    bytes = f.tell()
    size = lines
    block = -1
    while size > 0:
      truncate = min(0, bytes + block * 1024)
      f.seek(block * 1024 - truncate, 2) # from the end
      data = f.read(truncate + 1024)
      linesFound = data.count('\n')
      size -= linesFound
      block -= 1
      if truncate: break
    truncate = min(0, bytes + block * 1024)
    f.seek(block * 1024 - truncate, 2)
    while size < 0:
      f.readline()
      size += 1
    return f.read()
  
  def userhaskey(user):
    if not user:
      return False
    keydir = os.path.join(config.datadir, user, '.key')
    if not os.path.isdir(keydir):
      return False
    keys = os.listdir(keydir)
    return len(keys) > 0
  
  if format == 'json':
    haskey = userhaskey(user)
    if os.path.isfile(absfile):
      f = file(absfile, 'r')
      if tail is not None:
        data = readtail(f, tail)
      else:
        data = f.read()
      fs = os.fstat(f.fileno())
      (mode, ino, dev, nlink, uid, gid, size, atime, mtime, ctime) = (
          os.fstat(f.fileno()))
      f.close()
      ext = filename.rsplit('.', 1)[-1]
      mimet = mimetype(ext, absfile, data)
      start_response('200 OK', [
         ('Cache-Control', 'no-cache, must-revalidate'),
         ('Content-Type', 'text/javascript')
      ])
      return jsonout({'file': '/' + filename, 'data': data,
          'auth': haskey, 'mtime': fs.st_mtime, 'mime': mimet})
    if os.path.isdir(absfile):
      if len(filename) and not filename.endswith('/'):
        filename += '/'
      contents = os.listdir(absfile) or []
      contents = sorted([fn for fn in contents if not fn.startswith('.')])
      list = [direntry(absfile, n) for n in contents]
      start_response('200 OK', [
         ('Cache-Control', 'no-cache, must-revalidate'),
         ('Content-Type', 'text/javascript')
      ])
      return jsonout({'directory': '/' + filename,
                     'list': list,
                     'auth': haskey})
    if len(filename) and not filename.endswith('/') and validnewfile(absfile):
      start_response('200 OK', [
         ('Cache-Control', 'no-cache, must-revalidate'),
         ('Content-Type', 'text/javascript')
      ])
      return jsonout({'error': 'could not read file %s' % filename,
                     'newfile': True,
                     'auth': haskey,
                     'info': absfile})
    return errorexit('could not read file %s' % filename)
  
  if format == 'download' and os.path.isfile(absfile):
    shortfilename = re.sub('^.*/', '', filename)
    if tail is not None:
      data = readtail(file(absfile, 'r'), tail)
    else:
      data = file(absfile, 'r').read()
    start_response('200 OK', [
       ('Cache-Control', 'no-cache, must-revalidate'),
       ('Content-Type', 'application/octet-stream'),
       ('Content-Disposition', 'attachment; filename=%s' % shortfilename),
       ('Content-Length', '%d' % len(data))
    ])
    return data
  
  def wrapturtle(text):
    return (
    '<!doctype html>\n<html>\n<head>\n' +
    '<script src="http://%s/turtlebits.js"></script>\n' % (domain) +
    '</head>\n<body><script type="text/coffeescript">\neval $.turtle()\n\n' +
    text + '\n</script></body></html>')
  
  if os.path.isfile(absfile):
    split = filename.rsplit('.', 1)
    ext = None if len(split) < 2 else split[-1]
    data = file(absfile, 'r').read()
    mt = mimetype(ext, absfile, data)
    # for turtlebits: if there is no extension and it looks like a non-HTML
    # text file, assume it is coffeescript that should be wrapped in HTML.
    if mt.startswith('text/x-turtlebits'):
      data = wrapturtle(data)
      mt = mt.replace('x-turtlebits', 'html')
    start_response('200 OK', [
       ('Cache-Control', 'no-cache'),
       ('Content-Type', mt)
    ])
    return data
  
  elif os.path.isdir(absfile) or not '/' in filename.rstrip('/'):
    if len(filename) and not filename.endswith('/'):
      start_response('301 Redirect', [('Location', request_uri + '/')])
      return []
    start_response('200 OK', [
       ('Cache-Control', 'no-cache'),
       ('Content-Type', 'text/html;charset=utf-8')
    ])
    result = []
    result.append('<title>%s</title>\n' % (request_uri))
    result.append('<style>\n')
    result.append('body { font-family:Arial,sans-serif; }\n')
    result.append('pre {\n')
    result.append('-moz-column-count:3;\n')
    result.append('-webkit-column-count:3;\n')
    result.append('column-count:3;\n')
    result.append('}\n')
    result.append('</style>\n')
    result.append(absfile)
    result.append('<h3>%s</h3>\n' % (env['HTTP_HOST'] + request_uri))
  
    contents = os.path.isdir(absfile) and os.listdir(absfile) or []
    contents = [fn for fn in contents if not fn.startswith('.')]
    result.append('<pre>\n')
    if len(request_uri.strip('/').split('/')) > 1:
      result.append('<a href="%s" style="background:yellow">Up to %s</a>\n' % (
        os.path.dirname(request_uri.rstrip('/')) + '/',
        os.path.dirname(request_uri.rstrip('/')) + '/'))
    for name in sorted(contents):
      af = os.path.join(absfile, name)
      if os.path.isdir(af) and not name.endswith('/'):
        name += '/'
      link = '<a href="%s">%s</a>' % (request_uri + name, name)
      if os.path.isfile(af):
        link += (' <a href="%s" style="color:lightgray" rel="nofollow">edit</a>'
                % ('/edit/' + filename + name))
      result.append(link + '\n')
    result.append('</pre>\n')
  
    if len(contents) == 0:
      result.append('(directory is empty)<br>\n')
    return result
  elif filename.endswith('/'):
    start_response('301 Redirect', [('Location',
        os.path.dirname(request_uri.rstrip('/')) + '/')])
    return []
  
  else:
    start_response('200 OK', [
       ('Cache-Control', 'no-cache'),
       ('Content-Type', 'text/html;charset=utf-8')
    ])
    result = []
    result.append('<pre>\n')
    result.append('No file %s found.\n\n' % origfilename)
    result.append('<a href="%s">Up to %s</a>\n' % (
        os.path.dirname(request_uri.rstrip('/')) + '/',
        os.path.dirname(request_uri.rstrip('/')) + '/'))
    if filename.rsplit('.', 1)[-1] in ['htm', 'html', 'js', 'css']:
      print
      result.append('<a href="%s" rel="nofollow">Create %s</a>\n' % (
          '/edit/' + origfilename, '/home/' + origfilename))
    result.append('</pre>\n')
    return result
