# A simple loadtest using locust.
# launch using: locust -f simpleloadtest.py --host=http://pencilcode.net

from locust import HttpLocust, TaskSet, task
import simplejson, random

class MyTaskSet(TaskSet):
    def userbase(self, user):
      return self.client.base_url.replace('//', '//' + user + '.')

    def topget(self, url):
      return self.client.get(url, headers={"User-Agent":"locust"})

    def myget(self, user, url):
      return self.client.get(self.userbase(user) + url,
          headers={"User-Agent":"locust"})

    def mypost(self, user, url, data):
      return self.client.post(self.userbase(user) + url, data,
          headers={"User-Agent":"locust"})

    # @task(1)
    def index(self):
        for url in ['/', '/welcome.css', '/image/vpencil-20-64.png',
            '/image/art.png', '/image/music.png', '/image/adventure.png',
            '/lib/jquery.js', '/lib/jquery.autocomplete.min.js',
            '/load/?callback=loadusers']:
          self.topget(url)
        for url in ['/home/promo1', '/home/goldwheel-code.png',
            '/lib/seedrandom.js', '/turtlebits.js']:
          self.myget('promo', url)

    # @task(1)
    def edit(self):
        topdir = self.topget("/load/").json()
        randuser = random.choice(topdir['list'])
        randname = randuser['name']
        if 'd' not in randuser['mode']:
          return
        for url in ['/edit/', '/editor.js', '/favicon.ico',
            '/apple-touch-icon.png', '/load']:
          mydir = self.myget(randname, url)

    @task(1)
    def browserandom(self):
        topdir = self.topget("/load/").json()
        randuser = random.choice(topdir['list'])
        randname = randuser['name']
        if 'd' in randuser['mode']:
          try:
            mydir = self.myget(randname, '/load/').json()
          except:
            print 'error listing', randuser
            return
          randfile = random.choice(mydir['list'])['name']
          try:
            self.myget(randname, '/load/' + randfile).json()
          except:
            print 'error reading', randuser, randfile

    @task(1)
    def livetestsave(self):
        myok = self.mypost('livetest', '/save/loadtest', {
          'data': 'pen red\nfor [1..4]\n  fd 100\n  rt 90',
          'key': '123'
        }).json()

class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait =  5000
    max_wait = 15000
