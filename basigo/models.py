from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.forms import MultipleChoiceField


class User(AbstractUser):
    is_lead = models.BooleanField('create lead', default=False)
    is_customer = models.BooleanField('create customer', default=False)


class Lead(models.Model):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15, blank=True, unique=True)
    location = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    created = models.DateField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leads')

    class Meta:
        verbose_name_plural = "Leads"
        ordering = ["created"]
        indexes = [
            models.Index(fields=["id"]),
            models.Index(fields=["-created"]),
        ]

    def __str__(self):
        return "{}-{}".format(self.first_name, self.last_name)


class Customer(models.Model):
    ANNUAL_INCOME_CHOICES = (
        ('A', 'Product A (for annual income of at least 10,000)'),
        ('B', 'Product B (for annual income of at least 20,000)'),
        ('C', 'Product C (for annual income of at least 30,000)'),
    )
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='photos/', blank=True)
    annual_earning = models.DecimalField(max_digits=10, decimal_places=2)
    products = models.CharField(max_length=255, choices=ANNUAL_INCOME_CHOICES, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='customers')

    class Meta:
        verbose_name_plural = "Customers"
        ordering = ["created"]
        indexes = [
            models.Index(fields=["id"]),
            models.Index(fields=["-created"]),
        ]

    def __str__(self):
        return "{}-{}".format(self.lead.first_name, self.lead.last_name)
    
    def display_products(self):
        choices_dict = dict(self.ANNUAL_INCOME_CHOICES)
        return ", ".join([choices_dict.get(choice, '') for choice in self.products.split(',')])

    display_products.short_description = 'Products'
    
    


