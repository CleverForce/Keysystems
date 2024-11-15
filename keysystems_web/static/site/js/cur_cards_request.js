// console.log(card_orders)

function createOrderCard(order) {
    // console.log(order)
    let modalLinkCard = document.createElement('a')
    modalLinkCard.classList.add('modal_link_cards')
    modalLinkCard.classList.add('modal_cr_order')
    modalLinkCard.classList.add('modal-trigger')
    modalLinkCard.setAttribute('data-order-id', order['id'])
    modalLinkCard.setAttribute('href', '#statusOrder') // #statusOrder создается в cur_main_5_3.js

    let newOrder = document.createElement('div')
    newOrder.classList.add('card_order')

    let textNewOrder = document.createElement('p')
    textNewOrder.classList.add('textOfOrder')
    textNewOrder.innerHTML = order['text']
    newOrder.appendChild(textNewOrder)

    let softNewOrder = document.createElement('p')
    softNewOrder.classList.add('softOfOrder')
    softNewOrder.innerHTML = order['soft']
    newOrder.appendChild(softNewOrder)

    // исполнители только для cur_index_2_1
    if (userForOrder == 1) {
        let curatorOfOrder = document.createElement('div')
        curatorOfOrder.classList.add('curator_order_flex')
        newOrder.appendChild(curatorOfOrder)

        let curatorOfOrderImg = document.createElement('img')
        curatorOfOrderImg.setAttribute('src', curator_user_img)
        curatorOfOrder.appendChild(curatorOfOrderImg)

        let curatorOfOrderUser = document.createElement('p')
        curatorOfOrderUser.innerHTML = order['curators']
        curatorOfOrder.appendChild(curatorOfOrderUser)

        // регион тольок для cur_index_2_1
        let regionOfOrder = document.createElement('div')
        regionOfOrder.classList.add('region_order_flex')
        newOrder.appendChild(regionOfOrder)

        let regionOfOrderImg = document.createElement('img')
        regionOfOrderImg.setAttribute('src', region_user_img)
        regionOfOrder.appendChild(regionOfOrderImg)

        let regionOfOrderUser = document.createElement('p')
        // regionOfOrderUser.innerHTML = order['customer']['district']['title']
        regionOfOrderUser.innerHTML = 'н/д'
        regionOfOrder.appendChild(regionOfOrderUser)
    }


    // для всех
    let numOfOrder = document.createElement('p')
    numOfOrder.classList.add('numOfOrder')
    numOfOrder.innerHTML = order['id_str']
    newOrder.appendChild(numOfOrder)

    modalLinkCard.appendChild(newOrder)
    // newOrderFlex.appendChild(modalLinkCard)
    // console.log(modalLinkCard)
    return modalLinkCard
}

// Создать div_grid со всеми заявками

function createOrdersArea(card_orders_data) {
    // дескопт
    if (window.matchMedia('(min-width: 600px)').matches) {
        // проверяем есть ли контейнер для заявок и удаляем если есть
        let old_all_orders = document.getElementById('order_area_id')
        if (old_all_orders) {
            old_all_orders.remove()
        }

        let all_orders = document.createElement('div')
        all_orders.classList.add('page_body_orders')
        all_orders.id = 'order_area_id'
        // создать серку grid со всеми заявками
        document.querySelector('.page_flex_body').appendChild(all_orders)

        // колонка "Новые заявки"
        let groupOfNewOrders = document.createElement('div')
        groupOfNewOrders.classList.add('groups_orders')
        all_orders.appendChild(groupOfNewOrders)

        // Заголовок "Новые заявки"
        let headerOfNewOrders = document.createElement('div')
        headerOfNewOrders.classList.add('new_orders')
        headerOfNewOrders.classList.add('header_orders')
        groupOfNewOrders.appendChild(headerOfNewOrders)

        let titleOfNewOrders = document.createElement('h4')
        titleOfNewOrders.innerHTML = 'Задачи'
        headerOfNewOrders.appendChild(titleOfNewOrders)

        // let countOfNewOrders = document.createElement('p')
        // countOfNewOrders = 0
        // headerOfNewOrders.appendChild(countOfNewOrders)

        // карточки с заявками
        let newOrderFlex = document.createElement('div')
        newOrderFlex.classList.add('order_flex')
        groupOfNewOrders.appendChild(newOrderFlex)

        // for (let i = 0; i < new_orders.length; i++) {

        // }

        // колонка "В работе"
        let groupOfActiveOrders = document.createElement('div')
        groupOfActiveOrders.classList.add('groups_orders')
        all_orders.appendChild(groupOfActiveOrders)

        // Заголовок "В работе"
        let headerOfActiveOrders = document.createElement('div')
        headerOfActiveOrders.classList.add('active_orders')
        headerOfActiveOrders.classList.add('header_orders')
        groupOfActiveOrders.appendChild(headerOfActiveOrders)

        let titleOfActiveOrders = document.createElement('h4')
        titleOfActiveOrders.innerHTML = 'В работе'
        headerOfActiveOrders.appendChild(titleOfActiveOrders)

        // let countOfActiveOrders = document.createElement('p')
        // countOfActiveOrders.innerHTML = active_orders.length
        // headerOfActiveOrders.appendChild(countOfActiveOrders)

        // карточки с заявками
        let activeOrderFlex = document.createElement('div')
        activeOrderFlex.classList.add('order_flex')
        groupOfActiveOrders.appendChild(activeOrderFlex)

        // for (let i = 0; i < active_orders.length; i++) {

        // }

        // колонка "Выполнено"
        let groupOfDoneOrders = document.createElement('div')
        groupOfDoneOrders.classList.add('groups_orders')
        all_orders.appendChild(groupOfDoneOrders)

        // Заголовок "В работе"
        let headerOfDoneOrders = document.createElement('div')
        headerOfDoneOrders.classList.add('done_orders')
        headerOfDoneOrders.classList.add('header_orders')
        groupOfDoneOrders.appendChild(headerOfDoneOrders)

        let titleOfDoneOrders = document.createElement('h4')
        titleOfDoneOrders.innerHTML = 'Выполнено'
        headerOfDoneOrders.appendChild(titleOfDoneOrders)

        // let countOfDoneOrders = document.createElement('p')
        // countOfDoneOrders.innerHTML = done_orders.length
        // headerOfDoneOrders.appendChild(countOfDoneOrders)

        // карточки с заявками
        let doneOrderFlex = document.createElement('div')
        doneOrderFlex.classList.add('order_flex')
        groupOfDoneOrders.appendChild(doneOrderFlex)

        // console.log('card_orders_data')
        // console.log(card_orders_data)

        for (let i = 0; i < card_orders_data.length; i++) {
            let card = createOrderCard(card_orders_data[i])

            if (card_orders_data[i]['status'] == 'new') {
                newOrderFlex.appendChild(card)

            }
            if (card_orders_data[i]['status'] == 'active') {
                activeOrderFlex.appendChild(card)
            }
            if (card_orders_data[i]['status'] == 'done') {
                doneOrderFlex.appendChild(card)
            }
        }

        // количество заявок по группам
        let countOfNewOrders = document.createElement('p')
        countOfNewOrders.classList.add('count_orders')
        let quantityNewOrders = newOrderFlex.querySelectorAll('.modal_cr_order').length
        countOfNewOrders.innerHTML = quantityNewOrders
        headerOfNewOrders.appendChild(countOfNewOrders)

        let countOfActiveOrders = document.createElement('p')
        countOfActiveOrders.classList.add('count_orders')
        let quantityActiveOrders = activeOrderFlex.querySelectorAll('.modal_cr_order').length
        countOfActiveOrders.innerHTML = quantityActiveOrders
        headerOfActiveOrders.appendChild(countOfActiveOrders)

        let countOfDoneOrders = document.createElement('p')
        countOfDoneOrders.classList.add('count_orders')
        let quantityDoneOrders = doneOrderFlex.querySelectorAll('.modal_cr_order').length
        countOfDoneOrders.innerHTML = quantityDoneOrders
        headerOfDoneOrders.appendChild(countOfDoneOrders)

        let testTrigger = document.querySelectorAll('.modal_cr_order')
        // console.log('testTrigger.length')
        // console.log(testTrigger.length)
        // обработчик событий данные с бэка
        document.querySelectorAll('.modal_cr_order').forEach(link => {
            link.addEventListener('click', function () {
                // console.log('Создал тригер')
                // console.log(this)
                let orderId = this.getAttribute('data-order-id');

                // Здесь делаем запрос на бэк с использованием Fetch API
                craeteOrderModal(orderId)

            });

        });

    }
    // мобилка
    else {
        document.addEventListener('DOMContentLoaded', function () {
            // Находим элемент с классом .tabs
            let tabsElement = document.querySelector('.tabs');

            // Инициализируем вкладки только если элемент tabsElement существует
            if (tabsElement) {
                let tabsInstance = M.Tabs.init(tabsElement);
            }


            // let tabsElement = document.querySelector('.tabs');
            // let tabsInstance = M.Tabs.init(tabsElement);


            let mobNewOrders = document.createElement('div')
            mobNewOrders.classList.add('mob_orders_grid')
            document.querySelector('#tab1_mob').appendChild(mobNewOrders)

            let mobActiveOrders = document.createElement('div')
            mobActiveOrders.classList.add('mob_orders_grid')
            document.querySelector('#tab2_mob').appendChild(mobActiveOrders)

            let mobDoneOrders = document.createElement('div')
            mobDoneOrders.classList.add('mob_orders_grid')
            document.querySelector('#tab3_mob').appendChild(mobDoneOrders)

            // карточки с заявками
            for (let i = 0; i < card_orders_data.length; i++) {
                let mobCard = createOrderCard(card_orders_data[i])

                if (card_orders_data[i]['status'] == 'new') {
                    mobNewOrders.appendChild(mobCard)
                }
                if (card_orders_data[i]['status'] == 'active') {
                    mobActiveOrders.appendChild(mobCard)
                }
                if (card_orders_data[i]['status'] == 'done') {
                    mobDoneOrders.appendChild(mobCard)
                }
            }
            // let testTrigger = document.querySelectorAll('.modal_cr_order')
            // console.log('testTrigger.length')
            // console.log(testTrigger.length)
            // обработчик событий данные с бэка
            document.querySelectorAll('.modal_cr_order').forEach(link => {
                link.addEventListener('click', function () {
                    console.log('Создал тригер')
                    console.log(this)
                    let orderId = this.getAttribute('data-order-id');

                    // Здесь делаем запрос на бэк с использованием Fetch API
                    craeteOrderModal(orderId)

                });

            });

        })
    }

    // let testTrigger = document.querySelectorAll('.modal_cr_order')
    // console.log('testTrigger.length')
    // console.log(testTrigger.length)
    // // обработчик событий данные с бэка
    // document.querySelectorAll('.modal_cr_order').forEach(link => {
    //     link.addEventListener('click', function () {
    //         console.log('Создал тригер')
    //         console.log(this)
    //         let orderId = this.getAttribute('data-order-id');

    //         // Здесь делаем запрос на бэк с использованием Fetch API
    //         craeteOrderModal(orderId)

    //     });

    // });

}

createOrdersArea(card_orders)
