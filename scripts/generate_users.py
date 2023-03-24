import random
from django.contrib.auth import get_user_model
from django.utils import timezone
from basigo.models import Lead, User

User = get_user_model()

def run():
    for i in range(10):
        first_name = random.choice(['Mia', 'Olivia', 'Lucas', 'Isabel', 'Emma', 'Sophia', 'Jackson', 'Logan'])
        last_name = random.choice(['Kitam', 'Pembe', 'Mashirima', 'Pumba', 'Tigo', 'Dede', 'Jumwa', 'Keto'])
        username = first_name.lower() + last_name.lower()
        email = f"{first_name.lower()}.{last_name.lower()}{i}@example.com"
        password = "Mypassword45*"
        is_lead = False
        is_customer = True
        user = User.objects.create_user(username=username, password=password, email=email, is_lead=is_lead, is_customer=is_customer)

        # Save the Users object to the database
        user.save()
