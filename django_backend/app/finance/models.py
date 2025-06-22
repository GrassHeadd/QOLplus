from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
class Expense(models.Model):
    expenseId = models.AutoField(primary_key=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    expenseName = models.CharField(max_length=255)
    amount = models.FloatField()
    category = models.CharField(max_length=100)
    userId = models.ForeignKey(User, on_delete=models.CASCADE, db_column='userId')  # Added db_column
    date = models.DateField()
    notes = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.expenseName}: ${self.amount}"
    
    class Meta:
        db_table = 'expenses' #django directly reference table "expense" in db
        ordering = ['-date'] #default ordering will be by date and descending
        