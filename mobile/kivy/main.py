import kivy

kivy.require('1.9.1')

from kivy.app import App
from kivy.layout.boxlayout import BoxLayout


class SimpleNeed(App):

    def build(self):

        rootlayout = BoxLayout()



if __name__ == '__main__':

    print(get('http://localhost:8000/moods').json())

    SimpleNeed().run()
