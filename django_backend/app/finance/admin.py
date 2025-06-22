from django.contrib import admin
from .models import Expense

# Register your models here.
@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('expenseName', 'amount', 'category', 'date')
    list_filter = ('category', 'date')
    search_fields = ('expenseName', 'notes')