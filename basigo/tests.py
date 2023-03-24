from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate

from .models import Customer, Lead

User = get_user_model()

class RegisterViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse('basigo:register')
        self.client = APIClient()

    def test_create_user(self):
        data = {'username': 'testuser', 'email': 'test@example.com', 'password': 'testpass'}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

class LoginViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse('basigo:login')
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')

    def test_login_user(self):
        data = {'username': 'testuser', 'password': 'testpass'}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)

class LeadCreateViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse('basigo:lead-list')
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass', is_lead=True)
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_create_lead(self):
        data = {'first_name': 'Test First Lead', 'middle_name': 'Test middle lead.',  
                'phone_number':'2547200000', 'location':'Test location', 'gender':'F'}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Lead.objects.count(), 1)
        lead = Lead.objects.get()
        self.assertEqual(lead.first_name, 'Test First Lead')
        self.assertEqual(lead.created_by, self.user)

class CustomerCreateViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse('basigo:customer-list')
        self.client = APIClient()
        self.lead_user = User.objects.create_user(username='leaduser', password='testpass', is_lead=True)
        self.customer_user = User.objects.create_user(username='customeruser', password='testpass', is_customer=True)
        self.lead_token = str(RefreshToken.for_user(self.lead_user).access_token)
        self.customer_token = str(RefreshToken.for_user(self.customer_user).access_token)

    def test_create_customer_as_lead_should_fail(self):
        lead = Lead.objects.create(created_by=self.lead_user)
        data = {
            'lead': lead.id,
            'annual_earning': '20000.00',
            'products': 'B',
            'created_by': self.lead_user

        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.lead_token}')
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Customer.objects.count(), 0)

    
    def test_create_customer_as_customer_should_succeed(self):
        lead = Lead.objects.create(created_by=self.lead_user)
        data = {
            'lead': lead.id,
            'annual_earning': '20000.00',
            'products': 'A',
            'created_by': self.customer_user
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.customer_token}')
        print(" the data being posted", data)
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Customer.objects.count(), 1)
        self.assertEqual(Customer.created_by, self.customer_user)
 

