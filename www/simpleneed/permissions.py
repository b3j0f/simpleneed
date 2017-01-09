"""Permissions module."""

from rest_framework import permissions

from .models import LocatedElement


class LocatedElementPermission(permissions.BasePermission):
    """Located element permission."""

    message = 'Adding customers not allowed.'

    def has_object_permission(self, request, view, obj):
        """True iif object is a located element."""
        print('perm', request.method, view)
        return isinstance(obj, LocatedElement)
