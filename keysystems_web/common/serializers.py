from urllib.parse import urlparse

import os
import json
import logging

from rest_framework import serializers
from . import models as cm
import common as ut
from .logs import log_error
from enums import notices_dict


# районы
class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = cm.District
        fields = ['title']


# районы
class DownloadedFileSerializer(serializers.ModelSerializer):
    filename = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()
    icon = serializers.SerializerMethodField()

    class Meta:
        model = cm.DownloadedFile
        fields = ['url', 'filename', 'file_size', 'icon']

    def get_filename(self, obj):
        parsed_url = urlparse(obj.url)
        return os.path.basename(parsed_url.path)

    def get_url(self, obj):
        return f'..{obj.url}'

    def get_file_size(self, obj):
        if obj.file_size:
            return ut.get_size_file_str(obj.file_size)
        else:
            return 'н/д'

    def get_icon(self, obj):
        return ut.get_file_icon_link(obj.url)


# ПО
class SoftSerializer(serializers.ModelSerializer):
    class Meta:
        model = cm.Soft
        fields = ['id', 'title', 'description', 'is_active']


# Обращения
class OrderTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = cm.OrderTopic
        fields = ['id', 'topic', 'is_active']


# пользователи
class UserKSSerializer(serializers.ModelSerializer):
    class Meta:
        model = cm.UserKS
        fields = ['id', 'full_name', 'username']


# районы клиент
class CustomerSerializer(serializers.ModelSerializer):
    district = DistrictSerializer()

    class Meta:
        model = cm.Customer
        fields = ['id', 'inn', 'district', 'title']


# кураторы
class OrderCuratorSerializer(serializers.ModelSerializer):
    user = UserKSSerializer()

    class Meta:
        model = cm.OrderCurator
        fields = ['id', 'user']


# заказы самая минимальная версия
class OnlyOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = cm.Order
        fields = ['id', 'text']


# заказы минимальная версия
class SimpleOrderSerializer(serializers.ModelSerializer):
    soft = SoftSerializer()
    topic = OrderTopicSerializer()
    # files = DownloadedFileSerializer(many=True, source='downloaded_file')
    # from_user = UserKSSerializer()
    # customer = CustomerSerializer()

    id_str = serializers.SerializerMethodField()

    class Meta:
        model = cm.Order
        # fields = ['id', 'from_user', 'customer', 'text', 'soft', 'topic', 'status', 'id_str']
        # fields = ['id', 'text', 'soft', 'topic', 'status', 'id_str', 'files', 'customer']
        # fields = ['id', 'text', 'soft', 'topic', 'status', 'id_str', 'customer']
        fields = ['id', 'text', 'soft', 'topic', 'status', 'id_str']

    def get_id_str(self, obj):
        return f'#{str(obj.id).zfill(5)}'


# заказы минимальная версия, но с кураторами
class SimpleWithCurOrderSerializer(serializers.ModelSerializer):
    soft = SoftSerializer()
    topic = OrderTopicSerializer()
    customer = CustomerSerializer()

    id_str = serializers.SerializerMethodField()
    curators = serializers.SerializerMethodField()

    class Meta:
        model = cm.Order
        fields = ['id', 'text', 'soft', 'topic', 'status', 'id_str', 'curators', 'customer']

    def get_id_str(self, obj) -> str:
        return f'#{str(obj.id).zfill(5)}'

    def get_curators(self, obj) -> str:
        curators = cm.OrderCurator.objects.select_related('user').filter(order=obj).all()
        curators_names = [curator.user.full_name for curator in curators]
        return ', '.join(curators_names) if curators_names else '...'


# заказы полные данные
class FullOrderSerializer(serializers.ModelSerializer):
    soft = SoftSerializer()
    topic = OrderTopicSerializer()
    from_user = UserKSSerializer()
    customer = CustomerSerializer()
    files = DownloadedFileSerializer(many=True, source='downloaded_file')

    id_str = serializers.SerializerMethodField()
    curators = serializers.SerializerMethodField()

    class Meta:
        model = cm.Order
        fields = [
            'id', 'from_user', 'customer', 'text', 'soft', 'topic', 'status', 'id_str', 'curators', 'files'
        ]

    def get_id_str(self, obj):
        return f'#{str(obj.id).zfill(5)}'

    def get_curators(self, obj):
        curators = obj.order_curator.all()
        return UserKSSerializer([curator.user for curator in curators], many=True).data


# сообщения
class MessageSerializer(serializers.ModelSerializer):
    from_user = UserKSSerializer()

    time = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    icon = serializers.SerializerMethodField()
    filename = serializers.SerializerMethodField()

    class Meta:
        model = cm.Message
        fields = ['type_msg', 'from_user', 'text', 'time', 'chat', 'file_url', 'file_size', 'icon', 'filename']

    def get_time(self, obj):
        return ut.get_time_string(obj.created_at)

    def get_file_url(self, obj):
        return f'..{obj.file_path}' if obj.file_path else None

    def get_file_size(self, obj):
        if obj.file_size:
            return ut.get_size_file_str(obj.file_size)
        else:
            return 'н/д'

    def get_icon(self, obj):
        return ut.get_file_icon_link(obj.file_path) if obj.file_path else None

    def get_filename(self, obj):
        if obj.file_path:
            parsed_url = urlparse(obj.file_path)
            return os.path.basename(parsed_url.path)
        else:
            return None


# уведомления
class NoticeSerializer(serializers.ModelSerializer):
    order = OnlyOrderSerializer()

    date = serializers.SerializerMethodField()
    text = serializers.SerializerMethodField()

    class Meta:
        model = cm.Notice
        fields = ['id', 'order', 'date', 'text']

    def get_date(self, obj):
        return ut.get_date_string(obj.created_at)

    def get_text(self, obj):
        return obj.type_notice
