from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path, re_path
from django.core.asgi import get_asgi_application

from keysystems_web.consumers import ChatConsumer


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/chat/<str:room_name>/", ChatConsumer.as_asgi()),
        ])
    ),
})


websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
]
