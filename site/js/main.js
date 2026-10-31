(function () {
  'use strict';
  var machines = [
    { name: 'JCB 4CX', price: 2800, min: 4 },
    { name: 'JCB 3CX', price: 2800, min: 5 },
    { name: 'МТЗ-82.1', price: 2500, min: 4 },
    { name: 'JCB JS160W', price: 3000, min: 8 }
  ];
  var form = document.getElementById('calculator');
  var machine = document.getElementById('machine');
  var hours = document.getElementById('hours');
  var task = document.getElementById('task');
  var details = document.getElementById('details');
  var total = document.getElementById('total');
  var minimum = document.getElementById('minimum');
  var request = document.getElementById('request');
  var message = document.getElementById('message');
  var status = document.getElementById('copy-status');
  var money = new Intl.NumberFormat('ru-RU');
  function selected() { return machines[Number(machine.value)]; }
  function update() {
    var item = selected();
    hours.min = item ? item.min : 1;
    minimum.textContent = item ? 'Минимальный заказ: ' + item.min + ' ч. Расчёт учитывает этот минимум.' : 'Минимальный заказ зависит от выбранной машины.';
    var duration = Number(hours.value);
    total.textContent = item && duration > 0 && duration <= 240 && Number.isInteger(duration) ? 'от ' + money.format(item.price * Math.max(item.min, duration)) + ' ₽' : item ? 'Укажите часы' : 'По задаче';
    request.hidden = true;
    status.textContent = '';
  }
  machine.addEventListener('change', function () {
    var item = selected();
    if (item) hours.value = Math.max(item.min, Number(hours.value) || item.min);
    update();
  });
  hours.addEventListener('input', update);
  task.addEventListener('change', update);
  details.addEventListener('input', function () { request.hidden = true; });
  document.querySelectorAll('[data-machine], [data-task]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (link.hasAttribute('data-machine')) {
        machine.value = link.dataset.machine;
        hours.value = selected().min;
        task.value = Number(machine.value) === 2 ? 'Уборка снега' : 'Земляные работы';
      } else {
        machine.value = '-1';
        task.value = link.dataset.task;
      }
      update();
    });
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var item = selected();
    var lines = ['Здравствуйте, Виталий! Хочу обсудить заказ.', 'Задача: ' + task.value + '.'];
    if (item) {
      lines.push('Техника: ' + item.name + ', ' + hours.value + ' ч.');
      lines.push('Ориентир на сайте: ' + total.textContent + ' за работу (без согласования подачи и дополнительных услуг).');
    } else { lines.push('Нужна помощь с подбором техники или расчётом материалов.'); }
    if (details.value.trim()) lines.push('Объект и пожелания: ' + details.value.trim());
    lines.push('Подскажите доступность, итоговую стоимость, что входит в цену и условия подачи.');
    message.value = lines.join('\n');
    request.hidden = false;
    message.focus();
  });
  document.getElementById('copy').addEventListener('click', async function () {
    try {
      await navigator.clipboard.writeText(message.value);
      status.textContent = 'Текст скопирован. Откройте Авито и отправьте его продавцу.';
    } catch (error) {
      message.focus();
      message.select();
      status.textContent = 'Выделили текст. Скопируйте его вручную и отправьте на Авито.';
    }
  });
  update();
})();
