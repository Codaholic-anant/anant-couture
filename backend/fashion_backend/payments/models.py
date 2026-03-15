from django.db import models
from orders.models import Order

class Payment(models.Model):

    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=200)

    def __str__(self):
        return self.transaction_id