import requests
from settings import url, IMAGES, DATA

from kivy.core.image import Image

from kivy.uix.dropdown import DropDown
from kivy.uix.slider import Slider

from os.path import join


class BaseDropDown(DropDown):

    NAME = None

    def __init__(self, *args, **kwargs):

        super(BaseDropDown, self).__init__(*args, **kwargs)

        self.values = getvalues(self.NAME + 's')
        self.loadimages()

    def loadimages(self):

        self.children = []

        map(
            lambda name: self.add_widget(Image(source=getimage(name))),
            self.values
        )


class BaseSlider(Slider):

    NAME = None

    def __init__(self, *args, **kwargs):

        super(BaseSlider, self).__init__(*args, **kwargs)

        self.values = getvalues(self.NAME + 's')

        self.max = len(self.values) - 1

    def on_value(self, value):

        self.cursor_image = getimage(self.values[value])


def get(query, params=None):

    return requests.get(url + query, params=params)


def getresults(query):

    return get(url + query).json()['results']


def post(query, data, files=None):

    return requests.post(url + query, data=data, files=files)


def put(query, data):

    return requests.put(url + query, data=data)


def delete(query):

    return requests.delete(url + query)


def Spinner(Spinner):

    def __init__(self, *args, **kwargs):

        super(Spinner, self).__init__(*args, **kwargs)

        self.values = [item['name'] for item in getresults(self.NAME + 's')]


def getvalues(name):

    return [item[name] for item in getresults(url + name)]


def getimage(name, ext='png'):

    return join(IMAGES, '{0}.{1}'.format(name, ext))


def getdata(name):

    return join(DATA, name)
