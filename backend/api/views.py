from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.http import JsonResponse
from .models import *
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView



class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserTokenObtainPairView(TokenObtainPairView):
    serializer_class = UserTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        response = f"Hello {request.user}"
        return Response({'response': response}, status=status.HTTP_200_OK)
    def post(self, request):
        text = request.POST.get("text")
        response = f"Hello {request.user}, your text is {text}"
        return Response({'response': response}, status=status.HTTP_200_OK)
