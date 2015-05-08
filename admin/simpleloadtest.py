# A simple loadtest using locust.
# launch using: locust -f simpleloadtest.py --host=http://pencilcode.net

from locust import HttpLocust, TaskSet, task
import simplejson, random, os, resource, string, re

resource.setrlimit(resource.RLIMIT_NOFILE, (65536, 65536))


hosts = os.environ.get('SERVERS').split(',')
passfile = os.environ.get('PASSFILE')
passwords = {
  'livetest': '123'
}
if passfile is not None:
  passwords = simplejson.load(file(passfile))

listusers = True

class MyTaskSet(TaskSet):
    def qualify(self, url):
      result = 'http://' + random.choice(hosts) + url
      return result

    def userdomain(self, user):
      if user is not None and len(user) > 0:
        return user + '.pencilcode.net'
      return 'pencilcode.net'

    def topget(self, url):
      name = re.sub('=[^&=]+', '=...', url)
      return self.client.get(self.qualify(url),
        headers={"User-Agent":"locust", "Host": self.userdomain(None)},
        name=name)

    def myget(self, user, url):
      slashpos = url.find('/', 1) + 1 or len(url)
      name = 'user:' + url[:slashpos]
      if slashpos < len(url):
        name += '...'

      return self.client.get(self.qualify(url),
        headers={"User-Agent":"locust", "Host": self.userdomain(user)},
        name=name)

    def mypost(self, user, url, data):
      slashpos = url.find('/', 1) + 1 or len(url)
      name = 'user:' + url[:slashpos]
      if slashpos < len(url):
        name += '...'

      return self.client.post(self.qualify(url), data,
        headers={"User-Agent":"locust", "Host": self.userdomain(user)},
        name=name)

    @task(1)
    def index(self):
        urls = ['/', '/welcome.css', '/image/vpencil-20-64.png',
            '/image/art.png', '/image/music.png', '/image/adventure.png',
            '/lib/jquery.js', '/lib/jquery.autocomplete.min.js',
            '/lib/seedrandom.js', '/turtlebits.js']
        if listusers:
          urls.append('/load/?callback=loadusers')
          if random.randrange(2) > 0:
            prefix = random.choice(string.ascii_letters).lower();
          else:
            prefix = random.choice(passwords.keys())
          urls.append('/load/?prefix=' + prefix)
        for url in urls:
          self.topget(url)
        for url in ['/home/promo1', '/home/goldwheel-code.png']:
          self.myget('promo', url)

    @task(1)
    def edit(self):
        if listusers:
          try:
            topdir = self.topget("/load/").json()
          except:
            print 'error listing all users'
            return
          randuser = random.choice(topdir['list'])
          randname = randuser['name']
          if 'd' not in randuser['mode']:
            return
        else:
          randname = random.choice(passwords.keys())
        for url in ['/edit/', '/load/']:
          self.myget(randname, url)
        for url in ['/editor.js', '/favicon.ico',
            '/apple-touch-icon.png']:
          self.topget(url)

    @task(1)
    def browserandom(self):
        randname = random.choice(passwords.keys())
        try:
          mydir = self.myget(randname, '/load/').json()
        except Exception as e:
          print 'error listing ' + randname + ' ' + str(e)
          raise
        if len(mydir['list']) == 0:
          return
        randfile = random.choice(mydir['list'])['name']
        try:
          self.myget(randname, '/load/' + randfile).json()
        except Exception as e:
          print 'error reading ' + randname + ' ' + randfile + ' ' + str(e)
          raise

    @task(1)
    def saverandom(self):
        randname = random.choice(passwords.keys())
        try:
          myok = self.mypost(randname, '/save/loadtest', {
            'data': 'pen red\nfor [1..4]\n  fd 100\n  rt 90',
            'key': passwords[randname]
          }).json()
        except Exception as e:
          print 'error saving ' + randname + ' ' + str(e)
          raise


class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 5000
    max_wait = 20000
