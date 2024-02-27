from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

urlpatterns = [
    path('users', UserView.as_view()),
    path('token', UserTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token-refresh', TokenRefreshView.as_view(), name='token_refresh_pair'),
    path('register', RegisterView.as_view(), name='register'),
    path('dashboard', DashboardView.as_view()),

    # Chat Message
    path('my-messages/<user_id>', InboxView.as_view()),
    path('get-messages/<sender_id>/<receiver_id>', ChatView.as_view()),
    path('send-message', SendMessage.as_view()),

    #Profile
    path('profile/<int:pk>', ProfileView.as_view()),
    path('search-user/<username>', SearchUserView.as_view()),
]