from rest_framework import generics, status
from django.contrib.auth import get_user_model, authenticate
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError


from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, LeadSerializer, CustomerSerializer
from .permissions import IsLeadUser, IsCustomerUser
from .models import User, Lead, Customer


User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password'],
        )
        if not user:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        response_data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
        }
        return Response(response_data, status=status.HTTP_200_OK)
    
        
class LeadListView(generics.ListAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated]

class LeadCreateView(generics.CreateAPIView):
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated, IsLeadUser]

    def perform_create(self, serializer):
        try:
            serializer.save(created_by=self.request.user)
        except IntegrityError:
            raise ValidationError({'phone_number': 'Phone number must be unique'})
        else:
            response_data = serializer.data
            return Response(response_data, status=status.HTTP_201_CREATED)
    
class LeadDetailView(generics.RetrieveUpdateAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated, IsLeadUser]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class CustomerCreateView(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated, IsCustomerUser]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class CustomerDetailView(generics.RetrieveUpdateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated, IsCustomerUser]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

