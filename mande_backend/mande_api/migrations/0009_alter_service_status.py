# Generated by Django 4.1.3 on 2023-02-03 10:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mande_api', '0008_service_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='service',
            name='status',
            field=models.CharField(default='Pendiente', max_length=200),
        ),
    ]
