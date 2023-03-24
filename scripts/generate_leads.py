import random
from django.contrib.auth.models import User
from django.utils import timezone
from basigo.models import Lead, User

leads = User.objects.filter(is_lead=True)

def generate_email(first_name, last_name):
    email = first_name.lower() + '.' + last_name.lower() + '@example.com'
    return email

def run():
    for i in range(20):
        first_name = random.choice(['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry'])
        last_name = random.choice(['Kidum', 'Kimbo', 'Mwangi', 'Otieno', 'Digo', 'Muna', 'Karanja', 'Keto'])
        email = generate_email(first_name, last_name)
        phone_number = '254-' + str(random.randint(1000, 9999))
        location = random.choice(['Nairobi', 'Baringo', 'Kisumu', 'Naivasha', 'Nakuru', 'Kitale', 'Muranga', 'Mombasa'])
        gender = random.choice(['M', 'F', 'O'])
        lead = Lead(
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            email = email,
            location=location,
            gender=gender,
            created=timezone.now(),
            created_by=random.choice(leads),
        )

        # Save the Lead object to the database
        lead.save()
