from rest_framework import permissions

class IsLeadUser(permissions.BasePermission):
    """
    Allows access only to users with is_lead attribute set to True.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_lead
    
class IsCustomerUser(permissions.BasePermission):
    """
    Allows access only to users with is_customer attribute set to True.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_customer