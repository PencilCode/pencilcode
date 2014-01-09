#!/usr/bin/env python

import sys, os, cgi, cgitb, re, json, base64, time, shutil, string
progpath = os.path.dirname(__file__)
sys.path.append(progpath)
import config

rootcachename = os.path.join(config.cachedir, 'rootcache')

def uri_without_query(uri):
  return uri.split('?', 1)[0]

def splituri(uri):
  return [p for p in uri_without_query(uri).split('/') if p]

def filename_from_uri(uri):
  return '/'.join(splituri(uri)[1:])

# Form fields:
# file="parent/dir/filename.ext" - The destination location.
# data="hello world.\nthis is a file.\n' - Data to write.
# key="888" - Short (insecure) password key to authorize user.
# source="other/dir/filename.ext" - File or directory to copy or move.
# sourcekey - For mv, authorization for the source file.
# mode=
#  "a" to append data,
#  "mv" to move source,
#  "rmtree" to remove dir.
#  "setkey" to set key.

def application(env, start_response):
  form = cgi.FieldStorage(
      fp=env['wsgi.input'], environ=env, keep_blank_values=True)
  request_uri = env['REQUEST_URI']
  host_name = env['HTTP_HOST']
  filename = form.getfirst("file", filename_from_uri(request_uri))
  data = form.getfirst("data", None)
  callback = form.getfirst("callback", None)
  sourcefile = form.getfirst("source", None)
  mode = form.getfirst("mode", None)
  conditional = form.getfirst("conditional", None)
  key = form.getfirst("key", '')
  sourcekey = form.getfirst("sourcekey", key)
  user = '.'.join(host_name.split('.')[:-2])
  domain = '.'.join(host_name.split('.')[-2:])
  origfilename = filename
  if len(user) is 0:
    user = None
  
  try:
    os.remove(rootcachename)
  except:
    pass
  
  def jsonout(dict):
    if callback is not None:
      return callback + '(' + json.dumps(dict) + ')'
    else:
      return json.dumps(dict)
 
  class ImmediateReturnException(Exception):
    def __init__(self, message, json):
      super(ImmediateReturnException, self).__init__(message)
      self.json = json

  def errorexit(s):
    raise ImmediateReturnException(s, exitdata({'error': s}))
  
  def exitdata(d):
    start_response('200 OK', [
      ('Content-Type', 'text/javascript')
    ])
    return jsonout(d)
  
  def filenameuser(fn):
    m = re.match(r'^([\w][\w\.\-]*)(?:/.*)?$', filename)
    if m is None:
      return None
    return m.group(1)
  
  def validkey(user, key):
    keydir = os.path.join(config.datadir, user, '.key')
    if not os.path.isdir(keydir):
      return True
    keys = os.listdir(keydir)
    if len(keys) == 0:
      return True
    for authorized in keys:
      if key.startswith(authorized[1:]):
        return True
  
  def setkey(user, oldkey, newkey):
    if oldkey == newkey:
      return
    keydir = os.path.join(config.datadir, user, '.key')
    try:
      if not os.path.isdir(keydir):
        checkreserveduser(user)
        os.makedirs(keydir)
      if oldkey is not None:
        keys = os.listdir(keydir)
        for authorized in keys:
          if oldkey.startswith(authorized[1:]):
            os.remove(os.path.join(keydir, authorized))
      if newkey is not None:
        keyfile = os.path.join(keydir, 'k' + newkey)
        open(keyfile, 'w').close()
    except OSError, exc:
      errorexit('Could not set key.')
  
  def checkreserveduser(user):
    if os.path.isdir(os.path.join(config.datadir, user)):
      return
    if user.lower() != user:
      errorexit('Username should be lowercase.')
    normalized = user.lower()
    if os.path.isdir(os.path.join(config.datadir, normalized)):
      errorexit('Username is reserved.')
    normalized = user.lower()
    if normalized != user and os.path.isdir(
          os.path.join(config.datadir, normalized)):
      errorexit('Username is reserved.')
    normalizedi = normalized.translate(string.maketrans('013456789', 'oieasbtbg'))
    if normalized != normalizedi and os.path.isdir(
          os.path.join(config.datadir, normalizedi)):
      errorexit('Username is reserved.')
    normalizedl = normalized.translate(string.maketrans('013456789', 'oleasbtbg'))
    if normalizedl != normalized and os.path.isdir(
          os.path.join(config.datadir, normalizedl)):
      errorexit('Username is reserved.')
    with open(os.path.join(progpath, 'bad-words.txt')) as f:
      badwords = f.read().splitlines()
    if any(word in badwords for word in [normalized, normalizedi, normalizedl]):
      errorexit('Username is reserved.')
    with open(os.path.join(progpath, 'bad-substrings.txt')) as f:
      badsubstrings = f.read().splitlines()
    if any(substring in word
         for word in [normalized, normalizedi, normalizedl]
         for substring in badsubstrings):
      errorexit('Username is reserved.')
    return

  try:
    
    # Validate params
    if data is not None and sourcefile is not None:
      errorexit('Cannot supply both data and source.')
    if mode is not None and mode not in (
        sourcefile and ['mv'] or
        data and ['a', 'setkey'] or
        (not data and not sourcefile) and ['rmtree', 'setkey']):
      errorexit('Illegal mode %s.' % mode + repr(data))
    if conditional is not None:
      if not re.match(r'^\d+(?:\.\d*)?$', conditional):
        errorexit('Illegal conditional %s.' % conditional)
      conditional = float(conditional)
    
    # Validate a good username
    if user is not None:
      if not re.match(r'^[A-Za-z]\w{2,}$', user):
        errorexit('Bad username "%s".' % user)
      filename = os.path.join(user, filename)
    # Validate a good filename: must have a leading dir.
    topdir = False
    if not re.match(r'^(?:[\w][\w\.\-]*)(?:/[\w][\w\.\-]*)+/?$', filename):
      # The rmtree and mv case are allowed to be a bare leading dir, subject
      # to additional checks.
      if (mode == 'setkey' or (data is None and (
          mode in ['rmtree', 'mv'] or (sourcefile is not None))) and
          re.match(r'^[\w][\w\\-]*/?$', filename)):
        topdir = True
      else:
        errorexit('Bad filename "%s".' % filename)
    absfile = os.path.join(config.datadir, filename)
    if not absfile.startswith(config.datadir):
      errorexit('Illegal filename "%s".' % filename)
    userdir = None
    if user:
      userdir = os.path.join(config.datadir, user)
    
    # Validate that the user's key matches the supplied key
    if not validkey(user, key):
      if not key:
        return exitdata({'error': 'Password protected.', 'needauth': 'key'})
      else:
        return exitdata({'error': 'Incorrect password.', 'needauth': 'key'})
    
    # Handle the setkey case
    if mode == 'setkey':
      if not topdir:
        errorexit('Can only set key on a top-level user directory.')
      setkey(user, key, data)
      return exitdata(data is None and {'keycleared': user} or {'keyset': user});
    
    # Handle the copy/move case
    if sourcefile is not None:
      if not re.match(r'^(?:[\w][\w\.\-]*)(?:/[\w][\w\.\-]*)*/?$', sourcefile):
        errorexit('Bad source filename "%s".' % sourcefile)
      sourceuser = filenameuser(sourcefile)
      abssourcefile = os.path.join(config.datadir, sourcefile)
      if not abssourcefile.startswith(config.datadir):
        errorexit('Illegal source filename "%s".' % sourcefile)
      if not os.path.exists(abssourcefile):
        errorexit('Source file "%s" does not exist.' % sourcefile)
      # Validate that only directories can be copied or moved to the top.
      if topdir and not os.path.isdir(abssourcefile):
        errorexit('Bad filename "%s".' % filename)
      # mv requires authorization on source dir
      if mode == 'mv':
        if not validkey(sourceuser, sourcekey):
          if not key:
            return exitdata({'error': 'Source password protected.', 'auth': 'key'})
          else:
            return exitdata({'error': 'Incorrect source password.', 'auth': 'key'})
      # create target parent directory
      if not os.path.isdir(os.path.dirname(absfile)):
        checkreserveduser(user)
        try:
          os.makedirs(os.path.dirname(absfile))
        except OSError, exc:
          errorexit('Could not create dir "%s".' % os.path.dirname(filename))
      # move case
      if mode == 'mv':
        if os.path.exists(absfile):
          errorexit('Cannot replace existing file "%s".' % filename)
        try:
          shutil.move(abssourcefile, absfile)
          try:
            os.removedirs(os.path.dirname(abssourcefile))
          except OSError, exc:
            pass
          # remove .key when moving top dir into deeper dir
          if topdir and filename != user:
            shutil.rmtree(os.path.join(absfile, '.key'))
        except OSError, exc:
          errorexit('Could not move "%s" to "%s".' % (sourcefile, filename))
      # copy case
      else:
        try:
          if os.path.isdir(abssourcefile):
            if os.path.exists(absfile):
              errorexit('Cannot overwrite existing directory "%s".' % filename)
            shutil.copytree(abssourcefile, absfile, ignore_patterns('.key'))
          else:
            shutil.copy2(abssourcefile, absfile)
        except OSError, exc:
          errorexit('Could not copy "%s" to "%s".' % (sourcefile, filename))
      try:
        os.utime(userdir, None)
      except OSError, exc:
        pass
      return exitdata({'saved' : filename})
    
    # Enforce the conditional request
    if conditional:
      if os.path.exists(absfile):
        mtime = os.stat(absfile).st_mtime
        if mtime > conditional:
          return exitdata({'error': 'Did not overwrite newer file.', 'newer': mtime})
    
    # Handle the delete case
    if not data:
      if not form.has_key('data'):
        errorexit('Missing data= cgi argument.')
      if os.path.exists(absfile):
        try:
          if os.path.isdir(absfile):
            if mode == 'rmtree':
              shutil.rmtree(absfile)
            else:
              os.rmdir(absfile)
          else:
            os.remove(absfile)
        except OSError, exc:
          errorexit('Could not remove "' + absfile + '".')
        try:
          os.removedirs(os.path.dirname(absfile))
        except OSError, exc:
          pass
      try:
        if userdir != absfile:
          os.utime(userdir, None)
      except OSError, exc:
        pass
      return exitdata({'deleted' : filename})
    
    # Validate data
    if len(data) >= 1024 * 1024:
      errorexit('Data too large.')
    
    # Handle the create/replace case
    if not os.path.isdir(os.path.dirname(absfile)):
      checkreserveduser(user)
      try:
        os.makedirs(os.path.dirname(absfile))
      except OSError, exc:
        errorexit('Could not create dir "' + os.path.dirname(filename) + '".')
    
    try:
      f = file(absfile, (mode == 'a' and 'a' or 'w'))
      f.write(data)
      f.flush()
      os.fsync(f.fileno());
      fs = os.fstat(f.fileno())
      f.close()
    except IOError, err:
      errorexit('Error writing file "' + absfile + '".')
    try:
      os.utime(userdir, None)
    except OSError, exc:
      pass
    
    return exitdata(
        {'saved' : filename, 'mtime': fs.st_mtime, 'size': fs.st_size})
  except ImmediateReturnException, e:
    return e.json
