from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.conf import settings

import razorpay

from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import CartItem


# List Orders / Create Order

class OrderListCreateView(generics.ListCreateAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


# Order Detail

class OrderDetailView(generics.RetrieveAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


# Checkout (Create Order + Razorpay Order)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout(request):

    user = request.user

    cart_items = CartItem.objects.filter(cart__user=user)

    if not cart_items.exists():
        return Response({"error": "Cart is empty"})

    total_price = 0

    order = Order.objects.create(
        user=user,
        total_price=0,
        status="pending"
    )

    for item in cart_items:

        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )

        total_price += item.product.price * item.quantity

    order.total_price = total_price
    order.save()

    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_SECRET)
    )

    payment = client.order.create({
        "amount": int(total_price * 100),
        "currency": "INR",
        "payment_capture": 1
    })

    order.razorpay_order_id = payment["id"]
    order.save()

    cart_items.delete()

    return Response({
        "order_id": order.id,
        "razorpay_order_id": payment["id"],
        "amount": total_price
    })


# Verify Razorpay Payment

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):

    razorpay_order_id = request.data.get("razorpay_order_id")
    razorpay_payment_id = request.data.get("razorpay_payment_id")
    razorpay_signature = request.data.get("razorpay_signature")

    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_SECRET)
    )

    try:

        client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        })

        order = Order.objects.get(
            razorpay_order_id=razorpay_order_id,
            user=request.user
        )

        order.status = "confirm"
        order.razorpay_payment_id = razorpay_payment_id
        order.razorpay_signature = razorpay_signature

        order.save()

        return Response({"message": "Payment successful"})

    except Exception as e:

        try:
            order = Order.objects.get(
                razorpay_order_id=razorpay_order_id,
                user=request.user
            )
            order.status = "cancelled"
            order.save()
        except:
            pass

        return Response({"error": str(e)})


# My Orders (User Dashboard)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):

    orders = Order.objects.filter(user=request.user).order_by("-created_at")

    serializer = OrderSerializer(
        orders,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)


# Cancel Order

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):

    try:

        order = Order.objects.get(id=order_id, user=request.user)

        if order.status == "cancelled":
            return Response({"error": "Order already cancelled"}, status=400)

        if order.status in ["shipped", "delivered"]:
            return Response({"error": "Order cannot be cancelled"}, status=400)

        order.status = "cancelled"
        order.save()

        return Response({"message": "Order cancelled successfully"})

    except Order.DoesNotExist:

        return Response({"error": "Order not found"}, status=404)