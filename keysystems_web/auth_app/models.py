from django.db import models

from enums import UserRole


class UserKS(models.Model):
    ROLE_CHOICES = (
        (UserRole.CLIENT.value, 'Клиент'),
        (UserRole.STAFF.value, 'Staff'),
    )
    id = models.AutoField(primary_key=True)
    inn = models.BigIntegerField('ИНН')
    email = models.CharField('Почта', max_length=100, null=True, blank=True)
    full_name = models.CharField('ФИО', max_length=255, null=True, blank=True)
    phone = models.CharField('Телефон', max_length=100, null=True, blank=True)
    password = models.CharField('Пароль', max_length=100, null=True, blank=True)
    role = models.CharField('Роль', max_length=10, choices=ROLE_CHOICES, default='client')
    product_id = models.IntegerField('ПО ID')

    objects = models.Manager()

    def __str__(self):
        return f"<User({self.inn} {self.email})>"

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        db_table = 'users_ks'
