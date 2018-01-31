# -*- coding: utf-8 -*-

from __future__ import unicode_literals


class ProfileGroupService(object):

    """A service for retrieving groups associated with users."""

    def __init__(self, session, route_url, open_group_finder):
        """
        Create a new profile_groups service.

        :param session: the SQLAlchemy session object
        :param open_group_finder: a callable for finding open groups
        """
        self.session = session
        self.route_url = route_url
        self.open_group_finder = open_group_finder

    def all(self, user=None, authority=None):
        """ return a list of all user groups"""

        open_groups = self.open_group_finder(authority) or []
        private_groups = []
        if user is not None:
            private_groups = user.groups

        groups = open_groups + private_groups

        return [self._group_model(group) for group in groups]

    def _group_model(self, group):
        model = {
          'name': group.name,
          'id': group.pubid,
          'public': group.is_public,
          'scoped': False,  # TODO
          'type': 'open' if group.is_public else 'private',  # TODO
          'urls': {}
        }
        if not group.is_public:
            # `url` legacy property support
            model['url'] = self.route_url('group_read',
                                          pubid=group.pubid,
                                          slug=group.slug)
            # `urls` are the future
            model['urls']['group'] = model['url']
        return model


def profile_groups_factory(context, request):
    """Return a ProfileGroupService instance for the passed context and request."""
    auth_group_svc = request.find_service(name='authority_group')
    return ProfileGroupService(session=request.db,
                               route_url=request.route_url,
                               open_group_finder=auth_group_svc.public_groups)
