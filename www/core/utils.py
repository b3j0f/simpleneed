"""Utils module."""


def obj2str(obj, *members):
    """Convert an object to a string representation."""
    result = '{0}('.format(type(obj).__name__)

    for member in members:
        val = getattr(obj, member)

        if val is not None:
            result += '{0}: {1}, '.format(member, val)

    result += ')'

    return result
