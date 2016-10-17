from settings import url
from mood import MoodSpinner
from need import NeedCheckBoxes
from gender import GenderRadioBox

from kivy.layout.box import BoxLayout
from kivy.uix.checkbox import CheckBox

from kivy.properties import BooleanProperty, StringProperty


class HomelessWidget(BoxLayout):

    handicaped = BooleanProperty()
    comment = StringProperty()

    def __init__(self, *args, **kwargs):

        super(HomelessWidget, self).__init__(orientation='vertical')

        self.add_widget(MoodSpinner())
        self.add_widget(NeedCheckBoxes())
        self.add_widget(NeedCheckBoxes())
        self.add_widget(CheckBox())
        self.add_widget(GenderRadioBox())
