from django.http import JsonResponse
from django.db.models import Count, Q

import logging

from .models import Order, Message
from .serializers import OrderSerializer, MessageSerializer
from .logs import log_error
from enums import ChatType


def get_order_data(request, order_id):
    try:
        order = Order.objects.filter(id=order_id).first()
        messages = Message.objects.filter(order=order).order_by('created_at')

        client_messages = messages.filter(chat=ChatType.CLIENT.value)
        curator_messages = messages.filter(chat=ChatType.CURATOR.value)

        client_unviewed_message = client_messages.filter(~Q(view_message__user_ks=request.user)).distinct().count()
        curator_unviewed_message = curator_messages.filter(~Q(view_message__user_ks=request.user)).distinct().count()


        return JsonResponse(
            {
                'order': OrderSerializer(order).data,
                'client_chat': MessageSerializer(client_messages.all(), many=True).data,
                'curator_chat': MessageSerializer(curator_messages.all(), many=True).data,
                'user_id': request.user.id,
                'unv_msg_client': client_unviewed_message,
                'unv_msg_curator': curator_unviewed_message
            },
            safe=False
        )
    except Exception as ex:
        log_error(ex)
        return JsonResponse({'error': 'not found'}, status=404)
