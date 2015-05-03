# A simple loadtest using locust.
# launch using: locust -f simpleloadtest.py --host=http://pencilcode.net

from locust import HttpLocust, TaskSet, task
import simplejson, random, os

hosts = os.environ.get('SERVERS').split(',')
passfile = os.environ.get('PASSFILE')
passwords = {
  'livetest': '123'
}
if passfile is not None:
  passwords = simplejson.load(file(passfile))


class MyTaskSet(TaskSet):
    def qualify(self, url):
      result = 'http://' + random.choice(hosts) + url
      return result

    def userdomain(self, user): 
      if user is not None and len(user) > 0:
        return user + '.pencilcode.net'
      return 'pencilcode.net'

    def topget(self, url):
      return self.client.get(self.qualify(url),
        headers={"User-Agent":"locust", "Host": self.userdomain(None)})

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
        for url in ['/', '/welcome.css', '/image/vpencil-20-64.png',
            '/image/art.png', '/image/music.png', '/image/adventure.png',
            '/lib/jquery.js', '/lib/jquery.autocomplete.min.js',
            # '/load/?callback=loadusers',
            '/lib/seedrandom.js', '/turtlebits.js']:
          self.topget(url)
        for url in ['/home/promo1', '/home/goldwheel-code.png']:
          self.myget('promo', url)

    @task(1)
    def edit(self):
        # try:
        #   topdir = self.topget("/load/").json()
        # except:
        #   print 'error listing all users'
        #   return
        # randuser = random.choice(topdir['list'])
        # randname = randuser['name']
        # if 'd' not in randuser['mode']:
        #   return
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
        except:
          print 'error listing ' + randname
          return
        if len(mydir['list']) == 0:
          return
        randfile = random.choice(mydir['list'])['name']
        try:
          self.myget(randname, '/load/' + randfile).json()
        except:
          print 'error reading ' + randname + ' ' + randfile

    @task(1)
    def saverandom(self):
        randname = random.choice(passwords.keys())
        try:
          myok = self.mypost(randname, '/save/loadtest', {
            'data': 'pen red\nfor [1..4]\n  fd 100\n  rt 90',
            'key': passwords[randname]
          }).json()
        except:
          print 'error saving ' + randname
          return


class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 5000
    max_wait = 20000
