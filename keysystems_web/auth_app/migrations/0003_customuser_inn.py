# Generated by Django 5.0.6 on 2024-07-10 13:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_app', '0002_customuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='inn',
            field=models.BigIntegerField(blank=True, null=True, verbose_name='ИНН'),
        ),
    ]