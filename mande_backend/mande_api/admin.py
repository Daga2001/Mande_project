from django.contrib import admin
from mande_api import models

# Register your models here.
admin.site.register(models.User)
admin.site.register(models.Worker)
admin.site.register(models.Client)
admin.site.register(models.Address)
admin.site.register(models.Gps_location)
admin.site.register(models.Service)
admin.site.register(models.Worker_img_data)
admin.site.register(models.Job)
admin.site.register(models.History)
admin.site.register(models.Payment_Method)
admin.site.register(models.Receipt)
admin.site.register(models.Worker_Job)