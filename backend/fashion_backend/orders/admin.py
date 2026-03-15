from django.contrib import admin
from .models import Order ,OrderItem
from .models import ShippingAddress

# Register your models here.
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id','user','total_price','status','created_at']
    list_filter = ['status']

# admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Order, OrderAdmin)

admin.site.register(ShippingAddress)
