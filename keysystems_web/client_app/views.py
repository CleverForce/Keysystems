from django.shortcuts import render, redirect
from django.http.request import HttpRequest
from django.core.files.storage import FileSystemStorage
from django.core.serializers import serialize
from datetime import datetime

import os
import json

from keysystems_web.settings import FILE_STORAGE
from .forms import OrderForm
from .models import News, FAQ, UpdateSoft, UpdateSoftFiles
from . import client_utils as utils
from common.models import OrderTopic, Notice, Order, Soft
from common.serializers import OrderSerializer
import common as ut
from enums import RequestMethod, OrderStatus, notices_dict


# удалить аналог 2_2
def index_3_2(request: HttpRequest):
    context = {}
    return render(request, 'index_3_2.html', context)

'''
'type_appeal': ['1'], 
'type_soft': ['1'], 
'description': ['уаккав'], 
'addfile': ['Снимок экрана 2024-05-25 162508.png']}>
'''


# страничка с новостями
def index_4_1(request: HttpRequest):
    if request.method == RequestMethod.POST:
        # ut.log_error(request.POST, wt=False)
        order_form = OrderForm(request.POST, request.FILES)
        ut.log_error(f'>>>> {order_form.data}', wt=False)
        if order_form.is_valid():
            utils.order_form_processing(request=request, form=order_form)
            return redirect('redirect')

    news = News.objects.filter(is_active=True).order_by('-created_at').all()
    news_json = serialize(format='json', queryset=news)

    news_data = json.loads(news_json)

    for item in news_data:
        created_at = item['fields']['created_at']
        created_at_date = datetime.fromisoformat(created_at)  # Преобразуем строку в объект datetime
        item['fields']['day'] = created_at_date.day
        item['fields']['month'] = ut.months_str_ru.get(created_at_date.month, '')
        item['fields']['year'] = created_at_date.year
        # ut.log_error(item, wt=False)

    news_json = json.dumps(news_data)  # Преобразуем обратно в JSON

    client_data = utils.get_main_client_front_data(request)
    context = {
        **client_data,
        'news': news_json,
    }
    return render(request, 'index_4_1.html', context)


def index_4_2(request: HttpRequest):
    # if not main_news:
    #     return redirect('redirect')

    news_id = request.GET.get('news', 1)
    main_news = News.objects.get(pk=int(news_id))
    news_json = serialize(format='json', queryset=[main_news])
    news_data = json.loads(news_json)

    created_at = news_data[0]['fields']['created_at']
    created_at_date = datetime.fromisoformat(created_at)  # Преобразуем строку в объект datetime
    news_data[0]['fields']['day'] = created_at_date.day
    news_data[0]['fields']['month'] = ut.months_str_ru.get(created_at_date.month, '')
    news_data[0]['fields']['year'] = created_at_date.year

    news_json = json.dumps(news_data[0])

    # Получение предыдущей записи того же типа
    previous_news = News.objects.filter(
        created_at__lt=main_news.created_at
    ).order_by('-created_at').first()

    # Получение следующей записи того же типа
    next_news = News.objects.filter(
        created_at__gt=main_news.created_at
    ).order_by('created_at').first()

    client_data = utils.get_main_client_front_data(request)
    context = {
        **client_data,
        # 'news': serialize(format='json', queryset=[main_news]),
        'news': news_json,
        'news_raw': main_news,
        'previous_news': previous_news.id if previous_news else 0,
        'next_news': next_news.id if next_news else 0,
    }
    return render(request, 'index_4_2.html', context)


def index_5_1(request: HttpRequest):
    orders = Order.objects.select_related('soft', 'topic', 'from_user', 'executor', 'customer').order_by('-created_at')

    new_orders = orders.filter(status=OrderStatus.NEW).all()
    active_orders = orders.filter(status=OrderStatus.ACTIVE).all()
    done_orders = orders.filter(status=OrderStatus.DONE).all()

    new_orders_ser = OrderSerializer(new_orders, many=True)
    active_orders_ser = OrderSerializer(active_orders, many=True)
    done_orders_ser = OrderSerializer(done_orders, many=True)

    client_data = utils.get_main_client_front_data(request)
    context = {
        **client_data,
        # 'new_orders': serialize(format='json', queryset=new_orders),
        # 'active_orders': serialize(format='json', queryset=active_orders),
        # 'done_orders': serialize(format='json', queryset=done_orders),
        'new_orders': json.dumps(new_orders_ser.data),
        'active_orders': json.dumps(active_orders_ser.data),
        'done_orders': json.dumps(done_orders_ser.data),
    }
    return render(request, 'index_5_1.html', context)


def index_6(request: HttpRequest):
    # notices = Notice.objects.filter(user_ks=request.user).order_by('-created_at').all()
    notices = Notice.objects.filter().order_by('-created_at').all()

    notice_list = []
    for notice in notices:
        text: str = notices_dict.get(notice.type_notice)
        if text:
            notice_list.append(
                {
                    'order_id': notice.order.id,
                    'num_push': notice.id,
                    'date': ut.get_data_string(notice.created_at),
                    'text': text.format(pk=notice.id)
                }
            )

    client_data = utils.get_main_client_front_data(request)
    context = {
        **client_data,
        'notices': json.dumps(notice_list)
    }
    return render(request, 'index_6.html', context)


def index_7_1(request: HttpRequest):
    # updates = UpdateSoft.objects.select_related('soft').prefetch_related('files').filter(is_active=True).order_by('-created_at').all()
    updates = UpdateSoft.objects.select_related('soft').filter(is_active=True).order_by('-created_at').all()

    # tst =OrderSerializer(updates)

    updates_json = []
    for update in updates:
        files = UpdateSoftFiles.objects.filter(update_soft=update.pk).all()
        update_files = []
        for file in files:
            update_files.append({'url': f'..{file.file.url}', 'name': file.file.name})
            # update_files.append(file.file.value)

        updates_json.append(
            {
                'pk': update.pk,
                'date': ut.get_data_string(update.created_at),
                'soft': update.soft.title,
                'description': update.description,
                'update_files': update_files
            }
        )
        ut.log_error(updates_json, wt=False)

    client_data = utils.get_main_client_front_data(request)
    context = {
        **client_data,
        'update_json': json.dumps(updates_json)
    }
    return render(request, 'index_7_1.html', context)


def index_7_2(request: HttpRequest):
    update_id = request.GET.get('update', 1)
    update = UpdateSoft.objects.select_related('soft').filter(id=int(update_id)).order_by('-created_at').first()

    files = UpdateSoftFiles.objects.filter(update_soft=update.pk).all()
    update_files = []
    for file in files:
        file_name = file.file.name.split('/')[-1]
        file_type = file_name[-3:] if file_name[-3:] in ut.upload_file_type else 'file'
        update_files.append({
            'url': f'..{file.file.url}',
            'name': file_name,
            'size': ut.get_size_file_str(file.file_size),
            'icon': f"../{os.path.join('static', 'site', 'img', 'files', f'{file_type}.svg')}",
            # 'icon': f'..\static\site\img\files\{file_name[-3:]}.svg'
        })

    update_json = {
        'date': ut.get_data_string(update.created_at),
        'soft': update.soft.title,
        'description': update.description,
        'update_files': update_files
        }

    ut.log_dict(update_json)
    client_data = utils.get_main_client_front_data(request)
    context = {
        **client_data,
        'update_json': json.dumps(update_json)
    }
    return render(request, 'index_7_2.html', context)


def index_8(request: HttpRequest):
    faq = FAQ.objects.filter(is_active=True).order_by('-created_at').all()

    client_data = utils.get_main_client_front_data(request)
    context = {
        **client_data,
        'faq': serialize(format='json', queryset=faq)
    }
    return render(request, 'index_8.html', context)
