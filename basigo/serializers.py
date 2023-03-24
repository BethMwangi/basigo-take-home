from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

from .models import Lead, Customer

User = get_user_model()


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        read_only_fields = ['created_by']
        fields = ['id', 'first_name', 'middle_name', 'phone_number', 'location', 'gender', 'created_by']

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        read_only_fields = ['created_by']
        fields = ['id', 'first_name', 'middle_name', 'phone_number', 'location', 'gender', 'created_by']