console.log('cur_main_5_3.js')

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);

    // document.querySelectorAll('.modal_link_cards').forEach(link => {
    //     link.addEventListener('click', function(event) {
    //         const orderId = this.getAttribute('data-order-id');
    //         const modalContent = document.querySelector('#statusOrder .modal-content');
    //     });
    // });
});

let modalApplicationStatus = document.createElement('div')
// modalApplicationStatus.setAttribute('id', new_orders[i]['id'])
modalApplicationStatus.setAttribute('id', 'statusOrder')
modalApplicationStatus.classList.add('modal')

let modalApplicationStatusContent = document.createElement('div')
modalApplicationStatusContent.classList.add('modal-content')
modalApplicationStatus.appendChild(modalApplicationStatusContent)

// let modASClose = btnClose()
// modalApplicationStatusContent.appendChild(modASClose)

document.body.append(modalApplicationStatus)
console.log('должно создатьс модальное окно')

{/* <img src="/static/site/img/close-large.svg" alt=""> */}
// обработчик событий данные с бэка
document.querySelectorAll('.modal_cr_order').forEach(link => {
    // console.log('должно создатьс модальное окно!!')

    link.addEventListener('click', function () {
        let orderId = this.getAttribute('data-order-id');
        // console.log('должно создатьс модальное окно!!')
        // Здесь делаем запрос на бэк с использованием Fetch API
        fetch(`/order-data/${orderId}`)
            .then(response => response.json())
            .then(data => {
                // Заполняем модальное окно данными из `data`
                modalApplicationStatusContent.innerHTML = `
                    <div class="modal1_img modal-close">
                        
                        <img src="${imgLink}" alt="">
                    </div>
                    <h4>${data.customer.title}</h4>
                    <p>${data.status}</p>
                    <ul class="tabs">
                        <li class="tab"><a href="#tab1">Описание</a></li>
                        <li class="tab">
                            <a href="#tab2">
                                <p class="order_tab">Комментарии</p>

                            </a>
                        </li>
                        <li class="tab">
                            <a href="#tab3">
                                <p class="order_tab">Чат кураторов</p>
                                    
                            </a>
                        </li>
                    </ul>

                    <div id="tab1" class="tab-content active">
                        <h6 class="title_in_modal">Тема</h6>
                        <p class="text_in_modal">${data.topic.topic}</p>
                        <form action="" method="post">
                            <p>
                                <label for="soft_in_chat">Програмное обеспечение</label>
                                <select name="soft_in_chat" id="soft_in_chat">
                                </select>
                            </p>
                        </form>
                        <h6 class="title_in_modal">Описание</h6>
                        <p class="text_in_modal">${data.text}</p>
                        <div class="files_in_modal"></div>
                        <h6 class="title_in_modal">Исполнители</h6>
                        <div class="curators_of_request"></div>
                        

                    </div>

                    <div id="tab2" class="tab-content">
                        <p>Customer Name: ${data.customer_name}</p>
                        <p>Address: ${data.customer_address}</p>
                    </div>

                    <div id="tab3" class="tab-content">
                        <p>Status: ${data.status}</p>
                    </div>
                `;
                console.log(data)

                // Инициализация вкладок Materialize
                let tabs = document.querySelectorAll('.tabs');
                M.Tabs.init(tabs);

                // Открываем модальное окно
                M.Modal.getInstance(modalApplicationStatus).open();
            })
            .catch(error => console.error('Error:', error));
    });
});

// document.addEventListener('DOMContentLoaded', function () {
//     var elems = document.querySelectorAll('.modal');
//     var instances = M.Modal.init(elems);

//     document.querySelectorAll('.modal_link_cards').forEach(link => {
//         link.addEventListener('click', function(event) {
//             const orderId = this.getAttribute('data-order-id');
//             const modalContent = document.querySelector('#statusOrder .modal-content');
//         });
//     });
// });

// document.querySelectorAll('.modal_link_cards').forEach(link => {
//     link.addEventListener('click', function(event) {
//         const orderId = this.getAttribute('data-order-id');
//         const modalContent = document.querySelector('#statusOrder .modal-content');
        
//         // Пример использования orderId для запроса данных с сервера или изменения контента
//         modalContent.innerHTML = `ID заказа: ${orderId}`;
//     });
// });





