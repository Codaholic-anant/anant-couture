from django.urls import path
from .views import (
    OrderListCreateView,
    OrderDetailView,
    checkout,
    verify_payment,
    my_orders,
    cancel_order
)

urlpatterns = [

    path('', OrderListCreateView.as_view()),

    path('<int:pk>/', OrderDetailView.as_view()),

    path('checkout/', checkout),

    path('verify-payment/', verify_payment),

    path("my-orders/", my_orders),

    path("cancel/<int:order_id>/", cancel_order),
]