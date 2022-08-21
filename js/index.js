
    //1) --------------------------------------вывод ip и города------------------------------------------

    //получение ip и city
    function getUserCityIP() {
        return new Promise((resolve, reject) => {
          fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(({ ip }) => {
              fetch(
                `https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=${ip}&token=ВАШ_КЛЮЧ_ДАДАТА`
              )
                .then(res => res.json())
                .then(json => {
                  if (
                    {}.hasOwnProperty.call(json, 'family') &&
                    json.family.toLowerCase().indexOf('err')
                  ) {
                    return reject(json);
                  }
                  const {
                    location: {
                      data: { city },
                    },
                  } = json;
                  resolve({ city, ip });
                  return city;
                });
            });
        });
      }

      //оболочка для вставление форм
      const base = document.querySelector('.main-form');

      //создание форм и вывод
      getUserCityIP()
        .then(({ city, ip }) => {
        
          const inputIp = document.createElement('input');
          inputIp.id = 'ip';
          inputIp.type = 'text';
          inputIp.value = `${ip}`;
          inputIp.readOnly = 'readonly';
          base.prepend(inputIp);    

          const inputCity = document.createElement('input');
          inputCity.id = 'ip';
          inputCity.type = 'text';
          inputCity.value = `${city}`;
          inputCity.readOnly = 'readonly';
          base.prepend(inputCity);
    
          console.log(city, ip);
        })
        .catch(err => {
          console.log(err);
        });


//2) ------------------------------------Фильтр-----------------------
const form = document.getElementById('main');

function getForms(event) {
    event.preventDefault();

    const name = form.querySelector('[name="main"]');

    const values = {
        name: name.value
    };

    console.log(values.name);

    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    var token = "1ebce376c2047bbc83a267ad4a70a81401c901a7";
    var query = values.name;

    var options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token
        },
        body: JSON.stringify({query: query})
    };

    fetch(url, options)
    .then(response => response.text())
    .then(result => 
        //4) При изменении текста в поле-фильтре должен формироваться новый запрос с отображением нового списка
        {
            let key;
            let content = JSON.parse(result);
            console.log(content);
            let list = document.querySelector('.list');

            let listLi = document.querySelectorAll('li');
            if (!listLi) {
                for (key in content.suggestions) {
                    list.innerHTML += `<li>${content.suggestions[key].value}</li>`;
                }
            } else {
                listLi.forEach(el => {
                    el.remove();
                });
            }

            for (key in content.suggestions) {
                    list.innerHTML += `<li>${content.suggestions[key].value}</li>`;
                }
            
        }    
        )
    .catch(error => console.log("error", error));
    
}

//3 подтверждает завершение ввода (например, нажатием кнопки Enter), то формируется запрос к dadata.ru с указанием города и части названия улицы
form.addEventListener('submit',getForms);
