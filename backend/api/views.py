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
from django.db.models import Subquery, OuterRef, Q



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

class InboxView(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        messages = ChatMessage.objects.filter(
            id__in=Subquery(
                User.objects.filter(Q(sender__receiver=user_id)|Q(receiver__sender=user_id)).distinct().annotate(
                    last_msg=Subquery(
                        ChatMessage.objects.filter(Q(sender=OuterRef('id'), receiver=user_id)|Q(receiver=OuterRef('id'), sender=user_id)).order_by('-id')[:1].values_list('id', flat=True)
                    )
                ).values_list('last_msg', flat=True).order_by('-id')
            )
        ).order_by('-id')
        return messages

class ChatView(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        sender_id = self.kwargs['sender_id']
        receiver_id = self.kwargs['receiver_id']

        messages = ChatMessage.objects.filter(
            sender__in=[sender_id, receiver_id],
            receiver__in=[sender_id, receiver_id]
        )
        return messages

class SendMessage(generics.CreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated]

class SearchUserView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        username = self.kwargs['username']
        logged_in_user = self.request.user
        users = Profile.objects.filter(
            Q(user__username__icontains=username) | Q(full_name__icontains=username) | Q(user__email__icontains=username)
        )

        if not users.exists():
            return Response({"detail": "No users found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)