from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

urlpatterns = [
    path('users', UserView.as_view()),
    path('token', UserTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh_pair'),
    path('register', RegisterView.as_view(), name='register'),
    path('dashboard', DashboardView.as_view()),
]