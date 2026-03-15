from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ChatMessage
from .ai_engine import get_ai_reply

def get_user_products():
    try:
        from products.models import Product
        products = Product.objects.all()[:10]
        return [
            {
                "name": p.name,
                "price": str(p.price),
                "description": p.description,
                "category": str(p.category) if hasattr(p, 'category') else "",
            }
            for p in products
        ]
    except Exception as e:
        print(f"Product fetch error: {e}")
        return []

def get_user_orders(user):
    try:
        from orders.models import Order
        orders = Order.objects.filter(user=user).prefetch_related('items__product').order_by('-created_at')[:5]
        result = []
        for o in orders:
            items = [
                f"{item.product.name} x{item.quantity}"
                for item in o.items.all()
            ]
            result.append({
                "id": o.id,
                "status": o.get_status_display(),
                "total_price": str(o.total_price),
                "created_at": o.created_at.strftime("%d %b %Y"),
                "items": ", ".join(items) if items else "No items",
            })
        return result
    except Exception as e:
        print(f"Order fetch error: {e}")
        return []


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chatbot(request):
    user_message = request.data.get('message', '').strip()
    if not user_message:
        return Response({"error": "Message is empty"}, status=400)

    products = get_user_products()
    orders = get_user_orders(request.user)

    history_qs = ChatMessage.objects.filter(
        user=request.user
    ).order_by('created_at').values('message', 'reply')
    chat_history = list(history_qs)

    reply = get_ai_reply(
        user_message=user_message,
        user=request.user,
        products=products,
        orders=orders,
        chat_history=chat_history
    )

    ChatMessage.objects.create(
        user=request.user,
        message=user_message,
        reply=reply
    )

    return Response({"message": user_message, "reply": reply})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_history(request):
    chats = ChatMessage.objects.filter(
        user=request.user
    ).order_by('created_at')
    data = [{"message": c.message, "reply": c.reply} for c in chats]
    return Response(data)