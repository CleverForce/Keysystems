# from rest_framework import serializers
# from .models import Order, Soft, OrderTopic, UserKS, Customer
#
#
# class SoftSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Soft
#         fields = ['id', 'title', 'description', 'is_active']
#
#
# class OrderTopicSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = OrderTopic
#         fields = ['id', 'topic', 'is_active']
#
#
# class UserKSSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserKS
#         fields = ['id', 'full_name', 'email']
#
#
# class CustomerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Customer
#         fields = ['id', 'inn', 'district', 'title']
#
#
# class OrderSerializer(serializers.ModelSerializer):
#     soft = SoftSerializer()
#     topic = OrderTopicSerializer()
#     from_user = UserKSSerializer()
#     executor = UserKSSerializer()
#     customer = CustomerSerializer()
#
#     class Meta:
#         model = Order
#         fields = ['id', 'from_user', 'customer', 'text', 'soft', 'topic', 'executor', 'status']
