from django.urls import path
from .views import RegisterView, ProfileView, create_superuser

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('create-superuser/', create_superuser, name='create_superuser'),
]