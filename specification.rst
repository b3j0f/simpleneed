Specification
=============

Main goals
----------

- Set location of needs/offers/roams
- ease communication between needers and offerers.

Need
~~~~

A need is named with a description

- money
- snack
- food
- clothes
- company
- hygiene
- accomodation
- accessories
- health

Offer
~~~~~

An offer provides a need with additional description.

Roam
~~~~

A roam is a group of spontaneous offers which want to act in group.

Need/offer/roam owner
~~~~~~~~~~~~~~~~~~~~~

An owner is the person in charge of a need/offer/roam.

This is the activity creator or another user which use an access code for using administration access.

Two situations for account login.

If you are not logged in, you have a unique id each 5 minutes which is added to a local user list of ids.

The list can be retrieved from a qrcode.

If you want, the application can send you your ids by email or texto.

Strenghtnesses: no password to access your information. And no automatic processing in the server side.
Weaknesses: you can loose all your history in case of local information lost.

Need/Offer/Roam location
~~~~~~~~~~~~~~~~~~~~~~~~

Same as above with an additional location (latitude and longitude), a period of activity, a name/description and public/private messages shared between the activity author and other users.

Location
########

Couple of latitude/longitude respecting the EPSG:4326 projection.

Period of activity
##################

The period of activity is

- start date: for future activities. None by default.
- end date: for future end. None by default.
- recursive: for repetitive planning. None by default.

By default, the activity is finished after 8 hours of inactivity.

Otherwise, it depends on end date and recursive planning or answered needs (if a need location has no needs, the need location is removed).

Name/Description
################

The description is a name and a short description text.

Search is possible with a regular expression.

Find a need/offer/roam
----------------------

From a map, you can find a need/offer/roam location by

- type of need/offer/roam.
- location.
- period of activity (emergency/start/end/recursive)
- description

Type of need/offer/roam
~~~~~~~~~~~~~~~~~~~~~~~

- money
- snack
- food
- clothes
- company
- hygiene
- accomodation
- accessories
- health

Property of need
~~~~~~~~~~~~~~~~

A need has specific properties.

- emergency: boolean flag, false by default.

Property of need/offer
~~~~~~~~~~~~~~~~~~~~~~

- gender: for easying complex needs such as health or accomodation. Default is not precised.

Property of roam
~~~~~~~~~~~~~~~~

- associative: if true, the roam is managed by an association. Otherwise, this is a pure citizen roam.
