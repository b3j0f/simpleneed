How to contribute
=================

This project contains sources for deploying a webserver and mobile applications

- www: webserver directory
- mobile: mobile application directory

Web server directory
--------------------

dependencies: virtualenv, pip

dev
~~~

Start a virtualenv session:

.. code-block::

	$ virtualenv venv
	$ source venv/bin/activate
	$ make rundev

prod
~~~~

Start a prod session

make runprod

Mobile directory
----------------

- ionic: ionic project
- kivy: kivy project

ionic
~~~~~

ionic development.
dependencies: nodejs, npm, ionic

install dependencies

.. code-block::

	$ npm install

Start the dev webserver

.. code-block::

	$ ionic serve

Start emulations

.. code-block::

	$ ionic emulate (android|ios|wp8|windows|browser)

### kivy

dependencies: kivy

Start the emulation:

.. code-block::

	$ python main.py
