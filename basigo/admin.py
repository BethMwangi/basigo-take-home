from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import User, Lead, Customer

class UserAdmin(BaseUserAdmin):
 
    fieldsets = (
      (None, {'fields': ('email', 'password',  )}),
      (_('Personal info'), {'fields': ('first_name', 'last_name','username')}),
      (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                     'groups', 'user_permissions')}),
      (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
      (_('Custom Fields'), {'fields': ('is_lead', 'is_customer')}),
    )
    add_fieldsets = (
      (None, {
          'classes': ('wide', ),
          'fields': ('email', 'password1', 'password2'),
      }),
    )
    list_display = ['email', 'username', 'first_name','date_joined', 'is_lead', 'is_customer']
    search_fields = ('email', 'first_name', 'last_name' 'is_lead')
    ordering = ('email', )



class LeadAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'middle_name', 'last_name', 'phone_number',
                    'gender', 'created_by', 'created']
    # readonly_fields = ['created_by']

class CustomerAdmin(admin.ModelAdmin):
    list_display = ['id', 'annual_earning', 'display_products',
                    'created', 'created_by']


admin.site.register(User, UserAdmin)
admin.site.register(Lead, LeadAdmin)
admin.site.register(Customer, CustomerAdmin)







