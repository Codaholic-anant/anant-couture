from groq import Groq
from django.conf import settings

client = Groq(api_key=settings.GROQ_API_KEY)

def build_system_prompt(user, products, orders):
    product_list = ""
    for p in products[:5]:
        product_list += f"- {p['name']}: ₹{p['price']}\n"

    order_list = ""
    for o in orders[:3]:
        order_list += f"- Order #{o['id']}: {o['status']} | ₹{o['total_price']} | {o['created_at']}\n"

    return f"""You are Anaya, assistant for Anant Couture fashion brand.
Customer: {user.username}

PRODUCTS:
{product_list or "None"}

ORDERS:
{order_list or "None"}

Reply warmly, concisely under 80 words. Help with products, orders, styling."""


def get_ai_reply(user_message, user, products, orders, chat_history=None):
    chat_history = chat_history or []

    system_prompt = build_system_prompt(user, products, orders)

    # Build message history
    messages = [{"role": "system", "content": system_prompt}]

    for chat in chat_history[-3:]:
        messages.append({"role": "user", "content": chat["message"]})
        if chat["reply"]:
            messages.append({"role": "assistant", "content": chat["reply"]})

    messages.append({"role": "user", "content": user_message})

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Free, fast model
            messages=messages,
            max_tokens=150,
        )
        return response.choices[0].message.content

    except Exception as e:
        print(f"Groq API error: {e}")
        return "I'm a little busy right now, please try again in a moment! 🙏"