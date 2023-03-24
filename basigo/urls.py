from django.urls import path, include
from . import views

app_name = 'basigo'

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),  
    path('lead/create_lead/',
         views.LeadCreateView.as_view(), name='lead-list'),
    path('lead/<int:pk>/', views.LeadDetailView.as_view(), name='detail-lead'),
    path('customer/create_customer/',
         views.CustomerCreateView.as_view(), name='customer-list'),
    path('customer/<int:pk>/', views.CustomerDetailView.as_view(), name='detail-customer'),
]