from django.urls import path
from . import views

urlpatterns = [
    path('', views.chatbot, name='chatbot'),
    path('history/', views.chat_history, name='chat_history'),
]