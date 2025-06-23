from django.db import models

# Create your models here.
class Event(models.Model):
    user_id = models.IntegerField()
    #TODO: not completed yet