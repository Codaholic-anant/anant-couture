from django.urls import path
from .views import CartItemListCreateView, CartItemDeleteView

urlpatterns = [
    path('', CartItemListCreateView.as_view()),
    path('delete/<int:pk>/', CartItemDeleteView.as_view()),
]